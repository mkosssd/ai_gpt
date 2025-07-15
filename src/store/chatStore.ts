import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  image?: string;
}

export interface Chatroom {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastMessage?: Message;
}

interface ChatState {
  chatrooms: Chatroom[];
  currentChatroom: string | null;
  isTyping: boolean;
  createChatroom: (title: string) => Chatroom;
  deleteChatroom: (id: string) => void;
  addMessage: (chatroomId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  setCurrentChatroom: (id: string | null) => void;
  setTyping: (typing: boolean) => void;
  getChatroom: (id: string) => Chatroom | undefined;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatrooms: [],
      currentChatroom: null,
      isTyping: false,
      
      createChatroom: (title: string) => {
        const newChatroom: Chatroom = {
          id: `chatroom-${Date.now()}`,
          title,
          messages: [],
          createdAt: new Date(),
        };
        
        set((state) => ({
          chatrooms: [newChatroom, ...state.chatrooms],
        }));
        
        return newChatroom;
      },
      
      deleteChatroom: (id: string) => {
        set((state) => ({
          chatrooms: state.chatrooms.filter(room => room.id !== id),
          currentChatroom: state.currentChatroom === id ? null : state.currentChatroom,
        }));
      },
      
      addMessage: (chatroomId: string, messageData: Omit<Message, 'id' | 'timestamp'>) => {
        const message: Message = {
          ...messageData,
          id: `msg-${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
        };
        
        set((state) => ({
          chatrooms: state.chatrooms.map(room =>
            room.id === chatroomId
              ? {
                  ...room,
                  messages: [...room.messages, message],
                  lastMessage: message,
                }
              : room
          ),
        }));
      },
      
      setCurrentChatroom: (id: string | null) => {
        set({ currentChatroom: id });
      },
      
      setTyping: (typing: boolean) => {
        set({ isTyping: typing });
      },
      
      getChatroom: (id: string) => {
        return get().chatrooms.find(room => room.id === id);
      },
    }),
    {
      name: 'gemini-chat',
      storage: createJSONStorage(() => localStorage),
    }
  )
);