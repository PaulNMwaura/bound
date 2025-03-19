require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',  // Allow the frontend at localhost:3000
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
});  // Set up Socket.io with CORS

// Allow CORS for frontend connection
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB")).catch(err => console.log(err));

// Create a MongoDB Schema for chat messages
const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  content: String,
  status: { type: String, default: 'unread' }, // Read status
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

// Users mapping to store connected users' socket IDs
const users = {};  // Store username -> socket ID mapping
const messageQueue = {};  // Store offline messages for users

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for user login and store their username with socket ID
  socket.on('login', (username) => {
    users[username] = socket.id;  // Map username to socket ID
    console.log(`${username} logged in with socket ID: ${socket.id}`);

    // Check if there are any queued messages for this user and send them
    if (messageQueue[username]) {
      messageQueue[username].forEach(message => {
        socket.emit('receiveMessage', message);  // Send queued messages
      });
      // Clear the queued messages after sending
      delete messageQueue[username];
    }
  });

  // When a message is sent, save it to MongoDB and emit it to the receiver
  socket.on('sendMessage', async (messageData) => {
    const { sender, receiver, content } = messageData;

    // Save the message to MongoDB
    const newMessage = new Message({
      sender,
      receiver,
      content,
    });

    try {
      await newMessage.save();

      // Send the message to the receiver if they are connected
      const receiverSocketId = users[receiver];  // Get receiver's socket ID
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', newMessage);  // Send to receiver
      } else {
        console.log(`Receiver ${receiver} is not online`);

        // Queue the message for the receiver if they are not online
        if (!messageQueue[receiver]) {
          messageQueue[receiver] = [];
        }
        messageQueue[receiver].push(newMessage);  // Queue the message
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

    // Listen for the 'readMessage' event to mark messages as read
    socket.on('readMessage', async (messageId) => {
        try {
        // Update the message status to 'read' in MongoDB
        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { status: 'read' },
            { new: true }
        );
    
        // Notify the sender that the message was read
        const senderSocketId = users[updatedMessage.sender];
        if (senderSocketId) {
            io.to(senderSocketId).emit('messageRead', updatedMessage);
        }
        } catch (error) {
        console.error('Error updating message read status:', error);
        }
  });
  // Handle user disconnect
  socket.on('disconnect', () => {
    // Remove the user from the users object on disconnect
    for (let username in users) {
      if (users[username] === socket.id) {
        delete users[username];
        console.log(`${username} disconnected`);
      }
    }
  });
});

app.get('/messages', async (req, res) => {
    const { sender, receiver } = req.query;
  
    try {
      // Fetch all messages between sender and receiver, in either direction
      const messages = await Message.find({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      }).sort({ timestamp: 1 }); // Sort messages by timestamp ascending
  
      // Send the messages as a JSON response
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Error fetching messages' });
    }
});
  

// Start the server
server.listen(3001, () => {
  console.log("Server running on port 3001");
});
