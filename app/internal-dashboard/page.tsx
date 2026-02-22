'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Loader2, Mail, Trash2, CheckCircle, XCircle, Reply, RefreshCw, Home, Send } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  packageType: string;
  createdAt: number;
  isRead: boolean;
  replied: boolean;
  autoReplied: boolean;
  admin_reply?: string;
  responded_at?: number;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Reply State
  const [replyMessage, setReplyMessage] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyStatus, setReplyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const router = useRouter();

  // Check if we have a cookie (naive check, real check happens on API calls)
  useEffect(() => {
    fetchMessages();
  }, []);

  // Clear reply state when message changes
  useEffect(() => {
    setReplyMessage('');
    setReplyStatus('idle');
  }, [selectedMessage?.id]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        fetchMessages();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/admin/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to fetch messages');
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    // Optimistic update
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    if (selectedMessage?.id === id) setSelectedMessage(prev => prev ? { ...prev, isRead: true } : null);

    await fetch(`/api/admin/messages/${id}/read`, { method: 'POST' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selectedMessage?.id === id) setSelectedMessage(null);

    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyMessage.trim()) return;

    setIsSendingReply(true);
    setReplyStatus('idle');

    try {
      const res = await fetch(`/api/admin/messages/${selectedMessage.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage }),
      });

      if (res.ok) {
        setReplyStatus('success');
        
        const timestamp = Date.now();
        const sentReply = replyMessage;
        setReplyMessage('');

        // Update local state to reflect the reply immediately
        setMessages(prev => prev.map(m => 
            m.id === selectedMessage.id 
            ? { ...m, replied: true, admin_reply: sentReply, responded_at: timestamp } 
            : m
        ));
        
        if (selectedMessage) {
            setSelectedMessage(prev => prev ? { 
                ...prev, 
                replied: true, 
                admin_reply: sentReply, 
                responded_at: timestamp 
            } : null);
        }
      } else {
        setReplyStatus('error');
      }
    } catch (error) {
      setReplyStatus('error');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#151A21] border-gray-800 p-8">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Restricted Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter Access Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/50 border-gray-700"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Unlock System'}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full text-gray-500 hover:text-white"
              onClick={handleGoHome}
            >
              Back to Home
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar List */}
      <div className="w-full md:w-[400px] border-r border-gray-800 flex flex-col h-full bg-[#151A21]">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <button 
               onClick={handleGoHome}
               className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
               title="Back to Website"
             >
               <Home size={20} />
             </button>
             <h2 className="font-bold text-lg">Inbox ({messages.length})</h2>
          </div>
          <button onClick={fetchMessages} className={`p-2 text-gray-400 hover:text-white ${refreshing ? 'animate-spin' : ''}`}>
            <RefreshCw size={18} />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No messages found</div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (!msg.isRead) handleMarkRead(msg.id);
                }}
                className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-colors ${selectedMessage?.id === msg.id ? 'bg-gray-800/80 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'} ${!msg.isRead ? 'bg-primary/5' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-semibold text-sm ${!msg.isRead ? 'text-white' : 'text-gray-400'}`}>
                    {msg.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(msg.createdAt, 'MMM d, HH:mm')}
                  </span>
                </div>
                <div className="text-xs text-primary mb-1 uppercase tracking-wide font-medium">{msg.packageType}</div>
                <p className="text-sm text-gray-400 line-clamp-2">{msg.message}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail View */}
      <div className="flex-1 flex flex-col h-full bg-[#0B0F14]">
        {selectedMessage ? (
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-800 bg-[#151A21]/50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedMessage.name}</h2>
                  <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline flex items-center gap-2">
                    <Mail size={16} /> {selectedMessage.email}
                  </a>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" size="sm" className="text-red-400 border-red-900/50 hover:bg-red-950/30" onClick={() => handleDelete(selectedMessage.id)}>
                     <Trash2 size={16} />
                   </Button>
                </div>
              </div>
              
              <div className="flex gap-3 text-sm">
                <div className="bg-gray-800 px-3 py-1 rounded-full text-gray-300">
                  {format(selectedMessage.createdAt, 'PPpp')}
                </div>
                <div className="bg-gray-800 px-3 py-1 rounded-full text-gray-300 uppercase">
                  {selectedMessage.packageType}
                </div>
                {selectedMessage.autoReplied && (
                   <div className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full flex items-center gap-1 border border-green-900/50">
                      <CheckCircle size={12} /> Auto-Replied
                   </div>
                )}
                {selectedMessage.replied && (
                   <div className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full flex items-center gap-1 border border-blue-900/50">
                      <Reply size={12} /> Replied
                   </div>
                )}
              </div>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              <div className="prose prose-invert max-w-none mb-8">
                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Message</h3>
                <p className="whitespace-pre-wrap text-lg text-gray-300 leading-relaxed bg-gray-800/30 p-6 rounded-lg border border-gray-800">
                  {selectedMessage.message}
                </p>
              </div>

              {selectedMessage.replied && selectedMessage.admin_reply && (
                <div className="prose prose-invert max-w-none mt-8 border-t border-gray-800 pt-8">
                   <h3 className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                     <Reply size={14} /> Your Reply
                     {selectedMessage.responded_at && (
                       <span className="text-gray-500 normal-case font-normal text-xs ml-auto">
                         {format(selectedMessage.responded_at, 'PPpp')}
                       </span>
                     )}
                   </h3>
                   <div className="whitespace-pre-wrap text-gray-300 leading-relaxed bg-blue-900/10 p-6 rounded-lg border border-blue-900/20">
                     {selectedMessage.admin_reply}
                   </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-800 bg-[#151A21]/30">
              {selectedMessage.replied ? (
                <div className="flex items-center justify-between text-gray-400 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                  <span className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    You have already replied to this message.
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: Your ${selectedMessage.packageType} Inquiry`)}
                    className="text-gray-400 hover:text-white"
                  >
                    Send another via Email Client
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                   <div className="flex justify-between items-center mb-2">
                     <label className="text-sm font-medium text-gray-400">Reply to {selectedMessage.name}</label>
                     {replyStatus === 'success' && (
                       <span className="text-green-500 text-sm flex items-center gap-1 animate-in fade-in slide-in-from-right-4">
                         <CheckCircle size={14} /> Sent successfully
                       </span>
                     )}
                     {replyStatus === 'error' && (
                       <span className="text-red-500 text-sm flex items-center gap-1 animate-in fade-in slide-in-from-right-4">
                         <XCircle size={14} /> Failed to send
                       </span>
                     )}
                   </div>
                   <Textarea 
                     placeholder="Type your reply here..." 
                     className="min-h-[120px] bg-black/40 border-gray-700 focus:border-primary resize-none"
                     value={replyMessage}
                     onChange={(e) => setReplyMessage(e.target.value)}
                   />
                   <div className="flex justify-between items-center">
                     <div className="text-xs text-gray-500">
                       Reply will be sent via EmailJS
                     </div>
                     <Button 
                       className="gap-2 min-w-[120px]" 
                       onClick={handleSendReply}
                       disabled={isSendingReply || !replyMessage.trim()}
                     >
                       {isSendingReply ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                       {isSendingReply ? 'Sending...' : 'Send Reply'}
                     </Button>
                   </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a message to view details
          </div>
        )}
      </div>
    </div>
  );
}
