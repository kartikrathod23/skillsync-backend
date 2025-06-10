import express from 'express'
import connectDB from './config/db.js';
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import sessionRoutes from './routes/sessionRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { Server } from 'socket.io';
import http from 'http';

const app = express()

dotenv.config();
connectDB();

app.use(cors())
app.use(express.json())
app.use('/api/auth',authRoutes)

app.use('/api',userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/messages', messageRoutes);


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST","PUT"],
  }
});

// Store connected users
let onlineUsers = {};

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('registerUser', (userId) => {
    onlineUsers[userId] = socket.id;
    console.log(`✅ Registered user: ${userId}`);
  });

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

   socket.on('sendMessage', ({ roomId, message }) => {
    io.to(roomId).emit('receiveMessage', message);
  });


  socket.on('disconnect', () => {
    Object.keys(onlineUsers).forEach((userId) => {
      if (onlineUsers[userId] === socket.id) delete onlineUsers[userId];
    });
    console.log('User disconnected');
  });
});

app.set("io", io);

const port = process.env.PORT;
// app.listen(port,()=> console.log(`Server running on port ${port}`));
server.listen(port, () => console.log(`Server running on port ${port}`));
