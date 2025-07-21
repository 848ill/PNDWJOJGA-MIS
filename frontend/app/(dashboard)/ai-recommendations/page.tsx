
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateRecommendations } from './action';
import { Loader2, Send, Sparkles, Bot, User } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { MotionDiv } from '@/components/shared/MotionDiv';
import { EnhancedAiResponse } from '@/components/dashboard/EnhancedAiResponse';


interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AiRecommendationsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  
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
    } catch {
      const errorMessage: Message = { role: 'model', content: 'Terjadi kesalahan yang tidak terduga.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestChart = (query: string) => {
    setInput(query);
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
                        <CardTitle className="text-lg font-semibold text-gray-800">PAWA Enhanced - AI Analytics Center</CardTitle>
                        <CardDescription className="text-sm">Analisis comprehensive dengan visualisasi data, trend analysis, dan rekomendasi strategis untuk Pemerintah DIY.</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent ref={scrollAreaRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                        <Sparkles className="mx-auto h-16 w-16 text-blue-500/30 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">Selamat Datang di PAWA Enhanced</h3>
                        <p className="mt-1 text-slate-600">AI Analytics dengan Visualisasi Data Komprehensif</p>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                            <div className="p-3 bg-blue-50 rounded-lg text-left">
                                <h4 className="font-medium text-blue-800 text-sm">📊 Data & Charts</h4>
                                <p className="text-xs text-blue-600 mt-1">&quot;Buatkan grafik distribusi pengaduan per kategori&quot;</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg text-left">
                                <h4 className="font-medium text-green-800 text-sm">📈 Trend Analysis</h4>
                                <p className="text-xs text-green-600 mt-1">&quot;Analisis tren pengaduan 7 hari terakhir&quot;</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg text-left">
                                <h4 className="font-medium text-purple-800 text-sm">🎯 Smart Recommendations</h4>
                                <p className="text-xs text-purple-600 mt-1">&quot;Rekomendasi prioritas berdasarkan data&quot;</p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-lg text-left">
                                <h4 className="font-medium text-orange-800 text-sm">⚠️ Alert System</h4>
                                <p className="text-xs text-orange-600 mt-1">&quot;Identifikasi pengaduan prioritas tinggi&quot;</p>
                            </div>
                        </div>
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
                        <div className={cn("max-w-4xl rounded-xl shadow-sm", 
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white p-3 px-4' 
                            : 'bg-transparent p-0'
                        )}>
                            {msg.role === 'user' ? (
                                <div className="text-sm">{msg.content}</div>
                            ) : (
                                <EnhancedAiResponse 
                                    content={msg.content} 
                                    onRequestChart={handleRequestChart}
                                />
                            )}
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
                        placeholder="Minta analisis dengan visualisasi: 'Buatkan grafik distribusi pengaduan per wilayah' atau 'Analisis tren prioritas tinggi'"
                        className="flex-1 resize-none rounded-lg border-gray-300/50 shadow-sm focus-visible:ring-blue-500"
                        rows={2}
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