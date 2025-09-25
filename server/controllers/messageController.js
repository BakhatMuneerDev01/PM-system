import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
/**
 * Get all conversations for the authenticated user
 * @route GET /api/messages/conversations
 * @access Private
 */
const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ participants: req.user._id })
            .populate('participants', 'username email profileImage role')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        res.json(conversations);
    } catch (error) {
        console.error('Get conversations error:', error.message);
        res.status(500).json({ message: 'Server error getting conversations' });
    }
}
/**
 * Create a new conversation
 * @route POST /api/messages/conversations
 * @access Private
 */
const createConversation = async (req, res) => {
    try {
        const { participants, name, type = 'direct' } = req.body;
        if (!participants || participants.length === 0) {
            return res.status(400).json({ message: 'Participants are required' });
        }
        // Add the current user to participants if not already included
        const allParticipants = [...new Set([req.user._id.toString(), ...participants])];
        // For direct conversations, check if one already exists
        if (type === 'direct' && allParticipants.length === 2) {
            const existingConversation = await Conversation.findOne({
                type: 'direct',
                participants: { $all: allParticipants, $size: 2 }
            }).populate('participants', 'username email profileImage role');

            if (existingConversation) {
                return res.json(existingConversation);
            }
        }

        const conversation = await Conversation.create({
            participants: allParticipants,
            name,
            type
        });

        const populatedConversation = await Conversation.findById(conversation._id)
            .populate('participants', 'username email profileImage role');

        res.status(201).json(populatedConversation);

    } catch (error) {
        console.error('Create conversation error:', error.message);
        res.status(500).json({ message: 'Server error creating conversation' });
    }
}
/**
 * Get messages for a specific conversation
 * @route GET /api/messages/conversations/:conversationId/messages
 * @access Private
 */
const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        // Verify user is part of the conversation
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: req.user._id
        });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const messages = await Message.find({ conversation: conversationId })
            .populate('sender', 'username email profileImage role')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        // Reverse to get chronological order (oldest first)
        messages.reverse();
        const total = await Message.countDocuments({ conversation: conversationId });
        res.json({
            messages,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalMessages: total,
                hasNextPage: skip + messages.length < total,
                hasPrevPage: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error('Get messages error:', error.message);
        res.status(500).json({ message: 'Server error getting messages' });
    }
}
/**
 * Send a message to a conversation
 * @route POST /api/messages/conversations/:conversationId/messages
 * @access Private
 */
const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      content: content.trim()
    });

    // Update conversation's lastMessage
    conversation.lastMessage = message._id;
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username email profileImage role');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error.message);
    res.status(500).json({ message: 'Server error sending message' });
  }
};
/**
 * Delete a message
 * @route DELETE /api/messages/:messageId
 * @access Private
 */
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only the sender can delete their message
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await message.deleteOne();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error.message);
    res.status(500).json({ message: 'Server error deleting message' });
  }
};

export { getConversations, createConversation, getMessages, sendMessage, deleteMessage };