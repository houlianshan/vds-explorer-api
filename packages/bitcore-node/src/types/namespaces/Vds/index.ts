import { VdsBlockType, BlockHeader, BlockHeaderObj } from './Block';
import {
  BitcoinAddress,
  BitcoinInput,
  BitcoinInputObj,
  VdsOutput,
  BitcoinScript,
  VdsTransactionType
} from './Transaction';

export type VdsBlockType = VdsBlockType;
export type VdsTransaction = VdsTransactionType;
export type BitcoinScript = BitcoinScript;
export type BitcoinAddress = BitcoinAddress;

export type TransactionOutput = VdsOutput;
export type TransactionInput = BitcoinInput;
export type TransactionInputObj = BitcoinInputObj;

export type BitcoinHeader = BlockHeader;
export type BitcoinHeaderObj = BlockHeaderObj;
