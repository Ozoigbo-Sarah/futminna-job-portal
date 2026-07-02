const Message = require('../models/Message');
const User = require('../models/User');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      content
    });

    await message.save();
    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    })
    .populate('sender', 'name role')
    .populate('receiver', 'name role')
    .sort({ createdAt: -1 });

    // Get unique conversations
    const conversations = [];
    const seen = new Set();

    messages.forEach(msg => {
      const otherId = msg.sender._id.toString() === req.user.id 
        ? msg.receiver._id.toString() 
        : msg.sender._id.toString();
      
      if (!seen.has(otherId)) {
        seen.add(otherId);
        conversations.push({
          user: msg.sender._id.toString() === req.user.id ? msg.receiver : msg.sender,
          lastMessage: msg.content,
          createdAt: msg.createdAt
        });
      }
    });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all alumni and employers (for graduates to browse)
exports.getAlumni = async (req, res) => {
  try {
    const contacts = await User.find({ 
      role: { $in: ['alumni', 'employer'] } 
    }).select('-password');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      isRead: false
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};