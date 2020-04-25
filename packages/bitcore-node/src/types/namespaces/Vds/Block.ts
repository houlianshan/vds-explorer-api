import { VdsTransactionType } from './Transaction';
export interface BlockHeaderObj {
  prevHash: string;
  hash: string;
  time: number;
  version: number;
  merkleRoot: string;
  bits: number;
  nonce: number;
}
export interface BlockHeader {
  toObject: () => BlockHeaderObj;
}
export interface VdsBlockType {
  hash: string;
  transactions: VdsTransactionType[];
  header: BlockHeader;
  toBuffer: () => Buffer;
}
