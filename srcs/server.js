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
Object.defineProperty(exports, "__esModule", { value: true });
const ethereum_wrapper_1 = require("./ethereum-wrapper");
const db_wrapper_1 = require("./db-wrapper");
class Server {
    constructor() {
        this.db = new db_wrapper_1.DbWrapper();
        this.ethereum = new ethereum_wrapper_1.EthereumWrapper(this.blockInfoHandler.bind(this));
    }
    parseBlockTxs(blockData) {
        let blockHash = blockData['hash'];
        let height = Number(blockData['number']);
        let timestamp = Number(blockData['timestamp']);
        let txs = [];
        let txList = [];
        for (let i = 0; i < blockData['transactions'].length; i++) {
            let txObj = blockData['transactions'][i];
            let txHash = txObj['hash'];
            let from = txObj['from'];
            let to = txObj['to'];
            let data = txObj['input'];
            txList.push(new db_wrapper_1.Tx(txHash, from, to, blockHash, height, data));
            txs.push(txHash);
        }
        let block = new db_wrapper_1.Block(blockHash, height, timestamp, txs);
        return [block, txList];
    }
    blockInfoHandler(blockData) {
        return __awaiter(this, void 0, void 0, function* () {
            let [block, txs] = this.parseBlockTxs(blockData);
            console.log(block.height, txs.length);
            yield this.db.insertTxs(txs);
            yield this.db.insertBlock(block);
        });
    }
    start(mongodbUrl, infuraUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.connect(mongodbUrl);
            this.ethereum.start(infuraUrl);
        });
    }
    findBlockByBlockHash(blockHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.findBlockByBlockHash(blockHash);
        });
    }
    findBlockByHeight(height) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.findBlockByHeight(height);
        });
    }
    findLatestBlocksSortByHeight(length) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.findLatestBlocksSortByHeight(length);
        });
    }
    findBlocksSortByHeight(from, length) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.findBlocksSortByHeight(from, length);
        });
    }
    findTxByTxHash(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.findTxByTxHash(txHash);
        });
    }
    findTxsByAccountSortByBlockNumber(account, length) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.findTxsByAccountSortByBlockNumber(account, length);
        });
    }
}
exports.Server = Server;
