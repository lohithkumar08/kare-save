// 🚀 Chatbot.tsx - ULTIMATE Production-Ready Version with Fixed Input/Footer
import { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Note: ScrollArea is no longer strictly needed for the main chat content container
import { MessageCircle, X, Bot, AlertTriangle, Loader2, Send, Mic, CornerDownLeft, User } from 'lucide-react';
import { cn } from '@/lib/utils'; 

// --- Bot Logic & Initial Data (Retained) ---
const botResponses = [
    // 1. Existing Product Overview (Keep first as general fallback/entry point)
    {
        keywords: ['product', 'offer', 'line', 'list', 'उत्पाद', 'ఉత్పత్తులు', 'అందించు'],
        response: {
            'en-US': 'We offer 5 eco-friendly product lines: Happy Raithu (**vermicompost**), Gracious Gas (**biogas units**), SBL Pots (eco gardening pots), Clayer (clay water bottles), and Neem Brush (biodegradable toothbrushes).',
            'hi-IN': 'हम 5 इको-फ्रेंडली उत्पाद लाइन्स पेश करते हैं: हैप्पी रैथु (**वर्मी कंपोस्ट**), ग्रेशियस गैस (**बायोगैस यूनिट्स**), SBL Pots (इको गार्डनिंग पॉट्स), Clayer (क्ले वाटर बॉटल्स), और नीम ब्रश (बायोडिग्रेडेबल टूथब्रश)।',
            'te-IN': 'మేము 5 ఎకో-ఫ్రెండ్లీ ఉత్పత్తి లైన్లను అందిస్తున్నాం: హ్యాపీ రైతు (**వర్మికంపోస్ట్**), గ్రేసియస్ గ్యాస్ (**బయో గ్యాస్ యూనిట్స్**), SBL Pots (ఎకో గార్డెనింగ్ పాన్ల), Clayer (మట్టి నీటి బాటిల్స్), మరియు Neem Brush (బయోడిగ్రాడబుల్ టూత్‌బ్రష్).',
        },
        suggestions: {
            'en-US': ['Tell me more about Happy Raithu', 'What is Gracious Gas?', 'Where can I see all products?'],
            'hi-IN': ['हैप्पी रैथु के बारे में और बताएं', 'ग्रेशियस गैस क्या है?', 'सभी उत्पाद कहाँ देख सकते हैं?'],
            'te-IN': ['హ్యాపీ రైతు గురించి మరింత చెప్పండి', 'గ్రేసియస్ గ్యాస్ ఏమిటి?', 'అన్ని ఉత్పత్తులను ఎక్కడ చూడవచ్చు?'],
        },
    },

    // 2. New Response: Happy Raithu (Vermicompost)
    {
        keywords: ['vermicompost', 'happy raithu', 'खाद', 'ఎరువు'],
        response: {
            'en-US': 'Happy Raithu is our premium **vermicompost**, created by earthworms. It’s an organic fertilizer that significantly improves soil health, increases crop yield, and is free from harsh chemicals.',
            'hi-IN': 'हैप्पी रैथु हमारा प्रीमियम **वर्मी कंपोस्ट** है, जिसे केंचुओं द्वारा बनाया जाता है। यह एक जैविक उर्वरक है जो मिट्टी के स्वास्थ्य में सुधार करता है, फसल की पैदावार बढ़ाता है, और कठोर रसायनों से मुक्त है।',
            'te-IN': 'హ్యాపీ రైతు మా ప్రీమియం **వర్మికంపోస్ట్**, దీనిని వానపాముల ద్వారా తయారు చేస్తారు. ఇది నేల ఆరోగ్యాన్ని మెరుగుపరిచి, పంట దిగుబడిని పెంచే ఒక సేంద్రియ ఎరువు. ఇది హానికరమైన రసాయనాలు లేకుండా ఉంటుంది.',
        },
        suggestions: {
            'en-US': ['How do I use vermicompost?', 'What are the benefits of organic fertilizer?', 'How to buy Happy Raithu?'],
            'hi-IN': ['वर्मी कंपोस्ट का उपयोग कैसे करें?', 'जैविक उर्वरक के क्या फायदे हैं?', 'हैप्पी रैथु कैसे खरीदें?'],
            'te-IN': ['వర్మికంపోస్ట్ ఎలా ఉపయోగించాలి?', 'సేంద్రియ ఎరువు ప్రయోజనాలు ఏమిటి?', 'హ్యాపీ రైతు ఎలా కొనాలి?'],
        },
    },
    
    // 3. New Response: Gracious Gas (Biogas Units)
    {
        keywords: ['biogas', 'gracious gas', 'unit', 'plant', 'बायोगैस', 'ప్లాంట్'],
        response: {
            'en-US': 'Gracious Gas refers to our **Biogas Units** (or plants). These systems convert organic waste (like kitchen scraps or dung) into clean cooking gas and bio-slurry fertilizer, promoting energy independence and waste reduction.',
            'hi-IN': 'ग्रेशियस गैस हमारे **बायोगैस यूनिट्स** (या प्लांट) को संदर्भित करता है। ये सिस्टम जैविक कचरे (जैसे रसोई के स्क्रैप या गोबर) को स्वच्छ खाना पकाने वाली गैस और बायो-स्लरी उर्वरक में बदलते हैं, जिससे ऊर्जा स्वतंत्रता और कचरे में कमी आती है।',
            'te-IN': 'గ్రేసియస్ గ్యాస్ మా **బయో గ్యాస్ యూనిట్స్** (లేదా ప్లాంట్‌లు). ఈ వ్యవస్థలు సేంద్రియ వ్యర్థాలను (వంటి వంటగది వ్యర్థాలు) శుభ్రమైన వంట గ్యాస్‌గా మరియు బయో-స్లరీ ఎరువుగా మారుస్తాయి, శక్తి స్వాతంత్ర్యాన్ని మరియు వ్యర్థాల తగ్గింపును ప్రోత్సహిస్తాయి.',
        },
        suggestions: {
            'en-US': ['How big are the biogas units?', 'What waste can I put in?', 'What is bio-slurry?'],
            'hi-IN': ['बायोगैस यूनिट्स कितनी बड़ी हैं?', 'मैं इसमें क्या कचरा डाल सकता हूँ?', 'बायो-स्लरी क्या है?'],
            'te-IN': ['బయోగ్యాస్ యూనిట్స్ ఎంత పెద్దవి?', 'నేను ఏ వ్యర్థాలను వేయవచ్చు?', 'బయో-స్లరీ అంటే ఏమిటి?'],
        },
    },
];

// Existing initialQuickReplies (keep these, they are the main conversation starters)
const initialQuickReplies = {
    'en-US': ['What products do you offer?', 'How does vermicompost work?', 'Tell me about biogas plants'],
    'hi-IN': ['आपके उत्पाद कौनसे हैं?', 'वर्मी कंपोस्ट कैसे काम करता है?', 'बायोगैस प्लांट के बारे  में बताएं'],
    'te-IN': ['మీ ఉత్పత్తులు ఏమిటి?', 'వర్మికంపోస్ట్ ఎలా పనిచేస్తుంది?', 'బయో గ్యాస్ ప్లాంట్ గురించి చెప్పండి'],
};

const initialBotMessage = {
    'en-US': "Welcome! I'm your **Eco Assistant**. Ask me about our sustainable products or mission.",
    'hi-IN': "स्वागत है! मैं आपकी **इको असिस्टेंट** हूँ। हमारे टिकाऊ उत्पादों या मिशन के बारे में पूछें।",
    'te-IN': "స్వాగతం! నేను మీ **ఎకో అసిస్టెంట్**. మా సుస్థిర ఉత్పత్తులు లేదా లక్ష్యం గురించి అడగండి.",
};

// --- Supabase & Types (Retained) ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Message {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: string;
}

// --- Typing Indicator (DARK MODE) ---
const TypingIndicator = () => (
    // Changed bg-white to bg-gray-700, text-gray-900 to text-gray-100, and border removed
    <div className="bg-gray-700 p-3 rounded-2xl text-gray-100 text-sm shadow-sm max-w-[80%] flex items-center gap-2">
      <Bot className="h-4 w-4 text-green-400" /> {/* Adjusted bot icon color for dark background */}
      <div className="flex space-x-1">
        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce-dot" style={{ animationDelay: '0ms' }}></span> {/* Adjusted dot color */}
        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce-dot" style={{ animationDelay: '200ms' }}></span>
        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce-dot" style={{ animationDelay: '400ms' }}></span>
      </div>
    </div>
);

// --- Message Bubble (DARK MODE) ---
const MessageBubble: React.FC<{ msg: Message }> = ({ msg }) => (
    <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
        <div 
            className={cn(
                'max-w-[80%] p-3 rounded-xl text-sm shadow-md', 
                msg.isBot 
                    // Changed bg-white to bg-gray-700, text-gray-900 to text-gray-100, border-gray-200 to border-gray-600
                    ? 'bg-gray-700 text-gray-100 border border-gray-600 rounded-bl-sm'
                    // User message colors kept: bg-amber-700 text-white
                    : 'bg-amber-700 text-white rounded-br-sm'
            )}
        >
            <div className="flex items-start gap-2">
                {/* Changed text-green-700 to text-green-400 for better contrast on gray-700 */}
                {msg.isBot && <Bot className="h-4 w-4 mt-0.5 text-green-400 flex-shrink-0" />}
                <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                {!msg.isBot && <User className="h-4 w-4 mt-0.5 text-amber-50 flex-shrink-0" />}
            </div>
        </div>
    </div>
);


const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
    const [language, setLanguage] = useState<'en-US' | 'hi-IN' | 'te-IN'>('en-US');
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    
    // ✅ IMPROVED: Ref for the messages container
    const messagesContainerRef = useRef<HTMLDivElement>(null); 

    // --- Scroll to bottom logic (Retained) ---
    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Use a slight delay to ensure messages are rendered before scrolling
            setTimeout(scrollToBottom, 50); 
        }
    }, [messages, isBotTyping, isOpen]);


    // --- Load/Persist Messages & Initial Greeting (Retained) ---
    useEffect(() => {
        // ... (Your existing loadChatState logic) ...
        const loadChatState = async () => {
            setIsLoading(true);
            const storedMessages = localStorage.getItem('chatbot_messages');
            const storedLanguage = localStorage.getItem('chatbot_language');
            let initialMsgs: Message[] = [];
            let initialLang = 'en-US';

            if (storedLanguage) {
                initialLang = storedLanguage;
                setLanguage(initialLang as 'en-US' | 'hi-IN' | 'te-IN');
            }

            if (storedMessages) {
                initialMsgs = JSON.parse(storedMessages) as Message[];
            }
            
            if (initialMsgs.length === 0) {
                initialMsgs.push({ 
                    id: 'welcome', 
                    text: initialBotMessage[initialLang as keyof typeof initialBotMessage], 
                    isBot: true, 
                    timestamp: new Date().toISOString() 
                });
                setSuggestedQuestions(initialQuickReplies[initialLang as keyof typeof initialQuickReplies]);
            } else {
                 setSuggestedQuestions(initialQuickReplies[initialLang as keyof typeof initialQuickReplies]);
            }

            setMessages(initialMsgs);
            setIsLoading(false);
        };
        loadChatState();
    }, []);

    useEffect(() => {
        localStorage.setItem('chatbot_messages', JSON.stringify(messages));
        localStorage.setItem('chatbot_language', language);
    }, [messages, language]);
    
    // --- Speech Recognition & TTS (Assuming implementation exists) ---
    const startListening = useCallback(() => { console.log('Listening started...'); /* ... existing logic ... */ }, [language]);
    const speakText = (text: string) => { console.log('Speaking:', text); /* ... existing logic ... */ };


    // --- Bot logic (Retained) ---
    const generateBotResponse = (userMessage: string) => {
        const lower = userMessage.toLowerCase();
        const match = botResponses.find((b) => b.keywords.some((k) => lower.includes(k.toLowerCase())));
        
        if (match) {
            const text = match.response[language as keyof typeof match.response];
            const suggestions = match.suggestions ? match.suggestions[language as keyof typeof match.suggestions] : initialQuickReplies[language];
            return { text, suggestions };
        }
        
        return {
            text: {
                'en-US': "I apologize, that's beyond my current knowledge base. Would you like to try one of the suggested topics or contact us at info@karesave.org?",
                'hi-IN': "मुझे क्षमा करें, यह मेरे मौजूदा ज्ञान से परे है। क्या आप सुझाए गए विषयों में से कोई आज़माना चाहेंगे या info@karesave.org पर हमसे संपर्क करना चाहेंगे?",
                'te-IN': "క్షమించండి, అది నా ప్రస్తుత జ్ఞాన పరిధిలో లేదు. మీరు సూచించిన అంశాలను ప్రయత్నించాలనుకుంటున్నారా లేదా info@karesave.org వద్ద మమ్మల్ని సంప్రదించాలనుకుంటున్నారా?",
            }[language],
            suggestions: initialQuickReplies[language],
        };
    };

    // --- Send Message Logic (Retained) ---
    const handleSendMessage = useCallback(async (overrideText?: string) => {
        const textToSend = overrideText || inputMessage;
        if (!textToSend.trim() || isBotTyping) return;

        setInputMessage(''); 
        
        const userMessage: Message = { id: Date.now().toString(), text: textToSend, isBot: false, timestamp: new Date().toISOString() };
        setMessages((prev) => [...prev, userMessage]);
        setIsBotTyping(true);
        setIsError(false); 

        try { await supabase.from('messages').insert([userMessage]); } 
        catch (e) { console.error('Supabase failed to save user message:', e); setIsError(true); }

        setTimeout(async () => {
            const { text, suggestions } = generateBotResponse(userMessage.text);
            const botMessage: Message = { id: (Date.now() + 1).toString(), text, isBot: true, timestamp: new Date().toISOString() };
            
            setMessages((prev) => [...prev, botMessage]);
            setSuggestedQuestions(suggestions);
            setIsBotTyping(false);
            
            try { await supabase.from('messages').insert([botMessage]); } 
            catch (e) { console.error('Supabase failed to save bot message:', e); setIsError(true); }
            
            speakText(text.replace(/\*\*(.*?)\*\*/g, '$1')); 
        }, 800 + Math.random() * 1000);
    }, [inputMessage, isBotTyping, language]);

    const handleQuickReply = (reply: string) => {
        if (isBotTyping) return;
        setInputMessage(reply);
        setTimeout(() => handleSendMessage(reply), 100); 
    };

    const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSendMessage(); };

    // --- Language Update Logic (Retained) ---
    useEffect(() => { 
        if (messages.length === 1 && messages[0].id === 'welcome') {
            setMessages([{ ...messages[0], text: initialBotMessage[language] }]);
        }
        setSuggestedQuestions(initialQuickReplies[language]);

    }, [language]);


    // ---------------- JSX (DARK MODE APPLIED) ----------------
    return (
        <>
            {/* --- Chat Button (Retained) --- */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-gradient-to-tr from-green-700 to-amber-700 hover:scale-110 transition-transform z-50"
                    size="icon"
                >
                    <MessageCircle className="h-6 w-6 text-white" />
                </Button>
            )}

            {/* --- Main Chat Card (DARK MODE) --- */}
            {isOpen && (
                // Added bg-gray-900 to Card for overall dark theme
                <Card className="fixed bottom-6 right-6 w-80 h-[480px] shadow-2xl z-50 flex flex-col rounded-xl overflow-hidden border border-gray-700 bg-gray-900">
                    <CardHeader 
                        // Header colors retained for branding/contrast
                        className="flex justify-between items-center p-3 bg-gradient-to-r from-green-700 to-amber-700 text-white flex-shrink-0"
                    >
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                            <Bot className="h-4 w-4" /> Eco Assistant
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6 text-white hover:bg-gray-700">
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    {/* ✅ FIX: CardContent now uses flex-col to stack everything */}
                    <CardContent 
                        // Changed bg-gray-50 to bg-gray-800 for chat body
                        className="flex flex-col h-full p-0 bg-gray-800"
                    >
                        {/* --- Language Selector (Fixed Height) (DARK MODE) --- */}
                        <div 
                            // Changed bg-white to bg-gray-900, border-b to border-gray-700
                            className="p-2 border-b border-gray-700 bg-gray-900 flex-shrink-0"
                        >
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as 'en-US' | 'hi-IN' | 'te-IN')}
                                // Changed bg-white to bg-gray-800, text-gray-900 to text-gray-200, border-gray-300 to border-gray-700, hover:border-green-700
                                className="text-sm border rounded w-full p-1 transition bg-gray-800 text-gray-200 border-gray-700 focus:border-green-400" 
                                disabled={isLoading || isBotTyping}
                            >
                                <option value="en-US">English</option>
                                <option value="hi-IN">हिन्दी</option>
                                <option value="te-IN">తెలుగు</option>
                            </select>
                        </div>
                        
                        {/* ✅ FIX: Messages Container - flex-1 allows it to take remaining vertical space. overflow-y-auto handles the scrolling. */}
                        <div 
                            // Background is still bg-gray-800 from CardContent
                            className="flex-1 p-3 overflow-y-auto space-y-3" 
                            ref={messagesContainerRef}
                        >
                            {/* --- Message Bubbles (See MessageBubble component for individual bubble changes) --- */}
                            {isLoading ? (
                                // Adjusted text-gray-500 to text-gray-400
                                <div className="flex justify-center items-center h-full min-h-[100px] text-gray-400">
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading chat history...
                                </div>
                            ) : (
                                messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
                            )}
                            
                            {isBotTyping && <div className="flex justify-start"><TypingIndicator /></div>}

                            {isError && (
                                // Adjusted error block for dark theme: bg-red-800, border-red-600, text-red-300
                                <div className="flex justify-center p-2 bg-red-800 border border-red-600 rounded-lg text-xs text-red-300">
                                    <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" /> Failed to save history. You can still chat!
                                </div>
                            )}
                        </div>
                        
                        {/* --- Quick Replies (Fixed Height) (DARK MODE) --- */}
                        {suggestedQuestions.length > 0 && !inputMessage && (
                            <div 
                                // Changed bg-white to bg-gray-900, border-t to border-gray-700
                                className="p-2 border-t border-gray-700 bg-gray-900 flex flex-wrap gap-1 flex-shrink-0"
                            >
                                {suggestedQuestions.map((reply, i) => (
                                    <Button
                                        key={i}
                                        // Changed variant="outline" for dark theme contrast
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleQuickReply(reply)}
                                        // Custom dark theme quick reply button: bg-gray-800, text-green-400, border-green-500, hover:bg-gray-700
                                        className="text-xs h-7 px-2 rounded-full transition text-green-400 border-green-500 bg-gray-800 hover:bg-gray-700"
                                        disabled={isBotTyping}
                                    >
                                        {reply}
                                    </Button>
                                ))}
                            </div>
                        )}

                        {/* --- Input and Controls (Fixed Height) (DARK MODE) --- */}
                        <div 
                            // Changed bg-white to bg-gray-900, border-t to border-gray-700
                            className="p-3 border-t border-gray-700 bg-gray-900 flex gap-2 items-center flex-shrink-0"
                        >
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                // Dark theme input: bg-gray-800, text-gray-100, border-gray-600, focus:border-green-400
                                className="flex-1 text-sm rounded-full border border-gray-600 focus:border-green-400 p-2 bg-gray-800 text-gray-100 placeholder:text-gray-400"
                                disabled={isBotTyping}
                            />
                            {/* Send Button colors retained for branding: bg-amber-700 */}
                            <Button 
                                onClick={() => handleSendMessage()} 
                                size="icon" 
                                className="h-10 w-10 rounded-full bg-amber-700 hover:bg-amber-800 text-white flex-shrink-0" 
                                disabled={isBotTyping || !inputMessage.trim()} 
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                            {/* Mic Button colors retained for branding: bg-green-700 */}
                            <Button 
                                onClick={startListening} 
                                size="icon" 
                                className="h-10 w-10 rounded-full bg-green-700 hover:bg-green-800 text-white flex-shrink-0" 
                                disabled={isBotTyping}
                            >
                                <Mic className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* --- Footer Hint (Fixed Height) (DARK MODE) --- */}
                        <div 
                            // Adjusted text-gray-400 to text-gray-500 for slight visibility on gray-900 background
                            className="text-xs text-gray-500 flex items-center gap-1 mt-1 px-3 mb-2 flex-shrink-0 bg-gray-900"
                        >
                            <CornerDownLeft className="h-3 w-3" /> Press Enter to send
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );
};

export default Chatbot;