!(function () { /*

 Copyright (C) 2006 Google Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
typeof window !== 'undefined' && (window.PR_SHOULD_USE_CONTINUATION = !0);
(function () {
 function T (a) {
 function d (e) { let a = e.charCodeAt(0); if (a !== 92) return a; const c = e.charAt(1); return (a = w[c]) ? a : c >= '0' && c <= '7' ? parseInt(e.substring(1), 8) : c === 'u' || c === 'x' ? parseInt(e.substring(2), 16) : e.charCodeAt(1) } function f (e) { if (e < 32) return (e < 16 ? '\\x0' : '\\x') + e.toString(16); e = String.fromCharCode(e); return e === '\\' || e === '-' || e === ']' || e === '^' ? `\\${ e}` : e } function c (e) {
 let c = e.substring(1, e.length - 1).match(RegExp('\\\\u[0-9A-Fa-f]{4}|\\\\x[0-9A-Fa-f]{2}|\\\\[0-3][0-7]{0,2}|\\\\[0-7]{1,2}|\\\\[\\s\\S]|-|[^-\\\\]', 'g'))
e = []; var a = c[0] === '^'; const b = ['[']; a && b.push('^'); for (var a = a ? 1 : 0, g = c.length; a < g; ++a) { var h = c[a]; if (/\\[bdsw]/i.test(h))b.push(h); else { var h = d(h); var k; a + 2 < g && c[a + 1] === '-' ? (k = d(c[a + 2]), a += 2) : k = h; e.push([h, k]); k < 65 || h > 122 || (k < 65 || h > 90 || e.push([Math.max(65, h) | 32, Math.min(k, 90) | 32]), k < 97 || h > 122 || e.push([Math.max(97, h) & -33, Math.min(k, 122) & -33])) } }e.sort(function (e, a) { return e[0] - a[0] || a[1] - e[1] }); c = []; g = []; for (a = 0; a < e.length; ++a)h = e[a], h[0] <= g[1] + 1 ? g[1] = Math.max(g[1], h[1]) : c.push(g = h); for (a = 0; a < c.length; ++a) {
 h =
c[a], b.push(f(h[0])), h[1] > h[0] && (h[1] + 1 > h[0] && b.push('-'), b.push(f(h[1])))
}b.push(']'); return b.join('')
} function m (e) {
 for (var a = e.source.match(RegExp('(?:\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]|\\\\u[A-Fa-f0-9]{4}|\\\\x[A-Fa-f0-9]{2}|\\\\[0-9]+|\\\\[^ux0-9]|\\(\\?[:!=]|[\\(\\)\\^]|[^\\x5B\\x5C\\(\\)\\^]+)', 'g')), b = a.length, d = [], g = 0, h = 0; g < b; ++g) { var k = a[g]; k === '(' ? ++h : k.charAt(0) === '\\' && (k = +k.substring(1)) && (k <= h ? d[k] = -1 : a[g] = f(k)) } for (g = 1; g < d.length; ++g)d[g] === -1 && (d[g] = ++E); for (h = g = 0; g < b; ++g) {
 k = a[g],
k === '(' ? (++h, d[h] || (a[g] = '(?:')) : k.charAt(0) === '\\' && (k = +k.substring(1)) && k <= h && (a[g] = `\\${ d[k]}`)
} for (g = 0; g < b; ++g)a[g] === '^' && a[g + 1] !== '^' && (a[g] = ''); if (e.ignoreCase && q) for (g = 0; g < b; ++g)k = a[g], e = k.charAt(0), k.length >= 2 && e === '[' ? a[g] = c(k) : e !== '\\' && (a[g] = k.replace(/[a-zA-Z]/g, function (a) { a = a.charCodeAt(0); return `[${ String.fromCharCode(a & -33, a | 32) }]` })); return a.join('')
} for (var E = 0, q = !1, l = !1, n = 0, b = a.length; n < b; ++n) {
 var p = a[n]; if (p.ignoreCase)l = !0; else if (/[a-z]/i.test(p.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi,
''))) { q = !0; l = !1; break }
} for (var w = { b: 8, t: 9, n: 10, v: 11, f: 12, r: 13 }, r = [], n = 0, b = a.length; n < b; ++n) { p = a[n]; if (p.global || p.multiline) throw Error(`${p}`); r.push(`(?:${m(p) })`) } return new RegExp(r.join('|'), l ? 'gi' : 'g')
} function U (a, d) {
 function f (a) {
 let b = a.nodeType; if (b == 1) { if (!c.test(a.className)) { for (b = a.firstChild; b; b = b.nextSibling)f(b); b = a.nodeName.toLowerCase(); if (b === 'br' || b === 'li')m[l] = '\n', q[l << 1] = E++, q[l++ << 1 | 1] = a } } else if (b == 3 || b == 4) {
 b = a.nodeValue, b.length && (b = d
? b.replace(/\r\n?/g, '\n')
: b.replace(/[ \t\r\n]+/g,
' '), m[l] = b, q[l << 1] = E, E += b.length, q[l++ << 1 | 1] = a)
}
} var c = /(?:^|\s)nocode(?:\s|$)/; var m = []; var E = 0; var q = []; var l = 0; f(a); return { a: m.join('').replace(/\n$/, ''), c: q }
} function J (a, d, f, c, m) { f && (a = { h: a, l: 1, j: null, m: null, a: f, c: null, i: d, g: null }, c(a), m.push.apply(m, a.g)) } function V (a) { for (var d = void 0, f = a.firstChild; f; f = f.nextSibling) var c = f.nodeType, d = c === 1 ? d ? a : f : c === 3 ? W.test(f.nodeValue) ? a : d : d; return d === a ? void 0 : d } function G (a, d) {
 function f (a) {
 for (var l = a.i, n = a.h, b = [l, 'pln'], p = 0, q = a.a.match(m) || [], r = {}, e = 0, t = q.length; e <
t; ++e) {
 const z = q[e]; let v = r[z]; let g = void 0; var h; if (typeof v === 'string')h = !1; else { var k = c[z.charAt(0)]; if (k)g = z.match(k[1]), v = k[0]; else { for (h = 0; h < E; ++h) if (k = d[h], g = z.match(k[1])) { v = k[0]; break }g || (v = 'pln') }!(h = v.length >= 5 && v.substring(0, 5) === 'lang-') || g && typeof g[1] === 'string' || (h = !1, v = 'src'); h || (r[z] = v) }k = p; p += z.length; if (h) { h = g[1]; let A = z.indexOf(h); let C = A + h.length; g[2] && (C = z.length - g[2].length, A = C - h.length); v = v.substring(5); J(n, l + k, z.substring(0, A), f, b); J(n, l + k + A, h, K(v, h), b); J(n, l + k + C, z.substring(C), f, b) } else {
 b.push(l +
k, v)
}
}a.g = b
} var c = {}; let m; (function () { for (var f = a.concat(d), l = [], n = {}, b = 0, p = f.length; b < p; ++b) { let w = f[b]; let r = w[3]; if (r) for (let e = r.length; --e >= 0;)c[r.charAt(e)] = w; w = w[1]; r = `${ w}`; n.hasOwnProperty(r) || (l.push(w), n[r] = null) }l.push(/[\0-\uffff]/); m = T(l) })(); var E = d.length; return f
} function x (a) {
 const d = []; const f = []; a.tripleQuotedStrings
? d.push(['str', /^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/,
null, '\'"'])
: a.multiLineStrings ? d.push(['str', /^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/, null, '\'"`']) : d.push(['str', /^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/, null, '"\'']); a.verbatimStrings && f.push(['str', /^@\"(?:[^\"]|\"\")*(?:\"|$)/, null]); let c = a.hashComments; c && (a.cStyleComments
? (c > 1
? d.push(['com', /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, null, '#'])
: d.push(['com', /^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\r\n]*)/,
null, '#']), f.push(['str', /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/, null]))
: d.push(['com', /^#[^\r\n]*/, null, '#'])); a.cStyleComments && (f.push(['com', /^\/\/[^\r\n]*/, null]), f.push(['com', /^\/\*[\s\S]*?(?:\*\/|$)/, null])); if (c = a.regexLiterals) {
 const m = (c = c > 1 ? '' : '\n\r') ? '.' : '[\\S\\s]'; f.push(['lang-regex', RegExp('^(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*(' +
`/(?=[^/*${c }])(?:[^/\\x5B\\x5C${ c }]|\\x5C${ m }|\\x5B(?:[^\\x5C\\x5D${ c }]|\\x5C${ m })*(?:\\x5D|$))+/` + ')')])
}(c = a.types) && f.push(['typ', c]); c = (`${a.keywords}`).replace(/^ | $/g, ''); c.length && f.push(['kwd', new RegExp(`^(?:${c.replace(/[\s,]+/g, '|') })\\b`), null]); d.push(['pln', /^\s+/, null, ' \r\n\t\u00a0']); c = '^.[^\\s\\w.$@\'"`/\\\\]*'; a.regexLiterals && (c += '(?!s*/)'); f.push(['lit', /^@[a-z_$][a-z_$@0-9]*/i, null], ['typ', /^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/, null], ['pln', /^[a-z_$][a-z_$@0-9]*/i,
null], ['lit', /^(?:0x[a-f0-9]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+\-]?\d+)?)[a-z]*/i, null, '0123456789'], ['pln', /^\\[\s\S]?/, null], ['pun', new RegExp(c), null]); return G(d, f)
} function L (a, d, f) {
 function c (a) {
 let b = a.nodeType; if (b == 1 && !t.test(a.className)) if (a.nodeName.toLowerCase() === 'br')m(a), a.parentNode && a.parentNode.removeChild(a); else for (a = a.firstChild; a; a = a.nextSibling)c(a); else if ((b == 3 || b == 4) && f) {
 let e = a.nodeValue; const d = e.match(q); d && (b = e.substring(0, d.index), a.nodeValue = b, (e = e.substring(d.index +
d[0].length)) && a.parentNode.insertBefore(l.createTextNode(e), a.nextSibling), m(a), b || a.parentNode.removeChild(a))
}
} function m (a) { function c (a, b) { const e = b ? a.cloneNode(!1) : a; var k = a.parentNode; if (k) { var k = c(k, 1); let d = a.nextSibling; k.appendChild(e); for (let f = d; f; f = d)d = f.nextSibling, k.appendChild(f) } return e } for (;!a.nextSibling;) if (a = a.parentNode, !a) return; a = c(a.nextSibling, 0); for (var e; (e = a.parentNode) && e.nodeType === 1;)a = e; b.push(a) } for (var t = /(?:^|\s)nocode(?:\s|$)/, q = /\r\n?|\n/, l = a.ownerDocument, n = l.createElement('li'); a.firstChild;)n.appendChild(a.firstChild)
for (var b = [n], p = 0; p < b.length; ++p)c(b[p]); d === (d | 0) && b[0].setAttribute('value', d); const w = l.createElement('ol'); w.className = 'linenums'; d = Math.max(0, d - 1 | 0) || 0; for (var p = 0, r = b.length; p < r; ++p)n = b[p], n.className = `L${ (p + d) % 10}`, n.firstChild || n.appendChild(l.createTextNode('\u00a0')), w.appendChild(n); a.appendChild(w)
} function t (a, d) { for (let f = d.length; --f >= 0;) { const c = d[f]; I.hasOwnProperty(c) ? D.console && console.warn('cannot override language handler %s', c) : I[c] = a } } function K (a, d) {
 a && I.hasOwnProperty(a) || (a = /^\s*</.test(d)
? 'default-markup'
: 'default-code'); return I[a]
} function M (a) {
 var d = a.j; try {
 var f = U(a.h, a.l); var c = f.a; a.a = c; a.c = f.c; a.i = 0; K(d, c)(a); var m = /\bMSIE\s(\d+)/.exec(navigator.userAgent); var m = m && +m[1] <= 8; var d = /\n/g; const t = a.a; const q = t.length; var f = 0; const l = a.c; const n = l.length; var c = 0; const b = a.g; let p = b.length; let w = 0; b[p] = q; let r, e; for (e = r = 0; e < p;)b[e] !== b[e + 2] ? (b[r++] = b[e++], b[r++] = b[e++]) : e += 2; p = r; for (e = r = 0; e < p;) { for (var x = b[e], z = b[e + 1], v = e + 2; v + 2 <= p && b[v + 1] === z;)v += 2; b[r++] = x; b[r++] = z; e = v }b.length = r; const g = a.h; a = ''; g && (a = g.style.display, g.style.display = 'none')
try { for (;c < n;) { const h = l[c + 2] || q; const k = b[w + 2] || q; var v = Math.min(h, k); let A = l[c + 1]; var C; if (A.nodeType !== 1 && (C = t.substring(f, v))) { m && (C = C.replace(d, '\r')); A.nodeValue = C; const N = A.ownerDocument; const u = N.createElement('span'); u.className = b[w + 1]; const B = A.parentNode; B.replaceChild(u, A); u.appendChild(A); f < h && (l[c + 1] = A = N.createTextNode(t.substring(v, h)), B.insertBefore(A, u.nextSibling)) }f = v; f >= h && (c += 2); f >= k && (w += 2) } } finally { g && (g.style.display = a) }
} catch (y) { D.console && console.log(y && y.stack || y) }
} var D = typeof window !== 'undefined'
? window
: {}; var B = ['break,continue,do,else,for,if,return,while']; var F = [[B, 'auto,case,char,const,default,double,enum,extern,float,goto,inline,int,long,register,restrict,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile'], 'catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof']; var H = [F, 'alignas,alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,delegate,dynamic_cast,explicit,export,friend,generic,late_check,mutable,namespace,noexcept,noreturn,nullptr,property,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where']
const O = [F, 'abstract,assert,boolean,byte,extends,finally,final,implements,import,instanceof,interface,null,native,package,strictfp,super,synchronized,throws,transient']; const P = [F, 'abstract,add,alias,as,ascending,async,await,base,bool,by,byte,checked,decimal,delegate,descending,dynamic,event,finally,fixed,foreach,from,get,global,group,implicit,in,interface,internal,into,is,join,let,lock,null,object,out,override,orderby,params,partial,readonly,ref,remove,sbyte,sealed,select,set,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,value,var,virtual,where,yield']
var F = [F, 'abstract,async,await,constructor,debugger,enum,eval,export,from,function,get,import,implements,instanceof,interface,let,null,of,set,undefined,var,with,yield,Infinity,NaN']; const Q = [B, 'and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None']; const R = [B, 'alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END']
var B = [B, 'case,done,elif,esac,eval,fi,function,in,local,set,then,until']; const S = /^(DIR|FILE|array|vector|(de|priority_)?queue|(forward_)?list|stack|(const_)?(reverse_)?iterator|(unordered_)?(multi)?(set|map)|bitset|u?(int|float)\d*)\b/; var W = /\S/; const X = x({ keywords: [H, P, O, F, 'caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END', Q, R, B], hashComments: !0, cStyleComments: !0, multiLineStrings: !0, regexLiterals: !0 })
var I = {}; t(X, ['default-code']); t(G([], [['pln', /^[^<?]+/], ['dec', /^<!\w[^>]*(?:>|$)/], ['com', /^<\!--[\s\S]*?(?:-\->|$)/], ['lang-', /^<\?([\s\S]+?)(?:\?>|$)/], ['lang-', /^<%([\s\S]+?)(?:%>|$)/], ['pun', /^(?:<[%?]|[%?]>)/], ['lang-', /^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i], ['lang-js', /^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i], ['lang-css', /^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i], ['lang-in.tag', /^(<\/?[a-z][^<>]*>)/i]]), 'default-markup htm html mxml xhtml xml xsl'.split(' ')); t(G([['pln', /^[\s]+/,
null, ' \t\r\n'], ['atv', /^(?:\"[^\"]*\"?|\'[^\']*\'?)/, null, '"\'']], [['tag', /^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i], ['atn', /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i], ['lang-uq.val', /^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/], ['pun', /^[=<>\/]+/], ['lang-js', /^on\w+\s*=\s*\"([^\"]+)\"/i], ['lang-js', /^on\w+\s*=\s*\'([^\']+)\'/i], ['lang-js', /^on\w+\s*=\s*([^\"\'>\s]+)/i], ['lang-css', /^style\s*=\s*\"([^\"]+)\"/i], ['lang-css', /^style\s*=\s*\'([^\']+)\'/i], ['lang-css', /^style\s*=\s*([^\"\'>\s]+)/i]]), ['in.tag'])
t(G([], [['atv', /^[\s\S]+/]]), ['uq.val']); t(x({ keywords: H, hashComments: !0, cStyleComments: !0, types: S }), 'c cc cpp cxx cyc m'.split(' ')); t(x({ keywords: 'null,true,false' }), ['json']); t(x({ keywords: P, hashComments: !0, cStyleComments: !0, verbatimStrings: !0, types: S }), ['cs']); t(x({ keywords: O, cStyleComments: !0 }), ['java']); t(x({ keywords: B, hashComments: !0, multiLineStrings: !0 }), ['bash', 'bsh', 'csh', 'sh']); t(x({ keywords: Q, hashComments: !0, multiLineStrings: !0, tripleQuotedStrings: !0 }), ['cv', 'py', 'python']); t(x({
keywords: 'caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END',
hashComments: !0,
multiLineStrings: !0,
regexLiterals: 2
}), ['perl', 'pl', 'pm']); t(x({ keywords: R, hashComments: !0, multiLineStrings: !0, regexLiterals: !0 }), ['rb', 'ruby']); t(x({ keywords: F, cStyleComments: !0, regexLiterals: !0 }), ['javascript', 'js', 'ts', 'typescript']); t(x({
keywords: 'all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,throw,true,try,unless,until,when,while,yes',
hashComments: 3,
cStyleComments: !0,
multilineStrings: !0,
tripleQuotedStrings: !0,
regexLiterals: !0
}), ['coffee']); t(G([], [['str', /^[\s\S]+/]]), ['regex']); const Y = D.PR = {
createSimpleLexer: G,
registerLangHandler: t,
sourceDecorator: x,
PR_ATTRIB_NAME: 'atn',
PR_ATTRIB_VALUE: 'atv',
PR_COMMENT: 'com',
PR_DECLARATION: 'dec',
PR_KEYWORD: 'kwd',
PR_LITERAL: 'lit',
PR_NOCODE: 'nocode',
PR_PLAIN: 'pln',
PR_PUNCTUATION: 'pun',
PR_SOURCE: 'src',
PR_STRING: 'str',
PR_TAG: 'tag',
PR_TYPE: 'typ',
prettyPrintOne: D.prettyPrintOne = function (a, d, f) {
 f = f || !1; d = d || null; let c = document.createElement('div'); c.innerHTML = `<pre>${ a }</pre>`
c = c.firstChild; f && L(c, f, !0); M({ j: d, m: f, h: c, l: 1, a: null, i: null, c: null, g: null }); return c.innerHTML
},
prettyPrint: D.prettyPrint = function (a, d) {
 function f () {
 for (let c = D.PR_SHOULD_USE_CONTINUATION ? b.now() + 250 : Infinity; p < x.length && b.now() < c; p++) {
 for (var d = x[p], l = g, n = d; n = n.previousSibling;) { var m = n.nodeType; var u = (m === 7 || m === 8) && n.nodeValue; if (u ? !/^\??prettify\b/.test(u) : m !== 3 || /\S/.test(n.nodeValue)) break; if (u) { l = {}; u.replace(/\b(\w+)=([\w:.%+-]+)/g, function (a, b, c) { l[b] = c }); break } }n = d.className; if ((l !== g || r.test(n)) &&
!e.test(n)) {
 m = !1; for (u = d.parentNode; u; u = u.parentNode) if (v.test(u.tagName) && u.className && r.test(u.className)) { m = !0; break } if (!m) {
 d.className += ' prettyprinted'; m = l.lang; if (!m) { var m = n.match(w); var q; !m && (q = V(d)) && z.test(q.tagName) && (m = q.className.match(w)); m && (m = m[1]) } if (B.test(d.tagName))u = 1; else var u = d.currentStyle, y = t.defaultView, u = (u = u ? u.whiteSpace : y && y.getComputedStyle ? y.getComputedStyle(d, null).getPropertyValue('white-space') : 0) && u.substring(0, 3) === 'pre'; y = l.linenums; (y = y === 'true' || +y) || (y = (y = n.match(/\blinenums\b(?::(\d+))?/))
? y[1] && y[1].length ? +y[1] : !0
: !1); y && L(d, y, u); M({ j: m, h: d, m: y, l: u, a: null, i: null, c: null, g: null })
}
}
}p < x.length ? D.setTimeout(f, 250) : typeof a === 'function' && a()
} for (var c = d || document.body, t = c.ownerDocument || document, c = [c.getElementsByTagName('pre'), c.getElementsByTagName('code'), c.getElementsByTagName('xmp')], x = [], q = 0; q < c.length; ++q) for (let l = 0, n = c[q].length; l < n; ++l)x.push(c[q][l]); var c = null; var b = Date; b.now || (b = { now: function () { return +new Date() } }); var p = 0; var w = /\blang(?:uage)?-([\w.]+)(?!\S)/; var r = /\bprettyprint\b/
var e = /\bprettyprinted\b/; var B = /pre|xmp/i; var z = /^code$/i; var v = /^(?:pre|code|xmp)$/i; var g = {}; f()
}
}; var H = D.define; typeof H === 'function' && H.amd && H('google-code-prettify', [], function () { return Y })
})()
}())
