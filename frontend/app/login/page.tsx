// app/login/page.tsx
'use client'; // This component will run on the client-side

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // Client-side Supabase client
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient(); // Initialize client-side Supabase client

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      console.error('Login error:', signInError);
    } else {
      // Successfully logged in, redirect to dashboard
      router.push('/'); // Redirects to the root, which is our (dashboard)/page.tsx
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 overflow-hidden">
        {/* Sophisticated Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-slate-100/40"></div>

        <div className="relative flex min-h-screen w-full items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="rounded-2xl shadow-2xl border border-white/20 bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-2xl">
                    <CardHeader>
                        <div className="mx-auto my-8 text-center">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">DIY</span>
                                </div>
                            </div>
                            <h1 className="text-slate-800 text-3xl font-bold tracking-tight">
                                PANDAWA JOGJA
                            </h1>
                            <p className="text-slate-600 text-sm mt-1">Sistem Informasi Manajemen Pengaduan</p>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <form onSubmit={handleLogin} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-gray-600 font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nama@domain.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="bg-white/50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="text-gray-600 font-medium">Kata Sandi</Label>
                                    <Link
                                        href="#"
                                        className="ml-auto inline-block text-sm text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        Lupa kata sandi?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="bg-white/50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            {error && (
                                <p className="text-red-600 text-sm text-center">{error}</p>
                            )}
                            <Button 
                                type="submit" 
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 text-base rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20" 
                                disabled={loading}
                            >
                                {loading ? 'Sedang memproses...' : 'Masuk'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}