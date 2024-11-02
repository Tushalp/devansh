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

// Handle socket connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle user joining a room
  socket.on('joinRoom', ({ roomId, username }) => {
    socket.join(roomId); // Join the specified room
    console.log(`${username} joined room: ${roomId}`);
  });

  // Handle incoming chat messages
  socket.on('chatMessage', ({ roomId, username, text }) => {
    console.log('Received message:', { roomId, username, text });
    const message = { username, text, time: new Date().toISOString() };
    io.to(roomId).emit('message', message); // Emit to the specific room
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
