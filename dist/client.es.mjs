const ga = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", va = "ARRAYBUFFER not supported by this environment", ba = "UINT8ARRAY not supported by this environment";
function Rs(n, e, t, r) {
  let i, s, o;
  const a = e || [0], l = (t = t || 0) >>> 3, c = r === -1 ? 3 : 0;
  for (i = 0; i < n.length; i += 1) o = i + l, s = o >>> 2, a.length <= s && a.push(0), a[s] |= n[i] << 8 * (c + r * (o % 4));
  return { value: a, binLen: 8 * n.length + t };
}
function fn(n, e, t) {
  switch (e) {
    case "UTF8":
    case "UTF16BE":
    case "UTF16LE":
      break;
    default:
      throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE");
  }
  switch (n) {
    case "HEX":
      return function(r, i, s) {
        return function(o, a, l, c) {
          let u, d, p, m;
          if (o.length % 2 != 0) throw new Error("String of HEX type must be in byte increments");
          const v = a || [0], w = (l = l || 0) >>> 3, _ = c === -1 ? 3 : 0;
          for (u = 0; u < o.length; u += 2) {
            if (d = parseInt(o.substr(u, 2), 16), isNaN(d)) throw new Error("String of HEX type contains invalid characters");
            for (m = (u >>> 1) + w, p = m >>> 2; v.length <= p; ) v.push(0);
            v[p] |= d << 8 * (_ + c * (m % 4));
          }
          return { value: v, binLen: 4 * o.length + l };
        }(r, i, s, t);
      };
    case "TEXT":
      return function(r, i, s) {
        return function(o, a, l, c, u) {
          let d, p, m, v, w, _, E, T, I = 0;
          const A = l || [0], R = (c = c || 0) >>> 3;
          if (a === "UTF8") for (E = u === -1 ? 3 : 0, m = 0; m < o.length; m += 1) for (d = o.charCodeAt(m), p = [], 128 > d ? p.push(d) : 2048 > d ? (p.push(192 | d >>> 6), p.push(128 | 63 & d)) : 55296 > d || 57344 <= d ? p.push(224 | d >>> 12, 128 | d >>> 6 & 63, 128 | 63 & d) : (m += 1, d = 65536 + ((1023 & d) << 10 | 1023 & o.charCodeAt(m)), p.push(240 | d >>> 18, 128 | d >>> 12 & 63, 128 | d >>> 6 & 63, 128 | 63 & d)), v = 0; v < p.length; v += 1) {
            for (_ = I + R, w = _ >>> 2; A.length <= w; ) A.push(0);
            A[w] |= p[v] << 8 * (E + u * (_ % 4)), I += 1;
          }
          else for (E = u === -1 ? 2 : 0, T = a === "UTF16LE" && u !== 1 || a !== "UTF16LE" && u === 1, m = 0; m < o.length; m += 1) {
            for (d = o.charCodeAt(m), T === !0 && (v = 255 & d, d = v << 8 | d >>> 8), _ = I + R, w = _ >>> 2; A.length <= w; ) A.push(0);
            A[w] |= d << 8 * (E + u * (_ % 4)), I += 2;
          }
          return { value: A, binLen: 8 * I + c };
        }(r, e, i, s, t);
      };
    case "B64":
      return function(r, i, s) {
        return function(o, a, l, c) {
          let u, d, p, m, v, w, _, E = 0;
          const T = a || [0], I = (l = l || 0) >>> 3, A = c === -1 ? 3 : 0, R = o.indexOf("=");
          if (o.search(/^[a-zA-Z0-9=+/]+$/) === -1) throw new Error("Invalid character in base-64 string");
          if (o = o.replace(/=/g, ""), R !== -1 && R < o.length) throw new Error("Invalid '=' found in base-64 string");
          for (d = 0; d < o.length; d += 4) {
            for (v = o.substr(d, 4), m = 0, p = 0; p < v.length; p += 1) u = ga.indexOf(v.charAt(p)), m |= u << 18 - 6 * p;
            for (p = 0; p < v.length - 1; p += 1) {
              for (_ = E + I, w = _ >>> 2; T.length <= w; ) T.push(0);
              T[w] |= (m >>> 16 - 8 * p & 255) << 8 * (A + c * (_ % 4)), E += 1;
            }
          }
          return { value: T, binLen: 8 * E + l };
        }(r, i, s, t);
      };
    case "BYTES":
      return function(r, i, s) {
        return function(o, a, l, c) {
          let u, d, p, m;
          const v = a || [0], w = (l = l || 0) >>> 3, _ = c === -1 ? 3 : 0;
          for (d = 0; d < o.length; d += 1) u = o.charCodeAt(d), m = d + w, p = m >>> 2, v.length <= p && v.push(0), v[p] |= u << 8 * (_ + c * (m % 4));
          return { value: v, binLen: 8 * o.length + l };
        }(r, i, s, t);
      };
    case "ARRAYBUFFER":
      try {
        new ArrayBuffer(0);
      } catch {
        throw new Error(va);
      }
      return function(r, i, s) {
        return function(o, a, l, c) {
          return Rs(new Uint8Array(o), a, l, c);
        }(r, i, s, t);
      };
    case "UINT8ARRAY":
      try {
        new Uint8Array(0);
      } catch {
        throw new Error(ba);
      }
      return function(r, i, s) {
        return Rs(r, i, s, t);
      };
    default:
      throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
  }
}
function Ns(n, e, t, r) {
  switch (n) {
    case "HEX":
      return function(i) {
        return function(s, o, a, l) {
          const c = "0123456789abcdef";
          let u, d, p = "";
          const m = o / 8, v = a === -1 ? 3 : 0;
          for (u = 0; u < m; u += 1) d = s[u >>> 2] >>> 8 * (v + a * (u % 4)), p += c.charAt(d >>> 4 & 15) + c.charAt(15 & d);
          return l.outputUpper ? p.toUpperCase() : p;
        }(i, e, t, r);
      };
    case "B64":
      return function(i) {
        return function(s, o, a, l) {
          let c, u, d, p, m, v = "";
          const w = o / 8, _ = a === -1 ? 3 : 0;
          for (c = 0; c < w; c += 3) for (p = c + 1 < w ? s[c + 1 >>> 2] : 0, m = c + 2 < w ? s[c + 2 >>> 2] : 0, d = (s[c >>> 2] >>> 8 * (_ + a * (c % 4)) & 255) << 16 | (p >>> 8 * (_ + a * ((c + 1) % 4)) & 255) << 8 | m >>> 8 * (_ + a * ((c + 2) % 4)) & 255, u = 0; u < 4; u += 1) v += 8 * c + 6 * u <= o ? ga.charAt(d >>> 6 * (3 - u) & 63) : l.b64Pad;
          return v;
        }(i, e, t, r);
      };
    case "BYTES":
      return function(i) {
        return function(s, o, a) {
          let l, c, u = "";
          const d = o / 8, p = a === -1 ? 3 : 0;
          for (l = 0; l < d; l += 1) c = s[l >>> 2] >>> 8 * (p + a * (l % 4)) & 255, u += String.fromCharCode(c);
          return u;
        }(i, e, t);
      };
    case "ARRAYBUFFER":
      try {
        new ArrayBuffer(0);
      } catch {
        throw new Error(va);
      }
      return function(i) {
        return function(s, o, a) {
          let l;
          const c = o / 8, u = new ArrayBuffer(c), d = new Uint8Array(u), p = a === -1 ? 3 : 0;
          for (l = 0; l < c; l += 1) d[l] = s[l >>> 2] >>> 8 * (p + a * (l % 4)) & 255;
          return u;
        }(i, e, t);
      };
    case "UINT8ARRAY":
      try {
        new Uint8Array(0);
      } catch {
        throw new Error(ba);
      }
      return function(i) {
        return function(s, o, a) {
          let l;
          const c = o / 8, u = a === -1 ? 3 : 0, d = new Uint8Array(c);
          for (l = 0; l < c; l += 1) d[l] = s[l >>> 2] >>> 8 * (u + a * (l % 4)) & 255;
          return d;
        }(i, e, t);
      };
    default:
      throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
  }
}
const Wn = 4294967296, F = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], at = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], ut = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], Kn = "Chosen SHA variant is not supported", wa = "Cannot set numRounds with MAC";
function br(n, e) {
  let t, r;
  const i = n.binLen >>> 3, s = e.binLen >>> 3, o = i << 3, a = 4 - i << 3;
  if (i % 4 != 0) {
    for (t = 0; t < s; t += 4) r = i + t >>> 2, n.value[r] |= e.value[t >>> 2] << o, n.value.push(0), n.value[r + 1] |= e.value[t >>> 2] >>> a;
    return (n.value.length << 2) - 4 >= s + i && n.value.pop(), { value: n.value, binLen: n.binLen + e.binLen };
  }
  return { value: n.value.concat(e.value), binLen: n.binLen + e.binLen };
}
function Ds(n) {
  const e = { outputUpper: !1, b64Pad: "=", outputLen: -1 }, t = n || {}, r = "Output length must be a multiple of 8";
  if (e.outputUpper = t.outputUpper || !1, t.b64Pad && (e.b64Pad = t.b64Pad), t.outputLen) {
    if (t.outputLen % 8 != 0) throw new Error(r);
    e.outputLen = t.outputLen;
  } else if (t.shakeLen) {
    if (t.shakeLen % 8 != 0) throw new Error(r);
    e.outputLen = t.shakeLen;
  }
  if (typeof e.outputUpper != "boolean") throw new Error("Invalid outputUpper formatting option");
  if (typeof e.b64Pad != "string") throw new Error("Invalid b64Pad formatting option");
  return e;
}
function St(n, e, t, r) {
  const i = n + " must include a value and format";
  if (!e) {
    if (!r) throw new Error(i);
    return r;
  }
  if (e.value === void 0 || !e.format) throw new Error(i);
  return fn(e.format, e.encoding || "UTF8", t)(e.value);
}
let Or = class {
  constructor(e, t, r) {
    const i = r || {};
    if (this.t = t, this.i = i.encoding || "UTF8", this.numRounds = i.numRounds || 1, isNaN(this.numRounds) || this.numRounds !== parseInt(this.numRounds, 10) || 1 > this.numRounds) throw new Error("numRounds must a integer >= 1");
    this.o = e, this.h = [], this.u = 0, this.l = !1, this.A = 0, this.H = !1, this.S = [], this.p = [];
  }
  update(e) {
    let t, r = 0;
    const i = this.m >>> 5, s = this.C(e, this.h, this.u), o = s.binLen, a = s.value, l = o >>> 5;
    for (t = 0; t < l; t += i) r + this.m <= o && (this.U = this.v(a.slice(t, t + i), this.U), r += this.m);
    return this.A += r, this.h = a.slice(r >>> 5), this.u = o % this.m, this.l = !0, this;
  }
  getHash(e, t) {
    let r, i, s = this.R;
    const o = Ds(t);
    if (this.K) {
      if (o.outputLen === -1) throw new Error("Output length must be specified in options");
      s = o.outputLen;
    }
    const a = Ns(e, s, this.T, o);
    if (this.H && this.g) return a(this.g(o));
    for (i = this.F(this.h.slice(), this.u, this.A, this.L(this.U), s), r = 1; r < this.numRounds; r += 1) this.K && s % 32 != 0 && (i[i.length - 1] &= 16777215 >>> 24 - s % 32), i = this.F(i, s, 0, this.B(this.o), s);
    return a(i);
  }
  setHMACKey(e, t, r) {
    if (!this.M) throw new Error("Variant does not support HMAC");
    if (this.l) throw new Error("Cannot set MAC key after calling update");
    const i = fn(t, (r || {}).encoding || "UTF8", this.T);
    this.k(i(e));
  }
  k(e) {
    const t = this.m >>> 3, r = t / 4 - 1;
    let i;
    if (this.numRounds !== 1) throw new Error(wa);
    if (this.H) throw new Error("MAC key already set");
    for (t < e.binLen / 8 && (e.value = this.F(e.value, e.binLen, 0, this.B(this.o), this.R)); e.value.length <= r; ) e.value.push(0);
    for (i = 0; i <= r; i += 1) this.S[i] = 909522486 ^ e.value[i], this.p[i] = 1549556828 ^ e.value[i];
    this.U = this.v(this.S, this.U), this.A = this.m, this.H = !0;
  }
  getHMAC(e, t) {
    const r = Ds(t);
    return Ns(e, this.R, this.T, r)(this.Y());
  }
  Y() {
    let e;
    if (!this.H) throw new Error("Cannot call getHMAC without first setting MAC key");
    const t = this.F(this.h.slice(), this.u, this.A, this.L(this.U), this.R);
    return e = this.v(this.p, this.B(this.o)), e = this.F(t, this.R, this.m, e, this.R), e;
  }
};
function Gt(n, e) {
  return n << e | n >>> 32 - e;
}
function tt(n, e) {
  return n >>> e | n << 32 - e;
}
function _a(n, e) {
  return n >>> e;
}
function Ms(n, e, t) {
  return n ^ e ^ t;
}
function Ea(n, e, t) {
  return n & e ^ ~n & t;
}
function Sa(n, e, t) {
  return n & e ^ n & t ^ e & t;
}
function tc(n) {
  return tt(n, 2) ^ tt(n, 13) ^ tt(n, 22);
}
function Oe(n, e) {
  const t = (65535 & n) + (65535 & e);
  return (65535 & (n >>> 16) + (e >>> 16) + (t >>> 16)) << 16 | 65535 & t;
}
function nc(n, e, t, r) {
  const i = (65535 & n) + (65535 & e) + (65535 & t) + (65535 & r);
  return (65535 & (n >>> 16) + (e >>> 16) + (t >>> 16) + (r >>> 16) + (i >>> 16)) << 16 | 65535 & i;
}
function In(n, e, t, r, i) {
  const s = (65535 & n) + (65535 & e) + (65535 & t) + (65535 & r) + (65535 & i);
  return (65535 & (n >>> 16) + (e >>> 16) + (t >>> 16) + (r >>> 16) + (i >>> 16) + (s >>> 16)) << 16 | 65535 & s;
}
function rc(n) {
  return tt(n, 7) ^ tt(n, 18) ^ _a(n, 3);
}
function ic(n) {
  return tt(n, 6) ^ tt(n, 11) ^ tt(n, 25);
}
function sc(n) {
  return [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
}
function ka(n, e) {
  let t, r, i, s, o, a, l;
  const c = [];
  for (t = e[0], r = e[1], i = e[2], s = e[3], o = e[4], l = 0; l < 80; l += 1) c[l] = l < 16 ? n[l] : Gt(c[l - 3] ^ c[l - 8] ^ c[l - 14] ^ c[l - 16], 1), a = l < 20 ? In(Gt(t, 5), Ea(r, i, s), o, 1518500249, c[l]) : l < 40 ? In(Gt(t, 5), Ms(r, i, s), o, 1859775393, c[l]) : l < 60 ? In(Gt(t, 5), Sa(r, i, s), o, 2400959708, c[l]) : In(Gt(t, 5), Ms(r, i, s), o, 3395469782, c[l]), o = s, s = i, i = Gt(r, 30), r = t, t = a;
  return e[0] = Oe(t, e[0]), e[1] = Oe(r, e[1]), e[2] = Oe(i, e[2]), e[3] = Oe(s, e[3]), e[4] = Oe(o, e[4]), e;
}
function oc(n, e, t, r) {
  let i;
  const s = 15 + (e + 65 >>> 9 << 4), o = e + t;
  for (; n.length <= s; ) n.push(0);
  for (n[e >>> 5] |= 128 << 24 - e % 32, n[s] = 4294967295 & o, n[s - 1] = o / Wn | 0, i = 0; i < n.length; i += 16) r = ka(n.slice(i, i + 16), r);
  return r;
}
let ac = class extends Or {
  constructor(e, t, r) {
    if (e !== "SHA-1") throw new Error(Kn);
    super(e, t, r);
    const i = r || {};
    this.M = !0, this.g = this.Y, this.T = -1, this.C = fn(this.t, this.i, this.T), this.v = ka, this.L = function(s) {
      return s.slice();
    }, this.B = sc, this.F = oc, this.U = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.m = 512, this.R = 160, this.K = !1, i.hmacKey && this.k(St("hmacKey", i.hmacKey, this.T));
  }
};
function Fs(n) {
  let e;
  return e = n == "SHA-224" ? at.slice() : ut.slice(), e;
}
function $s(n, e) {
  let t, r, i, s, o, a, l, c, u, d, p;
  const m = [];
  for (t = e[0], r = e[1], i = e[2], s = e[3], o = e[4], a = e[5], l = e[6], c = e[7], p = 0; p < 64; p += 1) m[p] = p < 16 ? n[p] : nc(tt(v = m[p - 2], 17) ^ tt(v, 19) ^ _a(v, 10), m[p - 7], rc(m[p - 15]), m[p - 16]), u = In(c, ic(o), Ea(o, a, l), F[p], m[p]), d = Oe(tc(t), Sa(t, r, i)), c = l, l = a, a = o, o = Oe(s, u), s = i, i = r, r = t, t = Oe(u, d);
  var v;
  return e[0] = Oe(t, e[0]), e[1] = Oe(r, e[1]), e[2] = Oe(i, e[2]), e[3] = Oe(s, e[3]), e[4] = Oe(o, e[4]), e[5] = Oe(a, e[5]), e[6] = Oe(l, e[6]), e[7] = Oe(c, e[7]), e;
}
let uc = class extends Or {
  constructor(e, t, r) {
    if (e !== "SHA-224" && e !== "SHA-256") throw new Error(Kn);
    super(e, t, r);
    const i = r || {};
    this.g = this.Y, this.M = !0, this.T = -1, this.C = fn(this.t, this.i, this.T), this.v = $s, this.L = function(s) {
      return s.slice();
    }, this.B = Fs, this.F = function(s, o, a, l) {
      return function(c, u, d, p, m) {
        let v, w;
        const _ = 15 + (u + 65 >>> 9 << 4), E = u + d;
        for (; c.length <= _; ) c.push(0);
        for (c[u >>> 5] |= 128 << 24 - u % 32, c[_] = 4294967295 & E, c[_ - 1] = E / Wn | 0, v = 0; v < c.length; v += 16) p = $s(c.slice(v, v + 16), p);
        return w = m === "SHA-224" ? [p[0], p[1], p[2], p[3], p[4], p[5], p[6]] : p, w;
      }(s, o, a, l, e);
    }, this.U = Fs(e), this.m = 512, this.R = e === "SHA-224" ? 224 : 256, this.K = !1, i.hmacKey && this.k(St("hmacKey", i.hmacKey, this.T));
  }
};
class S {
  constructor(e, t) {
    this.N = e, this.I = t;
  }
}
function Bs(n, e) {
  let t;
  return e > 32 ? (t = 64 - e, new S(n.I << e | n.N >>> t, n.N << e | n.I >>> t)) : e !== 0 ? (t = 32 - e, new S(n.N << e | n.I >>> t, n.I << e | n.N >>> t)) : n;
}
function nt(n, e) {
  let t;
  return e < 32 ? (t = 32 - e, new S(n.N >>> e | n.I << t, n.I >>> e | n.N << t)) : (t = 64 - e, new S(n.I >>> e | n.N << t, n.N >>> e | n.I << t));
}
function xa(n, e) {
  return new S(n.N >>> e, n.I >>> e | n.N << 32 - e);
}
function cc(n, e, t) {
  return new S(n.N & e.N ^ n.N & t.N ^ e.N & t.N, n.I & e.I ^ n.I & t.I ^ e.I & t.I);
}
function lc(n) {
  const e = nt(n, 28), t = nt(n, 34), r = nt(n, 39);
  return new S(e.N ^ t.N ^ r.N, e.I ^ t.I ^ r.I);
}
function He(n, e) {
  let t, r;
  t = (65535 & n.I) + (65535 & e.I), r = (n.I >>> 16) + (e.I >>> 16) + (t >>> 16);
  const i = (65535 & r) << 16 | 65535 & t;
  return t = (65535 & n.N) + (65535 & e.N) + (r >>> 16), r = (n.N >>> 16) + (e.N >>> 16) + (t >>> 16), new S((65535 & r) << 16 | 65535 & t, i);
}
function hc(n, e, t, r) {
  let i, s;
  i = (65535 & n.I) + (65535 & e.I) + (65535 & t.I) + (65535 & r.I), s = (n.I >>> 16) + (e.I >>> 16) + (t.I >>> 16) + (r.I >>> 16) + (i >>> 16);
  const o = (65535 & s) << 16 | 65535 & i;
  return i = (65535 & n.N) + (65535 & e.N) + (65535 & t.N) + (65535 & r.N) + (s >>> 16), s = (n.N >>> 16) + (e.N >>> 16) + (t.N >>> 16) + (r.N >>> 16) + (i >>> 16), new S((65535 & s) << 16 | 65535 & i, o);
}
function fc(n, e, t, r, i) {
  let s, o;
  s = (65535 & n.I) + (65535 & e.I) + (65535 & t.I) + (65535 & r.I) + (65535 & i.I), o = (n.I >>> 16) + (e.I >>> 16) + (t.I >>> 16) + (r.I >>> 16) + (i.I >>> 16) + (s >>> 16);
  const a = (65535 & o) << 16 | 65535 & s;
  return s = (65535 & n.N) + (65535 & e.N) + (65535 & t.N) + (65535 & r.N) + (65535 & i.N) + (o >>> 16), o = (n.N >>> 16) + (e.N >>> 16) + (t.N >>> 16) + (r.N >>> 16) + (i.N >>> 16) + (s >>> 16), new S((65535 & o) << 16 | 65535 & s, a);
}
function yn(n, e) {
  return new S(n.N ^ e.N, n.I ^ e.I);
}
function pc(n) {
  const e = nt(n, 19), t = nt(n, 61), r = xa(n, 6);
  return new S(e.N ^ t.N ^ r.N, e.I ^ t.I ^ r.I);
}
function dc(n) {
  const e = nt(n, 1), t = nt(n, 8), r = xa(n, 7);
  return new S(e.N ^ t.N ^ r.N, e.I ^ t.I ^ r.I);
}
function yc(n) {
  const e = nt(n, 14), t = nt(n, 18), r = nt(n, 41);
  return new S(e.N ^ t.N ^ r.N, e.I ^ t.I ^ r.I);
}
const mc = [new S(F[0], 3609767458), new S(F[1], 602891725), new S(F[2], 3964484399), new S(F[3], 2173295548), new S(F[4], 4081628472), new S(F[5], 3053834265), new S(F[6], 2937671579), new S(F[7], 3664609560), new S(F[8], 2734883394), new S(F[9], 1164996542), new S(F[10], 1323610764), new S(F[11], 3590304994), new S(F[12], 4068182383), new S(F[13], 991336113), new S(F[14], 633803317), new S(F[15], 3479774868), new S(F[16], 2666613458), new S(F[17], 944711139), new S(F[18], 2341262773), new S(F[19], 2007800933), new S(F[20], 1495990901), new S(F[21], 1856431235), new S(F[22], 3175218132), new S(F[23], 2198950837), new S(F[24], 3999719339), new S(F[25], 766784016), new S(F[26], 2566594879), new S(F[27], 3203337956), new S(F[28], 1034457026), new S(F[29], 2466948901), new S(F[30], 3758326383), new S(F[31], 168717936), new S(F[32], 1188179964), new S(F[33], 1546045734), new S(F[34], 1522805485), new S(F[35], 2643833823), new S(F[36], 2343527390), new S(F[37], 1014477480), new S(F[38], 1206759142), new S(F[39], 344077627), new S(F[40], 1290863460), new S(F[41], 3158454273), new S(F[42], 3505952657), new S(F[43], 106217008), new S(F[44], 3606008344), new S(F[45], 1432725776), new S(F[46], 1467031594), new S(F[47], 851169720), new S(F[48], 3100823752), new S(F[49], 1363258195), new S(F[50], 3750685593), new S(F[51], 3785050280), new S(F[52], 3318307427), new S(F[53], 3812723403), new S(F[54], 2003034995), new S(F[55], 3602036899), new S(F[56], 1575990012), new S(F[57], 1125592928), new S(F[58], 2716904306), new S(F[59], 442776044), new S(F[60], 593698344), new S(F[61], 3733110249), new S(F[62], 2999351573), new S(F[63], 3815920427), new S(3391569614, 3928383900), new S(3515267271, 566280711), new S(3940187606, 3454069534), new S(4118630271, 4000239992), new S(116418474, 1914138554), new S(174292421, 2731055270), new S(289380356, 3203993006), new S(460393269, 320620315), new S(685471733, 587496836), new S(852142971, 1086792851), new S(1017036298, 365543100), new S(1126000580, 2618297676), new S(1288033470, 3409855158), new S(1501505948, 4234509866), new S(1607167915, 987167468), new S(1816402316, 1246189591)];
function Ps(n) {
  return n === "SHA-384" ? [new S(3418070365, at[0]), new S(1654270250, at[1]), new S(2438529370, at[2]), new S(355462360, at[3]), new S(1731405415, at[4]), new S(41048885895, at[5]), new S(3675008525, at[6]), new S(1203062813, at[7])] : [new S(ut[0], 4089235720), new S(ut[1], 2227873595), new S(ut[2], 4271175723), new S(ut[3], 1595750129), new S(ut[4], 2917565137), new S(ut[5], 725511199), new S(ut[6], 4215389547), new S(ut[7], 327033209)];
}
function Ls(n, e) {
  let t, r, i, s, o, a, l, c, u, d, p, m;
  const v = [];
  for (t = e[0], r = e[1], i = e[2], s = e[3], o = e[4], a = e[5], l = e[6], c = e[7], p = 0; p < 80; p += 1) p < 16 ? (m = 2 * p, v[p] = new S(n[m], n[m + 1])) : v[p] = hc(pc(v[p - 2]), v[p - 7], dc(v[p - 15]), v[p - 16]), u = fc(c, yc(o), (_ = a, E = l, new S((w = o).N & _.N ^ ~w.N & E.N, w.I & _.I ^ ~w.I & E.I)), mc[p], v[p]), d = He(lc(t), cc(t, r, i)), c = l, l = a, a = o, o = He(s, u), s = i, i = r, r = t, t = He(u, d);
  var w, _, E;
  return e[0] = He(t, e[0]), e[1] = He(r, e[1]), e[2] = He(i, e[2]), e[3] = He(s, e[3]), e[4] = He(o, e[4]), e[5] = He(a, e[5]), e[6] = He(l, e[6]), e[7] = He(c, e[7]), e;
}
let gc = class extends Or {
  constructor(e, t, r) {
    if (e !== "SHA-384" && e !== "SHA-512") throw new Error(Kn);
    super(e, t, r);
    const i = r || {};
    this.g = this.Y, this.M = !0, this.T = -1, this.C = fn(this.t, this.i, this.T), this.v = Ls, this.L = function(s) {
      return s.slice();
    }, this.B = Ps, this.F = function(s, o, a, l) {
      return function(c, u, d, p, m) {
        let v, w;
        const _ = 31 + (u + 129 >>> 10 << 5), E = u + d;
        for (; c.length <= _; ) c.push(0);
        for (c[u >>> 5] |= 128 << 24 - u % 32, c[_] = 4294967295 & E, c[_ - 1] = E / Wn | 0, v = 0; v < c.length; v += 32) p = Ls(c.slice(v, v + 32), p);
        return w = m === "SHA-384" ? [p[0].N, p[0].I, p[1].N, p[1].I, p[2].N, p[2].I, p[3].N, p[3].I, p[4].N, p[4].I, p[5].N, p[5].I] : [p[0].N, p[0].I, p[1].N, p[1].I, p[2].N, p[2].I, p[3].N, p[3].I, p[4].N, p[4].I, p[5].N, p[5].I, p[6].N, p[6].I, p[7].N, p[7].I], w;
      }(s, o, a, l, e);
    }, this.U = Ps(e), this.m = 1024, this.R = e === "SHA-384" ? 384 : 512, this.K = !1, i.hmacKey && this.k(St("hmacKey", i.hmacKey, this.T));
  }
};
const vc = [new S(0, 1), new S(0, 32898), new S(2147483648, 32906), new S(2147483648, 2147516416), new S(0, 32907), new S(0, 2147483649), new S(2147483648, 2147516545), new S(2147483648, 32777), new S(0, 138), new S(0, 136), new S(0, 2147516425), new S(0, 2147483658), new S(0, 2147516555), new S(2147483648, 139), new S(2147483648, 32905), new S(2147483648, 32771), new S(2147483648, 32770), new S(2147483648, 128), new S(0, 32778), new S(2147483648, 2147483658), new S(2147483648, 2147516545), new S(2147483648, 32896), new S(0, 2147483649), new S(2147483648, 2147516424)], bc = [[0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61], [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]];
function wi(n) {
  let e;
  const t = [];
  for (e = 0; e < 5; e += 1) t[e] = [new S(0, 0), new S(0, 0), new S(0, 0), new S(0, 0), new S(0, 0)];
  return t;
}
function wc(n) {
  let e;
  const t = [];
  for (e = 0; e < 5; e += 1) t[e] = n[e].slice();
  return t;
}
function er(n, e) {
  let t, r, i, s;
  const o = [], a = [];
  if (n !== null) for (r = 0; r < n.length; r += 2) e[(r >>> 1) % 5][(r >>> 1) / 5 | 0] = yn(e[(r >>> 1) % 5][(r >>> 1) / 5 | 0], new S(n[r + 1], n[r]));
  for (t = 0; t < 24; t += 1) {
    for (s = wi(), r = 0; r < 5; r += 1) o[r] = (l = e[r][0], c = e[r][1], u = e[r][2], d = e[r][3], p = e[r][4], new S(l.N ^ c.N ^ u.N ^ d.N ^ p.N, l.I ^ c.I ^ u.I ^ d.I ^ p.I));
    for (r = 0; r < 5; r += 1) a[r] = yn(o[(r + 4) % 5], Bs(o[(r + 1) % 5], 1));
    for (r = 0; r < 5; r += 1) for (i = 0; i < 5; i += 1) e[r][i] = yn(e[r][i], a[r]);
    for (r = 0; r < 5; r += 1) for (i = 0; i < 5; i += 1) s[i][(2 * r + 3 * i) % 5] = Bs(e[r][i], bc[r][i]);
    for (r = 0; r < 5; r += 1) for (i = 0; i < 5; i += 1) e[r][i] = yn(s[r][i], new S(~s[(r + 1) % 5][i].N & s[(r + 2) % 5][i].N, ~s[(r + 1) % 5][i].I & s[(r + 2) % 5][i].I));
    e[0][0] = yn(e[0][0], vc[t]);
  }
  var l, c, u, d, p;
  return e;
}
function Ta(n) {
  let e, t, r = 0;
  const i = [0, 0], s = [4294967295 & n, n / Wn & 2097151];
  for (e = 6; e >= 0; e--) t = s[e >> 2] >>> 8 * e & 255, t === 0 && r === 0 || (i[r + 1 >> 2] |= t << 8 * (r + 1), r += 1);
  return r = r !== 0 ? r : 1, i[0] |= r, { value: r + 1 > 4 ? i : [i[0]], binLen: 8 + 8 * r };
}
function Gr(n) {
  return br(Ta(n.binLen), n);
}
function Us(n, e) {
  let t, r = Ta(e);
  r = br(r, n);
  const i = e >>> 2, s = (i - r.value.length % i) % i;
  for (t = 0; t < s; t++) r.value.push(0);
  return r.value;
}
let _c = class extends Or {
  constructor(n, e, t) {
    let r = 6, i = 0;
    super(n, e, t);
    const s = t || {};
    if (this.numRounds !== 1) {
      if (s.kmacKey || s.hmacKey) throw new Error(wa);
      if (this.o === "CSHAKE128" || this.o === "CSHAKE256") throw new Error("Cannot set numRounds for CSHAKE variants");
    }
    switch (this.T = 1, this.C = fn(this.t, this.i, this.T), this.v = er, this.L = wc, this.B = wi, this.U = wi(), this.K = !1, n) {
      case "SHA3-224":
        this.m = i = 1152, this.R = 224, this.M = !0, this.g = this.Y;
        break;
      case "SHA3-256":
        this.m = i = 1088, this.R = 256, this.M = !0, this.g = this.Y;
        break;
      case "SHA3-384":
        this.m = i = 832, this.R = 384, this.M = !0, this.g = this.Y;
        break;
      case "SHA3-512":
        this.m = i = 576, this.R = 512, this.M = !0, this.g = this.Y;
        break;
      case "SHAKE128":
        r = 31, this.m = i = 1344, this.R = -1, this.K = !0, this.M = !1, this.g = null;
        break;
      case "SHAKE256":
        r = 31, this.m = i = 1088, this.R = -1, this.K = !0, this.M = !1, this.g = null;
        break;
      case "KMAC128":
        r = 4, this.m = i = 1344, this.X(t), this.R = -1, this.K = !0, this.M = !1, this.g = this._;
        break;
      case "KMAC256":
        r = 4, this.m = i = 1088, this.X(t), this.R = -1, this.K = !0, this.M = !1, this.g = this._;
        break;
      case "CSHAKE128":
        this.m = i = 1344, r = this.O(t), this.R = -1, this.K = !0, this.M = !1, this.g = null;
        break;
      case "CSHAKE256":
        this.m = i = 1088, r = this.O(t), this.R = -1, this.K = !0, this.M = !1, this.g = null;
        break;
      default:
        throw new Error(Kn);
    }
    this.F = function(o, a, l, c, u) {
      return function(d, p, m, v, w, _, E) {
        let T, I, A = 0;
        const R = [], N = w >>> 5, M = p >>> 5;
        for (T = 0; T < M && p >= w; T += N) v = er(d.slice(T, T + N), v), p -= w;
        for (d = d.slice(T), p %= w; d.length < N; ) d.push(0);
        for (T = p >>> 3, d[T >> 2] ^= _ << T % 4 * 8, d[N - 1] ^= 2147483648, v = er(d, v); 32 * R.length < E && (I = v[A % 5][A / 5 | 0], R.push(I.I), !(32 * R.length >= E)); ) R.push(I.N), A += 1, 64 * A % w == 0 && (er(null, v), A = 0);
        return R;
      }(o, a, 0, c, i, r, u);
    }, s.hmacKey && this.k(St("hmacKey", s.hmacKey, this.T));
  }
  O(n, e) {
    const t = function(i) {
      const s = i;
      return { funcName: St("funcName", s.funcName, 1, { value: [], binLen: 0 }), customization: St("Customization", s.customization, 1, { value: [], binLen: 0 }) };
    }(n || {});
    e && (t.funcName = e);
    const r = br(Gr(t.funcName), Gr(t.customization));
    if (t.customization.binLen !== 0 || t.funcName.binLen !== 0) {
      const i = Us(r, this.m >>> 3);
      for (let s = 0; s < i.length; s += this.m >>> 5) this.U = this.v(i.slice(s, s + (this.m >>> 5)), this.U), this.A += this.m;
      return 4;
    }
    return 31;
  }
  X(n) {
    const e = function(r) {
      const i = r;
      return { kmacKey: St("kmacKey", i.kmacKey, 1), funcName: { value: [1128353099], binLen: 32 }, customization: St("Customization", i.customization, 1, { value: [], binLen: 0 }) };
    }(n || {});
    this.O(n, e.funcName);
    const t = Us(Gr(e.kmacKey), this.m >>> 3);
    for (let r = 0; r < t.length; r += this.m >>> 5) this.U = this.v(t.slice(r, r + (this.m >>> 5)), this.U), this.A += this.m;
    this.H = !0;
  }
  _(n) {
    const e = br({ value: this.h.slice(), binLen: this.u }, function(t) {
      let r, i, s = 0;
      const o = [0, 0], a = [4294967295 & t, t / Wn & 2097151];
      for (r = 6; r >= 0; r--) i = a[r >> 2] >>> 8 * r & 255, i === 0 && s === 0 || (o[s >> 2] |= i << 8 * s, s += 1);
      return s = s !== 0 ? s : 1, o[s >> 2] |= s << 8 * s, { value: s + 1 > 4 ? o : [o[0]], binLen: 8 + 8 * s };
    }(n.outputLen));
    return this.F(e.value, e.binLen, this.A, this.L(this.U), n.outputLen);
  }
};
class qe {
  constructor(e, t, r) {
    if (e == "SHA-1") this.P = new ac(e, t, r);
    else if (e == "SHA-224" || e == "SHA-256") this.P = new uc(e, t, r);
    else if (e == "SHA-384" || e == "SHA-512") this.P = new gc(e, t, r);
    else {
      if (e != "SHA3-224" && e != "SHA3-256" && e != "SHA3-384" && e != "SHA3-512" && e != "SHAKE128" && e != "SHAKE256" && e != "CSHAKE128" && e != "CSHAKE256" && e != "KMAC128" && e != "KMAC256") throw new Error(Kn);
      this.P = new _c(e, t, r);
    }
  }
  update(e) {
    return this.P.update(e), this;
  }
  getHash(e, t) {
    return this.P.getHash(e, t);
  }
  setHMACKey(e, t, r) {
    this.P.setHMACKey(e, t, r);
  }
  getHMAC(e, t) {
    return this.P.getHMAC(e, t);
  }
}
var Aa = {}, Cr = {};
Cr.byteLength = kc;
Cr.toByteArray = Tc;
Cr.fromByteArray = Oc;
var et = [], Ue = [], Ec = typeof Uint8Array < "u" ? Uint8Array : Array, Jr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Jt = 0, Sc = Jr.length; Jt < Sc; ++Jt)
  et[Jt] = Jr[Jt], Ue[Jr.charCodeAt(Jt)] = Jt;
Ue[45] = 62;
Ue[95] = 63;
function Ia(n) {
  var e = n.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var t = n.indexOf("=");
  t === -1 && (t = e);
  var r = t === e ? 0 : 4 - t % 4;
  return [t, r];
}
function kc(n) {
  var e = Ia(n), t = e[0], r = e[1];
  return (t + r) * 3 / 4 - r;
}
function xc(n, e, t) {
  return (e + t) * 3 / 4 - t;
}
function Tc(n) {
  var e, t = Ia(n), r = t[0], i = t[1], s = new Ec(xc(n, r, i)), o = 0, a = i > 0 ? r - 4 : r, l;
  for (l = 0; l < a; l += 4)
    e = Ue[n.charCodeAt(l)] << 18 | Ue[n.charCodeAt(l + 1)] << 12 | Ue[n.charCodeAt(l + 2)] << 6 | Ue[n.charCodeAt(l + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
  return i === 2 && (e = Ue[n.charCodeAt(l)] << 2 | Ue[n.charCodeAt(l + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = Ue[n.charCodeAt(l)] << 10 | Ue[n.charCodeAt(l + 1)] << 4 | Ue[n.charCodeAt(l + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
}
function Ac(n) {
  return et[n >> 18 & 63] + et[n >> 12 & 63] + et[n >> 6 & 63] + et[n & 63];
}
function Ic(n, e, t) {
  for (var r, i = [], s = e; s < t; s += 3)
    r = (n[s] << 16 & 16711680) + (n[s + 1] << 8 & 65280) + (n[s + 2] & 255), i.push(Ac(r));
  return i.join("");
}
function Oc(n) {
  for (var e, t = n.length, r = t % 3, i = [], s = 16383, o = 0, a = t - r; o < a; o += s)
    i.push(Ic(n, o, o + s > a ? a : o + s));
  return r === 1 ? (e = n[t - 1], i.push(
    et[e >> 2] + et[e << 4 & 63] + "=="
  )) : r === 2 && (e = (n[t - 2] << 8) + n[t - 1], i.push(
    et[e >> 10] + et[e >> 4 & 63] + et[e << 2 & 63] + "="
  )), i.join("");
}
var Xi = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
Xi.read = function(n, e, t, r, i) {
  var s, o, a = i * 8 - r - 1, l = (1 << a) - 1, c = l >> 1, u = -7, d = t ? i - 1 : 0, p = t ? -1 : 1, m = n[e + d];
  for (d += p, s = m & (1 << -u) - 1, m >>= -u, u += a; u > 0; s = s * 256 + n[e + d], d += p, u -= 8)
    ;
  for (o = s & (1 << -u) - 1, s >>= -u, u += r; u > 0; o = o * 256 + n[e + d], d += p, u -= 8)
    ;
  if (s === 0)
    s = 1 - c;
  else {
    if (s === l)
      return o ? NaN : (m ? -1 : 1) * (1 / 0);
    o = o + Math.pow(2, r), s = s - c;
  }
  return (m ? -1 : 1) * o * Math.pow(2, s - r);
};
Xi.write = function(n, e, t, r, i, s) {
  var o, a, l, c = s * 8 - i - 1, u = (1 << c) - 1, d = u >> 1, p = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, m = r ? 0 : s - 1, v = r ? 1 : -1, w = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
  for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (a = isNaN(e) ? 1 : 0, o = u) : (o = Math.floor(Math.log(e) / Math.LN2), e * (l = Math.pow(2, -o)) < 1 && (o--, l *= 2), o + d >= 1 ? e += p / l : e += p * Math.pow(2, 1 - d), e * l >= 2 && (o++, l /= 2), o + d >= u ? (a = 0, o = u) : o + d >= 1 ? (a = (e * l - 1) * Math.pow(2, i), o = o + d) : (a = e * Math.pow(2, d - 1) * Math.pow(2, i), o = 0)); i >= 8; n[t + m] = a & 255, m += v, a /= 256, i -= 8)
    ;
  for (o = o << i | a, c += i; c > 0; n[t + m] = o & 255, m += v, o /= 256, c -= 8)
    ;
  n[t + m - v] |= w * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(n) {
  const e = Cr, t = Xi, r = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  n.Buffer = u, n.SlowBuffer = R, n.INSPECT_MAX_BYTES = 50;
  const i = 2147483647;
  n.kMaxLength = i;
  const { Uint8Array: s, ArrayBuffer: o, SharedArrayBuffer: a } = globalThis;
  u.TYPED_ARRAY_SUPPORT = l(), !u.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function l() {
    try {
      const y = new s(1), h = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(h, s.prototype), Object.setPrototypeOf(y, h), y.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(u.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (u.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(u.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (u.isBuffer(this))
        return this.byteOffset;
    }
  });
  function c(y) {
    if (y > i)
      throw new RangeError('The value "' + y + '" is invalid for option "size"');
    const h = new s(y);
    return Object.setPrototypeOf(h, u.prototype), h;
  }
  function u(y, h, f) {
    if (typeof y == "number") {
      if (typeof h == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return v(y);
    }
    return d(y, h, f);
  }
  u.poolSize = 8192;
  function d(y, h, f) {
    if (typeof y == "string")
      return w(y, h);
    if (o.isView(y))
      return E(y);
    if (y == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof y
      );
    if (Ye(y, o) || y && Ye(y.buffer, o) || typeof a < "u" && (Ye(y, a) || y && Ye(y.buffer, a)))
      return T(y, h, f);
    if (typeof y == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const g = y.valueOf && y.valueOf();
    if (g != null && g !== y)
      return u.from(g, h, f);
    const b = I(y);
    if (b) return b;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof y[Symbol.toPrimitive] == "function")
      return u.from(y[Symbol.toPrimitive]("string"), h, f);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof y
    );
  }
  u.from = function(y, h, f) {
    return d(y, h, f);
  }, Object.setPrototypeOf(u.prototype, s.prototype), Object.setPrototypeOf(u, s);
  function p(y) {
    if (typeof y != "number")
      throw new TypeError('"size" argument must be of type number');
    if (y < 0)
      throw new RangeError('The value "' + y + '" is invalid for option "size"');
  }
  function m(y, h, f) {
    return p(y), y <= 0 ? c(y) : h !== void 0 ? typeof f == "string" ? c(y).fill(h, f) : c(y).fill(h) : c(y);
  }
  u.alloc = function(y, h, f) {
    return m(y, h, f);
  };
  function v(y) {
    return p(y), c(y < 0 ? 0 : A(y) | 0);
  }
  u.allocUnsafe = function(y) {
    return v(y);
  }, u.allocUnsafeSlow = function(y) {
    return v(y);
  };
  function w(y, h) {
    if ((typeof h != "string" || h === "") && (h = "utf8"), !u.isEncoding(h))
      throw new TypeError("Unknown encoding: " + h);
    const f = N(y, h) | 0;
    let g = c(f);
    const b = g.write(y, h);
    return b !== f && (g = g.slice(0, b)), g;
  }
  function _(y) {
    const h = y.length < 0 ? 0 : A(y.length) | 0, f = c(h);
    for (let g = 0; g < h; g += 1)
      f[g] = y[g] & 255;
    return f;
  }
  function E(y) {
    if (Ye(y, s)) {
      const h = new s(y);
      return T(h.buffer, h.byteOffset, h.byteLength);
    }
    return _(y);
  }
  function T(y, h, f) {
    if (h < 0 || y.byteLength < h)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (y.byteLength < h + (f || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let g;
    return h === void 0 && f === void 0 ? g = new s(y) : f === void 0 ? g = new s(y, h) : g = new s(y, h, f), Object.setPrototypeOf(g, u.prototype), g;
  }
  function I(y) {
    if (u.isBuffer(y)) {
      const h = A(y.length) | 0, f = c(h);
      return f.length === 0 || y.copy(f, 0, 0, h), f;
    }
    if (y.length !== void 0)
      return typeof y.length != "number" || zr(y.length) ? c(0) : _(y);
    if (y.type === "Buffer" && Array.isArray(y.data))
      return _(y.data);
  }
  function A(y) {
    if (y >= i)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i.toString(16) + " bytes");
    return y | 0;
  }
  function R(y) {
    return +y != y && (y = 0), u.alloc(+y);
  }
  u.isBuffer = function(h) {
    return h != null && h._isBuffer === !0 && h !== u.prototype;
  }, u.compare = function(h, f) {
    if (Ye(h, s) && (h = u.from(h, h.offset, h.byteLength)), Ye(f, s) && (f = u.from(f, f.offset, f.byteLength)), !u.isBuffer(h) || !u.isBuffer(f))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (h === f) return 0;
    let g = h.length, b = f.length;
    for (let k = 0, O = Math.min(g, b); k < O; ++k)
      if (h[k] !== f[k]) {
        g = h[k], b = f[k];
        break;
      }
    return g < b ? -1 : b < g ? 1 : 0;
  }, u.isEncoding = function(h) {
    switch (String(h).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return !0;
      default:
        return !1;
    }
  }, u.concat = function(h, f) {
    if (!Array.isArray(h))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (h.length === 0)
      return u.alloc(0);
    let g;
    if (f === void 0)
      for (f = 0, g = 0; g < h.length; ++g)
        f += h[g].length;
    const b = u.allocUnsafe(f);
    let k = 0;
    for (g = 0; g < h.length; ++g) {
      let O = h[g];
      if (Ye(O, s))
        k + O.length > b.length ? (u.isBuffer(O) || (O = u.from(O)), O.copy(b, k)) : s.prototype.set.call(
          b,
          O,
          k
        );
      else if (u.isBuffer(O))
        O.copy(b, k);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      k += O.length;
    }
    return b;
  };
  function N(y, h) {
    if (u.isBuffer(y))
      return y.length;
    if (o.isView(y) || Ye(y, o))
      return y.byteLength;
    if (typeof y != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof y
      );
    const f = y.length, g = arguments.length > 2 && arguments[2] === !0;
    if (!g && f === 0) return 0;
    let b = !1;
    for (; ; )
      switch (h) {
        case "ascii":
        case "latin1":
        case "binary":
          return f;
        case "utf8":
        case "utf-8":
          return Kr(y).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return f * 2;
        case "hex":
          return f >>> 1;
        case "base64":
          return Cs(y).length;
        default:
          if (b)
            return g ? -1 : Kr(y).length;
          h = ("" + h).toLowerCase(), b = !0;
      }
  }
  u.byteLength = N;
  function M(y, h, f) {
    let g = !1;
    if ((h === void 0 || h < 0) && (h = 0), h > this.length || ((f === void 0 || f > this.length) && (f = this.length), f <= 0) || (f >>>= 0, h >>>= 0, f <= h))
      return "";
    for (y || (y = "utf8"); ; )
      switch (y) {
        case "hex":
          return Je(this, h, f);
        case "utf8":
        case "utf-8":
          return P(this, h, f);
        case "ascii":
          return Ae(this, h, f);
        case "latin1":
        case "binary":
          return G(this, h, f);
        case "base64":
          return X(this, h, f);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return At(this, h, f);
        default:
          if (g) throw new TypeError("Unknown encoding: " + y);
          y = (y + "").toLowerCase(), g = !0;
      }
  }
  u.prototype._isBuffer = !0;
  function B(y, h, f) {
    const g = y[h];
    y[h] = y[f], y[f] = g;
  }
  u.prototype.swap16 = function() {
    const h = this.length;
    if (h % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let f = 0; f < h; f += 2)
      B(this, f, f + 1);
    return this;
  }, u.prototype.swap32 = function() {
    const h = this.length;
    if (h % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let f = 0; f < h; f += 4)
      B(this, f, f + 3), B(this, f + 1, f + 2);
    return this;
  }, u.prototype.swap64 = function() {
    const h = this.length;
    if (h % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let f = 0; f < h; f += 8)
      B(this, f, f + 7), B(this, f + 1, f + 6), B(this, f + 2, f + 5), B(this, f + 3, f + 4);
    return this;
  }, u.prototype.toString = function() {
    const h = this.length;
    return h === 0 ? "" : arguments.length === 0 ? P(this, 0, h) : M.apply(this, arguments);
  }, u.prototype.toLocaleString = u.prototype.toString, u.prototype.equals = function(h) {
    if (!u.isBuffer(h)) throw new TypeError("Argument must be a Buffer");
    return this === h ? !0 : u.compare(this, h) === 0;
  }, u.prototype.inspect = function() {
    let h = "";
    const f = n.INSPECT_MAX_BYTES;
    return h = this.toString("hex", 0, f).replace(/(.{2})/g, "$1 ").trim(), this.length > f && (h += " ... "), "<Buffer " + h + ">";
  }, r && (u.prototype[r] = u.prototype.inspect), u.prototype.compare = function(h, f, g, b, k) {
    if (Ye(h, s) && (h = u.from(h, h.offset, h.byteLength)), !u.isBuffer(h))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof h
      );
    if (f === void 0 && (f = 0), g === void 0 && (g = h ? h.length : 0), b === void 0 && (b = 0), k === void 0 && (k = this.length), f < 0 || g > h.length || b < 0 || k > this.length)
      throw new RangeError("out of range index");
    if (b >= k && f >= g)
      return 0;
    if (b >= k)
      return -1;
    if (f >= g)
      return 1;
    if (f >>>= 0, g >>>= 0, b >>>= 0, k >>>= 0, this === h) return 0;
    let O = k - b, W = g - f;
    const ce = Math.min(O, W), oe = this.slice(b, k), le = h.slice(f, g);
    for (let te = 0; te < ce; ++te)
      if (oe[te] !== le[te]) {
        O = oe[te], W = le[te];
        break;
      }
    return O < W ? -1 : W < O ? 1 : 0;
  };
  function q(y, h, f, g, b) {
    if (y.length === 0) return -1;
    if (typeof f == "string" ? (g = f, f = 0) : f > 2147483647 ? f = 2147483647 : f < -2147483648 && (f = -2147483648), f = +f, zr(f) && (f = b ? 0 : y.length - 1), f < 0 && (f = y.length + f), f >= y.length) {
      if (b) return -1;
      f = y.length - 1;
    } else if (f < 0)
      if (b) f = 0;
      else return -1;
    if (typeof h == "string" && (h = u.from(h, g)), u.isBuffer(h))
      return h.length === 0 ? -1 : z(y, h, f, g, b);
    if (typeof h == "number")
      return h = h & 255, typeof s.prototype.indexOf == "function" ? b ? s.prototype.indexOf.call(y, h, f) : s.prototype.lastIndexOf.call(y, h, f) : z(y, [h], f, g, b);
    throw new TypeError("val must be string, number or Buffer");
  }
  function z(y, h, f, g, b) {
    let k = 1, O = y.length, W = h.length;
    if (g !== void 0 && (g = String(g).toLowerCase(), g === "ucs2" || g === "ucs-2" || g === "utf16le" || g === "utf-16le")) {
      if (y.length < 2 || h.length < 2)
        return -1;
      k = 2, O /= 2, W /= 2, f /= 2;
    }
    function ce(le, te) {
      return k === 1 ? le[te] : le.readUInt16BE(te * k);
    }
    let oe;
    if (b) {
      let le = -1;
      for (oe = f; oe < O; oe++)
        if (ce(y, oe) === ce(h, le === -1 ? 0 : oe - le)) {
          if (le === -1 && (le = oe), oe - le + 1 === W) return le * k;
        } else
          le !== -1 && (oe -= oe - le), le = -1;
    } else
      for (f + W > O && (f = O - W), oe = f; oe >= 0; oe--) {
        let le = !0;
        for (let te = 0; te < W; te++)
          if (ce(y, oe + te) !== ce(h, te)) {
            le = !1;
            break;
          }
        if (le) return oe;
      }
    return -1;
  }
  u.prototype.includes = function(h, f, g) {
    return this.indexOf(h, f, g) !== -1;
  }, u.prototype.indexOf = function(h, f, g) {
    return q(this, h, f, g, !0);
  }, u.prototype.lastIndexOf = function(h, f, g) {
    return q(this, h, f, g, !1);
  };
  function Y(y, h, f, g) {
    f = Number(f) || 0;
    const b = y.length - f;
    g ? (g = Number(g), g > b && (g = b)) : g = b;
    const k = h.length;
    g > k / 2 && (g = k / 2);
    let O;
    for (O = 0; O < g; ++O) {
      const W = parseInt(h.substr(O * 2, 2), 16);
      if (zr(W)) return O;
      y[f + O] = W;
    }
    return O;
  }
  function Te(y, h, f, g) {
    return Zn(Kr(h, y.length - f), y, f, g);
  }
  function Ge(y, h, f, g) {
    return Zn(Yu(h), y, f, g);
  }
  function Pe(y, h, f, g) {
    return Zn(Cs(h), y, f, g);
  }
  function V(y, h, f, g) {
    return Zn(Xu(h, y.length - f), y, f, g);
  }
  u.prototype.write = function(h, f, g, b) {
    if (f === void 0)
      b = "utf8", g = this.length, f = 0;
    else if (g === void 0 && typeof f == "string")
      b = f, g = this.length, f = 0;
    else if (isFinite(f))
      f = f >>> 0, isFinite(g) ? (g = g >>> 0, b === void 0 && (b = "utf8")) : (b = g, g = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const k = this.length - f;
    if ((g === void 0 || g > k) && (g = k), h.length > 0 && (g < 0 || f < 0) || f > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    b || (b = "utf8");
    let O = !1;
    for (; ; )
      switch (b) {
        case "hex":
          return Y(this, h, f, g);
        case "utf8":
        case "utf-8":
          return Te(this, h, f, g);
        case "ascii":
        case "latin1":
        case "binary":
          return Ge(this, h, f, g);
        case "base64":
          return Pe(this, h, f, g);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return V(this, h, f, g);
        default:
          if (O) throw new TypeError("Unknown encoding: " + b);
          b = ("" + b).toLowerCase(), O = !0;
      }
  }, u.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function X(y, h, f) {
    return h === 0 && f === y.length ? e.fromByteArray(y) : e.fromByteArray(y.slice(h, f));
  }
  function P(y, h, f) {
    f = Math.min(y.length, f);
    const g = [];
    let b = h;
    for (; b < f; ) {
      const k = y[b];
      let O = null, W = k > 239 ? 4 : k > 223 ? 3 : k > 191 ? 2 : 1;
      if (b + W <= f) {
        let ce, oe, le, te;
        switch (W) {
          case 1:
            k < 128 && (O = k);
            break;
          case 2:
            ce = y[b + 1], (ce & 192) === 128 && (te = (k & 31) << 6 | ce & 63, te > 127 && (O = te));
            break;
          case 3:
            ce = y[b + 1], oe = y[b + 2], (ce & 192) === 128 && (oe & 192) === 128 && (te = (k & 15) << 12 | (ce & 63) << 6 | oe & 63, te > 2047 && (te < 55296 || te > 57343) && (O = te));
            break;
          case 4:
            ce = y[b + 1], oe = y[b + 2], le = y[b + 3], (ce & 192) === 128 && (oe & 192) === 128 && (le & 192) === 128 && (te = (k & 15) << 18 | (ce & 63) << 12 | (oe & 63) << 6 | le & 63, te > 65535 && te < 1114112 && (O = te));
        }
      }
      O === null ? (O = 65533, W = 1) : O > 65535 && (O -= 65536, g.push(O >>> 10 & 1023 | 55296), O = 56320 | O & 1023), g.push(O), b += W;
    }
    return j(g);
  }
  const Q = 4096;
  function j(y) {
    const h = y.length;
    if (h <= Q)
      return String.fromCharCode.apply(String, y);
    let f = "", g = 0;
    for (; g < h; )
      f += String.fromCharCode.apply(
        String,
        y.slice(g, g += Q)
      );
    return f;
  }
  function Ae(y, h, f) {
    let g = "";
    f = Math.min(y.length, f);
    for (let b = h; b < f; ++b)
      g += String.fromCharCode(y[b] & 127);
    return g;
  }
  function G(y, h, f) {
    let g = "";
    f = Math.min(y.length, f);
    for (let b = h; b < f; ++b)
      g += String.fromCharCode(y[b]);
    return g;
  }
  function Je(y, h, f) {
    const g = y.length;
    (!h || h < 0) && (h = 0), (!f || f < 0 || f > g) && (f = g);
    let b = "";
    for (let k = h; k < f; ++k)
      b += Zu[y[k]];
    return b;
  }
  function At(y, h, f) {
    const g = y.slice(h, f);
    let b = "";
    for (let k = 0; k < g.length - 1; k += 2)
      b += String.fromCharCode(g[k] + g[k + 1] * 256);
    return b;
  }
  u.prototype.slice = function(h, f) {
    const g = this.length;
    h = ~~h, f = f === void 0 ? g : ~~f, h < 0 ? (h += g, h < 0 && (h = 0)) : h > g && (h = g), f < 0 ? (f += g, f < 0 && (f = 0)) : f > g && (f = g), f < h && (f = h);
    const b = this.subarray(h, f);
    return Object.setPrototypeOf(b, u.prototype), b;
  };
  function ae(y, h, f) {
    if (y % 1 !== 0 || y < 0) throw new RangeError("offset is not uint");
    if (y + h > f) throw new RangeError("Trying to access beyond buffer length");
  }
  u.prototype.readUintLE = u.prototype.readUIntLE = function(h, f, g) {
    h = h >>> 0, f = f >>> 0, g || ae(h, f, this.length);
    let b = this[h], k = 1, O = 0;
    for (; ++O < f && (k *= 256); )
      b += this[h + O] * k;
    return b;
  }, u.prototype.readUintBE = u.prototype.readUIntBE = function(h, f, g) {
    h = h >>> 0, f = f >>> 0, g || ae(h, f, this.length);
    let b = this[h + --f], k = 1;
    for (; f > 0 && (k *= 256); )
      b += this[h + --f] * k;
    return b;
  }, u.prototype.readUint8 = u.prototype.readUInt8 = function(h, f) {
    return h = h >>> 0, f || ae(h, 1, this.length), this[h];
  }, u.prototype.readUint16LE = u.prototype.readUInt16LE = function(h, f) {
    return h = h >>> 0, f || ae(h, 2, this.length), this[h] | this[h + 1] << 8;
  }, u.prototype.readUint16BE = u.prototype.readUInt16BE = function(h, f) {
    return h = h >>> 0, f || ae(h, 2, this.length), this[h] << 8 | this[h + 1];
  }, u.prototype.readUint32LE = u.prototype.readUInt32LE = function(h, f) {
    return h = h >>> 0, f || ae(h, 4, this.length), (this[h] | this[h + 1] << 8 | this[h + 2] << 16) + this[h + 3] * 16777216;
  }, u.prototype.readUint32BE = u.prototype.readUInt32BE = function(h, f) {
    return h = h >>> 0, f || ae(h, 4, this.length), this[h] * 16777216 + (this[h + 1] << 16 | this[h + 2] << 8 | this[h + 3]);
  }, u.prototype.readBigUInt64LE = bt(function(h) {
    h = h >>> 0, zt(h, "offset");
    const f = this[h], g = this[h + 7];
    (f === void 0 || g === void 0) && dn(h, this.length - 8);
    const b = f + this[++h] * 2 ** 8 + this[++h] * 2 ** 16 + this[++h] * 2 ** 24, k = this[++h] + this[++h] * 2 ** 8 + this[++h] * 2 ** 16 + g * 2 ** 24;
    return BigInt(b) + (BigInt(k) << BigInt(32));
  }), u.prototype.readBigUInt64BE = bt(function(h) {
    h = h >>> 0, zt(h, "offset");
    const f = this[h], g = this[h + 7];
    (f === void 0 || g === void 0) && dn(h, this.length - 8);
    const b = f * 2 ** 24 + this[++h] * 2 ** 16 + this[++h] * 2 ** 8 + this[++h], k = this[++h] * 2 ** 24 + this[++h] * 2 ** 16 + this[++h] * 2 ** 8 + g;
    return (BigInt(b) << BigInt(32)) + BigInt(k);
  }), u.prototype.readIntLE = function(h, f, g) {
    h = h >>> 0, f = f >>> 0, g || ae(h, f, this.length);
    let b = this[h], k = 1, O = 0;
    for (; ++O < f && (k *= 256); )
      b += this[h + O] * k;
    return k *= 128, b >= k && (b -= Math.pow(2, 8 * f)), b;
  }, u.prototype.readIntBE = function(h, f, g) {
    h = h >>> 0, f = f >>> 0, g || ae(h, f, this.length);
    let b = f, k = 1, O = this[h + --b];
    for (; b > 0 && (k *= 256); )
      O += this[h + --b] * k;
    return k *= 128, O >= k && (O -= Math.pow(2, 8 * f)), O;
  }, u.prototype.readInt8 = function(h, f) {
    return h = h >>> 0, f || ae(h, 1, this.length), this[h] & 128 ? (255 - this[h] + 1) * -1 : this[h];
  }, u.prototype.readInt16LE = function(h, f) {
    h = h >>> 0, f || ae(h, 2, this.length);
    const g = this[h] | this[h + 1] << 8;
    return g & 32768 ? g | 4294901760 : g;
  }, u.prototype.readInt16BE = function(h, f) {
    h = h >>> 0, f || ae(h, 2, this.length);
    const g = this[h + 1] | this[h] << 8;
    return g & 32768 ? g | 4294901760 : g;
  }, u.prototype.readInt32LE = function(h, f) {
    return h = h >>> 0, f || ae(h, 4, this.length), this[h] | this[h + 1] << 8 | this[h + 2] << 16 | this[h + 3] << 24;
  }, u.prototype.readInt32BE = function(h, f) {
    return h = h >>> 0, f || ae(h, 4, this.length), this[h] << 24 | this[h + 1] << 16 | this[h + 2] << 8 | this[h + 3];
  }, u.prototype.readBigInt64LE = bt(function(h) {
    h = h >>> 0, zt(h, "offset");
    const f = this[h], g = this[h + 7];
    (f === void 0 || g === void 0) && dn(h, this.length - 8);
    const b = this[h + 4] + this[h + 5] * 2 ** 8 + this[h + 6] * 2 ** 16 + (g << 24);
    return (BigInt(b) << BigInt(32)) + BigInt(f + this[++h] * 2 ** 8 + this[++h] * 2 ** 16 + this[++h] * 2 ** 24);
  }), u.prototype.readBigInt64BE = bt(function(h) {
    h = h >>> 0, zt(h, "offset");
    const f = this[h], g = this[h + 7];
    (f === void 0 || g === void 0) && dn(h, this.length - 8);
    const b = (f << 24) + // Overflow
    this[++h] * 2 ** 16 + this[++h] * 2 ** 8 + this[++h];
    return (BigInt(b) << BigInt(32)) + BigInt(this[++h] * 2 ** 24 + this[++h] * 2 ** 16 + this[++h] * 2 ** 8 + g);
  }), u.prototype.readFloatLE = function(h, f) {
    return h = h >>> 0, f || ae(h, 4, this.length), t.read(this, h, !0, 23, 4);
  }, u.prototype.readFloatBE = function(h, f) {
    return h = h >>> 0, f || ae(h, 4, this.length), t.read(this, h, !1, 23, 4);
  }, u.prototype.readDoubleLE = function(h, f) {
    return h = h >>> 0, f || ae(h, 8, this.length), t.read(this, h, !0, 52, 8);
  }, u.prototype.readDoubleBE = function(h, f) {
    return h = h >>> 0, f || ae(h, 8, this.length), t.read(this, h, !1, 52, 8);
  };
  function fe(y, h, f, g, b, k) {
    if (!u.isBuffer(y)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (h > b || h < k) throw new RangeError('"value" argument is out of bounds');
    if (f + g > y.length) throw new RangeError("Index out of range");
  }
  u.prototype.writeUintLE = u.prototype.writeUIntLE = function(h, f, g, b) {
    if (h = +h, f = f >>> 0, g = g >>> 0, !b) {
      const W = Math.pow(2, 8 * g) - 1;
      fe(this, h, f, g, W, 0);
    }
    let k = 1, O = 0;
    for (this[f] = h & 255; ++O < g && (k *= 256); )
      this[f + O] = h / k & 255;
    return f + g;
  }, u.prototype.writeUintBE = u.prototype.writeUIntBE = function(h, f, g, b) {
    if (h = +h, f = f >>> 0, g = g >>> 0, !b) {
      const W = Math.pow(2, 8 * g) - 1;
      fe(this, h, f, g, W, 0);
    }
    let k = g - 1, O = 1;
    for (this[f + k] = h & 255; --k >= 0 && (O *= 256); )
      this[f + k] = h / O & 255;
    return f + g;
  }, u.prototype.writeUint8 = u.prototype.writeUInt8 = function(h, f, g) {
    return h = +h, f = f >>> 0, g || fe(this, h, f, 1, 255, 0), this[f] = h & 255, f + 1;
  }, u.prototype.writeUint16LE = u.prototype.writeUInt16LE = function(h, f, g) {
    return h = +h, f = f >>> 0, g || fe(this, h, f, 2, 65535, 0), this[f] = h & 255, this[f + 1] = h >>> 8, f + 2;
  }, u.prototype.writeUint16BE = u.prototype.writeUInt16BE = function(h, f, g) {
    return h = +h, f = f >>> 0, g || fe(this, h, f, 2, 65535, 0), this[f] = h >>> 8, this[f + 1] = h & 255, f + 2;
  }, u.prototype.writeUint32LE = u.prototype.writeUInt32LE = function(h, f, g) {
    return h = +h, f = f >>> 0, g || fe(this, h, f, 4, 4294967295, 0), this[f + 3] = h >>> 24, this[f + 2] = h >>> 16, this[f + 1] = h >>> 8, this[f] = h & 255, f + 4;
  }, u.prototype.writeUint32BE = u.prototype.writeUInt32BE = function(h, f, g) {
    return h = +h, f = f >>> 0, g || fe(this, h, f, 4, 4294967295, 0), this[f] = h >>> 24, this[f + 1] = h >>> 16, this[f + 2] = h >>> 8, this[f + 3] = h & 255, f + 4;
  };
  function ve(y, h, f, g, b) {
    Os(h, g, b, y, f, 7);
    let k = Number(h & BigInt(4294967295));
    y[f++] = k, k = k >> 8, y[f++] = k, k = k >> 8, y[f++] = k, k = k >> 8, y[f++] = k;
    let O = Number(h >> BigInt(32) & BigInt(4294967295));
    return y[f++] = O, O = O >> 8, y[f++] = O, O = O >> 8, y[f++] = O, O = O >> 8, y[f++] = O, f;
  }
  function me(y, h, f, g, b) {
    Os(h, g, b, y, f, 7);
    let k = Number(h & BigInt(4294967295));
    y[f + 7] = k, k = k >> 8, y[f + 6] = k, k = k >> 8, y[f + 5] = k, k = k >> 8, y[f + 4] = k;
    let O = Number(h >> BigInt(32) & BigInt(4294967295));
    return y[f + 3] = O, O = O >> 8, y[f + 2] = O, O = O >> 8, y[f + 1] = O, O = O >> 8, y[f] = O, f + 8;
  }
  u.prototype.writeBigUInt64LE = bt(function(h, f = 0) {
    return ve(this, h, f, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeBigUInt64BE = bt(function(h, f = 0) {
    return me(this, h, f, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeIntLE = function(h, f, g, b) {
    if (h = +h, f = f >>> 0, !b) {
      const ce = Math.pow(2, 8 * g - 1);
      fe(this, h, f, g, ce - 1, -ce);
    }
    let k = 0, O = 1, W = 0;
    for (this[f] = h & 255; ++k < g && (O *= 256); )
      h < 0 && W === 0 && this[f + k - 1] !== 0 && (W = 1), this[f + k] = (h / O >> 0) - W & 255;
    return f + g;
  }, u.prototype.writeIntBE = function(h, f, g, b) {
    if (h = +h, f = f >>> 0, !b) {
      const ce = Math.pow(2, 8 * g - 1);
      fe(this, h, f, g, ce - 1, -ce);
    }
    let k = g - 1, O = 1, W = 0;
    for (this[f + k] = h & 255; --k >= 0 && (O *= 256); )
      h < 0 && W === 0 && this[f + k + 1] !== 0 && (W = 1), this[f + k] = (h / O >> 0) - W & 255;
    return f + g;
  }, u.prototype.writeInt8 = function(h, f, g) {
    return h = +h, f = f >>> 0, g || fe(this, h, f, 1, 127, -128), h < 0 && (h = 255 + h + 1), this[f] = h & 255, f + 1;
  }, u.prototype.writeInt16LE = function(h, f, g) {
    return h = +h, f = f >>> 0, g || fe(this, h, f, 2, 32767, -32768), this[f] = h & 255, this[f + 1] = h >>> 8, f + 2;
  }, u.prototype.writeInt16BE = function(h, f, g) {
    return h = +h, f = f >>> 0, g || fe(this, h, f, 2, 32767, -32768), this[f] = h >>> 8, this[f + 1] = h & 255, f + 2;
  }, u.prototype.writeInt32LE = function(h, f, g) {
    return h = +h, f = f >>> 0, g || fe(this, h, f, 4, 2147483647, -2147483648), this[f] = h & 255, this[f + 1] = h >>> 8, this[f + 2] = h >>> 16, this[f + 3] = h >>> 24, f + 4;
  }, u.prototype.writeInt32BE = function(h, f, g) {
    return h = +h, f = f >>> 0, g || fe(this, h, f, 4, 2147483647, -2147483648), h < 0 && (h = 4294967295 + h + 1), this[f] = h >>> 24, this[f + 1] = h >>> 16, this[f + 2] = h >>> 8, this[f + 3] = h & 255, f + 4;
  }, u.prototype.writeBigInt64LE = bt(function(h, f = 0) {
    return ve(this, h, f, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), u.prototype.writeBigInt64BE = bt(function(h, f = 0) {
    return me(this, h, f, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function Hr(y, h, f, g, b, k) {
    if (f + g > y.length) throw new RangeError("Index out of range");
    if (f < 0) throw new RangeError("Index out of range");
  }
  function Xn(y, h, f, g, b) {
    return h = +h, f = f >>> 0, b || Hr(y, h, f, 4), t.write(y, h, f, g, 23, 4), f + 4;
  }
  u.prototype.writeFloatLE = function(h, f, g) {
    return Xn(this, h, f, !0, g);
  }, u.prototype.writeFloatBE = function(h, f, g) {
    return Xn(this, h, f, !1, g);
  };
  function As(y, h, f, g, b) {
    return h = +h, f = f >>> 0, b || Hr(y, h, f, 8), t.write(y, h, f, g, 52, 8), f + 8;
  }
  u.prototype.writeDoubleLE = function(h, f, g) {
    return As(this, h, f, !0, g);
  }, u.prototype.writeDoubleBE = function(h, f, g) {
    return As(this, h, f, !1, g);
  }, u.prototype.copy = function(h, f, g, b) {
    if (!u.isBuffer(h)) throw new TypeError("argument should be a Buffer");
    if (g || (g = 0), !b && b !== 0 && (b = this.length), f >= h.length && (f = h.length), f || (f = 0), b > 0 && b < g && (b = g), b === g || h.length === 0 || this.length === 0) return 0;
    if (f < 0)
      throw new RangeError("targetStart out of bounds");
    if (g < 0 || g >= this.length) throw new RangeError("Index out of range");
    if (b < 0) throw new RangeError("sourceEnd out of bounds");
    b > this.length && (b = this.length), h.length - f < b - g && (b = h.length - f + g);
    const k = b - g;
    return this === h && typeof s.prototype.copyWithin == "function" ? this.copyWithin(f, g, b) : s.prototype.set.call(
      h,
      this.subarray(g, b),
      f
    ), k;
  }, u.prototype.fill = function(h, f, g, b) {
    if (typeof h == "string") {
      if (typeof f == "string" ? (b = f, f = 0, g = this.length) : typeof g == "string" && (b = g, g = this.length), b !== void 0 && typeof b != "string")
        throw new TypeError("encoding must be a string");
      if (typeof b == "string" && !u.isEncoding(b))
        throw new TypeError("Unknown encoding: " + b);
      if (h.length === 1) {
        const O = h.charCodeAt(0);
        (b === "utf8" && O < 128 || b === "latin1") && (h = O);
      }
    } else typeof h == "number" ? h = h & 255 : typeof h == "boolean" && (h = Number(h));
    if (f < 0 || this.length < f || this.length < g)
      throw new RangeError("Out of range index");
    if (g <= f)
      return this;
    f = f >>> 0, g = g === void 0 ? this.length : g >>> 0, h || (h = 0);
    let k;
    if (typeof h == "number")
      for (k = f; k < g; ++k)
        this[k] = h;
    else {
      const O = u.isBuffer(h) ? h : u.from(h, b), W = O.length;
      if (W === 0)
        throw new TypeError('The value "' + h + '" is invalid for argument "value"');
      for (k = 0; k < g - f; ++k)
        this[k + f] = O[k % W];
    }
    return this;
  };
  const Kt = {};
  function Wr(y, h, f) {
    Kt[y] = class extends f {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: h.apply(this, arguments),
          writable: !0,
          configurable: !0
        }), this.name = `${this.name} [${y}]`, this.stack, delete this.name;
      }
      get code() {
        return y;
      }
      set code(b) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: b,
          writable: !0
        });
      }
      toString() {
        return `${this.name} [${y}]: ${this.message}`;
      }
    };
  }
  Wr(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(y) {
      return y ? `${y} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), Wr(
    "ERR_INVALID_ARG_TYPE",
    function(y, h) {
      return `The "${y}" argument must be of type number. Received type ${typeof h}`;
    },
    TypeError
  ), Wr(
    "ERR_OUT_OF_RANGE",
    function(y, h, f) {
      let g = `The value of "${y}" is out of range.`, b = f;
      return Number.isInteger(f) && Math.abs(f) > 2 ** 32 ? b = Is(String(f)) : typeof f == "bigint" && (b = String(f), (f > BigInt(2) ** BigInt(32) || f < -(BigInt(2) ** BigInt(32))) && (b = Is(b)), b += "n"), g += ` It must be ${h}. Received ${b}`, g;
    },
    RangeError
  );
  function Is(y) {
    let h = "", f = y.length;
    const g = y[0] === "-" ? 1 : 0;
    for (; f >= g + 4; f -= 3)
      h = `_${y.slice(f - 3, f)}${h}`;
    return `${y.slice(0, f)}${h}`;
  }
  function zu(y, h, f) {
    zt(h, "offset"), (y[h] === void 0 || y[h + f] === void 0) && dn(h, y.length - (f + 1));
  }
  function Os(y, h, f, g, b, k) {
    if (y > f || y < h) {
      const O = typeof h == "bigint" ? "n" : "";
      let W;
      throw h === 0 || h === BigInt(0) ? W = `>= 0${O} and < 2${O} ** ${(k + 1) * 8}${O}` : W = `>= -(2${O} ** ${(k + 1) * 8 - 1}${O}) and < 2 ** ${(k + 1) * 8 - 1}${O}`, new Kt.ERR_OUT_OF_RANGE("value", W, y);
    }
    zu(g, b, k);
  }
  function zt(y, h) {
    if (typeof y != "number")
      throw new Kt.ERR_INVALID_ARG_TYPE(h, "number", y);
  }
  function dn(y, h, f) {
    throw Math.floor(y) !== y ? (zt(y, f), new Kt.ERR_OUT_OF_RANGE("offset", "an integer", y)) : h < 0 ? new Kt.ERR_BUFFER_OUT_OF_BOUNDS() : new Kt.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${h}`,
      y
    );
  }
  const Gu = /[^+/0-9A-Za-z-_]/g;
  function Ju(y) {
    if (y = y.split("=")[0], y = y.trim().replace(Gu, ""), y.length < 2) return "";
    for (; y.length % 4 !== 0; )
      y = y + "=";
    return y;
  }
  function Kr(y, h) {
    h = h || 1 / 0;
    let f;
    const g = y.length;
    let b = null;
    const k = [];
    for (let O = 0; O < g; ++O) {
      if (f = y.charCodeAt(O), f > 55295 && f < 57344) {
        if (!b) {
          if (f > 56319) {
            (h -= 3) > -1 && k.push(239, 191, 189);
            continue;
          } else if (O + 1 === g) {
            (h -= 3) > -1 && k.push(239, 191, 189);
            continue;
          }
          b = f;
          continue;
        }
        if (f < 56320) {
          (h -= 3) > -1 && k.push(239, 191, 189), b = f;
          continue;
        }
        f = (b - 55296 << 10 | f - 56320) + 65536;
      } else b && (h -= 3) > -1 && k.push(239, 191, 189);
      if (b = null, f < 128) {
        if ((h -= 1) < 0) break;
        k.push(f);
      } else if (f < 2048) {
        if ((h -= 2) < 0) break;
        k.push(
          f >> 6 | 192,
          f & 63 | 128
        );
      } else if (f < 65536) {
        if ((h -= 3) < 0) break;
        k.push(
          f >> 12 | 224,
          f >> 6 & 63 | 128,
          f & 63 | 128
        );
      } else if (f < 1114112) {
        if ((h -= 4) < 0) break;
        k.push(
          f >> 18 | 240,
          f >> 12 & 63 | 128,
          f >> 6 & 63 | 128,
          f & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return k;
  }
  function Yu(y) {
    const h = [];
    for (let f = 0; f < y.length; ++f)
      h.push(y.charCodeAt(f) & 255);
    return h;
  }
  function Xu(y, h) {
    let f, g, b;
    const k = [];
    for (let O = 0; O < y.length && !((h -= 2) < 0); ++O)
      f = y.charCodeAt(O), g = f >> 8, b = f % 256, k.push(b), k.push(g);
    return k;
  }
  function Cs(y) {
    return e.toByteArray(Ju(y));
  }
  function Zn(y, h, f, g) {
    let b;
    for (b = 0; b < g && !(b + f >= h.length || b >= y.length); ++b)
      h[b + f] = y[b];
    return b;
  }
  function Ye(y, h) {
    return y instanceof h || y != null && y.constructor != null && y.constructor.name != null && y.constructor.name === h.name;
  }
  function zr(y) {
    return y !== y;
  }
  const Zu = function() {
    const y = "0123456789abcdef", h = new Array(256);
    for (let f = 0; f < 16; ++f) {
      const g = f * 16;
      for (let b = 0; b < 16; ++b)
        h[g + b] = y[f] + y[b];
    }
    return h;
  }();
  function bt(y) {
    return typeof BigInt > "u" ? ec : y;
  }
  function ec() {
    throw new Error("BigInt not supported");
  }
})(Aa);
const Oa = Aa.Buffer, rt = globalThis || void 0 || self;
typeof self > "u" && (rt.self = rt);
class Ca {
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
    const r = (l, c) => {
      const u = c ? ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"] : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
      return u[Math.floor(l / 16)] + u[l % 16];
    }, i = Object.assign(
      {
        grouping: 0,
        rowlength: 0,
        uppercase: !1
      },
      t || {}
    );
    let s = "", o = 0, a = 0;
    for (let l = 0; l < e.length && (s += r(e[l], i.uppercase), l !== e.length - 1); ++l)
      i.grouping > 0 && ++o === i.grouping && (o = 0, i.rowlength > 0 && ++a === i.rowlength ? (a = 0, s += `
`) : s += " ");
    return s;
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
    const r = new Uint8Array(Math.floor(t.length / 2));
    let i = -1;
    for (let s = 0; s < t.length; ++s) {
      const o = t[s], a = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"].indexOf(o);
      if (a === -1)
        throw Error("unexpected character");
      i === -1 ? i = 16 * a : (r[Math.floor(s / 2)] = i + a, i = -1);
    }
    return r;
  }
}
String.prototype.trim || (String.prototype.trim = function() {
  return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
});
String.prototype.toCamelCase || (String.prototype.toCamelCase = function() {
  return this.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (n, e) => e.toUpperCase());
});
String.prototype.toSnakeCase || (String.prototype.toSnakeCase = function() {
  return this.replace(/[A-Z]/g, (n) => `_${n.toLowerCase()}`);
});
function wr(n, e) {
  const t = Math.ceil(n.length / e), r = [];
  for (let i = 0, s = 0; i < t; ++i, s += e)
    r[i] = n.substr(s, e);
  return r;
}
function Zi(n = 256, e = "abcdef0123456789") {
  let t = new Uint8Array(n);
  return t = crypto.getRandomValues(t), t = t.map((r) => e.charCodeAt(r % e.length)), String.fromCharCode.apply(null, t);
}
function Cc(n, e, t, r, i) {
  if (r = r || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~`!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?¿¡", i = i || r, e > r.length || t > i.length)
    return console.warn("Strings::charsetBaseConvert() - Can't convert", n, "to base", t, "greater than symbol table length. src-table:", r.length, "dest-table:", i.length), !1;
  let o = BigInt(0);
  for (let l = 0; l < n.length; l++)
    o = o * BigInt(e) + BigInt(r.indexOf(n.charAt(l)));
  let a = "";
  for (; o > 0; ) {
    const l = o % BigInt(t);
    a = i.charAt(Number(l)) + a, o /= BigInt(t);
  }
  return a || "0";
}
function Py(n) {
  return Ca.toHex(n, {});
}
function Ly(n) {
  return Ca.toUint8Array(n);
}
function Rc(n) {
  return Oa.from(n, "hex").toString("base64");
}
function Nc(n) {
  return Oa.from(n, "base64").toString("hex");
}
function Dc(n) {
  return /^[A-F0-9]+$/i.test(n);
}
function Mc(n) {
  return (typeof n == "number" || typeof n == "string" && n.trim() !== "") && !isNaN(n);
}
let _r = class {
  /**
   * Normalizes the meta array into the standard {key: ..., value: ...} format
   *
   * @param {array|object} meta
   * @return {array}
   */
  static normalizeMeta(e) {
    const t = [];
    for (const r in e)
      Object.prototype.hasOwnProperty.call(e, r) && e[r] !== null && t.push({
        key: r,
        value: e[r].toString()
      });
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
      for (const r of e)
        t[r.key] = r.value;
    else
      t = e;
    return t;
  }
};
function Ra(n, e) {
  let t, r, i;
  const s = [Array, Date, Number, String, Boolean], o = Object.prototype.toString;
  for (e = e || [], t = 0; t < e.length; t += 2)
    n === e[t] && (r = e[t + 1]);
  if (!r && n && typeof n == "object") {
    for (r = {}, t = 0; t < s.length; t++)
      o.call(n) === o.call(i = new s[t](n)) && (r = t ? i : []);
    e.push(n, r);
    for (t in n)
      e.hasOwnProperty.call(n, t) && (r[t] = Ra(n[t], e));
  }
  return r || n;
}
function Fc(...n) {
  return [].concat(...n.map((e, t) => {
    const r = n.slice(0);
    r.splice(t, 1);
    const i = [...new Set([].concat(...r))];
    return e.filter((s) => !i.includes(s));
  }));
}
function mn(...n) {
  return n.reduce((e, t) => e.filter((r) => t.includes(r)));
}
class es {
  /**
   *
   * @param policy
   * @param metaKeys
   */
  constructor(e = {}, t = {}) {
    this.policy = es.normalizePolicy(e), this.fillDefault(t);
  }
  /**
   *
   * @param policy
   * @returns {{}}
   */
  static normalizePolicy(e = {}) {
    const t = {};
    for (const [r, i] of Object.entries(e))
      if (i !== null && ["read", "write"].includes(r)) {
        t[r] = {};
        for (const [s, o] of Object.entries(i))
          t[r][s] = o;
      }
    return t;
  }
  /**
   *
   */
  fillDefault(e = {}) {
    const t = Array.from(this.policy).filter((i) => i.action === "read"), r = Array.from(this.policy).filter((i) => i.action === "write");
    for (const [i, s] of Object.entries({
      read: t,
      write: r
    })) {
      const o = s.map((a) => a.key);
      this.policy[i] || (this.policy[i] = {});
      for (const a of Fc(e, o))
        this.policy[i][a] || (this.policy[i][a] = i === "write" && !["characters", "pubkey"].includes(a) ? ["self"] : ["all"]);
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
class Ke {
  /**
   *
   * @param meta
   */
  constructor(e = {}) {
    this.meta = e;
  }
  /**
   *
   * @param meta
   * @returns {AtomMeta}
   */
  merge(e) {
    return this.meta = Object.assign(this.meta, e), this;
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
    const t = {
      pubkey: e.pubkey,
      characters: e.characters
    };
    return e.tokenUnits && e.tokenUnits.length && (t.tokenUnits = JSON.stringify(e.getTokenUnitsData())), e.tradeRates && e.tradeRates.length && (t.tradeRates = JSON.stringify(e.tradeRates)), this.merge(t), this;
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
    const t = new es(e, Object.keys(this.meta));
    return this.merge({
      policy: t.toJson()
    }), this;
  }
  /**
   *
   * @returns {*}
   */
  get() {
    return this.meta;
  }
}
class re extends TypeError {
  /**
   * @param {string|null} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = null, t = null, r = null) {
    if (super(e, t, r), e === null)
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
class Lt extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "The molecule does not contain atoms", t = null, r = null) {
    super(e, t, r), this.name = "AtomsMissingException";
  }
}
class Ft {
  /**
   *
   * @param {Atom} atom
   */
  static create(e) {
    const t = {};
    for (const r of Object.keys(e))
      Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
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
        for (const r in e)
          t.push(Ft.isStructure(e[r]) ? Ft.structure(e[r]) : e[r]);
        return t;
      }
      case "[object Object]": {
        const t = [], r = Object.keys(e).sort((i, s) => i === s ? 0 : i < s ? -1 : 1);
        for (const i of r)
          if (Object.prototype.hasOwnProperty.call(e, i)) {
            const s = {};
            s[i] = Ft.isStructure(e[i]) ? Ft.structure(e[i]) : e[i], t.push(s);
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
    return Ft.structure(this);
  }
}
class $c extends Ft {
  constructor({
    position: e = null,
    walletAddress: t = null,
    isotope: r = null,
    token: i = null,
    value: s = null,
    batchId: o = null,
    metaType: a = null,
    metaId: l = null,
    meta: c = null,
    index: u = null,
    createdAt: d = null,
    version: p = null
  }) {
    super(), this.position = e, this.walletAddress = t, this.isotope = r, this.token = i, this.value = s, this.batchId = o, this.metaType = a, this.metaId = l, this.meta = c, this.index = u, this.createdAt = d, this.version = p;
  }
}
const cr = {
  4: $c
};
class H {
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
    isotope: r = null,
    token: i = null,
    value: s = null,
    batchId: o = null,
    metaType: a = null,
    metaId: l = null,
    meta: c = null,
    otsFragment: u = null,
    index: d = null,
    version: p = null
  }) {
    this.position = e, this.walletAddress = t, this.isotope = r, this.token = i, this.value = s !== null ? String(s) : null, this.batchId = o, this.metaType = a, this.metaId = l, this.meta = c ? _r.normalizeMeta(c) : [], this.index = d, this.otsFragment = u, this.createdAt = String(+/* @__PURE__ */ new Date()), p !== null && Object.prototype.hasOwnProperty.call(cr, p) && (this.version = String(p));
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
   * @param {array|object|null} meta
   * @param {string|null} batchId
   * @returns {Atom}
   */
  static create({
    isotope: e,
    wallet: t = null,
    value: r = null,
    metaType: i = null,
    metaId: s = null,
    meta: o = null,
    batchId: a = null
  }) {
    return o || (o = new Ke()), t && (o.setAtomWallet(t), a || (a = t.batchId)), new H({
      position: t ? t.position : null,
      walletAddress: t ? t.address : null,
      isotope: e,
      token: t ? t.token : null,
      value: r,
      batchId: a,
      metaType: i,
      metaId: s,
      meta: o.get()
    });
  }
  /**
   * Converts a compliant JSON string into an Atom class instance
   *
   * @param {string} json
   * @return {object}
   */
  static jsonToObject(e) {
    const t = Object.assign(new H({}), JSON.parse(e)), r = Object.keys(new H({}));
    for (const i in t)
      Object.prototype.hasOwnProperty.call(t, i) && !r.includes(i) && delete t[i];
    return t;
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
    const r = new qe("SHAKE256", "TEXT"), i = H.sortAtoms(e);
    if (i.length === 0)
      throw new Lt();
    if (i.map((s) => {
      if (!(s instanceof H))
        throw new Lt();
      return s;
    }), i.every((s) => s.version && Object.prototype.hasOwnProperty.call(cr, s.version)))
      r.update(JSON.stringify(i.map((s) => cr[s.version].create(s).view())));
    else {
      const s = String(e.length);
      let o = [];
      for (const a of i)
        o.push(s), o = o.concat(a.getHashableValues());
      for (const a of o)
        r.update(a);
    }
    switch (t) {
      case "hex":
        return r.getHash("HEX", { outputLen: 256 });
      case "array":
        return r.getHash("ARRAYBUFFER", { outputLen: 256 });
      default:
        return Cc(r.getHash("HEX", { outputLen: 256 }), 16, 17, "0123456789abcdef", "0123456789abcdefg").padStart(64, "0");
    }
  }
  static jsonSerialization(e, t) {
    if (!H.getUnclaimedProps().includes(e))
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
    return t.sort((r, i) => r.index < i.index ? -1 : 1), t;
  }
  /**
   * Get aggregated meta from stored normalized ones
   */
  aggregatedMeta() {
    return _r.aggregateMeta(this.meta);
  }
  /**
   *
   * @returns {*[]}
   */
  getHashableValues() {
    const e = [];
    for (const t of H.getHashableProps()) {
      const r = this[t];
      if (!(r === null && !["position", "walletAddress"].includes(t)))
        if (t === "meta")
          for (const i of r)
            typeof i.value < "u" && i.value !== null && (e.push(String(i.key)), e.push(String(i.value)));
        else
          e.push(r === null ? "" : String(r));
    }
    return e;
  }
}
function _i(n = null, e = 2048) {
  if (n) {
    const t = new qe("SHAKE256", "TEXT");
    return t.update(n), t.getHash("HEX", { outputLen: e * 2 });
  } else
    return Zi(e);
}
function un(n, e = null) {
  const t = new qe("SHAKE256", "TEXT");
  return t.update(n), t.getHash("HEX", { outputLen: 256 });
}
function Er({
  molecularHash: n = null,
  index: e = null
}) {
  return n !== null && e !== null ? un(String(n) + String(e), "generateBatchId") : Zi(64);
}
class $n {
  /**
   *
   * @param id
   * @param name
   * @param metas
   */
  constructor(e, t, r) {
    this.id = e, this.name = t, this.metas = r || {};
  }
  /**
   *
   * @param data
   * @returns {*}
   */
  static createFromGraphQL(e) {
    let t = e.metas || {};
    return t.length && (t = JSON.parse(t), t || (t = {})), new $n(
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
    return new $n(
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
class Bc extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Attempting to create a wallet with no credentials (secret or bundle hash)", t = null, r = null) {
    super(e, t, r), this.name = "WalletCredentialException";
  }
}
function qs(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error("positive integer expected, got " + n);
}
function Pc(n) {
  return n instanceof Uint8Array || ArrayBuffer.isView(n) && n.constructor.name === "Uint8Array";
}
function Rr(n, ...e) {
  if (!Pc(n))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(n.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + n.length);
}
function js(n, e = !0) {
  if (n.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && n.finished)
    throw new Error("Hash#digest() has already been called");
}
function Lc(n, e) {
  Rr(n);
  const t = e.outputLen;
  if (n.length < t)
    throw new Error("digestInto() expects output buffer of length at least " + t);
}
const tr = /* @__PURE__ */ BigInt(2 ** 32 - 1), Vs = /* @__PURE__ */ BigInt(32);
function Uc(n, e = !1) {
  return e ? { h: Number(n & tr), l: Number(n >> Vs & tr) } : { h: Number(n >> Vs & tr) | 0, l: Number(n & tr) | 0 };
}
function qc(n, e = !1) {
  let t = new Uint32Array(n.length), r = new Uint32Array(n.length);
  for (let i = 0; i < n.length; i++) {
    const { h: s, l: o } = Uc(n[i], e);
    [t[i], r[i]] = [s, o];
  }
  return [t, r];
}
const jc = (n, e, t) => n << t | e >>> 32 - t, Vc = (n, e, t) => e << t | n >>> 32 - t, Qc = (n, e, t) => e << t - 32 | n >>> 64 - t, Hc = (n, e, t) => n << t - 32 | e >>> 64 - t, Yt = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Na = (n) => new Uint32Array(n.buffer, n.byteOffset, Math.floor(n.byteLength / 4)), Qs = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68, Wc = (n) => n << 24 & 4278190080 | n << 8 & 16711680 | n >>> 8 & 65280 | n >>> 24 & 255;
function Hs(n) {
  for (let e = 0; e < n.length; e++)
    n[e] = Wc(n[e]);
}
function Kc(n) {
  if (typeof n != "string")
    throw new Error("utf8ToBytes expected string, got " + typeof n);
  return new Uint8Array(new TextEncoder().encode(n));
}
function ts(n) {
  return typeof n == "string" && (n = Kc(n)), Rr(n), n;
}
class zc {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Gc(n) {
  const e = (r) => n().update(ts(r)).digest(), t = n();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => n(), e;
}
function Jc(n) {
  const e = (r, i) => n(i).update(ts(r)).digest(), t = n({});
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = (r) => n(r), e;
}
function Yc(n = 32) {
  if (Yt && typeof Yt.getRandomValues == "function")
    return Yt.getRandomValues(new Uint8Array(n));
  if (Yt && typeof Yt.randomBytes == "function")
    return Yt.randomBytes(n);
  throw new Error("crypto.getRandomValues must be defined");
}
const Da = [], Ma = [], Fa = [], Xc = /* @__PURE__ */ BigInt(0), gn = /* @__PURE__ */ BigInt(1), Zc = /* @__PURE__ */ BigInt(2), el = /* @__PURE__ */ BigInt(7), tl = /* @__PURE__ */ BigInt(256), nl = /* @__PURE__ */ BigInt(113);
for (let n = 0, e = gn, t = 1, r = 0; n < 24; n++) {
  [t, r] = [r, (2 * t + 3 * r) % 5], Da.push(2 * (5 * r + t)), Ma.push((n + 1) * (n + 2) / 2 % 64);
  let i = Xc;
  for (let s = 0; s < 7; s++)
    e = (e << gn ^ (e >> el) * nl) % tl, e & Zc && (i ^= gn << (gn << /* @__PURE__ */ BigInt(s)) - gn);
  Fa.push(i);
}
const [rl, il] = /* @__PURE__ */ qc(Fa, !0), Ws = (n, e, t) => t > 32 ? Qc(n, e, t) : jc(n, e, t), Ks = (n, e, t) => t > 32 ? Hc(n, e, t) : Vc(n, e, t);
function sl(n, e = 24) {
  const t = new Uint32Array(10);
  for (let r = 24 - e; r < 24; r++) {
    for (let o = 0; o < 10; o++)
      t[o] = n[o] ^ n[o + 10] ^ n[o + 20] ^ n[o + 30] ^ n[o + 40];
    for (let o = 0; o < 10; o += 2) {
      const a = (o + 8) % 10, l = (o + 2) % 10, c = t[l], u = t[l + 1], d = Ws(c, u, 1) ^ t[a], p = Ks(c, u, 1) ^ t[a + 1];
      for (let m = 0; m < 50; m += 10)
        n[o + m] ^= d, n[o + m + 1] ^= p;
    }
    let i = n[2], s = n[3];
    for (let o = 0; o < 24; o++) {
      const a = Ma[o], l = Ws(i, s, a), c = Ks(i, s, a), u = Da[o];
      i = n[u], s = n[u + 1], n[u] = l, n[u + 1] = c;
    }
    for (let o = 0; o < 50; o += 10) {
      for (let a = 0; a < 10; a++)
        t[a] = n[o + a];
      for (let a = 0; a < 10; a++)
        n[o + a] ^= ~t[(a + 2) % 10] & t[(a + 4) % 10];
    }
    n[0] ^= rl[r], n[1] ^= il[r];
  }
  t.fill(0);
}
class Nr extends zc {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(e, t, r, i = !1, s = 24) {
    if (super(), this.blockLen = e, this.suffix = t, this.outputLen = r, this.enableXOF = i, this.rounds = s, this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, qs(r), 0 >= this.blockLen || this.blockLen >= 200)
      throw new Error("Sha3 supports only keccak-f1600 function");
    this.state = new Uint8Array(200), this.state32 = Na(this.state);
  }
  keccak() {
    Qs || Hs(this.state32), sl(this.state32, this.rounds), Qs || Hs(this.state32), this.posOut = 0, this.pos = 0;
  }
  update(e) {
    js(this);
    const { blockLen: t, state: r } = this;
    e = ts(e);
    const i = e.length;
    for (let s = 0; s < i; ) {
      const o = Math.min(t - this.pos, i - s);
      for (let a = 0; a < o; a++)
        r[this.pos++] ^= e[s++];
      this.pos === t && this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = !0;
    const { state: e, suffix: t, pos: r, blockLen: i } = this;
    e[r] ^= t, t & 128 && r === i - 1 && this.keccak(), e[i - 1] ^= 128, this.keccak();
  }
  writeInto(e) {
    js(this, !1), Rr(e), this.finish();
    const t = this.state, { blockLen: r } = this;
    for (let i = 0, s = e.length; i < s; ) {
      this.posOut >= r && this.keccak();
      const o = Math.min(r - this.posOut, s - i);
      e.set(t.subarray(this.posOut, this.posOut + o), i), this.posOut += o, i += o;
    }
    return e;
  }
  xofInto(e) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible for this instance");
    return this.writeInto(e);
  }
  xof(e) {
    return qs(e), this.xofInto(new Uint8Array(e));
  }
  digestInto(e) {
    if (Lc(e, this), this.finished)
      throw new Error("digest() was already called");
    return this.writeInto(e), this.destroy(), e;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = !0, this.state.fill(0);
  }
  _cloneInto(e) {
    const { blockLen: t, suffix: r, outputLen: i, rounds: s, enableXOF: o } = this;
    return e || (e = new Nr(t, r, i, o, s)), e.state32.set(this.state32), e.pos = this.pos, e.posOut = this.posOut, e.finished = this.finished, e.rounds = s, e.suffix = r, e.outputLen = i, e.enableXOF = o, e.destroyed = this.destroyed, e;
  }
}
const $a = (n, e, t) => Gc(() => new Nr(e, n, t)), ol = /* @__PURE__ */ $a(6, 136, 256 / 8), al = /* @__PURE__ */ $a(6, 72, 512 / 8), Ba = (n, e, t) => Jc((r = {}) => new Nr(e, n, r.dkLen === void 0 ? t : r.dkLen, !0)), ul = /* @__PURE__ */ Ba(31, 168, 128 / 8), Pa = /* @__PURE__ */ Ba(31, 136, 256 / 8);
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
const kt = Rr, zs = Yc;
function Gs(n, e) {
  if (n.length !== e.length)
    return !1;
  let t = 0;
  for (let r = 0; r < n.length; r++)
    t |= n[r] ^ e[r];
  return t === 0;
}
function lr(...n) {
  const e = (r) => typeof r == "number" ? r : r.bytesLen, t = n.reduce((r, i) => r + e(i), 0);
  return {
    bytesLen: t,
    encode: (r) => {
      const i = new Uint8Array(t);
      for (let s = 0, o = 0; s < n.length; s++) {
        const a = n[s], l = e(a), c = typeof a == "number" ? r[s] : a.encode(r[s]);
        kt(c, l), i.set(c, o), typeof a != "number" && c.fill(0), o += l;
      }
      return i;
    },
    decode: (r) => {
      kt(r, t);
      const i = [];
      for (const s of n) {
        const o = e(s), a = r.subarray(0, o);
        i.push(typeof s == "number" ? a : s.decode(a)), r = r.subarray(o);
      }
      return i;
    }
  };
}
function Yr(n, e) {
  const t = e * n.bytesLen;
  return {
    bytesLen: t,
    encode: (r) => {
      if (r.length !== e)
        throw new Error(`vecCoder.encode: wrong length=${r.length}. Expected: ${e}`);
      const i = new Uint8Array(t);
      for (let s = 0, o = 0; s < r.length; s++) {
        const a = n.encode(r[s]);
        i.set(a, o), a.fill(0), o += a.length;
      }
      return i;
    },
    decode: (r) => {
      kt(r, t);
      const i = [];
      for (let s = 0; s < r.length; s += n.bytesLen)
        i.push(n.decode(r.subarray(s, s + n.bytesLen)));
      return i;
    }
  };
}
function Bt(...n) {
  for (const e of n)
    if (Array.isArray(e))
      for (const t of e)
        t.fill(0);
    else
      e.fill(0);
}
function Js(n) {
  return (1 << n) - 1;
}
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
function cl(n, e = 8) {
  const i = n.toString(2).padStart(8, "0").slice(-e).padStart(7, "0").split("").reverse().join("");
  return Number.parseInt(i, 2);
}
const ll = (n) => {
  const { newPoly: e, N: t, Q: r, F: i, ROOT_OF_UNITY: s, brvBits: o, isKyber: a } = n, l = (_, E = r) => {
    const T = _ % E | 0;
    return (T >= 0 ? T | 0 : E + T | 0) | 0;
  }, c = (_, E = r) => {
    const T = l(_, E) | 0;
    return (T > E >> 1 ? T - E | 0 : T) | 0;
  };
  function u() {
    const _ = e(t);
    for (let E = 0; E < t; E++) {
      const T = cl(E, o), I = BigInt(s) ** BigInt(T) % BigInt(r);
      _[E] = Number(I) | 0;
    }
    return _;
  }
  const d = u(), p = a ? 128 : t, m = a ? 1 : 0;
  return { mod: l, smod: c, nttZetas: d, NTT: {
    encode: (_) => {
      for (let E = 1, T = 128; T > m; T >>= 1)
        for (let I = 0; I < t; I += 2 * T) {
          const A = d[E++];
          for (let R = I; R < I + T; R++) {
            const N = l(A * _[R + T]);
            _[R + T] = l(_[R] - N) | 0, _[R] = l(_[R] + N) | 0;
          }
        }
      return _;
    },
    decode: (_) => {
      for (let E = p - 1, T = 1 + m; T < p + m; T <<= 1)
        for (let I = 0; I < t; I += 2 * T) {
          const A = d[E--];
          for (let R = I; R < I + T; R++) {
            const N = _[R];
            _[R] = l(N + _[R + T]), _[R + T] = l(A * (_[R + T] - N));
          }
        }
      for (let E = 0; E < _.length; E++)
        _[E] = l(i * _[E]);
      return _;
    }
  }, bitsCoder: (_, E) => {
    const T = Js(_), I = _ * (t / 8);
    return {
      bytesLen: I,
      encode: (A) => {
        const R = new Uint8Array(I);
        for (let N = 0, M = 0, B = 0, q = 0; N < A.length; N++)
          for (M |= (E.encode(A[N]) & T) << B, B += _; B >= 8; B -= 8, M >>= 8)
            R[q++] = M & Js(B);
        return R;
      },
      decode: (A) => {
        const R = e(t);
        for (let N = 0, M = 0, B = 0, q = 0; N < A.length; N++)
          for (M |= A[N] << B, B += 8; B >= _; B -= _, M >>= _)
            R[q++] = E.decode(M & T);
        return R;
      }
    };
  } };
}, hl = (n) => (e, t) => {
  t || (t = n.blockLen);
  const r = new Uint8Array(e.length + 2);
  r.set(e);
  const i = e.length, s = new Uint8Array(t);
  let o = n.create({}), a = 0, l = 0;
  return {
    stats: () => ({ calls: a, xofs: l }),
    get: (c, u) => (r[i + 0] = c, r[i + 1] = u, o.destroy(), o = n.create({}).update(r), a++, () => (l++, o.xofInto(s))),
    clean: () => {
      o.destroy(), s.fill(0), r.fill(0);
    }
  };
}, fl = /* @__PURE__ */ hl(ul);
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
const Ne = 256, mt = 3329, pl = 3303, dl = 17, { mod: Bn, nttZetas: yl, NTT: It, bitsCoder: ml } = ll({
  N: Ne,
  Q: mt,
  F: pl,
  ROOT_OF_UNITY: dl,
  newPoly: (n) => new Uint16Array(n),
  brvBits: 7,
  isKyber: !0
}), gl = {
  512: { N: Ne, Q: mt, K: 2, ETA1: 3, ETA2: 2, du: 10, dv: 4, RBGstrength: 128 },
  768: { N: Ne, Q: mt, K: 3, ETA1: 2, ETA2: 2, du: 10, dv: 4, RBGstrength: 192 },
  1024: { N: Ne, Q: mt, K: 4, ETA1: 2, ETA2: 2, du: 11, dv: 5, RBGstrength: 256 }
}, vl = (n) => {
  if (n >= 12)
    return { encode: (t) => t, decode: (t) => t };
  const e = 2 ** (n - 1);
  return {
    // const compress = (i: number) => round((2 ** d / Q) * i) % 2 ** d;
    encode: (t) => ((t << n) + mt / 2) / mt,
    // const decompress = (i: number) => round((Q / 2 ** d) * i);
    decode: (t) => t * mt + e >>> n
  };
}, vn = (n) => ml(n, vl(n));
function Ot(n, e) {
  for (let t = 0; t < Ne; t++)
    n[t] = Bn(n[t] + e[t]);
}
function bl(n, e) {
  for (let t = 0; t < Ne; t++)
    n[t] = Bn(n[t] - e[t]);
}
function wl(n, e, t, r, i) {
  const s = Bn(e * r * i + n * t), o = Bn(n * r + e * t);
  return { c0: s, c1: o };
}
function nr(n, e) {
  for (let t = 0; t < Ne / 2; t++) {
    let r = yl[64 + (t >> 1)];
    t & 1 && (r = -r);
    const { c0: i, c1: s } = wl(n[2 * t + 0], n[2 * t + 1], e[2 * t + 0], e[2 * t + 1], r);
    n[2 * t + 0] = i, n[2 * t + 1] = s;
  }
  return n;
}
function Ys(n) {
  const e = new Uint16Array(Ne);
  for (let t = 0; t < Ne; ) {
    const r = n();
    if (r.length % 3)
      throw new Error("SampleNTT: unaligned block");
    for (let i = 0; t < Ne && i + 3 <= r.length; i += 3) {
      const s = (r[i + 0] >> 0 | r[i + 1] << 8) & 4095, o = (r[i + 1] >> 4 | r[i + 2] << 4) & 4095;
      s < mt && (e[t++] = s), t < Ne && o < mt && (e[t++] = o);
    }
  }
  return e;
}
function bn(n, e, t, r) {
  const i = n(r * Ne / 4, e, t), s = new Uint16Array(Ne), o = Na(i);
  let a = 0;
  for (let l = 0, c = 0, u = 0, d = 0; l < o.length; l++) {
    let p = o[l];
    for (let m = 0; m < 32; m++)
      u += p & 1, p >>= 1, a += 1, a === r ? (d = u, u = 0) : a === 2 * r && (s[c++] = Bn(d - u), u = 0, a = 0);
  }
  if (a)
    throw new Error(`sampleCBD: leftover bits: ${a}`);
  return s;
}
const _l = (n) => {
  const { K: e, PRF: t, XOF: r, HASH512: i, ETA1: s, ETA2: o, du: a, dv: l } = n, c = vn(1), u = vn(l), d = vn(a), p = lr(Yr(vn(12), e), 32), m = Yr(vn(12), e), v = lr(Yr(d, e), u), w = lr(32, 32);
  return {
    secretCoder: m,
    secretKeyLen: m.bytesLen,
    publicKeyLen: p.bytesLen,
    cipherTextLen: v.bytesLen,
    keygen: (_) => {
      const E = new Uint8Array(33);
      E.set(_), E[32] = e;
      const T = i(E), [I, A] = w.decode(T), R = [], N = [];
      for (let q = 0; q < e; q++)
        R.push(It.encode(bn(t, A, q, s)));
      const M = r(I);
      for (let q = 0; q < e; q++) {
        const z = It.encode(bn(t, A, e + q, s));
        for (let Y = 0; Y < e; Y++) {
          const Te = Ys(M.get(Y, q));
          Ot(z, nr(Te, R[Y]));
        }
        N.push(z);
      }
      M.clean();
      const B = {
        publicKey: p.encode([N, I]),
        secretKey: m.encode(R)
      };
      return Bt(I, A, R, N, E, T), B;
    },
    encrypt: (_, E, T) => {
      const [I, A] = p.decode(_), R = [];
      for (let Y = 0; Y < e; Y++)
        R.push(It.encode(bn(t, T, Y, s)));
      const N = r(A), M = new Uint16Array(Ne), B = [];
      for (let Y = 0; Y < e; Y++) {
        const Te = bn(t, T, e + Y, o), Ge = new Uint16Array(Ne);
        for (let Pe = 0; Pe < e; Pe++) {
          const V = Ys(N.get(Y, Pe));
          Ot(Ge, nr(V, R[Pe]));
        }
        Ot(Te, It.decode(Ge)), B.push(Te), Ot(M, nr(I[Y], R[Y])), Ge.fill(0);
      }
      N.clean();
      const q = bn(t, T, 2 * e, o);
      Ot(q, It.decode(M));
      const z = c.decode(E);
      return Ot(z, q), Bt(I, R, M, q), v.encode([B, z]);
    },
    decrypt: (_, E) => {
      const [T, I] = v.decode(_), A = m.decode(E), R = new Uint16Array(Ne);
      for (let N = 0; N < e; N++)
        Ot(R, nr(A[N], It.encode(T[N])));
      return bl(I, It.decode(R)), Bt(R, A, T), c.encode(I);
    }
  };
};
function El(n) {
  const e = _l(n), { HASH256: t, HASH512: r, KDF: i } = n, { secretCoder: s, cipherTextLen: o } = e, a = e.publicKeyLen, l = lr(e.secretKeyLen, e.publicKeyLen, 32, 32), c = l.bytesLen, u = 32;
  return {
    publicKeyLen: a,
    msgLen: u,
    keygen: (d = zs(64)) => {
      kt(d, 64);
      const { publicKey: p, secretKey: m } = e.keygen(d.subarray(0, 32)), v = t(p), w = l.encode([m, p, v, d.subarray(32)]);
      return Bt(m, v), { publicKey: p, secretKey: w };
    },
    encapsulate: (d, p = zs(32)) => {
      kt(d, a), kt(p, u);
      const m = d.subarray(0, 384 * n.K), v = s.encode(s.decode(m.slice()));
      if (!Gs(v, m))
        throw Bt(v), new Error("ML-KEM.encapsulate: wrong publicKey modulus");
      Bt(v);
      const w = r.create().update(p).update(t(d)).digest(), _ = e.encrypt(d, p, w.subarray(32, 64));
      return w.subarray(32).fill(0), { cipherText: _, sharedSecret: w.subarray(0, 32) };
    },
    decapsulate: (d, p) => {
      kt(p, c), kt(d, o);
      const [m, v, w, _] = l.decode(p), E = e.decrypt(d, m), T = r.create().update(E).update(w).digest(), I = T.subarray(0, 32), A = e.encrypt(v, E, T.subarray(32, 64)), R = Gs(d, A), N = i.create({ dkLen: 32 }).update(_).update(d).digest();
      return Bt(E, A, R ? N : I), R ? I : N;
    }
  };
}
function Sl(n, e, t) {
  return Pa.create({ dkLen: n }).update(e).update(new Uint8Array([t])).digest();
}
const kl = {
  HASH256: ol,
  HASH512: al,
  KDF: Pa,
  XOF: fl,
  PRF: Sl
}, Xr = /* @__PURE__ */ El({
  ...kl,
  ...gl[768]
});
class J {
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
    token: r = "USER",
    address: i = null,
    position: s = null,
    batchId: o = null,
    characters: a = null
  }) {
    this.token = r, this.balance = 0, this.molecules = {}, this.key = null, this.privkey = null, this.pubkey = null, this.tokenUnits = [], this.tradeRates = {}, this.address = i, this.position = s, this.bundle = t, this.batchId = o, this.characters = a, e && (this.bundle = this.bundle || un(e, "Wallet::constructor"), this.position = this.position || J.generatePosition(), this.key = J.generateKey({
      secret: e,
      token: this.token,
      position: this.position
    }), this.address = this.address || J.generateAddress(this.key), this.characters = this.characters || "BASE64", this.initializeMLKEM());
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
    token: r,
    batchId: i = null,
    characters: s = null
  }) {
    let o = null;
    if (!e && !t)
      throw new Bc();
    return e && !t && (o = J.generatePosition(), t = un(e, "Wallet::create")), new J({
      secret: e,
      bundle: t,
      token: r,
      position: o,
      batchId: i,
      characters: s
    });
  }
  /**
   * Determines if the provided string is a bundle hash
   *
   * @param {string} maybeBundleHash
   * @return {boolean}
   */
  static isBundleHash(e) {
    return typeof e != "string" ? !1 : e.length === 64 && Dc(e);
  }
  /**
   * Get formatted token units from the raw data
   *
   * @param unitsData
   * @return {[]}
   */
  static getTokenUnits(e) {
    const t = [];
    return e.forEach((r) => {
      t.push($n.createFromDB(r));
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
    position: r
  }) {
    const s = BigInt(`0x${e}`) + BigInt(`0x${r}`), o = new qe("SHAKE256", "TEXT");
    o.update(s.toString(16)), t && o.update(t);
    const a = new qe("SHAKE256", "TEXT");
    return a.update(o.getHash("HEX", { outputLen: 8192 })), a.getHash("HEX", { outputLen: 8192 });
  }
  /**
   * Generates a wallet address
   *
   * @param {string} key
   * @return {string}
   */
  static generateAddress(e) {
    const t = wr(e, 128), r = new qe("SHAKE256", "TEXT");
    for (const s in t) {
      let o = t[s];
      for (let a = 1; a <= 16; a++) {
        const l = new qe("SHAKE256", "TEXT");
        l.update(o), o = l.getHash("HEX", { outputLen: 512 });
      }
      r.update(o);
    }
    const i = new qe("SHAKE256", "TEXT");
    return i.update(r.getHash("HEX", { outputLen: 8192 })), i.getHash("HEX", { outputLen: 256 });
  }
  /**
   *
   * @param saltLength
   * @returns {string}
   */
  static generatePosition(e = 64) {
    return Zi(e, "abcdef0123456789");
  }
  /**
   * Initializes the ML-KEM key pair
   */
  initializeMLKEM() {
    const e = _i(this.key, 64), t = new Uint8Array(64);
    for (let s = 0; s < 64; s++)
      t[s] = parseInt(e.substr(s * 2, 2), 16);
    const { publicKey: r, secretKey: i } = Xr.keygen(t);
    this.pubkey = this.serializeKey(r), this.privkey = i;
  }
  serializeKey(e) {
    return btoa(String.fromCharCode.apply(null, e));
  }
  deserializeKey(e) {
    const t = atob(e);
    return new Uint8Array(t.length).map((r, i) => t.charCodeAt(i));
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
  splitUnits(e, t, r = null) {
    if (e.length === 0)
      return;
    const i = [], s = [];
    this.tokenUnits.forEach((o) => {
      e.includes(o.id) ? i.push(o) : s.push(o);
    }), this.tokenUnits = i, r !== null && (r.tokenUnits = i), t.tokenUnits = s;
  }
  /**
   * Create a remainder wallet from the source one
   *
   * @param secret
   */
  createRemainder(e) {
    const t = J.create({
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
    e.batchId && (this.batchId = t ? e.batchId : Er({}));
  }
  async encryptMessage(e, t) {
    const r = JSON.stringify(e), i = new TextEncoder().encode(r), s = this.deserializeKey(t), { cipherText: o, sharedSecret: a } = Xr.encapsulate(s), l = await this.encryptWithSharedSecret(i, a);
    return {
      cipherText: this.serializeKey(o),
      encryptedMessage: this.serializeKey(l)
    };
  }
  async decryptMessage(e) {
    const { cipherText: t, encryptedMessage: r } = e, i = Xr.decapsulate(this.deserializeKey(t), this.privkey), s = await this.decryptWithSharedSecret(this.deserializeKey(r), i), o = new TextDecoder().decode(s);
    return JSON.parse(o);
  }
  async encryptWithSharedSecret(e, t) {
    const r = crypto.getRandomValues(new Uint8Array(12)), i = { name: "AES-GCM", iv: r }, s = await crypto.subtle.importKey(
      "raw",
      t,
      { name: "AES-GCM" },
      !1,
      ["encrypt"]
    ), o = await crypto.subtle.encrypt(
      i,
      s,
      e
    ), a = new Uint8Array(r.length + o.byteLength);
    return a.set(r), a.set(new Uint8Array(o), r.length), a;
  }
  /**
   * Decrypts the given message using the shared secret
   * @param encryptedMessage
   * @param sharedSecret
   * @returns {Promise<Uint8Array>}
   */
  async decryptWithSharedSecret(e, t) {
    const i = { name: "AES-GCM", iv: e.slice(0, 12) }, s = await crypto.subtle.importKey(
      "raw",
      t,
      { name: "AES-GCM" },
      !1,
      ["decrypt"]
    ), o = await crypto.subtle.decrypt(
      i,
      s,
      e.slice(12)
    );
    return new Uint8Array(o);
  }
}
class wn extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "There is an atom without an index", t = null, r = null) {
    super(e, t, r), this.name = "AtomIndexException";
  }
}
class xl extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "The molecular hash does not match", t = null, r = null) {
    super(e, t, r), this.name = "MolecularHashMismatchException";
  }
}
class Tl extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "The molecular hash is missing", t = null, r = null) {
    super(e, t, r), this.name = "MolecularHashMissingException";
  }
}
class Xs extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "", t = null, r = null) {
    super(e, t, r), this.name = "PolicyInvalidException";
  }
}
class La extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "OTS malformed", t = null, r = null) {
    super(e, t, r), this.name = "SignatureMalformedException";
  }
}
class Al extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "One-time signature (OTS) does not match!", t = null, r = null) {
    super(e, t, r), this.name = "SignatureMismatchException";
  }
}
class ct extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Insufficient balance to make transfer", t = null, r = null) {
    super(e, t, r), this.name = "TransferBalanceException";
  }
}
class Zs extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Token transfer atoms are malformed", t = null, r = null) {
    super(e, t, r), this.name = "TransferMalformedException";
  }
}
class eo extends re {
  /**
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Token slugs for wallets in transfer do not match!", t = null, r = null) {
    super(e, t, r), this.name = "TransferMismatchedException";
  }
}
class to extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Invalid remainder provided", t = null, r = null) {
    super(e, t, r), this.name = "TransferRemainderException";
  }
}
class Il extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Sender and recipient(s) cannot be the same", t = null, r = null) {
    super(e, t, r), this.name = "TransferToSelfException";
  }
}
class Ol extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Token transfer atoms are unbalanced", t = null, r = null) {
    super(e, t, r), this.name = "TransferUnbalancedException";
  }
}
class _t extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Empty meta data.", t = null, r = null) {
    super(e, t, r), this.name = "MetaMissingException";
  }
}
class _n extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Wrong type of token for this isotope", t = null, r = null) {
    super(e, t, r), this.name = "WrongTokenTypeException";
  }
}
class hr extends re {
  /**
   * @param {string|null} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Incorrect BatchId", t = null, r = null) {
    super(e, t, r), this.name = "BatchIdException";
  }
}
class no {
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
class Sr extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "An incorrect argument!", t = null, r = null) {
    super(e, t, r), this.name = "RuleArgumentException";
  }
}
class je extends re {
  /**
   * @param {string|null} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Code exception", t = null, r = null) {
    super(e, t, r), this.name = "CodeException";
  }
}
class Rn {
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
    metaId: r = null,
    meta: i = null,
    address: s = null,
    token: o = null,
    amount: a = null,
    comparison: l = null
  }) {
    if (i && (this.meta = i), !e)
      throw new Sr('Callback structure violated, missing mandatory "action" parameter.');
    this.__metaId = r, this.__metaType = t, this.__action = e, this.__address = s, this.__token = o, this.__amount = a, this.__comparison = l;
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
    if (!Mc(e))
      throw new je("Parameter amount should be a string containing numbers");
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
    this.__meta = e instanceof no ? e : no.toObject(e);
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
    const t = new Rn({
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
    return mn(Object.keys(this.toJSON()), ["action", "metaId", "metaType", "meta"]).length === 4 && this._is("meta");
  }
  /**
   * @return {boolean}
   */
  isCollect() {
    return mn(Object.keys(this.toJSON()), ["action", "address", "token", "amount", "comparison"]).length === 5 && this._is("collect");
  }
  /**
   * @return {boolean}
   */
  isBuffer() {
    return mn(Object.keys(this.toJSON()), ["action", "address", "token", "amount", "comparison"]).length === 5 && this._is("buffer");
  }
  /**
   * @return {boolean}
   */
  isRemit() {
    return mn(Object.keys(this.toJSON()), ["action", "token", "amount"]).length === 3 && this._is("remit");
  }
  /**
   * @return {boolean}
   */
  isBurn() {
    return mn(Object.keys(this.toJSON()), ["action", "token", "amount", "comparison"]).length === 4 && this._is("burn");
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
class Zr {
  /**
   *
   * @param key
   * @param value
   * @param comparison
   */
  constructor({
    key: e,
    value: t,
    comparison: r
  }) {
    if ([e, t, r].some((i) => !i))
      throw new Sr("Condition::constructor( { key, value, comparison } ) - not all class parameters are initialised!");
    this.__key = e, this.__value = t, this.__comparison = r;
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
class Pn {
  /**
   *
   * @param {Condition[]} condition
   * @param  {Callback[]} callback
   */
  constructor({
    condition: e = [],
    callback: t = []
  }) {
    for (const r of e)
      if (!(r instanceof Zr))
        throw new Sr();
    for (const r of t)
      if (!(r instanceof Rn))
        throw new Sr();
    this.__condition = e, this.__callback = t;
  }
  /**
   *
   * @param {Condition[]|{}} condition
   */
  set comparison(e) {
    this.__condition.push(e instanceof Zr ? e : Zr.toObject(e));
  }
  /**
   * @param {Callback[]|{}} callback
   */
  set callback(e) {
    this.__callback.push(e instanceof Rn ? e : Rn.toObject(e));
  }
  /**
   *
   * @param {object} object
   *
   * @return {Rule}
   */
  static toObject(e) {
    if (!e.condition)
      throw new _t("Rule::toObject() - Incorrect rule format! There is no condition field.");
    if (!e.callback)
      throw new _t("Rule::toObject() - Incorrect rule format! There is no callback field.");
    const t = new Pn({});
    for (const r of e.condition)
      t.comparison = r;
    for (const r of e.callback)
      t.callback = r;
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
class he {
  /**
   * Initialize the Dot utility with the given object and key path
   * @param {object|array} obj - The object or array to traverse
   * @param {string} keys - The dot-notated string of keys
   * @private
   */
  static __init(e, t) {
    this.arr = String(t).split("."), this.key = this.arr.shift();
    const r = Number(this.key);
    Number.isInteger(r) && (this.key = r), this.__nextKey = this.arr.length, this.__next = this.__tic(e);
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
  static get(e, t, r = null) {
    return this.__init(e, t), this.__next ? this.__nextKey === 0 ? e[this.key] : this.get(e[this.key], this.arr.join("."), r) : r;
  }
  /**
   * Set a nested property in an object using dot notation
   * @param {object|array} obj - The object or array to modify
   * @param {string} keys - The path to the property, using dot notation
   * @param {*} value - The value to set
   * @return {object|array} - The modified object or array
   */
  static set(e, t, r) {
    const i = t.split(".");
    let s = e;
    const o = i.length - 1;
    for (let c = 0; c < o; c++) {
      const u = i[c], d = Number(u), p = Number.isInteger(d);
      (p ? d : u in s) || (s[p ? d : u] = i[c + 1].match(/^\d+$/) ? [] : {}), s = s[p ? d : u];
    }
    const a = i[o], l = Number(a);
    return s[Number.isInteger(l) ? l : a] = r, e;
  }
}
class Cl {
  /**
   *
   * @param molecule
   */
  constructor(e) {
    if (e.molecularHash === null)
      throw new Tl();
    if (!e.atoms.length)
      throw new Lt();
    for (const t of e.atoms)
      if (t.index === null)
        throw new wn();
    this.molecule = e;
  }
  /**
   *
   * @param senderWallet
   * @returns {false|*|boolean}
   */
  verify(e) {
    return this.molecularHash() && this.ots() && this.batchId() && this.continuId() && this.isotopeM() && this.isotopeT() && this.isotopeC() && this.isotopeU() && this.isotopeI() && this.isotopeR() && this.isotopeV(e);
  }
  /**
   *
   * @returns {boolean}
   */
  continuId() {
    if (this.molecule.atoms[0].token === "USER" && this.molecule.getIsotopes("I").length < 1)
      throw new Lt("Check::continuId() - Molecule is missing required ContinuID Atom!");
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
        const t = this.molecule.getIsotopes("V"), r = t[t.length - 1];
        if (e.batchId !== r.batchId)
          throw new hr();
        for (const i of t)
          if (i.batchId === null)
            throw new hr();
      }
      return !0;
    }
    throw new hr();
  }
  /**
   *
   * @returns {boolean}
   */
  isotopeI() {
    for (const e of this.molecule.getIsotopes("I")) {
      if (e.token !== "USER")
        throw new _n(`Check::isotopeI() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index === 0)
        throw new wn(`Check::isotopeI() - Isotope "${e.isotope}" Atoms must have a non-zero index!`);
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
        throw new _n(`Check::isotopeU() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new wn(`Check::isotopeU() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
        throw new _t();
      if (t.token !== "USER")
        throw new _n(`Check::isotopeM() - "${t.token}" is not a valid Token slug for "${t.isotope}" isotope Atoms!`);
      const r = _r.aggregateMeta(t.meta);
      for (const i of e) {
        let s = r[i];
        if (s) {
          s = JSON.parse(s);
          for (const [o, a] of Object.entries(s))
            if (!e.includes(o)) {
              if (!Object.keys(r).includes(o))
                throw new Xs(`${o} is missing from the meta.`);
              for (const l of a)
                if (!J.isBundleHash(l) && !["all", "self"].includes(l))
                  throw new Xs(`${l} does not correspond to the format of the policy.`);
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
        throw new _n(`Check::isotopeC() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new wn(`Check::isotopeC() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
        for (const i of ["position", "bundle"])
          if (!Object.prototype.hasOwnProperty.call(t, i) || !t[i])
            throw new _t(`Check::isotopeT() - Required meta field "${i}" is missing!`);
      }
      for (const i of ["token"])
        if (!Object.prototype.hasOwnProperty.call(t, i) || !t[i])
          throw new _t(`Check::isotopeT() - Required meta field "${i}" is missing!`);
      if (e.token !== "USER")
        throw new _n(`Check::isotopeT() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new wn(`Check::isotopeT() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
        const r = JSON.parse(t.policy);
        if (!Object.keys(r).every((i) => ["read", "write"].includes(i)))
          throw new _t("Check::isotopeR() - Mixing rules with politics!");
      }
      if (t.rule) {
        const r = JSON.parse(t.rule);
        if (!Array.isArray(r))
          throw new _t("Check::isotopeR() - Incorrect rule format!");
        for (const i of r)
          Pn.toObject(i);
        if (r.length < 1)
          throw new _t("Check::isotopeR() - No rules!");
      }
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
    const r = this.molecule.atoms[0];
    if (r.isotope === "V" && t.length === 2) {
      const o = t[t.length - 1];
      if (r.token !== o.token)
        throw new eo();
      if (o.value < 0)
        throw new Zs();
      return !0;
    }
    let i = 0, s = 0;
    for (const o in this.molecule.atoms)
      if (Object.prototype.hasOwnProperty.call(this.molecule.atoms, o)) {
        const a = this.molecule.atoms[o];
        if (a.isotope !== "V")
          continue;
        if (s = a.value * 1, Number.isNaN(s))
          throw new TypeError('Invalid isotope "V" values');
        if (a.token !== r.token)
          throw new eo();
        if (o > 0) {
          if (s < 0)
            throw new Zs();
          if (a.walletAddress === r.walletAddress)
            throw new Il();
        }
        i += s;
      }
    if (i !== s)
      throw new Ol();
    if (e) {
      if (s = r.value * 1, Number.isNaN(s))
        throw new TypeError('Invalid isotope "V" values');
      const o = e.balance + s;
      if (o < 0)
        throw new ct();
      if (o !== i)
        throw new to();
    } else if (s !== 0)
      throw new to();
    return !0;
  }
  /**
   * Verifies if the hash of all the atoms matches the molecular hash to ensure content has not been messed with
   *
   * @returns {boolean}
   */
  molecularHash() {
    if (this.molecule.molecularHash !== H.hashAtoms({
      atoms: this.molecule.atoms
    }))
      throw new xl();
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
      (p, m) => p + m
    );
    if (t.length !== 2048 && (t = Nc(t), t.length !== 2048))
      throw new La();
    const r = wr(t, 128);
    let i = "";
    for (const p in r) {
      let m = r[p];
      for (let v = 0, w = 8 + e[p]; v < w; v++)
        m = new qe("SHAKE256", "TEXT").update(m).getHash("HEX", { outputLen: 512 });
      i += m;
    }
    const s = new qe("SHAKE256", "TEXT");
    s.update(i);
    const o = s.getHash("HEX", { outputLen: 8192 }), a = new qe("SHAKE256", "TEXT");
    a.update(o);
    const l = a.getHash("HEX", { outputLen: 256 }), c = this.molecule.atoms[0];
    let u = c.walletAddress;
    const d = he.get(c.aggregatedMeta(), "signingWallet");
    if (d && (u = he.get(JSON.parse(d), "address")), l !== u)
      throw new Al();
    return !0;
  }
}
class En extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Insufficient balance for requested transfer", t = null, r = null) {
    super(e, t, r), this.name = "BalanceInsufficientException";
  }
}
class ro extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Amount cannot be negative!", t = null, r = null) {
    super(e, t, r), this.name = "NegativeAmountException";
  }
}
class lt {
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
    sourceWallet: r = null,
    remainderWallet: i = null,
    cellSlug: s = null,
    version: o = null
  }) {
    this.status = null, this.molecularHash = null, this.createdAt = String(+/* @__PURE__ */ new Date()), this.cellSlugOrigin = this.cellSlug = s, this.secret = e, this.bundle = t, this.sourceWallet = r, this.atoms = [], o !== null && Object.prototype.hasOwnProperty.call(cr, o) && (this.version = String(o)), (i || r) && (this.remainderWallet = i || J.create({
      secret: e,
      bundle: t,
      token: r.token,
      batchId: r.batchId,
      characters: r.characters
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
    return Array.isArray(e) || (e = [e]), t.filter((r) => e.includes(r.isotope));
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
    const t = Object.assign(new lt({}), JSON.parse(e)), r = Object.keys(new lt({}));
    if (!Array.isArray(t.atoms))
      throw new Lt();
    for (const i in Object.keys(t.atoms)) {
      t.atoms[i] = H.jsonToObject(JSON.stringify(t.atoms[i]));
      for (const s of ["position", "walletAddress", "isotope"])
        if (t.atoms[i].isotope.toLowerCase() !== "r" && (typeof t.atoms[i][s] > "u" || t.atoms[i][s] === null))
          throw new Lt("MolecularStructure::jsonToObject() - Required Atom properties are missing!");
    }
    for (const i in t)
      Object.prototype.hasOwnProperty.call(t, i) && !r.includes(i) && delete t[i];
    return t.atoms = H.sortAtoms(t.atoms), t;
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
    }, r = [], i = e.toLowerCase().split("");
    for (let s = 0, o = i.length; s < o; ++s) {
      const a = i[s];
      typeof t[a] < "u" && (r[s] = t[a]);
    }
    return r;
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
    let t = e.reduce((i, s) => i + s);
    const r = t < 0;
    for (; t < 0 || t > 0; )
      for (const i of Object.keys(e))
        if ((r ? e[i] < 8 : e[i] > -8) && (r ? (++e[i], ++t) : (--e[i], --t), t === 0))
          break;
    return e;
  }
  /**
   *
   * @param isotopes
   * @returns {*[]}
   */
  getIsotopes(e) {
    return lt.isotopeFilter(e, this.atoms);
  }
  /**
   * Generates the next atomic index
   *
   * @return {number}
   */
  generateIndex() {
    return lt.generateNextAtomIndex(this.atoms);
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
    return this.molecularHash = null, e.index = this.generateIndex(), e.version = this.version, this.atoms.push(e), this.atoms = H.sortAtoms(this.atoms), this;
  }
  /**
   * Add user remainder atom for ContinuID
   *
   * @return {Molecule}
   */
  addContinuIdAtom() {
    return this.addAtom(H.create({
      isotope: "I",
      wallet: this.remainderWallet,
      metaType: "walletBundle",
      metaId: this.remainderWallet.bundle
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
    meta: r = {},
    policy: i = {}
  }) {
    const s = new Ke(r);
    s.addPolicy(i);
    const o = J.create({
      secret: this.secret,
      bundle: this.sourceWallet.bundle,
      token: "USER"
    });
    return this.addAtom(H.create({
      wallet: o,
      isotope: "R",
      metaType: e,
      metaId: t,
      meta: s
    })), this;
  }
  /**
   *
   * @param tokenUnits
   * @param recipientWallet
   * @returns {Molecule}
   */
  fuseToken(e, t) {
    const r = e.length;
    if (this.sourceWallet.balance - r < 0)
      throw new En();
    return this.addAtom(H.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -r
    })), this.addAtom(H.create({
      isotope: "F",
      wallet: t,
      value: 1,
      metaType: "walletBundle",
      metaId: t.bundle
    })), this.addAtom(H.create({
      isotope: "V",
      wallet: this.remainderWallet,
      value: this.sourceWallet.balance - r,
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
      throw new ro("Molecule::burnToken() - Amount to burn must be positive!");
    if (this.sourceWallet.balance - e < 0)
      throw new En();
    return this.addAtom(H.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -e
    })), this.addAtom(H.create({
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
      throw new ro("Molecule::replenishToken() - Amount to replenish must be positive!");
    if (t.length) {
      t = J.getTokenUnits(t), this.remainderWallet.tokenUnits = this.sourceWallet.tokenUnits;
      for (const r of t)
        this.remainderWallet.tokenUnits.push(r);
      this.remainderWallet.balance = this.remainderWallet.tokenUnits.length, this.sourceWallet.tokenUnits = t, this.sourceWallet.balance = this.sourceWallet.tokenUnits.length;
    } else
      this.remainderWallet.balance = this.sourceWallet.balance + e, this.sourceWallet.balance = e;
    return this.addAtom(H.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: this.sourceWallet.balance
    })), this.addAtom(H.create({
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
      throw new En();
    return this.addAtom(H.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -t
    })), this.addAtom(H.create({
      isotope: "V",
      wallet: e,
      value: t,
      metaType: "walletBundle",
      metaId: e.bundle
    })), this.addAtom(H.create({
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
      throw new En();
    const r = J.create({
      secret: this.secret,
      bundle: this.bundle,
      token: this.sourceWallet.token,
      batchId: this.sourceWallet.batchId
    });
    return r.tradeRates = t, this.addAtom(H.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -e
    })), this.addAtom(H.create({
      isotope: "B",
      wallet: r,
      value: e,
      metaType: "walletBundle",
      metaId: this.sourceWallet.bundle
    })), this.addAtom(H.create({
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
    let r = 0;
    for (const [s, o] of Object.entries(e || {}))
      r += o;
    if (this.sourceWallet.balance - r < 0)
      throw new En();
    const i = new Ke();
    t && i.setSigningWallet(t), this.addAtom(H.create({
      isotope: "B",
      wallet: this.sourceWallet,
      value: -r,
      meta: i,
      metaType: "walletBundle",
      metaId: this.sourceWallet.bundle
    }));
    for (const [s, o] of Object.entries(e || {}))
      this.addAtom(new H({
        isotope: "V",
        token: this.sourceWallet.token,
        value: o,
        batchId: this.sourceWallet.batchId ? Er({}) : null,
        metaType: "walletBundle",
        metaId: s
      }));
    return this.addAtom(H.create({
      isotope: "B",
      wallet: this.remainderWallet,
      value: this.sourceWallet.balance - r,
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
    meta: r
  }) {
    const i = new Ke(r);
    return i.setMetaWallet(e), this.addAtom(H.create({
      isotope: "C",
      wallet: this.sourceWallet,
      value: t,
      metaType: "token",
      metaId: e.token,
      meta: i,
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
    rule: r,
    policy: i = {}
  }) {
    const s = [];
    for (const a of r)
      s.push(a instanceof Pn ? a : Pn.toObject(a));
    const o = new Ke({
      rule: JSON.stringify(s)
    });
    return o.addPolicy(i), this.addAtom(H.create({
      isotope: "R",
      wallet: this.sourceWallet,
      metaType: e,
      metaId: t,
      meta: o
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
    return t || (t = new Ke()), t.setMetaWallet(e), this.addAtom(H.create({
      isotope: "C",
      wallet: this.sourceWallet,
      metaType: "wallet",
      metaId: e.address,
      meta: t,
      batchId: e.batchId
    })), this.addContinuIdAtom(), this;
  }
  /**
   * Init shadow wallet claim
   *
   * @param wallet
   */
  initShadowWalletClaim(e) {
    const t = new Ke().setShadowWalletClaim(!0);
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
    code: r
  }) {
    const i = {
      code: r,
      hash: un(t.trim(), "Molecule::initIdentifierCreation")
    };
    return this.addAtom(H.create({
      isotope: "C",
      wallet: this.sourceWallet,
      metaType: "identifier",
      metaId: e,
      meta: new Ke(i)
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
    metaId: r,
    policy: i
  }) {
    return this.addAtom(H.create({
      isotope: "M",
      wallet: this.sourceWallet,
      metaType: t,
      metaId: r,
      meta: new Ke(e)
    })), this.addPolicyAtom({
      metaType: t,
      metaId: r,
      meta: e,
      policy: i
    }), this.addContinuIdAtom(), this;
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
    metaType: r,
    metaId: i,
    meta: s = {},
    batchId: o = null
  }) {
    return s.token = e, this.local = 1, this.addAtom(H.create({
      isotope: "T",
      wallet: this.sourceWallet,
      value: t,
      metaType: r,
      metaId: i,
      meta: new Ke(s),
      batchId: o
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
    return this.addAtom(H.create({
      isotope: "U",
      wallet: this.sourceWallet,
      meta: new Ke(e)
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
    compressed: r = !0
  }) {
    if (this.atoms.length === 0 || this.atoms.filter((m) => !(m instanceof H)).length !== 0)
      throw new Lt();
    !t && !this.bundle && (this.bundle = e || un(this.secret, "Molecule::sign")), this.molecularHash = H.hashAtoms({
      atoms: this.atoms
    });
    const i = this.atoms[0];
    let s = i.position;
    const o = he.get(i.aggregatedMeta(), "signingWallet");
    if (o && (s = he.get(JSON.parse(o), "position")), !s)
      throw new La("Signing wallet must have a position!");
    const a = J.generateKey({
      secret: this.secret,
      token: i.token,
      position: i.position
    }), l = wr(a, 128), c = this.normalizedHash();
    let u = "";
    for (const m in l) {
      let v = l[m];
      for (let w = 0, _ = 8 - c[m]; w < _; w++)
        v = new qe("SHAKE256", "TEXT").update(v).getHash("HEX", { outputLen: 512 });
      u += v;
    }
    r && (u = Rc(u));
    const d = wr(u, Math.ceil(u.length / this.atoms.length));
    let p = null;
    for (let m = 0, v = d.length; m < v; m++)
      this.atoms[m].otsFragment = d[m], p = this.atoms[m].position;
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
   * Returns JSON-ready clone minus protected properties
   *
   * @return {object}
   */
  toJSON() {
    const e = Ra(this);
    for (const t of ["remainderWallet", "secret", "sourceWallet", "cellSlugOrigin", "version"])
      Object.prototype.hasOwnProperty.call(e, t) && delete e[t];
    return e;
  }
  /**
   * Validates the current molecular structure
   *
   * @param senderWallet
   */
  check(e = null) {
    new Cl(this).verify(e);
  }
  /**
   * Convert Hm to numeric notation via EnumerateMolecule(Hm)
   *
   * @returns {Array}
   */
  normalizedHash() {
    return lt.normalize(lt.enumerate(this.molecularHash));
  }
}
const ei = 10 ** 18;
class nn {
  /**
   * @param {number} value
   * @return {number}
   */
  static val(e) {
    return Math.abs(e * ei) < 1 ? 0 : e;
  }
  /**
   * @param {number} value1
   * @param {number} value2
   * @param {boolean} debug
   * @return {number}
   */
  static cmp(e, t, r = !1) {
    const i = nn.val(e) * ei, s = nn.val(t) * ei;
    return Math.abs(i - s) < 1 ? 0 : i > s ? 1 : -1;
  }
  /**
   * @param {number} value1
   * @param {number} value2
   * @return {boolean}
   */
  static equal(e, t) {
    return nn.cmp(e, t) === 0;
  }
}
class Ln {
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
    encrypt: r,
    pubkey: i
  }) {
    this.$__token = e, this.$__expiresAt = t, this.$__pubkey = i, this.$__encrypt = r;
  }
  /**
   *
   * @param data
   * @param wallet
   * @returns {AuthToken}
   */
  static create(e, t) {
    const r = new Ln(e);
    return r.setWallet(t), r;
  }
  /**
   *
   * @param {object} snapshot
   * @param {string} secret
   * @return {AuthToken}
   */
  static restore(e, t) {
    const r = new J({
      secret: t,
      token: "AUTH",
      position: e.wallet.position,
      characters: e.wallet.characters
    });
    return Ln.create({
      token: e.token,
      expiresAt: e.expiresAt,
      pubkey: e.pubkey,
      encrypt: e.encrypt
    }, r);
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
   * Get auth data for the final client (apollo)
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
class Nn extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "GraphQL did not provide a valid response.", t = null, r = null) {
    super(e, t, r), this.name = "InvalidResponseException";
  }
}
class Ei extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Authorization token missing or invalid.", t = null, r = null) {
    super(e, t, r), this.name = "UnauthenticatedException";
  }
}
let be = class {
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
    dataKey: r = null
  }) {
    if (this.dataKey = r, this.errorKey = "exception", this.$__payload = null, this.$__query = e, this.$__originResponse = t, this.$__response = t, typeof this.$__response > "u" || this.$__response === null)
      throw new Nn();
    if (he.has(this.$__response, this.errorKey)) {
      const i = he.get(this.$__response, this.errorKey);
      throw String(i).includes("Unauthenticated") ? new Ei() : new Nn();
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
    if (!he.has(this.response(), this.dataKey))
      throw new Nn();
    return he.get(this.response(), this.dataKey);
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
};
class $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
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
    return new be({
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
      throw new je("Query::createQuery() - Node URI was not initialized for this client instance!");
    if (this.$__query === null)
      throw new je("Query::createQuery() - GraphQL subscription was not initialized!");
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
    const r = {
      ...t,
      ...this.createQueryContext()
    };
    try {
      const i = await this.client.query({
        ...this.$__request,
        context: r
      });
      return this.$__response = await this.createResponseRaw(i), this.$__response;
    } catch (i) {
      if (i.name === "AbortError")
        return this.knishIOClient.log("warn", "Query was cancelled"), new be({
          query: this,
          json: { data: null, errors: [{ message: "Query was cancelled" }] }
        });
      throw i;
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
class Rl extends be {
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
    return t && (e = new J({
      secret: null,
      token: t.tokenSlug
    }), e.address = t.address, e.position = t.position, e.bundle = t.bundleHash, e.batchId = t.batchId, e.characters = t.characters, e.pubkey = t.pubkey, e.balance = t.amount * 1), e;
  }
}
var Si = function(n, e) {
  return Si = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, r) {
    t.__proto__ = r;
  } || function(t, r) {
    for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (t[i] = r[i]);
  }, Si(n, e);
};
function Ve(n, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Si(n, e);
  function t() {
    this.constructor = n;
  }
  n.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var x = function() {
  return x = Object.assign || function(e) {
    for (var t, r = 1, i = arguments.length; r < i; r++) {
      t = arguments[r];
      for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
    }
    return e;
  }, x.apply(this, arguments);
};
function qt(n, e) {
  var t = {};
  for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && e.indexOf(r) < 0 && (t[r] = n[r]);
  if (n != null && typeof Object.getOwnPropertySymbols == "function")
    for (var i = 0, r = Object.getOwnPropertySymbols(n); i < r.length; i++)
      e.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(n, r[i]) && (t[r[i]] = n[r[i]]);
  return t;
}
function Rt(n, e, t, r) {
  function i(s) {
    return s instanceof t ? s : new t(function(o) {
      o(s);
    });
  }
  return new (t || (t = Promise))(function(s, o) {
    function a(u) {
      try {
        c(r.next(u));
      } catch (d) {
        o(d);
      }
    }
    function l(u) {
      try {
        c(r.throw(u));
      } catch (d) {
        o(d);
      }
    }
    function c(u) {
      u.done ? s(u.value) : i(u.value).then(a, l);
    }
    c((r = r.apply(n, e || [])).next());
  });
}
function Nt(n, e) {
  var t = { label: 0, sent: function() {
    if (s[0] & 1) throw s[1];
    return s[1];
  }, trys: [], ops: [] }, r, i, s, o;
  return o = { next: a(0), throw: a(1), return: a(2) }, typeof Symbol == "function" && (o[Symbol.iterator] = function() {
    return this;
  }), o;
  function a(c) {
    return function(u) {
      return l([c, u]);
    };
  }
  function l(c) {
    if (r) throw new TypeError("Generator is already executing.");
    for (; o && (o = 0, c[0] && (t = 0)), t; ) try {
      if (r = 1, i && (s = c[0] & 2 ? i.return : c[0] ? i.throw || ((s = i.return) && s.call(i), 0) : i.next) && !(s = s.call(i, c[1])).done) return s;
      switch (i = 0, s && (c = [c[0] & 2, s.value]), c[0]) {
        case 0:
        case 1:
          s = c;
          break;
        case 4:
          return t.label++, { value: c[1], done: !1 };
        case 5:
          t.label++, i = c[1], c = [0];
          continue;
        case 7:
          c = t.ops.pop(), t.trys.pop();
          continue;
        default:
          if (s = t.trys, !(s = s.length > 0 && s[s.length - 1]) && (c[0] === 6 || c[0] === 2)) {
            t = 0;
            continue;
          }
          if (c[0] === 3 && (!s || c[1] > s[0] && c[1] < s[3])) {
            t.label = c[1];
            break;
          }
          if (c[0] === 6 && t.label < s[1]) {
            t.label = s[1], s = c;
            break;
          }
          if (s && t.label < s[2]) {
            t.label = s[2], t.ops.push(c);
            break;
          }
          s[2] && t.ops.pop(), t.trys.pop();
          continue;
      }
      c = e.call(n, t);
    } catch (u) {
      c = [6, u], i = 0;
    } finally {
      r = s = 0;
    }
    if (c[0] & 5) throw c[1];
    return { value: c[0] ? c[1] : void 0, done: !0 };
  }
}
function kr(n, e, t) {
  if (t || arguments.length === 2) for (var r = 0, i = e.length, s; r < i; r++)
    (s || !(r in e)) && (s || (s = Array.prototype.slice.call(e, 0, r)), s[r] = e[r]);
  return n.concat(s || Array.prototype.slice.call(e));
}
var ti = "Invariant Violation", io = Object.setPrototypeOf, Nl = io === void 0 ? function(n, e) {
  return n.__proto__ = e, n;
} : io, ne = (
  /** @class */
  function(n) {
    Ve(e, n);
    function e(t) {
      t === void 0 && (t = ti);
      var r = n.call(this, typeof t == "number" ? ti + ": " + t + " (see https://github.com/apollographql/invariant-packages)" : t) || this;
      return r.framesToPop = 1, r.name = ti, Nl(r, e.prototype), r;
    }
    return e;
  }(Error)
);
function D(n, e) {
  if (!n)
    throw new ne(e);
}
var Ua = ["debug", "log", "warn", "error", "silent"], Dl = Ua.indexOf("log");
function rr(n) {
  return function() {
    if (Ua.indexOf(n) >= Dl) {
      var e = console[n] || console.log;
      return e.apply(console, arguments);
    }
  };
}
(function(n) {
  n.debug = rr("debug"), n.log = rr("log"), n.warn = rr("warn"), n.error = rr("error");
})(D);
function ht(n) {
  try {
    return n();
  } catch {
  }
}
const so = ht(function() {
  return globalThis;
}) || ht(function() {
  return window;
}) || ht(function() {
  return self;
}) || ht(function() {
  return rt;
}) || ht(function() {
  return ht.constructor("return this")();
});
var oo = "__", ao = [oo, oo].join("DEV");
function Ml() {
  try {
    return !!__DEV__;
  } catch {
    return Object.defineProperty(so, ao, {
      value: ht(function() {
        return !0;
      }) !== "production",
      enumerable: !1,
      configurable: !0,
      writable: !0
    }), so[ao];
  }
}
const ni = Ml();
function Fl(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var qa = { exports: {} }, ye = qa.exports = {}, Xe, Ze;
function ki() {
  throw new Error("setTimeout has not been defined");
}
function xi() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? Xe = setTimeout : Xe = ki;
  } catch {
    Xe = ki;
  }
  try {
    typeof clearTimeout == "function" ? Ze = clearTimeout : Ze = xi;
  } catch {
    Ze = xi;
  }
})();
function ja(n) {
  if (Xe === setTimeout)
    return setTimeout(n, 0);
  if ((Xe === ki || !Xe) && setTimeout)
    return Xe = setTimeout, setTimeout(n, 0);
  try {
    return Xe(n, 0);
  } catch {
    try {
      return Xe.call(null, n, 0);
    } catch {
      return Xe.call(this, n, 0);
    }
  }
}
function $l(n) {
  if (Ze === clearTimeout)
    return clearTimeout(n);
  if ((Ze === xi || !Ze) && clearTimeout)
    return Ze = clearTimeout, clearTimeout(n);
  try {
    return Ze(n);
  } catch {
    try {
      return Ze.call(null, n);
    } catch {
      return Ze.call(this, n);
    }
  }
}
var ft = [], rn = !1, Pt, fr = -1;
function Bl() {
  !rn || !Pt || (rn = !1, Pt.length ? ft = Pt.concat(ft) : fr = -1, ft.length && Va());
}
function Va() {
  if (!rn) {
    var n = ja(Bl);
    rn = !0;
    for (var e = ft.length; e; ) {
      for (Pt = ft, ft = []; ++fr < e; )
        Pt && Pt[fr].run();
      fr = -1, e = ft.length;
    }
    Pt = null, rn = !1, $l(n);
  }
}
ye.nextTick = function(n) {
  var e = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var t = 1; t < arguments.length; t++)
      e[t - 1] = arguments[t];
  ft.push(new Qa(n, e)), ft.length === 1 && !rn && ja(Va);
};
function Qa(n, e) {
  this.fun = n, this.array = e;
}
Qa.prototype.run = function() {
  this.fun.apply(null, this.array);
};
ye.title = "browser";
ye.browser = !0;
ye.env = {};
ye.argv = [];
ye.version = "";
ye.versions = {};
function vt() {
}
ye.on = vt;
ye.addListener = vt;
ye.once = vt;
ye.off = vt;
ye.removeListener = vt;
ye.removeAllListeners = vt;
ye.emit = vt;
ye.prependListener = vt;
ye.prependOnceListener = vt;
ye.listeners = function(n) {
  return [];
};
ye.binding = function(n) {
  throw new Error("process.binding is not supported");
};
ye.cwd = function() {
  return "/";
};
ye.chdir = function(n) {
  throw new Error("process.chdir is not supported");
};
ye.umask = function() {
  return 0;
};
var Pl = qa.exports;
const Ll = /* @__PURE__ */ Fl(Pl);
function Et(n) {
  try {
    return n();
  } catch {
  }
}
var Ti = Et(function() {
  return globalThis;
}) || Et(function() {
  return window;
}) || Et(function() {
  return self;
}) || Et(function() {
  return rt;
}) || // We don't expect the Function constructor ever to be invoked at runtime, as
// long as at least one of globalThis, window, self, or global is defined, so
// we are under no obligation to make it easy for static analysis tools to
// detect syntactic usage of the Function constructor. If you think you can
// improve your static analysis to detect this obfuscation, think again. This
// is an arms race you cannot win, at least not in JavaScript.
Et(function() {
  return Et.constructor("return this")();
}), Ai = !1;
function Ul() {
  Ti && !Et(function() {
    return !0;
  }) && !Et(function() {
    return Ll;
  }) && (Object.defineProperty(Ti, "process", {
    value: {
      env: {
        // This default needs to be "production" instead of "development", to
        // avoid the problem https://github.com/graphql/graphql-js/pull/2894
        // will eventually solve, once merged and released.
        NODE_ENV: "production"
      }
    },
    // Let anyone else change global.process as they see fit, but hide it from
    // Object.keys(global) enumeration.
    configurable: !0,
    enumerable: !1,
    writable: !0
  }), Ai = !0);
}
Ul();
function uo() {
  Ai && (delete Ti.process, Ai = !1);
}
function pr(n, e) {
  if (!!!n)
    throw new Error(e);
}
function ql(n) {
  return typeof n == "object" && n !== null;
}
function jl(n, e) {
  if (!!!n)
    throw new Error(
      "Unexpected invariant triggered."
    );
}
const Vl = /\r\n|[\n\r]/g;
function Ii(n, e) {
  let t = 0, r = 1;
  for (const i of n.body.matchAll(Vl)) {
    if (typeof i.index == "number" || jl(!1), i.index >= e)
      break;
    t = i.index + i[0].length, r += 1;
  }
  return {
    line: r,
    column: e + 1 - t
  };
}
function Ql(n) {
  return Ha(
    n.source,
    Ii(n.source, n.start)
  );
}
function Ha(n, e) {
  const t = n.locationOffset.column - 1, r = "".padStart(t) + n.body, i = e.line - 1, s = n.locationOffset.line - 1, o = e.line + s, a = e.line === 1 ? t : 0, l = e.column + a, c = `${n.name}:${o}:${l}
`, u = r.split(/\r\n|[\n\r]/g), d = u[i];
  if (d.length > 120) {
    const p = Math.floor(l / 80), m = l % 80, v = [];
    for (let w = 0; w < d.length; w += 80)
      v.push(d.slice(w, w + 80));
    return c + co([
      [`${o} |`, v[0]],
      ...v.slice(1, p + 1).map((w) => ["|", w]),
      ["|", "^".padStart(m)],
      ["|", v[p + 1]]
    ]);
  }
  return c + co([
    // Lines specified like this: ["prefix", "string"],
    [`${o - 1} |`, u[i - 1]],
    [`${o} |`, d],
    ["|", "^".padStart(l)],
    [`${o + 1} |`, u[i + 1]]
  ]);
}
function co(n) {
  const e = n.filter(([r, i]) => i !== void 0), t = Math.max(...e.map(([r]) => r.length));
  return e.map(([r, i]) => r.padStart(t) + (i ? " " + i : "")).join(`
`);
}
function Hl(n) {
  const e = n[0];
  return e == null || "kind" in e || "length" in e ? {
    nodes: e,
    source: n[1],
    positions: n[2],
    path: n[3],
    originalError: n[4],
    extensions: n[5]
  } : e;
}
class ns extends Error {
  /**
   * An array of `{ line, column }` locations within the source GraphQL document
   * which correspond to this error.
   *
   * Errors during validation often contain multiple locations, for example to
   * point out two things with the same name. Errors during execution include a
   * single location, the field which produced the error.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */
  /**
   * An array describing the JSON-path into the execution response which
   * corresponds to this error. Only included for errors during execution.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */
  /**
   * An array of GraphQL AST Nodes corresponding to this error.
   */
  /**
   * The source GraphQL document for the first location of this error.
   *
   * Note that if this Error represents more than one node, the source may not
   * represent nodes after the first node.
   */
  /**
   * An array of character offsets within the source GraphQL document
   * which correspond to this error.
   */
  /**
   * The original error thrown from a field resolver during execution.
   */
  /**
   * Extension fields to add to the formatted error.
   */
  /**
   * @deprecated Please use the `GraphQLErrorOptions` constructor overload instead.
   */
  constructor(e, ...t) {
    var r, i, s;
    const { nodes: o, source: a, positions: l, path: c, originalError: u, extensions: d } = Hl(t);
    super(e), this.name = "GraphQLError", this.path = c ?? void 0, this.originalError = u ?? void 0, this.nodes = lo(
      Array.isArray(o) ? o : o ? [o] : void 0
    );
    const p = lo(
      (r = this.nodes) === null || r === void 0 ? void 0 : r.map((v) => v.loc).filter((v) => v != null)
    );
    this.source = a ?? (p == null || (i = p[0]) === null || i === void 0 ? void 0 : i.source), this.positions = l ?? p?.map((v) => v.start), this.locations = l && a ? l.map((v) => Ii(a, v)) : p?.map((v) => Ii(v.source, v.start));
    const m = ql(
      u?.extensions
    ) ? u?.extensions : void 0;
    this.extensions = (s = d ?? m) !== null && s !== void 0 ? s : /* @__PURE__ */ Object.create(null), Object.defineProperties(this, {
      message: {
        writable: !0,
        enumerable: !0
      },
      name: {
        enumerable: !1
      },
      nodes: {
        enumerable: !1
      },
      source: {
        enumerable: !1
      },
      positions: {
        enumerable: !1
      },
      originalError: {
        enumerable: !1
      }
    }), u != null && u.stack ? Object.defineProperty(this, "stack", {
      value: u.stack,
      writable: !0,
      configurable: !0
    }) : Error.captureStackTrace ? Error.captureStackTrace(this, ns) : Object.defineProperty(this, "stack", {
      value: Error().stack,
      writable: !0,
      configurable: !0
    });
  }
  get [Symbol.toStringTag]() {
    return "GraphQLError";
  }
  toString() {
    let e = this.message;
    if (this.nodes)
      for (const t of this.nodes)
        t.loc && (e += `

` + Ql(t.loc));
    else if (this.source && this.locations)
      for (const t of this.locations)
        e += `

` + Ha(this.source, t);
    return e;
  }
  toJSON() {
    const e = {
      message: this.message
    };
    return this.locations != null && (e.locations = this.locations), this.path != null && (e.path = this.path), this.extensions != null && Object.keys(this.extensions).length > 0 && (e.extensions = this.extensions), e;
  }
}
function lo(n) {
  return n === void 0 || n.length === 0 ? void 0 : n;
}
function Ee(n, e, t) {
  return new ns(`Syntax Error: ${t}`, {
    source: n,
    positions: [e]
  });
}
class Wl {
  /**
   * The character offset at which this Node begins.
   */
  /**
   * The character offset at which this Node ends.
   */
  /**
   * The Token at which this Node begins.
   */
  /**
   * The Token at which this Node ends.
   */
  /**
   * The Source document the AST represents.
   */
  constructor(e, t, r) {
    this.start = e.start, this.end = t.end, this.startToken = e, this.endToken = t, this.source = r;
  }
  get [Symbol.toStringTag]() {
    return "Location";
  }
  toJSON() {
    return {
      start: this.start,
      end: this.end
    };
  }
}
class Wa {
  /**
   * The kind of Token.
   */
  /**
   * The character offset at which this Node begins.
   */
  /**
   * The character offset at which this Node ends.
   */
  /**
   * The 1-indexed line number on which this Token appears.
   */
  /**
   * The 1-indexed column number at which this Token begins.
   */
  /**
   * For non-punctuation tokens, represents the interpreted value of the token.
   *
   * Note: is undefined for punctuation tokens, but typed as string for
   * convenience in the parser.
   */
  /**
   * Tokens exist as nodes in a double-linked-list amongst all tokens
   * including ignored tokens. <SOF> is always the first node and <EOF>
   * the last.
   */
  constructor(e, t, r, i, s, o) {
    this.kind = e, this.start = t, this.end = r, this.line = i, this.column = s, this.value = o, this.prev = null, this.next = null;
  }
  get [Symbol.toStringTag]() {
    return "Token";
  }
  toJSON() {
    return {
      kind: this.kind,
      value: this.value,
      line: this.line,
      column: this.column
    };
  }
}
const Ka = {
  Name: [],
  Document: ["definitions"],
  OperationDefinition: [
    "name",
    "variableDefinitions",
    "directives",
    "selectionSet"
  ],
  VariableDefinition: ["variable", "type", "defaultValue", "directives"],
  Variable: ["name"],
  SelectionSet: ["selections"],
  Field: ["alias", "name", "arguments", "directives", "selectionSet"],
  Argument: ["name", "value"],
  FragmentSpread: ["name", "directives"],
  InlineFragment: ["typeCondition", "directives", "selectionSet"],
  FragmentDefinition: [
    "name",
    // Note: fragment variable definitions are deprecated and will removed in v17.0.0
    "variableDefinitions",
    "typeCondition",
    "directives",
    "selectionSet"
  ],
  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ["values"],
  ObjectValue: ["fields"],
  ObjectField: ["name", "value"],
  Directive: ["name", "arguments"],
  NamedType: ["name"],
  ListType: ["type"],
  NonNullType: ["type"],
  SchemaDefinition: ["description", "directives", "operationTypes"],
  OperationTypeDefinition: ["type"],
  ScalarTypeDefinition: ["description", "name", "directives"],
  ObjectTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  FieldDefinition: ["description", "name", "arguments", "type", "directives"],
  InputValueDefinition: [
    "description",
    "name",
    "type",
    "defaultValue",
    "directives"
  ],
  InterfaceTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  UnionTypeDefinition: ["description", "name", "directives", "types"],
  EnumTypeDefinition: ["description", "name", "directives", "values"],
  EnumValueDefinition: ["description", "name", "directives"],
  InputObjectTypeDefinition: ["description", "name", "directives", "fields"],
  DirectiveDefinition: ["description", "name", "arguments", "locations"],
  SchemaExtension: ["directives", "operationTypes"],
  ScalarTypeExtension: ["name", "directives"],
  ObjectTypeExtension: ["name", "interfaces", "directives", "fields"],
  InterfaceTypeExtension: ["name", "interfaces", "directives", "fields"],
  UnionTypeExtension: ["name", "directives", "types"],
  EnumTypeExtension: ["name", "directives", "values"],
  InputObjectTypeExtension: ["name", "directives", "fields"]
}, Kl = new Set(Object.keys(Ka));
function ho(n) {
  const e = n?.kind;
  return typeof e == "string" && Kl.has(e);
}
var Zt;
(function(n) {
  n.QUERY = "query", n.MUTATION = "mutation", n.SUBSCRIPTION = "subscription";
})(Zt || (Zt = {}));
var Oi;
(function(n) {
  n.QUERY = "QUERY", n.MUTATION = "MUTATION", n.SUBSCRIPTION = "SUBSCRIPTION", n.FIELD = "FIELD", n.FRAGMENT_DEFINITION = "FRAGMENT_DEFINITION", n.FRAGMENT_SPREAD = "FRAGMENT_SPREAD", n.INLINE_FRAGMENT = "INLINE_FRAGMENT", n.VARIABLE_DEFINITION = "VARIABLE_DEFINITION", n.SCHEMA = "SCHEMA", n.SCALAR = "SCALAR", n.OBJECT = "OBJECT", n.FIELD_DEFINITION = "FIELD_DEFINITION", n.ARGUMENT_DEFINITION = "ARGUMENT_DEFINITION", n.INTERFACE = "INTERFACE", n.UNION = "UNION", n.ENUM = "ENUM", n.ENUM_VALUE = "ENUM_VALUE", n.INPUT_OBJECT = "INPUT_OBJECT", n.INPUT_FIELD_DEFINITION = "INPUT_FIELD_DEFINITION";
})(Oi || (Oi = {}));
var U;
(function(n) {
  n.NAME = "Name", n.DOCUMENT = "Document", n.OPERATION_DEFINITION = "OperationDefinition", n.VARIABLE_DEFINITION = "VariableDefinition", n.SELECTION_SET = "SelectionSet", n.FIELD = "Field", n.ARGUMENT = "Argument", n.FRAGMENT_SPREAD = "FragmentSpread", n.INLINE_FRAGMENT = "InlineFragment", n.FRAGMENT_DEFINITION = "FragmentDefinition", n.VARIABLE = "Variable", n.INT = "IntValue", n.FLOAT = "FloatValue", n.STRING = "StringValue", n.BOOLEAN = "BooleanValue", n.NULL = "NullValue", n.ENUM = "EnumValue", n.LIST = "ListValue", n.OBJECT = "ObjectValue", n.OBJECT_FIELD = "ObjectField", n.DIRECTIVE = "Directive", n.NAMED_TYPE = "NamedType", n.LIST_TYPE = "ListType", n.NON_NULL_TYPE = "NonNullType", n.SCHEMA_DEFINITION = "SchemaDefinition", n.OPERATION_TYPE_DEFINITION = "OperationTypeDefinition", n.SCALAR_TYPE_DEFINITION = "ScalarTypeDefinition", n.OBJECT_TYPE_DEFINITION = "ObjectTypeDefinition", n.FIELD_DEFINITION = "FieldDefinition", n.INPUT_VALUE_DEFINITION = "InputValueDefinition", n.INTERFACE_TYPE_DEFINITION = "InterfaceTypeDefinition", n.UNION_TYPE_DEFINITION = "UnionTypeDefinition", n.ENUM_TYPE_DEFINITION = "EnumTypeDefinition", n.ENUM_VALUE_DEFINITION = "EnumValueDefinition", n.INPUT_OBJECT_TYPE_DEFINITION = "InputObjectTypeDefinition", n.DIRECTIVE_DEFINITION = "DirectiveDefinition", n.SCHEMA_EXTENSION = "SchemaExtension", n.SCALAR_TYPE_EXTENSION = "ScalarTypeExtension", n.OBJECT_TYPE_EXTENSION = "ObjectTypeExtension", n.INTERFACE_TYPE_EXTENSION = "InterfaceTypeExtension", n.UNION_TYPE_EXTENSION = "UnionTypeExtension", n.ENUM_TYPE_EXTENSION = "EnumTypeExtension", n.INPUT_OBJECT_TYPE_EXTENSION = "InputObjectTypeExtension";
})(U || (U = {}));
function Ci(n) {
  return n === 9 || n === 32;
}
function Un(n) {
  return n >= 48 && n <= 57;
}
function za(n) {
  return n >= 97 && n <= 122 || // A-Z
  n >= 65 && n <= 90;
}
function Ga(n) {
  return za(n) || n === 95;
}
function zl(n) {
  return za(n) || Un(n) || n === 95;
}
function Gl(n) {
  var e;
  let t = Number.MAX_SAFE_INTEGER, r = null, i = -1;
  for (let o = 0; o < n.length; ++o) {
    var s;
    const a = n[o], l = Jl(a);
    l !== a.length && (r = (s = r) !== null && s !== void 0 ? s : o, i = o, o !== 0 && l < t && (t = l));
  }
  return n.map((o, a) => a === 0 ? o : o.slice(t)).slice(
    (e = r) !== null && e !== void 0 ? e : 0,
    i + 1
  );
}
function Jl(n) {
  let e = 0;
  for (; e < n.length && Ci(n.charCodeAt(e)); )
    ++e;
  return e;
}
function Yl(n, e) {
  const t = n.replace(/"""/g, '\\"""'), r = t.split(/\r\n|[\n\r]/g), i = r.length === 1, s = r.length > 1 && r.slice(1).every((m) => m.length === 0 || Ci(m.charCodeAt(0))), o = t.endsWith('\\"""'), a = n.endsWith('"') && !o, l = n.endsWith("\\"), c = a || l, u = (
    // add leading and trailing new lines only if it improves readability
    !i || n.length > 70 || c || s || o
  );
  let d = "";
  const p = i && Ci(n.charCodeAt(0));
  return (u && !p || s) && (d += `
`), d += t, (u || c) && (d += `
`), '"""' + d + '"""';
}
var C;
(function(n) {
  n.SOF = "<SOF>", n.EOF = "<EOF>", n.BANG = "!", n.DOLLAR = "$", n.AMP = "&", n.PAREN_L = "(", n.PAREN_R = ")", n.SPREAD = "...", n.COLON = ":", n.EQUALS = "=", n.AT = "@", n.BRACKET_L = "[", n.BRACKET_R = "]", n.BRACE_L = "{", n.PIPE = "|", n.BRACE_R = "}", n.NAME = "Name", n.INT = "Int", n.FLOAT = "Float", n.STRING = "String", n.BLOCK_STRING = "BlockString", n.COMMENT = "Comment";
})(C || (C = {}));
class Xl {
  /**
   * The previously focused non-ignored token.
   */
  /**
   * The currently focused non-ignored token.
   */
  /**
   * The (1-indexed) line containing the current token.
   */
  /**
   * The character offset at which the current line begins.
   */
  constructor(e) {
    const t = new Wa(C.SOF, 0, 0, 0, 0);
    this.source = e, this.lastToken = t, this.token = t, this.line = 1, this.lineStart = 0;
  }
  get [Symbol.toStringTag]() {
    return "Lexer";
  }
  /**
   * Advances the token stream to the next non-ignored token.
   */
  advance() {
    return this.lastToken = this.token, this.token = this.lookahead();
  }
  /**
   * Looks ahead and returns the next non-ignored token, but does not change
   * the state of Lexer.
   */
  lookahead() {
    let e = this.token;
    if (e.kind !== C.EOF)
      do
        if (e.next)
          e = e.next;
        else {
          const t = eh(this, e.end);
          e.next = t, t.prev = e, e = t;
        }
      while (e.kind === C.COMMENT);
    return e;
  }
}
function Zl(n) {
  return n === C.BANG || n === C.DOLLAR || n === C.AMP || n === C.PAREN_L || n === C.PAREN_R || n === C.SPREAD || n === C.COLON || n === C.EQUALS || n === C.AT || n === C.BRACKET_L || n === C.BRACKET_R || n === C.BRACE_L || n === C.PIPE || n === C.BRACE_R;
}
function pn(n) {
  return n >= 0 && n <= 55295 || n >= 57344 && n <= 1114111;
}
function Dr(n, e) {
  return Ja(n.charCodeAt(e)) && Ya(n.charCodeAt(e + 1));
}
function Ja(n) {
  return n >= 55296 && n <= 56319;
}
function Ya(n) {
  return n >= 56320 && n <= 57343;
}
function jt(n, e) {
  const t = n.source.body.codePointAt(e);
  if (t === void 0)
    return C.EOF;
  if (t >= 32 && t <= 126) {
    const r = String.fromCodePoint(t);
    return r === '"' ? `'"'` : `"${r}"`;
  }
  return "U+" + t.toString(16).toUpperCase().padStart(4, "0");
}
function ge(n, e, t, r, i) {
  const s = n.line, o = 1 + t - n.lineStart;
  return new Wa(e, t, r, s, o, i);
}
function eh(n, e) {
  const t = n.source.body, r = t.length;
  let i = e;
  for (; i < r; ) {
    const s = t.charCodeAt(i);
    switch (s) {
      case 65279:
      case 9:
      case 32:
      case 44:
        ++i;
        continue;
      case 10:
        ++i, ++n.line, n.lineStart = i;
        continue;
      case 13:
        t.charCodeAt(i + 1) === 10 ? i += 2 : ++i, ++n.line, n.lineStart = i;
        continue;
      case 35:
        return th(n, i);
      case 33:
        return ge(n, C.BANG, i, i + 1);
      case 36:
        return ge(n, C.DOLLAR, i, i + 1);
      case 38:
        return ge(n, C.AMP, i, i + 1);
      case 40:
        return ge(n, C.PAREN_L, i, i + 1);
      case 41:
        return ge(n, C.PAREN_R, i, i + 1);
      case 46:
        if (t.charCodeAt(i + 1) === 46 && t.charCodeAt(i + 2) === 46)
          return ge(n, C.SPREAD, i, i + 3);
        break;
      case 58:
        return ge(n, C.COLON, i, i + 1);
      case 61:
        return ge(n, C.EQUALS, i, i + 1);
      case 64:
        return ge(n, C.AT, i, i + 1);
      case 91:
        return ge(n, C.BRACKET_L, i, i + 1);
      case 93:
        return ge(n, C.BRACKET_R, i, i + 1);
      case 123:
        return ge(n, C.BRACE_L, i, i + 1);
      case 124:
        return ge(n, C.PIPE, i, i + 1);
      case 125:
        return ge(n, C.BRACE_R, i, i + 1);
      case 34:
        return t.charCodeAt(i + 1) === 34 && t.charCodeAt(i + 2) === 34 ? ah(n, i) : rh(n, i);
    }
    if (Un(s) || s === 45)
      return nh(n, i, s);
    if (Ga(s))
      return uh(n, i);
    throw Ee(
      n.source,
      i,
      s === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : pn(s) || Dr(t, i) ? `Unexpected character: ${jt(n, i)}.` : `Invalid character: ${jt(n, i)}.`
    );
  }
  return ge(n, C.EOF, r, r);
}
function th(n, e) {
  const t = n.source.body, r = t.length;
  let i = e + 1;
  for (; i < r; ) {
    const s = t.charCodeAt(i);
    if (s === 10 || s === 13)
      break;
    if (pn(s))
      ++i;
    else if (Dr(t, i))
      i += 2;
    else
      break;
  }
  return ge(
    n,
    C.COMMENT,
    e,
    i,
    t.slice(e + 1, i)
  );
}
function nh(n, e, t) {
  const r = n.source.body;
  let i = e, s = t, o = !1;
  if (s === 45 && (s = r.charCodeAt(++i)), s === 48) {
    if (s = r.charCodeAt(++i), Un(s))
      throw Ee(
        n.source,
        i,
        `Invalid number, unexpected digit after 0: ${jt(
          n,
          i
        )}.`
      );
  } else
    i = ri(n, i, s), s = r.charCodeAt(i);
  if (s === 46 && (o = !0, s = r.charCodeAt(++i), i = ri(n, i, s), s = r.charCodeAt(i)), (s === 69 || s === 101) && (o = !0, s = r.charCodeAt(++i), (s === 43 || s === 45) && (s = r.charCodeAt(++i)), i = ri(n, i, s), s = r.charCodeAt(i)), s === 46 || Ga(s))
    throw Ee(
      n.source,
      i,
      `Invalid number, expected digit but got: ${jt(
        n,
        i
      )}.`
    );
  return ge(
    n,
    o ? C.FLOAT : C.INT,
    e,
    i,
    r.slice(e, i)
  );
}
function ri(n, e, t) {
  if (!Un(t))
    throw Ee(
      n.source,
      e,
      `Invalid number, expected digit but got: ${jt(
        n,
        e
      )}.`
    );
  const r = n.source.body;
  let i = e + 1;
  for (; Un(r.charCodeAt(i)); )
    ++i;
  return i;
}
function rh(n, e) {
  const t = n.source.body, r = t.length;
  let i = e + 1, s = i, o = "";
  for (; i < r; ) {
    const a = t.charCodeAt(i);
    if (a === 34)
      return o += t.slice(s, i), ge(n, C.STRING, e, i + 1, o);
    if (a === 92) {
      o += t.slice(s, i);
      const l = t.charCodeAt(i + 1) === 117 ? t.charCodeAt(i + 2) === 123 ? ih(n, i) : sh(n, i) : oh(n, i);
      o += l.value, i += l.size, s = i;
      continue;
    }
    if (a === 10 || a === 13)
      break;
    if (pn(a))
      ++i;
    else if (Dr(t, i))
      i += 2;
    else
      throw Ee(
        n.source,
        i,
        `Invalid character within String: ${jt(
          n,
          i
        )}.`
      );
  }
  throw Ee(n.source, i, "Unterminated string.");
}
function ih(n, e) {
  const t = n.source.body;
  let r = 0, i = 3;
  for (; i < 12; ) {
    const s = t.charCodeAt(e + i++);
    if (s === 125) {
      if (i < 5 || !pn(r))
        break;
      return {
        value: String.fromCodePoint(r),
        size: i
      };
    }
    if (r = r << 4 | On(s), r < 0)
      break;
  }
  throw Ee(
    n.source,
    e,
    `Invalid Unicode escape sequence: "${t.slice(
      e,
      e + i
    )}".`
  );
}
function sh(n, e) {
  const t = n.source.body, r = fo(t, e + 2);
  if (pn(r))
    return {
      value: String.fromCodePoint(r),
      size: 6
    };
  if (Ja(r) && t.charCodeAt(e + 6) === 92 && t.charCodeAt(e + 7) === 117) {
    const i = fo(t, e + 8);
    if (Ya(i))
      return {
        value: String.fromCodePoint(r, i),
        size: 12
      };
  }
  throw Ee(
    n.source,
    e,
    `Invalid Unicode escape sequence: "${t.slice(e, e + 6)}".`
  );
}
function fo(n, e) {
  return On(n.charCodeAt(e)) << 12 | On(n.charCodeAt(e + 1)) << 8 | On(n.charCodeAt(e + 2)) << 4 | On(n.charCodeAt(e + 3));
}
function On(n) {
  return n >= 48 && n <= 57 ? n - 48 : n >= 65 && n <= 70 ? n - 55 : n >= 97 && n <= 102 ? n - 87 : -1;
}
function oh(n, e) {
  const t = n.source.body;
  switch (t.charCodeAt(e + 1)) {
    case 34:
      return {
        value: '"',
        size: 2
      };
    case 92:
      return {
        value: "\\",
        size: 2
      };
    case 47:
      return {
        value: "/",
        size: 2
      };
    case 98:
      return {
        value: "\b",
        size: 2
      };
    case 102:
      return {
        value: "\f",
        size: 2
      };
    case 110:
      return {
        value: `
`,
        size: 2
      };
    case 114:
      return {
        value: "\r",
        size: 2
      };
    case 116:
      return {
        value: "	",
        size: 2
      };
  }
  throw Ee(
    n.source,
    e,
    `Invalid character escape sequence: "${t.slice(
      e,
      e + 2
    )}".`
  );
}
function ah(n, e) {
  const t = n.source.body, r = t.length;
  let i = n.lineStart, s = e + 3, o = s, a = "";
  const l = [];
  for (; s < r; ) {
    const c = t.charCodeAt(s);
    if (c === 34 && t.charCodeAt(s + 1) === 34 && t.charCodeAt(s + 2) === 34) {
      a += t.slice(o, s), l.push(a);
      const u = ge(
        n,
        C.BLOCK_STRING,
        e,
        s + 3,
        // Return a string of the lines joined with U+000A.
        Gl(l).join(`
`)
      );
      return n.line += l.length - 1, n.lineStart = i, u;
    }
    if (c === 92 && t.charCodeAt(s + 1) === 34 && t.charCodeAt(s + 2) === 34 && t.charCodeAt(s + 3) === 34) {
      a += t.slice(o, s), o = s + 1, s += 4;
      continue;
    }
    if (c === 10 || c === 13) {
      a += t.slice(o, s), l.push(a), c === 13 && t.charCodeAt(s + 1) === 10 ? s += 2 : ++s, a = "", o = s, i = s;
      continue;
    }
    if (pn(c))
      ++s;
    else if (Dr(t, s))
      s += 2;
    else
      throw Ee(
        n.source,
        s,
        `Invalid character within String: ${jt(
          n,
          s
        )}.`
      );
  }
  throw Ee(n.source, s, "Unterminated string.");
}
function uh(n, e) {
  const t = n.source.body, r = t.length;
  let i = e + 1;
  for (; i < r; ) {
    const s = t.charCodeAt(i);
    if (zl(s))
      ++i;
    else
      break;
  }
  return ge(
    n,
    C.NAME,
    e,
    i,
    t.slice(e, i)
  );
}
const ch = 10, Xa = 2;
function rs(n) {
  return Mr(n, []);
}
function Mr(n, e) {
  switch (typeof n) {
    case "string":
      return JSON.stringify(n);
    case "function":
      return n.name ? `[function ${n.name}]` : "[function]";
    case "object":
      return lh(n, e);
    default:
      return String(n);
  }
}
function lh(n, e) {
  if (n === null)
    return "null";
  if (e.includes(n))
    return "[Circular]";
  const t = [...e, n];
  if (hh(n)) {
    const r = n.toJSON();
    if (r !== n)
      return typeof r == "string" ? r : Mr(r, t);
  } else if (Array.isArray(n))
    return ph(n, t);
  return fh(n, t);
}
function hh(n) {
  return typeof n.toJSON == "function";
}
function fh(n, e) {
  const t = Object.entries(n);
  return t.length === 0 ? "{}" : e.length > Xa ? "[" + dh(n) + "]" : "{ " + t.map(
    ([i, s]) => i + ": " + Mr(s, e)
  ).join(", ") + " }";
}
function ph(n, e) {
  if (n.length === 0)
    return "[]";
  if (e.length > Xa)
    return "[Array]";
  const t = Math.min(ch, n.length), r = n.length - t, i = [];
  for (let s = 0; s < t; ++s)
    i.push(Mr(n[s], e));
  return r === 1 ? i.push("... 1 more item") : r > 1 && i.push(`... ${r} more items`), "[" + i.join(", ") + "]";
}
function dh(n) {
  const e = Object.prototype.toString.call(n).replace(/^\[object /, "").replace(/]$/, "");
  if (e === "Object" && typeof n.constructor == "function") {
    const t = n.constructor.name;
    if (typeof t == "string" && t !== "")
      return t;
  }
  return e;
}
const yh = (
  /* c8 ignore next 6 */
  // FIXME: https://github.com/graphql/graphql-js/issues/2317
  function(e, t) {
    if (e instanceof t)
      return !0;
    if (typeof e == "object" && e !== null) {
      var r;
      const i = t.prototype[Symbol.toStringTag], s = (
        // We still need to support constructor's name to detect conflicts with older versions of this library.
        Symbol.toStringTag in e ? e[Symbol.toStringTag] : (r = e.constructor) === null || r === void 0 ? void 0 : r.name
      );
      if (i === s) {
        const o = rs(e);
        throw new Error(`Cannot use ${i} "${o}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`);
      }
    }
    return !1;
  }
);
class is {
  constructor(e, t = "GraphQL request", r = {
    line: 1,
    column: 1
  }) {
    typeof e == "string" || pr(!1, `Body must be a string. Received: ${rs(e)}.`), this.body = e, this.name = t, this.locationOffset = r, this.locationOffset.line > 0 || pr(
      !1,
      "line in locationOffset is 1-indexed and must be positive."
    ), this.locationOffset.column > 0 || pr(
      !1,
      "column in locationOffset is 1-indexed and must be positive."
    );
  }
  get [Symbol.toStringTag]() {
    return "Source";
  }
}
function mh(n) {
  return yh(n, is);
}
function gh(n, e) {
  const t = new vh(n, e), r = t.parseDocument();
  return Object.defineProperty(r, "tokenCount", {
    enumerable: !1,
    value: t.tokenCount
  }), r;
}
class vh {
  constructor(e, t = {}) {
    const r = mh(e) ? e : new is(e);
    this._lexer = new Xl(r), this._options = t, this._tokenCounter = 0;
  }
  get tokenCount() {
    return this._tokenCounter;
  }
  /**
   * Converts a name lex token into a name parse node.
   */
  parseName() {
    const e = this.expectToken(C.NAME);
    return this.node(e, {
      kind: U.NAME,
      value: e.value
    });
  }
  // Implements the parsing rules in the Document section.
  /**
   * Document : Definition+
   */
  parseDocument() {
    return this.node(this._lexer.token, {
      kind: U.DOCUMENT,
      definitions: this.many(
        C.SOF,
        this.parseDefinition,
        C.EOF
      )
    });
  }
  /**
   * Definition :
   *   - ExecutableDefinition
   *   - TypeSystemDefinition
   *   - TypeSystemExtension
   *
   * ExecutableDefinition :
   *   - OperationDefinition
   *   - FragmentDefinition
   *
   * TypeSystemDefinition :
   *   - SchemaDefinition
   *   - TypeDefinition
   *   - DirectiveDefinition
   *
   * TypeDefinition :
   *   - ScalarTypeDefinition
   *   - ObjectTypeDefinition
   *   - InterfaceTypeDefinition
   *   - UnionTypeDefinition
   *   - EnumTypeDefinition
   *   - InputObjectTypeDefinition
   */
  parseDefinition() {
    if (this.peek(C.BRACE_L))
      return this.parseOperationDefinition();
    const e = this.peekDescription(), t = e ? this._lexer.lookahead() : this._lexer.token;
    if (t.kind === C.NAME) {
      switch (t.value) {
        case "schema":
          return this.parseSchemaDefinition();
        case "scalar":
          return this.parseScalarTypeDefinition();
        case "type":
          return this.parseObjectTypeDefinition();
        case "interface":
          return this.parseInterfaceTypeDefinition();
        case "union":
          return this.parseUnionTypeDefinition();
        case "enum":
          return this.parseEnumTypeDefinition();
        case "input":
          return this.parseInputObjectTypeDefinition();
        case "directive":
          return this.parseDirectiveDefinition();
      }
      if (e)
        throw Ee(
          this._lexer.source,
          this._lexer.token.start,
          "Unexpected description, descriptions are supported only on type definitions."
        );
      switch (t.value) {
        case "query":
        case "mutation":
        case "subscription":
          return this.parseOperationDefinition();
        case "fragment":
          return this.parseFragmentDefinition();
        case "extend":
          return this.parseTypeSystemExtension();
      }
    }
    throw this.unexpected(t);
  }
  // Implements the parsing rules in the Operations section.
  /**
   * OperationDefinition :
   *  - SelectionSet
   *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
   */
  parseOperationDefinition() {
    const e = this._lexer.token;
    if (this.peek(C.BRACE_L))
      return this.node(e, {
        kind: U.OPERATION_DEFINITION,
        operation: Zt.QUERY,
        name: void 0,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet()
      });
    const t = this.parseOperationType();
    let r;
    return this.peek(C.NAME) && (r = this.parseName()), this.node(e, {
      kind: U.OPERATION_DEFINITION,
      operation: t,
      name: r,
      variableDefinitions: this.parseVariableDefinitions(),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * OperationType : one of query mutation subscription
   */
  parseOperationType() {
    const e = this.expectToken(C.NAME);
    switch (e.value) {
      case "query":
        return Zt.QUERY;
      case "mutation":
        return Zt.MUTATION;
      case "subscription":
        return Zt.SUBSCRIPTION;
    }
    throw this.unexpected(e);
  }
  /**
   * VariableDefinitions : ( VariableDefinition+ )
   */
  parseVariableDefinitions() {
    return this.optionalMany(
      C.PAREN_L,
      this.parseVariableDefinition,
      C.PAREN_R
    );
  }
  /**
   * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
   */
  parseVariableDefinition() {
    return this.node(this._lexer.token, {
      kind: U.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type: (this.expectToken(C.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(C.EQUALS) ? this.parseConstValueLiteral() : void 0,
      directives: this.parseConstDirectives()
    });
  }
  /**
   * Variable : $ Name
   */
  parseVariable() {
    const e = this._lexer.token;
    return this.expectToken(C.DOLLAR), this.node(e, {
      kind: U.VARIABLE,
      name: this.parseName()
    });
  }
  /**
   * ```
   * SelectionSet : { Selection+ }
   * ```
   */
  parseSelectionSet() {
    return this.node(this._lexer.token, {
      kind: U.SELECTION_SET,
      selections: this.many(
        C.BRACE_L,
        this.parseSelection,
        C.BRACE_R
      )
    });
  }
  /**
   * Selection :
   *   - Field
   *   - FragmentSpread
   *   - InlineFragment
   */
  parseSelection() {
    return this.peek(C.SPREAD) ? this.parseFragment() : this.parseField();
  }
  /**
   * Field : Alias? Name Arguments? Directives? SelectionSet?
   *
   * Alias : Name :
   */
  parseField() {
    const e = this._lexer.token, t = this.parseName();
    let r, i;
    return this.expectOptionalToken(C.COLON) ? (r = t, i = this.parseName()) : i = t, this.node(e, {
      kind: U.FIELD,
      alias: r,
      name: i,
      arguments: this.parseArguments(!1),
      directives: this.parseDirectives(!1),
      selectionSet: this.peek(C.BRACE_L) ? this.parseSelectionSet() : void 0
    });
  }
  /**
   * Arguments[Const] : ( Argument[?Const]+ )
   */
  parseArguments(e) {
    const t = e ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(C.PAREN_L, t, C.PAREN_R);
  }
  /**
   * Argument[Const] : Name : Value[?Const]
   */
  parseArgument(e = !1) {
    const t = this._lexer.token, r = this.parseName();
    return this.expectToken(C.COLON), this.node(t, {
      kind: U.ARGUMENT,
      name: r,
      value: this.parseValueLiteral(e)
    });
  }
  parseConstArgument() {
    return this.parseArgument(!0);
  }
  // Implements the parsing rules in the Fragments section.
  /**
   * Corresponds to both FragmentSpread and InlineFragment in the spec.
   *
   * FragmentSpread : ... FragmentName Directives?
   *
   * InlineFragment : ... TypeCondition? Directives? SelectionSet
   */
  parseFragment() {
    const e = this._lexer.token;
    this.expectToken(C.SPREAD);
    const t = this.expectOptionalKeyword("on");
    return !t && this.peek(C.NAME) ? this.node(e, {
      kind: U.FRAGMENT_SPREAD,
      name: this.parseFragmentName(),
      directives: this.parseDirectives(!1)
    }) : this.node(e, {
      kind: U.INLINE_FRAGMENT,
      typeCondition: t ? this.parseNamedType() : void 0,
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * FragmentDefinition :
   *   - fragment FragmentName on TypeCondition Directives? SelectionSet
   *
   * TypeCondition : NamedType
   */
  parseFragmentDefinition() {
    const e = this._lexer.token;
    return this.expectKeyword("fragment"), this._options.allowLegacyFragmentVariables === !0 ? this.node(e, {
      kind: U.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      variableDefinitions: this.parseVariableDefinitions(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    }) : this.node(e, {
      kind: U.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * FragmentName : Name but not `on`
   */
  parseFragmentName() {
    if (this._lexer.token.value === "on")
      throw this.unexpected();
    return this.parseName();
  }
  // Implements the parsing rules in the Values section.
  /**
   * Value[Const] :
   *   - [~Const] Variable
   *   - IntValue
   *   - FloatValue
   *   - StringValue
   *   - BooleanValue
   *   - NullValue
   *   - EnumValue
   *   - ListValue[?Const]
   *   - ObjectValue[?Const]
   *
   * BooleanValue : one of `true` `false`
   *
   * NullValue : `null`
   *
   * EnumValue : Name but not `true`, `false` or `null`
   */
  parseValueLiteral(e) {
    const t = this._lexer.token;
    switch (t.kind) {
      case C.BRACKET_L:
        return this.parseList(e);
      case C.BRACE_L:
        return this.parseObject(e);
      case C.INT:
        return this.advanceLexer(), this.node(t, {
          kind: U.INT,
          value: t.value
        });
      case C.FLOAT:
        return this.advanceLexer(), this.node(t, {
          kind: U.FLOAT,
          value: t.value
        });
      case C.STRING:
      case C.BLOCK_STRING:
        return this.parseStringLiteral();
      case C.NAME:
        switch (this.advanceLexer(), t.value) {
          case "true":
            return this.node(t, {
              kind: U.BOOLEAN,
              value: !0
            });
          case "false":
            return this.node(t, {
              kind: U.BOOLEAN,
              value: !1
            });
          case "null":
            return this.node(t, {
              kind: U.NULL
            });
          default:
            return this.node(t, {
              kind: U.ENUM,
              value: t.value
            });
        }
      case C.DOLLAR:
        if (e)
          if (this.expectToken(C.DOLLAR), this._lexer.token.kind === C.NAME) {
            const r = this._lexer.token.value;
            throw Ee(
              this._lexer.source,
              t.start,
              `Unexpected variable "$${r}" in constant value.`
            );
          } else
            throw this.unexpected(t);
        return this.parseVariable();
      default:
        throw this.unexpected();
    }
  }
  parseConstValueLiteral() {
    return this.parseValueLiteral(!0);
  }
  parseStringLiteral() {
    const e = this._lexer.token;
    return this.advanceLexer(), this.node(e, {
      kind: U.STRING,
      value: e.value,
      block: e.kind === C.BLOCK_STRING
    });
  }
  /**
   * ListValue[Const] :
   *   - [ ]
   *   - [ Value[?Const]+ ]
   */
  parseList(e) {
    const t = () => this.parseValueLiteral(e);
    return this.node(this._lexer.token, {
      kind: U.LIST,
      values: this.any(C.BRACKET_L, t, C.BRACKET_R)
    });
  }
  /**
   * ```
   * ObjectValue[Const] :
   *   - { }
   *   - { ObjectField[?Const]+ }
   * ```
   */
  parseObject(e) {
    const t = () => this.parseObjectField(e);
    return this.node(this._lexer.token, {
      kind: U.OBJECT,
      fields: this.any(C.BRACE_L, t, C.BRACE_R)
    });
  }
  /**
   * ObjectField[Const] : Name : Value[?Const]
   */
  parseObjectField(e) {
    const t = this._lexer.token, r = this.parseName();
    return this.expectToken(C.COLON), this.node(t, {
      kind: U.OBJECT_FIELD,
      name: r,
      value: this.parseValueLiteral(e)
    });
  }
  // Implements the parsing rules in the Directives section.
  /**
   * Directives[Const] : Directive[?Const]+
   */
  parseDirectives(e) {
    const t = [];
    for (; this.peek(C.AT); )
      t.push(this.parseDirective(e));
    return t;
  }
  parseConstDirectives() {
    return this.parseDirectives(!0);
  }
  /**
   * ```
   * Directive[Const] : @ Name Arguments[?Const]?
   * ```
   */
  parseDirective(e) {
    const t = this._lexer.token;
    return this.expectToken(C.AT), this.node(t, {
      kind: U.DIRECTIVE,
      name: this.parseName(),
      arguments: this.parseArguments(e)
    });
  }
  // Implements the parsing rules in the Types section.
  /**
   * Type :
   *   - NamedType
   *   - ListType
   *   - NonNullType
   */
  parseTypeReference() {
    const e = this._lexer.token;
    let t;
    if (this.expectOptionalToken(C.BRACKET_L)) {
      const r = this.parseTypeReference();
      this.expectToken(C.BRACKET_R), t = this.node(e, {
        kind: U.LIST_TYPE,
        type: r
      });
    } else
      t = this.parseNamedType();
    return this.expectOptionalToken(C.BANG) ? this.node(e, {
      kind: U.NON_NULL_TYPE,
      type: t
    }) : t;
  }
  /**
   * NamedType : Name
   */
  parseNamedType() {
    return this.node(this._lexer.token, {
      kind: U.NAMED_TYPE,
      name: this.parseName()
    });
  }
  // Implements the parsing rules in the Type Definition section.
  peekDescription() {
    return this.peek(C.STRING) || this.peek(C.BLOCK_STRING);
  }
  /**
   * Description : StringValue
   */
  parseDescription() {
    if (this.peekDescription())
      return this.parseStringLiteral();
  }
  /**
   * ```
   * SchemaDefinition : Description? schema Directives[Const]? { OperationTypeDefinition+ }
   * ```
   */
  parseSchemaDefinition() {
    const e = this._lexer.token, t = this.parseDescription();
    this.expectKeyword("schema");
    const r = this.parseConstDirectives(), i = this.many(
      C.BRACE_L,
      this.parseOperationTypeDefinition,
      C.BRACE_R
    );
    return this.node(e, {
      kind: U.SCHEMA_DEFINITION,
      description: t,
      directives: r,
      operationTypes: i
    });
  }
  /**
   * OperationTypeDefinition : OperationType : NamedType
   */
  parseOperationTypeDefinition() {
    const e = this._lexer.token, t = this.parseOperationType();
    this.expectToken(C.COLON);
    const r = this.parseNamedType();
    return this.node(e, {
      kind: U.OPERATION_TYPE_DEFINITION,
      operation: t,
      type: r
    });
  }
  /**
   * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
   */
  parseScalarTypeDefinition() {
    const e = this._lexer.token, t = this.parseDescription();
    this.expectKeyword("scalar");
    const r = this.parseName(), i = this.parseConstDirectives();
    return this.node(e, {
      kind: U.SCALAR_TYPE_DEFINITION,
      description: t,
      name: r,
      directives: i
    });
  }
  /**
   * ObjectTypeDefinition :
   *   Description?
   *   type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition?
   */
  parseObjectTypeDefinition() {
    const e = this._lexer.token, t = this.parseDescription();
    this.expectKeyword("type");
    const r = this.parseName(), i = this.parseImplementsInterfaces(), s = this.parseConstDirectives(), o = this.parseFieldsDefinition();
    return this.node(e, {
      kind: U.OBJECT_TYPE_DEFINITION,
      description: t,
      name: r,
      interfaces: i,
      directives: s,
      fields: o
    });
  }
  /**
   * ImplementsInterfaces :
   *   - implements `&`? NamedType
   *   - ImplementsInterfaces & NamedType
   */
  parseImplementsInterfaces() {
    return this.expectOptionalKeyword("implements") ? this.delimitedMany(C.AMP, this.parseNamedType) : [];
  }
  /**
   * ```
   * FieldsDefinition : { FieldDefinition+ }
   * ```
   */
  parseFieldsDefinition() {
    return this.optionalMany(
      C.BRACE_L,
      this.parseFieldDefinition,
      C.BRACE_R
    );
  }
  /**
   * FieldDefinition :
   *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
   */
  parseFieldDefinition() {
    const e = this._lexer.token, t = this.parseDescription(), r = this.parseName(), i = this.parseArgumentDefs();
    this.expectToken(C.COLON);
    const s = this.parseTypeReference(), o = this.parseConstDirectives();
    return this.node(e, {
      kind: U.FIELD_DEFINITION,
      description: t,
      name: r,
      arguments: i,
      type: s,
      directives: o
    });
  }
  /**
   * ArgumentsDefinition : ( InputValueDefinition+ )
   */
  parseArgumentDefs() {
    return this.optionalMany(
      C.PAREN_L,
      this.parseInputValueDef,
      C.PAREN_R
    );
  }
  /**
   * InputValueDefinition :
   *   - Description? Name : Type DefaultValue? Directives[Const]?
   */
  parseInputValueDef() {
    const e = this._lexer.token, t = this.parseDescription(), r = this.parseName();
    this.expectToken(C.COLON);
    const i = this.parseTypeReference();
    let s;
    this.expectOptionalToken(C.EQUALS) && (s = this.parseConstValueLiteral());
    const o = this.parseConstDirectives();
    return this.node(e, {
      kind: U.INPUT_VALUE_DEFINITION,
      description: t,
      name: r,
      type: i,
      defaultValue: s,
      directives: o
    });
  }
  /**
   * InterfaceTypeDefinition :
   *   - Description? interface Name Directives[Const]? FieldsDefinition?
   */
  parseInterfaceTypeDefinition() {
    const e = this._lexer.token, t = this.parseDescription();
    this.expectKeyword("interface");
    const r = this.parseName(), i = this.parseImplementsInterfaces(), s = this.parseConstDirectives(), o = this.parseFieldsDefinition();
    return this.node(e, {
      kind: U.INTERFACE_TYPE_DEFINITION,
      description: t,
      name: r,
      interfaces: i,
      directives: s,
      fields: o
    });
  }
  /**
   * UnionTypeDefinition :
   *   - Description? union Name Directives[Const]? UnionMemberTypes?
   */
  parseUnionTypeDefinition() {
    const e = this._lexer.token, t = this.parseDescription();
    this.expectKeyword("union");
    const r = this.parseName(), i = this.parseConstDirectives(), s = this.parseUnionMemberTypes();
    return this.node(e, {
      kind: U.UNION_TYPE_DEFINITION,
      description: t,
      name: r,
      directives: i,
      types: s
    });
  }
  /**
   * UnionMemberTypes :
   *   - = `|`? NamedType
   *   - UnionMemberTypes | NamedType
   */
  parseUnionMemberTypes() {
    return this.expectOptionalToken(C.EQUALS) ? this.delimitedMany(C.PIPE, this.parseNamedType) : [];
  }
  /**
   * EnumTypeDefinition :
   *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
   */
  parseEnumTypeDefinition() {
    const e = this._lexer.token, t = this.parseDescription();
    this.expectKeyword("enum");
    const r = this.parseName(), i = this.parseConstDirectives(), s = this.parseEnumValuesDefinition();
    return this.node(e, {
      kind: U.ENUM_TYPE_DEFINITION,
      description: t,
      name: r,
      directives: i,
      values: s
    });
  }
  /**
   * ```
   * EnumValuesDefinition : { EnumValueDefinition+ }
   * ```
   */
  parseEnumValuesDefinition() {
    return this.optionalMany(
      C.BRACE_L,
      this.parseEnumValueDefinition,
      C.BRACE_R
    );
  }
  /**
   * EnumValueDefinition : Description? EnumValue Directives[Const]?
   */
  parseEnumValueDefinition() {
    const e = this._lexer.token, t = this.parseDescription(), r = this.parseEnumValueName(), i = this.parseConstDirectives();
    return this.node(e, {
      kind: U.ENUM_VALUE_DEFINITION,
      description: t,
      name: r,
      directives: i
    });
  }
  /**
   * EnumValue : Name but not `true`, `false` or `null`
   */
  parseEnumValueName() {
    if (this._lexer.token.value === "true" || this._lexer.token.value === "false" || this._lexer.token.value === "null")
      throw Ee(
        this._lexer.source,
        this._lexer.token.start,
        `${ir(
          this._lexer.token
        )} is reserved and cannot be used for an enum value.`
      );
    return this.parseName();
  }
  /**
   * InputObjectTypeDefinition :
   *   - Description? input Name Directives[Const]? InputFieldsDefinition?
   */
  parseInputObjectTypeDefinition() {
    const e = this._lexer.token, t = this.parseDescription();
    this.expectKeyword("input");
    const r = this.parseName(), i = this.parseConstDirectives(), s = this.parseInputFieldsDefinition();
    return this.node(e, {
      kind: U.INPUT_OBJECT_TYPE_DEFINITION,
      description: t,
      name: r,
      directives: i,
      fields: s
    });
  }
  /**
   * ```
   * InputFieldsDefinition : { InputValueDefinition+ }
   * ```
   */
  parseInputFieldsDefinition() {
    return this.optionalMany(
      C.BRACE_L,
      this.parseInputValueDef,
      C.BRACE_R
    );
  }
  /**
   * TypeSystemExtension :
   *   - SchemaExtension
   *   - TypeExtension
   *
   * TypeExtension :
   *   - ScalarTypeExtension
   *   - ObjectTypeExtension
   *   - InterfaceTypeExtension
   *   - UnionTypeExtension
   *   - EnumTypeExtension
   *   - InputObjectTypeDefinition
   */
  parseTypeSystemExtension() {
    const e = this._lexer.lookahead();
    if (e.kind === C.NAME)
      switch (e.value) {
        case "schema":
          return this.parseSchemaExtension();
        case "scalar":
          return this.parseScalarTypeExtension();
        case "type":
          return this.parseObjectTypeExtension();
        case "interface":
          return this.parseInterfaceTypeExtension();
        case "union":
          return this.parseUnionTypeExtension();
        case "enum":
          return this.parseEnumTypeExtension();
        case "input":
          return this.parseInputObjectTypeExtension();
      }
    throw this.unexpected(e);
  }
  /**
   * ```
   * SchemaExtension :
   *  - extend schema Directives[Const]? { OperationTypeDefinition+ }
   *  - extend schema Directives[Const]
   * ```
   */
  parseSchemaExtension() {
    const e = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("schema");
    const t = this.parseConstDirectives(), r = this.optionalMany(
      C.BRACE_L,
      this.parseOperationTypeDefinition,
      C.BRACE_R
    );
    if (t.length === 0 && r.length === 0)
      throw this.unexpected();
    return this.node(e, {
      kind: U.SCHEMA_EXTENSION,
      directives: t,
      operationTypes: r
    });
  }
  /**
   * ScalarTypeExtension :
   *   - extend scalar Name Directives[Const]
   */
  parseScalarTypeExtension() {
    const e = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("scalar");
    const t = this.parseName(), r = this.parseConstDirectives();
    if (r.length === 0)
      throw this.unexpected();
    return this.node(e, {
      kind: U.SCALAR_TYPE_EXTENSION,
      name: t,
      directives: r
    });
  }
  /**
   * ObjectTypeExtension :
   *  - extend type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend type Name ImplementsInterfaces? Directives[Const]
   *  - extend type Name ImplementsInterfaces
   */
  parseObjectTypeExtension() {
    const e = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("type");
    const t = this.parseName(), r = this.parseImplementsInterfaces(), i = this.parseConstDirectives(), s = this.parseFieldsDefinition();
    if (r.length === 0 && i.length === 0 && s.length === 0)
      throw this.unexpected();
    return this.node(e, {
      kind: U.OBJECT_TYPE_EXTENSION,
      name: t,
      interfaces: r,
      directives: i,
      fields: s
    });
  }
  /**
   * InterfaceTypeExtension :
   *  - extend interface Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend interface Name ImplementsInterfaces? Directives[Const]
   *  - extend interface Name ImplementsInterfaces
   */
  parseInterfaceTypeExtension() {
    const e = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("interface");
    const t = this.parseName(), r = this.parseImplementsInterfaces(), i = this.parseConstDirectives(), s = this.parseFieldsDefinition();
    if (r.length === 0 && i.length === 0 && s.length === 0)
      throw this.unexpected();
    return this.node(e, {
      kind: U.INTERFACE_TYPE_EXTENSION,
      name: t,
      interfaces: r,
      directives: i,
      fields: s
    });
  }
  /**
   * UnionTypeExtension :
   *   - extend union Name Directives[Const]? UnionMemberTypes
   *   - extend union Name Directives[Const]
   */
  parseUnionTypeExtension() {
    const e = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("union");
    const t = this.parseName(), r = this.parseConstDirectives(), i = this.parseUnionMemberTypes();
    if (r.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(e, {
      kind: U.UNION_TYPE_EXTENSION,
      name: t,
      directives: r,
      types: i
    });
  }
  /**
   * EnumTypeExtension :
   *   - extend enum Name Directives[Const]? EnumValuesDefinition
   *   - extend enum Name Directives[Const]
   */
  parseEnumTypeExtension() {
    const e = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("enum");
    const t = this.parseName(), r = this.parseConstDirectives(), i = this.parseEnumValuesDefinition();
    if (r.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(e, {
      kind: U.ENUM_TYPE_EXTENSION,
      name: t,
      directives: r,
      values: i
    });
  }
  /**
   * InputObjectTypeExtension :
   *   - extend input Name Directives[Const]? InputFieldsDefinition
   *   - extend input Name Directives[Const]
   */
  parseInputObjectTypeExtension() {
    const e = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("input");
    const t = this.parseName(), r = this.parseConstDirectives(), i = this.parseInputFieldsDefinition();
    if (r.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(e, {
      kind: U.INPUT_OBJECT_TYPE_EXTENSION,
      name: t,
      directives: r,
      fields: i
    });
  }
  /**
   * ```
   * DirectiveDefinition :
   *   - Description? directive @ Name ArgumentsDefinition? `repeatable`? on DirectiveLocations
   * ```
   */
  parseDirectiveDefinition() {
    const e = this._lexer.token, t = this.parseDescription();
    this.expectKeyword("directive"), this.expectToken(C.AT);
    const r = this.parseName(), i = this.parseArgumentDefs(), s = this.expectOptionalKeyword("repeatable");
    this.expectKeyword("on");
    const o = this.parseDirectiveLocations();
    return this.node(e, {
      kind: U.DIRECTIVE_DEFINITION,
      description: t,
      name: r,
      arguments: i,
      repeatable: s,
      locations: o
    });
  }
  /**
   * DirectiveLocations :
   *   - `|`? DirectiveLocation
   *   - DirectiveLocations | DirectiveLocation
   */
  parseDirectiveLocations() {
    return this.delimitedMany(C.PIPE, this.parseDirectiveLocation);
  }
  /*
   * DirectiveLocation :
   *   - ExecutableDirectiveLocation
   *   - TypeSystemDirectiveLocation
   *
   * ExecutableDirectiveLocation : one of
   *   `QUERY`
   *   `MUTATION`
   *   `SUBSCRIPTION`
   *   `FIELD`
   *   `FRAGMENT_DEFINITION`
   *   `FRAGMENT_SPREAD`
   *   `INLINE_FRAGMENT`
   *
   * TypeSystemDirectiveLocation : one of
   *   `SCHEMA`
   *   `SCALAR`
   *   `OBJECT`
   *   `FIELD_DEFINITION`
   *   `ARGUMENT_DEFINITION`
   *   `INTERFACE`
   *   `UNION`
   *   `ENUM`
   *   `ENUM_VALUE`
   *   `INPUT_OBJECT`
   *   `INPUT_FIELD_DEFINITION`
   */
  parseDirectiveLocation() {
    const e = this._lexer.token, t = this.parseName();
    if (Object.prototype.hasOwnProperty.call(Oi, t.value))
      return t;
    throw this.unexpected(e);
  }
  // Core parsing utility functions
  /**
   * Returns a node that, if configured to do so, sets a "loc" field as a
   * location object, used to identify the place in the source that created a
   * given parsed object.
   */
  node(e, t) {
    return this._options.noLocation !== !0 && (t.loc = new Wl(
      e,
      this._lexer.lastToken,
      this._lexer.source
    )), t;
  }
  /**
   * Determines if the next token is of a given kind
   */
  peek(e) {
    return this._lexer.token.kind === e;
  }
  /**
   * If the next token is of the given kind, return that token after advancing the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */
  expectToken(e) {
    const t = this._lexer.token;
    if (t.kind === e)
      return this.advanceLexer(), t;
    throw Ee(
      this._lexer.source,
      t.start,
      `Expected ${Za(e)}, found ${ir(t)}.`
    );
  }
  /**
   * If the next token is of the given kind, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */
  expectOptionalToken(e) {
    return this._lexer.token.kind === e ? (this.advanceLexer(), !0) : !1;
  }
  /**
   * If the next token is a given keyword, advance the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */
  expectKeyword(e) {
    const t = this._lexer.token;
    if (t.kind === C.NAME && t.value === e)
      this.advanceLexer();
    else
      throw Ee(
        this._lexer.source,
        t.start,
        `Expected "${e}", found ${ir(t)}.`
      );
  }
  /**
   * If the next token is a given keyword, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */
  expectOptionalKeyword(e) {
    const t = this._lexer.token;
    return t.kind === C.NAME && t.value === e ? (this.advanceLexer(), !0) : !1;
  }
  /**
   * Helper function for creating an error when an unexpected lexed token is encountered.
   */
  unexpected(e) {
    const t = e ?? this._lexer.token;
    return Ee(
      this._lexer.source,
      t.start,
      `Unexpected ${ir(t)}.`
    );
  }
  /**
   * Returns a possibly empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  any(e, t, r) {
    this.expectToken(e);
    const i = [];
    for (; !this.expectOptionalToken(r); )
      i.push(t.call(this));
    return i;
  }
  /**
   * Returns a list of parse nodes, determined by the parseFn.
   * It can be empty only if open token is missing otherwise it will always return non-empty list
   * that begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  optionalMany(e, t, r) {
    if (this.expectOptionalToken(e)) {
      const i = [];
      do
        i.push(t.call(this));
      while (!this.expectOptionalToken(r));
      return i;
    }
    return [];
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  many(e, t, r) {
    this.expectToken(e);
    const i = [];
    do
      i.push(t.call(this));
    while (!this.expectOptionalToken(r));
    return i;
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list may begin with a lex token of delimiterKind followed by items separated by lex tokens of tokenKind.
   * Advances the parser to the next lex token after last item in the list.
   */
  delimitedMany(e, t) {
    this.expectOptionalToken(e);
    const r = [];
    do
      r.push(t.call(this));
    while (this.expectOptionalToken(e));
    return r;
  }
  advanceLexer() {
    const { maxTokens: e } = this._options, t = this._lexer.advance();
    if (t.kind !== C.EOF && (++this._tokenCounter, e !== void 0 && this._tokenCounter > e))
      throw Ee(
        this._lexer.source,
        t.start,
        `Document contains more that ${e} tokens. Parsing aborted.`
      );
  }
}
function ir(n) {
  const e = n.value;
  return Za(n.kind) + (e != null ? ` "${e}"` : "");
}
function Za(n) {
  return Zl(n) ? `"${n}"` : n;
}
function bh(n) {
  return `"${n.replace(wh, _h)}"`;
}
const wh = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
function _h(n) {
  return Eh[n.charCodeAt(0)];
}
const Eh = [
  "\\u0000",
  "\\u0001",
  "\\u0002",
  "\\u0003",
  "\\u0004",
  "\\u0005",
  "\\u0006",
  "\\u0007",
  "\\b",
  "\\t",
  "\\n",
  "\\u000B",
  "\\f",
  "\\r",
  "\\u000E",
  "\\u000F",
  "\\u0010",
  "\\u0011",
  "\\u0012",
  "\\u0013",
  "\\u0014",
  "\\u0015",
  "\\u0016",
  "\\u0017",
  "\\u0018",
  "\\u0019",
  "\\u001A",
  "\\u001B",
  "\\u001C",
  "\\u001D",
  "\\u001E",
  "\\u001F",
  "",
  "",
  '\\"',
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 2F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 3F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 4F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\\\",
  "",
  "",
  "",
  // 5F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 6F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\u007F",
  "\\u0080",
  "\\u0081",
  "\\u0082",
  "\\u0083",
  "\\u0084",
  "\\u0085",
  "\\u0086",
  "\\u0087",
  "\\u0088",
  "\\u0089",
  "\\u008A",
  "\\u008B",
  "\\u008C",
  "\\u008D",
  "\\u008E",
  "\\u008F",
  "\\u0090",
  "\\u0091",
  "\\u0092",
  "\\u0093",
  "\\u0094",
  "\\u0095",
  "\\u0096",
  "\\u0097",
  "\\u0098",
  "\\u0099",
  "\\u009A",
  "\\u009B",
  "\\u009C",
  "\\u009D",
  "\\u009E",
  "\\u009F"
], eu = Object.freeze({});
function st(n, e, t = Ka) {
  const r = /* @__PURE__ */ new Map();
  for (const E of Object.values(U))
    r.set(E, Sh(e, E));
  let i, s = Array.isArray(n), o = [n], a = -1, l = [], c = n, u, d;
  const p = [], m = [];
  do {
    a++;
    const E = a === o.length, T = E && l.length !== 0;
    if (E) {
      if (u = m.length === 0 ? void 0 : p[p.length - 1], c = d, d = m.pop(), T)
        if (s) {
          c = c.slice();
          let A = 0;
          for (const [R, N] of l) {
            const M = R - A;
            N === null ? (c.splice(M, 1), A++) : c[M] = N;
          }
        } else {
          c = Object.defineProperties(
            {},
            Object.getOwnPropertyDescriptors(c)
          );
          for (const [A, R] of l)
            c[A] = R;
        }
      a = i.index, o = i.keys, l = i.edits, s = i.inArray, i = i.prev;
    } else if (d) {
      if (u = s ? a : o[a], c = d[u], c == null)
        continue;
      p.push(u);
    }
    let I;
    if (!Array.isArray(c)) {
      var v, w;
      ho(c) || pr(!1, `Invalid AST Node: ${rs(c)}.`);
      const A = E ? (v = r.get(c.kind)) === null || v === void 0 ? void 0 : v.leave : (w = r.get(c.kind)) === null || w === void 0 ? void 0 : w.enter;
      if (I = A?.call(e, c, u, d, p, m), I === eu)
        break;
      if (I === !1) {
        if (!E) {
          p.pop();
          continue;
        }
      } else if (I !== void 0 && (l.push([u, I]), !E))
        if (ho(I))
          c = I;
        else {
          p.pop();
          continue;
        }
    }
    if (I === void 0 && T && l.push([u, c]), E)
      p.pop();
    else {
      var _;
      i = {
        inArray: s,
        index: a,
        keys: o,
        edits: l,
        prev: i
      }, s = Array.isArray(c), o = s ? c : (_ = t[c.kind]) !== null && _ !== void 0 ? _ : [], a = -1, l = [], d && m.push(d), d = c;
    }
  } while (i !== void 0);
  return l.length !== 0 ? l[l.length - 1][1] : n;
}
function Sh(n, e) {
  const t = n[e];
  return typeof t == "object" ? t : typeof t == "function" ? {
    enter: t,
    leave: void 0
  } : {
    enter: n.enter,
    leave: n.leave
  };
}
function ss(n) {
  return st(n, xh);
}
const kh = 80, xh = {
  Name: {
    leave: (n) => n.value
  },
  Variable: {
    leave: (n) => "$" + n.name
  },
  // Document
  Document: {
    leave: (n) => $(n.definitions, `

`)
  },
  OperationDefinition: {
    leave(n) {
      const e = K("(", $(n.variableDefinitions, ", "), ")"), t = $(
        [
          n.operation,
          $([n.name, e]),
          $(n.directives, " ")
        ],
        " "
      );
      return (t === "query" ? "" : t + " ") + n.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable: n, type: e, defaultValue: t, directives: r }) => n + ": " + e + K(" = ", t) + K(" ", $(r, " "))
  },
  SelectionSet: {
    leave: ({ selections: n }) => We(n)
  },
  Field: {
    leave({ alias: n, name: e, arguments: t, directives: r, selectionSet: i }) {
      const s = K("", n, ": ") + e;
      let o = s + K("(", $(t, ", "), ")");
      return o.length > kh && (o = s + K(`(
`, dr($(t, `
`)), `
)`)), $([o, $(r, " "), i], " ");
    }
  },
  Argument: {
    leave: ({ name: n, value: e }) => n + ": " + e
  },
  // Fragments
  FragmentSpread: {
    leave: ({ name: n, directives: e }) => "..." + n + K(" ", $(e, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition: n, directives: e, selectionSet: t }) => $(
      [
        "...",
        K("on ", n),
        $(e, " "),
        t
      ],
      " "
    )
  },
  FragmentDefinition: {
    leave: ({ name: n, typeCondition: e, variableDefinitions: t, directives: r, selectionSet: i }) => (
      // or removed in the future.
      `fragment ${n}${K("(", $(t, ", "), ")")} on ${e} ${K("", $(r, " "), " ")}` + i
    )
  },
  // Value
  IntValue: {
    leave: ({ value: n }) => n
  },
  FloatValue: {
    leave: ({ value: n }) => n
  },
  StringValue: {
    leave: ({ value: n, block: e }) => e ? Yl(n) : bh(n)
  },
  BooleanValue: {
    leave: ({ value: n }) => n ? "true" : "false"
  },
  NullValue: {
    leave: () => "null"
  },
  EnumValue: {
    leave: ({ value: n }) => n
  },
  ListValue: {
    leave: ({ values: n }) => "[" + $(n, ", ") + "]"
  },
  ObjectValue: {
    leave: ({ fields: n }) => "{" + $(n, ", ") + "}"
  },
  ObjectField: {
    leave: ({ name: n, value: e }) => n + ": " + e
  },
  // Directive
  Directive: {
    leave: ({ name: n, arguments: e }) => "@" + n + K("(", $(e, ", "), ")")
  },
  // Type
  NamedType: {
    leave: ({ name: n }) => n
  },
  ListType: {
    leave: ({ type: n }) => "[" + n + "]"
  },
  NonNullType: {
    leave: ({ type: n }) => n + "!"
  },
  // Type System Definitions
  SchemaDefinition: {
    leave: ({ description: n, directives: e, operationTypes: t }) => K("", n, `
`) + $(["schema", $(e, " "), We(t)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation: n, type: e }) => n + ": " + e
  },
  ScalarTypeDefinition: {
    leave: ({ description: n, name: e, directives: t }) => K("", n, `
`) + $(["scalar", e, $(t, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ description: n, name: e, interfaces: t, directives: r, fields: i }) => K("", n, `
`) + $(
      [
        "type",
        e,
        K("implements ", $(t, " & ")),
        $(r, " "),
        We(i)
      ],
      " "
    )
  },
  FieldDefinition: {
    leave: ({ description: n, name: e, arguments: t, type: r, directives: i }) => K("", n, `
`) + e + (po(t) ? K(`(
`, dr($(t, `
`)), `
)`) : K("(", $(t, ", "), ")")) + ": " + r + K(" ", $(i, " "))
  },
  InputValueDefinition: {
    leave: ({ description: n, name: e, type: t, defaultValue: r, directives: i }) => K("", n, `
`) + $(
      [e + ": " + t, K("= ", r), $(i, " ")],
      " "
    )
  },
  InterfaceTypeDefinition: {
    leave: ({ description: n, name: e, interfaces: t, directives: r, fields: i }) => K("", n, `
`) + $(
      [
        "interface",
        e,
        K("implements ", $(t, " & ")),
        $(r, " "),
        We(i)
      ],
      " "
    )
  },
  UnionTypeDefinition: {
    leave: ({ description: n, name: e, directives: t, types: r }) => K("", n, `
`) + $(
      ["union", e, $(t, " "), K("= ", $(r, " | "))],
      " "
    )
  },
  EnumTypeDefinition: {
    leave: ({ description: n, name: e, directives: t, values: r }) => K("", n, `
`) + $(["enum", e, $(t, " "), We(r)], " ")
  },
  EnumValueDefinition: {
    leave: ({ description: n, name: e, directives: t }) => K("", n, `
`) + $([e, $(t, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ description: n, name: e, directives: t, fields: r }) => K("", n, `
`) + $(["input", e, $(t, " "), We(r)], " ")
  },
  DirectiveDefinition: {
    leave: ({ description: n, name: e, arguments: t, repeatable: r, locations: i }) => K("", n, `
`) + "directive @" + e + (po(t) ? K(`(
`, dr($(t, `
`)), `
)`) : K("(", $(t, ", "), ")")) + (r ? " repeatable" : "") + " on " + $(i, " | ")
  },
  SchemaExtension: {
    leave: ({ directives: n, operationTypes: e }) => $(
      ["extend schema", $(n, " "), We(e)],
      " "
    )
  },
  ScalarTypeExtension: {
    leave: ({ name: n, directives: e }) => $(["extend scalar", n, $(e, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name: n, interfaces: e, directives: t, fields: r }) => $(
      [
        "extend type",
        n,
        K("implements ", $(e, " & ")),
        $(t, " "),
        We(r)
      ],
      " "
    )
  },
  InterfaceTypeExtension: {
    leave: ({ name: n, interfaces: e, directives: t, fields: r }) => $(
      [
        "extend interface",
        n,
        K("implements ", $(e, " & ")),
        $(t, " "),
        We(r)
      ],
      " "
    )
  },
  UnionTypeExtension: {
    leave: ({ name: n, directives: e, types: t }) => $(
      [
        "extend union",
        n,
        $(e, " "),
        K("= ", $(t, " | "))
      ],
      " "
    )
  },
  EnumTypeExtension: {
    leave: ({ name: n, directives: e, values: t }) => $(["extend enum", n, $(e, " "), We(t)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name: n, directives: e, fields: t }) => $(["extend input", n, $(e, " "), We(t)], " ")
  }
};
function $(n, e = "") {
  var t;
  return (t = n?.filter((r) => r).join(e)) !== null && t !== void 0 ? t : "";
}
function We(n) {
  return K(`{
`, dr($(n, `
`)), `
}`);
}
function K(n, e, t = "") {
  return e != null && e !== "" ? n + e + t : "";
}
function dr(n) {
  return K("  ", n.replace(/\n/g, `
  `));
}
function po(n) {
  var e;
  return (e = n?.some((t) => t.includes(`
`))) !== null && e !== void 0 ? e : !1;
}
function Th() {
  return uo();
}
function Ah() {
  __DEV__ ? D(typeof ni == "boolean", ni) : D(typeof ni == "boolean", 36);
}
Th();
Ah();
function Fr(n, e) {
  var t = n.directives;
  return !t || !t.length ? !0 : Rh(t).every(function(r) {
    var i = r.directive, s = r.ifArgument, o = !1;
    return s.value.kind === "Variable" ? (o = e && e[s.value.name.value], __DEV__ ? D(o !== void 0, "Invalid variable referenced in @".concat(i.name.value, " directive.")) : D(o !== void 0, 37)) : o = s.value.value, i.name.value === "skip" ? !o : o;
  });
}
function Ih(n) {
  var e = [];
  return st(n, {
    Directive: function(t) {
      e.push(t.name.value);
    }
  }), e;
}
function Ri(n, e) {
  return Ih(e).some(function(t) {
    return n.indexOf(t) > -1;
  });
}
function Oh(n) {
  return n && Ri(["client"], n) && Ri(["export"], n);
}
function Ch(n) {
  var e = n.name.value;
  return e === "skip" || e === "include";
}
function Rh(n) {
  var e = [];
  return n && n.length && n.forEach(function(t) {
    if (Ch(t)) {
      var r = t.arguments, i = t.name.value;
      __DEV__ ? D(r && r.length === 1, "Incorrect number of arguments for the @".concat(i, " directive.")) : D(r && r.length === 1, 38);
      var s = r[0];
      __DEV__ ? D(s.name && s.name.value === "if", "Invalid argument for the @".concat(i, " directive.")) : D(s.name && s.name.value === "if", 39);
      var o = s.value;
      __DEV__ ? D(o && (o.kind === "Variable" || o.kind === "BooleanValue"), "Argument for the @".concat(i, " directive must be a variable or a boolean value.")) : D(o && (o.kind === "Variable" || o.kind === "BooleanValue"), 40), e.push({ directive: t, ifArgument: s });
    }
  }), e;
}
function Nh(n, e) {
  var t = e, r = [];
  n.definitions.forEach(function(s) {
    if (s.kind === "OperationDefinition")
      throw __DEV__ ? new ne("Found a ".concat(s.operation, " operation").concat(s.name ? " named '".concat(s.name.value, "'") : "", ". ") + "No operations are allowed when using a fragment as a query. Only fragments are allowed.") : new ne(41);
    s.kind === "FragmentDefinition" && r.push(s);
  }), typeof t > "u" && (__DEV__ ? D(r.length === 1, "Found ".concat(r.length, " fragments. `fragmentName` must be provided when there is not exactly 1 fragment.")) : D(r.length === 1, 42), t = r[0].name.value);
  var i = x(x({}, n), { definitions: kr([
    {
      kind: "OperationDefinition",
      operation: "query",
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: {
              kind: "Name",
              value: t
            }
          }
        ]
      }
    }
  ], n.definitions, !0) });
  return i;
}
function $r(n) {
  n === void 0 && (n = []);
  var e = {};
  return n.forEach(function(t) {
    e[t.name.value] = t;
  }), e;
}
function os(n, e) {
  switch (n.kind) {
    case "InlineFragment":
      return n;
    case "FragmentSpread": {
      var t = e && e[n.name.value];
      return __DEV__ ? D(t, "No fragment named ".concat(n.name.value, ".")) : D(t, 43), t;
    }
    default:
      return null;
  }
}
function ue(n) {
  return n !== null && typeof n == "object";
}
function sn(n) {
  return { __ref: String(n) };
}
function Z(n) {
  return !!(n && typeof n == "object" && typeof n.__ref == "string");
}
function Dh(n) {
  return ue(n) && n.kind === "Document" && Array.isArray(n.definitions);
}
function Mh(n) {
  return n.kind === "StringValue";
}
function Fh(n) {
  return n.kind === "BooleanValue";
}
function $h(n) {
  return n.kind === "IntValue";
}
function Bh(n) {
  return n.kind === "FloatValue";
}
function Ph(n) {
  return n.kind === "Variable";
}
function Lh(n) {
  return n.kind === "ObjectValue";
}
function Uh(n) {
  return n.kind === "ListValue";
}
function qh(n) {
  return n.kind === "EnumValue";
}
function jh(n) {
  return n.kind === "NullValue";
}
function cn(n, e, t, r) {
  if ($h(t) || Bh(t))
    n[e.value] = Number(t.value);
  else if (Fh(t) || Mh(t))
    n[e.value] = t.value;
  else if (Lh(t)) {
    var i = {};
    t.fields.map(function(o) {
      return cn(i, o.name, o.value, r);
    }), n[e.value] = i;
  } else if (Ph(t)) {
    var s = (r || {})[t.name.value];
    n[e.value] = s;
  } else if (Uh(t))
    n[e.value] = t.values.map(function(o) {
      var a = {};
      return cn(a, e, o, r), a[e.value];
    });
  else if (qh(t))
    n[e.value] = t.value;
  else if (jh(t))
    n[e.value] = null;
  else
    throw __DEV__ ? new ne('The inline argument "'.concat(e.value, '" of kind "').concat(t.kind, '"') + "is not supported. Use variables instead of inline arguments to overcome this limitation.") : new ne(52);
}
function Vh(n, e) {
  var t = null;
  n.directives && (t = {}, n.directives.forEach(function(i) {
    t[i.name.value] = {}, i.arguments && i.arguments.forEach(function(s) {
      var o = s.name, a = s.value;
      return cn(t[i.name.value], o, a, e);
    });
  }));
  var r = null;
  return n.arguments && n.arguments.length && (r = {}, n.arguments.forEach(function(i) {
    var s = i.name, o = i.value;
    return cn(r, s, o, e);
  })), as(n.name.value, r, t);
}
var Qh = [
  "connection",
  "include",
  "skip",
  "client",
  "rest",
  "export"
], as = Object.assign(function(n, e, t) {
  if (e && t && t.connection && t.connection.key)
    if (t.connection.filter && t.connection.filter.length > 0) {
      var r = t.connection.filter ? t.connection.filter : [];
      r.sort();
      var i = {};
      return r.forEach(function(a) {
        i[a] = e[a];
      }), "".concat(t.connection.key, "(").concat(Sn(i), ")");
    } else
      return t.connection.key;
  var s = n;
  if (e) {
    var o = Sn(e);
    s += "(".concat(o, ")");
  }
  return t && Object.keys(t).forEach(function(a) {
    Qh.indexOf(a) === -1 && (t[a] && Object.keys(t[a]).length ? s += "@".concat(a, "(").concat(Sn(t[a]), ")") : s += "@".concat(a));
  }), s;
}, {
  setStringify: function(n) {
    var e = Sn;
    return Sn = n, e;
  }
}), Sn = function(e) {
  return JSON.stringify(e, Hh);
};
function Hh(n, e) {
  return ue(e) && !Array.isArray(e) && (e = Object.keys(e).sort().reduce(function(t, r) {
    return t[r] = e[r], t;
  }, {})), e;
}
function Br(n, e) {
  if (n.arguments && n.arguments.length) {
    var t = {};
    return n.arguments.forEach(function(r) {
      var i = r.name, s = r.value;
      return cn(t, i, s, e);
    }), t;
  }
  return null;
}
function Vt(n) {
  return n.alias ? n.alias.value : n.name.value;
}
function Ni(n, e, t) {
  if (typeof n.__typename == "string")
    return n.__typename;
  for (var r = 0, i = e.selections; r < i.length; r++) {
    var s = i[r];
    if (gt(s)) {
      if (s.name.value === "__typename")
        return n[Vt(s)];
    } else {
      var o = Ni(n, os(s, t).selectionSet, t);
      if (typeof o == "string")
        return o;
    }
  }
}
function gt(n) {
  return n.kind === "Field";
}
function tu(n) {
  return n.kind === "InlineFragment";
}
function zn(n) {
  __DEV__ ? D(n && n.kind === "Document", 'Expecting a parsed GraphQL document. Perhaps you need to wrap the query string in a "gql" tag? http://docs.apollostack.com/apollo-client/core.html#gql') : D(n && n.kind === "Document", 44);
  var e = n.definitions.filter(function(t) {
    return t.kind !== "FragmentDefinition";
  }).map(function(t) {
    if (t.kind !== "OperationDefinition")
      throw __DEV__ ? new ne('Schema type definitions not allowed in queries. Found: "'.concat(t.kind, '"')) : new ne(45);
    return t;
  });
  return __DEV__ ? D(e.length <= 1, "Ambiguous GraphQL document: contains ".concat(e.length, " operations")) : D(e.length <= 1, 46), n;
}
function Gn(n) {
  return zn(n), n.definitions.filter(function(e) {
    return e.kind === "OperationDefinition";
  })[0];
}
function Di(n) {
  return n.definitions.filter(function(e) {
    return e.kind === "OperationDefinition" && e.name;
  }).map(function(e) {
    return e.name.value;
  })[0] || null;
}
function Pr(n) {
  return n.definitions.filter(function(e) {
    return e.kind === "FragmentDefinition";
  });
}
function nu(n) {
  var e = Gn(n);
  return __DEV__ ? D(e && e.operation === "query", "Must contain a query definition.") : D(e && e.operation === "query", 47), e;
}
function Wh(n) {
  __DEV__ ? D(n.kind === "Document", 'Expecting a parsed GraphQL document. Perhaps you need to wrap the query string in a "gql" tag? http://docs.apollostack.com/apollo-client/core.html#gql') : D(n.kind === "Document", 48), __DEV__ ? D(n.definitions.length <= 1, "Fragment must have exactly one definition.") : D(n.definitions.length <= 1, 49);
  var e = n.definitions[0];
  return __DEV__ ? D(e.kind === "FragmentDefinition", "Must be a fragment definition.") : D(e.kind === "FragmentDefinition", 50), e;
}
function Lr(n) {
  zn(n);
  for (var e, t = 0, r = n.definitions; t < r.length; t++) {
    var i = r[t];
    if (i.kind === "OperationDefinition") {
      var s = i.operation;
      if (s === "query" || s === "mutation" || s === "subscription")
        return i;
    }
    i.kind === "FragmentDefinition" && !e && (e = i);
  }
  if (e)
    return e;
  throw __DEV__ ? new ne("Expected a parsed GraphQL query with a query, mutation, subscription, or a fragment.") : new ne(51);
}
function us(n) {
  var e = /* @__PURE__ */ Object.create(null), t = n && n.variableDefinitions;
  return t && t.length && t.forEach(function(r) {
    r.defaultValue && cn(e, r.variable.name, r.defaultValue);
  }), e;
}
function yo(n, e, t) {
  var r = 0;
  return n.forEach(function(i, s) {
    e.call(this, i, s, n) && (n[r++] = i);
  }, t), n.length = r, n;
}
var mo = {
  kind: "Field",
  name: {
    kind: "Name",
    value: "__typename"
  }
};
function ru(n, e) {
  return n.selectionSet.selections.every(function(t) {
    return t.kind === "FragmentSpread" && ru(e[t.name.value], e);
  });
}
function cs(n) {
  return ru(Gn(n) || Wh(n), $r(Pr(n))) ? null : n;
}
function go(n) {
  return function(t) {
    return n.some(function(r) {
      return r.name && r.name === t.name.value || r.test && r.test(t);
    });
  };
}
function iu(n, e) {
  var t = /* @__PURE__ */ Object.create(null), r = [], i = /* @__PURE__ */ Object.create(null), s = [], o = cs(st(e, {
    Variable: {
      enter: function(a, l, c) {
        c.kind !== "VariableDefinition" && (t[a.name.value] = !0);
      }
    },
    Field: {
      enter: function(a) {
        if (n && a.directives) {
          var l = n.some(function(c) {
            return c.remove;
          });
          if (l && a.directives && a.directives.some(go(n)))
            return a.arguments && a.arguments.forEach(function(c) {
              c.value.kind === "Variable" && r.push({
                name: c.value.name.value
              });
            }), a.selectionSet && su(a.selectionSet).forEach(function(c) {
              s.push({
                name: c.name.value
              });
            }), null;
        }
      }
    },
    FragmentSpread: {
      enter: function(a) {
        i[a.name.value] = !0;
      }
    },
    Directive: {
      enter: function(a) {
        if (go(n)(a))
          return null;
      }
    }
  }));
  return o && yo(r, function(a) {
    return !!a.name && !t[a.name];
  }).length && (o = Jh(r, o)), o && yo(s, function(a) {
    return !!a.name && !i[a.name];
  }).length && (o = Yh(s, o)), o;
}
var ls = Object.assign(function(n) {
  return st(zn(n), {
    SelectionSet: {
      enter: function(e, t, r) {
        if (!(r && r.kind === "OperationDefinition")) {
          var i = e.selections;
          if (i) {
            var s = i.some(function(a) {
              return gt(a) && (a.name.value === "__typename" || a.name.value.lastIndexOf("__", 0) === 0);
            });
            if (!s) {
              var o = r;
              if (!(gt(o) && o.directives && o.directives.some(function(a) {
                return a.name.value === "export";
              })))
                return x(x({}, e), { selections: kr(kr([], i, !0), [mo], !1) });
            }
          }
        }
      }
    }
  });
}, {
  added: function(n) {
    return n === mo;
  }
}), Kh = {
  test: function(n) {
    var e = n.name.value === "connection";
    return e && (!n.arguments || !n.arguments.some(function(t) {
      return t.name.value === "key";
    })) && __DEV__ && D.warn("Removing an @connection directive even though it does not have a key. You may want to use the key parameter to specify a store key."), e;
  }
};
function zh(n) {
  return iu([Kh], zn(n));
}
function Gh(n) {
  return function(t) {
    return n.some(function(r) {
      return t.value && t.value.kind === "Variable" && t.value.name && (r.name === t.value.name.value || r.test && r.test(t));
    });
  };
}
function Jh(n, e) {
  var t = Gh(n);
  return cs(st(e, {
    OperationDefinition: {
      enter: function(r) {
        return x(x({}, r), { variableDefinitions: r.variableDefinitions ? r.variableDefinitions.filter(function(i) {
          return !n.some(function(s) {
            return s.name === i.variable.name.value;
          });
        }) : [] });
      }
    },
    Field: {
      enter: function(r) {
        var i = n.some(function(o) {
          return o.remove;
        });
        if (i) {
          var s = 0;
          if (r.arguments && r.arguments.forEach(function(o) {
            t(o) && (s += 1);
          }), s === 1)
            return null;
        }
      }
    },
    Argument: {
      enter: function(r) {
        if (t(r))
          return null;
      }
    }
  }));
}
function Yh(n, e) {
  function t(r) {
    if (n.some(function(i) {
      return i.name === r.name.value;
    }))
      return null;
  }
  return cs(st(e, {
    FragmentSpread: { enter: t },
    FragmentDefinition: { enter: t }
  }));
}
function su(n) {
  var e = [];
  return n.selections.forEach(function(t) {
    (gt(t) || tu(t)) && t.selectionSet ? su(t.selectionSet).forEach(function(r) {
      return e.push(r);
    }) : t.kind === "FragmentSpread" && e.push(t);
  }), e;
}
function Xh(n) {
  var e = Lr(n), t = e.operation;
  if (t === "query")
    return n;
  var r = st(n, {
    OperationDefinition: {
      enter: function(i) {
        return x(x({}, i), { operation: "query" });
      }
    }
  });
  return r;
}
function Zh(n) {
  zn(n);
  var e = iu([
    {
      test: function(t) {
        return t.name.value === "client";
      },
      remove: !0
    }
  ], n);
  return e && (e = st(e, {
    FragmentDefinition: {
      enter: function(t) {
        if (t.selectionSet) {
          var r = t.selectionSet.selections.every(function(i) {
            return gt(i) && i.name.value === "__typename";
          });
          if (r)
            return null;
        }
      }
    }
  })), e;
}
var ef = Object.prototype.hasOwnProperty;
function vo() {
  for (var n = [], e = 0; e < arguments.length; e++)
    n[e] = arguments[e];
  return ou(n);
}
function ou(n) {
  var e = n[0] || {}, t = n.length;
  if (t > 1)
    for (var r = new Jn(), i = 1; i < t; ++i)
      e = r.merge(e, n[i]);
  return e;
}
var tf = function(n, e, t) {
  return this.merge(n[t], e[t]);
}, Jn = function() {
  function n(e) {
    e === void 0 && (e = tf), this.reconciler = e, this.isObject = ue, this.pastCopies = /* @__PURE__ */ new Set();
  }
  return n.prototype.merge = function(e, t) {
    for (var r = this, i = [], s = 2; s < arguments.length; s++)
      i[s - 2] = arguments[s];
    return ue(t) && ue(e) ? (Object.keys(t).forEach(function(o) {
      if (ef.call(e, o)) {
        var a = e[o];
        if (t[o] !== a) {
          var l = r.reconciler.apply(r, kr([e, t, o], i, !1));
          l !== a && (e = r.shallowCopyForMerge(e), e[o] = l);
        }
      } else
        e = r.shallowCopyForMerge(e), e[o] = t[o];
    }), e) : t;
  }, n.prototype.shallowCopyForMerge = function(e) {
    if (ue(e)) {
      if (this.pastCopies.has(e)) {
        if (!Object.isFrozen(e))
          return e;
        this.pastCopies.delete(e);
      }
      Array.isArray(e) ? e = e.slice(0) : e = x({ __proto__: Object.getPrototypeOf(e) }, e), this.pastCopies.add(e);
    }
    return e;
  }, n;
}();
function nf(n, e) {
  var t = typeof Symbol < "u" && n[Symbol.iterator] || n["@@iterator"];
  if (t) return (t = t.call(n)).next.bind(t);
  if (Array.isArray(n) || (t = rf(n)) || e) {
    t && (n = t);
    var r = 0;
    return function() {
      return r >= n.length ? { done: !0 } : { done: !1, value: n[r++] };
    };
  }
  throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function rf(n, e) {
  if (n) {
    if (typeof n == "string") return bo(n, e);
    var t = Object.prototype.toString.call(n).slice(8, -1);
    if (t === "Object" && n.constructor && (t = n.constructor.name), t === "Map" || t === "Set") return Array.from(n);
    if (t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)) return bo(n, e);
  }
}
function bo(n, e) {
  (e == null || e > n.length) && (e = n.length);
  for (var t = 0, r = new Array(e); t < e; t++)
    r[t] = n[t];
  return r;
}
function wo(n, e) {
  for (var t = 0; t < e.length; t++) {
    var r = e[t];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(n, r.key, r);
  }
}
function hs(n, e, t) {
  return e && wo(n.prototype, e), t && wo(n, t), Object.defineProperty(n, "prototype", { writable: !1 }), n;
}
var fs = function() {
  return typeof Symbol == "function";
}, ps = function(n) {
  return fs() && !!Symbol[n];
}, ds = function(n) {
  return ps(n) ? Symbol[n] : "@@" + n;
};
fs() && !ps("observable") && (Symbol.observable = Symbol("observable"));
var sf = ds("iterator"), Mi = ds("observable"), au = ds("species");
function xr(n, e) {
  var t = n[e];
  if (t != null) {
    if (typeof t != "function") throw new TypeError(t + " is not a function");
    return t;
  }
}
function kn(n) {
  var e = n.constructor;
  return e !== void 0 && (e = e[au], e === null && (e = void 0)), e !== void 0 ? e : ee;
}
function of(n) {
  return n instanceof ee;
}
function ln(n) {
  ln.log ? ln.log(n) : setTimeout(function() {
    throw n;
  });
}
function yr(n) {
  Promise.resolve().then(function() {
    try {
      n();
    } catch (e) {
      ln(e);
    }
  });
}
function uu(n) {
  var e = n._cleanup;
  if (e !== void 0 && (n._cleanup = void 0, !!e))
    try {
      if (typeof e == "function")
        e();
      else {
        var t = xr(e, "unsubscribe");
        t && t.call(e);
      }
    } catch (r) {
      ln(r);
    }
}
function Fi(n) {
  n._observer = void 0, n._queue = void 0, n._state = "closed";
}
function af(n) {
  var e = n._queue;
  if (e) {
    n._queue = void 0, n._state = "ready";
    for (var t = 0; t < e.length && (cu(n, e[t].type, e[t].value), n._state !== "closed"); ++t)
      ;
  }
}
function cu(n, e, t) {
  n._state = "running";
  var r = n._observer;
  try {
    var i = xr(r, e);
    switch (e) {
      case "next":
        i && i.call(r, t);
        break;
      case "error":
        if (Fi(n), i) i.call(r, t);
        else throw t;
        break;
      case "complete":
        Fi(n), i && i.call(r);
        break;
    }
  } catch (s) {
    ln(s);
  }
  n._state === "closed" ? uu(n) : n._state === "running" && (n._state = "ready");
}
function ii(n, e, t) {
  if (n._state !== "closed") {
    if (n._state === "buffering") {
      n._queue.push({
        type: e,
        value: t
      });
      return;
    }
    if (n._state !== "ready") {
      n._state = "buffering", n._queue = [{
        type: e,
        value: t
      }], yr(function() {
        return af(n);
      });
      return;
    }
    cu(n, e, t);
  }
}
var uf = /* @__PURE__ */ function() {
  function n(t, r) {
    this._cleanup = void 0, this._observer = t, this._queue = void 0, this._state = "initializing";
    var i = new cf(this);
    try {
      this._cleanup = r.call(void 0, i);
    } catch (s) {
      i.error(s);
    }
    this._state === "initializing" && (this._state = "ready");
  }
  var e = n.prototype;
  return e.unsubscribe = function() {
    this._state !== "closed" && (Fi(this), uu(this));
  }, hs(n, [{
    key: "closed",
    get: function() {
      return this._state === "closed";
    }
  }]), n;
}(), cf = /* @__PURE__ */ function() {
  function n(t) {
    this._subscription = t;
  }
  var e = n.prototype;
  return e.next = function(r) {
    ii(this._subscription, "next", r);
  }, e.error = function(r) {
    ii(this._subscription, "error", r);
  }, e.complete = function() {
    ii(this._subscription, "complete");
  }, hs(n, [{
    key: "closed",
    get: function() {
      return this._subscription._state === "closed";
    }
  }]), n;
}(), ee = /* @__PURE__ */ function() {
  function n(t) {
    if (!(this instanceof n)) throw new TypeError("Observable cannot be called as a function");
    if (typeof t != "function") throw new TypeError("Observable initializer must be a function");
    this._subscriber = t;
  }
  var e = n.prototype;
  return e.subscribe = function(r) {
    return (typeof r != "object" || r === null) && (r = {
      next: r,
      error: arguments[1],
      complete: arguments[2]
    }), new uf(r, this._subscriber);
  }, e.forEach = function(r) {
    var i = this;
    return new Promise(function(s, o) {
      if (typeof r != "function") {
        o(new TypeError(r + " is not a function"));
        return;
      }
      function a() {
        l.unsubscribe(), s();
      }
      var l = i.subscribe({
        next: function(c) {
          try {
            r(c, a);
          } catch (u) {
            o(u), l.unsubscribe();
          }
        },
        error: o,
        complete: s
      });
    });
  }, e.map = function(r) {
    var i = this;
    if (typeof r != "function") throw new TypeError(r + " is not a function");
    var s = kn(this);
    return new s(function(o) {
      return i.subscribe({
        next: function(a) {
          try {
            a = r(a);
          } catch (l) {
            return o.error(l);
          }
          o.next(a);
        },
        error: function(a) {
          o.error(a);
        },
        complete: function() {
          o.complete();
        }
      });
    });
  }, e.filter = function(r) {
    var i = this;
    if (typeof r != "function") throw new TypeError(r + " is not a function");
    var s = kn(this);
    return new s(function(o) {
      return i.subscribe({
        next: function(a) {
          try {
            if (!r(a)) return;
          } catch (l) {
            return o.error(l);
          }
          o.next(a);
        },
        error: function(a) {
          o.error(a);
        },
        complete: function() {
          o.complete();
        }
      });
    });
  }, e.reduce = function(r) {
    var i = this;
    if (typeof r != "function") throw new TypeError(r + " is not a function");
    var s = kn(this), o = arguments.length > 1, a = !1, l = arguments[1], c = l;
    return new s(function(u) {
      return i.subscribe({
        next: function(d) {
          var p = !a;
          if (a = !0, !p || o)
            try {
              c = r(c, d);
            } catch (m) {
              return u.error(m);
            }
          else
            c = d;
        },
        error: function(d) {
          u.error(d);
        },
        complete: function() {
          if (!a && !o) return u.error(new TypeError("Cannot reduce an empty sequence"));
          u.next(c), u.complete();
        }
      });
    });
  }, e.concat = function() {
    for (var r = this, i = arguments.length, s = new Array(i), o = 0; o < i; o++)
      s[o] = arguments[o];
    var a = kn(this);
    return new a(function(l) {
      var c, u = 0;
      function d(p) {
        c = p.subscribe({
          next: function(m) {
            l.next(m);
          },
          error: function(m) {
            l.error(m);
          },
          complete: function() {
            u === s.length ? (c = void 0, l.complete()) : d(a.from(s[u++]));
          }
        });
      }
      return d(r), function() {
        c && (c.unsubscribe(), c = void 0);
      };
    });
  }, e.flatMap = function(r) {
    var i = this;
    if (typeof r != "function") throw new TypeError(r + " is not a function");
    var s = kn(this);
    return new s(function(o) {
      var a = [], l = i.subscribe({
        next: function(u) {
          if (r)
            try {
              u = r(u);
            } catch (p) {
              return o.error(p);
            }
          var d = s.from(u).subscribe({
            next: function(p) {
              o.next(p);
            },
            error: function(p) {
              o.error(p);
            },
            complete: function() {
              var p = a.indexOf(d);
              p >= 0 && a.splice(p, 1), c();
            }
          });
          a.push(d);
        },
        error: function(u) {
          o.error(u);
        },
        complete: function() {
          c();
        }
      });
      function c() {
        l.closed && a.length === 0 && o.complete();
      }
      return function() {
        a.forEach(function(u) {
          return u.unsubscribe();
        }), l.unsubscribe();
      };
    });
  }, e[Mi] = function() {
    return this;
  }, n.from = function(r) {
    var i = typeof this == "function" ? this : n;
    if (r == null) throw new TypeError(r + " is not an object");
    var s = xr(r, Mi);
    if (s) {
      var o = s.call(r);
      if (Object(o) !== o) throw new TypeError(o + " is not an object");
      return of(o) && o.constructor === i ? o : new i(function(a) {
        return o.subscribe(a);
      });
    }
    if (ps("iterator") && (s = xr(r, sf), s))
      return new i(function(a) {
        yr(function() {
          if (!a.closed) {
            for (var l = nf(s.call(r)), c; !(c = l()).done; ) {
              var u = c.value;
              if (a.next(u), a.closed) return;
            }
            a.complete();
          }
        });
      });
    if (Array.isArray(r))
      return new i(function(a) {
        yr(function() {
          if (!a.closed) {
            for (var l = 0; l < r.length; ++l)
              if (a.next(r[l]), a.closed) return;
            a.complete();
          }
        });
      });
    throw new TypeError(r + " is not observable");
  }, n.of = function() {
    for (var r = arguments.length, i = new Array(r), s = 0; s < r; s++)
      i[s] = arguments[s];
    var o = typeof this == "function" ? this : n;
    return new o(function(a) {
      yr(function() {
        if (!a.closed) {
          for (var l = 0; l < i.length; ++l)
            if (a.next(i[l]), a.closed) return;
          a.complete();
        }
      });
    });
  }, hs(n, null, [{
    key: au,
    get: function() {
      return this;
    }
  }]), n;
}();
fs() && Object.defineProperty(ee, Symbol("extensions"), {
  value: {
    symbol: Mi,
    hostReportError: ln
  },
  configurable: !0
});
function lf(n) {
  var e, t = n.Symbol;
  if (typeof t == "function")
    if (t.observable)
      e = t.observable;
    else {
      typeof t.for == "function" ? e = t.for("https://github.com/benlesh/symbol-observable") : e = t("https://github.com/benlesh/symbol-observable");
      try {
        t.observable = e;
      } catch {
      }
    }
  else
    e = "@@observable";
  return e;
}
var Xt;
typeof self < "u" ? Xt = self : typeof window < "u" ? Xt = window : typeof rt < "u" ? Xt = rt : typeof module < "u" ? Xt = module : Xt = Function("return this")();
lf(Xt);
var _o = ee.prototype, Eo = "@@observable";
_o[Eo] || (_o[Eo] = function() {
  return this;
});
var hf = Object.prototype.toString;
function lu(n) {
  return $i(n);
}
function $i(n, e) {
  switch (hf.call(n)) {
    case "[object Array]": {
      if (e = e || /* @__PURE__ */ new Map(), e.has(n))
        return e.get(n);
      var t = n.slice(0);
      return e.set(n, t), t.forEach(function(i, s) {
        t[s] = $i(i, e);
      }), t;
    }
    case "[object Object]": {
      if (e = e || /* @__PURE__ */ new Map(), e.has(n))
        return e.get(n);
      var r = Object.create(Object.getPrototypeOf(n));
      return e.set(n, r), Object.keys(n).forEach(function(i) {
        r[i] = $i(n[i], e);
      }), r;
    }
    default:
      return n;
  }
}
function ff(n) {
  var e = /* @__PURE__ */ new Set([n]);
  return e.forEach(function(t) {
    ue(t) && pf(t) === t && Object.getOwnPropertyNames(t).forEach(function(r) {
      ue(t[r]) && e.add(t[r]);
    });
  }), n;
}
function pf(n) {
  if (__DEV__ && !Object.isFrozen(n))
    try {
      Object.freeze(n);
    } catch (e) {
      if (e instanceof TypeError)
        return null;
      throw e;
    }
  return n;
}
function Bi(n) {
  return __DEV__ && ff(n), n;
}
function Dn(n, e, t) {
  var r = [];
  n.forEach(function(i) {
    return i[e] && r.push(i);
  }), r.forEach(function(i) {
    return i[e](t);
  });
}
function si(n, e, t) {
  return new ee(function(r) {
    var i = r.next, s = r.error, o = r.complete, a = 0, l = !1, c = {
      then: function(m) {
        return new Promise(function(v) {
          return v(m());
        });
      }
    };
    function u(m, v) {
      return m ? function(w) {
        ++a;
        var _ = function() {
          return m(w);
        };
        c = c.then(_, _).then(function(E) {
          --a, i && i.call(r, E), l && d.complete();
        }, function(E) {
          throw --a, E;
        }).catch(function(E) {
          s && s.call(r, E);
        });
      } : function(w) {
        return v && v.call(r, w);
      };
    }
    var d = {
      next: u(e, i),
      error: u(t, s),
      complete: function() {
        l = !0, a || o && o.call(r);
      }
    }, p = n.subscribe(d);
    return function() {
      return p.unsubscribe();
    };
  });
}
var Wt = typeof WeakMap == "function" && !(typeof navigator == "object" && navigator.product === "ReactNative"), df = typeof WeakSet == "function", yf = typeof Symbol == "function" && typeof Symbol.for == "function";
function hu(n) {
  function e(t) {
    Object.defineProperty(n, t, { value: ee });
  }
  return yf && Symbol.species && e(Symbol.species), e("@@species"), n;
}
function So(n) {
  return n && typeof n.then == "function";
}
var Cn = function(n) {
  Ve(e, n);
  function e(t) {
    var r = n.call(this, function(i) {
      return r.addObserver(i), function() {
        return r.removeObserver(i);
      };
    }) || this;
    return r.observers = /* @__PURE__ */ new Set(), r.addCount = 0, r.promise = new Promise(function(i, s) {
      r.resolve = i, r.reject = s;
    }), r.handlers = {
      next: function(i) {
        r.sub !== null && (r.latest = ["next", i], Dn(r.observers, "next", i));
      },
      error: function(i) {
        var s = r.sub;
        s !== null && (s && setTimeout(function() {
          return s.unsubscribe();
        }), r.sub = null, r.latest = ["error", i], r.reject(i), Dn(r.observers, "error", i));
      },
      complete: function() {
        if (r.sub !== null) {
          var i = r.sources.shift();
          i ? So(i) ? i.then(function(s) {
            return r.sub = s.subscribe(r.handlers);
          }) : r.sub = i.subscribe(r.handlers) : (r.sub = null, r.latest && r.latest[0] === "next" ? r.resolve(r.latest[1]) : r.resolve(), Dn(r.observers, "complete"));
        }
      }
    }, r.cancel = function(i) {
      r.reject(i), r.sources = [], r.handlers.complete();
    }, r.promise.catch(function(i) {
    }), typeof t == "function" && (t = [new ee(t)]), So(t) ? t.then(function(i) {
      return r.start(i);
    }, r.handlers.error) : r.start(t), r;
  }
  return e.prototype.start = function(t) {
    this.sub === void 0 && (this.sources = Array.from(t), this.handlers.complete());
  }, e.prototype.deliverLastMessage = function(t) {
    if (this.latest) {
      var r = this.latest[0], i = t[r];
      i && i.call(t, this.latest[1]), this.sub === null && r === "next" && t.complete && t.complete();
    }
  }, e.prototype.addObserver = function(t) {
    this.observers.has(t) || (this.deliverLastMessage(t), this.observers.add(t), ++this.addCount);
  }, e.prototype.removeObserver = function(t, r) {
    this.observers.delete(t) && --this.addCount < 1 && !r && this.handlers.error(new Error("Observable cancelled prematurely"));
  }, e.prototype.cleanup = function(t) {
    var r = this, i = !1, s = function() {
      i || (i = !0, r.observers.delete(o), t());
    }, o = {
      next: s,
      error: s,
      complete: s
    }, a = this.addCount;
    this.addObserver(o), this.addCount = a;
  }, e;
}(ee);
hu(Cn);
function Qt(n) {
  return Array.isArray(n) && n.length > 0;
}
function mr(n) {
  return n.errors && n.errors.length > 0 || !1;
}
function qn() {
  for (var n = [], e = 0; e < arguments.length; e++)
    n[e] = arguments[e];
  var t = /* @__PURE__ */ Object.create(null);
  return n.forEach(function(r) {
    r && Object.keys(r).forEach(function(i) {
      var s = r[i];
      s !== void 0 && (t[i] = s);
    });
  }), t;
}
var ko = /* @__PURE__ */ new Map();
function Pi(n) {
  var e = ko.get(n) || 1;
  return ko.set(n, e + 1), "".concat(n, ":").concat(e, ":").concat(Math.random().toString(36).slice(2));
}
function mf(n) {
  var e = Pi("stringifyForDisplay");
  return JSON.stringify(n, function(t, r) {
    return r === void 0 ? e : r;
  }).split(JSON.stringify(e)).join("<undefined>");
}
function xo(n) {
  return new ee(function(e) {
    e.error(n);
  });
}
var To = function(n, e, t) {
  var r = new Error(t);
  throw r.name = "ServerError", r.response = n, r.statusCode = n.status, r.result = e, r;
};
function gf(n) {
  for (var e = [
    "query",
    "operationName",
    "variables",
    "extensions",
    "context"
  ], t = 0, r = Object.keys(n); t < r.length; t++) {
    var i = r[t];
    if (e.indexOf(i) < 0)
      throw __DEV__ ? new ne("illegal argument: ".concat(i)) : new ne(24);
  }
  return n;
}
function vf(n, e) {
  var t = x({}, n), r = function(s) {
    typeof s == "function" ? t = x(x({}, t), s(t)) : t = x(x({}, t), s);
  }, i = function() {
    return x({}, t);
  };
  return Object.defineProperty(e, "setContext", {
    enumerable: !1,
    value: r
  }), Object.defineProperty(e, "getContext", {
    enumerable: !1,
    value: i
  }), e;
}
function bf(n) {
  var e = {
    variables: n.variables || {},
    extensions: n.extensions || {},
    operationName: n.operationName,
    query: n.query
  };
  return e.operationName || (e.operationName = typeof e.query != "string" ? Di(e.query) || void 0 : ""), e;
}
function Ao(n, e) {
  return e ? e(n) : ee.of();
}
function xn(n) {
  return typeof n == "function" ? new Qe(n) : n;
}
function sr(n) {
  return n.request.length <= 1;
}
var wf = function(n) {
  Ve(e, n);
  function e(t, r) {
    var i = n.call(this, t) || this;
    return i.link = r, i;
  }
  return e;
}(Error), Qe = function() {
  function n(e) {
    e && (this.request = e);
  }
  return n.empty = function() {
    return new n(function() {
      return ee.of();
    });
  }, n.from = function(e) {
    return e.length === 0 ? n.empty() : e.map(xn).reduce(function(t, r) {
      return t.concat(r);
    });
  }, n.split = function(e, t, r) {
    var i = xn(t), s = xn(r || new n(Ao));
    return sr(i) && sr(s) ? new n(function(o) {
      return e(o) ? i.request(o) || ee.of() : s.request(o) || ee.of();
    }) : new n(function(o, a) {
      return e(o) ? i.request(o, a) || ee.of() : s.request(o, a) || ee.of();
    });
  }, n.execute = function(e, t) {
    return e.request(vf(t.context, bf(gf(t)))) || ee.of();
  }, n.concat = function(e, t) {
    var r = xn(e);
    if (sr(r))
      return __DEV__ && D.warn(new wf("You are calling concat on a terminating link, which will have no effect", r)), r;
    var i = xn(t);
    return sr(i) ? new n(function(s) {
      return r.request(s, function(o) {
        return i.request(o) || ee.of();
      }) || ee.of();
    }) : new n(function(s, o) {
      return r.request(s, function(a) {
        return i.request(a, o) || ee.of();
      }) || ee.of();
    });
  }, n.prototype.split = function(e, t, r) {
    return this.concat(n.split(e, t, r || new n(Ao)));
  }, n.prototype.concat = function(e) {
    return n.concat(this, e);
  }, n.prototype.request = function(e, t) {
    throw __DEV__ ? new ne("request is not implemented") : new ne(19);
  }, n.prototype.onError = function(e, t) {
    if (t && t.error)
      return t.error(e), !1;
    throw e;
  }, n.prototype.setOnError = function(e) {
    return this.onError = e, this;
  }, n;
}(), Io = Qe.from, _f = Qe.split, Li = Qe.execute, Ef = "3.5.10", Oo = Object.prototype.hasOwnProperty;
function Sf(n) {
  return function(e) {
    return e.text().then(function(t) {
      try {
        return JSON.parse(t);
      } catch (i) {
        var r = i;
        throw r.name = "ServerParseError", r.response = e, r.statusCode = e.status, r.bodyText = t, r;
      }
    }).then(function(t) {
      return e.status >= 300 && To(e, t, "Response not successful: Received status code ".concat(e.status)), !Array.isArray(t) && !Oo.call(t, "data") && !Oo.call(t, "errors") && To(e, t, "Server response was missing for query '".concat(Array.isArray(n) ? n.map(function(r) {
        return r.operationName;
      }) : n.operationName, "'.")), t;
    });
  };
}
var Ui = function(n, e) {
  var t;
  try {
    t = JSON.stringify(n);
  } catch (i) {
    var r = __DEV__ ? new ne("Network request failed. ".concat(e, " is not serializable: ").concat(i.message)) : new ne(21);
    throw r.parseError = i, r;
  }
  return t;
}, kf = {
  includeQuery: !0,
  includeExtensions: !1
}, xf = {
  accept: "*/*",
  "content-type": "application/json"
}, Tf = {
  method: "POST"
}, Af = {
  http: kf,
  headers: xf,
  options: Tf
}, If = function(n, e) {
  return e(n);
};
function Of(n, e) {
  for (var t = [], r = 2; r < arguments.length; r++)
    t[r - 2] = arguments[r];
  var i = {}, s = {};
  t.forEach(function(d) {
    i = x(x(x({}, i), d.options), { headers: x(x({}, i.headers), Cf(d.headers)) }), d.credentials && (i.credentials = d.credentials), s = x(x({}, s), d.http);
  });
  var o = n.operationName, a = n.extensions, l = n.variables, c = n.query, u = { operationName: o, variables: l };
  return s.includeExtensions && (u.extensions = a), s.includeQuery && (u.query = e(c, ss)), {
    options: i,
    body: u
  };
}
function Cf(n) {
  if (n) {
    var e = /* @__PURE__ */ Object.create(null);
    return Object.keys(Object(n)).forEach(function(t) {
      e[t.toLowerCase()] = n[t];
    }), e;
  }
  return n;
}
var Rf = function(n) {
  if (!n && typeof fetch > "u")
    throw __DEV__ ? new ne(`
"fetch" has not been found globally and no fetcher has been configured. To fix this, install a fetch package (like https://www.npmjs.com/package/cross-fetch), instantiate the fetcher, and pass it into your HttpLink constructor. For example:

import fetch from 'cross-fetch';
import { ApolloClient, HttpLink } from '@apollo/client';
const client = new ApolloClient({
  link: new HttpLink({ uri: '/graphql', fetch })
});
    `) : new ne(20);
}, Nf = function() {
  if (typeof AbortController > "u")
    return { controller: !1, signal: !1 };
  var n = new AbortController(), e = n.signal;
  return { controller: n, signal: e };
}, Df = function(n, e) {
  var t = n.getContext(), r = t.uri;
  return r || (typeof e == "function" ? e(n) : e || "/graphql");
};
function Mf(n, e) {
  var t = [], r = function(d, p) {
    t.push("".concat(d, "=").concat(encodeURIComponent(p)));
  };
  if ("query" in e && r("query", e.query), e.operationName && r("operationName", e.operationName), e.variables) {
    var i = void 0;
    try {
      i = Ui(e.variables, "Variables map");
    } catch (d) {
      return { parseError: d };
    }
    r("variables", i);
  }
  if (e.extensions) {
    var s = void 0;
    try {
      s = Ui(e.extensions, "Extensions map");
    } catch (d) {
      return { parseError: d };
    }
    r("extensions", s);
  }
  var o = "", a = n, l = n.indexOf("#");
  l !== -1 && (o = n.substr(l), a = n.substr(0, l));
  var c = a.indexOf("?") === -1 ? "?" : "&", u = a + c + t.join("&") + o;
  return { newURI: u };
}
var Co = ht(function() {
  return fetch;
}), fu = function(n) {
  n === void 0 && (n = {});
  var e = n.uri, t = e === void 0 ? "/graphql" : e, r = n.fetch, i = n.print, s = i === void 0 ? If : i, o = n.includeExtensions, a = n.useGETForQueries, l = n.includeUnusedVariables, c = l === void 0 ? !1 : l, u = qt(n, ["uri", "fetch", "print", "includeExtensions", "useGETForQueries", "includeUnusedVariables"]);
  __DEV__ && Rf(r || Co);
  var d = {
    http: { includeExtensions: o },
    options: u.fetchOptions,
    credentials: u.credentials,
    headers: u.headers
  };
  return new Qe(function(p) {
    var m = Df(p, t), v = p.getContext(), w = {};
    if (v.clientAwareness) {
      var _ = v.clientAwareness, E = _.name, T = _.version;
      E && (w["apollographql-client-name"] = E), T && (w["apollographql-client-version"] = T);
    }
    var I = x(x({}, w), v.headers), A = {
      http: v.http,
      options: v.fetchOptions,
      credentials: v.credentials,
      headers: I
    }, R = Of(p, s, Af, d, A), N = R.options, M = R.body;
    if (M.variables && !c) {
      var B = new Set(Object.keys(M.variables));
      st(p.query, {
        Variable: function(P, Q, j) {
          j && j.kind !== "VariableDefinition" && B.delete(P.name.value);
        }
      }), B.size && (M.variables = x({}, M.variables), B.forEach(function(P) {
        delete M.variables[P];
      }));
    }
    var q;
    if (!N.signal) {
      var z = Nf(), Y = z.controller, Te = z.signal;
      q = Y, q && (N.signal = Te);
    }
    var Ge = function(P) {
      return P.kind === "OperationDefinition" && P.operation === "mutation";
    };
    if (a && !p.query.definitions.some(Ge) && (N.method = "GET"), N.method === "GET") {
      var Pe = Mf(m, M), V = Pe.newURI, X = Pe.parseError;
      if (X)
        return xo(X);
      m = V;
    } else
      try {
        N.body = Ui(M, "Payload");
      } catch (P) {
        return xo(P);
      }
    return new ee(function(P) {
      var Q = r || ht(function() {
        return fetch;
      }) || Co;
      return Q(m, N).then(function(j) {
        return p.setContext({ response: j }), j;
      }).then(Sf(p)).then(function(j) {
        return P.next(j), P.complete(), j;
      }).catch(function(j) {
        j.name !== "AbortError" && (j.result && j.result.errors && j.result.data && P.next(j.result), P.error(j));
      }), function() {
        q && q.abort();
      };
    });
  });
}, Ff = function(n) {
  Ve(e, n);
  function e(t) {
    t === void 0 && (t = {});
    var r = n.call(this, fu(t).request) || this;
    return r.options = t, r;
  }
  return e;
}(Qe);
const { toString: Ro, hasOwnProperty: $f } = Object.prototype, No = Function.prototype.toString, qi = /* @__PURE__ */ new Map();
function Se(n, e) {
  try {
    return ji(n, e);
  } finally {
    qi.clear();
  }
}
function ji(n, e) {
  if (n === e)
    return !0;
  const t = Ro.call(n), r = Ro.call(e);
  if (t !== r)
    return !1;
  switch (t) {
    case "[object Array]":
      if (n.length !== e.length)
        return !1;
    case "[object Object]": {
      if (Mo(n, e))
        return !0;
      const i = Do(n), s = Do(e), o = i.length;
      if (o !== s.length)
        return !1;
      for (let a = 0; a < o; ++a)
        if (!$f.call(e, i[a]))
          return !1;
      for (let a = 0; a < o; ++a) {
        const l = i[a];
        if (!ji(n[l], e[l]))
          return !1;
      }
      return !0;
    }
    case "[object Error]":
      return n.name === e.name && n.message === e.message;
    case "[object Number]":
      if (n !== n)
        return e !== e;
    case "[object Boolean]":
    case "[object Date]":
      return +n == +e;
    case "[object RegExp]":
    case "[object String]":
      return n == `${e}`;
    case "[object Map]":
    case "[object Set]": {
      if (n.size !== e.size)
        return !1;
      if (Mo(n, e))
        return !0;
      const i = n.entries(), s = t === "[object Map]";
      for (; ; ) {
        const o = i.next();
        if (o.done)
          break;
        const [a, l] = o.value;
        if (!e.has(a) || s && !ji(l, e.get(a)))
          return !1;
      }
      return !0;
    }
    case "[object Uint16Array]":
    case "[object Uint8Array]":
    case "[object Uint32Array]":
    case "[object Int32Array]":
    case "[object Int8Array]":
    case "[object Int16Array]":
    case "[object ArrayBuffer]":
      n = new Uint8Array(n), e = new Uint8Array(e);
    case "[object DataView]": {
      let i = n.byteLength;
      if (i === e.byteLength)
        for (; i-- && n[i] === e[i]; )
          ;
      return i === -1;
    }
    case "[object AsyncFunction]":
    case "[object GeneratorFunction]":
    case "[object AsyncGeneratorFunction]":
    case "[object Function]": {
      const i = No.call(n);
      return i !== No.call(e) ? !1 : !Lf(i, Pf);
    }
  }
  return !1;
}
function Do(n) {
  return Object.keys(n).filter(Bf, n);
}
function Bf(n) {
  return this[n] !== void 0;
}
const Pf = "{ [native code] }";
function Lf(n, e) {
  const t = n.length - e.length;
  return t >= 0 && n.indexOf(e, t) === t;
}
function Mo(n, e) {
  let t = qi.get(n);
  if (t) {
    if (t.has(e))
      return !0;
  } else
    qi.set(n, t = /* @__PURE__ */ new Set());
  return t.add(e), !1;
}
const Uf = () => /* @__PURE__ */ Object.create(null), { forEach: qf, slice: jf } = Array.prototype, { hasOwnProperty: Vf } = Object.prototype;
let Qf = class pu {
  constructor(e = !0, t = Uf) {
    this.weakness = e, this.makeData = t;
  }
  lookup(...e) {
    return this.lookupArray(e);
  }
  lookupArray(e) {
    let t = this;
    return qf.call(e, (r) => t = t.getChildTrie(r)), Vf.call(t, "data") ? t.data : t.data = this.makeData(jf.call(e));
  }
  peek(...e) {
    return this.peekArray(e);
  }
  peekArray(e) {
    let t = this;
    for (let r = 0, i = e.length; t && r < i; ++r) {
      const s = this.weakness && Fo(e[r]) ? t.weak : t.strong;
      t = s && s.get(e[r]);
    }
    return t && t.data;
  }
  getChildTrie(e) {
    const t = this.weakness && Fo(e) ? this.weak || (this.weak = /* @__PURE__ */ new WeakMap()) : this.strong || (this.strong = /* @__PURE__ */ new Map());
    let r = t.get(e);
    return r || t.set(e, r = new pu(this.weakness, this.makeData)), r;
  }
};
function Fo(n) {
  switch (typeof n) {
    case "object":
      if (n === null)
        break;
    case "function":
      return !0;
  }
  return !1;
}
let ke = null;
const $o = {};
let Hf = 1;
const Wf = () => class {
  constructor() {
    this.id = [
      "slot",
      Hf++,
      Date.now(),
      Math.random().toString(36).slice(2)
    ].join(":");
  }
  hasValue() {
    for (let e = ke; e; e = e.parent)
      if (this.id in e.slots) {
        const t = e.slots[this.id];
        if (t === $o)
          break;
        return e !== ke && (ke.slots[this.id] = t), !0;
      }
    return ke && (ke.slots[this.id] = $o), !1;
  }
  getValue() {
    if (this.hasValue())
      return ke.slots[this.id];
  }
  withValue(e, t, r, i) {
    const s = {
      __proto__: null,
      [this.id]: e
    }, o = ke;
    ke = { parent: o, slots: s };
    try {
      return t.apply(i, r);
    } finally {
      ke = o;
    }
  }
  // Capture the current context and wrap a callback function so that it
  // reestablishes the captured context when called.
  static bind(e) {
    const t = ke;
    return function() {
      const r = ke;
      try {
        return ke = t, e.apply(this, arguments);
      } finally {
        ke = r;
      }
    };
  }
  // Immediately run a callback function without any captured context.
  static noContext(e, t, r) {
    if (ke) {
      const i = ke;
      try {
        return ke = null, e.apply(r, t);
      } finally {
        ke = i;
      }
    } else
      return e.apply(r, t);
  }
};
function Bo(n) {
  try {
    return n();
  } catch {
  }
}
const oi = "@wry/context:Slot", Kf = (
  // Prefer globalThis when available.
  // https://github.com/benjamn/wryware/issues/347
  Bo(() => globalThis) || // Fall back to global, which works in Node.js and may be converted by some
  // bundlers to the appropriate identifier (window, self, ...) depending on the
  // bundling target. https://github.com/endojs/endo/issues/576#issuecomment-1178515224
  Bo(() => rt) || // Otherwise, use a dummy host that's local to this module. We used to fall
  // back to using the Array constructor as a namespace, but that was flagged in
  // https://github.com/benjamn/wryware/issues/347, and can be avoided.
  /* @__PURE__ */ Object.create(null)
), Po = Kf, zf = Po[oi] || // Earlier versions of this package stored the globalKey property on the Array
// constructor, so we check there as well, to prevent Slot class duplication.
Array[oi] || function(n) {
  try {
    Object.defineProperty(Po, oi, {
      value: n,
      enumerable: !1,
      writable: !1,
      // When it was possible for globalHost to be the Array constructor (a
      // legacy Slot dedup strategy), it was important for the property to be
      // configurable:true so it could be deleted. That does not seem to be as
      // important when globalHost is the global object, but I don't want to
      // cause similar problems again, and configurable:true seems safest.
      // https://github.com/endojs/endo/issues/576#issuecomment-1178274008
      configurable: !0
    });
  } finally {
    return n;
  }
}(Wf());
function Gf() {
}
var Jf = (
  /** @class */
  function() {
    function n(e, t) {
      e === void 0 && (e = 1 / 0), t === void 0 && (t = Gf), this.max = e, this.dispose = t, this.map = /* @__PURE__ */ new Map(), this.newest = null, this.oldest = null;
    }
    return n.prototype.has = function(e) {
      return this.map.has(e);
    }, n.prototype.get = function(e) {
      var t = this.getNode(e);
      return t && t.value;
    }, n.prototype.getNode = function(e) {
      var t = this.map.get(e);
      if (t && t !== this.newest) {
        var r = t.older, i = t.newer;
        i && (i.older = r), r && (r.newer = i), t.older = this.newest, t.older.newer = t, t.newer = null, this.newest = t, t === this.oldest && (this.oldest = i);
      }
      return t;
    }, n.prototype.set = function(e, t) {
      var r = this.getNode(e);
      return r ? r.value = t : (r = {
        key: e,
        value: t,
        newer: null,
        older: this.newest
      }, this.newest && (this.newest.newer = r), this.newest = r, this.oldest = this.oldest || r, this.map.set(e, r), r.value);
    }, n.prototype.clean = function() {
      for (; this.oldest && this.map.size > this.max; )
        this.delete(this.oldest.key);
    }, n.prototype.delete = function(e) {
      var t = this.map.get(e);
      return t ? (t === this.newest && (this.newest = t.older), t === this.oldest && (this.oldest = t.newer), t.newer && (t.newer.older = t.older), t.older && (t.older.newer = t.newer), this.map.delete(e), this.dispose(t.value, e), !0) : !1;
    }, n;
  }()
), Ur = new zf(), ai, Yf = Object.prototype.hasOwnProperty, ys = (ai = Array.from, ai === void 0 ? function(n) {
  var e = [];
  return n.forEach(function(t) {
    return e.push(t);
  }), e;
} : ai);
function ms(n) {
  var e = n.unsubscribe;
  typeof e == "function" && (n.unsubscribe = void 0, e());
}
var jn = [], Xf = 100;
function hn(n, e) {
  if (!n)
    throw new Error(e || "assertion failure");
}
function Zf(n, e) {
  var t = n.length;
  return (
    // Unknown values are not equal to each other.
    t > 0 && // Both values must be ordinary (or both exceptional) to be equal.
    t === e.length && // The underlying value or exception must be the same.
    n[t - 1] === e[t - 1]
  );
}
function du(n) {
  switch (n.length) {
    case 0:
      throw new Error("unknown value");
    case 1:
      return n[0];
    case 2:
      throw n[1];
  }
}
function ep(n) {
  return n.slice(0);
}
var tp = (
  /** @class */
  function() {
    function n(e) {
      this.fn = e, this.parents = /* @__PURE__ */ new Set(), this.childValues = /* @__PURE__ */ new Map(), this.dirtyChildren = null, this.dirty = !0, this.recomputing = !1, this.value = [], this.deps = null, ++n.count;
    }
    return n.prototype.peek = function() {
      if (this.value.length === 1 && !xt(this))
        return Lo(this), this.value[0];
    }, n.prototype.recompute = function(e) {
      return hn(!this.recomputing, "already recomputing"), Lo(this), xt(this) ? np(this, e) : du(this.value);
    }, n.prototype.setDirty = function() {
      this.dirty || (this.dirty = !0, this.value.length = 0, yu(this), ms(this));
    }, n.prototype.dispose = function() {
      var e = this;
      this.setDirty(), wu(this), gs(this, function(t, r) {
        t.setDirty(), _u(t, e);
      });
    }, n.prototype.forget = function() {
      this.dispose();
    }, n.prototype.dependOn = function(e) {
      e.add(this), this.deps || (this.deps = jn.pop() || /* @__PURE__ */ new Set()), this.deps.add(e);
    }, n.prototype.forgetDeps = function() {
      var e = this;
      this.deps && (ys(this.deps).forEach(function(t) {
        return t.delete(e);
      }), this.deps.clear(), jn.push(this.deps), this.deps = null);
    }, n.count = 0, n;
  }()
);
function Lo(n) {
  var e = Ur.getValue();
  if (e)
    return n.parents.add(e), e.childValues.has(n) || e.childValues.set(n, []), xt(n) ? gu(e, n) : vu(e, n), e;
}
function np(n, e) {
  return wu(n), Ur.withValue(n, rp, [n, e]), sp(n, e) && ip(n), du(n.value);
}
function rp(n, e) {
  n.recomputing = !0, n.value.length = 0;
  try {
    n.value[0] = n.fn.apply(null, e);
  } catch (t) {
    n.value[1] = t;
  }
  n.recomputing = !1;
}
function xt(n) {
  return n.dirty || !!(n.dirtyChildren && n.dirtyChildren.size);
}
function ip(n) {
  n.dirty = !1, !xt(n) && mu(n);
}
function yu(n) {
  gs(n, gu);
}
function mu(n) {
  gs(n, vu);
}
function gs(n, e) {
  var t = n.parents.size;
  if (t)
    for (var r = ys(n.parents), i = 0; i < t; ++i)
      e(r[i], n);
}
function gu(n, e) {
  hn(n.childValues.has(e)), hn(xt(e));
  var t = !xt(n);
  if (!n.dirtyChildren)
    n.dirtyChildren = jn.pop() || /* @__PURE__ */ new Set();
  else if (n.dirtyChildren.has(e))
    return;
  n.dirtyChildren.add(e), t && yu(n);
}
function vu(n, e) {
  hn(n.childValues.has(e)), hn(!xt(e));
  var t = n.childValues.get(e);
  t.length === 0 ? n.childValues.set(e, ep(e.value)) : Zf(t, e.value) || n.setDirty(), bu(n, e), !xt(n) && mu(n);
}
function bu(n, e) {
  var t = n.dirtyChildren;
  t && (t.delete(e), t.size === 0 && (jn.length < Xf && jn.push(t), n.dirtyChildren = null));
}
function wu(n) {
  n.childValues.size > 0 && n.childValues.forEach(function(e, t) {
    _u(n, t);
  }), n.forgetDeps(), hn(n.dirtyChildren === null);
}
function _u(n, e) {
  e.parents.delete(n), n.childValues.delete(e), bu(n, e);
}
function sp(n, e) {
  if (typeof n.subscribe == "function")
    try {
      ms(n), n.unsubscribe = n.subscribe.apply(null, e);
    } catch {
      return n.setDirty(), !1;
    }
  return !0;
}
var op = {
  setDirty: !0,
  dispose: !0,
  forget: !0
  // Fully remove parent Entry from LRU cache and computation graph
};
function Eu(n) {
  var e = /* @__PURE__ */ new Map();
  function t(r) {
    var i = Ur.getValue();
    if (i) {
      var s = e.get(r);
      s || e.set(r, s = /* @__PURE__ */ new Set()), i.dependOn(s);
    }
  }
  return t.dirty = function(i, s) {
    var o = e.get(i);
    if (o) {
      var a = s && Yf.call(op, s) ? s : "setDirty";
      ys(o).forEach(function(l) {
        return l[a]();
      }), e.delete(i), ms(o);
    }
  }, t;
}
function ap() {
  var n = new Qf(typeof WeakMap == "function");
  return function() {
    return n.lookupArray(arguments);
  };
}
var ui = /* @__PURE__ */ new Set();
function Tr(n, e) {
  e === void 0 && (e = /* @__PURE__ */ Object.create(null));
  var t = new Jf(e.max || Math.pow(2, 16), function(c) {
    return c.dispose();
  }), r = e.keyArgs, i = e.makeCacheKey || ap(), s = function() {
    var c = i.apply(null, r ? r.apply(null, arguments) : arguments);
    if (c === void 0)
      return n.apply(null, arguments);
    var u = t.get(c);
    u || (t.set(c, u = new tp(n)), u.subscribe = e.subscribe, u.forget = function() {
      return t.delete(c);
    });
    var d = u.recompute(Array.prototype.slice.call(arguments));
    return t.set(c, u), ui.add(t), Ur.hasValue() || (ui.forEach(function(p) {
      return p.clean();
    }), ui.clear()), d;
  };
  Object.defineProperty(s, "size", {
    get: function() {
      return t.map.size;
    },
    configurable: !1,
    enumerable: !1
  });
  function o(c) {
    var u = t.get(c);
    u && u.setDirty();
  }
  s.dirtyKey = o, s.dirty = function() {
    o(i.apply(null, arguments));
  };
  function a(c) {
    var u = t.get(c);
    if (u)
      return u.peek();
  }
  s.peekKey = a, s.peek = function() {
    return a(i.apply(null, arguments));
  };
  function l(c) {
    return t.delete(c);
  }
  return s.forgetKey = l, s.forget = function() {
    return l(i.apply(null, arguments));
  }, s.makeCacheKey = i, s.getKey = r ? function() {
    return i.apply(null, r.apply(null, arguments));
  } : i, Object.freeze(s);
}
var up = function() {
  function n() {
    this.getFragmentDoc = Tr(Nh);
  }
  return n.prototype.batch = function(e) {
    var t = this, r = typeof e.optimistic == "string" ? e.optimistic : e.optimistic === !1 ? null : void 0, i;
    return this.performTransaction(function() {
      return i = e.update(t);
    }, r), i;
  }, n.prototype.recordOptimisticTransaction = function(e, t) {
    this.performTransaction(e, t);
  }, n.prototype.transformDocument = function(e) {
    return e;
  }, n.prototype.identify = function(e) {
  }, n.prototype.gc = function() {
    return [];
  }, n.prototype.modify = function(e) {
    return !1;
  }, n.prototype.transformForLink = function(e) {
    return e;
  }, n.prototype.readQuery = function(e, t) {
    return t === void 0 && (t = !!e.optimistic), this.read(x(x({}, e), { rootId: e.id || "ROOT_QUERY", optimistic: t }));
  }, n.prototype.readFragment = function(e, t) {
    return t === void 0 && (t = !!e.optimistic), this.read(x(x({}, e), { query: this.getFragmentDoc(e.fragment, e.fragmentName), rootId: e.id, optimistic: t }));
  }, n.prototype.writeQuery = function(e) {
    var t = e.id, r = e.data, i = qt(e, ["id", "data"]);
    return this.write(Object.assign(i, {
      dataId: t || "ROOT_QUERY",
      result: r
    }));
  }, n.prototype.writeFragment = function(e) {
    var t = e.id, r = e.data, i = e.fragment, s = e.fragmentName, o = qt(e, ["id", "data", "fragment", "fragmentName"]);
    return this.write(Object.assign(o, {
      query: this.getFragmentDoc(i, s),
      dataId: t,
      result: r
    }));
  }, n.prototype.updateQuery = function(e, t) {
    return this.batch({
      update: function(r) {
        var i = r.readQuery(e), s = t(i);
        return s == null ? i : (r.writeQuery(x(x({}, e), { data: s })), s);
      }
    });
  }, n.prototype.updateFragment = function(e, t) {
    return this.batch({
      update: function(r) {
        var i = r.readFragment(e), s = t(i);
        return s == null ? i : (r.writeFragment(x(x({}, e), { data: s })), s);
      }
    });
  }, n;
}(), Su = /* @__PURE__ */ function() {
  function n(e, t, r, i) {
    this.message = e, this.path = t, this.query = r, this.variables = i;
  }
  return n;
}(), cp = function() {
  return /* @__PURE__ */ Object.create(null);
}, ku = Array.prototype, lp = ku.forEach, hp = ku.slice, qr = (
  /** @class */
  function() {
    function n(e, t) {
      e === void 0 && (e = !0), t === void 0 && (t = cp), this.weakness = e, this.makeData = t;
    }
    return n.prototype.lookup = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      return this.lookupArray(e);
    }, n.prototype.lookupArray = function(e) {
      var t = this;
      return lp.call(e, function(r) {
        return t = t.getChildTrie(r);
      }), t.data || (t.data = this.makeData(hp.call(e)));
    }, n.prototype.getChildTrie = function(e) {
      var t = this.weakness && fp(e) ? this.weak || (this.weak = /* @__PURE__ */ new WeakMap()) : this.strong || (this.strong = /* @__PURE__ */ new Map()), r = t.get(e);
      return r || t.set(e, r = new n(this.weakness, this.makeData)), r;
    }, n;
  }()
);
function fp(n) {
  switch (typeof n) {
    case "object":
      if (n === null)
        break;
    case "function":
      return !0;
  }
  return !1;
}
var _e = Object.prototype.hasOwnProperty;
function xu(n, e) {
  var t = n.__typename, r = n.id, i = n._id;
  if (typeof t == "string" && (e && (e.keyObject = r !== void 0 ? { id: r } : i !== void 0 ? { _id: i } : void 0), r === void 0 && (r = i), r !== void 0))
    return "".concat(t, ":").concat(typeof r == "number" || typeof r == "string" ? r : JSON.stringify(r));
}
var Tu = {
  dataIdFromObject: xu,
  addTypename: !0,
  resultCaching: !0,
  canonizeResults: !1
};
function pp(n) {
  return qn(Tu, n);
}
function Au(n) {
  var e = n.canonizeResults;
  return e === void 0 ? Tu.canonizeResults : e;
}
function dp(n, e) {
  return Z(e) ? n.get(e.__ref, "__typename") : e && e.__typename;
}
var Iu = /^[_a-z][_0-9a-z]*/i;
function Tt(n) {
  var e = n.match(Iu);
  return e ? e[0] : n;
}
function Vi(n, e, t) {
  return ue(e) ? de(e) ? e.every(function(r) {
    return Vi(n, r, t);
  }) : n.selections.every(function(r) {
    if (gt(r) && Fr(r, t)) {
      var i = Vt(r);
      return _e.call(e, i) && (!r.selectionSet || Vi(r.selectionSet, e[i], t));
    }
    return !0;
  }) : !1;
}
function en(n) {
  return ue(n) && !Z(n) && !de(n);
}
function yp() {
  return new Jn();
}
var de = function(n) {
  return Array.isArray(n);
}, gr = /* @__PURE__ */ Object.create(null), ci = function() {
  return gr;
}, Uo = /* @__PURE__ */ Object.create(null), jr = function() {
  function n(e, t) {
    var r = this;
    this.policies = e, this.group = t, this.data = /* @__PURE__ */ Object.create(null), this.rootIds = /* @__PURE__ */ Object.create(null), this.refs = /* @__PURE__ */ Object.create(null), this.getFieldValue = function(i, s) {
      return Bi(Z(i) ? r.get(i.__ref, s) : i && i[s]);
    }, this.canRead = function(i) {
      return Z(i) ? r.has(i.__ref) : typeof i == "object";
    }, this.toReference = function(i, s) {
      if (typeof i == "string")
        return sn(i);
      if (Z(i))
        return i;
      var o = r.policies.identify(i)[0];
      if (o) {
        var a = sn(o);
        return s && r.merge(o, i), a;
      }
    };
  }
  return n.prototype.toObject = function() {
    return x({}, this.data);
  }, n.prototype.has = function(e) {
    return this.lookup(e, !0) !== void 0;
  }, n.prototype.get = function(e, t) {
    if (this.group.depend(e, t), _e.call(this.data, e)) {
      var r = this.data[e];
      if (r && _e.call(r, t))
        return r[t];
    }
    if (t === "__typename" && _e.call(this.policies.rootTypenamesById, e))
      return this.policies.rootTypenamesById[e];
    if (this instanceof wt)
      return this.parent.get(e, t);
  }, n.prototype.lookup = function(e, t) {
    if (t && this.group.depend(e, "__exists"), _e.call(this.data, e))
      return this.data[e];
    if (this instanceof wt)
      return this.parent.lookup(e, t);
    if (this.policies.rootTypenamesById[e])
      return /* @__PURE__ */ Object.create(null);
  }, n.prototype.merge = function(e, t) {
    var r = this, i;
    Z(e) && (e = e.__ref), Z(t) && (t = t.__ref);
    var s = typeof e == "string" ? this.lookup(i = e) : e, o = typeof t == "string" ? this.lookup(i = t) : t;
    if (o) {
      __DEV__ ? D(typeof i == "string", "store.merge expects a string ID") : D(typeof i == "string", 1);
      var a = new Jn(gp).merge(s, o);
      if (this.data[i] = a, a !== s && (delete this.refs[i], this.group.caching)) {
        var l = /* @__PURE__ */ Object.create(null);
        s || (l.__exists = 1), Object.keys(o).forEach(function(c) {
          if (!s || s[c] !== a[c]) {
            l[c] = 1;
            var u = Tt(c);
            u !== c && !r.policies.hasKeyArgs(a.__typename, u) && (l[u] = 1), a[c] === void 0 && !(r instanceof wt) && delete a[c];
          }
        }), l.__typename && !(s && s.__typename) && this.policies.rootTypenamesById[i] === a.__typename && delete l.__typename, Object.keys(l).forEach(function(c) {
          return r.group.dirty(i, c);
        });
      }
    }
  }, n.prototype.modify = function(e, t) {
    var r = this, i = this.lookup(e);
    if (i) {
      var s = /* @__PURE__ */ Object.create(null), o = !1, a = !0, l = {
        DELETE: gr,
        INVALIDATE: Uo,
        isReference: Z,
        toReference: this.toReference,
        canRead: this.canRead,
        readField: function(c, u) {
          return r.policies.readField(typeof c == "string" ? {
            fieldName: c,
            from: u || sn(e)
          } : c, { store: r });
        }
      };
      if (Object.keys(i).forEach(function(c) {
        var u = Tt(c), d = i[c];
        if (d !== void 0) {
          var p = typeof t == "function" ? t : t[c] || t[u];
          if (p) {
            var m = p === ci ? gr : p(Bi(d), x(x({}, l), { fieldName: u, storeFieldName: c, storage: r.getStorage(e, c) }));
            m === Uo ? r.group.dirty(e, c) : (m === gr && (m = void 0), m !== d && (s[c] = m, o = !0, d = m));
          }
          d !== void 0 && (a = !1);
        }
      }), o)
        return this.merge(e, s), a && (this instanceof wt ? this.data[e] = void 0 : delete this.data[e], this.group.dirty(e, "__exists")), !0;
    }
    return !1;
  }, n.prototype.delete = function(e, t, r) {
    var i, s = this.lookup(e);
    if (s) {
      var o = this.getFieldValue(s, "__typename"), a = t && r ? this.policies.getStoreFieldName({ typename: o, fieldName: t, args: r }) : t;
      return this.modify(e, a ? (i = {}, i[a] = ci, i) : ci);
    }
    return !1;
  }, n.prototype.evict = function(e, t) {
    var r = !1;
    return e.id && (_e.call(this.data, e.id) && (r = this.delete(e.id, e.fieldName, e.args)), this instanceof wt && this !== t && (r = this.parent.evict(e, t) || r), (e.fieldName || r) && this.group.dirty(e.id, e.fieldName || "__exists")), r;
  }, n.prototype.clear = function() {
    this.replace(null);
  }, n.prototype.extract = function() {
    var e = this, t = this.toObject(), r = [];
    return this.getRootIdSet().forEach(function(i) {
      _e.call(e.policies.rootTypenamesById, i) || r.push(i);
    }), r.length && (t.__META = { extraRootIds: r.sort() }), t;
  }, n.prototype.replace = function(e) {
    var t = this;
    if (Object.keys(this.data).forEach(function(s) {
      e && _e.call(e, s) || t.delete(s);
    }), e) {
      var r = e.__META, i = qt(e, ["__META"]);
      Object.keys(i).forEach(function(s) {
        t.merge(s, i[s]);
      }), r && r.extraRootIds.forEach(this.retain, this);
    }
  }, n.prototype.retain = function(e) {
    return this.rootIds[e] = (this.rootIds[e] || 0) + 1;
  }, n.prototype.release = function(e) {
    if (this.rootIds[e] > 0) {
      var t = --this.rootIds[e];
      return t || delete this.rootIds[e], t;
    }
    return 0;
  }, n.prototype.getRootIdSet = function(e) {
    return e === void 0 && (e = /* @__PURE__ */ new Set()), Object.keys(this.rootIds).forEach(e.add, e), this instanceof wt ? this.parent.getRootIdSet(e) : Object.keys(this.policies.rootTypenamesById).forEach(e.add, e), e;
  }, n.prototype.gc = function() {
    var e = this, t = this.getRootIdSet(), r = this.toObject();
    t.forEach(function(o) {
      _e.call(r, o) && (Object.keys(e.findChildRefIds(o)).forEach(t.add, t), delete r[o]);
    });
    var i = Object.keys(r);
    if (i.length) {
      for (var s = this; s instanceof wt; )
        s = s.parent;
      i.forEach(function(o) {
        return s.delete(o);
      });
    }
    return i;
  }, n.prototype.findChildRefIds = function(e) {
    if (!_e.call(this.refs, e)) {
      var t = this.refs[e] = /* @__PURE__ */ Object.create(null), r = this.data[e];
      if (!r)
        return t;
      var i = /* @__PURE__ */ new Set([r]);
      i.forEach(function(s) {
        Z(s) && (t[s.__ref] = !0), ue(s) && Object.keys(s).forEach(function(o) {
          var a = s[o];
          ue(a) && i.add(a);
        });
      });
    }
    return this.refs[e];
  }, n.prototype.makeCacheKey = function() {
    return this.group.keyMaker.lookupArray(arguments);
  }, n;
}(), Ou = function() {
  function n(e, t) {
    t === void 0 && (t = null), this.caching = e, this.parent = t, this.d = null, this.resetCaching();
  }
  return n.prototype.resetCaching = function() {
    this.d = this.caching ? Eu() : null, this.keyMaker = new qr(Wt);
  }, n.prototype.depend = function(e, t) {
    if (this.d) {
      this.d(li(e, t));
      var r = Tt(t);
      r !== t && this.d(li(e, r)), this.parent && this.parent.depend(e, t);
    }
  }, n.prototype.dirty = function(e, t) {
    this.d && this.d.dirty(li(e, t), t === "__exists" ? "forget" : "setDirty");
  }, n;
}();
function li(n, e) {
  return e + "#" + n;
}
function qo(n, e) {
  Mn(n) && n.group.depend(e, "__exists");
}
(function(n) {
  var e = function(t) {
    Ve(r, t);
    function r(i) {
      var s = i.policies, o = i.resultCaching, a = o === void 0 ? !0 : o, l = i.seed, c = t.call(this, s, new Ou(a)) || this;
      return c.stump = new mp(c), c.storageTrie = new qr(Wt), l && c.replace(l), c;
    }
    return r.prototype.addLayer = function(i, s) {
      return this.stump.addLayer(i, s);
    }, r.prototype.removeLayer = function() {
      return this;
    }, r.prototype.getStorage = function() {
      return this.storageTrie.lookupArray(arguments);
    }, r;
  }(n);
  n.Root = e;
})(jr);
var wt = function(n) {
  Ve(e, n);
  function e(t, r, i, s) {
    var o = n.call(this, r.policies, s) || this;
    return o.id = t, o.parent = r, o.replay = i, o.group = s, i(o), o;
  }
  return e.prototype.addLayer = function(t, r) {
    return new e(t, this, r, this.group);
  }, e.prototype.removeLayer = function(t) {
    var r = this, i = this.parent.removeLayer(t);
    return t === this.id ? (this.group.caching && Object.keys(this.data).forEach(function(s) {
      var o = r.data[s], a = i.lookup(s);
      a ? o ? o !== a && Object.keys(o).forEach(function(l) {
        Se(o[l], a[l]) || r.group.dirty(s, l);
      }) : (r.group.dirty(s, "__exists"), Object.keys(a).forEach(function(l) {
        r.group.dirty(s, l);
      })) : r.delete(s);
    }), i) : i === this.parent ? this : i.addLayer(this.id, this.replay);
  }, e.prototype.toObject = function() {
    return x(x({}, this.parent.toObject()), this.data);
  }, e.prototype.findChildRefIds = function(t) {
    var r = this.parent.findChildRefIds(t);
    return _e.call(this.data, t) ? x(x({}, r), n.prototype.findChildRefIds.call(this, t)) : r;
  }, e.prototype.getStorage = function() {
    for (var t = this.parent; t.parent; )
      t = t.parent;
    return t.getStorage.apply(t, arguments);
  }, e;
}(jr), mp = function(n) {
  Ve(e, n);
  function e(t) {
    return n.call(this, "EntityStore.Stump", t, function() {
    }, new Ou(t.group.caching, t.group)) || this;
  }
  return e.prototype.removeLayer = function() {
    return this;
  }, e.prototype.merge = function() {
    return this.parent.merge.apply(this.parent, arguments);
  }, e;
}(wt);
function gp(n, e, t) {
  var r = n[t], i = e[t];
  return Se(r, i) ? r : i;
}
function Mn(n) {
  return !!(n instanceof jr && n.group.caching);
}
function vp(n) {
  return ue(n) ? de(n) ? n.slice(0) : x({ __proto__: Object.getPrototypeOf(n) }, n) : n;
}
var Qi = function() {
  function n() {
    this.known = new (df ? WeakSet : Set)(), this.pool = new qr(Wt), this.passes = /* @__PURE__ */ new WeakMap(), this.keysByJSON = /* @__PURE__ */ new Map(), this.empty = this.admit({});
  }
  return n.prototype.isKnown = function(e) {
    return ue(e) && this.known.has(e);
  }, n.prototype.pass = function(e) {
    if (ue(e)) {
      var t = vp(e);
      return this.passes.set(t, e), t;
    }
    return e;
  }, n.prototype.admit = function(e) {
    var t = this;
    if (ue(e)) {
      var r = this.passes.get(e);
      if (r)
        return r;
      var i = Object.getPrototypeOf(e);
      switch (i) {
        case Array.prototype: {
          if (this.known.has(e))
            return e;
          var s = e.map(this.admit, this), o = this.pool.lookupArray(s);
          return o.array || (this.known.add(o.array = s), __DEV__ && Object.freeze(s)), o.array;
        }
        case null:
        case Object.prototype: {
          if (this.known.has(e))
            return e;
          var a = Object.getPrototypeOf(e), l = [a], c = this.sortedKeys(e);
          l.push(c.json);
          var u = l.length;
          c.sorted.forEach(function(m) {
            l.push(t.admit(e[m]));
          });
          var o = this.pool.lookupArray(l);
          if (!o.object) {
            var d = o.object = Object.create(a);
            this.known.add(d), c.sorted.forEach(function(m, v) {
              d[m] = l[u + v];
            }), __DEV__ && Object.freeze(d);
          }
          return o.object;
        }
      }
    }
    return e;
  }, n.prototype.sortedKeys = function(e) {
    var t = Object.keys(e), r = this.pool.lookupArray(t);
    if (!r.keys) {
      t.sort();
      var i = JSON.stringify(t);
      (r.keys = this.keysByJSON.get(i)) || this.keysByJSON.set(i, r.keys = { sorted: t, json: i });
    }
    return r.keys;
  }, n;
}(), Ut = Object.assign(function(n) {
  if (ue(n)) {
    Hi === void 0 && jo();
    var e = Hi.admit(n), t = Wi.get(e);
    return t === void 0 && Wi.set(e, t = JSON.stringify(e)), t;
  }
  return JSON.stringify(n);
}, {
  reset: jo
}), Hi, Wi;
function jo() {
  Hi = new Qi(), Wi = new (Wt ? WeakMap : Map)();
}
function Vo(n) {
  return [
    n.selectionSet,
    n.objectOrReference,
    n.context,
    n.context.canonizeResults
  ];
}
var bp = function() {
  function n(e) {
    var t = this;
    this.knownResults = new (Wt ? WeakMap : Map)(), this.config = qn(e, {
      addTypename: e.addTypename !== !1,
      canonizeResults: Au(e)
    }), this.canon = e.canon || new Qi(), this.executeSelectionSet = Tr(function(r) {
      var i, s = r.context.canonizeResults, o = Vo(r);
      o[3] = !s;
      var a = (i = t.executeSelectionSet).peek.apply(i, o);
      return a ? s ? x(x({}, a), { result: t.canon.admit(a.result) }) : a : (qo(r.context.store, r.enclosingRef.__ref), t.execSelectionSetImpl(r));
    }, {
      max: this.config.resultCacheMaxSize,
      keyArgs: Vo,
      makeCacheKey: function(r, i, s, o) {
        if (Mn(s.store))
          return s.store.makeCacheKey(r, Z(i) ? i.__ref : i, s.varString, o);
      }
    }), this.executeSubSelectedArray = Tr(function(r) {
      return qo(r.context.store, r.enclosingRef.__ref), t.execSubSelectedArrayImpl(r);
    }, {
      max: this.config.resultCacheMaxSize,
      makeCacheKey: function(r) {
        var i = r.field, s = r.array, o = r.context;
        if (Mn(o.store))
          return o.store.makeCacheKey(i, s, o.varString);
      }
    });
  }
  return n.prototype.resetCanon = function() {
    this.canon = new Qi();
  }, n.prototype.diffQueryAgainstStore = function(e) {
    var t = e.store, r = e.query, i = e.rootId, s = i === void 0 ? "ROOT_QUERY" : i, o = e.variables, a = e.returnPartialData, l = a === void 0 ? !0 : a, c = e.canonizeResults, u = c === void 0 ? this.config.canonizeResults : c, d = this.config.cache.policies;
    o = x(x({}, us(nu(r))), o);
    var p = sn(s), m = new Jn(), v = this.executeSelectionSet({
      selectionSet: Lr(r).selectionSet,
      objectOrReference: p,
      enclosingRef: p,
      context: {
        store: t,
        query: r,
        policies: d,
        variables: o,
        varString: Ut(o),
        canonizeResults: u,
        fragmentMap: $r(Pr(r)),
        merge: function(_, E) {
          return m.merge(_, E);
        }
      }
    }), w;
    if (v.missing && (w = [new Su(wp(v.missing), v.missing, r, o)], !l))
      throw w[0];
    return {
      result: v.result,
      complete: !w,
      missing: w
    };
  }, n.prototype.isFresh = function(e, t, r, i) {
    if (Mn(i.store) && this.knownResults.get(e) === r) {
      var s = this.executeSelectionSet.peek(r, t, i, this.canon.isKnown(e));
      if (s && e === s.result)
        return !0;
    }
    return !1;
  }, n.prototype.execSelectionSetImpl = function(e) {
    var t = this, r = e.selectionSet, i = e.objectOrReference, s = e.enclosingRef, o = e.context;
    if (Z(i) && !o.policies.rootTypenamesById[i.__ref] && !o.store.has(i.__ref))
      return {
        result: this.canon.empty,
        missing: "Dangling reference to missing ".concat(i.__ref, " object")
      };
    var a = o.variables, l = o.policies, c = o.store, u = c.getFieldValue(i, "__typename"), d = {}, p;
    this.config.addTypename && typeof u == "string" && !l.rootIdsByTypename[u] && (d = { __typename: u });
    function m(E, T) {
      var I;
      return E.missing && (p = o.merge(p, (I = {}, I[T] = E.missing, I))), E.result;
    }
    var v = new Set(r.selections);
    v.forEach(function(E) {
      var T, I;
      if (Fr(E, a))
        if (gt(E)) {
          var A = l.readField({
            fieldName: E.name.value,
            field: E,
            variables: o.variables,
            from: i
          }, o), R = Vt(E);
          A === void 0 ? ls.added(E) || (p = o.merge(p, (T = {}, T[R] = "Can't find field '".concat(E.name.value, "' on ").concat(Z(i) ? i.__ref + " object" : "object " + JSON.stringify(i, null, 2)), T))) : de(A) ? A = m(t.executeSubSelectedArray({
            field: E,
            array: A,
            enclosingRef: s,
            context: o
          }), R) : E.selectionSet ? A != null && (A = m(t.executeSelectionSet({
            selectionSet: E.selectionSet,
            objectOrReference: A,
            enclosingRef: Z(A) ? A : s,
            context: o
          }), R)) : o.canonizeResults && (A = t.canon.pass(A)), A !== void 0 && (d = o.merge(d, (I = {}, I[R] = A, I)));
        } else {
          var N = os(E, o.fragmentMap);
          N && l.fragmentMatches(N, u) && N.selectionSet.selections.forEach(v.add, v);
        }
    });
    var w = { result: d, missing: p }, _ = o.canonizeResults ? this.canon.admit(w) : Bi(w);
    return _.result && this.knownResults.set(_.result, r), _;
  }, n.prototype.execSubSelectedArrayImpl = function(e) {
    var t = this, r = e.field, i = e.array, s = e.enclosingRef, o = e.context, a;
    function l(c, u) {
      var d;
      return c.missing && (a = o.merge(a, (d = {}, d[u] = c.missing, d))), c.result;
    }
    return r.selectionSet && (i = i.filter(o.store.canRead)), i = i.map(function(c, u) {
      return c === null ? null : de(c) ? l(t.executeSubSelectedArray({
        field: r,
        array: c,
        enclosingRef: s,
        context: o
      }), u) : r.selectionSet ? l(t.executeSelectionSet({
        selectionSet: r.selectionSet,
        objectOrReference: c,
        enclosingRef: Z(c) ? c : s,
        context: o
      }), u) : (__DEV__ && _p(o.store, r, c), c);
    }), {
      result: o.canonizeResults ? this.canon.admit(i) : i,
      missing: a
    };
  }, n;
}();
function wp(n) {
  try {
    JSON.stringify(n, function(e, t) {
      if (typeof t == "string")
        throw t;
      return t;
    });
  } catch (e) {
    return e;
  }
}
function _p(n, e, t) {
  if (!e.selectionSet) {
    var r = /* @__PURE__ */ new Set([t]);
    r.forEach(function(i) {
      ue(i) && (__DEV__ ? D(!Z(i), "Missing selection set for object of type ".concat(dp(n, i), " returned for query field ").concat(e.name.value)) : D(!Z(i), 5), Object.values(i).forEach(r.add, r));
    });
  }
}
var xe = null, Qo = {}, Ep = 1, Sp = function() {
  return (
    /** @class */
    function() {
      function n() {
        this.id = [
          "slot",
          Ep++,
          Date.now(),
          Math.random().toString(36).slice(2)
        ].join(":");
      }
      return n.prototype.hasValue = function() {
        for (var e = xe; e; e = e.parent)
          if (this.id in e.slots) {
            var t = e.slots[this.id];
            if (t === Qo)
              break;
            return e !== xe && (xe.slots[this.id] = t), !0;
          }
        return xe && (xe.slots[this.id] = Qo), !1;
      }, n.prototype.getValue = function() {
        if (this.hasValue())
          return xe.slots[this.id];
      }, n.prototype.withValue = function(e, t, r, i) {
        var s, o = (s = {
          __proto__: null
        }, s[this.id] = e, s), a = xe;
        xe = { parent: a, slots: o };
        try {
          return t.apply(i, r);
        } finally {
          xe = a;
        }
      }, n.bind = function(e) {
        var t = xe;
        return function() {
          var r = xe;
          try {
            return xe = t, e.apply(this, arguments);
          } finally {
            xe = r;
          }
        };
      }, n.noContext = function(e, t, r) {
        if (xe) {
          var i = xe;
          try {
            return xe = null, e.apply(r, t);
          } finally {
            xe = i;
          }
        } else
          return e.apply(r, t);
      }, n;
    }()
  );
}, hi = "@wry/context:Slot", fi = Array, vs = fi[hi] || function() {
  var n = Sp();
  try {
    Object.defineProperty(fi, hi, {
      value: fi[hi] = n,
      enumerable: !1,
      writable: !1,
      configurable: !1
    });
  } finally {
    return n;
  }
}();
vs.bind;
vs.noContext;
var bs = new vs(), Ho = /* @__PURE__ */ new WeakMap();
function Fn(n) {
  var e = Ho.get(n);
  return e || Ho.set(n, e = {
    vars: /* @__PURE__ */ new Set(),
    dep: Eu()
  }), e;
}
function Wo(n) {
  Fn(n).vars.forEach(function(e) {
    return e.forgetCache(n);
  });
}
function kp(n) {
  Fn(n).vars.forEach(function(e) {
    return e.attachCache(n);
  });
}
function xp(n) {
  var e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set(), r = function(s) {
    if (arguments.length > 0) {
      if (n !== s) {
        n = s, e.forEach(function(l) {
          Fn(l).dep.dirty(r), Tp(l);
        });
        var o = Array.from(t);
        t.clear(), o.forEach(function(l) {
          return l(n);
        });
      }
    } else {
      var a = bs.getValue();
      a && (i(a), Fn(a).dep(r));
    }
    return n;
  };
  r.onNextChange = function(s) {
    return t.add(s), function() {
      t.delete(s);
    };
  };
  var i = r.attachCache = function(s) {
    return e.add(s), Fn(s).vars.add(r), r;
  };
  return r.forgetCache = function(s) {
    return e.delete(s);
  }, r;
}
function Tp(n) {
  n.broadcastWatches && n.broadcastWatches();
}
var Ko = /* @__PURE__ */ Object.create(null);
function ws(n) {
  var e = JSON.stringify(n);
  return Ko[e] || (Ko[e] = /* @__PURE__ */ Object.create(null));
}
function zo(n) {
  var e = ws(n);
  return e.keyFieldsFn || (e.keyFieldsFn = function(t, r) {
    var i = function(o, a) {
      return r.readField(a, o);
    }, s = r.keyObject = _s(n, function(o) {
      var a = on(r.storeObject, o, i);
      return a === void 0 && t !== r.storeObject && _e.call(t, o[0]) && (a = on(t, o, Ru)), __DEV__ ? D(a !== void 0, "Missing field '".concat(o.join("."), "' while extracting keyFields from ").concat(JSON.stringify(t))) : D(a !== void 0, 2), a;
    });
    return "".concat(r.typename, ":").concat(JSON.stringify(s));
  });
}
function Go(n) {
  var e = ws(n);
  return e.keyArgsFn || (e.keyArgsFn = function(t, r) {
    var i = r.field, s = r.variables, o = r.fieldName, a = _s(n, function(c) {
      var u = c[0], d = u.charAt(0);
      if (d === "@") {
        if (i && Qt(i.directives)) {
          var p = u.slice(1), m = i.directives.find(function(E) {
            return E.name.value === p;
          }), v = m && Br(m, s);
          return v && on(v, c.slice(1));
        }
        return;
      }
      if (d === "$") {
        var w = u.slice(1);
        if (s && _e.call(s, w)) {
          var _ = c.slice(0);
          return _[0] = w, on(s, _);
        }
        return;
      }
      if (t)
        return on(t, c);
    }), l = JSON.stringify(a);
    return (t || l !== "{}") && (o += ":" + l), o;
  });
}
function _s(n, e) {
  var t = new Jn();
  return Cu(n).reduce(function(r, i) {
    var s, o = e(i);
    if (o !== void 0) {
      for (var a = i.length - 1; a >= 0; --a)
        o = (s = {}, s[i[a]] = o, s);
      r = t.merge(r, o);
    }
    return r;
  }, /* @__PURE__ */ Object.create(null));
}
function Cu(n) {
  var e = ws(n);
  if (!e.paths) {
    var t = e.paths = [], r = [];
    n.forEach(function(i, s) {
      de(i) ? (Cu(i).forEach(function(o) {
        return t.push(r.concat(o));
      }), r.length = 0) : (r.push(i), de(n[s + 1]) || (t.push(r.slice(0)), r.length = 0));
    });
  }
  return e.paths;
}
function Ru(n, e) {
  return n[e];
}
function on(n, e, t) {
  return t = t || Ru, Nu(e.reduce(function r(i, s) {
    return de(i) ? i.map(function(o) {
      return r(o, s);
    }) : i && t(i, s);
  }, n));
}
function Nu(n) {
  return ue(n) ? de(n) ? n.map(Nu) : _s(Object.keys(n).sort(), function(e) {
    return on(n, e);
  }) : n;
}
as.setStringify(Ut);
function Ki(n) {
  return n.args !== void 0 ? n.args : n.field ? Br(n.field, n.variables) : null;
}
var Ap = function() {
}, Jo = function(n, e) {
  return e.fieldName;
}, Yo = function(n, e, t) {
  var r = t.mergeObjects;
  return r(n, e);
}, Xo = function(n, e) {
  return e;
}, Ip = function() {
  function n(e) {
    this.config = e, this.typePolicies = /* @__PURE__ */ Object.create(null), this.toBeAdded = /* @__PURE__ */ Object.create(null), this.supertypeMap = /* @__PURE__ */ new Map(), this.fuzzySubtypes = /* @__PURE__ */ new Map(), this.rootIdsByTypename = /* @__PURE__ */ Object.create(null), this.rootTypenamesById = /* @__PURE__ */ Object.create(null), this.usingPossibleTypes = !1, this.config = x({ dataIdFromObject: xu }, e), this.cache = this.config.cache, this.setRootTypename("Query"), this.setRootTypename("Mutation"), this.setRootTypename("Subscription"), e.possibleTypes && this.addPossibleTypes(e.possibleTypes), e.typePolicies && this.addTypePolicies(e.typePolicies);
  }
  return n.prototype.identify = function(e, t) {
    var r, i = this, s = t && (t.typename || ((r = t.storeObject) === null || r === void 0 ? void 0 : r.__typename)) || e.__typename;
    if (s === this.rootTypenamesById.ROOT_QUERY)
      return ["ROOT_QUERY"];
    for (var o = t && t.storeObject || e, a = x(x({}, t), { typename: s, storeObject: o, readField: t && t.readField || function() {
      var p = Es(arguments, o);
      return i.readField(p, {
        store: i.cache.data,
        variables: p.variables
      });
    } }), l, c = s && this.getTypePolicy(s), u = c && c.keyFn || this.config.dataIdFromObject; u; ) {
      var d = u(e, a);
      if (de(d))
        u = zo(d);
      else {
        l = d;
        break;
      }
    }
    return l = l ? String(l) : void 0, a.keyObject ? [l, a.keyObject] : [l];
  }, n.prototype.addTypePolicies = function(e) {
    var t = this;
    Object.keys(e).forEach(function(r) {
      var i = e[r], s = i.queryType, o = i.mutationType, a = i.subscriptionType, l = qt(i, ["queryType", "mutationType", "subscriptionType"]);
      s && t.setRootTypename("Query", r), o && t.setRootTypename("Mutation", r), a && t.setRootTypename("Subscription", r), _e.call(t.toBeAdded, r) ? t.toBeAdded[r].push(l) : t.toBeAdded[r] = [l];
    });
  }, n.prototype.updateTypePolicy = function(e, t) {
    var r = this, i = this.getTypePolicy(e), s = t.keyFields, o = t.fields;
    function a(l, c) {
      l.merge = typeof c == "function" ? c : c === !0 ? Yo : c === !1 ? Xo : l.merge;
    }
    a(i, t.merge), i.keyFn = s === !1 ? Ap : de(s) ? zo(s) : typeof s == "function" ? s : i.keyFn, o && Object.keys(o).forEach(function(l) {
      var c = r.getFieldPolicy(e, l, !0), u = o[l];
      if (typeof u == "function")
        c.read = u;
      else {
        var d = u.keyArgs, p = u.read, m = u.merge;
        c.keyFn = d === !1 ? Jo : de(d) ? Go(d) : typeof d == "function" ? d : c.keyFn, typeof p == "function" && (c.read = p), a(c, m);
      }
      c.read && c.merge && (c.keyFn = c.keyFn || Jo);
    });
  }, n.prototype.setRootTypename = function(e, t) {
    t === void 0 && (t = e);
    var r = "ROOT_" + e.toUpperCase(), i = this.rootTypenamesById[r];
    t !== i && (__DEV__ ? D(!i || i === e, "Cannot change root ".concat(e, " __typename more than once")) : D(!i || i === e, 3), i && delete this.rootIdsByTypename[i], this.rootIdsByTypename[t] = r, this.rootTypenamesById[r] = t);
  }, n.prototype.addPossibleTypes = function(e) {
    var t = this;
    this.usingPossibleTypes = !0, Object.keys(e).forEach(function(r) {
      t.getSupertypeSet(r, !0), e[r].forEach(function(i) {
        t.getSupertypeSet(i, !0).add(r);
        var s = i.match(Iu);
        (!s || s[0] !== i) && t.fuzzySubtypes.set(i, new RegExp(i));
      });
    });
  }, n.prototype.getTypePolicy = function(e) {
    var t = this;
    if (!_e.call(this.typePolicies, e)) {
      var r = this.typePolicies[e] = /* @__PURE__ */ Object.create(null);
      r.fields = /* @__PURE__ */ Object.create(null);
      var i = this.supertypeMap.get(e);
      i && i.size && i.forEach(function(o) {
        var a = t.getTypePolicy(o), l = a.fields, c = qt(a, ["fields"]);
        Object.assign(r, c), Object.assign(r.fields, l);
      });
    }
    var s = this.toBeAdded[e];
    return s && s.length && s.splice(0).forEach(function(o) {
      t.updateTypePolicy(e, o);
    }), this.typePolicies[e];
  }, n.prototype.getFieldPolicy = function(e, t, r) {
    if (e) {
      var i = this.getTypePolicy(e).fields;
      return i[t] || r && (i[t] = /* @__PURE__ */ Object.create(null));
    }
  }, n.prototype.getSupertypeSet = function(e, t) {
    var r = this.supertypeMap.get(e);
    return !r && t && this.supertypeMap.set(e, r = /* @__PURE__ */ new Set()), r;
  }, n.prototype.fragmentMatches = function(e, t, r, i) {
    var s = this;
    if (!e.typeCondition)
      return !0;
    if (!t)
      return !1;
    var o = e.typeCondition.name.value;
    if (t === o)
      return !0;
    if (this.usingPossibleTypes && this.supertypeMap.has(o))
      for (var a = this.getSupertypeSet(t, !0), l = [a], c = function(v) {
        var w = s.getSupertypeSet(v, !1);
        w && w.size && l.indexOf(w) < 0 && l.push(w);
      }, u = !!(r && this.fuzzySubtypes.size), d = !1, p = 0; p < l.length; ++p) {
        var m = l[p];
        if (m.has(o))
          return a.has(o) || (d && __DEV__ && D.warn("Inferring subtype ".concat(t, " of supertype ").concat(o)), a.add(o)), !0;
        m.forEach(c), u && p === l.length - 1 && Vi(e.selectionSet, r, i) && (u = !1, d = !0, this.fuzzySubtypes.forEach(function(v, w) {
          var _ = t.match(v);
          _ && _[0] === t && c(w);
        }));
      }
    return !1;
  }, n.prototype.hasKeyArgs = function(e, t) {
    var r = this.getFieldPolicy(e, t, !1);
    return !!(r && r.keyFn);
  }, n.prototype.getStoreFieldName = function(e) {
    var t = e.typename, r = e.fieldName, i = this.getFieldPolicy(t, r, !1), s, o = i && i.keyFn;
    if (o && t)
      for (var a = {
        typename: t,
        fieldName: r,
        field: e.field || null,
        variables: e.variables
      }, l = Ki(e); o; ) {
        var c = o(l, a);
        if (de(c))
          o = Go(c);
        else {
          s = c || r;
          break;
        }
      }
    return s === void 0 && (s = e.field ? Vh(e.field, e.variables) : as(r, Ki(e))), s === !1 ? r : r === Tt(s) ? s : r + ":" + s;
  }, n.prototype.readField = function(e, t) {
    var r = e.from;
    if (r) {
      var i = e.field || e.fieldName;
      if (i) {
        if (e.typename === void 0) {
          var s = t.store.getFieldValue(r, "__typename");
          s && (e.typename = s);
        }
        var o = this.getStoreFieldName(e), a = Tt(o), l = t.store.getFieldValue(r, o), c = this.getFieldPolicy(e.typename, a, !1), u = c && c.read;
        if (u) {
          var d = Zo(this, r, e, t, t.store.getStorage(Z(r) ? r.__ref : r, o));
          return bs.withValue(this.cache, u, [l, d]);
        }
        return l;
      }
    }
  }, n.prototype.getReadFunction = function(e, t) {
    var r = this.getFieldPolicy(e, t, !1);
    return r && r.read;
  }, n.prototype.getMergeFunction = function(e, t, r) {
    var i = this.getFieldPolicy(e, t, !1), s = i && i.merge;
    return !s && r && (i = this.getTypePolicy(r), s = i && i.merge), s;
  }, n.prototype.runMergeFunction = function(e, t, r, i, s) {
    var o = r.field, a = r.typename, l = r.merge;
    return l === Yo ? Du(i.store)(e, t) : l === Xo ? t : (i.overwrite && (e = void 0), l(e, t, Zo(this, void 0, { typename: a, fieldName: o.name.value, field: o, variables: i.variables }, i, s || /* @__PURE__ */ Object.create(null))));
  }, n;
}();
function Zo(n, e, t, r, i) {
  var s = n.getStoreFieldName(t), o = Tt(s), a = t.variables || r.variables, l = r.store, c = l.toReference, u = l.canRead;
  return {
    args: Ki(t),
    field: t.field || null,
    fieldName: o,
    storeFieldName: s,
    variables: a,
    isReference: Z,
    toReference: c,
    storage: i,
    cache: n.cache,
    canRead: u,
    readField: function() {
      return n.readField(Es(arguments, e, r), r);
    },
    mergeObjects: Du(r.store)
  };
}
function Es(n, e, t) {
  var r = n[0], i = n[1], s = n.length, o;
  return typeof r == "string" ? o = {
    fieldName: r,
    from: s > 1 ? i : e
  } : (o = x({}, r), _e.call(o, "from") || (o.from = e)), __DEV__ && o.from === void 0 && __DEV__ && D.warn("Undefined 'from' passed to readField with arguments ".concat(mf(Array.from(n)))), o.variables === void 0 && (o.variables = t), o;
}
function Du(n) {
  return function(t, r) {
    if (de(t) || de(r))
      throw __DEV__ ? new ne("Cannot automatically merge arrays") : new ne(4);
    if (ue(t) && ue(r)) {
      var i = n.getFieldValue(t, "__typename"), s = n.getFieldValue(r, "__typename"), o = i && s && i !== s;
      if (o)
        return r;
      if (Z(t) && en(r))
        return n.merge(t.__ref, r), t;
      if (en(t) && Z(r))
        return n.merge(t, r.__ref), r;
      if (en(t) && en(r))
        return x(x({}, t), r);
    }
    return r;
  };
}
function pi(n, e, t) {
  var r = "".concat(e).concat(t), i = n.flavors.get(r);
  return i || n.flavors.set(r, i = n.clientOnly === e && n.deferred === t ? n : x(x({}, n), { clientOnly: e, deferred: t })), i;
}
var Op = function() {
  function n(e, t) {
    this.cache = e, this.reader = t;
  }
  return n.prototype.writeToStore = function(e, t) {
    var r = this, i = t.query, s = t.result, o = t.dataId, a = t.variables, l = t.overwrite, c = Gn(i), u = yp();
    a = x(x({}, us(c)), a);
    var d = {
      store: e,
      written: /* @__PURE__ */ Object.create(null),
      merge: function(m, v) {
        return u.merge(m, v);
      },
      variables: a,
      varString: Ut(a),
      fragmentMap: $r(Pr(i)),
      overwrite: !!l,
      incomingById: /* @__PURE__ */ new Map(),
      clientOnly: !1,
      deferred: !1,
      flavors: /* @__PURE__ */ new Map()
    }, p = this.processSelectionSet({
      result: s || /* @__PURE__ */ Object.create(null),
      dataId: o,
      selectionSet: c.selectionSet,
      mergeTree: { map: /* @__PURE__ */ new Map() },
      context: d
    });
    if (!Z(p))
      throw __DEV__ ? new ne("Could not identify object ".concat(JSON.stringify(s))) : new ne(6);
    return d.incomingById.forEach(function(m, v) {
      var w = m.storeObject, _ = m.mergeTree, E = m.fieldNodeSet, T = sn(v);
      if (_ && _.map.size) {
        var I = r.applyMerges(_, T, w, d);
        if (Z(I))
          return;
        w = I;
      }
      if (__DEV__ && !d.overwrite) {
        var A = /* @__PURE__ */ Object.create(null);
        E.forEach(function(M) {
          M.selectionSet && (A[M.name.value] = !0);
        });
        var R = function(M) {
          return A[Tt(M)] === !0;
        }, N = function(M) {
          var B = _ && _.map.get(M);
          return !!(B && B.info && B.info.merge);
        };
        Object.keys(w).forEach(function(M) {
          R(M) && !N(M) && Cp(T, w, M, d.store);
        });
      }
      e.merge(v, w);
    }), e.retain(p.__ref), p;
  }, n.prototype.processSelectionSet = function(e) {
    var t = this, r = e.dataId, i = e.result, s = e.selectionSet, o = e.context, a = e.mergeTree, l = this.cache.policies, c = /* @__PURE__ */ Object.create(null), u = r && l.rootTypenamesById[r] || Ni(i, s, o.fragmentMap) || r && o.store.get(r, "__typename");
    typeof u == "string" && (c.__typename = u);
    var d = function() {
      var I = Es(arguments, c, o.variables);
      if (Z(I.from)) {
        var A = o.incomingById.get(I.from.__ref);
        if (A) {
          var R = l.readField(x(x({}, I), { from: A.storeObject }), o);
          if (R !== void 0)
            return R;
        }
      }
      return l.readField(I, o);
    }, p = /* @__PURE__ */ new Set();
    this.flattenFields(s, i, o, u).forEach(function(I, A) {
      var R, N = Vt(A), M = i[N];
      if (p.add(A), M !== void 0) {
        var B = l.getStoreFieldName({
          typename: u,
          fieldName: A.name.value,
          field: A,
          variables: I.variables
        }), q = ea(a, B), z = t.processFieldValue(M, A, A.selectionSet ? pi(I, !1, !1) : I, q), Y = void 0;
        A.selectionSet && (Z(z) || en(z)) && (Y = d("__typename", z));
        var Te = l.getMergeFunction(u, A.name.value, Y);
        Te ? q.info = {
          field: A,
          typename: u,
          merge: Te
        } : ta(a, B), c = I.merge(c, (R = {}, R[B] = z, R));
      } else __DEV__ && !I.clientOnly && !I.deferred && !ls.added(A) && !l.getReadFunction(u, A.name.value) && __DEV__ && D.error("Missing field '".concat(Vt(A), "' while writing result ").concat(JSON.stringify(i, null, 2)).substring(0, 1e3));
    });
    try {
      var m = l.identify(i, {
        typename: u,
        selectionSet: s,
        fragmentMap: o.fragmentMap,
        storeObject: c,
        readField: d
      }), v = m[0], w = m[1];
      r = r || v, w && (c = o.merge(c, w));
    } catch (I) {
      if (!r)
        throw I;
    }
    if (typeof r == "string") {
      var _ = sn(r), E = o.written[r] || (o.written[r] = []);
      if (E.indexOf(s) >= 0 || (E.push(s), this.reader && this.reader.isFresh(i, _, s, o)))
        return _;
      var T = o.incomingById.get(r);
      return T ? (T.storeObject = o.merge(T.storeObject, c), T.mergeTree = zi(T.mergeTree, a), p.forEach(function(I) {
        return T.fieldNodeSet.add(I);
      })) : o.incomingById.set(r, {
        storeObject: c,
        mergeTree: Ar(a) ? void 0 : a,
        fieldNodeSet: p
      }), _;
    }
    return c;
  }, n.prototype.processFieldValue = function(e, t, r, i) {
    var s = this;
    return !t.selectionSet || e === null ? __DEV__ ? lu(e) : e : de(e) ? e.map(function(o, a) {
      var l = s.processFieldValue(o, t, r, ea(i, a));
      return ta(i, a), l;
    }) : this.processSelectionSet({
      result: e,
      selectionSet: t.selectionSet,
      context: r,
      mergeTree: i
    });
  }, n.prototype.flattenFields = function(e, t, r, i) {
    i === void 0 && (i = Ni(t, e, r.fragmentMap));
    var s = /* @__PURE__ */ new Map(), o = this.cache.policies, a = new qr(!1);
    return function l(c, u) {
      var d = a.lookup(c, u.clientOnly, u.deferred);
      d.visited || (d.visited = !0, c.selections.forEach(function(p) {
        if (Fr(p, r.variables)) {
          var m = u.clientOnly, v = u.deferred;
          if (!(m && v) && Qt(p.directives) && p.directives.forEach(function(E) {
            var T = E.name.value;
            if (T === "client" && (m = !0), T === "defer") {
              var I = Br(E, r.variables);
              (!I || I.if !== !1) && (v = !0);
            }
          }), gt(p)) {
            var w = s.get(p);
            w && (m = m && w.clientOnly, v = v && w.deferred), s.set(p, pi(r, m, v));
          } else {
            var _ = os(p, r.fragmentMap);
            _ && o.fragmentMatches(_, i, t, r.variables) && l(_.selectionSet, pi(r, m, v));
          }
        }
      }));
    }(e, r), s;
  }, n.prototype.applyMerges = function(e, t, r, i, s) {
    var o, a = this;
    if (e.map.size && !Z(r)) {
      var l = !de(r) && (Z(t) || en(t)) ? t : void 0, c = r;
      l && !s && (s = [Z(l) ? l.__ref : l]);
      var u, d = function(p, m) {
        return de(p) ? typeof m == "number" ? p[m] : void 0 : i.store.getFieldValue(p, String(m));
      };
      e.map.forEach(function(p, m) {
        var v = d(l, m), w = d(c, m);
        if (w !== void 0) {
          s && s.push(m);
          var _ = a.applyMerges(p, v, w, i, s);
          _ !== w && (u = u || /* @__PURE__ */ new Map(), u.set(m, _)), s && D(s.pop() === m);
        }
      }), u && (r = de(c) ? c.slice(0) : x({}, c), u.forEach(function(p, m) {
        r[m] = p;
      }));
    }
    return e.info ? this.cache.policies.runMergeFunction(t, r, e.info, i, s && (o = i.store).getStorage.apply(o, s)) : r;
  }, n;
}(), Mu = [];
function ea(n, e) {
  var t = n.map;
  return t.has(e) || t.set(e, Mu.pop() || { map: /* @__PURE__ */ new Map() }), t.get(e);
}
function zi(n, e) {
  if (n === e || !e || Ar(e))
    return n;
  if (!n || Ar(n))
    return e;
  var t = n.info && e.info ? x(x({}, n.info), e.info) : n.info || e.info, r = n.map.size && e.map.size, i = r ? /* @__PURE__ */ new Map() : n.map.size ? n.map : e.map, s = { info: t, map: i };
  if (r) {
    var o = new Set(e.map.keys());
    n.map.forEach(function(a, l) {
      s.map.set(l, zi(a, e.map.get(l))), o.delete(l);
    }), o.forEach(function(a) {
      s.map.set(a, zi(e.map.get(a), n.map.get(a)));
    });
  }
  return s;
}
function Ar(n) {
  return !n || !(n.info || n.map.size);
}
function ta(n, e) {
  var t = n.map, r = t.get(e);
  r && Ar(r) && (Mu.push(r), t.delete(e));
}
var na = /* @__PURE__ */ new Set();
function Cp(n, e, t, r) {
  var i = function(d) {
    var p = r.getFieldValue(d, t);
    return typeof p == "object" && p;
  }, s = i(n);
  if (s) {
    var o = i(e);
    if (o && !Z(s) && !Se(s, o) && !Object.keys(s).every(function(d) {
      return r.getFieldValue(o, d) !== void 0;
    })) {
      var a = r.getFieldValue(n, "__typename") || r.getFieldValue(e, "__typename"), l = Tt(t), c = "".concat(a, ".").concat(l);
      if (!na.has(c)) {
        na.add(c);
        var u = [];
        !de(s) && !de(o) && [s, o].forEach(function(d) {
          var p = r.getFieldValue(d, "__typename");
          typeof p == "string" && !u.includes(p) && u.push(p);
        }), __DEV__ && D.warn("Cache data may be lost when replacing the ".concat(l, " field of a ").concat(a, ` object.

To address this problem (which is not a bug in Apollo Client), `).concat(u.length ? "either ensure all objects of type " + u.join(" and ") + " have an ID or a custom merge function, or " : "", "define a custom merge function for the ").concat(c, ` field, so InMemoryCache can safely merge these objects:

  existing: `).concat(JSON.stringify(s).slice(0, 1e3), `
  incoming: `).concat(JSON.stringify(o).slice(0, 1e3), `

For more information about these options, please refer to the documentation:

  * Ensuring entity objects have IDs: https://go.apollo.dev/c/generating-unique-identifiers
  * Defining custom merge functions: https://go.apollo.dev/c/merging-non-normalized-objects
`));
      }
    }
  }
}
var Rp = function(n) {
  Ve(e, n);
  function e(t) {
    t === void 0 && (t = {});
    var r = n.call(this) || this;
    return r.watches = /* @__PURE__ */ new Set(), r.typenameDocumentCache = /* @__PURE__ */ new Map(), r.makeVar = xp, r.txCount = 0, r.config = pp(t), r.addTypename = !!r.config.addTypename, r.policies = new Ip({
      cache: r,
      dataIdFromObject: r.config.dataIdFromObject,
      possibleTypes: r.config.possibleTypes,
      typePolicies: r.config.typePolicies
    }), r.init(), r;
  }
  return e.prototype.init = function() {
    var t = this.data = new jr.Root({
      policies: this.policies,
      resultCaching: this.config.resultCaching
    });
    this.optimisticData = t.stump, this.resetResultCache();
  }, e.prototype.resetResultCache = function(t) {
    var r = this, i = this.storeReader;
    this.storeWriter = new Op(this, this.storeReader = new bp({
      cache: this,
      addTypename: this.addTypename,
      resultCacheMaxSize: this.config.resultCacheMaxSize,
      canonizeResults: Au(this.config),
      canon: t ? void 0 : i && i.canon
    })), this.maybeBroadcastWatch = Tr(function(s, o) {
      return r.broadcastWatch(s, o);
    }, {
      max: this.config.resultCacheMaxSize,
      makeCacheKey: function(s) {
        var o = s.optimistic ? r.optimisticData : r.data;
        if (Mn(o)) {
          var a = s.optimistic, l = s.rootId, c = s.variables;
          return o.makeCacheKey(s.query, s.callback, Ut({ optimistic: a, rootId: l, variables: c }));
        }
      }
    }), (/* @__PURE__ */ new Set([
      this.data.group,
      this.optimisticData.group
    ])).forEach(function(s) {
      return s.resetCaching();
    });
  }, e.prototype.restore = function(t) {
    return this.init(), t && this.data.replace(t), this;
  }, e.prototype.extract = function(t) {
    return t === void 0 && (t = !1), (t ? this.optimisticData : this.data).extract();
  }, e.prototype.read = function(t) {
    var r = t.returnPartialData, i = r === void 0 ? !1 : r;
    try {
      return this.storeReader.diffQueryAgainstStore(x(x({}, t), { store: t.optimistic ? this.optimisticData : this.data, config: this.config, returnPartialData: i })).result || null;
    } catch (s) {
      if (s instanceof Su)
        return null;
      throw s;
    }
  }, e.prototype.write = function(t) {
    try {
      return ++this.txCount, this.storeWriter.writeToStore(this.data, t);
    } finally {
      !--this.txCount && t.broadcast !== !1 && this.broadcastWatches();
    }
  }, e.prototype.modify = function(t) {
    if (_e.call(t, "id") && !t.id)
      return !1;
    var r = t.optimistic ? this.optimisticData : this.data;
    try {
      return ++this.txCount, r.modify(t.id || "ROOT_QUERY", t.fields);
    } finally {
      !--this.txCount && t.broadcast !== !1 && this.broadcastWatches();
    }
  }, e.prototype.diff = function(t) {
    return this.storeReader.diffQueryAgainstStore(x(x({}, t), { store: t.optimistic ? this.optimisticData : this.data, rootId: t.id || "ROOT_QUERY", config: this.config }));
  }, e.prototype.watch = function(t) {
    var r = this;
    return this.watches.size || kp(this), this.watches.add(t), t.immediate && this.maybeBroadcastWatch(t), function() {
      r.watches.delete(t) && !r.watches.size && Wo(r), r.maybeBroadcastWatch.forget(t);
    };
  }, e.prototype.gc = function(t) {
    Ut.reset();
    var r = this.optimisticData.gc();
    return t && !this.txCount && (t.resetResultCache ? this.resetResultCache(t.resetResultIdentities) : t.resetResultIdentities && this.storeReader.resetCanon()), r;
  }, e.prototype.retain = function(t, r) {
    return (r ? this.optimisticData : this.data).retain(t);
  }, e.prototype.release = function(t, r) {
    return (r ? this.optimisticData : this.data).release(t);
  }, e.prototype.identify = function(t) {
    if (Z(t))
      return t.__ref;
    try {
      return this.policies.identify(t)[0];
    } catch (r) {
      __DEV__ && D.warn(r);
    }
  }, e.prototype.evict = function(t) {
    if (!t.id) {
      if (_e.call(t, "id"))
        return !1;
      t = x(x({}, t), { id: "ROOT_QUERY" });
    }
    try {
      return ++this.txCount, this.optimisticData.evict(t, this.data);
    } finally {
      !--this.txCount && t.broadcast !== !1 && this.broadcastWatches();
    }
  }, e.prototype.reset = function(t) {
    var r = this;
    return this.init(), Ut.reset(), t && t.discardWatches ? (this.watches.forEach(function(i) {
      return r.maybeBroadcastWatch.forget(i);
    }), this.watches.clear(), Wo(this)) : this.broadcastWatches(), Promise.resolve();
  }, e.prototype.removeOptimistic = function(t) {
    var r = this.optimisticData.removeLayer(t);
    r !== this.optimisticData && (this.optimisticData = r, this.broadcastWatches());
  }, e.prototype.batch = function(t) {
    var r = this, i = t.update, s = t.optimistic, o = s === void 0 ? !0 : s, a = t.removeOptimistic, l = t.onWatchUpdated, c, u = function(p) {
      var m = r, v = m.data, w = m.optimisticData;
      ++r.txCount, p && (r.data = r.optimisticData = p);
      try {
        return c = i(r);
      } finally {
        --r.txCount, r.data = v, r.optimisticData = w;
      }
    }, d = /* @__PURE__ */ new Set();
    return l && !this.txCount && this.broadcastWatches(x(x({}, t), { onWatchUpdated: function(p) {
      return d.add(p), !1;
    } })), typeof o == "string" ? this.optimisticData = this.optimisticData.addLayer(o, u) : o === !1 ? u(this.data) : u(), typeof a == "string" && (this.optimisticData = this.optimisticData.removeLayer(a)), l && d.size ? (this.broadcastWatches(x(x({}, t), { onWatchUpdated: function(p, m) {
      var v = l.call(this, p, m);
      return v !== !1 && d.delete(p), v;
    } })), d.size && d.forEach(function(p) {
      return r.maybeBroadcastWatch.dirty(p);
    })) : this.broadcastWatches(t), c;
  }, e.prototype.performTransaction = function(t, r) {
    return this.batch({
      update: t,
      optimistic: r || r !== null
    });
  }, e.prototype.transformDocument = function(t) {
    if (this.addTypename) {
      var r = this.typenameDocumentCache.get(t);
      return r || (r = ls(t), this.typenameDocumentCache.set(t, r), this.typenameDocumentCache.set(r, r)), r;
    }
    return t;
  }, e.prototype.broadcastWatches = function(t) {
    var r = this;
    this.txCount || this.watches.forEach(function(i) {
      return r.maybeBroadcastWatch(i, t);
    });
  }, e.prototype.broadcastWatch = function(t, r) {
    var i = t.lastDiff, s = this.diff(t);
    r && (t.optimistic && typeof r.optimistic == "string" && (s.fromOptimisticTransaction = !0), r.onWatchUpdated && r.onWatchUpdated.call(this, t, s, i) === !1) || (!i || !Se(i.result, s.result)) && t.callback(t.lastDiff = s, i);
  }, e;
}(up);
function Np(n) {
  return n.hasOwnProperty("graphQLErrors");
}
var Dp = function(n) {
  var e = "";
  if (Qt(n.graphQLErrors) || Qt(n.clientErrors)) {
    var t = (n.graphQLErrors || []).concat(n.clientErrors || []);
    t.forEach(function(r) {
      var i = r ? r.message : "Error message not found.";
      e += "".concat(i, `
`);
    });
  }
  return n.networkError && (e += "".concat(n.networkError.message, `
`)), e = e.replace(/\n$/, ""), e;
}, Dt = function(n) {
  Ve(e, n);
  function e(t) {
    var r = t.graphQLErrors, i = t.clientErrors, s = t.networkError, o = t.errorMessage, a = t.extraInfo, l = n.call(this, o) || this;
    return l.graphQLErrors = r || [], l.clientErrors = i || [], l.networkError = s || null, l.message = o || Dp(l), l.extraInfo = a, l.__proto__ = e.prototype, l;
  }
  return e;
}(Error), ie;
(function(n) {
  n[n.loading = 1] = "loading", n[n.setVariables = 2] = "setVariables", n[n.fetchMore = 3] = "fetchMore", n[n.refetch = 4] = "refetch", n[n.poll = 6] = "poll", n[n.ready = 7] = "ready", n[n.error = 8] = "error";
})(ie || (ie = {}));
function Vn(n) {
  return n ? n < 7 : !1;
}
var Mp = Object.assign, Fp = Object.hasOwnProperty, ra = !1, Gi = function(n) {
  Ve(e, n);
  function e(t) {
    var r = t.queryManager, i = t.queryInfo, s = t.options, o = n.call(this, function(l) {
      try {
        var c = l._subscription._observer;
        c && !c.error && (c.error = $p);
      } catch {
      }
      var u = !o.observers.size;
      o.observers.add(l);
      var d = o.last;
      return d && d.error ? l.error && l.error(d.error) : d && d.result && l.next && l.next(d.result), u && o.reobserve().catch(function() {
      }), function() {
        o.observers.delete(l) && !o.observers.size && o.tearDownQuery();
      };
    }) || this;
    o.observers = /* @__PURE__ */ new Set(), o.subscriptions = /* @__PURE__ */ new Set(), o.isTornDown = !1, o.options = s, o.queryId = i.queryId || r.generateQueryId();
    var a = Gn(s.query);
    return o.queryName = a && a.name && a.name.value, o.initialFetchPolicy = s.fetchPolicy || "cache-first", o.queryManager = r, o.queryInfo = i, o;
  }
  return Object.defineProperty(e.prototype, "variables", {
    get: function() {
      return this.options.variables;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.result = function() {
    var t = this;
    return new Promise(function(r, i) {
      var s = {
        next: function(a) {
          r(a), t.observers.delete(s), t.observers.size || t.queryManager.removeQuery(t.queryId), setTimeout(function() {
            o.unsubscribe();
          }, 0);
        },
        error: i
      }, o = t.subscribe(s);
    });
  }, e.prototype.getCurrentResult = function(t) {
    t === void 0 && (t = !0);
    var r = this.getLastResult(!0), i = this.queryInfo.networkStatus || r && r.networkStatus || ie.ready, s = x(x({}, r), { loading: Vn(i), networkStatus: i }), o = this.options.fetchPolicy, a = o === void 0 ? "cache-first" : o;
    if (!(a === "network-only" || a === "no-cache" || a === "standby" || this.queryManager.transform(this.options.query).hasForcedResolvers)) {
      var l = this.queryInfo.getDiff();
      (l.complete || this.options.returnPartialData) && (s.data = l.result), Se(s.data, {}) && (s.data = void 0), l.complete ? (delete s.partial, l.complete && s.networkStatus === ie.loading && (a === "cache-first" || a === "cache-only") && (s.networkStatus = ie.ready, s.loading = !1)) : s.partial = !0, __DEV__ && !l.complete && !this.options.partialRefetch && !s.loading && !s.data && !s.error && Fu(l.missing);
    }
    return t && this.updateLastResult(s), s;
  }, e.prototype.isDifferentFromLastResult = function(t) {
    return !this.last || !Se(this.last.result, t);
  }, e.prototype.getLast = function(t, r) {
    var i = this.last;
    if (i && i[t] && (!r || Se(i.variables, this.variables)))
      return i[t];
  }, e.prototype.getLastResult = function(t) {
    return this.getLast("result", t);
  }, e.prototype.getLastError = function(t) {
    return this.getLast("error", t);
  }, e.prototype.resetLastResults = function() {
    delete this.last, this.isTornDown = !1;
  }, e.prototype.resetQueryStoreErrors = function() {
    this.queryManager.resetErrors(this.queryId);
  }, e.prototype.refetch = function(t) {
    var r, i = {
      pollInterval: 0
    }, s = this.options.fetchPolicy;
    if (s === "cache-and-network" ? i.fetchPolicy = s : s === "no-cache" ? i.fetchPolicy = "no-cache" : i.fetchPolicy = "network-only", __DEV__ && t && Fp.call(t, "variables")) {
      var o = nu(this.options.query), a = o.variableDefinitions;
      (!a || !a.some(function(l) {
        return l.variable.name.value === "variables";
      })) && __DEV__ && D.warn("Called refetch(".concat(JSON.stringify(t), ") for query ").concat(((r = o.name) === null || r === void 0 ? void 0 : r.value) || JSON.stringify(o), `, which does not declare a $variables variable.
Did you mean to call refetch(variables) instead of refetch({ variables })?`));
    }
    return t && !Se(this.options.variables, t) && (i.variables = this.options.variables = x(x({}, this.options.variables), t)), this.queryInfo.resetLastWrite(), this.reobserve(i, ie.refetch);
  }, e.prototype.fetchMore = function(t) {
    var r = this, i = x(x({}, t.query ? t : x(x(x({}, this.options), t), { variables: x(x({}, this.options.variables), t.variables) })), { fetchPolicy: "no-cache" }), s = this.queryManager.generateQueryId();
    return i.notifyOnNetworkStatusChange && (this.queryInfo.networkStatus = ie.fetchMore, this.observe()), this.queryManager.fetchQuery(s, i, ie.fetchMore).then(function(o) {
      var a = o.data, l = t.updateQuery;
      return l ? (__DEV__ && !ra && (__DEV__ && D.warn(`The updateQuery callback for fetchMore is deprecated, and will be removed
in the next major version of Apollo Client.

Please convert updateQuery functions to field policies with appropriate
read and merge functions, or use/adapt a helper function (such as
concatPagination, offsetLimitPagination, or relayStylePagination) from
@apollo/client/utilities.

The field policy system handles pagination more effectively than a
hand-written updateQuery function, and you only need to define the policy
once, rather than every time you call fetchMore.`), ra = !0), r.updateQuery(function(c) {
        return l(c, {
          fetchMoreResult: a,
          variables: i.variables
        });
      })) : r.queryManager.cache.writeQuery({
        query: i.query,
        variables: i.variables,
        data: a
      }), o;
    }).finally(function() {
      r.queryManager.stopQuery(s), r.reobserve();
    });
  }, e.prototype.subscribeToMore = function(t) {
    var r = this, i = this.queryManager.startGraphQLSubscription({
      query: t.document,
      variables: t.variables,
      context: t.context
    }).subscribe({
      next: function(s) {
        var o = t.updateQuery;
        o && r.updateQuery(function(a, l) {
          var c = l.variables;
          return o(a, {
            subscriptionData: s,
            variables: c
          });
        });
      },
      error: function(s) {
        if (t.onError) {
          t.onError(s);
          return;
        }
        __DEV__ && D.error("Unhandled GraphQL subscription error", s);
      }
    });
    return this.subscriptions.add(i), function() {
      r.subscriptions.delete(i) && i.unsubscribe();
    };
  }, e.prototype.setOptions = function(t) {
    return this.reobserve(t);
  }, e.prototype.setVariables = function(t) {
    return Se(this.variables, t) ? this.observers.size ? this.result() : Promise.resolve() : (this.options.variables = t, this.observers.size ? this.reobserve({
      fetchPolicy: this.initialFetchPolicy,
      variables: t
    }, ie.setVariables) : Promise.resolve());
  }, e.prototype.updateQuery = function(t) {
    var r = this.queryManager, i = r.cache.diff({
      query: this.options.query,
      variables: this.variables,
      returnPartialData: !0,
      optimistic: !1
    }).result, s = t(i, {
      variables: this.variables
    });
    s && (r.cache.writeQuery({
      query: this.options.query,
      data: s,
      variables: this.variables
    }), r.broadcastQueries());
  }, e.prototype.startPolling = function(t) {
    this.options.pollInterval = t, this.updatePolling();
  }, e.prototype.stopPolling = function() {
    this.options.pollInterval = 0, this.updatePolling();
  }, e.prototype.fetch = function(t, r) {
    return this.queryManager.setObservableQuery(this), this.queryManager.fetchQueryObservable(this.queryId, t, r);
  }, e.prototype.updatePolling = function() {
    var t = this;
    if (!this.queryManager.ssrMode) {
      var r = this, i = r.pollingInfo, s = r.options.pollInterval;
      if (!s) {
        i && (clearTimeout(i.timeout), delete this.pollingInfo);
        return;
      }
      if (!(i && i.interval === s)) {
        __DEV__ ? D(s, "Attempted to start a polling query without a polling interval.") : D(s, 10);
        var o = i || (this.pollingInfo = {});
        o.interval = s;
        var a = function() {
          t.pollingInfo && (Vn(t.queryInfo.networkStatus) ? l() : t.reobserve({
            fetchPolicy: "network-only"
          }, ie.poll).then(l, l));
        }, l = function() {
          var c = t.pollingInfo;
          c && (clearTimeout(c.timeout), c.timeout = setTimeout(a, c.interval));
        };
        l();
      }
    }
  }, e.prototype.updateLastResult = function(t, r) {
    return r === void 0 && (r = this.variables), this.last = x(x({}, this.last), { result: this.queryManager.assumeImmutableResults ? t : lu(t), variables: r }), Qt(t.errors) || delete this.last.error, this.last;
  }, e.prototype.reobserve = function(t, r) {
    var i = this;
    this.isTornDown = !1;
    var s = r === ie.refetch || r === ie.fetchMore || r === ie.poll, o = this.options.variables, a = s ? qn(this.options, t) : Mp(this.options, qn(t));
    s || (this.updatePolling(), t && t.variables && !t.fetchPolicy && !Se(t.variables, o) && (a.fetchPolicy = this.initialFetchPolicy, r === void 0 && (r = ie.setVariables)));
    var l = a.variables && x({}, a.variables), c = this.fetch(a, r), u = {
      next: function(d) {
        i.reportResult(d, l);
      },
      error: function(d) {
        i.reportError(d, l);
      }
    };
    return s || (this.concast && this.observer && this.concast.removeObserver(this.observer, !0), this.concast = c, this.observer = u), c.addObserver(u), c.promise;
  }, e.prototype.observe = function() {
    this.reportResult(this.getCurrentResult(!1), this.variables);
  }, e.prototype.reportResult = function(t, r) {
    var i = this.getLastError();
    (i || this.isDifferentFromLastResult(t)) && ((i || !t.partial || this.options.returnPartialData) && this.updateLastResult(t, r), Dn(this.observers, "next", t));
  }, e.prototype.reportError = function(t, r) {
    var i = x(x({}, this.getLastResult()), { error: t, errors: t.graphQLErrors, networkStatus: ie.error, loading: !1 });
    this.updateLastResult(i, r), Dn(this.observers, "error", this.last.error = t);
  }, e.prototype.hasObservers = function() {
    return this.observers.size > 0;
  }, e.prototype.tearDownQuery = function() {
    this.isTornDown || (this.concast && this.observer && (this.concast.removeObserver(this.observer), delete this.concast, delete this.observer), this.stopPolling(), this.subscriptions.forEach(function(t) {
      return t.unsubscribe();
    }), this.subscriptions.clear(), this.queryManager.stopQuery(this.queryId), this.observers.clear(), this.isTornDown = !0);
  }, e;
}(ee);
hu(Gi);
function $p(n) {
  __DEV__ && D.error("Unhandled error", n.message, n.stack);
}
function Fu(n) {
  __DEV__ && n && __DEV__ && D.debug("Missing cache result fields: ".concat(JSON.stringify(n)), n);
}
function Bp(n) {
  var e = n.fetchPolicy, t = e === void 0 ? "cache-first" : e, r = n.nextFetchPolicy;
  r && (n.fetchPolicy = typeof r == "function" ? r.call(n, t) : r);
}
var $u = function() {
  function n(e) {
    var t = e.cache, r = e.client, i = e.resolvers, s = e.fragmentMatcher;
    this.cache = t, r && (this.client = r), i && this.addResolvers(i), s && this.setFragmentMatcher(s);
  }
  return n.prototype.addResolvers = function(e) {
    var t = this;
    this.resolvers = this.resolvers || {}, Array.isArray(e) ? e.forEach(function(r) {
      t.resolvers = vo(t.resolvers, r);
    }) : this.resolvers = vo(this.resolvers, e);
  }, n.prototype.setResolvers = function(e) {
    this.resolvers = {}, this.addResolvers(e);
  }, n.prototype.getResolvers = function() {
    return this.resolvers || {};
  }, n.prototype.runResolvers = function(e) {
    var t = e.document, r = e.remoteResult, i = e.context, s = e.variables, o = e.onlyRunForcedResolvers, a = o === void 0 ? !1 : o;
    return Rt(this, void 0, void 0, function() {
      return Nt(this, function(l) {
        return t ? [2, this.resolveDocument(t, r.data, i, s, this.fragmentMatcher, a).then(function(c) {
          return x(x({}, r), { data: c.result });
        })] : [2, r];
      });
    });
  }, n.prototype.setFragmentMatcher = function(e) {
    this.fragmentMatcher = e;
  }, n.prototype.getFragmentMatcher = function() {
    return this.fragmentMatcher;
  }, n.prototype.clientQuery = function(e) {
    return Ri(["client"], e) && this.resolvers ? e : null;
  }, n.prototype.serverQuery = function(e) {
    return Zh(e);
  }, n.prototype.prepareContext = function(e) {
    var t = this.cache;
    return x(x({}, e), { cache: t, getCacheKey: function(r) {
      return t.identify(r);
    } });
  }, n.prototype.addExportedVariables = function(e, t, r) {
    return t === void 0 && (t = {}), r === void 0 && (r = {}), Rt(this, void 0, void 0, function() {
      return Nt(this, function(i) {
        return e ? [2, this.resolveDocument(e, this.buildRootValueFromCache(e, t) || {}, this.prepareContext(r), t).then(function(s) {
          return x(x({}, t), s.exportedVariables);
        })] : [2, x({}, t)];
      });
    });
  }, n.prototype.shouldForceResolvers = function(e) {
    var t = !1;
    return st(e, {
      Directive: {
        enter: function(r) {
          if (r.name.value === "client" && r.arguments && (t = r.arguments.some(function(i) {
            return i.name.value === "always" && i.value.kind === "BooleanValue" && i.value.value === !0;
          }), t))
            return eu;
        }
      }
    }), t;
  }, n.prototype.buildRootValueFromCache = function(e, t) {
    return this.cache.diff({
      query: Xh(e),
      variables: t,
      returnPartialData: !0,
      optimistic: !1
    }).result;
  }, n.prototype.resolveDocument = function(e, t, r, i, s, o) {
    return r === void 0 && (r = {}), i === void 0 && (i = {}), s === void 0 && (s = function() {
      return !0;
    }), o === void 0 && (o = !1), Rt(this, void 0, void 0, function() {
      var a, l, c, u, d, p, m, v, w;
      return Nt(this, function(_) {
        return a = Lr(e), l = Pr(e), c = $r(l), u = a.operation, d = u ? u.charAt(0).toUpperCase() + u.slice(1) : "Query", p = this, m = p.cache, v = p.client, w = {
          fragmentMap: c,
          context: x(x({}, r), { cache: m, client: v }),
          variables: i,
          fragmentMatcher: s,
          defaultOperationType: d,
          exportedVariables: {},
          onlyRunForcedResolvers: o
        }, [2, this.resolveSelectionSet(a.selectionSet, t, w).then(function(E) {
          return {
            result: E,
            exportedVariables: w.exportedVariables
          };
        })];
      });
    });
  }, n.prototype.resolveSelectionSet = function(e, t, r) {
    return Rt(this, void 0, void 0, function() {
      var i, s, o, a, l, c = this;
      return Nt(this, function(u) {
        return i = r.fragmentMap, s = r.context, o = r.variables, a = [t], l = function(d) {
          return Rt(c, void 0, void 0, function() {
            var p, m;
            return Nt(this, function(v) {
              return Fr(d, o) ? gt(d) ? [2, this.resolveField(d, t, r).then(function(w) {
                var _;
                typeof w < "u" && a.push((_ = {}, _[Vt(d)] = w, _));
              })] : (tu(d) ? p = d : (p = i[d.name.value], __DEV__ ? D(p, "No fragment named ".concat(d.name.value)) : D(p, 9)), p && p.typeCondition && (m = p.typeCondition.name.value, r.fragmentMatcher(t, m, s)) ? [2, this.resolveSelectionSet(p.selectionSet, t, r).then(function(w) {
                a.push(w);
              })] : [2]) : [2];
            });
          });
        }, [2, Promise.all(e.selections.map(l)).then(function() {
          return ou(a);
        })];
      });
    });
  }, n.prototype.resolveField = function(e, t, r) {
    return Rt(this, void 0, void 0, function() {
      var i, s, o, a, l, c, u, d, p, m = this;
      return Nt(this, function(v) {
        return i = r.variables, s = e.name.value, o = Vt(e), a = s !== o, l = t[o] || t[s], c = Promise.resolve(l), (!r.onlyRunForcedResolvers || this.shouldForceResolvers(e)) && (u = t.__typename || r.defaultOperationType, d = this.resolvers && this.resolvers[u], d && (p = d[a ? s : o], p && (c = Promise.resolve(bs.withValue(this.cache, p, [
          t,
          Br(e, i),
          r.context,
          { field: e, fragmentMap: r.fragmentMap }
        ]))))), [2, c.then(function(w) {
          if (w === void 0 && (w = l), e.directives && e.directives.forEach(function(_) {
            _.name.value === "export" && _.arguments && _.arguments.forEach(function(E) {
              E.name.value === "as" && E.value.kind === "StringValue" && (r.exportedVariables[E.value.value] = w);
            });
          }), !e.selectionSet || w == null)
            return w;
          if (Array.isArray(w))
            return m.resolveSubSelectedArray(e, w, r);
          if (e.selectionSet)
            return m.resolveSelectionSet(e.selectionSet, w, r);
        })];
      });
    });
  }, n.prototype.resolveSubSelectedArray = function(e, t, r) {
    var i = this;
    return Promise.all(t.map(function(s) {
      if (s === null)
        return null;
      if (Array.isArray(s))
        return i.resolveSubSelectedArray(e, s, r);
      if (e.selectionSet)
        return i.resolveSelectionSet(e.selectionSet, s, r);
    }));
  }, n;
}(), tn = new (Wt ? WeakMap : Map)();
function di(n, e) {
  var t = n[e];
  typeof t == "function" && (n[e] = function() {
    return tn.set(n, (tn.get(n) + 1) % 1e15), t.apply(this, arguments);
  });
}
function ia(n) {
  n.notifyTimeout && (clearTimeout(n.notifyTimeout), n.notifyTimeout = void 0);
}
var yi = function() {
  function n(e, t) {
    t === void 0 && (t = e.generateQueryId()), this.queryId = t, this.listeners = /* @__PURE__ */ new Set(), this.document = null, this.lastRequestId = 1, this.subscriptions = /* @__PURE__ */ new Set(), this.stopped = !1, this.dirty = !1, this.observableQuery = null;
    var r = this.cache = e.cache;
    tn.has(r) || (tn.set(r, 0), di(r, "evict"), di(r, "modify"), di(r, "reset"));
  }
  return n.prototype.init = function(e) {
    var t = e.networkStatus || ie.loading;
    return this.variables && this.networkStatus !== ie.loading && !Se(this.variables, e.variables) && (t = ie.setVariables), Se(e.variables, this.variables) || (this.lastDiff = void 0), Object.assign(this, {
      document: e.document,
      variables: e.variables,
      networkError: null,
      graphQLErrors: this.graphQLErrors || [],
      networkStatus: t
    }), e.observableQuery && this.setObservableQuery(e.observableQuery), e.lastRequestId && (this.lastRequestId = e.lastRequestId), this;
  }, n.prototype.reset = function() {
    ia(this), this.lastDiff = void 0, this.dirty = !1;
  }, n.prototype.getDiff = function(e) {
    e === void 0 && (e = this.variables);
    var t = this.getDiffOptions(e);
    if (this.lastDiff && Se(t, this.lastDiff.options))
      return this.lastDiff.diff;
    this.updateWatch(this.variables = e);
    var r = this.observableQuery;
    if (r && r.options.fetchPolicy === "no-cache")
      return { complete: !1 };
    var i = this.cache.diff(t);
    return this.updateLastDiff(i, t), i;
  }, n.prototype.updateLastDiff = function(e, t) {
    this.lastDiff = e ? {
      diff: e,
      options: t || this.getDiffOptions()
    } : void 0;
  }, n.prototype.getDiffOptions = function(e) {
    var t;
    return e === void 0 && (e = this.variables), {
      query: this.document,
      variables: e,
      returnPartialData: !0,
      optimistic: !0,
      canonizeResults: (t = this.observableQuery) === null || t === void 0 ? void 0 : t.options.canonizeResults
    };
  }, n.prototype.setDiff = function(e) {
    var t = this, r = this.lastDiff && this.lastDiff.diff;
    this.updateLastDiff(e), !this.dirty && !Se(r && r.result, e && e.result) && (this.dirty = !0, this.notifyTimeout || (this.notifyTimeout = setTimeout(function() {
      return t.notify();
    }, 0)));
  }, n.prototype.setObservableQuery = function(e) {
    var t = this;
    e !== this.observableQuery && (this.oqListener && this.listeners.delete(this.oqListener), this.observableQuery = e, e ? (e.queryInfo = this, this.listeners.add(this.oqListener = function() {
      t.getDiff().fromOptimisticTransaction ? e.observe() : e.reobserve();
    })) : delete this.oqListener);
  }, n.prototype.notify = function() {
    var e = this;
    ia(this), this.shouldNotify() && this.listeners.forEach(function(t) {
      return t(e);
    }), this.dirty = !1;
  }, n.prototype.shouldNotify = function() {
    if (!this.dirty || !this.listeners.size)
      return !1;
    if (Vn(this.networkStatus) && this.observableQuery) {
      var e = this.observableQuery.options.fetchPolicy;
      if (e !== "cache-only" && e !== "cache-and-network")
        return !1;
    }
    return !0;
  }, n.prototype.stop = function() {
    if (!this.stopped) {
      this.stopped = !0, this.reset(), this.cancel(), this.cancel = n.prototype.cancel, this.subscriptions.forEach(function(t) {
        return t.unsubscribe();
      });
      var e = this.observableQuery;
      e && e.stopPolling();
    }
  }, n.prototype.cancel = function() {
  }, n.prototype.updateWatch = function(e) {
    var t = this;
    e === void 0 && (e = this.variables);
    var r = this.observableQuery;
    if (!(r && r.options.fetchPolicy === "no-cache")) {
      var i = x(x({}, this.getDiffOptions(e)), { watcher: this, callback: function(s) {
        return t.setDiff(s);
      } });
      (!this.lastWatch || !Se(i, this.lastWatch)) && (this.cancel(), this.cancel = this.cache.watch(this.lastWatch = i));
    }
  }, n.prototype.resetLastWrite = function() {
    this.lastWrite = void 0;
  }, n.prototype.shouldWrite = function(e, t) {
    var r = this.lastWrite;
    return !(r && r.dmCount === tn.get(this.cache) && Se(t, r.variables) && Se(e.data, r.result.data));
  }, n.prototype.markResult = function(e, t, r) {
    var i = this;
    this.graphQLErrors = Qt(e.errors) ? e.errors : [], this.reset(), t.fetchPolicy === "no-cache" ? this.updateLastDiff({ result: e.data, complete: !0 }, this.getDiffOptions(t.variables)) : r !== 0 && (Ji(e, t.errorPolicy) ? this.cache.performTransaction(function(s) {
      if (i.shouldWrite(e, t.variables))
        s.writeQuery({
          query: i.document,
          data: e.data,
          variables: t.variables,
          overwrite: r === 1
        }), i.lastWrite = {
          result: e,
          variables: t.variables,
          dmCount: tn.get(i.cache)
        };
      else if (i.lastDiff && i.lastDiff.diff.complete) {
        e.data = i.lastDiff.diff.result;
        return;
      }
      var o = i.getDiffOptions(t.variables), a = s.diff(o);
      i.stopped || i.updateWatch(t.variables), i.updateLastDiff(a, o), a.complete && (e.data = a.result);
    }) : this.lastWrite = void 0);
  }, n.prototype.markReady = function() {
    return this.networkError = null, this.networkStatus = ie.ready;
  }, n.prototype.markError = function(e) {
    return this.networkStatus = ie.error, this.lastWrite = void 0, this.reset(), e.graphQLErrors && (this.graphQLErrors = e.graphQLErrors), e.networkError && (this.networkError = e.networkError), e;
  }, n;
}();
function Ji(n, e) {
  e === void 0 && (e = "none");
  var t = e === "ignore" || e === "all", r = !mr(n);
  return !r && t && n.data && (r = !0), r;
}
var Pp = Object.prototype.hasOwnProperty, Lp = function() {
  function n(e) {
    var t = e.cache, r = e.link, i = e.queryDeduplication, s = i === void 0 ? !1 : i, o = e.onBroadcast, a = e.ssrMode, l = a === void 0 ? !1 : a, c = e.clientAwareness, u = c === void 0 ? {} : c, d = e.localState, p = e.assumeImmutableResults;
    this.clientAwareness = {}, this.queries = /* @__PURE__ */ new Map(), this.fetchCancelFns = /* @__PURE__ */ new Map(), this.transformCache = new (Wt ? WeakMap : Map)(), this.queryIdCounter = 1, this.requestIdCounter = 1, this.mutationIdCounter = 1, this.inFlightLinkObservables = /* @__PURE__ */ new Map(), this.cache = t, this.link = r, this.queryDeduplication = s, this.clientAwareness = u, this.localState = d || new $u({ cache: t }), this.ssrMode = l, this.assumeImmutableResults = !!p, (this.onBroadcast = o) && (this.mutationStore = /* @__PURE__ */ Object.create(null));
  }
  return n.prototype.stop = function() {
    var e = this;
    this.queries.forEach(function(t, r) {
      e.stopQueryNoBroadcast(r);
    }), this.cancelPendingFetches(__DEV__ ? new ne("QueryManager stopped while query was in flight") : new ne(11));
  }, n.prototype.cancelPendingFetches = function(e) {
    this.fetchCancelFns.forEach(function(t) {
      return t(e);
    }), this.fetchCancelFns.clear();
  }, n.prototype.mutate = function(e) {
    var t = e.mutation, r = e.variables, i = e.optimisticResponse, s = e.updateQueries, o = e.refetchQueries, a = o === void 0 ? [] : o, l = e.awaitRefetchQueries, c = l === void 0 ? !1 : l, u = e.update, d = e.onQueryUpdated, p = e.errorPolicy, m = p === void 0 ? "none" : p, v = e.fetchPolicy, w = v === void 0 ? "network-only" : v, _ = e.keepRootFields, E = e.context;
    return Rt(this, void 0, void 0, function() {
      var T, I, A;
      return Nt(this, function(R) {
        switch (R.label) {
          case 0:
            return __DEV__ ? D(t, "mutation option is required. You must specify your GraphQL document in the mutation option.") : D(t, 12), __DEV__ ? D(w === "network-only" || w === "no-cache", "Mutations support only 'network-only' or 'no-cache' fetchPolicy strings. The default `network-only` behavior automatically writes mutation results to the cache. Passing `no-cache` skips the cache write.") : D(w === "network-only" || w === "no-cache", 13), T = this.generateMutationId(), t = this.transform(t).document, r = this.getVariables(t, r), this.transform(t).hasClientExports ? [4, this.localState.addExportedVariables(t, r, E)] : [3, 2];
          case 1:
            r = R.sent(), R.label = 2;
          case 2:
            return I = this.mutationStore && (this.mutationStore[T] = {
              mutation: t,
              variables: r,
              loading: !0,
              error: null
            }), i && this.markMutationOptimistic(i, {
              mutationId: T,
              document: t,
              variables: r,
              fetchPolicy: w,
              errorPolicy: m,
              context: E,
              updateQueries: s,
              update: u,
              keepRootFields: _
            }), this.broadcastQueries(), A = this, [2, new Promise(function(N, M) {
              return si(A.getObservableFromLink(t, x(x({}, E), { optimisticResponse: i }), r, !1), function(B) {
                if (mr(B) && m === "none")
                  throw new Dt({
                    graphQLErrors: B.errors
                  });
                I && (I.loading = !1, I.error = null);
                var q = x({}, B);
                return typeof a == "function" && (a = a(q)), m === "ignore" && mr(q) && delete q.errors, A.markMutationResult({
                  mutationId: T,
                  result: q,
                  document: t,
                  variables: r,
                  fetchPolicy: w,
                  errorPolicy: m,
                  context: E,
                  update: u,
                  updateQueries: s,
                  awaitRefetchQueries: c,
                  refetchQueries: a,
                  removeOptimistic: i ? T : void 0,
                  onQueryUpdated: d,
                  keepRootFields: _
                });
              }).subscribe({
                next: function(B) {
                  A.broadcastQueries(), N(B);
                },
                error: function(B) {
                  I && (I.loading = !1, I.error = B), i && A.cache.removeOptimistic(T), A.broadcastQueries(), M(B instanceof Dt ? B : new Dt({
                    networkError: B
                  }));
                }
              });
            })];
        }
      });
    });
  }, n.prototype.markMutationResult = function(e, t) {
    var r = this;
    t === void 0 && (t = this.cache);
    var i = e.result, s = [], o = e.fetchPolicy === "no-cache";
    if (!o && Ji(i, e.errorPolicy)) {
      s.push({
        result: i.data,
        dataId: "ROOT_MUTATION",
        query: e.document,
        variables: e.variables
      });
      var a = e.updateQueries;
      a && this.queries.forEach(function(c, u) {
        var d = c.observableQuery, p = d && d.queryName;
        if (!(!p || !Pp.call(a, p))) {
          var m = a[p], v = r.queries.get(u), w = v.document, _ = v.variables, E = t.diff({
            query: w,
            variables: _,
            returnPartialData: !0,
            optimistic: !1
          }), T = E.result, I = E.complete;
          if (I && T) {
            var A = m(T, {
              mutationResult: i,
              queryName: w && Di(w) || void 0,
              queryVariables: _
            });
            A && s.push({
              result: A,
              dataId: "ROOT_QUERY",
              query: w,
              variables: _
            });
          }
        }
      });
    }
    if (s.length > 0 || e.refetchQueries || e.update || e.onQueryUpdated || e.removeOptimistic) {
      var l = [];
      if (this.refetchQueries({
        updateCache: function(c) {
          o || s.forEach(function(p) {
            return c.write(p);
          });
          var u = e.update;
          if (u) {
            if (!o) {
              var d = c.diff({
                id: "ROOT_MUTATION",
                query: r.transform(e.document).asQuery,
                variables: e.variables,
                optimistic: !1,
                returnPartialData: !0
              });
              d.complete && (i = x(x({}, i), { data: d.result }));
            }
            u(c, i, {
              context: e.context,
              variables: e.variables
            });
          }
          !o && !e.keepRootFields && c.modify({
            id: "ROOT_MUTATION",
            fields: function(p, m) {
              var v = m.fieldName, w = m.DELETE;
              return v === "__typename" ? p : w;
            }
          });
        },
        include: e.refetchQueries,
        optimistic: !1,
        removeOptimistic: e.removeOptimistic,
        onQueryUpdated: e.onQueryUpdated || null
      }).forEach(function(c) {
        return l.push(c);
      }), e.awaitRefetchQueries || e.onQueryUpdated)
        return Promise.all(l).then(function() {
          return i;
        });
    }
    return Promise.resolve(i);
  }, n.prototype.markMutationOptimistic = function(e, t) {
    var r = this, i = typeof e == "function" ? e(t.variables) : e;
    return this.cache.recordOptimisticTransaction(function(s) {
      try {
        r.markMutationResult(x(x({}, t), { result: { data: i } }), s);
      } catch (o) {
        __DEV__ && D.error(o);
      }
    }, t.mutationId);
  }, n.prototype.fetchQuery = function(e, t, r) {
    return this.fetchQueryObservable(e, t, r).promise;
  }, n.prototype.getQueryStore = function() {
    var e = /* @__PURE__ */ Object.create(null);
    return this.queries.forEach(function(t, r) {
      e[r] = {
        variables: t.variables,
        networkStatus: t.networkStatus,
        networkError: t.networkError,
        graphQLErrors: t.graphQLErrors
      };
    }), e;
  }, n.prototype.resetErrors = function(e) {
    var t = this.queries.get(e);
    t && (t.networkError = void 0, t.graphQLErrors = []);
  }, n.prototype.transform = function(e) {
    var t = this.transformCache;
    if (!t.has(e)) {
      var r = this.cache.transformDocument(e), i = zh(this.cache.transformForLink(r)), s = this.localState.clientQuery(r), o = i && this.localState.serverQuery(i), a = {
        document: r,
        hasClientExports: Oh(r),
        hasForcedResolvers: this.localState.shouldForceResolvers(r),
        clientQuery: s,
        serverQuery: o,
        defaultVars: us(Gn(r)),
        asQuery: x(x({}, r), { definitions: r.definitions.map(function(c) {
          return c.kind === "OperationDefinition" && c.operation !== "query" ? x(x({}, c), { operation: "query" }) : c;
        }) })
      }, l = function(c) {
        c && !t.has(c) && t.set(c, a);
      };
      l(e), l(r), l(s), l(o);
    }
    return t.get(e);
  }, n.prototype.getVariables = function(e, t) {
    return x(x({}, this.transform(e).defaultVars), t);
  }, n.prototype.watchQuery = function(e) {
    e = x(x({}, e), { variables: this.getVariables(e.query, e.variables) }), typeof e.notifyOnNetworkStatusChange > "u" && (e.notifyOnNetworkStatusChange = !1);
    var t = new yi(this), r = new Gi({
      queryManager: this,
      queryInfo: t,
      options: e
    });
    return this.queries.set(r.queryId, t), t.init({
      document: e.query,
      observableQuery: r,
      variables: e.variables
    }), r;
  }, n.prototype.query = function(e, t) {
    var r = this;
    return t === void 0 && (t = this.generateQueryId()), __DEV__ ? D(e.query, "query option is required. You must specify your GraphQL document in the query option.") : D(e.query, 14), __DEV__ ? D(e.query.kind === "Document", 'You must wrap the query string in a "gql" tag.') : D(e.query.kind === "Document", 15), __DEV__ ? D(!e.returnPartialData, "returnPartialData option only supported on watchQuery.") : D(!e.returnPartialData, 16), __DEV__ ? D(!e.pollInterval, "pollInterval option only supported on watchQuery.") : D(!e.pollInterval, 17), this.fetchQuery(t, e).finally(function() {
      return r.stopQuery(t);
    });
  }, n.prototype.generateQueryId = function() {
    return String(this.queryIdCounter++);
  }, n.prototype.generateRequestId = function() {
    return this.requestIdCounter++;
  }, n.prototype.generateMutationId = function() {
    return String(this.mutationIdCounter++);
  }, n.prototype.stopQueryInStore = function(e) {
    this.stopQueryInStoreNoBroadcast(e), this.broadcastQueries();
  }, n.prototype.stopQueryInStoreNoBroadcast = function(e) {
    var t = this.queries.get(e);
    t && t.stop();
  }, n.prototype.clearStore = function(e) {
    return e === void 0 && (e = {
      discardWatches: !0
    }), this.cancelPendingFetches(__DEV__ ? new ne("Store reset while query was in flight (not completed in link chain)") : new ne(18)), this.queries.forEach(function(t) {
      t.observableQuery ? t.networkStatus = ie.loading : t.stop();
    }), this.mutationStore && (this.mutationStore = /* @__PURE__ */ Object.create(null)), this.cache.reset(e);
  }, n.prototype.getObservableQueries = function(e) {
    var t = this;
    e === void 0 && (e = "active");
    var r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
    return Array.isArray(e) && e.forEach(function(o) {
      typeof o == "string" ? i.set(o, !1) : Dh(o) ? i.set(t.transform(o).document, !1) : ue(o) && o.query && s.add(o);
    }), this.queries.forEach(function(o, a) {
      var l = o.observableQuery, c = o.document;
      if (l) {
        if (e === "all") {
          r.set(a, l);
          return;
        }
        var u = l.queryName, d = l.options.fetchPolicy;
        if (d === "standby" || e === "active" && !l.hasObservers())
          return;
        (e === "active" || u && i.has(u) || c && i.has(c)) && (r.set(a, l), u && i.set(u, !0), c && i.set(c, !0));
      }
    }), s.size && s.forEach(function(o) {
      var a = Pi("legacyOneTimeQuery"), l = t.getQuery(a).init({
        document: o.query,
        variables: o.variables
      }), c = new Gi({
        queryManager: t,
        queryInfo: l,
        options: x(x({}, o), { fetchPolicy: "network-only" })
      });
      D(c.queryId === a), l.setObservableQuery(c), r.set(a, c);
    }), __DEV__ && i.size && i.forEach(function(o, a) {
      o || __DEV__ && D.warn("Unknown query ".concat(typeof a == "string" ? "named " : "").concat(JSON.stringify(a, null, 2), " requested in refetchQueries options.include array"));
    }), r;
  }, n.prototype.reFetchObservableQueries = function(e) {
    var t = this;
    e === void 0 && (e = !1);
    var r = [];
    return this.getObservableQueries(e ? "all" : "active").forEach(function(i, s) {
      var o = i.options.fetchPolicy;
      i.resetLastResults(), (e || o !== "standby" && o !== "cache-only") && r.push(i.refetch()), t.getQuery(s).setDiff(null);
    }), this.broadcastQueries(), Promise.all(r);
  }, n.prototype.setObservableQuery = function(e) {
    this.getQuery(e.queryId).setObservableQuery(e);
  }, n.prototype.startGraphQLSubscription = function(e) {
    var t = this, r = e.query, i = e.fetchPolicy, s = e.errorPolicy, o = e.variables, a = e.context, l = a === void 0 ? {} : a;
    r = this.transform(r).document, o = this.getVariables(r, o);
    var c = function(d) {
      return t.getObservableFromLink(r, l, d).map(function(p) {
        if (i !== "no-cache" && (Ji(p, s) && t.cache.write({
          query: r,
          result: p.data,
          dataId: "ROOT_SUBSCRIPTION",
          variables: d
        }), t.broadcastQueries()), mr(p))
          throw new Dt({
            graphQLErrors: p.errors
          });
        return p;
      });
    };
    if (this.transform(r).hasClientExports) {
      var u = this.localState.addExportedVariables(r, o, l).then(c);
      return new ee(function(d) {
        var p = null;
        return u.then(function(m) {
          return p = m.subscribe(d);
        }, d.error), function() {
          return p && p.unsubscribe();
        };
      });
    }
    return c(o);
  }, n.prototype.stopQuery = function(e) {
    this.stopQueryNoBroadcast(e), this.broadcastQueries();
  }, n.prototype.stopQueryNoBroadcast = function(e) {
    this.stopQueryInStoreNoBroadcast(e), this.removeQuery(e);
  }, n.prototype.removeQuery = function(e) {
    this.fetchCancelFns.delete(e), this.getQuery(e).stop(), this.queries.delete(e);
  }, n.prototype.broadcastQueries = function() {
    this.onBroadcast && this.onBroadcast(), this.queries.forEach(function(e) {
      return e.notify();
    });
  }, n.prototype.getLocalState = function() {
    return this.localState;
  }, n.prototype.getObservableFromLink = function(e, t, r, i) {
    var s = this, o;
    i === void 0 && (i = (o = t?.queryDeduplication) !== null && o !== void 0 ? o : this.queryDeduplication);
    var a, l = this.transform(e).serverQuery;
    if (l) {
      var c = this, u = c.inFlightLinkObservables, d = c.link, p = {
        query: l,
        variables: r,
        operationName: Di(l) || void 0,
        context: this.prepareContext(x(x({}, t), { forceFetch: !i }))
      };
      if (t = p.context, i) {
        var m = u.get(l) || /* @__PURE__ */ new Map();
        u.set(l, m);
        var v = Ut(r);
        if (a = m.get(v), !a) {
          var w = new Cn([
            Li(d, p)
          ]);
          m.set(v, a = w), w.cleanup(function() {
            m.delete(v) && m.size < 1 && u.delete(l);
          });
        }
      } else
        a = new Cn([
          Li(d, p)
        ]);
    } else
      a = new Cn([
        ee.of({ data: {} })
      ]), t = this.prepareContext(t);
    var _ = this.transform(e).clientQuery;
    return _ && (a = si(a, function(E) {
      return s.localState.runResolvers({
        document: _,
        remoteResult: E,
        context: t,
        variables: r
      });
    })), a;
  }, n.prototype.getResultsFromLink = function(e, t, r) {
    var i = e.lastRequestId = this.generateRequestId();
    return si(this.getObservableFromLink(e.document, r.context, r.variables), function(s) {
      var o = Qt(s.errors);
      if (i >= e.lastRequestId) {
        if (o && r.errorPolicy === "none")
          throw e.markError(new Dt({
            graphQLErrors: s.errors
          }));
        e.markResult(s, r, t), e.markReady();
      }
      var a = {
        data: s.data,
        loading: !1,
        networkStatus: e.networkStatus || ie.ready
      };
      return o && r.errorPolicy !== "ignore" && (a.errors = s.errors), a;
    }, function(s) {
      var o = Np(s) ? s : new Dt({ networkError: s });
      throw i >= e.lastRequestId && e.markError(o), o;
    });
  }, n.prototype.fetchQueryObservable = function(e, t, r) {
    var i = this;
    r === void 0 && (r = ie.loading);
    var s = this.transform(t.query).document, o = this.getVariables(s, t.variables), a = this.getQuery(e), l = t.fetchPolicy, c = l === void 0 ? "cache-first" : l, u = t.errorPolicy, d = u === void 0 ? "none" : u, p = t.returnPartialData, m = p === void 0 ? !1 : p, v = t.notifyOnNetworkStatusChange, w = v === void 0 ? !1 : v, _ = t.context, E = _ === void 0 ? {} : _, T = Object.assign({}, t, {
      query: s,
      variables: o,
      fetchPolicy: c,
      errorPolicy: d,
      returnPartialData: m,
      notifyOnNetworkStatusChange: w,
      context: E
    }), I = function(R) {
      return T.variables = R, i.fetchQueryByPolicy(a, T, r);
    };
    this.fetchCancelFns.set(e, function(R) {
      setTimeout(function() {
        return A.cancel(R);
      });
    });
    var A = new Cn(this.transform(T.query).hasClientExports ? this.localState.addExportedVariables(T.query, T.variables, T.context).then(I) : I(T.variables));
    return A.cleanup(function() {
      i.fetchCancelFns.delete(e), Bp(t);
    }), A;
  }, n.prototype.refetchQueries = function(e) {
    var t = this, r = e.updateCache, i = e.include, s = e.optimistic, o = s === void 0 ? !1 : s, a = e.removeOptimistic, l = a === void 0 ? o ? Pi("refetchQueries") : void 0 : a, c = e.onQueryUpdated, u = /* @__PURE__ */ new Map();
    i && this.getObservableQueries(i).forEach(function(p, m) {
      u.set(m, {
        oq: p,
        lastDiff: t.getQuery(m).getDiff()
      });
    });
    var d = /* @__PURE__ */ new Map();
    return r && this.cache.batch({
      update: r,
      optimistic: o && l || !1,
      removeOptimistic: l,
      onWatchUpdated: function(p, m, v) {
        var w = p.watcher instanceof yi && p.watcher.observableQuery;
        if (w) {
          if (c) {
            u.delete(w.queryId);
            var _ = c(w, m, v);
            return _ === !0 && (_ = w.refetch()), _ !== !1 && d.set(w, _), _;
          }
          c !== null && u.set(w.queryId, { oq: w, lastDiff: v, diff: m });
        }
      }
    }), u.size && u.forEach(function(p, m) {
      var v = p.oq, w = p.lastDiff, _ = p.diff, E;
      if (c) {
        if (!_) {
          var T = v.queryInfo;
          T.reset(), _ = T.getDiff();
        }
        E = c(v, _, w);
      }
      (!c || E === !0) && (E = v.refetch()), E !== !1 && d.set(v, E), m.indexOf("legacyOneTimeQuery") >= 0 && t.stopQueryNoBroadcast(m);
    }), l && this.cache.removeOptimistic(l), d;
  }, n.prototype.fetchQueryByPolicy = function(e, t, r) {
    var i = this, s = t.query, o = t.variables, a = t.fetchPolicy, l = t.refetchWritePolicy, c = t.errorPolicy, u = t.returnPartialData, d = t.context, p = t.notifyOnNetworkStatusChange, m = e.networkStatus;
    e.init({
      document: s,
      variables: o,
      networkStatus: r
    });
    var v = function() {
      return e.getDiff(o);
    }, w = function(A, R) {
      R === void 0 && (R = e.networkStatus || ie.loading);
      var N = A.result;
      __DEV__ && !u && !Se(N, {}) && Fu(A.missing);
      var M = function(B) {
        return ee.of(x({ data: B, loading: Vn(R), networkStatus: R }, A.complete ? null : { partial: !0 }));
      };
      return N && i.transform(s).hasForcedResolvers ? i.localState.runResolvers({
        document: s,
        remoteResult: { data: N },
        context: d,
        variables: o,
        onlyRunForcedResolvers: !0
      }).then(function(B) {
        return M(B.data || void 0);
      }) : M(N);
    }, _ = a === "no-cache" ? 0 : r === ie.refetch && l !== "merge" ? 1 : 2, E = function() {
      return i.getResultsFromLink(e, _, {
        variables: o,
        context: d,
        fetchPolicy: a,
        errorPolicy: c
      });
    }, T = p && typeof m == "number" && m !== r && Vn(r);
    switch (a) {
      default:
      case "cache-first": {
        var I = v();
        return I.complete ? [
          w(I, e.markReady())
        ] : u || T ? [
          w(I),
          E()
        ] : [
          E()
        ];
      }
      case "cache-and-network": {
        var I = v();
        return I.complete || u || T ? [
          w(I),
          E()
        ] : [
          E()
        ];
      }
      case "cache-only":
        return [
          w(v(), e.markReady())
        ];
      case "network-only":
        return T ? [
          w(v()),
          E()
        ] : [E()];
      case "no-cache":
        return T ? [
          w(e.getDiff()),
          E()
        ] : [E()];
      case "standby":
        return [];
    }
  }, n.prototype.getQuery = function(e) {
    return e && !this.queries.has(e) && this.queries.set(e, new yi(this, e)), this.queries.get(e);
  }, n.prototype.prepareContext = function(e) {
    e === void 0 && (e = {});
    var t = this.localState.prepareContext(e);
    return x(x({}, t), { clientAwareness: this.clientAwareness });
  }, n;
}(), sa = !1;
function mi(n, e) {
  return qn(n, e, e.variables && {
    variables: x(x({}, n.variables), e.variables)
  });
}
var Up = function() {
  function n(e) {
    var t = this;
    this.defaultOptions = {}, this.resetStoreCallbacks = [], this.clearStoreCallbacks = [];
    var r = e.uri, i = e.credentials, s = e.headers, o = e.cache, a = e.ssrMode, l = a === void 0 ? !1 : a, c = e.ssrForceFetchDelay, u = c === void 0 ? 0 : c, d = e.connectToDevTools, p = d === void 0 ? typeof window == "object" && !window.__APOLLO_CLIENT__ && __DEV__ : d, m = e.queryDeduplication, v = m === void 0 ? !0 : m, w = e.defaultOptions, _ = e.assumeImmutableResults, E = _ === void 0 ? !1 : _, T = e.resolvers, I = e.typeDefs, A = e.fragmentMatcher, R = e.name, N = e.version, M = e.link;
    if (M || (M = r ? new Ff({ uri: r, credentials: i, headers: s }) : Qe.empty()), !o)
      throw __DEV__ ? new ne(`To initialize Apollo Client, you must specify a 'cache' property in the options object. 
For more information, please visit: https://go.apollo.dev/c/docs`) : new ne(7);
    if (this.link = M, this.cache = o, this.disableNetworkFetches = l || u > 0, this.queryDeduplication = v, this.defaultOptions = w || {}, this.typeDefs = I, u && setTimeout(function() {
      return t.disableNetworkFetches = !1;
    }, u), this.watchQuery = this.watchQuery.bind(this), this.query = this.query.bind(this), this.mutate = this.mutate.bind(this), this.resetStore = this.resetStore.bind(this), this.reFetchObservableQueries = this.reFetchObservableQueries.bind(this), p && typeof window == "object" && (window.__APOLLO_CLIENT__ = this), !sa && __DEV__ && (sa = !0, typeof window < "u" && window.document && window.top === window.self && !window.__APOLLO_DEVTOOLS_GLOBAL_HOOK__)) {
      var B = window.navigator, q = B && B.userAgent, z = void 0;
      typeof q == "string" && (q.indexOf("Chrome/") > -1 ? z = "https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm" : q.indexOf("Firefox/") > -1 && (z = "https://addons.mozilla.org/en-US/firefox/addon/apollo-developer-tools/")), z && __DEV__ && D.log("Download the Apollo DevTools for a better development experience: " + z);
    }
    this.version = Ef, this.localState = new $u({
      cache: o,
      client: this,
      resolvers: T,
      fragmentMatcher: A
    }), this.queryManager = new Lp({
      cache: this.cache,
      link: this.link,
      queryDeduplication: v,
      ssrMode: l,
      clientAwareness: {
        name: R,
        version: N
      },
      localState: this.localState,
      assumeImmutableResults: E,
      onBroadcast: p ? function() {
        t.devToolsHookCb && t.devToolsHookCb({
          action: {},
          state: {
            queries: t.queryManager.getQueryStore(),
            mutations: t.queryManager.mutationStore || {}
          },
          dataWithOptimisticResults: t.cache.extract(!0)
        });
      } : void 0
    });
  }
  return n.prototype.stop = function() {
    this.queryManager.stop();
  }, n.prototype.watchQuery = function(e) {
    return this.defaultOptions.watchQuery && (e = mi(this.defaultOptions.watchQuery, e)), this.disableNetworkFetches && (e.fetchPolicy === "network-only" || e.fetchPolicy === "cache-and-network") && (e = x(x({}, e), { fetchPolicy: "cache-first" })), this.queryManager.watchQuery(e);
  }, n.prototype.query = function(e) {
    return this.defaultOptions.query && (e = mi(this.defaultOptions.query, e)), __DEV__ ? D(e.fetchPolicy !== "cache-and-network", "The cache-and-network fetchPolicy does not work with client.query, because client.query can only return a single result. Please use client.watchQuery to receive multiple results from the cache and the network, or consider using a different fetchPolicy, such as cache-first or network-only.") : D(e.fetchPolicy !== "cache-and-network", 8), this.disableNetworkFetches && e.fetchPolicy === "network-only" && (e = x(x({}, e), { fetchPolicy: "cache-first" })), this.queryManager.query(e);
  }, n.prototype.mutate = function(e) {
    return this.defaultOptions.mutate && (e = mi(this.defaultOptions.mutate, e)), this.queryManager.mutate(e);
  }, n.prototype.subscribe = function(e) {
    return this.queryManager.startGraphQLSubscription(e);
  }, n.prototype.readQuery = function(e, t) {
    return t === void 0 && (t = !1), this.cache.readQuery(e, t);
  }, n.prototype.readFragment = function(e, t) {
    return t === void 0 && (t = !1), this.cache.readFragment(e, t);
  }, n.prototype.writeQuery = function(e) {
    this.cache.writeQuery(e), this.queryManager.broadcastQueries();
  }, n.prototype.writeFragment = function(e) {
    this.cache.writeFragment(e), this.queryManager.broadcastQueries();
  }, n.prototype.__actionHookForDevTools = function(e) {
    this.devToolsHookCb = e;
  }, n.prototype.__requestRaw = function(e) {
    return Li(this.link, e);
  }, n.prototype.resetStore = function() {
    var e = this;
    return Promise.resolve().then(function() {
      return e.queryManager.clearStore({
        discardWatches: !1
      });
    }).then(function() {
      return Promise.all(e.resetStoreCallbacks.map(function(t) {
        return t();
      }));
    }).then(function() {
      return e.reFetchObservableQueries();
    });
  }, n.prototype.clearStore = function() {
    var e = this;
    return Promise.resolve().then(function() {
      return e.queryManager.clearStore({
        discardWatches: !0
      });
    }).then(function() {
      return Promise.all(e.clearStoreCallbacks.map(function(t) {
        return t();
      }));
    });
  }, n.prototype.onResetStore = function(e) {
    var t = this;
    return this.resetStoreCallbacks.push(e), function() {
      t.resetStoreCallbacks = t.resetStoreCallbacks.filter(function(r) {
        return r !== e;
      });
    };
  }, n.prototype.onClearStore = function(e) {
    var t = this;
    return this.clearStoreCallbacks.push(e), function() {
      t.clearStoreCallbacks = t.clearStoreCallbacks.filter(function(r) {
        return r !== e;
      });
    };
  }, n.prototype.reFetchObservableQueries = function(e) {
    return this.queryManager.reFetchObservableQueries(e);
  }, n.prototype.refetchQueries = function(e) {
    var t = this.queryManager.refetchQueries(e), r = [], i = [];
    t.forEach(function(o, a) {
      r.push(a), i.push(o);
    });
    var s = Promise.all(i);
    return s.queries = r, s.results = i, s.catch(function(o) {
      __DEV__ && D.debug("In client.refetchQueries, Promise.all promise rejected with error ".concat(o));
    }), s;
  }, n.prototype.getObservableQueries = function(e) {
    return e === void 0 && (e = "active"), this.queryManager.getObservableQueries(e);
  }, n.prototype.extract = function(e) {
    return this.cache.extract(e);
  }, n.prototype.restore = function(e) {
    return this.cache.restore(e);
  }, n.prototype.addResolvers = function(e) {
    this.localState.addResolvers(e);
  }, n.prototype.setResolvers = function(e) {
    this.localState.setResolvers(e);
  }, n.prototype.getResolvers = function() {
    return this.localState.getResolvers();
  }, n.prototype.setLocalStateFragmentMatcher = function(e) {
    this.localState.setFragmentMatcher(e);
  }, n.prototype.setLink = function(e) {
    this.link = this.queryManager.link = e;
  }, n;
}(), vr = /* @__PURE__ */ new Map(), Yi = /* @__PURE__ */ new Map(), Bu = !0, Ir = !1;
function Pu(n) {
  return n.replace(/[\s,]+/g, " ").trim();
}
function qp(n) {
  return Pu(n.source.body.substring(n.start, n.end));
}
function jp(n) {
  var e = /* @__PURE__ */ new Set(), t = [];
  return n.definitions.forEach(function(r) {
    if (r.kind === "FragmentDefinition") {
      var i = r.name.value, s = qp(r.loc), o = Yi.get(i);
      o && !o.has(s) ? Bu && console.warn("Warning: fragment with name " + i + ` already exists.
graphql-tag enforces all fragment names across your application to be unique; read more about
this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names`) : o || Yi.set(i, o = /* @__PURE__ */ new Set()), o.add(s), e.has(s) || (e.add(s), t.push(r));
    } else
      t.push(r);
  }), x(x({}, n), { definitions: t });
}
function Vp(n) {
  var e = new Set(n.definitions);
  e.forEach(function(r) {
    r.loc && delete r.loc, Object.keys(r).forEach(function(i) {
      var s = r[i];
      s && typeof s == "object" && e.add(s);
    });
  });
  var t = n.loc;
  return t && (delete t.startToken, delete t.endToken), n;
}
function Qp(n) {
  var e = Pu(n);
  if (!vr.has(e)) {
    var t = gh(n, {
      experimentalFragmentVariables: Ir,
      allowLegacyFragmentVariables: Ir
    });
    if (!t || t.kind !== "Document")
      throw new Error("Not a valid GraphQL document.");
    vr.set(e, Vp(jp(t)));
  }
  return vr.get(e);
}
function se(n) {
  for (var e = [], t = 1; t < arguments.length; t++)
    e[t - 1] = arguments[t];
  typeof n == "string" && (n = [n]);
  var r = n[0];
  return e.forEach(function(i, s) {
    i && i.kind === "Document" ? r += i.loc.source.body : r += i, r += n[s + 1];
  }), Qp(r);
}
function Hp() {
  vr.clear(), Yi.clear();
}
function Wp() {
  Bu = !1;
}
function Kp() {
  Ir = !0;
}
function zp() {
  Ir = !1;
}
var Tn = {
  gql: se,
  resetCaches: Hp,
  disableFragmentWarnings: Wp,
  enableExperimentalFragmentVariables: Kp,
  disableExperimentalFragmentVariables: zp
};
(function(n) {
  n.gql = Tn.gql, n.resetCaches = Tn.resetCaches, n.disableFragmentWarnings = Tn.disableFragmentWarnings, n.enableExperimentalFragmentVariables = Tn.enableExperimentalFragmentVariables, n.disableExperimentalFragmentVariables = Tn.disableExperimentalFragmentVariables;
})(se);
se.default = se;
class Gp extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = se`query ($bundle: String!) {
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
    return new Rl({
      query: this,
      json: e
    });
  }
}
class Jp extends be {
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
    return e.forEach((r) => {
      r.metas = _r.aggregateMeta(r.metas), t[r.bundleHash] = r;
    }), t;
  }
}
class Yp extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = se`query( $bundleHashes: [ String! ] ) {
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
    return new Jp({
      query: this,
      json: e
    });
  }
}
class Vr extends be {
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
    let r;
    if (e.position === null || typeof e.position > "u" ? r = J.create({
      bundle: e.bundleHash,
      token: e.tokenSlug,
      batchId: e.batchId,
      characters: e.characters
    }) : (r = new J({
      secret: t,
      token: e.tokenSlug,
      position: e.position,
      batchId: e.batchId,
      characters: e.characters
    }), r.address = e.address, r.bundle = e.bundleHash), e.token && (r.tokenName = e.token.name, r.tokenAmount = e.token.amount, r.tokenSupply = e.token.supply, r.tokenFungibility = e.token.fungibility), e.tokenUnits.length)
      for (const i of e.tokenUnits)
        r.tokenUnits.push($n.createFromGraphQL(i));
    if (e.tradeRates.length)
      for (const i of e.tradeRates)
        r.tradeRates[i.tokenSlug] = i.amount;
    return r.balance = Number(e.amount), r.pubkey = e.pubkey, r.createdAt = e.createdAt, r;
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
    const r = [];
    for (const i of t)
      r.push(Vr.toClientWallet({
        data: i,
        secret: e
      }));
    return r;
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
class Xp extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = se`query( $bundleHash: String, $tokenSlug: String ) {
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
    return new Vr({
      query: this,
      json: e
    });
  }
}
class Zp extends be {
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
    const e = this.data();
    return !e || !e.bundleHash || !e.tokenSlug ? null : Vr.toClientWallet({
      data: e
    });
  }
}
class ed extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = se`query( $address: String, $bundleHash: String, $type: String, $token: String, $position: String ) {
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
    return new Zp({
      query: this,
      json: e
    });
  }
}
class td extends be {
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
    }, r = e.pop();
    return r.instances && (t.instances = r.instances), r.instanceCount && (t.instanceCount = r.instanceCount), r.paginatorInfo && (t.paginatorInfo = r.paginatorInfo), t;
  }
}
class oa extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = se`query( $metaType: String, $metaTypes: [ String! ], $metaId: String, $metaIds: [ String! ], $key: String, $keys: [ String! ], $value: String, $values: [ String! ], $count: String, $latest: Boolean, $filter: [ MetaFilter! ], $queryArgs: QueryArgs, $countBy: String ) {
      MetaType( metaType: $metaType, metaTypes: $metaTypes, metaId: $metaId, metaIds: $metaIds, key: $key, keys: $keys, value: $value, values: $values, count: $count, filter: $filter, queryArgs: $queryArgs, countBy: $countBy ) {
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
   * @return {{}}
   */
  static createVariables({
    metaType: e = null,
    metaId: t = null,
    key: r = null,
    value: i = null,
    latest: s = null,
    filter: o = null,
    queryArgs: a = null,
    count: l = null,
    countBy: c = null
  }) {
    const u = {};
    return e && (u[typeof e == "string" ? "metaType" : "metaTypes"] = e), t && (u[typeof t == "string" ? "metaId" : "metaIds"] = t), r && (u[typeof r == "string" ? "key" : "keys"] = r), i && (u[typeof i == "string" ? "value" : "values"] = i), u.latest = s === !0, o && (u.filter = o), a && ((typeof a.limit > "u" || a.limit === 0) && (a.limit = "*"), u.queryArgs = a), l && (u.count = l), c && (u.countBy = c), u;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaType}
   */
  createResponse(e) {
    return new td({
      query: this,
      json: e
    });
  }
}
class Qn extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = se`query( $batchId: String ) {
      Batch( batchId: $batchId ) {
        ${Qn.getFields()},
        children {
          ${Qn.getFields()}
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
    const t = new be({
      query: this,
      json: e
    });
    return t.dataKey = "data.Batch", t;
  }
}
class nd extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = se`query( $batchId: String ) {
      BatchHistory( batchId: $batchId ) {
        ${Qn.getFields()}
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
    const t = new be({
      query: this,
      json: e
    });
    return t.dataKey = "data.BatchHistory", t;
  }
}
class ot extends be {
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
    const e = he.get(this.data(), "payload");
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
    const t = new lt({});
    return t.molecularHash = he.get(e, "molecularHash"), t.status = he.get(e, "status"), t.createdAt = he.get(e, "createdAt"), t;
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
    return he.get(this.data(), "status", "rejected");
  }
  /**
   * Returns the reason for rejection
   *
   * @return {string}
   */
  reason() {
    return he.get(this.data(), "reason", "Invalid response from server");
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
class Ss extends $e {
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
    const r = {
      ...t,
      ...this.createQueryContext()
    };
    try {
      const i = {
        ...this.$__request,
        context: r
      }, s = await this.client.mutate(i);
      return this.$__response = await this.createResponseRaw(s), this.$__response;
    } catch (i) {
      if (i.name === "AbortError")
        return this.knishIOClient.log("warn", "Mutation was cancelled"), new be({
          query: this,
          json: { data: null, errors: [{ message: "Mutation was cancelled" }] }
        });
      throw i;
    }
  }
  createQueryContext() {
    return {};
  }
}
class Re extends Ss {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   * @param molecule
   */
  constructor(e, t, r) {
    super(e, t), this.$__molecule = r, this.$__remainderWallet = null, this.$__query = se`mutation( $molecule: MoleculeInput! ) {
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
    return new ot({
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
class rd extends ot {
  /**
   * return the authorization key
   *
   * @param key
   * @return {*}
   */
  payloadKey(e) {
    if (!he.has(this.payload(), e))
      throw new Nn(`ResponseRequestAuthorization::payloadKey() - '${e}' key was not found in the payload!`);
    return he.get(this.payload(), e);
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
class id extends Re {
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
    return new rd({
      query: this,
      json: e
    });
  }
}
class sd extends ot {
}
class od extends Re {
  /**
   * @param {Wallet|null} recipientWallet
   * @param {number|null} amount
   * @param {object|null} meta
   */
  fillMolecule({
    recipientWallet: e,
    amount: t,
    meta: r = null
  }) {
    this.$__molecule.initTokenCreation({
      recipientWallet: e,
      amount: t,
      meta: r || {}
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
    return new sd({
      query: this,
      json: e
    });
  }
}
class ad extends ot {
}
class ud extends Re {
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
    metaType: r,
    metaId: i,
    meta: s = null,
    batchId: o = null
  }) {
    this.$__molecule.initTokenRequest({
      token: e,
      amount: t,
      metaType: r,
      metaId: i,
      meta: s || {},
      batchId: o
    }), this.$__molecule.sign({}), this.$__molecule.check();
  }
  /**
   * Builds a Response object out of a JSON string
   *
   * @param {object} json
   * @return {ResponseRequestTokens}
   */
  createResponse(e) {
    return new ad({
      query: this,
      json: e
    });
  }
}
class cd extends ot {
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
class ld extends Re {
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
    return new cd({
      query: this,
      json: e
    });
  }
}
class hd extends ot {
}
class fd extends Re {
  fillMolecule({
    type: e,
    contact: t,
    code: r
  }) {
    this.$__molecule.initIdentifierCreation({
      type: e,
      contact: t,
      code: r
    }), this.$__molecule.sign({}), this.$__molecule.check();
  }
  /**
   * Builds a Response object out of a JSON string
   *
   * @param {object} json
   * @return {ResponseCreateIdentifier}
   */
  createResponse(e) {
    return new hd({
      query: this,
      json: e
    });
  }
}
class pd extends ot {
}
class dd extends Re {
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
    const r = J.create({
      secret: this.$__molecule.secret,
      bundle: this.$__molecule.bundle,
      token: e,
      batchId: t
    });
    this.$__molecule.initShadowWalletClaim(r), this.$__molecule.sign({}), this.$__molecule.check();
  }
  /**
   * Builds a Response object out of a JSON string
   *
   * @param {object} json
   * @return {ResponseClaimShadowWallet}
   */
  createResponse(e) {
    return new pd({
      query: this,
      json: e
    });
  }
}
class yd extends ot {
}
class md extends Re {
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
    meta: r,
    policy: i
  }) {
    this.$__molecule.initMeta({
      meta: r,
      metaType: e,
      metaId: t,
      policy: i
    }), this.$__molecule.sign({}), this.$__molecule.check();
  }
  /**
   * Builds a new Response object from a JSON string
   *
   * @param {object} json
   * @return {ResponseCreateMeta}
   */
  createResponse(e) {
    return new yd({
      query: this,
      json: e
    });
  }
}
class gd extends ot {
}
class vd extends Re {
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
    return new gd({
      query: this,
      json: e
    });
  }
}
class bd extends be {
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
    if (!he.has(this.payload(), e))
      throw new Nn(`ResponseAuthorizationGuest::payloadKey() - '${e}' key is not found in the payload!`);
    return he.get(this.payload(), e);
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
class wd extends Ss {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = se`mutation( $cellSlug: String, $pubkey: String, $encrypt: Boolean ) {
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
    return new bd({
      query: this,
      json: e
    });
  }
}
class aa extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "The shadow wallet does not exist", t = null, r = null) {
    super(e, t, r), this.name = "WalletShadowException";
  }
}
class _d extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Stackable tokens with unit IDs cannot have decimal places!", t = null, r = null) {
    super(e, t, r), this.name = "StackableUnitDecimalsException";
  }
}
class or extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Stackable tokens with unit IDs cannot have an amount!", t = null, r = null) {
    super(e, t, r), this.name = "StackableUnitAmountException";
  }
}
class Qr {
  /**
   *
   * @param {ApolloClientWrapper} apolloClient
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
      throw new je("Subscribe::createSubscribe() - Node URI was not initialized for this client instance!");
    if (this.$__subscribe === null)
      throw new je("Subscribe::createSubscribe() - GraphQL subscription was not initialized!");
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
      throw new je(`${this.constructor.name}::execute() - closure parameter is required!`);
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
class Ed extends Qr {
  constructor(e) {
    super(e), this.$__subscribe = se`
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
class Sd extends Qr {
  constructor(e) {
    super(e), this.$__subscribe = se`
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
class kd extends Qr {
  constructor(e) {
    super(e), this.$__subscribe = se`
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
class xd extends Qr {
  constructor(e) {
    super(e), this.$__subscribe = se`
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
class Td extends be {
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
class Ad extends Ss {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = se`mutation(
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
    return new Td({
      query: this,
      json: e
    });
  }
}
class Id extends be {
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
    for (const r of e) {
      const i = { ...r };
      i.jsonData && (i.jsonData = JSON.parse(i.jsonData)), i.createdAt && (i.createdAt = new Date(i.createdAt)), i.updatedAt && (i.updatedAt = new Date(i.updatedAt)), t.push(i);
    }
    return t;
  }
}
class Od extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = se`query ActiveUserQuery ($bundleHash:String, $metaType: String, $metaId: String) {
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
    return new Id({
      query: this,
      json: e
    });
  }
}
class Cd extends be {
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
class Rd extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = se`query UserActivity (
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
    return new Cd({
      query: this,
      json: e
    });
  }
}
class Nd extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = se`query( $slug: String, $slugs: [ String! ], $limit: Int, $order: String ) {
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
    return new be({
      query: this,
      json: e,
      dataKey: "data.Token"
    });
  }
}
class ua extends re {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Authorization attempt rejected by ledger.", t = null, r = null) {
    super(e, t, r), this.name = "AuthorizationRejectedException";
  }
}
class Dd extends be {
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
      for (const r in t.instances) {
        const i = t.instances[r];
        i.metasJson && (t.instances[r].metas = JSON.parse(i.metasJson));
      }
    }
    return e.instanceCount && (t.instanceCount = e.instanceCount), e.paginatorInfo && (t.paginatorInfo = e.paginatorInfo), t;
  }
  metas() {
    const e = this.payload(), t = [];
    if (e && e.instances)
      for (const r of e.instances)
        r.metasJson && t.push(JSON.parse(r.metasJson));
    return t;
  }
}
class ca extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = se`query(
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
    bundleHashes: r,
    bundleHash: i,
    positions: s,
    position: o,
    walletAddresses: a,
    walletAddress: l,
    isotopes: c,
    isotope: u,
    tokenSlugs: d,
    tokenSlug: p,
    cellSlugs: m,
    cellSlug: v,
    batchIds: w,
    batchId: _,
    values: E,
    value: T,
    metaTypes: I,
    metaType: A,
    metaIds: R,
    metaId: N,
    indexes: M,
    index: B,
    filter: q,
    latest: z,
    queryArgs: Y
  }) {
    return t && (e = e || [], e.push(t)), i && (r = r || [], r.push(i)), o && (s = s || [], s.push(o)), l && (a = a || [], a.push(l)), u && (c = c || [], c.push(u)), p && (d = d || [], d.push(p)), v && (m = m || [], m.push(v)), _ && (w = w || [], w.push(_)), T && (E = E || [], E.push(T)), A && (I = I || [], I.push(A)), N && (R = R || [], R.push(N)), B && (M = M || [], M.push(B)), {
      molecularHashes: e,
      bundleHashes: r,
      positions: s,
      walletAddresses: a,
      isotopes: c,
      tokenSlugs: d,
      cellSlugs: m,
      batchIds: w,
      values: E,
      metaTypes: I,
      metaIds: R,
      indexes: M,
      filter: q,
      latest: z,
      queryArgs: Y
    };
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseAtom}
   */
  createResponse(e) {
    return new Dd({
      query: this,
      json: e
    });
  }
}
class Md extends be {
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
class Fd extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = se`query( $metaType: String, $metaId: String, ) {
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
    return new Md({
      query: this,
      json: e
    });
  }
}
class $d extends be {
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
    }, r = e.pop();
    return r.instances && (t.instances = r.instances), r.instanceCount && (t.instanceCount = r.instanceCount), r.paginatorInfo && (t.paginatorInfo = r.paginatorInfo), t;
  }
}
class la extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = se`query ($metaTypes: [String!], $metaIds: [String!], $values: [String!], $keys: [String!], $latest: Boolean, $filter: [MetaFilter!], $queryArgs: QueryArgs, $countBy: String, $atomValues: [String!] ) {
      MetaTypeViaAtom(
        metaTypes: $metaTypes
        metaIds: $metaIds
        atomValues: $atomValues
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
   * @return {{}}
   */
  static createVariables({
    metaType: e = null,
    metaId: t = null,
    key: r = null,
    value: i = null,
    keys: s = null,
    values: o = null,
    atomValues: a = null,
    latest: l = null,
    filter: c = null,
    queryArgs: u = null,
    countBy: d = null
  }) {
    const p = {};
    return a && (p.atomValues = a), s && (p.keys = s), o && (p.values = o), e && (p.metaTypes = typeof e == "string" ? [e] : e), t && (p.metaIds = typeof t == "string" ? [t] : t), d && (p.countBy = d), c && (p.filter = c), r && i && (p.filter = p.filter || [], p.filter.push({
      key: r,
      value: i,
      comparison: "="
    })), p.latest = l === !0, u && ((typeof u.limit > "u" || u.limit === 0) && (u.limit = "*"), p.queryArgs = u), p;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaTypeViaAtom}
   */
  createResponse(e) {
    return new $d({
      query: this,
      json: e
    });
  }
}
class Bd extends ot {
}
class Pd extends Re {
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
    rule: r,
    policy: i
  }) {
    this.$__molecule.createRule({
      metaType: e,
      metaId: t,
      rule: r,
      policy: i
    }), this.$__molecule.sign({}), this.$__molecule.check();
  }
  /**
   * Builds a new Response object from a JSON string
   *
   * @param {object} json
   * @return {ResponseCreateRule}
   */
  createResponse(e) {
    return new Bd({
      query: this,
      json: e
    });
  }
}
class Ld extends Re {
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
class Ud extends Re {
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
function pt(n, e, t, r) {
  return new (t || (t = Promise))(function(i, s) {
    function o(c) {
      try {
        l(r.next(c));
      } catch (u) {
        s(u);
      }
    }
    function a(c) {
      try {
        l(r.throw(c));
      } catch (u) {
        s(u);
      }
    }
    function l(c) {
      var u;
      c.done ? i(c.value) : (u = c.value, u instanceof t ? u : new t(function(d) {
        d(u);
      })).then(o, a);
    }
    l((r = r.apply(n, [])).next());
  });
}
function dt(n, e) {
  var t, r, i, s, o = { label: 0, sent: function() {
    if (1 & i[0]) throw i[1];
    return i[1];
  }, trys: [], ops: [] };
  return s = { next: a(0), throw: a(1), return: a(2) }, typeof Symbol == "function" && (s[Symbol.iterator] = function() {
    return this;
  }), s;
  function a(l) {
    return function(c) {
      return function(u) {
        if (t) throw new TypeError("Generator is already executing.");
        for (; s && (s = 0, u[0] && (o = 0)), o; ) try {
          if (t = 1, r && (i = 2 & u[0] ? r.return : u[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, u[1])).done) return i;
          switch (r = 0, i && (u = [2 & u[0], i.value]), u[0]) {
            case 0:
            case 1:
              i = u;
              break;
            case 4:
              return o.label++, { value: u[1], done: !1 };
            case 5:
              o.label++, r = u[1], u = [0];
              continue;
            case 7:
              u = o.ops.pop(), o.trys.pop();
              continue;
            default:
              if (i = o.trys, !((i = i.length > 0 && i[i.length - 1]) || u[0] !== 6 && u[0] !== 2)) {
                o = 0;
                continue;
              }
              if (u[0] === 3 && (!i || u[1] > i[0] && u[1] < i[3])) {
                o.label = u[1];
                break;
              }
              if (u[0] === 6 && o.label < i[1]) {
                o.label = i[1], i = u;
                break;
              }
              if (i && o.label < i[2]) {
                o.label = i[2], o.ops.push(u);
                break;
              }
              i[2] && o.ops.pop(), o.trys.pop();
              continue;
          }
          u = e.call(n, o);
        } catch (d) {
          u = [6, d], r = 0;
        } finally {
          t = i = 0;
        }
        if (5 & u[0]) throw u[1];
        return { value: u[0] ? u[1] : void 0, done: !0 };
      }([l, c]);
    };
  }
}
var yt = { exclude: [] }, Lu = {}, qd = { timeout: "true" }, ze = function(n, e) {
  typeof window < "u" && (Lu[n] = e);
}, jd = function() {
  return Object.fromEntries(Object.entries(Lu).filter(function(n) {
    var e, t = n[0];
    return !(!((e = yt?.exclude) === null || e === void 0) && e.includes(t));
  }).map(function(n) {
    return [n[0], (0, n[1])()];
  }));
};
function ar(n) {
  return n ^= n >>> 16, n = Math.imul(n, 2246822507), n ^= n >>> 13, n = Math.imul(n, 3266489909), (n ^= n >>> 16) >>> 0;
}
var Ie = new Uint32Array([597399067, 2869860233, 951274213, 2716044179]);
function Le(n, e) {
  return n << e | n >>> 32 - e;
}
function ks(n, e) {
  var t;
  if (e === void 0 && (e = 0), e = e ? 0 | e : 0, typeof n == "string" && (t = n, n = new TextEncoder().encode(t).buffer), !(n instanceof ArrayBuffer)) throw new TypeError("Expected key to be ArrayBuffer or string");
  var r = new Uint32Array([e, e, e, e]);
  (function(s, o) {
    for (var a = s.byteLength / 16 | 0, l = new Uint32Array(s, 0, 4 * a), c = 0; c < a; c++) {
      var u = l.subarray(4 * c, 4 * (c + 1));
      u[0] = Math.imul(u[0], Ie[0]), u[0] = Le(u[0], 15), u[0] = Math.imul(u[0], Ie[1]), o[0] = o[0] ^ u[0], o[0] = Le(o[0], 19), o[0] = o[0] + o[1], o[0] = Math.imul(o[0], 5) + 1444728091, u[1] = Math.imul(u[1], Ie[1]), u[1] = Le(u[1], 16), u[1] = Math.imul(u[1], Ie[2]), o[1] = o[1] ^ u[1], o[1] = Le(o[1], 17), o[1] = o[1] + o[2], o[1] = Math.imul(o[1], 5) + 197830471, u[2] = Math.imul(u[2], Ie[2]), u[2] = Le(u[2], 17), u[2] = Math.imul(u[2], Ie[3]), o[2] = o[2] ^ u[2], o[2] = Le(o[2], 15), o[2] = o[2] + o[3], o[2] = Math.imul(o[2], 5) + 2530024501, u[3] = Math.imul(u[3], Ie[3]), u[3] = Le(u[3], 18), u[3] = Math.imul(u[3], Ie[0]), o[3] = o[3] ^ u[3], o[3] = Le(o[3], 13), o[3] = o[3] + o[0], o[3] = Math.imul(o[3], 5) + 850148119;
    }
  })(n, r), function(s, o) {
    var a = s.byteLength / 16 | 0, l = s.byteLength % 16, c = new Uint32Array(4), u = new Uint8Array(s, 16 * a, l);
    switch (l) {
      case 15:
        c[3] = c[3] ^ u[14] << 16;
      case 14:
        c[3] = c[3] ^ u[13] << 8;
      case 13:
        c[3] = c[3] ^ u[12] << 0, c[3] = Math.imul(c[3], Ie[3]), c[3] = Le(c[3], 18), c[3] = Math.imul(c[3], Ie[0]), o[3] = o[3] ^ c[3];
      case 12:
        c[2] = c[2] ^ u[11] << 24;
      case 11:
        c[2] = c[2] ^ u[10] << 16;
      case 10:
        c[2] = c[2] ^ u[9] << 8;
      case 9:
        c[2] = c[2] ^ u[8] << 0, c[2] = Math.imul(c[2], Ie[2]), c[2] = Le(c[2], 17), c[2] = Math.imul(c[2], Ie[3]), o[2] = o[2] ^ c[2];
      case 8:
        c[1] = c[1] ^ u[7] << 24;
      case 7:
        c[1] = c[1] ^ u[6] << 16;
      case 6:
        c[1] = c[1] ^ u[5] << 8;
      case 5:
        c[1] = c[1] ^ u[4] << 0, c[1] = Math.imul(c[1], Ie[1]), c[1] = Le(c[1], 16), c[1] = Math.imul(c[1], Ie[2]), o[1] = o[1] ^ c[1];
      case 4:
        c[0] = c[0] ^ u[3] << 24;
      case 3:
        c[0] = c[0] ^ u[2] << 16;
      case 2:
        c[0] = c[0] ^ u[1] << 8;
      case 1:
        c[0] = c[0] ^ u[0] << 0, c[0] = Math.imul(c[0], Ie[0]), c[0] = Le(c[0], 15), c[0] = Math.imul(c[0], Ie[1]), o[0] = o[0] ^ c[0];
    }
  }(n, r), function(s, o) {
    o[0] = o[0] ^ s.byteLength, o[1] = o[1] ^ s.byteLength, o[2] = o[2] ^ s.byteLength, o[3] = o[3] ^ s.byteLength, o[0] = o[0] + o[1] | 0, o[0] = o[0] + o[2] | 0, o[0] = o[0] + o[3] | 0, o[1] = o[1] + o[0] | 0, o[2] = o[2] + o[0] | 0, o[3] = o[3] + o[0] | 0, o[0] = ar(o[0]), o[1] = ar(o[1]), o[2] = ar(o[2]), o[3] = ar(o[3]), o[0] = o[0] + o[1] | 0, o[0] = o[0] + o[2] | 0, o[0] = o[0] + o[3] | 0, o[1] = o[1] + o[0] | 0, o[2] = o[2] + o[0] | 0, o[3] = o[3] + o[0] | 0;
  }(n, r);
  var i = new Uint8Array(r.buffer);
  return Array.from(i).map(function(s) {
    return s.toString(16).padStart(2, "0");
  }).join("");
}
function Vd(n, e) {
  return new Promise(function(t) {
    setTimeout(function() {
      return t(e);
    }, n);
  });
}
function Qd(n, e, t) {
  return Promise.all(n.map(function(r) {
    return Promise.race([r, Vd(e, t)]);
  }));
}
function Uu() {
  return pt(this, void 0, void 0, function() {
    var n, e, t, r, i;
    return dt(this, function(s) {
      switch (s.label) {
        case 0:
          return s.trys.push([0, 2, , 3]), n = jd(), e = Object.keys(n), [4, Qd(Object.values(n), yt?.timeout || 1e3, qd)];
        case 1:
          return t = s.sent(), r = t.filter(function(o) {
            return o !== void 0;
          }), i = {}, r.forEach(function(o, a) {
            i[e[a]] = o;
          }), [2, qu(i, yt.exclude || [])];
        case 2:
          throw s.sent();
        case 3:
          return [2];
      }
    });
  });
}
function qu(n, e) {
  var t = {}, r = function(s) {
    if (n.hasOwnProperty(s)) {
      var o = n[s];
      if (typeof o != "object" || Array.isArray(o)) e.includes(s) || (t[s] = o);
      else {
        var a = qu(o, e.map(function(l) {
          return l.startsWith(s + ".") ? l.slice(s.length + 1) : l;
        }));
        Object.keys(a).length > 0 && (t[s] = a);
      }
    }
  };
  for (var i in n) r(i);
  return t;
}
function Hd(n) {
  return pt(this, void 0, void 0, function() {
    var e, t;
    return dt(this, function(r) {
      switch (r.label) {
        case 0:
          return r.trys.push([0, 2, , 3]), [4, Uu()];
        case 1:
          return e = r.sent(), t = ks(JSON.stringify(e)), [2, t.toString()];
        case 2:
          throw r.sent();
        case 3:
          return [2];
      }
    });
  });
}
function Wd(n) {
  for (var e = 0, t = 0; t < n.length; ++t) e += Math.abs(n[t]);
  return e;
}
function ju(n, e, t) {
  for (var r = [], i = 0; i < n[0].data.length; i++) {
    for (var s = [], o = 0; o < n.length; o++) s.push(n[o].data[i]);
    r.push(Kd(s));
  }
  var a = new Uint8ClampedArray(r);
  return new ImageData(a, e, t);
}
function Kd(n) {
  if (n.length === 0) return 0;
  for (var e = {}, t = 0, r = n; t < r.length; t++)
    e[s = r[t]] = (e[s] || 0) + 1;
  var i = n[0];
  for (var s in e) e[s] > e[i] && (i = parseInt(s, 10));
  return i;
}
function Hn() {
  if (typeof navigator > "u") return { name: "unknown", version: "unknown" };
  for (var n = navigator.userAgent, e = { Edg: "Edge", OPR: "Opera" }, t = 0, r = [/(?<name>Edge|Edg)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>(?:Chrome|Chromium|OPR|Opera|Vivaldi|Brave))\/(?<version>\d+(?:\.\d+)?)/, /(?<name>(?:Firefox|Waterfox|Iceweasel|IceCat))\/(?<version>\d+(?:\.\d+)?)/, /(?<name>Safari)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>MSIE|Trident|IEMobile).+?(?<version>\d+(?:\.\d+)?)/, /(?<name>[A-Za-z]+)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>SamsungBrowser)\/(?<version>\d+(?:\.\d+)?)/]; t < r.length; t++) {
    var i = r[t], s = n.match(i);
    if (s && s.groups) return { name: e[s.groups.name] || s.groups.name, version: s.groups.version };
  }
  return { name: "unknown", version: "unknown" };
}
ze("audio", function() {
  return pt(this, void 0, void 0, function() {
    return dt(this, function(n) {
      return [2, new Promise(function(e, t) {
        try {
          var r = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 5e3, 44100), i = r.createBufferSource(), s = r.createOscillator();
          s.frequency.value = 1e3;
          var o, a = r.createDynamicsCompressor();
          a.threshold.value = -50, a.knee.value = 40, a.ratio.value = 12, a.attack.value = 0, a.release.value = 0.2, s.connect(a), a.connect(r.destination), s.start(), r.oncomplete = function(l) {
            o = l.renderedBuffer.getChannelData(0), e({ sampleHash: Wd(o), oscillator: s.type, maxChannels: r.destination.maxChannelCount, channelCountMode: i.channelCountMode });
          }, r.startRendering();
        } catch (l) {
          console.error("Error creating audio fingerprint:", l), t(l);
        }
      })];
    });
  });
});
var zd = Hn().name !== "SamsungBrowser" ? 1 : 3, ha = 280, fa = 20;
Hn().name != "Firefox" && ze("canvas", function() {
  return document.createElement("canvas").getContext("2d"), new Promise(function(n) {
    var e = Array.from({ length: zd }, function() {
      return function() {
        var t = document.createElement("canvas"), r = t.getContext("2d");
        if (!r) return new ImageData(1, 1);
        t.width = ha, t.height = fa;
        var i = r.createLinearGradient(0, 0, t.width, t.height);
        i.addColorStop(0, "red"), i.addColorStop(0.16666666666666666, "orange"), i.addColorStop(0.3333333333333333, "yellow"), i.addColorStop(0.5, "green"), i.addColorStop(0.6666666666666666, "blue"), i.addColorStop(0.8333333333333334, "indigo"), i.addColorStop(1, "violet"), r.fillStyle = i, r.fillRect(0, 0, t.width, t.height);
        var s = "Random Text WMwmil10Oo";
        r.font = "23.123px Arial", r.fillStyle = "black", r.fillText(s, -5, 15), r.fillStyle = "rgba(0, 0, 255, 0.5)", r.fillText(s, -3.3, 17.7), r.beginPath(), r.moveTo(0, 0), r.lineTo(2 * t.width / 7, t.height), r.strokeStyle = "white", r.lineWidth = 2, r.stroke();
        var o = r.getImageData(0, 0, t.width, t.height);
        return o;
      }();
    });
    n({ commonImageDataHash: ks(ju(e, ha, fa).data.toString()).toString() });
  });
});
var gi, Gd = ["Arial", "Arial Black", "Arial Narrow", "Arial Rounded MT", "Arimo", "Archivo", "Barlow", "Bebas Neue", "Bitter", "Bookman", "Calibri", "Cabin", "Candara", "Century", "Century Gothic", "Comic Sans MS", "Constantia", "Courier", "Courier New", "Crimson Text", "DM Mono", "DM Sans", "DM Serif Display", "DM Serif Text", "Dosis", "Droid Sans", "Exo", "Fira Code", "Fira Sans", "Franklin Gothic Medium", "Garamond", "Geneva", "Georgia", "Gill Sans", "Helvetica", "Impact", "Inconsolata", "Indie Flower", "Inter", "Josefin Sans", "Karla", "Lato", "Lexend", "Lucida Bright", "Lucida Console", "Lucida Sans Unicode", "Manrope", "Merriweather", "Merriweather Sans", "Montserrat", "Myriad", "Noto Sans", "Nunito", "Nunito Sans", "Open Sans", "Optima", "Orbitron", "Oswald", "Pacifico", "Palatino", "Perpetua", "PT Sans", "PT Serif", "Poppins", "Prompt", "Public Sans", "Quicksand", "Rajdhani", "Recursive", "Roboto", "Roboto Condensed", "Rockwell", "Rubik", "Segoe Print", "Segoe Script", "Segoe UI", "Sora", "Source Sans Pro", "Space Mono", "Tahoma", "Taviraj", "Times", "Times New Roman", "Titillium Web", "Trebuchet MS", "Ubuntu", "Varela Round", "Verdana", "Work Sans"], Jd = ["monospace", "sans-serif", "serif"];
function pa(n, e) {
  if (!n) throw new Error("Canvas context not supported");
  return n.font, n.font = "72px ".concat(e), n.measureText("WwMmLli0Oo").width;
}
function Yd() {
  var n, e = document.createElement("canvas"), t = (n = e.getContext("webgl")) !== null && n !== void 0 ? n : e.getContext("experimental-webgl");
  if (t && "getParameter" in t) try {
    var r = (t.getParameter(t.VENDOR) || "").toString(), i = (t.getParameter(t.RENDERER) || "").toString(), s = { vendor: r, renderer: i, version: (t.getParameter(t.VERSION) || "").toString(), shadingLanguageVersion: (t.getParameter(t.SHADING_LANGUAGE_VERSION) || "").toString() };
    if (!i.length || !r.length) {
      var o = t.getExtension("WEBGL_debug_renderer_info");
      if (o) {
        var a = (t.getParameter(o.UNMASKED_VENDOR_WEBGL) || "").toString(), l = (t.getParameter(o.UNMASKED_RENDERER_WEBGL) || "").toString();
        a && (s.vendorUnmasked = a), l && (s.rendererUnmasked = l);
      }
    }
    return s;
  } catch {
  }
  return "undefined";
}
function Xd() {
  var n = new Float32Array(1), e = new Uint8Array(n.buffer);
  return n[0] = 1 / 0, n[0] = n[0] - n[0], e[3];
}
function Zd(n, e) {
  var t = {};
  return e.forEach(function(r) {
    var i = function(s) {
      if (s.length === 0) return null;
      var o = {};
      s.forEach(function(c) {
        var u = String(c);
        o[u] = (o[u] || 0) + 1;
      });
      var a = s[0], l = 1;
      return Object.keys(o).forEach(function(c) {
        o[c] > l && (a = c, l = o[c]);
      }), a;
    }(n.map(function(s) {
      return r in s ? s[r] : void 0;
    }).filter(function(s) {
      return s !== void 0;
    }));
    i && (t[r] = i);
  }), t;
}
function ey() {
  var n = [], e = { "prefers-contrast": ["high", "more", "low", "less", "forced", "no-preference"], "any-hover": ["hover", "none"], "any-pointer": ["none", "coarse", "fine"], pointer: ["none", "coarse", "fine"], hover: ["hover", "none"], update: ["fast", "slow"], "inverted-colors": ["inverted", "none"], "prefers-reduced-motion": ["reduce", "no-preference"], "prefers-reduced-transparency": ["reduce", "no-preference"], scripting: ["none", "initial-only", "enabled"], "forced-colors": ["active", "none"] };
  return Object.keys(e).forEach(function(t) {
    e[t].forEach(function(r) {
      matchMedia("(".concat(t, ": ").concat(r, ")")).matches && n.push("".concat(t, ": ").concat(r));
    });
  }), n;
}
function ty() {
  if (window.location.protocol === "https:" && typeof window.ApplePaySession == "function") try {
    for (var n = window.ApplePaySession.supportsVersion, e = 15; e > 0; e--) if (n(e)) return e;
  } catch {
    return 0;
  }
  return 0;
}
Hn().name != "Firefox" && ze("fonts", function() {
  var n = this;
  return new Promise(function(e, t) {
    try {
      (function(r) {
        var i;
        pt(this, void 0, void 0, function() {
          var s, o, a;
          return dt(this, function(l) {
            switch (l.label) {
              case 0:
                return document.body ? [3, 2] : [4, (c = 50, new Promise(function(d) {
                  return setTimeout(d, c, u);
                }))];
              case 1:
                return l.sent(), [3, 0];
              case 2:
                if ((s = document.createElement("iframe")).setAttribute("frameBorder", "0"), (o = s.style).setProperty("position", "fixed"), o.setProperty("display", "block", "important"), o.setProperty("visibility", "visible"), o.setProperty("border", "0"), o.setProperty("opacity", "0"), s.src = "about:blank", document.body.appendChild(s), !(a = s.contentDocument || ((i = s.contentWindow) === null || i === void 0 ? void 0 : i.document))) throw new Error("Iframe document is not accessible");
                return r({ iframe: a }), setTimeout(function() {
                  document.body.removeChild(s);
                }, 0), [2];
            }
            var c, u;
          });
        });
      })(function(r) {
        var i = r.iframe;
        return pt(n, void 0, void 0, function() {
          var s, o, a, l;
          return dt(this, function(c) {
            return s = i.createElement("canvas"), o = s.getContext("2d"), a = Jd.map(function(u) {
              return pa(o, u);
            }), l = {}, Gd.forEach(function(u) {
              var d = pa(o, u);
              a.includes(d) || (l[u] = d);
            }), e(l), [2];
          });
        });
      });
    } catch {
      t({ error: "unsupported" });
    }
  });
}), ze("hardware", function() {
  return new Promise(function(n, e) {
    var t = navigator.deviceMemory !== void 0 ? navigator.deviceMemory : 0, r = window.performance && window.performance.memory ? window.performance.memory : 0;
    n({ videocard: Yd(), architecture: Xd(), deviceMemory: t.toString() || "undefined", jsHeapSizeLimit: r.jsHeapSizeLimit || 0 });
  });
}), ze("locales", function() {
  return new Promise(function(n) {
    n({ languages: navigator.language, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  });
}), ze("permissions", function() {
  return pt(this, void 0, void 0, function() {
    var n;
    return dt(this, function(e) {
      return gi = yt?.permissions_to_check || ["accelerometer", "accessibility", "accessibility-events", "ambient-light-sensor", "background-fetch", "background-sync", "bluetooth", "camera", "clipboard-read", "clipboard-write", "device-info", "display-capture", "gyroscope", "geolocation", "local-fonts", "magnetometer", "microphone", "midi", "nfc", "notifications", "payment-handler", "persistent-storage", "push", "speaker", "storage-access", "top-level-storage-access", "window-management", "query"], n = Array.from({ length: yt?.retries || 3 }, function() {
        return function() {
          return pt(this, void 0, void 0, function() {
            var t, r, i, s, o;
            return dt(this, function(a) {
              switch (a.label) {
                case 0:
                  t = {}, r = 0, i = gi, a.label = 1;
                case 1:
                  if (!(r < i.length)) return [3, 6];
                  s = i[r], a.label = 2;
                case 2:
                  return a.trys.push([2, 4, , 5]), [4, navigator.permissions.query({ name: s })];
                case 3:
                  return o = a.sent(), t[s] = o.state.toString(), [3, 5];
                case 4:
                  return a.sent(), [3, 5];
                case 5:
                  return r++, [3, 1];
                case 6:
                  return [2, t];
              }
            });
          });
        }();
      }), [2, Promise.all(n).then(function(t) {
        return Zd(t, gi);
      })];
    });
  });
}), ze("plugins", function() {
  var n = [];
  if (navigator.plugins) for (var e = 0; e < navigator.plugins.length; e++) {
    var t = navigator.plugins[e];
    n.push([t.name, t.filename, t.description].join("|"));
  }
  return new Promise(function(r) {
    r({ plugins: n });
  });
}), ze("screen", function() {
  return new Promise(function(n) {
    n({ is_touchscreen: navigator.maxTouchPoints > 0, maxTouchPoints: navigator.maxTouchPoints, colorDepth: screen.colorDepth, mediaMatches: ey() });
  });
}), ze("system", function() {
  return new Promise(function(n) {
    var e = Hn();
    n({ platform: window.navigator.platform, cookieEnabled: window.navigator.cookieEnabled, productSub: navigator.productSub, product: navigator.product, useragent: navigator.userAgent, hardwareConcurrency: navigator.hardwareConcurrency, browser: { name: e.name, version: e.version }, applePayVersion: ty() });
  });
});
var De, ny = Hn().name !== "SamsungBrowser" ? 1 : 3, L = null;
ze("webgl", function() {
  return pt(this, void 0, void 0, function() {
    var n;
    return dt(this, function(e) {
      typeof document < "u" && ((De = document.createElement("canvas")).width = 200, De.height = 100, L = De.getContext("webgl"));
      try {
        if (!L) throw new Error("WebGL not supported");
        return n = Array.from({ length: ny }, function() {
          return function() {
            try {
              if (!L) throw new Error("WebGL not supported");
              var t = `
          attribute vec2 position;
          void main() {
              gl_Position = vec4(position, 0.0, 1.0);
          }
      `, r = `
          precision mediump float;
          void main() {
              gl_FragColor = vec4(0.812, 0.195, 0.553, 0.921); // Set line color
          }
      `, i = L.createShader(L.VERTEX_SHADER), s = L.createShader(L.FRAGMENT_SHADER);
              if (!i || !s) throw new Error("Failed to create shaders");
              if (L.shaderSource(i, t), L.shaderSource(s, r), L.compileShader(i), !L.getShaderParameter(i, L.COMPILE_STATUS)) throw new Error("Vertex shader compilation failed: " + L.getShaderInfoLog(i));
              if (L.compileShader(s), !L.getShaderParameter(s, L.COMPILE_STATUS)) throw new Error("Fragment shader compilation failed: " + L.getShaderInfoLog(s));
              var o = L.createProgram();
              if (!o) throw new Error("Failed to create shader program");
              if (L.attachShader(o, i), L.attachShader(o, s), L.linkProgram(o), !L.getProgramParameter(o, L.LINK_STATUS)) throw new Error("Shader program linking failed: " + L.getProgramInfoLog(o));
              L.useProgram(o);
              for (var a = 137, l = new Float32Array(4 * a), c = 2 * Math.PI / a, u = 0; u < a; u++) {
                var d = u * c;
                l[4 * u] = 0, l[4 * u + 1] = 0, l[4 * u + 2] = Math.cos(d) * (De.width / 2), l[4 * u + 3] = Math.sin(d) * (De.height / 2);
              }
              var p = L.createBuffer();
              L.bindBuffer(L.ARRAY_BUFFER, p), L.bufferData(L.ARRAY_BUFFER, l, L.STATIC_DRAW);
              var m = L.getAttribLocation(o, "position");
              L.enableVertexAttribArray(m), L.vertexAttribPointer(m, 2, L.FLOAT, !1, 0, 0), L.viewport(0, 0, De.width, De.height), L.clearColor(0, 0, 0, 1), L.clear(L.COLOR_BUFFER_BIT), L.drawArrays(L.LINES, 0, 2 * a);
              var v = new Uint8ClampedArray(De.width * De.height * 4);
              return L.readPixels(0, 0, De.width, De.height, L.RGBA, L.UNSIGNED_BYTE, v), new ImageData(v, De.width, De.height);
            } catch {
              return new ImageData(1, 1);
            } finally {
              L && (L.bindBuffer(L.ARRAY_BUFFER, null), L.useProgram(null), L.viewport(0, 0, L.drawingBufferWidth, L.drawingBufferHeight), L.clearColor(0, 0, 0, 0));
            }
          }();
        }), [2, { commonImageHash: ks(ju(n, De.width, De.height).data.toString()).toString() }];
      } catch {
        return [2, { webgl: "unsupported" }];
      }
      return [2];
    });
  });
});
var Ct = function(n, e, t, r) {
  for (var i = (t - e) / r, s = 0, o = 0; o < r; o++)
    s += n(e + (o + 0.5) * i);
  return s * i;
};
ze("math", function() {
  return pt(void 0, void 0, void 0, function() {
    return dt(this, function(n) {
      return [2, { acos: Math.acos(0.5), asin: Ct(Math.asin, -1, 1, 97), atan: Ct(Math.atan, -1, 1, 97), cos: Ct(Math.cos, 0, Math.PI, 97), cosh: Math.cosh(9 / 7), e: Math.E, largeCos: Math.cos(1e20), largeSin: Math.sin(1e20), largeTan: Math.tan(1e20), log: Math.log(1e3), pi: Math.PI, sin: Ct(Math.sin, -Math.PI, Math.PI, 97), sinh: Ct(Math.sinh, -9 / 7, 7 / 9, 97), sqrt: Math.sqrt(2), tan: Ct(Math.tan, 0, 2 * Math.PI, 97), tanh: Ct(Math.tanh, -9 / 7, 7 / 9, 97) }];
    });
  });
});
function Vu(n) {
  return new Qe(function(e, t) {
    return new ee(function(r) {
      var i, s, o;
      try {
        i = t(e).subscribe({
          next: function(a) {
            if (a.errors && (o = n({
              graphQLErrors: a.errors,
              response: a,
              operation: e,
              forward: t
            }), o)) {
              s = o.subscribe({
                next: r.next.bind(r),
                error: r.error.bind(r),
                complete: r.complete.bind(r)
              });
              return;
            }
            r.next(a);
          },
          error: function(a) {
            if (o = n({
              operation: e,
              networkError: a,
              graphQLErrors: a && a.result && a.result.errors,
              forward: t
            }), o) {
              s = o.subscribe({
                next: r.next.bind(r),
                error: r.error.bind(r),
                complete: r.complete.bind(r)
              });
              return;
            }
            r.error(a);
          },
          complete: function() {
            o || r.complete.bind(r)();
          }
        });
      } catch (a) {
        n({ networkError: a, operation: e, forward: t }), r.error(a);
      }
      return function() {
        i && i.unsubscribe(), s && i.unsubscribe();
      };
    });
  });
}
(function(n) {
  Ve(e, n);
  function e(t) {
    var r = n.call(this) || this;
    return r.link = Vu(t), r;
  }
  return e.prototype.request = function(t, r) {
    return this.link.request(t, r);
  }, e;
})(Qe);
function ry(n) {
  return new Qe(function(e, t) {
    var r = qt(e, []);
    return new ee(function(i) {
      var s, o = !1;
      return Promise.resolve(r).then(function(a) {
        return n(a, e.getContext());
      }).then(e.setContext).then(function() {
        o || (s = t(e).subscribe({
          next: i.next.bind(i),
          error: i.error.bind(i),
          complete: i.complete.bind(i)
        }));
      }).catch(i.error.bind(i)), function() {
        o = !0, s && s.unsubscribe();
      };
    });
  });
}
function iy(n) {
  return ue(n) && "code" in n && "reason" in n;
}
var sy = function(n) {
  Ve(e, n);
  function e(t) {
    var r = n.call(this) || this;
    return r.client = t, r;
  }
  return e.prototype.request = function(t) {
    var r = this;
    return new ee(function(i) {
      return r.client.subscribe(x(x({}, t), { query: ss(t.query) }), {
        next: i.next.bind(i),
        complete: i.complete.bind(i),
        error: function(s) {
          return s instanceof Error ? i.error(s) : iy(s) ? i.error(new Error("Socket closed with event ".concat(s.code, " ").concat(s.reason || ""))) : i.error(new Dt({
            graphQLErrors: Array.isArray(s) ? s : [s]
          }));
        }
      });
    });
  }, e;
}(Qe);
function Me(n) {
  return n === null ? "null" : Array.isArray(n) ? "array" : typeof n;
}
function Mt(n) {
  return Me(n) === "object";
}
function oy(n) {
  return Array.isArray(n) && // must be at least one error
  n.length > 0 && // error has at least a message
  n.every((e) => "message" in e);
}
function da(n, e) {
  return n.length < 124 ? n : e;
}
const ay = "graphql-transport-ws";
var Be;
(function(n) {
  n[n.InternalServerError = 4500] = "InternalServerError", n[n.InternalClientError = 4005] = "InternalClientError", n[n.BadRequest = 4400] = "BadRequest", n[n.BadResponse = 4004] = "BadResponse", n[n.Unauthorized = 4401] = "Unauthorized", n[n.Forbidden = 4403] = "Forbidden", n[n.SubprotocolNotAcceptable = 4406] = "SubprotocolNotAcceptable", n[n.ConnectionInitialisationTimeout = 4408] = "ConnectionInitialisationTimeout", n[n.ConnectionAcknowledgementTimeout = 4504] = "ConnectionAcknowledgementTimeout", n[n.SubscriberAlreadyExists = 4409] = "SubscriberAlreadyExists", n[n.TooManyInitialisationRequests = 4429] = "TooManyInitialisationRequests";
})(Be || (Be = {}));
var pe;
(function(n) {
  n.ConnectionInit = "connection_init", n.ConnectionAck = "connection_ack", n.Ping = "ping", n.Pong = "pong", n.Subscribe = "subscribe", n.Next = "next", n.Error = "error", n.Complete = "complete";
})(pe || (pe = {}));
function Qu(n) {
  if (!Mt(n))
    throw new Error(`Message is expected to be an object, but got ${Me(n)}`);
  if (!n.type)
    throw new Error("Message is missing the 'type' property");
  if (typeof n.type != "string")
    throw new Error(`Message is expects the 'type' property to be a string, but got ${Me(n.type)}`);
  switch (n.type) {
    case pe.ConnectionInit:
    case pe.ConnectionAck:
    case pe.Ping:
    case pe.Pong: {
      if (n.payload != null && !Mt(n.payload))
        throw new Error(`"${n.type}" message expects the 'payload' property to be an object or nullish or missing, but got "${n.payload}"`);
      break;
    }
    case pe.Subscribe: {
      if (typeof n.id != "string")
        throw new Error(`"${n.type}" message expects the 'id' property to be a string, but got ${Me(n.id)}`);
      if (!n.id)
        throw new Error(`"${n.type}" message requires a non-empty 'id' property`);
      if (!Mt(n.payload))
        throw new Error(`"${n.type}" message expects the 'payload' property to be an object, but got ${Me(n.payload)}`);
      if (typeof n.payload.query != "string")
        throw new Error(`"${n.type}" message payload expects the 'query' property to be a string, but got ${Me(n.payload.query)}`);
      if (n.payload.variables != null && !Mt(n.payload.variables))
        throw new Error(`"${n.type}" message payload expects the 'variables' property to be a an object or nullish or missing, but got ${Me(n.payload.variables)}`);
      if (n.payload.operationName != null && Me(n.payload.operationName) !== "string")
        throw new Error(`"${n.type}" message payload expects the 'operationName' property to be a string or nullish or missing, but got ${Me(n.payload.operationName)}`);
      if (n.payload.extensions != null && !Mt(n.payload.extensions))
        throw new Error(`"${n.type}" message payload expects the 'extensions' property to be a an object or nullish or missing, but got ${Me(n.payload.extensions)}`);
      break;
    }
    case pe.Next: {
      if (typeof n.id != "string")
        throw new Error(`"${n.type}" message expects the 'id' property to be a string, but got ${Me(n.id)}`);
      if (!n.id)
        throw new Error(`"${n.type}" message requires a non-empty 'id' property`);
      if (!Mt(n.payload))
        throw new Error(`"${n.type}" message expects the 'payload' property to be an object, but got ${Me(n.payload)}`);
      break;
    }
    case pe.Error: {
      if (typeof n.id != "string")
        throw new Error(`"${n.type}" message expects the 'id' property to be a string, but got ${Me(n.id)}`);
      if (!n.id)
        throw new Error(`"${n.type}" message requires a non-empty 'id' property`);
      if (!oy(n.payload))
        throw new Error(`"${n.type}" message expects the 'payload' property to be an array of GraphQL errors, but got ${JSON.stringify(n.payload)}`);
      break;
    }
    case pe.Complete: {
      if (typeof n.id != "string")
        throw new Error(`"${n.type}" message expects the 'id' property to be a string, but got ${Me(n.id)}`);
      if (!n.id)
        throw new Error(`"${n.type}" message requires a non-empty 'id' property`);
      break;
    }
    default:
      throw new Error(`Invalid message 'type' property "${n.type}"`);
  }
  return n;
}
function uy(n, e) {
  return Qu(typeof n == "string" ? JSON.parse(n, e) : n);
}
function An(n, e) {
  return Qu(n), JSON.stringify(n, e);
}
var an = function(n) {
  return this instanceof an ? (this.v = n, this) : new an(n);
}, cy = function(n, e, t) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = t.apply(n, e || []), i, s = [];
  return i = {}, o("next"), o("throw"), o("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function o(p) {
    r[p] && (i[p] = function(m) {
      return new Promise(function(v, w) {
        s.push([p, m, v, w]) > 1 || a(p, m);
      });
    });
  }
  function a(p, m) {
    try {
      l(r[p](m));
    } catch (v) {
      d(s[0][3], v);
    }
  }
  function l(p) {
    p.value instanceof an ? Promise.resolve(p.value.v).then(c, u) : d(s[0][2], p);
  }
  function c(p) {
    a("next", p);
  }
  function u(p) {
    a("throw", p);
  }
  function d(p, m) {
    p(m), s.shift(), s.length && a(s[0][0], s[0][1]);
  }
};
function ly(n) {
  const {
    url: e,
    connectionParams: t,
    lazy: r = !0,
    onNonLazyError: i = console.error,
    lazyCloseTimeout: s = 0,
    keepAlive: o = 0,
    disablePong: a,
    connectionAckWaitTimeout: l = 0,
    retryAttempts: c = 5,
    retryWait: u = async function(X) {
      let P = 1e3;
      for (let Q = 0; Q < X; Q++)
        P *= 2;
      await new Promise((Q) => setTimeout(Q, P + // add random timeout from 300ms to 3s
      Math.floor(Math.random() * 2700 + 300)));
    },
    shouldRetry: d = vi,
    isFatalConnectionProblem: p,
    on: m,
    webSocketImpl: v,
    /**
     * Generates a v4 UUID to be used as the ID using `Math`
     * as the random number generator. Supply your own generator
     * in case you need more uniqueness.
     *
     * Reference: https://gist.github.com/jed/982883
     */
    generateID: w = function() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (X) => {
        const P = Math.random() * 16 | 0;
        return (X == "x" ? P : P & 3 | 8).toString(16);
      });
    },
    jsonMessageReplacer: _,
    jsonMessageReviver: E
  } = n;
  let T;
  if (v) {
    if (!fy(v))
      throw new Error("Invalid WebSocket implementation provided");
    T = v;
  } else typeof WebSocket < "u" ? T = WebSocket : typeof rt < "u" ? T = rt.WebSocket || // @ts-expect-error: Support more browsers
  rt.MozWebSocket : typeof window < "u" && (T = window.WebSocket || // @ts-expect-error: Support more browsers
  window.MozWebSocket);
  if (!T)
    throw new Error("WebSocket implementation missing; on Node you can `import WebSocket from 'ws';` and pass `webSocketImpl: WebSocket` to `createClient`");
  const I = T, A = (() => {
    const V = /* @__PURE__ */ (() => {
      const P = {};
      return {
        on(Q, j) {
          return P[Q] = j, () => {
            delete P[Q];
          };
        },
        emit(Q) {
          var j;
          "id" in Q && ((j = P[Q.id]) === null || j === void 0 || j.call(P, Q));
        }
      };
    })(), X = {
      connecting: m?.connecting ? [m.connecting] : [],
      opened: m?.opened ? [m.opened] : [],
      connected: m?.connected ? [m.connected] : [],
      ping: m?.ping ? [m.ping] : [],
      pong: m?.pong ? [m.pong] : [],
      message: m?.message ? [V.emit, m.message] : [V.emit],
      closed: m?.closed ? [m.closed] : [],
      error: m?.error ? [m.error] : []
    };
    return {
      onMessage: V.on,
      on(P, Q) {
        const j = X[P];
        return j.push(Q), () => {
          j.splice(j.indexOf(Q), 1);
        };
      },
      emit(P, ...Q) {
        for (const j of [...X[P]])
          j(...Q);
      }
    };
  })();
  function R(V) {
    const X = [
      // errors are fatal and more critical than close events, throw them first
      A.on("error", (P) => {
        X.forEach((Q) => Q()), V(P);
      }),
      // closes can be graceful and not fatal, throw them second (if error didnt throw)
      A.on("closed", (P) => {
        X.forEach((Q) => Q()), V(P);
      })
    ];
  }
  let N, M = 0, B, q = !1, z = 0, Y = !1;
  async function Te() {
    clearTimeout(B);
    const [V, X] = await (N ?? (N = new Promise((j, Ae) => (async () => {
      if (q) {
        if (await u(z), !M)
          return N = void 0, Ae({ code: 1e3, reason: "All Subscriptions Gone" });
        z++;
      }
      A.emit("connecting", q);
      const G = new I(typeof e == "function" ? await e() : e, ay);
      let Je, At;
      function ae() {
        isFinite(o) && o > 0 && (clearTimeout(At), At = setTimeout(() => {
          G.readyState === I.OPEN && (G.send(An({ type: pe.Ping })), A.emit("ping", !1, void 0));
        }, o));
      }
      R((ve) => {
        N = void 0, clearTimeout(Je), clearTimeout(At), Ae(ve), ve instanceof ya && (G.close(4499, "Terminated"), G.onerror = null, G.onclose = null);
      }), G.onerror = (ve) => A.emit("error", ve), G.onclose = (ve) => A.emit("closed", ve), G.onopen = async () => {
        try {
          A.emit("opened", G);
          const ve = typeof t == "function" ? await t() : t;
          if (G.readyState !== I.OPEN)
            return;
          G.send(An(ve ? {
            type: pe.ConnectionInit,
            payload: ve
          } : {
            type: pe.ConnectionInit
            // payload is completely absent if not provided
          }, _)), isFinite(l) && l > 0 && (Je = setTimeout(() => {
            G.close(Be.ConnectionAcknowledgementTimeout, "Connection acknowledgement timeout");
          }, l)), ae();
        } catch (ve) {
          A.emit("error", ve), G.close(Be.InternalClientError, da(ve instanceof Error ? ve.message : new Error(ve).message, "Internal client error"));
        }
      };
      let fe = !1;
      G.onmessage = ({ data: ve }) => {
        try {
          const me = uy(ve, E);
          if (A.emit("message", me), me.type === "ping" || me.type === "pong") {
            A.emit(me.type, !0, me.payload), me.type === "pong" ? ae() : a || (G.send(An(me.payload ? {
              type: pe.Pong,
              payload: me.payload
            } : {
              type: pe.Pong
              // payload is completely absent if not provided
            })), A.emit("pong", !1, me.payload));
            return;
          }
          if (fe)
            return;
          if (me.type !== pe.ConnectionAck)
            throw new Error(`First message cannot be of type ${me.type}`);
          clearTimeout(Je), fe = !0, A.emit("connected", G, me.payload, q), q = !1, z = 0, j([
            G,
            new Promise((Hr, Xn) => R(Xn))
          ]);
        } catch (me) {
          G.onmessage = null, A.emit("error", me), G.close(Be.BadResponse, da(me instanceof Error ? me.message : new Error(me).message, "Bad response"));
        }
      };
    })())));
    V.readyState === I.CLOSING && await X;
    let P = () => {
    };
    const Q = new Promise((j) => P = j);
    return [
      V,
      P,
      Promise.race([
        // wait for
        Q.then(() => {
          if (!M) {
            const j = () => V.close(1e3, "Normal Closure");
            isFinite(s) && s > 0 ? B = setTimeout(() => {
              V.readyState === I.OPEN && j();
            }, s) : j();
          }
        }),
        // or
        X
      ])
    ];
  }
  function Ge(V) {
    if (vi(V) && (hy(V.code) || [
      Be.InternalServerError,
      Be.InternalClientError,
      Be.BadRequest,
      Be.BadResponse,
      Be.Unauthorized,
      // CloseCode.Forbidden, might grant access out after retry
      Be.SubprotocolNotAcceptable,
      // CloseCode.ConnectionInitialisationTimeout, might not time out after retry
      // CloseCode.ConnectionAcknowledgementTimeout, might not time out after retry
      Be.SubscriberAlreadyExists,
      Be.TooManyInitialisationRequests
      // 4499, // Terminated, probably because the socket froze, we want to retry
    ].includes(V.code)))
      throw V;
    if (Y)
      return !1;
    if (vi(V) && V.code === 1e3)
      return M > 0;
    if (!c || z >= c || !d(V) || p?.(V))
      throw V;
    return q = !0;
  }
  r || (async () => {
    for (M++; ; )
      try {
        const [, , V] = await Te();
        await V;
      } catch (V) {
        try {
          if (!Ge(V))
            return;
        } catch (X) {
          return i?.(X);
        }
      }
  })();
  function Pe(V, X) {
    const P = w(V);
    let Q = !1, j = !1, Ae = () => {
      M--, Q = !0;
    };
    return (async () => {
      for (M++; ; )
        try {
          const [G, Je, At] = await Te();
          if (Q)
            return Je();
          const ae = A.onMessage(P, (fe) => {
            switch (fe.type) {
              case pe.Next: {
                X.next(fe.payload);
                return;
              }
              case pe.Error: {
                j = !0, Q = !0, X.error(fe.payload), Ae();
                return;
              }
              case pe.Complete: {
                Q = !0, Ae();
                return;
              }
            }
          });
          G.send(An({
            id: P,
            type: pe.Subscribe,
            payload: V
          }, _)), Ae = () => {
            !Q && G.readyState === I.OPEN && G.send(An({
              id: P,
              type: pe.Complete
            }, _)), M--, Q = !0, Je();
          }, await At.finally(ae);
          return;
        } catch (G) {
          if (!Ge(G))
            return;
        }
    })().then(() => {
      j || X.complete();
    }).catch((G) => {
      X.error(G);
    }), () => {
      Q || Ae();
    };
  }
  return {
    on: A.on,
    subscribe: Pe,
    iterate(V) {
      const X = [], P = {
        done: !1,
        error: null,
        resolve: () => {
        }
      }, Q = Pe(V, {
        next(Ae) {
          X.push(Ae), P.resolve();
        },
        error(Ae) {
          P.done = !0, P.error = Ae, P.resolve();
        },
        complete() {
          P.done = !0, P.resolve();
        }
      }), j = function() {
        return cy(this, arguments, function* () {
          for (; ; ) {
            for (X.length || (yield an(new Promise((Je) => P.resolve = Je))); X.length; )
              yield yield an(X.shift());
            if (P.error)
              throw P.error;
            if (P.done)
              return yield an(void 0);
          }
        });
      }();
      return j.throw = async (Ae) => (P.done || (P.done = !0, P.error = Ae, P.resolve()), { done: !0, value: void 0 }), j.return = async () => (Q(), { done: !0, value: void 0 }), j;
    },
    async dispose() {
      if (Y = !0, N) {
        const [V] = await N;
        V.close(1e3, "Normal Closure");
      }
    },
    terminate() {
      N && A.emit("closed", new ya());
    }
  };
}
class ya extends Error {
  constructor() {
    super(...arguments), this.name = "TerminatedCloseEvent", this.message = "4499: Terminated", this.code = 4499, this.reason = "Terminated", this.wasClean = !1;
  }
}
function vi(n) {
  return Mt(n) && "code" in n && "reason" in n;
}
function hy(n) {
  return [
    1e3,
    1001,
    1006,
    1005,
    1012,
    1013,
    1014
    // Bad Gateway
  ].includes(n) ? !1 : n >= 1e3 && n <= 1999;
}
function fy(n) {
  return typeof n == "function" && "constructor" in n && "CLOSED" in n && "CLOSING" in n && "CONNECTING" in n && "OPEN" in n;
}
function py(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Ce = typeof globalThis < "u" && globalThis || typeof self < "u" && self || typeof Ce < "u" && Ce, Fe = {
  searchParams: "URLSearchParams" in Ce,
  iterable: "Symbol" in Ce && "iterator" in Symbol,
  blob: "FileReader" in Ce && "Blob" in Ce && function() {
    try {
      return new Blob(), !0;
    } catch {
      return !1;
    }
  }(),
  formData: "FormData" in Ce,
  arrayBuffer: "ArrayBuffer" in Ce
};
function dy(n) {
  return n && DataView.prototype.isPrototypeOf(n);
}
if (Fe.arrayBuffer)
  var yy = [
    "[object Int8Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Int16Array]",
    "[object Uint16Array]",
    "[object Int32Array]",
    "[object Uint32Array]",
    "[object Float32Array]",
    "[object Float64Array]"
  ], my = ArrayBuffer.isView || function(n) {
    return n && yy.indexOf(Object.prototype.toString.call(n)) > -1;
  };
function Yn(n) {
  if (typeof n != "string" && (n = String(n)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(n) || n === "")
    throw new TypeError('Invalid character in header field name: "' + n + '"');
  return n.toLowerCase();
}
function xs(n) {
  return typeof n != "string" && (n = String(n)), n;
}
function Ts(n) {
  var e = {
    next: function() {
      var t = n.shift();
      return { done: t === void 0, value: t };
    }
  };
  return Fe.iterable && (e[Symbol.iterator] = function() {
    return e;
  }), e;
}
function we(n) {
  this.map = {}, n instanceof we ? n.forEach(function(e, t) {
    this.append(t, e);
  }, this) : Array.isArray(n) ? n.forEach(function(e) {
    this.append(e[0], e[1]);
  }, this) : n && Object.getOwnPropertyNames(n).forEach(function(e) {
    this.append(e, n[e]);
  }, this);
}
we.prototype.append = function(n, e) {
  n = Yn(n), e = xs(e);
  var t = this.map[n];
  this.map[n] = t ? t + ", " + e : e;
};
we.prototype.delete = function(n) {
  delete this.map[Yn(n)];
};
we.prototype.get = function(n) {
  return n = Yn(n), this.has(n) ? this.map[n] : null;
};
we.prototype.has = function(n) {
  return this.map.hasOwnProperty(Yn(n));
};
we.prototype.set = function(n, e) {
  this.map[Yn(n)] = xs(e);
};
we.prototype.forEach = function(n, e) {
  for (var t in this.map)
    this.map.hasOwnProperty(t) && n.call(e, this.map[t], t, this);
};
we.prototype.keys = function() {
  var n = [];
  return this.forEach(function(e, t) {
    n.push(t);
  }), Ts(n);
};
we.prototype.values = function() {
  var n = [];
  return this.forEach(function(e) {
    n.push(e);
  }), Ts(n);
};
we.prototype.entries = function() {
  var n = [];
  return this.forEach(function(e, t) {
    n.push([t, e]);
  }), Ts(n);
};
Fe.iterable && (we.prototype[Symbol.iterator] = we.prototype.entries);
function bi(n) {
  if (n.bodyUsed)
    return Promise.reject(new TypeError("Already read"));
  n.bodyUsed = !0;
}
function Hu(n) {
  return new Promise(function(e, t) {
    n.onload = function() {
      e(n.result);
    }, n.onerror = function() {
      t(n.error);
    };
  });
}
function gy(n) {
  var e = new FileReader(), t = Hu(e);
  return e.readAsArrayBuffer(n), t;
}
function vy(n) {
  var e = new FileReader(), t = Hu(e);
  return e.readAsText(n), t;
}
function by(n) {
  for (var e = new Uint8Array(n), t = new Array(e.length), r = 0; r < e.length; r++)
    t[r] = String.fromCharCode(e[r]);
  return t.join("");
}
function ma(n) {
  if (n.slice)
    return n.slice(0);
  var e = new Uint8Array(n.byteLength);
  return e.set(new Uint8Array(n)), e.buffer;
}
function Wu() {
  return this.bodyUsed = !1, this._initBody = function(n) {
    this.bodyUsed = this.bodyUsed, this._bodyInit = n, n ? typeof n == "string" ? this._bodyText = n : Fe.blob && Blob.prototype.isPrototypeOf(n) ? this._bodyBlob = n : Fe.formData && FormData.prototype.isPrototypeOf(n) ? this._bodyFormData = n : Fe.searchParams && URLSearchParams.prototype.isPrototypeOf(n) ? this._bodyText = n.toString() : Fe.arrayBuffer && Fe.blob && dy(n) ? (this._bodyArrayBuffer = ma(n.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : Fe.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(n) || my(n)) ? this._bodyArrayBuffer = ma(n) : this._bodyText = n = Object.prototype.toString.call(n) : this._bodyText = "", this.headers.get("content-type") || (typeof n == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : Fe.searchParams && URLSearchParams.prototype.isPrototypeOf(n) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
  }, Fe.blob && (this.blob = function() {
    var n = bi(this);
    if (n)
      return n;
    if (this._bodyBlob)
      return Promise.resolve(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(new Blob([this._bodyArrayBuffer]));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as blob");
    return Promise.resolve(new Blob([this._bodyText]));
  }, this.arrayBuffer = function() {
    if (this._bodyArrayBuffer) {
      var n = bi(this);
      return n || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
        this._bodyArrayBuffer.buffer.slice(
          this._bodyArrayBuffer.byteOffset,
          this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
        )
      ) : Promise.resolve(this._bodyArrayBuffer));
    } else
      return this.blob().then(gy);
  }), this.text = function() {
    var n = bi(this);
    if (n)
      return n;
    if (this._bodyBlob)
      return vy(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(by(this._bodyArrayBuffer));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as text");
    return Promise.resolve(this._bodyText);
  }, Fe.formData && (this.formData = function() {
    return this.text().then(Ey);
  }), this.json = function() {
    return this.text().then(JSON.parse);
  }, this;
}
var wy = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
function _y(n) {
  var e = n.toUpperCase();
  return wy.indexOf(e) > -1 ? e : n;
}
function Ht(n, e) {
  if (!(this instanceof Ht))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  e = e || {};
  var t = e.body;
  if (n instanceof Ht) {
    if (n.bodyUsed)
      throw new TypeError("Already read");
    this.url = n.url, this.credentials = n.credentials, e.headers || (this.headers = new we(n.headers)), this.method = n.method, this.mode = n.mode, this.signal = n.signal, !t && n._bodyInit != null && (t = n._bodyInit, n.bodyUsed = !0);
  } else
    this.url = String(n);
  if (this.credentials = e.credentials || this.credentials || "same-origin", (e.headers || !this.headers) && (this.headers = new we(e.headers)), this.method = _y(e.method || this.method || "GET"), this.mode = e.mode || this.mode || null, this.signal = e.signal || this.signal, this.referrer = null, (this.method === "GET" || this.method === "HEAD") && t)
    throw new TypeError("Body not allowed for GET or HEAD requests");
  if (this._initBody(t), (this.method === "GET" || this.method === "HEAD") && (e.cache === "no-store" || e.cache === "no-cache")) {
    var r = /([?&])_=[^&]*/;
    if (r.test(this.url))
      this.url = this.url.replace(r, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
    else {
      var i = /\?/;
      this.url += (i.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
    }
  }
}
Ht.prototype.clone = function() {
  return new Ht(this, { body: this._bodyInit });
};
function Ey(n) {
  var e = new FormData();
  return n.trim().split("&").forEach(function(t) {
    if (t) {
      var r = t.split("="), i = r.shift().replace(/\+/g, " "), s = r.join("=").replace(/\+/g, " ");
      e.append(decodeURIComponent(i), decodeURIComponent(s));
    }
  }), e;
}
function Sy(n) {
  var e = new we(), t = n.replace(/\r?\n[\t ]+/g, " ");
  return t.split("\r").map(function(r) {
    return r.indexOf(`
`) === 0 ? r.substr(1, r.length) : r;
  }).forEach(function(r) {
    var i = r.split(":"), s = i.shift().trim();
    if (s) {
      var o = i.join(":").trim();
      e.append(s, o);
    }
  }), e;
}
Wu.call(Ht.prototype);
function it(n, e) {
  if (!(this instanceof it))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  e || (e = {}), this.type = "default", this.status = e.status === void 0 ? 200 : e.status, this.ok = this.status >= 200 && this.status < 300, this.statusText = e.statusText === void 0 ? "" : "" + e.statusText, this.headers = new we(e.headers), this.url = e.url || "", this._initBody(n);
}
Wu.call(it.prototype);
it.prototype.clone = function() {
  return new it(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new we(this.headers),
    url: this.url
  });
};
it.error = function() {
  var n = new it(null, { status: 0, statusText: "" });
  return n.type = "error", n;
};
var ky = [301, 302, 303, 307, 308];
it.redirect = function(n, e) {
  if (ky.indexOf(e) === -1)
    throw new RangeError("Invalid status code");
  return new it(null, { status: e, headers: { location: n } });
};
var $t = Ce.DOMException;
try {
  new $t();
} catch {
  $t = function(e, t) {
    this.message = e, this.name = t;
    var r = Error(e);
    this.stack = r.stack;
  }, $t.prototype = Object.create(Error.prototype), $t.prototype.constructor = $t;
}
function Ku(n, e) {
  return new Promise(function(t, r) {
    var i = new Ht(n, e);
    if (i.signal && i.signal.aborted)
      return r(new $t("Aborted", "AbortError"));
    var s = new XMLHttpRequest();
    function o() {
      s.abort();
    }
    s.onload = function() {
      var l = {
        status: s.status,
        statusText: s.statusText,
        headers: Sy(s.getAllResponseHeaders() || "")
      };
      l.url = "responseURL" in s ? s.responseURL : l.headers.get("X-Request-URL");
      var c = "response" in s ? s.response : s.responseText;
      setTimeout(function() {
        t(new it(c, l));
      }, 0);
    }, s.onerror = function() {
      setTimeout(function() {
        r(new TypeError("Network request failed"));
      }, 0);
    }, s.ontimeout = function() {
      setTimeout(function() {
        r(new TypeError("Network request failed"));
      }, 0);
    }, s.onabort = function() {
      setTimeout(function() {
        r(new $t("Aborted", "AbortError"));
      }, 0);
    };
    function a(l) {
      try {
        return l === "" && Ce.location.href ? Ce.location.href : l;
      } catch {
        return l;
      }
    }
    s.open(i.method, a(i.url), !0), i.credentials === "include" ? s.withCredentials = !0 : i.credentials === "omit" && (s.withCredentials = !1), "responseType" in s && (Fe.blob ? s.responseType = "blob" : Fe.arrayBuffer && i.headers.get("Content-Type") && i.headers.get("Content-Type").indexOf("application/octet-stream") !== -1 && (s.responseType = "arraybuffer")), e && typeof e.headers == "object" && !(e.headers instanceof we) ? Object.getOwnPropertyNames(e.headers).forEach(function(l) {
      s.setRequestHeader(l, xs(e.headers[l]));
    }) : i.headers.forEach(function(l, c) {
      s.setRequestHeader(c, l);
    }), i.signal && (i.signal.addEventListener("abort", o), s.onreadystatechange = function() {
      s.readyState === 4 && i.signal.removeEventListener("abort", o);
    }), s.send(typeof i._bodyInit > "u" ? null : i._bodyInit);
  });
}
Ku.polyfill = !0;
Ce.fetch || (Ce.fetch = Ku, Ce.Headers = we, Ce.Request = Ht, Ce.Response = it);
var xy = self.fetch.bind(self);
const Ty = /* @__PURE__ */ py(xy);
function Ay({
  graphQLErrors: n,
  networkError: e,
  operation: t,
  forward: r,
  response: i
}) {
  if (n && n.forEach(
    ({ message: s, debugMessage: o, locations: a, path: l }) => console.error(
      `[GraphQL error]: ${s}`,
      `
  Message : ${o}`,
      `
  Path    : ${l}`,
      `
  Location: ${JSON.stringify(a)}`
    )
  ), e) {
    const { name: s, statusCode: o, result: a = {} } = e;
    console.error(`[Network error]: ${s}, status code: ${o}`);
  }
}
function Iy(n) {
  return n.query.definitions.find(
    (r) => r.kind === "OperationDefinition"
  ).selectionSet.selections.find(
    (r) => r.kind === "Field"
  ).name.value;
}
function Oy(n) {
  return n.query.definitions.find(
    (t) => t.kind === "OperationDefinition"
  ).operation;
}
class Cy extends Qe {
  constructor() {
    super(), this.__wallet = null, this.__pubkey = null;
  }
  /**
   * Set the wallet for encryption
   * @param {Object|null} wallet - Wallet object
   */
  setWallet(e) {
    this.__wallet = e;
  }
  /**
   * Get the current wallet
   * @returns {Object|null} Wallet object
   */
  getWallet() {
    return this.__wallet;
  }
  /**
   * Set the public key for encryption
   * @param {string|null} pubkey - Public key
   */
  setPubKey(e) {
    this.__pubkey = e;
  }
  /**
   * Get the current public key
   * @returns {string|null} Public key
   */
  getPubKey() {
    return this.__pubkey;
  }
  /**
   * Handle the request and apply encryption if necessary
   * @param {Object} operation - GraphQL operation
   * @param {function} forward - Function to forward the operation
   * @returns {Observable} Observable of the operation result
   */
  request(e, t) {
    const r = Iy(e), i = Oy(e), s = i === "mutation" && r === "ProposeMolecule";
    if ([
      i === "query" && ["__schema", "ContinuId"].includes(r),
      i === "mutation" && r === "AccessToken",
      s && he.get(e, "variables.molecule.atoms.0.isotope") === "U"
    ].some((u) => u))
      return t(e);
    const a = this.getWallet(), l = this.getPubKey();
    if (!l)
      throw new je("CipherLink::request() - Node public key missing!");
    if (!a)
      throw new je("CipherLink::request() - Authorized wallet missing!");
    const c = {
      query: ss(e.query),
      variables: JSON.stringify(e.variables)
    };
    return e.operationName = null, e.query = se`query ($Hash: String!) { CipherHash(Hash: $Hash) { hash } }`, e.variables = { Hash: JSON.stringify(a.encryptMessage(c, l)) }, t(e).map((u) => {
      let d = u.data;
      if (d.data && (d = d.data), d.CipherHash && d.CipherHash.hash) {
        const p = JSON.parse(d.CipherHash.hash), m = a.decryptMessage(p);
        if (m === null)
          throw new je("CipherLink::request() - Unable to decrypt response!");
        return m;
      }
      return u;
    });
  }
}
class ur extends Up {
  /**
   * @param {Object} config - Configuration object
   * @param {string} config.serverUri - URI of the GraphQL server
   * @param {Object|null} config.soketi - WebSocket configuration (optional)
   * @param {boolean} config.encrypt - Whether to use encryption (default: false)
   */
  constructor({ serverUri: e, soketi: t = null, encrypt: r = !1 }) {
    const i = fu({
      uri: e,
      fetch: Ty
    }), s = "", o = ry((d, { headers: p }) => ({
      headers: {
        ...p,
        "X-Auth-Token": s
      }
    })), a = Vu(Ay);
    let l = Io([o, a, i]), c;
    r && (c = new Cy(), l = Io([c, l]));
    let u;
    t && t.socketUri && (u = new sy(ly({
      url: t.socketUri,
      connectionParams: () => ({
        authToken: s
      })
    })), l = _f(
      ({ query: d }) => {
        const p = Lr(d);
        return p.kind === "OperationDefinition" && p.operation === "subscription";
      },
      u,
      l
    )), super({
      link: l,
      cache: new Rp(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "no-cache",
          errorPolicy: "ignore"
        },
        query: {
          fetchPolicy: "no-cache",
          errorPolicy: "all"
        },
        mutate: {
          fetchPolicy: "no-cache",
          errorPolicy: "all"
        }
      }
    }), this.serverUri = e, this.soketi = t, this.authToken = s, this.pubkey = null, this.wallet = null, this.cipherLink = c, this.wsLink = u;
  }
  /**
   * Set authentication data
   * @param {Object} authData - Authentication data
   * @param {string} authData.token - Auth token
   * @param {string} authData.pubkey - Public key
   * @param {Object} authData.wallet - Wallet object
   */
  setAuthData({ token: e, pubkey: t, wallet: r }) {
    this.authToken = e, this.pubkey = t, this.wallet = r, this.cipherLink && (this.cipherLink.setWallet(r), this.cipherLink.setPubKey(t)), this.wsLink && (this.wsLink.client.connectionParams = () => ({
      authToken: this.authToken
    }));
  }
  /**
   * Disconnect the WebSocket connection
   */
  socketDisconnect() {
    this.wsLink && this.wsLink.client.dispose();
  }
  // Getter methods
  getAuthToken() {
    return this.authToken;
  }
  getPubKey() {
    return this.pubkey;
  }
  getWallet() {
    return this.wallet;
  }
  getServerUri() {
    return this.serverUri;
  }
  getSocketUri() {
    return this.soketi ? this.soketi.socketUri : null;
  }
}
class Ry {
  /**
   * @param {Client} client - Apollo Client instance
   */
  constructor(e) {
    this.$__client = e, this.$__subscribers = {};
  }
  /**
   * Set the client instance
   * @param {Client} client - Apollo Client instance
   */
  setClient(e) {
    this.$__client = e;
  }
  /**
   * Create a new subscription
   * @param {Object} request - Subscription request
   * @param {Function} closure - Callback function for subscription updates
   * @returns {Object} Subscription object
   */
  subscribe(e, t) {
    const r = this.$__client.subscribe(e).subscribe(t);
    return this.$__subscribers[e.operationName] = r, r;
  }
  /**
   * Unsubscribe from a specific subscription
   * @param {string} operationName - Name of the operation to unsubscribe from
   */
  unsubscribe(e) {
    this.$__subscribers[e] && (this.$__subscribers[e].unsubscribe(), this.$__client.unsubscribeFromChannel(e), delete this.$__subscribers[e]);
  }
  /**
   * Unsubscribe from all subscriptions
   */
  unsubscribeAll() {
    Object.keys(this.$__subscribers).forEach(this.unsubscribe.bind(this));
  }
  /**
   * Clear all subscriptions without unsubscribing
   */
  clear() {
    this.$__subscribers = {};
  }
}
class Ny {
  /**
   * @param {Object} config - Configuration object
   * @param {string} config.serverUri - URI of the GraphQL server
   * @param {Object|null} config.socket - WebSocket configuration (optional)
   * @param {boolean} config.encrypt - Whether to use encryption (default: false)
   */
  constructor({ serverUri: e, socket: t = null, encrypt: r = !1 }) {
    this.$__client = new ur({ serverUri: e, soketi: t, encrypt: r }), this.$__subscriptionManager = new Ry(this.$__client);
  }
  /**
   * Set encryption for the client
   * @param {boolean} encrypt - Whether to use encryption
   */
  setEncryption(e = !1) {
    const t = {
      serverUri: this.$__client.getServerUri(),
      soketi: {
        socketUri: this.$__client.getSocketUri(),
        appKey: "knishio"
      },
      encrypt: e
    };
    this.$__client = new ur(t), this.$__subscriptionManager.setClient(this.$__client);
  }
  /**
   * Unsubscribe from a specific subscription
   * @param {string} operationName - Name of the operation to unsubscribe from
   */
  unsubscribe(e) {
    this.$__subscriptionManager.unsubscribe(e);
  }
  /**
   * Unsubscribe from all subscriptions
   */
  unsubscribeAll() {
    this.$__subscriptionManager.unsubscribeAll();
  }
  /**
   * Disconnect the WebSocket
   */
  socketDisconnect() {
    this.$__client.socketDisconnect(), this.$__subscriptionManager.clear();
  }
  /**
   * Create a new subscription
   * @param {Object} request - Subscription request
   * @param {Function} closure - Callback function for subscription updates
   * @returns {Object} Subscription object
   */
  subscribe(e, t) {
    return this.$__subscriptionManager.subscribe(e, t);
  }
  /**
   * Execute a query
   * @param {Object} request - Query request
   * @returns {Promise} Promise resolving to the query result
   */
  async query(e) {
    return this.$__client.query(e);
  }
  /**
   * Execute a mutation
   * @param {Object} request - Mutation request
   * @returns {Promise} Promise resolving to the mutation result
   */
  async mutate(e) {
    return this.$__client.mutate(e);
  }
  /**
   * Set authentication data for the client
   * @param {Object} authData - Authentication data
   * @param {string} authData.token - Authentication token
   * @param {string} authData.pubkey - Public key
   * @param {Object} authData.wallet - Wallet object
   */
  setAuthData({ token: e, pubkey: t, wallet: r }) {
    this.$__client.setAuthData({ token: e, pubkey: t, wallet: r });
  }
  // Getter methods
  getAuthToken() {
    return this.$__client.getAuthToken();
  }
  getUri() {
    return this.$__client ? this.$__client.getServerUri() : null;
  }
  getSocketUri() {
    return this.$__client.getSocketUri();
  }
  /**
   * Set the server URI
   * @param {string} uri - New server URI
   */
  setUri(e) {
    const t = {
      serverUri: e,
      soketi: {
        socketUri: this.$__client.getSocketUri(),
        appKey: "knishio"
      },
      encrypt: !!this.$__client.cipherLink
    };
    this.$__client = new ur(t), this.$__subscriptionManager.setClient(this.$__client);
  }
  /**
   * Set the WebSocket URI
   * @param {Object} config - WebSocket configuration
   * @param {string} config.socketUri - New WebSocket URI
   * @param {string} config.appKey - Application key for the WebSocket
   */
  setSocketUri({ socketUri: e, appKey: t }) {
    const r = {
      serverUri: this.$__client.getServerUri(),
      soketi: { socketUri: e, appKey: t },
      encrypt: !!this.$__client.cipherLink
    };
    this.$__client = new ur(r), this.$__subscriptionManager.setClient(this.$__client);
  }
}
class Vy {
  /**
   * Class constructor
   *
   * @param {string} uri
   * @param {string|null} cellSlug
   * @param {object|null} socket
   * @param {ApolloClientWrapper|null} client
   * @param {number} serverSdkVersion
   * @param {boolean} logging
   */
  constructor({
    uri: e,
    cellSlug: t = null,
    client: r = null,
    socket: i = null,
    serverSdkVersion: s = 3,
    logging: o = !1
  }) {
    this.initialize({
      uri: e,
      cellSlug: t,
      socket: i,
      client: r,
      serverSdkVersion: s,
      logging: o
    });
  }
  /**
   * Initializes a new Knish.IO client session
   *
   * @param {string|[]} uri
   * @param {string|null} cellSlug
   * @param {object|null} socket
   * @param {ApolloClientWrapper|null} client
   * @param {number} serverSdkVersion
   * @param {boolean} logging
   */
  initialize({
    uri: e,
    cellSlug: t = null,
    socket: r = null,
    client: i = null,
    serverSdkVersion: s = 3,
    logging: o = !1
  }) {
    this.reset(), this.$__logging = o, this.$__uris = typeof e == "object" ? e : [e], this.$__authTokenObjects = {}, this.$__authInProcess = !1, this.abortControllers = /* @__PURE__ */ new Map(), t && this.setCellSlug(t);
    for (const a in this.$__uris) {
      const l = this.$__uris[a];
      this.$__authTokenObjects[l] = null;
    }
    this.log("info", `KnishIOClient::initialize() - Initializing new Knish.IO client session for SDK version ${s}...`), this.$__client = i || new Ny({
      socket: {
        socketUri: null,
        appKey: "knishio",
        ...r || {}
      },
      serverUri: this.getRandomUri()
    }), this.$__serverSdkVersion = s;
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
   * @return {ApolloClientWrapper}
   */
  subscribe() {
    if (!this.client().getSocketUri())
      throw new je("KnishIOClient::subscribe() - Socket client not initialized!");
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
  cellSlug() {
    return this.$__cellSlug || null;
  }
  /**
   * Sets the Cell identifier for this session
   *
   * @param cellSlug
   */
  setCellSlug(e) {
    this.$__cellSlug = e;
  }
  /**
   * Retrieves the endpoint URI for this session
   *
   * @return {string}
   */
  uri() {
    return this.$__client.getUri();
  }
  /**
   * Returns the Apollo client class session
   *
   * @return {ApolloClientWrapper}
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
      }).then(() => {
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
    return this.log("info", `KnishIOClient::hashSecret(${t ? `source: ${t}` : ""}) - Computing wallet bundle from secret...`), un(e);
  }
  /**
   * Retrieves the stored secret for this session
   *
   * @return {string}
   */
  getSecret() {
    if (!this.hasSecret())
      throw new Ei("KnishIOClient::getSecret() - Unable to find a stored secret! Have you set a secret?");
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
      throw new Ei("KnishIOClient::getBundle() - Unable to find a stored bundle! Have you set a secret?");
    return this.$__bundle;
  }
  /**
   * Retrieves the device fingerprint.
   *
   * @returns {Promise<string>} A promise that resolves to the device fingerprint as a string.
   */
  getFingerprint() {
    return Hd();
  }
  getFingerprintData() {
    return Uu();
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
    return e ? e.key = J.generateKey({
      secret: this.getSecret(),
      token: e.token,
      position: e.position
    }) : e = new J({
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
    sourceWallet: r = null,
    remainderWallet: i = null
  }) {
    return this.log("info", "KnishIOClient::createMolecule() - Creating a new molecule..."), e = e || this.getSecret(), t = t || this.getBundle(), !r && this.lastMoleculeQuery && this.getRemainderWallet().token === "USER" && this.lastMoleculeQuery.response() && this.lastMoleculeQuery.response().success() && (r = this.getRemainderWallet()), r === null && (r = await this.getSourceWallet()), this.remainderWallet = i || J.create({
      secret: e,
      bundle: t,
      token: "USER",
      batchId: r.batchId,
      characters: r.characters
    }), new lt({
      secret: e,
      sourceWallet: r,
      remainderWallet: this.getRemainderWallet(),
      cellSlug: this.cellSlug(),
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
    const r = t || await this.createMolecule({}), i = new e(this.client(), this, r);
    if (!(i instanceof Re))
      throw new je(`${this.constructor.name}::createMoleculeMutation() - This method only accepts MutationProposeMolecule!`);
    return this.lastMoleculeQuery = i, i;
  }
  /**
   *
   * @param query
   * @param variables
   * @returns {Promise<*>}
   */
  async executeQuery(e, t = null) {
    this.$__authToken && this.$__authToken.isExpired() && (this.log("info", "KnishIOClient::executeQuery() - Access token is expired. Getting new one..."), await this.requestAuthToken({
      secret: this.$__secret,
      cellSlug: this.$__cellSlug,
      encrypt: this.$__encrypt
    }));
    const r = new AbortController(), i = JSON.stringify({ query: e.$__query, variables: t });
    this.abortControllers.set(i, r);
    try {
      const s = await e.execute({
        variables: t,
        context: {
          fetchOptions: {
            signal: r.signal
          }
        }
      });
      return this.abortControllers.delete(i), s;
    } catch (s) {
      if (s.name === "AbortError")
        this.log("warn", "Query was cancelled");
      else
        throw s;
    }
  }
  cancelQuery(e, t = null) {
    const r = JSON.stringify({ query: e.$__query, variables: t }), i = this.abortControllers.get(r);
    i && (i.abort(), this.abortControllers.delete(r));
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
    type: r = "regular"
  }) {
    const i = this.createQuery(ed);
    return this.executeQuery(i, {
      bundleHash: t || this.getBundle(),
      token: e,
      type: r
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
    type: r = "regular"
  }) {
    const i = (await this.queryBalance({
      token: e,
      type: r
    })).payload();
    if (i === null || nn.cmp(i.balance, t) < 0)
      throw new ct();
    if (!i.position || !i.address)
      throw new ct("Source wallet can not be a shadow wallet.");
    return i;
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
    return await this.createSubscribe(Ed).execute({
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
    closure: r
  }) {
    if (!t)
      throw new je(`${this.constructor.name}::subscribeWalletStatus() - Token parameter is required!`);
    return this.createSubscribe(Sd).execute({
      variables: {
        bundle: e || this.getBundle(),
        token: t
      },
      closure: r
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
    return this.createSubscribe(kd).execute({
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
    closure: r
  }) {
    return this.createSubscribe(xd).execute({
      variables: {
        metaType: e,
        metaId: t
      },
      closure: r
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
    key: r = null,
    value: i = null,
    latest: s = !0,
    fields: o = null,
    filter: a = null,
    queryArgs: l = null,
    count: c = null,
    countBy: u = null,
    throughAtom: d = !0,
    values: p = null,
    keys: m = null,
    atomValues: v = null
  }) {
    this.log("info", `KnishIOClient::queryMeta() - Querying metaType: ${e}, metaId: ${t}...`);
    let w, _;
    return d ? (w = this.createQuery(la), _ = la.createVariables({
      metaType: e,
      metaId: t,
      key: r,
      value: i,
      latest: s,
      filter: a,
      queryArgs: l,
      countBy: u,
      values: p,
      keys: m,
      atomValues: v
    })) : (w = this.createQuery(oa), _ = oa.createVariables({
      metaType: e,
      metaId: t,
      key: r,
      value: i,
      latest: s,
      filter: a,
      queryArgs: l,
      count: c,
      countBy: u
    })), this.executeQuery(w, _).then((E) => E.payload());
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
    const t = this.createQuery(Qn);
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
    const t = this.createQuery(nd);
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
    bundleHashes: r,
    bundleHash: i,
    positions: s,
    position: o,
    walletAddresses: a,
    walletAddress: l,
    isotopes: c,
    isotope: u,
    tokenSlugs: d,
    tokenSlug: p,
    cellSlugs: m,
    cellSlug: v,
    batchIds: w,
    batchId: _,
    values: E,
    value: T,
    metaTypes: I,
    metaType: A,
    metaIds: R,
    metaId: N,
    indexes: M,
    index: B,
    filter: q,
    latest: z,
    queryArgs: Y = {
      limit: 15,
      offset: 1
    }
  }) {
    this.log("info", "KnishIOClient::queryAtom() - Querying atom instances");
    const Te = this.createQuery(ca);
    return await this.executeQuery(Te, ca.createVariables({
      molecularHashes: e,
      molecularHash: t,
      bundleHashes: r,
      bundleHash: i,
      positions: s,
      position: o,
      walletAddresses: a,
      walletAddress: l,
      isotopes: c,
      isotope: u,
      tokenSlugs: d,
      tokenSlug: p,
      cellSlugs: m,
      cellSlug: v,
      batchIds: w,
      batchId: _,
      values: E,
      value: T,
      metaTypes: I,
      metaType: A,
      metaIds: R,
      metaId: N,
      indexes: M,
      index: B,
      filter: q,
      latest: z,
      queryArgs: Y
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
    const t = new J({
      secret: this.getSecret(),
      token: e
    }), r = await this.createMoleculeMutation({
      mutationClass: vd
    });
    return r.fillMolecule(t), await this.executeQuery(r);
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
    metaId: r
  }) {
    const i = this.createQuery(Od);
    return await this.executeQuery(i, {
      bundleHash: e,
      metaType: t,
      metaId: r
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
    metaId: r,
    ipAddress: i,
    browser: s,
    osCpu: o,
    resolution: a,
    timeZone: l,
    countBy: c,
    interval: u
  }) {
    const d = this.createQuery(Rd);
    return await this.executeQuery(d, {
      bundleHash: e,
      metaType: t,
      metaId: r,
      ipAddress: i,
      browser: s,
      osCpu: o,
      resolution: a,
      timeZone: l,
      countBy: c,
      interval: u
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
    metaId: r,
    ipAddress: i,
    browser: s,
    osCpu: o,
    resolution: a,
    timeZone: l,
    json: c = {}
  }) {
    const u = this.createQuery(Ad);
    return await this.executeQuery(u, {
      bundleHash: e,
      metaType: t,
      metaId: r,
      ipAddress: i,
      browser: s,
      osCpu: o,
      resolution: a,
      timeZone: l,
      json: JSON.stringify(c)
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
    meta: r = null,
    batchId: i = null,
    units: s = []
  }) {
    const o = he.get(r || {}, "fungibility");
    if (o === "stackable" && (r.batchId = i || Er({})), ["nonfungible", "stackable"].includes(o) && s.length > 0) {
      if (he.get(r || {}, "decimals") > 0)
        throw new _d();
      if (t > 0)
        throw new or();
      t = s.length, r.splittable = 1, r.decimals = 0, r.tokenUnits = JSON.stringify(s);
    }
    const a = new J({
      secret: this.getSecret(),
      bundle: this.getBundle(),
      token: e,
      batchId: i
    }), l = await this.createMoleculeMutation({
      mutationClass: od
    });
    return l.fillMolecule({
      recipientWallet: a,
      amount: t,
      meta: r || {}
    }), await this.executeQuery(l);
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
    rule: r,
    policy: i = {}
  }) {
    const s = await this.createMoleculeMutation(
      {
        mutationClass: Pd,
        molecule: await this.createMolecule({
          secret: this.getSecret(),
          sourceWallet: await this.getSourceWallet()
        })
      }
    );
    return s.fillMolecule({
      metaType: e,
      metaId: t,
      rule: r,
      policy: i
    }), await this.executeQuery(s);
  }
  /**
   * Builds and executes a molecule to convey new metadata to the ledger
   *
   * @param {string} metaType - The type of the metadata entry.
   * @param {string} metaId - The ID of the metadata entry.
   * @param {Object} [meta=null] - The metadata object.
   * @param {Object} [policy={}] - The policy object.
   * @returns {Promise<ResponseCreateMeta>} - A Promise that resolves with the created metadata entry.
   */
  async createMeta({
    metaType: e,
    metaId: t,
    meta: r = null,
    policy: i = {}
  }) {
    const s = await this.createMoleculeMutation(
      {
        mutationClass: md,
        molecule: await this.createMolecule({
          secret: this.getSecret(),
          sourceWallet: await this.getSourceWallet()
        })
      }
    ), o = r || {};
    return s.fillMolecule({
      metaType: e,
      metaId: t,
      meta: o,
      policy: i
    }), await this.executeQuery(s);
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
    code: r
  }) {
    const i = await this.createMoleculeMutation({
      mutationClass: fd
    });
    return i.fillMolecule({
      type: e,
      contact: t,
      code: r
    }), await this.executeQuery(i);
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
    policy: r = {}
  }) {
    const i = await this.createMolecule({});
    i.addPolicyAtom({
      metaType: e,
      metaId: t,
      meta: {},
      policy: r
    }), i.addContinuIdAtom(), i.sign({
      bundle: this.getBundle()
    }), i.check();
    const s = await this.createMoleculeMutation({
      mutationClass: Re,
      molecule: i
    });
    return await this.executeQuery(s);
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
    const r = this.createQuery(Fd);
    return await this.executeQuery(r, {
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
    unspent: r = !0
  }) {
    this.log("info", `KnishIOClient::queryWallets() - Querying wallets${e ? ` for ${e}` : ""}...`);
    const i = this.createQuery(Xp);
    return this.executeQuery(i, {
      bundleHash: e || this.getBundle(),
      tokenSlug: t,
      unspent: r
    }).then((s) => s.payload());
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
    raw: r = !1
  }) {
    this.log("info", `KnishIOClient::queryBundle() - Querying wallet bundle metadata${e ? ` for ${e}` : ""}...`), e || (e = this.getBundle()), typeof e == "string" && (e = [e]);
    const i = this.createQuery(Yp);
    return this.executeQuery(i, { bundleHashes: e }).then((s) => r ? s : s.payload());
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
    const t = this.createQuery(Gp);
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
    amount: r = null,
    units: i = [],
    meta: s = null,
    batchId: o = null
  }) {
    let a, l;
    s = s || {};
    const c = this.createQuery(Nd), u = await this.executeQuery(c, {
      slug: e
    }), d = he.get(u.data(), "0.fungibility") === "stackable";
    if (!d && o !== null)
      throw new hr("Expected Batch ID = null for non-stackable tokens.");
    if (d && o === null && (o = Er({})), i.length > 0) {
      if (r > 0)
        throw new or();
      r = i.length, s.tokenUnits = JSON.stringify(i);
    }
    t ? (Object.prototype.toString.call(t) === "[object String]" && (J.isBundleHash(t) ? (a = "walletBundle", l = t) : t = J.create({
      secret: t,
      token: e
    })), t instanceof J && (a = "wallet", s.position = t.position, s.bundle = t.bundle, l = t.address)) : (a = "walletBundle", l = this.getBundle());
    const p = await this.createMoleculeMutation({
      mutationClass: ud
    });
    return p.fillMolecule({
      token: e,
      amount: r,
      metaType: a,
      metaId: l,
      meta: s,
      batchId: o
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
    molecule: r = null
  }) {
    const i = await this.createMoleculeMutation({
      mutationClass: dd,
      molecule: r
    });
    return i.fillMolecule({
      token: e,
      batchId: t
    }), await this.executeQuery(i);
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
      throw new aa();
    t.forEach((i) => {
      if (!i.isShadow())
        throw new aa();
    });
    const r = [];
    for (const i of t)
      r.push(await this.claimShadowWallet({
        token: e,
        batchId: i.batchId
      }));
    return r;
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
    amount: r = null,
    units: i = [],
    batchId: s = null,
    sourceWallet: o = null
  }) {
    if (i.length > 0) {
      if (r > 0)
        throw new or();
      r = i.length;
    }
    if (o === null && (o = await this.querySourceWallet({
      token: t,
      amount: r
    })), o === null || nn.cmp(o.balance, r) < 0)
      throw new ct();
    const a = J.create({
      bundle: e,
      token: t
    });
    s !== null ? a.batchId = s : a.initBatchId({
      sourceWallet: o
    });
    const l = o.createRemainder(this.getSecret());
    o.splitUnits(
      i,
      l,
      a
    );
    const c = await this.createMolecule({
      sourceWallet: o,
      remainderWallet: l
    }), u = await this.createMoleculeMutation({
      mutationClass: ld,
      molecule: c
    });
    return u.fillMolecule({
      recipientWallet: a,
      amount: r
    }), await this.executeQuery(u);
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
    tradeRates: r,
    sourceWallet: i = null
  }) {
    i === null && (i = await this.querySourceWallet({
      token: e,
      amount: t
    }));
    const s = i.createRemainder(this.getSecret()), o = await this.createMolecule({
      sourceWallet: i,
      remainderWallet: s
    }), a = await this.createMoleculeMutation({
      mutationClass: Ld,
      molecule: o
    });
    return a.fillMolecule({
      amount: t,
      tradeRates: r
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
    sourceWallet: r = null,
    signingWallet: i = null
  }) {
    r === null && (r = await this.querySourceWallet({
      token: e,
      amount: t,
      type: "buffer"
    }));
    const s = r, o = await this.createMolecule({
      sourceWallet: r,
      remainderWallet: s
    }), a = await this.createMoleculeMutation({
      mutationClass: Ud,
      molecule: o
    }), l = {};
    return l[this.getBundle()] = t, a.fillMolecule({
      recipients: l,
      signingWallet: i
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
    units: r = [],
    sourceWallet: i = null
  }) {
    i === null && (i = await this.querySourceWallet({
      token: e,
      amount: t
    }));
    const s = i.createRemainder(this.getSecret());
    if (r.length > 0) {
      if (t > 0)
        throw new or();
      t = r.length, i.splitUnits(
        r,
        s
      );
    }
    const o = await this.createMolecule({
      sourceWallet: i,
      remainderWallet: s
    });
    o.burnToken({ amount: t }), o.sign({
      bundle: this.getBundle()
    }), o.check();
    const a = await this.createMoleculeMutation({
      mutationClass: Re,
      molecule: o
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
    units: r = [],
    sourceWallet: i = null
  }) {
    if (i === null && (i = (await this.queryBalance({ token: e })).payload()), !i)
      throw new ct("Source wallet is missing or invalid.");
    const s = i.createRemainder(this.getSecret()), o = await this.createMolecule({
      sourceWallet: i,
      remainderWallet: s
    });
    o.replenishToken({
      amount: t,
      units: r
    }), o.sign({
      bundle: this.getBundle()
    }), o.check();
    const a = await this.createMoleculeMutation({
      mutationClass: Re,
      molecule: o
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
    newTokenUnit: r,
    fusedTokenUnitIds: i,
    sourceWallet: s = null
  }) {
    if (s === null && (s = (await this.queryBalance({ token: t })).payload()), s === null)
      throw new ct("Source wallet is missing or invalid.");
    if (!s.tokenUnits || !s.tokenUnits.length)
      throw new ct("Source wallet does not have token units.");
    if (!i.length)
      throw new ct("Fused token unit list is empty.");
    const o = [];
    s.tokenUnits.forEach((d) => {
      o.push(d.id);
    }), i.forEach((d) => {
      if (!o.includes(d))
        throw new ct(`Fused token unit ID = ${d} does not found in the source wallet.`);
    });
    const a = J.create({
      bundle: e,
      token: t
    });
    a.initBatchId({ sourceWallet: s });
    const l = s.createRemainder(this.getSecret());
    s.splitUnits(i, l), r.metas.fusedTokenUnits = s.getTokenUnitsData(), a.tokenUnits = [r];
    const c = await this.createMolecule({
      sourceWallet: s,
      remainderWallet: l
    });
    c.fuseToken(s.tokenUnits, a), c.sign({
      bundle: this.getBundle()
    }), c.check();
    const u = await this.createMoleculeMutation({
      mutationClass: Re,
      molecule: c
    });
    return this.executeQuery(u);
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
    const r = new J({
      secret: _i(await this.getFingerprint()),
      token: "AUTH"
    }), i = await this.createQuery(wd), s = {
      cellSlug: e,
      pubkey: r.pubkey,
      encrypt: t
    }, o = await i.execute({ variables: s });
    if (o.success()) {
      const a = Ln.create(o.payload(), r);
      this.setAuthToken(a);
    } else
      throw new ua(`KnishIOClient::requestGuestAuthToken() - Authorization attempt rejected by ledger. Reason: ${o.reason()}`);
    return o;
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
    const r = new J({
      secret: e,
      token: "AUTH"
    }), i = await this.createMolecule({
      secret: e,
      sourceWallet: r
    }), s = await this.createMoleculeMutation({
      mutationClass: id,
      molecule: i
    });
    s.fillMolecule({ meta: { encrypt: t ? "true" : "false" } });
    const o = await s.execute({});
    if (o.success()) {
      const a = Ln.create(o.payload(), r);
      this.setAuthToken(a);
    } else
      throw new ua(`KnishIOClient::requestProfileAuthToken() - Authorization attempt rejected by ledger. Reason: ${o.reason()}`);
    return o;
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
    cellSlug: r = null,
    encrypt: i = !1
  }) {
    if (this.$__serverSdkVersion < 3)
      return this.log("warn", "KnishIOClient::authorize() - Server SDK version does not require an authorization..."), null;
    e === null && t && (e = _i(t)), this.$__authInProcess = !0;
    let s;
    return e ? s = await this.requestProfileAuthToken({
      secret: e,
      encrypt: i
    }) : s = await this.requestGuestAuthToken({
      cellSlug: r,
      encrypt: i
    }), this.log("info", `KnishIOClient::authorize() - Successfully retrieved auth token ${this.$__authToken.getToken()}...`), this.switchEncryption(i), this.$__authInProcess = !1, s;
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
    this.$__authTokenObjects[this.uri()] = e, this.client().setAuthData(e.getAuthData()), this.$__authToken = e;
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
  H as Atom,
  Vy as KnishIOClient,
  _r as Meta,
  lt as Molecule,
  J as Wallet,
  Nc as base64ToHex,
  Py as bufferToHexString,
  Cc as charsetBaseConvert,
  wr as chunkSubstr,
  un as generateBundleHash,
  _i as generateSecret,
  Ly as hexStringToBuffer,
  Rc as hexToBase64,
  Dc as isHex,
  Zi as randomString
};
//# sourceMappingURL=client.es.mjs.map
