import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>
      
      <div className="bg-card border shadow-sm px-4 py-3 rounded-2xl">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Gemini is typing</span>
          <div className="flex gap-1 ml-2">
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse delay-75" />
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse delay-150" />
          </div>
        </div>
      </div>
    </div>
  );
}