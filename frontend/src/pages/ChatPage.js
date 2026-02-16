import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { Send, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const QUICK_PROMPTS = [
  "What career is best for me?",
  "I'm interested in technology",
  "Show me creative careers",
  "How do I start in data science?",
  "What skills should I learn?",
  "Help me create a roadmap"
];

export default function ChatPage() {
  const { user } = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const [pendingMcq, setPendingMcq] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    setMessages([{
      role: "assistant",
      content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your AI Career Mentor. I'm here to help you discover careers, build skills, and create personalized learning roadmaps. What would you like to explore today?`,
      timestamp: new Date().toISOString()
    }]);
  }, [user]);

  const handleSend = async (messageText = null) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setShowQuickPrompts(false);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: textToSend,
          conversation_id: conversationId
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      
      setConversationId(data.conversation_id);
      
      const aiMessage = {
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString()
      };
      
      // Parse response for suggested options
      if (data.suggested_options && data.suggested_options.length > 0) {
        aiMessage.options = data.suggested_options;
      }
      
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPromptClick = (prompt) => {
    handleSend(prompt);
  };

  const handleOptionClick = (option) => {
    handleSend(option);
  };

  return (
    <div data-testid="chat-page" className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 px-8 py-6">
        <h1 className="text-3xl font-semibold text-zinc-900">AI Career Mentor</h1>
        <p className="text-zinc-500 mt-1">Ask me anything about careers, skills, and learning paths</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Quick Prompts - Show at start */}
          {showQuickPrompts && messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <p className="text-sm font-medium text-zinc-500 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Quick Start Questions
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    data-testid={`quick-prompt-${idx}`}
                    onClick={() => handleQuickPromptClick(prompt)}
                    className="text-left px-4 py-3 bg-white border-2 border-indigo-100 hover:border-indigo-300 rounded-xl text-sm text-zinc-700 hover:text-indigo-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((message, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className="max-w-[75%]">
                  <div
                    data-testid={`chat-message-${message.role}`}
                    className={`px-6 py-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-sm chat-bubble-user'
                        : 'bg-white border border-zinc-100 text-zinc-800 shadow-sm rounded-tl-sm chat-bubble-ai'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  
                  {/* Suggested Options after AI response */}
                  {message.role === 'assistant' && message.options && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-3 flex flex-wrap gap-2"
                    >
                      {message.options.map((option, optIdx) => (
                        <button
                          key={optIdx}
                          data-testid={`option-btn-${optIdx}`}
                          onClick={() => handleOptionClick(option)}
                          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm rounded-full font-medium transition-all duration-200 hover:-translate-y-0.5"
                        >
                          {option}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-zinc-100 text-zinc-400 rounded-2xl px-6 py-4 rounded-tl-sm">
                <div className="typing-indicator flex gap-1">
                  <span className="w-2 h-2 bg-zinc-400 rounded-full"></span>
                  <span className="w-2 h-2 bg-zinc-400 rounded-full"></span>
                  <span className="w-2 h-2 bg-zinc-400 rounded-full"></span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-zinc-200 px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 items-end">
            <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
              <textarea
                data-testid="chat-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about careers, skills, or learning paths..."
                rows={1}
                className="w-full px-4 py-3 bg-transparent border-none outline-none resize-none text-zinc-900 placeholder:text-zinc-400"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              data-testid="chat-send-btn"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 disabled:transform-none shadow-lg shadow-indigo-200"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </div>
          <p className="text-xs text-zinc-400 mt-3 text-center">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
