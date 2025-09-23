import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m here to help you with any questions about our eco-friendly products and services. How can I assist you today?',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isBotTyping]);

  const initialQuickReplies = [
    'What products do you offer?',
    'How does vermicompost work?',
    'Tell me about biogas plants',
    'How can I volunteer?',
    'Donation information',
  ];

  const botResponses = [
    { 
      keywords: ['product', 'offer', 'line'], 
      response: 'We offer 5 eco-friendly product lines: Happy Raithu (vermicompost), Gracious Gas (biogas units), SBL Pots (eco gardening pots), Clayer (clay water bottles), and Neem Brush (biodegradable toothbrushes). Each product is designed to support sustainable living!',
      suggestions: ['Tell me more about vermicompost', 'What are biogas units?', 'Where can I see all your products?']
    },
    { 
      keywords: ['vermicompost', 'happy raithu'], 
      response: 'Vermicompost uses earthworms to break down organic waste into nutrient-rich fertilizer. It\'s completely natural, improves soil health, and reduces waste. Our Happy Raithu vermicompost is perfect for gardens and farms!',
      suggestions: ['How can I buy Happy Raithu?', 'Is vermicompost safe for plants?', 'What is the price of vermicompost?']
    },
    { 
      keywords: ['biogas', 'gas plant', 'gracious gas'], 
      response: 'Our Gracious Gas biogas units convert kitchen waste and organic matter into clean cooking gas. They reduce waste, provide renewable energy, and are available for both domestic and commercial use. Perfect for sustainable homes!',
      suggestions: ['How much does a biogas unit cost?', 'Is it hard to install?', 'How do I maintain a biogas plant?']
    },
    { 
      keywords: ['volunteer', 'join'], 
      response: 'We\'d love to have you join our volunteer community! You can help with environmental education, community outreach, event organization, and more. Visit our volunteer page to apply and make a difference!',
      suggestions: ['What is the time commitment for volunteering?', 'Can I volunteer remotely?', 'Tell me about environmental education.']
    },
    { 
      keywords: ['donation', 'donate', 'contribute'], 
      response: 'Your donations help us expand our impact! We support vermicompost production, biogas plant setup, environmental education, and community development. All donations are tax-deductible under 80G.',
      suggestions: ['How can I make a donation?', 'Can I get a tax receipt for my donation?']
    },
    { 
      keywords: ['hello', 'hi', 'hey'], 
      response: 'Hello there! Welcome to Kare 💖 Save - The Caring Cycle. I\'m here to help you learn about our sustainable products and services.',
      suggestions: initialQuickReplies
    },
    { 
      keywords: ['price', 'cost'], 
      response: 'Our prices vary by product. Vermicompost starts from ₹300, biogas units from ₹15,000, eco pots from ₹150, clay bottles from ₹800, and neem brushes from ₹150. Check our shop for detailed pricing!',
      suggestions: ['Tell me more about the price of biogas units.', 'What is the price of eco pots?', 'Do you have a price list?']
    },
    { 
      keywords: ['delivery', 'ship', 'shipping'], 
      response: 'We offer delivery across India! Orders above ₹500 get free delivery. Standard delivery takes 3-5 business days. We use eco-friendly packaging for all shipments.',
      suggestions: ['Can I track my order?', 'How do you handle returns?', 'What is your refund policy?']
    },
    { 
      keywords: ['contact', 'reach'], 
      response: 'You can reach us at info@karesave.org or call +91 98765 43210. We\'re also available on WhatsApp for quick queries!',
      suggestions: ['What are your working hours?', 'Is there a physical store?', 'Do you have a WhatsApp group?']
    },
    { 
      keywords: ['return', 'refund', 'policy'], 
      response: 'We have a 7-day return policy for unused products. For consumables like vermicompost, we offer replacement for quality issues. Your satisfaction is our priority!',
      suggestions: ['How do I initiate a return?', 'Can I get a full refund?', 'What products can I not return?']
    },
  ];

  const generateBotResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    const matchingResponse = botResponses.find(entry => 
      entry.keywords.some(keyword => lowerMessage.includes(keyword))
    );

    if (matchingResponse) {
      return {
        text: matchingResponse.response,
        suggestions: matchingResponse.suggestions,
      };
    }

    return {
      text: 'Thanks for your question! For specific inquiries, please contact us at info@karesave.org or call +91 98765 43210. Our team will be happy to help you with detailed information about our products and services.',
      suggestions: initialQuickReplies,
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isBotTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsBotTyping(true);

    setTimeout(() => {
      const { text: botResponseText, suggestions } = generateBotResponse(userMessage.text);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setSuggestedQuestions(suggestions);
      setIsBotTyping(false);
    }, Math.random() * 1500 + 500);
  };

  const handleQuickReply = (reply: string) => {
    if (isBotTyping) return;
    setInputMessage(reply);
    setTimeout(() => {
        handleSendMessage();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (messages.length === 1) {
      setSuggestedQuestions(initialQuickReplies);
    }
  }, [messages]);

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 transition-all hover:scale-110"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-2xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bot className="h-4 w-4 text-primary" />
              Eco Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex flex-col h-full p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] p-2 rounded-lg text-sm',
                        message.isBot
                          ? 'bg-gray-200 text-gray-900' // updated color
                          : 'bg-primary text-primary-foreground'
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {message.isBot && <Bot className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                        <span>{message.text}</span>
                        {!message.isBot && <User className="h-3 w-3 mt-0.5 flex-shrink-0" />}
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
                  {suggestedQuestions.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs h-6"
                      disabled={isBotTyping}
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="text-sm"
                  disabled={isBotTyping}
                />
                <Button 
                  onClick={handleSendMessage}
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  disabled={isBotTyping}
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <CornerDownLeft className="h-3 w-3" />
                  Press Enter to send
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
