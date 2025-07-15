import { useState } from 'react';
import { Plus, Search, MessageSquare, Trash2, Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { useDebounce } from '@/hooks/useDebounce';
import { useTheme } from '@/components/ThemeProvider';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { chatrooms, createChatroom, deleteChatroom, setCurrentChatroom } = useChatStore();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const filteredChatrooms = chatrooms.filter(room =>
    room.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleCreateChatroom = () => {
    if (!newRoomTitle.trim()) return;
    
    const newRoom = createChatroom(newRoomTitle.trim());
    setNewRoomTitle('');
    setIsCreateDialogOpen(false);
    setCurrentChatroom(newRoom.id);
    
    toast({
      title: "Chatroom Created",
      description: `"${newRoom.title}" has been created successfully.`,
    });
  };

  const handleDeleteChatroom = (roomId: string, roomTitle: string) => {
    deleteChatroom(roomId);
    toast({
      title: "Chatroom Deleted",
      description: `"${roomTitle}" has been deleted.`,
      variant: "destructive",
    });
  };

  const handleEnterChatroom = (roomId: string) => {
    setCurrentChatroom(roomId);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-chat">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Gemini Chat</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.phone}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chatrooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Chatroom</DialogTitle>
                <DialogDescription>
                  Give your new chatroom a descriptive title.
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Enter chatroom title..."
                value={newRoomTitle}
                onChange={(e) => setNewRoomTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateChatroom();
                  }
                }}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateChatroom}
                  disabled={!newRoomTitle.trim()}
                  variant="gradient"
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Chatrooms Grid */}
        {filteredChatrooms.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No chatrooms found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or create a new chatroom.
            </p>
          </div>
        )}

        {filteredChatrooms.length === 0 && !searchQuery && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No chatrooms yet
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first chatroom to start conversations with Gemini AI.
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              variant="gradient"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Chat
            </Button>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredChatrooms.map((room) => (
            <Card 
              key={room.id}
              className="hover:shadow-card transition-shadow cursor-pointer group"
              onClick={() => handleEnterChatroom(room.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate group-hover:text-primary transition-colors">
                      {room.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {room.messages.length} message{room.messages.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Chatroom</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{room.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteChatroom(room.id, room.title)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {room.lastMessage ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {room.lastMessage.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(room.lastMessage.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No messages yet. Start a conversation!
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}