import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { env } from './config/env';

const server = http.createServer(app);
const io = new Server(server, {
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

const port = Number(env.PORT) || 4000;
server.listen(port, () => console.log(`Server listening on ${port}`));
