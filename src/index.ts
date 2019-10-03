import { createServer, Server } from 'http';
import * as socketIO from 'socket.io';
import { rootRouter } from './controller';
import { ExpressApp } from './server';
import { SocketServer } from './socket';
import { errorMiddleware } from './util/ErrorProcess';

export let socket: SocketServer;
const port = 5000;

const server = ExpressApp.bootStart();
server.use('/', rootRouter);
server.use(errorMiddleware);

const http: Server = createServer(server).listen(port);

socket = new SocketServer(socketIO.listen(http));

export default http;
// supervisor server.js
