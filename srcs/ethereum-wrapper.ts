import WebSocket from 'ws';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class HandlerManager {
    private handlers: object = {};
    private params: object = {};

    private defaultHandler: (object) => Promise<void> = async function(d) {};

    constructor() {

    }

    private nextId: number = 100000;
    getId(): number {
        return this.nextId++;
    }

    registerHandler(id: number, param: object, handler: (object) => Promise<void>) {
        this.handlers[id] = handler;
        this.params[id] = param;
    }

    registerDefaultHandler(handler: (object) => Promise<void>) {
        this.defaultHandler = handler;
    }

    clearHandler(id: number) {
        delete this.handlers[id];
        delete this.params[id];
    }
    
    handle(dataStr: string) {
        // console.log("handle", ">>", dataStr);
        let data = JSON.parse(dataStr);

        if (data.id) {
            if (this.handlers[data.id]) {
                this.handlers[data.id](data);
            } else {
                console.error('no handler error');
            }
        } else {
            // console.log(data);
            // console.log(this.defaultHandler);
            this.defaultHandler(data)
        }
    }
}

class EthereumWrapper {
    infuraConn: any;
    handlerManager: HandlerManager = new HandlerManager();
    ws: any;

    constructor(public blockInfoHandler: (object) => Promise<void>) {
        this.handlerManager.registerDefaultHandler(this.newBlockHandler.bind(this));
        // this.handlerManager.registerDefaultHandler(this.newBlockHandler);
    }

    private request(param: object, handler: (object) => Promise<void>) {
        let id = this.handlerManager.getId();
        param['id'] = id;
        this.handlerManager.registerHandler(id, param, handler);
        this.ws.send(JSON.stringify(param));
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private reqBlockInfo(blockHash: string) {
        let param = {
            "jsonrpc":"2.0",
            "method":"eth_getBlockByHash",
            "params": [blockHash, true]
        }

        this.request(param, async (data) => {
            // console.log(data);
            if (data.result) {
                await this.blockInfoHandler(data.result);
            } else {
                await sleep(1000);
                this.reqBlockInfo(blockHash);
            }
        });
    }

    private async newBlockHandler(data) {
        if (data.method == 'eth_subscription' && data.params && data.params.subscription == '0x1' && data.params.result && data.params.result.hash) {
            await sleep(3000);
            this.reqBlockInfo(data.params.result.hash);
        }
    }

    start(url: string) {
        this.ws = new WebSocket(url);

        this.ws.on('open', () => {
            let id = 1;
            let param = {
                "jsonrpc":"2.0",
                "id": id, 
                "method": "eth_subscribe", 
                "params": ["newHeads"]        
            }

            this.handlerManager.registerHandler(id, param, async (d) => {
                // console.log("dummy", d);
            });

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

export { EthereumWrapper }

