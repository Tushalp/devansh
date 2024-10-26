const express = require('express');
const Room = require('../models/Room');
const auth = require('../middleware/auth');

const createRoomRoutes = (io) => {
  const router = express.Router();

  //room creation 
  router.post('/create', auth, async (req, res) => {
    const { roomId } = req.body;
  
   
    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' });
    }
    try {
   
      const existingRoom = await Room.findOne({ roomId });
      if (existingRoom) {
        return res.status(400).json({ error: 'Room ID already exists' });
      }

      const room = new Room({
        roomId,
        createdBy: req.user._id,  
        users: [req.user._id],   
      });
  
   
      await room.save();
  
     
      io.emit('roomCreated', room);
  
   
      io.to(roomId).emit('userJoined', req.user.name);
  
   
      return res.status(201).json(room);
  
    } catch (error) {
      console.error('Room creation error:', error);
      return res.status(500).json({ error: 'Room creation failed' });
    }
  });
  
  // Room Joining
  router.post('/join',auth, async (req, res) => {
    const { roomId } = req.body;
  
    try {
      const room = await Room.findOne({ roomId });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      if (!room.users.includes(req.user._id)) {
        room.users.push(req.user._id);
        await room.save();
        io.to(roomId).emit('userJoined', req.user.name); 
      }
  
      return res.status(200).json(room);
    } catch (error) {
      console.error('Error joining room:', error);
      return res.status(500).json({ error: 'Failed to join room' });
    }
  });

  // room chat
  router.post('/chat',auth,async (req,res)=>{
    
    try {
      const { roomId,userId} = req.body;
      
      

    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: "room chat failed",
        error

      })
    }
  })


  return router;

};

module.exports = createRoomRoutes;