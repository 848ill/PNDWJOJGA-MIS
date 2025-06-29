// app/login/page.tsx
'use client'; // This component will run on the client-side

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // Client-side Supabase client
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
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
    <div className="relative min-h-screen w-full bg-gray-50 overflow-hidden">
        {/* Animated Gradient Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob2 [animation-delay:2s]"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob [animation-delay:4s]"></div>

        <div className="relative flex min-h-screen w-full items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="rounded-2xl shadow-2xl border border-white/20 bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-2xl">
                    <CardHeader>
                        <div className="mx-auto my-8 text-center">
                            <h1 className="bg-gradient-to-r from-gray-800 to-black bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                                PNDWJOGJA
                            </h1>
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
                            <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 text-base rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20" disabled={loading}>
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