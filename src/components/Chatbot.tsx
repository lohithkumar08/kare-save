// ✅ Chatbot.tsx
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User, CornerDownLeft, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------- Supabase setup ----------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
}

declare global {
  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start: () => void;
    stop: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: any) => void) | null;
  }

  interface SpeechRecognitionEvent extends Event {
    results: {
      [index: number]: {
        [index: number]: { transcript: string };
      };
    };
  }

  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // ---------------- Initial quick replies ----------------
  const initialQuickReplies = [
    'What products do you offer?',
    'How does vermicompost work?',
    'Tell me about biogas plants',
    'How can I volunteer?',
    'Donation information',
  ];

  // ---------------- Bot responses ----------------
  const botResponses = [
    {
      keywords: ['product', 'offer', 'line'],
      response:
        'We offer 5 eco-friendly product lines: Happy Raithu (vermicompost), Gracious Gas (biogas units), SBL Pots (eco gardening pots), Clayer (clay water bottles), and Neem Brush (biodegradable toothbrushes).',
      suggestions: ['Tell me more about vermicompost', 'What are biogas units?', 'Where can I see all products?'],
    },
    {
      keywords: ['vermicompost', 'happy raithu'],
      response:
        "Vermicompost uses earthworms to break down organic waste into nutrient-rich fertilizer. Our Happy Raithu vermicompost is perfect for gardens and farms!",
      suggestions: ['How can I buy Happy Raithu?', 'Is vermicompost safe for plants?', 'What is the price?'],
    },
    {
      keywords: ['biogas', 'gracious gas'],
      response:
        'Gracious Gas biogas units convert organic waste into clean cooking gas. Available for domestic and commercial use.',
      suggestions: ['How much does a biogas unit cost?', 'How do I maintain it?', 'Installation details?'],
    },
    {
      keywords: ['hello', 'hi', 'hey'],
      response: "Hello! I'm your Eco Assistant. How can I help you today?",
      suggestions: initialQuickReplies,
    },
  ];

  // ---------------- Scroll to bottom ----------------
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isBotTyping]);

  // ---------------- Load messages from Supabase ----------------
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true });
      if (error) console.error(error);
      else setMessages(data as Message[]);
    };
    fetchMessages();
  }, []);

  // ---------------- Speech Recognition ----------------
  useEffect(() => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      const recog = new SpeechRecognitionClass();
      recog.lang = 'en-US';
      recog.continuous = false;
      recog.interimResults = false;

      recog.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        handleSendMessage(transcript);
      };
      recog.onerror = (err) => console.error(err);
      recognitionRef.current = recog;
    }
  }, []);

  const startListening = () => recognitionRef.current?.start();

  // ---------------- Text-to-speech ----------------
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // ---------------- Generate bot response ----------------
  const generateBotResponse = (userMessage: string) => {
    const lower = userMessage.toLowerCase();
    const match = botResponses.find((b) => b.keywords.some((k) => lower.includes(k)));
    if (match) return { text: match.response, suggestions: match.suggestions };
    return { text: "Sorry, I didn't understand. You can contact us at info@karesave.org", suggestions: initialQuickReplies };
  };

  // ---------------- Send message ----------------
  const handleSendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || inputMessage;
    if (!textToSend.trim() || isBotTyping) return;

    const userMessage: Message = { id: Date.now().toString(), text: textToSend, isBot: false, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsBotTyping(true);

    // Save user message to Supabase
    await supabase.from('messages').insert([userMessage]);

    setTimeout(async () => {
      const { text, suggestions } = generateBotResponse(userMessage.text);
      const botMessage: Message = { id: (Date.now() + 1).toString(), text, isBot: true, timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, botMessage]);
      setSuggestedQuestions(suggestions);
      setIsBotTyping(false);

      // Save bot message to Supabase
      await supabase.from('messages').insert([botMessage]);
      speakText(text);
    }, Math.random() * 1500 + 500);
  };

  const handleQuickReply = (reply: string) => {
    if (isBotTyping) return;
    setInputMessage(reply);
    setTimeout(() => handleSendMessage(reply), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  useEffect(() => {
    if (messages.length === 0) setSuggestedQuestions(initialQuickReplies);
  }, [messages]);

  // ---------------- JSX ----------------
  return (
    <>
      {!isOpen && (
        <Button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 hover:scale-110" size="icon">
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-2xl z-50 flex flex-col">
          <CardHeader className="flex justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bot className="h-4 w-4 text-primary" /> Eco Assistant
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex flex-col h-full p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={cn('max-w-[80%] p-2 rounded-lg text-sm', msg.isBot ? 'bg-gray-200 text-gray-900' : 'bg-primary text-primary-foreground')}>
                      <div className="flex items-start gap-2">
                        {msg.isBot && <Bot className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                        <span>{msg.text}</span>
                        {!msg.isBot && <User className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                      </div>
                    </div>
                  </div>
                ))}
                {isBotTyping && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-gray-200 p-2 rounded-lg text-gray-900 text-sm max-w-[80%]">
                      <Bot className="h-3 w-3 inline-block mr-2" />
                      <span>...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {suggestedQuestions.length > 0 && (
              <div className="p-2 border-t">
                <div className="flex flex-wrap gap-1">
                  {suggestedQuestions.map((reply, i) => (
                    <Button key={i} variant="outline" size="sm" onClick={() => handleQuickReply(reply)} className="text-xs h-6" disabled={isBotTyping}>
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." className="text-sm" disabled={isBotTyping} />
                <Button onClick={() => handleSendMessage()} size="icon" className="h-8 w-8" disabled={isBotTyping}>
                  <Send className="h-3 w-3" />
                </Button>
                <Button onClick={startListening} size="icon" className="h-8 w-8" disabled={isBotTyping}>
                  <Mic className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <CornerDownLeft className="h-3 w-3" /> Press Enter to send
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
