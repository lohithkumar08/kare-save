// ✅ Chatbot.tsx - Styled Version
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User, CornerDownLeft, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [language, setLanguage] = useState<'en-US' | 'hi-IN' | 'te-IN'>('en-US');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // ---------------- Quick Replies ----------------
  const initialQuickReplies = {
    'en-US': ['What products do you offer?', 'How does vermicompost work?', 'Tell me about biogas plants', 'How can I volunteer?', 'Donation information'],
    'hi-IN': ['आपके उत्पाद कौनसे हैं?', 'वर्मी कंपोस्ट कैसे काम करता है?', 'बायोगैस प्लांट के बारे में बताएं', 'मैं कैसे स्वयंसेवक बन सकता हूँ?', 'दान की जानकारी'],
    'te-IN': ['మీ ఉత్పత్తులు ఏమిటి?', 'వర్మికంపోస్ట్ ఎలా పనిచేస్తుంది?', 'బయో గ్యాస్ ప్లాంట్ గురించి చెప్పండి', 'నేను ఎలా స్వచ్ఛంద సేవ చేయగలను?', 'దానం వివరాలు'],
  };

  // ---------------- Bot Responses ----------------
  const botResponses = [
    {
      keywords: ['product', 'offer', 'line', 'उत्पाद', 'उपलब्ध', 'ఉత్పత్తులు', 'అందించు'],
      response: {
        'en-US': 'We offer 5 eco-friendly product lines: Happy Raithu (vermicompost), Gracious Gas (biogas units), SBL Pots (eco gardening pots), Clayer (clay water bottles), and Neem Brush (biodegradable toothbrushes).',
        'hi-IN': 'हम 5 इको-फ्रेंडली उत्पाद लाइन्स पेश करते हैं: हैप्पी रैथु (वर्मी कंपोस्ट), ग्रेशियस गैस (बायोगैस यूनिट्स), SBL Pots (इको गार्डनिंग पॉट्स), Clayer (क्ले वाटर बॉटल्स), और नीम ब्रश (बायोडिग्रेडेबल टूथब्रश)।',
        'te-IN': 'మేము 5 ఎకో-ఫ్రెండ్లీ ఉత్పత్తి లైన్లను అందిస్తున్నాం: హ్యాపీ రైతు (వర్మికంపోస్ట్), గ్రేసియస్ గ్యాస్ (బయో గ్యాస్ యూనిట్స్), SBL Pots (ఎకో గార్డెనింగ్ పాన్ల), Clayer (మట్టి నీటి బాటిల్స్), మరియు Neem Brush (బయోడిగ్రాడబుల్ టూత్‌బ్రష్).',
      },
      suggestions: {
        'en-US': ['Tell me more about vermicompost', 'What are biogas units?', 'Where can I see all products?'],
        'hi-IN': ['वर्मी कंपोस्ट के बारे में और बताएं', 'बायोगैस यूनिट्स क्या हैं?', 'सभी उत्पाद कहाँ देख सकते हैं?'],
        'te-IN': ['వర్మికంపోస్ట్ గురించి మరింత చెప్పండి', 'బయో గ్యాస్ యూనిట్స్ ఏమిటి?', 'అన్ని ఉత్పత్తులను ఎక్కడ చూడవచ్చు?'],
      },
    },
    // ... other responses (vermicompost, biogas, hello) same as original
  ];

  // ---------------- Scroll to bottom ----------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]);

  // ---------------- Load messages ----------------
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase.from('messages').select('*').order('timestamp', { ascending: true });
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
      recog.lang = language;
      recog.continuous = false;
      recog.interimResults = false;
      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        handleSendMessage(transcript);
      };
      recog.onerror = console.error;
      recognitionRef.current = recog;
    }
  }, [language]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.lang = language;
    recognitionRef.current.start();
  };

  // ---------------- Text-to-speech ----------------
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      window.speechSynthesis.speak(utterance);
    }
  };

  // ---------------- Bot logic ----------------
  const generateBotResponse = (userMessage: string) => {
    const lower = userMessage.toLowerCase();
    const match = botResponses.find((b) => b.keywords.some((k) => lower.includes(k.toLowerCase())));
    if (match)
      return { text: match.response[language], suggestions: match.suggestions ? match.suggestions[language] : initialQuickReplies[language] };
    return {
      text: {
        'en-US': "Sorry, I didn't understand. Contact: info@karesave.org",
        'hi-IN': "माफ़ कीजिए, समझ नहीं पाया। संपर्क करें: info@karesave.org",
        'te-IN': "క్షమించండి, అర్థం కాలేదు. సంప్రదించండి: info@karesave.org",
      }[language],
      suggestions: initialQuickReplies[language],
    };
  };

  const handleSendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || inputMessage;
    if (!textToSend.trim() || isBotTyping) return;

    const userMessage: Message = { id: Date.now().toString(), text: textToSend, isBot: false, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsBotTyping(true);

    await supabase.from('messages').insert([userMessage]);

    setTimeout(async () => {
      const { text, suggestions } = generateBotResponse(userMessage.text);
      const botMessage: Message = { id: (Date.now() + 1).toString(), text, isBot: true, timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, botMessage]);
      setSuggestedQuestions(suggestions);
      setIsBotTyping(false);
      await supabase.from('messages').insert([botMessage]);
      speakText(text);
    }, 800 + Math.random() * 1000);
  };

  const handleQuickReply = (reply: string) => {
    if (isBotTyping) return;
    setInputMessage(reply);
    setTimeout(() => handleSendMessage(reply), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSendMessage(); };

  useEffect(() => { if (messages.length === 0) setSuggestedQuestions(initialQuickReplies[language]); }, [messages, language]);

  // ---------------- JSX ----------------
  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-gradient-to-tr from-green-400 to-blue-500 hover:scale-110 transition-transform z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-2xl z-50 flex flex-col rounded-xl overflow-hidden border border-gray-200">
          <CardHeader className="flex justify-between items-center p-3 bg-gradient-to-r from-green-400 to-blue-500 text-white">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Bot className="h-4 w-4" /> Eco Assistant
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6 text-white">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex flex-col h-full p-0 bg-gray-50">
            <div className="p-2 border-b bg-white">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en-US' | 'hi-IN' | 'te-IN')}
                className="text-sm border rounded w-full p-1 hover:border-green-400 transition bg-black"
              >
                <option value="en-US">English</option>
                <option value="hi-IN">हिन्दी</option>
                <option value="te-IN">తెలుగు</option>
              </select>
            </div>

            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={cn('max-w-[80%] p-3 rounded-2xl text-sm shadow-sm', msg.isBot ? 'bg-white text-gray-900' : 'bg-blue-500 text-white')}>
                      <div className="flex items-start gap-2">
                        {msg.isBot && <Bot className="h-4 w-4 mt-0.5" />}
                        <span>{msg.text}</span>
                        {!msg.isBot && <User className="h-4 w-4 mt-0.5" />}
                      </div>
                    </div>
                  </div>
                ))}
                {isBotTyping && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-white p-3 rounded-2xl text-gray-900 text-sm shadow-sm max-w-[80%] flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <span>Typing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {suggestedQuestions.length > 0 && (
              <div className="p-2 border-t bg-white flex flex-wrap gap-1">
                {suggestedQuestions.map((reply, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs h-7 px-2 rounded-full hover:bg-blue-100 transition"
                    disabled={isBotTyping}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            )}

            <div className="p-3 border-t bg-white flex gap-2 items-center">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 text-sm rounded-full border-gray-300 focus:border-blue-400"
                disabled={isBotTyping}
              />
              <Button onClick={() => handleSendMessage()} size="icon" className="h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white" disabled={isBotTyping}>
                <Send className="h-4 w-4" />
              </Button>
              <Button onClick={startListening} size="icon" className="h-10 w-10 rounded-full bg-green-500 hover:bg-green-600 text-white" disabled={isBotTyping}>
                <Mic className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-xs text-gray-400 flex items-center gap-1 mt-1 px-3">
              <CornerDownLeft className="h-3 w-3" /> Press Enter to send
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
