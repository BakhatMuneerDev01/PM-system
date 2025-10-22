import React, { useState, useEffect } from 'react';
import {
  Search, Send, Paperclip, Smile, MoreVertical, Phone, Video,
  User, Clock, Check, CheckCheck, ArrowLeft, Image, File, MessageSquare
} from 'lucide-react';
import { Title, Input, Button } from '../components/ui/base';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Messaging = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for conversations
  const mockConversations = [
    {
      id: 1,
      type: 'direct',
      participants: [
        { id: 2, name: 'Dr. Sarah Johnson', role: 'Cardiologist', online: true, lastSeen: '2 min ago' },
        { id: user.id, name: user.username, role: user.role }
      ],
      lastMessage: {
        content: 'I have reviewed the patient reports, everything looks good.',
        timestamp: '10:30 AM',
        sender: 2,
        read: true
      },
      unreadCount: 0
    },
    {
      id: 2,
      type: 'direct',
      participants: [
        { id: 3, name: 'Dr. Michael Chen', role: 'Neurologist', online: false, lastSeen: '1 hour ago' },
        { id: user.id, name: user.username, role: user.role }
      ],
      lastMessage: {
        content: 'Can we schedule a meeting to discuss the case?',
        timestamp: 'Yesterday',
        sender: user.id,
        read: true
      },
      unreadCount: 0
    },
    {
      id: 3,
      type: 'direct',
      participants: [
        { id: 4, name: 'Dr. Emily Davis', role: 'Pediatrician', online: true, lastSeen: '5 min ago' },
        { id: user.id, name: user.username, role: user.role }
      ],
      lastMessage: {
        content: 'The test results came back positive.',
        timestamp: '2 days ago',
        sender: 4,
        read: false
      },
      unreadCount: 2
    },
    {
      id: 4,
      type: 'group',
      name: 'Emergency Response Team',
      participants: [
        { id: 2, name: 'Dr. Sarah Johnson', role: 'Cardiologist' },
        { id: 3, name: 'Dr. Michael Chen', role: 'Neurologist' },
        { id: 4, name: 'Dr. Emily Davis', role: 'Pediatrician' },
        { id: user.id, name: user.username, role: user.role }
      ],
      lastMessage: {
        content: 'Emergency protocol activated for patient in Ward 4B.',
        timestamp: '1 hour ago',
        sender: 2,
        read: true
      },
      unreadCount: 0
    }
  ];

  // Mock messages data
  const mockMessages = {
    1: [
      {
        id: 1,
        sender: 2,
        content: 'Hello! I wanted to follow up on the patient case we discussed yesterday.',
        timestamp: '9:15 AM',
        read: true,
        type: 'text'
      },
      {
        id: 2,
        sender: user.id,
        content: 'Yes, I have the reports ready. The patient responded well to the treatment.',
        timestamp: '9:20 AM',
        read: true,
        type: 'text'
      },
      {
        id: 3,
        sender: 2,
        content: 'That\'s great news. I have reviewed the patient reports, everything looks good.',
        timestamp: '10:30 AM',
        read: true,
        type: 'text'
      }
    ],
    2: [
      {
        id: 1,
        sender: 3,
        content: 'Hi there! I need to consult about a complex neurological case.',
        timestamp: 'Yesterday, 3:45 PM',
        read: true,
        type: 'text'
      },
      {
        id: 2,
        sender: user.id,
        content: 'Sure, I\'d be happy to help. Can you share the patient details?',
        timestamp: 'Yesterday, 4:20 PM',
        read: true,
        type: 'text'
      },
      {
        id: 3,
        sender: user.id,
        content: 'Can we schedule a meeting to discuss the case?',
        timestamp: 'Yesterday, 5:30 PM',
        read: true,
        type: 'text'
      }
    ],
    3: [
      {
        id: 1,
        sender: 4,
        content: 'Good morning! The lab tests for patient John Doe are complete.',
        timestamp: '2 days ago, 11:15 AM',
        read: true,
        type: 'text'
      },
      {
        id: 2,
        sender: user.id,
        content: 'What were the findings?',
        timestamp: '2 days ago, 11:30 AM',
        read: true,
        type: 'text'
      },
      {
        id: 3,
        sender: 4,
        content: 'The test results came back positive.',
        timestamp: '2 days ago, 2:45 PM',
        read: false,
        type: 'text'
      }
    ],
    4: [
      {
        id: 1,
        sender: 2,
        content: 'Team, we have an emergency situation in Ward 4B.',
        timestamp: '1 hour ago, 3:15 PM',
        read: true,
        type: 'text'
      },
      {
        id: 2,
        sender: 3,
        content: 'What\'s the patient condition?',
        timestamp: '1 hour ago, 3:16 PM',
        read: true,
        type: 'text'
      },
      {
        id: 3,
        sender: 2,
        content: '65-year-old male, chest pain, BP 180/110. Emergency protocol activated.',
        timestamp: '1 hour ago, 3:18 PM',
        read: true,
        type: 'text'
      },
      {
        id: 4,
        sender: user.id,
        content: 'I\'m on my way. ETA 5 minutes.',
        timestamp: '1 hour ago, 3:19 PM',
        read: true,
        type: 'text'
      },
      {
        id: 5,
        sender: 4,
        content: 'Pediatric team standing by if needed.',
        timestamp: '1 hour ago, 3:20 PM',
        read: true,
        type: 'text'
      }
    ]
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setConversations(mockConversations);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages[conversation.id] || []);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg = {
      id: messages.length + 1,
      sender: user.id,
      content: newMessage,
      timestamp: 'Just now',
      read: false,
      type: 'text'
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    // Update last message in conversations
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? {
            ...conv,
            lastMessage: {
              content: newMessage,
              timestamp: 'Just now',
              sender: user.id,
              read: false
            }
          }
          : conv
      )
    );
  };

  const getOtherParticipant = (conversation) => {
    if (conversation.type === 'group') {
      return {
        name: conversation.name,
        role: 'Group',
        online: false
      };
    }
    return conversation.participants.find(p => p.id !== user.id);
  };

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = getOtherParticipant(conv);
    return otherParticipant.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex h-full">
        {/* Conversations Sidebar */}
        <div className={`w-full md:w-96 border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <Title title="Messages" className="text-2xl mb-4" />
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map(conversation => {
              const otherParticipant = getOtherParticipant(conversation);
              const isActive = selectedConversation?.id === conversation.id;

              return (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 ${isActive ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {otherParticipant.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {otherParticipant.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {otherParticipant.name}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {conversation.lastMessage.timestamp}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-1">
                        {otherParticipant.role}
                      </p>

                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${conversation.lastMessage.sender === user.id
                            ? 'text-gray-500'
                            : conversation.unreadCount > 0
                              ? 'text-gray-900 font-semibold'
                              : 'text-gray-500'
                          }`}>
                          {conversation.lastMessage.sender === user.id && 'You: '}
                          {conversation.lastMessage.content}
                        </p>

                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-5 h-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>

                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {getOtherParticipant(selectedConversation).name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {getOtherParticipant(selectedConversation).online && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {getOtherParticipant(selectedConversation).name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {getOtherParticipant(selectedConversation).online ? 'Online' : getOtherParticipant(selectedConversation).lastSeen || 'Offline'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.sender === user.id}
                    />
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                  <div className="flex items-center space-x-2">
                    <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Image className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      rows="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Smile className="w-5 h-5" />
                    </button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="small"
                      icon={Send}
                      disabled={!newMessage.trim()}
                    >
                      Send
                    </Button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            // Empty State
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome to Messages
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Select a conversation from the sidebar to start messaging with your colleagues and team members.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2 ${isOwn
          ? 'bg-blue-500 text-white rounded-br-none'
          : 'bg-white border border-gray-200 rounded-bl-none'
        }`}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

        <div className={`flex items-center justify-end space-x-1 mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-400'
          }`}>
          <span className="text-xs">{message.timestamp}</span>
          {isOwn && (
            message.read ? (
              <CheckCheck className="w-3 h-3" />
            ) : (
              <Check className="w-3 h-3" />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Messaging;