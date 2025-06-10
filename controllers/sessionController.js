import Session from '../models/Session.js';
import mongoose from 'mongoose';

export const requestSession = async (req, res) => {
  const { recipientId, topic, scheduledAt, note } = req.body;

  try {
    const newSession = await Session.create({
      requester: req.user._id,
      recipient: recipientId,
      topic,
      scheduledAt,
      note
    });

    const io = req.app.get('io');
    io.to(recipientId).emit('newSessionRequest', populatedSession);

    res.status(201).json(newSession);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReceivedSession = async (req, res) => {
  try {
    const sessions = await Session.find({ recipient: req.user._id, status: 'pending' })
      .populate('requester', 'fullname')
      .sort({ scheduledAt: 1 });

    res.json(sessions);
  } catch (err) {
    console.error('Error in getReceivedSession:', err); // This will show in your backend terminal
    res.status(500).json({ error: err.message });
  }
};


export const getAcceptedSessions = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id); // force ObjectId type

    const sessions = await Session.find({
      status: 'accepted',
      $or: [
        { requester: userId },
        { recipient: userId }
      ]
    })
      .populate('requester', 'fullname _id')
      .populate('recipient', 'fullname _id')
      .sort({ scheduledAt: 1 });

    res.json(sessions);
  } catch (err) {
    console.error('Error in getAcceptedSessions:', err);
    res.status(500).json({ error: err.message });
  }
};


export const respondToSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('requester', 'fullname _id')
      .populate('recipient', 'fullname _id');

    if (!session || session.recipient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    session.status = req.body.status;
    await session.save();

    const io = req.app.get('io');
    if (req.body.status === 'accepted') {
      io.to(session.requester._id.toString()).emit('sessionAccepted', session);
    }

    res.json({ message: 'Session Updated', session });
  } catch (err) {
    console.error('Error in respondToSession:', err);
    res.status(500).json({ error: err.message });
  }
};


export const getSessionBetweenUsers = async (req, res) => {
  try {
    const session = await Session.findOne({
      $or: [
        { requester: req.user._id, recipient: req.params.recipientId },
        { requester: req.params.recipientId, recipient: req.user._id }
      ]
    });
    res.json(session || null);
  }
  catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('requester', 'fullname _id')
      .populate('recipient', 'fullname _id');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const markSessionCompleted = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Allow only participants to mark it complete
    if (![session.requester.toString(), session.recipient.toString()].includes(req.user._id.toString())) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    session.completed = true;
    session.completedAt = new Date();
    await session.save();

    res.json({ message: 'Session marked completed', session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const completedSessions = await Session.find({
      completed: true,
      $or: [
        { requester: userId },
        { recipient: userId }
      ]
    });

    const stats = {
      completedSessions: completedSessions.length,
      skillsOffered: completedSessions.filter(s => s.recipient.toString() === userId.toString()).length,
      skillsLearned: completedSessions.filter(s => s.requester.toString() === userId.toString()).length,
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




