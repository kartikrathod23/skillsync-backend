import express from 'express';
import { protect } from '../middlewares/authMiddlewares.js';
import Message from '../models/Message.js';
import ChatRoom from '../models/ChatRoom.js';

const router = express.Router();

// Send and save a message
router.post('/', protect, async (req, res) => {
  const { receiver, content } = req.body;

  const message = await Message.create({
    sender: req.user._id,
    receiver,
    content
  });

  res.status(201).json(message);
});

// Get messages between 2 users
router.get('/:userId', protect, async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user._id },
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
});

router.post('/room', protect, async (req, res) => {
  const { userId } = req.body;

  let room = await ChatRoom.findOne({
    participants: { $all: [req.user._id, userId] }
  });

  if (!room) {
    room = await ChatRoom.create({
      participants: [req.user._id, userId]
    });
  }

  res.json(room);
});

router.get('/rooms/list', protect, async (req, res) => {
  const rooms = await ChatRoom.find({ participants: req.user._id }).populate('participants', 'fullname _id');

  const roomData = await Promise.all(
    rooms.map(async (room) => {
      const otherUser = room.participants.find(p => p._id.toString() !== req.user._id.toString());

      const lastMessage = await Message.findOne({
        $or: [
          { sender: req.user._id, receiver: otherUser._id },
          { sender: otherUser._id, receiver: req.user._id },
        ]
      }).sort({ createdAt: -1 });

      return {
        roomId: room._id,
        user: otherUser,
        lastMessage: lastMessage?.content || '',
        lastTimestamp: lastMessage 
        ? `${lastMessage.createdAt.toLocaleDateString()} ${lastMessage.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
        : '',

      };
    })
  );

  const sortedRooms = roomData.sort((a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp));

  res.json(sortedRooms);
});

export default router;
