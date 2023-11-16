import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5173",
        methods: ["GET"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

httpServer.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});