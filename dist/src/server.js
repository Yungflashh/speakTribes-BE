"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: { origin: '*' },
});
io.of('/progress').on('connection', (socket) => {
    console.log('ws connected', socket.id);
    socket.on('progress:join', (payload) => {
        const room = `${payload.courseId}:${payload.lessonId}`;
        socket.join(room);
    });
    socket.on('progress:update', (payload) => {
        const room = `${payload.courseId}:${payload.lessonId}`;
        socket.to(room).emit('progress:sync', payload);
    });
});
const port = Number(env_1.env.PORT) || 4000;
server.listen(port, () => console.log(`Server listening on ${port}`));
