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
const db_wrapper_1 = require("../srcs/db-wrapper");
const chai_1 = require("chai");
describe('DbWrapper', () => {
    var db;
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.deleteBlocks();
        yield db.deleteTxs();
    }));
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        db = new db_wrapper_1.DbWrapper();
        const mongodbUrl = process.env.MONGODB_URL;
        if (mongodbUrl == null) {
            console.error("MONGODB_URL is required");
        }
        yield db.connect(mongodbUrl);
        yield db.deleteBlocks();
        yield db.deleteTxs();
        let txData = [
            {
                txHash: "0xfb754b7c4915a00c888f977e04aa4fa3159c0bde0b739bdea2d0cb48906c8ffa",
                from: "0x5f7efa06f6380885697683c874db4123f7a3827d",
                to: "0x18dd9ae3383de623db1ea37d8da5dde1dc74d356",
                blockHash: "0xe1aa864df15b313851446b97ac4ff3b7fbd480f5ce0aac316a3931ad3b51834b",
                blockNumber: 8780939,
                data: "0xa3a2a82e00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000003e8b80b0000000000000000000000000000000000000000000000000000000003e8e754000000000000000000000000000000000000000000000000000000003b9aca00000000000000000000000000000000000000000000000000000000000001d4c0000000000000000000000000000000000000000000000000000000000000000b42524f4e5a455f34313533000000000000000000000000000000000000000000"
            },
            {
                txHash: "0x5feb597f641a6f1d30f719993b762d8e4f889f41f9c7a9f22b0939cf72c537cc",
                from: "0xc7652d6f0d7c4a81029800ad94ef4c3a8f809950",
                to: "0x880f820900363c01d103d4c46773216a1a65f5d1",
                blockHash: "0xe1aa864df15b313851446b97ac4ff3b7fbd480f5ce0aac316a3931ad3b51834b",
                blockNumber: 8780939,
                data: "0xf51e6386000000000000000000000000ef44211de3759d8df16db9b88929344cf8a79c7ef34796df55fad70d3c71640adc4ca8a3adce31f44948ea38c898a084cc6c3d09"
            },
            {
                txHash: "0xa8af50e47dfc40bb35bf0b0f5b9cbf789f4cbe3e58cfc6d46b31fce677e5ddb2",
                from: "0x7ae7a909c0ad5ff891bb35a542f32a36a4f4f3b4",
                to: "0x12b306fa98f4cbb8d4457fdff3a0a0a56f07ccdf",
                blockHash: "0xe1aa864df15b313851446b97ac4ff3b7fbd480f5ce0aac316a3931ad3b51834b",
                blockNumber: 8780939,
                data: "0xa9059cbb00000000000000000000000078353563d4af772b5527d2ee6aedd5c3912ef0b900000000000000000000000000000000000000000000002b5e3af16b18800000"
            },
            {
                txHash: "0x1b7166664ab3afb53367d882d3db9388bb4411f6a4136a27c3f18b6981b7ee49",
                from: "0x2a78df9f3e4ec34a58c7a34c55ff355ddf639af4",
                to: "0xb5a0253d9fd39ffd6eff0c95f3d2464c11a9d8af",
                blockHash: "0xe1aa864df15b313851446b97ac4ff3b7fbd480f5ce0aac316a3931ad3b51834b",
                blockNumber: 8780939,
                data: "0x40e800d8000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000390000000000000000000000000000000000000000000000056bc75e2d63100000000000000000000000000000d2f5b58655c3428f2b7b71175fb492a7f1fddc6b00000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000f6466396262356462346132613937630000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b6c75636b794e756d626572000000000000000000000000000000000000000000"
            },
            {
                txHash: "0xfb754b7c4915a00c888f977e04aa4fa3159ceede0b739bdea2d0cb48906c8ffa",
                from: "0x5f7efa06f6380885697683c874db4123f7a3827d",
                to: "0x880f820900363c01d103d4c46773216a1a65f5d1",
                blockHash: "0xe1aa864df15b313851446b97ac4ff3b7fbd480f5ce0bbc316a3931ad3b51834b",
                blockNumber: 8780938,
                data: "0xa3a2a82e00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000003e8b80b0000000000000000000000000000000000000000000000000000000003e8e754000000000000000000000000000000000000000000000000000000003b9aca00000000000000000000000000000000000000000000000000000000000001d4c0000000000000000000000000000000000000000000000000000000000000000b42524f4e5a455f34313533000000000000000000000000000000000000000000"
            },
            {
                txHash: "0x5feb597f641a6f1d30f719993b762d8e4f8eef41f9c7a9f22b0939cf72c537cc",
                from: "0xc7652d6f0d7c4a81029800ad94ef4c3a8f809950",
                to: "0x880f820900363c01d103d4c46773216a1a65f5d1",
                blockHash: "0xe1aa864df15b313851446b97ac4ff3b7fbd480f5ce0bbc316a3931ad3b51834b",
                blockNumber: 8780938,
                data: "0xf51e6386000000000000000000000000ef44211de3759d8df16db9b88929344cf8a79c7ef34796df55fad70d3c71640adc4ca8a3adce31f44948ea38c898a084cc6c3d09"
            },
            {
                txHash: "0xa8aee0e47dfc40bb35bf0b0f5b9cbf789f4cbe3e58cfc6d46b31fce677e5ddb2",
                from: "0x7ae7a909c0ad5ff891bb35a542f32a36a4f4f3b4",
                to: "0x5f7efa06f6380885697683c874db4123f7a3827d",
                blockHash: "0xe1aa864df15b313851446b97ac4ff3b7fbd480f5ce0bbc316a3931ad3b51834b",
                blockNumber: 8780938,
                data: "0xa9059cbb00000000000000000000000078353563d4af772b5527d2ee6aedd5c3912ef0b900000000000000000000000000000000000000000000002b5e3af16b18800000"
            }
        ];
        let blockData = [
            {
                blockHash: "0xe1aa864df15b313851446b97ac4ff3b7fbd480f5ce0aac316a3931ad3b51834b",
                height: 8780939,
                timestamp: 1571619678933,
                txs: [
                    "0xfb754b7c4915a00c888f977e04aa4fa3159c0bde0b739bdea2d0cb48906c8ffa",
                    "0x5feb597f641a6f1d30f719993b762d8e4f889f41f9c7a9f22b0939cf72c537cc",
                    "0xa8af50e47dfc40bb35bf0b0f5b9cbf789f4cbe3e58cfc6d46b31fce677e5ddb2",
                    "0x1b7166664ab3afb53367d882d3db9388bb4411f6a4136a27c3f18b6981b7ee49"
                ]
            },
            {
                blockHash: "0xe1aa864df15b313851446b97ac4ff3b7fbd480f5ce0bbc316a3931ad3b51834b",
                height: 8780938,
                timestamp: 1571619678930,
                txs: [
                    "0xfb754b7c4915a00c888f977e04aa4fa3159ceede0b739bdea2d0cb48906c8ffa",
                    "0x5feb597f641a6f1d30f719993b762d8e4f8eef41f9c7a9f22b0939cf72c537cc",
                    "0xa8aee0e47dfc40bb35bf0b0f5b9cbf789f4cbe3e58cfc6d46b31fce677e5ddb2"
                ]
            }
        ];
        yield db.insertBlocks(blockData.map(db.toBlock));
        yield db.insertTxs(txData.map(db.toTx));
    }));
    it('findBlockByBlockHash test', () => __awaiter(void 0, void 0, void 0, function* () {
        let blockHash = "0xe1aa864df15b313851446b97ac4ff3b7fbd480f5ce0bbc316a3931ad3b51834b";
        let block = (yield db.findBlockByBlockHash(blockHash));
        chai_1.expect(block.blockHash).to.be.equal(blockHash);
    }));
    it('findBlockByBlockHash fail test', () => __awaiter(void 0, void 0, void 0, function* () {
        let blockHash = "0xe1aa864xxxxxxxxxxxxxb97ac4ff3b7fbd480f5ce0bbc316a3931ad3b51834b";
        let block = yield db.findBlockByBlockHash(blockHash);
        chai_1.expect(block).to.be.null;
    }));
    it('findBlockByHeight test', () => __awaiter(void 0, void 0, void 0, function* () {
        let height = 8780938;
        let block = (yield db.findBlockByHeight(height));
        chai_1.expect(block.height).to.be.equal(height);
    }));
    it('findBlockByHeight fail test', () => __awaiter(void 0, void 0, void 0, function* () {
        let height = 8780900;
        let block = yield db.findBlockByHeight(height);
        chai_1.expect(block).to.be.null;
    }));
    it('findLatestBlocks test', () => __awaiter(void 0, void 0, void 0, function* () {
        let blocks = yield db.findLatestBlocksSortByHeight(2);
        chai_1.expect(blocks.length).to.be.equal(2);
        chai_1.expect(blocks[0].height).to.be.equal(8780939);
        chai_1.expect(blocks[1].height).to.be.equal(8780938);
    }));
    it('findBlocksSortByHeight test', () => __awaiter(void 0, void 0, void 0, function* () {
        let blocks = yield db.findBlocksSortByHeight(8780939, 2);
        chai_1.expect(blocks.length).to.be.equal(2);
        chai_1.expect(blocks[0].height).to.be.equal(8780939);
        chai_1.expect(blocks[1].height).to.be.equal(8780938);
        blocks = yield db.findBlocksSortByHeight(8780938, 2);
        chai_1.expect(blocks.length).to.be.equal(1);
        chai_1.expect(blocks[0].height).to.be.equal(8780938);
    }));
    it('findBlocksSortByHeight fail test', () => __awaiter(void 0, void 0, void 0, function* () {
        let blocks = yield db.findBlocksSortByHeight(8780930, 2);
        chai_1.expect(blocks.length).to.be.equal(0);
    }));
    it('findTxByTxHash test', () => __awaiter(void 0, void 0, void 0, function* () {
        let txHash = '0x5feb597f641a6f1d30f719993b762d8e4f8eef41f9c7a9f22b0939cf72c537cc';
        let tx = (yield db.findTxByTxHash(txHash));
        chai_1.expect(tx.txHash).to.be.equal(txHash);
    }));
    it('findBlockByTxHash fail test', () => __awaiter(void 0, void 0, void 0, function* () {
        let txHash = '0x5feb59xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx9c7a9f22b0939cf72c537cc';
        let tx = yield db.findTxByTxHash(txHash);
        chai_1.expect(tx).to.be.null;
    }));
    it('findTxsByAccountSortByBlockNumber test', () => __awaiter(void 0, void 0, void 0, function* () {
        let account = '0x5f7efa06f6380885697683c874db4123f7a3827d';
        let txs = yield db.findTxsByAccountSortByBlockNumber(account, 10);
        chai_1.expect(txs.length).to.be.equal(3);
    }));
    /*
    */
});
