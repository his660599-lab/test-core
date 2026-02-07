import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useConversations, useConversation } from "@/hooks/use-conversations";
import { Search, MoreVertical, Phone, User, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Inbox() {
  const { data: conversations, isLoading: loadingList } = useConversations();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: activeChat, isLoading: loadingChat } = useConversation(selectedId);

  // Auto-select first chat if none selected
  if (!selectedId && conversations?.length && conversations.length > 0) {
    setSelectedId(conversations[0].id);
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-64 flex h-screen overflow-hidden">
        
        {/* Chat List */}
        <div className="w-80 border-r border-border bg-white flex flex-col">
          <div className="p-4 border-b border-border">
            <h1 className="text-xl font-display font-bold mb-4">Inbox</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted/50 border-none text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none" 
                placeholder="Search conversations..." 
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loadingList ? (
              <div className="p-4 text-center text-sm text-muted-foreground">Loading chats...</div>
            ) : conversations?.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedId(chat.id)}
                className={`w-full text-left p-4 border-b border-border/50 hover:bg-muted/30 transition-colors ${
                  selectedId === chat.id ? "bg-primary/5 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-semibold text-sm ${selectedId === chat.id ? "text-primary" : "text-foreground"}`}>
                    {chat.customerContact || `Guest #${chat.id}`}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {chat.updatedAt ? formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true }) : 'Just now'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {chat.metadata?.summary || "New conversation started..."}
                </p>
                <div className="mt-2 flex gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                    chat.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    chat.status === 'booked' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {chat.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Chat Window */}
        <div className="flex-1 flex flex-col bg-muted/10">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border bg-white flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground">
                      {activeChat.customerContact || `Guest #${activeChat.id}`}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Started {new Date(activeChat.createdAt!).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {loadingChat ? (
                  <div className="text-center py-10 text-muted-foreground">Loading conversation...</div>
                ) : activeChat.messages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`
                        max-w-[70%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed
                        ${isUser 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-white text-foreground border border-border rounded-bl-none'}
                      `}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Area (Read Only for now since AI handles it, but good for taking over) */}
              <div className="p-4 bg-white border-t border-border">
                <div className="relative">
                  <input 
                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-muted/30 border border-border focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    placeholder="Type a manual reply to take over..."
                    disabled
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium px-2 py-1 bg-muted rounded">
                    AI Active
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a conversation to view details</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
