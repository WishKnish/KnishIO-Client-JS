var As = Object.defineProperty;
var xs = (n, e, t) => e in n ? As(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var Ge = (n, e, t) => xs(n, typeof e != "symbol" ? e + "" : e, t);
class F {
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
    const s = t.split(".");
    let i = e;
    const o = s.length - 1;
    for (let l = 0; l < o; l++) {
      const u = s[l], d = Number(u), h = Number.isInteger(d);
      (h ? d : u in i) || (i[h ? d : u] = s[l + 1].match(/^\d+$/) ? [] : {}), i = i[h ? d : u];
    }
    const a = s[o], c = Number(a);
    return i[Number.isInteger(c) ? c : a] = r, e;
  }
}
const hn = 10 ** 18;
class et {
  /**
   * @param {number} value
   * @return {number}
   */
  static val(e) {
    return Math.abs(e * hn) < 1 ? 0 : e;
  }
  /**
   * @param {number} value1
   * @param {number} value2
   * @param {boolean} debug
   * @return {number}
   */
  static cmp(e, t, r = !1) {
    const s = et.val(e) * hn, i = et.val(t) * hn;
    return Math.abs(s - i) < 1 ? 0 : s > i ? 1 : -1;
  }
  /**
   * @param {number} value1
   * @param {number} value2
   * @return {boolean}
   */
  static equal(e, t) {
    return et.cmp(e, t) === 0;
  }
}
typeof self > "u" && (global.self = global);
class qr {
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
    }, s = Object.assign(
      {
        grouping: 0,
        rowlength: 0,
        uppercase: !1
      },
      t || {}
    );
    let i = "", o = 0, a = 0;
    for (let c = 0; c < e.length && (i += r(e[c], s.uppercase), c !== e.length - 1); ++c)
      s.grouping > 0 && ++o === s.grouping && (o = 0, s.rowlength > 0 && ++a === s.rowlength ? (a = 0, i += `
`) : i += " ");
    return i;
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
    let s = -1;
    for (let i = 0; i < t.length; ++i) {
      const o = t[i], a = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"].indexOf(o);
      if (a === -1)
        throw Error("unexpected character");
      s === -1 ? s = 16 * a : (r[Math.floor(i / 2)] = s + a, s = -1);
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
function jt(n, e) {
  const t = Math.ceil(n.length / e), r = [];
  for (let s = 0, i = 0; s < t; ++s, i += e)
    r[s] = n.substr(i, e);
  return r;
}
function Mn(n = 256, e = "abcdef0123456789") {
  let t = new Uint8Array(n);
  return t = crypto.getRandomValues(t), t = t.map((r) => e.charCodeAt(r % e.length)), String.fromCharCode.apply(null, t);
}
function _s(n, e, t, r, s) {
  if (r = r || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~`!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?¿¡", s = s || r, e > r.length || t > s.length)
    return console.warn("Strings::charsetBaseConvert() - Can't convert", n, "to base", t, "greater than symbol table length. src-table:", r.length, "dest-table:", s.length), !1;
  let o = BigInt(0);
  for (let c = 0; c < n.length; c++)
    o = o * BigInt(e) + BigInt(r.indexOf(n.charAt(c)));
  let a = "";
  for (; o > 0; ) {
    const c = o % BigInt(t);
    a = s.charAt(Number(c)) + a, o /= BigInt(t);
  }
  return a || "0";
}
function $s(n) {
  return qr.toHex(n, {});
}
function Is(n) {
  return qr.toUint8Array(n);
}
function Es(n) {
  const e = Is(n);
  return btoa(String.fromCharCode.apply(null, e));
}
function Ts(n) {
  const e = new Uint8Array(atob(n).split("").map((t) => t.charCodeAt(0)));
  return $s(e);
}
function Cs(n) {
  return /^[A-F0-9]+$/i.test(n);
}
function Ms(n) {
  return (typeof n == "number" || typeof n == "string" && n.trim() !== "") && !isNaN(n);
}
const Hr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Br = "ARRAYBUFFER not supported by this environment", Lr = "UINT8ARRAY not supported by this environment";
function Ln(n, e, t, r) {
  let s, i, o;
  const a = e || [0], c = (t = t || 0) >>> 3, l = r === -1 ? 3 : 0;
  for (s = 0; s < n.length; s += 1) o = s + c, i = o >>> 2, a.length <= i && a.push(0), a[i] |= n[s] << 8 * (l + r * (o % 4));
  return { value: a, binLen: 8 * n.length + t };
}
function at(n, e, t) {
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
      return function(r, s, i) {
        return function(o, a, c, l) {
          let u, d, h, m;
          if (o.length % 2 != 0) throw new Error("String of HEX type must be in byte increments");
          const y = a || [0], g = (c = c || 0) >>> 3, w = l === -1 ? 3 : 0;
          for (u = 0; u < o.length; u += 2) {
            if (d = parseInt(o.substr(u, 2), 16), isNaN(d)) throw new Error("String of HEX type contains invalid characters");
            for (m = (u >>> 1) + g, h = m >>> 2; y.length <= h; ) y.push(0);
            y[h] |= d << 8 * (w + l * (m % 4));
          }
          return { value: y, binLen: 4 * o.length + c };
        }(r, s, i, t);
      };
    case "TEXT":
      return function(r, s, i) {
        return function(o, a, c, l, u) {
          let d, h, m, y, g, w, v, A, S = 0;
          const p = c || [0], k = (l = l || 0) >>> 3;
          if (a === "UTF8") for (v = u === -1 ? 3 : 0, m = 0; m < o.length; m += 1) for (d = o.charCodeAt(m), h = [], 128 > d ? h.push(d) : 2048 > d ? (h.push(192 | d >>> 6), h.push(128 | 63 & d)) : 55296 > d || 57344 <= d ? h.push(224 | d >>> 12, 128 | d >>> 6 & 63, 128 | 63 & d) : (m += 1, d = 65536 + ((1023 & d) << 10 | 1023 & o.charCodeAt(m)), h.push(240 | d >>> 18, 128 | d >>> 12 & 63, 128 | d >>> 6 & 63, 128 | 63 & d)), y = 0; y < h.length; y += 1) {
            for (w = S + k, g = w >>> 2; p.length <= g; ) p.push(0);
            p[g] |= h[y] << 8 * (v + u * (w % 4)), S += 1;
          }
          else for (v = u === -1 ? 2 : 0, A = a === "UTF16LE" && u !== 1 || a !== "UTF16LE" && u === 1, m = 0; m < o.length; m += 1) {
            for (d = o.charCodeAt(m), A === !0 && (y = 255 & d, d = y << 8 | d >>> 8), w = S + k, g = w >>> 2; p.length <= g; ) p.push(0);
            p[g] |= d << 8 * (v + u * (w % 4)), S += 2;
          }
          return { value: p, binLen: 8 * S + l };
        }(r, e, s, i, t);
      };
    case "B64":
      return function(r, s, i) {
        return function(o, a, c, l) {
          let u, d, h, m, y, g, w, v = 0;
          const A = a || [0], S = (c = c || 0) >>> 3, p = l === -1 ? 3 : 0, k = o.indexOf("=");
          if (o.search(/^[a-zA-Z0-9=+/]+$/) === -1) throw new Error("Invalid character in base-64 string");
          if (o = o.replace(/=/g, ""), k !== -1 && k < o.length) throw new Error("Invalid '=' found in base-64 string");
          for (d = 0; d < o.length; d += 4) {
            for (y = o.substr(d, 4), m = 0, h = 0; h < y.length; h += 1) u = Hr.indexOf(y.charAt(h)), m |= u << 18 - 6 * h;
            for (h = 0; h < y.length - 1; h += 1) {
              for (w = v + S, g = w >>> 2; A.length <= g; ) A.push(0);
              A[g] |= (m >>> 16 - 8 * h & 255) << 8 * (p + l * (w % 4)), v += 1;
            }
          }
          return { value: A, binLen: 8 * v + c };
        }(r, s, i, t);
      };
    case "BYTES":
      return function(r, s, i) {
        return function(o, a, c, l) {
          let u, d, h, m;
          const y = a || [0], g = (c = c || 0) >>> 3, w = l === -1 ? 3 : 0;
          for (d = 0; d < o.length; d += 1) u = o.charCodeAt(d), m = d + g, h = m >>> 2, y.length <= h && y.push(0), y[h] |= u << 8 * (w + l * (m % 4));
          return { value: y, binLen: 8 * o.length + c };
        }(r, s, i, t);
      };
    case "ARRAYBUFFER":
      try {
        new ArrayBuffer(0);
      } catch {
        throw new Error(Br);
      }
      return function(r, s, i) {
        return function(o, a, c, l) {
          return Ln(new Uint8Array(o), a, c, l);
        }(r, s, i, t);
      };
    case "UINT8ARRAY":
      try {
        new Uint8Array(0);
      } catch {
        throw new Error(Lr);
      }
      return function(r, s, i) {
        return Ln(r, s, i, t);
      };
    default:
      throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
  }
}
function Pn(n, e, t, r) {
  switch (n) {
    case "HEX":
      return function(s) {
        return function(i, o, a, c) {
          const l = "0123456789abcdef";
          let u, d, h = "";
          const m = o / 8, y = a === -1 ? 3 : 0;
          for (u = 0; u < m; u += 1) d = i[u >>> 2] >>> 8 * (y + a * (u % 4)), h += l.charAt(d >>> 4 & 15) + l.charAt(15 & d);
          return c.outputUpper ? h.toUpperCase() : h;
        }(s, e, t, r);
      };
    case "B64":
      return function(s) {
        return function(i, o, a, c) {
          let l, u, d, h, m, y = "";
          const g = o / 8, w = a === -1 ? 3 : 0;
          for (l = 0; l < g; l += 3) for (h = l + 1 < g ? i[l + 1 >>> 2] : 0, m = l + 2 < g ? i[l + 2 >>> 2] : 0, d = (i[l >>> 2] >>> 8 * (w + a * (l % 4)) & 255) << 16 | (h >>> 8 * (w + a * ((l + 1) % 4)) & 255) << 8 | m >>> 8 * (w + a * ((l + 2) % 4)) & 255, u = 0; u < 4; u += 1) y += 8 * l + 6 * u <= o ? Hr.charAt(d >>> 6 * (3 - u) & 63) : c.b64Pad;
          return y;
        }(s, e, t, r);
      };
    case "BYTES":
      return function(s) {
        return function(i, o, a) {
          let c, l, u = "";
          const d = o / 8, h = a === -1 ? 3 : 0;
          for (c = 0; c < d; c += 1) l = i[c >>> 2] >>> 8 * (h + a * (c % 4)) & 255, u += String.fromCharCode(l);
          return u;
        }(s, e, t);
      };
    case "ARRAYBUFFER":
      try {
        new ArrayBuffer(0);
      } catch {
        throw new Error(Br);
      }
      return function(s) {
        return function(i, o, a) {
          let c;
          const l = o / 8, u = new ArrayBuffer(l), d = new Uint8Array(u), h = a === -1 ? 3 : 0;
          for (c = 0; c < l; c += 1) d[c] = i[c >>> 2] >>> 8 * (h + a * (c % 4)) & 255;
          return u;
        }(s, e, t);
      };
    case "UINT8ARRAY":
      try {
        new Uint8Array(0);
      } catch {
        throw new Error(Lr);
      }
      return function(s) {
        return function(i, o, a) {
          let c;
          const l = o / 8, u = a === -1 ? 3 : 0, d = new Uint8Array(l);
          for (c = 0; c < l; c += 1) d[c] = i[c >>> 2] >>> 8 * (u + a * (c % 4)) & 255;
          return d;
        }(s, e, t);
      };
    default:
      throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
  }
}
const Tt = 4294967296, x = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], Ee = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], Te = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], Ct = "Chosen SHA variant is not supported", Pr = "Cannot set numRounds with MAC";
function Qt(n, e) {
  let t, r;
  const s = n.binLen >>> 3, i = e.binLen >>> 3, o = s << 3, a = 4 - s << 3;
  if (s % 4 != 0) {
    for (t = 0; t < i; t += 4) r = s + t >>> 2, n.value[r] |= e.value[t >>> 2] << o, n.value.push(0), n.value[r + 1] |= e.value[t >>> 2] >>> a;
    return (n.value.length << 2) - 4 >= i + s && n.value.pop(), { value: n.value, binLen: n.binLen + e.binLen };
  }
  return { value: n.value.concat(e.value), binLen: n.binLen + e.binLen };
}
function Kn(n) {
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
function qe(n, e, t, r) {
  const s = n + " must include a value and format";
  if (!e) {
    if (!r) throw new Error(s);
    return r;
  }
  if (e.value === void 0 || !e.format) throw new Error(s);
  return at(e.format, e.encoding || "UTF8", t)(e.value);
}
let sn = class {
  constructor(e, t, r) {
    const s = r || {};
    if (this.t = t, this.i = s.encoding || "UTF8", this.numRounds = s.numRounds || 1, isNaN(this.numRounds) || this.numRounds !== parseInt(this.numRounds, 10) || 1 > this.numRounds) throw new Error("numRounds must a integer >= 1");
    this.o = e, this.h = [], this.u = 0, this.l = !1, this.A = 0, this.H = !1, this.S = [], this.p = [];
  }
  update(e) {
    let t, r = 0;
    const s = this.m >>> 5, i = this.C(e, this.h, this.u), o = i.binLen, a = i.value, c = o >>> 5;
    for (t = 0; t < c; t += s) r + this.m <= o && (this.U = this.v(a.slice(t, t + s), this.U), r += this.m);
    return this.A += r, this.h = a.slice(r >>> 5), this.u = o % this.m, this.l = !0, this;
  }
  getHash(e, t) {
    let r, s, i = this.R;
    const o = Kn(t);
    if (this.K) {
      if (o.outputLen === -1) throw new Error("Output length must be specified in options");
      i = o.outputLen;
    }
    const a = Pn(e, i, this.T, o);
    if (this.H && this.g) return a(this.g(o));
    for (s = this.F(this.h.slice(), this.u, this.A, this.L(this.U), i), r = 1; r < this.numRounds; r += 1) this.K && i % 32 != 0 && (s[s.length - 1] &= 16777215 >>> 24 - i % 32), s = this.F(s, i, 0, this.B(this.o), i);
    return a(s);
  }
  setHMACKey(e, t, r) {
    if (!this.M) throw new Error("Variant does not support HMAC");
    if (this.l) throw new Error("Cannot set MAC key after calling update");
    const s = at(t, (r || {}).encoding || "UTF8", this.T);
    this.k(s(e));
  }
  k(e) {
    const t = this.m >>> 3, r = t / 4 - 1;
    let s;
    if (this.numRounds !== 1) throw new Error(Pr);
    if (this.H) throw new Error("MAC key already set");
    for (t < e.binLen / 8 && (e.value = this.F(e.value, e.binLen, 0, this.B(this.o), this.R)); e.value.length <= r; ) e.value.push(0);
    for (s = 0; s <= r; s += 1) this.S[s] = 909522486 ^ e.value[s], this.p[s] = 1549556828 ^ e.value[s];
    this.U = this.v(this.S, this.U), this.A = this.m, this.H = !0;
  }
  getHMAC(e, t) {
    const r = Kn(t);
    return Pn(e, this.R, this.T, r)(this.Y());
  }
  Y() {
    let e;
    if (!this.H) throw new Error("Cannot call getHMAC without first setting MAC key");
    const t = this.F(this.h.slice(), this.u, this.A, this.L(this.U), this.R);
    return e = this.v(this.p, this.B(this.o)), e = this.F(t, this.R, this.m, e, this.R), e;
  }
};
function Xe(n, e) {
  return n << e | n >>> 32 - e;
}
function Se(n, e) {
  return n >>> e | n << 32 - e;
}
function Kr(n, e) {
  return n >>> e;
}
function Fn(n, e, t) {
  return n ^ e ^ t;
}
function Fr(n, e, t) {
  return n & e ^ ~n & t;
}
function Dr(n, e, t) {
  return n & e ^ n & t ^ e & t;
}
function Os(n) {
  return Se(n, 2) ^ Se(n, 13) ^ Se(n, 22);
}
function Y(n, e) {
  const t = (65535 & n) + (65535 & e);
  return (65535 & (n >>> 16) + (e >>> 16) + (t >>> 16)) << 16 | 65535 & t;
}
function Ns(n, e, t, r) {
  const s = (65535 & n) + (65535 & e) + (65535 & t) + (65535 & r);
  return (65535 & (n >>> 16) + (e >>> 16) + (t >>> 16) + (r >>> 16) + (s >>> 16)) << 16 | 65535 & s;
}
function wt(n, e, t, r, s) {
  const i = (65535 & n) + (65535 & e) + (65535 & t) + (65535 & r) + (65535 & s);
  return (65535 & (n >>> 16) + (e >>> 16) + (t >>> 16) + (r >>> 16) + (s >>> 16) + (i >>> 16)) << 16 | 65535 & i;
}
function Rs(n) {
  return Se(n, 7) ^ Se(n, 18) ^ Kr(n, 3);
}
function Us(n) {
  return Se(n, 6) ^ Se(n, 11) ^ Se(n, 25);
}
function qs(n) {
  return [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
}
function Wr(n, e) {
  let t, r, s, i, o, a, c;
  const l = [];
  for (t = e[0], r = e[1], s = e[2], i = e[3], o = e[4], c = 0; c < 80; c += 1) l[c] = c < 16 ? n[c] : Xe(l[c - 3] ^ l[c - 8] ^ l[c - 14] ^ l[c - 16], 1), a = c < 20 ? wt(Xe(t, 5), Fr(r, s, i), o, 1518500249, l[c]) : c < 40 ? wt(Xe(t, 5), Fn(r, s, i), o, 1859775393, l[c]) : c < 60 ? wt(Xe(t, 5), Dr(r, s, i), o, 2400959708, l[c]) : wt(Xe(t, 5), Fn(r, s, i), o, 3395469782, l[c]), o = i, i = s, s = Xe(r, 30), r = t, t = a;
  return e[0] = Y(t, e[0]), e[1] = Y(r, e[1]), e[2] = Y(s, e[2]), e[3] = Y(i, e[3]), e[4] = Y(o, e[4]), e;
}
function Hs(n, e, t, r) {
  let s;
  const i = 15 + (e + 65 >>> 9 << 4), o = e + t;
  for (; n.length <= i; ) n.push(0);
  for (n[e >>> 5] |= 128 << 24 - e % 32, n[i] = 4294967295 & o, n[i - 1] = o / Tt | 0, s = 0; s < n.length; s += 16) r = Wr(n.slice(s, s + 16), r);
  return r;
}
let Bs = class extends sn {
  constructor(e, t, r) {
    if (e !== "SHA-1") throw new Error(Ct);
    super(e, t, r);
    const s = r || {};
    this.M = !0, this.g = this.Y, this.T = -1, this.C = at(this.t, this.i, this.T), this.v = Wr, this.L = function(i) {
      return i.slice();
    }, this.B = qs, this.F = Hs, this.U = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.m = 512, this.R = 160, this.K = !1, s.hmacKey && this.k(qe("hmacKey", s.hmacKey, this.T));
  }
};
function Dn(n) {
  let e;
  return e = n == "SHA-224" ? Ee.slice() : Te.slice(), e;
}
function Wn(n, e) {
  let t, r, s, i, o, a, c, l, u, d, h;
  const m = [];
  for (t = e[0], r = e[1], s = e[2], i = e[3], o = e[4], a = e[5], c = e[6], l = e[7], h = 0; h < 64; h += 1) m[h] = h < 16 ? n[h] : Ns(Se(y = m[h - 2], 17) ^ Se(y, 19) ^ Kr(y, 10), m[h - 7], Rs(m[h - 15]), m[h - 16]), u = wt(l, Us(o), Fr(o, a, c), x[h], m[h]), d = Y(Os(t), Dr(t, r, s)), l = c, c = a, a = o, o = Y(i, u), i = s, s = r, r = t, t = Y(u, d);
  var y;
  return e[0] = Y(t, e[0]), e[1] = Y(r, e[1]), e[2] = Y(s, e[2]), e[3] = Y(i, e[3]), e[4] = Y(o, e[4]), e[5] = Y(a, e[5]), e[6] = Y(c, e[6]), e[7] = Y(l, e[7]), e;
}
let Ls = class extends sn {
  constructor(e, t, r) {
    if (e !== "SHA-224" && e !== "SHA-256") throw new Error(Ct);
    super(e, t, r);
    const s = r || {};
    this.g = this.Y, this.M = !0, this.T = -1, this.C = at(this.t, this.i, this.T), this.v = Wn, this.L = function(i) {
      return i.slice();
    }, this.B = Dn, this.F = function(i, o, a, c) {
      return function(l, u, d, h, m) {
        let y, g;
        const w = 15 + (u + 65 >>> 9 << 4), v = u + d;
        for (; l.length <= w; ) l.push(0);
        for (l[u >>> 5] |= 128 << 24 - u % 32, l[w] = 4294967295 & v, l[w - 1] = v / Tt | 0, y = 0; y < l.length; y += 16) h = Wn(l.slice(y, y + 16), h);
        return g = m === "SHA-224" ? [h[0], h[1], h[2], h[3], h[4], h[5], h[6]] : h, g;
      }(i, o, a, c, e);
    }, this.U = Dn(e), this.m = 512, this.R = e === "SHA-224" ? 224 : 256, this.K = !1, s.hmacKey && this.k(qe("hmacKey", s.hmacKey, this.T));
  }
};
class f {
  constructor(e, t) {
    this.N = e, this.I = t;
  }
}
function jn(n, e) {
  let t;
  return e > 32 ? (t = 64 - e, new f(n.I << e | n.N >>> t, n.N << e | n.I >>> t)) : e !== 0 ? (t = 32 - e, new f(n.N << e | n.I >>> t, n.I << e | n.N >>> t)) : n;
}
function Ae(n, e) {
  let t;
  return e < 32 ? (t = 32 - e, new f(n.N >>> e | n.I << t, n.I >>> e | n.N << t)) : (t = 64 - e, new f(n.I >>> e | n.N << t, n.N >>> e | n.I << t));
}
function jr(n, e) {
  return new f(n.N >>> e, n.I >>> e | n.N << 32 - e);
}
function Ps(n, e, t) {
  return new f(n.N & e.N ^ n.N & t.N ^ e.N & t.N, n.I & e.I ^ n.I & t.I ^ e.I & t.I);
}
function Ks(n) {
  const e = Ae(n, 28), t = Ae(n, 34), r = Ae(n, 39);
  return new f(e.N ^ t.N ^ r.N, e.I ^ t.I ^ r.I);
}
function me(n, e) {
  let t, r;
  t = (65535 & n.I) + (65535 & e.I), r = (n.I >>> 16) + (e.I >>> 16) + (t >>> 16);
  const s = (65535 & r) << 16 | 65535 & t;
  return t = (65535 & n.N) + (65535 & e.N) + (r >>> 16), r = (n.N >>> 16) + (e.N >>> 16) + (t >>> 16), new f((65535 & r) << 16 | 65535 & t, s);
}
function Fs(n, e, t, r) {
  let s, i;
  s = (65535 & n.I) + (65535 & e.I) + (65535 & t.I) + (65535 & r.I), i = (n.I >>> 16) + (e.I >>> 16) + (t.I >>> 16) + (r.I >>> 16) + (s >>> 16);
  const o = (65535 & i) << 16 | 65535 & s;
  return s = (65535 & n.N) + (65535 & e.N) + (65535 & t.N) + (65535 & r.N) + (i >>> 16), i = (n.N >>> 16) + (e.N >>> 16) + (t.N >>> 16) + (r.N >>> 16) + (s >>> 16), new f((65535 & i) << 16 | 65535 & s, o);
}
function Ds(n, e, t, r, s) {
  let i, o;
  i = (65535 & n.I) + (65535 & e.I) + (65535 & t.I) + (65535 & r.I) + (65535 & s.I), o = (n.I >>> 16) + (e.I >>> 16) + (t.I >>> 16) + (r.I >>> 16) + (s.I >>> 16) + (i >>> 16);
  const a = (65535 & o) << 16 | 65535 & i;
  return i = (65535 & n.N) + (65535 & e.N) + (65535 & t.N) + (65535 & r.N) + (65535 & s.N) + (o >>> 16), o = (n.N >>> 16) + (e.N >>> 16) + (t.N >>> 16) + (r.N >>> 16) + (s.N >>> 16) + (i >>> 16), new f((65535 & o) << 16 | 65535 & i, a);
}
function ut(n, e) {
  return new f(n.N ^ e.N, n.I ^ e.I);
}
function Ws(n) {
  const e = Ae(n, 19), t = Ae(n, 61), r = jr(n, 6);
  return new f(e.N ^ t.N ^ r.N, e.I ^ t.I ^ r.I);
}
function js(n) {
  const e = Ae(n, 1), t = Ae(n, 8), r = jr(n, 7);
  return new f(e.N ^ t.N ^ r.N, e.I ^ t.I ^ r.I);
}
function Qs(n) {
  const e = Ae(n, 14), t = Ae(n, 18), r = Ae(n, 41);
  return new f(e.N ^ t.N ^ r.N, e.I ^ t.I ^ r.I);
}
const Vs = [new f(x[0], 3609767458), new f(x[1], 602891725), new f(x[2], 3964484399), new f(x[3], 2173295548), new f(x[4], 4081628472), new f(x[5], 3053834265), new f(x[6], 2937671579), new f(x[7], 3664609560), new f(x[8], 2734883394), new f(x[9], 1164996542), new f(x[10], 1323610764), new f(x[11], 3590304994), new f(x[12], 4068182383), new f(x[13], 991336113), new f(x[14], 633803317), new f(x[15], 3479774868), new f(x[16], 2666613458), new f(x[17], 944711139), new f(x[18], 2341262773), new f(x[19], 2007800933), new f(x[20], 1495990901), new f(x[21], 1856431235), new f(x[22], 3175218132), new f(x[23], 2198950837), new f(x[24], 3999719339), new f(x[25], 766784016), new f(x[26], 2566594879), new f(x[27], 3203337956), new f(x[28], 1034457026), new f(x[29], 2466948901), new f(x[30], 3758326383), new f(x[31], 168717936), new f(x[32], 1188179964), new f(x[33], 1546045734), new f(x[34], 1522805485), new f(x[35], 2643833823), new f(x[36], 2343527390), new f(x[37], 1014477480), new f(x[38], 1206759142), new f(x[39], 344077627), new f(x[40], 1290863460), new f(x[41], 3158454273), new f(x[42], 3505952657), new f(x[43], 106217008), new f(x[44], 3606008344), new f(x[45], 1432725776), new f(x[46], 1467031594), new f(x[47], 851169720), new f(x[48], 3100823752), new f(x[49], 1363258195), new f(x[50], 3750685593), new f(x[51], 3785050280), new f(x[52], 3318307427), new f(x[53], 3812723403), new f(x[54], 2003034995), new f(x[55], 3602036899), new f(x[56], 1575990012), new f(x[57], 1125592928), new f(x[58], 2716904306), new f(x[59], 442776044), new f(x[60], 593698344), new f(x[61], 3733110249), new f(x[62], 2999351573), new f(x[63], 3815920427), new f(3391569614, 3928383900), new f(3515267271, 566280711), new f(3940187606, 3454069534), new f(4118630271, 4000239992), new f(116418474, 1914138554), new f(174292421, 2731055270), new f(289380356, 3203993006), new f(460393269, 320620315), new f(685471733, 587496836), new f(852142971, 1086792851), new f(1017036298, 365543100), new f(1126000580, 2618297676), new f(1288033470, 3409855158), new f(1501505948, 4234509866), new f(1607167915, 987167468), new f(1816402316, 1246189591)];
function Qn(n) {
  return n === "SHA-384" ? [new f(3418070365, Ee[0]), new f(1654270250, Ee[1]), new f(2438529370, Ee[2]), new f(355462360, Ee[3]), new f(1731405415, Ee[4]), new f(41048885895, Ee[5]), new f(3675008525, Ee[6]), new f(1203062813, Ee[7])] : [new f(Te[0], 4089235720), new f(Te[1], 2227873595), new f(Te[2], 4271175723), new f(Te[3], 1595750129), new f(Te[4], 2917565137), new f(Te[5], 725511199), new f(Te[6], 4215389547), new f(Te[7], 327033209)];
}
function Vn(n, e) {
  let t, r, s, i, o, a, c, l, u, d, h, m;
  const y = [];
  for (t = e[0], r = e[1], s = e[2], i = e[3], o = e[4], a = e[5], c = e[6], l = e[7], h = 0; h < 80; h += 1) h < 16 ? (m = 2 * h, y[h] = new f(n[m], n[m + 1])) : y[h] = Fs(Ws(y[h - 2]), y[h - 7], js(y[h - 15]), y[h - 16]), u = Ds(l, Qs(o), (w = a, v = c, new f((g = o).N & w.N ^ ~g.N & v.N, g.I & w.I ^ ~g.I & v.I)), Vs[h], y[h]), d = me(Ks(t), Ps(t, r, s)), l = c, c = a, a = o, o = me(i, u), i = s, s = r, r = t, t = me(u, d);
  var g, w, v;
  return e[0] = me(t, e[0]), e[1] = me(r, e[1]), e[2] = me(s, e[2]), e[3] = me(i, e[3]), e[4] = me(o, e[4]), e[5] = me(a, e[5]), e[6] = me(c, e[6]), e[7] = me(l, e[7]), e;
}
let zs = class extends sn {
  constructor(e, t, r) {
    if (e !== "SHA-384" && e !== "SHA-512") throw new Error(Ct);
    super(e, t, r);
    const s = r || {};
    this.g = this.Y, this.M = !0, this.T = -1, this.C = at(this.t, this.i, this.T), this.v = Vn, this.L = function(i) {
      return i.slice();
    }, this.B = Qn, this.F = function(i, o, a, c) {
      return function(l, u, d, h, m) {
        let y, g;
        const w = 31 + (u + 129 >>> 10 << 5), v = u + d;
        for (; l.length <= w; ) l.push(0);
        for (l[u >>> 5] |= 128 << 24 - u % 32, l[w] = 4294967295 & v, l[w - 1] = v / Tt | 0, y = 0; y < l.length; y += 32) h = Vn(l.slice(y, y + 32), h);
        return g = m === "SHA-384" ? [h[0].N, h[0].I, h[1].N, h[1].I, h[2].N, h[2].I, h[3].N, h[3].I, h[4].N, h[4].I, h[5].N, h[5].I] : [h[0].N, h[0].I, h[1].N, h[1].I, h[2].N, h[2].I, h[3].N, h[3].I, h[4].N, h[4].I, h[5].N, h[5].I, h[6].N, h[6].I, h[7].N, h[7].I], g;
      }(i, o, a, c, e);
    }, this.U = Qn(e), this.m = 1024, this.R = e === "SHA-384" ? 384 : 512, this.K = !1, s.hmacKey && this.k(qe("hmacKey", s.hmacKey, this.T));
  }
};
const Js = [new f(0, 1), new f(0, 32898), new f(2147483648, 32906), new f(2147483648, 2147516416), new f(0, 32907), new f(0, 2147483649), new f(2147483648, 2147516545), new f(2147483648, 32777), new f(0, 138), new f(0, 136), new f(0, 2147516425), new f(0, 2147483658), new f(0, 2147516555), new f(2147483648, 139), new f(2147483648, 32905), new f(2147483648, 32771), new f(2147483648, 32770), new f(2147483648, 128), new f(0, 32778), new f(2147483648, 2147483658), new f(2147483648, 2147516545), new f(2147483648, 32896), new f(0, 2147483649), new f(2147483648, 2147516424)], Gs = [[0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61], [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]];
function An(n) {
  let e;
  const t = [];
  for (e = 0; e < 5; e += 1) t[e] = [new f(0, 0), new f(0, 0), new f(0, 0), new f(0, 0), new f(0, 0)];
  return t;
}
function Xs(n) {
  let e;
  const t = [];
  for (e = 0; e < 5; e += 1) t[e] = n[e].slice();
  return t;
}
function Nt(n, e) {
  let t, r, s, i;
  const o = [], a = [];
  if (n !== null) for (r = 0; r < n.length; r += 2) e[(r >>> 1) % 5][(r >>> 1) / 5 | 0] = ut(e[(r >>> 1) % 5][(r >>> 1) / 5 | 0], new f(n[r + 1], n[r]));
  for (t = 0; t < 24; t += 1) {
    for (i = An(), r = 0; r < 5; r += 1) o[r] = (c = e[r][0], l = e[r][1], u = e[r][2], d = e[r][3], h = e[r][4], new f(c.N ^ l.N ^ u.N ^ d.N ^ h.N, c.I ^ l.I ^ u.I ^ d.I ^ h.I));
    for (r = 0; r < 5; r += 1) a[r] = ut(o[(r + 4) % 5], jn(o[(r + 1) % 5], 1));
    for (r = 0; r < 5; r += 1) for (s = 0; s < 5; s += 1) e[r][s] = ut(e[r][s], a[r]);
    for (r = 0; r < 5; r += 1) for (s = 0; s < 5; s += 1) i[s][(2 * r + 3 * s) % 5] = jn(e[r][s], Gs[r][s]);
    for (r = 0; r < 5; r += 1) for (s = 0; s < 5; s += 1) e[r][s] = ut(i[r][s], new f(~i[(r + 1) % 5][s].N & i[(r + 2) % 5][s].N, ~i[(r + 1) % 5][s].I & i[(r + 2) % 5][s].I));
    e[0][0] = ut(e[0][0], Js[t]);
  }
  var c, l, u, d, h;
  return e;
}
function Qr(n) {
  let e, t, r = 0;
  const s = [0, 0], i = [4294967295 & n, n / Tt & 2097151];
  for (e = 6; e >= 0; e--) t = i[e >> 2] >>> 8 * e & 255, t === 0 && r === 0 || (s[r + 1 >> 2] |= t << 8 * (r + 1), r += 1);
  return r = r !== 0 ? r : 1, s[0] |= r, { value: r + 1 > 4 ? s : [s[0]], binLen: 8 + 8 * r };
}
function dn(n) {
  return Qt(Qr(n.binLen), n);
}
function zn(n, e) {
  let t, r = Qr(e);
  r = Qt(r, n);
  const s = e >>> 2, i = (s - r.value.length % s) % s;
  for (t = 0; t < i; t++) r.value.push(0);
  return r.value;
}
let Ys = class extends sn {
  constructor(n, e, t) {
    let r = 6, s = 0;
    super(n, e, t);
    const i = t || {};
    if (this.numRounds !== 1) {
      if (i.kmacKey || i.hmacKey) throw new Error(Pr);
      if (this.o === "CSHAKE128" || this.o === "CSHAKE256") throw new Error("Cannot set numRounds for CSHAKE variants");
    }
    switch (this.T = 1, this.C = at(this.t, this.i, this.T), this.v = Nt, this.L = Xs, this.B = An, this.U = An(), this.K = !1, n) {
      case "SHA3-224":
        this.m = s = 1152, this.R = 224, this.M = !0, this.g = this.Y;
        break;
      case "SHA3-256":
        this.m = s = 1088, this.R = 256, this.M = !0, this.g = this.Y;
        break;
      case "SHA3-384":
        this.m = s = 832, this.R = 384, this.M = !0, this.g = this.Y;
        break;
      case "SHA3-512":
        this.m = s = 576, this.R = 512, this.M = !0, this.g = this.Y;
        break;
      case "SHAKE128":
        r = 31, this.m = s = 1344, this.R = -1, this.K = !0, this.M = !1, this.g = null;
        break;
      case "SHAKE256":
        r = 31, this.m = s = 1088, this.R = -1, this.K = !0, this.M = !1, this.g = null;
        break;
      case "KMAC128":
        r = 4, this.m = s = 1344, this.X(t), this.R = -1, this.K = !0, this.M = !1, this.g = this._;
        break;
      case "KMAC256":
        r = 4, this.m = s = 1088, this.X(t), this.R = -1, this.K = !0, this.M = !1, this.g = this._;
        break;
      case "CSHAKE128":
        this.m = s = 1344, r = this.O(t), this.R = -1, this.K = !0, this.M = !1, this.g = null;
        break;
      case "CSHAKE256":
        this.m = s = 1088, r = this.O(t), this.R = -1, this.K = !0, this.M = !1, this.g = null;
        break;
      default:
        throw new Error(Ct);
    }
    this.F = function(o, a, c, l, u) {
      return function(d, h, m, y, g, w, v) {
        let A, S, p = 0;
        const k = [], b = g >>> 5, I = h >>> 5;
        for (A = 0; A < I && h >= g; A += b) y = Nt(d.slice(A, A + b), y), h -= g;
        for (d = d.slice(A), h %= g; d.length < b; ) d.push(0);
        for (A = h >>> 3, d[A >> 2] ^= w << A % 4 * 8, d[b - 1] ^= 2147483648, y = Nt(d, y); 32 * k.length < v && (S = y[p % 5][p / 5 | 0], k.push(S.I), !(32 * k.length >= v)); ) k.push(S.N), p += 1, 64 * p % g == 0 && (Nt(null, y), p = 0);
        return k;
      }(o, a, 0, l, s, r, u);
    }, i.hmacKey && this.k(qe("hmacKey", i.hmacKey, this.T));
  }
  O(n, e) {
    const t = function(s) {
      const i = s || {};
      return { funcName: qe("funcName", i.funcName, 1, { value: [], binLen: 0 }), customization: qe("Customization", i.customization, 1, { value: [], binLen: 0 }) };
    }(n || {});
    e && (t.funcName = e);
    const r = Qt(dn(t.funcName), dn(t.customization));
    if (t.customization.binLen !== 0 || t.funcName.binLen !== 0) {
      const s = zn(r, this.m >>> 3);
      for (let i = 0; i < s.length; i += this.m >>> 5) this.U = this.v(s.slice(i, i + (this.m >>> 5)), this.U), this.A += this.m;
      return 4;
    }
    return 31;
  }
  X(n) {
    const e = function(r) {
      const s = r || {};
      return { kmacKey: qe("kmacKey", s.kmacKey, 1), funcName: { value: [1128353099], binLen: 32 }, customization: qe("Customization", s.customization, 1, { value: [], binLen: 0 }) };
    }(n || {});
    this.O(n, e.funcName);
    const t = zn(dn(e.kmacKey), this.m >>> 3);
    for (let r = 0; r < t.length; r += this.m >>> 5) this.U = this.v(t.slice(r, r + (this.m >>> 5)), this.U), this.A += this.m;
    this.H = !0;
  }
  _(n) {
    const e = Qt({ value: this.h.slice(), binLen: this.u }, function(t) {
      let r, s, i = 0;
      const o = [0, 0], a = [4294967295 & t, t / Tt & 2097151];
      for (r = 6; r >= 0; r--) s = a[r >> 2] >>> 8 * r & 255, s === 0 && i === 0 || (o[i >> 2] |= s << 8 * i, i += 1);
      return i = i !== 0 ? i : 1, o[i >> 2] |= i << 8 * i, { value: i + 1 > 4 ? o : [o[0]], binLen: 8 + 8 * i };
    }(n.outputLen));
    return this.F(e.value, e.binLen, this.A, this.L(this.U), n.outputLen);
  }
};
class ye {
  constructor(e, t, r) {
    if (e == "SHA-1") this.P = new Bs(e, t, r);
    else if (e == "SHA-224" || e == "SHA-256") this.P = new Ls(e, t, r);
    else if (e == "SHA-384" || e == "SHA-512") this.P = new zs(e, t, r);
    else {
      if (e != "SHA3-224" && e != "SHA3-256" && e != "SHA3-384" && e != "SHA3-512" && e != "SHAKE128" && e != "SHAKE256" && e != "CSHAKE128" && e != "CSHAKE256" && e != "KMAC128" && e != "KMAC256") throw new Error(Ct);
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
function xn(n = null, e = 2048) {
  if (n) {
    const t = new ye("SHAKE256", "TEXT");
    return t.update(n), t.getHash("HEX", { outputLen: e * 2 });
  } else
    return Mn(e);
}
function nt(n, e = null) {
  const t = new ye("SHAKE256", "TEXT");
  return t.update(n), t.getHash("HEX", { outputLen: 256 });
}
function Vt({
  molecularHash: n = null,
  index: e = null
}) {
  return n !== null && e !== null ? nt(String(n) + String(e), "generateBatchId") : Mn(64);
}
class Vr {
  constructor(e = !1, t = "info") {
    this.enabled = e, this.logLevel = t, this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
  }
  /**
   * Check if a log level should be output
   */
  shouldLog(e) {
    if (!this.enabled)
      return !1;
    const t = this.levels[this.logLevel] ?? 1;
    return (this.levels[e] ?? 1) >= t;
  }
  /**
   * Log a debug message
   */
  debug(e, ...t) {
    this.shouldLog("debug") && console.debug(e, ...t);
  }
  /**
   * Log an info message
   */
  info(e, ...t) {
    this.shouldLog("info") && console.info(e, ...t);
  }
  /**
   * Log a warning message
   */
  warn(e, ...t) {
    this.shouldLog("warn") && console.warn(e, ...t);
  }
  /**
   * Log an error message
   */
  error(e, ...t) {
    this.shouldLog("error") && console.error(e, ...t);
  }
  /**
   * Generic log method matching KnishIOClient.log signature
   */
  log(e, t, ...r) {
    switch (e) {
      case "debug":
        this.debug(t, ...r);
        break;
      case "info":
        this.info(t, ...r);
        break;
      case "warn":
        this.warn(t, ...r);
        break;
      case "error":
        this.error(t, ...r);
        break;
      default:
        this.shouldLog("info") && console.log(t, ...r);
    }
  }
  /**
   * Set logging enabled state
   */
  setEnabled(e) {
    this.enabled = e;
  }
  /**
   * Set minimum log level
   */
  setLogLevel(e) {
    e in this.levels && (this.logLevel = e);
  }
  /**
   * Create a scoped logger with a prefix
   */
  scope(e) {
    return {
      debug: (t, ...r) => this.debug(`${e}: ${t}`, ...r),
      info: (t, ...r) => this.info(`${e}: ${t}`, ...r),
      warn: (t, ...r) => this.warn(`${e}: ${t}`, ...r),
      error: (t, ...r) => this.error(`${e}: ${t}`, ...r),
      log: (t, r, ...s) => this.log(t, `${e}: ${r}`, ...s)
    };
  }
}
let zr = new Vr();
function Zs({ enabled: n = !1, level: e = "info" } = {}) {
  zr = new Vr(n, e);
}
function ei(n) {
  return zr.scope(n);
}
let rt = class {
  /**
   * Normalizes the meta array into the standard {key: ..., value: ...} format
   *
   * @param {array|object} meta
   * @return {array}
   */
  static normalizeMeta(e) {
    if (Array.isArray(e))
      return e;
    const t = [];
    for (const r in e)
      Object.prototype.hasOwnProperty.call(e, r) && t.push({ key: r, value: e[r] });
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
function Jr(n, e) {
  let t, r, s;
  const i = [Array, Date, Number, String, Boolean], o = Object.prototype.toString;
  for (e = e || [], t = 0; t < e.length; t += 2)
    n === e[t] && (r = e[t + 1]);
  if (!r && n && typeof n == "object") {
    for (r = {}, t = 0; t < i.length; t++)
      o.call(n) === o.call(s = new i[t](n)) && (r = t ? s : []);
    e.push(n, r);
    for (t in n)
      e.hasOwnProperty.call(n, t) && (r[t] = Jr(n[t], e));
  }
  return r || n;
}
function ti(...n) {
  return [].concat(...n.map((e, t) => {
    const r = n.slice(0);
    r.splice(t, 1);
    const s = [...new Set([].concat(...r))];
    return e.filter((i) => !s.includes(i));
  }));
}
function ct(...n) {
  return n.reduce((e, t) => e.filter((r) => t.includes(r)));
}
class On {
  /**
   *
   * @param policy
   * @param metaKeys
   */
  constructor(e = {}, t = {}) {
    this.policy = On.normalizePolicy(e), this.fillDefault(t);
  }
  /**
   *
   * @param policy
   * @returns {{}}
   */
  static normalizePolicy(e = {}) {
    const t = {};
    for (const [r, s] of Object.entries(e))
      if (s !== null && ["read", "write"].includes(r)) {
        t[r] = {};
        for (const [i, o] of Object.entries(s))
          t[r][i] = o;
      }
    return t;
  }
  /**
   *
   */
  fillDefault(e = {}) {
    const t = Array.from(this.policy).filter((s) => s.action === "read"), r = Array.from(this.policy).filter((s) => s.action === "write");
    for (const [s, i] of Object.entries({
      read: t,
      write: r
    })) {
      const o = i.map((a) => a.key);
      this.policy[s] || (this.policy[s] = {});
      for (const a of ti(e, o))
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
class ae {
  /**
   *
   * @param {object|array} meta
   */
  constructor(e = []) {
    this.meta = rt.normalizeMeta(e);
  }
  /**
   *
   * @param {object|array} meta
   * @returns {AtomMeta}
   */
  merge(e) {
    return this.meta = Array.from(/* @__PURE__ */ new Set([...this.meta, ...rt.normalizeMeta(e)])), this;
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
    const t = new On(e, Object.keys(this.meta));
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
class q extends TypeError {
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
class We extends q {
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
class Fe {
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
          t.push(Fe.isStructure(e[r]) ? Fe.structure(e[r]) : e[r]);
        return t;
      }
      case "[object Object]": {
        const t = [], r = Object.keys(e).sort((s, i) => s === i ? 0 : s < i ? -1 : 1);
        for (const s of r)
          if (Object.prototype.hasOwnProperty.call(e, s)) {
            const i = {};
            i[s] = Fe.isStructure(e[s]) ? Fe.structure(e[s]) : e[s], t.push(i);
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
    return Fe.structure(this);
  }
}
class ni extends Fe {
  constructor({
    position: e = null,
    walletAddress: t = null,
    isotope: r = null,
    token: s = null,
    value: i = null,
    batchId: o = null,
    metaType: a = null,
    metaId: c = null,
    meta: l = null,
    index: u = null,
    createdAt: d = null,
    version: h = null
  }) {
    super(), this.position = e, this.walletAddress = t, this.isotope = r, this.token = s, this.value = i, this.batchId = o, this.metaType = a, this.metaId = c, this.meta = l, this.index = u, this.createdAt = d, this.version = h;
  }
}
const Lt = {
  4: ni
};
class C {
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
    token: s = null,
    value: i = null,
    batchId: o = null,
    metaType: a = null,
    metaId: c = null,
    meta: l = null,
    otsFragment: u = null,
    index: d = null,
    version: h = null
  }) {
    this.position = e, this.walletAddress = t, this.isotope = r, this.token = s, this.value = i !== null ? String(i) : null, this.batchId = o, this.metaType = a, this.metaId = c, this.meta = l ? rt.normalizeMeta(l) : [], this.index = d, this.otsFragment = u, this.createdAt = String(+/* @__PURE__ */ new Date()), h !== null && Object.prototype.hasOwnProperty.call(Lt, h) && (this.version = String(h));
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
    metaType: s = null,
    metaId: i = null,
    meta: o = null,
    batchId: a = null
  }) {
    return o || (o = new ae()), o instanceof ae || (o = new ae(o)), t && (o.setAtomWallet(t), a || (a = t.batchId)), new C({
      position: t ? t.position : null,
      walletAddress: t ? t.address : null,
      isotope: e,
      token: t ? t.token : null,
      value: r,
      batchId: a,
      metaType: s,
      metaId: i,
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
    const t = Object.assign(new C({}), JSON.parse(e)), r = Object.keys(new C({}));
    for (const s in t)
      Object.prototype.hasOwnProperty.call(t, s) && !r.includes(s) && delete t[s];
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
    const r = new ye("SHAKE256", "TEXT"), s = C.sortAtoms(e);
    if (s.length === 0)
      throw new We();
    if (s.map((i) => {
      if (!(i instanceof C))
        throw new We();
      return i;
    }), s.every((i) => i.version && Object.prototype.hasOwnProperty.call(Lt, i.version)))
      r.update(JSON.stringify(s.map((i) => Lt[i.version].create(i).view())));
    else {
      const i = String(e.length);
      let o = [];
      for (const a of s)
        o.push(i), o = o.concat(a.getHashableValues());
      for (const a of o)
        r.update(a);
    }
    switch (t) {
      case "hex":
        return r.getHash("HEX", { outputLen: 256 });
      case "array":
        return r.getHash("ARRAYBUFFER", { outputLen: 256 });
      default:
        return _s(r.getHash("HEX", { outputLen: 256 }), 16, 17, "0123456789abcdef", "0123456789abcdefg").padStart(64, "0");
    }
  }
  static jsonSerialization(e, t) {
    if (!C.getUnclaimedProps().includes(e))
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
    return t.sort((r, s) => r.index < s.index ? -1 : 1), t;
  }
  /**
   * Get aggregated meta from stored normalized ones
   */
  aggregatedMeta() {
    return rt.aggregateMeta(this.meta);
  }
  /**
   *
   * @returns {*[]}
   */
  getHashableValues() {
    const e = [];
    for (const t of C.getHashableProps()) {
      const r = this[t];
      if (!(r === null && !["position", "walletAddress"].includes(t)))
        if (t === "meta")
          for (const s of r)
            typeof s.value < "u" && s.value !== null && (e.push(String(s.key)), e.push(String(s.value)));
        else
          e.push(r === null ? "" : String(r));
    }
    return e;
  }
}
class kt {
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
    return t.length && (t = JSON.parse(t), t || (t = {})), new kt(
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
    return new kt(
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
class ri extends q {
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
const Rt = /* @__PURE__ */ BigInt(2 ** 32 - 1), Jn = /* @__PURE__ */ BigInt(32);
function si(n, e = !1) {
  return e ? { h: Number(n & Rt), l: Number(n >> Jn & Rt) } : { h: Number(n >> Jn & Rt) | 0, l: Number(n & Rt) | 0 };
}
function ii(n, e = !1) {
  const t = n.length;
  let r = new Uint32Array(t), s = new Uint32Array(t);
  for (let i = 0; i < t; i++) {
    const { h: o, l: a } = si(n[i], e);
    [r[i], s[i]] = [o, a];
  }
  return [r, s];
}
const oi = (n, e, t) => n << t | e >>> 32 - t, ai = (n, e, t) => e << t | n >>> 32 - t, li = (n, e, t) => e << t - 32 | n >>> 64 - t, ui = (n, e, t) => n << t - 32 | e >>> 64 - t, Ye = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function ci(n) {
  return n instanceof Uint8Array || ArrayBuffer.isView(n) && n.constructor.name === "Uint8Array";
}
function Gn(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error("positive integer expected, got " + n);
}
function St(n, ...e) {
  if (!ci(n))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(n.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + n.length);
}
function Xn(n, e = !0) {
  if (n.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && n.finished)
    throw new Error("Hash#digest() has already been called");
}
function hi(n, e) {
  St(n);
  const t = e.outputLen;
  if (n.length < t)
    throw new Error("digestInto() expects output buffer of length at least " + t);
}
function Gr(n) {
  return new Uint32Array(n.buffer, n.byteOffset, Math.floor(n.byteLength / 4));
}
function Xr(...n) {
  for (let e = 0; e < n.length; e++)
    n[e].fill(0);
}
const di = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function fi(n) {
  return n << 24 & 4278190080 | n << 8 & 16711680 | n >>> 8 & 65280 | n >>> 24 & 255;
}
function pi(n) {
  for (let e = 0; e < n.length; e++)
    n[e] = fi(n[e]);
  return n;
}
const Yn = di ? (n) => n : pi, yi = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", $e = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Zn(n) {
  if (n >= $e._0 && n <= $e._9)
    return n - $e._0;
  if (n >= $e.A && n <= $e.F)
    return n - ($e.A - 10);
  if (n >= $e.a && n <= $e.f)
    return n - ($e.a - 10);
}
function he(n) {
  if (typeof n != "string")
    throw new Error("hex string expected, got " + typeof n);
  if (yi)
    return Uint8Array.fromHex(n);
  const e = n.length, t = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(t);
  for (let s = 0, i = 0; s < t; s++, i += 2) {
    const o = Zn(n.charCodeAt(i)), a = Zn(n.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = n[i] + n[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
function mi(n) {
  if (typeof n != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(n));
}
function Nn(n) {
  return typeof n == "string" && (n = mi(n)), St(n), n;
}
class gi {
}
function wi(n) {
  const e = (r) => n().update(Nn(r)).digest(), t = n();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => n(), e;
}
function bi(n) {
  const e = (r, s) => n(s).update(Nn(r)).digest(), t = n({});
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = (r) => n(r), e;
}
function vi(n = 32) {
  if (Ye && typeof Ye.getRandomValues == "function")
    return Ye.getRandomValues(new Uint8Array(n));
  if (Ye && typeof Ye.randomBytes == "function")
    return Uint8Array.from(Ye.randomBytes(n));
  throw new Error("crypto.getRandomValues must be defined");
}
const ki = BigInt(0), ht = BigInt(1), Si = BigInt(2), Ai = BigInt(7), xi = BigInt(256), _i = BigInt(113), Yr = [], Zr = [], es = [];
for (let n = 0, e = ht, t = 1, r = 0; n < 24; n++) {
  [t, r] = [r, (2 * t + 3 * r) % 5], Yr.push(2 * (5 * r + t)), Zr.push((n + 1) * (n + 2) / 2 % 64);
  let s = ki;
  for (let i = 0; i < 7; i++)
    e = (e << ht ^ (e >> Ai) * _i) % xi, e & Si && (s ^= ht << (ht << /* @__PURE__ */ BigInt(i)) - ht);
  es.push(s);
}
const ts = ii(es, !0), $i = ts[0], Ii = ts[1], er = (n, e, t) => t > 32 ? li(n, e, t) : oi(n, e, t), tr = (n, e, t) => t > 32 ? ui(n, e, t) : ai(n, e, t);
function Ei(n, e = 24) {
  const t = new Uint32Array(10);
  for (let r = 24 - e; r < 24; r++) {
    for (let o = 0; o < 10; o++)
      t[o] = n[o] ^ n[o + 10] ^ n[o + 20] ^ n[o + 30] ^ n[o + 40];
    for (let o = 0; o < 10; o += 2) {
      const a = (o + 8) % 10, c = (o + 2) % 10, l = t[c], u = t[c + 1], d = er(l, u, 1) ^ t[a], h = tr(l, u, 1) ^ t[a + 1];
      for (let m = 0; m < 50; m += 10)
        n[o + m] ^= d, n[o + m + 1] ^= h;
    }
    let s = n[2], i = n[3];
    for (let o = 0; o < 24; o++) {
      const a = Zr[o], c = er(s, i, a), l = tr(s, i, a), u = Yr[o];
      s = n[u], i = n[u + 1], n[u] = c, n[u + 1] = l;
    }
    for (let o = 0; o < 50; o += 10) {
      for (let a = 0; a < 10; a++)
        t[a] = n[o + a];
      for (let a = 0; a < 10; a++)
        n[o + a] ^= ~t[(a + 2) % 10] & t[(a + 4) % 10];
    }
    n[0] ^= $i[r], n[1] ^= Ii[r];
  }
  Xr(t);
}
class on extends gi {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(e, t, r, s = !1, i = 24) {
    if (super(), this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, this.enableXOF = !1, this.blockLen = e, this.suffix = t, this.outputLen = r, this.enableXOF = s, this.rounds = i, Gn(r), !(0 < e && e < 200))
      throw new Error("only keccak-f1600 function is supported");
    this.state = new Uint8Array(200), this.state32 = Gr(this.state);
  }
  clone() {
    return this._cloneInto();
  }
  keccak() {
    Yn(this.state32), Ei(this.state32, this.rounds), Yn(this.state32), this.posOut = 0, this.pos = 0;
  }
  update(e) {
    Xn(this), e = Nn(e), St(e);
    const { blockLen: t, state: r } = this, s = e.length;
    for (let i = 0; i < s; ) {
      const o = Math.min(t - this.pos, s - i);
      for (let a = 0; a < o; a++)
        r[this.pos++] ^= e[i++];
      this.pos === t && this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = !0;
    const { state: e, suffix: t, pos: r, blockLen: s } = this;
    e[r] ^= t, (t & 128) !== 0 && r === s - 1 && this.keccak(), e[s - 1] ^= 128, this.keccak();
  }
  writeInto(e) {
    Xn(this, !1), St(e), this.finish();
    const t = this.state, { blockLen: r } = this;
    for (let s = 0, i = e.length; s < i; ) {
      this.posOut >= r && this.keccak();
      const o = Math.min(r - this.posOut, i - s);
      e.set(t.subarray(this.posOut, this.posOut + o), s), this.posOut += o, s += o;
    }
    return e;
  }
  xofInto(e) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible for this instance");
    return this.writeInto(e);
  }
  xof(e) {
    return Gn(e), this.xofInto(new Uint8Array(e));
  }
  digestInto(e) {
    if (hi(e, this), this.finished)
      throw new Error("digest() was already called");
    return this.writeInto(e), this.destroy(), e;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = !0, Xr(this.state);
  }
  _cloneInto(e) {
    const { blockLen: t, suffix: r, outputLen: s, rounds: i, enableXOF: o } = this;
    return e || (e = new on(t, r, s, o, i)), e.state32.set(this.state32), e.pos = this.pos, e.posOut = this.posOut, e.finished = this.finished, e.rounds = i, e.suffix = r, e.outputLen = s, e.enableXOF = o, e.destroyed = this.destroyed, e;
  }
}
const ns = (n, e, t) => wi(() => new on(e, n, t)), Ti = ns(6, 136, 256 / 8), Ci = ns(6, 72, 512 / 8), rs = (n, e, t) => bi((r = {}) => new on(e, n, r.dkLen === void 0 ? t : r.dkLen, !0)), Mi = rs(31, 168, 128 / 8), ss = rs(31, 136, 256 / 8);
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
const Oe = St, nr = vi;
function rr(n, e) {
  if (n.length !== e.length)
    return !1;
  let t = 0;
  for (let r = 0; r < n.length; r++)
    t |= n[r] ^ e[r];
  return t === 0;
}
function Pt(...n) {
  const e = (r) => typeof r == "number" ? r : r.bytesLen, t = n.reduce((r, s) => r + e(s), 0);
  return {
    bytesLen: t,
    encode: (r) => {
      const s = new Uint8Array(t);
      for (let i = 0, o = 0; i < n.length; i++) {
        const a = n[i], c = e(a), l = typeof a == "number" ? r[i] : a.encode(r[i]);
        Oe(l, c), s.set(l, o), typeof a != "number" && l.fill(0), o += c;
      }
      return s;
    },
    decode: (r) => {
      Oe(r, t);
      const s = [];
      for (const i of n) {
        const o = e(i), a = r.subarray(0, o);
        s.push(typeof i == "number" ? a : i.decode(a)), r = r.subarray(o);
      }
      return s;
    }
  };
}
function fn(n, e) {
  const t = e * n.bytesLen;
  return {
    bytesLen: t,
    encode: (r) => {
      if (r.length !== e)
        throw new Error(`vecCoder.encode: wrong length=${r.length}. Expected: ${e}`);
      const s = new Uint8Array(t);
      for (let i = 0, o = 0; i < r.length; i++) {
        const a = n.encode(r[i]);
        s.set(a, o), a.fill(0), o += a.length;
      }
      return s;
    },
    decode: (r) => {
      Oe(r, t);
      const s = [];
      for (let i = 0; i < r.length; i += n.bytesLen)
        s.push(n.decode(r.subarray(i, i + n.bytesLen)));
      return s;
    }
  };
}
function De(...n) {
  for (const e of n)
    if (Array.isArray(e))
      for (const t of e)
        t.fill(0);
    else
      e.fill(0);
}
function sr(n) {
  return (1 << n) - 1;
}
he("0609608648016503040201"), he("0609608648016503040202"), he("0609608648016503040203"), he("0609608648016503040204"), he("0609608648016503040205"), he("0609608648016503040206"), he("0609608648016503040207"), he("0609608648016503040208"), he("0609608648016503040209"), he("060960864801650304020A"), he("060960864801650304020B"), he("060960864801650304020C");
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
function Oi(n, e = 8) {
  const s = n.toString(2).padStart(8, "0").slice(-e).padStart(7, "0").split("").reverse().join("");
  return Number.parseInt(s, 2);
}
const Ni = (n) => {
  const { newPoly: e, N: t, Q: r, F: s, ROOT_OF_UNITY: i, brvBits: o } = n, a = (g, w = r) => {
    const v = g % w | 0;
    return (v >= 0 ? v | 0 : w + v | 0) | 0;
  }, c = (g, w = r) => {
    const v = a(g, w) | 0;
    return (v > w >> 1 ? v - w | 0 : v) | 0;
  };
  function l() {
    const g = e(t);
    for (let w = 0; w < t; w++) {
      const v = Oi(w, o), A = BigInt(i) ** BigInt(v) % BigInt(r);
      g[w] = Number(A) | 0;
    }
    return g;
  }
  const u = l(), d = 128, h = 1;
  return { mod: a, smod: c, nttZetas: u, NTT: {
    encode: (g) => {
      for (let w = 1, v = 128; v > h; v >>= 1)
        for (let A = 0; A < t; A += 2 * v) {
          const S = u[w++];
          for (let p = A; p < A + v; p++) {
            const k = a(S * g[p + v]);
            g[p + v] = a(g[p] - k) | 0, g[p] = a(g[p] + k) | 0;
          }
        }
      return g;
    },
    decode: (g) => {
      for (let w = d - 1, v = 1 + h; v < d + h; v <<= 1)
        for (let A = 0; A < t; A += 2 * v) {
          const S = u[w--];
          for (let p = A; p < A + v; p++) {
            const k = g[p];
            g[p] = a(k + g[p + v]), g[p + v] = a(S * (g[p + v] - k));
          }
        }
      for (let w = 0; w < g.length; w++)
        g[w] = a(s * g[w]);
      return g;
    }
  }, bitsCoder: (g, w) => {
    const v = sr(g), A = g * (t / 8);
    return {
      bytesLen: A,
      encode: (S) => {
        const p = new Uint8Array(A);
        for (let k = 0, b = 0, I = 0, H = 0; k < S.length; k++)
          for (b |= (w.encode(S[k]) & v) << I, I += g; I >= 8; I -= 8, b >>= 8)
            p[H++] = b & sr(I);
        return p;
      },
      decode: (S) => {
        const p = e(t);
        for (let k = 0, b = 0, I = 0, H = 0; k < S.length; k++)
          for (b |= S[k] << I, I += 8; I >= g; I -= g, b >>= g)
            p[H++] = w.decode(b & v);
        return p;
      }
    };
  } };
}, Ri = (n) => (e, t) => {
  t || (t = n.blockLen);
  const r = new Uint8Array(e.length + 2);
  r.set(e);
  const s = e.length, i = new Uint8Array(t);
  let o = n.create({}), a = 0, c = 0;
  return {
    stats: () => ({ calls: a, xofs: c }),
    get: (l, u) => (r[s + 0] = l, r[s + 1] = u, o.destroy(), o = n.create({}).update(r), a++, () => (c++, o.xofInto(i))),
    clean: () => {
      o.destroy(), i.fill(0), r.fill(0);
    }
  };
}, Ui = /* @__PURE__ */ Ri(Mi);
/*! noble-post-quantum - MIT License (c) 2024 Paul Miller (paulmillr.com) */
const ie = 256, je = 3329, qi = 3303, Hi = 17, { mod: At, nttZetas: Bi, NTT: Be, bitsCoder: Li } = Ni({
  N: ie,
  Q: je,
  F: qi,
  ROOT_OF_UNITY: Hi,
  newPoly: (n) => new Uint16Array(n),
  brvBits: 7
}), Pi = {
  768: { N: ie, Q: je, K: 3, ETA1: 2, ETA2: 2, du: 10, dv: 4, RBGstrength: 192 }
}, Ki = (n) => {
  if (n >= 12)
    return { encode: (t) => t, decode: (t) => t };
  const e = 2 ** (n - 1);
  return {
    // const compress = (i: number) => round((2 ** d / Q) * i) % 2 ** d;
    encode: (t) => ((t << n) + je / 2) / je,
    // const decompress = (i: number) => round((Q / 2 ** d) * i);
    decode: (t) => t * je + e >>> n
  };
}, dt = (n) => Li(n, Ki(n));
function Le(n, e) {
  for (let t = 0; t < ie; t++)
    n[t] = At(n[t] + e[t]);
}
function Fi(n, e) {
  for (let t = 0; t < ie; t++)
    n[t] = At(n[t] - e[t]);
}
function Di(n, e, t, r, s) {
  const i = At(e * r * s + n * t), o = At(n * r + e * t);
  return { c0: i, c1: o };
}
function Ut(n, e) {
  for (let t = 0; t < ie / 2; t++) {
    let r = Bi[64 + (t >> 1)];
    t & 1 && (r = -r);
    const { c0: s, c1: i } = Di(n[2 * t + 0], n[2 * t + 1], e[2 * t + 0], e[2 * t + 1], r);
    n[2 * t + 0] = s, n[2 * t + 1] = i;
  }
  return n;
}
function ir(n) {
  const e = new Uint16Array(ie);
  for (let t = 0; t < ie; ) {
    const r = n();
    if (r.length % 3)
      throw new Error("SampleNTT: unaligned block");
    for (let s = 0; t < ie && s + 3 <= r.length; s += 3) {
      const i = (r[s + 0] >> 0 | r[s + 1] << 8) & 4095, o = (r[s + 1] >> 4 | r[s + 2] << 4) & 4095;
      i < je && (e[t++] = i), t < ie && o < je && (e[t++] = o);
    }
  }
  return e;
}
function ft(n, e, t, r) {
  const s = n(r * ie / 4, e, t), i = new Uint16Array(ie), o = Gr(s);
  let a = 0;
  for (let c = 0, l = 0, u = 0, d = 0; c < o.length; c++) {
    let h = o[c];
    for (let m = 0; m < 32; m++)
      u += h & 1, h >>= 1, a += 1, a === r ? (d = u, u = 0) : a === 2 * r && (i[l++] = At(d - u), u = 0, a = 0);
  }
  if (a)
    throw new Error(`sampleCBD: leftover bits: ${a}`);
  return i;
}
const Wi = (n) => {
  const { K: e, PRF: t, XOF: r, HASH512: s, ETA1: i, ETA2: o, du: a, dv: c } = n, l = dt(1), u = dt(c), d = dt(a), h = Pt(fn(dt(12), e), 32), m = fn(dt(12), e), y = Pt(fn(d, e), u), g = Pt(32, 32);
  return {
    secretCoder: m,
    secretKeyLen: m.bytesLen,
    publicKeyLen: h.bytesLen,
    cipherTextLen: y.bytesLen,
    keygen: (w) => {
      Oe(w, 32);
      const v = new Uint8Array(33);
      v.set(w), v[32] = e;
      const A = s(v), [S, p] = g.decode(A), k = [], b = [];
      for (let P = 0; P < e; P++)
        k.push(Be.encode(ft(t, p, P, i)));
      const I = r(S);
      for (let P = 0; P < e; P++) {
        const ce = Be.encode(ft(t, p, e + P, i));
        for (let L = 0; L < e; L++) {
          const _e = ir(I.get(L, P));
          Le(ce, Ut(_e, k[L]));
        }
        b.push(ce);
      }
      I.clean();
      const H = {
        publicKey: h.encode([b, S]),
        secretKey: m.encode(k)
      };
      return De(S, p, k, b, v, A), H;
    },
    encrypt: (w, v, A) => {
      const [S, p] = h.decode(w), k = [];
      for (let L = 0; L < e; L++)
        k.push(Be.encode(ft(t, A, L, i)));
      const b = r(p), I = new Uint16Array(ie), H = [];
      for (let L = 0; L < e; L++) {
        const _e = ft(t, A, e + L, o), Ve = new Uint16Array(ie);
        for (let T = 0; T < e; T++) {
          const B = ir(b.get(L, T));
          Le(Ve, Ut(B, k[T]));
        }
        Le(_e, Be.decode(Ve)), H.push(_e), Le(I, Ut(S[L], k[L])), Ve.fill(0);
      }
      b.clean();
      const P = ft(t, A, 2 * e, o);
      Le(P, Be.decode(I));
      const ce = l.decode(v);
      return Le(ce, P), De(S, k, I, P), y.encode([H, ce]);
    },
    decrypt: (w, v) => {
      const [A, S] = y.decode(w), p = m.decode(v), k = new Uint16Array(ie);
      for (let b = 0; b < e; b++)
        Le(k, Ut(p[b], Be.encode(A[b])));
      return Fi(S, Be.decode(k)), De(k, p, A), l.encode(S);
    }
  };
};
function ji(n) {
  const e = Wi(n), { HASH256: t, HASH512: r, KDF: s } = n, { secretCoder: i, cipherTextLen: o } = e, a = e.publicKeyLen, c = Pt(e.secretKeyLen, e.publicKeyLen, 32, 32), l = c.bytesLen, u = 32;
  return {
    publicKeyLen: a,
    msgLen: u,
    keygen: (d = nr(64)) => {
      Oe(d, 64);
      const { publicKey: h, secretKey: m } = e.keygen(d.subarray(0, 32)), y = t(h), g = c.encode([m, h, y, d.subarray(32)]);
      return De(m, y), { publicKey: h, secretKey: g };
    },
    encapsulate: (d, h = nr(32)) => {
      Oe(d, a), Oe(h, u);
      const m = d.subarray(0, 384 * n.K), y = i.encode(i.decode(m.slice()));
      if (!rr(y, m))
        throw De(y), new Error("ML-KEM.encapsulate: wrong publicKey modulus");
      De(y);
      const g = r.create().update(h).update(t(d)).digest(), w = e.encrypt(d, h, g.subarray(32, 64));
      return g.subarray(32).fill(0), { cipherText: w, sharedSecret: g.subarray(0, 32) };
    },
    decapsulate: (d, h) => {
      Oe(h, l), Oe(d, o);
      const [m, y, g, w] = c.decode(h), v = e.decrypt(d, m), A = r.create().update(v).update(g).digest(), S = A.subarray(0, 32), p = e.encrypt(y, v, A.subarray(32, 64)), k = rr(d, p), b = s.create({ dkLen: 32 }).update(w).update(d).digest();
      return De(v, p, k ? b : S), k ? S : b;
    }
  };
}
function Qi(n, e, t) {
  return ss.create({ dkLen: n }).update(e).update(new Uint8Array([t])).digest();
}
const Vi = {
  HASH256: Ti,
  HASH512: Ci,
  KDF: ss,
  XOF: Ui,
  PRF: Qi
}, pn = /* @__PURE__ */ ji({
  ...Vi,
  ...Pi[768]
});
class R {
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
    address: s = null,
    position: i = null,
    batchId: o = null,
    characters: a = null
  }) {
    this.token = r, this.balance = 0, this.molecules = {}, this.logger = ei("Wallet"), this.key = null, this.privkey = null, this.pubkey = null, this.tokenUnits = [], this.tradeRates = {}, this.address = s, this.position = i, this.bundle = t, this.batchId = o, this.characters = a, e && (this.bundle = this.bundle || nt(e, "Wallet::constructor"), this.position = this.position || R.generatePosition(), this.key = R.generateKey({
      secret: e,
      token: this.token,
      position: this.position
    }), this.address = this.address || R.generateAddress(this.key), this.characters = this.characters || "BASE64", this.initializeMLKEM());
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
    batchId: s = null,
    characters: i = null
  }) {
    let o = null;
    if (!e && !t)
      throw new ri();
    return e && !t && (o = R.generatePosition(), t = nt(e, "Wallet::create")), new R({
      secret: e,
      bundle: t,
      token: r,
      position: o,
      batchId: s,
      characters: i
    });
  }
  /**
   * Determines if the provided string is a bundle hash
   *
   * @param {string} maybeBundleHash
   * @return {boolean}
   */
  static isBundleHash(e) {
    return typeof e != "string" ? !1 : e.length === 64 && Cs(e);
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
      t.push(kt.createFromDB(r));
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
    const i = BigInt(`0x${e}`) + BigInt(`0x${r}`), o = new ye("SHAKE256", "TEXT");
    o.update(i.toString(16)), t && o.update(t);
    const a = new ye("SHAKE256", "TEXT");
    return a.update(o.getHash("HEX", { outputLen: 8192 })), a.getHash("HEX", { outputLen: 8192 });
  }
  /**
   * Generates a wallet address
   *
   * @param {string} key
   * @return {string}
   */
  static generateAddress(e) {
    const t = jt(e, 128), r = new ye("SHAKE256", "TEXT");
    for (const i in t) {
      let o = t[i];
      for (let a = 1; a <= 16; a++) {
        const c = new ye("SHAKE256", "TEXT");
        c.update(o), o = c.getHash("HEX", { outputLen: 512 });
      }
      r.update(o);
    }
    const s = new ye("SHAKE256", "TEXT");
    return s.update(r.getHash("HEX", { outputLen: 8192 })), s.getHash("HEX", { outputLen: 256 });
  }
  /**
   *
   * @param saltLength
   * @returns {string}
   */
  static generatePosition(e = 64) {
    return Mn(e, "abcdef0123456789");
  }
  /**
   * Initializes the ML-KEM key pair
   */
  initializeMLKEM() {
    const e = xn(this.key, 64), t = new Uint8Array(64);
    for (let i = 0; i < 64; i++)
      t[i] = parseInt(e.substr(i * 2, 2), 16);
    const { publicKey: r, secretKey: s } = pn.keygen(t);
    this.pubkey = this.serializeKey(r), this.privkey = s;
  }
  serializeKey(e) {
    return btoa(String.fromCharCode.apply(null, e));
  }
  deserializeKey(e) {
    const t = atob(e);
    return new Uint8Array(t.length).map((r, s) => t.charCodeAt(s));
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
    const s = [], i = [];
    this.tokenUnits.forEach((o) => {
      e.includes(o.id) ? s.push(o) : i.push(o);
    }), this.tokenUnits = s, r !== null && (r.tokenUnits = s), t.tokenUnits = i;
  }
  /**
   * Create a remainder wallet from the source one
   *
   * @param secret
   */
  createRemainder(e) {
    const t = R.create({
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
    e.batchId && (this.batchId = t ? e.batchId : Vt({}));
  }
  async encryptMessage(e, t) {
    const r = JSON.stringify(e), s = new TextEncoder().encode(r), i = this.deserializeKey(t), { cipherText: o, sharedSecret: a } = pn.encapsulate(i), c = await this.encryptWithSharedSecret(s, a);
    return {
      cipherText: this.serializeKey(o),
      encryptedMessage: this.serializeKey(c)
    };
  }
  async decryptMessage(e) {
    const { cipherText: t, encryptedMessage: r } = e;
    let s;
    try {
      s = pn.decapsulate(this.deserializeKey(t), this.privkey);
    } catch (c) {
      return this.logger.error("decryptMessage() - Decapsulation failed", c.message), this.logger.debug("decryptMessage() - Debug info available in development mode"), null;
    }
    let i;
    try {
      i = this.deserializeKey(r);
    } catch (c) {
      return this.logger.warn("decryptMessage() - Deserialization failed", c.message), this.logger.debug("decryptMessage() - Debug info available in development mode"), null;
    }
    let o;
    try {
      o = await this.decryptWithSharedSecret(i, s);
    } catch (c) {
      return this.logger.warn("decryptMessage() - Decryption failed", c.message), this.logger.debug("decryptMessage() - Debug info available in development mode"), null;
    }
    let a;
    try {
      a = new TextDecoder().decode(o);
    } catch (c) {
      return this.logger.warn("decryptMessage() - Decoding failed", c.message), this.logger.debug("decryptMessage() - Debug info available in development mode"), null;
    }
    return JSON.parse(a);
  }
  async encryptWithSharedSecret(e, t) {
    const r = crypto.getRandomValues(new Uint8Array(12)), s = { name: "AES-GCM", iv: r }, i = await crypto.subtle.importKey(
      "raw",
      t,
      { name: "AES-GCM" },
      !1,
      ["encrypt"]
    ), o = await crypto.subtle.encrypt(
      s,
      i,
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
    const s = { name: "AES-GCM", iv: e.slice(0, 12) }, i = await crypto.subtle.importKey(
      "raw",
      t,
      { name: "AES-GCM" },
      !1,
      ["decrypt"]
    ), o = await crypto.subtle.decrypt(
      s,
      i,
      e.slice(12)
    );
    return new Uint8Array(o);
  }
}
class pt extends q {
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
class zi extends q {
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
class Ji extends q {
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
class or extends q {
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
class is extends q {
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
class Gi extends q {
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
class Ce extends q {
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
class ar extends q {
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
class lr extends q {
  /**
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Token slugs for wallets in transfer do not match!", t = null, r = null) {
    super(e, t, r), this.name = "TransferMismatchedException";
  }
}
class ur extends q {
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
class Xi extends q {
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
class Yi extends q {
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
class Ue extends q {
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
class yt extends q {
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
class Kt extends q {
  /**
   * @param {string|null} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Incorrect BatchId", t = null, r = null) {
    super(e, t, r), this.name = "BatchIdException";
  }
}
class cr {
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
class zt extends q {
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
class Ne extends q {
  /**
   * @param {string|null} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor(e = "Code exception", t = null, r = null) {
    super(e, t, r), this.name = "CodeException";
  }
}
class bt {
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
    meta: s = null,
    address: i = null,
    token: o = null,
    amount: a = null,
    comparison: c = null
  }) {
    if (s && (this.meta = s), !e)
      throw new zt('Callback structure violated, missing mandatory "action" parameter.');
    this.__metaId = r, this.__metaType = t, this.__action = e, this.__address = i, this.__token = o, this.__amount = a, this.__comparison = c;
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
    if (!Ms(e))
      throw new Ne("Parameter amount should be a string containing numbers");
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
    this.__meta = e instanceof cr ? e : cr.toObject(e);
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
    const t = new bt({
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
    return ct(Object.keys(this.toJSON()), ["action", "metaId", "metaType", "meta"]).length === 4 && this._is("meta");
  }
  /**
   * @return {boolean}
   */
  isCollect() {
    return ct(Object.keys(this.toJSON()), ["action", "address", "token", "amount", "comparison"]).length === 5 && this._is("collect");
  }
  /**
   * @return {boolean}
   */
  isBuffer() {
    return ct(Object.keys(this.toJSON()), ["action", "address", "token", "amount", "comparison"]).length === 5 && this._is("buffer");
  }
  /**
   * @return {boolean}
   */
  isRemit() {
    return ct(Object.keys(this.toJSON()), ["action", "token", "amount"]).length === 3 && this._is("remit");
  }
  /**
   * @return {boolean}
   */
  isBurn() {
    return ct(Object.keys(this.toJSON()), ["action", "token", "amount", "comparison"]).length === 4 && this._is("burn");
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
class yn {
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
    if ([e, t, r].some((s) => !s))
      throw new zt("Condition::constructor( { key, value, comparison } ) - not all class parameters are initialised!");
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
class xt {
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
      if (!(r instanceof yn))
        throw new zt();
    for (const r of t)
      if (!(r instanceof bt))
        throw new zt();
    this.__condition = e, this.__callback = t;
  }
  /**
   *
   * @param {Condition[]|{}} condition
   */
  set comparison(e) {
    this.__condition.push(e instanceof yn ? e : yn.toObject(e));
  }
  /**
   * @param {Callback[]|{}} callback
   */
  set callback(e) {
    this.__callback.push(e instanceof bt ? e : bt.toObject(e));
  }
  /**
   *
   * @param {object} object
   *
   * @return {Rule}
   */
  static toObject(e) {
    if (!e.condition)
      throw new Ue("Rule::toObject() - Incorrect rule format! There is no condition field.");
    if (!e.callback)
      throw new Ue("Rule::toObject() - Incorrect rule format! There is no callback field.");
    const t = new xt({});
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
class Zi {
  /**
   *
   * @param molecule
   */
  constructor(e) {
    if (e.molecularHash === null)
      throw new Ji();
    if (!e.atoms.length)
      throw new We();
    for (const t of e.atoms)
      if (t.index === null)
        throw new pt();
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
      throw new We("Check::continuId() - Molecule is missing required ContinuID Atom!");
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
          throw new Kt();
        for (const s of t)
          if (s.batchId === null)
            throw new Kt();
      }
      return !0;
    }
    throw new Kt();
  }
  /**
   *
   * @returns {boolean}
   */
  isotopeI() {
    for (const e of this.molecule.getIsotopes("I")) {
      if (e.token !== "USER")
        throw new yt(`Check::isotopeI() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index === 0)
        throw new pt(`Check::isotopeI() - Isotope "${e.isotope}" Atoms must have a non-zero index!`);
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
        throw new yt(`Check::isotopeU() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new pt(`Check::isotopeU() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
        throw new Ue();
      if (t.token !== "USER")
        throw new yt(`Check::isotopeM() - "${t.token}" is not a valid Token slug for "${t.isotope}" isotope Atoms!`);
      const r = rt.aggregateMeta(t.meta);
      for (const s of e) {
        let i = r[s];
        if (i) {
          i = JSON.parse(i);
          for (const [o, a] of Object.entries(i))
            if (!e.includes(o)) {
              if (!Object.keys(r).includes(o))
                throw new or(`${o} is missing from the meta.`);
              for (const c of a)
                if (!R.isBundleHash(c) && !["all", "self"].includes(c))
                  throw new or(`${c} does not correspond to the format of the policy.`);
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
        throw new yt(`Check::isotopeC() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new pt(`Check::isotopeC() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
            throw new Ue(`Check::isotopeT() - Required meta field "${s}" is missing!`);
      }
      for (const s of ["token"])
        if (!Object.prototype.hasOwnProperty.call(t, s) || !t[s])
          throw new Ue(`Check::isotopeT() - Required meta field "${s}" is missing!`);
      if (e.token !== "USER")
        throw new yt(`Check::isotopeT() - "${e.token}" is not a valid Token slug for "${e.isotope}" isotope Atoms!`);
      if (e.index !== 0)
        throw new pt(`Check::isotopeT() - Isotope "${e.isotope}" Atoms must have an index equal to 0!`);
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
        if (!Object.keys(r).every((s) => ["read", "write"].includes(s)))
          throw new Ue("Check::isotopeR() - Mixing rules with politics!");
      }
      if (t.rule) {
        const r = JSON.parse(t.rule);
        if (!Array.isArray(r))
          throw new Ue("Check::isotopeR() - Incorrect rule format!");
        for (const s of r)
          xt.toObject(s);
        if (r.length < 1)
          throw new Ue("Check::isotopeR() - No rules!");
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
        throw new lr();
      if (o.value < 0)
        throw new ar();
      return !0;
    }
    let s = 0, i = 0;
    for (const o in this.molecule.atoms)
      if (Object.prototype.hasOwnProperty.call(this.molecule.atoms, o)) {
        const a = this.molecule.atoms[o];
        if (a.isotope !== "V")
          continue;
        if (i = a.value * 1, Number.isNaN(i))
          throw new TypeError('Invalid isotope "V" values');
        if (a.token !== r.token)
          throw new lr();
        if (o > 0) {
          if (i < 0)
            throw new ar();
          if (a.walletAddress === r.walletAddress)
            throw new Xi();
        }
        s += i;
      }
    if (s !== i)
      throw new Yi();
    if (e) {
      if (i = r.value * 1, Number.isNaN(i))
        throw new TypeError('Invalid isotope "V" values');
      const o = e.balance + i;
      if (o < 0)
        throw new Ce();
      if (o !== s)
        throw new ur();
    } else if (i !== 0)
      throw new ur();
    return !0;
  }
  /**
   * Verifies if the hash of all the atoms matches the molecular hash to ensure content has not been messed with
   *
   * @returns {boolean}
   */
  molecularHash() {
    if (this.molecule.molecularHash !== C.hashAtoms({
      atoms: this.molecule.atoms
    }))
      throw new zi();
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
      (h) => h.otsFragment
    ).reduce(
      (h, m) => h + m
    );
    if (t.length !== 2048 && (t = Ts(t), t.length !== 2048))
      throw new is();
    const r = jt(t, 128);
    let s = "";
    for (const h in r) {
      let m = r[h];
      for (let y = 0, g = 8 + e[h]; y < g; y++)
        m = new ye("SHAKE256", "TEXT").update(m).getHash("HEX", { outputLen: 512 });
      s += m;
    }
    const i = new ye("SHAKE256", "TEXT");
    i.update(s);
    const o = i.getHash("HEX", { outputLen: 8192 }), a = new ye("SHAKE256", "TEXT");
    a.update(o);
    const c = a.getHash("HEX", { outputLen: 256 }), l = this.molecule.atoms[0];
    let u = l.walletAddress;
    const d = F.get(l.aggregatedMeta(), "signingWallet");
    if (d && (u = F.get(JSON.parse(d), "address")), c !== u)
      throw new Gi();
    return !0;
  }
}
class mt extends q {
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
class hr extends q {
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
class Me {
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
    remainderWallet: s = null,
    cellSlug: i = null,
    version: o = null
  }) {
    this.status = null, this.molecularHash = null, this.createdAt = String(+/* @__PURE__ */ new Date()), this.cellSlugOrigin = this.cellSlug = i, this.secret = e, this.bundle = t, this.sourceWallet = r, this.atoms = [], o !== null && Object.prototype.hasOwnProperty.call(Lt, o) && (this.version = String(o)), (s || r) && (this.remainderWallet = s || R.create({
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
    const t = Object.assign(new Me({}), JSON.parse(e)), r = Object.keys(new Me({}));
    if (!Array.isArray(t.atoms))
      throw new We();
    for (const s in Object.keys(t.atoms)) {
      t.atoms[s] = C.jsonToObject(JSON.stringify(t.atoms[s]));
      for (const i of ["position", "walletAddress", "isotope"])
        if (t.atoms[s].isotope.toLowerCase() !== "r" && (typeof t.atoms[s][i] > "u" || t.atoms[s][i] === null))
          throw new We("MolecularStructure::jsonToObject() - Required Atom properties are missing!");
    }
    for (const s in t)
      Object.prototype.hasOwnProperty.call(t, s) && !r.includes(s) && delete t[s];
    return t.atoms = C.sortAtoms(t.atoms), t;
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
    }, r = [], s = e.toLowerCase().split("");
    for (let i = 0, o = s.length; i < o; ++i) {
      const a = s[i];
      typeof t[a] < "u" && (r[i] = t[a]);
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
    let t = e.reduce((s, i) => s + i);
    const r = t < 0;
    for (; t < 0 || t > 0; )
      for (const s of Object.keys(e))
        if ((r ? e[s] < 8 : e[s] > -8) && (r ? (++e[s], ++t) : (--e[s], --t), t === 0))
          break;
    return e;
  }
  /**
   *
   * @param isotopes
   * @returns {*[]}
   */
  getIsotopes(e) {
    return Me.isotopeFilter(e, this.atoms);
  }
  /**
   * Generates the next atomic index
   *
   * @return {number}
   */
  generateIndex() {
    return Me.generateNextAtomIndex(this.atoms);
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
    return this.molecularHash = null, e.index = this.generateIndex(), e.version = this.version, this.atoms.push(e), this.atoms = C.sortAtoms(this.atoms), this;
  }
  /**
   * Add user remainder atom for ContinuID
   *
   * @return {Molecule}
   */
  addContinuIdAtom() {
    return this.addAtom(C.create({
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
    policy: s = {}
  }) {
    const i = new ae(r);
    i.addPolicy(s);
    const o = R.create({
      secret: this.secret,
      bundle: this.sourceWallet.bundle,
      token: "USER"
    });
    return this.addAtom(C.create({
      wallet: o,
      isotope: "R",
      metaType: e,
      metaId: t,
      meta: i
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
      throw new mt();
    return this.addAtom(C.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -r
    })), this.addAtom(C.create({
      isotope: "F",
      wallet: t,
      value: 1,
      metaType: "walletBundle",
      metaId: t.bundle
    })), this.addAtom(C.create({
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
      throw new hr("Molecule::burnToken() - Amount to burn must be positive!");
    if (this.sourceWallet.balance - e < 0)
      throw new mt();
    return this.addAtom(C.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -e
    })), this.addAtom(C.create({
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
      throw new hr("Molecule::replenishToken() - Amount to replenish must be positive!");
    if (t.length) {
      t = R.getTokenUnits(t), this.remainderWallet.tokenUnits = this.sourceWallet.tokenUnits;
      for (const r of t)
        this.remainderWallet.tokenUnits.push(r);
      this.remainderWallet.balance = this.remainderWallet.tokenUnits.length, this.sourceWallet.tokenUnits = t, this.sourceWallet.balance = this.sourceWallet.tokenUnits.length;
    } else
      this.remainderWallet.balance = this.sourceWallet.balance + e, this.sourceWallet.balance = e;
    return this.addAtom(C.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: this.sourceWallet.balance
    })), this.addAtom(C.create({
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
      throw new mt();
    return this.addAtom(C.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -t
    })), this.addAtom(C.create({
      isotope: "V",
      wallet: e,
      value: t,
      metaType: "walletBundle",
      metaId: e.bundle
    })), this.addAtom(C.create({
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
      throw new mt();
    const r = R.create({
      secret: this.secret,
      bundle: this.bundle,
      token: this.sourceWallet.token,
      batchId: this.sourceWallet.batchId
    });
    return r.tradeRates = t, this.addAtom(C.create({
      isotope: "V",
      wallet: this.sourceWallet,
      value: -e
    })), this.addAtom(C.create({
      isotope: "B",
      wallet: r,
      value: e,
      metaType: "walletBundle",
      metaId: this.sourceWallet.bundle
    })), this.addAtom(C.create({
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
    for (const [i, o] of Object.entries(e || {}))
      r += o;
    if (this.sourceWallet.balance - r < 0)
      throw new mt();
    const s = new ae();
    t && s.setSigningWallet(t), this.addAtom(C.create({
      isotope: "B",
      wallet: this.sourceWallet,
      value: -r,
      meta: s,
      metaType: "walletBundle",
      metaId: this.sourceWallet.bundle
    }));
    for (const [i, o] of Object.entries(e || {}))
      this.addAtom(new C({
        isotope: "V",
        token: this.sourceWallet.token,
        value: o,
        batchId: this.sourceWallet.batchId ? Vt({}) : null,
        metaType: "walletBundle",
        metaId: i
      }));
    return this.addAtom(C.create({
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
    const s = new ae(r);
    return s.setMetaWallet(e), this.addAtom(C.create({
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
    rule: r,
    policy: s = {}
  }) {
    const i = [];
    for (const a of r)
      i.push(a instanceof xt ? a : xt.toObject(a));
    const o = new ae({
      rule: JSON.stringify(i)
    });
    return o.addPolicy(s), this.addAtom(C.create({
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
    t || (t = new ae()), t.setMetaWallet(e);
    const r = C.create({
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
    const t = new ae().setShadowWalletClaim(!0);
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
    const s = {
      code: r,
      hash: nt(t.trim(), "Molecule::initIdentifierCreation")
    };
    return this.addAtom(C.create({
      isotope: "C",
      wallet: this.sourceWallet,
      metaType: "identifier",
      metaId: e,
      meta: new ae(s)
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
    policy: s
  }) {
    return this.addAtom(C.create({
      isotope: "M",
      wallet: this.sourceWallet,
      metaType: t,
      metaId: r,
      meta: new ae(e)
    })), this.addPolicyAtom({
      metaType: t,
      metaId: r,
      meta: e,
      policy: s
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
    metaId: s,
    meta: i = {},
    batchId: o = null
  }) {
    return i.token = e, this.local = 1, this.addAtom(C.create({
      isotope: "T",
      wallet: this.sourceWallet,
      value: t,
      metaType: r,
      metaId: s,
      meta: new ae(i),
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
    return this.addAtom(C.create({
      isotope: "U",
      wallet: this.sourceWallet,
      meta: new ae(e)
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
    if (this.atoms.length === 0 || this.atoms.filter((m) => !(m instanceof C)).length !== 0)
      throw new We();
    !t && !this.bundle && (this.bundle = e || nt(this.secret, "Molecule::sign")), this.molecularHash = C.hashAtoms({
      atoms: this.atoms
    });
    const s = this.atoms[0];
    let i = s.position;
    const o = F.get(s.aggregatedMeta(), "signingWallet");
    if (o && (i = F.get(JSON.parse(o), "position")), !i)
      throw new is("Signing wallet must have a position!");
    const a = R.generateKey({
      secret: this.secret,
      token: s.token,
      position: s.position
    }), c = jt(a, 128), l = this.normalizedHash();
    let u = "";
    for (const m in c) {
      let y = c[m];
      for (let g = 0, w = 8 - l[m]; g < w; g++)
        y = new ye("SHAKE256", "TEXT").update(y).getHash("HEX", { outputLen: 512 });
      u += y;
    }
    r && (u = Es(u));
    const d = jt(u, Math.ceil(u.length / this.atoms.length));
    let h = null;
    for (let m = 0, y = d.length; m < y; m++)
      this.atoms[m].otsFragment = d[m], h = this.atoms[m].position;
    return h;
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
    const e = Jr(this);
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
    new Zi(this).verify(e);
  }
  /**
   * Convert Hm to numeric notation via EnumerateMolecule(Hm)
   *
   * @returns {Array}
   */
  normalizedHash() {
    return Me.normalize(Me.enumerate(this.molecularHash));
  }
}
class _t {
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
    pubkey: s
  }) {
    this.$__token = e, this.$__expiresAt = t, this.$__pubkey = s, this.$__encrypt = r;
  }
  /**
   *
   * @param data
   * @param wallet
   * @returns {AuthToken}
   */
  static create(e, t) {
    const r = new _t(e);
    return r.setWallet(t), r;
  }
  /**
   *
   * @param {object} snapshot
   * @param {string} secret
   * @return {AuthToken}
   */
  static restore(e, t) {
    const r = new R({
      secret: t,
      token: "AUTH",
      position: e.wallet.position,
      characters: e.wallet.characters
    });
    return _t.create({
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
class vt extends q {
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
class _n extends q {
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
class V {
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
      throw new vt();
    if (F.has(this.$__response, this.errorKey)) {
      const s = F.get(this.$__response, this.errorKey);
      throw String(s).includes("Unauthenticated") ? new _n() : new vt();
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
    if (!F.has(this.response(), this.dataKey))
      throw new vt();
    return F.get(this.response(), this.dataKey);
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
class oe {
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
    return new V({
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
      throw new Ne("Query::createQuery() - Node URI was not initialized for this client instance!");
    if (this.$__query === null)
      throw new Ne("Query::createQuery() - GraphQL subscription was not initialized!");
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
      const s = await this.client.query({
        ...this.$__request,
        context: r
      });
      return this.$__response = await this.createResponseRaw(s), this.$__response;
    } catch (s) {
      if (s.name === "AbortError")
        return this.knishIOClient.log("warn", "Query was cancelled"), new V({
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
class eo extends V {
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
    return t && (e = new R({
      secret: null,
      token: t.tokenSlug
    }), e.address = t.address, e.position = t.position, e.bundle = t.bundleHash, e.batchId = t.batchId, e.characters = t.characters, e.pubkey = t.pubkey, e.balance = t.amount * 1), e;
  }
}
var He = {
  NAME: "Name",
  DOCUMENT: "Document",
  OPERATION_DEFINITION: "OperationDefinition",
  FIELD: "Field",
  FRAGMENT_DEFINITION: "FragmentDefinition"
};
class $n extends Error {
  constructor(e, t, r, s, i, o, a) {
    super(e), this.name = "GraphQLError", this.message = e, i && (this.path = i), t && (this.nodes = Array.isArray(t) ? t : [t]), r && (this.source = r), s && (this.positions = s), o && (this.originalError = o);
    var c = a;
    if (!c && o) {
      var l = o.extensions;
      l && typeof l == "object" && (c = l);
    }
    this.extensions = c || {};
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
var O, _;
function D(n) {
  return new $n(`Syntax Error: Unexpected token at ${_} in ${n}`);
}
function le(n) {
  if (n.lastIndex = _, n.test(O))
    return O.slice(_, _ = n.lastIndex);
}
var qt = / +(?=[^\s])/y;
function to(n) {
  for (var e = n.split(`
`), t = "", r = 0, s = 0, i = e.length - 1, o = 0; o < e.length; o++)
    qt.lastIndex = 0, qt.test(e[o]) && (o && (!r || qt.lastIndex < r) && (r = qt.lastIndex), s = s || o, i = o);
  for (var a = s; a <= i; a++)
    a !== s && (t += `
`), t += e[a].slice(r).replace(/\\"""/g, '"""');
  return t;
}
function E() {
  for (var n = 0 | O.charCodeAt(_++); n === 9 || n === 10 || n === 13 || n === 32 || n === 35 || n === 44 || n === 65279; n = 0 | O.charCodeAt(_++))
    if (n === 35)
      for (; (n = O.charCodeAt(_++)) !== 10 && n !== 13; )
        ;
  _--;
}
var te = /[_A-Za-z]\w*/y, mn = new RegExp("(?:(null|true|false)|\\$(" + te.source + ')|(-?\\d+)((?:\\.\\d+)?[eE][+-]?\\d+|\\.\\d+)?|("""(?:"""|(?:[\\s\\S]*?[^\\\\])"""))|("(?:"|[^\\r\\n]*?[^\\\\]"))|(' + te.source + "))", "y"), Re = function(n) {
  return n[n.Const = 1] = "Const", n[n.Var = 2] = "Var", n[n.Int = 3] = "Int", n[n.Float = 4] = "Float", n[n.BlockString = 5] = "BlockString", n[n.String = 6] = "String", n[n.Enum = 7] = "Enum", n;
}(Re || {}), no = /\\/;
function Jt(n) {
  var e, t;
  if (mn.lastIndex = _, O.charCodeAt(_) === 91) {
    _++, E();
    for (var r = []; O.charCodeAt(_) !== 93; )
      r.push(Jt(n));
    return _++, E(), {
      kind: "ListValue",
      values: r
    };
  } else if (O.charCodeAt(_) === 123) {
    _++, E();
    for (var s = []; O.charCodeAt(_) !== 125; ) {
      if ((e = le(te)) == null || (E(), O.charCodeAt(_++) !== 58))
        throw D("ObjectField");
      E(), s.push({
        kind: "ObjectField",
        name: {
          kind: "Name",
          value: e
        },
        value: Jt(n)
      });
    }
    return _++, E(), {
      kind: "ObjectValue",
      fields: s
    };
  } else if ((t = mn.exec(O)) != null) {
    if (_ = mn.lastIndex, E(), (e = t[Re.Const]) != null)
      return e === "null" ? {
        kind: "NullValue"
      } : {
        kind: "BooleanValue",
        value: e === "true"
      };
    if ((e = t[Re.Var]) != null) {
      if (n)
        throw D("Variable");
      return {
        kind: "Variable",
        name: {
          kind: "Name",
          value: e
        }
      };
    } else if ((e = t[Re.Int]) != null) {
      var i;
      return (i = t[Re.Float]) != null ? {
        kind: "FloatValue",
        value: e + i
      } : {
        kind: "IntValue",
        value: e
      };
    } else {
      if ((e = t[Re.BlockString]) != null)
        return {
          kind: "StringValue",
          value: to(e.slice(3, -3)),
          block: !0
        };
      if ((e = t[Re.String]) != null)
        return {
          kind: "StringValue",
          value: no.test(e) ? JSON.parse(e) : e.slice(1, -1),
          block: !1
        };
      if ((e = t[Re.Enum]) != null)
        return {
          kind: "EnumValue",
          value: e
        };
    }
  }
  throw D("Value");
}
function os(n) {
  if (O.charCodeAt(_) === 40) {
    var e = [];
    _++, E();
    var t;
    do {
      if ((t = le(te)) == null || (E(), O.charCodeAt(_++) !== 58))
        throw D("Argument");
      E(), e.push({
        kind: "Argument",
        name: {
          kind: "Name",
          value: t
        },
        value: Jt(n)
      });
    } while (O.charCodeAt(_) !== 41);
    return _++, E(), e;
  }
}
function tt(n) {
  if (O.charCodeAt(_) === 64) {
    var e = [], t;
    do {
      if (_++, (t = le(te)) == null)
        throw D("Directive");
      E(), e.push({
        kind: "Directive",
        name: {
          kind: "Name",
          value: t
        },
        arguments: os(n)
      });
    } while (O.charCodeAt(_) === 64);
    return e;
  }
}
function ro() {
  for (var n, e = 0; O.charCodeAt(_) === 91; )
    e++, _++, E();
  if ((n = le(te)) == null)
    throw D("NamedType");
  E();
  var t = {
    kind: "NamedType",
    name: {
      kind: "Name",
      value: n
    }
  };
  do
    if (O.charCodeAt(_) === 33 && (_++, E(), t = {
      kind: "NonNullType",
      type: t
    }), e) {
      if (O.charCodeAt(_++) !== 93)
        throw D("NamedType");
      E(), t = {
        kind: "ListType",
        type: t
      };
    }
  while (e--);
  return t;
}
var gn = new RegExp("(?:(\\.{3})|(" + te.source + "))", "y"), In = function(n) {
  return n[n.Spread = 1] = "Spread", n[n.Name = 2] = "Name", n;
}(In || {});
function Gt() {
  var n = [], e, t;
  do
    if (gn.lastIndex = _, (t = gn.exec(O)) != null) {
      if (_ = gn.lastIndex, t[In.Spread] != null) {
        E();
        var r = le(te);
        if (r != null && r !== "on")
          E(), n.push({
            kind: "FragmentSpread",
            name: {
              kind: "Name",
              value: r
            },
            directives: tt(!1)
          });
        else {
          if (E(), r === "on") {
            if ((r = le(te)) == null)
              throw D("NamedType");
            E();
          }
          var s = tt(!1);
          if (O.charCodeAt(_++) !== 123)
            throw D("InlineFragment");
          E(), n.push({
            kind: "InlineFragment",
            typeCondition: r ? {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: r
              }
            } : void 0,
            directives: s,
            selectionSet: Gt()
          });
        }
      } else if ((e = t[In.Name]) != null) {
        var i = void 0;
        if (E(), O.charCodeAt(_) === 58) {
          if (_++, E(), i = e, (e = le(te)) == null)
            throw D("Field");
          E();
        }
        var o = os(!1);
        E();
        var a = tt(!1), c = void 0;
        O.charCodeAt(_) === 123 && (_++, E(), c = Gt()), n.push({
          kind: "Field",
          alias: i ? {
            kind: "Name",
            value: i
          } : void 0,
          name: {
            kind: "Name",
            value: e
          },
          arguments: o,
          directives: a,
          selectionSet: c
        });
      }
    } else
      throw D("SelectionSet");
  while (O.charCodeAt(_) !== 125);
  return _++, E(), {
    kind: "SelectionSet",
    selections: n
  };
}
function so() {
  var n, e;
  if ((n = le(te)) == null || (E(), le(te) !== "on") || (E(), (e = le(te)) == null))
    throw D("FragmentDefinition");
  E();
  var t = tt(!1);
  if (O.charCodeAt(_++) !== 123)
    throw D("FragmentDefinition");
  return E(), {
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
    selectionSet: Gt()
  };
}
var io = /(?:query|mutation|subscription|fragment)/y;
function oo(n) {
  var e, t, r;
  if (n && (E(), e = le(te), t = function() {
    if (E(), O.charCodeAt(_) === 40) {
      var i = [];
      _++, E();
      var o;
      do {
        if (O.charCodeAt(_++) !== 36 || (o = le(te)) == null)
          throw D("Variable");
        if (E(), O.charCodeAt(_++) !== 58)
          throw D("VariableDefinition");
        E();
        var a = ro(), c = void 0;
        O.charCodeAt(_) === 61 && (_++, E(), c = Jt(!0)), E(), i.push({
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: o
            }
          },
          type: a,
          defaultValue: c,
          directives: tt(!0)
        });
      } while (O.charCodeAt(_) !== 41);
      return _++, E(), i;
    }
  }(), r = tt(!1)), O.charCodeAt(_) === 123)
    return _++, E(), {
      kind: "OperationDefinition",
      operation: n || "query",
      name: e ? {
        kind: "Name",
        value: e
      } : void 0,
      variableDefinitions: t,
      directives: r,
      selectionSet: Gt()
    };
}
function ao(n, e) {
  return _ = 0, function(r, s) {
    var i, o;
    E();
    var a = [];
    do
      if ((i = le(io)) === "fragment")
        E(), a.push(so());
      else if ((o = oo(i)) != null)
        a.push(o);
      else
        throw D("Document");
    while (_ < r.length);
    if (!s) {
      var c;
      return {
        kind: "Document",
        definitions: a,
        set loc(l) {
          c = l;
        },
        get loc() {
          return c || (c = {
            start: 0,
            end: r.length,
            startToken: void 0,
            endToken: void 0,
            source: {
              body: r,
              name: "graphql.web",
              locationOffset: {
                line: 1,
                column: 1
              }
            }
          }), c;
        }
      };
    }
    return {
      kind: "Document",
      definitions: a
    };
  }(O = typeof n.body == "string" ? n.body : n, e && e.noLocation);
}
function re(n, e, t) {
  for (var r = "", s = 0; s < n.length; s++)
    s && (r += e), r += t(n[s]);
  return r;
}
function lo(n) {
  return JSON.stringify(n);
}
function uo(n) {
  return `"""
` + n.replace(/"""/g, '\\"""') + `
"""`;
}
var be = `
`, W = {
  OperationDefinition(n) {
    var e = n.operation;
    return n.name && (e += " " + n.name.value), n.variableDefinitions && n.variableDefinitions.length && (n.name || (e += " "), e += "(" + re(n.variableDefinitions, ", ", W.VariableDefinition) + ")"), n.directives && n.directives.length && (e += " " + re(n.directives, " ", W.Directive)), e !== "query" ? e + " " + W.SelectionSet(n.selectionSet) : W.SelectionSet(n.selectionSet);
  },
  VariableDefinition(n) {
    var e = W.Variable(n.variable) + ": " + Ie(n.type);
    return n.defaultValue && (e += " = " + Ie(n.defaultValue)), n.directives && n.directives.length && (e += " " + re(n.directives, " ", W.Directive)), e;
  },
  Field(n) {
    var e = n.alias ? n.alias.value + ": " + n.name.value : n.name.value;
    if (n.arguments && n.arguments.length) {
      var t = re(n.arguments, ", ", W.Argument);
      e.length + t.length + 2 > 80 ? e += "(" + (be += "  ") + re(n.arguments, be, W.Argument) + (be = be.slice(0, -2)) + ")" : e += "(" + t + ")";
    }
    return n.directives && n.directives.length && (e += " " + re(n.directives, " ", W.Directive)), n.selectionSet && n.selectionSet.selections.length && (e += " " + W.SelectionSet(n.selectionSet)), e;
  },
  StringValue(n) {
    return n.block ? uo(n.value).replace(/\n/g, be) : lo(n.value);
  },
  BooleanValue: (n) => "" + n.value,
  NullValue: (n) => "null",
  IntValue: (n) => n.value,
  FloatValue: (n) => n.value,
  EnumValue: (n) => n.value,
  Name: (n) => n.value,
  Variable: (n) => "$" + n.name.value,
  ListValue: (n) => "[" + re(n.values, ", ", Ie) + "]",
  ObjectValue: (n) => "{" + re(n.fields, ", ", W.ObjectField) + "}",
  ObjectField: (n) => n.name.value + ": " + Ie(n.value),
  Document(n) {
    return !n.definitions || !n.definitions.length ? "" : re(n.definitions, `

`, Ie);
  },
  SelectionSet: (n) => "{" + (be += "  ") + re(n.selections, be, Ie) + (be = be.slice(0, -2)) + "}",
  Argument: (n) => n.name.value + ": " + Ie(n.value),
  FragmentSpread(n) {
    var e = "..." + n.name.value;
    return n.directives && n.directives.length && (e += " " + re(n.directives, " ", W.Directive)), e;
  },
  InlineFragment(n) {
    var e = "...";
    return n.typeCondition && (e += " on " + n.typeCondition.name.value), n.directives && n.directives.length && (e += " " + re(n.directives, " ", W.Directive)), e += " " + W.SelectionSet(n.selectionSet);
  },
  FragmentDefinition(n) {
    var e = "fragment " + n.name.value;
    return e += " on " + n.typeCondition.name.value, n.directives && n.directives.length && (e += " " + re(n.directives, " ", W.Directive)), e + " " + W.SelectionSet(n.selectionSet);
  },
  Directive(n) {
    var e = "@" + n.name.value;
    return n.arguments && n.arguments.length && (e += "(" + re(n.arguments, ", ", W.Argument) + ")"), e;
  },
  NamedType: (n) => n.name.value,
  ListType: (n) => "[" + Ie(n.type) + "]",
  NonNullType: (n) => Ie(n.type) + "!"
}, Ie = (n) => W[n.kind](n);
function co(n) {
  return be = `
`, W[n.kind] ? W[n.kind](n) : "";
}
var as = () => {
}, ue = as;
function we(n) {
  return {
    tag: 0,
    0: n
  };
}
function Mt(n) {
  return {
    tag: 1,
    0: n
  };
}
var dr = () => typeof Symbol == "function" && Symbol.asyncIterator || "@@asyncIterator", ho = (n) => n;
function J(n) {
  return (e) => (t) => {
    var r = ue;
    e((s) => {
      s === 0 ? t(0) : s.tag === 0 ? (r = s[0], t(s)) : n(s[0]) ? t(s) : r(0);
    });
  };
}
function Ft(n) {
  return (e) => (t) => e((r) => {
    r === 0 || r.tag === 0 ? t(r) : t(Mt(n(r[0])));
  });
}
function Rn(n) {
  return (e) => (t) => {
    var r = [], s = ue, i = !1, o = !1;
    e((a) => {
      o || (a === 0 ? (o = !0, r.length || t(0)) : a.tag === 0 ? s = a[0] : (i = !1, function(l) {
        var u = ue;
        l((d) => {
          if (d === 0) {
            if (r.length) {
              var h = r.indexOf(u);
              h > -1 && (r = r.slice()).splice(h, 1), r.length || (o ? t(0) : i || (i = !0, s(0)));
            }
          } else d.tag === 0 ? (r.push(u = d[0]), u(0)) : r.length && (t(d), u(0));
        });
      }(n(a[0])), i || (i = !0, s(0))));
    }), t(we((a) => {
      if (a === 1) {
        o || (o = !0, s(1));
        for (var c = 0, l = r, u = r.length; c < u; c++)
          l[c](1);
        r.length = 0;
      } else {
        !o && !i ? (i = !0, s(0)) : i = !1;
        for (var d = 0, h = r, m = r.length; d < m; d++)
          h[d](0);
      }
    }));
  };
}
function fo(n) {
  return Rn(ho)(n);
}
function st(n) {
  return fo(go(n));
}
function ls(n) {
  return (e) => (t) => {
    var r = !1;
    e((s) => {
      if (!r) if (s === 0)
        r = !0, t(0), n();
      else if (s.tag === 0) {
        var i = s[0];
        t(we((o) => {
          o === 1 ? (r = !0, i(1), n()) : i(o);
        }));
      } else
        t(s);
    });
  };
}
function an(n) {
  return (e) => (t) => {
    var r = !1;
    e((s) => {
      if (!r) if (s === 0)
        r = !0, t(0);
      else if (s.tag === 0) {
        var i = s[0];
        t(we((o) => {
          o === 1 && (r = !0), i(o);
        }));
      } else
        n(s[0]), t(s);
    });
  };
}
function fr(n) {
  return (e) => (t) => e((r) => {
    r === 0 ? t(0) : r.tag === 0 ? (t(r), n()) : t(r);
  });
}
function $t(n) {
  var e = [], t = ue, r = !1;
  return (s) => {
    e.push(s), e.length === 1 && n((i) => {
      if (i === 0) {
        for (var o = 0, a = e, c = e.length; o < c; o++)
          a[o](0);
        e.length = 0;
      } else if (i.tag === 0)
        t = i[0];
      else {
        r = !1;
        for (var l = 0, u = e, d = e.length; l < d; l++)
          u[l](i);
      }
    }), s(we((i) => {
      if (i === 1) {
        var o = e.indexOf(s);
        o > -1 && (e = e.slice()).splice(o, 1), e.length || t(1);
      } else r || (r = !0, t(0));
    }));
  };
}
function pr(n) {
  return (e) => (t) => {
    var r = ue, s = ue, i = !1, o = !1, a = !1, c = !1;
    e((l) => {
      c || (l === 0 ? (c = !0, a || t(0)) : l.tag === 0 ? r = l[0] : (a && (s(1), s = ue), i ? i = !1 : (i = !0, r(0)), function(d) {
        a = !0, d((h) => {
          a && (h === 0 ? (a = !1, c ? t(0) : i || (i = !0, r(0))) : h.tag === 0 ? (o = !1, (s = h[0])(0)) : (t(h), o ? o = !1 : s(0)));
        });
      }(n(l[0]))));
    }), t(we((l) => {
      l === 1 ? (c || (c = !0, r(1)), a && (a = !1, s(1))) : (!c && !i && (i = !0, r(0)), a && !o && (o = !0, s(0)));
    }));
  };
}
function us(n) {
  return (e) => (t) => {
    var r = ue, s = !1, i = 0;
    e((o) => {
      s || (o === 0 ? (s = !0, t(0)) : o.tag === 0 ? r = o[0] : i++ < n ? (t(o), !s && i >= n && (s = !0, t(0), r(1))) : t(o));
    }), t(we((o) => {
      o === 1 && !s ? (s = !0, r(1)) : o === 0 && !s && i < n && r(0);
    }));
  };
}
function Un(n) {
  return (e) => (t) => {
    var r = ue, s = ue, i = !1;
    e((o) => {
      i || (o === 0 ? (i = !0, s(1), t(0)) : o.tag === 0 ? (r = o[0], n((a) => {
        a === 0 || (a.tag === 0 ? (s = a[0])(0) : (i = !0, s(1), r(1), t(0)));
      })) : t(o));
    }), t(we((o) => {
      o === 1 && !i ? (i = !0, r(1), s(1)) : i || r(0);
    }));
  };
}
function po(n, e) {
  return (t) => (r) => {
    var s = ue, i = !1;
    t((o) => {
      i || (o === 0 ? (i = !0, r(0)) : o.tag === 0 ? (s = o[0], r(o)) : n(o[0]) ? r(o) : (i = !0, r(o), r(0), s(1)));
    });
  };
}
function yo(n) {
  return (e) => n()(e);
}
function cs(n) {
  return (e) => {
    var t = n[dr()] && n[dr()]() || n, r = !1, s = !1, i = !1, o;
    e(we(async (a) => {
      if (a === 1)
        r = !0, t.return && t.return();
      else if (s)
        i = !0;
      else {
        for (i = s = !0; i && !r; )
          if ((o = await t.next()).done)
            r = !0, t.return && await t.return(), e(0);
          else
            try {
              i = !1, e(Mt(o.value));
            } catch (c) {
              if (t.throw)
                (r = !!(await t.throw(c)).done) && e(0);
              else
                throw c;
            }
        s = !1;
      }
    }));
  };
}
function mo(n) {
  return n[Symbol.asyncIterator] ? cs(n) : (e) => {
    var t = n[Symbol.iterator](), r = !1, s = !1, i = !1, o;
    e(we((a) => {
      if (a === 1)
        r = !0, t.return && t.return();
      else if (s)
        i = !0;
      else {
        for (i = s = !0; i && !r; )
          if ((o = t.next()).done)
            r = !0, t.return && t.return(), e(0);
          else
            try {
              i = !1, e(Mt(o.value));
            } catch (c) {
              if (t.throw)
                (r = !!t.throw(c).done) && e(0);
              else
                throw c;
            }
        s = !1;
      }
    }));
  };
}
var go = mo;
function wn(n) {
  return (e) => {
    var t = !1;
    e(we((r) => {
      r === 1 ? t = !0 : t || (t = !0, e(Mt(n)), e(0));
    }));
  };
}
function hs(n) {
  return (e) => {
    var t = !1, r = n({
      next(s) {
        t || e(Mt(s));
      },
      complete() {
        t || (t = !0, e(0));
      }
    });
    e(we((s) => {
      s === 1 && !t && (t = !0, r());
    }));
  };
}
function yr() {
  var n, e;
  return {
    source: $t(hs((t) => (n = t.next, e = t.complete, as))),
    next(t) {
      n && n(t);
    },
    complete() {
      e && e();
    }
  };
}
function Xt(n) {
  return (e) => {
    var t = ue, r = !1;
    return e((s) => {
      s === 0 ? r = !0 : s.tag === 0 ? (t = s[0])(0) : r || (n(s[0]), t(0));
    }), {
      unsubscribe() {
        r || (r = !0, t(1));
      }
    };
  };
}
function wo(n) {
  Xt((e) => {
  })(n);
}
function bo(n) {
  return new Promise((e) => {
    var t = ue, r;
    n((s) => {
      s === 0 ? Promise.resolve(r).then(e) : s.tag === 0 ? (t = s[0])(0) : (r = s[0], t(0));
    });
  });
}
var vo = (n) => n && typeof n.message == "string" && (n.extensions || n.name === "GraphQLError") ? n : typeof n == "object" && typeof n.message == "string" ? new $n(n.message, n.nodes, n.source, n.positions, n.path, n, n.extensions || {}) : new $n(n);
class qn extends Error {
  constructor(e) {
    var t = (e.graphQLErrors || []).map(vo), r = ((s, i) => {
      var o = "";
      if (s)
        return `[Network] ${s.message}`;
      if (i)
        for (var a = 0, c = i.length; a < c; a++)
          o && (o += `
`), o += `[GraphQL] ${i[a].message}`;
      return o;
    })(e.networkError, t);
    super(r), this.name = "CombinedError", this.message = r, this.graphQLErrors = t, this.networkError = e.networkError, this.response = e.response;
  }
  toString() {
    return this.message;
  }
}
var Dt = (n, e) => {
  for (var t = 0 | (e || 5381), r = 0, s = 0 | n.length; r < s; r++)
    t = (t << 5) + t + n.charCodeAt(r);
  return t;
}, Qe = /* @__PURE__ */ new Set(), mr = /* @__PURE__ */ new WeakMap(), Ze = (n, e) => {
  if (n === null || Qe.has(n))
    return "null";
  if (typeof n != "object")
    return JSON.stringify(n) || "";
  if (n.toJSON)
    return Ze(n.toJSON(), e);
  if (Array.isArray(n)) {
    for (var t = "[", r = 0, s = n.length; r < s; r++)
      t.length > 1 && (t += ","), t += Ze(n[r], e) || "null";
    return t += "]";
  } else if (!e && (Zt !== it && n instanceof Zt || en !== it && n instanceof en))
    return "null";
  var i = Object.keys(n).sort();
  if (!i.length && n.constructor && Object.getPrototypeOf(n).constructor !== Object.prototype.constructor) {
    var o = mr.get(n) || Math.random().toString(36).slice(2);
    return mr.set(n, o), Ze({
      __key: o
    }, e);
  }
  Qe.add(n);
  for (var a = "{", c = 0, l = i.length; c < l; c++) {
    var u = Ze(n[i[c]], e);
    u && (a.length > 1 && (a += ","), a += Ze(i[c], e) + ":" + u);
  }
  return Qe.delete(n), a += "}";
}, En = (n, e, t) => {
  if (!(t == null || typeof t != "object" || t.toJSON || Qe.has(t))) if (Array.isArray(t))
    for (var r = 0, s = t.length; r < s; r++)
      En(n, `${e}.${r}`, t[r]);
  else if (t instanceof Zt || t instanceof en)
    n.set(e, t);
  else {
    Qe.add(t);
    for (var i in t)
      En(n, `${e}.${i}`, t[i]);
  }
}, Yt = (n, e) => (Qe.clear(), Ze(n, e || !1));
class it {
}
var Zt = typeof File < "u" ? File : it, en = typeof Blob < "u" ? Blob : it, ko = /("{3}[\s\S]*"{3}|"(?:\\.|[^"])*")/g, So = /(?:#[^\n\r]+)?(?:[\r\n]+|$)/g, Ao = (n, e) => e % 2 == 0 ? n.replace(So, `
`) : n, gr = (n) => n.split(ko).map(Ao).join("").trim(), wr = /* @__PURE__ */ new Map(), Wt = /* @__PURE__ */ new Map(), ln = (n) => {
  var e;
  return typeof n == "string" ? e = gr(n) : n.loc && Wt.get(n.__key) === n ? e = n.loc.source.body : (e = wr.get(n) || gr(co(n)), wr.set(n, e)), typeof n != "string" && !n.loc && (n.loc = {
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
}, br = (n) => {
  var e;
  if (n.documentId)
    e = Dt(n.documentId);
  else if (e = Dt(ln(n)), n.definitions) {
    var t = ds(n);
    t && (e = Dt(`
# ${t}`, e));
  }
  return e;
}, tn = (n) => {
  var e, t;
  return typeof n == "string" ? (e = br(n), t = Wt.get(e) || ao(n, {
    noLocation: !0
  })) : (e = n.__key || br(n), t = Wt.get(e) || n), t.loc || ln(t), t.__key = e, Wt.set(e, t), t;
}, bn = (n, e, t) => {
  var r = e || {}, s = tn(n), i = Yt(r, !0), o = s.__key;
  return i !== "{}" && (o = Dt(i, o)), {
    key: o,
    query: s,
    variables: r,
    extensions: t
  };
}, ds = (n) => {
  for (var e = 0, t = n.definitions.length; e < t; e++) {
    var r = n.definitions[e];
    if (r.kind === He.OPERATION_DEFINITION)
      return r.name ? r.name.value : void 0;
  }
}, xo = (n) => {
  for (var e = 0, t = n.definitions.length; e < t; e++) {
    var r = n.definitions[e];
    if (r.kind === He.OPERATION_DEFINITION)
      return r.operation;
  }
}, nn = (n, e, t) => {
  if (!("data" in e || "errors" in e && Array.isArray(e.errors)))
    throw new Error("No Content");
  var r = n.kind === "subscription";
  return {
    operation: n,
    data: e.data,
    error: Array.isArray(e.errors) ? new qn({
      graphQLErrors: e.errors,
      response: t
    }) : void 0,
    extensions: e.extensions ? {
      ...e.extensions
    } : void 0,
    hasNext: e.hasNext == null ? r : e.hasNext,
    stale: !1
  };
}, rn = (n, e) => {
  if (typeof n == "object" && n != null) {
    if (Array.isArray(n)) {
      n = [...n];
      for (var t = 0, r = e.length; t < r; t++)
        n[t] = rn(n[t], e[t]);
      return n;
    }
    if (!n.constructor || n.constructor === Object) {
      n = {
        ...n
      };
      for (var s in e)
        n[s] = rn(n[s], e[s]);
      return n;
    }
  }
  return e;
}, fs = (n, e, t, r) => {
  var s = n.error ? n.error.graphQLErrors : [], i = !!n.extensions || !!(e.payload || e).extensions, o = {
    ...n.extensions,
    ...(e.payload || e).extensions
  }, a = e.incremental;
  "path" in e && (a = [e]);
  var c = {
    data: n.data
  };
  if (a)
    for (var l = function() {
      var h = a[u];
      Array.isArray(h.errors) && s.push(...h.errors), h.extensions && (Object.assign(o, h.extensions), i = !0);
      var m = "data", y = c, g = [];
      if (h.path)
        g = h.path;
      else if (r) {
        var w = r.find((b) => b.id === h.id);
        h.subPath ? g = [...w.path, ...h.subPath] : g = w.path;
      }
      for (var v = 0, A = g.length; v < A; m = g[v++])
        y = y[m] = Array.isArray(y[m]) ? [...y[m]] : {
          ...y[m]
        };
      if (h.items)
        for (var S = +m >= 0 ? m : 0, p = 0, k = h.items.length; p < k; p++)
          y[S + p] = rn(y[S + p], h.items[p]);
      else h.data !== void 0 && (y[m] = rn(y[m], h.data));
    }, u = 0, d = a.length; u < d; u++)
      l();
  else
    c.data = (e.payload || e).data || n.data, s = e.errors || e.payload && e.payload.errors || s;
  return {
    operation: n.operation,
    data: c.data,
    error: s.length ? new qn({
      graphQLErrors: s,
      response: t
    }) : void 0,
    extensions: i ? o : void 0,
    hasNext: e.hasNext != null ? e.hasNext : n.hasNext,
    stale: !1
  };
}, ps = (n, e, t) => ({
  operation: n,
  data: void 0,
  error: new qn({
    networkError: e,
    response: t
  }),
  extensions: void 0,
  hasNext: !1,
  stale: !1
});
function ys(n) {
  var e = {
    query: void 0,
    documentId: void 0,
    operationName: ds(n.query),
    variables: n.variables || void 0,
    extensions: n.extensions
  };
  return "documentId" in n.query && n.query.documentId && (!n.query.definitions || !n.query.definitions.length) ? e.documentId = n.query.documentId : (!n.extensions || !n.extensions.persistedQuery || n.extensions.persistedQuery.miss) && (e.query = ln(n.query)), e;
}
var _o = (n, e) => {
  var t = n.kind === "query" && n.context.preferGetMethod;
  if (!t || !e)
    return n.context.url;
  var r = $o(n.context.url);
  for (var s in e) {
    var i = e[s];
    i && r[1].set(s, typeof i == "object" ? Yt(i) : i);
  }
  var o = r.join("?");
  return o.length > 2047 && t !== "force" ? (n.context.preferGetMethod = !1, n.context.url) : o;
}, $o = (n) => {
  var e = n.indexOf("?");
  return e > -1 ? [n.slice(0, e), new URLSearchParams(n.slice(e + 1))] : [n, new URLSearchParams()];
}, Io = (n, e) => {
  if (e && !(n.kind === "query" && n.context.preferGetMethod)) {
    var t = Yt(e), r = ((a) => {
      var c = /* @__PURE__ */ new Map();
      return (Zt !== it || en !== it) && (Qe.clear(), En(c, "variables", a)), c;
    })(e.variables);
    if (r.size) {
      var s = new FormData();
      s.append("operations", t), s.append("map", Yt({
        ...[...r.keys()].map((a) => [a])
      }));
      var i = 0;
      for (var o of r.values())
        s.append("" + i++, o);
      return s;
    }
    return t;
  }
}, Eo = (n, e) => {
  var t = {
    accept: n.kind === "subscription" ? "text/event-stream, multipart/mixed" : "application/graphql-response+json, application/graphql+json, application/json, text/event-stream, multipart/mixed"
  }, r = (typeof n.context.fetchOptions == "function" ? n.context.fetchOptions() : n.context.fetchOptions) || {};
  if (r.headers)
    if (((o) => "has" in o && !Object.keys(o).length)(r.headers))
      r.headers.forEach((o, a) => {
        t[a] = o;
      });
    else if (Array.isArray(r.headers))
      r.headers.forEach((o, a) => {
        Array.isArray(o) ? t[o[0]] ? t[o[0]] = `${t[o[0]]},${o[1]}` : t[o[0]] = o[1] : t[a] = o;
      });
    else
      for (var s in r.headers)
        t[s.toLowerCase()] = r.headers[s];
  var i = Io(n, e);
  return typeof i == "string" && !t["content-type"] && (t["content-type"] = "application/json"), {
    ...r,
    method: i ? "POST" : "GET",
    body: i,
    headers: t
  };
}, To = typeof TextDecoder < "u" ? new TextDecoder() : null, Co = /boundary="?([^=";]+)"?/i, Mo = /data: ?([^\n]+)/, vr = (n) => n.constructor.name === "Buffer" ? n.toString() : To.decode(n);
async function* kr(n) {
  if (n.body[Symbol.asyncIterator])
    for await (var e of n.body)
      yield vr(e);
  else {
    var t = n.body.getReader(), r;
    try {
      for (; !(r = await t.read()).done; )
        yield vr(r.value);
    } finally {
      t.cancel();
    }
  }
}
async function* Sr(n, e) {
  var t = "", r;
  for await (var s of n)
    for (t += s; (r = t.indexOf(e)) > -1; )
      yield t.slice(0, r), t = t.slice(r + e.length);
}
async function* Oo(n, e, t) {
  var r = !0, s = null, i;
  try {
    yield await Promise.resolve();
    var o = (i = await (n.context.fetch || fetch)(e, t)).headers.get("Content-Type") || "", a;
    /multipart\/mixed/i.test(o) ? a = async function* (d, h) {
      var m = d.match(Co), y = "--" + (m ? m[1] : "-"), g = !0, w;
      for await (var v of Sr(kr(h), `\r
` + y)) {
        if (g) {
          g = !1;
          var A = v.indexOf(y);
          if (A > -1)
            v = v.slice(A + y.length);
          else
            continue;
        }
        try {
          yield w = JSON.parse(v.slice(v.indexOf(`\r
\r
`) + 4));
        } catch (S) {
          if (!w)
            throw S;
        }
        if (w && w.hasNext === !1)
          break;
      }
      w && w.hasNext !== !1 && (yield {
        hasNext: !1
      });
    }(o, i) : /text\/event-stream/i.test(o) ? a = async function* (d) {
      var h;
      for await (var m of Sr(kr(d), `

`)) {
        var y = m.match(Mo);
        if (y) {
          var g = y[1];
          try {
            yield h = JSON.parse(g);
          } catch (w) {
            if (!h)
              throw w;
          }
          if (h && h.hasNext === !1)
            break;
        }
      }
      h && h.hasNext !== !1 && (yield {
        hasNext: !1
      });
    }(i) : /text\//i.test(o) ? a = async function* (d) {
      var h = await d.text();
      try {
        var m = JSON.parse(h);
        console.warn('Found response with content-type "text/plain" but it had a valid "application/json" response.'), yield m;
      } catch {
        throw new Error(h);
      }
    }(i) : a = async function* (d) {
      yield JSON.parse(await d.text());
    }(i);
    var c;
    for await (var l of a)
      l.pending && !s ? c = l.pending : l.pending && (c = [...c, ...l.pending]), s = s ? fs(s, l, i, c) : nn(n, l, i), r = !1, yield s, r = !0;
    s || (yield s = nn(n, {}, i));
  } catch (u) {
    if (!r)
      throw u;
    yield ps(n, i && (i.status < 200 || i.status >= 300) && i.statusText ? new Error(i.statusText) : u, i);
  }
}
function No(n, e, t) {
  var r;
  return typeof AbortController < "u" && (t.signal = (r = new AbortController()).signal), ls(() => {
    r && r.abort();
  })(J((s) => !!s)(cs(Oo(n, e, t))));
}
var Tn = (n, e) => {
  if (Array.isArray(n))
    for (var t = 0, r = n.length; t < r; t++)
      Tn(n[t], e);
  else if (typeof n == "object" && n !== null)
    for (var s in n)
      s === "__typename" && typeof n[s] == "string" ? e.add(n[s]) : Tn(n[s], e);
  return e;
}, Cn = (n) => {
  if ("definitions" in n) {
    for (var e = [], t = 0, r = n.definitions.length; t < r; t++) {
      var s = Cn(n.definitions[t]);
      e.push(s);
    }
    return {
      ...n,
      definitions: e
    };
  }
  if ("directives" in n && n.directives && n.directives.length) {
    for (var i = [], o = {}, a = 0, c = n.directives.length; a < c; a++) {
      var l = n.directives[a], u = l.name.value;
      u[0] !== "_" ? i.push(l) : u = u.slice(1), o[u] = l;
    }
    n = {
      ...n,
      directives: i,
      _directives: o
    };
  }
  if ("selectionSet" in n) {
    var d = [], h = n.kind === He.OPERATION_DEFINITION;
    if (n.selectionSet) {
      for (var m = 0, y = n.selectionSet.selections.length; m < y; m++) {
        var g = n.selectionSet.selections[m];
        h = h || g.kind === He.FIELD && g.name.value === "__typename" && !g.alias;
        var w = Cn(g);
        d.push(w);
      }
      return h || d.push({
        kind: He.FIELD,
        name: {
          kind: He.NAME,
          value: "__typename"
        },
        _generated: !0
      }), {
        ...n,
        selectionSet: {
          ...n.selectionSet,
          selections: d
        }
      };
    }
  }
  return n;
}, Ar = /* @__PURE__ */ new Map(), Ro = (n) => {
  var e = tn(n), t = Ar.get(e.__key);
  return t || (Ar.set(e.__key, t = Cn(e)), Object.defineProperty(t, "__key", {
    value: e.__key,
    enumerable: !1
  })), t;
};
function xr(n) {
  var e = (t) => n(t);
  return e.toPromise = () => bo(us(1)(J((t) => !t.stale && !t.hasNext)(e))), e.then = (t, r) => e.toPromise().then(t, r), e.subscribe = (t) => Xt(t)(e), e;
}
function ot(n, e, t) {
  return {
    ...e,
    kind: n,
    context: e.context ? {
      ...e.context,
      ...t
    } : t || e.context
  };
}
var _r = (n, e) => ot(n.kind, n, {
  meta: {
    ...n.context.meta,
    ...e
  }
}), Uo = () => {
};
function j(n) {
  for (var e = /* @__PURE__ */ new Map(), t = [], r = [], s = Array.isArray(n) ? n[0] : n || "", i = 1; i < arguments.length; i++) {
    var o = arguments[i];
    o && o.definitions ? r.push(o) : s += o, s += arguments[0][i];
  }
  r.unshift(tn(s));
  for (var a = 0; a < r.length; a++)
    for (var c = 0; c < r[a].definitions.length; c++) {
      var l = r[a].definitions[c];
      if (l.kind === He.FRAGMENT_DEFINITION) {
        var u = l.name.value, d = ln(l);
        e.has(u) ? e.get(u) !== d && console.warn("[WARNING: Duplicate Fragment] A fragment with name `" + u + "` already exists in this document.\nWhile fragment names may not be unique across your source, each name must be unique per document.") : (e.set(u, d), t.push(l));
      } else
        t.push(l);
    }
  return tn({
    kind: He.DOCUMENT,
    definitions: t
  });
}
var vn = ({ kind: n }) => n !== "mutation" && n !== "query", qo = (n) => {
  var e = Ro(n.query);
  if (e !== n.query) {
    var t = ot(n.kind, n);
    return t.query = e, t;
  } else
    return n;
}, Ho = ({ forward: n, client: e, dispatchDebug: t }) => {
  var r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), i = (o) => o.kind === "query" && o.context.requestPolicy !== "network-only" && (o.context.requestPolicy === "cache-only" || r.has(o.key));
  return (o) => {
    var a = Ft((l) => {
      var u = r.get(l.key);
      t({
        operation: l,
        ...u ? {
          type: "cacheHit",
          message: "The result was successfully retried from the cache"
        } : {
          type: "cacheMiss",
          message: "The result could not be retrieved from the cache"
        },
        source: "cacheExchange"
      });
      var d = u || nn(l, {
        data: null
      });
      return d = {
        ...d,
        operation: _r(l, {
          cacheOutcome: u ? "hit" : "miss"
        })
      }, l.context.requestPolicy === "cache-and-network" && (d.stale = !0, $r(e, l)), d;
    })(J((l) => !vn(l) && i(l))(o)), c = an((l) => {
      var { operation: u } = l;
      if (u) {
        var d = u.context.additionalTypenames || [];
        if (l.operation.kind !== "subscription" && (d = ((k) => [...Tn(k, /* @__PURE__ */ new Set())])(l.data).concat(d)), l.operation.kind === "mutation" || l.operation.kind === "subscription") {
          var h = /* @__PURE__ */ new Set();
          t({
            type: "cacheInvalidation",
            message: `The following typenames have been invalidated: ${d}`,
            operation: u,
            data: {
              typenames: d,
              response: l
            },
            source: "cacheExchange"
          });
          for (var m = 0; m < d.length; m++) {
            var y = d[m], g = s.get(y);
            g || s.set(y, g = /* @__PURE__ */ new Set());
            for (var w of g.values())
              h.add(w);
            g.clear();
          }
          for (var v of h.values())
            r.has(v) && (u = r.get(v).operation, r.delete(v), $r(e, u));
        } else if (u.kind === "query" && l.data) {
          r.set(u.key, l);
          for (var A = 0; A < d.length; A++) {
            var S = d[A], p = s.get(S);
            p || s.set(S, p = /* @__PURE__ */ new Set()), p.add(u.key);
          }
        }
      }
    })(n(J((l) => l.kind !== "query" || l.context.requestPolicy !== "cache-only")(Ft((l) => _r(l, {
      cacheOutcome: "miss"
    }))(st([Ft(qo)(J((l) => !vn(l) && !i(l))(o)), J((l) => vn(l))(o)])))));
    return st([a, c]);
  };
}, $r = (n, e) => n.reexecuteOperation(ot(e.kind, e, {
  requestPolicy: "network-only"
})), Bo = ({ forwardSubscription: n, enableAllOperations: e, isSubscriptionOperation: t }) => ({ client: r, forward: s }) => {
  var i = t || ((o) => o.kind === "subscription" || !!e && (o.kind === "query" || o.kind === "mutation"));
  return (o) => {
    var a = Rn((l) => {
      var { key: u } = l, d = J((h) => h.kind === "teardown" && h.key === u)(o);
      return Un(d)(((h) => {
        var m = n(ys(h), h);
        return hs((y) => {
          var g = !1, w, v;
          function A(S) {
            y.next(v = v ? fs(v, S) : nn(h, S));
          }
          return Promise.resolve().then(() => {
            g || (w = m.subscribe({
              next: A,
              error(S) {
                Array.isArray(S) ? A({
                  errors: S
                }) : y.next(ps(h, S)), y.complete();
              },
              complete() {
                g || (g = !0, h.kind === "subscription" && r.reexecuteOperation(ot("teardown", h, h.context)), v && v.hasNext && A({
                  hasNext: !1
                }), y.complete());
              }
            }));
          }), () => {
            g = !0, w && w.unsubscribe();
          };
        });
      })(l));
    })(J((l) => l.kind !== "teardown" && i(l))(o)), c = s(J((l) => l.kind === "teardown" || !i(l))(o));
    return st([a, c]);
  };
}, Lo = ({ forward: n, dispatchDebug: e }) => (t) => {
  var r = Rn((i) => {
    var o = ys(i), a = _o(i, o), c = Eo(i, o);
    e({
      type: "fetchRequest",
      message: "A fetch request is being executed.",
      operation: i,
      data: {
        url: a,
        fetchOptions: c
      },
      source: "fetchExchange"
    });
    var l = Un(J((u) => u.kind === "teardown" && u.key === i.key)(t))(No(i, a, c));
    return an((u) => {
      var d = u.data ? void 0 : u.error;
      e({
        type: d ? "fetchError" : "fetchSuccess",
        message: `A ${d ? "failed" : "successful"} fetch response has been returned.`,
        operation: i,
        data: {
          url: a,
          fetchOptions: c,
          value: d || u
        },
        source: "fetchExchange"
      });
    })(l);
  })(J((i) => i.kind !== "teardown" && (i.kind !== "subscription" || !!i.context.fetchSubscriptions))(t)), s = n(J((i) => i.kind === "teardown" || i.kind === "subscription" && !i.context.fetchSubscriptions)(t));
  return st([r, s]);
}, Po = (n) => ({ client: e, forward: t, dispatchDebug: r }) => n.reduceRight((s, i) => {
  var o = !1;
  return i({
    client: e,
    forward(a) {
      {
        if (o)
          throw new Error("forward() must only be called once in each Exchange.");
        o = !0;
      }
      return $t(s($t(a)));
    },
    dispatchDebug(a) {
      r({
        timestamp: Date.now(),
        source: i.name,
        ...a
      });
    }
  });
}, t), Ko = ({ dispatchDebug: n }) => (e) => (e = an((t) => {
  if (t.kind !== "teardown") {
    var r = `No exchange has handled operations of kind "${t.kind}". Check whether you've added an exchange responsible for these operations.`;
    n({
      type: "fallbackCatch",
      message: r,
      operation: t,
      source: "fallbackExchange"
    }), console.warn(r);
  }
})(e), J((t) => !1)(e)), Fo = function n(e) {
  if (!e.url)
    throw new Error("You are creating an urql-client without a url.");
  var t = 0, r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set(), o = [], a = {
    url: e.url,
    fetchSubscriptions: e.fetchSubscriptions,
    fetchOptions: e.fetchOptions,
    fetch: e.fetch,
    preferGetMethod: e.preferGetMethod,
    requestPolicy: e.requestPolicy || "cache-first"
  }, c = yr();
  function l(p) {
    (p.kind === "mutation" || p.kind === "teardown" || !i.has(p.key)) && (p.kind === "teardown" ? i.delete(p.key) : p.kind !== "mutation" && i.add(p.key), c.next(p));
  }
  var u = !1;
  function d(p) {
    if (p && l(p), !u) {
      for (u = !0; u && (p = o.shift()); )
        l(p);
      u = !1;
    }
  }
  var h = (p) => {
    var k = Un(J((b) => b.kind === "teardown" && b.key === p.key)(c.source))(J((b) => b.operation.kind === p.kind && b.operation.key === p.key && (!b.operation.context._instance || b.operation.context._instance === p.context._instance))(S));
    return p.kind !== "query" ? k = po((b) => !!b.hasNext)(k) : k = pr((b) => {
      var I = wn(b);
      return b.stale || b.hasNext ? I : st([I, Ft(() => (b.stale = !0, b))(us(1)(J((H) => H.key === p.key)(c.source)))]);
    })(k), p.kind !== "mutation" ? k = ls(() => {
      i.delete(p.key), r.delete(p.key), s.delete(p.key), u = !1;
      for (var b = o.length - 1; b >= 0; b--)
        o[b].key === p.key && o.splice(b, 1);
      l(ot("teardown", p, p.context));
    })(an((b) => {
      if (b.stale)
        if (!b.hasNext)
          i.delete(p.key);
        else
          for (var I = 0; I < o.length; I++) {
            var H = o[I];
            if (H.key === b.operation.key) {
              i.delete(H.key);
              break;
            }
          }
      else b.hasNext || i.delete(p.key);
      r.set(p.key, b);
    })(k)) : k = fr(() => {
      l(p);
    })(k), $t(k);
  }, m = this instanceof n ? this : Object.create(n.prototype), y = Object.assign(m, {
    suspense: !!e.suspense,
    operations$: c.source,
    reexecuteOperation(p) {
      if (p.kind === "teardown")
        d(p);
      else if (p.kind === "mutation")
        o.push(p), Promise.resolve().then(d);
      else if (s.has(p.key)) {
        for (var k = !1, b = 0; b < o.length; b++)
          o[b].key === p.key && (o[b] = p, k = !0);
        k || i.has(p.key) && p.context.requestPolicy !== "network-only" ? (i.delete(p.key), Promise.resolve().then(d)) : (o.push(p), Promise.resolve().then(d));
      }
    },
    createRequestOperation(p, k, b) {
      b || (b = {});
      var I;
      if (p !== "teardown" && (I = xo(k.query)) !== p)
        throw new Error(`Expected operation of type "${p}" but found "${I}"`);
      return ot(p, k, {
        _instance: p === "mutation" ? t = t + 1 | 0 : void 0,
        ...a,
        ...b,
        requestPolicy: b.requestPolicy || a.requestPolicy,
        suspense: b.suspense || b.suspense !== !1 && y.suspense
      });
    },
    executeRequestOperation(p) {
      return p.kind === "mutation" ? xr(h(p)) : xr(yo(() => {
        var k = s.get(p.key);
        k || s.set(p.key, k = h(p)), k = fr(() => {
          d(p);
        })(k);
        var b = r.get(p.key);
        return p.kind === "query" && b && (b.stale || b.hasNext) ? pr(wn)(st([k, J((I) => I === r.get(p.key))(wn(b))])) : k;
      }));
    },
    executeQuery(p, k) {
      var b = y.createRequestOperation("query", p, k);
      return y.executeRequestOperation(b);
    },
    executeSubscription(p, k) {
      var b = y.createRequestOperation("subscription", p, k);
      return y.executeRequestOperation(b);
    },
    executeMutation(p, k) {
      var b = y.createRequestOperation("mutation", p, k);
      return y.executeRequestOperation(b);
    },
    readQuery(p, k, b) {
      var I = null;
      return Xt((H) => {
        I = H;
      })(y.query(p, k, b)).unsubscribe(), I;
    },
    query: (p, k, b) => y.executeQuery(bn(p, k), b),
    subscription: (p, k, b) => y.executeSubscription(bn(p, k), b),
    mutation: (p, k, b) => y.executeMutation(bn(p, k), b)
  }), g = Uo;
  {
    var { next: w, source: v } = yr();
    y.subscribeToDebugTarget = (p) => Xt(p)(v), g = w;
  }
  var A = Po(e.exchanges), S = $t(A({
    client: y,
    dispatchDebug: g,
    forward: Ko({
      dispatchDebug: g
    })
  })(c.source));
  return wo(S), y;
}, Do = Fo;
class Wo extends oe {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = j`query ($bundle: String!) {
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
    return new eo({
      query: this,
      json: e
    });
  }
}
class jo extends V {
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
      r.metas = rt.aggregateMeta(r.metas), t[r.bundleHash] = r;
    }), t;
  }
}
class Qo extends oe {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = j`query( $bundleHashes: [ String! ] ) {
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
    return new jo({
      query: this,
      json: e
    });
  }
}
class un extends V {
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
    if (e.position === null || typeof e.position > "u" ? r = R.create({
      bundle: e.bundleHash,
      token: e.tokenSlug,
      batchId: e.batchId,
      characters: e.characters
    }) : (r = new R({
      secret: t,
      token: e.tokenSlug,
      position: e.position,
      batchId: e.batchId,
      characters: e.characters
    }), r.address = e.address, r.bundle = e.bundleHash), e.token && (r.tokenName = e.token.name, r.tokenAmount = e.token.amount, r.tokenSupply = e.token.supply, r.tokenFungibility = e.token.fungibility), e.tokenUnits.length)
      for (const s of e.tokenUnits)
        r.tokenUnits.push(kt.createFromGraphQL(s));
    if (e.tradeRates.length)
      for (const s of e.tradeRates)
        r.tradeRates[s.tokenSlug] = s.amount;
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
    for (const s of t)
      r.push(un.toClientWallet({
        data: s,
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
class Vo extends oe {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = j`query( $bundleHash: String, $tokenSlug: String ) {
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
    return new un({
      query: this,
      json: e
    });
  }
}
class zo extends V {
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
    return !e || !e.bundleHash || !e.tokenSlug ? null : un.toClientWallet({
      data: e
    });
  }
}
class Jo extends oe {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = j`query( $address: String, $bundleHash: String, $type: String, $token: String, $position: String ) {
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
    return new zo({
      query: this,
      json: e
    });
  }
}
class Go extends V {
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
class Ir extends oe {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = j`query( $metaType: String, $metaTypes: [ String! ], $metaId: String, $metaIds: [ String! ], $key: String, $keys: [ String! ], $value: String, $values: [ String! ], $count: String, $latest: Boolean, $filter: [ MetaFilter! ], $queryArgs: QueryArgs, $countBy: String ) {
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
    value: s = null,
    latest: i = null,
    filter: o = null,
    queryArgs: a = null,
    count: c = null,
    countBy: l = null
  }) {
    const u = {};
    return e && (u[typeof e == "string" ? "metaType" : "metaTypes"] = e), t && (u[typeof t == "string" ? "metaId" : "metaIds"] = t), r && (u[typeof r == "string" ? "key" : "keys"] = r), s && (u[typeof s == "string" ? "value" : "values"] = s), u.latest = i === !0, o && (u.filter = o), a && ((typeof a.limit > "u" || a.limit === 0) && (a.limit = "*"), u.queryArgs = a), c && (u.count = c), l && (u.countBy = l), u;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaType}
   */
  createResponse(e) {
    return new Go({
      query: this,
      json: e
    });
  }
}
class It extends oe {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = j`query( $batchId: String ) {
      Batch( batchId: $batchId ) {
        ${It.getFields()},
        children {
          ${It.getFields()}
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
    const t = new V({
      query: this,
      json: e
    });
    return t.dataKey = "data.Batch", t;
  }
}
class Xo extends oe {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = j`query( $batchId: String ) {
      BatchHistory( batchId: $batchId ) {
        ${It.getFields()}
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
    const t = new V({
      query: this,
      json: e
    });
    return t.dataKey = "data.BatchHistory", t;
  }
}
class xe extends V {
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
    const e = F.get(this.data(), "payload");
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
    const t = new Me({});
    return t.molecularHash = F.get(e, "molecularHash"), t.status = F.get(e, "status"), t.createdAt = F.get(e, "createdAt"), t;
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
    return F.get(this.data(), "status", "rejected");
  }
  /**
   * Returns the reason for rejection
   *
   * @return {string}
   */
  reason() {
    return F.get(this.data(), "reason", "Invalid response from server");
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
class Hn extends oe {
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
      const s = {
        ...this.$__request,
        context: r
      }, i = await this.client.mutate(s);
      return this.$__response = await this.createResponseRaw(i), this.$__response;
    } catch (s) {
      if (s.name === "AbortError")
        return this.knishIOClient.log("warn", "Mutation was cancelled"), new V({
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
class Z extends Hn {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   * @param molecule
   */
  constructor(e, t, r) {
    super(e, t), this.$__molecule = r, this.$__remainderWallet = null, this.$__query = j`mutation( $molecule: MoleculeInput! ) {
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
    return new xe({
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
class Yo extends xe {
  /**
   * return the authorization key
   *
   * @param key
   * @return {*}
   */
  payloadKey(e) {
    if (!F.has(this.payload(), e))
      throw new vt(`ResponseRequestAuthorization::payloadKey() - '${e}' key was not found in the payload!`);
    return F.get(this.payload(), e);
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
class Zo extends Z {
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
    return new Yo({
      query: this,
      json: e
    });
  }
}
class ea extends xe {
}
class ta extends Z {
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
    return new ea({
      query: this,
      json: e
    });
  }
}
class na extends xe {
}
class ra extends Z {
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
    metaId: s,
    meta: i = null,
    batchId: o = null
  }) {
    this.$__molecule.initTokenRequest({
      token: e,
      amount: t,
      metaType: r,
      metaId: s,
      meta: i || {},
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
    return new na({
      query: this,
      json: e
    });
  }
}
class sa extends xe {
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
class ia extends Z {
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
    return new sa({
      query: this,
      json: e
    });
  }
}
class oa extends xe {
}
class aa extends Z {
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
    return new oa({
      query: this,
      json: e
    });
  }
}
class la extends xe {
}
class ua extends Z {
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
    const r = R.create({
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
    return new la({
      query: this,
      json: e
    });
  }
}
class ca extends xe {
}
class ha extends Z {
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
    policy: s
  }) {
    this.$__molecule.initMeta({
      meta: r,
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
    return new ca({
      query: this,
      json: e
    });
  }
}
class da extends xe {
}
class fa extends Z {
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
    return new da({
      query: this,
      json: e
    });
  }
}
class pa extends V {
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
    if (!F.has(this.payload(), e))
      throw new vt(`ResponseAuthorizationGuest::payloadKey() - '${e}' key is not found in the payload!`);
    return F.get(this.payload(), e);
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
class ya extends Hn {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = j`mutation( $cellSlug: String, $pubkey: String, $encrypt: Boolean ) {
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
    return new pa({
      query: this,
      json: e
    });
  }
}
class Er extends q {
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
class ma extends q {
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
class Ht extends q {
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
class cn {
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
      throw new Ne("Subscribe::createSubscribe() - Node URI was not initialized for this client instance!");
    if (this.$__subscribe === null)
      throw new Ne("Subscribe::createSubscribe() - GraphQL subscription was not initialized!");
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
      throw new Ne(`${this.constructor.name}::execute() - closure parameter is required!`);
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
class ga extends cn {
  constructor(e) {
    super(e), this.$__subscribe = j`
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
class wa extends cn {
  constructor(e) {
    super(e), this.$__subscribe = j`
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
class ba extends cn {
  constructor(e) {
    super(e), this.$__subscribe = j`
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
class va extends cn {
  constructor(e) {
    super(e), this.$__subscribe = j`
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
class ka extends V {
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
class Sa extends Hn {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = j`mutation(
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
    return new ka({
      query: this,
      json: e
    });
  }
}
class Aa extends V {
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
      const s = { ...r };
      s.jsonData && (s.jsonData = JSON.parse(s.jsonData)), s.createdAt && (s.createdAt = new Date(s.createdAt)), s.updatedAt && (s.updatedAt = new Date(s.updatedAt)), t.push(s);
    }
    return t;
  }
}
class xa extends oe {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = j`query ActiveUserQuery ($bundleHash:String, $metaType: String, $metaId: String) {
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
    return new Aa({
      query: this,
      json: e
    });
  }
}
class _a extends V {
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
class $a extends oe {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = j`query UserActivity (
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
    return new _a({
      query: this,
      json: e
    });
  }
}
class Ia extends oe {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = j`query( $slug: String, $slugs: [ String! ], $limit: Int, $order: String ) {
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
    return new V({
      query: this,
      json: e,
      dataKey: "data.Token"
    });
  }
}
class Tr extends q {
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
class Ea extends V {
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
        const s = t.instances[r];
        s.metasJson && (t.instances[r].metas = JSON.parse(s.metasJson));
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
class Cr extends oe {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = j`query(
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
    bundleHash: s,
    positions: i,
    position: o,
    walletAddresses: a,
    walletAddress: c,
    isotopes: l,
    isotope: u,
    tokenSlugs: d,
    tokenSlug: h,
    cellSlugs: m,
    cellSlug: y,
    batchIds: g,
    batchId: w,
    values: v,
    value: A,
    metaTypes: S,
    metaType: p,
    metaIds: k,
    metaId: b,
    indexes: I,
    index: H,
    filter: P,
    latest: ce,
    queryArgs: L
  }) {
    return t && (e = e || [], e.push(t)), s && (r = r || [], r.push(s)), o && (i = i || [], i.push(o)), c && (a = a || [], a.push(c)), u && (l = l || [], l.push(u)), h && (d = d || [], d.push(h)), y && (m = m || [], m.push(y)), w && (g = g || [], g.push(w)), A && (v = v || [], v.push(A)), p && (S = S || [], S.push(p)), b && (k = k || [], k.push(b)), H && (I = I || [], I.push(H)), {
      molecularHashes: e,
      bundleHashes: r,
      positions: i,
      walletAddresses: a,
      isotopes: l,
      tokenSlugs: d,
      cellSlugs: m,
      batchIds: g,
      values: v,
      metaTypes: S,
      metaIds: k,
      indexes: I,
      filter: P,
      latest: ce,
      queryArgs: L
    };
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseAtom}
   */
  createResponse(e) {
    return new Ea({
      query: this,
      json: e
    });
  }
}
class Ta extends V {
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
class Ca extends oe {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = j`query( $metaType: String, $metaId: String, ) {
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
    return new Ta({
      query: this,
      json: e
    });
  }
}
class Ma extends V {
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
class Mr extends oe {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor(e, t) {
    super(e, t), this.$__query = j`query ($metaTypes: [String!], $metaIds: [String!], $values: [String!], $keys: [String!], $latest: Boolean, $filter: [MetaFilter!], $queryArgs: QueryArgs, $countBy: String, $atomValues: [String!] ) {
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
    value: s = null,
    keys: i = null,
    values: o = null,
    atomValues: a = null,
    latest: c = null,
    filter: l = null,
    queryArgs: u = null,
    countBy: d = null
  }) {
    const h = {};
    return a && (h.atomValues = a), i && (h.keys = i), o && (h.values = o), e && (h.metaTypes = typeof e == "string" ? [e] : e), t && (h.metaIds = typeof t == "string" ? [t] : t), d && (h.countBy = d), l && (h.filter = l), r && s && (h.filter = h.filter || [], h.filter.push({
      key: r,
      value: s,
      comparison: "="
    })), h.latest = c === !0, u && ((typeof u.limit > "u" || u.limit === 0) && (u.limit = "*"), h.queryArgs = u), h;
  }
  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaTypeViaAtom}
   */
  createResponse(e) {
    return new Ma({
      query: this,
      json: e
    });
  }
}
class Oa extends xe {
}
class Na extends Z {
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
    policy: s
  }) {
    this.$__molecule.createRule({
      metaType: e,
      metaId: t,
      rule: r,
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
    return new Oa({
      query: this,
      json: e
    });
  }
}
class Ra extends Z {
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
class Ua extends Z {
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
function ve(n, e, t, r) {
  return new (t || (t = Promise))(function(s, i) {
    function o(l) {
      try {
        c(r.next(l));
      } catch (u) {
        i(u);
      }
    }
    function a(l) {
      try {
        c(r.throw(l));
      } catch (u) {
        i(u);
      }
    }
    function c(l) {
      var u;
      l.done ? s(l.value) : (u = l.value, u instanceof t ? u : new t(function(d) {
        d(u);
      })).then(o, a);
    }
    c((r = r.apply(n, [])).next());
  });
}
function ke(n, e) {
  var t, r, s, i, o = { label: 0, sent: function() {
    if (1 & s[0]) throw s[1];
    return s[1];
  }, trys: [], ops: [] };
  return i = { next: a(0), throw: a(1), return: a(2) }, typeof Symbol == "function" && (i[Symbol.iterator] = function() {
    return this;
  }), i;
  function a(c) {
    return function(l) {
      return function(u) {
        if (t) throw new TypeError("Generator is already executing.");
        for (; i && (i = 0, u[0] && (o = 0)), o; ) try {
          if (t = 1, r && (s = 2 & u[0] ? r.return : u[0] ? r.throw || ((s = r.return) && s.call(r), 0) : r.next) && !(s = s.call(r, u[1])).done) return s;
          switch (r = 0, s && (u = [2 & u[0], s.value]), u[0]) {
            case 0:
            case 1:
              s = u;
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
              if (s = o.trys, !((s = s.length > 0 && s[s.length - 1]) || u[0] !== 6 && u[0] !== 2)) {
                o = 0;
                continue;
              }
              if (u[0] === 3 && (!s || u[1] > s[0] && u[1] < s[3])) {
                o.label = u[1];
                break;
              }
              if (u[0] === 6 && o.label < s[1]) {
                o.label = s[1], s = u;
                break;
              }
              if (s && o.label < s[2]) {
                o.label = s[2], o.ops.push(u);
                break;
              }
              s[2] && o.ops.pop(), o.trys.pop();
              continue;
          }
          u = e.call(n, o);
        } catch (d) {
          u = [6, d], r = 0;
        } finally {
          t = s = 0;
        }
        if (5 & u[0]) throw u[1];
        return { value: u[0] ? u[1] : void 0, done: !0 };
      }([c, l]);
    };
  }
}
var Q = { exclude: [], include: [], logging: !0, timeout: 1e3 }, ms = {}, qa = { timeout: "true" }, ge = function(n, e) {
  typeof window < "u" && (ms[n] = e);
}, Ha = function() {
  return Object.fromEntries(Object.entries(ms).filter(function(n) {
    var e, t = n[0];
    return !(!((e = Q?.exclude) === null || e === void 0) && e.includes(t));
  }).filter(function(n) {
    var e, t, r, s, i = n[0];
    return !((e = Q?.include) === null || e === void 0) && e.some(function(o) {
      return o.includes(".");
    }) ? (t = Q?.include) === null || t === void 0 ? void 0 : t.some(function(o) {
      return o.startsWith(i);
    }) : ((r = Q?.include) === null || r === void 0 ? void 0 : r.length) === 0 || ((s = Q?.include) === null || s === void 0 ? void 0 : s.includes(i));
  }).map(function(n) {
    return [n[0], (0, n[1])()];
  }));
};
function Bt(n) {
  return n ^= n >>> 16, n = Math.imul(n, 2246822507), n ^= n >>> 13, n = Math.imul(n, 3266489909), (n ^= n >>> 16) >>> 0;
}
var X = new Uint32Array([597399067, 2869860233, 951274213, 2716044179]);
function de(n, e) {
  return n << e | n >>> 32 - e;
}
function Bn(n, e) {
  var t;
  if (e === void 0 && (e = 0), e = e ? 0 | e : 0, typeof n == "string" && (t = n, n = new TextEncoder().encode(t).buffer), !(n instanceof ArrayBuffer)) throw new TypeError("Expected key to be ArrayBuffer or string");
  var r = new Uint32Array([e, e, e, e]);
  (function(i, o) {
    for (var a = i.byteLength / 16 | 0, c = new Uint32Array(i, 0, 4 * a), l = 0; l < a; l++) {
      var u = c.subarray(4 * l, 4 * (l + 1));
      u[0] = Math.imul(u[0], X[0]), u[0] = de(u[0], 15), u[0] = Math.imul(u[0], X[1]), o[0] = o[0] ^ u[0], o[0] = de(o[0], 19), o[0] = o[0] + o[1], o[0] = Math.imul(o[0], 5) + 1444728091, u[1] = Math.imul(u[1], X[1]), u[1] = de(u[1], 16), u[1] = Math.imul(u[1], X[2]), o[1] = o[1] ^ u[1], o[1] = de(o[1], 17), o[1] = o[1] + o[2], o[1] = Math.imul(o[1], 5) + 197830471, u[2] = Math.imul(u[2], X[2]), u[2] = de(u[2], 17), u[2] = Math.imul(u[2], X[3]), o[2] = o[2] ^ u[2], o[2] = de(o[2], 15), o[2] = o[2] + o[3], o[2] = Math.imul(o[2], 5) + 2530024501, u[3] = Math.imul(u[3], X[3]), u[3] = de(u[3], 18), u[3] = Math.imul(u[3], X[0]), o[3] = o[3] ^ u[3], o[3] = de(o[3], 13), o[3] = o[3] + o[0], o[3] = Math.imul(o[3], 5) + 850148119;
    }
  })(n, r), function(i, o) {
    var a = i.byteLength / 16 | 0, c = i.byteLength % 16, l = new Uint32Array(4), u = new Uint8Array(i, 16 * a, c);
    switch (c) {
      case 15:
        l[3] = l[3] ^ u[14] << 16;
      case 14:
        l[3] = l[3] ^ u[13] << 8;
      case 13:
        l[3] = l[3] ^ u[12], l[3] = Math.imul(l[3], X[3]), l[3] = de(l[3], 18), l[3] = Math.imul(l[3], X[0]), o[3] = o[3] ^ l[3];
      case 12:
        l[2] = l[2] ^ u[11] << 24;
      case 11:
        l[2] = l[2] ^ u[10] << 16;
      case 10:
        l[2] = l[2] ^ u[9] << 8;
      case 9:
        l[2] = l[2] ^ u[8], l[2] = Math.imul(l[2], X[2]), l[2] = de(l[2], 17), l[2] = Math.imul(l[2], X[3]), o[2] = o[2] ^ l[2];
      case 8:
        l[1] = l[1] ^ u[7] << 24;
      case 7:
        l[1] = l[1] ^ u[6] << 16;
      case 6:
        l[1] = l[1] ^ u[5] << 8;
      case 5:
        l[1] = l[1] ^ u[4], l[1] = Math.imul(l[1], X[1]), l[1] = de(l[1], 16), l[1] = Math.imul(l[1], X[2]), o[1] = o[1] ^ l[1];
      case 4:
        l[0] = l[0] ^ u[3] << 24;
      case 3:
        l[0] = l[0] ^ u[2] << 16;
      case 2:
        l[0] = l[0] ^ u[1] << 8;
      case 1:
        l[0] = l[0] ^ u[0], l[0] = Math.imul(l[0], X[0]), l[0] = de(l[0], 15), l[0] = Math.imul(l[0], X[1]), o[0] = o[0] ^ l[0];
    }
  }(n, r), function(i, o) {
    o[0] = o[0] ^ i.byteLength, o[1] = o[1] ^ i.byteLength, o[2] = o[2] ^ i.byteLength, o[3] = o[3] ^ i.byteLength, o[0] = o[0] + o[1] | 0, o[0] = o[0] + o[2] | 0, o[0] = o[0] + o[3] | 0, o[1] = o[1] + o[0] | 0, o[2] = o[2] + o[0] | 0, o[3] = o[3] + o[0] | 0, o[0] = Bt(o[0]), o[1] = Bt(o[1]), o[2] = Bt(o[2]), o[3] = Bt(o[3]), o[0] = o[0] + o[1] | 0, o[0] = o[0] + o[2] | 0, o[0] = o[0] + o[3] | 0, o[1] = o[1] + o[0] | 0, o[2] = o[2] + o[0] | 0, o[3] = o[3] + o[0] | 0;
  }(n, r);
  var s = new Uint8Array(r.buffer);
  return Array.from(s).map(function(i) {
    return i.toString(16).padStart(2, "0");
  }).join("");
}
function Ba(n, e) {
  return new Promise(function(t) {
    setTimeout(function() {
      return t(e);
    }, n);
  });
}
function La(n, e, t) {
  return Promise.all(n.map(function(r) {
    return Promise.race([r, Ba(e, t)]);
  }));
}
function gs() {
  return ve(this, void 0, void 0, function() {
    var n, e, t, r, s;
    return ke(this, function(i) {
      switch (i.label) {
        case 0:
          return i.trys.push([0, 2, , 3]), n = Ha(), e = Object.keys(n), [4, La(Object.values(n), Q?.timeout || 1e3, qa)];
        case 1:
          return t = i.sent(), r = t.filter(function(o) {
            return o !== void 0;
          }), s = {}, r.forEach(function(o, a) {
            s[e[a]] = o;
          }), [2, ws(s, Q.exclude || [], Q.include || [], "")];
        case 2:
          throw i.sent();
        case 3:
          return [2];
      }
    });
  });
}
function ws(n, e, t, r) {
  r === void 0 && (r = "");
  for (var s = {}, i = function(l, u) {
    var d = r + l + ".";
    if (typeof u != "object" || Array.isArray(u)) {
      var h = e.some(function(g) {
        return d.startsWith(g);
      }), m = t.some(function(g) {
        return d.startsWith(g);
      });
      h && !m || (s[l] = u);
    } else {
      var y = ws(u, e, t, d);
      Object.keys(y).length > 0 && (s[l] = y);
    }
  }, o = 0, a = Object.entries(n); o < a.length; o++) {
    var c = a[o];
    i(c[0], c[1]);
  }
  return s;
}
function Pa(n) {
  return ve(this, void 0, void 0, function() {
    var e, t;
    return ke(this, function(r) {
      switch (r.label) {
        case 0:
          return r.trys.push([0, 2, , 3]), [4, gs()];
        case 1:
          return e = r.sent(), t = Bn(JSON.stringify(e)), Math.random() < 1e-5 && Q.logging && function(s, i) {
            ve(this, void 0, void 0, function() {
              var o, a;
              return ke(this, function(c) {
                switch (c.label) {
                  case 0:
                    if (o = "https://logging.thumbmarkjs.com/v1/log", a = { thumbmark: s, components: i, version: "0.20.5" }, sessionStorage.getItem("_tmjs_l")) return [3, 4];
                    sessionStorage.setItem("_tmjs_l", "1"), c.label = 1;
                  case 1:
                    return c.trys.push([1, 3, , 4]), [4, fetch(o, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(a) })];
                  case 2:
                  case 3:
                    return c.sent(), [3, 4];
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
function Et() {
  if (typeof navigator > "u") return { name: "unknown", version: "unknown" };
  for (var n = navigator.userAgent, e = { edg: "Edge", opr: "Opera", samsung: "SamsungBrowser" }, t = 0, r = [/(?<name>SamsungBrowser)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>Edge|Edg)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>(?:Chrome|Chromium|OPR|Opera|Vivaldi|Brave))\/(?<version>\d+(?:\.\d+)?)/, /(?<name>(?:Firefox|Waterfox|Iceweasel|IceCat))\/(?<version>\d+(?:\.\d+)?)/, /(?<name>Safari)\/(?<version>\d+(?:\.\d+)?)/, /(?<name>MSIE|Trident|IEMobile).+?(?<version>\d+(?:\.\d+)?)/, /(?<name>samsung).*Version\/(?<version>\d+(?:\.\d+)?)/i, /(?<name>[A-Za-z]+)\/(?<version>\d+(?:\.\d+)?)/]; t < r.length; t++) {
    var s = r[t], i = n.match(s);
    if (i && i.groups) return { name: e[i.groups.name.toLowerCase()] || i.groups.name, version: i.groups.version };
  }
  return { name: "unknown", version: "unknown" };
}
function Ka(n) {
  for (var e = 0, t = 0; t < n.length; ++t) e += Math.abs(n[t]);
  return e;
}
var Fa = Et();
function bs(n, e, t) {
  for (var r = [], s = 0; s < n[0].data.length; s++) {
    for (var i = [], o = 0; o < n.length; o++) i.push(n[o].data[s]);
    r.push(Da(i));
  }
  var a = new Uint8ClampedArray(r);
  return new ImageData(a, e, t);
}
function Da(n) {
  if (n.length === 0) return 0;
  for (var e = {}, t = 0, r = n; t < r.length; t++)
    e[i = r[t]] = (e[i] || 0) + 1;
  var s = n[0];
  for (var i in e) e[i] > e[s] && (s = parseInt(i, 10));
  return s;
}
["SamsungBrowser", "Safari"].includes(Fa.name) || ge("audio", function() {
  return ve(this, void 0, void 0, function() {
    return ke(this, function(n) {
      return [2, new Promise(function(e, t) {
        try {
          var r = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 5e3, 44100), s = r.createBufferSource(), i = r.createOscillator();
          i.frequency.value = 1e3;
          var o, a = r.createDynamicsCompressor();
          a.threshold.value = -50, a.knee.value = 40, a.ratio.value = 12, a.attack.value = 0, a.release.value = 0.2, i.connect(a), a.connect(r.destination), i.start(), r.oncomplete = function(c) {
            o = c.renderedBuffer.getChannelData(0), e({ sampleHash: Ka(o), oscillator: i.type, maxChannels: r.destination.maxChannelCount, channelCountMode: s.channelCountMode });
          }, r.startRendering();
        } catch (c) {
          console.error("Error creating audio fingerprint:", c), t(c);
        }
      })];
    });
  });
});
var vs = Et(), Or = vs.name.toLowerCase(), Wa = vs.version.split(".")[0] || "0", ja = parseInt(Wa, 10);
Or === "firefox" || Or === "safari" && ja === 17 || ge("canvas", function() {
  return document.createElement("canvas").getContext("2d"), new Promise(function(n) {
    var e = Array.from({ length: 3 }, function() {
      return function() {
        var t = document.createElement("canvas"), r = t.getContext("2d");
        if (!r) return new ImageData(1, 1);
        t.width = 280, t.height = 20;
        var s = r.createLinearGradient(0, 0, t.width, t.height);
        s.addColorStop(0, "red"), s.addColorStop(0.16666666666666666, "orange"), s.addColorStop(0.3333333333333333, "yellow"), s.addColorStop(0.5, "green"), s.addColorStop(0.6666666666666666, "blue"), s.addColorStop(0.8333333333333334, "indigo"), s.addColorStop(1, "violet"), r.fillStyle = s, r.fillRect(0, 0, t.width, t.height);
        var i = "Random Text WMwmil10Oo";
        return r.font = "23.123px Arial", r.fillStyle = "black", r.fillText(i, -5, 15), r.fillStyle = "rgba(0, 0, 255, 0.5)", r.fillText(i, -3.3, 17.7), r.beginPath(), r.moveTo(0, 0), r.lineTo(2 * t.width / 7, t.height), r.strokeStyle = "white", r.lineWidth = 2, r.stroke(), r.getImageData(0, 0, t.width, t.height);
      }();
    });
    n({ commonImageDataHash: Bn(bs(e, 280, 20).data.toString()).toString() });
  });
});
var kn, Qa = ["Arial", "Arial Black", "Arial Narrow", "Arial Rounded MT", "Arimo", "Archivo", "Barlow", "Bebas Neue", "Bitter", "Bookman", "Calibri", "Cabin", "Candara", "Century", "Century Gothic", "Comic Sans MS", "Constantia", "Courier", "Courier New", "Crimson Text", "DM Mono", "DM Sans", "DM Serif Display", "DM Serif Text", "Dosis", "Droid Sans", "Exo", "Fira Code", "Fira Sans", "Franklin Gothic Medium", "Garamond", "Geneva", "Georgia", "Gill Sans", "Helvetica", "Impact", "Inconsolata", "Indie Flower", "Inter", "Josefin Sans", "Karla", "Lato", "Lexend", "Lucida Bright", "Lucida Console", "Lucida Sans Unicode", "Manrope", "Merriweather", "Merriweather Sans", "Montserrat", "Myriad", "Noto Sans", "Nunito", "Nunito Sans", "Open Sans", "Optima", "Orbitron", "Oswald", "Pacifico", "Palatino", "Perpetua", "PT Sans", "PT Serif", "Poppins", "Prompt", "Public Sans", "Quicksand", "Rajdhani", "Recursive", "Roboto", "Roboto Condensed", "Rockwell", "Rubik", "Segoe Print", "Segoe Script", "Segoe UI", "Sora", "Source Sans Pro", "Space Mono", "Tahoma", "Taviraj", "Times", "Times New Roman", "Titillium Web", "Trebuchet MS", "Ubuntu", "Varela Round", "Verdana", "Work Sans"], Va = ["monospace", "sans-serif", "serif"];
function Nr(n, e) {
  if (!n) throw new Error("Canvas context not supported");
  return n.font, n.font = "72px ".concat(e), n.measureText("WwMmLli0Oo").width;
}
function za() {
  var n, e = document.createElement("canvas"), t = (n = e.getContext("webgl")) !== null && n !== void 0 ? n : e.getContext("experimental-webgl");
  if (t && "getParameter" in t) try {
    var r = (t.getParameter(t.VENDOR) || "").toString(), s = (t.getParameter(t.RENDERER) || "").toString(), i = { vendor: r, renderer: s, version: (t.getParameter(t.VERSION) || "").toString(), shadingLanguageVersion: (t.getParameter(t.SHADING_LANGUAGE_VERSION) || "").toString() };
    if (!s.length || !r.length) {
      var o = t.getExtension("WEBGL_debug_renderer_info");
      if (o) {
        var a = (t.getParameter(o.UNMASKED_VENDOR_WEBGL) || "").toString(), c = (t.getParameter(o.UNMASKED_RENDERER_WEBGL) || "").toString();
        a && (i.vendorUnmasked = a), c && (i.rendererUnmasked = c);
      }
    }
    return i;
  } catch {
  }
  return "undefined";
}
function Ja() {
  var n = new Float32Array(1), e = new Uint8Array(n.buffer);
  return n[0] = 1 / 0, n[0] = n[0] - n[0], e[3];
}
function Ga(n, e) {
  var t = {};
  return e.forEach(function(r) {
    var s = function(i) {
      if (i.length === 0) return null;
      var o = {};
      i.forEach(function(l) {
        var u = String(l);
        o[u] = (o[u] || 0) + 1;
      });
      var a = i[0], c = 1;
      return Object.keys(o).forEach(function(l) {
        o[l] > c && (a = l, c = o[l]);
      }), a;
    }(n.map(function(i) {
      return r in i ? i[r] : void 0;
    }).filter(function(i) {
      return i !== void 0;
    }));
    s && (t[r] = s);
  }), t;
}
function Xa() {
  var n = [], e = { "prefers-contrast": ["high", "more", "low", "less", "forced", "no-preference"], "any-hover": ["hover", "none"], "any-pointer": ["none", "coarse", "fine"], pointer: ["none", "coarse", "fine"], hover: ["hover", "none"], update: ["fast", "slow"], "inverted-colors": ["inverted", "none"], "prefers-reduced-motion": ["reduce", "no-preference"], "prefers-reduced-transparency": ["reduce", "no-preference"], scripting: ["none", "initial-only", "enabled"], "forced-colors": ["active", "none"] };
  return Object.keys(e).forEach(function(t) {
    e[t].forEach(function(r) {
      matchMedia("(".concat(t, ": ").concat(r, ")")).matches && n.push("".concat(t, ": ").concat(r));
    });
  }), n;
}
function Ya() {
  if (window.location.protocol === "https:" && typeof window.ApplePaySession == "function") try {
    for (var n = window.ApplePaySession.supportsVersion, e = 15; e > 0; e--) if (n(e)) return e;
  } catch {
    return 0;
  }
  return 0;
}
Et().name != "Firefox" && ge("fonts", function() {
  var n = this;
  return new Promise(function(e, t) {
    try {
      (function(r) {
        var s;
        ve(this, void 0, void 0, function() {
          var i, o, a;
          return ke(this, function(c) {
            switch (c.label) {
              case 0:
                return document.body ? [3, 2] : [4, (l = 50, new Promise(function(d) {
                  return setTimeout(d, l, u);
                }))];
              case 1:
                return c.sent(), [3, 0];
              case 2:
                if ((i = document.createElement("iframe")).setAttribute("frameBorder", "0"), (o = i.style).setProperty("position", "fixed"), o.setProperty("display", "block", "important"), o.setProperty("visibility", "visible"), o.setProperty("border", "0"), o.setProperty("opacity", "0"), i.src = "about:blank", document.body.appendChild(i), !(a = i.contentDocument || ((s = i.contentWindow) === null || s === void 0 ? void 0 : s.document))) throw new Error("Iframe document is not accessible");
                return r({ iframe: a }), setTimeout(function() {
                  document.body.removeChild(i);
                }, 0), [2];
            }
            var l, u;
          });
        });
      })(function(r) {
        var s = r.iframe;
        return ve(n, void 0, void 0, function() {
          var i, o, a, c;
          return ke(this, function(l) {
            return i = s.createElement("canvas"), o = i.getContext("2d"), a = Va.map(function(u) {
              return Nr(o, u);
            }), c = {}, Qa.forEach(function(u) {
              var d = Nr(o, u);
              a.includes(d) || (c[u] = d);
            }), e(c), [2];
          });
        });
      });
    } catch {
      t({ error: "unsupported" });
    }
  });
}), ge("hardware", function() {
  return new Promise(function(n, e) {
    var t = navigator.deviceMemory !== void 0 ? navigator.deviceMemory : 0, r = window.performance && window.performance.memory ? window.performance.memory : 0;
    n({ videocard: za(), architecture: Ja(), deviceMemory: t.toString() || "undefined", jsHeapSizeLimit: r.jsHeapSizeLimit || 0 });
  });
}), ge("locales", function() {
  return new Promise(function(n) {
    n({ languages: navigator.language, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  });
}), ge("permissions", function() {
  return ve(this, void 0, void 0, function() {
    var n;
    return ke(this, function(e) {
      return kn = Q?.permissions_to_check || ["accelerometer", "accessibility", "accessibility-events", "ambient-light-sensor", "background-fetch", "background-sync", "bluetooth", "camera", "clipboard-read", "clipboard-write", "device-info", "display-capture", "gyroscope", "geolocation", "local-fonts", "magnetometer", "microphone", "midi", "nfc", "notifications", "payment-handler", "persistent-storage", "push", "speaker", "storage-access", "top-level-storage-access", "window-management", "query"], n = Array.from({ length: Q?.retries || 3 }, function() {
        return function() {
          return ve(this, void 0, void 0, function() {
            var t, r, s, i, o;
            return ke(this, function(a) {
              switch (a.label) {
                case 0:
                  t = {}, r = 0, s = kn, a.label = 1;
                case 1:
                  if (!(r < s.length)) return [3, 6];
                  i = s[r], a.label = 2;
                case 2:
                  return a.trys.push([2, 4, , 5]), [4, navigator.permissions.query({ name: i })];
                case 3:
                  return o = a.sent(), t[i] = o.state.toString(), [3, 5];
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
        return Ga(t, kn);
      })];
    });
  });
}), ge("plugins", function() {
  var n = [];
  if (navigator.plugins) for (var e = 0; e < navigator.plugins.length; e++) {
    var t = navigator.plugins[e];
    n.push([t.name, t.filename, t.description].join("|"));
  }
  return new Promise(function(r) {
    r({ plugins: n });
  });
}), ge("screen", function() {
  return new Promise(function(n) {
    n({ is_touchscreen: navigator.maxTouchPoints > 0, maxTouchPoints: navigator.maxTouchPoints, colorDepth: screen.colorDepth, mediaMatches: Xa() });
  });
}), ge("system", function() {
  return new Promise(function(n) {
    var e = Et();
    n({ platform: window.navigator.platform, cookieEnabled: window.navigator.cookieEnabled, productSub: navigator.productSub, product: navigator.product, useragent: navigator.userAgent, hardwareConcurrency: navigator.hardwareConcurrency, browser: { name: e.name, version: e.version }, applePayVersion: Ya() });
  });
});
var ee, Za = Et().name !== "SamsungBrowser" ? 1 : 3, $ = null;
ge("webgl", function() {
  return ve(this, void 0, void 0, function() {
    var n;
    return ke(this, function(e) {
      typeof document < "u" && ((ee = document.createElement("canvas")).width = 200, ee.height = 100, $ = ee.getContext("webgl"));
      try {
        if (!$) throw new Error("WebGL not supported");
        return n = Array.from({ length: Za }, function() {
          return function() {
            try {
              if (!$) throw new Error("WebGL not supported");
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
      `, s = $.createShader($.VERTEX_SHADER), i = $.createShader($.FRAGMENT_SHADER);
              if (!s || !i) throw new Error("Failed to create shaders");
              if ($.shaderSource(s, t), $.shaderSource(i, r), $.compileShader(s), !$.getShaderParameter(s, $.COMPILE_STATUS)) throw new Error("Vertex shader compilation failed: " + $.getShaderInfoLog(s));
              if ($.compileShader(i), !$.getShaderParameter(i, $.COMPILE_STATUS)) throw new Error("Fragment shader compilation failed: " + $.getShaderInfoLog(i));
              var o = $.createProgram();
              if (!o) throw new Error("Failed to create shader program");
              if ($.attachShader(o, s), $.attachShader(o, i), $.linkProgram(o), !$.getProgramParameter(o, $.LINK_STATUS)) throw new Error("Shader program linking failed: " + $.getProgramInfoLog(o));
              $.useProgram(o);
              for (var a = 137, c = new Float32Array(4 * a), l = 2 * Math.PI / a, u = 0; u < a; u++) {
                var d = u * l;
                c[4 * u] = 0, c[4 * u + 1] = 0, c[4 * u + 2] = Math.cos(d) * (ee.width / 2), c[4 * u + 3] = Math.sin(d) * (ee.height / 2);
              }
              var h = $.createBuffer();
              $.bindBuffer($.ARRAY_BUFFER, h), $.bufferData($.ARRAY_BUFFER, c, $.STATIC_DRAW);
              var m = $.getAttribLocation(o, "position");
              $.enableVertexAttribArray(m), $.vertexAttribPointer(m, 2, $.FLOAT, !1, 0, 0), $.viewport(0, 0, ee.width, ee.height), $.clearColor(0, 0, 0, 1), $.clear($.COLOR_BUFFER_BIT), $.drawArrays($.LINES, 0, 2 * a);
              var y = new Uint8ClampedArray(ee.width * ee.height * 4);
              return $.readPixels(0, 0, ee.width, ee.height, $.RGBA, $.UNSIGNED_BYTE, y), new ImageData(y, ee.width, ee.height);
            } catch {
              return new ImageData(1, 1);
            } finally {
              $ && ($.bindBuffer($.ARRAY_BUFFER, null), $.useProgram(null), $.viewport(0, 0, $.drawingBufferWidth, $.drawingBufferHeight), $.clearColor(0, 0, 0, 0));
            }
          }();
        }), [2, { commonImageHash: Bn(bs(n, ee.width, ee.height).data.toString()).toString() }];
      } catch {
        return [2, { webgl: "unsupported" }];
      }
      return [2];
    });
  });
});
var Pe = function(n, e, t, r) {
  for (var s = (t - e) / r, i = 0, o = 0; o < r; o++)
    i += n(e + (o + 0.5) * s);
  return i * s;
};
ge("math", function() {
  return ve(void 0, void 0, void 0, function() {
    return ke(this, function(n) {
      return [2, { acos: Math.acos(0.5), asin: Pe(Math.asin, -1, 1, 97), atan: Pe(Math.atan, -1, 1, 97), cos: Pe(Math.cos, 0, Math.PI, 97), cosh: Math.cosh(9 / 7), e: Math.E, largeCos: Math.cos(1e20), largeSin: Math.sin(1e20), largeTan: Math.tan(1e20), log: Math.log(1e3), pi: Math.PI, sin: Pe(Math.sin, -Math.PI, Math.PI, 97), sinh: Pe(Math.sinh, -9 / 7, 7 / 9, 97), sqrt: Math.sqrt(2), tan: Pe(Math.tan, 0, 2 * Math.PI, 97), tanh: Pe(Math.tanh, -9 / 7, 7 / 9, 97) }];
    });
  });
});
function se(n) {
  return n === null ? "null" : Array.isArray(n) ? "array" : typeof n;
}
function Ke(n) {
  return se(n) === "object";
}
function el(n) {
  return Array.isArray(n) && // must be at least one error
  n.length > 0 && // error has at least a message
  n.every((e) => "message" in e);
}
function Rr(n, e) {
  return n.length < 124 ? n : e;
}
const tl = "graphql-transport-ws";
var fe = /* @__PURE__ */ ((n) => (n[n.InternalServerError = 4500] = "InternalServerError", n[n.InternalClientError = 4005] = "InternalClientError", n[n.BadRequest = 4400] = "BadRequest", n[n.BadResponse = 4004] = "BadResponse", n[n.Unauthorized = 4401] = "Unauthorized", n[n.Forbidden = 4403] = "Forbidden", n[n.SubprotocolNotAcceptable = 4406] = "SubprotocolNotAcceptable", n[n.ConnectionInitialisationTimeout = 4408] = "ConnectionInitialisationTimeout", n[n.ConnectionAcknowledgementTimeout = 4504] = "ConnectionAcknowledgementTimeout", n[n.SubscriberAlreadyExists = 4409] = "SubscriberAlreadyExists", n[n.TooManyInitialisationRequests = 4429] = "TooManyInitialisationRequests", n))(fe || {}), pe = /* @__PURE__ */ ((n) => (n.ConnectionInit = "connection_init", n.ConnectionAck = "connection_ack", n.Ping = "ping", n.Pong = "pong", n.Subscribe = "subscribe", n.Next = "next", n.Error = "error", n.Complete = "complete", n))(pe || {});
function ks(n) {
  if (!Ke(n))
    throw new Error(
      `Message is expected to be an object, but got ${se(n)}`
    );
  if (!n.type)
    throw new Error("Message is missing the 'type' property");
  if (typeof n.type != "string")
    throw new Error(
      `Message is expects the 'type' property to be a string, but got ${se(
        n.type
      )}`
    );
  switch (n.type) {
    case "connection_init":
    case "connection_ack":
    case "ping":
    case "pong": {
      if (n.payload != null && !Ke(n.payload))
        throw new Error(
          `"${n.type}" message expects the 'payload' property to be an object or nullish or missing, but got "${n.payload}"`
        );
      break;
    }
    case "subscribe": {
      if (typeof n.id != "string")
        throw new Error(
          `"${n.type}" message expects the 'id' property to be a string, but got ${se(
            n.id
          )}`
        );
      if (!n.id)
        throw new Error(
          `"${n.type}" message requires a non-empty 'id' property`
        );
      if (!Ke(n.payload))
        throw new Error(
          `"${n.type}" message expects the 'payload' property to be an object, but got ${se(
            n.payload
          )}`
        );
      if (typeof n.payload.query != "string")
        throw new Error(
          `"${n.type}" message payload expects the 'query' property to be a string, but got ${se(
            n.payload.query
          )}`
        );
      if (n.payload.variables != null && !Ke(n.payload.variables))
        throw new Error(
          `"${n.type}" message payload expects the 'variables' property to be a an object or nullish or missing, but got ${se(
            n.payload.variables
          )}`
        );
      if (n.payload.operationName != null && se(n.payload.operationName) !== "string")
        throw new Error(
          `"${n.type}" message payload expects the 'operationName' property to be a string or nullish or missing, but got ${se(
            n.payload.operationName
          )}`
        );
      if (n.payload.extensions != null && !Ke(n.payload.extensions))
        throw new Error(
          `"${n.type}" message payload expects the 'extensions' property to be a an object or nullish or missing, but got ${se(
            n.payload.extensions
          )}`
        );
      break;
    }
    case "next": {
      if (typeof n.id != "string")
        throw new Error(
          `"${n.type}" message expects the 'id' property to be a string, but got ${se(
            n.id
          )}`
        );
      if (!n.id)
        throw new Error(
          `"${n.type}" message requires a non-empty 'id' property`
        );
      if (!Ke(n.payload))
        throw new Error(
          `"${n.type}" message expects the 'payload' property to be an object, but got ${se(
            n.payload
          )}`
        );
      break;
    }
    case "error": {
      if (typeof n.id != "string")
        throw new Error(
          `"${n.type}" message expects the 'id' property to be a string, but got ${se(
            n.id
          )}`
        );
      if (!n.id)
        throw new Error(
          `"${n.type}" message requires a non-empty 'id' property`
        );
      if (!el(n.payload))
        throw new Error(
          `"${n.type}" message expects the 'payload' property to be an array of GraphQL errors, but got ${JSON.stringify(
            n.payload
          )}`
        );
      break;
    }
    case "complete": {
      if (typeof n.id != "string")
        throw new Error(
          `"${n.type}" message expects the 'id' property to be a string, but got ${se(
            n.id
          )}`
        );
      if (!n.id)
        throw new Error(
          `"${n.type}" message requires a non-empty 'id' property`
        );
      break;
    }
    default:
      throw new Error(`Invalid message 'type' property "${n.type}"`);
  }
  return n;
}
function nl(n, e) {
  return ks(
    typeof n == "string" ? JSON.parse(n, e) : n
  );
}
function gt(n, e) {
  return ks(n), JSON.stringify(n, e);
}
function rl(n) {
  const {
    url: e,
    connectionParams: t,
    lazy: r = !0,
    onNonLazyError: s = console.error,
    lazyCloseTimeout: i = 0,
    keepAlive: o = 0,
    disablePong: a,
    connectionAckWaitTimeout: c = 0,
    retryAttempts: l = 5,
    retryWait: u = async function(B) {
      const M = Math.pow(2, B);
      await new Promise(
        (N) => setTimeout(
          N,
          M * 1e3 + // add random timeout from 300ms to 3s
          Math.floor(Math.random() * 2700 + 300)
        )
      );
    },
    shouldRetry: d = Sn,
    on: h,
    webSocketImpl: m,
    /**
     * Generates a v4 UUID to be used as the ID using `Math`
     * as the random number generator. Supply your own generator
     * in case you need more uniqueness.
     *
     * Reference: https://gist.github.com/jed/982883
     */
    generateID: y = function() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (B) => {
        const M = Math.random() * 16 | 0;
        return (B == "x" ? M : M & 3 | 8).toString(16);
      });
    },
    jsonMessageReplacer: g,
    jsonMessageReviver: w
  } = n;
  let v;
  if (m) {
    if (!il(m))
      throw new Error("Invalid WebSocket implementation provided");
    v = m;
  } else typeof WebSocket < "u" ? v = WebSocket : typeof global < "u" ? v = global.WebSocket || // @ts-expect-error: Support more browsers
  global.MozWebSocket : typeof window < "u" && (v = window.WebSocket || // @ts-expect-error: Support more browsers
  window.MozWebSocket);
  if (!v)
    throw new Error(
      "WebSocket implementation missing; on Node you can `import WebSocket from 'ws';` and pass `webSocketImpl: WebSocket` to `createClient`"
    );
  const A = v, S = (() => {
    const T = /* @__PURE__ */ (() => {
      const M = {};
      return {
        on(N, K) {
          return M[N] = K, () => {
            delete M[N];
          };
        },
        emit(N) {
          "id" in N && M[N.id]?.(N);
        }
      };
    })(), B = {
      connecting: h?.connecting ? [h.connecting] : [],
      opened: h?.opened ? [h.opened] : [],
      connected: h?.connected ? [h.connected] : [],
      ping: h?.ping ? [h.ping] : [],
      pong: h?.pong ? [h.pong] : [],
      message: h?.message ? [T.emit, h.message] : [T.emit],
      closed: h?.closed ? [h.closed] : [],
      error: h?.error ? [h.error] : []
    };
    return {
      onMessage: T.on,
      on(M, N) {
        const K = B[M];
        return K.push(N), () => {
          K.splice(K.indexOf(N), 1);
        };
      },
      emit(M, ...N) {
        for (const K of [...B[M]])
          K(...N);
      }
    };
  })();
  function p(T) {
    const B = [
      // errors are fatal and more critical than close events, throw them first
      S.on("error", (M) => {
        B.forEach((N) => N()), T(M);
      }),
      // closes can be graceful and not fatal, throw them second (if error didnt throw)
      S.on("closed", (M) => {
        B.forEach((N) => N()), T(M);
      })
    ];
  }
  let k, b = 0, I, H = !1, P = 0, ce = !1;
  async function L() {
    clearTimeout(I);
    const [T, B] = await (k ?? (k = new Promise(
      (K, ne) => (async () => {
        if (H) {
          if (await u(P), !b)
            return k = void 0, ne({ code: 1e3, reason: "All Subscriptions Gone" });
          P++;
        }
        S.emit("connecting", H);
        const U = new A(
          typeof e == "function" ? await e() : e,
          tl
        );
        let ze, lt;
        function Ot() {
          isFinite(o) && o > 0 && (clearTimeout(lt), lt = setTimeout(() => {
            U.readyState === A.OPEN && (U.send(gt({ type: pe.Ping })), S.emit("ping", !1, void 0));
          }, o));
        }
        p((G) => {
          k = void 0, clearTimeout(ze), clearTimeout(lt), ne(G), G instanceof Ur && (U.close(4499, "Terminated"), U.onerror = null, U.onclose = null);
        }), U.onerror = (G) => S.emit("error", G), U.onclose = (G) => S.emit("closed", G), U.onopen = async () => {
          try {
            S.emit("opened", U);
            const G = typeof t == "function" ? await t() : t;
            if (U.readyState !== A.OPEN) return;
            U.send(
              gt(
                G ? {
                  type: pe.ConnectionInit,
                  payload: G
                } : {
                  type: pe.ConnectionInit
                  // payload is completely absent if not provided
                },
                g
              )
            ), isFinite(c) && c > 0 && (ze = setTimeout(() => {
              U.close(
                fe.ConnectionAcknowledgementTimeout,
                "Connection acknowledgement timeout"
              );
            }, c)), Ot();
          } catch (G) {
            S.emit("error", G), U.close(
              fe.InternalClientError,
              Rr(
                G instanceof Error ? G.message : String(G),
                "Internal client error"
              )
            );
          }
        };
        let Je = !1;
        U.onmessage = ({ data: G }) => {
          try {
            const z = nl(G, w);
            if (S.emit("message", z), z.type === "ping" || z.type === "pong") {
              S.emit(z.type, !0, z.payload), z.type === "pong" ? Ot() : a || (U.send(
                gt(
                  z.payload ? {
                    type: pe.Pong,
                    payload: z.payload
                  } : {
                    type: pe.Pong
                    // payload is completely absent if not provided
                  }
                )
              ), S.emit("pong", !1, z.payload));
              return;
            }
            if (Je) return;
            if (z.type !== pe.ConnectionAck)
              throw new Error(
                `First message cannot be of type ${z.type}`
              );
            clearTimeout(ze), Je = !0, S.emit("connected", U, z.payload, H), H = !1, P = 0, K([
              U,
              new Promise((cl, Ss) => p(Ss))
            ]);
          } catch (z) {
            U.onmessage = null, S.emit("error", z), U.close(
              fe.BadResponse,
              Rr(
                z instanceof Error ? z.message : String(z),
                "Bad response"
              )
            );
          }
        };
      })()
    )));
    T.readyState === A.CLOSING && await B;
    let M = () => {
    };
    const N = new Promise((K) => M = K);
    return [
      T,
      M,
      Promise.race([
        // wait for
        N.then(() => {
          if (!b) {
            const K = () => T.close(1e3, "Normal Closure");
            isFinite(i) && i > 0 ? I = setTimeout(() => {
              T.readyState === A.OPEN && K();
            }, i) : K();
          }
        }),
        // or
        B
      ])
    ];
  }
  function _e(T) {
    if (Sn(T) && (sl(T.code) || [
      fe.InternalServerError,
      fe.InternalClientError,
      fe.BadRequest,
      fe.BadResponse,
      fe.Unauthorized,
      // CloseCode.Forbidden, might grant access out after retry
      fe.SubprotocolNotAcceptable,
      // CloseCode.ConnectionInitialisationTimeout, might not time out after retry
      // CloseCode.ConnectionAcknowledgementTimeout, might not time out after retry
      fe.SubscriberAlreadyExists,
      fe.TooManyInitialisationRequests
      // 4499, // Terminated, probably because the socket froze, we want to retry
    ].includes(T.code)))
      throw T;
    if (ce) return !1;
    if (Sn(T) && T.code === 1e3)
      return b > 0;
    if (!l || P >= l || !d(T)) throw T;
    return H = !0;
  }
  r || (async () => {
    for (b++; ; )
      try {
        const [, , T] = await L();
        await T;
      } catch (T) {
        try {
          if (!_e(T)) return;
        } catch (B) {
          return s?.(B);
        }
      }
  })();
  function Ve(T, B) {
    const M = y(T);
    let N = !1, K = !1, ne = () => {
      b--, N = !0;
    };
    return (async () => {
      for (b++; ; )
        try {
          const [U, ze, lt] = await L();
          if (N) return ze();
          const Ot = S.onMessage(M, (Je) => {
            switch (Je.type) {
              case pe.Next: {
                B.next(Je.payload);
                return;
              }
              case pe.Error: {
                K = !0, N = !0, B.error(Je.payload), ne();
                return;
              }
              case pe.Complete: {
                N = !0, ne();
                return;
              }
            }
          });
          U.send(
            gt(
              {
                id: M,
                type: pe.Subscribe,
                payload: T
              },
              g
            )
          ), ne = () => {
            !N && U.readyState === A.OPEN && U.send(
              gt(
                {
                  id: M,
                  type: pe.Complete
                },
                g
              )
            ), b--, N = !0, ze();
          }, await lt.finally(Ot);
          return;
        } catch (U) {
          if (!_e(U)) return;
        }
    })().then(() => {
      K || B.complete();
    }).catch((U) => {
      B.error(U);
    }), () => {
      N || ne();
    };
  }
  return {
    on: S.on,
    subscribe: Ve,
    iterate(T) {
      const B = [], M = {
        done: !1,
        error: null,
        resolve: () => {
        }
      }, N = Ve(T, {
        next(ne) {
          B.push(ne), M.resolve();
        },
        error(ne) {
          M.done = !0, M.error = ne, M.resolve();
        },
        complete() {
          M.done = !0, M.resolve();
        }
      }), K = async function* () {
        for (; ; ) {
          for (B.length || await new Promise((U) => M.resolve = U); B.length; )
            yield B.shift();
          if (M.error)
            throw M.error;
          if (M.done)
            return;
        }
      }();
      return K.throw = async (ne) => (M.done || (M.done = !0, M.error = ne, M.resolve()), { done: !0, value: void 0 }), K.return = async () => (N(), { done: !0, value: void 0 }), K;
    },
    async dispose() {
      if (ce = !0, k) {
        const [T] = await k;
        T.close(1e3, "Normal Closure");
      }
    },
    terminate() {
      k && S.emit("closed", new Ur());
    }
  };
}
class Ur extends Error {
  constructor() {
    super(...arguments);
    Ge(this, "name", "TerminatedCloseEvent");
    Ge(this, "message", "4499: Terminated");
    Ge(this, "code", 4499);
    Ge(this, "reason", "Terminated");
    Ge(this, "wasClean", !1);
  }
}
function Sn(n) {
  return Ke(n) && "code" in n && "reason" in n;
}
function sl(n) {
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
function il(n) {
  return typeof n == "function" && "constructor" in n && "CLOSED" in n && "CLOSING" in n && "CONNECTING" in n && "OPEN" in n;
}
function ol(n) {
  return {
    tag: 1,
    0: n
  };
}
function al(n) {
  return (e) => (t) => e((r) => {
    r === 0 || r.tag === 0 ? t(r) : t(ol(n(r[0])));
  });
}
var ll = (...n) => {
  for (var e = n[0], t = 1, r = n.length; t < r; t++)
    e = n[t](e);
  return e;
};
class ul {
  constructor({ serverUri: e, socket: t = null, encrypt: r = !1 }) {
    this.$__client = this.createUrqlClient({ serverUri: e, socket: t, encrypt: r }), this.$__authToken = "", this.$__pubkey = null, this.$__wallet = null, this.serverUri = e, this.soketi = t, this.cipherLink = !!r, this.$__subscriptionManager = /* @__PURE__ */ new Map();
  }
  createUrqlClient({ serverUri: e, socket: t, encrypt: r }) {
    const s = [Ho, Lo];
    if (t && t.socketUri) {
      const i = rl({
        url: t.socketUri,
        connectionParams: () => ({
          authToken: this.$__authToken
        })
      });
      s.push(Bo({
        forwardSubscription: (o) => ({
          subscribe: (a) => ({ unsubscribe: i.subscribe(o, a) })
        })
      }));
    }
    return Do({
      url: e,
      exchanges: s,
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
    const { query: t, variables: r } = e, s = await this.$__client.query(t, r).toPromise();
    return this.formatResponse(s);
  }
  async mutate(e) {
    const { mutation: t, variables: r } = e, s = await this.$__client.mutation(t, r).toPromise();
    return this.formatResponse(s);
  }
  subscribe(e, t) {
    const { query: r, variables: s, operationName: i } = e, { unsubscribe: o } = ll(
      this.$__client.subscription(r, s),
      al((a) => {
        t(this.formatResponse(a));
      })
    ).subscribe(() => {
    });
    return this.$__subscriptionManager.set(i, { unsubscribe: o }), {
      unsubscribe: () => this.unsubscribe(i)
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
class gl {
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
    socket: s = null,
    serverSdkVersion: i = 3,
    logging: o = !1
  }) {
    this.initialize({
      uri: e,
      cellSlug: t,
      socket: s,
      client: r,
      serverSdkVersion: i,
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
    client: s = null,
    serverSdkVersion: i = 3,
    logging: o = !1
  }) {
    this.reset(), this.$__logging = o, this.$__authTokenObjects = {}, this.$__authInProcess = !1, this.abortControllers = /* @__PURE__ */ new Map(), Zs({ enabled: o }), this.setUri(e), t && this.setCellSlug(t);
    for (const a in this.$__uris) {
      const c = this.$__uris[a];
      this.$__authTokenObjects[c] = null;
    }
    this.log("info", `KnishIOClient::initialize() - Initializing new Knish.IO client session for SDK version ${i}...`), this.$__client = s || new ul({
      socket: {
        socketUri: null,
        appKey: "knishio",
        ...r || {}
      },
      serverUri: this.getRandomUri()
    }), this.$__serverSdkVersion = i;
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
      throw new Ne("KnishIOClient::subscribe() - Socket client not initialized!");
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
    return this.log("info", `KnishIOClient::hashSecret(${t ? `source: ${t}` : ""}) - Computing wallet bundle from secret...`), nt(e);
  }
  /**
   * Retrieves the stored secret for this session
   *
   * @return {string}
   */
  getSecret() {
    if (!this.hasSecret())
      throw new _n("KnishIOClient::getSecret() - Unable to find a stored secret! Have you set a secret?");
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
      throw new _n("KnishIOClient::getBundle() - Unable to find a stored bundle! Have you set a secret?");
    return this.$__bundle;
  }
  /**
   * Retrieves the device fingerprint.
   *
   * @returns {Promise<string>} A promise that resolves to the device fingerprint as a string.
   */
  getFingerprint() {
    return Pa();
  }
  getFingerprintData() {
    return gs();
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
    return e ? e.key = R.generateKey({
      secret: this.getSecret(),
      token: e.token,
      position: e.position
    }) : e = new R({
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
    remainderWallet: s = null
  }) {
    return this.log("info", "KnishIOClient::createMolecule() - Creating a new molecule..."), e = e || this.getSecret(), t = t || this.getBundle(), !r && this.lastMoleculeQuery && this.getRemainderWallet().token === "USER" && this.lastMoleculeQuery.response() && this.lastMoleculeQuery.response().success() && (r = this.getRemainderWallet()), r === null && (r = await this.getSourceWallet()), this.remainderWallet = s || R.create({
      secret: e,
      bundle: t,
      token: "USER",
      batchId: r.batchId,
      characters: r.characters
    }), new Me({
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
    const r = t || await this.createMolecule({}), s = new e(this.client(), this, r);
    if (!(s instanceof Z))
      throw new Ne(`${this.constructor.name}::createMoleculeMutation() - This method only accepts MutationProposeMolecule!`);
    return this.lastMoleculeQuery = s, s;
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
    const r = new AbortController(), s = JSON.stringify({
      query: e.$__query,
      variables: t
    });
    this.abortControllers.set(s, r);
    try {
      const i = await e.execute({
        variables: t,
        context: {
          fetchOptions: {
            signal: r.signal
          }
        }
      });
      return this.abortControllers.delete(s), i;
    } catch (i) {
      if (i.name === "AbortError")
        this.log("warn", "Query was cancelled");
      else
        throw i;
    }
  }
  cancelQuery(e, t = null) {
    const r = JSON.stringify({
      query: e.$__query,
      variables: t
    }), s = this.abortControllers.get(r);
    s && (s.abort(), this.abortControllers.delete(r));
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
    const s = this.createQuery(Jo);
    return this.executeQuery(s, {
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
    const s = (await this.queryBalance({
      token: e,
      type: r
    })).payload();
    if (s === null || et.cmp(s.balance, t) < 0)
      throw new Ce();
    if (!s.position || !s.address)
      throw new Ce("Source wallet can not be a shadow wallet.");
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
    return await this.createSubscribe(ga).execute({
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
      throw new Ne(`${this.constructor.name}::subscribeWalletStatus() - Token parameter is required!`);
    return this.createSubscribe(wa).execute({
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
    return this.createSubscribe(ba).execute({
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
    return this.createSubscribe(va).execute({
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
    value: s = null,
    latest: i = !0,
    fields: o = null,
    filter: a = null,
    queryArgs: c = null,
    count: l = null,
    countBy: u = null,
    throughAtom: d = !0,
    values: h = null,
    keys: m = null,
    atomValues: y = null
  }) {
    this.log("info", `KnishIOClient::queryMeta() - Querying metaType: ${e}, metaId: ${t}...`);
    let g, w;
    return d ? (g = this.createQuery(Mr), w = Mr.createVariables({
      metaType: e,
      metaId: t,
      key: r,
      value: s,
      latest: i,
      filter: a,
      queryArgs: c,
      countBy: u,
      values: h,
      keys: m,
      atomValues: y
    })) : (g = this.createQuery(Ir), w = Ir.createVariables({
      metaType: e,
      metaId: t,
      key: r,
      value: s,
      latest: i,
      filter: a,
      queryArgs: c,
      count: l,
      countBy: u
    })), this.executeQuery(g, w).then((v) => v.payload());
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
    const t = this.createQuery(It);
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
    const t = this.createQuery(Xo);
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
    bundleHash: s,
    positions: i,
    position: o,
    walletAddresses: a,
    walletAddress: c,
    isotopes: l,
    isotope: u,
    tokenSlugs: d,
    tokenSlug: h,
    cellSlugs: m,
    cellSlug: y,
    batchIds: g,
    batchId: w,
    values: v,
    value: A,
    metaTypes: S,
    metaType: p,
    metaIds: k,
    metaId: b,
    indexes: I,
    index: H,
    filter: P,
    latest: ce,
    queryArgs: L = {
      limit: 15,
      offset: 1
    }
  }) {
    this.log("info", "KnishIOClient::queryAtom() - Querying atom instances");
    const _e = this.createQuery(Cr);
    return await this.executeQuery(_e, Cr.createVariables({
      molecularHashes: e,
      molecularHash: t,
      bundleHashes: r,
      bundleHash: s,
      positions: i,
      position: o,
      walletAddresses: a,
      walletAddress: c,
      isotopes: l,
      isotope: u,
      tokenSlugs: d,
      tokenSlug: h,
      cellSlugs: m,
      cellSlug: y,
      batchIds: g,
      batchId: w,
      values: v,
      value: A,
      metaTypes: S,
      metaType: p,
      metaIds: k,
      metaId: b,
      indexes: I,
      index: H,
      filter: P,
      latest: ce,
      queryArgs: L
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
    const t = new R({
      secret: this.getSecret(),
      token: e
    }), r = await this.createMoleculeMutation({
      mutationClass: fa
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
    const s = this.createQuery(xa);
    return await this.executeQuery(s, {
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
    ipAddress: s,
    browser: i,
    osCpu: o,
    resolution: a,
    timeZone: c,
    countBy: l,
    interval: u
  }) {
    const d = this.createQuery($a);
    return await this.executeQuery(d, {
      bundleHash: e,
      metaType: t,
      metaId: r,
      ipAddress: s,
      browser: i,
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
    ipAddress: s,
    browser: i,
    osCpu: o,
    resolution: a,
    timeZone: c,
    json: l = {}
  }) {
    const u = this.createQuery(Sa);
    return await this.executeQuery(u, {
      bundleHash: e,
      metaType: t,
      metaId: r,
      ipAddress: s,
      browser: i,
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
    batchId: s = null,
    units: i = []
  }) {
    const o = F.get(r || {}, "fungibility");
    if (o === "stackable" && (r.batchId = s || Vt({})), ["nonfungible", "stackable"].includes(o) && i.length > 0) {
      if (F.get(r || {}, "decimals") > 0)
        throw new ma();
      if (t > 0)
        throw new Ht();
      t = i.length, r.splittable = 1, r.decimals = 0, r.tokenUnits = JSON.stringify(i);
    }
    const a = new R({
      secret: this.getSecret(),
      bundle: this.getBundle(),
      token: e,
      batchId: s
    }), c = await this.createMoleculeMutation({
      mutationClass: ta
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
    policy: s = {}
  }) {
    const i = await this.createMoleculeMutation(
      {
        mutationClass: Na,
        molecule: await this.createMolecule({
          secret: this.getSecret(),
          sourceWallet: await this.getSourceWallet()
        })
      }
    );
    return i.fillMolecule({
      metaType: e,
      metaId: t,
      rule: r,
      policy: s
    }), await this.executeQuery(i);
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
    meta: r = null,
    policy: s = {}
  }) {
    const i = await this.createMoleculeMutation(
      {
        mutationClass: ha,
        molecule: await this.createMolecule({
          secret: this.getSecret(),
          sourceWallet: await this.getSourceWallet()
        })
      }
    ), o = r || {};
    return i.fillMolecule({
      metaType: e,
      metaId: t,
      meta: o,
      policy: s
    }), await this.executeQuery(i);
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
    const s = await this.createMoleculeMutation({
      mutationClass: aa
    });
    return s.fillMolecule({
      type: e,
      contact: t,
      code: r
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
    policy: r = {}
  }) {
    const s = await this.createMolecule({});
    s.addPolicyAtom({
      metaType: e,
      metaId: t,
      meta: {},
      policy: r
    }), s.addContinuIdAtom(), s.sign({
      bundle: this.getBundle()
    }), s.check();
    const i = await this.createMoleculeMutation({
      mutationClass: Z,
      molecule: s
    });
    return await this.executeQuery(i);
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
    const r = this.createQuery(Ca);
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
    const s = this.createQuery(Vo);
    return this.executeQuery(s, {
      bundleHash: e || this.getBundle(),
      tokenSlug: t,
      unspent: r
    }).then((i) => i.payload());
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
    const s = this.createQuery(Qo);
    return this.executeQuery(s, { bundleHashes: e }).then((i) => r ? i : i.payload());
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
    const t = this.createQuery(Wo);
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
    units: s = [],
    meta: i = null,
    batchId: o = null
  }) {
    let a, c;
    i = i || {};
    const l = this.createQuery(Ia), u = await this.executeQuery(l, {
      slug: e
    }), d = F.get(u.data(), "0.fungibility") === "stackable";
    if (!d && o !== null)
      throw new Kt("Expected Batch ID = null for non-stackable tokens.");
    if (d && o === null && (o = Vt({})), s.length > 0) {
      if (r > 0)
        throw new Ht();
      r = s.length, i.tokenUnits = JSON.stringify(s);
    }
    t ? (Object.prototype.toString.call(t) === "[object String]" && (R.isBundleHash(t) ? (a = "walletBundle", c = t) : t = R.create({
      secret: t,
      token: e
    })), t instanceof R && (a = "wallet", i.position = t.position, i.bundle = t.bundle, c = t.address)) : (a = "walletBundle", c = this.getBundle());
    const h = await this.createMoleculeMutation({
      mutationClass: ra
    });
    return h.fillMolecule({
      token: e,
      amount: r,
      metaType: a,
      metaId: c,
      meta: i,
      batchId: o
    }), await this.executeQuery(h);
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
    const s = await this.createMoleculeMutation({
      mutationClass: ua,
      molecule: r
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
      throw new Er();
    t.forEach((s) => {
      if (!s.isShadow())
        throw new Er();
    });
    const r = [];
    for (const s of t)
      r.push(await this.claimShadowWallet({
        token: e,
        batchId: s.batchId
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
    units: s = [],
    batchId: i = null,
    sourceWallet: o = null
  }) {
    if (s.length > 0) {
      if (r > 0)
        throw new Ht();
      r = s.length;
    }
    if (o === null && (o = await this.querySourceWallet({
      token: t,
      amount: r
    })), o === null || et.cmp(o.balance, r) < 0)
      throw new Ce();
    const a = R.create({
      bundle: e,
      token: t
    });
    i !== null ? a.batchId = i : a.initBatchId({
      sourceWallet: o
    });
    const c = o.createRemainder(this.getSecret());
    o.splitUnits(
      s,
      c,
      a
    );
    const l = await this.createMolecule({
      sourceWallet: o,
      remainderWallet: c
    }), u = await this.createMoleculeMutation({
      mutationClass: ia,
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
    sourceWallet: s = null
  }) {
    s === null && (s = await this.querySourceWallet({
      token: e,
      amount: t
    }));
    const i = s.createRemainder(this.getSecret()), o = await this.createMolecule({
      sourceWallet: s,
      remainderWallet: i
    }), a = await this.createMoleculeMutation({
      mutationClass: Ra,
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
    signingWallet: s = null
  }) {
    r === null && (r = await this.querySourceWallet({
      token: e,
      amount: t,
      type: "buffer"
    }));
    const i = r, o = await this.createMolecule({
      sourceWallet: r,
      remainderWallet: i
    }), a = await this.createMoleculeMutation({
      mutationClass: Ua,
      molecule: o
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
    units: r = [],
    sourceWallet: s = null
  }) {
    s === null && (s = await this.querySourceWallet({
      token: e,
      amount: t
    }));
    const i = s.createRemainder(this.getSecret());
    if (r.length > 0) {
      if (t > 0)
        throw new Ht();
      t = r.length, s.splitUnits(
        r,
        i
      );
    }
    const o = await this.createMolecule({
      sourceWallet: s,
      remainderWallet: i
    });
    o.burnToken({ amount: t }), o.sign({
      bundle: this.getBundle()
    }), o.check();
    const a = await this.createMoleculeMutation({
      mutationClass: Z,
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
    sourceWallet: s = null
  }) {
    if (s === null && (s = (await this.queryBalance({ token: e })).payload()), !s)
      throw new Ce("Source wallet is missing or invalid.");
    const i = s.createRemainder(this.getSecret()), o = await this.createMolecule({
      sourceWallet: s,
      remainderWallet: i
    });
    o.replenishToken({
      amount: t,
      units: r
    }), o.sign({
      bundle: this.getBundle()
    }), o.check();
    const a = await this.createMoleculeMutation({
      mutationClass: Z,
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
    fusedTokenUnitIds: s,
    sourceWallet: i = null
  }) {
    if (i === null && (i = (await this.queryBalance({ token: t })).payload()), i === null)
      throw new Ce("Source wallet is missing or invalid.");
    if (!i.tokenUnits || !i.tokenUnits.length)
      throw new Ce("Source wallet does not have token units.");
    if (!s.length)
      throw new Ce("Fused token unit list is empty.");
    const o = [];
    i.tokenUnits.forEach((d) => {
      o.push(d.id);
    }), s.forEach((d) => {
      if (!o.includes(d))
        throw new Ce(`Fused token unit ID = ${d} does not found in the source wallet.`);
    });
    const a = R.create({
      bundle: e,
      token: t
    });
    a.initBatchId({ sourceWallet: i });
    const c = i.createRemainder(this.getSecret());
    i.splitUnits(s, c), r.metas.fusedTokenUnits = i.getTokenUnitsData(), a.tokenUnits = [r];
    const l = await this.createMolecule({
      sourceWallet: i,
      remainderWallet: c
    });
    l.fuseToken(i.tokenUnits, a), l.sign({
      bundle: this.getBundle()
    }), l.check();
    const u = await this.createMoleculeMutation({
      mutationClass: Z,
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
    const r = new R({
      secret: xn(await this.getFingerprint()),
      token: "AUTH"
    }), s = await this.createQuery(ya), i = {
      cellSlug: e,
      pubkey: r.pubkey,
      encrypt: t
    }, o = await s.execute({ variables: i });
    if (o.success()) {
      const a = _t.create(o.payload(), r);
      this.setAuthToken(a);
    } else
      throw new Tr(`KnishIOClient::requestGuestAuthToken() - Authorization attempt rejected by ledger. Reason: ${o.reason()}`);
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
    const r = new R({
      secret: e,
      token: "AUTH"
    }), s = await this.createMolecule({
      secret: e,
      sourceWallet: r
    }), i = await this.createMoleculeMutation({
      mutationClass: Zo,
      molecule: s
    });
    i.fillMolecule({ meta: { encrypt: t ? "true" : "false" } });
    const o = await i.execute({});
    if (o.success()) {
      const a = _t.create(o.payload(), r);
      this.setAuthToken(a);
    } else
      throw new Tr(`KnishIOClient::requestProfileAuthToken() - Authorization attempt rejected by ledger. Reason: ${o.reason()}`);
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
    encrypt: s = !1
  }) {
    if (this.$__serverSdkVersion < 3)
      return this.log("warn", "KnishIOClient::authorize() - Server SDK version does not require an authorization..."), null;
    e === null && t && (e = xn(t)), r && this.setCellSlug(r), this.$__authInProcess = !0;
    let i;
    return e ? i = await this.requestProfileAuthToken({
      secret: e,
      encrypt: s
    }) : i = await this.requestGuestAuthToken({
      cellSlug: r,
      encrypt: s
    }), this.log("info", `KnishIOClient::authorize() - Successfully retrieved auth token ${this.$__authToken.getToken()}...`), this.switchEncryption(s), this.$__authInProcess = !1, i;
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
  C as Atom,
  ae as AtomMeta,
  We as AtomsMissingException,
  q as BaseException,
  gl as KnishIOClient,
  rt as Meta,
  Me as Molecule,
  Gi as SignatureMismatchException,
  Ce as TransferBalanceException,
  R as Wallet,
  ri as WalletCredentialException,
  Ts as base64ToHex,
  $s as bufferToHexString,
  _s as charsetBaseConvert,
  jt as chunkSubstr,
  gl as default,
  nt as generateBundleHash,
  xn as generateSecret,
  Is as hexStringToBuffer,
  Es as hexToBase64,
  Cs as isHex,
  Mn as randomString
};
//# sourceMappingURL=client.es.mjs.map
