require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

let chatHistory = [];

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.emit('chatHistory', chatHistory);
  
  socket.on('sendMessage', (msg) => {
    const message = {
      id: Date.now(),
      text: msg.text,
      sender: msg.sender || 'Anonymous',
      timestamp: new Date().toISOString()
    };
    
    chatHistory.push(message);
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
