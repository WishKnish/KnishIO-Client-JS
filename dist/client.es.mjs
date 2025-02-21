const Bi = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Ci = "ARRAYBUFFER not supported by this environment", Mi = "UINT8ARRAY not supported by this environment";
function Nr(n, e, t, r) {
  let i, s, o;
  const c = e || [0], h = (t = t || 0) >>> 3, f = r === -1 ? 3 : 0;
  for (i = 0; i < n.length; i += 1) o = i + h, s = o >>> 2, c.length <= s && c.push(0), c[s] |= n[i] << 8 * (f + r * (o % 4));
  return { value: c, binLen: 8 * n.length + t };
}
function Ot(n, e, t) {
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
        return function(o, c, h, f) {
          let l, y, p, g;
          if (o.length % 2 != 0) throw new Error("String of HEX type must be in byte increments");
          const b = c || [0], A = (h = h || 0) >>> 3, S = f === -1 ? 3 : 0;
          for (l = 0; l < o.length; l += 2) {
            if (y = parseInt(o.substr(l, 2), 16), isNaN(y)) throw new Error("String of HEX type contains invalid characters");
            for (g = (l >>> 1) + A, p = g >>> 2; b.length <= p; ) b.push(0);
            b[p] |= y << 8 * (S + f * (g % 4));
          }
          return { value: b, binLen: 4 * o.length + h };
        }(r, i, s, t);
      };
    case "TEXT":
      return function(r, i, s) {
        return function(o, c, h, f, l) {
          let y, p, g, b, A, S, $, B, T = 0;
          const x = h || [0], _ = (f = f || 0) >>> 3;
          if (c === "UTF8") for ($ = l === -1 ? 3 : 0, g = 0; g < o.length; g += 1) for (y = o.charCodeAt(g), p = [], 128 > y ? p.push(y) : 2048 > y ? (p.push(192 | y >>> 6), p.push(128 | 63 & y)) : 55296 > y || 57344 <= y ? p.push(224 | y >>> 12, 128 | y >>> 6 & 63, 128 | 63 & y) : (g += 1, y = 65536 + ((1023 & y) << 10 | 1023 & o.charCodeAt(g)), p.push(240 | y >>> 18, 128 | y >>> 12 & 63, 128 | y >>> 6 & 63, 128 | 63 & y)), b = 0; b < p.length; b += 1) {
            for (S = T + _, A = S >>> 2; x.length <= A; ) x.push(0);
            x[A] |= p[b] << 8 * ($ + l * (S % 4)), T += 1;
          }
          else for ($ = l === -1 ? 2 : 0, B = c === "UTF16LE" && l !== 1 || c !== "UTF16LE" && l === 1, g = 0; g < o.length; g += 1) {
            for (y = o.charCodeAt(g), B === !0 && (b = 255 & y, y = b << 8 | y >>> 8), S = T + _, A = S >>> 2; x.length <= A; ) x.push(0);
            x[A] |= y << 8 * ($ + l * (S % 4)), T += 2;
          }
          return { value: x, binLen: 8 * T + f };
        }(r, e, i, s, t);
      };
    case "B64":
      return function(r, i, s) {
        return function(o, c, h, f) {
          let l, y, p, g, b, A, S, $ = 0;
          const B = c || [0], T = (h = h || 0) >>> 3, x = f === -1 ? 3 : 0, _ = o.indexOf("=");
          if (o.search(/^[a-zA-Z0-9=+/]+$/) === -1) throw new Error("Invalid character in base-64 string");
          if (o = o.replace(/=/g, ""), _ !== -1 && _ < o.length) throw new Error("Invalid '=' found in base-64 string");
          for (y = 0; y < o.length; y += 4) {
            for (b = o.substr(y, 4), g = 0, p = 0; p < b.length; p += 1) l = Bi.indexOf(b.charAt(p)), g |= l << 18 - 6 * p;
            for (p = 0; p < b.length - 1; p += 1) {
              for (S = $ + T, A = S >>> 2; B.length <= A; ) B.push(0);
              B[A] |= (g >>> 16 - 8 * p & 255) << 8 * (x + f * (S % 4)), $ += 1;
            }
          }
          return { value: B, binLen: 8 * $ + h };
        }(r, i, s, t);
      };
    case "BYTES":
      return function(r, i, s) {
        return function(o, c, h, f) {
          let l, y, p, g;
          const b = c || [0], A = (h = h || 0) >>> 3, S = f === -1 ? 3 : 0;
          for (y = 0; y < o.length; y += 1) l = o.charCodeAt(y), g = y + A, p = g >>> 2, b.length <= p && b.push(0), b[p] |= l << 8 * (S + f * (g % 4));
          return { value: b, binLen: 8 * o.length + h };
        }(r, i, s, t);
      };
    case "ARRAYBUFFER":
      try {
        new ArrayBuffer(0);
      } catch {
        throw new Error(Ci);
      }
      return function(r, i, s) {
        return function(o, c, h, f) {
          return Nr(new Uint8Array(o), c, h, f);
        }(r, i, s, t);
      };
    case "UINT8ARRAY":
      try {
        new Uint8Array(0);
      } catch {
        throw new Error(Mi);
      }
      return function(r, i, s) {
        return Nr(r, i, s, t);
      };
    default:
      throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
  }
}
function Rr(n, e, t, r) {
  switch (n) {
    case "HEX":
      return function(i) {
        return function(s, o, c, h) {
          const f = "0123456789abcdef";
          let l, y, p = "";
          const g = o / 8, b = c === -1 ? 3 : 0;
          for (l = 0; l < g; l += 1) y = s[l >>> 2] >>> 8 * (b + c * (l % 4)), p += f.charAt(y >>> 4 & 15) + f.charAt(15 & y);
          return h.outputUpper ? p.toUpperCase() : p;
        }(i, e, t, r);
      };
    case "B64":
      return function(i) {
        return function(s, o, c, h) {
          let f, l, y, p, g, b = "";
          const A = o / 8, S = c === -1 ? 3 : 0;
          for (f = 0; f < A; f += 3) for (p = f + 1 < A ? s[f + 1 >>> 2] : 0, g = f + 2 < A ? s[f + 2 >>> 2] : 0, y = (s[f >>> 2] >>> 8 * (S + c * (f % 4)) & 255) << 16 | (p >>> 8 * (S + c * ((f + 1) % 4)) & 255) << 8 | g >>> 8 * (S + c * ((f + 2) % 4)) & 255, l = 0; l < 4; l += 1) b += 8 * f + 6 * l <= o ? Bi.charAt(y >>> 6 * (3 - l) & 63) : h.b64Pad;
          return b;
        }(i, e, t, r);
      };
    case "BYTES":
      return function(i) {
        return function(s, o, c) {
          let h, f, l = "";
          const y = o / 8, p = c === -1 ? 3 : 0;
          for (h = 0; h < y; h += 1) f = s[h >>> 2] >>> 8 * (p + c * (h % 4)) & 255, l += String.fromCharCode(f);
          return l;
        }(i, e, t);
      };
    case "ARRAYBUFFER":
      try {
        new ArrayBuffer(0);
      } catch {
        throw new Error(Ci);
      }
      return function(i) {
        return function(s, o, c) {
          let h;
          const f = o / 8, l = new ArrayBuffer(f), y = new Uint8Array(l), p = c === -1 ? 3 : 0;
          for (h = 0; h < f; h += 1) y[h] = s[h >>> 2] >>> 8 * (p + c * (h % 4)) & 255;
          return l;
        }(i, e, t);
      };
    case "UINT8ARRAY":
      try {
        new Uint8Array(0);
      } catch {
        throw new Error(Mi);
      }
      return function(i) {
        return function(s, o, c) {
          let h;
          const f = o / 8, l = c === -1 ? 3 : 0, y = new Uint8Array(f);
          for (h = 0; h < f; h += 1) y[h] = s[h >>> 2] >>> 8 * (l + c * (h % 4)) & 255;
          return y;
        }(i, e, t);
      };
    default:
      throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
  }
}
const sn = 4294967296, C = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], Je = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], Xe = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], on = "Chosen SHA variant is not supported", Ni = "Cannot set numRounds with MAC";
function kn(n, e) {
  let t, r;
  const i = n.binLen >>> 3, s = e.binLen >>> 3, o = i << 3, c = 4 - i << 3;
  if (i % 4 != 0) {
    for (t = 0; t < s; t += 4) r = i + t >>> 2, n.value[r] |= e.value[t >>> 2] << o, n.value.push(0), n.value[r + 1] |= e.value[t >>> 2] >>> c;
    return (n.value.length << 2) - 4 >= s + i && n.value.pop(), { value: n.value, binLen: n.binLen + e.binLen };
  }
  return { value: n.value.concat(e.value), binLen: n.binLen + e.binLen };
}
function Or(n) {
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
function lt(n, e, t, r) {
  const i = n + " must include a value and format";
  if (!e) {
    if (!r) throw new Error(i);
    return r;
  }
  if (e.value === void 0 || !e.format) throw new Error(i);
  return Ot(e.format, e.encoding || "UTF8", t)(e.value);
}
let Un = class {
  constructor(e, t, r) {
    const i = r || {};
    if (this.t = t, this.i = i.encoding || "UTF8", this.numRounds = i.numRounds || 1, isNaN(this.numRounds) || this.numRounds !== parseInt(this.numRounds, 10) || 1 > this.numRounds) throw new Error("numRounds must a integer >= 1");
    this.o = e, this.h = [], this.u = 0, this.l = !1, this.A = 0, this.H = !1, this.S = [], this.p = [];
  }
  update(e) {
    let t, r = 0;
    const i = this.m >>> 5, s = this.C(e, this.h, this.u), o = s.binLen, c = s.value, h = o >>> 5;
    for (t = 0; t < h; t += i) r + this.m <= o && (this.U = this.v(c.slice(t, t + i), this.U), r += this.m);
    return this.A += r, this.h = c.slice(r >>> 5), this.u = o % this.m, this.l = !0, this;
  }
  getHash(e, t) {
    let r, i, s = this.R;
    const o = Or(t);
    if (this.K) {
      if (o.outputLen === -1) throw new Error("Output length must be specified in options");
      s = o.outputLen;
    }
    const c = Rr(e, s, this.T, o);
    if (this.H && this.g) return c(this.g(o));
    for (i = this.F(this.h.slice(), this.u, this.A, this.L(this.U), s), r = 1; r < this.numRounds; r += 1) this.K && s % 32 != 0 && (i[i.length - 1] &= 16777215 >>> 24 - s % 32), i = this.F(i, s, 0, this.B(this.o), s);
    return c(i);
  }
  setHMACKey(e, t, r) {
    if (!this.M) throw new Error("Variant does not support HMAC");
    if (this.l) throw new Error("Cannot set MAC key after calling update");
    const i = Ot(t, (r || {}).encoding || "UTF8", this.T);
    this.k(i(e));
  }
  k(e) {
    const t = this.m >>> 3, r = t / 4 - 1;
    let i;
    if (this.numRounds !== 1) throw new Error(Ni);
    if (this.H) throw new Error("MAC key already set");
    for (t < e.binLen / 8 && (e.value = this.F(e.value, e.binLen, 0, this.B(this.o), this.R)); e.value.length <= r; ) e.value.push(0);
    for (i = 0; i <= r; i += 1) this.S[i] = 909522486 ^ e.value[i], this.p[i] = 1549556828 ^ e.value[i];
    this.U = this.v(this.S, this.U), this.A = this.m, this.H = !0;
  }
  getHMAC(e, t) {
    const r = Or(t);
    return Rr(e, this.R, this.T, r)(this.Y());
  }
  Y() {
    let e;
    if (!this.H) throw new Error("Cannot call getHMAC without first setting MAC key");
    const t = this.F(this.h.slice(), this.u, this.A, this.L(this.U), this.R);
    return e = this.v(this.p, this.B(this.o)), e = this.F(t, this.R, this.m, e, this.R), e;
  }
};
function At(n, e) {
  return n << e | n >>> 32 - e;
}
function je(n, e) {
  return n >>> e | n << 32 - e;
}
function Ri(n, e) {
  return n >>> e;
}
function Ur(n, e, t) {
  return n ^ e ^ t;
}
function Oi(n, e, t) {
  return n & e ^ ~n & t;
}
function Ui(n, e, t) {
  return n & e ^ n & t ^ e & t;
}
function Ms(n) {
  return je(n, 2) ^ je(n, 13) ^ je(n, 22);
}
function ge(n, e) {
  const t = (65535 & n) + (65535 & e);
  return (65535 & (n >>> 16) + (e >>> 16) + (t >>> 16)) << 16 | 65535 & t;
}
function Ns(n, e, t, r) {
  const i = (65535 & n) + (65535 & e) + (65535 & t) + (65535 & r);
  return (65535 & (n >>> 16) + (e >>> 16) + (t >>> 16) + (r >>> 16) + (i >>> 16)) << 16 | 65535 & i;
}
function Vt(n, e, t, r, i) {
  const s = (65535 & n) + (65535 & e) + (65535 & t) + (65535 & r) + (65535 & i);
  return (65535 & (n >>> 16) + (e >>> 16) + (t >>> 16) + (r >>> 16) + (i >>> 16) + (s >>> 16)) << 16 | 65535 & s;
}
function Rs(n) {
  return je(n, 7) ^ je(n, 18) ^ Ri(n, 3);
}
function Os(n) {
  return je(n, 6) ^ je(n, 11) ^ je(n, 25);
}
function Us(n) {
  return [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
}
function Fi(n, e) {
  let t, r, i, s, o, c, h;
  const f = [];
  for (t = e[0], r = e[1], i = e[2], s = e[3], o = e[4], h = 0; h < 80; h += 1) f[h] = h < 16 ? n[h] : At(f[h - 3] ^ f[h - 8] ^ f[h - 14] ^ f[h - 16], 1), c = h < 20 ? Vt(At(t, 5), Oi(r, i, s), o, 1518500249, f[h]) : h < 40 ? Vt(At(t, 5), Ur(r, i, s), o, 1859775393, f[h]) : h < 60 ? Vt(At(t, 5), Ui(r, i, s), o, 2400959708, f[h]) : Vt(At(t, 5), Ur(r, i, s), o, 3395469782, f[h]), o = s, s = i, i = At(r, 30), r = t, t = c;
  return e[0] = ge(t, e[0]), e[1] = ge(r, e[1]), e[2] = ge(i, e[2]), e[3] = ge(s, e[3]), e[4] = ge(o, e[4]), e;
}
function Fs(n, e, t, r) {
  let i;
  const s = 15 + (e + 65 >>> 9 << 4), o = e + t;
  for (; n.length <= s; ) n.push(0);
  for (n[e >>> 5] |= 128 << 24 - e % 32, n[s] = 4294967295 & o, n[s - 1] = o / sn | 0, i = 0; i < n.length; i += 16) r = Fi(n.slice(i, i + 16), r);
  return r;
}
let Hs = class extends Un {
  constructor(e, t, r) {
    if (e !== "SHA-1") throw new Error(on);
    super(e, t, r);
    const i = r || {};
    this.M = !0, this.g = this.Y, this.T = -1, this.C = Ot(this.t, this.i, this.T), this.v = Fi, this.L = function(s) {
      return s.slice();
    }, this.B = Us, this.F = Fs, this.U = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.m = 512, this.R = 160, this.K = !1, i.hmacKey && this.k(lt("hmacKey", i.hmacKey, this.T));
  }
};
function Fr(n) {
  let e;
  return e = n == "SHA-224" ? Je.slice() : Xe.slice(), e;
}
function Hr(n, e) {
  let t, r, i, s, o, c, h, f, l, y, p;
  const g = [];
  for (t = e[0], r = e[1], i = e[2], s = e[3], o = e[4], c = e[5], h = e[6], f = e[7], p = 0; p < 64; p += 1) g[p] = p < 16 ? n[p] : Ns(je(b = g[p - 2], 17) ^ je(b, 19) ^ Ri(b, 10), g[p - 7], Rs(g[p - 15]), g[p - 16]), l = Vt(f, Os(o), Oi(o, c, h), C[p], g[p]), y = ge(Ms(t), Ui(t, r, i)), f = h, h = c, c = o, o = ge(s, l), s = i, i = r, r = t, t = ge(l, y);
  var b;
  return e[0] = ge(t, e[0]), e[1] = ge(r, e[1]), e[2] = ge(i, e[2]), e[3] = ge(s, e[3]), e[4] = ge(o, e[4]), e[5] = ge(c, e[5]), e[6] = ge(h, e[6]), e[7] = ge(f, e[7]), e;
}
let Ls = class extends Un {
  constructor(e, t, r) {
    if (e !== "SHA-224" && e !== "SHA-256") throw new Error(on);
    super(e, t, r);
    const i = r || {};
    this.g = this.Y, this.M = !0, this.T = -1, this.C = Ot(this.t, this.i, this.T), this.v = Hr, this.L = function(s) {
      return s.slice();
    }, this.B = Fr, this.F = function(s, o, c, h) {
      return function(f, l, y, p, g) {
        let b, A;
        const S = 15 + (l + 65 >>> 9 << 4), $ = l + y;
        for (; f.length <= S; ) f.push(0);
        for (f[l >>> 5] |= 128 << 24 - l % 32, f[S] = 4294967295 & $, f[S - 1] = $ / sn | 0, b = 0; b < f.length; b += 16) p = Hr(f.slice(b, b + 16), p);
        return A = g === "SHA-224" ? [p[0], p[1], p[2], p[3], p[4], p[5], p[6]] : p, A;
      }(s, o, c, h, e);
    }, this.U = Fr(e), this.m = 512, this.R = e === "SHA-224" ? 224 : 256, this.K = !1, i.hmacKey && this.k(lt("hmacKey", i.hmacKey, this.T));
  }
};
class k {
  constructor(e, t) {
    this.N = e, this.I = t;
  }
}
function Lr(n, e) {
  let t;
  return e > 32 ? (t = 64 - e, new k(n.I << e | n.N >>> t, n.N << e | n.I >>> t)) : e !== 0 ? (t = 32 - e, new k(n.N << e | n.I >>> t, n.I << e | n.N >>> t)) : n;
}
function Ve(n, e) {
  let t;
  return e < 32 ? (t = 32 - e, new k(n.N >>> e | n.I << t, n.I >>> e | n.N << t)) : (t = 64 - e, new k(n.I >>> e | n.N << t, n.N >>> e | n.I << t));
}
function Hi(n, e) {
  return new k(n.N >>> e, n.I >>> e | n.N << 32 - e);
}
function qs(n, e, t) {
  return new k(n.N & e.N ^ n.N & t.N ^ e.N & t.N, n.I & e.I ^ n.I & t.I ^ e.I & t.I);
}
function Ps(n) {
  const e = Ve(n, 28), t = Ve(n, 34), r = Ve(n, 39);
  return new k(e.N ^ t.N ^ r.N, e.I ^ t.I ^ r.I);
}
function Oe(n, e) {
  let t, r;
  t = (65535 & n.I) + (65535 & e.I), r = (n.I >>> 16) + (e.I >>> 16) + (t >>> 16);
  const i = (65535 & r) << 16 | 65535 & t;
  return t = (65535 & n.N) + (65535 & e.N) + (r >>> 16), r = (n.N >>> 16) + (e.N >>> 16) + (t >>> 16), new k((65535 & r) << 16 | 65535 & t, i);
}
function Ds(n, e, t, r) {
  let i, s;
  i = (65535 & n.I) + (65535 & e.I) + (65535 & t.I) + (65535 & r.I), s = (n.I >>> 16) + (e.I >>> 16) + (t.I >>> 16) + (r.I >>> 16) + (i >>> 16);
  const o = (65535 & s) << 16 | 65535 & i;
  return i = (65535 & n.N) + (65535 & e.N) + (65535 & t.N) + (65535 & r.N) + (s >>> 16), s = (n.N >>> 16) + (e.N >>> 16) + (t.N >>> 16) + (r.N >>> 16) + (i >>> 16), new k((65535 & s) << 16 | 65535 & i, o);
}
function Ks(n, e, t, r, i) {
  let s, o;
  s = (65535 & n.I) + (65535 & e.I) + (65535 & t.I) + (65535 & r.I) + (65535 & i.I), o = (n.I >>> 16) + (e.I >>> 16) + (t.I >>> 16) + (r.I >>> 16) + (i.I >>> 16) + (s >>> 16);
  const c = (65535 & o) << 16 | 65535 & s;
  return s = (65535 & n.N) + (65535 & e.N) + (65535 & t.N) + (65535 & r.N) + (65535 & i.N) + (o >>> 16), o = (n.N >>> 16) + (e.N >>> 16) + (t.N >>> 16) + (r.N >>> 16) + (i.N >>> 16) + (s >>> 16), new k((65535 & o) << 16 | 65535 & s, c);
}
function Ft(n, e) {
  return new k(n.N ^ e.N, n.I ^ e.I);
}
function Ws(n) {
  const e = Ve(n, 19), t = Ve(n, 61), r = Hi(n, 6);
  return new k(e.N ^ t.N ^ r.N, e.I ^ t.I ^ r.I);
}
function js(n) {
  const e = Ve(n, 1), t = Ve(n, 8), r = Hi(n, 7);
  return new k(e.N ^ t.N ^ r.N, e.I ^ t.I ^ r.I);
}
function Vs(n) {
  const e = Ve(n, 14), t = Ve(n, 18), r = Ve(n, 41);
  return new k(e.N ^ t.N ^ r.N, e.I ^ t.I ^ r.I);
}
const Qs = [new k(C[0], 3609767458), new k(C[1], 602891725), new k(C[2], 3964484399), new k(C[3], 2173295548), new k(C[4], 4081628472), new k(C[5], 3053834265), new k(C[6], 2937671579), new k(C[7], 3664609560), new k(C[8], 2734883394), new k(C[9], 1164996542), new k(C[10], 1323610764), new k(C[11], 3590304994), new k(C[12], 4068182383), new k(C[13], 991336113), new k(C[14], 633803317), new k(C[15], 3479774868), new k(C[16], 2666613458), new k(C[17], 944711139), new k(C[18], 2341262773), new k(C[19], 2007800933), new k(C[20], 1495990901), new k(C[21], 1856431235), new k(C[22], 3175218132), new k(C[23], 2198950837), new k(C[24], 3999719339), new k(C[25], 766784016), new k(C[26], 2566594879), new k(C[27], 3203337956), new k(C[28], 1034457026), new k(C[29], 2466948901), new k(C[30], 3758326383), new k(C[31], 168717936), new k(C[32], 1188179964), new k(C[33], 1546045734), new k(C[34], 1522805485), new k(C[35], 2643833823), new k(C[36], 2343527390), new k(C[37], 1014477480), new k(C[38], 1206759142), new k(C[39], 344077627), new k(C[40], 1290863460), new k(C[41], 3158454273), new k(C[42], 3505952657), new k(C[43], 106217008), new k(C[44], 3606008344), new k(C[45], 1432725776), new k(C[46], 1467031594), new k(C[47], 851169720), new k(C[48], 3100823752), new k(C[49], 1363258195), new k(C[50], 3750685593), new k(C[51], 3785050280), new k(C[52], 3318307427), new k(C[53], 3812723403), new k(C[54], 2003034995), new k(C[55], 3602036899), new k(C[56], 1575990012), new k(C[57], 1125592928), new k(C[58], 2716904306), new k(C[59], 442776044), new k(C[60], 593698344), new k(C[61], 3733110249), new k(C[62], 2999351573), new k(C[63], 3815920427), new k(3391569614, 3928383900), new k(3515267271, 566280711), new k(3940187606, 3454069534), new k(4118630271, 4000239992), new k(116418474, 1914138554), new k(174292421, 2731055270), new k(289380356, 3203993006), new k(460393269, 320620315), new k(685471733, 587496836), new k(852142971, 1086792851), new k(1017036298, 365543100), new k(1126000580, 2618297676), new k(1288033470, 3409855158), new k(1501505948, 4234509866), new k(1607167915, 987167468), new k(1816402316, 1246189591)];
function qr(n) {
  return n === "SHA-384" ? [new k(3418070365, Je[0]), new k(1654270250, Je[1]), new k(2438529370, Je[2]), new k(355462360, Je[3]), new k(1731405415, Je[4]), new k(41048885895, Je[5]), new k(3675008525, Je[6]), new k(1203062813, Je[7])] : [new k(Xe[0], 4089235720), new k(Xe[1], 2227873595), new k(Xe[2], 4271175723), new k(Xe[3], 1595750129), new k(Xe[4], 2917565137), new k(Xe[5], 725511199), new k(Xe[6], 4215389547), new k(Xe[7], 327033209)];
}
function Pr(n, e) {
  let t, r, i, s, o, c, h, f, l, y, p, g;
  const b = [];
  for (t = e[0], r = e[1], i = e[2], s = e[3], o = e[4], c = e[5], h = e[6], f = e[7], p = 0; p < 80; p += 1) p < 16 ? (g = 2 * p, b[p] = new k(n[g], n[g + 1])) : b[p] = Ds(Ws(b[p - 2]), b[p - 7], js(b[p - 15]), b[p - 16]), l = Ks(f, Vs(o), (S = c, $ = h, new k((A = o).N & S.N ^ ~A.N & $.N, A.I & S.I ^ ~A.I & $.I)), Qs[p], b[p]), y = Oe(Ps(t), qs(t, r, i)), f = h, h = c, c = o, o = Oe(s, l), s = i, i = r, r = t, t = Oe(l, y);
  var A, S, $;
  return e[0] = Oe(t, e[0]), e[1] = Oe(r, e[1]), e[2] = Oe(i, e[2]), e[3] = Oe(s, e[3]), e[4] = Oe(o, e[4]), e[5] = Oe(c, e[5]), e[6] = Oe(h, e[6]), e[7] = Oe(f, e[7]), e;
}
let Gs = class extends Un {
  constructor(e, t, r) {
    if (e !== "SHA-384" && e !== "SHA-512") throw new Error(on);
    super(e, t, r);
    const i = r || {};
    this.g = this.Y, this.M = !0, this.T = -1, this.C = Ot(this.t, this.i, this.T), this.v = Pr, this.L = function(s) {
      return s.slice();
    }, this.B = qr, this.F = function(s, o, c, h) {
      return function(f, l, y, p, g) {
        let b, A;
        const S = 31 + (l + 129 >>> 10 << 5), $ = l + y;
        for (; f.length <= S; ) f.push(0);
        for (f[l >>> 5] |= 128 << 24 - l % 32, f[S] = 4294967295 & $, f[S - 1] = $ / sn | 0, b = 0; b < f.length; b += 32) p = Pr(f.slice(b, b + 32), p);
        return A = g === "SHA-384" ? [p[0].N, p[0].I, p[1].N, p[1].I, p[2].N, p[2].I, p[3].N, p[3].I, p[4].N, p[4].I, p[5].N, p[5].I] : [p[0].N, p[0].I, p[1].N, p[1].I, p[2].N, p[2].I, p[3].N, p[3].I, p[4].N, p[4].I, p[5].N, p[5].I, p[6].N, p[6].I, p[7].N, p[7].I], A;
      }(s, o, c, h, e);
    }, this.U = qr(e), this.m = 1024, this.R = e === "SHA-384" ? 384 : 512, this.K = !1, i.hmacKey && this.k(lt("hmacKey", i.hmacKey, this.T));
  }
};
const zs = [new k(0, 1), new k(0, 32898), new k(2147483648, 32906), new k(2147483648, 2147516416), new k(0, 32907), new k(0, 2147483649), new k(2147483648, 2147516545), new k(2147483648, 32777), new k(0, 138), new k(0, 136), new k(0, 2147516425), new k(0, 2147483658), new k(0, 2147516555), new k(2147483648, 139), new k(2147483648, 32905), new k(2147483648, 32771), new k(2147483648, 32770), new k(2147483648, 128), new k(0, 32778), new k(2147483648, 2147483658), new k(2147483648, 2147516545), new k(2147483648, 32896), new k(0, 2147483649), new k(2147483648, 2147516424)], Js = [[0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61], [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]];
function hr(n) {
  let e;
  const t = [];
  for (e = 0; e < 5; e += 1) t[e] = [new k(0, 0), new k(0, 0), new k(0, 0), new k(0, 0), new k(0, 0)];
  return t;
}
function Xs(n) {
  let e;
  const t = [];
  for (e = 0; e < 5; e += 1) t[e] = n[e].slice();
  return t;
}
function cn(n, e) {
  let t, r, i, s;
  const o = [], c = [];
  if (n !== null) for (r = 0; r < n.length; r += 2) e[(r >>> 1) % 5][(r >>> 1) / 5 | 0] = Ft(e[(r >>> 1) % 5][(r >>> 1) / 5 | 0], new k(n[r + 1], n[r]));
  for (t = 0; t < 24; t += 1) {
    for (s = hr(), r = 0; r < 5; r += 1) o[r] = (h = e[r][0], f = e[r][1], l = e[r][2], y = e[r][3], p = e[r][4], new k(h.N ^ f.N ^ l.N ^ y.N ^ p.N, h.I ^ f.I ^ l.I ^ y.I ^ p.I));
    for (r = 0; r < 5; r += 1) c[r] = Ft(o[(r + 4) % 5], Lr(o[(r + 1) % 5], 1));
    for (r = 0; r < 5; r += 1) for (i = 0; i < 5; i += 1) e[r][i] = Ft(e[r][i], c[r]);
    for (r = 0; r < 5; r += 1) for (i = 0; i < 5; i += 1) s[i][(2 * r + 3 * i) % 5] = Lr(e[r][i], Js[r][i]);
    for (r = 0; r < 5; r += 1) for (i = 0; i < 5; i += 1) e[r][i] = Ft(s[r][i], new k(~s[(r + 1) % 5][i].N & s[(r + 2) % 5][i].N, ~s[(r + 1) % 5][i].I & s[(r + 2) % 5][i].I));
    e[0][0] = Ft(e[0][0], zs[t]);
  }
  var h, f, l, y, p;
  return e;
}
function Li(n) {
  let e, t, r = 0;
  const i = [0, 0], s = [4294967295 & n, n / sn & 2097151];
  for (e = 6; e >= 0; e--) t = s[e >> 2] >>> 8 * e & 255, t === 0 && r === 0 || (i[r + 1 >> 2] |= t << 8 * (r + 1), r += 1);
  return r = r !== 0 ? r : 1, i[0] |= r, { value: r + 1 > 4 ? i : [i[0]], binLen: 8 + 8 * r };
}
function Xn(n) {
  return kn(Li(n.binLen), n);
}
function Dr(n, e) {
  let t, r = Li(e);
  r = kn(r, n);
  const i = e >>> 2, s = (i - r.value.length % i) % i;
  for (t = 0; t < s; t++) r.value.push(0);
  return r.value;
}
let Ys = class extends Un {
  constructor(n, e, t) {
    let r = 6, i = 0;
    super(n, e, t);
    const s = t || {};
    if (this.numRounds !== 1) {
      if (s.kmacKey || s.hmacKey) throw new Error(Ni);
      if (this.o === "CSHAKE128" || this.o === "CSHAKE256") throw new Error("Cannot set numRounds for CSHAKE variants");
    }
    switch (this.T = 1, this.C = Ot(this.t, this.i, this.T), this.v = cn, this.L = Xs, this.B = hr, this.U = hr(), this.K = !1, n) {
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
        throw new Error(on);
    }
    this.F = function(o, c, h, f, l) {
      return function(y, p, g, b, A, S, $) {
        let B, T, x = 0;
        const _ = [], I = A >>> 5, N = p >>> 5;
        for (B = 0; B < N && p >= A; B += I) b = cn(y.slice(B, B + I), b), p -= A;
        for (y = y.slice(B), p %= A; y.length < I; ) y.push(0);
        for (B = p >>> 3, y[B >> 2] ^= S << B % 4 * 8, y[I - 1] ^= 2147483648, b = cn(y, b); 32 * _.length < $ && (T = b[x % 5][x / 5 | 0], _.push(T.I), !(32 * _.length >= $)); ) _.push(T.N), x += 1, 64 * x % A == 0 && (cn(null, b), x = 0);
        return _;
      }(o, c, 0, f, i, r, l);
    }, s.hmacKey && this.k(lt("hmacKey", s.hmacKey, this.T));
  }
  O(n, e) {
    const t = function(i) {
      const s = i;
      return { funcName: lt("funcName", s.funcName, 1, { value: [], binLen: 0 }), customization: lt("Customization", s.customization, 1, { value: [], binLen: 0 }) };
    }(n || {});
    e && (t.funcName = e);
    const r = kn(Xn(t.funcName), Xn(t.customization));
    if (t.customization.binLen !== 0 || t.funcName.binLen !== 0) {
      const i = Dr(r, this.m >>> 3);
      for (let s = 0; s < i.length; s += this.m >>> 5) this.U = this.v(i.slice(s, s + (this.m >>> 5)), this.U), this.A += this.m;
      return 4;
    }
    return 31;
  }
  X(n) {
    const e = function(r) {
      const i = r;
      return { kmacKey: lt("kmacKey", i.kmacKey, 1), funcName: { value: [1128353099], binLen: 32 }, customization: lt("Customization", i.customization, 1, { value: [], binLen: 0 }) };
    }(n || {});
    this.O(n, e.funcName);
    const t = Dr(Xn(e.kmacKey), this.m >>> 3);
    for (let r = 0; r < t.length; r += this.m >>> 5) this.U = this.v(t.slice(r, r + (this.m >>> 5)), this.U), this.A += this.m;
    this.H = !0;
  }
  _(n) {
    const e = kn({ value: this.h.slice(), binLen: this.u }, function(t) {
      let r, i, s = 0;
      const o = [0, 0], c = [4294967295 & t, t / sn & 2097151];
      for (r = 6; r >= 0; r--) i = c[r >> 2] >>> 8 * r & 255, i === 0 && s === 0 || (o[s >> 2] |= i << 8 * s, s += 1);
      return s = s !== 0 ? s : 1, o[s >> 2] |= s << 8 * s, { value: s + 1 > 4 ? o : [o[0]], binLen: 8 + 8 * s };
    }(n.outputLen));
    return this.F(e.value, e.binLen, this.A, this.L(this.U), n.outputLen);
  }
};
class Ne {
  constructor(e, t, r) {
    if (e == "SHA-1") this.P = new Hs(e, t, r);
    else if (e == "SHA-224" || e == "SHA-256") this.P = new Ls(e, t, r);
    else if (e == "SHA-384" || e == "SHA-512") this.P = new Gs(e, t, r);
    else {
      if (e != "SHA3-224" && e != "SHA3-256" && e != "SHA3-384" && e != "SHA3-512" && e != "SHAKE128" && e != "SHAKE256" && e != "CSHAKE128" && e != "CSHAKE256" && e != "KMAC128" && e != "KMAC256") throw new Error(on);
      this.P = new Ys(e, t, r);
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
var qi = {}, Fn = {};
Fn.byteLength = to;
Fn.toByteArray = ro;
Fn.fromByteArray = oo;
var De = [], Me = [], Zs = typeof Uint8Array < "u" ? Uint8Array : Array, Yn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var It = 0, eo = Yn.length; It < eo; ++It)
  De[It] = Yn[It], Me[Yn.charCodeAt(It)] = It;
Me[45] = 62;
Me[95] = 63;
function Pi(n) {
  var e = n.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var t = n.indexOf("=");
  t === -1 && (t = e);
  var r = t === e ? 0 : 4 - t % 4;
  return [t, r];
}
function to(n) {
  var e = Pi(n), t = e[0], r = e[1];
  return (t + r) * 3 / 4 - r;
}
function no(n, e, t) {
  return (e + t) * 3 / 4 - t;
}
function ro(n) {
  var e, t = Pi(n), r = t[0], i = t[1], s = new Zs(no(n, r, i)), o = 0, c = i > 0 ? r - 4 : r, h;
  for (h = 0; h < c; h += 4)
    e = Me[n.charCodeAt(h)] << 18 | Me[n.charCodeAt(h + 1)] << 12 | Me[n.charCodeAt(h + 2)] << 6 | Me[n.charCodeAt(h + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
  return i === 2 && (e = Me[n.charCodeAt(h)] << 2 | Me[n.charCodeAt(h + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = Me[n.charCodeAt(h)] << 10 | Me[n.charCodeAt(h + 1)] << 4 | Me[n.charCodeAt(h + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
}
function io(n) {
  return De[n >> 18 & 63] + De[n >> 12 & 63] + De[n >> 6 & 63] + De[n & 63];
}
function so(n, e, t) {
  for (var r, i = [], s = e; s < t; s += 3)
    r = (n[s] << 16 & 16711680) + (n[s + 1] << 8 & 65280) + (n[s + 2] & 255), i.push(io(r));
  return i.join("");
}
function oo(n) {
  for (var e, t = n.length, r = t % 3, i = [], s = 16383, o = 0, c = t - r; o < c; o += s)
    i.push(so(n, o, o + s > c ? c : o + s));
  return r === 1 ? (e = n[t - 1], i.push(
    De[e >> 2] + De[e << 4 & 63] + "=="
  )) : r === 2 && (e = (n[t - 2] << 8) + n[t - 1], i.push(
    De[e >> 10] + De[e >> 4 & 63] + De[e << 2 & 63] + "="
  )), i.join("");
}
var xr = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
xr.read = function(n, e, t, r, i) {
  var s, o, c = i * 8 - r - 1, h = (1 << c) - 1, f = h >> 1, l = -7, y = t ? i - 1 : 0, p = t ? -1 : 1, g = n[e + y];
  for (y += p, s = g & (1 << -l) - 1, g >>= -l, l += c; l > 0; s = s * 256 + n[e + y], y += p, l -= 8)
    ;
  for (o = s & (1 << -l) - 1, s >>= -l, l += r; l > 0; o = o * 256 + n[e + y], y += p, l -= 8)
    ;
  if (s === 0)
    s = 1 - f;
  else {
    if (s === h)
      return o ? NaN : (g ? -1 : 1) * (1 / 0);
    o = o + Math.pow(2, r), s = s - f;
  }
  return (g ? -1 : 1) * o * Math.pow(2, s - r);
};
xr.write = function(n, e, t, r, i, s) {
  var o, c, h, f = s * 8 - i - 1, l = (1 << f) - 1, y = l >> 1, p = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, g = r ? 0 : s - 1, b = r ? 1 : -1, A = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
  for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (c = isNaN(e) ? 1 : 0, o = l) : (o = Math.floor(Math.log(e) / Math.LN2), e * (h = Math.pow(2, -o)) < 1 && (o--, h *= 2), o + y >= 1 ? e += p / h : e += p * Math.pow(2, 1 - y), e * h >= 2 && (o++, h /= 2), o + y >= l ? (c = 0, o = l) : o + y >= 1 ? (c = (e * h - 1) * Math.pow(2, i), o = o + y) : (c = e * Math.pow(2, y - 1) * Math.pow(2, i), o = 0)); i >= 8; n[t + g] = c & 255, g += b, c /= 256, i -= 8)
    ;
  for (o = o << i | c, f += i; f > 0; n[t + g] = o & 255, g += b, o /= 256, f -= 8)
    ;
  n[t + g - b] |= A * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(n) {
  const e = Fn, t = xr, r = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  n.Buffer = l, n.SlowBuffer = _, n.INSPECT_MAX_BYTES = 50;
  const i = 2147483647;
  n.kMaxLength = i;
  const { Uint8Array: s, ArrayBuffer: o, SharedArrayBuffer: c } = globalThis;
  l.TYPED_ARRAY_SUPPORT = h(), !l.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function h() {
    try {
      const d = new s(1), a = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(a, s.prototype), Object.setPrototypeOf(d, a), d.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(l.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (l.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(l.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (l.isBuffer(this))
        return this.byteOffset;
    }
  });
  function f(d) {
    if (d > i)
      throw new RangeError('The value "' + d + '" is invalid for option "size"');
    const a = new s(d);
    return Object.setPrototypeOf(a, l.prototype), a;
  }
  function l(d, a, u) {
    if (typeof d == "number") {
      if (typeof a == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return b(d);
    }
    return y(d, a, u);
  }
  l.poolSize = 8192;
  function y(d, a, u) {
    if (typeof d == "string")
      return A(d, a);
    if (o.isView(d))
      return $(d);
    if (d == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof d
      );
    if (Le(d, o) || d && Le(d.buffer, o) || typeof c < "u" && (Le(d, c) || d && Le(d.buffer, c)))
      return B(d, a, u);
    if (typeof d == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const m = d.valueOf && d.valueOf();
    if (m != null && m !== d)
      return l.from(m, a, u);
    const w = T(d);
    if (w) return w;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof d[Symbol.toPrimitive] == "function")
      return l.from(d[Symbol.toPrimitive]("string"), a, u);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof d
    );
  }
  l.from = function(d, a, u) {
    return y(d, a, u);
  }, Object.setPrototypeOf(l.prototype, s.prototype), Object.setPrototypeOf(l, s);
  function p(d) {
    if (typeof d != "number")
      throw new TypeError('"size" argument must be of type number');
    if (d < 0)
      throw new RangeError('The value "' + d + '" is invalid for option "size"');
  }
  function g(d, a, u) {
    return p(d), d <= 0 ? f(d) : a !== void 0 ? typeof u == "string" ? f(d).fill(a, u) : f(d).fill(a) : f(d);
  }
  l.alloc = function(d, a, u) {
    return g(d, a, u);
  };
  function b(d) {
    return p(d), f(d < 0 ? 0 : x(d) | 0);
  }
  l.allocUnsafe = function(d) {
    return b(d);
  }, l.allocUnsafeSlow = function(d) {
    return b(d);
  };
  function A(d, a) {
    if ((typeof a != "string" || a === "") && (a = "utf8"), !l.isEncoding(a))
      throw new TypeError("Unknown encoding: " + a);
    const u = I(d, a) | 0;
    let m = f(u);
    const w = m.write(d, a);
    return w !== u && (m = m.slice(0, w)), m;
  }
  function S(d) {
    const a = d.length < 0 ? 0 : x(d.length) | 0, u = f(a);
    for (let m = 0; m < a; m += 1)
      u[m] = d[m] & 255;
    return u;
  }
  function $(d) {
    if (Le(d, s)) {
      const a = new s(d);
      return B(a.buffer, a.byteOffset, a.byteLength);
    }
    return S(d);
  }
  function B(d, a, u) {
    if (a < 0 || d.byteLength < a)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (d.byteLength < a + (u || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let m;
    return a === void 0 && u === void 0 ? m = new s(d) : u === void 0 ? m = new s(d, a) : m = new s(d, a, u), Object.setPrototypeOf(m, l.prototype), m;
  }
  function T(d) {
    if (l.isBuffer(d)) {
      const a = x(d.length) | 0, u = f(a);
      return u.length === 0 || d.copy(u, 0, 0, a), u;
    }
    if (d.length !== void 0)
      return typeof d.length != "number" || Jn(d.length) ? f(0) : S(d);
    if (d.type === "Buffer" && Array.isArray(d.data))
      return S(d.data);
  }
  function x(d) {
    if (d >= i)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i.toString(16) + " bytes");
    return d | 0;
  }
  function _(d) {
    return +d != d && (d = 0), l.alloc(+d);
  }
  l.isBuffer = function(a) {
    return a != null && a._isBuffer === !0 && a !== l.prototype;
  }, l.compare = function(a, u) {
    if (Le(a, s) && (a = l.from(a, a.offset, a.byteLength)), Le(u, s) && (u = l.from(u, u.offset, u.byteLength)), !l.isBuffer(a) || !l.isBuffer(u))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (a === u) return 0;
    let m = a.length, w = u.length;
    for (let v = 0, E = Math.min(m, w); v < E; ++v)
      if (a[v] !== u[v]) {
        m = a[v], w = u[v];
        break;
      }
    return m < w ? -1 : w < m ? 1 : 0;
  }, l.isEncoding = function(a) {
    switch (String(a).toLowerCase()) {
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
  }, l.concat = function(a, u) {
    if (!Array.isArray(a))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (a.length === 0)
      return l.alloc(0);
    let m;
    if (u === void 0)
      for (u = 0, m = 0; m < a.length; ++m)
        u += a[m].length;
    const w = l.allocUnsafe(u);
    let v = 0;
    for (m = 0; m < a.length; ++m) {
      let E = a[m];
      if (Le(E, s))
        v + E.length > w.length ? (l.isBuffer(E) || (E = l.from(E)), E.copy(w, v)) : s.prototype.set.call(
          w,
          E,
          v
        );
      else if (l.isBuffer(E))
        E.copy(w, v);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      v += E.length;
    }
    return w;
  };
  function I(d, a) {
    if (l.isBuffer(d))
      return d.length;
    if (o.isView(d) || Le(d, o))
      return d.byteLength;
    if (typeof d != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof d
      );
    const u = d.length, m = arguments.length > 2 && arguments[2] === !0;
    if (!m && u === 0) return 0;
    let w = !1;
    for (; ; )
      switch (a) {
        case "ascii":
        case "latin1":
        case "binary":
          return u;
        case "utf8":
        case "utf-8":
          return zn(d).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return u * 2;
        case "hex":
          return u >>> 1;
        case "base64":
          return Mr(d).length;
        default:
          if (w)
            return m ? -1 : zn(d).length;
          a = ("" + a).toLowerCase(), w = !0;
      }
  }
  l.byteLength = I;
  function N(d, a, u) {
    let m = !1;
    if ((a === void 0 || a < 0) && (a = 0), a > this.length || ((u === void 0 || u > this.length) && (u = this.length), u <= 0) || (u >>>= 0, a >>>= 0, u <= a))
      return "";
    for (d || (d = "utf8"); ; )
      switch (d) {
        case "hex":
          return He(this, a, u);
        case "utf8":
        case "utf-8":
          return F(this, a, u);
        case "ascii":
          return ye(this, a, u);
        case "latin1":
        case "binary":
          return j(this, a, u);
        case "base64":
          return X(this, a, u);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return ft(this, a, u);
        default:
          if (m) throw new TypeError("Unknown encoding: " + d);
          d = (d + "").toLowerCase(), m = !0;
      }
  }
  l.prototype._isBuffer = !0;
  function O(d, a, u) {
    const m = d[a];
    d[a] = d[u], d[u] = m;
  }
  l.prototype.swap16 = function() {
    const a = this.length;
    if (a % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let u = 0; u < a; u += 2)
      O(this, u, u + 1);
    return this;
  }, l.prototype.swap32 = function() {
    const a = this.length;
    if (a % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let u = 0; u < a; u += 4)
      O(this, u, u + 3), O(this, u + 1, u + 2);
    return this;
  }, l.prototype.swap64 = function() {
    const a = this.length;
    if (a % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let u = 0; u < a; u += 8)
      O(this, u, u + 7), O(this, u + 1, u + 6), O(this, u + 2, u + 5), O(this, u + 3, u + 4);
    return this;
  }, l.prototype.toString = function() {
    const a = this.length;
    return a === 0 ? "" : arguments.length === 0 ? F(this, 0, a) : N.apply(this, arguments);
  }, l.prototype.toLocaleString = l.prototype.toString, l.prototype.equals = function(a) {
    if (!l.isBuffer(a)) throw new TypeError("Argument must be a Buffer");
    return this === a ? !0 : l.compare(this, a) === 0;
  }, l.prototype.inspect = function() {
    let a = "";
    const u = n.INSPECT_MAX_BYTES;
    return a = this.toString("hex", 0, u).replace(/(.{2})/g, "$1 ").trim(), this.length > u && (a += " ... "), "<Buffer " + a + ">";
  }, r && (l.prototype[r] = l.prototype.inspect), l.prototype.compare = function(a, u, m, w, v) {
    if (Le(a, s) && (a = l.from(a, a.offset, a.byteLength)), !l.isBuffer(a))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof a
      );
    if (u === void 0 && (u = 0), m === void 0 && (m = a ? a.length : 0), w === void 0 && (w = 0), v === void 0 && (v = this.length), u < 0 || m > a.length || w < 0 || v > this.length)
      throw new RangeError("out of range index");
    if (w >= v && u >= m)
      return 0;
    if (w >= v)
      return -1;
    if (u >= m)
      return 1;
    if (u >>>= 0, m >>>= 0, w >>>= 0, v >>>= 0, this === a) return 0;
    let E = v - w, D = m - u;
    const te = Math.min(E, D), Y = this.slice(w, v), ne = a.slice(u, m);
    for (let z = 0; z < te; ++z)
      if (Y[z] !== ne[z]) {
        E = Y[z], D = ne[z];
        break;
      }
    return E < D ? -1 : D < E ? 1 : 0;
  };
  function q(d, a, u, m, w) {
    if (d.length === 0) return -1;
    if (typeof u == "string" ? (m = u, u = 0) : u > 2147483647 ? u = 2147483647 : u < -2147483648 && (u = -2147483648), u = +u, Jn(u) && (u = w ? 0 : d.length - 1), u < 0 && (u = d.length + u), u >= d.length) {
      if (w) return -1;
      u = d.length - 1;
    } else if (u < 0)
      if (w) u = 0;
      else return -1;
    if (typeof a == "string" && (a = l.from(a, m)), l.isBuffer(a))
      return a.length === 0 ? -1 : ee(d, a, u, m, w);
    if (typeof a == "number")
      return a = a & 255, typeof s.prototype.indexOf == "function" ? w ? s.prototype.indexOf.call(d, a, u) : s.prototype.lastIndexOf.call(d, a, u) : ee(d, [a], u, m, w);
    throw new TypeError("val must be string, number or Buffer");
  }
  function ee(d, a, u, m, w) {
    let v = 1, E = d.length, D = a.length;
    if (m !== void 0 && (m = String(m).toLowerCase(), m === "ucs2" || m === "ucs-2" || m === "utf16le" || m === "utf-16le")) {
      if (d.length < 2 || a.length < 2)
        return -1;
      v = 2, E /= 2, D /= 2, u /= 2;
    }
    function te(ne, z) {
      return v === 1 ? ne[z] : ne.readUInt16BE(z * v);
    }
    let Y;
    if (w) {
      let ne = -1;
      for (Y = u; Y < E; Y++)
        if (te(d, Y) === te(a, ne === -1 ? 0 : Y - ne)) {
          if (ne === -1 && (ne = Y), Y - ne + 1 === D) return ne * v;
        } else
          ne !== -1 && (Y -= Y - ne), ne = -1;
    } else
      for (u + D > E && (u = E - D), Y = u; Y >= 0; Y--) {
        let ne = !0;
        for (let z = 0; z < D; z++)
          if (te(d, Y + z) !== te(a, z)) {
            ne = !1;
            break;
          }
        if (ne) return Y;
      }
    return -1;
  }
  l.prototype.includes = function(a, u, m) {
    return this.indexOf(a, u, m) !== -1;
  }, l.prototype.indexOf = function(a, u, m) {
    return q(this, a, u, m, !0);
  }, l.prototype.lastIndexOf = function(a, u, m) {
    return q(this, a, u, m, !1);
  };
  function Q(d, a, u, m) {
    u = Number(u) || 0;
    const w = d.length - u;
    m ? (m = Number(m), m > w && (m = w)) : m = w;
    const v = a.length;
    m > v / 2 && (m = v / 2);
    let E;
    for (E = 0; E < m; ++E) {
      const D = parseInt(a.substr(E * 2, 2), 16);
      if (Jn(D)) return E;
      d[u + E] = D;
    }
    return E;
  }
  function pe(d, a, u, m) {
    return ln(zn(a, d.length - u), d, u, m);
  }
  function Te(d, a, u, m) {
    return ln($s(a), d, u, m);
  }
  function Re(d, a, u, m) {
    return ln(Mr(a), d, u, m);
  }
  function U(d, a, u, m) {
    return ln(Ts(a, d.length - u), d, u, m);
  }
  l.prototype.write = function(a, u, m, w) {
    if (u === void 0)
      w = "utf8", m = this.length, u = 0;
    else if (m === void 0 && typeof u == "string")
      w = u, m = this.length, u = 0;
    else if (isFinite(u))
      u = u >>> 0, isFinite(m) ? (m = m >>> 0, w === void 0 && (w = "utf8")) : (w = m, m = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const v = this.length - u;
    if ((m === void 0 || m > v) && (m = v), a.length > 0 && (m < 0 || u < 0) || u > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    w || (w = "utf8");
    let E = !1;
    for (; ; )
      switch (w) {
        case "hex":
          return Q(this, a, u, m);
        case "utf8":
        case "utf-8":
          return pe(this, a, u, m);
        case "ascii":
        case "latin1":
        case "binary":
          return Te(this, a, u, m);
        case "base64":
          return Re(this, a, u, m);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return U(this, a, u, m);
        default:
          if (E) throw new TypeError("Unknown encoding: " + w);
          w = ("" + w).toLowerCase(), E = !0;
      }
  }, l.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function X(d, a, u) {
    return a === 0 && u === d.length ? e.fromByteArray(d) : e.fromByteArray(d.slice(a, u));
  }
  function F(d, a, u) {
    u = Math.min(d.length, u);
    const m = [];
    let w = a;
    for (; w < u; ) {
      const v = d[w];
      let E = null, D = v > 239 ? 4 : v > 223 ? 3 : v > 191 ? 2 : 1;
      if (w + D <= u) {
        let te, Y, ne, z;
        switch (D) {
          case 1:
            v < 128 && (E = v);
            break;
          case 2:
            te = d[w + 1], (te & 192) === 128 && (z = (v & 31) << 6 | te & 63, z > 127 && (E = z));
            break;
          case 3:
            te = d[w + 1], Y = d[w + 2], (te & 192) === 128 && (Y & 192) === 128 && (z = (v & 15) << 12 | (te & 63) << 6 | Y & 63, z > 2047 && (z < 55296 || z > 57343) && (E = z));
            break;
          case 4:
            te = d[w + 1], Y = d[w + 2], ne = d[w + 3], (te & 192) === 128 && (Y & 192) === 128 && (ne & 192) === 128 && (z = (v & 15) << 18 | (te & 63) << 12 | (Y & 63) << 6 | ne & 63, z > 65535 && z < 1114112 && (E = z));
        }
      }
      E === null ? (E = 65533, D = 1) : E > 65535 && (E -= 65536, m.push(E >>> 10 & 1023 | 55296), E = 56320 | E & 1023), m.push(E), w += D;
    }
    return G(m);
  }
  const K = 4096;
  function G(d) {
    const a = d.length;
    if (a <= K)
      return String.fromCharCode.apply(String, d);
    let u = "", m = 0;
    for (; m < a; )
      u += String.fromCharCode.apply(
        String,
        d.slice(m, m += K)
      );
    return u;
  }
  function ye(d, a, u) {
    let m = "";
    u = Math.min(d.length, u);
    for (let w = a; w < u; ++w)
      m += String.fromCharCode(d[w] & 127);
    return m;
  }
  function j(d, a, u) {
    let m = "";
    u = Math.min(d.length, u);
    for (let w = a; w < u; ++w)
      m += String.fromCharCode(d[w]);
    return m;
  }
  function He(d, a, u) {
    const m = d.length;
    (!a || a < 0) && (a = 0), (!u || u < 0 || u > m) && (u = m);
    let w = "";
    for (let v = a; v < u; ++v)
      w += Bs[d[v]];
    return w;
  }
  function ft(d, a, u) {
    const m = d.slice(a, u);
    let w = "";
    for (let v = 0; v < m.length - 1; v += 2)
      w += String.fromCharCode(m[v] + m[v + 1] * 256);
    return w;
  }
  l.prototype.slice = function(a, u) {
    const m = this.length;
    a = ~~a, u = u === void 0 ? m : ~~u, a < 0 ? (a += m, a < 0 && (a = 0)) : a > m && (a = m), u < 0 ? (u += m, u < 0 && (u = 0)) : u > m && (u = m), u < a && (u = a);
    const w = this.subarray(a, u);
    return Object.setPrototypeOf(w, l.prototype), w;
  };
  function Z(d, a, u) {
    if (d % 1 !== 0 || d < 0) throw new RangeError("offset is not uint");
    if (d + a > u) throw new RangeError("Trying to access beyond buffer length");
  }
  l.prototype.readUintLE = l.prototype.readUIntLE = function(a, u, m) {
    a = a >>> 0, u = u >>> 0, m || Z(a, u, this.length);
    let w = this[a], v = 1, E = 0;
    for (; ++E < u && (v *= 256); )
      w += this[a + E] * v;
    return w;
  }, l.prototype.readUintBE = l.prototype.readUIntBE = function(a, u, m) {
    a = a >>> 0, u = u >>> 0, m || Z(a, u, this.length);
    let w = this[a + --u], v = 1;
    for (; u > 0 && (v *= 256); )
      w += this[a + --u] * v;
    return w;
  }, l.prototype.readUint8 = l.prototype.readUInt8 = function(a, u) {
    return a = a >>> 0, u || Z(a, 1, this.length), this[a];
  }, l.prototype.readUint16LE = l.prototype.readUInt16LE = function(a, u) {
    return a = a >>> 0, u || Z(a, 2, this.length), this[a] | this[a + 1] << 8;
  }, l.prototype.readUint16BE = l.prototype.readUInt16BE = function(a, u) {
    return a = a >>> 0, u || Z(a, 2, this.length), this[a] << 8 | this[a + 1];
  }, l.prototype.readUint32LE = l.prototype.readUInt32LE = function(a, u) {
    return a = a >>> 0, u || Z(a, 4, this.length), (this[a] | this[a + 1] << 8 | this[a + 2] << 16) + this[a + 3] * 16777216;
  }, l.prototype.readUint32BE = l.prototype.readUInt32BE = function(a, u) {
    return a = a >>> 0, u || Z(a, 4, this.length), this[a] * 16777216 + (this[a + 1] << 16 | this[a + 2] << 8 | this[a + 3]);
  }, l.prototype.readBigUInt64LE = nt(function(a) {
    a = a >>> 0, St(a, "offset");
    const u = this[a], m = this[a + 7];
    (u === void 0 || m === void 0) && Ut(a, this.length - 8);
    const w = u + this[++a] * 2 ** 8 + this[++a] * 2 ** 16 + this[++a] * 2 ** 24, v = this[++a] + this[++a] * 2 ** 8 + this[++a] * 2 ** 16 + m * 2 ** 24;
    return BigInt(w) + (BigInt(v) << BigInt(32));
  }), l.prototype.readBigUInt64BE = nt(function(a) {
    a = a >>> 0, St(a, "offset");
    const u = this[a], m = this[a + 7];
    (u === void 0 || m === void 0) && Ut(a, this.length - 8);
    const w = u * 2 ** 24 + this[++a] * 2 ** 16 + this[++a] * 2 ** 8 + this[++a], v = this[++a] * 2 ** 24 + this[++a] * 2 ** 16 + this[++a] * 2 ** 8 + m;
    return (BigInt(w) << BigInt(32)) + BigInt(v);
  }), l.prototype.readIntLE = function(a, u, m) {
    a = a >>> 0, u = u >>> 0, m || Z(a, u, this.length);
    let w = this[a], v = 1, E = 0;
    for (; ++E < u && (v *= 256); )
      w += this[a + E] * v;
    return v *= 128, w >= v && (w -= Math.pow(2, 8 * u)), w;
  }, l.prototype.readIntBE = function(a, u, m) {
    a = a >>> 0, u = u >>> 0, m || Z(a, u, this.length);
    let w = u, v = 1, E = this[a + --w];
    for (; w > 0 && (v *= 256); )
      E += this[a + --w] * v;
    return v *= 128, E >= v && (E -= Math.pow(2, 8 * u)), E;
  }, l.prototype.readInt8 = function(a, u) {
    return a = a >>> 0, u || Z(a, 1, this.length), this[a] & 128 ? (255 - this[a] + 1) * -1 : this[a];
  }, l.prototype.readInt16LE = function(a, u) {
    a = a >>> 0, u || Z(a, 2, this.length);
    const m = this[a] | this[a + 1] << 8;
    return m & 32768 ? m | 4294901760 : m;
  }, l.prototype.readInt16BE = function(a, u) {
    a = a >>> 0, u || Z(a, 2, this.length);
    const m = this[a + 1] | this[a] << 8;
    return m & 32768 ? m | 4294901760 : m;
  }, l.prototype.readInt32LE = function(a, u) {
    return a = a >>> 0, u || Z(a, 4, this.length), this[a] | this[a + 1] << 8 | this[a + 2] << 16 | this[a + 3] << 24;
  }, l.prototype.readInt32BE = function(a, u) {
    return a = a >>> 0, u || Z(a, 4, this.length), this[a] << 24 | this[a + 1] << 16 | this[a + 2] << 8 | this[a + 3];
  }, l.prototype.readBigInt64LE = nt(function(a) {
    a = a >>> 0, St(a, "offset");
    const u = this[a], m = this[a + 7];
    (u === void 0 || m === void 0) && Ut(a, this.length - 8);
    const w = this[a + 4] + this[a + 5] * 2 ** 8 + this[a + 6] * 2 ** 16 + (m << 24);
    return (BigInt(w) << BigInt(32)) + BigInt(u + this[++a] * 2 ** 8 + this[++a] * 2 ** 16 + this[++a] * 2 ** 24);
  }), l.prototype.readBigInt64BE = nt(function(a) {
    a = a >>> 0, St(a, "offset");
    const u = this[a], m = this[a + 7];
    (u === void 0 || m === void 0) && Ut(a, this.length - 8);
    const w = (u << 24) + // Overflow
    this[++a] * 2 ** 16 + this[++a] * 2 ** 8 + this[++a];
    return (BigInt(w) << BigInt(32)) + BigInt(this[++a] * 2 ** 24 + this[++a] * 2 ** 16 + this[++a] * 2 ** 8 + m);
  }), l.prototype.readFloatLE = function(a, u) {
    return a = a >>> 0, u || Z(a, 4, this.length), t.read(this, a, !0, 23, 4);
  }, l.prototype.readFloatBE = function(a, u) {
    return a = a >>> 0, u || Z(a, 4, this.length), t.read(this, a, !1, 23, 4);
  }, l.prototype.readDoubleLE = function(a, u) {
    return a = a >>> 0, u || Z(a, 8, this.length), t.read(this, a, !0, 52, 8);
  }, l.prototype.readDoubleBE = function(a, u) {
    return a = a >>> 0, u || Z(a, 8, this.length), t.read(this, a, !1, 52, 8);
  };
  function re(d, a, u, m, w, v) {
    if (!l.isBuffer(d)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (a > w || a < v) throw new RangeError('"value" argument is out of bounds');
    if (u + m > d.length) throw new RangeError("Index out of range");
  }
  l.prototype.writeUintLE = l.prototype.writeUIntLE = function(a, u, m, w) {
    if (a = +a, u = u >>> 0, m = m >>> 0, !w) {
      const D = Math.pow(2, 8 * m) - 1;
      re(this, a, u, m, D, 0);
    }
    let v = 1, E = 0;
    for (this[u] = a & 255; ++E < m && (v *= 256); )
      this[u + E] = a / v & 255;
    return u + m;
  }, l.prototype.writeUintBE = l.prototype.writeUIntBE = function(a, u, m, w) {
    if (a = +a, u = u >>> 0, m = m >>> 0, !w) {
      const D = Math.pow(2, 8 * m) - 1;
      re(this, a, u, m, D, 0);
    }
    let v = m - 1, E = 1;
    for (this[u + v] = a & 255; --v >= 0 && (E *= 256); )
      this[u + v] = a / E & 255;
    return u + m;
  }, l.prototype.writeUint8 = l.prototype.writeUInt8 = function(a, u, m) {
    return a = +a, u = u >>> 0, m || re(this, a, u, 1, 255, 0), this[u] = a & 255, u + 1;
  }, l.prototype.writeUint16LE = l.prototype.writeUInt16LE = function(a, u, m) {
    return a = +a, u = u >>> 0, m || re(this, a, u, 2, 65535, 0), this[u] = a & 255, this[u + 1] = a >>> 8, u + 2;
  }, l.prototype.writeUint16BE = l.prototype.writeUInt16BE = function(a, u, m) {
    return a = +a, u = u >>> 0, m || re(this, a, u, 2, 65535, 0), this[u] = a >>> 8, this[u + 1] = a & 255, u + 2;
  }, l.prototype.writeUint32LE = l.prototype.writeUInt32LE = function(a, u, m) {
    return a = +a, u = u >>> 0, m || re(this, a, u, 4, 4294967295, 0), this[u + 3] = a >>> 24, this[u + 2] = a >>> 16, this[u + 1] = a >>> 8, this[u] = a & 255, u + 4;
  }, l.prototype.writeUint32BE = l.prototype.writeUInt32BE = function(a, u, m) {
    return a = +a, u = u >>> 0, m || re(this, a, u, 4, 4294967295, 0), this[u] = a >>> 24, this[u + 1] = a >>> 16, this[u + 2] = a >>> 8, this[u + 3] = a & 255, u + 4;
  };
  function ce(d, a, u, m, w) {
    Cr(a, m, w, d, u, 7);
    let v = Number(a & BigInt(4294967295));
    d[u++] = v, v = v >> 8, d[u++] = v, v = v >> 8, d[u++] = v, v = v >> 8, d[u++] = v;
    let E = Number(a >> BigInt(32) & BigInt(4294967295));
    return d[u++] = E, E = E >> 8, d[u++] = E, E = E >> 8, d[u++] = E, E = E >> 8, d[u++] = E, u;
  }
  function ae(d, a, u, m, w) {
    Cr(a, m, w, d, u, 7);
    let v = Number(a & BigInt(4294967295));
    d[u + 7] = v, v = v >> 8, d[u + 6] = v, v = v >> 8, d[u + 5] = v, v = v >> 8, d[u + 4] = v;
    let E = Number(a >> BigInt(32) & BigInt(4294967295));
    return d[u + 3] = E, E = E >> 8, d[u + 2] = E, E = E >> 8, d[u + 1] = E, E = E >> 8, d[u] = E, u + 8;
  }
  l.prototype.writeBigUInt64LE = nt(function(a, u = 0) {
    return ce(this, a, u, BigInt(0), BigInt("0xffffffffffffffff"));
  }), l.prototype.writeBigUInt64BE = nt(function(a, u = 0) {
    return ae(this, a, u, BigInt(0), BigInt("0xffffffffffffffff"));
  }), l.prototype.writeIntLE = function(a, u, m, w) {
    if (a = +a, u = u >>> 0, !w) {
      const te = Math.pow(2, 8 * m - 1);
      re(this, a, u, m, te - 1, -te);
    }
    let v = 0, E = 1, D = 0;
    for (this[u] = a & 255; ++v < m && (E *= 256); )
      a < 0 && D === 0 && this[u + v - 1] !== 0 && (D = 1), this[u + v] = (a / E >> 0) - D & 255;
    return u + m;
  }, l.prototype.writeIntBE = function(a, u, m, w) {
    if (a = +a, u = u >>> 0, !w) {
      const te = Math.pow(2, 8 * m - 1);
      re(this, a, u, m, te - 1, -te);
    }
    let v = m - 1, E = 1, D = 0;
    for (this[u + v] = a & 255; --v >= 0 && (E *= 256); )
      a < 0 && D === 0 && this[u + v + 1] !== 0 && (D = 1), this[u + v] = (a / E >> 0) - D & 255;
    return u + m;
  }, l.prototype.writeInt8 = function(a, u, m) {
    return a = +a, u = u >>> 0, m || re(this, a, u, 1, 127, -128), a < 0 && (a = 255 + a + 1), this[u] = a & 255, u + 1;
  }, l.prototype.writeInt16LE = function(a, u, m) {
    return a = +a, u = u >>> 0, m || re(this, a, u, 2, 32767, -32768), this[u] = a & 255, this[u + 1] = a >>> 8, u + 2;
  }, l.prototype.writeInt16BE = function(a, u, m) {
    return a = +a, u = u >>> 0, m || re(this, a, u, 2, 32767, -32768), this[u] = a >>> 8, this[u + 1] = a & 255, u + 2;
  }, l.prototype.writeInt32LE = function(a, u, m) {
    return a = +a, u = u >>> 0, m || re(this, a, u, 4, 2147483647, -2147483648), this[u] = a & 255, this[u + 1] = a >>> 8, this[u + 2] = a >>> 16, this[u + 3] = a >>> 24, u + 4;
  }, l.prototype.writeInt32BE = function(a, u, m) {
    return a = +a, u = u >>> 0, m || re(this, a, u, 4, 2147483647, -2147483648), a < 0 && (a = 4294967295 + a + 1), this[u] = a >>> 24, this[u + 1] = a >>> 16, this[u + 2] = a >>> 8, this[u + 3] = a & 255, u + 4;
  }, l.prototype.writeBigInt64LE = nt(function(a, u = 0) {
    return ce(this, a, u, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), l.prototype.writeBigInt64BE = nt(function(a, u = 0) {
    return ae(this, a, u, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function Qn(d, a, u, m, w, v) {
    if (u + m > d.length) throw new RangeError("Index out of range");
    if (u < 0) throw new RangeError("Index out of range");
  }
  function un(d, a, u, m, w) {
    return a = +a, u = u >>> 0, w || Qn(d, a, u, 4), t.write(d, a, u, m, 23, 4), u + 4;
  }
  l.prototype.writeFloatLE = function(a, u, m) {
    return un(this, a, u, !0, m);
  }, l.prototype.writeFloatBE = function(a, u, m) {
    return un(this, a, u, !1, m);
  };
  function Tr(d, a, u, m, w) {
    return a = +a, u = u >>> 0, w || Qn(d, a, u, 8), t.write(d, a, u, m, 52, 8), u + 8;
  }
  l.prototype.writeDoubleLE = function(a, u, m) {
    return Tr(this, a, u, !0, m);
  }, l.prototype.writeDoubleBE = function(a, u, m) {
    return Tr(this, a, u, !1, m);
  }, l.prototype.copy = function(a, u, m, w) {
    if (!l.isBuffer(a)) throw new TypeError("argument should be a Buffer");
    if (m || (m = 0), !w && w !== 0 && (w = this.length), u >= a.length && (u = a.length), u || (u = 0), w > 0 && w < m && (w = m), w === m || a.length === 0 || this.length === 0) return 0;
    if (u < 0)
      throw new RangeError("targetStart out of bounds");
    if (m < 0 || m >= this.length) throw new RangeError("Index out of range");
    if (w < 0) throw new RangeError("sourceEnd out of bounds");
    w > this.length && (w = this.length), a.length - u < w - m && (w = a.length - u + m);
    const v = w - m;
    return this === a && typeof s.prototype.copyWithin == "function" ? this.copyWithin(u, m, w) : s.prototype.set.call(
      a,
      this.subarray(m, w),
      u
    ), v;
  }, l.prototype.fill = function(a, u, m, w) {
    if (typeof a == "string") {
      if (typeof u == "string" ? (w = u, u = 0, m = this.length) : typeof m == "string" && (w = m, m = this.length), w !== void 0 && typeof w != "string")
        throw new TypeError("encoding must be a string");
      if (typeof w == "string" && !l.isEncoding(w))
        throw new TypeError("Unknown encoding: " + w);
      if (a.length === 1) {
        const E = a.charCodeAt(0);
        (w === "utf8" && E < 128 || w === "latin1") && (a = E);
      }
    } else typeof a == "number" ? a = a & 255 : typeof a == "boolean" && (a = Number(a));
    if (u < 0 || this.length < u || this.length < m)
      throw new RangeError("Out of range index");
    if (m <= u)
      return this;
    u = u >>> 0, m = m === void 0 ? this.length : m >>> 0, a || (a = 0);
    let v;
    if (typeof a == "number")
      for (v = u; v < m; ++v)
        this[v] = a;
    else {
      const E = l.isBuffer(a) ? a : l.from(a, w), D = E.length;
      if (D === 0)
        throw new TypeError('The value "' + a + '" is invalid for argument "value"');
      for (v = 0; v < m - u; ++v)
        this[v + u] = E[v % D];
    }
    return this;
  };
  const vt = {};
  function Gn(d, a, u) {
    vt[d] = class extends u {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: a.apply(this, arguments),
          writable: !0,
          configurable: !0
        }), this.name = `${this.name} [${d}]`, this.stack, delete this.name;
      }
      get code() {
        return d;
      }
      set code(w) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: w,
          writable: !0
        });
      }
      toString() {
        return `${this.name} [${d}]: ${this.message}`;
      }
    };
  }
  Gn(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(d) {
      return d ? `${d} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), Gn(
    "ERR_INVALID_ARG_TYPE",
    function(d, a) {
      return `The "${d}" argument must be of type number. Received type ${typeof a}`;
    },
    TypeError
  ), Gn(
    "ERR_OUT_OF_RANGE",
    function(d, a, u) {
      let m = `The value of "${d}" is out of range.`, w = u;
      return Number.isInteger(u) && Math.abs(u) > 2 ** 32 ? w = Br(String(u)) : typeof u == "bigint" && (w = String(u), (u > BigInt(2) ** BigInt(32) || u < -(BigInt(2) ** BigInt(32))) && (w = Br(w)), w += "n"), m += ` It must be ${a}. Received ${w}`, m;
    },
    RangeError
  );
  function Br(d) {
    let a = "", u = d.length;
    const m = d[0] === "-" ? 1 : 0;
    for (; u >= m + 4; u -= 3)
      a = `_${d.slice(u - 3, u)}${a}`;
    return `${d.slice(0, u)}${a}`;
  }
  function Is(d, a, u) {
    St(a, "offset"), (d[a] === void 0 || d[a + u] === void 0) && Ut(a, d.length - (u + 1));
  }
  function Cr(d, a, u, m, w, v) {
    if (d > u || d < a) {
      const E = typeof a == "bigint" ? "n" : "";
      let D;
      throw a === 0 || a === BigInt(0) ? D = `>= 0${E} and < 2${E} ** ${(v + 1) * 8}${E}` : D = `>= -(2${E} ** ${(v + 1) * 8 - 1}${E}) and < 2 ** ${(v + 1) * 8 - 1}${E}`, new vt.ERR_OUT_OF_RANGE("value", D, d);
    }
    Is(m, w, v);
  }
  function St(d, a) {
    if (typeof d != "number")
      throw new vt.ERR_INVALID_ARG_TYPE(a, "number", d);
  }
  function Ut(d, a, u) {
    throw Math.floor(d) !== d ? (St(d, u), new vt.ERR_OUT_OF_RANGE("offset", "an integer", d)) : a < 0 ? new vt.ERR_BUFFER_OUT_OF_BOUNDS() : new vt.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${a}`,
      d
    );
  }
  const Es = /[^+/0-9A-Za-z-_]/g;
  function _s(d) {
    if (d = d.split("=")[0], d = d.trim().replace(Es, ""), d.length < 2) return "";
    for (; d.length % 4 !== 0; )
      d = d + "=";
    return d;
  }
  function zn(d, a) {
    a = a || 1 / 0;
    let u;
    const m = d.length;
    let w = null;
    const v = [];
    for (let E = 0; E < m; ++E) {
      if (u = d.charCodeAt(E), u > 55295 && u < 57344) {
        if (!w) {
          if (u > 56319) {
            (a -= 3) > -1 && v.push(239, 191, 189);
            continue;
          } else if (E + 1 === m) {
            (a -= 3) > -1 && v.push(239, 191, 189);
            continue;
          }
          w = u;
          continue;
        }
        if (u < 56320) {
          (a -= 3) > -1 && v.push(239, 191, 189), w = u;
          continue;
        }
        u = (w - 55296 << 10 | u - 56320) + 65536;
      } else w && (a -= 3) > -1 && v.push(239, 191, 189);
      if (w = null, u < 128) {
        if ((a -= 1) < 0) break;
        v.push(u);
      } else if (u < 2048) {
        if ((a -= 2) < 0) break;
        v.push(
          u >> 6 | 192,
          u & 63 | 128
        );
      } else if (u < 65536) {
        if ((a -= 3) < 0) break;
        v.push(
          u >> 12 | 224,
          u >> 6 & 63 | 128,
          u & 63 | 128
        );
      } else if (u < 1114112) {
        if ((a -= 4) < 0) break;
        v.push(
          u >> 18 | 240,
          u >> 12 & 63 | 128,
          u >> 6 & 63 | 128,
          u & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return v;
  }
  function $s(d) {
    const a = [];
    for (let u = 0; u < d.length; ++u)
      a.push(d.charCodeAt(u) & 255);
    return a;
  }
  function Ts(d, a) {
    let u, m, w;
    const v = [];
    for (let E = 0; E < d.length && !((a -= 2) < 0); ++E)
      u = d.charCodeAt(E), m = u >> 8, w = u % 256, v.push(w), v.push(m);
    return v;
  }
  function Mr(d) {
    return e.toByteArray(_s(d));
  }
  function ln(d, a, u, m) {
    let w;
    for (w = 0; w < m && !(w + u >= a.length || w >= d.length); ++w)
      a[w + u] = d[w];
    return w;
  }
  function Le(d, a) {
    return d instanceof a || d != null && d.constructor != null && d.constructor.name != null && d.constructor.name === a.name;
  }
  function Jn(d) {
    return d !== d;
  }
  const Bs = function() {
    const d = "0123456789abcdef", a = new Array(256);
    for (let u = 0; u < 16; ++u) {
      const m = u * 16;
      for (let w = 0; w < 16; ++w)
        a[m + w] = d[u] + d[w];
    }
    return a;
  }();
  function nt(d) {
    return typeof BigInt > "u" ? Cs : d;
  }
  function Cs() {
    throw new Error("BigInt not supported");
  }
})(qi);
const Di = qi.Buffer, Qt = globalThis || void 0 || self;
typeof self > "u" && (Qt.self = Qt);
class Ki {
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
    const r = (h, f) => {
      const l = f ? ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"] : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
      return l[Math.floor(h / 16)] + l[h % 16];
    }, i = Object.assign(
      {
        grouping: 0,
        rowlength: 0,
        uppercase: !1
      },
      t || {}
    );
    let s = "", o = 0, c = 0;
    for (let h = 0; h < e.length && (s += r(e[h], i.uppercase), h !== e.length - 1); ++h)
      i.grouping > 0 && ++o === i.grouping && (o = 0, i.rowlength > 0 && ++c === i.rowlength ? (c = 0, s += `
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
      const o = t[s], c = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"].indexOf(o);
      if (c === -1)
        throw Error("unexpected character");
      i === -1 ? i = 16 * c : (r[Math.floor(s / 2)] = i + c, i = -1);
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
function vn(n, e) {
  const t = Math.ceil(n.length / e), r = [];
  for (let i = 0, s = 0; i < t; ++i, s += e)
    r[i] = n.substr(s, e);
  return r;
}
function kr(n = 256, e = "abcdef0123456789") {
  let t = new Uint8Array(n);
  return t = crypto.getRandomValues(t), t = t.map((r) => e.charCodeAt(r % e.length)), String.fromCharCode.apply(null, t);
}
function ao(n, e, t, r, i) {
  if (r = r || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~`!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?¿¡", i = i || r, e > r.length || t > i.length)
    return console.warn("Strings::charsetBaseConvert() - Can't convert", n, "to base", t, "greater than symbol table length. src-table:", r.length, "dest-table:", i.length), !1;
  let o = BigInt(0);
  for (let h = 0; h < n.length; h++)
    o = o * BigInt(e) + BigInt(r.indexOf(n.charAt(h)));
  let c = "";
  for (; o > 0; ) {
    const h = o % BigInt(t);
    c = i.charAt(Number(h)) + c, o /= BigInt(t);
  }
  return c || "0";
}
function Wl(n) {
  return Ki.toHex(n, {});
}
function jl(n) {
  return Ki.toUint8Array(n);
}
function uo(n) {
  return Di.from(n, "hex").toString("base64");
}
function lo(n) {
  return Di.from(n, "base64").toString("hex");
}
function co(n) {
  return /^[A-F0-9]+$/i.test(n);
}
function ho(n) {
  return (typeof n == "number" || typeof n == "string" && n.trim() !== "") && !isNaN(n);
}
let Sn = class {
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
function Wi(n, e) {
  let t, r, i;
  const s = [Array, Date, Number, String, Boolean], o = Object.prototype.toString;
  for (e = e || [], t = 0; t < e.length; t += 2)
    n === e[t] && (r = e[t + 1]);
  if (!r && n && typeof n == "object") {
    for (r = {}, t = 0; t < s.length; t++)
      o.call(n) === o.call(i = new s[t](n)) && (r = t ? i : []);
    e.push(n, r);
    for (t in n)
      e.hasOwnProperty.call(n, t) && (r[t] = Wi(n[t], e));
  }
  return r || n;
}
function fo(...n) {
  return [].concat(...n.map((e, t) => {
    const r = n.slice(0);
    r.splice(t, 1);
    const i = [...new Set([].concat(...r))];
    return e.filter((s) => !i.includes(s));
  }));
}
function Ht(...n) {
  return n.reduce((e, t) => e.filter((r) => t.includes(r)));
}
class vr {
  /**
   *
   * @param policy
   * @param metaKeys
   */
  constructor(e = {}, t = {}) {
    this.policy = vr.normalizePolicy(e), this.fillDefault(t);
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
      const o = s.map((c) => c.key);
      this.policy[i] || (this.policy[i] = {});
      for (const c of fo(e, o))
        this.policy[i][c] || (this.policy[i][c] = i === "write" && !["characters", "pubkey"].includes(c) ? ["self"] : ["all"]);
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
class Ee {
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
    const t = new vr(e, Object.keys(this.meta));
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
class J extends TypeError {
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
class bt extends J {
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
class gt {
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
          t.push(gt.isStructure(e[r]) ? gt.structure(e[r]) : e[r]);
        return t;
      }
      case "[object Object]": {
        const t = [], r = Object.keys(e).sort((i, s) => i === s ? 0 : i < s ? -1 : 1);
        for (const i of r)
          if (Object.prototype.hasOwnProperty.call(e, i)) {
            const s = {};
            s[i] = gt.isStructure(e[i]) ? gt.structure(e[i]) : e[i], t.push(s);
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
    return gt.structure(this);
  }
}
class po extends gt {
  constructor({
    position: e = null,
    walletAddress: t = null,
    isotope: r = null,
    token: i = null,
    value: s = null,
    batchId: o = null,
    metaType: c = null,
    metaId: h = null,
    meta: f = null,
    index: l = null,
    createdAt: y = null,
    version: p = null
  }) {
    super(), this.position = e, this.walletAddress = t, this.isotope = r, this.token = i, this.value = s, this.batchId = o, this.metaType = c, this.metaId = h, this.meta = f, this.index = l, this.createdAt = y, this.version = p;
  }
}
const mn = {
  4: po
};
class P {
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
    metaType: c = null,
    metaId: h = null,
    meta: f = null,
    otsFragment: l = null,
    index: y = null,
    version: p = null
  }) {
    this.position = e, this.walletAddress = t, this.isotope = r, this.token = i, this.value = s !== null ? String(s) : null, this.batchId = o, this.metaType = c, this.metaId = h, this.meta = f ? Sn.normalizeMeta(f) : [], this.index = y, this.otsFragment = l, this.createdAt = String(+/* @__PURE__ */ new Date()), p !== null && Object.prototype.hasOwnProperty.call(mn, p) && (this.version = String(p));
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
    batchId: c = null
  }) {
    return o || (o = new Ee()), o instanceof Ee || (o = new Ee(o)), t && (o.setAtomWallet(t), c || (c = t.batchId)), new P({
      position: t ? t.position : null,
      walletAddress: t ? t.address : null,
      isotope: e,
      token: t ? t.token : null,
      value: r,
      batchId: c,
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
    const t = Object.assign(new P({}), JSON.parse(e)), r = Object.keys(new P({}));
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
    const r = new Ne("SHAKE256", "TEXT"), i = P.sortAtoms(e);
    if (i.length === 0)
      throw new bt();
    if (i.map((s) => {
      if (!(s instanceof P))
        throw new bt();
      return s;
    }), i.every((s) => s.version && Object.prototype.hasOwnProperty.call(mn, s.version)))
      r.update(JSON.stringify(i.map((s) => mn[s.version].create(s).view())));
    else {
      const s = String(e.length);
      let o = [];
      for (const c of i)
        o.push(s), o = o.concat(c.getHashableValues());
      for (const c of o)
        r.update(c);
    }
    switch (t) {
      case "hex":
        return r.getHash("HEX", { outputLen: 256 });
      case "array":
        return r.getHash("ARRAYBUFFER", { outputLen: 256 });
      default:
        return ao(r.getHash("HEX", { outputLen: 256 }), 16, 17, "0123456789abcdef", "0123456789abcdefg").padStart(64, "0");
    }
  }
  static jsonSerialization(e, t) {
    if (!P.getUnclaimedProps().includes(e))
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
    return Sn.aggregateMeta(this.meta);
  }
  /**
   *
   * @returns {*[]}
   */
  getHashableValues() {
    const e = [];
    for (const t of P.getHashableProps()) {
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
function fr(n = null, e = 2048) {
  if (n) {
    const t = new Ne("SHAKE256", "TEXT");
    return t.update(n), t.getHash("HEX", { outputLen: e * 2 });
  } else
    return kr(e);
}
function Ct(n, e = null) {
  const t = new Ne("SHAKE256", "TEXT");
  return t.update(n), t.getHash("HEX", { outputLen: 256 });
}
function An({
  molecularHash: n = null,
  index: e = null
}) {
  return n !== null && e !== null ? Ct(String(n) + String(e), "generateBatchId") : kr(64);
}
class Xt {
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
    return t.length && (t = JSON.parse(t), t || (t = {})), new Xt(
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
    return new Xt(
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
class yo extends J {
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
function Kr(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error("positive integer expected, got " + n);
}
function mo(n) {
  return n instanceof Uint8Array || ArrayBuffer.isView(n) && n.constructor.name === "Uint8Array";
}
function Hn(n, ...e) {
  if (!mo(n))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(n.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + n.length);
}
function In(n, e = !0) {
  if (n.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && n.finished)
    throw new Error("Hash#digest() has already been called");
}
function ji(n, e) {
  Hn(n);
  const t = e.outputLen;
  if (n.length < t)
    throw new Error("digestInto() expects output buffer of length at least " + t);
}
const hn = /* @__PURE__ */ BigInt(2 ** 32 - 1), dr = /* @__PURE__ */ BigInt(32);
function Vi(n, e = !1) {
  return e ? { h: Number(n & hn), l: Number(n >> dr & hn) } : { h: Number(n >> dr & hn) | 0, l: Number(n & hn) | 0 };
}
function Qi(n, e = !1) {
  let t = new Uint32Array(n.length), r = new Uint32Array(n.length);
  for (let i = 0; i < n.length; i++) {
    const { h: s, l: o } = Vi(n[i], e);
    [t[i], r[i]] = [s, o];
  }
  return [t, r];
}
const go = (n, e) => BigInt(n >>> 0) << dr | BigInt(e >>> 0), wo = (n, e, t) => n >>> t, bo = (n, e, t) => n << 32 - t | e >>> t, xo = (n, e, t) => n >>> t | e << 32 - t, ko = (n, e, t) => n << 32 - t | e >>> t, vo = (n, e, t) => n << 64 - t | e >>> t - 32, So = (n, e, t) => n >>> t - 32 | e << 64 - t, Ao = (n, e) => e, Io = (n, e) => n, Gi = (n, e, t) => n << t | e >>> 32 - t, zi = (n, e, t) => e << t | n >>> 32 - t, Ji = (n, e, t) => e << t - 32 | n >>> 64 - t, Xi = (n, e, t) => n << t - 32 | e >>> 64 - t;
function Eo(n, e, t, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: n + t + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const _o = (n, e, t) => (n >>> 0) + (e >>> 0) + (t >>> 0), $o = (n, e, t, r) => e + t + r + (n / 2 ** 32 | 0) | 0, To = (n, e, t, r) => (n >>> 0) + (e >>> 0) + (t >>> 0) + (r >>> 0), Bo = (n, e, t, r, i) => e + t + r + i + (n / 2 ** 32 | 0) | 0, Co = (n, e, t, r, i) => (n >>> 0) + (e >>> 0) + (t >>> 0) + (r >>> 0) + (i >>> 0), Mo = (n, e, t, r, i, s) => e + t + r + i + s + (n / 2 ** 32 | 0) | 0, L = {
  fromBig: Vi,
  split: Qi,
  toBig: go,
  shrSH: wo,
  shrSL: bo,
  rotrSH: xo,
  rotrSL: ko,
  rotrBH: vo,
  rotrBL: So,
  rotr32H: Ao,
  rotr32L: Io,
  rotlSH: Gi,
  rotlSL: zi,
  rotlBH: Ji,
  rotlBL: Xi,
  add: Eo,
  add3L: _o,
  add3H: $o,
  add4L: To,
  add4H: Bo,
  add5H: Mo,
  add5L: Co
}, Et = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Yi(n) {
  return new Uint32Array(n.buffer, n.byteOffset, Math.floor(n.byteLength / 4));
}
function Zn(n) {
  return new DataView(n.buffer, n.byteOffset, n.byteLength);
}
function qe(n, e) {
  return n << 32 - e | n >>> e;
}
const Wr = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function No(n) {
  return n << 24 & 4278190080 | n << 8 & 16711680 | n >>> 8 & 65280 | n >>> 24 & 255;
}
function jr(n) {
  for (let e = 0; e < n.length; e++)
    n[e] = No(n[e]);
}
const Ge = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Vr(n) {
  if (n >= Ge._0 && n <= Ge._9)
    return n - Ge._0;
  if (n >= Ge.A && n <= Ge.F)
    return n - (Ge.A - 10);
  if (n >= Ge.a && n <= Ge.f)
    return n - (Ge.a - 10);
}
function Be(n) {
  if (typeof n != "string")
    throw new Error("hex string expected, got " + typeof n);
  const e = n.length, t = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(t);
  for (let i = 0, s = 0; i < t; i++, s += 2) {
    const o = Vr(n.charCodeAt(s)), c = Vr(n.charCodeAt(s + 1));
    if (o === void 0 || c === void 0) {
      const h = n[s] + n[s + 1];
      throw new Error('hex string expected, got non-hex character "' + h + '" at index ' + s);
    }
    r[i] = o * 16 + c;
  }
  return r;
}
function Ro(n) {
  if (typeof n != "string")
    throw new Error("utf8ToBytes expected string, got " + typeof n);
  return new Uint8Array(new TextEncoder().encode(n));
}
function Ln(n) {
  return typeof n == "string" && (n = Ro(n)), Hn(n), n;
}
class Zi {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function kt(n) {
  const e = (r) => n().update(Ln(r)).digest(), t = n();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => n(), e;
}
function Oo(n) {
  const e = (r, i) => n(i).update(Ln(r)).digest(), t = n({});
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = (r) => n(r), e;
}
function Uo(n = 32) {
  if (Et && typeof Et.getRandomValues == "function")
    return Et.getRandomValues(new Uint8Array(n));
  if (Et && typeof Et.randomBytes == "function")
    return Et.randomBytes(n);
  throw new Error("crypto.getRandomValues must be defined");
}
const es = [], ts = [], ns = [], Fo = /* @__PURE__ */ BigInt(0), Lt = /* @__PURE__ */ BigInt(1), Ho = /* @__PURE__ */ BigInt(2), Lo = /* @__PURE__ */ BigInt(7), qo = /* @__PURE__ */ BigInt(256), Po = /* @__PURE__ */ BigInt(113);
for (let n = 0, e = Lt, t = 1, r = 0; n < 24; n++) {
  [t, r] = [r, (2 * t + 3 * r) % 5], es.push(2 * (5 * r + t)), ts.push((n + 1) * (n + 2) / 2 % 64);
  let i = Fo;
  for (let s = 0; s < 7; s++)
    e = (e << Lt ^ (e >> Lo) * Po) % qo, e & Ho && (i ^= Lt << (Lt << /* @__PURE__ */ BigInt(s)) - Lt);
  ns.push(i);
}
const [Do, Ko] = /* @__PURE__ */ Qi(ns, !0), Qr = (n, e, t) => t > 32 ? Ji(n, e, t) : Gi(n, e, t), Gr = (n, e, t) => t > 32 ? Xi(n, e, t) : zi(n, e, t);
function Wo(n, e = 24) {
  const t = new Uint32Array(10);
  for (let r = 24 - e; r < 24; r++) {
    for (let o = 0; o < 10; o++)
      t[o] = n[o] ^ n[o + 10] ^ n[o + 20] ^ n[o + 30] ^ n[o + 40];
    for (let o = 0; o < 10; o += 2) {
      const c = (o + 8) % 10, h = (o + 2) % 10, f = t[h], l = t[h + 1], y = Qr(f, l, 1) ^ t[c], p = Gr(f, l, 1) ^ t[c + 1];
      for (let g = 0; g < 50; g += 10)
        n[o + g] ^= y, n[o + g + 1] ^= p;
    }
    let i = n[2], s = n[3];
    for (let o = 0; o < 24; o++) {
      const c = ts[o], h = Qr(i, s, c), f = Gr(i, s, c), l = es[o];
      i = n[l], s = n[l + 1], n[l] = h, n[l + 1] = f;
    }
    for (let o = 0; o < 50; o += 10) {
      for (let c = 0; c < 10; c++)
        t[c] = n[o + c];
      for (let c = 0; c < 10; c++)
        n[o + c] ^= ~t[(c + 2) % 10] & t[(c + 4) % 10];
    }
    n[0] ^= Do[r], n[1] ^= Ko[r];
  }
  t.fill(0);
}
class qn extends Zi {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(e, t, r, i = !1, s = 24) {
    if (super(), this.blockLen = e, this.suffix = t, this.outputLen = r, this.enableXOF = i, this.rounds = s, this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, Kr(r), 0 >= this.blockLen || this.blockLen >= 200)
      throw new Error("Sha3 supports only keccak-f1600 function");
    this.state = new Uint8Array(200), this.state32 = Yi(this.state);
  }
  keccak() {
    Wr || jr(this.state32), Wo(this.state32, this.rounds), Wr || jr(this.state32), this.posOut = 0, this.pos = 0;
  }
  update(e) {
    In(this);
    const { blockLen: t, state: r } = this;
    e = Ln(e);
    const i = e.length;
    for (let s = 0; s < i; ) {
      const o = Math.min(t - this.pos, i - s);
      for (let c = 0; c < o; c++)
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
    In(this, !1), Hn(e), this.finish();
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
    return Kr(e), this.xofInto(new Uint8Array(e));
  }
  digestInto(e) {
    if (ji(e, this), this.finished)
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
    return e || (e = new qn(t, r, i, o, s)), e.state32.set(this.state32), e.pos = this.pos, e.posOut = this.posOut, e.finished = this.finished, e.rounds = s, e.suffix = r, e.outputLen = i, e.enableXOF = o, e.destroyed = this.destroyed, e;
  }
}
const Pn = (n, e, t) => kt(() => new qn(e, n, t)), jo = /* @__PURE__ */ Pn(6, 144, 224 / 8), rs = /* @__PURE__ */ Pn(6, 136, 256 / 8), Vo = /* @__PURE__ */ Pn(6, 104, 384 / 8), is = /* @__PURE__ */ Pn(6, 72, 512 / 8), ss = (n, e, t) => Oo((r = {}) => new qn(e, n, r.dkLen === void 0 ? t : r.dkLen, !0)), os = /* @__PURE__ */ ss(31, 168, 128 / 8), Sr = /* @__PURE__ */ ss(31, 136, 256 / 8);
function Qo(n, e, t, r) {
  if (typeof n.setBigUint64 == "function")
    return n.setBigUint64(e, t, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(t >> i & s), c = Number(t & s), h = r ? 4 : 0, f = r ? 0 : 4;
  n.setUint32(e + h, o, r), n.setUint32(e + f, c, r);
}
function Go(n, e, t) {
  return n & e ^ ~n & t;
}
function zo(n, e, t) {
  return n & e ^ n & t ^ e & t;
}
class as extends Zi {
  constructor(e, t, r, i) {
    super(), this.blockLen = e, this.outputLen = t, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Zn(this.buffer);
  }
  update(e) {
    In(this);
    const { view: t, buffer: r, blockLen: i } = this;
    e = Ln(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const c = Math.min(i - this.pos, s - o);
      if (c === i) {
        const h = Zn(e);
        for (; i <= s - o; o += i)
          this.process(h, o);
        continue;
      }
      r.set(e.subarray(o, o + c), this.pos), this.pos += c, o += c, this.pos === i && (this.process(t, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    In(this), ji(e, this), this.finished = !0;
    const { buffer: t, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    t[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let y = o; y < i; y++)
      t[y] = 0;
    Qo(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const c = Zn(e), h = this.outputLen;
    if (h % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = h / 4, l = this.get();
    if (f > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let y = 0; y < f; y++)
      c.setUint32(4 * y, l[y], s);
  }
  digest() {
    const { buffer: e, outputLen: t } = this;
    this.digestInto(e);
    const r = e.slice(0, t);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: t, buffer: r, length: i, finished: s, destroyed: o, pos: c } = this;
    return e.length = i, e.pos = c, e.finished = s, e.destroyed = o, i % t && e.buffer.set(r), e;
  }
}
const Jo = /* @__PURE__ */ new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), rt = /* @__PURE__ */ new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), it = /* @__PURE__ */ new Uint32Array(64);
class us extends as {
  constructor() {
    super(64, 32, 8, !1), this.A = rt[0] | 0, this.B = rt[1] | 0, this.C = rt[2] | 0, this.D = rt[3] | 0, this.E = rt[4] | 0, this.F = rt[5] | 0, this.G = rt[6] | 0, this.H = rt[7] | 0;
  }
  get() {
    const { A: e, B: t, C: r, D: i, E: s, F: o, G: c, H: h } = this;
    return [e, t, r, i, s, o, c, h];
  }
  // prettier-ignore
  set(e, t, r, i, s, o, c, h) {
    this.A = e | 0, this.B = t | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = c | 0, this.H = h | 0;
  }
  process(e, t) {
    for (let y = 0; y < 16; y++, t += 4)
      it[y] = e.getUint32(t, !1);
    for (let y = 16; y < 64; y++) {
      const p = it[y - 15], g = it[y - 2], b = qe(p, 7) ^ qe(p, 18) ^ p >>> 3, A = qe(g, 17) ^ qe(g, 19) ^ g >>> 10;
      it[y] = A + it[y - 7] + b + it[y - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: c, F: h, G: f, H: l } = this;
    for (let y = 0; y < 64; y++) {
      const p = qe(c, 6) ^ qe(c, 11) ^ qe(c, 25), g = l + p + Go(c, h, f) + Jo[y] + it[y] | 0, A = (qe(r, 2) ^ qe(r, 13) ^ qe(r, 22)) + zo(r, i, s) | 0;
      l = f, f = h, h = c, c = o + g | 0, o = s, s = i, i = r, r = g + A | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, c = c + this.E | 0, h = h + this.F | 0, f = f + this.G | 0, l = l + this.H | 0, this.set(r, i, s, o, c, h, f, l);
  }
  roundClean() {
    it.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Xo extends us {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Yo = /* @__PURE__ */ kt(() => new us()), Zo = /* @__PURE__ */ kt(() => new Xo()), [ea, ta] = L.split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n) => BigInt(n))), st = /* @__PURE__ */ new Uint32Array(80), ot = /* @__PURE__ */ new Uint32Array(80);
class Dn extends as {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: t, Bh: r, Bl: i, Ch: s, Cl: o, Dh: c, Dl: h, Eh: f, El: l, Fh: y, Fl: p, Gh: g, Gl: b, Hh: A, Hl: S } = this;
    return [e, t, r, i, s, o, c, h, f, l, y, p, g, b, A, S];
  }
  // prettier-ignore
  set(e, t, r, i, s, o, c, h, f, l, y, p, g, b, A, S) {
    this.Ah = e | 0, this.Al = t | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = c | 0, this.Dl = h | 0, this.Eh = f | 0, this.El = l | 0, this.Fh = y | 0, this.Fl = p | 0, this.Gh = g | 0, this.Gl = b | 0, this.Hh = A | 0, this.Hl = S | 0;
  }
  process(e, t) {
    for (let T = 0; T < 16; T++, t += 4)
      st[T] = e.getUint32(t), ot[T] = e.getUint32(t += 4);
    for (let T = 16; T < 80; T++) {
      const x = st[T - 15] | 0, _ = ot[T - 15] | 0, I = L.rotrSH(x, _, 1) ^ L.rotrSH(x, _, 8) ^ L.shrSH(x, _, 7), N = L.rotrSL(x, _, 1) ^ L.rotrSL(x, _, 8) ^ L.shrSL(x, _, 7), O = st[T - 2] | 0, q = ot[T - 2] | 0, ee = L.rotrSH(O, q, 19) ^ L.rotrBH(O, q, 61) ^ L.shrSH(O, q, 6), Q = L.rotrSL(O, q, 19) ^ L.rotrBL(O, q, 61) ^ L.shrSL(O, q, 6), pe = L.add4L(N, Q, ot[T - 7], ot[T - 16]), Te = L.add4H(pe, I, ee, st[T - 7], st[T - 16]);
      st[T] = Te | 0, ot[T] = pe | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: c, Cl: h, Dh: f, Dl: l, Eh: y, El: p, Fh: g, Fl: b, Gh: A, Gl: S, Hh: $, Hl: B } = this;
    for (let T = 0; T < 80; T++) {
      const x = L.rotrSH(y, p, 14) ^ L.rotrSH(y, p, 18) ^ L.rotrBH(y, p, 41), _ = L.rotrSL(y, p, 14) ^ L.rotrSL(y, p, 18) ^ L.rotrBL(y, p, 41), I = y & g ^ ~y & A, N = p & b ^ ~p & S, O = L.add5L(B, _, N, ta[T], ot[T]), q = L.add5H(O, $, x, I, ea[T], st[T]), ee = O | 0, Q = L.rotrSH(r, i, 28) ^ L.rotrBH(r, i, 34) ^ L.rotrBH(r, i, 39), pe = L.rotrSL(r, i, 28) ^ L.rotrBL(r, i, 34) ^ L.rotrBL(r, i, 39), Te = r & s ^ r & c ^ s & c, Re = i & o ^ i & h ^ o & h;
      $ = A | 0, B = S | 0, A = g | 0, S = b | 0, g = y | 0, b = p | 0, { h: y, l: p } = L.add(f | 0, l | 0, q | 0, ee | 0), f = c | 0, l = h | 0, c = s | 0, h = o | 0, s = r | 0, o = i | 0;
      const U = L.add3L(ee, pe, Re);
      r = L.add3H(U, q, Q, Te), i = U | 0;
    }
    ({ h: r, l: i } = L.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = L.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: c, l: h } = L.add(this.Ch | 0, this.Cl | 0, c | 0, h | 0), { h: f, l } = L.add(this.Dh | 0, this.Dl | 0, f | 0, l | 0), { h: y, l: p } = L.add(this.Eh | 0, this.El | 0, y | 0, p | 0), { h: g, l: b } = L.add(this.Fh | 0, this.Fl | 0, g | 0, b | 0), { h: A, l: S } = L.add(this.Gh | 0, this.Gl | 0, A | 0, S | 0), { h: $, l: B } = L.add(this.Hh | 0, this.Hl | 0, $ | 0, B | 0), this.set(r, i, s, o, c, h, f, l, y, p, g, b, A, S, $, B);
  }
  roundClean() {
    st.fill(0), ot.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class na extends Dn {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class ra extends Dn {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class ia extends Dn {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
const sa = /* @__PURE__ */ kt(() => new Dn()), oa = /* @__PURE__ */ kt(() => new na()), aa = /* @__PURE__ */ kt(() => new ra()), ua = /* @__PURE__ */ kt(() => new ia());
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
const ct = Hn, zr = Uo;
function Jr(n, e) {
  if (n.length !== e.length)
    return !1;
  let t = 0;
  for (let r = 0; r < n.length; r++)
    t |= n[r] ^ e[r];
  return t === 0;
}
function gn(...n) {
  const e = (r) => typeof r == "number" ? r : r.bytesLen, t = n.reduce((r, i) => r + e(i), 0);
  return {
    bytesLen: t,
    encode: (r) => {
      const i = new Uint8Array(t);
      for (let s = 0, o = 0; s < n.length; s++) {
        const c = n[s], h = e(c), f = typeof c == "number" ? r[s] : c.encode(r[s]);
        ct(f, h), i.set(f, o), typeof c != "number" && f.fill(0), o += h;
      }
      return i;
    },
    decode: (r) => {
      ct(r, t);
      const i = [];
      for (const s of n) {
        const o = e(s), c = r.subarray(0, o);
        i.push(typeof s == "number" ? c : s.decode(c)), r = r.subarray(o);
      }
      return i;
    }
  };
}
function er(n, e) {
  const t = e * n.bytesLen;
  return {
    bytesLen: t,
    encode: (r) => {
      if (r.length !== e)
        throw new Error(`vecCoder.encode: wrong length=${r.length}. Expected: ${e}`);
      const i = new Uint8Array(t);
      for (let s = 0, o = 0; s < r.length; s++) {
        const c = n.encode(r[s]);
        i.set(c, o), c.fill(0), o += c.length;
      }
      return i;
    },
    decode: (r) => {
      ct(r, t);
      const i = [];
      for (let s = 0; s < r.length; s += n.bytesLen)
        i.push(n.decode(r.subarray(s, s + n.bytesLen)));
      return i;
    }
  };
}
function wt(...n) {
  for (const e of n)
    if (Array.isArray(e))
      for (const t of e)
        t.fill(0);
    else
      e.fill(0);
}
function Xr(n) {
  return (1 << n) - 1;
}
Be("0609608648016503040201"), Be("0609608648016503040202"), Be("0609608648016503040203"), Be("0609608648016503040204"), Be("0609608648016503040205"), Be("0609608648016503040206"), Be("0609608648016503040207"), Be("0609608648016503040208"), Be("0609608648016503040209"), Be("060960864801650304020A"), Be("060960864801650304020B"), Be("060960864801650304020C");
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
function la(n, e = 8) {
  const i = n.toString(2).padStart(8, "0").slice(-e).padStart(7, "0").split("").reverse().join("");
  return Number.parseInt(i, 2);
}
const ca = (n) => {
  const { newPoly: e, N: t, Q: r, F: i, ROOT_OF_UNITY: s, brvBits: o, isKyber: c } = n, h = (S, $ = r) => {
    const B = S % $ | 0;
    return (B >= 0 ? B | 0 : $ + B | 0) | 0;
  }, f = (S, $ = r) => {
    const B = h(S, $) | 0;
    return (B > $ >> 1 ? B - $ | 0 : B) | 0;
  };
  function l() {
    const S = e(t);
    for (let $ = 0; $ < t; $++) {
      const B = la($, o), T = BigInt(s) ** BigInt(B) % BigInt(r);
      S[$] = Number(T) | 0;
    }
    return S;
  }
  const y = l(), p = c ? 128 : t, g = c ? 1 : 0;
  return { mod: h, smod: f, nttZetas: y, NTT: {
    encode: (S) => {
      for (let $ = 1, B = 128; B > g; B >>= 1)
        for (let T = 0; T < t; T += 2 * B) {
          const x = y[$++];
          for (let _ = T; _ < T + B; _++) {
            const I = h(x * S[_ + B]);
            S[_ + B] = h(S[_] - I) | 0, S[_] = h(S[_] + I) | 0;
          }
        }
      return S;
    },
    decode: (S) => {
      for (let $ = p - 1, B = 1 + g; B < p + g; B <<= 1)
        for (let T = 0; T < t; T += 2 * B) {
          const x = y[$--];
          for (let _ = T; _ < T + B; _++) {
            const I = S[_];
            S[_] = h(I + S[_ + B]), S[_ + B] = h(x * (S[_ + B] - I));
          }
        }
      for (let $ = 0; $ < S.length; $++)
        S[$] = h(i * S[$]);
      return S;
    }
  }, bitsCoder: (S, $) => {
    const B = Xr(S), T = S * (t / 8);
    return {
      bytesLen: T,
      encode: (x) => {
        const _ = new Uint8Array(T);
        for (let I = 0, N = 0, O = 0, q = 0; I < x.length; I++)
          for (N |= ($.encode(x[I]) & B) << O, O += S; O >= 8; O -= 8, N >>= 8)
            _[q++] = N & Xr(O);
        return _;
      },
      decode: (x) => {
        const _ = e(t);
        for (let I = 0, N = 0, O = 0, q = 0; I < x.length; I++)
          for (N |= x[I] << O, O += 8; O >= S; O -= S, N >>= S)
            _[q++] = $.decode(N & B);
        return _;
      }
    };
  } };
}, ha = (n) => (e, t) => {
  t || (t = n.blockLen);
  const r = new Uint8Array(e.length + 2);
  r.set(e);
  const i = e.length, s = new Uint8Array(t);
  let o = n.create({}), c = 0, h = 0;
  return {
    stats: () => ({ calls: c, xofs: h }),
    get: (f, l) => (r[i + 0] = f, r[i + 1] = l, o.destroy(), o = n.create({}).update(r), c++, () => (h++, o.xofInto(s))),
    clean: () => {
      o.destroy(), s.fill(0), r.fill(0);
    }
  };
}, fa = /* @__PURE__ */ ha(os);
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
const be = 256, et = 3329, da = 3303, pa = 17, { mod: Yt, nttZetas: ya, NTT: dt, bitsCoder: ma } = ca({
  N: be,
  Q: et,
  F: da,
  ROOT_OF_UNITY: pa,
  newPoly: (n) => new Uint16Array(n),
  brvBits: 7,
  isKyber: !0
}), ga = {
  512: { N: be, Q: et, K: 2, ETA1: 3, ETA2: 2, du: 10, dv: 4, RBGstrength: 128 },
  768: { N: be, Q: et, K: 3, ETA1: 2, ETA2: 2, du: 10, dv: 4, RBGstrength: 192 },
  1024: { N: be, Q: et, K: 4, ETA1: 2, ETA2: 2, du: 11, dv: 5, RBGstrength: 256 }
}, wa = (n) => {
  if (n >= 12)
    return { encode: (t) => t, decode: (t) => t };
  const e = 2 ** (n - 1);
  return {
    // const compress = (i: number) => round((2 ** d / Q) * i) % 2 ** d;
    encode: (t) => ((t << n) + et / 2) / et,
    // const decompress = (i: number) => round((Q / 2 ** d) * i);
    decode: (t) => t * et + e >>> n
  };
}, qt = (n) => ma(n, wa(n));
function pt(n, e) {
  for (let t = 0; t < be; t++)
    n[t] = Yt(n[t] + e[t]);
}
function ba(n, e) {
  for (let t = 0; t < be; t++)
    n[t] = Yt(n[t] - e[t]);
}
function xa(n, e, t, r, i) {
  const s = Yt(e * r * i + n * t), o = Yt(n * r + e * t);
  return { c0: s, c1: o };
}
function fn(n, e) {
  for (let t = 0; t < be / 2; t++) {
    let r = ya[64 + (t >> 1)];
    t & 1 && (r = -r);
    const { c0: i, c1: s } = xa(n[2 * t + 0], n[2 * t + 1], e[2 * t + 0], e[2 * t + 1], r);
    n[2 * t + 0] = i, n[2 * t + 1] = s;
  }
  return n;
}
function Yr(n) {
  const e = new Uint16Array(be);
  for (let t = 0; t < be; ) {
    const r = n();
    if (r.length % 3)
      throw new Error("SampleNTT: unaligned block");
    for (let i = 0; t < be && i + 3 <= r.length; i += 3) {
      const s = (r[i + 0] >> 0 | r[i + 1] << 8) & 4095, o = (r[i + 1] >> 4 | r[i + 2] << 4) & 4095;
      s < et && (e[t++] = s), t < be && o < et && (e[t++] = o);
    }
  }
  return e;
}
function Pt(n, e, t, r) {
  const i = n(r * be / 4, e, t), s = new Uint16Array(be), o = Yi(i);
  let c = 0;
  for (let h = 0, f = 0, l = 0, y = 0; h < o.length; h++) {
    let p = o[h];
    for (let g = 0; g < 32; g++)
      l += p & 1, p >>= 1, c += 1, c === r ? (y = l, l = 0) : c === 2 * r && (s[f++] = Yt(y - l), l = 0, c = 0);
  }
  if (c)
    throw new Error(`sampleCBD: leftover bits: ${c}`);
  return s;
}
const ka = (n) => {
  const { K: e, PRF: t, XOF: r, HASH512: i, ETA1: s, ETA2: o, du: c, dv: h } = n, f = qt(1), l = qt(h), y = qt(c), p = gn(er(qt(12), e), 32), g = er(qt(12), e), b = gn(er(y, e), l), A = gn(32, 32);
  return {
    secretCoder: g,
    secretKeyLen: g.bytesLen,
    publicKeyLen: p.bytesLen,
    cipherTextLen: b.bytesLen,
    keygen: (S) => {
      const $ = new Uint8Array(33);
      $.set(S), $[32] = e;
      const B = i($), [T, x] = A.decode(B), _ = [], I = [];
      for (let q = 0; q < e; q++)
        _.push(dt.encode(Pt(t, x, q, s)));
      const N = r(T);
      for (let q = 0; q < e; q++) {
        const ee = dt.encode(Pt(t, x, e + q, s));
        for (let Q = 0; Q < e; Q++) {
          const pe = Yr(N.get(Q, q));
          pt(ee, fn(pe, _[Q]));
        }
        I.push(ee);
      }
      N.clean();
      const O = {
        publicKey: p.encode([I, T]),
        secretKey: g.encode(_)
      };
      return wt(T, x, _, I, $, B), O;
    },
    encrypt: (S, $, B) => {
      const [T, x] = p.decode(S), _ = [];
      for (let Q = 0; Q < e; Q++)
        _.push(dt.encode(Pt(t, B, Q, s)));
      const I = r(x), N = new Uint16Array(be), O = [];
      for (let Q = 0; Q < e; Q++) {
        const pe = Pt(t, B, e + Q, o), Te = new Uint16Array(be);
        for (let Re = 0; Re < e; Re++) {
          const U = Yr(I.get(Q, Re));
          pt(Te, fn(U, _[Re]));
        }
        pt(pe, dt.decode(Te)), O.push(pe), pt(N, fn(T[Q], _[Q])), Te.fill(0);
      }
      I.clean();
      const q = Pt(t, B, 2 * e, o);
      pt(q, dt.decode(N));
      const ee = f.decode($);
      return pt(ee, q), wt(T, _, N, q), b.encode([O, ee]);
    },
    decrypt: (S, $) => {
      const [B, T] = b.decode(S), x = g.decode($), _ = new Uint16Array(be);
      for (let I = 0; I < e; I++)
        pt(_, fn(x[I], dt.encode(B[I])));
      return ba(T, dt.decode(_)), wt(_, x, B), f.encode(T);
    }
  };
};
function va(n) {
  const e = ka(n), { HASH256: t, HASH512: r, KDF: i } = n, { secretCoder: s, cipherTextLen: o } = e, c = e.publicKeyLen, h = gn(e.secretKeyLen, e.publicKeyLen, 32, 32), f = h.bytesLen, l = 32;
  return {
    publicKeyLen: c,
    msgLen: l,
    keygen: (y = zr(64)) => {
      ct(y, 64);
      const { publicKey: p, secretKey: g } = e.keygen(y.subarray(0, 32)), b = t(p), A = h.encode([g, p, b, y.subarray(32)]);
      return wt(g, b), { publicKey: p, secretKey: A };
    },
    encapsulate: (y, p = zr(32)) => {
      ct(y, c), ct(p, l);
      const g = y.subarray(0, 384 * n.K), b = s.encode(s.decode(g.slice()));
      if (!Jr(b, g))
        throw wt(b), new Error("ML-KEM.encapsulate: wrong publicKey modulus");
      wt(b);
      const A = r.create().update(p).update(t(y)).digest(), S = e.encrypt(y, p, A.subarray(32, 64));
      return A.subarray(32).fill(0), { cipherText: S, sharedSecret: A.subarray(0, 32) };
    },
    decapsulate: (y, p) => {
      ct(p, f), ct(y, o);
      const [g, b, A, S] = h.decode(p), $ = e.decrypt(y, g), B = r.create().update($).update(A).digest(), T = B.subarray(0, 32), x = e.encrypt(b, $, B.subarray(32, 64)), _ = Jr(y, x), I = i.create({ dkLen: 32 }).update(S).update(y).digest();
      return wt($, x, _ ? I : T), _ ? T : I;
    }
  };
}
function Sa(n, e, t) {
  return Sr.create({ dkLen: n }).update(e).update(new Uint8Array([t])).digest();
}
const Aa = {
  HASH256: rs,
  HASH512: is,
  KDF: Sr,
  XOF: fa,
  PRF: Sa
}, tr = /* @__PURE__ */ va({
  ...Aa,
  ...ga[768]
});
class V {
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
    characters: c = null
  }) {
    this.token = r, this.balance = 0, this.molecules = {}, this.key = null, this.privkey = null, this.pubkey = null, this.tokenUnits = [], this.tradeRates = {}, this.address = i, this.position = s, this.bundle = t, this.batchId = o, this.characters = c, e && (this.bundle = this.bundle || Ct(e, "Wallet::constructor"), this.position = this.position || V.generatePosition(), this.key = V.generateKey({
      secret: e,
      token: this.token,
      position: this.position
    }), this.address = this.address || V.generateAddress(this.key), this.characters = this.characters || "BASE64", this.initializeMLKEM());
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
      throw new yo();
    return e && !t && (o = V.generatePosition(), t = Ct(e, "Wallet::create")), new V({
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
    return typeof e != "string" ? !1 : e.length === 64 && co(e);
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
      t.push(Xt.createFromDB(r));
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
    const s = BigInt(`0x${e}`) + BigInt(`0x${r}`), o = new Ne("SHAKE256", "TEXT");
    o.update(s.toString(16)), t && o.update(t);
    const c = new Ne("SHAKE256", "TEXT");
    return c.update(o.getHash("HEX", { outputLen: 8192 })), c.getHash("HEX", { outputLen: 8192 });
  }
  /**
   * Generates a wallet address
   *
   * @param {string} key
   * @return {string}
   */
  static generateAddress(e) {
    const t = vn(e, 128), r = new Ne("SHAKE256", "TEXT");
    for (const s in t) {
      let o = t[s];
      for (let c = 1; c <= 16; c++) {
        const h = new Ne("SHAKE256", "TEXT");
        h.update(o), o = h.getHash("HEX", { outputLen: 512 });
      }
      r.update(o);
    }
    const i = new Ne("SHAKE256", "TEXT");
    return i.update(r.getHash("HEX", { outputLen: 8192 })), i.getHash("HEX", { outputLen: 256 });
  }
  /**
   *
   * @param saltLength
   * @returns {string}
   */
  static generatePosition(e = 64) {
    return kr(e, "abcdef0123456789");
  }
  /**
   * Initializes the ML-KEM key pair
   */
  initializeMLKEM() {
    const e = fr(this.key, 64), t = new Uint8Array(64);
    for (let s = 0; s < 64; s++)
      t[s] = parseInt(e.substr(s * 2, 2), 16);
    const { publicKey: r, secretKey: i } = tr.keygen(t);
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
    const t = V.create({
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
    e.batchId && (this.batchId = t ? e.batchId : An({}));
  }
  async encryptMessage(e, t) {
    const r = JSON.stringify(e), i = new TextEncoder().encode(r), s = this.deserializeKey(t), { cipherText: o, sharedSecret: c } = tr.encapsulate(s), h = await this.encryptWithSharedSecret(i, c);
    return {
      cipherText: this.serializeKey(o),
      encryptedMessage: this.serializeKey(h)
    };
  }
  async decryptMessage(e) {
    const { cipherText: t, encryptedMessage: r } = e;
    let i;
    try {
      i = tr.decapsulate(this.deserializeKey(t), this.privkey);
    } catch (h) {
      return console.error("Wallet::decryptMessage() - Decapsulation failed", h), console.info("Wallet::decryptMessage() - my public key", this.pubkey), null;
    }
    let s;
    try {
      s = this.deserializeKey(r);
    } catch (h) {
      return console.warn("Wallet::decryptMessage() - Deserialization failed", h), console.info("Wallet::decryptMessage() - my public key", this.pubkey), console.info("Wallet::decryptMessage() - our shared secret", i), null;
    }
    let o;
    try {
      o = await this.decryptWithSharedSecret(s, i);
    } catch (h) {
      return console.warn("Wallet::decryptMessage() - Decryption failed", h), console.info("Wallet::decryptMessage() - my public key", this.pubkey), console.info("Wallet::decryptMessage() - our shared secret", i), console.info("Wallet::decryptMessage() - deserialized encrypted message", s), null;
    }
    let c;
    try {
      c = new TextDecoder().decode(o);
    } catch (h) {
      return console.warn("Wallet::decryptMessage() - Decoding failed", h), console.info("Wallet::decryptMessage() - my public key", this.pubkey), console.info("Wallet::decryptMessage() - our shared secret", i), console.info("Wallet::decryptMessage() - deserialized encrypted message", s), console.info("Wallet::decryptMessage() - decrypted Uint8Array", o), null;
    }
    return JSON.parse(c);
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
    ), c = new Uint8Array(r.length + o.byteLength);
    return c.set(r), c.set(new Uint8Array(o), r.length), c;
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
class Dt extends J {
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
class Ia extends J {
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
class Ea extends J {
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
class Zr extends J {
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
class ls extends J {
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
class _a extends J {
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
class Ye extends J {
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
class ei extends J {
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
class ti extends J {
  /**
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Token slugs for wallets in transfer do not match!", t = null, r = null) {
    super(e, t, r), this.name = "TransferMismatchedException";
  }
}
class ni extends J {
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
class $a extends J {
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
class Ta extends J {
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
class ut extends J {
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
class Kt extends J {
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
class wn extends J {
  /**
   * @param {string|null} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Incorrect BatchId", t = null, r = null) {
    super(e, t, r), this.name = "BatchIdException";
  }
}
class ri {
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
class En extends J {
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
class tt extends J {
  /**
   * @param {string|null} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Code exception", t = null, r = null) {
    super(e, t, r), this.name = "CodeException";
  }
}
class Gt {
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
    amount: c = null,
    comparison: h = null
  }) {
    if (i && (this.meta = i), !e)
      throw new En('Callback structure violated, missing mandatory "action" parameter.');
    this.__metaId = r, this.__metaType = t, this.__action = e, this.__address = s, this.__token = o, this.__amount = c, this.__comparison = h;
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
    if (!ho(e))
      throw new tt("Parameter amount should be a string containing numbers");
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
    this.__meta = e instanceof ri ? e : ri.toObject(e);
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
    const t = new Gt({
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
    return Ht(Object.keys(this.toJSON()), ["action", "metaId", "metaType", "meta"]).length === 4 && this._is("meta");
  }
  /**
   * @return {boolean}
   */
  isCollect() {
    return Ht(Object.keys(this.toJSON()), ["action", "address", "token", "amount", "comparison"]).length === 5 && this._is("collect");
  }
  /**
   * @return {boolean}
   */
  isBuffer() {
    return Ht(Object.keys(this.toJSON()), ["action", "address", "token", "amount", "comparison"]).length === 5 && this._is("buffer");
  }
  /**
   * @return {boolean}
   */
  isRemit() {
    return Ht(Object.keys(this.toJSON()), ["action", "token", "amount"]).length === 3 && this._is("remit");
  }
  /**
   * @return {boolean}
   */
  isBurn() {
    return Ht(Object.keys(this.toJSON()), ["action", "token", "amount", "comparison"]).length === 4 && this._is("burn");
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
class nr {
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
      throw new En("Condition::constructor( { key, value, comparison } ) - not all class parameters are initialised!");
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
class Zt {
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
      if (!(r instanceof nr))
        throw new En();
    for (const r of t)
      if (!(r instanceof Gt))
        throw new En();
    this.__condition = e, this.__callback = t;
  }
  /**
   *
   * @param {Condition[]|{}} condition
   */
  set comparison(e) {
    this.__condition.push(e instanceof nr ? e : nr.toObject(e));
  }
  /**
   * @param {Callback[]|{}} callback
   */
  set callback(e) {
    this.__callback.push(e instanceof Gt ? e : Gt.toObject(e));
  }
  /**
   *
   * @param {object} object
   *
   * @return {Rule}
   */
  static toObject(e) {
    if (!e.condition)
      throw new ut("Rule::toObject() - Incorrect rule format! There is no condition field.");
    if (!e.callback)
      throw new ut("Rule::toObject() - Incorrect rule format! There is no callback field.");
    const t = new Zt({});
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
class se {
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
    for (let f = 0; f < o; f++) {
      const l = i[f], y = Number(l), p = Number.isInteger(y);
      (p ? y : l in s) || (s[p ? y : l] = i[f + 1].match(/^\d+$/) ? [] : {}), s = s[p ? y : l];
    }
    const c = i[o], h = Number(c);
    return s[Number.isInteger(h) ? h : c] = r, e;
  }
}
class Ba {
  /**
   *
   * @param molecule
   */
  constructor(e) {
    if (e.molecularHash === null)
      throw new Ea();
    if (!e.atoms.length)
      throw new bt();
    for (const t of e.atoms)
      if (t.index === null)
        throw new Dt();
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
      throw new bt("Check::continuId() - Molecule is missing required ContinuID Atom!");
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
        throw new Kt(`Check::isotopeI() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index === 0)
        throw new Dt(`Check::isotopeI() - Isotope "${e.isotope}" Atoms must have a non-zero index!`);
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
        throw new Kt(`Check::isotopeU() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new Dt(`Check::isotopeU() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
        throw new ut();
      if (t.token !== "USER")
        throw new Kt(`Check::isotopeM() - "${t.token}" is not a valid Token slug for "${t.isotope}" isotope Atoms!`);
      const r = Sn.aggregateMeta(t.meta);
      for (const i of e) {
        let s = r[i];
        if (s) {
          s = JSON.parse(s);
          for (const [o, c] of Object.entries(s))
            if (!e.includes(o)) {
              if (!Object.keys(r).includes(o))
                throw new Zr(`${o} is missing from the meta.`);
              for (const h of c)
                if (!V.isBundleHash(h) && !["all", "self"].includes(h))
                  throw new Zr(`${h} does not correspond to the format of the policy.`);
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
        throw new Kt(`Check::isotopeC() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new Dt(`Check::isotopeC() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
            throw new ut(`Check::isotopeT() - Required meta field "${i}" is missing!`);
      }
      for (const i of ["token"])
        if (!Object.prototype.hasOwnProperty.call(t, i) || !t[i])
          throw new ut(`Check::isotopeT() - Required meta field "${i}" is missing!`);
      if (e.token !== "USER")
        throw new Kt(`Check::isotopeT() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new Dt(`Check::isotopeT() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
          throw new ut("Check::isotopeR() - Mixing rules with politics!");
      }
      if (t.rule) {
        const r = JSON.parse(t.rule);
        if (!Array.isArray(r))
          throw new ut("Check::isotopeR() - Incorrect rule format!");
        for (const i of r)
          Zt.toObject(i);
        if (r.length < 1)
          throw new ut("Check::isotopeR() - No rules!");
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
        throw new ti();
      if (o.value < 0)
        throw new ei();
      return !0;
    }
    let i = 0, s = 0;
    for (const o in this.molecule.atoms)
      if (Object.prototype.hasOwnProperty.call(this.molecule.atoms, o)) {
        const c = this.molecule.atoms[o];
        if (c.isotope !== "V")
          continue;
        if (s = c.value * 1, Number.isNaN(s))
          throw new TypeError('Invalid isotope "V" values');
        if (c.token !== r.token)
          throw new ti();
        if (o > 0) {
          if (s < 0)
            throw new ei();
          if (c.walletAddress === r.walletAddress)
            throw new $a();
        }
        i += s;
      }
    if (i !== s)
      throw new Ta();
    if (e) {
      if (s = r.value * 1, Number.isNaN(s))
        throw new TypeError('Invalid isotope "V" values');
      const o = e.balance + s;
      if (o < 0)
        throw new Ye();
      if (o !== i)
        throw new ni();
    } else if (s !== 0)
      throw new ni();
    return !0;
  }
  /**
   * Verifies if the hash of all the atoms matches the molecular hash to ensure content has not been messed with
   *
   * @returns {boolean}
   */
  molecularHash() {
    if (this.molecule.molecularHash !== P.hashAtoms({
      atoms: this.molecule.atoms
    }))
      throw new Ia();
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
      (p, g) => p + g
    );
    if (t.length !== 2048 && (t = lo(t), t.length !== 2048))
      throw new ls();
    const r = vn(t, 128);
    let i = "";
    for (const p in r) {
      let g = r[p];
      for (let b = 0, A = 8 + e[p]; b < A; b++)
        g = new Ne("SHAKE256", "TEXT").update(g).getHash("HEX", { outputLen: 512 });
      i += g;
    }
    const s = new Ne("SHAKE256", "TEXT");
    s.update(i);
    const o = s.getHash("HEX", { outputLen: 8192 }), c = new Ne("SHAKE256", "TEXT");
    c.update(o);
    const h = c.getHash("HEX", { outputLen: 256 }), f = this.molecule.atoms[0];
    let l = f.walletAddress;
    const y = se.get(f.aggregatedMeta(), "signingWallet");
    if (y && (l = se.get(JSON.parse(y), "address")), h !== l)
      throw new _a();
    return !0;
  }
}
class Wt extends J {
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
class ii extends J {
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
class Ze {
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
    this.status = null, this.molecularHash = null, this.createdAt = String(+/* @__PURE__ */ new Date()), this.cellSlugOrigin = this.cellSlug = s, this.secret = e, this.bundle = t, this.sourceWallet = r, this.atoms = [], o !== null && Object.prototype.hasOwnProperty.call(mn, o) && (this.version = String(o)), (i || r) && (this.remainderWallet = i || V.create({
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
    const t = Object.assign(new Ze({}), JSON.parse(e)), r = Object.keys(new Ze({}));
    if (!Array.isArray(t.atoms))
      throw new bt();
    for (const i in Object.keys(t.atoms)) {
      t.atoms[i] = P.jsonToObject(JSON.stringify(t.atoms[i]));
      for (const s of ["position", "walletAddress", "isotope"])
        if (t.atoms[i].isotope.toLowerCase() !== "r" && (typeof t.atoms[i][s] > "u" || t.atoms[i][s] === null))
          throw new bt("MolecularStructure::jsonToObject() - Required Atom properties are missing!");
    }
    for (const i in t)
      Object.prototype.hasOwnProperty.call(t, i) && !r.includes(i) && delete t[i];
    return t.atoms = P.sortAtoms(t.atoms), t;
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
      const c = i[s];
      typeof t[c] < "u" && (r[s] = t[c]);
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
    return Ze.isotopeFilter(e, this.atoms);
  }
  /**
   * Generates the next atomic index
   *
   * @return {number}
   */
  generateIndex() {
    return Ze.generateNextAtomIndex(this.atoms);
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
    return this.molecularHash = null, e.index = this.generateIndex(), e.version = this.version, this.atoms.push(e), this.atoms = P.sortAtoms(this.atoms), this;
  }
  /**
   * Add user remainder atom for ContinuID
   *
   * @return {Molecule}
   */
  addContinuIdAtom() {
    return this.addAtom(P.create({
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
    const s = new Ee(r);
    s.addPolicy(i);
    const o = V.create({
      secret: this.secret,
      bundle: this.sourceWallet.bundle,
      token: "USER"
    });
    return this.addAtom(P.create({
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
      throw new Wt();
    return this.addAtom(P.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -r
    })), this.addAtom(P.create({
      isotope: "F",
      wallet: t,
      value: 1,
      metaType: "walletBundle",
      metaId: t.bundle
    })), this.addAtom(P.create({
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
      throw new ii("Molecule::burnToken() - Amount to burn must be positive!");
    if (this.sourceWallet.balance - e < 0)
      throw new Wt();
    return this.addAtom(P.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -e
    })), this.addAtom(P.create({
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
      throw new ii("Molecule::replenishToken() - Amount to replenish must be positive!");
    if (t.length) {
      t = V.getTokenUnits(t), this.remainderWallet.tokenUnits = this.sourceWallet.tokenUnits;
      for (const r of t)
        this.remainderWallet.tokenUnits.push(r);
      this.remainderWallet.balance = this.remainderWallet.tokenUnits.length, this.sourceWallet.tokenUnits = t, this.sourceWallet.balance = this.sourceWallet.tokenUnits.length;
    } else
      this.remainderWallet.balance = this.sourceWallet.balance + e, this.sourceWallet.balance = e;
    return this.addAtom(P.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: this.sourceWallet.balance
    })), this.addAtom(P.create({
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
      throw new Wt();
    return this.addAtom(P.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -t
    })), this.addAtom(P.create({
      isotope: "V",
      wallet: e,
      value: t,
      metaType: "walletBundle",
      metaId: e.bundle
    })), this.addAtom(P.create({
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
      throw new Wt();
    const r = V.create({
      secret: this.secret,
      bundle: this.bundle,
      token: this.sourceWallet.token,
      batchId: this.sourceWallet.batchId
    });
    return r.tradeRates = t, this.addAtom(P.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -e
    })), this.addAtom(P.create({
      isotope: "B",
      wallet: r,
      value: e,
      metaType: "walletBundle",
      metaId: this.sourceWallet.bundle
    })), this.addAtom(P.create({
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
      throw new Wt();
    const i = new Ee();
    t && i.setSigningWallet(t), this.addAtom(P.create({
      isotope: "B",
      wallet: this.sourceWallet,
      value: -r,
      meta: i,
      metaType: "walletBundle",
      metaId: this.sourceWallet.bundle
    }));
    for (const [s, o] of Object.entries(e || {}))
      this.addAtom(new P({
        isotope: "V",
        token: this.sourceWallet.token,
        value: o,
        batchId: this.sourceWallet.batchId ? An({}) : null,
        metaType: "walletBundle",
        metaId: s
      }));
    return this.addAtom(P.create({
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
    const i = new Ee(r);
    return i.setMetaWallet(e), this.addAtom(P.create({
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
    for (const c of r)
      s.push(c instanceof Zt ? c : Zt.toObject(c));
    const o = new Ee({
      rule: JSON.stringify(s)
    });
    return o.addPolicy(i), this.addAtom(P.create({
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
    t || (t = new Ee()), t.setMetaWallet(e);
    const r = P.create({
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
    const t = new Ee().setShadowWalletClaim(!0);
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
      hash: Ct(t.trim(), "Molecule::initIdentifierCreation")
    };
    return this.addAtom(P.create({
      isotope: "C",
      wallet: this.sourceWallet,
      metaType: "identifier",
      metaId: e,
      meta: new Ee(i)
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
    return this.addAtom(P.create({
      isotope: "M",
      wallet: this.sourceWallet,
      metaType: t,
      metaId: r,
      meta: new Ee(e)
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
    return s.token = e, this.local = 1, this.addAtom(P.create({
      isotope: "T",
      wallet: this.sourceWallet,
      value: t,
      metaType: r,
      metaId: i,
      meta: new Ee(s),
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
    return this.addAtom(P.create({
      isotope: "U",
      wallet: this.sourceWallet,
      meta: new Ee(e)
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
    if (this.atoms.length === 0 || this.atoms.filter((g) => !(g instanceof P)).length !== 0)
      throw new bt();
    !t && !this.bundle && (this.bundle = e || Ct(this.secret, "Molecule::sign")), this.molecularHash = P.hashAtoms({
      atoms: this.atoms
    });
    const i = this.atoms[0];
    let s = i.position;
    const o = se.get(i.aggregatedMeta(), "signingWallet");
    if (o && (s = se.get(JSON.parse(o), "position")), !s)
      throw new ls("Signing wallet must have a position!");
    const c = V.generateKey({
      secret: this.secret,
      token: i.token,
      position: i.position
    }), h = vn(c, 128), f = this.normalizedHash();
    let l = "";
    for (const g in h) {
      let b = h[g];
      for (let A = 0, S = 8 - f[g]; A < S; A++)
        b = new Ne("SHAKE256", "TEXT").update(b).getHash("HEX", { outputLen: 512 });
      l += b;
    }
    r && (l = uo(l));
    const y = vn(l, Math.ceil(l.length / this.atoms.length));
    let p = null;
    for (let g = 0, b = y.length; g < b; g++)
      this.atoms[g].otsFragment = y[g], p = this.atoms[g].position;
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
    const e = Wi(this);
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
    new Ba(this).verify(e);
  }
  /**
   * Convert Hm to numeric notation via EnumerateMolecule(Hm)
   *
   * @returns {Array}
   */
  normalizedHash() {
    return Ze.normalize(Ze.enumerate(this.molecularHash));
  }
}
const rr = 10 ** 18;
class $t {
  /**
   * @param {number} value
   * @return {number}
   */
  static val(e) {
    return Math.abs(e * rr) < 1 ? 0 : e;
  }
  /**
   * @param {number} value1
   * @param {number} value2
   * @param {boolean} debug
   * @return {number}
   */
  static cmp(e, t, r = !1) {
    const i = $t.val(e) * rr, s = $t.val(t) * rr;
    return Math.abs(i - s) < 1 ? 0 : i > s ? 1 : -1;
  }
  /**
   * @param {number} value1
   * @param {number} value2
   * @return {boolean}
   */
  static equal(e, t) {
    return $t.cmp(e, t) === 0;
  }
}
class en {
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
    const r = new en(e);
    return r.setWallet(t), r;
  }
  /**
   *
   * @param {object} snapshot
   * @param {string} secret
   * @return {AuthToken}
   */
  static restore(e, t) {
    const r = new V({
      secret: t,
      token: "AUTH",
      position: e.wallet.position,
      characters: e.wallet.characters
    });
    return en.create({
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
class zt extends J {
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
class pr extends J {
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
class fe {
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
      throw new zt();
    if (se.has(this.$__response, this.errorKey)) {
      const i = se.get(this.$__response, this.errorKey);
      throw String(i).includes("Unauthenticated") ? new pr() : new zt();
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
    if (!se.has(this.response(), this.dataKey))
      throw new zt();
    return se.get(this.response(), this.dataKey);
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
}
class Ae {
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
    return new fe({
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
      throw new tt("Query::createQuery() - Node URI was not initialized for this client instance!");
    if (this.$__query === null)
      throw new tt("Query::createQuery() - GraphQL subscription was not initialized!");
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
        return this.knishIOClient.log("warn", "Query was cancelled"), new fe({
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
class Ca extends fe {
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
    return t && (e = new V({
      secret: null,
      token: t.tokenSlug
    }), e.address = t.address, e.position = t.position, e.bundle = t.bundleHash, e.batchId = t.batchId, e.characters = t.characters, e.pubkey = t.pubkey, e.balance = t.amount * 1), e;
  }
}
var ht = {
  NAME: "Name",
  DOCUMENT: "Document",
  OPERATION_DEFINITION: "OperationDefinition",
  VARIABLE_DEFINITION: "VariableDefinition",
  SELECTION_SET: "SelectionSet",
  FIELD: "Field",
  ARGUMENT: "Argument",
  FRAGMENT_SPREAD: "FragmentSpread",
  INLINE_FRAGMENT: "InlineFragment",
  FRAGMENT_DEFINITION: "FragmentDefinition",
  VARIABLE: "Variable",
  INT: "IntValue",
  FLOAT: "FloatValue",
  STRING: "StringValue",
  BOOLEAN: "BooleanValue",
  NULL: "NullValue",
  ENUM: "EnumValue",
  LIST: "ListValue",
  OBJECT: "ObjectValue",
  OBJECT_FIELD: "ObjectField",
  DIRECTIVE: "Directive",
  NAMED_TYPE: "NamedType",
  LIST_TYPE: "ListType",
  NON_NULL_TYPE: "NonNullType"
};
class yr extends Error {
  constructor(e, t, r, i, s, o, c) {
    super(e), this.name = "GraphQLError", this.message = e, s && (this.path = s), t && (this.nodes = Array.isArray(t) ? t : [t]), r && (this.source = r), i && (this.positions = i), o && (this.originalError = o);
    var h = c;
    if (!h && o) {
      var f = o.extensions;
      f && typeof f == "object" && (h = f);
    }
    this.extensions = h || {};
  }
  toJSON() {
    return {
      ...this,
      message: this.message
    };
  }
  toString() {
    return this.message;
  }
  get [Symbol.toStringTag]() {
    return "GraphQLError";
  }
}
var W, M;
function oe(n) {
  return new yr(`Syntax Error: Unexpected token at ${M} in ${n}`);
}
function _e(n) {
  if (n.lastIndex = M, n.test(W))
    return W.slice(M, M = n.lastIndex);
}
var dn = / +(?=[^\s])/y;
function Ma(n) {
  for (var e = n.split(`
`), t = "", r = 0, i = 0, s = e.length - 1, o = 0; o < e.length; o++)
    dn.lastIndex = 0, dn.test(e[o]) && (o && (!r || dn.lastIndex < r) && (r = dn.lastIndex), i = i || o, s = o);
  for (var c = i; c <= s; c++)
    c !== i && (t += `
`), t += e[c].slice(r).replace(/\\"""/g, '"""');
  return t;
}
function H() {
  for (var n = 0 | W.charCodeAt(M++); n === 9 || n === 10 || n === 13 || n === 32 || n === 35 || n === 44 || n === 65279; n = 0 | W.charCodeAt(M++))
    if (n === 35)
      for (; (n = W.charCodeAt(M++)) !== 10 && n !== 13; )
        ;
  M--;
}
var ke = /[_A-Za-z]\w*/y, ir = new RegExp("(?:(null|true|false)|\\$(" + ke.source + ')|(-?\\d+)((?:\\.\\d+)?[eE][+-]?\\d+|\\.\\d+)?|("""(?:"""|(?:[\\s\\S]*?[^\\\\])"""))|("(?:"|[^\\r\\n]*?[^\\\\]"))|(' + ke.source + "))", "y"), at = function(n) {
  return n[n.Const = 1] = "Const", n[n.Var = 2] = "Var", n[n.Int = 3] = "Int", n[n.Float = 4] = "Float", n[n.BlockString = 5] = "BlockString", n[n.String = 6] = "String", n[n.Enum = 7] = "Enum", n;
}(at || {}), Na = /\\/;
function _n(n) {
  var e, t;
  if (ir.lastIndex = M, W.charCodeAt(M) === 91) {
    M++, H();
    for (var r = []; W.charCodeAt(M) !== 93; )
      r.push(_n(n));
    return M++, H(), {
      kind: "ListValue",
      values: r
    };
  } else if (W.charCodeAt(M) === 123) {
    M++, H();
    for (var i = []; W.charCodeAt(M) !== 125; ) {
      if ((e = _e(ke)) == null || (H(), W.charCodeAt(M++) !== 58))
        throw oe("ObjectField");
      H(), i.push({
        kind: "ObjectField",
        name: {
          kind: "Name",
          value: e
        },
        value: _n(n)
      });
    }
    return M++, H(), {
      kind: "ObjectValue",
      fields: i
    };
  } else if ((t = ir.exec(W)) != null) {
    if (M = ir.lastIndex, H(), (e = t[at.Const]) != null)
      return e === "null" ? {
        kind: "NullValue"
      } : {
        kind: "BooleanValue",
        value: e === "true"
      };
    if ((e = t[at.Var]) != null) {
      if (n)
        throw oe("Variable");
      return {
        kind: "Variable",
        name: {
          kind: "Name",
          value: e
        }
      };
    } else if ((e = t[at.Int]) != null) {
      var s;
      return (s = t[at.Float]) != null ? {
        kind: "FloatValue",
        value: e + s
      } : {
        kind: "IntValue",
        value: e
      };
    } else {
      if ((e = t[at.BlockString]) != null)
        return {
          kind: "StringValue",
          value: Ma(e.slice(3, -3)),
          block: !0
        };
      if ((e = t[at.String]) != null)
        return {
          kind: "StringValue",
          value: Na.test(e) ? JSON.parse(e) : e.slice(1, -1),
          block: !1
        };
      if ((e = t[at.Enum]) != null)
        return {
          kind: "EnumValue",
          value: e
        };
    }
  }
  throw oe("Value");
}
function cs(n) {
  if (W.charCodeAt(M) === 40) {
    var e = [];
    M++, H();
    var t;
    do {
      if ((t = _e(ke)) == null || (H(), W.charCodeAt(M++) !== 58))
        throw oe("Argument");
      H(), e.push({
        kind: "Argument",
        name: {
          kind: "Name",
          value: t
        },
        value: _n(n)
      });
    } while (W.charCodeAt(M) !== 41);
    return M++, H(), e;
  }
}
function Tt(n) {
  if (W.charCodeAt(M) === 64) {
    var e = [], t;
    do {
      if (M++, (t = _e(ke)) == null)
        throw oe("Directive");
      H(), e.push({
        kind: "Directive",
        name: {
          kind: "Name",
          value: t
        },
        arguments: cs(n)
      });
    } while (W.charCodeAt(M) === 64);
    return e;
  }
}
function Ra() {
  for (var n, e = 0; W.charCodeAt(M) === 91; )
    e++, M++, H();
  if ((n = _e(ke)) == null)
    throw oe("NamedType");
  H();
  var t = {
    kind: "NamedType",
    name: {
      kind: "Name",
      value: n
    }
  };
  do
    if (W.charCodeAt(M) === 33 && (M++, H(), t = {
      kind: "NonNullType",
      type: t
    }), e) {
      if (W.charCodeAt(M++) !== 93)
        throw oe("NamedType");
      H(), t = {
        kind: "ListType",
        type: t
      };
    }
  while (e--);
  return t;
}
var sr = new RegExp("(?:(\\.{3})|(" + ke.source + "))", "y"), mr = function(n) {
  return n[n.Spread = 1] = "Spread", n[n.Name = 2] = "Name", n;
}(mr || {});
function $n() {
  var n = [], e, t;
  do
    if (sr.lastIndex = M, (t = sr.exec(W)) != null) {
      if (M = sr.lastIndex, t[mr.Spread] != null) {
        H();
        var r = _e(ke);
        if (r != null && r !== "on")
          H(), n.push({
            kind: "FragmentSpread",
            name: {
              kind: "Name",
              value: r
            },
            directives: Tt(!1)
          });
        else {
          if (H(), r === "on") {
            if ((r = _e(ke)) == null)
              throw oe("NamedType");
            H();
          }
          var i = Tt(!1);
          if (W.charCodeAt(M++) !== 123)
            throw oe("InlineFragment");
          H(), n.push({
            kind: "InlineFragment",
            typeCondition: r ? {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: r
              }
            } : void 0,
            directives: i,
            selectionSet: $n()
          });
        }
      } else if ((e = t[mr.Name]) != null) {
        var s = void 0;
        if (H(), W.charCodeAt(M) === 58) {
          if (M++, H(), s = e, (e = _e(ke)) == null)
            throw oe("Field");
          H();
        }
        var o = cs(!1);
        H();
        var c = Tt(!1), h = void 0;
        W.charCodeAt(M) === 123 && (M++, H(), h = $n()), n.push({
          kind: "Field",
          alias: s ? {
            kind: "Name",
            value: s
          } : void 0,
          name: {
            kind: "Name",
            value: e
          },
          arguments: o,
          directives: c,
          selectionSet: h
        });
      }
    } else
      throw oe("SelectionSet");
  while (W.charCodeAt(M) !== 125);
  return M++, H(), {
    kind: "SelectionSet",
    selections: n
  };
}
function Oa() {
  var n, e;
  if ((n = _e(ke)) == null || (H(), _e(ke) !== "on") || (H(), (e = _e(ke)) == null))
    throw oe("FragmentDefinition");
  H();
  var t = Tt(!1);
  if (W.charCodeAt(M++) !== 123)
    throw oe("FragmentDefinition");
  return H(), {
    kind: "FragmentDefinition",
    name: {
      kind: "Name",
      value: n
    },
    typeCondition: {
      kind: "NamedType",
      name: {
        kind: "Name",
        value: e
      }
    },
    directives: t,
    selectionSet: $n()
  };
}
var Ua = /(?:query|mutation|subscription|fragment)/y;
function Fa(n) {
  var e, t, r;
  if (n && (H(), e = _e(ke), t = function() {
    if (H(), W.charCodeAt(M) === 40) {
      var s = [];
      M++, H();
      var o;
      do {
        if (W.charCodeAt(M++) !== 36 || (o = _e(ke)) == null)
          throw oe("Variable");
        if (H(), W.charCodeAt(M++) !== 58)
          throw oe("VariableDefinition");
        H();
        var c = Ra(), h = void 0;
        W.charCodeAt(M) === 61 && (M++, H(), h = _n(!0)), H(), s.push({
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: o
            }
          },
          type: c,
          defaultValue: h,
          directives: Tt(!0)
        });
      } while (W.charCodeAt(M) !== 41);
      return M++, H(), s;
    }
  }(), r = Tt(!1)), W.charCodeAt(M) === 123)
    return M++, H(), {
      kind: "OperationDefinition",
      operation: n || "query",
      name: e ? {
        kind: "Name",
        value: e
      } : void 0,
      variableDefinitions: t,
      directives: r,
      selectionSet: $n()
    };
}
function Ha(n, e) {
  return M = 0, function(r, i) {
    var s, o;
    H();
    var c = [];
    do
      if ((s = _e(Ua)) === "fragment")
        H(), c.push(Oa());
      else if ((o = Fa(s)) != null)
        c.push(o);
      else
        throw oe("Document");
    while (M < r.length);
    return {
      kind: "Document",
      definitions: c
    };
  }(W = typeof n.body == "string" ? n.body : n);
}
function ve(n, e, t) {
  for (var r = "", i = 0; i < n.length; i++)
    i && (r += e), r += t(n[i]);
  return r;
}
function La(n) {
  return JSON.stringify(n);
}
function qa(n) {
  return `"""
` + n.replace(/"""/g, '\\"""') + `
"""`;
}
var Pe = `
`, ue = {
  OperationDefinition(n) {
    var e = n.operation;
    return n.name && (e += " " + n.name.value), n.variableDefinitions && n.variableDefinitions.length && (n.name || (e += " "), e += "(" + ve(n.variableDefinitions, ", ", ue.VariableDefinition) + ")"), n.directives && n.directives.length && (e += " " + ve(n.directives, " ", ue.Directive)), e !== "query" ? e + " " + ue.SelectionSet(n.selectionSet) : ue.SelectionSet(n.selectionSet);
  },
  VariableDefinition(n) {
    var e = ue.Variable(n.variable) + ": " + ze(n.type);
    return n.defaultValue && (e += " = " + ze(n.defaultValue)), n.directives && n.directives.length && (e += " " + ve(n.directives, " ", ue.Directive)), e;
  },
  Field(n) {
    var e = n.alias ? n.alias.value + ": " + n.name.value : n.name.value;
    if (n.arguments && n.arguments.length) {
      var t = ve(n.arguments, ", ", ue.Argument);
      e.length + t.length + 2 > 80 ? e += "(" + (Pe += "  ") + ve(n.arguments, Pe, ue.Argument) + (Pe = Pe.slice(0, -2)) + ")" : e += "(" + t + ")";
    }
    return n.directives && n.directives.length && (e += " " + ve(n.directives, " ", ue.Directive)), n.selectionSet && n.selectionSet.selections.length && (e += " " + ue.SelectionSet(n.selectionSet)), e;
  },
  StringValue(n) {
    return n.block ? qa(n.value).replace(/\n/g, Pe) : La(n.value);
  },
  BooleanValue: (n) => "" + n.value,
  NullValue: (n) => "null",
  IntValue: (n) => n.value,
  FloatValue: (n) => n.value,
  EnumValue: (n) => n.value,
  Name: (n) => n.value,
  Variable: (n) => "$" + n.name.value,
  ListValue: (n) => "[" + ve(n.values, ", ", ze) + "]",
  ObjectValue: (n) => "{" + ve(n.fields, ", ", ue.ObjectField) + "}",
  ObjectField: (n) => n.name.value + ": " + ze(n.value),
  Document(n) {
    return !n.definitions || !n.definitions.length ? "" : ve(n.definitions, `

`, ze);
  },
  SelectionSet: (n) => "{" + (Pe += "  ") + ve(n.selections, Pe, ze) + (Pe = Pe.slice(0, -2)) + "}",
  Argument: (n) => n.name.value + ": " + ze(n.value),
  FragmentSpread(n) {
    var e = "..." + n.name.value;
    return n.directives && n.directives.length && (e += " " + ve(n.directives, " ", ue.Directive)), e;
  },
  InlineFragment(n) {
    var e = "...";
    return n.typeCondition && (e += " on " + n.typeCondition.name.value), n.directives && n.directives.length && (e += " " + ve(n.directives, " ", ue.Directive)), e += " " + ue.SelectionSet(n.selectionSet);
  },
  FragmentDefinition(n) {
    var e = "fragment " + n.name.value;
    return e += " on " + n.typeCondition.name.value, n.directives && n.directives.length && (e += " " + ve(n.directives, " ", ue.Directive)), e + " " + ue.SelectionSet(n.selectionSet);
  },
  Directive(n) {
    var e = "@" + n.name.value;
    return n.arguments && n.arguments.length && (e += "(" + ve(n.arguments, ", ", ue.Argument) + ")"), e;
  },
  NamedType: (n) => n.name.value,
  ListType: (n) => "[" + ze(n.type) + "]",
  NonNullType: (n) => ze(n.type) + "!"
}, ze = (n) => ue[n.kind](n);
function Pa(n) {
  return Pe = `
`, ue[n.kind] ? ue[n.kind](n) : "";
}
var hs = () => {
}, $e = hs;
function Fe(n) {
  return {
    tag: 0,
    0: n
  };
}
function an(n) {
  return {
    tag: 1,
    0: n
  };
}
var si = () => typeof Symbol == "function" && Symbol.asyncIterator || "@@asyncIterator", Da = (n) => n;
function de(n) {
  return (e) => (t) => {
    var r = $e;
    e((i) => {
      i === 0 ? t(0) : i.tag === 0 ? (r = i[0], t(i)) : n(i[0]) ? t(i) : r(0);
    });
  };
}
function Jt(n) {
  return (e) => (t) => e((r) => {
    r === 0 || r.tag === 0 ? t(r) : t(an(n(r[0])));
  });
}
function Ar(n) {
  return (e) => (t) => {
    var r = [], i = $e, s = !1, o = !1;
    e((c) => {
      o || (c === 0 ? (o = !0, r.length || t(0)) : c.tag === 0 ? i = c[0] : (s = !1, function(f) {
        var l = $e;
        f((y) => {
          if (y === 0) {
            if (r.length) {
              var p = r.indexOf(l);
              p > -1 && (r = r.slice()).splice(p, 1), r.length || (o ? t(0) : s || (s = !0, i(0)));
            }
          } else y.tag === 0 ? (r.push(l = y[0]), l(0)) : r.length && (t(y), l(0));
        });
      }(n(c[0])), s || (s = !0, i(0))));
    }), t(Fe((c) => {
      if (c === 1) {
        o || (o = !0, i(1));
        for (var h = 0, f = r, l = r.length; h < l; h++)
          f[h](1);
        r.length = 0;
      } else {
        !o && !s ? (s = !0, i(0)) : s = !1;
        for (var y = 0, p = r, g = r.length; y < g; y++)
          p[y](0);
      }
    }));
  };
}
function Ka(n) {
  return Ar(Da)(n);
}
function Mt(n) {
  return Ka(Qa(n));
}
function fs(n) {
  return (e) => (t) => {
    var r = !1;
    e((i) => {
      if (!r) if (i === 0)
        r = !0, t(0), n();
      else if (i.tag === 0) {
        var s = i[0];
        t(Fe((o) => {
          o === 1 ? (r = !0, s(1), n()) : s(o);
        }));
      } else
        t(i);
    });
  };
}
function Kn(n) {
  return (e) => (t) => {
    var r = !1;
    e((i) => {
      if (!r) if (i === 0)
        r = !0, t(0);
      else if (i.tag === 0) {
        var s = i[0];
        t(Fe((o) => {
          o === 1 && (r = !0), s(o);
        }));
      } else
        n(i[0]), t(i);
    });
  };
}
function oi(n) {
  return (e) => (t) => e((r) => {
    r === 0 ? t(0) : r.tag === 0 ? (t(r), n()) : t(r);
  });
}
function tn(n) {
  var e = [], t = $e, r = !1;
  return (i) => {
    e.push(i), e.length === 1 && n((s) => {
      if (s === 0) {
        for (var o = 0, c = e, h = e.length; o < h; o++)
          c[o](0);
        e.length = 0;
      } else if (s.tag === 0)
        t = s[0];
      else {
        r = !1;
        for (var f = 0, l = e, y = e.length; f < y; f++)
          l[f](s);
      }
    }), i(Fe((s) => {
      if (s === 1) {
        var o = e.indexOf(i);
        o > -1 && (e = e.slice()).splice(o, 1), e.length || t(1);
      } else r || (r = !0, t(0));
    }));
  };
}
function ai(n) {
  return (e) => (t) => {
    var r = $e, i = $e, s = !1, o = !1, c = !1, h = !1;
    e((f) => {
      h || (f === 0 ? (h = !0, c || t(0)) : f.tag === 0 ? r = f[0] : (c && (i(1), i = $e), s ? s = !1 : (s = !0, r(0)), function(y) {
        c = !0, y((p) => {
          c && (p === 0 ? (c = !1, h ? t(0) : s || (s = !0, r(0))) : p.tag === 0 ? (o = !1, (i = p[0])(0)) : (t(p), o ? o = !1 : i(0)));
        });
      }(n(f[0]))));
    }), t(Fe((f) => {
      f === 1 ? (h || (h = !0, r(1)), c && (c = !1, i(1))) : (!h && !s && (s = !0, r(0)), c && !o && (o = !0, i(0)));
    }));
  };
}
function ds(n) {
  return (e) => (t) => {
    var r = $e, i = !1, s = 0;
    e((o) => {
      i || (o === 0 ? (i = !0, t(0)) : o.tag === 0 ? r = o[0] : s++ < n ? (t(o), !i && s >= n && (i = !0, t(0), r(1))) : t(o));
    }), t(Fe((o) => {
      o === 1 && !i ? (i = !0, r(1)) : o === 0 && !i && s < n && r(0);
    }));
  };
}
function Ir(n) {
  return (e) => (t) => {
    var r = $e, i = $e, s = !1;
    e((o) => {
      s || (o === 0 ? (s = !0, i(1), t(0)) : o.tag === 0 ? (r = o[0], n((c) => {
        c === 0 || (c.tag === 0 ? (i = c[0])(0) : (s = !0, i(1), r(1), t(0)));
      })) : t(o));
    }), t(Fe((o) => {
      o === 1 && !s ? (s = !0, r(1), i(1)) : s || r(0);
    }));
  };
}
function Wa(n, e) {
  return (t) => (r) => {
    var i = $e, s = !1;
    t((o) => {
      s || (o === 0 ? (s = !0, r(0)) : o.tag === 0 ? (i = o[0], r(o)) : n(o[0]) ? r(o) : (s = !0, r(o), r(0), i(1)));
    });
  };
}
function ja(n) {
  return (e) => n()(e);
}
function ps(n) {
  return (e) => {
    var t = n[si()] && n[si()]() || n, r = !1, i = !1, s = !1, o;
    e(Fe(async (c) => {
      if (c === 1)
        r = !0, t.return && t.return();
      else if (i)
        s = !0;
      else {
        for (s = i = !0; s && !r; )
          if ((o = await t.next()).done)
            r = !0, t.return && await t.return(), e(0);
          else
            try {
              s = !1, e(an(o.value));
            } catch (h) {
              if (t.throw)
                (r = !!(await t.throw(h)).done) && e(0);
              else
                throw h;
            }
        i = !1;
      }
    }));
  };
}
function Va(n) {
  return n[Symbol.asyncIterator] ? ps(n) : (e) => {
    var t = n[Symbol.iterator](), r = !1, i = !1, s = !1, o;
    e(Fe((c) => {
      if (c === 1)
        r = !0, t.return && t.return();
      else if (i)
        s = !0;
      else {
        for (s = i = !0; s && !r; )
          if ((o = t.next()).done)
            r = !0, t.return && t.return(), e(0);
          else
            try {
              s = !1, e(an(o.value));
            } catch (h) {
              if (t.throw)
                (r = !!t.throw(h).done) && e(0);
              else
                throw h;
            }
        i = !1;
      }
    }));
  };
}
var Qa = Va;
function or(n) {
  return (e) => {
    var t = !1;
    e(Fe((r) => {
      r === 1 ? t = !0 : t || (t = !0, e(an(n)), e(0));
    }));
  };
}
function ys(n) {
  return (e) => {
    var t = !1, r = n({
      next(i) {
        t || e(an(i));
      },
      complete() {
        t || (t = !0, e(0));
      }
    });
    e(Fe((i) => {
      i === 1 && !t && (t = !0, r());
    }));
  };
}
function ui() {
  var n, e;
  return {
    source: tn(ys((t) => (n = t.next, e = t.complete, hs))),
    next(t) {
      n && n(t);
    },
    complete() {
      e && e();
    }
  };
}
function Tn(n) {
  return (e) => {
    var t = $e, r = !1;
    return e((i) => {
      i === 0 ? r = !0 : i.tag === 0 ? (t = i[0])(0) : r || (n(i[0]), t(0));
    }), {
      unsubscribe() {
        r || (r = !0, t(1));
      }
    };
  };
}
function Ga(n) {
  Tn((e) => {
  })(n);
}
function za(n) {
  return new Promise((e) => {
    var t = $e, r;
    n((i) => {
      i === 0 ? Promise.resolve(r).then(e) : i.tag === 0 ? (t = i[0])(0) : (r = i[0], t(0));
    });
  });
}
var Ja = (...n) => {
  for (var e = n[0], t = 1, r = n.length; t < r; t++)
    e = n[t](e);
  return e;
}, Xa = (n) => n && typeof n.message == "string" && (n.extensions || n.name === "GraphQLError") ? n : typeof n == "object" && typeof n.message == "string" ? new yr(n.message, n.nodes, n.source, n.positions, n.path, n, n.extensions || {}) : new yr(n);
class Er extends Error {
  constructor(e) {
    var t = (e.graphQLErrors || []).map(Xa), r = ((i, s) => {
      var o = "";
      if (i)
        return `[Network] ${i.message}`;
      if (s)
        for (var c = 0, h = s.length; c < h; c++)
          o && (o += `
`), o += `[GraphQL] ${s[c].message}`;
      return o;
    })(e.networkError, t);
    super(r), this.name = "CombinedError", this.message = r, this.graphQLErrors = t, this.networkError = e.networkError, this.response = e.response;
  }
  toString() {
    return this.message;
  }
}
var bn = (n, e) => {
  for (var t = 0 | (e || 5381), r = 0, i = 0 | n.length; r < i; r++)
    t = (t << 5) + t + n.charCodeAt(r);
  return t;
}, xt = /* @__PURE__ */ new Set(), li = /* @__PURE__ */ new WeakMap(), _t = (n, e) => {
  if (n === null || xt.has(n))
    return "null";
  if (typeof n != "object")
    return JSON.stringify(n) || "";
  if (n.toJSON)
    return _t(n.toJSON(), e);
  if (Array.isArray(n)) {
    for (var t = "[", r = 0, i = n.length; r < i; r++)
      t.length > 1 && (t += ","), t += _t(n[r], e) || "null";
    return t += "]";
  } else if (!e && (Cn !== Nt && n instanceof Cn || Mn !== Nt && n instanceof Mn))
    return "null";
  var s = Object.keys(n).sort();
  if (!s.length && n.constructor && Object.getPrototypeOf(n).constructor !== Object.prototype.constructor) {
    var o = li.get(n) || Math.random().toString(36).slice(2);
    return li.set(n, o), _t({
      __key: o
    }, e);
  }
  xt.add(n);
  for (var c = "{", h = 0, f = s.length; h < f; h++) {
    var l = _t(n[s[h]], e);
    l && (c.length > 1 && (c += ","), c += _t(s[h], e) + ":" + l);
  }
  return xt.delete(n), c += "}";
}, gr = (n, e, t) => {
  if (!(t == null || typeof t != "object" || t.toJSON || xt.has(t))) if (Array.isArray(t))
    for (var r = 0, i = t.length; r < i; r++)
      gr(n, `${e}.${r}`, t[r]);
  else if (t instanceof Cn || t instanceof Mn)
    n.set(e, t);
  else {
    xt.add(t);
    for (var s in t)
      gr(n, `${e}.${s}`, t[s]);
  }
}, Bn = (n, e) => (xt.clear(), _t(n, e || !1));
class Nt {
}
var Cn = typeof File < "u" ? File : Nt, Mn = typeof Blob < "u" ? Blob : Nt, Ya = /("{3}[\s\S]*"{3}|"(?:\\.|[^"])*")/g, Za = /(?:#[^\n\r]+)?(?:[\r\n]+|$)/g, eu = (n, e) => e % 2 == 0 ? n.replace(Za, `
`) : n, ci = (n) => n.split(Ya).map(eu).join("").trim(), hi = /* @__PURE__ */ new Map(), xn = /* @__PURE__ */ new Map(), Wn = (n) => {
  var e;
  return typeof n == "string" ? e = ci(n) : n.loc && xn.get(n.__key) === n ? e = n.loc.source.body : (e = hi.get(n) || ci(Pa(n)), hi.set(n, e)), typeof n != "string" && !n.loc && (n.loc = {
    start: 0,
    end: e.length,
    source: {
      body: e,
      name: "gql",
      locationOffset: {
        line: 1,
        column: 1
      }
    }
  }), e;
}, fi = (n) => {
  var e;
  if (n.documentId)
    e = bn(n.documentId);
  else if (e = bn(Wn(n)), n.definitions) {
    var t = ms(n);
    t && (e = bn(`
# ${t}`, e));
  }
  return e;
}, Nn = (n) => {
  var e, t;
  return typeof n == "string" ? (e = fi(n), t = xn.get(e) || Ha(n)) : (e = n.__key || fi(n), t = xn.get(e) || n), t.loc || Wn(t), t.__key = e, xn.set(e, t), t;
}, ar = (n, e, t) => {
  var r = e || {}, i = Nn(n), s = Bn(r, !0), o = i.__key;
  return s !== "{}" && (o = bn(s, o)), {
    key: o,
    query: i,
    variables: r,
    extensions: t
  };
}, ms = (n) => {
  for (var e = 0, t = n.definitions.length; e < t; e++) {
    var r = n.definitions[e];
    if (r.kind === ht.OPERATION_DEFINITION)
      return r.name ? r.name.value : void 0;
  }
}, tu = (n) => {
  for (var e = 0, t = n.definitions.length; e < t; e++) {
    var r = n.definitions[e];
    if (r.kind === ht.OPERATION_DEFINITION)
      return r.operation;
  }
}, Rn = (n, e, t) => {
  if (!("data" in e || "errors" in e && Array.isArray(e.errors)))
    throw new Error("No Content");
  var r = n.kind === "subscription";
  return {
    operation: n,
    data: e.data,
    error: Array.isArray(e.errors) ? new Er({
      graphQLErrors: e.errors,
      response: t
    }) : void 0,
    extensions: e.extensions ? {
      ...e.extensions
    } : void 0,
    hasNext: e.hasNext == null ? r : e.hasNext,
    stale: !1
  };
}, On = (n, e) => {
  if (typeof n == "object" && n != null) {
    if (Array.isArray(n)) {
      n = [...n];
      for (var t = 0, r = e.length; t < r; t++)
        n[t] = On(n[t], e[t]);
      return n;
    }
    if (!n.constructor || n.constructor === Object) {
      n = {
        ...n
      };
      for (var i in e)
        n[i] = On(n[i], e[i]);
      return n;
    }
  }
  return e;
}, gs = (n, e, t, r) => {
  var i = n.error ? n.error.graphQLErrors : [], s = !!n.extensions || !!(e.payload || e).extensions, o = {
    ...n.extensions,
    ...(e.payload || e).extensions
  }, c = e.incremental;
  "path" in e && (c = [e]);
  var h = {
    data: n.data
  };
  if (c)
    for (var f = function() {
      var p = c[l];
      Array.isArray(p.errors) && i.push(...p.errors), p.extensions && (Object.assign(o, p.extensions), s = !0);
      var g = "data", b = h, A = [];
      if (p.path)
        A = p.path;
      else if (r) {
        var S = r.find((I) => I.id === p.id);
        p.subPath ? A = [...S.path, ...p.subPath] : A = S.path;
      }
      for (var $ = 0, B = A.length; $ < B; g = A[$++])
        b = b[g] = Array.isArray(b[g]) ? [...b[g]] : {
          ...b[g]
        };
      if (p.items)
        for (var T = +g >= 0 ? g : 0, x = 0, _ = p.items.length; x < _; x++)
          b[T + x] = On(b[T + x], p.items[x]);
      else p.data !== void 0 && (b[g] = On(b[g], p.data));
    }, l = 0, y = c.length; l < y; l++)
      f();
  else
    h.data = (e.payload || e).data || n.data, i = e.errors || e.payload && e.payload.errors || i;
  return {
    operation: n.operation,
    data: h.data,
    error: i.length ? new Er({
      graphQLErrors: i,
      response: t
    }) : void 0,
    extensions: s ? o : void 0,
    hasNext: e.hasNext != null ? e.hasNext : n.hasNext,
    stale: !1
  };
}, ws = (n, e, t) => ({
  operation: n,
  data: void 0,
  error: new Er({
    networkError: e,
    response: t
  }),
  extensions: void 0,
  hasNext: !1,
  stale: !1
});
function bs(n) {
  var e = {
    query: void 0,
    documentId: void 0,
    operationName: ms(n.query),
    variables: n.variables || void 0,
    extensions: n.extensions
  };
  return "documentId" in n.query && n.query.documentId && (!n.query.definitions || !n.query.definitions.length) ? e.documentId = n.query.documentId : (!n.extensions || !n.extensions.persistedQuery || n.extensions.persistedQuery.miss) && (e.query = Wn(n.query)), e;
}
var nu = (n, e) => {
  var t = n.kind === "query" && n.context.preferGetMethod;
  if (!t || !e)
    return n.context.url;
  var r = ru(n.context.url);
  for (var i in e) {
    var s = e[i];
    s && r[1].set(i, typeof s == "object" ? Bn(s) : s);
  }
  var o = r.join("?");
  return o.length > 2047 && t !== "force" ? (n.context.preferGetMethod = !1, n.context.url) : o;
}, ru = (n) => {
  var e = n.indexOf("?");
  return e > -1 ? [n.slice(0, e), new URLSearchParams(n.slice(e + 1))] : [n, new URLSearchParams()];
}, iu = (n, e) => {
  if (!(n.kind === "query" && n.context.preferGetMethod)) {
    var t = Bn(e), r = ((c) => {
      var h = /* @__PURE__ */ new Map();
      return (Cn !== Nt || Mn !== Nt) && (xt.clear(), gr(h, "variables", c)), h;
    })(e.variables);
    if (r.size) {
      var i = new FormData();
      i.append("operations", t), i.append("map", Bn({
        ...[...r.keys()].map((c) => [c])
      }));
      var s = 0;
      for (var o of r.values())
        i.append("" + s++, o);
      return i;
    }
    return t;
  }
}, su = (n, e) => {
  var t = {
    accept: n.kind === "subscription" ? "text/event-stream, multipart/mixed" : "application/graphql-response+json, application/graphql+json, application/json, text/event-stream, multipart/mixed"
  }, r = (typeof n.context.fetchOptions == "function" ? n.context.fetchOptions() : n.context.fetchOptions) || {};
  if (r.headers)
    if (((o) => "has" in o && !Object.keys(o).length)(r.headers))
      r.headers.forEach((o, c) => {
        t[c] = o;
      });
    else if (Array.isArray(r.headers))
      r.headers.forEach((o, c) => {
        Array.isArray(o) ? t[o[0]] ? t[o[0]] = `${t[o[0]]},${o[1]}` : t[o[0]] = o[1] : t[c] = o;
      });
    else
      for (var i in r.headers)
        t[i.toLowerCase()] = r.headers[i];
  var s = iu(n, e);
  return typeof s == "string" && !t["content-type"] && (t["content-type"] = "application/json"), {
    ...r,
    method: s ? "POST" : "GET",
    body: s,
    headers: t
  };
}, ou = typeof TextDecoder < "u" ? new TextDecoder() : null, au = /boundary="?([^=";]+)"?/i, uu = /data: ?([^\n]+)/, di = (n) => n.constructor.name === "Buffer" ? n.toString() : ou.decode(n);
async function* pi(n) {
  if (n.body[Symbol.asyncIterator])
    for await (var e of n.body)
      yield di(e);
  else {
    var t = n.body.getReader(), r;
    try {
      for (; !(r = await t.read()).done; )
        yield di(r.value);
    } finally {
      t.cancel();
    }
  }
}
async function* yi(n, e) {
  var t = "", r;
  for await (var i of n)
    for (t += i; (r = t.indexOf(e)) > -1; )
      yield t.slice(0, r), t = t.slice(r + e.length);
}
async function* lu(n, e, t) {
  var r = !0, i = null, s;
  try {
    yield await Promise.resolve();
    var o = (s = await (n.context.fetch || fetch)(e, t)).headers.get("Content-Type") || "", c;
    /multipart\/mixed/i.test(o) ? c = async function* (y, p) {
      var g = y.match(au), b = "--" + (g ? g[1] : "-"), A = !0, S;
      for await (var $ of yi(pi(p), `\r
` + b)) {
        if (A) {
          A = !1;
          var B = $.indexOf(b);
          if (B > -1)
            $ = $.slice(B + b.length);
          else
            continue;
        }
        try {
          yield S = JSON.parse($.slice($.indexOf(`\r
\r
`) + 4));
        } catch (T) {
          if (!S)
            throw T;
        }
        if (S && S.hasNext === !1)
          break;
      }
      S && S.hasNext !== !1 && (yield {
        hasNext: !1
      });
    }(o, s) : /text\/event-stream/i.test(o) ? c = async function* (y) {
      var p;
      for await (var g of yi(pi(y), `

`)) {
        var b = g.match(uu);
        if (b) {
          var A = b[1];
          try {
            yield p = JSON.parse(A);
          } catch (S) {
            if (!p)
              throw S;
          }
          if (p && p.hasNext === !1)
            break;
        }
      }
      p && p.hasNext !== !1 && (yield {
        hasNext: !1
      });
    }(s) : /text\//i.test(o) ? c = async function* (y) {
      var p = await y.text();
      try {
        var g = JSON.parse(p);
        "production" !== !0 && console.warn('Found response with content-type "text/plain" but it had a valid "application/json" response.'), yield g;
      } catch {
        throw new Error(p);
      }
    }(s) : c = async function* (y) {
      yield JSON.parse(await y.text());
    }(s);
    var h;
    for await (var f of c)
      f.pending && !i ? h = f.pending : f.pending && (h = [...h, ...f.pending]), i = i ? gs(i, f, s, h) : Rn(n, f, s), r = !1, yield i, r = !0;
    i || (yield i = Rn(n, {}, s));
  } catch (l) {
    if (!r)
      throw l;
    yield ws(n, s && (s.status < 200 || s.status >= 300) && s.statusText ? new Error(s.statusText) : l, s);
  }
}
function cu(n, e, t) {
  var r;
  return typeof AbortController < "u" && (t.signal = (r = new AbortController()).signal), fs(() => {
    r && r.abort();
  })(de((i) => !!i)(ps(lu(n, e, t))));
}
var wr = (n, e) => {
  if (Array.isArray(n))
    for (var t = 0, r = n.length; t < r; t++)
      wr(n[t], e);
  else if (typeof n == "object" && n !== null)
    for (var i in n)
      i === "__typename" && typeof n[i] == "string" ? e.add(n[i]) : wr(n[i], e);
  return e;
}, br = (n) => {
  if ("definitions" in n) {
    for (var e = [], t = 0, r = n.definitions.length; t < r; t++) {
      var i = br(n.definitions[t]);
      e.push(i);
    }
    return {
      ...n,
      definitions: e
    };
  }
  if ("directives" in n && n.directives && n.directives.length) {
    for (var s = [], o = {}, c = 0, h = n.directives.length; c < h; c++) {
      var f = n.directives[c], l = f.name.value;
      l[0] !== "_" ? s.push(f) : l = l.slice(1), o[l] = f;
    }
    n = {
      ...n,
      directives: s,
      _directives: o
    };
  }
  if ("selectionSet" in n) {
    var y = [], p = n.kind === ht.OPERATION_DEFINITION;
    if (n.selectionSet) {
      for (var g = 0, b = n.selectionSet.selections.length; g < b; g++) {
        var A = n.selectionSet.selections[g];
        p = p || A.kind === ht.FIELD && A.name.value === "__typename" && !A.alias;
        var S = br(A);
        y.push(S);
      }
      return p || y.push({
        kind: ht.FIELD,
        name: {
          kind: ht.NAME,
          value: "__typename"
        },
        _generated: !0
      }), {
        ...n,
        selectionSet: {
          ...n.selectionSet,
          selections: y
        }
      };
    }
  }
  return n;
}, mi = /* @__PURE__ */ new Map(), hu = (n) => {
  var e = Nn(n), t = mi.get(e.__key);
  return t || (mi.set(e.__key, t = br(e)), Object.defineProperty(t, "__key", {
    value: e.__key,
    enumerable: !1
  })), t;
};
function gi(n) {
  var e = (t) => n(t);
  return e.toPromise = () => za(ds(1)(de((t) => !t.stale && !t.hasNext)(e))), e.then = (t, r) => e.toPromise().then(t, r), e.subscribe = (t) => Tn(t)(e), e;
}
function Rt(n, e, t) {
  return {
    ...e,
    kind: n,
    context: e.context ? {
      ...e.context,
      ...t
    } : t || e.context
  };
}
var wi = (n, e) => Rt(n.kind, n, {
  meta: {
    ...n.context.meta,
    ...e
  }
}), fu = () => {
};
function le(n) {
  for (var e = /* @__PURE__ */ new Map(), t = [], r = [], i = Array.isArray(n) ? n[0] : n || "", s = 1; s < arguments.length; s++) {
    var o = arguments[s];
    o && o.definitions ? r.push(o) : i += o, i += arguments[0][s];
  }
  r.unshift(Nn(i));
  for (var c = 0; c < r.length; c++)
    for (var h = 0; h < r[c].definitions.length; h++) {
      var f = r[c].definitions[h];
      if (f.kind === ht.FRAGMENT_DEFINITION) {
        var l = f.name.value, y = Wn(f);
        e.has(l) ? e.get(l) !== y && console.warn("[WARNING: Duplicate Fragment] A fragment with name `" + l + "` already exists in this document.\nWhile fragment names may not be unique across your source, each name must be unique per document.") : (e.set(l, y), t.push(f));
      } else
        t.push(f);
    }
  return Nn({
    kind: ht.DOCUMENT,
    definitions: t
  });
}
var ur = ({ kind: n }) => n !== "mutation" && n !== "query", du = (n) => {
  var e = hu(n.query);
  if (e !== n.query) {
    var t = Rt(n.kind, n);
    return t.query = e, t;
  } else
    return n;
}, pu = ({ forward: n, client: e, dispatchDebug: t }) => {
  var r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), s = (o) => o.kind === "query" && o.context.requestPolicy !== "network-only" && (o.context.requestPolicy === "cache-only" || r.has(o.key));
  return (o) => {
    var c = Jt((f) => {
      var l = r.get(f.key);
      t({
        operation: f,
        ...l ? {
          type: "cacheHit",
          message: "The result was successfully retried from the cache"
        } : {
          type: "cacheMiss",
          message: "The result could not be retrieved from the cache"
        },
        source: "cacheExchange"
      });
      var y = l || Rn(f, {
        data: null
      });
      return y = {
        ...y,
        operation: wi(f, {
          cacheOutcome: l ? "hit" : "miss"
        })
      }, f.context.requestPolicy === "cache-and-network" && (y.stale = !0, bi(e, f)), y;
    })(de((f) => !ur(f) && s(f))(o)), h = Kn((f) => {
      var { operation: l } = f;
      if (l) {
        var y = l.context.additionalTypenames || [];
        if (f.operation.kind !== "subscription" && (y = ((_) => [...wr(_, /* @__PURE__ */ new Set())])(f.data).concat(y)), f.operation.kind === "mutation" || f.operation.kind === "subscription") {
          var p = /* @__PURE__ */ new Set();
          t({
            type: "cacheInvalidation",
            message: `The following typenames have been invalidated: ${y}`,
            operation: l,
            data: {
              typenames: y,
              response: f
            },
            source: "cacheExchange"
          });
          for (var g = 0; g < y.length; g++) {
            var b = y[g], A = i.get(b);
            A || i.set(b, A = /* @__PURE__ */ new Set());
            for (var S of A.values())
              p.add(S);
            A.clear();
          }
          for (var $ of p.values())
            r.has($) && (l = r.get($).operation, r.delete($), bi(e, l));
        } else if (l.kind === "query" && f.data) {
          r.set(l.key, f);
          for (var B = 0; B < y.length; B++) {
            var T = y[B], x = i.get(T);
            x || i.set(T, x = /* @__PURE__ */ new Set()), x.add(l.key);
          }
        }
      }
    })(n(de((f) => f.kind !== "query" || f.context.requestPolicy !== "cache-only")(Jt((f) => wi(f, {
      cacheOutcome: "miss"
    }))(Mt([Jt(du)(de((f) => !ur(f) && !s(f))(o)), de((f) => ur(f))(o)])))));
    return Mt([c, h]);
  };
}, bi = (n, e) => n.reexecuteOperation(Rt(e.kind, e, {
  requestPolicy: "network-only"
})), yu = ({ forwardSubscription: n, enableAllOperations: e, isSubscriptionOperation: t }) => ({ client: r, forward: i }) => {
  var s = t || ((o) => o.kind === "subscription" || !!e && (o.kind === "query" || o.kind === "mutation"));
  return (o) => {
    var c = Ar((f) => {
      var { key: l } = f, y = de((p) => p.kind === "teardown" && p.key === l)(o);
      return Ir(y)(((p) => {
        var g = n(bs(p), p);
        return ys((b) => {
          var A = !1, S, $;
          function B(T) {
            b.next($ = $ ? gs($, T) : Rn(p, T));
          }
          return Promise.resolve().then(() => {
            A || (S = g.subscribe({
              next: B,
              error(T) {
                Array.isArray(T) ? B({
                  errors: T
                }) : b.next(ws(p, T)), b.complete();
              },
              complete() {
                A || (A = !0, p.kind === "subscription" && r.reexecuteOperation(Rt("teardown", p, p.context)), $ && $.hasNext && B({
                  hasNext: !1
                }), b.complete());
              }
            }));
          }), () => {
            A = !0, S && S.unsubscribe();
          };
        });
      })(f));
    })(de((f) => f.kind !== "teardown" && s(f))(o)), h = i(de((f) => f.kind === "teardown" || !s(f))(o));
    return Mt([c, h]);
  };
}, mu = ({ forward: n, dispatchDebug: e }) => (t) => {
  var r = Ar((s) => {
    var o = bs(s), c = nu(s, o), h = su(s, o);
    e({
      type: "fetchRequest",
      message: "A fetch request is being executed.",
      operation: s,
      data: {
        url: c,
        fetchOptions: h
      },
      source: "fetchExchange"
    });
    var f = Ir(de((l) => l.kind === "teardown" && l.key === s.key)(t))(cu(s, c, h));
    return Kn((l) => {
      var y = l.data ? void 0 : l.error;
      e({
        type: y ? "fetchError" : "fetchSuccess",
        message: `A ${y ? "failed" : "successful"} fetch response has been returned.`,
        operation: s,
        data: {
          url: c,
          fetchOptions: h,
          value: y || l
        },
        source: "fetchExchange"
      });
    })(f);
  })(de((s) => s.kind !== "teardown" && (s.kind !== "subscription" || !!s.context.fetchSubscriptions))(t)), i = n(de((s) => s.kind === "teardown" || s.kind === "subscription" && !s.context.fetchSubscriptions)(t));
  return Mt([r, i]);
}, gu = (n) => ({ client: e, forward: t, dispatchDebug: r }) => n.reduceRight((i, s) => {
  var o = !1;
  return s({
    client: e,
    forward(c) {
      {
        if (o)
          throw new Error("forward() must only be called once in each Exchange.");
        o = !0;
      }
      return tn(i(tn(c)));
    },
    dispatchDebug(c) {
      r({
        timestamp: Date.now(),
        source: s.name,
        ...c
      });
    }
  });
}, t), wu = ({ dispatchDebug: n }) => (e) => (e = Kn((t) => {
  if (t.kind !== "teardown" && "production" !== !0) {
    var r = `No exchange has handled operations of kind "${t.kind}". Check whether you've added an exchange responsible for these operations.`;
    n({
      type: "fallbackCatch",
      message: r,
      operation: t,
      source: "fallbackExchange"
    }), console.warn(r);
  }
})(e), de((t) => !1)(e)), bu = function n(e) {
  if (!e.url)
    throw new Error("You are creating an urql-client without a url.");
  var t = 0, r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set(), o = [], c = {
    url: e.url,
    fetchSubscriptions: e.fetchSubscriptions,
    fetchOptions: e.fetchOptions,
    fetch: e.fetch,
    preferGetMethod: e.preferGetMethod,
    requestPolicy: e.requestPolicy || "cache-first"
  }, h = ui();
  function f(x) {
    (x.kind === "mutation" || x.kind === "teardown" || !s.has(x.key)) && (x.kind === "teardown" ? s.delete(x.key) : x.kind !== "mutation" && s.add(x.key), h.next(x));
  }
  var l = !1;
  function y(x) {
    if (x && f(x), !l) {
      for (l = !0; l && (x = o.shift()); )
        f(x);
      l = !1;
    }
  }
  var p = (x) => {
    var _ = Ir(de((I) => I.kind === "teardown" && I.key === x.key)(h.source))(de((I) => I.operation.kind === x.kind && I.operation.key === x.key && (!I.operation.context._instance || I.operation.context._instance === x.context._instance))(T));
    return x.kind !== "query" ? _ = Wa((I) => !!I.hasNext)(_) : _ = ai((I) => {
      var N = or(I);
      return I.stale || I.hasNext ? N : Mt([N, Jt(() => (I.stale = !0, I))(ds(1)(de((O) => O.key === x.key)(h.source)))]);
    })(_), x.kind !== "mutation" ? _ = fs(() => {
      s.delete(x.key), r.delete(x.key), i.delete(x.key), l = !1;
      for (var I = o.length - 1; I >= 0; I--)
        o[I].key === x.key && o.splice(I, 1);
      f(Rt("teardown", x, x.context));
    })(Kn((I) => {
      if (I.stale)
        if (!I.hasNext)
          s.delete(x.key);
        else
          for (var N = 0; N < o.length; N++) {
            var O = o[N];
            if (O.key === I.operation.key) {
              s.delete(O.key);
              break;
            }
          }
      else I.hasNext || s.delete(x.key);
      r.set(x.key, I);
    })(_)) : _ = oi(() => {
      f(x);
    })(_), tn(_);
  }, g = this instanceof n ? this : Object.create(n.prototype), b = Object.assign(g, {
    suspense: !!e.suspense,
    operations$: h.source,
    reexecuteOperation(x) {
      if (x.kind === "teardown")
        y(x);
      else if (x.kind === "mutation")
        o.push(x), Promise.resolve().then(y);
      else if (i.has(x.key)) {
        for (var _ = !1, I = 0; I < o.length; I++)
          o[I].key === x.key && (o[I] = x, _ = !0);
        _ || s.has(x.key) && x.context.requestPolicy !== "network-only" ? (s.delete(x.key), Promise.resolve().then(y)) : (o.push(x), Promise.resolve().then(y));
      }
    },
    createRequestOperation(x, _, I) {
      I || (I = {});
      var N;
      if (x !== "teardown" && (N = tu(_.query)) !== x)
        throw new Error(`Expected operation of type "${x}" but found "${N}"`);
      return Rt(x, _, {
        _instance: x === "mutation" ? t = t + 1 | 0 : void 0,
        ...c,
        ...I,
        requestPolicy: I.requestPolicy || c.requestPolicy,
        suspense: I.suspense || I.suspense !== !1 && b.suspense
      });
    },
    executeRequestOperation(x) {
      return x.kind === "mutation" ? gi(p(x)) : gi(ja(() => {
        var _ = i.get(x.key);
        _ || i.set(x.key, _ = p(x)), _ = oi(() => {
          y(x);
        })(_);
        var I = r.get(x.key);
        return x.kind === "query" && I && (I.stale || I.hasNext) ? ai(or)(Mt([_, de((N) => N === r.get(x.key))(or(I))])) : _;
      }));
    },
    executeQuery(x, _) {
      var I = b.createRequestOperation("query", x, _);
      return b.executeRequestOperation(I);
    },
    executeSubscription(x, _) {
      var I = b.createRequestOperation("subscription", x, _);
      return b.executeRequestOperation(I);
    },
    executeMutation(x, _) {
      var I = b.createRequestOperation("mutation", x, _);
      return b.executeRequestOperation(I);
    },
    readQuery(x, _, I) {
      var N = null;
      return Tn((O) => {
        N = O;
      })(b.query(x, _, I)).unsubscribe(), N;
    },
    query: (x, _, I) => b.executeQuery(ar(x, _), I),
    subscription: (x, _, I) => b.executeSubscription(ar(x, _), I),
    mutation: (x, _, I) => b.executeMutation(ar(x, _), I)
  }), A = fu;
  {
    var { next: S, source: $ } = ui();
    b.subscribeToDebugTarget = (x) => Tn(x)($), A = S;
  }
  var B = gu(e.exchanges), T = tn(B({
    client: b,
    dispatchDebug: A,
    forward: wu({
      dispatchDebug: A
    })
  })(h.source));
  return Ga(T), b;
}, xu = bu;
class ku extends Ae {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = le`query ($bundle: String!) {
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
    return new Ca({
      query: this,
      json: e
    });
  }
}
class vu extends fe {
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
      r.metas = Sn.aggregateMeta(r.metas), t[r.bundleHash] = r;
    }), t;
  }
}
class Su extends Ae {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = le`query( $bundleHashes: [ String! ] ) {
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
    return new vu({
      query: this,
      json: e
    });
  }
}
class jn extends fe {
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
    if (e.position === null || typeof e.position > "u" ? r = V.create({
      bundle: e.bundleHash,
      token: e.tokenSlug,
      batchId: e.batchId,
      characters: e.characters
    }) : (r = new V({
      secret: t,
      token: e.tokenSlug,
      position: e.position,
      batchId: e.batchId,
      characters: e.characters
    }), r.address = e.address, r.bundle = e.bundleHash), e.token && (r.tokenName = e.token.name, r.tokenAmount = e.token.amount, r.tokenSupply = e.token.supply, r.tokenFungibility = e.token.fungibility), e.tokenUnits.length)
      for (const i of e.tokenUnits)
        r.tokenUnits.push(Xt.createFromGraphQL(i));
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
      r.push(jn.toClientWallet({
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
class Au extends Ae {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = le`query( $bundleHash: String, $tokenSlug: String ) {
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
    return new jn({
      query: this,
      json: e
    });
  }
}
class Iu extends fe {
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
    return !e || !e.bundleHash || !e.tokenSlug ? null : jn.toClientWallet({
      data: e
    });
  }
}
class Eu extends Ae {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = le`query( $address: String, $bundleHash: String, $type: String, $token: String, $position: String ) {
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
    return new Iu({
      query: this,
      json: e
    });
  }
}
class _u extends fe {
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
class xi extends Ae {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = le`query( $metaType: String, $metaTypes: [ String! ], $metaId: String, $metaIds: [ String! ], $key: String, $keys: [ String! ], $value: String, $values: [ String! ], $count: String, $latest: Boolean, $filter: [ MetaFilter! ], $queryArgs: QueryArgs, $countBy: String ) {
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
    queryArgs: c = null,
    count: h = null,
    countBy: f = null
  }) {
    const l = {};
    return e && (l[typeof e == "string" ? "metaType" : "metaTypes"] = e), t && (l[typeof t == "string" ? "metaId" : "metaIds"] = t), r && (l[typeof r == "string" ? "key" : "keys"] = r), i && (l[typeof i == "string" ? "value" : "values"] = i), l.latest = s === !0, o && (l.filter = o), c && ((typeof c.limit > "u" || c.limit === 0) && (c.limit = "*"), l.queryArgs = c), h && (l.count = h), f && (l.countBy = f), l;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaType}
   */
  createResponse(e) {
    return new _u({
      query: this,
      json: e
    });
  }
}
class nn extends Ae {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = le`query( $batchId: String ) {
      Batch( batchId: $batchId ) {
        ${nn.getFields()},
        children {
          ${nn.getFields()}
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
    const t = new fe({
      query: this,
      json: e
    });
    return t.dataKey = "data.Batch", t;
  }
}
class $u extends Ae {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = le`query( $batchId: String ) {
      BatchHistory( batchId: $batchId ) {
        ${nn.getFields()}
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
    const t = new fe({
      query: this,
      json: e
    });
    return t.dataKey = "data.BatchHistory", t;
  }
}
class Qe extends fe {
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
    const e = se.get(this.data(), "payload");
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
    const t = new Ze({});
    return t.molecularHash = se.get(e, "molecularHash"), t.status = se.get(e, "status"), t.createdAt = se.get(e, "createdAt"), t;
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
    return se.get(this.data(), "status", "rejected");
  }
  /**
   * Returns the reason for rejection
   *
   * @return {string}
   */
  reason() {
    return se.get(this.data(), "reason", "Invalid response from server");
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
class _r extends Ae {
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
        return this.knishIOClient.log("warn", "Mutation was cancelled"), new fe({
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
class we extends _r {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   * @param molecule
   */
  constructor(e, t, r) {
    super(e, t), this.$__molecule = r, this.$__remainderWallet = null, this.$__query = le`mutation( $molecule: MoleculeInput! ) {
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
    return new Qe({
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
class Tu extends Qe {
  /**
   * return the authorization key
   *
   * @param key
   * @return {*}
   */
  payloadKey(e) {
    if (!se.has(this.payload(), e))
      throw new zt(`ResponseRequestAuthorization::payloadKey() - '${e}' key was not found in the payload!`);
    return se.get(this.payload(), e);
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
class Bu extends we {
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
    return new Tu({
      query: this,
      json: e
    });
  }
}
class Cu extends Qe {
}
class Mu extends we {
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
    return new Cu({
      query: this,
      json: e
    });
  }
}
class Nu extends Qe {
}
class Ru extends we {
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
    return new Nu({
      query: this,
      json: e
    });
  }
}
class Ou extends Qe {
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
class Uu extends we {
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
    return new Ou({
      query: this,
      json: e
    });
  }
}
class Fu extends Qe {
}
class Hu extends we {
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
    return new Fu({
      query: this,
      json: e
    });
  }
}
class Lu extends Qe {
}
class qu extends we {
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
    const r = V.create({
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
    return new Lu({
      query: this,
      json: e
    });
  }
}
class Pu extends Qe {
}
class Du extends we {
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
    return new Pu({
      query: this,
      json: e
    });
  }
}
class Ku extends Qe {
}
class Wu extends we {
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
    return new Ku({
      query: this,
      json: e
    });
  }
}
class ju extends fe {
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
    if (!se.has(this.payload(), e))
      throw new zt(`ResponseAuthorizationGuest::payloadKey() - '${e}' key is not found in the payload!`);
    return se.get(this.payload(), e);
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
class Vu extends _r {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = le`mutation( $cellSlug: String, $pubkey: String, $encrypt: Boolean ) {
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
    return new ju({
      query: this,
      json: e
    });
  }
}
class ki extends J {
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
class Qu extends J {
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
class pn extends J {
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
class Vn {
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
      throw new tt("Subscribe::createSubscribe() - Node URI was not initialized for this client instance!");
    if (this.$__subscribe === null)
      throw new tt("Subscribe::createSubscribe() - GraphQL subscription was not initialized!");
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
      throw new tt(`${this.constructor.name}::execute() - closure parameter is required!`);
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
class Gu extends Vn {
  constructor(e) {
    super(e), this.$__subscribe = le`
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
class zu extends Vn {
  constructor(e) {
    super(e), this.$__subscribe = le`
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
class Ju extends Vn {
  constructor(e) {
    super(e), this.$__subscribe = le`
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
class Xu extends Vn {
  constructor(e) {
    super(e), this.$__subscribe = le`
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
class Yu extends fe {
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
class Zu extends _r {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = le`mutation(
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
    return new Yu({
      query: this,
      json: e
    });
  }
}
class el extends fe {
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
class tl extends Ae {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = le`query ActiveUserQuery ($bundleHash:String, $metaType: String, $metaId: String) {
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
    return new el({
      query: this,
      json: e
    });
  }
}
class nl extends fe {
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
class rl extends Ae {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = le`query UserActivity (
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
    return new nl({
      query: this,
      json: e
    });
  }
}
class il extends Ae {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = le`query( $slug: String, $slugs: [ String! ], $limit: Int, $order: String ) {
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
    return new fe({
      query: this,
      json: e,
      dataKey: "data.Token"
    });
  }
}
class vi extends J {
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
class sl extends fe {
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
class Si extends Ae {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = le`query(
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
    walletAddresses: c,
    walletAddress: h,
    isotopes: f,
    isotope: l,
    tokenSlugs: y,
    tokenSlug: p,
    cellSlugs: g,
    cellSlug: b,
    batchIds: A,
    batchId: S,
    values: $,
    value: B,
    metaTypes: T,
    metaType: x,
    metaIds: _,
    metaId: I,
    indexes: N,
    index: O,
    filter: q,
    latest: ee,
    queryArgs: Q
  }) {
    return t && (e = e || [], e.push(t)), i && (r = r || [], r.push(i)), o && (s = s || [], s.push(o)), h && (c = c || [], c.push(h)), l && (f = f || [], f.push(l)), p && (y = y || [], y.push(p)), b && (g = g || [], g.push(b)), S && (A = A || [], A.push(S)), B && ($ = $ || [], $.push(B)), x && (T = T || [], T.push(x)), I && (_ = _ || [], _.push(I)), O && (N = N || [], N.push(O)), {
      molecularHashes: e,
      bundleHashes: r,
      positions: s,
      walletAddresses: c,
      isotopes: f,
      tokenSlugs: y,
      cellSlugs: g,
      batchIds: A,
      values: $,
      metaTypes: T,
      metaIds: _,
      indexes: N,
      filter: q,
      latest: ee,
      queryArgs: Q
    };
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseAtom}
   */
  createResponse(e) {
    return new sl({
      query: this,
      json: e
    });
  }
}
class ol extends fe {
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
class al extends Ae {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = le`query( $metaType: String, $metaId: String, ) {
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
    return new ol({
      query: this,
      json: e
    });
  }
}
class ul extends fe {
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
class Ai extends Ae {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = le`query ($metaTypes: [String!], $metaIds: [String!], $values: [String!], $keys: [String!], $latest: Boolean, $filter: [MetaFilter!], $queryArgs: QueryArgs, $countBy: String, $atomValues: [String!] ) {
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
    atomValues: c = null,
    latest: h = null,
    filter: f = null,
    queryArgs: l = null,
    countBy: y = null
  }) {
    const p = {};
    return c && (p.atomValues = c), s && (p.keys = s), o && (p.values = o), e && (p.metaTypes = typeof e == "string" ? [e] : e), t && (p.metaIds = typeof t == "string" ? [t] : t), y && (p.countBy = y), f && (p.filter = f), r && i && (p.filter = p.filter || [], p.filter.push({
      key: r,
      value: i,
      comparison: "="
    })), p.latest = h === !0, l && ((typeof l.limit > "u" || l.limit === 0) && (l.limit = "*"), p.queryArgs = l), p;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaTypeViaAtom}
   */
  createResponse(e) {
    return new ul({
      query: this,
      json: e
    });
  }
}
class ll extends Qe {
}
class cl extends we {
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
    return new ll({
      query: this,
      json: e
    });
  }
}
class hl extends we {
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
class fl extends we {
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
function Ke(n, e, t, r) {
  return new (t || (t = Promise))(function(i, s) {
    function o(f) {
      try {
        h(r.next(f));
      } catch (l) {
        s(l);
      }
    }
    function c(f) {
      try {
        h(r.throw(f));
      } catch (l) {
        s(l);
      }
    }
    function h(f) {
      var l;
      f.done ? i(f.value) : (l = f.value, l instanceof t ? l : new t(function(y) {
        y(l);
      })).then(o, c);
    }
    h((r = r.apply(n, [])).next());
  });
}
function We(n, e) {
  var t, r, i, s, o = { label: 0, sent: function() {
    if (1 & i[0]) throw i[1];
    return i[1];
  }, trys: [], ops: [] };
  return s = { next: c(0), throw: c(1), return: c(2) }, typeof Symbol == "function" && (s[Symbol.iterator] = function() {
    return this;
  }), s;
  function c(h) {
    return function(f) {
      return function(l) {
        if (t) throw new TypeError("Generator is already executing.");
        for (; s && (s = 0, l[0] && (o = 0)), o; ) try {
          if (t = 1, r && (i = 2 & l[0] ? r.return : l[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, l[1])).done) return i;
          switch (r = 0, i && (l = [2 & l[0], i.value]), l[0]) {
            case 0:
            case 1:
              i = l;
              break;
            case 4:
              return o.label++, { value: l[1], done: !1 };
            case 5:
              o.label++, r = l[1], l = [0];
              continue;
            case 7:
              l = o.ops.pop(), o.trys.pop();
              continue;
            default:
              if (i = o.trys, !((i = i.length > 0 && i[i.length - 1]) || l[0] !== 6 && l[0] !== 2)) {
                o = 0;
                continue;
              }
              if (l[0] === 3 && (!i || l[1] > i[0] && l[1] < i[3])) {
                o.label = l[1];
                break;
              }
              if (l[0] === 6 && o.label < i[1]) {
                o.label = i[1], i = l;
                break;
              }
              if (i && o.label < i[2]) {
                o.label = i[2], o.ops.push(l);
                break;
              }
              i[2] && o.ops.pop(), o.trys.pop();
              continue;
          }
          l = e.call(n, o);
        } catch (y) {
          l = [6, y], r = 0;
        } finally {
          t = i = 0;
        }
        if (5 & l[0]) throw l[1];
        return { value: l[0] ? l[1] : void 0, done: !0 };
      }([h, f]);
    };
  }
}
var he = { exclude: [], include: [], logging: !0 }, xs = {}, dl = { timeout: "true" }, Ue = function(n, e) {
  typeof window < "u" && (xs[n] = e);
}, pl = function() {
  return Object.fromEntries(Object.entries(xs).filter(function(n) {
    var e, t = n[0];
    return !(!((e = he?.exclude) === null || e === void 0) && e.includes(t));
  }).filter(function(n) {
    var e, t, r, i, s = n[0];
    return !((e = he?.include) === null || e === void 0) && e.some(function(o) {
      return o.includes(".");
    }) ? (t = he?.include) === null || t === void 0 ? void 0 : t.some(function(o) {
      return o.startsWith(s);
    }) : ((r = he?.include) === null || r === void 0 ? void 0 : r.length) === 0 || ((i = he?.include) === null || i === void 0 ? void 0 : i.includes(s));
  }).map(function(n) {
    return [n[0], (0, n[1])()];
  }));
};
function yn(n) {
  return n ^= n >>> 16, n = Math.imul(n, 2246822507), n ^= n >>> 13, n = Math.imul(n, 3266489909), (n ^= n >>> 16) >>> 0;
}
var me = new Uint32Array([597399067, 2869860233, 951274213, 2716044179]);
function Ce(n, e) {
  return n << e | n >>> 32 - e;
}
function $r(n, e) {
  var t;
  if (e === void 0 && (e = 0), e = e ? 0 | e : 0, typeof n == "string" && (t = n, n = new TextEncoder().encode(t).buffer), !(n instanceof ArrayBuffer)) throw new TypeError("Expected key to be ArrayBuffer or string");
  var r = new Uint32Array([e, e, e, e]);
  (function(s, o) {
    for (var c = s.byteLength / 16 | 0, h = new Uint32Array(s, 0, 4 * c), f = 0; f < c; f++) {
      var l = h.subarray(4 * f, 4 * (f + 1));
      l[0] = Math.imul(l[0], me[0]), l[0] = Ce(l[0], 15), l[0] = Math.imul(l[0], me[1]), o[0] = o[0] ^ l[0], o[0] = Ce(o[0], 19), o[0] = o[0] + o[1], o[0] = Math.imul(o[0], 5) + 1444728091, l[1] = Math.imul(l[1], me[1]), l[1] = Ce(l[1], 16), l[1] = Math.imul(l[1], me[2]), o[1] = o[1] ^ l[1], o[1] = Ce(o[1], 17), o[1] = o[1] + o[2], o[1] = Math.imul(o[1], 5) + 197830471, l[2] = Math.imul(l[2], me[2]), l[2] = Ce(l[2], 17), l[2] = Math.imul(l[2], me[3]), o[2] = o[2] ^ l[2], o[2] = Ce(o[2], 15), o[2] = o[2] + o[3], o[2] = Math.imul(o[2], 5) + 2530024501, l[3] = Math.imul(l[3], me[3]), l[3] = Ce(l[3], 18), l[3] = Math.imul(l[3], me[0]), o[3] = o[3] ^ l[3], o[3] = Ce(o[3], 13), o[3] = o[3] + o[0], o[3] = Math.imul(o[3], 5) + 850148119;
    }
  })(n, r), function(s, o) {
    var c = s.byteLength / 16 | 0, h = s.byteLength % 16, f = new Uint32Array(4), l = new Uint8Array(s, 16 * c, h);
    switch (h) {
      case 15:
        f[3] = f[3] ^ l[14] << 16;
      case 14:
        f[3] = f[3] ^ l[13] << 8;
      case 13:
        f[3] = f[3] ^ l[12] << 0, f[3] = Math.imul(f[3], me[3]), f[3] = Ce(f[3], 18), f[3] = Math.imul(f[3], me[0]), o[3] = o[3] ^ f[3];
      case 12:
        f[2] = f[2] ^ l[11] << 24;
      case 11:
        f[2] = f[2] ^ l[10] << 16;
      case 10:
        f[2] = f[2] ^ l[9] << 8;
      case 9:
        f[2] = f[2] ^ l[8] << 0, f[2] = Math.imul(f[2], me[2]), f[2] = Ce(f[2], 17), f[2] = Math.imul(f[2], me[3]), o[2] = o[2] ^ f[2];
      case 8:
        f[1] = f[1] ^ l[7] << 24;
      case 7:
        f[1] = f[1] ^ l[6] << 16;
      case 6:
        f[1] = f[1] ^ l[5] << 8;
      case 5:
        f[1] = f[1] ^ l[4] << 0, f[1] = Math.imul(f[1], me[1]), f[1] = Ce(f[1], 16), f[1] = Math.imul(f[1], me[2]), o[1] = o[1] ^ f[1];
      case 4:
        f[0] = f[0] ^ l[3] << 24;
      case 3:
        f[0] = f[0] ^ l[2] << 16;
      case 2:
        f[0] = f[0] ^ l[1] << 8;
      case 1:
        f[0] = f[0] ^ l[0] << 0, f[0] = Math.imul(f[0], me[0]), f[0] = Ce(f[0], 15), f[0] = Math.imul(f[0], me[1]), o[0] = o[0] ^ f[0];
    }
  }(n, r), function(s, o) {
    o[0] = o[0] ^ s.byteLength, o[1] = o[1] ^ s.byteLength, o[2] = o[2] ^ s.byteLength, o[3] = o[3] ^ s.byteLength, o[0] = o[0] + o[1] | 0, o[0] = o[0] + o[2] | 0, o[0] = o[0] + o[3] | 0, o[1] = o[1] + o[0] | 0, o[2] = o[2] + o[0] | 0, o[3] = o[3] + o[0] | 0, o[0] = yn(o[0]), o[1] = yn(o[1]), o[2] = yn(o[2]), o[3] = yn(o[3]), o[0] = o[0] + o[1] | 0, o[0] = o[0] + o[2] | 0, o[0] = o[0] + o[3] | 0, o[1] = o[1] + o[0] | 0, o[2] = o[2] + o[0] | 0, o[3] = o[3] + o[0] | 0;
  }(n, r);
  var i = new Uint8Array(r.buffer);
  return Array.from(i).map(function(s) {
    return s.toString(16).padStart(2, "0");
  }).join("");
}
function yl(n, e) {
  return new Promise(function(t) {
    setTimeout(function() {
      return t(e);
    }, n);
  });
}
function ml(n, e, t) {
  return Promise.all(n.map(function(r) {
    return Promise.race([r, yl(e, t)]);
  }));
}
var gl = "0.19.1";
function wl() {
  return gl;
}
function ks() {
  return Ke(this, void 0, void 0, function() {
    var n, e, t, r, i;
    return We(this, function(s) {
      switch (s.label) {
        case 0:
          return s.trys.push([0, 2, , 3]), n = pl(), e = Object.keys(n), [4, ml(Object.values(n), he?.timeout || 1e3, dl)];
        case 1:
          return t = s.sent(), r = t.filter(function(o) {
            return o !== void 0;
          }), i = {}, r.forEach(function(o, c) {
            i[e[c]] = o;
          }), [2, vs(i, he.exclude || [], he.include || [], "")];
        case 2:
          throw s.sent();
        case 3:
          return [2];
      }
    });
  });
}
function vs(n, e, t, r) {
  r === void 0 && (r = "");
  for (var i = {}, s = function(f, l) {
    var y = r + f + ".";
    if (typeof l != "object" || Array.isArray(l)) {
      var p = e.some(function(A) {
        return y.startsWith(A);
      }), g = t.some(function(A) {
        return y.startsWith(A);
      });
      p && !g || (i[f] = l);
    } else {
      var b = vs(l, e, t, y);
      Object.keys(b).length > 0 && (i[f] = b);
    }
  }, o = 0, c = Object.entries(n); o < c.length; o++) {
    var h = c[o];
    s(h[0], h[1]);
  }
  return i;
}
function bl(n) {
  return Ke(this, void 0, void 0, function() {
    var e, t;
    return We(this, function(r) {
      switch (r.label) {
        case 0:
          return r.trys.push([0, 2, , 3]), [4, ks()];
        case 1:
          return e = r.sent(), t = $r(JSON.stringify(e)), Math.random() < 1e-3 && he.logging && function(i, s) {
            Ke(this, void 0, void 0, function() {
              var o, c;
              return We(this, function(h) {
                switch (h.label) {
                  case 0:
                    if (o = "https://logging.thumbmarkjs.com/v1/log", c = { thumbmark: i, components: s, version: wl() }, sessionStorage.getItem("_tmjs_l")) return [3, 4];
                    sessionStorage.setItem("_tmjs_l", "1"), h.label = 1;
                  case 1:
                    return h.trys.push([1, 3, , 4]), [4, fetch(o, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) })];
                  case 2:
                  case 3:
                    return h.sent(), [3, 4];
                  case 4:
                    return [2];
                }
              });
            });
          }(t, e), [2, t.toString()];
        case 2:
          throw r.sent();
        case 3:
          return [2];
      }
    });
  });
}
function xl(n) {
  for (var e = 0, t = 0; t < n.length; ++t) e += Math.abs(n[t]);
  return e;
}
function Ss(n, e, t) {
  for (var r = [], i = 0; i < n[0].data.length; i++) {
    for (var s = [], o = 0; o < n.length; o++) s.push(n[o].data[i]);
    r.push(kl(s));
  }
  var c = new Uint8ClampedArray(r);
  return new ImageData(c, e, t);
}
function kl(n) {
  if (n.length === 0) return 0;
  for (var e = {}, t = 0, r = n; t < r.length; t++)
    e[s = r[t]] = (e[s] || 0) + 1;
  var i = n[0];
  for (var s in e) e[s] > e[i] && (i = parseInt(s, 10));
  return i;
}
function rn() {
  if (typeof navigator > "u") return { name: "unknown", version: "unknown" };
  for (var n = navigator.userAgent, e = { Edg: "Edge", OPR: "Opera" }, t = 0, r = [/(?<name>Edge|Edg)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>(?:Chrome|Chromium|OPR|Opera|Vivaldi|Brave))\/(?<version>\d+(?:\.\d+)?)/, /(?<name>(?:Firefox|Waterfox|Iceweasel|IceCat))\/(?<version>\d+(?:\.\d+)?)/, /(?<name>Safari)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>MSIE|Trident|IEMobile).+?(?<version>\d+(?:\.\d+)?)/, /(?<name>[A-Za-z]+)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>SamsungBrowser)\/(?<version>\d+(?:\.\d+)?)/]; t < r.length; t++) {
    var i = r[t], s = n.match(i);
    if (s && s.groups) return { name: e[s.groups.name] || s.groups.name, version: s.groups.version };
  }
  return { name: "unknown", version: "unknown" };
}
Ue("audio", function() {
  return Ke(this, void 0, void 0, function() {
    return We(this, function(n) {
      return [2, new Promise(function(e, t) {
        try {
          var r = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 5e3, 44100), i = r.createBufferSource(), s = r.createOscillator();
          s.frequency.value = 1e3;
          var o, c = r.createDynamicsCompressor();
          c.threshold.value = -50, c.knee.value = 40, c.ratio.value = 12, c.attack.value = 0, c.release.value = 0.2, s.connect(c), c.connect(r.destination), s.start(), r.oncomplete = function(h) {
            o = h.renderedBuffer.getChannelData(0), e({ sampleHash: xl(o), oscillator: s.type, maxChannels: r.destination.maxChannelCount, channelCountMode: i.channelCountMode });
          }, r.startRendering();
        } catch (h) {
          console.error("Error creating audio fingerprint:", h), t(h);
        }
      })];
    });
  });
});
var vl = rn().name !== "SamsungBrowser" ? 1 : 3, Ii = 280, Ei = 20;
rn().name != "Firefox" && Ue("canvas", function() {
  return document.createElement("canvas").getContext("2d"), new Promise(function(n) {
    var e = Array.from({ length: vl }, function() {
      return function() {
        var t = document.createElement("canvas"), r = t.getContext("2d");
        if (!r) return new ImageData(1, 1);
        t.width = Ii, t.height = Ei;
        var i = r.createLinearGradient(0, 0, t.width, t.height);
        i.addColorStop(0, "red"), i.addColorStop(0.16666666666666666, "orange"), i.addColorStop(0.3333333333333333, "yellow"), i.addColorStop(0.5, "green"), i.addColorStop(0.6666666666666666, "blue"), i.addColorStop(0.8333333333333334, "indigo"), i.addColorStop(1, "violet"), r.fillStyle = i, r.fillRect(0, 0, t.width, t.height);
        var s = "Random Text WMwmil10Oo";
        r.font = "23.123px Arial", r.fillStyle = "black", r.fillText(s, -5, 15), r.fillStyle = "rgba(0, 0, 255, 0.5)", r.fillText(s, -3.3, 17.7), r.beginPath(), r.moveTo(0, 0), r.lineTo(2 * t.width / 7, t.height), r.strokeStyle = "white", r.lineWidth = 2, r.stroke();
        var o = r.getImageData(0, 0, t.width, t.height);
        return o;
      }();
    });
    n({ commonImageDataHash: $r(Ss(e, Ii, Ei).data.toString()).toString() });
  });
});
var lr, Sl = ["Arial", "Arial Black", "Arial Narrow", "Arial Rounded MT", "Arimo", "Archivo", "Barlow", "Bebas Neue", "Bitter", "Bookman", "Calibri", "Cabin", "Candara", "Century", "Century Gothic", "Comic Sans MS", "Constantia", "Courier", "Courier New", "Crimson Text", "DM Mono", "DM Sans", "DM Serif Display", "DM Serif Text", "Dosis", "Droid Sans", "Exo", "Fira Code", "Fira Sans", "Franklin Gothic Medium", "Garamond", "Geneva", "Georgia", "Gill Sans", "Helvetica", "Impact", "Inconsolata", "Indie Flower", "Inter", "Josefin Sans", "Karla", "Lato", "Lexend", "Lucida Bright", "Lucida Console", "Lucida Sans Unicode", "Manrope", "Merriweather", "Merriweather Sans", "Montserrat", "Myriad", "Noto Sans", "Nunito", "Nunito Sans", "Open Sans", "Optima", "Orbitron", "Oswald", "Pacifico", "Palatino", "Perpetua", "PT Sans", "PT Serif", "Poppins", "Prompt", "Public Sans", "Quicksand", "Rajdhani", "Recursive", "Roboto", "Roboto Condensed", "Rockwell", "Rubik", "Segoe Print", "Segoe Script", "Segoe UI", "Sora", "Source Sans Pro", "Space Mono", "Tahoma", "Taviraj", "Times", "Times New Roman", "Titillium Web", "Trebuchet MS", "Ubuntu", "Varela Round", "Verdana", "Work Sans"], Al = ["monospace", "sans-serif", "serif"];
function _i(n, e) {
  if (!n) throw new Error("Canvas context not supported");
  return n.font, n.font = "72px ".concat(e), n.measureText("WwMmLli0Oo").width;
}
function Il() {
  var n, e = document.createElement("canvas"), t = (n = e.getContext("webgl")) !== null && n !== void 0 ? n : e.getContext("experimental-webgl");
  if (t && "getParameter" in t) try {
    var r = (t.getParameter(t.VENDOR) || "").toString(), i = (t.getParameter(t.RENDERER) || "").toString(), s = { vendor: r, renderer: i, version: (t.getParameter(t.VERSION) || "").toString(), shadingLanguageVersion: (t.getParameter(t.SHADING_LANGUAGE_VERSION) || "").toString() };
    if (!i.length || !r.length) {
      var o = t.getExtension("WEBGL_debug_renderer_info");
      if (o) {
        var c = (t.getParameter(o.UNMASKED_VENDOR_WEBGL) || "").toString(), h = (t.getParameter(o.UNMASKED_RENDERER_WEBGL) || "").toString();
        c && (s.vendorUnmasked = c), h && (s.rendererUnmasked = h);
      }
    }
    return s;
  } catch {
  }
  return "undefined";
}
function El() {
  var n = new Float32Array(1), e = new Uint8Array(n.buffer);
  return n[0] = 1 / 0, n[0] = n[0] - n[0], e[3];
}
function _l(n, e) {
  var t = {};
  return e.forEach(function(r) {
    var i = function(s) {
      if (s.length === 0) return null;
      var o = {};
      s.forEach(function(f) {
        var l = String(f);
        o[l] = (o[l] || 0) + 1;
      });
      var c = s[0], h = 1;
      return Object.keys(o).forEach(function(f) {
        o[f] > h && (c = f, h = o[f]);
      }), c;
    }(n.map(function(s) {
      return r in s ? s[r] : void 0;
    }).filter(function(s) {
      return s !== void 0;
    }));
    i && (t[r] = i);
  }), t;
}
function $l() {
  var n = [], e = { "prefers-contrast": ["high", "more", "low", "less", "forced", "no-preference"], "any-hover": ["hover", "none"], "any-pointer": ["none", "coarse", "fine"], pointer: ["none", "coarse", "fine"], hover: ["hover", "none"], update: ["fast", "slow"], "inverted-colors": ["inverted", "none"], "prefers-reduced-motion": ["reduce", "no-preference"], "prefers-reduced-transparency": ["reduce", "no-preference"], scripting: ["none", "initial-only", "enabled"], "forced-colors": ["active", "none"] };
  return Object.keys(e).forEach(function(t) {
    e[t].forEach(function(r) {
      matchMedia("(".concat(t, ": ").concat(r, ")")).matches && n.push("".concat(t, ": ").concat(r));
    });
  }), n;
}
function Tl() {
  if (window.location.protocol === "https:" && typeof window.ApplePaySession == "function") try {
    for (var n = window.ApplePaySession.supportsVersion, e = 15; e > 0; e--) if (n(e)) return e;
  } catch {
    return 0;
  }
  return 0;
}
rn().name != "Firefox" && Ue("fonts", function() {
  var n = this;
  return new Promise(function(e, t) {
    try {
      (function(r) {
        var i;
        Ke(this, void 0, void 0, function() {
          var s, o, c;
          return We(this, function(h) {
            switch (h.label) {
              case 0:
                return document.body ? [3, 2] : [4, (f = 50, new Promise(function(y) {
                  return setTimeout(y, f, l);
                }))];
              case 1:
                return h.sent(), [3, 0];
              case 2:
                if ((s = document.createElement("iframe")).setAttribute("frameBorder", "0"), (o = s.style).setProperty("position", "fixed"), o.setProperty("display", "block", "important"), o.setProperty("visibility", "visible"), o.setProperty("border", "0"), o.setProperty("opacity", "0"), s.src = "about:blank", document.body.appendChild(s), !(c = s.contentDocument || ((i = s.contentWindow) === null || i === void 0 ? void 0 : i.document))) throw new Error("Iframe document is not accessible");
                return r({ iframe: c }), setTimeout(function() {
                  document.body.removeChild(s);
                }, 0), [2];
            }
            var f, l;
          });
        });
      })(function(r) {
        var i = r.iframe;
        return Ke(n, void 0, void 0, function() {
          var s, o, c, h;
          return We(this, function(f) {
            return s = i.createElement("canvas"), o = s.getContext("2d"), c = Al.map(function(l) {
              return _i(o, l);
            }), h = {}, Sl.forEach(function(l) {
              var y = _i(o, l);
              c.includes(y) || (h[l] = y);
            }), e(h), [2];
          });
        });
      });
    } catch {
      t({ error: "unsupported" });
    }
  });
}), Ue("hardware", function() {
  return new Promise(function(n, e) {
    var t = navigator.deviceMemory !== void 0 ? navigator.deviceMemory : 0, r = window.performance && window.performance.memory ? window.performance.memory : 0;
    n({ videocard: Il(), architecture: El(), deviceMemory: t.toString() || "undefined", jsHeapSizeLimit: r.jsHeapSizeLimit || 0 });
  });
}), Ue("locales", function() {
  return new Promise(function(n) {
    n({ languages: navigator.language, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  });
}), Ue("permissions", function() {
  return Ke(this, void 0, void 0, function() {
    var n;
    return We(this, function(e) {
      return lr = he?.permissions_to_check || ["accelerometer", "accessibility", "accessibility-events", "ambient-light-sensor", "background-fetch", "background-sync", "bluetooth", "camera", "clipboard-read", "clipboard-write", "device-info", "display-capture", "gyroscope", "geolocation", "local-fonts", "magnetometer", "microphone", "midi", "nfc", "notifications", "payment-handler", "persistent-storage", "push", "speaker", "storage-access", "top-level-storage-access", "window-management", "query"], n = Array.from({ length: he?.retries || 3 }, function() {
        return function() {
          return Ke(this, void 0, void 0, function() {
            var t, r, i, s, o;
            return We(this, function(c) {
              switch (c.label) {
                case 0:
                  t = {}, r = 0, i = lr, c.label = 1;
                case 1:
                  if (!(r < i.length)) return [3, 6];
                  s = i[r], c.label = 2;
                case 2:
                  return c.trys.push([2, 4, , 5]), [4, navigator.permissions.query({ name: s })];
                case 3:
                  return o = c.sent(), t[s] = o.state.toString(), [3, 5];
                case 4:
                  return c.sent(), [3, 5];
                case 5:
                  return r++, [3, 1];
                case 6:
                  return [2, t];
              }
            });
          });
        }();
      }), [2, Promise.all(n).then(function(t) {
        return _l(t, lr);
      })];
    });
  });
}), Ue("plugins", function() {
  var n = [];
  if (navigator.plugins) for (var e = 0; e < navigator.plugins.length; e++) {
    var t = navigator.plugins[e];
    n.push([t.name, t.filename, t.description].join("|"));
  }
  return new Promise(function(r) {
    r({ plugins: n });
  });
}), Ue("screen", function() {
  return new Promise(function(n) {
    n({ is_touchscreen: navigator.maxTouchPoints > 0, maxTouchPoints: navigator.maxTouchPoints, colorDepth: screen.colorDepth, mediaMatches: $l() });
  });
}), Ue("system", function() {
  return new Promise(function(n) {
    var e = rn();
    n({ platform: window.navigator.platform, cookieEnabled: window.navigator.cookieEnabled, productSub: navigator.productSub, product: navigator.product, useragent: navigator.userAgent, hardwareConcurrency: navigator.hardwareConcurrency, browser: { name: e.name, version: e.version }, applePayVersion: Tl() });
  });
});
var xe, Bl = rn().name !== "SamsungBrowser" ? 1 : 3, R = null;
Ue("webgl", function() {
  return Ke(this, void 0, void 0, function() {
    var n;
    return We(this, function(e) {
      typeof document < "u" && ((xe = document.createElement("canvas")).width = 200, xe.height = 100, R = xe.getContext("webgl"));
      try {
        if (!R) throw new Error("WebGL not supported");
        return n = Array.from({ length: Bl }, function() {
          return function() {
            try {
              if (!R) throw new Error("WebGL not supported");
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
      `, i = R.createShader(R.VERTEX_SHADER), s = R.createShader(R.FRAGMENT_SHADER);
              if (!i || !s) throw new Error("Failed to create shaders");
              if (R.shaderSource(i, t), R.shaderSource(s, r), R.compileShader(i), !R.getShaderParameter(i, R.COMPILE_STATUS)) throw new Error("Vertex shader compilation failed: " + R.getShaderInfoLog(i));
              if (R.compileShader(s), !R.getShaderParameter(s, R.COMPILE_STATUS)) throw new Error("Fragment shader compilation failed: " + R.getShaderInfoLog(s));
              var o = R.createProgram();
              if (!o) throw new Error("Failed to create shader program");
              if (R.attachShader(o, i), R.attachShader(o, s), R.linkProgram(o), !R.getProgramParameter(o, R.LINK_STATUS)) throw new Error("Shader program linking failed: " + R.getProgramInfoLog(o));
              R.useProgram(o);
              for (var c = 137, h = new Float32Array(4 * c), f = 2 * Math.PI / c, l = 0; l < c; l++) {
                var y = l * f;
                h[4 * l] = 0, h[4 * l + 1] = 0, h[4 * l + 2] = Math.cos(y) * (xe.width / 2), h[4 * l + 3] = Math.sin(y) * (xe.height / 2);
              }
              var p = R.createBuffer();
              R.bindBuffer(R.ARRAY_BUFFER, p), R.bufferData(R.ARRAY_BUFFER, h, R.STATIC_DRAW);
              var g = R.getAttribLocation(o, "position");
              R.enableVertexAttribArray(g), R.vertexAttribPointer(g, 2, R.FLOAT, !1, 0, 0), R.viewport(0, 0, xe.width, xe.height), R.clearColor(0, 0, 0, 1), R.clear(R.COLOR_BUFFER_BIT), R.drawArrays(R.LINES, 0, 2 * c);
              var b = new Uint8ClampedArray(xe.width * xe.height * 4);
              return R.readPixels(0, 0, xe.width, xe.height, R.RGBA, R.UNSIGNED_BYTE, b), new ImageData(b, xe.width, xe.height);
            } catch {
              return new ImageData(1, 1);
            } finally {
              R && (R.bindBuffer(R.ARRAY_BUFFER, null), R.useProgram(null), R.viewport(0, 0, R.drawingBufferWidth, R.drawingBufferHeight), R.clearColor(0, 0, 0, 0));
            }
          }();
        }), [2, { commonImageHash: $r(Ss(n, xe.width, xe.height).data.toString()).toString() }];
      } catch {
        return [2, { webgl: "unsupported" }];
      }
      return [2];
    });
  });
});
var yt = function(n, e, t, r) {
  for (var i = (t - e) / r, s = 0, o = 0; o < r; o++)
    s += n(e + (o + 0.5) * i);
  return s * i;
};
Ue("math", function() {
  return Ke(void 0, void 0, void 0, function() {
    return We(this, function(n) {
      return [2, { acos: Math.acos(0.5), asin: yt(Math.asin, -1, 1, 97), atan: yt(Math.atan, -1, 1, 97), cos: yt(Math.cos, 0, Math.PI, 97), cosh: Math.cosh(9 / 7), e: Math.E, largeCos: Math.cos(1e20), largeSin: Math.sin(1e20), largeTan: Math.tan(1e20), log: Math.log(1e3), pi: Math.PI, sin: yt(Math.sin, -Math.PI, Math.PI, 97), sinh: yt(Math.sinh, -9 / 7, 7 / 9, 97), sqrt: Math.sqrt(2), tan: yt(Math.tan, 0, 2 * Math.PI, 97), tanh: yt(Math.tanh, -9 / 7, 7 / 9, 97) }];
    });
  });
});
function Se(n) {
  return n === null ? "null" : Array.isArray(n) ? "array" : typeof n;
}
function mt(n) {
  return Se(n) === "object";
}
function Cl(n) {
  return Array.isArray(n) && // must be at least one error
  n.length > 0 && // error has at least a message
  n.every((e) => "message" in e);
}
function $i(n, e) {
  return n.length < 124 ? n : e;
}
const Ml = "graphql-transport-ws";
var Ie;
(function(n) {
  n[n.InternalServerError = 4500] = "InternalServerError", n[n.InternalClientError = 4005] = "InternalClientError", n[n.BadRequest = 4400] = "BadRequest", n[n.BadResponse = 4004] = "BadResponse", n[n.Unauthorized = 4401] = "Unauthorized", n[n.Forbidden = 4403] = "Forbidden", n[n.SubprotocolNotAcceptable = 4406] = "SubprotocolNotAcceptable", n[n.ConnectionInitialisationTimeout = 4408] = "ConnectionInitialisationTimeout", n[n.ConnectionAcknowledgementTimeout = 4504] = "ConnectionAcknowledgementTimeout", n[n.SubscriberAlreadyExists = 4409] = "SubscriberAlreadyExists", n[n.TooManyInitialisationRequests = 4429] = "TooManyInitialisationRequests";
})(Ie || (Ie = {}));
var ie;
(function(n) {
  n.ConnectionInit = "connection_init", n.ConnectionAck = "connection_ack", n.Ping = "ping", n.Pong = "pong", n.Subscribe = "subscribe", n.Next = "next", n.Error = "error", n.Complete = "complete";
})(ie || (ie = {}));
function As(n) {
  if (!mt(n))
    throw new Error(`Message is expected to be an object, but got ${Se(n)}`);
  if (!n.type)
    throw new Error("Message is missing the 'type' property");
  if (typeof n.type != "string")
    throw new Error(`Message is expects the 'type' property to be a string, but got ${Se(n.type)}`);
  switch (n.type) {
    case ie.ConnectionInit:
    case ie.ConnectionAck:
    case ie.Ping:
    case ie.Pong: {
      if (n.payload != null && !mt(n.payload))
        throw new Error(`"${n.type}" message expects the 'payload' property to be an object or nullish or missing, but got "${n.payload}"`);
      break;
    }
    case ie.Subscribe: {
      if (typeof n.id != "string")
        throw new Error(`"${n.type}" message expects the 'id' property to be a string, but got ${Se(n.id)}`);
      if (!n.id)
        throw new Error(`"${n.type}" message requires a non-empty 'id' property`);
      if (!mt(n.payload))
        throw new Error(`"${n.type}" message expects the 'payload' property to be an object, but got ${Se(n.payload)}`);
      if (typeof n.payload.query != "string")
        throw new Error(`"${n.type}" message payload expects the 'query' property to be a string, but got ${Se(n.payload.query)}`);
      if (n.payload.variables != null && !mt(n.payload.variables))
        throw new Error(`"${n.type}" message payload expects the 'variables' property to be a an object or nullish or missing, but got ${Se(n.payload.variables)}`);
      if (n.payload.operationName != null && Se(n.payload.operationName) !== "string")
        throw new Error(`"${n.type}" message payload expects the 'operationName' property to be a string or nullish or missing, but got ${Se(n.payload.operationName)}`);
      if (n.payload.extensions != null && !mt(n.payload.extensions))
        throw new Error(`"${n.type}" message payload expects the 'extensions' property to be a an object or nullish or missing, but got ${Se(n.payload.extensions)}`);
      break;
    }
    case ie.Next: {
      if (typeof n.id != "string")
        throw new Error(`"${n.type}" message expects the 'id' property to be a string, but got ${Se(n.id)}`);
      if (!n.id)
        throw new Error(`"${n.type}" message requires a non-empty 'id' property`);
      if (!mt(n.payload))
        throw new Error(`"${n.type}" message expects the 'payload' property to be an object, but got ${Se(n.payload)}`);
      break;
    }
    case ie.Error: {
      if (typeof n.id != "string")
        throw new Error(`"${n.type}" message expects the 'id' property to be a string, but got ${Se(n.id)}`);
      if (!n.id)
        throw new Error(`"${n.type}" message requires a non-empty 'id' property`);
      if (!Cl(n.payload))
        throw new Error(`"${n.type}" message expects the 'payload' property to be an array of GraphQL errors, but got ${JSON.stringify(n.payload)}`);
      break;
    }
    case ie.Complete: {
      if (typeof n.id != "string")
        throw new Error(`"${n.type}" message expects the 'id' property to be a string, but got ${Se(n.id)}`);
      if (!n.id)
        throw new Error(`"${n.type}" message requires a non-empty 'id' property`);
      break;
    }
    default:
      throw new Error(`Invalid message 'type' property "${n.type}"`);
  }
  return n;
}
function Nl(n, e) {
  return As(typeof n == "string" ? JSON.parse(n, e) : n);
}
function jt(n, e) {
  return As(n), JSON.stringify(n, e);
}
var Bt = function(n) {
  return this instanceof Bt ? (this.v = n, this) : new Bt(n);
}, Rl = function(n, e, t) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = t.apply(n, e || []), i, s = [];
  return i = Object.create((typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype), c("next"), c("throw"), c("return", o), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function o(g) {
    return function(b) {
      return Promise.resolve(b).then(g, y);
    };
  }
  function c(g, b) {
    r[g] && (i[g] = function(A) {
      return new Promise(function(S, $) {
        s.push([g, A, S, $]) > 1 || h(g, A);
      });
    }, b && (i[g] = b(i[g])));
  }
  function h(g, b) {
    try {
      f(r[g](b));
    } catch (A) {
      p(s[0][3], A);
    }
  }
  function f(g) {
    g.value instanceof Bt ? Promise.resolve(g.value.v).then(l, y) : p(s[0][2], g);
  }
  function l(g) {
    h("next", g);
  }
  function y(g) {
    h("throw", g);
  }
  function p(g, b) {
    g(b), s.shift(), s.length && h(s[0][0], s[0][1]);
  }
};
function Ol(n) {
  const {
    url: e,
    connectionParams: t,
    lazy: r = !0,
    onNonLazyError: i = console.error,
    lazyCloseTimeout: s = 0,
    keepAlive: o = 0,
    disablePong: c,
    connectionAckWaitTimeout: h = 0,
    retryAttempts: f = 5,
    retryWait: l = async function(X) {
      let F = 1e3;
      for (let K = 0; K < X; K++)
        F *= 2;
      await new Promise((K) => setTimeout(K, F + // add random timeout from 300ms to 3s
      Math.floor(Math.random() * 2700 + 300)));
    },
    shouldRetry: y = cr,
    isFatalConnectionProblem: p,
    on: g,
    webSocketImpl: b,
    /**
     * Generates a v4 UUID to be used as the ID using `Math`
     * as the random number generator. Supply your own generator
     * in case you need more uniqueness.
     *
     * Reference: https://gist.github.com/jed/982883
     */
    generateID: A = function() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (X) => {
        const F = Math.random() * 16 | 0;
        return (X == "x" ? F : F & 3 | 8).toString(16);
      });
    },
    jsonMessageReplacer: S,
    jsonMessageReviver: $
  } = n;
  let B;
  if (b) {
    if (!Fl(b))
      throw new Error("Invalid WebSocket implementation provided");
    B = b;
  } else typeof WebSocket < "u" ? B = WebSocket : typeof Qt < "u" ? B = Qt.WebSocket || // @ts-expect-error: Support more browsers
  Qt.MozWebSocket : typeof window < "u" && (B = window.WebSocket || // @ts-expect-error: Support more browsers
  window.MozWebSocket);
  if (!B)
    throw new Error("WebSocket implementation missing; on Node you can `import WebSocket from 'ws';` and pass `webSocketImpl: WebSocket` to `createClient`");
  const T = B, x = (() => {
    const U = /* @__PURE__ */ (() => {
      const F = {};
      return {
        on(K, G) {
          return F[K] = G, () => {
            delete F[K];
          };
        },
        emit(K) {
          var G;
          "id" in K && ((G = F[K.id]) === null || G === void 0 || G.call(F, K));
        }
      };
    })(), X = {
      connecting: g?.connecting ? [g.connecting] : [],
      opened: g?.opened ? [g.opened] : [],
      connected: g?.connected ? [g.connected] : [],
      ping: g?.ping ? [g.ping] : [],
      pong: g?.pong ? [g.pong] : [],
      message: g?.message ? [U.emit, g.message] : [U.emit],
      closed: g?.closed ? [g.closed] : [],
      error: g?.error ? [g.error] : []
    };
    return {
      onMessage: U.on,
      on(F, K) {
        const G = X[F];
        return G.push(K), () => {
          G.splice(G.indexOf(K), 1);
        };
      },
      emit(F, ...K) {
        for (const G of [...X[F]])
          G(...K);
      }
    };
  })();
  function _(U) {
    const X = [
      // errors are fatal and more critical than close events, throw them first
      x.on("error", (F) => {
        X.forEach((K) => K()), U(F);
      }),
      // closes can be graceful and not fatal, throw them second (if error didnt throw)
      x.on("closed", (F) => {
        X.forEach((K) => K()), U(F);
      })
    ];
  }
  let I, N = 0, O, q = !1, ee = 0, Q = !1;
  async function pe() {
    clearTimeout(O);
    const [U, X] = await (I ?? (I = new Promise((G, ye) => (async () => {
      if (q) {
        if (await l(ee), !N)
          return I = void 0, ye({ code: 1e3, reason: "All Subscriptions Gone" });
        ee++;
      }
      x.emit("connecting", q);
      const j = new T(typeof e == "function" ? await e() : e, Ml);
      let He, ft;
      function Z() {
        isFinite(o) && o > 0 && (clearTimeout(ft), ft = setTimeout(() => {
          j.readyState === T.OPEN && (j.send(jt({ type: ie.Ping })), x.emit("ping", !1, void 0));
        }, o));
      }
      _((ce) => {
        I = void 0, clearTimeout(He), clearTimeout(ft), ye(ce), ce instanceof Ti && (j.close(4499, "Terminated"), j.onerror = null, j.onclose = null);
      }), j.onerror = (ce) => x.emit("error", ce), j.onclose = (ce) => x.emit("closed", ce), j.onopen = async () => {
        try {
          x.emit("opened", j);
          const ce = typeof t == "function" ? await t() : t;
          if (j.readyState !== T.OPEN)
            return;
          j.send(jt(ce ? {
            type: ie.ConnectionInit,
            payload: ce
          } : {
            type: ie.ConnectionInit
            // payload is completely absent if not provided
          }, S)), isFinite(h) && h > 0 && (He = setTimeout(() => {
            j.close(Ie.ConnectionAcknowledgementTimeout, "Connection acknowledgement timeout");
          }, h)), Z();
        } catch (ce) {
          x.emit("error", ce), j.close(Ie.InternalClientError, $i(ce instanceof Error ? ce.message : new Error(ce).message, "Internal client error"));
        }
      };
      let re = !1;
      j.onmessage = ({ data: ce }) => {
        try {
          const ae = Nl(ce, $);
          if (x.emit("message", ae), ae.type === "ping" || ae.type === "pong") {
            x.emit(ae.type, !0, ae.payload), ae.type === "pong" ? Z() : c || (j.send(jt(ae.payload ? {
              type: ie.Pong,
              payload: ae.payload
            } : {
              type: ie.Pong
              // payload is completely absent if not provided
            })), x.emit("pong", !1, ae.payload));
            return;
          }
          if (re)
            return;
          if (ae.type !== ie.ConnectionAck)
            throw new Error(`First message cannot be of type ${ae.type}`);
          clearTimeout(He), re = !0, x.emit("connected", j, ae.payload, q), q = !1, ee = 0, G([
            j,
            new Promise((Qn, un) => _(un))
          ]);
        } catch (ae) {
          j.onmessage = null, x.emit("error", ae), j.close(Ie.BadResponse, $i(ae instanceof Error ? ae.message : new Error(ae).message, "Bad response"));
        }
      };
    })())));
    U.readyState === T.CLOSING && await X;
    let F = () => {
    };
    const K = new Promise((G) => F = G);
    return [
      U,
      F,
      Promise.race([
        // wait for
        K.then(() => {
          if (!N) {
            const G = () => U.close(1e3, "Normal Closure");
            isFinite(s) && s > 0 ? O = setTimeout(() => {
              U.readyState === T.OPEN && G();
            }, s) : G();
          }
        }),
        // or
        X
      ])
    ];
  }
  function Te(U) {
    if (cr(U) && (Ul(U.code) || [
      Ie.InternalServerError,
      Ie.InternalClientError,
      Ie.BadRequest,
      Ie.BadResponse,
      Ie.Unauthorized,
      // CloseCode.Forbidden, might grant access out after retry
      Ie.SubprotocolNotAcceptable,
      // CloseCode.ConnectionInitialisationTimeout, might not time out after retry
      // CloseCode.ConnectionAcknowledgementTimeout, might not time out after retry
      Ie.SubscriberAlreadyExists,
      Ie.TooManyInitialisationRequests
      // 4499, // Terminated, probably because the socket froze, we want to retry
    ].includes(U.code)))
      throw U;
    if (Q)
      return !1;
    if (cr(U) && U.code === 1e3)
      return N > 0;
    if (!f || ee >= f || !y(U) || p?.(U))
      throw U;
    return q = !0;
  }
  r || (async () => {
    for (N++; ; )
      try {
        const [, , U] = await pe();
        await U;
      } catch (U) {
        try {
          if (!Te(U))
            return;
        } catch (X) {
          return i?.(X);
        }
      }
  })();
  function Re(U, X) {
    const F = A(U);
    let K = !1, G = !1, ye = () => {
      N--, K = !0;
    };
    return (async () => {
      for (N++; ; )
        try {
          const [j, He, ft] = await pe();
          if (K)
            return He();
          const Z = x.onMessage(F, (re) => {
            switch (re.type) {
              case ie.Next: {
                X.next(re.payload);
                return;
              }
              case ie.Error: {
                G = !0, K = !0, X.error(re.payload), ye();
                return;
              }
              case ie.Complete: {
                K = !0, ye();
                return;
              }
            }
          });
          j.send(jt({
            id: F,
            type: ie.Subscribe,
            payload: U
          }, S)), ye = () => {
            !K && j.readyState === T.OPEN && j.send(jt({
              id: F,
              type: ie.Complete
            }, S)), N--, K = !0, He();
          }, await ft.finally(Z);
          return;
        } catch (j) {
          if (!Te(j))
            return;
        }
    })().then(() => {
      G || X.complete();
    }).catch((j) => {
      X.error(j);
    }), () => {
      K || ye();
    };
  }
  return {
    on: x.on,
    subscribe: Re,
    iterate(U) {
      const X = [], F = {
        done: !1,
        error: null,
        resolve: () => {
        }
      }, K = Re(U, {
        next(ye) {
          X.push(ye), F.resolve();
        },
        error(ye) {
          F.done = !0, F.error = ye, F.resolve();
        },
        complete() {
          F.done = !0, F.resolve();
        }
      }), G = function() {
        return Rl(this, arguments, function* () {
          for (; ; ) {
            for (X.length || (yield Bt(new Promise((He) => F.resolve = He))); X.length; )
              yield yield Bt(X.shift());
            if (F.error)
              throw F.error;
            if (F.done)
              return yield Bt(void 0);
          }
        });
      }();
      return G.throw = async (ye) => (F.done || (F.done = !0, F.error = ye, F.resolve()), { done: !0, value: void 0 }), G.return = async () => (K(), { done: !0, value: void 0 }), G;
    },
    async dispose() {
      if (Q = !0, I) {
        const [U] = await I;
        U.close(1e3, "Normal Closure");
      }
    },
    terminate() {
      I && x.emit("closed", new Ti());
    }
  };
}
class Ti extends Error {
  constructor() {
    super(...arguments), this.name = "TerminatedCloseEvent", this.message = "4499: Terminated", this.code = 4499, this.reason = "Terminated", this.wasClean = !1;
  }
}
function cr(n) {
  return mt(n) && "code" in n && "reason" in n;
}
function Ul(n) {
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
function Fl(n) {
  return typeof n == "function" && "constructor" in n && "CLOSED" in n && "CLOSING" in n && "CONNECTING" in n && "OPEN" in n;
}
class Hl {
  constructor({ serverUri: e, socket: t = null, encrypt: r = !1 }) {
    this.$__client = this.createUrqlClient({ serverUri: e, socket: t, encrypt: r }), this.$__authToken = "", this.$__pubkey = null, this.$__wallet = null, this.serverUri = e, this.soketi = t, this.cipherLink = !!r, this.$__subscriptionManager = /* @__PURE__ */ new Map();
  }
  createUrqlClient({ serverUri: e, socket: t, encrypt: r }) {
    const i = [pu, mu];
    if (t && t.socketUri) {
      const s = Ol({
        url: t.socketUri,
        connectionParams: () => ({
          authToken: this.$__authToken
        })
      });
      i.push(yu({
        forwardSubscription: (o) => ({
          subscribe: (c) => ({ unsubscribe: s.subscribe(o, c) })
        })
      }));
    }
    return xu({
      url: e,
      exchanges: i,
      fetchOptions: () => ({
        headers: {
          "X-Auth-Token": this.$__authToken
        }
      })
    });
  }
  setAuthData({ token: e, pubkey: t, wallet: r }) {
    this.$__authToken = e, this.$__pubkey = t, this.$__wallet = r, this.$__client = this.createUrqlClient({
      serverUri: this.serverUri,
      socket: this.soketi,
      encrypt: !!this.cipherLink
    });
  }
  async query(e) {
    const { query: t, variables: r } = e, i = await this.$__client.query(t, r).toPromise();
    return this.formatResponse(i);
  }
  async mutate(e) {
    const { mutation: t, variables: r } = e, i = await this.$__client.mutation(t, r).toPromise();
    return this.formatResponse(i);
  }
  subscribe(e, t) {
    const { query: r, variables: i, operationName: s } = e, { unsubscribe: o } = Ja(
      this.$__client.subscription(r, i),
      Jt((c) => {
        t(this.formatResponse(c));
      })
    ).subscribe(() => {
    });
    return this.$__subscriptionManager.set(s, { unsubscribe: o }), {
      unsubscribe: () => this.unsubscribe(s)
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
class Ql {
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
   * @param {UrqlClientWrapper|null} client
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
    for (const c in this.$__uris) {
      const h = this.$__uris[c];
      this.$__authTokenObjects[h] = null;
    }
    this.log("info", `KnishIOClient::initialize() - Initializing new Knish.IO client session for SDK version ${s}...`), this.$__client = i || new Hl({
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
   * @return {UrqlClientWrapper}
   */
  subscribe() {
    if (!this.client().getSocketUri())
      throw new tt("KnishIOClient::subscribe() - Socket client not initialized!");
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
    return this.log("info", `KnishIOClient::hashSecret(${t ? `source: ${t}` : ""}) - Computing wallet bundle from secret...`), Ct(e);
  }
  /**
   * Retrieves the stored secret for this session
   *
   * @return {string}
   */
  getSecret() {
    if (!this.hasSecret())
      throw new pr("KnishIOClient::getSecret() - Unable to find a stored secret! Have you set a secret?");
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
      throw new pr("KnishIOClient::getBundle() - Unable to find a stored bundle! Have you set a secret?");
    return this.$__bundle;
  }
  /**
   * Retrieves the device fingerprint.
   *
   * @returns {Promise<string>} A promise that resolves to the device fingerprint as a string.
   */
  getFingerprint() {
    return bl();
  }
  getFingerprintData() {
    return ks();
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
    return e ? e.key = V.generateKey({
      secret: this.getSecret(),
      token: e.token,
      position: e.position
    }) : e = new V({
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
    return this.log("info", "KnishIOClient::createMolecule() - Creating a new molecule..."), e = e || this.getSecret(), t = t || this.getBundle(), !r && this.lastMoleculeQuery && this.getRemainderWallet().token === "USER" && this.lastMoleculeQuery.response() && this.lastMoleculeQuery.response().success() && (r = this.getRemainderWallet()), r === null && (r = await this.getSourceWallet()), this.remainderWallet = i || V.create({
      secret: e,
      bundle: t,
      token: "USER",
      batchId: r.batchId,
      characters: r.characters
    }), new Ze({
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
    if (!(i instanceof we))
      throw new tt(`${this.constructor.name}::createMoleculeMutation() - This method only accepts MutationProposeMolecule!`);
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
    const i = this.createQuery(Eu);
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
    if (i === null || $t.cmp(i.balance, t) < 0)
      throw new Ye();
    if (!i.position || !i.address)
      throw new Ye("Source wallet can not be a shadow wallet.");
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
    return await this.createSubscribe(Gu).execute({
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
      throw new tt(`${this.constructor.name}::subscribeWalletStatus() - Token parameter is required!`);
    return this.createSubscribe(zu).execute({
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
    return this.createSubscribe(Ju).execute({
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
    return this.createSubscribe(Xu).execute({
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
    filter: c = null,
    queryArgs: h = null,
    count: f = null,
    countBy: l = null,
    throughAtom: y = !0,
    values: p = null,
    keys: g = null,
    atomValues: b = null
  }) {
    this.log("info", `KnishIOClient::queryMeta() - Querying metaType: ${e}, metaId: ${t}...`);
    let A, S;
    return y ? (A = this.createQuery(Ai), S = Ai.createVariables({
      metaType: e,
      metaId: t,
      key: r,
      value: i,
      latest: s,
      filter: c,
      queryArgs: h,
      countBy: l,
      values: p,
      keys: g,
      atomValues: b
    })) : (A = this.createQuery(xi), S = xi.createVariables({
      metaType: e,
      metaId: t,
      key: r,
      value: i,
      latest: s,
      filter: c,
      queryArgs: h,
      count: f,
      countBy: l
    })), this.executeQuery(A, S).then(($) => $.payload());
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
    const t = this.createQuery(nn);
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
    const t = this.createQuery($u);
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
    walletAddresses: c,
    walletAddress: h,
    isotopes: f,
    isotope: l,
    tokenSlugs: y,
    tokenSlug: p,
    cellSlugs: g,
    cellSlug: b,
    batchIds: A,
    batchId: S,
    values: $,
    value: B,
    metaTypes: T,
    metaType: x,
    metaIds: _,
    metaId: I,
    indexes: N,
    index: O,
    filter: q,
    latest: ee,
    queryArgs: Q = {
      limit: 15,
      offset: 1
    }
  }) {
    this.log("info", "KnishIOClient::queryAtom() - Querying atom instances");
    const pe = this.createQuery(Si);
    return await this.executeQuery(pe, Si.createVariables({
      molecularHashes: e,
      molecularHash: t,
      bundleHashes: r,
      bundleHash: i,
      positions: s,
      position: o,
      walletAddresses: c,
      walletAddress: h,
      isotopes: f,
      isotope: l,
      tokenSlugs: y,
      tokenSlug: p,
      cellSlugs: g,
      cellSlug: b,
      batchIds: A,
      batchId: S,
      values: $,
      value: B,
      metaTypes: T,
      metaType: x,
      metaIds: _,
      metaId: I,
      indexes: N,
      index: O,
      filter: q,
      latest: ee,
      queryArgs: Q
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
    const t = new V({
      secret: this.getSecret(),
      token: e
    }), r = await this.createMoleculeMutation({
      mutationClass: Wu
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
    const i = this.createQuery(tl);
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
    resolution: c,
    timeZone: h,
    countBy: f,
    interval: l
  }) {
    const y = this.createQuery(rl);
    return await this.executeQuery(y, {
      bundleHash: e,
      metaType: t,
      metaId: r,
      ipAddress: i,
      browser: s,
      osCpu: o,
      resolution: c,
      timeZone: h,
      countBy: f,
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
    metaId: r,
    ipAddress: i,
    browser: s,
    osCpu: o,
    resolution: c,
    timeZone: h,
    json: f = {}
  }) {
    const l = this.createQuery(Zu);
    return await this.executeQuery(l, {
      bundleHash: e,
      metaType: t,
      metaId: r,
      ipAddress: i,
      browser: s,
      osCpu: o,
      resolution: c,
      timeZone: h,
      json: JSON.stringify(f)
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
    const o = se.get(r || {}, "fungibility");
    if (o === "stackable" && (r.batchId = i || An({})), ["nonfungible", "stackable"].includes(o) && s.length > 0) {
      if (se.get(r || {}, "decimals") > 0)
        throw new Qu();
      if (t > 0)
        throw new pn();
      t = s.length, r.splittable = 1, r.decimals = 0, r.tokenUnits = JSON.stringify(s);
    }
    const c = new V({
      secret: this.getSecret(),
      bundle: this.getBundle(),
      token: e,
      batchId: i
    }), h = await this.createMoleculeMutation({
      mutationClass: Mu
    });
    return h.fillMolecule({
      recipientWallet: c,
      amount: t,
      meta: r || {}
    }), await this.executeQuery(h);
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
        mutationClass: cl,
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
        mutationClass: Du,
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
      mutationClass: Hu
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
      mutationClass: we,
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
    const r = this.createQuery(al);
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
    const i = this.createQuery(Au);
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
    const i = this.createQuery(Su);
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
    const t = this.createQuery(ku);
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
    let c, h;
    s = s || {};
    const f = this.createQuery(il), l = await this.executeQuery(f, {
      slug: e
    }), y = se.get(l.data(), "0.fungibility") === "stackable";
    if (!y && o !== null)
      throw new wn("Expected Batch ID = null for non-stackable tokens.");
    if (y && o === null && (o = An({})), i.length > 0) {
      if (r > 0)
        throw new pn();
      r = i.length, s.tokenUnits = JSON.stringify(i);
    }
    t ? (Object.prototype.toString.call(t) === "[object String]" && (V.isBundleHash(t) ? (c = "walletBundle", h = t) : t = V.create({
      secret: t,
      token: e
    })), t instanceof V && (c = "wallet", s.position = t.position, s.bundle = t.bundle, h = t.address)) : (c = "walletBundle", h = this.getBundle());
    const p = await this.createMoleculeMutation({
      mutationClass: Ru
    });
    return p.fillMolecule({
      token: e,
      amount: r,
      metaType: c,
      metaId: h,
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
      mutationClass: qu,
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
      throw new ki();
    t.forEach((i) => {
      if (!i.isShadow())
        throw new ki();
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
        throw new pn();
      r = i.length;
    }
    if (o === null && (o = await this.querySourceWallet({
      token: t,
      amount: r
    })), o === null || $t.cmp(o.balance, r) < 0)
      throw new Ye();
    const c = V.create({
      bundle: e,
      token: t
    });
    s !== null ? c.batchId = s : c.initBatchId({
      sourceWallet: o
    });
    const h = o.createRemainder(this.getSecret());
    o.splitUnits(
      i,
      h,
      c
    );
    const f = await this.createMolecule({
      sourceWallet: o,
      remainderWallet: h
    }), l = await this.createMoleculeMutation({
      mutationClass: Uu,
      molecule: f
    });
    return l.fillMolecule({
      recipientWallet: c,
      amount: r
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
    }), c = await this.createMoleculeMutation({
      mutationClass: hl,
      molecule: o
    });
    return c.fillMolecule({
      amount: t,
      tradeRates: r
    }), await this.executeQuery(c);
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
    }), c = await this.createMoleculeMutation({
      mutationClass: fl,
      molecule: o
    }), h = {};
    return h[this.getBundle()] = t, c.fillMolecule({
      recipients: h,
      signingWallet: i
    }), await this.executeQuery(c);
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
        throw new pn();
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
    const c = await this.createMoleculeMutation({
      mutationClass: we,
      molecule: o
    });
    return this.executeQuery(c);
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
      throw new Ye("Source wallet is missing or invalid.");
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
    const c = await this.createMoleculeMutation({
      mutationClass: we,
      molecule: o
    });
    return this.executeQuery(c);
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
      throw new Ye("Source wallet is missing or invalid.");
    if (!s.tokenUnits || !s.tokenUnits.length)
      throw new Ye("Source wallet does not have token units.");
    if (!i.length)
      throw new Ye("Fused token unit list is empty.");
    const o = [];
    s.tokenUnits.forEach((y) => {
      o.push(y.id);
    }), i.forEach((y) => {
      if (!o.includes(y))
        throw new Ye(`Fused token unit ID = ${y} does not found in the source wallet.`);
    });
    const c = V.create({
      bundle: e,
      token: t
    });
    c.initBatchId({ sourceWallet: s });
    const h = s.createRemainder(this.getSecret());
    s.splitUnits(i, h), r.metas.fusedTokenUnits = s.getTokenUnitsData(), c.tokenUnits = [r];
    const f = await this.createMolecule({
      sourceWallet: s,
      remainderWallet: h
    });
    f.fuseToken(s.tokenUnits, c), f.sign({
      bundle: this.getBundle()
    }), f.check();
    const l = await this.createMoleculeMutation({
      mutationClass: we,
      molecule: f
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
    const r = new V({
      secret: fr(await this.getFingerprint()),
      token: "AUTH"
    }), i = await this.createQuery(Vu), s = {
      cellSlug: e,
      pubkey: r.pubkey,
      encrypt: t
    }, o = await i.execute({ variables: s });
    if (o.success()) {
      const c = en.create(o.payload(), r);
      this.setAuthToken(c);
    } else
      throw new vi(`KnishIOClient::requestGuestAuthToken() - Authorization attempt rejected by ledger. Reason: ${o.reason()}`);
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
    const r = new V({
      secret: e,
      token: "AUTH"
    }), i = await this.createMolecule({
      secret: e,
      sourceWallet: r
    }), s = await this.createMoleculeMutation({
      mutationClass: Bu,
      molecule: i
    });
    s.fillMolecule({ meta: { encrypt: t ? "true" : "false" } });
    const o = await s.execute({});
    if (o.success()) {
      const c = en.create(o.payload(), r);
      this.setAuthToken(c);
    } else
      throw new vi(`KnishIOClient::requestProfileAuthToken() - Authorization attempt rejected by ledger. Reason: ${o.reason()}`);
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
    e === null && t && (e = fr(t)), r && this.setCellSlug(r), this.$__authInProcess = !0;
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
  P as Atom,
  Ql as KnishIOClient,
  Sn as Meta,
  Ze as Molecule,
  V as Wallet,
  lo as base64ToHex,
  Wl as bufferToHexString,
  ao as charsetBaseConvert,
  vn as chunkSubstr,
  Ct as generateBundleHash,
  fr as generateSecret,
  jl as hexStringToBuffer,
  uo as hexToBase64,
  co as isHex,
  kr as randomString
};
//# sourceMappingURL=client.es.mjs.map
