export interface IWallet {
  token: string;
  balance: number;
  address: string | null;
  position: string | null;
  bundle: string | null;
  batchId: string | null;
  pubkey: string | null;
  characters: string | null;
}

export interface WalletConstructorParams {
  secret: string | null;
  bundle: string | null;
  token: string;
  address: string | null;
  position: string | null;
  batchId: string | null;
  characters: string | null;
}

export interface WalletGenerateKeyParams {
  secret: string,
  token: string,
  position: string
}

export interface ITokenUnit {
  id: string;
  name: string;
  metas: any;
}

export interface IMolecule {
  status: string | null;
  molecularHash: string | null;
  createdAt: string;
  cellSlug: string | null;
  secret: string | null;
  bundle: string | null;
  sourceWallet: IWallet | null;
  atoms: IAtom[];
}

export interface IMeta {
  metaType: string | null;
  metaId: string | null;
}

export interface IAtom {
  position: string | null;
  walletAddress: string | null;
  isotope: string | null;
  token: string | null;
  value: string | null;
  batchId: string | null;
  metaType: string | null;
  metaId: string | null;
  meta: IMeta[];
  index: number | null;
}

export interface Policy {
  type: string;
  action: string;
}
