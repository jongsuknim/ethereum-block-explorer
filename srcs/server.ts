import { EthereumWrapper } from './ethereum-wrapper';
import { DbWrapper, Block, Tx } from './db-wrapper';

class Server {
    db: DbWrapper;
    ethereum: EthereumWrapper;

    constructor() {
        this.db = new DbWrapper();
        this.ethereum = new EthereumWrapper(this.blockInfoHandler.bind(this));
    }

    private parseBlockTxs(blockData: object): [Block, Tx[]] {
        let blockHash: string = blockData['hash'];
        let height: number = Number(blockData['number']);
        let timestamp: number = Number(blockData['timestamp']);
        let txs: string[] = [];

        let txList: Tx[] = [];

        for(let i=0; i < blockData['transactions'].length; i++) {
            let txObj = blockData['transactions'][i];
            
            let txHash: string = txObj['hash'];
            let from: string = txObj['from'];
            let to: string = txObj['to'];
            let data: string = txObj['input'];

            txList.push(new Tx(txHash, from, to, blockHash, height, data));
            txs.push(txHash);
        }

        let block: Block = new Block(
            blockHash, height, timestamp, txs
        );

        return [block, txList];
    }

    private async blockInfoHandler(blockData: object) {
        let [block, txs]: [Block, Tx[]] = this.parseBlockTxs(blockData);

        console.log(block.height, txs.length);

        await this.db.insertTxs(txs);
        await this.db.insertBlock(block);
        
    }

    async start(mongodbUrl:string, infuraUrl: string) {
        await this.db.connect(mongodbUrl);
        this.ethereum.start(infuraUrl);
    }

    async findBlockByBlockHash(blockHash: string): Promise<Block|null> {
        return this.db.findBlockByBlockHash(blockHash);
    }

    async findBlockByHeight(height: number): Promise<Block|null> {
        return this.db.findBlockByHeight(height);
    }

    async findLatestBlocksSortByHeight(length: number): Promise<Block[]> {
        return this.db.findLatestBlocksSortByHeight(length);
    }

    async findBlocksSortByHeight(from: number, length: number): Promise<Block[]> {
        return this.db.findBlocksSortByHeight(from, length);
    }

    async findTxByTxHash(txHash: string): Promise<Tx|null> {
        return this.db.findTxByTxHash(txHash);
    }

    async findTxsByAccountSortByBlockNumber(account: string, length: number): Promise<Tx[]> {
        return this.db.findTxsByAccountSortByBlockNumber(account, length);
    }
}

export { Server }
