// app/(dashboard)/ai-recommendations/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateRecommendations } from './action';
import ReactMarkdown from 'react-markdown';
import { Loader2, Send, Sparkles, Bot, User } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { MotionDiv } from '@/components/shared/MotionDiv';

// Define the structure of a chat message
interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AiRecommendationsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));
      
      const result = await generateRecommendations(history, userMessage.content);

      if (result.success && result.report) {
        const assistantMessage: Message = { role: 'model', content: result.report };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = { role: 'model', content: result.report || 'Maaf, terjadi sebuah kesalahan.' };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = { role: 'model', content: 'Terjadi kesalahan yang tidak terduga.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const markdownComponents: { [key: string]: React.FC<any> } = {
    p: ({ node, ...props }) => <p className="leading-relaxed" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc space-y-1 pl-5" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal space-y-1 pl-5" {...props} />,
    strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
  };

  return (
    <MotionDiv
        className="h-full flex flex-col p-4 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <Card variant="glass" className="h-full flex flex-col">
            <CardHeader className="border-b border-black/5">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white/60">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            <Sparkles className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-lg font-semibold text-gray-800">PAWA - Pandawa AI Wisdom Advisor</CardTitle>
                        <CardDescription className="text-sm">Penasihat interaktif Anda untuk analisis data pengaduan.</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent ref={scrollAreaRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                        <Sparkles className="mx-auto h-16 w-16 text-blue-500/30 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">Selamat Datang di PAWA</h3>
                        <p className="mt-1">Tanyakan apa saja tentang data pengaduan.</p>
                        <p className="text-sm text-muted-foreground/80 mt-2">contoh: "Apa 3 pengaduan teratas minggu ini?"</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                    <div key={index} className={cn("flex items-start gap-4", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.role === 'model' && (
                            <Avatar className="h-9 w-9 border-2 border-white/60">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                    <Bot className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn("max-w-2xl rounded-xl p-3 px-4 text-sm shadow-sm", 
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white/80 backdrop-blur-sm'
                        )}>
                            <ReactMarkdown components={markdownComponents}>{msg.content}</ReactMarkdown>
                        </div>
                        {msg.role === 'user' && (
                             <Avatar className="h-9 w-9 border-2 border-white/60">
                                <AvatarFallback className="bg-gray-700 text-white">
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                    ))
                )}
                {loading && (
                    <div className="flex items-start gap-4 justify-start">
                         <Avatar className="h-9 w-9 border-2 border-white/60">
                           <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                <Bot className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="bg-white/80 backdrop-blur-sm max-w-xl rounded-xl p-3 px-4 text-sm flex items-center shadow-sm">
                            <Loader2 className="h-4 w-4 animate-spin mr-2 text-gray-500" />
                            <span>Sedang berpikir...</span>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-4 border-t border-black/5">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3 w-full">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Tanyakan tentang pengaduan prioritas tinggi, tema berulang, dll."
                        className="flex-1 resize-none rounded-lg border-gray-300/50 shadow-sm focus-visible:ring-blue-500"
                        rows={1}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                    />
                    <Button variant="default" size="lg" type="submit" disabled={loading || !input.trim()} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Kirim</span>
                    </Button>
                </form>
            </CardFooter>
        </Card>
    </MotionDiv>
  );
}