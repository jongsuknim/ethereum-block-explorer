import mongodb from 'mongodb'

const MongoClient = mongodb.MongoClient;

class Tx {
    constructor(
        public txHash: string, 
        public from: string, 
        public to: string, 
        public blockHash: string, 
        public blockNumber: number, 
        public data: string) {
    }
}


class Block {
    constructor(
        public blockHash: string, 
        public height: number, 
        public timestamp: number, 
        public txs: string[]) {
    }
}

class DbWrapper {
    db : any;
    blocks: any;
    txs: any;

    constructor() {
    }

    async connect(url: string) {
        let client = await MongoClient.connect(url, { useUnifiedTopology: true });
        this.db = client.db('ether_be');
        
        this.blocks = this.db.collection('blocks');
        this.txs = this.db.collection('txs');
    }

    flatMap = (f, arr) => arr.reduce((x, y) => [...x, ...f(y)], [])

    toBlock(obj: any): Block {
        return new Block(obj.blockHash, Number(obj.height), Number(obj.timestamp), obj.txs);
    }

    toTx(obj: any): Tx {
        return new Tx(obj.txHash, obj.from, obj.to, obj.blockHash, Number(obj.blockNumber), obj.data);
    }

    async insertBlock(block: Block) {
        this.insertBlocks([block]);
    }

    async insertBlocks(blocks: Block[]) {
        if (blocks.length > 0) {
            try {
                await this.blocks.insertMany(blocks);
            } catch(e) {
                console.error(e);
                await this.insertBlocks(blocks);                
            }
        }
    }

    async insertTx(tx: Tx) {
        this.insertTxs([tx]);
    }

    async insertTxs(txs: Tx[]) {
        if (txs.length > 0) {
            try {
                await this.txs.insertMany(txs);    
            } catch(e) {
                console.error(e);
                await this.insertTxs(txs);
            }
        }
    }

    async deleteBlocks() {
        await this.blocks.deleteMany({});
    }

    async deleteTxs() {
        await this.txs.deleteMany({});
    }

    async findBlockByBlockHash(blockHash: string): Promise<Block|null> {
        let result = await this.blocks.find({ blockHash: blockHash }).toArray();
        if (result.length > 0)
            return this.toBlock(result[0]);
        else 
            return null;
    }

    async findBlockByHeight(height: number): Promise<Block|null> {
        let result = await this.blocks.find({ height: height }).toArray();
        if (result.length > 0)
            return this.toBlock(result[0]);
        else 
            return null;
    }

    async findLatestBlocksSortByHeight(length: number): Promise<Block[]> {
        return this.findBlocksSortByHeight(Number.MAX_SAFE_INTEGER, length);
    }

    async findBlocksSortByHeight(from: number, length: number): Promise<Block[]> {
        let objs : object[] = 
            await this.blocks.find({ height: { $lte: from } }).limit(length).sort( {height: -1}).toArray();

        let blocks : Block[] = objs.map(x => this.toBlock(x));
        return blocks;
    }

    async findTxByTxHash(txHash: string): Promise<Tx|null> {
        let result = await this.txs.find({ "txHash": txHash }).toArray();
        if (result.length > 0)
            return this.toTx(result[0]);
        else 
            return null;
    }

    async findTxsByAccountSortByBlockNumber(account: string, length: number): Promise<Tx[]> {
        let objs : object[] = await this.txs.find({ $or: [{"from": account}, {"to": account}] }).limit(length).sort( {blockNumber: -1}).toArray();

        let retTxs : Tx[] = objs.map(x => this.toTx(x));
        return retTxs;
    }
}

export { DbWrapper, Block, Tx }