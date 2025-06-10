import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: String,
  scheduledAt: Date,
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  note: String,
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: Date,
}, { timestamps: true });

export default mongoose.model('Session', sessionSchema);
