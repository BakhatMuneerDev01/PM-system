import express from 'express';
import {
    getConversations,
    createConversation,
    getMessages,
    sendMessage,
    deleteMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All message routes require authentication
router.use(protect);

// Conversation routes
router.route('/conversations')
    .get(getConversations)
    .post(createConversation);

// Message routes
router.route('/conversations/:conversationId/messages')
    .get(getMessages)
    .post(sendMessage);

router.route('/:messageId')
    .delete(deleteMessage);

export default router;