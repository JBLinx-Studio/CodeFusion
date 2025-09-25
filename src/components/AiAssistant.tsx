
import React, { useState, useRef, useEffect } from "react";
import { Code, SendHorizontal, Zap, AlertCircle, LogIn, User, CheckCircle, XCircle } from "lucide-react";
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
      content: "Hi! I'm your AI coding assistant. I can help you with HTML, CSS, JavaScript, React, and more. Connect to Puter for enhanced AI capabilities!",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'fallback' | 'needs-signin' | 'failed'>('connecting');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!visible) return;

    const initializeAI = async () => {
      setConnectionStatus('connecting');
      
      try {
        await puterAI.initialize();
        const status = puterAI.getStatus();
        
        console.log('Puter AI Status:', status);
        
        if (status.usingFallback) {
          setConnectionStatus('fallback');
          toast.info("AI Assistant ready", {
            description: "Using built-in AI responses (Puter.js unavailable)"
          });
        } else if (status.initialized && status.signedIn) {
          setConnectionStatus('connected');
          toast.success("AI Assistant ready", {
            description: "Connected to Puter.js AI successfully"
          });
        } else if (status.canSignIn) {
          setConnectionStatus('needs-signin');
          toast.info("Sign in required", {
            description: "Please sign in to Puter to use full AI features"
          });
        } else {
          setConnectionStatus('fallback');
          toast.info("AI Assistant ready", {
            description: "Using built-in AI responses"
          });
        }
      } catch (error) {
        console.log('AI initialization completed with fallback');
        setConnectionStatus('fallback');
        toast.info("AI Assistant ready", {
          description: "Using built-in AI responses"
        });
      }
    };

    initializeAI();

    // Listen for sign-in status changes
    const handleSignInChange = (signedIn: boolean) => {
      if (signedIn) {
        setConnectionStatus('connected');
        toast.success("Signed in successfully!", {
          description: "You can now use Puter AI features"
        });
      } else {
        setConnectionStatus('needs-signin');
      }
    };

    puterAI.onSignInStatusChange(handleSignInChange);
  }, [visible]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      console.log('Opening Puter sign-in popup...');
      
      // Open the Puter sign-in popup directly
      const signInUrl = 'https://puter.com/action/sign-in?embedded_in_popup=true&msg_id=1';
      const popup = window.open(
        signInUrl, 
        'puter-signin', 
        'width=500,height=600,scrollbars=yes,resizable=yes,location=yes,status=yes'
      );
      
      if (!popup) {
        toast.error("Popup blocked", {
          description: "Please allow popups for this site and try again"
        });
        return;
      }

      // Wait for popup to close
      const checkClosed = setInterval(async () => {
        if (popup.closed) {
          clearInterval(checkClosed);
          console.log('Popup closed, checking sign-in status...');
          
          // Small delay to allow any post-message events to process
          setTimeout(async () => {
            const status = puterAI.getStatus();
            console.log('Status after popup closed:', status);
            
            if (status.signedIn) {
              setConnectionStatus('connected');
              toast.success("Successfully signed in to Puter!");
            } else {
              toast.info("Sign-in window closed", {
                description: "Please try signing in again if needed"
              });
            }
          }, 1000);
        }
      }, 1000);
      
      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkClosed);
        if (popup && !popup.closed) {
          popup.close();
        }
      }, 300000);
      
    } catch (error) {
      console.error('Sign-in error:', error);
      toast.error("Failed to open sign-in window");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

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
        content: "I'm having trouble generating a response right now. Please try asking your question again in a moment.",
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
    const codeMatch = code.match(/```(?:\w+)?\n([\s\S]+?)\n```/);
    if (codeMatch && codeMatch[1]) {
      onInsertCode(codeMatch[1]);
      toast.success("Code inserted into editor");
    }
  };

  const formatMessageContent = (content: string) => {
    const formattedContent = content.replace(/```(?:\w+)?\n([\s\S]+?)\n```/g, (match, code) => {
      return `<pre class="bg-[#242a38] text-[#e4e5e7] p-3 rounded my-2 cursor-pointer hover:bg-[#2d3748] text-xs overflow-x-auto border border-[#374151]" data-code="${encodeURIComponent(code)}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
    });
    
    return formattedContent.replace(/`([^`]+)`/g, '<code class="bg-[#242a38] text-[#e4e5e7] px-1 rounded text-xs">$1</code>');
  };

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'connecting':
        return { 
          text: 'Connecting...', 
          icon: <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />,
          color: 'text-yellow-400'
        };
      case 'connected':
        return { 
          text: 'Connected to Puter.js', 
          icon: <CheckCircle size={12} className="text-green-400" />,
          color: 'text-green-400'
        };
      case 'needs-signin':
        return { 
          text: 'Sign in required', 
          icon: <User size={12} className="text-blue-400" />,
          color: 'text-blue-400'
        };
      case 'fallback':
        return { 
          text: 'Built-in AI', 
          icon: <AlertCircle size={12} className="text-yellow-400" />,
          color: 'text-yellow-400'
        };
      case 'failed':
        return { 
          text: 'Connection failed', 
          icon: <XCircle size={12} className="text-red-400" />,
          color: 'text-red-400'
        };
      default:
        return { 
          text: 'Disconnected', 
          icon: <XCircle size={12} className="text-gray-400" />,
          color: 'text-gray-400'
        };
    }
  };

  const getPlaceholderText = () => {
    switch (connectionStatus) {
      case 'connecting':
        return 'Connecting to AI...';
      case 'connected':
        return 'Ask for code help with Puter AI...';
      case 'needs-signin':
        return 'Sign in to use enhanced AI features...';
      case 'fallback':
        return 'Ask for code help...';
      case 'failed':
        return 'AI service unavailable...';
      default:
        return 'Starting AI service...';
    }
  };

  const statusInfo = getStatusInfo();

  if (!visible) return null;

  return (
    <div className="fixed right-0 top-[56px] bottom-0 w-80 bg-[#1a1f2c] border-l border-[#374151] flex flex-col z-50 shadow-2xl transform transition-transform duration-300">
      <div className="flex items-center justify-between p-4 border-b border-[#374151]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Code size={20} className="text-[#6366f1]" />
          </div>
          <div>
            <h3 className="font-medium text-sm text-white">AI Assistant</h3>
            <div className="flex items-center gap-2">
              {statusInfo.icon}
              <p className={`text-xs ${statusInfo.color}`}>{statusInfo.text}</p>
            </div>
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

      {/* Enhanced Sign-in section */}
      {(connectionStatus === 'needs-signin' || connectionStatus === 'fallback') && (
        <div className="p-4 border-b border-[#374151] bg-[#242a38]">
          <div className="text-center">
            <div className="mb-3">
              <p className="text-sm text-[#e4e5e7] mb-1">
                {connectionStatus === 'needs-signin' 
                  ? 'Connect to Puter for enhanced AI capabilities' 
                  : 'Puter.js unavailable - using built-in AI'
                }
              </p>
              {connectionStatus === 'needs-signin' && (
                <p className="text-xs text-[#9ca3af]">
                  Get better responses and more features
                </p>
              )}
            </div>
            {connectionStatus === 'needs-signin' && (
              <Button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="bg-[#6366f1] hover:bg-[#4f46e5] text-white w-full"
              >
                <LogIn size={16} className="mr-2" />
                {isSigningIn ? 'Opening sign-in...' : 'Sign in to Puter'}
              </Button>
            )}
            {connectionStatus === 'fallback' && (
              <Button
                onClick={handleSignIn}
                disabled={isSigningIn}
                variant="outline"
                className="border-[#4b5563] text-[#e4e5e7] hover:bg-[#2d3748] w-full"
              >
                <LogIn size={16} className="mr-2" />
                {isSigningIn ? 'Opening sign-in...' : 'Try Puter Sign-in'}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Connected status display */}
      {connectionStatus === 'connected' && (
        <div className="p-3 border-b border-[#374151] bg-gradient-to-r from-green-900/20 to-blue-900/20">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle size={16} className="text-green-400" />
            <span className="text-sm text-green-400 font-medium">Connected to Puter AI</span>
          </div>
        </div>
      )}
      
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
          placeholder={getPlaceholderText()}
          disabled={isLoading}
          className="flex-1 bg-[#242a38] border border-[#374151] rounded p-2 text-[#e4e5e7] text-sm focus:outline-none focus:border-[#6366f1] disabled:opacity-50"
        />
        <Button 
          type="submit"
          className="bg-[#6366f1] text-white hover:bg-[#4f46e5] h-9 w-9 p-0"
          disabled={isLoading || !prompt.trim()}
        >
          <SendHorizontal size={16} />
        </Button>
      </form>
    </div>
  );
};
