import React, { useState, useRef, useEffect } from "react";
import { Code, SendHorizontal, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { puterAI } from "@/services/PuterAIService";
import { toast } from "sonner";

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  visible: boolean;
  onClose: () => void;
  onInsertCode: (code: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ visible, onClose, onInsertCode }) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      type: 'ai',
      content: "Hi! I'm your AI coding assistant powered by Puter.js. I can help you with HTML, CSS, JavaScript, React, and more. Ask me anything!",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [puterReady, setPuterReady] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize Puter when component becomes visible, but don't block the app
    const initializePuter = async () => {
      if (!visible || puterReady) return;
      
      try {
        setInitializationError(null);
        await puterAI.initialize();
        setPuterReady(true);
        toast.success("AI Assistant ready", {
          description: "Connected to Puter.js AI successfully"
        });
      } catch (error) {
        console.error('Failed to initialize Puter AI:', error);
        setInitializationError('Failed to connect to AI service');
        toast.error("AI Assistant unavailable", {
          description: "Failed to connect to Puter.js AI. You can still use the interface."
        });
      }
    };

    // Use setTimeout to ensure this doesn't block the main thread
    if (visible) {
      setTimeout(initializePuter, 100);
    }
  }, [visible, puterReady]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length,
      type: 'user',
      content: prompt,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentPrompt = prompt;
    setPrompt("");
    setIsLoading(true);

    try {
      // Get AI response from Puter
      const aiResponse = await puterAI.chat(currentPrompt);
      
      const aiMessage: Message = {
        id: messages.length + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage: Message = {
        id: messages.length + 1,
        type: 'ai',
        content: "Sorry, I'm having trouble connecting to the AI service right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast.error("AI Error", {
        description: "Failed to get AI response"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeBlockClick = (code: string) => {
    // Extract code from markdown code blocks
    const codeMatch = code.match(/```(?:\w+)?\n([\s\S]+?)\n```/);
    if (codeMatch && codeMatch[1]) {
      onInsertCode(codeMatch[1]);
      toast.success("Code inserted into editor");
    }
  };

  // Function to format message content with markdown-like syntax highlighting
  const formatMessageContent = (content: string) => {
    // Replace code blocks with styled pre elements
    const formattedContent = content.replace(/```(?:\w+)?\n([\s\S]+?)\n```/g, (match, code) => {
      return `<pre class="bg-[#242a38] text-[#e4e5e7] p-3 rounded my-2 cursor-pointer hover:bg-[#2d3748] text-xs overflow-x-auto border border-[#374151]" data-code="${encodeURIComponent(code)}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
    });
    
    // Replace inline code
    return formattedContent.replace(/`([^`]+)`/g, '<code class="bg-[#242a38] text-[#e4e5e7] px-1 rounded text-xs">$1</code>');
  };

  if (!visible) return null;

  return (
    <div className="fixed right-0 top-[56px] bottom-0 w-80 bg-[#1a1f2c] border-l border-[#374151] flex flex-col z-50 shadow-2xl transform transition-transform duration-300">
      <div className="flex items-center justify-between p-4 border-b border-[#374151]">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Code size={20} className="text-[#6366f1]" />
            {puterReady && (
              <Zap size={10} className="absolute -top-1 -right-1 text-green-400" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-sm">AI Assistant</h3>
            <p className="text-xs text-[#9ca3af]">
              {initializationError 
                ? "Connection failed" 
                : puterReady 
                  ? "Powered by Puter.js" 
                  : "Connecting..."}
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`mb-4 flex ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user' 
                  ? 'bg-[#6366f1] text-white' 
                  : 'bg-[#242a38] text-[#e4e5e7]'
              }`}
            >
              <div 
                className="text-sm whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.tagName === 'PRE') {
                    const code = decodeURIComponent(target.getAttribute('data-code') || '');
                    handleCodeBlockClick(`\`\`\`\n${code}\n\`\`\``);
                  }
                }}
              />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-[#242a38] text-[#e4e5e7] p-3 rounded-lg max-w-[80%]">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#6366f1] rounded-full mr-1 animate-pulse"></div>
                <div className="w-2 h-2 bg-[#6366f1] rounded-full mr-1 animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-[#6366f1] rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form 
        onSubmit={handleSubmit}
        className="border-t border-[#374151] p-4 flex gap-2"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            initializationError 
              ? "AI service unavailable..." 
              : puterReady 
                ? "Ask for code help..." 
                : "Connecting to AI..."
          }
          disabled={!puterReady || isLoading || !!initializationError}
          className="flex-1 bg-[#242a38] border border-[#374151] rounded p-2 text-[#e4e5e7] text-sm focus:outline-none focus:border-[#6366f1] disabled:opacity-50"
        />
        <Button 
          type="submit"
          className="bg-[#6366f1] text-white hover:bg-[#4f46e5] h-9 w-9 p-0"
          disabled={isLoading || !prompt.trim() || !puterReady || !!initializationError}
        >
          <SendHorizontal size={16} />
        </Button>
      </form>
    </div>
  );
};
