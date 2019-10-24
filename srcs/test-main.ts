import { Server } from "./server";

const mongodbUrl = process.env.MONGODB_URL;
const infuraUrl = process.env.INFURA_WS_URL;

if (mongodbUrl == null) {
	console.error("MONGODB_URL is required");
}

if (infuraUrl == null) {
	console.error("INFURA_WS_URL is required");
}

var server = new Server();
server.start(mongodbUrl!, infuraUrl!);

async function check() {
	async function sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getRandomItem(array: string[]): string {
    	return array[Math.floor(Math.random()*array.length)];
    }
	
	await sleep(3000);
	while(true) {
		await sleep(200);
	    let blocks = await server.findLatestBlocksSortByHeight(10);

		if (blocks.length == 0) {
			continue;
		}

		let latestBlock = blocks[0];

		if (latestBlock.txs.length > 0) {
			let txHash = getRandomItem(latestBlock.txs);

			let tx = await server.findTxByTxHash(txHash);
			if (tx != null) {
				if (tx!.blockHash == latestBlock.blockHash && tx!.blockNumber == latestBlock.height && tx!.txHash == txHash) {
					console.log(latestBlock.height, txHash);
				} else {
					console.error("test error", latestBlock.blockHash, latestBlock.height, txHash, tx);
					console.error(await server.findTxByTxHash(txHash));
					process.exit();
				}
			}		
		}
	}
}

check();

