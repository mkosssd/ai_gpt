import { AuthPage } from '@/components/auth/AuthPage';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';

const Index = () => {
  const { user } = useAuthStore();
  const { currentChatroom } = useChatStore();

  // Not authenticated - show auth page
  if (!user?.isAuthenticated) {
    return <AuthPage />;
  }

  // Authenticated but no chatroom selected - show dashboard
  if (!currentChatroom) {
    return <Dashboard />;
  }

  // In a chatroom - show chat interface
  return <ChatInterface />;
};

export default Index;
