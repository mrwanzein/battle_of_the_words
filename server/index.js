import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { generateRoomId } from './utils.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5173",
        methods: ["GET"]
    }
});

const activeRooms = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on("get socket id", callback => {
        try {
            callback({
                status: "ok",
                socketId: socket.id
            })
        } catch (e) {
            callback({
                status: "error"
            });
        }
    });

    socket.on("get battle rooms", callback => {
        try {
            callback({
                status: "ok",
                rooms: Object.entries(activeRooms)
            })
        } catch (e) {
            callback({
                status: "error"
            });
        }
    });

    socket.on("create a battle room", async (roomName, callback) => {
        try {
            await socket.join(roomName);
            
            if (!activeRooms[roomName]) {
                activeRooms[roomName] = {owner: socket.id, id: generateRoomId(), participants: [socket.id]}
            } else {
                throw new Error("room already exists");
            }

            const updatedRooms = Object.entries(activeRooms);

            callback({
                status: "ok",
                rooms: updatedRooms
            });

            socket.broadcast.emit("auto refresh rooms", updatedRooms);
        } catch (e) {
            let status = "error";
            let errorMessage = null;

            if (e.message === "room already exists") {
                status = "warning";
                errorMessage = "The room you're trying to create already exists. Please try another name.";
            }
            
            callback({
                status,
                errorMessage
            });
        }
    });

    socket.on("join battle room", async (roomName, callback) => {
        try {
            await socket.join(roomName);
            
            if (activeRooms[roomName]) {
                activeRooms[roomName].participants.push(socket.id);
            } else {
                throw new Error("room doesn't exists");
            }

            const updatedRooms = Object.entries(activeRooms);

            callback({
                status: "ok",
                rooms: updatedRooms
            });

            socket.broadcast.emit("auto refresh rooms", updatedRooms);
        } catch (e) {
            let status = "error";
            let errorMessage = null;

            if (e.message === "room doesn't exists") {
                status = "warning";
                errorMessage = "The room you're trying to join doesn't exists anymore. Please try another room.";
            }
            
            callback({
                status,
                errorMessage
            });
        }
    });

    socket.on("delete battle room", async (roomName, callback) => {
        try {
            await socket.leave(roomName);
            
            if (activeRooms[roomName]) {
                delete activeRooms[roomName];
            } else {
                throw new Error("room doesn't exists");
            }

            const updatedRooms = Object.entries(activeRooms);

            callback({
                status: "ok",
                rooms: updatedRooms
            });

            socket.broadcast.emit("auto refresh rooms", updatedRooms);
        } catch (e) {
            let status = "error";
            let errorMessage = null;

            if (e.message === "room doesn't exists") {
                status = "warning";
                errorMessage = "The room you're trying to delete doesn't exists anymore";
            }
            
            callback({
                status,
                errorMessage
            });
        }
    });

    socket.on("disconnect", reason => {
        for (const roomName in activeRooms) {
            const participants = activeRooms[roomName].participants;
            
            if (participants.length === 1 && participants.includes(socket.id)) {
                delete activeRooms[roomName];
            }

            if (participants.length === 2 && participants.includes(socket.id)) {
                participants.splice(participants.indexOf(socket.id), 1);
            }
        }

        socket.broadcast.emit("auto refresh rooms", Object.entries(activeRooms));

        console.log(`user disconnected. reason: ${reason}`);
    });
});

httpServer.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});