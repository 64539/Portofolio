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
  index?: number; // Added index property
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
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');

  // Command History & Autocomplete
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);

  const [isProcessing, setIsProcessing] = useState(false);

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
      // Assign numeric index (1-based, newest first or oldest first? usually lists are 1..N)
      // Let's use simple index based on current sort (Newest = 1)
      const indexedData = data.map((m, i) => ({ ...m, index: i + 1 }));
      setMessages(indexedData);
      setStats({
        total: data.length,
        unread: data.filter(m => !m.is_read).length
      });
    }
  }, [supabase, adminKey]);

  const filteredMessages = useMemo(() => {
    if (filter === 'ALL') return messages;
    if (filter === 'UNREAD') return messages.filter(m => !m.is_read);
    if (filter === 'READ') return messages.filter(m => m.is_read);
    return messages;
  }, [messages, filter]);

  const openMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      // Optimistic update
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
      setStats(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
      
      // API call
      try {
        await fetch('/api/admin/messages', {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'x-admin-key': adminKey 
          },
          body: JSON.stringify({ id: msg.id, is_read: true })
        });
      } catch (e) {
        console.error("Failed to mark read", e);
      }
    }
  };

  const processCommand = async (cmd: string) => {
    if (!cmd.trim()) return;
    
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryPointer(-1);
    setInputBuffer(""); // Clear input immediately
    setIsProcessing(true);

    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();

    // Simulate processing delay for visual feedback
    await new Promise(r => setTimeout(r, 300));

    if (mode === 'public') {
      if (command === 'sudo' && args[1] === 'login') {
        setView('login');
        addToHistory('> sudo login');
        addToHistory('Enter admin credentials:');
      } else if (command === 'clear') {
        setHistory([]);
      } else if (command === 'help') {
        addToHistory('Available commands:');
        addToHistory('----------------');
        COMMANDS.forEach(c => addToHistory(`  - ${c}`));
        addToHistory('----------------');
      } else {
        addToHistory(`> ${cmd}`);
        addToHistory(`Command not found: ${command}. Type 'help' for available commands.`);
      }
    } else if (mode === 'admin') {
      // SECURITY CHECK: Ensure admin key is present
      if (!adminKey) {
        setMode('public');
        setView('input');
        addToHistory('SESSION EXPIRED: Authorization token missing or invalid.');
        addToHistory('Please run "sudo login" to re-authenticate.');
        setIsProcessing(false);
        return;
      }

      switch (command) {
        case 'inbox':
          await fetchMessages();
          addToHistory('> inbox: Messages refreshed.');
          break;
        case 'read':
          if (args[1]) {
            // Find by index first, then fallback to ID check for backward compatibility
            const index = parseInt(args[1]);
            let msg;
            if (!isNaN(index)) {
              msg = messages.find(m => m.index === index);
            } else {
              msg = messages.find(m => m.id.startsWith(args[1]) || m.id === args[1]);
            }

            if (msg) {
              void openMessage(msg); // Use openMessage to trigger read status update
              addToHistory(`> read: Opened message #${msg.index} (ID: ${msg.id.slice(0, 8)}...)`);
            } else {
              addToHistory(`Message ${args[1]} not found.`);
            }
          } else {
             addToHistory('Usage: read <index|id>');
          }
          break;
        case 'reply':
          // Syntax: reply <index> <message...>
          if (args.length >= 3) {
             const index = parseInt(args[1]);
             let msg: Message | undefined;
             
             if (!isNaN(index)) {
               msg = messages.find(m => m.index === index);
             } else {
               // Fallback ID support
               msg = messages.find(m => m.id.startsWith(args[1]));
             }

             if (msg) {
               const replyContent = args.slice(2).join(' ').replace(/^"|"$/g, ''); // Remove surrounding quotes if present
               
               addToHistory(`> REPLYING TO #${msg.index || '?'}: "${replyContent}"...`);
               
               try {
                 const res = await fetch('/api/admin/messages', {
                   method: 'POST',
                   headers: { 
                     'Content-Type': 'application/json',
                     'x-admin-key': adminKey 
                   },
                   body: JSON.stringify({
                     id: msg.id,
                     content: replyContent,
                     reply_to_email: msg.sender_email,
                     reply_to_name: msg.sender_name
                   })
                 });

                 if (res.ok) {
                   addToHistory('> REPLY SENT [SUCCESS]');
                 } else {
                   addToHistory('> ERROR: Failed to send reply.');
                 }
               } catch {
                 addToHistory('> ERROR: Network failure.');
               }
             } else {
               addToHistory(`> ERROR: Message #${args[1]} not found.`);
             }
          } else {
            addToHistory('Usage: reply <index> <message>');
          }
          break;
        case 'delete':
          // Syntax: delete <index|id> [confirm-flag]
          // confirm-flag is internal, used when UI button calls processCommand directly
          const targetId = args[1];
          const isConfirmed = args[2] === '--force';

          if (targetId) {
             // Find by index first, then ID
             const index = parseInt(targetId);
             let msgId = targetId;
             let msgIndex = targetId;
             
             if (!isNaN(index)) {
               const found = messages.find(m => m.index === index);
               if (found) {
                 msgId = found.id;
                 msgIndex = found.index?.toString() || targetId;
               } else {
                 addToHistory(`> ERROR: Message #${index} not found.`);
                 setIsProcessing(false);
                 return;
               }
             }

             if (isConfirmed || confirm(`DELETE MESSAGE #${msgIndex}: Are you sure? This action cannot be undone.`)) {
               addToHistory(`> DELETING MESSAGE #${msgIndex}...`);
               
               try {
                 const res = await fetch(`/api/admin/messages?id=${msgId}`, {
                   method: 'DELETE',
                   headers: { 'x-admin-key': adminKey }
                 });
                 if (res.ok) {
                   addToHistory(`> DELETING MESSAGE #${msgIndex}... [SUCCESS]`);
                   await fetchMessages(); // Auto refresh
                   if (selectedMessage?.id === msgId) {
                     setSelectedMessage(null);
                   }
                 } else {
                   addToHistory(`> ERROR: Failed to delete message.`);
                 }
               } catch {
                 addToHistory(`> ERROR: Network failure.`);
               }
             } else {
               addToHistory('> ACTION ABORTED.');
             }
          } else {
            addToHistory('Usage: delete <index|id>');
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
          addToHistory('----------------');
          ['inbox', 'read <id>', 'reply <id> <msg>', 'delete <id>', 'clear', 'exit'].forEach(c => addToHistory(`  - ${c}`));
          addToHistory('----------------');
          break;
        default:
          addToHistory(`> ${cmd}`);
          addToHistory('Unknown command.');
      }
    }
    
    setIsProcessing(false);
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
    navigateHistory,
    isProcessing,
    filter,
    setFilter,
    filteredMessages,
    openMessage
  };
};
