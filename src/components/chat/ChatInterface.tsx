import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, MoreVertical, Trash2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { MessageInput } from './MessageInput';
import { useChatStore } from '@/store/chatStore';
import { useToast } from '@/hooks/use-toast';

// Simulated AI responses for demo
const AI_RESPONSES = [
  "I'm Gemini, Google's most capable AI model. How can I help you today?",
  "That's an interesting question! Let me think about that for a moment...",
  "I'd be happy to help you with that. Can you provide more details?",
  "Based on what you've shared, here's what I think...",
  "That's a great point! Let me elaborate on that...",
  "I understand your concern. Here's my perspective...",
  "Thanks for sharing that image! I can see...",
  "That's fascinating! Here's some additional information...",
  "I appreciate your question. Let me break this down...",
  "Great question! Here's what you should know...",
];

export function ChatInterface() {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    currentChatroom,
    getChatroom,
    addMessage,
    deleteChatroom,
    setCurrentChatroom,
    isTyping,
    setTyping,
  } = useChatStore();
  
  const { toast } = useToast();
  
  const chatroom = currentChatroom ? getChatroom(currentChatroom) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setIsScrolledToBottom(isAtBottom);
  };

  useEffect(() => {
    if (isScrolledToBottom) {
      scrollToBottom();
    }
  }, [chatroom?.messages, isTyping, isScrolledToBottom]);

  const generateAIResponse = (userMessage: string): string => {
    // Simple response logic for demo
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      return "Hello! I'm Gemini, Google's most capable AI model. How can I assist you today?";
    }
    
    if (userMessage.toLowerCase().includes('image') || userMessage.toLowerCase().includes('picture')) {
      return "I can see the image you've shared! Thanks for including that visual context. How can I help you with it?";
    }
    
    if (userMessage.toLowerCase().includes('help')) {
      return "I'm here to help! I can assist with a wide variety of tasks including answering questions, creative writing, analysis, problem-solving, and much more. What would you like to work on?";
    }
    
    // Random response for other messages
    return AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
  };

  const handleSendMessage = async (content: string, image?: string) => {
    if (!currentChatroom) return;

    // Add user message
    addMessage(currentChatroom, {
      content,
      sender: 'user',
      image,
    });

    // Show typing indicator
    setTyping(true);

    // Simulate AI response with delay (1-3 seconds)
    const delay = Math.random() * 2000 + 1000;
    setTimeout(() => {
      setTyping(false);
      
      // Add AI response
      addMessage(currentChatroom, {
        content: generateAIResponse(content),
        sender: 'ai',
      });

      toast({
        title: "New message",
        description: "Gemini has responded to your message",
      });
    }, delay);
  };

  const handleDeleteChatroom = () => {
    if (!currentChatroom || !chatroom) return;
    
    deleteChatroom(currentChatroom);
    setCurrentChatroom(null);
    
    toast({
      title: "Chatroom Deleted",
      description: `"${chatroom.title}" has been deleted.`,
      variant: "destructive",
    });
  };

  const handleBackToDashboard = () => {
    setCurrentChatroom(null);
  };

  if (!chatroom) {
    return (
      <div className="min-h-screen bg-gradient-chat flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            No chatroom selected
          </h2>
          <p className="text-muted-foreground">
            Please select a chatroom from the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-chat flex flex-col">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={handleBackToDashboard}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div>
              <h1 className="font-semibold truncate max-w-48 sm:max-w-none">
                {chatroom.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {chatroom.messages.length} message{chatroom.messages.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Chat
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Chatroom</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{chatroom.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteChatroom}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
      >
        {chatroom.messages.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gradient-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Start your conversation with Gemini!
            </h3>
            <p className="text-sm text-muted-foreground">
              Type a message below to begin chatting with AI.
            </p>
          </div>
        )}
        
        {chatroom.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-card/80 backdrop-blur-sm p-4">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isTyping}
        />
      </div>
    </div>
  );
}