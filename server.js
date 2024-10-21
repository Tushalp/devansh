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
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/room', roomRoutes(io)); 

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('chatMessage', (msg) => {
    if (msg && msg.roomId && msg.text) {  
      io.to(msg.roomId).emit('message', msg);
    } else {
      console.error('Invalid message format', msg);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST 
server.listen(PORT,HOST, () => console.log(`Backend running on http://${HOST}:${PORT}`));

