var zt = Object.defineProperty;
var Jt = (o, e, t) => e in o ? zt(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var F = (o, e, t) => Jt(o, typeof e != "symbol" ? e + "" : e, t);
import L from "jssha";
import { gql as E, cacheExchange as Gt, fetchExchange as Xt, subscriptionExchange as Zt, createClient as Yt } from "@urql/core";
import { createClient as en } from "graphql-ws";
import { pipe as tn, map as nn } from "wonka";
typeof self > "u" && (global.self = global);
class Mt {
  /**
   * Converts the given buffer to a string containing its hexadecimal representation.
   *
   * arr a Uint8Array buffer to convert.
   *
   * options an optional object with the following members:
   *     grouping this number of hex bytes are grouped together with spaces between groups. 0 means no grouping is applied. 0 if unspecified.
   *     rowlength the number of groups which make up a row. When 0, no splitting into rows occurs. 0 if unspecified.
   *     uppercase if true, the output will be in uppercase. true by default.
   *
   * return a hexadecimal string representing the buffer.
   *
   * @param {array|ArrayBuffer|Uint8Array} arr
   * @param {object} options
   * @return {string}
   */
  static toHex(e, t) {
    const n = (c, u) => {
      const l = u ? ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"] : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
      return l[Math.floor(c / 16)] + l[c % 16];
    }, s = Object.assign(
      {
        grouping: 0,
        rowlength: 0,
        uppercase: !1
      },
      t || {}
    );
    let r = "", i = 0, a = 0;
    for (let c = 0; c < e.length && (r += n(e[c], s.uppercase), c !== e.length - 1); ++c)
      s.grouping > 0 && ++i === s.grouping && (i = 0, s.rowlength > 0 && ++a === s.rowlength ? (a = 0, r += `
`) : r += " ");
    return r;
  }
  /**
   * Takes a string containing hexadecimal and returns the equivalent as a Uint8Array buffer.
   *
   * str The string to convert. Whitespace is ignored. If an odd number of characters are specified,
   * it will act as if preceeded with a leading 0; that is, "FFF" is equivalent to "0FFF".
   *
   * return a Uint8Array array.
   *
   * @param {string} str
   * @return {Uint8Array}
   */
  static toUint8Array(e) {
    let t = e.toLowerCase().replace(/\s/g, "");
    t.length % 2 === 1 && (t = `0${t}`);
    const n = new Uint8Array(Math.floor(t.length / 2));
    let s = -1;
    for (let r = 0; r < t.length; ++r) {
      const i = t[r], a = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"].indexOf(i);
      if (a === -1)
        throw Error("unexpected character");
      s === -1 ? s = 16 * a : (n[Math.floor(r / 2)] = s + a, s = -1);
    }
    return n;
  }
}
String.prototype.trim || (String.prototype.trim = function() {
  return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
});
String.prototype.toCamelCase || (String.prototype.toCamelCase = function() {
  return this.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (o, e) => e.toUpperCase());
});
String.prototype.toSnakeCase || (String.prototype.toSnakeCase = function() {
  return this.replace(/[A-Z]/g, (o) => `_${o.toLowerCase()}`);
});
function We(o, e) {
  const t = Math.ceil(o.length / e), n = [];
  for (let s = 0, r = 0; s < t; ++s, r += e)
    n[s] = o.substr(r, e);
  return n;
}
function Xe(o = 256, e = "abcdef0123456789") {
  let t = new Uint8Array(o);
  return t = crypto.getRandomValues(t), t = t.map((n) => e.charCodeAt(n % e.length)), String.fromCharCode.apply(null, t);
}
function sn(o, e, t, n, s) {
  if (n = n || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~`!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?¿¡", s = s || n, e > n.length || t > s.length)
    return console.warn("Strings::charsetBaseConvert() - Can't convert", o, "to base", t, "greater than symbol table length. src-table:", n.length, "dest-table:", s.length), !1;
  let i = BigInt(0);
  for (let c = 0; c < o.length; c++)
    i = i * BigInt(e) + BigInt(n.indexOf(o.charAt(c)));
  let a = "";
  for (; i > 0; ) {
    const c = i % BigInt(t);
    a = s.charAt(Number(c)) + a, i /= BigInt(t);
  }
  return a || "0";
}
function rn(o) {
  return Mt.toHex(o, {});
}
function on(o) {
  return Mt.toUint8Array(o);
}
function an(o) {
  const e = on(o);
  return btoa(String.fromCharCode.apply(null, e));
}
function ln(o) {
  const e = new Uint8Array(atob(o).split("").map((t) => t.charCodeAt(0)));
  return rn(e);
}
function Fe(o) {
  return /^[A-F0-9]+$/i.test(o);
}
function cn(o) {
  return (typeof o == "number" || typeof o == "string" && o.trim() !== "") && !isNaN(o);
}
let he = class {
  /**
   * Normalizes the meta array into the standard {key: ..., value: ...} format
   *
   * @param {array|object} meta
   * @return {array}
   */
  static normalizeMeta(e) {
    if (Array.isArray(e))
      return e.map((n) => ({
        key: n.key,
        value: n.value == null ? null : String(n.value)
      }));
    const t = [];
    for (const n in e)
      if (Object.prototype.hasOwnProperty.call(e, n)) {
        const s = e[n];
        t.push({ key: n, value: s == null ? null : String(s) });
      }
    return t;
  }
  /**
   * Condenses metadata array into object-based key: value notation
   *
   * @param {array|object} meta
   * @return {object}
   */
  static aggregateMeta(e) {
    let t = {};
    if (Array.isArray(e))
      for (const n of e)
        t[n.key] = n.value;
    else
      t = e;
    return t;
  }
};
function un(...o) {
  return [].concat(...o.map((e, t) => {
    const n = o.slice(0);
    n.splice(t, 1);
    const s = [...new Set([].concat(...n))];
    return e.filter((r) => !s.includes(r));
  }));
}
function pe(...o) {
  return o.reduce((e, t) => e.filter((n) => t.includes(n)));
}
class Ze {
  /**
   *
   * @param policy
   * @param metaKeys
   */
  constructor(e = {}, t = {}) {
    this.policy = Ze.normalizePolicy(e), this.fillDefault(t);
  }
  /**
   *
   * @param policy
   * @returns {{}}
   */
  static normalizePolicy(e = {}) {
    const t = {};
    for (const [n, s] of Object.entries(e))
      if (s !== null && ["read", "write"].includes(n)) {
        t[n] = {};
        for (const [r, i] of Object.entries(s))
          t[n][r] = i;
      }
    return t;
  }
  /**
   *
   */
  fillDefault(e = {}) {
    const t = Array.from(this.policy).filter((s) => s.action === "read"), n = Array.from(this.policy).filter((s) => s.action === "write");
    for (const [s, r] of Object.entries({
      read: t,
      write: n
    })) {
      const i = r.map((a) => a.key);
      this.policy[s] || (this.policy[s] = {});
      for (const a of un(e, i))
        this.policy[s][a] || (this.policy[s][a] = s === "write" && !["characters", "pubkey"].includes(a) ? ["self"] : ["all"]);
    }
  }
  /**
   *
   * @returns {{}|*}
   */
  get() {
    return this.policy;
  }
  /**
   *
   * @returns {string}
   */
  toJson() {
    return JSON.stringify(this.get());
  }
}
class H {
  /**
   *
   * @param {object|array} meta
   */
  constructor(e = []) {
    this.meta = he.normalizeMeta(e);
  }
  /**
   *
   * @param {object|array} meta
   * @returns {AtomMeta}
   */
  merge(e) {
    return this.meta = Array.from(/* @__PURE__ */ new Set([...this.meta, ...he.normalizeMeta(e)])), this;
  }
  /**
   *
   * @param context
   * @returns {AtomMeta}
   */
  addContext(e = null) {
    return this;
  }
  /**
   *
   * @param {Wallet} wallet
   * @returns {AtomMeta}
   */
  setAtomWallet(e) {
    const t = {};
    return e.tokenUnits && e.tokenUnits.length && (t.tokenUnits = JSON.stringify(e.getTokenUnitsData())), e.tradeRates && e.tradeRates.length && (t.tradeRates = JSON.stringify(e.tradeRates)), Object.keys(t).length > 0 && this.merge(t), this;
  }
  /**
   * Set full NEW wallet metadata
   * Used for shadow wallet claim & wallet creation & token creation
   *
   * @param {Wallet} wallet
   * @returns {AtomMeta}
   */
  setMetaWallet(e) {
    return this.merge({
      walletTokenSlug: e.token,
      walletBundleHash: e.bundle,
      walletAddress: e.address,
      walletPosition: e.position,
      walletBatchId: e.batchId,
      walletPubkey: e.pubkey,
      walletCharacters: e.characters
    }), this;
  }
  /**
   *
   * @param shadowWalletClaim
   * @returns {AtomMeta}
   */
  setShadowWalletClaim(e) {
    return this.merge({ shadowWalletClaim: e * 1 }), this;
  }
  /**
   *
   * @param {Wallet} signingWallet
   * @returns {AtomMeta}
   */
  setSigningWallet(e) {
    return this.merge({
      signingWallet: JSON.stringify({
        tokenSlug: e.token,
        bundleHash: e.bundle,
        address: e.address,
        position: e.position,
        pubkey: e.pubkey,
        characters: e.characters
      })
    }), this;
  }
  /**
   *
   * @param policy
   * @todo move logic to the separated class
   * @returns {AtomMeta}
   */
  addPolicy(e) {
    const t = new Ze(e, Object.keys(this.meta));
    return this.merge({
      policy: t.toJson()
    }), this;
  }
  /**
   *
   * @returns {array}
   */
  get() {
    return this.meta;
  }
}
class x extends TypeError {
  /**
   * @param {string|null} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = null, t = null, n = null) {
    if (super(e, t, n), e === null)
      throw new this(`Unknown ${this.constructor.name}`);
    this.name = "BaseException";
  }
  /**
   * @return {string}
   */
  toString() {
    return `${this.name}: ${this.message}.
Stack:
${this.stack}`;
  }
}
class ae extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "The molecule does not contain atoms", t = null, n = null) {
    super(e, t, n), this.name = "AtomsMissingException";
  }
}
class ie {
  /**
   *
   * @param {Atom} atom
   */
  static create(e) {
    const t = {};
    for (const n of Object.keys(e))
      Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
    return new this(t);
  }
  /**
   *
   * @param {Object|Array} object
   * @returns {Object|Array[]}
   */
  static structure(e) {
    switch (Object.prototype.toString.call(e)) {
      case "[object Array]": {
        const t = [];
        for (const n in e)
          t.push(ie.isStructure(e[n]) ? ie.structure(e[n]) : e[n]);
        return t;
      }
      case "[object Object]": {
        const t = [], n = Object.keys(e).sort((s, r) => s === r ? 0 : s < r ? -1 : 1);
        for (const s of n)
          if (Object.prototype.hasOwnProperty.call(e, s)) {
            const r = {};
            r[s] = ie.isStructure(e[s]) ? ie.structure(e[s]) : e[s], t.push(r);
          }
        if (t.length > 0)
          return t;
        break;
      }
    }
    return e;
  }
  /**
   *
   * @param {*} structure
   * @returns {boolean}
   */
  static isStructure(e) {
    return ["[object Object]", "[object Array]"].includes(Object.prototype.toString.call(e));
  }
  /**
   *
   * @returns {Object[]}
   */
  view() {
    return ie.structure(this);
  }
}
class hn extends ie {
  constructor({
    position: e = null,
    walletAddress: t = null,
    isotope: n = null,
    token: s = null,
    value: r = null,
    batchId: i = null,
    metaType: a = null,
    metaId: c = null,
    meta: u = null,
    index: l = null,
    createdAt: h = null,
    version: p = null
  }) {
    super(), this.position = e, this.walletAddress = t, this.isotope = n, this.token = s, this.value = r, this.batchId = i, this.metaType = a, this.metaId = c, this.meta = u, this.index = l, this.createdAt = h, this.version = p;
  }
}
const Ee = {
  4: hn
};
class g {
  /**
   * Class constructor
   *
   * @param {string|null} position
   * @param {string|null} walletAddress
   * @param {string|null} isotope
   * @param {string|null} token
   * @param {string|number|null} value
   * @param {string|null} batchId
   * @param {string|null} metaType
   * @param {string|null} metaId
   * @param {array|object|null} meta
   * @param {string|null} otsFragment
   * @param {number|null} index
   * @param {string|null} version
   */
  constructor({
    position: e = null,
    walletAddress: t = null,
    isotope: n = null,
    token: s = null,
    value: r = null,
    batchId: i = null,
    metaType: a = null,
    metaId: c = null,
    meta: u = null,
    otsFragment: l = null,
    index: h = null,
    version: p = null
  }) {
    this.position = e, this.walletAddress = t, this.isotope = n, this.token = s, this.value = r !== null ? String(r) : null, this.batchId = i, this.metaType = a, this.metaId = c, this.meta = u ? he.normalizeMeta(u) : [], this.index = h, this.otsFragment = l, this.createdAt = String(+/* @__PURE__ */ new Date()), p !== null && Object.prototype.hasOwnProperty.call(Ee, p) && (this.version = String(p));
  }
  /**
   *
   * @returns {string[]}
   */
  static getHashableProps() {
    return [
      "position",
      "walletAddress",
      "isotope",
      "token",
      "value",
      "batchId",
      "metaType",
      "metaId",
      "meta",
      "createdAt"
    ];
  }
  /**
   *
   * @returns {string[]}
   */
  static getUnclaimedProps() {
    return [
      "otsFragment"
    ];
  }
  /**
   *
   * @param {string} isotope
   * @param {Wallet|null} wallet
   * @param {int|null} value
   * @param {string|null} metaType
   * @param {string|null} metaId
   * @param {AtomMeta|array|object|null} meta
   * @param {string|null} batchId
   * @returns {Atom}
   */
  static create({
    isotope: e,
    wallet: t = null,
    value: n = null,
    metaType: s = null,
    metaId: r = null,
    meta: i = null,
    batchId: a = null
  }) {
    return i || (i = new H()), i instanceof H || (i = new H(i)), t && (i.setAtomWallet(t), a || (a = t.batchId)), new g({
      position: t ? t.position : null,
      walletAddress: t ? t.address : null,
      isotope: e,
      token: t ? t.token : null,
      value: n,
      batchId: a,
      metaType: s,
      metaId: r,
      meta: i.get()
    });
  }
  /**
   * Converts a compliant JSON string into an Atom class instance
   *
   * @param {string} json
   * @return {object}
   */
  static jsonToObject(e) {
    const t = Object.assign(new g({}), JSON.parse(e)), n = Object.keys(new g({}));
    for (const s in t)
      Object.prototype.hasOwnProperty.call(t, s) && !n.includes(s) && delete t[s];
    return t;
  }
  /**
   * Returns JSON-ready object for cross-SDK compatibility (2025 JS best practices)
   * 
   * Provides clean serialization of atomic operations with optional OTS fragments.
   * Follows 2025 JavaScript best practices with proper type safety and validation.
   *
   * @param {Object} options - Serialization options
   * @param {boolean} options.includeOtsFragments - Include OTS signature fragments (default: true)
   * @param {boolean} options.validateFields - Validate required fields (default: false)
   * @return {Object} JSON-serializable object
   * @throws {Error} If atom is in invalid state for serialization
   */
  toJSON(e = {}) {
    const {
      includeOtsFragments: t = !0,
      validateFields: n = !1
    } = e;
    try {
      if (n) {
        const r = ["position", "walletAddress", "isotope", "token"];
        for (const i of r)
          if (!this[i])
            throw new Error(`Required field '${i}' is missing or empty`);
      }
      const s = {
        position: this.position ?? "",
        walletAddress: this.walletAddress ?? "",
        isotope: this.isotope,
        token: this.token ?? "",
        value: this.value,
        batchId: this.batchId,
        metaType: this.metaType,
        metaId: this.metaId,
        meta: this.meta || [],
        index: this.index,
        createdAt: this.createdAt,
        version: this.version
      };
      return t && this.otsFragment && (s.otsFragment = this.otsFragment), s;
    } catch (s) {
      throw new Error(`Atom serialization failed: ${s.message}`);
    }
  }
  /**
   * Creates an Atom instance from JSON data (2025 JS best practices)
   * 
   * Handles cross-SDK atom deserialization with robust error handling.
   * Essential for reconstructing atoms from other SDK implementations.
   *
   * @param {string|Object} json - JSON string or object to deserialize
   * @param {Object} options - Deserialization options
   * @param {boolean} options.validateStructure - Validate required fields (default: true)
   * @param {boolean} options.strictMode - Strict validation mode (default: false)
   * @return {Atom} Reconstructed atom instance
   * @throws {Error} If JSON is invalid or required fields are missing
   */
  static fromJSON(e, t = {}) {
    const {
      validateStructure: n = !0,
      strictMode: s = !1
    } = t;
    try {
      const r = typeof e == "string" ? JSON.parse(e) : e;
      if (s || n) {
        const a = ["position", "walletAddress", "isotope", "token"];
        for (const c of a)
          if (!r[c])
            throw new Error(`Required field '${c}' is missing or empty`);
      }
      const i = new g({
        position: r.position,
        walletAddress: r.walletAddress,
        isotope: r.isotope,
        token: r.token,
        value: r.value,
        batchId: r.batchId,
        metaType: r.metaType,
        metaId: r.metaId,
        meta: r.meta,
        index: r.index,
        version: r.version
      });
      return r.otsFragment && (i.otsFragment = r.otsFragment), r.createdAt && (i.createdAt = r.createdAt), i;
    } catch (r) {
      throw new Error(`Atom deserialization failed: ${r.message}`);
    }
  }
  /**
   * Produces a hash of the atoms inside a molecule.
   * Used to generate the molecularHash field for Molecules.
   *
   * @param {array} atoms
   * @param {string} output
   * @return {number[]|*}
   */
  static hashAtoms({
    atoms: e,
    output: t = "base17"
  }) {
    const n = new L("SHAKE256", "TEXT"), s = g.sortAtoms(e);
    if (s.length === 0)
      throw new ae();
    if (s.map((r) => {
      if (!(r instanceof g))
        throw new ae();
      return r;
    }), s.every((r) => r.version && Object.prototype.hasOwnProperty.call(Ee, r.version)))
      n.update(JSON.stringify(s.map((r) => Ee[r.version].create(r).view())));
    else {
      const r = String(e.length);
      let i = [];
      for (const a of s)
        i.push(r), i = i.concat(a.getHashableValues());
      for (const a of i)
        n.update(a);
    }
    switch (t) {
      case "hex":
        return n.getHash("HEX", { outputLen: 256 });
      case "array":
        return n.getHash("ARRAYBUFFER", { outputLen: 256 });
      default:
        return sn(n.getHash("HEX", { outputLen: 256 }), 16, 17, "0123456789abcdef", "0123456789abcdefg").padStart(64, "0");
    }
  }
  static jsonSerialization(e, t) {
    if (!g.getUnclaimedProps().includes(e))
      return t;
  }
  /**
   * Sort the atoms in a Molecule
   *
   * @param {array} atoms
   * @return {array}
   */
  static sortAtoms(e) {
    const t = [...e];
    return t.sort((n, s) => n.index < s.index ? -1 : 1), t;
  }
  /**
   * Get aggregated meta from stored normalized ones
   */
  aggregatedMeta() {
    return he.aggregateMeta(this.meta);
  }
  /**
   *
   * @returns {*[]}
   */
  getHashableValues() {
    const e = [];
    for (const t of g.getHashableProps()) {
      const n = this[t];
      if (!(n === null && !["position", "walletAddress"].includes(t)))
        if (t === "meta")
          for (const s of n)
            typeof s.value < "u" && s.value !== null && (e.push(String(s.key)), e.push(String(s.value)));
        else
          e.push(n === null ? "" : String(n));
    }
    return e;
  }
}
function Ge(o = null, e = 2048) {
  if (o) {
    const t = new L("SHAKE256", "TEXT");
    return t.update(o), t.getHash("HEX", { outputLen: e * 2 });
  } else
    return Xe(e);
}
function de(o, e = null) {
  const t = new L("SHAKE256", "TEXT");
  return t.update(o), t.getHash("HEX", { outputLen: 256 });
}
function nt(o, e) {
  const t = new L("SHAKE256", "TEXT");
  return t.update(o), t.getHash("HEX", { outputLen: e });
}
function Ue({
  molecularHash: o = null,
  index: e = null
}) {
  return o !== null && e !== null ? de(String(o) + String(e), "generateBatchId") : Xe(64);
}
class ke {
  /**
   *
   * @param id
   * @param name
   * @param metas
   */
  constructor(e, t, n) {
    this.id = e, this.name = t, this.metas = n || {};
  }
  /**
   *
   * @param data
   * @returns {*}
   */
  static createFromGraphQL(e) {
    let t = e.metas || {};
    return t.length && (t = JSON.parse(t), t || (t = {})), new ke(
      e.id,
      e.name,
      t
    );
  }
  /**
   *
   * @param data
   * @returns {TokenUnit}
   */
  static createFromDB(e) {
    return new ke(
      e[0],
      e[1],
      e.length > 2 ? e[2] : {}
    );
  }
  /**
   *
   * @returns {*|null}
   */
  getFragmentZone() {
    return this.metas.fragmentZone || null;
  }
  /**
   *
   * @returns {*|null}
   */
  getFusedTokenUnits() {
    return this.metas.fusedTokenUnits || null;
  }
  /**
   * @return array
   */
  toData() {
    return [this.id, this.name, this.metas];
  }
  /**
   *
   * @returns {{metas: string, name: *, id: *}}
   */
  toGraphQLResponse() {
    return {
      id: this.id,
      name: this.name,
      metas: JSON.stringify(this.metas)
    };
  }
}
class dn extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Attempting to create a wallet with no credentials (secret or bundle hash)", t = null, n = null) {
    super(e, t, n), this.name = "WalletCredentialException";
  }
}
const Ie = /* @__PURE__ */ BigInt(2 ** 32 - 1), st = /* @__PURE__ */ BigInt(32);
function pn(o, e = !1) {
  return e ? { h: Number(o & Ie), l: Number(o >> st & Ie) } : { h: Number(o >> st & Ie) | 0, l: Number(o & Ie) | 0 };
}
function fn(o, e = !1) {
  const t = o.length;
  let n = new Uint32Array(t), s = new Uint32Array(t);
  for (let r = 0; r < t; r++) {
    const { h: i, l: a } = pn(o[r], e);
    [n[r], s[r]] = [i, a];
  }
  return [n, s];
}
const mn = (o, e, t) => o << t | e >>> 32 - t, yn = (o, e, t) => e << t | o >>> 32 - t, gn = (o, e, t) => e << t - 32 | o >>> 64 - t, wn = (o, e, t) => o << t - 32 | e >>> 64 - t;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function bn(o) {
  return o instanceof Uint8Array || ArrayBuffer.isView(o) && o.constructor.name === "Uint8Array";
}
function rt(o, e = "") {
  if (!Number.isSafeInteger(o) || o < 0) {
    const t = e && `"${e}" `;
    throw new Error(`${t}expected integer >0, got ${o}`);
  }
}
function D(o, e, t = "") {
  const n = bn(o), s = o == null ? void 0 : o.length, r = e !== void 0;
  if (!n || r && s !== e) {
    const i = t && `"${t}" `, a = r ? ` of length ${e}` : "", c = n ? `length=${s}` : `type=${typeof o}`;
    throw new Error(i + "expected Uint8Array" + a + ", got " + c);
  }
  return o;
}
function it(o, e = !0) {
  if (o.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && o.finished)
    throw new Error("Hash#digest() has already been called");
}
function kn(o, e) {
  D(o, void 0, "digestInto() output");
  const t = e.outputLen;
  if (o.length < t)
    throw new Error('"digestInto() output" expected to be of length >=' + t);
}
function Tt(o) {
  return new Uint32Array(o.buffer, o.byteOffset, Math.floor(o.byteLength / 4));
}
function Ct(...o) {
  for (let e = 0; e < o.length; e++)
    o[e].fill(0);
}
const _n = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Sn(o) {
  return o << 24 & 4278190080 | o << 8 & 16711680 | o >>> 8 & 65280 | o >>> 24 & 255;
}
function $n(o) {
  for (let e = 0; e < o.length; e++)
    o[e] = Sn(o[e]);
  return o;
}
const ot = _n ? (o) => o : $n;
function Et(o, e = {}) {
  const t = (s, r) => o(r).update(s).digest(), n = o(void 0);
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (s) => o(s), Object.assign(t, e), Object.freeze(t);
}
function An(o = 32) {
  const e = typeof globalThis == "object" ? globalThis.crypto : null;
  if (typeof (e == null ? void 0 : e.getRandomValues) != "function")
    throw new Error("crypto.getRandomValues must be defined");
  return e.getRandomValues(new Uint8Array(o));
}
const He = (o) => ({
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, o])
}), vn = BigInt(0), fe = BigInt(1), xn = BigInt(2), In = BigInt(7), Mn = BigInt(256), Tn = BigInt(113), Ot = [], Rt = [], Wt = [];
for (let o = 0, e = fe, t = 1, n = 0; o < 24; o++) {
  [t, n] = [n, (2 * t + 3 * n) % 5], Ot.push(2 * (5 * n + t)), Rt.push((o + 1) * (o + 2) / 2 % 64);
  let s = vn;
  for (let r = 0; r < 7; r++)
    e = (e << fe ^ (e >> In) * Tn) % Mn, e & xn && (s ^= fe << (fe << BigInt(r)) - fe);
  Wt.push(s);
}
const Ut = fn(Wt, !0), Cn = Ut[0], En = Ut[1], at = (o, e, t) => t > 32 ? gn(o, e, t) : mn(o, e, t), lt = (o, e, t) => t > 32 ? wn(o, e, t) : yn(o, e, t);
function On(o, e = 24) {
  const t = new Uint32Array(10);
  for (let n = 24 - e; n < 24; n++) {
    for (let i = 0; i < 10; i++)
      t[i] = o[i] ^ o[i + 10] ^ o[i + 20] ^ o[i + 30] ^ o[i + 40];
    for (let i = 0; i < 10; i += 2) {
      const a = (i + 8) % 10, c = (i + 2) % 10, u = t[c], l = t[c + 1], h = at(u, l, 1) ^ t[a], p = lt(u, l, 1) ^ t[a + 1];
      for (let d = 0; d < 50; d += 10)
        o[i + d] ^= h, o[i + d + 1] ^= p;
    }
    let s = o[2], r = o[3];
    for (let i = 0; i < 24; i++) {
      const a = Rt[i], c = at(s, r, a), u = lt(s, r, a), l = Ot[i];
      s = o[l], r = o[l + 1], o[l] = c, o[l + 1] = u;
    }
    for (let i = 0; i < 50; i += 10) {
      for (let a = 0; a < 10; a++)
        t[a] = o[i + a];
      for (let a = 0; a < 10; a++)
        o[i + a] ^= ~t[(a + 2) % 10] & t[(a + 4) % 10];
    }
    o[0] ^= Cn[n], o[1] ^= En[n];
  }
  Ct(t);
}
class Pe {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(e, t, n, s = !1, r = 24) {
    F(this, "state");
    F(this, "pos", 0);
    F(this, "posOut", 0);
    F(this, "finished", !1);
    F(this, "state32");
    F(this, "destroyed", !1);
    F(this, "blockLen");
    F(this, "suffix");
    F(this, "outputLen");
    F(this, "enableXOF", !1);
    F(this, "rounds");
    if (this.blockLen = e, this.suffix = t, this.outputLen = n, this.enableXOF = s, this.rounds = r, rt(n, "outputLen"), !(0 < e && e < 200))
      throw new Error("only keccak-f1600 function is supported");
    this.state = new Uint8Array(200), this.state32 = Tt(this.state);
  }
  clone() {
    return this._cloneInto();
  }
  keccak() {
    ot(this.state32), On(this.state32, this.rounds), ot(this.state32), this.posOut = 0, this.pos = 0;
  }
  update(e) {
    it(this), D(e);
    const { blockLen: t, state: n } = this, s = e.length;
    for (let r = 0; r < s; ) {
      const i = Math.min(t - this.pos, s - r);
      for (let a = 0; a < i; a++)
        n[this.pos++] ^= e[r++];
      this.pos === t && this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = !0;
    const { state: e, suffix: t, pos: n, blockLen: s } = this;
    e[n] ^= t, (t & 128) !== 0 && n === s - 1 && this.keccak(), e[s - 1] ^= 128, this.keccak();
  }
  writeInto(e) {
    it(this, !1), D(e), this.finish();
    const t = this.state, { blockLen: n } = this;
    for (let s = 0, r = e.length; s < r; ) {
      this.posOut >= n && this.keccak();
      const i = Math.min(n - this.posOut, r - s);
      e.set(t.subarray(this.posOut, this.posOut + i), s), this.posOut += i, s += i;
    }
    return e;
  }
  xofInto(e) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible for this instance");
    return this.writeInto(e);
  }
  xof(e) {
    return rt(e), this.xofInto(new Uint8Array(e));
  }
  digestInto(e) {
    if (kn(e, this), this.finished)
      throw new Error("digest() was already called");
    return this.writeInto(e), this.destroy(), e;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = !0, Ct(this.state);
  }
  _cloneInto(e) {
    const { blockLen: t, suffix: n, outputLen: s, rounds: r, enableXOF: i } = this;
    return e || (e = new Pe(t, n, s, i, r)), e.state32.set(this.state32), e.pos = this.pos, e.posOut = this.posOut, e.finished = this.finished, e.rounds = r, e.suffix = n, e.outputLen = s, e.enableXOF = i, e.destroyed = this.destroyed, e;
  }
}
const qt = (o, e, t, n = {}) => Et(() => new Pe(e, o, t), n), Rn = /* @__PURE__ */ qt(
  6,
  136,
  32,
  /* @__PURE__ */ He(8)
), Wn = /* @__PURE__ */ qt(
  6,
  72,
  64,
  /* @__PURE__ */ He(10)
), Bt = (o, e, t, n = {}) => Et((s = {}) => new Pe(e, o, s.dkLen === void 0 ? t : s.dkLen, !0), n), Un = /* @__PURE__ */ Bt(31, 168, 16, /* @__PURE__ */ He(11)), Ht = /* @__PURE__ */ Bt(31, 136, 32, /* @__PURE__ */ He(12));
function Ye(o) {
  if (!Number.isSafeInteger(o) || o < 0 || o > 4294967295)
    throw new Error("wrong u32 integer:" + o);
  return o;
}
function Pt(o) {
  return Ye(o), (o & o - 1) === 0 && o !== 0;
}
function Kt(o, e) {
  Ye(o);
  let t = 0;
  for (let n = 0; n < e; n++, o >>>= 1)
    t = t << 1 | o & 1;
  return t;
}
function Nt(o) {
  return Ye(o), 31 - Math.clz32(o);
}
function ct(o) {
  const e = o.length;
  if (e < 2 || !Pt(e))
    throw new Error("n must be a power of 2 and greater than 1. Got " + e);
  const t = Nt(e);
  for (let n = 0; n < e; n++) {
    const s = Kt(n, t);
    if (n < s) {
      const r = o[n];
      o[n] = o[s], o[s] = r;
    }
  }
  return o;
}
const ut = (o, e) => {
  const { N: t, roots: n, dit: s, invertButterflies: r = !1, skipStages: i = 0, brp: a = !0 } = e, c = Nt(t);
  if (!Pt(t))
    throw new Error("FFT: Polynomial size should be power of two");
  const u = s !== r;
  return (l) => {
    if (l.length !== t)
      throw new Error("FFT: wrong Polynomial length");
    s && a && ct(l);
    for (let h = 0, p = 1; h < c - i; h++) {
      const d = s ? h + 1 + i : c - h, w = 1 << d, $ = w >> 1, T = t >> d;
      for (let m = 0; m < t; m += w)
        for (let y = 0, b = p++; y < $; y++) {
          const M = r ? s ? t - b : b : y * T, k = m + y, A = m + y + $, v = n[M], I = l[A], _ = l[k];
          if (u) {
            const q = o.mul(I, v);
            l[k] = o.add(_, q), l[A] = o.sub(_, q);
          } else r ? (l[k] = o.add(I, _), l[A] = o.mul(o.sub(I, _), v)) : (l[k] = o.add(_, I), l[A] = o.mul(o.sub(_, I), v));
        }
    }
    return !s && a && ct(l), l;
  };
};
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
const ht = An;
function je(o, e) {
  if (o.length !== e.length)
    return !1;
  let t = 0;
  for (let n = 0; n < o.length; n++)
    t |= o[n] ^ e[n];
  return t === 0;
}
function qn(o) {
  return Uint8Array.from(o);
}
function Oe(o, ...e) {
  const t = (s) => typeof s == "number" ? s : s.bytesLen, n = e.reduce((s, r) => s + t(r), 0);
  return {
    bytesLen: n,
    encode: (s) => {
      const r = new Uint8Array(n);
      for (let i = 0, a = 0; i < e.length; i++) {
        const c = e[i], u = t(c), l = typeof c == "number" ? s[i] : c.encode(s[i]);
        D(l, u, o), r.set(l, a), typeof c != "number" && l.fill(0), a += u;
      }
      return r;
    },
    decode: (s) => {
      D(s, n, o);
      const r = [];
      for (const i of e) {
        const a = t(i), c = s.subarray(0, a);
        r.push(typeof i == "number" ? c : i.decode(c)), s = s.subarray(a);
      }
      return r;
    }
  };
}
function Qe(o, e) {
  const t = e * o.bytesLen;
  return {
    bytesLen: t,
    encode: (n) => {
      if (n.length !== e)
        throw new Error(`vecCoder.encode: wrong length=${n.length}. Expected: ${e}`);
      const s = new Uint8Array(t);
      for (let r = 0, i = 0; r < n.length; r++) {
        const a = o.encode(n[r]);
        s.set(a, i), a.fill(0), i += a.length;
      }
      return s;
    },
    decode: (n) => {
      D(n, t);
      const s = [];
      for (let r = 0; r < n.length; r += o.bytesLen)
        s.push(o.decode(n.subarray(r, r + o.bytesLen)));
      return s;
    }
  };
}
function G(...o) {
  for (const e of o)
    if (Array.isArray(e))
      for (const t of e)
        t.fill(0);
    else
      e.fill(0);
}
function dt(o) {
  return (1 << o) - 1;
}
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
const Bn = (o) => {
  const { newPoly: e, N: t, Q: n, F: s, ROOT_OF_UNITY: r, brvBits: i } = o, a = (m, y = n) => {
    const b = m % y | 0;
    return (b >= 0 ? b | 0 : y + b | 0) | 0;
  }, c = (m, y = n) => {
    const b = a(m, y) | 0;
    return (b > y >> 1 ? b - y | 0 : b) | 0;
  };
  function u() {
    const m = e(t);
    for (let y = 0; y < t; y++) {
      const b = Kt(y, i), M = BigInt(r) ** BigInt(b) % BigInt(n);
      m[y] = Number(M) | 0;
    }
    return m;
  }
  const l = u(), h = {
    add: (m, y) => a((m | 0) + (y | 0)) | 0,
    sub: (m, y) => a((m | 0) - (y | 0)) | 0,
    mul: (m, y) => a((m | 0) * (y | 0)) | 0,
    inv: (m) => {
      throw new Error("not implemented");
    }
  }, p = {
    N: t,
    roots: l,
    invertButterflies: !0,
    skipStages: 1,
    brp: !1
  }, d = ut(h, { dit: !1, ...p }), w = ut(h, { dit: !0, ...p });
  return { mod: a, smod: c, nttZetas: l, NTT: {
    encode: (m) => d(m),
    decode: (m) => {
      w(m);
      for (let y = 0; y < m.length; y++)
        m[y] = a(s * m[y]);
      return m;
    }
  }, bitsCoder: (m, y) => {
    const b = dt(m), M = m * (t / 8);
    return {
      bytesLen: M,
      encode: (k) => {
        const A = new Uint8Array(M);
        for (let v = 0, I = 0, _ = 0, q = 0; v < k.length; v++)
          for (I |= (y.encode(k[v]) & b) << _, _ += m; _ >= 8; _ -= 8, I >>= 8)
            A[q++] = I & dt(_);
        return A;
      },
      decode: (k) => {
        const A = e(t);
        for (let v = 0, I = 0, _ = 0, q = 0; v < k.length; v++)
          for (I |= k[v] << _, _ += 8; _ >= m; _ -= m, I >>= m)
            A[q++] = y.decode(I & b);
        return A;
      }
    };
  } };
}, Hn = (o) => (e, t) => {
  t || (t = o.blockLen);
  const n = new Uint8Array(e.length + 2);
  n.set(e);
  const s = e.length, r = new Uint8Array(t);
  let i = o.create({}), a = 0, c = 0;
  return {
    stats: () => ({ calls: a, xofs: c }),
    get: (u, l) => (n[s + 0] = u, n[s + 1] = l, i.destroy(), i = o.create({}).update(n), a++, () => (c++, i.xofInto(r))),
    clean: () => {
      i.destroy(), G(r, n);
    }
  };
}, Pn = /* @__PURE__ */ Hn(Un);
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
const K = 256, le = 3329, Kn = 3303, Nn = 17, { mod: _e, nttZetas: Ln, NTT: te, bitsCoder: Fn } = Bn({
  N: K,
  Q: le,
  F: Kn,
  ROOT_OF_UNITY: Nn,
  newPoly: (o) => new Uint16Array(o),
  brvBits: 7
}), jn = {
  768: { N: K, Q: le, K: 3, ETA1: 2, ETA2: 2, du: 10, dv: 4, RBGstrength: 192 }
}, Qn = (o) => {
  if (o >= 12)
    return { encode: (t) => t, decode: (t) => t };
  const e = 2 ** (o - 1);
  return {
    // const compress = (i: number) => round((2 ** d / Q) * i) % 2 ** d;
    encode: (t) => ((t << o) + le / 2) / le,
    // const decompress = (i: number) => round((Q / 2 ** d) * i);
    decode: (t) => t * le + e >>> o
  };
}, me = (o) => Fn(o, Qn(o));
function ne(o, e) {
  for (let t = 0; t < K; t++)
    o[t] = _e(o[t] + e[t]);
}
function Dn(o, e) {
  for (let t = 0; t < K; t++)
    o[t] = _e(o[t] - e[t]);
}
function Vn(o, e, t, n, s) {
  const r = _e(e * n * s + o * t), i = _e(o * n + e * t);
  return { c0: r, c1: i };
}
function Me(o, e) {
  for (let t = 0; t < K / 2; t++) {
    let n = Ln[64 + (t >> 1)];
    t & 1 && (n = -n);
    const { c0: s, c1: r } = Vn(o[2 * t + 0], o[2 * t + 1], e[2 * t + 0], e[2 * t + 1], n);
    o[2 * t + 0] = s, o[2 * t + 1] = r;
  }
  return o;
}
function pt(o) {
  const e = new Uint16Array(K);
  for (let t = 0; t < K; ) {
    const n = o();
    if (n.length % 3)
      throw new Error("SampleNTT: unaligned block");
    for (let s = 0; t < K && s + 3 <= n.length; s += 3) {
      const r = (n[s + 0] >> 0 | n[s + 1] << 8) & 4095, i = (n[s + 1] >> 4 | n[s + 2] << 4) & 4095;
      r < le && (e[t++] = r), t < K && i < le && (e[t++] = i);
    }
  }
  return e;
}
function ye(o, e, t, n) {
  const s = o(n * K / 4, e, t), r = new Uint16Array(K), i = Tt(s);
  let a = 0;
  for (let c = 0, u = 0, l = 0, h = 0; c < i.length; c++) {
    let p = i[c];
    for (let d = 0; d < 32; d++)
      l += p & 1, p >>= 1, a += 1, a === n ? (h = l, l = 0) : a === 2 * n && (r[u++] = _e(h - l), l = 0, a = 0);
  }
  if (a)
    throw new Error(`sampleCBD: leftover bits: ${a}`);
  return r;
}
const zn = (o) => {
  const { K: e, PRF: t, XOF: n, HASH512: s, ETA1: r, ETA2: i, du: a, dv: c } = o, u = me(1), l = me(c), h = me(a), p = Oe("publicKey", Qe(me(12), e), 32), d = Qe(me(12), e), w = Oe("ciphertext", Qe(h, e), l), $ = Oe("seed", 32, 32);
  return {
    secretCoder: d,
    lengths: {
      secretKey: d.bytesLen,
      publicKey: p.bytesLen,
      cipherText: w.bytesLen
    },
    keygen: (T) => {
      D(T, 32, "seed");
      const m = new Uint8Array(33);
      m.set(T), m[32] = e;
      const y = s(m), [b, M] = $.decode(y), k = [], A = [];
      for (let _ = 0; _ < e; _++)
        k.push(te.encode(ye(t, M, _, r)));
      const v = n(b);
      for (let _ = 0; _ < e; _++) {
        const q = te.encode(ye(t, M, e + _, r));
        for (let O = 0; O < e; O++) {
          const ce = pt(v.get(O, _));
          ne(q, Me(ce, k[O]));
        }
        A.push(q);
      }
      v.clean();
      const I = {
        publicKey: p.encode([A, b]),
        secretKey: d.encode(k)
      };
      return G(b, M, k, A, m, y), I;
    },
    encrypt: (T, m, y) => {
      const [b, M] = p.decode(T), k = [];
      for (let O = 0; O < e; O++)
        k.push(te.encode(ye(t, y, O, r)));
      const A = n(M), v = new Uint16Array(K), I = [];
      for (let O = 0; O < e; O++) {
        const ce = ye(t, y, e + O, i), Le = new Uint16Array(K);
        for (let xe = 0; xe < e; xe++) {
          const Vt = pt(A.get(O, xe));
          ne(Le, Me(Vt, k[xe]));
        }
        ne(ce, te.decode(Le)), I.push(ce), ne(v, Me(b[O], k[O])), G(Le);
      }
      A.clean();
      const _ = ye(t, y, 2 * e, i);
      ne(_, te.decode(v));
      const q = u.decode(m);
      return ne(q, _), G(b, k, v, _), w.encode([I, q]);
    },
    decrypt: (T, m) => {
      const [y, b] = w.decode(T), M = d.decode(m), k = new Uint16Array(K);
      for (let A = 0; A < e; A++)
        ne(k, Me(M[A], te.encode(y[A])));
      return Dn(b, te.decode(k)), G(k, M, y), u.encode(b);
    }
  };
};
function Jn(o) {
  const e = zn(o), { HASH256: t, HASH512: n, KDF: s } = o, { secretCoder: r, lengths: i } = e, a = Oe("secretKey", i.secretKey, i.publicKey, 32, 32), c = 32, u = 64;
  return {
    info: { type: "ml-kem" },
    lengths: {
      ...i,
      seed: 64,
      msg: c,
      msgRand: c,
      secretKey: a.bytesLen
    },
    keygen: (l = ht(u)) => {
      D(l, u, "seed");
      const { publicKey: h, secretKey: p } = e.keygen(l.subarray(0, 32)), d = t(h), w = a.encode([p, h, d, l.subarray(32)]);
      return G(p, d), { publicKey: h, secretKey: w };
    },
    getPublicKey: (l) => {
      const [h, p] = a.decode(l);
      return Uint8Array.from(p);
    },
    encapsulate: (l, h = ht(c)) => {
      D(l, i.publicKey, "publicKey"), D(h, c, "message");
      const p = l.subarray(0, 384 * o.K), d = r.encode(r.decode(qn(p)));
      if (!je(d, p))
        throw G(d), new Error("ML-KEM.encapsulate: wrong publicKey modulus");
      G(d);
      const w = n.create().update(h).update(t(l)).digest(), $ = e.encrypt(l, h, w.subarray(32, 64));
      return G(w.subarray(32)), { cipherText: $, sharedSecret: w.subarray(0, 32) };
    },
    decapsulate: (l, h) => {
      D(h, a.bytesLen, "secretKey"), D(l, i.cipherText, "cipherText");
      const p = a.bytesLen - 96, d = p + 32, w = t(h.subarray(p / 2, d));
      if (!je(w, h.subarray(d, d + 32)))
        throw new Error("invalid secretKey: hash check failed");
      const [$, T, m, y] = a.decode(h), b = e.decrypt(l, $), M = n.create().update(b).update(m).digest(), k = M.subarray(0, 32), A = e.encrypt(T, b, M.subarray(32, 64)), v = je(l, A), I = s.create({ dkLen: 32 }).update(y).update(l).digest();
      return G(b, A, v ? I : k), v ? k : I;
    }
  };
}
function Gn(o, e, t) {
  return Ht.create({ dkLen: o }).update(e).update(new Uint8Array([t])).digest();
}
const Xn = {
  HASH256: Rn,
  HASH512: Wn,
  KDF: Ht,
  XOF: Pn,
  PRF: Gn
}, De = /* @__PURE__ */ Jn({
  ...Xn,
  ...jn[768]
});
class S {
  /**
   * Class constructor
   *
   * @param {string|null} secret - typically a 2048-character biometric hash
   * @param {string|null} bundle - 64-character hexadecimal user identifier
   * @param {string} token - slug for the token this wallet is intended for
   * @param {string|null} address - hexadecimal public key for the signature of this wallet
   * @param {string|null} position - hexadecimal string used to salt the secret and produce one-time signatures
   * @param {string|null} batchId
   * @param {string|null} characters
   */
  constructor({
    secret: e = null,
    bundle: t = null,
    token: n = "USER",
    address: s = null,
    position: r = null,
    batchId: i = null,
    characters: a = null
  }) {
    this.token = n, this.balance = 0, this.molecules = {}, this.key = null, this.privkey = null, this.pubkey = null, this.tokenUnits = [], this.tradeRates = {}, this.address = s, this.position = r, this.bundle = t, this.batchId = i, this.characters = a, e && (this.bundle = this.bundle || de(e, "Wallet::constructor"), this.position = this.position || S.generatePosition(), this.key = S.generateKey({
      secret: e,
      token: this.token,
      position: this.position
    }), this.address = this.address || S.generateAddress(this.key), this.characters = this.characters || "BASE64", this.initializeMLKEM());
  }
  /**
   * Creates a new Wallet instance
   *
   * @param {string|null} secret
   * @param {string|null} bundle
   * @param {string} token
   * @param {string|null} batchId
   * @param {string|null} characters
   * @return {Wallet}
   */
  static create({
    secret: e = null,
    bundle: t = null,
    token: n,
    batchId: s = null,
    characters: r = null
  }) {
    let i = null;
    if (!e && !t)
      throw new dn();
    return e && !t && (i = S.generatePosition(), t = de(e, "Wallet::create")), new S({
      secret: e,
      bundle: t,
      token: n,
      position: i,
      batchId: s,
      characters: r
    });
  }
  /**
   * Determines if the provided string is a bundle hash
   *
   * @param {string} maybeBundleHash
   * @return {boolean}
   */
  static isBundleHash(e) {
    return typeof e != "string" ? !1 : e.length === 64 && Fe(e);
  }
  /**
   * Get formatted token units from the raw data
   *
   * @param unitsData
   * @return {[]}
   */
  static getTokenUnits(e) {
    const t = [];
    return e.forEach((n) => {
      t.push(ke.createFromDB(n));
    }), t;
  }
  /**
   * Generates a private key for the given parameters
   *
   * @param {string} secret
   * @param {string} token
   * @param {string} position
   * @return {string}
   */
  static generateKey({
    secret: e,
    token: t,
    position: n
  }) {
    const s = Fe(e) ? e : nt(e, 1024), r = Fe(n) ? n : nt(n, 256), a = BigInt(`0x${s}`) + BigInt(`0x${r}`), c = new L("SHAKE256", "TEXT");
    c.update(a.toString(16)), t && c.update(t);
    const u = new L("SHAKE256", "TEXT");
    return u.update(c.getHash("HEX", { outputLen: 8192 })), u.getHash("HEX", { outputLen: 8192 });
  }
  /**
   * Generates a wallet address
   *
   * @param {string} key
   * @return {string}
   */
  static generateAddress(e) {
    const t = We(e, 128), n = new L("SHAKE256", "TEXT");
    for (const r in t) {
      let i = t[r];
      for (let a = 1; a <= 16; a++) {
        const c = new L("SHAKE256", "TEXT");
        c.update(i), i = c.getHash("HEX", { outputLen: 512 });
      }
      n.update(i);
    }
    const s = new L("SHAKE256", "TEXT");
    return s.update(n.getHash("HEX", { outputLen: 8192 })), s.getHash("HEX", { outputLen: 256 });
  }
  /**
   *
   * @param saltLength
   * @returns {string}
   */
  static generatePosition(e = 64) {
    return Xe(e, "abcdef0123456789");
  }
  /**
   * Initializes the ML-KEM key pair
   */
  initializeMLKEM() {
    const e = Ge(this.key, 128), t = new Uint8Array(64);
    for (let r = 0; r < 64; r++)
      t[r] = parseInt(e.substr(r * 2, 2), 16);
    const { publicKey: n, secretKey: s } = De.keygen(t);
    this.pubkey = this.serializeKey(n), this.privkey = s;
  }
  serializeKey(e) {
    return btoa(String.fromCharCode.apply(null, e));
  }
  deserializeKey(e) {
    const t = atob(e);
    return new Uint8Array(t.length).map((n, s) => t.charCodeAt(s));
  }
  /**
   *
   * @returns {*[]}
   */
  getTokenUnitsData() {
    const e = [];
    return this.tokenUnits.forEach((t) => {
      e.push(t.toData());
    }), e;
  }
  /**
   * Split token units
   *
   * @param {array} units
   * @param remainderWallet
   * @param recipientWallet
   */
  splitUnits(e, t, n = null) {
    if (e.length === 0)
      return;
    const s = [], r = [];
    this.tokenUnits.forEach((i) => {
      e.includes(i.id) ? s.push(i) : r.push(i);
    }), this.tokenUnits = s, n !== null && (n.tokenUnits = s), t.tokenUnits = r;
  }
  /**
   * Create a remainder wallet from the source one
   *
   * @param secret
   */
  createRemainder(e) {
    const t = S.create({
      secret: e,
      token: this.token,
      characters: this.characters
    });
    return t.initBatchId({
      sourceWallet: this,
      isRemainder: !0
    }), t;
  }
  /**
   * @return boolean
   */
  isShadow() {
    return (typeof this.position > "u" || this.position === null) && (typeof this.address > "u" || this.address === null);
  }
  /**
   * Sets up a batch ID - either using the sender's, or a new one
   *
   * @param {Wallet} sourceWallet
   * @param {boolean} isRemainder
   */
  initBatchId({
    sourceWallet: e,
    isRemainder: t = !1
  }) {
    e.batchId && (this.batchId = t ? e.batchId : Ue({}));
  }
  async encryptMessage(e, t) {
    const n = JSON.stringify(e), s = new TextEncoder().encode(n), r = this.deserializeKey(t), { cipherText: i, sharedSecret: a } = De.encapsulate(r), c = await this.encryptWithSharedSecret(s, a);
    return {
      cipherText: this.serializeKey(i),
      encryptedMessage: this.serializeKey(c)
    };
  }
  async decryptMessage(e) {
    const { cipherText: t, encryptedMessage: n } = e;
    let s;
    try {
      s = De.decapsulate(this.deserializeKey(t), this.privkey);
    } catch (c) {
      return console.error("Wallet::decryptMessage() - Decapsulation failed", c), console.info("Wallet::decryptMessage() - my public key", this.pubkey), null;
    }
    let r;
    try {
      r = this.deserializeKey(n);
    } catch (c) {
      return console.warn("Wallet::decryptMessage() - Deserialization failed", c), console.info("Wallet::decryptMessage() - my public key", this.pubkey), console.info("Wallet::decryptMessage() - our shared secret", s), null;
    }
    let i;
    try {
      i = await this.decryptWithSharedSecret(r, s);
    } catch (c) {
      return console.warn("Wallet::decryptMessage() - Decryption failed", c), console.info("Wallet::decryptMessage() - my public key", this.pubkey), console.info("Wallet::decryptMessage() - our shared secret", s), console.info("Wallet::decryptMessage() - deserialized encrypted message", r), null;
    }
    let a;
    try {
      a = new TextDecoder().decode(i);
    } catch (c) {
      return console.warn("Wallet::decryptMessage() - Decoding failed", c), console.info("Wallet::decryptMessage() - my public key", this.pubkey), console.info("Wallet::decryptMessage() - our shared secret", s), console.info("Wallet::decryptMessage() - deserialized encrypted message", r), console.info("Wallet::decryptMessage() - decrypted Uint8Array", i), null;
    }
    return JSON.parse(a);
  }
  async encryptWithSharedSecret(e, t) {
    const n = crypto.getRandomValues(new Uint8Array(12)), s = { name: "AES-GCM", iv: n }, r = await crypto.subtle.importKey(
      "raw",
      t,
      { name: "AES-GCM" },
      !1,
      ["encrypt"]
    ), i = await crypto.subtle.encrypt(
      s,
      r,
      e
    ), a = new Uint8Array(n.length + i.byteLength);
    return a.set(n), a.set(new Uint8Array(i), n.length), a;
  }
  /**
   * Decrypts the given message using the shared secret
   * @param encryptedMessage
   * @param sharedSecret
   * @returns {Promise<Uint8Array>}
   */
  async decryptWithSharedSecret(e, t) {
    const s = { name: "AES-GCM", iv: e.slice(0, 12) }, r = await crypto.subtle.importKey(
      "raw",
      t,
      { name: "AES-GCM" },
      !1,
      ["decrypt"]
    ), i = await crypto.subtle.decrypt(
      s,
      r,
      e.slice(12)
    );
    return new Uint8Array(i);
  }
}
class ge extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "There is an atom without an index", t = null, n = null) {
    super(e, t, n), this.name = "AtomIndexException";
  }
}
class Zn extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "The molecular hash does not match", t = null, n = null) {
    super(e, t, n), this.name = "MolecularHashMismatchException";
  }
}
class Yn extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "The molecular hash is missing", t = null, n = null) {
    super(e, t, n), this.name = "MolecularHashMissingException";
  }
}
class ft extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "", t = null, n = null) {
    super(e, t, n), this.name = "PolicyInvalidException";
  }
}
class Lt extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "OTS malformed", t = null, n = null) {
    super(e, t, n), this.name = "SignatureMalformedException";
  }
}
class es extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "One-time signature (OTS) does not match!", t = null, n = null) {
    super(e, t, n), this.name = "SignatureMismatchException";
  }
}
class Y extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Insufficient balance to make transfer", t = null, n = null) {
    super(e, t, n), this.name = "TransferBalanceException";
  }
}
class mt extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Token transfer atoms are malformed", t = null, n = null) {
    super(e, t, n), this.name = "TransferMalformedException";
  }
}
class yt extends x {
  /**
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Token slugs for wallets in transfer do not match!", t = null, n = null) {
    super(e, t, n), this.name = "TransferMismatchedException";
  }
}
class gt extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Invalid remainder provided", t = null, n = null) {
    super(e, t, n), this.name = "TransferRemainderException";
  }
}
class ts extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Sender and recipient(s) cannot be the same", t = null, n = null) {
    super(e, t, n), this.name = "TransferToSelfException";
  }
}
class ns extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Token transfer atoms are unbalanced", t = null, n = null) {
    super(e, t, n), this.name = "TransferUnbalancedException";
  }
}
class Q extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Empty meta data.", t = null, n = null) {
    super(e, t, n), this.name = "MetaMissingException";
  }
}
class se extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Wrong type of token for this isotope", t = null, n = null) {
    super(e, t, n), this.name = "WrongTokenTypeException";
  }
}
class Re extends x {
  /**
   * @param {string|null} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Incorrect BatchId", t = null, n = null) {
    super(e, t, n), this.name = "BatchIdException";
  }
}
class wt {
  constructor({}) {
    const e = arguments[0];
    for (const t in e)
      this[`__${t}`] = e[t];
  }
  static toObject(e) {
    return new this(e);
  }
  /**
   *
   * @returns {{}}
   */
  toJSON() {
    const e = {};
    for (const t of Object.keys(this))
      t.substring(0, 2) === "__" && (e[t.substring(2, t.length)] = this[t]);
    return e;
  }
}
class qe extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "An incorrect argument!", t = null, n = null) {
    super(e, t, n), this.name = "RuleArgumentException";
  }
}
class ee extends x {
  /**
   * @param {string|null} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Code exception", t = null, n = null) {
    super(e, t, n), this.name = "CodeException";
  }
}
class be {
  /**
   *
   * @param {string} action
   * @param {string|null} metaType
   * @param {string|null} metaId
   * @param {Meta|null} meta
   * @param {string|null} address
   * @param {string|null} token
   * @param {string|null} amount
   * @param {string|null} comparison
   */
  constructor({
    action: e,
    metaType: t = null,
    metaId: n = null,
    meta: s = null,
    address: r = null,
    token: i = null,
    amount: a = null,
    comparison: c = null
  }) {
    if (s && (this.meta = s), !e)
      throw new qe('Callback structure violated, missing mandatory "action" parameter.');
    this.__metaId = n, this.__metaType = t, this.__action = e, this.__address = r, this.__token = i, this.__amount = a, this.__comparison = c;
  }
  /**
   *
   * @param {string} comparison
   */
  set comparison(e) {
    this.__comparison = e;
  }
  /**
   *
   * @param {string} amount
   */
  set amount(e) {
    if (!cn(e))
      throw new ee("Parameter amount should be a string containing numbers");
    this.__amount = e;
  }
  /**
   *
   * @param {string} token
   */
  set token(e) {
    this.__token = e;
  }
  /**
   *
   * @param {string} address
   */
  set address(e) {
    this.__address = e;
  }
  /**
   *
   * @param {Meta|object} meta
   */
  set meta(e) {
    this.__meta = e instanceof wt ? e : wt.toObject(e);
  }
  /**
   *
   * @param {string} metaType
   */
  set metaType(e) {
    this.__metaType = e;
  }
  /**
   *
   * @param {string} metaId
   */
  set metaId(e) {
    this.__metaId = e;
  }
  /**
   *
   * @param {object} object
   *
   * @return Callback
   */
  static toObject(e) {
    const t = new be({
      action: e.action
    });
    return e.metaType && (t.metaType = e.metaType), e.metaId && (t.metaId = e.metaId), e.meta && (t.meta = e.meta), e.address && (t.address = e.address), e.token && (t.token = e.token), e.amount && (t.amount = e.amount), e.comparison && (t.comparison = e.comparison), t;
  }
  /**
   *
   * @return {{action: string}}
   */
  toJSON() {
    const e = {
      action: this.__action
    };
    return this.__metaType && (e.metaType = this.__metaType), this.__metaId && (e.metaId = this.__metaId), this.__meta && (e.meta = this.__meta), this.__address && (e.address = this.__address), this.__token && (e.token = this.__token), this.__amount && (e.amount = this.__amount), this.__comparison && (e.comparison = this.__comparison), e;
  }
  /**
   * @return {boolean}
   */
  isReject() {
    return this._is("reject");
  }
  /**
   * @return {boolean}
   */
  isMeta() {
    return pe(Object.keys(this.toJSON()), ["action", "metaId", "metaType", "meta"]).length === 4 && this._is("meta");
  }
  /**
   * @return {boolean}
   */
  isCollect() {
    return pe(Object.keys(this.toJSON()), ["action", "address", "token", "amount", "comparison"]).length === 5 && this._is("collect");
  }
  /**
   * @return {boolean}
   */
  isBuffer() {
    return pe(Object.keys(this.toJSON()), ["action", "address", "token", "amount", "comparison"]).length === 5 && this._is("buffer");
  }
  /**
   * @return {boolean}
   */
  isRemit() {
    return pe(Object.keys(this.toJSON()), ["action", "token", "amount"]).length === 3 && this._is("remit");
  }
  /**
   * @return {boolean}
   */
  isBurn() {
    return pe(Object.keys(this.toJSON()), ["action", "token", "amount", "comparison"]).length === 4 && this._is("burn");
  }
  /**
   * @param {string} type
   *
   * @return {boolean}
   * @private
   */
  _is(e) {
    return this.__action.toLowerCase() === e.toLowerCase();
  }
}
class Ve {
  /**
   *
   * @param key
   * @param value
   * @param comparison
   */
  constructor({
    key: e,
    value: t,
    comparison: n
  }) {
    if ([e, t, n].some((s) => !s))
      throw new qe("Condition::constructor( { key, value, comparison } ) - not all class parameters are initialised!");
    this.__key = e, this.__value = t, this.__comparison = n;
  }
  /**
   * @param object
   * @return {Condition}
   */
  static toObject(e) {
    return new this({
      key: e.key,
      value: e.value,
      comparison: e.comparison
    });
  }
  /**
   * @return {{comparison, value, key}}
   */
  toJSON() {
    return {
      key: this.__key,
      value: this.__value,
      comparison: this.__comparison
    };
  }
}
class Se {
  /**
   *
   * @param {Condition[]} condition
   * @param  {Callback[]} callback
   */
  constructor({
    condition: e = [],
    callback: t = []
  }) {
    for (const n of e)
      if (!(n instanceof Ve))
        throw new qe();
    for (const n of t)
      if (!(n instanceof be))
        throw new qe();
    this.__condition = e, this.__callback = t;
  }
  /**
   *
   * @param {Condition[]|{}} condition
   */
  set comparison(e) {
    this.__condition.push(e instanceof Ve ? e : Ve.toObject(e));
  }
  /**
   * @param {Callback[]|{}} callback
   */
  set callback(e) {
    this.__callback.push(e instanceof be ? e : be.toObject(e));
  }
  /**
   *
   * @param {object} object
   *
   * @return {Rule}
   */
  static toObject(e) {
    if (!e.condition)
      throw new Q("Rule::toObject() - Incorrect rule format! There is no condition field.");
    if (!e.callback)
      throw new Q("Rule::toObject() - Incorrect rule format! There is no callback field.");
    const t = new Se({});
    for (const n of e.condition)
      t.comparison = n;
    for (const n of e.callback)
      t.callback = n;
    return t;
  }
  /**
   * @returns {{condition: *, callback: Callback[]}}
   */
  toJSON() {
    return {
      condition: this.__condition,
      callback: this.__callback
    };
  }
}
class C {
  /**
   * Initialize the Dot utility with the given object and key path
   * @param {object|array} obj - The object or array to traverse
   * @param {string} keys - The dot-notated string of keys
   * @private
   */
  static __init(e, t) {
    this.arr = String(t).split("."), this.key = this.arr.shift();
    const n = Number(this.key);
    Number.isInteger(n) && (this.key = n), this.__nextKey = this.arr.length, this.__next = this.__tic(e);
  }
  /**
   * Check if the current key exists in the object
   * @param {object|array} obj - The object or array to check
   * @return {boolean} - Whether the key exists
   * @private
   */
  static __tic(e) {
    return !Array.isArray(e) && !(e instanceof Object) ? !1 : typeof e[this.key] < "u";
  }
  /**
   * Check if a nested property exists in an object using dot notation
   * @param {object|array} obj - The object or array to search
   * @param {string} keys - The path to the property, using dot notation
   * @return {boolean} - True if the property exists, false otherwise
   */
  static has(e, t) {
    return this.__init(e, t), this.__next ? this.__nextKey === 0 ? !0 : this.has(e[this.key], this.arr.join(".")) : !1;
  }
  /**
   * Get a nested property from an object using dot notation
   * @param {object|array} obj - The object or array to search
   * @param {string} keys - The path to the property, using dot notation
   * @param {*} [def=null] - The default value to return if the property is not found
   * @return {*} - The value of the property, or the default value if not found
   */
  static get(e, t, n = null) {
    return this.__init(e, t), this.__next ? this.__nextKey === 0 ? e[this.key] : this.get(e[this.key], this.arr.join("."), n) : n;
  }
  /**
   * Set a nested property in an object using dot notation
   * @param {object|array} obj - The object or array to modify
   * @param {string} keys - The path to the property, using dot notation
   * @param {*} value - The value to set
   * @return {object|array} - The modified object or array
   */
  static set(e, t, n) {
    const s = t.split(".");
    let r = e;
    const i = s.length - 1;
    for (let u = 0; u < i; u++) {
      const l = s[u], h = Number(l), p = Number.isInteger(h);
      (p ? h : l in r) || (r[p ? h : l] = s[u + 1].match(/^\d+$/) ? [] : {}), r = r[p ? h : l];
    }
    const a = s[i], c = Number(a);
    return r[Number.isInteger(c) ? c : a] = n, e;
  }
}
class ss {
  /**
   *
   * @param molecule
   */
  constructor(e) {
    if (e.molecularHash === null)
      throw new Yn();
    if (!e.atoms.length)
      throw new ae();
    for (const t of e.atoms)
      if (t.index === null)
        throw new ge();
    this.molecule = e;
  }
  /**
   *
   * @param senderWallet
   * @returns {false|*|boolean}
   */
  verify(e) {
    return this.molecularHash() && this.ots() && this.batchId() && this.continuId() && this.isotopeM() && this.isotopeT() && this.isotopeC() && this.isotopeU() && this.isotopeI() && this.isotopeR() && this.isotopeP() && this.isotopeA() && this.isotopeV(e);
  }
  /**
   *
   * @returns {boolean}
   */
  continuId() {
    if (this.molecule.atoms[0].token === "USER" && this.molecule.getIsotopes("I").length < 1)
      throw new ae("Check::continuId() - Molecule is missing required ContinuID Atom!");
    return !0;
  }
  /**
   *
   * @returns {boolean}
   */
  batchId() {
    if (this.molecule.atoms.length > 0) {
      const e = this.molecule.atoms[0];
      if (e.isotope === "V" && e.batchId !== null) {
        const t = this.molecule.getIsotopes("V"), n = t[t.length - 1];
        if (e.batchId !== n.batchId)
          throw new Re();
        for (const s of t)
          if (s.batchId === null)
            throw new Re();
      }
      return !0;
    }
    throw new Re();
  }
  /**
   *
   * @returns {boolean}
   */
  isotopeI() {
    for (const e of this.molecule.getIsotopes("I")) {
      if (e.token !== "USER")
        throw new se(`Check::isotopeI() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index === 0)
        throw new ge(`Check::isotopeI() - Isotope "${e.isotope}" Atoms must have a non-zero index!`);
    }
    return !0;
  }
  /**
   *
   * @returns {boolean}
   */
  isotopeU() {
    for (const e of this.molecule.getIsotopes("U")) {
      if (e.token !== "AUTH")
        throw new se(`Check::isotopeU() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new ge(`Check::isotopeU() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
    }
    return !0;
  }
  /**
   *
   * @returns {boolean}
   */
  isotopeM() {
    const e = ["readPolicy", "writePolicy"];
    for (const t of this.molecule.getIsotopes("M")) {
      if (t.meta.length < 1)
        throw new Q();
      if (t.token !== "USER")
        throw new se(`Check::isotopeM() - "${t.token}" is not a valid Token slug for "${t.isotope}" isotope Atoms!`);
      const n = he.aggregateMeta(t.meta);
      for (const s of e) {
        let r = n[s];
        if (r) {
          r = JSON.parse(r);
          for (const [i, a] of Object.entries(r))
            if (!e.includes(i)) {
              if (!Object.keys(n).includes(i))
                throw new ft(`${i} is missing from the meta.`);
              for (const c of a)
                if (!S.isBundleHash(c) && !["all", "self"].includes(c))
                  throw new ft(`${c} does not correspond to the format of the policy.`);
            }
        }
      }
    }
    return !0;
  }
  /**
   *
   * @returns {boolean}
   */
  isotopeC() {
    for (const e of this.molecule.getIsotopes("C")) {
      if (e.token !== "USER")
        throw new se(`Check::isotopeC() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new ge(`Check::isotopeC() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
    }
    return !0;
  }
  /**
   *
   * @returns {boolean}
   */
  isotopeT() {
    for (const e of this.molecule.getIsotopes("T")) {
      const t = e.aggregatedMeta();
      if (String(e.metaType).toLowerCase() === "wallet") {
        for (const s of ["position", "bundle"])
          if (!Object.prototype.hasOwnProperty.call(t, s) || !t[s])
            throw new Q(`Check::isotopeT() - Required meta field "${s}" is missing!`);
      }
      for (const s of ["token"])
        if (!Object.prototype.hasOwnProperty.call(t, s) || !t[s])
          throw new Q(`Check::isotopeT() - Required meta field "${s}" is missing!`);
      if (e.token !== "USER")
        throw new se(`Check::isotopeT() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new ge(`Check::isotopeT() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
    }
    return !0;
  }
  /**
   *
   * @returns {boolean}
   */
  isotopeR() {
    for (const e of this.molecule.getIsotopes("R")) {
      const t = e.aggregatedMeta();
      if (t.policy) {
        const n = JSON.parse(t.policy);
        if (!Object.keys(n).every((s) => ["read", "write"].includes(s)))
          throw new Q("Check::isotopeR() - Mixing rules with politics!");
      }
      if (t.rule) {
        const n = JSON.parse(t.rule);
        if (!Array.isArray(n))
          throw new Q("Check::isotopeR() - Incorrect rule format!");
        for (const s of n)
          Se.toObject(s);
        if (n.length < 1)
          throw new Q("Check::isotopeR() - No rules!");
      }
    }
    return !0;
  }
  /**
   * Validates P-isotope (Peering) atoms
   *
   * @returns {boolean}
   */
  isotopeP() {
    for (const e of this.molecule.getIsotopes("P")) {
      if (e.token !== "USER")
        throw new se(`Check::isotopeP() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      const t = e.aggregatedMeta();
      if (!Object.prototype.hasOwnProperty.call(t, "peerHost") || !t.peerHost)
        throw new Q('Check::isotopeP() - Required meta field "peerHost" is missing!');
    }
    return !0;
  }
  /**
   * Validates A-isotope (Append Request) atoms
   *
   * @returns {boolean}
   */
  isotopeA() {
    for (const e of this.molecule.getIsotopes("A")) {
      if (e.token !== "USER")
        throw new se(`Check::isotopeA() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (!e.metaType)
        throw new Q('Check::isotopeA() - Required field "metaType" is missing!');
      if (!e.metaId)
        throw new Q('Check::isotopeA() - Required field "metaId" is missing!');
      const t = e.aggregatedMeta();
      if (!Object.prototype.hasOwnProperty.call(t, "action") || !t.action)
        throw new Q('Check::isotopeA() - Required meta field "action" is missing!');
    }
    return !0;
  }
  /**
   *
   * @param senderWallet
   * @returns {boolean}
   */
  isotopeV(e = null) {
    const t = this.molecule.getIsotopes("V");
    if (t.length === 0)
      return !0;
    const n = this.molecule.atoms[0];
    if (n.isotope === "V" && t.length === 2) {
      const i = t[t.length - 1];
      if (n.token !== i.token)
        throw new yt();
      if (i.value < 0)
        throw new mt();
      return !0;
    }
    let s = 0, r = 0;
    for (const i in this.molecule.atoms)
      if (Object.prototype.hasOwnProperty.call(this.molecule.atoms, i)) {
        const a = this.molecule.atoms[i];
        if (a.isotope !== "V")
          continue;
        if (r = a.value * 1, Number.isNaN(r))
          throw new TypeError('Invalid isotope "V" values');
        if (a.token !== n.token)
          throw new yt();
        if (i > 0) {
          if (r < 0)
            throw new mt();
          if (a.walletAddress === n.walletAddress)
            throw new ts();
        }
        s += r;
      }
    if (s !== 0)
      throw new ns();
    if (e) {
      if (r = n.value * 1, Number.isNaN(r))
        throw new TypeError('Invalid isotope "V" values');
      const i = e.balance + r;
      if (i < 0)
        throw new Y();
      if (i !== s)
        throw new gt();
    } else if (r !== 0)
      throw new gt();
    return !0;
  }
  /**
   * Verifies if the hash of all the atoms matches the molecular hash to ensure content has not been messed with
   *
   * @returns {boolean}
   */
  molecularHash() {
    if (this.molecule.molecularHash !== g.hashAtoms({
      atoms: this.molecule.atoms
    }))
      throw new Zn();
    return !0;
  }
  /**
   * Checks if the provided molecule was signed properly by transforming a collection of signature
   * fragments from its atoms and its molecular hash into a single-use wallet address to be matched
   * against the sender’s address. If it matches, the molecule was correctly signed.
   *
   * @returns {boolean}
   */
  ots() {
    const e = this.molecule.normalizedHash();
    let t = this.molecule.atoms.map(
      (p) => p.otsFragment
    ).reduce(
      (p, d) => p + d
    );
    if (t.length !== 2048 && (t = ln(t), t.length !== 2048))
      throw new Lt();
    const n = We(t, 128);
    let s = "";
    for (const p in n) {
      let d = n[p];
      for (let w = 0, $ = 8 + e[p]; w < $; w++)
        d = new L("SHAKE256", "TEXT").update(d).getHash("HEX", { outputLen: 512 });
      s += d;
    }
    const r = new L("SHAKE256", "TEXT");
    r.update(s);
    const i = r.getHash("HEX", { outputLen: 8192 }), a = new L("SHAKE256", "TEXT");
    a.update(i);
    const c = a.getHash("HEX", { outputLen: 256 }), u = this.molecule.atoms[0];
    let l = u.walletAddress;
    const h = C.get(u.aggregatedMeta(), "signingWallet");
    if (h && (l = C.get(JSON.parse(h), "address")), c !== l)
      throw new es();
    return !0;
  }
}
class we extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Insufficient balance for requested transfer", t = null, n = null) {
    super(e, t, n), this.name = "BalanceInsufficientException";
  }
}
class bt extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Amount cannot be negative!", t = null, n = null) {
    super(e, t, n), this.name = "NegativeAmountException";
  }
}
class J {
  /**
   * Class constructor
   *
   * @param {string|null} secret
   * @param {string|null} bundle
   * @param {Wallet|null} sourceWallet
   * @param {Wallet|null} remainderWallet
   * @param {string|null} cellSlug
   * @param {string|number|null} version
   */
  constructor({
    secret: e = null,
    bundle: t = null,
    sourceWallet: n = null,
    remainderWallet: s = null,
    cellSlug: r = null,
    version: i = null
  }) {
    this.status = null, this.molecularHash = null, this.createdAt = String(+/* @__PURE__ */ new Date()), this.cellSlugOrigin = this.cellSlug = r, this.secret = e, this.bundle = t, this.sourceWallet = n, this.atoms = [], i !== null && Object.prototype.hasOwnProperty.call(Ee, i) && (this.version = String(i)), (s || n) && (this.remainderWallet = s || S.create({
      secret: e,
      bundle: t,
      token: n.token,
      batchId: n.batchId,
      characters: n.characters
    }));
  }
  /**
   * Returns the cell slug delimiter
   *
   * @return {string}
   */
  get cellSlugDelimiter() {
    return ".";
  }
  /**
   * Filters the atoms array by the supplied isotope list
   *
   * @param {string|array} isotopes
   * @param {array} atoms
   * @returns {*[]}
   */
  static isotopeFilter(e, t) {
    return Array.isArray(e) || (e = [e]), t.filter((n) => e.includes(n.isotope));
  }
  /**
   * Generates the next atomic index
   *
   * @param {array} atoms
   * @return {number}
   */
  static generateNextAtomIndex(e) {
    return e.length;
  }
  /**
   * Converts a JSON object into a Molecule Structure instance
   *
   * @param {string} json
   * @return {object}
   * @throws {AtomsMissingException}
   */
  static jsonToObject(e) {
    const t = Object.assign(new J({}), JSON.parse(e)), n = Object.keys(new J({}));
    if (!Array.isArray(t.atoms))
      throw new ae();
    for (const s in Object.keys(t.atoms)) {
      t.atoms[s] = g.jsonToObject(JSON.stringify(t.atoms[s]));
      for (const r of ["position", "walletAddress", "isotope"])
        if (t.atoms[s].isotope.toLowerCase() !== "r" && (typeof t.atoms[s][r] > "u" || t.atoms[s][r] === null))
          throw new ae("MolecularStructure::jsonToObject() - Required Atom properties are missing!");
    }
    for (const s in t)
      Object.prototype.hasOwnProperty.call(t, s) && !n.includes(s) && delete t[s];
    return t.atoms = g.sortAtoms(t.atoms), t;
  }
  /**
   * Accept a string of letters and numbers, and outputs a collection of decimals representing each
   * character according to a pre-defined dictionary. Input string would typically be 64-character
   * hexadecimal string featuring numbers from 0 to 9 and characters from a to f - a total of 15
   * unique symbols. To ensure that string has an even number of symbols, convert it to Base 17
   * (adding G as a possible symbol). Map each symbol to integer values as follows:
   *  0   1   2   3   4   5   6   7  8  9  a   b   c   d   e   f   g
   * -8  -7  -6  -5  -4  -3  -2  -1  0  1  2   3   4   5   6   7   8
   *
   * @param {string} hash
   * @return {array}
   */
  static enumerate(e) {
    const t = {
      0: -8,
      1: -7,
      2: -6,
      3: -5,
      4: -4,
      5: -3,
      6: -2,
      7: -1,
      8: 0,
      9: 1,
      a: 2,
      b: 3,
      c: 4,
      d: 5,
      e: 6,
      f: 7,
      g: 8
    }, n = [], s = e.toLowerCase().split("");
    for (let r = 0, i = s.length; r < i; ++r) {
      const a = s[r];
      typeof t[a] < "u" && (n[r] = t[a]);
    }
    return n;
  }
  /**
   * Normalize enumerated string to ensure that the total sum of all symbols is exactly zero. This
   * ensures that exactly 50% of the WOTS+ key is leaked with each usage, ensuring predictable key
   * safety:
   * The sum of each symbol within Hm shall be presented by m
   *  While m0 iterate across that set’s integers as Im:
   *    If m0 and Im>-8 , let Im=Im-1
   *    If m<0 and Im<8 , let Im=Im+1
   *    If m=0, stop the iteration
   *
   * @param {array} mappedHashArray
   * @return {array}
   */
  static normalize(e) {
    let t = e.reduce((s, r) => s + r);
    const n = t < 0;
    for (; t < 0 || t > 0; )
      for (const s of Object.keys(e))
        if ((n ? e[s] < 8 : e[s] > -8) && (n ? (++e[s], ++t) : (--e[s], --t), t === 0))
          break;
    return e;
  }
  /**
   *
   * @param isotopes
   * @returns {*[]}
   */
  getIsotopes(e) {
    return J.isotopeFilter(e, this.atoms);
  }
  /**
   * Generates the next atomic index
   *
   * @return {number}
   */
  generateIndex() {
    return J.generateNextAtomIndex(this.atoms);
  }
  /**
   * Fills a Molecule's properties with the provided object
   *
   * @param {Molecule} molecule
   */
  fill(e) {
    for (const t in Object.keys(e))
      this[t] = e[t];
  }
  /**
   *
   * @param {Atom} atom
   * @returns {Molecule}
   */
  addAtom(e) {
    return this.molecularHash = null, e.index = this.generateIndex(), e.version = this.version, this.atoms.push(e), this.atoms = g.sortAtoms(this.atoms), this;
  }
  /**
   * Add user remainder atom for ContinuID
   *
   * @return {Molecule}
   */
  addContinuIdAtom() {
    (!this.remainderWallet || this.remainderWallet.token !== "USER") && (this.remainderWallet = S.create({
      secret: this.secret,
      bundle: this.bundle
    }));
    const e = {};
    return this.sourceWallet && this.sourceWallet.position && (e.previousPosition = this.sourceWallet.position), this.remainderWallet.pubkey && (e.pubkey = this.remainderWallet.pubkey), this.remainderWallet.characters && (e.characters = this.remainderWallet.characters), this.addAtom(g.create({
      isotope: "I",
      wallet: this.remainderWallet,
      metaType: "walletBundle",
      metaId: this.remainderWallet.bundle,
      meta: new H(e)
    })), this;
  }
  /**
   *
   * @param {string} metaType
   * @param {string} metaId
   * @param {object} meta
   * @param {object} policy
   *
   * @return {Molecule}
   */
  addPolicyAtom({
    metaType: e,
    metaId: t,
    meta: n = {},
    policy: s = {}
  }) {
    const r = new H(n);
    r.addPolicy(s);
    const i = S.create({
      secret: this.secret,
      bundle: this.sourceWallet.bundle,
      token: "USER"
    });
    return this.addAtom(g.create({
      wallet: i,
      isotope: "R",
      metaType: e,
      metaId: t,
      meta: r
    })), this;
  }
  /**
   *
   * @param tokenUnits
   * @param recipientWallet
   * @returns {Molecule}
   */
  fuseToken(e, t) {
    const n = e.length;
    if (this.sourceWallet.balance - n < 0)
      throw new we();
    return this.addAtom(g.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -n
    })), this.addAtom(g.create({
      isotope: "F",
      wallet: t,
      value: 1,
      metaType: "walletBundle",
      metaId: t.bundle
    })), this.addAtom(g.create({
      isotope: "V",
      wallet: this.remainderWallet,
      value: this.sourceWallet.balance - n,
      metaType: "walletBundle",
      metaId: this.remainderWallet.bundle
    })), this;
  }
  /**
   * Burns some amount of tokens from a wallet
   *
   * @param {number} amount
   * @param {string|null} walletBundle
   * @return {Molecule}
   */
  burnToken({
    amount: e,
    walletBundle: t = null
  }) {
    if (e < 0)
      throw new bt("Molecule::burnToken() - Amount to burn must be positive!");
    if (this.sourceWallet.balance - e < 0)
      throw new we();
    return this.addAtom(g.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -e
    })), this.addAtom(g.create({
      isotope: "V",
      wallet: this.remainderWallet,
      value: this.sourceWallet.balance - e,
      metaType: "walletBundle",
      metaId: this.remainderWallet.bundle
    })), this;
  }
  /*
   * Replenishes non-finite token supplies
   *
   * @param {number} amount
   * @param {string} token
   * @param {array|object} metas
   * @return {Molecule}
   */
  replenishToken({
    amount: e,
    units: t = []
  }) {
    if (e < 0)
      throw new bt("Molecule::replenishToken() - Amount to replenish must be positive!");
    if (t.length) {
      t = S.getTokenUnits(t), this.remainderWallet.tokenUnits = this.sourceWallet.tokenUnits;
      for (const n of t)
        this.remainderWallet.tokenUnits.push(n);
      this.remainderWallet.balance = this.remainderWallet.tokenUnits.length, this.sourceWallet.tokenUnits = t, this.sourceWallet.balance = this.sourceWallet.tokenUnits.length;
    } else
      this.remainderWallet.balance = this.sourceWallet.balance + e, this.sourceWallet.balance = e;
    return this.addAtom(g.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: this.sourceWallet.balance
    })), this.addAtom(g.create({
      isotope: "V",
      wallet: this.remainderWallet,
      value: this.remainderWallet.balance,
      metaType: "walletBundle",
      metaId: this.remainderWallet.bundle
    })), this;
  }
  /**
   * Initialize a V-type molecule to transfer value from one wallet to another, with a third,
   * regenerated wallet receiving the remainder
   *
   * @param {Wallet} recipientWallet
   * @param {number} amount
   * @return {Molecule}
   */
  initValue({
    recipientWallet: e,
    amount: t
  }) {
    if (this.sourceWallet.balance - t < 0)
      throw new we();
    return this.addAtom(g.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -this.sourceWallet.balance
    })), this.addAtom(g.create({
      isotope: "V",
      wallet: e,
      value: t,
      metaType: "walletBundle",
      metaId: e.bundle
    })), this.addAtom(g.create({
      isotope: "V",
      wallet: this.remainderWallet,
      value: this.sourceWallet.balance - t,
      metaType: "walletBundle",
      metaId: this.remainderWallet.bundle
    })), this;
  }
  /**
   *
   * @param amount
   * @param tradeRates
   */
  initDepositBuffer({
    amount: e,
    tradeRates: t
  }) {
    if (this.sourceWallet.balance - e < 0)
      throw new we();
    const n = S.create({
      secret: this.secret,
      bundle: this.bundle,
      token: this.sourceWallet.token,
      batchId: this.sourceWallet.batchId
    });
    return n.tradeRates = t, this.addAtom(g.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -this.sourceWallet.balance
    })), this.addAtom(g.create({
      isotope: "B",
      wallet: n,
      value: e,
      metaType: "walletBundle",
      metaId: this.sourceWallet.bundle
    })), this.addAtom(g.create({
      isotope: "V",
      wallet: this.remainderWallet,
      value: this.sourceWallet.balance - e,
      metaType: "walletBundle",
      metaId: this.sourceWallet.bundle
    })), this;
  }
  /**
   *
   * @param {{}} recipients
   * @param {Wallet|{}} signingWallet
   * @returns {Molecule}
   */
  initWithdrawBuffer({
    recipients: e,
    signingWallet: t = null
  }) {
    let n = 0;
    for (const [r, i] of Object.entries(e || {}))
      n += i;
    if (this.sourceWallet.balance - n < 0)
      throw new we();
    const s = new H();
    t && s.setSigningWallet(t), this.addAtom(g.create({
      isotope: "B",
      wallet: this.sourceWallet,
      value: -this.sourceWallet.balance,
      meta: s,
      metaType: "walletBundle",
      metaId: this.sourceWallet.bundle
    }));
    for (const [r, i] of Object.entries(e || {}))
      this.addAtom(new g({
        isotope: "V",
        token: this.sourceWallet.token,
        value: i,
        batchId: this.sourceWallet.batchId ? Ue({}) : null,
        metaType: "walletBundle",
        metaId: r
      }));
    return this.addAtom(g.create({
      isotope: "B",
      wallet: this.remainderWallet,
      value: this.sourceWallet.balance - n,
      metaType: "walletBundle",
      metaId: this.remainderWallet.bundle
    })), this;
  }
  /**
   * Initialize a C-type molecule to issue a new type of token
   *
   * @param {Wallet} recipientWallet - wallet receiving the tokens. Needs to be initialized for the new token beforehand.
   * @param {number} amount - how many of the token we are initially issuing (for fungible tokens only)
   * @param {array|object} meta - additional fields to configure the token
   * @return {Molecule}
   */
  initTokenCreation({
    recipientWallet: e,
    amount: t,
    meta: n
  }) {
    const s = new H(n);
    return s.setMetaWallet(e), this.addAtom(g.create({
      isotope: "C",
      wallet: this.sourceWallet,
      value: t,
      metaType: "token",
      metaId: e.token,
      meta: s,
      batchId: e.batchId
    })), this.addContinuIdAtom(), this;
  }
  /**
   *
   * @param {string} metaType
   * @param {string} metaId
   * @param {object[]} rule,
   * @param {object} policy
   * @return {Molecule}
   */
  createRule({
    metaType: e,
    metaId: t,
    rule: n,
    policy: s = {}
  }) {
    const r = [];
    for (const a of n)
      r.push(a instanceof Se ? a : Se.toObject(a));
    const i = new H({
      rule: JSON.stringify(r)
    });
    return i.addPolicy(s), this.addAtom(g.create({
      isotope: "R",
      wallet: this.sourceWallet,
      metaType: e,
      metaId: t,
      meta: i
    })), this.addContinuIdAtom(), this;
  }
  /**
   * Builds Atoms to define a new wallet on the ledger
   *
   * @param {Wallet} wallet
   * @param {AtomMeta|null} atomMeta
   * @return {Molecule}
   */
  initWalletCreation(e, t = null) {
    t || (t = new H()), t.setMetaWallet(e);
    const n = g.create({
      isotope: "C",
      wallet: this.sourceWallet,
      metaType: "wallet",
      metaId: e.address,
      meta: t,
      batchId: e.batchId
    });
    return this.addAtom(n), this.addContinuIdAtom(), this;
  }
  /**
   * Init shadow wallet claim
   *
   * @param wallet
   */
  initShadowWalletClaim(e) {
    const t = new H().setShadowWalletClaim(!0);
    return this.initWalletCreation(e, t);
  }
  /**
   * Builds Atoms to define a new identifier on the ledger
   *
   * @param {string} type - phone or email
   * @param {string} contact - phone number or email string
   * @param {string} code -
   *
   * @return {Molecule}
   */
  initIdentifierCreation({
    type: e,
    contact: t,
    code: n
  }) {
    const s = {
      code: n,
      hash: de(t.trim(), "Molecule::initIdentifierCreation")
    };
    return this.addAtom(g.create({
      isotope: "C",
      wallet: this.sourceWallet,
      metaType: "identifier",
      metaId: e,
      meta: new H(s)
    })), this.addContinuIdAtom(), this;
  }
  /**
   * Initialize an M-type molecule with the given data
   *
   * @param {array|object} meta
   * @param {string} metaType
   * @param {string} metaId
   * @param {object} policy
   * @return {Molecule}
   */
  initMeta({
    meta: e,
    metaType: t,
    metaId: n,
    policy: s
  }) {
    return this.addAtom(g.create({
      isotope: "M",
      wallet: this.sourceWallet,
      metaType: t,
      metaId: n,
      meta: new H(e)
    })), s && Object.keys(s).length > 0 && this.addPolicyAtom({
      metaType: t,
      metaId: n,
      meta: e,
      policy: s
    }), this.addContinuIdAtom(), this;
  }
  /**
   * Initialize a P-type molecule for peer registration
   *
   * @param {string} host - The peer host URL to register
   * @return {Molecule}
   */
  initPeering({
    host: e
  }) {
    return this.addAtom(g.create({
      isotope: "P",
      wallet: this.sourceWallet,
      metaType: "walletBundle",
      metaId: this.bundle,
      meta: new H({ peerHost: e })
    })), this.addContinuIdAtom(), this;
  }
  /**
   * Initialize an A-type molecule for an append request
   *
   * @param {string} metaType - The target MetaType to append to
   * @param {string} metaId - The target MetaId to append to
   * @param {string} action - The action to perform
   * @param {object} meta - Additional metadata
   * @return {Molecule}
   */
  initAppendRequest({
    metaType: e,
    metaId: t,
    action: n,
    meta: s = {}
  }) {
    return this.addAtom(g.create({
      isotope: "A",
      wallet: this.sourceWallet,
      metaType: e,
      metaId: t,
      meta: new H({ action: n, ...s })
    })), this.addContinuIdAtom(), this;
  }
  /**
   * Arranges atoms to request tokens from the node itself
   *
   * @param {string} token
   * @param {Number} amount
   * @param {string} metaType
   * @param {string} metaId
   * @param {array|object} meta
   * @param {string|null} batchId
   *
   * @return {Molecule}
   */
  initTokenRequest({
    token: e,
    amount: t,
    metaType: n,
    metaId: s,
    meta: r = {},
    batchId: i = null
  }) {
    return r.token = e, r.amount = String(t), this.addAtom(g.create({
      isotope: "T",
      wallet: this.sourceWallet,
      value: t,
      metaType: n,
      metaId: s,
      meta: new H(r),
      batchId: i
    })), this.addContinuIdAtom(), this;
  }
  /**
   * Arranges atoms to request an authorization token from the node
   *
   * @param {object} meta
   *
   * @return {Molecule}
   */
  initAuthorization({ meta: e }) {
    return this.addAtom(g.create({
      isotope: "U",
      wallet: this.sourceWallet,
      meta: new H(e)
    })), this.addContinuIdAtom(), this;
  }
  /**
   * Creates a one-time signature for a molecule and breaks it up across multiple atoms within that
   * molecule. Resulting 4096 byte (2048 character) string is the one-time signature, which is then compressed.
   *
   * @param {string|null} bundle
   * @param {boolean} anonymous
   * @param {boolean} compressed
   * @return {string|null}
   * @throws {AtomsMissingException}
   */
  sign({
    bundle: e = null,
    anonymous: t = !1,
    compressed: n = !0
  }) {
    if (this.atoms.length === 0 || this.atoms.filter((d) => !(d instanceof g)).length !== 0)
      throw new ae();
    !t && !this.bundle && (this.bundle = e || de(this.secret, "Molecule::sign")), this.molecularHash = g.hashAtoms({
      atoms: this.atoms
    });
    const s = this.atoms[0];
    let r = s.position;
    const i = C.get(s.aggregatedMeta(), "signingWallet");
    if (i && (r = C.get(JSON.parse(i), "position")), !r)
      throw new Lt("Signing wallet must have a position!");
    const a = S.generateKey({
      secret: this.secret,
      token: s.token,
      position: s.position
    }), c = We(a, 128), u = this.normalizedHash();
    let l = "";
    for (const d in c) {
      let w = c[d];
      for (let $ = 0, T = 8 - u[d]; $ < T; $++)
        w = new L("SHAKE256", "TEXT").update(w).getHash("HEX", { outputLen: 512 });
      l += w;
    }
    n && (l = an(l));
    const h = We(l, Math.ceil(l.length / this.atoms.length));
    let p = null;
    for (let d = 0, w = h.length; d < w; d++)
      this.atoms[d].otsFragment = h[d], p = this.atoms[d].position;
    return p;
  }
  /**
   * Returns the base cell slug portion
   *
   * @return {string}
   */
  cellSlugBase() {
    return (this.cellSlug || "").split(this.cellSlugDelimiter)[0];
  }
  /**
   * Returns JSON-ready object for cross-SDK compatibility (2025 JS best practices)
   *
   * Includes all necessary fields for cross-SDK validation while excluding sensitive data.
   * Follows 2025 JavaScript best practices with proper error handling and type safety.
   *
   * @param {Object} options - Serialization options
   * @param {boolean} options.includeValidationContext - Include sourceWallet/remainderWallet for validation (default: false)
   * @param {boolean} options.includeOtsFragments - Include OTS signature fragments (default: true)
   * @param {boolean} options.secureMode - Extra security checks (default: false)
   * @return {Object} JSON-serializable object
   * @throws {Error} If molecule is in invalid state for serialization
   */
  toJSON(e = {}) {
    const {
      includeValidationContext: t = !1,
      includeOtsFragments: n = !0
    } = e;
    try {
      const s = {
        status: this.status,
        molecularHash: this.molecularHash,
        createdAt: this.createdAt,
        cellSlug: this.cellSlug,
        bundle: this.bundle,
        // Serialized atoms array with optional OTS fragments
        atoms: this.atoms.map((r) => r.toJSON({
          includeOtsFragments: n
        }))
      };
      return t && (s.cellSlugOrigin = this.cellSlugOrigin, s.version = this.version, this.sourceWallet && (s.sourceWallet = {
        address: this.sourceWallet.address,
        position: this.sourceWallet.position,
        token: this.sourceWallet.token,
        balance: this.sourceWallet.balance || 0,
        bundle: this.sourceWallet.bundle,
        batchId: this.sourceWallet.batchId || null,
        characters: this.sourceWallet.characters || "BASE64",
        pubkey: this.sourceWallet.pubkey || null,
        tokenUnits: this.sourceWallet.tokenUnits || [],
        tradeRates: this.sourceWallet.tradeRates || {},
        molecules: this.sourceWallet.molecules || {}
      }), this.remainderWallet && (s.remainderWallet = {
        address: this.remainderWallet.address,
        position: this.remainderWallet.position,
        token: this.remainderWallet.token,
        balance: this.remainderWallet.balance || 0,
        bundle: this.remainderWallet.bundle,
        batchId: this.remainderWallet.batchId || null,
        characters: this.remainderWallet.characters || "BASE64",
        pubkey: this.remainderWallet.pubkey || null,
        tokenUnits: this.remainderWallet.tokenUnits || [],
        tradeRates: this.remainderWallet.tradeRates || {},
        molecules: this.remainderWallet.molecules || {}
      })), s;
    } catch (s) {
      throw new Error(`Molecule serialization failed: ${s.message}`);
    }
  }
  /**
   * Creates a Molecule instance from JSON data (2025 JS best practices)
   *
   * Handles cross-SDK deserialization with robust error handling and validation.
   * Essential for cross-platform molecule validation and compatibility testing.
   *
   * @param {string|Object} json - JSON string or object to deserialize
   * @param {Object} options - Deserialization options
   * @param {boolean} options.includeValidationContext - Reconstruct sourceWallet/remainderWallet (default: false)
   * @param {boolean} options.validateStructure - Validate required fields (default: true)
   * @return {Molecule} Reconstructed molecule instance
   * @throws {Error} If JSON is invalid or required fields are missing
   */
  static fromJSON(e, t = {}) {
    const {
      includeValidationContext: n = !1,
      validateStructure: s = !0
    } = t;
    try {
      const r = typeof e == "string" ? JSON.parse(e) : e;
      if (s && (!r.molecularHash || !Array.isArray(r.atoms)))
        throw new Error("Invalid molecule data: missing molecularHash or atoms array");
      const i = new J({
        secret: null,
        bundle: r.bundle || null,
        cellSlug: r.cellSlug || null,
        version: r.version || null
      });
      return i.status = r.status, i.molecularHash = r.molecularHash, i.createdAt = r.createdAt || String(+/* @__PURE__ */ new Date()), i.cellSlugOrigin = r.cellSlugOrigin, Array.isArray(r.atoms) && (i.atoms = r.atoms.map((a, c) => {
        try {
          return g.fromJSON(a);
        } catch (u) {
          throw new Error(`Failed to reconstruct atom ${c}: ${u.message}`);
        }
      })), n && (r.sourceWallet && (i.sourceWallet = new S({
        secret: null,
        token: r.sourceWallet.token,
        position: r.sourceWallet.position,
        bundle: r.sourceWallet.bundle,
        batchId: r.sourceWallet.batchId,
        characters: r.sourceWallet.characters
      }), i.sourceWallet.balance = r.sourceWallet.balance || 0, i.sourceWallet.address = r.sourceWallet.address, r.sourceWallet.pubkey && (i.sourceWallet.pubkey = r.sourceWallet.pubkey), i.sourceWallet.tokenUnits = r.sourceWallet.tokenUnits || [], i.sourceWallet.tradeRates = r.sourceWallet.tradeRates || {}, i.sourceWallet.molecules = r.sourceWallet.molecules || {}), r.remainderWallet && (i.remainderWallet = new S({
        secret: null,
        token: r.remainderWallet.token,
        position: r.remainderWallet.position,
        bundle: r.remainderWallet.bundle,
        batchId: r.remainderWallet.batchId,
        characters: r.remainderWallet.characters
      }), i.remainderWallet.balance = r.remainderWallet.balance || 0, i.remainderWallet.address = r.remainderWallet.address, r.remainderWallet.pubkey && (i.remainderWallet.pubkey = r.remainderWallet.pubkey), i.remainderWallet.tokenUnits = r.remainderWallet.tokenUnits || [], i.remainderWallet.tradeRates = r.remainderWallet.tradeRates || {}, i.remainderWallet.molecules = r.remainderWallet.molecules || {})), i;
    } catch (r) {
      throw new Error(`Molecule deserialization failed: ${r.message}`);
    }
  }
  /**
   * Validates the current molecular structure
   *
   * @param senderWallet
   */
  check(e = null) {
    return new ss(this).verify(e);
  }
  /**
   * Convert Hm to numeric notation via EnumerateMolecule(Hm)
   *
   * @returns {Array}
   */
  normalizedHash() {
    return J.normalize(J.enumerate(this.molecularHash));
  }
}
const ze = 10 ** 18;
class ue {
  /**
   * @param {number} value
   * @return {number}
   */
  static val(e) {
    return Math.abs(e * ze) < 1 ? 0 : e;
  }
  /**
   * @param {number} value1
   * @param {number} value2
   * @param {boolean} debug
   * @return {number}
   */
  static cmp(e, t, n = !1) {
    const s = ue.val(e) * ze, r = ue.val(t) * ze;
    return Math.abs(s - r) < 1 ? 0 : s > r ? 1 : -1;
  }
  /**
   * @param {number} value1
   * @param {number} value2
   * @return {boolean}
   */
  static equal(e, t) {
    return ue.cmp(e, t) === 0;
  }
}
class $e {
  /**
   *
   * @param {string} token
   * @param {number} expiresAt
   * @param {boolean} encrypt
   * @param {string} pubkey
   */
  constructor({
    token: e,
    expiresAt: t,
    encrypt: n,
    pubkey: s
  }) {
    this.$__token = e, this.$__expiresAt = t, this.$__pubkey = s, this.$__encrypt = n;
  }
  /**
   *
   * @param data
   * @param wallet
   * @returns {AuthToken}
   */
  static create(e, t) {
    const n = new $e(e);
    return n.setWallet(t), n;
  }
  /**
   *
   * @param {object} snapshot
   * @param {string} secret
   * @return {AuthToken}
   */
  static restore(e, t) {
    const n = new S({
      secret: t,
      token: "AUTH",
      position: e.wallet.position,
      characters: e.wallet.characters
    });
    return $e.create({
      token: e.token,
      expiresAt: e.expiresAt,
      pubkey: e.pubkey,
      encrypt: e.encrypt
    }, n);
  }
  /**
   *
   * @param {Wallet} wallet
   */
  setWallet(e) {
    this.$__wallet = e;
  }
  /**
   * Get a wallet
   * @return {Wallet}
   */
  getWallet() {
    return this.$__wallet;
  }
  /**
   *
   * @return {{wallet: {characters, position}, encrypt, expiresAt, token, pubkey}}
   */
  getSnapshot() {
    return {
      token: this.$__token,
      expiresAt: this.$__expiresAt,
      pubkey: this.$__pubkey,
      encrypt: this.$__encrypt,
      wallet: {
        position: this.$__wallet.position,
        characters: this.$__wallet.characters
      }
    };
  }
  /**
   *
   * @return {string}
   */
  getToken() {
    return this.$__token;
  }
  /**
   *
   * @return {string}
   */
  getPubkey() {
    return this.$__pubkey;
  }
  /**
   *
   * @return {number}
   */
  getExpireInterval() {
    return this.$__expiresAt * 1e3 - Date.now();
  }
  /**
   *
   * @return {boolean}
   */
  isExpired() {
    return !this.$__expiresAt || this.getExpireInterval() < 0;
  }
  /**
   * Get auth data for the final GraphQL client
   * @return {{wallet: Wallet, token: string, pubkey: string}}
   */
  getAuthData() {
    return {
      token: this.getToken(),
      pubkey: this.getPubkey(),
      wallet: this.getWallet()
    };
  }
}
class oe extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "GraphQL did not provide a valid response.", t = null, n = null) {
    super(e, t, n), this.name = "InvalidResponseException";
  }
}
class Be extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Authorization token missing or invalid.", t = null, n = null) {
    super(e, t, n), this.name = "UnauthenticatedException";
  }
}
class W {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   * @param {string|null} dataKey
   */
  constructor({
    query: e,
    json: t,
    dataKey: n = null
  }) {
    if (this.dataKey = n, this.errorKey = "exception", this.$__payload = null, this.$__query = e, this.$__originResponse = t, this.$__response = t, typeof this.$__response > "u" || this.$__response === null)
      throw new oe();
    if (C.has(this.$__response, this.errorKey)) {
      const s = C.get(this.$__response, this.errorKey);
      throw String(s).includes("Unauthenticated") ? new Be() : new oe();
    }
    if (this.$__response.errors && Array.isArray(this.$__response.errors) && this.$__response.errors.length > 0) {
      const s = this.$__response.errors[0].message || "Unknown GraphQL error";
      throw s.includes("Unauthenticated") ? new Be() : new oe(`GraphQL Error: ${s}`);
    }
    this.init();
  }
  /**
   *
   */
  init() {
  }
  /**
   * @return {*}
   */
  data() {
    if (!this.dataKey)
      return this.response();
    if (!this.response().data)
      throw new oe("Response has no data field");
    if (!C.has(this.response(), this.dataKey))
      throw new oe(`Missing expected field: ${this.dataKey}`);
    return C.get(this.response(), this.dataKey);
  }
  /**
   * @return {object}
   */
  response() {
    return this.$__response;
  }
  /**
   * @return {*}
   */
  payload() {
    return null;
  }
  /**
   * @return {Query}
   */
  query() {
    return this.$__query;
  }
  /**
   * @return {*}
   */
  status() {
    return null;
  }
  /**
   * Check if response was successful
   * @return {boolean}
   */
  success() {
    var e, t;
    return !((t = (e = this.$__response) == null ? void 0 : e.errors) != null && t.length);
  }
  /**
   * Get error message if any
   *
   * @return {string|null}
   */
  error() {
    var e, t;
    return (t = (e = this.$__response) == null ? void 0 : e.errors) != null && t.length ? this.$__response.errors[0].message || "Unknown error" : null;
  }
  /**
   * Enhanced interface methods for standardized response handling
   */
  /**
   * Get error reason (alias for error() to match standardized interface)
   * @return {string|null}
   */
  reason() {
    return this.error();
  }
  /**
   * Convert to ValidationResult for enhanced error handling
   * @return {object}
   */
  toValidationResult() {
    var e;
    return this.success() && this.payload() !== null ? {
      success: !0,
      data: this.payload(),
      warnings: []
    } : {
      success: !1,
      error: {
        message: this.reason() || "Unknown error",
        context: this.constructor.name,
        details: ((e = this.$__response) == null ? void 0 : e.errors) || []
      }
    };
  }
  /**
   * Enhanced error handling with callbacks
   * @param {function} callback
   * @return {Response}
   */
  onSuccess(e) {
    if (this.success() && this.payload() !== null)
      try {
        e(this.payload());
      } catch (t) {
        console.warn("Response.onSuccess callback failed:", t);
      }
    return this;
  }
  /**
   * Enhanced failure handling with callbacks
   * @param {function} callback
   * @return {Response}
   */
  onFailure(e) {
    if (!this.success())
      try {
        e(this.reason() || "Unknown error");
      } catch (t) {
        console.warn("Response.onFailure callback failed:", t);
      }
    return this;
  }
  /**
   * Debug logging with enhanced context
   * @param {string|null} label
   * @return {Response}
   */
  debug(e = null) {
    var n, s, r;
    const t = e ? `[${e}]` : `[${this.constructor.name}]`;
    return this.success() ? console.debug(`${t} Success:`, {
      payload: this.payload(),
      query: (s = (n = this.$__query) == null ? void 0 : n.constructor) == null ? void 0 : s.name,
      dataKey: this.dataKey
    }) : console.debug(`${t} Failure:`, {
      error: this.reason(),
      errors: (r = this.$__response) == null ? void 0 : r.errors,
      rawData: this.$__response
    }), this;
  }
  /**
   * Promise conversion for enhanced async patterns
   * @return {Promise}
   */
  toPromise() {
    return this.success() && this.payload() !== null ? Promise.resolve(this.payload()) : Promise.reject(new Error(this.reason() || "Unknown error"));
  }
  /**
   * Functional programming map operation
   * @param {function} mapper
   * @return {Response}
   */
  map(e) {
    if (this.success() && this.payload() !== null)
      try {
        const t = e(this.payload()), n = Object.create(Object.getPrototypeOf(this));
        return Object.assign(n, this), n.$__payload = t, n;
      } catch (t) {
        const n = Object.create(Object.getPrototypeOf(this));
        return Object.assign(n, this), n.$__response = { errors: [{ message: `Mapping failed: ${t.message}` }] }, n;
      }
    else
      return this;
  }
}
class N {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    this.client = e, this.knishIOClient = t, this.$__variables = null, this.$__query = null, this.$__response = null, this.$__request = null;
  }
  /**
   * Return a response object
   * Used at KnishIOClient::createMolecule => sets the source wallet from the remainder one stored in response object
   * @return {Response}
   */
  response() {
    return this.$__response;
  }
  /**
   * Builds a Response based on JSON input
   *
   * @param response
   * @return {Promise<Response>}
   */
  async createResponseRaw(e) {
    return this.createResponse(e);
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {Response}
   */
  createResponse(e) {
    return new W({
      query: this,
      json: e
    });
  }
  /**
   * Creates a new Request for the given parameters
   *
   * @param {{}} variables
   * @returns {{variables: (Object|null), query: null}}
   */
  createQuery({ variables: e = null }) {
    if (this.$__variables = this.compiledVariables(e), !this.uri())
      throw new ee("Query::createQuery() - Node URI was not initialized for this client instance!");
    if (this.$__query === null)
      throw new ee("Query::createQuery() - GraphQL subscription was not initialized!");
    return {
      query: this.$__query,
      variables: this.variables()
    };
  }
  /**
   * Sends the Query to a Knish.IO node and returns the Response
   *
   * @param {object} variables
   * @param {object} context
   * @return {Promise<Response>}
   */
  async execute({ variables: e = null, context: t = {} }) {
    this.$__request = this.createQuery({ variables: e });
    const n = {
      ...t,
      ...this.createQueryContext()
    };
    try {
      const s = await this.client.query({
        ...this.$__request,
        context: n
      });
      return this.$__response = await this.createResponseRaw(s), this.$__response;
    } catch (s) {
      if (s.name === "AbortError")
        return this.knishIOClient.log("warn", "Query was cancelled"), new W({
          query: this,
          json: { data: null, errors: [{ message: "Query was cancelled" }] }
        });
      throw s;
    }
  }
  /**
   * Returns a variables object for the Query
   *
   * @param {object} variables
   * @return {object}
   */
  compiledVariables(e = null) {
    return e || {};
  }
  /**
   * Returns the Knish.IO endpoint URI
   *
   * @return {string}
   */
  uri() {
    return this.client.getUri();
  }
  /**
   * Returns the query variables object
   *
   * @return {object|null}
   */
  variables() {
    return this.$__variables;
  }
  createQueryContext() {
    return {};
  }
}
class rs extends W {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor({
    query: e,
    json: t
  }) {
    super({
      query: e,
      json: t,
      dataKey: "data.ContinuId"
    });
  }
  /**
   * Returns the ContinuID wallet
   *
   * @return {Wallet|null}
   */
  payload() {
    let e = null;
    const t = this.data();
    return t && (e = new S({
      secret: null,
      token: t.tokenSlug
    }), e.address = t.address, e.position = t.position, e.bundle = t.bundleHash, e.batchId = t.batchId, e.characters = t.characters, e.pubkey = t.pubkey, e.balance = t.amount * 1), e;
  }
}
class is extends N {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = E`query ($bundle: String!) {
      ContinuId(bundle: $bundle) {
        address,
        bundleHash,
        tokenSlug,
        position,
        batchId,
        characters,
        pubkey,
        amount,
        createdAt
      }
    }`;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseContinuId}
   */
  createResponse(e) {
    return new rs({
      query: this,
      json: e
    });
  }
}
class os extends W {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor({
    query: e,
    json: t
  }) {
    super({
      query: e,
      json: t,
      dataKey: "data.WalletBundle"
    });
  }
  /**
   * Returns a wallet bundle with normalized metadata
   *
   * @return {{}|null}
   */
  payload() {
    const e = this.data();
    if (!e || e.length === 0)
      return null;
    const t = {};
    return e.forEach((n) => {
      n.metas = he.aggregateMeta(n.metas), t[n.bundleHash] = n;
    }), t;
  }
}
class as extends N {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = E`query( $bundleHashes: [ String! ] ) {
      WalletBundle( bundleHashes: $bundleHashes ) {
        bundleHash,
        metas {
          molecularHash,
          position,
          key,
          value,
          createdAt
        },
        createdAt
      }
    }`;
  }
  /**
   * Builds a Response object out of a JSON string
   *
   * @param {object} json
   * @return {ResponseWalletBundle}
   */
  createResponse(e) {
    return new os({
      query: this,
      json: e
    });
  }
}
class Ke extends W {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor({
    query: e,
    json: t
  }) {
    super({
      query: e,
      json: t,
      dataKey: "data.Wallet"
    });
  }
  /**
   * Returns a Knish.IO client Wallet class instance out of object data
   *
   * @param {object} data
   * @param {string|null} secret
   * @return {Wallet}
   */
  static toClientWallet({
    data: e,
    secret: t = null
  }) {
    let n;
    if (e.position === null || typeof e.position > "u" ? n = S.create({
      bundle: e.bundleHash,
      token: e.tokenSlug,
      batchId: e.batchId,
      characters: e.characters
    }) : (n = new S({
      secret: t,
      token: e.tokenSlug,
      position: e.position,
      batchId: e.batchId,
      characters: e.characters
    }), n.address = e.address, n.bundle = e.bundleHash), e.token && (n.tokenName = e.token.name, n.tokenAmount = e.token.amount, n.tokenSupply = e.token.supply, n.tokenFungibility = e.token.fungibility), e.tokenUnits.length)
      for (const s of e.tokenUnits)
        n.tokenUnits.push(ke.createFromGraphQL(s));
    if (e.tradeRates.length)
      for (const s of e.tradeRates)
        n.tradeRates[s.tokenSlug] = s.amount;
    return n.balance = Number(e.amount), n.pubkey = e.pubkey, n.createdAt = e.createdAt, n;
  }
  /**
   * Returns a list of Wallet class instances
   *
   * @param secret
   * @return {null|[Wallet]}
   */
  getWallets(e = null) {
    const t = this.data();
    if (!t)
      return null;
    const n = [];
    for (const s of t)
      n.push(Ke.toClientWallet({
        data: s,
        secret: e
      }));
    return n;
  }
  /**
   * Returns response payload
   *
   * @return {null|[Wallet]}
   */
  payload() {
    return this.getWallets();
  }
}
class ls extends N {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = E`query( $bundleHash: String, $tokenSlug: String ) {
      Wallet( bundleHash: $bundleHash, tokenSlug: $tokenSlug ) {
        address,
        bundleHash,
        token {
          name,
          amount,
          fungibility,
          supply
        },
        tokenSlug,
        batchId,
        position,
        amount,
        characters,
        pubkey,
        createdAt,
        tokenUnits {
          id,
          name,
          metas
        },
        tradeRates {
          tokenSlug,
          amount
        }
      }
    }`;
  }
  /**
   * Builds a Response object out of a JSON string
   *
   * @param {object} json
   * @return {ResponseWalletList}
   */
  createResponse(e) {
    return new Ke({
      query: this,
      json: e
    });
  }
}
class cs extends W {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor({
    query: e,
    json: t
  }) {
    super({
      query: e,
      json: t,
      dataKey: "data.Balance"
    });
  }
  /**
   * Returns a wallet with balance
   *
   * @return {null|Wallet}
   */
  payload() {
    let e = this.data();
    return Array.isArray(e) && (e = e.length > 0 ? e[0] : null), !e || !e.bundleHash || !e.tokenSlug ? null : Ke.toClientWallet({
      data: e
    });
  }
}
class us extends N {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = E`query( $address: String, $bundleHash: String, $type: String, $token: String, $position: String ) {
      Balance( address: $address, bundleHash: $bundleHash, type: $type, token: $token, position: $position ) {
        address,
        bundleHash,
        type,
        tokenSlug,
        batchId,
        position,
        amount,
        characters,
        pubkey,
        createdAt,
        tokenUnits {
          id,
          name,
          metas
        },
        tradeRates {
          tokenSlug,
          amount
        }
      }
    }`;
  }
  /**
   * @param {object} json
   * @return {ResponseBalance}
   */
  createResponse(e) {
    return new cs({
      query: this,
      json: e
    });
  }
}
class hs extends W {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor({
    query: e,
    json: t
  }) {
    super({
      query: e,
      json: t,
      dataKey: "data.MetaType"
    });
  }
  /**
   * Returns meta type instance results
   *
   * @return {null|*}
   */
  payload() {
    const e = this.data();
    if (!e || e.length === 0)
      return null;
    const t = {
      instances: {},
      instanceCount: {},
      paginatorInfo: {}
    }, n = e.pop();
    return n.instances && (t.instances = n.instances), n.instanceCount && (t.instanceCount = n.instanceCount), n.paginatorInfo && (t.paginatorInfo = n.paginatorInfo), t;
  }
}
class kt extends N {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = E`query( $metaType: String, $metaTypes: [ String! ], $metaId: String, $metaIds: [ String! ], $key: String, $keys: [ String! ], $value: String, $values: [ String! ], $count: String, $latest: Boolean, $filter: [ MetaFilter! ], $queryArgs: QueryArgs, $countBy: String, $cellSlug: String ) {
      MetaType( metaType: $metaType, metaTypes: $metaTypes, metaId: $metaId, metaIds: $metaIds, key: $key, keys: $keys, value: $value, values: $values, count: $count, filter: $filter, queryArgs: $queryArgs, countBy: $countBy, cellSlug: $cellSlug ) {
        metaType,
        instanceCount {
          key,
          value
        },
        instances {
          metaType,
          metaId,
          createdAt,
          metas(latest:$latest) {
            molecularHash,
            position,
            key,
            value,
            createdAt
          }
        },
        paginatorInfo {
          currentPage,
          total
        }
      }
    }`;
  }
  /**
   * Builds a GraphQL-friendly variables object based on input fields
   *
   * @param {string|array|null} metaType
   * @param {string|array|null} metaId
   * @param {string|array|null} key
   * @param {string|array|null} value
   * @param {boolean|null} latest
   * @param {object|null} filter
   * @param {object|null} queryArgs
   * @param {string|null} count
   * @param {string|null} countBy
   * @param {string|null} cellSlug
   * @return {{}}
   */
  static createVariables({
    metaType: e = null,
    metaId: t = null,
    key: n = null,
    value: s = null,
    latest: r = null,
    filter: i = null,
    queryArgs: a = null,
    count: c = null,
    countBy: u = null,
    cellSlug: l = null
  }) {
    const h = {};
    return e && (h[typeof e == "string" ? "metaType" : "metaTypes"] = e), t && (h[typeof t == "string" ? "metaId" : "metaIds"] = t), n && (h[typeof n == "string" ? "key" : "keys"] = n), s && (h[typeof s == "string" ? "value" : "values"] = s), h.latest = r === !0, i && (h.filter = i), a && ((typeof a.limit > "u" || a.limit === 0) && (a.limit = "*"), h.queryArgs = a), c && (h.count = c), u && (h.countBy = u), l && (h.cellSlug = l), h;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaType}
   */
  createResponse(e) {
    return new hs({
      query: this,
      json: e
    });
  }
}
class Ae extends N {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = E`query( $batchId: String ) {
      Batch( batchId: $batchId ) {
        ${Ae.getFields()},
        children {
          ${Ae.getFields()}
        }
      }
    }`;
  }
  static getFields() {
    return `batchId,
              molecularHash,
              type,
              status,
              createdAt,
              wallet {
                  address,
                  bundleHash,
                  amount,
                  tokenSlug,
                  token {
                      name,
                      amount
                  },
                  tokenUnits {
                      id,
                      name,
                      metas
                  }
              },
              fromWallet {
                  address,
                  bundleHash,
                  amount,
                  batchId
              },
              toWallet {
                  address,
                  bundleHash,
                  amount,
                  batchId
              },
              sourceTokenUnits {
                  id,
                  name,
                  metas
              },
              transferTokenUnits {
                  id,
                  name,
                  metas
              },
              metas {
                  key,
                  value,
              },
              throughMetas {
                  key,
                  value
              }`;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {Response}
   */
  createResponse(e) {
    const t = new W({
      query: this,
      json: e
    });
    return t.dataKey = "data.Batch", t;
  }
}
class ds extends N {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = E`query( $batchId: String ) {
      BatchHistory( batchId: $batchId ) {
        ${Ae.getFields()}
      }
    }`;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {Response}
   */
  createResponse(e) {
    const t = new W({
      query: this,
      json: e
    });
    return t.dataKey = "data.BatchHistory", t;
  }
}
class V extends W {
  /**
   * Class constructor
   *
   * @param {MutationProposeMolecule} query
   * @param {object} json
   */
  constructor({
    query: e,
    json: t
  }) {
    super({
      query: e,
      json: t,
      dataKey: "data.ProposeMolecule"
    }), this.$__clientMolecule = e.molecule();
  }
  /**
   * Initialize response object with payload data
   */
  init() {
    const e = C.get(this.data(), "payload");
    try {
      this.$__payload = Object.prototype.toString.call(e) === "[object String]" ? JSON.parse(e) : e;
    } catch {
      this.$__payload = null;
    }
  }
  /**
   * Returns the client molecule
   */
  clientMolecule() {
    return this.$__clientMolecule;
  }
  /**
   * Returns the resulting molecule
   *
   * @return {Molecule|null}
   */
  molecule() {
    const e = this.data();
    if (!e)
      return null;
    const t = new J({});
    return t.molecularHash = C.get(e, "molecularHash"), t.status = C.get(e, "status"), t.createdAt = C.get(e, "createdAt"), t;
  }
  /**
   * Returns whether molecule was accepted or not
   *
   * @return {boolean}
   */
  success() {
    return this.status() === "accepted";
  }
  /**
   * Returns the status of the proposal
   *
   * @return {string}
   */
  status() {
    return C.get(this.data(), "status", "rejected");
  }
  /**
   * Returns the reason for rejection
   *
   * @return {string}
   */
  reason() {
    return C.get(this.data(), "reason", "Invalid response from server");
  }
  /**
   * Returns payload object
   *
   * @return {null}
   */
  payload() {
    return this.$__payload;
  }
}
class et extends N {
  /**
   * Creates a new Request for the given parameters
   *
   * @param {{}} variables
   * @returns {{variables: (Object|null), query: null}}
   */
  createQuery({ variables: e = null }) {
    const t = super.createQuery({ variables: e });
    return t.mutation = t.query, delete t.query, t;
  }
  /**
   * Sends the Mutation to a Knish.IO node and returns the Response
   * @param {Object||null} variables
   * @param {Object||null} context
   * @returns {Promise<Response|null>}
   */
  async execute({ variables: e = {}, context: t = {} }) {
    this.$__request = this.createQuery({
      variables: e
    });
    const n = {
      ...t,
      ...this.createQueryContext()
    };
    try {
      const s = {
        ...this.$__request,
        context: n
      }, r = await this.client.mutate(s);
      return this.$__response = await this.createResponseRaw(r), this.$__response;
    } catch (s) {
      if (s.name === "AbortError")
        return this.knishIOClient.log("warn", "Mutation was cancelled"), new W({
          query: this,
          json: { data: null, errors: [{ message: "Mutation was cancelled" }] }
        });
      throw s;
    }
  }
  createQueryContext() {
    return {};
  }
}
class U extends et {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   * @param molecule
   */
  constructor(e, t, n) {
    super(e, t), this.$__molecule = n, this.$__remainderWallet = null, this.$__query = E`mutation( $molecule: MoleculeInput! ) {
      ProposeMolecule( molecule: $molecule ) {
        molecularHash,
        height,
        depth,
        status,
        reason,
        payload,
        createdAt,
        receivedAt,
        processedAt,
        broadcastedAt,
      }
    }`;
  }
  /**
   * Returns an object of query variables
   *
   * @param {object} variables
   * @return {object}
   */
  compiledVariables(e) {
    return { ...super.compiledVariables(e), molecule: this.molecule() };
  }
  /**
   * Creates a new response from a JSON string
   *
   * @param {object} json
   * @return {ResponseProposeMolecule}
   */
  createResponse(e) {
    return new V({
      query: this,
      json: e
    });
  }
  /**
   * Executes the query
   *
   * @param {object} variables
   * @return {Promise}
   */
  async execute({ variables: e = null }) {
    return e = e || {}, e.molecule = this.molecule(), super.execute({
      variables: e
    });
  }
  /**
   * Returns the remainder wallet
   *
   * @return {null}
   */
  remainderWallet() {
    return this.$__remainderWallet;
  }
  /**
   * Returns the molecule we are proposing
   *
   * @return {Molecule}
   */
  molecule() {
    return this.$__molecule;
  }
}
class ps extends V {
  /**
   * return the authorization key
   *
   * @param key
   * @return {*}
   */
  payloadKey(e) {
    if (!C.has(this.payload(), e))
      throw new oe(`ResponseRequestAuthorization::payloadKey() - '${e}' key was not found in the payload!`);
    return C.get(this.payload(), e);
  }
  /**
   * Returns the auth token
   *
   * @return {string}
   */
  token() {
    return this.payloadKey("token");
  }
  /**
   * Returns timestamp
   *
   * @return {string}
   */
  time() {
    return this.payloadKey("time");
  }
  /**
   *
   * @return {string}
   */
  encrypt() {
    return this.payloadKey("encrypt");
  }
  /**
   *
   * @return {string}
   */
  pubKey() {
    return this.payloadKey("key");
  }
}
class fs extends U {
  /**
   *
   * @param {object} meta
   */
  fillMolecule({ meta: e }) {
    this.$__molecule.initAuthorization({ meta: e }), this.$__molecule.sign({}), this.$__molecule.check();
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseRequestAuthorization}
   */
  createResponse(e) {
    return new ps({
      query: this,
      json: e
    });
  }
}
class ms extends V {
}
class ys extends U {
  /**
   * @param {Wallet|null} recipientWallet
   * @param {number|null} amount
   * @param {object|null} meta
   */
  fillMolecule({
    recipientWallet: e,
    amount: t,
    meta: n = null
  }) {
    this.$__molecule.initTokenCreation({
      recipientWallet: e,
      amount: t,
      meta: n || {}
    }), this.$__molecule.sign({
      bundle: e.bundle
    }), this.$__molecule.check();
  }
  /**
   * Builds a new Response object from a JSON string
   *
   * @param {object} json
   * @return {ResponseCreateToken}
   */
  createResponse(e) {
    return new ms({
      query: this,
      json: e
    });
  }
}
class gs extends V {
}
class ws extends U {
  /**
   * Fills a Molecule with the appropriate atoms and prepares for broadcast
   *
   * @param {string} token
   * @param {Number} amount
   * @param {string} metaType
   * @param {string} metaId
   * @param {object} meta
   * @param {string|null} batchId
   */
  fillMolecule({
    token: e,
    amount: t,
    metaType: n,
    metaId: s,
    meta: r = null,
    batchId: i = null
  }) {
    this.$__molecule.initTokenRequest({
      token: e,
      amount: t,
      metaType: n,
      metaId: s,
      meta: r || {},
      batchId: i
    }), this.$__molecule.sign({}), this.$__molecule.check();
  }
  /**
   * Builds a Response object out of a JSON string
   *
   * @param {object} json
   * @return {ResponseRequestTokens}
   */
  createResponse(e) {
    return new gs({
      query: this,
      json: e
    });
  }
}
class bs extends V {
  /**
   * Returns result of the transfer
   *
   * @return {{reason: null, status: null}}
   */
  payload() {
    const e = {
      reason: null,
      status: null
    }, t = this.data();
    return e.reason = typeof t.reason > "u" ? "Invalid response from server" : t.reason, e.status = typeof t.status > "u" ? "rejected" : t.status, e;
  }
}
class ks extends U {
  /**
   * Fills the Molecule with provided wallet and amount data
   *
   * @param recipientWallet
   * @param amount
   */
  fillMolecule({
    recipientWallet: e,
    amount: t
  }) {
    this.$__molecule.initValue({
      recipientWallet: e,
      amount: t
    }), this.$__molecule.sign({}), this.$__molecule.check(this.$__molecule.sourceWallet);
  }
  /**
   * Builds a Response object out of a JSON string
   *
   * @param {object} json
   * @return {ResponseTransferTokens}
   */
  createResponse(e) {
    return new bs({
      query: this,
      json: e
    });
  }
}
class _s extends V {
}
class Ss extends U {
  fillMolecule({
    type: e,
    contact: t,
    code: n
  }) {
    this.$__molecule.initIdentifierCreation({
      type: e,
      contact: t,
      code: n
    }), this.$__molecule.sign({}), this.$__molecule.check();
  }
  /**
   * Builds a Response object out of a JSON string
   *
   * @param {object} json
   * @return {ResponseCreateIdentifier}
   */
  createResponse(e) {
    return new _s({
      query: this,
      json: e
    });
  }
}
class $s extends V {
}
class As extends U {
  /**
   * Class constructor
   *
   * @param {string} token
   * @param {string|null} batchId
   */
  fillMolecule({
    token: e,
    batchId: t = null
  }) {
    const n = S.create({
      secret: this.$__molecule.secret,
      bundle: this.$__molecule.bundle,
      token: e,
      batchId: t
    });
    this.$__molecule.initShadowWalletClaim(n), this.$__molecule.sign({}), this.$__molecule.check();
  }
  /**
   * Builds a Response object out of a JSON string
   *
   * @param {object} json
   * @return {ResponseClaimShadowWallet}
   */
  createResponse(e) {
    return new $s({
      query: this,
      json: e
    });
  }
}
class vs extends V {
}
class xs extends U {
  /**
   * Fills a molecule with an appropriate metadata atom
   *
   * @param {string} metaType
   * @param {string} metaId
   * @param {array|object} meta
   * @param {object} policy
   */
  fillMolecule({
    metaType: e,
    metaId: t,
    meta: n,
    policy: s
  }) {
    this.$__molecule.initMeta({
      meta: n,
      metaType: e,
      metaId: t,
      policy: s
    }), this.$__molecule.sign({}), this.$__molecule.check();
  }
  /**
   * Builds a new Response object from a JSON string
   *
   * @param {object} json
   * @return {ResponseCreateMeta}
   */
  createResponse(e) {
    return new vs({
      query: this,
      json: e
    });
  }
}
class Is extends V {
}
class Ms extends U {
  /**
   * Fills a molecule with a P-isotope peering atom
   *
   * @param {string} host
   */
  fillMolecule({
    host: e
  }) {
    this.$__molecule.initPeering({
      host: e
    }), this.$__molecule.sign({}), this.$__molecule.check();
  }
  /**
   * Builds a new Response object from a JSON string
   *
   * @param {object} json
   * @return {ResponsePeering}
   */
  createResponse(e) {
    return new Is({
      query: this,
      json: e
    });
  }
}
class Ts extends V {
}
class Cs extends U {
  /**
   * Fills a molecule with an A-isotope append request atom
   *
   * @param {string} metaType
   * @param {string} metaId
   * @param {string} action
   * @param {object} meta
   */
  fillMolecule({
    metaType: e,
    metaId: t,
    action: n,
    meta: s = {}
  }) {
    this.$__molecule.initAppendRequest({
      metaType: e,
      metaId: t,
      action: n,
      meta: s
    }), this.$__molecule.sign({}), this.$__molecule.check();
  }
  /**
   * Builds a new Response object from a JSON string
   *
   * @param {object} json
   * @return {ResponseAppendRequest}
   */
  createResponse(e) {
    return new Ts({
      query: this,
      json: e
    });
  }
}
class Es extends V {
}
class Os extends U {
  fillMolecule(e) {
    this.$__molecule.initWalletCreation(e), this.$__molecule.sign({}), this.$__molecule.check();
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseCreateWallet}
   */
  createResponse(e) {
    return new Es({
      query: this,
      json: e
    });
  }
}
class Rs extends W {
  /**
   * Class constructor
   *
   * @param {MutationRequestAuthorizationGuest} query
   * @param json
   */
  constructor({
    query: e,
    json: t
  }) {
    super({
      query: e,
      json: t,
      dataKey: "data.AccessToken"
    });
  }
  /**
   * Returns the reason for rejection
   *
   * @return {string}
   */
  reason() {
    return "Invalid response from server";
  }
  /**
   * Returns whether molecule was accepted or not
   *
   * @return {boolean}
   */
  success() {
    return this.payload() !== null;
  }
  /**
   * Returns a wallet with balance
   *
   * @return {null|Wallet}
   */
  payload() {
    return this.data();
  }
  /**
   * Returns the authorization key
   *
   * @param key
   * @return {*}
   */
  payloadKey(e) {
    if (!C.has(this.payload(), e))
      throw new oe(`ResponseAuthorizationGuest::payloadKey() - '${e}' key is not found in the payload!`);
    return C.get(this.payload(), e);
  }
  /**
   * Returns the auth token
   *
   * @return {*}
   */
  token() {
    return this.payloadKey("token");
  }
  /**
   * Returns timestamp
   *
   * @return {*}
   */
  time() {
    return this.payloadKey("time");
  }
  /**
   * Returns timestamp
   *
   * @return {string}
   */
  pubKey() {
    return this.payloadKey("key");
  }
  /**
   *
   * @return {string}
   */
  encrypt() {
    return this.payloadKey("encrypt");
  }
}
class Ws extends et {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = E`mutation( $cellSlug: String, $pubkey: String, $encrypt: Boolean ) {
      AccessToken( cellSlug: $cellSlug, pubkey: $pubkey, encrypt: $encrypt ) {
        token,
        pubkey,
        expiresAt
      }
    }`;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseRequestAuthorizationGuest}
   */
  createResponse(e) {
    return new Rs({
      query: this,
      json: e
    });
  }
}
class _t extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "The shadow wallet does not exist", t = null, n = null) {
    super(e, t, n), this.name = "WalletShadowException";
  }
}
class Us extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Stackable tokens with unit IDs cannot have decimal places!", t = null, n = null) {
    super(e, t, n), this.name = "StackableUnitDecimalsException";
  }
}
class Te extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Stackable tokens with unit IDs cannot have an amount!", t = null, n = null) {
    super(e, t, n), this.name = "StackableUnitAmountException";
  }
}
class Ne {
  /**
   *
   * @param {UrqlClientWrapper} graphQLClient
   */
  constructor(e) {
    this.client = e, this.$__variables = null, this.$__subscribe = null;
  }
  /**
   * Creates a new Request for the given parameters
   *
   * @param {{}} variables
   * @returns {{variables: (Object|null), fetchPolicy: string, query: null}}
   */
  createSubscribe({
    variables: e = null
  }) {
    if (this.$__variables = this.compiledVariables(e), !this.uri())
      throw new ee("Subscribe::createSubscribe() - Node URI was not initialized for this client instance!");
    if (this.$__subscribe === null)
      throw new ee("Subscribe::createSubscribe() - GraphQL subscription was not initialized!");
    return {
      query: this.$__subscribe,
      variables: this.variables(),
      fetchPolicy: "no-cache"
    };
  }
  /**
   * Sends the Query to a Knish.IO node and returns the Response
   *
   * @param {{}} variables
   * @param {function} closure
   * @return {string}
   */
  async execute({
    variables: e = null,
    closure: t
  }) {
    if (!t)
      throw new ee(`${this.constructor.name}::execute() - closure parameter is required!`);
    return this.$__request = this.createSubscribe({
      variables: e
    }), this.client.subscribe(this.$__request, t);
  }
  /**
   * Returns a variables object for the Query
   *
   * @param variables
   * @return {object}
   */
  compiledVariables(e = null) {
    return e || {};
  }
  /**
   * Returns the Knish.IO endpoint URI
   *
   * @return {string}
   */
  uri() {
    return this.client.getUri();
  }
  /**
   * Returns the query variables object
   *
   * @return {object|null}
   */
  variables() {
    return this.$__variables;
  }
}
class qs extends Ne {
  constructor(e) {
    super(e), this.$__subscribe = E`
      subscription onCreateMolecule ( $bundle: String! ) {
        CreateMolecule( bundle: $bundle ) {
          molecularHash,
          cellSlug,
          counterparty,
          bundleHash,
          status,
          local,
          height,
          depth,
          createdAt,
          receivedAt,
          processedAt,
          broadcastedAt,
          reason,
          reasonPayload,
          payload,
          status,
          atoms {
            molecularHash,
            position,
            isotope,
            walletAddress,
            tokenSlug,
            batchId,
            value,
            index,
            metaType,
            metaId,
            metasJson,
            otsFragment,
            createdAt,
            metas {
              molecularHash,
              position,
              metaType,
              metaId,
              key,
              value,
              createdAt,
            }
          }
        }
      }
    `;
  }
}
class Bs extends Ne {
  constructor(e) {
    super(e), this.$__subscribe = E`
      subscription onWalletStatus ( $bundle: String!, $token: String! ) {
        WalletStatus( bundle: $bundle, token: $token ) {
          bundle,
          token,
          admission,
          balance,
        }
      }
    `;
  }
}
class Hs extends Ne {
  constructor(e) {
    super(e), this.$__subscribe = E`
      subscription onActiveWallet ( $bundle: String! ) {
        ActiveWallet( bundle: $bundle ) {
          address,
          bundleHash,
          walletBundle {
            bundleHash,
            slug,
            createdAt,
          },
          tokenSlug,
          token {
            slug,
            name,
            fungibility,
            supply,
            decimals,
            amount,
            icon,
            createdAt
          },
          batchId,
          position,
          characters,
          pubkey,
          amount,
          createdAt,
          metas {
            molecularHash,
            position,
            metaType,
            metaId,
            key,
            value,
            createdAt,
          }
        }
      }
    `;
  }
}
class Ps extends Ne {
  constructor(e) {
    super(e), this.$__subscribe = E`
      subscription onActiveUser ( $metaType: String!, $metaId: String! ) {
        ActiveUser( metaType: $metaType, metaId: $metaId ) {
          bundleHash,
          metaType,
          metaId,
          jsonData,
          createdAt,
          updatedAt
        }
      }`;
  }
}
class Ks extends W {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor({
    query: e,
    json: t
  }) {
    super({
      query: e,
      json: t,
      dataKey: "data.ActiveSession"
    });
  }
}
class Ns extends et {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = E`mutation(
      $bundleHash: String!,
      $metaType: String!,
      $metaId: String!,
      $ipAddress: String,
      $browser: String,
      $osCpu: String,
      $resolution: String,
      $timeZone: String,
      $json: String ) {
      ActiveSession(
        bundleHash: $bundleHash,
        metaType: $metaType,
        metaId: $metaId,
        ipAddress: $ipAddress,
        browser: $browser,
        osCpu: $osCpu,
        resolution: $resolution,
        timeZone: $timeZone,
        json: $json
      ) {
        bundleHash,
        metaType,
        metaId,
        jsonData,
        createdAt,
        updatedAt
      }
    }`;
  }
  /**
   * Builds a Response object out of a JSON string
   *
   * @param {object} json
   * @return {ResponseActiveSession}
   */
  createResponse(e) {
    return new Ks({
      query: this,
      json: e
    });
  }
}
class Ls extends W {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor({
    query: e,
    json: t
  }) {
    super({
      query: e,
      json: t,
      dataKey: "data.ActiveUser"
    });
  }
  payload() {
    const e = this.data();
    if (!e)
      return null;
    const t = [];
    for (const n of e) {
      const s = { ...n };
      s.jsonData && (s.jsonData = JSON.parse(s.jsonData)), s.createdAt && (s.createdAt = new Date(s.createdAt)), s.updatedAt && (s.updatedAt = new Date(s.updatedAt)), t.push(s);
    }
    return t;
  }
}
class Fs extends N {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = E`query ActiveUserQuery ($bundleHash:String, $metaType: String, $metaId: String) {
      ActiveUser (bundleHash: $bundleHash, metaType: $metaType, metaId: $metaId) {
        bundleHash,
        metaType,
        metaId,
        jsonData,
        createdAt,
        updatedAt
      }
    }`;
  }
  /**
   * @param {object} json
   * @return {ResponseQueryActiveSession}
   */
  createResponse(e) {
    return new Ls({
      query: this,
      json: e
    });
  }
}
class js extends W {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor({
    query: e,
    json: t
  }) {
    super({
      query: e,
      json: t,
      dataKey: "data.UserActivity"
    });
  }
  payload() {
    const e = JSON.parse(JSON.stringify(this.data()));
    if (e.instances)
      for (const t of e.instances)
        t.jsonData = JSON.parse(t.jsonData);
    return e;
  }
}
class Qs extends N {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = E`query UserActivity (
      $bundleHash:String,
      $metaType: String,
      $metaId: String,
      $ipAddress: String,
      $browser: String,
      $osCpu: String,
      $resolution: String,
      $timeZone: String,
      $countBy: [CountByUserActivity],
      $interval: span
    ) {
      UserActivity (
        bundleHash: $bundleHash,
        metaType: $metaType,
        metaId: $metaId,
        ipAddress: $ipAddress,
        browser: $browser,
        osCpu: $osCpu,
        resolution: $resolution,
        timeZone: $timeZone,
        countBy: $countBy,
        interval: $interval
      ) {
        createdAt,
        bundleHash,
        metaType,
        metaId,
        instances {
          bundleHash,
          metaType,
          metaId,
          jsonData,
          createdAt,
          updatedAt
        },
        instanceCount {
          ...SubFields,
          ...Recursive
        }
      }
    }

    fragment SubFields on InstanceCountType {
      id,
      count
    }

    fragment Recursive on InstanceCountType {
      instances {
        ...SubFields
        instances {
          ...SubFields,
          instances {
            ...SubFields
            instances {
              ...SubFields
              instances {
                ...SubFields
                instances {
                  ...SubFields
                  instances {
                    ...SubFields
                    instances {
                      ...SubFields
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseQueryUserActivity}
   */
  createResponse(e) {
    return new js({
      query: this,
      json: e
    });
  }
}
class Ds extends N {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = E`query( $slug: String, $slugs: [ String! ], $limit: Int, $order: String ) {
      Token( slug: $slug, slugs: $slugs, limit: $limit, order: $order ) {
        slug,
        name,
        fungibility,
        supply,
        decimals,
        amount,
        icon,
      }
    }`;
  }
  /**
   *
   * @param json
   * @returns {Response}
   */
  createResponse(e) {
    return new W({
      query: this,
      json: e,
      dataKey: "data.Token"
    });
  }
}
class St extends x {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Authorization attempt rejected by ledger.", t = null, n = null) {
    super(e, t, n), this.name = "AuthorizationRejectedException";
  }
}
class Vs extends W {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor({
    query: e,
    json: t
  }) {
    super({
      query: e,
      json: t,
      dataKey: "data.Atom"
    });
  }
  /**
   * Returns meta type instance results
   *
   * @return {null|*}
   */
  payload() {
    const e = this.data();
    if (!e)
      return null;
    const t = {
      instances: [],
      instanceCount: {},
      paginatorInfo: {}
    };
    if (e.instances) {
      t.instances = e.instances;
      for (const n in t.instances) {
        const s = t.instances[n];
        s.metasJson && (t.instances[n].metas = JSON.parse(s.metasJson));
      }
    }
    return e.instanceCount && (t.instanceCount = e.instanceCount), e.paginatorInfo && (t.paginatorInfo = e.paginatorInfo), t;
  }
  metas() {
    const e = this.payload(), t = [];
    if (e && e.instances)
      for (const n of e.instances)
        n.metasJson && t.push(JSON.parse(n.metasJson));
    return t;
  }
}
class $t extends N {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = E`query(
      $molecularHashes: [String!],
      $bundleHashes: [String!],
      $positions:[String!],
      $walletAddresses: [String!],
      $isotopes: [String!],
      $tokenSlugs: [String!],
      $cellSlugs: [String!],
      $batchIds: [String!],
      $values: [String!],
      $metaTypes: [String!],
      $metaIds: [String!],
      $indexes: [String!],
      $filter: [ MetaFilter! ],
      $latest: Boolean,
      $queryArgs: QueryArgs,
    ) {
      Atom(
        molecularHashes: $molecularHashes,
        bundleHashes: $bundleHashes,
        positions: $positions,
        walletAddresses: $walletAddresses,
        isotopes: $isotopes,
        tokenSlugs: $tokenSlugs,
        cellSlugs: $cellSlugs,
        batchIds: $batchIds,
        values: $values,
        metaTypes: $metaTypes,
        metaIds: $metaIds,
        indexes: $indexes,
        filter: $filter,
        latest: $latest,
        queryArgs: $queryArgs,
      ) {
        instances {
          position,
          walletAddress,
          tokenSlug,
          isotope,
          index,
          molecularHash,
          metaId,
          metaType,
          metasJson,
          batchId,
          value,
          bundleHashes,
          cellSlugs,
          createdAt,
          otsFragment
        },
        paginatorInfo {
          currentPage,
          total
        }
      }
    }`;
  }
  /**
   * Queries Knish.IO Atoms
   *
   * @param {string[]} molecularHashes
   * @param {string} molecularHash
   * @param {string[]} bundleHashes
   * @param {string} bundleHash
   * @param {string[]} positions
   * @param {string} position
   * @param {string[]} walletAddresses
   * @param {string} walletAddress
   * @param {string[]} isotopes
   * @param {string} isotope
   * @param {string[]} tokenSlugs
   * @param {string} tokenSlug
   * @param {string[]} cellSlugs
   * @param {string} cellSlug
   * @param {string[]} batchIds
   * @param {string} batchId
   * @param {string[]} values
   * @param {string|number} value
   * @param {string[]} metaTypes
   * @param {string} metaType
   * @param {string[]} metaIds
   * @param {string} metaId
   * @param {number[]} indexes
   * @param {number} index
   * @param {object[]} filter,
   * @param {boolean} latest
   * @param {object} queryArgs
   * @return {object}
   */
  static createVariables({
    molecularHashes: e,
    molecularHash: t,
    bundleHashes: n,
    bundleHash: s,
    positions: r,
    position: i,
    walletAddresses: a,
    walletAddress: c,
    isotopes: u,
    isotope: l,
    tokenSlugs: h,
    tokenSlug: p,
    cellSlugs: d,
    cellSlug: w,
    batchIds: $,
    batchId: T,
    values: m,
    value: y,
    metaTypes: b,
    metaType: M,
    metaIds: k,
    metaId: A,
    indexes: v,
    index: I,
    filter: _,
    latest: q,
    queryArgs: O
  }) {
    return t && (e = e || [], e.push(t)), s && (n = n || [], n.push(s)), i && (r = r || [], r.push(i)), c && (a = a || [], a.push(c)), l && (u = u || [], u.push(l)), p && (h = h || [], h.push(p)), w && (d = d || [], d.push(w)), T && ($ = $ || [], $.push(T)), y && (m = m || [], m.push(y)), M && (b = b || [], b.push(M)), A && (k = k || [], k.push(A)), I && (v = v || [], v.push(I)), {
      molecularHashes: e,
      bundleHashes: n,
      positions: r,
      walletAddresses: a,
      isotopes: u,
      tokenSlugs: h,
      cellSlugs: d,
      batchIds: $,
      values: m,
      metaTypes: b,
      metaIds: k,
      indexes: v,
      filter: _,
      latest: q,
      queryArgs: O
    };
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseAtom}
   */
  createResponse(e) {
    return new Vs({
      query: this,
      json: e
    });
  }
}
class zs extends W {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor({
    query: e,
    json: t
  }) {
    super({
      query: e,
      json: t
    }), this.dataKey = "data.Policy", this.init();
  }
  /**
   *
   * @returns {null|object}
   */
  payload() {
    const e = this.data();
    return e && e.callback ? JSON.parse(e.callback) : null;
  }
}
class Js extends N {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = E`query( $metaType: String, $metaId: String, ) {
      Policy( metaType: $metaType, metaId: $metaId ) {
        molecularHash,
        position,
        metaType,
        metaId,
        conditions,
        callback,
        rule,
        createdAt
      }
    }`;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponsePolicy}
   */
  createResponse(e) {
    return new zs({
      query: this,
      json: e
    });
  }
}
class Gs extends W {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor({
    query: e,
    json: t
  }) {
    super({
      query: e,
      json: t,
      dataKey: "data.MetaTypeViaAtom"
    });
  }
  payload() {
    const e = this.data();
    if (!e || e.length === 0)
      return null;
    const t = {
      instances: {},
      instanceCount: {},
      paginatorInfo: {}
    }, n = e.pop();
    return n.instances && (t.instances = n.instances), n.instanceCount && (t.instanceCount = n.instanceCount), n.paginatorInfo && (t.paginatorInfo = n.paginatorInfo), t;
  }
}
class At extends N {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = E`query ($metaTypes: [String!], $metaIds: [String!], $values: [String!], $keys: [String!], $latest: Boolean, $filter: [MetaFilter!], $queryArgs: QueryArgs, $countBy: String, $atomValues: [String!], $cellSlugs: [String!] ) {
      MetaTypeViaAtom(
        metaTypes: $metaTypes
        metaIds: $metaIds
        atomValues: $atomValues
        cellSlugs: $cellSlugs
        filter: $filter,
        latest: $latest,
        queryArgs: $queryArgs
        countBy: $countBy
      ) {
        metaType,
        instanceCount {
          key,
          value
        },
        instances {
          metaType,
          metaId,
          createdAt,
          metas( values: $values, keys: $keys ) {
            molecularHash,
            position,
            key,
            value,
            createdAt
          }
        },
        paginatorInfo {
          currentPage,
          total
        }
      }
    }`;
  }
  /**
   * Builds a GraphQL-friendly variables object based on input fields
   *
   * @param {string|array|null} metaType
   * @param {string|array|null} metaId
   * @param {string|null} key
   * @param {string|null} value
   * @param {array|null} values
   * @param {array|null} keys
   * @param {array|null} atomValues
   * @param {boolean|null} latest
   * @param {array|null} filter
   * @param {object|null} queryArgs
   * @param {string|null} countBy
   * @param {string|null} cellSlug
   * @return {{}}
   */
  static createVariables({
    metaType: e = null,
    metaId: t = null,
    key: n = null,
    value: s = null,
    keys: r = null,
    values: i = null,
    atomValues: a = null,
    latest: c = null,
    filter: u = null,
    queryArgs: l = null,
    countBy: h = null,
    cellSlug: p = null
  }) {
    const d = {};
    return a && (d.atomValues = a), r && (d.keys = r), i && (d.values = i), e && (d.metaTypes = typeof e == "string" ? [e] : e), t && (d.metaIds = typeof t == "string" ? [t] : t), p && (d.cellSlugs = typeof p == "string" ? [p] : p), h && (d.countBy = h), u && (d.filter = u), n && s && (d.filter = d.filter || [], d.filter.push({
      key: n,
      value: s,
      comparison: "="
    })), d.latest = c === !0, l && ((typeof l.limit > "u" || l.limit === 0) && (l.limit = "*"), d.queryArgs = l), d;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaTypeViaAtom}
   */
  createResponse(e) {
    return new Gs({
      query: this,
      json: e
    });
  }
}
class Xs extends V {
}
class Zs extends U {
  /**
   *
   * @param {string} metaType
   * @param {string} metaId
   * @param {object[]} rule
   * @param {object} policy
   */
  fillMolecule({
    metaType: e,
    metaId: t,
    rule: n,
    policy: s
  }) {
    this.$__molecule.createRule({
      metaType: e,
      metaId: t,
      rule: n,
      policy: s
    }), this.$__molecule.sign({}), this.$__molecule.check();
  }
  /**
   * Builds a new Response object from a JSON string
   *
   * @param {object} json
   * @return {ResponseCreateRule}
   */
  createResponse(e) {
    return new Xs({
      query: this,
      json: e
    });
  }
}
class Ys extends U {
  /**
   * Fills the Molecule with provided wallet and amount data
   *
   * @param amount
   * @param tradeRates
   */
  fillMolecule({
    amount: e,
    tradeRates: t
  }) {
    this.$__molecule.initDepositBuffer({
      amount: e,
      tradeRates: t
    }), this.$__molecule.sign({}), this.$__molecule.check(this.$__molecule.sourceWallet);
  }
}
class er extends U {
  /**
   *
   * @param recipients
   * @param signingWallet
   */
  fillMolecule({
    recipients: e,
    signingWallet: t
  }) {
    this.$__molecule.initWithdrawBuffer({
      recipients: e,
      signingWallet: t
    }), this.$__molecule.sign({}), this.$__molecule.check(this.$__molecule.sourceWallet);
  }
}
function X(o, e, t, n) {
  return new (t || (t = Promise))((function(s, r) {
    function i(u) {
      try {
        c(n.next(u));
      } catch (l) {
        r(l);
      }
    }
    function a(u) {
      try {
        c(n.throw(u));
      } catch (l) {
        r(l);
      }
    }
    function c(u) {
      var l;
      u.done ? s(u.value) : (l = u.value, l instanceof t ? l : new t((function(h) {
        h(l);
      }))).then(i, a);
    }
    c((n = n.apply(o, [])).next());
  }));
}
function Z(o, e) {
  var t, n, s, r, i = { label: 0, sent: function() {
    if (1 & s[0]) throw s[1];
    return s[1];
  }, trys: [], ops: [] };
  return r = { next: a(0), throw: a(1), return: a(2) }, typeof Symbol == "function" && (r[Symbol.iterator] = function() {
    return this;
  }), r;
  function a(c) {
    return function(u) {
      return (function(l) {
        if (t) throw new TypeError("Generator is already executing.");
        for (; r && (r = 0, l[0] && (i = 0)), i; ) try {
          if (t = 1, n && (s = 2 & l[0] ? n.return : l[0] ? n.throw || ((s = n.return) && s.call(n), 0) : n.next) && !(s = s.call(n, l[1])).done) return s;
          switch (n = 0, s && (l = [2 & l[0], s.value]), l[0]) {
            case 0:
            case 1:
              s = l;
              break;
            case 4:
              return i.label++, { value: l[1], done: !1 };
            case 5:
              i.label++, n = l[1], l = [0];
              continue;
            case 7:
              l = i.ops.pop(), i.trys.pop();
              continue;
            default:
              if (s = i.trys, !((s = s.length > 0 && s[s.length - 1]) || l[0] !== 6 && l[0] !== 2)) {
                i = 0;
                continue;
              }
              if (l[0] === 3 && (!s || l[1] > s[0] && l[1] < s[3])) {
                i.label = l[1];
                break;
              }
              if (l[0] === 6 && i.label < s[1]) {
                i.label = s[1], s = l;
                break;
              }
              if (s && i.label < s[2]) {
                i.label = s[2], i.ops.push(l);
                break;
              }
              s[2] && i.ops.pop(), i.trys.pop();
              continue;
          }
          l = e.call(o, i);
        } catch (h) {
          l = [6, h], n = 0;
        } finally {
          t = s = 0;
        }
        if (5 & l[0]) throw l[1];
        return { value: l[0] ? l[1] : void 0, done: !0 };
      })([c, u]);
    };
  }
}
var R = { exclude: [], include: [], logging: !0 }, Ft = {}, tr = { timeout: "true" }, z = function(o, e) {
  typeof window < "u" && (Ft[o] = e);
}, nr = function() {
  return Object.fromEntries(Object.entries(Ft).filter((function(o) {
    var e, t = o[0];
    return !(!((e = R == null ? void 0 : R.exclude) === null || e === void 0) && e.includes(t));
  })).filter((function(o) {
    var e, t, n, s, r = o[0];
    return !((e = R == null ? void 0 : R.include) === null || e === void 0) && e.some((function(i) {
      return i.includes(".");
    })) ? (t = R == null ? void 0 : R.include) === null || t === void 0 ? void 0 : t.some((function(i) {
      return i.startsWith(r);
    })) : ((n = R == null ? void 0 : R.include) === null || n === void 0 ? void 0 : n.length) === 0 || ((s = R == null ? void 0 : R.include) === null || s === void 0 ? void 0 : s.includes(r));
  })).map((function(o) {
    return [o[0], (0, o[1])()];
  })));
};
function Ce(o) {
  return o ^= o >>> 16, o = Math.imul(o, 2246822507), o ^= o >>> 13, o = Math.imul(o, 3266489909), (o ^= o >>> 16) >>> 0;
}
var B = new Uint32Array([597399067, 2869860233, 951274213, 2716044179]);
function j(o, e) {
  return o << e | o >>> 32 - e;
}
function tt(o, e) {
  var t;
  if (e === void 0 && (e = 0), e = e ? 0 | e : 0, typeof o == "string" && (t = o, o = new TextEncoder().encode(t).buffer), !(o instanceof ArrayBuffer)) throw new TypeError("Expected key to be ArrayBuffer or string");
  var n = new Uint32Array([e, e, e, e]);
  (function(r, i) {
    for (var a = r.byteLength / 16 | 0, c = new Uint32Array(r, 0, 4 * a), u = 0; u < a; u++) {
      var l = c.subarray(4 * u, 4 * (u + 1));
      l[0] = Math.imul(l[0], B[0]), l[0] = j(l[0], 15), l[0] = Math.imul(l[0], B[1]), i[0] = i[0] ^ l[0], i[0] = j(i[0], 19), i[0] = i[0] + i[1], i[0] = Math.imul(i[0], 5) + 1444728091, l[1] = Math.imul(l[1], B[1]), l[1] = j(l[1], 16), l[1] = Math.imul(l[1], B[2]), i[1] = i[1] ^ l[1], i[1] = j(i[1], 17), i[1] = i[1] + i[2], i[1] = Math.imul(i[1], 5) + 197830471, l[2] = Math.imul(l[2], B[2]), l[2] = j(l[2], 17), l[2] = Math.imul(l[2], B[3]), i[2] = i[2] ^ l[2], i[2] = j(i[2], 15), i[2] = i[2] + i[3], i[2] = Math.imul(i[2], 5) + 2530024501, l[3] = Math.imul(l[3], B[3]), l[3] = j(l[3], 18), l[3] = Math.imul(l[3], B[0]), i[3] = i[3] ^ l[3], i[3] = j(i[3], 13), i[3] = i[3] + i[0], i[3] = Math.imul(i[3], 5) + 850148119;
    }
  })(o, n), (function(r, i) {
    var a = r.byteLength / 16 | 0, c = r.byteLength % 16, u = new Uint32Array(4), l = new Uint8Array(r, 16 * a, c);
    switch (c) {
      case 15:
        u[3] = u[3] ^ l[14] << 16;
      case 14:
        u[3] = u[3] ^ l[13] << 8;
      case 13:
        u[3] = u[3] ^ l[12] << 0, u[3] = Math.imul(u[3], B[3]), u[3] = j(u[3], 18), u[3] = Math.imul(u[3], B[0]), i[3] = i[3] ^ u[3];
      case 12:
        u[2] = u[2] ^ l[11] << 24;
      case 11:
        u[2] = u[2] ^ l[10] << 16;
      case 10:
        u[2] = u[2] ^ l[9] << 8;
      case 9:
        u[2] = u[2] ^ l[8] << 0, u[2] = Math.imul(u[2], B[2]), u[2] = j(u[2], 17), u[2] = Math.imul(u[2], B[3]), i[2] = i[2] ^ u[2];
      case 8:
        u[1] = u[1] ^ l[7] << 24;
      case 7:
        u[1] = u[1] ^ l[6] << 16;
      case 6:
        u[1] = u[1] ^ l[5] << 8;
      case 5:
        u[1] = u[1] ^ l[4] << 0, u[1] = Math.imul(u[1], B[1]), u[1] = j(u[1], 16), u[1] = Math.imul(u[1], B[2]), i[1] = i[1] ^ u[1];
      case 4:
        u[0] = u[0] ^ l[3] << 24;
      case 3:
        u[0] = u[0] ^ l[2] << 16;
      case 2:
        u[0] = u[0] ^ l[1] << 8;
      case 1:
        u[0] = u[0] ^ l[0] << 0, u[0] = Math.imul(u[0], B[0]), u[0] = j(u[0], 15), u[0] = Math.imul(u[0], B[1]), i[0] = i[0] ^ u[0];
    }
  })(o, n), (function(r, i) {
    i[0] = i[0] ^ r.byteLength, i[1] = i[1] ^ r.byteLength, i[2] = i[2] ^ r.byteLength, i[3] = i[3] ^ r.byteLength, i[0] = i[0] + i[1] | 0, i[0] = i[0] + i[2] | 0, i[0] = i[0] + i[3] | 0, i[1] = i[1] + i[0] | 0, i[2] = i[2] + i[0] | 0, i[3] = i[3] + i[0] | 0, i[0] = Ce(i[0]), i[1] = Ce(i[1]), i[2] = Ce(i[2]), i[3] = Ce(i[3]), i[0] = i[0] + i[1] | 0, i[0] = i[0] + i[2] | 0, i[0] = i[0] + i[3] | 0, i[1] = i[1] + i[0] | 0, i[2] = i[2] + i[0] | 0, i[3] = i[3] + i[0] | 0;
  })(o, n);
  var s = new Uint8Array(n.buffer);
  return Array.from(s).map((function(r) {
    return r.toString(16).padStart(2, "0");
  })).join("");
}
function sr(o, e) {
  return new Promise((function(t) {
    setTimeout((function() {
      return t(e);
    }), o);
  }));
}
function rr(o, e, t) {
  return Promise.all(o.map((function(n) {
    return Promise.race([n, sr(e, t)]);
  })));
}
var ir = "0.19.1";
function or() {
  return ir;
}
function jt() {
  return X(this, void 0, void 0, (function() {
    var o, e, t, n, s;
    return Z(this, (function(r) {
      switch (r.label) {
        case 0:
          return r.trys.push([0, 2, , 3]), o = nr(), e = Object.keys(o), [4, rr(Object.values(o), (R == null ? void 0 : R.timeout) || 1e3, tr)];
        case 1:
          return t = r.sent(), n = t.filter((function(i) {
            return i !== void 0;
          })), s = {}, n.forEach((function(i, a) {
            s[e[a]] = i;
          })), [2, Qt(s, R.exclude || [], R.include || [], "")];
        case 2:
          throw r.sent();
        case 3:
          return [2];
      }
    }));
  }));
}
function Qt(o, e, t, n) {
  n === void 0 && (n = "");
  for (var s = {}, r = function(u, l) {
    var h = n + u + ".";
    if (typeof l != "object" || Array.isArray(l)) {
      var p = e.some((function($) {
        return h.startsWith($);
      })), d = t.some((function($) {
        return h.startsWith($);
      }));
      p && !d || (s[u] = l);
    } else {
      var w = Qt(l, e, t, h);
      Object.keys(w).length > 0 && (s[u] = w);
    }
  }, i = 0, a = Object.entries(o); i < a.length; i++) {
    var c = a[i];
    r(c[0], c[1]);
  }
  return s;
}
function ar(o) {
  return X(this, void 0, void 0, (function() {
    var e, t;
    return Z(this, (function(n) {
      switch (n.label) {
        case 0:
          return n.trys.push([0, 2, , 3]), [4, jt()];
        case 1:
          return e = n.sent(), t = tt(JSON.stringify(e)), Math.random() < 1e-3 && R.logging && (function(s, r) {
            X(this, void 0, void 0, (function() {
              var i, a;
              return Z(this, (function(c) {
                switch (c.label) {
                  case 0:
                    if (i = "https://logging.thumbmarkjs.com/v1/log", a = { thumbmark: s, components: r, version: or() }, sessionStorage.getItem("_tmjs_l")) return [3, 4];
                    sessionStorage.setItem("_tmjs_l", "1"), c.label = 1;
                  case 1:
                    return c.trys.push([1, 3, , 4]), [4, fetch(i, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(a) })];
                  case 2:
                  case 3:
                    return c.sent(), [3, 4];
                  case 4:
                    return [2];
                }
              }));
            }));
          })(t, e), [2, t.toString()];
        case 2:
          throw n.sent();
        case 3:
          return [2];
      }
    }));
  }));
}
function lr(o) {
  for (var e = 0, t = 0; t < o.length; ++t) e += Math.abs(o[t]);
  return e;
}
function Dt(o, e, t) {
  for (var n = [], s = 0; s < o[0].data.length; s++) {
    for (var r = [], i = 0; i < o.length; i++) r.push(o[i].data[s]);
    n.push(cr(r));
  }
  var a = new Uint8ClampedArray(n);
  return new ImageData(a, e, t);
}
function cr(o) {
  if (o.length === 0) return 0;
  for (var e = {}, t = 0, n = o; t < n.length; t++)
    e[r = n[t]] = (e[r] || 0) + 1;
  var s = o[0];
  for (var r in e) e[r] > e[s] && (s = parseInt(r, 10));
  return s;
}
function ve() {
  if (typeof navigator > "u") return { name: "unknown", version: "unknown" };
  for (var o = navigator.userAgent, e = { Edg: "Edge", OPR: "Opera" }, t = 0, n = [/(?<name>Edge|Edg)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>(?:Chrome|Chromium|OPR|Opera|Vivaldi|Brave))\/(?<version>\d+(?:\.\d+)?)/, /(?<name>(?:Firefox|Waterfox|Iceweasel|IceCat))\/(?<version>\d+(?:\.\d+)?)/, /(?<name>Safari)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>MSIE|Trident|IEMobile).+?(?<version>\d+(?:\.\d+)?)/, /(?<name>[A-Za-z]+)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>SamsungBrowser)\/(?<version>\d+(?:\.\d+)?)/]; t < n.length; t++) {
    var s = n[t], r = o.match(s);
    if (r && r.groups) return { name: e[r.groups.name] || r.groups.name, version: r.groups.version };
  }
  return { name: "unknown", version: "unknown" };
}
z("audio", (function() {
  return X(this, void 0, void 0, (function() {
    return Z(this, (function(o) {
      return [2, new Promise((function(e, t) {
        try {
          var n = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 5e3, 44100), s = n.createBufferSource(), r = n.createOscillator();
          r.frequency.value = 1e3;
          var i, a = n.createDynamicsCompressor();
          a.threshold.value = -50, a.knee.value = 40, a.ratio.value = 12, a.attack.value = 0, a.release.value = 0.2, r.connect(a), a.connect(n.destination), r.start(), n.oncomplete = function(c) {
            i = c.renderedBuffer.getChannelData(0), e({ sampleHash: lr(i), oscillator: r.type, maxChannels: n.destination.maxChannelCount, channelCountMode: s.channelCountMode });
          }, n.startRendering();
        } catch (c) {
          console.error("Error creating audio fingerprint:", c), t(c);
        }
      }))];
    }));
  }));
}));
var ur = ve().name !== "SamsungBrowser" ? 1 : 3, vt = 280, xt = 20;
ve().name != "Firefox" && z("canvas", (function() {
  return document.createElement("canvas").getContext("2d"), new Promise((function(o) {
    var e = Array.from({ length: ur }, (function() {
      return (function() {
        var t = document.createElement("canvas"), n = t.getContext("2d");
        if (!n) return new ImageData(1, 1);
        t.width = vt, t.height = xt;
        var s = n.createLinearGradient(0, 0, t.width, t.height);
        s.addColorStop(0, "red"), s.addColorStop(0.16666666666666666, "orange"), s.addColorStop(0.3333333333333333, "yellow"), s.addColorStop(0.5, "green"), s.addColorStop(0.6666666666666666, "blue"), s.addColorStop(0.8333333333333334, "indigo"), s.addColorStop(1, "violet"), n.fillStyle = s, n.fillRect(0, 0, t.width, t.height);
        var r = "Random Text WMwmil10Oo";
        n.font = "23.123px Arial", n.fillStyle = "black", n.fillText(r, -5, 15), n.fillStyle = "rgba(0, 0, 255, 0.5)", n.fillText(r, -3.3, 17.7), n.beginPath(), n.moveTo(0, 0), n.lineTo(2 * t.width / 7, t.height), n.strokeStyle = "white", n.lineWidth = 2, n.stroke();
        var i = n.getImageData(0, 0, t.width, t.height);
        return i;
      })();
    }));
    o({ commonImageDataHash: tt(Dt(e, vt, xt).data.toString()).toString() });
  }));
}));
var Je, hr = ["Arial", "Arial Black", "Arial Narrow", "Arial Rounded MT", "Arimo", "Archivo", "Barlow", "Bebas Neue", "Bitter", "Bookman", "Calibri", "Cabin", "Candara", "Century", "Century Gothic", "Comic Sans MS", "Constantia", "Courier", "Courier New", "Crimson Text", "DM Mono", "DM Sans", "DM Serif Display", "DM Serif Text", "Dosis", "Droid Sans", "Exo", "Fira Code", "Fira Sans", "Franklin Gothic Medium", "Garamond", "Geneva", "Georgia", "Gill Sans", "Helvetica", "Impact", "Inconsolata", "Indie Flower", "Inter", "Josefin Sans", "Karla", "Lato", "Lexend", "Lucida Bright", "Lucida Console", "Lucida Sans Unicode", "Manrope", "Merriweather", "Merriweather Sans", "Montserrat", "Myriad", "Noto Sans", "Nunito", "Nunito Sans", "Open Sans", "Optima", "Orbitron", "Oswald", "Pacifico", "Palatino", "Perpetua", "PT Sans", "PT Serif", "Poppins", "Prompt", "Public Sans", "Quicksand", "Rajdhani", "Recursive", "Roboto", "Roboto Condensed", "Rockwell", "Rubik", "Segoe Print", "Segoe Script", "Segoe UI", "Sora", "Source Sans Pro", "Space Mono", "Tahoma", "Taviraj", "Times", "Times New Roman", "Titillium Web", "Trebuchet MS", "Ubuntu", "Varela Round", "Verdana", "Work Sans"], dr = ["monospace", "sans-serif", "serif"];
function It(o, e) {
  if (!o) throw new Error("Canvas context not supported");
  return o.font, o.font = "72px ".concat(e), o.measureText("WwMmLli0Oo").width;
}
function pr() {
  var o, e = document.createElement("canvas"), t = (o = e.getContext("webgl")) !== null && o !== void 0 ? o : e.getContext("experimental-webgl");
  if (t && "getParameter" in t) try {
    var n = (t.getParameter(t.VENDOR) || "").toString(), s = (t.getParameter(t.RENDERER) || "").toString(), r = { vendor: n, renderer: s, version: (t.getParameter(t.VERSION) || "").toString(), shadingLanguageVersion: (t.getParameter(t.SHADING_LANGUAGE_VERSION) || "").toString() };
    if (!s.length || !n.length) {
      var i = t.getExtension("WEBGL_debug_renderer_info");
      if (i) {
        var a = (t.getParameter(i.UNMASKED_VENDOR_WEBGL) || "").toString(), c = (t.getParameter(i.UNMASKED_RENDERER_WEBGL) || "").toString();
        a && (r.vendorUnmasked = a), c && (r.rendererUnmasked = c);
      }
    }
    return r;
  } catch {
  }
  return "undefined";
}
function fr() {
  var o = new Float32Array(1), e = new Uint8Array(o.buffer);
  return o[0] = 1 / 0, o[0] = o[0] - o[0], e[3];
}
function mr(o, e) {
  var t = {};
  return e.forEach((function(n) {
    var s = (function(r) {
      if (r.length === 0) return null;
      var i = {};
      r.forEach((function(u) {
        var l = String(u);
        i[l] = (i[l] || 0) + 1;
      }));
      var a = r[0], c = 1;
      return Object.keys(i).forEach((function(u) {
        i[u] > c && (a = u, c = i[u]);
      })), a;
    })(o.map((function(r) {
      return n in r ? r[n] : void 0;
    })).filter((function(r) {
      return r !== void 0;
    })));
    s && (t[n] = s);
  })), t;
}
function yr() {
  var o = [], e = { "prefers-contrast": ["high", "more", "low", "less", "forced", "no-preference"], "any-hover": ["hover", "none"], "any-pointer": ["none", "coarse", "fine"], pointer: ["none", "coarse", "fine"], hover: ["hover", "none"], update: ["fast", "slow"], "inverted-colors": ["inverted", "none"], "prefers-reduced-motion": ["reduce", "no-preference"], "prefers-reduced-transparency": ["reduce", "no-preference"], scripting: ["none", "initial-only", "enabled"], "forced-colors": ["active", "none"] };
  return Object.keys(e).forEach((function(t) {
    e[t].forEach((function(n) {
      matchMedia("(".concat(t, ": ").concat(n, ")")).matches && o.push("".concat(t, ": ").concat(n));
    }));
  })), o;
}
function gr() {
  if (window.location.protocol === "https:" && typeof window.ApplePaySession == "function") try {
    for (var o = window.ApplePaySession.supportsVersion, e = 15; e > 0; e--) if (o(e)) return e;
  } catch {
    return 0;
  }
  return 0;
}
ve().name != "Firefox" && z("fonts", (function() {
  var o = this;
  return new Promise((function(e, t) {
    try {
      (function(n) {
        var s;
        X(this, void 0, void 0, (function() {
          var r, i, a;
          return Z(this, (function(c) {
            switch (c.label) {
              case 0:
                return document.body ? [3, 2] : [4, (u = 50, new Promise((function(h) {
                  return setTimeout(h, u, l);
                })))];
              case 1:
                return c.sent(), [3, 0];
              case 2:
                if ((r = document.createElement("iframe")).setAttribute("frameBorder", "0"), (i = r.style).setProperty("position", "fixed"), i.setProperty("display", "block", "important"), i.setProperty("visibility", "visible"), i.setProperty("border", "0"), i.setProperty("opacity", "0"), r.src = "about:blank", document.body.appendChild(r), !(a = r.contentDocument || ((s = r.contentWindow) === null || s === void 0 ? void 0 : s.document))) throw new Error("Iframe document is not accessible");
                return n({ iframe: a }), setTimeout((function() {
                  document.body.removeChild(r);
                }), 0), [2];
            }
            var u, l;
          }));
        }));
      })((function(n) {
        var s = n.iframe;
        return X(o, void 0, void 0, (function() {
          var r, i, a, c;
          return Z(this, (function(u) {
            return r = s.createElement("canvas"), i = r.getContext("2d"), a = dr.map((function(l) {
              return It(i, l);
            })), c = {}, hr.forEach((function(l) {
              var h = It(i, l);
              a.includes(h) || (c[l] = h);
            })), e(c), [2];
          }));
        }));
      }));
    } catch {
      t({ error: "unsupported" });
    }
  }));
})), z("hardware", (function() {
  return new Promise((function(o, e) {
    var t = navigator.deviceMemory !== void 0 ? navigator.deviceMemory : 0, n = window.performance && window.performance.memory ? window.performance.memory : 0;
    o({ videocard: pr(), architecture: fr(), deviceMemory: t.toString() || "undefined", jsHeapSizeLimit: n.jsHeapSizeLimit || 0 });
  }));
})), z("locales", (function() {
  return new Promise((function(o) {
    o({ languages: navigator.language, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  }));
})), z("permissions", (function() {
  return X(this, void 0, void 0, (function() {
    var o;
    return Z(this, (function(e) {
      return Je = (R == null ? void 0 : R.permissions_to_check) || ["accelerometer", "accessibility", "accessibility-events", "ambient-light-sensor", "background-fetch", "background-sync", "bluetooth", "camera", "clipboard-read", "clipboard-write", "device-info", "display-capture", "gyroscope", "geolocation", "local-fonts", "magnetometer", "microphone", "midi", "nfc", "notifications", "payment-handler", "persistent-storage", "push", "speaker", "storage-access", "top-level-storage-access", "window-management", "query"], o = Array.from({ length: (R == null ? void 0 : R.retries) || 3 }, (function() {
        return (function() {
          return X(this, void 0, void 0, (function() {
            var t, n, s, r, i;
            return Z(this, (function(a) {
              switch (a.label) {
                case 0:
                  t = {}, n = 0, s = Je, a.label = 1;
                case 1:
                  if (!(n < s.length)) return [3, 6];
                  r = s[n], a.label = 2;
                case 2:
                  return a.trys.push([2, 4, , 5]), [4, navigator.permissions.query({ name: r })];
                case 3:
                  return i = a.sent(), t[r] = i.state.toString(), [3, 5];
                case 4:
                  return a.sent(), [3, 5];
                case 5:
                  return n++, [3, 1];
                case 6:
                  return [2, t];
              }
            }));
          }));
        })();
      })), [2, Promise.all(o).then((function(t) {
        return mr(t, Je);
      }))];
    }));
  }));
})), z("plugins", (function() {
  var o = [];
  if (navigator.plugins) for (var e = 0; e < navigator.plugins.length; e++) {
    var t = navigator.plugins[e];
    o.push([t.name, t.filename, t.description].join("|"));
  }
  return new Promise((function(n) {
    n({ plugins: o });
  }));
})), z("screen", (function() {
  return new Promise((function(o) {
    o({ is_touchscreen: navigator.maxTouchPoints > 0, maxTouchPoints: navigator.maxTouchPoints, colorDepth: screen.colorDepth, mediaMatches: yr() });
  }));
})), z("system", (function() {
  return new Promise((function(o) {
    var e = ve();
    o({ platform: window.navigator.platform, cookieEnabled: window.navigator.cookieEnabled, productSub: navigator.productSub, product: navigator.product, useragent: navigator.userAgent, hardwareConcurrency: navigator.hardwareConcurrency, browser: { name: e.name, version: e.version }, applePayVersion: gr() });
  }));
}));
var P, wr = ve().name !== "SamsungBrowser" ? 1 : 3, f = null;
z("webgl", (function() {
  return X(this, void 0, void 0, (function() {
    var o;
    return Z(this, (function(e) {
      typeof document < "u" && ((P = document.createElement("canvas")).width = 200, P.height = 100, f = P.getContext("webgl"));
      try {
        if (!f) throw new Error("WebGL not supported");
        return o = Array.from({ length: wr }, (function() {
          return (function() {
            try {
              if (!f) throw new Error("WebGL not supported");
              var t = `
          attribute vec2 position;
          void main() {
              gl_Position = vec4(position, 0.0, 1.0);
          }
      `, n = `
          precision mediump float;
          void main() {
              gl_FragColor = vec4(0.812, 0.195, 0.553, 0.921); // Set line color
          }
      `, s = f.createShader(f.VERTEX_SHADER), r = f.createShader(f.FRAGMENT_SHADER);
              if (!s || !r) throw new Error("Failed to create shaders");
              if (f.shaderSource(s, t), f.shaderSource(r, n), f.compileShader(s), !f.getShaderParameter(s, f.COMPILE_STATUS)) throw new Error("Vertex shader compilation failed: " + f.getShaderInfoLog(s));
              if (f.compileShader(r), !f.getShaderParameter(r, f.COMPILE_STATUS)) throw new Error("Fragment shader compilation failed: " + f.getShaderInfoLog(r));
              var i = f.createProgram();
              if (!i) throw new Error("Failed to create shader program");
              if (f.attachShader(i, s), f.attachShader(i, r), f.linkProgram(i), !f.getProgramParameter(i, f.LINK_STATUS)) throw new Error("Shader program linking failed: " + f.getProgramInfoLog(i));
              f.useProgram(i);
              for (var a = 137, c = new Float32Array(4 * a), u = 2 * Math.PI / a, l = 0; l < a; l++) {
                var h = l * u;
                c[4 * l] = 0, c[4 * l + 1] = 0, c[4 * l + 2] = Math.cos(h) * (P.width / 2), c[4 * l + 3] = Math.sin(h) * (P.height / 2);
              }
              var p = f.createBuffer();
              f.bindBuffer(f.ARRAY_BUFFER, p), f.bufferData(f.ARRAY_BUFFER, c, f.STATIC_DRAW);
              var d = f.getAttribLocation(i, "position");
              f.enableVertexAttribArray(d), f.vertexAttribPointer(d, 2, f.FLOAT, !1, 0, 0), f.viewport(0, 0, P.width, P.height), f.clearColor(0, 0, 0, 1), f.clear(f.COLOR_BUFFER_BIT), f.drawArrays(f.LINES, 0, 2 * a);
              var w = new Uint8ClampedArray(P.width * P.height * 4);
              return f.readPixels(0, 0, P.width, P.height, f.RGBA, f.UNSIGNED_BYTE, w), new ImageData(w, P.width, P.height);
            } catch {
              return new ImageData(1, 1);
            } finally {
              f && (f.bindBuffer(f.ARRAY_BUFFER, null), f.useProgram(null), f.viewport(0, 0, f.drawingBufferWidth, f.drawingBufferHeight), f.clearColor(0, 0, 0, 0));
            }
          })();
        })), [2, { commonImageHash: tt(Dt(o, P.width, P.height).data.toString()).toString() }];
      } catch {
        return [2, { webgl: "unsupported" }];
      }
      return [2];
    }));
  }));
}));
var re = function(o, e, t, n) {
  for (var s = (t - e) / n, r = 0, i = 0; i < n; i++)
    r += o(e + (i + 0.5) * s);
  return r * s;
};
z("math", (function() {
  return X(void 0, void 0, void 0, (function() {
    return Z(this, (function(o) {
      return [2, { acos: Math.acos(0.5), asin: re(Math.asin, -1, 1, 97), atan: re(Math.atan, -1, 1, 97), cos: re(Math.cos, 0, Math.PI, 97), cosh: Math.cosh(9 / 7), e: Math.E, largeCos: Math.cos(1e20), largeSin: Math.sin(1e20), largeTan: Math.tan(1e20), log: Math.log(1e3), pi: Math.PI, sin: re(Math.sin, -Math.PI, Math.PI, 97), sinh: re(Math.sinh, -9 / 7, 7 / 9, 97), sqrt: Math.sqrt(2), tan: re(Math.tan, 0, 2 * Math.PI, 97), tanh: re(Math.tanh, -9 / 7, 7 / 9, 97) }];
    }));
  }));
}));
class br {
  constructor({ serverUri: e, socket: t = null, encrypt: n = !1 }) {
    this.$__client = this.createUrqlClient({ serverUri: e, socket: t, encrypt: n }), this.$__authToken = "", this.$__pubkey = null, this.$__wallet = null, this.serverUri = e, this.soketi = t, this.cipherLink = !!n, this.$__subscriptionManager = /* @__PURE__ */ new Map();
  }
  createUrqlClient({ serverUri: e, socket: t, encrypt: n }) {
    const s = [Gt, Xt];
    if (t && t.socketUri) {
      const r = en({
        url: t.socketUri,
        connectionParams: () => ({
          authToken: this.$__authToken
        })
      });
      s.push(Zt({
        forwardSubscription: (i) => ({
          subscribe: (a) => ({ unsubscribe: r.subscribe(i, a) })
        })
      }));
    }
    return Yt({
      url: e,
      exchanges: s,
      fetchOptions: () => ({
        headers: {
          "X-Auth-Token": this.$__authToken
        },
        // Add 60 second timeout for debugging
        signal: AbortSignal.timeout(6e4)
      })
    });
  }
  setAuthData({ token: e, pubkey: t, wallet: n }) {
    this.$__authToken = e, this.$__pubkey = t, this.$__wallet = n, this.$__client = this.createUrqlClient({
      serverUri: this.serverUri,
      socket: this.soketi,
      encrypt: !!this.cipherLink
    });
  }
  async query(e) {
    const { query: t, variables: n } = e, s = await this.$__client.query(t, n).toPromise();
    return this.formatResponse(s);
  }
  async mutate(e) {
    const { mutation: t, variables: n } = e, s = await this.$__client.mutation(t, n).toPromise();
    return this.formatResponse(s);
  }
  subscribe(e, t) {
    const { query: n, variables: s, operationName: r } = e, { unsubscribe: i } = tn(
      this.$__client.subscription(n, s),
      nn((a) => {
        t(this.formatResponse(a));
      })
    ).subscribe(() => {
    });
    return this.$__subscriptionManager.set(r, { unsubscribe: i }), {
      unsubscribe: () => this.unsubscribe(r)
    };
  }
  formatResponse(e) {
    return {
      data: e.data,
      errors: e.error ? [e.error] : void 0
    };
  }
  socketDisconnect() {
    this.soketi && this.unsubscribeAll();
  }
  unsubscribe(e) {
    const t = this.$__subscriptionManager.get(e);
    t && (t.unsubscribe(), this.$__subscriptionManager.delete(e));
  }
  unsubscribeAll() {
    this.$__subscriptionManager.forEach((e, t) => {
      this.unsubscribe(t);
    });
  }
  unsubscribeFromChannel(e) {
    this.unsubscribe(e);
  }
  setEncryption(e = !1) {
    this.cipherLink = e, this.$__client = this.createUrqlClient({
      serverUri: this.serverUri,
      socket: this.soketi,
      encrypt: e
    });
  }
  getAuthToken() {
    return this.$__authToken;
  }
  getPubKey() {
    return this.$__pubkey;
  }
  getWallet() {
    return this.$__wallet;
  }
  getServerUri() {
    return this.serverUri;
  }
  getSocketUri() {
    return this.soketi ? this.soketi.socketUri : null;
  }
  getUri() {
    return this.serverUri;
  }
  setUri(e) {
    this.serverUri = e, this.$__client = this.createUrqlClient({
      serverUri: e,
      socket: this.soketi,
      encrypt: !!this.cipherLink
    });
  }
  setSocketUri({ socketUri: e, appKey: t }) {
    this.soketi = { socketUri: e, appKey: t }, this.$__client = this.createUrqlClient({
      serverUri: this.serverUri,
      socket: this.soketi,
      encrypt: !!this.cipherLink
    });
  }
}
class xr {
  /**
   * Class constructor
   *
   * @param {string} uri
   * @param {string|null} cellSlug
   * @param {object|null} socket
   * @param {UrqlClientWrapper|null} client
   * @param {number} serverSdkVersion
   * @param {boolean} logging
   */
  constructor({
    uri: e,
    cellSlug: t = null,
    client: n = null,
    socket: s = null,
    serverSdkVersion: r = 3,
    logging: i = !1
  }) {
    this.initialize({
      uri: e,
      cellSlug: t,
      socket: s,
      client: n,
      serverSdkVersion: r,
      logging: i
    });
  }
  /**
   * Initializes a new Knish.IO client session
   *
   * @param {string|[]} uri
   * @param {string|null} cellSlug
   * @param {object|null} socket
   * @param {UrqlClientWrapper|null} client
   * @param {number} serverSdkVersion
   * @param {boolean} logging
   */
  initialize({
    uri: e,
    cellSlug: t = null,
    socket: n = null,
    client: s = null,
    serverSdkVersion: r = 3,
    logging: i = !1
  }) {
    this.reset(), this.$__logging = i, this.$__authTokenObjects = {}, this.$__authInProcess = !1, this.abortControllers = /* @__PURE__ */ new Map(), this.setUri(e), t && this.setCellSlug(t);
    for (const a in this.$__uris) {
      const c = this.$__uris[a];
      this.$__authTokenObjects[c] = null;
    }
    this.log("info", `KnishIOClient::initialize() - Initializing new Knish.IO client session for SDK version ${r}...`), this.$__client = s || new br({
      socket: {
        socketUri: null,
        appKey: "knishio",
        ...n || {}
      },
      serverUri: this.getRandomUri()
    }), this.$__serverSdkVersion = r;
  }
  /**
   * Get random uri from specified this.$__uris
   *
   * @return {string}
   */
  getRandomUri() {
    const e = Math.floor(Math.random() * this.$__uris.length);
    return this.$__uris[e];
  }
  /**
   *
   * @param encrypt
   * @return {boolean}
   */
  switchEncryption(e) {
    return this.$__encrypt === e ? !1 : (this.log("info", `KnishIOClient::switchEncryption() - Forcing encryption ${e ? "on" : "off"} to match node...`), this.$__encrypt = e, this.$__client.setEncryption(e), !0);
  }
  /**
   * De-initializes the Knish.IO client session so that a new session can replace it
   */
  deinitialize() {
    this.log("info", "KnishIOClient::deinitialize() - Clearing the Knish.IO client session..."), this.reset();
  }
  /**
   * Subscribes the client to the node's broadcast socket
   *
   * @return {UrqlClientWrapper}
   */
  subscribe() {
    if (!this.client().getSocketUri())
      throw new ee("KnishIOClient::subscribe() - Socket client not initialized!");
    return this.client();
  }
  /**
   * Gets the client's SDK version
   *
   * @return {number}
   */
  getServerSdkVersion() {
    return this.$__serverSdkVersion;
  }
  /**
   * Reset common properties
   */
  reset() {
    this.$__secret = "", this.$__bundle = "", this.remainderWallet = null;
  }
  /**
   * Returns the currently defined Cell identifier for this session
   *
   * @return {string|null}
   */
  getCellSlug() {
    return this.$__cellSlug || null;
  }
  /**
   * Sets the Cell identifier for this session
   *
   * @param {string} cellSlug
   */
  setCellSlug(e) {
    this.$__cellSlug = e;
  }
  /**
   * Sets the endpoint URI for this session
   *
   * @param {string|object} uri
   */
  setUri(e) {
    if (this.$__uris = typeof e == "object" ? e : [e], this.$__client) {
      const t = this.getRandomUri();
      this.$__client.setUri(t);
    }
  }
  /**
   * Retrieves the endpoint URI for this session
   *
   * @return {string}
   */
  getUri() {
    return this.$__client.getUri();
  }
  /**
   * Returns the GraphQL client class session
   *
   * @return {UrqlClientWrapper}
   */
  client() {
    if (!this.$__authInProcess) {
      const e = this.getRandomUri();
      this.$__client.setUri(e);
      const t = this.$__authTokenObjects[e];
      t ? this.$__client.setAuthData(t.getAuthData()) : this.requestAuthToken({
        secret: this.$__secret,
        cellSlug: this.$__cellSlug,
        encrypt: this.$__encrypt
      }).catch((n) => {
        this.log("warn", `KnishIOClient::client() - Background authorization failed: ${n.message}`);
      });
    }
    return this.$__client;
  }
  /**
   * Returns whether a secret is being stored for this session
   *
   * @return {boolean}
   */
  hasSecret() {
    return !!this.$__secret;
  }
  /**
   * Set the client's secret
   *
   * @param secret
   */
  setSecret(e) {
    this.$__secret = e, this.$__bundle = this.hashSecret(e, "setSecret");
  }
  /**
   * Hashes the user secret to produce a bundle hash
   * @param {string} secret
   * @param {string|null} source
   * @returns {string}
   */
  hashSecret(e, t = null) {
    return this.log("info", `KnishIOClient::hashSecret(${t ? `source: ${t}` : ""}) - Computing wallet bundle from secret...`), de(e);
  }
  /**
   * Retrieves the stored secret for this session
   *
   * @return {string}
   */
  getSecret() {
    if (!this.hasSecret())
      throw new Be("KnishIOClient::getSecret() - Unable to find a stored secret! Have you set a secret?");
    return this.$__secret;
  }
  /**
   * Returns whether a bundle hash is being stored for this session
   *
   * @return {boolean}
   */
  hasBundle() {
    return !!this.$__bundle;
  }
  /**
   * Returns the bundle hash for this session
   *
   * @return {string}
   */
  getBundle() {
    if (!this.hasBundle())
      throw new Be("KnishIOClient::getBundle() - Unable to find a stored bundle! Have you set a secret?");
    return this.$__bundle;
  }
  /**
   * Retrieves the device fingerprint.
   *
   * @returns {Promise<string>} A promise that resolves to the device fingerprint as a string.
   */
  getFingerprint() {
    return ar();
  }
  getFingerprintData() {
    return jt();
  }
  /**
   * Retrieves this session's wallet used for signing the next Molecule
   *
   * @return {Promise<*|Wallet|null>}
   */
  async getSourceWallet() {
    let e = (await this.queryContinuId({
      bundle: this.getBundle()
    })).payload();
    return e ? e.key = S.generateKey({
      secret: this.getSecret(),
      token: e.token,
      position: e.position
    }) : e = new S({
      secret: this.getSecret()
    }), e;
  }
  /**
   * Retrieves this session's remainder wallet
   *
   * @return {null}
   */
  getRemainderWallet() {
    return this.remainderWallet;
  }
  /**
   * Instantiates a new Molecule and prepares this client session to operate on it
   *
   * @param secret
   * @param bundle
   * @param sourceWallet
   * @param remainderWallet
   * @return {Promise<Molecule>}
   */
  async createMolecule({
    secret: e = null,
    bundle: t = null,
    sourceWallet: n = null,
    remainderWallet: s = null
  }) {
    return this.log("info", "KnishIOClient::createMolecule() - Creating a new molecule..."), e = e || this.getSecret(), t = t || this.getBundle(), !n && this.lastMoleculeQuery && this.getRemainderWallet().token === "USER" && this.lastMoleculeQuery.response() && this.lastMoleculeQuery.response().success() && (n = this.getRemainderWallet()), n === null && (n = await this.getSourceWallet()), this.remainderWallet = s || S.create({
      secret: e,
      bundle: t,
      token: "USER",
      batchId: n.batchId,
      characters: n.characters
    }), new J({
      secret: e,
      sourceWallet: n,
      remainderWallet: this.getRemainderWallet(),
      cellSlug: this.getCellSlug(),
      version: this.getServerSdkVersion()
    });
  }
  /**
   * Builds a new instance of the provided Query class
   *
   * @param QueryClass
   * @return {*}
   */
  createQuery(e) {
    return new e(this.client(), this);
  }
  /**
   * Builds a new instance of the provided Subscription class
   *
   * @param SubscribeClass
   * @return {*}
   */
  createSubscribe(e) {
    return new e(this.subscribe());
  }
  /**
   * Uses the supplied Mutation class to build a new tailored Molecule
   *
   * @param mutationClass
   * @param molecule
   */
  async createMoleculeMutation({
    mutationClass: e,
    molecule: t = null
  }) {
    this.log("info", `KnishIOClient::createMoleculeQuery() - Creating a new ${e.name} query...`);
    const n = t || await this.createMolecule({}), s = new e(this.client(), this, n);
    if (!(s instanceof U))
      throw new ee(`${this.constructor.name}::createMoleculeMutation() - This method only accepts MutationProposeMolecule!`);
    return this.lastMoleculeQuery = s, s;
  }
  /**
   *
   * @param query
   * @param variables
   * @returns {Promise<*>}
   */
  async executeQuery(e, t = null) {
    this.$__authToken && this.$__authToken.isExpired() && !this.$__authInProcess && (this.log("info", "KnishIOClient::executeQuery() - Access token is expired. Getting new one..."), await this.requestAuthToken({
      secret: this.$__secret,
      cellSlug: this.$__cellSlug,
      encrypt: this.$__encrypt
    }));
    const n = new AbortController(), s = JSON.stringify({
      query: e.$__query,
      variables: t
    });
    this.abortControllers.set(s, n);
    try {
      const r = await e.execute({
        variables: t,
        context: {
          fetchOptions: {
            signal: n.signal
          }
        }
      });
      return this.abortControllers.delete(s), r;
    } catch (r) {
      if (r.name === "AbortError")
        this.log("warn", "Query was cancelled");
      else
        throw r;
    }
  }
  cancelQuery(e, t = null) {
    const n = JSON.stringify({
      query: e.$__query,
      variables: t
    }), s = this.abortControllers.get(n);
    s && (s.abort(), this.abortControllers.delete(n));
  }
  cancelAllQueries() {
    for (const e of this.abortControllers.values())
      e.abort();
    this.abortControllers.clear();
  }
  /**
   * Retrieves the balance wallet for a specified Knish.IO identity and token slug
   *
   * @param {string} token
   * @param {string|null} bundle
   * @param {string} type
   * @returns {Promise<*>}
   */
  async queryBalance({
    token: e,
    bundle: t = null,
    type: n = "regular"
  }) {
    const s = this.createQuery(us);
    return this.executeQuery(s, {
      bundleHash: t || this.getBundle(),
      token: e,
      type: n
    });
  }
  /**
   *
   * @param {string} token
   * @param {number} amount
   * @param {string} type
   * @returns {Promise<{address}|{position}|*>}
   */
  async querySourceWallet({
    token: e,
    amount: t,
    type: n = "regular"
  }) {
    const s = (await this.queryBalance({
      token: e,
      type: n
    })).payload();
    if (s === null || ue.cmp(s.balance, t) < 0)
      throw new Y();
    if (!s.position || !s.address)
      throw new Y("Source wallet can not be a shadow wallet.");
    return s;
  }
  /**
   * @param {string|null} bundle
   * @param {function} closure
   * @return {Promise<string>}
   */
  async subscribeCreateMolecule({
    bundle: e,
    closure: t
  }) {
    return await this.createSubscribe(qs).execute({
      variables: {
        bundle: e || this.getBundle()
      },
      closure: t
    });
  }
  /**
   * Creates a subscription for updating Wallet status
   *
   * @param {string|null} bundle
   * @param {string} token
   * @param {function} closure
   * @return {string}
   */
  subscribeWalletStatus({
    bundle: e,
    token: t,
    closure: n
  }) {
    if (!t)
      throw new ee(`${this.constructor.name}::subscribeWalletStatus() - Token parameter is required!`);
    return this.createSubscribe(Bs).execute({
      variables: {
        bundle: e || this.getBundle(),
        token: t
      },
      closure: n
    });
  }
  /**
   *  Creates a subscription for updating active Wallet
   *
   * @param {string|null} bundle
   * @param {function} closure
   * @return {string}
   */
  subscribeActiveWallet({
    bundle: e,
    closure: t
  }) {
    return this.createSubscribe(Hs).execute({
      variables: {
        bundle: e || this.getBundle()
      },
      closure: t
    });
  }
  /**
   * Creates a subscription for updating list of active sessions for a given MetaType
   *
   * @param {string} metaType
   * @param {string} metaId
   * @param {function} closure
   * @return {*}
   */
  subscribeActiveSession({
    metaType: e,
    metaId: t,
    closure: n
  }) {
    return this.createSubscribe(Ps).execute({
      variables: {
        metaType: e,
        metaId: t
      },
      closure: n
    });
  }
  /**
   * Unsubscribes from a given subscription name
   *
   * @param {string} operationName
   */
  unsubscribe(e) {
    this.subscribe().unsubscribe(e);
  }
  unsubscribeAll() {
    this.subscribe().unsubscribeAll();
  }
  /**
   * Retrieves metadata for the given metaType and provided parameters
   *
   * @param {string|array|null} metaType
   * @param {string|array|null} metaId
   * @param {string|array|null} key
   * @param {string|array|null} value
   * @param {boolean|null} latest
   * @param {object|null} fields
   * @param {object|null} filter
   * @param {object|null} queryArgs
   * @param {string|null} count
   * @param {string|null} countBy
   * @param {boolean} throughAtom
   * @param {array|null} values
   * @param {array|null} keys
   * @param {array|null} atomValues
   * @return {Promise<ResponseMetaType>}
   */
  queryMeta({
    metaType: e,
    metaId: t = null,
    key: n = null,
    value: s = null,
    latest: r = !0,
    fields: i = null,
    filter: a = null,
    queryArgs: c = null,
    count: u = null,
    countBy: l = null,
    throughAtom: h = !0,
    values: p = null,
    keys: d = null,
    atomValues: w = null
  }) {
    this.log("info", `KnishIOClient::queryMeta() - Querying metaType: ${e}, metaId: ${t}...`);
    let $, T;
    return h ? ($ = this.createQuery(At), T = At.createVariables({
      metaType: e,
      metaId: t,
      key: n,
      value: s,
      latest: r,
      filter: a,
      queryArgs: c,
      countBy: l,
      values: p,
      keys: d,
      atomValues: w,
      cellSlug: this.getCellSlug()
    })) : ($ = this.createQuery(kt), T = kt.createVariables({
      metaType: e,
      metaId: t,
      key: n,
      value: s,
      latest: r,
      filter: a,
      queryArgs: c,
      count: u,
      countBy: l,
      cellSlug: this.getCellSlug()
    })), this.executeQuery($, T);
  }
  /**
   * Query batch to get cascading meta instances by batchID
   *
   * @param batchId
   * @return {Promise<*>}
   */
  async queryBatch({
    batchId: e
  }) {
    this.log("info", `KnishIOClient::queryBatch() - Querying cascading meta instances for batchId: ${e}...`);
    const t = this.createQuery(Ae);
    return await this.executeQuery(t, {
      batchId: e
    });
  }
  /**
   * Query batch history to get cascading meta instances by batchID
   *
   * @param batchId
   * @return {Promise<*>}
   */
  async queryBatchHistory({
    batchId: e
  }) {
    this.log("info", `KnishIOClient::queryBatchHistory() - Querying cascading meta instances for batchId: ${e}...`);
    const t = this.createQuery(ds);
    return await this.executeQuery(t, {
      batchId: e
    });
  }
  /**
   * Queries atom instances based on the provided parameters.
   *
   * @param {string[]} molecularHashes - Array of multiple molecular hashes.
   * @param {string} molecularHash - Single molecular hash.
   * @param {string[]} bundleHashes - Array of multiple bundle hashes.
   * @param {string} bundleHash - Single bundle hash.
   * @param {number[]} positions - Array of multiple positions.
   * @param {number} position - Single position.
   * @param {string[]} walletAddresses - Array of multiple wallet addresses.
   * @param {string} walletAddress - Single wallet address.
   * @param {string[]} isotopes - Array of multiple isotopes.
   * @param {string} isotope - Single isotope.
   * @param {string[]} tokenSlugs - Array of multiple token slugs.
   * @param {string} tokenSlug - Single token slug.
   * @param {string[]} cellSlugs - Array of multiple cell slugs.
   * @param {string} cellSlug - Single cell slug.
   * @param {string[]} batchIds - Array of multiple batch IDs.
   * @param {string} batchId - Single batch ID.
   * @param {any[]} values - Array of multiple values.
   * @param {any} value - Single value.
   * @param {string[]} metaTypes - Array of multiple meta types.
   * @param {string} metaType - Single meta type.
   * @param {string[]} metaIds - Array of multiple meta IDs.
   * @param {string} metaId - Single meta ID.
   * @param {string[]} indexes - Array of multiple atom indices.
   * @param {string} index - Single atom index.
   * @param {object} filter - The filter object.
   * @param {boolean} latest - The latest flag.
   * @param {object} [queryArgs] - The query arguments (limit, offset).
   * @param {number} [queryArgs.limit=15] - The limit.
   * @param {number} [queryArgs.offset=1] - The offset.
   *
   * @returns {Promise<ResponseAtom>} - A promise that resolves with the queried atom instances.
   */
  async queryAtom({
    molecularHashes: e,
    molecularHash: t,
    bundleHashes: n,
    bundleHash: s,
    positions: r,
    position: i,
    walletAddresses: a,
    walletAddress: c,
    isotopes: u,
    isotope: l,
    tokenSlugs: h,
    tokenSlug: p,
    cellSlugs: d,
    cellSlug: w,
    batchIds: $,
    batchId: T,
    values: m,
    value: y,
    metaTypes: b,
    metaType: M,
    metaIds: k,
    metaId: A,
    indexes: v,
    index: I,
    filter: _,
    latest: q,
    queryArgs: O = {
      limit: 15,
      offset: 1
    }
  }) {
    this.log("info", "KnishIOClient::queryAtom() - Querying atom instances");
    const ce = this.createQuery($t);
    return await this.executeQuery(ce, $t.createVariables({
      molecularHashes: e,
      molecularHash: t,
      bundleHashes: n,
      bundleHash: s,
      positions: r,
      position: i,
      walletAddresses: a,
      walletAddress: c,
      isotopes: u,
      isotope: l,
      tokenSlugs: h,
      tokenSlug: p,
      cellSlugs: d,
      cellSlug: w,
      batchIds: $,
      batchId: T,
      values: m,
      value: y,
      metaTypes: b,
      metaType: M,
      metaIds: k,
      metaId: A,
      indexes: v,
      index: I,
      filter: _,
      latest: q,
      queryArgs: O
    }));
  }
  /**
   * Builds and executes a molecule to issue a new Wallet on the ledger
   *
   * @param {string} token - The token slug for the new wallet
   * @returns {Promise<ResponseCreateWallet>} - A Promise that resolves with the result of the execution.
   */
  async createWallet({
    token: e
  }) {
    const t = new S({
      secret: this.getSecret(),
      token: e
    }), n = await this.createMoleculeMutation({
      mutationClass: Os
    });
    return n.fillMolecule(t), await this.executeQuery(n);
  }
  /**
   * Queries the ledger to retrieve a list of active sessions for the given MetaType
   *
   * @param {string} bundleHash - The hash of the session bundle.
   * @param {string} metaType - The type of metadata associated with the session.
   * @param {string} metaId - The ID of the metadata associated with the session.
   * @returns {Promise<ResponseQueryActiveSession>} - Returns a promise containing the result of the query.
   */
  async queryActiveSession({
    bundleHash: e,
    metaType: t,
    metaId: n
  }) {
    const s = this.createQuery(Fs);
    return await this.executeQuery(s, {
      bundleHash: e,
      metaType: t,
      metaId: n
    });
  }
  /**
   * Queries user activity based on the provided parameters.
   *
   * @param {string} bundleHash - The bundle hash.
   * @param {string} metaType - The meta type.
   * @param {string} metaId - The meta ID.
   * @param {string} ipAddress - The IP address.
   * @param {string} browser - The browser.
   * @param {string} osCpu - The operating system and CPU.
   * @param {string} resolution - The screen resolution.
   * @param {string} timeZone - The time zone.
   * @param {string} countBy - The count by parameter.
   * @param {string} interval - The interval parameter.
   *
   * @returns {Promise<ResponseQueryUserActivity>} The result of the query.
   */
  async queryUserActivity({
    bundleHash: e,
    metaType: t,
    metaId: n,
    ipAddress: s,
    browser: r,
    osCpu: i,
    resolution: a,
    timeZone: c,
    countBy: u,
    interval: l
  }) {
    const h = this.createQuery(Qs);
    return await this.executeQuery(h, {
      bundleHash: e,
      metaType: t,
      metaId: n,
      ipAddress: s,
      browser: r,
      osCpu: i,
      resolution: a,
      timeZone: c,
      countBy: u,
      interval: l
    });
  }
  /**
   * Builds and executes a molecule to declare an active session for the given MetaType
   *
   * @param {Object} options - The options for activating a session.
   * @param {string} options.bundle - The bundle hash.
   * @param {string} options.metaType - The meta type.
   * @param {string} options.metaId - The meta ID.
   * @param {string} options.ipAddress - The client's IP address.
   * @param {string} options.browser - The client's browser.
   * @param {string} options.osCpu - The client's operating system and CPU.
   * @param {string} options.resolution - The client's screen resolution.
   * @param {string} options.timeZone - The client's time zone.
   * @param {Object} [options.json={}] - Additional JSON data.
   * @returns {Promise<ResponseActiveSession>} A promise that resolves with the result of the activation.
   */
  async activeSession({
    bundle: e,
    metaType: t,
    metaId: n,
    ipAddress: s,
    browser: r,
    osCpu: i,
    resolution: a,
    timeZone: c,
    json: u = {}
  }) {
    const l = this.createQuery(Ns);
    return await this.executeQuery(l, {
      bundleHash: e,
      metaType: t,
      metaId: n,
      ipAddress: s,
      browser: r,
      osCpu: i,
      resolution: a,
      timeZone: c,
      json: JSON.stringify(u)
    });
  }
  /**
   * Creates a new token with the given parameters.
   *
   * @param {object} options - The options for creating the token.
   * @param {string} options.token - The token identifier.
   * @param {number} [options.amount] - The amount of tokens to create.
   * @param {object} [options.meta] - Additional metadata for the token.
   * @param {string} [options.batchId] - The batch identifier for stackable tokens.
   * @param {array} [options.units] - The unit IDs for the token.
   *
   * @throws {StackableUnitDecimalsException} If a stackable token has decimals.
   * @throws {StackableUnitAmountException} If stackable units are provided with an amount.
   *
   * @returns {Promise<ResponseCreateToken>} A Promise that resolves to the result of creating the token.
   */
  async createToken({
    token: e,
    amount: t = null,
    meta: n = null,
    batchId: s = null,
    units: r = []
  }) {
    const i = C.get(n || {}, "fungibility");
    if (i === "stackable" && (n.batchId = s || Ue({})), ["nonfungible", "stackable"].includes(i) && r.length > 0) {
      if (C.get(n || {}, "decimals") > 0)
        throw new Us();
      if (t > 0)
        throw new Te();
      t = r.length, n.splittable = 1, n.decimals = 0, n.tokenUnits = JSON.stringify(r);
    }
    const a = new S({
      secret: this.getSecret(),
      bundle: this.getBundle(),
      token: e,
      batchId: s
    }), c = await this.createMoleculeMutation({
      mutationClass: ys
    });
    return c.fillMolecule({
      recipientWallet: a,
      amount: t,
      meta: n || {}
    }), await this.executeQuery(c);
  }
  /**
   * Creates a new rule with the specified parameters.
   *
   * @param {string} metaType - The type of the metadata associated with the rule.
   * @param {string} metaId - The ID of the metadata associated with the rule.
   * @param {object} rule - The rule object.
   * @param {object} [policy={}] - The policy object. (optional)
   * @returns {Promise<ResponseCreateRule>} - A promise that resolves to the created rule.
   */
  async createRule({
    metaType: e,
    metaId: t,
    rule: n,
    policy: s = {}
  }) {
    const r = await this.createMoleculeMutation(
      {
        mutationClass: Zs,
        molecule: await this.createMolecule({
          secret: this.getSecret(),
          sourceWallet: await this.getSourceWallet()
        })
      }
    );
    return r.fillMolecule({
      metaType: e,
      metaId: t,
      rule: n,
      policy: s
    }), await this.executeQuery(r);
  }
  /**
   * Builds and executes a molecule to convey new metadata to the ledger
   *
   * @param {string} metaType - The type of the metadata entry.
   * @param {string} metaId - The ID of the metadata entry.
   * @param {object|array} meta - The metadata object.
   * @param {object} [policy={}] - The policy object.
   * @returns {Promise<ResponseCreateMeta>} - A Promise that resolves with the created metadata entry.
   */
  async createMeta({
    metaType: e,
    metaId: t,
    meta: n = null,
    policy: s = {}
  }) {
    const r = await this.createMoleculeMutation(
      {
        mutationClass: xs,
        molecule: await this.createMolecule({
          secret: this.getSecret(),
          sourceWallet: await this.getSourceWallet()
        })
      }
    ), i = n || {};
    return r.fillMolecule({
      metaType: e,
      metaId: t,
      meta: i,
      policy: s
    }), await this.executeQuery(r);
  }
  /**
   * Builds and executes a molecule to register a peer node via P-isotope
   *
   * @param {string} host - The peer host URL to register
   * @returns {Promise<ResponsePeering>} - A Promise that resolves with the peering response.
   */
  async registerPeer({
    host: e
  }) {
    const t = await this.createMoleculeMutation({
      mutationClass: Ms,
      molecule: await this.createMolecule({
        secret: this.getSecret(),
        sourceWallet: await this.getSourceWallet()
      })
    });
    return t.fillMolecule({
      host: e
    }), await this.executeQuery(t);
  }
  /**
   * Builds and executes a molecule to submit an append request via A-isotope
   *
   * @param {string} metaType - The target MetaType to append to
   * @param {string} metaId - The target MetaId to append to
   * @param {string} action - The action to perform
   * @param {object} [meta={}] - Additional metadata
   * @returns {Promise<ResponseAppendRequest>} - A Promise that resolves with the append request response.
   */
  async appendRequest({
    metaType: e,
    metaId: t,
    action: n,
    meta: s = {}
  }) {
    const r = await this.createMoleculeMutation({
      mutationClass: Cs,
      molecule: await this.createMolecule({
        secret: this.getSecret(),
        sourceWallet: await this.getSourceWallet()
      })
    });
    return r.fillMolecule({
      metaType: e,
      metaId: t,
      action: n,
      meta: s
    }), await this.executeQuery(r);
  }
  /**
   * Builds and executes a molecule to create a new identifier on the ledger
   *
   * @param {string} type - The type of the identifier.
   * @param {string} contact - The contact associated with the identifier.
   * @param {string} code - The code for the identifier.
   * @returns {Promise<ResponseCreateIdentifier>} - A promise that resolves to the created identifier.
   */
  async createIdentifier({
    type: e,
    contact: t,
    code: n
  }) {
    const s = await this.createMoleculeMutation({
      mutationClass: Ss
    });
    return s.fillMolecule({
      type: e,
      contact: t,
      code: n
    }), await this.executeQuery(s);
  }
  /**
   * Creates a policy for a given metaType and metaId.
   *
   * @param {Object} options - The options for creating the policy.
   * @param {string} options.metaType - The type of the meta.
   * @param {string} options.metaId - The ID of the meta.
   * @param {Object} [options.policy={}] - The policy object.
   * @returns {Promise<*>} - A promise that resolves with the result of the execution.
   */
  async createPolicy({
    metaType: e,
    metaId: t,
    policy: n = {}
  }) {
    const s = await this.createMolecule({});
    s.addPolicyAtom({
      metaType: e,
      metaId: t,
      meta: {},
      policy: n
    }), s.addContinuIdAtom(), s.sign({
      bundle: this.getBundle()
    }), s.check();
    const r = await this.createMoleculeMutation({
      mutationClass: U,
      molecule: s
    });
    return await this.executeQuery(r);
  }
  /**
   * Queries the policy based on the provided metaType and metaId.
   *
   * @param {string} metaType - The type of the meta.
   * @param {string} metaId - The ID of the meta.
   * @returns {Promise<ResponsePolicy>} - A Promise that resolves to the query result.
   */
  async queryPolicy({
    metaType: e,
    metaId: t
  }) {
    const n = this.createQuery(Js);
    return await this.executeQuery(n, {
      metaType: e,
      metaId: t
    });
  }
  /**
   * Queries wallets based on the provided parameters.
   *
   * @param {object} options - The options for querying wallets.
   * @param {string|null} options.bundle - The bundle to query wallets for.
   * @param {string|null} options.token - The token to query wallets for.
   * @param {boolean} [options.unspent=true] - Whether to include unspent wallets or not.
   *
   * @returns {Promise<ResponseWalletList>} - A promise that resolves to the response payload of the query.
   */
  queryWallets({
    bundle: e = null,
    token: t = null,
    unspent: n = !0
  }) {
    this.log("info", `KnishIOClient::queryWallets() - Querying wallets${e ? ` for ${e}` : ""}...`);
    const s = this.createQuery(ls);
    return this.executeQuery(s, {
      bundleHash: e || this.getBundle(),
      tokenSlug: t,
      unspent: n
    }).then((r) => r.payload());
  }
  /**
   * Queries wallet bundle metadata.
   *
   * @param {Object} options - The options for the query.
   * @param {string|null} options.bundle - The bundle to query. Default is null.
   * @param {string|null} options.fields - The fields to retrieve. Default is null.
   * @param {boolean} options.raw - Whether to return the raw response or the payload. Default is false.
   * @returns {Promise<ResponseWalletBundle|{}|null>} - A promise that resolves to the response or payload.
   */
  queryBundle({
    bundle: e = null,
    fields: t = null,
    raw: n = !1
  }) {
    this.log("info", `KnishIOClient::queryBundle() - Querying wallet bundle metadata${e ? ` for ${e}` : ""}...`), e || (e = this.getBundle()), typeof e == "string" && (e = [e]);
    const s = this.createQuery(as);
    return this.executeQuery(s, { bundleHashes: e }).then((r) => n ? r : r.payload());
  }
  /**
   * Queries the ledger for the next ContinuId wallet
   *
   * @param {String} bundle - The bundle hash used in the query.
   * @returns {Promise<ResponseContinuId>} - A promise that resolves to the result of the query.
   */
  async queryContinuId({
    bundle: e
  }) {
    const t = this.createQuery(is);
    return this.executeQuery(t, {
      bundle: e
    });
  }
  /**
   * Requests tokens for a specific recipient or for the current wallet bundle.
   *
   * @param {Object} options - The options for the token request.
   * @param {string} options.token - The token slug.
   * @param {string|Wallet} [options.to] - The recipient of the tokens. If not provided, tokens will be requested for the current wallet bundle.
   * @param {number|null} [options.amount=null] - The amount of tokens to request. If not provided and `options.units` are provided, the amount will be calculated based on the number of
   * units.
   * @param {Array} [options.units=[]] - The array of unit IDs. If provided, the amount will be calculated based on the length of `options.units`.
   * @param {Object|null} [options.meta=null] - Additional metadata for the token request.
   * @param {string|null} [options.batchId=null] - The batch ID for the token request. If not provided and the token is stackable, a new batch ID will be generated.
   *
   * @returns {Promise<ResponseRequestTokens>} - A promise that resolves with the response from the token request.
   *
   * @throws {BatchIdException} - When a non-stackable token is used and `options.batchId` is not null.
   * @throws {StackableUnitAmountException} - When both `options.units` and `options.amount` are provided for stackable tokens.
   */
  async requestTokens({
    token: e,
    to: t,
    amount: n = null,
    units: s = [],
    meta: r = null,
    batchId: i = null
  }) {
    let a, c;
    r = r || {};
    const u = this.createQuery(Ds), l = await this.executeQuery(u, {
      slug: e
    }), h = C.get(l.data(), "0.fungibility") === "stackable";
    if (!h && i !== null)
      throw new Re("Expected Batch ID = null for non-stackable tokens.");
    if (h && i === null && (i = Ue({})), s.length > 0) {
      if (n > 0)
        throw new Te();
      n = s.length, r.tokenUnits = JSON.stringify(s);
    }
    t ? (Object.prototype.toString.call(t) === "[object String]" && (S.isBundleHash(t) ? (a = "walletBundle", c = t) : t = S.create({
      secret: t,
      token: e
    })), t instanceof S && (a = "wallet", r.position = t.position, r.bundle = t.bundle, c = t.address)) : (a = "walletBundle", c = this.getBundle());
    const p = await this.createMoleculeMutation({
      mutationClass: ws
    });
    return p.fillMolecule({
      token: e,
      amount: n,
      metaType: a,
      metaId: c,
      meta: r,
      batchId: i
    }), await this.executeQuery(p);
  }
  /**
   * Claims a shadow wallet for a given token.
   *
   * @param {string} token - The token for which to claim the shadow wallet.
   * @param {string|null} batchId - The batch ID of the shadow wallet (optional).
   * @param {string|null} molecule - The molecule associated with the shadow wallet (optional).
   *
   * @returns {Promise<ResponseClaimShadowWallet>} - A promise that resolves to the result of the claim operation.
   */
  async claimShadowWallet({
    token: e,
    batchId: t = null,
    molecule: n = null
  }) {
    const s = await this.createMoleculeMutation({
      mutationClass: As,
      molecule: n
    });
    return s.fillMolecule({
      token: e,
      batchId: t
    }), await this.executeQuery(s);
  }
  /**
   * Claims all shadow wallets for a given token.
   *
   * @param {Object} options - The options for claiming shadow wallets.
   * @param {string} options.token - The token to claim shadow wallets for.
   * @returns {Promise<*>} - A promise that resolves to an array of responses from claiming shadow wallets.
   * @throws {WalletShadowException} - If the shadow wallet list is invalid or if a non-shadow wallet is found.
   */
  async claimShadowWallets({
    token: e
  }) {
    const t = await this.queryWallets({ token: e });
    if (!t || !Array.isArray(t))
      throw new _t();
    t.forEach((s) => {
      if (!s.isShadow())
        throw new _t();
    });
    const n = [];
    for (const s of t)
      n.push(await this.claimShadowWallet({
        token: e,
        batchId: s.batchId
      }));
    return n;
  }
  /**
   * Transfers tokens from one wallet to another.
   *
   * @param {Object} options - The transfer options.
   * @param {string} options.bundleHash - The bundle hash of the source wallet.
   * @param {string} options.token - The token to transfer.
   * @param {number} [options.amount=null] - The amount of tokens to transfer. Not required if units are provided.
   * @param {Array} [options.units=[]] - An array of units to transfer. Overrides the amount if provided.
   * @param {string} [options.batchId=null] - The batch ID for the recipient wallet.
   * @param {Object} [options.sourceWallet=null] - The source wallet object. If not provided, it will be queried.
   *
   * @returns {Promise} - A Promise that resolves to the transaction result.
   *
   * @throws {StackableUnitAmountException} - If both amount and units are provided.
   * @throws {TransferBalanceException} - If the source wallet does not have enough balance.
   */
  async transferToken({
    bundleHash: e,
    token: t,
    amount: n = null,
    units: s = [],
    batchId: r = null,
    sourceWallet: i = null
  }) {
    if (s.length > 0) {
      if (n > 0)
        throw new Te();
      n = s.length;
    }
    if (i === null && (i = await this.querySourceWallet({
      token: t,
      amount: n
    })), i === null || ue.cmp(i.balance, n) < 0)
      throw new Y();
    const a = S.create({
      bundle: e,
      token: t
    });
    r !== null ? a.batchId = r : a.initBatchId({
      sourceWallet: i
    });
    const c = i.createRemainder(this.getSecret());
    i.splitUnits(
      s,
      c,
      a
    );
    const u = await this.createMolecule({
      sourceWallet: i,
      remainderWallet: c
    }), l = await this.createMoleculeMutation({
      mutationClass: ks,
      molecule: u
    });
    return l.fillMolecule({
      recipientWallet: a,
      amount: n
    }), await this.executeQuery(l);
  }
  /**
   * Deposits buffer token into the source wallet.
   *
   * @param {Object} options - The options for depositing buffer token.
   * @param {string} options.tokenSlug - The slug of the token to deposit.
   * @param {number} options.amount - The amount of token to deposit.
   * @param {Object} options.tradeRates - The trade rates for the deposit.
   * @param {Wallet|null} options.sourceWallet - The source wallet for the deposit. If not provided, a source wallet will be queried.
   *
   * @returns {Promise<*>} - A promise that resolves with the result of the deposit.
   */
  async depositBufferToken({
    tokenSlug: e,
    amount: t,
    tradeRates: n,
    sourceWallet: s = null
  }) {
    s === null && (s = await this.querySourceWallet({
      token: e,
      amount: t
    }));
    const r = s.createRemainder(this.getSecret()), i = await this.createMolecule({
      sourceWallet: s,
      remainderWallet: r
    }), a = await this.createMoleculeMutation({
      mutationClass: Ys,
      molecule: i
    });
    return a.fillMolecule({
      amount: t,
      tradeRates: n
    }), await this.executeQuery(a);
  }
  /**
   * Withdraws buffer tokens.
   *
   * @param {Object} options - The options for withdrawing buffer tokens.
   * @param {string} options.tokenSlug - The token slug.
   * @param {number} options.amount - The amount of tokens to withdraw.
   * @param {Object} [options.sourceWallet=null] - The source wallet to withdraw tokens from. If not provided, a source wallet will be queried.
   * @param {Object} [options.signingWallet=null] - The signing wallet to use for the transaction.
   * @returns {Promise<Object>} A promise that resolves to the result of the withdrawal transaction.
   */
  async withdrawBufferToken({
    tokenSlug: e,
    amount: t,
    sourceWallet: n = null,
    signingWallet: s = null
  }) {
    n === null && (n = await this.querySourceWallet({
      token: e,
      amount: t,
      type: "buffer"
    }));
    const r = n, i = await this.createMolecule({
      sourceWallet: n,
      remainderWallet: r
    }), a = await this.createMoleculeMutation({
      mutationClass: er,
      molecule: i
    }), c = {};
    return c[this.getBundle()] = t, a.fillMolecule({
      recipients: c,
      signingWallet: s
    }), await this.executeQuery(a);
  }
  /**
   * Builds and executes a molecule to destroy the specified Token units
   *
   * @param {string} token
   * @param {number|null} amount
   * @param {array|null} units
   * @param {Wallet|null} sourceWallet
   * @return {Promise<unknown>}
   */
  async burnTokens({
    token: e,
    amount: t = null,
    units: n = [],
    sourceWallet: s = null
  }) {
    s === null && (s = await this.querySourceWallet({
      token: e,
      amount: t
    }));
    const r = s.createRemainder(this.getSecret());
    if (n.length > 0) {
      if (t > 0)
        throw new Te();
      t = n.length, s.splitUnits(
        n,
        r
      );
    }
    const i = await this.createMolecule({
      sourceWallet: s,
      remainderWallet: r
    });
    i.burnToken({ amount: t }), i.sign({
      bundle: this.getBundle()
    }), i.check();
    const a = await this.createMoleculeMutation({
      mutationClass: U,
      molecule: i
    });
    return this.executeQuery(a);
  }
  /**
   * Builds and executes a molecule to destroy the specified Token units
   *
   * @param {string} token
   * @param {number|null} amount
   * @param {array|null} units
   * @param {Wallet|null} sourceWallet
   * @return {Promise<unknown>}
   */
  async replenishToken({
    token: e,
    amount: t = null,
    units: n = [],
    sourceWallet: s = null
  }) {
    if (s === null && (s = (await this.queryBalance({ token: e })).payload()), !s)
      throw new Y("Source wallet is missing or invalid.");
    const r = s.createRemainder(this.getSecret()), i = await this.createMolecule({
      sourceWallet: s,
      remainderWallet: r
    });
    i.replenishToken({
      amount: t,
      units: n
    }), i.sign({
      bundle: this.getBundle()
    }), i.check();
    const a = await this.createMoleculeMutation({
      mutationClass: U,
      molecule: i
    });
    return this.executeQuery(a);
  }
  /**
   *
   * @param bundleHash
   * @param tokenSlug
   * @param newTokenUnit
   * @param fusedTokenUnitIds
   * @param sourceWallet
   * @returns {Promise<*>}
   */
  async fuseToken({
    bundleHash: e,
    tokenSlug: t,
    newTokenUnit: n,
    fusedTokenUnitIds: s,
    sourceWallet: r = null
  }) {
    if (r === null && (r = (await this.queryBalance({ token: t })).payload()), r === null)
      throw new Y("Source wallet is missing or invalid.");
    if (!r.tokenUnits || !r.tokenUnits.length)
      throw new Y("Source wallet does not have token units.");
    if (!s.length)
      throw new Y("Fused token unit list is empty.");
    const i = [];
    r.tokenUnits.forEach((h) => {
      i.push(h.id);
    }), s.forEach((h) => {
      if (!i.includes(h))
        throw new Y(`Fused token unit ID = ${h} does not found in the source wallet.`);
    });
    const a = S.create({
      bundle: e,
      token: t
    });
    a.initBatchId({ sourceWallet: r });
    const c = r.createRemainder(this.getSecret());
    r.splitUnits(s, c), n.metas.fusedTokenUnits = r.getTokenUnitsData(), a.tokenUnits = [n];
    const u = await this.createMolecule({
      sourceWallet: r,
      remainderWallet: c
    });
    u.fuseToken(r.tokenUnits, a), u.sign({
      bundle: this.getBundle()
    }), u.check();
    const l = await this.createMoleculeMutation({
      mutationClass: U,
      molecule: u
    });
    return this.executeQuery(l);
  }
  /**
   * Requests a guest authentication token using the fingerprint of the user.
   * @param {Object} options - The options for the guest authentication token request.
   * @param {string} options.cellSlug - The slug of the cell to request the token for.
   * @param {boolean} options.encrypt - Indicates whether the session should be encrypted.
   * @returns {Promise<ResponseRequestAuthorizationGuest>} - A promise that resolves to the response of the guest authentication token request.
   */
  async requestGuestAuthToken({
    cellSlug: e,
    encrypt: t
  }) {
    this.setCellSlug(e);
    const n = new S({
      secret: Ge(await this.getFingerprint()),
      token: "AUTH"
    }), s = await this.createQuery(Ws), r = {
      cellSlug: e,
      pubkey: n.pubkey,
      encrypt: t
    }, i = await s.execute({ variables: r });
    if (i.success()) {
      const a = $e.create({
        token: i.token(),
        expiresAt: i.time(),
        pubkey: i.pubKey(),
        encrypt: i.encrypt()
      }, n);
      this.setAuthToken(a);
    } else
      throw new St(`KnishIOClient::requestGuestAuthToken() - Authorization attempt rejected by ledger. Reason: ${i.reason()}`);
    return i;
  }
  /**
   * Request a profile auth token
   *
   * @param secret
   * @param encrypt
   * @returns {Promise<ResponseRequestAuthorization>}
   */
  async requestProfileAuthToken({
    secret: e,
    encrypt: t
  }) {
    this.setSecret(e);
    const n = new S({
      secret: e,
      token: "AUTH"
    }), s = await this.createMolecule({
      secret: e,
      sourceWallet: n
    }), r = await this.createMoleculeMutation({
      mutationClass: fs,
      molecule: s
    });
    r.fillMolecule({ meta: { encrypt: t ? "true" : "false" } });
    const i = await r.execute({});
    if (i.success()) {
      const a = $e.create({
        token: i.token(),
        expiresAt: i.time(),
        pubkey: i.pubKey(),
        encrypt: i.encrypt()
      }, n);
      this.setAuthToken(a);
    } else
      throw new St(`KnishIOClient::requestProfileAuthToken() - Authorization attempt rejected by ledger. Reason: ${i.reason()}`);
    return i;
  }
  /**
   * Request an auth token (guest or profile)
   *
   * @param secret
   * @param seed
   * @param cellSlug
   * @param encrypt
   * @returns {Promise<ResponseRequestAuthorizationGuest|ResponseRequestAuthorization|null>}
   */
  async requestAuthToken({
    secret: e = null,
    seed: t = null,
    cellSlug: n = null,
    encrypt: s = !1
  }) {
    if (this.$__serverSdkVersion < 3)
      return this.log("warn", "KnishIOClient::authorize() - Server SDK version does not require an authorization..."), null;
    e === null && t && (e = Ge(t)), n && this.setCellSlug(n), this.$__authInProcess = !0;
    let r;
    return e ? r = await this.requestProfileAuthToken({
      secret: e,
      encrypt: s
    }) : r = await this.requestGuestAuthToken({
      cellSlug: n,
      encrypt: s
    }), this.log("info", `KnishIOClient::authorize() - Successfully retrieved auth token ${this.$__authToken.getToken()}...`), this.switchEncryption(s), this.$__authInProcess = !1, r;
  }
  /**
   * Sets the auth token
   *
   * @param {AuthToken} authToken
   */
  setAuthToken(e) {
    if (!e) {
      this.log("info", "KnishIOClient::setAuthToken() - authToken object is empty.");
      return;
    }
    this.$__authTokenObjects[this.getUri()] = e, this.client().setAuthData(e.getAuthData()), this.$__authToken = e;
  }
  /**
   * Returns the current authorization token
   *
   * @return {AuthToken}
   */
  getAuthToken() {
    return this.$__authToken;
  }
  /**
   * Writes the specified message to the console.
   * @param {string} level
   * @param {string} message
   */
  log(e, t) {
    if (this.$__logging)
      switch (e) {
        case "info":
          console.info(t);
          break;
        case "warn":
          console.warn(t);
          break;
        case "error":
          console.error(t);
          break;
        default:
          console.log(t);
      }
  }
}
export {
  g as Atom,
  xr as KnishIOClient,
  he as Meta,
  J as Molecule,
  Cs as MutationAppendRequest,
  Ms as MutationPeering,
  Ts as ResponseAppendRequest,
  Is as ResponsePeering,
  S as Wallet,
  ln as base64ToHex,
  rn as bufferToHexString,
  sn as charsetBaseConvert,
  We as chunkSubstr,
  de as generateBundleHash,
  Ge as generateSecret,
  on as hexStringToBuffer,
  an as hexToBase64,
  Fe as isHex,
  Xe as randomString,
  nt as shake256
};
//# sourceMappingURL=client.es.mjs.map
