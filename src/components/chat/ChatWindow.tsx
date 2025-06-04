
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Minimize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConnections } from '@/hooks/useConnections';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

const ChatWindow = ({ isOpen, onClose }: ChatWindowProps) => {
  const { connections, loading } = useConnections();
  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConnection) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate a response after 1 second
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedConnection.user.id || selectedConnection.requester_id,
        senderName: selectedConnection.user.full_name,
        content: "Thanks for your message! This is a demo response.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleConnectionSelect = (connection: any) => {
    setSelectedConnection(connection);
    setMessages([]);
  };

  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-xl z-50 ${
      isMinimized ? 'w-80 h-12' : 'w-80 h-96'
    } transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-sport-purple text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium">
            {selectedConnection ? selectedConnection.user.full_name : 'Chat'}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-sport-purple/80 p-1 h-6 w-6"
          >
            <Minimize2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-sport-purple/80 p-1 h-6 w-6"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Content */}
          <div className="flex h-80">
            {/* Connections List */}
            <div className="w-32 border-r bg-gray-50 overflow-y-auto">
              <div className="p-2">
                <h3 className="text-xs font-medium text-gray-600 mb-2">Connections</h3>
                {loading ? (
                  <div className="text-xs text-gray-500">Loading...</div>
                ) : connections.length > 0 ? (
                  <div className="space-y-1">
                    {connections.map((connection) => (
                      <button
                        key={connection.id}
                        onClick={() => handleConnectionSelect(connection)}
                        className={`w-full p-2 text-left rounded text-xs hover:bg-gray-100 ${
                          selectedConnection?.id === connection.id ? 'bg-sport-purple/10' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage 
                              src={connection.user.profile_picture_url || ''} 
                              alt={connection.user.full_name} 
                            />
                            <AvatarFallback className="text-xs">
                              {getInitials(connection.user.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">{connection.user.full_name.split(' ')[0]}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">No connections</div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConnection ? (
                <>
                  {/* Messages */}
                  <div className="flex-1 p-3 overflow-y-auto">
                    {messages.length > 0 ? (
                      <div className="space-y-3">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.senderId === 'current-user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-xs px-3 py-2 rounded-lg text-xs ${
                                message.senderId === 'current-user'
                                  ? 'bg-sport-purple text-white'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.senderId === 'current-user' 
                                  ? 'text-sport-purple/70' 
                                  : 'text-gray-500'
                              }`}>
                                {message.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                        Start a conversation with {selectedConnection.user.full_name}
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-2 border-t">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="text-xs"
                      />
                      <Button
                        onClick={handleSendMessage}
                        size="sm"
                        className="bg-sport-purple hover:bg-sport-purple/90 px-2"
                      >
                        <Send className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                  Select a connection to start chatting
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
