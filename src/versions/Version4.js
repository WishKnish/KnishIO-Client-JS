import HashAtom from './HashAtom';

export default class Version4 extends HashAtom {

  constructor ( {
    position = null,
    walletAddress = null,
    isotope = null,
    token = null,
    value = null,
    batchId = null,
    metaType = null,
    metaId = null,
    meta = null,
    index = null,
    createdAt = null,
    version = null
  } ) {
    super();
    this.position = position;
    this.walletAddress = walletAddress;
    this.isotope = isotope;
    this.token = token;
    this.value = value;
    this.batchId = batchId;

    this.metaType = metaType;
    this.metaId = metaId;
    this.meta = meta;

    this.index = index;
    this.createdAt = createdAt;
    this.version = version;
  }
}
