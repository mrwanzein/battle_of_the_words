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
                activeRooms[roomName] = {
                    owner: socket.id,
                    id: generateRoomId(),
                    participants: [socket.id],
                    [socket.id]: {isReady: false, rematch: false}
                }
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
        const thisRoom = activeRooms[roomName];
        
        try {
            await socket.join(roomName);
            
            if (thisRoom) {
                thisRoom.participants.push(socket.id);
                thisRoom[socket.id] = {isReady: false};
                
                if (thisRoom.participants.length === 2) {
                    io.to(roomName).emit("opponent has joined", {updatedRoomInfo: [roomName, thisRoom]});
                }
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

    socket.on("send typing words to opponent", ({inputVal, inputInstanceNumber, roomName}, callback) => {
        try {
            socket.to(roomName).emit("show typing words from opponent", {inputVal, inputInstanceFromServer: inputInstanceNumber});

            callback({
                status: "ok"
            });
        } catch (e) {
            callback({
                status: "error"
            });
        }
    });

    socket.on("send entered word to opponent", ({
        inputtedWord,
        inputInstanceNumber,
        attacked_input_id,
        roomName,
        arrowId,
        arrowTimerId,
        playerStatus
    }, callback) => {
        const roomObj = activeRooms[roomName];
        roomObj[socket.id][`input_${inputInstanceNumber}`] = {arrowId, arrowTimerId}
        const opponentId = roomObj.participants.find(participant => participant !== socket.id);

        try {
            socket.to(roomName).emit("process entered word from opponent", {
                inputtedWord,
                inputInstanceFromServer: inputInstanceNumber,
                attacked_input_id,
                oldArrowToDelete: roomObj[opponentId][`input_${attacked_input_id}`],
                playerStatus
            });

            callback({
                status: "ok"
            });
        } catch (e) {
            callback({
                status: "error"
            });
        }
    });

    socket.on("clear old attacking word", ({attacked_input_id, roomName}, callback) => {
        try {
            socket.to(roomName).emit("clear old attacking word", {attacked_input_id});

            callback({
                status: "ok"
            });
        } catch (e) {
            callback({
                status: "error"
            });
        }
    });

    socket.on("player is ready", ({roomName}, callback) => {
        const thisRoom = activeRooms[roomName];
        const participants = thisRoom.participants;

        thisRoom[socket.id].isReady = true;
        
        try {
            socket.to(roomName).emit("player is ready");
            
            if (participants.length === 2 && thisRoom[participants[0]].isReady && thisRoom[participants[1]].isReady) {
                thisRoom[participants[0]].isReady = false;
                thisRoom[participants[1]].isReady = false;
                io.to(roomName).emit("players are ready to battle online");
            }

            callback({
                status: "ok"
            });
        } catch (e) {
            callback({
                status: "error"
            });
        }
    });

    socket.on("player wants rematch", ({roomName}, callback) => {
        const thisRoom = activeRooms[roomName];
        const participants = thisRoom.participants;

        thisRoom[socket.id].rematch = true;
        
        try {
            socket.to(roomName).emit("player wants rematch");

            if (thisRoom[participants[0]].rematch && thisRoom[participants[1]].rematch) {
                thisRoom[participants[0]].rematch = false;
                thisRoom[participants[1]].rematch = false;
                io.to(roomName).emit("both player want rematch");
            }

            callback({
                status: "ok"
            });
        } catch (e) {
            callback({
                status: "error"
            });
        }
    });

    socket.on("opponent has surrendered", ({roomName}, callback) => {
        try {
            socket.to(roomName).emit("opponent has surrendered");

            callback({
                status: "ok"
            });
        } catch (e) {
            callback({
                status: "error"
            });
        }
    });

    socket.on("player has left the match", ({roomName}, callback) => {
        const thisRoom = activeRooms[roomName];

        if (thisRoom.participants.length === 2) {
            thisRoom.participants = thisRoom.participants.filter(participant => participant !== socket.id);
            thisRoom.owner = thisRoom.participants[0];
            delete thisRoom[socket.id];
        } else {
            delete activeRooms[roomName];
        }
        
        const updatedRooms = Object.entries(activeRooms);

        try {
            socket.to(roomName).emit("player has left the match", {updatedRoomState: [roomName, thisRoom]});
            socket.leave(roomName);
            io.emit("auto refresh rooms", updatedRooms);

            callback({
                status: "ok"
            });
        } catch (e) {
            callback({
                status: "error"
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