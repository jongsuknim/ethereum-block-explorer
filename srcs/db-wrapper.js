"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("mongodb"));
const MongoClient = mongodb_1.default.MongoClient;
class Tx {
    constructor(txHash, from, to, blockHash, blockNumber, data) {
        this.txHash = txHash;
        this.from = from;
        this.to = to;
        this.blockHash = blockHash;
        this.blockNumber = blockNumber;
        this.data = data;
    }
}
exports.Tx = Tx;
class Block {
    constructor(blockHash, height, timestamp, txs) {
        this.blockHash = blockHash;
        this.height = height;
        this.timestamp = timestamp;
        this.txs = txs;
    }
}
exports.Block = Block;
class DbWrapper {
    constructor() {
        this.flatMap = (f, arr) => arr.reduce((x, y) => [...x, ...f(y)], []);
    }
    connect(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let client = yield MongoClient.connect(url, { useUnifiedTopology: true });
            this.db = client.db('ether_be');
            this.blocks = this.db.collection('blocks');
            this.txs = this.db.collection('txs');
        });
    }
    toBlock(obj) {
        return new Block(obj.blockHash, Number(obj.height), Number(obj.timestamp), obj.txs);
    }
    toTx(obj) {
        return new Tx(obj.txHash, obj.from, obj.to, obj.blockHash, Number(obj.blockNumber), obj.data);
    }
    insertBlock(block) {
        return __awaiter(this, void 0, void 0, function* () {
            this.insertBlocks([block]);
        });
    }
    insertBlocks(blocks) {
        return __awaiter(this, void 0, void 0, function* () {
            if (blocks.length > 0) {
                try {
                    yield this.blocks.insertMany(blocks);
                }
                catch (e) {
                    console.error(e);
                    yield this.insertBlocks(blocks);
                }
            }
        });
    }
    insertTx(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            this.insertTxs([tx]);
        });
    }
    insertTxs(txs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (txs.length > 0) {
                try {
                    yield this.txs.insertMany(txs);
                }
                catch (e) {
                    console.error(e);
                    yield this.insertTxs(txs);
                }
            }
        });
    }
    deleteBlocks() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blocks.deleteMany({});
        });
    }
    deleteTxs() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.txs.deleteMany({});
        });
    }
    findBlockByBlockHash(blockHash) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.blocks.find({ blockHash: blockHash }).toArray();
            if (result.length > 0)
                return this.toBlock(result[0]);
            else
                return null;
        });
    }
    findBlockByHeight(height) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.blocks.find({ height: height }).toArray();
            if (result.length > 0)
                return this.toBlock(result[0]);
            else
                return null;
        });
    }
    findLatestBlocksSortByHeight(length) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findBlocksSortByHeight(Number.MAX_SAFE_INTEGER, length);
        });
    }
    findBlocksSortByHeight(from, length) {
        return __awaiter(this, void 0, void 0, function* () {
            let objs = yield this.blocks.find({ height: { $lte: from } }).limit(length).sort({ height: -1 }).toArray();
            let blocks = objs.map(x => this.toBlock(x));
            return blocks;
        });
    }
    findTxByTxHash(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.txs.find({ "txHash": txHash }).toArray();
            if (result.length > 0)
                return this.toTx(result[0]);
            else
                return null;
        });
    }
    findTxsByAccountSortByBlockNumber(account, length) {
        return __awaiter(this, void 0, void 0, function* () {
            let objs = yield this.txs.find({ $or: [{ "from": account }, { "to": account }] }).limit(length).sort({ blockNumber: -1 }).toArray();
            let retTxs = objs.map(x => this.toTx(x));
            return retTxs;
        });
    }
}
exports.DbWrapper = DbWrapper;
