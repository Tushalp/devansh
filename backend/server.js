const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/room');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/room', roomRoutes(io));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const rooms = {}; 

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);


  socket.on('joinRoom', ({ roomId, username }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    rooms[roomId].push({ socketId: socket.id, username });
    socket.join(roomId);
    console.log(`${username} (${socket.id}) joined room: ${roomId}`);

   
    io.to(roomId).emit('message', `${username} joined the room`);
  });

  
  socket.on('chatMessage', ({ roomId, username, text }) => {
    if (text && roomId && username) {
      const message = { username, text, time: new Date().toISOString() };
      io.to(roomId).emit('message', message);
    } else {
      console.error('Invalid message format', { roomId, username, text });
    }
  });

  

 
  socket.on('disconnect', () => {
    let disconnectedUser = null;
    let roomIdOfDisconnectedUser = null;

  
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(user => {
        if (user.socketId === socket.id) {
          disconnectedUser = user.username;
          roomIdOfDisconnectedUser = roomId;
          return false;
        }
        return true;
      });

    
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }

    if (disconnectedUser && roomIdOfDisconnectedUser) {
      console.log(`Client disconnected: ${disconnectedUser} from room ${roomIdOfDisconnectedUser}`);
      io.to(roomIdOfDisconnectedUser).emit('message', `${disconnectedUser} has left the room`);
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
