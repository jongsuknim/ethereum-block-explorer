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
const ws_1 = __importDefault(require("ws"));
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
class HandlerManager {
    constructor() {
        this.handlers = {};
        this.params = {};
        this.defaultHandler = function (d) {
            return __awaiter(this, void 0, void 0, function* () { });
        };
        this.nextId = 100000;
    }
    getId() {
        return this.nextId++;
    }
    registerHandler(id, param, handler) {
        this.handlers[id] = handler;
        this.params[id] = param;
    }
    registerDefaultHandler(handler) {
        this.defaultHandler = handler;
    }
    clearHandler(id) {
        delete this.handlers[id];
        delete this.params[id];
    }
    handle(dataStr) {
        // console.log("handle", ">>", dataStr);
        let data = JSON.parse(dataStr);
        if (data.id) {
            if (this.handlers[data.id]) {
                this.handlers[data.id](data);
            }
            else {
                console.error('no handler error');
            }
        }
        else {
            // console.log(data);
            // console.log(this.defaultHandler);
            this.defaultHandler(data);
        }
    }
}
class EthereumWrapper {
    constructor(blockInfoHandler) {
        this.blockInfoHandler = blockInfoHandler;
        this.handlerManager = new HandlerManager();
        this.handlerManager.registerDefaultHandler(this.newBlockHandler.bind(this));
        // this.handlerManager.registerDefaultHandler(this.newBlockHandler);
    }
    request(param, handler) {
        let id = this.handlerManager.getId();
        param['id'] = id;
        this.handlerManager.registerHandler(id, param, handler);
        this.ws.send(JSON.stringify(param));
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    reqBlockInfo(blockHash) {
        let param = {
            "jsonrpc": "2.0",
            "method": "eth_getBlockByHash",
            "params": [blockHash, true]
        };
        this.request(param, (data) => __awaiter(this, void 0, void 0, function* () {
            // console.log(data);
            if (data.result) {
                yield this.blockInfoHandler(data.result);
            }
            else {
                yield sleep(1000);
                this.reqBlockInfo(blockHash);
            }
        }));
    }
    newBlockHandler(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.method == 'eth_subscription' && data.params && data.params.subscription == '0x1' && data.params.result && data.params.result.hash) {
                yield sleep(3000);
                this.reqBlockInfo(data.params.result.hash);
            }
        });
    }
    start(url) {
        this.ws = new ws_1.default(url);
        this.ws.on('open', () => {
            let id = 1;
            let param = {
                "jsonrpc": "2.0",
                "id": id,
                "method": "eth_subscribe",
                "params": ["newHeads"]
            };
            this.handlerManager.registerHandler(id, param, (d) => __awaiter(this, void 0, void 0, function* () {
                // console.log("dummy", d);
            }));
            this.ws.send(JSON.stringify(param));
        });
        this.ws.on('message', (data) => {
            this.handlerManager.handle(data);
            if (data.id) {
                this.handlerManager.clearHandler(data.id);
            }
        });
    }
}
exports.EthereumWrapper = EthereumWrapper;
