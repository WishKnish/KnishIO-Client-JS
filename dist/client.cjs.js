"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("js-sha3"),t=require("big-integer"),s=require("@stablelib/base64"),n=require("big-integer/BigInteger"),r=require("base-x"),l=require("buffer"),i=require("tweetnacl"),a=require("tweetnacl-sealedbox-js"),o=require("@stablelib/utf8"),u=require("servie"),c=require("popsicle");function h(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var d=h(t),p=h(n),m=h(r);class f{static toHex(e,t){const s=(e,t)=>{const s=t?["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"]:["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];return s[Math.floor(e/16)]+s[e%16]},n=Object.assign({grouping:0,rowlength:0,uppercase:!1},t||{});let r="",l=0,i=0;for(let t=0;t<e.length&&(r+=s(e[t],n.uppercase),t!==e.length-1);++t)n.grouping>0&&++l===n.grouping&&(l=0,n.rowlength>0&&++i===n.rowlength?(i=0,r+="\n"):r+=" ");return r}static toUint8Array(e){let t=e.toLowerCase().replace(/\s/g,"");t.length%2==1&&(t="0"+t);let s=new Uint8Array(Math.floor(t.length/2)),n=-1;for(let e=0;e<t.length;++e){let r=t[e],l=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"].indexOf(r);if(-1===l)throw Error("unexpected character");-1===n?n=16*l:(s[Math.floor(e/2)]=n+l,n=-1)}return s}}function g(e,t){const s=Math.ceil(e.length/t),n=new Array(s);for(let r=0,l=0;r<s;++r,l+=t)n[r]=e.substr(l,t);return n}function y(e=256,t="abcdef0123456789"){let s=new Uint8Array(e);return(window.crypto||window.msCrypto).getRandomValues(s),s=s.map(e=>t.charCodeAt(e%t.length)),String.fromCharCode.apply(null,s)}function w(e,t,s,n,r){if(n=n||"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~`!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?¿¡",r=r||n,t>n.length||s>r.length)return console.warn("Can't convert",e,"to base",s,"greater than symbol table length. src-table:",n.length,"dest-table:",r.length),!1;let l=d.default(0);for(let s=0;s<e.length;s++)l=l.multiply(t).add(n.indexOf(e.charAt(s)));if(l.lesser(0))return 0;let i=l.mod(s),a=r.charAt(i),o=l.divide(s);for(;!o.equals(0);)i=o.mod(s),o=o.divide(s),a=r.charAt(i)+a;return a}function b(e){return s.encode(f.toUint8Array(e))}function k(e){return f.toHex(s.decode(e))}String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")});class _{constructor(e,t,s,n=null){this.modelType=e,this.modelId=t,this.meta=s,this.snapshotMolecule=n,this.createdAt=+new Date}static normalizeMeta(e){if("[object Object]"===Object.prototype.toString.call(e)){const t=[];for(const s in e)e.hasOwnProperty(s)&&t.push({key:s,value:e[s]});return t}return e}static aggregateMeta(e){const t={};if("[object Array]"===Object.prototype.toString.call(e))for(let s of e)t[s.key]=s.value;return Object.keys(t).length>0?t:e}}class x{constructor(e,t,s,n=null,r=null,l=null,i=null,a=null,o=null,u=null,c=null){this.position=e,this.walletAddress=t,this.isotope=s,this.token=n,this.value=null!==r?String(r):null,this.batchId=l,this.metaType=i,this.metaId=a,this.meta=o?_.normalizeMeta(o):[],this.index=c,this.otsFragment=u,this.createdAt=String(+new Date)}static jsonToObject(e){const t=Object.assign(new x(null,null,null),JSON.parse(e)),s=Object.keys(new x(null,null,null));for(const e in t)t.hasOwnProperty(e)&&!s.includes(e)&&delete t[e];return t}static hashAtoms(t,s="base17"){const n=e.shake256.create(256),r=t.length,l=x.sortAtoms(t);for(const e of l){n.update(String(r));for(const t in e)if(e.hasOwnProperty(t)){if(["batchId"].includes(t)&&null===e[t])continue;if(["otsFragment","index"].includes(t))continue;if("meta"===t){e[t]=_.normalizeMeta(e[t]);for(const s of e[t])void 0!==s.value&&null!==s.value&&(n.update(String(s.key)),n.update(String(s.value)));continue}if(["position","walletAddress","isotope"].includes(t)){n.update(String(e[t]));continue}null!==e[t]&&n.update(String(e[t]))}}switch(s){case"hex":return n.hex();case"array":return n.array();default:return w(n.hex(),16,17,"0123456789abcdef","0123456789abcdefg").padStart(64,"0")}}static sortAtoms(e){const t=[...e];return t.sort((e,t)=>e.index===t.index?0:e.index<t.index?-1:1),t}}class ${constructor(e={}){this.$options=Object.assign({characters:"GMP"},e),this.$encoder=m.default(this[this.$options.characters]||this.GMP)}encode(e){return this.$encoder.encode(l.Buffer.from(e))}decode(e){return this.$encoder.decode(e)}get GMP(){return"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuv"}get BITCOIN(){return"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}get FLICKR(){return"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}get RIPPLE(){return"rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz"}get IPFS(){return"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}}class W{static val(e){return Math.abs(1e18*e)<1?0:e}static cmp(e,t,s=!1){const n=1e18*W.val(e),r=1e18*W.val(t);return Math.abs(n-r)<1?0:n>r?1:-1}static equal(e,t){return 0===W.cmp(e,t)}}class I{constructor(e=null){this.base=new $(e)}encrypt(e,t){return this.encode(a.seal(o.encode(JSON.stringify(e)),this.decode(t)))}decrypt(e,t,s){try{return JSON.parse(o.decode(a.open(this.decode(e),this.decode(s),this.decode(t))))}catch(e){return null}}generatePrivateKey(t){const s=e.shake256.create(8*i.box.secretKeyLength);return s.update(t),this.base.encode(l.Buffer.from(s.digest()))}generatePublicKey(e){const t=i.box.keyPair.fromSecretKey(this.decode(e));return this.encode(t.publicKey)}shortHash(t){const s=e.shake256.create(64);return s.update(t),this.base.encode(l.Buffer.from(s.digest()))}decode(e){return this.base.decode(e)}encode(e){return this.base.encode(e)}}function M(t){const s=e.shake256.create(256);return s.update(t),s.hex()}function S(e,t,s=null){return new I(s).encrypt(e,t)}function A(e,t,s,n=null){return new I(n).decrypt(e,t,s)}function v(e,t=null){return new I(t).generatePrivateKey(e)}function T(e,t=null){return new I(t).generatePublicKey(e)}function H(e,t=null){return new I(t).shortHash(e)}class O{constructor(e,t=null,s=null,n=null){this.token=t||"USER",this.balance=0,this.molecules={},this.bundle=e,this.batchId=s,this.characters="undefined"!==(new $)[n]?n:null,this.key=null,this.address=null,this.position=null,this.privkey=null,this.pubkey=null}}class E{constructor(e=null,t="USER",s=null,n=64,r=null){this.position=s||y(n,"abcdef0123456789"),this.token=t,this.balance=0,this.molecules={},this.batchId=null,this.characters="undefined"!==(new $)[r]?r:null,this.key=null,this.address=null,this.bundle=null,this.privkey=null,this.pubkey=null,e&&this.prepareKeys(e)}static create(e,t,s=null,n=null){if(E.isBundleHash(e))return new O(e,t,s,n);const r=new E(e,t);return r.batchId=s,r.characters="undefined"!==(new $)[n]?n:null,r}static isBundleHash(e){return"string"==typeof e&&(64===e.length&&isHex(e))}prepareKeys(e){null===this.key&&null===this.address&&null===this.bundle&&(this.key=E.generatePrivateKey(e,this.token,this.position),this.address=E.generatePublicKey(this.key),this.bundle=M(e),this.getMyEncPrivateKey(),this.getMyEncPublicKey())}static generateBatchId(){return y(64)}initBatchId(e,t){e.batchId&&(this.batchId=!this.batchId&&W.cmp(e.balance,t)>0?E.generateBatchId():e.batchId)}getMyEncPrivateKey(){return null===this.privkey&&null!==this.key&&(this.privkey=v(this.key,this.characters)),this.privkey}getMyEncPublicKey(){const e=this.getMyEncPrivateKey();return null===this.pubkey&&null!==e&&(this.pubkey=T(e,this.characters)),this.pubkey}encryptMyMessage(e){const t={};for(let s=1,n=arguments.length;s<n;s++)t[H(arguments[s],this.characters)]=S(e,arguments[s],this.characters);return t}decryptMyMessage(e){const t=this.getMyEncPublicKey();let s=e;return null!==e&&"object"==typeof e&&"[object Object]"===Object.prototype.toString.call(e)&&(s=e[H(t,this.characters)]||""),A(s,this.getMyEncPrivateKey(),t,this.characters)}static generatePrivateKey(t,s,n){const r=p.default(t,16).add(p.default(n,16)),l=e.shake256.create(8192);return l.update(r.toString(16)),s&&l.update(s),e.shake256.create(8192).update(l.hex()).hex()}static generatePublicKey(t){const s=g(t,128),n=e.shake256.create(8192);for(const t in s){let r=s[t];for(let t=1;t<=16;t++)r=e.shake256.create(512).update(r).hex();n.update(r)}return e.shake256.create(256).update(n.hex()).hex()}}class q extends TypeError{constructor(e=null,t=null,s=null){if(super(e,t,s),null===e)throw new this("Unknown "+this.constructor.name);this.name="BaseException"}toString(){return`${this.name}: ${this.message}.\nStack:\n${this.stack}`}}class R extends q{constructor(e="There is an atom without an index",t=null,s=null){super(e,t,s),this.name="AtomIndexException"}}class C extends q{constructor(e="The molecule does not contain atoms",t=null,s=null){super(e,t,s),this.name="AtomsMissingException"}}class j extends q{constructor(e="The molecular hash does not match",t=null,s=null){super(e,t,s),this.name="MolecularHashMismatchException"}}class K extends q{constructor(e="The molecular hash is missing",t=null,s=null){super(e,t,s),this.name="MolecularHashMissingException"}}class P extends q{constructor(e="OTS malformed",t=null,s=null){super(e,t,s),this.name="SignatureMalformedException"}}class U extends q{constructor(e="One-time signature (OTS) does not match!",t=null,s=null){super(e,t,s),this.name="SignatureMismatchException"}}class B extends q{constructor(e="Insufficient balance to make transfer",t=null,s=null){super(e,t,s),this.name="TransferBalanceException"}}class F extends q{constructor(e="Token transfer atoms are malformed",t,s){super(e,t,s),this.name="TransferMalformedException"}}class N extends q{constructor(e="Token slugs for wallets in transfer do not match!",t=null,s=null){super(e,t,s),this.name="TransferMismatchedException"}}class Q extends q{constructor(e="Invalid remainder provided",t=null,s=null){super(e,t,s),this.name="TransferRemainderException"}}class V extends q{constructor(e="Sender and recipient(s) cannot be the same",t=null,s=null){super(e,t,s),this.name="TransferToSelfException"}}class z extends q{constructor(e="Token transfer atoms are unbalanced",t=null,s=null){super(e,t,s),this.name="TransferUnbalancedException"}}class J extends q{constructor(e="Empty meta data.",t=null,s=null){super(e,t,s),this.name="MetaMissingException"}}class L extends q{constructor(e="Wrong type of token for this isotope",t=null,s=null){super(e,t,s),this.name="WrongTokenTypeException"}}class D{static continuId(e){D.missing(e);if("USER"===e.atoms[0].token&&D.isotopeFilter("I",e.atoms).length<1)throw new C("Missing atom ContinuID");return!0}static isotopeI(e){D.missing(e);for(let t of D.isotopeFilter("I",e.atoms)){if("USER"!==t.token)throw new L(`Invalid token name for "${t.isotope}" isotope`);if(0===t.index)throw new R(`Invalid isotope "${t.isotope}" index`)}return!0}static isotopeU(e){D.missing(e);for(let t of D.isotopeFilter("U",e.atoms)){if("AUTH"!==t.token)throw new L(`Invalid token name for "${t.isotope}" isotope`);if(0!==t.index)throw new R(`Invalid isotope "${t.isotope}" index`)}return!0}static isotopeM(e){D.missing(e);for(let t of D.isotopeFilter("M",e.atoms)){if(t.meta.length<1)throw new J;if("USER"!==t.token)throw new L(`Invalid token name for "${t.isotope}" isotope`)}return!0}static isotopeC(e){D.missing(e);for(let t of D.isotopeFilter("C",e.atoms)){if("USER"!==t.token)throw new L(`Invalid token name for "${t.isotope}" isotope`);if(0!==t.index)throw new R(`Invalid isotope "${t.isotope}" index`)}return!0}static isotopeT(e){D.missing(e);for(let t of D.isotopeFilter("T",e.atoms)){const e=_.aggregateMeta(_.normalizeMeta(t.meta));if("wallet"===String(t.metaType).toLowerCase())for(let t of["position","bundle"])if(!e.hasOwnProperty(t)||!Boolean(e[t]))throw new J(`No or not defined "${t}" in meta`);for(let t of["token"])if(!e.hasOwnProperty(t)||!Boolean(e[t]))throw new J(`No or not defined "${t}" in meta`);if("USER"!==t.token)throw new L(`Invalid token name for "${$atom.isotope}" isotope`);if(0!==t.index)throw new R(`Invalid isotope "${t.isotope}" index`)}return!0}static isotopeV(e,t=null){D.missing(e);const s=D.isotopeFilter("V",e.atoms);if(0===s.length)return!0;const n=e.atoms[0];if("V"===n.isotope&&2===s.length){const e=s[s.length-1];if(n.token!==e.token)throw new N;if(e.value<0)throw new F;return!0}let r=0,l=0;for(let t in e.atoms)if(e.atoms.hasOwnProperty(t)){const s=e.atoms[t];if("V"!==s.isotope)continue;if(l=1*s.value,Number.isNaN(l))throw new TypeError('Invalid isotope "V" values');if(s.token!==n.token)throw new N;if(t>0){if(l<0)throw new F;if(s.walletAddress===n.walletAddress)throw new V}r+=l}if(r!==l)throw new z;if(t){if(l=1*n.value,Number.isNaN(l))throw new TypeError('Invalid isotope "V" values');const e=1*t.balance+l;if(e<0)throw new B;if(e!==r)throw new Q}else if(0!==l)throw new Q;return!0}static molecularHash(e){if(D.missing(e),e.molecularHash!==x.hashAtoms(e.atoms))throw new j;return!0}static ots(t){D.missing(t);const s=t.atoms[0].walletAddress,n=D.normalizedHash(t.molecularHash);let r=t.atoms.map(e=>e.otsFragment).reduce((e,t)=>e+t);if(2048!==r.length&&(r=k(r),2048!==r.length))throw new P;const l=g(r,128);let i="";for(const t in l){let s=l[t];for(let r=0,l=8+n[t];r<l;r++)s=e.shake256.create(512).update(s).hex();i+=s}const a=e.shake256.create(8192).update(i).hex();if(e.shake256.create(256).update(a).hex()!==s)throw new U;return!0}static index(e){D.missing(e);for(let t of e.atoms)if(null===t.index)throw new R;return!0}static isotopeFilter(e,t){return(t=t||[]).filter(t=>e===t.isotope)}static normalizedHash(e){return D.normalize(D.enumerate(e))}static enumerate(e){const t={0:-8,1:-7,2:-6,3:-5,4:-4,5:-3,6:-2,7:-1,8:0,9:1,a:2,b:3,c:4,d:5,e:6,f:7,g:8},s=[],n=e.toLowerCase().split("");for(let e=0,r=n.length;e<r;++e){const r=n[e];void 0!==t[r]&&(s[e]=t[r])}return s}static normalize(e){let t=e.reduce((e,t)=>e+t);const s=t<0;for(;t<0||t>0;)for(const n of Object.keys(e)){if(s?e[n]<8:e[n]>-8){s?(++e[n],++t):(--e[n],--t);if(0===t)break}}return e}static missing(e){if(null===e.molecularHash)throw new K;if(1>e.atoms.length)throw new C}}class G extends q{constructor(e="Insufficient balance for requested transfer",t=null,s=null){super(e,t,s),this.name="BalanceInsufficientException"}}class X extends q{constructor(e="Amount cannot be negative!",t=null,s=null){super(e,t,s),this.name="NegativeAmountException"}}const Y=require("lodash.clonedeep"),Z=require("lodash.merge");class ee{constructor(e=null){this.cellSlugOrigin=this.cellSlug=e}get cellSlugDelimiter(){return"."}cellSlugBase(){return(this.cellSlug||"").split(this.cellSlugDelimiter)[0]}toJSON(){let e=Y(this);for(let t of["remainderWallet","secret","sourceWallet","cellSlugOrigin"])e.hasOwnProperty(t)&&delete e[t];return e}check(e=null){return ee.verify(this,e)}static verify(e,t=null){return D.molecularHash(e)&&D.ots(e)&&D.index(e)&&D.continuId(e)&&D.isotopeM(e)&&D.isotopeT(e)&&D.isotopeC(e)&&D.isotopeU(e)&&D.isotopeI(e)&&D.isotopeV(e,t)}static jsonToObject(e){const t=Z(new this,JSON.parse(e)),s=Object.keys(new this);if(!Array.isArray(t.atoms))throw new C;for(const e in Object.keys(t.atoms)){t.atoms[e]=x.jsonToObject(JSON.stringify(t.atoms[e]));for(const s of["position","walletAddress","isotope"])if(void 0===t.atoms[e][s]||null===t.atoms[e][s])throw new C("The required properties of the atom are not filled.")}for(const e in t)t.hasOwnProperty(e)&&!s.includes(e)&&delete t[e];return t.atoms=x.sortAtoms(t.atoms),t}}const te=require("lodash.merge");class se extends ee{constructor(e,t=null,s=null,n=null){super(n),this.secret=e,this.sourceWallet=t,(s||t)&&(this.remainderWallet=s||E.create(e,t.batchId,t.characters)),this.clear()}static mergeMetas(e,t={}){return te(e||{},t)}static verify(e,t=null){return D.molecularHash(e)&&D.ots(e)&&D.index(e)&&D.continuId(e)&&D.isotopeM(e)&&D.isotopeT(e)&&D.isotopeC(e)&&D.isotopeU(e)&&D.isotopeI(e)&&D.isotopeV(e,t)}static generateNextAtomIndex(e){const t=e.length-1;return t>-1?e[t].index+1:0}continuIdMetaType(){return"walletBundle"}fill(e){for(let t in Object.keys(e))this[t]=e[t]}encryptMessage(e,t=[]){const s=[e,this.sourceWallet.pubkey];for(let e of t)s.push(e.pubkey);return this.sourceWallet.encryptMessage(...s)}addAtom(e){return this.molecularHash=null,this.atoms.push(atoms),this.atoms=x.sortAtoms(this.atoms),this}replenishTokens(e,t,s){const n=_.aggregateMeta(_.normalizeMeta(s));n.action="add";for(let e of["address","position","batchId"])if(void 0===n[e])throw new J(`Missing ${e} in meta`);return this.molecularHash=null,this.atoms.push(new x(this.sourceWallet.position,this.sourceWallet.address,"C",this.sourceWallet.token,e,this.sourceWallet.batchId,"token",t,se.mergeMetas({pubkey:this.sourceWallet.pubkey,characters:this.sourceWallet.characters},n),null,this.generateIndex())),this.addUserRemainderAtom(this.remainderWallet),this.atoms=x.sortAtoms(this.atoms),this}addUserRemainderAtom(e){return this.molecularHash=null,this.atoms.push(new x(e.position,e.address,"I",e.token,null,null,"walletBundle",e.bundle,{pubkey:e.pubkey,characters:e.characters},null,this.generateIndex())),this.atoms=x.sortAtoms(this.atoms),this}burnTokens(e,t=null){if(e<0)throw new X("Amount to burn must be positive!");if(this.sourceWallet.balance-e<0)throw new G;return this.molecularHash=null,this.atoms.push(new x(this.sourceWallet.position,this.sourceWallet.address,"V",this.sourceWallet.token,-e,this.sourceWallet.batchId,null,null,{pubkey:this.sourceWallet.pubkey,characters:this.sourceWallet.characters},null,this.generateIndex())),this.atoms.push(new x(this.remainderWallet.position,this.remainderWallet.address,"V",this.sourceWallet.token,this.sourceWallet.balance-e,this.remainderWallet.batchId,t?"walletBundle":null,t,{pubkey:this.remainderWallet.pubkey,characters:this.remainderWallet.characters},null,this.generateIndex())),this.atoms=x.sortAtoms(this.atoms),this}initValue(e,t){if(this.sourceWallet.balance-t<0)throw new G;return this.molecularHash=null,this.atoms.push(new x(this.sourceWallet.position,this.sourceWallet.address,"V",this.sourceWallet.token,-t,this.sourceWallet.batchId,null,null,{pubkey:this.sourceWallet.pubkey,characters:this.sourceWallet.characters},null,this.generateIndex())),this.atoms.push(new x(e.position,e.address,"V",this.sourceWallet.token,t,e.batchId,"walletBundle",e.bundle,{pubkey:e.pubkey,characters:e.characters},null,this.generateIndex())),this.atoms.push(new x(this.remainderWallet.position,this.remainderWallet.address,"V",this.sourceWallet.token,this.sourceWallet.balance-t,this.remainderWallet.batchId,"walletBundle",this.sourceWallet.bundle,{pubkey:this.remainderWallet.pubkey,characters:this.remainderWallet.characters},null,this.generateIndex())),this.atoms=x.sortAtoms(this.atoms),this}initWalletCreation(e){this.molecularHash=null;const t={address:e.address,token:e.token,bundle:e.bundle,position:e.position,amount:0,batch_id:e.batchId,pubkey:e.pubkey,characters:e.characters};return this.atoms.push(new x(this.sourceWallet.position,this.sourceWallet.address,"C",this.sourceWallet.token,null,this.sourceWallet.batchId,"wallet",e.address,t,null,this.generateIndex())),this.addUserRemainderAtom(this.remainderWallet),this.atoms=x.sortAtoms(this.atoms),this}initIdentifierCreation(e,t,s){return this.molecularHash=null,this.atoms.push(new x(this.sourceWallet.position,this.sourceWallet.address,"C",this.sourceWallet.token,null,null,"identifier",e,{pubkey:this.sourceWallet.pubkey,characters:this.sourceWallet.characters,code:s,hash:M(source.trim())},null,this.generateIndex())),this.addUserRemainderAtom(this.remainderWallet),this.atoms=x.sortAtoms(this.atoms),this}initTokenCreation(e,t,s){this.molecularHash=null;const n=_.normalizeMeta(s);for(const t of["walletAddress","walletPosition","walletPubkey","walletCharacters"])0===n.filter(e=>"[object Object]"===toString.call(e)&&void 0!==e.key&&e.key===t).length&&n.push({key:t,value:e[t.toLowerCase().substr(6)]});return this.atoms.push(new x(this.sourceWallet.position,this.sourceWallet.address,"C",this.sourceWallet.token,t,e.batchId,"token",e.token,se.mergeMetas({pubkey:this.sourceWallet.pubkey,characters:this.sourceWallet.characters},n),null,this.generateIndex())),this.addUserRemainderAtom(this.remainderWallet),this.atoms=x.sortAtoms(this.atoms),this}initShadowWalletClaim(e,t={}){return this.molecularHash=null,this.atoms.push(new x(this.sourceWallet.position,this.sourceWallet.address,"C",this.sourceWallet.token,null,e.batchId,"shadowWallet",e.token,se.mergeMetas({pubkey:this.sourceWallet.pubkey,characters:this.sourceWallet.characters},t),null,this.generateIndex())),this.addUserRemainderAtom(this.remainderWallet),this.atoms=x.sortAtoms(this.atoms),this}initMeta(e,t,s){return this.molecularHash=null,this.atoms.push(new x(this.sourceWallet.position,this.sourceWallet.address,"M",this.sourceWallet.token,null,this.sourceWallet.batchId,t,s,se.mergeMetas({pubkey:this.sourceWallet.pubkey,characters:this.sourceWallet.characters},e),null,this.generateIndex())),this.addUserRemainderAtom(this.remainderWallet),this.atoms=x.sortAtoms(this.atoms),this}initTokenRequest(e,t,s,n,r={}){return this.molecularHash=null,this.atoms.push(new x(this.sourceWallet.position,this.sourceWallet.address,"T",this.sourceWallet.token,t,null,s,n,se.mergeMetas({pubkey:this.sourceWallet.pubkey,characters:this.sourceWallet.characters,token:e},r),null,this.generateIndex())),this.addUserRemainderAtom(this.remainderWallet),this.atoms=x.sortAtoms(this.atoms),this}initAuthorization(){return this.molecularHash=null,this.atoms.push(new x(this.sourceWallet.position,this.sourceWallet.address,"U",this.sourceWallet.token,null,this.sourceWallet.batchId,null,null,{pubkey:this.sourceWallet.pubkey,characters:this.sourceWallet.characters},null,this.generateIndex())),this.atoms=x.sortAtoms(this.atoms),this}clear(){return this.molecularHash=null,this.bundle=null,this.status=null,this.createdAt=String(+new Date),this.atoms=[],this}sign(t=!1,s=!0){if(0===this.atoms.length||0!==this.atoms.filter(e=>!(e instanceof x)).length)throw new C;t||(this.bundle=M(this.secret)),this.molecularHash=x.hashAtoms(this.atoms);const n=this.atoms[0],r=g(E.generatePrivateKey(this.secret,n.token,n.position),128),l=D.normalizedHash(this.molecularHash);let i="";for(const t in r){let s=r[t];for(let n=0,r=8-l[t];n<r;n++)s=e.shake256.create(512).update(s).hex();i+=s}s&&(i=b(i));const a=g(i,Math.ceil(i.length/this.atoms.length));let o=null;for(let e=0,t=a.length;e<t;e++)this.atoms[e].otsFragment=a[e],o=this.atoms[e].position;return o}check(e=null){return se.verify(this,e)}generateIndex(){return se.generateNextAtomIndex(this.atoms)}}class ne extends q{constructor(e="GraphQL did not provide a valid response.",t=null,s=null){super(e,t,s),this.name="InvalidResponseException"}}class re extends q{constructor(e="Authorization token missing or invalid.",t=null,s=null){super(e,t,s),this.name="UnauthenticatedException"}}class le{static __init(e,t){this.arr=[],this.key=null,this.arr=String(t).split("."),this.key=this.arr.shift();const s=Number(this.key);Number.isInteger(s)&&(this.key=s),this.__nextKey=this.arr.length,this.__next=this.__tic(e)}static __tic(e){return!!(Array.isArray(e)||e instanceof Object)&&void 0!==e[this.key]}static has(e,t){return this.__init(e,t),!!this.__next&&(0===this.__nextKey||this.has(e[this.key],this.arr.join(".")))}static get(e,t,s=null){return this.__init(e,t),this.__next?0===this.__nextKey?e[this.key]:this.get(e[this.key],this.arr.join("."),s):s}}class ie{constructor(e,t){if(this.dataKey=null,this.errorKey="exception",this.$__payload=null,this.$__query=e,this.$__originResponse=t,this.$__response=t,void 0===this.$__response||null===this.$__response)throw new ne;if(le.has(this.$__response,this.errorKey)){const e=le.get(this.$__response,this.errorKey);if(String(e).includes("Unauthenticated"))throw new re;throw new ne}this.init()}data(){if(!this.dataKey)return this.response();if(!le.has(this.response(),this.dataKey))throw new ne;return le.get(this.response(),this.dataKey)}response(){return this.$__response}payload(){return null}query(){return this.$__query}init(){return null}}class ae{constructor(e){this.knishIO=e,this.$__fields=null,this.$__variables=null,this.$__request=null,this.$__response=null,this.$__query=null}request(){return this.$__request}response(){return this.$__response}client(){return this.knishIO.client()}createRequest(e=null,t=null){return this.$__variables=this.compiledVariables(e),new u.Request(this.url(),{body:JSON.stringify({query:this.compiledQuery(t),variables:this.variables()})})}compiledVariables(e=null){return e||{}}compiledQuery(e=null){return null!==e&&(this.$__fields=e),this.$__query.replace(new RegExp("@fields","g"),this.compiledFields(this.$__fields))}compiledFields(e){const t=[];for(let s of Object.keys(e))t.push(e[s]?`${s} ${this.compiledFields(e[s])}`:""+s);return`{ ${t.join(", ")} }`}async execute(e=null,t=null){this.$__request=this.createRequest(e,t);let s=await this.client().send(this.$__request);return"QueryAuthorization"!==this.constructor.name&&401===s.status&&(await this.knishIO.authorization(),s=await this.client().send(this.$__request)),this.$__response=await this.createResponseRaw(s),this.$__response}async createResponseRaw(e){return this.createResponse(JSON.parse(await e.text()))}createResponse(e){return new ie(this,e)}url(){return this.knishIO.client().getUrl()}variables(){return this.$__variables}}class oe extends ie{constructor(e,t){super(e,t),this.dataKey="data.ContinuId",this.init()}payload(){let e=null;const t=this.data();return t&&(e=new E(null,t.tokenSlug),e.address=t.address,e.position=t.position,e.bundle=t.bundleHash,e.batchId=t.batchId,e.characters=t.characters,e.pubkey=t.pubkey,e.balance=1*t.amount),e}}class ue extends ae{constructor(e){super(e),this.$__query="query ($bundle: String!) { ContinuId(bundle: $bundle) @fields }",this.$__fields={address:null,bundleHash:null,tokenSlug:null,position:null,batchId:null,characters:null,pubkey:null,amount:null,createdAt:null}}createResponse(e){return new oe(this,e)}}class ce extends ie{constructor(e,t){super(e,t),this.dataKey="data.ProposeMolecule",this.init()}init(){const e=le.get(this.data(),"payload");try{this.$__payload=JSON.parse(e)}catch(e){this.$__payload=null}}molecule(){const e=this.data();if(!e)return null;const t=new ee;return t.molecularHash=le.get(e,"molecularHash"),t.status=le.get(e,"status"),t.status=le.get(e,"createdAt"),t}success(){return"accepted"===this.status()}status(){return le.get(this.data(),"status","rejected")}reason(){return le.get(this.data(),"reason","Invalid response from server")}payload(){return this.$__payload}}const he=require("lodash.merge");class de extends ae{constructor(e,t=null){super(e),this.$__molecule=t,this.$__remainderWallet=null,this.$__query="mutation( $molecule: MoleculeInput! ) { ProposeMolecule( molecule: $molecule ) @fields }",this.$__fields={molecularHash:null,height:null,depth:null,status:null,reason:null,payload:null,createdAt:null,receivedAt:null,processedAt:null,broadcastedAt:null}}compiledVariables(e){const t=super.compiledVariables(e);return he(t,{molecule:this.molecule()})}createResponse(e){return new ce(this,e)}async execute(e=null,t=null){return await super.execute(he(e||{},{molecule:this.molecule()}),t)}remainderWallet(){return this.$__remainderWallet}molecule(){return this.$__molecule}}class pe extends ce{payloadKey(e){if(!le.has(this.payload(),e))throw new ne(`ResponseAuthorization: '${e}' key is not found in the payload.`);return le.get(this.payload(),e)}token(){return this.payloadKey("token")}time(){return this.payloadKey("time")}}class me extends de{fillMolecule(){this.$__molecule.initAuthorization(),this.$__molecule.sign(),this.$__molecule.check()}createResponse(e){return new pe(this,e)}}class fe extends ie{constructor(e,t){super(e,t),this.dataKey="data.Balance",this.init()}payload(){const e=this.data();if(!e)return null;let t=null;return null===e.position?t=new O(e.bundleHash,e.tokenSlug,e.batchId):(t=new E(null,e.tokenSlug),t.address=e.address,t.position=e.position,t.bundle=e.bundleHash,t.batchId=e.batchId,t.characters=e.characters,t.pubkey=e.pubkey),t.balance=e.amount,t}}class ge extends ae{constructor(e){super(e),this.$__query="query( $address: String, $bundleHash: String, $token: String, $position: String ) { Balance( address: $address, bundleHash: $bundleHash, token: $token, position: $position ) @fields }",this.$__fields={address:null,bundleHash:null,tokenSlug:null,batchId:null,position:null,amount:null,characters:null,pubkey:null,createdAt:null}}createResponse(e){return new fe(this,e)}}class ye extends ce{}class we extends de{fillMolecule(e,t,s=null){this.$__molecule.initTokenCreation(e,t,s||{}),this.$__molecule.sign(),this.$__molecule.check()}createResponse(e){return new ye(this,e)}}class be extends de{fillMolecule(e,t,s,n,r=null){this.$__molecule.initTokenRequest(e,t,s,n,r||{}),this.$__molecule.sign(),console.log(this.$__molecule),this.$__molecule.check()}}class ke extends q{constructor(e="The shadow wallet does not exist",t=null,s=null){super(e,t,s),this.name="WalletShadowException"}}class _e extends ce{payload(){const e={reason:null,status:null},t=this.data();return e.reason=void 0===t.reason?"Invalid response from server":t.reason,e.status=void 0===t.status?"rejected":t.status,e}}class xe extends de{fillMolecule(e,t){this.$__molecule.initValue(e,t),this.$__molecule.sign(),this.$__molecule.check(this.$__molecule.sourceWallet())}createResponse(e){return new _e(this,e)}}const $e=require("lodash.merge");class We{constructor(e,t={}){this.$__headers=new u.Headers(t.headers||{}),this.$__config=$e(t,{method:"POST",headers:this.$__headers}),this.setUrl(e)}getConfig(){return this.$__config}setUrl(e){this.$__url=e}getUrl(){return this.$__url}setAuthToken(e){this.$__headers.set("X-Auth-Token",e||"")}getAuthToken(){return this.$__headers.get("X-Auth-Token")||""}async send(e,t={}){e.headers.extend(t),this.$__headers.extend(e.headers.asObject()),this.$__headers.delete("content-type"),this.$__headers.append("Accept","application/json"),this.$__headers.append("Content-Type","application/json;charset=UTF-8"),this.setAuthToken(this.getAuthToken());const s=new u.Request(e,this.$__config);return s.headers.delete("content-length"),await c.fetch(s)}}class Ie extends q{constructor(e="Code exception",t=null,s=null){super(e,t,s),this.name="CodeException"}}class Me extends de{fillMolecule(e,t,s){this.$__molecule.initIdentifierCreation(e,t,s),this.$__molecule.sign(),this.$__molecule.check()}}class Se extends ie{constructor(e,t){super(e,t),this.dataKey="data.Wallet",this.init()}toClientWallet(e){let t;return null===e.position||void 0===e.position?t=new O(e.bundleHash,e.tokenSlug,e.batchId):(t=new E(null,e.tokenSlug),t.address=e.address,t.position=e.position,t.bundle=e.bundleHash,t.batchId=e.batchId,t.characters=e.characters,t.pubkey=e.pubkey),t.balance=e.amount,t}payload(){const e=this.data();if(!e)return null;const t=[];for(let s of e)t.push(this.toClientWallet(s));return t}}class Ae extends ae{constructor(e){super(e),this.$__query="query( $address: String, $bundleHash: String, $token: String, $position: String ) { Wallet( address: $address, bundleHash: $bundleHash, token: $token, position: $position ) @fields }",this.$__fields={address:null,bundleHash:null,tokenSlug:null,batchId:null,position:null,amount:null,characters:null,pubkey:null,createdAt:null}}createResponse(e){return new Se(this,e)}}class ve extends de{fillMolecule(e,t){const s=[];for(let n of t)s.push(E.create(this.$__molecule.secret(),e,n.batchId));this.$__molecule.initShadowWalletClaimAtom(e,s),this.$__molecule.sign(),this.$__molecule.check()}}exports.Atom=x,exports.KnishIOClient=class{constructor(e,t=null){this.$__url=e,this.$__secret="",this.$__client=t||new We(this.$__url),this.remainderWallet=null}cellSlug(){return this.$__cellSlug||null}setCellSlug(e){this.$__cellSlug=e}setAuthToken(e){this.client().setAuthToken(e)}getAuthToken(){return this.client().getAuthToken()}getUrl(){return this.client().getUrl()}client(){return this.$__client}async createMolecule(e=null,t=null,s=null){const n=e||this.secret();let r=t;return!t&&this.lastMoleculeQuery&&"AUTH"!==this.getRemainderWallet().token&&this.lastMoleculeQuery.response().success()&&(r=this.getRemainderWallet()),null===r&&(r=await this.getSourceWallet()),this.remainderWallet=s||E.create(n,r.token,r.batchId,r.characters),new se(n,r,this.getRemainderWallet(),this.cellSlug())}createQuery(e){return new e(this)}async createMoleculeQuery(e,t=null){let s=t;null===s&&(s=e.name===me.name?await this.createMolecule(this.secret(),new E(this.secret(),"AUTH")):await this.createMolecule());const n=new e(this,s);if(!(n instanceof de))throw new Ie(this.constructor.name+"::createMoleculeQuery - required class instance of QueryMoleculePropose.");return this.lastMoleculeQuery=n,n}async authorization(e=null,t=null){this.$__secret=e||this.secret(),this.$__cellSlug=t||this.cellSlug();const s=await this.createMoleculeQuery(me);s.fillMolecule();const n=await s.execute();if(!n.success())throw new re(n.reason());return this.client().setAuthToken(n.token()),n}async getBalance(e,t){const s=this.createQuery(ge);return await s.execute({bundleHash:E.isBundleHash(e)?e:M(e),token:t})}secret(){if(!this.$__secret)throw new re(`Expected ${this.constructor.name}::authorization call before.`);return this.$__secret}async createToken(e,t,s=null){const n=new E(this.secret(),e);"stackable"===le.get(s||{},"fungibility")&&(n.batchId=E.generateBatchId());const r=await this.createMoleculeQuery(we);return r.fillMolecule(n,t,s||{}),await r.execute()}async createIdentifier(e,t,s){const n=await this.createMoleculeQuery(Me);return n.fillMolecule(e,t,s),await n.execute()}async getShadowWallets(e){const t=this.createQuery(Ae),s=(await t.execute({bundleHash:M(this.secret()),token:e})).payload();if(!s)throw new ke;for(let e of s)if(!e instanceof O)throw new ke;return s}async requestTokens(e,t,s,n=null){let r,l;"[object String]"===Object.prototype.toString.call(s)&&(E.isBundleHash(s)?(r="walletbundle",l=s):s=E.create(s,e)),s instanceof E&&(r="wallet",n=se.mergeMetas(n||{},{position:s.position,bundle:s.bundle}),l=s.address);const i=await this.createMoleculeQuery(be);return i.fillMolecule(e,t,r,l,n),await i.execute()}async claimShadowWallet(e,t=null){const s=this.getShadowWallets(e),n=await this.createMoleculeQuery(ve,t);return n.fillMolecule(e,s),await n.execute()}async transferToken(e,t,s){const n=(await this.getBalance(this.secret(),t)).payload();if(null===n||W.cmp(n.balance,s)<0)throw new B;let r=e instanceof E?e:(await this.getBalance(e,t)).payload();null===r&&(r=E.create(e,t)),r.initBatchId(n,s),this.remainderWallet=E.create(this.secret(),t,r.batchId,n.characters);const l=await this.createMolecule(null,n,this.getRemainderWallet()),i=await this.createMoleculeQuery(xe,l);return i.fillMolecule(r,s),await i.execute()}async getSourceWallet(){let e=(await this.getContinuId(M(this.secret()))).payload();return e||(e=new E(this.secret())),e}async getContinuId(e){return await this.createQuery(ue).execute({bundle:e})}getRemainderWallet(){return this.remainderWallet}},exports.Meta=_,exports.Molecule=se,exports.Wallet=E,exports.WalletShadow=O,exports.base64ToHex=k,exports.bufferToHexString=function(e){return f.toHex(e)},exports.charsetBaseConvert=w,exports.chunkSubstr=g,exports.decryptMessage=A,exports.encryptMessage=S,exports.generateBundleHash=M,exports.generateEncPrivateKey=v,exports.generateEncPublicKey=T,exports.generateSecret=function(t=null,s=2048){if(t){const n=e.shake256.create(2*s);return n.update(t),n.hex()}return y(s)},exports.hashShare=H,exports.hexStringToBuffer=function(e){return f.toUint8Array(e)},exports.hexToBase64=b,exports.isHex=function(e){return/^[A-F0-9]+$/i.test(e)},exports.randomString=y;
