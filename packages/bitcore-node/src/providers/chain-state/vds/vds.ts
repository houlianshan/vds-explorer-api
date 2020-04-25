import { InternalStateProvider } from '../internal/internal';
import { StreamTransactionsParams } from '../../../types/namespaces/ChainStateProvider';
import { Storage } from '../../../services/storage';
import { TransactionStorage, IVdsTransaction } from '../../../models/vdsTransaction';
import { GetBlockParams } from '../../../types/namespaces/ChainStateProvider';
import { CoinStorage } from '../../../models/coin';
import { VdsBlockStorage, IVdsBlock } from '../../../models/vdsBlock';

export class VDSStateProvider extends InternalStateProvider {
  constructor(chain: string = 'VDS') {
    super(chain);
  }

  async streamTransactions(params: StreamTransactionsParams) {
    const { chain, network, req, res, args } = params;
    let { blockHash, blockHeight } = args;
    if (!chain || !network) {
      throw new Error('Missing chain or network');
    }
    let query: any = {
      chain,
      network: network.toLowerCase()
    };
    if (blockHeight !== undefined) {
      query.blockHeight = Number(blockHeight);
    }else{
      query.blockHeight = {$ne:-1};
    }
    if (blockHash !== undefined) {
      query.blockHash = blockHash;
    }
  
    const tip = await this.getLocalTip(params);
    const tipHeight = tip ? tip.height : 0;
    return Storage.apiStreamingFind(TransactionStorage, query, args, req, res, t => {
      let confirmations = 0;
      if (t.blockHeight !== undefined && t.blockHeight >= 0) {
        confirmations = tipHeight - t.blockHeight + 1;
      }
      const convertedTx = TransactionStorage._apiTransform(t, { object: true }) as Partial<IVdsTransaction>;
      return JSON.stringify({ ...convertedTx, confirmations });
    });
  }

  async getBlocks(params: GetBlockParams): Promise<Array<IVdsBlock>> {
    const { query, options } = this.getBlocksQuery(params);
    let cursor = VdsBlockStorage.collection.find(query, options).addCursorFlag('noCursorTimeout', true);
    if (options.sort) {
      cursor = cursor.sort(options.sort);
    }
    let blocks = await cursor.toArray();
    const tip = await this.getLocalTip(params);
    const tipHeight = tip ? tip.height : 0;
    const blockTransform = (b: IVdsBlock) => {
      let confirmations = 0;
      if (b.height && b.height >= 0) {
        confirmations = tipHeight - b.height + 1;
      }
      const convertedBlock = VdsBlockStorage._apiTransform(b, { object: true }) as IVdsBlock;
      return { ...convertedBlock, confirmations };
    };
    return blocks.map(blockTransform);
  }

  async getBlock(params: GetBlockParams) {
    let blocks = await this.getBlocks(params);
    let block :IVdsBlock = blocks[0];
    let query = {
      chain : block.chain,
      network : block.network,
      coinbase: true,
      mintHeight:block.height
    }
    let cursor= CoinStorage.collection.find(query).addCursorFlag('noCursorTimeout', true);
    let coins = await cursor.toArray();
    // const coinTransform = (b: ICoin) => {
    //   const convertedCoin = CoinStorage._apiTransform(b, { object: true }) as ICoin;
    //   return { ...convertedCoin };
    // };
    block.coinbaseCoins=coins
    return block;
  }
}
