const Sa = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ka = "ARRAYBUFFER not supported by this environment", xa = "UINT8ARRAY not supported by this environment";
function $s(n, e, t, r) {
  let i, s, o;
  const a = e || [0], c = (t = t || 0) >>> 3, l = r === -1 ? 3 : 0;
  for (i = 0; i < n.length; i += 1) o = i + c, s = o >>> 2, a.length <= s && a.push(0), a[s] |= n[i] << 8 * (l + r * (o % 4));
  return { value: a, binLen: 8 * n.length + t };
}
function mn(n, e, t) {
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
        return function(o, a, c, l) {
          let u, p, d, y;
          if (o.length % 2 != 0) throw new Error("String of HEX type must be in byte increments");
          const v = a || [0], E = (c = c || 0) >>> 3, w = l === -1 ? 3 : 0;
          for (u = 0; u < o.length; u += 2) {
            if (p = parseInt(o.substr(u, 2), 16), isNaN(p)) throw new Error("String of HEX type contains invalid characters");
            for (y = (u >>> 1) + E, d = y >>> 2; v.length <= d; ) v.push(0);
            v[d] |= p << 8 * (w + l * (y % 4));
          }
          return { value: v, binLen: 4 * o.length + c };
        }(r, i, s, t);
      };
    case "TEXT":
      return function(r, i, s) {
        return function(o, a, c, l, u) {
          let p, d, y, v, E, w, b, k, S = 0;
          const I = c || [0], O = (l = l || 0) >>> 3;
          if (a === "UTF8") for (b = u === -1 ? 3 : 0, y = 0; y < o.length; y += 1) for (p = o.charCodeAt(y), d = [], 128 > p ? d.push(p) : 2048 > p ? (d.push(192 | p >>> 6), d.push(128 | 63 & p)) : 55296 > p || 57344 <= p ? d.push(224 | p >>> 12, 128 | p >>> 6 & 63, 128 | 63 & p) : (y += 1, p = 65536 + ((1023 & p) << 10 | 1023 & o.charCodeAt(y)), d.push(240 | p >>> 18, 128 | p >>> 12 & 63, 128 | p >>> 6 & 63, 128 | 63 & p)), v = 0; v < d.length; v += 1) {
            for (w = S + O, E = w >>> 2; I.length <= E; ) I.push(0);
            I[E] |= d[v] << 8 * (b + u * (w % 4)), S += 1;
          }
          else for (b = u === -1 ? 2 : 0, k = a === "UTF16LE" && u !== 1 || a !== "UTF16LE" && u === 1, y = 0; y < o.length; y += 1) {
            for (p = o.charCodeAt(y), k === !0 && (v = 255 & p, p = v << 8 | p >>> 8), w = S + O, E = w >>> 2; I.length <= E; ) I.push(0);
            I[E] |= p << 8 * (b + u * (w % 4)), S += 2;
          }
          return { value: I, binLen: 8 * S + l };
        }(r, e, i, s, t);
      };
    case "B64":
      return function(r, i, s) {
        return function(o, a, c, l) {
          let u, p, d, y, v, E, w, b = 0;
          const k = a || [0], S = (c = c || 0) >>> 3, I = l === -1 ? 3 : 0, O = o.indexOf("=");
          if (o.search(/^[a-zA-Z0-9=+/]+$/) === -1) throw new Error("Invalid character in base-64 string");
          if (o = o.replace(/=/g, ""), O !== -1 && O < o.length) throw new Error("Invalid '=' found in base-64 string");
          for (p = 0; p < o.length; p += 4) {
            for (v = o.substr(p, 4), y = 0, d = 0; d < v.length; d += 1) u = Sa.indexOf(v.charAt(d)), y |= u << 18 - 6 * d;
            for (d = 0; d < v.length - 1; d += 1) {
              for (w = b + S, E = w >>> 2; k.length <= E; ) k.push(0);
              k[E] |= (y >>> 16 - 8 * d & 255) << 8 * (I + l * (w % 4)), b += 1;
            }
          }
          return { value: k, binLen: 8 * b + c };
        }(r, i, s, t);
      };
    case "BYTES":
      return function(r, i, s) {
        return function(o, a, c, l) {
          let u, p, d, y;
          const v = a || [0], E = (c = c || 0) >>> 3, w = l === -1 ? 3 : 0;
          for (p = 0; p < o.length; p += 1) u = o.charCodeAt(p), y = p + E, d = y >>> 2, v.length <= d && v.push(0), v[d] |= u << 8 * (w + l * (y % 4));
          return { value: v, binLen: 8 * o.length + c };
        }(r, i, s, t);
      };
    case "ARRAYBUFFER":
      try {
        new ArrayBuffer(0);
      } catch {
        throw new Error(ka);
      }
      return function(r, i, s) {
        return function(o, a, c, l) {
          return $s(new Uint8Array(o), a, c, l);
        }(r, i, s, t);
      };
    case "UINT8ARRAY":
      try {
        new Uint8Array(0);
      } catch {
        throw new Error(xa);
      }
      return function(r, i, s) {
        return $s(r, i, s, t);
      };
    default:
      throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
  }
}
function Ls(n, e, t, r) {
  switch (n) {
    case "HEX":
      return function(i) {
        return function(s, o, a, c) {
          const l = "0123456789abcdef";
          let u, p, d = "";
          const y = o / 8, v = a === -1 ? 3 : 0;
          for (u = 0; u < y; u += 1) p = s[u >>> 2] >>> 8 * (v + a * (u % 4)), d += l.charAt(p >>> 4 & 15) + l.charAt(15 & p);
          return c.outputUpper ? d.toUpperCase() : d;
        }(i, e, t, r);
      };
    case "B64":
      return function(i) {
        return function(s, o, a, c) {
          let l, u, p, d, y, v = "";
          const E = o / 8, w = a === -1 ? 3 : 0;
          for (l = 0; l < E; l += 3) for (d = l + 1 < E ? s[l + 1 >>> 2] : 0, y = l + 2 < E ? s[l + 2 >>> 2] : 0, p = (s[l >>> 2] >>> 8 * (w + a * (l % 4)) & 255) << 16 | (d >>> 8 * (w + a * ((l + 1) % 4)) & 255) << 8 | y >>> 8 * (w + a * ((l + 2) % 4)) & 255, u = 0; u < 4; u += 1) v += 8 * l + 6 * u <= o ? Sa.charAt(p >>> 6 * (3 - u) & 63) : c.b64Pad;
          return v;
        }(i, e, t, r);
      };
    case "BYTES":
      return function(i) {
        return function(s, o, a) {
          let c, l, u = "";
          const p = o / 8, d = a === -1 ? 3 : 0;
          for (c = 0; c < p; c += 1) l = s[c >>> 2] >>> 8 * (d + a * (c % 4)) & 255, u += String.fromCharCode(l);
          return u;
        }(i, e, t);
      };
    case "ARRAYBUFFER":
      try {
        new ArrayBuffer(0);
      } catch {
        throw new Error(ka);
      }
      return function(i) {
        return function(s, o, a) {
          let c;
          const l = o / 8, u = new ArrayBuffer(l), p = new Uint8Array(u), d = a === -1 ? 3 : 0;
          for (c = 0; c < l; c += 1) p[c] = s[c >>> 2] >>> 8 * (d + a * (c % 4)) & 255;
          return u;
        }(i, e, t);
      };
    case "UINT8ARRAY":
      try {
        new Uint8Array(0);
      } catch {
        throw new Error(xa);
      }
      return function(i) {
        return function(s, o, a) {
          let c;
          const l = o / 8, u = a === -1 ? 3 : 0, p = new Uint8Array(l);
          for (c = 0; c < l; c += 1) p[c] = s[c >>> 2] >>> 8 * (u + a * (c % 4)) & 255;
          return p;
        }(i, e, t);
      };
    default:
      throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
  }
}
const ir = 4294967296, B = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], ut = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], ct = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], sr = "Chosen SHA variant is not supported", Ta = "Cannot set numRounds with MAC";
function Cr(n, e) {
  let t, r;
  const i = n.binLen >>> 3, s = e.binLen >>> 3, o = i << 3, a = 4 - i << 3;
  if (i % 4 != 0) {
    for (t = 0; t < s; t += 4) r = i + t >>> 2, n.value[r] |= e.value[t >>> 2] << o, n.value.push(0), n.value[r + 1] |= e.value[t >>> 2] >>> a;
    return (n.value.length << 2) - 4 >= s + i && n.value.pop(), { value: n.value, binLen: n.binLen + e.binLen };
  }
  return { value: n.value.concat(e.value), binLen: n.binLen + e.binLen };
}
function Us(n) {
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
function Tt(n, e, t, r) {
  const i = n + " must include a value and format";
  if (!e) {
    if (!r) throw new Error(i);
    return r;
  }
  if (e.value === void 0 || !e.format) throw new Error(i);
  return mn(e.format, e.encoding || "UTF8", t)(e.value);
}
let Ur = class {
  constructor(e, t, r) {
    const i = r || {};
    if (this.t = t, this.i = i.encoding || "UTF8", this.numRounds = i.numRounds || 1, isNaN(this.numRounds) || this.numRounds !== parseInt(this.numRounds, 10) || 1 > this.numRounds) throw new Error("numRounds must a integer >= 1");
    this.o = e, this.h = [], this.u = 0, this.l = !1, this.A = 0, this.H = !1, this.S = [], this.p = [];
  }
  update(e) {
    let t, r = 0;
    const i = this.m >>> 5, s = this.C(e, this.h, this.u), o = s.binLen, a = s.value, c = o >>> 5;
    for (t = 0; t < c; t += i) r + this.m <= o && (this.U = this.v(a.slice(t, t + i), this.U), r += this.m);
    return this.A += r, this.h = a.slice(r >>> 5), this.u = o % this.m, this.l = !0, this;
  }
  getHash(e, t) {
    let r, i, s = this.R;
    const o = Us(t);
    if (this.K) {
      if (o.outputLen === -1) throw new Error("Output length must be specified in options");
      s = o.outputLen;
    }
    const a = Ls(e, s, this.T, o);
    if (this.H && this.g) return a(this.g(o));
    for (i = this.F(this.h.slice(), this.u, this.A, this.L(this.U), s), r = 1; r < this.numRounds; r += 1) this.K && s % 32 != 0 && (i[i.length - 1] &= 16777215 >>> 24 - s % 32), i = this.F(i, s, 0, this.B(this.o), s);
    return a(i);
  }
  setHMACKey(e, t, r) {
    if (!this.M) throw new Error("Variant does not support HMAC");
    if (this.l) throw new Error("Cannot set MAC key after calling update");
    const i = mn(t, (r || {}).encoding || "UTF8", this.T);
    this.k(i(e));
  }
  k(e) {
    const t = this.m >>> 3, r = t / 4 - 1;
    let i;
    if (this.numRounds !== 1) throw new Error(Ta);
    if (this.H) throw new Error("MAC key already set");
    for (t < e.binLen / 8 && (e.value = this.F(e.value, e.binLen, 0, this.B(this.o), this.R)); e.value.length <= r; ) e.value.push(0);
    for (i = 0; i <= r; i += 1) this.S[i] = 909522486 ^ e.value[i], this.p[i] = 1549556828 ^ e.value[i];
    this.U = this.v(this.S, this.U), this.A = this.m, this.H = !0;
  }
  getHMAC(e, t) {
    const r = Us(t);
    return Ls(e, this.R, this.T, r)(this.Y());
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
function Ia(n, e) {
  return n >>> e;
}
function qs(n, e, t) {
  return n ^ e ^ t;
}
function Aa(n, e, t) {
  return n & e ^ ~n & t;
}
function Oa(n, e, t) {
  return n & e ^ n & t ^ e & t;
}
function Cc(n) {
  return tt(n, 2) ^ tt(n, 13) ^ tt(n, 22);
}
function Oe(n, e) {
  const t = (65535 & n) + (65535 & e);
  return (65535 & (n >>> 16) + (e >>> 16) + (t >>> 16)) << 16 | 65535 & t;
}
function Rc(n, e, t, r) {
  const i = (65535 & n) + (65535 & e) + (65535 & t) + (65535 & r);
  return (65535 & (n >>> 16) + (e >>> 16) + (t >>> 16) + (r >>> 16) + (i >>> 16)) << 16 | 65535 & i;
}
function Pn(n, e, t, r, i) {
  const s = (65535 & n) + (65535 & e) + (65535 & t) + (65535 & r) + (65535 & i);
  return (65535 & (n >>> 16) + (e >>> 16) + (t >>> 16) + (r >>> 16) + (i >>> 16) + (s >>> 16)) << 16 | 65535 & s;
}
function Nc(n) {
  return tt(n, 7) ^ tt(n, 18) ^ Ia(n, 3);
}
function Mc(n) {
  return tt(n, 6) ^ tt(n, 11) ^ tt(n, 25);
}
function Dc(n) {
  return [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
}
function Ca(n, e) {
  let t, r, i, s, o, a, c;
  const l = [];
  for (t = e[0], r = e[1], i = e[2], s = e[3], o = e[4], c = 0; c < 80; c += 1) l[c] = c < 16 ? n[c] : Gt(l[c - 3] ^ l[c - 8] ^ l[c - 14] ^ l[c - 16], 1), a = c < 20 ? Pn(Gt(t, 5), Aa(r, i, s), o, 1518500249, l[c]) : c < 40 ? Pn(Gt(t, 5), qs(r, i, s), o, 1859775393, l[c]) : c < 60 ? Pn(Gt(t, 5), Oa(r, i, s), o, 2400959708, l[c]) : Pn(Gt(t, 5), qs(r, i, s), o, 3395469782, l[c]), o = s, s = i, i = Gt(r, 30), r = t, t = a;
  return e[0] = Oe(t, e[0]), e[1] = Oe(r, e[1]), e[2] = Oe(i, e[2]), e[3] = Oe(s, e[3]), e[4] = Oe(o, e[4]), e;
}
function Fc(n, e, t, r) {
  let i;
  const s = 15 + (e + 65 >>> 9 << 4), o = e + t;
  for (; n.length <= s; ) n.push(0);
  for (n[e >>> 5] |= 128 << 24 - e % 32, n[s] = 4294967295 & o, n[s - 1] = o / ir | 0, i = 0; i < n.length; i += 16) r = Ca(n.slice(i, i + 16), r);
  return r;
}
let Bc = class extends Ur {
  constructor(e, t, r) {
    if (e !== "SHA-1") throw new Error(sr);
    super(e, t, r);
    const i = r || {};
    this.M = !0, this.g = this.Y, this.T = -1, this.C = mn(this.t, this.i, this.T), this.v = Ca, this.L = function(s) {
      return s.slice();
    }, this.B = Dc, this.F = Fc, this.U = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.m = 512, this.R = 160, this.K = !1, i.hmacKey && this.k(Tt("hmacKey", i.hmacKey, this.T));
  }
};
function js(n) {
  let e;
  return e = n == "SHA-224" ? ut.slice() : ct.slice(), e;
}
function Vs(n, e) {
  let t, r, i, s, o, a, c, l, u, p, d;
  const y = [];
  for (t = e[0], r = e[1], i = e[2], s = e[3], o = e[4], a = e[5], c = e[6], l = e[7], d = 0; d < 64; d += 1) y[d] = d < 16 ? n[d] : Rc(tt(v = y[d - 2], 17) ^ tt(v, 19) ^ Ia(v, 10), y[d - 7], Nc(y[d - 15]), y[d - 16]), u = Pn(l, Mc(o), Aa(o, a, c), B[d], y[d]), p = Oe(Cc(t), Oa(t, r, i)), l = c, c = a, a = o, o = Oe(s, u), s = i, i = r, r = t, t = Oe(u, p);
  var v;
  return e[0] = Oe(t, e[0]), e[1] = Oe(r, e[1]), e[2] = Oe(i, e[2]), e[3] = Oe(s, e[3]), e[4] = Oe(o, e[4]), e[5] = Oe(a, e[5]), e[6] = Oe(c, e[6]), e[7] = Oe(l, e[7]), e;
}
let Pc = class extends Ur {
  constructor(e, t, r) {
    if (e !== "SHA-224" && e !== "SHA-256") throw new Error(sr);
    super(e, t, r);
    const i = r || {};
    this.g = this.Y, this.M = !0, this.T = -1, this.C = mn(this.t, this.i, this.T), this.v = Vs, this.L = function(s) {
      return s.slice();
    }, this.B = js, this.F = function(s, o, a, c) {
      return function(l, u, p, d, y) {
        let v, E;
        const w = 15 + (u + 65 >>> 9 << 4), b = u + p;
        for (; l.length <= w; ) l.push(0);
        for (l[u >>> 5] |= 128 << 24 - u % 32, l[w] = 4294967295 & b, l[w - 1] = b / ir | 0, v = 0; v < l.length; v += 16) d = Vs(l.slice(v, v + 16), d);
        return E = y === "SHA-224" ? [d[0], d[1], d[2], d[3], d[4], d[5], d[6]] : d, E;
      }(s, o, a, c, e);
    }, this.U = js(e), this.m = 512, this.R = e === "SHA-224" ? 224 : 256, this.K = !1, i.hmacKey && this.k(Tt("hmacKey", i.hmacKey, this.T));
  }
};
class T {
  constructor(e, t) {
    this.N = e, this.I = t;
  }
}
function Qs(n, e) {
  let t;
  return e > 32 ? (t = 64 - e, new T(n.I << e | n.N >>> t, n.N << e | n.I >>> t)) : e !== 0 ? (t = 32 - e, new T(n.N << e | n.I >>> t, n.I << e | n.N >>> t)) : n;
}
function nt(n, e) {
  let t;
  return e < 32 ? (t = 32 - e, new T(n.N >>> e | n.I << t, n.I >>> e | n.N << t)) : (t = 64 - e, new T(n.I >>> e | n.N << t, n.N >>> e | n.I << t));
}
function Ra(n, e) {
  return new T(n.N >>> e, n.I >>> e | n.N << 32 - e);
}
function $c(n, e, t) {
  return new T(n.N & e.N ^ n.N & t.N ^ e.N & t.N, n.I & e.I ^ n.I & t.I ^ e.I & t.I);
}
function Lc(n) {
  const e = nt(n, 28), t = nt(n, 34), r = nt(n, 39);
  return new T(e.N ^ t.N ^ r.N, e.I ^ t.I ^ r.I);
}
function Ke(n, e) {
  let t, r;
  t = (65535 & n.I) + (65535 & e.I), r = (n.I >>> 16) + (e.I >>> 16) + (t >>> 16);
  const i = (65535 & r) << 16 | 65535 & t;
  return t = (65535 & n.N) + (65535 & e.N) + (r >>> 16), r = (n.N >>> 16) + (e.N >>> 16) + (t >>> 16), new T((65535 & r) << 16 | 65535 & t, i);
}
function Uc(n, e, t, r) {
  let i, s;
  i = (65535 & n.I) + (65535 & e.I) + (65535 & t.I) + (65535 & r.I), s = (n.I >>> 16) + (e.I >>> 16) + (t.I >>> 16) + (r.I >>> 16) + (i >>> 16);
  const o = (65535 & s) << 16 | 65535 & i;
  return i = (65535 & n.N) + (65535 & e.N) + (65535 & t.N) + (65535 & r.N) + (s >>> 16), s = (n.N >>> 16) + (e.N >>> 16) + (t.N >>> 16) + (r.N >>> 16) + (i >>> 16), new T((65535 & s) << 16 | 65535 & i, o);
}
function qc(n, e, t, r, i) {
  let s, o;
  s = (65535 & n.I) + (65535 & e.I) + (65535 & t.I) + (65535 & r.I) + (65535 & i.I), o = (n.I >>> 16) + (e.I >>> 16) + (t.I >>> 16) + (r.I >>> 16) + (i.I >>> 16) + (s >>> 16);
  const a = (65535 & o) << 16 | 65535 & s;
  return s = (65535 & n.N) + (65535 & e.N) + (65535 & t.N) + (65535 & r.N) + (65535 & i.N) + (o >>> 16), o = (n.N >>> 16) + (e.N >>> 16) + (t.N >>> 16) + (r.N >>> 16) + (i.N >>> 16) + (s >>> 16), new T((65535 & o) << 16 | 65535 & s, a);
}
function Sn(n, e) {
  return new T(n.N ^ e.N, n.I ^ e.I);
}
function jc(n) {
  const e = nt(n, 19), t = nt(n, 61), r = Ra(n, 6);
  return new T(e.N ^ t.N ^ r.N, e.I ^ t.I ^ r.I);
}
function Vc(n) {
  const e = nt(n, 1), t = nt(n, 8), r = Ra(n, 7);
  return new T(e.N ^ t.N ^ r.N, e.I ^ t.I ^ r.I);
}
function Qc(n) {
  const e = nt(n, 14), t = nt(n, 18), r = nt(n, 41);
  return new T(e.N ^ t.N ^ r.N, e.I ^ t.I ^ r.I);
}
const Hc = [new T(B[0], 3609767458), new T(B[1], 602891725), new T(B[2], 3964484399), new T(B[3], 2173295548), new T(B[4], 4081628472), new T(B[5], 3053834265), new T(B[6], 2937671579), new T(B[7], 3664609560), new T(B[8], 2734883394), new T(B[9], 1164996542), new T(B[10], 1323610764), new T(B[11], 3590304994), new T(B[12], 4068182383), new T(B[13], 991336113), new T(B[14], 633803317), new T(B[15], 3479774868), new T(B[16], 2666613458), new T(B[17], 944711139), new T(B[18], 2341262773), new T(B[19], 2007800933), new T(B[20], 1495990901), new T(B[21], 1856431235), new T(B[22], 3175218132), new T(B[23], 2198950837), new T(B[24], 3999719339), new T(B[25], 766784016), new T(B[26], 2566594879), new T(B[27], 3203337956), new T(B[28], 1034457026), new T(B[29], 2466948901), new T(B[30], 3758326383), new T(B[31], 168717936), new T(B[32], 1188179964), new T(B[33], 1546045734), new T(B[34], 1522805485), new T(B[35], 2643833823), new T(B[36], 2343527390), new T(B[37], 1014477480), new T(B[38], 1206759142), new T(B[39], 344077627), new T(B[40], 1290863460), new T(B[41], 3158454273), new T(B[42], 3505952657), new T(B[43], 106217008), new T(B[44], 3606008344), new T(B[45], 1432725776), new T(B[46], 1467031594), new T(B[47], 851169720), new T(B[48], 3100823752), new T(B[49], 1363258195), new T(B[50], 3750685593), new T(B[51], 3785050280), new T(B[52], 3318307427), new T(B[53], 3812723403), new T(B[54], 2003034995), new T(B[55], 3602036899), new T(B[56], 1575990012), new T(B[57], 1125592928), new T(B[58], 2716904306), new T(B[59], 442776044), new T(B[60], 593698344), new T(B[61], 3733110249), new T(B[62], 2999351573), new T(B[63], 3815920427), new T(3391569614, 3928383900), new T(3515267271, 566280711), new T(3940187606, 3454069534), new T(4118630271, 4000239992), new T(116418474, 1914138554), new T(174292421, 2731055270), new T(289380356, 3203993006), new T(460393269, 320620315), new T(685471733, 587496836), new T(852142971, 1086792851), new T(1017036298, 365543100), new T(1126000580, 2618297676), new T(1288033470, 3409855158), new T(1501505948, 4234509866), new T(1607167915, 987167468), new T(1816402316, 1246189591)];
function Hs(n) {
  return n === "SHA-384" ? [new T(3418070365, ut[0]), new T(1654270250, ut[1]), new T(2438529370, ut[2]), new T(355462360, ut[3]), new T(1731405415, ut[4]), new T(41048885895, ut[5]), new T(3675008525, ut[6]), new T(1203062813, ut[7])] : [new T(ct[0], 4089235720), new T(ct[1], 2227873595), new T(ct[2], 4271175723), new T(ct[3], 1595750129), new T(ct[4], 2917565137), new T(ct[5], 725511199), new T(ct[6], 4215389547), new T(ct[7], 327033209)];
}
function Ws(n, e) {
  let t, r, i, s, o, a, c, l, u, p, d, y;
  const v = [];
  for (t = e[0], r = e[1], i = e[2], s = e[3], o = e[4], a = e[5], c = e[6], l = e[7], d = 0; d < 80; d += 1) d < 16 ? (y = 2 * d, v[d] = new T(n[y], n[y + 1])) : v[d] = Uc(jc(v[d - 2]), v[d - 7], Vc(v[d - 15]), v[d - 16]), u = qc(l, Qc(o), (w = a, b = c, new T((E = o).N & w.N ^ ~E.N & b.N, E.I & w.I ^ ~E.I & b.I)), Hc[d], v[d]), p = Ke(Lc(t), $c(t, r, i)), l = c, c = a, a = o, o = Ke(s, u), s = i, i = r, r = t, t = Ke(u, p);
  var E, w, b;
  return e[0] = Ke(t, e[0]), e[1] = Ke(r, e[1]), e[2] = Ke(i, e[2]), e[3] = Ke(s, e[3]), e[4] = Ke(o, e[4]), e[5] = Ke(a, e[5]), e[6] = Ke(c, e[6]), e[7] = Ke(l, e[7]), e;
}
let Wc = class extends Ur {
  constructor(e, t, r) {
    if (e !== "SHA-384" && e !== "SHA-512") throw new Error(sr);
    super(e, t, r);
    const i = r || {};
    this.g = this.Y, this.M = !0, this.T = -1, this.C = mn(this.t, this.i, this.T), this.v = Ws, this.L = function(s) {
      return s.slice();
    }, this.B = Hs, this.F = function(s, o, a, c) {
      return function(l, u, p, d, y) {
        let v, E;
        const w = 31 + (u + 129 >>> 10 << 5), b = u + p;
        for (; l.length <= w; ) l.push(0);
        for (l[u >>> 5] |= 128 << 24 - u % 32, l[w] = 4294967295 & b, l[w - 1] = b / ir | 0, v = 0; v < l.length; v += 32) d = Ws(l.slice(v, v + 32), d);
        return E = y === "SHA-384" ? [d[0].N, d[0].I, d[1].N, d[1].I, d[2].N, d[2].I, d[3].N, d[3].I, d[4].N, d[4].I, d[5].N, d[5].I] : [d[0].N, d[0].I, d[1].N, d[1].I, d[2].N, d[2].I, d[3].N, d[3].I, d[4].N, d[4].I, d[5].N, d[5].I, d[6].N, d[6].I, d[7].N, d[7].I], E;
      }(s, o, a, c, e);
    }, this.U = Hs(e), this.m = 1024, this.R = e === "SHA-384" ? 384 : 512, this.K = !1, i.hmacKey && this.k(Tt("hmacKey", i.hmacKey, this.T));
  }
};
const zc = [new T(0, 1), new T(0, 32898), new T(2147483648, 32906), new T(2147483648, 2147516416), new T(0, 32907), new T(0, 2147483649), new T(2147483648, 2147516545), new T(2147483648, 32777), new T(0, 138), new T(0, 136), new T(0, 2147516425), new T(0, 2147483658), new T(0, 2147516555), new T(2147483648, 139), new T(2147483648, 32905), new T(2147483648, 32771), new T(2147483648, 32770), new T(2147483648, 128), new T(0, 32778), new T(2147483648, 2147483658), new T(2147483648, 2147516545), new T(2147483648, 32896), new T(0, 2147483649), new T(2147483648, 2147516424)], Kc = [[0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61], [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]];
function Ri(n) {
  let e;
  const t = [];
  for (e = 0; e < 5; e += 1) t[e] = [new T(0, 0), new T(0, 0), new T(0, 0), new T(0, 0), new T(0, 0)];
  return t;
}
function Gc(n) {
  let e;
  const t = [];
  for (e = 0; e < 5; e += 1) t[e] = n[e].slice();
  return t;
}
function lr(n, e) {
  let t, r, i, s;
  const o = [], a = [];
  if (n !== null) for (r = 0; r < n.length; r += 2) e[(r >>> 1) % 5][(r >>> 1) / 5 | 0] = Sn(e[(r >>> 1) % 5][(r >>> 1) / 5 | 0], new T(n[r + 1], n[r]));
  for (t = 0; t < 24; t += 1) {
    for (s = Ri(), r = 0; r < 5; r += 1) o[r] = (c = e[r][0], l = e[r][1], u = e[r][2], p = e[r][3], d = e[r][4], new T(c.N ^ l.N ^ u.N ^ p.N ^ d.N, c.I ^ l.I ^ u.I ^ p.I ^ d.I));
    for (r = 0; r < 5; r += 1) a[r] = Sn(o[(r + 4) % 5], Qs(o[(r + 1) % 5], 1));
    for (r = 0; r < 5; r += 1) for (i = 0; i < 5; i += 1) e[r][i] = Sn(e[r][i], a[r]);
    for (r = 0; r < 5; r += 1) for (i = 0; i < 5; i += 1) s[i][(2 * r + 3 * i) % 5] = Qs(e[r][i], Kc[r][i]);
    for (r = 0; r < 5; r += 1) for (i = 0; i < 5; i += 1) e[r][i] = Sn(s[r][i], new T(~s[(r + 1) % 5][i].N & s[(r + 2) % 5][i].N, ~s[(r + 1) % 5][i].I & s[(r + 2) % 5][i].I));
    e[0][0] = Sn(e[0][0], zc[t]);
  }
  var c, l, u, p, d;
  return e;
}
function Na(n) {
  let e, t, r = 0;
  const i = [0, 0], s = [4294967295 & n, n / ir & 2097151];
  for (e = 6; e >= 0; e--) t = s[e >> 2] >>> 8 * e & 255, t === 0 && r === 0 || (i[r + 1 >> 2] |= t << 8 * (r + 1), r += 1);
  return r = r !== 0 ? r : 1, i[0] |= r, { value: r + 1 > 4 ? i : [i[0]], binLen: 8 + 8 * r };
}
function ai(n) {
  return Cr(Na(n.binLen), n);
}
function zs(n, e) {
  let t, r = Na(e);
  r = Cr(r, n);
  const i = e >>> 2, s = (i - r.value.length % i) % i;
  for (t = 0; t < s; t++) r.value.push(0);
  return r.value;
}
let Jc = class extends Ur {
  constructor(n, e, t) {
    let r = 6, i = 0;
    super(n, e, t);
    const s = t || {};
    if (this.numRounds !== 1) {
      if (s.kmacKey || s.hmacKey) throw new Error(Ta);
      if (this.o === "CSHAKE128" || this.o === "CSHAKE256") throw new Error("Cannot set numRounds for CSHAKE variants");
    }
    switch (this.T = 1, this.C = mn(this.t, this.i, this.T), this.v = lr, this.L = Gc, this.B = Ri, this.U = Ri(), this.K = !1, n) {
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
        throw new Error(sr);
    }
    this.F = function(o, a, c, l, u) {
      return function(p, d, y, v, E, w, b) {
        let k, S, I = 0;
        const O = [], C = E >>> 5, M = d >>> 5;
        for (k = 0; k < M && d >= E; k += C) v = lr(p.slice(k, k + C), v), d -= E;
        for (p = p.slice(k), d %= E; p.length < C; ) p.push(0);
        for (k = d >>> 3, p[k >> 2] ^= w << k % 4 * 8, p[C - 1] ^= 2147483648, v = lr(p, v); 32 * O.length < b && (S = v[I % 5][I / 5 | 0], O.push(S.I), !(32 * O.length >= b)); ) O.push(S.N), I += 1, 64 * I % E == 0 && (lr(null, v), I = 0);
        return O;
      }(o, a, 0, l, i, r, u);
    }, s.hmacKey && this.k(Tt("hmacKey", s.hmacKey, this.T));
  }
  O(n, e) {
    const t = function(i) {
      const s = i;
      return { funcName: Tt("funcName", s.funcName, 1, { value: [], binLen: 0 }), customization: Tt("Customization", s.customization, 1, { value: [], binLen: 0 }) };
    }(n || {});
    e && (t.funcName = e);
    const r = Cr(ai(t.funcName), ai(t.customization));
    if (t.customization.binLen !== 0 || t.funcName.binLen !== 0) {
      const i = zs(r, this.m >>> 3);
      for (let s = 0; s < i.length; s += this.m >>> 5) this.U = this.v(i.slice(s, s + (this.m >>> 5)), this.U), this.A += this.m;
      return 4;
    }
    return 31;
  }
  X(n) {
    const e = function(r) {
      const i = r;
      return { kmacKey: Tt("kmacKey", i.kmacKey, 1), funcName: { value: [1128353099], binLen: 32 }, customization: Tt("Customization", i.customization, 1, { value: [], binLen: 0 }) };
    }(n || {});
    this.O(n, e.funcName);
    const t = zs(ai(e.kmacKey), this.m >>> 3);
    for (let r = 0; r < t.length; r += this.m >>> 5) this.U = this.v(t.slice(r, r + (this.m >>> 5)), this.U), this.A += this.m;
    this.H = !0;
  }
  _(n) {
    const e = Cr({ value: this.h.slice(), binLen: this.u }, function(t) {
      let r, i, s = 0;
      const o = [0, 0], a = [4294967295 & t, t / ir & 2097151];
      for (r = 6; r >= 0; r--) i = a[r >> 2] >>> 8 * r & 255, i === 0 && s === 0 || (o[s >> 2] |= i << 8 * s, s += 1);
      return s = s !== 0 ? s : 1, o[s >> 2] |= s << 8 * s, { value: s + 1 > 4 ? o : [o[0]], binLen: 8 + 8 * s };
    }(n.outputLen));
    return this.F(e.value, e.binLen, this.A, this.L(this.U), n.outputLen);
  }
};
class Ve {
  constructor(e, t, r) {
    if (e == "SHA-1") this.P = new Bc(e, t, r);
    else if (e == "SHA-224" || e == "SHA-256") this.P = new Pc(e, t, r);
    else if (e == "SHA-384" || e == "SHA-512") this.P = new Wc(e, t, r);
    else {
      if (e != "SHA3-224" && e != "SHA3-256" && e != "SHA3-384" && e != "SHA3-512" && e != "SHAKE128" && e != "SHAKE256" && e != "CSHAKE128" && e != "CSHAKE256" && e != "KMAC128" && e != "KMAC256") throw new Error(sr);
      this.P = new Jc(e, t, r);
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
var Ma = {}, qr = {};
qr.byteLength = Zc;
qr.toByteArray = tl;
qr.fromByteArray = il;
var et = [], je = [], Yc = typeof Uint8Array < "u" ? Uint8Array : Array, ui = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Jt = 0, Xc = ui.length; Jt < Xc; ++Jt)
  et[Jt] = ui[Jt], je[ui.charCodeAt(Jt)] = Jt;
je[45] = 62;
je[95] = 63;
function Da(n) {
  var e = n.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var t = n.indexOf("=");
  t === -1 && (t = e);
  var r = t === e ? 0 : 4 - t % 4;
  return [t, r];
}
function Zc(n) {
  var e = Da(n), t = e[0], r = e[1];
  return (t + r) * 3 / 4 - r;
}
function el(n, e, t) {
  return (e + t) * 3 / 4 - t;
}
function tl(n) {
  var e, t = Da(n), r = t[0], i = t[1], s = new Yc(el(n, r, i)), o = 0, a = i > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = je[n.charCodeAt(c)] << 18 | je[n.charCodeAt(c + 1)] << 12 | je[n.charCodeAt(c + 2)] << 6 | je[n.charCodeAt(c + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
  return i === 2 && (e = je[n.charCodeAt(c)] << 2 | je[n.charCodeAt(c + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = je[n.charCodeAt(c)] << 10 | je[n.charCodeAt(c + 1)] << 4 | je[n.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
}
function nl(n) {
  return et[n >> 18 & 63] + et[n >> 12 & 63] + et[n >> 6 & 63] + et[n & 63];
}
function rl(n, e, t) {
  for (var r, i = [], s = e; s < t; s += 3)
    r = (n[s] << 16 & 16711680) + (n[s + 1] << 8 & 65280) + (n[s + 2] & 255), i.push(nl(r));
  return i.join("");
}
function il(n) {
  for (var e, t = n.length, r = t % 3, i = [], s = 16383, o = 0, a = t - r; o < a; o += s)
    i.push(rl(n, o, o + s > a ? a : o + s));
  return r === 1 ? (e = n[t - 1], i.push(
    et[e >> 2] + et[e << 4 & 63] + "=="
  )) : r === 2 && (e = (n[t - 2] << 8) + n[t - 1], i.push(
    et[e >> 10] + et[e >> 4 & 63] + et[e << 2 & 63] + "="
  )), i.join("");
}
var ss = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
ss.read = function(n, e, t, r, i) {
  var s, o, a = i * 8 - r - 1, c = (1 << a) - 1, l = c >> 1, u = -7, p = t ? i - 1 : 0, d = t ? -1 : 1, y = n[e + p];
  for (p += d, s = y & (1 << -u) - 1, y >>= -u, u += a; u > 0; s = s * 256 + n[e + p], p += d, u -= 8)
    ;
  for (o = s & (1 << -u) - 1, s >>= -u, u += r; u > 0; o = o * 256 + n[e + p], p += d, u -= 8)
    ;
  if (s === 0)
    s = 1 - l;
  else {
    if (s === c)
      return o ? NaN : (y ? -1 : 1) * (1 / 0);
    o = o + Math.pow(2, r), s = s - l;
  }
  return (y ? -1 : 1) * o * Math.pow(2, s - r);
};
ss.write = function(n, e, t, r, i, s) {
  var o, a, c, l = s * 8 - i - 1, u = (1 << l) - 1, p = u >> 1, d = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, y = r ? 0 : s - 1, v = r ? 1 : -1, E = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
  for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (a = isNaN(e) ? 1 : 0, o = u) : (o = Math.floor(Math.log(e) / Math.LN2), e * (c = Math.pow(2, -o)) < 1 && (o--, c *= 2), o + p >= 1 ? e += d / c : e += d * Math.pow(2, 1 - p), e * c >= 2 && (o++, c /= 2), o + p >= u ? (a = 0, o = u) : o + p >= 1 ? (a = (e * c - 1) * Math.pow(2, i), o = o + p) : (a = e * Math.pow(2, p - 1) * Math.pow(2, i), o = 0)); i >= 8; n[t + y] = a & 255, y += v, a /= 256, i -= 8)
    ;
  for (o = o << i | a, l += i; l > 0; n[t + y] = o & 255, y += v, o /= 256, l -= 8)
    ;
  n[t + y - v] |= E * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(n) {
  const e = qr, t = ss, r = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  n.Buffer = u, n.SlowBuffer = O, n.INSPECT_MAX_BYTES = 50;
  const i = 2147483647;
  n.kMaxLength = i;
  const { Uint8Array: s, ArrayBuffer: o, SharedArrayBuffer: a } = globalThis;
  u.TYPED_ARRAY_SUPPORT = c(), !u.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function c() {
    try {
      const m = new s(1), f = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(f, s.prototype), Object.setPrototypeOf(m, f), m.foo() === 42;
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
  function l(m) {
    if (m > i)
      throw new RangeError('The value "' + m + '" is invalid for option "size"');
    const f = new s(m);
    return Object.setPrototypeOf(f, u.prototype), f;
  }
  function u(m, f, h) {
    if (typeof m == "number") {
      if (typeof f == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return v(m);
    }
    return p(m, f, h);
  }
  u.poolSize = 8192;
  function p(m, f, h) {
    if (typeof m == "string")
      return E(m, f);
    if (o.isView(m))
      return b(m);
    if (m == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof m
      );
    if (Ze(m, o) || m && Ze(m.buffer, o) || typeof a < "u" && (Ze(m, a) || m && Ze(m.buffer, a)))
      return k(m, f, h);
    if (typeof m == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const g = m.valueOf && m.valueOf();
    if (g != null && g !== m)
      return u.from(g, f, h);
    const _ = S(m);
    if (_) return _;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof m[Symbol.toPrimitive] == "function")
      return u.from(m[Symbol.toPrimitive]("string"), f, h);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof m
    );
  }
  u.from = function(m, f, h) {
    return p(m, f, h);
  }, Object.setPrototypeOf(u.prototype, s.prototype), Object.setPrototypeOf(u, s);
  function d(m) {
    if (typeof m != "number")
      throw new TypeError('"size" argument must be of type number');
    if (m < 0)
      throw new RangeError('The value "' + m + '" is invalid for option "size"');
  }
  function y(m, f, h) {
    return d(m), m <= 0 ? l(m) : f !== void 0 ? typeof h == "string" ? l(m).fill(f, h) : l(m).fill(f) : l(m);
  }
  u.alloc = function(m, f, h) {
    return y(m, f, h);
  };
  function v(m) {
    return d(m), l(m < 0 ? 0 : I(m) | 0);
  }
  u.allocUnsafe = function(m) {
    return v(m);
  }, u.allocUnsafeSlow = function(m) {
    return v(m);
  };
  function E(m, f) {
    if ((typeof f != "string" || f === "") && (f = "utf8"), !u.isEncoding(f))
      throw new TypeError("Unknown encoding: " + f);
    const h = C(m, f) | 0;
    let g = l(h);
    const _ = g.write(m, f);
    return _ !== h && (g = g.slice(0, _)), g;
  }
  function w(m) {
    const f = m.length < 0 ? 0 : I(m.length) | 0, h = l(f);
    for (let g = 0; g < f; g += 1)
      h[g] = m[g] & 255;
    return h;
  }
  function b(m) {
    if (Ze(m, s)) {
      const f = new s(m);
      return k(f.buffer, f.byteOffset, f.byteLength);
    }
    return w(m);
  }
  function k(m, f, h) {
    if (f < 0 || m.byteLength < f)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (m.byteLength < f + (h || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let g;
    return f === void 0 && h === void 0 ? g = new s(m) : h === void 0 ? g = new s(m, f) : g = new s(m, f, h), Object.setPrototypeOf(g, u.prototype), g;
  }
  function S(m) {
    if (u.isBuffer(m)) {
      const f = I(m.length) | 0, h = l(f);
      return h.length === 0 || m.copy(h, 0, 0, f), h;
    }
    if (m.length !== void 0)
      return typeof m.length != "number" || oi(m.length) ? l(0) : w(m);
    if (m.type === "Buffer" && Array.isArray(m.data))
      return w(m.data);
  }
  function I(m) {
    if (m >= i)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i.toString(16) + " bytes");
    return m | 0;
  }
  function O(m) {
    return +m != m && (m = 0), u.alloc(+m);
  }
  u.isBuffer = function(f) {
    return f != null && f._isBuffer === !0 && f !== u.prototype;
  }, u.compare = function(f, h) {
    if (Ze(f, s) && (f = u.from(f, f.offset, f.byteLength)), Ze(h, s) && (h = u.from(h, h.offset, h.byteLength)), !u.isBuffer(f) || !u.isBuffer(h))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (f === h) return 0;
    let g = f.length, _ = h.length;
    for (let A = 0, R = Math.min(g, _); A < R; ++A)
      if (f[A] !== h[A]) {
        g = f[A], _ = h[A];
        break;
      }
    return g < _ ? -1 : _ < g ? 1 : 0;
  }, u.isEncoding = function(f) {
    switch (String(f).toLowerCase()) {
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
  }, u.concat = function(f, h) {
    if (!Array.isArray(f))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (f.length === 0)
      return u.alloc(0);
    let g;
    if (h === void 0)
      for (h = 0, g = 0; g < f.length; ++g)
        h += f[g].length;
    const _ = u.allocUnsafe(h);
    let A = 0;
    for (g = 0; g < f.length; ++g) {
      let R = f[g];
      if (Ze(R, s))
        A + R.length > _.length ? (u.isBuffer(R) || (R = u.from(R)), R.copy(_, A)) : s.prototype.set.call(
          _,
          R,
          A
        );
      else if (u.isBuffer(R))
        R.copy(_, A);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      A += R.length;
    }
    return _;
  };
  function C(m, f) {
    if (u.isBuffer(m))
      return m.length;
    if (o.isView(m) || Ze(m, o))
      return m.byteLength;
    if (typeof m != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof m
      );
    const h = m.length, g = arguments.length > 2 && arguments[2] === !0;
    if (!g && h === 0) return 0;
    let _ = !1;
    for (; ; )
      switch (f) {
        case "ascii":
        case "latin1":
        case "binary":
          return h;
        case "utf8":
        case "utf-8":
          return si(m).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return h * 2;
        case "hex":
          return h >>> 1;
        case "base64":
          return Ps(m).length;
        default:
          if (_)
            return g ? -1 : si(m).length;
          f = ("" + f).toLowerCase(), _ = !0;
      }
  }
  u.byteLength = C;
  function M(m, f, h) {
    let g = !1;
    if ((f === void 0 || f < 0) && (f = 0), f > this.length || ((h === void 0 || h > this.length) && (h = this.length), h <= 0) || (h >>>= 0, f >>>= 0, h <= f))
      return "";
    for (m || (m = "utf8"); ; )
      switch (m) {
        case "hex":
          return Te(this, f, h);
        case "utf8":
        case "utf-8":
          return q(this, f, h);
        case "ascii":
          return Se(this, f, h);
        case "latin1":
        case "binary":
          return J(this, f, h);
        case "base64":
          return Z(this, f, h);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return ze(this, f, h);
        default:
          if (g) throw new TypeError("Unknown encoding: " + m);
          m = (m + "").toLowerCase(), g = !0;
      }
  }
  u.prototype._isBuffer = !0;
  function F(m, f, h) {
    const g = m[f];
    m[f] = m[h], m[h] = g;
  }
  u.prototype.swap16 = function() {
    const f = this.length;
    if (f % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let h = 0; h < f; h += 2)
      F(this, h, h + 1);
    return this;
  }, u.prototype.swap32 = function() {
    const f = this.length;
    if (f % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let h = 0; h < f; h += 4)
      F(this, h, h + 3), F(this, h + 1, h + 2);
    return this;
  }, u.prototype.swap64 = function() {
    const f = this.length;
    if (f % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let h = 0; h < f; h += 8)
      F(this, h, h + 7), F(this, h + 1, h + 6), F(this, h + 2, h + 5), F(this, h + 3, h + 4);
    return this;
  }, u.prototype.toString = function() {
    const f = this.length;
    return f === 0 ? "" : arguments.length === 0 ? q(this, 0, f) : M.apply(this, arguments);
  }, u.prototype.toLocaleString = u.prototype.toString, u.prototype.equals = function(f) {
    if (!u.isBuffer(f)) throw new TypeError("Argument must be a Buffer");
    return this === f ? !0 : u.compare(this, f) === 0;
  }, u.prototype.inspect = function() {
    let f = "";
    const h = n.INSPECT_MAX_BYTES;
    return f = this.toString("hex", 0, h).replace(/(.{2})/g, "$1 ").trim(), this.length > h && (f += " ... "), "<Buffer " + f + ">";
  }, r && (u.prototype[r] = u.prototype.inspect), u.prototype.compare = function(f, h, g, _, A) {
    if (Ze(f, s) && (f = u.from(f, f.offset, f.byteLength)), !u.isBuffer(f))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof f
      );
    if (h === void 0 && (h = 0), g === void 0 && (g = f ? f.length : 0), _ === void 0 && (_ = 0), A === void 0 && (A = this.length), h < 0 || g > f.length || _ < 0 || A > this.length)
      throw new RangeError("out of range index");
    if (_ >= A && h >= g)
      return 0;
    if (_ >= A)
      return -1;
    if (h >= g)
      return 1;
    if (h >>>= 0, g >>>= 0, _ >>>= 0, A >>>= 0, this === f) return 0;
    let R = A - _, z = g - h;
    const le = Math.min(R, z), ue = this.slice(_, A), fe = f.slice(h, g);
    for (let ne = 0; ne < le; ++ne)
      if (ue[ne] !== fe[ne]) {
        R = ue[ne], z = fe[ne];
        break;
      }
    return R < z ? -1 : z < R ? 1 : 0;
  };
  function L(m, f, h, g, _) {
    if (m.length === 0) return -1;
    if (typeof h == "string" ? (g = h, h = 0) : h > 2147483647 ? h = 2147483647 : h < -2147483648 && (h = -2147483648), h = +h, oi(h) && (h = _ ? 0 : m.length - 1), h < 0 && (h = m.length + h), h >= m.length) {
      if (_) return -1;
      h = m.length - 1;
    } else if (h < 0)
      if (_) h = 0;
      else return -1;
    if (typeof f == "string" && (f = u.from(f, g)), u.isBuffer(f))
      return f.length === 0 ? -1 : V(m, f, h, g, _);
    if (typeof f == "number")
      return f = f & 255, typeof s.prototype.indexOf == "function" ? _ ? s.prototype.indexOf.call(m, f, h) : s.prototype.lastIndexOf.call(m, f, h) : V(m, [f], h, g, _);
    throw new TypeError("val must be string, number or Buffer");
  }
  function V(m, f, h, g, _) {
    let A = 1, R = m.length, z = f.length;
    if (g !== void 0 && (g = String(g).toLowerCase(), g === "ucs2" || g === "ucs-2" || g === "utf16le" || g === "utf-16le")) {
      if (m.length < 2 || f.length < 2)
        return -1;
      A = 2, R /= 2, z /= 2, h /= 2;
    }
    function le(fe, ne) {
      return A === 1 ? fe[ne] : fe.readUInt16BE(ne * A);
    }
    let ue;
    if (_) {
      let fe = -1;
      for (ue = h; ue < R; ue++)
        if (le(m, ue) === le(f, fe === -1 ? 0 : ue - fe)) {
          if (fe === -1 && (fe = ue), ue - fe + 1 === z) return fe * A;
        } else
          fe !== -1 && (ue -= ue - fe), fe = -1;
    } else
      for (h + z > R && (h = R - z), ue = h; ue >= 0; ue--) {
        let fe = !0;
        for (let ne = 0; ne < z; ne++)
          if (le(m, ue + ne) !== le(f, ne)) {
            fe = !1;
            break;
          }
        if (fe) return ue;
      }
    return -1;
  }
  u.prototype.includes = function(f, h, g) {
    return this.indexOf(f, h, g) !== -1;
  }, u.prototype.indexOf = function(f, h, g) {
    return L(this, f, h, g, !0);
  }, u.prototype.lastIndexOf = function(f, h, g) {
    return L(this, f, h, g, !1);
  };
  function G(m, f, h, g) {
    h = Number(h) || 0;
    const _ = m.length - h;
    g ? (g = Number(g), g > _ && (g = _)) : g = _;
    const A = f.length;
    g > A / 2 && (g = A / 2);
    let R;
    for (R = 0; R < g; ++R) {
      const z = parseInt(f.substr(R * 2, 2), 16);
      if (oi(z)) return R;
      m[h + R] = z;
    }
    return R;
  }
  function Ee(m, f, h, g) {
    return cr(si(f, m.length - h), m, h, g);
  }
  function ie(m, f, h, g) {
    return cr(Tc(f), m, h, g);
  }
  function _e(m, f, h, g) {
    return cr(Ps(f), m, h, g);
  }
  function j(m, f, h, g) {
    return cr(Ic(f, m.length - h), m, h, g);
  }
  u.prototype.write = function(f, h, g, _) {
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
    const A = this.length - h;
    if ((g === void 0 || g > A) && (g = A), f.length > 0 && (g < 0 || h < 0) || h > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    _ || (_ = "utf8");
    let R = !1;
    for (; ; )
      switch (_) {
        case "hex":
          return G(this, f, h, g);
        case "utf8":
        case "utf-8":
          return Ee(this, f, h, g);
        case "ascii":
        case "latin1":
        case "binary":
          return ie(this, f, h, g);
        case "base64":
          return _e(this, f, h, g);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return j(this, f, h, g);
        default:
          if (R) throw new TypeError("Unknown encoding: " + _);
          _ = ("" + _).toLowerCase(), R = !0;
      }
  }, u.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function Z(m, f, h) {
    return f === 0 && h === m.length ? e.fromByteArray(m) : e.fromByteArray(m.slice(f, h));
  }
  function q(m, f, h) {
    h = Math.min(m.length, h);
    const g = [];
    let _ = f;
    for (; _ < h; ) {
      const A = m[_];
      let R = null, z = A > 239 ? 4 : A > 223 ? 3 : A > 191 ? 2 : 1;
      if (_ + z <= h) {
        let le, ue, fe, ne;
        switch (z) {
          case 1:
            A < 128 && (R = A);
            break;
          case 2:
            le = m[_ + 1], (le & 192) === 128 && (ne = (A & 31) << 6 | le & 63, ne > 127 && (R = ne));
            break;
          case 3:
            le = m[_ + 1], ue = m[_ + 2], (le & 192) === 128 && (ue & 192) === 128 && (ne = (A & 15) << 12 | (le & 63) << 6 | ue & 63, ne > 2047 && (ne < 55296 || ne > 57343) && (R = ne));
            break;
          case 4:
            le = m[_ + 1], ue = m[_ + 2], fe = m[_ + 3], (le & 192) === 128 && (ue & 192) === 128 && (fe & 192) === 128 && (ne = (A & 15) << 18 | (le & 63) << 12 | (ue & 63) << 6 | fe & 63, ne > 65535 && ne < 1114112 && (R = ne));
        }
      }
      R === null ? (R = 65533, z = 1) : R > 65535 && (R -= 65536, g.push(R >>> 10 & 1023 | 55296), R = 56320 | R & 1023), g.push(R), _ += z;
    }
    return Q(g);
  }
  const H = 4096;
  function Q(m) {
    const f = m.length;
    if (f <= H)
      return String.fromCharCode.apply(String, m);
    let h = "", g = 0;
    for (; g < f; )
      h += String.fromCharCode.apply(
        String,
        m.slice(g, g += H)
      );
    return h;
  }
  function Se(m, f, h) {
    let g = "";
    h = Math.min(m.length, h);
    for (let _ = f; _ < h; ++_)
      g += String.fromCharCode(m[_] & 127);
    return g;
  }
  function J(m, f, h) {
    let g = "";
    h = Math.min(m.length, h);
    for (let _ = f; _ < h; ++_)
      g += String.fromCharCode(m[_]);
    return g;
  }
  function Te(m, f, h) {
    const g = m.length;
    (!f || f < 0) && (f = 0), (!h || h < 0 || h > g) && (h = g);
    let _ = "";
    for (let A = f; A < h; ++A)
      _ += Ac[m[A]];
    return _;
  }
  function ze(m, f, h) {
    const g = m.slice(f, h);
    let _ = "";
    for (let A = 0; A < g.length - 1; A += 2)
      _ += String.fromCharCode(g[A] + g[A + 1] * 256);
    return _;
  }
  u.prototype.slice = function(f, h) {
    const g = this.length;
    f = ~~f, h = h === void 0 ? g : ~~h, f < 0 ? (f += g, f < 0 && (f = 0)) : f > g && (f = g), h < 0 ? (h += g, h < 0 && (h = 0)) : h > g && (h = g), h < f && (h = f);
    const _ = this.subarray(f, h);
    return Object.setPrototypeOf(_, u.prototype), _;
  };
  function se(m, f, h) {
    if (m % 1 !== 0 || m < 0) throw new RangeError("offset is not uint");
    if (m + f > h) throw new RangeError("Trying to access beyond buffer length");
  }
  u.prototype.readUintLE = u.prototype.readUIntLE = function(f, h, g) {
    f = f >>> 0, h = h >>> 0, g || se(f, h, this.length);
    let _ = this[f], A = 1, R = 0;
    for (; ++R < h && (A *= 256); )
      _ += this[f + R] * A;
    return _;
  }, u.prototype.readUintBE = u.prototype.readUIntBE = function(f, h, g) {
    f = f >>> 0, h = h >>> 0, g || se(f, h, this.length);
    let _ = this[f + --h], A = 1;
    for (; h > 0 && (A *= 256); )
      _ += this[f + --h] * A;
    return _;
  }, u.prototype.readUint8 = u.prototype.readUInt8 = function(f, h) {
    return f = f >>> 0, h || se(f, 1, this.length), this[f];
  }, u.prototype.readUint16LE = u.prototype.readUInt16LE = function(f, h) {
    return f = f >>> 0, h || se(f, 2, this.length), this[f] | this[f + 1] << 8;
  }, u.prototype.readUint16BE = u.prototype.readUInt16BE = function(f, h) {
    return f = f >>> 0, h || se(f, 2, this.length), this[f] << 8 | this[f + 1];
  }, u.prototype.readUint32LE = u.prototype.readUInt32LE = function(f, h) {
    return f = f >>> 0, h || se(f, 4, this.length), (this[f] | this[f + 1] << 8 | this[f + 2] << 16) + this[f + 3] * 16777216;
  }, u.prototype.readUint32BE = u.prototype.readUInt32BE = function(f, h) {
    return f = f >>> 0, h || se(f, 4, this.length), this[f] * 16777216 + (this[f + 1] << 16 | this[f + 2] << 8 | this[f + 3]);
  }, u.prototype.readBigUInt64LE = bt(function(f) {
    f = f >>> 0, Kt(f, "offset");
    const h = this[f], g = this[f + 7];
    (h === void 0 || g === void 0) && _n(f, this.length - 8);
    const _ = h + this[++f] * 2 ** 8 + this[++f] * 2 ** 16 + this[++f] * 2 ** 24, A = this[++f] + this[++f] * 2 ** 8 + this[++f] * 2 ** 16 + g * 2 ** 24;
    return BigInt(_) + (BigInt(A) << BigInt(32));
  }), u.prototype.readBigUInt64BE = bt(function(f) {
    f = f >>> 0, Kt(f, "offset");
    const h = this[f], g = this[f + 7];
    (h === void 0 || g === void 0) && _n(f, this.length - 8);
    const _ = h * 2 ** 24 + this[++f] * 2 ** 16 + this[++f] * 2 ** 8 + this[++f], A = this[++f] * 2 ** 24 + this[++f] * 2 ** 16 + this[++f] * 2 ** 8 + g;
    return (BigInt(_) << BigInt(32)) + BigInt(A);
  }), u.prototype.readIntLE = function(f, h, g) {
    f = f >>> 0, h = h >>> 0, g || se(f, h, this.length);
    let _ = this[f], A = 1, R = 0;
    for (; ++R < h && (A *= 256); )
      _ += this[f + R] * A;
    return A *= 128, _ >= A && (_ -= Math.pow(2, 8 * h)), _;
  }, u.prototype.readIntBE = function(f, h, g) {
    f = f >>> 0, h = h >>> 0, g || se(f, h, this.length);
    let _ = h, A = 1, R = this[f + --_];
    for (; _ > 0 && (A *= 256); )
      R += this[f + --_] * A;
    return A *= 128, R >= A && (R -= Math.pow(2, 8 * h)), R;
  }, u.prototype.readInt8 = function(f, h) {
    return f = f >>> 0, h || se(f, 1, this.length), this[f] & 128 ? (255 - this[f] + 1) * -1 : this[f];
  }, u.prototype.readInt16LE = function(f, h) {
    f = f >>> 0, h || se(f, 2, this.length);
    const g = this[f] | this[f + 1] << 8;
    return g & 32768 ? g | 4294901760 : g;
  }, u.prototype.readInt16BE = function(f, h) {
    f = f >>> 0, h || se(f, 2, this.length);
    const g = this[f + 1] | this[f] << 8;
    return g & 32768 ? g | 4294901760 : g;
  }, u.prototype.readInt32LE = function(f, h) {
    return f = f >>> 0, h || se(f, 4, this.length), this[f] | this[f + 1] << 8 | this[f + 2] << 16 | this[f + 3] << 24;
  }, u.prototype.readInt32BE = function(f, h) {
    return f = f >>> 0, h || se(f, 4, this.length), this[f] << 24 | this[f + 1] << 16 | this[f + 2] << 8 | this[f + 3];
  }, u.prototype.readBigInt64LE = bt(function(f) {
    f = f >>> 0, Kt(f, "offset");
    const h = this[f], g = this[f + 7];
    (h === void 0 || g === void 0) && _n(f, this.length - 8);
    const _ = this[f + 4] + this[f + 5] * 2 ** 8 + this[f + 6] * 2 ** 16 + (g << 24);
    return (BigInt(_) << BigInt(32)) + BigInt(h + this[++f] * 2 ** 8 + this[++f] * 2 ** 16 + this[++f] * 2 ** 24);
  }), u.prototype.readBigInt64BE = bt(function(f) {
    f = f >>> 0, Kt(f, "offset");
    const h = this[f], g = this[f + 7];
    (h === void 0 || g === void 0) && _n(f, this.length - 8);
    const _ = (h << 24) + // Overflow
    this[++f] * 2 ** 16 + this[++f] * 2 ** 8 + this[++f];
    return (BigInt(_) << BigInt(32)) + BigInt(this[++f] * 2 ** 24 + this[++f] * 2 ** 16 + this[++f] * 2 ** 8 + g);
  }), u.prototype.readFloatLE = function(f, h) {
    return f = f >>> 0, h || se(f, 4, this.length), t.read(this, f, !0, 23, 4);
  }, u.prototype.readFloatBE = function(f, h) {
    return f = f >>> 0, h || se(f, 4, this.length), t.read(this, f, !1, 23, 4);
  }, u.prototype.readDoubleLE = function(f, h) {
    return f = f >>> 0, h || se(f, 8, this.length), t.read(this, f, !0, 52, 8);
  }, u.prototype.readDoubleBE = function(f, h) {
    return f = f >>> 0, h || se(f, 8, this.length), t.read(this, f, !1, 52, 8);
  };
  function pe(m, f, h, g, _, A) {
    if (!u.isBuffer(m)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (f > _ || f < A) throw new RangeError('"value" argument is out of bounds');
    if (h + g > m.length) throw new RangeError("Index out of range");
  }
  u.prototype.writeUintLE = u.prototype.writeUIntLE = function(f, h, g, _) {
    if (f = +f, h = h >>> 0, g = g >>> 0, !_) {
      const z = Math.pow(2, 8 * g) - 1;
      pe(this, f, h, g, z, 0);
    }
    let A = 1, R = 0;
    for (this[h] = f & 255; ++R < g && (A *= 256); )
      this[h + R] = f / A & 255;
    return h + g;
  }, u.prototype.writeUintBE = u.prototype.writeUIntBE = function(f, h, g, _) {
    if (f = +f, h = h >>> 0, g = g >>> 0, !_) {
      const z = Math.pow(2, 8 * g) - 1;
      pe(this, f, h, g, z, 0);
    }
    let A = g - 1, R = 1;
    for (this[h + A] = f & 255; --A >= 0 && (R *= 256); )
      this[h + A] = f / R & 255;
    return h + g;
  }, u.prototype.writeUint8 = u.prototype.writeUInt8 = function(f, h, g) {
    return f = +f, h = h >>> 0, g || pe(this, f, h, 1, 255, 0), this[h] = f & 255, h + 1;
  }, u.prototype.writeUint16LE = u.prototype.writeUInt16LE = function(f, h, g) {
    return f = +f, h = h >>> 0, g || pe(this, f, h, 2, 65535, 0), this[h] = f & 255, this[h + 1] = f >>> 8, h + 2;
  }, u.prototype.writeUint16BE = u.prototype.writeUInt16BE = function(f, h, g) {
    return f = +f, h = h >>> 0, g || pe(this, f, h, 2, 65535, 0), this[h] = f >>> 8, this[h + 1] = f & 255, h + 2;
  }, u.prototype.writeUint32LE = u.prototype.writeUInt32LE = function(f, h, g) {
    return f = +f, h = h >>> 0, g || pe(this, f, h, 4, 4294967295, 0), this[h + 3] = f >>> 24, this[h + 2] = f >>> 16, this[h + 1] = f >>> 8, this[h] = f & 255, h + 4;
  }, u.prototype.writeUint32BE = u.prototype.writeUInt32BE = function(f, h, g) {
    return f = +f, h = h >>> 0, g || pe(this, f, h, 4, 4294967295, 0), this[h] = f >>> 24, this[h + 1] = f >>> 16, this[h + 2] = f >>> 8, this[h + 3] = f & 255, h + 4;
  };
  function ve(m, f, h, g, _) {
    Bs(f, g, _, m, h, 7);
    let A = Number(f & BigInt(4294967295));
    m[h++] = A, A = A >> 8, m[h++] = A, A = A >> 8, m[h++] = A, A = A >> 8, m[h++] = A;
    let R = Number(f >> BigInt(32) & BigInt(4294967295));
    return m[h++] = R, R = R >> 8, m[h++] = R, R = R >> 8, m[h++] = R, R = R >> 8, m[h++] = R, h;
  }
  function me(m, f, h, g, _) {
    Bs(f, g, _, m, h, 7);
    let A = Number(f & BigInt(4294967295));
    m[h + 7] = A, A = A >> 8, m[h + 6] = A, A = A >> 8, m[h + 5] = A, A = A >> 8, m[h + 4] = A;
    let R = Number(f >> BigInt(32) & BigInt(4294967295));
    return m[h + 3] = R, R = R >> 8, m[h + 2] = R, R = R >> 8, m[h + 1] = R, R = R >> 8, m[h] = R, h + 8;
  }
  u.prototype.writeBigUInt64LE = bt(function(f, h = 0) {
    return ve(this, f, h, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeBigUInt64BE = bt(function(f, h = 0) {
    return me(this, f, h, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeIntLE = function(f, h, g, _) {
    if (f = +f, h = h >>> 0, !_) {
      const le = Math.pow(2, 8 * g - 1);
      pe(this, f, h, g, le - 1, -le);
    }
    let A = 0, R = 1, z = 0;
    for (this[h] = f & 255; ++A < g && (R *= 256); )
      f < 0 && z === 0 && this[h + A - 1] !== 0 && (z = 1), this[h + A] = (f / R >> 0) - z & 255;
    return h + g;
  }, u.prototype.writeIntBE = function(f, h, g, _) {
    if (f = +f, h = h >>> 0, !_) {
      const le = Math.pow(2, 8 * g - 1);
      pe(this, f, h, g, le - 1, -le);
    }
    let A = g - 1, R = 1, z = 0;
    for (this[h + A] = f & 255; --A >= 0 && (R *= 256); )
      f < 0 && z === 0 && this[h + A + 1] !== 0 && (z = 1), this[h + A] = (f / R >> 0) - z & 255;
    return h + g;
  }, u.prototype.writeInt8 = function(f, h, g) {
    return f = +f, h = h >>> 0, g || pe(this, f, h, 1, 127, -128), f < 0 && (f = 255 + f + 1), this[h] = f & 255, h + 1;
  }, u.prototype.writeInt16LE = function(f, h, g) {
    return f = +f, h = h >>> 0, g || pe(this, f, h, 2, 32767, -32768), this[h] = f & 255, this[h + 1] = f >>> 8, h + 2;
  }, u.prototype.writeInt16BE = function(f, h, g) {
    return f = +f, h = h >>> 0, g || pe(this, f, h, 2, 32767, -32768), this[h] = f >>> 8, this[h + 1] = f & 255, h + 2;
  }, u.prototype.writeInt32LE = function(f, h, g) {
    return f = +f, h = h >>> 0, g || pe(this, f, h, 4, 2147483647, -2147483648), this[h] = f & 255, this[h + 1] = f >>> 8, this[h + 2] = f >>> 16, this[h + 3] = f >>> 24, h + 4;
  }, u.prototype.writeInt32BE = function(f, h, g) {
    return f = +f, h = h >>> 0, g || pe(this, f, h, 4, 2147483647, -2147483648), f < 0 && (f = 4294967295 + f + 1), this[h] = f >>> 24, this[h + 1] = f >>> 16, this[h + 2] = f >>> 8, this[h + 3] = f & 255, h + 4;
  }, u.prototype.writeBigInt64LE = bt(function(f, h = 0) {
    return ve(this, f, h, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), u.prototype.writeBigInt64BE = bt(function(f, h = 0) {
    return me(this, f, h, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function ri(m, f, h, g, _, A) {
    if (h + g > m.length) throw new RangeError("Index out of range");
    if (h < 0) throw new RangeError("Index out of range");
  }
  function ur(m, f, h, g, _) {
    return f = +f, h = h >>> 0, _ || ri(m, f, h, 4), t.write(m, f, h, g, 23, 4), h + 4;
  }
  u.prototype.writeFloatLE = function(f, h, g) {
    return ur(this, f, h, !0, g);
  }, u.prototype.writeFloatBE = function(f, h, g) {
    return ur(this, f, h, !1, g);
  };
  function Ds(m, f, h, g, _) {
    return f = +f, h = h >>> 0, _ || ri(m, f, h, 8), t.write(m, f, h, g, 52, 8), h + 8;
  }
  u.prototype.writeDoubleLE = function(f, h, g) {
    return Ds(this, f, h, !0, g);
  }, u.prototype.writeDoubleBE = function(f, h, g) {
    return Ds(this, f, h, !1, g);
  }, u.prototype.copy = function(f, h, g, _) {
    if (!u.isBuffer(f)) throw new TypeError("argument should be a Buffer");
    if (g || (g = 0), !_ && _ !== 0 && (_ = this.length), h >= f.length && (h = f.length), h || (h = 0), _ > 0 && _ < g && (_ = g), _ === g || f.length === 0 || this.length === 0) return 0;
    if (h < 0)
      throw new RangeError("targetStart out of bounds");
    if (g < 0 || g >= this.length) throw new RangeError("Index out of range");
    if (_ < 0) throw new RangeError("sourceEnd out of bounds");
    _ > this.length && (_ = this.length), f.length - h < _ - g && (_ = f.length - h + g);
    const A = _ - g;
    return this === f && typeof s.prototype.copyWithin == "function" ? this.copyWithin(h, g, _) : s.prototype.set.call(
      f,
      this.subarray(g, _),
      h
    ), A;
  }, u.prototype.fill = function(f, h, g, _) {
    if (typeof f == "string") {
      if (typeof h == "string" ? (_ = h, h = 0, g = this.length) : typeof g == "string" && (_ = g, g = this.length), _ !== void 0 && typeof _ != "string")
        throw new TypeError("encoding must be a string");
      if (typeof _ == "string" && !u.isEncoding(_))
        throw new TypeError("Unknown encoding: " + _);
      if (f.length === 1) {
        const R = f.charCodeAt(0);
        (_ === "utf8" && R < 128 || _ === "latin1") && (f = R);
      }
    } else typeof f == "number" ? f = f & 255 : typeof f == "boolean" && (f = Number(f));
    if (h < 0 || this.length < h || this.length < g)
      throw new RangeError("Out of range index");
    if (g <= h)
      return this;
    h = h >>> 0, g = g === void 0 ? this.length : g >>> 0, f || (f = 0);
    let A;
    if (typeof f == "number")
      for (A = h; A < g; ++A)
        this[A] = f;
    else {
      const R = u.isBuffer(f) ? f : u.from(f, _), z = R.length;
      if (z === 0)
        throw new TypeError('The value "' + f + '" is invalid for argument "value"');
      for (A = 0; A < g - h; ++A)
        this[A + h] = R[A % z];
    }
    return this;
  };
  const zt = {};
  function ii(m, f, h) {
    zt[m] = class extends h {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: f.apply(this, arguments),
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
  ii(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(m) {
      return m ? `${m} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), ii(
    "ERR_INVALID_ARG_TYPE",
    function(m, f) {
      return `The "${m}" argument must be of type number. Received type ${typeof f}`;
    },
    TypeError
  ), ii(
    "ERR_OUT_OF_RANGE",
    function(m, f, h) {
      let g = `The value of "${m}" is out of range.`, _ = h;
      return Number.isInteger(h) && Math.abs(h) > 2 ** 32 ? _ = Fs(String(h)) : typeof h == "bigint" && (_ = String(h), (h > BigInt(2) ** BigInt(32) || h < -(BigInt(2) ** BigInt(32))) && (_ = Fs(_)), _ += "n"), g += ` It must be ${f}. Received ${_}`, g;
    },
    RangeError
  );
  function Fs(m) {
    let f = "", h = m.length;
    const g = m[0] === "-" ? 1 : 0;
    for (; h >= g + 4; h -= 3)
      f = `_${m.slice(h - 3, h)}${f}`;
    return `${m.slice(0, h)}${f}`;
  }
  function Sc(m, f, h) {
    Kt(f, "offset"), (m[f] === void 0 || m[f + h] === void 0) && _n(f, m.length - (h + 1));
  }
  function Bs(m, f, h, g, _, A) {
    if (m > h || m < f) {
      const R = typeof f == "bigint" ? "n" : "";
      let z;
      throw f === 0 || f === BigInt(0) ? z = `>= 0${R} and < 2${R} ** ${(A + 1) * 8}${R}` : z = `>= -(2${R} ** ${(A + 1) * 8 - 1}${R}) and < 2 ** ${(A + 1) * 8 - 1}${R}`, new zt.ERR_OUT_OF_RANGE("value", z, m);
    }
    Sc(g, _, A);
  }
  function Kt(m, f) {
    if (typeof m != "number")
      throw new zt.ERR_INVALID_ARG_TYPE(f, "number", m);
  }
  function _n(m, f, h) {
    throw Math.floor(m) !== m ? (Kt(m, h), new zt.ERR_OUT_OF_RANGE("offset", "an integer", m)) : f < 0 ? new zt.ERR_BUFFER_OUT_OF_BOUNDS() : new zt.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${f}`,
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
  function si(m, f) {
    f = f || 1 / 0;
    let h;
    const g = m.length;
    let _ = null;
    const A = [];
    for (let R = 0; R < g; ++R) {
      if (h = m.charCodeAt(R), h > 55295 && h < 57344) {
        if (!_) {
          if (h > 56319) {
            (f -= 3) > -1 && A.push(239, 191, 189);
            continue;
          } else if (R + 1 === g) {
            (f -= 3) > -1 && A.push(239, 191, 189);
            continue;
          }
          _ = h;
          continue;
        }
        if (h < 56320) {
          (f -= 3) > -1 && A.push(239, 191, 189), _ = h;
          continue;
        }
        h = (_ - 55296 << 10 | h - 56320) + 65536;
      } else _ && (f -= 3) > -1 && A.push(239, 191, 189);
      if (_ = null, h < 128) {
        if ((f -= 1) < 0) break;
        A.push(h);
      } else if (h < 2048) {
        if ((f -= 2) < 0) break;
        A.push(
          h >> 6 | 192,
          h & 63 | 128
        );
      } else if (h < 65536) {
        if ((f -= 3) < 0) break;
        A.push(
          h >> 12 | 224,
          h >> 6 & 63 | 128,
          h & 63 | 128
        );
      } else if (h < 1114112) {
        if ((f -= 4) < 0) break;
        A.push(
          h >> 18 | 240,
          h >> 12 & 63 | 128,
          h >> 6 & 63 | 128,
          h & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return A;
  }
  function Tc(m) {
    const f = [];
    for (let h = 0; h < m.length; ++h)
      f.push(m.charCodeAt(h) & 255);
    return f;
  }
  function Ic(m, f) {
    let h, g, _;
    const A = [];
    for (let R = 0; R < m.length && !((f -= 2) < 0); ++R)
      h = m.charCodeAt(R), g = h >> 8, _ = h % 256, A.push(_), A.push(g);
    return A;
  }
  function Ps(m) {
    return e.toByteArray(xc(m));
  }
  function cr(m, f, h, g) {
    let _;
    for (_ = 0; _ < g && !(_ + h >= f.length || _ >= m.length); ++_)
      f[_ + h] = m[_];
    return _;
  }
  function Ze(m, f) {
    return m instanceof f || m != null && m.constructor != null && m.constructor.name != null && m.constructor.name === f.name;
  }
  function oi(m) {
    return m !== m;
  }
  const Ac = function() {
    const m = "0123456789abcdef", f = new Array(256);
    for (let h = 0; h < 16; ++h) {
      const g = h * 16;
      for (let _ = 0; _ < 16; ++_)
        f[g + _] = m[h] + m[_];
    }
    return f;
  }();
  function bt(m) {
    return typeof BigInt > "u" ? Oc : m;
  }
  function Oc() {
    throw new Error("BigInt not supported");
  }
})(Ma);
const Fa = Ma.Buffer, rt = globalThis || void 0 || self;
typeof self > "u" && (rt.self = rt);
class Ba {
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
    const r = (c, l) => {
      const u = l ? ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"] : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
      return u[Math.floor(c / 16)] + u[c % 16];
    }, i = Object.assign(
      {
        grouping: 0,
        rowlength: 0,
        uppercase: !1
      },
      t || {}
    );
    let s = "", o = 0, a = 0;
    for (let c = 0; c < e.length && (s += r(e[c], i.uppercase), c !== e.length - 1); ++c)
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
function Rr(n, e) {
  const t = Math.ceil(n.length / e), r = [];
  for (let i = 0, s = 0; i < t; ++i, s += e)
    r[i] = n.substr(s, e);
  return r;
}
function os(n = 256, e = "abcdef0123456789") {
  let t = new Uint8Array(n);
  return t = crypto.getRandomValues(t), t = t.map((r) => e.charCodeAt(r % e.length)), String.fromCharCode.apply(null, t);
}
function sl(n, e, t, r, i) {
  if (r = r || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~`!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?¿¡", i = i || r, e > r.length || t > i.length)
    return console.warn("Strings::charsetBaseConvert() - Can't convert", n, "to base", t, "greater than symbol table length. src-table:", r.length, "dest-table:", i.length), !1;
  let o = BigInt(0);
  for (let c = 0; c < n.length; c++)
    o = o * BigInt(e) + BigInt(r.indexOf(n.charAt(c)));
  let a = "";
  for (; o > 0; ) {
    const c = o % BigInt(t);
    a = i.charAt(Number(c)) + a, o /= BigInt(t);
  }
  return a || "0";
}
function bm(n) {
  return Ba.toHex(n, {});
}
function wm(n) {
  return Ba.toUint8Array(n);
}
function ol(n) {
  return Fa.from(n, "hex").toString("base64");
}
function al(n) {
  return Fa.from(n, "base64").toString("hex");
}
function ul(n) {
  return /^[A-F0-9]+$/i.test(n);
}
function cl(n) {
  return (typeof n == "number" || typeof n == "string" && n.trim() !== "") && !isNaN(n);
}
let Nr = class {
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
function Pa(n, e) {
  let t, r, i;
  const s = [Array, Date, Number, String, Boolean], o = Object.prototype.toString;
  for (e = e || [], t = 0; t < e.length; t += 2)
    n === e[t] && (r = e[t + 1]);
  if (!r && n && typeof n == "object") {
    for (r = {}, t = 0; t < s.length; t++)
      o.call(n) === o.call(i = new s[t](n)) && (r = t ? i : []);
    e.push(n, r);
    for (t in n)
      e.hasOwnProperty.call(n, t) && (r[t] = Pa(n[t], e));
  }
  return r || n;
}
function ll(...n) {
  return [].concat(...n.map((e, t) => {
    const r = n.slice(0);
    r.splice(t, 1);
    const i = [...new Set([].concat(...r))];
    return e.filter((s) => !i.includes(s));
  }));
}
function kn(...n) {
  return n.reduce((e, t) => e.filter((r) => t.includes(r)));
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
      for (const a of ll(e, o))
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
class Ue {
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
class jt extends re {
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
class Lt {
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
          t.push(Lt.isStructure(e[r]) ? Lt.structure(e[r]) : e[r]);
        return t;
      }
      case "[object Object]": {
        const t = [], r = Object.keys(e).sort((i, s) => i === s ? 0 : i < s ? -1 : 1);
        for (const i of r)
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
class fl extends Lt {
  constructor({
    position: e = null,
    walletAddress: t = null,
    isotope: r = null,
    token: i = null,
    value: s = null,
    batchId: o = null,
    metaType: a = null,
    metaId: c = null,
    meta: l = null,
    index: u = null,
    createdAt: p = null,
    version: d = null
  }) {
    super(), this.position = e, this.walletAddress = t, this.isotope = r, this.token = i, this.value = s, this.batchId = o, this.metaType = a, this.metaId = c, this.meta = l, this.index = u, this.createdAt = p, this.version = d;
  }
}
const wr = {
  4: fl
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
    isotope: r = null,
    token: i = null,
    value: s = null,
    batchId: o = null,
    metaType: a = null,
    metaId: c = null,
    meta: l = null,
    otsFragment: u = null,
    index: p = null,
    version: d = null
  }) {
    this.position = e, this.walletAddress = t, this.isotope = r, this.token = i, this.value = s !== null ? String(s) : null, this.batchId = o, this.metaType = a, this.metaId = c, this.meta = l ? Nr.normalizeMeta(l) : [], this.index = p, this.otsFragment = u, this.createdAt = String(+/* @__PURE__ */ new Date()), d !== null && Object.prototype.hasOwnProperty.call(wr, d) && (this.version = String(d));
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
    value: r = null,
    metaType: i = null,
    metaId: s = null,
    meta: o = null,
    batchId: a = null
  }) {
    return o || (o = new Ue()), o instanceof Ue || (o = new Ue(o)), t && (o.setAtomWallet(t), a || (a = t.batchId)), new W({
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
    const t = Object.assign(new W({}), JSON.parse(e)), r = Object.keys(new W({}));
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
    const r = new Ve("SHAKE256", "TEXT"), i = W.sortAtoms(e);
    if (i.length === 0)
      throw new jt();
    if (i.map((s) => {
      if (!(s instanceof W))
        throw new jt();
      return s;
    }), i.every((s) => s.version && Object.prototype.hasOwnProperty.call(wr, s.version)))
      r.update(JSON.stringify(i.map((s) => wr[s.version].create(s).view())));
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
        return sl(r.getHash("HEX", { outputLen: 256 }), 16, 17, "0123456789abcdef", "0123456789abcdefg").padStart(64, "0");
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
    return t.sort((r, i) => r.index < i.index ? -1 : 1), t;
  }
  /**
   * Get aggregated meta from stored normalized ones
   */
  aggregatedMeta() {
    return Nr.aggregateMeta(this.meta);
  }
  /**
   *
   * @returns {*[]}
   */
  getHashableValues() {
    const e = [];
    for (const t of W.getHashableProps()) {
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
function Ni(n = null, e = 2048) {
  if (n) {
    const t = new Ve("SHAKE256", "TEXT");
    return t.update(n), t.getHash("HEX", { outputLen: e * 2 });
  } else
    return os(e);
}
function fn(n, e = null) {
  const t = new Ve("SHAKE256", "TEXT");
  return t.update(n), t.getHash("HEX", { outputLen: 256 });
}
function Mr({
  molecularHash: n = null,
  index: e = null
}) {
  return n !== null && e !== null ? fn(String(n) + String(e), "generateBatchId") : os(64);
}
class zn {
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
    return t.length && (t = JSON.parse(t), t || (t = {})), new zn(
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
    return new zn(
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
class hl extends re {
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
function Ks(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error("positive integer expected, got " + n);
}
function dl(n) {
  return n instanceof Uint8Array || ArrayBuffer.isView(n) && n.constructor.name === "Uint8Array";
}
function jr(n, ...e) {
  if (!dl(n))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(n.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + n.length);
}
function Gs(n, e = !0) {
  if (n.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && n.finished)
    throw new Error("Hash#digest() has already been called");
}
function pl(n, e) {
  jr(n);
  const t = e.outputLen;
  if (n.length < t)
    throw new Error("digestInto() expects output buffer of length at least " + t);
}
const fr = /* @__PURE__ */ BigInt(2 ** 32 - 1), Js = /* @__PURE__ */ BigInt(32);
function yl(n, e = !1) {
  return e ? { h: Number(n & fr), l: Number(n >> Js & fr) } : { h: Number(n >> Js & fr) | 0, l: Number(n & fr) | 0 };
}
function ml(n, e = !1) {
  let t = new Uint32Array(n.length), r = new Uint32Array(n.length);
  for (let i = 0; i < n.length; i++) {
    const { h: s, l: o } = yl(n[i], e);
    [t[i], r[i]] = [s, o];
  }
  return [t, r];
}
const gl = (n, e, t) => n << t | e >>> 32 - t, vl = (n, e, t) => e << t | n >>> 32 - t, bl = (n, e, t) => e << t - 32 | n >>> 64 - t, wl = (n, e, t) => n << t - 32 | e >>> 64 - t, Yt = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function $a(n) {
  return new Uint32Array(n.buffer, n.byteOffset, Math.floor(n.byteLength / 4));
}
const Ys = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function El(n) {
  return n << 24 & 4278190080 | n << 8 & 16711680 | n >>> 8 & 65280 | n >>> 24 & 255;
}
function Xs(n) {
  for (let e = 0; e < n.length; e++)
    n[e] = El(n[e]);
}
function _l(n) {
  if (typeof n != "string")
    throw new Error("utf8ToBytes expected string, got " + typeof n);
  return new Uint8Array(new TextEncoder().encode(n));
}
function us(n) {
  return typeof n == "string" && (n = _l(n)), jr(n), n;
}
class Sl {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function kl(n) {
  const e = (r) => n().update(us(r)).digest(), t = n();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => n(), e;
}
function xl(n) {
  const e = (r, i) => n(i).update(us(r)).digest(), t = n({});
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = (r) => n(r), e;
}
function Tl(n = 32) {
  if (Yt && typeof Yt.getRandomValues == "function")
    return Yt.getRandomValues(new Uint8Array(n));
  if (Yt && typeof Yt.randomBytes == "function")
    return Yt.randomBytes(n);
  throw new Error("crypto.getRandomValues must be defined");
}
const La = [], Ua = [], qa = [], Il = /* @__PURE__ */ BigInt(0), xn = /* @__PURE__ */ BigInt(1), Al = /* @__PURE__ */ BigInt(2), Ol = /* @__PURE__ */ BigInt(7), Cl = /* @__PURE__ */ BigInt(256), Rl = /* @__PURE__ */ BigInt(113);
for (let n = 0, e = xn, t = 1, r = 0; n < 24; n++) {
  [t, r] = [r, (2 * t + 3 * r) % 5], La.push(2 * (5 * r + t)), Ua.push((n + 1) * (n + 2) / 2 % 64);
  let i = Il;
  for (let s = 0; s < 7; s++)
    e = (e << xn ^ (e >> Ol) * Rl) % Cl, e & Al && (i ^= xn << (xn << /* @__PURE__ */ BigInt(s)) - xn);
  qa.push(i);
}
const [Nl, Ml] = /* @__PURE__ */ ml(qa, !0), Zs = (n, e, t) => t > 32 ? bl(n, e, t) : gl(n, e, t), eo = (n, e, t) => t > 32 ? wl(n, e, t) : vl(n, e, t);
function Dl(n, e = 24) {
  const t = new Uint32Array(10);
  for (let r = 24 - e; r < 24; r++) {
    for (let o = 0; o < 10; o++)
      t[o] = n[o] ^ n[o + 10] ^ n[o + 20] ^ n[o + 30] ^ n[o + 40];
    for (let o = 0; o < 10; o += 2) {
      const a = (o + 8) % 10, c = (o + 2) % 10, l = t[c], u = t[c + 1], p = Zs(l, u, 1) ^ t[a], d = eo(l, u, 1) ^ t[a + 1];
      for (let y = 0; y < 50; y += 10)
        n[o + y] ^= p, n[o + y + 1] ^= d;
    }
    let i = n[2], s = n[3];
    for (let o = 0; o < 24; o++) {
      const a = Ua[o], c = Zs(i, s, a), l = eo(i, s, a), u = La[o];
      i = n[u], s = n[u + 1], n[u] = c, n[u + 1] = l;
    }
    for (let o = 0; o < 50; o += 10) {
      for (let a = 0; a < 10; a++)
        t[a] = n[o + a];
      for (let a = 0; a < 10; a++)
        n[o + a] ^= ~t[(a + 2) % 10] & t[(a + 4) % 10];
    }
    n[0] ^= Nl[r], n[1] ^= Ml[r];
  }
  t.fill(0);
}
class Vr extends Sl {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(e, t, r, i = !1, s = 24) {
    if (super(), this.blockLen = e, this.suffix = t, this.outputLen = r, this.enableXOF = i, this.rounds = s, this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, Ks(r), 0 >= this.blockLen || this.blockLen >= 200)
      throw new Error("Sha3 supports only keccak-f1600 function");
    this.state = new Uint8Array(200), this.state32 = $a(this.state);
  }
  keccak() {
    Ys || Xs(this.state32), Dl(this.state32, this.rounds), Ys || Xs(this.state32), this.posOut = 0, this.pos = 0;
  }
  update(e) {
    Gs(this);
    const { blockLen: t, state: r } = this;
    e = us(e);
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
    Gs(this, !1), jr(e), this.finish();
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
    return Ks(e), this.xofInto(new Uint8Array(e));
  }
  digestInto(e) {
    if (pl(e, this), this.finished)
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
    return e || (e = new Vr(t, r, i, o, s)), e.state32.set(this.state32), e.pos = this.pos, e.posOut = this.posOut, e.finished = this.finished, e.rounds = s, e.suffix = r, e.outputLen = i, e.enableXOF = o, e.destroyed = this.destroyed, e;
  }
}
const ja = (n, e, t) => kl(() => new Vr(e, n, t)), Fl = /* @__PURE__ */ ja(6, 136, 256 / 8), Bl = /* @__PURE__ */ ja(6, 72, 512 / 8), Va = (n, e, t) => xl((r = {}) => new Vr(e, n, r.dkLen === void 0 ? t : r.dkLen, !0)), Pl = /* @__PURE__ */ Va(31, 168, 128 / 8), Qa = /* @__PURE__ */ Va(31, 136, 256 / 8);
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
const It = jr, to = Tl;
function no(n, e) {
  if (n.length !== e.length)
    return !1;
  let t = 0;
  for (let r = 0; r < n.length; r++)
    t |= n[r] ^ e[r];
  return t === 0;
}
function Er(...n) {
  const e = (r) => typeof r == "number" ? r : r.bytesLen, t = n.reduce((r, i) => r + e(i), 0);
  return {
    bytesLen: t,
    encode: (r) => {
      const i = new Uint8Array(t);
      for (let s = 0, o = 0; s < n.length; s++) {
        const a = n[s], c = e(a), l = typeof a == "number" ? r[s] : a.encode(r[s]);
        It(l, c), i.set(l, o), typeof a != "number" && l.fill(0), o += c;
      }
      return i;
    },
    decode: (r) => {
      It(r, t);
      const i = [];
      for (const s of n) {
        const o = e(s), a = r.subarray(0, o);
        i.push(typeof s == "number" ? a : s.decode(a)), r = r.subarray(o);
      }
      return i;
    }
  };
}
function ci(n, e) {
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
      It(r, t);
      const i = [];
      for (let s = 0; s < r.length; s += n.bytesLen)
        i.push(n.decode(r.subarray(s, s + n.bytesLen)));
      return i;
    }
  };
}
function qt(...n) {
  for (const e of n)
    if (Array.isArray(e))
      for (const t of e)
        t.fill(0);
    else
      e.fill(0);
}
function ro(n) {
  return (1 << n) - 1;
}
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
function $l(n, e = 8) {
  const i = n.toString(2).padStart(8, "0").slice(-e).padStart(7, "0").split("").reverse().join("");
  return Number.parseInt(i, 2);
}
const Ll = (n) => {
  const { newPoly: e, N: t, Q: r, F: i, ROOT_OF_UNITY: s, brvBits: o, isKyber: a } = n, c = (w, b = r) => {
    const k = w % b | 0;
    return (k >= 0 ? k | 0 : b + k | 0) | 0;
  }, l = (w, b = r) => {
    const k = c(w, b) | 0;
    return (k > b >> 1 ? k - b | 0 : k) | 0;
  };
  function u() {
    const w = e(t);
    for (let b = 0; b < t; b++) {
      const k = $l(b, o), S = BigInt(s) ** BigInt(k) % BigInt(r);
      w[b] = Number(S) | 0;
    }
    return w;
  }
  const p = u(), d = a ? 128 : t, y = a ? 1 : 0;
  return { mod: c, smod: l, nttZetas: p, NTT: {
    encode: (w) => {
      for (let b = 1, k = 128; k > y; k >>= 1)
        for (let S = 0; S < t; S += 2 * k) {
          const I = p[b++];
          for (let O = S; O < S + k; O++) {
            const C = c(I * w[O + k]);
            w[O + k] = c(w[O] - C) | 0, w[O] = c(w[O] + C) | 0;
          }
        }
      return w;
    },
    decode: (w) => {
      for (let b = d - 1, k = 1 + y; k < d + y; k <<= 1)
        for (let S = 0; S < t; S += 2 * k) {
          const I = p[b--];
          for (let O = S; O < S + k; O++) {
            const C = w[O];
            w[O] = c(C + w[O + k]), w[O + k] = c(I * (w[O + k] - C));
          }
        }
      for (let b = 0; b < w.length; b++)
        w[b] = c(i * w[b]);
      return w;
    }
  }, bitsCoder: (w, b) => {
    const k = ro(w), S = w * (t / 8);
    return {
      bytesLen: S,
      encode: (I) => {
        const O = new Uint8Array(S);
        for (let C = 0, M = 0, F = 0, L = 0; C < I.length; C++)
          for (M |= (b.encode(I[C]) & k) << F, F += w; F >= 8; F -= 8, M >>= 8)
            O[L++] = M & ro(F);
        return O;
      },
      decode: (I) => {
        const O = e(t);
        for (let C = 0, M = 0, F = 0, L = 0; C < I.length; C++)
          for (M |= I[C] << F, F += 8; F >= w; F -= w, M >>= w)
            O[L++] = b.decode(M & k);
        return O;
      }
    };
  } };
}, Ul = (n) => (e, t) => {
  t || (t = n.blockLen);
  const r = new Uint8Array(e.length + 2);
  r.set(e);
  const i = e.length, s = new Uint8Array(t);
  let o = n.create({}), a = 0, c = 0;
  return {
    stats: () => ({ calls: a, xofs: c }),
    get: (l, u) => (r[i + 0] = l, r[i + 1] = u, o.destroy(), o = n.create({}).update(r), a++, () => (c++, o.xofInto(s))),
    clean: () => {
      o.destroy(), s.fill(0), r.fill(0);
    }
  };
}, ql = /* @__PURE__ */ Ul(Pl);
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
const Ne = 256, yt = 3329, jl = 3303, Vl = 17, { mod: Kn, nttZetas: Ql, NTT: Dt, bitsCoder: Hl } = Ll({
  N: Ne,
  Q: yt,
  F: jl,
  ROOT_OF_UNITY: Vl,
  newPoly: (n) => new Uint16Array(n),
  brvBits: 7,
  isKyber: !0
}), Wl = {
  512: { N: Ne, Q: yt, K: 2, ETA1: 3, ETA2: 2, du: 10, dv: 4, RBGstrength: 128 },
  768: { N: Ne, Q: yt, K: 3, ETA1: 2, ETA2: 2, du: 10, dv: 4, RBGstrength: 192 },
  1024: { N: Ne, Q: yt, K: 4, ETA1: 2, ETA2: 2, du: 11, dv: 5, RBGstrength: 256 }
}, zl = (n) => {
  if (n >= 12)
    return { encode: (t) => t, decode: (t) => t };
  const e = 2 ** (n - 1);
  return {
    // const compress = (i: number) => round((2 ** d / Q) * i) % 2 ** d;
    encode: (t) => ((t << n) + yt / 2) / yt,
    // const decompress = (i: number) => round((Q / 2 ** d) * i);
    decode: (t) => t * yt + e >>> n
  };
}, Tn = (n) => Hl(n, zl(n));
function Ft(n, e) {
  for (let t = 0; t < Ne; t++)
    n[t] = Kn(n[t] + e[t]);
}
function Kl(n, e) {
  for (let t = 0; t < Ne; t++)
    n[t] = Kn(n[t] - e[t]);
}
function Gl(n, e, t, r, i) {
  const s = Kn(e * r * i + n * t), o = Kn(n * r + e * t);
  return { c0: s, c1: o };
}
function hr(n, e) {
  for (let t = 0; t < Ne / 2; t++) {
    let r = Ql[64 + (t >> 1)];
    t & 1 && (r = -r);
    const { c0: i, c1: s } = Gl(n[2 * t + 0], n[2 * t + 1], e[2 * t + 0], e[2 * t + 1], r);
    n[2 * t + 0] = i, n[2 * t + 1] = s;
  }
  return n;
}
function io(n) {
  const e = new Uint16Array(Ne);
  for (let t = 0; t < Ne; ) {
    const r = n();
    if (r.length % 3)
      throw new Error("SampleNTT: unaligned block");
    for (let i = 0; t < Ne && i + 3 <= r.length; i += 3) {
      const s = (r[i + 0] >> 0 | r[i + 1] << 8) & 4095, o = (r[i + 1] >> 4 | r[i + 2] << 4) & 4095;
      s < yt && (e[t++] = s), t < Ne && o < yt && (e[t++] = o);
    }
  }
  return e;
}
function In(n, e, t, r) {
  const i = n(r * Ne / 4, e, t), s = new Uint16Array(Ne), o = $a(i);
  let a = 0;
  for (let c = 0, l = 0, u = 0, p = 0; c < o.length; c++) {
    let d = o[c];
    for (let y = 0; y < 32; y++)
      u += d & 1, d >>= 1, a += 1, a === r ? (p = u, u = 0) : a === 2 * r && (s[l++] = Kn(p - u), u = 0, a = 0);
  }
  if (a)
    throw new Error(`sampleCBD: leftover bits: ${a}`);
  return s;
}
const Jl = (n) => {
  const { K: e, PRF: t, XOF: r, HASH512: i, ETA1: s, ETA2: o, du: a, dv: c } = n, l = Tn(1), u = Tn(c), p = Tn(a), d = Er(ci(Tn(12), e), 32), y = ci(Tn(12), e), v = Er(ci(p, e), u), E = Er(32, 32);
  return {
    secretCoder: y,
    secretKeyLen: y.bytesLen,
    publicKeyLen: d.bytesLen,
    cipherTextLen: v.bytesLen,
    keygen: (w) => {
      const b = new Uint8Array(33);
      b.set(w), b[32] = e;
      const k = i(b), [S, I] = E.decode(k), O = [], C = [];
      for (let L = 0; L < e; L++)
        O.push(Dt.encode(In(t, I, L, s)));
      const M = r(S);
      for (let L = 0; L < e; L++) {
        const V = Dt.encode(In(t, I, e + L, s));
        for (let G = 0; G < e; G++) {
          const Ee = io(M.get(G, L));
          Ft(V, hr(Ee, O[G]));
        }
        C.push(V);
      }
      M.clean();
      const F = {
        publicKey: d.encode([C, S]),
        secretKey: y.encode(O)
      };
      return qt(S, I, O, C, b, k), F;
    },
    encrypt: (w, b, k) => {
      const [S, I] = d.decode(w), O = [];
      for (let G = 0; G < e; G++)
        O.push(Dt.encode(In(t, k, G, s)));
      const C = r(I), M = new Uint16Array(Ne), F = [];
      for (let G = 0; G < e; G++) {
        const Ee = In(t, k, e + G, o), ie = new Uint16Array(Ne);
        for (let _e = 0; _e < e; _e++) {
          const j = io(C.get(G, _e));
          Ft(ie, hr(j, O[_e]));
        }
        Ft(Ee, Dt.decode(ie)), F.push(Ee), Ft(M, hr(S[G], O[G])), ie.fill(0);
      }
      C.clean();
      const L = In(t, k, 2 * e, o);
      Ft(L, Dt.decode(M));
      const V = l.decode(b);
      return Ft(V, L), qt(S, O, M, L), v.encode([F, V]);
    },
    decrypt: (w, b) => {
      const [k, S] = v.decode(w), I = y.decode(b), O = new Uint16Array(Ne);
      for (let C = 0; C < e; C++)
        Ft(O, hr(I[C], Dt.encode(k[C])));
      return Kl(S, Dt.decode(O)), qt(O, I, k), l.encode(S);
    }
  };
};
function Yl(n) {
  const e = Jl(n), { HASH256: t, HASH512: r, KDF: i } = n, { secretCoder: s, cipherTextLen: o } = e, a = e.publicKeyLen, c = Er(e.secretKeyLen, e.publicKeyLen, 32, 32), l = c.bytesLen, u = 32;
  return {
    publicKeyLen: a,
    msgLen: u,
    keygen: (p = to(64)) => {
      It(p, 64);
      const { publicKey: d, secretKey: y } = e.keygen(p.subarray(0, 32)), v = t(d), E = c.encode([y, d, v, p.subarray(32)]);
      return qt(y, v), { publicKey: d, secretKey: E };
    },
    encapsulate: (p, d = to(32)) => {
      It(p, a), It(d, u);
      const y = p.subarray(0, 384 * n.K), v = s.encode(s.decode(y.slice()));
      if (!no(v, y))
        throw qt(v), new Error("ML-KEM.encapsulate: wrong publicKey modulus");
      qt(v);
      const E = r.create().update(d).update(t(p)).digest(), w = e.encrypt(p, d, E.subarray(32, 64));
      return E.subarray(32).fill(0), { cipherText: w, sharedSecret: E.subarray(0, 32) };
    },
    decapsulate: (p, d) => {
      It(d, l), It(p, o);
      const [y, v, E, w] = c.decode(d), b = e.decrypt(p, y), k = r.create().update(b).update(E).digest(), S = k.subarray(0, 32), I = e.encrypt(v, b, k.subarray(32, 64)), O = no(p, I), C = i.create({ dkLen: 32 }).update(w).update(p).digest();
      return qt(b, I, O ? C : S), O ? S : C;
    }
  };
}
function Xl(n, e, t) {
  return Qa.create({ dkLen: n }).update(e).update(new Uint8Array([t])).digest();
}
const Zl = {
  HASH256: Fl,
  HASH512: Bl,
  KDF: Qa,
  XOF: ql,
  PRF: Xl
}, li = /* @__PURE__ */ Yl({
  ...Zl,
  ...Wl[768]
});
class Y {
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
    this.token = r, this.balance = 0, this.molecules = {}, this.key = null, this.privkey = null, this.pubkey = null, this.tokenUnits = [], this.tradeRates = {}, this.address = i, this.position = s, this.bundle = t, this.batchId = o, this.characters = a, e && (this.bundle = this.bundle || fn(e, "Wallet::constructor"), this.position = this.position || Y.generatePosition(), this.key = Y.generateKey({
      secret: e,
      token: this.token,
      position: this.position
    }), this.address = this.address || Y.generateAddress(this.key), this.characters = this.characters || "BASE64", this.initializeMLKEM());
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
      throw new hl();
    return e && !t && (o = Y.generatePosition(), t = fn(e, "Wallet::create")), new Y({
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
    return typeof e != "string" ? !1 : e.length === 64 && ul(e);
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
      t.push(zn.createFromDB(r));
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
    const s = BigInt(`0x${e}`) + BigInt(`0x${r}`), o = new Ve("SHAKE256", "TEXT");
    o.update(s.toString(16)), t && o.update(t);
    const a = new Ve("SHAKE256", "TEXT");
    return a.update(o.getHash("HEX", { outputLen: 8192 })), a.getHash("HEX", { outputLen: 8192 });
  }
  /**
   * Generates a wallet address
   *
   * @param {string} key
   * @return {string}
   */
  static generateAddress(e) {
    const t = Rr(e, 128), r = new Ve("SHAKE256", "TEXT");
    for (const s in t) {
      let o = t[s];
      for (let a = 1; a <= 16; a++) {
        const c = new Ve("SHAKE256", "TEXT");
        c.update(o), o = c.getHash("HEX", { outputLen: 512 });
      }
      r.update(o);
    }
    const i = new Ve("SHAKE256", "TEXT");
    return i.update(r.getHash("HEX", { outputLen: 8192 })), i.getHash("HEX", { outputLen: 256 });
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
    const e = Ni(this.key, 64), t = new Uint8Array(64);
    for (let s = 0; s < 64; s++)
      t[s] = parseInt(e.substr(s * 2, 2), 16);
    const { publicKey: r, secretKey: i } = li.keygen(t);
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
    const t = Y.create({
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
    e.batchId && (this.batchId = t ? e.batchId : Mr({}));
  }
  async encryptMessage(e, t) {
    const r = JSON.stringify(e), i = new TextEncoder().encode(r), s = this.deserializeKey(t), { cipherText: o, sharedSecret: a } = li.encapsulate(s), c = await this.encryptWithSharedSecret(i, a);
    return {
      cipherText: this.serializeKey(o),
      encryptedMessage: this.serializeKey(c)
    };
  }
  async decryptMessage(e) {
    const { cipherText: t, encryptedMessage: r } = e, i = li.decapsulate(this.deserializeKey(t), this.privkey), s = await this.decryptWithSharedSecret(this.deserializeKey(r), i), o = new TextDecoder().decode(s);
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
class An extends re {
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
class ef extends re {
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
class tf extends re {
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
class so extends re {
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
class Ha extends re {
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
class nf extends re {
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
class lt extends re {
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
class oo extends re {
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
class ao extends re {
  /**
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Token slugs for wallets in transfer do not match!", t = null, r = null) {
    super(e, t, r), this.name = "TransferMismatchedException";
  }
}
class uo extends re {
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
class rf extends re {
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
class sf extends re {
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
class Et extends re {
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
class On extends re {
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
class _r extends re {
  /**
   * @param {string|null} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Incorrect BatchId", t = null, r = null) {
    super(e, t, r), this.name = "BatchIdException";
  }
}
class co {
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
class Dr extends re {
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
class Qe extends re {
  /**
   * @param {string|null} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Code exception", t = null, r = null) {
    super(e, t, r), this.name = "CodeException";
  }
}
class qn {
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
    comparison: c = null
  }) {
    if (i && (this.meta = i), !e)
      throw new Dr('Callback structure violated, missing mandatory "action" parameter.');
    this.__metaId = r, this.__metaType = t, this.__action = e, this.__address = s, this.__token = o, this.__amount = a, this.__comparison = c;
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
    if (!cl(e))
      throw new Qe("Parameter amount should be a string containing numbers");
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
    this.__meta = e instanceof co ? e : co.toObject(e);
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
    const t = new qn({
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
    return kn(Object.keys(this.toJSON()), ["action", "metaId", "metaType", "meta"]).length === 4 && this._is("meta");
  }
  /**
   * @return {boolean}
   */
  isCollect() {
    return kn(Object.keys(this.toJSON()), ["action", "address", "token", "amount", "comparison"]).length === 5 && this._is("collect");
  }
  /**
   * @return {boolean}
   */
  isBuffer() {
    return kn(Object.keys(this.toJSON()), ["action", "address", "token", "amount", "comparison"]).length === 5 && this._is("buffer");
  }
  /**
   * @return {boolean}
   */
  isRemit() {
    return kn(Object.keys(this.toJSON()), ["action", "token", "amount"]).length === 3 && this._is("remit");
  }
  /**
   * @return {boolean}
   */
  isBurn() {
    return kn(Object.keys(this.toJSON()), ["action", "token", "amount", "comparison"]).length === 4 && this._is("burn");
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
class fi {
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
      throw new Dr("Condition::constructor( { key, value, comparison } ) - not all class parameters are initialised!");
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
class Gn {
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
      if (!(r instanceof fi))
        throw new Dr();
    for (const r of t)
      if (!(r instanceof qn))
        throw new Dr();
    this.__condition = e, this.__callback = t;
  }
  /**
   *
   * @param {Condition[]|{}} condition
   */
  set comparison(e) {
    this.__condition.push(e instanceof fi ? e : fi.toObject(e));
  }
  /**
   * @param {Callback[]|{}} callback
   */
  set callback(e) {
    this.__callback.push(e instanceof qn ? e : qn.toObject(e));
  }
  /**
   *
   * @param {object} object
   *
   * @return {Rule}
   */
  static toObject(e) {
    if (!e.condition)
      throw new Et("Rule::toObject() - Incorrect rule format! There is no condition field.");
    if (!e.callback)
      throw new Et("Rule::toObject() - Incorrect rule format! There is no callback field.");
    const t = new Gn({});
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
    for (let l = 0; l < o; l++) {
      const u = i[l], p = Number(u), d = Number.isInteger(p);
      (d ? p : u in s) || (s[d ? p : u] = i[l + 1].match(/^\d+$/) ? [] : {}), s = s[d ? p : u];
    }
    const a = i[o], c = Number(a);
    return s[Number.isInteger(c) ? c : a] = r, e;
  }
}
class of {
  /**
   *
   * @param molecule
   */
  constructor(e) {
    if (e.molecularHash === null)
      throw new tf();
    if (!e.atoms.length)
      throw new jt();
    for (const t of e.atoms)
      if (t.index === null)
        throw new An();
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
      throw new jt("Check::continuId() - Molecule is missing required ContinuID Atom!");
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
          throw new _r();
        for (const i of t)
          if (i.batchId === null)
            throw new _r();
      }
      return !0;
    }
    throw new _r();
  }
  /**
   *
   * @returns {boolean}
   */
  isotopeI() {
    for (const e of this.molecule.getIsotopes("I")) {
      if (e.token !== "USER")
        throw new On(`Check::isotopeI() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index === 0)
        throw new An(`Check::isotopeI() - Isotope "${e.isotope}" Atoms must have a non-zero index!`);
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
        throw new On(`Check::isotopeU() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new An(`Check::isotopeU() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
        throw new Et();
      if (t.token !== "USER")
        throw new On(`Check::isotopeM() - "${t.token}" is not a valid Token slug for "${t.isotope}" isotope Atoms!`);
      const r = Nr.aggregateMeta(t.meta);
      for (const i of e) {
        let s = r[i];
        if (s) {
          s = JSON.parse(s);
          for (const [o, a] of Object.entries(s))
            if (!e.includes(o)) {
              if (!Object.keys(r).includes(o))
                throw new so(`${o} is missing from the meta.`);
              for (const c of a)
                if (!Y.isBundleHash(c) && !["all", "self"].includes(c))
                  throw new so(`${c} does not correspond to the format of the policy.`);
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
        throw new On(`Check::isotopeC() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new An(`Check::isotopeC() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
            throw new Et(`Check::isotopeT() - Required meta field "${i}" is missing!`);
      }
      for (const i of ["token"])
        if (!Object.prototype.hasOwnProperty.call(t, i) || !t[i])
          throw new Et(`Check::isotopeT() - Required meta field "${i}" is missing!`);
      if (e.token !== "USER")
        throw new On(`Check::isotopeT() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new An(`Check::isotopeT() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
          throw new Et("Check::isotopeR() - Mixing rules with politics!");
      }
      if (t.rule) {
        const r = JSON.parse(t.rule);
        if (!Array.isArray(r))
          throw new Et("Check::isotopeR() - Incorrect rule format!");
        for (const i of r)
          Gn.toObject(i);
        if (r.length < 1)
          throw new Et("Check::isotopeR() - No rules!");
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
        throw new ao();
      if (o.value < 0)
        throw new oo();
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
          throw new ao();
        if (o > 0) {
          if (s < 0)
            throw new oo();
          if (a.walletAddress === r.walletAddress)
            throw new rf();
        }
        i += s;
      }
    if (i !== s)
      throw new sf();
    if (e) {
      if (s = r.value * 1, Number.isNaN(s))
        throw new TypeError('Invalid isotope "V" values');
      const o = e.balance + s;
      if (o < 0)
        throw new lt();
      if (o !== i)
        throw new uo();
    } else if (s !== 0)
      throw new uo();
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
      throw new ef();
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
      (d) => d.otsFragment
    ).reduce(
      (d, y) => d + y
    );
    if (t.length !== 2048 && (t = al(t), t.length !== 2048))
      throw new Ha();
    const r = Rr(t, 128);
    let i = "";
    for (const d in r) {
      let y = r[d];
      for (let v = 0, E = 8 + e[d]; v < E; v++)
        y = new Ve("SHAKE256", "TEXT").update(y).getHash("HEX", { outputLen: 512 });
      i += y;
    }
    const s = new Ve("SHAKE256", "TEXT");
    s.update(i);
    const o = s.getHash("HEX", { outputLen: 8192 }), a = new Ve("SHAKE256", "TEXT");
    a.update(o);
    const c = a.getHash("HEX", { outputLen: 256 }), l = this.molecule.atoms[0];
    let u = l.walletAddress;
    const p = he.get(l.aggregatedMeta(), "signingWallet");
    if (p && (u = he.get(JSON.parse(p), "address")), c !== u)
      throw new nf();
    return !0;
  }
}
class Cn extends re {
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
class lo extends re {
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
class ft {
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
    this.status = null, this.molecularHash = null, this.createdAt = String(+/* @__PURE__ */ new Date()), this.cellSlugOrigin = this.cellSlug = s, this.secret = e, this.bundle = t, this.sourceWallet = r, this.atoms = [], o !== null && Object.prototype.hasOwnProperty.call(wr, o) && (this.version = String(o)), (i || r) && (this.remainderWallet = i || Y.create({
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
    const t = Object.assign(new ft({}), JSON.parse(e)), r = Object.keys(new ft({}));
    if (!Array.isArray(t.atoms))
      throw new jt();
    for (const i in Object.keys(t.atoms)) {
      t.atoms[i] = W.jsonToObject(JSON.stringify(t.atoms[i]));
      for (const s of ["position", "walletAddress", "isotope"])
        if (t.atoms[i].isotope.toLowerCase() !== "r" && (typeof t.atoms[i][s] > "u" || t.atoms[i][s] === null))
          throw new jt("MolecularStructure::jsonToObject() - Required Atom properties are missing!");
    }
    for (const i in t)
      Object.prototype.hasOwnProperty.call(t, i) && !r.includes(i) && delete t[i];
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
    return ft.isotopeFilter(e, this.atoms);
  }
  /**
   * Generates the next atomic index
   *
   * @return {number}
   */
  generateIndex() {
    return ft.generateNextAtomIndex(this.atoms);
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
    meta: r = {},
    policy: i = {}
  }) {
    const s = new Ue(r);
    s.addPolicy(i);
    const o = Y.create({
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
    const r = e.length;
    if (this.sourceWallet.balance - r < 0)
      throw new Cn();
    return this.addAtom(W.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -r
    })), this.addAtom(W.create({
      isotope: "F",
      wallet: t,
      value: 1,
      metaType: "walletBundle",
      metaId: t.bundle
    })), this.addAtom(W.create({
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
      throw new lo("Molecule::burnToken() - Amount to burn must be positive!");
    if (this.sourceWallet.balance - e < 0)
      throw new Cn();
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
      throw new lo("Molecule::replenishToken() - Amount to replenish must be positive!");
    if (t.length) {
      t = Y.getTokenUnits(t), this.remainderWallet.tokenUnits = this.sourceWallet.tokenUnits;
      for (const r of t)
        this.remainderWallet.tokenUnits.push(r);
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
      throw new Cn();
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
      throw new Cn();
    const r = Y.create({
      secret: this.secret,
      bundle: this.bundle,
      token: this.sourceWallet.token,
      batchId: this.sourceWallet.batchId
    });
    return r.tradeRates = t, this.addAtom(W.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -e
    })), this.addAtom(W.create({
      isotope: "B",
      wallet: r,
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
    let r = 0;
    for (const [s, o] of Object.entries(e || {}))
      r += o;
    if (this.sourceWallet.balance - r < 0)
      throw new Cn();
    const i = new Ue();
    t && i.setSigningWallet(t), this.addAtom(W.create({
      isotope: "B",
      wallet: this.sourceWallet,
      value: -r,
      meta: i,
      metaType: "walletBundle",
      metaId: this.sourceWallet.bundle
    }));
    for (const [s, o] of Object.entries(e || {}))
      this.addAtom(new W({
        isotope: "V",
        token: this.sourceWallet.token,
        value: o,
        batchId: this.sourceWallet.batchId ? Mr({}) : null,
        metaType: "walletBundle",
        metaId: s
      }));
    return this.addAtom(W.create({
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
    const i = new Ue(r);
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
    rule: r,
    policy: i = {}
  }) {
    const s = [];
    for (const a of r)
      s.push(a instanceof Gn ? a : Gn.toObject(a));
    const o = new Ue({
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
    t || (t = new Ue()), t.setMetaWallet(e);
    const r = W.create({
      isotope: "C",
      wallet: this.sourceWallet,
      metaType: "wallet",
      metaId: e.address,
      meta: t,
      batchId: e.batchId
    });
    return this.addAtom(r), this.addContinuIdAtom(), this;
  }
  /**
   * Init shadow wallet claim
   *
   * @param wallet
   */
  initShadowWalletClaim(e) {
    const t = new Ue().setShadowWalletClaim(!0);
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
      hash: fn(t.trim(), "Molecule::initIdentifierCreation")
    };
    return this.addAtom(W.create({
      isotope: "C",
      wallet: this.sourceWallet,
      metaType: "identifier",
      metaId: e,
      meta: new Ue(i)
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
    return this.addAtom(W.create({
      isotope: "M",
      wallet: this.sourceWallet,
      metaType: t,
      metaId: r,
      meta: new Ue(e)
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
    return s.token = e, this.local = 1, this.addAtom(W.create({
      isotope: "T",
      wallet: this.sourceWallet,
      value: t,
      metaType: r,
      metaId: i,
      meta: new Ue(s),
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
      meta: new Ue(e)
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
    if (this.atoms.length === 0 || this.atoms.filter((y) => !(y instanceof W)).length !== 0)
      throw new jt();
    !t && !this.bundle && (this.bundle = e || fn(this.secret, "Molecule::sign")), this.molecularHash = W.hashAtoms({
      atoms: this.atoms
    });
    const i = this.atoms[0];
    let s = i.position;
    const o = he.get(i.aggregatedMeta(), "signingWallet");
    if (o && (s = he.get(JSON.parse(o), "position")), !s)
      throw new Ha("Signing wallet must have a position!");
    const a = Y.generateKey({
      secret: this.secret,
      token: i.token,
      position: i.position
    }), c = Rr(a, 128), l = this.normalizedHash();
    let u = "";
    for (const y in c) {
      let v = c[y];
      for (let E = 0, w = 8 - l[y]; E < w; E++)
        v = new Ve("SHAKE256", "TEXT").update(v).getHash("HEX", { outputLen: 512 });
      u += v;
    }
    r && (u = ol(u));
    const p = Rr(u, Math.ceil(u.length / this.atoms.length));
    let d = null;
    for (let y = 0, v = p.length; y < v; y++)
      this.atoms[y].otsFragment = p[y], d = this.atoms[y].position;
    return d;
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
    const e = Pa(this);
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
    new of(this).verify(e);
  }
  /**
   * Convert Hm to numeric notation via EnumerateMolecule(Hm)
   *
   * @returns {Array}
   */
  normalizedHash() {
    return ft.normalize(ft.enumerate(this.molecularHash));
  }
}
const hi = 10 ** 18;
class on {
  /**
   * @param {number} value
   * @return {number}
   */
  static val(e) {
    return Math.abs(e * hi) < 1 ? 0 : e;
  }
  /**
   * @param {number} value1
   * @param {number} value2
   * @param {boolean} debug
   * @return {number}
   */
  static cmp(e, t, r = !1) {
    const i = on.val(e) * hi, s = on.val(t) * hi;
    return Math.abs(i - s) < 1 ? 0 : i > s ? 1 : -1;
  }
  /**
   * @param {number} value1
   * @param {number} value2
   * @return {boolean}
   */
  static equal(e, t) {
    return on.cmp(e, t) === 0;
  }
}
class Jn {
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
    const r = new Jn(e);
    return r.setWallet(t), r;
  }
  /**
   *
   * @param {object} snapshot
   * @param {string} secret
   * @return {AuthToken}
   */
  static restore(e, t) {
    const r = new Y({
      secret: t,
      token: "AUTH",
      position: e.wallet.position,
      characters: e.wallet.characters
    });
    return Jn.create({
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
class jn extends re {
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
class Mi extends re {
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
      throw new jn();
    if (he.has(this.$__response, this.errorKey)) {
      const i = he.get(this.$__response, this.errorKey);
      throw String(i).includes("Unauthenticated") ? new Mi() : new jn();
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
      throw new jn();
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
      throw new Qe("Query::createQuery() - Node URI was not initialized for this client instance!");
    if (this.$__query === null)
      throw new Qe("Query::createQuery() - GraphQL subscription was not initialized!");
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
class af extends be {
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
    return t && (e = new Y({
      secret: null,
      token: t.tokenSlug
    }), e.address = t.address, e.position = t.position, e.bundle = t.bundleHash, e.batchId = t.batchId, e.characters = t.characters, e.pubkey = t.pubkey, e.balance = t.amount * 1), e;
  }
}
var Di = function(n, e) {
  return Di = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, r) {
    t.__proto__ = r;
  } || function(t, r) {
    for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (t[i] = r[i]);
  }, Di(n, e);
};
function He(n, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Di(n, e);
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
function it(n, e) {
  var t = {};
  for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && e.indexOf(r) < 0 && (t[r] = n[r]);
  if (n != null && typeof Object.getOwnPropertySymbols == "function")
    for (var i = 0, r = Object.getOwnPropertySymbols(n); i < r.length; i++)
      e.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(n, r[i]) && (t[r[i]] = n[r[i]]);
  return t;
}
function _t(n, e, t, r) {
  function i(s) {
    return s instanceof t ? s : new t(function(o) {
      o(s);
    });
  }
  return new (t || (t = Promise))(function(s, o) {
    function a(u) {
      try {
        l(r.next(u));
      } catch (p) {
        o(p);
      }
    }
    function c(u) {
      try {
        l(r.throw(u));
      } catch (p) {
        o(p);
      }
    }
    function l(u) {
      u.done ? s(u.value) : i(u.value).then(a, c);
    }
    l((r = r.apply(n, e || [])).next());
  });
}
function St(n, e) {
  var t = { label: 0, sent: function() {
    if (s[0] & 1) throw s[1];
    return s[1];
  }, trys: [], ops: [] }, r, i, s, o;
  return o = { next: a(0), throw: a(1), return: a(2) }, typeof Symbol == "function" && (o[Symbol.iterator] = function() {
    return this;
  }), o;
  function a(l) {
    return function(u) {
      return c([l, u]);
    };
  }
  function c(l) {
    if (r) throw new TypeError("Generator is already executing.");
    for (; o && (o = 0, l[0] && (t = 0)), t; ) try {
      if (r = 1, i && (s = l[0] & 2 ? i.return : l[0] ? i.throw || ((s = i.return) && s.call(i), 0) : i.next) && !(s = s.call(i, l[1])).done) return s;
      switch (i = 0, s && (l = [l[0] & 2, s.value]), l[0]) {
        case 0:
        case 1:
          s = l;
          break;
        case 4:
          return t.label++, { value: l[1], done: !1 };
        case 5:
          t.label++, i = l[1], l = [0];
          continue;
        case 7:
          l = t.ops.pop(), t.trys.pop();
          continue;
        default:
          if (s = t.trys, !(s = s.length > 0 && s[s.length - 1]) && (l[0] === 6 || l[0] === 2)) {
            t = 0;
            continue;
          }
          if (l[0] === 3 && (!s || l[1] > s[0] && l[1] < s[3])) {
            t.label = l[1];
            break;
          }
          if (l[0] === 6 && t.label < s[1]) {
            t.label = s[1], s = l;
            break;
          }
          if (s && t.label < s[2]) {
            t.label = s[2], t.ops.push(l);
            break;
          }
          s[2] && t.ops.pop(), t.trys.pop();
          continue;
      }
      l = e.call(n, t);
    } catch (u) {
      l = [6, u], i = 0;
    } finally {
      r = s = 0;
    }
    if (l[0] & 5) throw l[1];
    return { value: l[0] ? l[1] : void 0, done: !0 };
  }
}
function Me(n, e, t) {
  if (t || arguments.length === 2) for (var r = 0, i = e.length, s; r < i; r++)
    (s || !(r in e)) && (s || (s = Array.prototype.slice.call(e, 0, r)), s[r] = e[r]);
  return n.concat(s || Array.prototype.slice.call(e));
}
var di = "Invariant Violation", fo = Object.setPrototypeOf, uf = fo === void 0 ? function(n, e) {
  return n.__proto__ = e, n;
} : fo, Wa = (
  /** @class */
  function(n) {
    He(e, n);
    function e(t) {
      t === void 0 && (t = di);
      var r = n.call(this, typeof t == "number" ? di + ": " + t + " (see https://github.com/apollographql/invariant-packages)" : t) || this;
      return r.framesToPop = 1, r.name = di, uf(r, e.prototype), r;
    }
    return e;
  }(Error)
);
function Xt(n, e) {
  if (!n)
    throw new Wa(e);
}
var za = ["debug", "log", "warn", "error", "silent"], cf = za.indexOf("log");
function dr(n) {
  return function() {
    if (za.indexOf(n) >= cf) {
      var e = console[n] || console.log;
      return e.apply(console, arguments);
    }
  };
}
(function(n) {
  n.debug = dr("debug"), n.log = dr("log"), n.warn = dr("warn"), n.error = dr("error");
})(Xt);
var cs = "3.12.8";
function Ye(n) {
  try {
    return n();
  } catch {
  }
}
const Fi = Ye(function() {
  return globalThis;
}) || Ye(function() {
  return window;
}) || Ye(function() {
  return self;
}) || Ye(function() {
  return rt;
}) || // We don't expect the Function constructor ever to be invoked at runtime, as
// long as at least one of globalThis, window, self, or global is defined, so
// we are under no obligation to make it easy for static analysis tools to
// detect syntactic usage of the Function constructor. If you think you can
// improve your static analysis to detect this obfuscation, think again. This
// is an arms race you cannot win, at least not in JavaScript.
Ye(function() {
  return Ye.constructor("return this")();
});
var ho = /* @__PURE__ */ new Map();
function Bi(n) {
  var e = ho.get(n) || 1;
  return ho.set(n, e + 1), "".concat(n, ":").concat(e, ":").concat(Math.random().toString(36).slice(2));
}
function Ka(n, e) {
  e === void 0 && (e = 0);
  var t = Bi("stringifyForDisplay");
  return JSON.stringify(n, function(r, i) {
    return i === void 0 ? t : i;
  }, e).split(JSON.stringify(t)).join("<undefined>");
}
function pr(n) {
  return function(e) {
    for (var t = [], r = 1; r < arguments.length; r++)
      t[r - 1] = arguments[r];
    if (typeof e == "number") {
      var i = e;
      e = ls(i), e || (e = fs(i, t), t = []);
    }
    n.apply(void 0, [e].concat(t));
  };
}
var $ = Object.assign(function(e, t) {
  for (var r = [], i = 2; i < arguments.length; i++)
    r[i - 2] = arguments[i];
  e || Xt(e, ls(t, r) || fs(t, r));
}, {
  debug: pr(Xt.debug),
  log: pr(Xt.log),
  warn: pr(Xt.warn),
  error: pr(Xt.error)
});
function Fe(n) {
  for (var e = [], t = 1; t < arguments.length; t++)
    e[t - 1] = arguments[t];
  return new Wa(ls(n, e) || fs(n, e));
}
var po = Symbol.for("ApolloErrorMessageHandler_" + cs);
function Ga(n) {
  if (typeof n == "string")
    return n;
  try {
    return Ka(n, 2).slice(0, 1e3);
  } catch {
    return "<non-serializable>";
  }
}
function ls(n, e) {
  if (e === void 0 && (e = []), !!n)
    return Fi[po] && Fi[po](n, e.map(Ga));
}
function fs(n, e) {
  if (e === void 0 && (e = []), !!n)
    return "An error occurred! For more details, see the full error text at https://go.apollo.dev/c/err#".concat(encodeURIComponent(JSON.stringify({
      version: cs,
      message: n,
      args: e.map(Ga)
    })));
}
function Sr(n, e) {
  if (!!!n)
    throw new Error(e);
}
function lf(n) {
  return typeof n == "object" && n !== null;
}
function ff(n, e) {
  if (!!!n)
    throw new Error(
      "Unexpected invariant triggered."
    );
}
const hf = /\r\n|[\n\r]/g;
function Pi(n, e) {
  let t = 0, r = 1;
  for (const i of n.body.matchAll(hf)) {
    if (typeof i.index == "number" || ff(!1), i.index >= e)
      break;
    t = i.index + i[0].length, r += 1;
  }
  return {
    line: r,
    column: e + 1 - t
  };
}
function df(n) {
  return Ja(
    n.source,
    Pi(n.source, n.start)
  );
}
function Ja(n, e) {
  const t = n.locationOffset.column - 1, r = "".padStart(t) + n.body, i = e.line - 1, s = n.locationOffset.line - 1, o = e.line + s, a = e.line === 1 ? t : 0, c = e.column + a, l = `${n.name}:${o}:${c}
`, u = r.split(/\r\n|[\n\r]/g), p = u[i];
  if (p.length > 120) {
    const d = Math.floor(c / 80), y = c % 80, v = [];
    for (let E = 0; E < p.length; E += 80)
      v.push(p.slice(E, E + 80));
    return l + yo([
      [`${o} |`, v[0]],
      ...v.slice(1, d + 1).map((E) => ["|", E]),
      ["|", "^".padStart(y)],
      ["|", v[d + 1]]
    ]);
  }
  return l + yo([
    // Lines specified like this: ["prefix", "string"],
    [`${o - 1} |`, u[i - 1]],
    [`${o} |`, p],
    ["|", "^".padStart(c)],
    [`${o + 1} |`, u[i + 1]]
  ]);
}
function yo(n) {
  const e = n.filter(([r, i]) => i !== void 0), t = Math.max(...e.map(([r]) => r.length));
  return e.map(([r, i]) => r.padStart(t) + (i ? " " + i : "")).join(`
`);
}
function pf(n) {
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
    var r, i, s;
    const { nodes: o, source: a, positions: c, path: l, originalError: u, extensions: p } = pf(t);
    super(e), this.name = "GraphQLError", this.path = l ?? void 0, this.originalError = u ?? void 0, this.nodes = mo(
      Array.isArray(o) ? o : o ? [o] : void 0
    );
    const d = mo(
      (r = this.nodes) === null || r === void 0 ? void 0 : r.map((v) => v.loc).filter((v) => v != null)
    );
    this.source = a ?? (d == null || (i = d[0]) === null || i === void 0 ? void 0 : i.source), this.positions = c ?? d?.map((v) => v.start), this.locations = c && a ? c.map((v) => Pi(a, v)) : d?.map((v) => Pi(v.source, v.start));
    const y = lf(
      u?.extensions
    ) ? u?.extensions : void 0;
    this.extensions = (s = p ?? y) !== null && s !== void 0 ? s : /* @__PURE__ */ Object.create(null), Object.defineProperties(this, {
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

` + df(t.loc));
    else if (this.source && this.locations)
      for (const t of this.locations)
        e += `

` + Ja(this.source, t);
    return e;
  }
  toJSON() {
    const e = {
      message: this.message
    };
    return this.locations != null && (e.locations = this.locations), this.path != null && (e.path = this.path), this.extensions != null && Object.keys(this.extensions).length > 0 && (e.extensions = this.extensions), e;
  }
}
function mo(n) {
  return n === void 0 || n.length === 0 ? void 0 : n;
}
function xe(n, e, t) {
  return new hs(`Syntax Error: ${t}`, {
    source: n,
    positions: [e]
  });
}
class yf {
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
class Ya {
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
const Xa = {
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
}, mf = new Set(Object.keys(Xa));
function go(n) {
  const e = n?.kind;
  return typeof e == "string" && mf.has(e);
}
var tn;
(function(n) {
  n.QUERY = "query", n.MUTATION = "mutation", n.SUBSCRIPTION = "subscription";
})(tn || (tn = {}));
var $i;
(function(n) {
  n.QUERY = "QUERY", n.MUTATION = "MUTATION", n.SUBSCRIPTION = "SUBSCRIPTION", n.FIELD = "FIELD", n.FRAGMENT_DEFINITION = "FRAGMENT_DEFINITION", n.FRAGMENT_SPREAD = "FRAGMENT_SPREAD", n.INLINE_FRAGMENT = "INLINE_FRAGMENT", n.VARIABLE_DEFINITION = "VARIABLE_DEFINITION", n.SCHEMA = "SCHEMA", n.SCALAR = "SCALAR", n.OBJECT = "OBJECT", n.FIELD_DEFINITION = "FIELD_DEFINITION", n.ARGUMENT_DEFINITION = "ARGUMENT_DEFINITION", n.INTERFACE = "INTERFACE", n.UNION = "UNION", n.ENUM = "ENUM", n.ENUM_VALUE = "ENUM_VALUE", n.INPUT_OBJECT = "INPUT_OBJECT", n.INPUT_FIELD_DEFINITION = "INPUT_FIELD_DEFINITION";
})($i || ($i = {}));
var D;
(function(n) {
  n.NAME = "Name", n.DOCUMENT = "Document", n.OPERATION_DEFINITION = "OperationDefinition", n.VARIABLE_DEFINITION = "VariableDefinition", n.SELECTION_SET = "SelectionSet", n.FIELD = "Field", n.ARGUMENT = "Argument", n.FRAGMENT_SPREAD = "FragmentSpread", n.INLINE_FRAGMENT = "InlineFragment", n.FRAGMENT_DEFINITION = "FragmentDefinition", n.VARIABLE = "Variable", n.INT = "IntValue", n.FLOAT = "FloatValue", n.STRING = "StringValue", n.BOOLEAN = "BooleanValue", n.NULL = "NullValue", n.ENUM = "EnumValue", n.LIST = "ListValue", n.OBJECT = "ObjectValue", n.OBJECT_FIELD = "ObjectField", n.DIRECTIVE = "Directive", n.NAMED_TYPE = "NamedType", n.LIST_TYPE = "ListType", n.NON_NULL_TYPE = "NonNullType", n.SCHEMA_DEFINITION = "SchemaDefinition", n.OPERATION_TYPE_DEFINITION = "OperationTypeDefinition", n.SCALAR_TYPE_DEFINITION = "ScalarTypeDefinition", n.OBJECT_TYPE_DEFINITION = "ObjectTypeDefinition", n.FIELD_DEFINITION = "FieldDefinition", n.INPUT_VALUE_DEFINITION = "InputValueDefinition", n.INTERFACE_TYPE_DEFINITION = "InterfaceTypeDefinition", n.UNION_TYPE_DEFINITION = "UnionTypeDefinition", n.ENUM_TYPE_DEFINITION = "EnumTypeDefinition", n.ENUM_VALUE_DEFINITION = "EnumValueDefinition", n.INPUT_OBJECT_TYPE_DEFINITION = "InputObjectTypeDefinition", n.DIRECTIVE_DEFINITION = "DirectiveDefinition", n.SCHEMA_EXTENSION = "SchemaExtension", n.SCALAR_TYPE_EXTENSION = "ScalarTypeExtension", n.OBJECT_TYPE_EXTENSION = "ObjectTypeExtension", n.INTERFACE_TYPE_EXTENSION = "InterfaceTypeExtension", n.UNION_TYPE_EXTENSION = "UnionTypeExtension", n.ENUM_TYPE_EXTENSION = "EnumTypeExtension", n.INPUT_OBJECT_TYPE_EXTENSION = "InputObjectTypeExtension";
})(D || (D = {}));
function Li(n) {
  return n === 9 || n === 32;
}
function Yn(n) {
  return n >= 48 && n <= 57;
}
function Za(n) {
  return n >= 97 && n <= 122 || // A-Z
  n >= 65 && n <= 90;
}
function eu(n) {
  return Za(n) || n === 95;
}
function gf(n) {
  return Za(n) || Yn(n) || n === 95;
}
function vf(n) {
  var e;
  let t = Number.MAX_SAFE_INTEGER, r = null, i = -1;
  for (let o = 0; o < n.length; ++o) {
    var s;
    const a = n[o], c = bf(a);
    c !== a.length && (r = (s = r) !== null && s !== void 0 ? s : o, i = o, o !== 0 && c < t && (t = c));
  }
  return n.map((o, a) => a === 0 ? o : o.slice(t)).slice(
    (e = r) !== null && e !== void 0 ? e : 0,
    i + 1
  );
}
function bf(n) {
  let e = 0;
  for (; e < n.length && Li(n.charCodeAt(e)); )
    ++e;
  return e;
}
function wf(n, e) {
  const t = n.replace(/"""/g, '\\"""'), r = t.split(/\r\n|[\n\r]/g), i = r.length === 1, s = r.length > 1 && r.slice(1).every((y) => y.length === 0 || Li(y.charCodeAt(0))), o = t.endsWith('\\"""'), a = n.endsWith('"') && !o, c = n.endsWith("\\"), l = a || c, u = (
    // add leading and trailing new lines only if it improves readability
    !i || n.length > 70 || l || s || o
  );
  let p = "";
  const d = i && Li(n.charCodeAt(0));
  return (u && !d || s) && (p += `
`), p += t, (u || l) && (p += `
`), '"""' + p + '"""';
}
var N;
(function(n) {
  n.SOF = "<SOF>", n.EOF = "<EOF>", n.BANG = "!", n.DOLLAR = "$", n.AMP = "&", n.PAREN_L = "(", n.PAREN_R = ")", n.SPREAD = "...", n.COLON = ":", n.EQUALS = "=", n.AT = "@", n.BRACKET_L = "[", n.BRACKET_R = "]", n.BRACE_L = "{", n.PIPE = "|", n.BRACE_R = "}", n.NAME = "Name", n.INT = "Int", n.FLOAT = "Float", n.STRING = "String", n.BLOCK_STRING = "BlockString", n.COMMENT = "Comment";
})(N || (N = {}));
class Ef {
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
    const t = new Ya(N.SOF, 0, 0, 0, 0);
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
          const t = Sf(this, e.end);
          e.next = t, t.prev = e, e = t;
        }
      while (e.kind === N.COMMENT);
    return e;
  }
}
function _f(n) {
  return n === N.BANG || n === N.DOLLAR || n === N.AMP || n === N.PAREN_L || n === N.PAREN_R || n === N.SPREAD || n === N.COLON || n === N.EQUALS || n === N.AT || n === N.BRACKET_L || n === N.BRACKET_R || n === N.BRACE_L || n === N.PIPE || n === N.BRACE_R;
}
function gn(n) {
  return n >= 0 && n <= 55295 || n >= 57344 && n <= 1114111;
}
function Qr(n, e) {
  return tu(n.charCodeAt(e)) && nu(n.charCodeAt(e + 1));
}
function tu(n) {
  return n >= 55296 && n <= 56319;
}
function nu(n) {
  return n >= 56320 && n <= 57343;
}
function Vt(n, e) {
  const t = n.source.body.codePointAt(e);
  if (t === void 0)
    return N.EOF;
  if (t >= 32 && t <= 126) {
    const r = String.fromCodePoint(t);
    return r === '"' ? `'"'` : `"${r}"`;
  }
  return "U+" + t.toString(16).toUpperCase().padStart(4, "0");
}
function ge(n, e, t, r, i) {
  const s = n.line, o = 1 + t - n.lineStart;
  return new Ya(e, t, r, s, o, i);
}
function Sf(n, e) {
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
        return kf(n, i);
      case 33:
        return ge(n, N.BANG, i, i + 1);
      case 36:
        return ge(n, N.DOLLAR, i, i + 1);
      case 38:
        return ge(n, N.AMP, i, i + 1);
      case 40:
        return ge(n, N.PAREN_L, i, i + 1);
      case 41:
        return ge(n, N.PAREN_R, i, i + 1);
      case 46:
        if (t.charCodeAt(i + 1) === 46 && t.charCodeAt(i + 2) === 46)
          return ge(n, N.SPREAD, i, i + 3);
        break;
      case 58:
        return ge(n, N.COLON, i, i + 1);
      case 61:
        return ge(n, N.EQUALS, i, i + 1);
      case 64:
        return ge(n, N.AT, i, i + 1);
      case 91:
        return ge(n, N.BRACKET_L, i, i + 1);
      case 93:
        return ge(n, N.BRACKET_R, i, i + 1);
      case 123:
        return ge(n, N.BRACE_L, i, i + 1);
      case 124:
        return ge(n, N.PIPE, i, i + 1);
      case 125:
        return ge(n, N.BRACE_R, i, i + 1);
      case 34:
        return t.charCodeAt(i + 1) === 34 && t.charCodeAt(i + 2) === 34 ? Cf(n, i) : Tf(n, i);
    }
    if (Yn(s) || s === 45)
      return xf(n, i, s);
    if (eu(s))
      return Rf(n, i);
    throw xe(
      n.source,
      i,
      s === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : gn(s) || Qr(t, i) ? `Unexpected character: ${Vt(n, i)}.` : `Invalid character: ${Vt(n, i)}.`
    );
  }
  return ge(n, N.EOF, r, r);
}
function kf(n, e) {
  const t = n.source.body, r = t.length;
  let i = e + 1;
  for (; i < r; ) {
    const s = t.charCodeAt(i);
    if (s === 10 || s === 13)
      break;
    if (gn(s))
      ++i;
    else if (Qr(t, i))
      i += 2;
    else
      break;
  }
  return ge(
    n,
    N.COMMENT,
    e,
    i,
    t.slice(e + 1, i)
  );
}
function xf(n, e, t) {
  const r = n.source.body;
  let i = e, s = t, o = !1;
  if (s === 45 && (s = r.charCodeAt(++i)), s === 48) {
    if (s = r.charCodeAt(++i), Yn(s))
      throw xe(
        n.source,
        i,
        `Invalid number, unexpected digit after 0: ${Vt(
          n,
          i
        )}.`
      );
  } else
    i = pi(n, i, s), s = r.charCodeAt(i);
  if (s === 46 && (o = !0, s = r.charCodeAt(++i), i = pi(n, i, s), s = r.charCodeAt(i)), (s === 69 || s === 101) && (o = !0, s = r.charCodeAt(++i), (s === 43 || s === 45) && (s = r.charCodeAt(++i)), i = pi(n, i, s), s = r.charCodeAt(i)), s === 46 || eu(s))
    throw xe(
      n.source,
      i,
      `Invalid number, expected digit but got: ${Vt(
        n,
        i
      )}.`
    );
  return ge(
    n,
    o ? N.FLOAT : N.INT,
    e,
    i,
    r.slice(e, i)
  );
}
function pi(n, e, t) {
  if (!Yn(t))
    throw xe(
      n.source,
      e,
      `Invalid number, expected digit but got: ${Vt(
        n,
        e
      )}.`
    );
  const r = n.source.body;
  let i = e + 1;
  for (; Yn(r.charCodeAt(i)); )
    ++i;
  return i;
}
function Tf(n, e) {
  const t = n.source.body, r = t.length;
  let i = e + 1, s = i, o = "";
  for (; i < r; ) {
    const a = t.charCodeAt(i);
    if (a === 34)
      return o += t.slice(s, i), ge(n, N.STRING, e, i + 1, o);
    if (a === 92) {
      o += t.slice(s, i);
      const c = t.charCodeAt(i + 1) === 117 ? t.charCodeAt(i + 2) === 123 ? If(n, i) : Af(n, i) : Of(n, i);
      o += c.value, i += c.size, s = i;
      continue;
    }
    if (a === 10 || a === 13)
      break;
    if (gn(a))
      ++i;
    else if (Qr(t, i))
      i += 2;
    else
      throw xe(
        n.source,
        i,
        `Invalid character within String: ${Vt(
          n,
          i
        )}.`
      );
  }
  throw xe(n.source, i, "Unterminated string.");
}
function If(n, e) {
  const t = n.source.body;
  let r = 0, i = 3;
  for (; i < 12; ) {
    const s = t.charCodeAt(e + i++);
    if (s === 125) {
      if (i < 5 || !gn(r))
        break;
      return {
        value: String.fromCodePoint(r),
        size: i
      };
    }
    if (r = r << 4 | $n(s), r < 0)
      break;
  }
  throw xe(
    n.source,
    e,
    `Invalid Unicode escape sequence: "${t.slice(
      e,
      e + i
    )}".`
  );
}
function Af(n, e) {
  const t = n.source.body, r = vo(t, e + 2);
  if (gn(r))
    return {
      value: String.fromCodePoint(r),
      size: 6
    };
  if (tu(r) && t.charCodeAt(e + 6) === 92 && t.charCodeAt(e + 7) === 117) {
    const i = vo(t, e + 8);
    if (nu(i))
      return {
        value: String.fromCodePoint(r, i),
        size: 12
      };
  }
  throw xe(
    n.source,
    e,
    `Invalid Unicode escape sequence: "${t.slice(e, e + 6)}".`
  );
}
function vo(n, e) {
  return $n(n.charCodeAt(e)) << 12 | $n(n.charCodeAt(e + 1)) << 8 | $n(n.charCodeAt(e + 2)) << 4 | $n(n.charCodeAt(e + 3));
}
function $n(n) {
  return n >= 48 && n <= 57 ? n - 48 : n >= 65 && n <= 70 ? n - 55 : n >= 97 && n <= 102 ? n - 87 : -1;
}
function Of(n, e) {
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
  throw xe(
    n.source,
    e,
    `Invalid character escape sequence: "${t.slice(
      e,
      e + 2
    )}".`
  );
}
function Cf(n, e) {
  const t = n.source.body, r = t.length;
  let i = n.lineStart, s = e + 3, o = s, a = "";
  const c = [];
  for (; s < r; ) {
    const l = t.charCodeAt(s);
    if (l === 34 && t.charCodeAt(s + 1) === 34 && t.charCodeAt(s + 2) === 34) {
      a += t.slice(o, s), c.push(a);
      const u = ge(
        n,
        N.BLOCK_STRING,
        e,
        s + 3,
        // Return a string of the lines joined with U+000A.
        vf(c).join(`
`)
      );
      return n.line += c.length - 1, n.lineStart = i, u;
    }
    if (l === 92 && t.charCodeAt(s + 1) === 34 && t.charCodeAt(s + 2) === 34 && t.charCodeAt(s + 3) === 34) {
      a += t.slice(o, s), o = s + 1, s += 4;
      continue;
    }
    if (l === 10 || l === 13) {
      a += t.slice(o, s), c.push(a), l === 13 && t.charCodeAt(s + 1) === 10 ? s += 2 : ++s, a = "", o = s, i = s;
      continue;
    }
    if (gn(l))
      ++s;
    else if (Qr(t, s))
      s += 2;
    else
      throw xe(
        n.source,
        s,
        `Invalid character within String: ${Vt(
          n,
          s
        )}.`
      );
  }
  throw xe(n.source, s, "Unterminated string.");
}
function Rf(n, e) {
  const t = n.source.body, r = t.length;
  let i = e + 1;
  for (; i < r; ) {
    const s = t.charCodeAt(i);
    if (gf(s))
      ++i;
    else
      break;
  }
  return ge(
    n,
    N.NAME,
    e,
    i,
    t.slice(e, i)
  );
}
const Nf = 10, ru = 2;
function ds(n) {
  return Hr(n, []);
}
function Hr(n, e) {
  switch (typeof n) {
    case "string":
      return JSON.stringify(n);
    case "function":
      return n.name ? `[function ${n.name}]` : "[function]";
    case "object":
      return Mf(n, e);
    default:
      return String(n);
  }
}
function Mf(n, e) {
  if (n === null)
    return "null";
  if (e.includes(n))
    return "[Circular]";
  const t = [...e, n];
  if (Df(n)) {
    const r = n.toJSON();
    if (r !== n)
      return typeof r == "string" ? r : Hr(r, t);
  } else if (Array.isArray(n))
    return Bf(n, t);
  return Ff(n, t);
}
function Df(n) {
  return typeof n.toJSON == "function";
}
function Ff(n, e) {
  const t = Object.entries(n);
  return t.length === 0 ? "{}" : e.length > ru ? "[" + Pf(n) + "]" : "{ " + t.map(
    ([i, s]) => i + ": " + Hr(s, e)
  ).join(", ") + " }";
}
function Bf(n, e) {
  if (n.length === 0)
    return "[]";
  if (e.length > ru)
    return "[Array]";
  const t = Math.min(Nf, n.length), r = n.length - t, i = [];
  for (let s = 0; s < t; ++s)
    i.push(Hr(n[s], e));
  return r === 1 ? i.push("... 1 more item") : r > 1 && i.push(`... ${r} more items`), "[" + i.join(", ") + "]";
}
function Pf(n) {
  const e = Object.prototype.toString.call(n).replace(/^\[object /, "").replace(/]$/, "");
  if (e === "Object" && typeof n.constructor == "function") {
    const t = n.constructor.name;
    if (typeof t == "string" && t !== "")
      return t;
  }
  return e;
}
const $f = (
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
        const o = ds(e);
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
class iu {
  constructor(e, t = "GraphQL request", r = {
    line: 1,
    column: 1
  }) {
    typeof e == "string" || Sr(!1, `Body must be a string. Received: ${ds(e)}.`), this.body = e, this.name = t, this.locationOffset = r, this.locationOffset.line > 0 || Sr(
      !1,
      "line in locationOffset is 1-indexed and must be positive."
    ), this.locationOffset.column > 0 || Sr(
      !1,
      "column in locationOffset is 1-indexed and must be positive."
    );
  }
  get [Symbol.toStringTag]() {
    return "Source";
  }
}
function Lf(n) {
  return $f(n, iu);
}
function Uf(n, e) {
  const t = new qf(n, e), r = t.parseDocument();
  return Object.defineProperty(r, "tokenCount", {
    enumerable: !1,
    value: t.tokenCount
  }), r;
}
class qf {
  constructor(e, t = {}) {
    const r = Lf(e) ? e : new iu(e);
    this._lexer = new Ef(r), this._options = t, this._tokenCounter = 0;
  }
  get tokenCount() {
    return this._tokenCounter;
  }
  /**
   * Converts a name lex token into a name parse node.
   */
  parseName() {
    const e = this.expectToken(N.NAME);
    return this.node(e, {
      kind: D.NAME,
      value: e.value
    });
  }
  // Implements the parsing rules in the Document section.
  /**
   * Document : Definition+
   */
  parseDocument() {
    return this.node(this._lexer.token, {
      kind: D.DOCUMENT,
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
        throw xe(
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
        kind: D.OPERATION_DEFINITION,
        operation: tn.QUERY,
        name: void 0,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet()
      });
    const t = this.parseOperationType();
    let r;
    return this.peek(N.NAME) && (r = this.parseName()), this.node(e, {
      kind: D.OPERATION_DEFINITION,
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
    const e = this.expectToken(N.NAME);
    switch (e.value) {
      case "query":
        return tn.QUERY;
      case "mutation":
        return tn.MUTATION;
      case "subscription":
        return tn.SUBSCRIPTION;
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
      kind: D.VARIABLE_DEFINITION,
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
      kind: D.VARIABLE,
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
      kind: D.SELECTION_SET,
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
    let r, i;
    return this.expectOptionalToken(N.COLON) ? (r = t, i = this.parseName()) : i = t, this.node(e, {
      kind: D.FIELD,
      alias: r,
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
    const t = this._lexer.token, r = this.parseName();
    return this.expectToken(N.COLON), this.node(t, {
      kind: D.ARGUMENT,
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
    this.expectToken(N.SPREAD);
    const t = this.expectOptionalKeyword("on");
    return !t && this.peek(N.NAME) ? this.node(e, {
      kind: D.FRAGMENT_SPREAD,
      name: this.parseFragmentName(),
      directives: this.parseDirectives(!1)
    }) : this.node(e, {
      kind: D.INLINE_FRAGMENT,
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
      kind: D.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      variableDefinitions: this.parseVariableDefinitions(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    }) : this.node(e, {
      kind: D.FRAGMENT_DEFINITION,
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
          kind: D.INT,
          value: t.value
        });
      case N.FLOAT:
        return this.advanceLexer(), this.node(t, {
          kind: D.FLOAT,
          value: t.value
        });
      case N.STRING:
      case N.BLOCK_STRING:
        return this.parseStringLiteral();
      case N.NAME:
        switch (this.advanceLexer(), t.value) {
          case "true":
            return this.node(t, {
              kind: D.BOOLEAN,
              value: !0
            });
          case "false":
            return this.node(t, {
              kind: D.BOOLEAN,
              value: !1
            });
          case "null":
            return this.node(t, {
              kind: D.NULL
            });
          default:
            return this.node(t, {
              kind: D.ENUM,
              value: t.value
            });
        }
      case N.DOLLAR:
        if (e)
          if (this.expectToken(N.DOLLAR), this._lexer.token.kind === N.NAME) {
            const r = this._lexer.token.value;
            throw xe(
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
      kind: D.STRING,
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
      kind: D.LIST,
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
      kind: D.OBJECT,
      fields: this.any(N.BRACE_L, t, N.BRACE_R)
    });
  }
  /**
   * ObjectField[Const] : Name : Value[?Const]
   */
  parseObjectField(e) {
    const t = this._lexer.token, r = this.parseName();
    return this.expectToken(N.COLON), this.node(t, {
      kind: D.OBJECT_FIELD,
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
      kind: D.DIRECTIVE,
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
      const r = this.parseTypeReference();
      this.expectToken(N.BRACKET_R), t = this.node(e, {
        kind: D.LIST_TYPE,
        type: r
      });
    } else
      t = this.parseNamedType();
    return this.expectOptionalToken(N.BANG) ? this.node(e, {
      kind: D.NON_NULL_TYPE,
      type: t
    }) : t;
  }
  /**
   * NamedType : Name
   */
  parseNamedType() {
    return this.node(this._lexer.token, {
      kind: D.NAMED_TYPE,
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
    const r = this.parseConstDirectives(), i = this.many(
      N.BRACE_L,
      this.parseOperationTypeDefinition,
      N.BRACE_R
    );
    return this.node(e, {
      kind: D.SCHEMA_DEFINITION,
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
    this.expectToken(N.COLON);
    const r = this.parseNamedType();
    return this.node(e, {
      kind: D.OPERATION_TYPE_DEFINITION,
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
      kind: D.SCALAR_TYPE_DEFINITION,
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
      kind: D.OBJECT_TYPE_DEFINITION,
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
    const e = this._lexer.token, t = this.parseDescription(), r = this.parseName(), i = this.parseArgumentDefs();
    this.expectToken(N.COLON);
    const s = this.parseTypeReference(), o = this.parseConstDirectives();
    return this.node(e, {
      kind: D.FIELD_DEFINITION,
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
    const e = this._lexer.token, t = this.parseDescription(), r = this.parseName();
    this.expectToken(N.COLON);
    const i = this.parseTypeReference();
    let s;
    this.expectOptionalToken(N.EQUALS) && (s = this.parseConstValueLiteral());
    const o = this.parseConstDirectives();
    return this.node(e, {
      kind: D.INPUT_VALUE_DEFINITION,
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
      kind: D.INTERFACE_TYPE_DEFINITION,
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
      kind: D.UNION_TYPE_DEFINITION,
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
    return this.expectOptionalToken(N.EQUALS) ? this.delimitedMany(N.PIPE, this.parseNamedType) : [];
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
      kind: D.ENUM_TYPE_DEFINITION,
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
      N.BRACE_L,
      this.parseEnumValueDefinition,
      N.BRACE_R
    );
  }
  /**
   * EnumValueDefinition : Description? EnumValue Directives[Const]?
   */
  parseEnumValueDefinition() {
    const e = this._lexer.token, t = this.parseDescription(), r = this.parseEnumValueName(), i = this.parseConstDirectives();
    return this.node(e, {
      kind: D.ENUM_VALUE_DEFINITION,
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
      throw xe(
        this._lexer.source,
        this._lexer.token.start,
        `${yr(
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
      kind: D.INPUT_OBJECT_TYPE_DEFINITION,
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
    const t = this.parseConstDirectives(), r = this.optionalMany(
      N.BRACE_L,
      this.parseOperationTypeDefinition,
      N.BRACE_R
    );
    if (t.length === 0 && r.length === 0)
      throw this.unexpected();
    return this.node(e, {
      kind: D.SCHEMA_EXTENSION,
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
      kind: D.SCALAR_TYPE_EXTENSION,
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
      kind: D.OBJECT_TYPE_EXTENSION,
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
      kind: D.INTERFACE_TYPE_EXTENSION,
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
      kind: D.UNION_TYPE_EXTENSION,
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
      kind: D.ENUM_TYPE_EXTENSION,
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
      kind: D.INPUT_OBJECT_TYPE_EXTENSION,
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
    this.expectKeyword("directive"), this.expectToken(N.AT);
    const r = this.parseName(), i = this.parseArgumentDefs(), s = this.expectOptionalKeyword("repeatable");
    this.expectKeyword("on");
    const o = this.parseDirectiveLocations();
    return this.node(e, {
      kind: D.DIRECTIVE_DEFINITION,
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
    if (Object.prototype.hasOwnProperty.call($i, t.value))
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
    return this._options.noLocation !== !0 && (t.loc = new yf(
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
    throw xe(
      this._lexer.source,
      t.start,
      `Expected ${su(e)}, found ${yr(t)}.`
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
      throw xe(
        this._lexer.source,
        t.start,
        `Expected "${e}", found ${yr(t)}.`
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
    const t = e ?? this._lexer.token;
    return xe(
      this._lexer.source,
      t.start,
      `Unexpected ${yr(t)}.`
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
    if (t.kind !== N.EOF && (++this._tokenCounter, e !== void 0 && this._tokenCounter > e))
      throw xe(
        this._lexer.source,
        t.start,
        `Document contains more that ${e} tokens. Parsing aborted.`
      );
  }
}
function yr(n) {
  const e = n.value;
  return su(n.kind) + (e != null ? ` "${e}"` : "");
}
function su(n) {
  return _f(n) ? `"${n}"` : n;
}
function jf(n) {
  return `"${n.replace(Vf, Qf)}"`;
}
const Vf = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
function Qf(n) {
  return Hf[n.charCodeAt(0)];
}
const Hf = [
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
], Wr = Object.freeze({});
function Xe(n, e, t = Xa) {
  const r = /* @__PURE__ */ new Map();
  for (const b of Object.values(D))
    r.set(b, Wf(e, b));
  let i, s = Array.isArray(n), o = [n], a = -1, c = [], l = n, u, p;
  const d = [], y = [];
  do {
    a++;
    const b = a === o.length, k = b && c.length !== 0;
    if (b) {
      if (u = y.length === 0 ? void 0 : d[d.length - 1], l = p, p = y.pop(), k)
        if (s) {
          l = l.slice();
          let I = 0;
          for (const [O, C] of c) {
            const M = O - I;
            C === null ? (l.splice(M, 1), I++) : l[M] = C;
          }
        } else {
          l = Object.defineProperties(
            {},
            Object.getOwnPropertyDescriptors(l)
          );
          for (const [I, O] of c)
            l[I] = O;
        }
      a = i.index, o = i.keys, c = i.edits, s = i.inArray, i = i.prev;
    } else if (p) {
      if (u = s ? a : o[a], l = p[u], l == null)
        continue;
      d.push(u);
    }
    let S;
    if (!Array.isArray(l)) {
      var v, E;
      go(l) || Sr(!1, `Invalid AST Node: ${ds(l)}.`);
      const I = b ? (v = r.get(l.kind)) === null || v === void 0 ? void 0 : v.leave : (E = r.get(l.kind)) === null || E === void 0 ? void 0 : E.enter;
      if (S = I?.call(e, l, u, p, d, y), S === Wr)
        break;
      if (S === !1) {
        if (!b) {
          d.pop();
          continue;
        }
      } else if (S !== void 0 && (c.push([u, S]), !b))
        if (go(S))
          l = S;
        else {
          d.pop();
          continue;
        }
    }
    if (S === void 0 && k && c.push([u, l]), b)
      d.pop();
    else {
      var w;
      i = {
        inArray: s,
        index: a,
        keys: o,
        edits: c,
        prev: i
      }, s = Array.isArray(l), o = s ? l : (w = t[l.kind]) !== null && w !== void 0 ? w : [], a = -1, c = [], p && y.push(p), p = l;
    }
  } while (i !== void 0);
  return c.length !== 0 ? c[c.length - 1][1] : n;
}
function Wf(n, e) {
  const t = n[e];
  return typeof t == "object" ? t : typeof t == "function" ? {
    enter: t,
    leave: void 0
  } : {
    enter: n.enter,
    leave: n.leave
  };
}
function ou(n) {
  return Xe(n, Kf);
}
const zf = 80, Kf = {
  Name: {
    leave: (n) => n.value
  },
  Variable: {
    leave: (n) => "$" + n.name
  },
  // Document
  Document: {
    leave: (n) => P(n.definitions, `

`)
  },
  OperationDefinition: {
    leave(n) {
      const e = K("(", P(n.variableDefinitions, ", "), ")"), t = P(
        [
          n.operation,
          P([n.name, e]),
          P(n.directives, " ")
        ],
        " "
      );
      return (t === "query" ? "" : t + " ") + n.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable: n, type: e, defaultValue: t, directives: r }) => n + ": " + e + K(" = ", t) + K(" ", P(r, " "))
  },
  SelectionSet: {
    leave: ({ selections: n }) => Ge(n)
  },
  Field: {
    leave({ alias: n, name: e, arguments: t, directives: r, selectionSet: i }) {
      const s = K("", n, ": ") + e;
      let o = s + K("(", P(t, ", "), ")");
      return o.length > zf && (o = s + K(`(
`, kr(P(t, `
`)), `
)`)), P([o, P(r, " "), i], " ");
    }
  },
  Argument: {
    leave: ({ name: n, value: e }) => n + ": " + e
  },
  // Fragments
  FragmentSpread: {
    leave: ({ name: n, directives: e }) => "..." + n + K(" ", P(e, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition: n, directives: e, selectionSet: t }) => P(
      [
        "...",
        K("on ", n),
        P(e, " "),
        t
      ],
      " "
    )
  },
  FragmentDefinition: {
    leave: ({ name: n, typeCondition: e, variableDefinitions: t, directives: r, selectionSet: i }) => (
      // or removed in the future.
      `fragment ${n}${K("(", P(t, ", "), ")")} on ${e} ${K("", P(r, " "), " ")}` + i
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
    leave: ({ value: n, block: e }) => e ? wf(n) : jf(n)
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
    leave: ({ values: n }) => "[" + P(n, ", ") + "]"
  },
  ObjectValue: {
    leave: ({ fields: n }) => "{" + P(n, ", ") + "}"
  },
  ObjectField: {
    leave: ({ name: n, value: e }) => n + ": " + e
  },
  // Directive
  Directive: {
    leave: ({ name: n, arguments: e }) => "@" + n + K("(", P(e, ", "), ")")
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
`) + P(["schema", P(e, " "), Ge(t)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation: n, type: e }) => n + ": " + e
  },
  ScalarTypeDefinition: {
    leave: ({ description: n, name: e, directives: t }) => K("", n, `
`) + P(["scalar", e, P(t, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ description: n, name: e, interfaces: t, directives: r, fields: i }) => K("", n, `
`) + P(
      [
        "type",
        e,
        K("implements ", P(t, " & ")),
        P(r, " "),
        Ge(i)
      ],
      " "
    )
  },
  FieldDefinition: {
    leave: ({ description: n, name: e, arguments: t, type: r, directives: i }) => K("", n, `
`) + e + (bo(t) ? K(`(
`, kr(P(t, `
`)), `
)`) : K("(", P(t, ", "), ")")) + ": " + r + K(" ", P(i, " "))
  },
  InputValueDefinition: {
    leave: ({ description: n, name: e, type: t, defaultValue: r, directives: i }) => K("", n, `
`) + P(
      [e + ": " + t, K("= ", r), P(i, " ")],
      " "
    )
  },
  InterfaceTypeDefinition: {
    leave: ({ description: n, name: e, interfaces: t, directives: r, fields: i }) => K("", n, `
`) + P(
      [
        "interface",
        e,
        K("implements ", P(t, " & ")),
        P(r, " "),
        Ge(i)
      ],
      " "
    )
  },
  UnionTypeDefinition: {
    leave: ({ description: n, name: e, directives: t, types: r }) => K("", n, `
`) + P(
      ["union", e, P(t, " "), K("= ", P(r, " | "))],
      " "
    )
  },
  EnumTypeDefinition: {
    leave: ({ description: n, name: e, directives: t, values: r }) => K("", n, `
`) + P(["enum", e, P(t, " "), Ge(r)], " ")
  },
  EnumValueDefinition: {
    leave: ({ description: n, name: e, directives: t }) => K("", n, `
`) + P([e, P(t, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ description: n, name: e, directives: t, fields: r }) => K("", n, `
`) + P(["input", e, P(t, " "), Ge(r)], " ")
  },
  DirectiveDefinition: {
    leave: ({ description: n, name: e, arguments: t, repeatable: r, locations: i }) => K("", n, `
`) + "directive @" + e + (bo(t) ? K(`(
`, kr(P(t, `
`)), `
)`) : K("(", P(t, ", "), ")")) + (r ? " repeatable" : "") + " on " + P(i, " | ")
  },
  SchemaExtension: {
    leave: ({ directives: n, operationTypes: e }) => P(
      ["extend schema", P(n, " "), Ge(e)],
      " "
    )
  },
  ScalarTypeExtension: {
    leave: ({ name: n, directives: e }) => P(["extend scalar", n, P(e, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name: n, interfaces: e, directives: t, fields: r }) => P(
      [
        "extend type",
        n,
        K("implements ", P(e, " & ")),
        P(t, " "),
        Ge(r)
      ],
      " "
    )
  },
  InterfaceTypeExtension: {
    leave: ({ name: n, interfaces: e, directives: t, fields: r }) => P(
      [
        "extend interface",
        n,
        K("implements ", P(e, " & ")),
        P(t, " "),
        Ge(r)
      ],
      " "
    )
  },
  UnionTypeExtension: {
    leave: ({ name: n, directives: e, types: t }) => P(
      [
        "extend union",
        n,
        P(e, " "),
        K("= ", P(t, " | "))
      ],
      " "
    )
  },
  EnumTypeExtension: {
    leave: ({ name: n, directives: e, values: t }) => P(["extend enum", n, P(e, " "), Ge(t)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name: n, directives: e, fields: t }) => P(["extend input", n, P(e, " "), Ge(t)], " ")
  }
};
function P(n, e = "") {
  var t;
  return (t = n?.filter((r) => r).join(e)) !== null && t !== void 0 ? t : "";
}
function Ge(n) {
  return K(`{
`, kr(P(n, `
`)), `
}`);
}
function K(n, e, t = "") {
  return e != null && e !== "" ? n + e + t : "";
}
function kr(n) {
  return K("  ", n.replace(/\n/g, `
  `));
}
function bo(n) {
  var e;
  return (e = n?.some((t) => t.includes(`
`))) !== null && e !== void 0 ? e : !1;
}
function wo(n) {
  return n.kind === D.FIELD || n.kind === D.FRAGMENT_SPREAD || n.kind === D.INLINE_FRAGMENT;
}
function or(n, e) {
  var t = n.directives;
  return !t || !t.length ? !0 : Yf(t).every(function(r) {
    var i = r.directive, s = r.ifArgument, o = !1;
    return s.value.kind === "Variable" ? (o = e && e[s.value.name.value], $(o !== void 0, 78, i.name.value)) : o = s.value.value, i.name.value === "skip" ? !o : o;
  });
}
function Xn(n, e, t) {
  var r = new Set(n), i = r.size;
  return Xe(e, {
    Directive: function(s) {
      if (r.delete(s.name.value) && (!t || !r.size))
        return Wr;
    }
  }), t ? !r.size : r.size < i;
}
function Gf(n) {
  return n && Xn(["client", "export"], n, !0);
}
function Jf(n) {
  var e = n.name.value;
  return e === "skip" || e === "include";
}
function Yf(n) {
  var e = [];
  return n && n.length && n.forEach(function(t) {
    if (Jf(t)) {
      var r = t.arguments, i = t.name.value;
      $(r && r.length === 1, 79, i);
      var s = r[0];
      $(s.name && s.name.value === "if", 80, i);
      var o = s.value;
      $(o && (o.kind === "Variable" || o.kind === "BooleanValue"), 81, i), e.push({ directive: t, ifArgument: s });
    }
  }), e;
}
function Xf(n) {
  var e, t, r = (e = n.directives) === null || e === void 0 ? void 0 : e.find(function(s) {
    var o = s.name;
    return o.value === "unmask";
  });
  if (!r)
    return "mask";
  var i = (t = r.arguments) === null || t === void 0 ? void 0 : t.find(function(s) {
    var o = s.name;
    return o.value === "mode";
  });
  return globalThis.__DEV__ !== !1 && i && (i.value.kind === D.VARIABLE ? globalThis.__DEV__ !== !1 && $.warn(82) : i.value.kind !== D.STRING ? globalThis.__DEV__ !== !1 && $.warn(83) : i.value.value !== "migrate" && globalThis.__DEV__ !== !1 && $.warn(84, i.value.value)), i && "value" in i.value && i.value.value === "migrate" ? "migrate" : "unmask";
}
const Zf = () => /* @__PURE__ */ Object.create(null), { forEach: eh, slice: Eo } = Array.prototype, { hasOwnProperty: th } = Object.prototype;
class vt {
  constructor(e = !0, t = Zf) {
    this.weakness = e, this.makeData = t;
  }
  lookup() {
    return this.lookupArray(arguments);
  }
  lookupArray(e) {
    let t = this;
    return eh.call(e, (r) => t = t.getChildTrie(r)), th.call(t, "data") ? t.data : t.data = this.makeData(Eo.call(e));
  }
  peek() {
    return this.peekArray(arguments);
  }
  peekArray(e) {
    let t = this;
    for (let r = 0, i = e.length; t && r < i; ++r) {
      const s = t.mapFor(e[r], !1);
      t = s && s.get(e[r]);
    }
    return t && t.data;
  }
  remove() {
    return this.removeArray(arguments);
  }
  removeArray(e) {
    let t;
    if (e.length) {
      const r = e[0], i = this.mapFor(r, !1), s = i && i.get(r);
      s && (t = s.removeArray(Eo.call(e, 1)), !s.data && !s.weak && !(s.strong && s.strong.size) && i.delete(r));
    } else
      t = this.data, delete this.data;
    return t;
  }
  getChildTrie(e) {
    const t = this.mapFor(e, !0);
    let r = t.get(e);
    return r || t.set(e, r = new vt(this.weakness, this.makeData)), r;
  }
  mapFor(e, t) {
    return this.weakness && nh(e) ? this.weak || (t ? this.weak = /* @__PURE__ */ new WeakMap() : void 0) : this.strong || (t ? this.strong = /* @__PURE__ */ new Map() : void 0);
  }
}
function nh(n) {
  switch (typeof n) {
    case "object":
      if (n === null)
        break;
    case "function":
      return !0;
  }
  return !1;
}
var rh = Ye(function() {
  return navigator.product;
}) == "ReactNative", Wt = typeof WeakMap == "function" && !(rh && !rt.HermesInternal), ps = typeof WeakSet == "function", au = typeof Symbol == "function" && typeof Symbol.for == "function", zr = au && Symbol.asyncIterator;
Ye(function() {
  return window.document.createElement;
});
Ye(function() {
  return navigator.userAgent.indexOf("jsdom") >= 0;
});
function ce(n) {
  return n !== null && typeof n == "object";
}
function ih(n, e) {
  var t = e, r = [];
  n.definitions.forEach(function(s) {
    if (s.kind === "OperationDefinition")
      throw Fe(
        85,
        s.operation,
        s.name ? " named '".concat(s.name.value, "'") : ""
      );
    s.kind === "FragmentDefinition" && r.push(s);
  }), typeof t > "u" && ($(r.length === 1, 86, r.length), t = r[0].name.value);
  var i = x(x({}, n), { definitions: Me([
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
  ], n.definitions, !0) });
  return i;
}
function vn(n) {
  n === void 0 && (n = []);
  var e = {};
  return n.forEach(function(t) {
    e[t.name.value] = t;
  }), e;
}
function Kr(n, e) {
  switch (n.kind) {
    case "InlineFragment":
      return n;
    case "FragmentSpread": {
      var t = n.name.value;
      if (typeof e == "function")
        return e(t);
      var r = e && e[t];
      return $(r, 87, t), r || null;
    }
    default:
      return null;
  }
}
function sh(n) {
  var e = !0;
  return Xe(n, {
    FragmentSpread: function(t) {
      if (e = !!t.directives && t.directives.some(function(r) {
        return r.name.value === "unmask";
      }), !e)
        return Wr;
    }
  }), e;
}
function oh() {
}
class Ui {
  constructor(e = 1 / 0, t = oh) {
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
      const { older: r, newer: i } = t;
      i && (i.older = r), r && (r.newer = i), t.older = this.newest, t.older.newer = t, t.newer = null, this.newest = t, t === this.oldest && (this.oldest = i);
    }
    return t;
  }
  set(e, t) {
    let r = this.getNode(e);
    return r ? r.value = t : (r = {
      key: e,
      value: t,
      newer: null,
      older: this.newest
    }, this.newest && (this.newest.newer = r), this.newest = r, this.oldest = this.oldest || r, this.map.set(e, r), r.value);
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
function qi() {
}
const ah = qi, uh = typeof WeakRef < "u" ? WeakRef : function(n) {
  return { deref: () => n };
}, ch = typeof WeakMap < "u" ? WeakMap : Map, lh = typeof FinalizationRegistry < "u" ? FinalizationRegistry : function() {
  return {
    register: qi,
    unregister: qi
  };
}, fh = 10024;
class Fr {
  constructor(e = 1 / 0, t = ah) {
    this.max = e, this.dispose = t, this.map = new ch(), this.newest = null, this.oldest = null, this.unfinalizedNodes = /* @__PURE__ */ new Set(), this.finalizationScheduled = !1, this.size = 0, this.finalize = () => {
      const r = this.unfinalizedNodes.values();
      for (let i = 0; i < fh; i++) {
        const s = r.next().value;
        if (!s)
          break;
        this.unfinalizedNodes.delete(s);
        const o = s.key;
        delete s.key, s.keyRef = new uh(o), this.registry.register(o, s, s);
      }
      this.unfinalizedNodes.size > 0 ? queueMicrotask(this.finalize) : this.finalizationScheduled = !1;
    }, this.registry = new lh(this.deleteNode.bind(this));
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
      const { older: r, newer: i } = t;
      i && (i.older = r), r && (r.newer = i), t.older = this.newest, t.older.newer = t, t.newer = null, this.newest = t, t === this.oldest && (this.oldest = i);
    }
    return t;
  }
  set(e, t) {
    let r = this.getNode(e);
    return r ? r.value = t : (r = {
      key: e,
      value: t,
      newer: null,
      older: this.newest
    }, this.newest && (this.newest.newer = r), this.newest = r, this.oldest = this.oldest || r, this.scheduleFinalization(r), this.map.set(e, r), this.size++, r.value);
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
var yi = /* @__PURE__ */ new WeakSet();
function uu(n) {
  n.size <= (n.max || -1) || yi.has(n) || (yi.add(n), setTimeout(function() {
    n.clean(), yi.delete(n);
  }, 100));
}
var cu = function(n, e) {
  var t = new Fr(n, e);
  return t.set = function(r, i) {
    var s = Fr.prototype.set.call(this, r, i);
    return uu(this), s;
  }, t;
}, hh = function(n, e) {
  var t = new Ui(n, e);
  return t.set = function(r, i) {
    var s = Ui.prototype.set.call(this, r, i);
    return uu(this), s;
  }, t;
}, dh = Symbol.for("apollo.cacheSize"), mt = x({}, Fi[dh]), Pt = {};
function lu(n, e) {
  Pt[n] = e;
}
var ph = globalThis.__DEV__ !== !1 ? vh : void 0, yh = globalThis.__DEV__ !== !1 ? bh : void 0, mh = globalThis.__DEV__ !== !1 ? fu : void 0;
function gh() {
  var n = {
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
  return Object.fromEntries(Object.entries(n).map(function(e) {
    var t = e[0], r = e[1];
    return [
      t,
      mt[t] || r
    ];
  }));
}
function vh() {
  var n, e, t, r, i;
  if (globalThis.__DEV__ === !1)
    throw new Error("only supported in development mode");
  return {
    limits: gh(),
    sizes: x({ print: (n = Pt.print) === null || n === void 0 ? void 0 : n.call(Pt), parser: (e = Pt.parser) === null || e === void 0 ? void 0 : e.call(Pt), canonicalStringify: (t = Pt.canonicalStringify) === null || t === void 0 ? void 0 : t.call(Pt), links: Vi(this.link), queryManager: {
      getDocumentInfo: this.queryManager.transformCache.size,
      documentTransforms: du(this.queryManager.documentTransform)
    } }, (i = (r = this.cache).getMemoryInternals) === null || i === void 0 ? void 0 : i.call(r))
  };
}
function fu() {
  return {
    cache: {
      fragmentQueryDocuments: kt(this.getFragmentDoc)
    }
  };
}
function bh() {
  var n = this.config.fragments;
  return x(x({}, fu.apply(this)), { addTypenameDocumentTransform: du(this.addTypenameTransform), inMemoryCache: {
    executeSelectionSet: kt(this.storeReader.executeSelectionSet),
    executeSubSelectedArray: kt(this.storeReader.executeSubSelectedArray),
    maybeBroadcastWatch: kt(this.maybeBroadcastWatch)
  }, fragmentRegistry: {
    findFragmentSpreads: kt(n?.findFragmentSpreads),
    lookup: kt(n?.lookup),
    transform: kt(n?.transform)
  } });
}
function wh(n) {
  return !!n && "dirtyKey" in n;
}
function kt(n) {
  return wh(n) ? n.size : void 0;
}
function hu(n) {
  return n != null;
}
function du(n) {
  return ji(n).map(function(e) {
    return { cache: e };
  });
}
function ji(n) {
  return n ? Me(Me([
    kt(n?.performWork)
  ], ji(n?.left), !0), ji(n?.right), !0).filter(hu) : [];
}
function Vi(n) {
  var e;
  return n ? Me(Me([
    (e = n?.getMemoryInternals) === null || e === void 0 ? void 0 : e.call(n)
  ], Vi(n?.left), !0), Vi(n?.right), !0).filter(hu) : [];
}
var Ot = Object.assign(function(e) {
  return JSON.stringify(e, Eh);
}, {
  reset: function() {
    nn = new hh(
      mt.canonicalStringify || 1e3
      /* defaultCacheSizes.canonicalStringify */
    );
  }
});
globalThis.__DEV__ !== !1 && lu("canonicalStringify", function() {
  return nn.size;
});
var nn;
Ot.reset();
function Eh(n, e) {
  if (e && typeof e == "object") {
    var t = Object.getPrototypeOf(e);
    if (t === Object.prototype || t === null) {
      var r = Object.keys(e);
      if (r.every(_h))
        return e;
      var i = JSON.stringify(r), s = nn.get(i);
      if (!s) {
        r.sort();
        var o = JSON.stringify(r);
        s = nn.get(o) || r, nn.set(i, s), nn.set(o, s);
      }
      var a = Object.create(t);
      return s.forEach(function(c) {
        a[c] = e[c];
      }), a;
    }
  }
  return e;
}
function _h(n, e, t) {
  return e === 0 || t[e - 1] <= n;
}
function an(n) {
  return { __ref: String(n) };
}
function X(n) {
  return !!(n && typeof n == "object" && typeof n.__ref == "string");
}
function Sh(n) {
  return ce(n) && n.kind === "Document" && Array.isArray(n.definitions);
}
function kh(n) {
  return n.kind === "StringValue";
}
function xh(n) {
  return n.kind === "BooleanValue";
}
function Th(n) {
  return n.kind === "IntValue";
}
function Ih(n) {
  return n.kind === "FloatValue";
}
function Ah(n) {
  return n.kind === "Variable";
}
function Oh(n) {
  return n.kind === "ObjectValue";
}
function Ch(n) {
  return n.kind === "ListValue";
}
function Rh(n) {
  return n.kind === "EnumValue";
}
function Nh(n) {
  return n.kind === "NullValue";
}
function hn(n, e, t, r) {
  if (Th(t) || Ih(t))
    n[e.value] = Number(t.value);
  else if (xh(t) || kh(t))
    n[e.value] = t.value;
  else if (Oh(t)) {
    var i = {};
    t.fields.map(function(o) {
      return hn(i, o.name, o.value, r);
    }), n[e.value] = i;
  } else if (Ah(t)) {
    var s = (r || {})[t.name.value];
    n[e.value] = s;
  } else if (Ch(t))
    n[e.value] = t.values.map(function(o) {
      var a = {};
      return hn(a, e, o, r), a[e.value];
    });
  else if (Rh(t))
    n[e.value] = t.value;
  else if (Nh(t))
    n[e.value] = null;
  else
    throw Fe(96, e.value, t.kind);
}
function Mh(n, e) {
  var t = null;
  n.directives && (t = {}, n.directives.forEach(function(i) {
    t[i.name.value] = {}, i.arguments && i.arguments.forEach(function(s) {
      var o = s.name, a = s.value;
      return hn(t[i.name.value], o, a, e);
    });
  }));
  var r = null;
  return n.arguments && n.arguments.length && (r = {}, n.arguments.forEach(function(i) {
    var s = i.name, o = i.value;
    return hn(r, s, o, e);
  })), pu(n.name.value, r, t);
}
var Dh = [
  "connection",
  "include",
  "skip",
  "client",
  "rest",
  "export",
  "nonreactive"
], Rn = Ot, pu = Object.assign(function(n, e, t) {
  if (e && t && t.connection && t.connection.key)
    if (t.connection.filter && t.connection.filter.length > 0) {
      var r = t.connection.filter ? t.connection.filter : [];
      r.sort();
      var i = {};
      return r.forEach(function(a) {
        i[a] = e[a];
      }), "".concat(t.connection.key, "(").concat(Rn(i), ")");
    } else
      return t.connection.key;
  var s = n;
  if (e) {
    var o = Rn(e);
    s += "(".concat(o, ")");
  }
  return t && Object.keys(t).forEach(function(a) {
    Dh.indexOf(a) === -1 && (t[a] && Object.keys(t[a]).length ? s += "@".concat(a, "(").concat(Rn(t[a]), ")") : s += "@".concat(a));
  }), s;
}, {
  setStringify: function(n) {
    var e = Rn;
    return Rn = n, e;
  }
});
function Gr(n, e) {
  if (n.arguments && n.arguments.length) {
    var t = {};
    return n.arguments.forEach(function(r) {
      var i = r.name, s = r.value;
      return hn(t, i, s, e);
    }), t;
  }
  return null;
}
function gt(n) {
  return n.alias ? n.alias.value : n.name.value;
}
function Qi(n, e, t) {
  for (var r, i = 0, s = e.selections; i < s.length; i++) {
    var o = s[i];
    if (Ct(o)) {
      if (o.name.value === "__typename")
        return n[gt(o)];
    } else r ? r.push(o) : r = [o];
  }
  if (typeof n.__typename == "string")
    return n.__typename;
  if (r)
    for (var a = 0, c = r; a < c.length; a++) {
      var o = c[a], l = Qi(n, Kr(o, t).selectionSet, t);
      if (typeof l == "string")
        return l;
    }
}
function Ct(n) {
  return n.kind === "Field";
}
function Fh(n) {
  return n.kind === "InlineFragment";
}
function bn(n) {
  $(n && n.kind === "Document", 88);
  var e = n.definitions.filter(function(t) {
    return t.kind !== "FragmentDefinition";
  }).map(function(t) {
    if (t.kind !== "OperationDefinition")
      throw Fe(89, t.kind);
    return t;
  });
  return $(e.length <= 1, 90, e.length), n;
}
function Qt(n) {
  return bn(n), n.definitions.filter(function(e) {
    return e.kind === "OperationDefinition";
  })[0];
}
function Ln(n) {
  return n.definitions.filter(function(e) {
    return e.kind === "OperationDefinition" && !!e.name;
  }).map(function(e) {
    return e.name.value;
  })[0] || null;
}
function wn(n) {
  return n.definitions.filter(function(e) {
    return e.kind === "FragmentDefinition";
  });
}
function yu(n) {
  var e = Qt(n);
  return $(e && e.operation === "query", 91), e;
}
function mu(n) {
  $(n.kind === "Document", 92), $(n.definitions.length <= 1, 93);
  var e = n.definitions[0];
  return $(e.kind === "FragmentDefinition", 94), e;
}
function En(n) {
  bn(n);
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
  throw Fe(95);
}
function ys(n) {
  var e = /* @__PURE__ */ Object.create(null), t = n && n.variableDefinitions;
  return t && t.length && t.forEach(function(r) {
    r.defaultValue && hn(e, r.variable.name, r.defaultValue);
  }), e;
}
let Ie = null;
const _o = {};
let Bh = 1;
const Ph = () => class {
  constructor() {
    this.id = [
      "slot",
      Bh++,
      Date.now(),
      Math.random().toString(36).slice(2)
    ].join(":");
  }
  hasValue() {
    for (let e = Ie; e; e = e.parent)
      if (this.id in e.slots) {
        const t = e.slots[this.id];
        if (t === _o)
          break;
        return e !== Ie && (Ie.slots[this.id] = t), !0;
      }
    return Ie && (Ie.slots[this.id] = _o), !1;
  }
  getValue() {
    if (this.hasValue())
      return Ie.slots[this.id];
  }
  withValue(e, t, r, i) {
    const s = {
      __proto__: null,
      [this.id]: e
    }, o = Ie;
    Ie = { parent: o, slots: s };
    try {
      return t.apply(i, r);
    } finally {
      Ie = o;
    }
  }
  // Capture the current context and wrap a callback function so that it
  // reestablishes the captured context when called.
  static bind(e) {
    const t = Ie;
    return function() {
      const r = Ie;
      try {
        return Ie = t, e.apply(this, arguments);
      } finally {
        Ie = r;
      }
    };
  }
  // Immediately run a callback function without any captured context.
  static noContext(e, t, r) {
    if (Ie) {
      const i = Ie;
      try {
        return Ie = null, e.apply(r, t);
      } finally {
        Ie = i;
      }
    } else
      return e.apply(r, t);
  }
};
function So(n) {
  try {
    return n();
  } catch {
  }
}
const mi = "@wry/context:Slot", $h = (
  // Prefer globalThis when available.
  // https://github.com/benjamn/wryware/issues/347
  So(() => globalThis) || // Fall back to global, which works in Node.js and may be converted by some
  // bundlers to the appropriate identifier (window, self, ...) depending on the
  // bundling target. https://github.com/endojs/endo/issues/576#issuecomment-1178515224
  So(() => rt) || // Otherwise, use a dummy host that's local to this module. We used to fall
  // back to using the Array constructor as a namespace, but that was flagged in
  // https://github.com/benjamn/wryware/issues/347, and can be avoided.
  /* @__PURE__ */ Object.create(null)
), ko = $h, ms = ko[mi] || // Earlier versions of this package stored the globalKey property on the Array
// constructor, so we check there as well, to prevent Slot class duplication.
Array[mi] || function(n) {
  try {
    Object.defineProperty(ko, mi, {
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
}(Ph()), Jr = new ms(), { hasOwnProperty: Lh } = Object.prototype, gs = Array.from || function(n) {
  const e = [];
  return n.forEach((t) => e.push(t)), e;
};
function vs(n) {
  const { unsubscribe: e } = n;
  typeof e == "function" && (n.unsubscribe = void 0, e());
}
const Zn = [], Uh = 100;
function dn(n, e) {
  if (!n)
    throw new Error(e || "assertion failure");
}
function gu(n, e) {
  const t = n.length;
  return (
    // Unknown values are not equal to each other.
    t > 0 && // Both values must be ordinary (or both exceptional) to be equal.
    t === e.length && // The underlying value or exception must be the same.
    n[t - 1] === e[t - 1]
  );
}
function vu(n) {
  switch (n.length) {
    case 0:
      throw new Error("unknown value");
    case 1:
      return n[0];
    case 2:
      throw n[1];
  }
}
function bu(n) {
  return n.slice(0);
}
class Yr {
  constructor(e) {
    this.fn = e, this.parents = /* @__PURE__ */ new Set(), this.childValues = /* @__PURE__ */ new Map(), this.dirtyChildren = null, this.dirty = !0, this.recomputing = !1, this.value = [], this.deps = null, ++Yr.count;
  }
  peek() {
    if (this.value.length === 1 && !Rt(this))
      return xo(this), this.value[0];
  }
  // This is the most important method of the Entry API, because it
  // determines whether the cached this.value can be returned immediately,
  // or must be recomputed. The overall performance of the caching system
  // depends on the truth of the following observations: (1) this.dirty is
  // usually false, (2) this.dirtyChildren is usually null/empty, and thus
  // (3) valueGet(this.value) is usually returned without recomputation.
  recompute(e) {
    return dn(!this.recomputing, "already recomputing"), xo(this), Rt(this) ? qh(this, e) : vu(this.value);
  }
  setDirty() {
    this.dirty || (this.dirty = !0, wu(this), vs(this));
  }
  dispose() {
    this.setDirty(), xu(this), bs(this, (e, t) => {
      e.setDirty(), Tu(e, this);
    });
  }
  forget() {
    this.dispose();
  }
  dependOn(e) {
    e.add(this), this.deps || (this.deps = Zn.pop() || /* @__PURE__ */ new Set()), this.deps.add(e);
  }
  forgetDeps() {
    this.deps && (gs(this.deps).forEach((e) => e.delete(this)), this.deps.clear(), Zn.push(this.deps), this.deps = null);
  }
}
Yr.count = 0;
function xo(n) {
  const e = Jr.getValue();
  if (e)
    return n.parents.add(e), e.childValues.has(n) || e.childValues.set(n, []), Rt(n) ? _u(e, n) : Su(e, n), e;
}
function qh(n, e) {
  return xu(n), Jr.withValue(n, jh, [n, e]), Qh(n, e) && Vh(n), vu(n.value);
}
function jh(n, e) {
  n.recomputing = !0;
  const { normalizeResult: t } = n;
  let r;
  t && n.value.length === 1 && (r = bu(n.value)), n.value.length = 0;
  try {
    if (n.value[0] = n.fn.apply(null, e), t && r && !gu(r, n.value))
      try {
        n.value[0] = t(n.value[0], r[0]);
      } catch {
      }
  } catch (i) {
    n.value[1] = i;
  }
  n.recomputing = !1;
}
function Rt(n) {
  return n.dirty || !!(n.dirtyChildren && n.dirtyChildren.size);
}
function Vh(n) {
  n.dirty = !1, !Rt(n) && Eu(n);
}
function wu(n) {
  bs(n, _u);
}
function Eu(n) {
  bs(n, Su);
}
function bs(n, e) {
  const t = n.parents.size;
  if (t) {
    const r = gs(n.parents);
    for (let i = 0; i < t; ++i)
      e(r[i], n);
  }
}
function _u(n, e) {
  dn(n.childValues.has(e)), dn(Rt(e));
  const t = !Rt(n);
  if (!n.dirtyChildren)
    n.dirtyChildren = Zn.pop() || /* @__PURE__ */ new Set();
  else if (n.dirtyChildren.has(e))
    return;
  n.dirtyChildren.add(e), t && wu(n);
}
function Su(n, e) {
  dn(n.childValues.has(e)), dn(!Rt(e));
  const t = n.childValues.get(e);
  t.length === 0 ? n.childValues.set(e, bu(e.value)) : gu(t, e.value) || n.setDirty(), ku(n, e), !Rt(n) && Eu(n);
}
function ku(n, e) {
  const t = n.dirtyChildren;
  t && (t.delete(e), t.size === 0 && (Zn.length < Uh && Zn.push(t), n.dirtyChildren = null));
}
function xu(n) {
  n.childValues.size > 0 && n.childValues.forEach((e, t) => {
    Tu(n, t);
  }), n.forgetDeps(), dn(n.dirtyChildren === null);
}
function Tu(n, e) {
  e.parents.delete(n), n.childValues.delete(e), ku(n, e);
}
function Qh(n, e) {
  if (typeof n.subscribe == "function")
    try {
      vs(n), n.unsubscribe = n.subscribe.apply(null, e);
    } catch {
      return n.setDirty(), !1;
    }
  return !0;
}
const Hh = {
  setDirty: !0,
  dispose: !0,
  forget: !0
  // Fully remove parent Entry from LRU cache and computation graph
};
function Iu(n) {
  const e = /* @__PURE__ */ new Map();
  function t(r) {
    const i = Jr.getValue();
    if (i) {
      let s = e.get(r);
      s || e.set(r, s = /* @__PURE__ */ new Set()), i.dependOn(s);
    }
  }
  return t.dirty = function(i, s) {
    const o = e.get(i);
    if (o) {
      const a = s && Lh.call(Hh, s) ? s : "setDirty";
      gs(o).forEach((c) => c[a]()), e.delete(i), vs(o);
    }
  }, t;
}
let To;
function Wh(...n) {
  return (To || (To = new vt(typeof WeakMap == "function"))).lookupArray(n);
}
const gi = /* @__PURE__ */ new Set();
function er(n, { max: e = Math.pow(2, 16), keyArgs: t, makeCacheKey: r = Wh, normalizeResult: i, subscribe: s, cache: o = Ui } = /* @__PURE__ */ Object.create(null)) {
  const a = typeof o == "function" ? new o(e, (d) => d.dispose()) : o, c = function() {
    const d = r.apply(null, t ? t.apply(null, arguments) : arguments);
    if (d === void 0)
      return n.apply(null, arguments);
    let y = a.get(d);
    y || (a.set(d, y = new Yr(n)), y.normalizeResult = i, y.subscribe = s, y.forget = () => a.delete(d));
    const v = y.recompute(Array.prototype.slice.call(arguments));
    return a.set(d, y), gi.add(a), Jr.hasValue() || (gi.forEach((E) => E.clean()), gi.clear()), v;
  };
  Object.defineProperty(c, "size", {
    get: () => a.size,
    configurable: !1,
    enumerable: !1
  }), Object.freeze(c.options = {
    max: e,
    keyArgs: t,
    makeCacheKey: r,
    normalizeResult: i,
    subscribe: s,
    cache: a
  });
  function l(d) {
    const y = d && a.get(d);
    y && y.setDirty();
  }
  c.dirtyKey = l, c.dirty = function() {
    l(r.apply(null, arguments));
  };
  function u(d) {
    const y = d && a.get(d);
    if (y)
      return y.peek();
  }
  c.peekKey = u, c.peek = function() {
    return u(r.apply(null, arguments));
  };
  function p(d) {
    return d ? a.delete(d) : !1;
  }
  return c.forgetKey = p, c.forget = function() {
    return p(r.apply(null, arguments));
  }, c.makeCacheKey = r, c.getKey = t ? function() {
    return r.apply(null, t.apply(null, arguments));
  } : r, Object.freeze(c);
}
function zh(n) {
  return n;
}
var Au = (
  /** @class */
  function() {
    function n(e, t) {
      t === void 0 && (t = /* @__PURE__ */ Object.create(null)), this.resultCache = ps ? /* @__PURE__ */ new WeakSet() : /* @__PURE__ */ new Set(), this.transform = e, t.getCacheKey && (this.getCacheKey = t.getCacheKey), this.cached = t.cache !== !1, this.resetCache();
    }
    return n.prototype.getCacheKey = function(e) {
      return [e];
    }, n.identity = function() {
      return new n(zh, { cache: !1 });
    }, n.split = function(e, t, r) {
      return r === void 0 && (r = n.identity()), Object.assign(new n(
        function(i) {
          var s = e(i) ? t : r;
          return s.transformDocument(i);
        },
        // Reasonably assume both `left` and `right` transforms handle their own caching
        { cache: !1 }
      ), { left: t, right: r });
    }, n.prototype.resetCache = function() {
      var e = this;
      if (this.cached) {
        var t = new vt(Wt);
        this.performWork = er(n.prototype.performWork.bind(this), {
          makeCacheKey: function(r) {
            var i = e.getCacheKey(r);
            if (i)
              return $(Array.isArray(i), 77), t.lookupArray(i);
          },
          max: mt["documentTransform.cache"],
          cache: Fr
        });
      }
    }, n.prototype.performWork = function(e) {
      return bn(e), this.transform(e);
    }, n.prototype.transformDocument = function(e) {
      if (this.resultCache.has(e))
        return e;
      var t = this.performWork(e);
      return this.resultCache.add(t), t;
    }, n.prototype.concat = function(e) {
      var t = this;
      return Object.assign(new n(
        function(r) {
          return e.transformDocument(t.transformDocument(r));
        },
        // Reasonably assume both transforms handle their own caching
        { cache: !1 }
      ), {
        left: this,
        right: e
      });
    }, n;
  }()
), Vn, At = Object.assign(function(n) {
  var e = Vn.get(n);
  return e || (e = ou(n), Vn.set(n, e)), e;
}, {
  reset: function() {
    Vn = new cu(
      mt.print || 2e3
      /* defaultCacheSizes.print */
    );
  }
});
At.reset();
globalThis.__DEV__ !== !1 && lu("print", function() {
  return Vn ? Vn.size : 0;
});
var de = Array.isArray;
function st(n) {
  return Array.isArray(n) && n.length > 0;
}
var Io = {
  kind: D.FIELD,
  name: {
    kind: D.NAME,
    value: "__typename"
  }
};
function Ou(n, e) {
  return !n || n.selectionSet.selections.every(function(t) {
    return t.kind === D.FRAGMENT_SPREAD && Ou(e[t.name.value], e);
  });
}
function Kh(n) {
  return Ou(Qt(n) || mu(n), vn(wn(n))) ? null : n;
}
function Gh(n) {
  var e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map();
  return n.forEach(function(r) {
    r && (r.name ? e.set(r.name, r) : r.test && t.set(r.test, r));
  }), function(r) {
    var i = e.get(r.name.value);
    return !i && t.size && t.forEach(function(s, o) {
      o(r) && (i = s);
    }), i;
  };
}
function Ao(n) {
  var e = /* @__PURE__ */ new Map();
  return function(r) {
    r === void 0 && (r = n);
    var i = e.get(r);
    return i || e.set(r, i = {
      // Variable and fragment spread names used directly within this
      // operation or fragment definition, as identified by key. These sets
      // will be populated during the first traversal of the document in
      // removeDirectivesFromDocument below.
      variables: /* @__PURE__ */ new Set(),
      fragmentSpreads: /* @__PURE__ */ new Set()
    }), i;
  };
}
function Cu(n, e) {
  bn(e);
  for (var t = Ao(""), r = Ao(""), i = function(b) {
    for (var k = 0, S = void 0; k < b.length && (S = b[k]); ++k)
      if (!de(S)) {
        if (S.kind === D.OPERATION_DEFINITION)
          return t(S.name && S.name.value);
        if (S.kind === D.FRAGMENT_DEFINITION)
          return r(S.name.value);
      }
    return globalThis.__DEV__ !== !1 && $.error(97), null;
  }, s = 0, o = e.definitions.length - 1; o >= 0; --o)
    e.definitions[o].kind === D.OPERATION_DEFINITION && ++s;
  var a = Gh(n), c = function(b) {
    return st(b) && b.map(a).some(function(k) {
      return k && k.remove;
    });
  }, l = /* @__PURE__ */ new Map(), u = !1, p = {
    enter: function(b) {
      if (c(b.directives))
        return u = !0, null;
    }
  }, d = Xe(e, {
    // These two AST node types share the same implementation, defined above.
    Field: p,
    InlineFragment: p,
    VariableDefinition: {
      enter: function() {
        return !1;
      }
    },
    Variable: {
      enter: function(b, k, S, I, O) {
        var C = i(O);
        C && C.variables.add(b.name.value);
      }
    },
    FragmentSpread: {
      enter: function(b, k, S, I, O) {
        if (c(b.directives))
          return u = !0, null;
        var C = i(O);
        C && C.fragmentSpreads.add(b.name.value);
      }
    },
    FragmentDefinition: {
      enter: function(b, k, S, I) {
        l.set(JSON.stringify(I), b);
      },
      leave: function(b, k, S, I) {
        var O = l.get(JSON.stringify(I));
        if (b === O)
          return b;
        if (
          // This logic applies only if the document contains one or more
          // operations, since removing all fragments from a document containing
          // only fragments makes the document useless.
          s > 0 && b.selectionSet.selections.every(function(C) {
            return C.kind === D.FIELD && C.name.value === "__typename";
          })
        )
          return r(b.name.value).removed = !0, u = !0, null;
      }
    },
    Directive: {
      leave: function(b) {
        if (a(b))
          return u = !0, null;
      }
    }
  });
  if (!u)
    return e;
  var y = function(b) {
    return b.transitiveVars || (b.transitiveVars = new Set(b.variables), b.removed || b.fragmentSpreads.forEach(function(k) {
      y(r(k)).transitiveVars.forEach(function(S) {
        b.transitiveVars.add(S);
      });
    })), b;
  }, v = /* @__PURE__ */ new Set();
  d.definitions.forEach(function(b) {
    b.kind === D.OPERATION_DEFINITION ? y(t(b.name && b.name.value)).fragmentSpreads.forEach(function(k) {
      v.add(k);
    }) : b.kind === D.FRAGMENT_DEFINITION && // If there are no operations in the document, then all fragment
    // definitions count as usages of their own fragment names. This heuristic
    // prevents accidentally removing all fragment definitions from the
    // document just because it contains no operations that use the fragments.
    s === 0 && !r(b.name.value).removed && v.add(b.name.value);
  }), v.forEach(function(b) {
    y(r(b)).fragmentSpreads.forEach(function(k) {
      v.add(k);
    });
  });
  var E = function(b) {
    return !!// A fragment definition will be removed if there are no spreads that refer
    // to it, or the fragment was explicitly removed because it had no fields
    // other than __typename.
    (!v.has(b) || r(b).removed);
  }, w = {
    enter: function(b) {
      if (E(b.name.value))
        return null;
    }
  };
  return Kh(Xe(d, {
    // If the fragment is going to be removed, then leaving any dangling
    // FragmentSpread nodes with the same name would be a mistake.
    FragmentSpread: w,
    // This is where the fragment definition is actually removed.
    FragmentDefinition: w,
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
var ws = Object.assign(function(n) {
  return Xe(n, {
    SelectionSet: {
      enter: function(e, t, r) {
        if (!(r && r.kind === D.OPERATION_DEFINITION)) {
          var i = e.selections;
          if (i) {
            var s = i.some(function(a) {
              return Ct(a) && (a.name.value === "__typename" || a.name.value.lastIndexOf("__", 0) === 0);
            });
            if (!s) {
              var o = r;
              if (!(Ct(o) && o.directives && o.directives.some(function(a) {
                return a.name.value === "export";
              })))
                return x(x({}, e), { selections: Me(Me([], i, !0), [Io], !1) });
            }
          }
        }
      }
    }
  });
}, {
  added: function(n) {
    return n === Io;
  }
});
function Jh(n) {
  var e = En(n), t = e.operation;
  if (t === "query")
    return n;
  var r = Xe(n, {
    OperationDefinition: {
      enter: function(i) {
        return x(x({}, i), { operation: "query" });
      }
    }
  });
  return r;
}
function Ru(n) {
  bn(n);
  var e = Cu([
    {
      test: function(t) {
        return t.name.value === "client";
      },
      remove: !0
    }
  ], n);
  return e;
}
function Yh(n) {
  return bn(n), Xe(n, {
    FragmentSpread: function(e) {
      var t;
      if (!(!((t = e.directives) === null || t === void 0) && t.some(function(r) {
        return r.name.value === "unmask";
      })))
        return x(x({}, e), { directives: Me(Me([], e.directives || [], !0), [
          {
            kind: D.DIRECTIVE,
            name: { kind: D.NAME, value: "nonreactive" }
          }
        ], !1) });
    }
  });
}
var Xh = Object.prototype.hasOwnProperty;
function Oo() {
  for (var n = [], e = 0; e < arguments.length; e++)
    n[e] = arguments[e];
  return Xr(n);
}
function Xr(n) {
  var e = n[0] || {}, t = n.length;
  if (t > 1)
    for (var r = new Nt(), i = 1; i < t; ++i)
      e = r.merge(e, n[i]);
  return e;
}
var Zh = function(n, e, t) {
  return this.merge(n[t], e[t]);
}, Nt = (
  /** @class */
  function() {
    function n(e) {
      e === void 0 && (e = Zh), this.reconciler = e, this.isObject = ce, this.pastCopies = /* @__PURE__ */ new Set();
    }
    return n.prototype.merge = function(e, t) {
      for (var r = this, i = [], s = 2; s < arguments.length; s++)
        i[s - 2] = arguments[s];
      return ce(t) && ce(e) ? (Object.keys(t).forEach(function(o) {
        if (Xh.call(e, o)) {
          var a = e[o];
          if (t[o] !== a) {
            var c = r.reconciler.apply(r, Me([
              e,
              t,
              o
            ], i, !1));
            c !== a && (e = r.shallowCopyForMerge(e), e[o] = c);
          }
        } else
          e = r.shallowCopyForMerge(e), e[o] = t[o];
      }), e) : t;
    }, n.prototype.shallowCopyForMerge = function(e) {
      return ce(e) && (this.pastCopies.has(e) || (Array.isArray(e) ? e = e.slice(0) : e = x({ __proto__: Object.getPrototypeOf(e) }, e), this.pastCopies.add(e))), e;
    }, n;
  }()
);
function ed(n, e) {
  var t = typeof Symbol < "u" && n[Symbol.iterator] || n["@@iterator"];
  if (t) return (t = t.call(n)).next.bind(t);
  if (Array.isArray(n) || (t = td(n)) || e) {
    t && (n = t);
    var r = 0;
    return function() {
      return r >= n.length ? { done: !0 } : { done: !1, value: n[r++] };
    };
  }
  throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function td(n, e) {
  if (n) {
    if (typeof n == "string") return Co(n, e);
    var t = Object.prototype.toString.call(n).slice(8, -1);
    if (t === "Object" && n.constructor && (t = n.constructor.name), t === "Map" || t === "Set") return Array.from(n);
    if (t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)) return Co(n, e);
  }
}
function Co(n, e) {
  (e == null || e > n.length) && (e = n.length);
  for (var t = 0, r = new Array(e); t < e; t++)
    r[t] = n[t];
  return r;
}
function Ro(n, e) {
  for (var t = 0; t < e.length; t++) {
    var r = e[t];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(n, r.key, r);
  }
}
function Es(n, e, t) {
  return e && Ro(n.prototype, e), t && Ro(n, t), Object.defineProperty(n, "prototype", { writable: !1 }), n;
}
var _s = function() {
  return typeof Symbol == "function";
}, Ss = function(n) {
  return _s() && !!Symbol[n];
}, ks = function(n) {
  return Ss(n) ? Symbol[n] : "@@" + n;
};
_s() && !Ss("observable") && (Symbol.observable = Symbol("observable"));
var nd = ks("iterator"), Hi = ks("observable"), Nu = ks("species");
function Br(n, e) {
  var t = n[e];
  if (t != null) {
    if (typeof t != "function") throw new TypeError(t + " is not a function");
    return t;
  }
}
function Nn(n) {
  var e = n.constructor;
  return e !== void 0 && (e = e[Nu], e === null && (e = void 0)), e !== void 0 ? e : ee;
}
function rd(n) {
  return n instanceof ee;
}
function pn(n) {
  pn.log ? pn.log(n) : setTimeout(function() {
    throw n;
  });
}
function xr(n) {
  Promise.resolve().then(function() {
    try {
      n();
    } catch (e) {
      pn(e);
    }
  });
}
function Mu(n) {
  var e = n._cleanup;
  if (e !== void 0 && (n._cleanup = void 0, !!e))
    try {
      if (typeof e == "function")
        e();
      else {
        var t = Br(e, "unsubscribe");
        t && t.call(e);
      }
    } catch (r) {
      pn(r);
    }
}
function Wi(n) {
  n._observer = void 0, n._queue = void 0, n._state = "closed";
}
function id(n) {
  var e = n._queue;
  if (e) {
    n._queue = void 0, n._state = "ready";
    for (var t = 0; t < e.length && (Du(n, e[t].type, e[t].value), n._state !== "closed"); ++t)
      ;
  }
}
function Du(n, e, t) {
  n._state = "running";
  var r = n._observer;
  try {
    var i = Br(r, e);
    switch (e) {
      case "next":
        i && i.call(r, t);
        break;
      case "error":
        if (Wi(n), i) i.call(r, t);
        else throw t;
        break;
      case "complete":
        Wi(n), i && i.call(r);
        break;
    }
  } catch (s) {
    pn(s);
  }
  n._state === "closed" ? Mu(n) : n._state === "running" && (n._state = "ready");
}
function vi(n, e, t) {
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
      }], xr(function() {
        return id(n);
      });
      return;
    }
    Du(n, e, t);
  }
}
var sd = /* @__PURE__ */ function() {
  function n(t, r) {
    this._cleanup = void 0, this._observer = t, this._queue = void 0, this._state = "initializing";
    var i = new od(this);
    try {
      this._cleanup = r.call(void 0, i);
    } catch (s) {
      i.error(s);
    }
    this._state === "initializing" && (this._state = "ready");
  }
  var e = n.prototype;
  return e.unsubscribe = function() {
    this._state !== "closed" && (Wi(this), Mu(this));
  }, Es(n, [{
    key: "closed",
    get: function() {
      return this._state === "closed";
    }
  }]), n;
}(), od = /* @__PURE__ */ function() {
  function n(t) {
    this._subscription = t;
  }
  var e = n.prototype;
  return e.next = function(r) {
    vi(this._subscription, "next", r);
  }, e.error = function(r) {
    vi(this._subscription, "error", r);
  }, e.complete = function() {
    vi(this._subscription, "complete");
  }, Es(n, [{
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
    }), new sd(r, this._subscriber);
  }, e.forEach = function(r) {
    var i = this;
    return new Promise(function(s, o) {
      if (typeof r != "function") {
        o(new TypeError(r + " is not a function"));
        return;
      }
      function a() {
        c.unsubscribe(), s();
      }
      var c = i.subscribe({
        next: function(l) {
          try {
            r(l, a);
          } catch (u) {
            o(u), c.unsubscribe();
          }
        },
        error: o,
        complete: s
      });
    });
  }, e.map = function(r) {
    var i = this;
    if (typeof r != "function") throw new TypeError(r + " is not a function");
    var s = Nn(this);
    return new s(function(o) {
      return i.subscribe({
        next: function(a) {
          try {
            a = r(a);
          } catch (c) {
            return o.error(c);
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
    var s = Nn(this);
    return new s(function(o) {
      return i.subscribe({
        next: function(a) {
          try {
            if (!r(a)) return;
          } catch (c) {
            return o.error(c);
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
    var s = Nn(this), o = arguments.length > 1, a = !1, c = arguments[1], l = c;
    return new s(function(u) {
      return i.subscribe({
        next: function(p) {
          var d = !a;
          if (a = !0, !d || o)
            try {
              l = r(l, p);
            } catch (y) {
              return u.error(y);
            }
          else
            l = p;
        },
        error: function(p) {
          u.error(p);
        },
        complete: function() {
          if (!a && !o) return u.error(new TypeError("Cannot reduce an empty sequence"));
          u.next(l), u.complete();
        }
      });
    });
  }, e.concat = function() {
    for (var r = this, i = arguments.length, s = new Array(i), o = 0; o < i; o++)
      s[o] = arguments[o];
    var a = Nn(this);
    return new a(function(c) {
      var l, u = 0;
      function p(d) {
        l = d.subscribe({
          next: function(y) {
            c.next(y);
          },
          error: function(y) {
            c.error(y);
          },
          complete: function() {
            u === s.length ? (l = void 0, c.complete()) : p(a.from(s[u++]));
          }
        });
      }
      return p(r), function() {
        l && (l.unsubscribe(), l = void 0);
      };
    });
  }, e.flatMap = function(r) {
    var i = this;
    if (typeof r != "function") throw new TypeError(r + " is not a function");
    var s = Nn(this);
    return new s(function(o) {
      var a = [], c = i.subscribe({
        next: function(u) {
          if (r)
            try {
              u = r(u);
            } catch (d) {
              return o.error(d);
            }
          var p = s.from(u).subscribe({
            next: function(d) {
              o.next(d);
            },
            error: function(d) {
              o.error(d);
            },
            complete: function() {
              var d = a.indexOf(p);
              d >= 0 && a.splice(d, 1), l();
            }
          });
          a.push(p);
        },
        error: function(u) {
          o.error(u);
        },
        complete: function() {
          l();
        }
      });
      function l() {
        c.closed && a.length === 0 && o.complete();
      }
      return function() {
        a.forEach(function(u) {
          return u.unsubscribe();
        }), c.unsubscribe();
      };
    });
  }, e[Hi] = function() {
    return this;
  }, n.from = function(r) {
    var i = typeof this == "function" ? this : n;
    if (r == null) throw new TypeError(r + " is not an object");
    var s = Br(r, Hi);
    if (s) {
      var o = s.call(r);
      if (Object(o) !== o) throw new TypeError(o + " is not an object");
      return rd(o) && o.constructor === i ? o : new i(function(a) {
        return o.subscribe(a);
      });
    }
    if (Ss("iterator") && (s = Br(r, nd), s))
      return new i(function(a) {
        xr(function() {
          if (!a.closed) {
            for (var c = ed(s.call(r)), l; !(l = c()).done; ) {
              var u = l.value;
              if (a.next(u), a.closed) return;
            }
            a.complete();
          }
        });
      });
    if (Array.isArray(r))
      return new i(function(a) {
        xr(function() {
          if (!a.closed) {
            for (var c = 0; c < r.length; ++c)
              if (a.next(r[c]), a.closed) return;
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
      xr(function() {
        if (!a.closed) {
          for (var c = 0; c < i.length; ++c)
            if (a.next(i[c]), a.closed) return;
          a.complete();
        }
      });
    });
  }, Es(n, null, [{
    key: Nu,
    get: function() {
      return this;
    }
  }]), n;
}();
_s() && Object.defineProperty(ee, Symbol("extensions"), {
  value: {
    symbol: Hi,
    hostReportError: pn
  },
  configurable: !0
});
function ad(n) {
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
var Zt;
typeof self < "u" ? Zt = self : typeof window < "u" ? Zt = window : typeof rt < "u" ? Zt = rt : typeof module < "u" ? Zt = module : Zt = Function("return this")();
ad(Zt);
var No = ee.prototype, Mo = "@@observable";
No[Mo] || (No[Mo] = function() {
  return this;
});
function ud(n) {
  return n.catch(function() {
  }), n;
}
var cd = Object.prototype.toString;
function Fu(n) {
  return zi(n);
}
function zi(n, e) {
  switch (cd.call(n)) {
    case "[object Array]": {
      if (e = e || /* @__PURE__ */ new Map(), e.has(n))
        return e.get(n);
      var t = n.slice(0);
      return e.set(n, t), t.forEach(function(i, s) {
        t[s] = zi(i, e);
      }), t;
    }
    case "[object Object]": {
      if (e = e || /* @__PURE__ */ new Map(), e.has(n))
        return e.get(n);
      var r = Object.create(Object.getPrototypeOf(n));
      return e.set(n, r), Object.keys(n).forEach(function(i) {
        r[i] = zi(n[i], e);
      }), r;
    }
    default:
      return n;
  }
}
function ld(n) {
  var e = /* @__PURE__ */ new Set([n]);
  return e.forEach(function(t) {
    ce(t) && fd(t) === t && Object.getOwnPropertyNames(t).forEach(function(r) {
      ce(t[r]) && e.add(t[r]);
    });
  }), n;
}
function fd(n) {
  if (globalThis.__DEV__ !== !1 && !Object.isFrozen(n))
    try {
      Object.freeze(n);
    } catch (e) {
      if (e instanceof TypeError)
        return null;
      throw e;
    }
  return n;
}
function Pr(n) {
  return globalThis.__DEV__ !== !1 && ld(n), n;
}
function Qn(n, e, t) {
  var r = [];
  n.forEach(function(i) {
    return i[e] && r.push(i);
  }), r.forEach(function(i) {
    return i[e](t);
  });
}
function bi(n, e, t) {
  return new ee(function(r) {
    var i = {
      // Normally we would initialize promiseQueue to Promise.resolve(), but
      // in this case, for backwards compatibility, we need to be careful to
      // invoke the first callback synchronously.
      then: function(c) {
        return new Promise(function(l) {
          return l(c());
        });
      }
    };
    function s(c, l) {
      return function(u) {
        if (c) {
          var p = function() {
            return r.closed ? (
              /* will be swallowed */
              0
            ) : c(u);
          };
          i = i.then(p, p).then(function(d) {
            return r.next(d);
          }, function(d) {
            return r.error(d);
          });
        } else
          r[l](u);
      };
    }
    var o = {
      next: s(e, "next"),
      error: s(t, "error"),
      complete: function() {
        i.then(function() {
          return r.complete();
        });
      }
    }, a = n.subscribe(o);
    return function() {
      return a.unsubscribe();
    };
  });
}
function Bu(n) {
  function e(t) {
    Object.defineProperty(n, t, { value: ee });
  }
  return au && Symbol.species && e(Symbol.species), e("@@species"), n;
}
function Do(n) {
  return n && typeof n.then == "function";
}
var en = (
  /** @class */
  function(n) {
    He(e, n);
    function e(t) {
      var r = n.call(this, function(i) {
        return r.addObserver(i), function() {
          return r.removeObserver(i);
        };
      }) || this;
      return r.observers = /* @__PURE__ */ new Set(), r.promise = new Promise(function(i, s) {
        r.resolve = i, r.reject = s;
      }), r.handlers = {
        next: function(i) {
          r.sub !== null && (r.latest = ["next", i], r.notify("next", i), Qn(r.observers, "next", i));
        },
        error: function(i) {
          var s = r.sub;
          s !== null && (s && setTimeout(function() {
            return s.unsubscribe();
          }), r.sub = null, r.latest = ["error", i], r.reject(i), r.notify("error", i), Qn(r.observers, "error", i));
        },
        complete: function() {
          var i = r, s = i.sub, o = i.sources, a = o === void 0 ? [] : o;
          if (s !== null) {
            var c = a.shift();
            c ? Do(c) ? c.then(function(l) {
              return r.sub = l.subscribe(r.handlers);
            }, r.handlers.error) : r.sub = c.subscribe(r.handlers) : (s && setTimeout(function() {
              return s.unsubscribe();
            }), r.sub = null, r.latest && r.latest[0] === "next" ? r.resolve(r.latest[1]) : r.resolve(), r.notify("complete"), Qn(r.observers, "complete"));
          }
        }
      }, r.nextResultListeners = /* @__PURE__ */ new Set(), r.cancel = function(i) {
        r.reject(i), r.sources = [], r.handlers.error(i);
      }, r.promise.catch(function(i) {
      }), typeof t == "function" && (t = [new ee(t)]), Do(t) ? t.then(function(i) {
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
      this.observers.has(t) || (this.deliverLastMessage(t), this.observers.add(t));
    }, e.prototype.removeObserver = function(t) {
      this.observers.delete(t) && this.observers.size < 1 && this.handlers.complete();
    }, e.prototype.notify = function(t, r) {
      var i = this.nextResultListeners;
      i.size && (this.nextResultListeners = /* @__PURE__ */ new Set(), i.forEach(function(s) {
        return s(t, r);
      }));
    }, e.prototype.beforeNext = function(t) {
      var r = !1;
      this.nextResultListeners.add(function(i, s) {
        r || (r = !0, t(i, s));
      });
    }, e;
  }(ee)
);
Bu(en);
function un(n) {
  return "incremental" in n;
}
function hd(n) {
  return "hasNext" in n && "data" in n;
}
function dd(n) {
  return un(n) || hd(n);
}
function pd(n) {
  return ce(n) && "payload" in n;
}
function Pu(n, e) {
  var t = n, r = new Nt();
  return un(e) && st(e.incremental) && e.incremental.forEach(function(i) {
    for (var s = i.data, o = i.path, a = o.length - 1; a >= 0; --a) {
      var c = o[a], l = !isNaN(+c), u = l ? [] : {};
      u[c] = s, s = u;
    }
    t = r.merge(t, s);
  }), t;
}
function Tr(n) {
  var e = Ki(n);
  return st(e);
}
function Ki(n) {
  var e = st(n.errors) ? n.errors.slice(0) : [];
  return un(n) && st(n.incremental) && n.incremental.forEach(function(t) {
    t.errors && e.push.apply(e, t.errors);
  }), e;
}
function yn() {
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
function wi(n, e) {
  return yn(n, e, e.variables && {
    variables: yn(x(x({}, n && n.variables), e.variables))
  });
}
function Ei(n) {
  return new ee(function(e) {
    e.error(n);
  });
}
var $u = function(n, e, t) {
  var r = new Error(t);
  throw r.name = "ServerError", r.response = n, r.statusCode = n.status, r.result = e, r;
};
function yd(n) {
  for (var e = [
    "query",
    "operationName",
    "variables",
    "extensions",
    "context"
  ], t = 0, r = Object.keys(n); t < r.length; t++) {
    var i = r[t];
    if (e.indexOf(i) < 0)
      throw Fe(46, i);
  }
  return n;
}
function md(n, e) {
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
function gd(n) {
  var e = {
    variables: n.variables || {},
    extensions: n.extensions || {},
    operationName: n.operationName,
    query: n.query
  };
  return e.operationName || (e.operationName = typeof e.query != "string" ? Ln(e.query) || void 0 : ""), e;
}
function vd(n, e) {
  var t = x({}, n), r = new Set(Object.keys(n));
  return Xe(e, {
    Variable: function(i, s, o) {
      o && o.kind !== "VariableDefinition" && r.delete(i.name.value);
    }
  }), r.forEach(function(i) {
    delete t[i];
  }), t;
}
function Fo(n, e) {
  return e ? e(n) : ee.of();
}
function Mn(n) {
  return typeof n == "function" ? new We(n) : n;
}
function mr(n) {
  return n.request.length <= 1;
}
var We = (
  /** @class */
  function() {
    function n(e) {
      e && (this.request = e);
    }
    return n.empty = function() {
      return new n(function() {
        return ee.of();
      });
    }, n.from = function(e) {
      return e.length === 0 ? n.empty() : e.map(Mn).reduce(function(t, r) {
        return t.concat(r);
      });
    }, n.split = function(e, t, r) {
      var i = Mn(t), s = Mn(r || new n(Fo)), o;
      return mr(i) && mr(s) ? o = new n(function(a) {
        return e(a) ? i.request(a) || ee.of() : s.request(a) || ee.of();
      }) : o = new n(function(a, c) {
        return e(a) ? i.request(a, c) || ee.of() : s.request(a, c) || ee.of();
      }), Object.assign(o, { left: i, right: s });
    }, n.execute = function(e, t) {
      return e.request(md(t.context, gd(yd(t)))) || ee.of();
    }, n.concat = function(e, t) {
      var r = Mn(e);
      if (mr(r))
        return globalThis.__DEV__ !== !1 && $.warn(38, r), r;
      var i = Mn(t), s;
      return mr(i) ? s = new n(function(o) {
        return r.request(o, function(a) {
          return i.request(a) || ee.of();
        }) || ee.of();
      }) : s = new n(function(o, a) {
        return r.request(o, function(c) {
          return i.request(c, a) || ee.of();
        }) || ee.of();
      }), Object.assign(s, { left: r, right: i });
    }, n.prototype.split = function(e, t, r) {
      return this.concat(n.split(e, t, r || new n(Fo)));
    }, n.prototype.concat = function(e) {
      return n.concat(this, e);
    }, n.prototype.request = function(e, t) {
      throw Fe(39);
    }, n.prototype.onError = function(e, t) {
      if (t && t.error)
        return t.error(e), !1;
      throw e;
    }, n.prototype.setOnError = function(e) {
      return this.onError = e, this;
    }, n;
  }()
), Bo = We.from, bd = We.split, Gi = We.execute;
function wd(n) {
  var e, t = n[Symbol.asyncIterator]();
  return e = {
    next: function() {
      return t.next();
    }
  }, e[Symbol.asyncIterator] = function() {
    return this;
  }, e;
}
function Ed(n) {
  var e = null, t = null, r = !1, i = [], s = [];
  function o(p) {
    if (!t) {
      if (s.length) {
        var d = s.shift();
        if (Array.isArray(d) && d[0])
          return d[0]({ value: p, done: !1 });
      }
      i.push(p);
    }
  }
  function a(p) {
    t = p;
    var d = s.slice();
    d.forEach(function(y) {
      y[1](p);
    }), !e || e();
  }
  function c() {
    r = !0;
    var p = s.slice();
    p.forEach(function(d) {
      d[0]({ value: void 0, done: !0 });
    }), !e || e();
  }
  e = function() {
    e = null, n.removeListener("data", o), n.removeListener("error", a), n.removeListener("end", c), n.removeListener("finish", c), n.removeListener("close", c);
  }, n.on("data", o), n.on("error", a), n.on("end", c), n.on("finish", c), n.on("close", c);
  function l() {
    return new Promise(function(p, d) {
      if (t)
        return d(t);
      if (i.length)
        return p({ value: i.shift(), done: !1 });
      if (r)
        return p({ value: void 0, done: !0 });
      s.push([p, d]);
    });
  }
  var u = {
    next: function() {
      return l();
    }
  };
  return zr && (u[Symbol.asyncIterator] = function() {
    return this;
  }), u;
}
function _d(n) {
  var e = !1, t = {
    next: function() {
      return e ? Promise.resolve({
        value: void 0,
        done: !0
      }) : (e = !0, new Promise(function(r, i) {
        n.then(function(s) {
          r({ value: s, done: !1 });
        }).catch(i);
      }));
    }
  };
  return zr && (t[Symbol.asyncIterator] = function() {
    return this;
  }), t;
}
function Po(n) {
  var e = {
    next: function() {
      return n.read();
    }
  };
  return zr && (e[Symbol.asyncIterator] = function() {
    return this;
  }), e;
}
function Sd(n) {
  return !!n.body;
}
function kd(n) {
  return !!n.getReader;
}
function xd(n) {
  return !!(zr && n[Symbol.asyncIterator]);
}
function Td(n) {
  return !!n.stream;
}
function Id(n) {
  return !!n.arrayBuffer;
}
function Ad(n) {
  return !!n.pipe;
}
function Od(n) {
  var e = n;
  if (Sd(n) && (e = n.body), xd(e))
    return wd(e);
  if (kd(e))
    return Po(e.getReader());
  if (Td(e))
    return Po(e.stream().getReader());
  if (Id(e))
    return _d(e.arrayBuffer());
  if (Ad(e))
    return Ed(e);
  throw new Error("Unknown body type for responseIterator. Please pass a streamable response.");
}
var Zr = Symbol();
function Lu(n) {
  return n.extensions ? Array.isArray(n.extensions[Zr]) : !1;
}
function Uu(n) {
  return n.hasOwnProperty("graphQLErrors");
}
var Cd = function(n) {
  var e = Me(Me(Me([], n.graphQLErrors, !0), n.clientErrors, !0), n.protocolErrors, !0);
  return n.networkError && e.push(n.networkError), e.map(function(t) {
    return ce(t) && t.message || "Error message not found.";
  }).join(`
`);
}, xt = (
  /** @class */
  function(n) {
    He(e, n);
    function e(t) {
      var r = t.graphQLErrors, i = t.protocolErrors, s = t.clientErrors, o = t.networkError, a = t.errorMessage, c = t.extraInfo, l = n.call(this, a) || this;
      return l.name = "ApolloError", l.graphQLErrors = r || [], l.protocolErrors = i || [], l.clientErrors = s || [], l.networkError = o || null, l.message = a || Cd(l), l.extraInfo = c, l.cause = Me(Me(Me([
        o
      ], r || [], !0), i || [], !0), s || [], !0).find(function(u) {
        return !!u;
      }) || null, l.__proto__ = e.prototype, l;
    }
    return e;
  }(Error)
), $o = Object.prototype.hasOwnProperty;
function Rd(n, e) {
  return _t(this, void 0, void 0, function() {
    var t, r, i, s, o, a, c, l, u, p, d, y, v, E, w, b, k, S, I, O, C, M, F, L;
    return St(this, function(V) {
      switch (V.label) {
        case 0:
          if (TextDecoder === void 0)
            throw new Error("TextDecoder must be defined in the environment: please import a polyfill.");
          t = new TextDecoder("utf-8"), r = (L = n.headers) === null || L === void 0 ? void 0 : L.get("content-type"), i = "boundary=", s = r?.includes(i) ? r?.substring(r?.indexOf(i) + i.length).replace(/['"]/g, "").replace(/\;(.*)/gm, "").trim() : "-", o = `\r
--`.concat(s), a = "", c = Od(n), l = !0, V.label = 1;
        case 1:
          return l ? [4, c.next()] : [3, 3];
        case 2:
          for (u = V.sent(), p = u.value, d = u.done, y = typeof p == "string" ? p : t.decode(p), v = a.length - o.length + 1, l = !d, a += y, E = a.indexOf(o, v); E > -1; ) {
            if (w = void 0, M = [
              a.slice(0, E),
              a.slice(E + o.length)
            ], w = M[0], a = M[1], b = w.indexOf(`\r
\r
`), k = Nd(w.slice(0, b)), S = k["content-type"], S && S.toLowerCase().indexOf("application/json") === -1)
              throw new Error("Unsupported patch content type: application/json is required.");
            if (I = w.slice(b), I) {
              if (O = qu(n, I), Object.keys(O).length > 1 || "data" in O || "incremental" in O || "errors" in O || "payload" in O)
                if (pd(O)) {
                  if (C = {}, "payload" in O) {
                    if (Object.keys(O).length === 1 && O.payload === null)
                      return [
                        2
                        /*return*/
                      ];
                    C = x({}, O.payload);
                  }
                  "errors" in O && (C = x(x({}, C), { extensions: x(x({}, "extensions" in C ? C.extensions : null), (F = {}, F[Zr] = O.errors, F)) })), e(C);
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
            E = a.indexOf(o);
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
function Nd(n) {
  var e = {};
  return n.split(`
`).forEach(function(t) {
    var r = t.indexOf(":");
    if (r > -1) {
      var i = t.slice(0, r).trim().toLowerCase(), s = t.slice(r + 1).trim();
      e[i] = s;
    }
  }), e;
}
function qu(n, e) {
  if (n.status >= 300) {
    var t = function() {
      try {
        return JSON.parse(e);
      } catch {
        return e;
      }
    };
    $u(n, t(), "Response not successful: Received status code ".concat(n.status));
  }
  try {
    return JSON.parse(e);
  } catch (i) {
    var r = i;
    throw r.name = "ServerParseError", r.response = n, r.statusCode = n.status, r.bodyText = e, r;
  }
}
function Md(n, e) {
  n.result && n.result.errors && n.result.data && e.next(n.result), e.error(n);
}
function Dd(n) {
  return function(e) {
    return e.text().then(function(t) {
      return qu(e, t);
    }).then(function(t) {
      return !Array.isArray(t) && !$o.call(t, "data") && !$o.call(t, "errors") && $u(e, t, "Server response was missing for query '".concat(Array.isArray(n) ? n.map(function(r) {
        return r.operationName;
      }) : n.operationName, "'.")), t;
    });
  };
}
var Ji = function(n, e) {
  var t;
  try {
    t = JSON.stringify(n);
  } catch (i) {
    var r = Fe(42, e, i.message);
    throw r.parseError = i, r;
  }
  return t;
}, Fd = {
  includeQuery: !0,
  includeExtensions: !1,
  preserveHeaderCase: !1
}, Bd = {
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
}, Pd = {
  method: "POST"
}, $d = {
  http: Fd,
  headers: Bd,
  options: Pd
}, Ld = function(n, e) {
  return e(n);
};
function Ud(n, e) {
  for (var t = [], r = 2; r < arguments.length; r++)
    t[r - 2] = arguments[r];
  var i = {}, s = {};
  t.forEach(function(p) {
    i = x(x(x({}, i), p.options), { headers: x(x({}, i.headers), p.headers) }), p.credentials && (i.credentials = p.credentials), s = x(x({}, s), p.http);
  }), i.headers && (i.headers = qd(i.headers, s.preserveHeaderCase));
  var o = n.operationName, a = n.extensions, c = n.variables, l = n.query, u = { operationName: o, variables: c };
  return s.includeExtensions && (u.extensions = a), s.includeQuery && (u.query = e(l, At)), {
    options: i,
    body: u
  };
}
function qd(n, e) {
  if (!e) {
    var t = {};
    return Object.keys(Object(n)).forEach(function(s) {
      t[s.toLowerCase()] = n[s];
    }), t;
  }
  var r = {};
  Object.keys(Object(n)).forEach(function(s) {
    r[s.toLowerCase()] = {
      originalName: s,
      value: n[s]
    };
  });
  var i = {};
  return Object.keys(r).forEach(function(s) {
    i[r[s].originalName] = r[s].value;
  }), i;
}
var jd = function(n) {
  if (!n && typeof fetch > "u")
    throw Fe(40);
}, Vd = function(n, e) {
  var t = n.getContext(), r = t.uri;
  return r || (typeof e == "function" ? e(n) : e || "/graphql");
};
function Qd(n, e) {
  var t = [], r = function(p, d) {
    t.push("".concat(p, "=").concat(encodeURIComponent(d)));
  };
  if ("query" in e && r("query", e.query), e.operationName && r("operationName", e.operationName), e.variables) {
    var i = void 0;
    try {
      i = Ji(e.variables, "Variables map");
    } catch (p) {
      return { parseError: p };
    }
    r("variables", i);
  }
  if (e.extensions) {
    var s = void 0;
    try {
      s = Ji(e.extensions, "Extensions map");
    } catch (p) {
      return { parseError: p };
    }
    r("extensions", s);
  }
  var o = "", a = n, c = n.indexOf("#");
  c !== -1 && (o = n.substr(c), a = n.substr(0, c));
  var l = a.indexOf("?") === -1 ? "?" : "&", u = a + l + t.join("&") + o;
  return { newURI: u };
}
var Lo = Ye(function() {
  return fetch;
}), ju = function(n) {
  n === void 0 && (n = {});
  var e = n.uri, t = e === void 0 ? "/graphql" : e, r = n.fetch, i = n.print, s = i === void 0 ? Ld : i, o = n.includeExtensions, a = n.preserveHeaderCase, c = n.useGETForQueries, l = n.includeUnusedVariables, u = l === void 0 ? !1 : l, p = it(n, ["uri", "fetch", "print", "includeExtensions", "preserveHeaderCase", "useGETForQueries", "includeUnusedVariables"]);
  globalThis.__DEV__ !== !1 && jd(r || Lo);
  var d = {
    http: { includeExtensions: o, preserveHeaderCase: a },
    options: p.fetchOptions,
    credentials: p.credentials,
    headers: p.headers
  };
  return new We(function(y) {
    var v = Vd(y, t), E = y.getContext(), w = {};
    if (E.clientAwareness) {
      var b = E.clientAwareness, k = b.name, S = b.version;
      k && (w["apollographql-client-name"] = k), S && (w["apollographql-client-version"] = S);
    }
    var I = x(x({}, w), E.headers), O = {
      http: E.http,
      options: E.fetchOptions,
      credentials: E.credentials,
      headers: I
    };
    if (Xn(["client"], y.query)) {
      var C = Ru(y.query);
      if (!C)
        return Ei(new Error("HttpLink: Trying to send a client-only query to the server. To send to the server, ensure a non-client field is added to the query or set the `transformOptions.removeClientFields` option to `true`."));
      y.query = C;
    }
    var M = Ud(y, s, $d, d, O), F = M.options, L = M.body;
    L.variables && !u && (L.variables = vd(L.variables, y.query));
    var V;
    !F.signal && typeof AbortController < "u" && (V = new AbortController(), F.signal = V.signal);
    var G = function(Q) {
      return Q.kind === "OperationDefinition" && Q.operation === "mutation";
    }, Ee = function(Q) {
      return Q.kind === "OperationDefinition" && Q.operation === "subscription";
    }, ie = Ee(En(y.query)), _e = Xn(["defer"], y.query);
    if (c && !y.query.definitions.some(G) && (F.method = "GET"), _e || ie) {
      F.headers = F.headers || {};
      var j = "multipart/mixed;";
      ie && _e && globalThis.__DEV__ !== !1 && $.warn(41), ie ? j += "boundary=graphql;subscriptionSpec=1.0,application/json" : _e && (j += "deferSpec=20220824,application/json"), F.headers.accept = j;
    }
    if (F.method === "GET") {
      var Z = Qd(v, L), q = Z.newURI, H = Z.parseError;
      if (H)
        return Ei(H);
      v = q;
    } else
      try {
        F.body = Ji(L, "Payload");
      } catch (Q) {
        return Ei(Q);
      }
    return new ee(function(Q) {
      var Se = r || Ye(function() {
        return fetch;
      }) || Lo, J = Q.next.bind(Q);
      return Se(v, F).then(function(Te) {
        var ze;
        y.setContext({ response: Te });
        var se = (ze = Te.headers) === null || ze === void 0 ? void 0 : ze.get("content-type");
        return se !== null && /^multipart\/mixed/i.test(se) ? Rd(Te, J) : Dd(y)(Te).then(J);
      }).then(function() {
        V = void 0, Q.complete();
      }).catch(function(Te) {
        V = void 0, Md(Te, Q);
      }), function() {
        V && V.abort();
      };
    });
  });
}, Hd = (
  /** @class */
  function(n) {
    He(e, n);
    function e(t) {
      t === void 0 && (t = {});
      var r = n.call(this, ju(t).request) || this;
      return r.options = t, r;
    }
    return e;
  }(We)
);
const { toString: Uo, hasOwnProperty: Wd } = Object.prototype, qo = Function.prototype.toString, Yi = /* @__PURE__ */ new Map();
function oe(n, e) {
  try {
    return Xi(n, e);
  } finally {
    Yi.clear();
  }
}
function Xi(n, e) {
  if (n === e)
    return !0;
  const t = Uo.call(n), r = Uo.call(e);
  if (t !== r)
    return !1;
  switch (t) {
    case "[object Array]":
      if (n.length !== e.length)
        return !1;
    case "[object Object]": {
      if (Vo(n, e))
        return !0;
      const i = jo(n), s = jo(e), o = i.length;
      if (o !== s.length)
        return !1;
      for (let a = 0; a < o; ++a)
        if (!Wd.call(e, i[a]))
          return !1;
      for (let a = 0; a < o; ++a) {
        const c = i[a];
        if (!Xi(n[c], e[c]))
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
      if (Vo(n, e))
        return !0;
      const i = n.entries(), s = t === "[object Map]";
      for (; ; ) {
        const o = i.next();
        if (o.done)
          break;
        const [a, c] = o.value;
        if (!e.has(a) || s && !Xi(c, e.get(a)))
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
      const i = qo.call(n);
      return i !== qo.call(e) ? !1 : !Gd(i, Kd);
    }
  }
  return !1;
}
function jo(n) {
  return Object.keys(n).filter(zd, n);
}
function zd(n) {
  return this[n] !== void 0;
}
const Kd = "{ [native code] }";
function Gd(n, e) {
  const t = n.length - e.length;
  return t >= 0 && n.indexOf(e, t) === t;
}
function Vo(n, e) {
  let t = Yi.get(n);
  if (t) {
    if (t.has(e))
      return !0;
  } else
    Yi.set(n, t = /* @__PURE__ */ new Set());
  return t.add(e), !1;
}
function Vu(n, e, t, r) {
  var i = e.data, s = it(e, ["data"]), o = t.data, a = it(t, ["data"]);
  return oe(s, a) && Ir(En(n).selectionSet, i, o, {
    fragmentMap: vn(wn(n)),
    variables: r
  });
}
function Ir(n, e, t, r) {
  if (e === t)
    return !0;
  var i = /* @__PURE__ */ new Set();
  return n.selections.every(function(s) {
    if (i.has(s) || (i.add(s), !or(s, r.variables)) || Qo(s))
      return !0;
    if (Ct(s)) {
      var o = gt(s), a = e && e[o], c = t && t[o], l = s.selectionSet;
      if (!l)
        return oe(a, c);
      var u = Array.isArray(a), p = Array.isArray(c);
      if (u !== p)
        return !1;
      if (u && p) {
        var d = a.length;
        if (c.length !== d)
          return !1;
        for (var y = 0; y < d; ++y)
          if (!Ir(l, a[y], c[y], r))
            return !1;
        return !0;
      }
      return Ir(l, a, c, r);
    } else {
      var v = Kr(s, r.fragmentMap);
      if (v)
        return Qo(v) ? !0 : Ir(
          v.selectionSet,
          // Notice that we reuse the same aResult and bResult values here,
          // since the fragment ...spread does not specify a field name, but
          // consists of multiple fields (within the fragment's selection set)
          // that should be applied to the current result value(s).
          e,
          t,
          r
        );
    }
  });
}
function Qo(n) {
  return !!n.directives && n.directives.some(Jd);
}
function Jd(n) {
  return n.name.value === "nonreactive";
}
var Qu = Wt ? WeakMap : Map, Hu = ps ? WeakSet : Set, xs = new ms(), Ho = !1;
function Wu() {
  Ho || (Ho = !0, globalThis.__DEV__ !== !1 && $.warn(52));
}
function zu(n, e, t) {
  return xs.withValue(!0, function() {
    var r = Un(n, e, t, !1);
    return Object.isFrozen(n) && Pr(r), r;
  });
}
function Yd(n, e) {
  if (e.has(n))
    return e.get(n);
  var t = Array.isArray(n) ? [] : /* @__PURE__ */ Object.create(null);
  return e.set(n, t), t;
}
function Un(n, e, t, r, i) {
  var s, o = t.knownChanged, a = Yd(n, t.mutableTargets);
  if (Array.isArray(n)) {
    for (var c = 0, l = Array.from(n.entries()); c < l.length; c++) {
      var u = l[c], p = u[0], d = u[1];
      if (d === null) {
        a[p] = null;
        continue;
      }
      var y = Un(d, e, t, r, globalThis.__DEV__ !== !1 ? "".concat(i || "", "[").concat(p, "]") : void 0);
      o.has(y) && o.add(a), a[p] = y;
    }
    return o.has(a) ? a : n;
  }
  for (var v = 0, E = e.selections; v < E.length; v++) {
    var w = E[v], b = void 0;
    if (r && o.add(a), w.kind === D.FIELD) {
      var k = gt(w), S = w.selectionSet;
      if (b = a[k] || n[k], b === void 0)
        continue;
      if (S && b !== null) {
        var y = Un(n[k], S, t, r, globalThis.__DEV__ !== !1 ? "".concat(i || "", ".").concat(k) : void 0);
        o.has(y) && (b = y);
      }
      globalThis.__DEV__ === !1 && (a[k] = b), globalThis.__DEV__ !== !1 && (r && k !== "__typename" && // either the field is not present in the memo object
      // or it has a `get` descriptor, not a `value` descriptor
      // => it is a warning accessor and we can overwrite it
      // with another accessor
      !(!((s = Object.getOwnPropertyDescriptor(a, k)) === null || s === void 0) && s.value) ? Object.defineProperty(a, k, Xd(k, b, i || "", t.operationName, t.operationType)) : (delete a[k], a[k] = b));
    }
    if (w.kind === D.INLINE_FRAGMENT && (!w.typeCondition || t.cache.fragmentMatches(w, n.__typename)) && (b = Un(n, w.selectionSet, t, r, i)), w.kind === D.FRAGMENT_SPREAD) {
      var I = w.name.value, O = t.fragmentMap[I] || (t.fragmentMap[I] = t.cache.lookupFragment(I));
      $(O, 47, I);
      var C = Xf(w);
      C !== "mask" && (b = Un(n, O.selectionSet, t, C === "migrate", i));
    }
    o.has(b) && o.add(a);
  }
  return "__typename" in n && !("__typename" in a) && (a.__typename = n.__typename), Object.keys(a).length !== Object.keys(n).length && o.add(a), o.has(a) ? a : n;
}
function Xd(n, e, t, r, i) {
  var s = function() {
    return xs.getValue() || (globalThis.__DEV__ !== !1 && $.warn(48, r ? "".concat(i, " '").concat(r, "'") : "anonymous ".concat(i), "".concat(t, ".").concat(n).replace(/^\./, "")), s = function() {
      return e;
    }), e;
  };
  return {
    get: function() {
      return s();
    },
    set: function(o) {
      s = function() {
        return o;
      };
    },
    enumerable: !0,
    configurable: !0
  };
}
function Ku(n, e, t, r) {
  if (!t.fragmentMatches)
    return globalThis.__DEV__ !== !1 && Wu(), n;
  var i = e.definitions.filter(function(o) {
    return o.kind === D.FRAGMENT_DEFINITION;
  });
  typeof r > "u" && ($(i.length === 1, 49, i.length), r = i[0].name.value);
  var s = i.find(function(o) {
    return o.name.value === r;
  });
  return $(!!s, 50, r), n == null || oe(n, {}) ? n : zu(n, s.selectionSet, {
    operationType: "fragment",
    operationName: s.name.value,
    fragmentMap: vn(wn(e)),
    cache: t,
    mutableTargets: new Qu(),
    knownChanged: new Hu()
  });
}
function Zd(n, e, t) {
  var r;
  if (!t.fragmentMatches)
    return globalThis.__DEV__ !== !1 && Wu(), n;
  var i = Qt(e);
  return $(i, 51), n == null ? n : zu(n, i.selectionSet, {
    operationType: i.operation,
    operationName: (r = i.name) === null || r === void 0 ? void 0 : r.value,
    fragmentMap: vn(wn(e)),
    cache: t,
    mutableTargets: new Qu(),
    knownChanged: new Hu()
  });
}
var Gu = (
  /** @class */
  function() {
    function n() {
      this.assumeImmutableResults = !1, this.getFragmentDoc = er(ih, {
        max: mt["cache.fragmentQueryDocuments"] || 1e3,
        cache: Fr
      });
    }
    return n.prototype.lookupFragment = function(e) {
      return null;
    }, n.prototype.batch = function(e) {
      var t = this, r = typeof e.optimistic == "string" ? e.optimistic : e.optimistic === !1 ? null : void 0, i;
      return this.performTransaction(function() {
        return i = e.update(t);
      }, r), i;
    }, n.prototype.recordOptimisticTransaction = function(e, t) {
      this.performTransaction(e, t);
    }, n.prototype.transformDocument = function(e) {
      return e;
    }, n.prototype.transformForLink = function(e) {
      return e;
    }, n.prototype.identify = function(e) {
    }, n.prototype.gc = function() {
      return [];
    }, n.prototype.modify = function(e) {
      return !1;
    }, n.prototype.readQuery = function(e, t) {
      return t === void 0 && (t = !!e.optimistic), this.read(x(x({}, e), { rootId: e.id || "ROOT_QUERY", optimistic: t }));
    }, n.prototype.watchFragment = function(e) {
      var t = this, r = e.fragment, i = e.fragmentName, s = e.from, o = e.optimistic, a = o === void 0 ? !0 : o, c = it(e, ["fragment", "fragmentName", "from", "optimistic"]), l = this.getFragmentDoc(r, i), u = typeof s > "u" || typeof s == "string" ? s : this.identify(s), p = !!e[Symbol.for("apollo.dataMasking")];
      if (globalThis.__DEV__ !== !1) {
        var d = i || mu(r).name.value;
        u || globalThis.__DEV__ !== !1 && $.warn(1, d);
      }
      var y = x(x({}, c), { returnPartialData: !0, id: u, query: l, optimistic: a }), v;
      return new ee(function(E) {
        return t.watch(x(x({}, y), { immediate: !0, callback: function(w) {
          var b = p ? Ku(w.result, r, t, i) : w.result;
          if (
            // Always ensure we deliver the first result
            !(v && Vu(
              l,
              { data: v.result },
              { data: b },
              // TODO: Fix the type on WatchFragmentOptions so that TVars
              // extends OperationVariables
              e.variables
            ))
          ) {
            var k = {
              data: b,
              complete: !!w.complete
            };
            w.missing && (k.missing = Xr(w.missing.map(function(S) {
              return S.missing;
            }))), v = x(x({}, w), { result: b }), E.next(k);
          }
        } }));
      });
    }, n.prototype.readFragment = function(e, t) {
      return t === void 0 && (t = !!e.optimistic), this.read(x(x({}, e), { query: this.getFragmentDoc(e.fragment, e.fragmentName), rootId: e.id, optimistic: t }));
    }, n.prototype.writeQuery = function(e) {
      var t = e.id, r = e.data, i = it(e, ["id", "data"]);
      return this.write(Object.assign(i, {
        dataId: t || "ROOT_QUERY",
        result: r
      }));
    }, n.prototype.writeFragment = function(e) {
      var t = e.id, r = e.data, i = e.fragment, s = e.fragmentName, o = it(e, ["id", "data", "fragment", "fragmentName"]);
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
  }()
);
globalThis.__DEV__ !== !1 && (Gu.prototype.getMemoryInternals = mh);
var Ju = (
  /** @class */
  function(n) {
    He(e, n);
    function e(t, r, i, s) {
      var o, a = n.call(this, t) || this;
      if (a.message = t, a.path = r, a.query = i, a.variables = s, Array.isArray(a.path)) {
        a.missing = a.message;
        for (var c = a.path.length - 1; c >= 0; --c)
          a.missing = (o = {}, o[a.path[c]] = a.missing, o);
      } else
        a.missing = a.path;
      return a.__proto__ = e.prototype, a;
    }
    return e;
  }(Error)
), ke = Object.prototype.hasOwnProperty;
function Dn(n) {
  return n == null;
}
function Yu(n, e) {
  var t = n.__typename, r = n.id, i = n._id;
  if (typeof t == "string" && (e && (e.keyObject = Dn(r) ? Dn(i) ? void 0 : { _id: i } : { id: r }), Dn(r) && !Dn(i) && (r = i), !Dn(r)))
    return "".concat(t, ":").concat(typeof r == "number" || typeof r == "string" ? r : JSON.stringify(r));
}
var Xu = {
  dataIdFromObject: Yu,
  addTypename: !0,
  resultCaching: !0,
  // Thanks to the shouldCanonizeResults helper, this should be the only line
  // you have to change to reenable canonization by default in the future.
  canonizeResults: !1
};
function ep(n) {
  return yn(Xu, n);
}
function Zu(n) {
  var e = n.canonizeResults;
  return e === void 0 ? Xu.canonizeResults : e;
}
function tp(n, e) {
  return X(e) ? n.get(e.__ref, "__typename") : e && e.__typename;
}
var ec = /^[_a-z][_0-9a-z]*/i;
function Mt(n) {
  var e = n.match(ec);
  return e ? e[0] : n;
}
function Zi(n, e, t) {
  return ce(e) ? de(e) ? e.every(function(r) {
    return Zi(n, r, t);
  }) : n.selections.every(function(r) {
    if (Ct(r) && or(r, t)) {
      var i = gt(r);
      return ke.call(e, i) && (!r.selectionSet || Zi(r.selectionSet, e[i], t));
    }
    return !0;
  }) : !1;
}
function rn(n) {
  return ce(n) && !X(n) && !de(n);
}
function np() {
  return new Nt();
}
function tc(n, e) {
  var t = vn(wn(n));
  return {
    fragmentMap: t,
    lookupFragment: function(r) {
      var i = t[r];
      return !i && e && (i = e.lookup(r)), i || null;
    }
  };
}
var Ar = /* @__PURE__ */ Object.create(null), _i = function() {
  return Ar;
}, Wo = /* @__PURE__ */ Object.create(null), ei = (
  /** @class */
  function() {
    function n(e, t) {
      var r = this;
      this.policies = e, this.group = t, this.data = /* @__PURE__ */ Object.create(null), this.rootIds = /* @__PURE__ */ Object.create(null), this.refs = /* @__PURE__ */ Object.create(null), this.getFieldValue = function(i, s) {
        return Pr(X(i) ? r.get(i.__ref, s) : i && i[s]);
      }, this.canRead = function(i) {
        return X(i) ? r.has(i.__ref) : typeof i == "object";
      }, this.toReference = function(i, s) {
        if (typeof i == "string")
          return an(i);
        if (X(i))
          return i;
        var o = r.policies.identify(i)[0];
        if (o) {
          var a = an(o);
          return s && r.merge(o, i), a;
        }
      };
    }
    return n.prototype.toObject = function() {
      return x({}, this.data);
    }, n.prototype.has = function(e) {
      return this.lookup(e, !0) !== void 0;
    }, n.prototype.get = function(e, t) {
      if (this.group.depend(e, t), ke.call(this.data, e)) {
        var r = this.data[e];
        if (r && ke.call(r, t))
          return r[t];
      }
      if (t === "__typename" && ke.call(this.policies.rootTypenamesById, e))
        return this.policies.rootTypenamesById[e];
      if (this instanceof wt)
        return this.parent.get(e, t);
    }, n.prototype.lookup = function(e, t) {
      if (t && this.group.depend(e, "__exists"), ke.call(this.data, e))
        return this.data[e];
      if (this instanceof wt)
        return this.parent.lookup(e, t);
      if (this.policies.rootTypenamesById[e])
        return /* @__PURE__ */ Object.create(null);
    }, n.prototype.merge = function(e, t) {
      var r = this, i;
      X(e) && (e = e.__ref), X(t) && (t = t.__ref);
      var s = typeof e == "string" ? this.lookup(i = e) : e, o = typeof t == "string" ? this.lookup(i = t) : t;
      if (o) {
        $(typeof i == "string", 2);
        var a = new Nt(ip).merge(s, o);
        if (this.data[i] = a, a !== s && (delete this.refs[i], this.group.caching)) {
          var c = /* @__PURE__ */ Object.create(null);
          s || (c.__exists = 1), Object.keys(o).forEach(function(l) {
            if (!s || s[l] !== a[l]) {
              c[l] = 1;
              var u = Mt(l);
              u !== l && !r.policies.hasKeyArgs(a.__typename, u) && (c[u] = 1), a[l] === void 0 && !(r instanceof wt) && delete a[l];
            }
          }), c.__typename && !(s && s.__typename) && // Since we return default root __typename strings
          // automatically from store.get, we don't need to dirty the
          // ROOT_QUERY.__typename field if merged.__typename is equal
          // to the default string (usually "Query").
          this.policies.rootTypenamesById[i] === a.__typename && delete c.__typename, Object.keys(c).forEach(function(l) {
            return r.group.dirty(i, l);
          });
        }
      }
    }, n.prototype.modify = function(e, t) {
      var r = this, i = this.lookup(e);
      if (i) {
        var s = /* @__PURE__ */ Object.create(null), o = !1, a = !0, c = {
          DELETE: Ar,
          INVALIDATE: Wo,
          isReference: X,
          toReference: this.toReference,
          canRead: this.canRead,
          readField: function(l, u) {
            return r.policies.readField(typeof l == "string" ? {
              fieldName: l,
              from: u || an(e)
            } : l, { store: r });
          }
        };
        if (Object.keys(i).forEach(function(l) {
          var u = Mt(l), p = i[l];
          if (p !== void 0) {
            var d = typeof t == "function" ? t : t[l] || t[u];
            if (d) {
              var y = d === _i ? Ar : d(Pr(p), x(x({}, c), { fieldName: u, storeFieldName: l, storage: r.getStorage(e, l) }));
              if (y === Wo)
                r.group.dirty(e, l);
              else if (y === Ar && (y = void 0), y !== p && (s[l] = y, o = !0, p = y, globalThis.__DEV__ !== !1)) {
                var v = function(O) {
                  if (r.lookup(O.__ref) === void 0)
                    return globalThis.__DEV__ !== !1 && $.warn(3, O), !0;
                };
                if (X(y))
                  v(y);
                else if (Array.isArray(y))
                  for (var E = !1, w = void 0, b = 0, k = y; b < k.length; b++) {
                    var S = k[b];
                    if (X(S)) {
                      if (E = !0, v(S))
                        break;
                    } else if (typeof S == "object" && S) {
                      var I = r.policies.identify(S)[0];
                      I && (w = S);
                    }
                    if (E && w !== void 0) {
                      globalThis.__DEV__ !== !1 && $.warn(4, w);
                      break;
                    }
                  }
              }
            }
            p !== void 0 && (a = !1);
          }
        }), o)
          return this.merge(e, s), a && (this instanceof wt ? this.data[e] = void 0 : delete this.data[e], this.group.dirty(e, "__exists")), !0;
      }
      return !1;
    }, n.prototype.delete = function(e, t, r) {
      var i, s = this.lookup(e);
      if (s) {
        var o = this.getFieldValue(s, "__typename"), a = t && r ? this.policies.getStoreFieldName({ typename: o, fieldName: t, args: r }) : t;
        return this.modify(e, a ? (i = {}, i[a] = _i, i) : _i);
      }
      return !1;
    }, n.prototype.evict = function(e, t) {
      var r = !1;
      return e.id && (ke.call(this.data, e.id) && (r = this.delete(e.id, e.fieldName, e.args)), this instanceof wt && this !== t && (r = this.parent.evict(e, t) || r), (e.fieldName || r) && this.group.dirty(e.id, e.fieldName || "__exists")), r;
    }, n.prototype.clear = function() {
      this.replace(null);
    }, n.prototype.extract = function() {
      var e = this, t = this.toObject(), r = [];
      return this.getRootIdSet().forEach(function(i) {
        ke.call(e.policies.rootTypenamesById, i) || r.push(i);
      }), r.length && (t.__META = { extraRootIds: r.sort() }), t;
    }, n.prototype.replace = function(e) {
      var t = this;
      if (Object.keys(this.data).forEach(function(s) {
        e && ke.call(e, s) || t.delete(s);
      }), e) {
        var r = e.__META, i = it(e, ["__META"]);
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
        ke.call(r, o) && (Object.keys(e.findChildRefIds(o)).forEach(t.add, t), delete r[o]);
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
      if (!ke.call(this.refs, e)) {
        var t = this.refs[e] = /* @__PURE__ */ Object.create(null), r = this.data[e];
        if (!r)
          return t;
        var i = /* @__PURE__ */ new Set([r]);
        i.forEach(function(s) {
          X(s) && (t[s.__ref] = !0), ce(s) && Object.keys(s).forEach(function(o) {
            var a = s[o];
            ce(a) && i.add(a);
          });
        });
      }
      return this.refs[e];
    }, n.prototype.makeCacheKey = function() {
      return this.group.keyMaker.lookupArray(arguments);
    }, n;
  }()
), nc = (
  /** @class */
  function() {
    function n(e, t) {
      t === void 0 && (t = null), this.caching = e, this.parent = t, this.d = null, this.resetCaching();
    }
    return n.prototype.resetCaching = function() {
      this.d = this.caching ? Iu() : null, this.keyMaker = new vt(Wt);
    }, n.prototype.depend = function(e, t) {
      if (this.d) {
        this.d(Si(e, t));
        var r = Mt(t);
        r !== t && this.d(Si(e, r)), this.parent && this.parent.depend(e, t);
      }
    }, n.prototype.dirty = function(e, t) {
      this.d && this.d.dirty(
        Si(e, t),
        // When storeFieldName === "__exists", that means the entity identified
        // by dataId has either disappeared from the cache or was newly added,
        // so the result caching system would do well to "forget everything it
        // knows" about that object. To achieve that kind of invalidation, we
        // not only dirty the associated result cache entry, but also remove it
        // completely from the dependency graph. For the optimism implementation
        // details, see https://github.com/benjamn/optimism/pull/195.
        t === "__exists" ? "forget" : "setDirty"
      );
    }, n;
  }()
);
function Si(n, e) {
  return e + "#" + n;
}
function zo(n, e) {
  Hn(n) && n.group.depend(e, "__exists");
}
(function(n) {
  var e = (
    /** @class */
    function(t) {
      He(r, t);
      function r(i) {
        var s = i.policies, o = i.resultCaching, a = o === void 0 ? !0 : o, c = i.seed, l = t.call(this, s, new nc(a)) || this;
        return l.stump = new rp(l), l.storageTrie = new vt(Wt), c && l.replace(c), l;
      }
      return r.prototype.addLayer = function(i, s) {
        return this.stump.addLayer(i, s);
      }, r.prototype.removeLayer = function() {
        return this;
      }, r.prototype.getStorage = function() {
        return this.storageTrie.lookupArray(arguments);
      }, r;
    }(n)
  );
  n.Root = e;
})(ei);
var wt = (
  /** @class */
  function(n) {
    He(e, n);
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
        a ? o ? o !== a && Object.keys(o).forEach(function(c) {
          oe(o[c], a[c]) || r.group.dirty(s, c);
        }) : (r.group.dirty(s, "__exists"), Object.keys(a).forEach(function(c) {
          r.group.dirty(s, c);
        })) : r.delete(s);
      }), i) : i === this.parent ? this : i.addLayer(this.id, this.replay);
    }, e.prototype.toObject = function() {
      return x(x({}, this.parent.toObject()), this.data);
    }, e.prototype.findChildRefIds = function(t) {
      var r = this.parent.findChildRefIds(t);
      return ke.call(this.data, t) ? x(x({}, r), n.prototype.findChildRefIds.call(this, t)) : r;
    }, e.prototype.getStorage = function() {
      for (var t = this.parent; t.parent; )
        t = t.parent;
      return t.getStorage.apply(
        t,
        // @ts-expect-error
        arguments
      );
    }, e;
  }(ei)
), rp = (
  /** @class */
  function(n) {
    He(e, n);
    function e(t) {
      return n.call(this, "EntityStore.Stump", t, function() {
      }, new nc(t.group.caching, t.group)) || this;
    }
    return e.prototype.removeLayer = function() {
      return this;
    }, e.prototype.merge = function(t, r) {
      return this.parent.merge(t, r);
    }, e;
  }(wt)
);
function ip(n, e, t) {
  var r = n[t], i = e[t];
  return oe(r, i) ? r : i;
}
function Hn(n) {
  return !!(n instanceof ei && n.group.caching);
}
function sp(n) {
  return ce(n) ? de(n) ? n.slice(0) : x({ __proto__: Object.getPrototypeOf(n) }, n) : n;
}
var Ko = (
  /** @class */
  function() {
    function n() {
      this.known = new (ps ? WeakSet : Set)(), this.pool = new vt(Wt), this.passes = /* @__PURE__ */ new WeakMap(), this.keysByJSON = /* @__PURE__ */ new Map(), this.empty = this.admit({});
    }
    return n.prototype.isKnown = function(e) {
      return ce(e) && this.known.has(e);
    }, n.prototype.pass = function(e) {
      if (ce(e)) {
        var t = sp(e);
        return this.passes.set(t, e), t;
      }
      return e;
    }, n.prototype.admit = function(e) {
      var t = this;
      if (ce(e)) {
        var r = this.passes.get(e);
        if (r)
          return r;
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
            var a = Object.getPrototypeOf(e), c = [a], l = this.sortedKeys(e);
            c.push(l.json);
            var u = c.length;
            l.sorted.forEach(function(y) {
              c.push(t.admit(e[y]));
            });
            var o = this.pool.lookupArray(c);
            if (!o.object) {
              var p = o.object = Object.create(a);
              this.known.add(p), l.sorted.forEach(function(y, v) {
                p[y] = c[u + v];
              }), globalThis.__DEV__ !== !1 && Object.freeze(p);
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
  }()
);
function Go(n) {
  return [
    n.selectionSet,
    n.objectOrReference,
    n.context,
    // We split out this property so we can pass different values
    // independently without modifying options.context itself.
    n.context.canonizeResults
  ];
}
var op = (
  /** @class */
  function() {
    function n(e) {
      var t = this;
      this.knownResults = new (Wt ? WeakMap : Map)(), this.config = yn(e, {
        addTypename: e.addTypename !== !1,
        canonizeResults: Zu(e)
      }), this.canon = e.canon || new Ko(), this.executeSelectionSet = er(function(r) {
        var i, s = r.context.canonizeResults, o = Go(r);
        o[3] = !s;
        var a = (i = t.executeSelectionSet).peek.apply(i, o);
        return a ? s ? x(x({}, a), {
          // If we previously read this result without canonizing it, we can
          // reuse that result simply by canonizing it now.
          result: t.canon.admit(a.result)
        }) : a : (zo(r.context.store, r.enclosingRef.__ref), t.execSelectionSetImpl(r));
      }, {
        max: this.config.resultCacheMaxSize || mt["inMemoryCache.executeSelectionSet"] || 5e4,
        keyArgs: Go,
        // Note that the parameters of makeCacheKey are determined by the
        // array returned by keyArgs.
        makeCacheKey: function(r, i, s, o) {
          if (Hn(s.store))
            return s.store.makeCacheKey(r, X(i) ? i.__ref : i, s.varString, o);
        }
      }), this.executeSubSelectedArray = er(function(r) {
        return zo(r.context.store, r.enclosingRef.__ref), t.execSubSelectedArrayImpl(r);
      }, {
        max: this.config.resultCacheMaxSize || mt["inMemoryCache.executeSubSelectedArray"] || 1e4,
        makeCacheKey: function(r) {
          var i = r.field, s = r.array, o = r.context;
          if (Hn(o.store))
            return o.store.makeCacheKey(i, s, o.varString);
        }
      });
    }
    return n.prototype.resetCanon = function() {
      this.canon = new Ko();
    }, n.prototype.diffQueryAgainstStore = function(e) {
      var t = e.store, r = e.query, i = e.rootId, s = i === void 0 ? "ROOT_QUERY" : i, o = e.variables, a = e.returnPartialData, c = a === void 0 ? !0 : a, l = e.canonizeResults, u = l === void 0 ? this.config.canonizeResults : l, p = this.config.cache.policies;
      o = x(x({}, ys(yu(r))), o);
      var d = an(s), y = this.executeSelectionSet({
        selectionSet: En(r).selectionSet,
        objectOrReference: d,
        enclosingRef: d,
        context: x({ store: t, query: r, policies: p, variables: o, varString: Ot(o), canonizeResults: u }, tc(r, this.config.fragments))
      }), v;
      if (y.missing && (v = [
        new Ju(ap(y.missing), y.missing, r, o)
      ], !c))
        throw v[0];
      return {
        result: y.result,
        complete: !v,
        missing: v
      };
    }, n.prototype.isFresh = function(e, t, r, i) {
      if (Hn(i.store) && this.knownResults.get(e) === r) {
        var s = this.executeSelectionSet.peek(
          r,
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
    }, n.prototype.execSelectionSetImpl = function(e) {
      var t = this, r = e.selectionSet, i = e.objectOrReference, s = e.enclosingRef, o = e.context;
      if (X(i) && !o.policies.rootTypenamesById[i.__ref] && !o.store.has(i.__ref))
        return {
          result: this.canon.empty,
          missing: "Dangling reference to missing ".concat(i.__ref, " object")
        };
      var a = o.variables, c = o.policies, l = o.store, u = l.getFieldValue(i, "__typename"), p = [], d, y = new Nt();
      this.config.addTypename && typeof u == "string" && !c.rootIdsByTypename[u] && p.push({ __typename: u });
      function v(S, I) {
        var O;
        return S.missing && (d = y.merge(d, (O = {}, O[I] = S.missing, O))), S.result;
      }
      var E = new Set(r.selections);
      E.forEach(function(S) {
        var I, O;
        if (or(S, a))
          if (Ct(S)) {
            var C = c.readField({
              fieldName: S.name.value,
              field: S,
              variables: o.variables,
              from: i
            }, o), M = gt(S);
            C === void 0 ? ws.added(S) || (d = y.merge(d, (I = {}, I[M] = "Can't find field '".concat(S.name.value, "' on ").concat(X(i) ? i.__ref + " object" : "object " + JSON.stringify(i, null, 2)), I))) : de(C) ? C.length > 0 && (C = v(t.executeSubSelectedArray({
              field: S,
              array: C,
              enclosingRef: s,
              context: o
            }), M)) : S.selectionSet ? C != null && (C = v(t.executeSelectionSet({
              selectionSet: S.selectionSet,
              objectOrReference: C,
              enclosingRef: X(C) ? C : s,
              context: o
            }), M)) : o.canonizeResults && (C = t.canon.pass(C)), C !== void 0 && p.push((O = {}, O[M] = C, O));
          } else {
            var F = Kr(S, o.lookupFragment);
            if (!F && S.kind === D.FRAGMENT_SPREAD)
              throw Fe(10, S.name.value);
            F && c.fragmentMatches(F, u) && F.selectionSet.selections.forEach(E.add, E);
          }
      });
      var w = Xr(p), b = { result: w, missing: d }, k = o.canonizeResults ? this.canon.admit(b) : Pr(b);
      return k.result && this.knownResults.set(k.result, r), k;
    }, n.prototype.execSubSelectedArrayImpl = function(e) {
      var t = this, r = e.field, i = e.array, s = e.enclosingRef, o = e.context, a, c = new Nt();
      function l(u, p) {
        var d;
        return u.missing && (a = c.merge(a, (d = {}, d[p] = u.missing, d))), u.result;
      }
      return r.selectionSet && (i = i.filter(o.store.canRead)), i = i.map(function(u, p) {
        return u === null ? null : de(u) ? l(t.executeSubSelectedArray({
          field: r,
          array: u,
          enclosingRef: s,
          context: o
        }), p) : r.selectionSet ? l(t.executeSelectionSet({
          selectionSet: r.selectionSet,
          objectOrReference: u,
          enclosingRef: X(u) ? u : s,
          context: o
        }), p) : (globalThis.__DEV__ !== !1 && up(o.store, r, u), u);
      }), {
        result: o.canonizeResults ? this.canon.admit(i) : i,
        missing: a
      };
    }, n;
  }()
);
function ap(n) {
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
function up(n, e, t) {
  if (!e.selectionSet) {
    var r = /* @__PURE__ */ new Set([t]);
    r.forEach(function(i) {
      ce(i) && ($(
        !X(i),
        11,
        tp(n, i),
        e.name.value
      ), Object.values(i).forEach(r.add, r));
    });
  }
}
var Ts = new ms(), Jo = /* @__PURE__ */ new WeakMap();
function Wn(n) {
  var e = Jo.get(n);
  return e || Jo.set(n, e = {
    vars: /* @__PURE__ */ new Set(),
    dep: Iu()
  }), e;
}
function Yo(n) {
  Wn(n).vars.forEach(function(e) {
    return e.forgetCache(n);
  });
}
function cp(n) {
  Wn(n).vars.forEach(function(e) {
    return e.attachCache(n);
  });
}
function lp(n) {
  var e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set(), r = function(s) {
    if (arguments.length > 0) {
      if (n !== s) {
        n = s, e.forEach(function(c) {
          Wn(c).dep.dirty(r), fp(c);
        });
        var o = Array.from(t);
        t.clear(), o.forEach(function(c) {
          return c(n);
        });
      }
    } else {
      var a = Ts.getValue();
      a && (i(a), Wn(a).dep(r));
    }
    return n;
  };
  r.onNextChange = function(s) {
    return t.add(s), function() {
      t.delete(s);
    };
  };
  var i = r.attachCache = function(s) {
    return e.add(s), Wn(s).vars.add(r), r;
  };
  return r.forgetCache = function(s) {
    return e.delete(s);
  }, r;
}
function fp(n) {
  n.broadcastWatches && n.broadcastWatches();
}
var Xo = /* @__PURE__ */ Object.create(null);
function Is(n) {
  var e = JSON.stringify(n);
  return Xo[e] || (Xo[e] = /* @__PURE__ */ Object.create(null));
}
function Zo(n) {
  var e = Is(n);
  return e.keyFieldsFn || (e.keyFieldsFn = function(t, r) {
    var i = function(o, a) {
      return r.readField(a, o);
    }, s = r.keyObject = As(n, function(o) {
      var a = cn(
        r.storeObject,
        o,
        // Using context.readField to extract paths from context.storeObject
        // allows the extraction to see through Reference objects and respect
        // custom read functions.
        i
      );
      return a === void 0 && t !== r.storeObject && ke.call(t, o[0]) && (a = cn(t, o, ic)), $(a !== void 0, 5, o.join("."), t), a;
    });
    return "".concat(r.typename, ":").concat(JSON.stringify(s));
  });
}
function ea(n) {
  var e = Is(n);
  return e.keyArgsFn || (e.keyArgsFn = function(t, r) {
    var i = r.field, s = r.variables, o = r.fieldName, a = As(n, function(l) {
      var u = l[0], p = u.charAt(0);
      if (p === "@") {
        if (i && st(i.directives)) {
          var d = u.slice(1), y = i.directives.find(function(b) {
            return b.name.value === d;
          }), v = y && Gr(y, s);
          return v && cn(
            v,
            // If keyPath.length === 1, this code calls extractKeyPath with an
            // empty path, which works because it uses directiveArgs as the
            // extracted value.
            l.slice(1)
          );
        }
        return;
      }
      if (p === "$") {
        var E = u.slice(1);
        if (s && ke.call(s, E)) {
          var w = l.slice(0);
          return w[0] = E, cn(s, w);
        }
        return;
      }
      if (t)
        return cn(t, l);
    }), c = JSON.stringify(a);
    return (t || c !== "{}") && (o += ":" + c), o;
  });
}
function As(n, e) {
  var t = new Nt();
  return rc(n).reduce(function(r, i) {
    var s, o = e(i);
    if (o !== void 0) {
      for (var a = i.length - 1; a >= 0; --a)
        o = (s = {}, s[i[a]] = o, s);
      r = t.merge(r, o);
    }
    return r;
  }, /* @__PURE__ */ Object.create(null));
}
function rc(n) {
  var e = Is(n);
  if (!e.paths) {
    var t = e.paths = [], r = [];
    n.forEach(function(i, s) {
      de(i) ? (rc(i).forEach(function(o) {
        return t.push(r.concat(o));
      }), r.length = 0) : (r.push(i), de(n[s + 1]) || (t.push(r.slice(0)), r.length = 0));
    });
  }
  return e.paths;
}
function ic(n, e) {
  return n[e];
}
function cn(n, e, t) {
  return t = t || ic, sc(e.reduce(function r(i, s) {
    return de(i) ? i.map(function(o) {
      return r(o, s);
    }) : i && t(i, s);
  }, n));
}
function sc(n) {
  return ce(n) ? de(n) ? n.map(sc) : As(Object.keys(n).sort(), function(e) {
    return cn(n, e);
  }) : n;
}
function es(n) {
  return n.args !== void 0 ? n.args : n.field ? Gr(n.field, n.variables) : null;
}
var hp = function() {
}, ta = function(n, e) {
  return e.fieldName;
}, na = function(n, e, t) {
  var r = t.mergeObjects;
  return r(n, e);
}, ra = function(n, e) {
  return e;
}, dp = (
  /** @class */
  function() {
    function n(e) {
      this.config = e, this.typePolicies = /* @__PURE__ */ Object.create(null), this.toBeAdded = /* @__PURE__ */ Object.create(null), this.supertypeMap = /* @__PURE__ */ new Map(), this.fuzzySubtypes = /* @__PURE__ */ new Map(), this.rootIdsByTypename = /* @__PURE__ */ Object.create(null), this.rootTypenamesById = /* @__PURE__ */ Object.create(null), this.usingPossibleTypes = !1, this.config = x({ dataIdFromObject: Yu }, e), this.cache = this.config.cache, this.setRootTypename("Query"), this.setRootTypename("Mutation"), this.setRootTypename("Subscription"), e.possibleTypes && this.addPossibleTypes(e.possibleTypes), e.typePolicies && this.addTypePolicies(e.typePolicies);
    }
    return n.prototype.identify = function(e, t) {
      var r, i = this, s = t && (t.typename || ((r = t.storeObject) === null || r === void 0 ? void 0 : r.__typename)) || e.__typename;
      if (s === this.rootTypenamesById.ROOT_QUERY)
        return ["ROOT_QUERY"];
      var o = t && t.storeObject || e, a = x(x({}, t), { typename: s, storeObject: o, readField: t && t.readField || function() {
        var p = Os(arguments, o);
        return i.readField(p, {
          store: i.cache.data,
          variables: p.variables
        });
      } }), c, l = s && this.getTypePolicy(s), u = l && l.keyFn || this.config.dataIdFromObject;
      return xs.withValue(!0, function() {
        for (; u; ) {
          var p = u(x(x({}, e), o), a);
          if (de(p))
            u = Zo(p);
          else {
            c = p;
            break;
          }
        }
      }), c = c ? String(c) : void 0, a.keyObject ? [c, a.keyObject] : [c];
    }, n.prototype.addTypePolicies = function(e) {
      var t = this;
      Object.keys(e).forEach(function(r) {
        var i = e[r], s = i.queryType, o = i.mutationType, a = i.subscriptionType, c = it(i, ["queryType", "mutationType", "subscriptionType"]);
        s && t.setRootTypename("Query", r), o && t.setRootTypename("Mutation", r), a && t.setRootTypename("Subscription", r), ke.call(t.toBeAdded, r) ? t.toBeAdded[r].push(c) : t.toBeAdded[r] = [c];
      });
    }, n.prototype.updateTypePolicy = function(e, t) {
      var r = this, i = this.getTypePolicy(e), s = t.keyFields, o = t.fields;
      function a(c, l) {
        c.merge = typeof l == "function" ? l : l === !0 ? na : l === !1 ? ra : c.merge;
      }
      a(i, t.merge), i.keyFn = // Pass false to disable normalization for this typename.
      s === !1 ? hp : de(s) ? Zo(s) : typeof s == "function" ? s : i.keyFn, o && Object.keys(o).forEach(function(c) {
        var l = r.getFieldPolicy(e, c, !0), u = o[c];
        if (typeof u == "function")
          l.read = u;
        else {
          var p = u.keyArgs, d = u.read, y = u.merge;
          l.keyFn = // Pass false to disable argument-based differentiation of
          // field identities.
          p === !1 ? ta : de(p) ? ea(p) : typeof p == "function" ? p : l.keyFn, typeof d == "function" && (l.read = d), a(l, y);
        }
        l.read && l.merge && (l.keyFn = l.keyFn || ta);
      });
    }, n.prototype.setRootTypename = function(e, t) {
      t === void 0 && (t = e);
      var r = "ROOT_" + e.toUpperCase(), i = this.rootTypenamesById[r];
      t !== i && ($(!i || i === e, 6, e), i && delete this.rootIdsByTypename[i], this.rootIdsByTypename[t] = r, this.rootTypenamesById[r] = t);
    }, n.prototype.addPossibleTypes = function(e) {
      var t = this;
      this.usingPossibleTypes = !0, Object.keys(e).forEach(function(r) {
        t.getSupertypeSet(r, !0), e[r].forEach(function(i) {
          t.getSupertypeSet(i, !0).add(r);
          var s = i.match(ec);
          (!s || s[0] !== i) && t.fuzzySubtypes.set(i, new RegExp(i));
        });
      });
    }, n.prototype.getTypePolicy = function(e) {
      var t = this;
      if (!ke.call(this.typePolicies, e)) {
        var r = this.typePolicies[e] = /* @__PURE__ */ Object.create(null);
        r.fields = /* @__PURE__ */ Object.create(null);
        var i = this.supertypeMap.get(e);
        !i && this.fuzzySubtypes.size && (i = this.getSupertypeSet(e, !0), this.fuzzySubtypes.forEach(function(o, a) {
          if (o.test(e)) {
            var c = t.supertypeMap.get(a);
            c && c.forEach(function(l) {
              return i.add(l);
            });
          }
        })), i && i.size && i.forEach(function(o) {
          var a = t.getTypePolicy(o), c = a.fields, l = it(a, ["fields"]);
          Object.assign(r, l), Object.assign(r.fields, c);
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
        for (var a = this.getSupertypeSet(t, !0), c = [a], l = function(v) {
          var E = s.getSupertypeSet(v, !1);
          E && E.size && c.indexOf(E) < 0 && c.push(E);
        }, u = !!(r && this.fuzzySubtypes.size), p = !1, d = 0; d < c.length; ++d) {
          var y = c[d];
          if (y.has(o))
            return a.has(o) || (p && globalThis.__DEV__ !== !1 && $.warn(7, t, o), a.add(o)), !0;
          y.forEach(l), u && // Start checking fuzzy subtypes only after exhausting all
          // non-fuzzy subtypes (after the final iteration of the loop).
          d === c.length - 1 && // We could wait to compare fragment.selectionSet to result
          // after we verify the supertype, but this check is often less
          // expensive than that search, and we will have to do the
          // comparison anyway whenever we find a potential match.
          Zi(e.selectionSet, r, i) && (u = !1, p = !0, this.fuzzySubtypes.forEach(function(v, E) {
            var w = t.match(v);
            w && w[0] === t && l(E);
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
        }, c = es(e); o; ) {
          var l = o(c, a);
          if (de(l))
            o = ea(l);
          else {
            s = l || r;
            break;
          }
        }
      return s === void 0 && (s = e.field ? Mh(e.field, e.variables) : pu(r, es(e))), s === !1 ? r : r === Mt(s) ? s : r + ":" + s;
    }, n.prototype.readField = function(e, t) {
      var r = e.from;
      if (r) {
        var i = e.field || e.fieldName;
        if (i) {
          if (e.typename === void 0) {
            var s = t.store.getFieldValue(r, "__typename");
            s && (e.typename = s);
          }
          var o = this.getStoreFieldName(e), a = Mt(o), c = t.store.getFieldValue(r, o), l = this.getFieldPolicy(e.typename, a, !1), u = l && l.read;
          if (u) {
            var p = ia(this, r, e, t, t.store.getStorage(X(r) ? r.__ref : r, o));
            return Ts.withValue(this.cache, u, [
              c,
              p
            ]);
          }
          return c;
        }
      }
    }, n.prototype.getReadFunction = function(e, t) {
      var r = this.getFieldPolicy(e, t, !1);
      return r && r.read;
    }, n.prototype.getMergeFunction = function(e, t, r) {
      var i = this.getFieldPolicy(e, t, !1), s = i && i.merge;
      return !s && r && (i = this.getTypePolicy(r), s = i && i.merge), s;
    }, n.prototype.runMergeFunction = function(e, t, r, i, s) {
      var o = r.field, a = r.typename, c = r.merge;
      return c === na ? oc(i.store)(e, t) : c === ra ? t : (i.overwrite && (e = void 0), c(e, t, ia(
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
    }, n;
  }()
);
function ia(n, e, t, r, i) {
  var s = n.getStoreFieldName(t), o = Mt(s), a = t.variables || r.variables, c = r.store, l = c.toReference, u = c.canRead;
  return {
    args: es(t),
    field: t.field || null,
    fieldName: o,
    storeFieldName: s,
    variables: a,
    isReference: X,
    toReference: l,
    storage: i,
    cache: n.cache,
    canRead: u,
    readField: function() {
      return n.readField(Os(arguments, e, a), r);
    },
    mergeObjects: oc(r.store)
  };
}
function Os(n, e, t) {
  var r = n[0], i = n[1], s = n.length, o;
  return typeof r == "string" ? o = {
    fieldName: r,
    // Default to objectOrReference only when no second argument was
    // passed for the from parameter, not when undefined is explicitly
    // passed as the second argument.
    from: s > 1 ? i : e
  } : (o = x({}, r), ke.call(o, "from") || (o.from = e)), globalThis.__DEV__ !== !1 && o.from === void 0 && globalThis.__DEV__ !== !1 && $.warn(8, Ka(Array.from(n))), o.variables === void 0 && (o.variables = t), o;
}
function oc(n) {
  return function(t, r) {
    if (de(t) || de(r))
      throw Fe(9);
    if (ce(t) && ce(r)) {
      var i = n.getFieldValue(t, "__typename"), s = n.getFieldValue(r, "__typename"), o = i && s && i !== s;
      if (o)
        return r;
      if (X(t) && rn(r))
        return n.merge(t.__ref, r), t;
      if (rn(t) && X(r))
        return n.merge(t, r.__ref), r;
      if (rn(t) && rn(r))
        return x(x({}, t), r);
    }
    return r;
  };
}
function ki(n, e, t) {
  var r = "".concat(e).concat(t), i = n.flavors.get(r);
  return i || n.flavors.set(r, i = n.clientOnly === e && n.deferred === t ? n : x(x({}, n), { clientOnly: e, deferred: t })), i;
}
var pp = (
  /** @class */
  function() {
    function n(e, t, r) {
      this.cache = e, this.reader = t, this.fragments = r;
    }
    return n.prototype.writeToStore = function(e, t) {
      var r = this, i = t.query, s = t.result, o = t.dataId, a = t.variables, c = t.overwrite, l = Qt(i), u = np();
      a = x(x({}, ys(l)), a);
      var p = x(x({ store: e, written: /* @__PURE__ */ Object.create(null), merge: function(y, v) {
        return u.merge(y, v);
      }, variables: a, varString: Ot(a) }, tc(i, this.fragments)), { overwrite: !!c, incomingById: /* @__PURE__ */ new Map(), clientOnly: !1, deferred: !1, flavors: /* @__PURE__ */ new Map() }), d = this.processSelectionSet({
        result: s || /* @__PURE__ */ Object.create(null),
        dataId: o,
        selectionSet: l.selectionSet,
        mergeTree: { map: /* @__PURE__ */ new Map() },
        context: p
      });
      if (!X(d))
        throw Fe(12, s);
      return p.incomingById.forEach(function(y, v) {
        var E = y.storeObject, w = y.mergeTree, b = y.fieldNodeSet, k = an(v);
        if (w && w.map.size) {
          var S = r.applyMerges(w, k, E, p);
          if (X(S))
            return;
          E = S;
        }
        if (globalThis.__DEV__ !== !1 && !p.overwrite) {
          var I = /* @__PURE__ */ Object.create(null);
          b.forEach(function(M) {
            M.selectionSet && (I[M.name.value] = !0);
          });
          var O = function(M) {
            return I[Mt(M)] === !0;
          }, C = function(M) {
            var F = w && w.map.get(M);
            return !!(F && F.info && F.info.merge);
          };
          Object.keys(E).forEach(function(M) {
            O(M) && !C(M) && yp(k, E, M, p.store);
          });
        }
        e.merge(v, E);
      }), e.retain(d.__ref), d;
    }, n.prototype.processSelectionSet = function(e) {
      var t = this, r = e.dataId, i = e.result, s = e.selectionSet, o = e.context, a = e.mergeTree, c = this.cache.policies, l = /* @__PURE__ */ Object.create(null), u = r && c.rootTypenamesById[r] || Qi(i, s, o.fragmentMap) || r && o.store.get(r, "__typename");
      typeof u == "string" && (l.__typename = u);
      var p = function() {
        var S = Os(arguments, l, o.variables);
        if (X(S.from)) {
          var I = o.incomingById.get(S.from.__ref);
          if (I) {
            var O = c.readField(x(x({}, S), { from: I.storeObject }), o);
            if (O !== void 0)
              return O;
          }
        }
        return c.readField(S, o);
      }, d = /* @__PURE__ */ new Set();
      this.flattenFields(
        s,
        i,
        // This WriteContext will be the default context value for fields returned
        // by the flattenFields method, but some fields may be assigned a modified
        // context, depending on the presence of @client and other directives.
        o,
        u
      ).forEach(function(S, I) {
        var O, C = gt(I), M = i[C];
        if (d.add(I), M !== void 0) {
          var F = c.getStoreFieldName({
            typename: u,
            fieldName: I.name.value,
            field: I,
            variables: S.variables
          }), L = sa(a, F), V = t.processFieldValue(
            M,
            I,
            // Reset context.clientOnly and context.deferred to their default
            // values before processing nested selection sets.
            I.selectionSet ? ki(S, !1, !1) : S,
            L
          ), G = void 0;
          I.selectionSet && (X(V) || rn(V)) && (G = p("__typename", V));
          var Ee = c.getMergeFunction(u, I.name.value, G);
          Ee ? L.info = {
            // TODO Check compatibility against any existing childTree.field?
            field: I,
            typename: u,
            merge: Ee
          } : oa(a, F), l = S.merge(l, (O = {}, O[F] = V, O));
        } else globalThis.__DEV__ !== !1 && !S.clientOnly && !S.deferred && !ws.added(I) && // If the field has a read function, it may be a synthetic field or
        // provide a default value, so its absence from the written data should
        // not be cause for alarm.
        !c.getReadFunction(u, I.name.value) && globalThis.__DEV__ !== !1 && $.error(13, gt(I), i);
      });
      try {
        var y = c.identify(i, {
          typename: u,
          selectionSet: s,
          fragmentMap: o.fragmentMap,
          storeObject: l,
          readField: p
        }), v = y[0], E = y[1];
        r = r || v, E && (l = o.merge(l, E));
      } catch (S) {
        if (!r)
          throw S;
      }
      if (typeof r == "string") {
        var w = an(r), b = o.written[r] || (o.written[r] = []);
        if (b.indexOf(s) >= 0 || (b.push(s), this.reader && this.reader.isFresh(i, w, s, o)))
          return w;
        var k = o.incomingById.get(r);
        return k ? (k.storeObject = o.merge(k.storeObject, l), k.mergeTree = ts(k.mergeTree, a), d.forEach(function(S) {
          return k.fieldNodeSet.add(S);
        })) : o.incomingById.set(r, {
          storeObject: l,
          // Save a reference to mergeTree only if it is not empty, because
          // empty MergeTrees may be recycled by maybeRecycleChildMergeTree and
          // reused for entirely different parts of the result tree.
          mergeTree: $r(a) ? void 0 : a,
          fieldNodeSet: d
        }), w;
      }
      return l;
    }, n.prototype.processFieldValue = function(e, t, r, i) {
      var s = this;
      return !t.selectionSet || e === null ? globalThis.__DEV__ !== !1 ? Fu(e) : e : de(e) ? e.map(function(o, a) {
        var c = s.processFieldValue(o, t, r, sa(i, a));
        return oa(i, a), c;
      }) : this.processSelectionSet({
        result: e,
        selectionSet: t.selectionSet,
        context: r,
        mergeTree: i
      });
    }, n.prototype.flattenFields = function(e, t, r, i) {
      i === void 0 && (i = Qi(t, e, r.fragmentMap));
      var s = /* @__PURE__ */ new Map(), o = this.cache.policies, a = new vt(!1);
      return function c(l, u) {
        var p = a.lookup(
          l,
          // Because we take inheritedClientOnly and inheritedDeferred into
          // consideration here (in addition to selectionSet), it's possible for
          // the same selection set to be flattened more than once, if it appears
          // in the query with different @client and/or @directive configurations.
          u.clientOnly,
          u.deferred
        );
        p.visited || (p.visited = !0, l.selections.forEach(function(d) {
          if (or(d, r.variables)) {
            var y = u.clientOnly, v = u.deferred;
            if (
              // Since the presence of @client or @defer on this field can only
              // cause clientOnly or deferred to become true, we can skip the
              // forEach loop if both clientOnly and deferred are already true.
              !(y && v) && st(d.directives) && d.directives.forEach(function(b) {
                var k = b.name.value;
                if (k === "client" && (y = !0), k === "defer") {
                  var S = Gr(b, r.variables);
                  (!S || S.if !== !1) && (v = !0);
                }
              }), Ct(d)
            ) {
              var E = s.get(d);
              E && (y = y && E.clientOnly, v = v && E.deferred), s.set(d, ki(r, y, v));
            } else {
              var w = Kr(d, r.lookupFragment);
              if (!w && d.kind === D.FRAGMENT_SPREAD)
                throw Fe(14, d.name.value);
              w && o.fragmentMatches(w, i, t, r.variables) && c(w.selectionSet, ki(r, y, v));
            }
          }
        }));
      }(e, r), s;
    }, n.prototype.applyMerges = function(e, t, r, i, s) {
      var o, a = this;
      if (e.map.size && !X(r)) {
        var c = (
          // Items in the same position in different arrays are not
          // necessarily related to each other, so when incoming is an array
          // we process its elements as if there was no existing data.
          !de(r) && // Likewise, existing must be either a Reference or a StoreObject
          // in order for its fields to be safe to merge with the fields of
          // the incoming object.
          (X(t) || rn(t)) ? t : void 0
        ), l = r;
        c && !s && (s = [X(c) ? c.__ref : c]);
        var u, p = function(d, y) {
          return de(d) ? typeof y == "number" ? d[y] : void 0 : i.store.getFieldValue(d, String(y));
        };
        e.map.forEach(function(d, y) {
          var v = p(c, y), E = p(l, y);
          if (E !== void 0) {
            s && s.push(y);
            var w = a.applyMerges(d, v, E, i, s);
            w !== E && (u = u || /* @__PURE__ */ new Map(), u.set(y, w)), s && $(s.pop() === y);
          }
        }), u && (r = de(l) ? l.slice(0) : x({}, l), u.forEach(function(d, y) {
          r[y] = d;
        }));
      }
      return e.info ? this.cache.policies.runMergeFunction(t, r, e.info, i, s && (o = i.store).getStorage.apply(o, s)) : r;
    }, n;
  }()
), ac = [];
function sa(n, e) {
  var t = n.map;
  return t.has(e) || t.set(e, ac.pop() || { map: /* @__PURE__ */ new Map() }), t.get(e);
}
function ts(n, e) {
  if (n === e || !e || $r(e))
    return n;
  if (!n || $r(n))
    return e;
  var t = n.info && e.info ? x(x({}, n.info), e.info) : n.info || e.info, r = n.map.size && e.map.size, i = r ? /* @__PURE__ */ new Map() : n.map.size ? n.map : e.map, s = { info: t, map: i };
  if (r) {
    var o = new Set(e.map.keys());
    n.map.forEach(function(a, c) {
      s.map.set(c, ts(a, e.map.get(c))), o.delete(c);
    }), o.forEach(function(a) {
      s.map.set(a, ts(e.map.get(a), n.map.get(a)));
    });
  }
  return s;
}
function $r(n) {
  return !n || !(n.info || n.map.size);
}
function oa(n, e) {
  var t = n.map, r = t.get(e);
  r && $r(r) && (ac.push(r), t.delete(e));
}
var aa = /* @__PURE__ */ new Set();
function yp(n, e, t, r) {
  var i = function(p) {
    var d = r.getFieldValue(p, t);
    return typeof d == "object" && d;
  }, s = i(n);
  if (s) {
    var o = i(e);
    if (o && !X(s) && !oe(s, o) && !Object.keys(s).every(function(p) {
      return r.getFieldValue(o, p) !== void 0;
    })) {
      var a = r.getFieldValue(n, "__typename") || r.getFieldValue(e, "__typename"), c = Mt(t), l = "".concat(a, ".").concat(c);
      if (!aa.has(l)) {
        aa.add(l);
        var u = [];
        !de(s) && !de(o) && [s, o].forEach(function(p) {
          var d = r.getFieldValue(p, "__typename");
          typeof d == "string" && !u.includes(d) && u.push(d);
        }), globalThis.__DEV__ !== !1 && $.warn(15, c, a, u.length ? "either ensure all objects of type " + u.join(" and ") + " have an ID or a custom merge function, or " : "", l, x({}, s), x({}, o));
      }
    }
  }
}
var uc = (
  /** @class */
  function(n) {
    He(e, n);
    function e(t) {
      t === void 0 && (t = {});
      var r = n.call(this) || this;
      return r.watches = /* @__PURE__ */ new Set(), r.addTypenameTransform = new Au(ws), r.assumeImmutableResults = !0, r.makeVar = lp, r.txCount = 0, r.config = ep(t), r.addTypename = !!r.config.addTypename, r.policies = new dp({
        cache: r,
        dataIdFromObject: r.config.dataIdFromObject,
        possibleTypes: r.config.possibleTypes,
        typePolicies: r.config.typePolicies
      }), r.init(), r;
    }
    return e.prototype.init = function() {
      var t = this.data = new ei.Root({
        policies: this.policies,
        resultCaching: this.config.resultCaching
      });
      this.optimisticData = t.stump, this.resetResultCache();
    }, e.prototype.resetResultCache = function(t) {
      var r = this, i = this.storeReader, s = this.config.fragments;
      this.storeWriter = new pp(this, this.storeReader = new op({
        cache: this,
        addTypename: this.addTypename,
        resultCacheMaxSize: this.config.resultCacheMaxSize,
        canonizeResults: Zu(this.config),
        canon: t ? void 0 : i && i.canon,
        fragments: s
      }), s), this.maybeBroadcastWatch = er(function(o, a) {
        return r.broadcastWatch(o, a);
      }, {
        max: this.config.resultCacheMaxSize || mt["inMemoryCache.maybeBroadcastWatch"] || 5e3,
        makeCacheKey: function(o) {
          var a = o.optimistic ? r.optimisticData : r.data;
          if (Hn(a)) {
            var c = o.optimistic, l = o.id, u = o.variables;
            return a.makeCacheKey(
              o.query,
              // Different watches can have the same query, optimistic
              // status, rootId, and variables, but if their callbacks are
              // different, the (identical) result needs to be delivered to
              // each distinct callback. The easiest way to achieve that
              // separation is to include c.callback in the cache key for
              // maybeBroadcastWatch calls. See issue #5733.
              o.callback,
              Ot({ optimistic: c, id: l, variables: u })
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
      var r = t.returnPartialData, i = r === void 0 ? !1 : r;
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
      if (ke.call(t, "id") && !t.id)
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
      return this.watches.size || cp(this), this.watches.add(t), t.immediate && this.maybeBroadcastWatch(t), function() {
        r.watches.delete(t) && !r.watches.size && Yo(r), r.maybeBroadcastWatch.forget(t);
      };
    }, e.prototype.gc = function(t) {
      var r;
      Ot.reset(), At.reset(), this.addTypenameTransform.resetCache(), (r = this.config.fragments) === null || r === void 0 || r.resetCaches();
      var i = this.optimisticData.gc();
      return t && !this.txCount && (t.resetResultCache ? this.resetResultCache(t.resetResultIdentities) : t.resetResultIdentities && this.storeReader.resetCanon()), i;
    }, e.prototype.retain = function(t, r) {
      return (r ? this.optimisticData : this.data).retain(t);
    }, e.prototype.release = function(t, r) {
      return (r ? this.optimisticData : this.data).release(t);
    }, e.prototype.identify = function(t) {
      if (X(t))
        return t.__ref;
      try {
        return this.policies.identify(t)[0];
      } catch (r) {
        globalThis.__DEV__ !== !1 && $.warn(r);
      }
    }, e.prototype.evict = function(t) {
      if (!t.id) {
        if (ke.call(t, "id"))
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
      return this.init(), Ot.reset(), t && t.discardWatches ? (this.watches.forEach(function(i) {
        return r.maybeBroadcastWatch.forget(i);
      }), this.watches.clear(), Yo(this)) : this.broadcastWatches(), Promise.resolve();
    }, e.prototype.removeOptimistic = function(t) {
      var r = this.optimisticData.removeLayer(t);
      r !== this.optimisticData && (this.optimisticData = r, this.broadcastWatches());
    }, e.prototype.batch = function(t) {
      var r = this, i = t.update, s = t.optimistic, o = s === void 0 ? !0 : s, a = t.removeOptimistic, c = t.onWatchUpdated, l, u = function(d) {
        var y = r, v = y.data, E = y.optimisticData;
        ++r.txCount, d && (r.data = r.optimisticData = d);
        try {
          return l = i(r);
        } finally {
          --r.txCount, r.data = v, r.optimisticData = E;
        }
      }, p = /* @__PURE__ */ new Set();
      return c && !this.txCount && this.broadcastWatches(x(x({}, t), { onWatchUpdated: function(d) {
        return p.add(d), !1;
      } })), typeof o == "string" ? this.optimisticData = this.optimisticData.addLayer(o, u) : o === !1 ? u(this.data) : u(), typeof a == "string" && (this.optimisticData = this.optimisticData.removeLayer(a)), c && p.size ? (this.broadcastWatches(x(x({}, t), { onWatchUpdated: function(d, y) {
        var v = c.call(this, d, y);
        return v !== !1 && p.delete(d), v;
      } })), p.size && p.forEach(function(d) {
        return r.maybeBroadcastWatch.dirty(d);
      })) : this.broadcastWatches(t), l;
    }, e.prototype.performTransaction = function(t, r) {
      return this.batch({
        update: t,
        optimistic: r || r !== null
      });
    }, e.prototype.transformDocument = function(t) {
      return this.addTypenameToDocument(this.addFragmentsToDocument(t));
    }, e.prototype.fragmentMatches = function(t, r) {
      return this.policies.fragmentMatches(t, r);
    }, e.prototype.lookupFragment = function(t) {
      var r;
      return ((r = this.config.fragments) === null || r === void 0 ? void 0 : r.lookup(t)) || null;
    }, e.prototype.broadcastWatches = function(t) {
      var r = this;
      this.txCount || this.watches.forEach(function(i) {
        return r.maybeBroadcastWatch(i, t);
      });
    }, e.prototype.addFragmentsToDocument = function(t) {
      var r = this.config.fragments;
      return r ? r.transform(t) : t;
    }, e.prototype.addTypenameToDocument = function(t) {
      return this.addTypename ? this.addTypenameTransform.transformDocument(t) : t;
    }, e.prototype.broadcastWatch = function(t, r) {
      var i = t.lastDiff, s = this.diff(t);
      r && (t.optimistic && typeof r.optimistic == "string" && (s.fromOptimisticTransaction = !0), r.onWatchUpdated && r.onWatchUpdated.call(this, t, s, i) === !1) || (!i || !oe(i.result, s.result)) && t.callback(t.lastDiff = s, i);
    }, e;
  }(Gu)
);
globalThis.__DEV__ !== !1 && (uc.prototype.getMemoryInternals = yh);
var te;
(function(n) {
  n[n.loading = 1] = "loading", n[n.setVariables = 2] = "setVariables", n[n.fetchMore = 3] = "fetchMore", n[n.refetch = 4] = "refetch", n[n.poll = 6] = "poll", n[n.ready = 7] = "ready", n[n.error = 8] = "error";
})(te || (te = {}));
function tr(n) {
  return n ? n < 7 : !1;
}
var ua = Object.assign, mp = Object.hasOwnProperty, ns = (
  /** @class */
  function(n) {
    He(e, n);
    function e(t) {
      var r = t.queryManager, i = t.queryInfo, s = t.options, o = n.call(this, function(w) {
        try {
          var b = w._subscription._observer;
          b && !b.error && (b.error = gp);
        } catch {
        }
        var k = !o.observers.size;
        o.observers.add(w);
        var S = o.last;
        return S && S.error ? w.error && w.error(S.error) : S && S.result && w.next && w.next(o.maskResult(S.result)), k && o.reobserve().catch(function() {
        }), function() {
          o.observers.delete(w) && !o.observers.size && o.tearDownQuery();
        };
      }) || this;
      o.observers = /* @__PURE__ */ new Set(), o.subscriptions = /* @__PURE__ */ new Set(), o.queryInfo = i, o.queryManager = r, o.waitForOwnResult = xi(s.fetchPolicy), o.isTornDown = !1, o.subscribeToMore = o.subscribeToMore.bind(o), o.maskResult = o.maskResult.bind(o);
      var a = r.defaultOptions.watchQuery, c = a === void 0 ? {} : a, l = c.fetchPolicy, u = l === void 0 ? "cache-first" : l, p = s.fetchPolicy, d = p === void 0 ? u : p, y = s.initialFetchPolicy, v = y === void 0 ? d === "standby" ? u : d : y;
      o.options = x(x({}, s), {
        // Remember the initial options.fetchPolicy so we can revert back to this
        // policy when variables change. This information can also be specified
        // (or overridden) by providing options.initialFetchPolicy explicitly.
        initialFetchPolicy: v,
        // This ensures this.options.fetchPolicy always has a string value, in
        // case options.fetchPolicy was not provided.
        fetchPolicy: d
      }), o.queryId = i.queryId || r.generateQueryId();
      var E = Qt(o.query);
      return o.queryName = E && E.name && E.name.value, o;
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
    }, e.prototype.resetDiff = function() {
      this.queryInfo.resetDiff();
    }, e.prototype.getCurrentFullResult = function(t) {
      t === void 0 && (t = !0);
      var r = this.getLastResult(!0), i = this.queryInfo.networkStatus || r && r.networkStatus || te.ready, s = x(x({}, r), { loading: tr(i), networkStatus: i }), o = this.options.fetchPolicy, a = o === void 0 ? "cache-first" : o;
      if (
        // These fetch policies should never deliver data from the cache, unless
        // redelivering a previously delivered result.
        !(xi(a) || // If this.options.query has @client(always: true) fields, we cannot
        // trust diff.result, since it was read from the cache without running
        // local resolvers (and it's too late to run resolvers now, since we must
        // return a result synchronously).
        this.queryManager.getDocumentInfo(this.query).hasForcedResolvers)
      ) if (this.waitForOwnResult)
        this.queryInfo.updateWatch();
      else {
        var c = this.queryInfo.getDiff();
        (c.complete || this.options.returnPartialData) && (s.data = c.result), oe(s.data, {}) && (s.data = void 0), c.complete ? (delete s.partial, c.complete && s.networkStatus === te.loading && (a === "cache-first" || a === "cache-only") && (s.networkStatus = te.ready, s.loading = !1)) : s.partial = !0, globalThis.__DEV__ !== !1 && !c.complete && !this.options.partialRefetch && !s.loading && !s.data && !s.error && lc(c.missing);
      }
      return t && this.updateLastResult(s), s;
    }, e.prototype.getCurrentResult = function(t) {
      return t === void 0 && (t = !0), this.maskResult(this.getCurrentFullResult(t));
    }, e.prototype.isDifferentFromLastResult = function(t, r) {
      if (!this.last)
        return !0;
      var i = this.queryManager.getDocumentInfo(this.query), s = this.queryManager.dataMasking, o = s ? i.nonReactiveQuery : this.query, a = s || i.hasNonreactiveDirective ? !Vu(o, this.last.result, t, this.variables) : !oe(this.last.result, t);
      return a || r && !oe(this.last.variables, r);
    }, e.prototype.getLast = function(t, r) {
      var i = this.last;
      if (i && i[t] && (!r || oe(i.variables, this.variables)))
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
        // Always disable polling for refetches.
        pollInterval: 0
      }, s = this.options.fetchPolicy;
      if (s === "cache-and-network" ? i.fetchPolicy = s : s === "no-cache" ? i.fetchPolicy = "no-cache" : i.fetchPolicy = "network-only", globalThis.__DEV__ !== !1 && t && mp.call(t, "variables")) {
        var o = yu(this.query), a = o.variableDefinitions;
        (!a || !a.some(function(c) {
          return c.variable.name.value === "variables";
        })) && globalThis.__DEV__ !== !1 && $.warn(
          21,
          t,
          ((r = o.name) === null || r === void 0 ? void 0 : r.value) || o
        );
      }
      return t && !oe(this.options.variables, t) && (i.variables = this.options.variables = x(x({}, this.options.variables), t)), this.queryInfo.resetLastWrite(), this.reobserve(i, te.refetch);
    }, e.prototype.fetchMore = function(t) {
      var r = this, i = x(x({}, t.query ? t : x(x(x(x({}, this.options), { query: this.options.query }), t), { variables: x(x({}, this.options.variables), t.variables) })), {
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
      o.networkStatus = te.fetchMore, i.notifyOnNetworkStatusChange && this.observe();
      var c = /* @__PURE__ */ new Set(), l = t?.updateQuery, u = this.options.fetchPolicy !== "no-cache";
      return u || $(l, 22), this.queryManager.fetchQuery(s, i, te.fetchMore).then(function(p) {
        if (r.queryManager.removeQuery(s), o.networkStatus === te.fetchMore && (o.networkStatus = a), u)
          r.queryManager.cache.batch({
            update: function(v) {
              var E = t.updateQuery;
              E ? v.updateQuery({
                query: r.query,
                variables: r.variables,
                returnPartialData: !0,
                optimistic: !1
              }, function(w) {
                return E(w, {
                  fetchMoreResult: p.data,
                  variables: i.variables
                });
              }) : v.writeQuery({
                query: i.query,
                variables: i.variables,
                data: p.data
              });
            },
            onWatchUpdated: function(v) {
              c.add(v.query);
            }
          });
        else {
          var d = r.getLast("result"), y = l(d.data, {
            fetchMoreResult: p.data,
            variables: i.variables
          });
          r.reportResult(x(x({}, d), { data: y }), r.variables);
        }
        return r.maskResult(p);
      }).finally(function() {
        u && !c.has(r.query) && cc(r);
      });
    }, e.prototype.subscribeToMore = function(t) {
      var r = this, i = this.queryManager.startGraphQLSubscription({
        query: t.document,
        variables: t.variables,
        context: t.context
      }).subscribe({
        next: function(s) {
          var o = t.updateQuery;
          o && r.updateQuery(function(a, c) {
            var l = c.variables;
            return o(a, {
              subscriptionData: s,
              variables: l
            });
          });
        },
        error: function(s) {
          if (t.onError) {
            t.onError(s);
            return;
          }
          globalThis.__DEV__ !== !1 && $.error(23, s);
        }
      });
      return this.subscriptions.add(i), function() {
        r.subscriptions.delete(i) && i.unsubscribe();
      };
    }, e.prototype.setOptions = function(t) {
      return this.reobserve(t);
    }, e.prototype.silentSetOptions = function(t) {
      var r = yn(this.options, t || {});
      ua(this.options, r);
    }, e.prototype.setVariables = function(t) {
      return oe(this.variables, t) ? this.observers.size ? this.result() : Promise.resolve() : (this.options.variables = t, this.observers.size ? this.reobserve({
        // Reset options.fetchPolicy to its original value.
        fetchPolicy: this.options.initialFetchPolicy,
        variables: t
      }, te.setVariables) : Promise.resolve());
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
    }, e.prototype.applyNextFetchPolicy = function(t, r) {
      if (r.nextFetchPolicy) {
        var i = r.fetchPolicy, s = i === void 0 ? "cache-first" : i, o = r.initialFetchPolicy, a = o === void 0 ? s : o;
        s === "standby" || (typeof r.nextFetchPolicy == "function" ? r.fetchPolicy = r.nextFetchPolicy(s, {
          reason: t,
          options: r,
          observable: this,
          initialFetchPolicy: a
        }) : t === "variables-changed" ? r.fetchPolicy = a : r.fetchPolicy = r.nextFetchPolicy);
      }
      return r.fetchPolicy;
    }, e.prototype.fetch = function(t, r, i) {
      return this.queryManager.setObservableQuery(this), this.queryManager.fetchConcastWithInfo(this.queryId, t, r, i);
    }, e.prototype.updatePolling = function() {
      var t = this;
      if (!this.queryManager.ssrMode) {
        var r = this, i = r.pollingInfo, s = r.options.pollInterval;
        if (!s || !this.hasObservers()) {
          i && (clearTimeout(i.timeout), delete this.pollingInfo);
          return;
        }
        if (!(i && i.interval === s)) {
          $(s, 24);
          var o = i || (this.pollingInfo = {});
          o.interval = s;
          var a = function() {
            var l, u;
            t.pollingInfo && (!tr(t.queryInfo.networkStatus) && !(!((u = (l = t.options).skipPollAttempt) === null || u === void 0) && u.call(l)) ? t.reobserve({
              // Most fetchPolicy options don't make sense to use in a polling context, as
              // users wouldn't want to be polling the cache directly. However, network-only and
              // no-cache are both useful for when the user wants to control whether or not the
              // polled results are written to the cache.
              fetchPolicy: t.options.initialFetchPolicy === "no-cache" ? "no-cache" : "network-only"
            }, te.poll).then(c, c) : c());
          }, c = function() {
            var l = t.pollingInfo;
            l && (clearTimeout(l.timeout), l.timeout = setTimeout(a, l.interval));
          };
          c();
        }
      }
    }, e.prototype.updateLastResult = function(t, r) {
      r === void 0 && (r = this.variables);
      var i = this.getLastError();
      return i && this.last && !oe(r, this.last.variables) && (i = void 0), this.last = x({ result: this.queryManager.assumeImmutableResults ? t : Fu(t), variables: r }, i ? { error: i } : null);
    }, e.prototype.reobserveAsConcast = function(t, r) {
      var i = this;
      this.isTornDown = !1;
      var s = (
        // Refetching uses a disposable Concast to allow refetches using different
        // options/variables, without permanently altering the options of the
        // original ObservableQuery.
        r === te.refetch || // The fetchMore method does not actually call the reobserve method, but,
        // if it did, it would definitely use a disposable Concast.
        r === te.fetchMore || // Polling uses a disposable Concast so the polling options (which force
        // fetchPolicy to be "network-only" or "no-cache") won't override the original options.
        r === te.poll
      ), o = this.options.variables, a = this.options.fetchPolicy, c = yn(this.options, t || {}), l = s ? (
        // Disposable Concast fetches receive a shallow copy of this.options
        // (merged with newOptions), leaving this.options unmodified.
        c
      ) : ua(this.options, c), u = this.transformDocument(l.query);
      this.lastQuery = u, s || (this.updatePolling(), t && t.variables && !oe(t.variables, o) && // Don't mess with the fetchPolicy if it's currently "standby".
      l.fetchPolicy !== "standby" && // If we're changing the fetchPolicy anyway, don't try to change it here
      // using applyNextFetchPolicy. The explicit options.fetchPolicy wins.
      (l.fetchPolicy === a || // A `nextFetchPolicy` function has even higher priority, though,
      // so in that case `applyNextFetchPolicy` must be called.
      typeof l.nextFetchPolicy == "function") && (this.applyNextFetchPolicy("variables-changed", l), r === void 0 && (r = te.setVariables))), this.waitForOwnResult && (this.waitForOwnResult = xi(l.fetchPolicy));
      var p = function() {
        i.concast === v && (i.waitForOwnResult = !1);
      }, d = l.variables && x({}, l.variables), y = this.fetch(l, r, u), v = y.concast, E = y.fromLink, w = {
        next: function(b) {
          oe(i.variables, d) && (p(), i.reportResult(b, d));
        },
        error: function(b) {
          oe(i.variables, d) && (Uu(b) || (b = new xt({ networkError: b })), p(), i.reportError(b, d));
        }
      };
      return !s && (E || !this.concast) && (this.concast && this.observer && this.concast.removeObserver(this.observer), this.concast = v, this.observer = w), v.addObserver(w), v;
    }, e.prototype.reobserve = function(t, r) {
      return ud(this.reobserveAsConcast(t, r).promise.then(this.maskResult));
    }, e.prototype.resubscribeAfterError = function() {
      for (var t = [], r = 0; r < arguments.length; r++)
        t[r] = arguments[r];
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
        this.getCurrentFullResult(!1),
        this.variables
      );
    }, e.prototype.reportResult = function(t, r) {
      var i = this.getLastError(), s = this.isDifferentFromLastResult(t, r);
      (i || !t.partial || this.options.returnPartialData) && this.updateLastResult(t, r), (i || s) && Qn(this.observers, "next", this.maskResult(t));
    }, e.prototype.reportError = function(t, r) {
      var i = x(x({}, this.getLastResult()), { error: t, errors: t.graphQLErrors, networkStatus: te.error, loading: !1 });
      this.updateLastResult(i, r), Qn(this.observers, "error", this.last.error = t);
    }, e.prototype.hasObservers = function() {
      return this.observers.size > 0;
    }, e.prototype.tearDownQuery = function() {
      this.isTornDown || (this.concast && this.observer && (this.concast.removeObserver(this.observer), delete this.concast, delete this.observer), this.stopPolling(), this.subscriptions.forEach(function(t) {
        return t.unsubscribe();
      }), this.subscriptions.clear(), this.queryManager.stopQuery(this.queryId), this.observers.clear(), this.isTornDown = !0);
    }, e.prototype.transformDocument = function(t) {
      return this.queryManager.transform(t);
    }, e.prototype.maskResult = function(t) {
      return t && "data" in t ? x(x({}, t), { data: this.queryManager.maskOperation({
        document: this.query,
        data: t.data,
        fetchPolicy: this.options.fetchPolicy,
        id: this.queryId
      }) }) : t;
    }, e;
  }(ee)
);
Bu(ns);
function cc(n) {
  var e = n.options, t = e.fetchPolicy, r = e.nextFetchPolicy;
  return t === "cache-and-network" || t === "network-only" ? n.reobserve({
    fetchPolicy: "cache-first",
    // Use a temporary nextFetchPolicy function that replaces itself with the
    // previous nextFetchPolicy value and returns the original fetchPolicy.
    nextFetchPolicy: function(i, s) {
      return this.nextFetchPolicy = r, typeof this.nextFetchPolicy == "function" ? this.nextFetchPolicy(i, s) : t;
    }
  }) : n.reobserve();
}
function gp(n) {
  globalThis.__DEV__ !== !1 && $.error(25, n.message, n.stack);
}
function lc(n) {
  globalThis.__DEV__ !== !1 && n && globalThis.__DEV__ !== !1 && $.debug(26, n);
}
function xi(n) {
  return n === "network-only" || n === "no-cache" || n === "standby";
}
var sn = new (Wt ? WeakMap : Map)();
function Ti(n, e) {
  var t = n[e];
  typeof t == "function" && (n[e] = function() {
    return sn.set(
      n,
      // The %1e15 allows the count to wrap around to 0 safely every
      // quadrillion evictions, so there's no risk of overflow. To be
      // clear, this is more of a pedantic principle than something
      // that matters in any conceivable practical scenario.
      (sn.get(n) + 1) % 1e15
    ), t.apply(this, arguments);
  });
}
function ca(n) {
  n.notifyTimeout && (clearTimeout(n.notifyTimeout), n.notifyTimeout = void 0);
}
var Ii = (
  /** @class */
  function() {
    function n(e, t) {
      t === void 0 && (t = e.generateQueryId()), this.queryId = t, this.listeners = /* @__PURE__ */ new Set(), this.document = null, this.lastRequestId = 1, this.stopped = !1, this.dirty = !1, this.observableQuery = null;
      var r = this.cache = e.cache;
      sn.has(r) || (sn.set(r, 0), Ti(r, "evict"), Ti(r, "modify"), Ti(r, "reset"));
    }
    return n.prototype.init = function(e) {
      var t = e.networkStatus || te.loading;
      return this.variables && this.networkStatus !== te.loading && !oe(this.variables, e.variables) && (t = te.setVariables), oe(e.variables, this.variables) || (this.lastDiff = void 0), Object.assign(this, {
        document: e.document,
        variables: e.variables,
        networkError: null,
        graphQLErrors: this.graphQLErrors || [],
        networkStatus: t
      }), e.observableQuery && this.setObservableQuery(e.observableQuery), e.lastRequestId && (this.lastRequestId = e.lastRequestId), this;
    }, n.prototype.reset = function() {
      ca(this), this.dirty = !1;
    }, n.prototype.resetDiff = function() {
      this.lastDiff = void 0;
    }, n.prototype.getDiff = function() {
      var e = this.getDiffOptions();
      if (this.lastDiff && oe(e, this.lastDiff.options))
        return this.lastDiff.diff;
      this.updateWatch(this.variables);
      var t = this.observableQuery;
      if (t && t.options.fetchPolicy === "no-cache")
        return { complete: !1 };
      var r = this.cache.diff(e);
      return this.updateLastDiff(r, e), r;
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
      var t = this, r, i = this.lastDiff && this.lastDiff.diff;
      e && !e.complete && (!((r = this.observableQuery) === null || r === void 0) && r.getLastError()) || (this.updateLastDiff(e), !this.dirty && !oe(i && i.result, e && e.result) && (this.dirty = !0, this.notifyTimeout || (this.notifyTimeout = setTimeout(function() {
        return t.notify();
      }, 0))));
    }, n.prototype.setObservableQuery = function(e) {
      var t = this;
      e !== this.observableQuery && (this.oqListener && this.listeners.delete(this.oqListener), this.observableQuery = e, e ? (e.queryInfo = this, this.listeners.add(this.oqListener = function() {
        var r = t.getDiff();
        r.fromOptimisticTransaction ? e.observe() : cc(e);
      })) : delete this.oqListener);
    }, n.prototype.notify = function() {
      var e = this;
      ca(this), this.shouldNotify() && this.listeners.forEach(function(t) {
        return t(e);
      }), this.dirty = !1;
    }, n.prototype.shouldNotify = function() {
      if (!this.dirty || !this.listeners.size)
        return !1;
      if (tr(this.networkStatus) && this.observableQuery) {
        var e = this.observableQuery.options.fetchPolicy;
        if (e !== "cache-only" && e !== "cache-and-network")
          return !1;
      }
      return !0;
    }, n.prototype.stop = function() {
      if (!this.stopped) {
        this.stopped = !0, this.reset(), this.cancel(), this.cancel = n.prototype.cancel;
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
        (!this.lastWatch || !oe(i, this.lastWatch)) && (this.cancel(), this.cancel = this.cache.watch(this.lastWatch = i));
      }
    }, n.prototype.resetLastWrite = function() {
      this.lastWrite = void 0;
    }, n.prototype.shouldWrite = function(e, t) {
      var r = this.lastWrite;
      return !(r && // If cache.evict has been called since the last time we wrote this
      // data into the cache, there's a chance writing this result into
      // the cache will repair what was evicted.
      r.dmCount === sn.get(this.cache) && oe(t, r.variables) && oe(e.data, r.result.data));
    }, n.prototype.markResult = function(e, t, r, i) {
      var s = this, o = new Nt(), a = st(e.errors) ? e.errors.slice(0) : [];
      if (this.reset(), "incremental" in e && st(e.incremental)) {
        var c = Pu(this.getDiff().result, e);
        e.data = c;
      } else if ("hasNext" in e && e.hasNext) {
        var l = this.getDiff();
        e.data = o.merge(l.result, e.data);
      }
      this.graphQLErrors = a, r.fetchPolicy === "no-cache" ? this.updateLastDiff({ result: e.data, complete: !0 }, this.getDiffOptions(r.variables)) : i !== 0 && (rs(e, r.errorPolicy) ? this.cache.performTransaction(function(u) {
        if (s.shouldWrite(e, r.variables))
          u.writeQuery({
            query: t,
            data: e.data,
            variables: r.variables,
            overwrite: i === 1
          }), s.lastWrite = {
            result: e,
            variables: r.variables,
            dmCount: sn.get(s.cache)
          };
        else if (s.lastDiff && s.lastDiff.diff.complete) {
          e.data = s.lastDiff.diff.result;
          return;
        }
        var p = s.getDiffOptions(r.variables), d = u.diff(p);
        !s.stopped && oe(s.variables, r.variables) && s.updateWatch(r.variables), s.updateLastDiff(d, p), d.complete && (e.data = d.result);
      }) : this.lastWrite = void 0);
    }, n.prototype.markReady = function() {
      return this.networkError = null, this.networkStatus = te.ready;
    }, n.prototype.markError = function(e) {
      return this.networkStatus = te.error, this.lastWrite = void 0, this.reset(), e.graphQLErrors && (this.graphQLErrors = e.graphQLErrors), e.networkError && (this.networkError = e.networkError), e;
    }, n;
  }()
);
function rs(n, e) {
  e === void 0 && (e = "none");
  var t = e === "ignore" || e === "all", r = !Tr(n);
  return !r && t && n.data && (r = !0), r;
}
var vp = Object.prototype.hasOwnProperty, la = /* @__PURE__ */ Object.create(null), bp = (
  /** @class */
  function() {
    function n(e) {
      var t = this;
      this.clientAwareness = {}, this.queries = /* @__PURE__ */ new Map(), this.fetchCancelFns = /* @__PURE__ */ new Map(), this.transformCache = new cu(
        mt["queryManager.getDocumentInfo"] || 2e3
        /* defaultCacheSizes["queryManager.getDocumentInfo"] */
      ), this.queryIdCounter = 1, this.requestIdCounter = 1, this.mutationIdCounter = 1, this.inFlightLinkObservables = new vt(!1), this.noCacheWarningsByQueryId = /* @__PURE__ */ new Set();
      var r = new Au(
        function(s) {
          return t.cache.transformDocument(s);
        },
        // Allow the apollo cache to manage its own transform caches
        { cache: !1 }
      );
      this.cache = e.cache, this.link = e.link, this.defaultOptions = e.defaultOptions, this.queryDeduplication = e.queryDeduplication, this.clientAwareness = e.clientAwareness, this.localState = e.localState, this.ssrMode = e.ssrMode, this.assumeImmutableResults = e.assumeImmutableResults, this.dataMasking = e.dataMasking;
      var i = e.documentTransform;
      this.documentTransform = i ? r.concat(i).concat(r) : r, this.defaultContext = e.defaultContext || /* @__PURE__ */ Object.create(null), (this.onBroadcast = e.onBroadcast) && (this.mutationStore = /* @__PURE__ */ Object.create(null));
    }
    return n.prototype.stop = function() {
      var e = this;
      this.queries.forEach(function(t, r) {
        e.stopQueryNoBroadcast(r);
      }), this.cancelPendingFetches(Fe(27));
    }, n.prototype.cancelPendingFetches = function(e) {
      this.fetchCancelFns.forEach(function(t) {
        return t(e);
      }), this.fetchCancelFns.clear();
    }, n.prototype.mutate = function(e) {
      return _t(this, arguments, void 0, function(t) {
        var r, i, s, o, a, c, l, u = t.mutation, p = t.variables, d = t.optimisticResponse, y = t.updateQueries, v = t.refetchQueries, E = v === void 0 ? [] : v, w = t.awaitRefetchQueries, b = w === void 0 ? !1 : w, k = t.update, S = t.onQueryUpdated, I = t.fetchPolicy, O = I === void 0 ? ((c = this.defaultOptions.mutate) === null || c === void 0 ? void 0 : c.fetchPolicy) || "network-only" : I, C = t.errorPolicy, M = C === void 0 ? ((l = this.defaultOptions.mutate) === null || l === void 0 ? void 0 : l.errorPolicy) || "none" : C, F = t.keepRootFields, L = t.context;
        return St(this, function(V) {
          switch (V.label) {
            case 0:
              return $(u, 28), $(O === "network-only" || O === "no-cache", 29), r = this.generateMutationId(), u = this.cache.transformForLink(this.transform(u)), i = this.getDocumentInfo(u).hasClientExports, p = this.getVariables(u, p), i ? [4, this.localState.addExportedVariables(u, p, L)] : [3, 2];
            case 1:
              p = V.sent(), V.label = 2;
            case 2:
              return s = this.mutationStore && (this.mutationStore[r] = {
                mutation: u,
                variables: p,
                loading: !0,
                error: null
              }), o = d && this.markMutationOptimistic(d, {
                mutationId: r,
                document: u,
                variables: p,
                fetchPolicy: O,
                errorPolicy: M,
                context: L,
                updateQueries: y,
                update: k,
                keepRootFields: F
              }), this.broadcastQueries(), a = this, [2, new Promise(function(G, Ee) {
                return bi(a.getObservableFromLink(u, x(x({}, L), { optimisticResponse: o ? d : void 0 }), p, {}, !1), function(ie) {
                  if (Tr(ie) && M === "none")
                    throw new xt({
                      graphQLErrors: Ki(ie)
                    });
                  s && (s.loading = !1, s.error = null);
                  var _e = x({}, ie);
                  return typeof E == "function" && (E = E(_e)), M === "ignore" && Tr(_e) && delete _e.errors, a.markMutationResult({
                    mutationId: r,
                    result: _e,
                    document: u,
                    variables: p,
                    fetchPolicy: O,
                    errorPolicy: M,
                    context: L,
                    update: k,
                    updateQueries: y,
                    awaitRefetchQueries: b,
                    refetchQueries: E,
                    removeOptimistic: o ? r : void 0,
                    onQueryUpdated: S,
                    keepRootFields: F
                  });
                }).subscribe({
                  next: function(ie) {
                    a.broadcastQueries(), (!("hasNext" in ie) || ie.hasNext === !1) && G(x(x({}, ie), { data: a.maskOperation({
                      document: u,
                      data: ie.data,
                      fetchPolicy: O,
                      id: r
                    }) }));
                  },
                  error: function(ie) {
                    s && (s.loading = !1, s.error = ie), o && a.cache.removeOptimistic(r), a.broadcastQueries(), Ee(ie instanceof xt ? ie : new xt({
                      networkError: ie
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
      if (!o && rs(i, e.errorPolicy)) {
        if (un(i) || s.push({
          result: i.data,
          dataId: "ROOT_MUTATION",
          query: e.document,
          variables: e.variables
        }), un(i) && st(i.incremental)) {
          var a = t.diff({
            id: "ROOT_MUTATION",
            // The cache complains if passed a mutation where it expects a
            // query, so we transform mutations and subscriptions to queries
            // (only once, thanks to this.transformCache).
            query: this.getDocumentInfo(e.document).asQuery,
            variables: e.variables,
            optimistic: !1,
            returnPartialData: !0
          }), c = void 0;
          a.result && (c = Pu(a.result, i)), typeof c < "u" && (i.data = c, s.push({
            result: c,
            dataId: "ROOT_MUTATION",
            query: e.document,
            variables: e.variables
          }));
        }
        var l = e.updateQueries;
        l && this.queries.forEach(function(p, d) {
          var y = p.observableQuery, v = y && y.queryName;
          if (!(!v || !vp.call(l, v))) {
            var E = l[v], w = r.queries.get(d), b = w.document, k = w.variables, S = t.diff({
              query: b,
              variables: k,
              returnPartialData: !0,
              optimistic: !1
            }), I = S.result, O = S.complete;
            if (O && I) {
              var C = E(I, {
                mutationResult: i,
                queryName: b && Ln(b) || void 0,
                queryVariables: k
              });
              C && s.push({
                result: C,
                dataId: "ROOT_QUERY",
                query: b,
                variables: k
              });
            }
          }
        });
      }
      if (s.length > 0 || (e.refetchQueries || "").length > 0 || e.update || e.onQueryUpdated || e.removeOptimistic) {
        var u = [];
        if (this.refetchQueries({
          updateCache: function(p) {
            o || s.forEach(function(E) {
              return p.write(E);
            });
            var d = e.update, y = !dd(i) || un(i) && !i.hasNext;
            if (d) {
              if (!o) {
                var v = p.diff({
                  id: "ROOT_MUTATION",
                  // The cache complains if passed a mutation where it expects a
                  // query, so we transform mutations and subscriptions to queries
                  // (only once, thanks to this.transformCache).
                  query: r.getDocumentInfo(e.document).asQuery,
                  variables: e.variables,
                  optimistic: !1,
                  returnPartialData: !0
                });
                v.complete && (i = x(x({}, i), { data: v.result }), "incremental" in i && delete i.incremental, "hasNext" in i && delete i.hasNext);
              }
              y && d(p, i, {
                context: e.context,
                variables: e.variables
              });
            }
            !o && !e.keepRootFields && y && p.modify({
              id: "ROOT_MUTATION",
              fields: function(E, w) {
                var b = w.fieldName, k = w.DELETE;
                return b === "__typename" ? E : k;
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
        }).forEach(function(p) {
          return u.push(p);
        }), e.awaitRefetchQueries || e.onQueryUpdated)
          return Promise.all(u).then(function() {
            return i;
          });
      }
      return Promise.resolve(i);
    }, n.prototype.markMutationOptimistic = function(e, t) {
      var r = this, i = typeof e == "function" ? e(t.variables, { IGNORE: la }) : e;
      return i === la ? !1 : (this.cache.recordOptimisticTransaction(function(s) {
        try {
          r.markMutationResult(x(x({}, t), { result: { data: i } }), s);
        } catch (o) {
          globalThis.__DEV__ !== !1 && $.error(o);
        }
      }, t.mutationId), !0);
    }, n.prototype.fetchQuery = function(e, t, r) {
      return this.fetchConcastWithInfo(e, t, r).concast.promise;
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
      return this.documentTransform.transformDocument(e);
    }, n.prototype.getDocumentInfo = function(e) {
      var t = this.transformCache;
      if (!t.has(e)) {
        var r = {
          // TODO These three calls (hasClientExports, shouldForceResolvers, and
          // usesNonreactiveDirective) are performing independent full traversals
          // of the transformed document. We should consider merging these
          // traversals into a single pass in the future, though the work is
          // cached after the first time.
          hasClientExports: Gf(e),
          hasForcedResolvers: this.localState.shouldForceResolvers(e),
          hasNonreactiveDirective: Xn(["nonreactive"], e),
          nonReactiveQuery: Yh(e),
          clientQuery: this.localState.clientQuery(e),
          serverQuery: Cu([
            { name: "client", remove: !0 },
            { name: "connection" },
            { name: "nonreactive" },
            { name: "unmask" }
          ], e),
          defaultVars: ys(Qt(e)),
          // Transform any mutation or subscription operations to query operations
          // so we can read/write them from/to the cache.
          asQuery: x(x({}, e), { definitions: e.definitions.map(function(i) {
            return i.kind === "OperationDefinition" && i.operation !== "query" ? x(x({}, i), { operation: "query" }) : i;
          }) })
        };
        t.set(e, r);
      }
      return t.get(e);
    }, n.prototype.getVariables = function(e, t) {
      return x(x({}, this.getDocumentInfo(e).defaultVars), t);
    }, n.prototype.watchQuery = function(e) {
      var t = this.transform(e.query);
      e = x(x({}, e), { variables: this.getVariables(t, e.variables) }), typeof e.notifyOnNetworkStatusChange > "u" && (e.notifyOnNetworkStatusChange = !1);
      var r = new Ii(this), i = new ns({
        queryManager: this,
        queryInfo: r,
        options: e
      });
      return i.lastQuery = t, this.queries.set(i.queryId, r), r.init({
        document: t,
        observableQuery: i,
        variables: i.variables
      }), i;
    }, n.prototype.query = function(e, t) {
      var r = this;
      t === void 0 && (t = this.generateQueryId()), $(e.query, 30), $(e.query.kind === "Document", 31), $(!e.returnPartialData, 32), $(!e.pollInterval, 33);
      var i = this.transform(e.query);
      return this.fetchQuery(t, x(x({}, e), { query: i })).then(function(s) {
        return s && x(x({}, s), { data: r.maskOperation({
          document: i,
          data: s.data,
          fetchPolicy: e.fetchPolicy,
          id: t
        }) });
      }).finally(function() {
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
      }), this.cancelPendingFetches(Fe(34)), this.queries.forEach(function(t) {
        t.observableQuery ? t.networkStatus = te.loading : t.stop();
      }), this.mutationStore && (this.mutationStore = /* @__PURE__ */ Object.create(null)), this.cache.reset(e);
    }, n.prototype.getObservableQueries = function(e) {
      var t = this;
      e === void 0 && (e = "active");
      var r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
      return Array.isArray(e) && e.forEach(function(a) {
        if (typeof a == "string")
          i.set(a, a), s.set(a, !1);
        else if (Sh(a)) {
          var c = At(t.transform(a));
          i.set(c, Ln(a)), s.set(c, !1);
        } else ce(a) && a.query && o.add(a);
      }), this.queries.forEach(function(a, c) {
        var l = a.observableQuery, u = a.document;
        if (l) {
          if (e === "all") {
            r.set(c, l);
            return;
          }
          var p = l.queryName, d = l.options.fetchPolicy;
          if (d === "standby" || e === "active" && !l.hasObservers())
            return;
          (e === "active" || p && s.has(p) || u && s.has(At(u))) && (r.set(c, l), p && s.set(p, !0), u && s.set(At(u), !0));
        }
      }), o.size && o.forEach(function(a) {
        var c = Bi("legacyOneTimeQuery"), l = t.getQuery(c).init({
          document: a.query,
          variables: a.variables
        }), u = new ns({
          queryManager: t,
          queryInfo: l,
          options: x(x({}, a), { fetchPolicy: "network-only" })
        });
        $(u.queryId === c), l.setObservableQuery(u), r.set(c, u);
      }), globalThis.__DEV__ !== !1 && s.size && s.forEach(function(a, c) {
        if (!a) {
          var l = i.get(c);
          l ? globalThis.__DEV__ !== !1 && $.warn(35, l) : globalThis.__DEV__ !== !1 && $.warn(36);
        }
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
      var t = this, r = e.query, i = e.variables, s = e.fetchPolicy, o = e.errorPolicy, a = o === void 0 ? "none" : o, c = e.context, l = c === void 0 ? {} : c, u = e.extensions, p = u === void 0 ? {} : u;
      r = this.transform(r), i = this.getVariables(r, i);
      var d = function(v) {
        return t.getObservableFromLink(r, l, v, p).map(function(E) {
          s !== "no-cache" && (rs(E, a) && t.cache.write({
            query: r,
            result: E.data,
            dataId: "ROOT_SUBSCRIPTION",
            variables: v
          }), t.broadcastQueries());
          var w = Tr(E), b = Lu(E);
          if (w || b) {
            var k = {};
            if (w && (k.graphQLErrors = E.errors), b && (k.protocolErrors = E.extensions[Zr]), a === "none" || b)
              throw new xt(k);
          }
          return a === "ignore" && delete E.errors, E;
        });
      };
      if (this.getDocumentInfo(r).hasClientExports) {
        var y = this.localState.addExportedVariables(r, i, l).then(d);
        return new ee(function(v) {
          var E = null;
          return y.then(function(w) {
            return E = w.subscribe(v);
          }, v.error), function() {
            return E && E.unsubscribe();
          };
        });
      }
      return d(i);
    }, n.prototype.stopQuery = function(e) {
      this.stopQueryNoBroadcast(e), this.broadcastQueries();
    }, n.prototype.stopQueryNoBroadcast = function(e) {
      this.stopQueryInStoreNoBroadcast(e), this.removeQuery(e);
    }, n.prototype.removeQuery = function(e) {
      this.fetchCancelFns.delete(e), this.queries.has(e) && (this.getQuery(e).stop(), this.queries.delete(e));
    }, n.prototype.broadcastQueries = function() {
      this.onBroadcast && this.onBroadcast(), this.queries.forEach(function(e) {
        return e.notify();
      });
    }, n.prototype.getLocalState = function() {
      return this.localState;
    }, n.prototype.getObservableFromLink = function(e, t, r, i, s) {
      var o = this, a;
      s === void 0 && (s = (a = t?.queryDeduplication) !== null && a !== void 0 ? a : this.queryDeduplication);
      var c, l = this.getDocumentInfo(e), u = l.serverQuery, p = l.clientQuery;
      if (u) {
        var d = this, y = d.inFlightLinkObservables, v = d.link, E = {
          query: u,
          variables: r,
          operationName: Ln(u) || void 0,
          context: this.prepareContext(x(x({}, t), { forceFetch: !s })),
          extensions: i
        };
        if (t = E.context, s) {
          var w = At(u), b = Ot(r), k = y.lookup(w, b);
          if (c = k.observable, !c) {
            var S = new en([
              Gi(v, E)
            ]);
            c = k.observable = S, S.beforeNext(function() {
              y.remove(w, b);
            });
          }
        } else
          c = new en([
            Gi(v, E)
          ]);
      } else
        c = new en([ee.of({ data: {} })]), t = this.prepareContext(t);
      return p && (c = bi(c, function(I) {
        return o.localState.runResolvers({
          document: p,
          remoteResult: I,
          context: t,
          variables: r
        });
      })), c;
    }, n.prototype.getResultsFromLink = function(e, t, r) {
      var i = e.lastRequestId = this.generateRequestId(), s = this.cache.transformForLink(r.query);
      return bi(this.getObservableFromLink(s, r.context, r.variables), function(o) {
        var a = Ki(o), c = a.length > 0, l = r.errorPolicy;
        if (i >= e.lastRequestId) {
          if (c && l === "none")
            throw e.markError(new xt({
              graphQLErrors: a
            }));
          e.markResult(o, s, r, t), e.markReady();
        }
        var u = {
          data: o.data,
          loading: !1,
          networkStatus: te.ready
        };
        return c && l === "none" && (u.data = void 0), c && l !== "ignore" && (u.errors = a, u.networkStatus = te.error), u;
      }, function(o) {
        var a = Uu(o) ? o : new xt({ networkError: o });
        throw i >= e.lastRequestId && e.markError(a), a;
      });
    }, n.prototype.fetchConcastWithInfo = function(e, t, r, i) {
      var s = this;
      r === void 0 && (r = te.loading), i === void 0 && (i = t.query);
      var o = this.getVariables(i, t.variables), a = this.getQuery(e), c = this.defaultOptions.watchQuery, l = t.fetchPolicy, u = l === void 0 ? c && c.fetchPolicy || "cache-first" : l, p = t.errorPolicy, d = p === void 0 ? c && c.errorPolicy || "none" : p, y = t.returnPartialData, v = y === void 0 ? !1 : y, E = t.notifyOnNetworkStatusChange, w = E === void 0 ? !1 : E, b = t.context, k = b === void 0 ? {} : b, S = Object.assign({}, t, {
        query: i,
        variables: o,
        fetchPolicy: u,
        errorPolicy: d,
        returnPartialData: v,
        notifyOnNetworkStatusChange: w,
        context: k
      }), I = function(L) {
        S.variables = L;
        var V = s.fetchQueryByPolicy(a, S, r);
        return (
          // If we're in standby, postpone advancing options.fetchPolicy using
          // applyNextFetchPolicy.
          S.fetchPolicy !== "standby" && // The "standby" policy currently returns [] from fetchQueryByPolicy, so
          // this is another way to detect when nothing was done/fetched.
          V.sources.length > 0 && a.observableQuery && a.observableQuery.applyNextFetchPolicy("after-fetch", t), V
        );
      }, O = function() {
        return s.fetchCancelFns.delete(e);
      };
      this.fetchCancelFns.set(e, function(L) {
        O(), setTimeout(function() {
          return C.cancel(L);
        });
      });
      var C, M;
      if (this.getDocumentInfo(S.query).hasClientExports)
        C = new en(this.localState.addExportedVariables(S.query, S.variables, S.context).then(I).then(function(L) {
          return L.sources;
        })), M = !0;
      else {
        var F = I(S.variables);
        M = F.fromLink, C = new en(F.sources);
      }
      return C.promise.then(O, O), {
        concast: C,
        fromLink: M
      };
    }, n.prototype.refetchQueries = function(e) {
      var t = this, r = e.updateCache, i = e.include, s = e.optimistic, o = s === void 0 ? !1 : s, a = e.removeOptimistic, c = a === void 0 ? o ? Bi("refetchQueries") : void 0 : a, l = e.onQueryUpdated, u = /* @__PURE__ */ new Map();
      i && this.getObservableQueries(i).forEach(function(d, y) {
        u.set(y, {
          oq: d,
          lastDiff: t.getQuery(y).getDiff()
        });
      });
      var p = /* @__PURE__ */ new Map();
      return r && this.cache.batch({
        update: r,
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
        optimistic: o && c || !1,
        // The removeOptimistic option can also be provided by itself, even if
        // optimistic === false, to remove some previously-added optimistic
        // layer safely and efficiently, like we do in markMutationResult.
        //
        // If an explicit removeOptimistic string is provided with optimistic:
        // true, the removeOptimistic string will determine the ID of the
        // temporary optimistic layer, in case that ever matters.
        removeOptimistic: c,
        onWatchUpdated: function(d, y, v) {
          var E = d.watcher instanceof Ii && d.watcher.observableQuery;
          if (E) {
            if (l) {
              u.delete(E.queryId);
              var w = l(E, y, v);
              return w === !0 && (w = E.refetch()), w !== !1 && p.set(E, w), w;
            }
            l !== null && u.set(E.queryId, { oq: E, lastDiff: v, diff: y });
          }
        }
      }), u.size && u.forEach(function(d, y) {
        var v = d.oq, E = d.lastDiff, w = d.diff, b;
        if (l) {
          if (!w) {
            var k = v.queryInfo;
            k.reset(), w = k.getDiff();
          }
          b = l(v, w, E);
        }
        (!l || b === !0) && (b = v.refetch()), b !== !1 && p.set(v, b), y.indexOf("legacyOneTimeQuery") >= 0 && t.stopQueryNoBroadcast(y);
      }), c && this.cache.removeOptimistic(c), p;
    }, n.prototype.maskOperation = function(e) {
      var t, r, i, s = e.document, o = e.data;
      if (globalThis.__DEV__ !== !1) {
        var a = e.fetchPolicy, c = e.id, l = (t = Qt(s)) === null || t === void 0 ? void 0 : t.operation, u = ((r = l?.[0]) !== null && r !== void 0 ? r : "o") + c;
        this.dataMasking && a === "no-cache" && !sh(s) && !this.noCacheWarningsByQueryId.has(u) && (this.noCacheWarningsByQueryId.add(u), globalThis.__DEV__ !== !1 && $.warn(
          37,
          (i = Ln(s)) !== null && i !== void 0 ? i : "Unnamed ".concat(l ?? "operation")
        ));
      }
      return this.dataMasking ? Zd(o, s, this.cache) : o;
    }, n.prototype.maskFragment = function(e) {
      var t = e.data, r = e.fragment, i = e.fragmentName;
      return this.dataMasking ? Ku(t, r, this.cache, i) : t;
    }, n.prototype.fetchQueryByPolicy = function(e, t, r) {
      var i = this, s = t.query, o = t.variables, a = t.fetchPolicy, c = t.refetchWritePolicy, l = t.errorPolicy, u = t.returnPartialData, p = t.context, d = t.notifyOnNetworkStatusChange, y = e.networkStatus;
      e.init({
        document: s,
        variables: o,
        networkStatus: r
      });
      var v = function() {
        return e.getDiff();
      }, E = function(I, O) {
        O === void 0 && (O = e.networkStatus || te.loading);
        var C = I.result;
        globalThis.__DEV__ !== !1 && !u && !oe(C, {}) && lc(I.missing);
        var M = function(F) {
          return ee.of(x({ data: F, loading: tr(O), networkStatus: O }, I.complete ? null : { partial: !0 }));
        };
        return C && i.getDocumentInfo(s).hasForcedResolvers ? i.localState.runResolvers({
          document: s,
          remoteResult: { data: C },
          context: p,
          variables: o,
          onlyRunForcedResolvers: !0
        }).then(function(F) {
          return M(F.data || void 0);
        }) : l === "none" && O === te.refetch && Array.isArray(I.missing) ? M(void 0) : M(C);
      }, w = a === "no-cache" ? 0 : r === te.refetch && c !== "merge" ? 1 : 2, b = function() {
        return i.getResultsFromLink(e, w, {
          query: s,
          variables: o,
          context: p,
          fetchPolicy: a,
          errorPolicy: l
        });
      }, k = d && typeof y == "number" && y !== r && tr(r);
      switch (a) {
        default:
        case "cache-first": {
          var S = v();
          return S.complete ? {
            fromLink: !1,
            sources: [E(S, e.markReady())]
          } : u || k ? {
            fromLink: !0,
            sources: [E(S), b()]
          } : { fromLink: !0, sources: [b()] };
        }
        case "cache-and-network": {
          var S = v();
          return S.complete || u || k ? {
            fromLink: !0,
            sources: [E(S), b()]
          } : { fromLink: !0, sources: [b()] };
        }
        case "cache-only":
          return {
            fromLink: !1,
            sources: [E(v(), e.markReady())]
          };
        case "network-only":
          return k ? {
            fromLink: !0,
            sources: [E(v()), b()]
          } : { fromLink: !0, sources: [b()] };
        case "no-cache":
          return k ? {
            fromLink: !0,
            // Note that queryInfo.getDiff() for no-cache queries does not call
            // cache.diff, but instead returns a { complete: false } stub result
            // when there is no queryInfo.diff already defined.
            sources: [E(e.getDiff()), b()]
          } : { fromLink: !0, sources: [b()] };
        case "standby":
          return { fromLink: !1, sources: [] };
      }
    }, n.prototype.getQuery = function(e) {
      return e && !this.queries.has(e) && this.queries.set(e, new Ii(this, e)), this.queries.get(e);
    }, n.prototype.prepareContext = function(e) {
      e === void 0 && (e = {});
      var t = this.localState.prepareContext(e);
      return x(x(x({}, this.defaultContext), t), { clientAwareness: this.clientAwareness });
    }, n;
  }()
), wp = (
  /** @class */
  function() {
    function n(e) {
      var t = e.cache, r = e.client, i = e.resolvers, s = e.fragmentMatcher;
      this.selectionsToResolveCache = /* @__PURE__ */ new WeakMap(), this.cache = t, r && (this.client = r), i && this.addResolvers(i), s && this.setFragmentMatcher(s);
    }
    return n.prototype.addResolvers = function(e) {
      var t = this;
      this.resolvers = this.resolvers || {}, Array.isArray(e) ? e.forEach(function(r) {
        t.resolvers = Oo(t.resolvers, r);
      }) : this.resolvers = Oo(this.resolvers, e);
    }, n.prototype.setResolvers = function(e) {
      this.resolvers = {}, this.addResolvers(e);
    }, n.prototype.getResolvers = function() {
      return this.resolvers || {};
    }, n.prototype.runResolvers = function(e) {
      return _t(this, arguments, void 0, function(t) {
        var r = t.document, i = t.remoteResult, s = t.context, o = t.variables, a = t.onlyRunForcedResolvers, c = a === void 0 ? !1 : a;
        return St(this, function(l) {
          return r ? [2, this.resolveDocument(r, i.data, s, o, this.fragmentMatcher, c).then(function(u) {
            return x(x({}, i), { data: u.result });
          })] : [2, i];
        });
      });
    }, n.prototype.setFragmentMatcher = function(e) {
      this.fragmentMatcher = e;
    }, n.prototype.getFragmentMatcher = function() {
      return this.fragmentMatcher;
    }, n.prototype.clientQuery = function(e) {
      return Xn(["client"], e) && this.resolvers ? e : null;
    }, n.prototype.serverQuery = function(e) {
      return Ru(e);
    }, n.prototype.prepareContext = function(e) {
      var t = this.cache;
      return x(x({}, e), {
        cache: t,
        // Getting an entry's cache key is useful for local state resolvers.
        getCacheKey: function(r) {
          return t.identify(r);
        }
      });
    }, n.prototype.addExportedVariables = function(e) {
      return _t(this, arguments, void 0, function(t, r, i) {
        return r === void 0 && (r = {}), i === void 0 && (i = {}), St(this, function(s) {
          return t ? [2, this.resolveDocument(t, this.buildRootValueFromCache(t, r) || {}, this.prepareContext(i), r).then(function(o) {
            return x(x({}, r), o.exportedVariables);
          })] : [2, x({}, r)];
        });
      });
    }, n.prototype.shouldForceResolvers = function(e) {
      var t = !1;
      return Xe(e, {
        Directive: {
          enter: function(r) {
            if (r.name.value === "client" && r.arguments && (t = r.arguments.some(function(i) {
              return i.name.value === "always" && i.value.kind === "BooleanValue" && i.value.value === !0;
            }), t))
              return Wr;
          }
        }
      }), t;
    }, n.prototype.buildRootValueFromCache = function(e, t) {
      return this.cache.diff({
        query: Jh(e),
        variables: t,
        returnPartialData: !0,
        optimistic: !1
      }).result;
    }, n.prototype.resolveDocument = function(e, t) {
      return _t(this, arguments, void 0, function(r, i, s, o, a, c) {
        var l, u, p, d, y, v, E, w, b, k, S;
        return s === void 0 && (s = {}), o === void 0 && (o = {}), a === void 0 && (a = function() {
          return !0;
        }), c === void 0 && (c = !1), St(this, function(I) {
          return l = En(r), u = wn(r), p = vn(u), d = this.collectSelectionsToResolve(l, p), y = l.operation, v = y ? y.charAt(0).toUpperCase() + y.slice(1) : "Query", E = this, w = E.cache, b = E.client, k = {
            fragmentMap: p,
            context: x(x({}, s), { cache: w, client: b }),
            variables: o,
            fragmentMatcher: a,
            defaultOperationType: v,
            exportedVariables: {},
            selectionsToResolve: d,
            onlyRunForcedResolvers: c
          }, S = !1, [2, this.resolveSelectionSet(l.selectionSet, S, i, k).then(function(O) {
            return {
              result: O,
              exportedVariables: k.exportedVariables
            };
          })];
        });
      });
    }, n.prototype.resolveSelectionSet = function(e, t, r, i) {
      return _t(this, void 0, void 0, function() {
        var s, o, a, c, l, u = this;
        return St(this, function(p) {
          return s = i.fragmentMap, o = i.context, a = i.variables, c = [r], l = function(d) {
            return _t(u, void 0, void 0, function() {
              var y, v;
              return St(this, function(E) {
                return !t && !i.selectionsToResolve.has(d) ? [
                  2
                  /*return*/
                ] : or(d, a) ? Ct(d) ? [2, this.resolveField(d, t, r, i).then(function(w) {
                  var b;
                  typeof w < "u" && c.push((b = {}, b[gt(d)] = w, b));
                })] : (Fh(d) ? y = d : (y = s[d.name.value], $(y, 19, d.name.value)), y && y.typeCondition && (v = y.typeCondition.name.value, i.fragmentMatcher(r, v, o)) ? [2, this.resolveSelectionSet(y.selectionSet, t, r, i).then(function(w) {
                  c.push(w);
                })] : [
                  2
                  /*return*/
                ]) : [
                  2
                  /*return*/
                ];
              });
            });
          }, [2, Promise.all(e.selections.map(l)).then(function() {
            return Xr(c);
          })];
        });
      });
    }, n.prototype.resolveField = function(e, t, r, i) {
      return _t(this, void 0, void 0, function() {
        var s, o, a, c, l, u, p, d, y, v = this;
        return St(this, function(E) {
          return r ? (s = i.variables, o = e.name.value, a = gt(e), c = o !== a, l = r[a] || r[o], u = Promise.resolve(l), (!i.onlyRunForcedResolvers || this.shouldForceResolvers(e)) && (p = r.__typename || i.defaultOperationType, d = this.resolvers && this.resolvers[p], d && (y = d[c ? o : a], y && (u = Promise.resolve(
            // In case the resolve function accesses reactive variables,
            // set cacheSlot to the current cache instance.
            Ts.withValue(this.cache, y, [
              r,
              Gr(e, s),
              i.context,
              { field: e, fragmentMap: i.fragmentMap }
            ])
          )))), [2, u.then(function(w) {
            var b, k;
            if (w === void 0 && (w = l), e.directives && e.directives.forEach(function(I) {
              I.name.value === "export" && I.arguments && I.arguments.forEach(function(O) {
                O.name.value === "as" && O.value.kind === "StringValue" && (i.exportedVariables[O.value.value] = w);
              });
            }), !e.selectionSet || w == null)
              return w;
            var S = (k = (b = e.directives) === null || b === void 0 ? void 0 : b.some(function(I) {
              return I.name.value === "client";
            })) !== null && k !== void 0 ? k : !1;
            if (Array.isArray(w))
              return v.resolveSubSelectedArray(e, t || S, w, i);
            if (e.selectionSet)
              return v.resolveSelectionSet(e.selectionSet, t || S, w, i);
          })]) : [2, null];
        });
      });
    }, n.prototype.resolveSubSelectedArray = function(e, t, r, i) {
      var s = this;
      return Promise.all(r.map(function(o) {
        if (o === null)
          return null;
        if (Array.isArray(o))
          return s.resolveSubSelectedArray(e, t, o, i);
        if (e.selectionSet)
          return s.resolveSelectionSet(e.selectionSet, t, o, i);
      }));
    }, n.prototype.collectSelectionsToResolve = function(e, t) {
      var r = function(o) {
        return !Array.isArray(o);
      }, i = this.selectionsToResolveCache;
      function s(o) {
        if (!i.has(o)) {
          var a = /* @__PURE__ */ new Set();
          i.set(o, a), Xe(o, {
            Directive: function(c, l, u, p, d) {
              c.name.value === "client" && d.forEach(function(y) {
                r(y) && wo(y) && a.add(y);
              });
            },
            FragmentSpread: function(c, l, u, p, d) {
              var y = t[c.name.value];
              $(y, 20, c.name.value);
              var v = s(y);
              v.size > 0 && (d.forEach(function(E) {
                r(E) && wo(E) && a.add(E);
              }), a.add(c), v.forEach(function(E) {
                a.add(E);
              }));
            }
          });
        }
        return i.get(o);
      }
      return s(e);
    }, n;
  }()
), fa = !1, fc = (
  /** @class */
  function() {
    function n(e) {
      var t = this, r;
      if (this.resetStoreCallbacks = [], this.clearStoreCallbacks = [], !e.cache)
        throw Fe(16);
      var i = e.uri, s = e.credentials, o = e.headers, a = e.cache, c = e.documentTransform, l = e.ssrMode, u = l === void 0 ? !1 : l, p = e.ssrForceFetchDelay, d = p === void 0 ? 0 : p, y = e.connectToDevTools, v = e.queryDeduplication, E = v === void 0 ? !0 : v, w = e.defaultOptions, b = e.defaultContext, k = e.assumeImmutableResults, S = k === void 0 ? a.assumeImmutableResults : k, I = e.resolvers, O = e.typeDefs, C = e.fragmentMatcher, M = e.name, F = e.version, L = e.devtools, V = e.dataMasking, G = e.link;
      G || (G = i ? new Hd({ uri: i, credentials: s, headers: o }) : We.empty()), this.link = G, this.cache = a, this.disableNetworkFetches = u || d > 0, this.queryDeduplication = E, this.defaultOptions = w || /* @__PURE__ */ Object.create(null), this.typeDefs = O, this.devtoolsConfig = x(x({}, L), { enabled: (r = L?.enabled) !== null && r !== void 0 ? r : y }), this.devtoolsConfig.enabled === void 0 && (this.devtoolsConfig.enabled = globalThis.__DEV__ !== !1), d && setTimeout(function() {
        return t.disableNetworkFetches = !1;
      }, d), this.watchQuery = this.watchQuery.bind(this), this.query = this.query.bind(this), this.mutate = this.mutate.bind(this), this.watchFragment = this.watchFragment.bind(this), this.resetStore = this.resetStore.bind(this), this.reFetchObservableQueries = this.reFetchObservableQueries.bind(this), this.version = cs, this.localState = new wp({
        cache: a,
        client: this,
        resolvers: I,
        fragmentMatcher: C
      }), this.queryManager = new bp({
        cache: this.cache,
        link: this.link,
        defaultOptions: this.defaultOptions,
        defaultContext: b,
        documentTransform: c,
        queryDeduplication: E,
        ssrMode: u,
        dataMasking: !!V,
        clientAwareness: {
          name: M,
          version: F
        },
        localState: this.localState,
        assumeImmutableResults: S,
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
    return n.prototype.connectToDevTools = function() {
      if (!(typeof window > "u")) {
        var e = window, t = Symbol.for("apollo.devtools");
        (e[t] = e[t] || []).push(this), e.__APOLLO_CLIENT__ = this, !fa && globalThis.__DEV__ !== !1 && (fa = !0, window.document && window.top === window.self && /^(https?|file):$/.test(window.location.protocol) && setTimeout(function() {
          if (!window.__APOLLO_DEVTOOLS_GLOBAL_HOOK__) {
            var r = window.navigator, i = r && r.userAgent, s = void 0;
            typeof i == "string" && (i.indexOf("Chrome/") > -1 ? s = "https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm" : i.indexOf("Firefox/") > -1 && (s = "https://addons.mozilla.org/en-US/firefox/addon/apollo-developer-tools/")), s && globalThis.__DEV__ !== !1 && $.log("Download the Apollo DevTools for a better development experience: %s", s);
          }
        }, 1e4));
      }
    }, Object.defineProperty(n.prototype, "documentTransform", {
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
    }), n.prototype.stop = function() {
      this.queryManager.stop();
    }, n.prototype.watchQuery = function(e) {
      return this.defaultOptions.watchQuery && (e = wi(this.defaultOptions.watchQuery, e)), this.disableNetworkFetches && (e.fetchPolicy === "network-only" || e.fetchPolicy === "cache-and-network") && (e = x(x({}, e), { fetchPolicy: "cache-first" })), this.queryManager.watchQuery(e);
    }, n.prototype.query = function(e) {
      return this.defaultOptions.query && (e = wi(this.defaultOptions.query, e)), $(e.fetchPolicy !== "cache-and-network", 17), this.disableNetworkFetches && e.fetchPolicy === "network-only" && (e = x(x({}, e), { fetchPolicy: "cache-first" })), this.queryManager.query(e);
    }, n.prototype.mutate = function(e) {
      return this.defaultOptions.mutate && (e = wi(this.defaultOptions.mutate, e)), this.queryManager.mutate(e);
    }, n.prototype.subscribe = function(e) {
      var t = this, r = this.queryManager.generateQueryId();
      return this.queryManager.startGraphQLSubscription(e).map(function(i) {
        return x(x({}, i), { data: t.queryManager.maskOperation({
          document: e.query,
          data: i.data,
          fetchPolicy: e.fetchPolicy,
          id: r
        }) });
      });
    }, n.prototype.readQuery = function(e, t) {
      return t === void 0 && (t = !1), this.cache.readQuery(e, t);
    }, n.prototype.watchFragment = function(e) {
      var t;
      return this.cache.watchFragment(x(x({}, e), (t = {}, t[Symbol.for("apollo.dataMasking")] = this.queryManager.dataMasking, t)));
    }, n.prototype.readFragment = function(e, t) {
      return t === void 0 && (t = !1), this.cache.readFragment(e, t);
    }, n.prototype.writeQuery = function(e) {
      var t = this.cache.writeQuery(e);
      return e.broadcast !== !1 && this.queryManager.broadcastQueries(), t;
    }, n.prototype.writeFragment = function(e) {
      var t = this.cache.writeFragment(e);
      return e.broadcast !== !1 && this.queryManager.broadcastQueries(), t;
    }, n.prototype.__actionHookForDevTools = function(e) {
      this.devToolsHookCb = e;
    }, n.prototype.__requestRaw = function(e) {
      return Gi(this.link, e);
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
        globalThis.__DEV__ !== !1 && $.debug(18, o);
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
    }, Object.defineProperty(n.prototype, "defaultContext", {
      get: function() {
        return this.queryManager.defaultContext;
      },
      enumerable: !1,
      configurable: !0
    }), n;
  }()
);
globalThis.__DEV__ !== !1 && (fc.prototype.getMemoryInternals = ph);
var Or = /* @__PURE__ */ new Map(), is = /* @__PURE__ */ new Map(), hc = !0, Lr = !1;
function dc(n) {
  return n.replace(/[\s,]+/g, " ").trim();
}
function Ep(n) {
  return dc(n.source.body.substring(n.start, n.end));
}
function _p(n) {
  var e = /* @__PURE__ */ new Set(), t = [];
  return n.definitions.forEach(function(r) {
    if (r.kind === "FragmentDefinition") {
      var i = r.name.value, s = Ep(r.loc), o = is.get(i);
      o && !o.has(s) ? hc && console.warn("Warning: fragment with name " + i + ` already exists.
graphql-tag enforces all fragment names across your application to be unique; read more about
this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names`) : o || is.set(i, o = /* @__PURE__ */ new Set()), o.add(s), e.has(s) || (e.add(s), t.push(r));
    } else
      t.push(r);
  }), x(x({}, n), { definitions: t });
}
function Sp(n) {
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
function kp(n) {
  var e = dc(n);
  if (!Or.has(e)) {
    var t = Uf(n, {
      experimentalFragmentVariables: Lr,
      allowLegacyFragmentVariables: Lr
    });
    if (!t || t.kind !== "Document")
      throw new Error("Not a valid GraphQL document.");
    Or.set(e, Sp(_p(t)));
  }
  return Or.get(e);
}
function ae(n) {
  for (var e = [], t = 1; t < arguments.length; t++)
    e[t - 1] = arguments[t];
  typeof n == "string" && (n = [n]);
  var r = n[0];
  return e.forEach(function(i, s) {
    i && i.kind === "Document" ? r += i.loc.source.body : r += i, r += n[s + 1];
  }), kp(r);
}
function xp() {
  Or.clear(), is.clear();
}
function Tp() {
  hc = !1;
}
function Ip() {
  Lr = !0;
}
function Ap() {
  Lr = !1;
}
var Fn = {
  gql: ae,
  resetCaches: xp,
  disableFragmentWarnings: Tp,
  enableExperimentalFragmentVariables: Ip,
  disableExperimentalFragmentVariables: Ap
};
(function(n) {
  n.gql = Fn.gql, n.resetCaches = Fn.resetCaches, n.disableFragmentWarnings = Fn.disableFragmentWarnings, n.enableExperimentalFragmentVariables = Fn.enableExperimentalFragmentVariables, n.disableExperimentalFragmentVariables = Fn.disableExperimentalFragmentVariables;
})(ae);
ae.default = ae;
class Op extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ae`query ($bundle: String!) {
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
    return new af({
      query: this,
      json: e
    });
  }
}
class Cp extends be {
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
      r.metas = Nr.aggregateMeta(r.metas), t[r.bundleHash] = r;
    }), t;
  }
}
class Rp extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ae`query( $bundleHashes: [ String! ] ) {
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
    return new Cp({
      query: this,
      json: e
    });
  }
}
class ti extends be {
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
    if (e.position === null || typeof e.position > "u" ? r = Y.create({
      bundle: e.bundleHash,
      token: e.tokenSlug,
      batchId: e.batchId,
      characters: e.characters
    }) : (r = new Y({
      secret: t,
      token: e.tokenSlug,
      position: e.position,
      batchId: e.batchId,
      characters: e.characters
    }), r.address = e.address, r.bundle = e.bundleHash), e.token && (r.tokenName = e.token.name, r.tokenAmount = e.token.amount, r.tokenSupply = e.token.supply, r.tokenFungibility = e.token.fungibility), e.tokenUnits.length)
      for (const i of e.tokenUnits)
        r.tokenUnits.push(zn.createFromGraphQL(i));
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
      r.push(ti.toClientWallet({
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
class Np extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ae`query( $bundleHash: String, $tokenSlug: String ) {
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
    return new ti({
      query: this,
      json: e
    });
  }
}
class Mp extends be {
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
    return !e || !e.bundleHash || !e.tokenSlug ? null : ti.toClientWallet({
      data: e
    });
  }
}
class Dp extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ae`query( $address: String, $bundleHash: String, $type: String, $token: String, $position: String ) {
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
    return new Mp({
      query: this,
      json: e
    });
  }
}
class Fp extends be {
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
class ha extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ae`query( $metaType: String, $metaTypes: [ String! ], $metaId: String, $metaIds: [ String! ], $key: String, $keys: [ String! ], $value: String, $values: [ String! ], $count: String, $latest: Boolean, $filter: [ MetaFilter! ], $queryArgs: QueryArgs, $countBy: String ) {
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
    count: c = null,
    countBy: l = null
  }) {
    const u = {};
    return e && (u[typeof e == "string" ? "metaType" : "metaTypes"] = e), t && (u[typeof t == "string" ? "metaId" : "metaIds"] = t), r && (u[typeof r == "string" ? "key" : "keys"] = r), i && (u[typeof i == "string" ? "value" : "values"] = i), u.latest = s === !0, o && (u.filter = o), a && ((typeof a.limit > "u" || a.limit === 0) && (a.limit = "*"), u.queryArgs = a), c && (u.count = c), l && (u.countBy = l), u;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaType}
   */
  createResponse(e) {
    return new Fp({
      query: this,
      json: e
    });
  }
}
class nr extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ae`query( $batchId: String ) {
      Batch( batchId: $batchId ) {
        ${nr.getFields()},
        children {
          ${nr.getFields()}
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
class Bp extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ae`query( $batchId: String ) {
      BatchHistory( batchId: $batchId ) {
        ${nr.getFields()}
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
class at extends be {
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
    const t = new ft({});
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
class Cs extends $e {
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
class Re extends Cs {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   * @param molecule
   */
  constructor(e, t, r) {
    super(e, t), this.$__molecule = r, this.$__remainderWallet = null, this.$__query = ae`mutation( $molecule: MoleculeInput! ) {
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
    return new at({
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
class Pp extends at {
  /**
   * return the authorization key
   *
   * @param key
   * @return {*}
   */
  payloadKey(e) {
    if (!he.has(this.payload(), e))
      throw new jn(`ResponseRequestAuthorization::payloadKey() - '${e}' key was not found in the payload!`);
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
class $p extends Re {
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
    return new Pp({
      query: this,
      json: e
    });
  }
}
class Lp extends at {
}
class Up extends Re {
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
    return new Lp({
      query: this,
      json: e
    });
  }
}
class qp extends at {
}
class jp extends Re {
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
    return new qp({
      query: this,
      json: e
    });
  }
}
class Vp extends at {
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
class Qp extends Re {
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
    return new Vp({
      query: this,
      json: e
    });
  }
}
class Hp extends at {
}
class Wp extends Re {
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
    return new Hp({
      query: this,
      json: e
    });
  }
}
class zp extends at {
}
class Kp extends Re {
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
    const r = Y.create({
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
    return new zp({
      query: this,
      json: e
    });
  }
}
class Gp extends at {
}
class Jp extends Re {
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
    return new Gp({
      query: this,
      json: e
    });
  }
}
class Yp extends at {
}
class Xp extends Re {
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
    return new Yp({
      query: this,
      json: e
    });
  }
}
class Zp extends be {
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
      throw new jn(`ResponseAuthorizationGuest::payloadKey() - '${e}' key is not found in the payload!`);
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
class ey extends Cs {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ae`mutation( $cellSlug: String, $pubkey: String, $encrypt: Boolean ) {
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
    return new Zp({
      query: this,
      json: e
    });
  }
}
class da extends re {
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
class ty extends re {
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
class gr extends re {
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
class ni {
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
      throw new Qe("Subscribe::createSubscribe() - Node URI was not initialized for this client instance!");
    if (this.$__subscribe === null)
      throw new Qe("Subscribe::createSubscribe() - GraphQL subscription was not initialized!");
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
      throw new Qe(`${this.constructor.name}::execute() - closure parameter is required!`);
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
class ny extends ni {
  constructor(e) {
    super(e), this.$__subscribe = ae`
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
class ry extends ni {
  constructor(e) {
    super(e), this.$__subscribe = ae`
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
class iy extends ni {
  constructor(e) {
    super(e), this.$__subscribe = ae`
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
class sy extends ni {
  constructor(e) {
    super(e), this.$__subscribe = ae`
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
class oy extends be {
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
class ay extends Cs {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ae`mutation(
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
    return new oy({
      query: this,
      json: e
    });
  }
}
class uy extends be {
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
class cy extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ae`query ActiveUserQuery ($bundleHash:String, $metaType: String, $metaId: String) {
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
    return new uy({
      query: this,
      json: e
    });
  }
}
class ly extends be {
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
class fy extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ae`query UserActivity (
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
    return new ly({
      query: this,
      json: e
    });
  }
}
class hy extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ae`query( $slug: String, $slugs: [ String! ], $limit: Int, $order: String ) {
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
class pa extends re {
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
class dy extends be {
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
class ya extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ae`query(
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
    walletAddress: c,
    isotopes: l,
    isotope: u,
    tokenSlugs: p,
    tokenSlug: d,
    cellSlugs: y,
    cellSlug: v,
    batchIds: E,
    batchId: w,
    values: b,
    value: k,
    metaTypes: S,
    metaType: I,
    metaIds: O,
    metaId: C,
    indexes: M,
    index: F,
    filter: L,
    latest: V,
    queryArgs: G
  }) {
    return t && (e = e || [], e.push(t)), i && (r = r || [], r.push(i)), o && (s = s || [], s.push(o)), c && (a = a || [], a.push(c)), u && (l = l || [], l.push(u)), d && (p = p || [], p.push(d)), v && (y = y || [], y.push(v)), w && (E = E || [], E.push(w)), k && (b = b || [], b.push(k)), I && (S = S || [], S.push(I)), C && (O = O || [], O.push(C)), F && (M = M || [], M.push(F)), {
      molecularHashes: e,
      bundleHashes: r,
      positions: s,
      walletAddresses: a,
      isotopes: l,
      tokenSlugs: p,
      cellSlugs: y,
      batchIds: E,
      values: b,
      metaTypes: S,
      metaIds: O,
      indexes: M,
      filter: L,
      latest: V,
      queryArgs: G
    };
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseAtom}
   */
  createResponse(e) {
    return new dy({
      query: this,
      json: e
    });
  }
}
class py extends be {
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
class yy extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ae`query( $metaType: String, $metaId: String, ) {
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
    return new py({
      query: this,
      json: e
    });
  }
}
class my extends be {
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
class ma extends $e {
  /**
   * @param {ApolloClientWrapper} apolloClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = ae`query ($metaTypes: [String!], $metaIds: [String!], $values: [String!], $keys: [String!], $latest: Boolean, $filter: [MetaFilter!], $queryArgs: QueryArgs, $countBy: String, $atomValues: [String!] ) {
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
    latest: c = null,
    filter: l = null,
    queryArgs: u = null,
    countBy: p = null
  }) {
    const d = {};
    return a && (d.atomValues = a), s && (d.keys = s), o && (d.values = o), e && (d.metaTypes = typeof e == "string" ? [e] : e), t && (d.metaIds = typeof t == "string" ? [t] : t), p && (d.countBy = p), l && (d.filter = l), r && i && (d.filter = d.filter || [], d.filter.push({
      key: r,
      value: i,
      comparison: "="
    })), d.latest = c === !0, u && ((typeof u.limit > "u" || u.limit === 0) && (u.limit = "*"), d.queryArgs = u), d;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaTypeViaAtom}
   */
  createResponse(e) {
    return new my({
      query: this,
      json: e
    });
  }
}
class gy extends at {
}
class vy extends Re {
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
    return new gy({
      query: this,
      json: e
    });
  }
}
class by extends Re {
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
class wy extends Re {
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
function ht(n, e, t, r) {
  return new (t || (t = Promise))(function(i, s) {
    function o(l) {
      try {
        c(r.next(l));
      } catch (u) {
        s(u);
      }
    }
    function a(l) {
      try {
        c(r.throw(l));
      } catch (u) {
        s(u);
      }
    }
    function c(l) {
      var u;
      l.done ? i(l.value) : (u = l.value, u instanceof t ? u : new t(function(p) {
        p(u);
      })).then(o, a);
    }
    c((r = r.apply(n, [])).next());
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
  function a(c) {
    return function(l) {
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
        } catch (p) {
          u = [6, p], r = 0;
        } finally {
          t = i = 0;
        }
        if (5 & u[0]) throw u[1];
        return { value: u[0] ? u[1] : void 0, done: !0 };
      }([c, l]);
    };
  }
}
var pt = { exclude: [] }, pc = {}, Ey = { timeout: "true" }, Je = function(n, e) {
  typeof window < "u" && (pc[n] = e);
}, _y = function() {
  return Object.fromEntries(Object.entries(pc).filter(function(n) {
    var e, t = n[0];
    return !(!((e = pt?.exclude) === null || e === void 0) && e.includes(t));
  }).map(function(n) {
    return [n[0], (0, n[1])()];
  }));
};
function vr(n) {
  return n ^= n >>> 16, n = Math.imul(n, 2246822507), n ^= n >>> 13, n = Math.imul(n, 3266489909), (n ^= n >>> 16) >>> 0;
}
var Ae = new Uint32Array([597399067, 2869860233, 951274213, 2716044179]);
function qe(n, e) {
  return n << e | n >>> 32 - e;
}
function Rs(n, e) {
  var t;
  if (e === void 0 && (e = 0), e = e ? 0 | e : 0, typeof n == "string" && (t = n, n = new TextEncoder().encode(t).buffer), !(n instanceof ArrayBuffer)) throw new TypeError("Expected key to be ArrayBuffer or string");
  var r = new Uint32Array([e, e, e, e]);
  (function(s, o) {
    for (var a = s.byteLength / 16 | 0, c = new Uint32Array(s, 0, 4 * a), l = 0; l < a; l++) {
      var u = c.subarray(4 * l, 4 * (l + 1));
      u[0] = Math.imul(u[0], Ae[0]), u[0] = qe(u[0], 15), u[0] = Math.imul(u[0], Ae[1]), o[0] = o[0] ^ u[0], o[0] = qe(o[0], 19), o[0] = o[0] + o[1], o[0] = Math.imul(o[0], 5) + 1444728091, u[1] = Math.imul(u[1], Ae[1]), u[1] = qe(u[1], 16), u[1] = Math.imul(u[1], Ae[2]), o[1] = o[1] ^ u[1], o[1] = qe(o[1], 17), o[1] = o[1] + o[2], o[1] = Math.imul(o[1], 5) + 197830471, u[2] = Math.imul(u[2], Ae[2]), u[2] = qe(u[2], 17), u[2] = Math.imul(u[2], Ae[3]), o[2] = o[2] ^ u[2], o[2] = qe(o[2], 15), o[2] = o[2] + o[3], o[2] = Math.imul(o[2], 5) + 2530024501, u[3] = Math.imul(u[3], Ae[3]), u[3] = qe(u[3], 18), u[3] = Math.imul(u[3], Ae[0]), o[3] = o[3] ^ u[3], o[3] = qe(o[3], 13), o[3] = o[3] + o[0], o[3] = Math.imul(o[3], 5) + 850148119;
    }
  })(n, r), function(s, o) {
    var a = s.byteLength / 16 | 0, c = s.byteLength % 16, l = new Uint32Array(4), u = new Uint8Array(s, 16 * a, c);
    switch (c) {
      case 15:
        l[3] = l[3] ^ u[14] << 16;
      case 14:
        l[3] = l[3] ^ u[13] << 8;
      case 13:
        l[3] = l[3] ^ u[12] << 0, l[3] = Math.imul(l[3], Ae[3]), l[3] = qe(l[3], 18), l[3] = Math.imul(l[3], Ae[0]), o[3] = o[3] ^ l[3];
      case 12:
        l[2] = l[2] ^ u[11] << 24;
      case 11:
        l[2] = l[2] ^ u[10] << 16;
      case 10:
        l[2] = l[2] ^ u[9] << 8;
      case 9:
        l[2] = l[2] ^ u[8] << 0, l[2] = Math.imul(l[2], Ae[2]), l[2] = qe(l[2], 17), l[2] = Math.imul(l[2], Ae[3]), o[2] = o[2] ^ l[2];
      case 8:
        l[1] = l[1] ^ u[7] << 24;
      case 7:
        l[1] = l[1] ^ u[6] << 16;
      case 6:
        l[1] = l[1] ^ u[5] << 8;
      case 5:
        l[1] = l[1] ^ u[4] << 0, l[1] = Math.imul(l[1], Ae[1]), l[1] = qe(l[1], 16), l[1] = Math.imul(l[1], Ae[2]), o[1] = o[1] ^ l[1];
      case 4:
        l[0] = l[0] ^ u[3] << 24;
      case 3:
        l[0] = l[0] ^ u[2] << 16;
      case 2:
        l[0] = l[0] ^ u[1] << 8;
      case 1:
        l[0] = l[0] ^ u[0] << 0, l[0] = Math.imul(l[0], Ae[0]), l[0] = qe(l[0], 15), l[0] = Math.imul(l[0], Ae[1]), o[0] = o[0] ^ l[0];
    }
  }(n, r), function(s, o) {
    o[0] = o[0] ^ s.byteLength, o[1] = o[1] ^ s.byteLength, o[2] = o[2] ^ s.byteLength, o[3] = o[3] ^ s.byteLength, o[0] = o[0] + o[1] | 0, o[0] = o[0] + o[2] | 0, o[0] = o[0] + o[3] | 0, o[1] = o[1] + o[0] | 0, o[2] = o[2] + o[0] | 0, o[3] = o[3] + o[0] | 0, o[0] = vr(o[0]), o[1] = vr(o[1]), o[2] = vr(o[2]), o[3] = vr(o[3]), o[0] = o[0] + o[1] | 0, o[0] = o[0] + o[2] | 0, o[0] = o[0] + o[3] | 0, o[1] = o[1] + o[0] | 0, o[2] = o[2] + o[0] | 0, o[3] = o[3] + o[0] | 0;
  }(n, r);
  var i = new Uint8Array(r.buffer);
  return Array.from(i).map(function(s) {
    return s.toString(16).padStart(2, "0");
  }).join("");
}
function Sy(n, e) {
  return new Promise(function(t) {
    setTimeout(function() {
      return t(e);
    }, n);
  });
}
function ky(n, e, t) {
  return Promise.all(n.map(function(r) {
    return Promise.race([r, Sy(e, t)]);
  }));
}
function yc() {
  return ht(this, void 0, void 0, function() {
    var n, e, t, r, i;
    return dt(this, function(s) {
      switch (s.label) {
        case 0:
          return s.trys.push([0, 2, , 3]), n = _y(), e = Object.keys(n), [4, ky(Object.values(n), pt?.timeout || 1e3, Ey)];
        case 1:
          return t = s.sent(), r = t.filter(function(o) {
            return o !== void 0;
          }), i = {}, r.forEach(function(o, a) {
            i[e[a]] = o;
          }), [2, mc(i, pt.exclude || [])];
        case 2:
          throw s.sent();
        case 3:
          return [2];
      }
    });
  });
}
function mc(n, e) {
  var t = {}, r = function(s) {
    if (n.hasOwnProperty(s)) {
      var o = n[s];
      if (typeof o != "object" || Array.isArray(o)) e.includes(s) || (t[s] = o);
      else {
        var a = mc(o, e.map(function(c) {
          return c.startsWith(s + ".") ? c.slice(s.length + 1) : c;
        }));
        Object.keys(a).length > 0 && (t[s] = a);
      }
    }
  };
  for (var i in n) r(i);
  return t;
}
function xy(n) {
  return ht(this, void 0, void 0, function() {
    var e, t;
    return dt(this, function(r) {
      switch (r.label) {
        case 0:
          return r.trys.push([0, 2, , 3]), [4, yc()];
        case 1:
          return e = r.sent(), t = Rs(JSON.stringify(e)), [2, t.toString()];
        case 2:
          throw r.sent();
        case 3:
          return [2];
      }
    });
  });
}
function Ty(n) {
  for (var e = 0, t = 0; t < n.length; ++t) e += Math.abs(n[t]);
  return e;
}
function gc(n, e, t) {
  for (var r = [], i = 0; i < n[0].data.length; i++) {
    for (var s = [], o = 0; o < n.length; o++) s.push(n[o].data[i]);
    r.push(Iy(s));
  }
  var a = new Uint8ClampedArray(r);
  return new ImageData(a, e, t);
}
function Iy(n) {
  if (n.length === 0) return 0;
  for (var e = {}, t = 0, r = n; t < r.length; t++)
    e[s = r[t]] = (e[s] || 0) + 1;
  var i = n[0];
  for (var s in e) e[s] > e[i] && (i = parseInt(s, 10));
  return i;
}
function rr() {
  if (typeof navigator > "u") return { name: "unknown", version: "unknown" };
  for (var n = navigator.userAgent, e = { Edg: "Edge", OPR: "Opera" }, t = 0, r = [/(?<name>Edge|Edg)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>(?:Chrome|Chromium|OPR|Opera|Vivaldi|Brave))\/(?<version>\d+(?:\.\d+)?)/, /(?<name>(?:Firefox|Waterfox|Iceweasel|IceCat))\/(?<version>\d+(?:\.\d+)?)/, /(?<name>Safari)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>MSIE|Trident|IEMobile).+?(?<version>\d+(?:\.\d+)?)/, /(?<name>[A-Za-z]+)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>SamsungBrowser)\/(?<version>\d+(?:\.\d+)?)/]; t < r.length; t++) {
    var i = r[t], s = n.match(i);
    if (s && s.groups) return { name: e[s.groups.name] || s.groups.name, version: s.groups.version };
  }
  return { name: "unknown", version: "unknown" };
}
Je("audio", function() {
  return ht(this, void 0, void 0, function() {
    return dt(this, function(n) {
      return [2, new Promise(function(e, t) {
        try {
          var r = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 5e3, 44100), i = r.createBufferSource(), s = r.createOscillator();
          s.frequency.value = 1e3;
          var o, a = r.createDynamicsCompressor();
          a.threshold.value = -50, a.knee.value = 40, a.ratio.value = 12, a.attack.value = 0, a.release.value = 0.2, s.connect(a), a.connect(r.destination), s.start(), r.oncomplete = function(c) {
            o = c.renderedBuffer.getChannelData(0), e({ sampleHash: Ty(o), oscillator: s.type, maxChannels: r.destination.maxChannelCount, channelCountMode: i.channelCountMode });
          }, r.startRendering();
        } catch (c) {
          console.error("Error creating audio fingerprint:", c), t(c);
        }
      })];
    });
  });
});
var Ay = rr().name !== "SamsungBrowser" ? 1 : 3, ga = 280, va = 20;
rr().name != "Firefox" && Je("canvas", function() {
  return document.createElement("canvas").getContext("2d"), new Promise(function(n) {
    var e = Array.from({ length: Ay }, function() {
      return function() {
        var t = document.createElement("canvas"), r = t.getContext("2d");
        if (!r) return new ImageData(1, 1);
        t.width = ga, t.height = va;
        var i = r.createLinearGradient(0, 0, t.width, t.height);
        i.addColorStop(0, "red"), i.addColorStop(0.16666666666666666, "orange"), i.addColorStop(0.3333333333333333, "yellow"), i.addColorStop(0.5, "green"), i.addColorStop(0.6666666666666666, "blue"), i.addColorStop(0.8333333333333334, "indigo"), i.addColorStop(1, "violet"), r.fillStyle = i, r.fillRect(0, 0, t.width, t.height);
        var s = "Random Text WMwmil10Oo";
        r.font = "23.123px Arial", r.fillStyle = "black", r.fillText(s, -5, 15), r.fillStyle = "rgba(0, 0, 255, 0.5)", r.fillText(s, -3.3, 17.7), r.beginPath(), r.moveTo(0, 0), r.lineTo(2 * t.width / 7, t.height), r.strokeStyle = "white", r.lineWidth = 2, r.stroke();
        var o = r.getImageData(0, 0, t.width, t.height);
        return o;
      }();
    });
    n({ commonImageDataHash: Rs(gc(e, ga, va).data.toString()).toString() });
  });
});
var Ai, Oy = ["Arial", "Arial Black", "Arial Narrow", "Arial Rounded MT", "Arimo", "Archivo", "Barlow", "Bebas Neue", "Bitter", "Bookman", "Calibri", "Cabin", "Candara", "Century", "Century Gothic", "Comic Sans MS", "Constantia", "Courier", "Courier New", "Crimson Text", "DM Mono", "DM Sans", "DM Serif Display", "DM Serif Text", "Dosis", "Droid Sans", "Exo", "Fira Code", "Fira Sans", "Franklin Gothic Medium", "Garamond", "Geneva", "Georgia", "Gill Sans", "Helvetica", "Impact", "Inconsolata", "Indie Flower", "Inter", "Josefin Sans", "Karla", "Lato", "Lexend", "Lucida Bright", "Lucida Console", "Lucida Sans Unicode", "Manrope", "Merriweather", "Merriweather Sans", "Montserrat", "Myriad", "Noto Sans", "Nunito", "Nunito Sans", "Open Sans", "Optima", "Orbitron", "Oswald", "Pacifico", "Palatino", "Perpetua", "PT Sans", "PT Serif", "Poppins", "Prompt", "Public Sans", "Quicksand", "Rajdhani", "Recursive", "Roboto", "Roboto Condensed", "Rockwell", "Rubik", "Segoe Print", "Segoe Script", "Segoe UI", "Sora", "Source Sans Pro", "Space Mono", "Tahoma", "Taviraj", "Times", "Times New Roman", "Titillium Web", "Trebuchet MS", "Ubuntu", "Varela Round", "Verdana", "Work Sans"], Cy = ["monospace", "sans-serif", "serif"];
function ba(n, e) {
  if (!n) throw new Error("Canvas context not supported");
  return n.font, n.font = "72px ".concat(e), n.measureText("WwMmLli0Oo").width;
}
function Ry() {
  var n, e = document.createElement("canvas"), t = (n = e.getContext("webgl")) !== null && n !== void 0 ? n : e.getContext("experimental-webgl");
  if (t && "getParameter" in t) try {
    var r = (t.getParameter(t.VENDOR) || "").toString(), i = (t.getParameter(t.RENDERER) || "").toString(), s = { vendor: r, renderer: i, version: (t.getParameter(t.VERSION) || "").toString(), shadingLanguageVersion: (t.getParameter(t.SHADING_LANGUAGE_VERSION) || "").toString() };
    if (!i.length || !r.length) {
      var o = t.getExtension("WEBGL_debug_renderer_info");
      if (o) {
        var a = (t.getParameter(o.UNMASKED_VENDOR_WEBGL) || "").toString(), c = (t.getParameter(o.UNMASKED_RENDERER_WEBGL) || "").toString();
        a && (s.vendorUnmasked = a), c && (s.rendererUnmasked = c);
      }
    }
    return s;
  } catch {
  }
  return "undefined";
}
function Ny() {
  var n = new Float32Array(1), e = new Uint8Array(n.buffer);
  return n[0] = 1 / 0, n[0] = n[0] - n[0], e[3];
}
function My(n, e) {
  var t = {};
  return e.forEach(function(r) {
    var i = function(s) {
      if (s.length === 0) return null;
      var o = {};
      s.forEach(function(l) {
        var u = String(l);
        o[u] = (o[u] || 0) + 1;
      });
      var a = s[0], c = 1;
      return Object.keys(o).forEach(function(l) {
        o[l] > c && (a = l, c = o[l]);
      }), a;
    }(n.map(function(s) {
      return r in s ? s[r] : void 0;
    }).filter(function(s) {
      return s !== void 0;
    }));
    i && (t[r] = i);
  }), t;
}
function Dy() {
  var n = [], e = { "prefers-contrast": ["high", "more", "low", "less", "forced", "no-preference"], "any-hover": ["hover", "none"], "any-pointer": ["none", "coarse", "fine"], pointer: ["none", "coarse", "fine"], hover: ["hover", "none"], update: ["fast", "slow"], "inverted-colors": ["inverted", "none"], "prefers-reduced-motion": ["reduce", "no-preference"], "prefers-reduced-transparency": ["reduce", "no-preference"], scripting: ["none", "initial-only", "enabled"], "forced-colors": ["active", "none"] };
  return Object.keys(e).forEach(function(t) {
    e[t].forEach(function(r) {
      matchMedia("(".concat(t, ": ").concat(r, ")")).matches && n.push("".concat(t, ": ").concat(r));
    });
  }), n;
}
function Fy() {
  if (window.location.protocol === "https:" && typeof window.ApplePaySession == "function") try {
    for (var n = window.ApplePaySession.supportsVersion, e = 15; e > 0; e--) if (n(e)) return e;
  } catch {
    return 0;
  }
  return 0;
}
rr().name != "Firefox" && Je("fonts", function() {
  var n = this;
  return new Promise(function(e, t) {
    try {
      (function(r) {
        var i;
        ht(this, void 0, void 0, function() {
          var s, o, a;
          return dt(this, function(c) {
            switch (c.label) {
              case 0:
                return document.body ? [3, 2] : [4, (l = 50, new Promise(function(p) {
                  return setTimeout(p, l, u);
                }))];
              case 1:
                return c.sent(), [3, 0];
              case 2:
                if ((s = document.createElement("iframe")).setAttribute("frameBorder", "0"), (o = s.style).setProperty("position", "fixed"), o.setProperty("display", "block", "important"), o.setProperty("visibility", "visible"), o.setProperty("border", "0"), o.setProperty("opacity", "0"), s.src = "about:blank", document.body.appendChild(s), !(a = s.contentDocument || ((i = s.contentWindow) === null || i === void 0 ? void 0 : i.document))) throw new Error("Iframe document is not accessible");
                return r({ iframe: a }), setTimeout(function() {
                  document.body.removeChild(s);
                }, 0), [2];
            }
            var l, u;
          });
        });
      })(function(r) {
        var i = r.iframe;
        return ht(n, void 0, void 0, function() {
          var s, o, a, c;
          return dt(this, function(l) {
            return s = i.createElement("canvas"), o = s.getContext("2d"), a = Cy.map(function(u) {
              return ba(o, u);
            }), c = {}, Oy.forEach(function(u) {
              var p = ba(o, u);
              a.includes(p) || (c[u] = p);
            }), e(c), [2];
          });
        });
      });
    } catch {
      t({ error: "unsupported" });
    }
  });
}), Je("hardware", function() {
  return new Promise(function(n, e) {
    var t = navigator.deviceMemory !== void 0 ? navigator.deviceMemory : 0, r = window.performance && window.performance.memory ? window.performance.memory : 0;
    n({ videocard: Ry(), architecture: Ny(), deviceMemory: t.toString() || "undefined", jsHeapSizeLimit: r.jsHeapSizeLimit || 0 });
  });
}), Je("locales", function() {
  return new Promise(function(n) {
    n({ languages: navigator.language, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  });
}), Je("permissions", function() {
  return ht(this, void 0, void 0, function() {
    var n;
    return dt(this, function(e) {
      return Ai = pt?.permissions_to_check || ["accelerometer", "accessibility", "accessibility-events", "ambient-light-sensor", "background-fetch", "background-sync", "bluetooth", "camera", "clipboard-read", "clipboard-write", "device-info", "display-capture", "gyroscope", "geolocation", "local-fonts", "magnetometer", "microphone", "midi", "nfc", "notifications", "payment-handler", "persistent-storage", "push", "speaker", "storage-access", "top-level-storage-access", "window-management", "query"], n = Array.from({ length: pt?.retries || 3 }, function() {
        return function() {
          return ht(this, void 0, void 0, function() {
            var t, r, i, s, o;
            return dt(this, function(a) {
              switch (a.label) {
                case 0:
                  t = {}, r = 0, i = Ai, a.label = 1;
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
        return My(t, Ai);
      })];
    });
  });
}), Je("plugins", function() {
  var n = [];
  if (navigator.plugins) for (var e = 0; e < navigator.plugins.length; e++) {
    var t = navigator.plugins[e];
    n.push([t.name, t.filename, t.description].join("|"));
  }
  return new Promise(function(r) {
    r({ plugins: n });
  });
}), Je("screen", function() {
  return new Promise(function(n) {
    n({ is_touchscreen: navigator.maxTouchPoints > 0, maxTouchPoints: navigator.maxTouchPoints, colorDepth: screen.colorDepth, mediaMatches: Dy() });
  });
}), Je("system", function() {
  return new Promise(function(n) {
    var e = rr();
    n({ platform: window.navigator.platform, cookieEnabled: window.navigator.cookieEnabled, productSub: navigator.productSub, product: navigator.product, useragent: navigator.userAgent, hardwareConcurrency: navigator.hardwareConcurrency, browser: { name: e.name, version: e.version }, applePayVersion: Fy() });
  });
});
var De, By = rr().name !== "SamsungBrowser" ? 1 : 3, U = null;
Je("webgl", function() {
  return ht(this, void 0, void 0, function() {
    var n;
    return dt(this, function(e) {
      typeof document < "u" && ((De = document.createElement("canvas")).width = 200, De.height = 100, U = De.getContext("webgl"));
      try {
        if (!U) throw new Error("WebGL not supported");
        return n = Array.from({ length: By }, function() {
          return function() {
            try {
              if (!U) throw new Error("WebGL not supported");
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
      `, i = U.createShader(U.VERTEX_SHADER), s = U.createShader(U.FRAGMENT_SHADER);
              if (!i || !s) throw new Error("Failed to create shaders");
              if (U.shaderSource(i, t), U.shaderSource(s, r), U.compileShader(i), !U.getShaderParameter(i, U.COMPILE_STATUS)) throw new Error("Vertex shader compilation failed: " + U.getShaderInfoLog(i));
              if (U.compileShader(s), !U.getShaderParameter(s, U.COMPILE_STATUS)) throw new Error("Fragment shader compilation failed: " + U.getShaderInfoLog(s));
              var o = U.createProgram();
              if (!o) throw new Error("Failed to create shader program");
              if (U.attachShader(o, i), U.attachShader(o, s), U.linkProgram(o), !U.getProgramParameter(o, U.LINK_STATUS)) throw new Error("Shader program linking failed: " + U.getProgramInfoLog(o));
              U.useProgram(o);
              for (var a = 137, c = new Float32Array(4 * a), l = 2 * Math.PI / a, u = 0; u < a; u++) {
                var p = u * l;
                c[4 * u] = 0, c[4 * u + 1] = 0, c[4 * u + 2] = Math.cos(p) * (De.width / 2), c[4 * u + 3] = Math.sin(p) * (De.height / 2);
              }
              var d = U.createBuffer();
              U.bindBuffer(U.ARRAY_BUFFER, d), U.bufferData(U.ARRAY_BUFFER, c, U.STATIC_DRAW);
              var y = U.getAttribLocation(o, "position");
              U.enableVertexAttribArray(y), U.vertexAttribPointer(y, 2, U.FLOAT, !1, 0, 0), U.viewport(0, 0, De.width, De.height), U.clearColor(0, 0, 0, 1), U.clear(U.COLOR_BUFFER_BIT), U.drawArrays(U.LINES, 0, 2 * a);
              var v = new Uint8ClampedArray(De.width * De.height * 4);
              return U.readPixels(0, 0, De.width, De.height, U.RGBA, U.UNSIGNED_BYTE, v), new ImageData(v, De.width, De.height);
            } catch {
              return new ImageData(1, 1);
            } finally {
              U && (U.bindBuffer(U.ARRAY_BUFFER, null), U.useProgram(null), U.viewport(0, 0, U.drawingBufferWidth, U.drawingBufferHeight), U.clearColor(0, 0, 0, 0));
            }
          }();
        }), [2, { commonImageHash: Rs(gc(n, De.width, De.height).data.toString()).toString() }];
      } catch {
        return [2, { webgl: "unsupported" }];
      }
      return [2];
    });
  });
});
var Bt = function(n, e, t, r) {
  for (var i = (t - e) / r, s = 0, o = 0; o < r; o++)
    s += n(e + (o + 0.5) * i);
  return s * i;
};
Je("math", function() {
  return ht(void 0, void 0, void 0, function() {
    return dt(this, function(n) {
      return [2, { acos: Math.acos(0.5), asin: Bt(Math.asin, -1, 1, 97), atan: Bt(Math.atan, -1, 1, 97), cos: Bt(Math.cos, 0, Math.PI, 97), cosh: Math.cosh(9 / 7), e: Math.E, largeCos: Math.cos(1e20), largeSin: Math.sin(1e20), largeTan: Math.tan(1e20), log: Math.log(1e3), pi: Math.PI, sin: Bt(Math.sin, -Math.PI, Math.PI, 97), sinh: Bt(Math.sinh, -9 / 7, 7 / 9, 97), sqrt: Math.sqrt(2), tan: Bt(Math.tan, 0, 2 * Math.PI, 97), tanh: Bt(Math.tanh, -9 / 7, 7 / 9, 97) }];
    });
  });
});
function vc(n) {
  return new We(function(e, t) {
    return new ee(function(r) {
      var i, s, o;
      try {
        i = t(e).subscribe({
          next: function(a) {
            if (a.errors ? o = n({
              graphQLErrors: a.errors,
              response: a,
              operation: e,
              forward: t
            }) : Lu(a) && (o = n({
              protocolErrors: a.extensions[Zr],
              response: a,
              operation: e,
              forward: t
            })), o) {
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
              //Network errors can return GraphQL errors on for example a 403
              graphQLErrors: a && a.result && a.result.errors || void 0,
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
  He(e, n);
  function e(t) {
    var r = n.call(this) || this;
    return r.link = vc(t), r;
  }
  return e.prototype.request = function(t, r) {
    return this.link.request(t, r);
  }, e;
})(We);
function Py(n) {
  return new We(function(e, t) {
    var r = it(e, []);
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
function $y(n) {
  return ce(n) && "code" in n && "reason" in n;
}
function Ly(n) {
  var e;
  return ce(n) && ((e = n.target) === null || e === void 0 ? void 0 : e.readyState) === WebSocket.CLOSED;
}
var Uy = (
  /** @class */
  function(n) {
    He(e, n);
    function e(t) {
      var r = n.call(this) || this;
      return r.client = t, r;
    }
    return e.prototype.request = function(t) {
      var r = this;
      return new ee(function(i) {
        return r.client.subscribe(x(x({}, t), { query: At(t.query) }), {
          next: i.next.bind(i),
          complete: i.complete.bind(i),
          error: function(s) {
            if (s instanceof Error)
              return i.error(s);
            var o = $y(s);
            return o || Ly(s) ? i.error(
              // reason will be available on clean closes
              new Error("Socket closed".concat(o ? " with event ".concat(s.code) : "").concat(o ? " ".concat(s.reason) : ""))
            ) : i.error(new xt({
              graphQLErrors: Array.isArray(s) ? s : [s]
            }));
          }
          // casting around a wrong type in graphql-ws, which incorrectly expects `Sink<ExecutionResult>`
        });
      });
    }, e;
  }(We)
);
function Be(n) {
  return n === null ? "null" : Array.isArray(n) ? "array" : typeof n;
}
function $t(n) {
  return Be(n) === "object";
}
function qy(n) {
  return Array.isArray(n) && // must be at least one error
  n.length > 0 && // error has at least a message
  n.every((e) => "message" in e);
}
function wa(n, e) {
  return n.length < 124 ? n : e;
}
const jy = "graphql-transport-ws";
var Le;
(function(n) {
  n[n.InternalServerError = 4500] = "InternalServerError", n[n.InternalClientError = 4005] = "InternalClientError", n[n.BadRequest = 4400] = "BadRequest", n[n.BadResponse = 4004] = "BadResponse", n[n.Unauthorized = 4401] = "Unauthorized", n[n.Forbidden = 4403] = "Forbidden", n[n.SubprotocolNotAcceptable = 4406] = "SubprotocolNotAcceptable", n[n.ConnectionInitialisationTimeout = 4408] = "ConnectionInitialisationTimeout", n[n.ConnectionAcknowledgementTimeout = 4504] = "ConnectionAcknowledgementTimeout", n[n.SubscriberAlreadyExists = 4409] = "SubscriberAlreadyExists", n[n.TooManyInitialisationRequests = 4429] = "TooManyInitialisationRequests";
})(Le || (Le = {}));
var ye;
(function(n) {
  n.ConnectionInit = "connection_init", n.ConnectionAck = "connection_ack", n.Ping = "ping", n.Pong = "pong", n.Subscribe = "subscribe", n.Next = "next", n.Error = "error", n.Complete = "complete";
})(ye || (ye = {}));
function bc(n) {
  if (!$t(n))
    throw new Error(`Message is expected to be an object, but got ${Be(n)}`);
  if (!n.type)
    throw new Error("Message is missing the 'type' property");
  if (typeof n.type != "string")
    throw new Error(`Message is expects the 'type' property to be a string, but got ${Be(n.type)}`);
  switch (n.type) {
    case ye.ConnectionInit:
    case ye.ConnectionAck:
    case ye.Ping:
    case ye.Pong: {
      if (n.payload != null && !$t(n.payload))
        throw new Error(`"${n.type}" message expects the 'payload' property to be an object or nullish or missing, but got "${n.payload}"`);
      break;
    }
    case ye.Subscribe: {
      if (typeof n.id != "string")
        throw new Error(`"${n.type}" message expects the 'id' property to be a string, but got ${Be(n.id)}`);
      if (!n.id)
        throw new Error(`"${n.type}" message requires a non-empty 'id' property`);
      if (!$t(n.payload))
        throw new Error(`"${n.type}" message expects the 'payload' property to be an object, but got ${Be(n.payload)}`);
      if (typeof n.payload.query != "string")
        throw new Error(`"${n.type}" message payload expects the 'query' property to be a string, but got ${Be(n.payload.query)}`);
      if (n.payload.variables != null && !$t(n.payload.variables))
        throw new Error(`"${n.type}" message payload expects the 'variables' property to be a an object or nullish or missing, but got ${Be(n.payload.variables)}`);
      if (n.payload.operationName != null && Be(n.payload.operationName) !== "string")
        throw new Error(`"${n.type}" message payload expects the 'operationName' property to be a string or nullish or missing, but got ${Be(n.payload.operationName)}`);
      if (n.payload.extensions != null && !$t(n.payload.extensions))
        throw new Error(`"${n.type}" message payload expects the 'extensions' property to be a an object or nullish or missing, but got ${Be(n.payload.extensions)}`);
      break;
    }
    case ye.Next: {
      if (typeof n.id != "string")
        throw new Error(`"${n.type}" message expects the 'id' property to be a string, but got ${Be(n.id)}`);
      if (!n.id)
        throw new Error(`"${n.type}" message requires a non-empty 'id' property`);
      if (!$t(n.payload))
        throw new Error(`"${n.type}" message expects the 'payload' property to be an object, but got ${Be(n.payload)}`);
      break;
    }
    case ye.Error: {
      if (typeof n.id != "string")
        throw new Error(`"${n.type}" message expects the 'id' property to be a string, but got ${Be(n.id)}`);
      if (!n.id)
        throw new Error(`"${n.type}" message requires a non-empty 'id' property`);
      if (!qy(n.payload))
        throw new Error(`"${n.type}" message expects the 'payload' property to be an array of GraphQL errors, but got ${JSON.stringify(n.payload)}`);
      break;
    }
    case ye.Complete: {
      if (typeof n.id != "string")
        throw new Error(`"${n.type}" message expects the 'id' property to be a string, but got ${Be(n.id)}`);
      if (!n.id)
        throw new Error(`"${n.type}" message requires a non-empty 'id' property`);
      break;
    }
    default:
      throw new Error(`Invalid message 'type' property "${n.type}"`);
  }
  return n;
}
function Vy(n, e) {
  return bc(typeof n == "string" ? JSON.parse(n, e) : n);
}
function Bn(n, e) {
  return bc(n), JSON.stringify(n, e);
}
var ln = function(n) {
  return this instanceof ln ? (this.v = n, this) : new ln(n);
}, Qy = function(n, e, t) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = t.apply(n, e || []), i, s = [];
  return i = Object.create((typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype), a("next"), a("throw"), a("return", o), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function o(y) {
    return function(v) {
      return Promise.resolve(v).then(y, p);
    };
  }
  function a(y, v) {
    r[y] && (i[y] = function(E) {
      return new Promise(function(w, b) {
        s.push([y, E, w, b]) > 1 || c(y, E);
      });
    }, v && (i[y] = v(i[y])));
  }
  function c(y, v) {
    try {
      l(r[y](v));
    } catch (E) {
      d(s[0][3], E);
    }
  }
  function l(y) {
    y.value instanceof ln ? Promise.resolve(y.value.v).then(u, p) : d(s[0][2], y);
  }
  function u(y) {
    c("next", y);
  }
  function p(y) {
    c("throw", y);
  }
  function d(y, v) {
    y(v), s.shift(), s.length && c(s[0][0], s[0][1]);
  }
};
function Hy(n) {
  const {
    url: e,
    connectionParams: t,
    lazy: r = !0,
    onNonLazyError: i = console.error,
    lazyCloseTimeout: s = 0,
    keepAlive: o = 0,
    disablePong: a,
    connectionAckWaitTimeout: c = 0,
    retryAttempts: l = 5,
    retryWait: u = async function(Z) {
      let q = 1e3;
      for (let H = 0; H < Z; H++)
        q *= 2;
      await new Promise((H) => setTimeout(H, q + // add random timeout from 300ms to 3s
      Math.floor(Math.random() * 2700 + 300)));
    },
    shouldRetry: p = Oi,
    isFatalConnectionProblem: d,
    on: y,
    webSocketImpl: v,
    /**
     * Generates a v4 UUID to be used as the ID using `Math`
     * as the random number generator. Supply your own generator
     * in case you need more uniqueness.
     *
     * Reference: https://gist.github.com/jed/982883
     */
    generateID: E = function() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (Z) => {
        const q = Math.random() * 16 | 0;
        return (Z == "x" ? q : q & 3 | 8).toString(16);
      });
    },
    jsonMessageReplacer: w,
    jsonMessageReviver: b
  } = n;
  let k;
  if (v) {
    if (!zy(v))
      throw new Error("Invalid WebSocket implementation provided");
    k = v;
  } else typeof WebSocket < "u" ? k = WebSocket : typeof rt < "u" ? k = rt.WebSocket || // @ts-expect-error: Support more browsers
  rt.MozWebSocket : typeof window < "u" && (k = window.WebSocket || // @ts-expect-error: Support more browsers
  window.MozWebSocket);
  if (!k)
    throw new Error("WebSocket implementation missing; on Node you can `import WebSocket from 'ws';` and pass `webSocketImpl: WebSocket` to `createClient`");
  const S = k, I = (() => {
    const j = /* @__PURE__ */ (() => {
      const q = {};
      return {
        on(H, Q) {
          return q[H] = Q, () => {
            delete q[H];
          };
        },
        emit(H) {
          var Q;
          "id" in H && ((Q = q[H.id]) === null || Q === void 0 || Q.call(q, H));
        }
      };
    })(), Z = {
      connecting: y?.connecting ? [y.connecting] : [],
      opened: y?.opened ? [y.opened] : [],
      connected: y?.connected ? [y.connected] : [],
      ping: y?.ping ? [y.ping] : [],
      pong: y?.pong ? [y.pong] : [],
      message: y?.message ? [j.emit, y.message] : [j.emit],
      closed: y?.closed ? [y.closed] : [],
      error: y?.error ? [y.error] : []
    };
    return {
      onMessage: j.on,
      on(q, H) {
        const Q = Z[q];
        return Q.push(H), () => {
          Q.splice(Q.indexOf(H), 1);
        };
      },
      emit(q, ...H) {
        for (const Q of [...Z[q]])
          Q(...H);
      }
    };
  })();
  function O(j) {
    const Z = [
      // errors are fatal and more critical than close events, throw them first
      I.on("error", (q) => {
        Z.forEach((H) => H()), j(q);
      }),
      // closes can be graceful and not fatal, throw them second (if error didnt throw)
      I.on("closed", (q) => {
        Z.forEach((H) => H()), j(q);
      })
    ];
  }
  let C, M = 0, F, L = !1, V = 0, G = !1;
  async function Ee() {
    clearTimeout(F);
    const [j, Z] = await (C ?? (C = new Promise((Q, Se) => (async () => {
      if (L) {
        if (await u(V), !M)
          return C = void 0, Se({ code: 1e3, reason: "All Subscriptions Gone" });
        V++;
      }
      I.emit("connecting", L);
      const J = new S(typeof e == "function" ? await e() : e, jy);
      let Te, ze;
      function se() {
        isFinite(o) && o > 0 && (clearTimeout(ze), ze = setTimeout(() => {
          J.readyState === S.OPEN && (J.send(Bn({ type: ye.Ping })), I.emit("ping", !1, void 0));
        }, o));
      }
      O((ve) => {
        C = void 0, clearTimeout(Te), clearTimeout(ze), Se(ve), ve instanceof Ea && (J.close(4499, "Terminated"), J.onerror = null, J.onclose = null);
      }), J.onerror = (ve) => I.emit("error", ve), J.onclose = (ve) => I.emit("closed", ve), J.onopen = async () => {
        try {
          I.emit("opened", J);
          const ve = typeof t == "function" ? await t() : t;
          if (J.readyState !== S.OPEN)
            return;
          J.send(Bn(ve ? {
            type: ye.ConnectionInit,
            payload: ve
          } : {
            type: ye.ConnectionInit
            // payload is completely absent if not provided
          }, w)), isFinite(c) && c > 0 && (Te = setTimeout(() => {
            J.close(Le.ConnectionAcknowledgementTimeout, "Connection acknowledgement timeout");
          }, c)), se();
        } catch (ve) {
          I.emit("error", ve), J.close(Le.InternalClientError, wa(ve instanceof Error ? ve.message : new Error(ve).message, "Internal client error"));
        }
      };
      let pe = !1;
      J.onmessage = ({ data: ve }) => {
        try {
          const me = Vy(ve, b);
          if (I.emit("message", me), me.type === "ping" || me.type === "pong") {
            I.emit(me.type, !0, me.payload), me.type === "pong" ? se() : a || (J.send(Bn(me.payload ? {
              type: ye.Pong,
              payload: me.payload
            } : {
              type: ye.Pong
              // payload is completely absent if not provided
            })), I.emit("pong", !1, me.payload));
            return;
          }
          if (pe)
            return;
          if (me.type !== ye.ConnectionAck)
            throw new Error(`First message cannot be of type ${me.type}`);
          clearTimeout(Te), pe = !0, I.emit("connected", J, me.payload, L), L = !1, V = 0, Q([
            J,
            new Promise((ri, ur) => O(ur))
          ]);
        } catch (me) {
          J.onmessage = null, I.emit("error", me), J.close(Le.BadResponse, wa(me instanceof Error ? me.message : new Error(me).message, "Bad response"));
        }
      };
    })())));
    j.readyState === S.CLOSING && await Z;
    let q = () => {
    };
    const H = new Promise((Q) => q = Q);
    return [
      j,
      q,
      Promise.race([
        // wait for
        H.then(() => {
          if (!M) {
            const Q = () => j.close(1e3, "Normal Closure");
            isFinite(s) && s > 0 ? F = setTimeout(() => {
              j.readyState === S.OPEN && Q();
            }, s) : Q();
          }
        }),
        // or
        Z
      ])
    ];
  }
  function ie(j) {
    if (Oi(j) && (Wy(j.code) || [
      Le.InternalServerError,
      Le.InternalClientError,
      Le.BadRequest,
      Le.BadResponse,
      Le.Unauthorized,
      // CloseCode.Forbidden, might grant access out after retry
      Le.SubprotocolNotAcceptable,
      // CloseCode.ConnectionInitialisationTimeout, might not time out after retry
      // CloseCode.ConnectionAcknowledgementTimeout, might not time out after retry
      Le.SubscriberAlreadyExists,
      Le.TooManyInitialisationRequests
      // 4499, // Terminated, probably because the socket froze, we want to retry
    ].includes(j.code)))
      throw j;
    if (G)
      return !1;
    if (Oi(j) && j.code === 1e3)
      return M > 0;
    if (!l || V >= l || !p(j) || d?.(j))
      throw j;
    return L = !0;
  }
  r || (async () => {
    for (M++; ; )
      try {
        const [, , j] = await Ee();
        await j;
      } catch (j) {
        try {
          if (!ie(j))
            return;
        } catch (Z) {
          return i?.(Z);
        }
      }
  })();
  function _e(j, Z) {
    const q = E(j);
    let H = !1, Q = !1, Se = () => {
      M--, H = !0;
    };
    return (async () => {
      for (M++; ; )
        try {
          const [J, Te, ze] = await Ee();
          if (H)
            return Te();
          const se = I.onMessage(q, (pe) => {
            switch (pe.type) {
              case ye.Next: {
                Z.next(pe.payload);
                return;
              }
              case ye.Error: {
                Q = !0, H = !0, Z.error(pe.payload), Se();
                return;
              }
              case ye.Complete: {
                H = !0, Se();
                return;
              }
            }
          });
          J.send(Bn({
            id: q,
            type: ye.Subscribe,
            payload: j
          }, w)), Se = () => {
            !H && J.readyState === S.OPEN && J.send(Bn({
              id: q,
              type: ye.Complete
            }, w)), M--, H = !0, Te();
          }, await ze.finally(se);
          return;
        } catch (J) {
          if (!ie(J))
            return;
        }
    })().then(() => {
      Q || Z.complete();
    }).catch((J) => {
      Z.error(J);
    }), () => {
      H || Se();
    };
  }
  return {
    on: I.on,
    subscribe: _e,
    iterate(j) {
      const Z = [], q = {
        done: !1,
        error: null,
        resolve: () => {
        }
      }, H = _e(j, {
        next(Se) {
          Z.push(Se), q.resolve();
        },
        error(Se) {
          q.done = !0, q.error = Se, q.resolve();
        },
        complete() {
          q.done = !0, q.resolve();
        }
      }), Q = function() {
        return Qy(this, arguments, function* () {
          for (; ; ) {
            for (Z.length || (yield ln(new Promise((Te) => q.resolve = Te))); Z.length; )
              yield yield ln(Z.shift());
            if (q.error)
              throw q.error;
            if (q.done)
              return yield ln(void 0);
          }
        });
      }();
      return Q.throw = async (Se) => (q.done || (q.done = !0, q.error = Se, q.resolve()), { done: !0, value: void 0 }), Q.return = async () => (H(), { done: !0, value: void 0 }), Q;
    },
    async dispose() {
      if (G = !0, C) {
        const [j] = await C;
        j.close(1e3, "Normal Closure");
      }
    },
    terminate() {
      C && I.emit("closed", new Ea());
    }
  };
}
class Ea extends Error {
  constructor() {
    super(...arguments), this.name = "TerminatedCloseEvent", this.message = "4499: Terminated", this.code = 4499, this.reason = "Terminated", this.wasClean = !1;
  }
}
function Oi(n) {
  return $t(n) && "code" in n && "reason" in n;
}
function Wy(n) {
  return [
    1e3,
    // Normal Closure is not an erroneous close code
    1001,
    // Going Away
    1006,
    // Abnormal Closure
    1005,
    // No Status Received
    1012,
    // Service Restart
    1013,
    // Try Again Later
    1014
    // Bad Gateway
  ].includes(n) ? !1 : n >= 1e3 && n <= 1999;
}
function zy(n) {
  return typeof n == "function" && "constructor" in n && "CLOSED" in n && "CLOSING" in n && "CONNECTING" in n && "OPEN" in n;
}
function Ky(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Ce = typeof globalThis < "u" && globalThis || typeof self < "u" && self || typeof Ce < "u" && Ce, Pe = {
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
function Gy(n) {
  return n && DataView.prototype.isPrototypeOf(n);
}
if (Pe.arrayBuffer)
  var Jy = [
    "[object Int8Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Int16Array]",
    "[object Uint16Array]",
    "[object Int32Array]",
    "[object Uint32Array]",
    "[object Float32Array]",
    "[object Float64Array]"
  ], Yy = ArrayBuffer.isView || function(n) {
    return n && Jy.indexOf(Object.prototype.toString.call(n)) > -1;
  };
function ar(n) {
  if (typeof n != "string" && (n = String(n)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(n) || n === "")
    throw new TypeError('Invalid character in header field name: "' + n + '"');
  return n.toLowerCase();
}
function Ns(n) {
  return typeof n != "string" && (n = String(n)), n;
}
function Ms(n) {
  var e = {
    next: function() {
      var t = n.shift();
      return { done: t === void 0, value: t };
    }
  };
  return Pe.iterable && (e[Symbol.iterator] = function() {
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
  n = ar(n), e = Ns(e);
  var t = this.map[n];
  this.map[n] = t ? t + ", " + e : e;
};
we.prototype.delete = function(n) {
  delete this.map[ar(n)];
};
we.prototype.get = function(n) {
  return n = ar(n), this.has(n) ? this.map[n] : null;
};
we.prototype.has = function(n) {
  return this.map.hasOwnProperty(ar(n));
};
we.prototype.set = function(n, e) {
  this.map[ar(n)] = Ns(e);
};
we.prototype.forEach = function(n, e) {
  for (var t in this.map)
    this.map.hasOwnProperty(t) && n.call(e, this.map[t], t, this);
};
we.prototype.keys = function() {
  var n = [];
  return this.forEach(function(e, t) {
    n.push(t);
  }), Ms(n);
};
we.prototype.values = function() {
  var n = [];
  return this.forEach(function(e) {
    n.push(e);
  }), Ms(n);
};
we.prototype.entries = function() {
  var n = [];
  return this.forEach(function(e, t) {
    n.push([t, e]);
  }), Ms(n);
};
Pe.iterable && (we.prototype[Symbol.iterator] = we.prototype.entries);
function Ci(n) {
  if (n.bodyUsed)
    return Promise.reject(new TypeError("Already read"));
  n.bodyUsed = !0;
}
function wc(n) {
  return new Promise(function(e, t) {
    n.onload = function() {
      e(n.result);
    }, n.onerror = function() {
      t(n.error);
    };
  });
}
function Xy(n) {
  var e = new FileReader(), t = wc(e);
  return e.readAsArrayBuffer(n), t;
}
function Zy(n) {
  var e = new FileReader(), t = wc(e);
  return e.readAsText(n), t;
}
function em(n) {
  for (var e = new Uint8Array(n), t = new Array(e.length), r = 0; r < e.length; r++)
    t[r] = String.fromCharCode(e[r]);
  return t.join("");
}
function _a(n) {
  if (n.slice)
    return n.slice(0);
  var e = new Uint8Array(n.byteLength);
  return e.set(new Uint8Array(n)), e.buffer;
}
function Ec() {
  return this.bodyUsed = !1, this._initBody = function(n) {
    this.bodyUsed = this.bodyUsed, this._bodyInit = n, n ? typeof n == "string" ? this._bodyText = n : Pe.blob && Blob.prototype.isPrototypeOf(n) ? this._bodyBlob = n : Pe.formData && FormData.prototype.isPrototypeOf(n) ? this._bodyFormData = n : Pe.searchParams && URLSearchParams.prototype.isPrototypeOf(n) ? this._bodyText = n.toString() : Pe.arrayBuffer && Pe.blob && Gy(n) ? (this._bodyArrayBuffer = _a(n.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : Pe.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(n) || Yy(n)) ? this._bodyArrayBuffer = _a(n) : this._bodyText = n = Object.prototype.toString.call(n) : this._bodyText = "", this.headers.get("content-type") || (typeof n == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : Pe.searchParams && URLSearchParams.prototype.isPrototypeOf(n) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
  }, Pe.blob && (this.blob = function() {
    var n = Ci(this);
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
      var n = Ci(this);
      return n || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
        this._bodyArrayBuffer.buffer.slice(
          this._bodyArrayBuffer.byteOffset,
          this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
        )
      ) : Promise.resolve(this._bodyArrayBuffer));
    } else
      return this.blob().then(Xy);
  }), this.text = function() {
    var n = Ci(this);
    if (n)
      return n;
    if (this._bodyBlob)
      return Zy(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(em(this._bodyArrayBuffer));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as text");
    return Promise.resolve(this._bodyText);
  }, Pe.formData && (this.formData = function() {
    return this.text().then(rm);
  }), this.json = function() {
    return this.text().then(JSON.parse);
  }, this;
}
var tm = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
function nm(n) {
  var e = n.toUpperCase();
  return tm.indexOf(e) > -1 ? e : n;
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
  if (this.credentials = e.credentials || this.credentials || "same-origin", (e.headers || !this.headers) && (this.headers = new we(e.headers)), this.method = nm(e.method || this.method || "GET"), this.mode = e.mode || this.mode || null, this.signal = e.signal || this.signal, this.referrer = null, (this.method === "GET" || this.method === "HEAD") && t)
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
function rm(n) {
  var e = new FormData();
  return n.trim().split("&").forEach(function(t) {
    if (t) {
      var r = t.split("="), i = r.shift().replace(/\+/g, " "), s = r.join("=").replace(/\+/g, " ");
      e.append(decodeURIComponent(i), decodeURIComponent(s));
    }
  }), e;
}
function im(n) {
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
Ec.call(Ht.prototype);
function ot(n, e) {
  if (!(this instanceof ot))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  e || (e = {}), this.type = "default", this.status = e.status === void 0 ? 200 : e.status, this.ok = this.status >= 200 && this.status < 300, this.statusText = e.statusText === void 0 ? "" : "" + e.statusText, this.headers = new we(e.headers), this.url = e.url || "", this._initBody(n);
}
Ec.call(ot.prototype);
ot.prototype.clone = function() {
  return new ot(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new we(this.headers),
    url: this.url
  });
};
ot.error = function() {
  var n = new ot(null, { status: 0, statusText: "" });
  return n.type = "error", n;
};
var sm = [301, 302, 303, 307, 308];
ot.redirect = function(n, e) {
  if (sm.indexOf(e) === -1)
    throw new RangeError("Invalid status code");
  return new ot(null, { status: e, headers: { location: n } });
};
var Ut = Ce.DOMException;
try {
  new Ut();
} catch {
  Ut = function(e, t) {
    this.message = e, this.name = t;
    var r = Error(e);
    this.stack = r.stack;
  }, Ut.prototype = Object.create(Error.prototype), Ut.prototype.constructor = Ut;
}
function _c(n, e) {
  return new Promise(function(t, r) {
    var i = new Ht(n, e);
    if (i.signal && i.signal.aborted)
      return r(new Ut("Aborted", "AbortError"));
    var s = new XMLHttpRequest();
    function o() {
      s.abort();
    }
    s.onload = function() {
      var c = {
        status: s.status,
        statusText: s.statusText,
        headers: im(s.getAllResponseHeaders() || "")
      };
      c.url = "responseURL" in s ? s.responseURL : c.headers.get("X-Request-URL");
      var l = "response" in s ? s.response : s.responseText;
      setTimeout(function() {
        t(new ot(l, c));
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
        r(new Ut("Aborted", "AbortError"));
      }, 0);
    };
    function a(c) {
      try {
        return c === "" && Ce.location.href ? Ce.location.href : c;
      } catch {
        return c;
      }
    }
    s.open(i.method, a(i.url), !0), i.credentials === "include" ? s.withCredentials = !0 : i.credentials === "omit" && (s.withCredentials = !1), "responseType" in s && (Pe.blob ? s.responseType = "blob" : Pe.arrayBuffer && i.headers.get("Content-Type") && i.headers.get("Content-Type").indexOf("application/octet-stream") !== -1 && (s.responseType = "arraybuffer")), e && typeof e.headers == "object" && !(e.headers instanceof we) ? Object.getOwnPropertyNames(e.headers).forEach(function(c) {
      s.setRequestHeader(c, Ns(e.headers[c]));
    }) : i.headers.forEach(function(c, l) {
      s.setRequestHeader(l, c);
    }), i.signal && (i.signal.addEventListener("abort", o), s.onreadystatechange = function() {
      s.readyState === 4 && i.signal.removeEventListener("abort", o);
    }), s.send(typeof i._bodyInit > "u" ? null : i._bodyInit);
  });
}
_c.polyfill = !0;
Ce.fetch || (Ce.fetch = _c, Ce.Headers = we, Ce.Request = Ht, Ce.Response = ot);
var om = self.fetch.bind(self);
const am = /* @__PURE__ */ Ky(om);
function um({
  graphQLErrors: n,
  networkError: e,
  operation: t,
  forward: r,
  response: i
}) {
  if (n && n.forEach(
    ({ message: s, debugMessage: o, locations: a, path: c }) => console.error(
      `[GraphQL error]: ${s}`,
      `
  Message : ${o}`,
      `
  Path    : ${c}`,
      `
  Location: ${JSON.stringify(a)}`
    )
  ), e) {
    const { name: s, statusCode: o, result: a = {} } = e;
    console.error(`[Network error]: ${s}, status code: ${o}`);
  }
}
function cm(n) {
  return n.query.definitions.find(
    (r) => r.kind === "OperationDefinition"
  ).selectionSet.selections.find(
    (r) => r.kind === "Field"
  ).name.value;
}
function lm(n) {
  return n.query.definitions.find(
    (t) => t.kind === "OperationDefinition"
  ).operation;
}
class fm extends We {
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
    const r = cm(e), i = lm(e), s = i === "mutation" && r === "ProposeMolecule";
    if ([
      i === "query" && ["__schema", "ContinuId"].includes(r),
      i === "mutation" && r === "AccessToken",
      s && he.get(e, "variables.molecule.atoms.0.isotope") === "U"
    ].some((u) => u))
      return t(e);
    const a = this.getWallet(), c = this.getPubKey();
    if (!c)
      throw new Qe("CipherLink::request() - Node public key missing!");
    if (!a)
      throw new Qe("CipherLink::request() - Authorized wallet missing!");
    const l = {
      query: ou(e.query),
      variables: JSON.stringify(e.variables)
    };
    return e.operationName = null, e.query = ae`query ($Hash: String!) { CipherHash(Hash: $Hash) { hash } }`, e.variables = { Hash: JSON.stringify(a.encryptMessage(l, c)) }, t(e).map((u) => {
      let p = u.data;
      if (p.data && (p = p.data), p.CipherHash && p.CipherHash.hash) {
        const d = JSON.parse(p.CipherHash.hash), y = a.decryptMessage(d);
        if (y === null)
          throw new Qe("CipherLink::request() - Unable to decrypt response!");
        return y;
      }
      return u;
    });
  }
}
class br extends fc {
  /**
   * @param {Object} config - Configuration object
   * @param {string} config.serverUri - URI of the GraphQL server
   * @param {Object|null} config.soketi - WebSocket configuration (optional)
   * @param {boolean} config.encrypt - Whether to use encryption (default: false)
   */
  constructor({ serverUri: e, soketi: t = null, encrypt: r = !1 }) {
    const i = ju({
      uri: e,
      fetch: am
    }), s = "", o = Py((p, { headers: d }) => ({
      headers: {
        ...d,
        "X-Auth-Token": s
      }
    })), a = vc(um);
    let c = Bo([o, a, i]), l;
    r && (l = new fm(), c = Bo([l, c]));
    let u;
    t && t.socketUri && (u = new Uy(Hy({
      url: t.socketUri,
      connectionParams: () => ({
        authToken: s
      })
    })), c = bd(
      ({ query: p }) => {
        const d = En(p);
        return d.kind === "OperationDefinition" && d.operation === "subscription";
      },
      u,
      c
    )), super({
      link: c,
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
    }), this.serverUri = e, this.soketi = t, this.authToken = s, this.pubkey = null, this.wallet = null, this.cipherLink = l, this.wsLink = u;
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
class hm {
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
class dm {
  /**
   * @param {Object} config - Configuration object
   * @param {string} config.serverUri - URI of the GraphQL server
   * @param {Object|null} config.socket - WebSocket configuration (optional)
   * @param {boolean} config.encrypt - Whether to use encryption (default: false)
   */
  constructor({ serverUri: e, socket: t = null, encrypt: r = !1 }) {
    this.$__client = new br({ serverUri: e, soketi: t, encrypt: r }), this.$__subscriptionManager = new hm(this.$__client);
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
    this.$__client = new br(t), this.$__subscriptionManager.setClient(this.$__client);
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
    this.$__client = new br(t), this.$__subscriptionManager.setClient(this.$__client);
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
    this.$__client = new br(r), this.$__subscriptionManager.setClient(this.$__client);
  }
}
class km {
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
    this.reset(), this.$__logging = o, this.$__authTokenObjects = {}, this.$__authInProcess = !1, this.abortControllers = /* @__PURE__ */ new Map(), this.setUri(e), t && this.setCellSlug(t);
    for (const a in this.$__uris) {
      const c = this.$__uris[a];
      this.$__authTokenObjects[c] = null;
    }
    this.log("info", `KnishIOClient::initialize() - Initializing new Knish.IO client session for SDK version ${s}...`), this.$__client = i || new dm({
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
      throw new Qe("KnishIOClient::subscribe() - Socket client not initialized!");
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
   * @deprecated Please use getCellSlug() instead
   * @return {string|null}
   */
  cellSlug() {
    return this.getCellSlug();
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
   * @param cellSlug
   */
  setCellSlug(e) {
    this.$__cellSlug = e;
  }
  setUri(e) {
    this.$__uris = typeof e == "object" ? e : [e];
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
   * Retrieves the endpoint URI for this session
   *
   * @deprecated Please use getUri() instead
   * @returns {string}
   */
  uri() {
    return this.getUri();
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
    return this.log("info", `KnishIOClient::hashSecret(${t ? `source: ${t}` : ""}) - Computing wallet bundle from secret...`), fn(e);
  }
  /**
   * Retrieves the stored secret for this session
   *
   * @return {string}
   */
  getSecret() {
    if (!this.hasSecret())
      throw new Mi("KnishIOClient::getSecret() - Unable to find a stored secret! Have you set a secret?");
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
      throw new Mi("KnishIOClient::getBundle() - Unable to find a stored bundle! Have you set a secret?");
    return this.$__bundle;
  }
  /**
   * Retrieves the device fingerprint.
   *
   * @returns {Promise<string>} A promise that resolves to the device fingerprint as a string.
   */
  getFingerprint() {
    return xy();
  }
  getFingerprintData() {
    return yc();
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
    return e ? e.key = Y.generateKey({
      secret: this.getSecret(),
      token: e.token,
      position: e.position
    }) : e = new Y({
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
    return this.log("info", "KnishIOClient::createMolecule() - Creating a new molecule..."), e = e || this.getSecret(), t = t || this.getBundle(), !r && this.lastMoleculeQuery && this.getRemainderWallet().token === "USER" && this.lastMoleculeQuery.response() && this.lastMoleculeQuery.response().success() && (r = this.getRemainderWallet()), r === null && (r = await this.getSourceWallet()), this.remainderWallet = i || Y.create({
      secret: e,
      bundle: t,
      token: "USER",
      batchId: r.batchId,
      characters: r.characters
    }), new ft({
      secret: e,
      sourceWallet: r,
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
    const r = t || await this.createMolecule({}), i = new e(this.client(), this, r);
    if (!(i instanceof Re))
      throw new Qe(`${this.constructor.name}::createMoleculeMutation() - This method only accepts MutationProposeMolecule!`);
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
    const r = new AbortController(), i = JSON.stringify({
      query: e.$__query,
      variables: t
    });
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
    const r = JSON.stringify({
      query: e.$__query,
      variables: t
    }), i = this.abortControllers.get(r);
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
    const i = this.createQuery(Dp);
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
    if (i === null || on.cmp(i.balance, t) < 0)
      throw new lt();
    if (!i.position || !i.address)
      throw new lt("Source wallet can not be a shadow wallet.");
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
    return await this.createSubscribe(ny).execute({
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
      throw new Qe(`${this.constructor.name}::subscribeWalletStatus() - Token parameter is required!`);
    return this.createSubscribe(ry).execute({
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
    return this.createSubscribe(iy).execute({
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
    return this.createSubscribe(sy).execute({
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
    queryArgs: c = null,
    count: l = null,
    countBy: u = null,
    throughAtom: p = !0,
    values: d = null,
    keys: y = null,
    atomValues: v = null
  }) {
    this.log("info", `KnishIOClient::queryMeta() - Querying metaType: ${e}, metaId: ${t}...`);
    let E, w;
    return p ? (E = this.createQuery(ma), w = ma.createVariables({
      metaType: e,
      metaId: t,
      key: r,
      value: i,
      latest: s,
      filter: a,
      queryArgs: c,
      countBy: u,
      values: d,
      keys: y,
      atomValues: v
    })) : (E = this.createQuery(ha), w = ha.createVariables({
      metaType: e,
      metaId: t,
      key: r,
      value: i,
      latest: s,
      filter: a,
      queryArgs: c,
      count: l,
      countBy: u
    })), this.executeQuery(E, w).then((b) => b.payload());
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
    const t = this.createQuery(nr);
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
    const t = this.createQuery(Bp);
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
    walletAddress: c,
    isotopes: l,
    isotope: u,
    tokenSlugs: p,
    tokenSlug: d,
    cellSlugs: y,
    cellSlug: v,
    batchIds: E,
    batchId: w,
    values: b,
    value: k,
    metaTypes: S,
    metaType: I,
    metaIds: O,
    metaId: C,
    indexes: M,
    index: F,
    filter: L,
    latest: V,
    queryArgs: G = {
      limit: 15,
      offset: 1
    }
  }) {
    this.log("info", "KnishIOClient::queryAtom() - Querying atom instances");
    const Ee = this.createQuery(ya);
    return await this.executeQuery(Ee, ya.createVariables({
      molecularHashes: e,
      molecularHash: t,
      bundleHashes: r,
      bundleHash: i,
      positions: s,
      position: o,
      walletAddresses: a,
      walletAddress: c,
      isotopes: l,
      isotope: u,
      tokenSlugs: p,
      tokenSlug: d,
      cellSlugs: y,
      cellSlug: v,
      batchIds: E,
      batchId: w,
      values: b,
      value: k,
      metaTypes: S,
      metaType: I,
      metaIds: O,
      metaId: C,
      indexes: M,
      index: F,
      filter: L,
      latest: V,
      queryArgs: G
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
    const t = new Y({
      secret: this.getSecret(),
      token: e
    }), r = await this.createMoleculeMutation({
      mutationClass: Xp
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
    const i = this.createQuery(cy);
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
    timeZone: c,
    countBy: l,
    interval: u
  }) {
    const p = this.createQuery(fy);
    return await this.executeQuery(p, {
      bundleHash: e,
      metaType: t,
      metaId: r,
      ipAddress: i,
      browser: s,
      osCpu: o,
      resolution: a,
      timeZone: c,
      countBy: l,
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
    timeZone: c,
    json: l = {}
  }) {
    const u = this.createQuery(ay);
    return await this.executeQuery(u, {
      bundleHash: e,
      metaType: t,
      metaId: r,
      ipAddress: i,
      browser: s,
      osCpu: o,
      resolution: a,
      timeZone: c,
      json: JSON.stringify(l)
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
    if (o === "stackable" && (r.batchId = i || Mr({})), ["nonfungible", "stackable"].includes(o) && s.length > 0) {
      if (he.get(r || {}, "decimals") > 0)
        throw new ty();
      if (t > 0)
        throw new gr();
      t = s.length, r.splittable = 1, r.decimals = 0, r.tokenUnits = JSON.stringify(s);
    }
    const a = new Y({
      secret: this.getSecret(),
      bundle: this.getBundle(),
      token: e,
      batchId: i
    }), c = await this.createMoleculeMutation({
      mutationClass: Up
    });
    return c.fillMolecule({
      recipientWallet: a,
      amount: t,
      meta: r || {}
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
    rule: r,
    policy: i = {}
  }) {
    const s = await this.createMoleculeMutation(
      {
        mutationClass: vy,
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
        mutationClass: Jp,
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
      mutationClass: Wp
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
    const r = this.createQuery(yy);
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
    const i = this.createQuery(Np);
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
    const i = this.createQuery(Rp);
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
    const t = this.createQuery(Op);
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
    let a, c;
    s = s || {};
    const l = this.createQuery(hy), u = await this.executeQuery(l, {
      slug: e
    }), p = he.get(u.data(), "0.fungibility") === "stackable";
    if (!p && o !== null)
      throw new _r("Expected Batch ID = null for non-stackable tokens.");
    if (p && o === null && (o = Mr({})), i.length > 0) {
      if (r > 0)
        throw new gr();
      r = i.length, s.tokenUnits = JSON.stringify(i);
    }
    t ? (Object.prototype.toString.call(t) === "[object String]" && (Y.isBundleHash(t) ? (a = "walletBundle", c = t) : t = Y.create({
      secret: t,
      token: e
    })), t instanceof Y && (a = "wallet", s.position = t.position, s.bundle = t.bundle, c = t.address)) : (a = "walletBundle", c = this.getBundle());
    const d = await this.createMoleculeMutation({
      mutationClass: jp
    });
    return d.fillMolecule({
      token: e,
      amount: r,
      metaType: a,
      metaId: c,
      meta: s,
      batchId: o
    }), await this.executeQuery(d);
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
      mutationClass: Kp,
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
      throw new da();
    t.forEach((i) => {
      if (!i.isShadow())
        throw new da();
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
        throw new gr();
      r = i.length;
    }
    if (o === null && (o = await this.querySourceWallet({
      token: t,
      amount: r
    })), o === null || on.cmp(o.balance, r) < 0)
      throw new lt();
    const a = Y.create({
      bundle: e,
      token: t
    });
    s !== null ? a.batchId = s : a.initBatchId({
      sourceWallet: o
    });
    const c = o.createRemainder(this.getSecret());
    o.splitUnits(
      i,
      c,
      a
    );
    const l = await this.createMolecule({
      sourceWallet: o,
      remainderWallet: c
    }), u = await this.createMoleculeMutation({
      mutationClass: Qp,
      molecule: l
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
      mutationClass: by,
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
      mutationClass: wy,
      molecule: o
    }), c = {};
    return c[this.getBundle()] = t, a.fillMolecule({
      recipients: c,
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
        throw new gr();
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
      throw new lt("Source wallet is missing or invalid.");
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
      throw new lt("Source wallet is missing or invalid.");
    if (!s.tokenUnits || !s.tokenUnits.length)
      throw new lt("Source wallet does not have token units.");
    if (!i.length)
      throw new lt("Fused token unit list is empty.");
    const o = [];
    s.tokenUnits.forEach((p) => {
      o.push(p.id);
    }), i.forEach((p) => {
      if (!o.includes(p))
        throw new lt(`Fused token unit ID = ${p} does not found in the source wallet.`);
    });
    const a = Y.create({
      bundle: e,
      token: t
    });
    a.initBatchId({ sourceWallet: s });
    const c = s.createRemainder(this.getSecret());
    s.splitUnits(i, c), r.metas.fusedTokenUnits = s.getTokenUnitsData(), a.tokenUnits = [r];
    const l = await this.createMolecule({
      sourceWallet: s,
      remainderWallet: c
    });
    l.fuseToken(s.tokenUnits, a), l.sign({
      bundle: this.getBundle()
    }), l.check();
    const u = await this.createMoleculeMutation({
      mutationClass: Re,
      molecule: l
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
    const r = new Y({
      secret: Ni(await this.getFingerprint()),
      token: "AUTH"
    }), i = await this.createQuery(ey), s = {
      cellSlug: e,
      pubkey: r.pubkey,
      encrypt: t
    }, o = await i.execute({ variables: s });
    if (o.success()) {
      const a = Jn.create(o.payload(), r);
      this.setAuthToken(a);
    } else
      throw new pa(`KnishIOClient::requestGuestAuthToken() - Authorization attempt rejected by ledger. Reason: ${o.reason()}`);
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
    const r = new Y({
      secret: e,
      token: "AUTH"
    }), i = await this.createMolecule({
      secret: e,
      sourceWallet: r
    }), s = await this.createMoleculeMutation({
      mutationClass: $p,
      molecule: i
    });
    s.fillMolecule({ meta: { encrypt: t ? "true" : "false" } });
    const o = await s.execute({});
    if (o.success()) {
      const a = Jn.create(o.payload(), r);
      this.setAuthToken(a);
    } else
      throw new pa(`KnishIOClient::requestProfileAuthToken() - Authorization attempt rejected by ledger. Reason: ${o.reason()}`);
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
    e === null && t && (e = Ni(t)), r && this.setCellSlug(r), this.$__authInProcess = !0;
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
  W as Atom,
  km as KnishIOClient,
  Nr as Meta,
  ft as Molecule,
  Y as Wallet,
  al as base64ToHex,
  bm as bufferToHexString,
  sl as charsetBaseConvert,
  Rr as chunkSubstr,
  fn as generateBundleHash,
  Ni as generateSecret,
  wm as hexStringToBuffer,
  ol as hexToBase64,
  ul as isHex,
  os as randomString
};
//# sourceMappingURL=client.es.mjs.map
