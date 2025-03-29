
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, Clock } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your StudyHub assistant. How can I help you with your studies today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: input,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API call to an AI service like OpenAI
    setTimeout(() => {
      // Mock response (In a real app, this would be a call to an AI API)
      const botResponses: { [key: string]: string } = {
        "help": "I can help you with studying by explaining concepts, creating flashcards, or providing practice questions. What subject are you studying?",
        "math": "Mathematics is a vast field! Are you studying algebra, calculus, geometry, or something else?",
        "physics": "Physics can be challenging! What specific topic in physics are you studying?",
        "who are you": "I'm your AI study assistant in StudyHub. I'm here to help you with your studies, answer questions, and provide learning resources.",
        "thanks": "You're welcome! Feel free to ask any other questions as you continue studying.",
        "hello": "Hello there! How can I assist with your studies today?",
        "hi": "Hi! Ready to help you with your academic questions."
      };

      let botReply = "";
      
      // Check if the user's message includes any keywords
      const userMessageLower = input.toLowerCase();
      for (const [keyword, response] of Object.entries(botResponses)) {
        if (userMessageLower.includes(keyword)) {
          botReply = response;
          break;
        }
      }

      // Default response if no keywords matched
      if (!botReply) {
        botReply = "I'm here to help with your studies. Could you provide more details about what you're working on?";
      }

      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: botReply,
        sender: "bot",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chat Assistant</h1>
        <p className="text-muted-foreground">
          Get help with your studies and ask questions
        </p>
      </div>

      <Card className="flex flex-col h-[calc(100vh-220px)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-studyhub-500" />
            Study Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-2 mb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-studyhub-600 text-white'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                      <span className="font-medium text-sm">
                        {message.sender === 'user' ? 'You' : 'Assistant'}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <div className="text-xs opacity-70 mt-1 flex items-center justify-end gap-1">
                      <Clock className="h-3 w-3" /> 
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-studyhub-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-studyhub-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 bg-studyhub-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messageEndRef} />
            </div>
          </div>
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[60px] max-h-[180px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="h-auto bg-studyhub-600 hover:bg-studyhub-700"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
