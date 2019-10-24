"use strict";
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
