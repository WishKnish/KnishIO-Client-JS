const ma = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ga = "ARRAYBUFFER not supported by this environment", va = "UINT8ARRAY not supported by this environment";
function Os(r, e, t, n) {
  let i, s, o;
  const a = e || [0], l = (t = t || 0) >>> 3, h = n === -1 ? 3 : 0;
  for (i = 0; i < r.length; i += 1) o = i + l, s = o >>> 2, a.length <= s && a.push(0), a[s] |= r[i] << 8 * (h + n * (o % 4));
  return { value: a, binLen: 8 * r.length + t };
}
function ur(r, e, t) {
  switch (e) {
    case "UTF8":
    case "UTF16BE":
    case "UTF16LE":
      break;
    default:
      throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE");
  }
  switch (r) {
    case "HEX":
      return function(n, i, s) {
        return function(o, a, l, h) {
          let c, d, p, m;
          if (o.length % 2 != 0) throw new Error("String of HEX type must be in byte increments");
          const v = a || [0], w = (l = l || 0) >>> 3, _ = h === -1 ? 3 : 0;
          for (c = 0; c < o.length; c += 2) {
            if (d = parseInt(o.substr(c, 2), 16), isNaN(d)) throw new Error("String of HEX type contains invalid characters");
            for (m = (c >>> 1) + w, p = m >>> 2; v.length <= p; ) v.push(0);
            v[p] |= d << 8 * (_ + h * (m % 4));
          }
          return { value: v, binLen: 4 * o.length + l };
        }(n, i, s, t);
      };
    case "TEXT":
      return function(n, i, s) {
        return function(o, a, l, h, c) {
          let d, p, m, v, w, _, E, T, I = 0;
          const A = l || [0], R = (h = h || 0) >>> 3;
          if (a === "UTF8") for (E = c === -1 ? 3 : 0, m = 0; m < o.length; m += 1) for (d = o.charCodeAt(m), p = [], 128 > d ? p.push(d) : 2048 > d ? (p.push(192 | d >>> 6), p.push(128 | 63 & d)) : 55296 > d || 57344 <= d ? p.push(224 | d >>> 12, 128 | d >>> 6 & 63, 128 | 63 & d) : (m += 1, d = 65536 + ((1023 & d) << 10 | 1023 & o.charCodeAt(m)), p.push(240 | d >>> 18, 128 | d >>> 12 & 63, 128 | d >>> 6 & 63, 128 | 63 & d)), v = 0; v < p.length; v += 1) {
            for (_ = I + R, w = _ >>> 2; A.length <= w; ) A.push(0);
            A[w] |= p[v] << 8 * (E + c * (_ % 4)), I += 1;
          }
          else for (E = c === -1 ? 2 : 0, T = a === "UTF16LE" && c !== 1 || a !== "UTF16LE" && c === 1, m = 0; m < o.length; m += 1) {
            for (d = o.charCodeAt(m), T === !0 && (v = 255 & d, d = v << 8 | d >>> 8), _ = I + R, w = _ >>> 2; A.length <= w; ) A.push(0);
            A[w] |= d << 8 * (E + c * (_ % 4)), I += 2;
          }
          return { value: A, binLen: 8 * I + h };
        }(n, e, i, s, t);
      };
    case "B64":
      return function(n, i, s) {
        return function(o, a, l, h) {
          let c, d, p, m, v, w, _, E = 0;
          const T = a || [0], I = (l = l || 0) >>> 3, A = h === -1 ? 3 : 0, R = o.indexOf("=");
          if (o.search(/^[a-zA-Z0-9=+/]+$/) === -1) throw new Error("Invalid character in base-64 string");
          if (o = o.replace(/=/g, ""), R !== -1 && R < o.length) throw new Error("Invalid '=' found in base-64 string");
          for (d = 0; d < o.length; d += 4) {
            for (v = o.substr(d, 4), m = 0, p = 0; p < v.length; p += 1) c = ma.indexOf(v.charAt(p)), m |= c << 18 - 6 * p;
            for (p = 0; p < v.length - 1; p += 1) {
              for (_ = E + I, w = _ >>> 2; T.length <= w; ) T.push(0);
              T[w] |= (m >>> 16 - 8 * p & 255) << 8 * (A + h * (_ % 4)), E += 1;
            }
          }
          return { value: T, binLen: 8 * E + l };
        }(n, i, s, t);
      };
    case "BYTES":
      return function(n, i, s) {
        return function(o, a, l, h) {
          let c, d, p, m;
          const v = a || [0], w = (l = l || 0) >>> 3, _ = h === -1 ? 3 : 0;
          for (d = 0; d < o.length; d += 1) c = o.charCodeAt(d), m = d + w, p = m >>> 2, v.length <= p && v.push(0), v[p] |= c << 8 * (_ + h * (m % 4));
          return { value: v, binLen: 8 * o.length + l };
        }(n, i, s, t);
      };
    case "ARRAYBUFFER":
      try {
        new ArrayBuffer(0);
      } catch {
        throw new Error(ga);
      }
      return function(n, i, s) {
        return function(o, a, l, h) {
          return Os(new Uint8Array(o), a, l, h);
        }(n, i, s, t);
      };
    case "UINT8ARRAY":
      try {
        new Uint8Array(0);
      } catch {
        throw new Error(va);
      }
      return function(n, i, s) {
        return Os(n, i, s, t);
      };
    default:
      throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
  }
}
function Cs(r, e, t, n) {
  switch (r) {
    case "HEX":
      return function(i) {
        return function(s, o, a, l) {
          const h = "0123456789abcdef";
          let c, d, p = "";
          const m = o / 8, v = a === -1 ? 3 : 0;
          for (c = 0; c < m; c += 1) d = s[c >>> 2] >>> 8 * (v + a * (c % 4)), p += h.charAt(d >>> 4 & 15) + h.charAt(15 & d);
          return l.outputUpper ? p.toUpperCase() : p;
        }(i, e, t, n);
      };
    case "B64":
      return function(i) {
        return function(s, o, a, l) {
          let h, c, d, p, m, v = "";
          const w = o / 8, _ = a === -1 ? 3 : 0;
          for (h = 0; h < w; h += 3) for (p = h + 1 < w ? s[h + 1 >>> 2] : 0, m = h + 2 < w ? s[h + 2 >>> 2] : 0, d = (s[h >>> 2] >>> 8 * (_ + a * (h % 4)) & 255) << 16 | (p >>> 8 * (_ + a * ((h + 1) % 4)) & 255) << 8 | m >>> 8 * (_ + a * ((h + 2) % 4)) & 255, c = 0; c < 4; c += 1) v += 8 * h + 6 * c <= o ? ma.charAt(d >>> 6 * (3 - c) & 63) : l.b64Pad;
          return v;
        }(i, e, t, n);
      };
    case "BYTES":
      return function(i) {
        return function(s, o, a) {
          let l, h, c = "";
          const d = o / 8, p = a === -1 ? 3 : 0;
          for (l = 0; l < d; l += 1) h = s[l >>> 2] >>> 8 * (p + a * (l % 4)) & 255, c += String.fromCharCode(h);
          return c;
        }(i, e, t);
      };
    case "ARRAYBUFFER":
      try {
        new ArrayBuffer(0);
      } catch {
        throw new Error(ga);
      }
      return function(i) {
        return function(s, o, a) {
          let l;
          const h = o / 8, c = new ArrayBuffer(h), d = new Uint8Array(c), p = a === -1 ? 3 : 0;
          for (l = 0; l < h; l += 1) d[l] = s[l >>> 2] >>> 8 * (p + a * (l % 4)) & 255;
          return c;
        }(i, e, t);
      };
    case "UINT8ARRAY":
      try {
        new Uint8Array(0);
      } catch {
        throw new Error(va);
      }
      return function(i) {
        return function(s, o, a) {
          let l;
          const h = o / 8, c = a === -1 ? 3 : 0, d = new Uint8Array(h);
          for (l = 0; l < h; l += 1) d[l] = s[l >>> 2] >>> 8 * (c + a * (l % 4)) & 255;
          return d;
        }(i, e, t);
      };
    default:
      throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
  }
}
const Qr = 4294967296, M = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], st = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], ot = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], Hr = "Chosen SHA variant is not supported", ba = "Cannot set numRounds with MAC";
function gn(r, e) {
  let t, n;
  const i = r.binLen >>> 3, s = e.binLen >>> 3, o = i << 3, a = 4 - i << 3;
  if (i % 4 != 0) {
    for (t = 0; t < s; t += 4) n = i + t >>> 2, r.value[n] |= e.value[t >>> 2] << o, r.value.push(0), r.value[n + 1] |= e.value[t >>> 2] >>> a;
    return (r.value.length << 2) - 4 >= s + i && r.value.pop(), { value: r.value, binLen: r.binLen + e.binLen };
  }
  return { value: r.value.concat(e.value), binLen: r.binLen + e.binLen };
}
function Rs(r) {
  const e = { outputUpper: !1, b64Pad: "=", outputLen: -1 }, t = r || {}, n = "Output length must be a multiple of 8";
  if (e.outputUpper = t.outputUpper || !1, t.b64Pad && (e.b64Pad = t.b64Pad), t.outputLen) {
    if (t.outputLen % 8 != 0) throw new Error(n);
    e.outputLen = t.outputLen;
  } else if (t.shakeLen) {
    if (t.shakeLen % 8 != 0) throw new Error(n);
    e.outputLen = t.shakeLen;
  }
  if (typeof e.outputUpper != "boolean") throw new Error("Invalid outputUpper formatting option");
  if (typeof e.b64Pad != "string") throw new Error("Invalid b64Pad formatting option");
  return e;
}
function _t(r, e, t, n) {
  const i = r + " must include a value and format";
  if (!e) {
    if (!n) throw new Error(i);
    return n;
  }
  if (e.value === void 0 || !e.format) throw new Error(i);
  return ur(e.format, e.encoding || "UTF8", t)(e.value);
}
let An = class {
  constructor(e, t, n) {
    const i = n || {};
    if (this.t = t, this.i = i.encoding || "UTF8", this.numRounds = i.numRounds || 1, isNaN(this.numRounds) || this.numRounds !== parseInt(this.numRounds, 10) || 1 > this.numRounds) throw new Error("numRounds must a integer >= 1");
    this.o = e, this.h = [], this.u = 0, this.l = !1, this.A = 0, this.H = !1, this.S = [], this.p = [];
  }
  update(e) {
    let t, n = 0;
    const i = this.m >>> 5, s = this.C(e, this.h, this.u), o = s.binLen, a = s.value, l = o >>> 5;
    for (t = 0; t < l; t += i) n + this.m <= o && (this.U = this.v(a.slice(t, t + i), this.U), n += this.m);
    return this.A += n, this.h = a.slice(n >>> 5), this.u = o % this.m, this.l = !0, this;
  }
  getHash(e, t) {
    let n, i, s = this.R;
    const o = Rs(t);
    if (this.K) {
      if (o.outputLen === -1) throw new Error("Output length must be specified in options");
      s = o.outputLen;
    }
    const a = Cs(e, s, this.T, o);
    if (this.H && this.g) return a(this.g(o));
    for (i = this.F(this.h.slice(), this.u, this.A, this.L(this.U), s), n = 1; n < this.numRounds; n += 1) this.K && s % 32 != 0 && (i[i.length - 1] &= 16777215 >>> 24 - s % 32), i = this.F(i, s, 0, this.B(this.o), s);
    return a(i);
  }
  setHMACKey(e, t, n) {
    if (!this.M) throw new Error("Variant does not support HMAC");
    if (this.l) throw new Error("Cannot set MAC key after calling update");
    const i = ur(t, (n || {}).encoding || "UTF8", this.T);
    this.k(i(e));
  }
  k(e) {
    const t = this.m >>> 3, n = t / 4 - 1;
    let i;
    if (this.numRounds !== 1) throw new Error(ba);
    if (this.H) throw new Error("MAC key already set");
    for (t < e.binLen / 8 && (e.value = this.F(e.value, e.binLen, 0, this.B(this.o), this.R)); e.value.length <= n; ) e.value.push(0);
    for (i = 0; i <= n; i += 1) this.S[i] = 909522486 ^ e.value[i], this.p[i] = 1549556828 ^ e.value[i];
    this.U = this.v(this.S, this.U), this.A = this.m, this.H = !0;
  }
  getHMAC(e, t) {
    const n = Rs(t);
    return Cs(e, this.R, this.T, n)(this.Y());
  }
  Y() {
    let e;
    if (!this.H) throw new Error("Cannot call getHMAC without first setting MAC key");
    const t = this.F(this.h.slice(), this.u, this.A, this.L(this.U), this.R);
    return e = this.v(this.p, this.B(this.o)), e = this.F(t, this.R, this.m, e, this.R), e;
  }
};
function Kt(r, e) {
  return r << e | r >>> 32 - e;
}
function et(r, e) {
  return r >>> e | r << 32 - e;
}
function wa(r, e) {
  return r >>> e;
}
function Ns(r, e, t) {
  return r ^ e ^ t;
}
function _a(r, e, t) {
  return r & e ^ ~r & t;
}
function Ea(r, e, t) {
  return r & e ^ r & t ^ e & t;
}
function ec(r) {
  return et(r, 2) ^ et(r, 13) ^ et(r, 22);
}
function Oe(r, e) {
  const t = (65535 & r) + (65535 & e);
  return (65535 & (r >>> 16) + (e >>> 16) + (t >>> 16)) << 16 | 65535 & t;
}
function tc(r, e, t, n) {
  const i = (65535 & r) + (65535 & e) + (65535 & t) + (65535 & n);
  return (65535 & (r >>> 16) + (e >>> 16) + (t >>> 16) + (n >>> 16) + (i >>> 16)) << 16 | 65535 & i;
}
function xr(r, e, t, n, i) {
  const s = (65535 & r) + (65535 & e) + (65535 & t) + (65535 & n) + (65535 & i);
  return (65535 & (r >>> 16) + (e >>> 16) + (t >>> 16) + (n >>> 16) + (i >>> 16) + (s >>> 16)) << 16 | 65535 & s;
}
function rc(r) {
  return et(r, 7) ^ et(r, 18) ^ wa(r, 3);
}
function nc(r) {
  return et(r, 6) ^ et(r, 11) ^ et(r, 25);
}
function ic(r) {
  return [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
}
function Sa(r, e) {
  let t, n, i, s, o, a, l;
  const h = [];
  for (t = e[0], n = e[1], i = e[2], s = e[3], o = e[4], l = 0; l < 80; l += 1) h[l] = l < 16 ? r[l] : Kt(h[l - 3] ^ h[l - 8] ^ h[l - 14] ^ h[l - 16], 1), a = l < 20 ? xr(Kt(t, 5), _a(n, i, s), o, 1518500249, h[l]) : l < 40 ? xr(Kt(t, 5), Ns(n, i, s), o, 1859775393, h[l]) : l < 60 ? xr(Kt(t, 5), Ea(n, i, s), o, 2400959708, h[l]) : xr(Kt(t, 5), Ns(n, i, s), o, 3395469782, h[l]), o = s, s = i, i = Kt(n, 30), n = t, t = a;
  return e[0] = Oe(t, e[0]), e[1] = Oe(n, e[1]), e[2] = Oe(i, e[2]), e[3] = Oe(s, e[3]), e[4] = Oe(o, e[4]), e;
}
function sc(r, e, t, n) {
  let i;
  const s = 15 + (e + 65 >>> 9 << 4), o = e + t;
  for (; r.length <= s; ) r.push(0);
  for (r[e >>> 5] |= 128 << 24 - e % 32, r[s] = 4294967295 & o, r[s - 1] = o / Qr | 0, i = 0; i < r.length; i += 16) n = Sa(r.slice(i, i + 16), n);
  return n;
}
let oc = class extends An {
  constructor(e, t, n) {
    if (e !== "SHA-1") throw new Error(Hr);
    super(e, t, n);
    const i = n || {};
    this.M = !0, this.g = this.Y, this.T = -1, this.C = ur(this.t, this.i, this.T), this.v = Sa, this.L = function(s) {
      return s.slice();
    }, this.B = ic, this.F = sc, this.U = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.m = 512, this.R = 160, this.K = !1, i.hmacKey && this.k(_t("hmacKey", i.hmacKey, this.T));
  }
};
function Ds(r) {
  let e;
  return e = r == "SHA-224" ? st.slice() : ot.slice(), e;
}
function Fs(r, e) {
  let t, n, i, s, o, a, l, h, c, d, p;
  const m = [];
  for (t = e[0], n = e[1], i = e[2], s = e[3], o = e[4], a = e[5], l = e[6], h = e[7], p = 0; p < 64; p += 1) m[p] = p < 16 ? r[p] : tc(et(v = m[p - 2], 17) ^ et(v, 19) ^ wa(v, 10), m[p - 7], rc(m[p - 15]), m[p - 16]), c = xr(h, nc(o), _a(o, a, l), M[p], m[p]), d = Oe(ec(t), Ea(t, n, i)), h = l, l = a, a = o, o = Oe(s, c), s = i, i = n, n = t, t = Oe(c, d);
  var v;
  return e[0] = Oe(t, e[0]), e[1] = Oe(n, e[1]), e[2] = Oe(i, e[2]), e[3] = Oe(s, e[3]), e[4] = Oe(o, e[4]), e[5] = Oe(a, e[5]), e[6] = Oe(l, e[6]), e[7] = Oe(h, e[7]), e;
}
let ac = class extends An {
  constructor(e, t, n) {
    if (e !== "SHA-224" && e !== "SHA-256") throw new Error(Hr);
    super(e, t, n);
    const i = n || {};
    this.g = this.Y, this.M = !0, this.T = -1, this.C = ur(this.t, this.i, this.T), this.v = Fs, this.L = function(s) {
      return s.slice();
    }, this.B = Ds, this.F = function(s, o, a, l) {
      return function(h, c, d, p, m) {
        let v, w;
        const _ = 15 + (c + 65 >>> 9 << 4), E = c + d;
        for (; h.length <= _; ) h.push(0);
        for (h[c >>> 5] |= 128 << 24 - c % 32, h[_] = 4294967295 & E, h[_ - 1] = E / Qr | 0, v = 0; v < h.length; v += 16) p = Fs(h.slice(v, v + 16), p);
        return w = m === "SHA-224" ? [p[0], p[1], p[2], p[3], p[4], p[5], p[6]] : p, w;
      }(s, o, a, l, e);
    }, this.U = Ds(e), this.m = 512, this.R = e === "SHA-224" ? 224 : 256, this.K = !1, i.hmacKey && this.k(_t("hmacKey", i.hmacKey, this.T));
  }
};
class S {
  constructor(e, t) {
    this.N = e, this.I = t;
  }
}
function Ms(r, e) {
  let t;
  return e > 32 ? (t = 64 - e, new S(r.I << e | r.N >>> t, r.N << e | r.I >>> t)) : e !== 0 ? (t = 32 - e, new S(r.N << e | r.I >>> t, r.I << e | r.N >>> t)) : r;
}
function tt(r, e) {
  let t;
  return e < 32 ? (t = 32 - e, new S(r.N >>> e | r.I << t, r.I >>> e | r.N << t)) : (t = 64 - e, new S(r.I >>> e | r.N << t, r.N >>> e | r.I << t));
}
function ka(r, e) {
  return new S(r.N >>> e, r.I >>> e | r.N << 32 - e);
}
function uc(r, e, t) {
  return new S(r.N & e.N ^ r.N & t.N ^ e.N & t.N, r.I & e.I ^ r.I & t.I ^ e.I & t.I);
}
function cc(r) {
  const e = tt(r, 28), t = tt(r, 34), n = tt(r, 39);
  return new S(e.N ^ t.N ^ n.N, e.I ^ t.I ^ n.I);
}
function Qe(r, e) {
  let t, n;
  t = (65535 & r.I) + (65535 & e.I), n = (r.I >>> 16) + (e.I >>> 16) + (t >>> 16);
  const i = (65535 & n) << 16 | 65535 & t;
  return t = (65535 & r.N) + (65535 & e.N) + (n >>> 16), n = (r.N >>> 16) + (e.N >>> 16) + (t >>> 16), new S((65535 & n) << 16 | 65535 & t, i);
}
function lc(r, e, t, n) {
  let i, s;
  i = (65535 & r.I) + (65535 & e.I) + (65535 & t.I) + (65535 & n.I), s = (r.I >>> 16) + (e.I >>> 16) + (t.I >>> 16) + (n.I >>> 16) + (i >>> 16);
  const o = (65535 & s) << 16 | 65535 & i;
  return i = (65535 & r.N) + (65535 & e.N) + (65535 & t.N) + (65535 & n.N) + (s >>> 16), s = (r.N >>> 16) + (e.N >>> 16) + (t.N >>> 16) + (n.N >>> 16) + (i >>> 16), new S((65535 & s) << 16 | 65535 & i, o);
}
function hc(r, e, t, n, i) {
  let s, o;
  s = (65535 & r.I) + (65535 & e.I) + (65535 & t.I) + (65535 & n.I) + (65535 & i.I), o = (r.I >>> 16) + (e.I >>> 16) + (t.I >>> 16) + (n.I >>> 16) + (i.I >>> 16) + (s >>> 16);
  const a = (65535 & o) << 16 | 65535 & s;
  return s = (65535 & r.N) + (65535 & e.N) + (65535 & t.N) + (65535 & n.N) + (65535 & i.N) + (o >>> 16), o = (r.N >>> 16) + (e.N >>> 16) + (t.N >>> 16) + (n.N >>> 16) + (i.N >>> 16) + (s >>> 16), new S((65535 & o) << 16 | 65535 & s, a);
}
function fr(r, e) {
  return new S(r.N ^ e.N, r.I ^ e.I);
}
function fc(r) {
  const e = tt(r, 19), t = tt(r, 61), n = ka(r, 6);
  return new S(e.N ^ t.N ^ n.N, e.I ^ t.I ^ n.I);
}
function pc(r) {
  const e = tt(r, 1), t = tt(r, 8), n = ka(r, 7);
  return new S(e.N ^ t.N ^ n.N, e.I ^ t.I ^ n.I);
}
function dc(r) {
  const e = tt(r, 14), t = tt(r, 18), n = tt(r, 41);
  return new S(e.N ^ t.N ^ n.N, e.I ^ t.I ^ n.I);
}
const yc = [new S(M[0], 3609767458), new S(M[1], 602891725), new S(M[2], 3964484399), new S(M[3], 2173295548), new S(M[4], 4081628472), new S(M[5], 3053834265), new S(M[6], 2937671579), new S(M[7], 3664609560), new S(M[8], 2734883394), new S(M[9], 1164996542), new S(M[10], 1323610764), new S(M[11], 3590304994), new S(M[12], 4068182383), new S(M[13], 991336113), new S(M[14], 633803317), new S(M[15], 3479774868), new S(M[16], 2666613458), new S(M[17], 944711139), new S(M[18], 2341262773), new S(M[19], 2007800933), new S(M[20], 1495990901), new S(M[21], 1856431235), new S(M[22], 3175218132), new S(M[23], 2198950837), new S(M[24], 3999719339), new S(M[25], 766784016), new S(M[26], 2566594879), new S(M[27], 3203337956), new S(M[28], 1034457026), new S(M[29], 2466948901), new S(M[30], 3758326383), new S(M[31], 168717936), new S(M[32], 1188179964), new S(M[33], 1546045734), new S(M[34], 1522805485), new S(M[35], 2643833823), new S(M[36], 2343527390), new S(M[37], 1014477480), new S(M[38], 1206759142), new S(M[39], 344077627), new S(M[40], 1290863460), new S(M[41], 3158454273), new S(M[42], 3505952657), new S(M[43], 106217008), new S(M[44], 3606008344), new S(M[45], 1432725776), new S(M[46], 1467031594), new S(M[47], 851169720), new S(M[48], 3100823752), new S(M[49], 1363258195), new S(M[50], 3750685593), new S(M[51], 3785050280), new S(M[52], 3318307427), new S(M[53], 3812723403), new S(M[54], 2003034995), new S(M[55], 3602036899), new S(M[56], 1575990012), new S(M[57], 1125592928), new S(M[58], 2716904306), new S(M[59], 442776044), new S(M[60], 593698344), new S(M[61], 3733110249), new S(M[62], 2999351573), new S(M[63], 3815920427), new S(3391569614, 3928383900), new S(3515267271, 566280711), new S(3940187606, 3454069534), new S(4118630271, 4000239992), new S(116418474, 1914138554), new S(174292421, 2731055270), new S(289380356, 3203993006), new S(460393269, 320620315), new S(685471733, 587496836), new S(852142971, 1086792851), new S(1017036298, 365543100), new S(1126000580, 2618297676), new S(1288033470, 3409855158), new S(1501505948, 4234509866), new S(1607167915, 987167468), new S(1816402316, 1246189591)];
function $s(r) {
  return r === "SHA-384" ? [new S(3418070365, st[0]), new S(1654270250, st[1]), new S(2438529370, st[2]), new S(355462360, st[3]), new S(1731405415, st[4]), new S(41048885895, st[5]), new S(3675008525, st[6]), new S(1203062813, st[7])] : [new S(ot[0], 4089235720), new S(ot[1], 2227873595), new S(ot[2], 4271175723), new S(ot[3], 1595750129), new S(ot[4], 2917565137), new S(ot[5], 725511199), new S(ot[6], 4215389547), new S(ot[7], 327033209)];
}
function Bs(r, e) {
  let t, n, i, s, o, a, l, h, c, d, p, m;
  const v = [];
  for (t = e[0], n = e[1], i = e[2], s = e[3], o = e[4], a = e[5], l = e[6], h = e[7], p = 0; p < 80; p += 1) p < 16 ? (m = 2 * p, v[p] = new S(r[m], r[m + 1])) : v[p] = lc(fc(v[p - 2]), v[p - 7], pc(v[p - 15]), v[p - 16]), c = hc(h, dc(o), (_ = a, E = l, new S((w = o).N & _.N ^ ~w.N & E.N, w.I & _.I ^ ~w.I & E.I)), yc[p], v[p]), d = Qe(cc(t), uc(t, n, i)), h = l, l = a, a = o, o = Qe(s, c), s = i, i = n, n = t, t = Qe(c, d);
  var w, _, E;
  return e[0] = Qe(t, e[0]), e[1] = Qe(n, e[1]), e[2] = Qe(i, e[2]), e[3] = Qe(s, e[3]), e[4] = Qe(o, e[4]), e[5] = Qe(a, e[5]), e[6] = Qe(l, e[6]), e[7] = Qe(h, e[7]), e;
}
let mc = class extends An {
  constructor(e, t, n) {
    if (e !== "SHA-384" && e !== "SHA-512") throw new Error(Hr);
    super(e, t, n);
    const i = n || {};
    this.g = this.Y, this.M = !0, this.T = -1, this.C = ur(this.t, this.i, this.T), this.v = Bs, this.L = function(s) {
      return s.slice();
    }, this.B = $s, this.F = function(s, o, a, l) {
      return function(h, c, d, p, m) {
        let v, w;
        const _ = 31 + (c + 129 >>> 10 << 5), E = c + d;
        for (; h.length <= _; ) h.push(0);
        for (h[c >>> 5] |= 128 << 24 - c % 32, h[_] = 4294967295 & E, h[_ - 1] = E / Qr | 0, v = 0; v < h.length; v += 32) p = Bs(h.slice(v, v + 32), p);
        return w = m === "SHA-384" ? [p[0].N, p[0].I, p[1].N, p[1].I, p[2].N, p[2].I, p[3].N, p[3].I, p[4].N, p[4].I, p[5].N, p[5].I] : [p[0].N, p[0].I, p[1].N, p[1].I, p[2].N, p[2].I, p[3].N, p[3].I, p[4].N, p[4].I, p[5].N, p[5].I, p[6].N, p[6].I, p[7].N, p[7].I], w;
      }(s, o, a, l, e);
    }, this.U = $s(e), this.m = 1024, this.R = e === "SHA-384" ? 384 : 512, this.K = !1, i.hmacKey && this.k(_t("hmacKey", i.hmacKey, this.T));
  }
};
const gc = [new S(0, 1), new S(0, 32898), new S(2147483648, 32906), new S(2147483648, 2147516416), new S(0, 32907), new S(0, 2147483649), new S(2147483648, 2147516545), new S(2147483648, 32777), new S(0, 138), new S(0, 136), new S(0, 2147516425), new S(0, 2147483658), new S(0, 2147516555), new S(2147483648, 139), new S(2147483648, 32905), new S(2147483648, 32771), new S(2147483648, 32770), new S(2147483648, 128), new S(0, 32778), new S(2147483648, 2147483658), new S(2147483648, 2147516545), new S(2147483648, 32896), new S(0, 2147483649), new S(2147483648, 2147516424)], vc = [[0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61], [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]];
function vi(r) {
  let e;
  const t = [];
  for (e = 0; e < 5; e += 1) t[e] = [new S(0, 0), new S(0, 0), new S(0, 0), new S(0, 0), new S(0, 0)];
  return t;
}
function bc(r) {
  let e;
  const t = [];
  for (e = 0; e < 5; e += 1) t[e] = r[e].slice();
  return t;
}
function Xr(r, e) {
  let t, n, i, s;
  const o = [], a = [];
  if (r !== null) for (n = 0; n < r.length; n += 2) e[(n >>> 1) % 5][(n >>> 1) / 5 | 0] = fr(e[(n >>> 1) % 5][(n >>> 1) / 5 | 0], new S(r[n + 1], r[n]));
  for (t = 0; t < 24; t += 1) {
    for (s = vi(), n = 0; n < 5; n += 1) o[n] = (l = e[n][0], h = e[n][1], c = e[n][2], d = e[n][3], p = e[n][4], new S(l.N ^ h.N ^ c.N ^ d.N ^ p.N, l.I ^ h.I ^ c.I ^ d.I ^ p.I));
    for (n = 0; n < 5; n += 1) a[n] = fr(o[(n + 4) % 5], Ms(o[(n + 1) % 5], 1));
    for (n = 0; n < 5; n += 1) for (i = 0; i < 5; i += 1) e[n][i] = fr(e[n][i], a[n]);
    for (n = 0; n < 5; n += 1) for (i = 0; i < 5; i += 1) s[i][(2 * n + 3 * i) % 5] = Ms(e[n][i], vc[n][i]);
    for (n = 0; n < 5; n += 1) for (i = 0; i < 5; i += 1) e[n][i] = fr(s[n][i], new S(~s[(n + 1) % 5][i].N & s[(n + 2) % 5][i].N, ~s[(n + 1) % 5][i].I & s[(n + 2) % 5][i].I));
    e[0][0] = fr(e[0][0], gc[t]);
  }
  var l, h, c, d, p;
  return e;
}
function xa(r) {
  let e, t, n = 0;
  const i = [0, 0], s = [4294967295 & r, r / Qr & 2097151];
  for (e = 6; e >= 0; e--) t = s[e >> 2] >>> 8 * e & 255, t === 0 && n === 0 || (i[n + 1 >> 2] |= t << 8 * (n + 1), n += 1);
  return n = n !== 0 ? n : 1, i[0] |= n, { value: n + 1 > 4 ? i : [i[0]], binLen: 8 + 8 * n };
}
function Hn(r) {
  return gn(xa(r.binLen), r);
}
function Ps(r, e) {
  let t, n = xa(e);
  n = gn(n, r);
  const i = e >>> 2, s = (i - n.value.length % i) % i;
  for (t = 0; t < s; t++) n.value.push(0);
  return n.value;
}
let wc = class extends An {
  constructor(r, e, t) {
    let n = 6, i = 0;
    super(r, e, t);
    const s = t || {};
    if (this.numRounds !== 1) {
      if (s.kmacKey || s.hmacKey) throw new Error(ba);
      if (this.o === "CSHAKE128" || this.o === "CSHAKE256") throw new Error("Cannot set numRounds for CSHAKE variants");
    }
    switch (this.T = 1, this.C = ur(this.t, this.i, this.T), this.v = Xr, this.L = bc, this.B = vi, this.U = vi(), this.K = !1, r) {
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
        n = 31, this.m = i = 1344, this.R = -1, this.K = !0, this.M = !1, this.g = null;
        break;
      case "SHAKE256":
        n = 31, this.m = i = 1088, this.R = -1, this.K = !0, this.M = !1, this.g = null;
        break;
      case "KMAC128":
        n = 4, this.m = i = 1344, this.X(t), this.R = -1, this.K = !0, this.M = !1, this.g = this._;
        break;
      case "KMAC256":
        n = 4, this.m = i = 1088, this.X(t), this.R = -1, this.K = !0, this.M = !1, this.g = this._;
        break;
      case "CSHAKE128":
        this.m = i = 1344, n = this.O(t), this.R = -1, this.K = !0, this.M = !1, this.g = null;
        break;
      case "CSHAKE256":
        this.m = i = 1088, n = this.O(t), this.R = -1, this.K = !0, this.M = !1, this.g = null;
        break;
      default:
        throw new Error(Hr);
    }
    this.F = function(o, a, l, h, c) {
      return function(d, p, m, v, w, _, E) {
        let T, I, A = 0;
        const R = [], N = w >>> 5, F = p >>> 5;
        for (T = 0; T < F && p >= w; T += N) v = Xr(d.slice(T, T + N), v), p -= w;
        for (d = d.slice(T), p %= w; d.length < N; ) d.push(0);
        for (T = p >>> 3, d[T >> 2] ^= _ << T % 4 * 8, d[N - 1] ^= 2147483648, v = Xr(d, v); 32 * R.length < E && (I = v[A % 5][A / 5 | 0], R.push(I.I), !(32 * R.length >= E)); ) R.push(I.N), A += 1, 64 * A % w == 0 && (Xr(null, v), A = 0);
        return R;
      }(o, a, 0, h, i, n, c);
    }, s.hmacKey && this.k(_t("hmacKey", s.hmacKey, this.T));
  }
  O(r, e) {
    const t = function(i) {
      const s = i || {};
      return { funcName: _t("funcName", s.funcName, 1, { value: [], binLen: 0 }), customization: _t("Customization", s.customization, 1, { value: [], binLen: 0 }) };
    }(r || {});
    e && (t.funcName = e);
    const n = gn(Hn(t.funcName), Hn(t.customization));
    if (t.customization.binLen !== 0 || t.funcName.binLen !== 0) {
      const i = Ps(n, this.m >>> 3);
      for (let s = 0; s < i.length; s += this.m >>> 5) this.U = this.v(i.slice(s, s + (this.m >>> 5)), this.U), this.A += this.m;
      return 4;
    }
    return 31;
  }
  X(r) {
    const e = function(n) {
      const i = n || {};
      return { kmacKey: _t("kmacKey", i.kmacKey, 1), funcName: { value: [1128353099], binLen: 32 }, customization: _t("Customization", i.customization, 1, { value: [], binLen: 0 }) };
    }(r || {});
    this.O(r, e.funcName);
    const t = Ps(Hn(e.kmacKey), this.m >>> 3);
    for (let n = 0; n < t.length; n += this.m >>> 5) this.U = this.v(t.slice(n, n + (this.m >>> 5)), this.U), this.A += this.m;
    this.H = !0;
  }
  _(r) {
    const e = gn({ value: this.h.slice(), binLen: this.u }, function(t) {
      let n, i, s = 0;
      const o = [0, 0], a = [4294967295 & t, t / Qr & 2097151];
      for (n = 6; n >= 0; n--) i = a[n >> 2] >>> 8 * n & 255, i === 0 && s === 0 || (o[s >> 2] |= i << 8 * s, s += 1);
      return s = s !== 0 ? s : 1, o[s >> 2] |= s << 8 * s, { value: s + 1 > 4 ? o : [o[0]], binLen: 8 + 8 * s };
    }(r.outputLen));
    return this.F(e.value, e.binLen, this.A, this.L(this.U), r.outputLen);
  }
};
class Le {
  constructor(e, t, n) {
    if (e == "SHA-1") this.P = new oc(e, t, n);
    else if (e == "SHA-224" || e == "SHA-256") this.P = new ac(e, t, n);
    else if (e == "SHA-384" || e == "SHA-512") this.P = new mc(e, t, n);
    else {
      if (e != "SHA3-224" && e != "SHA3-256" && e != "SHA3-384" && e != "SHA3-512" && e != "SHAKE128" && e != "SHAKE256" && e != "CSHAKE128" && e != "CSHAKE256" && e != "KMAC128" && e != "KMAC256") throw new Error(Hr);
      this.P = new wc(e, t, n);
    }
  }
  update(e) {
    return this.P.update(e), this;
  }
  getHash(e, t) {
    return this.P.getHash(e, t);
  }
  setHMACKey(e, t, n) {
    this.P.setHMACKey(e, t, n);
  }
  getHMAC(e, t) {
    return this.P.getHMAC(e, t);
  }
}
var Ta = {}, In = {};
In.byteLength = Sc;
In.toByteArray = xc;
In.fromByteArray = Ic;
var Ze = [], Pe = [], _c = typeof Uint8Array < "u" ? Uint8Array : Array, Wn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var zt = 0, Ec = Wn.length; zt < Ec; ++zt)
  Ze[zt] = Wn[zt], Pe[Wn.charCodeAt(zt)] = zt;
Pe[45] = 62;
Pe[95] = 63;
function Aa(r) {
  var e = r.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var t = r.indexOf("=");
  t === -1 && (t = e);
  var n = t === e ? 0 : 4 - t % 4;
  return [t, n];
}
function Sc(r) {
  var e = Aa(r), t = e[0], n = e[1];
  return (t + n) * 3 / 4 - n;
}
function kc(r, e, t) {
  return (e + t) * 3 / 4 - t;
}
function xc(r) {
  var e, t = Aa(r), n = t[0], i = t[1], s = new _c(kc(r, n, i)), o = 0, a = i > 0 ? n - 4 : n, l;
  for (l = 0; l < a; l += 4)
    e = Pe[r.charCodeAt(l)] << 18 | Pe[r.charCodeAt(l + 1)] << 12 | Pe[r.charCodeAt(l + 2)] << 6 | Pe[r.charCodeAt(l + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
  return i === 2 && (e = Pe[r.charCodeAt(l)] << 2 | Pe[r.charCodeAt(l + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = Pe[r.charCodeAt(l)] << 10 | Pe[r.charCodeAt(l + 1)] << 4 | Pe[r.charCodeAt(l + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
}
function Tc(r) {
  return Ze[r >> 18 & 63] + Ze[r >> 12 & 63] + Ze[r >> 6 & 63] + Ze[r & 63];
}
function Ac(r, e, t) {
  for (var n, i = [], s = e; s < t; s += 3)
    n = (r[s] << 16 & 16711680) + (r[s + 1] << 8 & 65280) + (r[s + 2] & 255), i.push(Tc(n));
  return i.join("");
}
function Ic(r) {
  for (var e, t = r.length, n = t % 3, i = [], s = 16383, o = 0, a = t - n; o < a; o += s)
    i.push(Ac(r, o, o + s > a ? a : o + s));
  return n === 1 ? (e = r[t - 1], i.push(
    Ze[e >> 2] + Ze[e << 4 & 63] + "=="
  )) : n === 2 && (e = (r[t - 2] << 8) + r[t - 1], i.push(
    Ze[e >> 10] + Ze[e >> 4 & 63] + Ze[e << 2 & 63] + "="
  )), i.join("");
}
var Ji = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
Ji.read = function(r, e, t, n, i) {
  var s, o, a = i * 8 - n - 1, l = (1 << a) - 1, h = l >> 1, c = -7, d = t ? i - 1 : 0, p = t ? -1 : 1, m = r[e + d];
  for (d += p, s = m & (1 << -c) - 1, m >>= -c, c += a; c > 0; s = s * 256 + r[e + d], d += p, c -= 8)
    ;
  for (o = s & (1 << -c) - 1, s >>= -c, c += n; c > 0; o = o * 256 + r[e + d], d += p, c -= 8)
    ;
  if (s === 0)
    s = 1 - h;
  else {
    if (s === l)
      return o ? NaN : (m ? -1 : 1) * (1 / 0);
    o = o + Math.pow(2, n), s = s - h;
  }
  return (m ? -1 : 1) * o * Math.pow(2, s - n);
};
Ji.write = function(r, e, t, n, i, s) {
  var o, a, l, h = s * 8 - i - 1, c = (1 << h) - 1, d = c >> 1, p = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, m = n ? 0 : s - 1, v = n ? 1 : -1, w = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
  for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (a = isNaN(e) ? 1 : 0, o = c) : (o = Math.floor(Math.log(e) / Math.LN2), e * (l = Math.pow(2, -o)) < 1 && (o--, l *= 2), o + d >= 1 ? e += p / l : e += p * Math.pow(2, 1 - d), e * l >= 2 && (o++, l /= 2), o + d >= c ? (a = 0, o = c) : o + d >= 1 ? (a = (e * l - 1) * Math.pow(2, i), o = o + d) : (a = e * Math.pow(2, d - 1) * Math.pow(2, i), o = 0)); i >= 8; r[t + m] = a & 255, m += v, a /= 256, i -= 8)
    ;
  for (o = o << i | a, h += i; h > 0; r[t + m] = o & 255, m += v, o /= 256, h -= 8)
    ;
  r[t + m - v] |= w * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(r) {
  const e = In, t = Ji, n = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  r.Buffer = c, r.SlowBuffer = R, r.INSPECT_MAX_BYTES = 50;
  const i = 2147483647;
  r.kMaxLength = i;
  const { Uint8Array: s, ArrayBuffer: o, SharedArrayBuffer: a } = globalThis;
  c.TYPED_ARRAY_SUPPORT = l(), !c.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function l() {
    try {
      const y = new s(1), u = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(u, s.prototype), Object.setPrototypeOf(y, u), y.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(c.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (c.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(c.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (c.isBuffer(this))
        return this.byteOffset;
    }
  });
  function h(y) {
    if (y > i)
      throw new RangeError('The value "' + y + '" is invalid for option "size"');
    const u = new s(y);
    return Object.setPrototypeOf(u, c.prototype), u;
  }
  function c(y, u, f) {
    if (typeof y == "number") {
      if (typeof u == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return v(y);
    }
    return d(y, u, f);
  }
  c.poolSize = 8192;
  function d(y, u, f) {
    if (typeof y == "string")
      return w(y, u);
    if (o.isView(y))
      return E(y);
    if (y == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof y
      );
    if (Je(y, o) || y && Je(y.buffer, o) || typeof a < "u" && (Je(y, a) || y && Je(y.buffer, a)))
      return T(y, u, f);
    if (typeof y == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const g = y.valueOf && y.valueOf();
    if (g != null && g !== y)
      return c.from(g, u, f);
    const b = I(y);
    if (b) return b;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof y[Symbol.toPrimitive] == "function")
      return c.from(y[Symbol.toPrimitive]("string"), u, f);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof y
    );
  }
  c.from = function(y, u, f) {
    return d(y, u, f);
  }, Object.setPrototypeOf(c.prototype, s.prototype), Object.setPrototypeOf(c, s);
  function p(y) {
    if (typeof y != "number")
      throw new TypeError('"size" argument must be of type number');
    if (y < 0)
      throw new RangeError('The value "' + y + '" is invalid for option "size"');
  }
  function m(y, u, f) {
    return p(y), y <= 0 ? h(y) : u !== void 0 ? typeof f == "string" ? h(y).fill(u, f) : h(y).fill(u) : h(y);
  }
  c.alloc = function(y, u, f) {
    return m(y, u, f);
  };
  function v(y) {
    return p(y), h(y < 0 ? 0 : A(y) | 0);
  }
  c.allocUnsafe = function(y) {
    return v(y);
  }, c.allocUnsafeSlow = function(y) {
    return v(y);
  };
  function w(y, u) {
    if ((typeof u != "string" || u === "") && (u = "utf8"), !c.isEncoding(u))
      throw new TypeError("Unknown encoding: " + u);
    const f = N(y, u) | 0;
    let g = h(f);
    const b = g.write(y, u);
    return b !== f && (g = g.slice(0, b)), g;
  }
  function _(y) {
    const u = y.length < 0 ? 0 : A(y.length) | 0, f = h(u);
    for (let g = 0; g < u; g += 1)
      f[g] = y[g] & 255;
    return f;
  }
  function E(y) {
    if (Je(y, s)) {
      const u = new s(y);
      return T(u.buffer, u.byteOffset, u.byteLength);
    }
    return _(y);
  }
  function T(y, u, f) {
    if (u < 0 || y.byteLength < u)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (y.byteLength < u + (f || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let g;
    return u === void 0 && f === void 0 ? g = new s(y) : f === void 0 ? g = new s(y, u) : g = new s(y, u, f), Object.setPrototypeOf(g, c.prototype), g;
  }
  function I(y) {
    if (c.isBuffer(y)) {
      const u = A(y.length) | 0, f = h(u);
      return f.length === 0 || y.copy(f, 0, 0, u), f;
    }
    if (y.length !== void 0)
      return typeof y.length != "number" || Qn(y.length) ? h(0) : _(y);
    if (y.type === "Buffer" && Array.isArray(y.data))
      return _(y.data);
  }
  function A(y) {
    if (y >= i)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i.toString(16) + " bytes");
    return y | 0;
  }
  function R(y) {
    return +y != y && (y = 0), c.alloc(+y);
  }
  c.isBuffer = function(u) {
    return u != null && u._isBuffer === !0 && u !== c.prototype;
  }, c.compare = function(u, f) {
    if (Je(u, s) && (u = c.from(u, u.offset, u.byteLength)), Je(f, s) && (f = c.from(f, f.offset, f.byteLength)), !c.isBuffer(u) || !c.isBuffer(f))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (u === f) return 0;
    let g = u.length, b = f.length;
    for (let k = 0, O = Math.min(g, b); k < O; ++k)
      if (u[k] !== f[k]) {
        g = u[k], b = f[k];
        break;
      }
    return g < b ? -1 : b < g ? 1 : 0;
  }, c.isEncoding = function(u) {
    switch (String(u).toLowerCase()) {
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
  }, c.concat = function(u, f) {
    if (!Array.isArray(u))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (u.length === 0)
      return c.alloc(0);
    let g;
    if (f === void 0)
      for (f = 0, g = 0; g < u.length; ++g)
        f += u[g].length;
    const b = c.allocUnsafe(f);
    let k = 0;
    for (g = 0; g < u.length; ++g) {
      let O = u[g];
      if (Je(O, s))
        k + O.length > b.length ? (c.isBuffer(O) || (O = c.from(O)), O.copy(b, k)) : s.prototype.set.call(
          b,
          O,
          k
        );
      else if (c.isBuffer(O))
        O.copy(b, k);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      k += O.length;
    }
    return b;
  };
  function N(y, u) {
    if (c.isBuffer(y))
      return y.length;
    if (o.isView(y) || Je(y, o))
      return y.byteLength;
    if (typeof y != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof y
      );
    const f = y.length, g = arguments.length > 2 && arguments[2] === !0;
    if (!g && f === 0) return 0;
    let b = !1;
    for (; ; )
      switch (u) {
        case "ascii":
        case "latin1":
        case "binary":
          return f;
        case "utf8":
        case "utf-8":
          return Vn(y).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return f * 2;
        case "hex":
          return f >>> 1;
        case "base64":
          return Is(y).length;
        default:
          if (b)
            return g ? -1 : Vn(y).length;
          u = ("" + u).toLowerCase(), b = !0;
      }
  }
  c.byteLength = N;
  function F(y, u, f) {
    let g = !1;
    if ((u === void 0 || u < 0) && (u = 0), u > this.length || ((f === void 0 || f > this.length) && (f = this.length), f <= 0) || (f >>>= 0, u >>>= 0, f <= u))
      return "";
    for (y || (y = "utf8"); ; )
      switch (y) {
        case "hex":
          return Ge(this, u, f);
        case "utf8":
        case "utf-8":
          return P(this, u, f);
        case "ascii":
          return Ie(this, u, f);
        case "latin1":
        case "binary":
          return G(this, u, f);
        case "base64":
          return X(this, u, f);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return xt(this, u, f);
        default:
          if (g) throw new TypeError("Unknown encoding: " + y);
          y = (y + "").toLowerCase(), g = !0;
      }
  }
  c.prototype._isBuffer = !0;
  function B(y, u, f) {
    const g = y[u];
    y[u] = y[f], y[f] = g;
  }
  c.prototype.swap16 = function() {
    const u = this.length;
    if (u % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let f = 0; f < u; f += 2)
      B(this, f, f + 1);
    return this;
  }, c.prototype.swap32 = function() {
    const u = this.length;
    if (u % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let f = 0; f < u; f += 4)
      B(this, f, f + 3), B(this, f + 1, f + 2);
    return this;
  }, c.prototype.swap64 = function() {
    const u = this.length;
    if (u % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let f = 0; f < u; f += 8)
      B(this, f, f + 7), B(this, f + 1, f + 6), B(this, f + 2, f + 5), B(this, f + 3, f + 4);
    return this;
  }, c.prototype.toString = function() {
    const u = this.length;
    return u === 0 ? "" : arguments.length === 0 ? P(this, 0, u) : F.apply(this, arguments);
  }, c.prototype.toLocaleString = c.prototype.toString, c.prototype.equals = function(u) {
    if (!c.isBuffer(u)) throw new TypeError("Argument must be a Buffer");
    return this === u ? !0 : c.compare(this, u) === 0;
  }, c.prototype.inspect = function() {
    let u = "";
    const f = r.INSPECT_MAX_BYTES;
    return u = this.toString("hex", 0, f).replace(/(.{2})/g, "$1 ").trim(), this.length > f && (u += " ... "), "<Buffer " + u + ">";
  }, n && (c.prototype[n] = c.prototype.inspect), c.prototype.compare = function(u, f, g, b, k) {
    if (Je(u, s) && (u = c.from(u, u.offset, u.byteLength)), !c.isBuffer(u))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof u
      );
    if (f === void 0 && (f = 0), g === void 0 && (g = u ? u.length : 0), b === void 0 && (b = 0), k === void 0 && (k = this.length), f < 0 || g > u.length || b < 0 || k > this.length)
      throw new RangeError("out of range index");
    if (b >= k && f >= g)
      return 0;
    if (b >= k)
      return -1;
    if (f >= g)
      return 1;
    if (f >>>= 0, g >>>= 0, b >>>= 0, k >>>= 0, this === u) return 0;
    let O = k - b, W = g - f;
    const ce = Math.min(O, W), oe = this.slice(b, k), le = u.slice(f, g);
    for (let te = 0; te < ce; ++te)
      if (oe[te] !== le[te]) {
        O = oe[te], W = le[te];
        break;
      }
    return O < W ? -1 : W < O ? 1 : 0;
  };
  function q(y, u, f, g, b) {
    if (y.length === 0) return -1;
    if (typeof f == "string" ? (g = f, f = 0) : f > 2147483647 ? f = 2147483647 : f < -2147483648 && (f = -2147483648), f = +f, Qn(f) && (f = b ? 0 : y.length - 1), f < 0 && (f = y.length + f), f >= y.length) {
      if (b) return -1;
      f = y.length - 1;
    } else if (f < 0)
      if (b) f = 0;
      else return -1;
    if (typeof u == "string" && (u = c.from(u, g)), c.isBuffer(u))
      return u.length === 0 ? -1 : z(y, u, f, g, b);
    if (typeof u == "number")
      return u = u & 255, typeof s.prototype.indexOf == "function" ? b ? s.prototype.indexOf.call(y, u, f) : s.prototype.lastIndexOf.call(y, u, f) : z(y, [u], f, g, b);
    throw new TypeError("val must be string, number or Buffer");
  }
  function z(y, u, f, g, b) {
    let k = 1, O = y.length, W = u.length;
    if (g !== void 0 && (g = String(g).toLowerCase(), g === "ucs2" || g === "ucs-2" || g === "utf16le" || g === "utf-16le")) {
      if (y.length < 2 || u.length < 2)
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
        if (ce(y, oe) === ce(u, le === -1 ? 0 : oe - le)) {
          if (le === -1 && (le = oe), oe - le + 1 === W) return le * k;
        } else
          le !== -1 && (oe -= oe - le), le = -1;
    } else
      for (f + W > O && (f = O - W), oe = f; oe >= 0; oe--) {
        let le = !0;
        for (let te = 0; te < W; te++)
          if (ce(y, oe + te) !== ce(u, te)) {
            le = !1;
            break;
          }
        if (le) return oe;
      }
    return -1;
  }
  c.prototype.includes = function(u, f, g) {
    return this.indexOf(u, f, g) !== -1;
  }, c.prototype.indexOf = function(u, f, g) {
    return q(this, u, f, g, !0);
  }, c.prototype.lastIndexOf = function(u, f, g) {
    return q(this, u, f, g, !1);
  };
  function Y(y, u, f, g) {
    f = Number(f) || 0;
    const b = y.length - f;
    g ? (g = Number(g), g > b && (g = b)) : g = b;
    const k = u.length;
    g > k / 2 && (g = k / 2);
    let O;
    for (O = 0; O < g; ++O) {
      const W = parseInt(u.substr(O * 2, 2), 16);
      if (Qn(W)) return O;
      y[f + O] = W;
    }
    return O;
  }
  function Ae(y, u, f, g) {
    return Yr(Vn(u, y.length - f), y, f, g);
  }
  function ze(y, u, f, g) {
    return Yr(Ju(u), y, f, g);
  }
  function Be(y, u, f, g) {
    return Yr(Is(u), y, f, g);
  }
  function V(y, u, f, g) {
    return Yr(Yu(u, y.length - f), y, f, g);
  }
  c.prototype.write = function(u, f, g, b) {
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
    if ((g === void 0 || g > k) && (g = k), u.length > 0 && (g < 0 || f < 0) || f > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    b || (b = "utf8");
    let O = !1;
    for (; ; )
      switch (b) {
        case "hex":
          return Y(this, u, f, g);
        case "utf8":
        case "utf-8":
          return Ae(this, u, f, g);
        case "ascii":
        case "latin1":
        case "binary":
          return ze(this, u, f, g);
        case "base64":
          return Be(this, u, f, g);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return V(this, u, f, g);
        default:
          if (O) throw new TypeError("Unknown encoding: " + b);
          b = ("" + b).toLowerCase(), O = !0;
      }
  }, c.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function X(y, u, f) {
    return u === 0 && f === y.length ? e.fromByteArray(y) : e.fromByteArray(y.slice(u, f));
  }
  function P(y, u, f) {
    f = Math.min(y.length, f);
    const g = [];
    let b = u;
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
    const u = y.length;
    if (u <= Q)
      return String.fromCharCode.apply(String, y);
    let f = "", g = 0;
    for (; g < u; )
      f += String.fromCharCode.apply(
        String,
        y.slice(g, g += Q)
      );
    return f;
  }
  function Ie(y, u, f) {
    let g = "";
    f = Math.min(y.length, f);
    for (let b = u; b < f; ++b)
      g += String.fromCharCode(y[b] & 127);
    return g;
  }
  function G(y, u, f) {
    let g = "";
    f = Math.min(y.length, f);
    for (let b = u; b < f; ++b)
      g += String.fromCharCode(y[b]);
    return g;
  }
  function Ge(y, u, f) {
    const g = y.length;
    (!u || u < 0) && (u = 0), (!f || f < 0 || f > g) && (f = g);
    let b = "";
    for (let k = u; k < f; ++k)
      b += Xu[y[k]];
    return b;
  }
  function xt(y, u, f) {
    const g = y.slice(u, f);
    let b = "";
    for (let k = 0; k < g.length - 1; k += 2)
      b += String.fromCharCode(g[k] + g[k + 1] * 256);
    return b;
  }
  c.prototype.slice = function(u, f) {
    const g = this.length;
    u = ~~u, f = f === void 0 ? g : ~~f, u < 0 ? (u += g, u < 0 && (u = 0)) : u > g && (u = g), f < 0 ? (f += g, f < 0 && (f = 0)) : f > g && (f = g), f < u && (f = u);
    const b = this.subarray(u, f);
    return Object.setPrototypeOf(b, c.prototype), b;
  };
  function ae(y, u, f) {
    if (y % 1 !== 0 || y < 0) throw new RangeError("offset is not uint");
    if (y + u > f) throw new RangeError("Trying to access beyond buffer length");
  }
  c.prototype.readUintLE = c.prototype.readUIntLE = function(u, f, g) {
    u = u >>> 0, f = f >>> 0, g || ae(u, f, this.length);
    let b = this[u], k = 1, O = 0;
    for (; ++O < f && (k *= 256); )
      b += this[u + O] * k;
    return b;
  }, c.prototype.readUintBE = c.prototype.readUIntBE = function(u, f, g) {
    u = u >>> 0, f = f >>> 0, g || ae(u, f, this.length);
    let b = this[u + --f], k = 1;
    for (; f > 0 && (k *= 256); )
      b += this[u + --f] * k;
    return b;
  }, c.prototype.readUint8 = c.prototype.readUInt8 = function(u, f) {
    return u = u >>> 0, f || ae(u, 1, this.length), this[u];
  }, c.prototype.readUint16LE = c.prototype.readUInt16LE = function(u, f) {
    return u = u >>> 0, f || ae(u, 2, this.length), this[u] | this[u + 1] << 8;
  }, c.prototype.readUint16BE = c.prototype.readUInt16BE = function(u, f) {
    return u = u >>> 0, f || ae(u, 2, this.length), this[u] << 8 | this[u + 1];
  }, c.prototype.readUint32LE = c.prototype.readUInt32LE = function(u, f) {
    return u = u >>> 0, f || ae(u, 4, this.length), (this[u] | this[u + 1] << 8 | this[u + 2] << 16) + this[u + 3] * 16777216;
  }, c.prototype.readUint32BE = c.prototype.readUInt32BE = function(u, f) {
    return u = u >>> 0, f || ae(u, 4, this.length), this[u] * 16777216 + (this[u + 1] << 16 | this[u + 2] << 8 | this[u + 3]);
  }, c.prototype.readBigUInt64LE = gt(function(u) {
    u = u >>> 0, Wt(u, "offset");
    const f = this[u], g = this[u + 7];
    (f === void 0 || g === void 0) && hr(u, this.length - 8);
    const b = f + this[++u] * 2 ** 8 + this[++u] * 2 ** 16 + this[++u] * 2 ** 24, k = this[++u] + this[++u] * 2 ** 8 + this[++u] * 2 ** 16 + g * 2 ** 24;
    return BigInt(b) + (BigInt(k) << BigInt(32));
  }), c.prototype.readBigUInt64BE = gt(function(u) {
    u = u >>> 0, Wt(u, "offset");
    const f = this[u], g = this[u + 7];
    (f === void 0 || g === void 0) && hr(u, this.length - 8);
    const b = f * 2 ** 24 + this[++u] * 2 ** 16 + this[++u] * 2 ** 8 + this[++u], k = this[++u] * 2 ** 24 + this[++u] * 2 ** 16 + this[++u] * 2 ** 8 + g;
    return (BigInt(b) << BigInt(32)) + BigInt(k);
  }), c.prototype.readIntLE = function(u, f, g) {
    u = u >>> 0, f = f >>> 0, g || ae(u, f, this.length);
    let b = this[u], k = 1, O = 0;
    for (; ++O < f && (k *= 256); )
      b += this[u + O] * k;
    return k *= 128, b >= k && (b -= Math.pow(2, 8 * f)), b;
  }, c.prototype.readIntBE = function(u, f, g) {
    u = u >>> 0, f = f >>> 0, g || ae(u, f, this.length);
    let b = f, k = 1, O = this[u + --b];
    for (; b > 0 && (k *= 256); )
      O += this[u + --b] * k;
    return k *= 128, O >= k && (O -= Math.pow(2, 8 * f)), O;
  }, c.prototype.readInt8 = function(u, f) {
    return u = u >>> 0, f || ae(u, 1, this.length), this[u] & 128 ? (255 - this[u] + 1) * -1 : this[u];
  }, c.prototype.readInt16LE = function(u, f) {
    u = u >>> 0, f || ae(u, 2, this.length);
    const g = this[u] | this[u + 1] << 8;
    return g & 32768 ? g | 4294901760 : g;
  }, c.prototype.readInt16BE = function(u, f) {
    u = u >>> 0, f || ae(u, 2, this.length);
    const g = this[u + 1] | this[u] << 8;
    return g & 32768 ? g | 4294901760 : g;
  }, c.prototype.readInt32LE = function(u, f) {
    return u = u >>> 0, f || ae(u, 4, this.length), this[u] | this[u + 1] << 8 | this[u + 2] << 16 | this[u + 3] << 24;
  }, c.prototype.readInt32BE = function(u, f) {
    return u = u >>> 0, f || ae(u, 4, this.length), this[u] << 24 | this[u + 1] << 16 | this[u + 2] << 8 | this[u + 3];
  }, c.prototype.readBigInt64LE = gt(function(u) {
    u = u >>> 0, Wt(u, "offset");
    const f = this[u], g = this[u + 7];
    (f === void 0 || g === void 0) && hr(u, this.length - 8);
    const b = this[u + 4] + this[u + 5] * 2 ** 8 + this[u + 6] * 2 ** 16 + (g << 24);
    return (BigInt(b) << BigInt(32)) + BigInt(f + this[++u] * 2 ** 8 + this[++u] * 2 ** 16 + this[++u] * 2 ** 24);
  }), c.prototype.readBigInt64BE = gt(function(u) {
    u = u >>> 0, Wt(u, "offset");
    const f = this[u], g = this[u + 7];
    (f === void 0 || g === void 0) && hr(u, this.length - 8);
    const b = (f << 24) + // Overflow
    this[++u] * 2 ** 16 + this[++u] * 2 ** 8 + this[++u];
    return (BigInt(b) << BigInt(32)) + BigInt(this[++u] * 2 ** 24 + this[++u] * 2 ** 16 + this[++u] * 2 ** 8 + g);
  }), c.prototype.readFloatLE = function(u, f) {
    return u = u >>> 0, f || ae(u, 4, this.length), t.read(this, u, !0, 23, 4);
  }, c.prototype.readFloatBE = function(u, f) {
    return u = u >>> 0, f || ae(u, 4, this.length), t.read(this, u, !1, 23, 4);
  }, c.prototype.readDoubleLE = function(u, f) {
    return u = u >>> 0, f || ae(u, 8, this.length), t.read(this, u, !0, 52, 8);
  }, c.prototype.readDoubleBE = function(u, f) {
    return u = u >>> 0, f || ae(u, 8, this.length), t.read(this, u, !1, 52, 8);
  };
  function fe(y, u, f, g, b, k) {
    if (!c.isBuffer(y)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (u > b || u < k) throw new RangeError('"value" argument is out of bounds');
    if (f + g > y.length) throw new RangeError("Index out of range");
  }
  c.prototype.writeUintLE = c.prototype.writeUIntLE = function(u, f, g, b) {
    if (u = +u, f = f >>> 0, g = g >>> 0, !b) {
      const W = Math.pow(2, 8 * g) - 1;
      fe(this, u, f, g, W, 0);
    }
    let k = 1, O = 0;
    for (this[f] = u & 255; ++O < g && (k *= 256); )
      this[f + O] = u / k & 255;
    return f + g;
  }, c.prototype.writeUintBE = c.prototype.writeUIntBE = function(u, f, g, b) {
    if (u = +u, f = f >>> 0, g = g >>> 0, !b) {
      const W = Math.pow(2, 8 * g) - 1;
      fe(this, u, f, g, W, 0);
    }
    let k = g - 1, O = 1;
    for (this[f + k] = u & 255; --k >= 0 && (O *= 256); )
      this[f + k] = u / O & 255;
    return f + g;
  }, c.prototype.writeUint8 = c.prototype.writeUInt8 = function(u, f, g) {
    return u = +u, f = f >>> 0, g || fe(this, u, f, 1, 255, 0), this[f] = u & 255, f + 1;
  }, c.prototype.writeUint16LE = c.prototype.writeUInt16LE = function(u, f, g) {
    return u = +u, f = f >>> 0, g || fe(this, u, f, 2, 65535, 0), this[f] = u & 255, this[f + 1] = u >>> 8, f + 2;
  }, c.prototype.writeUint16BE = c.prototype.writeUInt16BE = function(u, f, g) {
    return u = +u, f = f >>> 0, g || fe(this, u, f, 2, 65535, 0), this[f] = u >>> 8, this[f + 1] = u & 255, f + 2;
  }, c.prototype.writeUint32LE = c.prototype.writeUInt32LE = function(u, f, g) {
    return u = +u, f = f >>> 0, g || fe(this, u, f, 4, 4294967295, 0), this[f + 3] = u >>> 24, this[f + 2] = u >>> 16, this[f + 1] = u >>> 8, this[f] = u & 255, f + 4;
  }, c.prototype.writeUint32BE = c.prototype.writeUInt32BE = function(u, f, g) {
    return u = +u, f = f >>> 0, g || fe(this, u, f, 4, 4294967295, 0), this[f] = u >>> 24, this[f + 1] = u >>> 16, this[f + 2] = u >>> 8, this[f + 3] = u & 255, f + 4;
  };
  function ve(y, u, f, g, b) {
    As(u, g, b, y, f, 7);
    let k = Number(u & BigInt(4294967295));
    y[f++] = k, k = k >> 8, y[f++] = k, k = k >> 8, y[f++] = k, k = k >> 8, y[f++] = k;
    let O = Number(u >> BigInt(32) & BigInt(4294967295));
    return y[f++] = O, O = O >> 8, y[f++] = O, O = O >> 8, y[f++] = O, O = O >> 8, y[f++] = O, f;
  }
  function me(y, u, f, g, b) {
    As(u, g, b, y, f, 7);
    let k = Number(u & BigInt(4294967295));
    y[f + 7] = k, k = k >> 8, y[f + 6] = k, k = k >> 8, y[f + 5] = k, k = k >> 8, y[f + 4] = k;
    let O = Number(u >> BigInt(32) & BigInt(4294967295));
    return y[f + 3] = O, O = O >> 8, y[f + 2] = O, O = O >> 8, y[f + 1] = O, O = O >> 8, y[f] = O, f + 8;
  }
  c.prototype.writeBigUInt64LE = gt(function(u, f = 0) {
    return ve(this, u, f, BigInt(0), BigInt("0xffffffffffffffff"));
  }), c.prototype.writeBigUInt64BE = gt(function(u, f = 0) {
    return me(this, u, f, BigInt(0), BigInt("0xffffffffffffffff"));
  }), c.prototype.writeIntLE = function(u, f, g, b) {
    if (u = +u, f = f >>> 0, !b) {
      const ce = Math.pow(2, 8 * g - 1);
      fe(this, u, f, g, ce - 1, -ce);
    }
    let k = 0, O = 1, W = 0;
    for (this[f] = u & 255; ++k < g && (O *= 256); )
      u < 0 && W === 0 && this[f + k - 1] !== 0 && (W = 1), this[f + k] = (u / O >> 0) - W & 255;
    return f + g;
  }, c.prototype.writeIntBE = function(u, f, g, b) {
    if (u = +u, f = f >>> 0, !b) {
      const ce = Math.pow(2, 8 * g - 1);
      fe(this, u, f, g, ce - 1, -ce);
    }
    let k = g - 1, O = 1, W = 0;
    for (this[f + k] = u & 255; --k >= 0 && (O *= 256); )
      u < 0 && W === 0 && this[f + k + 1] !== 0 && (W = 1), this[f + k] = (u / O >> 0) - W & 255;
    return f + g;
  }, c.prototype.writeInt8 = function(u, f, g) {
    return u = +u, f = f >>> 0, g || fe(this, u, f, 1, 127, -128), u < 0 && (u = 255 + u + 1), this[f] = u & 255, f + 1;
  }, c.prototype.writeInt16LE = function(u, f, g) {
    return u = +u, f = f >>> 0, g || fe(this, u, f, 2, 32767, -32768), this[f] = u & 255, this[f + 1] = u >>> 8, f + 2;
  }, c.prototype.writeInt16BE = function(u, f, g) {
    return u = +u, f = f >>> 0, g || fe(this, u, f, 2, 32767, -32768), this[f] = u >>> 8, this[f + 1] = u & 255, f + 2;
  }, c.prototype.writeInt32LE = function(u, f, g) {
    return u = +u, f = f >>> 0, g || fe(this, u, f, 4, 2147483647, -2147483648), this[f] = u & 255, this[f + 1] = u >>> 8, this[f + 2] = u >>> 16, this[f + 3] = u >>> 24, f + 4;
  }, c.prototype.writeInt32BE = function(u, f, g) {
    return u = +u, f = f >>> 0, g || fe(this, u, f, 4, 2147483647, -2147483648), u < 0 && (u = 4294967295 + u + 1), this[f] = u >>> 24, this[f + 1] = u >>> 16, this[f + 2] = u >>> 8, this[f + 3] = u & 255, f + 4;
  }, c.prototype.writeBigInt64LE = gt(function(u, f = 0) {
    return ve(this, u, f, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), c.prototype.writeBigInt64BE = gt(function(u, f = 0) {
    return me(this, u, f, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function qn(y, u, f, g, b, k) {
    if (f + g > y.length) throw new RangeError("Index out of range");
    if (f < 0) throw new RangeError("Index out of range");
  }
  function Jr(y, u, f, g, b) {
    return u = +u, f = f >>> 0, b || qn(y, u, f, 4), t.write(y, u, f, g, 23, 4), f + 4;
  }
  c.prototype.writeFloatLE = function(u, f, g) {
    return Jr(this, u, f, !0, g);
  }, c.prototype.writeFloatBE = function(u, f, g) {
    return Jr(this, u, f, !1, g);
  };
  function xs(y, u, f, g, b) {
    return u = +u, f = f >>> 0, b || qn(y, u, f, 8), t.write(y, u, f, g, 52, 8), f + 8;
  }
  c.prototype.writeDoubleLE = function(u, f, g) {
    return xs(this, u, f, !0, g);
  }, c.prototype.writeDoubleBE = function(u, f, g) {
    return xs(this, u, f, !1, g);
  }, c.prototype.copy = function(u, f, g, b) {
    if (!c.isBuffer(u)) throw new TypeError("argument should be a Buffer");
    if (g || (g = 0), !b && b !== 0 && (b = this.length), f >= u.length && (f = u.length), f || (f = 0), b > 0 && b < g && (b = g), b === g || u.length === 0 || this.length === 0) return 0;
    if (f < 0)
      throw new RangeError("targetStart out of bounds");
    if (g < 0 || g >= this.length) throw new RangeError("Index out of range");
    if (b < 0) throw new RangeError("sourceEnd out of bounds");
    b > this.length && (b = this.length), u.length - f < b - g && (b = u.length - f + g);
    const k = b - g;
    return this === u && typeof s.prototype.copyWithin == "function" ? this.copyWithin(f, g, b) : s.prototype.set.call(
      u,
      this.subarray(g, b),
      f
    ), k;
  }, c.prototype.fill = function(u, f, g, b) {
    if (typeof u == "string") {
      if (typeof f == "string" ? (b = f, f = 0, g = this.length) : typeof g == "string" && (b = g, g = this.length), b !== void 0 && typeof b != "string")
        throw new TypeError("encoding must be a string");
      if (typeof b == "string" && !c.isEncoding(b))
        throw new TypeError("Unknown encoding: " + b);
      if (u.length === 1) {
        const O = u.charCodeAt(0);
        (b === "utf8" && O < 128 || b === "latin1") && (u = O);
      }
    } else typeof u == "number" ? u = u & 255 : typeof u == "boolean" && (u = Number(u));
    if (f < 0 || this.length < f || this.length < g)
      throw new RangeError("Out of range index");
    if (g <= f)
      return this;
    f = f >>> 0, g = g === void 0 ? this.length : g >>> 0, u || (u = 0);
    let k;
    if (typeof u == "number")
      for (k = f; k < g; ++k)
        this[k] = u;
    else {
      const O = c.isBuffer(u) ? u : c.from(u, b), W = O.length;
      if (W === 0)
        throw new TypeError('The value "' + u + '" is invalid for argument "value"');
      for (k = 0; k < g - f; ++k)
        this[k + f] = O[k % W];
    }
    return this;
  };
  const Ht = {};
  function jn(y, u, f) {
    Ht[y] = class extends f {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: u.apply(this, arguments),
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
  jn(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(y) {
      return y ? `${y} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), jn(
    "ERR_INVALID_ARG_TYPE",
    function(y, u) {
      return `The "${y}" argument must be of type number. Received type ${typeof u}`;
    },
    TypeError
  ), jn(
    "ERR_OUT_OF_RANGE",
    function(y, u, f) {
      let g = `The value of "${y}" is out of range.`, b = f;
      return Number.isInteger(f) && Math.abs(f) > 2 ** 32 ? b = Ts(String(f)) : typeof f == "bigint" && (b = String(f), (f > BigInt(2) ** BigInt(32) || f < -(BigInt(2) ** BigInt(32))) && (b = Ts(b)), b += "n"), g += ` It must be ${u}. Received ${b}`, g;
    },
    RangeError
  );
  function Ts(y) {
    let u = "", f = y.length;
    const g = y[0] === "-" ? 1 : 0;
    for (; f >= g + 4; f -= 3)
      u = `_${y.slice(f - 3, f)}${u}`;
    return `${y.slice(0, f)}${u}`;
  }
  function Ku(y, u, f) {
    Wt(u, "offset"), (y[u] === void 0 || y[u + f] === void 0) && hr(u, y.length - (f + 1));
  }
  function As(y, u, f, g, b, k) {
    if (y > f || y < u) {
      const O = typeof u == "bigint" ? "n" : "";
      let W;
      throw u === 0 || u === BigInt(0) ? W = `>= 0${O} and < 2${O} ** ${(k + 1) * 8}${O}` : W = `>= -(2${O} ** ${(k + 1) * 8 - 1}${O}) and < 2 ** ${(k + 1) * 8 - 1}${O}`, new Ht.ERR_OUT_OF_RANGE("value", W, y);
    }
    Ku(g, b, k);
  }
  function Wt(y, u) {
    if (typeof y != "number")
      throw new Ht.ERR_INVALID_ARG_TYPE(u, "number", y);
  }
  function hr(y, u, f) {
    throw Math.floor(y) !== y ? (Wt(y, f), new Ht.ERR_OUT_OF_RANGE("offset", "an integer", y)) : u < 0 ? new Ht.ERR_BUFFER_OUT_OF_BOUNDS() : new Ht.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${u}`,
      y
    );
  }
  const zu = /[^+/0-9A-Za-z-_]/g;
  function Gu(y) {
    if (y = y.split("=")[0], y = y.trim().replace(zu, ""), y.length < 2) return "";
    for (; y.length % 4 !== 0; )
      y = y + "=";
    return y;
  }
  function Vn(y, u) {
    u = u || 1 / 0;
    let f;
    const g = y.length;
    let b = null;
    const k = [];
    for (let O = 0; O < g; ++O) {
      if (f = y.charCodeAt(O), f > 55295 && f < 57344) {
        if (!b) {
          if (f > 56319) {
            (u -= 3) > -1 && k.push(239, 191, 189);
            continue;
          } else if (O + 1 === g) {
            (u -= 3) > -1 && k.push(239, 191, 189);
            continue;
          }
          b = f;
          continue;
        }
        if (f < 56320) {
          (u -= 3) > -1 && k.push(239, 191, 189), b = f;
          continue;
        }
        f = (b - 55296 << 10 | f - 56320) + 65536;
      } else b && (u -= 3) > -1 && k.push(239, 191, 189);
      if (b = null, f < 128) {
        if ((u -= 1) < 0) break;
        k.push(f);
      } else if (f < 2048) {
        if ((u -= 2) < 0) break;
        k.push(
          f >> 6 | 192,
          f & 63 | 128
        );
      } else if (f < 65536) {
        if ((u -= 3) < 0) break;
        k.push(
          f >> 12 | 224,
          f >> 6 & 63 | 128,
          f & 63 | 128
        );
      } else if (f < 1114112) {
        if ((u -= 4) < 0) break;
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
  function Ju(y) {
    const u = [];
    for (let f = 0; f < y.length; ++f)
      u.push(y.charCodeAt(f) & 255);
    return u;
  }
  function Yu(y, u) {
    let f, g, b;
    const k = [];
    for (let O = 0; O < y.length && !((u -= 2) < 0); ++O)
      f = y.charCodeAt(O), g = f >> 8, b = f % 256, k.push(b), k.push(g);
    return k;
  }
  function Is(y) {
    return e.toByteArray(Gu(y));
  }
  function Yr(y, u, f, g) {
    let b;
    for (b = 0; b < g && !(b + f >= u.length || b >= y.length); ++b)
      u[b + f] = y[b];
    return b;
  }
  function Je(y, u) {
    return y instanceof u || y != null && y.constructor != null && y.constructor.name != null && y.constructor.name === u.name;
  }
  function Qn(y) {
    return y !== y;
  }
  const Xu = function() {
    const y = "0123456789abcdef", u = new Array(256);
    for (let f = 0; f < 16; ++f) {
      const g = f * 16;
      for (let b = 0; b < 16; ++b)
        u[g + b] = y[f] + y[b];
    }
    return u;
  }();
  function gt(y) {
    return typeof BigInt > "u" ? Zu : y;
  }
  function Zu() {
    throw new Error("BigInt not supported");
  }
})(Ta);
const Ia = Ta.Buffer, Ue = globalThis || void 0 || self;
typeof self > "u" && (Ue.self = Ue);
class Oa {
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
    const n = (l, h) => {
      const c = h ? ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"] : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
      return c[Math.floor(l / 16)] + c[l % 16];
    }, i = Object.assign(
      {
        grouping: 0,
        rowlength: 0,
        uppercase: !1
      },
      t || {}
    );
    let s = "", o = 0, a = 0;
    for (let l = 0; l < e.length && (s += n(e[l], i.uppercase), l !== e.length - 1); ++l)
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
    const n = new Uint8Array(Math.floor(t.length / 2));
    let i = -1;
    for (let s = 0; s < t.length; ++s) {
      const o = t[s], a = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"].indexOf(o);
      if (a === -1)
        throw Error("unexpected character");
      i === -1 ? i = 16 * a : (n[Math.floor(s / 2)] = i + a, i = -1);
    }
    return n;
  }
}
String.prototype.trim || (String.prototype.trim = function() {
  return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
});
String.prototype.toCamelCase || (String.prototype.toCamelCase = function() {
  return this.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (r, e) => e.toUpperCase());
});
String.prototype.toSnakeCase || (String.prototype.toSnakeCase = function() {
  return this.replace(/[A-Z]/g, (r) => `_${r.toLowerCase()}`);
});
function vn(r, e) {
  const t = Math.ceil(r.length / e), n = [];
  for (let i = 0, s = 0; i < t; ++i, s += e)
    n[i] = r.substr(s, e);
  return n;
}
function Yi(r = 256, e = "abcdef0123456789") {
  let t = new Uint8Array(r);
  return t = crypto.getRandomValues(t), t = t.map((n) => e.charCodeAt(n % e.length)), String.fromCharCode.apply(null, t);
}
function Oc(r, e, t, n, i) {
  if (n = n || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~`!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?¿¡", i = i || n, e > n.length || t > i.length)
    return console.warn("Strings::charsetBaseConvert() - Can't convert", r, "to base", t, "greater than symbol table length. src-table:", n.length, "dest-table:", i.length), !1;
  let o = BigInt(0);
  for (let l = 0; l < r.length; l++)
    o = o * BigInt(e) + BigInt(n.indexOf(r.charAt(l)));
  let a = "";
  for (; o > 0; ) {
    const l = o % BigInt(t);
    a = i.charAt(Number(l)) + a, o /= BigInt(t);
  }
  return a || "0";
}
function My(r) {
  return Oa.toHex(r, {});
}
function $y(r) {
  return Oa.toUint8Array(r);
}
function Cc(r) {
  return Ia.from(r, "hex").toString("base64");
}
function Rc(r) {
  return Ia.from(r, "base64").toString("hex");
}
function Nc(r) {
  return /^[A-F0-9]+$/i.test(r);
}
function Dc(r) {
  return (typeof r == "number" || typeof r == "string" && r.trim() !== "") && !isNaN(r);
}
let bn = class {
  /**
   * Normalizes the meta array into the standard {key: ..., value: ...} format
   *
   * @param {array|object} meta
   * @return {array}
   */
  static normalizeMeta(e) {
    const t = [];
    for (const n in e)
      Object.prototype.hasOwnProperty.call(e, n) && e[n] !== null && t.push({
        key: n,
        value: e[n].toString()
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
      for (const n of e)
        t[n.key] = n.value;
    else
      t = e;
    return t;
  }
};
function Ca(r, e) {
  let t, n, i;
  const s = [Array, Date, Number, String, Boolean], o = Object.prototype.toString;
  for (e = e || [], t = 0; t < e.length; t += 2)
    r === e[t] && (n = e[t + 1]);
  if (!n && r && typeof r == "object") {
    for (n = {}, t = 0; t < s.length; t++)
      o.call(r) === o.call(i = new s[t](r)) && (n = t ? i : []);
    e.push(r, n);
    for (t in r)
      e.hasOwnProperty.call(r, t) && (n[t] = Ca(r[t], e));
  }
  return n || r;
}
function Fc(...r) {
  return [].concat(...r.map((e, t) => {
    const n = r.slice(0);
    n.splice(t, 1);
    const i = [...new Set([].concat(...n))];
    return e.filter((s) => !i.includes(s));
  }));
}
function pr(...r) {
  return r.reduce((e, t) => e.filter((n) => t.includes(n)));
}
class Xi {
  /**
   *
   * @param policy
   * @param metaKeys
   */
  constructor(e = {}, t = {}) {
    this.policy = Xi.normalizePolicy(e), this.fillDefault(t);
  }
  /**
   *
   * @param policy
   * @returns {{}}
   */
  static normalizePolicy(e = {}) {
    const t = {};
    for (const [n, i] of Object.entries(e))
      if (i !== null && ["read", "write"].includes(n)) {
        t[n] = {};
        for (const [s, o] of Object.entries(i))
          t[n][s] = o;
      }
    return t;
  }
  /**
   *
   */
  fillDefault(e = {}) {
    const t = Array.from(this.policy).filter((i) => i.action === "read"), n = Array.from(this.policy).filter((i) => i.action === "write");
    for (const [i, s] of Object.entries({
      read: t,
      write: n
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
class We {
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
    const t = new Xi(e, Object.keys(this.meta));
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
class ne extends TypeError {
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
class Bt extends ne {
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
class Dt {
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
          t.push(Dt.isStructure(e[n]) ? Dt.structure(e[n]) : e[n]);
        return t;
      }
      case "[object Object]": {
        const t = [], n = Object.keys(e).sort((i, s) => i === s ? 0 : i < s ? -1 : 1);
        for (const i of n)
          if (Object.prototype.hasOwnProperty.call(e, i)) {
            const s = {};
            s[i] = Dt.isStructure(e[i]) ? Dt.structure(e[i]) : e[i], t.push(s);
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
    return Dt.structure(this);
  }
}
class Mc extends Dt {
  constructor({
    position: e = null,
    walletAddress: t = null,
    isotope: n = null,
    token: i = null,
    value: s = null,
    batchId: o = null,
    metaType: a = null,
    metaId: l = null,
    meta: h = null,
    index: c = null,
    createdAt: d = null,
    version: p = null
  }) {
    super(), this.position = e, this.walletAddress = t, this.isotope = n, this.token = i, this.value = s, this.batchId = o, this.metaType = a, this.metaId = l, this.meta = h, this.index = c, this.createdAt = d, this.version = p;
  }
}
const an = {
  4: Mc
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
    isotope: n = null,
    token: i = null,
    value: s = null,
    batchId: o = null,
    metaType: a = null,
    metaId: l = null,
    meta: h = null,
    otsFragment: c = null,
    index: d = null,
    version: p = null
  }) {
    this.position = e, this.walletAddress = t, this.isotope = n, this.token = i, this.value = s !== null ? String(s) : null, this.batchId = o, this.metaType = a, this.metaId = l, this.meta = h ? bn.normalizeMeta(h) : [], this.index = d, this.otsFragment = c, this.createdAt = String(+/* @__PURE__ */ new Date()), p !== null && Object.prototype.hasOwnProperty.call(an, p) && (this.version = String(p));
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
    value: n = null,
    metaType: i = null,
    metaId: s = null,
    meta: o = null,
    batchId: a = null
  }) {
    return o || (o = new We()), t && (o.setAtomWallet(t), a || (a = t.batchId)), new H({
      position: t ? t.position : null,
      walletAddress: t ? t.address : null,
      isotope: e,
      token: t ? t.token : null,
      value: n,
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
    const t = Object.assign(new H({}), JSON.parse(e)), n = Object.keys(new H({}));
    for (const i in t)
      Object.prototype.hasOwnProperty.call(t, i) && !n.includes(i) && delete t[i];
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
    const n = new Le("SHAKE256", "TEXT"), i = H.sortAtoms(e);
    if (i.length === 0)
      throw new Bt();
    if (i.map((s) => {
      if (!(s instanceof H))
        throw new Bt();
      return s;
    }), i.every((s) => s.version && Object.prototype.hasOwnProperty.call(an, s.version)))
      n.update(JSON.stringify(i.map((s) => an[s.version].create(s).view())));
    else {
      const s = String(e.length);
      let o = [];
      for (const a of i)
        o.push(s), o = o.concat(a.getHashableValues());
      for (const a of o)
        n.update(a);
    }
    switch (t) {
      case "hex":
        return n.getHash("HEX", { outputLen: 256 });
      case "array":
        return n.getHash("ARRAYBUFFER", { outputLen: 256 });
      default:
        return Oc(n.getHash("HEX", { outputLen: 256 }), 16, 17, "0123456789abcdef", "0123456789abcdefg").padStart(64, "0");
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
    return t.sort((n, i) => n.index < i.index ? -1 : 1), t;
  }
  /**
   * Get aggregated meta from stored normalized ones
   */
  aggregatedMeta() {
    return bn.aggregateMeta(this.meta);
  }
  /**
   *
   * @returns {*[]}
   */
  getHashableValues() {
    const e = [];
    for (const t of H.getHashableProps()) {
      const n = this[t];
      if (!(n === null && !["position", "walletAddress"].includes(t)))
        if (t === "meta")
          for (const i of n)
            typeof i.value < "u" && i.value !== null && (e.push(String(i.key)), e.push(String(i.value)));
        else
          e.push(n === null ? "" : String(n));
    }
    return e;
  }
}
function bi(r = null, e = 2048) {
  if (r) {
    const t = new Le("SHAKE256", "TEXT");
    return t.update(r), t.getHash("HEX", { outputLen: e * 2 });
  } else
    return Yi(e);
}
function ir(r, e = null) {
  const t = new Le("SHAKE256", "TEXT");
  return t.update(r), t.getHash("HEX", { outputLen: 256 });
}
function wn({
  molecularHash: r = null,
  index: e = null
}) {
  return r !== null && e !== null ? ir(String(r) + String(e), "generateBatchId") : Yi(64);
}
class Dr {
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
    return t.length && (t = JSON.parse(t), t || (t = {})), new Dr(
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
    return new Dr(
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
class $c extends ne {
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
function Ls(r) {
  if (!Number.isSafeInteger(r) || r < 0)
    throw new Error(`positive integer expected, not ${r}`);
}
function Bc(r) {
  return r instanceof Uint8Array || r != null && typeof r == "object" && r.constructor.name === "Uint8Array";
}
function On(r, ...e) {
  if (!Bc(r))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(r.length))
    throw new Error(`Uint8Array expected of length ${e}, not of length=${r.length}`);
}
function Us(r, e = !0) {
  if (r.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && r.finished)
    throw new Error("Hash#digest() has already been called");
}
function Pc(r, e) {
  On(r);
  const t = e.outputLen;
  if (r.length < t)
    throw new Error(`digestInto() expects output buffer of length at least ${t}`);
}
const Zr = /* @__PURE__ */ BigInt(2 ** 32 - 1), qs = /* @__PURE__ */ BigInt(32);
function Lc(r, e = !1) {
  return e ? { h: Number(r & Zr), l: Number(r >> qs & Zr) } : { h: Number(r >> qs & Zr) | 0, l: Number(r & Zr) | 0 };
}
function Uc(r, e = !1) {
  let t = new Uint32Array(r.length), n = new Uint32Array(r.length);
  for (let i = 0; i < r.length; i++) {
    const { h: s, l: o } = Lc(r[i], e);
    [t[i], n[i]] = [s, o];
  }
  return [t, n];
}
const qc = (r, e, t) => r << t | e >>> 32 - t, jc = (r, e, t) => e << t | r >>> 32 - t, Vc = (r, e, t) => e << t - 32 | r >>> 64 - t, Qc = (r, e, t) => r << t - 32 | e >>> 64 - t, Kn = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ra = (r) => new Uint32Array(r.buffer, r.byteOffset, Math.floor(r.byteLength / 4)), js = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68, Hc = (r) => r << 24 & 4278190080 | r << 8 & 16711680 | r >>> 8 & 65280 | r >>> 24 & 255;
function Vs(r) {
  for (let e = 0; e < r.length; e++)
    r[e] = Hc(r[e]);
}
function Wc(r) {
  if (typeof r != "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof r}`);
  return new Uint8Array(new TextEncoder().encode(r));
}
function Zi(r) {
  return typeof r == "string" && (r = Wc(r)), On(r), r;
}
class Kc {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function zc(r) {
  const e = (n) => r().update(Zi(n)).digest(), t = r();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => r(), e;
}
function Gc(r) {
  const e = (n, i) => r(i).update(Zi(n)).digest(), t = r({});
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = (n) => r(n), e;
}
function Jc(r = 32) {
  if (Kn && typeof Kn.getRandomValues == "function")
    return Kn.getRandomValues(new Uint8Array(r));
  throw new Error("crypto.getRandomValues must be defined");
}
const Na = [], Da = [], Fa = [], Yc = /* @__PURE__ */ BigInt(0), dr = /* @__PURE__ */ BigInt(1), Xc = /* @__PURE__ */ BigInt(2), Zc = /* @__PURE__ */ BigInt(7), el = /* @__PURE__ */ BigInt(256), tl = /* @__PURE__ */ BigInt(113);
for (let r = 0, e = dr, t = 1, n = 0; r < 24; r++) {
  [t, n] = [n, (2 * t + 3 * n) % 5], Na.push(2 * (5 * n + t)), Da.push((r + 1) * (r + 2) / 2 % 64);
  let i = Yc;
  for (let s = 0; s < 7; s++)
    e = (e << dr ^ (e >> Zc) * tl) % el, e & Xc && (i ^= dr << (dr << /* @__PURE__ */ BigInt(s)) - dr);
  Fa.push(i);
}
const [rl, nl] = /* @__PURE__ */ Uc(Fa, !0), Qs = (r, e, t) => t > 32 ? Vc(r, e, t) : qc(r, e, t), Hs = (r, e, t) => t > 32 ? Qc(r, e, t) : jc(r, e, t);
function il(r, e = 24) {
  const t = new Uint32Array(10);
  for (let n = 24 - e; n < 24; n++) {
    for (let o = 0; o < 10; o++)
      t[o] = r[o] ^ r[o + 10] ^ r[o + 20] ^ r[o + 30] ^ r[o + 40];
    for (let o = 0; o < 10; o += 2) {
      const a = (o + 8) % 10, l = (o + 2) % 10, h = t[l], c = t[l + 1], d = Qs(h, c, 1) ^ t[a], p = Hs(h, c, 1) ^ t[a + 1];
      for (let m = 0; m < 50; m += 10)
        r[o + m] ^= d, r[o + m + 1] ^= p;
    }
    let i = r[2], s = r[3];
    for (let o = 0; o < 24; o++) {
      const a = Da[o], l = Qs(i, s, a), h = Hs(i, s, a), c = Na[o];
      i = r[c], s = r[c + 1], r[c] = l, r[c + 1] = h;
    }
    for (let o = 0; o < 50; o += 10) {
      for (let a = 0; a < 10; a++)
        t[a] = r[o + a];
      for (let a = 0; a < 10; a++)
        r[o + a] ^= ~t[(a + 2) % 10] & t[(a + 4) % 10];
    }
    r[0] ^= rl[n], r[1] ^= nl[n];
  }
  t.fill(0);
}
class Cn extends Kc {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(e, t, n, i = !1, s = 24) {
    if (super(), this.blockLen = e, this.suffix = t, this.outputLen = n, this.enableXOF = i, this.rounds = s, this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, Ls(n), 0 >= this.blockLen || this.blockLen >= 200)
      throw new Error("Sha3 supports only keccak-f1600 function");
    this.state = new Uint8Array(200), this.state32 = Ra(this.state);
  }
  keccak() {
    js || Vs(this.state32), il(this.state32, this.rounds), js || Vs(this.state32), this.posOut = 0, this.pos = 0;
  }
  update(e) {
    Us(this);
    const { blockLen: t, state: n } = this;
    e = Zi(e);
    const i = e.length;
    for (let s = 0; s < i; ) {
      const o = Math.min(t - this.pos, i - s);
      for (let a = 0; a < o; a++)
        n[this.pos++] ^= e[s++];
      this.pos === t && this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = !0;
    const { state: e, suffix: t, pos: n, blockLen: i } = this;
    e[n] ^= t, t & 128 && n === i - 1 && this.keccak(), e[i - 1] ^= 128, this.keccak();
  }
  writeInto(e) {
    Us(this, !1), On(e), this.finish();
    const t = this.state, { blockLen: n } = this;
    for (let i = 0, s = e.length; i < s; ) {
      this.posOut >= n && this.keccak();
      const o = Math.min(n - this.posOut, s - i);
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
    return Ls(e), this.xofInto(new Uint8Array(e));
  }
  digestInto(e) {
    if (Pc(e, this), this.finished)
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
    const { blockLen: t, suffix: n, outputLen: i, rounds: s, enableXOF: o } = this;
    return e || (e = new Cn(t, n, i, o, s)), e.state32.set(this.state32), e.pos = this.pos, e.posOut = this.posOut, e.finished = this.finished, e.rounds = s, e.suffix = n, e.outputLen = i, e.enableXOF = o, e.destroyed = this.destroyed, e;
  }
}
const Ma = (r, e, t) => zc(() => new Cn(e, r, t)), sl = /* @__PURE__ */ Ma(6, 136, 256 / 8), ol = /* @__PURE__ */ Ma(6, 72, 512 / 8), $a = (r, e, t) => Gc((n = {}) => new Cn(e, r, n.dkLen === void 0 ? t : n.dkLen, !0)), al = /* @__PURE__ */ $a(31, 168, 128 / 8), Ba = /* @__PURE__ */ $a(31, 136, 256 / 8);
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
const Et = On, Ws = Jc;
function Ks(r, e) {
  if (r.length !== e.length)
    return !1;
  let t = 0;
  for (let n = 0; n < r.length; n++)
    t |= r[n] ^ e[n];
  return t === 0;
}
function un(...r) {
  const e = (n) => typeof n == "number" ? n : n.bytesLen, t = r.reduce((n, i) => n + e(i), 0);
  return {
    bytesLen: t,
    encode: (n) => {
      const i = new Uint8Array(t);
      for (let s = 0, o = 0; s < r.length; s++) {
        const a = r[s], l = e(a), h = typeof a == "number" ? n[s] : a.encode(n[s]);
        Et(h, l), i.set(h, o), typeof a != "number" && h.fill(0), o += l;
      }
      return i;
    },
    decode: (n) => {
      Et(n, t);
      const i = [];
      for (const s of r) {
        const o = e(s), a = n.subarray(0, o);
        i.push(typeof s == "number" ? a : s.decode(a)), n = n.subarray(o);
      }
      return i;
    }
  };
}
function zn(r, e) {
  const t = e * r.bytesLen;
  return {
    bytesLen: t,
    encode: (n) => {
      if (n.length !== e)
        throw new Error(`vecCoder.encode: wrong length=${n.length}. Expected: ${e}`);
      const i = new Uint8Array(t);
      for (let s = 0, o = 0; s < n.length; s++) {
        const a = r.encode(n[s]);
        i.set(a, o), a.fill(0), o += a.length;
      }
      return i;
    },
    decode: (n) => {
      Et(n, t);
      const i = [];
      for (let s = 0; s < n.length; s += r.bytesLen)
        i.push(r.decode(n.subarray(s, s + r.bytesLen)));
      return i;
    }
  };
}
function Mt(...r) {
  for (const e of r)
    if (Array.isArray(e))
      for (const t of e)
        t.fill(0);
    else
      e.fill(0);
}
function zs(r) {
  return (1 << r) - 1;
}
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
function ul(r, e = 8) {
  const i = r.toString(2).padStart(8, "0").slice(-e).padStart(7, "0").split("").reverse().join("");
  return Number.parseInt(i, 2);
}
const cl = (r) => {
  const { newPoly: e, N: t, Q: n, F: i, ROOT_OF_UNITY: s, brvBits: o, isKyber: a } = r, l = (_, E = n) => {
    const T = _ % E | 0;
    return (T >= 0 ? T | 0 : E + T | 0) | 0;
  }, h = (_, E = n) => {
    const T = l(_, E) | 0;
    return (T > E >> 1 ? T - E | 0 : T) | 0;
  };
  function c() {
    const _ = e(t);
    for (let E = 0; E < t; E++) {
      const T = ul(E, o), I = BigInt(s) ** BigInt(T) % BigInt(n);
      _[E] = Number(I) | 0;
    }
    return _;
  }
  const d = c(), p = a ? 128 : t, m = a ? 1 : 0;
  return { mod: l, smod: h, nttZetas: d, NTT: {
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
    const T = zs(_), I = _ * (t / 8);
    return {
      bytesLen: I,
      encode: (A) => {
        const R = new Uint8Array(I);
        for (let N = 0, F = 0, B = 0, q = 0; N < A.length; N++)
          for (F |= (E.encode(A[N]) & T) << B, B += _; B >= 8; B -= 8, F >>= 8)
            R[q++] = F & zs(B);
        return R;
      },
      decode: (A) => {
        const R = e(t);
        for (let N = 0, F = 0, B = 0, q = 0; N < A.length; N++)
          for (F |= A[N] << B, B += 8; B >= _; B -= _, F >>= _)
            R[q++] = E.decode(F & T);
        return R;
      }
    };
  } };
}, ll = (r) => (e, t) => {
  t || (t = r.blockLen);
  const n = new Uint8Array(e.length + 2);
  n.set(e);
  const i = e.length, s = new Uint8Array(t);
  let o = r.create({}), a = 0, l = 0;
  return {
    stats: () => ({ calls: a, xofs: l }),
    get: (h, c) => (n[i + 0] = h, n[i + 1] = c, o.destroy(), o = r.create({}).update(n), a++, () => (l++, o.xofInto(s))),
    clean: () => {
      o.destroy(), s.fill(0), n.fill(0);
    }
  };
}, hl = /* @__PURE__ */ ll(al);
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
const Re = 256, dt = 3329, fl = 3303, pl = 17, { mod: Fr, nttZetas: dl, NTT: Tt, bitsCoder: yl } = cl({
  N: Re,
  Q: dt,
  F: fl,
  ROOT_OF_UNITY: pl,
  newPoly: (r) => new Uint16Array(r),
  brvBits: 7,
  isKyber: !0
}), ml = {
  512: { N: Re, Q: dt, K: 2, ETA1: 3, ETA2: 2, du: 10, dv: 4, RBGstrength: 128 },
  768: { N: Re, Q: dt, K: 3, ETA1: 2, ETA2: 2, du: 10, dv: 4, RBGstrength: 192 },
  1024: { N: Re, Q: dt, K: 4, ETA1: 2, ETA2: 2, du: 11, dv: 5, RBGstrength: 256 }
}, gl = (r) => {
  if (r >= 12)
    return { encode: (t) => t, decode: (t) => t };
  const e = 2 ** (r - 1);
  return {
    // const compress = (i: number) => round((2 ** d / Q) * i) % 2 ** d;
    encode: (t) => ((t << r) + dt / 2) / dt,
    // const decompress = (i: number) => round((Q / 2 ** d) * i);
    decode: (t) => t * dt + e >>> r
  };
}, yr = (r) => yl(r, gl(r));
function At(r, e) {
  for (let t = 0; t < Re; t++)
    r[t] = Fr(r[t] + e[t]);
}
function vl(r, e) {
  for (let t = 0; t < Re; t++)
    r[t] = Fr(r[t] - e[t]);
}
function bl(r, e, t, n, i) {
  const s = Fr(e * n * i + r * t), o = Fr(r * n + e * t);
  return { c0: s, c1: o };
}
function en(r, e) {
  for (let t = 0; t < Re / 2; t++) {
    let n = dl[64 + (t >> 1)];
    t & 1 && (n = -n);
    const { c0: i, c1: s } = bl(r[2 * t + 0], r[2 * t + 1], e[2 * t + 0], e[2 * t + 1], n);
    r[2 * t + 0] = i, r[2 * t + 1] = s;
  }
  return r;
}
function Gs(r) {
  const e = new Uint16Array(Re);
  for (let t = 0; t < Re; ) {
    const n = r();
    if (n.length % 3)
      throw new Error("SampleNTT: unaligned block");
    for (let i = 0; t < Re && i + 3 <= n.length; i += 3) {
      const s = (n[i + 0] >> 0 | n[i + 1] << 8) & 4095, o = (n[i + 1] >> 4 | n[i + 2] << 4) & 4095;
      s < dt && (e[t++] = s), t < Re && o < dt && (e[t++] = o);
    }
  }
  return e;
}
function mr(r, e, t, n) {
  const i = r(n * Re / 4, e, t), s = new Uint16Array(Re), o = Ra(i);
  let a = 0;
  for (let l = 0, h = 0, c = 0, d = 0; l < o.length; l++) {
    let p = o[l];
    for (let m = 0; m < 32; m++)
      c += p & 1, p >>= 1, a += 1, a === n ? (d = c, c = 0) : a === 2 * n && (s[h++] = Fr(d - c), c = 0, a = 0);
  }
  if (a)
    throw new Error(`sampleCBD: leftover bits: ${a}`);
  return s;
}
const wl = (r) => {
  const { K: e, PRF: t, XOF: n, HASH512: i, ETA1: s, ETA2: o, du: a, dv: l } = r, h = yr(1), c = yr(l), d = yr(a), p = un(zn(yr(12), e), 32), m = zn(yr(12), e), v = un(zn(d, e), c), w = un(32, 32);
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
        R.push(Tt.encode(mr(t, A, q, s)));
      const F = n(I);
      for (let q = 0; q < e; q++) {
        const z = Tt.encode(mr(t, A, e + q, s));
        for (let Y = 0; Y < e; Y++) {
          const Ae = Gs(F.get(Y, q));
          At(z, en(Ae, R[Y]));
        }
        N.push(z);
      }
      F.clean();
      const B = {
        publicKey: p.encode([N, I]),
        secretKey: m.encode(R)
      };
      return Mt(I, A, R, N, E, T), B;
    },
    encrypt: (_, E, T) => {
      const [I, A] = p.decode(_), R = [];
      for (let Y = 0; Y < e; Y++)
        R.push(Tt.encode(mr(t, T, Y, s)));
      const N = n(A), F = new Uint16Array(Re), B = [];
      for (let Y = 0; Y < e; Y++) {
        const Ae = mr(t, T, e + Y, o), ze = new Uint16Array(Re);
        for (let Be = 0; Be < e; Be++) {
          const V = Gs(N.get(Y, Be));
          At(ze, en(V, R[Be]));
        }
        At(Ae, Tt.decode(ze)), B.push(Ae), At(F, en(I[Y], R[Y])), ze.fill(0);
      }
      N.clean();
      const q = mr(t, T, 2 * e, o);
      At(q, Tt.decode(F));
      const z = h.decode(E);
      return At(z, q), Mt(I, R, F, q), v.encode([B, z]);
    },
    decrypt: (_, E) => {
      const [T, I] = v.decode(_), A = m.decode(E), R = new Uint16Array(Re);
      for (let N = 0; N < e; N++)
        At(R, en(A[N], Tt.encode(T[N])));
      return vl(I, Tt.decode(R)), Mt(R, A, T), h.encode(I);
    }
  };
};
function _l(r) {
  const e = wl(r), { HASH256: t, HASH512: n, KDF: i } = r, { secretCoder: s, cipherTextLen: o } = e, a = e.publicKeyLen, l = un(e.secretKeyLen, e.publicKeyLen, 32, 32), h = l.bytesLen, c = 32;
  return {
    publicKeyLen: a,
    msgLen: c,
    keygen: (d = Ws(64)) => {
      Et(d, 64);
      const { publicKey: p, secretKey: m } = e.keygen(d.subarray(0, 32)), v = t(p), w = l.encode([m, p, v, d.subarray(32)]);
      return Mt(m, v), { publicKey: p, secretKey: w };
    },
    encapsulate: (d, p = Ws(32)) => {
      Et(d, a), Et(p, c);
      const m = d.subarray(0, 384 * r.K), v = s.encode(s.decode(m.slice()));
      if (!Ks(v, m))
        throw Mt(v), new Error("ML-KEM.encapsulate: wrong publicKey modulus");
      Mt(v);
      const w = n.create().update(p).update(t(d)).digest(), _ = e.encrypt(d, p, w.subarray(32, 64));
      return w.subarray(32).fill(0), { cipherText: _, sharedSecret: w.subarray(0, 32) };
    },
    decapsulate: (d, p) => {
      Et(p, h), Et(d, o);
      const [m, v, w, _] = l.decode(p), E = e.decrypt(d, m), T = n.create().update(E).update(w).digest(), I = T.subarray(0, 32), A = e.encrypt(v, E, T.subarray(32, 64)), R = Ks(d, A), N = i.create({ dkLen: 32 }).update(_).update(d).digest();
      return Mt(E, A, R ? N : I), R ? I : N;
    }
  };
}
function El(r, e, t) {
  return Ba.create({ dkLen: r }).update(e).update(new Uint8Array([t])).digest();
}
const Sl = {
  HASH256: sl,
  HASH512: ol,
  KDF: Ba,
  XOF: hl,
  PRF: El
}, Gn = /* @__PURE__ */ _l({
  ...Sl,
  ...ml[768]
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
    token: n = "USER",
    address: i = null,
    position: s = null,
    batchId: o = null,
    characters: a = null
  }) {
    this.token = n, this.balance = 0, this.molecules = {}, this.key = null, this.privkey = null, this.pubkey = null, this.tokenUnits = [], this.tradeRates = {}, this.address = i, this.position = s, this.bundle = t, this.batchId = o, this.characters = a, e && (this.bundle = this.bundle || ir(e, "Wallet::constructor"), this.position = this.position || J.generatePosition(), this.key = J.generateKey({
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
    token: n,
    batchId: i = null,
    characters: s = null
  }) {
    let o = null;
    if (!e && !t)
      throw new $c();
    return e && !t && (o = J.generatePosition(), t = ir(e, "Wallet::create")), new J({
      secret: e,
      bundle: t,
      token: n,
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
    return typeof e != "string" ? !1 : e.length === 64 && Nc(e);
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
      t.push(Dr.createFromDB(n));
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
    const s = BigInt(`0x${e}`) + BigInt(`0x${n}`), o = new Le("SHAKE256", "TEXT");
    o.update(s.toString(16)), t && o.update(t);
    const a = new Le("SHAKE256", "TEXT");
    return a.update(o.getHash("HEX", { outputLen: 8192 })), a.getHash("HEX", { outputLen: 8192 });
  }
  /**
   * Generates a wallet address
   *
   * @param {string} key
   * @return {string}
   */
  static generateAddress(e) {
    const t = vn(e, 128), n = new Le("SHAKE256", "TEXT");
    for (const s in t) {
      let o = t[s];
      for (let a = 1; a <= 16; a++) {
        const l = new Le("SHAKE256", "TEXT");
        l.update(o), o = l.getHash("HEX", { outputLen: 512 });
      }
      n.update(o);
    }
    const i = new Le("SHAKE256", "TEXT");
    return i.update(n.getHash("HEX", { outputLen: 8192 })), i.getHash("HEX", { outputLen: 256 });
  }
  /**
   *
   * @param saltLength
   * @returns {string}
   */
  static generatePosition(e = 64) {
    return Yi(e, "abcdef0123456789");
  }
  /**
   * Initializes the ML-KEM key pair
   */
  initializeMLKEM() {
    const e = bi(this.key, 64), t = new Uint8Array(64);
    for (let s = 0; s < 64; s++)
      t[s] = parseInt(e.substr(s * 2, 2), 16);
    const { publicKey: n, secretKey: i } = Gn.keygen(t);
    this.pubkey = this.serializeKey(n), this.privkey = i;
  }
  serializeKey(e) {
    return btoa(String.fromCharCode.apply(null, e));
  }
  deserializeKey(e) {
    const t = atob(e);
    return new Uint8Array(t.length).map((n, i) => t.charCodeAt(i));
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
    const i = [], s = [];
    this.tokenUnits.forEach((o) => {
      e.includes(o.id) ? i.push(o) : s.push(o);
    }), this.tokenUnits = i, n !== null && (n.tokenUnits = i), t.tokenUnits = s;
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
    e.batchId && (this.batchId = t ? e.batchId : wn({}));
  }
  async encryptMessage(e, t) {
    const n = JSON.stringify(e), i = new TextEncoder().encode(n), s = this.deserializeKey(t), { cipherText: o, sharedSecret: a } = Gn.encapsulate(s), l = await this.encryptWithSharedSecret(i, a);
    return {
      cipherText: o,
      encryptedMessage: l
    };
  }
  async decryptMessage(e) {
    const { cipherText: t, encryptedMessage: n } = e, i = Gn.decapsulate(t, this.privkey), s = await this.decryptWithSharedSecret(n, i), o = new TextDecoder().decode(s);
    return JSON.parse(o);
  }
  async encryptWithSharedSecret(e, t) {
    const n = crypto.getRandomValues(new Uint8Array(12)), i = { name: "AES-GCM", iv: n }, s = await crypto.subtle.importKey(
      "raw",
      t,
      { name: "AES-GCM" },
      !1,
      ["encrypt"]
    ), o = await crypto.subtle.encrypt(
      i,
      s,
      e
    ), a = new Uint8Array(n.length + o.byteLength);
    return a.set(n), a.set(new Uint8Array(o), n.length), a;
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
class gr extends ne {
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
class kl extends ne {
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
class xl extends ne {
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
class Js extends ne {
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
class Pa extends ne {
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
class Tl extends ne {
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
class at extends ne {
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
class Ys extends ne {
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
class Xs extends ne {
  /**
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Token slugs for wallets in transfer do not match!", t = null, n = null) {
    super(e, t, n), this.name = "TransferMismatchedException";
  }
}
class Zs extends ne {
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
class Al extends ne {
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
class Il extends ne {
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
class bt extends ne {
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
class vr extends ne {
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
class cn extends ne {
  /**
   * @param {string|null} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Incorrect BatchId", t = null, n = null) {
    super(e, t, n), this.name = "BatchIdException";
  }
}
class eo {
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
class _n extends ne {
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
class qe extends ne {
  /**
   * @param {string|null} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Code exception", t = null, n = null) {
    super(e, t, n), this.name = "CodeException";
  }
}
class Ir {
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
    meta: i = null,
    address: s = null,
    token: o = null,
    amount: a = null,
    comparison: l = null
  }) {
    if (i && (this.meta = i), !e)
      throw new _n('Callback structure violated, missing mandatory "action" parameter.');
    this.__metaId = n, this.__metaType = t, this.__action = e, this.__address = s, this.__token = o, this.__amount = a, this.__comparison = l;
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
    if (!Dc(e))
      throw new qe("Parameter amount should be a string containing numbers");
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
    this.__meta = e instanceof eo ? e : eo.toObject(e);
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
    const t = new Ir({
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
    return pr(Object.keys(this.toJSON()), ["action", "metaId", "metaType", "meta"]).length === 4 && this._is("meta");
  }
  /**
   * @return {boolean}
   */
  isCollect() {
    return pr(Object.keys(this.toJSON()), ["action", "address", "token", "amount", "comparison"]).length === 5 && this._is("collect");
  }
  /**
   * @return {boolean}
   */
  isBuffer() {
    return pr(Object.keys(this.toJSON()), ["action", "address", "token", "amount", "comparison"]).length === 5 && this._is("buffer");
  }
  /**
   * @return {boolean}
   */
  isRemit() {
    return pr(Object.keys(this.toJSON()), ["action", "token", "amount"]).length === 3 && this._is("remit");
  }
  /**
   * @return {boolean}
   */
  isBurn() {
    return pr(Object.keys(this.toJSON()), ["action", "token", "amount", "comparison"]).length === 4 && this._is("burn");
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
class Jn {
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
    if ([e, t, n].some((i) => !i))
      throw new _n("Condition::constructor( { key, value, comparison } ) - not all class parameters are initialised!");
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
class Mr {
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
      if (!(n instanceof Jn))
        throw new _n();
    for (const n of t)
      if (!(n instanceof Ir))
        throw new _n();
    this.__condition = e, this.__callback = t;
  }
  /**
   *
   * @param {Condition[]|{}} condition
   */
  set comparison(e) {
    this.__condition.push(e instanceof Jn ? e : Jn.toObject(e));
  }
  /**
   * @param {Callback[]|{}} callback
   */
  set callback(e) {
    this.__callback.push(e instanceof Ir ? e : Ir.toObject(e));
  }
  /**
   *
   * @param {object} object
   *
   * @return {Rule}
   */
  static toObject(e) {
    if (!e.condition)
      throw new bt("Rule::toObject() - Incorrect rule format! There is no condition field.");
    if (!e.callback)
      throw new bt("Rule::toObject() - Incorrect rule format! There is no callback field.");
    const t = new Mr({});
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
class he {
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
    const i = t.split(".");
    let s = e;
    const o = i.length - 1;
    for (let h = 0; h < o; h++) {
      const c = i[h], d = Number(c), p = Number.isInteger(d);
      (p ? d : c in s) || (s[p ? d : c] = i[h + 1].match(/^\d+$/) ? [] : {}), s = s[p ? d : c];
    }
    const a = i[o], l = Number(a);
    return s[Number.isInteger(l) ? l : a] = n, e;
  }
}
class Ol {
  /**
   *
   * @param molecule
   */
  constructor(e) {
    if (e.molecularHash === null)
      throw new xl();
    if (!e.atoms.length)
      throw new Bt();
    for (const t of e.atoms)
      if (t.index === null)
        throw new gr();
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
      throw new Bt("Check::continuId() - Molecule is missing required ContinuID Atom!");
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
          throw new cn();
        for (const i of t)
          if (i.batchId === null)
            throw new cn();
      }
      return !0;
    }
    throw new cn();
  }
  /**
   *
   * @returns {boolean}
   */
  isotopeI() {
    for (const e of this.molecule.getIsotopes("I")) {
      if (e.token !== "USER")
        throw new vr(`Check::isotopeI() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index === 0)
        throw new gr(`Check::isotopeI() - Isotope "${e.isotope}" Atoms must have a non-zero index!`);
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
        throw new vr(`Check::isotopeU() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new gr(`Check::isotopeU() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
        throw new bt();
      if (t.token !== "USER")
        throw new vr(`Check::isotopeM() - "${t.token}" is not a valid Token slug for "${t.isotope}" isotope Atoms!`);
      const n = bn.aggregateMeta(t.meta);
      for (const i of e) {
        let s = n[i];
        if (s) {
          s = JSON.parse(s);
          for (const [o, a] of Object.entries(s))
            if (!e.includes(o)) {
              if (!Object.keys(n).includes(o))
                throw new Js(`${o} is missing from the meta.`);
              for (const l of a)
                if (!J.isBundleHash(l) && !["all", "self"].includes(l))
                  throw new Js(`${l} does not correspond to the format of the policy.`);
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
        throw new vr(`Check::isotopeC() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new gr(`Check::isotopeC() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
            throw new bt(`Check::isotopeT() - Required meta field "${i}" is missing!`);
      }
      for (const i of ["token"])
        if (!Object.prototype.hasOwnProperty.call(t, i) || !t[i])
          throw new bt(`Check::isotopeT() - Required meta field "${i}" is missing!`);
      if (e.token !== "USER")
        throw new vr(`Check::isotopeT() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new gr(`Check::isotopeT() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
        if (!Object.keys(n).every((i) => ["read", "write"].includes(i)))
          throw new bt("Check::isotopeR() - Mixing rules with politics!");
      }
      if (t.rule) {
        const n = JSON.parse(t.rule);
        if (!Array.isArray(n))
          throw new bt("Check::isotopeR() - Incorrect rule format!");
        for (const i of n)
          Mr.toObject(i);
        if (n.length < 1)
          throw new bt("Check::isotopeR() - No rules!");
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
    const n = this.molecule.atoms[0];
    if (n.isotope === "V" && t.length === 2) {
      const o = t[t.length - 1];
      if (n.token !== o.token)
        throw new Xs();
      if (o.value < 0)
        throw new Ys();
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
        if (a.token !== n.token)
          throw new Xs();
        if (o > 0) {
          if (s < 0)
            throw new Ys();
          if (a.walletAddress === n.walletAddress)
            throw new Al();
        }
        i += s;
      }
    if (i !== s)
      throw new Il();
    if (e) {
      if (s = n.value * 1, Number.isNaN(s))
        throw new TypeError('Invalid isotope "V" values');
      const o = e.balance + s;
      if (o < 0)
        throw new at();
      if (o !== i)
        throw new Zs();
    } else if (s !== 0)
      throw new Zs();
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
      throw new kl();
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
    if (t.length !== 2048 && (t = Rc(t), t.length !== 2048))
      throw new Pa();
    const n = vn(t, 128);
    let i = "";
    for (const p in n) {
      let m = n[p];
      for (let v = 0, w = 8 + e[p]; v < w; v++)
        m = new Le("SHAKE256", "TEXT").update(m).getHash("HEX", { outputLen: 512 });
      i += m;
    }
    const s = new Le("SHAKE256", "TEXT");
    s.update(i);
    const o = s.getHash("HEX", { outputLen: 8192 }), a = new Le("SHAKE256", "TEXT");
    a.update(o);
    const l = a.getHash("HEX", { outputLen: 256 }), h = this.molecule.atoms[0];
    let c = h.walletAddress;
    const d = he.get(h.aggregatedMeta(), "signingWallet");
    if (d && (c = he.get(JSON.parse(d), "address")), l !== c)
      throw new Tl();
    return !0;
  }
}
class br extends ne {
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
class to extends ne {
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
class ut {
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
    remainderWallet: i = null,
    cellSlug: s = null,
    version: o = null
  }) {
    this.status = null, this.molecularHash = null, this.createdAt = String(+/* @__PURE__ */ new Date()), this.cellSlugOrigin = this.cellSlug = s, this.secret = e, this.bundle = t, this.sourceWallet = n, this.atoms = [], o !== null && Object.prototype.hasOwnProperty.call(an, o) && (this.version = String(o)), (i || n) && (this.remainderWallet = i || J.create({
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
    const t = Object.assign(new ut({}), JSON.parse(e)), n = Object.keys(new ut({}));
    if (!Array.isArray(t.atoms))
      throw new Bt();
    for (const i in Object.keys(t.atoms)) {
      t.atoms[i] = H.jsonToObject(JSON.stringify(t.atoms[i]));
      for (const s of ["position", "walletAddress", "isotope"])
        if (t.atoms[i].isotope.toLowerCase() !== "r" && (typeof t.atoms[i][s] > "u" || t.atoms[i][s] === null))
          throw new Bt("MolecularStructure::jsonToObject() - Required Atom properties are missing!");
    }
    for (const i in t)
      Object.prototype.hasOwnProperty.call(t, i) && !n.includes(i) && delete t[i];
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
    }, n = [], i = e.toLowerCase().split("");
    for (let s = 0, o = i.length; s < o; ++s) {
      const a = i[s];
      typeof t[a] < "u" && (n[s] = t[a]);
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
    let t = e.reduce((i, s) => i + s);
    const n = t < 0;
    for (; t < 0 || t > 0; )
      for (const i of Object.keys(e))
        if ((n ? e[i] < 8 : e[i] > -8) && (n ? (++e[i], ++t) : (--e[i], --t), t === 0))
          break;
    return e;
  }
  /**
   *
   * @param isotopes
   * @returns {*[]}
   */
  getIsotopes(e) {
    return ut.isotopeFilter(e, this.atoms);
  }
  /**
   * Generates the next atomic index
   *
   * @return {number}
   */
  generateIndex() {
    return ut.generateNextAtomIndex(this.atoms);
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
    meta: n = {},
    policy: i = {}
  }) {
    const s = new We(n);
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
    const n = e.length;
    if (this.sourceWallet.balance - n < 0)
      throw new br();
    return this.addAtom(H.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -n
    })), this.addAtom(H.create({
      isotope: "F",
      wallet: t,
      value: 1,
      metaType: "walletBundle",
      metaId: t.bundle
    })), this.addAtom(H.create({
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
      throw new to("Molecule::burnToken() - Amount to burn must be positive!");
    if (this.sourceWallet.balance - e < 0)
      throw new br();
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
      throw new to("Molecule::replenishToken() - Amount to replenish must be positive!");
    if (t.length) {
      t = J.getTokenUnits(t), this.remainderWallet.tokenUnits = this.sourceWallet.tokenUnits;
      for (const n of t)
        this.remainderWallet.tokenUnits.push(n);
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
      throw new br();
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
      throw new br();
    const n = J.create({
      secret: this.secret,
      bundle: this.bundle,
      token: this.sourceWallet.token,
      batchId: this.sourceWallet.batchId
    });
    return n.tradeRates = t, this.addAtom(H.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -e
    })), this.addAtom(H.create({
      isotope: "B",
      wallet: n,
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
    let n = 0;
    for (const [s, o] of Object.entries(e || {}))
      n += o;
    if (this.sourceWallet.balance - n < 0)
      throw new br();
    const i = new We();
    t && i.setSigningWallet(t), this.addAtom(H.create({
      isotope: "B",
      wallet: this.sourceWallet,
      value: -n,
      meta: i,
      metaType: "walletBundle",
      metaId: this.sourceWallet.bundle
    }));
    for (const [s, o] of Object.entries(e || {}))
      this.addAtom(new H({
        isotope: "V",
        token: this.sourceWallet.token,
        value: o,
        batchId: this.sourceWallet.batchId ? wn({}) : null,
        metaType: "walletBundle",
        metaId: s
      }));
    return this.addAtom(H.create({
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
    const i = new We(n);
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
    rule: n,
    policy: i = {}
  }) {
    const s = [];
    for (const a of n)
      s.push(a instanceof Mr ? a : Mr.toObject(a));
    const o = new We({
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
    return t || (t = new We()), t.setMetaWallet(e), this.addAtom(H.create({
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
    const t = new We().setShadowWalletClaim(!0);
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
    const i = {
      code: n,
      hash: ir(t.trim(), "Molecule::initIdentifierCreation")
    };
    return this.addAtom(H.create({
      isotope: "C",
      wallet: this.sourceWallet,
      metaType: "identifier",
      metaId: e,
      meta: new We(i)
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
    policy: i
  }) {
    return this.addAtom(H.create({
      isotope: "M",
      wallet: this.sourceWallet,
      metaType: t,
      metaId: n,
      meta: new We(e)
    })), this.addPolicyAtom({
      metaType: t,
      metaId: n,
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
    metaType: n,
    metaId: i,
    meta: s = {},
    batchId: o = null
  }) {
    return s.token = e, this.local = 1, this.addAtom(H.create({
      isotope: "T",
      wallet: this.sourceWallet,
      value: t,
      metaType: n,
      metaId: i,
      meta: new We(s),
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
      meta: new We(e)
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
    if (this.atoms.length === 0 || this.atoms.filter((m) => !(m instanceof H)).length !== 0)
      throw new Bt();
    !t && !this.bundle && (this.bundle = e || ir(this.secret, "Molecule::sign")), this.molecularHash = H.hashAtoms({
      atoms: this.atoms
    });
    const i = this.atoms[0];
    let s = i.position;
    const o = he.get(i.aggregatedMeta(), "signingWallet");
    if (o && (s = he.get(JSON.parse(o), "position")), !s)
      throw new Pa("Signing wallet must have a position!");
    const a = J.generateKey({
      secret: this.secret,
      token: i.token,
      position: i.position
    }), l = vn(a, 128), h = this.normalizedHash();
    let c = "";
    for (const m in l) {
      let v = l[m];
      for (let w = 0, _ = 8 - h[m]; w < _; w++)
        v = new Le("SHAKE256", "TEXT").update(v).getHash("HEX", { outputLen: 512 });
      c += v;
    }
    n && (c = Cc(c));
    const d = vn(c, Math.ceil(c.length / this.atoms.length));
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
    const e = Ca(this);
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
    new Ol(this).verify(e);
  }
  /**
   * Convert Hm to numeric notation via EnumerateMolecule(Hm)
   *
   * @returns {Array}
   */
  normalizedHash() {
    return ut.normalize(ut.enumerate(this.molecularHash));
  }
}
const Yn = 10 ** 18;
class Zt {
  /**
   * @param {number} value
   * @return {number}
   */
  static val(e) {
    return Math.abs(e * Yn) < 1 ? 0 : e;
  }
  /**
   * @param {number} value1
   * @param {number} value2
   * @param {boolean} debug
   * @return {number}
   */
  static cmp(e, t, n = !1) {
    const i = Zt.val(e) * Yn, s = Zt.val(t) * Yn;
    return Math.abs(i - s) < 1 ? 0 : i > s ? 1 : -1;
  }
  /**
   * @param {number} value1
   * @param {number} value2
   * @return {boolean}
   */
  static equal(e, t) {
    return Zt.cmp(e, t) === 0;
  }
}
class $r {
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
    pubkey: i
  }) {
    this.$__token = e, this.$__expiresAt = t, this.$__pubkey = i, this.$__encrypt = n;
  }
  /**
   *
   * @param data
   * @param wallet
   * @returns {AuthToken}
   */
  static create(e, t) {
    const n = new $r(e);
    return n.setWallet(t), n;
  }
  /**
   *
   * @param {object} snapshot
   * @param {string} secret
   * @return {AuthToken}
   */
  static restore(e, t) {
    const n = new J({
      secret: t,
      token: "AUTH",
      position: e.wallet.position,
      characters: e.wallet.characters
    });
    return $r.create({
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
class Or extends ne {
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
class wi extends ne {
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
    dataKey: n = null
  }) {
    if (this.dataKey = n, this.errorKey = "exception", this.$__payload = null, this.$__query = e, this.$__originResponse = t, this.$__response = t, typeof this.$__response > "u" || this.$__response === null)
      throw new Or();
    if (he.has(this.$__response, this.errorKey)) {
      const i = he.get(this.$__response, this.errorKey);
      throw String(i).includes("Unauthenticated") ? new wi() : new Or();
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
      throw new Or();
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
class Me {
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
      throw new qe("Query::createQuery() - Node URI was not initialized for this client instance!");
    if (this.$__query === null)
      throw new qe("Query::createQuery() - GraphQL subscription was not initialized!");
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
      const i = await this.client.query({
        ...this.$__request,
        context: n
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
class Cl extends be {
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
var _i = function(r, e) {
  return _i = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
  }, _i(r, e);
};
function je(r, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  _i(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var x = function() {
  return x = Object.assign || function(e) {
    for (var t, n = 1, i = arguments.length; n < i; n++) {
      t = arguments[n];
      for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
    }
    return e;
  }, x.apply(this, arguments);
};
function Lt(r, e) {
  var t = {};
  for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && e.indexOf(n) < 0 && (t[n] = r[n]);
  if (r != null && typeof Object.getOwnPropertySymbols == "function")
    for (var i = 0, n = Object.getOwnPropertySymbols(r); i < n.length; i++)
      e.indexOf(n[i]) < 0 && Object.prototype.propertyIsEnumerable.call(r, n[i]) && (t[n[i]] = r[n[i]]);
  return t;
}
function Ot(r, e, t, n) {
  function i(s) {
    return s instanceof t ? s : new t(function(o) {
      o(s);
    });
  }
  return new (t || (t = Promise))(function(s, o) {
    function a(c) {
      try {
        h(n.next(c));
      } catch (d) {
        o(d);
      }
    }
    function l(c) {
      try {
        h(n.throw(c));
      } catch (d) {
        o(d);
      }
    }
    function h(c) {
      c.done ? s(c.value) : i(c.value).then(a, l);
    }
    h((n = n.apply(r, e || [])).next());
  });
}
function Ct(r, e) {
  var t = { label: 0, sent: function() {
    if (s[0] & 1) throw s[1];
    return s[1];
  }, trys: [], ops: [] }, n, i, s, o = Object.create((typeof Iterator == "function" ? Iterator : Object).prototype);
  return o.next = a(0), o.throw = a(1), o.return = a(2), typeof Symbol == "function" && (o[Symbol.iterator] = function() {
    return this;
  }), o;
  function a(h) {
    return function(c) {
      return l([h, c]);
    };
  }
  function l(h) {
    if (n) throw new TypeError("Generator is already executing.");
    for (; o && (o = 0, h[0] && (t = 0)), t; ) try {
      if (n = 1, i && (s = h[0] & 2 ? i.return : h[0] ? i.throw || ((s = i.return) && s.call(i), 0) : i.next) && !(s = s.call(i, h[1])).done) return s;
      switch (i = 0, s && (h = [h[0] & 2, s.value]), h[0]) {
        case 0:
        case 1:
          s = h;
          break;
        case 4:
          return t.label++, { value: h[1], done: !1 };
        case 5:
          t.label++, i = h[1], h = [0];
          continue;
        case 7:
          h = t.ops.pop(), t.trys.pop();
          continue;
        default:
          if (s = t.trys, !(s = s.length > 0 && s[s.length - 1]) && (h[0] === 6 || h[0] === 2)) {
            t = 0;
            continue;
          }
          if (h[0] === 3 && (!s || h[1] > s[0] && h[1] < s[3])) {
            t.label = h[1];
            break;
          }
          if (h[0] === 6 && t.label < s[1]) {
            t.label = s[1], s = h;
            break;
          }
          if (s && t.label < s[2]) {
            t.label = s[2], t.ops.push(h);
            break;
          }
          s[2] && t.ops.pop(), t.trys.pop();
          continue;
      }
      h = e.call(r, t);
    } catch (c) {
      h = [6, c], i = 0;
    } finally {
      n = s = 0;
    }
    if (h[0] & 5) throw h[1];
    return { value: h[0] ? h[1] : void 0, done: !0 };
  }
}
function En(r, e, t) {
  if (t || arguments.length === 2) for (var n = 0, i = e.length, s; n < i; n++)
    (s || !(n in e)) && (s || (s = Array.prototype.slice.call(e, 0, n)), s[n] = e[n]);
  return r.concat(s || Array.prototype.slice.call(e));
}
var Xn = "Invariant Violation", ro = Object.setPrototypeOf, Rl = ro === void 0 ? function(r, e) {
  return r.__proto__ = e, r;
} : ro, re = (
  /** @class */
  function(r) {
    je(e, r);
    function e(t) {
      t === void 0 && (t = Xn);
      var n = r.call(this, typeof t == "number" ? Xn + ": " + t + " (see https://github.com/apollographql/invariant-packages)" : t) || this;
      return n.framesToPop = 1, n.name = Xn, Rl(n, e.prototype), n;
    }
    return e;
  }(Error)
);
function D(r, e) {
  if (!r)
    throw new re(e);
}
var La = ["debug", "log", "warn", "error", "silent"], Nl = La.indexOf("log");
function tn(r) {
  return function() {
    if (La.indexOf(r) >= Nl) {
      var e = console[r] || console.log;
      return e.apply(console, arguments);
    }
  };
}
(function(r) {
  r.debug = tn("debug"), r.log = tn("log"), r.warn = tn("warn"), r.error = tn("error");
})(D || (D = {}));
function ct(r) {
  try {
    return r();
  } catch {
  }
}
const no = ct(function() {
  return globalThis;
}) || ct(function() {
  return window;
}) || ct(function() {
  return self;
}) || ct(function() {
  return Ue;
}) || ct(function() {
  return ct.constructor("return this")();
});
var io = "__", so = [io, io].join("DEV");
function Dl() {
  try {
    return !!__DEV__;
  } catch {
    return Object.defineProperty(no, so, {
      value: ct(function() {
        return !0;
      }) !== "production",
      enumerable: !1,
      configurable: !0,
      writable: !0
    }), no[so];
  }
}
const Zn = Dl();
function Fl(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var Ua = { exports: {} }, ye = Ua.exports = {}, Ye, Xe;
function Ei() {
  throw new Error("setTimeout has not been defined");
}
function Si() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? Ye = setTimeout : Ye = Ei;
  } catch {
    Ye = Ei;
  }
  try {
    typeof clearTimeout == "function" ? Xe = clearTimeout : Xe = Si;
  } catch {
    Xe = Si;
  }
})();
function qa(r) {
  if (Ye === setTimeout)
    return setTimeout(r, 0);
  if ((Ye === Ei || !Ye) && setTimeout)
    return Ye = setTimeout, setTimeout(r, 0);
  try {
    return Ye(r, 0);
  } catch {
    try {
      return Ye.call(null, r, 0);
    } catch {
      return Ye.call(this, r, 0);
    }
  }
}
function Ml(r) {
  if (Xe === clearTimeout)
    return clearTimeout(r);
  if ((Xe === Si || !Xe) && clearTimeout)
    return Xe = clearTimeout, clearTimeout(r);
  try {
    return Xe(r);
  } catch {
    try {
      return Xe.call(null, r);
    } catch {
      return Xe.call(this, r);
    }
  }
}
var lt = [], er = !1, $t, ln = -1;
function $l() {
  !er || !$t || (er = !1, $t.length ? lt = $t.concat(lt) : ln = -1, lt.length && ja());
}
function ja() {
  if (!er) {
    var r = qa($l);
    er = !0;
    for (var e = lt.length; e; ) {
      for ($t = lt, lt = []; ++ln < e; )
        $t && $t[ln].run();
      ln = -1, e = lt.length;
    }
    $t = null, er = !1, Ml(r);
  }
}
ye.nextTick = function(r) {
  var e = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var t = 1; t < arguments.length; t++)
      e[t - 1] = arguments[t];
  lt.push(new Va(r, e)), lt.length === 1 && !er && qa(ja);
};
function Va(r, e) {
  this.fun = r, this.array = e;
}
Va.prototype.run = function() {
  this.fun.apply(null, this.array);
};
ye.title = "browser";
ye.browser = !0;
ye.env = {};
ye.argv = [];
ye.version = "";
ye.versions = {};
function mt() {
}
ye.on = mt;
ye.addListener = mt;
ye.once = mt;
ye.off = mt;
ye.removeListener = mt;
ye.removeAllListeners = mt;
ye.emit = mt;
ye.prependListener = mt;
ye.prependOnceListener = mt;
ye.listeners = function(r) {
  return [];
};
ye.binding = function(r) {
  throw new Error("process.binding is not supported");
};
ye.cwd = function() {
  return "/";
};
ye.chdir = function(r) {
  throw new Error("process.chdir is not supported");
};
ye.umask = function() {
  return 0;
};
var Bl = Ua.exports;
const Pl = /* @__PURE__ */ Fl(Bl);
function wt(r) {
  try {
    return r();
  } catch {
  }
}
var ki = wt(function() {
  return globalThis;
}) || wt(function() {
  return window;
}) || wt(function() {
  return self;
}) || wt(function() {
  return Ue;
}) || // We don't expect the Function constructor ever to be invoked at runtime, as
// long as at least one of globalThis, window, self, or global is defined, so
// we are under no obligation to make it easy for static analysis tools to
// detect syntactic usage of the Function constructor. If you think you can
// improve your static analysis to detect this obfuscation, think again. This
// is an arms race you cannot win, at least not in JavaScript.
wt(function() {
  return wt.constructor("return this")();
}), xi = !1;
function Ll() {
  ki && !wt(function() {
    return !0;
  }) && !wt(function() {
    return Pl;
  }) && (Object.defineProperty(ki, "process", {
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
  }), xi = !0);
}
Ll();
function oo() {
  xi && (delete ki.process, xi = !1);
}
function hn(r, e) {
  if (!!!r)
    throw new Error(e);
}
function Ul(r) {
  return typeof r == "object" && r !== null;
}
function ql(r, e) {
  if (!!!r)
    throw new Error(
      "Unexpected invariant triggered."
    );
}
const jl = /\r\n|[\n\r]/g;
function Ti(r, e) {
  let t = 0, n = 1;
  for (const i of r.body.matchAll(jl)) {
    if (typeof i.index == "number" || ql(!1), i.index >= e)
      break;
    t = i.index + i[0].length, n += 1;
  }
  return {
    line: n,
    column: e + 1 - t
  };
}
function Vl(r) {
  return Qa(
    r.source,
    Ti(r.source, r.start)
  );
}
function Qa(r, e) {
  const t = r.locationOffset.column - 1, n = "".padStart(t) + r.body, i = e.line - 1, s = r.locationOffset.line - 1, o = e.line + s, a = e.line === 1 ? t : 0, l = e.column + a, h = `${r.name}:${o}:${l}
`, c = n.split(/\r\n|[\n\r]/g), d = c[i];
  if (d.length > 120) {
    const p = Math.floor(l / 80), m = l % 80, v = [];
    for (let w = 0; w < d.length; w += 80)
      v.push(d.slice(w, w + 80));
    return h + ao([
      [`${o} |`, v[0]],
      ...v.slice(1, p + 1).map((w) => ["|", w]),
      ["|", "^".padStart(m)],
      ["|", v[p + 1]]
    ]);
  }
  return h + ao([
    // Lines specified like this: ["prefix", "string"],
    [`${o - 1} |`, c[i - 1]],
    [`${o} |`, d],
    ["|", "^".padStart(l)],
    [`${o + 1} |`, c[i + 1]]
  ]);
}
function ao(r) {
  const e = r.filter(([n, i]) => i !== void 0), t = Math.max(...e.map(([n]) => n.length));
  return e.map(([n, i]) => n.padStart(t) + (i ? " " + i : "")).join(`
`);
}
function Ql(r) {
  const e = r[0];
  return e == null || "kind" in e || "length" in e ? {
    nodes: e,
    source: r[1],
    positions: r[2],
    path: r[3],
    originalError: r[4],
    extensions: r[5]
  } : e;
}
class es extends Error {
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
    var n, i, s;
    const { nodes: o, source: a, positions: l, path: h, originalError: c, extensions: d } = Ql(t);
    super(e), this.name = "GraphQLError", this.path = h ?? void 0, this.originalError = c ?? void 0, this.nodes = uo(
      Array.isArray(o) ? o : o ? [o] : void 0
    );
    const p = uo(
      (n = this.nodes) === null || n === void 0 ? void 0 : n.map((v) => v.loc).filter((v) => v != null)
    );
    this.source = a ?? (p == null || (i = p[0]) === null || i === void 0 ? void 0 : i.source), this.positions = l ?? p?.map((v) => v.start), this.locations = l && a ? l.map((v) => Ti(a, v)) : p?.map((v) => Ti(v.source, v.start));
    const m = Ul(
      c?.extensions
    ) ? c?.extensions : void 0;
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
    }), c != null && c.stack ? Object.defineProperty(this, "stack", {
      value: c.stack,
      writable: !0,
      configurable: !0
    }) : Error.captureStackTrace ? Error.captureStackTrace(this, es) : Object.defineProperty(this, "stack", {
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

` + Vl(t.loc));
    else if (this.source && this.locations)
      for (const t of this.locations)
        e += `

` + Qa(this.source, t);
    return e;
  }
  toJSON() {
    const e = {
      message: this.message
    };
    return this.locations != null && (e.locations = this.locations), this.path != null && (e.path = this.path), this.extensions != null && Object.keys(this.extensions).length > 0 && (e.extensions = this.extensions), e;
  }
}
function uo(r) {
  return r === void 0 || r.length === 0 ? void 0 : r;
}
function Ee(r, e, t) {
  return new es(`Syntax Error: ${t}`, {
    source: r,
    positions: [e]
  });
}
class Hl {
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
  constructor(e, t, n) {
    this.start = e.start, this.end = t.end, this.startToken = e, this.endToken = t, this.source = n;
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
class Ha {
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
  constructor(e, t, n, i, s, o) {
    this.kind = e, this.start = t, this.end = n, this.line = i, this.column = s, this.value = o, this.prev = null, this.next = null;
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
const Wa = {
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
}, Wl = new Set(Object.keys(Wa));
function co(r) {
  const e = r?.kind;
  return typeof e == "string" && Wl.has(e);
}
var Jt;
(function(r) {
  r.QUERY = "query", r.MUTATION = "mutation", r.SUBSCRIPTION = "subscription";
})(Jt || (Jt = {}));
var Ai;
(function(r) {
  r.QUERY = "QUERY", r.MUTATION = "MUTATION", r.SUBSCRIPTION = "SUBSCRIPTION", r.FIELD = "FIELD", r.FRAGMENT_DEFINITION = "FRAGMENT_DEFINITION", r.FRAGMENT_SPREAD = "FRAGMENT_SPREAD", r.INLINE_FRAGMENT = "INLINE_FRAGMENT", r.VARIABLE_DEFINITION = "VARIABLE_DEFINITION", r.SCHEMA = "SCHEMA", r.SCALAR = "SCALAR", r.OBJECT = "OBJECT", r.FIELD_DEFINITION = "FIELD_DEFINITION", r.ARGUMENT_DEFINITION = "ARGUMENT_DEFINITION", r.INTERFACE = "INTERFACE", r.UNION = "UNION", r.ENUM = "ENUM", r.ENUM_VALUE = "ENUM_VALUE", r.INPUT_OBJECT = "INPUT_OBJECT", r.INPUT_FIELD_DEFINITION = "INPUT_FIELD_DEFINITION";
})(Ai || (Ai = {}));
var U;
(function(r) {
  r.NAME = "Name", r.DOCUMENT = "Document", r.OPERATION_DEFINITION = "OperationDefinition", r.VARIABLE_DEFINITION = "VariableDefinition", r.SELECTION_SET = "SelectionSet", r.FIELD = "Field", r.ARGUMENT = "Argument", r.FRAGMENT_SPREAD = "FragmentSpread", r.INLINE_FRAGMENT = "InlineFragment", r.FRAGMENT_DEFINITION = "FragmentDefinition", r.VARIABLE = "Variable", r.INT = "IntValue", r.FLOAT = "FloatValue", r.STRING = "StringValue", r.BOOLEAN = "BooleanValue", r.NULL = "NullValue", r.ENUM = "EnumValue", r.LIST = "ListValue", r.OBJECT = "ObjectValue", r.OBJECT_FIELD = "ObjectField", r.DIRECTIVE = "Directive", r.NAMED_TYPE = "NamedType", r.LIST_TYPE = "ListType", r.NON_NULL_TYPE = "NonNullType", r.SCHEMA_DEFINITION = "SchemaDefinition", r.OPERATION_TYPE_DEFINITION = "OperationTypeDefinition", r.SCALAR_TYPE_DEFINITION = "ScalarTypeDefinition", r.OBJECT_TYPE_DEFINITION = "ObjectTypeDefinition", r.FIELD_DEFINITION = "FieldDefinition", r.INPUT_VALUE_DEFINITION = "InputValueDefinition", r.INTERFACE_TYPE_DEFINITION = "InterfaceTypeDefinition", r.UNION_TYPE_DEFINITION = "UnionTypeDefinition", r.ENUM_TYPE_DEFINITION = "EnumTypeDefinition", r.ENUM_VALUE_DEFINITION = "EnumValueDefinition", r.INPUT_OBJECT_TYPE_DEFINITION = "InputObjectTypeDefinition", r.DIRECTIVE_DEFINITION = "DirectiveDefinition", r.SCHEMA_EXTENSION = "SchemaExtension", r.SCALAR_TYPE_EXTENSION = "ScalarTypeExtension", r.OBJECT_TYPE_EXTENSION = "ObjectTypeExtension", r.INTERFACE_TYPE_EXTENSION = "InterfaceTypeExtension", r.UNION_TYPE_EXTENSION = "UnionTypeExtension", r.ENUM_TYPE_EXTENSION = "EnumTypeExtension", r.INPUT_OBJECT_TYPE_EXTENSION = "InputObjectTypeExtension";
})(U || (U = {}));
function Ii(r) {
  return r === 9 || r === 32;
}
function Br(r) {
  return r >= 48 && r <= 57;
}
function Ka(r) {
  return r >= 97 && r <= 122 || // A-Z
  r >= 65 && r <= 90;
}
function za(r) {
  return Ka(r) || r === 95;
}
function Kl(r) {
  return Ka(r) || Br(r) || r === 95;
}
function zl(r) {
  var e;
  let t = Number.MAX_SAFE_INTEGER, n = null, i = -1;
  for (let o = 0; o < r.length; ++o) {
    var s;
    const a = r[o], l = Gl(a);
    l !== a.length && (n = (s = n) !== null && s !== void 0 ? s : o, i = o, o !== 0 && l < t && (t = l));
  }
  return r.map((o, a) => a === 0 ? o : o.slice(t)).slice(
    (e = n) !== null && e !== void 0 ? e : 0,
    i + 1
  );
}
function Gl(r) {
  let e = 0;
  for (; e < r.length && Ii(r.charCodeAt(e)); )
    ++e;
  return e;
}
function Jl(r, e) {
  const t = r.replace(/"""/g, '\\"""'), n = t.split(/\r\n|[\n\r]/g), i = n.length === 1, s = n.length > 1 && n.slice(1).every((m) => m.length === 0 || Ii(m.charCodeAt(0))), o = t.endsWith('\\"""'), a = r.endsWith('"') && !o, l = r.endsWith("\\"), h = a || l, c = (
    // add leading and trailing new lines only if it improves readability
    !i || r.length > 70 || h || s || o
  );
  let d = "";
  const p = i && Ii(r.charCodeAt(0));
  return (c && !p || s) && (d += `
`), d += t, (c || h) && (d += `
`), '"""' + d + '"""';
}
var C;
(function(r) {
  r.SOF = "<SOF>", r.EOF = "<EOF>", r.BANG = "!", r.DOLLAR = "$", r.AMP = "&", r.PAREN_L = "(", r.PAREN_R = ")", r.SPREAD = "...", r.COLON = ":", r.EQUALS = "=", r.AT = "@", r.BRACKET_L = "[", r.BRACKET_R = "]", r.BRACE_L = "{", r.PIPE = "|", r.BRACE_R = "}", r.NAME = "Name", r.INT = "Int", r.FLOAT = "Float", r.STRING = "String", r.BLOCK_STRING = "BlockString", r.COMMENT = "Comment";
})(C || (C = {}));
class Yl {
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
    const t = new Ha(C.SOF, 0, 0, 0, 0);
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
          const t = Zl(this, e.end);
          e.next = t, t.prev = e, e = t;
        }
      while (e.kind === C.COMMENT);
    return e;
  }
}
function Xl(r) {
  return r === C.BANG || r === C.DOLLAR || r === C.AMP || r === C.PAREN_L || r === C.PAREN_R || r === C.SPREAD || r === C.COLON || r === C.EQUALS || r === C.AT || r === C.BRACKET_L || r === C.BRACKET_R || r === C.BRACE_L || r === C.PIPE || r === C.BRACE_R;
}
function cr(r) {
  return r >= 0 && r <= 55295 || r >= 57344 && r <= 1114111;
}
function Rn(r, e) {
  return Ga(r.charCodeAt(e)) && Ja(r.charCodeAt(e + 1));
}
function Ga(r) {
  return r >= 55296 && r <= 56319;
}
function Ja(r) {
  return r >= 56320 && r <= 57343;
}
function Ut(r, e) {
  const t = r.source.body.codePointAt(e);
  if (t === void 0)
    return C.EOF;
  if (t >= 32 && t <= 126) {
    const n = String.fromCodePoint(t);
    return n === '"' ? `'"'` : `"${n}"`;
  }
  return "U+" + t.toString(16).toUpperCase().padStart(4, "0");
}
function ge(r, e, t, n, i) {
  const s = r.line, o = 1 + t - r.lineStart;
  return new Ha(e, t, n, s, o, i);
}
function Zl(r, e) {
  const t = r.source.body, n = t.length;
  let i = e;
  for (; i < n; ) {
    const s = t.charCodeAt(i);
    switch (s) {
      case 65279:
      case 9:
      case 32:
      case 44:
        ++i;
        continue;
      case 10:
        ++i, ++r.line, r.lineStart = i;
        continue;
      case 13:
        t.charCodeAt(i + 1) === 10 ? i += 2 : ++i, ++r.line, r.lineStart = i;
        continue;
      case 35:
        return eh(r, i);
      case 33:
        return ge(r, C.BANG, i, i + 1);
      case 36:
        return ge(r, C.DOLLAR, i, i + 1);
      case 38:
        return ge(r, C.AMP, i, i + 1);
      case 40:
        return ge(r, C.PAREN_L, i, i + 1);
      case 41:
        return ge(r, C.PAREN_R, i, i + 1);
      case 46:
        if (t.charCodeAt(i + 1) === 46 && t.charCodeAt(i + 2) === 46)
          return ge(r, C.SPREAD, i, i + 3);
        break;
      case 58:
        return ge(r, C.COLON, i, i + 1);
      case 61:
        return ge(r, C.EQUALS, i, i + 1);
      case 64:
        return ge(r, C.AT, i, i + 1);
      case 91:
        return ge(r, C.BRACKET_L, i, i + 1);
      case 93:
        return ge(r, C.BRACKET_R, i, i + 1);
      case 123:
        return ge(r, C.BRACE_L, i, i + 1);
      case 124:
        return ge(r, C.PIPE, i, i + 1);
      case 125:
        return ge(r, C.BRACE_R, i, i + 1);
      case 34:
        return t.charCodeAt(i + 1) === 34 && t.charCodeAt(i + 2) === 34 ? oh(r, i) : rh(r, i);
    }
    if (Br(s) || s === 45)
      return th(r, i, s);
    if (za(s))
      return ah(r, i);
    throw Ee(
      r.source,
      i,
      s === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : cr(s) || Rn(t, i) ? `Unexpected character: ${Ut(r, i)}.` : `Invalid character: ${Ut(r, i)}.`
    );
  }
  return ge(r, C.EOF, n, n);
}
function eh(r, e) {
  const t = r.source.body, n = t.length;
  let i = e + 1;
  for (; i < n; ) {
    const s = t.charCodeAt(i);
    if (s === 10 || s === 13)
      break;
    if (cr(s))
      ++i;
    else if (Rn(t, i))
      i += 2;
    else
      break;
  }
  return ge(
    r,
    C.COMMENT,
    e,
    i,
    t.slice(e + 1, i)
  );
}
function th(r, e, t) {
  const n = r.source.body;
  let i = e, s = t, o = !1;
  if (s === 45 && (s = n.charCodeAt(++i)), s === 48) {
    if (s = n.charCodeAt(++i), Br(s))
      throw Ee(
        r.source,
        i,
        `Invalid number, unexpected digit after 0: ${Ut(
          r,
          i
        )}.`
      );
  } else
    i = ei(r, i, s), s = n.charCodeAt(i);
  if (s === 46 && (o = !0, s = n.charCodeAt(++i), i = ei(r, i, s), s = n.charCodeAt(i)), (s === 69 || s === 101) && (o = !0, s = n.charCodeAt(++i), (s === 43 || s === 45) && (s = n.charCodeAt(++i)), i = ei(r, i, s), s = n.charCodeAt(i)), s === 46 || za(s))
    throw Ee(
      r.source,
      i,
      `Invalid number, expected digit but got: ${Ut(
        r,
        i
      )}.`
    );
  return ge(
    r,
    o ? C.FLOAT : C.INT,
    e,
    i,
    n.slice(e, i)
  );
}
function ei(r, e, t) {
  if (!Br(t))
    throw Ee(
      r.source,
      e,
      `Invalid number, expected digit but got: ${Ut(
        r,
        e
      )}.`
    );
  const n = r.source.body;
  let i = e + 1;
  for (; Br(n.charCodeAt(i)); )
    ++i;
  return i;
}
function rh(r, e) {
  const t = r.source.body, n = t.length;
  let i = e + 1, s = i, o = "";
  for (; i < n; ) {
    const a = t.charCodeAt(i);
    if (a === 34)
      return o += t.slice(s, i), ge(r, C.STRING, e, i + 1, o);
    if (a === 92) {
      o += t.slice(s, i);
      const l = t.charCodeAt(i + 1) === 117 ? t.charCodeAt(i + 2) === 123 ? nh(r, i) : ih(r, i) : sh(r, i);
      o += l.value, i += l.size, s = i;
      continue;
    }
    if (a === 10 || a === 13)
      break;
    if (cr(a))
      ++i;
    else if (Rn(t, i))
      i += 2;
    else
      throw Ee(
        r.source,
        i,
        `Invalid character within String: ${Ut(
          r,
          i
        )}.`
      );
  }
  throw Ee(r.source, i, "Unterminated string.");
}
function nh(r, e) {
  const t = r.source.body;
  let n = 0, i = 3;
  for (; i < 12; ) {
    const s = t.charCodeAt(e + i++);
    if (s === 125) {
      if (i < 5 || !cr(n))
        break;
      return {
        value: String.fromCodePoint(n),
        size: i
      };
    }
    if (n = n << 4 | Tr(s), n < 0)
      break;
  }
  throw Ee(
    r.source,
    e,
    `Invalid Unicode escape sequence: "${t.slice(
      e,
      e + i
    )}".`
  );
}
function ih(r, e) {
  const t = r.source.body, n = lo(t, e + 2);
  if (cr(n))
    return {
      value: String.fromCodePoint(n),
      size: 6
    };
  if (Ga(n) && t.charCodeAt(e + 6) === 92 && t.charCodeAt(e + 7) === 117) {
    const i = lo(t, e + 8);
    if (Ja(i))
      return {
        value: String.fromCodePoint(n, i),
        size: 12
      };
  }
  throw Ee(
    r.source,
    e,
    `Invalid Unicode escape sequence: "${t.slice(e, e + 6)}".`
  );
}
function lo(r, e) {
  return Tr(r.charCodeAt(e)) << 12 | Tr(r.charCodeAt(e + 1)) << 8 | Tr(r.charCodeAt(e + 2)) << 4 | Tr(r.charCodeAt(e + 3));
}
function Tr(r) {
  return r >= 48 && r <= 57 ? r - 48 : r >= 65 && r <= 70 ? r - 55 : r >= 97 && r <= 102 ? r - 87 : -1;
}
function sh(r, e) {
  const t = r.source.body;
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
    r.source,
    e,
    `Invalid character escape sequence: "${t.slice(
      e,
      e + 2
    )}".`
  );
}
function oh(r, e) {
  const t = r.source.body, n = t.length;
  let i = r.lineStart, s = e + 3, o = s, a = "";
  const l = [];
  for (; s < n; ) {
    const h = t.charCodeAt(s);
    if (h === 34 && t.charCodeAt(s + 1) === 34 && t.charCodeAt(s + 2) === 34) {
      a += t.slice(o, s), l.push(a);
      const c = ge(
        r,
        C.BLOCK_STRING,
        e,
        s + 3,
        // Return a string of the lines joined with U+000A.
        zl(l).join(`
`)
      );
      return r.line += l.length - 1, r.lineStart = i, c;
    }
    if (h === 92 && t.charCodeAt(s + 1) === 34 && t.charCodeAt(s + 2) === 34 && t.charCodeAt(s + 3) === 34) {
      a += t.slice(o, s), o = s + 1, s += 4;
      continue;
    }
    if (h === 10 || h === 13) {
      a += t.slice(o, s), l.push(a), h === 13 && t.charCodeAt(s + 1) === 10 ? s += 2 : ++s, a = "", o = s, i = s;
      continue;
    }
    if (cr(h))
      ++s;
    else if (Rn(t, s))
      s += 2;
    else
      throw Ee(
        r.source,
        s,
        `Invalid character within String: ${Ut(
          r,
          s
        )}.`
      );
  }
  throw Ee(r.source, s, "Unterminated string.");
}
function ah(r, e) {
  const t = r.source.body, n = t.length;
  let i = e + 1;
  for (; i < n; ) {
    const s = t.charCodeAt(i);
    if (Kl(s))
      ++i;
    else
      break;
  }
  return ge(
    r,
    C.NAME,
    e,
    i,
    t.slice(e, i)
  );
}
const uh = 10, Ya = 2;
function ts(r) {
  return Nn(r, []);
}
function Nn(r, e) {
  switch (typeof r) {
    case "string":
      return JSON.stringify(r);
    case "function":
      return r.name ? `[function ${r.name}]` : "[function]";
    case "object":
      return ch(r, e);
    default:
      return String(r);
  }
}
function ch(r, e) {
  if (r === null)
    return "null";
  if (e.includes(r))
    return "[Circular]";
  const t = [...e, r];
  if (lh(r)) {
    const n = r.toJSON();
    if (n !== r)
      return typeof n == "string" ? n : Nn(n, t);
  } else if (Array.isArray(r))
    return fh(r, t);
  return hh(r, t);
}
function lh(r) {
  return typeof r.toJSON == "function";
}
function hh(r, e) {
  const t = Object.entries(r);
  return t.length === 0 ? "{}" : e.length > Ya ? "[" + ph(r) + "]" : "{ " + t.map(
    ([i, s]) => i + ": " + Nn(s, e)
  ).join(", ") + " }";
}
function fh(r, e) {
  if (r.length === 0)
    return "[]";
  if (e.length > Ya)
    return "[Array]";
  const t = Math.min(uh, r.length), n = r.length - t, i = [];
  for (let s = 0; s < t; ++s)
    i.push(Nn(r[s], e));
  return n === 1 ? i.push("... 1 more item") : n > 1 && i.push(`... ${n} more items`), "[" + i.join(", ") + "]";
}
function ph(r) {
  const e = Object.prototype.toString.call(r).replace(/^\[object /, "").replace(/]$/, "");
  if (e === "Object" && typeof r.constructor == "function") {
    const t = r.constructor.name;
    if (typeof t == "string" && t !== "")
      return t;
  }
  return e;
}
const dh = globalThis.process && // eslint-disable-next-line no-undef
!0 === "production", yh = (
  /* c8 ignore next 6 */
  // FIXME: https://github.com/graphql/graphql-js/issues/2317
  dh ? function(e, t) {
    return e instanceof t;
  } : function(e, t) {
    if (e instanceof t)
      return !0;
    if (typeof e == "object" && e !== null) {
      var n;
      const i = t.prototype[Symbol.toStringTag], s = (
        // We still need to support constructor's name to detect conflicts with older versions of this library.
        Symbol.toStringTag in e ? e[Symbol.toStringTag] : (n = e.constructor) === null || n === void 0 ? void 0 : n.name
      );
      if (i === s) {
        const o = ts(e);
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
class rs {
  constructor(e, t = "GraphQL request", n = {
    line: 1,
    column: 1
  }) {
    typeof e == "string" || hn(!1, `Body must be a string. Received: ${ts(e)}.`), this.body = e, this.name = t, this.locationOffset = n, this.locationOffset.line > 0 || hn(
      !1,
      "line in locationOffset is 1-indexed and must be positive."
    ), this.locationOffset.column > 0 || hn(
      !1,
      "column in locationOffset is 1-indexed and must be positive."
    );
  }
  get [Symbol.toStringTag]() {
    return "Source";
  }
}
function mh(r) {
  return yh(r, rs);
}
function gh(r, e) {
  return new vh(r, e).parseDocument();
}
class vh {
  constructor(e, t = {}) {
    const n = mh(e) ? e : new rs(e);
    this._lexer = new Yl(n), this._options = t, this._tokenCounter = 0;
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
        operation: Jt.QUERY,
        name: void 0,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet()
      });
    const t = this.parseOperationType();
    let n;
    return this.peek(C.NAME) && (n = this.parseName()), this.node(e, {
      kind: U.OPERATION_DEFINITION,
      operation: t,
      name: n,
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
        return Jt.QUERY;
      case "mutation":
        return Jt.MUTATION;
      case "subscription":
        return Jt.SUBSCRIPTION;
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
    let n, i;
    return this.expectOptionalToken(C.COLON) ? (n = t, i = this.parseName()) : i = t, this.node(e, {
      kind: U.FIELD,
      alias: n,
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
    const t = this._lexer.token, n = this.parseName();
    return this.expectToken(C.COLON), this.node(t, {
      kind: U.ARGUMENT,
      name: n,
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
            const n = this._lexer.token.value;
            throw Ee(
              this._lexer.source,
              t.start,
              `Unexpected variable "$${n}" in constant value.`
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
    const t = this._lexer.token, n = this.parseName();
    return this.expectToken(C.COLON), this.node(t, {
      kind: U.OBJECT_FIELD,
      name: n,
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
      const n = this.parseTypeReference();
      this.expectToken(C.BRACKET_R), t = this.node(e, {
        kind: U.LIST_TYPE,
        type: n
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
    const n = this.parseConstDirectives(), i = this.many(
      C.BRACE_L,
      this.parseOperationTypeDefinition,
      C.BRACE_R
    );
    return this.node(e, {
      kind: U.SCHEMA_DEFINITION,
      description: t,
      directives: n,
      operationTypes: i
    });
  }
  /**
   * OperationTypeDefinition : OperationType : NamedType
   */
  parseOperationTypeDefinition() {
    const e = this._lexer.token, t = this.parseOperationType();
    this.expectToken(C.COLON);
    const n = this.parseNamedType();
    return this.node(e, {
      kind: U.OPERATION_TYPE_DEFINITION,
      operation: t,
      type: n
    });
  }
  /**
   * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
   */
  parseScalarTypeDefinition() {
    const e = this._lexer.token, t = this.parseDescription();
    this.expectKeyword("scalar");
    const n = this.parseName(), i = this.parseConstDirectives();
    return this.node(e, {
      kind: U.SCALAR_TYPE_DEFINITION,
      description: t,
      name: n,
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
    const n = this.parseName(), i = this.parseImplementsInterfaces(), s = this.parseConstDirectives(), o = this.parseFieldsDefinition();
    return this.node(e, {
      kind: U.OBJECT_TYPE_DEFINITION,
      description: t,
      name: n,
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
    const e = this._lexer.token, t = this.parseDescription(), n = this.parseName(), i = this.parseArgumentDefs();
    this.expectToken(C.COLON);
    const s = this.parseTypeReference(), o = this.parseConstDirectives();
    return this.node(e, {
      kind: U.FIELD_DEFINITION,
      description: t,
      name: n,
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
    const e = this._lexer.token, t = this.parseDescription(), n = this.parseName();
    this.expectToken(C.COLON);
    const i = this.parseTypeReference();
    let s;
    this.expectOptionalToken(C.EQUALS) && (s = this.parseConstValueLiteral());
    const o = this.parseConstDirectives();
    return this.node(e, {
      kind: U.INPUT_VALUE_DEFINITION,
      description: t,
      name: n,
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
    const n = this.parseName(), i = this.parseImplementsInterfaces(), s = this.parseConstDirectives(), o = this.parseFieldsDefinition();
    return this.node(e, {
      kind: U.INTERFACE_TYPE_DEFINITION,
      description: t,
      name: n,
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
    const n = this.parseName(), i = this.parseConstDirectives(), s = this.parseUnionMemberTypes();
    return this.node(e, {
      kind: U.UNION_TYPE_DEFINITION,
      description: t,
      name: n,
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
    const n = this.parseName(), i = this.parseConstDirectives(), s = this.parseEnumValuesDefinition();
    return this.node(e, {
      kind: U.ENUM_TYPE_DEFINITION,
      description: t,
      name: n,
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
    const e = this._lexer.token, t = this.parseDescription(), n = this.parseEnumValueName(), i = this.parseConstDirectives();
    return this.node(e, {
      kind: U.ENUM_VALUE_DEFINITION,
      description: t,
      name: n,
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
        `${rn(
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
    const n = this.parseName(), i = this.parseConstDirectives(), s = this.parseInputFieldsDefinition();
    return this.node(e, {
      kind: U.INPUT_OBJECT_TYPE_DEFINITION,
      description: t,
      name: n,
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
    const t = this.parseConstDirectives(), n = this.optionalMany(
      C.BRACE_L,
      this.parseOperationTypeDefinition,
      C.BRACE_R
    );
    if (t.length === 0 && n.length === 0)
      throw this.unexpected();
    return this.node(e, {
      kind: U.SCHEMA_EXTENSION,
      directives: t,
      operationTypes: n
    });
  }
  /**
   * ScalarTypeExtension :
   *   - extend scalar Name Directives[Const]
   */
  parseScalarTypeExtension() {
    const e = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("scalar");
    const t = this.parseName(), n = this.parseConstDirectives();
    if (n.length === 0)
      throw this.unexpected();
    return this.node(e, {
      kind: U.SCALAR_TYPE_EXTENSION,
      name: t,
      directives: n
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
    const t = this.parseName(), n = this.parseImplementsInterfaces(), i = this.parseConstDirectives(), s = this.parseFieldsDefinition();
    if (n.length === 0 && i.length === 0 && s.length === 0)
      throw this.unexpected();
    return this.node(e, {
      kind: U.OBJECT_TYPE_EXTENSION,
      name: t,
      interfaces: n,
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
    const t = this.parseName(), n = this.parseImplementsInterfaces(), i = this.parseConstDirectives(), s = this.parseFieldsDefinition();
    if (n.length === 0 && i.length === 0 && s.length === 0)
      throw this.unexpected();
    return this.node(e, {
      kind: U.INTERFACE_TYPE_EXTENSION,
      name: t,
      interfaces: n,
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
    const t = this.parseName(), n = this.parseConstDirectives(), i = this.parseUnionMemberTypes();
    if (n.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(e, {
      kind: U.UNION_TYPE_EXTENSION,
      name: t,
      directives: n,
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
    const t = this.parseName(), n = this.parseConstDirectives(), i = this.parseEnumValuesDefinition();
    if (n.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(e, {
      kind: U.ENUM_TYPE_EXTENSION,
      name: t,
      directives: n,
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
    const t = this.parseName(), n = this.parseConstDirectives(), i = this.parseInputFieldsDefinition();
    if (n.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(e, {
      kind: U.INPUT_OBJECT_TYPE_EXTENSION,
      name: t,
      directives: n,
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
    const n = this.parseName(), i = this.parseArgumentDefs(), s = this.expectOptionalKeyword("repeatable");
    this.expectKeyword("on");
    const o = this.parseDirectiveLocations();
    return this.node(e, {
      kind: U.DIRECTIVE_DEFINITION,
      description: t,
      name: n,
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
    if (Object.prototype.hasOwnProperty.call(Ai, t.value))
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
    return this._options.noLocation !== !0 && (t.loc = new Hl(
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
      `Expected ${Xa(e)}, found ${rn(t)}.`
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
        `Expected "${e}", found ${rn(t)}.`
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
      `Unexpected ${rn(t)}.`
    );
  }
  /**
   * Returns a possibly empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  any(e, t, n) {
    this.expectToken(e);
    const i = [];
    for (; !this.expectOptionalToken(n); )
      i.push(t.call(this));
    return i;
  }
  /**
   * Returns a list of parse nodes, determined by the parseFn.
   * It can be empty only if open token is missing otherwise it will always return non-empty list
   * that begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  optionalMany(e, t, n) {
    if (this.expectOptionalToken(e)) {
      const i = [];
      do
        i.push(t.call(this));
      while (!this.expectOptionalToken(n));
      return i;
    }
    return [];
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  many(e, t, n) {
    this.expectToken(e);
    const i = [];
    do
      i.push(t.call(this));
    while (!this.expectOptionalToken(n));
    return i;
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list may begin with a lex token of delimiterKind followed by items separated by lex tokens of tokenKind.
   * Advances the parser to the next lex token after last item in the list.
   */
  delimitedMany(e, t) {
    this.expectOptionalToken(e);
    const n = [];
    do
      n.push(t.call(this));
    while (this.expectOptionalToken(e));
    return n;
  }
  advanceLexer() {
    const { maxTokens: e } = this._options, t = this._lexer.advance();
    if (e !== void 0 && t.kind !== C.EOF && (++this._tokenCounter, this._tokenCounter > e))
      throw Ee(
        this._lexer.source,
        t.start,
        `Document contains more that ${e} tokens. Parsing aborted.`
      );
  }
}
function rn(r) {
  const e = r.value;
  return Xa(r.kind) + (e != null ? ` "${e}"` : "");
}
function Xa(r) {
  return Xl(r) ? `"${r}"` : r;
}
function bh(r) {
  return `"${r.replace(wh, _h)}"`;
}
const wh = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
function _h(r) {
  return Eh[r.charCodeAt(0)];
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
], Za = Object.freeze({});
function nt(r, e, t = Wa) {
  const n = /* @__PURE__ */ new Map();
  for (const E of Object.values(U))
    n.set(E, Sh(e, E));
  let i, s = Array.isArray(r), o = [r], a = -1, l = [], h = r, c, d;
  const p = [], m = [];
  do {
    a++;
    const E = a === o.length, T = E && l.length !== 0;
    if (E) {
      if (c = m.length === 0 ? void 0 : p[p.length - 1], h = d, d = m.pop(), T)
        if (s) {
          h = h.slice();
          let A = 0;
          for (const [R, N] of l) {
            const F = R - A;
            N === null ? (h.splice(F, 1), A++) : h[F] = N;
          }
        } else {
          h = Object.defineProperties(
            {},
            Object.getOwnPropertyDescriptors(h)
          );
          for (const [A, R] of l)
            h[A] = R;
        }
      a = i.index, o = i.keys, l = i.edits, s = i.inArray, i = i.prev;
    } else if (d) {
      if (c = s ? a : o[a], h = d[c], h == null)
        continue;
      p.push(c);
    }
    let I;
    if (!Array.isArray(h)) {
      var v, w;
      co(h) || hn(!1, `Invalid AST Node: ${ts(h)}.`);
      const A = E ? (v = n.get(h.kind)) === null || v === void 0 ? void 0 : v.leave : (w = n.get(h.kind)) === null || w === void 0 ? void 0 : w.enter;
      if (I = A?.call(e, h, c, d, p, m), I === Za)
        break;
      if (I === !1) {
        if (!E) {
          p.pop();
          continue;
        }
      } else if (I !== void 0 && (l.push([c, I]), !E))
        if (co(I))
          h = I;
        else {
          p.pop();
          continue;
        }
    }
    if (I === void 0 && T && l.push([c, h]), E)
      p.pop();
    else {
      var _;
      i = {
        inArray: s,
        index: a,
        keys: o,
        edits: l,
        prev: i
      }, s = Array.isArray(h), o = s ? h : (_ = t[h.kind]) !== null && _ !== void 0 ? _ : [], a = -1, l = [], d && m.push(d), d = h;
    }
  } while (i !== void 0);
  return l.length !== 0 ? l[l.length - 1][1] : r;
}
function Sh(r, e) {
  const t = r[e];
  return typeof t == "object" ? t : typeof t == "function" ? {
    enter: t,
    leave: void 0
  } : {
    enter: r.enter,
    leave: r.leave
  };
}
function ns(r) {
  return nt(r, xh);
}
const kh = 80, xh = {
  Name: {
    leave: (r) => r.value
  },
  Variable: {
    leave: (r) => "$" + r.name
  },
  // Document
  Document: {
    leave: (r) => $(r.definitions, `

`)
  },
  OperationDefinition: {
    leave(r) {
      const e = K("(", $(r.variableDefinitions, ", "), ")"), t = $(
        [
          r.operation,
          $([r.name, e]),
          $(r.directives, " ")
        ],
        " "
      );
      return (t === "query" ? "" : t + " ") + r.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable: r, type: e, defaultValue: t, directives: n }) => r + ": " + e + K(" = ", t) + K(" ", $(n, " "))
  },
  SelectionSet: {
    leave: ({ selections: r }) => He(r)
  },
  Field: {
    leave({ alias: r, name: e, arguments: t, directives: n, selectionSet: i }) {
      const s = K("", r, ": ") + e;
      let o = s + K("(", $(t, ", "), ")");
      return o.length > kh && (o = s + K(`(
`, fn($(t, `
`)), `
)`)), $([o, $(n, " "), i], " ");
    }
  },
  Argument: {
    leave: ({ name: r, value: e }) => r + ": " + e
  },
  // Fragments
  FragmentSpread: {
    leave: ({ name: r, directives: e }) => "..." + r + K(" ", $(e, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition: r, directives: e, selectionSet: t }) => $(
      [
        "...",
        K("on ", r),
        $(e, " "),
        t
      ],
      " "
    )
  },
  FragmentDefinition: {
    leave: ({ name: r, typeCondition: e, variableDefinitions: t, directives: n, selectionSet: i }) => (
      // or removed in the future.
      `fragment ${r}${K("(", $(t, ", "), ")")} on ${e} ${K("", $(n, " "), " ")}` + i
    )
  },
  // Value
  IntValue: {
    leave: ({ value: r }) => r
  },
  FloatValue: {
    leave: ({ value: r }) => r
  },
  StringValue: {
    leave: ({ value: r, block: e }) => e ? Jl(r) : bh(r)
  },
  BooleanValue: {
    leave: ({ value: r }) => r ? "true" : "false"
  },
  NullValue: {
    leave: () => "null"
  },
  EnumValue: {
    leave: ({ value: r }) => r
  },
  ListValue: {
    leave: ({ values: r }) => "[" + $(r, ", ") + "]"
  },
  ObjectValue: {
    leave: ({ fields: r }) => "{" + $(r, ", ") + "}"
  },
  ObjectField: {
    leave: ({ name: r, value: e }) => r + ": " + e
  },
  // Directive
  Directive: {
    leave: ({ name: r, arguments: e }) => "@" + r + K("(", $(e, ", "), ")")
  },
  // Type
  NamedType: {
    leave: ({ name: r }) => r
  },
  ListType: {
    leave: ({ type: r }) => "[" + r + "]"
  },
  NonNullType: {
    leave: ({ type: r }) => r + "!"
  },
  // Type System Definitions
  SchemaDefinition: {
    leave: ({ description: r, directives: e, operationTypes: t }) => K("", r, `
`) + $(["schema", $(e, " "), He(t)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation: r, type: e }) => r + ": " + e
  },
  ScalarTypeDefinition: {
    leave: ({ description: r, name: e, directives: t }) => K("", r, `
`) + $(["scalar", e, $(t, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ description: r, name: e, interfaces: t, directives: n, fields: i }) => K("", r, `
`) + $(
      [
        "type",
        e,
        K("implements ", $(t, " & ")),
        $(n, " "),
        He(i)
      ],
      " "
    )
  },
  FieldDefinition: {
    leave: ({ description: r, name: e, arguments: t, type: n, directives: i }) => K("", r, `
`) + e + (ho(t) ? K(`(
`, fn($(t, `
`)), `
)`) : K("(", $(t, ", "), ")")) + ": " + n + K(" ", $(i, " "))
  },
  InputValueDefinition: {
    leave: ({ description: r, name: e, type: t, defaultValue: n, directives: i }) => K("", r, `
`) + $(
      [e + ": " + t, K("= ", n), $(i, " ")],
      " "
    )
  },
  InterfaceTypeDefinition: {
    leave: ({ description: r, name: e, interfaces: t, directives: n, fields: i }) => K("", r, `
`) + $(
      [
        "interface",
        e,
        K("implements ", $(t, " & ")),
        $(n, " "),
        He(i)
      ],
      " "
    )
  },
  UnionTypeDefinition: {
    leave: ({ description: r, name: e, directives: t, types: n }) => K("", r, `
`) + $(
      ["union", e, $(t, " "), K("= ", $(n, " | "))],
      " "
    )
  },
  EnumTypeDefinition: {
    leave: ({ description: r, name: e, directives: t, values: n }) => K("", r, `
`) + $(["enum", e, $(t, " "), He(n)], " ")
  },
  EnumValueDefinition: {
    leave: ({ description: r, name: e, directives: t }) => K("", r, `
`) + $([e, $(t, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ description: r, name: e, directives: t, fields: n }) => K("", r, `
`) + $(["input", e, $(t, " "), He(n)], " ")
  },
  DirectiveDefinition: {
    leave: ({ description: r, name: e, arguments: t, repeatable: n, locations: i }) => K("", r, `
`) + "directive @" + e + (ho(t) ? K(`(
`, fn($(t, `
`)), `
)`) : K("(", $(t, ", "), ")")) + (n ? " repeatable" : "") + " on " + $(i, " | ")
  },
  SchemaExtension: {
    leave: ({ directives: r, operationTypes: e }) => $(
      ["extend schema", $(r, " "), He(e)],
      " "
    )
  },
  ScalarTypeExtension: {
    leave: ({ name: r, directives: e }) => $(["extend scalar", r, $(e, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name: r, interfaces: e, directives: t, fields: n }) => $(
      [
        "extend type",
        r,
        K("implements ", $(e, " & ")),
        $(t, " "),
        He(n)
      ],
      " "
    )
  },
  InterfaceTypeExtension: {
    leave: ({ name: r, interfaces: e, directives: t, fields: n }) => $(
      [
        "extend interface",
        r,
        K("implements ", $(e, " & ")),
        $(t, " "),
        He(n)
      ],
      " "
    )
  },
  UnionTypeExtension: {
    leave: ({ name: r, directives: e, types: t }) => $(
      [
        "extend union",
        r,
        $(e, " "),
        K("= ", $(t, " | "))
      ],
      " "
    )
  },
  EnumTypeExtension: {
    leave: ({ name: r, directives: e, values: t }) => $(["extend enum", r, $(e, " "), He(t)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name: r, directives: e, fields: t }) => $(["extend input", r, $(e, " "), He(t)], " ")
  }
};
function $(r, e = "") {
  var t;
  return (t = r?.filter((n) => n).join(e)) !== null && t !== void 0 ? t : "";
}
function He(r) {
  return K(`{
`, fn($(r, `
`)), `
}`);
}
function K(r, e, t = "") {
  return e != null && e !== "" ? r + e + t : "";
}
function fn(r) {
  return K("  ", r.replace(/\n/g, `
  `));
}
function ho(r) {
  var e;
  return (e = r?.some((t) => t.includes(`
`))) !== null && e !== void 0 ? e : !1;
}
function Th() {
  return oo();
}
function Ah() {
  __DEV__ ? D(typeof Zn == "boolean", Zn) : D(typeof Zn == "boolean", 36);
}
Th();
Ah();
function Dn(r, e) {
  var t = r.directives;
  return !t || !t.length ? !0 : Rh(t).every(function(n) {
    var i = n.directive, s = n.ifArgument, o = !1;
    return s.value.kind === "Variable" ? (o = e && e[s.value.name.value], __DEV__ ? D(o !== void 0, "Invalid variable referenced in @".concat(i.name.value, " directive.")) : D(o !== void 0, 37)) : o = s.value.value, i.name.value === "skip" ? !o : o;
  });
}
function Ih(r) {
  var e = [];
  return nt(r, {
    Directive: function(t) {
      e.push(t.name.value);
    }
  }), e;
}
function Oi(r, e) {
  return Ih(e).some(function(t) {
    return r.indexOf(t) > -1;
  });
}
function Oh(r) {
  return r && Oi(["client"], r) && Oi(["export"], r);
}
function Ch(r) {
  var e = r.name.value;
  return e === "skip" || e === "include";
}
function Rh(r) {
  var e = [];
  return r && r.length && r.forEach(function(t) {
    if (Ch(t)) {
      var n = t.arguments, i = t.name.value;
      __DEV__ ? D(n && n.length === 1, "Incorrect number of arguments for the @".concat(i, " directive.")) : D(n && n.length === 1, 38);
      var s = n[0];
      __DEV__ ? D(s.name && s.name.value === "if", "Invalid argument for the @".concat(i, " directive.")) : D(s.name && s.name.value === "if", 39);
      var o = s.value;
      __DEV__ ? D(o && (o.kind === "Variable" || o.kind === "BooleanValue"), "Argument for the @".concat(i, " directive must be a variable or a boolean value.")) : D(o && (o.kind === "Variable" || o.kind === "BooleanValue"), 40), e.push({ directive: t, ifArgument: s });
    }
  }), e;
}
function Nh(r, e) {
  var t = e, n = [];
  r.definitions.forEach(function(s) {
    if (s.kind === "OperationDefinition")
      throw __DEV__ ? new re("Found a ".concat(s.operation, " operation").concat(s.name ? " named '".concat(s.name.value, "'") : "", ". ") + "No operations are allowed when using a fragment as a query. Only fragments are allowed.") : new re(41);
    s.kind === "FragmentDefinition" && n.push(s);
  }), typeof t > "u" && (__DEV__ ? D(n.length === 1, "Found ".concat(n.length, " fragments. `fragmentName` must be provided when there is not exactly 1 fragment.")) : D(n.length === 1, 42), t = n[0].name.value);
  var i = x(x({}, r), { definitions: En([
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
  ], r.definitions, !0) });
  return i;
}
function Fn(r) {
  r === void 0 && (r = []);
  var e = {};
  return r.forEach(function(t) {
    e[t.name.value] = t;
  }), e;
}
function is(r, e) {
  switch (r.kind) {
    case "InlineFragment":
      return r;
    case "FragmentSpread": {
      var t = e && e[r.name.value];
      return __DEV__ ? D(t, "No fragment named ".concat(r.name.value, ".")) : D(t, 43), t;
    }
    default:
      return null;
  }
}
function ue(r) {
  return r !== null && typeof r == "object";
}
function tr(r) {
  return { __ref: String(r) };
}
function Z(r) {
  return !!(r && typeof r == "object" && typeof r.__ref == "string");
}
function Dh(r) {
  return ue(r) && r.kind === "Document" && Array.isArray(r.definitions);
}
function Fh(r) {
  return r.kind === "StringValue";
}
function Mh(r) {
  return r.kind === "BooleanValue";
}
function $h(r) {
  return r.kind === "IntValue";
}
function Bh(r) {
  return r.kind === "FloatValue";
}
function Ph(r) {
  return r.kind === "Variable";
}
function Lh(r) {
  return r.kind === "ObjectValue";
}
function Uh(r) {
  return r.kind === "ListValue";
}
function qh(r) {
  return r.kind === "EnumValue";
}
function jh(r) {
  return r.kind === "NullValue";
}
function sr(r, e, t, n) {
  if ($h(t) || Bh(t))
    r[e.value] = Number(t.value);
  else if (Mh(t) || Fh(t))
    r[e.value] = t.value;
  else if (Lh(t)) {
    var i = {};
    t.fields.map(function(o) {
      return sr(i, o.name, o.value, n);
    }), r[e.value] = i;
  } else if (Ph(t)) {
    var s = (n || {})[t.name.value];
    r[e.value] = s;
  } else if (Uh(t))
    r[e.value] = t.values.map(function(o) {
      var a = {};
      return sr(a, e, o, n), a[e.value];
    });
  else if (qh(t))
    r[e.value] = t.value;
  else if (jh(t))
    r[e.value] = null;
  else
    throw __DEV__ ? new re('The inline argument "'.concat(e.value, '" of kind "').concat(t.kind, '"') + "is not supported. Use variables instead of inline arguments to overcome this limitation.") : new re(52);
}
function Vh(r, e) {
  var t = null;
  r.directives && (t = {}, r.directives.forEach(function(i) {
    t[i.name.value] = {}, i.arguments && i.arguments.forEach(function(s) {
      var o = s.name, a = s.value;
      return sr(t[i.name.value], o, a, e);
    });
  }));
  var n = null;
  return r.arguments && r.arguments.length && (n = {}, r.arguments.forEach(function(i) {
    var s = i.name, o = i.value;
    return sr(n, s, o, e);
  })), ss(r.name.value, n, t);
}
var Qh = [
  "connection",
  "include",
  "skip",
  "client",
  "rest",
  "export"
], ss = Object.assign(function(r, e, t) {
  if (e && t && t.connection && t.connection.key)
    if (t.connection.filter && t.connection.filter.length > 0) {
      var n = t.connection.filter ? t.connection.filter : [];
      n.sort();
      var i = {};
      return n.forEach(function(a) {
        i[a] = e[a];
      }), "".concat(t.connection.key, "(").concat(wr(i), ")");
    } else
      return t.connection.key;
  var s = r;
  if (e) {
    var o = wr(e);
    s += "(".concat(o, ")");
  }
  return t && Object.keys(t).forEach(function(a) {
    Qh.indexOf(a) === -1 && (t[a] && Object.keys(t[a]).length ? s += "@".concat(a, "(").concat(wr(t[a]), ")") : s += "@".concat(a));
  }), s;
}, {
  setStringify: function(r) {
    var e = wr;
    return wr = r, e;
  }
}), wr = function(e) {
  return JSON.stringify(e, Hh);
};
function Hh(r, e) {
  return ue(e) && !Array.isArray(e) && (e = Object.keys(e).sort().reduce(function(t, n) {
    return t[n] = e[n], t;
  }, {})), e;
}
function Mn(r, e) {
  if (r.arguments && r.arguments.length) {
    var t = {};
    return r.arguments.forEach(function(n) {
      var i = n.name, s = n.value;
      return sr(t, i, s, e);
    }), t;
  }
  return null;
}
function qt(r) {
  return r.alias ? r.alias.value : r.name.value;
}
function Ci(r, e, t) {
  if (typeof r.__typename == "string")
    return r.__typename;
  for (var n = 0, i = e.selections; n < i.length; n++) {
    var s = i[n];
    if (yt(s)) {
      if (s.name.value === "__typename")
        return r[qt(s)];
    } else {
      var o = Ci(r, is(s, t).selectionSet, t);
      if (typeof o == "string")
        return o;
    }
  }
}
function yt(r) {
  return r.kind === "Field";
}
function eu(r) {
  return r.kind === "InlineFragment";
}
function Wr(r) {
  __DEV__ ? D(r && r.kind === "Document", 'Expecting a parsed GraphQL document. Perhaps you need to wrap the query string in a "gql" tag? http://docs.apollostack.com/apollo-client/core.html#gql') : D(r && r.kind === "Document", 44);
  var e = r.definitions.filter(function(t) {
    return t.kind !== "FragmentDefinition";
  }).map(function(t) {
    if (t.kind !== "OperationDefinition")
      throw __DEV__ ? new re('Schema type definitions not allowed in queries. Found: "'.concat(t.kind, '"')) : new re(45);
    return t;
  });
  return __DEV__ ? D(e.length <= 1, "Ambiguous GraphQL document: contains ".concat(e.length, " operations")) : D(e.length <= 1, 46), r;
}
function Kr(r) {
  return Wr(r), r.definitions.filter(function(e) {
    return e.kind === "OperationDefinition";
  })[0];
}
function Ri(r) {
  return r.definitions.filter(function(e) {
    return e.kind === "OperationDefinition" && e.name;
  }).map(function(e) {
    return e.name.value;
  })[0] || null;
}
function $n(r) {
  return r.definitions.filter(function(e) {
    return e.kind === "FragmentDefinition";
  });
}
function tu(r) {
  var e = Kr(r);
  return __DEV__ ? D(e && e.operation === "query", "Must contain a query definition.") : D(e && e.operation === "query", 47), e;
}
function Wh(r) {
  __DEV__ ? D(r.kind === "Document", 'Expecting a parsed GraphQL document. Perhaps you need to wrap the query string in a "gql" tag? http://docs.apollostack.com/apollo-client/core.html#gql') : D(r.kind === "Document", 48), __DEV__ ? D(r.definitions.length <= 1, "Fragment must have exactly one definition.") : D(r.definitions.length <= 1, 49);
  var e = r.definitions[0];
  return __DEV__ ? D(e.kind === "FragmentDefinition", "Must be a fragment definition.") : D(e.kind === "FragmentDefinition", 50), e;
}
function Bn(r) {
  Wr(r);
  for (var e, t = 0, n = r.definitions; t < n.length; t++) {
    var i = n[t];
    if (i.kind === "OperationDefinition") {
      var s = i.operation;
      if (s === "query" || s === "mutation" || s === "subscription")
        return i;
    }
    i.kind === "FragmentDefinition" && !e && (e = i);
  }
  if (e)
    return e;
  throw __DEV__ ? new re("Expected a parsed GraphQL query with a query, mutation, subscription, or a fragment.") : new re(51);
}
function os(r) {
  var e = /* @__PURE__ */ Object.create(null), t = r && r.variableDefinitions;
  return t && t.length && t.forEach(function(n) {
    n.defaultValue && sr(e, n.variable.name, n.defaultValue);
  }), e;
}
function fo(r, e, t) {
  var n = 0;
  return r.forEach(function(i, s) {
    e.call(this, i, s, r) && (r[n++] = i);
  }, t), r.length = n, r;
}
var po = {
  kind: "Field",
  name: {
    kind: "Name",
    value: "__typename"
  }
};
function ru(r, e) {
  return r.selectionSet.selections.every(function(t) {
    return t.kind === "FragmentSpread" && ru(e[t.name.value], e);
  });
}
function as(r) {
  return ru(Kr(r) || Wh(r), Fn($n(r))) ? null : r;
}
function yo(r) {
  return function(t) {
    return r.some(function(n) {
      return n.name && n.name === t.name.value || n.test && n.test(t);
    });
  };
}
function nu(r, e) {
  var t = /* @__PURE__ */ Object.create(null), n = [], i = /* @__PURE__ */ Object.create(null), s = [], o = as(nt(e, {
    Variable: {
      enter: function(a, l, h) {
        h.kind !== "VariableDefinition" && (t[a.name.value] = !0);
      }
    },
    Field: {
      enter: function(a) {
        if (r && a.directives) {
          var l = r.some(function(h) {
            return h.remove;
          });
          if (l && a.directives && a.directives.some(yo(r)))
            return a.arguments && a.arguments.forEach(function(h) {
              h.value.kind === "Variable" && n.push({
                name: h.value.name.value
              });
            }), a.selectionSet && iu(a.selectionSet).forEach(function(h) {
              s.push({
                name: h.name.value
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
        if (yo(r)(a))
          return null;
      }
    }
  }));
  return o && fo(n, function(a) {
    return !!a.name && !t[a.name];
  }).length && (o = Jh(n, o)), o && fo(s, function(a) {
    return !!a.name && !i[a.name];
  }).length && (o = Yh(s, o)), o;
}
var us = Object.assign(function(r) {
  return nt(Wr(r), {
    SelectionSet: {
      enter: function(e, t, n) {
        if (!(n && n.kind === "OperationDefinition")) {
          var i = e.selections;
          if (i) {
            var s = i.some(function(a) {
              return yt(a) && (a.name.value === "__typename" || a.name.value.lastIndexOf("__", 0) === 0);
            });
            if (!s) {
              var o = n;
              if (!(yt(o) && o.directives && o.directives.some(function(a) {
                return a.name.value === "export";
              })))
                return x(x({}, e), { selections: En(En([], i, !0), [po], !1) });
            }
          }
        }
      }
    }
  });
}, {
  added: function(r) {
    return r === po;
  }
}), Kh = {
  test: function(r) {
    var e = r.name.value === "connection";
    return e && (!r.arguments || !r.arguments.some(function(t) {
      return t.name.value === "key";
    })) && __DEV__ && D.warn("Removing an @connection directive even though it does not have a key. You may want to use the key parameter to specify a store key."), e;
  }
};
function zh(r) {
  return nu([Kh], Wr(r));
}
function Gh(r) {
  return function(t) {
    return r.some(function(n) {
      return t.value && t.value.kind === "Variable" && t.value.name && (n.name === t.value.name.value || n.test && n.test(t));
    });
  };
}
function Jh(r, e) {
  var t = Gh(r);
  return as(nt(e, {
    OperationDefinition: {
      enter: function(n) {
        return x(x({}, n), { variableDefinitions: n.variableDefinitions ? n.variableDefinitions.filter(function(i) {
          return !r.some(function(s) {
            return s.name === i.variable.name.value;
          });
        }) : [] });
      }
    },
    Field: {
      enter: function(n) {
        var i = r.some(function(o) {
          return o.remove;
        });
        if (i) {
          var s = 0;
          if (n.arguments && n.arguments.forEach(function(o) {
            t(o) && (s += 1);
          }), s === 1)
            return null;
        }
      }
    },
    Argument: {
      enter: function(n) {
        if (t(n))
          return null;
      }
    }
  }));
}
function Yh(r, e) {
  function t(n) {
    if (r.some(function(i) {
      return i.name === n.name.value;
    }))
      return null;
  }
  return as(nt(e, {
    FragmentSpread: { enter: t },
    FragmentDefinition: { enter: t }
  }));
}
function iu(r) {
  var e = [];
  return r.selections.forEach(function(t) {
    (yt(t) || eu(t)) && t.selectionSet ? iu(t.selectionSet).forEach(function(n) {
      return e.push(n);
    }) : t.kind === "FragmentSpread" && e.push(t);
  }), e;
}
function Xh(r) {
  var e = Bn(r), t = e.operation;
  if (t === "query")
    return r;
  var n = nt(r, {
    OperationDefinition: {
      enter: function(i) {
        return x(x({}, i), { operation: "query" });
      }
    }
  });
  return n;
}
function Zh(r) {
  Wr(r);
  var e = nu([
    {
      test: function(t) {
        return t.name.value === "client";
      },
      remove: !0
    }
  ], r);
  return e && (e = nt(e, {
    FragmentDefinition: {
      enter: function(t) {
        if (t.selectionSet) {
          var n = t.selectionSet.selections.every(function(i) {
            return yt(i) && i.name.value === "__typename";
          });
          if (n)
            return null;
        }
      }
    }
  })), e;
}
var ef = Object.prototype.hasOwnProperty;
function mo() {
  for (var r = [], e = 0; e < arguments.length; e++)
    r[e] = arguments[e];
  return su(r);
}
function su(r) {
  var e = r[0] || {}, t = r.length;
  if (t > 1)
    for (var n = new zr(), i = 1; i < t; ++i)
      e = n.merge(e, r[i]);
  return e;
}
var tf = function(r, e, t) {
  return this.merge(r[t], e[t]);
}, zr = function() {
  function r(e) {
    e === void 0 && (e = tf), this.reconciler = e, this.isObject = ue, this.pastCopies = /* @__PURE__ */ new Set();
  }
  return r.prototype.merge = function(e, t) {
    for (var n = this, i = [], s = 2; s < arguments.length; s++)
      i[s - 2] = arguments[s];
    return ue(t) && ue(e) ? (Object.keys(t).forEach(function(o) {
      if (ef.call(e, o)) {
        var a = e[o];
        if (t[o] !== a) {
          var l = n.reconciler.apply(n, En([e, t, o], i, !1));
          l !== a && (e = n.shallowCopyForMerge(e), e[o] = l);
        }
      } else
        e = n.shallowCopyForMerge(e), e[o] = t[o];
    }), e) : t;
  }, r.prototype.shallowCopyForMerge = function(e) {
    if (ue(e)) {
      if (this.pastCopies.has(e)) {
        if (!Object.isFrozen(e))
          return e;
        this.pastCopies.delete(e);
      }
      Array.isArray(e) ? e = e.slice(0) : e = x({ __proto__: Object.getPrototypeOf(e) }, e), this.pastCopies.add(e);
    }
    return e;
  }, r;
}();
function rf(r, e) {
  var t = typeof Symbol < "u" && r[Symbol.iterator] || r["@@iterator"];
  if (t) return (t = t.call(r)).next.bind(t);
  if (Array.isArray(r) || (t = nf(r)) || e) {
    t && (r = t);
    var n = 0;
    return function() {
      return n >= r.length ? { done: !0 } : { done: !1, value: r[n++] };
    };
  }
  throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function nf(r, e) {
  if (r) {
    if (typeof r == "string") return go(r, e);
    var t = Object.prototype.toString.call(r).slice(8, -1);
    if (t === "Object" && r.constructor && (t = r.constructor.name), t === "Map" || t === "Set") return Array.from(r);
    if (t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)) return go(r, e);
  }
}
function go(r, e) {
  (e == null || e > r.length) && (e = r.length);
  for (var t = 0, n = new Array(e); t < e; t++)
    n[t] = r[t];
  return n;
}
function vo(r, e) {
  for (var t = 0; t < e.length; t++) {
    var n = e[t];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(r, n.key, n);
  }
}
function cs(r, e, t) {
  return e && vo(r.prototype, e), t && vo(r, t), Object.defineProperty(r, "prototype", { writable: !1 }), r;
}
var ls = function() {
  return typeof Symbol == "function";
}, hs = function(r) {
  return ls() && !!Symbol[r];
}, fs = function(r) {
  return hs(r) ? Symbol[r] : "@@" + r;
};
ls() && !hs("observable") && (Symbol.observable = Symbol("observable"));
var sf = fs("iterator"), Ni = fs("observable"), ou = fs("species");
function Sn(r, e) {
  var t = r[e];
  if (t != null) {
    if (typeof t != "function") throw new TypeError(t + " is not a function");
    return t;
  }
}
function _r(r) {
  var e = r.constructor;
  return e !== void 0 && (e = e[ou], e === null && (e = void 0)), e !== void 0 ? e : ee;
}
function of(r) {
  return r instanceof ee;
}
function or(r) {
  or.log ? or.log(r) : setTimeout(function() {
    throw r;
  });
}
function pn(r) {
  Promise.resolve().then(function() {
    try {
      r();
    } catch (e) {
      or(e);
    }
  });
}
function au(r) {
  var e = r._cleanup;
  if (e !== void 0 && (r._cleanup = void 0, !!e))
    try {
      if (typeof e == "function")
        e();
      else {
        var t = Sn(e, "unsubscribe");
        t && t.call(e);
      }
    } catch (n) {
      or(n);
    }
}
function Di(r) {
  r._observer = void 0, r._queue = void 0, r._state = "closed";
}
function af(r) {
  var e = r._queue;
  if (e) {
    r._queue = void 0, r._state = "ready";
    for (var t = 0; t < e.length && (uu(r, e[t].type, e[t].value), r._state !== "closed"); ++t)
      ;
  }
}
function uu(r, e, t) {
  r._state = "running";
  var n = r._observer;
  try {
    var i = Sn(n, e);
    switch (e) {
      case "next":
        i && i.call(n, t);
        break;
      case "error":
        if (Di(r), i) i.call(n, t);
        else throw t;
        break;
      case "complete":
        Di(r), i && i.call(n);
        break;
    }
  } catch (s) {
    or(s);
  }
  r._state === "closed" ? au(r) : r._state === "running" && (r._state = "ready");
}
function ti(r, e, t) {
  if (r._state !== "closed") {
    if (r._state === "buffering") {
      r._queue.push({
        type: e,
        value: t
      });
      return;
    }
    if (r._state !== "ready") {
      r._state = "buffering", r._queue = [{
        type: e,
        value: t
      }], pn(function() {
        return af(r);
      });
      return;
    }
    uu(r, e, t);
  }
}
var uf = /* @__PURE__ */ function() {
  function r(t, n) {
    this._cleanup = void 0, this._observer = t, this._queue = void 0, this._state = "initializing";
    var i = new cf(this);
    try {
      this._cleanup = n.call(void 0, i);
    } catch (s) {
      i.error(s);
    }
    this._state === "initializing" && (this._state = "ready");
  }
  var e = r.prototype;
  return e.unsubscribe = function() {
    this._state !== "closed" && (Di(this), au(this));
  }, cs(r, [{
    key: "closed",
    get: function() {
      return this._state === "closed";
    }
  }]), r;
}(), cf = /* @__PURE__ */ function() {
  function r(t) {
    this._subscription = t;
  }
  var e = r.prototype;
  return e.next = function(n) {
    ti(this._subscription, "next", n);
  }, e.error = function(n) {
    ti(this._subscription, "error", n);
  }, e.complete = function() {
    ti(this._subscription, "complete");
  }, cs(r, [{
    key: "closed",
    get: function() {
      return this._subscription._state === "closed";
    }
  }]), r;
}(), ee = /* @__PURE__ */ function() {
  function r(t) {
    if (!(this instanceof r)) throw new TypeError("Observable cannot be called as a function");
    if (typeof t != "function") throw new TypeError("Observable initializer must be a function");
    this._subscriber = t;
  }
  var e = r.prototype;
  return e.subscribe = function(n) {
    return (typeof n != "object" || n === null) && (n = {
      next: n,
      error: arguments[1],
      complete: arguments[2]
    }), new uf(n, this._subscriber);
  }, e.forEach = function(n) {
    var i = this;
    return new Promise(function(s, o) {
      if (typeof n != "function") {
        o(new TypeError(n + " is not a function"));
        return;
      }
      function a() {
        l.unsubscribe(), s();
      }
      var l = i.subscribe({
        next: function(h) {
          try {
            n(h, a);
          } catch (c) {
            o(c), l.unsubscribe();
          }
        },
        error: o,
        complete: s
      });
    });
  }, e.map = function(n) {
    var i = this;
    if (typeof n != "function") throw new TypeError(n + " is not a function");
    var s = _r(this);
    return new s(function(o) {
      return i.subscribe({
        next: function(a) {
          try {
            a = n(a);
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
  }, e.filter = function(n) {
    var i = this;
    if (typeof n != "function") throw new TypeError(n + " is not a function");
    var s = _r(this);
    return new s(function(o) {
      return i.subscribe({
        next: function(a) {
          try {
            if (!n(a)) return;
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
  }, e.reduce = function(n) {
    var i = this;
    if (typeof n != "function") throw new TypeError(n + " is not a function");
    var s = _r(this), o = arguments.length > 1, a = !1, l = arguments[1], h = l;
    return new s(function(c) {
      return i.subscribe({
        next: function(d) {
          var p = !a;
          if (a = !0, !p || o)
            try {
              h = n(h, d);
            } catch (m) {
              return c.error(m);
            }
          else
            h = d;
        },
        error: function(d) {
          c.error(d);
        },
        complete: function() {
          if (!a && !o) return c.error(new TypeError("Cannot reduce an empty sequence"));
          c.next(h), c.complete();
        }
      });
    });
  }, e.concat = function() {
    for (var n = this, i = arguments.length, s = new Array(i), o = 0; o < i; o++)
      s[o] = arguments[o];
    var a = _r(this);
    return new a(function(l) {
      var h, c = 0;
      function d(p) {
        h = p.subscribe({
          next: function(m) {
            l.next(m);
          },
          error: function(m) {
            l.error(m);
          },
          complete: function() {
            c === s.length ? (h = void 0, l.complete()) : d(a.from(s[c++]));
          }
        });
      }
      return d(n), function() {
        h && (h.unsubscribe(), h = void 0);
      };
    });
  }, e.flatMap = function(n) {
    var i = this;
    if (typeof n != "function") throw new TypeError(n + " is not a function");
    var s = _r(this);
    return new s(function(o) {
      var a = [], l = i.subscribe({
        next: function(c) {
          if (n)
            try {
              c = n(c);
            } catch (p) {
              return o.error(p);
            }
          var d = s.from(c).subscribe({
            next: function(p) {
              o.next(p);
            },
            error: function(p) {
              o.error(p);
            },
            complete: function() {
              var p = a.indexOf(d);
              p >= 0 && a.splice(p, 1), h();
            }
          });
          a.push(d);
        },
        error: function(c) {
          o.error(c);
        },
        complete: function() {
          h();
        }
      });
      function h() {
        l.closed && a.length === 0 && o.complete();
      }
      return function() {
        a.forEach(function(c) {
          return c.unsubscribe();
        }), l.unsubscribe();
      };
    });
  }, e[Ni] = function() {
    return this;
  }, r.from = function(n) {
    var i = typeof this == "function" ? this : r;
    if (n == null) throw new TypeError(n + " is not an object");
    var s = Sn(n, Ni);
    if (s) {
      var o = s.call(n);
      if (Object(o) !== o) throw new TypeError(o + " is not an object");
      return of(o) && o.constructor === i ? o : new i(function(a) {
        return o.subscribe(a);
      });
    }
    if (hs("iterator") && (s = Sn(n, sf), s))
      return new i(function(a) {
        pn(function() {
          if (!a.closed) {
            for (var l = rf(s.call(n)), h; !(h = l()).done; ) {
              var c = h.value;
              if (a.next(c), a.closed) return;
            }
            a.complete();
          }
        });
      });
    if (Array.isArray(n))
      return new i(function(a) {
        pn(function() {
          if (!a.closed) {
            for (var l = 0; l < n.length; ++l)
              if (a.next(n[l]), a.closed) return;
            a.complete();
          }
        });
      });
    throw new TypeError(n + " is not observable");
  }, r.of = function() {
    for (var n = arguments.length, i = new Array(n), s = 0; s < n; s++)
      i[s] = arguments[s];
    var o = typeof this == "function" ? this : r;
    return new o(function(a) {
      pn(function() {
        if (!a.closed) {
          for (var l = 0; l < i.length; ++l)
            if (a.next(i[l]), a.closed) return;
          a.complete();
        }
      });
    });
  }, cs(r, null, [{
    key: ou,
    get: function() {
      return this;
    }
  }]), r;
}();
ls() && Object.defineProperty(ee, Symbol("extensions"), {
  value: {
    symbol: Ni,
    hostReportError: or
  },
  configurable: !0
});
function lf(r) {
  var e, t = r.Symbol;
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
var Gt;
typeof self < "u" ? Gt = self : typeof window < "u" ? Gt = window : typeof Ue < "u" ? Gt = Ue : typeof module < "u" ? Gt = module : Gt = Function("return this")();
lf(Gt);
var bo = ee.prototype, wo = "@@observable";
bo[wo] || (bo[wo] = function() {
  return this;
});
var hf = Object.prototype.toString;
function cu(r) {
  return Fi(r);
}
function Fi(r, e) {
  switch (hf.call(r)) {
    case "[object Array]": {
      if (e = e || /* @__PURE__ */ new Map(), e.has(r))
        return e.get(r);
      var t = r.slice(0);
      return e.set(r, t), t.forEach(function(i, s) {
        t[s] = Fi(i, e);
      }), t;
    }
    case "[object Object]": {
      if (e = e || /* @__PURE__ */ new Map(), e.has(r))
        return e.get(r);
      var n = Object.create(Object.getPrototypeOf(r));
      return e.set(r, n), Object.keys(r).forEach(function(i) {
        n[i] = Fi(r[i], e);
      }), n;
    }
    default:
      return r;
  }
}
function ff(r) {
  var e = /* @__PURE__ */ new Set([r]);
  return e.forEach(function(t) {
    ue(t) && pf(t) === t && Object.getOwnPropertyNames(t).forEach(function(n) {
      ue(t[n]) && e.add(t[n]);
    });
  }), r;
}
function pf(r) {
  if (__DEV__ && !Object.isFrozen(r))
    try {
      Object.freeze(r);
    } catch (e) {
      if (e instanceof TypeError)
        return null;
      throw e;
    }
  return r;
}
function Mi(r) {
  return __DEV__ && ff(r), r;
}
function Cr(r, e, t) {
  var n = [];
  r.forEach(function(i) {
    return i[e] && n.push(i);
  }), n.forEach(function(i) {
    return i[e](t);
  });
}
function ri(r, e, t) {
  return new ee(function(n) {
    var i = n.next, s = n.error, o = n.complete, a = 0, l = !1, h = {
      then: function(m) {
        return new Promise(function(v) {
          return v(m());
        });
      }
    };
    function c(m, v) {
      return m ? function(w) {
        ++a;
        var _ = function() {
          return m(w);
        };
        h = h.then(_, _).then(function(E) {
          --a, i && i.call(n, E), l && d.complete();
        }, function(E) {
          throw --a, E;
        }).catch(function(E) {
          s && s.call(n, E);
        });
      } : function(w) {
        return v && v.call(n, w);
      };
    }
    var d = {
      next: c(e, i),
      error: c(t, s),
      complete: function() {
        l = !0, a || o && o.call(n);
      }
    }, p = r.subscribe(d);
    return function() {
      return p.unsubscribe();
    };
  });
}
var Qt = typeof WeakMap == "function" && !(typeof navigator == "object" && navigator.product === "ReactNative"), df = typeof WeakSet == "function", yf = typeof Symbol == "function" && typeof Symbol.for == "function";
function lu(r) {
  function e(t) {
    Object.defineProperty(r, t, { value: ee });
  }
  return yf && Symbol.species && e(Symbol.species), e("@@species"), r;
}
function _o(r) {
  return r && typeof r.then == "function";
}
var Ar = function(r) {
  je(e, r);
  function e(t) {
    var n = r.call(this, function(i) {
      return n.addObserver(i), function() {
        return n.removeObserver(i);
      };
    }) || this;
    return n.observers = /* @__PURE__ */ new Set(), n.addCount = 0, n.promise = new Promise(function(i, s) {
      n.resolve = i, n.reject = s;
    }), n.handlers = {
      next: function(i) {
        n.sub !== null && (n.latest = ["next", i], Cr(n.observers, "next", i));
      },
      error: function(i) {
        var s = n.sub;
        s !== null && (s && setTimeout(function() {
          return s.unsubscribe();
        }), n.sub = null, n.latest = ["error", i], n.reject(i), Cr(n.observers, "error", i));
      },
      complete: function() {
        if (n.sub !== null) {
          var i = n.sources.shift();
          i ? _o(i) ? i.then(function(s) {
            return n.sub = s.subscribe(n.handlers);
          }) : n.sub = i.subscribe(n.handlers) : (n.sub = null, n.latest && n.latest[0] === "next" ? n.resolve(n.latest[1]) : n.resolve(), Cr(n.observers, "complete"));
        }
      }
    }, n.cancel = function(i) {
      n.reject(i), n.sources = [], n.handlers.complete();
    }, n.promise.catch(function(i) {
    }), typeof t == "function" && (t = [new ee(t)]), _o(t) ? t.then(function(i) {
      return n.start(i);
    }, n.handlers.error) : n.start(t), n;
  }
  return e.prototype.start = function(t) {
    this.sub === void 0 && (this.sources = Array.from(t), this.handlers.complete());
  }, e.prototype.deliverLastMessage = function(t) {
    if (this.latest) {
      var n = this.latest[0], i = t[n];
      i && i.call(t, this.latest[1]), this.sub === null && n === "next" && t.complete && t.complete();
    }
  }, e.prototype.addObserver = function(t) {
    this.observers.has(t) || (this.deliverLastMessage(t), this.observers.add(t), ++this.addCount);
  }, e.prototype.removeObserver = function(t, n) {
    this.observers.delete(t) && --this.addCount < 1 && !n && this.handlers.error(new Error("Observable cancelled prematurely"));
  }, e.prototype.cleanup = function(t) {
    var n = this, i = !1, s = function() {
      i || (i = !0, n.observers.delete(o), t());
    }, o = {
      next: s,
      error: s,
      complete: s
    }, a = this.addCount;
    this.addObserver(o), this.addCount = a;
  }, e;
}(ee);
lu(Ar);
function jt(r) {
  return Array.isArray(r) && r.length > 0;
}
function dn(r) {
  return r.errors && r.errors.length > 0 || !1;
}
function Pr() {
  for (var r = [], e = 0; e < arguments.length; e++)
    r[e] = arguments[e];
  var t = /* @__PURE__ */ Object.create(null);
  return r.forEach(function(n) {
    n && Object.keys(n).forEach(function(i) {
      var s = n[i];
      s !== void 0 && (t[i] = s);
    });
  }), t;
}
var Eo = /* @__PURE__ */ new Map();
function $i(r) {
  var e = Eo.get(r) || 1;
  return Eo.set(r, e + 1), "".concat(r, ":").concat(e, ":").concat(Math.random().toString(36).slice(2));
}
function mf(r) {
  var e = $i("stringifyForDisplay");
  return JSON.stringify(r, function(t, n) {
    return n === void 0 ? e : n;
  }).split(JSON.stringify(e)).join("<undefined>");
}
function So(r) {
  return new ee(function(e) {
    e.error(r);
  });
}
var ko = function(r, e, t) {
  var n = new Error(t);
  throw n.name = "ServerError", n.response = r, n.statusCode = r.status, n.result = e, n;
};
function gf(r) {
  for (var e = [
    "query",
    "operationName",
    "variables",
    "extensions",
    "context"
  ], t = 0, n = Object.keys(r); t < n.length; t++) {
    var i = n[t];
    if (e.indexOf(i) < 0)
      throw __DEV__ ? new re("illegal argument: ".concat(i)) : new re(24);
  }
  return r;
}
function vf(r, e) {
  var t = x({}, r), n = function(s) {
    typeof s == "function" ? t = x(x({}, t), s(t)) : t = x(x({}, t), s);
  }, i = function() {
    return x({}, t);
  };
  return Object.defineProperty(e, "setContext", {
    enumerable: !1,
    value: n
  }), Object.defineProperty(e, "getContext", {
    enumerable: !1,
    value: i
  }), e;
}
function bf(r) {
  var e = {
    variables: r.variables || {},
    extensions: r.extensions || {},
    operationName: r.operationName,
    query: r.query
  };
  return e.operationName || (e.operationName = typeof e.query != "string" ? Ri(e.query) || void 0 : ""), e;
}
function xo(r, e) {
  return e ? e(r) : ee.of();
}
function Er(r) {
  return typeof r == "function" ? new Ve(r) : r;
}
function nn(r) {
  return r.request.length <= 1;
}
var wf = function(r) {
  je(e, r);
  function e(t, n) {
    var i = r.call(this, t) || this;
    return i.link = n, i;
  }
  return e;
}(Error), Ve = function() {
  function r(e) {
    e && (this.request = e);
  }
  return r.empty = function() {
    return new r(function() {
      return ee.of();
    });
  }, r.from = function(e) {
    return e.length === 0 ? r.empty() : e.map(Er).reduce(function(t, n) {
      return t.concat(n);
    });
  }, r.split = function(e, t, n) {
    var i = Er(t), s = Er(n || new r(xo));
    return nn(i) && nn(s) ? new r(function(o) {
      return e(o) ? i.request(o) || ee.of() : s.request(o) || ee.of();
    }) : new r(function(o, a) {
      return e(o) ? i.request(o, a) || ee.of() : s.request(o, a) || ee.of();
    });
  }, r.execute = function(e, t) {
    return e.request(vf(t.context, bf(gf(t)))) || ee.of();
  }, r.concat = function(e, t) {
    var n = Er(e);
    if (nn(n))
      return __DEV__ && D.warn(new wf("You are calling concat on a terminating link, which will have no effect", n)), n;
    var i = Er(t);
    return nn(i) ? new r(function(s) {
      return n.request(s, function(o) {
        return i.request(o) || ee.of();
      }) || ee.of();
    }) : new r(function(s, o) {
      return n.request(s, function(a) {
        return i.request(a, o) || ee.of();
      }) || ee.of();
    });
  }, r.prototype.split = function(e, t, n) {
    return this.concat(r.split(e, t, n || new r(xo)));
  }, r.prototype.concat = function(e) {
    return r.concat(this, e);
  }, r.prototype.request = function(e, t) {
    throw __DEV__ ? new re("request is not implemented") : new re(19);
  }, r.prototype.onError = function(e, t) {
    if (t && t.error)
      return t.error(e), !1;
    throw e;
  }, r.prototype.setOnError = function(e) {
    return this.onError = e, this;
  }, r;
}(), To = Ve.from, _f = Ve.split, Bi = Ve.execute, Ef = "3.5.10", Ao = Object.prototype.hasOwnProperty;
function Sf(r) {
  return function(e) {
    return e.text().then(function(t) {
      try {
        return JSON.parse(t);
      } catch (i) {
        var n = i;
        throw n.name = "ServerParseError", n.response = e, n.statusCode = e.status, n.bodyText = t, n;
      }
    }).then(function(t) {
      return e.status >= 300 && ko(e, t, "Response not successful: Received status code ".concat(e.status)), !Array.isArray(t) && !Ao.call(t, "data") && !Ao.call(t, "errors") && ko(e, t, "Server response was missing for query '".concat(Array.isArray(r) ? r.map(function(n) {
        return n.operationName;
      }) : r.operationName, "'.")), t;
    });
  };
}
var Pi = function(r, e) {
  var t;
  try {
    t = JSON.stringify(r);
  } catch (i) {
    var n = __DEV__ ? new re("Network request failed. ".concat(e, " is not serializable: ").concat(i.message)) : new re(21);
    throw n.parseError = i, n;
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
}, If = function(r, e) {
  return e(r);
};
function Of(r, e) {
  for (var t = [], n = 2; n < arguments.length; n++)
    t[n - 2] = arguments[n];
  var i = {}, s = {};
  t.forEach(function(d) {
    i = x(x(x({}, i), d.options), { headers: x(x({}, i.headers), Cf(d.headers)) }), d.credentials && (i.credentials = d.credentials), s = x(x({}, s), d.http);
  });
  var o = r.operationName, a = r.extensions, l = r.variables, h = r.query, c = { operationName: o, variables: l };
  return s.includeExtensions && (c.extensions = a), s.includeQuery && (c.query = e(h, ns)), {
    options: i,
    body: c
  };
}
function Cf(r) {
  if (r) {
    var e = /* @__PURE__ */ Object.create(null);
    return Object.keys(Object(r)).forEach(function(t) {
      e[t.toLowerCase()] = r[t];
    }), e;
  }
  return r;
}
var Rf = function(r) {
  if (!r && typeof fetch > "u")
    throw __DEV__ ? new re(`
"fetch" has not been found globally and no fetcher has been configured. To fix this, install a fetch package (like https://www.npmjs.com/package/cross-fetch), instantiate the fetcher, and pass it into your HttpLink constructor. For example:

import fetch from 'cross-fetch';
import { ApolloClient, HttpLink } from '@apollo/client';
const client = new ApolloClient({
  link: new HttpLink({ uri: '/graphql', fetch })
});
    `) : new re(20);
}, Nf = function() {
  if (typeof AbortController > "u")
    return { controller: !1, signal: !1 };
  var r = new AbortController(), e = r.signal;
  return { controller: r, signal: e };
}, Df = function(r, e) {
  var t = r.getContext(), n = t.uri;
  return n || (typeof e == "function" ? e(r) : e || "/graphql");
};
function Ff(r, e) {
  var t = [], n = function(d, p) {
    t.push("".concat(d, "=").concat(encodeURIComponent(p)));
  };
  if ("query" in e && n("query", e.query), e.operationName && n("operationName", e.operationName), e.variables) {
    var i = void 0;
    try {
      i = Pi(e.variables, "Variables map");
    } catch (d) {
      return { parseError: d };
    }
    n("variables", i);
  }
  if (e.extensions) {
    var s = void 0;
    try {
      s = Pi(e.extensions, "Extensions map");
    } catch (d) {
      return { parseError: d };
    }
    n("extensions", s);
  }
  var o = "", a = r, l = r.indexOf("#");
  l !== -1 && (o = r.substr(l), a = r.substr(0, l));
  var h = a.indexOf("?") === -1 ? "?" : "&", c = a + h + t.join("&") + o;
  return { newURI: c };
}
var Io = ct(function() {
  return fetch;
}), hu = function(r) {
  r === void 0 && (r = {});
  var e = r.uri, t = e === void 0 ? "/graphql" : e, n = r.fetch, i = r.print, s = i === void 0 ? If : i, o = r.includeExtensions, a = r.useGETForQueries, l = r.includeUnusedVariables, h = l === void 0 ? !1 : l, c = Lt(r, ["uri", "fetch", "print", "includeExtensions", "useGETForQueries", "includeUnusedVariables"]);
  __DEV__ && Rf(n || Io);
  var d = {
    http: { includeExtensions: o },
    options: c.fetchOptions,
    credentials: c.credentials,
    headers: c.headers
  };
  return new Ve(function(p) {
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
    }, R = Of(p, s, Af, d, A), N = R.options, F = R.body;
    if (F.variables && !h) {
      var B = new Set(Object.keys(F.variables));
      nt(p.query, {
        Variable: function(P, Q, j) {
          j && j.kind !== "VariableDefinition" && B.delete(P.name.value);
        }
      }), B.size && (F.variables = x({}, F.variables), B.forEach(function(P) {
        delete F.variables[P];
      }));
    }
    var q;
    if (!N.signal) {
      var z = Nf(), Y = z.controller, Ae = z.signal;
      q = Y, q && (N.signal = Ae);
    }
    var ze = function(P) {
      return P.kind === "OperationDefinition" && P.operation === "mutation";
    };
    if (a && !p.query.definitions.some(ze) && (N.method = "GET"), N.method === "GET") {
      var Be = Ff(m, F), V = Be.newURI, X = Be.parseError;
      if (X)
        return So(X);
      m = V;
    } else
      try {
        N.body = Pi(F, "Payload");
      } catch (P) {
        return So(P);
      }
    return new ee(function(P) {
      var Q = n || ct(function() {
        return fetch;
      }) || Io;
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
}, Mf = function(r) {
  je(e, r);
  function e(t) {
    t === void 0 && (t = {});
    var n = r.call(this, hu(t).request) || this;
    return n.options = t, n;
  }
  return e;
}(Ve);
const { toString: Oo, hasOwnProperty: $f } = Object.prototype, Co = Function.prototype.toString, Li = /* @__PURE__ */ new Map();
function Se(r, e) {
  try {
    return Ui(r, e);
  } finally {
    Li.clear();
  }
}
function Ui(r, e) {
  if (r === e)
    return !0;
  const t = Oo.call(r), n = Oo.call(e);
  if (t !== n)
    return !1;
  switch (t) {
    case "[object Array]":
      if (r.length !== e.length)
        return !1;
    case "[object Object]": {
      if (No(r, e))
        return !0;
      const i = Ro(r), s = Ro(e), o = i.length;
      if (o !== s.length)
        return !1;
      for (let a = 0; a < o; ++a)
        if (!$f.call(e, i[a]))
          return !1;
      for (let a = 0; a < o; ++a) {
        const l = i[a];
        if (!Ui(r[l], e[l]))
          return !1;
      }
      return !0;
    }
    case "[object Error]":
      return r.name === e.name && r.message === e.message;
    case "[object Number]":
      if (r !== r)
        return e !== e;
    case "[object Boolean]":
    case "[object Date]":
      return +r == +e;
    case "[object RegExp]":
    case "[object String]":
      return r == `${e}`;
    case "[object Map]":
    case "[object Set]": {
      if (r.size !== e.size)
        return !1;
      if (No(r, e))
        return !0;
      const i = r.entries(), s = t === "[object Map]";
      for (; ; ) {
        const o = i.next();
        if (o.done)
          break;
        const [a, l] = o.value;
        if (!e.has(a) || s && !Ui(l, e.get(a)))
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
      r = new Uint8Array(r), e = new Uint8Array(e);
    case "[object DataView]": {
      let i = r.byteLength;
      if (i === e.byteLength)
        for (; i-- && r[i] === e[i]; )
          ;
      return i === -1;
    }
    case "[object AsyncFunction]":
    case "[object GeneratorFunction]":
    case "[object AsyncGeneratorFunction]":
    case "[object Function]": {
      const i = Co.call(r);
      return i !== Co.call(e) ? !1 : !Lf(i, Pf);
    }
  }
  return !1;
}
function Ro(r) {
  return Object.keys(r).filter(Bf, r);
}
function Bf(r) {
  return this[r] !== void 0;
}
const Pf = "{ [native code] }";
function Lf(r, e) {
  const t = r.length - e.length;
  return t >= 0 && r.indexOf(e, t) === t;
}
function No(r, e) {
  let t = Li.get(r);
  if (t) {
    if (t.has(e))
      return !0;
  } else
    Li.set(r, t = /* @__PURE__ */ new Set());
  return t.add(e), !1;
}
var Uf = function() {
  return /* @__PURE__ */ Object.create(null);
}, fu = Array.prototype, qf = fu.forEach, jf = fu.slice, Gr = (
  /** @class */
  function() {
    function r(e, t) {
      e === void 0 && (e = !0), t === void 0 && (t = Uf), this.weakness = e, this.makeData = t;
    }
    return r.prototype.lookup = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      return this.lookupArray(e);
    }, r.prototype.lookupArray = function(e) {
      var t = this;
      return qf.call(e, function(n) {
        return t = t.getChildTrie(n);
      }), t.data || (t.data = this.makeData(jf.call(e)));
    }, r.prototype.getChildTrie = function(e) {
      var t = this.weakness && Vf(e) ? this.weak || (this.weak = /* @__PURE__ */ new WeakMap()) : this.strong || (this.strong = /* @__PURE__ */ new Map()), n = t.get(e);
      return n || t.set(e, n = new r(this.weakness, this.makeData)), n;
    }, r;
  }()
);
function Vf(r) {
  switch (typeof r) {
    case "object":
      if (r === null)
        break;
    case "function":
      return !0;
  }
  return !1;
}
let ke = null;
const Do = {};
let Qf = 1;
const Hf = () => class {
  constructor() {
    this.id = [
      "slot",
      Qf++,
      Date.now(),
      Math.random().toString(36).slice(2)
    ].join(":");
  }
  hasValue() {
    for (let e = ke; e; e = e.parent)
      if (this.id in e.slots) {
        const t = e.slots[this.id];
        if (t === Do)
          break;
        return e !== ke && (ke.slots[this.id] = t), !0;
      }
    return ke && (ke.slots[this.id] = Do), !1;
  }
  getValue() {
    if (this.hasValue())
      return ke.slots[this.id];
  }
  withValue(e, t, n, i) {
    const s = {
      __proto__: null,
      [this.id]: e
    }, o = ke;
    ke = { parent: o, slots: s };
    try {
      return t.apply(i, n);
    } finally {
      ke = o;
    }
  }
  // Capture the current context and wrap a callback function so that it
  // reestablishes the captured context when called.
  static bind(e) {
    const t = ke;
    return function() {
      const n = ke;
      try {
        return ke = t, e.apply(this, arguments);
      } finally {
        ke = n;
      }
    };
  }
  // Immediately run a callback function without any captured context.
  static noContext(e, t, n) {
    if (ke) {
      const i = ke;
      try {
        return ke = null, e.apply(n, t);
      } finally {
        ke = i;
      }
    } else
      return e.apply(n, t);
  }
};
function Fo(r) {
  try {
    return r();
  } catch {
  }
}
const ni = "@wry/context:Slot", Wf = (
  // Prefer globalThis when available.
  // https://github.com/benjamn/wryware/issues/347
  Fo(() => globalThis) || // Fall back to global, which works in Node.js and may be converted by some
  // bundlers to the appropriate identifier (window, self, ...) depending on the
  // bundling target. https://github.com/endojs/endo/issues/576#issuecomment-1178515224
  Fo(() => Ue) || // Otherwise, use a dummy host that's local to this module. We used to fall
  // back to using the Array constructor as a namespace, but that was flagged in
  // https://github.com/benjamn/wryware/issues/347, and can be avoided.
  /* @__PURE__ */ Object.create(null)
), Mo = Wf, Kf = Mo[ni] || // Earlier versions of this package stored the globalKey property on the Array
// constructor, so we check there as well, to prevent Slot class duplication.
Array[ni] || function(r) {
  try {
    Object.defineProperty(Mo, ni, {
      value: r,
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
    return r;
  }
}(Hf());
function zf() {
}
var Gf = (
  /** @class */
  function() {
    function r(e, t) {
      e === void 0 && (e = 1 / 0), t === void 0 && (t = zf), this.max = e, this.dispose = t, this.map = /* @__PURE__ */ new Map(), this.newest = null, this.oldest = null;
    }
    return r.prototype.has = function(e) {
      return this.map.has(e);
    }, r.prototype.get = function(e) {
      var t = this.getNode(e);
      return t && t.value;
    }, r.prototype.getNode = function(e) {
      var t = this.map.get(e);
      if (t && t !== this.newest) {
        var n = t.older, i = t.newer;
        i && (i.older = n), n && (n.newer = i), t.older = this.newest, t.older.newer = t, t.newer = null, this.newest = t, t === this.oldest && (this.oldest = i);
      }
      return t;
    }, r.prototype.set = function(e, t) {
      var n = this.getNode(e);
      return n ? n.value = t : (n = {
        key: e,
        value: t,
        newer: null,
        older: this.newest
      }, this.newest && (this.newest.newer = n), this.newest = n, this.oldest = this.oldest || n, this.map.set(e, n), n.value);
    }, r.prototype.clean = function() {
      for (; this.oldest && this.map.size > this.max; )
        this.delete(this.oldest.key);
    }, r.prototype.delete = function(e) {
      var t = this.map.get(e);
      return t ? (t === this.newest && (this.newest = t.older), t === this.oldest && (this.oldest = t.newer), t.newer && (t.newer.older = t.older), t.older && (t.older.newer = t.newer), this.map.delete(e), this.dispose(t.value, e), !0) : !1;
    }, r;
  }()
), Pn = new Kf(), ii, Jf = Object.prototype.hasOwnProperty, ps = (ii = Array.from, ii === void 0 ? function(r) {
  var e = [];
  return r.forEach(function(t) {
    return e.push(t);
  }), e;
} : ii);
function ds(r) {
  var e = r.unsubscribe;
  typeof e == "function" && (r.unsubscribe = void 0, e());
}
var Lr = [], Yf = 100;
function ar(r, e) {
  if (!r)
    throw new Error(e || "assertion failure");
}
function Xf(r, e) {
  var t = r.length;
  return (
    // Unknown values are not equal to each other.
    t > 0 && // Both values must be ordinary (or both exceptional) to be equal.
    t === e.length && // The underlying value or exception must be the same.
    r[t - 1] === e[t - 1]
  );
}
function pu(r) {
  switch (r.length) {
    case 0:
      throw new Error("unknown value");
    case 1:
      return r[0];
    case 2:
      throw r[1];
  }
}
function Zf(r) {
  return r.slice(0);
}
var ep = (
  /** @class */
  function() {
    function r(e) {
      this.fn = e, this.parents = /* @__PURE__ */ new Set(), this.childValues = /* @__PURE__ */ new Map(), this.dirtyChildren = null, this.dirty = !0, this.recomputing = !1, this.value = [], this.deps = null, ++r.count;
    }
    return r.prototype.peek = function() {
      if (this.value.length === 1 && !St(this))
        return $o(this), this.value[0];
    }, r.prototype.recompute = function(e) {
      return ar(!this.recomputing, "already recomputing"), $o(this), St(this) ? tp(this, e) : pu(this.value);
    }, r.prototype.setDirty = function() {
      this.dirty || (this.dirty = !0, this.value.length = 0, du(this), ds(this));
    }, r.prototype.dispose = function() {
      var e = this;
      this.setDirty(), bu(this), ys(this, function(t, n) {
        t.setDirty(), wu(t, e);
      });
    }, r.prototype.forget = function() {
      this.dispose();
    }, r.prototype.dependOn = function(e) {
      e.add(this), this.deps || (this.deps = Lr.pop() || /* @__PURE__ */ new Set()), this.deps.add(e);
    }, r.prototype.forgetDeps = function() {
      var e = this;
      this.deps && (ps(this.deps).forEach(function(t) {
        return t.delete(e);
      }), this.deps.clear(), Lr.push(this.deps), this.deps = null);
    }, r.count = 0, r;
  }()
);
function $o(r) {
  var e = Pn.getValue();
  if (e)
    return r.parents.add(e), e.childValues.has(r) || e.childValues.set(r, []), St(r) ? mu(e, r) : gu(e, r), e;
}
function tp(r, e) {
  return bu(r), Pn.withValue(r, rp, [r, e]), ip(r, e) && np(r), pu(r.value);
}
function rp(r, e) {
  r.recomputing = !0, r.value.length = 0;
  try {
    r.value[0] = r.fn.apply(null, e);
  } catch (t) {
    r.value[1] = t;
  }
  r.recomputing = !1;
}
function St(r) {
  return r.dirty || !!(r.dirtyChildren && r.dirtyChildren.size);
}
function np(r) {
  r.dirty = !1, !St(r) && yu(r);
}
function du(r) {
  ys(r, mu);
}
function yu(r) {
  ys(r, gu);
}
function ys(r, e) {
  var t = r.parents.size;
  if (t)
    for (var n = ps(r.parents), i = 0; i < t; ++i)
      e(n[i], r);
}
function mu(r, e) {
  ar(r.childValues.has(e)), ar(St(e));
  var t = !St(r);
  if (!r.dirtyChildren)
    r.dirtyChildren = Lr.pop() || /* @__PURE__ */ new Set();
  else if (r.dirtyChildren.has(e))
    return;
  r.dirtyChildren.add(e), t && du(r);
}
function gu(r, e) {
  ar(r.childValues.has(e)), ar(!St(e));
  var t = r.childValues.get(e);
  t.length === 0 ? r.childValues.set(e, Zf(e.value)) : Xf(t, e.value) || r.setDirty(), vu(r, e), !St(r) && yu(r);
}
function vu(r, e) {
  var t = r.dirtyChildren;
  t && (t.delete(e), t.size === 0 && (Lr.length < Yf && Lr.push(t), r.dirtyChildren = null));
}
function bu(r) {
  r.childValues.size > 0 && r.childValues.forEach(function(e, t) {
    wu(r, t);
  }), r.forgetDeps(), ar(r.dirtyChildren === null);
}
function wu(r, e) {
  e.parents.delete(r), r.childValues.delete(e), vu(r, e);
}
function ip(r, e) {
  if (typeof r.subscribe == "function")
    try {
      ds(r), r.unsubscribe = r.subscribe.apply(null, e);
    } catch {
      return r.setDirty(), !1;
    }
  return !0;
}
var sp = {
  setDirty: !0,
  dispose: !0,
  forget: !0
  // Fully remove parent Entry from LRU cache and computation graph
};
function _u(r) {
  var e = /* @__PURE__ */ new Map();
  function t(n) {
    var i = Pn.getValue();
    if (i) {
      var s = e.get(n);
      s || e.set(n, s = /* @__PURE__ */ new Set()), i.dependOn(s);
    }
  }
  return t.dirty = function(i, s) {
    var o = e.get(i);
    if (o) {
      var a = s && Jf.call(sp, s) ? s : "setDirty";
      ps(o).forEach(function(l) {
        return l[a]();
      }), e.delete(i), ds(o);
    }
  }, t;
}
function Eu() {
  var r = new Gr(typeof WeakMap == "function");
  return function() {
    return r.lookupArray(arguments);
  };
}
Eu();
var si = /* @__PURE__ */ new Set();
function kn(r, e) {
  e === void 0 && (e = /* @__PURE__ */ Object.create(null));
  var t = new Gf(e.max || Math.pow(2, 16), function(h) {
    return h.dispose();
  }), n = e.keyArgs, i = e.makeCacheKey || Eu(), s = function() {
    var h = i.apply(null, n ? n.apply(null, arguments) : arguments);
    if (h === void 0)
      return r.apply(null, arguments);
    var c = t.get(h);
    c || (t.set(h, c = new ep(r)), c.subscribe = e.subscribe, c.forget = function() {
      return t.delete(h);
    });
    var d = c.recompute(Array.prototype.slice.call(arguments));
    return t.set(h, c), si.add(t), Pn.hasValue() || (si.forEach(function(p) {
      return p.clean();
    }), si.clear()), d;
  };
  Object.defineProperty(s, "size", {
    get: function() {
      return t.map.size;
    },
    configurable: !1,
    enumerable: !1
  });
  function o(h) {
    var c = t.get(h);
    c && c.setDirty();
  }
  s.dirtyKey = o, s.dirty = function() {
    o(i.apply(null, arguments));
  };
  function a(h) {
    var c = t.get(h);
    if (c)
      return c.peek();
  }
  s.peekKey = a, s.peek = function() {
    return a(i.apply(null, arguments));
  };
  function l(h) {
    return t.delete(h);
  }
  return s.forgetKey = l, s.forget = function() {
    return l(i.apply(null, arguments));
  }, s.makeCacheKey = i, s.getKey = n ? function() {
    return i.apply(null, n.apply(null, arguments));
  } : i, Object.freeze(s);
}
var op = function() {
  function r() {
    this.getFragmentDoc = kn(Nh);
  }
  return r.prototype.batch = function(e) {
    var t = this, n = typeof e.optimistic == "string" ? e.optimistic : e.optimistic === !1 ? null : void 0, i;
    return this.performTransaction(function() {
      return i = e.update(t);
    }, n), i;
  }, r.prototype.recordOptimisticTransaction = function(e, t) {
    this.performTransaction(e, t);
  }, r.prototype.transformDocument = function(e) {
    return e;
  }, r.prototype.identify = function(e) {
  }, r.prototype.gc = function() {
    return [];
  }, r.prototype.modify = function(e) {
    return !1;
  }, r.prototype.transformForLink = function(e) {
    return e;
  }, r.prototype.readQuery = function(e, t) {
    return t === void 0 && (t = !!e.optimistic), this.read(x(x({}, e), { rootId: e.id || "ROOT_QUERY", optimistic: t }));
  }, r.prototype.readFragment = function(e, t) {
    return t === void 0 && (t = !!e.optimistic), this.read(x(x({}, e), { query: this.getFragmentDoc(e.fragment, e.fragmentName), rootId: e.id, optimistic: t }));
  }, r.prototype.writeQuery = function(e) {
    var t = e.id, n = e.data, i = Lt(e, ["id", "data"]);
    return this.write(Object.assign(i, {
      dataId: t || "ROOT_QUERY",
      result: n
    }));
  }, r.prototype.writeFragment = function(e) {
    var t = e.id, n = e.data, i = e.fragment, s = e.fragmentName, o = Lt(e, ["id", "data", "fragment", "fragmentName"]);
    return this.write(Object.assign(o, {
      query: this.getFragmentDoc(i, s),
      dataId: t,
      result: n
    }));
  }, r.prototype.updateQuery = function(e, t) {
    return this.batch({
      update: function(n) {
        var i = n.readQuery(e), s = t(i);
        return s == null ? i : (n.writeQuery(x(x({}, e), { data: s })), s);
      }
    });
  }, r.prototype.updateFragment = function(e, t) {
    return this.batch({
      update: function(n) {
        var i = n.readFragment(e), s = t(i);
        return s == null ? i : (n.writeFragment(x(x({}, e), { data: s })), s);
      }
    });
  }, r;
}(), Su = /* @__PURE__ */ function() {
  function r(e, t, n, i) {
    this.message = e, this.path = t, this.query = n, this.variables = i;
  }
  return r;
}(), _e = Object.prototype.hasOwnProperty;
function ku(r, e) {
  var t = r.__typename, n = r.id, i = r._id;
  if (typeof t == "string" && (e && (e.keyObject = n !== void 0 ? { id: n } : i !== void 0 ? { _id: i } : void 0), n === void 0 && (n = i), n !== void 0))
    return "".concat(t, ":").concat(typeof n == "number" || typeof n == "string" ? n : JSON.stringify(n));
}
var xu = {
  dataIdFromObject: ku,
  addTypename: !0,
  resultCaching: !0,
  canonizeResults: !1
};
function ap(r) {
  return Pr(xu, r);
}
function Tu(r) {
  var e = r.canonizeResults;
  return e === void 0 ? xu.canonizeResults : e;
}
function up(r, e) {
  return Z(e) ? r.get(e.__ref, "__typename") : e && e.__typename;
}
var Au = /^[_a-z][_0-9a-z]*/i;
function kt(r) {
  var e = r.match(Au);
  return e ? e[0] : r;
}
function qi(r, e, t) {
  return ue(e) ? de(e) ? e.every(function(n) {
    return qi(r, n, t);
  }) : r.selections.every(function(n) {
    if (yt(n) && Dn(n, t)) {
      var i = qt(n);
      return _e.call(e, i) && (!n.selectionSet || qi(n.selectionSet, e[i], t));
    }
    return !0;
  }) : !1;
}
function Yt(r) {
  return ue(r) && !Z(r) && !de(r);
}
function cp() {
  return new zr();
}
var de = function(r) {
  return Array.isArray(r);
}, yn = /* @__PURE__ */ Object.create(null), oi = function() {
  return yn;
}, Bo = /* @__PURE__ */ Object.create(null), Ur = function() {
  function r(e, t) {
    var n = this;
    this.policies = e, this.group = t, this.data = /* @__PURE__ */ Object.create(null), this.rootIds = /* @__PURE__ */ Object.create(null), this.refs = /* @__PURE__ */ Object.create(null), this.getFieldValue = function(i, s) {
      return Mi(Z(i) ? n.get(i.__ref, s) : i && i[s]);
    }, this.canRead = function(i) {
      return Z(i) ? n.has(i.__ref) : typeof i == "object";
    }, this.toReference = function(i, s) {
      if (typeof i == "string")
        return tr(i);
      if (Z(i))
        return i;
      var o = n.policies.identify(i)[0];
      if (o) {
        var a = tr(o);
        return s && n.merge(o, i), a;
      }
    };
  }
  return r.prototype.toObject = function() {
    return x({}, this.data);
  }, r.prototype.has = function(e) {
    return this.lookup(e, !0) !== void 0;
  }, r.prototype.get = function(e, t) {
    if (this.group.depend(e, t), _e.call(this.data, e)) {
      var n = this.data[e];
      if (n && _e.call(n, t))
        return n[t];
    }
    if (t === "__typename" && _e.call(this.policies.rootTypenamesById, e))
      return this.policies.rootTypenamesById[e];
    if (this instanceof vt)
      return this.parent.get(e, t);
  }, r.prototype.lookup = function(e, t) {
    if (t && this.group.depend(e, "__exists"), _e.call(this.data, e))
      return this.data[e];
    if (this instanceof vt)
      return this.parent.lookup(e, t);
    if (this.policies.rootTypenamesById[e])
      return /* @__PURE__ */ Object.create(null);
  }, r.prototype.merge = function(e, t) {
    var n = this, i;
    Z(e) && (e = e.__ref), Z(t) && (t = t.__ref);
    var s = typeof e == "string" ? this.lookup(i = e) : e, o = typeof t == "string" ? this.lookup(i = t) : t;
    if (o) {
      __DEV__ ? D(typeof i == "string", "store.merge expects a string ID") : D(typeof i == "string", 1);
      var a = new zr(hp).merge(s, o);
      if (this.data[i] = a, a !== s && (delete this.refs[i], this.group.caching)) {
        var l = /* @__PURE__ */ Object.create(null);
        s || (l.__exists = 1), Object.keys(o).forEach(function(h) {
          if (!s || s[h] !== a[h]) {
            l[h] = 1;
            var c = kt(h);
            c !== h && !n.policies.hasKeyArgs(a.__typename, c) && (l[c] = 1), a[h] === void 0 && !(n instanceof vt) && delete a[h];
          }
        }), l.__typename && !(s && s.__typename) && this.policies.rootTypenamesById[i] === a.__typename && delete l.__typename, Object.keys(l).forEach(function(h) {
          return n.group.dirty(i, h);
        });
      }
    }
  }, r.prototype.modify = function(e, t) {
    var n = this, i = this.lookup(e);
    if (i) {
      var s = /* @__PURE__ */ Object.create(null), o = !1, a = !0, l = {
        DELETE: yn,
        INVALIDATE: Bo,
        isReference: Z,
        toReference: this.toReference,
        canRead: this.canRead,
        readField: function(h, c) {
          return n.policies.readField(typeof h == "string" ? {
            fieldName: h,
            from: c || tr(e)
          } : h, { store: n });
        }
      };
      if (Object.keys(i).forEach(function(h) {
        var c = kt(h), d = i[h];
        if (d !== void 0) {
          var p = typeof t == "function" ? t : t[h] || t[c];
          if (p) {
            var m = p === oi ? yn : p(Mi(d), x(x({}, l), { fieldName: c, storeFieldName: h, storage: n.getStorage(e, h) }));
            m === Bo ? n.group.dirty(e, h) : (m === yn && (m = void 0), m !== d && (s[h] = m, o = !0, d = m));
          }
          d !== void 0 && (a = !1);
        }
      }), o)
        return this.merge(e, s), a && (this instanceof vt ? this.data[e] = void 0 : delete this.data[e], this.group.dirty(e, "__exists")), !0;
    }
    return !1;
  }, r.prototype.delete = function(e, t, n) {
    var i, s = this.lookup(e);
    if (s) {
      var o = this.getFieldValue(s, "__typename"), a = t && n ? this.policies.getStoreFieldName({ typename: o, fieldName: t, args: n }) : t;
      return this.modify(e, a ? (i = {}, i[a] = oi, i) : oi);
    }
    return !1;
  }, r.prototype.evict = function(e, t) {
    var n = !1;
    return e.id && (_e.call(this.data, e.id) && (n = this.delete(e.id, e.fieldName, e.args)), this instanceof vt && this !== t && (n = this.parent.evict(e, t) || n), (e.fieldName || n) && this.group.dirty(e.id, e.fieldName || "__exists")), n;
  }, r.prototype.clear = function() {
    this.replace(null);
  }, r.prototype.extract = function() {
    var e = this, t = this.toObject(), n = [];
    return this.getRootIdSet().forEach(function(i) {
      _e.call(e.policies.rootTypenamesById, i) || n.push(i);
    }), n.length && (t.__META = { extraRootIds: n.sort() }), t;
  }, r.prototype.replace = function(e) {
    var t = this;
    if (Object.keys(this.data).forEach(function(s) {
      e && _e.call(e, s) || t.delete(s);
    }), e) {
      var n = e.__META, i = Lt(e, ["__META"]);
      Object.keys(i).forEach(function(s) {
        t.merge(s, i[s]);
      }), n && n.extraRootIds.forEach(this.retain, this);
    }
  }, r.prototype.retain = function(e) {
    return this.rootIds[e] = (this.rootIds[e] || 0) + 1;
  }, r.prototype.release = function(e) {
    if (this.rootIds[e] > 0) {
      var t = --this.rootIds[e];
      return t || delete this.rootIds[e], t;
    }
    return 0;
  }, r.prototype.getRootIdSet = function(e) {
    return e === void 0 && (e = /* @__PURE__ */ new Set()), Object.keys(this.rootIds).forEach(e.add, e), this instanceof vt ? this.parent.getRootIdSet(e) : Object.keys(this.policies.rootTypenamesById).forEach(e.add, e), e;
  }, r.prototype.gc = function() {
    var e = this, t = this.getRootIdSet(), n = this.toObject();
    t.forEach(function(o) {
      _e.call(n, o) && (Object.keys(e.findChildRefIds(o)).forEach(t.add, t), delete n[o]);
    });
    var i = Object.keys(n);
    if (i.length) {
      for (var s = this; s instanceof vt; )
        s = s.parent;
      i.forEach(function(o) {
        return s.delete(o);
      });
    }
    return i;
  }, r.prototype.findChildRefIds = function(e) {
    if (!_e.call(this.refs, e)) {
      var t = this.refs[e] = /* @__PURE__ */ Object.create(null), n = this.data[e];
      if (!n)
        return t;
      var i = /* @__PURE__ */ new Set([n]);
      i.forEach(function(s) {
        Z(s) && (t[s.__ref] = !0), ue(s) && Object.keys(s).forEach(function(o) {
          var a = s[o];
          ue(a) && i.add(a);
        });
      });
    }
    return this.refs[e];
  }, r.prototype.makeCacheKey = function() {
    return this.group.keyMaker.lookupArray(arguments);
  }, r;
}(), Iu = function() {
  function r(e, t) {
    t === void 0 && (t = null), this.caching = e, this.parent = t, this.d = null, this.resetCaching();
  }
  return r.prototype.resetCaching = function() {
    this.d = this.caching ? _u() : null, this.keyMaker = new Gr(Qt);
  }, r.prototype.depend = function(e, t) {
    if (this.d) {
      this.d(ai(e, t));
      var n = kt(t);
      n !== t && this.d(ai(e, n)), this.parent && this.parent.depend(e, t);
    }
  }, r.prototype.dirty = function(e, t) {
    this.d && this.d.dirty(ai(e, t), t === "__exists" ? "forget" : "setDirty");
  }, r;
}();
function ai(r, e) {
  return e + "#" + r;
}
function Po(r, e) {
  Rr(r) && r.group.depend(e, "__exists");
}
(function(r) {
  var e = function(t) {
    je(n, t);
    function n(i) {
      var s = i.policies, o = i.resultCaching, a = o === void 0 ? !0 : o, l = i.seed, h = t.call(this, s, new Iu(a)) || this;
      return h.stump = new lp(h), h.storageTrie = new Gr(Qt), l && h.replace(l), h;
    }
    return n.prototype.addLayer = function(i, s) {
      return this.stump.addLayer(i, s);
    }, n.prototype.removeLayer = function() {
      return this;
    }, n.prototype.getStorage = function() {
      return this.storageTrie.lookupArray(arguments);
    }, n;
  }(r);
  r.Root = e;
})(Ur || (Ur = {}));
var vt = function(r) {
  je(e, r);
  function e(t, n, i, s) {
    var o = r.call(this, n.policies, s) || this;
    return o.id = t, o.parent = n, o.replay = i, o.group = s, i(o), o;
  }
  return e.prototype.addLayer = function(t, n) {
    return new e(t, this, n, this.group);
  }, e.prototype.removeLayer = function(t) {
    var n = this, i = this.parent.removeLayer(t);
    return t === this.id ? (this.group.caching && Object.keys(this.data).forEach(function(s) {
      var o = n.data[s], a = i.lookup(s);
      a ? o ? o !== a && Object.keys(o).forEach(function(l) {
        Se(o[l], a[l]) || n.group.dirty(s, l);
      }) : (n.group.dirty(s, "__exists"), Object.keys(a).forEach(function(l) {
        n.group.dirty(s, l);
      })) : n.delete(s);
    }), i) : i === this.parent ? this : i.addLayer(this.id, this.replay);
  }, e.prototype.toObject = function() {
    return x(x({}, this.parent.toObject()), this.data);
  }, e.prototype.findChildRefIds = function(t) {
    var n = this.parent.findChildRefIds(t);
    return _e.call(this.data, t) ? x(x({}, n), r.prototype.findChildRefIds.call(this, t)) : n;
  }, e.prototype.getStorage = function() {
    for (var t = this.parent; t.parent; )
      t = t.parent;
    return t.getStorage.apply(t, arguments);
  }, e;
}(Ur), lp = function(r) {
  je(e, r);
  function e(t) {
    return r.call(this, "EntityStore.Stump", t, function() {
    }, new Iu(t.group.caching, t.group)) || this;
  }
  return e.prototype.removeLayer = function() {
    return this;
  }, e.prototype.merge = function() {
    return this.parent.merge.apply(this.parent, arguments);
  }, e;
}(vt);
function hp(r, e, t) {
  var n = r[t], i = e[t];
  return Se(n, i) ? n : i;
}
function Rr(r) {
  return !!(r instanceof Ur && r.group.caching);
}
function fp(r) {
  return ue(r) ? de(r) ? r.slice(0) : x({ __proto__: Object.getPrototypeOf(r) }, r) : r;
}
var ji = function() {
  function r() {
    this.known = new (df ? WeakSet : Set)(), this.pool = new Gr(Qt), this.passes = /* @__PURE__ */ new WeakMap(), this.keysByJSON = /* @__PURE__ */ new Map(), this.empty = this.admit({});
  }
  return r.prototype.isKnown = function(e) {
    return ue(e) && this.known.has(e);
  }, r.prototype.pass = function(e) {
    if (ue(e)) {
      var t = fp(e);
      return this.passes.set(t, e), t;
    }
    return e;
  }, r.prototype.admit = function(e) {
    var t = this;
    if (ue(e)) {
      var n = this.passes.get(e);
      if (n)
        return n;
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
          var a = Object.getPrototypeOf(e), l = [a], h = this.sortedKeys(e);
          l.push(h.json);
          var c = l.length;
          h.sorted.forEach(function(m) {
            l.push(t.admit(e[m]));
          });
          var o = this.pool.lookupArray(l);
          if (!o.object) {
            var d = o.object = Object.create(a);
            this.known.add(d), h.sorted.forEach(function(m, v) {
              d[m] = l[c + v];
            }), __DEV__ && Object.freeze(d);
          }
          return o.object;
        }
      }
    }
    return e;
  }, r.prototype.sortedKeys = function(e) {
    var t = Object.keys(e), n = this.pool.lookupArray(t);
    if (!n.keys) {
      t.sort();
      var i = JSON.stringify(t);
      (n.keys = this.keysByJSON.get(i)) || this.keysByJSON.set(i, n.keys = { sorted: t, json: i });
    }
    return n.keys;
  }, r;
}(), Pt = Object.assign(function(r) {
  if (ue(r)) {
    Vi === void 0 && Lo();
    var e = Vi.admit(r), t = Qi.get(e);
    return t === void 0 && Qi.set(e, t = JSON.stringify(e)), t;
  }
  return JSON.stringify(r);
}, {
  reset: Lo
}), Vi, Qi;
function Lo() {
  Vi = new ji(), Qi = new (Qt ? WeakMap : Map)();
}
function Uo(r) {
  return [
    r.selectionSet,
    r.objectOrReference,
    r.context,
    r.context.canonizeResults
  ];
}
var pp = function() {
  function r(e) {
    var t = this;
    this.knownResults = new (Qt ? WeakMap : Map)(), this.config = Pr(e, {
      addTypename: e.addTypename !== !1,
      canonizeResults: Tu(e)
    }), this.canon = e.canon || new ji(), this.executeSelectionSet = kn(function(n) {
      var i, s = n.context.canonizeResults, o = Uo(n);
      o[3] = !s;
      var a = (i = t.executeSelectionSet).peek.apply(i, o);
      return a ? s ? x(x({}, a), { result: t.canon.admit(a.result) }) : a : (Po(n.context.store, n.enclosingRef.__ref), t.execSelectionSetImpl(n));
    }, {
      max: this.config.resultCacheMaxSize,
      keyArgs: Uo,
      makeCacheKey: function(n, i, s, o) {
        if (Rr(s.store))
          return s.store.makeCacheKey(n, Z(i) ? i.__ref : i, s.varString, o);
      }
    }), this.executeSubSelectedArray = kn(function(n) {
      return Po(n.context.store, n.enclosingRef.__ref), t.execSubSelectedArrayImpl(n);
    }, {
      max: this.config.resultCacheMaxSize,
      makeCacheKey: function(n) {
        var i = n.field, s = n.array, o = n.context;
        if (Rr(o.store))
          return o.store.makeCacheKey(i, s, o.varString);
      }
    });
  }
  return r.prototype.resetCanon = function() {
    this.canon = new ji();
  }, r.prototype.diffQueryAgainstStore = function(e) {
    var t = e.store, n = e.query, i = e.rootId, s = i === void 0 ? "ROOT_QUERY" : i, o = e.variables, a = e.returnPartialData, l = a === void 0 ? !0 : a, h = e.canonizeResults, c = h === void 0 ? this.config.canonizeResults : h, d = this.config.cache.policies;
    o = x(x({}, os(tu(n))), o);
    var p = tr(s), m = new zr(), v = this.executeSelectionSet({
      selectionSet: Bn(n).selectionSet,
      objectOrReference: p,
      enclosingRef: p,
      context: {
        store: t,
        query: n,
        policies: d,
        variables: o,
        varString: Pt(o),
        canonizeResults: c,
        fragmentMap: Fn($n(n)),
        merge: function(_, E) {
          return m.merge(_, E);
        }
      }
    }), w;
    if (v.missing && (w = [new Su(dp(v.missing), v.missing, n, o)], !l))
      throw w[0];
    return {
      result: v.result,
      complete: !w,
      missing: w
    };
  }, r.prototype.isFresh = function(e, t, n, i) {
    if (Rr(i.store) && this.knownResults.get(e) === n) {
      var s = this.executeSelectionSet.peek(n, t, i, this.canon.isKnown(e));
      if (s && e === s.result)
        return !0;
    }
    return !1;
  }, r.prototype.execSelectionSetImpl = function(e) {
    var t = this, n = e.selectionSet, i = e.objectOrReference, s = e.enclosingRef, o = e.context;
    if (Z(i) && !o.policies.rootTypenamesById[i.__ref] && !o.store.has(i.__ref))
      return {
        result: this.canon.empty,
        missing: "Dangling reference to missing ".concat(i.__ref, " object")
      };
    var a = o.variables, l = o.policies, h = o.store, c = h.getFieldValue(i, "__typename"), d = {}, p;
    this.config.addTypename && typeof c == "string" && !l.rootIdsByTypename[c] && (d = { __typename: c });
    function m(E, T) {
      var I;
      return E.missing && (p = o.merge(p, (I = {}, I[T] = E.missing, I))), E.result;
    }
    var v = new Set(n.selections);
    v.forEach(function(E) {
      var T, I;
      if (Dn(E, a))
        if (yt(E)) {
          var A = l.readField({
            fieldName: E.name.value,
            field: E,
            variables: o.variables,
            from: i
          }, o), R = qt(E);
          A === void 0 ? us.added(E) || (p = o.merge(p, (T = {}, T[R] = "Can't find field '".concat(E.name.value, "' on ").concat(Z(i) ? i.__ref + " object" : "object " + JSON.stringify(i, null, 2)), T))) : de(A) ? A = m(t.executeSubSelectedArray({
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
          var N = is(E, o.fragmentMap);
          N && l.fragmentMatches(N, c) && N.selectionSet.selections.forEach(v.add, v);
        }
    });
    var w = { result: d, missing: p }, _ = o.canonizeResults ? this.canon.admit(w) : Mi(w);
    return _.result && this.knownResults.set(_.result, n), _;
  }, r.prototype.execSubSelectedArrayImpl = function(e) {
    var t = this, n = e.field, i = e.array, s = e.enclosingRef, o = e.context, a;
    function l(h, c) {
      var d;
      return h.missing && (a = o.merge(a, (d = {}, d[c] = h.missing, d))), h.result;
    }
    return n.selectionSet && (i = i.filter(o.store.canRead)), i = i.map(function(h, c) {
      return h === null ? null : de(h) ? l(t.executeSubSelectedArray({
        field: n,
        array: h,
        enclosingRef: s,
        context: o
      }), c) : n.selectionSet ? l(t.executeSelectionSet({
        selectionSet: n.selectionSet,
        objectOrReference: h,
        enclosingRef: Z(h) ? h : s,
        context: o
      }), c) : (__DEV__ && yp(o.store, n, h), h);
    }), {
      result: o.canonizeResults ? this.canon.admit(i) : i,
      missing: a
    };
  }, r;
}();
function dp(r) {
  try {
    JSON.stringify(r, function(e, t) {
      if (typeof t == "string")
        throw t;
      return t;
    });
  } catch (e) {
    return e;
  }
}
function yp(r, e, t) {
  if (!e.selectionSet) {
    var n = /* @__PURE__ */ new Set([t]);
    n.forEach(function(i) {
      ue(i) && (__DEV__ ? D(!Z(i), "Missing selection set for object of type ".concat(up(r, i), " returned for query field ").concat(e.name.value)) : D(!Z(i), 5), Object.values(i).forEach(n.add, n));
    });
  }
}
var xe = null, qo = {}, mp = 1, gp = function() {
  return (
    /** @class */
    function() {
      function r() {
        this.id = [
          "slot",
          mp++,
          Date.now(),
          Math.random().toString(36).slice(2)
        ].join(":");
      }
      return r.prototype.hasValue = function() {
        for (var e = xe; e; e = e.parent)
          if (this.id in e.slots) {
            var t = e.slots[this.id];
            if (t === qo)
              break;
            return e !== xe && (xe.slots[this.id] = t), !0;
          }
        return xe && (xe.slots[this.id] = qo), !1;
      }, r.prototype.getValue = function() {
        if (this.hasValue())
          return xe.slots[this.id];
      }, r.prototype.withValue = function(e, t, n, i) {
        var s, o = (s = {
          __proto__: null
        }, s[this.id] = e, s), a = xe;
        xe = { parent: a, slots: o };
        try {
          return t.apply(i, n);
        } finally {
          xe = a;
        }
      }, r.bind = function(e) {
        var t = xe;
        return function() {
          var n = xe;
          try {
            return xe = t, e.apply(this, arguments);
          } finally {
            xe = n;
          }
        };
      }, r.noContext = function(e, t, n) {
        if (xe) {
          var i = xe;
          try {
            return xe = null, e.apply(n, t);
          } finally {
            xe = i;
          }
        } else
          return e.apply(n, t);
      }, r;
    }()
  );
}, ui = "@wry/context:Slot", ci = Array, ms = ci[ui] || function() {
  var r = gp();
  try {
    Object.defineProperty(ci, ui, {
      value: ci[ui] = r,
      enumerable: !1,
      writable: !1,
      configurable: !1
    });
  } finally {
    return r;
  }
}();
ms.bind;
ms.noContext;
var gs = new ms(), jo = /* @__PURE__ */ new WeakMap();
function Nr(r) {
  var e = jo.get(r);
  return e || jo.set(r, e = {
    vars: /* @__PURE__ */ new Set(),
    dep: _u()
  }), e;
}
function Vo(r) {
  Nr(r).vars.forEach(function(e) {
    return e.forgetCache(r);
  });
}
function vp(r) {
  Nr(r).vars.forEach(function(e) {
    return e.attachCache(r);
  });
}
function bp(r) {
  var e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set(), n = function(s) {
    if (arguments.length > 0) {
      if (r !== s) {
        r = s, e.forEach(function(l) {
          Nr(l).dep.dirty(n), wp(l);
        });
        var o = Array.from(t);
        t.clear(), o.forEach(function(l) {
          return l(r);
        });
      }
    } else {
      var a = gs.getValue();
      a && (i(a), Nr(a).dep(n));
    }
    return r;
  };
  n.onNextChange = function(s) {
    return t.add(s), function() {
      t.delete(s);
    };
  };
  var i = n.attachCache = function(s) {
    return e.add(s), Nr(s).vars.add(n), n;
  };
  return n.forgetCache = function(s) {
    return e.delete(s);
  }, n;
}
function wp(r) {
  r.broadcastWatches && r.broadcastWatches();
}
var Qo = /* @__PURE__ */ Object.create(null);
function vs(r) {
  var e = JSON.stringify(r);
  return Qo[e] || (Qo[e] = /* @__PURE__ */ Object.create(null));
}
function Ho(r) {
  var e = vs(r);
  return e.keyFieldsFn || (e.keyFieldsFn = function(t, n) {
    var i = function(o, a) {
      return n.readField(a, o);
    }, s = n.keyObject = bs(r, function(o) {
      var a = rr(n.storeObject, o, i);
      return a === void 0 && t !== n.storeObject && _e.call(t, o[0]) && (a = rr(t, o, Cu)), __DEV__ ? D(a !== void 0, "Missing field '".concat(o.join("."), "' while extracting keyFields from ").concat(JSON.stringify(t))) : D(a !== void 0, 2), a;
    });
    return "".concat(n.typename, ":").concat(JSON.stringify(s));
  });
}
function Wo(r) {
  var e = vs(r);
  return e.keyArgsFn || (e.keyArgsFn = function(t, n) {
    var i = n.field, s = n.variables, o = n.fieldName, a = bs(r, function(h) {
      var c = h[0], d = c.charAt(0);
      if (d === "@") {
        if (i && jt(i.directives)) {
          var p = c.slice(1), m = i.directives.find(function(E) {
            return E.name.value === p;
          }), v = m && Mn(m, s);
          return v && rr(v, h.slice(1));
        }
        return;
      }
      if (d === "$") {
        var w = c.slice(1);
        if (s && _e.call(s, w)) {
          var _ = h.slice(0);
          return _[0] = w, rr(s, _);
        }
        return;
      }
      if (t)
        return rr(t, h);
    }), l = JSON.stringify(a);
    return (t || l !== "{}") && (o += ":" + l), o;
  });
}
function bs(r, e) {
  var t = new zr();
  return Ou(r).reduce(function(n, i) {
    var s, o = e(i);
    if (o !== void 0) {
      for (var a = i.length - 1; a >= 0; --a)
        o = (s = {}, s[i[a]] = o, s);
      n = t.merge(n, o);
    }
    return n;
  }, /* @__PURE__ */ Object.create(null));
}
function Ou(r) {
  var e = vs(r);
  if (!e.paths) {
    var t = e.paths = [], n = [];
    r.forEach(function(i, s) {
      de(i) ? (Ou(i).forEach(function(o) {
        return t.push(n.concat(o));
      }), n.length = 0) : (n.push(i), de(r[s + 1]) || (t.push(n.slice(0)), n.length = 0));
    });
  }
  return e.paths;
}
function Cu(r, e) {
  return r[e];
}
function rr(r, e, t) {
  return t = t || Cu, Ru(e.reduce(function n(i, s) {
    return de(i) ? i.map(function(o) {
      return n(o, s);
    }) : i && t(i, s);
  }, r));
}
function Ru(r) {
  return ue(r) ? de(r) ? r.map(Ru) : bs(Object.keys(r).sort(), function(e) {
    return rr(r, e);
  }) : r;
}
ss.setStringify(Pt);
function Hi(r) {
  return r.args !== void 0 ? r.args : r.field ? Mn(r.field, r.variables) : null;
}
var _p = function() {
}, Ko = function(r, e) {
  return e.fieldName;
}, zo = function(r, e, t) {
  var n = t.mergeObjects;
  return n(r, e);
}, Go = function(r, e) {
  return e;
}, Ep = function() {
  function r(e) {
    this.config = e, this.typePolicies = /* @__PURE__ */ Object.create(null), this.toBeAdded = /* @__PURE__ */ Object.create(null), this.supertypeMap = /* @__PURE__ */ new Map(), this.fuzzySubtypes = /* @__PURE__ */ new Map(), this.rootIdsByTypename = /* @__PURE__ */ Object.create(null), this.rootTypenamesById = /* @__PURE__ */ Object.create(null), this.usingPossibleTypes = !1, this.config = x({ dataIdFromObject: ku }, e), this.cache = this.config.cache, this.setRootTypename("Query"), this.setRootTypename("Mutation"), this.setRootTypename("Subscription"), e.possibleTypes && this.addPossibleTypes(e.possibleTypes), e.typePolicies && this.addTypePolicies(e.typePolicies);
  }
  return r.prototype.identify = function(e, t) {
    var n, i = this, s = t && (t.typename || ((n = t.storeObject) === null || n === void 0 ? void 0 : n.__typename)) || e.__typename;
    if (s === this.rootTypenamesById.ROOT_QUERY)
      return ["ROOT_QUERY"];
    for (var o = t && t.storeObject || e, a = x(x({}, t), { typename: s, storeObject: o, readField: t && t.readField || function() {
      var p = ws(arguments, o);
      return i.readField(p, {
        store: i.cache.data,
        variables: p.variables
      });
    } }), l, h = s && this.getTypePolicy(s), c = h && h.keyFn || this.config.dataIdFromObject; c; ) {
      var d = c(e, a);
      if (de(d))
        c = Ho(d);
      else {
        l = d;
        break;
      }
    }
    return l = l ? String(l) : void 0, a.keyObject ? [l, a.keyObject] : [l];
  }, r.prototype.addTypePolicies = function(e) {
    var t = this;
    Object.keys(e).forEach(function(n) {
      var i = e[n], s = i.queryType, o = i.mutationType, a = i.subscriptionType, l = Lt(i, ["queryType", "mutationType", "subscriptionType"]);
      s && t.setRootTypename("Query", n), o && t.setRootTypename("Mutation", n), a && t.setRootTypename("Subscription", n), _e.call(t.toBeAdded, n) ? t.toBeAdded[n].push(l) : t.toBeAdded[n] = [l];
    });
  }, r.prototype.updateTypePolicy = function(e, t) {
    var n = this, i = this.getTypePolicy(e), s = t.keyFields, o = t.fields;
    function a(l, h) {
      l.merge = typeof h == "function" ? h : h === !0 ? zo : h === !1 ? Go : l.merge;
    }
    a(i, t.merge), i.keyFn = s === !1 ? _p : de(s) ? Ho(s) : typeof s == "function" ? s : i.keyFn, o && Object.keys(o).forEach(function(l) {
      var h = n.getFieldPolicy(e, l, !0), c = o[l];
      if (typeof c == "function")
        h.read = c;
      else {
        var d = c.keyArgs, p = c.read, m = c.merge;
        h.keyFn = d === !1 ? Ko : de(d) ? Wo(d) : typeof d == "function" ? d : h.keyFn, typeof p == "function" && (h.read = p), a(h, m);
      }
      h.read && h.merge && (h.keyFn = h.keyFn || Ko);
    });
  }, r.prototype.setRootTypename = function(e, t) {
    t === void 0 && (t = e);
    var n = "ROOT_" + e.toUpperCase(), i = this.rootTypenamesById[n];
    t !== i && (__DEV__ ? D(!i || i === e, "Cannot change root ".concat(e, " __typename more than once")) : D(!i || i === e, 3), i && delete this.rootIdsByTypename[i], this.rootIdsByTypename[t] = n, this.rootTypenamesById[n] = t);
  }, r.prototype.addPossibleTypes = function(e) {
    var t = this;
    this.usingPossibleTypes = !0, Object.keys(e).forEach(function(n) {
      t.getSupertypeSet(n, !0), e[n].forEach(function(i) {
        t.getSupertypeSet(i, !0).add(n);
        var s = i.match(Au);
        (!s || s[0] !== i) && t.fuzzySubtypes.set(i, new RegExp(i));
      });
    });
  }, r.prototype.getTypePolicy = function(e) {
    var t = this;
    if (!_e.call(this.typePolicies, e)) {
      var n = this.typePolicies[e] = /* @__PURE__ */ Object.create(null);
      n.fields = /* @__PURE__ */ Object.create(null);
      var i = this.supertypeMap.get(e);
      i && i.size && i.forEach(function(o) {
        var a = t.getTypePolicy(o), l = a.fields, h = Lt(a, ["fields"]);
        Object.assign(n, h), Object.assign(n.fields, l);
      });
    }
    var s = this.toBeAdded[e];
    return s && s.length && s.splice(0).forEach(function(o) {
      t.updateTypePolicy(e, o);
    }), this.typePolicies[e];
  }, r.prototype.getFieldPolicy = function(e, t, n) {
    if (e) {
      var i = this.getTypePolicy(e).fields;
      return i[t] || n && (i[t] = /* @__PURE__ */ Object.create(null));
    }
  }, r.prototype.getSupertypeSet = function(e, t) {
    var n = this.supertypeMap.get(e);
    return !n && t && this.supertypeMap.set(e, n = /* @__PURE__ */ new Set()), n;
  }, r.prototype.fragmentMatches = function(e, t, n, i) {
    var s = this;
    if (!e.typeCondition)
      return !0;
    if (!t)
      return !1;
    var o = e.typeCondition.name.value;
    if (t === o)
      return !0;
    if (this.usingPossibleTypes && this.supertypeMap.has(o))
      for (var a = this.getSupertypeSet(t, !0), l = [a], h = function(v) {
        var w = s.getSupertypeSet(v, !1);
        w && w.size && l.indexOf(w) < 0 && l.push(w);
      }, c = !!(n && this.fuzzySubtypes.size), d = !1, p = 0; p < l.length; ++p) {
        var m = l[p];
        if (m.has(o))
          return a.has(o) || (d && __DEV__ && D.warn("Inferring subtype ".concat(t, " of supertype ").concat(o)), a.add(o)), !0;
        m.forEach(h), c && p === l.length - 1 && qi(e.selectionSet, n, i) && (c = !1, d = !0, this.fuzzySubtypes.forEach(function(v, w) {
          var _ = t.match(v);
          _ && _[0] === t && h(w);
        }));
      }
    return !1;
  }, r.prototype.hasKeyArgs = function(e, t) {
    var n = this.getFieldPolicy(e, t, !1);
    return !!(n && n.keyFn);
  }, r.prototype.getStoreFieldName = function(e) {
    var t = e.typename, n = e.fieldName, i = this.getFieldPolicy(t, n, !1), s, o = i && i.keyFn;
    if (o && t)
      for (var a = {
        typename: t,
        fieldName: n,
        field: e.field || null,
        variables: e.variables
      }, l = Hi(e); o; ) {
        var h = o(l, a);
        if (de(h))
          o = Wo(h);
        else {
          s = h || n;
          break;
        }
      }
    return s === void 0 && (s = e.field ? Vh(e.field, e.variables) : ss(n, Hi(e))), s === !1 ? n : n === kt(s) ? s : n + ":" + s;
  }, r.prototype.readField = function(e, t) {
    var n = e.from;
    if (n) {
      var i = e.field || e.fieldName;
      if (i) {
        if (e.typename === void 0) {
          var s = t.store.getFieldValue(n, "__typename");
          s && (e.typename = s);
        }
        var o = this.getStoreFieldName(e), a = kt(o), l = t.store.getFieldValue(n, o), h = this.getFieldPolicy(e.typename, a, !1), c = h && h.read;
        if (c) {
          var d = Jo(this, n, e, t, t.store.getStorage(Z(n) ? n.__ref : n, o));
          return gs.withValue(this.cache, c, [l, d]);
        }
        return l;
      }
    }
  }, r.prototype.getReadFunction = function(e, t) {
    var n = this.getFieldPolicy(e, t, !1);
    return n && n.read;
  }, r.prototype.getMergeFunction = function(e, t, n) {
    var i = this.getFieldPolicy(e, t, !1), s = i && i.merge;
    return !s && n && (i = this.getTypePolicy(n), s = i && i.merge), s;
  }, r.prototype.runMergeFunction = function(e, t, n, i, s) {
    var o = n.field, a = n.typename, l = n.merge;
    return l === zo ? Nu(i.store)(e, t) : l === Go ? t : (i.overwrite && (e = void 0), l(e, t, Jo(this, void 0, { typename: a, fieldName: o.name.value, field: o, variables: i.variables }, i, s || /* @__PURE__ */ Object.create(null))));
  }, r;
}();
function Jo(r, e, t, n, i) {
  var s = r.getStoreFieldName(t), o = kt(s), a = t.variables || n.variables, l = n.store, h = l.toReference, c = l.canRead;
  return {
    args: Hi(t),
    field: t.field || null,
    fieldName: o,
    storeFieldName: s,
    variables: a,
    isReference: Z,
    toReference: h,
    storage: i,
    cache: r.cache,
    canRead: c,
    readField: function() {
      return r.readField(ws(arguments, e, n), n);
    },
    mergeObjects: Nu(n.store)
  };
}
function ws(r, e, t) {
  var n = r[0], i = r[1], s = r.length, o;
  return typeof n == "string" ? o = {
    fieldName: n,
    from: s > 1 ? i : e
  } : (o = x({}, n), _e.call(o, "from") || (o.from = e)), __DEV__ && o.from === void 0 && __DEV__ && D.warn("Undefined 'from' passed to readField with arguments ".concat(mf(Array.from(r)))), o.variables === void 0 && (o.variables = t), o;
}
function Nu(r) {
  return function(t, n) {
    if (de(t) || de(n))
      throw __DEV__ ? new re("Cannot automatically merge arrays") : new re(4);
    if (ue(t) && ue(n)) {
      var i = r.getFieldValue(t, "__typename"), s = r.getFieldValue(n, "__typename"), o = i && s && i !== s;
      if (o)
        return n;
      if (Z(t) && Yt(n))
        return r.merge(t.__ref, n), t;
      if (Yt(t) && Z(n))
        return r.merge(t, n.__ref), n;
      if (Yt(t) && Yt(n))
        return x(x({}, t), n);
    }
    return n;
  };
}
function li(r, e, t) {
  var n = "".concat(e).concat(t), i = r.flavors.get(n);
  return i || r.flavors.set(n, i = r.clientOnly === e && r.deferred === t ? r : x(x({}, r), { clientOnly: e, deferred: t })), i;
}
var Sp = function() {
  function r(e, t) {
    this.cache = e, this.reader = t;
  }
  return r.prototype.writeToStore = function(e, t) {
    var n = this, i = t.query, s = t.result, o = t.dataId, a = t.variables, l = t.overwrite, h = Kr(i), c = cp();
    a = x(x({}, os(h)), a);
    var d = {
      store: e,
      written: /* @__PURE__ */ Object.create(null),
      merge: function(m, v) {
        return c.merge(m, v);
      },
      variables: a,
      varString: Pt(a),
      fragmentMap: Fn($n(i)),
      overwrite: !!l,
      incomingById: /* @__PURE__ */ new Map(),
      clientOnly: !1,
      deferred: !1,
      flavors: /* @__PURE__ */ new Map()
    }, p = this.processSelectionSet({
      result: s || /* @__PURE__ */ Object.create(null),
      dataId: o,
      selectionSet: h.selectionSet,
      mergeTree: { map: /* @__PURE__ */ new Map() },
      context: d
    });
    if (!Z(p))
      throw __DEV__ ? new re("Could not identify object ".concat(JSON.stringify(s))) : new re(6);
    return d.incomingById.forEach(function(m, v) {
      var w = m.storeObject, _ = m.mergeTree, E = m.fieldNodeSet, T = tr(v);
      if (_ && _.map.size) {
        var I = n.applyMerges(_, T, w, d);
        if (Z(I))
          return;
        w = I;
      }
      if (__DEV__ && !d.overwrite) {
        var A = /* @__PURE__ */ Object.create(null);
        E.forEach(function(F) {
          F.selectionSet && (A[F.name.value] = !0);
        });
        var R = function(F) {
          return A[kt(F)] === !0;
        }, N = function(F) {
          var B = _ && _.map.get(F);
          return !!(B && B.info && B.info.merge);
        };
        Object.keys(w).forEach(function(F) {
          R(F) && !N(F) && kp(T, w, F, d.store);
        });
      }
      e.merge(v, w);
    }), e.retain(p.__ref), p;
  }, r.prototype.processSelectionSet = function(e) {
    var t = this, n = e.dataId, i = e.result, s = e.selectionSet, o = e.context, a = e.mergeTree, l = this.cache.policies, h = /* @__PURE__ */ Object.create(null), c = n && l.rootTypenamesById[n] || Ci(i, s, o.fragmentMap) || n && o.store.get(n, "__typename");
    typeof c == "string" && (h.__typename = c);
    var d = function() {
      var I = ws(arguments, h, o.variables);
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
    this.flattenFields(s, i, o, c).forEach(function(I, A) {
      var R, N = qt(A), F = i[N];
      if (p.add(A), F !== void 0) {
        var B = l.getStoreFieldName({
          typename: c,
          fieldName: A.name.value,
          field: A,
          variables: I.variables
        }), q = Yo(a, B), z = t.processFieldValue(F, A, A.selectionSet ? li(I, !1, !1) : I, q), Y = void 0;
        A.selectionSet && (Z(z) || Yt(z)) && (Y = d("__typename", z));
        var Ae = l.getMergeFunction(c, A.name.value, Y);
        Ae ? q.info = {
          field: A,
          typename: c,
          merge: Ae
        } : Xo(a, B), h = I.merge(h, (R = {}, R[B] = z, R));
      } else __DEV__ && !I.clientOnly && !I.deferred && !us.added(A) && !l.getReadFunction(c, A.name.value) && __DEV__ && D.error("Missing field '".concat(qt(A), "' while writing result ").concat(JSON.stringify(i, null, 2)).substring(0, 1e3));
    });
    try {
      var m = l.identify(i, {
        typename: c,
        selectionSet: s,
        fragmentMap: o.fragmentMap,
        storeObject: h,
        readField: d
      }), v = m[0], w = m[1];
      n = n || v, w && (h = o.merge(h, w));
    } catch (I) {
      if (!n)
        throw I;
    }
    if (typeof n == "string") {
      var _ = tr(n), E = o.written[n] || (o.written[n] = []);
      if (E.indexOf(s) >= 0 || (E.push(s), this.reader && this.reader.isFresh(i, _, s, o)))
        return _;
      var T = o.incomingById.get(n);
      return T ? (T.storeObject = o.merge(T.storeObject, h), T.mergeTree = Wi(T.mergeTree, a), p.forEach(function(I) {
        return T.fieldNodeSet.add(I);
      })) : o.incomingById.set(n, {
        storeObject: h,
        mergeTree: xn(a) ? void 0 : a,
        fieldNodeSet: p
      }), _;
    }
    return h;
  }, r.prototype.processFieldValue = function(e, t, n, i) {
    var s = this;
    return !t.selectionSet || e === null ? __DEV__ ? cu(e) : e : de(e) ? e.map(function(o, a) {
      var l = s.processFieldValue(o, t, n, Yo(i, a));
      return Xo(i, a), l;
    }) : this.processSelectionSet({
      result: e,
      selectionSet: t.selectionSet,
      context: n,
      mergeTree: i
    });
  }, r.prototype.flattenFields = function(e, t, n, i) {
    i === void 0 && (i = Ci(t, e, n.fragmentMap));
    var s = /* @__PURE__ */ new Map(), o = this.cache.policies, a = new Gr(!1);
    return function l(h, c) {
      var d = a.lookup(h, c.clientOnly, c.deferred);
      d.visited || (d.visited = !0, h.selections.forEach(function(p) {
        if (Dn(p, n.variables)) {
          var m = c.clientOnly, v = c.deferred;
          if (!(m && v) && jt(p.directives) && p.directives.forEach(function(E) {
            var T = E.name.value;
            if (T === "client" && (m = !0), T === "defer") {
              var I = Mn(E, n.variables);
              (!I || I.if !== !1) && (v = !0);
            }
          }), yt(p)) {
            var w = s.get(p);
            w && (m = m && w.clientOnly, v = v && w.deferred), s.set(p, li(n, m, v));
          } else {
            var _ = is(p, n.fragmentMap);
            _ && o.fragmentMatches(_, i, t, n.variables) && l(_.selectionSet, li(n, m, v));
          }
        }
      }));
    }(e, n), s;
  }, r.prototype.applyMerges = function(e, t, n, i, s) {
    var o, a = this;
    if (e.map.size && !Z(n)) {
      var l = !de(n) && (Z(t) || Yt(t)) ? t : void 0, h = n;
      l && !s && (s = [Z(l) ? l.__ref : l]);
      var c, d = function(p, m) {
        return de(p) ? typeof m == "number" ? p[m] : void 0 : i.store.getFieldValue(p, String(m));
      };
      e.map.forEach(function(p, m) {
        var v = d(l, m), w = d(h, m);
        if (w !== void 0) {
          s && s.push(m);
          var _ = a.applyMerges(p, v, w, i, s);
          _ !== w && (c = c || /* @__PURE__ */ new Map(), c.set(m, _)), s && D(s.pop() === m);
        }
      }), c && (n = de(h) ? h.slice(0) : x({}, h), c.forEach(function(p, m) {
        n[m] = p;
      }));
    }
    return e.info ? this.cache.policies.runMergeFunction(t, n, e.info, i, s && (o = i.store).getStorage.apply(o, s)) : n;
  }, r;
}(), Du = [];
function Yo(r, e) {
  var t = r.map;
  return t.has(e) || t.set(e, Du.pop() || { map: /* @__PURE__ */ new Map() }), t.get(e);
}
function Wi(r, e) {
  if (r === e || !e || xn(e))
    return r;
  if (!r || xn(r))
    return e;
  var t = r.info && e.info ? x(x({}, r.info), e.info) : r.info || e.info, n = r.map.size && e.map.size, i = n ? /* @__PURE__ */ new Map() : r.map.size ? r.map : e.map, s = { info: t, map: i };
  if (n) {
    var o = new Set(e.map.keys());
    r.map.forEach(function(a, l) {
      s.map.set(l, Wi(a, e.map.get(l))), o.delete(l);
    }), o.forEach(function(a) {
      s.map.set(a, Wi(e.map.get(a), r.map.get(a)));
    });
  }
  return s;
}
function xn(r) {
  return !r || !(r.info || r.map.size);
}
function Xo(r, e) {
  var t = r.map, n = t.get(e);
  n && xn(n) && (Du.push(n), t.delete(e));
}
var Zo = /* @__PURE__ */ new Set();
function kp(r, e, t, n) {
  var i = function(d) {
    var p = n.getFieldValue(d, t);
    return typeof p == "object" && p;
  }, s = i(r);
  if (s) {
    var o = i(e);
    if (o && !Z(s) && !Se(s, o) && !Object.keys(s).every(function(d) {
      return n.getFieldValue(o, d) !== void 0;
    })) {
      var a = n.getFieldValue(r, "__typename") || n.getFieldValue(e, "__typename"), l = kt(t), h = "".concat(a, ".").concat(l);
      if (!Zo.has(h)) {
        Zo.add(h);
        var c = [];
        !de(s) && !de(o) && [s, o].forEach(function(d) {
          var p = n.getFieldValue(d, "__typename");
          typeof p == "string" && !c.includes(p) && c.push(p);
        }), __DEV__ && D.warn("Cache data may be lost when replacing the ".concat(l, " field of a ").concat(a, ` object.

To address this problem (which is not a bug in Apollo Client), `).concat(c.length ? "either ensure all objects of type " + c.join(" and ") + " have an ID or a custom merge function, or " : "", "define a custom merge function for the ").concat(h, ` field, so InMemoryCache can safely merge these objects:

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
var xp = function(r) {
  je(e, r);
  function e(t) {
    t === void 0 && (t = {});
    var n = r.call(this) || this;
    return n.watches = /* @__PURE__ */ new Set(), n.typenameDocumentCache = /* @__PURE__ */ new Map(), n.makeVar = bp, n.txCount = 0, n.config = ap(t), n.addTypename = !!n.config.addTypename, n.policies = new Ep({
      cache: n,
      dataIdFromObject: n.config.dataIdFromObject,
      possibleTypes: n.config.possibleTypes,
      typePolicies: n.config.typePolicies
    }), n.init(), n;
  }
  return e.prototype.init = function() {
    var t = this.data = new Ur.Root({
      policies: this.policies,
      resultCaching: this.config.resultCaching
    });
    this.optimisticData = t.stump, this.resetResultCache();
  }, e.prototype.resetResultCache = function(t) {
    var n = this, i = this.storeReader;
    this.storeWriter = new Sp(this, this.storeReader = new pp({
      cache: this,
      addTypename: this.addTypename,
      resultCacheMaxSize: this.config.resultCacheMaxSize,
      canonizeResults: Tu(this.config),
      canon: t ? void 0 : i && i.canon
    })), this.maybeBroadcastWatch = kn(function(s, o) {
      return n.broadcastWatch(s, o);
    }, {
      max: this.config.resultCacheMaxSize,
      makeCacheKey: function(s) {
        var o = s.optimistic ? n.optimisticData : n.data;
        if (Rr(o)) {
          var a = s.optimistic, l = s.rootId, h = s.variables;
          return o.makeCacheKey(s.query, s.callback, Pt({ optimistic: a, rootId: l, variables: h }));
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
    var n = t.returnPartialData, i = n === void 0 ? !1 : n;
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
    var n = t.optimistic ? this.optimisticData : this.data;
    try {
      return ++this.txCount, n.modify(t.id || "ROOT_QUERY", t.fields);
    } finally {
      !--this.txCount && t.broadcast !== !1 && this.broadcastWatches();
    }
  }, e.prototype.diff = function(t) {
    return this.storeReader.diffQueryAgainstStore(x(x({}, t), { store: t.optimistic ? this.optimisticData : this.data, rootId: t.id || "ROOT_QUERY", config: this.config }));
  }, e.prototype.watch = function(t) {
    var n = this;
    return this.watches.size || vp(this), this.watches.add(t), t.immediate && this.maybeBroadcastWatch(t), function() {
      n.watches.delete(t) && !n.watches.size && Vo(n), n.maybeBroadcastWatch.forget(t);
    };
  }, e.prototype.gc = function(t) {
    Pt.reset();
    var n = this.optimisticData.gc();
    return t && !this.txCount && (t.resetResultCache ? this.resetResultCache(t.resetResultIdentities) : t.resetResultIdentities && this.storeReader.resetCanon()), n;
  }, e.prototype.retain = function(t, n) {
    return (n ? this.optimisticData : this.data).retain(t);
  }, e.prototype.release = function(t, n) {
    return (n ? this.optimisticData : this.data).release(t);
  }, e.prototype.identify = function(t) {
    if (Z(t))
      return t.__ref;
    try {
      return this.policies.identify(t)[0];
    } catch (n) {
      __DEV__ && D.warn(n);
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
    var n = this;
    return this.init(), Pt.reset(), t && t.discardWatches ? (this.watches.forEach(function(i) {
      return n.maybeBroadcastWatch.forget(i);
    }), this.watches.clear(), Vo(this)) : this.broadcastWatches(), Promise.resolve();
  }, e.prototype.removeOptimistic = function(t) {
    var n = this.optimisticData.removeLayer(t);
    n !== this.optimisticData && (this.optimisticData = n, this.broadcastWatches());
  }, e.prototype.batch = function(t) {
    var n = this, i = t.update, s = t.optimistic, o = s === void 0 ? !0 : s, a = t.removeOptimistic, l = t.onWatchUpdated, h, c = function(p) {
      var m = n, v = m.data, w = m.optimisticData;
      ++n.txCount, p && (n.data = n.optimisticData = p);
      try {
        return h = i(n);
      } finally {
        --n.txCount, n.data = v, n.optimisticData = w;
      }
    }, d = /* @__PURE__ */ new Set();
    return l && !this.txCount && this.broadcastWatches(x(x({}, t), { onWatchUpdated: function(p) {
      return d.add(p), !1;
    } })), typeof o == "string" ? this.optimisticData = this.optimisticData.addLayer(o, c) : o === !1 ? c(this.data) : c(), typeof a == "string" && (this.optimisticData = this.optimisticData.removeLayer(a)), l && d.size ? (this.broadcastWatches(x(x({}, t), { onWatchUpdated: function(p, m) {
      var v = l.call(this, p, m);
      return v !== !1 && d.delete(p), v;
    } })), d.size && d.forEach(function(p) {
      return n.maybeBroadcastWatch.dirty(p);
    })) : this.broadcastWatches(t), h;
  }, e.prototype.performTransaction = function(t, n) {
    return this.batch({
      update: t,
      optimistic: n || n !== null
    });
  }, e.prototype.transformDocument = function(t) {
    if (this.addTypename) {
      var n = this.typenameDocumentCache.get(t);
      return n || (n = us(t), this.typenameDocumentCache.set(t, n), this.typenameDocumentCache.set(n, n)), n;
    }
    return t;
  }, e.prototype.broadcastWatches = function(t) {
    var n = this;
    this.txCount || this.watches.forEach(function(i) {
      return n.maybeBroadcastWatch(i, t);
    });
  }, e.prototype.broadcastWatch = function(t, n) {
    var i = t.lastDiff, s = this.diff(t);
    n && (t.optimistic && typeof n.optimistic == "string" && (s.fromOptimisticTransaction = !0), n.onWatchUpdated && n.onWatchUpdated.call(this, t, s, i) === !1) || (!i || !Se(i.result, s.result)) && t.callback(t.lastDiff = s, i);
  }, e;
}(op);
function Tp(r) {
  return r.hasOwnProperty("graphQLErrors");
}
var Ap = function(r) {
  var e = "";
  if (jt(r.graphQLErrors) || jt(r.clientErrors)) {
    var t = (r.graphQLErrors || []).concat(r.clientErrors || []);
    t.forEach(function(n) {
      var i = n ? n.message : "Error message not found.";
      e += "".concat(i, `
`);
    });
  }
  return r.networkError && (e += "".concat(r.networkError.message, `
`)), e = e.replace(/\n$/, ""), e;
}, Rt = function(r) {
  je(e, r);
  function e(t) {
    var n = t.graphQLErrors, i = t.clientErrors, s = t.networkError, o = t.errorMessage, a = t.extraInfo, l = r.call(this, o) || this;
    return l.graphQLErrors = n || [], l.clientErrors = i || [], l.networkError = s || null, l.message = o || Ap(l), l.extraInfo = a, l.__proto__ = e.prototype, l;
  }
  return e;
}(Error), se;
(function(r) {
  r[r.loading = 1] = "loading", r[r.setVariables = 2] = "setVariables", r[r.fetchMore = 3] = "fetchMore", r[r.refetch = 4] = "refetch", r[r.poll = 6] = "poll", r[r.ready = 7] = "ready", r[r.error = 8] = "error";
})(se || (se = {}));
function qr(r) {
  return r ? r < 7 : !1;
}
var Ip = Object.assign, Op = Object.hasOwnProperty, ea = !1, Ki = function(r) {
  je(e, r);
  function e(t) {
    var n = t.queryManager, i = t.queryInfo, s = t.options, o = r.call(this, function(l) {
      try {
        var h = l._subscription._observer;
        h && !h.error && (h.error = Cp);
      } catch {
      }
      var c = !o.observers.size;
      o.observers.add(l);
      var d = o.last;
      return d && d.error ? l.error && l.error(d.error) : d && d.result && l.next && l.next(d.result), c && o.reobserve().catch(function() {
      }), function() {
        o.observers.delete(l) && !o.observers.size && o.tearDownQuery();
      };
    }) || this;
    o.observers = /* @__PURE__ */ new Set(), o.subscriptions = /* @__PURE__ */ new Set(), o.isTornDown = !1, o.options = s, o.queryId = i.queryId || n.generateQueryId();
    var a = Kr(s.query);
    return o.queryName = a && a.name && a.name.value, o.initialFetchPolicy = s.fetchPolicy || "cache-first", o.queryManager = n, o.queryInfo = i, o;
  }
  return Object.defineProperty(e.prototype, "variables", {
    get: function() {
      return this.options.variables;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.result = function() {
    var t = this;
    return new Promise(function(n, i) {
      var s = {
        next: function(a) {
          n(a), t.observers.delete(s), t.observers.size || t.queryManager.removeQuery(t.queryId), setTimeout(function() {
            o.unsubscribe();
          }, 0);
        },
        error: i
      }, o = t.subscribe(s);
    });
  }, e.prototype.getCurrentResult = function(t) {
    t === void 0 && (t = !0);
    var n = this.getLastResult(!0), i = this.queryInfo.networkStatus || n && n.networkStatus || se.ready, s = x(x({}, n), { loading: qr(i), networkStatus: i }), o = this.options.fetchPolicy, a = o === void 0 ? "cache-first" : o;
    if (!(a === "network-only" || a === "no-cache" || a === "standby" || this.queryManager.transform(this.options.query).hasForcedResolvers)) {
      var l = this.queryInfo.getDiff();
      (l.complete || this.options.returnPartialData) && (s.data = l.result), Se(s.data, {}) && (s.data = void 0), l.complete ? (delete s.partial, l.complete && s.networkStatus === se.loading && (a === "cache-first" || a === "cache-only") && (s.networkStatus = se.ready, s.loading = !1)) : s.partial = !0, __DEV__ && !l.complete && !this.options.partialRefetch && !s.loading && !s.data && !s.error && Fu(l.missing);
    }
    return t && this.updateLastResult(s), s;
  }, e.prototype.isDifferentFromLastResult = function(t) {
    return !this.last || !Se(this.last.result, t);
  }, e.prototype.getLast = function(t, n) {
    var i = this.last;
    if (i && i[t] && (!n || Se(i.variables, this.variables)))
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
    var n, i = {
      pollInterval: 0
    }, s = this.options.fetchPolicy;
    if (s === "cache-and-network" ? i.fetchPolicy = s : s === "no-cache" ? i.fetchPolicy = "no-cache" : i.fetchPolicy = "network-only", __DEV__ && t && Op.call(t, "variables")) {
      var o = tu(this.options.query), a = o.variableDefinitions;
      (!a || !a.some(function(l) {
        return l.variable.name.value === "variables";
      })) && __DEV__ && D.warn("Called refetch(".concat(JSON.stringify(t), ") for query ").concat(((n = o.name) === null || n === void 0 ? void 0 : n.value) || JSON.stringify(o), `, which does not declare a $variables variable.
Did you mean to call refetch(variables) instead of refetch({ variables })?`));
    }
    return t && !Se(this.options.variables, t) && (i.variables = this.options.variables = x(x({}, this.options.variables), t)), this.queryInfo.resetLastWrite(), this.reobserve(i, se.refetch);
  }, e.prototype.fetchMore = function(t) {
    var n = this, i = x(x({}, t.query ? t : x(x(x({}, this.options), t), { variables: x(x({}, this.options.variables), t.variables) })), { fetchPolicy: "no-cache" }), s = this.queryManager.generateQueryId();
    return i.notifyOnNetworkStatusChange && (this.queryInfo.networkStatus = se.fetchMore, this.observe()), this.queryManager.fetchQuery(s, i, se.fetchMore).then(function(o) {
      var a = o.data, l = t.updateQuery;
      return l ? (__DEV__ && !ea && (__DEV__ && D.warn(`The updateQuery callback for fetchMore is deprecated, and will be removed
in the next major version of Apollo Client.

Please convert updateQuery functions to field policies with appropriate
read and merge functions, or use/adapt a helper function (such as
concatPagination, offsetLimitPagination, or relayStylePagination) from
@apollo/client/utilities.

The field policy system handles pagination more effectively than a
hand-written updateQuery function, and you only need to define the policy
once, rather than every time you call fetchMore.`), ea = !0), n.updateQuery(function(h) {
        return l(h, {
          fetchMoreResult: a,
          variables: i.variables
        });
      })) : n.queryManager.cache.writeQuery({
        query: i.query,
        variables: i.variables,
        data: a
      }), o;
    }).finally(function() {
      n.queryManager.stopQuery(s), n.reobserve();
    });
  }, e.prototype.subscribeToMore = function(t) {
    var n = this, i = this.queryManager.startGraphQLSubscription({
      query: t.document,
      variables: t.variables,
      context: t.context
    }).subscribe({
      next: function(s) {
        var o = t.updateQuery;
        o && n.updateQuery(function(a, l) {
          var h = l.variables;
          return o(a, {
            subscriptionData: s,
            variables: h
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
      n.subscriptions.delete(i) && i.unsubscribe();
    };
  }, e.prototype.setOptions = function(t) {
    return this.reobserve(t);
  }, e.prototype.setVariables = function(t) {
    return Se(this.variables, t) ? this.observers.size ? this.result() : Promise.resolve() : (this.options.variables = t, this.observers.size ? this.reobserve({
      fetchPolicy: this.initialFetchPolicy,
      variables: t
    }, se.setVariables) : Promise.resolve());
  }, e.prototype.updateQuery = function(t) {
    var n = this.queryManager, i = n.cache.diff({
      query: this.options.query,
      variables: this.variables,
      returnPartialData: !0,
      optimistic: !1
    }).result, s = t(i, {
      variables: this.variables
    });
    s && (n.cache.writeQuery({
      query: this.options.query,
      data: s,
      variables: this.variables
    }), n.broadcastQueries());
  }, e.prototype.startPolling = function(t) {
    this.options.pollInterval = t, this.updatePolling();
  }, e.prototype.stopPolling = function() {
    this.options.pollInterval = 0, this.updatePolling();
  }, e.prototype.fetch = function(t, n) {
    return this.queryManager.setObservableQuery(this), this.queryManager.fetchQueryObservable(this.queryId, t, n);
  }, e.prototype.updatePolling = function() {
    var t = this;
    if (!this.queryManager.ssrMode) {
      var n = this, i = n.pollingInfo, s = n.options.pollInterval;
      if (!s) {
        i && (clearTimeout(i.timeout), delete this.pollingInfo);
        return;
      }
      if (!(i && i.interval === s)) {
        __DEV__ ? D(s, "Attempted to start a polling query without a polling interval.") : D(s, 10);
        var o = i || (this.pollingInfo = {});
        o.interval = s;
        var a = function() {
          t.pollingInfo && (qr(t.queryInfo.networkStatus) ? l() : t.reobserve({
            fetchPolicy: "network-only"
          }, se.poll).then(l, l));
        }, l = function() {
          var h = t.pollingInfo;
          h && (clearTimeout(h.timeout), h.timeout = setTimeout(a, h.interval));
        };
        l();
      }
    }
  }, e.prototype.updateLastResult = function(t, n) {
    return n === void 0 && (n = this.variables), this.last = x(x({}, this.last), { result: this.queryManager.assumeImmutableResults ? t : cu(t), variables: n }), jt(t.errors) || delete this.last.error, this.last;
  }, e.prototype.reobserve = function(t, n) {
    var i = this;
    this.isTornDown = !1;
    var s = n === se.refetch || n === se.fetchMore || n === se.poll, o = this.options.variables, a = s ? Pr(this.options, t) : Ip(this.options, Pr(t));
    s || (this.updatePolling(), t && t.variables && !t.fetchPolicy && !Se(t.variables, o) && (a.fetchPolicy = this.initialFetchPolicy, n === void 0 && (n = se.setVariables)));
    var l = a.variables && x({}, a.variables), h = this.fetch(a, n), c = {
      next: function(d) {
        i.reportResult(d, l);
      },
      error: function(d) {
        i.reportError(d, l);
      }
    };
    return s || (this.concast && this.observer && this.concast.removeObserver(this.observer, !0), this.concast = h, this.observer = c), h.addObserver(c), h.promise;
  }, e.prototype.observe = function() {
    this.reportResult(this.getCurrentResult(!1), this.variables);
  }, e.prototype.reportResult = function(t, n) {
    var i = this.getLastError();
    (i || this.isDifferentFromLastResult(t)) && ((i || !t.partial || this.options.returnPartialData) && this.updateLastResult(t, n), Cr(this.observers, "next", t));
  }, e.prototype.reportError = function(t, n) {
    var i = x(x({}, this.getLastResult()), { error: t, errors: t.graphQLErrors, networkStatus: se.error, loading: !1 });
    this.updateLastResult(i, n), Cr(this.observers, "error", this.last.error = t);
  }, e.prototype.hasObservers = function() {
    return this.observers.size > 0;
  }, e.prototype.tearDownQuery = function() {
    this.isTornDown || (this.concast && this.observer && (this.concast.removeObserver(this.observer), delete this.concast, delete this.observer), this.stopPolling(), this.subscriptions.forEach(function(t) {
      return t.unsubscribe();
    }), this.subscriptions.clear(), this.queryManager.stopQuery(this.queryId), this.observers.clear(), this.isTornDown = !0);
  }, e;
}(ee);
lu(Ki);
function Cp(r) {
  __DEV__ && D.error("Unhandled error", r.message, r.stack);
}
function Fu(r) {
  __DEV__ && r && __DEV__ && D.debug("Missing cache result fields: ".concat(JSON.stringify(r)), r);
}
function Rp(r) {
  var e = r.fetchPolicy, t = e === void 0 ? "cache-first" : e, n = r.nextFetchPolicy;
  n && (r.fetchPolicy = typeof n == "function" ? n.call(r, t) : n);
}
var Mu = function() {
  function r(e) {
    var t = e.cache, n = e.client, i = e.resolvers, s = e.fragmentMatcher;
    this.cache = t, n && (this.client = n), i && this.addResolvers(i), s && this.setFragmentMatcher(s);
  }
  return r.prototype.addResolvers = function(e) {
    var t = this;
    this.resolvers = this.resolvers || {}, Array.isArray(e) ? e.forEach(function(n) {
      t.resolvers = mo(t.resolvers, n);
    }) : this.resolvers = mo(this.resolvers, e);
  }, r.prototype.setResolvers = function(e) {
    this.resolvers = {}, this.addResolvers(e);
  }, r.prototype.getResolvers = function() {
    return this.resolvers || {};
  }, r.prototype.runResolvers = function(e) {
    var t = e.document, n = e.remoteResult, i = e.context, s = e.variables, o = e.onlyRunForcedResolvers, a = o === void 0 ? !1 : o;
    return Ot(this, void 0, void 0, function() {
      return Ct(this, function(l) {
        return t ? [2, this.resolveDocument(t, n.data, i, s, this.fragmentMatcher, a).then(function(h) {
          return x(x({}, n), { data: h.result });
        })] : [2, n];
      });
    });
  }, r.prototype.setFragmentMatcher = function(e) {
    this.fragmentMatcher = e;
  }, r.prototype.getFragmentMatcher = function() {
    return this.fragmentMatcher;
  }, r.prototype.clientQuery = function(e) {
    return Oi(["client"], e) && this.resolvers ? e : null;
  }, r.prototype.serverQuery = function(e) {
    return Zh(e);
  }, r.prototype.prepareContext = function(e) {
    var t = this.cache;
    return x(x({}, e), { cache: t, getCacheKey: function(n) {
      return t.identify(n);
    } });
  }, r.prototype.addExportedVariables = function(e, t, n) {
    return t === void 0 && (t = {}), n === void 0 && (n = {}), Ot(this, void 0, void 0, function() {
      return Ct(this, function(i) {
        return e ? [2, this.resolveDocument(e, this.buildRootValueFromCache(e, t) || {}, this.prepareContext(n), t).then(function(s) {
          return x(x({}, t), s.exportedVariables);
        })] : [2, x({}, t)];
      });
    });
  }, r.prototype.shouldForceResolvers = function(e) {
    var t = !1;
    return nt(e, {
      Directive: {
        enter: function(n) {
          if (n.name.value === "client" && n.arguments && (t = n.arguments.some(function(i) {
            return i.name.value === "always" && i.value.kind === "BooleanValue" && i.value.value === !0;
          }), t))
            return Za;
        }
      }
    }), t;
  }, r.prototype.buildRootValueFromCache = function(e, t) {
    return this.cache.diff({
      query: Xh(e),
      variables: t,
      returnPartialData: !0,
      optimistic: !1
    }).result;
  }, r.prototype.resolveDocument = function(e, t, n, i, s, o) {
    return n === void 0 && (n = {}), i === void 0 && (i = {}), s === void 0 && (s = function() {
      return !0;
    }), o === void 0 && (o = !1), Ot(this, void 0, void 0, function() {
      var a, l, h, c, d, p, m, v, w;
      return Ct(this, function(_) {
        return a = Bn(e), l = $n(e), h = Fn(l), c = a.operation, d = c ? c.charAt(0).toUpperCase() + c.slice(1) : "Query", p = this, m = p.cache, v = p.client, w = {
          fragmentMap: h,
          context: x(x({}, n), { cache: m, client: v }),
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
  }, r.prototype.resolveSelectionSet = function(e, t, n) {
    return Ot(this, void 0, void 0, function() {
      var i, s, o, a, l, h = this;
      return Ct(this, function(c) {
        return i = n.fragmentMap, s = n.context, o = n.variables, a = [t], l = function(d) {
          return Ot(h, void 0, void 0, function() {
            var p, m;
            return Ct(this, function(v) {
              return Dn(d, o) ? yt(d) ? [2, this.resolveField(d, t, n).then(function(w) {
                var _;
                typeof w < "u" && a.push((_ = {}, _[qt(d)] = w, _));
              })] : (eu(d) ? p = d : (p = i[d.name.value], __DEV__ ? D(p, "No fragment named ".concat(d.name.value)) : D(p, 9)), p && p.typeCondition && (m = p.typeCondition.name.value, n.fragmentMatcher(t, m, s)) ? [2, this.resolveSelectionSet(p.selectionSet, t, n).then(function(w) {
                a.push(w);
              })] : [2]) : [2];
            });
          });
        }, [2, Promise.all(e.selections.map(l)).then(function() {
          return su(a);
        })];
      });
    });
  }, r.prototype.resolveField = function(e, t, n) {
    return Ot(this, void 0, void 0, function() {
      var i, s, o, a, l, h, c, d, p, m = this;
      return Ct(this, function(v) {
        return i = n.variables, s = e.name.value, o = qt(e), a = s !== o, l = t[o] || t[s], h = Promise.resolve(l), (!n.onlyRunForcedResolvers || this.shouldForceResolvers(e)) && (c = t.__typename || n.defaultOperationType, d = this.resolvers && this.resolvers[c], d && (p = d[a ? s : o], p && (h = Promise.resolve(gs.withValue(this.cache, p, [
          t,
          Mn(e, i),
          n.context,
          { field: e, fragmentMap: n.fragmentMap }
        ]))))), [2, h.then(function(w) {
          if (w === void 0 && (w = l), e.directives && e.directives.forEach(function(_) {
            _.name.value === "export" && _.arguments && _.arguments.forEach(function(E) {
              E.name.value === "as" && E.value.kind === "StringValue" && (n.exportedVariables[E.value.value] = w);
            });
          }), !e.selectionSet || w == null)
            return w;
          if (Array.isArray(w))
            return m.resolveSubSelectedArray(e, w, n);
          if (e.selectionSet)
            return m.resolveSelectionSet(e.selectionSet, w, n);
        })];
      });
    });
  }, r.prototype.resolveSubSelectedArray = function(e, t, n) {
    var i = this;
    return Promise.all(t.map(function(s) {
      if (s === null)
        return null;
      if (Array.isArray(s))
        return i.resolveSubSelectedArray(e, s, n);
      if (e.selectionSet)
        return i.resolveSelectionSet(e.selectionSet, s, n);
    }));
  }, r;
}(), Xt = new (Qt ? WeakMap : Map)();
function hi(r, e) {
  var t = r[e];
  typeof t == "function" && (r[e] = function() {
    return Xt.set(r, (Xt.get(r) + 1) % 1e15), t.apply(this, arguments);
  });
}
function ta(r) {
  r.notifyTimeout && (clearTimeout(r.notifyTimeout), r.notifyTimeout = void 0);
}
var fi = function() {
  function r(e, t) {
    t === void 0 && (t = e.generateQueryId()), this.queryId = t, this.listeners = /* @__PURE__ */ new Set(), this.document = null, this.lastRequestId = 1, this.subscriptions = /* @__PURE__ */ new Set(), this.stopped = !1, this.dirty = !1, this.observableQuery = null;
    var n = this.cache = e.cache;
    Xt.has(n) || (Xt.set(n, 0), hi(n, "evict"), hi(n, "modify"), hi(n, "reset"));
  }
  return r.prototype.init = function(e) {
    var t = e.networkStatus || se.loading;
    return this.variables && this.networkStatus !== se.loading && !Se(this.variables, e.variables) && (t = se.setVariables), Se(e.variables, this.variables) || (this.lastDiff = void 0), Object.assign(this, {
      document: e.document,
      variables: e.variables,
      networkError: null,
      graphQLErrors: this.graphQLErrors || [],
      networkStatus: t
    }), e.observableQuery && this.setObservableQuery(e.observableQuery), e.lastRequestId && (this.lastRequestId = e.lastRequestId), this;
  }, r.prototype.reset = function() {
    ta(this), this.lastDiff = void 0, this.dirty = !1;
  }, r.prototype.getDiff = function(e) {
    e === void 0 && (e = this.variables);
    var t = this.getDiffOptions(e);
    if (this.lastDiff && Se(t, this.lastDiff.options))
      return this.lastDiff.diff;
    this.updateWatch(this.variables = e);
    var n = this.observableQuery;
    if (n && n.options.fetchPolicy === "no-cache")
      return { complete: !1 };
    var i = this.cache.diff(t);
    return this.updateLastDiff(i, t), i;
  }, r.prototype.updateLastDiff = function(e, t) {
    this.lastDiff = e ? {
      diff: e,
      options: t || this.getDiffOptions()
    } : void 0;
  }, r.prototype.getDiffOptions = function(e) {
    var t;
    return e === void 0 && (e = this.variables), {
      query: this.document,
      variables: e,
      returnPartialData: !0,
      optimistic: !0,
      canonizeResults: (t = this.observableQuery) === null || t === void 0 ? void 0 : t.options.canonizeResults
    };
  }, r.prototype.setDiff = function(e) {
    var t = this, n = this.lastDiff && this.lastDiff.diff;
    this.updateLastDiff(e), !this.dirty && !Se(n && n.result, e && e.result) && (this.dirty = !0, this.notifyTimeout || (this.notifyTimeout = setTimeout(function() {
      return t.notify();
    }, 0)));
  }, r.prototype.setObservableQuery = function(e) {
    var t = this;
    e !== this.observableQuery && (this.oqListener && this.listeners.delete(this.oqListener), this.observableQuery = e, e ? (e.queryInfo = this, this.listeners.add(this.oqListener = function() {
      t.getDiff().fromOptimisticTransaction ? e.observe() : e.reobserve();
    })) : delete this.oqListener);
  }, r.prototype.notify = function() {
    var e = this;
    ta(this), this.shouldNotify() && this.listeners.forEach(function(t) {
      return t(e);
    }), this.dirty = !1;
  }, r.prototype.shouldNotify = function() {
    if (!this.dirty || !this.listeners.size)
      return !1;
    if (qr(this.networkStatus) && this.observableQuery) {
      var e = this.observableQuery.options.fetchPolicy;
      if (e !== "cache-only" && e !== "cache-and-network")
        return !1;
    }
    return !0;
  }, r.prototype.stop = function() {
    if (!this.stopped) {
      this.stopped = !0, this.reset(), this.cancel(), this.cancel = r.prototype.cancel, this.subscriptions.forEach(function(t) {
        return t.unsubscribe();
      });
      var e = this.observableQuery;
      e && e.stopPolling();
    }
  }, r.prototype.cancel = function() {
  }, r.prototype.updateWatch = function(e) {
    var t = this;
    e === void 0 && (e = this.variables);
    var n = this.observableQuery;
    if (!(n && n.options.fetchPolicy === "no-cache")) {
      var i = x(x({}, this.getDiffOptions(e)), { watcher: this, callback: function(s) {
        return t.setDiff(s);
      } });
      (!this.lastWatch || !Se(i, this.lastWatch)) && (this.cancel(), this.cancel = this.cache.watch(this.lastWatch = i));
    }
  }, r.prototype.resetLastWrite = function() {
    this.lastWrite = void 0;
  }, r.prototype.shouldWrite = function(e, t) {
    var n = this.lastWrite;
    return !(n && n.dmCount === Xt.get(this.cache) && Se(t, n.variables) && Se(e.data, n.result.data));
  }, r.prototype.markResult = function(e, t, n) {
    var i = this;
    this.graphQLErrors = jt(e.errors) ? e.errors : [], this.reset(), t.fetchPolicy === "no-cache" ? this.updateLastDiff({ result: e.data, complete: !0 }, this.getDiffOptions(t.variables)) : n !== 0 && (zi(e, t.errorPolicy) ? this.cache.performTransaction(function(s) {
      if (i.shouldWrite(e, t.variables))
        s.writeQuery({
          query: i.document,
          data: e.data,
          variables: t.variables,
          overwrite: n === 1
        }), i.lastWrite = {
          result: e,
          variables: t.variables,
          dmCount: Xt.get(i.cache)
        };
      else if (i.lastDiff && i.lastDiff.diff.complete) {
        e.data = i.lastDiff.diff.result;
        return;
      }
      var o = i.getDiffOptions(t.variables), a = s.diff(o);
      i.stopped || i.updateWatch(t.variables), i.updateLastDiff(a, o), a.complete && (e.data = a.result);
    }) : this.lastWrite = void 0);
  }, r.prototype.markReady = function() {
    return this.networkError = null, this.networkStatus = se.ready;
  }, r.prototype.markError = function(e) {
    return this.networkStatus = se.error, this.lastWrite = void 0, this.reset(), e.graphQLErrors && (this.graphQLErrors = e.graphQLErrors), e.networkError && (this.networkError = e.networkError), e;
  }, r;
}();
function zi(r, e) {
  e === void 0 && (e = "none");
  var t = e === "ignore" || e === "all", n = !dn(r);
  return !n && t && r.data && (n = !0), n;
}
var Np = Object.prototype.hasOwnProperty, Dp = function() {
  function r(e) {
    var t = e.cache, n = e.link, i = e.queryDeduplication, s = i === void 0 ? !1 : i, o = e.onBroadcast, a = e.ssrMode, l = a === void 0 ? !1 : a, h = e.clientAwareness, c = h === void 0 ? {} : h, d = e.localState, p = e.assumeImmutableResults;
    this.clientAwareness = {}, this.queries = /* @__PURE__ */ new Map(), this.fetchCancelFns = /* @__PURE__ */ new Map(), this.transformCache = new (Qt ? WeakMap : Map)(), this.queryIdCounter = 1, this.requestIdCounter = 1, this.mutationIdCounter = 1, this.inFlightLinkObservables = /* @__PURE__ */ new Map(), this.cache = t, this.link = n, this.queryDeduplication = s, this.clientAwareness = c, this.localState = d || new Mu({ cache: t }), this.ssrMode = l, this.assumeImmutableResults = !!p, (this.onBroadcast = o) && (this.mutationStore = /* @__PURE__ */ Object.create(null));
  }
  return r.prototype.stop = function() {
    var e = this;
    this.queries.forEach(function(t, n) {
      e.stopQueryNoBroadcast(n);
    }), this.cancelPendingFetches(__DEV__ ? new re("QueryManager stopped while query was in flight") : new re(11));
  }, r.prototype.cancelPendingFetches = function(e) {
    this.fetchCancelFns.forEach(function(t) {
      return t(e);
    }), this.fetchCancelFns.clear();
  }, r.prototype.mutate = function(e) {
    var t = e.mutation, n = e.variables, i = e.optimisticResponse, s = e.updateQueries, o = e.refetchQueries, a = o === void 0 ? [] : o, l = e.awaitRefetchQueries, h = l === void 0 ? !1 : l, c = e.update, d = e.onQueryUpdated, p = e.errorPolicy, m = p === void 0 ? "none" : p, v = e.fetchPolicy, w = v === void 0 ? "network-only" : v, _ = e.keepRootFields, E = e.context;
    return Ot(this, void 0, void 0, function() {
      var T, I, A;
      return Ct(this, function(R) {
        switch (R.label) {
          case 0:
            return __DEV__ ? D(t, "mutation option is required. You must specify your GraphQL document in the mutation option.") : D(t, 12), __DEV__ ? D(w === "network-only" || w === "no-cache", "Mutations support only 'network-only' or 'no-cache' fetchPolicy strings. The default `network-only` behavior automatically writes mutation results to the cache. Passing `no-cache` skips the cache write.") : D(w === "network-only" || w === "no-cache", 13), T = this.generateMutationId(), t = this.transform(t).document, n = this.getVariables(t, n), this.transform(t).hasClientExports ? [4, this.localState.addExportedVariables(t, n, E)] : [3, 2];
          case 1:
            n = R.sent(), R.label = 2;
          case 2:
            return I = this.mutationStore && (this.mutationStore[T] = {
              mutation: t,
              variables: n,
              loading: !0,
              error: null
            }), i && this.markMutationOptimistic(i, {
              mutationId: T,
              document: t,
              variables: n,
              fetchPolicy: w,
              errorPolicy: m,
              context: E,
              updateQueries: s,
              update: c,
              keepRootFields: _
            }), this.broadcastQueries(), A = this, [2, new Promise(function(N, F) {
              return ri(A.getObservableFromLink(t, x(x({}, E), { optimisticResponse: i }), n, !1), function(B) {
                if (dn(B) && m === "none")
                  throw new Rt({
                    graphQLErrors: B.errors
                  });
                I && (I.loading = !1, I.error = null);
                var q = x({}, B);
                return typeof a == "function" && (a = a(q)), m === "ignore" && dn(q) && delete q.errors, A.markMutationResult({
                  mutationId: T,
                  result: q,
                  document: t,
                  variables: n,
                  fetchPolicy: w,
                  errorPolicy: m,
                  context: E,
                  update: c,
                  updateQueries: s,
                  awaitRefetchQueries: h,
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
                  I && (I.loading = !1, I.error = B), i && A.cache.removeOptimistic(T), A.broadcastQueries(), F(B instanceof Rt ? B : new Rt({
                    networkError: B
                  }));
                }
              });
            })];
        }
      });
    });
  }, r.prototype.markMutationResult = function(e, t) {
    var n = this;
    t === void 0 && (t = this.cache);
    var i = e.result, s = [], o = e.fetchPolicy === "no-cache";
    if (!o && zi(i, e.errorPolicy)) {
      s.push({
        result: i.data,
        dataId: "ROOT_MUTATION",
        query: e.document,
        variables: e.variables
      });
      var a = e.updateQueries;
      a && this.queries.forEach(function(h, c) {
        var d = h.observableQuery, p = d && d.queryName;
        if (!(!p || !Np.call(a, p))) {
          var m = a[p], v = n.queries.get(c), w = v.document, _ = v.variables, E = t.diff({
            query: w,
            variables: _,
            returnPartialData: !0,
            optimistic: !1
          }), T = E.result, I = E.complete;
          if (I && T) {
            var A = m(T, {
              mutationResult: i,
              queryName: w && Ri(w) || void 0,
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
        updateCache: function(h) {
          o || s.forEach(function(p) {
            return h.write(p);
          });
          var c = e.update;
          if (c) {
            if (!o) {
              var d = h.diff({
                id: "ROOT_MUTATION",
                query: n.transform(e.document).asQuery,
                variables: e.variables,
                optimistic: !1,
                returnPartialData: !0
              });
              d.complete && (i = x(x({}, i), { data: d.result }));
            }
            c(h, i, {
              context: e.context,
              variables: e.variables
            });
          }
          !o && !e.keepRootFields && h.modify({
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
      }).forEach(function(h) {
        return l.push(h);
      }), e.awaitRefetchQueries || e.onQueryUpdated)
        return Promise.all(l).then(function() {
          return i;
        });
    }
    return Promise.resolve(i);
  }, r.prototype.markMutationOptimistic = function(e, t) {
    var n = this, i = typeof e == "function" ? e(t.variables) : e;
    return this.cache.recordOptimisticTransaction(function(s) {
      try {
        n.markMutationResult(x(x({}, t), { result: { data: i } }), s);
      } catch (o) {
        __DEV__ && D.error(o);
      }
    }, t.mutationId);
  }, r.prototype.fetchQuery = function(e, t, n) {
    return this.fetchQueryObservable(e, t, n).promise;
  }, r.prototype.getQueryStore = function() {
    var e = /* @__PURE__ */ Object.create(null);
    return this.queries.forEach(function(t, n) {
      e[n] = {
        variables: t.variables,
        networkStatus: t.networkStatus,
        networkError: t.networkError,
        graphQLErrors: t.graphQLErrors
      };
    }), e;
  }, r.prototype.resetErrors = function(e) {
    var t = this.queries.get(e);
    t && (t.networkError = void 0, t.graphQLErrors = []);
  }, r.prototype.transform = function(e) {
    var t = this.transformCache;
    if (!t.has(e)) {
      var n = this.cache.transformDocument(e), i = zh(this.cache.transformForLink(n)), s = this.localState.clientQuery(n), o = i && this.localState.serverQuery(i), a = {
        document: n,
        hasClientExports: Oh(n),
        hasForcedResolvers: this.localState.shouldForceResolvers(n),
        clientQuery: s,
        serverQuery: o,
        defaultVars: os(Kr(n)),
        asQuery: x(x({}, n), { definitions: n.definitions.map(function(h) {
          return h.kind === "OperationDefinition" && h.operation !== "query" ? x(x({}, h), { operation: "query" }) : h;
        }) })
      }, l = function(h) {
        h && !t.has(h) && t.set(h, a);
      };
      l(e), l(n), l(s), l(o);
    }
    return t.get(e);
  }, r.prototype.getVariables = function(e, t) {
    return x(x({}, this.transform(e).defaultVars), t);
  }, r.prototype.watchQuery = function(e) {
    e = x(x({}, e), { variables: this.getVariables(e.query, e.variables) }), typeof e.notifyOnNetworkStatusChange > "u" && (e.notifyOnNetworkStatusChange = !1);
    var t = new fi(this), n = new Ki({
      queryManager: this,
      queryInfo: t,
      options: e
    });
    return this.queries.set(n.queryId, t), t.init({
      document: e.query,
      observableQuery: n,
      variables: e.variables
    }), n;
  }, r.prototype.query = function(e, t) {
    var n = this;
    return t === void 0 && (t = this.generateQueryId()), __DEV__ ? D(e.query, "query option is required. You must specify your GraphQL document in the query option.") : D(e.query, 14), __DEV__ ? D(e.query.kind === "Document", 'You must wrap the query string in a "gql" tag.') : D(e.query.kind === "Document", 15), __DEV__ ? D(!e.returnPartialData, "returnPartialData option only supported on watchQuery.") : D(!e.returnPartialData, 16), __DEV__ ? D(!e.pollInterval, "pollInterval option only supported on watchQuery.") : D(!e.pollInterval, 17), this.fetchQuery(t, e).finally(function() {
      return n.stopQuery(t);
    });
  }, r.prototype.generateQueryId = function() {
    return String(this.queryIdCounter++);
  }, r.prototype.generateRequestId = function() {
    return this.requestIdCounter++;
  }, r.prototype.generateMutationId = function() {
    return String(this.mutationIdCounter++);
  }, r.prototype.stopQueryInStore = function(e) {
    this.stopQueryInStoreNoBroadcast(e), this.broadcastQueries();
  }, r.prototype.stopQueryInStoreNoBroadcast = function(e) {
    var t = this.queries.get(e);
    t && t.stop();
  }, r.prototype.clearStore = function(e) {
    return e === void 0 && (e = {
      discardWatches: !0
    }), this.cancelPendingFetches(__DEV__ ? new re("Store reset while query was in flight (not completed in link chain)") : new re(18)), this.queries.forEach(function(t) {
      t.observableQuery ? t.networkStatus = se.loading : t.stop();
    }), this.mutationStore && (this.mutationStore = /* @__PURE__ */ Object.create(null)), this.cache.reset(e);
  }, r.prototype.getObservableQueries = function(e) {
    var t = this;
    e === void 0 && (e = "active");
    var n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
    return Array.isArray(e) && e.forEach(function(o) {
      typeof o == "string" ? i.set(o, !1) : Dh(o) ? i.set(t.transform(o).document, !1) : ue(o) && o.query && s.add(o);
    }), this.queries.forEach(function(o, a) {
      var l = o.observableQuery, h = o.document;
      if (l) {
        if (e === "all") {
          n.set(a, l);
          return;
        }
        var c = l.queryName, d = l.options.fetchPolicy;
        if (d === "standby" || e === "active" && !l.hasObservers())
          return;
        (e === "active" || c && i.has(c) || h && i.has(h)) && (n.set(a, l), c && i.set(c, !0), h && i.set(h, !0));
      }
    }), s.size && s.forEach(function(o) {
      var a = $i("legacyOneTimeQuery"), l = t.getQuery(a).init({
        document: o.query,
        variables: o.variables
      }), h = new Ki({
        queryManager: t,
        queryInfo: l,
        options: x(x({}, o), { fetchPolicy: "network-only" })
      });
      D(h.queryId === a), l.setObservableQuery(h), n.set(a, h);
    }), __DEV__ && i.size && i.forEach(function(o, a) {
      o || __DEV__ && D.warn("Unknown query ".concat(typeof a == "string" ? "named " : "").concat(JSON.stringify(a, null, 2), " requested in refetchQueries options.include array"));
    }), n;
  }, r.prototype.reFetchObservableQueries = function(e) {
    var t = this;
    e === void 0 && (e = !1);
    var n = [];
    return this.getObservableQueries(e ? "all" : "active").forEach(function(i, s) {
      var o = i.options.fetchPolicy;
      i.resetLastResults(), (e || o !== "standby" && o !== "cache-only") && n.push(i.refetch()), t.getQuery(s).setDiff(null);
    }), this.broadcastQueries(), Promise.all(n);
  }, r.prototype.setObservableQuery = function(e) {
    this.getQuery(e.queryId).setObservableQuery(e);
  }, r.prototype.startGraphQLSubscription = function(e) {
    var t = this, n = e.query, i = e.fetchPolicy, s = e.errorPolicy, o = e.variables, a = e.context, l = a === void 0 ? {} : a;
    n = this.transform(n).document, o = this.getVariables(n, o);
    var h = function(d) {
      return t.getObservableFromLink(n, l, d).map(function(p) {
        if (i !== "no-cache" && (zi(p, s) && t.cache.write({
          query: n,
          result: p.data,
          dataId: "ROOT_SUBSCRIPTION",
          variables: d
        }), t.broadcastQueries()), dn(p))
          throw new Rt({
            graphQLErrors: p.errors
          });
        return p;
      });
    };
    if (this.transform(n).hasClientExports) {
      var c = this.localState.addExportedVariables(n, o, l).then(h);
      return new ee(function(d) {
        var p = null;
        return c.then(function(m) {
          return p = m.subscribe(d);
        }, d.error), function() {
          return p && p.unsubscribe();
        };
      });
    }
    return h(o);
  }, r.prototype.stopQuery = function(e) {
    this.stopQueryNoBroadcast(e), this.broadcastQueries();
  }, r.prototype.stopQueryNoBroadcast = function(e) {
    this.stopQueryInStoreNoBroadcast(e), this.removeQuery(e);
  }, r.prototype.removeQuery = function(e) {
    this.fetchCancelFns.delete(e), this.getQuery(e).stop(), this.queries.delete(e);
  }, r.prototype.broadcastQueries = function() {
    this.onBroadcast && this.onBroadcast(), this.queries.forEach(function(e) {
      return e.notify();
    });
  }, r.prototype.getLocalState = function() {
    return this.localState;
  }, r.prototype.getObservableFromLink = function(e, t, n, i) {
    var s = this, o;
    i === void 0 && (i = (o = t?.queryDeduplication) !== null && o !== void 0 ? o : this.queryDeduplication);
    var a, l = this.transform(e).serverQuery;
    if (l) {
      var h = this, c = h.inFlightLinkObservables, d = h.link, p = {
        query: l,
        variables: n,
        operationName: Ri(l) || void 0,
        context: this.prepareContext(x(x({}, t), { forceFetch: !i }))
      };
      if (t = p.context, i) {
        var m = c.get(l) || /* @__PURE__ */ new Map();
        c.set(l, m);
        var v = Pt(n);
        if (a = m.get(v), !a) {
          var w = new Ar([
            Bi(d, p)
          ]);
          m.set(v, a = w), w.cleanup(function() {
            m.delete(v) && m.size < 1 && c.delete(l);
          });
        }
      } else
        a = new Ar([
          Bi(d, p)
        ]);
    } else
      a = new Ar([
        ee.of({ data: {} })
      ]), t = this.prepareContext(t);
    var _ = this.transform(e).clientQuery;
    return _ && (a = ri(a, function(E) {
      return s.localState.runResolvers({
        document: _,
        remoteResult: E,
        context: t,
        variables: n
      });
    })), a;
  }, r.prototype.getResultsFromLink = function(e, t, n) {
    var i = e.lastRequestId = this.generateRequestId();
    return ri(this.getObservableFromLink(e.document, n.context, n.variables), function(s) {
      var o = jt(s.errors);
      if (i >= e.lastRequestId) {
        if (o && n.errorPolicy === "none")
          throw e.markError(new Rt({
            graphQLErrors: s.errors
          }));
        e.markResult(s, n, t), e.markReady();
      }
      var a = {
        data: s.data,
        loading: !1,
        networkStatus: e.networkStatus || se.ready
      };
      return o && n.errorPolicy !== "ignore" && (a.errors = s.errors), a;
    }, function(s) {
      var o = Tp(s) ? s : new Rt({ networkError: s });
      throw i >= e.lastRequestId && e.markError(o), o;
    });
  }, r.prototype.fetchQueryObservable = function(e, t, n) {
    var i = this;
    n === void 0 && (n = se.loading);
    var s = this.transform(t.query).document, o = this.getVariables(s, t.variables), a = this.getQuery(e), l = t.fetchPolicy, h = l === void 0 ? "cache-first" : l, c = t.errorPolicy, d = c === void 0 ? "none" : c, p = t.returnPartialData, m = p === void 0 ? !1 : p, v = t.notifyOnNetworkStatusChange, w = v === void 0 ? !1 : v, _ = t.context, E = _ === void 0 ? {} : _, T = Object.assign({}, t, {
      query: s,
      variables: o,
      fetchPolicy: h,
      errorPolicy: d,
      returnPartialData: m,
      notifyOnNetworkStatusChange: w,
      context: E
    }), I = function(R) {
      return T.variables = R, i.fetchQueryByPolicy(a, T, n);
    };
    this.fetchCancelFns.set(e, function(R) {
      setTimeout(function() {
        return A.cancel(R);
      });
    });
    var A = new Ar(this.transform(T.query).hasClientExports ? this.localState.addExportedVariables(T.query, T.variables, T.context).then(I) : I(T.variables));
    return A.cleanup(function() {
      i.fetchCancelFns.delete(e), Rp(t);
    }), A;
  }, r.prototype.refetchQueries = function(e) {
    var t = this, n = e.updateCache, i = e.include, s = e.optimistic, o = s === void 0 ? !1 : s, a = e.removeOptimistic, l = a === void 0 ? o ? $i("refetchQueries") : void 0 : a, h = e.onQueryUpdated, c = /* @__PURE__ */ new Map();
    i && this.getObservableQueries(i).forEach(function(p, m) {
      c.set(m, {
        oq: p,
        lastDiff: t.getQuery(m).getDiff()
      });
    });
    var d = /* @__PURE__ */ new Map();
    return n && this.cache.batch({
      update: n,
      optimistic: o && l || !1,
      removeOptimistic: l,
      onWatchUpdated: function(p, m, v) {
        var w = p.watcher instanceof fi && p.watcher.observableQuery;
        if (w) {
          if (h) {
            c.delete(w.queryId);
            var _ = h(w, m, v);
            return _ === !0 && (_ = w.refetch()), _ !== !1 && d.set(w, _), _;
          }
          h !== null && c.set(w.queryId, { oq: w, lastDiff: v, diff: m });
        }
      }
    }), c.size && c.forEach(function(p, m) {
      var v = p.oq, w = p.lastDiff, _ = p.diff, E;
      if (h) {
        if (!_) {
          var T = v.queryInfo;
          T.reset(), _ = T.getDiff();
        }
        E = h(v, _, w);
      }
      (!h || E === !0) && (E = v.refetch()), E !== !1 && d.set(v, E), m.indexOf("legacyOneTimeQuery") >= 0 && t.stopQueryNoBroadcast(m);
    }), l && this.cache.removeOptimistic(l), d;
  }, r.prototype.fetchQueryByPolicy = function(e, t, n) {
    var i = this, s = t.query, o = t.variables, a = t.fetchPolicy, l = t.refetchWritePolicy, h = t.errorPolicy, c = t.returnPartialData, d = t.context, p = t.notifyOnNetworkStatusChange, m = e.networkStatus;
    e.init({
      document: s,
      variables: o,
      networkStatus: n
    });
    var v = function() {
      return e.getDiff(o);
    }, w = function(A, R) {
      R === void 0 && (R = e.networkStatus || se.loading);
      var N = A.result;
      __DEV__ && !c && !Se(N, {}) && Fu(A.missing);
      var F = function(B) {
        return ee.of(x({ data: B, loading: qr(R), networkStatus: R }, A.complete ? null : { partial: !0 }));
      };
      return N && i.transform(s).hasForcedResolvers ? i.localState.runResolvers({
        document: s,
        remoteResult: { data: N },
        context: d,
        variables: o,
        onlyRunForcedResolvers: !0
      }).then(function(B) {
        return F(B.data || void 0);
      }) : F(N);
    }, _ = a === "no-cache" ? 0 : n === se.refetch && l !== "merge" ? 1 : 2, E = function() {
      return i.getResultsFromLink(e, _, {
        variables: o,
        context: d,
        fetchPolicy: a,
        errorPolicy: h
      });
    }, T = p && typeof m == "number" && m !== n && qr(n);
    switch (a) {
      default:
      case "cache-first": {
        var I = v();
        return I.complete ? [
          w(I, e.markReady())
        ] : c || T ? [
          w(I),
          E()
        ] : [
          E()
        ];
      }
      case "cache-and-network": {
        var I = v();
        return I.complete || c || T ? [
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
  }, r.prototype.getQuery = function(e) {
    return e && !this.queries.has(e) && this.queries.set(e, new fi(this, e)), this.queries.get(e);
  }, r.prototype.prepareContext = function(e) {
    e === void 0 && (e = {});
    var t = this.localState.prepareContext(e);
    return x(x({}, t), { clientAwareness: this.clientAwareness });
  }, r;
}(), ra = !1;
function pi(r, e) {
  return Pr(r, e, e.variables && {
    variables: x(x({}, r.variables), e.variables)
  });
}
var Fp = function() {
  function r(e) {
    var t = this;
    this.defaultOptions = {}, this.resetStoreCallbacks = [], this.clearStoreCallbacks = [];
    var n = e.uri, i = e.credentials, s = e.headers, o = e.cache, a = e.ssrMode, l = a === void 0 ? !1 : a, h = e.ssrForceFetchDelay, c = h === void 0 ? 0 : h, d = e.connectToDevTools, p = d === void 0 ? typeof window == "object" && !window.__APOLLO_CLIENT__ && __DEV__ : d, m = e.queryDeduplication, v = m === void 0 ? !0 : m, w = e.defaultOptions, _ = e.assumeImmutableResults, E = _ === void 0 ? !1 : _, T = e.resolvers, I = e.typeDefs, A = e.fragmentMatcher, R = e.name, N = e.version, F = e.link;
    if (F || (F = n ? new Mf({ uri: n, credentials: i, headers: s }) : Ve.empty()), !o)
      throw __DEV__ ? new re(`To initialize Apollo Client, you must specify a 'cache' property in the options object. 
For more information, please visit: https://go.apollo.dev/c/docs`) : new re(7);
    if (this.link = F, this.cache = o, this.disableNetworkFetches = l || c > 0, this.queryDeduplication = v, this.defaultOptions = w || {}, this.typeDefs = I, c && setTimeout(function() {
      return t.disableNetworkFetches = !1;
    }, c), this.watchQuery = this.watchQuery.bind(this), this.query = this.query.bind(this), this.mutate = this.mutate.bind(this), this.resetStore = this.resetStore.bind(this), this.reFetchObservableQueries = this.reFetchObservableQueries.bind(this), p && typeof window == "object" && (window.__APOLLO_CLIENT__ = this), !ra && __DEV__ && (ra = !0, typeof window < "u" && window.document && window.top === window.self && !window.__APOLLO_DEVTOOLS_GLOBAL_HOOK__)) {
      var B = window.navigator, q = B && B.userAgent, z = void 0;
      typeof q == "string" && (q.indexOf("Chrome/") > -1 ? z = "https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm" : q.indexOf("Firefox/") > -1 && (z = "https://addons.mozilla.org/en-US/firefox/addon/apollo-developer-tools/")), z && __DEV__ && D.log("Download the Apollo DevTools for a better development experience: " + z);
    }
    this.version = Ef, this.localState = new Mu({
      cache: o,
      client: this,
      resolvers: T,
      fragmentMatcher: A
    }), this.queryManager = new Dp({
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
  return r.prototype.stop = function() {
    this.queryManager.stop();
  }, r.prototype.watchQuery = function(e) {
    return this.defaultOptions.watchQuery && (e = pi(this.defaultOptions.watchQuery, e)), this.disableNetworkFetches && (e.fetchPolicy === "network-only" || e.fetchPolicy === "cache-and-network") && (e = x(x({}, e), { fetchPolicy: "cache-first" })), this.queryManager.watchQuery(e);
  }, r.prototype.query = function(e) {
    return this.defaultOptions.query && (e = pi(this.defaultOptions.query, e)), __DEV__ ? D(e.fetchPolicy !== "cache-and-network", "The cache-and-network fetchPolicy does not work with client.query, because client.query can only return a single result. Please use client.watchQuery to receive multiple results from the cache and the network, or consider using a different fetchPolicy, such as cache-first or network-only.") : D(e.fetchPolicy !== "cache-and-network", 8), this.disableNetworkFetches && e.fetchPolicy === "network-only" && (e = x(x({}, e), { fetchPolicy: "cache-first" })), this.queryManager.query(e);
  }, r.prototype.mutate = function(e) {
    return this.defaultOptions.mutate && (e = pi(this.defaultOptions.mutate, e)), this.queryManager.mutate(e);
  }, r.prototype.subscribe = function(e) {
    return this.queryManager.startGraphQLSubscription(e);
  }, r.prototype.readQuery = function(e, t) {
    return t === void 0 && (t = !1), this.cache.readQuery(e, t);
  }, r.prototype.readFragment = function(e, t) {
    return t === void 0 && (t = !1), this.cache.readFragment(e, t);
  }, r.prototype.writeQuery = function(e) {
    this.cache.writeQuery(e), this.queryManager.broadcastQueries();
  }, r.prototype.writeFragment = function(e) {
    this.cache.writeFragment(e), this.queryManager.broadcastQueries();
  }, r.prototype.__actionHookForDevTools = function(e) {
    this.devToolsHookCb = e;
  }, r.prototype.__requestRaw = function(e) {
    return Bi(this.link, e);
  }, r.prototype.resetStore = function() {
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
  }, r.prototype.clearStore = function() {
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
  }, r.prototype.onResetStore = function(e) {
    var t = this;
    return this.resetStoreCallbacks.push(e), function() {
      t.resetStoreCallbacks = t.resetStoreCallbacks.filter(function(n) {
        return n !== e;
      });
    };
  }, r.prototype.onClearStore = function(e) {
    var t = this;
    return this.clearStoreCallbacks.push(e), function() {
      t.clearStoreCallbacks = t.clearStoreCallbacks.filter(function(n) {
        return n !== e;
      });
    };
  }, r.prototype.reFetchObservableQueries = function(e) {
    return this.queryManager.reFetchObservableQueries(e);
  }, r.prototype.refetchQueries = function(e) {
    var t = this.queryManager.refetchQueries(e), n = [], i = [];
    t.forEach(function(o, a) {
      n.push(a), i.push(o);
    });
    var s = Promise.all(i);
    return s.queries = n, s.results = i, s.catch(function(o) {
      __DEV__ && D.debug("In client.refetchQueries, Promise.all promise rejected with error ".concat(o));
    }), s;
  }, r.prototype.getObservableQueries = function(e) {
    return e === void 0 && (e = "active"), this.queryManager.getObservableQueries(e);
  }, r.prototype.extract = function(e) {
    return this.cache.extract(e);
  }, r.prototype.restore = function(e) {
    return this.cache.restore(e);
  }, r.prototype.addResolvers = function(e) {
    this.localState.addResolvers(e);
  }, r.prototype.setResolvers = function(e) {
    this.localState.setResolvers(e);
  }, r.prototype.getResolvers = function() {
    return this.localState.getResolvers();
  }, r.prototype.setLocalStateFragmentMatcher = function(e) {
    this.localState.setFragmentMatcher(e);
  }, r.prototype.setLink = function(e) {
    this.link = this.queryManager.link = e;
  }, r;
}(), mn = /* @__PURE__ */ new Map(), Gi = /* @__PURE__ */ new Map(), $u = !0, Tn = !1;
function Bu(r) {
  return r.replace(/[\s,]+/g, " ").trim();
}
function Mp(r) {
  return Bu(r.source.body.substring(r.start, r.end));
}
function $p(r) {
  var e = /* @__PURE__ */ new Set(), t = [];
  return r.definitions.forEach(function(n) {
    if (n.kind === "FragmentDefinition") {
      var i = n.name.value, s = Mp(n.loc), o = Gi.get(i);
      o && !o.has(s) ? $u && console.warn("Warning: fragment with name " + i + ` already exists.
graphql-tag enforces all fragment names across your application to be unique; read more about
this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names`) : o || Gi.set(i, o = /* @__PURE__ */ new Set()), o.add(s), e.has(s) || (e.add(s), t.push(n));
    } else
      t.push(n);
  }), x(x({}, r), { definitions: t });
}
function Bp(r) {
  var e = new Set(r.definitions);
  e.forEach(function(n) {
    n.loc && delete n.loc, Object.keys(n).forEach(function(i) {
      var s = n[i];
      s && typeof s == "object" && e.add(s);
    });
  });
  var t = r.loc;
  return t && (delete t.startToken, delete t.endToken), r;
}
function Pp(r) {
  var e = Bu(r);
  if (!mn.has(e)) {
    var t = gh(r, {
      experimentalFragmentVariables: Tn,
      allowLegacyFragmentVariables: Tn
    });
    if (!t || t.kind !== "Document")
      throw new Error("Not a valid GraphQL document.");
    mn.set(e, Bp($p(t)));
  }
  return mn.get(e);
}
function ie(r) {
  for (var e = [], t = 1; t < arguments.length; t++)
    e[t - 1] = arguments[t];
  typeof r == "string" && (r = [r]);
  var n = r[0];
  return e.forEach(function(i, s) {
    i && i.kind === "Document" ? n += i.loc.source.body : n += i, n += r[s + 1];
  }), Pp(n);
}
function Lp() {
  mn.clear(), Gi.clear();
}
function Up() {
  $u = !1;
}
function qp() {
  Tn = !0;
}
function jp() {
  Tn = !1;
}
var Sr = {
  gql: ie,
  resetCaches: Lp,
  disableFragmentWarnings: Up,
  enableExperimentalFragmentVariables: qp,
  disableExperimentalFragmentVariables: jp
};
(function(r) {
  r.gql = Sr.gql, r.resetCaches = Sr.resetCaches, r.disableFragmentWarnings = Sr.disableFragmentWarnings, r.enableExperimentalFragmentVariables = Sr.enableExperimentalFragmentVariables, r.disableExperimentalFragmentVariables = Sr.disableExperimentalFragmentVariables;
})(ie || (ie = {}));
ie.default = ie;
class Vp extends Me {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ie`query ($bundle: String!) {
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
    return new Cl({
      query: this,
      json: e
    });
  }
}
class Qp extends be {
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
      n.metas = bn.aggregateMeta(n.metas), t[n.bundleHash] = n;
    }), t;
  }
}
class Hp extends Me {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ie`query( $bundleHashes: [ String! ] ) {
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
    return new Qp({
      query: this,
      json: e
    });
  }
}
class Ln extends be {
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
    if (e.position === null || typeof e.position > "u" ? n = J.create({
      bundle: e.bundleHash,
      token: e.tokenSlug,
      batchId: e.batchId,
      characters: e.characters
    }) : (n = new J({
      secret: t,
      token: e.tokenSlug,
      position: e.position,
      batchId: e.batchId,
      characters: e.characters
    }), n.address = e.address, n.bundle = e.bundleHash), e.token && (n.tokenName = e.token.name, n.tokenAmount = e.token.amount, n.tokenSupply = e.token.supply, n.tokenFungibility = e.token.fungibility), e.tokenUnits.length)
      for (const i of e.tokenUnits)
        n.tokenUnits.push(Dr.createFromGraphQL(i));
    if (e.tradeRates.length)
      for (const i of e.tradeRates)
        n.tradeRates[i.tokenSlug] = i.amount;
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
    for (const i of t)
      n.push(Ln.toClientWallet({
        data: i,
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
class Wp extends Me {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ie`query( $bundleHash: String, $tokenSlug: String ) {
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
    return new Ln({
      query: this,
      json: e
    });
  }
}
class Kp extends be {
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
    return !e || !e.bundleHash || !e.tokenSlug ? null : Ln.toClientWallet({
      data: e
    });
  }
}
class zp extends Me {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ie`query( $address: String, $bundleHash: String, $type: String, $token: String, $position: String ) {
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
    return new Kp({
      query: this,
      json: e
    });
  }
}
class Gp extends be {
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
class na extends Me {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ie`query( $metaType: String, $metaTypes: [ String! ], $metaId: String, $metaIds: [ String! ], $key: String, $keys: [ String! ], $value: String, $values: [ String! ], $count: String, $latest: Boolean, $filter: [ MetaFilter! ], $latestMetas: Boolean, $queryArgs: QueryArgs, $countBy: String ) {
      MetaType( metaType: $metaType, metaTypes: $metaTypes, metaId: $metaId, metaIds: $metaIds, key: $key, keys: $keys, value: $value, values: $values, count: $count, filter: $filter, latestMetas: $latestMetas, queryArgs: $queryArgs, countBy: $countBy ) {
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
   * @param {boolean|null} latestMetas
   * @param {object|null} filter
   * @param {object|null} queryArgs
   * @param {string|null} count
   * @param {string|null} countBy
   * @return {{}}
   */
  static createVariables({
    metaType: e = null,
    metaId: t = null,
    key: n = null,
    value: i = null,
    latest: s = null,
    latestMetas: o = !0,
    filter: a = null,
    queryArgs: l = null,
    count: h = null,
    countBy: c = null
  }) {
    const d = {};
    return e && (d[typeof e == "string" ? "metaType" : "metaTypes"] = e), t && (d[typeof t == "string" ? "metaId" : "metaIds"] = t), n && (d[typeof n == "string" ? "key" : "keys"] = n), i && (d[typeof i == "string" ? "value" : "values"] = i), s && (d.latest = !!s), o && (d.latestMetas = !!o), a && (d.filter = a), l && ((typeof l.limit > "u" || l.limit === 0) && (l.limit = "*"), d.queryArgs = l), h && (d.count = h), c && (d.countBy = c), d;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaType}
   */
  createResponse(e) {
    return new Gp({
      query: this,
      json: e
    });
  }
}
class jr extends Me {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ie`query( $batchId: String ) {
      Batch( batchId: $batchId ) {
        ${jr.getFields()},
        children {
          ${jr.getFields()}
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
class Jp extends Me {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ie`query( $batchId: String ) {
      BatchHistory( batchId: $batchId ) {
        ${jr.getFields()}
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
class it extends be {
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
    const t = new ut({});
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
class _s extends Me {
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
      const i = {
        ...this.$__request,
        context: n
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
class Ce extends _s {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   * @param molecule
   */
  constructor(e, t, n) {
    super(e, t), this.$__molecule = n, this.$__remainderWallet = null, this.$__query = ie`mutation( $molecule: MoleculeInput! ) {
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
    return new it({
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
class Yp extends it {
  /**
   * return the authorization key
   *
   * @param key
   * @return {*}
   */
  payloadKey(e) {
    if (!he.has(this.payload(), e))
      throw new Or(`ResponseRequestAuthorization::payloadKey() - '${e}' key was not found in the payload!`);
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
class Xp extends Ce {
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
    return new Yp({
      query: this,
      json: e
    });
  }
}
class Zp extends it {
}
class ed extends Ce {
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
    return new Zp({
      query: this,
      json: e
    });
  }
}
class td extends it {
}
class rd extends Ce {
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
    metaId: i,
    meta: s = null,
    batchId: o = null
  }) {
    this.$__molecule.initTokenRequest({
      token: e,
      amount: t,
      metaType: n,
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
    return new td({
      query: this,
      json: e
    });
  }
}
class nd extends it {
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
class id extends Ce {
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
    return new nd({
      query: this,
      json: e
    });
  }
}
class sd extends it {
}
class od extends Ce {
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
    return new sd({
      query: this,
      json: e
    });
  }
}
class ad extends it {
}
class ud extends Ce {
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
    const n = J.create({
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
    return new ad({
      query: this,
      json: e
    });
  }
}
class cd extends it {
}
class ld extends Ce {
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
    policy: i
  }) {
    this.$__molecule.initMeta({
      meta: n,
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
    return new cd({
      query: this,
      json: e
    });
  }
}
class hd extends it {
}
class fd extends Ce {
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
    return new hd({
      query: this,
      json: e
    });
  }
}
class pd extends be {
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
      throw new Or(`ResponseAuthorizationGuest::payloadKey() - '${e}' key is not found in the payload!`);
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
class dd extends _s {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ie`mutation( $cellSlug: String, $pubkey: String, $encrypt: Boolean ) {
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
    return new pd({
      query: this,
      json: e
    });
  }
}
class ia extends ne {
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
class yd extends ne {
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
class sn extends ne {
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
class Un {
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
      throw new qe("Subscribe::createSubscribe() - Node URI was not initialized for this client instance!");
    if (this.$__subscribe === null)
      throw new qe("Subscribe::createSubscribe() - GraphQL subscription was not initialized!");
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
      throw new qe(`${this.constructor.name}::execute() - closure parameter is required!`);
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
class md extends Un {
  constructor(e) {
    super(e), this.$__subscribe = ie`
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
class gd extends Un {
  constructor(e) {
    super(e), this.$__subscribe = ie`
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
class vd extends Un {
  constructor(e) {
    super(e), this.$__subscribe = ie`
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
class bd extends Un {
  constructor(e) {
    super(e), this.$__subscribe = ie`
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
class wd extends be {
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
class _d extends _s {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ie`mutation(
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
    return new wd({
      query: this,
      json: e
    });
  }
}
class Ed extends be {
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
      const i = { ...n };
      i.jsonData && (i.jsonData = JSON.parse(i.jsonData)), i.createdAt && (i.createdAt = new Date(i.createdAt)), i.updatedAt && (i.updatedAt = new Date(i.updatedAt)), t.push(i);
    }
    return t;
  }
}
class Sd extends Me {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ie`query ActiveUserQuery ($bundleHash:String, $metaType: String, $metaId: String) {
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
    return new Ed({
      query: this,
      json: e
    });
  }
}
class kd extends be {
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
class xd extends Me {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ie`query UserActivity (
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
    return new kd({
      query: this,
      json: e
    });
  }
}
class Td extends Me {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ie`query( $slug: String, $slugs: [ String! ], $limit: Int, $order: String ) {
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
class sa extends ne {
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
class Ad extends be {
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
        const i = t.instances[n];
        i.metasJson && (t.instances[n].metas = JSON.parse(i.metasJson));
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
class oa extends Me {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ie`query(
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
    bundleHash: i,
    positions: s,
    position: o,
    walletAddresses: a,
    walletAddress: l,
    isotopes: h,
    isotope: c,
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
    indexes: F,
    index: B,
    filter: q,
    latest: z,
    queryArgs: Y
  }) {
    return t && (e = e || [], e.push(t)), i && (n = n || [], n.push(i)), o && (s = s || [], s.push(o)), l && (a = a || [], a.push(l)), c && (h = h || [], h.push(c)), p && (d = d || [], d.push(p)), v && (m = m || [], m.push(v)), _ && (w = w || [], w.push(_)), T && (E = E || [], E.push(T)), A && (I = I || [], I.push(A)), N && (R = R || [], R.push(N)), B && (F = F || [], F.push(B)), {
      molecularHashes: e,
      bundleHashes: n,
      positions: s,
      walletAddresses: a,
      isotopes: h,
      tokenSlugs: d,
      cellSlugs: m,
      batchIds: w,
      values: E,
      metaTypes: I,
      metaIds: R,
      indexes: F,
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
    return new Ad({
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
class Od extends Me {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ie`query( $metaType: String, $metaId: String, ) {
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
class aa extends Me {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ie`query ($metaTypes: [String!], $metaIds: [String!], $values: [String!], $keys: [String!], $latest: Boolean, $filter: [MetaFilter!], $queryArgs: QueryArgs, $countBy: String, $atomValues: [String!] ) {
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
   * @param {boolean|null} latestMetas
   * @param {array|null} filter
   * @param {object|null} queryArgs
   * @param {string|null} countBy
   * @return {{}}
   */
  static createVariables({
    metaType: e = null,
    metaId: t = null,
    key: n = null,
    value: i = null,
    keys: s = null,
    values: o = null,
    atomValues: a = null,
    latest: l = null,
    latestMetas: h = !0,
    filter: c = null,
    queryArgs: d = null,
    countBy: p = null
  }) {
    const m = {};
    return a && (m.atomValues = a), s && (m.keys = s), o && (m.values = o), e && (m.metaTypes = typeof e == "string" ? [e] : e), t && (m.metaIds = typeof t == "string" ? [t] : t), p && (m.countBy = p), c && (m.filter = c), n && i && (m.filter = m.filter || [], m.filter.push({
      key: n,
      value: i,
      comparison: "="
    })), l && (m.latest = !!l, m.latest = !!h), d && ((typeof d.limit > "u" || d.limit === 0) && (d.limit = "*"), m.queryArgs = d), m;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaTypeViaAtom}
   */
  createResponse(e) {
    return new Cd({
      query: this,
      json: e
    });
  }
}
class Rd extends it {
}
class Nd extends Ce {
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
    policy: i
  }) {
    this.$__molecule.createRule({
      metaType: e,
      metaId: t,
      rule: n,
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
    return new Rd({
      query: this,
      json: e
    });
  }
}
class Dd extends Ce {
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
class Fd extends Ce {
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
function ht(r, e, t, n) {
  return new (t || (t = Promise))(function(i, s) {
    function o(h) {
      try {
        l(n.next(h));
      } catch (c) {
        s(c);
      }
    }
    function a(h) {
      try {
        l(n.throw(h));
      } catch (c) {
        s(c);
      }
    }
    function l(h) {
      var c;
      h.done ? i(h.value) : (c = h.value, c instanceof t ? c : new t(function(d) {
        d(c);
      })).then(o, a);
    }
    l((n = n.apply(r, [])).next());
  });
}
function ft(r, e) {
  var t, n, i, s, o = { label: 0, sent: function() {
    if (1 & i[0]) throw i[1];
    return i[1];
  }, trys: [], ops: [] };
  return s = { next: a(0), throw: a(1), return: a(2) }, typeof Symbol == "function" && (s[Symbol.iterator] = function() {
    return this;
  }), s;
  function a(l) {
    return function(h) {
      return function(c) {
        if (t) throw new TypeError("Generator is already executing.");
        for (; s && (s = 0, c[0] && (o = 0)), o; ) try {
          if (t = 1, n && (i = 2 & c[0] ? n.return : c[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, c[1])).done) return i;
          switch (n = 0, i && (c = [2 & c[0], i.value]), c[0]) {
            case 0:
            case 1:
              i = c;
              break;
            case 4:
              return o.label++, { value: c[1], done: !1 };
            case 5:
              o.label++, n = c[1], c = [0];
              continue;
            case 7:
              c = o.ops.pop(), o.trys.pop();
              continue;
            default:
              if (i = o.trys, !((i = i.length > 0 && i[i.length - 1]) || c[0] !== 6 && c[0] !== 2)) {
                o = 0;
                continue;
              }
              if (c[0] === 3 && (!i || c[1] > i[0] && c[1] < i[3])) {
                o.label = c[1];
                break;
              }
              if (c[0] === 6 && o.label < i[1]) {
                o.label = i[1], i = c;
                break;
              }
              if (i && o.label < i[2]) {
                o.label = i[2], o.ops.push(c);
                break;
              }
              i[2] && o.ops.pop(), o.trys.pop();
              continue;
          }
          c = e.call(r, o);
        } catch (d) {
          c = [6, d], n = 0;
        } finally {
          t = i = 0;
        }
        if (5 & c[0]) throw c[1];
        return { value: c[0] ? c[1] : void 0, done: !0 };
      }([l, h]);
    };
  }
}
var pt = { exclude: [] }, Pu = {}, Md = { timeout: "true" }, Ke = function(r, e) {
  typeof window < "u" && (Pu[r] = e);
}, $d = function() {
  return Object.fromEntries(Object.entries(Pu).filter(function(r) {
    var e, t = r[0];
    return !(!((e = pt?.exclude) === null || e === void 0) && e.includes(t));
  }).map(function(r) {
    return [r[0], (0, r[1])()];
  }));
}, ua = 3432918353, ca = 461845907, Bd = 3864292196, Pd = 2246822507, Ld = 3266489909;
function di(r, e) {
  return r << e | r >>> 32 - e;
}
function Es(r, e) {
  e === void 0 && (e = 0);
  for (var t = e, n = 0, i = 3 & r.length, s = r.length - i, o = 0; o < s; ) n = 255 & r.charCodeAt(o) | (255 & r.charCodeAt(++o)) << 8 | (255 & r.charCodeAt(++o)) << 16 | (255 & r.charCodeAt(++o)) << 24, ++o, n = di(n = Math.imul(n, ua), 15), t = di(t ^= n = Math.imul(n, ca), 13), t = Math.imul(t, 5) + Bd;
  switch (n = 0, i) {
    case 3:
      n ^= (255 & r.charCodeAt(o + 2)) << 16;
    case 2:
      n ^= (255 & r.charCodeAt(o + 1)) << 8;
    case 1:
      n ^= 255 & r.charCodeAt(o), n = di(n = Math.imul(n, ua), 15), t ^= n = Math.imul(n, ca);
  }
  return ((t = function(a) {
    return a ^= a >>> 16, a = Math.imul(a, Pd), a ^= a >>> 13, a = Math.imul(a, Ld), a ^ a >>> 16;
  }(t ^= r.length)) >>> 0).toString(36);
}
function Ud(r, e) {
  return new Promise(function(t) {
    setTimeout(function() {
      return t(e);
    }, r);
  });
}
function qd(r, e, t) {
  return Promise.all(r.map(function(n) {
    return Promise.race([n, Ud(e, t)]);
  }));
}
function Lu() {
  return ht(this, void 0, void 0, function() {
    var r, e, t, n, i;
    return ft(this, function(s) {
      switch (s.label) {
        case 0:
          return s.trys.push([0, 2, , 3]), r = $d(), e = Object.keys(r), [4, qd(Object.values(r), pt?.timeout || 1e3, Md)];
        case 1:
          return t = s.sent(), n = t.filter(function(o) {
            return o !== void 0;
          }), i = {}, n.forEach(function(o, a) {
            i[e[a]] = o;
          }), [2, Uu(i, pt.exclude || [])];
        case 2:
          throw s.sent();
        case 3:
          return [2];
      }
    });
  });
}
function Uu(r, e) {
  var t = {}, n = function(s) {
    if (r.hasOwnProperty(s)) {
      var o = r[s];
      if (typeof o != "object" || Array.isArray(o)) e.includes(s) || (t[s] = o);
      else {
        var a = Uu(o, e.map(function(l) {
          return l.startsWith(s + ".") ? l.slice(s.length + 1) : l;
        }));
        Object.keys(a).length > 0 && (t[s] = a);
      }
    }
  };
  for (var i in r) n(i);
  return t;
}
function jd(r) {
  return ht(this, void 0, void 0, function() {
    var e, t;
    return ft(this, function(n) {
      switch (n.label) {
        case 0:
          return n.trys.push([0, 2, , 3]), [4, Lu()];
        case 1:
          return e = n.sent(), t = Es(JSON.stringify(e)), [2, t.toString()];
        case 2:
          throw n.sent();
        case 3:
          return [2];
      }
    });
  });
}
function Vd(r) {
  for (var e = 0, t = 0; t < r.length; ++t) e += Math.abs(r[t]);
  return e;
}
function qu(r, e, t) {
  for (var n = [], i = 0; i < r[0].data.length; i++) {
    for (var s = [], o = 0; o < r.length; o++) s.push(r[o].data[i]);
    n.push(Qd(s));
  }
  var a = new Uint8ClampedArray(n);
  return new ImageData(a, e, t);
}
function Qd(r) {
  if (r.length === 0) return 0;
  for (var e = {}, t = 0, n = r; t < n.length; t++)
    e[s = n[t]] = (e[s] || 0) + 1;
  var i = r[0];
  for (var s in e) e[s] > e[i] && (i = parseInt(s, 10));
  return i;
}
function Vr() {
  if (typeof navigator > "u") return { name: "unknown", version: "unknown" };
  for (var r = navigator.userAgent, e = { Edg: "Edge", OPR: "Opera" }, t = 0, n = [/(?<name>Edge|Edg)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>(?:Chrome|Chromium|OPR|Opera|Vivaldi|Brave))\/(?<version>\d+(?:\.\d+)?)/, /(?<name>(?:Firefox|Waterfox|Iceweasel|IceCat))\/(?<version>\d+(?:\.\d+)?)/, /(?<name>Safari)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>MSIE|Trident|IEMobile).+?(?<version>\d+(?:\.\d+)?)/, /(?<name>[A-Za-z]+)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>SamsungBrowser)\/(?<version>\d+(?:\.\d+)?)/]; t < n.length; t++) {
    var i = n[t], s = r.match(i);
    if (s && s.groups) return { name: e[s.groups.name] || s.groups.name, version: s.groups.version };
  }
  return { name: "unknown", version: "unknown" };
}
Ke("audio", function() {
  return ht(this, void 0, void 0, function() {
    return ft(this, function(r) {
      return [2, new Promise(function(e, t) {
        try {
          var n = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 5e3, 44100), i = n.createBufferSource(), s = n.createOscillator();
          s.frequency.value = 1e3;
          var o, a = n.createDynamicsCompressor();
          a.threshold.value = -50, a.knee.value = 40, a.ratio.value = 12, a.attack.value = 0, a.release.value = 0.2, s.connect(a), a.connect(n.destination), s.start(), n.oncomplete = function(l) {
            o = l.renderedBuffer.getChannelData(0), e({ sampleHash: Vd(o), oscillator: s.type, maxChannels: n.destination.maxChannelCount, channelCountMode: i.channelCountMode });
          }, n.startRendering();
        } catch (l) {
          console.error("Error creating audio fingerprint:", l), t(l);
        }
      })];
    });
  });
});
var Hd = Vr().name !== "SamsungBrowser" ? 1 : 3, la = 280, ha = 20;
Vr().name != "Firefox" && Ke("canvas", function() {
  return document.createElement("canvas").getContext("2d"), new Promise(function(r) {
    var e = Array.from({ length: Hd }, function() {
      return function() {
        var t = document.createElement("canvas"), n = t.getContext("2d");
        if (!n) return new ImageData(1, 1);
        t.width = la, t.height = ha;
        var i = n.createLinearGradient(0, 0, t.width, t.height);
        i.addColorStop(0, "red"), i.addColorStop(0.16666666666666666, "orange"), i.addColorStop(0.3333333333333333, "yellow"), i.addColorStop(0.5, "green"), i.addColorStop(0.6666666666666666, "blue"), i.addColorStop(0.8333333333333334, "indigo"), i.addColorStop(1, "violet"), n.fillStyle = i, n.fillRect(0, 0, t.width, t.height);
        var s = "Random Text WMwmil10Oo";
        n.font = "23.123px Arial", n.fillStyle = "black", n.fillText(s, -5, 15), n.fillStyle = "rgba(0, 0, 255, 0.5)", n.fillText(s, -3.3, 17.7), n.beginPath(), n.moveTo(0, 0), n.lineTo(2 * t.width / 7, t.height), n.strokeStyle = "white", n.lineWidth = 2, n.stroke();
        var o = n.getImageData(0, 0, t.width, t.height);
        return o;
      }();
    });
    r({ commonImageDataHash: Es(qu(e, la, ha).data.toString()).toString() });
  });
});
var yi, Wd = ["Arial", "Arial Black", "Arial Narrow", "Arial Rounded MT", "Arimo", "Archivo", "Barlow", "Bebas Neue", "Bitter", "Bookman", "Calibri", "Cabin", "Candara", "Century", "Century Gothic", "Comic Sans MS", "Constantia", "Courier", "Courier New", "Crimson Text", "DM Mono", "DM Sans", "DM Serif Display", "DM Serif Text", "Dosis", "Droid Sans", "Exo", "Fira Code", "Fira Sans", "Franklin Gothic Medium", "Garamond", "Geneva", "Georgia", "Gill Sans", "Helvetica", "Impact", "Inconsolata", "Indie Flower", "Inter", "Josefin Sans", "Karla", "Lato", "Lexend", "Lucida Bright", "Lucida Console", "Lucida Sans Unicode", "Manrope", "Merriweather", "Merriweather Sans", "Montserrat", "Myriad", "Noto Sans", "Nunito", "Nunito Sans", "Open Sans", "Optima", "Orbitron", "Oswald", "Pacifico", "Palatino", "Perpetua", "PT Sans", "PT Serif", "Poppins", "Prompt", "Public Sans", "Quicksand", "Rajdhani", "Recursive", "Roboto", "Roboto Condensed", "Rockwell", "Rubik", "Segoe Print", "Segoe Script", "Segoe UI", "Sora", "Source Sans Pro", "Space Mono", "Tahoma", "Taviraj", "Times", "Times New Roman", "Titillium Web", "Trebuchet MS", "Ubuntu", "Varela Round", "Verdana", "Work Sans"], Kd = ["monospace", "sans-serif", "serif"];
function fa(r, e) {
  if (!r) throw new Error("Canvas context not supported");
  return r.font, r.font = "72px ".concat(e), r.measureText("WwMmLli0Oo").width;
}
function zd() {
  var r, e = document.createElement("canvas"), t = (r = e.getContext("webgl")) !== null && r !== void 0 ? r : e.getContext("experimental-webgl");
  if (t && "getParameter" in t) {
    var n = t.getExtension("WEBGL_debug_renderer_info");
    return { vendor: (t.getParameter(t.VENDOR) || "").toString(), vendorUnmasked: n ? (t.getParameter(n.UNMASKED_VENDOR_WEBGL) || "").toString() : "", renderer: (t.getParameter(t.RENDERER) || "").toString(), rendererUnmasked: n ? (t.getParameter(n.UNMASKED_RENDERER_WEBGL) || "").toString() : "", version: (t.getParameter(t.VERSION) || "").toString(), shadingLanguageVersion: (t.getParameter(t.SHADING_LANGUAGE_VERSION) || "").toString() };
  }
  return "undefined";
}
function Gd() {
  var r = new Float32Array(1), e = new Uint8Array(r.buffer);
  return r[0] = 1 / 0, r[0] = r[0] - r[0], e[3];
}
function Jd(r, e) {
  var t = {};
  return e.forEach(function(n) {
    var i = function(s) {
      if (s.length === 0) return null;
      var o = {};
      s.forEach(function(h) {
        var c = String(h);
        o[c] = (o[c] || 0) + 1;
      });
      var a = s[0], l = 1;
      return Object.keys(o).forEach(function(h) {
        o[h] > l && (a = h, l = o[h]);
      }), a;
    }(r.map(function(s) {
      return n in s ? s[n] : void 0;
    }).filter(function(s) {
      return s !== void 0;
    }));
    i && (t[n] = i);
  }), t;
}
function Yd() {
  var r = [], e = { "prefers-contrast": ["high", "more", "low", "less", "forced", "no-preference"], "any-hover": ["hover", "none"], "any-pointer": ["none", "coarse", "fine"], pointer: ["none", "coarse", "fine"], hover: ["hover", "none"], update: ["fast", "slow"], "inverted-colors": ["inverted", "none"], "prefers-reduced-motion": ["reduce", "no-preference"], "prefers-reduced-transparency": ["reduce", "no-preference"], scripting: ["none", "initial-only", "enabled"], "forced-colors": ["active", "none"] };
  return Object.keys(e).forEach(function(t) {
    e[t].forEach(function(n) {
      matchMedia("(".concat(t, ": ").concat(n, ")")).matches && r.push("".concat(t, ": ").concat(n));
    });
  }), r;
}
function Xd() {
  if (window.location.protocol === "https:" && typeof window.ApplePaySession == "function") try {
    for (var r = window.ApplePaySession.supportsVersion, e = 15; e > 0; e--) if (r(e)) return e;
  } catch {
    return 0;
  }
  return 0;
}
Vr().name != "Firefox" && Ke("fonts", function() {
  var r = this;
  return new Promise(function(e, t) {
    try {
      (function(n) {
        var i;
        ht(this, void 0, void 0, function() {
          var s, o, a;
          return ft(this, function(l) {
            switch (l.label) {
              case 0:
                return document.body ? [3, 2] : [4, (h = 50, new Promise(function(d) {
                  return setTimeout(d, h, c);
                }))];
              case 1:
                return l.sent(), [3, 0];
              case 2:
                if ((s = document.createElement("iframe")).setAttribute("frameBorder", "0"), (o = s.style).setProperty("position", "fixed"), o.setProperty("display", "block", "important"), o.setProperty("visibility", "visible"), o.setProperty("border", "0"), o.setProperty("opacity", "0"), s.src = "about:blank", document.body.appendChild(s), !(a = s.contentDocument || ((i = s.contentWindow) === null || i === void 0 ? void 0 : i.document))) throw new Error("Iframe document is not accessible");
                return n({ iframe: a }), setTimeout(function() {
                  document.body.removeChild(s);
                }, 0), [2];
            }
            var h, c;
          });
        });
      })(function(n) {
        var i = n.iframe;
        return ht(r, void 0, void 0, function() {
          var s, o, a, l;
          return ft(this, function(h) {
            return s = i.createElement("canvas"), o = s.getContext("2d"), a = Kd.map(function(c) {
              return fa(o, c);
            }), l = {}, Wd.forEach(function(c) {
              var d = fa(o, c);
              a.includes(d) || (l[c] = d);
            }), e(l), [2];
          });
        });
      });
    } catch {
      t({ error: "unsupported" });
    }
  });
}), Ke("hardware", function() {
  return new Promise(function(r, e) {
    var t = navigator.deviceMemory !== void 0 ? navigator.deviceMemory : 0, n = window.performance && window.performance.memory ? window.performance.memory : 0;
    r({ videocard: zd(), architecture: Gd(), deviceMemory: t.toString() || "undefined", jsHeapSizeLimit: n.jsHeapSizeLimit || 0 });
  });
}), Ke("locales", function() {
  return new Promise(function(r) {
    r({ languages: navigator.language, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  });
}), Ke("permissions", function() {
  return ht(this, void 0, void 0, function() {
    var r;
    return ft(this, function(e) {
      return yi = pt?.permissions_to_check || ["accelerometer", "accessibility", "accessibility-events", "ambient-light-sensor", "background-fetch", "background-sync", "bluetooth", "camera", "clipboard-read", "clipboard-write", "device-info", "display-capture", "gyroscope", "geolocation", "local-fonts", "magnetometer", "microphone", "midi", "nfc", "notifications", "payment-handler", "persistent-storage", "push", "speaker", "storage-access", "top-level-storage-access", "window-management", "query"], r = Array.from({ length: pt?.retries || 3 }, function() {
        return function() {
          return ht(this, void 0, void 0, function() {
            var t, n, i, s, o;
            return ft(this, function(a) {
              switch (a.label) {
                case 0:
                  t = {}, n = 0, i = yi, a.label = 1;
                case 1:
                  if (!(n < i.length)) return [3, 6];
                  s = i[n], a.label = 2;
                case 2:
                  return a.trys.push([2, 4, , 5]), [4, navigator.permissions.query({ name: s })];
                case 3:
                  return o = a.sent(), t[s] = o.state.toString(), [3, 5];
                case 4:
                  return a.sent(), [3, 5];
                case 5:
                  return n++, [3, 1];
                case 6:
                  return [2, t];
              }
            });
          });
        }();
      }), [2, Promise.all(r).then(function(t) {
        return Jd(t, yi);
      })];
    });
  });
}), Ke("plugins", function() {
  var r = [];
  if (navigator.plugins) for (var e = 0; e < navigator.plugins.length; e++) {
    var t = navigator.plugins[e];
    r.push([t.name, t.filename, t.description].join("|"));
  }
  return new Promise(function(n) {
    n({ plugins: r });
  });
}), Ke("screen", function() {
  return new Promise(function(r) {
    r({ is_touchscreen: navigator.maxTouchPoints > 0, maxTouchPoints: navigator.maxTouchPoints, colorDepth: screen.colorDepth, mediaMatches: Yd() });
  });
}), Ke("system", function() {
  return new Promise(function(r) {
    var e = Vr();
    r({ platform: window.navigator.platform, cookieEnabled: window.navigator.cookieEnabled, productSub: navigator.productSub, product: navigator.product, useragent: navigator.userAgent, browser: { name: e.name, version: e.version }, applePayVersion: Xd() });
  });
});
var Ne, Zd = Vr().name !== "SamsungBrowser" ? 1 : 3, L = null;
typeof document < "u" && ((Ne = document.createElement("canvas")).width = 200, Ne.height = 100, L = Ne.getContext("webgl")), Ke("webgl", function() {
  return ht(this, void 0, void 0, function() {
    var r;
    return ft(this, function(e) {
      try {
        if (!L) throw new Error("WebGL not supported");
        return r = Array.from({ length: Zd }, function() {
          return function() {
            try {
              if (!L) throw new Error("WebGL not supported");
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
      `, i = L.createShader(L.VERTEX_SHADER), s = L.createShader(L.FRAGMENT_SHADER);
              if (!i || !s) throw new Error("Failed to create shaders");
              if (L.shaderSource(i, t), L.shaderSource(s, n), L.compileShader(i), !L.getShaderParameter(i, L.COMPILE_STATUS)) throw new Error("Vertex shader compilation failed: " + L.getShaderInfoLog(i));
              if (L.compileShader(s), !L.getShaderParameter(s, L.COMPILE_STATUS)) throw new Error("Fragment shader compilation failed: " + L.getShaderInfoLog(s));
              var o = L.createProgram();
              if (!o) throw new Error("Failed to create shader program");
              if (L.attachShader(o, i), L.attachShader(o, s), L.linkProgram(o), !L.getProgramParameter(o, L.LINK_STATUS)) throw new Error("Shader program linking failed: " + L.getProgramInfoLog(o));
              L.useProgram(o);
              for (var a = 137, l = new Float32Array(4 * a), h = 2 * Math.PI / a, c = 0; c < a; c++) {
                var d = c * h;
                l[4 * c] = 0, l[4 * c + 1] = 0, l[4 * c + 2] = Math.cos(d) * (Ne.width / 2), l[4 * c + 3] = Math.sin(d) * (Ne.height / 2);
              }
              var p = L.createBuffer();
              L.bindBuffer(L.ARRAY_BUFFER, p), L.bufferData(L.ARRAY_BUFFER, l, L.STATIC_DRAW);
              var m = L.getAttribLocation(o, "position");
              L.enableVertexAttribArray(m), L.vertexAttribPointer(m, 2, L.FLOAT, !1, 0, 0), L.viewport(0, 0, Ne.width, Ne.height), L.clearColor(0, 0, 0, 1), L.clear(L.COLOR_BUFFER_BIT), L.drawArrays(L.LINES, 0, 2 * a);
              var v = new Uint8ClampedArray(Ne.width * Ne.height * 4);
              return L.readPixels(0, 0, Ne.width, Ne.height, L.RGBA, L.UNSIGNED_BYTE, v), new ImageData(v, Ne.width, Ne.height);
            } catch {
              return new ImageData(1, 1);
            } finally {
              L && (L.bindBuffer(L.ARRAY_BUFFER, null), L.useProgram(null), L.viewport(0, 0, L.drawingBufferWidth, L.drawingBufferHeight), L.clearColor(0, 0, 0, 0));
            }
          }();
        }), [2, { commonImageHash: Es(qu(r, Ne.width, Ne.height).data.toString()).toString() }];
      } catch {
        return [2, { webgl: "unsupported" }];
      }
      return [2];
    });
  });
});
var It = function(r, e, t, n) {
  for (var i = (t - e) / n, s = 0, o = 0; o < n; o++)
    s += r(e + (o + 0.5) * i);
  return s * i;
};
Ke("math", function() {
  return ht(void 0, void 0, void 0, function() {
    return ft(this, function(r) {
      return [2, { acos: Math.acos(0.5), asin: It(Math.asin, -1, 1, 97), atan: It(Math.atan, -1, 1, 97), cos: It(Math.cos, 0, Math.PI, 97), cosh: Math.cosh(9 / 7), e: Math.E, largeCos: Math.cos(1e20), largeSin: Math.sin(1e20), largeTan: Math.tan(1e20), log: Math.log(1e3), pi: Math.PI, sin: It(Math.sin, -Math.PI, Math.PI, 97), sinh: It(Math.sinh, -9 / 7, 7 / 9, 97), sqrt: Math.sqrt(2), tan: It(Math.tan, 0, 2 * Math.PI, 97), tanh: It(Math.tanh, -9 / 7, 7 / 9, 97) }];
    });
  });
});
function ju(r) {
  return new Ve(function(e, t) {
    return new ee(function(n) {
      var i, s, o;
      try {
        i = t(e).subscribe({
          next: function(a) {
            if (a.errors && (o = r({
              graphQLErrors: a.errors,
              response: a,
              operation: e,
              forward: t
            }), o)) {
              s = o.subscribe({
                next: n.next.bind(n),
                error: n.error.bind(n),
                complete: n.complete.bind(n)
              });
              return;
            }
            n.next(a);
          },
          error: function(a) {
            if (o = r({
              operation: e,
              networkError: a,
              graphQLErrors: a && a.result && a.result.errors,
              forward: t
            }), o) {
              s = o.subscribe({
                next: n.next.bind(n),
                error: n.error.bind(n),
                complete: n.complete.bind(n)
              });
              return;
            }
            n.error(a);
          },
          complete: function() {
            o || n.complete.bind(n)();
          }
        });
      } catch (a) {
        r({ networkError: a, operation: e, forward: t }), n.error(a);
      }
      return function() {
        i && i.unsubscribe(), s && i.unsubscribe();
      };
    });
  });
}
(function(r) {
  je(e, r);
  function e(t) {
    var n = r.call(this) || this;
    return n.link = ju(t), n;
  }
  return e.prototype.request = function(t, n) {
    return this.link.request(t, n);
  }, e;
})(Ve);
function ey(r) {
  return new Ve(function(e, t) {
    var n = Lt(e, []);
    return new ee(function(i) {
      var s, o = !1;
      return Promise.resolve(n).then(function(a) {
        return r(a, e.getContext());
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
function ty(r) {
  return ue(r) && "code" in r && "reason" in r;
}
var ry = function(r) {
  je(e, r);
  function e(t) {
    var n = r.call(this) || this;
    return n.client = t, n;
  }
  return e.prototype.request = function(t) {
    var n = this;
    return new ee(function(i) {
      return n.client.subscribe(x(x({}, t), { query: ns(t.query) }), {
        next: i.next.bind(i),
        complete: i.complete.bind(i),
        error: function(s) {
          return s instanceof Error ? i.error(s) : ty(s) ? i.error(new Error("Socket closed with event ".concat(s.code, " ").concat(s.reason || ""))) : i.error(new Rt({
            graphQLErrors: Array.isArray(s) ? s : [s]
          }));
        }
      });
    });
  }, e;
}(Ve);
function Fe(r) {
  return r === null ? "null" : Array.isArray(r) ? "array" : typeof r;
}
function Nt(r) {
  return Fe(r) === "object";
}
function ny(r) {
  return Array.isArray(r) && // must be at least one error
  r.length > 0 && // error has at least a message
  r.every((e) => "message" in e);
}
function pa(r, e) {
  return r.length < 124 ? r : e;
}
const iy = "graphql-transport-ws";
var $e;
(function(r) {
  r[r.InternalServerError = 4500] = "InternalServerError", r[r.InternalClientError = 4005] = "InternalClientError", r[r.BadRequest = 4400] = "BadRequest", r[r.BadResponse = 4004] = "BadResponse", r[r.Unauthorized = 4401] = "Unauthorized", r[r.Forbidden = 4403] = "Forbidden", r[r.SubprotocolNotAcceptable = 4406] = "SubprotocolNotAcceptable", r[r.ConnectionInitialisationTimeout = 4408] = "ConnectionInitialisationTimeout", r[r.ConnectionAcknowledgementTimeout = 4504] = "ConnectionAcknowledgementTimeout", r[r.SubscriberAlreadyExists = 4409] = "SubscriberAlreadyExists", r[r.TooManyInitialisationRequests = 4429] = "TooManyInitialisationRequests";
})($e || ($e = {}));
var pe;
(function(r) {
  r.ConnectionInit = "connection_init", r.ConnectionAck = "connection_ack", r.Ping = "ping", r.Pong = "pong", r.Subscribe = "subscribe", r.Next = "next", r.Error = "error", r.Complete = "complete";
})(pe || (pe = {}));
function Vu(r) {
  if (!Nt(r))
    throw new Error(`Message is expected to be an object, but got ${Fe(r)}`);
  if (!r.type)
    throw new Error("Message is missing the 'type' property");
  if (typeof r.type != "string")
    throw new Error(`Message is expects the 'type' property to be a string, but got ${Fe(r.type)}`);
  switch (r.type) {
    case pe.ConnectionInit:
    case pe.ConnectionAck:
    case pe.Ping:
    case pe.Pong: {
      if (r.payload != null && !Nt(r.payload))
        throw new Error(`"${r.type}" message expects the 'payload' property to be an object or nullish or missing, but got "${r.payload}"`);
      break;
    }
    case pe.Subscribe: {
      if (typeof r.id != "string")
        throw new Error(`"${r.type}" message expects the 'id' property to be a string, but got ${Fe(r.id)}`);
      if (!r.id)
        throw new Error(`"${r.type}" message requires a non-empty 'id' property`);
      if (!Nt(r.payload))
        throw new Error(`"${r.type}" message expects the 'payload' property to be an object, but got ${Fe(r.payload)}`);
      if (typeof r.payload.query != "string")
        throw new Error(`"${r.type}" message payload expects the 'query' property to be a string, but got ${Fe(r.payload.query)}`);
      if (r.payload.variables != null && !Nt(r.payload.variables))
        throw new Error(`"${r.type}" message payload expects the 'variables' property to be a an object or nullish or missing, but got ${Fe(r.payload.variables)}`);
      if (r.payload.operationName != null && Fe(r.payload.operationName) !== "string")
        throw new Error(`"${r.type}" message payload expects the 'operationName' property to be a string or nullish or missing, but got ${Fe(r.payload.operationName)}`);
      if (r.payload.extensions != null && !Nt(r.payload.extensions))
        throw new Error(`"${r.type}" message payload expects the 'extensions' property to be a an object or nullish or missing, but got ${Fe(r.payload.extensions)}`);
      break;
    }
    case pe.Next: {
      if (typeof r.id != "string")
        throw new Error(`"${r.type}" message expects the 'id' property to be a string, but got ${Fe(r.id)}`);
      if (!r.id)
        throw new Error(`"${r.type}" message requires a non-empty 'id' property`);
      if (!Nt(r.payload))
        throw new Error(`"${r.type}" message expects the 'payload' property to be an object, but got ${Fe(r.payload)}`);
      break;
    }
    case pe.Error: {
      if (typeof r.id != "string")
        throw new Error(`"${r.type}" message expects the 'id' property to be a string, but got ${Fe(r.id)}`);
      if (!r.id)
        throw new Error(`"${r.type}" message requires a non-empty 'id' property`);
      if (!ny(r.payload))
        throw new Error(`"${r.type}" message expects the 'payload' property to be an array of GraphQL errors, but got ${JSON.stringify(r.payload)}`);
      break;
    }
    case pe.Complete: {
      if (typeof r.id != "string")
        throw new Error(`"${r.type}" message expects the 'id' property to be a string, but got ${Fe(r.id)}`);
      if (!r.id)
        throw new Error(`"${r.type}" message requires a non-empty 'id' property`);
      break;
    }
    default:
      throw new Error(`Invalid message 'type' property "${r.type}"`);
  }
  return r;
}
function sy(r, e) {
  return Vu(typeof r == "string" ? JSON.parse(r, e) : r);
}
function kr(r, e) {
  return Vu(r), JSON.stringify(r, e);
}
var nr = function(r) {
  return this instanceof nr ? (this.v = r, this) : new nr(r);
}, oy = function(r, e, t) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = t.apply(r, e || []), i, s = [];
  return i = {}, o("next"), o("throw"), o("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function o(p) {
    n[p] && (i[p] = function(m) {
      return new Promise(function(v, w) {
        s.push([p, m, v, w]) > 1 || a(p, m);
      });
    });
  }
  function a(p, m) {
    try {
      l(n[p](m));
    } catch (v) {
      d(s[0][3], v);
    }
  }
  function l(p) {
    p.value instanceof nr ? Promise.resolve(p.value.v).then(h, c) : d(s[0][2], p);
  }
  function h(p) {
    a("next", p);
  }
  function c(p) {
    a("throw", p);
  }
  function d(p, m) {
    p(m), s.shift(), s.length && a(s[0][0], s[0][1]);
  }
};
function ay(r) {
  const {
    url: e,
    connectionParams: t,
    lazy: n = !0,
    onNonLazyError: i = console.error,
    lazyCloseTimeout: s = 0,
    keepAlive: o = 0,
    disablePong: a,
    connectionAckWaitTimeout: l = 0,
    retryAttempts: h = 5,
    retryWait: c = async function(X) {
      let P = 1e3;
      for (let Q = 0; Q < X; Q++)
        P *= 2;
      await new Promise((Q) => setTimeout(Q, P + // add random timeout from 300ms to 3s
      Math.floor(Math.random() * 2700 + 300)));
    },
    shouldRetry: d = mi,
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
  } = r;
  let T;
  if (v) {
    if (!cy(v))
      throw new Error("Invalid WebSocket implementation provided");
    T = v;
  } else typeof WebSocket < "u" ? T = WebSocket : typeof Ue < "u" ? T = Ue.WebSocket || // @ts-expect-error: Support more browsers
  Ue.MozWebSocket : typeof window < "u" && (T = window.WebSocket || // @ts-expect-error: Support more browsers
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
  let N, F = 0, B, q = !1, z = 0, Y = !1;
  async function Ae() {
    clearTimeout(B);
    const [V, X] = await (N ?? (N = new Promise((j, Ie) => (async () => {
      if (q) {
        if (await c(z), !F)
          return N = void 0, Ie({ code: 1e3, reason: "All Subscriptions Gone" });
        z++;
      }
      A.emit("connecting", q);
      const G = new I(typeof e == "function" ? await e() : e, iy);
      let Ge, xt;
      function ae() {
        isFinite(o) && o > 0 && (clearTimeout(xt), xt = setTimeout(() => {
          G.readyState === I.OPEN && (G.send(kr({ type: pe.Ping })), A.emit("ping", !1, void 0));
        }, o));
      }
      R((ve) => {
        N = void 0, clearTimeout(Ge), clearTimeout(xt), Ie(ve), ve instanceof da && (G.close(4499, "Terminated"), G.onerror = null, G.onclose = null);
      }), G.onerror = (ve) => A.emit("error", ve), G.onclose = (ve) => A.emit("closed", ve), G.onopen = async () => {
        try {
          A.emit("opened", G);
          const ve = typeof t == "function" ? await t() : t;
          if (G.readyState !== I.OPEN)
            return;
          G.send(kr(ve ? {
            type: pe.ConnectionInit,
            payload: ve
          } : {
            type: pe.ConnectionInit
            // payload is completely absent if not provided
          }, _)), isFinite(l) && l > 0 && (Ge = setTimeout(() => {
            G.close($e.ConnectionAcknowledgementTimeout, "Connection acknowledgement timeout");
          }, l)), ae();
        } catch (ve) {
          A.emit("error", ve), G.close($e.InternalClientError, pa(ve instanceof Error ? ve.message : new Error(ve).message, "Internal client error"));
        }
      };
      let fe = !1;
      G.onmessage = ({ data: ve }) => {
        try {
          const me = sy(ve, E);
          if (A.emit("message", me), me.type === "ping" || me.type === "pong") {
            A.emit(me.type, !0, me.payload), me.type === "pong" ? ae() : a || (G.send(kr(me.payload ? {
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
          clearTimeout(Ge), fe = !0, A.emit("connected", G, me.payload, q), q = !1, z = 0, j([
            G,
            new Promise((qn, Jr) => R(Jr))
          ]);
        } catch (me) {
          G.onmessage = null, A.emit("error", me), G.close($e.BadResponse, pa(me instanceof Error ? me.message : new Error(me).message, "Bad response"));
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
          if (!F) {
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
  function ze(V) {
    if (mi(V) && (uy(V.code) || [
      $e.InternalServerError,
      $e.InternalClientError,
      $e.BadRequest,
      $e.BadResponse,
      $e.Unauthorized,
      // CloseCode.Forbidden, might grant access out after retry
      $e.SubprotocolNotAcceptable,
      // CloseCode.ConnectionInitialisationTimeout, might not time out after retry
      // CloseCode.ConnectionAcknowledgementTimeout, might not time out after retry
      $e.SubscriberAlreadyExists,
      $e.TooManyInitialisationRequests
      // 4499, // Terminated, probably because the socket froze, we want to retry
    ].includes(V.code)))
      throw V;
    if (Y)
      return !1;
    if (mi(V) && V.code === 1e3)
      return F > 0;
    if (!h || z >= h || !d(V) || p?.(V))
      throw V;
    return q = !0;
  }
  n || (async () => {
    for (F++; ; )
      try {
        const [, , V] = await Ae();
        await V;
      } catch (V) {
        try {
          if (!ze(V))
            return;
        } catch (X) {
          return i?.(X);
        }
      }
  })();
  function Be(V, X) {
    const P = w(V);
    let Q = !1, j = !1, Ie = () => {
      F--, Q = !0;
    };
    return (async () => {
      for (F++; ; )
        try {
          const [G, Ge, xt] = await Ae();
          if (Q)
            return Ge();
          const ae = A.onMessage(P, (fe) => {
            switch (fe.type) {
              case pe.Next: {
                X.next(fe.payload);
                return;
              }
              case pe.Error: {
                j = !0, Q = !0, X.error(fe.payload), Ie();
                return;
              }
              case pe.Complete: {
                Q = !0, Ie();
                return;
              }
            }
          });
          G.send(kr({
            id: P,
            type: pe.Subscribe,
            payload: V
          }, _)), Ie = () => {
            !Q && G.readyState === I.OPEN && G.send(kr({
              id: P,
              type: pe.Complete
            }, _)), F--, Q = !0, Ge();
          }, await xt.finally(ae);
          return;
        } catch (G) {
          if (!ze(G))
            return;
        }
    })().then(() => {
      j || X.complete();
    }).catch((G) => {
      X.error(G);
    }), () => {
      Q || Ie();
    };
  }
  return {
    on: A.on,
    subscribe: Be,
    iterate(V) {
      const X = [], P = {
        done: !1,
        error: null,
        resolve: () => {
        }
      }, Q = Be(V, {
        next(Ie) {
          X.push(Ie), P.resolve();
        },
        error(Ie) {
          P.done = !0, P.error = Ie, P.resolve();
        },
        complete() {
          P.done = !0, P.resolve();
        }
      }), j = function() {
        return oy(this, arguments, function* () {
          for (; ; ) {
            for (X.length || (yield nr(new Promise((Ge) => P.resolve = Ge))); X.length; )
              yield yield nr(X.shift());
            if (P.error)
              throw P.error;
            if (P.done)
              return yield nr(void 0);
          }
        });
      }();
      return j.throw = async (Ie) => (P.done || (P.done = !0, P.error = Ie, P.resolve()), { done: !0, value: void 0 }), j.return = async () => (Q(), { done: !0, value: void 0 }), j;
    },
    async dispose() {
      if (Y = !0, N) {
        const [V] = await N;
        V.close(1e3, "Normal Closure");
      }
    },
    terminate() {
      N && A.emit("closed", new da());
    }
  };
}
class da extends Error {
  constructor() {
    super(...arguments), this.name = "TerminatedCloseEvent", this.message = "4499: Terminated", this.code = 4499, this.reason = "Terminated", this.wasClean = !1;
  }
}
function mi(r) {
  return Nt(r) && "code" in r && "reason" in r;
}
function uy(r) {
  return [
    1e3,
    1001,
    1006,
    1005,
    1012,
    1013,
    1014
    // Bad Gateway
  ].includes(r) ? !1 : r >= 1e3 && r <= 1999;
}
function cy(r) {
  return typeof r == "function" && "constructor" in r && "CLOSED" in r && "CLOSING" in r && "CONNECTING" in r && "OPEN" in r;
}
function ly(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var Te = typeof globalThis < "u" && globalThis || typeof self < "u" && self || // eslint-disable-next-line no-undef
typeof Ue < "u" && Ue || {}, De = {
  searchParams: "URLSearchParams" in Te,
  iterable: "Symbol" in Te && "iterator" in Symbol,
  blob: "FileReader" in Te && "Blob" in Te && function() {
    try {
      return new Blob(), !0;
    } catch {
      return !1;
    }
  }(),
  formData: "FormData" in Te,
  arrayBuffer: "ArrayBuffer" in Te
};
function hy(r) {
  return r && DataView.prototype.isPrototypeOf(r);
}
if (De.arrayBuffer)
  var fy = [
    "[object Int8Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Int16Array]",
    "[object Uint16Array]",
    "[object Int32Array]",
    "[object Uint32Array]",
    "[object Float32Array]",
    "[object Float64Array]"
  ], py = ArrayBuffer.isView || function(r) {
    return r && fy.indexOf(Object.prototype.toString.call(r)) > -1;
  };
function lr(r) {
  if (typeof r != "string" && (r = String(r)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(r) || r === "")
    throw new TypeError('Invalid character in header field name: "' + r + '"');
  return r.toLowerCase();
}
function Ss(r) {
  return typeof r != "string" && (r = String(r)), r;
}
function ks(r) {
  var e = {
    next: function() {
      var t = r.shift();
      return { done: t === void 0, value: t };
    }
  };
  return De.iterable && (e[Symbol.iterator] = function() {
    return e;
  }), e;
}
function we(r) {
  this.map = {}, r instanceof we ? r.forEach(function(e, t) {
    this.append(t, e);
  }, this) : Array.isArray(r) ? r.forEach(function(e) {
    if (e.length != 2)
      throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + e.length);
    this.append(e[0], e[1]);
  }, this) : r && Object.getOwnPropertyNames(r).forEach(function(e) {
    this.append(e, r[e]);
  }, this);
}
we.prototype.append = function(r, e) {
  r = lr(r), e = Ss(e);
  var t = this.map[r];
  this.map[r] = t ? t + ", " + e : e;
};
we.prototype.delete = function(r) {
  delete this.map[lr(r)];
};
we.prototype.get = function(r) {
  return r = lr(r), this.has(r) ? this.map[r] : null;
};
we.prototype.has = function(r) {
  return this.map.hasOwnProperty(lr(r));
};
we.prototype.set = function(r, e) {
  this.map[lr(r)] = Ss(e);
};
we.prototype.forEach = function(r, e) {
  for (var t in this.map)
    this.map.hasOwnProperty(t) && r.call(e, this.map[t], t, this);
};
we.prototype.keys = function() {
  var r = [];
  return this.forEach(function(e, t) {
    r.push(t);
  }), ks(r);
};
we.prototype.values = function() {
  var r = [];
  return this.forEach(function(e) {
    r.push(e);
  }), ks(r);
};
we.prototype.entries = function() {
  var r = [];
  return this.forEach(function(e, t) {
    r.push([t, e]);
  }), ks(r);
};
De.iterable && (we.prototype[Symbol.iterator] = we.prototype.entries);
function gi(r) {
  if (!r._noBody) {
    if (r.bodyUsed)
      return Promise.reject(new TypeError("Already read"));
    r.bodyUsed = !0;
  }
}
function Qu(r) {
  return new Promise(function(e, t) {
    r.onload = function() {
      e(r.result);
    }, r.onerror = function() {
      t(r.error);
    };
  });
}
function dy(r) {
  var e = new FileReader(), t = Qu(e);
  return e.readAsArrayBuffer(r), t;
}
function yy(r) {
  var e = new FileReader(), t = Qu(e), n = /charset=([A-Za-z0-9_-]+)/.exec(r.type), i = n ? n[1] : "utf-8";
  return e.readAsText(r, i), t;
}
function my(r) {
  for (var e = new Uint8Array(r), t = new Array(e.length), n = 0; n < e.length; n++)
    t[n] = String.fromCharCode(e[n]);
  return t.join("");
}
function ya(r) {
  if (r.slice)
    return r.slice(0);
  var e = new Uint8Array(r.byteLength);
  return e.set(new Uint8Array(r)), e.buffer;
}
function Hu() {
  return this.bodyUsed = !1, this._initBody = function(r) {
    this.bodyUsed = this.bodyUsed, this._bodyInit = r, r ? typeof r == "string" ? this._bodyText = r : De.blob && Blob.prototype.isPrototypeOf(r) ? this._bodyBlob = r : De.formData && FormData.prototype.isPrototypeOf(r) ? this._bodyFormData = r : De.searchParams && URLSearchParams.prototype.isPrototypeOf(r) ? this._bodyText = r.toString() : De.arrayBuffer && De.blob && hy(r) ? (this._bodyArrayBuffer = ya(r.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : De.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(r) || py(r)) ? this._bodyArrayBuffer = ya(r) : this._bodyText = r = Object.prototype.toString.call(r) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof r == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : De.searchParams && URLSearchParams.prototype.isPrototypeOf(r) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
  }, De.blob && (this.blob = function() {
    var r = gi(this);
    if (r)
      return r;
    if (this._bodyBlob)
      return Promise.resolve(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(new Blob([this._bodyArrayBuffer]));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as blob");
    return Promise.resolve(new Blob([this._bodyText]));
  }), this.arrayBuffer = function() {
    if (this._bodyArrayBuffer) {
      var r = gi(this);
      return r || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
        this._bodyArrayBuffer.buffer.slice(
          this._bodyArrayBuffer.byteOffset,
          this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
        )
      ) : Promise.resolve(this._bodyArrayBuffer));
    } else {
      if (De.blob)
        return this.blob().then(dy);
      throw new Error("could not read as ArrayBuffer");
    }
  }, this.text = function() {
    var r = gi(this);
    if (r)
      return r;
    if (this._bodyBlob)
      return yy(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(my(this._bodyArrayBuffer));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as text");
    return Promise.resolve(this._bodyText);
  }, De.formData && (this.formData = function() {
    return this.text().then(by);
  }), this.json = function() {
    return this.text().then(JSON.parse);
  }, this;
}
var gy = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
function vy(r) {
  var e = r.toUpperCase();
  return gy.indexOf(e) > -1 ? e : r;
}
function Vt(r, e) {
  if (!(this instanceof Vt))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  e = e || {};
  var t = e.body;
  if (r instanceof Vt) {
    if (r.bodyUsed)
      throw new TypeError("Already read");
    this.url = r.url, this.credentials = r.credentials, e.headers || (this.headers = new we(r.headers)), this.method = r.method, this.mode = r.mode, this.signal = r.signal, !t && r._bodyInit != null && (t = r._bodyInit, r.bodyUsed = !0);
  } else
    this.url = String(r);
  if (this.credentials = e.credentials || this.credentials || "same-origin", (e.headers || !this.headers) && (this.headers = new we(e.headers)), this.method = vy(e.method || this.method || "GET"), this.mode = e.mode || this.mode || null, this.signal = e.signal || this.signal || function() {
    if ("AbortController" in Te) {
      var s = new AbortController();
      return s.signal;
    }
  }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && t)
    throw new TypeError("Body not allowed for GET or HEAD requests");
  if (this._initBody(t), (this.method === "GET" || this.method === "HEAD") && (e.cache === "no-store" || e.cache === "no-cache")) {
    var n = /([?&])_=[^&]*/;
    if (n.test(this.url))
      this.url = this.url.replace(n, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
    else {
      var i = /\?/;
      this.url += (i.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
    }
  }
}
Vt.prototype.clone = function() {
  return new Vt(this, { body: this._bodyInit });
};
function by(r) {
  var e = new FormData();
  return r.trim().split("&").forEach(function(t) {
    if (t) {
      var n = t.split("="), i = n.shift().replace(/\+/g, " "), s = n.join("=").replace(/\+/g, " ");
      e.append(decodeURIComponent(i), decodeURIComponent(s));
    }
  }), e;
}
function wy(r) {
  var e = new we(), t = r.replace(/\r?\n[\t ]+/g, " ");
  return t.split("\r").map(function(n) {
    return n.indexOf(`
`) === 0 ? n.substr(1, n.length) : n;
  }).forEach(function(n) {
    var i = n.split(":"), s = i.shift().trim();
    if (s) {
      var o = i.join(":").trim();
      try {
        e.append(s, o);
      } catch (a) {
        console.warn("Response " + a.message);
      }
    }
  }), e;
}
Hu.call(Vt.prototype);
function rt(r, e) {
  if (!(this instanceof rt))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  if (e || (e = {}), this.type = "default", this.status = e.status === void 0 ? 200 : e.status, this.status < 200 || this.status > 599)
    throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
  this.ok = this.status >= 200 && this.status < 300, this.statusText = e.statusText === void 0 ? "" : "" + e.statusText, this.headers = new we(e.headers), this.url = e.url || "", this._initBody(r);
}
Hu.call(rt.prototype);
rt.prototype.clone = function() {
  return new rt(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new we(this.headers),
    url: this.url
  });
};
rt.error = function() {
  var r = new rt(null, { status: 200, statusText: "" });
  return r.ok = !1, r.status = 0, r.type = "error", r;
};
var _y = [301, 302, 303, 307, 308];
rt.redirect = function(r, e) {
  if (_y.indexOf(e) === -1)
    throw new RangeError("Invalid status code");
  return new rt(null, { status: e, headers: { location: r } });
};
var Ft = Te.DOMException;
try {
  new Ft();
} catch {
  Ft = function(e, t) {
    this.message = e, this.name = t;
    var n = Error(e);
    this.stack = n.stack;
  }, Ft.prototype = Object.create(Error.prototype), Ft.prototype.constructor = Ft;
}
function Wu(r, e) {
  return new Promise(function(t, n) {
    var i = new Vt(r, e);
    if (i.signal && i.signal.aborted)
      return n(new Ft("Aborted", "AbortError"));
    var s = new XMLHttpRequest();
    function o() {
      s.abort();
    }
    s.onload = function() {
      var h = {
        statusText: s.statusText,
        headers: wy(s.getAllResponseHeaders() || "")
      };
      i.url.indexOf("file://") === 0 && (s.status < 200 || s.status > 599) ? h.status = 200 : h.status = s.status, h.url = "responseURL" in s ? s.responseURL : h.headers.get("X-Request-URL");
      var c = "response" in s ? s.response : s.responseText;
      setTimeout(function() {
        t(new rt(c, h));
      }, 0);
    }, s.onerror = function() {
      setTimeout(function() {
        n(new TypeError("Network request failed"));
      }, 0);
    }, s.ontimeout = function() {
      setTimeout(function() {
        n(new TypeError("Network request timed out"));
      }, 0);
    }, s.onabort = function() {
      setTimeout(function() {
        n(new Ft("Aborted", "AbortError"));
      }, 0);
    };
    function a(h) {
      try {
        return h === "" && Te.location.href ? Te.location.href : h;
      } catch {
        return h;
      }
    }
    if (s.open(i.method, a(i.url), !0), i.credentials === "include" ? s.withCredentials = !0 : i.credentials === "omit" && (s.withCredentials = !1), "responseType" in s && (De.blob ? s.responseType = "blob" : De.arrayBuffer && (s.responseType = "arraybuffer")), e && typeof e.headers == "object" && !(e.headers instanceof we || Te.Headers && e.headers instanceof Te.Headers)) {
      var l = [];
      Object.getOwnPropertyNames(e.headers).forEach(function(h) {
        l.push(lr(h)), s.setRequestHeader(h, Ss(e.headers[h]));
      }), i.headers.forEach(function(h, c) {
        l.indexOf(c) === -1 && s.setRequestHeader(c, h);
      });
    } else
      i.headers.forEach(function(h, c) {
        s.setRequestHeader(c, h);
      });
    i.signal && (i.signal.addEventListener("abort", o), s.onreadystatechange = function() {
      s.readyState === 4 && i.signal.removeEventListener("abort", o);
    }), s.send(typeof i._bodyInit > "u" ? null : i._bodyInit);
  });
}
Wu.polyfill = !0;
Te.fetch || (Te.fetch = Wu, Te.Headers = we, Te.Request = Vt, Te.Response = rt);
var Ey = self.fetch.bind(self);
const Sy = /* @__PURE__ */ ly(Ey);
function ky({
  graphQLErrors: r,
  networkError: e,
  operation: t,
  forward: n,
  response: i
}) {
  if (r && r.forEach(
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
function xy(r) {
  return r.query.definitions.find(
    (n) => n.kind === "OperationDefinition"
  ).selectionSet.selections.find(
    (n) => n.kind === "Field"
  ).name.value;
}
function Ty(r) {
  return r.query.definitions.find(
    (t) => t.kind === "OperationDefinition"
  ).operation;
}
class Ay extends Ve {
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
    const n = xy(e), i = Ty(e), s = i === "mutation" && n === "ProposeMolecule";
    if ([
      i === "query" && ["__schema", "ContinuId"].includes(n),
      i === "mutation" && n === "AccessToken",
      s && he.get(e, "variables.molecule.atoms.0.isotope") === "U"
    ].some((c) => c))
      return t(e);
    const a = this.getWallet(), l = this.getPubKey();
    if (!l)
      throw new qe("CipherLink::request() - Node public key missing!");
    if (!a)
      throw new qe("CipherLink::request() - Authorized wallet missing!");
    const h = {
      query: ns(e.query),
      variables: JSON.stringify(e.variables)
    };
    return e.operationName = null, e.query = ie`query ($Hash: String!) { CipherHash(Hash: $Hash) { hash } }`, e.variables = { Hash: JSON.stringify(a.encryptMessage(h, l)) }, t(e).map((c) => {
      let d = c.data;
      if (d.data && (d = d.data), d.CipherHash && d.CipherHash.hash) {
        const p = JSON.parse(d.CipherHash.hash), m = a.decryptMessage(p);
        if (m === null)
          throw new qe("CipherLink::request() - Unable to decrypt response!");
        return m;
      }
      return c;
    });
  }
}
class on extends Fp {
  /**
   * @param {Object} config - Configuration object
   * @param {string} config.serverUri - URI of the GraphQL server
   * @param {Object|null} config.soketi - WebSocket configuration (optional)
   * @param {boolean} config.encrypt - Whether to use encryption (default: false)
   */
  constructor({ serverUri: e, soketi: t = null, encrypt: n = !1 }) {
    const i = hu({
      uri: e,
      fetch: Sy
    }), s = "", o = ey((d, { headers: p }) => ({
      headers: {
        ...p,
        "X-Auth-Token": s
      }
    })), a = ju(ky);
    let l = To([o, a, i]), h;
    n && (h = new Ay(), l = To([h, l]));
    let c;
    t && t.socketUri && (c = new ry(ay({
      url: t.socketUri,
      connectionParams: () => ({
        authToken: s
      })
    })), l = _f(
      ({ query: d }) => {
        const p = Bn(d);
        return p.kind === "OperationDefinition" && p.operation === "subscription";
      },
      c,
      l
    )), super({
      link: l,
      cache: new xp(),
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
    }), this.serverUri = e, this.soketi = t, this.authToken = s, this.pubkey = null, this.wallet = null, this.cipherLink = h, this.wsLink = c;
  }
  /**
   * Set authentication data
   * @param {Object} authData - Authentication data
   * @param {string} authData.token - Auth token
   * @param {string} authData.pubkey - Public key
   * @param {Object} authData.wallet - Wallet object
   */
  setAuthData({ token: e, pubkey: t, wallet: n }) {
    this.authToken = e, this.pubkey = t, this.wallet = n, this.cipherLink && (this.cipherLink.setWallet(n), this.cipherLink.setPubKey(t)), this.wsLink && (this.wsLink.client.connectionParams = () => ({
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
class Iy {
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
    const n = this.$__client.subscribe(e).subscribe(t);
    return this.$__subscribers[e.operationName] = n, n;
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
class Oy {
  /**
   * @param {Object} config - Configuration object
   * @param {string} config.serverUri - URI of the GraphQL server
   * @param {Object|null} config.socket - WebSocket configuration (optional)
   * @param {boolean} config.encrypt - Whether to use encryption (default: false)
   */
  constructor({ serverUri: e, socket: t = null, encrypt: n = !1 }) {
    this.$__client = new on({ serverUri: e, soketi: t, encrypt: n }), this.$__subscriptionManager = new Iy(this.$__client);
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
    this.$__client = new on(t), this.$__subscriptionManager.setClient(this.$__client);
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
  setAuthData({ token: e, pubkey: t, wallet: n }) {
    this.$__client.setAuthData({ token: e, pubkey: t, wallet: n });
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
    this.$__client = new on(t), this.$__subscriptionManager.setClient(this.$__client);
  }
  /**
   * Set the WebSocket URI
   * @param {Object} config - WebSocket configuration
   * @param {string} config.socketUri - New WebSocket URI
   * @param {string} config.appKey - Application key for the WebSocket
   */
  setSocketUri({ socketUri: e, appKey: t }) {
    const n = {
      serverUri: this.$__client.getServerUri(),
      soketi: { socketUri: e, appKey: t },
      encrypt: !!this.$__client.cipherLink
    };
    this.$__client = new on(n), this.$__subscriptionManager.setClient(this.$__client);
  }
}
class Uy {
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
    client: n = null,
    socket: i = null,
    serverSdkVersion: s = 3,
    logging: o = !1
  }) {
    this.initialize({
      uri: e,
      cellSlug: t,
      socket: i,
      client: n,
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
    socket: n = null,
    client: i = null,
    serverSdkVersion: s = 3,
    logging: o = !1
  }) {
    this.reset(), this.$__logging = o, this.$__uris = typeof e == "object" ? e : [e], this.$__authTokenObjects = {}, this.$__authInProcess = !1, this.abortControllers = /* @__PURE__ */ new Map(), t && this.setCellSlug(t);
    for (const a in this.$__uris) {
      const l = this.$__uris[a];
      this.$__authTokenObjects[l] = null;
    }
    this.log("info", `KnishIOClient::initialize() - Initializing new Knish.IO client session for SDK version ${s}...`), this.$__client = i || new Oy({
      socket: {
        socketUri: null,
        appKey: "knishio",
        ...n || {}
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
      throw new qe("KnishIOClient::subscribe() - Socket client not initialized!");
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
    return this.log("info", `KnishIOClient::hashSecret(${t ? `source: ${t}` : ""}) - Computing wallet bundle from secret...`), ir(e);
  }
  /**
   * Retrieves the stored secret for this session
   *
   * @return {string}
   */
  getSecret() {
    if (!this.hasSecret())
      throw new wi("KnishIOClient::getSecret() - Unable to find a stored secret! Have you set a secret?");
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
      throw new wi("KnishIOClient::getBundle() - Unable to find a stored bundle! Have you set a secret?");
    return this.$__bundle;
  }
  /**
   * Retrieves the device fingerprint.
   *
   * @returns {Promise<string>} A promise that resolves to the device fingerprint as a string.
   */
  getFingerprint() {
    return jd();
  }
  getFingerprintData() {
    return Lu();
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
    sourceWallet: n = null,
    remainderWallet: i = null
  }) {
    return this.log("info", "KnishIOClient::createMolecule() - Creating a new molecule..."), e = e || this.getSecret(), t = t || this.getBundle(), !n && this.lastMoleculeQuery && this.getRemainderWallet().token === "USER" && this.lastMoleculeQuery.response() && this.lastMoleculeQuery.response().success() && (n = this.getRemainderWallet()), n === null && (n = await this.getSourceWallet()), this.remainderWallet = i || J.create({
      secret: e,
      bundle: t,
      token: "USER",
      batchId: n.batchId,
      characters: n.characters
    }), new ut({
      secret: e,
      sourceWallet: n,
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
    const n = t || await this.createMolecule({}), i = new e(this.client(), this, n);
    if (!(i instanceof Ce))
      throw new qe(`${this.constructor.name}::createMoleculeMutation() - This method only accepts MutationProposeMolecule!`);
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
    const n = new AbortController(), i = JSON.stringify({ query: e.$__query, variables: t });
    this.abortControllers.set(i, n);
    try {
      const s = await e.execute({
        variables: t,
        context: {
          fetchOptions: {
            signal: n.signal
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
    const n = JSON.stringify({ query: e.$__query, variables: t }), i = this.abortControllers.get(n);
    i && (i.abort(), this.abortControllers.delete(n));
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
    const i = this.createQuery(zp);
    return this.executeQuery(i, {
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
    const i = (await this.queryBalance({
      token: e,
      type: n
    })).payload();
    if (i === null || Zt.cmp(i.balance, t) < 0)
      throw new at();
    if (!i.position || !i.address)
      throw new at("Source wallet can not be a shadow wallet.");
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
    return await this.createSubscribe(md).execute({
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
      throw new qe(`${this.constructor.name}::subscribeWalletStatus() - Token parameter is required!`);
    return this.createSubscribe(gd).execute({
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
    return this.createSubscribe(vd).execute({
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
    return this.createSubscribe(bd).execute({
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
   * @param {boolean|null} latestMetas
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
    value: i = null,
    latest: s = !0,
    latestMetas: o = !0,
    fields: a = null,
    filter: l = null,
    queryArgs: h = null,
    count: c = null,
    countBy: d = null,
    throughAtom: p = !0,
    values: m = null,
    keys: v = null,
    atomValues: w = null
  }) {
    this.log("info", `KnishIOClient::queryMeta() - Querying metaType: ${e}, metaId: ${t}...`);
    let _, E;
    return p ? (_ = this.createQuery(aa), E = aa.createVariables({
      metaType: e,
      metaId: t,
      key: n,
      value: i,
      latest: s,
      latestMetas: o,
      filter: l,
      queryArgs: h,
      countBy: d,
      values: m,
      keys: v,
      atomValues: w
    })) : (_ = this.createQuery(na), E = na.createVariables({
      metaType: e,
      metaId: t,
      key: n,
      value: i,
      latest: s,
      latestMetas: o,
      filter: l,
      queryArgs: h,
      count: c,
      countBy: d
    })), this.executeQuery(_, E).then((T) => T.payload());
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
    const t = this.createQuery(jr);
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
    const t = this.createQuery(Jp);
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
    bundleHash: i,
    positions: s,
    position: o,
    walletAddresses: a,
    walletAddress: l,
    isotopes: h,
    isotope: c,
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
    indexes: F,
    index: B,
    filter: q,
    latest: z,
    queryArgs: Y = {
      limit: 15,
      offset: 1
    }
  }) {
    this.log("info", "KnishIOClient::queryAtom() - Querying atom instances");
    const Ae = this.createQuery(oa);
    return await this.executeQuery(Ae, oa.createVariables({
      molecularHashes: e,
      molecularHash: t,
      bundleHashes: n,
      bundleHash: i,
      positions: s,
      position: o,
      walletAddresses: a,
      walletAddress: l,
      isotopes: h,
      isotope: c,
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
      indexes: F,
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
    }), n = await this.createMoleculeMutation({
      mutationClass: fd
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
    const i = this.createQuery(Sd);
    return await this.executeQuery(i, {
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
    ipAddress: i,
    browser: s,
    osCpu: o,
    resolution: a,
    timeZone: l,
    countBy: h,
    interval: c
  }) {
    const d = this.createQuery(xd);
    return await this.executeQuery(d, {
      bundleHash: e,
      metaType: t,
      metaId: n,
      ipAddress: i,
      browser: s,
      osCpu: o,
      resolution: a,
      timeZone: l,
      countBy: h,
      interval: c
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
    ipAddress: i,
    browser: s,
    osCpu: o,
    resolution: a,
    timeZone: l,
    json: h = {}
  }) {
    const c = this.createQuery(_d);
    return await this.executeQuery(c, {
      bundleHash: e,
      metaType: t,
      metaId: n,
      ipAddress: i,
      browser: s,
      osCpu: o,
      resolution: a,
      timeZone: l,
      json: JSON.stringify(h)
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
    batchId: i = null,
    units: s = []
  }) {
    const o = he.get(n || {}, "fungibility");
    if (o === "stackable" && (n.batchId = i || wn({})), ["nonfungible", "stackable"].includes(o) && s.length > 0) {
      if (he.get(n || {}, "decimals") > 0)
        throw new yd();
      if (t > 0)
        throw new sn();
      t = s.length, n.splittable = 1, n.decimals = 0, n.tokenUnits = JSON.stringify(s);
    }
    const a = new J({
      secret: this.getSecret(),
      bundle: this.getBundle(),
      token: e,
      batchId: i
    }), l = await this.createMoleculeMutation({
      mutationClass: ed
    });
    return l.fillMolecule({
      recipientWallet: a,
      amount: t,
      meta: n || {}
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
    rule: n,
    policy: i = {}
  }) {
    const s = await this.createMoleculeMutation(
      {
        mutationClass: Nd,
        molecule: await this.createMolecule({
          secret: this.getSecret(),
          sourceWallet: await this.getSourceWallet()
        })
      }
    );
    return s.fillMolecule({
      metaType: e,
      metaId: t,
      rule: n,
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
    meta: n = null,
    policy: i = {}
  }) {
    const s = await this.createMoleculeMutation(
      {
        mutationClass: ld,
        molecule: await this.createMolecule({
          secret: this.getSecret(),
          sourceWallet: await this.getSourceWallet()
        })
      }
    ), o = n || {};
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
    code: n
  }) {
    const i = await this.createMoleculeMutation({
      mutationClass: od
    });
    return i.fillMolecule({
      type: e,
      contact: t,
      code: n
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
    policy: n = {}
  }) {
    const i = await this.createMolecule({});
    i.addPolicyAtom({
      metaType: e,
      metaId: t,
      meta: {},
      policy: n
    }), i.addContinuIdAtom(), i.sign({
      bundle: this.getBundle()
    }), i.check();
    const s = await this.createMoleculeMutation({
      mutationClass: Ce,
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
    const n = this.createQuery(Od);
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
    const i = this.createQuery(Wp);
    return this.executeQuery(i, {
      bundleHash: e || this.getBundle(),
      tokenSlug: t,
      unspent: n
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
    raw: n = !1
  }) {
    this.log("info", `KnishIOClient::queryBundle() - Querying wallet bundle metadata${e ? ` for ${e}` : ""}...`), e || (e = this.getBundle()), typeof e == "string" && (e = [e]);
    const i = this.createQuery(Hp);
    return this.executeQuery(i, { bundleHashes: e }).then((s) => n ? s : s.payload());
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
    const t = this.createQuery(Vp);
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
    units: i = [],
    meta: s = null,
    batchId: o = null
  }) {
    let a, l;
    s = s || {};
    const h = this.createQuery(Td), c = await this.executeQuery(h, {
      slug: e
    }), d = he.get(c.data(), "0.fungibility") === "stackable";
    if (!d && o !== null)
      throw new cn("Expected Batch ID = null for non-stackable tokens.");
    if (d && o === null && (o = wn({})), i.length > 0) {
      if (n > 0)
        throw new sn();
      n = i.length, s.tokenUnits = JSON.stringify(i);
    }
    t ? (Object.prototype.toString.call(t) === "[object String]" && (J.isBundleHash(t) ? (a = "walletBundle", l = t) : t = J.create({
      secret: t,
      token: e
    })), t instanceof J && (a = "wallet", s.position = t.position, s.bundle = t.bundle, l = t.address)) : (a = "walletBundle", l = this.getBundle());
    const p = await this.createMoleculeMutation({
      mutationClass: rd
    });
    return p.fillMolecule({
      token: e,
      amount: n,
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
    molecule: n = null
  }) {
    const i = await this.createMoleculeMutation({
      mutationClass: ud,
      molecule: n
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
      throw new ia();
    t.forEach((i) => {
      if (!i.isShadow())
        throw new ia();
    });
    const n = [];
    for (const i of t)
      n.push(await this.claimShadowWallet({
        token: e,
        batchId: i.batchId
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
    units: i = [],
    batchId: s = null,
    sourceWallet: o = null
  }) {
    if (i.length > 0) {
      if (n > 0)
        throw new sn();
      n = i.length;
    }
    if (o === null && (o = await this.querySourceWallet({
      token: t,
      amount: n
    })), o === null || Zt.cmp(o.balance, n) < 0)
      throw new at();
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
    const h = await this.createMolecule({
      sourceWallet: o,
      remainderWallet: l
    }), c = await this.createMoleculeMutation({
      mutationClass: id,
      molecule: h
    });
    return c.fillMolecule({
      recipientWallet: a,
      amount: n
    }), await this.executeQuery(c);
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
      mutationClass: Dd,
      molecule: o
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
    signingWallet: i = null
  }) {
    n === null && (n = await this.querySourceWallet({
      token: e,
      amount: t,
      type: "buffer"
    }));
    const s = n, o = await this.createMolecule({
      sourceWallet: n,
      remainderWallet: s
    }), a = await this.createMoleculeMutation({
      mutationClass: Fd,
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
    units: n = [],
    sourceWallet: i = null
  }) {
    i === null && (i = await this.querySourceWallet({
      token: e,
      amount: t
    }));
    const s = i.createRemainder(this.getSecret());
    if (n.length > 0) {
      if (t > 0)
        throw new sn();
      t = n.length, i.splitUnits(
        n,
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
      mutationClass: Ce,
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
    units: n = [],
    sourceWallet: i = null
  }) {
    if (i === null && (i = (await this.queryBalance({ token: e })).payload()), !i)
      throw new at("Source wallet is missing or invalid.");
    const s = i.createRemainder(this.getSecret()), o = await this.createMolecule({
      sourceWallet: i,
      remainderWallet: s
    });
    o.replenishToken({
      amount: t,
      units: n
    }), o.sign({
      bundle: this.getBundle()
    }), o.check();
    const a = await this.createMoleculeMutation({
      mutationClass: Ce,
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
    newTokenUnit: n,
    fusedTokenUnitIds: i,
    sourceWallet: s = null
  }) {
    if (s === null && (s = (await this.queryBalance({ token: t })).payload()), s === null)
      throw new at("Source wallet is missing or invalid.");
    if (!s.tokenUnits || !s.tokenUnits.length)
      throw new at("Source wallet does not have token units.");
    if (!i.length)
      throw new at("Fused token unit list is empty.");
    const o = [];
    s.tokenUnits.forEach((d) => {
      o.push(d.id);
    }), i.forEach((d) => {
      if (!o.includes(d))
        throw new at(`Fused token unit ID = ${d} does not found in the source wallet.`);
    });
    const a = J.create({
      bundle: e,
      token: t
    });
    a.initBatchId({ sourceWallet: s });
    const l = s.createRemainder(this.getSecret());
    s.splitUnits(i, l), n.metas.fusedTokenUnits = s.getTokenUnitsData(), a.tokenUnits = [n];
    const h = await this.createMolecule({
      sourceWallet: s,
      remainderWallet: l
    });
    h.fuseToken(s.tokenUnits, a), h.sign({
      bundle: this.getBundle()
    }), h.check();
    const c = await this.createMoleculeMutation({
      mutationClass: Ce,
      molecule: h
    });
    return this.executeQuery(c);
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
    const n = new J({
      secret: bi(await this.getFingerprint()),
      token: "AUTH"
    }), i = await this.createQuery(dd), s = {
      cellSlug: e,
      pubkey: n.pubkey,
      encrypt: t
    }, o = await i.execute({ variables: s });
    if (o.success()) {
      const a = $r.create(o.payload(), n);
      this.setAuthToken(a);
    } else
      throw new sa(`KnishIOClient::requestGuestAuthToken() - Authorization attempt rejected by ledger. Reason: ${o.reason()}`);
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
    const n = new J({
      secret: e,
      token: "AUTH"
    }), i = await this.createMolecule({
      secret: e,
      sourceWallet: n
    }), s = await this.createMoleculeMutation({
      mutationClass: Xp,
      molecule: i
    });
    s.fillMolecule({ meta: { encrypt: t ? "true" : "false" } });
    const o = await s.execute({});
    if (o.success()) {
      const a = $r.create(o.payload(), n);
      this.setAuthToken(a);
    } else
      throw new sa(`KnishIOClient::requestProfileAuthToken() - Authorization attempt rejected by ledger. Reason: ${o.reason()}`);
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
    cellSlug: n = null,
    encrypt: i = !1
  }) {
    if (this.$__serverSdkVersion < 3)
      return this.log("warn", "KnishIOClient::authorize() - Server SDK version does not require an authorization..."), null;
    e === null && t && (e = bi(t)), this.$__authInProcess = !0;
    let s;
    return e ? s = await this.requestProfileAuthToken({
      secret: e,
      encrypt: i
    }) : s = await this.requestGuestAuthToken({
      cellSlug: n,
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
  Uy as KnishIOClient,
  bn as Meta,
  ut as Molecule,
  J as Wallet,
  Rc as base64ToHex,
  My as bufferToHexString,
  Oc as charsetBaseConvert,
  vn as chunkSubstr,
  ir as generateBundleHash,
  bi as generateSecret,
  $y as hexStringToBuffer,
  Cc as hexToBase64,
  Nc as isHex,
  Yi as randomString
};
//# sourceMappingURL=client.es.mjs.map
