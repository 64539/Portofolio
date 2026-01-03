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
  const [adminKey, setAdminKey] = useState<string>('');

  // Command History & Autocomplete
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const COMMANDS = useMemo(() => {
    if (mode === 'public') return ['sudo login', 'clear', 'help'];
    return ['inbox', 'read', 'delete', 'clear', 'exit', 'help'];
  }, [mode]);

  const suggestions = useMemo(() => {
    if (!inputBuffer) return [];
    const args = inputBuffer.toLowerCase().split(' ');
    const currentCmd = args[0];
    
    if (args.length === 1) {
      return COMMANDS.filter(c => c.startsWith(currentCmd));
    }
    return [];
  }, [inputBuffer, COMMANDS]);

  const addToHistory = (line: string) => {
    setHistory(prev => [...prev.slice(-49), line]);
  };

  const navigateHistory = (direction: 'up' | 'down') => {
    if (commandHistory.length === 0) return;

    let newPointer = historyPointer;
    if (direction === 'up') {
      if (historyPointer < commandHistory.length - 1) {
        newPointer++;
      }
    } else {
      if (historyPointer > -1) {
        newPointer--;
      }
    }

    setHistoryPointer(newPointer);

    if (newPointer === -1) {
      setInputBuffer('');
    } else {
      const cmd = commandHistory[commandHistory.length - 1 - newPointer];
      setInputBuffer(cmd || '');
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!adminKey) return;
    
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
  }, [supabase, adminKey]);

  const processCommand = async (cmd: string) => {
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryPointer(-1); // Reset pointer

    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();

    if (mode === 'public') {
      if (command === 'sudo' && args[1] === 'login') {
        setView('login');
        addToHistory('> sudo login');
        addToHistory('Enter admin credentials:');
      } else if (command === 'clear') {
        setHistory([]);
      } else if (command === 'help') {
        addToHistory('Available commands:');
        COMMANDS.forEach(c => addToHistory(`  - ${c}`));
      } else {
        addToHistory(`> ${cmd}`);
        addToHistory(`Command not found: ${command}. Type 'help' for available commands.`);
      }
    } else if (mode === 'admin') {
      switch (command) {
        case 'inbox':
          await fetchMessages();
          addToHistory('> inbox: Messages refreshed.');
          break;
        case 'read':
          if (args[1]) {
            const msg = messages.find(m => m.id.startsWith(args[1]) || m.id === args[1]);
            if (msg) {
              setSelectedMessage(msg);
              addToHistory(`> read: Opened message ${msg.id.slice(0, 8)}...`);
            } else {
              addToHistory(`Message ${args[1]} not found.`);
            }
          } else {
             addToHistory('Usage: read <id>');
          }
          break;
        case 'delete':
          if (args[1]) {
             if (confirm(`Delete message ${args[1]}?`)) {
               const res = await fetch(`/api/admin/messages?id=${args[1]}`, {
                 method: 'DELETE',
                 headers: { 'x-admin-key': adminKey }
               });
               if (res.ok) {
                 addToHistory(`> Message ${args[1]} deleted.`);
                 fetchMessages();
                 setSelectedMessage(null);
               } else {
                 addToHistory(`> Error deleting message.`);
               }
             }
          } else {
            addToHistory('Usage: delete <id>');
          }
          break;
        case 'clear':
          setHistory([]);
          break;
        case 'exit':
          setMode('public');
          setView('input');
          setAdminKey('');
          addToHistory('Logged out.');
          break;
        case 'help':
          addToHistory('Admin Commands:');
          COMMANDS.forEach(c => addToHistory(`  - ${c}`));
          break;
        default:
          addToHistory(`> ${cmd}`);
          addToHistory('Unknown command.');
      }
    }
  };

  // Real-time subscription
  useEffect(() => {
    if (mode === 'admin' && adminKey) {
      const timer = setTimeout(() => { void fetchMessages(); }, 0);
      const channel = supabase
        .channel('admin-dashboard')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
          void fetchMessages();
        })
        .subscribe();

      return () => {
        clearTimeout(timer);
        supabase.removeChannel(channel);
      };
    }
  }, [mode, supabase, fetchMessages, adminKey]);

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
    fetchMessages,
    commandHistory,
    suggestions,
    setAdminKey,
    navigateHistory
  };
};
