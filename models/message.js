import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderUsername: { type: String },
  senderProfilePicture: {type: String},
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverUsername: {type: String},
  receiverProfilePicture: {type: String},
  content: {type: String},
  deletedBy: {type: [mongoose.Schema.Types.ObjectId],default: []},
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Message || mongoose.model('Message', messageSchema);