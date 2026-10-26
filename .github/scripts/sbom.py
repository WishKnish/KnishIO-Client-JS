#!/usr/bin/env python3
"""Assemble one repository's CycloneDX SBOM.

Master copy: scripts/sbom/sbom.py in the KnishIOClientSDK monorepo. Each SDK repo carries a
byte-identical copy at .github/scripts/sbom.py (the validator at scripts/sbom.py);
scripts/audit-all.sh fails when a copy drifts.

    python3 sbom.py --name SLUG --version VER --type {library,application}
                    [--base FILE]... [--components FILE] [--spec 1.5] --out DIR

Run from the repository root. Bases are generator outputs (npm sbom, cyclonedx-py, the
composer plugin, cargo-cyclonedx). --components is a committed fragment listing what no
generator sees (submodules, vendored sources, pinned release packages, system libraries).
Fragment components may carry control properties, which are checked and then removed:

    knishio:pins=<file>              expand a {version, url, targets:{t:{sha256}}} pin file
                                     into one distribution reference per target
    knishio:verify:submodule=<path>  the gitlink at <path> must equal knishio:commit
    knishio:verify:contains=<file>   <file> must contain the version and every listed hash
    knishio:verify:file-sha256=<f>   sha256(<f>) must be one of the component's hashes

Writes <out>/<slug>-<ver>.cdx.json, <out>/<slug>-<ver>.osv-commits.json when a component
names a commit and a vcs url, and <out>/paths.env. Prints "SBOM ok ..." or
"SBOM FAIL <reason>" (stderr, exit 1).
"""
import argparse
import copy
import datetime
import hashlib
import json
import os
import subprocess
import sys
import urllib.parse
import uuid
from pathlib import Path

TOOL = {"type": "application", "name": "knishio-sbom", "version": "1"}
CONTROL_PREFIXES = ("knishio:pins", "knishio:verify:")


class Fail(Exception):
    pass


def run_git(*args):
    try:
        return subprocess.run(["git", *args], check=True, capture_output=True, text=True).stdout
    except (OSError, subprocess.CalledProcessError) as e:
        raise Fail(f"git {' '.join(args)} failed: {getattr(e, 'stderr', '') or e}".strip())


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, ValueError) as e:
        raise Fail(f"cannot read {path}: {e}")


def prop(component, name):
    for p in component.get("properties", []):
        if p.get("name") == name:
            return p.get("value")
    return None


def all_hashes(component):
    out = [h["content"] for h in component.get("hashes", []) if "content" in h]
    for ref in component.get("externalReferences", []):
        out += [h["content"] for h in ref.get("hashes", []) if "content" in h]
    return out


def apply_controls(c):
    name = c.get("name", "?")
    pins = prop(c, "knishio:pins")
    if pins:
        data = load_json(pins)
        if "version" not in c:
            c["version"] = data["version"]
        elif c["version"] != data["version"]:
            raise Fail(f"{name}: version {c['version']} but {pins} pins {data['version']}")
        refs = c.setdefault("externalReferences", [])
        for target in sorted(data["targets"]):
            refs.append({
                "type": "distribution",
                "url": data["url"].format(version=data["version"], target=target),
                "hashes": [{"alg": "SHA-256", "content": data["targets"][target]["sha256"]}],
            })

    sub = prop(c, "knishio:verify:submodule")
    if sub:
        line = run_git("ls-tree", "HEAD", "--", sub).split()
        if len(line) < 3 or line[0] != "160000":
            raise Fail(f"{name}: {sub} is not a submodule gitlink at HEAD")
        want = prop(c, "knishio:commit")
        if line[2] != want:
            raise Fail(f"{name}: submodule {sub} is at {line[2]}, components file says {want}")

    contains = prop(c, "knishio:verify:contains")
    if contains:
        try:
            text = Path(contains).read_text(encoding="utf-8")
        except OSError as e:
            raise Fail(f"{name}: cannot read {contains}: {e}")
        needles = ([c["version"]] if c.get("version") else []) + all_hashes(c)
        missing = [n for n in needles if n not in text]
        if missing:
            raise Fail(f"{name}: {contains} does not contain {', '.join(missing)}")

    sha_file = prop(c, "knishio:verify:file-sha256")
    if sha_file:
        try:
            digest = hashlib.sha256(Path(sha_file).read_bytes()).hexdigest()
        except OSError as e:
            raise Fail(f"{name}: cannot read {sha_file}: {e}")
        listed = [h.get("content") for h in c.get("hashes", []) if h.get("alg") == "SHA-256"]
        if digest not in listed:
            raise Fail(f"{name}: sha256({sha_file}) is {digest}, components file lists {listed}")

    props = [p for p in c.get("properties", []) if not p.get("name", "").startswith(CONTROL_PREFIXES)]
    if props:
        c["properties"] = props
    else:
        c.pop("properties", None)
    c.setdefault("bom-ref", f"{name}@{c.get('version', 'unversioned')}")
    return c


def scrub_purl(purl):
    """Drop qualifiers whose (decoded) value is a file: URL."""
    head, hash_sep, subpath = purl.partition("#")
    base, q_sep, query = head.partition("?")
    if not q_sep:
        return purl
    kept = [kv for kv in query.split("&")
            if not urllib.parse.unquote(kv.partition("=")[2]).startswith("file:")]
    out = base + ("?" + "&".join(kept) if kept else "")
    return out + (hash_sep + subpath if hash_sep else "")


def scrub_ref(ref, repo_root):
    """cargo-cyclonedx uses cargo package IDs as bom-refs; a local crate's is
    path+file://<absolute dir>#name@ver. Make the directory repo-relative."""
    if not ref.startswith("path+file://"):
        return ref
    path, sep, tail = ref[len("path+file://"):].partition("#")
    return f"path+{os.path.relpath(urllib.parse.unquote(path), repo_root)}{sep}{tail}"


def scrub_components(components, remap, repo_root):
    for c in components:
        old = c.get("purl")
        if old:
            new = scrub_purl(old)
            if new != old:
                c["purl"] = new
                if c.get("bom-ref") == old:
                    c["bom-ref"] = new
                    remap[old] = new
        ref = c.get("bom-ref")
        if ref:
            new_ref = scrub_ref(ref, repo_root)
            if new_ref != ref:
                c["bom-ref"] = new_ref
                remap[ref] = new_ref
        scrub_components(c.get("components", []), remap, repo_root)


def tools_of(bom):
    tools = bom.get("metadata", {}).get("tools")
    if isinstance(tools, dict):
        return list(tools.get("components", []))
    if isinstance(tools, list):
        return [{"type": "application", "name": t.get("name"), "version": t.get("version")}
                for t in tools if t.get("name")]
    return []


def timestamp():
    epoch = os.environ.get("SOURCE_DATE_EPOCH") or run_git("log", "-1", "--format=%ct", "HEAD").strip()
    try:
        moment = datetime.datetime.fromtimestamp(int(epoch), tz=datetime.timezone.utc)
    except ValueError:
        raise Fail(f"bad timestamp epoch {epoch!r}")
    return moment.strftime("%Y-%m-%dT%H:%M:%SZ")


def canonical(obj):
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def osv_name(url):
    parsed = urllib.parse.urlparse(url)
    path = parsed.path[:-4] if parsed.path.endswith(".git") else parsed.path
    return parsed.netloc + path.rstrip("/")


def build(args):
    repo_root = run_git("rev-parse", "--show-toplevel").strip()
    bases = []
    for path in args.base:
        bom = load_json(path)
        if bom.get("bomFormat") != "CycloneDX" or bom.get("specVersion") != args.spec:
            raise Fail(f"base {path}: specVersion {bom.get('specVersion')}, expected {args.spec}")
        bases.append(bom)

    meta0 = bases[0].get("metadata", {}).get("component") if bases else None
    if meta0 and meta0.get("name") and meta0.get("version"):
        root = copy.deepcopy(meta0)
        if root["version"] != args.version:
            raise Fail(f"base root version {root['version']} != {args.version}")
    else:
        root = {"type": args.type, "name": args.name, "version": args.version}
    root.setdefault("bom-ref", f"{args.name}@{args.version}")

    components, dependencies, root_edges = [], [], []
    tools = []
    for i, bom in enumerate(bases):
        components += copy.deepcopy(bom.get("components", []))
        dependencies += copy.deepcopy(bom.get("dependencies", []))
        tools += tools_of(bom)
        sub_root = bom.get("metadata", {}).get("component")
        if i >= 1 and sub_root:
            sub_root = copy.deepcopy(sub_root)
            sub_root.setdefault("type", "library")
            sub_root.setdefault("bom-ref", f"{sub_root.get('name')}@{sub_root.get('version', 'unversioned')}")
            components.append(sub_root)
            root_edges.append(sub_root["bom-ref"])

    commits = []
    if args.components:
        for c in load_json(args.components).get("components", []):
            c = apply_controls(copy.deepcopy(c))
            components.append(c)
            root_edges.append(c["bom-ref"])
            commit = prop(c, "knishio:commit")
            vcs = next((r["url"] for r in c.get("externalReferences", []) if r.get("type") == "vcs"), None)
            if commit and vcs:
                commits.append({"package": {"name": osv_name(vcs), "commit": commit}})

    remap = {}
    scrub_components([root], remap, repo_root)
    scrub_components(components, remap, repo_root)

    seen, unique = set(), []
    for c in components:
        if c["bom-ref"] in seen or c["bom-ref"] == root["bom-ref"]:
            continue
        seen.add(c["bom-ref"])
        unique.append(c)

    merged = {}
    for d in dependencies + [{"ref": root["bom-ref"], "dependsOn": root_edges}]:
        ref = remap.get(d.get("ref"), d.get("ref"))
        merged.setdefault(ref, set()).update(remap.get(x, x) for x in d.get("dependsOn", []))
    deps = [{"ref": r, "dependsOn": sorted(on)} for r, on in sorted(merged.items())]
    unique.sort(key=lambda c: c["bom-ref"])

    tool_set, tool_list = set(), []
    for t in tools + [TOOL]:
        key = (t.get("name"), t.get("version"))
        if key not in tool_set:
            tool_set.add(key)
            tool_list.append(t)

    digest = hashlib.sha256(canonical({"root": root, "components": unique, "dependencies": deps}).encode()).hexdigest()
    doc = {
        "bomFormat": "CycloneDX",
        "specVersion": args.spec,
        "serialNumber": "urn:uuid:" + str(uuid.uuid5(uuid.NAMESPACE_URL, "knishio-sbom:" + digest)),
        "version": 1,
        "metadata": {"timestamp": timestamp(), "tools": {"components": tool_list}, "component": root},
        "components": unique,
        "dependencies": deps,
    }
    text = json.dumps(doc, indent=2, ensure_ascii=False) + "\n"

    needles = ["file://", repo_root, urllib.parse.quote(repo_root, safe="")]
    home = os.path.expanduser("~")
    if home and home != "/":
        needles += [home, urllib.parse.quote(home, safe="")]
    for needle in needles:
        if needle and needle in text:
            raise Fail(f"leaks a local path: {needle}")

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    stem = f"{args.name}-{args.version}"
    sbom_file = out / f"{stem}.cdx.json"
    sbom_file.write_text(text, encoding="utf-8")
    env = [f"SBOM_FILE={sbom_file}"]
    if commits:
        commits_file = out / f"{stem}.osv-commits.json"
        commits_file.write_text(json.dumps({"results": [{"packages": commits}]}, indent=2) + "\n", encoding="utf-8")
        env.append(f"OSV_COMMITS_FILE={commits_file}")
    (out / "paths.env").write_text("\n".join(env) + "\n", encoding="utf-8")
    print(f"SBOM ok {sbom_file} components={len(unique)} commits={len(commits)}")


def main(argv=None):
    ap = argparse.ArgumentParser(description="Assemble one repository's CycloneDX SBOM.")
    ap.add_argument("--name", required=True)
    ap.add_argument("--version", required=True)
    ap.add_argument("--type", required=True, choices=["library", "application"])
    ap.add_argument("--base", action="append", default=[])
    ap.add_argument("--components")
    ap.add_argument("--spec", default="1.5")
    ap.add_argument("--out", required=True)
    args = ap.parse_args(argv)
    try:
        build(args)
    except Fail as e:
        print(f"SBOM FAIL {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
