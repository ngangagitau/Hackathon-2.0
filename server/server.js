const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
import providerRoutes from './routes/providerRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

console.log('🔍 Loading authRoutes...');
const authRoutes = require('./routes/authRoutes');
console.log('✅ Loaded authRoutes');

console.log('🔍 Loading postRoutes...');
const postRoutes = require('./routes/postRoutes');
console.log('✅ Loaded postRoutes');

console.log('🔍 Loading categoryRoutes...');
const categoryRoutes = require('./routes/categoryRoutes');
console.log('✅ Loaded categoryRoutes');

console.log('🧪 typeof authRoutes:', typeof authRoutes);
console.log('🧪 typeof postRoutes:', typeof postRoutes);
console.log('🧪 typeof categoryRoutes:', typeof categoryRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);

// Real-time chat logic
let onlineUsers = [];

io.on('connection', (socket) => {
  console.log('🟢 New user connected: ' + socket.id);

  socket.on('join', (username) => {
    onlineUsers.push({ socketId: socket.id, username });
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('sendMessage', (messageData) => {
    io.emit('receiveMessage', messageData);
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected: ' + socket.id);
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
    io.emit('onlineUsers', onlineUsers);
  });
});

// DB & Server
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern_blog')
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
