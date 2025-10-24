import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamps: { type: Date, default: Date.now }
}, { timestamps: true });
const Message = mongoose.model("Message", messageSchema);
export default Message;