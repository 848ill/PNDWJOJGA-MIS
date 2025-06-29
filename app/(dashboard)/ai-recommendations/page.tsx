// app/(dashboard)/ai-recommendations/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateRecommendations } from './action';
import ReactMarkdown from 'react-markdown';
import { Loader2, Send, User, Bot } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from '@/lib/utils';


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
    p: ({ node, ...props }) => <p className="leading-7 [&:not(:first-child)]:mt-2" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc space-y-2 pl-5" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal space-y-2 pl-5" {...props} />,
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
        <header className="p-4 border-b">
            <h1 className="text-xl font-bold">PAWA - Pandawa AI Wisdom Advisor</h1>
            <p className="text-sm text-muted-foreground">Penasihat interaktif Anda untuk analisis data pengaduan.</p>
        </header>

        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.length === 0 ? (
                <div className="text-center text-muted-foreground pt-10">
                    <Bot className="mx-auto h-12 w-12" />
                    <p className="mt-4">Tanyakan apa saja tentang data pengaduan.</p>
                    <p className="text-sm">contoh: "Apa 3 pengaduan teratas minggu ini?"</p>
                </div>
            ) : (
                messages.map((msg, index) => (
                <div key={index} className={cn("flex items-start gap-4", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {msg.role === 'model' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                    )}
                    <div className={cn("max-w-xl rounded-lg p-3 text-sm", 
                        msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    )}>
                        <ReactMarkdown components={markdownComponents}>{msg.content}</ReactMarkdown>
                    </div>
                    {msg.role === 'user' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    )}
                </div>
                ))
            )}
            {loading && (
                <div className="flex items-start gap-4 justify-start">
                     <Avatar className="h-8 w-8">
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted max-w-xl rounded-lg p-3 text-sm flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Sedang berpikir...</span>
                    </div>
                </div>
            )}
        </div>

        <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tanyakan tentang pengaduan prioritas tinggi, tema berulang, dll."
                    className="flex-1 resize-none"
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                />
                <Button type="submit" disabled={loading || !input.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Kirim</span>
                </Button>
            </form>
        </div>
    </div>
  );
}