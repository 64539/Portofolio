import { useState, useEffect, useMemo, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseBrowser';

export type TerminalMode = 'public' | 'admin';
export type TerminalView = 'input' | 'receipt' | 'dashboard' | 'login';

export type Message = {
  id: string;
  created_at: string;
  user_session: string;
  content: string;
  is_from_admin: boolean;
  sender_name?: string;
  sender_email?: string;
  is_read?: boolean;
};

export const useTerminalLogic = () => {
  const [mode, setMode] = useState<TerminalMode>('public');
  const [view, setView] = useState<TerminalView>('input');
  const [inputBuffer, setInputBuffer] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [stats, setStats] = useState({ total: 0, unread: 0 });
  const [receiptData, setReceiptData] = useState<{ id: string; timestamp: string; name: string; status: string } | null>(null);

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const addToHistory = (line: string) => {
    setHistory(prev => [...prev.slice(-19), line]);
  };

  const processCommand = async (cmd: string) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();

    if (mode === 'public') {
      if (command === 'sudo' && args[1] === 'login') {
        setView('login');
        addToHistory('> sudo login');
        addToHistory('Enter admin credentials:');
      } else if (command === 'clear') {
        setHistory([]);
      } else {
        addToHistory(`> ${cmd}`);
        addToHistory(`Command not found: ${command}. Try 'sudo login' for admin access.`);
      }
    } else if (mode === 'admin') {
      switch (command) {
        case 'inbox':
          fetchMessages();
          addToHistory('> inbox: Fetching messages...');
          break;
        case 'read':
          if (args[1]) {
            const msg = messages.find(m => m.id.startsWith(args[1]) || m.id === args[1]);
            if (msg) setSelectedMessage(msg);
            else addToHistory(`Message ${args[1]} not found.`);
          }
          break;
        case 'delete':
          // Implement delete logic
          break;
        case 'clear':
          setHistory([]);
          break;
        case 'exit':
          setMode('public');
          setView('input');
          addToHistory('Logged out.');
          break;
        default:
          addToHistory(`> ${cmd}`);
          addToHistory('Unknown command.');
      }
    }
  };

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setMessages(data);
      setStats({
        total: data.length,
        unread: data.filter(m => !m.is_read).length
      });
    }
  }, [supabase]);

  // Real-time subscription
  useEffect(() => {
    if (mode === 'admin') {
      fetchMessages();
      const channel = supabase
        .channel('admin-dashboard')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
          fetchMessages();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [mode, supabase, fetchMessages]);

  return {
    mode,
    setMode,
    view,
    setView,
    inputBuffer,
    setInputBuffer,
    history,
    addToHistory,
    processCommand,
    messages,
    selectedMessage,
    setSelectedMessage,
    stats,
    receiptData,
    setReceiptData,
    fetchMessages
  };
};
