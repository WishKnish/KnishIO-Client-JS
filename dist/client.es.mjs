var Cc = Object.defineProperty, Rc = Object.defineProperties;
var Nc = Object.getOwnPropertyDescriptors;
var $s = Object.getOwnPropertySymbols, Dc = Object.getPrototypeOf, Fc = Object.prototype.hasOwnProperty, Mc = Object.prototype.propertyIsEnumerable, Bc = Reflect.get;
var Y = Math.pow, Ps = (r, e, t) => e in r ? Cc(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, Ue = (r, e) => {
  for (var t in e || (e = {}))
    Fc.call(e, t) && Ps(r, t, e[t]);
  if ($s)
    for (var t of $s(e))
      Mc.call(e, t) && Ps(r, t, e[t]);
  return r;
}, vr = (r, e) => Rc(r, Nc(e));
var Ls = (r, e, t) => Bc(Dc(r), t, e);
var L = (r, e, t) => new Promise((n, i) => {
  var s = (u) => {
    try {
      a(t.next(u));
    } catch (f) {
      i(f);
    }
  }, o = (u) => {
    try {
      a(t.throw(u));
    } catch (f) {
      i(f);
    }
  }, a = (u) => u.done ? n(u.value) : Promise.resolve(u.value).then(s, o);
  a((t = t.apply(r, e)).next());
});
const Ia = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Aa = "ARRAYBUFFER not supported by this environment", Oa = "UINT8ARRAY not supported by this environment";
function Us(r, e, t, n) {
  let i, s, o;
  const a = e || [0], u = (t = t || 0) >>> 3, f = n === -1 ? 3 : 0;
  for (i = 0; i < r.length; i += 1) o = i + u, s = o >>> 2, a.length <= s && a.push(0), a[s] |= r[i] << 8 * (f + n * (o % 4));
  return { value: a, binLen: 8 * r.length + t };
}
function hr(r, e, t) {
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
        return function(o, a, u, f) {
          let c, d, p, y;
          if (o.length % 2 != 0) throw new Error("String of HEX type must be in byte increments");
          const v = a || [0], w = (u = u || 0) >>> 3, E = f === -1 ? 3 : 0;
          for (c = 0; c < o.length; c += 2) {
            if (d = parseInt(o.substr(c, 2), 16), isNaN(d)) throw new Error("String of HEX type contains invalid characters");
            for (y = (c >>> 1) + w, p = y >>> 2; v.length <= p; ) v.push(0);
            v[p] |= d << 8 * (E + f * (y % 4));
          }
          return { value: v, binLen: 4 * o.length + u };
        }(n, i, s, t);
      };
    case "TEXT":
      return function(n, i, s) {
        return function(o, a, u, f, c) {
          let d, p, y, v, w, E, b, k, S = 0;
          const A = u || [0], O = (f = f || 0) >>> 3;
          if (a === "UTF8") for (b = c === -1 ? 3 : 0, y = 0; y < o.length; y += 1) for (d = o.charCodeAt(y), p = [], 128 > d ? p.push(d) : 2048 > d ? (p.push(192 | d >>> 6), p.push(128 | 63 & d)) : 55296 > d || 57344 <= d ? p.push(224 | d >>> 12, 128 | d >>> 6 & 63, 128 | 63 & d) : (y += 1, d = 65536 + ((1023 & d) << 10 | 1023 & o.charCodeAt(y)), p.push(240 | d >>> 18, 128 | d >>> 12 & 63, 128 | d >>> 6 & 63, 128 | 63 & d)), v = 0; v < p.length; v += 1) {
            for (E = S + O, w = E >>> 2; A.length <= w; ) A.push(0);
            A[w] |= p[v] << 8 * (b + c * (E % 4)), S += 1;
          }
          else for (b = c === -1 ? 2 : 0, k = a === "UTF16LE" && c !== 1 || a !== "UTF16LE" && c === 1, y = 0; y < o.length; y += 1) {
            for (d = o.charCodeAt(y), k === !0 && (v = 255 & d, d = v << 8 | d >>> 8), E = S + O, w = E >>> 2; A.length <= w; ) A.push(0);
            A[w] |= d << 8 * (b + c * (E % 4)), S += 2;
          }
          return { value: A, binLen: 8 * S + f };
        }(n, e, i, s, t);
      };
    case "B64":
      return function(n, i, s) {
        return function(o, a, u, f) {
          let c, d, p, y, v, w, E, b = 0;
          const k = a || [0], S = (u = u || 0) >>> 3, A = f === -1 ? 3 : 0, O = o.indexOf("=");
          if (o.search(/^[a-zA-Z0-9=+/]+$/) === -1) throw new Error("Invalid character in base-64 string");
          if (o = o.replace(/=/g, ""), O !== -1 && O < o.length) throw new Error("Invalid '=' found in base-64 string");
          for (d = 0; d < o.length; d += 4) {
            for (v = o.substr(d, 4), y = 0, p = 0; p < v.length; p += 1) c = Ia.indexOf(v.charAt(p)), y |= c << 18 - 6 * p;
            for (p = 0; p < v.length - 1; p += 1) {
              for (E = b + S, w = E >>> 2; k.length <= w; ) k.push(0);
              k[w] |= (y >>> 16 - 8 * p & 255) << 8 * (A + f * (E % 4)), b += 1;
            }
          }
          return { value: k, binLen: 8 * b + u };
        }(n, i, s, t);
      };
    case "BYTES":
      return function(n, i, s) {
        return function(o, a, u, f) {
          let c, d, p, y;
          const v = a || [0], w = (u = u || 0) >>> 3, E = f === -1 ? 3 : 0;
          for (d = 0; d < o.length; d += 1) c = o.charCodeAt(d), y = d + w, p = y >>> 2, v.length <= p && v.push(0), v[p] |= c << 8 * (E + f * (y % 4));
          return { value: v, binLen: 8 * o.length + u };
        }(n, i, s, t);
      };
    case "ARRAYBUFFER":
      try {
        new ArrayBuffer(0);
      } catch (n) {
        throw new Error(Aa);
      }
      return function(n, i, s) {
        return function(o, a, u, f) {
          return Us(new Uint8Array(o), a, u, f);
        }(n, i, s, t);
      };
    case "UINT8ARRAY":
      try {
        new Uint8Array(0);
      } catch (n) {
        throw new Error(Oa);
      }
      return function(n, i, s) {
        return Us(n, i, s, t);
      };
    default:
      throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
  }
}
function qs(r, e, t, n) {
  switch (r) {
    case "HEX":
      return function(i) {
        return function(s, o, a, u) {
          const f = "0123456789abcdef";
          let c, d, p = "";
          const y = o / 8, v = a === -1 ? 3 : 0;
          for (c = 0; c < y; c += 1) d = s[c >>> 2] >>> 8 * (v + a * (c % 4)), p += f.charAt(d >>> 4 & 15) + f.charAt(15 & d);
          return u.outputUpper ? p.toUpperCase() : p;
        }(i, e, t, n);
      };
    case "B64":
      return function(i) {
        return function(s, o, a, u) {
          let f, c, d, p, y, v = "";
          const w = o / 8, E = a === -1 ? 3 : 0;
          for (f = 0; f < w; f += 3) for (p = f + 1 < w ? s[f + 1 >>> 2] : 0, y = f + 2 < w ? s[f + 2 >>> 2] : 0, d = (s[f >>> 2] >>> 8 * (E + a * (f % 4)) & 255) << 16 | (p >>> 8 * (E + a * ((f + 1) % 4)) & 255) << 8 | y >>> 8 * (E + a * ((f + 2) % 4)) & 255, c = 0; c < 4; c += 1) v += 8 * f + 6 * c <= o ? Ia.charAt(d >>> 6 * (3 - c) & 63) : u.b64Pad;
          return v;
        }(i, e, t, n);
      };
    case "BYTES":
      return function(i) {
        return function(s, o, a) {
          let u, f, c = "";
          const d = o / 8, p = a === -1 ? 3 : 0;
          for (u = 0; u < d; u += 1) f = s[u >>> 2] >>> 8 * (p + a * (u % 4)) & 255, c += String.fromCharCode(f);
          return c;
        }(i, e, t);
      };
    case "ARRAYBUFFER":
      try {
        new ArrayBuffer(0);
      } catch (i) {
        throw new Error(Aa);
      }
      return function(i) {
        return function(s, o, a) {
          let u;
          const f = o / 8, c = new ArrayBuffer(f), d = new Uint8Array(c), p = a === -1 ? 3 : 0;
          for (u = 0; u < f; u += 1) d[u] = s[u >>> 2] >>> 8 * (p + a * (u % 4)) & 255;
          return c;
        }(i, e, t);
      };
    case "UINT8ARRAY":
      try {
        new Uint8Array(0);
      } catch (i) {
        throw new Error(Oa);
      }
      return function(i) {
        return function(s, o, a) {
          let u;
          const f = o / 8, c = a === -1 ? 3 : 0, d = new Uint8Array(f);
          for (u = 0; u < f; u += 1) d[u] = s[u >>> 2] >>> 8 * (c + a * (u % 4)) & 255;
          return d;
        }(i, e, t);
      };
    default:
      throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
  }
}
const Zr = 4294967296, M = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], at = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], ut = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], en = "Chosen SHA variant is not supported", Ca = "Cannot set numRounds with MAC";
function An(r, e) {
  let t, n;
  const i = r.binLen >>> 3, s = e.binLen >>> 3, o = i << 3, a = 4 - i << 3;
  if (i % 4 != 0) {
    for (t = 0; t < s; t += 4) n = i + t >>> 2, r.value[n] |= e.value[t >>> 2] << o, r.value.push(0), r.value[n + 1] |= e.value[t >>> 2] >>> a;
    return (r.value.length << 2) - 4 >= s + i && r.value.pop(), { value: r.value, binLen: r.binLen + e.binLen };
  }
  return { value: r.value.concat(e.value), binLen: r.binLen + e.binLen };
}
function js(r) {
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
function kt(r, e, t, n) {
  const i = r + " must include a value and format";
  if (!e) {
    if (!n) throw new Error(i);
    return n;
  }
  if (e.value === void 0 || !e.format) throw new Error(i);
  return hr(e.format, e.encoding || "UTF8", t)(e.value);
}
let $n = class {
  constructor(e, t, n) {
    const i = n || {};
    if (this.t = t, this.i = i.encoding || "UTF8", this.numRounds = i.numRounds || 1, isNaN(this.numRounds) || this.numRounds !== parseInt(this.numRounds, 10) || 1 > this.numRounds) throw new Error("numRounds must a integer >= 1");
    this.o = e, this.h = [], this.u = 0, this.l = !1, this.A = 0, this.H = !1, this.S = [], this.p = [];
  }
  update(e) {
    let t, n = 0;
    const i = this.m >>> 5, s = this.C(e, this.h, this.u), o = s.binLen, a = s.value, u = o >>> 5;
    for (t = 0; t < u; t += i) n + this.m <= o && (this.U = this.v(a.slice(t, t + i), this.U), n += this.m);
    return this.A += n, this.h = a.slice(n >>> 5), this.u = o % this.m, this.l = !0, this;
  }
  getHash(e, t) {
    let n, i, s = this.R;
    const o = js(t);
    if (this.K) {
      if (o.outputLen === -1) throw new Error("Output length must be specified in options");
      s = o.outputLen;
    }
    const a = qs(e, s, this.T, o);
    if (this.H && this.g) return a(this.g(o));
    for (i = this.F(this.h.slice(), this.u, this.A, this.L(this.U), s), n = 1; n < this.numRounds; n += 1) this.K && s % 32 != 0 && (i[i.length - 1] &= 16777215 >>> 24 - s % 32), i = this.F(i, s, 0, this.B(this.o), s);
    return a(i);
  }
  setHMACKey(e, t, n) {
    if (!this.M) throw new Error("Variant does not support HMAC");
    if (this.l) throw new Error("Cannot set MAC key after calling update");
    const i = hr(t, (n || {}).encoding || "UTF8", this.T);
    this.k(i(e));
  }
  k(e) {
    const t = this.m >>> 3, n = t / 4 - 1;
    let i;
    if (this.numRounds !== 1) throw new Error(Ca);
    if (this.H) throw new Error("MAC key already set");
    for (t < e.binLen / 8 && (e.value = this.F(e.value, e.binLen, 0, this.B(this.o), this.R)); e.value.length <= n; ) e.value.push(0);
    for (i = 0; i <= n; i += 1) this.S[i] = 909522486 ^ e.value[i], this.p[i] = 1549556828 ^ e.value[i];
    this.U = this.v(this.S, this.U), this.A = this.m, this.H = !0;
  }
  getHMAC(e, t) {
    const n = js(t);
    return qs(e, this.R, this.T, n)(this.Y());
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
function Ra(r, e) {
  return r >>> e;
}
function Qs(r, e, t) {
  return r ^ e ^ t;
}
function Na(r, e, t) {
  return r & e ^ ~r & t;
}
function Da(r, e, t) {
  return r & e ^ r & t ^ e & t;
}
function $c(r) {
  return et(r, 2) ^ et(r, 13) ^ et(r, 22);
}
function Ce(r, e) {
  const t = (65535 & r) + (65535 & e);
  return (65535 & (r >>> 16) + (e >>> 16) + (t >>> 16)) << 16 | 65535 & t;
}
function Pc(r, e, t, n) {
  const i = (65535 & r) + (65535 & e) + (65535 & t) + (65535 & n);
  return (65535 & (r >>> 16) + (e >>> 16) + (t >>> 16) + (n >>> 16) + (i >>> 16)) << 16 | 65535 & i;
}
function Dr(r, e, t, n, i) {
  const s = (65535 & r) + (65535 & e) + (65535 & t) + (65535 & n) + (65535 & i);
  return (65535 & (r >>> 16) + (e >>> 16) + (t >>> 16) + (n >>> 16) + (i >>> 16) + (s >>> 16)) << 16 | 65535 & s;
}
function Lc(r) {
  return et(r, 7) ^ et(r, 18) ^ Ra(r, 3);
}
function Uc(r) {
  return et(r, 6) ^ et(r, 11) ^ et(r, 25);
}
function qc(r) {
  return [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
}
function Fa(r, e) {
  let t, n, i, s, o, a, u;
  const f = [];
  for (t = e[0], n = e[1], i = e[2], s = e[3], o = e[4], u = 0; u < 80; u += 1) f[u] = u < 16 ? r[u] : Kt(f[u - 3] ^ f[u - 8] ^ f[u - 14] ^ f[u - 16], 1), a = u < 20 ? Dr(Kt(t, 5), Na(n, i, s), o, 1518500249, f[u]) : u < 40 ? Dr(Kt(t, 5), Qs(n, i, s), o, 1859775393, f[u]) : u < 60 ? Dr(Kt(t, 5), Da(n, i, s), o, 2400959708, f[u]) : Dr(Kt(t, 5), Qs(n, i, s), o, 3395469782, f[u]), o = s, s = i, i = Kt(n, 30), n = t, t = a;
  return e[0] = Ce(t, e[0]), e[1] = Ce(n, e[1]), e[2] = Ce(i, e[2]), e[3] = Ce(s, e[3]), e[4] = Ce(o, e[4]), e;
}
function jc(r, e, t, n) {
  let i;
  const s = 15 + (e + 65 >>> 9 << 4), o = e + t;
  for (; r.length <= s; ) r.push(0);
  for (r[e >>> 5] |= 128 << 24 - e % 32, r[s] = 4294967295 & o, r[s - 1] = o / Zr | 0, i = 0; i < r.length; i += 16) n = Fa(r.slice(i, i + 16), n);
  return n;
}
let Qc = class extends $n {
  constructor(e, t, n) {
    if (e !== "SHA-1") throw new Error(en);
    super(e, t, n);
    const i = n || {};
    this.M = !0, this.g = this.Y, this.T = -1, this.C = hr(this.t, this.i, this.T), this.v = Fa, this.L = function(s) {
      return s.slice();
    }, this.B = qc, this.F = jc, this.U = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.m = 512, this.R = 160, this.K = !1, i.hmacKey && this.k(kt("hmacKey", i.hmacKey, this.T));
  }
};
function Vs(r) {
  let e;
  return e = r == "SHA-224" ? at.slice() : ut.slice(), e;
}
function Hs(r, e) {
  let t, n, i, s, o, a, u, f, c, d, p;
  const y = [];
  for (t = e[0], n = e[1], i = e[2], s = e[3], o = e[4], a = e[5], u = e[6], f = e[7], p = 0; p < 64; p += 1) y[p] = p < 16 ? r[p] : Pc(et(v = y[p - 2], 17) ^ et(v, 19) ^ Ra(v, 10), y[p - 7], Lc(y[p - 15]), y[p - 16]), c = Dr(f, Uc(o), Na(o, a, u), M[p], y[p]), d = Ce($c(t), Da(t, n, i)), f = u, u = a, a = o, o = Ce(s, c), s = i, i = n, n = t, t = Ce(c, d);
  var v;
  return e[0] = Ce(t, e[0]), e[1] = Ce(n, e[1]), e[2] = Ce(i, e[2]), e[3] = Ce(s, e[3]), e[4] = Ce(o, e[4]), e[5] = Ce(a, e[5]), e[6] = Ce(u, e[6]), e[7] = Ce(f, e[7]), e;
}
let Vc = class extends $n {
  constructor(e, t, n) {
    if (e !== "SHA-224" && e !== "SHA-256") throw new Error(en);
    super(e, t, n);
    const i = n || {};
    this.g = this.Y, this.M = !0, this.T = -1, this.C = hr(this.t, this.i, this.T), this.v = Hs, this.L = function(s) {
      return s.slice();
    }, this.B = Vs, this.F = function(s, o, a, u) {
      return function(f, c, d, p, y) {
        let v, w;
        const E = 15 + (c + 65 >>> 9 << 4), b = c + d;
        for (; f.length <= E; ) f.push(0);
        for (f[c >>> 5] |= 128 << 24 - c % 32, f[E] = 4294967295 & b, f[E - 1] = b / Zr | 0, v = 0; v < f.length; v += 16) p = Hs(f.slice(v, v + 16), p);
        return w = y === "SHA-224" ? [p[0], p[1], p[2], p[3], p[4], p[5], p[6]] : p, w;
      }(s, o, a, u, e);
    }, this.U = Vs(e), this.m = 512, this.R = e === "SHA-224" ? 224 : 256, this.K = !1, i.hmacKey && this.k(kt("hmacKey", i.hmacKey, this.T));
  }
};
class T {
  constructor(e, t) {
    this.N = e, this.I = t;
  }
}
function Ws(r, e) {
  let t;
  return e > 32 ? (t = 64 - e, new T(r.I << e | r.N >>> t, r.N << e | r.I >>> t)) : e !== 0 ? (t = 32 - e, new T(r.N << e | r.I >>> t, r.I << e | r.N >>> t)) : r;
}
function tt(r, e) {
  let t;
  return e < 32 ? (t = 32 - e, new T(r.N >>> e | r.I << t, r.I >>> e | r.N << t)) : (t = 64 - e, new T(r.I >>> e | r.N << t, r.N >>> e | r.I << t));
}
function Ma(r, e) {
  return new T(r.N >>> e, r.I >>> e | r.N << 32 - e);
}
function Hc(r, e, t) {
  return new T(r.N & e.N ^ r.N & t.N ^ e.N & t.N, r.I & e.I ^ r.I & t.I ^ e.I & t.I);
}
function Wc(r) {
  const e = tt(r, 28), t = tt(r, 34), n = tt(r, 39);
  return new T(e.N ^ t.N ^ n.N, e.I ^ t.I ^ n.I);
}
function ze(r, e) {
  let t, n;
  t = (65535 & r.I) + (65535 & e.I), n = (r.I >>> 16) + (e.I >>> 16) + (t >>> 16);
  const i = (65535 & n) << 16 | 65535 & t;
  return t = (65535 & r.N) + (65535 & e.N) + (n >>> 16), n = (r.N >>> 16) + (e.N >>> 16) + (t >>> 16), new T((65535 & n) << 16 | 65535 & t, i);
}
function zc(r, e, t, n) {
  let i, s;
  i = (65535 & r.I) + (65535 & e.I) + (65535 & t.I) + (65535 & n.I), s = (r.I >>> 16) + (e.I >>> 16) + (t.I >>> 16) + (n.I >>> 16) + (i >>> 16);
  const o = (65535 & s) << 16 | 65535 & i;
  return i = (65535 & r.N) + (65535 & e.N) + (65535 & t.N) + (65535 & n.N) + (s >>> 16), s = (r.N >>> 16) + (e.N >>> 16) + (t.N >>> 16) + (n.N >>> 16) + (i >>> 16), new T((65535 & s) << 16 | 65535 & i, o);
}
function Kc(r, e, t, n, i) {
  let s, o;
  s = (65535 & r.I) + (65535 & e.I) + (65535 & t.I) + (65535 & n.I) + (65535 & i.I), o = (r.I >>> 16) + (e.I >>> 16) + (t.I >>> 16) + (n.I >>> 16) + (i.I >>> 16) + (s >>> 16);
  const a = (65535 & o) << 16 | 65535 & s;
  return s = (65535 & r.N) + (65535 & e.N) + (65535 & t.N) + (65535 & n.N) + (65535 & i.N) + (o >>> 16), o = (r.N >>> 16) + (e.N >>> 16) + (t.N >>> 16) + (n.N >>> 16) + (i.N >>> 16) + (s >>> 16), new T((65535 & o) << 16 | 65535 & s, a);
}
function br(r, e) {
  return new T(r.N ^ e.N, r.I ^ e.I);
}
function Gc(r) {
  const e = tt(r, 19), t = tt(r, 61), n = Ma(r, 6);
  return new T(e.N ^ t.N ^ n.N, e.I ^ t.I ^ n.I);
}
function Jc(r) {
  const e = tt(r, 1), t = tt(r, 8), n = Ma(r, 7);
  return new T(e.N ^ t.N ^ n.N, e.I ^ t.I ^ n.I);
}
function Yc(r) {
  const e = tt(r, 14), t = tt(r, 18), n = tt(r, 41);
  return new T(e.N ^ t.N ^ n.N, e.I ^ t.I ^ n.I);
}
const Xc = [new T(M[0], 3609767458), new T(M[1], 602891725), new T(M[2], 3964484399), new T(M[3], 2173295548), new T(M[4], 4081628472), new T(M[5], 3053834265), new T(M[6], 2937671579), new T(M[7], 3664609560), new T(M[8], 2734883394), new T(M[9], 1164996542), new T(M[10], 1323610764), new T(M[11], 3590304994), new T(M[12], 4068182383), new T(M[13], 991336113), new T(M[14], 633803317), new T(M[15], 3479774868), new T(M[16], 2666613458), new T(M[17], 944711139), new T(M[18], 2341262773), new T(M[19], 2007800933), new T(M[20], 1495990901), new T(M[21], 1856431235), new T(M[22], 3175218132), new T(M[23], 2198950837), new T(M[24], 3999719339), new T(M[25], 766784016), new T(M[26], 2566594879), new T(M[27], 3203337956), new T(M[28], 1034457026), new T(M[29], 2466948901), new T(M[30], 3758326383), new T(M[31], 168717936), new T(M[32], 1188179964), new T(M[33], 1546045734), new T(M[34], 1522805485), new T(M[35], 2643833823), new T(M[36], 2343527390), new T(M[37], 1014477480), new T(M[38], 1206759142), new T(M[39], 344077627), new T(M[40], 1290863460), new T(M[41], 3158454273), new T(M[42], 3505952657), new T(M[43], 106217008), new T(M[44], 3606008344), new T(M[45], 1432725776), new T(M[46], 1467031594), new T(M[47], 851169720), new T(M[48], 3100823752), new T(M[49], 1363258195), new T(M[50], 3750685593), new T(M[51], 3785050280), new T(M[52], 3318307427), new T(M[53], 3812723403), new T(M[54], 2003034995), new T(M[55], 3602036899), new T(M[56], 1575990012), new T(M[57], 1125592928), new T(M[58], 2716904306), new T(M[59], 442776044), new T(M[60], 593698344), new T(M[61], 3733110249), new T(M[62], 2999351573), new T(M[63], 3815920427), new T(3391569614, 3928383900), new T(3515267271, 566280711), new T(3940187606, 3454069534), new T(4118630271, 4000239992), new T(116418474, 1914138554), new T(174292421, 2731055270), new T(289380356, 3203993006), new T(460393269, 320620315), new T(685471733, 587496836), new T(852142971, 1086792851), new T(1017036298, 365543100), new T(1126000580, 2618297676), new T(1288033470, 3409855158), new T(1501505948, 4234509866), new T(1607167915, 987167468), new T(1816402316, 1246189591)];
function zs(r) {
  return r === "SHA-384" ? [new T(3418070365, at[0]), new T(1654270250, at[1]), new T(2438529370, at[2]), new T(355462360, at[3]), new T(1731405415, at[4]), new T(41048885895, at[5]), new T(3675008525, at[6]), new T(1203062813, at[7])] : [new T(ut[0], 4089235720), new T(ut[1], 2227873595), new T(ut[2], 4271175723), new T(ut[3], 1595750129), new T(ut[4], 2917565137), new T(ut[5], 725511199), new T(ut[6], 4215389547), new T(ut[7], 327033209)];
}
function Ks(r, e) {
  let t, n, i, s, o, a, u, f, c, d, p, y;
  const v = [];
  for (t = e[0], n = e[1], i = e[2], s = e[3], o = e[4], a = e[5], u = e[6], f = e[7], p = 0; p < 80; p += 1) p < 16 ? (y = 2 * p, v[p] = new T(r[y], r[y + 1])) : v[p] = zc(Gc(v[p - 2]), v[p - 7], Jc(v[p - 15]), v[p - 16]), c = Kc(f, Yc(o), (E = a, b = u, new T((w = o).N & E.N ^ ~w.N & b.N, w.I & E.I ^ ~w.I & b.I)), Xc[p], v[p]), d = ze(Wc(t), Hc(t, n, i)), f = u, u = a, a = o, o = ze(s, c), s = i, i = n, n = t, t = ze(c, d);
  var w, E, b;
  return e[0] = ze(t, e[0]), e[1] = ze(n, e[1]), e[2] = ze(i, e[2]), e[3] = ze(s, e[3]), e[4] = ze(o, e[4]), e[5] = ze(a, e[5]), e[6] = ze(u, e[6]), e[7] = ze(f, e[7]), e;
}
let Zc = class extends $n {
  constructor(e, t, n) {
    if (e !== "SHA-384" && e !== "SHA-512") throw new Error(en);
    super(e, t, n);
    const i = n || {};
    this.g = this.Y, this.M = !0, this.T = -1, this.C = hr(this.t, this.i, this.T), this.v = Ks, this.L = function(s) {
      return s.slice();
    }, this.B = zs, this.F = function(s, o, a, u) {
      return function(f, c, d, p, y) {
        let v, w;
        const E = 31 + (c + 129 >>> 10 << 5), b = c + d;
        for (; f.length <= E; ) f.push(0);
        for (f[c >>> 5] |= 128 << 24 - c % 32, f[E] = 4294967295 & b, f[E - 1] = b / Zr | 0, v = 0; v < f.length; v += 32) p = Ks(f.slice(v, v + 32), p);
        return w = y === "SHA-384" ? [p[0].N, p[0].I, p[1].N, p[1].I, p[2].N, p[2].I, p[3].N, p[3].I, p[4].N, p[4].I, p[5].N, p[5].I] : [p[0].N, p[0].I, p[1].N, p[1].I, p[2].N, p[2].I, p[3].N, p[3].I, p[4].N, p[4].I, p[5].N, p[5].I, p[6].N, p[6].I, p[7].N, p[7].I], w;
      }(s, o, a, u, e);
    }, this.U = zs(e), this.m = 1024, this.R = e === "SHA-384" ? 384 : 512, this.K = !1, i.hmacKey && this.k(kt("hmacKey", i.hmacKey, this.T));
  }
};
const el = [new T(0, 1), new T(0, 32898), new T(2147483648, 32906), new T(2147483648, 2147516416), new T(0, 32907), new T(0, 2147483649), new T(2147483648, 2147516545), new T(2147483648, 32777), new T(0, 138), new T(0, 136), new T(0, 2147516425), new T(0, 2147483658), new T(0, 2147516555), new T(2147483648, 139), new T(2147483648, 32905), new T(2147483648, 32771), new T(2147483648, 32770), new T(2147483648, 128), new T(0, 32778), new T(2147483648, 2147483658), new T(2147483648, 2147516545), new T(2147483648, 32896), new T(0, 2147483649), new T(2147483648, 2147516424)], tl = [[0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61], [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]];
function Oi(r) {
  let e;
  const t = [];
  for (e = 0; e < 5; e += 1) t[e] = [new T(0, 0), new T(0, 0), new T(0, 0), new T(0, 0), new T(0, 0)];
  return t;
}
function rl(r) {
  let e;
  const t = [];
  for (e = 0; e < 5; e += 1) t[e] = r[e].slice();
  return t;
}
function cn(r, e) {
  let t, n, i, s;
  const o = [], a = [];
  if (r !== null) for (n = 0; n < r.length; n += 2) e[(n >>> 1) % 5][(n >>> 1) / 5 | 0] = br(e[(n >>> 1) % 5][(n >>> 1) / 5 | 0], new T(r[n + 1], r[n]));
  for (t = 0; t < 24; t += 1) {
    for (s = Oi(), n = 0; n < 5; n += 1) o[n] = (u = e[n][0], f = e[n][1], c = e[n][2], d = e[n][3], p = e[n][4], new T(u.N ^ f.N ^ c.N ^ d.N ^ p.N, u.I ^ f.I ^ c.I ^ d.I ^ p.I));
    for (n = 0; n < 5; n += 1) a[n] = br(o[(n + 4) % 5], Ws(o[(n + 1) % 5], 1));
    for (n = 0; n < 5; n += 1) for (i = 0; i < 5; i += 1) e[n][i] = br(e[n][i], a[n]);
    for (n = 0; n < 5; n += 1) for (i = 0; i < 5; i += 1) s[i][(2 * n + 3 * i) % 5] = Ws(e[n][i], tl[n][i]);
    for (n = 0; n < 5; n += 1) for (i = 0; i < 5; i += 1) e[n][i] = br(s[n][i], new T(~s[(n + 1) % 5][i].N & s[(n + 2) % 5][i].N, ~s[(n + 1) % 5][i].I & s[(n + 2) % 5][i].I));
    e[0][0] = br(e[0][0], el[t]);
  }
  var u, f, c, d, p;
  return e;
}
function Ba(r) {
  let e, t, n = 0;
  const i = [0, 0], s = [4294967295 & r, r / Zr & 2097151];
  for (e = 6; e >= 0; e--) t = s[e >> 2] >>> 8 * e & 255, t === 0 && n === 0 || (i[n + 1 >> 2] |= t << 8 * (n + 1), n += 1);
  return n = n !== 0 ? n : 1, i[0] |= n, { value: n + 1 > 4 ? i : [i[0]], binLen: 8 + 8 * n };
}
function ni(r) {
  return An(Ba(r.binLen), r);
}
function Gs(r, e) {
  let t, n = Ba(e);
  n = An(n, r);
  const i = e >>> 2, s = (i - n.value.length % i) % i;
  for (t = 0; t < s; t++) n.value.push(0);
  return n.value;
}
let nl = class extends $n {
  constructor(r, e, t) {
    let n = 6, i = 0;
    super(r, e, t);
    const s = t || {};
    if (this.numRounds !== 1) {
      if (s.kmacKey || s.hmacKey) throw new Error(Ca);
      if (this.o === "CSHAKE128" || this.o === "CSHAKE256") throw new Error("Cannot set numRounds for CSHAKE variants");
    }
    switch (this.T = 1, this.C = hr(this.t, this.i, this.T), this.v = cn, this.L = rl, this.B = Oi, this.U = Oi(), this.K = !1, r) {
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
        throw new Error(en);
    }
    this.F = function(o, a, u, f, c) {
      return function(d, p, y, v, w, E, b) {
        let k, S, A = 0;
        const O = [], R = w >>> 5, D = p >>> 5;
        for (k = 0; k < D && p >= w; k += R) v = cn(d.slice(k, k + R), v), p -= w;
        for (d = d.slice(k), p %= w; d.length < R; ) d.push(0);
        for (k = p >>> 3, d[k >> 2] ^= E << k % 4 * 8, d[R - 1] ^= 2147483648, v = cn(d, v); 32 * O.length < b && (S = v[A % 5][A / 5 | 0], O.push(S.I), !(32 * O.length >= b)); ) O.push(S.N), A += 1, 64 * A % w == 0 && (cn(null, v), A = 0);
        return O;
      }(o, a, 0, f, i, n, c);
    }, s.hmacKey && this.k(kt("hmacKey", s.hmacKey, this.T));
  }
  O(r, e) {
    const t = function(i) {
      const s = i || {};
      return { funcName: kt("funcName", s.funcName, 1, { value: [], binLen: 0 }), customization: kt("Customization", s.customization, 1, { value: [], binLen: 0 }) };
    }(r || {});
    e && (t.funcName = e);
    const n = An(ni(t.funcName), ni(t.customization));
    if (t.customization.binLen !== 0 || t.funcName.binLen !== 0) {
      const i = Gs(n, this.m >>> 3);
      for (let s = 0; s < i.length; s += this.m >>> 5) this.U = this.v(i.slice(s, s + (this.m >>> 5)), this.U), this.A += this.m;
      return 4;
    }
    return 31;
  }
  X(r) {
    const e = function(n) {
      const i = n || {};
      return { kmacKey: kt("kmacKey", i.kmacKey, 1), funcName: { value: [1128353099], binLen: 32 }, customization: kt("Customization", i.customization, 1, { value: [], binLen: 0 }) };
    }(r || {});
    this.O(r, e.funcName);
    const t = Gs(ni(e.kmacKey), this.m >>> 3);
    for (let n = 0; n < t.length; n += this.m >>> 5) this.U = this.v(t.slice(n, n + (this.m >>> 5)), this.U), this.A += this.m;
    this.H = !0;
  }
  _(r) {
    const e = An({ value: this.h.slice(), binLen: this.u }, function(t) {
      let n, i, s = 0;
      const o = [0, 0], a = [4294967295 & t, t / Zr & 2097151];
      for (n = 6; n >= 0; n--) i = a[n >> 2] >>> 8 * n & 255, i === 0 && s === 0 || (o[s >> 2] |= i << 8 * s, s += 1);
      return s = s !== 0 ? s : 1, o[s >> 2] |= s << 8 * s, { value: s + 1 > 4 ? o : [o[0]], binLen: 8 + 8 * s };
    }(r.outputLen));
    return this.F(e.value, e.binLen, this.A, this.L(this.U), r.outputLen);
  }
};
class Qe {
  constructor(e, t, n) {
    if (e == "SHA-1") this.P = new Qc(e, t, n);
    else if (e == "SHA-224" || e == "SHA-256") this.P = new Vc(e, t, n);
    else if (e == "SHA-384" || e == "SHA-512") this.P = new Zc(e, t, n);
    else {
      if (e != "SHA3-224" && e != "SHA3-256" && e != "SHA3-384" && e != "SHA3-512" && e != "SHAKE128" && e != "SHAKE256" && e != "CSHAKE128" && e != "CSHAKE256" && e != "KMAC128" && e != "KMAC256") throw new Error(en);
      this.P = new nl(e, t, n);
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
var $a = {}, Pn = {};
Pn.byteLength = ol;
Pn.toByteArray = ul;
Pn.fromByteArray = fl;
var Ze = [], je = [], il = typeof Uint8Array != "undefined" ? Uint8Array : Array, ii = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Gt = 0, sl = ii.length; Gt < sl; ++Gt)
  Ze[Gt] = ii[Gt], je[ii.charCodeAt(Gt)] = Gt;
je[45] = 62;
je[95] = 63;
function Pa(r) {
  var e = r.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var t = r.indexOf("=");
  t === -1 && (t = e);
  var n = t === e ? 0 : 4 - t % 4;
  return [t, n];
}
function ol(r) {
  var e = Pa(r), t = e[0], n = e[1];
  return (t + n) * 3 / 4 - n;
}
function al(r, e, t) {
  return (e + t) * 3 / 4 - t;
}
function ul(r) {
  var e, t = Pa(r), n = t[0], i = t[1], s = new il(al(r, n, i)), o = 0, a = i > 0 ? n - 4 : n, u;
  for (u = 0; u < a; u += 4)
    e = je[r.charCodeAt(u)] << 18 | je[r.charCodeAt(u + 1)] << 12 | je[r.charCodeAt(u + 2)] << 6 | je[r.charCodeAt(u + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
  return i === 2 && (e = je[r.charCodeAt(u)] << 2 | je[r.charCodeAt(u + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = je[r.charCodeAt(u)] << 10 | je[r.charCodeAt(u + 1)] << 4 | je[r.charCodeAt(u + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
}
function cl(r) {
  return Ze[r >> 18 & 63] + Ze[r >> 12 & 63] + Ze[r >> 6 & 63] + Ze[r & 63];
}
function ll(r, e, t) {
  for (var n, i = [], s = e; s < t; s += 3)
    n = (r[s] << 16 & 16711680) + (r[s + 1] << 8 & 65280) + (r[s + 2] & 255), i.push(cl(n));
  return i.join("");
}
function fl(r) {
  for (var e, t = r.length, n = t % 3, i = [], s = 16383, o = 0, a = t - n; o < a; o += s)
    i.push(ll(r, o, o + s > a ? a : o + s));
  return n === 1 ? (e = r[t - 1], i.push(
    Ze[e >> 2] + Ze[e << 4 & 63] + "=="
  )) : n === 2 && (e = (r[t - 2] << 8) + r[t - 1], i.push(
    Ze[e >> 10] + Ze[e >> 4 & 63] + Ze[e << 2 & 63] + "="
  )), i.join("");
}
var ss = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
ss.read = function(r, e, t, n, i) {
  var s, o, a = i * 8 - n - 1, u = (1 << a) - 1, f = u >> 1, c = -7, d = t ? i - 1 : 0, p = t ? -1 : 1, y = r[e + d];
  for (d += p, s = y & (1 << -c) - 1, y >>= -c, c += a; c > 0; s = s * 256 + r[e + d], d += p, c -= 8)
    ;
  for (o = s & (1 << -c) - 1, s >>= -c, c += n; c > 0; o = o * 256 + r[e + d], d += p, c -= 8)
    ;
  if (s === 0)
    s = 1 - f;
  else {
    if (s === u)
      return o ? NaN : (y ? -1 : 1) * (1 / 0);
    o = o + Math.pow(2, n), s = s - f;
  }
  return (y ? -1 : 1) * o * Math.pow(2, s - n);
};
ss.write = function(r, e, t, n, i, s) {
  var o, a, u, f = s * 8 - i - 1, c = (1 << f) - 1, d = c >> 1, p = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, y = n ? 0 : s - 1, v = n ? 1 : -1, w = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
  for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (a = isNaN(e) ? 1 : 0, o = c) : (o = Math.floor(Math.log(e) / Math.LN2), e * (u = Math.pow(2, -o)) < 1 && (o--, u *= 2), o + d >= 1 ? e += p / u : e += p * Math.pow(2, 1 - d), e * u >= 2 && (o++, u /= 2), o + d >= c ? (a = 0, o = c) : o + d >= 1 ? (a = (e * u - 1) * Math.pow(2, i), o = o + d) : (a = e * Math.pow(2, d - 1) * Math.pow(2, i), o = 0)); i >= 8; r[t + y] = a & 255, y += v, a /= 256, i -= 8)
    ;
  for (o = o << i | a, f += i; f > 0; r[t + y] = o & 255, y += v, o /= 256, f -= 8)
    ;
  r[t + y - v] |= w * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(r) {
  const e = Pn, t = ss, n = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  r.Buffer = c, r.SlowBuffer = O, r.INSPECT_MAX_BYTES = 50;
  const i = 2147483647;
  r.kMaxLength = i;
  const { Uint8Array: s, ArrayBuffer: o, SharedArrayBuffer: a } = globalThis;
  c.TYPED_ARRAY_SUPPORT = u(), !c.TYPED_ARRAY_SUPPORT && typeof console != "undefined" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function u() {
    try {
      const m = new s(1), l = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(l, s.prototype), Object.setPrototypeOf(m, l), m.foo() === 42;
    } catch (m) {
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
  function f(m) {
    if (m > i)
      throw new RangeError('The value "' + m + '" is invalid for option "size"');
    const l = new s(m);
    return Object.setPrototypeOf(l, c.prototype), l;
  }
  function c(m, l, h) {
    if (typeof m == "number") {
      if (typeof l == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return v(m);
    }
    return d(m, l, h);
  }
  c.poolSize = 8192;
  function d(m, l, h) {
    if (typeof m == "string")
      return w(m, l);
    if (o.isView(m))
      return b(m);
    if (m == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof m
      );
    if (Xe(m, o) || m && Xe(m.buffer, o) || typeof a != "undefined" && (Xe(m, a) || m && Xe(m.buffer, a)))
      return k(m, l, h);
    if (typeof m == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const g = m.valueOf && m.valueOf();
    if (g != null && g !== m)
      return c.from(g, l, h);
    const _ = S(m);
    if (_) return _;
    if (typeof Symbol != "undefined" && Symbol.toPrimitive != null && typeof m[Symbol.toPrimitive] == "function")
      return c.from(m[Symbol.toPrimitive]("string"), l, h);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof m
    );
  }
  c.from = function(m, l, h) {
    return d(m, l, h);
  }, Object.setPrototypeOf(c.prototype, s.prototype), Object.setPrototypeOf(c, s);
  function p(m) {
    if (typeof m != "number")
      throw new TypeError('"size" argument must be of type number');
    if (m < 0)
      throw new RangeError('The value "' + m + '" is invalid for option "size"');
  }
  function y(m, l, h) {
    return p(m), m <= 0 ? f(m) : l !== void 0 ? typeof h == "string" ? f(m).fill(l, h) : f(m).fill(l) : f(m);
  }
  c.alloc = function(m, l, h) {
    return y(m, l, h);
  };
  function v(m) {
    return p(m), f(m < 0 ? 0 : A(m) | 0);
  }
  c.allocUnsafe = function(m) {
    return v(m);
  }, c.allocUnsafeSlow = function(m) {
    return v(m);
  };
  function w(m, l) {
    if ((typeof l != "string" || l === "") && (l = "utf8"), !c.isEncoding(l))
      throw new TypeError("Unknown encoding: " + l);
    const h = R(m, l) | 0;
    let g = f(h);
    const _ = g.write(m, l);
    return _ !== h && (g = g.slice(0, _)), g;
  }
  function E(m) {
    const l = m.length < 0 ? 0 : A(m.length) | 0, h = f(l);
    for (let g = 0; g < l; g += 1)
      h[g] = m[g] & 255;
    return h;
  }
  function b(m) {
    if (Xe(m, s)) {
      const l = new s(m);
      return k(l.buffer, l.byteOffset, l.byteLength);
    }
    return E(m);
  }
  function k(m, l, h) {
    if (l < 0 || m.byteLength < l)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (m.byteLength < l + (h || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let g;
    return l === void 0 && h === void 0 ? g = new s(m) : h === void 0 ? g = new s(m, l) : g = new s(m, l, h), Object.setPrototypeOf(g, c.prototype), g;
  }
  function S(m) {
    if (c.isBuffer(m)) {
      const l = A(m.length) | 0, h = f(l);
      return h.length === 0 || m.copy(h, 0, 0, l), h;
    }
    if (m.length !== void 0)
      return typeof m.length != "number" || ri(m.length) ? f(0) : E(m);
    if (m.type === "Buffer" && Array.isArray(m.data))
      return E(m.data);
  }
  function A(m) {
    if (m >= i)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i.toString(16) + " bytes");
    return m | 0;
  }
  function O(m) {
    return +m != m && (m = 0), c.alloc(+m);
  }
  c.isBuffer = function(l) {
    return l != null && l._isBuffer === !0 && l !== c.prototype;
  }, c.compare = function(l, h) {
    if (Xe(l, s) && (l = c.from(l, l.offset, l.byteLength)), Xe(h, s) && (h = c.from(h, h.offset, h.byteLength)), !c.isBuffer(l) || !c.isBuffer(h))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (l === h) return 0;
    let g = l.length, _ = h.length;
    for (let I = 0, C = Math.min(g, _); I < C; ++I)
      if (l[I] !== h[I]) {
        g = l[I], _ = h[I];
        break;
      }
    return g < _ ? -1 : _ < g ? 1 : 0;
  }, c.isEncoding = function(l) {
    switch (String(l).toLowerCase()) {
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
  }, c.concat = function(l, h) {
    if (!Array.isArray(l))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (l.length === 0)
      return c.alloc(0);
    let g;
    if (h === void 0)
      for (h = 0, g = 0; g < l.length; ++g)
        h += l[g].length;
    const _ = c.allocUnsafe(h);
    let I = 0;
    for (g = 0; g < l.length; ++g) {
      let C = l[g];
      if (Xe(C, s))
        I + C.length > _.length ? (c.isBuffer(C) || (C = c.from(C)), C.copy(_, I)) : s.prototype.set.call(
          _,
          C,
          I
        );
      else if (c.isBuffer(C))
        C.copy(_, I);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      I += C.length;
    }
    return _;
  };
  function R(m, l) {
    if (c.isBuffer(m))
      return m.length;
    if (o.isView(m) || Xe(m, o))
      return m.byteLength;
    if (typeof m != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof m
      );
    const h = m.length, g = arguments.length > 2 && arguments[2] === !0;
    if (!g && h === 0) return 0;
    let _ = !1;
    for (; ; )
      switch (l) {
        case "ascii":
        case "latin1":
        case "binary":
          return h;
        case "utf8":
        case "utf-8":
          return ti(m).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return h * 2;
        case "hex":
          return h >>> 1;
        case "base64":
          return Bs(m).length;
        default:
          if (_)
            return g ? -1 : ti(m).length;
          l = ("" + l).toLowerCase(), _ = !0;
      }
  }
  c.byteLength = R;
  function D(m, l, h) {
    let g = !1;
    if ((l === void 0 || l < 0) && (l = 0), l > this.length || ((h === void 0 || h > this.length) && (h = this.length), h <= 0) || (h >>>= 0, l >>>= 0, h <= l))
      return "";
    for (m || (m = "utf8"); ; )
      switch (m) {
        case "hex":
          return z(this, l, h);
        case "utf8":
        case "utf-8":
          return ee(this, l, h);
        case "ascii":
          return te(this, l, h);
        case "latin1":
        case "binary":
          return be(this, l, h);
        case "base64":
          return V(this, l, h);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Me(this, l, h);
        default:
          if (g) throw new TypeError("Unknown encoding: " + m);
          m = (m + "").toLowerCase(), g = !0;
      }
  }
  c.prototype._isBuffer = !0;
  function F(m, l, h) {
    const g = m[l];
    m[l] = m[h], m[h] = g;
  }
  c.prototype.swap16 = function() {
    const l = this.length;
    if (l % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let h = 0; h < l; h += 2)
      F(this, h, h + 1);
    return this;
  }, c.prototype.swap32 = function() {
    const l = this.length;
    if (l % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let h = 0; h < l; h += 4)
      F(this, h, h + 3), F(this, h + 1, h + 2);
    return this;
  }, c.prototype.swap64 = function() {
    const l = this.length;
    if (l % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let h = 0; h < l; h += 8)
      F(this, h, h + 7), F(this, h + 1, h + 6), F(this, h + 2, h + 5), F(this, h + 3, h + 4);
    return this;
  }, c.prototype.toString = function() {
    const l = this.length;
    return l === 0 ? "" : arguments.length === 0 ? ee(this, 0, l) : D.apply(this, arguments);
  }, c.prototype.toLocaleString = c.prototype.toString, c.prototype.equals = function(l) {
    if (!c.isBuffer(l)) throw new TypeError("Argument must be a Buffer");
    return this === l ? !0 : c.compare(this, l) === 0;
  }, c.prototype.inspect = function() {
    let l = "";
    const h = r.INSPECT_MAX_BYTES;
    return l = this.toString("hex", 0, h).replace(/(.{2})/g, "$1 ").trim(), this.length > h && (l += " ... "), "<Buffer " + l + ">";
  }, n && (c.prototype[n] = c.prototype.inspect), c.prototype.compare = function(l, h, g, _, I) {
    if (Xe(l, s) && (l = c.from(l, l.offset, l.byteLength)), !c.isBuffer(l))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof l
      );
    if (h === void 0 && (h = 0), g === void 0 && (g = l ? l.length : 0), _ === void 0 && (_ = 0), I === void 0 && (I = this.length), h < 0 || g > l.length || _ < 0 || I > this.length)
      throw new RangeError("out of range index");
    if (_ >= I && h >= g)
      return 0;
    if (_ >= I)
      return -1;
    if (h >= g)
      return 1;
    if (h >>>= 0, g >>>= 0, _ >>>= 0, I >>>= 0, this === l) return 0;
    let C = I - _, K = g - h;
    const he = Math.min(C, K), le = this.slice(_, I), pe = l.slice(h, g);
    for (let oe = 0; oe < he; ++oe)
      if (le[oe] !== pe[oe]) {
        C = le[oe], K = pe[oe];
        break;
      }
    return C < K ? -1 : K < C ? 1 : 0;
  };
  function P(m, l, h, g, _) {
    if (m.length === 0) return -1;
    if (typeof h == "string" ? (g = h, h = 0) : h > 2147483647 ? h = 2147483647 : h < -2147483648 && (h = -2147483648), h = +h, ri(h) && (h = _ ? 0 : m.length - 1), h < 0 && (h = m.length + h), h >= m.length) {
      if (_) return -1;
      h = m.length - 1;
    } else if (h < 0)
      if (_) h = 0;
      else return -1;
    if (typeof l == "string" && (l = c.from(l, g)), c.isBuffer(l))
      return l.length === 0 ? -1 : H(m, l, h, g, _);
    if (typeof l == "number")
      return l = l & 255, typeof s.prototype.indexOf == "function" ? _ ? s.prototype.indexOf.call(m, l, h) : s.prototype.lastIndexOf.call(m, l, h) : H(m, [l], h, g, _);
    throw new TypeError("val must be string, number or Buffer");
  }
  function H(m, l, h, g, _) {
    let I = 1, C = m.length, K = l.length;
    if (g !== void 0 && (g = String(g).toLowerCase(), g === "ucs2" || g === "ucs-2" || g === "utf16le" || g === "utf-16le")) {
      if (m.length < 2 || l.length < 2)
        return -1;
      I = 2, C /= 2, K /= 2, h /= 2;
    }
    function he(pe, oe) {
      return I === 1 ? pe[oe] : pe.readUInt16BE(oe * I);
    }
    let le;
    if (_) {
      let pe = -1;
      for (le = h; le < C; le++)
        if (he(m, le) === he(l, pe === -1 ? 0 : le - pe)) {
          if (pe === -1 && (pe = le), le - pe + 1 === K) return pe * I;
        } else
          pe !== -1 && (le -= le - pe), pe = -1;
    } else
      for (h + K > C && (h = C - K), le = h; le >= 0; le--) {
        let pe = !0;
        for (let oe = 0; oe < K; oe++)
          if (he(m, le + oe) !== he(l, oe)) {
            pe = !1;
            break;
          }
        if (pe) return le;
      }
    return -1;
  }
  c.prototype.includes = function(l, h, g) {
    return this.indexOf(l, h, g) !== -1;
  }, c.prototype.indexOf = function(l, h, g) {
    return P(this, l, h, g, !0);
  }, c.prototype.lastIndexOf = function(l, h, g) {
    return P(this, l, h, g, !1);
  };
  function J(m, l, h, g) {
    h = Number(h) || 0;
    const _ = m.length - h;
    g ? (g = Number(g), g > _ && (g = _)) : g = _;
    const I = l.length;
    g > I / 2 && (g = I / 2);
    let C;
    for (C = 0; C < g; ++C) {
      const K = parseInt(l.substr(C * 2, 2), 16);
      if (ri(K)) return C;
      m[h + C] = K;
    }
    return C;
  }
  function Oe(m, l, h, g) {
    return un(ti(l, m.length - h), m, h, g);
  }
  function ie(m, l, h, g) {
    return un(Tc(l), m, h, g);
  }
  function ke(m, l, h, g) {
    return un(Bs(l), m, h, g);
  }
  function Dt(m, l, h, g) {
    return un(Ic(l, m.length - h), m, h, g);
  }
  c.prototype.write = function(l, h, g, _) {
    if (h === void 0)
      _ = "utf8", g = this.length, h = 0;
    else if (g === void 0 && typeof h == "string")
      _ = h, g = this.length, h = 0;
    else if (isFinite(h))
      h = h >>> 0, isFinite(g) ? (g = g >>> 0, _ === void 0 && (_ = "utf8")) : (_ = g, g = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const I = this.length - h;
    if ((g === void 0 || g > I) && (g = I), l.length > 0 && (g < 0 || h < 0) || h > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    _ || (_ = "utf8");
    let C = !1;
    for (; ; )
      switch (_) {
        case "hex":
          return J(this, l, h, g);
        case "utf8":
        case "utf-8":
          return Oe(this, l, h, g);
        case "ascii":
        case "latin1":
        case "binary":
          return ie(this, l, h, g);
        case "base64":
          return ke(this, l, h, g);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Dt(this, l, h, g);
        default:
          if (C) throw new TypeError("Unknown encoding: " + _);
          _ = ("" + _).toLowerCase(), C = !0;
      }
  }, c.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function V(m, l, h) {
    return l === 0 && h === m.length ? e.fromByteArray(m) : e.fromByteArray(m.slice(l, h));
  }
  function ee(m, l, h) {
    h = Math.min(m.length, h);
    const g = [];
    let _ = l;
    for (; _ < h; ) {
      const I = m[_];
      let C = null, K = I > 239 ? 4 : I > 223 ? 3 : I > 191 ? 2 : 1;
      if (_ + K <= h) {
        let he, le, pe, oe;
        switch (K) {
          case 1:
            I < 128 && (C = I);
            break;
          case 2:
            he = m[_ + 1], (he & 192) === 128 && (oe = (I & 31) << 6 | he & 63, oe > 127 && (C = oe));
            break;
          case 3:
            he = m[_ + 1], le = m[_ + 2], (he & 192) === 128 && (le & 192) === 128 && (oe = (I & 15) << 12 | (he & 63) << 6 | le & 63, oe > 2047 && (oe < 55296 || oe > 57343) && (C = oe));
            break;
          case 4:
            he = m[_ + 1], le = m[_ + 2], pe = m[_ + 3], (he & 192) === 128 && (le & 192) === 128 && (pe & 192) === 128 && (oe = (I & 15) << 18 | (he & 63) << 12 | (le & 63) << 6 | pe & 63, oe > 65535 && oe < 1114112 && (C = oe));
        }
      }
      C === null ? (C = 65533, K = 1) : C > 65535 && (C -= 65536, g.push(C >>> 10 & 1023 | 55296), C = 56320 | C & 1023), g.push(C), _ += K;
    }
    return q(g);
  }
  const Q = 4096;
  function q(m) {
    const l = m.length;
    if (l <= Q)
      return String.fromCharCode.apply(String, m);
    let h = "", g = 0;
    for (; g < l; )
      h += String.fromCharCode.apply(
        String,
        m.slice(g, g += Q)
      );
    return h;
  }
  function te(m, l, h) {
    let g = "";
    h = Math.min(m.length, h);
    for (let _ = l; _ < h; ++_)
      g += String.fromCharCode(m[_] & 127);
    return g;
  }
  function be(m, l, h) {
    let g = "";
    h = Math.min(m.length, h);
    for (let _ = l; _ < h; ++_)
      g += String.fromCharCode(m[_]);
    return g;
  }
  function z(m, l, h) {
    const g = m.length;
    (!l || l < 0) && (l = 0), (!h || h < 0 || h > g) && (h = g);
    let _ = "";
    for (let I = l; I < h; ++I)
      _ += Ac[m[I]];
    return _;
  }
  function Me(m, l, h) {
    const g = m.slice(l, h);
    let _ = "";
    for (let I = 0; I < g.length - 1; I += 2)
      _ += String.fromCharCode(g[I] + g[I + 1] * 256);
    return _;
  }
  c.prototype.slice = function(l, h) {
    const g = this.length;
    l = ~~l, h = h === void 0 ? g : ~~h, l < 0 ? (l += g, l < 0 && (l = 0)) : l > g && (l = g), h < 0 ? (h += g, h < 0 && (h = 0)) : h > g && (h = g), h < l && (h = l);
    const _ = this.subarray(l, h);
    return Object.setPrototypeOf(_, c.prototype), _;
  };
  function se(m, l, h) {
    if (m % 1 !== 0 || m < 0) throw new RangeError("offset is not uint");
    if (m + l > h) throw new RangeError("Trying to access beyond buffer length");
  }
  c.prototype.readUintLE = c.prototype.readUIntLE = function(l, h, g) {
    l = l >>> 0, h = h >>> 0, g || se(l, h, this.length);
    let _ = this[l], I = 1, C = 0;
    for (; ++C < h && (I *= 256); )
      _ += this[l + C] * I;
    return _;
  }, c.prototype.readUintBE = c.prototype.readUIntBE = function(l, h, g) {
    l = l >>> 0, h = h >>> 0, g || se(l, h, this.length);
    let _ = this[l + --h], I = 1;
    for (; h > 0 && (I *= 256); )
      _ += this[l + --h] * I;
    return _;
  }, c.prototype.readUint8 = c.prototype.readUInt8 = function(l, h) {
    return l = l >>> 0, h || se(l, 1, this.length), this[l];
  }, c.prototype.readUint16LE = c.prototype.readUInt16LE = function(l, h) {
    return l = l >>> 0, h || se(l, 2, this.length), this[l] | this[l + 1] << 8;
  }, c.prototype.readUint16BE = c.prototype.readUInt16BE = function(l, h) {
    return l = l >>> 0, h || se(l, 2, this.length), this[l] << 8 | this[l + 1];
  }, c.prototype.readUint32LE = c.prototype.readUInt32LE = function(l, h) {
    return l = l >>> 0, h || se(l, 4, this.length), (this[l] | this[l + 1] << 8 | this[l + 2] << 16) + this[l + 3] * 16777216;
  }, c.prototype.readUint32BE = c.prototype.readUInt32BE = function(l, h) {
    return l = l >>> 0, h || se(l, 4, this.length), this[l] * 16777216 + (this[l + 1] << 16 | this[l + 2] << 8 | this[l + 3]);
  }, c.prototype.readBigUInt64LE = gt(function(l) {
    l = l >>> 0, zt(l, "offset");
    const h = this[l], g = this[l + 7];
    (h === void 0 || g === void 0) && gr(l, this.length - 8);
    const _ = h + this[++l] * Y(2, 8) + this[++l] * Y(2, 16) + this[++l] * Y(2, 24), I = this[++l] + this[++l] * Y(2, 8) + this[++l] * Y(2, 16) + g * Y(2, 24);
    return BigInt(_) + (BigInt(I) << BigInt(32));
  }), c.prototype.readBigUInt64BE = gt(function(l) {
    l = l >>> 0, zt(l, "offset");
    const h = this[l], g = this[l + 7];
    (h === void 0 || g === void 0) && gr(l, this.length - 8);
    const _ = h * Y(2, 24) + this[++l] * Y(2, 16) + this[++l] * Y(2, 8) + this[++l], I = this[++l] * Y(2, 24) + this[++l] * Y(2, 16) + this[++l] * Y(2, 8) + g;
    return (BigInt(_) << BigInt(32)) + BigInt(I);
  }), c.prototype.readIntLE = function(l, h, g) {
    l = l >>> 0, h = h >>> 0, g || se(l, h, this.length);
    let _ = this[l], I = 1, C = 0;
    for (; ++C < h && (I *= 256); )
      _ += this[l + C] * I;
    return I *= 128, _ >= I && (_ -= Math.pow(2, 8 * h)), _;
  }, c.prototype.readIntBE = function(l, h, g) {
    l = l >>> 0, h = h >>> 0, g || se(l, h, this.length);
    let _ = h, I = 1, C = this[l + --_];
    for (; _ > 0 && (I *= 256); )
      C += this[l + --_] * I;
    return I *= 128, C >= I && (C -= Math.pow(2, 8 * h)), C;
  }, c.prototype.readInt8 = function(l, h) {
    return l = l >>> 0, h || se(l, 1, this.length), this[l] & 128 ? (255 - this[l] + 1) * -1 : this[l];
  }, c.prototype.readInt16LE = function(l, h) {
    l = l >>> 0, h || se(l, 2, this.length);
    const g = this[l] | this[l + 1] << 8;
    return g & 32768 ? g | 4294901760 : g;
  }, c.prototype.readInt16BE = function(l, h) {
    l = l >>> 0, h || se(l, 2, this.length);
    const g = this[l + 1] | this[l] << 8;
    return g & 32768 ? g | 4294901760 : g;
  }, c.prototype.readInt32LE = function(l, h) {
    return l = l >>> 0, h || se(l, 4, this.length), this[l] | this[l + 1] << 8 | this[l + 2] << 16 | this[l + 3] << 24;
  }, c.prototype.readInt32BE = function(l, h) {
    return l = l >>> 0, h || se(l, 4, this.length), this[l] << 24 | this[l + 1] << 16 | this[l + 2] << 8 | this[l + 3];
  }, c.prototype.readBigInt64LE = gt(function(l) {
    l = l >>> 0, zt(l, "offset");
    const h = this[l], g = this[l + 7];
    (h === void 0 || g === void 0) && gr(l, this.length - 8);
    const _ = this[l + 4] + this[l + 5] * Y(2, 8) + this[l + 6] * Y(2, 16) + (g << 24);
    return (BigInt(_) << BigInt(32)) + BigInt(h + this[++l] * Y(2, 8) + this[++l] * Y(2, 16) + this[++l] * Y(2, 24));
  }), c.prototype.readBigInt64BE = gt(function(l) {
    l = l >>> 0, zt(l, "offset");
    const h = this[l], g = this[l + 7];
    (h === void 0 || g === void 0) && gr(l, this.length - 8);
    const _ = (h << 24) + // Overflow
    this[++l] * Y(2, 16) + this[++l] * Y(2, 8) + this[++l];
    return (BigInt(_) << BigInt(32)) + BigInt(this[++l] * Y(2, 24) + this[++l] * Y(2, 16) + this[++l] * Y(2, 8) + g);
  }), c.prototype.readFloatLE = function(l, h) {
    return l = l >>> 0, h || se(l, 4, this.length), t.read(this, l, !0, 23, 4);
  }, c.prototype.readFloatBE = function(l, h) {
    return l = l >>> 0, h || se(l, 4, this.length), t.read(this, l, !1, 23, 4);
  }, c.prototype.readDoubleLE = function(l, h) {
    return l = l >>> 0, h || se(l, 8, this.length), t.read(this, l, !0, 52, 8);
  }, c.prototype.readDoubleBE = function(l, h) {
    return l = l >>> 0, h || se(l, 8, this.length), t.read(this, l, !1, 52, 8);
  };
  function we(m, l, h, g, _, I) {
    if (!c.isBuffer(m)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (l > _ || l < I) throw new RangeError('"value" argument is out of bounds');
    if (h + g > m.length) throw new RangeError("Index out of range");
  }
  c.prototype.writeUintLE = c.prototype.writeUIntLE = function(l, h, g, _) {
    if (l = +l, h = h >>> 0, g = g >>> 0, !_) {
      const K = Math.pow(2, 8 * g) - 1;
      we(this, l, h, g, K, 0);
    }
    let I = 1, C = 0;
    for (this[h] = l & 255; ++C < g && (I *= 256); )
      this[h + C] = l / I & 255;
    return h + g;
  }, c.prototype.writeUintBE = c.prototype.writeUIntBE = function(l, h, g, _) {
    if (l = +l, h = h >>> 0, g = g >>> 0, !_) {
      const K = Math.pow(2, 8 * g) - 1;
      we(this, l, h, g, K, 0);
    }
    let I = g - 1, C = 1;
    for (this[h + I] = l & 255; --I >= 0 && (C *= 256); )
      this[h + I] = l / C & 255;
    return h + g;
  }, c.prototype.writeUint8 = c.prototype.writeUInt8 = function(l, h, g) {
    return l = +l, h = h >>> 0, g || we(this, l, h, 1, 255, 0), this[h] = l & 255, h + 1;
  }, c.prototype.writeUint16LE = c.prototype.writeUInt16LE = function(l, h, g) {
    return l = +l, h = h >>> 0, g || we(this, l, h, 2, 65535, 0), this[h] = l & 255, this[h + 1] = l >>> 8, h + 2;
  }, c.prototype.writeUint16BE = c.prototype.writeUInt16BE = function(l, h, g) {
    return l = +l, h = h >>> 0, g || we(this, l, h, 2, 65535, 0), this[h] = l >>> 8, this[h + 1] = l & 255, h + 2;
  }, c.prototype.writeUint32LE = c.prototype.writeUInt32LE = function(l, h, g) {
    return l = +l, h = h >>> 0, g || we(this, l, h, 4, 4294967295, 0), this[h + 3] = l >>> 24, this[h + 2] = l >>> 16, this[h + 1] = l >>> 8, this[h] = l & 255, h + 4;
  }, c.prototype.writeUint32BE = c.prototype.writeUInt32BE = function(l, h, g) {
    return l = +l, h = h >>> 0, g || we(this, l, h, 4, 4294967295, 0), this[h] = l >>> 24, this[h + 1] = l >>> 16, this[h + 2] = l >>> 8, this[h + 3] = l & 255, h + 4;
  };
  function ot(m, l, h, g, _) {
    Ms(l, g, _, m, h, 7);
    let I = Number(l & BigInt(4294967295));
    m[h++] = I, I = I >> 8, m[h++] = I, I = I >> 8, m[h++] = I, I = I >> 8, m[h++] = I;
    let C = Number(l >> BigInt(32) & BigInt(4294967295));
    return m[h++] = C, C = C >> 8, m[h++] = C, C = C >> 8, m[h++] = C, C = C >> 8, m[h++] = C, h;
  }
  function Ee(m, l, h, g, _) {
    Ms(l, g, _, m, h, 7);
    let I = Number(l & BigInt(4294967295));
    m[h + 7] = I, I = I >> 8, m[h + 6] = I, I = I >> 8, m[h + 5] = I, I = I >> 8, m[h + 4] = I;
    let C = Number(l >> BigInt(32) & BigInt(4294967295));
    return m[h + 3] = C, C = C >> 8, m[h + 2] = C, C = C >> 8, m[h + 1] = C, C = C >> 8, m[h] = C, h + 8;
  }
  c.prototype.writeBigUInt64LE = gt(function(l, h = 0) {
    return ot(this, l, h, BigInt(0), BigInt("0xffffffffffffffff"));
  }), c.prototype.writeBigUInt64BE = gt(function(l, h = 0) {
    return Ee(this, l, h, BigInt(0), BigInt("0xffffffffffffffff"));
  }), c.prototype.writeIntLE = function(l, h, g, _) {
    if (l = +l, h = h >>> 0, !_) {
      const he = Math.pow(2, 8 * g - 1);
      we(this, l, h, g, he - 1, -he);
    }
    let I = 0, C = 1, K = 0;
    for (this[h] = l & 255; ++I < g && (C *= 256); )
      l < 0 && K === 0 && this[h + I - 1] !== 0 && (K = 1), this[h + I] = (l / C >> 0) - K & 255;
    return h + g;
  }, c.prototype.writeIntBE = function(l, h, g, _) {
    if (l = +l, h = h >>> 0, !_) {
      const he = Math.pow(2, 8 * g - 1);
      we(this, l, h, g, he - 1, -he);
    }
    let I = g - 1, C = 1, K = 0;
    for (this[h + I] = l & 255; --I >= 0 && (C *= 256); )
      l < 0 && K === 0 && this[h + I + 1] !== 0 && (K = 1), this[h + I] = (l / C >> 0) - K & 255;
    return h + g;
  }, c.prototype.writeInt8 = function(l, h, g) {
    return l = +l, h = h >>> 0, g || we(this, l, h, 1, 127, -128), l < 0 && (l = 255 + l + 1), this[h] = l & 255, h + 1;
  }, c.prototype.writeInt16LE = function(l, h, g) {
    return l = +l, h = h >>> 0, g || we(this, l, h, 2, 32767, -32768), this[h] = l & 255, this[h + 1] = l >>> 8, h + 2;
  }, c.prototype.writeInt16BE = function(l, h, g) {
    return l = +l, h = h >>> 0, g || we(this, l, h, 2, 32767, -32768), this[h] = l >>> 8, this[h + 1] = l & 255, h + 2;
  }, c.prototype.writeInt32LE = function(l, h, g) {
    return l = +l, h = h >>> 0, g || we(this, l, h, 4, 2147483647, -2147483648), this[h] = l & 255, this[h + 1] = l >>> 8, this[h + 2] = l >>> 16, this[h + 3] = l >>> 24, h + 4;
  }, c.prototype.writeInt32BE = function(l, h, g) {
    return l = +l, h = h >>> 0, g || we(this, l, h, 4, 2147483647, -2147483648), l < 0 && (l = 4294967295 + l + 1), this[h] = l >>> 24, this[h + 1] = l >>> 16, this[h + 2] = l >>> 8, this[h + 3] = l & 255, h + 4;
  }, c.prototype.writeBigInt64LE = gt(function(l, h = 0) {
    return ot(this, l, h, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), c.prototype.writeBigInt64BE = gt(function(l, h = 0) {
    return Ee(this, l, h, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function ge(m, l, h, g, _, I) {
    if (h + g > m.length) throw new RangeError("Index out of range");
    if (h < 0) throw new RangeError("Index out of range");
  }
  function Zn(m, l, h, g, _) {
    return l = +l, h = h >>> 0, _ || ge(m, l, h, 4), t.write(m, l, h, g, 23, 4), h + 4;
  }
  c.prototype.writeFloatLE = function(l, h, g) {
    return Zn(this, l, h, !0, g);
  }, c.prototype.writeFloatBE = function(l, h, g) {
    return Zn(this, l, h, !1, g);
  };
  function an(m, l, h, g, _) {
    return l = +l, h = h >>> 0, _ || ge(m, l, h, 8), t.write(m, l, h, g, 52, 8), h + 8;
  }
  c.prototype.writeDoubleLE = function(l, h, g) {
    return an(this, l, h, !0, g);
  }, c.prototype.writeDoubleBE = function(l, h, g) {
    return an(this, l, h, !1, g);
  }, c.prototype.copy = function(l, h, g, _) {
    if (!c.isBuffer(l)) throw new TypeError("argument should be a Buffer");
    if (g || (g = 0), !_ && _ !== 0 && (_ = this.length), h >= l.length && (h = l.length), h || (h = 0), _ > 0 && _ < g && (_ = g), _ === g || l.length === 0 || this.length === 0) return 0;
    if (h < 0)
      throw new RangeError("targetStart out of bounds");
    if (g < 0 || g >= this.length) throw new RangeError("Index out of range");
    if (_ < 0) throw new RangeError("sourceEnd out of bounds");
    _ > this.length && (_ = this.length), l.length - h < _ - g && (_ = l.length - h + g);
    const I = _ - g;
    return this === l && typeof s.prototype.copyWithin == "function" ? this.copyWithin(h, g, _) : s.prototype.set.call(
      l,
      this.subarray(g, _),
      h
    ), I;
  }, c.prototype.fill = function(l, h, g, _) {
    if (typeof l == "string") {
      if (typeof h == "string" ? (_ = h, h = 0, g = this.length) : typeof g == "string" && (_ = g, g = this.length), _ !== void 0 && typeof _ != "string")
        throw new TypeError("encoding must be a string");
      if (typeof _ == "string" && !c.isEncoding(_))
        throw new TypeError("Unknown encoding: " + _);
      if (l.length === 1) {
        const C = l.charCodeAt(0);
        (_ === "utf8" && C < 128 || _ === "latin1") && (l = C);
      }
    } else typeof l == "number" ? l = l & 255 : typeof l == "boolean" && (l = Number(l));
    if (h < 0 || this.length < h || this.length < g)
      throw new RangeError("Out of range index");
    if (g <= h)
      return this;
    h = h >>> 0, g = g === void 0 ? this.length : g >>> 0, l || (l = 0);
    let I;
    if (typeof l == "number")
      for (I = h; I < g; ++I)
        this[I] = l;
    else {
      const C = c.isBuffer(l) ? l : c.from(l, _), K = C.length;
      if (K === 0)
        throw new TypeError('The value "' + l + '" is invalid for argument "value"');
      for (I = 0; I < g - h; ++I)
        this[I + h] = C[I % K];
    }
    return this;
  };
  const Wt = {};
  function ei(m, l, h) {
    Wt[m] = class extends h {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: l.apply(this, arguments),
          writable: !0,
          configurable: !0
        }), this.name = `${this.name} [${m}]`, this.stack, delete this.name;
      }
      get code() {
        return m;
      }
      set code(_) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: _,
          writable: !0
        });
      }
      toString() {
        return `${this.name} [${m}]: ${this.message}`;
      }
    };
  }
  ei(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(m) {
      return m ? `${m} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), ei(
    "ERR_INVALID_ARG_TYPE",
    function(m, l) {
      return `The "${m}" argument must be of type number. Received type ${typeof l}`;
    },
    TypeError
  ), ei(
    "ERR_OUT_OF_RANGE",
    function(m, l, h) {
      let g = `The value of "${m}" is out of range.`, _ = h;
      return Number.isInteger(h) && Math.abs(h) > Y(2, 32) ? _ = Fs(String(h)) : typeof h == "bigint" && (_ = String(h), (h > Y(BigInt(2), BigInt(32)) || h < -Y(BigInt(2), BigInt(32))) && (_ = Fs(_)), _ += "n"), g += ` It must be ${l}. Received ${_}`, g;
    },
    RangeError
  );
  function Fs(m) {
    let l = "", h = m.length;
    const g = m[0] === "-" ? 1 : 0;
    for (; h >= g + 4; h -= 3)
      l = `_${m.slice(h - 3, h)}${l}`;
    return `${m.slice(0, h)}${l}`;
  }
  function Sc(m, l, h) {
    zt(l, "offset"), (m[l] === void 0 || m[l + h] === void 0) && gr(l, m.length - (h + 1));
  }
  function Ms(m, l, h, g, _, I) {
    if (m > h || m < l) {
      const C = typeof l == "bigint" ? "n" : "";
      let K;
      throw l === 0 || l === BigInt(0) ? K = `>= 0${C} and < 2${C} ** ${(I + 1) * 8}${C}` : K = `>= -(2${C} ** ${(I + 1) * 8 - 1}${C}) and < 2 ** ${(I + 1) * 8 - 1}${C}`, new Wt.ERR_OUT_OF_RANGE("value", K, m);
    }
    Sc(g, _, I);
  }
  function zt(m, l) {
    if (typeof m != "number")
      throw new Wt.ERR_INVALID_ARG_TYPE(l, "number", m);
  }
  function gr(m, l, h) {
    throw Math.floor(m) !== m ? (zt(m, h), new Wt.ERR_OUT_OF_RANGE("offset", "an integer", m)) : l < 0 ? new Wt.ERR_BUFFER_OUT_OF_BOUNDS() : new Wt.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${l}`,
      m
    );
  }
  const kc = /[^+/0-9A-Za-z-_]/g;
  function xc(m) {
    if (m = m.split("=")[0], m = m.trim().replace(kc, ""), m.length < 2) return "";
    for (; m.length % 4 !== 0; )
      m = m + "=";
    return m;
  }
  function ti(m, l) {
    l = l || 1 / 0;
    let h;
    const g = m.length;
    let _ = null;
    const I = [];
    for (let C = 0; C < g; ++C) {
      if (h = m.charCodeAt(C), h > 55295 && h < 57344) {
        if (!_) {
          if (h > 56319) {
            (l -= 3) > -1 && I.push(239, 191, 189);
            continue;
          } else if (C + 1 === g) {
            (l -= 3) > -1 && I.push(239, 191, 189);
            continue;
          }
          _ = h;
          continue;
        }
        if (h < 56320) {
          (l -= 3) > -1 && I.push(239, 191, 189), _ = h;
          continue;
        }
        h = (_ - 55296 << 10 | h - 56320) + 65536;
      } else _ && (l -= 3) > -1 && I.push(239, 191, 189);
      if (_ = null, h < 128) {
        if ((l -= 1) < 0) break;
        I.push(h);
      } else if (h < 2048) {
        if ((l -= 2) < 0) break;
        I.push(
          h >> 6 | 192,
          h & 63 | 128
        );
      } else if (h < 65536) {
        if ((l -= 3) < 0) break;
        I.push(
          h >> 12 | 224,
          h >> 6 & 63 | 128,
          h & 63 | 128
        );
      } else if (h < 1114112) {
        if ((l -= 4) < 0) break;
        I.push(
          h >> 18 | 240,
          h >> 12 & 63 | 128,
          h >> 6 & 63 | 128,
          h & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return I;
  }
  function Tc(m) {
    const l = [];
    for (let h = 0; h < m.length; ++h)
      l.push(m.charCodeAt(h) & 255);
    return l;
  }
  function Ic(m, l) {
    let h, g, _;
    const I = [];
    for (let C = 0; C < m.length && !((l -= 2) < 0); ++C)
      h = m.charCodeAt(C), g = h >> 8, _ = h % 256, I.push(_), I.push(g);
    return I;
  }
  function Bs(m) {
    return e.toByteArray(xc(m));
  }
  function un(m, l, h, g) {
    let _;
    for (_ = 0; _ < g && !(_ + h >= l.length || _ >= m.length); ++_)
      l[_ + h] = m[_];
    return _;
  }
  function Xe(m, l) {
    return m instanceof l || m != null && m.constructor != null && m.constructor.name != null && m.constructor.name === l.name;
  }
  function ri(m) {
    return m !== m;
  }
  const Ac = function() {
    const m = "0123456789abcdef", l = new Array(256);
    for (let h = 0; h < 16; ++h) {
      const g = h * 16;
      for (let _ = 0; _ < 16; ++_)
        l[g + _] = m[h] + m[_];
    }
    return l;
  }();
  function gt(m) {
    return typeof BigInt == "undefined" ? Oc : m;
  }
  function Oc() {
    throw new Error("BigInt not supported");
  }
})($a);
const La = $a.Buffer;
class Ua {
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
    const n = (u, f) => {
      const c = f ? ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"] : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
      return c[Math.floor(u / 16)] + c[u % 16];
    }, i = Object.assign(
      {
        grouping: 0,
        rowlength: 0,
        uppercase: !1
      },
      t || {}
    );
    let s = "", o = 0, a = 0;
    for (let u = 0; u < e.length && (s += n(e[u], i.uppercase), u !== e.length - 1); ++u)
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
function On(r, e) {
  const t = Math.ceil(r.length / e), n = [];
  for (let i = 0, s = 0; i < t; ++i, s += e)
    n[i] = r.substr(s, e);
  return n;
}
function os(r = 256, e = "abcdef0123456789") {
  let t = new Uint8Array(r);
  return t = crypto.getRandomValues(t), t = t.map((n) => e.charCodeAt(n % e.length)), String.fromCharCode.apply(null, t);
}
function hl(r, e, t, n, i) {
  if (n = n || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~`!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?¿¡", i = i || n, e > n.length || t > i.length)
    return console.warn("Strings::charsetBaseConvert() - Can't convert", r, "to base", t, "greater than symbol table length. src-table:", n.length, "dest-table:", i.length), !1;
  let o = BigInt(0);
  for (let u = 0; u < r.length; u++)
    o = o * BigInt(e) + BigInt(n.indexOf(r.charAt(u)));
  let a = "";
  for (; o > 0; ) {
    const u = o % BigInt(t);
    a = i.charAt(Number(u)) + a, o /= BigInt(t);
  }
  return a || "0";
}
function Cm(r) {
  return Ua.toHex(r, {});
}
function Rm(r) {
  return Ua.toUint8Array(r);
}
function pl(r) {
  return La.from(r, "hex").toString("base64");
}
function dl(r) {
  return La.from(r, "base64").toString("hex");
}
function yl(r) {
  return /^[A-F0-9]+$/i.test(r);
}
function ml(r) {
  return (typeof r == "number" || typeof r == "string" && r.trim() !== "") && !isNaN(r);
}
let Cn = class {
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
function qa(r, e) {
  let t, n, i;
  const s = [Array, Date, Number, String, Boolean], o = Object.prototype.toString;
  for (e = e || [], t = 0; t < e.length; t += 2)
    r === e[t] && (n = e[t + 1]);
  if (!n && r && typeof r == "object") {
    for (n = {}, t = 0; t < s.length; t++)
      o.call(r) === o.call(i = new s[t](r)) && (n = t ? i : []);
    e.push(r, n);
    for (t in r)
      e.hasOwnProperty.call(r, t) && (n[t] = qa(r[t], e));
  }
  return n || r;
}
function gl(...r) {
  return [].concat(...r.map((e, t) => {
    const n = r.slice(0);
    n.splice(t, 1);
    const i = [...new Set([].concat(...n))];
    return e.filter((s) => !i.includes(s));
  }));
}
function wr(...r) {
  return r.reduce((e, t) => e.filter((n) => t.includes(n)));
}
class as {
  /**
   *
   * @param policy
   * @param metaKeys
   */
  constructor(e = {}, t = {}) {
    this.policy = as.normalizePolicy(e), this.fillDefault(t);
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
      for (const a of gl(e, o))
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
class Ge {
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
    const t = new as(e, Object.keys(this.meta));
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
class ae extends TypeError {
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
class Qt extends ae {
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
class Lt {
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
          t.push(Lt.isStructure(e[n]) ? Lt.structure(e[n]) : e[n]);
        return t;
      }
      case "[object Object]": {
        const t = [], n = Object.keys(e).sort((i, s) => i === s ? 0 : i < s ? -1 : 1);
        for (const i of n)
          if (Object.prototype.hasOwnProperty.call(e, i)) {
            const s = {};
            s[i] = Lt.isStructure(e[i]) ? Lt.structure(e[i]) : e[i], t.push(s);
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
    return Lt.structure(this);
  }
}
class vl extends Lt {
  constructor({
    position: e = null,
    walletAddress: t = null,
    isotope: n = null,
    token: i = null,
    value: s = null,
    batchId: o = null,
    metaType: a = null,
    metaId: u = null,
    meta: f = null,
    index: c = null,
    createdAt: d = null,
    version: p = null
  }) {
    super(), this.position = e, this.walletAddress = t, this.isotope = n, this.token = i, this.value = s, this.batchId = o, this.metaType = a, this.metaId = u, this.meta = f, this.index = c, this.createdAt = d, this.version = p;
  }
}
const vn = {
  4: vl
};
class W {
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
    metaId: u = null,
    meta: f = null,
    otsFragment: c = null,
    index: d = null,
    version: p = null
  }) {
    this.position = e, this.walletAddress = t, this.isotope = n, this.token = i, this.value = s !== null ? String(s) : null, this.batchId = o, this.metaType = a, this.metaId = u, this.meta = f ? Cn.normalizeMeta(f) : [], this.index = d, this.otsFragment = c, this.createdAt = String(+/* @__PURE__ */ new Date()), p !== null && Object.prototype.hasOwnProperty.call(vn, p) && (this.version = String(p));
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
    return o || (o = new Ge()), t && (o.setAtomWallet(t), a || (a = t.batchId)), new W({
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
    const t = Object.assign(new W({}), JSON.parse(e)), n = Object.keys(new W({}));
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
    const n = new Qe("SHAKE256", "TEXT"), i = W.sortAtoms(e);
    if (i.length === 0)
      throw new Qt();
    if (i.map((s) => {
      if (!(s instanceof W))
        throw new Qt();
      return s;
    }), i.every((s) => s.version && Object.prototype.hasOwnProperty.call(vn, s.version)))
      n.update(JSON.stringify(i.map((s) => vn[s.version].create(s).view())));
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
        return hl(n.getHash("HEX", { outputLen: 256 }), 16, 17, "0123456789abcdef", "0123456789abcdefg").padStart(64, "0");
    }
  }
  static jsonSerialization(e, t) {
    if (!W.getUnclaimedProps().includes(e))
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
    return Cn.aggregateMeta(this.meta);
  }
  /**
   *
   * @returns {*[]}
   */
  getHashableValues() {
    const e = [];
    for (const t of W.getHashableProps()) {
      const n = this[t];
      if (!(n === null && !["position", "walletAddress"].includes(t)))
        if (t === "meta")
          for (const i of n)
            typeof i.value != "undefined" && i.value !== null && (e.push(String(i.key)), e.push(String(i.value)));
        else
          e.push(n === null ? "" : String(n));
    }
    return e;
  }
}
function Ci(r = null, e = 2048) {
  if (r) {
    const t = new Qe("SHAKE256", "TEXT");
    return t.update(r), t.getHash("HEX", { outputLen: e * 2 });
  } else
    return os(e);
}
function ar(r, e = null) {
  const t = new Qe("SHAKE256", "TEXT");
  return t.update(r), t.getHash("HEX", { outputLen: 256 });
}
function Rn({
  molecularHash: r = null,
  index: e = null
}) {
  return r !== null && e !== null ? ar(String(r) + String(e), "generateBatchId") : os(64);
}
class qr {
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
    return t.length && (t = JSON.parse(t), t || (t = {})), new qr(
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
    return new qr(
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
class bl extends ae {
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
function Js(r) {
  if (!Number.isSafeInteger(r) || r < 0)
    throw new Error(`positive integer expected, not ${r}`);
}
function wl(r) {
  return r instanceof Uint8Array || r != null && typeof r == "object" && r.constructor.name === "Uint8Array";
}
function Ln(r, ...e) {
  if (!wl(r))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(r.length))
    throw new Error(`Uint8Array expected of length ${e}, not of length=${r.length}`);
}
function Ys(r, e = !0) {
  if (r.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && r.finished)
    throw new Error("Hash#digest() has already been called");
}
function El(r, e) {
  Ln(r);
  const t = e.outputLen;
  if (r.length < t)
    throw new Error(`digestInto() expects output buffer of length at least ${t}`);
}
const ln = /* @__PURE__ */ BigInt(Y(2, 32) - 1), Xs = /* @__PURE__ */ BigInt(32);
function _l(r, e = !1) {
  return e ? { h: Number(r & ln), l: Number(r >> Xs & ln) } : { h: Number(r >> Xs & ln) | 0, l: Number(r & ln) | 0 };
}
function Sl(r, e = !1) {
  let t = new Uint32Array(r.length), n = new Uint32Array(r.length);
  for (let i = 0; i < r.length; i++) {
    const { h: s, l: o } = _l(r[i], e);
    [t[i], n[i]] = [s, o];
  }
  return [t, n];
}
const kl = (r, e, t) => r << t | e >>> 32 - t, xl = (r, e, t) => e << t | r >>> 32 - t, Tl = (r, e, t) => e << t - 32 | r >>> 64 - t, Il = (r, e, t) => r << t - 32 | e >>> 64 - t, si = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ja = (r) => new Uint32Array(r.buffer, r.byteOffset, Math.floor(r.byteLength / 4)), Zs = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68, Al = (r) => r << 24 & 4278190080 | r << 8 & 16711680 | r >>> 8 & 65280 | r >>> 24 & 255;
function eo(r) {
  for (let e = 0; e < r.length; e++)
    r[e] = Al(r[e]);
}
function Ol(r) {
  if (typeof r != "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof r}`);
  return new Uint8Array(new TextEncoder().encode(r));
}
function us(r) {
  return typeof r == "string" && (r = Ol(r)), Ln(r), r;
}
class Cl {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Rl(r) {
  const e = (n) => r().update(us(n)).digest(), t = r();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => r(), e;
}
function Nl(r) {
  const e = (n, i) => r(i).update(us(n)).digest(), t = r({});
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = (n) => r(n), e;
}
function Dl(r = 32) {
  if (si && typeof si.getRandomValues == "function")
    return si.getRandomValues(new Uint8Array(r));
  throw new Error("crypto.getRandomValues must be defined");
}
const Qa = [], Va = [], Ha = [], Fl = /* @__PURE__ */ BigInt(0), Er = /* @__PURE__ */ BigInt(1), Ml = /* @__PURE__ */ BigInt(2), Bl = /* @__PURE__ */ BigInt(7), $l = /* @__PURE__ */ BigInt(256), Pl = /* @__PURE__ */ BigInt(113);
for (let r = 0, e = Er, t = 1, n = 0; r < 24; r++) {
  [t, n] = [n, (2 * t + 3 * n) % 5], Qa.push(2 * (5 * n + t)), Va.push((r + 1) * (r + 2) / 2 % 64);
  let i = Fl;
  for (let s = 0; s < 7; s++)
    e = (e << Er ^ (e >> Bl) * Pl) % $l, e & Ml && (i ^= Er << (Er << /* @__PURE__ */ BigInt(s)) - Er);
  Ha.push(i);
}
const [Ll, Ul] = /* @__PURE__ */ Sl(Ha, !0), to = (r, e, t) => t > 32 ? Tl(r, e, t) : kl(r, e, t), ro = (r, e, t) => t > 32 ? Il(r, e, t) : xl(r, e, t);
function ql(r, e = 24) {
  const t = new Uint32Array(10);
  for (let n = 24 - e; n < 24; n++) {
    for (let o = 0; o < 10; o++)
      t[o] = r[o] ^ r[o + 10] ^ r[o + 20] ^ r[o + 30] ^ r[o + 40];
    for (let o = 0; o < 10; o += 2) {
      const a = (o + 8) % 10, u = (o + 2) % 10, f = t[u], c = t[u + 1], d = to(f, c, 1) ^ t[a], p = ro(f, c, 1) ^ t[a + 1];
      for (let y = 0; y < 50; y += 10)
        r[o + y] ^= d, r[o + y + 1] ^= p;
    }
    let i = r[2], s = r[3];
    for (let o = 0; o < 24; o++) {
      const a = Va[o], u = to(i, s, a), f = ro(i, s, a), c = Qa[o];
      i = r[c], s = r[c + 1], r[c] = u, r[c + 1] = f;
    }
    for (let o = 0; o < 50; o += 10) {
      for (let a = 0; a < 10; a++)
        t[a] = r[o + a];
      for (let a = 0; a < 10; a++)
        r[o + a] ^= ~t[(a + 2) % 10] & t[(a + 4) % 10];
    }
    r[0] ^= Ll[n], r[1] ^= Ul[n];
  }
  t.fill(0);
}
class Un extends Cl {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(e, t, n, i = !1, s = 24) {
    if (super(), this.blockLen = e, this.suffix = t, this.outputLen = n, this.enableXOF = i, this.rounds = s, this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, Js(n), 0 >= this.blockLen || this.blockLen >= 200)
      throw new Error("Sha3 supports only keccak-f1600 function");
    this.state = new Uint8Array(200), this.state32 = ja(this.state);
  }
  keccak() {
    Zs || eo(this.state32), ql(this.state32, this.rounds), Zs || eo(this.state32), this.posOut = 0, this.pos = 0;
  }
  update(e) {
    Ys(this);
    const { blockLen: t, state: n } = this;
    e = us(e);
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
    Ys(this, !1), Ln(e), this.finish();
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
    return Js(e), this.xofInto(new Uint8Array(e));
  }
  digestInto(e) {
    if (El(e, this), this.finished)
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
    return e || (e = new Un(t, n, i, o, s)), e.state32.set(this.state32), e.pos = this.pos, e.posOut = this.posOut, e.finished = this.finished, e.rounds = s, e.suffix = n, e.outputLen = i, e.enableXOF = o, e.destroyed = this.destroyed, e;
  }
}
const Wa = (r, e, t) => Rl(() => new Un(e, r, t)), jl = /* @__PURE__ */ Wa(6, 136, 256 / 8), Ql = /* @__PURE__ */ Wa(6, 72, 512 / 8), za = (r, e, t) => Nl((n = {}) => new Un(e, r, n.dkLen === void 0 ? t : n.dkLen, !0)), Vl = /* @__PURE__ */ za(31, 168, 128 / 8), Ka = /* @__PURE__ */ za(31, 136, 256 / 8);
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
const xt = Ln, no = Dl;
function io(r, e) {
  if (r.length !== e.length)
    return !1;
  let t = 0;
  for (let n = 0; n < r.length; n++)
    t |= r[n] ^ e[n];
  return t === 0;
}
function bn(...r) {
  const e = (n) => typeof n == "number" ? n : n.bytesLen, t = r.reduce((n, i) => n + e(i), 0);
  return {
    bytesLen: t,
    encode: (n) => {
      const i = new Uint8Array(t);
      for (let s = 0, o = 0; s < r.length; s++) {
        const a = r[s], u = e(a), f = typeof a == "number" ? n[s] : a.encode(n[s]);
        xt(f, u), i.set(f, o), typeof a != "number" && f.fill(0), o += u;
      }
      return i;
    },
    decode: (n) => {
      xt(n, t);
      const i = [];
      for (const s of r) {
        const o = e(s), a = n.subarray(0, o);
        i.push(typeof s == "number" ? a : s.decode(a)), n = n.subarray(o);
      }
      return i;
    }
  };
}
function oi(r, e) {
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
      xt(n, t);
      const i = [];
      for (let s = 0; s < n.length; s += r.bytesLen)
        i.push(r.decode(n.subarray(s, s + r.bytesLen)));
      return i;
    }
  };
}
function jt(...r) {
  for (const e of r)
    if (Array.isArray(e))
      for (const t of e)
        t.fill(0);
    else
      e.fill(0);
}
function so(r) {
  return (1 << r) - 1;
}
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
function Hl(r, e = 8) {
  const i = r.toString(2).padStart(8, "0").slice(-e).padStart(7, "0").split("").reverse().join("");
  return Number.parseInt(i, 2);
}
const Wl = (r) => {
  const { newPoly: e, N: t, Q: n, F: i, ROOT_OF_UNITY: s, brvBits: o, isKyber: a } = r, u = (E, b = n) => {
    const k = E % b | 0;
    return (k >= 0 ? k | 0 : b + k | 0) | 0;
  }, f = (E, b = n) => {
    const k = u(E, b) | 0;
    return (k > b >> 1 ? k - b | 0 : k) | 0;
  };
  function c() {
    const E = e(t);
    for (let b = 0; b < t; b++) {
      const k = Hl(b, o), S = Y(BigInt(s), BigInt(k)) % BigInt(n);
      E[b] = Number(S) | 0;
    }
    return E;
  }
  const d = c(), p = a ? 128 : t, y = a ? 1 : 0;
  return { mod: u, smod: f, nttZetas: d, NTT: {
    encode: (E) => {
      for (let b = 1, k = 128; k > y; k >>= 1)
        for (let S = 0; S < t; S += 2 * k) {
          const A = d[b++];
          for (let O = S; O < S + k; O++) {
            const R = u(A * E[O + k]);
            E[O + k] = u(E[O] - R) | 0, E[O] = u(E[O] + R) | 0;
          }
        }
      return E;
    },
    decode: (E) => {
      for (let b = p - 1, k = 1 + y; k < p + y; k <<= 1)
        for (let S = 0; S < t; S += 2 * k) {
          const A = d[b--];
          for (let O = S; O < S + k; O++) {
            const R = E[O];
            E[O] = u(R + E[O + k]), E[O + k] = u(A * (E[O + k] - R));
          }
        }
      for (let b = 0; b < E.length; b++)
        E[b] = u(i * E[b]);
      return E;
    }
  }, bitsCoder: (E, b) => {
    const k = so(E), S = E * (t / 8);
    return {
      bytesLen: S,
      encode: (A) => {
        const O = new Uint8Array(S);
        for (let R = 0, D = 0, F = 0, P = 0; R < A.length; R++)
          for (D |= (b.encode(A[R]) & k) << F, F += E; F >= 8; F -= 8, D >>= 8)
            O[P++] = D & so(F);
        return O;
      },
      decode: (A) => {
        const O = e(t);
        for (let R = 0, D = 0, F = 0, P = 0; R < A.length; R++)
          for (D |= A[R] << F, F += 8; F >= E; F -= E, D >>= E)
            O[P++] = b.decode(D & k);
        return O;
      }
    };
  } };
}, zl = (r) => (e, t) => {
  t || (t = r.blockLen);
  const n = new Uint8Array(e.length + 2);
  n.set(e);
  const i = e.length, s = new Uint8Array(t);
  let o = r.create({}), a = 0, u = 0;
  return {
    stats: () => ({ calls: a, xofs: u }),
    get: (f, c) => (n[i + 0] = f, n[i + 1] = c, o.destroy(), o = r.create({}).update(n), a++, () => (u++, o.xofInto(s))),
    clean: () => {
      o.destroy(), s.fill(0), n.fill(0);
    }
  };
}, Kl = /* @__PURE__ */ zl(Vl);
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
const Ne = 256, dt = 3329, Gl = 3303, Jl = 17, { mod: jr, nttZetas: Yl, NTT: Ft, bitsCoder: Xl } = Wl({
  N: Ne,
  Q: dt,
  F: Gl,
  ROOT_OF_UNITY: Jl,
  newPoly: (r) => new Uint16Array(r),
  brvBits: 7,
  isKyber: !0
}), Zl = {
  512: { N: Ne, Q: dt, K: 2, ETA1: 3, ETA2: 2, du: 10, dv: 4, RBGstrength: 128 },
  768: { N: Ne, Q: dt, K: 3, ETA1: 2, ETA2: 2, du: 10, dv: 4, RBGstrength: 192 },
  1024: { N: Ne, Q: dt, K: 4, ETA1: 2, ETA2: 2, du: 11, dv: 5, RBGstrength: 256 }
}, ef = (r) => {
  if (r >= 12)
    return { encode: (t) => t, decode: (t) => t };
  const e = Y(2, r - 1);
  return {
    // const compress = (i: number) => round((2 ** d / Q) * i) % 2 ** d;
    encode: (t) => ((t << r) + dt / 2) / dt,
    // const decompress = (i: number) => round((Q / 2 ** d) * i);
    decode: (t) => t * dt + e >>> r
  };
}, _r = (r) => Xl(r, ef(r));
function Mt(r, e) {
  for (let t = 0; t < Ne; t++)
    r[t] = jr(r[t] + e[t]);
}
function tf(r, e) {
  for (let t = 0; t < Ne; t++)
    r[t] = jr(r[t] - e[t]);
}
function rf(r, e, t, n, i) {
  const s = jr(e * n * i + r * t), o = jr(r * n + e * t);
  return { c0: s, c1: o };
}
function fn(r, e) {
  for (let t = 0; t < Ne / 2; t++) {
    let n = Yl[64 + (t >> 1)];
    t & 1 && (n = -n);
    const { c0: i, c1: s } = rf(r[2 * t + 0], r[2 * t + 1], e[2 * t + 0], e[2 * t + 1], n);
    r[2 * t + 0] = i, r[2 * t + 1] = s;
  }
  return r;
}
function oo(r) {
  const e = new Uint16Array(Ne);
  for (let t = 0; t < Ne; ) {
    const n = r();
    if (n.length % 3)
      throw new Error("SampleNTT: unaligned block");
    for (let i = 0; t < Ne && i + 3 <= n.length; i += 3) {
      const s = (n[i + 0] >> 0 | n[i + 1] << 8) & 4095, o = (n[i + 1] >> 4 | n[i + 2] << 4) & 4095;
      s < dt && (e[t++] = s), t < Ne && o < dt && (e[t++] = o);
    }
  }
  return e;
}
function Sr(r, e, t, n) {
  const i = r(n * Ne / 4, e, t), s = new Uint16Array(Ne), o = ja(i);
  let a = 0;
  for (let u = 0, f = 0, c = 0, d = 0; u < o.length; u++) {
    let p = o[u];
    for (let y = 0; y < 32; y++)
      c += p & 1, p >>= 1, a += 1, a === n ? (d = c, c = 0) : a === 2 * n && (s[f++] = jr(d - c), c = 0, a = 0);
  }
  if (a)
    throw new Error(`sampleCBD: leftover bits: ${a}`);
  return s;
}
const nf = (r) => {
  const { K: e, PRF: t, XOF: n, HASH512: i, ETA1: s, ETA2: o, du: a, dv: u } = r, f = _r(1), c = _r(u), d = _r(a), p = bn(oi(_r(12), e), 32), y = oi(_r(12), e), v = bn(oi(d, e), c), w = bn(32, 32);
  return {
    secretCoder: y,
    secretKeyLen: y.bytesLen,
    publicKeyLen: p.bytesLen,
    cipherTextLen: v.bytesLen,
    keygen: (E) => {
      const b = new Uint8Array(33);
      b.set(E), b[32] = e;
      const k = i(b), [S, A] = w.decode(k), O = [], R = [];
      for (let P = 0; P < e; P++)
        O.push(Ft.encode(Sr(t, A, P, s)));
      const D = n(S);
      for (let P = 0; P < e; P++) {
        const H = Ft.encode(Sr(t, A, e + P, s));
        for (let J = 0; J < e; J++) {
          const Oe = oo(D.get(J, P));
          Mt(H, fn(Oe, O[J]));
        }
        R.push(H);
      }
      D.clean();
      const F = {
        publicKey: p.encode([R, S]),
        secretKey: y.encode(O)
      };
      return jt(S, A, O, R, b, k), F;
    },
    encrypt: (E, b, k) => {
      const [S, A] = p.decode(E), O = [];
      for (let J = 0; J < e; J++)
        O.push(Ft.encode(Sr(t, k, J, s)));
      const R = n(A), D = new Uint16Array(Ne), F = [];
      for (let J = 0; J < e; J++) {
        const Oe = Sr(t, k, e + J, o), ie = new Uint16Array(Ne);
        for (let ke = 0; ke < e; ke++) {
          const Dt = oo(R.get(J, ke));
          Mt(ie, fn(Dt, O[ke]));
        }
        Mt(Oe, Ft.decode(ie)), F.push(Oe), Mt(D, fn(S[J], O[J])), ie.fill(0);
      }
      R.clean();
      const P = Sr(t, k, 2 * e, o);
      Mt(P, Ft.decode(D));
      const H = f.decode(b);
      return Mt(H, P), jt(S, O, D, P), v.encode([F, H]);
    },
    decrypt: (E, b) => {
      const [k, S] = v.decode(E), A = y.decode(b), O = new Uint16Array(Ne);
      for (let R = 0; R < e; R++)
        Mt(O, fn(A[R], Ft.encode(k[R])));
      return tf(S, Ft.decode(O)), jt(O, A, k), f.encode(S);
    }
  };
};
function sf(r) {
  const e = nf(r), { HASH256: t, HASH512: n, KDF: i } = r, { secretCoder: s, cipherTextLen: o } = e, a = e.publicKeyLen, u = bn(e.secretKeyLen, e.publicKeyLen, 32, 32), f = u.bytesLen, c = 32;
  return {
    publicKeyLen: a,
    msgLen: c,
    keygen: (d = no(64)) => {
      xt(d, 64);
      const { publicKey: p, secretKey: y } = e.keygen(d.subarray(0, 32)), v = t(p), w = u.encode([y, p, v, d.subarray(32)]);
      return jt(y, v), { publicKey: p, secretKey: w };
    },
    encapsulate: (d, p = no(32)) => {
      xt(d, a), xt(p, c);
      const y = d.subarray(0, 384 * r.K), v = s.encode(s.decode(y.slice()));
      if (!io(v, y))
        throw jt(v), new Error("ML-KEM.encapsulate: wrong publicKey modulus");
      jt(v);
      const w = n.create().update(p).update(t(d)).digest(), E = e.encrypt(d, p, w.subarray(32, 64));
      return w.subarray(32).fill(0), { cipherText: E, sharedSecret: w.subarray(0, 32) };
    },
    decapsulate: (d, p) => {
      xt(p, f), xt(d, o);
      const [y, v, w, E] = u.decode(p), b = e.decrypt(d, y), k = n.create().update(b).update(w).digest(), S = k.subarray(0, 32), A = e.encrypt(v, b, k.subarray(32, 64)), O = io(d, A), R = i.create({ dkLen: 32 }).update(E).update(d).digest();
      return jt(b, A, O ? R : S), O ? S : R;
    }
  };
}
function of(r, e, t) {
  return Ka.create({ dkLen: r }).update(e).update(new Uint8Array([t])).digest();
}
const af = {
  HASH256: jl,
  HASH512: Ql,
  KDF: Ka,
  XOF: Kl,
  PRF: of
}, ai = /* @__PURE__ */ sf(Ue(Ue({}, af), Zl[768]));
class X {
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
    this.token = n, this.balance = 0, this.molecules = {}, this.key = null, this.privkey = null, this.pubkey = null, this.tokenUnits = [], this.tradeRates = {}, this.address = i, this.position = s, this.bundle = t, this.batchId = o, this.characters = a, e && (this.bundle = this.bundle || ar(e, "Wallet::constructor"), this.position = this.position || X.generatePosition(), this.key = X.generateKey({
      secret: e,
      token: this.token,
      position: this.position
    }), this.address = this.address || X.generateAddress(this.key), this.characters = this.characters || "BASE64", this.initializeMLKEM());
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
      throw new bl();
    return e && !t && (o = X.generatePosition(), t = ar(e, "Wallet::create")), new X({
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
    return typeof e != "string" ? !1 : e.length === 64 && yl(e);
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
      t.push(qr.createFromDB(n));
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
    const s = BigInt(`0x${e}`) + BigInt(`0x${n}`), o = new Qe("SHAKE256", "TEXT");
    o.update(s.toString(16)), t && o.update(t);
    const a = new Qe("SHAKE256", "TEXT");
    return a.update(o.getHash("HEX", { outputLen: 8192 })), a.getHash("HEX", { outputLen: 8192 });
  }
  /**
   * Generates a wallet address
   *
   * @param {string} key
   * @return {string}
   */
  static generateAddress(e) {
    const t = On(e, 128), n = new Qe("SHAKE256", "TEXT");
    for (const s in t) {
      let o = t[s];
      for (let a = 1; a <= 16; a++) {
        const u = new Qe("SHAKE256", "TEXT");
        u.update(o), o = u.getHash("HEX", { outputLen: 512 });
      }
      n.update(o);
    }
    const i = new Qe("SHAKE256", "TEXT");
    return i.update(n.getHash("HEX", { outputLen: 8192 })), i.getHash("HEX", { outputLen: 256 });
  }
  /**
   *
   * @param saltLength
   * @returns {string}
   */
  static generatePosition(e = 64) {
    return os(e, "abcdef0123456789");
  }
  /**
   * Initializes the ML-KEM key pair
   */
  initializeMLKEM() {
    const e = Ci(this.key, 64), t = new Uint8Array(64);
    for (let s = 0; s < 64; s++)
      t[s] = parseInt(e.substr(s * 2, 2), 16);
    const { publicKey: n, secretKey: i } = ai.keygen(t);
    this.pubkey = n, this.privkey = i;
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
    const t = X.create({
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
    return (typeof this.position == "undefined" || this.position === null) && (typeof this.address == "undefined" || this.address === null);
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
    e.batchId && (this.batchId = t ? e.batchId : Rn({}));
  }
  encryptMessage(e, t) {
    return L(this, null, function* () {
      const n = JSON.stringify(e), i = new TextEncoder().encode(n), { cipherText: s, sharedSecret: o } = ai.encapsulate(t), a = yield this.encryptWithSharedSecret(i, o);
      return {
        cipherText: s,
        encryptedMessage: a
      };
    });
  }
  decryptMessage(e) {
    return L(this, null, function* () {
      const { cipherText: t, encryptedMessage: n } = e, i = ai.decapsulate(t, this.privkey), s = yield this.decryptWithSharedSecret(n, i), o = new TextDecoder().decode(s);
      return JSON.parse(o);
    });
  }
  encryptWithSharedSecret(e, t) {
    return L(this, null, function* () {
      const n = crypto.getRandomValues(new Uint8Array(12)), i = { name: "AES-GCM", iv: n }, s = yield crypto.subtle.importKey(
        "raw",
        t,
        { name: "AES-GCM" },
        !1,
        ["encrypt"]
      ), o = yield crypto.subtle.encrypt(
        i,
        s,
        e
      ), a = new Uint8Array(n.length + o.byteLength);
      return a.set(n), a.set(new Uint8Array(o), n.length), a;
    });
  }
  /**
   * Decrypts the given message using the shared secret
   * @param encryptedMessage
   * @param sharedSecret
   * @returns {Promise<Uint8Array>}
   */
  decryptWithSharedSecret(e, t) {
    return L(this, null, function* () {
      const i = { name: "AES-GCM", iv: e.slice(0, 12) }, s = yield crypto.subtle.importKey(
        "raw",
        t,
        { name: "AES-GCM" },
        !1,
        ["decrypt"]
      ), o = yield crypto.subtle.decrypt(
        i,
        s,
        e.slice(12)
      );
      return new Uint8Array(o);
    });
  }
}
class kr extends ae {
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
class uf extends ae {
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
class cf extends ae {
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
class ao extends ae {
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
class Ga extends ae {
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
class lf extends ae {
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
class ct extends ae {
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
class uo extends ae {
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
class co extends ae {
  /**
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Token slugs for wallets in transfer do not match!", t = null, n = null) {
    super(e, t, n), this.name = "TransferMismatchedException";
  }
}
class lo extends ae {
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
class ff extends ae {
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
class hf extends ae {
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
class bt extends ae {
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
class xr extends ae {
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
class wn extends ae {
  /**
   * @param {string|null} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Incorrect BatchId", t = null, n = null) {
    super(e, t, n), this.name = "BatchIdException";
  }
}
class fo {
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
class Nn extends ae {
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
class Ve extends ae {
  /**
   * @param {string|null} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Code exception", t = null, n = null) {
    super(e, t, n), this.name = "CodeException";
  }
}
class Mr {
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
    comparison: u = null
  }) {
    if (i && (this.meta = i), !e)
      throw new Nn('Callback structure violated, missing mandatory "action" parameter.');
    this.__metaId = n, this.__metaType = t, this.__action = e, this.__address = s, this.__token = o, this.__amount = a, this.__comparison = u;
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
    if (!ml(e))
      throw new Ve("Parameter amount should be a string containing numbers");
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
    this.__meta = e instanceof fo ? e : fo.toObject(e);
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
    const t = new Mr({
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
    return wr(Object.keys(this.toJSON()), ["action", "metaId", "metaType", "meta"]).length === 4 && this._is("meta");
  }
  /**
   * @return {boolean}
   */
  isCollect() {
    return wr(Object.keys(this.toJSON()), ["action", "address", "token", "amount", "comparison"]).length === 5 && this._is("collect");
  }
  /**
   * @return {boolean}
   */
  isBuffer() {
    return wr(Object.keys(this.toJSON()), ["action", "address", "token", "amount", "comparison"]).length === 5 && this._is("buffer");
  }
  /**
   * @return {boolean}
   */
  isRemit() {
    return wr(Object.keys(this.toJSON()), ["action", "token", "amount"]).length === 3 && this._is("remit");
  }
  /**
   * @return {boolean}
   */
  isBurn() {
    return wr(Object.keys(this.toJSON()), ["action", "token", "amount", "comparison"]).length === 4 && this._is("burn");
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
class ui {
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
      throw new Nn("Condition::constructor( { key, value, comparison } ) - not all class parameters are initialised!");
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
class Qr {
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
      if (!(n instanceof ui))
        throw new Nn();
    for (const n of t)
      if (!(n instanceof Mr))
        throw new Nn();
    this.__condition = e, this.__callback = t;
  }
  /**
   *
   * @param {Condition[]|{}} condition
   */
  set comparison(e) {
    this.__condition.push(e instanceof ui ? e : ui.toObject(e));
  }
  /**
   * @param {Callback[]|{}} callback
   */
  set callback(e) {
    this.__callback.push(e instanceof Mr ? e : Mr.toObject(e));
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
    const t = new Qr({});
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
class de {
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
    return !Array.isArray(e) && !(e instanceof Object) ? !1 : typeof e[this.key] != "undefined";
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
    for (let f = 0; f < o; f++) {
      const c = i[f], d = Number(c), p = Number.isInteger(d);
      (p ? d : c in s) || (s[p ? d : c] = i[f + 1].match(/^\d+$/) ? [] : {}), s = s[p ? d : c];
    }
    const a = i[o], u = Number(a);
    return s[Number.isInteger(u) ? u : a] = n, e;
  }
}
class pf {
  /**
   *
   * @param molecule
   */
  constructor(e) {
    if (e.molecularHash === null)
      throw new cf();
    if (!e.atoms.length)
      throw new Qt();
    for (const t of e.atoms)
      if (t.index === null)
        throw new kr();
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
      throw new Qt("Check::continuId() - Molecule is missing required ContinuID Atom!");
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
          throw new wn();
        for (const i of t)
          if (i.batchId === null)
            throw new wn();
      }
      return !0;
    }
    throw new wn();
  }
  /**
   *
   * @returns {boolean}
   */
  isotopeI() {
    for (const e of this.molecule.getIsotopes("I")) {
      if (e.token !== "USER")
        throw new xr(`Check::isotopeI() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index === 0)
        throw new kr(`Check::isotopeI() - Isotope "${e.isotope}" Atoms must have a non-zero index!`);
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
        throw new xr(`Check::isotopeU() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new kr(`Check::isotopeU() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
        throw new xr(`Check::isotopeM() - "${t.token}" is not a valid Token slug for "${t.isotope}" isotope Atoms!`);
      const n = Cn.aggregateMeta(t.meta);
      for (const i of e) {
        let s = n[i];
        if (s) {
          s = JSON.parse(s);
          for (const [o, a] of Object.entries(s))
            if (!e.includes(o)) {
              if (!Object.keys(n).includes(o))
                throw new ao(`${o} is missing from the meta.`);
              for (const u of a)
                if (!X.isBundleHash(u) && !["all", "self"].includes(u))
                  throw new ao(`${u} does not correspond to the format of the policy.`);
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
        throw new xr(`Check::isotopeC() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new kr(`Check::isotopeC() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
        throw new xr(`Check::isotopeT() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new kr(`Check::isotopeT() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
          Qr.toObject(i);
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
        throw new co();
      if (o.value < 0)
        throw new uo();
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
          throw new co();
        if (o > 0) {
          if (s < 0)
            throw new uo();
          if (a.walletAddress === n.walletAddress)
            throw new ff();
        }
        i += s;
      }
    if (i !== s)
      throw new hf();
    if (e) {
      if (s = n.value * 1, Number.isNaN(s))
        throw new TypeError('Invalid isotope "V" values');
      const o = e.balance + s;
      if (o < 0)
        throw new ct();
      if (o !== i)
        throw new lo();
    } else if (s !== 0)
      throw new lo();
    return !0;
  }
  /**
   * Verifies if the hash of all the atoms matches the molecular hash to ensure content has not been messed with
   *
   * @returns {boolean}
   */
  molecularHash() {
    if (this.molecule.molecularHash !== W.hashAtoms({
      atoms: this.molecule.atoms
    }))
      throw new uf();
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
      (p, y) => p + y
    );
    if (t.length !== 2048 && (t = dl(t), t.length !== 2048))
      throw new Ga();
    const n = On(t, 128);
    let i = "";
    for (const p in n) {
      let y = n[p];
      for (let v = 0, w = 8 + e[p]; v < w; v++)
        y = new Qe("SHAKE256", "TEXT").update(y).getHash("HEX", { outputLen: 512 });
      i += y;
    }
    const s = new Qe("SHAKE256", "TEXT");
    s.update(i);
    const o = s.getHash("HEX", { outputLen: 8192 }), a = new Qe("SHAKE256", "TEXT");
    a.update(o);
    const u = a.getHash("HEX", { outputLen: 256 }), f = this.molecule.atoms[0];
    let c = f.walletAddress;
    const d = de.get(f.aggregatedMeta(), "signingWallet");
    if (d && (c = de.get(JSON.parse(d), "address")), u !== c)
      throw new lf();
    return !0;
  }
}
class Tr extends ae {
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
class ho extends ae {
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
    sourceWallet: n = null,
    remainderWallet: i = null,
    cellSlug: s = null,
    version: o = null
  }) {
    this.status = null, this.molecularHash = null, this.createdAt = String(+/* @__PURE__ */ new Date()), this.cellSlugOrigin = this.cellSlug = s, this.secret = e, this.bundle = t, this.sourceWallet = n, this.atoms = [], o !== null && Object.prototype.hasOwnProperty.call(vn, o) && (this.version = String(o)), (i || n) && (this.remainderWallet = i || X.create({
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
    const t = Object.assign(new lt({}), JSON.parse(e)), n = Object.keys(new lt({}));
    if (!Array.isArray(t.atoms))
      throw new Qt();
    for (const i in Object.keys(t.atoms)) {
      t.atoms[i] = W.jsonToObject(JSON.stringify(t.atoms[i]));
      for (const s of ["position", "walletAddress", "isotope"])
        if (t.atoms[i].isotope.toLowerCase() !== "r" && (typeof t.atoms[i][s] == "undefined" || t.atoms[i][s] === null))
          throw new Qt("MolecularStructure::jsonToObject() - Required Atom properties are missing!");
    }
    for (const i in t)
      Object.prototype.hasOwnProperty.call(t, i) && !n.includes(i) && delete t[i];
    return t.atoms = W.sortAtoms(t.atoms), t;
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
      typeof t[a] != "undefined" && (n[s] = t[a]);
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
    return this.molecularHash = null, e.index = this.generateIndex(), e.version = this.version, this.atoms.push(e), this.atoms = W.sortAtoms(this.atoms), this;
  }
  /**
   * Add user remainder atom for ContinuID
   *
   * @return {Molecule}
   */
  addContinuIdAtom() {
    return this.addAtom(W.create({
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
    const s = new Ge(n);
    s.addPolicy(i);
    const o = X.create({
      secret: this.secret,
      bundle: this.sourceWallet.bundle,
      token: "USER"
    });
    return this.addAtom(W.create({
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
      throw new Tr();
    return this.addAtom(W.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -n
    })), this.addAtom(W.create({
      isotope: "F",
      wallet: t,
      value: 1,
      metaType: "walletBundle",
      metaId: t.bundle
    })), this.addAtom(W.create({
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
      throw new ho("Molecule::burnToken() - Amount to burn must be positive!");
    if (this.sourceWallet.balance - e < 0)
      throw new Tr();
    return this.addAtom(W.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -e
    })), this.addAtom(W.create({
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
      throw new ho("Molecule::replenishToken() - Amount to replenish must be positive!");
    if (t.length) {
      t = X.getTokenUnits(t), this.remainderWallet.tokenUnits = this.sourceWallet.tokenUnits;
      for (const n of t)
        this.remainderWallet.tokenUnits.push(n);
      this.remainderWallet.balance = this.remainderWallet.tokenUnits.length, this.sourceWallet.tokenUnits = t, this.sourceWallet.balance = this.sourceWallet.tokenUnits.length;
    } else
      this.remainderWallet.balance = this.sourceWallet.balance + e, this.sourceWallet.balance = e;
    return this.addAtom(W.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: this.sourceWallet.balance
    })), this.addAtom(W.create({
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
      throw new Tr();
    return this.addAtom(W.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -t
    })), this.addAtom(W.create({
      isotope: "V",
      wallet: e,
      value: t,
      metaType: "walletBundle",
      metaId: e.bundle
    })), this.addAtom(W.create({
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
      throw new Tr();
    const n = X.create({
      secret: this.secret,
      bundle: this.bundle,
      token: this.sourceWallet.token,
      batchId: this.sourceWallet.batchId
    });
    return n.tradeRates = t, this.addAtom(W.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -e
    })), this.addAtom(W.create({
      isotope: "B",
      wallet: n,
      value: e,
      metaType: "walletBundle",
      metaId: this.sourceWallet.bundle
    })), this.addAtom(W.create({
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
      throw new Tr();
    const i = new Ge();
    t && i.setSigningWallet(t), this.addAtom(W.create({
      isotope: "B",
      wallet: this.sourceWallet,
      value: -n,
      meta: i,
      metaType: "walletBundle",
      metaId: this.sourceWallet.bundle
    }));
    for (const [s, o] of Object.entries(e || {}))
      this.addAtom(new W({
        isotope: "V",
        token: this.sourceWallet.token,
        value: o,
        batchId: this.sourceWallet.batchId ? Rn({}) : null,
        metaType: "walletBundle",
        metaId: s
      }));
    return this.addAtom(W.create({
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
    const i = new Ge(n);
    return i.setMetaWallet(e), this.addAtom(W.create({
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
      s.push(a instanceof Qr ? a : Qr.toObject(a));
    const o = new Ge({
      rule: JSON.stringify(s)
    });
    return o.addPolicy(i), this.addAtom(W.create({
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
    return t || (t = new Ge()), t.setMetaWallet(e), this.addAtom(W.create({
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
    const t = new Ge().setShadowWalletClaim(!0);
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
      hash: ar(t.trim(), "Molecule::initIdentifierCreation")
    };
    return this.addAtom(W.create({
      isotope: "C",
      wallet: this.sourceWallet,
      metaType: "identifier",
      metaId: e,
      meta: new Ge(i)
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
    return this.addAtom(W.create({
      isotope: "M",
      wallet: this.sourceWallet,
      metaType: t,
      metaId: n,
      meta: new Ge(e)
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
    return s.token = e, this.local = 1, this.addAtom(W.create({
      isotope: "T",
      wallet: this.sourceWallet,
      value: t,
      metaType: n,
      metaId: i,
      meta: new Ge(s),
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
    return this.addAtom(W.create({
      isotope: "U",
      wallet: this.sourceWallet,
      meta: new Ge(e)
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
    if (this.atoms.length === 0 || this.atoms.filter((y) => !(y instanceof W)).length !== 0)
      throw new Qt();
    !t && !this.bundle && (this.bundle = e || ar(this.secret, "Molecule::sign")), this.molecularHash = W.hashAtoms({
      atoms: this.atoms
    });
    const i = this.atoms[0];
    let s = i.position;
    const o = de.get(i.aggregatedMeta(), "signingWallet");
    if (o && (s = de.get(JSON.parse(o), "position")), !s)
      throw new Ga("Signing wallet must have a position!");
    const a = X.generateKey({
      secret: this.secret,
      token: i.token,
      position: i.position
    }), u = On(a, 128), f = this.normalizedHash();
    let c = "";
    for (const y in u) {
      let v = u[y];
      for (let w = 0, E = 8 - f[y]; w < E; w++)
        v = new Qe("SHAKE256", "TEXT").update(v).getHash("HEX", { outputLen: 512 });
      c += v;
    }
    n && (c = pl(c));
    const d = On(c, Math.ceil(c.length / this.atoms.length));
    let p = null;
    for (let y = 0, v = d.length; y < v; y++)
      this.atoms[y].otsFragment = d[y], p = this.atoms[y].position;
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
    const e = qa(this);
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
    new pf(this).verify(e);
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
const ci = Y(10, 18);
class rr {
  /**
   * @param {number} value
   * @return {number}
   */
  static val(e) {
    return Math.abs(e * ci) < 1 ? 0 : e;
  }
  /**
   * @param {number} value1
   * @param {number} value2
   * @param {boolean} debug
   * @return {number}
   */
  static cmp(e, t, n = !1) {
    const i = rr.val(e) * ci, s = rr.val(t) * ci;
    return Math.abs(i - s) < 1 ? 0 : i > s ? 1 : -1;
  }
  /**
   * @param {number} value1
   * @param {number} value2
   * @return {boolean}
   */
  static equal(e, t) {
    return rr.cmp(e, t) === 0;
  }
}
class Vr {
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
    const n = new Vr(e);
    return n.setWallet(t), n;
  }
  /**
   *
   * @param {object} snapshot
   * @param {string} secret
   * @return {AuthToken}
   */
  static restore(e, t) {
    const n = new X({
      secret: t,
      token: "AUTH",
      position: e.wallet.position,
      characters: e.wallet.characters
    });
    return Vr.create({
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
class Br extends ae {
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
class Ri extends ae {
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
let _e = class {
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
    if (this.dataKey = n, this.errorKey = "exception", this.$__payload = null, this.$__query = e, this.$__originResponse = t, this.$__response = t, typeof this.$__response == "undefined" || this.$__response === null)
      throw new Br();
    if (de.has(this.$__response, this.errorKey)) {
      const i = de.get(this.$__response, this.errorKey);
      throw String(i).includes("Unauthenticated") ? new Ri() : new Br();
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
    if (!de.has(this.response(), this.dataKey))
      throw new Br();
    return de.get(this.response(), this.dataKey);
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
class Le {
  /**
   * @param {ApolloClient} apolloClient
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
  createResponseRaw(e) {
    return L(this, null, function* () {
      return this.createResponse(e);
    });
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {Response}
   */
  createResponse(e) {
    return new _e({
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
      throw new Ve("Query::createQuery() - Node URI was not initialized for this client instance!");
    if (this.$__query === null)
      throw new Ve("Query::createQuery() - GraphQL subscription was not initialized!");
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
  execute(n) {
    return L(this, arguments, function* ({ variables: e = null, context: t = {} }) {
      this.$__request = this.createQuery({ variables: e });
      const i = Ue(Ue({}, t), this.createQueryContext());
      try {
        const s = yield this.client.query(vr(Ue({}, this.$__request), {
          context: i
        }));
        return this.$__response = yield this.createResponseRaw(s), this.$__response;
      } catch (s) {
        if (s.name === "AbortError")
          return this.knishIOClient.log("warn", "Query was cancelled"), new _e({
            query: this,
            json: { data: null, errors: [{ message: "Query was cancelled" }] }
          });
        throw s;
      }
    });
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
class df extends _e {
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
    return t && (e = new X({
      secret: null,
      token: t.tokenSlug
    }), e.address = t.address, e.position = t.position, e.bundle = t.bundleHash, e.batchId = t.batchId, e.characters = t.characters, e.pubkey = t.pubkey, e.balance = t.amount * 1), e;
  }
}
var Ni = function(r, e) {
  return Ni = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
  }, Ni(r, e);
};
function He(r, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Ni(r, e);
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
function rt(r, e) {
  var t = {};
  for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && e.indexOf(n) < 0 && (t[n] = r[n]);
  if (r != null && typeof Object.getOwnPropertySymbols == "function")
    for (var i = 0, n = Object.getOwnPropertySymbols(r); i < n.length; i++)
      e.indexOf(n[i]) < 0 && Object.prototype.propertyIsEnumerable.call(r, n[i]) && (t[n[i]] = r[n[i]]);
  return t;
}
function wt(r, e, t, n) {
  function i(s) {
    return s instanceof t ? s : new t(function(o) {
      o(s);
    });
  }
  return new (t || (t = Promise))(function(s, o) {
    function a(c) {
      try {
        f(n.next(c));
      } catch (d) {
        o(d);
      }
    }
    function u(c) {
      try {
        f(n.throw(c));
      } catch (d) {
        o(d);
      }
    }
    function f(c) {
      c.done ? s(c.value) : i(c.value).then(a, u);
    }
    f((n = n.apply(r, e || [])).next());
  });
}
function Et(r, e) {
  var t = { label: 0, sent: function() {
    if (s[0] & 1) throw s[1];
    return s[1];
  }, trys: [], ops: [] }, n, i, s, o;
  return o = { next: a(0), throw: a(1), return: a(2) }, typeof Symbol == "function" && (o[Symbol.iterator] = function() {
    return this;
  }), o;
  function a(f) {
    return function(c) {
      return u([f, c]);
    };
  }
  function u(f) {
    if (n) throw new TypeError("Generator is already executing.");
    for (; o && (o = 0, f[0] && (t = 0)), t; ) try {
      if (n = 1, i && (s = f[0] & 2 ? i.return : f[0] ? i.throw || ((s = i.return) && s.call(i), 0) : i.next) && !(s = s.call(i, f[1])).done) return s;
      switch (i = 0, s && (f = [f[0] & 2, s.value]), f[0]) {
        case 0:
        case 1:
          s = f;
          break;
        case 4:
          return t.label++, { value: f[1], done: !1 };
        case 5:
          t.label++, i = f[1], f = [0];
          continue;
        case 7:
          f = t.ops.pop(), t.trys.pop();
          continue;
        default:
          if (s = t.trys, !(s = s.length > 0 && s[s.length - 1]) && (f[0] === 6 || f[0] === 2)) {
            t = 0;
            continue;
          }
          if (f[0] === 3 && (!s || f[1] > s[0] && f[1] < s[3])) {
            t.label = f[1];
            break;
          }
          if (f[0] === 6 && t.label < s[1]) {
            t.label = s[1], s = f;
            break;
          }
          if (s && t.label < s[2]) {
            t.label = s[2], t.ops.push(f);
            break;
          }
          s[2] && t.ops.pop(), t.trys.pop();
          continue;
      }
      f = e.call(r, t);
    } catch (c) {
      f = [6, c], i = 0;
    } finally {
      n = s = 0;
    }
    if (f[0] & 5) throw f[1];
    return { value: f[0] ? f[1] : void 0, done: !0 };
  }
}
function Pe(r, e, t) {
  if (t || arguments.length === 2) for (var n = 0, i = e.length, s; n < i; n++)
    (s || !(n in e)) && (s || (s = Array.prototype.slice.call(e, 0, n)), s[n] = e[n]);
  return r.concat(s || Array.prototype.slice.call(e));
}
var li = "Invariant Violation", po = Object.setPrototypeOf, yf = po === void 0 ? function(r, e) {
  return r.__proto__ = e, r;
} : po, Ja = (
  /** @class */
  function(r) {
    He(e, r);
    function e(t) {
      t === void 0 && (t = li);
      var n = r.call(this, typeof t == "number" ? li + ": " + t + " (see https://github.com/apollographql/invariant-packages)" : t) || this;
      return n.framesToPop = 1, n.name = li, yf(n, e.prototype), n;
    }
    return e;
  }(Error)
);
function Ut(r, e) {
  if (!r)
    throw new Ja(e);
}
var Ya = ["debug", "log", "warn", "error", "silent"], mf = Ya.indexOf("log");
function hn(r) {
  return function() {
    if (Ya.indexOf(r) >= mf) {
      var e = console[r] || console.log;
      return e.apply(console, arguments);
    }
  };
}
(function(r) {
  r.debug = hn("debug"), r.log = hn("log"), r.warn = hn("warn"), r.error = hn("error");
})(Ut || (Ut = {}));
var cs = "3.11.8";
const Tt = globalThis || void 0 || self;
function Ye(r) {
  try {
    return r();
  } catch (e) {
  }
}
const Di = Ye(function() {
  return globalThis;
}) || Ye(function() {
  return window;
}) || Ye(function() {
  return self;
}) || Ye(function() {
  return Tt;
}) || // We don't expect the Function constructor ever to be invoked at runtime, as
// long as at least one of globalThis, window, self, or global is defined, so
// we are under no obligation to make it easy for static analysis tools to
// detect syntactic usage of the Function constructor. If you think you can
// improve your static analysis to detect this obfuscation, think again. This
// is an arms race you cannot win, at least not in JavaScript.
Ye(function() {
  return Ye.constructor("return this")();
});
var yo = /* @__PURE__ */ new Map();
function Fi(r) {
  var e = yo.get(r) || 1;
  return yo.set(r, e + 1), "".concat(r, ":").concat(e, ":").concat(Math.random().toString(36).slice(2));
}
function Xa(r, e) {
  e === void 0 && (e = 0);
  var t = Fi("stringifyForDisplay");
  return JSON.stringify(r, function(n, i) {
    return i === void 0 ? t : i;
  }, e).split(JSON.stringify(t)).join("<undefined>");
}
function pn(r) {
  return function(e) {
    for (var t = [], n = 1; n < arguments.length; n++)
      t[n - 1] = arguments[n];
    if (typeof e == "number") {
      var i = e;
      e = ls(i), e || (e = fs(i, t), t = []);
    }
    r.apply(void 0, [e].concat(t));
  };
}
var j = Object.assign(function(e, t) {
  for (var n = [], i = 2; i < arguments.length; i++)
    n[i - 2] = arguments[i];
  e || Ut(e, ls(t, n) || fs(t, n));
}, {
  debug: pn(Ut.debug),
  log: pn(Ut.log),
  warn: pn(Ut.warn),
  error: pn(Ut.error)
});
function Fe(r) {
  for (var e = [], t = 1; t < arguments.length; t++)
    e[t - 1] = arguments[t];
  return new Ja(ls(r, e) || fs(r, e));
}
var mo = Symbol.for("ApolloErrorMessageHandler_" + cs);
function Za(r) {
  if (typeof r == "string")
    return r;
  try {
    return Xa(r, 2).slice(0, 1e3);
  } catch (e) {
    return "<non-serializable>";
  }
}
function ls(r, e) {
  if (e === void 0 && (e = []), !!r)
    return Di[mo] && Di[mo](r, e.map(Za));
}
function fs(r, e) {
  if (e === void 0 && (e = []), !!r)
    return "An error occurred! For more details, see the full error text at https://go.apollo.dev/c/err#".concat(encodeURIComponent(JSON.stringify({
      version: cs,
      message: r,
      args: e.map(Za)
    })));
}
function En(r, e) {
  if (!!!r)
    throw new Error(e);
}
function gf(r) {
  return typeof r == "object" && r !== null;
}
function vf(r, e) {
  if (!!!r)
    throw new Error(
      "Unexpected invariant triggered."
    );
}
const bf = /\r\n|[\n\r]/g;
function Mi(r, e) {
  let t = 0, n = 1;
  for (const i of r.body.matchAll(bf)) {
    if (typeof i.index == "number" || vf(!1), i.index >= e)
      break;
    t = i.index + i[0].length, n += 1;
  }
  return {
    line: n,
    column: e + 1 - t
  };
}
function wf(r) {
  return eu(
    r.source,
    Mi(r.source, r.start)
  );
}
function eu(r, e) {
  const t = r.locationOffset.column - 1, n = "".padStart(t) + r.body, i = e.line - 1, s = r.locationOffset.line - 1, o = e.line + s, a = e.line === 1 ? t : 0, u = e.column + a, f = `${r.name}:${o}:${u}
`, c = n.split(/\r\n|[\n\r]/g), d = c[i];
  if (d.length > 120) {
    const p = Math.floor(u / 80), y = u % 80, v = [];
    for (let w = 0; w < d.length; w += 80)
      v.push(d.slice(w, w + 80));
    return f + go([
      [`${o} |`, v[0]],
      ...v.slice(1, p + 1).map((w) => ["|", w]),
      ["|", "^".padStart(y)],
      ["|", v[p + 1]]
    ]);
  }
  return f + go([
    // Lines specified like this: ["prefix", "string"],
    [`${o - 1} |`, c[i - 1]],
    [`${o} |`, d],
    ["|", "^".padStart(u)],
    [`${o + 1} |`, c[i + 1]]
  ]);
}
function go(r) {
  const e = r.filter(([n, i]) => i !== void 0), t = Math.max(...e.map(([n]) => n.length));
  return e.map(([n, i]) => n.padStart(t) + (i ? " " + i : "")).join(`
`);
}
function Ef(r) {
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
class hs extends Error {
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
    const { nodes: o, source: a, positions: u, path: f, originalError: c, extensions: d } = Ef(t);
    super(e), this.name = "GraphQLError", this.path = f != null ? f : void 0, this.originalError = c != null ? c : void 0, this.nodes = vo(
      Array.isArray(o) ? o : o ? [o] : void 0
    );
    const p = vo(
      (n = this.nodes) === null || n === void 0 ? void 0 : n.map((v) => v.loc).filter((v) => v != null)
    );
    this.source = a != null ? a : p == null || (i = p[0]) === null || i === void 0 ? void 0 : i.source, this.positions = u != null ? u : p == null ? void 0 : p.map((v) => v.start), this.locations = u && a ? u.map((v) => Mi(a, v)) : p == null ? void 0 : p.map((v) => Mi(v.source, v.start));
    const y = gf(
      c == null ? void 0 : c.extensions
    ) ? c == null ? void 0 : c.extensions : void 0;
    this.extensions = (s = d != null ? d : y) !== null && s !== void 0 ? s : /* @__PURE__ */ Object.create(null), Object.defineProperties(this, {
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
    }) : Error.captureStackTrace ? Error.captureStackTrace(this, hs) : Object.defineProperty(this, "stack", {
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

` + wf(t.loc));
    else if (this.source && this.locations)
      for (const t of this.locations)
        e += `

` + eu(this.source, t);
    return e;
  }
  toJSON() {
    const e = {
      message: this.message
    };
    return this.locations != null && (e.locations = this.locations), this.path != null && (e.path = this.path), this.extensions != null && Object.keys(this.extensions).length > 0 && (e.extensions = this.extensions), e;
  }
}
function vo(r) {
  return r === void 0 || r.length === 0 ? void 0 : r;
}
function Te(r, e, t) {
  return new hs(`Syntax Error: ${t}`, {
    source: r,
    positions: [e]
  });
}
class _f {
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
class tu {
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
const ru = {
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
}, Sf = new Set(Object.keys(ru));
function bo(r) {
  const e = r == null ? void 0 : r.kind;
  return typeof e == "string" && Sf.has(e);
}
var Xt;
(function(r) {
  r.QUERY = "query", r.MUTATION = "mutation", r.SUBSCRIPTION = "subscription";
})(Xt || (Xt = {}));
var Bi;
(function(r) {
  r.QUERY = "QUERY", r.MUTATION = "MUTATION", r.SUBSCRIPTION = "SUBSCRIPTION", r.FIELD = "FIELD", r.FRAGMENT_DEFINITION = "FRAGMENT_DEFINITION", r.FRAGMENT_SPREAD = "FRAGMENT_SPREAD", r.INLINE_FRAGMENT = "INLINE_FRAGMENT", r.VARIABLE_DEFINITION = "VARIABLE_DEFINITION", r.SCHEMA = "SCHEMA", r.SCALAR = "SCALAR", r.OBJECT = "OBJECT", r.FIELD_DEFINITION = "FIELD_DEFINITION", r.ARGUMENT_DEFINITION = "ARGUMENT_DEFINITION", r.INTERFACE = "INTERFACE", r.UNION = "UNION", r.ENUM = "ENUM", r.ENUM_VALUE = "ENUM_VALUE", r.INPUT_OBJECT = "INPUT_OBJECT", r.INPUT_FIELD_DEFINITION = "INPUT_FIELD_DEFINITION";
})(Bi || (Bi = {}));
var B;
(function(r) {
  r.NAME = "Name", r.DOCUMENT = "Document", r.OPERATION_DEFINITION = "OperationDefinition", r.VARIABLE_DEFINITION = "VariableDefinition", r.SELECTION_SET = "SelectionSet", r.FIELD = "Field", r.ARGUMENT = "Argument", r.FRAGMENT_SPREAD = "FragmentSpread", r.INLINE_FRAGMENT = "InlineFragment", r.FRAGMENT_DEFINITION = "FragmentDefinition", r.VARIABLE = "Variable", r.INT = "IntValue", r.FLOAT = "FloatValue", r.STRING = "StringValue", r.BOOLEAN = "BooleanValue", r.NULL = "NullValue", r.ENUM = "EnumValue", r.LIST = "ListValue", r.OBJECT = "ObjectValue", r.OBJECT_FIELD = "ObjectField", r.DIRECTIVE = "Directive", r.NAMED_TYPE = "NamedType", r.LIST_TYPE = "ListType", r.NON_NULL_TYPE = "NonNullType", r.SCHEMA_DEFINITION = "SchemaDefinition", r.OPERATION_TYPE_DEFINITION = "OperationTypeDefinition", r.SCALAR_TYPE_DEFINITION = "ScalarTypeDefinition", r.OBJECT_TYPE_DEFINITION = "ObjectTypeDefinition", r.FIELD_DEFINITION = "FieldDefinition", r.INPUT_VALUE_DEFINITION = "InputValueDefinition", r.INTERFACE_TYPE_DEFINITION = "InterfaceTypeDefinition", r.UNION_TYPE_DEFINITION = "UnionTypeDefinition", r.ENUM_TYPE_DEFINITION = "EnumTypeDefinition", r.ENUM_VALUE_DEFINITION = "EnumValueDefinition", r.INPUT_OBJECT_TYPE_DEFINITION = "InputObjectTypeDefinition", r.DIRECTIVE_DEFINITION = "DirectiveDefinition", r.SCHEMA_EXTENSION = "SchemaExtension", r.SCALAR_TYPE_EXTENSION = "ScalarTypeExtension", r.OBJECT_TYPE_EXTENSION = "ObjectTypeExtension", r.INTERFACE_TYPE_EXTENSION = "InterfaceTypeExtension", r.UNION_TYPE_EXTENSION = "UnionTypeExtension", r.ENUM_TYPE_EXTENSION = "EnumTypeExtension", r.INPUT_OBJECT_TYPE_EXTENSION = "InputObjectTypeExtension";
})(B || (B = {}));
function $i(r) {
  return r === 9 || r === 32;
}
function Hr(r) {
  return r >= 48 && r <= 57;
}
function nu(r) {
  return r >= 97 && r <= 122 || // A-Z
  r >= 65 && r <= 90;
}
function iu(r) {
  return nu(r) || r === 95;
}
function kf(r) {
  return nu(r) || Hr(r) || r === 95;
}
function xf(r) {
  var e;
  let t = Number.MAX_SAFE_INTEGER, n = null, i = -1;
  for (let o = 0; o < r.length; ++o) {
    var s;
    const a = r[o], u = Tf(a);
    u !== a.length && (n = (s = n) !== null && s !== void 0 ? s : o, i = o, o !== 0 && u < t && (t = u));
  }
  return r.map((o, a) => a === 0 ? o : o.slice(t)).slice(
    (e = n) !== null && e !== void 0 ? e : 0,
    i + 1
  );
}
function Tf(r) {
  let e = 0;
  for (; e < r.length && $i(r.charCodeAt(e)); )
    ++e;
  return e;
}
function If(r, e) {
  const t = r.replace(/"""/g, '\\"""'), n = t.split(/\r\n|[\n\r]/g), i = n.length === 1, s = n.length > 1 && n.slice(1).every((y) => y.length === 0 || $i(y.charCodeAt(0))), o = t.endsWith('\\"""'), a = r.endsWith('"') && !o, u = r.endsWith("\\"), f = a || u, c = (
    // add leading and trailing new lines only if it improves readability
    !i || r.length > 70 || f || s || o
  );
  let d = "";
  const p = i && $i(r.charCodeAt(0));
  return (c && !p || s) && (d += `
`), d += t, (c || f) && (d += `
`), '"""' + d + '"""';
}
var N;
(function(r) {
  r.SOF = "<SOF>", r.EOF = "<EOF>", r.BANG = "!", r.DOLLAR = "$", r.AMP = "&", r.PAREN_L = "(", r.PAREN_R = ")", r.SPREAD = "...", r.COLON = ":", r.EQUALS = "=", r.AT = "@", r.BRACKET_L = "[", r.BRACKET_R = "]", r.BRACE_L = "{", r.PIPE = "|", r.BRACE_R = "}", r.NAME = "Name", r.INT = "Int", r.FLOAT = "Float", r.STRING = "String", r.BLOCK_STRING = "BlockString", r.COMMENT = "Comment";
})(N || (N = {}));
class Af {
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
    const t = new tu(N.SOF, 0, 0, 0, 0);
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
    if (e.kind !== N.EOF)
      do
        if (e.next)
          e = e.next;
        else {
          const t = Cf(this, e.end);
          e.next = t, t.prev = e, e = t;
        }
      while (e.kind === N.COMMENT);
    return e;
  }
}
function Of(r) {
  return r === N.BANG || r === N.DOLLAR || r === N.AMP || r === N.PAREN_L || r === N.PAREN_R || r === N.SPREAD || r === N.COLON || r === N.EQUALS || r === N.AT || r === N.BRACKET_L || r === N.BRACKET_R || r === N.BRACE_L || r === N.PIPE || r === N.BRACE_R;
}
function pr(r) {
  return r >= 0 && r <= 55295 || r >= 57344 && r <= 1114111;
}
function qn(r, e) {
  return su(r.charCodeAt(e)) && ou(r.charCodeAt(e + 1));
}
function su(r) {
  return r >= 55296 && r <= 56319;
}
function ou(r) {
  return r >= 56320 && r <= 57343;
}
function Vt(r, e) {
  const t = r.source.body.codePointAt(e);
  if (t === void 0)
    return N.EOF;
  if (t >= 32 && t <= 126) {
    const n = String.fromCodePoint(t);
    return n === '"' ? `'"'` : `"${n}"`;
  }
  return "U+" + t.toString(16).toUpperCase().padStart(4, "0");
}
function ve(r, e, t, n, i) {
  const s = r.line, o = 1 + t - r.lineStart;
  return new tu(e, t, n, s, o, i);
}
function Cf(r, e) {
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
        return Rf(r, i);
      case 33:
        return ve(r, N.BANG, i, i + 1);
      case 36:
        return ve(r, N.DOLLAR, i, i + 1);
      case 38:
        return ve(r, N.AMP, i, i + 1);
      case 40:
        return ve(r, N.PAREN_L, i, i + 1);
      case 41:
        return ve(r, N.PAREN_R, i, i + 1);
      case 46:
        if (t.charCodeAt(i + 1) === 46 && t.charCodeAt(i + 2) === 46)
          return ve(r, N.SPREAD, i, i + 3);
        break;
      case 58:
        return ve(r, N.COLON, i, i + 1);
      case 61:
        return ve(r, N.EQUALS, i, i + 1);
      case 64:
        return ve(r, N.AT, i, i + 1);
      case 91:
        return ve(r, N.BRACKET_L, i, i + 1);
      case 93:
        return ve(r, N.BRACKET_R, i, i + 1);
      case 123:
        return ve(r, N.BRACE_L, i, i + 1);
      case 124:
        return ve(r, N.PIPE, i, i + 1);
      case 125:
        return ve(r, N.BRACE_R, i, i + 1);
      case 34:
        return t.charCodeAt(i + 1) === 34 && t.charCodeAt(i + 2) === 34 ? $f(r, i) : Df(r, i);
    }
    if (Hr(s) || s === 45)
      return Nf(r, i, s);
    if (iu(s))
      return Pf(r, i);
    throw Te(
      r.source,
      i,
      s === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : pr(s) || qn(t, i) ? `Unexpected character: ${Vt(r, i)}.` : `Invalid character: ${Vt(r, i)}.`
    );
  }
  return ve(r, N.EOF, n, n);
}
function Rf(r, e) {
  const t = r.source.body, n = t.length;
  let i = e + 1;
  for (; i < n; ) {
    const s = t.charCodeAt(i);
    if (s === 10 || s === 13)
      break;
    if (pr(s))
      ++i;
    else if (qn(t, i))
      i += 2;
    else
      break;
  }
  return ve(
    r,
    N.COMMENT,
    e,
    i,
    t.slice(e + 1, i)
  );
}
function Nf(r, e, t) {
  const n = r.source.body;
  let i = e, s = t, o = !1;
  if (s === 45 && (s = n.charCodeAt(++i)), s === 48) {
    if (s = n.charCodeAt(++i), Hr(s))
      throw Te(
        r.source,
        i,
        `Invalid number, unexpected digit after 0: ${Vt(
          r,
          i
        )}.`
      );
  } else
    i = fi(r, i, s), s = n.charCodeAt(i);
  if (s === 46 && (o = !0, s = n.charCodeAt(++i), i = fi(r, i, s), s = n.charCodeAt(i)), (s === 69 || s === 101) && (o = !0, s = n.charCodeAt(++i), (s === 43 || s === 45) && (s = n.charCodeAt(++i)), i = fi(r, i, s), s = n.charCodeAt(i)), s === 46 || iu(s))
    throw Te(
      r.source,
      i,
      `Invalid number, expected digit but got: ${Vt(
        r,
        i
      )}.`
    );
  return ve(
    r,
    o ? N.FLOAT : N.INT,
    e,
    i,
    n.slice(e, i)
  );
}
function fi(r, e, t) {
  if (!Hr(t))
    throw Te(
      r.source,
      e,
      `Invalid number, expected digit but got: ${Vt(
        r,
        e
      )}.`
    );
  const n = r.source.body;
  let i = e + 1;
  for (; Hr(n.charCodeAt(i)); )
    ++i;
  return i;
}
function Df(r, e) {
  const t = r.source.body, n = t.length;
  let i = e + 1, s = i, o = "";
  for (; i < n; ) {
    const a = t.charCodeAt(i);
    if (a === 34)
      return o += t.slice(s, i), ve(r, N.STRING, e, i + 1, o);
    if (a === 92) {
      o += t.slice(s, i);
      const u = t.charCodeAt(i + 1) === 117 ? t.charCodeAt(i + 2) === 123 ? Ff(r, i) : Mf(r, i) : Bf(r, i);
      o += u.value, i += u.size, s = i;
      continue;
    }
    if (a === 10 || a === 13)
      break;
    if (pr(a))
      ++i;
    else if (qn(t, i))
      i += 2;
    else
      throw Te(
        r.source,
        i,
        `Invalid character within String: ${Vt(
          r,
          i
        )}.`
      );
  }
  throw Te(r.source, i, "Unterminated string.");
}
function Ff(r, e) {
  const t = r.source.body;
  let n = 0, i = 3;
  for (; i < 12; ) {
    const s = t.charCodeAt(e + i++);
    if (s === 125) {
      if (i < 5 || !pr(n))
        break;
      return {
        value: String.fromCodePoint(n),
        size: i
      };
    }
    if (n = n << 4 | Fr(s), n < 0)
      break;
  }
  throw Te(
    r.source,
    e,
    `Invalid Unicode escape sequence: "${t.slice(
      e,
      e + i
    )}".`
  );
}
function Mf(r, e) {
  const t = r.source.body, n = wo(t, e + 2);
  if (pr(n))
    return {
      value: String.fromCodePoint(n),
      size: 6
    };
  if (su(n) && t.charCodeAt(e + 6) === 92 && t.charCodeAt(e + 7) === 117) {
    const i = wo(t, e + 8);
    if (ou(i))
      return {
        value: String.fromCodePoint(n, i),
        size: 12
      };
  }
  throw Te(
    r.source,
    e,
    `Invalid Unicode escape sequence: "${t.slice(e, e + 6)}".`
  );
}
function wo(r, e) {
  return Fr(r.charCodeAt(e)) << 12 | Fr(r.charCodeAt(e + 1)) << 8 | Fr(r.charCodeAt(e + 2)) << 4 | Fr(r.charCodeAt(e + 3));
}
function Fr(r) {
  return r >= 48 && r <= 57 ? r - 48 : r >= 65 && r <= 70 ? r - 55 : r >= 97 && r <= 102 ? r - 87 : -1;
}
function Bf(r, e) {
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
  throw Te(
    r.source,
    e,
    `Invalid character escape sequence: "${t.slice(
      e,
      e + 2
    )}".`
  );
}
function $f(r, e) {
  const t = r.source.body, n = t.length;
  let i = r.lineStart, s = e + 3, o = s, a = "";
  const u = [];
  for (; s < n; ) {
    const f = t.charCodeAt(s);
    if (f === 34 && t.charCodeAt(s + 1) === 34 && t.charCodeAt(s + 2) === 34) {
      a += t.slice(o, s), u.push(a);
      const c = ve(
        r,
        N.BLOCK_STRING,
        e,
        s + 3,
        // Return a string of the lines joined with U+000A.
        xf(u).join(`
`)
      );
      return r.line += u.length - 1, r.lineStart = i, c;
    }
    if (f === 92 && t.charCodeAt(s + 1) === 34 && t.charCodeAt(s + 2) === 34 && t.charCodeAt(s + 3) === 34) {
      a += t.slice(o, s), o = s + 1, s += 4;
      continue;
    }
    if (f === 10 || f === 13) {
      a += t.slice(o, s), u.push(a), f === 13 && t.charCodeAt(s + 1) === 10 ? s += 2 : ++s, a = "", o = s, i = s;
      continue;
    }
    if (pr(f))
      ++s;
    else if (qn(t, s))
      s += 2;
    else
      throw Te(
        r.source,
        s,
        `Invalid character within String: ${Vt(
          r,
          s
        )}.`
      );
  }
  throw Te(r.source, s, "Unterminated string.");
}
function Pf(r, e) {
  const t = r.source.body, n = t.length;
  let i = e + 1;
  for (; i < n; ) {
    const s = t.charCodeAt(i);
    if (kf(s))
      ++i;
    else
      break;
  }
  return ve(
    r,
    N.NAME,
    e,
    i,
    t.slice(e, i)
  );
}
const Lf = 10, au = 2;
function ps(r) {
  return jn(r, []);
}
function jn(r, e) {
  switch (typeof r) {
    case "string":
      return JSON.stringify(r);
    case "function":
      return r.name ? `[function ${r.name}]` : "[function]";
    case "object":
      return Uf(r, e);
    default:
      return String(r);
  }
}
function Uf(r, e) {
  if (r === null)
    return "null";
  if (e.includes(r))
    return "[Circular]";
  const t = [...e, r];
  if (qf(r)) {
    const n = r.toJSON();
    if (n !== r)
      return typeof n == "string" ? n : jn(n, t);
  } else if (Array.isArray(r))
    return Qf(r, t);
  return jf(r, t);
}
function qf(r) {
  return typeof r.toJSON == "function";
}
function jf(r, e) {
  const t = Object.entries(r);
  return t.length === 0 ? "{}" : e.length > au ? "[" + Vf(r) + "]" : "{ " + t.map(
    ([i, s]) => i + ": " + jn(s, e)
  ).join(", ") + " }";
}
function Qf(r, e) {
  if (r.length === 0)
    return "[]";
  if (e.length > au)
    return "[Array]";
  const t = Math.min(Lf, r.length), n = r.length - t, i = [];
  for (let s = 0; s < t; ++s)
    i.push(jn(r[s], e));
  return n === 1 ? i.push("... 1 more item") : n > 1 && i.push(`... ${n} more items`), "[" + i.join(", ") + "]";
}
function Vf(r) {
  const e = Object.prototype.toString.call(r).replace(/^\[object /, "").replace(/]$/, "");
  if (e === "Object" && typeof r.constructor == "function") {
    const t = r.constructor.name;
    if (typeof t == "string" && t !== "")
      return t;
  }
  return e;
}
const Hf = globalThis.process && // eslint-disable-next-line no-undef
!0 === "production", Wf = (
  /* c8 ignore next 6 */
  // FIXME: https://github.com/graphql/graphql-js/issues/2317
  Hf ? function(e, t) {
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
        const o = ps(e);
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
class uu {
  constructor(e, t = "GraphQL request", n = {
    line: 1,
    column: 1
  }) {
    typeof e == "string" || En(!1, `Body must be a string. Received: ${ps(e)}.`), this.body = e, this.name = t, this.locationOffset = n, this.locationOffset.line > 0 || En(
      !1,
      "line in locationOffset is 1-indexed and must be positive."
    ), this.locationOffset.column > 0 || En(
      !1,
      "column in locationOffset is 1-indexed and must be positive."
    );
  }
  get [Symbol.toStringTag]() {
    return "Source";
  }
}
function zf(r) {
  return Wf(r, uu);
}
function Kf(r, e) {
  return new Gf(r, e).parseDocument();
}
class Gf {
  constructor(e, t = {}) {
    const n = zf(e) ? e : new uu(e);
    this._lexer = new Af(n), this._options = t, this._tokenCounter = 0;
  }
  /**
   * Converts a name lex token into a name parse node.
   */
  parseName() {
    const e = this.expectToken(N.NAME);
    return this.node(e, {
      kind: B.NAME,
      value: e.value
    });
  }
  // Implements the parsing rules in the Document section.
  /**
   * Document : Definition+
   */
  parseDocument() {
    return this.node(this._lexer.token, {
      kind: B.DOCUMENT,
      definitions: this.many(
        N.SOF,
        this.parseDefinition,
        N.EOF
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
    if (this.peek(N.BRACE_L))
      return this.parseOperationDefinition();
    const e = this.peekDescription(), t = e ? this._lexer.lookahead() : this._lexer.token;
    if (t.kind === N.NAME) {
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
        throw Te(
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
    if (this.peek(N.BRACE_L))
      return this.node(e, {
        kind: B.OPERATION_DEFINITION,
        operation: Xt.QUERY,
        name: void 0,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet()
      });
    const t = this.parseOperationType();
    let n;
    return this.peek(N.NAME) && (n = this.parseName()), this.node(e, {
      kind: B.OPERATION_DEFINITION,
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
    const e = this.expectToken(N.NAME);
    switch (e.value) {
      case "query":
        return Xt.QUERY;
      case "mutation":
        return Xt.MUTATION;
      case "subscription":
        return Xt.SUBSCRIPTION;
    }
    throw this.unexpected(e);
  }
  /**
   * VariableDefinitions : ( VariableDefinition+ )
   */
  parseVariableDefinitions() {
    return this.optionalMany(
      N.PAREN_L,
      this.parseVariableDefinition,
      N.PAREN_R
    );
  }
  /**
   * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
   */
  parseVariableDefinition() {
    return this.node(this._lexer.token, {
      kind: B.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type: (this.expectToken(N.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(N.EQUALS) ? this.parseConstValueLiteral() : void 0,
      directives: this.parseConstDirectives()
    });
  }
  /**
   * Variable : $ Name
   */
  parseVariable() {
    const e = this._lexer.token;
    return this.expectToken(N.DOLLAR), this.node(e, {
      kind: B.VARIABLE,
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
      kind: B.SELECTION_SET,
      selections: this.many(
        N.BRACE_L,
        this.parseSelection,
        N.BRACE_R
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
    return this.peek(N.SPREAD) ? this.parseFragment() : this.parseField();
  }
  /**
   * Field : Alias? Name Arguments? Directives? SelectionSet?
   *
   * Alias : Name :
   */
  parseField() {
    const e = this._lexer.token, t = this.parseName();
    let n, i;
    return this.expectOptionalToken(N.COLON) ? (n = t, i = this.parseName()) : i = t, this.node(e, {
      kind: B.FIELD,
      alias: n,
      name: i,
      arguments: this.parseArguments(!1),
      directives: this.parseDirectives(!1),
      selectionSet: this.peek(N.BRACE_L) ? this.parseSelectionSet() : void 0
    });
  }
  /**
   * Arguments[Const] : ( Argument[?Const]+ )
   */
  parseArguments(e) {
    const t = e ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(N.PAREN_L, t, N.PAREN_R);
  }
  /**
   * Argument[Const] : Name : Value[?Const]
   */
  parseArgument(e = !1) {
    const t = this._lexer.token, n = this.parseName();
    return this.expectToken(N.COLON), this.node(t, {
      kind: B.ARGUMENT,
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
    this.expectToken(N.SPREAD);
    const t = this.expectOptionalKeyword("on");
    return !t && this.peek(N.NAME) ? this.node(e, {
      kind: B.FRAGMENT_SPREAD,
      name: this.parseFragmentName(),
      directives: this.parseDirectives(!1)
    }) : this.node(e, {
      kind: B.INLINE_FRAGMENT,
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
      kind: B.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      variableDefinitions: this.parseVariableDefinitions(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    }) : this.node(e, {
      kind: B.FRAGMENT_DEFINITION,
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
      case N.BRACKET_L:
        return this.parseList(e);
      case N.BRACE_L:
        return this.parseObject(e);
      case N.INT:
        return this.advanceLexer(), this.node(t, {
          kind: B.INT,
          value: t.value
        });
      case N.FLOAT:
        return this.advanceLexer(), this.node(t, {
          kind: B.FLOAT,
          value: t.value
        });
      case N.STRING:
      case N.BLOCK_STRING:
        return this.parseStringLiteral();
      case N.NAME:
        switch (this.advanceLexer(), t.value) {
          case "true":
            return this.node(t, {
              kind: B.BOOLEAN,
              value: !0
            });
          case "false":
            return this.node(t, {
              kind: B.BOOLEAN,
              value: !1
            });
          case "null":
            return this.node(t, {
              kind: B.NULL
            });
          default:
            return this.node(t, {
              kind: B.ENUM,
              value: t.value
            });
        }
      case N.DOLLAR:
        if (e)
          if (this.expectToken(N.DOLLAR), this._lexer.token.kind === N.NAME) {
            const n = this._lexer.token.value;
            throw Te(
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
      kind: B.STRING,
      value: e.value,
      block: e.kind === N.BLOCK_STRING
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
      kind: B.LIST,
      values: this.any(N.BRACKET_L, t, N.BRACKET_R)
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
      kind: B.OBJECT,
      fields: this.any(N.BRACE_L, t, N.BRACE_R)
    });
  }
  /**
   * ObjectField[Const] : Name : Value[?Const]
   */
  parseObjectField(e) {
    const t = this._lexer.token, n = this.parseName();
    return this.expectToken(N.COLON), this.node(t, {
      kind: B.OBJECT_FIELD,
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
    for (; this.peek(N.AT); )
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
    return this.expectToken(N.AT), this.node(t, {
      kind: B.DIRECTIVE,
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
    if (this.expectOptionalToken(N.BRACKET_L)) {
      const n = this.parseTypeReference();
      this.expectToken(N.BRACKET_R), t = this.node(e, {
        kind: B.LIST_TYPE,
        type: n
      });
    } else
      t = this.parseNamedType();
    return this.expectOptionalToken(N.BANG) ? this.node(e, {
      kind: B.NON_NULL_TYPE,
      type: t
    }) : t;
  }
  /**
   * NamedType : Name
   */
  parseNamedType() {
    return this.node(this._lexer.token, {
      kind: B.NAMED_TYPE,
      name: this.parseName()
    });
  }
  // Implements the parsing rules in the Type Definition section.
  peekDescription() {
    return this.peek(N.STRING) || this.peek(N.BLOCK_STRING);
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
      N.BRACE_L,
      this.parseOperationTypeDefinition,
      N.BRACE_R
    );
    return this.node(e, {
      kind: B.SCHEMA_DEFINITION,
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
    this.expectToken(N.COLON);
    const n = this.parseNamedType();
    return this.node(e, {
      kind: B.OPERATION_TYPE_DEFINITION,
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
      kind: B.SCALAR_TYPE_DEFINITION,
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
      kind: B.OBJECT_TYPE_DEFINITION,
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
    return this.expectOptionalKeyword("implements") ? this.delimitedMany(N.AMP, this.parseNamedType) : [];
  }
  /**
   * ```
   * FieldsDefinition : { FieldDefinition+ }
   * ```
   */
  parseFieldsDefinition() {
    return this.optionalMany(
      N.BRACE_L,
      this.parseFieldDefinition,
      N.BRACE_R
    );
  }
  /**
   * FieldDefinition :
   *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
   */
  parseFieldDefinition() {
    const e = this._lexer.token, t = this.parseDescription(), n = this.parseName(), i = this.parseArgumentDefs();
    this.expectToken(N.COLON);
    const s = this.parseTypeReference(), o = this.parseConstDirectives();
    return this.node(e, {
      kind: B.FIELD_DEFINITION,
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
      N.PAREN_L,
      this.parseInputValueDef,
      N.PAREN_R
    );
  }
  /**
   * InputValueDefinition :
   *   - Description? Name : Type DefaultValue? Directives[Const]?
   */
  parseInputValueDef() {
    const e = this._lexer.token, t = this.parseDescription(), n = this.parseName();
    this.expectToken(N.COLON);
    const i = this.parseTypeReference();
    let s;
    this.expectOptionalToken(N.EQUALS) && (s = this.parseConstValueLiteral());
    const o = this.parseConstDirectives();
    return this.node(e, {
      kind: B.INPUT_VALUE_DEFINITION,
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
      kind: B.INTERFACE_TYPE_DEFINITION,
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
      kind: B.UNION_TYPE_DEFINITION,
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
    return this.expectOptionalToken(N.EQUALS) ? this.delimitedMany(N.PIPE, this.parseNamedType) : [];
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
      kind: B.ENUM_TYPE_DEFINITION,
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
      N.BRACE_L,
      this.parseEnumValueDefinition,
      N.BRACE_R
    );
  }
  /**
   * EnumValueDefinition : Description? EnumValue Directives[Const]?
   */
  parseEnumValueDefinition() {
    const e = this._lexer.token, t = this.parseDescription(), n = this.parseEnumValueName(), i = this.parseConstDirectives();
    return this.node(e, {
      kind: B.ENUM_VALUE_DEFINITION,
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
      throw Te(
        this._lexer.source,
        this._lexer.token.start,
        `${dn(
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
      kind: B.INPUT_OBJECT_TYPE_DEFINITION,
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
      N.BRACE_L,
      this.parseInputValueDef,
      N.BRACE_R
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
    if (e.kind === N.NAME)
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
      N.BRACE_L,
      this.parseOperationTypeDefinition,
      N.BRACE_R
    );
    if (t.length === 0 && n.length === 0)
      throw this.unexpected();
    return this.node(e, {
      kind: B.SCHEMA_EXTENSION,
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
      kind: B.SCALAR_TYPE_EXTENSION,
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
      kind: B.OBJECT_TYPE_EXTENSION,
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
      kind: B.INTERFACE_TYPE_EXTENSION,
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
      kind: B.UNION_TYPE_EXTENSION,
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
      kind: B.ENUM_TYPE_EXTENSION,
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
      kind: B.INPUT_OBJECT_TYPE_EXTENSION,
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
    this.expectKeyword("directive"), this.expectToken(N.AT);
    const n = this.parseName(), i = this.parseArgumentDefs(), s = this.expectOptionalKeyword("repeatable");
    this.expectKeyword("on");
    const o = this.parseDirectiveLocations();
    return this.node(e, {
      kind: B.DIRECTIVE_DEFINITION,
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
    return this.delimitedMany(N.PIPE, this.parseDirectiveLocation);
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
    if (Object.prototype.hasOwnProperty.call(Bi, t.value))
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
    return this._options.noLocation !== !0 && (t.loc = new _f(
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
    throw Te(
      this._lexer.source,
      t.start,
      `Expected ${cu(e)}, found ${dn(t)}.`
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
    if (t.kind === N.NAME && t.value === e)
      this.advanceLexer();
    else
      throw Te(
        this._lexer.source,
        t.start,
        `Expected "${e}", found ${dn(t)}.`
      );
  }
  /**
   * If the next token is a given keyword, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */
  expectOptionalKeyword(e) {
    const t = this._lexer.token;
    return t.kind === N.NAME && t.value === e ? (this.advanceLexer(), !0) : !1;
  }
  /**
   * Helper function for creating an error when an unexpected lexed token is encountered.
   */
  unexpected(e) {
    const t = e != null ? e : this._lexer.token;
    return Te(
      this._lexer.source,
      t.start,
      `Unexpected ${dn(t)}.`
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
    if (e !== void 0 && t.kind !== N.EOF && (++this._tokenCounter, this._tokenCounter > e))
      throw Te(
        this._lexer.source,
        t.start,
        `Document contains more that ${e} tokens. Parsing aborted.`
      );
  }
}
function dn(r) {
  const e = r.value;
  return cu(r.kind) + (e != null ? ` "${e}"` : "");
}
function cu(r) {
  return Of(r) ? `"${r}"` : r;
}
function Jf(r) {
  return `"${r.replace(Yf, Xf)}"`;
}
const Yf = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
function Xf(r) {
  return Zf[r.charCodeAt(0)];
}
const Zf = [
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
], ds = Object.freeze({});
function yt(r, e, t = ru) {
  const n = /* @__PURE__ */ new Map();
  for (const b of Object.values(B))
    n.set(b, eh(e, b));
  let i, s = Array.isArray(r), o = [r], a = -1, u = [], f = r, c, d;
  const p = [], y = [];
  do {
    a++;
    const b = a === o.length, k = b && u.length !== 0;
    if (b) {
      if (c = y.length === 0 ? void 0 : p[p.length - 1], f = d, d = y.pop(), k)
        if (s) {
          f = f.slice();
          let A = 0;
          for (const [O, R] of u) {
            const D = O - A;
            R === null ? (f.splice(D, 1), A++) : f[D] = R;
          }
        } else {
          f = Object.defineProperties(
            {},
            Object.getOwnPropertyDescriptors(f)
          );
          for (const [A, O] of u)
            f[A] = O;
        }
      a = i.index, o = i.keys, u = i.edits, s = i.inArray, i = i.prev;
    } else if (d) {
      if (c = s ? a : o[a], f = d[c], f == null)
        continue;
      p.push(c);
    }
    let S;
    if (!Array.isArray(f)) {
      var v, w;
      bo(f) || En(!1, `Invalid AST Node: ${ps(f)}.`);
      const A = b ? (v = n.get(f.kind)) === null || v === void 0 ? void 0 : v.leave : (w = n.get(f.kind)) === null || w === void 0 ? void 0 : w.enter;
      if (S = A == null ? void 0 : A.call(e, f, c, d, p, y), S === ds)
        break;
      if (S === !1) {
        if (!b) {
          p.pop();
          continue;
        }
      } else if (S !== void 0 && (u.push([c, S]), !b))
        if (bo(S))
          f = S;
        else {
          p.pop();
          continue;
        }
    }
    if (S === void 0 && k && u.push([c, f]), b)
      p.pop();
    else {
      var E;
      i = {
        inArray: s,
        index: a,
        keys: o,
        edits: u,
        prev: i
      }, s = Array.isArray(f), o = s ? f : (E = t[f.kind]) !== null && E !== void 0 ? E : [], a = -1, u = [], d && y.push(d), d = f;
    }
  } while (i !== void 0);
  return u.length !== 0 ? u[u.length - 1][1] : r;
}
function eh(r, e) {
  const t = r[e];
  return typeof t == "object" ? t : typeof t == "function" ? {
    enter: t,
    leave: void 0
  } : {
    enter: r.enter,
    leave: r.leave
  };
}
function lu(r) {
  return yt(r, rh);
}
const th = 80, rh = {
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
      const e = G("(", $(r.variableDefinitions, ", "), ")"), t = $(
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
    leave: ({ variable: r, type: e, defaultValue: t, directives: n }) => r + ": " + e + G(" = ", t) + G(" ", $(n, " "))
  },
  SelectionSet: {
    leave: ({ selections: r }) => Ke(r)
  },
  Field: {
    leave({ alias: r, name: e, arguments: t, directives: n, selectionSet: i }) {
      const s = G("", r, ": ") + e;
      let o = s + G("(", $(t, ", "), ")");
      return o.length > th && (o = s + G(`(
`, _n($(t, `
`)), `
)`)), $([o, $(n, " "), i], " ");
    }
  },
  Argument: {
    leave: ({ name: r, value: e }) => r + ": " + e
  },
  // Fragments
  FragmentSpread: {
    leave: ({ name: r, directives: e }) => "..." + r + G(" ", $(e, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition: r, directives: e, selectionSet: t }) => $(
      [
        "...",
        G("on ", r),
        $(e, " "),
        t
      ],
      " "
    )
  },
  FragmentDefinition: {
    leave: ({ name: r, typeCondition: e, variableDefinitions: t, directives: n, selectionSet: i }) => (
      // or removed in the future.
      `fragment ${r}${G("(", $(t, ", "), ")")} on ${e} ${G("", $(n, " "), " ")}` + i
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
    leave: ({ value: r, block: e }) => e ? If(r) : Jf(r)
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
    leave: ({ name: r, arguments: e }) => "@" + r + G("(", $(e, ", "), ")")
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
    leave: ({ description: r, directives: e, operationTypes: t }) => G("", r, `
`) + $(["schema", $(e, " "), Ke(t)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation: r, type: e }) => r + ": " + e
  },
  ScalarTypeDefinition: {
    leave: ({ description: r, name: e, directives: t }) => G("", r, `
`) + $(["scalar", e, $(t, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ description: r, name: e, interfaces: t, directives: n, fields: i }) => G("", r, `
`) + $(
      [
        "type",
        e,
        G("implements ", $(t, " & ")),
        $(n, " "),
        Ke(i)
      ],
      " "
    )
  },
  FieldDefinition: {
    leave: ({ description: r, name: e, arguments: t, type: n, directives: i }) => G("", r, `
`) + e + (Eo(t) ? G(`(
`, _n($(t, `
`)), `
)`) : G("(", $(t, ", "), ")")) + ": " + n + G(" ", $(i, " "))
  },
  InputValueDefinition: {
    leave: ({ description: r, name: e, type: t, defaultValue: n, directives: i }) => G("", r, `
`) + $(
      [e + ": " + t, G("= ", n), $(i, " ")],
      " "
    )
  },
  InterfaceTypeDefinition: {
    leave: ({ description: r, name: e, interfaces: t, directives: n, fields: i }) => G("", r, `
`) + $(
      [
        "interface",
        e,
        G("implements ", $(t, " & ")),
        $(n, " "),
        Ke(i)
      ],
      " "
    )
  },
  UnionTypeDefinition: {
    leave: ({ description: r, name: e, directives: t, types: n }) => G("", r, `
`) + $(
      ["union", e, $(t, " "), G("= ", $(n, " | "))],
      " "
    )
  },
  EnumTypeDefinition: {
    leave: ({ description: r, name: e, directives: t, values: n }) => G("", r, `
`) + $(["enum", e, $(t, " "), Ke(n)], " ")
  },
  EnumValueDefinition: {
    leave: ({ description: r, name: e, directives: t }) => G("", r, `
`) + $([e, $(t, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ description: r, name: e, directives: t, fields: n }) => G("", r, `
`) + $(["input", e, $(t, " "), Ke(n)], " ")
  },
  DirectiveDefinition: {
    leave: ({ description: r, name: e, arguments: t, repeatable: n, locations: i }) => G("", r, `
`) + "directive @" + e + (Eo(t) ? G(`(
`, _n($(t, `
`)), `
)`) : G("(", $(t, ", "), ")")) + (n ? " repeatable" : "") + " on " + $(i, " | ")
  },
  SchemaExtension: {
    leave: ({ directives: r, operationTypes: e }) => $(
      ["extend schema", $(r, " "), Ke(e)],
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
        G("implements ", $(e, " & ")),
        $(t, " "),
        Ke(n)
      ],
      " "
    )
  },
  InterfaceTypeExtension: {
    leave: ({ name: r, interfaces: e, directives: t, fields: n }) => $(
      [
        "extend interface",
        r,
        G("implements ", $(e, " & ")),
        $(t, " "),
        Ke(n)
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
        G("= ", $(t, " | "))
      ],
      " "
    )
  },
  EnumTypeExtension: {
    leave: ({ name: r, directives: e, values: t }) => $(["extend enum", r, $(e, " "), Ke(t)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name: r, directives: e, fields: t }) => $(["extend input", r, $(e, " "), Ke(t)], " ")
  }
};
function $(r, e = "") {
  var t;
  return (t = r == null ? void 0 : r.filter((n) => n).join(e)) !== null && t !== void 0 ? t : "";
}
function Ke(r) {
  return G(`{
`, _n($(r, `
`)), `
}`);
}
function G(r, e, t = "") {
  return e != null && e !== "" ? r + e + t : "";
}
function _n(r) {
  return G("  ", r.replace(/\n/g, `
  `));
}
function Eo(r) {
  var e;
  return (e = r == null ? void 0 : r.some((t) => t.includes(`
`))) !== null && e !== void 0 ? e : !1;
}
function _o(r) {
  return r.kind === B.FIELD || r.kind === B.FRAGMENT_SPREAD || r.kind === B.INLINE_FRAGMENT;
}
function tn(r, e) {
  var t = r.directives;
  return !t || !t.length ? !0 : sh(t).every(function(n) {
    var i = n.directive, s = n.ifArgument, o = !1;
    return s.value.kind === "Variable" ? (o = e && e[s.value.name.value], j(o !== void 0, 70, i.name.value)) : o = s.value.value, i.name.value === "skip" ? !o : o;
  });
}
function Wr(r, e, t) {
  var n = new Set(r), i = n.size;
  return yt(e, {
    Directive: function(s) {
      if (n.delete(s.name.value) && (!t || !n.size))
        return ds;
    }
  }), t ? !n.size : n.size < i;
}
function nh(r) {
  return r && Wr(["client", "export"], r, !0);
}
function ih(r) {
  var e = r.name.value;
  return e === "skip" || e === "include";
}
function sh(r) {
  var e = [];
  return r && r.length && r.forEach(function(t) {
    if (ih(t)) {
      var n = t.arguments, i = t.name.value;
      j(n && n.length === 1, 71, i);
      var s = n[0];
      j(s.name && s.name.value === "if", 72, i);
      var o = s.value;
      j(o && (o.kind === "Variable" || o.kind === "BooleanValue"), 73, i), e.push({ directive: t, ifArgument: s });
    }
  }), e;
}
const oh = () => /* @__PURE__ */ Object.create(null), { forEach: ah, slice: So } = Array.prototype, { hasOwnProperty: uh } = Object.prototype;
let dr = class fu {
  constructor(e = !0, t = oh) {
    this.weakness = e, this.makeData = t;
  }
  lookup() {
    return this.lookupArray(arguments);
  }
  lookupArray(e) {
    let t = this;
    return ah.call(e, (n) => t = t.getChildTrie(n)), uh.call(t, "data") ? t.data : t.data = this.makeData(So.call(e));
  }
  peek() {
    return this.peekArray(arguments);
  }
  peekArray(e) {
    let t = this;
    for (let n = 0, i = e.length; t && n < i; ++n) {
      const s = t.mapFor(e[n], !1);
      t = s && s.get(e[n]);
    }
    return t && t.data;
  }
  remove() {
    return this.removeArray(arguments);
  }
  removeArray(e) {
    let t;
    if (e.length) {
      const n = e[0], i = this.mapFor(n, !1), s = i && i.get(n);
      s && (t = s.removeArray(So.call(e, 1)), !s.data && !s.weak && !(s.strong && s.strong.size) && i.delete(n));
    } else
      t = this.data, delete this.data;
    return t;
  }
  getChildTrie(e) {
    const t = this.mapFor(e, !0);
    let n = t.get(e);
    return n || t.set(e, n = new fu(this.weakness, this.makeData)), n;
  }
  mapFor(e, t) {
    return this.weakness && ch(e) ? this.weak || (t ? this.weak = /* @__PURE__ */ new WeakMap() : void 0) : this.strong || (t ? this.strong = /* @__PURE__ */ new Map() : void 0);
  }
};
function ch(r) {
  switch (typeof r) {
    case "object":
      if (r === null)
        break;
    case "function":
      return !0;
  }
  return !1;
}
var lh = Ye(function() {
  return navigator.product;
}) == "ReactNative", yr = typeof WeakMap == "function" && !(lh && !Tt.HermesInternal), hu = typeof WeakSet == "function", pu = typeof Symbol == "function" && typeof Symbol.for == "function", Qn = pu && Symbol.asyncIterator;
Ye(function() {
  return window.document.createElement;
});
Ye(function() {
  return navigator.userAgent.indexOf("jsdom") >= 0;
});
function fe(r) {
  return r !== null && typeof r == "object";
}
function fh(r, e) {
  var t = e, n = [];
  r.definitions.forEach(function(s) {
    if (s.kind === "OperationDefinition")
      throw Fe(
        74,
        s.operation,
        s.name ? " named '".concat(s.name.value, "'") : ""
      );
    s.kind === "FragmentDefinition" && n.push(s);
  }), typeof t == "undefined" && (j(n.length === 1, 75, n.length), t = n[0].name.value);
  var i = x(x({}, r), { definitions: Pe([
    {
      kind: "OperationDefinition",
      // OperationTypeNode is an enum
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
function Vn(r) {
  r === void 0 && (r = []);
  var e = {};
  return r.forEach(function(t) {
    e[t.name.value] = t;
  }), e;
}
function Hn(r, e) {
  switch (r.kind) {
    case "InlineFragment":
      return r;
    case "FragmentSpread": {
      var t = r.name.value;
      if (typeof e == "function")
        return e(t);
      var n = e && e[t];
      return j(n, 76, t), n || null;
    }
    default:
      return null;
  }
}
function hh() {
}
class Pi {
  constructor(e = 1 / 0, t = hh) {
    this.max = e, this.dispose = t, this.map = /* @__PURE__ */ new Map(), this.newest = null, this.oldest = null;
  }
  has(e) {
    return this.map.has(e);
  }
  get(e) {
    const t = this.getNode(e);
    return t && t.value;
  }
  get size() {
    return this.map.size;
  }
  getNode(e) {
    const t = this.map.get(e);
    if (t && t !== this.newest) {
      const { older: n, newer: i } = t;
      i && (i.older = n), n && (n.newer = i), t.older = this.newest, t.older.newer = t, t.newer = null, this.newest = t, t === this.oldest && (this.oldest = i);
    }
    return t;
  }
  set(e, t) {
    let n = this.getNode(e);
    return n ? n.value = t : (n = {
      key: e,
      value: t,
      newer: null,
      older: this.newest
    }, this.newest && (this.newest.newer = n), this.newest = n, this.oldest = this.oldest || n, this.map.set(e, n), n.value);
  }
  clean() {
    for (; this.oldest && this.map.size > this.max; )
      this.delete(this.oldest.key);
  }
  delete(e) {
    const t = this.map.get(e);
    return t ? (t === this.newest && (this.newest = t.older), t === this.oldest && (this.oldest = t.newer), t.newer && (t.newer.older = t.older), t.older && (t.older.newer = t.newer), this.map.delete(e), this.dispose(t.value, e), !0) : !1;
  }
}
function Li() {
}
const ph = Li, dh = typeof WeakRef != "undefined" ? WeakRef : function(r) {
  return { deref: () => r };
}, yh = typeof WeakMap != "undefined" ? WeakMap : Map, mh = typeof FinalizationRegistry != "undefined" ? FinalizationRegistry : function() {
  return {
    register: Li,
    unregister: Li
  };
}, gh = 10024;
class Dn {
  constructor(e = 1 / 0, t = ph) {
    this.max = e, this.dispose = t, this.map = new yh(), this.newest = null, this.oldest = null, this.unfinalizedNodes = /* @__PURE__ */ new Set(), this.finalizationScheduled = !1, this.size = 0, this.finalize = () => {
      const n = this.unfinalizedNodes.values();
      for (let i = 0; i < gh; i++) {
        const s = n.next().value;
        if (!s)
          break;
        this.unfinalizedNodes.delete(s);
        const o = s.key;
        delete s.key, s.keyRef = new dh(o), this.registry.register(o, s, s);
      }
      this.unfinalizedNodes.size > 0 ? queueMicrotask(this.finalize) : this.finalizationScheduled = !1;
    }, this.registry = new mh(this.deleteNode.bind(this));
  }
  has(e) {
    return this.map.has(e);
  }
  get(e) {
    const t = this.getNode(e);
    return t && t.value;
  }
  getNode(e) {
    const t = this.map.get(e);
    if (t && t !== this.newest) {
      const { older: n, newer: i } = t;
      i && (i.older = n), n && (n.newer = i), t.older = this.newest, t.older.newer = t, t.newer = null, this.newest = t, t === this.oldest && (this.oldest = i);
    }
    return t;
  }
  set(e, t) {
    let n = this.getNode(e);
    return n ? n.value = t : (n = {
      key: e,
      value: t,
      newer: null,
      older: this.newest
    }, this.newest && (this.newest.newer = n), this.newest = n, this.oldest = this.oldest || n, this.scheduleFinalization(n), this.map.set(e, n), this.size++, n.value);
  }
  clean() {
    for (; this.oldest && this.size > this.max; )
      this.deleteNode(this.oldest);
  }
  deleteNode(e) {
    e === this.newest && (this.newest = e.older), e === this.oldest && (this.oldest = e.newer), e.newer && (e.newer.older = e.older), e.older && (e.older.newer = e.newer), this.size--;
    const t = e.key || e.keyRef && e.keyRef.deref();
    this.dispose(e.value, t), e.keyRef ? this.registry.unregister(e) : this.unfinalizedNodes.delete(e), t && this.map.delete(t);
  }
  delete(e) {
    const t = this.map.get(e);
    return t ? (this.deleteNode(t), !0) : !1;
  }
  scheduleFinalization(e) {
    this.unfinalizedNodes.add(e), this.finalizationScheduled || (this.finalizationScheduled = !0, queueMicrotask(this.finalize));
  }
}
var hi = /* @__PURE__ */ new WeakSet();
function du(r) {
  r.size <= (r.max || -1) || hi.has(r) || (hi.add(r), setTimeout(function() {
    r.clean(), hi.delete(r);
  }, 100));
}
var yu = function(r, e) {
  var t = new Dn(r, e);
  return t.set = function(n, i) {
    var s = Dn.prototype.set.call(this, n, i);
    return du(this), s;
  }, t;
}, vh = function(r, e) {
  var t = new Pi(r, e);
  return t.set = function(n, i) {
    var s = Pi.prototype.set.call(this, n, i);
    return du(this), s;
  }, t;
}, bh = Symbol.for("apollo.cacheSize"), mt = x({}, Di[bh]), $t = {};
function mu(r, e) {
  $t[r] = e;
}
var wh = globalThis.__DEV__ !== !1 ? kh : void 0, Eh = globalThis.__DEV__ !== !1 ? xh : void 0, _h = globalThis.__DEV__ !== !1 ? gu : void 0;
function Sh() {
  var r = {
    parser: 1e3,
    canonicalStringify: 1e3,
    print: 2e3,
    "documentTransform.cache": 2e3,
    "queryManager.getDocumentInfo": 2e3,
    "PersistedQueryLink.persistedQueryHashes": 2e3,
    "fragmentRegistry.transform": 2e3,
    "fragmentRegistry.lookup": 1e3,
    "fragmentRegistry.findFragmentSpreads": 4e3,
    "cache.fragmentQueryDocuments": 1e3,
    "removeTypenameFromVariables.getVariableDefinitions": 2e3,
    "inMemoryCache.maybeBroadcastWatch": 5e3,
    "inMemoryCache.executeSelectionSet": 5e4,
    "inMemoryCache.executeSubSelectedArray": 1e4
  };
  return Object.fromEntries(Object.entries(r).map(function(e) {
    var t = e[0], n = e[1];
    return [
      t,
      mt[t] || n
    ];
  }));
}
function kh() {
  var r, e, t, n, i;
  if (globalThis.__DEV__ === !1)
    throw new Error("only supported in development mode");
  return {
    limits: Sh(),
    sizes: x({ print: (r = $t.print) === null || r === void 0 ? void 0 : r.call($t), parser: (e = $t.parser) === null || e === void 0 ? void 0 : e.call($t), canonicalStringify: (t = $t.canonicalStringify) === null || t === void 0 ? void 0 : t.call($t), links: qi(this.link), queryManager: {
      getDocumentInfo: this.queryManager.transformCache.size,
      documentTransforms: bu(this.queryManager.documentTransform)
    } }, (i = (n = this.cache).getMemoryInternals) === null || i === void 0 ? void 0 : i.call(n))
  };
}
function gu() {
  return {
    cache: {
      fragmentQueryDocuments: _t(this.getFragmentDoc)
    }
  };
}
function xh() {
  var r = this.config.fragments;
  return x(x({}, gu.apply(this)), { addTypenameDocumentTransform: bu(this.addTypenameTransform), inMemoryCache: {
    executeSelectionSet: _t(this.storeReader.executeSelectionSet),
    executeSubSelectedArray: _t(this.storeReader.executeSubSelectedArray),
    maybeBroadcastWatch: _t(this.maybeBroadcastWatch)
  }, fragmentRegistry: {
    findFragmentSpreads: _t(r == null ? void 0 : r.findFragmentSpreads),
    lookup: _t(r == null ? void 0 : r.lookup),
    transform: _t(r == null ? void 0 : r.transform)
  } });
}
function Th(r) {
  return !!r && "dirtyKey" in r;
}
function _t(r) {
  return Th(r) ? r.size : void 0;
}
function vu(r) {
  return r != null;
}
function bu(r) {
  return Ui(r).map(function(e) {
    return { cache: e };
  });
}
function Ui(r) {
  return r ? Pe(Pe([
    _t(r == null ? void 0 : r.performWork)
  ], Ui(r == null ? void 0 : r.left), !0), Ui(r == null ? void 0 : r.right), !0).filter(vu) : [];
}
function qi(r) {
  var e;
  return r ? Pe(Pe([
    (e = r == null ? void 0 : r.getMemoryInternals) === null || e === void 0 ? void 0 : e.call(r)
  ], qi(r == null ? void 0 : r.left), !0), qi(r == null ? void 0 : r.right), !0).filter(vu) : [];
}
var It = Object.assign(function(e) {
  return JSON.stringify(e, Ih);
}, {
  reset: function() {
    Zt = new vh(
      mt.canonicalStringify || 1e3
      /* defaultCacheSizes.canonicalStringify */
    );
  }
});
globalThis.__DEV__ !== !1 && mu("canonicalStringify", function() {
  return Zt.size;
});
var Zt;
It.reset();
function Ih(r, e) {
  if (e && typeof e == "object") {
    var t = Object.getPrototypeOf(e);
    if (t === Object.prototype || t === null) {
      var n = Object.keys(e);
      if (n.every(Ah))
        return e;
      var i = JSON.stringify(n), s = Zt.get(i);
      if (!s) {
        n.sort();
        var o = JSON.stringify(n);
        s = Zt.get(o) || n, Zt.set(i, s), Zt.set(o, s);
      }
      var a = Object.create(t);
      return s.forEach(function(u) {
        a[u] = e[u];
      }), a;
    }
  }
  return e;
}
function Ah(r, e, t) {
  return e === 0 || t[e - 1] <= r;
}
function nr(r) {
  return { __ref: String(r) };
}
function Z(r) {
  return !!(r && typeof r == "object" && typeof r.__ref == "string");
}
function Oh(r) {
  return fe(r) && r.kind === "Document" && Array.isArray(r.definitions);
}
function Ch(r) {
  return r.kind === "StringValue";
}
function Rh(r) {
  return r.kind === "BooleanValue";
}
function Nh(r) {
  return r.kind === "IntValue";
}
function Dh(r) {
  return r.kind === "FloatValue";
}
function Fh(r) {
  return r.kind === "Variable";
}
function Mh(r) {
  return r.kind === "ObjectValue";
}
function Bh(r) {
  return r.kind === "ListValue";
}
function $h(r) {
  return r.kind === "EnumValue";
}
function Ph(r) {
  return r.kind === "NullValue";
}
function ur(r, e, t, n) {
  if (Nh(t) || Dh(t))
    r[e.value] = Number(t.value);
  else if (Rh(t) || Ch(t))
    r[e.value] = t.value;
  else if (Mh(t)) {
    var i = {};
    t.fields.map(function(o) {
      return ur(i, o.name, o.value, n);
    }), r[e.value] = i;
  } else if (Fh(t)) {
    var s = (n || {})[t.name.value];
    r[e.value] = s;
  } else if (Bh(t))
    r[e.value] = t.values.map(function(o) {
      var a = {};
      return ur(a, e, o, n), a[e.value];
    });
  else if ($h(t))
    r[e.value] = t.value;
  else if (Ph(t))
    r[e.value] = null;
  else
    throw Fe(85, e.value, t.kind);
}
function Lh(r, e) {
  var t = null;
  r.directives && (t = {}, r.directives.forEach(function(i) {
    t[i.name.value] = {}, i.arguments && i.arguments.forEach(function(s) {
      var o = s.name, a = s.value;
      return ur(t[i.name.value], o, a, e);
    });
  }));
  var n = null;
  return r.arguments && r.arguments.length && (n = {}, r.arguments.forEach(function(i) {
    var s = i.name, o = i.value;
    return ur(n, s, o, e);
  })), wu(r.name.value, n, t);
}
var Uh = [
  "connection",
  "include",
  "skip",
  "client",
  "rest",
  "export",
  "nonreactive"
], Ir = It, wu = Object.assign(function(r, e, t) {
  if (e && t && t.connection && t.connection.key)
    if (t.connection.filter && t.connection.filter.length > 0) {
      var n = t.connection.filter ? t.connection.filter : [];
      n.sort();
      var i = {};
      return n.forEach(function(a) {
        i[a] = e[a];
      }), "".concat(t.connection.key, "(").concat(Ir(i), ")");
    } else
      return t.connection.key;
  var s = r;
  if (e) {
    var o = Ir(e);
    s += "(".concat(o, ")");
  }
  return t && Object.keys(t).forEach(function(a) {
    Uh.indexOf(a) === -1 && (t[a] && Object.keys(t[a]).length ? s += "@".concat(a, "(").concat(Ir(t[a]), ")") : s += "@".concat(a));
  }), s;
}, {
  setStringify: function(r) {
    var e = Ir;
    return Ir = r, e;
  }
});
function Wn(r, e) {
  if (r.arguments && r.arguments.length) {
    var t = {};
    return r.arguments.forEach(function(n) {
      var i = n.name, s = n.value;
      return ur(t, i, s, e);
    }), t;
  }
  return null;
}
function At(r) {
  return r.alias ? r.alias.value : r.name.value;
}
function ji(r, e, t) {
  for (var n, i = 0, s = e.selections; i < s.length; i++) {
    var o = s[i];
    if (Ot(o)) {
      if (o.name.value === "__typename")
        return r[At(o)];
    } else n ? n.push(o) : n = [o];
  }
  if (typeof r.__typename == "string")
    return r.__typename;
  if (n)
    for (var a = 0, u = n; a < u.length; a++) {
      var o = u[a], f = ji(r, Hn(o, t).selectionSet, t);
      if (typeof f == "string")
        return f;
    }
}
function Ot(r) {
  return r.kind === "Field";
}
function qh(r) {
  return r.kind === "InlineFragment";
}
function rn(r) {
  j(r && r.kind === "Document", 77);
  var e = r.definitions.filter(function(t) {
    return t.kind !== "FragmentDefinition";
  }).map(function(t) {
    if (t.kind !== "OperationDefinition")
      throw Fe(78, t.kind);
    return t;
  });
  return j(e.length <= 1, 79, e.length), r;
}
function nn(r) {
  return rn(r), r.definitions.filter(function(e) {
    return e.kind === "OperationDefinition";
  })[0];
}
function Qi(r) {
  return r.definitions.filter(function(e) {
    return e.kind === "OperationDefinition" && !!e.name;
  }).map(function(e) {
    return e.name.value;
  })[0] || null;
}
function zn(r) {
  return r.definitions.filter(function(e) {
    return e.kind === "FragmentDefinition";
  });
}
function Eu(r) {
  var e = nn(r);
  return j(e && e.operation === "query", 80), e;
}
function jh(r) {
  j(r.kind === "Document", 81), j(r.definitions.length <= 1, 82);
  var e = r.definitions[0];
  return j(e.kind === "FragmentDefinition", 83), e;
}
function mr(r) {
  rn(r);
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
  throw Fe(84);
}
function ys(r) {
  var e = /* @__PURE__ */ Object.create(null), t = r && r.variableDefinitions;
  return t && t.length && t.forEach(function(n) {
    n.defaultValue && ur(e, n.variable.name, n.defaultValue);
  }), e;
}
const Qh = () => /* @__PURE__ */ Object.create(null), { forEach: Vh, slice: Hh } = Array.prototype, { hasOwnProperty: Wh } = Object.prototype;
class ms {
  constructor(e = !0, t = Qh) {
    this.weakness = e, this.makeData = t;
  }
  lookup(...e) {
    return this.lookupArray(e);
  }
  lookupArray(e) {
    let t = this;
    return Vh.call(e, (n) => t = t.getChildTrie(n)), Wh.call(t, "data") ? t.data : t.data = this.makeData(Hh.call(e));
  }
  peek(...e) {
    return this.peekArray(e);
  }
  peekArray(e) {
    let t = this;
    for (let n = 0, i = e.length; t && n < i; ++n) {
      const s = this.weakness && ko(e[n]) ? t.weak : t.strong;
      t = s && s.get(e[n]);
    }
    return t && t.data;
  }
  getChildTrie(e) {
    const t = this.weakness && ko(e) ? this.weak || (this.weak = /* @__PURE__ */ new WeakMap()) : this.strong || (this.strong = /* @__PURE__ */ new Map());
    let n = t.get(e);
    return n || t.set(e, n = new ms(this.weakness, this.makeData)), n;
  }
}
function ko(r) {
  switch (typeof r) {
    case "object":
      if (r === null)
        break;
    case "function":
      return !0;
  }
  return !1;
}
let Ae = null;
const xo = {};
let zh = 1;
const Kh = () => class {
  constructor() {
    this.id = [
      "slot",
      zh++,
      Date.now(),
      Math.random().toString(36).slice(2)
    ].join(":");
  }
  hasValue() {
    for (let e = Ae; e; e = e.parent)
      if (this.id in e.slots) {
        const t = e.slots[this.id];
        if (t === xo)
          break;
        return e !== Ae && (Ae.slots[this.id] = t), !0;
      }
    return Ae && (Ae.slots[this.id] = xo), !1;
  }
  getValue() {
    if (this.hasValue())
      return Ae.slots[this.id];
  }
  withValue(e, t, n, i) {
    const s = {
      __proto__: null,
      [this.id]: e
    }, o = Ae;
    Ae = { parent: o, slots: s };
    try {
      return t.apply(i, n);
    } finally {
      Ae = o;
    }
  }
  // Capture the current context and wrap a callback function so that it
  // reestablishes the captured context when called.
  static bind(e) {
    const t = Ae;
    return function() {
      const n = Ae;
      try {
        return Ae = t, e.apply(this, arguments);
      } finally {
        Ae = n;
      }
    };
  }
  // Immediately run a callback function without any captured context.
  static noContext(e, t, n) {
    if (Ae) {
      const i = Ae;
      try {
        return Ae = null, e.apply(n, t);
      } finally {
        Ae = i;
      }
    } else
      return e.apply(n, t);
  }
};
function To(r) {
  try {
    return r();
  } catch (e) {
  }
}
const pi = "@wry/context:Slot", Gh = (
  // Prefer globalThis when available.
  // https://github.com/benjamn/wryware/issues/347
  To(() => globalThis) || // Fall back to global, which works in Node.js and may be converted by some
  // bundlers to the appropriate identifier (window, self, ...) depending on the
  // bundling target. https://github.com/endojs/endo/issues/576#issuecomment-1178515224
  To(() => Tt) || // Otherwise, use a dummy host that's local to this module. We used to fall
  // back to using the Array constructor as a namespace, but that was flagged in
  // https://github.com/benjamn/wryware/issues/347, and can be avoided.
  /* @__PURE__ */ Object.create(null)
), Io = Gh, _u = Io[pi] || // Earlier versions of this package stored the globalKey property on the Array
// constructor, so we check there as well, to prevent Slot class duplication.
Array[pi] || function(r) {
  try {
    Object.defineProperty(Io, pi, {
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
}(Kh()), Kn = new _u(), { hasOwnProperty: Jh } = Object.prototype, gs = Array.from || function(r) {
  const e = [];
  return r.forEach((t) => e.push(t)), e;
};
function vs(r) {
  const { unsubscribe: e } = r;
  typeof e == "function" && (r.unsubscribe = void 0, e());
}
const zr = [], Yh = 100;
function cr(r, e) {
  if (!r)
    throw new Error(e || "assertion failure");
}
function Su(r, e) {
  const t = r.length;
  return (
    // Unknown values are not equal to each other.
    t > 0 && // Both values must be ordinary (or both exceptional) to be equal.
    t === e.length && // The underlying value or exception must be the same.
    r[t - 1] === e[t - 1]
  );
}
function ku(r) {
  switch (r.length) {
    case 0:
      throw new Error("unknown value");
    case 1:
      return r[0];
    case 2:
      throw r[1];
  }
}
function xu(r) {
  return r.slice(0);
}
class Gn {
  constructor(e) {
    this.fn = e, this.parents = /* @__PURE__ */ new Set(), this.childValues = /* @__PURE__ */ new Map(), this.dirtyChildren = null, this.dirty = !0, this.recomputing = !1, this.value = [], this.deps = null, ++Gn.count;
  }
  peek() {
    if (this.value.length === 1 && !Ct(this))
      return Ao(this), this.value[0];
  }
  // This is the most important method of the Entry API, because it
  // determines whether the cached this.value can be returned immediately,
  // or must be recomputed. The overall performance of the caching system
  // depends on the truth of the following observations: (1) this.dirty is
  // usually false, (2) this.dirtyChildren is usually null/empty, and thus
  // (3) valueGet(this.value) is usually returned without recomputation.
  recompute(e) {
    return cr(!this.recomputing, "already recomputing"), Ao(this), Ct(this) ? Xh(this, e) : ku(this.value);
  }
  setDirty() {
    this.dirty || (this.dirty = !0, Tu(this), vs(this));
  }
  dispose() {
    this.setDirty(), Ru(this), bs(this, (e, t) => {
      e.setDirty(), Nu(e, this);
    });
  }
  forget() {
    this.dispose();
  }
  dependOn(e) {
    e.add(this), this.deps || (this.deps = zr.pop() || /* @__PURE__ */ new Set()), this.deps.add(e);
  }
  forgetDeps() {
    this.deps && (gs(this.deps).forEach((e) => e.delete(this)), this.deps.clear(), zr.push(this.deps), this.deps = null);
  }
}
Gn.count = 0;
function Ao(r) {
  const e = Kn.getValue();
  if (e)
    return r.parents.add(e), e.childValues.has(r) || e.childValues.set(r, []), Ct(r) ? Au(e, r) : Ou(e, r), e;
}
function Xh(r, e) {
  return Ru(r), Kn.withValue(r, Zh, [r, e]), tp(r, e) && ep(r), ku(r.value);
}
function Zh(r, e) {
  r.recomputing = !0;
  const { normalizeResult: t } = r;
  let n;
  t && r.value.length === 1 && (n = xu(r.value)), r.value.length = 0;
  try {
    if (r.value[0] = r.fn.apply(null, e), t && n && !Su(n, r.value))
      try {
        r.value[0] = t(r.value[0], n[0]);
      } catch (i) {
      }
  } catch (i) {
    r.value[1] = i;
  }
  r.recomputing = !1;
}
function Ct(r) {
  return r.dirty || !!(r.dirtyChildren && r.dirtyChildren.size);
}
function ep(r) {
  r.dirty = !1, !Ct(r) && Iu(r);
}
function Tu(r) {
  bs(r, Au);
}
function Iu(r) {
  bs(r, Ou);
}
function bs(r, e) {
  const t = r.parents.size;
  if (t) {
    const n = gs(r.parents);
    for (let i = 0; i < t; ++i)
      e(n[i], r);
  }
}
function Au(r, e) {
  cr(r.childValues.has(e)), cr(Ct(e));
  const t = !Ct(r);
  if (!r.dirtyChildren)
    r.dirtyChildren = zr.pop() || /* @__PURE__ */ new Set();
  else if (r.dirtyChildren.has(e))
    return;
  r.dirtyChildren.add(e), t && Tu(r);
}
function Ou(r, e) {
  cr(r.childValues.has(e)), cr(!Ct(e));
  const t = r.childValues.get(e);
  t.length === 0 ? r.childValues.set(e, xu(e.value)) : Su(t, e.value) || r.setDirty(), Cu(r, e), !Ct(r) && Iu(r);
}
function Cu(r, e) {
  const t = r.dirtyChildren;
  t && (t.delete(e), t.size === 0 && (zr.length < Yh && zr.push(t), r.dirtyChildren = null));
}
function Ru(r) {
  r.childValues.size > 0 && r.childValues.forEach((e, t) => {
    Nu(r, t);
  }), r.forgetDeps(), cr(r.dirtyChildren === null);
}
function Nu(r, e) {
  e.parents.delete(r), r.childValues.delete(e), Cu(r, e);
}
function tp(r, e) {
  if (typeof r.subscribe == "function")
    try {
      vs(r), r.unsubscribe = r.subscribe.apply(null, e);
    } catch (t) {
      return r.setDirty(), !1;
    }
  return !0;
}
const rp = {
  setDirty: !0,
  dispose: !0,
  forget: !0
  // Fully remove parent Entry from LRU cache and computation graph
};
function Du(r) {
  const e = /* @__PURE__ */ new Map();
  function t(n) {
    const i = Kn.getValue();
    if (i) {
      let s = e.get(n);
      s || e.set(n, s = /* @__PURE__ */ new Set()), i.dependOn(s);
    }
  }
  return t.dirty = function(i, s) {
    const o = e.get(i);
    if (o) {
      const a = s && Jh.call(rp, s) ? s : "setDirty";
      gs(o).forEach((u) => u[a]()), e.delete(i), vs(o);
    }
  }, t;
}
let Oo;
function np(...r) {
  return (Oo || (Oo = new ms(typeof WeakMap == "function"))).lookupArray(r);
}
const di = /* @__PURE__ */ new Set();
function Kr(r, { max: e = Math.pow(2, 16), keyArgs: t, makeCacheKey: n = np, normalizeResult: i, subscribe: s, cache: o = Pi } = /* @__PURE__ */ Object.create(null)) {
  const a = typeof o == "function" ? new o(e, (p) => p.dispose()) : o, u = function() {
    const p = n.apply(null, t ? t.apply(null, arguments) : arguments);
    if (p === void 0)
      return r.apply(null, arguments);
    let y = a.get(p);
    y || (a.set(p, y = new Gn(r)), y.normalizeResult = i, y.subscribe = s, y.forget = () => a.delete(p));
    const v = y.recompute(Array.prototype.slice.call(arguments));
    return a.set(p, y), di.add(a), Kn.hasValue() || (di.forEach((w) => w.clean()), di.clear()), v;
  };
  Object.defineProperty(u, "size", {
    get: () => a.size,
    configurable: !1,
    enumerable: !1
  }), Object.freeze(u.options = {
    max: e,
    keyArgs: t,
    makeCacheKey: n,
    normalizeResult: i,
    subscribe: s,
    cache: a
  });
  function f(p) {
    const y = p && a.get(p);
    y && y.setDirty();
  }
  u.dirtyKey = f, u.dirty = function() {
    f(n.apply(null, arguments));
  };
  function c(p) {
    const y = p && a.get(p);
    if (y)
      return y.peek();
  }
  u.peekKey = c, u.peek = function() {
    return c(n.apply(null, arguments));
  };
  function d(p) {
    return p ? a.delete(p) : !1;
  }
  return u.forgetKey = d, u.forget = function() {
    return d(n.apply(null, arguments));
  }, u.makeCacheKey = n, u.getKey = t ? function() {
    return n.apply(null, t.apply(null, arguments));
  } : n, Object.freeze(u);
}
function ip(r) {
  return r;
}
var Fu = (
  /** @class */
  function() {
    function r(e, t) {
      t === void 0 && (t = /* @__PURE__ */ Object.create(null)), this.resultCache = hu ? /* @__PURE__ */ new WeakSet() : /* @__PURE__ */ new Set(), this.transform = e, t.getCacheKey && (this.getCacheKey = t.getCacheKey), this.cached = t.cache !== !1, this.resetCache();
    }
    return r.prototype.getCacheKey = function(e) {
      return [e];
    }, r.identity = function() {
      return new r(ip, { cache: !1 });
    }, r.split = function(e, t, n) {
      return n === void 0 && (n = r.identity()), Object.assign(new r(
        function(i) {
          var s = e(i) ? t : n;
          return s.transformDocument(i);
        },
        // Reasonably assume both `left` and `right` transforms handle their own caching
        { cache: !1 }
      ), { left: t, right: n });
    }, r.prototype.resetCache = function() {
      var e = this;
      if (this.cached) {
        var t = new dr(yr);
        this.performWork = Kr(r.prototype.performWork.bind(this), {
          makeCacheKey: function(n) {
            var i = e.getCacheKey(n);
            if (i)
              return j(Array.isArray(i), 69), t.lookupArray(i);
          },
          max: mt["documentTransform.cache"],
          cache: Dn
        });
      }
    }, r.prototype.performWork = function(e) {
      return rn(e), this.transform(e);
    }, r.prototype.transformDocument = function(e) {
      if (this.resultCache.has(e))
        return e;
      var t = this.performWork(e);
      return this.resultCache.add(t), t;
    }, r.prototype.concat = function(e) {
      var t = this;
      return Object.assign(new r(
        function(n) {
          return e.transformDocument(t.transformDocument(n));
        },
        // Reasonably assume both transforms handle their own caching
        { cache: !1 }
      ), {
        left: this,
        right: e
      });
    }, r;
  }()
), $r, sn = Object.assign(function(r) {
  var e = $r.get(r);
  return e || (e = lu(r), $r.set(r, e)), e;
}, {
  reset: function() {
    $r = new yu(
      mt.print || 2e3
      /* defaultCacheSizes.print */
    );
  }
});
sn.reset();
globalThis.__DEV__ !== !1 && mu("print", function() {
  return $r ? $r.size : 0;
});
var ye = Array.isArray;
function nt(r) {
  return Array.isArray(r) && r.length > 0;
}
var Co = {
  kind: B.FIELD,
  name: {
    kind: B.NAME,
    value: "__typename"
  }
};
function Mu(r, e) {
  return !r || r.selectionSet.selections.every(function(t) {
    return t.kind === B.FRAGMENT_SPREAD && Mu(e[t.name.value], e);
  });
}
function sp(r) {
  return Mu(nn(r) || jh(r), Vn(zn(r))) ? null : r;
}
function op(r) {
  var e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map();
  return r.forEach(function(n) {
    n && (n.name ? e.set(n.name, n) : n.test && t.set(n.test, n));
  }), function(n) {
    var i = e.get(n.name.value);
    return !i && t.size && t.forEach(function(s, o) {
      o(n) && (i = s);
    }), i;
  };
}
function Ro(r) {
  var e = /* @__PURE__ */ new Map();
  return function(n) {
    n === void 0 && (n = r);
    var i = e.get(n);
    return i || e.set(n, i = {
      // Variable and fragment spread names used directly within this
      // operation or fragment definition, as identified by key. These sets
      // will be populated during the first traversal of the document in
      // removeDirectivesFromDocument below.
      variables: /* @__PURE__ */ new Set(),
      fragmentSpreads: /* @__PURE__ */ new Set()
    }), i;
  };
}
function Bu(r, e) {
  rn(e);
  for (var t = Ro(""), n = Ro(""), i = function(b) {
    for (var k = 0, S = void 0; k < b.length && (S = b[k]); ++k)
      if (!ye(S)) {
        if (S.kind === B.OPERATION_DEFINITION)
          return t(S.name && S.name.value);
        if (S.kind === B.FRAGMENT_DEFINITION)
          return n(S.name.value);
      }
    return globalThis.__DEV__ !== !1 && j.error(86), null;
  }, s = 0, o = e.definitions.length - 1; o >= 0; --o)
    e.definitions[o].kind === B.OPERATION_DEFINITION && ++s;
  var a = op(r), u = function(b) {
    return nt(b) && b.map(a).some(function(k) {
      return k && k.remove;
    });
  }, f = /* @__PURE__ */ new Map(), c = !1, d = {
    enter: function(b) {
      if (u(b.directives))
        return c = !0, null;
    }
  }, p = yt(e, {
    // These two AST node types share the same implementation, defined above.
    Field: d,
    InlineFragment: d,
    VariableDefinition: {
      enter: function() {
        return !1;
      }
    },
    Variable: {
      enter: function(b, k, S, A, O) {
        var R = i(O);
        R && R.variables.add(b.name.value);
      }
    },
    FragmentSpread: {
      enter: function(b, k, S, A, O) {
        if (u(b.directives))
          return c = !0, null;
        var R = i(O);
        R && R.fragmentSpreads.add(b.name.value);
      }
    },
    FragmentDefinition: {
      enter: function(b, k, S, A) {
        f.set(JSON.stringify(A), b);
      },
      leave: function(b, k, S, A) {
        var O = f.get(JSON.stringify(A));
        if (b === O)
          return b;
        if (
          // This logic applies only if the document contains one or more
          // operations, since removing all fragments from a document containing
          // only fragments makes the document useless.
          s > 0 && b.selectionSet.selections.every(function(R) {
            return R.kind === B.FIELD && R.name.value === "__typename";
          })
        )
          return n(b.name.value).removed = !0, c = !0, null;
      }
    },
    Directive: {
      leave: function(b) {
        if (a(b))
          return c = !0, null;
      }
    }
  });
  if (!c)
    return e;
  var y = function(b) {
    return b.transitiveVars || (b.transitiveVars = new Set(b.variables), b.removed || b.fragmentSpreads.forEach(function(k) {
      y(n(k)).transitiveVars.forEach(function(S) {
        b.transitiveVars.add(S);
      });
    })), b;
  }, v = /* @__PURE__ */ new Set();
  p.definitions.forEach(function(b) {
    b.kind === B.OPERATION_DEFINITION ? y(t(b.name && b.name.value)).fragmentSpreads.forEach(function(k) {
      v.add(k);
    }) : b.kind === B.FRAGMENT_DEFINITION && // If there are no operations in the document, then all fragment
    // definitions count as usages of their own fragment names. This heuristic
    // prevents accidentally removing all fragment definitions from the
    // document just because it contains no operations that use the fragments.
    s === 0 && !n(b.name.value).removed && v.add(b.name.value);
  }), v.forEach(function(b) {
    y(n(b)).fragmentSpreads.forEach(function(k) {
      v.add(k);
    });
  });
  var w = function(b) {
    return !!// A fragment definition will be removed if there are no spreads that refer
    // to it, or the fragment was explicitly removed because it had no fields
    // other than __typename.
    (!v.has(b) || n(b).removed);
  }, E = {
    enter: function(b) {
      if (w(b.name.value))
        return null;
    }
  };
  return sp(yt(p, {
    // If the fragment is going to be removed, then leaving any dangling
    // FragmentSpread nodes with the same name would be a mistake.
    FragmentSpread: E,
    // This is where the fragment definition is actually removed.
    FragmentDefinition: E,
    OperationDefinition: {
      leave: function(b) {
        if (b.variableDefinitions) {
          var k = y(
            // If an operation is anonymous, we use the empty string as its key.
            t(b.name && b.name.value)
          ).transitiveVars;
          if (k.size < b.variableDefinitions.length)
            return x(x({}, b), { variableDefinitions: b.variableDefinitions.filter(function(S) {
              return k.has(S.variable.name.value);
            }) });
        }
      }
    }
  }));
}
var ws = Object.assign(function(r) {
  return yt(r, {
    SelectionSet: {
      enter: function(e, t, n) {
        if (!(n && n.kind === B.OPERATION_DEFINITION)) {
          var i = e.selections;
          if (i) {
            var s = i.some(function(a) {
              return Ot(a) && (a.name.value === "__typename" || a.name.value.lastIndexOf("__", 0) === 0);
            });
            if (!s) {
              var o = n;
              if (!(Ot(o) && o.directives && o.directives.some(function(a) {
                return a.name.value === "export";
              })))
                return x(x({}, e), { selections: Pe(Pe([], i, !0), [Co], !1) });
            }
          }
        }
      }
    }
  });
}, {
  added: function(r) {
    return r === Co;
  }
});
function ap(r) {
  var e = mr(r), t = e.operation;
  if (t === "query")
    return r;
  var n = yt(r, {
    OperationDefinition: {
      enter: function(i) {
        return x(x({}, i), { operation: "query" });
      }
    }
  });
  return n;
}
function $u(r) {
  rn(r);
  var e = Bu([
    {
      test: function(t) {
        return t.name.value === "client";
      },
      remove: !0
    }
  ], r);
  return e;
}
var up = Object.prototype.hasOwnProperty;
function No() {
  for (var r = [], e = 0; e < arguments.length; e++)
    r[e] = arguments[e];
  return Jn(r);
}
function Jn(r) {
  var e = r[0] || {}, t = r.length;
  if (t > 1)
    for (var n = new Rt(), i = 1; i < t; ++i)
      e = n.merge(e, r[i]);
  return e;
}
var cp = function(r, e, t) {
  return this.merge(r[t], e[t]);
}, Rt = (
  /** @class */
  function() {
    function r(e) {
      e === void 0 && (e = cp), this.reconciler = e, this.isObject = fe, this.pastCopies = /* @__PURE__ */ new Set();
    }
    return r.prototype.merge = function(e, t) {
      for (var n = this, i = [], s = 2; s < arguments.length; s++)
        i[s - 2] = arguments[s];
      return fe(t) && fe(e) ? (Object.keys(t).forEach(function(o) {
        if (up.call(e, o)) {
          var a = e[o];
          if (t[o] !== a) {
            var u = n.reconciler.apply(n, Pe([
              e,
              t,
              o
            ], i, !1));
            u !== a && (e = n.shallowCopyForMerge(e), e[o] = u);
          }
        } else
          e = n.shallowCopyForMerge(e), e[o] = t[o];
      }), e) : t;
    }, r.prototype.shallowCopyForMerge = function(e) {
      return fe(e) && (this.pastCopies.has(e) || (Array.isArray(e) ? e = e.slice(0) : e = x({ __proto__: Object.getPrototypeOf(e) }, e), this.pastCopies.add(e))), e;
    }, r;
  }()
);
function lp(r, e) {
  var t = typeof Symbol != "undefined" && r[Symbol.iterator] || r["@@iterator"];
  if (t) return (t = t.call(r)).next.bind(t);
  if (Array.isArray(r) || (t = fp(r)) || e) {
    t && (r = t);
    var n = 0;
    return function() {
      return n >= r.length ? { done: !0 } : { done: !1, value: r[n++] };
    };
  }
  throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function fp(r, e) {
  if (r) {
    if (typeof r == "string") return Do(r, e);
    var t = Object.prototype.toString.call(r).slice(8, -1);
    if (t === "Object" && r.constructor && (t = r.constructor.name), t === "Map" || t === "Set") return Array.from(r);
    if (t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)) return Do(r, e);
  }
}
function Do(r, e) {
  (e == null || e > r.length) && (e = r.length);
  for (var t = 0, n = new Array(e); t < e; t++)
    n[t] = r[t];
  return n;
}
function Fo(r, e) {
  for (var t = 0; t < e.length; t++) {
    var n = e[t];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(r, n.key, n);
  }
}
function Es(r, e, t) {
  return e && Fo(r.prototype, e), t && Fo(r, t), Object.defineProperty(r, "prototype", { writable: !1 }), r;
}
var _s = function() {
  return typeof Symbol == "function";
}, Ss = function(r) {
  return _s() && !!Symbol[r];
}, ks = function(r) {
  return Ss(r) ? Symbol[r] : "@@" + r;
};
_s() && !Ss("observable") && (Symbol.observable = Symbol("observable"));
var hp = ks("iterator"), Vi = ks("observable"), Pu = ks("species");
function Fn(r, e) {
  var t = r[e];
  if (t != null) {
    if (typeof t != "function") throw new TypeError(t + " is not a function");
    return t;
  }
}
function Ar(r) {
  var e = r.constructor;
  return e !== void 0 && (e = e[Pu], e === null && (e = void 0)), e !== void 0 ? e : re;
}
function pp(r) {
  return r instanceof re;
}
function lr(r) {
  lr.log ? lr.log(r) : setTimeout(function() {
    throw r;
  });
}
function Sn(r) {
  Promise.resolve().then(function() {
    try {
      r();
    } catch (e) {
      lr(e);
    }
  });
}
function Lu(r) {
  var e = r._cleanup;
  if (e !== void 0 && (r._cleanup = void 0, !!e))
    try {
      if (typeof e == "function")
        e();
      else {
        var t = Fn(e, "unsubscribe");
        t && t.call(e);
      }
    } catch (n) {
      lr(n);
    }
}
function Hi(r) {
  r._observer = void 0, r._queue = void 0, r._state = "closed";
}
function dp(r) {
  var e = r._queue;
  if (e) {
    r._queue = void 0, r._state = "ready";
    for (var t = 0; t < e.length && (Uu(r, e[t].type, e[t].value), r._state !== "closed"); ++t)
      ;
  }
}
function Uu(r, e, t) {
  r._state = "running";
  var n = r._observer;
  try {
    var i = Fn(n, e);
    switch (e) {
      case "next":
        i && i.call(n, t);
        break;
      case "error":
        if (Hi(r), i) i.call(n, t);
        else throw t;
        break;
      case "complete":
        Hi(r), i && i.call(n);
        break;
    }
  } catch (s) {
    lr(s);
  }
  r._state === "closed" ? Lu(r) : r._state === "running" && (r._state = "ready");
}
function yi(r, e, t) {
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
      }], Sn(function() {
        return dp(r);
      });
      return;
    }
    Uu(r, e, t);
  }
}
var yp = /* @__PURE__ */ function() {
  function r(t, n) {
    this._cleanup = void 0, this._observer = t, this._queue = void 0, this._state = "initializing";
    var i = new mp(this);
    try {
      this._cleanup = n.call(void 0, i);
    } catch (s) {
      i.error(s);
    }
    this._state === "initializing" && (this._state = "ready");
  }
  var e = r.prototype;
  return e.unsubscribe = function() {
    this._state !== "closed" && (Hi(this), Lu(this));
  }, Es(r, [{
    key: "closed",
    get: function() {
      return this._state === "closed";
    }
  }]), r;
}(), mp = /* @__PURE__ */ function() {
  function r(t) {
    this._subscription = t;
  }
  var e = r.prototype;
  return e.next = function(n) {
    yi(this._subscription, "next", n);
  }, e.error = function(n) {
    yi(this._subscription, "error", n);
  }, e.complete = function() {
    yi(this._subscription, "complete");
  }, Es(r, [{
    key: "closed",
    get: function() {
      return this._subscription._state === "closed";
    }
  }]), r;
}(), re = /* @__PURE__ */ function() {
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
    }), new yp(n, this._subscriber);
  }, e.forEach = function(n) {
    var i = this;
    return new Promise(function(s, o) {
      if (typeof n != "function") {
        o(new TypeError(n + " is not a function"));
        return;
      }
      function a() {
        u.unsubscribe(), s();
      }
      var u = i.subscribe({
        next: function(f) {
          try {
            n(f, a);
          } catch (c) {
            o(c), u.unsubscribe();
          }
        },
        error: o,
        complete: s
      });
    });
  }, e.map = function(n) {
    var i = this;
    if (typeof n != "function") throw new TypeError(n + " is not a function");
    var s = Ar(this);
    return new s(function(o) {
      return i.subscribe({
        next: function(a) {
          try {
            a = n(a);
          } catch (u) {
            return o.error(u);
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
    var s = Ar(this);
    return new s(function(o) {
      return i.subscribe({
        next: function(a) {
          try {
            if (!n(a)) return;
          } catch (u) {
            return o.error(u);
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
    var s = Ar(this), o = arguments.length > 1, a = !1, u = arguments[1], f = u;
    return new s(function(c) {
      return i.subscribe({
        next: function(d) {
          var p = !a;
          if (a = !0, !p || o)
            try {
              f = n(f, d);
            } catch (y) {
              return c.error(y);
            }
          else
            f = d;
        },
        error: function(d) {
          c.error(d);
        },
        complete: function() {
          if (!a && !o) return c.error(new TypeError("Cannot reduce an empty sequence"));
          c.next(f), c.complete();
        }
      });
    });
  }, e.concat = function() {
    for (var n = this, i = arguments.length, s = new Array(i), o = 0; o < i; o++)
      s[o] = arguments[o];
    var a = Ar(this);
    return new a(function(u) {
      var f, c = 0;
      function d(p) {
        f = p.subscribe({
          next: function(y) {
            u.next(y);
          },
          error: function(y) {
            u.error(y);
          },
          complete: function() {
            c === s.length ? (f = void 0, u.complete()) : d(a.from(s[c++]));
          }
        });
      }
      return d(n), function() {
        f && (f.unsubscribe(), f = void 0);
      };
    });
  }, e.flatMap = function(n) {
    var i = this;
    if (typeof n != "function") throw new TypeError(n + " is not a function");
    var s = Ar(this);
    return new s(function(o) {
      var a = [], u = i.subscribe({
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
              p >= 0 && a.splice(p, 1), f();
            }
          });
          a.push(d);
        },
        error: function(c) {
          o.error(c);
        },
        complete: function() {
          f();
        }
      });
      function f() {
        u.closed && a.length === 0 && o.complete();
      }
      return function() {
        a.forEach(function(c) {
          return c.unsubscribe();
        }), u.unsubscribe();
      };
    });
  }, e[Vi] = function() {
    return this;
  }, r.from = function(n) {
    var i = typeof this == "function" ? this : r;
    if (n == null) throw new TypeError(n + " is not an object");
    var s = Fn(n, Vi);
    if (s) {
      var o = s.call(n);
      if (Object(o) !== o) throw new TypeError(o + " is not an object");
      return pp(o) && o.constructor === i ? o : new i(function(a) {
        return o.subscribe(a);
      });
    }
    if (Ss("iterator") && (s = Fn(n, hp), s))
      return new i(function(a) {
        Sn(function() {
          if (!a.closed) {
            for (var u = lp(s.call(n)), f; !(f = u()).done; ) {
              var c = f.value;
              if (a.next(c), a.closed) return;
            }
            a.complete();
          }
        });
      });
    if (Array.isArray(n))
      return new i(function(a) {
        Sn(function() {
          if (!a.closed) {
            for (var u = 0; u < n.length; ++u)
              if (a.next(n[u]), a.closed) return;
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
      Sn(function() {
        if (!a.closed) {
          for (var u = 0; u < i.length; ++u)
            if (a.next(i[u]), a.closed) return;
          a.complete();
        }
      });
    });
  }, Es(r, null, [{
    key: Pu,
    get: function() {
      return this;
    }
  }]), r;
}();
_s() && Object.defineProperty(re, Symbol("extensions"), {
  value: {
    symbol: Vi,
    hostReportError: lr
  },
  configurable: !0
});
function gp(r) {
  var e, t = r.Symbol;
  if (typeof t == "function")
    if (t.observable)
      e = t.observable;
    else {
      typeof t.for == "function" ? e = t.for("https://github.com/benlesh/symbol-observable") : e = t("https://github.com/benlesh/symbol-observable");
      try {
        t.observable = e;
      } catch (n) {
      }
    }
  else
    e = "@@observable";
  return e;
}
var Jt;
typeof self != "undefined" ? Jt = self : typeof window != "undefined" ? Jt = window : typeof Tt != "undefined" ? Jt = Tt : typeof module != "undefined" ? Jt = module : Jt = Function("return this")();
gp(Jt);
var Mo = re.prototype, Bo = "@@observable";
Mo[Bo] || (Mo[Bo] = function() {
  return this;
});
var vp = Object.prototype.toString;
function qu(r) {
  return Wi(r);
}
function Wi(r, e) {
  switch (vp.call(r)) {
    case "[object Array]": {
      if (e = e || /* @__PURE__ */ new Map(), e.has(r))
        return e.get(r);
      var t = r.slice(0);
      return e.set(r, t), t.forEach(function(i, s) {
        t[s] = Wi(i, e);
      }), t;
    }
    case "[object Object]": {
      if (e = e || /* @__PURE__ */ new Map(), e.has(r))
        return e.get(r);
      var n = Object.create(Object.getPrototypeOf(r));
      return e.set(r, n), Object.keys(r).forEach(function(i) {
        n[i] = Wi(r[i], e);
      }), n;
    }
    default:
      return r;
  }
}
function bp(r) {
  var e = /* @__PURE__ */ new Set([r]);
  return e.forEach(function(t) {
    fe(t) && wp(t) === t && Object.getOwnPropertyNames(t).forEach(function(n) {
      fe(t[n]) && e.add(t[n]);
    });
  }), r;
}
function wp(r) {
  if (globalThis.__DEV__ !== !1 && !Object.isFrozen(r))
    try {
      Object.freeze(r);
    } catch (e) {
      if (e instanceof TypeError)
        return null;
      throw e;
    }
  return r;
}
function zi(r) {
  return globalThis.__DEV__ !== !1 && bp(r), r;
}
function Pr(r, e, t) {
  var n = [];
  r.forEach(function(i) {
    return i[e] && n.push(i);
  }), n.forEach(function(i) {
    return i[e](t);
  });
}
function mi(r, e, t) {
  return new re(function(n) {
    var i = {
      // Normally we would initialize promiseQueue to Promise.resolve(), but
      // in this case, for backwards compatibility, we need to be careful to
      // invoke the first callback synchronously.
      then: function(u) {
        return new Promise(function(f) {
          return f(u());
        });
      }
    };
    function s(u, f) {
      return function(c) {
        if (u) {
          var d = function() {
            return n.closed ? (
              /* will be swallowed */
              0
            ) : u(c);
          };
          i = i.then(d, d).then(function(p) {
            return n.next(p);
          }, function(p) {
            return n.error(p);
          });
        } else
          n[f](c);
      };
    }
    var o = {
      next: s(e, "next"),
      error: s(t, "error"),
      complete: function() {
        i.then(function() {
          return n.complete();
        });
      }
    }, a = r.subscribe(o);
    return function() {
      return a.unsubscribe();
    };
  });
}
function ju(r) {
  function e(t) {
    Object.defineProperty(r, t, { value: re });
  }
  return pu && Symbol.species && e(Symbol.species), e("@@species"), r;
}
function $o(r) {
  return r && typeof r.then == "function";
}
var Yt = (
  /** @class */
  function(r) {
    He(e, r);
    function e(t) {
      var n = r.call(this, function(i) {
        return n.addObserver(i), function() {
          return n.removeObserver(i);
        };
      }) || this;
      return n.observers = /* @__PURE__ */ new Set(), n.promise = new Promise(function(i, s) {
        n.resolve = i, n.reject = s;
      }), n.handlers = {
        next: function(i) {
          n.sub !== null && (n.latest = ["next", i], n.notify("next", i), Pr(n.observers, "next", i));
        },
        error: function(i) {
          var s = n.sub;
          s !== null && (s && setTimeout(function() {
            return s.unsubscribe();
          }), n.sub = null, n.latest = ["error", i], n.reject(i), n.notify("error", i), Pr(n.observers, "error", i));
        },
        complete: function() {
          var i = n, s = i.sub, o = i.sources, a = o === void 0 ? [] : o;
          if (s !== null) {
            var u = a.shift();
            u ? $o(u) ? u.then(function(f) {
              return n.sub = f.subscribe(n.handlers);
            }, n.handlers.error) : n.sub = u.subscribe(n.handlers) : (s && setTimeout(function() {
              return s.unsubscribe();
            }), n.sub = null, n.latest && n.latest[0] === "next" ? n.resolve(n.latest[1]) : n.resolve(), n.notify("complete"), Pr(n.observers, "complete"));
          }
        }
      }, n.nextResultListeners = /* @__PURE__ */ new Set(), n.cancel = function(i) {
        n.reject(i), n.sources = [], n.handlers.error(i);
      }, n.promise.catch(function(i) {
      }), typeof t == "function" && (t = [new re(t)]), $o(t) ? t.then(function(i) {
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
      this.observers.has(t) || (this.deliverLastMessage(t), this.observers.add(t));
    }, e.prototype.removeObserver = function(t) {
      this.observers.delete(t) && this.observers.size < 1 && this.handlers.complete();
    }, e.prototype.notify = function(t, n) {
      var i = this.nextResultListeners;
      i.size && (this.nextResultListeners = /* @__PURE__ */ new Set(), i.forEach(function(s) {
        return s(t, n);
      }));
    }, e.prototype.beforeNext = function(t) {
      var n = !1;
      this.nextResultListeners.add(function(i, s) {
        n || (n = !0, t(i, s));
      });
    }, e;
  }(re)
);
ju(Yt);
function ir(r) {
  return "incremental" in r;
}
function Ep(r) {
  return "hasNext" in r && "data" in r;
}
function _p(r) {
  return ir(r) || Ep(r);
}
function Sp(r) {
  return fe(r) && "payload" in r;
}
function Qu(r, e) {
  var t = r, n = new Rt();
  return ir(e) && nt(e.incremental) && e.incremental.forEach(function(i) {
    for (var s = i.data, o = i.path, a = o.length - 1; a >= 0; --a) {
      var u = o[a], f = !isNaN(+u), c = f ? [] : {};
      c[u] = s, s = c;
    }
    t = n.merge(t, s);
  }), t;
}
function kn(r) {
  var e = Ki(r);
  return nt(e);
}
function Ki(r) {
  var e = nt(r.errors) ? r.errors.slice(0) : [];
  return ir(r) && nt(r.incremental) && r.incremental.forEach(function(t) {
    t.errors && e.push.apply(e, t.errors);
  }), e;
}
function fr() {
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
function gi(r, e) {
  return fr(r, e, e.variables && {
    variables: fr(x(x({}, r && r.variables), e.variables))
  });
}
function vi(r) {
  return new re(function(e) {
    e.error(r);
  });
}
var Vu = function(r, e, t) {
  var n = new Error(t);
  throw n.name = "ServerError", n.response = r, n.statusCode = r.status, n.result = e, n;
};
function kp(r) {
  for (var e = [
    "query",
    "operationName",
    "variables",
    "extensions",
    "context"
  ], t = 0, n = Object.keys(r); t < n.length; t++) {
    var i = n[t];
    if (e.indexOf(i) < 0)
      throw Fe(44, i);
  }
  return r;
}
function xp(r, e) {
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
function Tp(r) {
  var e = {
    variables: r.variables || {},
    extensions: r.extensions || {},
    operationName: r.operationName,
    query: r.query
  };
  return e.operationName || (e.operationName = typeof e.query != "string" ? Qi(e.query) || void 0 : ""), e;
}
function Ip(r, e) {
  var t = x({}, r), n = new Set(Object.keys(r));
  return yt(e, {
    Variable: function(i, s, o) {
      o && o.kind !== "VariableDefinition" && n.delete(i.name.value);
    }
  }), n.forEach(function(i) {
    delete t[i];
  }), t;
}
function Po(r, e) {
  return e ? e(r) : re.of();
}
function Or(r) {
  return typeof r == "function" ? new We(r) : r;
}
function yn(r) {
  return r.request.length <= 1;
}
var We = (
  /** @class */
  function() {
    function r(e) {
      e && (this.request = e);
    }
    return r.empty = function() {
      return new r(function() {
        return re.of();
      });
    }, r.from = function(e) {
      return e.length === 0 ? r.empty() : e.map(Or).reduce(function(t, n) {
        return t.concat(n);
      });
    }, r.split = function(e, t, n) {
      var i = Or(t), s = Or(n || new r(Po)), o;
      return yn(i) && yn(s) ? o = new r(function(a) {
        return e(a) ? i.request(a) || re.of() : s.request(a) || re.of();
      }) : o = new r(function(a, u) {
        return e(a) ? i.request(a, u) || re.of() : s.request(a, u) || re.of();
      }), Object.assign(o, { left: i, right: s });
    }, r.execute = function(e, t) {
      return e.request(xp(t.context, Tp(kp(t)))) || re.of();
    }, r.concat = function(e, t) {
      var n = Or(e);
      if (yn(n))
        return globalThis.__DEV__ !== !1 && j.warn(36, n), n;
      var i = Or(t), s;
      return yn(i) ? s = new r(function(o) {
        return n.request(o, function(a) {
          return i.request(a) || re.of();
        }) || re.of();
      }) : s = new r(function(o, a) {
        return n.request(o, function(u) {
          return i.request(u, a) || re.of();
        }) || re.of();
      }), Object.assign(s, { left: n, right: i });
    }, r.prototype.split = function(e, t, n) {
      return this.concat(r.split(e, t, n || new r(Po)));
    }, r.prototype.concat = function(e) {
      return r.concat(this, e);
    }, r.prototype.request = function(e, t) {
      throw Fe(37);
    }, r.prototype.onError = function(e, t) {
      if (t && t.error)
        return t.error(e), !1;
      throw e;
    }, r.prototype.setOnError = function(e) {
      return this.onError = e, this;
    }, r;
  }()
), Lo = We.from, Ap = We.split, Gi = We.execute;
function Op(r) {
  var e, t = r[Symbol.asyncIterator]();
  return e = {
    next: function() {
      return t.next();
    }
  }, e[Symbol.asyncIterator] = function() {
    return this;
  }, e;
}
function Cp(r) {
  var e = null, t = null, n = !1, i = [], s = [];
  function o(d) {
    if (!t) {
      if (s.length) {
        var p = s.shift();
        if (Array.isArray(p) && p[0])
          return p[0]({ value: d, done: !1 });
      }
      i.push(d);
    }
  }
  function a(d) {
    t = d;
    var p = s.slice();
    p.forEach(function(y) {
      y[1](d);
    }), !e || e();
  }
  function u() {
    n = !0;
    var d = s.slice();
    d.forEach(function(p) {
      p[0]({ value: void 0, done: !0 });
    }), !e || e();
  }
  e = function() {
    e = null, r.removeListener("data", o), r.removeListener("error", a), r.removeListener("end", u), r.removeListener("finish", u), r.removeListener("close", u);
  }, r.on("data", o), r.on("error", a), r.on("end", u), r.on("finish", u), r.on("close", u);
  function f() {
    return new Promise(function(d, p) {
      if (t)
        return p(t);
      if (i.length)
        return d({ value: i.shift(), done: !1 });
      if (n)
        return d({ value: void 0, done: !0 });
      s.push([d, p]);
    });
  }
  var c = {
    next: function() {
      return f();
    }
  };
  return Qn && (c[Symbol.asyncIterator] = function() {
    return this;
  }), c;
}
function Rp(r) {
  var e = !1, t = {
    next: function() {
      return e ? Promise.resolve({
        value: void 0,
        done: !0
      }) : (e = !0, new Promise(function(n, i) {
        r.then(function(s) {
          n({ value: s, done: !1 });
        }).catch(i);
      }));
    }
  };
  return Qn && (t[Symbol.asyncIterator] = function() {
    return this;
  }), t;
}
function Uo(r) {
  var e = {
    next: function() {
      return r.read();
    }
  };
  return Qn && (e[Symbol.asyncIterator] = function() {
    return this;
  }), e;
}
function Np(r) {
  return !!r.body;
}
function Dp(r) {
  return !!r.getReader;
}
function Fp(r) {
  return !!(Qn && r[Symbol.asyncIterator]);
}
function Mp(r) {
  return !!r.stream;
}
function Bp(r) {
  return !!r.arrayBuffer;
}
function $p(r) {
  return !!r.pipe;
}
function Pp(r) {
  var e = r;
  if (Np(r) && (e = r.body), Fp(e))
    return Op(e);
  if (Dp(e))
    return Uo(e.getReader());
  if (Mp(e))
    return Uo(e.stream().getReader());
  if (Bp(e))
    return Rp(e.arrayBuffer());
  if ($p(e))
    return Cp(e);
  throw new Error("Unknown body type for responseIterator. Please pass a streamable response.");
}
var xs = Symbol();
function Lp(r) {
  return r.extensions ? Array.isArray(r.extensions[xs]) : !1;
}
function Hu(r) {
  return r.hasOwnProperty("graphQLErrors");
}
var Up = function(r) {
  var e = Pe(Pe(Pe([], r.graphQLErrors, !0), r.clientErrors, !0), r.protocolErrors, !0);
  return r.networkError && e.push(r.networkError), e.map(function(t) {
    return fe(t) && t.message || "Error message not found.";
  }).join(`
`);
}, St = (
  /** @class */
  function(r) {
    He(e, r);
    function e(t) {
      var n = t.graphQLErrors, i = t.protocolErrors, s = t.clientErrors, o = t.networkError, a = t.errorMessage, u = t.extraInfo, f = r.call(this, a) || this;
      return f.name = "ApolloError", f.graphQLErrors = n || [], f.protocolErrors = i || [], f.clientErrors = s || [], f.networkError = o || null, f.message = a || Up(f), f.extraInfo = u, f.cause = Pe(Pe(Pe([
        o
      ], n || [], !0), i || [], !0), s || [], !0).find(function(c) {
        return !!c;
      }) || null, f.__proto__ = e.prototype, f;
    }
    return e;
  }(Error)
), qo = Object.prototype.hasOwnProperty;
function qp(r, e) {
  return wt(this, void 0, void 0, function() {
    var t, n, i, s, o, a, u, f, c, d, p, y, v, w, E, b, k, S, A, O, R, D, F, P;
    return Et(this, function(H) {
      switch (H.label) {
        case 0:
          if (TextDecoder === void 0)
            throw new Error("TextDecoder must be defined in the environment: please import a polyfill.");
          t = new TextDecoder("utf-8"), n = (P = r.headers) === null || P === void 0 ? void 0 : P.get("content-type"), i = "boundary=", s = n != null && n.includes(i) ? n == null ? void 0 : n.substring((n == null ? void 0 : n.indexOf(i)) + i.length).replace(/['"]/g, "").replace(/\;(.*)/gm, "").trim() : "-", o = `\r
--`.concat(s), a = "", u = Pp(r), f = !0, H.label = 1;
        case 1:
          return f ? [4, u.next()] : [3, 3];
        case 2:
          for (c = H.sent(), d = c.value, p = c.done, y = typeof d == "string" ? d : t.decode(d), v = a.length - o.length + 1, f = !p, a += y, w = a.indexOf(o, v); w > -1; ) {
            if (E = void 0, D = [
              a.slice(0, w),
              a.slice(w + o.length)
            ], E = D[0], a = D[1], b = E.indexOf(`\r
\r
`), k = jp(E.slice(0, b)), S = k["content-type"], S && S.toLowerCase().indexOf("application/json") === -1)
              throw new Error("Unsupported patch content type: application/json is required.");
            if (A = E.slice(b), A) {
              if (O = Wu(r, A), Object.keys(O).length > 1 || "data" in O || "incremental" in O || "errors" in O || "payload" in O)
                if (Sp(O)) {
                  if (R = {}, "payload" in O) {
                    if (Object.keys(O).length === 1 && O.payload === null)
                      return [
                        2
                        /*return*/
                      ];
                    R = x({}, O.payload);
                  }
                  "errors" in O && (R = x(x({}, R), { extensions: x(x({}, "extensions" in R ? R.extensions : null), (F = {}, F[xs] = O.errors, F)) })), e(R);
                } else
                  e(O);
              else if (
                // If the chunk contains only a "hasNext: false", we can call
                // observer.complete() immediately.
                Object.keys(O).length === 1 && "hasNext" in O && !O.hasNext
              )
                return [
                  2
                  /*return*/
                ];
            }
            w = a.indexOf(o);
          }
          return [3, 1];
        case 3:
          return [
            2
            /*return*/
          ];
      }
    });
  });
}
function jp(r) {
  var e = {};
  return r.split(`
`).forEach(function(t) {
    var n = t.indexOf(":");
    if (n > -1) {
      var i = t.slice(0, n).trim().toLowerCase(), s = t.slice(n + 1).trim();
      e[i] = s;
    }
  }), e;
}
function Wu(r, e) {
  if (r.status >= 300) {
    var t = function() {
      try {
        return JSON.parse(e);
      } catch (i) {
        return e;
      }
    };
    Vu(r, t(), "Response not successful: Received status code ".concat(r.status));
  }
  try {
    return JSON.parse(e);
  } catch (i) {
    var n = i;
    throw n.name = "ServerParseError", n.response = r, n.statusCode = r.status, n.bodyText = e, n;
  }
}
function Qp(r, e) {
  r.result && r.result.errors && r.result.data && e.next(r.result), e.error(r);
}
function Vp(r) {
  return function(e) {
    return e.text().then(function(t) {
      return Wu(e, t);
    }).then(function(t) {
      return !Array.isArray(t) && !qo.call(t, "data") && !qo.call(t, "errors") && Vu(e, t, "Server response was missing for query '".concat(Array.isArray(r) ? r.map(function(n) {
        return n.operationName;
      }) : r.operationName, "'.")), t;
    });
  };
}
var Ji = function(r, e) {
  var t;
  try {
    t = JSON.stringify(r);
  } catch (i) {
    var n = Fe(40, e, i.message);
    throw n.parseError = i, n;
  }
  return t;
}, Hp = {
  includeQuery: !0,
  includeExtensions: !1,
  preserveHeaderCase: !1
}, Wp = {
  // headers are case insensitive (https://stackoverflow.com/a/5259004)
  accept: "*/*",
  // The content-type header describes the type of the body of the request, and
  // so it typically only is sent with requests that actually have bodies. One
  // could imagine that Apollo Client would remove this header when constructing
  // a GET request (which has no body), but we historically have not done that.
  // This means that browsers will preflight all Apollo Client requests (even
  // GET requests). Apollo Server's CSRF prevention feature (introduced in
  // AS3.7) takes advantage of this fact and does not block requests with this
  // header. If you want to drop this header from GET requests, then you should
  // probably replace it with a `apollo-require-preflight` header, or servers
  // with CSRF prevention enabled might block your GET request. See
  // https://www.apollographql.com/docs/apollo-server/security/cors/#preventing-cross-site-request-forgery-csrf
  // for more details.
  "content-type": "application/json"
}, zp = {
  method: "POST"
}, Kp = {
  http: Hp,
  headers: Wp,
  options: zp
}, Gp = function(r, e) {
  return e(r);
};
function Jp(r, e) {
  for (var t = [], n = 2; n < arguments.length; n++)
    t[n - 2] = arguments[n];
  var i = {}, s = {};
  t.forEach(function(d) {
    i = x(x(x({}, i), d.options), { headers: x(x({}, i.headers), d.headers) }), d.credentials && (i.credentials = d.credentials), s = x(x({}, s), d.http);
  }), i.headers && (i.headers = Yp(i.headers, s.preserveHeaderCase));
  var o = r.operationName, a = r.extensions, u = r.variables, f = r.query, c = { operationName: o, variables: u };
  return s.includeExtensions && (c.extensions = a), s.includeQuery && (c.query = e(f, sn)), {
    options: i,
    body: c
  };
}
function Yp(r, e) {
  if (!e) {
    var t = {};
    return Object.keys(Object(r)).forEach(function(s) {
      t[s.toLowerCase()] = r[s];
    }), t;
  }
  var n = {};
  Object.keys(Object(r)).forEach(function(s) {
    n[s.toLowerCase()] = {
      originalName: s,
      value: r[s]
    };
  });
  var i = {};
  return Object.keys(n).forEach(function(s) {
    i[n[s].originalName] = n[s].value;
  }), i;
}
var Xp = function(r) {
  if (!r && typeof fetch == "undefined")
    throw Fe(38);
}, Zp = function(r, e) {
  var t = r.getContext(), n = t.uri;
  return n || (typeof e == "function" ? e(r) : e || "/graphql");
};
function ed(r, e) {
  var t = [], n = function(d, p) {
    t.push("".concat(d, "=").concat(encodeURIComponent(p)));
  };
  if ("query" in e && n("query", e.query), e.operationName && n("operationName", e.operationName), e.variables) {
    var i = void 0;
    try {
      i = Ji(e.variables, "Variables map");
    } catch (d) {
      return { parseError: d };
    }
    n("variables", i);
  }
  if (e.extensions) {
    var s = void 0;
    try {
      s = Ji(e.extensions, "Extensions map");
    } catch (d) {
      return { parseError: d };
    }
    n("extensions", s);
  }
  var o = "", a = r, u = r.indexOf("#");
  u !== -1 && (o = r.substr(u), a = r.substr(0, u));
  var f = a.indexOf("?") === -1 ? "?" : "&", c = a + f + t.join("&") + o;
  return { newURI: c };
}
var jo = Ye(function() {
  return fetch;
}), zu = function(r) {
  r === void 0 && (r = {});
  var e = r.uri, t = e === void 0 ? "/graphql" : e, n = r.fetch, i = r.print, s = i === void 0 ? Gp : i, o = r.includeExtensions, a = r.preserveHeaderCase, u = r.useGETForQueries, f = r.includeUnusedVariables, c = f === void 0 ? !1 : f, d = rt(r, ["uri", "fetch", "print", "includeExtensions", "preserveHeaderCase", "useGETForQueries", "includeUnusedVariables"]);
  globalThis.__DEV__ !== !1 && Xp(n || jo);
  var p = {
    http: { includeExtensions: o, preserveHeaderCase: a },
    options: d.fetchOptions,
    credentials: d.credentials,
    headers: d.headers
  };
  return new We(function(y) {
    var v = Zp(y, t), w = y.getContext(), E = {};
    if (w.clientAwareness) {
      var b = w.clientAwareness, k = b.name, S = b.version;
      k && (E["apollographql-client-name"] = k), S && (E["apollographql-client-version"] = S);
    }
    var A = x(x({}, E), w.headers), O = {
      http: w.http,
      options: w.fetchOptions,
      credentials: w.credentials,
      headers: A
    };
    if (Wr(["client"], y.query)) {
      var R = $u(y.query);
      if (!R)
        return vi(new Error("HttpLink: Trying to send a client-only query to the server. To send to the server, ensure a non-client field is added to the query or set the `transformOptions.removeClientFields` option to `true`."));
      y.query = R;
    }
    var D = Jp(y, s, Kp, p, O), F = D.options, P = D.body;
    P.variables && !c && (P.variables = Ip(P.variables, y.query));
    var H;
    !F.signal && typeof AbortController != "undefined" && (H = new AbortController(), F.signal = H.signal);
    var J = function(q) {
      return q.kind === "OperationDefinition" && q.operation === "mutation";
    }, Oe = function(q) {
      return q.kind === "OperationDefinition" && q.operation === "subscription";
    }, ie = Oe(mr(y.query)), ke = Wr(["defer"], y.query);
    if (u && !y.query.definitions.some(J) && (F.method = "GET"), ke || ie) {
      F.headers = F.headers || {};
      var Dt = "multipart/mixed;";
      ie && ke && globalThis.__DEV__ !== !1 && j.warn(39), ie ? Dt += "boundary=graphql;subscriptionSpec=1.0,application/json" : ke && (Dt += "deferSpec=20220824,application/json"), F.headers.accept = Dt;
    }
    if (F.method === "GET") {
      var V = ed(v, P), ee = V.newURI, Q = V.parseError;
      if (Q)
        return vi(Q);
      v = ee;
    } else
      try {
        F.body = Ji(P, "Payload");
      } catch (q) {
        return vi(q);
      }
    return new re(function(q) {
      var te = n || Ye(function() {
        return fetch;
      }) || jo, be = q.next.bind(q);
      return te(v, F).then(function(z) {
        var Me;
        y.setContext({ response: z });
        var se = (Me = z.headers) === null || Me === void 0 ? void 0 : Me.get("content-type");
        return se !== null && /^multipart\/mixed/i.test(se) ? qp(z, be) : Vp(y)(z).then(be);
      }).then(function() {
        H = void 0, q.complete();
      }).catch(function(z) {
        H = void 0, Qp(z, q);
      }), function() {
        H && H.abort();
      };
    });
  });
}, td = (
  /** @class */
  function(r) {
    He(e, r);
    function e(t) {
      t === void 0 && (t = {});
      var n = r.call(this, zu(t).request) || this;
      return n.options = t, n;
    }
    return e;
  }(We)
);
const { toString: Qo, hasOwnProperty: rd } = Object.prototype, Vo = Function.prototype.toString, Yi = /* @__PURE__ */ new Map();
function ce(r, e) {
  try {
    return Xi(r, e);
  } finally {
    Yi.clear();
  }
}
function Xi(r, e) {
  if (r === e)
    return !0;
  const t = Qo.call(r), n = Qo.call(e);
  if (t !== n)
    return !1;
  switch (t) {
    case "[object Array]":
      if (r.length !== e.length)
        return !1;
    case "[object Object]": {
      if (Wo(r, e))
        return !0;
      const i = Ho(r), s = Ho(e), o = i.length;
      if (o !== s.length)
        return !1;
      for (let a = 0; a < o; ++a)
        if (!rd.call(e, i[a]))
          return !1;
      for (let a = 0; a < o; ++a) {
        const u = i[a];
        if (!Xi(r[u], e[u]))
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
      if (Wo(r, e))
        return !0;
      const i = r.entries(), s = t === "[object Map]";
      for (; ; ) {
        const o = i.next();
        if (o.done)
          break;
        const [a, u] = o.value;
        if (!e.has(a) || s && !Xi(u, e.get(a)))
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
      const i = Vo.call(r);
      return i !== Vo.call(e) ? !1 : !sd(i, id);
    }
  }
  return !1;
}
function Ho(r) {
  return Object.keys(r).filter(nd, r);
}
function nd(r) {
  return this[r] !== void 0;
}
const id = "{ [native code] }";
function sd(r, e) {
  const t = r.length - e.length;
  return t >= 0 && r.indexOf(e, t) === t;
}
function Wo(r, e) {
  let t = Yi.get(r);
  if (t) {
    if (t.has(e))
      return !0;
  } else
    Yi.set(r, t = /* @__PURE__ */ new Set());
  return t.add(e), !1;
}
function Ku(r, e, t, n) {
  var i = e.data, s = rt(e, ["data"]), o = t.data, a = rt(t, ["data"]);
  return ce(s, a) && xn(mr(r).selectionSet, i, o, {
    fragmentMap: Vn(zn(r)),
    variables: n
  });
}
function xn(r, e, t, n) {
  if (e === t)
    return !0;
  var i = /* @__PURE__ */ new Set();
  return r.selections.every(function(s) {
    if (i.has(s) || (i.add(s), !tn(s, n.variables)) || zo(s))
      return !0;
    if (Ot(s)) {
      var o = At(s), a = e && e[o], u = t && t[o], f = s.selectionSet;
      if (!f)
        return ce(a, u);
      var c = Array.isArray(a), d = Array.isArray(u);
      if (c !== d)
        return !1;
      if (c && d) {
        var p = a.length;
        if (u.length !== p)
          return !1;
        for (var y = 0; y < p; ++y)
          if (!xn(f, a[y], u[y], n))
            return !1;
        return !0;
      }
      return xn(f, a, u, n);
    } else {
      var v = Hn(s, n.fragmentMap);
      if (v)
        return zo(v) ? !0 : xn(
          v.selectionSet,
          // Notice that we reuse the same aResult and bResult values here,
          // since the fragment ...spread does not specify a field name, but
          // consists of multiple fields (within the fragment's selection set)
          // that should be applied to the current result value(s).
          e,
          t,
          n
        );
    }
  });
}
function zo(r) {
  return !!r.directives && r.directives.some(od);
}
function od(r) {
  return r.name.value === "nonreactive";
}
var Gu = (
  /** @class */
  function() {
    function r() {
      this.assumeImmutableResults = !1, this.getFragmentDoc = Kr(fh, {
        max: mt["cache.fragmentQueryDocuments"] || 1e3,
        cache: Dn
      });
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
    }, r.prototype.transformForLink = function(e) {
      return e;
    }, r.prototype.identify = function(e) {
    }, r.prototype.gc = function() {
      return [];
    }, r.prototype.modify = function(e) {
      return !1;
    }, r.prototype.readQuery = function(e, t) {
      return t === void 0 && (t = !!e.optimistic), this.read(x(x({}, e), { rootId: e.id || "ROOT_QUERY", optimistic: t }));
    }, r.prototype.watchFragment = function(e) {
      var t = this, n = e.fragment, i = e.fragmentName, s = e.from, o = e.optimistic, a = o === void 0 ? !0 : o, u = rt(e, ["fragment", "fragmentName", "from", "optimistic"]), f = this.getFragmentDoc(n, i), c = x(x({}, u), { returnPartialData: !0, id: (
        // While our TypeScript types do not allow for `undefined` as a valid
        // `from`, its possible `useFragment` gives us an `undefined` since it
        // calls` cache.identify` and provides that value to `from`. We are
        // adding this fix here however to ensure those using plain JavaScript
        // and using `cache.identify` themselves will avoid seeing the obscure
        // warning.
        typeof s == "undefined" || typeof s == "string" ? s : this.identify(s)
      ), query: f, optimistic: a }), d;
      return new re(function(p) {
        return t.watch(x(x({}, c), { immediate: !0, callback: function(y) {
          if (
            // Always ensure we deliver the first result
            !(d && Ku(f, { data: d == null ? void 0 : d.result }, { data: y.result }))
          ) {
            var v = {
              data: y.result,
              complete: !!y.complete
            };
            y.missing && (v.missing = Jn(y.missing.map(function(w) {
              return w.missing;
            }))), d = y, p.next(v);
          }
        } }));
      });
    }, r.prototype.readFragment = function(e, t) {
      return t === void 0 && (t = !!e.optimistic), this.read(x(x({}, e), { query: this.getFragmentDoc(e.fragment, e.fragmentName), rootId: e.id, optimistic: t }));
    }, r.prototype.writeQuery = function(e) {
      var t = e.id, n = e.data, i = rt(e, ["id", "data"]);
      return this.write(Object.assign(i, {
        dataId: t || "ROOT_QUERY",
        result: n
      }));
    }, r.prototype.writeFragment = function(e) {
      var t = e.id, n = e.data, i = e.fragment, s = e.fragmentName, o = rt(e, ["id", "data", "fragment", "fragmentName"]);
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
  }()
);
globalThis.__DEV__ !== !1 && (Gu.prototype.getMemoryInternals = _h);
var Ju = (
  /** @class */
  function(r) {
    He(e, r);
    function e(t, n, i, s) {
      var o, a = r.call(this, t) || this;
      if (a.message = t, a.path = n, a.query = i, a.variables = s, Array.isArray(a.path)) {
        a.missing = a.message;
        for (var u = a.path.length - 1; u >= 0; --u)
          a.missing = (o = {}, o[a.path[u]] = a.missing, o);
      } else
        a.missing = a.path;
      return a.__proto__ = e.prototype, a;
    }
    return e;
  }(Error)
), xe = Object.prototype.hasOwnProperty;
function Cr(r) {
  return r == null;
}
function Yu(r, e) {
  var t = r.__typename, n = r.id, i = r._id;
  if (typeof t == "string" && (e && (e.keyObject = Cr(n) ? Cr(i) ? void 0 : { _id: i } : { id: n }), Cr(n) && !Cr(i) && (n = i), !Cr(n)))
    return "".concat(t, ":").concat(typeof n == "number" || typeof n == "string" ? n : JSON.stringify(n));
}
var Xu = {
  dataIdFromObject: Yu,
  addTypename: !0,
  resultCaching: !0,
  // Thanks to the shouldCanonizeResults helper, this should be the only line
  // you have to change to reenable canonization by default in the future.
  canonizeResults: !1
};
function ad(r) {
  return fr(Xu, r);
}
function Zu(r) {
  var e = r.canonizeResults;
  return e === void 0 ? Xu.canonizeResults : e;
}
function ud(r, e) {
  return Z(e) ? r.get(e.__ref, "__typename") : e && e.__typename;
}
var ec = /^[_a-z][_0-9a-z]*/i;
function Nt(r) {
  var e = r.match(ec);
  return e ? e[0] : r;
}
function Zi(r, e, t) {
  return fe(e) ? ye(e) ? e.every(function(n) {
    return Zi(r, n, t);
  }) : r.selections.every(function(n) {
    if (Ot(n) && tn(n, t)) {
      var i = At(n);
      return xe.call(e, i) && (!n.selectionSet || Zi(n.selectionSet, e[i], t));
    }
    return !0;
  }) : !1;
}
function er(r) {
  return fe(r) && !Z(r) && !ye(r);
}
function cd() {
  return new Rt();
}
function tc(r, e) {
  var t = Vn(zn(r));
  return {
    fragmentMap: t,
    lookupFragment: function(n) {
      var i = t[n];
      return !i && e && (i = e.lookup(n)), i || null;
    }
  };
}
var Tn = /* @__PURE__ */ Object.create(null), bi = function() {
  return Tn;
}, Ko = /* @__PURE__ */ Object.create(null), Gr = (
  /** @class */
  function() {
    function r(e, t) {
      var n = this;
      this.policies = e, this.group = t, this.data = /* @__PURE__ */ Object.create(null), this.rootIds = /* @__PURE__ */ Object.create(null), this.refs = /* @__PURE__ */ Object.create(null), this.getFieldValue = function(i, s) {
        return zi(Z(i) ? n.get(i.__ref, s) : i && i[s]);
      }, this.canRead = function(i) {
        return Z(i) ? n.has(i.__ref) : typeof i == "object";
      }, this.toReference = function(i, s) {
        if (typeof i == "string")
          return nr(i);
        if (Z(i))
          return i;
        var o = n.policies.identify(i)[0];
        if (o) {
          var a = nr(o);
          return s && n.merge(o, i), a;
        }
      };
    }
    return r.prototype.toObject = function() {
      return x({}, this.data);
    }, r.prototype.has = function(e) {
      return this.lookup(e, !0) !== void 0;
    }, r.prototype.get = function(e, t) {
      if (this.group.depend(e, t), xe.call(this.data, e)) {
        var n = this.data[e];
        if (n && xe.call(n, t))
          return n[t];
      }
      if (t === "__typename" && xe.call(this.policies.rootTypenamesById, e))
        return this.policies.rootTypenamesById[e];
      if (this instanceof vt)
        return this.parent.get(e, t);
    }, r.prototype.lookup = function(e, t) {
      if (t && this.group.depend(e, "__exists"), xe.call(this.data, e))
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
        j(typeof i == "string", 1);
        var a = new Rt(fd).merge(s, o);
        if (this.data[i] = a, a !== s && (delete this.refs[i], this.group.caching)) {
          var u = /* @__PURE__ */ Object.create(null);
          s || (u.__exists = 1), Object.keys(o).forEach(function(f) {
            if (!s || s[f] !== a[f]) {
              u[f] = 1;
              var c = Nt(f);
              c !== f && !n.policies.hasKeyArgs(a.__typename, c) && (u[c] = 1), a[f] === void 0 && !(n instanceof vt) && delete a[f];
            }
          }), u.__typename && !(s && s.__typename) && // Since we return default root __typename strings
          // automatically from store.get, we don't need to dirty the
          // ROOT_QUERY.__typename field if merged.__typename is equal
          // to the default string (usually "Query").
          this.policies.rootTypenamesById[i] === a.__typename && delete u.__typename, Object.keys(u).forEach(function(f) {
            return n.group.dirty(i, f);
          });
        }
      }
    }, r.prototype.modify = function(e, t) {
      var n = this, i = this.lookup(e);
      if (i) {
        var s = /* @__PURE__ */ Object.create(null), o = !1, a = !0, u = {
          DELETE: Tn,
          INVALIDATE: Ko,
          isReference: Z,
          toReference: this.toReference,
          canRead: this.canRead,
          readField: function(f, c) {
            return n.policies.readField(typeof f == "string" ? {
              fieldName: f,
              from: c || nr(e)
            } : f, { store: n });
          }
        };
        if (Object.keys(i).forEach(function(f) {
          var c = Nt(f), d = i[f];
          if (d !== void 0) {
            var p = typeof t == "function" ? t : t[f] || t[c];
            if (p) {
              var y = p === bi ? Tn : p(zi(d), x(x({}, u), { fieldName: c, storeFieldName: f, storage: n.getStorage(e, f) }));
              if (y === Ko)
                n.group.dirty(e, f);
              else if (y === Tn && (y = void 0), y !== d && (s[f] = y, o = !0, d = y, globalThis.__DEV__ !== !1)) {
                var v = function(O) {
                  if (n.lookup(O.__ref) === void 0)
                    return globalThis.__DEV__ !== !1 && j.warn(2, O), !0;
                };
                if (Z(y))
                  v(y);
                else if (Array.isArray(y))
                  for (var w = !1, E = void 0, b = 0, k = y; b < k.length; b++) {
                    var S = k[b];
                    if (Z(S)) {
                      if (w = !0, v(S))
                        break;
                    } else if (typeof S == "object" && S) {
                      var A = n.policies.identify(S)[0];
                      A && (E = S);
                    }
                    if (w && E !== void 0) {
                      globalThis.__DEV__ !== !1 && j.warn(3, E);
                      break;
                    }
                  }
              }
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
        return this.modify(e, a ? (i = {}, i[a] = bi, i) : bi);
      }
      return !1;
    }, r.prototype.evict = function(e, t) {
      var n = !1;
      return e.id && (xe.call(this.data, e.id) && (n = this.delete(e.id, e.fieldName, e.args)), this instanceof vt && this !== t && (n = this.parent.evict(e, t) || n), (e.fieldName || n) && this.group.dirty(e.id, e.fieldName || "__exists")), n;
    }, r.prototype.clear = function() {
      this.replace(null);
    }, r.prototype.extract = function() {
      var e = this, t = this.toObject(), n = [];
      return this.getRootIdSet().forEach(function(i) {
        xe.call(e.policies.rootTypenamesById, i) || n.push(i);
      }), n.length && (t.__META = { extraRootIds: n.sort() }), t;
    }, r.prototype.replace = function(e) {
      var t = this;
      if (Object.keys(this.data).forEach(function(s) {
        e && xe.call(e, s) || t.delete(s);
      }), e) {
        var n = e.__META, i = rt(e, ["__META"]);
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
        xe.call(n, o) && (Object.keys(e.findChildRefIds(o)).forEach(t.add, t), delete n[o]);
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
      if (!xe.call(this.refs, e)) {
        var t = this.refs[e] = /* @__PURE__ */ Object.create(null), n = this.data[e];
        if (!n)
          return t;
        var i = /* @__PURE__ */ new Set([n]);
        i.forEach(function(s) {
          Z(s) && (t[s.__ref] = !0), fe(s) && Object.keys(s).forEach(function(o) {
            var a = s[o];
            fe(a) && i.add(a);
          });
        });
      }
      return this.refs[e];
    }, r.prototype.makeCacheKey = function() {
      return this.group.keyMaker.lookupArray(arguments);
    }, r;
  }()
), rc = (
  /** @class */
  function() {
    function r(e, t) {
      t === void 0 && (t = null), this.caching = e, this.parent = t, this.d = null, this.resetCaching();
    }
    return r.prototype.resetCaching = function() {
      this.d = this.caching ? Du() : null, this.keyMaker = new dr(yr);
    }, r.prototype.depend = function(e, t) {
      if (this.d) {
        this.d(wi(e, t));
        var n = Nt(t);
        n !== t && this.d(wi(e, n)), this.parent && this.parent.depend(e, t);
      }
    }, r.prototype.dirty = function(e, t) {
      this.d && this.d.dirty(
        wi(e, t),
        // When storeFieldName === "__exists", that means the entity identified
        // by dataId has either disappeared from the cache or was newly added,
        // so the result caching system would do well to "forget everything it
        // knows" about that object. To achieve that kind of invalidation, we
        // not only dirty the associated result cache entry, but also remove it
        // completely from the dependency graph. For the optimism implementation
        // details, see https://github.com/benjamn/optimism/pull/195.
        t === "__exists" ? "forget" : "setDirty"
      );
    }, r;
  }()
);
function wi(r, e) {
  return e + "#" + r;
}
function Go(r, e) {
  Lr(r) && r.group.depend(e, "__exists");
}
(function(r) {
  var e = (
    /** @class */
    function(t) {
      He(n, t);
      function n(i) {
        var s = i.policies, o = i.resultCaching, a = o === void 0 ? !0 : o, u = i.seed, f = t.call(this, s, new rc(a)) || this;
        return f.stump = new ld(f), f.storageTrie = new dr(yr), u && f.replace(u), f;
      }
      return n.prototype.addLayer = function(i, s) {
        return this.stump.addLayer(i, s);
      }, n.prototype.removeLayer = function() {
        return this;
      }, n.prototype.getStorage = function() {
        return this.storageTrie.lookupArray(arguments);
      }, n;
    }(r)
  );
  r.Root = e;
})(Gr || (Gr = {}));
var vt = (
  /** @class */
  function(r) {
    He(e, r);
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
        a ? o ? o !== a && Object.keys(o).forEach(function(u) {
          ce(o[u], a[u]) || n.group.dirty(s, u);
        }) : (n.group.dirty(s, "__exists"), Object.keys(a).forEach(function(u) {
          n.group.dirty(s, u);
        })) : n.delete(s);
      }), i) : i === this.parent ? this : i.addLayer(this.id, this.replay);
    }, e.prototype.toObject = function() {
      return x(x({}, this.parent.toObject()), this.data);
    }, e.prototype.findChildRefIds = function(t) {
      var n = this.parent.findChildRefIds(t);
      return xe.call(this.data, t) ? x(x({}, n), r.prototype.findChildRefIds.call(this, t)) : n;
    }, e.prototype.getStorage = function() {
      for (var t = this.parent; t.parent; )
        t = t.parent;
      return t.getStorage.apply(
        t,
        // @ts-expect-error
        arguments
      );
    }, e;
  }(Gr)
), ld = (
  /** @class */
  function(r) {
    He(e, r);
    function e(t) {
      return r.call(this, "EntityStore.Stump", t, function() {
      }, new rc(t.group.caching, t.group)) || this;
    }
    return e.prototype.removeLayer = function() {
      return this;
    }, e.prototype.merge = function(t, n) {
      return this.parent.merge(t, n);
    }, e;
  }(vt)
);
function fd(r, e, t) {
  var n = r[t], i = e[t];
  return ce(n, i) ? n : i;
}
function Lr(r) {
  return !!(r instanceof Gr && r.group.caching);
}
function hd(r) {
  return fe(r) ? ye(r) ? r.slice(0) : x({ __proto__: Object.getPrototypeOf(r) }, r) : r;
}
var Jo = (
  /** @class */
  function() {
    function r() {
      this.known = new (hu ? WeakSet : Set)(), this.pool = new dr(yr), this.passes = /* @__PURE__ */ new WeakMap(), this.keysByJSON = /* @__PURE__ */ new Map(), this.empty = this.admit({});
    }
    return r.prototype.isKnown = function(e) {
      return fe(e) && this.known.has(e);
    }, r.prototype.pass = function(e) {
      if (fe(e)) {
        var t = hd(e);
        return this.passes.set(t, e), t;
      }
      return e;
    }, r.prototype.admit = function(e) {
      var t = this;
      if (fe(e)) {
        var n = this.passes.get(e);
        if (n)
          return n;
        var i = Object.getPrototypeOf(e);
        switch (i) {
          case Array.prototype: {
            if (this.known.has(e))
              return e;
            var s = e.map(this.admit, this), o = this.pool.lookupArray(s);
            return o.array || (this.known.add(o.array = s), globalThis.__DEV__ !== !1 && Object.freeze(s)), o.array;
          }
          case null:
          case Object.prototype: {
            if (this.known.has(e))
              return e;
            var a = Object.getPrototypeOf(e), u = [a], f = this.sortedKeys(e);
            u.push(f.json);
            var c = u.length;
            f.sorted.forEach(function(y) {
              u.push(t.admit(e[y]));
            });
            var o = this.pool.lookupArray(u);
            if (!o.object) {
              var d = o.object = Object.create(a);
              this.known.add(d), f.sorted.forEach(function(y, v) {
                d[y] = u[c + v];
              }), globalThis.__DEV__ !== !1 && Object.freeze(d);
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
  }()
);
function Yo(r) {
  return [
    r.selectionSet,
    r.objectOrReference,
    r.context,
    // We split out this property so we can pass different values
    // independently without modifying options.context itself.
    r.context.canonizeResults
  ];
}
var pd = (
  /** @class */
  function() {
    function r(e) {
      var t = this;
      this.knownResults = new (yr ? WeakMap : Map)(), this.config = fr(e, {
        addTypename: e.addTypename !== !1,
        canonizeResults: Zu(e)
      }), this.canon = e.canon || new Jo(), this.executeSelectionSet = Kr(function(n) {
        var i, s = n.context.canonizeResults, o = Yo(n);
        o[3] = !s;
        var a = (i = t.executeSelectionSet).peek.apply(i, o);
        return a ? s ? x(x({}, a), {
          // If we previously read this result without canonizing it, we can
          // reuse that result simply by canonizing it now.
          result: t.canon.admit(a.result)
        }) : a : (Go(n.context.store, n.enclosingRef.__ref), t.execSelectionSetImpl(n));
      }, {
        max: this.config.resultCacheMaxSize || mt["inMemoryCache.executeSelectionSet"] || 5e4,
        keyArgs: Yo,
        // Note that the parameters of makeCacheKey are determined by the
        // array returned by keyArgs.
        makeCacheKey: function(n, i, s, o) {
          if (Lr(s.store))
            return s.store.makeCacheKey(n, Z(i) ? i.__ref : i, s.varString, o);
        }
      }), this.executeSubSelectedArray = Kr(function(n) {
        return Go(n.context.store, n.enclosingRef.__ref), t.execSubSelectedArrayImpl(n);
      }, {
        max: this.config.resultCacheMaxSize || mt["inMemoryCache.executeSubSelectedArray"] || 1e4,
        makeCacheKey: function(n) {
          var i = n.field, s = n.array, o = n.context;
          if (Lr(o.store))
            return o.store.makeCacheKey(i, s, o.varString);
        }
      });
    }
    return r.prototype.resetCanon = function() {
      this.canon = new Jo();
    }, r.prototype.diffQueryAgainstStore = function(e) {
      var t = e.store, n = e.query, i = e.rootId, s = i === void 0 ? "ROOT_QUERY" : i, o = e.variables, a = e.returnPartialData, u = a === void 0 ? !0 : a, f = e.canonizeResults, c = f === void 0 ? this.config.canonizeResults : f, d = this.config.cache.policies;
      o = x(x({}, ys(Eu(n))), o);
      var p = nr(s), y = this.executeSelectionSet({
        selectionSet: mr(n).selectionSet,
        objectOrReference: p,
        enclosingRef: p,
        context: x({ store: t, query: n, policies: d, variables: o, varString: It(o), canonizeResults: c }, tc(n, this.config.fragments))
      }), v;
      if (y.missing && (v = [
        new Ju(dd(y.missing), y.missing, n, o)
      ], !u))
        throw v[0];
      return {
        result: y.result,
        complete: !v,
        missing: v
      };
    }, r.prototype.isFresh = function(e, t, n, i) {
      if (Lr(i.store) && this.knownResults.get(e) === n) {
        var s = this.executeSelectionSet.peek(
          n,
          t,
          i,
          // If result is canonical, then it could only have been previously
          // cached by the canonizing version of executeSelectionSet, so we can
          // avoid checking both possibilities here.
          this.canon.isKnown(e)
        );
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
      var a = o.variables, u = o.policies, f = o.store, c = f.getFieldValue(i, "__typename"), d = [], p, y = new Rt();
      this.config.addTypename && typeof c == "string" && !u.rootIdsByTypename[c] && d.push({ __typename: c });
      function v(S, A) {
        var O;
        return S.missing && (p = y.merge(p, (O = {}, O[A] = S.missing, O))), S.result;
      }
      var w = new Set(n.selections);
      w.forEach(function(S) {
        var A, O;
        if (tn(S, a))
          if (Ot(S)) {
            var R = u.readField({
              fieldName: S.name.value,
              field: S,
              variables: o.variables,
              from: i
            }, o), D = At(S);
            R === void 0 ? ws.added(S) || (p = y.merge(p, (A = {}, A[D] = "Can't find field '".concat(S.name.value, "' on ").concat(Z(i) ? i.__ref + " object" : "object " + JSON.stringify(i, null, 2)), A))) : ye(R) ? R.length > 0 && (R = v(t.executeSubSelectedArray({
              field: S,
              array: R,
              enclosingRef: s,
              context: o
            }), D)) : S.selectionSet ? R != null && (R = v(t.executeSelectionSet({
              selectionSet: S.selectionSet,
              objectOrReference: R,
              enclosingRef: Z(R) ? R : s,
              context: o
            }), D)) : o.canonizeResults && (R = t.canon.pass(R)), R !== void 0 && d.push((O = {}, O[D] = R, O));
          } else {
            var F = Hn(S, o.lookupFragment);
            if (!F && S.kind === B.FRAGMENT_SPREAD)
              throw Fe(9, S.name.value);
            F && u.fragmentMatches(F, c) && F.selectionSet.selections.forEach(w.add, w);
          }
      });
      var E = Jn(d), b = { result: E, missing: p }, k = o.canonizeResults ? this.canon.admit(b) : zi(b);
      return k.result && this.knownResults.set(k.result, n), k;
    }, r.prototype.execSubSelectedArrayImpl = function(e) {
      var t = this, n = e.field, i = e.array, s = e.enclosingRef, o = e.context, a, u = new Rt();
      function f(c, d) {
        var p;
        return c.missing && (a = u.merge(a, (p = {}, p[d] = c.missing, p))), c.result;
      }
      return n.selectionSet && (i = i.filter(o.store.canRead)), i = i.map(function(c, d) {
        return c === null ? null : ye(c) ? f(t.executeSubSelectedArray({
          field: n,
          array: c,
          enclosingRef: s,
          context: o
        }), d) : n.selectionSet ? f(t.executeSelectionSet({
          selectionSet: n.selectionSet,
          objectOrReference: c,
          enclosingRef: Z(c) ? c : s,
          context: o
        }), d) : (globalThis.__DEV__ !== !1 && yd(o.store, n, c), c);
      }), {
        result: o.canonizeResults ? this.canon.admit(i) : i,
        missing: a
      };
    }, r;
  }()
);
function dd(r) {
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
function yd(r, e, t) {
  if (!e.selectionSet) {
    var n = /* @__PURE__ */ new Set([t]);
    n.forEach(function(i) {
      fe(i) && (j(
        !Z(i),
        10,
        ud(r, i),
        e.name.value
      ), Object.values(i).forEach(n.add, n));
    });
  }
}
var Ts = new _u(), Xo = /* @__PURE__ */ new WeakMap();
function Ur(r) {
  var e = Xo.get(r);
  return e || Xo.set(r, e = {
    vars: /* @__PURE__ */ new Set(),
    dep: Du()
  }), e;
}
function Zo(r) {
  Ur(r).vars.forEach(function(e) {
    return e.forgetCache(r);
  });
}
function md(r) {
  Ur(r).vars.forEach(function(e) {
    return e.attachCache(r);
  });
}
function gd(r) {
  var e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set(), n = function(s) {
    if (arguments.length > 0) {
      if (r !== s) {
        r = s, e.forEach(function(u) {
          Ur(u).dep.dirty(n), vd(u);
        });
        var o = Array.from(t);
        t.clear(), o.forEach(function(u) {
          return u(r);
        });
      }
    } else {
      var a = Ts.getValue();
      a && (i(a), Ur(a).dep(n));
    }
    return r;
  };
  n.onNextChange = function(s) {
    return t.add(s), function() {
      t.delete(s);
    };
  };
  var i = n.attachCache = function(s) {
    return e.add(s), Ur(s).vars.add(n), n;
  };
  return n.forgetCache = function(s) {
    return e.delete(s);
  }, n;
}
function vd(r) {
  r.broadcastWatches && r.broadcastWatches();
}
var ea = /* @__PURE__ */ Object.create(null);
function Is(r) {
  var e = JSON.stringify(r);
  return ea[e] || (ea[e] = /* @__PURE__ */ Object.create(null));
}
function ta(r) {
  var e = Is(r);
  return e.keyFieldsFn || (e.keyFieldsFn = function(t, n) {
    var i = function(o, a) {
      return n.readField(a, o);
    }, s = n.keyObject = As(r, function(o) {
      var a = sr(
        n.storeObject,
        o,
        // Using context.readField to extract paths from context.storeObject
        // allows the extraction to see through Reference objects and respect
        // custom read functions.
        i
      );
      return a === void 0 && t !== n.storeObject && xe.call(t, o[0]) && (a = sr(t, o, ic)), j(a !== void 0, 4, o.join("."), t), a;
    });
    return "".concat(n.typename, ":").concat(JSON.stringify(s));
  });
}
function ra(r) {
  var e = Is(r);
  return e.keyArgsFn || (e.keyArgsFn = function(t, n) {
    var i = n.field, s = n.variables, o = n.fieldName, a = As(r, function(f) {
      var c = f[0], d = c.charAt(0);
      if (d === "@") {
        if (i && nt(i.directives)) {
          var p = c.slice(1), y = i.directives.find(function(b) {
            return b.name.value === p;
          }), v = y && Wn(y, s);
          return v && sr(
            v,
            // If keyPath.length === 1, this code calls extractKeyPath with an
            // empty path, which works because it uses directiveArgs as the
            // extracted value.
            f.slice(1)
          );
        }
        return;
      }
      if (d === "$") {
        var w = c.slice(1);
        if (s && xe.call(s, w)) {
          var E = f.slice(0);
          return E[0] = w, sr(s, E);
        }
        return;
      }
      if (t)
        return sr(t, f);
    }), u = JSON.stringify(a);
    return (t || u !== "{}") && (o += ":" + u), o;
  });
}
function As(r, e) {
  var t = new Rt();
  return nc(r).reduce(function(n, i) {
    var s, o = e(i);
    if (o !== void 0) {
      for (var a = i.length - 1; a >= 0; --a)
        o = (s = {}, s[i[a]] = o, s);
      n = t.merge(n, o);
    }
    return n;
  }, /* @__PURE__ */ Object.create(null));
}
function nc(r) {
  var e = Is(r);
  if (!e.paths) {
    var t = e.paths = [], n = [];
    r.forEach(function(i, s) {
      ye(i) ? (nc(i).forEach(function(o) {
        return t.push(n.concat(o));
      }), n.length = 0) : (n.push(i), ye(r[s + 1]) || (t.push(n.slice(0)), n.length = 0));
    });
  }
  return e.paths;
}
function ic(r, e) {
  return r[e];
}
function sr(r, e, t) {
  return t = t || ic, sc(e.reduce(function n(i, s) {
    return ye(i) ? i.map(function(o) {
      return n(o, s);
    }) : i && t(i, s);
  }, r));
}
function sc(r) {
  return fe(r) ? ye(r) ? r.map(sc) : As(Object.keys(r).sort(), function(e) {
    return sr(r, e);
  }) : r;
}
function es(r) {
  return r.args !== void 0 ? r.args : r.field ? Wn(r.field, r.variables) : null;
}
var bd = function() {
}, na = function(r, e) {
  return e.fieldName;
}, ia = function(r, e, t) {
  var n = t.mergeObjects;
  return n(r, e);
}, sa = function(r, e) {
  return e;
}, wd = (
  /** @class */
  function() {
    function r(e) {
      this.config = e, this.typePolicies = /* @__PURE__ */ Object.create(null), this.toBeAdded = /* @__PURE__ */ Object.create(null), this.supertypeMap = /* @__PURE__ */ new Map(), this.fuzzySubtypes = /* @__PURE__ */ new Map(), this.rootIdsByTypename = /* @__PURE__ */ Object.create(null), this.rootTypenamesById = /* @__PURE__ */ Object.create(null), this.usingPossibleTypes = !1, this.config = x({ dataIdFromObject: Yu }, e), this.cache = this.config.cache, this.setRootTypename("Query"), this.setRootTypename("Mutation"), this.setRootTypename("Subscription"), e.possibleTypes && this.addPossibleTypes(e.possibleTypes), e.typePolicies && this.addTypePolicies(e.typePolicies);
    }
    return r.prototype.identify = function(e, t) {
      var n, i = this, s = t && (t.typename || ((n = t.storeObject) === null || n === void 0 ? void 0 : n.__typename)) || e.__typename;
      if (s === this.rootTypenamesById.ROOT_QUERY)
        return ["ROOT_QUERY"];
      for (var o = t && t.storeObject || e, a = x(x({}, t), { typename: s, storeObject: o, readField: t && t.readField || function() {
        var p = Os(arguments, o);
        return i.readField(p, {
          store: i.cache.data,
          variables: p.variables
        });
      } }), u, f = s && this.getTypePolicy(s), c = f && f.keyFn || this.config.dataIdFromObject; c; ) {
        var d = c(x(x({}, e), o), a);
        if (ye(d))
          c = ta(d);
        else {
          u = d;
          break;
        }
      }
      return u = u ? String(u) : void 0, a.keyObject ? [u, a.keyObject] : [u];
    }, r.prototype.addTypePolicies = function(e) {
      var t = this;
      Object.keys(e).forEach(function(n) {
        var i = e[n], s = i.queryType, o = i.mutationType, a = i.subscriptionType, u = rt(i, ["queryType", "mutationType", "subscriptionType"]);
        s && t.setRootTypename("Query", n), o && t.setRootTypename("Mutation", n), a && t.setRootTypename("Subscription", n), xe.call(t.toBeAdded, n) ? t.toBeAdded[n].push(u) : t.toBeAdded[n] = [u];
      });
    }, r.prototype.updateTypePolicy = function(e, t) {
      var n = this, i = this.getTypePolicy(e), s = t.keyFields, o = t.fields;
      function a(u, f) {
        u.merge = typeof f == "function" ? f : f === !0 ? ia : f === !1 ? sa : u.merge;
      }
      a(i, t.merge), i.keyFn = // Pass false to disable normalization for this typename.
      s === !1 ? bd : ye(s) ? ta(s) : typeof s == "function" ? s : i.keyFn, o && Object.keys(o).forEach(function(u) {
        var f = n.getFieldPolicy(e, u, !0), c = o[u];
        if (typeof c == "function")
          f.read = c;
        else {
          var d = c.keyArgs, p = c.read, y = c.merge;
          f.keyFn = // Pass false to disable argument-based differentiation of
          // field identities.
          d === !1 ? na : ye(d) ? ra(d) : typeof d == "function" ? d : f.keyFn, typeof p == "function" && (f.read = p), a(f, y);
        }
        f.read && f.merge && (f.keyFn = f.keyFn || na);
      });
    }, r.prototype.setRootTypename = function(e, t) {
      t === void 0 && (t = e);
      var n = "ROOT_" + e.toUpperCase(), i = this.rootTypenamesById[n];
      t !== i && (j(!i || i === e, 5, e), i && delete this.rootIdsByTypename[i], this.rootIdsByTypename[t] = n, this.rootTypenamesById[n] = t);
    }, r.prototype.addPossibleTypes = function(e) {
      var t = this;
      this.usingPossibleTypes = !0, Object.keys(e).forEach(function(n) {
        t.getSupertypeSet(n, !0), e[n].forEach(function(i) {
          t.getSupertypeSet(i, !0).add(n);
          var s = i.match(ec);
          (!s || s[0] !== i) && t.fuzzySubtypes.set(i, new RegExp(i));
        });
      });
    }, r.prototype.getTypePolicy = function(e) {
      var t = this;
      if (!xe.call(this.typePolicies, e)) {
        var n = this.typePolicies[e] = /* @__PURE__ */ Object.create(null);
        n.fields = /* @__PURE__ */ Object.create(null);
        var i = this.supertypeMap.get(e);
        !i && this.fuzzySubtypes.size && (i = this.getSupertypeSet(e, !0), this.fuzzySubtypes.forEach(function(o, a) {
          if (o.test(e)) {
            var u = t.supertypeMap.get(a);
            u && u.forEach(function(f) {
              return i.add(f);
            });
          }
        })), i && i.size && i.forEach(function(o) {
          var a = t.getTypePolicy(o), u = a.fields, f = rt(a, ["fields"]);
          Object.assign(n, f), Object.assign(n.fields, u);
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
        for (var a = this.getSupertypeSet(t, !0), u = [a], f = function(v) {
          var w = s.getSupertypeSet(v, !1);
          w && w.size && u.indexOf(w) < 0 && u.push(w);
        }, c = !!(n && this.fuzzySubtypes.size), d = !1, p = 0; p < u.length; ++p) {
          var y = u[p];
          if (y.has(o))
            return a.has(o) || (d && globalThis.__DEV__ !== !1 && j.warn(6, t, o), a.add(o)), !0;
          y.forEach(f), c && // Start checking fuzzy subtypes only after exhausting all
          // non-fuzzy subtypes (after the final iteration of the loop).
          p === u.length - 1 && // We could wait to compare fragment.selectionSet to result
          // after we verify the supertype, but this check is often less
          // expensive than that search, and we will have to do the
          // comparison anyway whenever we find a potential match.
          Zi(e.selectionSet, n, i) && (c = !1, d = !0, this.fuzzySubtypes.forEach(function(v, w) {
            var E = t.match(v);
            E && E[0] === t && f(w);
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
        }, u = es(e); o; ) {
          var f = o(u, a);
          if (ye(f))
            o = ra(f);
          else {
            s = f || n;
            break;
          }
        }
      return s === void 0 && (s = e.field ? Lh(e.field, e.variables) : wu(n, es(e))), s === !1 ? n : n === Nt(s) ? s : n + ":" + s;
    }, r.prototype.readField = function(e, t) {
      var n = e.from;
      if (n) {
        var i = e.field || e.fieldName;
        if (i) {
          if (e.typename === void 0) {
            var s = t.store.getFieldValue(n, "__typename");
            s && (e.typename = s);
          }
          var o = this.getStoreFieldName(e), a = Nt(o), u = t.store.getFieldValue(n, o), f = this.getFieldPolicy(e.typename, a, !1), c = f && f.read;
          if (c) {
            var d = oa(this, n, e, t, t.store.getStorage(Z(n) ? n.__ref : n, o));
            return Ts.withValue(this.cache, c, [
              u,
              d
            ]);
          }
          return u;
        }
      }
    }, r.prototype.getReadFunction = function(e, t) {
      var n = this.getFieldPolicy(e, t, !1);
      return n && n.read;
    }, r.prototype.getMergeFunction = function(e, t, n) {
      var i = this.getFieldPolicy(e, t, !1), s = i && i.merge;
      return !s && n && (i = this.getTypePolicy(n), s = i && i.merge), s;
    }, r.prototype.runMergeFunction = function(e, t, n, i, s) {
      var o = n.field, a = n.typename, u = n.merge;
      return u === ia ? oc(i.store)(e, t) : u === sa ? t : (i.overwrite && (e = void 0), u(e, t, oa(
        this,
        // Unlike options.readField for read functions, we do not fall
        // back to the current object if no foreignObjOrRef is provided,
        // because it's not clear what the current object should be for
        // merge functions: the (possibly undefined) existing object, or
        // the incoming object? If you think your merge function needs
        // to read sibling fields in order to produce a new value for
        // the current field, you might want to rethink your strategy,
        // because that's a recipe for making merge behavior sensitive
        // to the order in which fields are written into the cache.
        // However, readField(name, ref) is useful for merge functions
        // that need to deduplicate child objects and references.
        void 0,
        {
          typename: a,
          fieldName: o.name.value,
          field: o,
          variables: i.variables
        },
        i,
        s || /* @__PURE__ */ Object.create(null)
      )));
    }, r;
  }()
);
function oa(r, e, t, n, i) {
  var s = r.getStoreFieldName(t), o = Nt(s), a = t.variables || n.variables, u = n.store, f = u.toReference, c = u.canRead;
  return {
    args: es(t),
    field: t.field || null,
    fieldName: o,
    storeFieldName: s,
    variables: a,
    isReference: Z,
    toReference: f,
    storage: i,
    cache: r.cache,
    canRead: c,
    readField: function() {
      return r.readField(Os(arguments, e, a), n);
    },
    mergeObjects: oc(n.store)
  };
}
function Os(r, e, t) {
  var n = r[0], i = r[1], s = r.length, o;
  return typeof n == "string" ? o = {
    fieldName: n,
    // Default to objectOrReference only when no second argument was
    // passed for the from parameter, not when undefined is explicitly
    // passed as the second argument.
    from: s > 1 ? i : e
  } : (o = x({}, n), xe.call(o, "from") || (o.from = e)), globalThis.__DEV__ !== !1 && o.from === void 0 && globalThis.__DEV__ !== !1 && j.warn(7, Xa(Array.from(r))), o.variables === void 0 && (o.variables = t), o;
}
function oc(r) {
  return function(t, n) {
    if (ye(t) || ye(n))
      throw Fe(8);
    if (fe(t) && fe(n)) {
      var i = r.getFieldValue(t, "__typename"), s = r.getFieldValue(n, "__typename"), o = i && s && i !== s;
      if (o)
        return n;
      if (Z(t) && er(n))
        return r.merge(t.__ref, n), t;
      if (er(t) && Z(n))
        return r.merge(t, n.__ref), n;
      if (er(t) && er(n))
        return x(x({}, t), n);
    }
    return n;
  };
}
function Ei(r, e, t) {
  var n = "".concat(e).concat(t), i = r.flavors.get(n);
  return i || r.flavors.set(n, i = r.clientOnly === e && r.deferred === t ? r : x(x({}, r), { clientOnly: e, deferred: t })), i;
}
var Ed = (
  /** @class */
  function() {
    function r(e, t, n) {
      this.cache = e, this.reader = t, this.fragments = n;
    }
    return r.prototype.writeToStore = function(e, t) {
      var n = this, i = t.query, s = t.result, o = t.dataId, a = t.variables, u = t.overwrite, f = nn(i), c = cd();
      a = x(x({}, ys(f)), a);
      var d = x(x({ store: e, written: /* @__PURE__ */ Object.create(null), merge: function(y, v) {
        return c.merge(y, v);
      }, variables: a, varString: It(a) }, tc(i, this.fragments)), { overwrite: !!u, incomingById: /* @__PURE__ */ new Map(), clientOnly: !1, deferred: !1, flavors: /* @__PURE__ */ new Map() }), p = this.processSelectionSet({
        result: s || /* @__PURE__ */ Object.create(null),
        dataId: o,
        selectionSet: f.selectionSet,
        mergeTree: { map: /* @__PURE__ */ new Map() },
        context: d
      });
      if (!Z(p))
        throw Fe(11, s);
      return d.incomingById.forEach(function(y, v) {
        var w = y.storeObject, E = y.mergeTree, b = y.fieldNodeSet, k = nr(v);
        if (E && E.map.size) {
          var S = n.applyMerges(E, k, w, d);
          if (Z(S))
            return;
          w = S;
        }
        if (globalThis.__DEV__ !== !1 && !d.overwrite) {
          var A = /* @__PURE__ */ Object.create(null);
          b.forEach(function(D) {
            D.selectionSet && (A[D.name.value] = !0);
          });
          var O = function(D) {
            return A[Nt(D)] === !0;
          }, R = function(D) {
            var F = E && E.map.get(D);
            return !!(F && F.info && F.info.merge);
          };
          Object.keys(w).forEach(function(D) {
            O(D) && !R(D) && _d(k, w, D, d.store);
          });
        }
        e.merge(v, w);
      }), e.retain(p.__ref), p;
    }, r.prototype.processSelectionSet = function(e) {
      var t = this, n = e.dataId, i = e.result, s = e.selectionSet, o = e.context, a = e.mergeTree, u = this.cache.policies, f = /* @__PURE__ */ Object.create(null), c = n && u.rootTypenamesById[n] || ji(i, s, o.fragmentMap) || n && o.store.get(n, "__typename");
      typeof c == "string" && (f.__typename = c);
      var d = function() {
        var S = Os(arguments, f, o.variables);
        if (Z(S.from)) {
          var A = o.incomingById.get(S.from.__ref);
          if (A) {
            var O = u.readField(x(x({}, S), { from: A.storeObject }), o);
            if (O !== void 0)
              return O;
          }
        }
        return u.readField(S, o);
      }, p = /* @__PURE__ */ new Set();
      this.flattenFields(
        s,
        i,
        // This WriteContext will be the default context value for fields returned
        // by the flattenFields method, but some fields may be assigned a modified
        // context, depending on the presence of @client and other directives.
        o,
        c
      ).forEach(function(S, A) {
        var O, R = At(A), D = i[R];
        if (p.add(A), D !== void 0) {
          var F = u.getStoreFieldName({
            typename: c,
            fieldName: A.name.value,
            field: A,
            variables: S.variables
          }), P = aa(a, F), H = t.processFieldValue(
            D,
            A,
            // Reset context.clientOnly and context.deferred to their default
            // values before processing nested selection sets.
            A.selectionSet ? Ei(S, !1, !1) : S,
            P
          ), J = void 0;
          A.selectionSet && (Z(H) || er(H)) && (J = d("__typename", H));
          var Oe = u.getMergeFunction(c, A.name.value, J);
          Oe ? P.info = {
            // TODO Check compatibility against any existing childTree.field?
            field: A,
            typename: c,
            merge: Oe
          } : ua(a, F), f = S.merge(f, (O = {}, O[F] = H, O));
        } else globalThis.__DEV__ !== !1 && !S.clientOnly && !S.deferred && !ws.added(A) && // If the field has a read function, it may be a synthetic field or
        // provide a default value, so its absence from the written data should
        // not be cause for alarm.
        !u.getReadFunction(c, A.name.value) && globalThis.__DEV__ !== !1 && j.error(12, At(A), i);
      });
      try {
        var y = u.identify(i, {
          typename: c,
          selectionSet: s,
          fragmentMap: o.fragmentMap,
          storeObject: f,
          readField: d
        }), v = y[0], w = y[1];
        n = n || v, w && (f = o.merge(f, w));
      } catch (S) {
        if (!n)
          throw S;
      }
      if (typeof n == "string") {
        var E = nr(n), b = o.written[n] || (o.written[n] = []);
        if (b.indexOf(s) >= 0 || (b.push(s), this.reader && this.reader.isFresh(i, E, s, o)))
          return E;
        var k = o.incomingById.get(n);
        return k ? (k.storeObject = o.merge(k.storeObject, f), k.mergeTree = ts(k.mergeTree, a), p.forEach(function(S) {
          return k.fieldNodeSet.add(S);
        })) : o.incomingById.set(n, {
          storeObject: f,
          // Save a reference to mergeTree only if it is not empty, because
          // empty MergeTrees may be recycled by maybeRecycleChildMergeTree and
          // reused for entirely different parts of the result tree.
          mergeTree: Mn(a) ? void 0 : a,
          fieldNodeSet: p
        }), E;
      }
      return f;
    }, r.prototype.processFieldValue = function(e, t, n, i) {
      var s = this;
      return !t.selectionSet || e === null ? globalThis.__DEV__ !== !1 ? qu(e) : e : ye(e) ? e.map(function(o, a) {
        var u = s.processFieldValue(o, t, n, aa(i, a));
        return ua(i, a), u;
      }) : this.processSelectionSet({
        result: e,
        selectionSet: t.selectionSet,
        context: n,
        mergeTree: i
      });
    }, r.prototype.flattenFields = function(e, t, n, i) {
      i === void 0 && (i = ji(t, e, n.fragmentMap));
      var s = /* @__PURE__ */ new Map(), o = this.cache.policies, a = new dr(!1);
      return function u(f, c) {
        var d = a.lookup(
          f,
          // Because we take inheritedClientOnly and inheritedDeferred into
          // consideration here (in addition to selectionSet), it's possible for
          // the same selection set to be flattened more than once, if it appears
          // in the query with different @client and/or @directive configurations.
          c.clientOnly,
          c.deferred
        );
        d.visited || (d.visited = !0, f.selections.forEach(function(p) {
          if (tn(p, n.variables)) {
            var y = c.clientOnly, v = c.deferred;
            if (
              // Since the presence of @client or @defer on this field can only
              // cause clientOnly or deferred to become true, we can skip the
              // forEach loop if both clientOnly and deferred are already true.
              !(y && v) && nt(p.directives) && p.directives.forEach(function(b) {
                var k = b.name.value;
                if (k === "client" && (y = !0), k === "defer") {
                  var S = Wn(b, n.variables);
                  (!S || S.if !== !1) && (v = !0);
                }
              }), Ot(p)
            ) {
              var w = s.get(p);
              w && (y = y && w.clientOnly, v = v && w.deferred), s.set(p, Ei(n, y, v));
            } else {
              var E = Hn(p, n.lookupFragment);
              if (!E && p.kind === B.FRAGMENT_SPREAD)
                throw Fe(13, p.name.value);
              E && o.fragmentMatches(E, i, t, n.variables) && u(E.selectionSet, Ei(n, y, v));
            }
          }
        }));
      }(e, n), s;
    }, r.prototype.applyMerges = function(e, t, n, i, s) {
      var o, a = this;
      if (e.map.size && !Z(n)) {
        var u = (
          // Items in the same position in different arrays are not
          // necessarily related to each other, so when incoming is an array
          // we process its elements as if there was no existing data.
          !ye(n) && // Likewise, existing must be either a Reference or a StoreObject
          // in order for its fields to be safe to merge with the fields of
          // the incoming object.
          (Z(t) || er(t)) ? t : void 0
        ), f = n;
        u && !s && (s = [Z(u) ? u.__ref : u]);
        var c, d = function(p, y) {
          return ye(p) ? typeof y == "number" ? p[y] : void 0 : i.store.getFieldValue(p, String(y));
        };
        e.map.forEach(function(p, y) {
          var v = d(u, y), w = d(f, y);
          if (w !== void 0) {
            s && s.push(y);
            var E = a.applyMerges(p, v, w, i, s);
            E !== w && (c = c || /* @__PURE__ */ new Map(), c.set(y, E)), s && j(s.pop() === y);
          }
        }), c && (n = ye(f) ? f.slice(0) : x({}, f), c.forEach(function(p, y) {
          n[y] = p;
        }));
      }
      return e.info ? this.cache.policies.runMergeFunction(t, n, e.info, i, s && (o = i.store).getStorage.apply(o, s)) : n;
    }, r;
  }()
), ac = [];
function aa(r, e) {
  var t = r.map;
  return t.has(e) || t.set(e, ac.pop() || { map: /* @__PURE__ */ new Map() }), t.get(e);
}
function ts(r, e) {
  if (r === e || !e || Mn(e))
    return r;
  if (!r || Mn(r))
    return e;
  var t = r.info && e.info ? x(x({}, r.info), e.info) : r.info || e.info, n = r.map.size && e.map.size, i = n ? /* @__PURE__ */ new Map() : r.map.size ? r.map : e.map, s = { info: t, map: i };
  if (n) {
    var o = new Set(e.map.keys());
    r.map.forEach(function(a, u) {
      s.map.set(u, ts(a, e.map.get(u))), o.delete(u);
    }), o.forEach(function(a) {
      s.map.set(a, ts(e.map.get(a), r.map.get(a)));
    });
  }
  return s;
}
function Mn(r) {
  return !r || !(r.info || r.map.size);
}
function ua(r, e) {
  var t = r.map, n = t.get(e);
  n && Mn(n) && (ac.push(n), t.delete(e));
}
var ca = /* @__PURE__ */ new Set();
function _d(r, e, t, n) {
  var i = function(d) {
    var p = n.getFieldValue(d, t);
    return typeof p == "object" && p;
  }, s = i(r);
  if (s) {
    var o = i(e);
    if (o && !Z(s) && !ce(s, o) && !Object.keys(s).every(function(d) {
      return n.getFieldValue(o, d) !== void 0;
    })) {
      var a = n.getFieldValue(r, "__typename") || n.getFieldValue(e, "__typename"), u = Nt(t), f = "".concat(a, ".").concat(u);
      if (!ca.has(f)) {
        ca.add(f);
        var c = [];
        !ye(s) && !ye(o) && [s, o].forEach(function(d) {
          var p = n.getFieldValue(d, "__typename");
          typeof p == "string" && !c.includes(p) && c.push(p);
        }), globalThis.__DEV__ !== !1 && j.warn(14, u, a, c.length ? "either ensure all objects of type " + c.join(" and ") + " have an ID or a custom merge function, or " : "", f, x({}, s), x({}, o));
      }
    }
  }
}
var uc = (
  /** @class */
  function(r) {
    He(e, r);
    function e(t) {
      t === void 0 && (t = {});
      var n = r.call(this) || this;
      return n.watches = /* @__PURE__ */ new Set(), n.addTypenameTransform = new Fu(ws), n.assumeImmutableResults = !0, n.makeVar = gd, n.txCount = 0, n.config = ad(t), n.addTypename = !!n.config.addTypename, n.policies = new wd({
        cache: n,
        dataIdFromObject: n.config.dataIdFromObject,
        possibleTypes: n.config.possibleTypes,
        typePolicies: n.config.typePolicies
      }), n.init(), n;
    }
    return e.prototype.init = function() {
      var t = this.data = new Gr.Root({
        policies: this.policies,
        resultCaching: this.config.resultCaching
      });
      this.optimisticData = t.stump, this.resetResultCache();
    }, e.prototype.resetResultCache = function(t) {
      var n = this, i = this.storeReader, s = this.config.fragments;
      this.storeWriter = new Ed(this, this.storeReader = new pd({
        cache: this,
        addTypename: this.addTypename,
        resultCacheMaxSize: this.config.resultCacheMaxSize,
        canonizeResults: Zu(this.config),
        canon: t ? void 0 : i && i.canon,
        fragments: s
      }), s), this.maybeBroadcastWatch = Kr(function(o, a) {
        return n.broadcastWatch(o, a);
      }, {
        max: this.config.resultCacheMaxSize || mt["inMemoryCache.maybeBroadcastWatch"] || 5e3,
        makeCacheKey: function(o) {
          var a = o.optimistic ? n.optimisticData : n.data;
          if (Lr(a)) {
            var u = o.optimistic, f = o.id, c = o.variables;
            return a.makeCacheKey(
              o.query,
              // Different watches can have the same query, optimistic
              // status, rootId, and variables, but if their callbacks are
              // different, the (identical) result needs to be delivered to
              // each distinct callback. The easiest way to achieve that
              // separation is to include c.callback in the cache key for
              // maybeBroadcastWatch calls. See issue #5733.
              o.callback,
              It({ optimistic: u, id: f, variables: c })
            );
          }
        }
      }), (/* @__PURE__ */ new Set([this.data.group, this.optimisticData.group])).forEach(function(o) {
        return o.resetCaching();
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
        if (s instanceof Ju)
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
      if (xe.call(t, "id") && !t.id)
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
      return this.watches.size || md(this), this.watches.add(t), t.immediate && this.maybeBroadcastWatch(t), function() {
        n.watches.delete(t) && !n.watches.size && Zo(n), n.maybeBroadcastWatch.forget(t);
      };
    }, e.prototype.gc = function(t) {
      var n;
      It.reset(), sn.reset(), this.addTypenameTransform.resetCache(), (n = this.config.fragments) === null || n === void 0 || n.resetCaches();
      var i = this.optimisticData.gc();
      return t && !this.txCount && (t.resetResultCache ? this.resetResultCache(t.resetResultIdentities) : t.resetResultIdentities && this.storeReader.resetCanon()), i;
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
        globalThis.__DEV__ !== !1 && j.warn(n);
      }
    }, e.prototype.evict = function(t) {
      if (!t.id) {
        if (xe.call(t, "id"))
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
      return this.init(), It.reset(), t && t.discardWatches ? (this.watches.forEach(function(i) {
        return n.maybeBroadcastWatch.forget(i);
      }), this.watches.clear(), Zo(this)) : this.broadcastWatches(), Promise.resolve();
    }, e.prototype.removeOptimistic = function(t) {
      var n = this.optimisticData.removeLayer(t);
      n !== this.optimisticData && (this.optimisticData = n, this.broadcastWatches());
    }, e.prototype.batch = function(t) {
      var n = this, i = t.update, s = t.optimistic, o = s === void 0 ? !0 : s, a = t.removeOptimistic, u = t.onWatchUpdated, f, c = function(p) {
        var y = n, v = y.data, w = y.optimisticData;
        ++n.txCount, p && (n.data = n.optimisticData = p);
        try {
          return f = i(n);
        } finally {
          --n.txCount, n.data = v, n.optimisticData = w;
        }
      }, d = /* @__PURE__ */ new Set();
      return u && !this.txCount && this.broadcastWatches(x(x({}, t), { onWatchUpdated: function(p) {
        return d.add(p), !1;
      } })), typeof o == "string" ? this.optimisticData = this.optimisticData.addLayer(o, c) : o === !1 ? c(this.data) : c(), typeof a == "string" && (this.optimisticData = this.optimisticData.removeLayer(a)), u && d.size ? (this.broadcastWatches(x(x({}, t), { onWatchUpdated: function(p, y) {
        var v = u.call(this, p, y);
        return v !== !1 && d.delete(p), v;
      } })), d.size && d.forEach(function(p) {
        return n.maybeBroadcastWatch.dirty(p);
      })) : this.broadcastWatches(t), f;
    }, e.prototype.performTransaction = function(t, n) {
      return this.batch({
        update: t,
        optimistic: n || n !== null
      });
    }, e.prototype.transformDocument = function(t) {
      return this.addTypenameToDocument(this.addFragmentsToDocument(t));
    }, e.prototype.broadcastWatches = function(t) {
      var n = this;
      this.txCount || this.watches.forEach(function(i) {
        return n.maybeBroadcastWatch(i, t);
      });
    }, e.prototype.addFragmentsToDocument = function(t) {
      var n = this.config.fragments;
      return n ? n.transform(t) : t;
    }, e.prototype.addTypenameToDocument = function(t) {
      return this.addTypename ? this.addTypenameTransform.transformDocument(t) : t;
    }, e.prototype.broadcastWatch = function(t, n) {
      var i = t.lastDiff, s = this.diff(t);
      n && (t.optimistic && typeof n.optimistic == "string" && (s.fromOptimisticTransaction = !0), n.onWatchUpdated && n.onWatchUpdated.call(this, t, s, i) === !1) || (!i || !ce(i.result, s.result)) && t.callback(t.lastDiff = s, i);
    }, e;
  }(Gu)
);
globalThis.__DEV__ !== !1 && (uc.prototype.getMemoryInternals = Eh);
var ne;
(function(r) {
  r[r.loading = 1] = "loading", r[r.setVariables = 2] = "setVariables", r[r.fetchMore = 3] = "fetchMore", r[r.refetch = 4] = "refetch", r[r.poll = 6] = "poll", r[r.ready = 7] = "ready", r[r.error = 8] = "error";
})(ne || (ne = {}));
function Jr(r) {
  return r ? r < 7 : !1;
}
var la = Object.assign, Sd = Object.hasOwnProperty, rs = (
  /** @class */
  function(r) {
    He(e, r);
    function e(t) {
      var n = t.queryManager, i = t.queryInfo, s = t.options, o = r.call(this, function(E) {
        try {
          var b = E._subscription._observer;
          b && !b.error && (b.error = kd);
        } catch (A) {
        }
        var k = !o.observers.size;
        o.observers.add(E);
        var S = o.last;
        return S && S.error ? E.error && E.error(S.error) : S && S.result && E.next && E.next(S.result), k && o.reobserve().catch(function() {
        }), function() {
          o.observers.delete(E) && !o.observers.size && o.tearDownQuery();
        };
      }) || this;
      o.observers = /* @__PURE__ */ new Set(), o.subscriptions = /* @__PURE__ */ new Set(), o.queryInfo = i, o.queryManager = n, o.waitForOwnResult = _i(s.fetchPolicy), o.isTornDown = !1, o.subscribeToMore = o.subscribeToMore.bind(o);
      var a = n.defaultOptions.watchQuery, u = a === void 0 ? {} : a, f = u.fetchPolicy, c = f === void 0 ? "cache-first" : f, d = s.fetchPolicy, p = d === void 0 ? c : d, y = s.initialFetchPolicy, v = y === void 0 ? p === "standby" ? c : p : y;
      o.options = x(x({}, s), {
        // Remember the initial options.fetchPolicy so we can revert back to this
        // policy when variables change. This information can also be specified
        // (or overridden) by providing options.initialFetchPolicy explicitly.
        initialFetchPolicy: v,
        // This ensures this.options.fetchPolicy always has a string value, in
        // case options.fetchPolicy was not provided.
        fetchPolicy: p
      }), o.queryId = i.queryId || n.generateQueryId();
      var w = nn(o.query);
      return o.queryName = w && w.name && w.name.value, o;
    }
    return Object.defineProperty(e.prototype, "query", {
      // The `query` computed property will always reflect the document transformed
      // by the last run query. `this.options.query` will always reflect the raw
      // untransformed query to ensure document transforms with runtime conditionals
      // are run on the original document.
      get: function() {
        return this.lastQuery || this.options.query;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "variables", {
      // Computed shorthand for this.options.variables, preserved for
      // backwards compatibility.
      /**
       * An object containing the variables that were provided for the query.
       */
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
    }, e.prototype.resetDiff = function() {
      this.queryInfo.resetDiff();
    }, e.prototype.getCurrentResult = function(t) {
      t === void 0 && (t = !0);
      var n = this.getLastResult(!0), i = this.queryInfo.networkStatus || n && n.networkStatus || ne.ready, s = x(x({}, n), { loading: Jr(i), networkStatus: i }), o = this.options.fetchPolicy, a = o === void 0 ? "cache-first" : o;
      if (
        // These fetch policies should never deliver data from the cache, unless
        // redelivering a previously delivered result.
        !(_i(a) || // If this.options.query has @client(always: true) fields, we cannot
        // trust diff.result, since it was read from the cache without running
        // local resolvers (and it's too late to run resolvers now, since we must
        // return a result synchronously).
        this.queryManager.getDocumentInfo(this.query).hasForcedResolvers)
      ) if (this.waitForOwnResult)
        this.queryInfo.updateWatch();
      else {
        var u = this.queryInfo.getDiff();
        (u.complete || this.options.returnPartialData) && (s.data = u.result), ce(s.data, {}) && (s.data = void 0), u.complete ? (delete s.partial, u.complete && s.networkStatus === ne.loading && (a === "cache-first" || a === "cache-only") && (s.networkStatus = ne.ready, s.loading = !1)) : s.partial = !0, globalThis.__DEV__ !== !1 && !u.complete && !this.options.partialRefetch && !s.loading && !s.data && !s.error && lc(u.missing);
      }
      return t && this.updateLastResult(s), s;
    }, e.prototype.isDifferentFromLastResult = function(t, n) {
      if (!this.last)
        return !0;
      var i = this.queryManager.getDocumentInfo(this.query).hasNonreactiveDirective ? !Ku(this.query, this.last.result, t, this.variables) : !ce(this.last.result, t);
      return i || n && !ce(this.last.variables, n);
    }, e.prototype.getLast = function(t, n) {
      var i = this.last;
      if (i && i[t] && (!n || ce(i.variables, this.variables)))
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
        // Always disable polling for refetches.
        pollInterval: 0
      }, s = this.options.fetchPolicy;
      if (s === "cache-and-network" ? i.fetchPolicy = s : s === "no-cache" ? i.fetchPolicy = "no-cache" : i.fetchPolicy = "network-only", globalThis.__DEV__ !== !1 && t && Sd.call(t, "variables")) {
        var o = Eu(this.query), a = o.variableDefinitions;
        (!a || !a.some(function(u) {
          return u.variable.name.value === "variables";
        })) && globalThis.__DEV__ !== !1 && j.warn(
          20,
          t,
          ((n = o.name) === null || n === void 0 ? void 0 : n.value) || o
        );
      }
      return t && !ce(this.options.variables, t) && (i.variables = this.options.variables = x(x({}, this.options.variables), t)), this.queryInfo.resetLastWrite(), this.reobserve(i, ne.refetch);
    }, e.prototype.fetchMore = function(t) {
      var n = this, i = x(x({}, t.query ? t : x(x(x(x({}, this.options), { query: this.options.query }), t), { variables: x(x({}, this.options.variables), t.variables) })), {
        // The fetchMore request goes immediately to the network and does
        // not automatically write its result to the cache (hence no-cache
        // instead of network-only), because we allow the caller of
        // fetchMore to provide an updateQuery callback that determines how
        // the data gets written to the cache.
        fetchPolicy: "no-cache"
      });
      i.query = this.transformDocument(i.query);
      var s = this.queryManager.generateQueryId();
      this.lastQuery = t.query ? this.transformDocument(this.options.query) : i.query;
      var o = this.queryInfo, a = o.networkStatus;
      o.networkStatus = ne.fetchMore, i.notifyOnNetworkStatusChange && this.observe();
      var u = /* @__PURE__ */ new Set(), f = t == null ? void 0 : t.updateQuery, c = this.options.fetchPolicy !== "no-cache";
      return c || j(f, 21), this.queryManager.fetchQuery(s, i, ne.fetchMore).then(function(d) {
        if (n.queryManager.removeQuery(s), o.networkStatus === ne.fetchMore && (o.networkStatus = a), c)
          n.queryManager.cache.batch({
            update: function(v) {
              var w = t.updateQuery;
              w ? v.updateQuery({
                query: n.query,
                variables: n.variables,
                returnPartialData: !0,
                optimistic: !1
              }, function(E) {
                return w(E, {
                  fetchMoreResult: d.data,
                  variables: i.variables
                });
              }) : v.writeQuery({
                query: i.query,
                variables: i.variables,
                data: d.data
              });
            },
            onWatchUpdated: function(v) {
              u.add(v.query);
            }
          });
        else {
          var p = n.getLast("result"), y = f(p.data, {
            fetchMoreResult: d.data,
            variables: i.variables
          });
          n.reportResult(x(x({}, p), { data: y }), n.variables);
        }
        return d;
      }).finally(function() {
        c && !u.has(n.query) && cc(n);
      });
    }, e.prototype.subscribeToMore = function(t) {
      var n = this, i = this.queryManager.startGraphQLSubscription({
        query: t.document,
        variables: t.variables,
        context: t.context
      }).subscribe({
        next: function(s) {
          var o = t.updateQuery;
          o && n.updateQuery(function(a, u) {
            var f = u.variables;
            return o(a, {
              subscriptionData: s,
              variables: f
            });
          });
        },
        error: function(s) {
          if (t.onError) {
            t.onError(s);
            return;
          }
          globalThis.__DEV__ !== !1 && j.error(22, s);
        }
      });
      return this.subscriptions.add(i), function() {
        n.subscriptions.delete(i) && i.unsubscribe();
      };
    }, e.prototype.setOptions = function(t) {
      return this.reobserve(t);
    }, e.prototype.silentSetOptions = function(t) {
      var n = fr(this.options, t || {});
      la(this.options, n);
    }, e.prototype.setVariables = function(t) {
      return ce(this.variables, t) ? this.observers.size ? this.result() : Promise.resolve() : (this.options.variables = t, this.observers.size ? this.reobserve({
        // Reset options.fetchPolicy to its original value.
        fetchPolicy: this.options.initialFetchPolicy,
        variables: t
      }, ne.setVariables) : Promise.resolve());
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
    }, e.prototype.applyNextFetchPolicy = function(t, n) {
      if (n.nextFetchPolicy) {
        var i = n.fetchPolicy, s = i === void 0 ? "cache-first" : i, o = n.initialFetchPolicy, a = o === void 0 ? s : o;
        s === "standby" || (typeof n.nextFetchPolicy == "function" ? n.fetchPolicy = n.nextFetchPolicy(s, {
          reason: t,
          options: n,
          observable: this,
          initialFetchPolicy: a
        }) : t === "variables-changed" ? n.fetchPolicy = a : n.fetchPolicy = n.nextFetchPolicy);
      }
      return n.fetchPolicy;
    }, e.prototype.fetch = function(t, n, i) {
      return this.queryManager.setObservableQuery(this), this.queryManager.fetchConcastWithInfo(this.queryId, t, n, i);
    }, e.prototype.updatePolling = function() {
      var t = this;
      if (!this.queryManager.ssrMode) {
        var n = this, i = n.pollingInfo, s = n.options.pollInterval;
        if (!s || !this.hasObservers()) {
          i && (clearTimeout(i.timeout), delete this.pollingInfo);
          return;
        }
        if (!(i && i.interval === s)) {
          j(s, 23);
          var o = i || (this.pollingInfo = {});
          o.interval = s;
          var a = function() {
            var f, c;
            t.pollingInfo && (!Jr(t.queryInfo.networkStatus) && !(!((c = (f = t.options).skipPollAttempt) === null || c === void 0) && c.call(f)) ? t.reobserve({
              // Most fetchPolicy options don't make sense to use in a polling context, as
              // users wouldn't want to be polling the cache directly. However, network-only and
              // no-cache are both useful for when the user wants to control whether or not the
              // polled results are written to the cache.
              fetchPolicy: t.options.initialFetchPolicy === "no-cache" ? "no-cache" : "network-only"
            }, ne.poll).then(u, u) : u());
          }, u = function() {
            var f = t.pollingInfo;
            f && (clearTimeout(f.timeout), f.timeout = setTimeout(a, f.interval));
          };
          u();
        }
      }
    }, e.prototype.updateLastResult = function(t, n) {
      n === void 0 && (n = this.variables);
      var i = this.getLastError();
      return i && this.last && !ce(n, this.last.variables) && (i = void 0), this.last = x({ result: this.queryManager.assumeImmutableResults ? t : qu(t), variables: n }, i ? { error: i } : null);
    }, e.prototype.reobserveAsConcast = function(t, n) {
      var i = this;
      this.isTornDown = !1;
      var s = (
        // Refetching uses a disposable Concast to allow refetches using different
        // options/variables, without permanently altering the options of the
        // original ObservableQuery.
        n === ne.refetch || // The fetchMore method does not actually call the reobserve method, but,
        // if it did, it would definitely use a disposable Concast.
        n === ne.fetchMore || // Polling uses a disposable Concast so the polling options (which force
        // fetchPolicy to be "network-only" or "no-cache") won't override the original options.
        n === ne.poll
      ), o = this.options.variables, a = this.options.fetchPolicy, u = fr(this.options, t || {}), f = s ? (
        // Disposable Concast fetches receive a shallow copy of this.options
        // (merged with newOptions), leaving this.options unmodified.
        u
      ) : la(this.options, u), c = this.transformDocument(f.query);
      this.lastQuery = c, s || (this.updatePolling(), t && t.variables && !ce(t.variables, o) && // Don't mess with the fetchPolicy if it's currently "standby".
      f.fetchPolicy !== "standby" && // If we're changing the fetchPolicy anyway, don't try to change it here
      // using applyNextFetchPolicy. The explicit options.fetchPolicy wins.
      (f.fetchPolicy === a || // A `nextFetchPolicy` function has even higher priority, though,
      // so in that case `applyNextFetchPolicy` must be called.
      typeof f.nextFetchPolicy == "function") && (this.applyNextFetchPolicy("variables-changed", f), n === void 0 && (n = ne.setVariables))), this.waitForOwnResult && (this.waitForOwnResult = _i(f.fetchPolicy));
      var d = function() {
        i.concast === v && (i.waitForOwnResult = !1);
      }, p = f.variables && x({}, f.variables), y = this.fetch(f, n, c), v = y.concast, w = y.fromLink, E = {
        next: function(b) {
          ce(i.variables, p) && (d(), i.reportResult(b, p));
        },
        error: function(b) {
          ce(i.variables, p) && (Hu(b) || (b = new St({ networkError: b })), d(), i.reportError(b, p));
        }
      };
      return !s && (w || !this.concast) && (this.concast && this.observer && this.concast.removeObserver(this.observer), this.concast = v, this.observer = E), v.addObserver(E), v;
    }, e.prototype.reobserve = function(t, n) {
      return this.reobserveAsConcast(t, n).promise;
    }, e.prototype.resubscribeAfterError = function() {
      for (var t = [], n = 0; n < arguments.length; n++)
        t[n] = arguments[n];
      var i = this.last;
      this.resetLastResults();
      var s = this.subscribe.apply(this, t);
      return this.last = i, s;
    }, e.prototype.observe = function() {
      this.reportResult(
        // Passing false is important so that this.getCurrentResult doesn't
        // save the fetchMore result as this.lastResult, causing it to be
        // ignored due to the this.isDifferentFromLastResult check in
        // this.reportResult.
        this.getCurrentResult(!1),
        this.variables
      );
    }, e.prototype.reportResult = function(t, n) {
      var i = this.getLastError(), s = this.isDifferentFromLastResult(t, n);
      (i || !t.partial || this.options.returnPartialData) && this.updateLastResult(t, n), (i || s) && Pr(this.observers, "next", t);
    }, e.prototype.reportError = function(t, n) {
      var i = x(x({}, this.getLastResult()), { error: t, errors: t.graphQLErrors, networkStatus: ne.error, loading: !1 });
      this.updateLastResult(i, n), Pr(this.observers, "error", this.last.error = t);
    }, e.prototype.hasObservers = function() {
      return this.observers.size > 0;
    }, e.prototype.tearDownQuery = function() {
      this.isTornDown || (this.concast && this.observer && (this.concast.removeObserver(this.observer), delete this.concast, delete this.observer), this.stopPolling(), this.subscriptions.forEach(function(t) {
        return t.unsubscribe();
      }), this.subscriptions.clear(), this.queryManager.stopQuery(this.queryId), this.observers.clear(), this.isTornDown = !0);
    }, e.prototype.transformDocument = function(t) {
      return this.queryManager.transform(t);
    }, e;
  }(re)
);
ju(rs);
function cc(r) {
  var e = r.options, t = e.fetchPolicy, n = e.nextFetchPolicy;
  return t === "cache-and-network" || t === "network-only" ? r.reobserve({
    fetchPolicy: "cache-first",
    // Use a temporary nextFetchPolicy function that replaces itself with the
    // previous nextFetchPolicy value and returns the original fetchPolicy.
    nextFetchPolicy: function(i, s) {
      return this.nextFetchPolicy = n, typeof this.nextFetchPolicy == "function" ? this.nextFetchPolicy(i, s) : t;
    }
  }) : r.reobserve();
}
function kd(r) {
  globalThis.__DEV__ !== !1 && j.error(24, r.message, r.stack);
}
function lc(r) {
  globalThis.__DEV__ !== !1 && r && globalThis.__DEV__ !== !1 && j.debug(25, r);
}
function _i(r) {
  return r === "network-only" || r === "no-cache" || r === "standby";
}
var tr = new (yr ? WeakMap : Map)();
function Si(r, e) {
  var t = r[e];
  typeof t == "function" && (r[e] = function() {
    return tr.set(
      r,
      // The %1e15 allows the count to wrap around to 0 safely every
      // quadrillion evictions, so there's no risk of overflow. To be
      // clear, this is more of a pedantic principle than something
      // that matters in any conceivable practical scenario.
      (tr.get(r) + 1) % 1e15
    ), t.apply(this, arguments);
  });
}
function fa(r) {
  r.notifyTimeout && (clearTimeout(r.notifyTimeout), r.notifyTimeout = void 0);
}
var ki = (
  /** @class */
  function() {
    function r(e, t) {
      t === void 0 && (t = e.generateQueryId()), this.queryId = t, this.listeners = /* @__PURE__ */ new Set(), this.document = null, this.lastRequestId = 1, this.stopped = !1, this.dirty = !1, this.observableQuery = null;
      var n = this.cache = e.cache;
      tr.has(n) || (tr.set(n, 0), Si(n, "evict"), Si(n, "modify"), Si(n, "reset"));
    }
    return r.prototype.init = function(e) {
      var t = e.networkStatus || ne.loading;
      return this.variables && this.networkStatus !== ne.loading && !ce(this.variables, e.variables) && (t = ne.setVariables), ce(e.variables, this.variables) || (this.lastDiff = void 0), Object.assign(this, {
        document: e.document,
        variables: e.variables,
        networkError: null,
        graphQLErrors: this.graphQLErrors || [],
        networkStatus: t
      }), e.observableQuery && this.setObservableQuery(e.observableQuery), e.lastRequestId && (this.lastRequestId = e.lastRequestId), this;
    }, r.prototype.reset = function() {
      fa(this), this.dirty = !1;
    }, r.prototype.resetDiff = function() {
      this.lastDiff = void 0;
    }, r.prototype.getDiff = function() {
      var e = this.getDiffOptions();
      if (this.lastDiff && ce(e, this.lastDiff.options))
        return this.lastDiff.diff;
      this.updateWatch(this.variables);
      var t = this.observableQuery;
      if (t && t.options.fetchPolicy === "no-cache")
        return { complete: !1 };
      var n = this.cache.diff(e);
      return this.updateLastDiff(n, e), n;
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
      var t = this, n, i = this.lastDiff && this.lastDiff.diff;
      e && !e.complete && (!((n = this.observableQuery) === null || n === void 0) && n.getLastError()) || (this.updateLastDiff(e), !this.dirty && !ce(i && i.result, e && e.result) && (this.dirty = !0, this.notifyTimeout || (this.notifyTimeout = setTimeout(function() {
        return t.notify();
      }, 0))));
    }, r.prototype.setObservableQuery = function(e) {
      var t = this;
      e !== this.observableQuery && (this.oqListener && this.listeners.delete(this.oqListener), this.observableQuery = e, e ? (e.queryInfo = this, this.listeners.add(this.oqListener = function() {
        var n = t.getDiff();
        n.fromOptimisticTransaction ? e.observe() : cc(e);
      })) : delete this.oqListener);
    }, r.prototype.notify = function() {
      var e = this;
      fa(this), this.shouldNotify() && this.listeners.forEach(function(t) {
        return t(e);
      }), this.dirty = !1;
    }, r.prototype.shouldNotify = function() {
      if (!this.dirty || !this.listeners.size)
        return !1;
      if (Jr(this.networkStatus) && this.observableQuery) {
        var e = this.observableQuery.options.fetchPolicy;
        if (e !== "cache-only" && e !== "cache-and-network")
          return !1;
      }
      return !0;
    }, r.prototype.stop = function() {
      if (!this.stopped) {
        this.stopped = !0, this.reset(), this.cancel(), this.cancel = r.prototype.cancel;
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
        (!this.lastWatch || !ce(i, this.lastWatch)) && (this.cancel(), this.cancel = this.cache.watch(this.lastWatch = i));
      }
    }, r.prototype.resetLastWrite = function() {
      this.lastWrite = void 0;
    }, r.prototype.shouldWrite = function(e, t) {
      var n = this.lastWrite;
      return !(n && // If cache.evict has been called since the last time we wrote this
      // data into the cache, there's a chance writing this result into
      // the cache will repair what was evicted.
      n.dmCount === tr.get(this.cache) && ce(t, n.variables) && ce(e.data, n.result.data));
    }, r.prototype.markResult = function(e, t, n, i) {
      var s = this, o = new Rt(), a = nt(e.errors) ? e.errors.slice(0) : [];
      if (this.reset(), "incremental" in e && nt(e.incremental)) {
        var u = Qu(this.getDiff().result, e);
        e.data = u;
      } else if ("hasNext" in e && e.hasNext) {
        var f = this.getDiff();
        e.data = o.merge(f.result, e.data);
      }
      this.graphQLErrors = a, n.fetchPolicy === "no-cache" ? this.updateLastDiff({ result: e.data, complete: !0 }, this.getDiffOptions(n.variables)) : i !== 0 && (ns(e, n.errorPolicy) ? this.cache.performTransaction(function(c) {
        if (s.shouldWrite(e, n.variables))
          c.writeQuery({
            query: t,
            data: e.data,
            variables: n.variables,
            overwrite: i === 1
          }), s.lastWrite = {
            result: e,
            variables: n.variables,
            dmCount: tr.get(s.cache)
          };
        else if (s.lastDiff && s.lastDiff.diff.complete) {
          e.data = s.lastDiff.diff.result;
          return;
        }
        var d = s.getDiffOptions(n.variables), p = c.diff(d);
        !s.stopped && ce(s.variables, n.variables) && s.updateWatch(n.variables), s.updateLastDiff(p, d), p.complete && (e.data = p.result);
      }) : this.lastWrite = void 0);
    }, r.prototype.markReady = function() {
      return this.networkError = null, this.networkStatus = ne.ready;
    }, r.prototype.markError = function(e) {
      return this.networkStatus = ne.error, this.lastWrite = void 0, this.reset(), e.graphQLErrors && (this.graphQLErrors = e.graphQLErrors), e.networkError && (this.networkError = e.networkError), e;
    }, r;
  }()
);
function ns(r, e) {
  e === void 0 && (e = "none");
  var t = e === "ignore" || e === "all", n = !kn(r);
  return !n && t && r.data && (n = !0), n;
}
var xd = Object.prototype.hasOwnProperty, ha = /* @__PURE__ */ Object.create(null), Td = (
  /** @class */
  function() {
    function r(e) {
      var t = this;
      this.clientAwareness = {}, this.queries = /* @__PURE__ */ new Map(), this.fetchCancelFns = /* @__PURE__ */ new Map(), this.transformCache = new yu(
        mt["queryManager.getDocumentInfo"] || 2e3
        /* defaultCacheSizes["queryManager.getDocumentInfo"] */
      ), this.queryIdCounter = 1, this.requestIdCounter = 1, this.mutationIdCounter = 1, this.inFlightLinkObservables = new dr(!1);
      var n = new Fu(
        function(s) {
          return t.cache.transformDocument(s);
        },
        // Allow the apollo cache to manage its own transform caches
        { cache: !1 }
      );
      this.cache = e.cache, this.link = e.link, this.defaultOptions = e.defaultOptions, this.queryDeduplication = e.queryDeduplication, this.clientAwareness = e.clientAwareness, this.localState = e.localState, this.ssrMode = e.ssrMode, this.assumeImmutableResults = e.assumeImmutableResults;
      var i = e.documentTransform;
      this.documentTransform = i ? n.concat(i).concat(n) : n, this.defaultContext = e.defaultContext || /* @__PURE__ */ Object.create(null), (this.onBroadcast = e.onBroadcast) && (this.mutationStore = /* @__PURE__ */ Object.create(null));
    }
    return r.prototype.stop = function() {
      var e = this;
      this.queries.forEach(function(t, n) {
        e.stopQueryNoBroadcast(n);
      }), this.cancelPendingFetches(Fe(26));
    }, r.prototype.cancelPendingFetches = function(e) {
      this.fetchCancelFns.forEach(function(t) {
        return t(e);
      }), this.fetchCancelFns.clear();
    }, r.prototype.mutate = function(e) {
      return wt(this, arguments, void 0, function(t) {
        var n, i, s, o, a, u, f, c = t.mutation, d = t.variables, p = t.optimisticResponse, y = t.updateQueries, v = t.refetchQueries, w = v === void 0 ? [] : v, E = t.awaitRefetchQueries, b = E === void 0 ? !1 : E, k = t.update, S = t.onQueryUpdated, A = t.fetchPolicy, O = A === void 0 ? ((u = this.defaultOptions.mutate) === null || u === void 0 ? void 0 : u.fetchPolicy) || "network-only" : A, R = t.errorPolicy, D = R === void 0 ? ((f = this.defaultOptions.mutate) === null || f === void 0 ? void 0 : f.errorPolicy) || "none" : R, F = t.keepRootFields, P = t.context;
        return Et(this, function(H) {
          switch (H.label) {
            case 0:
              return j(c, 27), j(O === "network-only" || O === "no-cache", 28), n = this.generateMutationId(), c = this.cache.transformForLink(this.transform(c)), i = this.getDocumentInfo(c).hasClientExports, d = this.getVariables(c, d), i ? [4, this.localState.addExportedVariables(c, d, P)] : [3, 2];
            case 1:
              d = H.sent(), H.label = 2;
            case 2:
              return s = this.mutationStore && (this.mutationStore[n] = {
                mutation: c,
                variables: d,
                loading: !0,
                error: null
              }), o = p && this.markMutationOptimistic(p, {
                mutationId: n,
                document: c,
                variables: d,
                fetchPolicy: O,
                errorPolicy: D,
                context: P,
                updateQueries: y,
                update: k,
                keepRootFields: F
              }), this.broadcastQueries(), a = this, [2, new Promise(function(J, Oe) {
                return mi(a.getObservableFromLink(c, x(x({}, P), { optimisticResponse: o ? p : void 0 }), d, {}, !1), function(ie) {
                  if (kn(ie) && D === "none")
                    throw new St({
                      graphQLErrors: Ki(ie)
                    });
                  s && (s.loading = !1, s.error = null);
                  var ke = x({}, ie);
                  return typeof w == "function" && (w = w(ke)), D === "ignore" && kn(ke) && delete ke.errors, a.markMutationResult({
                    mutationId: n,
                    result: ke,
                    document: c,
                    variables: d,
                    fetchPolicy: O,
                    errorPolicy: D,
                    context: P,
                    update: k,
                    updateQueries: y,
                    awaitRefetchQueries: b,
                    refetchQueries: w,
                    removeOptimistic: o ? n : void 0,
                    onQueryUpdated: S,
                    keepRootFields: F
                  });
                }).subscribe({
                  next: function(ie) {
                    a.broadcastQueries(), (!("hasNext" in ie) || ie.hasNext === !1) && J(ie);
                  },
                  error: function(ie) {
                    s && (s.loading = !1, s.error = ie), o && a.cache.removeOptimistic(n), a.broadcastQueries(), Oe(ie instanceof St ? ie : new St({
                      networkError: ie
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
      if (!o && ns(i, e.errorPolicy)) {
        if (ir(i) || s.push({
          result: i.data,
          dataId: "ROOT_MUTATION",
          query: e.document,
          variables: e.variables
        }), ir(i) && nt(i.incremental)) {
          var a = t.diff({
            id: "ROOT_MUTATION",
            // The cache complains if passed a mutation where it expects a
            // query, so we transform mutations and subscriptions to queries
            // (only once, thanks to this.transformCache).
            query: this.getDocumentInfo(e.document).asQuery,
            variables: e.variables,
            optimistic: !1,
            returnPartialData: !0
          }), u = void 0;
          a.result && (u = Qu(a.result, i)), typeof u != "undefined" && (i.data = u, s.push({
            result: u,
            dataId: "ROOT_MUTATION",
            query: e.document,
            variables: e.variables
          }));
        }
        var f = e.updateQueries;
        f && this.queries.forEach(function(d, p) {
          var y = d.observableQuery, v = y && y.queryName;
          if (!(!v || !xd.call(f, v))) {
            var w = f[v], E = n.queries.get(p), b = E.document, k = E.variables, S = t.diff({
              query: b,
              variables: k,
              returnPartialData: !0,
              optimistic: !1
            }), A = S.result, O = S.complete;
            if (O && A) {
              var R = w(A, {
                mutationResult: i,
                queryName: b && Qi(b) || void 0,
                queryVariables: k
              });
              R && s.push({
                result: R,
                dataId: "ROOT_QUERY",
                query: b,
                variables: k
              });
            }
          }
        });
      }
      if (s.length > 0 || (e.refetchQueries || "").length > 0 || e.update || e.onQueryUpdated || e.removeOptimistic) {
        var c = [];
        if (this.refetchQueries({
          updateCache: function(d) {
            o || s.forEach(function(w) {
              return d.write(w);
            });
            var p = e.update, y = !_p(i) || ir(i) && !i.hasNext;
            if (p) {
              if (!o) {
                var v = d.diff({
                  id: "ROOT_MUTATION",
                  // The cache complains if passed a mutation where it expects a
                  // query, so we transform mutations and subscriptions to queries
                  // (only once, thanks to this.transformCache).
                  query: n.getDocumentInfo(e.document).asQuery,
                  variables: e.variables,
                  optimistic: !1,
                  returnPartialData: !0
                });
                v.complete && (i = x(x({}, i), { data: v.result }), "incremental" in i && delete i.incremental, "hasNext" in i && delete i.hasNext);
              }
              y && p(d, i, {
                context: e.context,
                variables: e.variables
              });
            }
            !o && !e.keepRootFields && y && d.modify({
              id: "ROOT_MUTATION",
              fields: function(w, E) {
                var b = E.fieldName, k = E.DELETE;
                return b === "__typename" ? w : k;
              }
            });
          },
          include: e.refetchQueries,
          // Write the final mutation.result to the root layer of the cache.
          optimistic: !1,
          // Remove the corresponding optimistic layer at the same time as we
          // write the final non-optimistic result.
          removeOptimistic: e.removeOptimistic,
          // Let the caller of client.mutate optionally determine the refetching
          // behavior for watched queries after the mutation.update function runs.
          // If no onQueryUpdated function was provided for this mutation, pass
          // null instead of undefined to disable the default refetching behavior.
          onQueryUpdated: e.onQueryUpdated || null
        }).forEach(function(d) {
          return c.push(d);
        }), e.awaitRefetchQueries || e.onQueryUpdated)
          return Promise.all(c).then(function() {
            return i;
          });
      }
      return Promise.resolve(i);
    }, r.prototype.markMutationOptimistic = function(e, t) {
      var n = this, i = typeof e == "function" ? e(t.variables, { IGNORE: ha }) : e;
      return i === ha ? !1 : (this.cache.recordOptimisticTransaction(function(s) {
        try {
          n.markMutationResult(x(x({}, t), { result: { data: i } }), s);
        } catch (o) {
          globalThis.__DEV__ !== !1 && j.error(o);
        }
      }, t.mutationId), !0);
    }, r.prototype.fetchQuery = function(e, t, n) {
      return this.fetchConcastWithInfo(e, t, n).concast.promise;
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
      return this.documentTransform.transformDocument(e);
    }, r.prototype.getDocumentInfo = function(e) {
      var t = this.transformCache;
      if (!t.has(e)) {
        var n = {
          // TODO These three calls (hasClientExports, shouldForceResolvers, and
          // usesNonreactiveDirective) are performing independent full traversals
          // of the transformed document. We should consider merging these
          // traversals into a single pass in the future, though the work is
          // cached after the first time.
          hasClientExports: nh(e),
          hasForcedResolvers: this.localState.shouldForceResolvers(e),
          hasNonreactiveDirective: Wr(["nonreactive"], e),
          clientQuery: this.localState.clientQuery(e),
          serverQuery: Bu([
            { name: "client", remove: !0 },
            { name: "connection" },
            { name: "nonreactive" }
          ], e),
          defaultVars: ys(nn(e)),
          // Transform any mutation or subscription operations to query operations
          // so we can read/write them from/to the cache.
          asQuery: x(x({}, e), { definitions: e.definitions.map(function(i) {
            return i.kind === "OperationDefinition" && i.operation !== "query" ? x(x({}, i), { operation: "query" }) : i;
          }) })
        };
        t.set(e, n);
      }
      return t.get(e);
    }, r.prototype.getVariables = function(e, t) {
      return x(x({}, this.getDocumentInfo(e).defaultVars), t);
    }, r.prototype.watchQuery = function(e) {
      var t = this.transform(e.query);
      e = x(x({}, e), { variables: this.getVariables(t, e.variables) }), typeof e.notifyOnNetworkStatusChange == "undefined" && (e.notifyOnNetworkStatusChange = !1);
      var n = new ki(this), i = new rs({
        queryManager: this,
        queryInfo: n,
        options: e
      });
      return i.lastQuery = t, this.queries.set(i.queryId, n), n.init({
        document: t,
        observableQuery: i,
        variables: i.variables
      }), i;
    }, r.prototype.query = function(e, t) {
      var n = this;
      return t === void 0 && (t = this.generateQueryId()), j(e.query, 29), j(e.query.kind === "Document", 30), j(!e.returnPartialData, 31), j(!e.pollInterval, 32), this.fetchQuery(t, x(x({}, e), { query: this.transform(e.query) })).finally(function() {
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
      }), this.cancelPendingFetches(Fe(33)), this.queries.forEach(function(t) {
        t.observableQuery ? t.networkStatus = ne.loading : t.stop();
      }), this.mutationStore && (this.mutationStore = /* @__PURE__ */ Object.create(null)), this.cache.reset(e);
    }, r.prototype.getObservableQueries = function(e) {
      var t = this;
      e === void 0 && (e = "active");
      var n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
      return Array.isArray(e) && e.forEach(function(o) {
        typeof o == "string" ? i.set(o, !1) : Oh(o) ? i.set(t.transform(o), !1) : fe(o) && o.query && s.add(o);
      }), this.queries.forEach(function(o, a) {
        var u = o.observableQuery, f = o.document;
        if (u) {
          if (e === "all") {
            n.set(a, u);
            return;
          }
          var c = u.queryName, d = u.options.fetchPolicy;
          if (d === "standby" || e === "active" && !u.hasObservers())
            return;
          (e === "active" || c && i.has(c) || f && i.has(f)) && (n.set(a, u), c && i.set(c, !0), f && i.set(f, !0));
        }
      }), s.size && s.forEach(function(o) {
        var a = Fi("legacyOneTimeQuery"), u = t.getQuery(a).init({
          document: o.query,
          variables: o.variables
        }), f = new rs({
          queryManager: t,
          queryInfo: u,
          options: x(x({}, o), { fetchPolicy: "network-only" })
        });
        j(f.queryId === a), u.setObservableQuery(f), n.set(a, f);
      }), globalThis.__DEV__ !== !1 && i.size && i.forEach(function(o, a) {
        o || globalThis.__DEV__ !== !1 && j.warn(typeof a == "string" ? 34 : 35, a);
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
      var t = this, n = e.query, i = e.fetchPolicy, s = e.errorPolicy, o = s === void 0 ? "none" : s, a = e.variables, u = e.context, f = u === void 0 ? {} : u, c = e.extensions, d = c === void 0 ? {} : c;
      n = this.transform(n), a = this.getVariables(n, a);
      var p = function(v) {
        return t.getObservableFromLink(n, f, v, d).map(function(w) {
          i !== "no-cache" && (ns(w, o) && t.cache.write({
            query: n,
            result: w.data,
            dataId: "ROOT_SUBSCRIPTION",
            variables: v
          }), t.broadcastQueries());
          var E = kn(w), b = Lp(w);
          if (E || b) {
            var k = {};
            if (E && (k.graphQLErrors = w.errors), b && (k.protocolErrors = w.extensions[xs]), o === "none" || b)
              throw new St(k);
          }
          return o === "ignore" && delete w.errors, w;
        });
      };
      if (this.getDocumentInfo(n).hasClientExports) {
        var y = this.localState.addExportedVariables(n, a, f).then(p);
        return new re(function(v) {
          var w = null;
          return y.then(function(E) {
            return w = E.subscribe(v);
          }, v.error), function() {
            return w && w.unsubscribe();
          };
        });
      }
      return p(a);
    }, r.prototype.stopQuery = function(e) {
      this.stopQueryNoBroadcast(e), this.broadcastQueries();
    }, r.prototype.stopQueryNoBroadcast = function(e) {
      this.stopQueryInStoreNoBroadcast(e), this.removeQuery(e);
    }, r.prototype.removeQuery = function(e) {
      this.fetchCancelFns.delete(e), this.queries.has(e) && (this.getQuery(e).stop(), this.queries.delete(e));
    }, r.prototype.broadcastQueries = function() {
      this.onBroadcast && this.onBroadcast(), this.queries.forEach(function(e) {
        return e.notify();
      });
    }, r.prototype.getLocalState = function() {
      return this.localState;
    }, r.prototype.getObservableFromLink = function(e, t, n, i, s) {
      var o = this, a;
      s === void 0 && (s = (a = t == null ? void 0 : t.queryDeduplication) !== null && a !== void 0 ? a : this.queryDeduplication);
      var u, f = this.getDocumentInfo(e), c = f.serverQuery, d = f.clientQuery;
      if (c) {
        var p = this, y = p.inFlightLinkObservables, v = p.link, w = {
          query: c,
          variables: n,
          operationName: Qi(c) || void 0,
          context: this.prepareContext(x(x({}, t), { forceFetch: !s })),
          extensions: i
        };
        if (t = w.context, s) {
          var E = sn(c), b = It(n), k = y.lookup(E, b);
          if (u = k.observable, !u) {
            var S = new Yt([
              Gi(v, w)
            ]);
            u = k.observable = S, S.beforeNext(function() {
              y.remove(E, b);
            });
          }
        } else
          u = new Yt([
            Gi(v, w)
          ]);
      } else
        u = new Yt([re.of({ data: {} })]), t = this.prepareContext(t);
      return d && (u = mi(u, function(A) {
        return o.localState.runResolvers({
          document: d,
          remoteResult: A,
          context: t,
          variables: n
        });
      })), u;
    }, r.prototype.getResultsFromLink = function(e, t, n) {
      var i = e.lastRequestId = this.generateRequestId(), s = this.cache.transformForLink(n.query);
      return mi(this.getObservableFromLink(s, n.context, n.variables), function(o) {
        var a = Ki(o), u = a.length > 0, f = n.errorPolicy;
        if (i >= e.lastRequestId) {
          if (u && f === "none")
            throw e.markError(new St({
              graphQLErrors: a
            }));
          e.markResult(o, s, n, t), e.markReady();
        }
        var c = {
          data: o.data,
          loading: !1,
          networkStatus: ne.ready
        };
        return u && f === "none" && (c.data = void 0), u && f !== "ignore" && (c.errors = a, c.networkStatus = ne.error), c;
      }, function(o) {
        var a = Hu(o) ? o : new St({ networkError: o });
        throw i >= e.lastRequestId && e.markError(a), a;
      });
    }, r.prototype.fetchConcastWithInfo = function(e, t, n, i) {
      var s = this;
      n === void 0 && (n = ne.loading), i === void 0 && (i = t.query);
      var o = this.getVariables(i, t.variables), a = this.getQuery(e), u = this.defaultOptions.watchQuery, f = t.fetchPolicy, c = f === void 0 ? u && u.fetchPolicy || "cache-first" : f, d = t.errorPolicy, p = d === void 0 ? u && u.errorPolicy || "none" : d, y = t.returnPartialData, v = y === void 0 ? !1 : y, w = t.notifyOnNetworkStatusChange, E = w === void 0 ? !1 : w, b = t.context, k = b === void 0 ? {} : b, S = Object.assign({}, t, {
        query: i,
        variables: o,
        fetchPolicy: c,
        errorPolicy: p,
        returnPartialData: v,
        notifyOnNetworkStatusChange: E,
        context: k
      }), A = function(P) {
        S.variables = P;
        var H = s.fetchQueryByPolicy(a, S, n);
        return (
          // If we're in standby, postpone advancing options.fetchPolicy using
          // applyNextFetchPolicy.
          S.fetchPolicy !== "standby" && // The "standby" policy currently returns [] from fetchQueryByPolicy, so
          // this is another way to detect when nothing was done/fetched.
          H.sources.length > 0 && a.observableQuery && a.observableQuery.applyNextFetchPolicy("after-fetch", t), H
        );
      }, O = function() {
        return s.fetchCancelFns.delete(e);
      };
      this.fetchCancelFns.set(e, function(P) {
        O(), setTimeout(function() {
          return R.cancel(P);
        });
      });
      var R, D;
      if (this.getDocumentInfo(S.query).hasClientExports)
        R = new Yt(this.localState.addExportedVariables(S.query, S.variables, S.context).then(A).then(function(P) {
          return P.sources;
        })), D = !0;
      else {
        var F = A(S.variables);
        D = F.fromLink, R = new Yt(F.sources);
      }
      return R.promise.then(O, O), {
        concast: R,
        fromLink: D
      };
    }, r.prototype.refetchQueries = function(e) {
      var t = this, n = e.updateCache, i = e.include, s = e.optimistic, o = s === void 0 ? !1 : s, a = e.removeOptimistic, u = a === void 0 ? o ? Fi("refetchQueries") : void 0 : a, f = e.onQueryUpdated, c = /* @__PURE__ */ new Map();
      i && this.getObservableQueries(i).forEach(function(p, y) {
        c.set(y, {
          oq: p,
          lastDiff: t.getQuery(y).getDiff()
        });
      });
      var d = /* @__PURE__ */ new Map();
      return n && this.cache.batch({
        update: n,
        // Since you can perform any combination of cache reads and/or writes in
        // the cache.batch update function, its optimistic option can be either
        // a boolean or a string, representing three distinct modes of
        // operation:
        //
        // * false: read/write only the root layer
        // * true: read/write the topmost layer
        // * string: read/write a fresh optimistic layer with that ID string
        //
        // When typeof optimistic === "string", a new optimistic layer will be
        // temporarily created within cache.batch with that string as its ID. If
        // we then pass that same string as the removeOptimistic option, we can
        // make cache.batch immediately remove the optimistic layer after
        // running the updateCache function, triggering only one broadcast.
        //
        // However, the refetchQueries method accepts only true or false for its
        // optimistic option (not string). We interpret true to mean a temporary
        // optimistic layer should be created, to allow efficiently rolling back
        // the effect of the updateCache function, which involves passing a
        // string instead of true as the optimistic option to cache.batch, when
        // refetchQueries receives optimistic: true.
        //
        // In other words, we are deliberately not supporting the use case of
        // writing to an *existing* optimistic layer (using the refetchQueries
        // updateCache function), since that would potentially interfere with
        // other optimistic updates in progress. Instead, you can read/write
        // only the root layer by passing optimistic: false to refetchQueries,
        // or you can read/write a brand new optimistic layer that will be
        // automatically removed by passing optimistic: true.
        optimistic: o && u || !1,
        // The removeOptimistic option can also be provided by itself, even if
        // optimistic === false, to remove some previously-added optimistic
        // layer safely and efficiently, like we do in markMutationResult.
        //
        // If an explicit removeOptimistic string is provided with optimistic:
        // true, the removeOptimistic string will determine the ID of the
        // temporary optimistic layer, in case that ever matters.
        removeOptimistic: u,
        onWatchUpdated: function(p, y, v) {
          var w = p.watcher instanceof ki && p.watcher.observableQuery;
          if (w) {
            if (f) {
              c.delete(w.queryId);
              var E = f(w, y, v);
              return E === !0 && (E = w.refetch()), E !== !1 && d.set(w, E), E;
            }
            f !== null && c.set(w.queryId, { oq: w, lastDiff: v, diff: y });
          }
        }
      }), c.size && c.forEach(function(p, y) {
        var v = p.oq, w = p.lastDiff, E = p.diff, b;
        if (f) {
          if (!E) {
            var k = v.queryInfo;
            k.reset(), E = k.getDiff();
          }
          b = f(v, E, w);
        }
        (!f || b === !0) && (b = v.refetch()), b !== !1 && d.set(v, b), y.indexOf("legacyOneTimeQuery") >= 0 && t.stopQueryNoBroadcast(y);
      }), u && this.cache.removeOptimistic(u), d;
    }, r.prototype.fetchQueryByPolicy = function(e, t, n) {
      var i = this, s = t.query, o = t.variables, a = t.fetchPolicy, u = t.refetchWritePolicy, f = t.errorPolicy, c = t.returnPartialData, d = t.context, p = t.notifyOnNetworkStatusChange, y = e.networkStatus;
      e.init({
        document: s,
        variables: o,
        networkStatus: n
      });
      var v = function() {
        return e.getDiff();
      }, w = function(A, O) {
        O === void 0 && (O = e.networkStatus || ne.loading);
        var R = A.result;
        globalThis.__DEV__ !== !1 && !c && !ce(R, {}) && lc(A.missing);
        var D = function(F) {
          return re.of(x({ data: F, loading: Jr(O), networkStatus: O }, A.complete ? null : { partial: !0 }));
        };
        return R && i.getDocumentInfo(s).hasForcedResolvers ? i.localState.runResolvers({
          document: s,
          remoteResult: { data: R },
          context: d,
          variables: o,
          onlyRunForcedResolvers: !0
        }).then(function(F) {
          return D(F.data || void 0);
        }) : f === "none" && O === ne.refetch && Array.isArray(A.missing) ? D(void 0) : D(R);
      }, E = a === "no-cache" ? 0 : n === ne.refetch && u !== "merge" ? 1 : 2, b = function() {
        return i.getResultsFromLink(e, E, {
          query: s,
          variables: o,
          context: d,
          fetchPolicy: a,
          errorPolicy: f
        });
      }, k = p && typeof y == "number" && y !== n && Jr(n);
      switch (a) {
        default:
        case "cache-first": {
          var S = v();
          return S.complete ? {
            fromLink: !1,
            sources: [w(S, e.markReady())]
          } : c || k ? {
            fromLink: !0,
            sources: [w(S), b()]
          } : { fromLink: !0, sources: [b()] };
        }
        case "cache-and-network": {
          var S = v();
          return S.complete || c || k ? {
            fromLink: !0,
            sources: [w(S), b()]
          } : { fromLink: !0, sources: [b()] };
        }
        case "cache-only":
          return {
            fromLink: !1,
            sources: [w(v(), e.markReady())]
          };
        case "network-only":
          return k ? {
            fromLink: !0,
            sources: [w(v()), b()]
          } : { fromLink: !0, sources: [b()] };
        case "no-cache":
          return k ? {
            fromLink: !0,
            // Note that queryInfo.getDiff() for no-cache queries does not call
            // cache.diff, but instead returns a { complete: false } stub result
            // when there is no queryInfo.diff already defined.
            sources: [w(e.getDiff()), b()]
          } : { fromLink: !0, sources: [b()] };
        case "standby":
          return { fromLink: !1, sources: [] };
      }
    }, r.prototype.getQuery = function(e) {
      return e && !this.queries.has(e) && this.queries.set(e, new ki(this, e)), this.queries.get(e);
    }, r.prototype.prepareContext = function(e) {
      e === void 0 && (e = {});
      var t = this.localState.prepareContext(e);
      return x(x(x({}, this.defaultContext), t), { clientAwareness: this.clientAwareness });
    }, r;
  }()
), Id = (
  /** @class */
  function() {
    function r(e) {
      var t = e.cache, n = e.client, i = e.resolvers, s = e.fragmentMatcher;
      this.selectionsToResolveCache = /* @__PURE__ */ new WeakMap(), this.cache = t, n && (this.client = n), i && this.addResolvers(i), s && this.setFragmentMatcher(s);
    }
    return r.prototype.addResolvers = function(e) {
      var t = this;
      this.resolvers = this.resolvers || {}, Array.isArray(e) ? e.forEach(function(n) {
        t.resolvers = No(t.resolvers, n);
      }) : this.resolvers = No(this.resolvers, e);
    }, r.prototype.setResolvers = function(e) {
      this.resolvers = {}, this.addResolvers(e);
    }, r.prototype.getResolvers = function() {
      return this.resolvers || {};
    }, r.prototype.runResolvers = function(e) {
      return wt(this, arguments, void 0, function(t) {
        var n = t.document, i = t.remoteResult, s = t.context, o = t.variables, a = t.onlyRunForcedResolvers, u = a === void 0 ? !1 : a;
        return Et(this, function(f) {
          return n ? [2, this.resolveDocument(n, i.data, s, o, this.fragmentMatcher, u).then(function(c) {
            return x(x({}, i), { data: c.result });
          })] : [2, i];
        });
      });
    }, r.prototype.setFragmentMatcher = function(e) {
      this.fragmentMatcher = e;
    }, r.prototype.getFragmentMatcher = function() {
      return this.fragmentMatcher;
    }, r.prototype.clientQuery = function(e) {
      return Wr(["client"], e) && this.resolvers ? e : null;
    }, r.prototype.serverQuery = function(e) {
      return $u(e);
    }, r.prototype.prepareContext = function(e) {
      var t = this.cache;
      return x(x({}, e), {
        cache: t,
        // Getting an entry's cache key is useful for local state resolvers.
        getCacheKey: function(n) {
          return t.identify(n);
        }
      });
    }, r.prototype.addExportedVariables = function(e) {
      return wt(this, arguments, void 0, function(t, n, i) {
        return n === void 0 && (n = {}), i === void 0 && (i = {}), Et(this, function(s) {
          return t ? [2, this.resolveDocument(t, this.buildRootValueFromCache(t, n) || {}, this.prepareContext(i), n).then(function(o) {
            return x(x({}, n), o.exportedVariables);
          })] : [2, x({}, n)];
        });
      });
    }, r.prototype.shouldForceResolvers = function(e) {
      var t = !1;
      return yt(e, {
        Directive: {
          enter: function(n) {
            if (n.name.value === "client" && n.arguments && (t = n.arguments.some(function(i) {
              return i.name.value === "always" && i.value.kind === "BooleanValue" && i.value.value === !0;
            }), t))
              return ds;
          }
        }
      }), t;
    }, r.prototype.buildRootValueFromCache = function(e, t) {
      return this.cache.diff({
        query: ap(e),
        variables: t,
        returnPartialData: !0,
        optimistic: !1
      }).result;
    }, r.prototype.resolveDocument = function(e, t) {
      return wt(this, arguments, void 0, function(n, i, s, o, a, u) {
        var f, c, d, p, y, v, w, E, b, k, S;
        return s === void 0 && (s = {}), o === void 0 && (o = {}), a === void 0 && (a = function() {
          return !0;
        }), u === void 0 && (u = !1), Et(this, function(A) {
          return f = mr(n), c = zn(n), d = Vn(c), p = this.collectSelectionsToResolve(f, d), y = f.operation, v = y ? y.charAt(0).toUpperCase() + y.slice(1) : "Query", w = this, E = w.cache, b = w.client, k = {
            fragmentMap: d,
            context: x(x({}, s), { cache: E, client: b }),
            variables: o,
            fragmentMatcher: a,
            defaultOperationType: v,
            exportedVariables: {},
            selectionsToResolve: p,
            onlyRunForcedResolvers: u
          }, S = !1, [2, this.resolveSelectionSet(f.selectionSet, S, i, k).then(function(O) {
            return {
              result: O,
              exportedVariables: k.exportedVariables
            };
          })];
        });
      });
    }, r.prototype.resolveSelectionSet = function(e, t, n, i) {
      return wt(this, void 0, void 0, function() {
        var s, o, a, u, f, c = this;
        return Et(this, function(d) {
          return s = i.fragmentMap, o = i.context, a = i.variables, u = [n], f = function(p) {
            return wt(c, void 0, void 0, function() {
              var y, v;
              return Et(this, function(w) {
                return !t && !i.selectionsToResolve.has(p) ? [
                  2
                  /*return*/
                ] : tn(p, a) ? Ot(p) ? [2, this.resolveField(p, t, n, i).then(function(E) {
                  var b;
                  typeof E != "undefined" && u.push((b = {}, b[At(p)] = E, b));
                })] : (qh(p) ? y = p : (y = s[p.name.value], j(y, 18, p.name.value)), y && y.typeCondition && (v = y.typeCondition.name.value, i.fragmentMatcher(n, v, o)) ? [2, this.resolveSelectionSet(y.selectionSet, t, n, i).then(function(E) {
                  u.push(E);
                })] : [
                  2
                  /*return*/
                ]) : [
                  2
                  /*return*/
                ];
              });
            });
          }, [2, Promise.all(e.selections.map(f)).then(function() {
            return Jn(u);
          })];
        });
      });
    }, r.prototype.resolveField = function(e, t, n, i) {
      return wt(this, void 0, void 0, function() {
        var s, o, a, u, f, c, d, p, y, v = this;
        return Et(this, function(w) {
          return n ? (s = i.variables, o = e.name.value, a = At(e), u = o !== a, f = n[a] || n[o], c = Promise.resolve(f), (!i.onlyRunForcedResolvers || this.shouldForceResolvers(e)) && (d = n.__typename || i.defaultOperationType, p = this.resolvers && this.resolvers[d], p && (y = p[u ? o : a], y && (c = Promise.resolve(
            // In case the resolve function accesses reactive variables,
            // set cacheSlot to the current cache instance.
            Ts.withValue(this.cache, y, [
              n,
              Wn(e, s),
              i.context,
              { field: e, fragmentMap: i.fragmentMap }
            ])
          )))), [2, c.then(function(E) {
            var b, k;
            if (E === void 0 && (E = f), e.directives && e.directives.forEach(function(A) {
              A.name.value === "export" && A.arguments && A.arguments.forEach(function(O) {
                O.name.value === "as" && O.value.kind === "StringValue" && (i.exportedVariables[O.value.value] = E);
              });
            }), !e.selectionSet || E == null)
              return E;
            var S = (k = (b = e.directives) === null || b === void 0 ? void 0 : b.some(function(A) {
              return A.name.value === "client";
            })) !== null && k !== void 0 ? k : !1;
            if (Array.isArray(E))
              return v.resolveSubSelectedArray(e, t || S, E, i);
            if (e.selectionSet)
              return v.resolveSelectionSet(e.selectionSet, t || S, E, i);
          })]) : [2, null];
        });
      });
    }, r.prototype.resolveSubSelectedArray = function(e, t, n, i) {
      var s = this;
      return Promise.all(n.map(function(o) {
        if (o === null)
          return null;
        if (Array.isArray(o))
          return s.resolveSubSelectedArray(e, t, o, i);
        if (e.selectionSet)
          return s.resolveSelectionSet(e.selectionSet, t, o, i);
      }));
    }, r.prototype.collectSelectionsToResolve = function(e, t) {
      var n = function(o) {
        return !Array.isArray(o);
      }, i = this.selectionsToResolveCache;
      function s(o) {
        if (!i.has(o)) {
          var a = /* @__PURE__ */ new Set();
          i.set(o, a), yt(o, {
            Directive: function(u, f, c, d, p) {
              u.name.value === "client" && p.forEach(function(y) {
                n(y) && _o(y) && a.add(y);
              });
            },
            FragmentSpread: function(u, f, c, d, p) {
              var y = t[u.name.value];
              j(y, 19, u.name.value);
              var v = s(y);
              v.size > 0 && (p.forEach(function(w) {
                n(w) && _o(w) && a.add(w);
              }), a.add(u), v.forEach(function(w) {
                a.add(w);
              }));
            }
          });
        }
        return i.get(o);
      }
      return s(e);
    }, r;
  }()
), pa = !1, fc = (
  /** @class */
  function() {
    function r(e) {
      var t = this;
      if (this.resetStoreCallbacks = [], this.clearStoreCallbacks = [], !e.cache)
        throw Fe(15);
      var n = e.uri, i = e.credentials, s = e.headers, o = e.cache, a = e.documentTransform, u = e.ssrMode, f = u === void 0 ? !1 : u, c = e.ssrForceFetchDelay, d = c === void 0 ? 0 : c, p = e.connectToDevTools, y = e.queryDeduplication, v = y === void 0 ? !0 : y, w = e.defaultOptions, E = e.defaultContext, b = e.assumeImmutableResults, k = b === void 0 ? o.assumeImmutableResults : b, S = e.resolvers, A = e.typeDefs, O = e.fragmentMatcher, R = e.name, D = e.version, F = e.devtools, P = e.link;
      P || (P = n ? new td({ uri: n, credentials: i, headers: s }) : We.empty()), this.link = P, this.cache = o, this.disableNetworkFetches = f || d > 0, this.queryDeduplication = v, this.defaultOptions = w || /* @__PURE__ */ Object.create(null), this.typeDefs = A, this.devtoolsConfig = x(x({}, F), { enabled: (F == null ? void 0 : F.enabled) || p }), this.devtoolsConfig.enabled === void 0 && (this.devtoolsConfig.enabled = globalThis.__DEV__ !== !1), d && setTimeout(function() {
        return t.disableNetworkFetches = !1;
      }, d), this.watchQuery = this.watchQuery.bind(this), this.query = this.query.bind(this), this.mutate = this.mutate.bind(this), this.watchFragment = this.watchFragment.bind(this), this.resetStore = this.resetStore.bind(this), this.reFetchObservableQueries = this.reFetchObservableQueries.bind(this), this.version = cs, this.localState = new Id({
        cache: o,
        client: this,
        resolvers: S,
        fragmentMatcher: O
      }), this.queryManager = new Td({
        cache: this.cache,
        link: this.link,
        defaultOptions: this.defaultOptions,
        defaultContext: E,
        documentTransform: a,
        queryDeduplication: v,
        ssrMode: f,
        clientAwareness: {
          name: R,
          version: D
        },
        localState: this.localState,
        assumeImmutableResults: k,
        onBroadcast: this.devtoolsConfig.enabled ? function() {
          t.devToolsHookCb && t.devToolsHookCb({
            action: {},
            state: {
              queries: t.queryManager.getQueryStore(),
              mutations: t.queryManager.mutationStore || {}
            },
            dataWithOptimisticResults: t.cache.extract(!0)
          });
        } : void 0
      }), this.devtoolsConfig.enabled && this.connectToDevTools();
    }
    return r.prototype.connectToDevTools = function() {
      if (typeof window != "undefined") {
        var e = window, t = Symbol.for("apollo.devtools");
        (e[t] = e[t] || []).push(this), e.__APOLLO_CLIENT__ = this, !pa && globalThis.__DEV__ !== !1 && (pa = !0, window.document && window.top === window.self && /^(https?|file):$/.test(window.location.protocol) && setTimeout(function() {
          if (!window.__APOLLO_DEVTOOLS_GLOBAL_HOOK__) {
            var n = window.navigator, i = n && n.userAgent, s = void 0;
            typeof i == "string" && (i.indexOf("Chrome/") > -1 ? s = "https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm" : i.indexOf("Firefox/") > -1 && (s = "https://addons.mozilla.org/en-US/firefox/addon/apollo-developer-tools/")), s && globalThis.__DEV__ !== !1 && j.log("Download the Apollo DevTools for a better development experience: %s", s);
          }
        }, 1e4));
      }
    }, Object.defineProperty(r.prototype, "documentTransform", {
      /**
       * The `DocumentTransform` used to modify GraphQL documents before a request
       * is made. If a custom `DocumentTransform` is not provided, this will be the
       * default document transform.
       */
      get: function() {
        return this.queryManager.documentTransform;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.stop = function() {
      this.queryManager.stop();
    }, r.prototype.watchQuery = function(e) {
      return this.defaultOptions.watchQuery && (e = gi(this.defaultOptions.watchQuery, e)), this.disableNetworkFetches && (e.fetchPolicy === "network-only" || e.fetchPolicy === "cache-and-network") && (e = x(x({}, e), { fetchPolicy: "cache-first" })), this.queryManager.watchQuery(e);
    }, r.prototype.query = function(e) {
      return this.defaultOptions.query && (e = gi(this.defaultOptions.query, e)), j(e.fetchPolicy !== "cache-and-network", 16), this.disableNetworkFetches && e.fetchPolicy === "network-only" && (e = x(x({}, e), { fetchPolicy: "cache-first" })), this.queryManager.query(e);
    }, r.prototype.mutate = function(e) {
      return this.defaultOptions.mutate && (e = gi(this.defaultOptions.mutate, e)), this.queryManager.mutate(e);
    }, r.prototype.subscribe = function(e) {
      return this.queryManager.startGraphQLSubscription(e);
    }, r.prototype.readQuery = function(e, t) {
      return t === void 0 && (t = !1), this.cache.readQuery(e, t);
    }, r.prototype.watchFragment = function(e) {
      return this.cache.watchFragment(e);
    }, r.prototype.readFragment = function(e, t) {
      return t === void 0 && (t = !1), this.cache.readFragment(e, t);
    }, r.prototype.writeQuery = function(e) {
      var t = this.cache.writeQuery(e);
      return e.broadcast !== !1 && this.queryManager.broadcastQueries(), t;
    }, r.prototype.writeFragment = function(e) {
      var t = this.cache.writeFragment(e);
      return e.broadcast !== !1 && this.queryManager.broadcastQueries(), t;
    }, r.prototype.__actionHookForDevTools = function(e) {
      this.devToolsHookCb = e;
    }, r.prototype.__requestRaw = function(e) {
      return Gi(this.link, e);
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
        globalThis.__DEV__ !== !1 && j.debug(17, o);
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
    }, Object.defineProperty(r.prototype, "defaultContext", {
      get: function() {
        return this.queryManager.defaultContext;
      },
      enumerable: !1,
      configurable: !0
    }), r;
  }()
);
globalThis.__DEV__ !== !1 && (fc.prototype.getMemoryInternals = wh);
var In = /* @__PURE__ */ new Map(), is = /* @__PURE__ */ new Map(), hc = !0, Bn = !1;
function pc(r) {
  return r.replace(/[\s,]+/g, " ").trim();
}
function Ad(r) {
  return pc(r.source.body.substring(r.start, r.end));
}
function Od(r) {
  var e = /* @__PURE__ */ new Set(), t = [];
  return r.definitions.forEach(function(n) {
    if (n.kind === "FragmentDefinition") {
      var i = n.name.value, s = Ad(n.loc), o = is.get(i);
      o && !o.has(s) ? hc && console.warn("Warning: fragment with name " + i + ` already exists.
graphql-tag enforces all fragment names across your application to be unique; read more about
this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names`) : o || is.set(i, o = /* @__PURE__ */ new Set()), o.add(s), e.has(s) || (e.add(s), t.push(n));
    } else
      t.push(n);
  }), x(x({}, r), { definitions: t });
}
function Cd(r) {
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
function Rd(r) {
  var e = pc(r);
  if (!In.has(e)) {
    var t = Kf(r, {
      experimentalFragmentVariables: Bn,
      allowLegacyFragmentVariables: Bn
    });
    if (!t || t.kind !== "Document")
      throw new Error("Not a valid GraphQL document.");
    In.set(e, Cd(Od(t)));
  }
  return In.get(e);
}
function ue(r) {
  for (var e = [], t = 1; t < arguments.length; t++)
    e[t - 1] = arguments[t];
  typeof r == "string" && (r = [r]);
  var n = r[0];
  return e.forEach(function(i, s) {
    i && i.kind === "Document" ? n += i.loc.source.body : n += i, n += r[s + 1];
  }), Rd(n);
}
function Nd() {
  In.clear(), is.clear();
}
function Dd() {
  hc = !1;
}
function Fd() {
  Bn = !0;
}
function Md() {
  Bn = !1;
}
var Rr = {
  gql: ue,
  resetCaches: Nd,
  disableFragmentWarnings: Dd,
  enableExperimentalFragmentVariables: Fd,
  disableExperimentalFragmentVariables: Md
};
(function(r) {
  r.gql = Rr.gql, r.resetCaches = Rr.resetCaches, r.disableFragmentWarnings = Rr.disableFragmentWarnings, r.enableExperimentalFragmentVariables = Rr.enableExperimentalFragmentVariables, r.disableExperimentalFragmentVariables = Rr.disableExperimentalFragmentVariables;
})(ue || (ue = {}));
ue.default = ue;
class Bd extends Le {
  /**
   * @param {ApolloClient} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ue`query ($bundle: String!) {
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
    return new df({
      query: this,
      json: e
    });
  }
}
class $d extends _e {
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
      n.metas = Cn.aggregateMeta(n.metas), t[n.bundleHash] = n;
    }), t;
  }
}
class Pd extends Le {
  /**
   * @param {ApolloClient} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ue`query( $bundleHashes: [ String! ] ) {
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
    return new $d({
      query: this,
      json: e
    });
  }
}
class Yn extends _e {
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
    if (e.position === null || typeof e.position == "undefined" ? n = X.create({
      bundle: e.bundleHash,
      token: e.tokenSlug,
      batchId: e.batchId,
      characters: e.characters
    }) : (n = new X({
      secret: t,
      token: e.tokenSlug,
      position: e.position,
      batchId: e.batchId,
      characters: e.characters
    }), n.address = e.address, n.bundle = e.bundleHash), e.token && (n.tokenName = e.token.name, n.tokenAmount = e.token.amount, n.tokenSupply = e.token.supply, n.tokenFungibility = e.token.fungibility), e.tokenUnits.length)
      for (const i of e.tokenUnits)
        n.tokenUnits.push(qr.createFromGraphQL(i));
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
      n.push(Yn.toClientWallet({
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
class Ld extends Le {
  /**
   * @param {ApolloClient} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ue`query( $bundleHash: String, $tokenSlug: String ) {
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
    return new Yn({
      query: this,
      json: e
    });
  }
}
class Ud extends _e {
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
    return !e || !e.bundleHash || !e.tokenSlug ? null : Yn.toClientWallet({
      data: e
    });
  }
}
class qd extends Le {
  /**
   * @param {ApolloClient} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ue`query( $address: String, $bundleHash: String, $type: String, $token: String, $position: String ) {
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
    return new Ud({
      query: this,
      json: e
    });
  }
}
class jd extends _e {
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
class da extends Le {
  /**
   * @param {ApolloClient} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ue`query( $metaType: String, $metaTypes: [ String! ], $metaId: String, $metaIds: [ String! ], $key: String, $keys: [ String! ], $value: String, $values: [ String! ], $count: String, $latest: Boolean, $filter: [ MetaFilter! ], $latestMetas: Boolean, $queryArgs: QueryArgs, $countBy: String ) {
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
    queryArgs: u = null,
    count: f = null,
    countBy: c = null
  }) {
    const d = {};
    return e && (d[typeof e == "string" ? "metaType" : "metaTypes"] = e), t && (d[typeof t == "string" ? "metaId" : "metaIds"] = t), n && (d[typeof n == "string" ? "key" : "keys"] = n), i && (d[typeof i == "string" ? "value" : "values"] = i), s && (d.latest = !!s), o && (d.latestMetas = !!o), a && (d.filter = a), u && ((typeof u.limit == "undefined" || u.limit === 0) && (u.limit = "*"), d.queryArgs = u), f && (d.count = f), c && (d.countBy = c), d;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaType}
   */
  createResponse(e) {
    return new jd({
      query: this,
      json: e
    });
  }
}
class Yr extends Le {
  /**
   * @param {ApolloClient} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ue`query( $batchId: String ) {
      Batch( batchId: $batchId ) {
        ${Yr.getFields()},
        children {
          ${Yr.getFields()}
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
    const t = new _e({
      query: this,
      json: e
    });
    return t.dataKey = "data.Batch", t;
  }
}
class Qd extends Le {
  /**
   * @param {ApolloClient} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ue`query( $batchId: String ) {
      BatchHistory( batchId: $batchId ) {
        ${Yr.getFields()}
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
    const t = new _e({
      query: this,
      json: e
    });
    return t.dataKey = "data.BatchHistory", t;
  }
}
class st extends _e {
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
    const e = de.get(this.data(), "payload");
    try {
      this.$__payload = Object.prototype.toString.call(e) === "[object String]" ? JSON.parse(e) : e;
    } catch (t) {
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
    return t.molecularHash = de.get(e, "molecularHash"), t.status = de.get(e, "status"), t.createdAt = de.get(e, "createdAt"), t;
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
    return de.get(this.data(), "status", "rejected");
  }
  /**
   * Returns the reason for rejection
   *
   * @return {string}
   */
  reason() {
    return de.get(this.data(), "reason", "Invalid response from server");
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
class Cs extends Le {
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
  execute(n) {
    return L(this, arguments, function* ({ variables: e = {}, context: t = {} }) {
      this.$__request = this.createQuery({
        variables: e
      });
      const i = Ue(Ue({}, t), this.createQueryContext());
      try {
        const s = vr(Ue({}, this.$__request), {
          context: i
        }), o = yield this.client.mutate(s);
        return this.$__response = yield this.createResponseRaw(o), this.$__response;
      } catch (s) {
        if (s.name === "AbortError")
          return this.knishIOClient.log("warn", "Mutation was cancelled"), new _e({
            query: this,
            json: { data: null, errors: [{ message: "Mutation was cancelled" }] }
          });
        throw s;
      }
    });
  }
  createQueryContext() {
    return {};
  }
}
class Ie extends Cs {
  /**
   * @param {ApolloClient} apolloClient
   * @param {KnishIOClient} knishIOClient
   * @param molecule
   */
  constructor(e, t, n) {
    super(e, t), this.$__molecule = n, this.$__remainderWallet = null, this.$__query = ue`mutation( $molecule: MoleculeInput! ) {
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
    const t = super.compiledVariables(e);
    return vr(Ue({}, t), { molecule: this.molecule() });
  }
  /**
   * Creates a new response from a JSON string
   *
   * @param {object} json
   * @return {ResponseProposeMolecule}
   */
  createResponse(e) {
    return new st({
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
  execute(t) {
    return L(this, arguments, function* ({ variables: e = null }) {
      return e = e || {}, e.molecule = this.molecule(), Ls(Ie.prototype, this, "execute").call(this, {
        variables: e
      });
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
class Vd extends st {
  /**
   * return the authorization key
   *
   * @param key
   * @return {*}
   */
  payloadKey(e) {
    if (!de.has(this.payload(), e))
      throw new Br(`ResponseRequestAuthorization::payloadKey() - '${e}' key was not found in the payload!`);
    return de.get(this.payload(), e);
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
class Hd extends Ie {
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
    return new Vd({
      query: this,
      json: e
    });
  }
}
class Wd extends st {
}
class zd extends Ie {
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
    return new Wd({
      query: this,
      json: e
    });
  }
}
class Kd extends st {
}
class Gd extends Ie {
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
    return new Kd({
      query: this,
      json: e
    });
  }
}
class Jd extends st {
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
    return e.reason = typeof t.reason == "undefined" ? "Invalid response from server" : t.reason, e.status = typeof t.status == "undefined" ? "rejected" : t.status, e;
  }
}
class Yd extends Ie {
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
    return new Jd({
      query: this,
      json: e
    });
  }
}
class Xd extends st {
}
class Zd extends Ie {
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
    return new Xd({
      query: this,
      json: e
    });
  }
}
class ey extends st {
}
class ty extends Ie {
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
    const n = X.create({
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
    return new ey({
      query: this,
      json: e
    });
  }
}
class ry extends st {
}
class ny extends Ie {
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
    return new ry({
      query: this,
      json: e
    });
  }
}
class iy extends st {
}
class sy extends Ie {
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
    return new iy({
      query: this,
      json: e
    });
  }
}
class oy extends _e {
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
    if (!de.has(this.payload(), e))
      throw new Br(`ResponseAuthorizationGuest::payloadKey() - '${e}' key is not found in the payload!`);
    return de.get(this.payload(), e);
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
class ay extends Cs {
  /**
   * @param {ApolloClient} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ue`mutation( $cellSlug: String, $pubkey: String, $encrypt: Boolean ) {
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
    return new oy({
      query: this,
      json: e
    });
  }
}
class ya extends ae {
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
class uy extends ae {
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
class mn extends ae {
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
function dc(r) {
  return new We(function(e, t) {
    return new re(function(n) {
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
              //Network errors can return GraphQL errors on for example a 403
              graphQLErrors: a && a.result && a.result.errors || void 0,
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
  He(e, r);
  function e(t) {
    var n = r.call(this) || this;
    return n.link = dc(t), n;
  }
  return e.prototype.request = function(t, n) {
    return this.link.request(t, n);
  }, e;
})(We);
function cy(r) {
  return new We(function(e, t) {
    var n = rt(e, []);
    return new re(function(i) {
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
function ly(r) {
  return fe(r) && "code" in r && "reason" in r;
}
function fy(r) {
  var e;
  return fe(r) && ((e = r.target) === null || e === void 0 ? void 0 : e.readyState) === WebSocket.CLOSED;
}
var hy = (
  /** @class */
  function(r) {
    He(e, r);
    function e(t) {
      var n = r.call(this) || this;
      return n.client = t, n;
    }
    return e.prototype.request = function(t) {
      var n = this;
      return new re(function(i) {
        return n.client.subscribe(x(x({}, t), { query: sn(t.query) }), {
          next: i.next.bind(i),
          complete: i.complete.bind(i),
          error: function(s) {
            if (s instanceof Error)
              return i.error(s);
            var o = ly(s);
            return o || fy(s) ? i.error(
              // reason will be available on clean closes
              new Error("Socket closed".concat(o ? " with event ".concat(s.code) : "").concat(o ? " ".concat(s.reason) : ""))
            ) : i.error(new St({
              graphQLErrors: Array.isArray(s) ? s : [s]
            }));
          }
          // casting around a wrong type in graphql-ws, which incorrectly expects `Sink<ExecutionResult>`
        });
      });
    }, e;
  }(We)
);
function Be(r) {
  return r === null ? "null" : Array.isArray(r) ? "array" : typeof r;
}
function Pt(r) {
  return Be(r) === "object";
}
function py(r) {
  return Array.isArray(r) && // must be at least one error
  r.length > 0 && // error has at least a message
  r.every((e) => "message" in e);
}
function ma(r, e) {
  return r.length < 124 ? r : e;
}
const dy = "graphql-transport-ws";
var qe;
(function(r) {
  r[r.InternalServerError = 4500] = "InternalServerError", r[r.InternalClientError = 4005] = "InternalClientError", r[r.BadRequest = 4400] = "BadRequest", r[r.BadResponse = 4004] = "BadResponse", r[r.Unauthorized = 4401] = "Unauthorized", r[r.Forbidden = 4403] = "Forbidden", r[r.SubprotocolNotAcceptable = 4406] = "SubprotocolNotAcceptable", r[r.ConnectionInitialisationTimeout = 4408] = "ConnectionInitialisationTimeout", r[r.ConnectionAcknowledgementTimeout = 4504] = "ConnectionAcknowledgementTimeout", r[r.SubscriberAlreadyExists = 4409] = "SubscriberAlreadyExists", r[r.TooManyInitialisationRequests = 4429] = "TooManyInitialisationRequests";
})(qe || (qe = {}));
var me;
(function(r) {
  r.ConnectionInit = "connection_init", r.ConnectionAck = "connection_ack", r.Ping = "ping", r.Pong = "pong", r.Subscribe = "subscribe", r.Next = "next", r.Error = "error", r.Complete = "complete";
})(me || (me = {}));
function yc(r) {
  if (!Pt(r))
    throw new Error(`Message is expected to be an object, but got ${Be(r)}`);
  if (!r.type)
    throw new Error("Message is missing the 'type' property");
  if (typeof r.type != "string")
    throw new Error(`Message is expects the 'type' property to be a string, but got ${Be(r.type)}`);
  switch (r.type) {
    case me.ConnectionInit:
    case me.ConnectionAck:
    case me.Ping:
    case me.Pong: {
      if (r.payload != null && !Pt(r.payload))
        throw new Error(`"${r.type}" message expects the 'payload' property to be an object or nullish or missing, but got "${r.payload}"`);
      break;
    }
    case me.Subscribe: {
      if (typeof r.id != "string")
        throw new Error(`"${r.type}" message expects the 'id' property to be a string, but got ${Be(r.id)}`);
      if (!r.id)
        throw new Error(`"${r.type}" message requires a non-empty 'id' property`);
      if (!Pt(r.payload))
        throw new Error(`"${r.type}" message expects the 'payload' property to be an object, but got ${Be(r.payload)}`);
      if (typeof r.payload.query != "string")
        throw new Error(`"${r.type}" message payload expects the 'query' property to be a string, but got ${Be(r.payload.query)}`);
      if (r.payload.variables != null && !Pt(r.payload.variables))
        throw new Error(`"${r.type}" message payload expects the 'variables' property to be a an object or nullish or missing, but got ${Be(r.payload.variables)}`);
      if (r.payload.operationName != null && Be(r.payload.operationName) !== "string")
        throw new Error(`"${r.type}" message payload expects the 'operationName' property to be a string or nullish or missing, but got ${Be(r.payload.operationName)}`);
      if (r.payload.extensions != null && !Pt(r.payload.extensions))
        throw new Error(`"${r.type}" message payload expects the 'extensions' property to be a an object or nullish or missing, but got ${Be(r.payload.extensions)}`);
      break;
    }
    case me.Next: {
      if (typeof r.id != "string")
        throw new Error(`"${r.type}" message expects the 'id' property to be a string, but got ${Be(r.id)}`);
      if (!r.id)
        throw new Error(`"${r.type}" message requires a non-empty 'id' property`);
      if (!Pt(r.payload))
        throw new Error(`"${r.type}" message expects the 'payload' property to be an object, but got ${Be(r.payload)}`);
      break;
    }
    case me.Error: {
      if (typeof r.id != "string")
        throw new Error(`"${r.type}" message expects the 'id' property to be a string, but got ${Be(r.id)}`);
      if (!r.id)
        throw new Error(`"${r.type}" message requires a non-empty 'id' property`);
      if (!py(r.payload))
        throw new Error(`"${r.type}" message expects the 'payload' property to be an array of GraphQL errors, but got ${JSON.stringify(r.payload)}`);
      break;
    }
    case me.Complete: {
      if (typeof r.id != "string")
        throw new Error(`"${r.type}" message expects the 'id' property to be a string, but got ${Be(r.id)}`);
      if (!r.id)
        throw new Error(`"${r.type}" message requires a non-empty 'id' property`);
      break;
    }
    default:
      throw new Error(`Invalid message 'type' property "${r.type}"`);
  }
  return r;
}
function yy(r, e) {
  return yc(typeof r == "string" ? JSON.parse(r, e) : r);
}
function Nr(r, e) {
  return yc(r), JSON.stringify(r, e);
}
var or = function(r) {
  return this instanceof or ? (this.v = r, this) : new or(r);
}, my = function(r, e, t) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = t.apply(r, e || []), i, s = [];
  return i = {}, o("next"), o("throw"), o("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function o(p) {
    n[p] && (i[p] = function(y) {
      return new Promise(function(v, w) {
        s.push([p, y, v, w]) > 1 || a(p, y);
      });
    });
  }
  function a(p, y) {
    try {
      u(n[p](y));
    } catch (v) {
      d(s[0][3], v);
    }
  }
  function u(p) {
    p.value instanceof or ? Promise.resolve(p.value.v).then(f, c) : d(s[0][2], p);
  }
  function f(p) {
    a("next", p);
  }
  function c(p) {
    a("throw", p);
  }
  function d(p, y) {
    p(y), s.shift(), s.length && a(s[0][0], s[0][1]);
  }
};
function gy(r) {
  const {
    url: e,
    connectionParams: t,
    lazy: n = !0,
    onNonLazyError: i = console.error,
    lazyCloseTimeout: s = 0,
    keepAlive: o = 0,
    disablePong: a,
    connectionAckWaitTimeout: u = 0,
    retryAttempts: f = 5,
    retryWait: c = function(ee) {
      return L(this, null, function* () {
        let Q = 1e3;
        for (let q = 0; q < ee; q++)
          Q *= 2;
        yield new Promise((q) => setTimeout(q, Q + // add random timeout from 300ms to 3s
        Math.floor(Math.random() * 2700 + 300)));
      });
    },
    shouldRetry: d = xi,
    isFatalConnectionProblem: p,
    on: y,
    webSocketImpl: v,
    /**
     * Generates a v4 UUID to be used as the ID using `Math`
     * as the random number generator. Supply your own generator
     * in case you need more uniqueness.
     *
     * Reference: https://gist.github.com/jed/982883
     */
    generateID: w = function() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ee) => {
        const Q = Math.random() * 16 | 0;
        return (ee == "x" ? Q : Q & 3 | 8).toString(16);
      });
    },
    jsonMessageReplacer: E,
    jsonMessageReviver: b
  } = r;
  let k;
  if (v) {
    if (!by(v))
      throw new Error("Invalid WebSocket implementation provided");
    k = v;
  } else typeof WebSocket != "undefined" ? k = WebSocket : typeof Tt != "undefined" ? k = Tt.WebSocket || // @ts-expect-error: Support more browsers
  Tt.MozWebSocket : typeof window != "undefined" && (k = window.WebSocket || // @ts-expect-error: Support more browsers
  window.MozWebSocket);
  if (!k)
    throw new Error("WebSocket implementation missing; on Node you can `import WebSocket from 'ws';` and pass `webSocketImpl: WebSocket` to `createClient`");
  const S = k, A = (() => {
    const V = /* @__PURE__ */ (() => {
      const Q = {};
      return {
        on(q, te) {
          return Q[q] = te, () => {
            delete Q[q];
          };
        },
        emit(q) {
          var te;
          "id" in q && ((te = Q[q.id]) === null || te === void 0 || te.call(Q, q));
        }
      };
    })(), ee = {
      connecting: y != null && y.connecting ? [y.connecting] : [],
      opened: y != null && y.opened ? [y.opened] : [],
      connected: y != null && y.connected ? [y.connected] : [],
      ping: y != null && y.ping ? [y.ping] : [],
      pong: y != null && y.pong ? [y.pong] : [],
      message: y != null && y.message ? [V.emit, y.message] : [V.emit],
      closed: y != null && y.closed ? [y.closed] : [],
      error: y != null && y.error ? [y.error] : []
    };
    return {
      onMessage: V.on,
      on(Q, q) {
        const te = ee[Q];
        return te.push(q), () => {
          te.splice(te.indexOf(q), 1);
        };
      },
      emit(Q, ...q) {
        for (const te of [...ee[Q]])
          te(...q);
      }
    };
  })();
  function O(V) {
    const ee = [
      // errors are fatal and more critical than close events, throw them first
      A.on("error", (Q) => {
        ee.forEach((q) => q()), V(Q);
      }),
      // closes can be graceful and not fatal, throw them second (if error didnt throw)
      A.on("closed", (Q) => {
        ee.forEach((q) => q()), V(Q);
      })
    ];
  }
  let R, D = 0, F, P = !1, H = 0, J = !1;
  function Oe() {
    return L(this, null, function* () {
      clearTimeout(F);
      const [V, ee] = yield R != null ? R : R = new Promise((te, be) => L(this, null, function* () {
        if (P) {
          if (yield c(H), !D)
            return R = void 0, be({ code: 1e3, reason: "All Subscriptions Gone" });
          H++;
        }
        A.emit("connecting", P);
        const z = new S(typeof e == "function" ? yield e() : e, dy);
        let Me, se;
        function we() {
          isFinite(o) && o > 0 && (clearTimeout(se), se = setTimeout(() => {
            z.readyState === S.OPEN && (z.send(Nr({ type: me.Ping })), A.emit("ping", !1, void 0));
          }, o));
        }
        O((Ee) => {
          R = void 0, clearTimeout(Me), clearTimeout(se), be(Ee), Ee instanceof ga && (z.close(4499, "Terminated"), z.onerror = null, z.onclose = null);
        }), z.onerror = (Ee) => A.emit("error", Ee), z.onclose = (Ee) => A.emit("closed", Ee), z.onopen = () => L(this, null, function* () {
          try {
            A.emit("opened", z);
            const Ee = typeof t == "function" ? yield t() : t;
            if (z.readyState !== S.OPEN)
              return;
            z.send(Nr(Ee ? {
              type: me.ConnectionInit,
              payload: Ee
            } : {
              type: me.ConnectionInit
              // payload is completely absent if not provided
            }, E)), isFinite(u) && u > 0 && (Me = setTimeout(() => {
              z.close(qe.ConnectionAcknowledgementTimeout, "Connection acknowledgement timeout");
            }, u)), we();
          } catch (Ee) {
            A.emit("error", Ee), z.close(qe.InternalClientError, ma(Ee instanceof Error ? Ee.message : new Error(Ee).message, "Internal client error"));
          }
        });
        let ot = !1;
        z.onmessage = ({ data: Ee }) => {
          try {
            const ge = yy(Ee, b);
            if (A.emit("message", ge), ge.type === "ping" || ge.type === "pong") {
              A.emit(ge.type, !0, ge.payload), ge.type === "pong" ? we() : a || (z.send(Nr(ge.payload ? {
                type: me.Pong,
                payload: ge.payload
              } : {
                type: me.Pong
                // payload is completely absent if not provided
              })), A.emit("pong", !1, ge.payload));
              return;
            }
            if (ot)
              return;
            if (ge.type !== me.ConnectionAck)
              throw new Error(`First message cannot be of type ${ge.type}`);
            clearTimeout(Me), ot = !0, A.emit("connected", z, ge.payload, P), P = !1, H = 0, te([
              z,
              new Promise((Zn, an) => O(an))
            ]);
          } catch (ge) {
            z.onmessage = null, A.emit("error", ge), z.close(qe.BadResponse, ma(ge instanceof Error ? ge.message : new Error(ge).message, "Bad response"));
          }
        };
      }));
      V.readyState === S.CLOSING && (yield ee);
      let Q = () => {
      };
      const q = new Promise((te) => Q = te);
      return [
        V,
        Q,
        Promise.race([
          // wait for
          q.then(() => {
            if (!D) {
              const te = () => V.close(1e3, "Normal Closure");
              isFinite(s) && s > 0 ? F = setTimeout(() => {
                V.readyState === S.OPEN && te();
              }, s) : te();
            }
          }),
          // or
          ee
        ])
      ];
    });
  }
  function ie(V) {
    if (xi(V) && (vy(V.code) || [
      qe.InternalServerError,
      qe.InternalClientError,
      qe.BadRequest,
      qe.BadResponse,
      qe.Unauthorized,
      // CloseCode.Forbidden, might grant access out after retry
      qe.SubprotocolNotAcceptable,
      // CloseCode.ConnectionInitialisationTimeout, might not time out after retry
      // CloseCode.ConnectionAcknowledgementTimeout, might not time out after retry
      qe.SubscriberAlreadyExists,
      qe.TooManyInitialisationRequests
      // 4499, // Terminated, probably because the socket froze, we want to retry
    ].includes(V.code)))
      throw V;
    if (J)
      return !1;
    if (xi(V) && V.code === 1e3)
      return D > 0;
    if (!f || H >= f || !d(V) || p != null && p(V))
      throw V;
    return P = !0;
  }
  n || L(this, null, function* () {
    for (D++; ; )
      try {
        const [, , V] = yield Oe();
        yield V;
      } catch (V) {
        try {
          if (!ie(V))
            return;
        } catch (ee) {
          return i == null ? void 0 : i(ee);
        }
      }
  });
  function ke(V, ee) {
    const Q = w(V);
    let q = !1, te = !1, be = () => {
      D--, q = !0;
    };
    return L(this, null, function* () {
      for (D++; ; )
        try {
          const [z, Me, se] = yield Oe();
          if (q)
            return Me();
          const we = A.onMessage(Q, (ot) => {
            switch (ot.type) {
              case me.Next: {
                ee.next(ot.payload);
                return;
              }
              case me.Error: {
                te = !0, q = !0, ee.error(ot.payload), be();
                return;
              }
              case me.Complete: {
                q = !0, be();
                return;
              }
            }
          });
          z.send(Nr({
            id: Q,
            type: me.Subscribe,
            payload: V
          }, E)), be = () => {
            !q && z.readyState === S.OPEN && z.send(Nr({
              id: Q,
              type: me.Complete
            }, E)), D--, q = !0, Me();
          }, yield se.finally(we);
          return;
        } catch (z) {
          if (!ie(z))
            return;
        }
    }).then(() => {
      te || ee.complete();
    }).catch((z) => {
      ee.error(z);
    }), () => {
      q || be();
    };
  }
  return {
    on: A.on,
    subscribe: ke,
    iterate(V) {
      const ee = [], Q = {
        done: !1,
        error: null,
        resolve: () => {
        }
      }, q = ke(V, {
        next(be) {
          ee.push(be), Q.resolve();
        },
        error(be) {
          Q.done = !0, Q.error = be, Q.resolve();
        },
        complete() {
          Q.done = !0, Q.resolve();
        }
      }), te = function() {
        return my(this, arguments, function* () {
          for (; ; ) {
            for (ee.length || (yield or(new Promise((Me) => Q.resolve = Me))); ee.length; )
              yield yield or(ee.shift());
            if (Q.error)
              throw Q.error;
            if (Q.done)
              return yield or(void 0);
          }
        });
      }();
      return te.throw = (be) => L(this, null, function* () {
        return Q.done || (Q.done = !0, Q.error = be, Q.resolve()), { done: !0, value: void 0 };
      }), te.return = () => L(this, null, function* () {
        return q(), { done: !0, value: void 0 };
      }), te;
    },
    dispose() {
      return L(this, null, function* () {
        if (J = !0, R) {
          const [V] = yield R;
          V.close(1e3, "Normal Closure");
        }
      });
    },
    terminate() {
      R && A.emit("closed", new ga());
    }
  };
}
class ga extends Error {
  constructor() {
    super(...arguments), this.name = "TerminatedCloseEvent", this.message = "4499: Terminated", this.code = 4499, this.reason = "Terminated", this.wasClean = !1;
  }
}
function xi(r) {
  return Pt(r) && "code" in r && "reason" in r;
}
function vy(r) {
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
function by(r) {
  return typeof r == "function" && "constructor" in r && "CLOSED" in r && "CLOSING" in r && "CONNECTING" in r && "OPEN" in r;
}
function wy(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var Re = typeof globalThis != "undefined" && globalThis || typeof self != "undefined" && self || typeof Re != "undefined" && Re, $e = {
  searchParams: "URLSearchParams" in Re,
  iterable: "Symbol" in Re && "iterator" in Symbol,
  blob: "FileReader" in Re && "Blob" in Re && function() {
    try {
      return new Blob(), !0;
    } catch (r) {
      return !1;
    }
  }(),
  formData: "FormData" in Re,
  arrayBuffer: "ArrayBuffer" in Re
};
function Ey(r) {
  return r && DataView.prototype.isPrototypeOf(r);
}
if ($e.arrayBuffer)
  var _y = [
    "[object Int8Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Int16Array]",
    "[object Uint16Array]",
    "[object Int32Array]",
    "[object Uint32Array]",
    "[object Float32Array]",
    "[object Float64Array]"
  ], Sy = ArrayBuffer.isView || function(r) {
    return r && _y.indexOf(Object.prototype.toString.call(r)) > -1;
  };
function on(r) {
  if (typeof r != "string" && (r = String(r)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(r) || r === "")
    throw new TypeError('Invalid character in header field name: "' + r + '"');
  return r.toLowerCase();
}
function Rs(r) {
  return typeof r != "string" && (r = String(r)), r;
}
function Ns(r) {
  var e = {
    next: function() {
      var t = r.shift();
      return { done: t === void 0, value: t };
    }
  };
  return $e.iterable && (e[Symbol.iterator] = function() {
    return e;
  }), e;
}
function Se(r) {
  this.map = {}, r instanceof Se ? r.forEach(function(e, t) {
    this.append(t, e);
  }, this) : Array.isArray(r) ? r.forEach(function(e) {
    this.append(e[0], e[1]);
  }, this) : r && Object.getOwnPropertyNames(r).forEach(function(e) {
    this.append(e, r[e]);
  }, this);
}
Se.prototype.append = function(r, e) {
  r = on(r), e = Rs(e);
  var t = this.map[r];
  this.map[r] = t ? t + ", " + e : e;
};
Se.prototype.delete = function(r) {
  delete this.map[on(r)];
};
Se.prototype.get = function(r) {
  return r = on(r), this.has(r) ? this.map[r] : null;
};
Se.prototype.has = function(r) {
  return this.map.hasOwnProperty(on(r));
};
Se.prototype.set = function(r, e) {
  this.map[on(r)] = Rs(e);
};
Se.prototype.forEach = function(r, e) {
  for (var t in this.map)
    this.map.hasOwnProperty(t) && r.call(e, this.map[t], t, this);
};
Se.prototype.keys = function() {
  var r = [];
  return this.forEach(function(e, t) {
    r.push(t);
  }), Ns(r);
};
Se.prototype.values = function() {
  var r = [];
  return this.forEach(function(e) {
    r.push(e);
  }), Ns(r);
};
Se.prototype.entries = function() {
  var r = [];
  return this.forEach(function(e, t) {
    r.push([t, e]);
  }), Ns(r);
};
$e.iterable && (Se.prototype[Symbol.iterator] = Se.prototype.entries);
function Ti(r) {
  if (r.bodyUsed)
    return Promise.reject(new TypeError("Already read"));
  r.bodyUsed = !0;
}
function mc(r) {
  return new Promise(function(e, t) {
    r.onload = function() {
      e(r.result);
    }, r.onerror = function() {
      t(r.error);
    };
  });
}
function ky(r) {
  var e = new FileReader(), t = mc(e);
  return e.readAsArrayBuffer(r), t;
}
function xy(r) {
  var e = new FileReader(), t = mc(e);
  return e.readAsText(r), t;
}
function Ty(r) {
  for (var e = new Uint8Array(r), t = new Array(e.length), n = 0; n < e.length; n++)
    t[n] = String.fromCharCode(e[n]);
  return t.join("");
}
function va(r) {
  if (r.slice)
    return r.slice(0);
  var e = new Uint8Array(r.byteLength);
  return e.set(new Uint8Array(r)), e.buffer;
}
function gc() {
  return this.bodyUsed = !1, this._initBody = function(r) {
    this.bodyUsed = this.bodyUsed, this._bodyInit = r, r ? typeof r == "string" ? this._bodyText = r : $e.blob && Blob.prototype.isPrototypeOf(r) ? this._bodyBlob = r : $e.formData && FormData.prototype.isPrototypeOf(r) ? this._bodyFormData = r : $e.searchParams && URLSearchParams.prototype.isPrototypeOf(r) ? this._bodyText = r.toString() : $e.arrayBuffer && $e.blob && Ey(r) ? (this._bodyArrayBuffer = va(r.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : $e.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(r) || Sy(r)) ? this._bodyArrayBuffer = va(r) : this._bodyText = r = Object.prototype.toString.call(r) : this._bodyText = "", this.headers.get("content-type") || (typeof r == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : $e.searchParams && URLSearchParams.prototype.isPrototypeOf(r) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
  }, $e.blob && (this.blob = function() {
    var r = Ti(this);
    if (r)
      return r;
    if (this._bodyBlob)
      return Promise.resolve(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(new Blob([this._bodyArrayBuffer]));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as blob");
    return Promise.resolve(new Blob([this._bodyText]));
  }, this.arrayBuffer = function() {
    if (this._bodyArrayBuffer) {
      var r = Ti(this);
      return r || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
        this._bodyArrayBuffer.buffer.slice(
          this._bodyArrayBuffer.byteOffset,
          this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
        )
      ) : Promise.resolve(this._bodyArrayBuffer));
    } else
      return this.blob().then(ky);
  }), this.text = function() {
    var r = Ti(this);
    if (r)
      return r;
    if (this._bodyBlob)
      return xy(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(Ty(this._bodyArrayBuffer));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as text");
    return Promise.resolve(this._bodyText);
  }, $e.formData && (this.formData = function() {
    return this.text().then(Oy);
  }), this.json = function() {
    return this.text().then(JSON.parse);
  }, this;
}
var Iy = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
function Ay(r) {
  var e = r.toUpperCase();
  return Iy.indexOf(e) > -1 ? e : r;
}
function Ht(r, e) {
  if (!(this instanceof Ht))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  e = e || {};
  var t = e.body;
  if (r instanceof Ht) {
    if (r.bodyUsed)
      throw new TypeError("Already read");
    this.url = r.url, this.credentials = r.credentials, e.headers || (this.headers = new Se(r.headers)), this.method = r.method, this.mode = r.mode, this.signal = r.signal, !t && r._bodyInit != null && (t = r._bodyInit, r.bodyUsed = !0);
  } else
    this.url = String(r);
  if (this.credentials = e.credentials || this.credentials || "same-origin", (e.headers || !this.headers) && (this.headers = new Se(e.headers)), this.method = Ay(e.method || this.method || "GET"), this.mode = e.mode || this.mode || null, this.signal = e.signal || this.signal, this.referrer = null, (this.method === "GET" || this.method === "HEAD") && t)
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
Ht.prototype.clone = function() {
  return new Ht(this, { body: this._bodyInit });
};
function Oy(r) {
  var e = new FormData();
  return r.trim().split("&").forEach(function(t) {
    if (t) {
      var n = t.split("="), i = n.shift().replace(/\+/g, " "), s = n.join("=").replace(/\+/g, " ");
      e.append(decodeURIComponent(i), decodeURIComponent(s));
    }
  }), e;
}
function Cy(r) {
  var e = new Se(), t = r.replace(/\r?\n[\t ]+/g, " ");
  return t.split("\r").map(function(n) {
    return n.indexOf(`
`) === 0 ? n.substr(1, n.length) : n;
  }).forEach(function(n) {
    var i = n.split(":"), s = i.shift().trim();
    if (s) {
      var o = i.join(":").trim();
      e.append(s, o);
    }
  }), e;
}
gc.call(Ht.prototype);
function it(r, e) {
  if (!(this instanceof it))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  e || (e = {}), this.type = "default", this.status = e.status === void 0 ? 200 : e.status, this.ok = this.status >= 200 && this.status < 300, this.statusText = e.statusText === void 0 ? "" : "" + e.statusText, this.headers = new Se(e.headers), this.url = e.url || "", this._initBody(r);
}
gc.call(it.prototype);
it.prototype.clone = function() {
  return new it(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Se(this.headers),
    url: this.url
  });
};
it.error = function() {
  var r = new it(null, { status: 0, statusText: "" });
  return r.type = "error", r;
};
var Ry = [301, 302, 303, 307, 308];
it.redirect = function(r, e) {
  if (Ry.indexOf(e) === -1)
    throw new RangeError("Invalid status code");
  return new it(null, { status: e, headers: { location: r } });
};
var qt = Re.DOMException;
try {
  new qt();
} catch (r) {
  qt = function(e, t) {
    this.message = e, this.name = t;
    var n = Error(e);
    this.stack = n.stack;
  }, qt.prototype = Object.create(Error.prototype), qt.prototype.constructor = qt;
}
function vc(r, e) {
  return new Promise(function(t, n) {
    var i = new Ht(r, e);
    if (i.signal && i.signal.aborted)
      return n(new qt("Aborted", "AbortError"));
    var s = new XMLHttpRequest();
    function o() {
      s.abort();
    }
    s.onload = function() {
      var u = {
        status: s.status,
        statusText: s.statusText,
        headers: Cy(s.getAllResponseHeaders() || "")
      };
      u.url = "responseURL" in s ? s.responseURL : u.headers.get("X-Request-URL");
      var f = "response" in s ? s.response : s.responseText;
      setTimeout(function() {
        t(new it(f, u));
      }, 0);
    }, s.onerror = function() {
      setTimeout(function() {
        n(new TypeError("Network request failed"));
      }, 0);
    }, s.ontimeout = function() {
      setTimeout(function() {
        n(new TypeError("Network request failed"));
      }, 0);
    }, s.onabort = function() {
      setTimeout(function() {
        n(new qt("Aborted", "AbortError"));
      }, 0);
    };
    function a(u) {
      try {
        return u === "" && Re.location.href ? Re.location.href : u;
      } catch (f) {
        return u;
      }
    }
    s.open(i.method, a(i.url), !0), i.credentials === "include" ? s.withCredentials = !0 : i.credentials === "omit" && (s.withCredentials = !1), "responseType" in s && ($e.blob ? s.responseType = "blob" : $e.arrayBuffer && i.headers.get("Content-Type") && i.headers.get("Content-Type").indexOf("application/octet-stream") !== -1 && (s.responseType = "arraybuffer")), e && typeof e.headers == "object" && !(e.headers instanceof Se) ? Object.getOwnPropertyNames(e.headers).forEach(function(u) {
      s.setRequestHeader(u, Rs(e.headers[u]));
    }) : i.headers.forEach(function(u, f) {
      s.setRequestHeader(f, u);
    }), i.signal && (i.signal.addEventListener("abort", o), s.onreadystatechange = function() {
      s.readyState === 4 && i.signal.removeEventListener("abort", o);
    }), s.send(typeof i._bodyInit == "undefined" ? null : i._bodyInit);
  });
}
vc.polyfill = !0;
Re.fetch || (Re.fetch = vc, Re.Headers = Se, Re.Request = Ht, Re.Response = it);
var Ny = self.fetch.bind(self);
const Dy = /* @__PURE__ */ wy(Ny);
function Fy({
  graphQLErrors: r,
  networkError: e,
  operation: t,
  forward: n,
  response: i
}) {
  if (r && r.forEach(
    ({ message: s, debugMessage: o, locations: a, path: u }) => console.error(
      `[GraphQL error]: ${s}`,
      `
  Message : ${o}`,
      `
  Path    : ${u}`,
      `
  Location: ${JSON.stringify(a)}`
    )
  ), e) {
    const { name: s, statusCode: o, result: a = {} } = e;
    console.error(`[Network error]: ${s}, status code: ${o}`);
  }
}
function My(r) {
  return r.query.definitions.find(
    (n) => n.kind === "OperationDefinition"
  ).selectionSet.selections.find(
    (n) => n.kind === "Field"
  ).name.value;
}
function By(r) {
  return r.query.definitions.find(
    (t) => t.kind === "OperationDefinition"
  ).operation;
}
class $y extends We {
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
    const n = My(e), i = By(e), s = i === "mutation" && n === "ProposeMolecule";
    if ([
      i === "query" && ["__schema", "ContinuId"].includes(n),
      i === "mutation" && n === "AccessToken",
      s && de.get(e, "variables.molecule.atoms.0.isotope") === "U"
    ].some((c) => c))
      return t(e);
    const a = this.getWallet(), u = this.getPubKey();
    if (!u)
      throw new Ve("CipherLink::request() - Node public key missing!");
    if (!a)
      throw new Ve("CipherLink::request() - Authorized wallet missing!");
    const f = {
      query: lu(e.query),
      variables: JSON.stringify(e.variables)
    };
    return e.operationName = null, e.query = ue`query ($Hash: String!) { CipherHash(Hash: $Hash) { hash } }`, e.variables = { Hash: JSON.stringify(a.encryptMessage(f, u)) }, t(e).map((c) => {
      let d = c.data;
      if (d.data && (d = d.data), d.CipherHash && d.CipherHash.hash) {
        const p = JSON.parse(d.CipherHash.hash), y = a.decryptMessage(p);
        if (y === null)
          throw new Ve("CipherLink::request() - Unable to decrypt response!");
        return y;
      }
      return c;
    });
  }
}
class gn extends fc {
  /**
   * @param {Object} config - Configuration object
   * @param {string} config.serverUri - URI of the GraphQL server
   * @param {Object|null} config.soketi - WebSocket configuration (optional)
   * @param {boolean} config.encrypt - Whether to use encryption (default: false)
   */
  constructor({ serverUri: e, soketi: t = null, encrypt: n = !1 }) {
    const i = zu({
      uri: e,
      fetch: Dy
    }), s = "", o = cy((d, { headers: p }) => ({
      headers: vr(Ue({}, p), {
        "X-Auth-Token": s
      })
    })), a = dc(Fy);
    let u = Lo([o, a, i]), f;
    n && (f = new $y(), u = Lo([f, u]));
    let c;
    t && t.socketUri && (c = new hy(gy({
      url: t.socketUri,
      connectionParams: () => ({
        authToken: s
      })
    })), u = Ap(
      ({ query: d }) => {
        const p = mr(d);
        return p.kind === "OperationDefinition" && p.operation === "subscription";
      },
      c,
      u
    )), super({
      link: u,
      cache: new uc(),
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
    }), this.serverUri = e, this.soketi = t, this.authToken = s, this.pubkey = null, this.wallet = null, this.cipherLink = f, this.wsLink = c;
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
class Py {
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
class Ly {
  /**
   * @param {Object} config - Configuration object
   * @param {string} config.serverUri - URI of the GraphQL server
   * @param {Object|null} config.socket - WebSocket configuration (optional)
   * @param {boolean} config.encrypt - Whether to use encryption (default: false)
   */
  constructor({ serverUri: e, socket: t = null, encrypt: n = !1 }) {
    this.$__client = new gn({ serverUri: e, soketi: t, encrypt: n }), this.$__subscriptionManager = new Py(this.$__client);
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
    this.$__client = new gn(t), this.$__subscriptionManager.setClient(this.$__client);
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
  query(e) {
    return L(this, null, function* () {
      return this.$__client.query(e);
    });
  }
  /**
   * Execute a mutation
   * @param {Object} request - Mutation request
   * @returns {Promise} Promise resolving to the mutation result
   */
  mutate(e) {
    return L(this, null, function* () {
      return this.$__client.mutate(e);
    });
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
    this.$__client = new gn(t), this.$__subscriptionManager.setClient(this.$__client);
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
    this.$__client = new gn(n), this.$__subscriptionManager.setClient(this.$__client);
  }
}
class Xn {
  /**
   *
   * @param {ApolloClient} apolloClient
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
      throw new Ve("Subscribe::createSubscribe() - Node URI was not initialized for this client instance!");
    if (this.$__subscribe === null)
      throw new Ve("Subscribe::createSubscribe() - GraphQL subscription was not initialized!");
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
  execute(n) {
    return L(this, arguments, function* ({
      variables: e = null,
      closure: t
    }) {
      if (!t)
        throw new Ve(`${this.constructor.name}::execute() - closure parameter is required!`);
      return this.$__request = this.createSubscribe({
        variables: e
      }), this.client.subscribe(this.$__request, t);
    });
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
class Uy extends Xn {
  constructor(e) {
    super(e), this.$__subscribe = ue`
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
class qy extends Xn {
  constructor(e) {
    super(e), this.$__subscribe = ue`
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
class jy extends Xn {
  constructor(e) {
    super(e), this.$__subscribe = ue`
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
class Qy extends Xn {
  constructor(e) {
    super(e), this.$__subscribe = ue`
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
class Vy extends _e {
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
class Hy extends Cs {
  /**
   * @param {ApolloClient} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ue`mutation(
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
    return new Vy({
      query: this,
      json: e
    });
  }
}
class Wy extends _e {
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
      const i = Ue({}, n);
      i.jsonData && (i.jsonData = JSON.parse(i.jsonData)), i.createdAt && (i.createdAt = new Date(i.createdAt)), i.updatedAt && (i.updatedAt = new Date(i.updatedAt)), t.push(i);
    }
    return t;
  }
}
class zy extends Le {
  /**
   * @param {ApolloClient} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ue`query ActiveUserQuery ($bundleHash:String, $metaType: String, $metaId: String) {
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
    return new Wy({
      query: this,
      json: e
    });
  }
}
class Ky extends _e {
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
class Gy extends Le {
  /**
   * @param {ApolloClient} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ue`query UserActivity (
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
    return new Ky({
      query: this,
      json: e
    });
  }
}
class Jy extends Le {
  /**
   * @param {ApolloClient} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ue`query( $slug: String, $slugs: [ String! ], $limit: Int, $order: String ) {
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
    return new _e({
      query: this,
      json: e,
      dataKey: "data.Token"
    });
  }
}
class ba extends ae {
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
class Yy extends _e {
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
class wa extends Le {
  /**
   * @param {ApolloClient} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ue`query(
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
    walletAddress: u,
    isotopes: f,
    isotope: c,
    tokenSlugs: d,
    tokenSlug: p,
    cellSlugs: y,
    cellSlug: v,
    batchIds: w,
    batchId: E,
    values: b,
    value: k,
    metaTypes: S,
    metaType: A,
    metaIds: O,
    metaId: R,
    indexes: D,
    index: F,
    filter: P,
    latest: H,
    queryArgs: J
  }) {
    return t && (e = e || [], e.push(t)), i && (n = n || [], n.push(i)), o && (s = s || [], s.push(o)), u && (a = a || [], a.push(u)), c && (f = f || [], f.push(c)), p && (d = d || [], d.push(p)), v && (y = y || [], y.push(v)), E && (w = w || [], w.push(E)), k && (b = b || [], b.push(k)), A && (S = S || [], S.push(A)), R && (O = O || [], O.push(R)), F && (D = D || [], D.push(F)), {
      molecularHashes: e,
      bundleHashes: n,
      positions: s,
      walletAddresses: a,
      isotopes: f,
      tokenSlugs: d,
      cellSlugs: y,
      batchIds: w,
      values: b,
      metaTypes: S,
      metaIds: O,
      indexes: D,
      filter: P,
      latest: H,
      queryArgs: J
    };
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseAtom}
   */
  createResponse(e) {
    return new Yy({
      query: this,
      json: e
    });
  }
}
class Xy extends _e {
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
class Zy extends Le {
  /**
   * @param {ApolloClient} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ue`query( $metaType: String, $metaId: String, ) {
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
    return new Xy({
      query: this,
      json: e
    });
  }
}
class em extends _e {
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
class Ea extends Le {
  /**
   * @param {ApolloClient} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ue`query ($metaTypes: [String!], $metaIds: [String!], $values: [String!], $keys: [String!], $latest: Boolean, $filter: [MetaFilter!], $queryArgs: QueryArgs, $countBy: String, $atomValues: [String!] ) {
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
    latest: u = null,
    latestMetas: f = !0,
    filter: c = null,
    queryArgs: d = null,
    countBy: p = null
  }) {
    const y = {};
    return a && (y.atomValues = a), s && (y.keys = s), o && (y.values = o), e && (y.metaTypes = typeof e == "string" ? [e] : e), t && (y.metaIds = typeof t == "string" ? [t] : t), p && (y.countBy = p), c && (y.filter = c), n && i && (y.filter = y.filter || [], y.filter.push({
      key: n,
      value: i,
      comparison: "="
    })), u && (y.latest = !!u, y.latest = !!f), d && ((typeof d.limit == "undefined" || d.limit === 0) && (d.limit = "*"), y.queryArgs = d), y;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaTypeViaAtom}
   */
  createResponse(e) {
    return new em({
      query: this,
      json: e
    });
  }
}
class tm extends st {
}
class rm extends Ie {
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
    return new tm({
      query: this,
      json: e
    });
  }
}
class nm extends Ie {
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
class im extends Ie {
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
function ft(r, e, t, n) {
  return new (t || (t = Promise))(function(i, s) {
    function o(f) {
      try {
        u(n.next(f));
      } catch (c) {
        s(c);
      }
    }
    function a(f) {
      try {
        u(n.throw(f));
      } catch (c) {
        s(c);
      }
    }
    function u(f) {
      var c;
      f.done ? i(f.value) : (c = f.value, c instanceof t ? c : new t(function(d) {
        d(c);
      })).then(o, a);
    }
    u((n = n.apply(r, [])).next());
  });
}
function ht(r, e) {
  var t, n, i, s, o = { label: 0, sent: function() {
    if (1 & i[0]) throw i[1];
    return i[1];
  }, trys: [], ops: [] };
  return s = { next: a(0), throw: a(1), return: a(2) }, typeof Symbol == "function" && (s[Symbol.iterator] = function() {
    return this;
  }), s;
  function a(u) {
    return function(f) {
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
      }([u, f]);
    };
  }
}
var pt = { exclude: [] }, bc = {}, sm = { timeout: "true" }, Je = function(r, e) {
  typeof window != "undefined" && (bc[r] = e);
}, om = function() {
  return Object.fromEntries(Object.entries(bc).filter(function(r) {
    var e, t = r[0];
    return !(!((e = pt == null ? void 0 : pt.exclude) === null || e === void 0) && e.includes(t));
  }).map(function(r) {
    return [r[0], (0, r[1])()];
  }));
}, _a = 3432918353, Sa = 461845907, am = 3864292196, um = 2246822507, cm = 3266489909;
function Ii(r, e) {
  return r << e | r >>> 32 - e;
}
function Ds(r, e) {
  e === void 0 && (e = 0);
  for (var t = e, n = 0, i = 3 & r.length, s = r.length - i, o = 0; o < s; ) n = 255 & r.charCodeAt(o) | (255 & r.charCodeAt(++o)) << 8 | (255 & r.charCodeAt(++o)) << 16 | (255 & r.charCodeAt(++o)) << 24, ++o, n = Ii(n = Math.imul(n, _a), 15), t = Ii(t ^= n = Math.imul(n, Sa), 13), t = Math.imul(t, 5) + am;
  switch (n = 0, i) {
    case 3:
      n ^= (255 & r.charCodeAt(o + 2)) << 16;
    case 2:
      n ^= (255 & r.charCodeAt(o + 1)) << 8;
    case 1:
      n ^= 255 & r.charCodeAt(o), n = Ii(n = Math.imul(n, _a), 15), t ^= n = Math.imul(n, Sa);
  }
  return ((t = function(a) {
    return a ^= a >>> 16, a = Math.imul(a, um), a ^= a >>> 13, a = Math.imul(a, cm), a ^ a >>> 16;
  }(t ^= r.length)) >>> 0).toString(36);
}
function lm(r, e) {
  return new Promise(function(t) {
    setTimeout(function() {
      return t(e);
    }, r);
  });
}
function fm(r, e, t) {
  return Promise.all(r.map(function(n) {
    return Promise.race([n, lm(e, t)]);
  }));
}
function wc() {
  return ft(this, void 0, void 0, function() {
    var r, e, t, n, i;
    return ht(this, function(s) {
      switch (s.label) {
        case 0:
          return s.trys.push([0, 2, , 3]), r = om(), e = Object.keys(r), [4, fm(Object.values(r), (pt == null ? void 0 : pt.timeout) || 1e3, sm)];
        case 1:
          return t = s.sent(), n = t.filter(function(o) {
            return o !== void 0;
          }), i = {}, n.forEach(function(o, a) {
            i[e[a]] = o;
          }), [2, Ec(i, pt.exclude || [])];
        case 2:
          throw s.sent();
        case 3:
          return [2];
      }
    });
  });
}
function Ec(r, e) {
  var t = {}, n = function(s) {
    if (r.hasOwnProperty(s)) {
      var o = r[s];
      if (typeof o != "object" || Array.isArray(o)) e.includes(s) || (t[s] = o);
      else {
        var a = Ec(o, e.map(function(u) {
          return u.startsWith(s + ".") ? u.slice(s.length + 1) : u;
        }));
        Object.keys(a).length > 0 && (t[s] = a);
      }
    }
  };
  for (var i in r) n(i);
  return t;
}
function hm(r) {
  return ft(this, void 0, void 0, function() {
    var e, t;
    return ht(this, function(n) {
      switch (n.label) {
        case 0:
          return n.trys.push([0, 2, , 3]), [4, wc()];
        case 1:
          return e = n.sent(), t = Ds(JSON.stringify(e)), [2, t.toString()];
        case 2:
          throw n.sent();
        case 3:
          return [2];
      }
    });
  });
}
function pm(r) {
  for (var e = 0, t = 0; t < r.length; ++t) e += Math.abs(r[t]);
  return e;
}
function _c(r, e, t) {
  for (var n = [], i = 0; i < r[0].data.length; i++) {
    for (var s = [], o = 0; o < r.length; o++) s.push(r[o].data[i]);
    n.push(dm(s));
  }
  var a = new Uint8ClampedArray(n);
  return new ImageData(a, e, t);
}
function dm(r) {
  if (r.length === 0) return 0;
  for (var e = {}, t = 0, n = r; t < n.length; t++)
    e[s = n[t]] = (e[s] || 0) + 1;
  var i = r[0];
  for (var s in e) e[s] > e[i] && (i = parseInt(s, 10));
  return i;
}
function Xr() {
  if (typeof navigator == "undefined") return { name: "unknown", version: "unknown" };
  for (var r = navigator.userAgent, e = { Edg: "Edge", OPR: "Opera" }, t = 0, n = [new RegExp("(?<name>Edge|Edg)\\/(?<version>\\d+(?:\\.\\d+)?)"), new RegExp("(?<name>(?:Chrome|Chromium|OPR|Opera|Vivaldi|Brave))\\/(?<version>\\d+(?:\\.\\d+)?)"), new RegExp("(?<name>(?:Firefox|Waterfox|Iceweasel|IceCat))\\/(?<version>\\d+(?:\\.\\d+)?)"), new RegExp("(?<name>Safari)\\/(?<version>\\d+(?:\\.\\d+)?)"), new RegExp("(?<name>MSIE|Trident|IEMobile).+?(?<version>\\d+(?:\\.\\d+)?)"), new RegExp("(?<name>[A-Za-z]+)\\/(?<version>\\d+(?:\\.\\d+)?)"), new RegExp("(?<name>SamsungBrowser)\\/(?<version>\\d+(?:\\.\\d+)?)")]; t < n.length; t++) {
    var i = n[t], s = r.match(i);
    if (s && s.groups) return { name: e[s.groups.name] || s.groups.name, version: s.groups.version };
  }
  return { name: "unknown", version: "unknown" };
}
Je("audio", function() {
  return ft(this, void 0, void 0, function() {
    return ht(this, function(r) {
      return [2, new Promise(function(e, t) {
        try {
          var n = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 5e3, 44100), i = n.createBufferSource(), s = n.createOscillator();
          s.frequency.value = 1e3;
          var o, a = n.createDynamicsCompressor();
          a.threshold.value = -50, a.knee.value = 40, a.ratio.value = 12, a.attack.value = 0, a.release.value = 0.2, s.connect(a), a.connect(n.destination), s.start(), n.oncomplete = function(u) {
            o = u.renderedBuffer.getChannelData(0), e({ sampleHash: pm(o), oscillator: s.type, maxChannels: n.destination.maxChannelCount, channelCountMode: i.channelCountMode });
          }, n.startRendering();
        } catch (u) {
          console.error("Error creating audio fingerprint:", u), t(u);
        }
      })];
    });
  });
});
var ym = Xr().name !== "SamsungBrowser" ? 1 : 3, ka = 280, xa = 20;
Xr().name != "Firefox" && Je("canvas", function() {
  return document.createElement("canvas").getContext("2d"), new Promise(function(r) {
    var e = Array.from({ length: ym }, function() {
      return function() {
        var t = document.createElement("canvas"), n = t.getContext("2d");
        if (!n) return new ImageData(1, 1);
        t.width = ka, t.height = xa;
        var i = n.createLinearGradient(0, 0, t.width, t.height);
        i.addColorStop(0, "red"), i.addColorStop(0.16666666666666666, "orange"), i.addColorStop(0.3333333333333333, "yellow"), i.addColorStop(0.5, "green"), i.addColorStop(0.6666666666666666, "blue"), i.addColorStop(0.8333333333333334, "indigo"), i.addColorStop(1, "violet"), n.fillStyle = i, n.fillRect(0, 0, t.width, t.height);
        var s = "Random Text WMwmil10Oo";
        n.font = "23.123px Arial", n.fillStyle = "black", n.fillText(s, -5, 15), n.fillStyle = "rgba(0, 0, 255, 0.5)", n.fillText(s, -3.3, 17.7), n.beginPath(), n.moveTo(0, 0), n.lineTo(2 * t.width / 7, t.height), n.strokeStyle = "white", n.lineWidth = 2, n.stroke();
        var o = n.getImageData(0, 0, t.width, t.height);
        return o;
      }();
    });
    r({ commonImageDataHash: Ds(_c(e, ka, xa).data.toString()).toString() });
  });
});
var Ai, mm = ["Arial", "Arial Black", "Arial Narrow", "Arial Rounded MT", "Arimo", "Archivo", "Barlow", "Bebas Neue", "Bitter", "Bookman", "Calibri", "Cabin", "Candara", "Century", "Century Gothic", "Comic Sans MS", "Constantia", "Courier", "Courier New", "Crimson Text", "DM Mono", "DM Sans", "DM Serif Display", "DM Serif Text", "Dosis", "Droid Sans", "Exo", "Fira Code", "Fira Sans", "Franklin Gothic Medium", "Garamond", "Geneva", "Georgia", "Gill Sans", "Helvetica", "Impact", "Inconsolata", "Indie Flower", "Inter", "Josefin Sans", "Karla", "Lato", "Lexend", "Lucida Bright", "Lucida Console", "Lucida Sans Unicode", "Manrope", "Merriweather", "Merriweather Sans", "Montserrat", "Myriad", "Noto Sans", "Nunito", "Nunito Sans", "Open Sans", "Optima", "Orbitron", "Oswald", "Pacifico", "Palatino", "Perpetua", "PT Sans", "PT Serif", "Poppins", "Prompt", "Public Sans", "Quicksand", "Rajdhani", "Recursive", "Roboto", "Roboto Condensed", "Rockwell", "Rubik", "Segoe Print", "Segoe Script", "Segoe UI", "Sora", "Source Sans Pro", "Space Mono", "Tahoma", "Taviraj", "Times", "Times New Roman", "Titillium Web", "Trebuchet MS", "Ubuntu", "Varela Round", "Verdana", "Work Sans"], gm = ["monospace", "sans-serif", "serif"];
function Ta(r, e) {
  if (!r) throw new Error("Canvas context not supported");
  return r.font, r.font = "72px ".concat(e), r.measureText("WwMmLli0Oo").width;
}
function vm() {
  var r, e = document.createElement("canvas"), t = (r = e.getContext("webgl")) !== null && r !== void 0 ? r : e.getContext("experimental-webgl");
  if (t && "getParameter" in t) {
    var n = t.getExtension("WEBGL_debug_renderer_info");
    return { vendor: (t.getParameter(t.VENDOR) || "").toString(), vendorUnmasked: n ? (t.getParameter(n.UNMASKED_VENDOR_WEBGL) || "").toString() : "", renderer: (t.getParameter(t.RENDERER) || "").toString(), rendererUnmasked: n ? (t.getParameter(n.UNMASKED_RENDERER_WEBGL) || "").toString() : "", version: (t.getParameter(t.VERSION) || "").toString(), shadingLanguageVersion: (t.getParameter(t.SHADING_LANGUAGE_VERSION) || "").toString() };
  }
  return "undefined";
}
function bm() {
  var r = new Float32Array(1), e = new Uint8Array(r.buffer);
  return r[0] = 1 / 0, r[0] = r[0] - r[0], e[3];
}
function wm(r, e) {
  var t = {};
  return e.forEach(function(n) {
    var i = function(s) {
      if (s.length === 0) return null;
      var o = {};
      s.forEach(function(f) {
        var c = String(f);
        o[c] = (o[c] || 0) + 1;
      });
      var a = s[0], u = 1;
      return Object.keys(o).forEach(function(f) {
        o[f] > u && (a = f, u = o[f]);
      }), a;
    }(r.map(function(s) {
      return n in s ? s[n] : void 0;
    }).filter(function(s) {
      return s !== void 0;
    }));
    i && (t[n] = i);
  }), t;
}
function Em() {
  var r = [], e = { "prefers-contrast": ["high", "more", "low", "less", "forced", "no-preference"], "any-hover": ["hover", "none"], "any-pointer": ["none", "coarse", "fine"], pointer: ["none", "coarse", "fine"], hover: ["hover", "none"], update: ["fast", "slow"], "inverted-colors": ["inverted", "none"], "prefers-reduced-motion": ["reduce", "no-preference"], "prefers-reduced-transparency": ["reduce", "no-preference"], scripting: ["none", "initial-only", "enabled"], "forced-colors": ["active", "none"] };
  return Object.keys(e).forEach(function(t) {
    e[t].forEach(function(n) {
      matchMedia("(".concat(t, ": ").concat(n, ")")).matches && r.push("".concat(t, ": ").concat(n));
    });
  }), r;
}
function _m() {
  if (window.location.protocol === "https:" && typeof window.ApplePaySession == "function") try {
    for (var r = window.ApplePaySession.supportsVersion, e = 15; e > 0; e--) if (r(e)) return e;
  } catch (t) {
    return 0;
  }
  return 0;
}
Xr().name != "Firefox" && Je("fonts", function() {
  var r = this;
  return new Promise(function(e, t) {
    try {
      (function(n) {
        var i;
        ft(this, void 0, void 0, function() {
          var s, o, a;
          return ht(this, function(u) {
            switch (u.label) {
              case 0:
                return document.body ? [3, 2] : [4, (f = 50, new Promise(function(d) {
                  return setTimeout(d, f, c);
                }))];
              case 1:
                return u.sent(), [3, 0];
              case 2:
                if ((s = document.createElement("iframe")).setAttribute("frameBorder", "0"), (o = s.style).setProperty("position", "fixed"), o.setProperty("display", "block", "important"), o.setProperty("visibility", "visible"), o.setProperty("border", "0"), o.setProperty("opacity", "0"), s.src = "about:blank", document.body.appendChild(s), !(a = s.contentDocument || ((i = s.contentWindow) === null || i === void 0 ? void 0 : i.document))) throw new Error("Iframe document is not accessible");
                return n({ iframe: a }), setTimeout(function() {
                  document.body.removeChild(s);
                }, 0), [2];
            }
            var f, c;
          });
        });
      })(function(n) {
        var i = n.iframe;
        return ft(r, void 0, void 0, function() {
          var s, o, a, u;
          return ht(this, function(f) {
            return s = i.createElement("canvas"), o = s.getContext("2d"), a = gm.map(function(c) {
              return Ta(o, c);
            }), u = {}, mm.forEach(function(c) {
              var d = Ta(o, c);
              a.includes(d) || (u[c] = d);
            }), e(u), [2];
          });
        });
      });
    } catch (n) {
      t({ error: "unsupported" });
    }
  });
}), Je("hardware", function() {
  return new Promise(function(r, e) {
    var t = navigator.deviceMemory !== void 0 ? navigator.deviceMemory : 0, n = window.performance && window.performance.memory ? window.performance.memory : 0;
    r({ videocard: vm(), architecture: bm(), deviceMemory: t.toString() || "undefined", jsHeapSizeLimit: n.jsHeapSizeLimit || 0 });
  });
}), Je("locales", function() {
  return new Promise(function(r) {
    r({ languages: navigator.language, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  });
}), Je("permissions", function() {
  return ft(this, void 0, void 0, function() {
    var r;
    return ht(this, function(e) {
      return Ai = (pt == null ? void 0 : pt.permissions_to_check) || ["accelerometer", "accessibility", "accessibility-events", "ambient-light-sensor", "background-fetch", "background-sync", "bluetooth", "camera", "clipboard-read", "clipboard-write", "device-info", "display-capture", "gyroscope", "geolocation", "local-fonts", "magnetometer", "microphone", "midi", "nfc", "notifications", "payment-handler", "persistent-storage", "push", "speaker", "storage-access", "top-level-storage-access", "window-management", "query"], r = Array.from({ length: (pt == null ? void 0 : pt.retries) || 3 }, function() {
        return function() {
          return ft(this, void 0, void 0, function() {
            var t, n, i, s, o;
            return ht(this, function(a) {
              switch (a.label) {
                case 0:
                  t = {}, n = 0, i = Ai, a.label = 1;
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
        return wm(t, Ai);
      })];
    });
  });
}), Je("plugins", function() {
  var r = [];
  if (navigator.plugins) for (var e = 0; e < navigator.plugins.length; e++) {
    var t = navigator.plugins[e];
    r.push([t.name, t.filename, t.description].join("|"));
  }
  return new Promise(function(n) {
    n({ plugins: r });
  });
}), Je("screen", function() {
  return new Promise(function(r) {
    r({ is_touchscreen: navigator.maxTouchPoints > 0, maxTouchPoints: navigator.maxTouchPoints, colorDepth: screen.colorDepth, mediaMatches: Em() });
  });
}), Je("system", function() {
  return new Promise(function(r) {
    var e = Xr();
    r({ platform: window.navigator.platform, cookieEnabled: window.navigator.cookieEnabled, productSub: navigator.productSub, product: navigator.product, useragent: navigator.userAgent, browser: { name: e.name, version: e.version }, applePayVersion: _m() });
  });
});
var De, Sm = Xr().name !== "SamsungBrowser" ? 1 : 3, U = null;
typeof document != "undefined" && ((De = document.createElement("canvas")).width = 200, De.height = 100, U = De.getContext("webgl")), Je("webgl", function() {
  return ft(this, void 0, void 0, function() {
    var r;
    return ht(this, function(e) {
      try {
        if (!U) throw new Error("WebGL not supported");
        return r = Array.from({ length: Sm }, function() {
          return function() {
            try {
              if (!U) throw new Error("WebGL not supported");
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
      `, i = U.createShader(U.VERTEX_SHADER), s = U.createShader(U.FRAGMENT_SHADER);
              if (!i || !s) throw new Error("Failed to create shaders");
              if (U.shaderSource(i, t), U.shaderSource(s, n), U.compileShader(i), !U.getShaderParameter(i, U.COMPILE_STATUS)) throw new Error("Vertex shader compilation failed: " + U.getShaderInfoLog(i));
              if (U.compileShader(s), !U.getShaderParameter(s, U.COMPILE_STATUS)) throw new Error("Fragment shader compilation failed: " + U.getShaderInfoLog(s));
              var o = U.createProgram();
              if (!o) throw new Error("Failed to create shader program");
              if (U.attachShader(o, i), U.attachShader(o, s), U.linkProgram(o), !U.getProgramParameter(o, U.LINK_STATUS)) throw new Error("Shader program linking failed: " + U.getProgramInfoLog(o));
              U.useProgram(o);
              for (var a = 137, u = new Float32Array(4 * a), f = 2 * Math.PI / a, c = 0; c < a; c++) {
                var d = c * f;
                u[4 * c] = 0, u[4 * c + 1] = 0, u[4 * c + 2] = Math.cos(d) * (De.width / 2), u[4 * c + 3] = Math.sin(d) * (De.height / 2);
              }
              var p = U.createBuffer();
              U.bindBuffer(U.ARRAY_BUFFER, p), U.bufferData(U.ARRAY_BUFFER, u, U.STATIC_DRAW);
              var y = U.getAttribLocation(o, "position");
              U.enableVertexAttribArray(y), U.vertexAttribPointer(y, 2, U.FLOAT, !1, 0, 0), U.viewport(0, 0, De.width, De.height), U.clearColor(0, 0, 0, 1), U.clear(U.COLOR_BUFFER_BIT), U.drawArrays(U.LINES, 0, 2 * a);
              var v = new Uint8ClampedArray(De.width * De.height * 4);
              return U.readPixels(0, 0, De.width, De.height, U.RGBA, U.UNSIGNED_BYTE, v), new ImageData(v, De.width, De.height);
            } catch (w) {
              return new ImageData(1, 1);
            } finally {
              U && (U.bindBuffer(U.ARRAY_BUFFER, null), U.useProgram(null), U.viewport(0, 0, U.drawingBufferWidth, U.drawingBufferHeight), U.clearColor(0, 0, 0, 0));
            }
          }();
        }), [2, { commonImageHash: Ds(_c(r, De.width, De.height).data.toString()).toString() }];
      } catch (t) {
        return [2, { webgl: "unsupported" }];
      }
      return [2];
    });
  });
});
var Bt = function(r, e, t, n) {
  for (var i = (t - e) / n, s = 0, o = 0; o < n; o++)
    s += r(e + (o + 0.5) * i);
  return s * i;
};
Je("math", function() {
  return ft(void 0, void 0, void 0, function() {
    return ht(this, function(r) {
      return [2, { acos: Math.acos(0.5), asin: Bt(Math.asin, -1, 1, 97), atan: Bt(Math.atan, -1, 1, 97), cos: Bt(Math.cos, 0, Math.PI, 97), cosh: Math.cosh(9 / 7), e: Math.E, largeCos: Math.cos(1e20), largeSin: Math.sin(1e20), largeTan: Math.tan(1e20), log: Math.log(1e3), pi: Math.PI, sin: Bt(Math.sin, -Math.PI, Math.PI, 97), sinh: Bt(Math.sinh, -9 / 7, 7 / 9, 97), sqrt: Math.sqrt(2), tan: Bt(Math.tan, 0, 2 * Math.PI, 97), tanh: Bt(Math.tanh, -9 / 7, 7 / 9, 97) }];
    });
  });
});
class Mm {
  /**
   * Class constructor
   *
   * @param {string} uri
   * @param {string|null} cellSlug
   * @param {object|null} socket
   * @param {ApolloClient|null} client
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
   * @param {ApolloClient|null} client
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
      const u = this.$__uris[a];
      this.$__authTokenObjects[u] = null;
    }
    this.log("info", `KnishIOClient::initialize() - Initializing new Knish.IO client session for SDK version ${s}...`), this.$__client = i || new Ly({
      socket: Ue({
        socketUri: null,
        appKey: "knishio"
      }, n || {}),
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
   * @return {ApolloClient}
   */
  subscribe() {
    if (!this.client().getSocketUri())
      throw new Ve("KnishIOClient::subscribe() - Socket client not initialized!");
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
   * @return {ApolloClient}
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
    return console.info(`KnishIOClient::hashSecret(${t ? `source: ${t}` : ""}) - Computing wallet bundle from secret...`), ar(e);
  }
  /**
   * Retrieves the stored secret for this session
   *
   * @return {string}
   */
  getSecret() {
    if (!this.hasSecret())
      throw new Ri("KnishIOClient::getSecret() - Unable to find a stored secret! Have you set a secret?");
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
      throw new Ri("KnishIOClient::getBundle() - Unable to find a stored bundle! Have you set a secret?");
    return this.$__bundle;
  }
  /**
   * Retrieves the device fingerprint.
   *
   * @returns {Promise<string>} A promise that resolves to the device fingerprint as a string.
   */
  getFingerprint() {
    return hm();
  }
  getFingerprintData() {
    return wc();
  }
  /**
   * Retrieves this session's wallet used for signing the next Molecule
   *
   * @return {Promise<*|Wallet|null>}
   */
  getSourceWallet() {
    return L(this, null, function* () {
      let e = (yield this.queryContinuId({
        bundle: this.getBundle()
      })).payload();
      return e ? e.key = X.generateKey({
        secret: this.getSecret(),
        token: e.token,
        position: e.position
      }) : e = new X({
        secret: this.getSecret()
      }), e;
    });
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
  createMolecule(s) {
    return L(this, arguments, function* ({
      secret: e = null,
      bundle: t = null,
      sourceWallet: n = null,
      remainderWallet: i = null
    }) {
      return this.log("info", "KnishIOClient::createMolecule() - Creating a new molecule..."), e = e || this.getSecret(), t = t || this.getBundle(), !n && this.lastMoleculeQuery && this.getRemainderWallet().token === "USER" && this.lastMoleculeQuery.response() && this.lastMoleculeQuery.response().success() && (n = this.getRemainderWallet()), n === null && (n = yield this.getSourceWallet()), this.remainderWallet = i || X.create({
        secret: e,
        bundle: t,
        token: "USER",
        batchId: n.batchId,
        characters: n.characters
      }), new lt({
        secret: e,
        sourceWallet: n,
        remainderWallet: this.getRemainderWallet(),
        cellSlug: this.cellSlug(),
        version: this.getServerSdkVersion()
      });
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
  createMoleculeMutation(n) {
    return L(this, arguments, function* ({
      mutationClass: e,
      molecule: t = null
    }) {
      this.log("info", `KnishIOClient::createMoleculeQuery() - Creating a new ${e.name} query...`);
      const i = t || (yield this.createMolecule({})), s = new e(this.client(), this, i);
      if (!(s instanceof Ie))
        throw new Ve(`${this.constructor.name}::createMoleculeMutation() - This method only accepts MutationProposeMolecule!`);
      return this.lastMoleculeQuery = s, s;
    });
  }
  /**
   *
   * @param query
   * @param variables
   * @returns {Promise<*>}
   */
  executeQuery(e, t = null) {
    return L(this, null, function* () {
      this.$__authToken && this.$__authToken.isExpired() && (this.log("info", "KnishIOClient::executeQuery() - Access token is expired. Getting new one..."), yield this.requestAuthToken({
        secret: this.$__secret,
        cellSlug: this.$__cellSlug,
        encrypt: this.$__encrypt
      }));
      const n = new AbortController(), i = JSON.stringify({ query: e.$__query, variables: t });
      this.abortControllers.set(i, n);
      try {
        const s = yield e.execute({
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
    });
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
  queryBalance(i) {
    return L(this, arguments, function* ({
      token: e,
      bundle: t = null,
      type: n = "regular"
    }) {
      const s = this.createQuery(qd);
      return this.executeQuery(s, {
        bundleHash: t || this.getBundle(),
        token: e,
        type: n
      });
    });
  }
  /**
   *
   * @param {string} token
   * @param {number} amount
   * @param {string} type
   * @returns {Promise<{address}|{position}|*>}
   */
  querySourceWallet(i) {
    return L(this, arguments, function* ({
      token: e,
      amount: t,
      type: n = "regular"
    }) {
      const s = (yield this.queryBalance({
        token: e,
        type: n
      })).payload();
      if (s === null || rr.cmp(s.balance, t) < 0)
        throw new ct();
      if (!s.position || !s.address)
        throw new ct("Source wallet can not be a shadow wallet.");
      return s;
    });
  }
  /**
   * @param {string|null} bundle
   * @param {function} closure
   * @return {Promise<string>}
   */
  subscribeCreateMolecule(n) {
    return L(this, arguments, function* ({
      bundle: e,
      closure: t
    }) {
      return yield this.createSubscribe(Uy).execute({
        variables: {
          bundle: e || this.getBundle()
        },
        closure: t
      });
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
      throw new Ve(`${this.constructor.name}::subscribeWalletStatus() - Token parameter is required!`);
    return this.createSubscribe(qy).execute({
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
    return this.createSubscribe(jy).execute({
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
    return this.createSubscribe(Qy).execute({
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
    filter: u = null,
    queryArgs: f = null,
    count: c = null,
    countBy: d = null,
    throughAtom: p = !0,
    values: y = null,
    keys: v = null,
    atomValues: w = null
  }) {
    this.log("info", `KnishIOClient::queryMeta() - Querying metaType: ${e}, metaId: ${t}...`);
    let E, b;
    return p ? (E = this.createQuery(Ea), b = Ea.createVariables({
      metaType: e,
      metaId: t,
      key: n,
      value: i,
      latest: s,
      latestMetas: o,
      filter: u,
      queryArgs: f,
      countBy: d,
      values: y,
      keys: v,
      atomValues: w
    })) : (E = this.createQuery(da), b = da.createVariables({
      metaType: e,
      metaId: t,
      key: n,
      value: i,
      latest: s,
      latestMetas: o,
      filter: u,
      queryArgs: f,
      count: c,
      countBy: d
    })), this.executeQuery(E, b).then((k) => k.payload());
  }
  /**
   * Query batch to get cascading meta instances by batchID
   *
   * @param batchId
   * @return {Promise<*>}
   */
  queryBatch(t) {
    return L(this, arguments, function* ({
      batchId: e
    }) {
      this.log("info", `KnishIOClient::queryBatch() - Querying cascading meta instances for batchId: ${e}...`);
      const n = this.createQuery(Yr);
      return yield this.executeQuery(n, {
        batchId: e
      });
    });
  }
  /**
   * Query batch history to get cascading meta instances by batchID
   *
   * @param batchId
   * @return {Promise<*>}
   */
  queryBatchHistory(t) {
    return L(this, arguments, function* ({
      batchId: e
    }) {
      this.log("info", `KnishIOClient::queryBatchHistory() - Querying cascading meta instances for batchId: ${e}...`);
      const n = this.createQuery(Qd);
      return yield this.executeQuery(n, {
        batchId: e
      });
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
  queryAtom(Oe) {
    return L(this, arguments, function* ({
      molecularHashes: e,
      molecularHash: t,
      bundleHashes: n,
      bundleHash: i,
      positions: s,
      position: o,
      walletAddresses: a,
      walletAddress: u,
      isotopes: f,
      isotope: c,
      tokenSlugs: d,
      tokenSlug: p,
      cellSlugs: y,
      cellSlug: v,
      batchIds: w,
      batchId: E,
      values: b,
      value: k,
      metaTypes: S,
      metaType: A,
      metaIds: O,
      metaId: R,
      indexes: D,
      index: F,
      filter: P,
      latest: H,
      queryArgs: J = {
        limit: 15,
        offset: 1
      }
    }) {
      this.log("info", "KnishIOClient::queryAtom() - Querying atom instances");
      const ie = this.createQuery(wa);
      return yield this.executeQuery(ie, wa.createVariables({
        molecularHashes: e,
        molecularHash: t,
        bundleHashes: n,
        bundleHash: i,
        positions: s,
        position: o,
        walletAddresses: a,
        walletAddress: u,
        isotopes: f,
        isotope: c,
        tokenSlugs: d,
        tokenSlug: p,
        cellSlugs: y,
        cellSlug: v,
        batchIds: w,
        batchId: E,
        values: b,
        value: k,
        metaTypes: S,
        metaType: A,
        metaIds: O,
        metaId: R,
        indexes: D,
        index: F,
        filter: P,
        latest: H,
        queryArgs: J
      }));
    });
  }
  /**
   * Builds and executes a molecule to issue a new Wallet on the ledger
   *
   * @param {string} token - The token slug for the new wallet
   * @returns {Promise<ResponseCreateWallet>} - A Promise that resolves with the result of the execution.
   */
  createWallet(t) {
    return L(this, arguments, function* ({
      token: e
    }) {
      const n = new X({
        secret: this.getSecret(),
        token: e
      }), i = yield this.createMoleculeMutation({
        mutationClass: sy
      });
      return i.fillMolecule(n), yield this.executeQuery(i);
    });
  }
  /**
   * Queries the ledger to retrieve a list of active sessions for the given MetaType
   *
   * @param {string} bundleHash - The hash of the session bundle.
   * @param {string} metaType - The type of metadata associated with the session.
   * @param {string} metaId - The ID of the metadata associated with the session.
   * @returns {Promise<ResponseQueryActiveSession>} - Returns a promise containing the result of the query.
   */
  queryActiveSession(i) {
    return L(this, arguments, function* ({
      bundleHash: e,
      metaType: t,
      metaId: n
    }) {
      const s = this.createQuery(zy);
      return yield this.executeQuery(s, {
        bundleHash: e,
        metaType: t,
        metaId: n
      });
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
  queryUserActivity(d) {
    return L(this, arguments, function* ({
      bundleHash: e,
      metaType: t,
      metaId: n,
      ipAddress: i,
      browser: s,
      osCpu: o,
      resolution: a,
      timeZone: u,
      countBy: f,
      interval: c
    }) {
      const p = this.createQuery(Gy);
      return yield this.executeQuery(p, {
        bundleHash: e,
        metaType: t,
        metaId: n,
        ipAddress: i,
        browser: s,
        osCpu: o,
        resolution: a,
        timeZone: u,
        countBy: f,
        interval: c
      });
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
  activeSession(c) {
    return L(this, arguments, function* ({
      bundle: e,
      metaType: t,
      metaId: n,
      ipAddress: i,
      browser: s,
      osCpu: o,
      resolution: a,
      timeZone: u,
      json: f = {}
    }) {
      const d = this.createQuery(Hy);
      return yield this.executeQuery(d, {
        bundleHash: e,
        metaType: t,
        metaId: n,
        ipAddress: i,
        browser: s,
        osCpu: o,
        resolution: a,
        timeZone: u,
        json: JSON.stringify(f)
      });
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
  createToken(o) {
    return L(this, arguments, function* ({
      token: e,
      amount: t = null,
      meta: n = null,
      batchId: i = null,
      units: s = []
    }) {
      const a = de.get(n || {}, "fungibility");
      if (a === "stackable" && (n.batchId = i || Rn({})), ["nonfungible", "stackable"].includes(a) && s.length > 0) {
        if (de.get(n || {}, "decimals") > 0)
          throw new uy();
        if (t > 0)
          throw new mn();
        t = s.length, n.splittable = 1, n.decimals = 0, n.tokenUnits = JSON.stringify(s);
      }
      const u = new X({
        secret: this.getSecret(),
        bundle: this.getBundle(),
        token: e,
        batchId: i
      }), f = yield this.createMoleculeMutation({
        mutationClass: zd
      });
      return f.fillMolecule({
        recipientWallet: u,
        amount: t,
        meta: n || {}
      }), yield this.executeQuery(f);
    });
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
  createRule(s) {
    return L(this, arguments, function* ({
      metaType: e,
      metaId: t,
      rule: n,
      policy: i = {}
    }) {
      const o = yield this.createMoleculeMutation(
        {
          mutationClass: rm,
          molecule: yield this.createMolecule({
            secret: this.getSecret(),
            sourceWallet: yield this.getSourceWallet()
          })
        }
      );
      return o.fillMolecule({
        metaType: e,
        metaId: t,
        rule: n,
        policy: i
      }), yield this.executeQuery(o);
    });
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
  createMeta(s) {
    return L(this, arguments, function* ({
      metaType: e,
      metaId: t,
      meta: n = null,
      policy: i = {}
    }) {
      const o = yield this.createMoleculeMutation(
        {
          mutationClass: ny,
          molecule: yield this.createMolecule({
            secret: this.getSecret(),
            sourceWallet: yield this.getSourceWallet()
          })
        }
      ), a = n || {};
      return o.fillMolecule({
        metaType: e,
        metaId: t,
        meta: a,
        policy: i
      }), yield this.executeQuery(o);
    });
  }
  /**
   * Builds and executes a molecule to create a new identifier on the ledger
   *
   * @param {string} type - The type of the identifier.
   * @param {string} contact - The contact associated with the identifier.
   * @param {string} code - The code for the identifier.
   * @returns {Promise<ResponseCreateIdentifier>} - A promise that resolves to the created identifier.
   */
  createIdentifier(i) {
    return L(this, arguments, function* ({
      type: e,
      contact: t,
      code: n
    }) {
      const s = yield this.createMoleculeMutation({
        mutationClass: Zd
      });
      return s.fillMolecule({
        type: e,
        contact: t,
        code: n
      }), yield this.executeQuery(s);
    });
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
  createPolicy(i) {
    return L(this, arguments, function* ({
      metaType: e,
      metaId: t,
      policy: n = {}
    }) {
      const s = yield this.createMolecule({});
      s.addPolicyAtom({
        metaType: e,
        metaId: t,
        meta: {},
        policy: n
      }), s.addContinuIdAtom(), s.sign({
        bundle: this.getBundle()
      }), s.check();
      const o = yield this.createMoleculeMutation({
        mutationClass: Ie,
        molecule: s
      });
      return yield this.executeQuery(o);
    });
  }
  /**
   * Queries the policy based on the provided metaType and metaId.
   *
   * @param {string} metaType - The type of the meta.
   * @param {string} metaId - The ID of the meta.
   * @returns {Promise<ResponsePolicy>} - A Promise that resolves to the query result.
   */
  queryPolicy(n) {
    return L(this, arguments, function* ({
      metaType: e,
      metaId: t
    }) {
      const i = this.createQuery(Zy);
      return yield this.executeQuery(i, {
        metaType: e,
        metaId: t
      });
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
    const i = this.createQuery(Ld);
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
    const i = this.createQuery(Pd);
    return this.executeQuery(i, { bundleHashes: e }).then((s) => n ? s : s.payload());
  }
  /**
   * Queries the ledger for the next ContinuId wallet
   *
   * @param {String} bundle - The bundle hash used in the query.
   * @returns {Promise<ResponseContinuId>} - A promise that resolves to the result of the query.
   */
  queryContinuId(t) {
    return L(this, arguments, function* ({
      bundle: e
    }) {
      const n = this.createQuery(Bd);
      return this.executeQuery(n, {
        bundle: e
      });
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
  requestTokens(a) {
    return L(this, arguments, function* ({
      token: e,
      to: t,
      amount: n = null,
      units: i = [],
      meta: s = null,
      batchId: o = null
    }) {
      let u, f;
      s = s || {};
      const c = this.createQuery(Jy), d = yield this.executeQuery(c, {
        slug: e
      }), p = de.get(d.data(), "0.fungibility") === "stackable";
      if (!p && o !== null)
        throw new wn("Expected Batch ID = null for non-stackable tokens.");
      if (p && o === null && (o = Rn({})), i.length > 0) {
        if (n > 0)
          throw new mn();
        n = i.length, s.tokenUnits = JSON.stringify(i);
      }
      t ? (Object.prototype.toString.call(t) === "[object String]" && (X.isBundleHash(t) ? (u = "walletBundle", f = t) : t = X.create({
        secret: t,
        token: e
      })), t instanceof X && (u = "wallet", s.position = t.position, s.bundle = t.bundle, f = t.address)) : (u = "walletBundle", f = this.getBundle());
      const y = yield this.createMoleculeMutation({
        mutationClass: Gd
      });
      return y.fillMolecule({
        token: e,
        amount: n,
        metaType: u,
        metaId: f,
        meta: s,
        batchId: o
      }), yield this.executeQuery(y);
    });
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
  claimShadowWallet(i) {
    return L(this, arguments, function* ({
      token: e,
      batchId: t = null,
      molecule: n = null
    }) {
      const s = yield this.createMoleculeMutation({
        mutationClass: ty,
        molecule: n
      });
      return s.fillMolecule({
        token: e,
        batchId: t
      }), yield this.executeQuery(s);
    });
  }
  /**
   * Claims all shadow wallets for a given token.
   *
   * @param {Object} options - The options for claiming shadow wallets.
   * @param {string} options.token - The token to claim shadow wallets for.
   * @returns {Promise<*>} - A promise that resolves to an array of responses from claiming shadow wallets.
   * @throws {WalletShadowException} - If the shadow wallet list is invalid or if a non-shadow wallet is found.
   */
  claimShadowWallets(t) {
    return L(this, arguments, function* ({
      token: e
    }) {
      const n = yield this.queryWallets({ token: e });
      if (!n || !Array.isArray(n))
        throw new ya();
      n.forEach((s) => {
        if (!s.isShadow())
          throw new ya();
      });
      const i = [];
      for (const s of n)
        i.push(yield this.claimShadowWallet({
          token: e,
          batchId: s.batchId
        }));
      return i;
    });
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
  transferToken(a) {
    return L(this, arguments, function* ({
      bundleHash: e,
      token: t,
      amount: n = null,
      units: i = [],
      batchId: s = null,
      sourceWallet: o = null
    }) {
      if (i.length > 0) {
        if (n > 0)
          throw new mn();
        n = i.length;
      }
      if (o === null && (o = yield this.querySourceWallet({
        token: t,
        amount: n
      })), o === null || rr.cmp(o.balance, n) < 0)
        throw new ct();
      const u = X.create({
        bundle: e,
        token: t
      });
      s !== null ? u.batchId = s : u.initBatchId({
        sourceWallet: o
      });
      const f = o.createRemainder(this.getSecret());
      o.splitUnits(
        i,
        f,
        u
      );
      const c = yield this.createMolecule({
        sourceWallet: o,
        remainderWallet: f
      }), d = yield this.createMoleculeMutation({
        mutationClass: Yd,
        molecule: c
      });
      return d.fillMolecule({
        recipientWallet: u,
        amount: n
      }), yield this.executeQuery(d);
    });
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
  depositBufferToken(s) {
    return L(this, arguments, function* ({
      tokenSlug: e,
      amount: t,
      tradeRates: n,
      sourceWallet: i = null
    }) {
      i === null && (i = yield this.querySourceWallet({
        token: e,
        amount: t
      }));
      const o = i.createRemainder(this.getSecret()), a = yield this.createMolecule({
        sourceWallet: i,
        remainderWallet: o
      }), u = yield this.createMoleculeMutation({
        mutationClass: nm,
        molecule: a
      });
      return u.fillMolecule({
        amount: t,
        tradeRates: n
      }), yield this.executeQuery(u);
    });
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
  withdrawBufferToken(s) {
    return L(this, arguments, function* ({
      tokenSlug: e,
      amount: t,
      sourceWallet: n = null,
      signingWallet: i = null
    }) {
      n === null && (n = yield this.querySourceWallet({
        token: e,
        amount: t,
        type: "buffer"
      }));
      const o = n, a = yield this.createMolecule({
        sourceWallet: n,
        remainderWallet: o
      }), u = yield this.createMoleculeMutation({
        mutationClass: im,
        molecule: a
      }), f = {};
      return f[this.getBundle()] = t, u.fillMolecule({
        recipients: f,
        signingWallet: i
      }), yield this.executeQuery(u);
    });
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
  burnTokens(s) {
    return L(this, arguments, function* ({
      token: e,
      amount: t = null,
      units: n = [],
      sourceWallet: i = null
    }) {
      i === null && (i = yield this.querySourceWallet({
        token: e,
        amount: t
      }));
      const o = i.createRemainder(this.getSecret());
      if (n.length > 0) {
        if (t > 0)
          throw new mn();
        t = n.length, i.splitUnits(
          n,
          o
        );
      }
      const a = yield this.createMolecule({
        sourceWallet: i,
        remainderWallet: o
      });
      a.burnToken({ amount: t }), a.sign({
        bundle: this.getBundle()
      }), a.check();
      const u = yield this.createMoleculeMutation({
        mutationClass: Ie,
        molecule: a
      });
      return this.executeQuery(u);
    });
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
  replenishToken(s) {
    return L(this, arguments, function* ({
      token: e,
      amount: t = null,
      units: n = [],
      sourceWallet: i = null
    }) {
      if (i === null && (i = (yield this.queryBalance({ token: e })).payload()), !i)
        throw new ct("Source wallet is missing or invalid.");
      const o = i.createRemainder(this.getSecret()), a = yield this.createMolecule({
        sourceWallet: i,
        remainderWallet: o
      });
      a.replenishToken({
        amount: t,
        units: n
      }), a.sign({
        bundle: this.getBundle()
      }), a.check();
      const u = yield this.createMoleculeMutation({
        mutationClass: Ie,
        molecule: a
      });
      return this.executeQuery(u);
    });
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
  fuseToken(o) {
    return L(this, arguments, function* ({
      bundleHash: e,
      tokenSlug: t,
      newTokenUnit: n,
      fusedTokenUnitIds: i,
      sourceWallet: s = null
    }) {
      if (s === null && (s = (yield this.queryBalance({ token: t })).payload()), s === null)
        throw new ct("Source wallet is missing or invalid.");
      if (!s.tokenUnits || !s.tokenUnits.length)
        throw new ct("Source wallet does not have token units.");
      if (!i.length)
        throw new ct("Fused token unit list is empty.");
      const a = [];
      s.tokenUnits.forEach((p) => {
        a.push(p.id);
      }), i.forEach((p) => {
        if (!a.includes(p))
          throw new ct(`Fused token unit ID = ${p} does not found in the source wallet.`);
      });
      const u = X.create({
        bundle: e,
        token: t
      });
      u.initBatchId({ sourceWallet: s });
      const f = s.createRemainder(this.getSecret());
      s.splitUnits(i, f), n.metas.fusedTokenUnits = s.getTokenUnitsData(), u.tokenUnits = [n];
      const c = yield this.createMolecule({
        sourceWallet: s,
        remainderWallet: f
      });
      c.fuseToken(s.tokenUnits, u), c.sign({
        bundle: this.getBundle()
      }), c.check();
      const d = yield this.createMoleculeMutation({
        mutationClass: Ie,
        molecule: c
      });
      return this.executeQuery(d);
    });
  }
  /**
   * Requests a guest authentication token using the fingerprint of the user.
   * @param {Object} options - The options for the guest authentication token request.
   * @param {string} options.cellSlug - The slug of the cell to request the token for.
   * @param {boolean} options.encrypt - Indicates whether the session should be encrypted.
   * @returns {Promise<ResponseRequestAuthorizationGuest>} - A promise that resolves to the response of the guest authentication token request.
   */
  requestGuestAuthToken(n) {
    return L(this, arguments, function* ({
      cellSlug: e,
      encrypt: t
    }) {
      this.setCellSlug(e);
      const i = new X({
        secret: Ci(yield this.getFingerprint()),
        token: "AUTH"
      }), s = yield this.createQuery(ay), o = {
        cellSlug: e,
        pubkey: i.pubkey,
        encrypt: t
      }, a = yield s.execute({ variables: o });
      if (a.success()) {
        const u = Vr.create(a.payload(), i);
        this.setAuthToken(u);
      } else
        throw new ba(`KnishIOClient::requestGuestAuthToken() - Authorization attempt rejected by ledger. Reason: ${a.reason()}`);
      return a;
    });
  }
  /**
   * Request a profile auth token
   *
   * @param secret
   * @param encrypt
   * @returns {Promise<ResponseRequestAuthorization>}
   */
  requestProfileAuthToken(n) {
    return L(this, arguments, function* ({
      secret: e,
      encrypt: t
    }) {
      this.setSecret(e);
      const i = new X({
        secret: e,
        token: "AUTH"
      }), s = yield this.createMolecule({
        secret: e,
        sourceWallet: i
      }), o = yield this.createMoleculeMutation({
        mutationClass: Hd,
        molecule: s
      });
      o.fillMolecule({ meta: { encrypt: t ? "true" : "false" } });
      const a = yield o.execute({});
      if (a.success()) {
        const u = Vr.create(a.payload(), i);
        this.setAuthToken(u);
      } else
        throw new ba(`KnishIOClient::requestProfileAuthToken() - Authorization attempt rejected by ledger. Reason: ${a.reason()}`);
      return a;
    });
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
  requestAuthToken(s) {
    return L(this, arguments, function* ({
      secret: e = null,
      seed: t = null,
      cellSlug: n = null,
      encrypt: i = !1
    }) {
      if (this.$__serverSdkVersion < 3)
        return this.log("warn", "KnishIOClient::authorize() - Server SDK version does not require an authorization..."), null;
      e === null && t && (e = Ci(t)), this.$__authInProcess = !0;
      let o;
      return e ? o = yield this.requestProfileAuthToken({
        secret: e,
        encrypt: i
      }) : o = yield this.requestGuestAuthToken({
        cellSlug: n,
        encrypt: i
      }), this.log("info", `KnishIOClient::authorize() - Successfully retrieved auth token ${this.$__authToken.getToken()}...`), this.switchEncryption(i), this.$__authInProcess = !1, o;
    });
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
  W as Atom,
  Mm as KnishIOClient,
  Cn as Meta,
  lt as Molecule,
  X as Wallet,
  dl as base64ToHex,
  Cm as bufferToHexString,
  hl as charsetBaseConvert,
  On as chunkSubstr,
  ar as generateBundleHash,
  Ci as generateSecret,
  Rm as hexStringToBuffer,
  pl as hexToBase64,
  yl as isHex,
  os as randomString
};
//# sourceMappingURL=client.es.mjs.map
