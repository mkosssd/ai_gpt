import { Skeleton } from '@/components/ui/skeleton';
import { Bot } from 'lucide-react';

export function LoadingMessage() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>
      
      <div className="bg-card border shadow-sm px-4 py-3 rounded-2xl max-w-xs sm:max-w-md">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
}