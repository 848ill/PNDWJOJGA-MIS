'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  Sparkles, 
  BarChart3,
  Users, 
  Shield, 
  Zap,
  Brain,
  Globe,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Database,
  Cpu,
  Palette,
  Code2
} from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20">
      {/* Navigation */}
              <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-amber-200/30 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">BB</span>
            </div>
            <span className="font-bold text-xl text-slate-900">Bala Bantuan</span>
            <Badge variant="secondary" className="ml-2">Dev Team</Badge>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="#portfolio" className="text-slate-600 hover:text-slate-900 transition-colors">
              Portfolio
            </Link>
            <Link href="#services" className="text-slate-600 hover:text-slate-900 transition-colors">
              Services
            </Link>
            <Link href="#team" className="text-slate-600 hover:text-slate-900 transition-colors">
              Team
            </Link>
            <Button asChild className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/login">
                Live Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center space-y-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-4 border-amber-300 text-amber-800 bg-amber-50/80 shadow-sm">
                🏆 Showcase Project: PNDW JOGJA MIS
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
                Government Systems
                <span className="bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent block">
                  Redefined
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-xl md:text-2xl text-slate-700 max-w-4xl mx-auto leading-relaxed font-medium"
              variants={fadeInUp}
            >
              Tim <strong className="text-slate-900">Bala Bantuan</strong> menghadirkan sistem informasi pemerintahan modern dengan 
              <strong className="text-amber-700"> AI Analytics</strong>, <strong className="text-amber-700">Real-time Mapping</strong>, dan 
              <strong className="text-amber-700"> Enterprise Architecture</strong> untuk transformasi digital yang sesungguhnya.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                asChild
              >
                <Link href="/login">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Explore Live Demo
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-amber-300 text-amber-800 hover:bg-amber-50 px-8 py-4 text-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Award className="mr-2 h-5 w-5" />
                View Case Study
              </Button>
            </motion.div>

            <motion.div 
              className="flex items-center justify-center gap-8 text-sm text-slate-500 pt-8"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Enterprise Grade</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>AI-Powered Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Real-time Dashboard</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/70 shadow-inner">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent mb-2">10+</div>
              <div className="text-slate-700 font-medium">Government Modules</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent mb-2">AI</div>
              <div className="text-slate-700 font-medium">Analytics Engine</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent mb-2">7</div>
              <div className="text-slate-700 font-medium">User Roles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent mb-2">100%</div>
              <div className="text-slate-700 font-medium">TypeScript</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="portfolio" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 border-amber-300 text-amber-800 bg-amber-50/80 shadow-sm">
              Featured Project
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              PNDW JOGJA MIS Showcase
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Sistem informasi pengaduan masyarakat dengan teknologi terdepan untuk Pemerintah DIY
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Analytics Feature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full bg-gradient-to-br from-amber-50/50 to-orange-50/30 border-amber-200/50 hover:shadow-2xl transition-all duration-300 group backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    PAWA Enhanced AI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-4">
                    AI Analytics Center powered by Google Gemini untuk analisis data real-time dan rekomendasi strategis
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Natural Language Processing
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Auto Data Visualization
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Strategic Recommendations
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Real-time Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full bg-gradient-to-br from-orange-50/50 to-red-50/30 border-orange-200/50 hover:shadow-2xl transition-all duration-300 group backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    Executive Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-4">
                    Real-time analytics dashboard dengan geographic mapping dan multi-layer data visualization
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Interactive Maps (Leaflet)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Live Data Streaming
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Role-based Access Control
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Management System */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full bg-gradient-to-br from-yellow-50/50 to-amber-50/30 border-yellow-200/50 hover:shadow-2xl transition-all duration-300 group backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    Integrated Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-4">
                    Complete management system dengan multi-department integration dan advanced security
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Multi-Department Support
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Advanced User Management
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Audit Trail System
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-stone-900 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise-Grade Technology Stack
            </h2>
            <p className="text-slate-300 text-lg">
              Built with modern, scalable, and production-ready technologies
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
          >
            <div className="text-center">
              <Code2 className="h-8 w-8 mx-auto mb-3 text-amber-400" />
              <h3 className="font-semibold mb-2">Frontend</h3>
              <p className="text-sm text-stone-300">Next.js 15, React 18, TypeScript</p>
            </div>
            <div className="text-center">
              <Database className="h-8 w-8 mx-auto mb-3 text-orange-400" />
              <h3 className="font-semibold mb-2">Backend</h3>
              <p className="text-sm text-stone-300">Supabase, PostgreSQL, Row Level Security</p>
            </div>
            <div className="text-center">
              <Cpu className="h-8 w-8 mx-auto mb-3 text-yellow-400" />
              <h3 className="font-semibold mb-2">AI & Analytics</h3>
              <p className="text-sm text-stone-300">Google Gemini, Recharts, Leaflet</p>
            </div>
            <div className="text-center">
              <Palette className="h-8 w-8 mx-auto mb-3 text-red-400" />
              <h3 className="font-semibold mb-2">UI/UX</h3>
              <p className="text-sm text-stone-300">Tailwind CSS, shadcn/ui, Framer Motion</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 border-slate-300">
              Meet the Team
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Tim Bala Bantuan
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Tim developer berpengalaman yang siap membantu transformasi digital organisasi Anda
            </p>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl p-8 md:p-12 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Ready to Transform Your Organization?
              </h3>
              <p className="text-slate-700 text-lg mb-8 max-w-2xl mx-auto">
                Tim Bala Bantuan siap membantu membangun sistem informasi modern untuk kebutuhan organisasi Anda. 
                Dengan pengalaman membangun PNDW JOGJA MIS, kami dapat mengadaptasi solusi terbaik untuk domain apapun.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                  <h4 className="font-semibold text-slate-900">Performance Focus</h4>
                  <p className="text-sm text-slate-700">Optimized for scale and speed</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                  <h4 className="font-semibold text-slate-900">Security First</h4>
                  <p className="text-sm text-slate-700">Enterprise-grade security</p>
                </div>
                <div className="text-center">
                  <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                  <h4 className="font-semibold text-slate-900">Modern Tech</h4>
                  <p className="text-sm text-slate-700">Latest technology stack</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Globe className="mr-2 h-5 w-5" />
                  Start Your Project
                </Button>
                <Button size="lg" variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-50 shadow-md hover:shadow-lg transition-all duration-300">
                  <Star className="mr-2 h-5 w-5" />
                  View More Projects
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-stone-900 to-amber-900 text-white shadow-2xl">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to See the Magic?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Experience PNDW JOGJA MIS live demo and see how modern government systems should work
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 hover:from-amber-300 hover:to-orange-400 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link href="/login">
                <Sparkles className="mr-2 h-5 w-5" />
                Launch Live Demo
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gradient-to-r from-stone-50 to-amber-50 border-t border-amber-200/50 shadow-inner">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">BB</span>
              </div>
              <span className="font-bold text-xl text-slate-900">Bala Bantuan</span>
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">Development Team</Badge>
            </div>
            <div className="text-slate-700 text-sm font-medium">
              © 2024 Tim Bala Bantuan. Showcase Project: PNDW JOGJA MIS
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 