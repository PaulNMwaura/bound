import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderPicture: { type: String },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: {type: String},
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Message || mongoose.model('Message', messageSchema);