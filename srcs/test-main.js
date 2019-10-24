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
const server_1 = require("./server");
const mongodbUrl = process.env.MONGODB_URL;
const infuraUrl = process.env.INFURA_WS_URL;
if (mongodbUrl == null) {
    console.error("MONGODB_URL is required");
}
if (infuraUrl == null) {
    console.error("INFURA_WS_URL is required");
}
var server = new server_1.Server();
server.start(mongodbUrl, infuraUrl);
function check() {
    return __awaiter(this, void 0, void 0, function* () {
        function sleep(ms) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise(resolve => setTimeout(resolve, ms));
            });
        }
        function getRandomItem(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
        yield sleep(3000);
        while (true) {
            yield sleep(200);
            let blocks = yield server.findLatestBlocksSortByHeight(10);
            if (blocks.length == 0) {
                continue;
            }
            let latestBlock = blocks[0];
            if (latestBlock.txs.length > 0) {
                let txHash = getRandomItem(latestBlock.txs);
                let tx = yield server.findTxByTxHash(txHash);
                if (tx != null) {
                    if (tx.blockHash == latestBlock.blockHash && tx.blockNumber == latestBlock.height && tx.txHash == txHash) {
                        console.log(latestBlock.height, txHash);
                    }
                    else {
                        console.error("test error", latestBlock.blockHash, latestBlock.height, txHash, tx);
                        console.error(yield server.findTxByTxHash(txHash));
                        process.exit();
                    }
                }
            }
        }
    });
}
check();
