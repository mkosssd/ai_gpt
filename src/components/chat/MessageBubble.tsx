import { useState } from 'react';
import { Copy, Check, Bot, User } from 'lucide-react';
import { Message } from '@/store/chatStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied",
        description: "Message copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy message to clipboard",
        variant: "destructive",
      });
    }
  };

  const isAI = message.sender === 'ai';

  return (
    <div className={cn("flex gap-3 group", isAI ? "justify-start" : "justify-end")}>
      {isAI && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
      )}
      
      <div className={cn("flex flex-col max-w-xs sm:max-w-md", !isAI && "items-end")}>
        <div
          className={cn(
            "relative px-4 py-3 rounded-2xl break-words",
            isAI
              ? "bg-card border shadow-sm"
              : "bg-gradient-primary text-primary-foreground"
          )}
        >
          {message.image && (
            <div className="mb-3">
              <img
                src={message.image}
                alt="Uploaded image"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}
          
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          
          {/* Copy button - shows on hover */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
              isAI ? "bg-card hover:bg-accent" : "bg-primary-foreground/10 hover:bg-primary-foreground/20"
            )}
            onClick={handleCopy}
          >
            {copied ? (
              <Check className={cn("h-3 w-3", isAI ? "text-primary" : "text-primary-foreground")} />
            ) : (
              <Copy className={cn("h-3 w-3", isAI ? "text-muted-foreground" : "text-primary-foreground/70")} />
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mt-1 px-1">
          {!isAI && (
            <div className="flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                <User className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
}