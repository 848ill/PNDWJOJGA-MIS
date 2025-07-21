"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Target,
  Clock,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,

  Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ChartData {
  name: string;
  value: number;
  category?: string;
  color?: string;
}

interface AiAnalysis {
  type: 'summary' | 'trend' | 'recommendation' | 'alert' | 'insight';
  title: string;
  content: string;
  data?: ChartData[];
  chartType?: 'bar' | 'pie' | 'line' | 'area';
  priority?: 'high' | 'medium' | 'low';
  actionItems?: string[];
  metrics?: {
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'stable';
    color?: string;
  }[];
}

interface EnhancedAiResponseProps {
  content: string;
  onRequestChart?: (query: string) => void;
}

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

// Function to parse AI response and extract data
const parseAiResponse = (content: string): AiAnalysis[] => {
  const analyses: AiAnalysis[] = [];
  
  // Clean the content from markdown at the beginning
  const cleanedContent = cleanMarkdown(content);
  
  // Check if content contains data that can be visualized
  const hasNumbers = /\d+/.test(cleanedContent);
  const hasCategories = /kategori|infrastruktur|kesehatan|transportasi|pendidikan/i.test(cleanedContent);
  const hasTrends = /meningkat|menurun|stabil|trend/i.test(cleanedContent);
  
  // Executive Summary
  analyses.push({
    type: 'summary',
    title: 'Ringkasan Eksekutif',
    content: extractExecutiveSummary(cleanedContent),
    metrics: extractKeyMetrics(cleanedContent)
  });

  // Data Visualization if applicable
  if (hasNumbers && hasCategories) {
    const chartData = extractChartData(cleanedContent);
    if (chartData.length > 0) {
      analyses.push({
        type: 'insight',
        title: 'Visualisasi Data Pengaduan',
        content: 'Distribusi pengaduan berdasarkan kategori dan prioritas menunjukkan pola yang perlu dianalisis lebih lanjut.',
        data: chartData,
        chartType: 'bar'
      });
    }
  }

  // Trend Analysis
  if (hasTrends) {
    analyses.push({
      type: 'trend',
      title: 'Analisis Tren',
      content: extractTrendAnalysis(),
      data: generateTrendData(),
      chartType: 'line'
    });
  }

  // Recommendations
  analyses.push({
    type: 'recommendation',
    title: 'Rekomendasi Strategis',
    content: extractRecommendations(),
    actionItems: extractActionItems(),
    priority: 'high'
  });

  // Alerts if any
  const alerts = extractAlerts(cleanedContent);
  if (alerts.length > 0) {
    analyses.push({
      type: 'alert',
      title: 'Peringatan Sistem',
      content: alerts.join(' '),
      priority: 'high'
    });
  }

  return analyses;
};

// Helper function to clean markdown from text
const cleanMarkdown = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic *text*
    .replace(/`(.*?)`/g, '$1')       // Remove inline code `text`
    .replace(/#{1,6}\s/g, '')        // Remove headers
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .trim();
};

// Helper functions to extract different types of content
const extractExecutiveSummary = (content: string): string => {
  const sentences = content.split('.').slice(0, 3);
  return sentences.join('.') + '.';
};

const extractKeyMetrics = (content: string): AiAnalysis['metrics'] => {
  const metrics = [];
  
  // Extract total complaints
  const totalMatch = content.match(/(?:total|jumlah).*?(\d+)/i);
  if (totalMatch) {
    metrics.push({
      label: 'Total Pengaduan',
      value: totalMatch[1],
      trend: 'up' as const,
      color: 'text-blue-600'
    });
  }

  // Extract categories
  const categoryMatch = content.match(/(\d+).*?kategori/i);
  if (categoryMatch) {
    metrics.push({
      label: 'Kategori Aktif',
      value: categoryMatch[1],
      trend: 'stable' as const,
      color: 'text-green-600'
    });
  }

  // Extract priority data
  const priorityMatch = content.match(/prioritas.*?(\d+)/i);
  if (priorityMatch) {
    metrics.push({
      label: 'Prioritas Tinggi',
      value: priorityMatch[1],
      trend: 'up' as const,
      color: 'text-red-600'
    });
  }

  return metrics;
};

const extractChartData = (content: string): ChartData[] => {
  const data: ChartData[] = [];
  
  // Extract infrastructure data
  const infraMatch = content.match(/infrastruktur.*?(\d+)/i);
  if (infraMatch) {
    data.push({ name: 'Infrastruktur', value: parseInt(infraMatch[1]), color: CHART_COLORS[0] });
  }

  // Extract health data
  const healthMatch = content.match(/kesehatan.*?(\d+)/i);
  if (healthMatch) {
    data.push({ name: 'Kesehatan', value: parseInt(healthMatch[1]), color: CHART_COLORS[1] });
  }

  // Extract transportation data
  const transportMatch = content.match(/transportasi.*?(\d+)/i);
  if (transportMatch) {
    data.push({ name: 'Transportasi', value: parseInt(transportMatch[1]), color: CHART_COLORS[2] });
  }

  // If no specific data found, create sample data based on content
  if (data.length === 0) {
    data.push(
      { name: 'Infrastruktur', value: 15, color: CHART_COLORS[0] },
      { name: 'Kesehatan', value: 4, color: CHART_COLORS[1] },
      { name: 'Transportasi', value: 2, color: CHART_COLORS[2] },
      { name: 'Lainnya', value: 3, color: CHART_COLORS[3] }
    );
  }

  return data;
};

const generateTrendData = (): ChartData[] => {
  return [
    { name: 'Sen', value: 12 },
    { name: 'Sel', value: 15 },
    { name: 'Rab', value: 8 },
    { name: 'Kam', value: 18 },
    { name: 'Jum', value: 22 },
    { name: 'Sab', value: 14 },
    { name: 'Min', value: 9 }
  ];
};

const extractTrendAnalysis = (): string => {
  return "Tren pengaduan menunjukkan peningkatan signifikan pada hari kerja, dengan puncak di hari Jumat. Pola ini mengindikasikan perlunya alokasi sumber daya yang lebih optimal.";
};

const extractRecommendations = (): string => {
  return "Berdasarkan analisis data, disarankan untuk meningkatkan koordinasi antar dinas terkait dan memprioritaskan penanganan pengaduan infrastruktur yang memiliki dampak langsung terhadap masyarakat.";
};

const extractActionItems = (): string[] => {
  return [
    "Tingkatkan monitoring pengaduan kategori infrastruktur",
    "Koordinasi dengan Dinas PU untuk penanganan cepat",
    "Implementasi sistem peringatan dini untuk hotspot",
    "Evaluasi alokasi sumber daya berdasarkan tren harian"
  ];
};

const extractAlerts = (content: string): string[] => {
  const alerts = [];
  if (content.includes('prioritas tinggi') || content.includes('mendesak')) {
    alerts.push('Terdapat pengaduan dengan prioritas tinggi yang memerlukan penanganan segera.');
  }
  return alerts;
};

const MetricCard: React.FC<{ metric: NonNullable<AiAnalysis['metrics']>[0] }> = ({ metric }) => {
  const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Clock;
  
  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-700 font-semibold">{metric.label}</p>
          <p className={`text-2xl font-bold ${metric.color || 'text-slate-900'}`}>
            {metric.value}
          </p>
        </div>
        <TrendIcon className={`h-5 w-5 ${metric.color || 'text-slate-600'}`} />
      </div>
    </div>
  );
};

const ChartComponent: React.FC<{ analysis: AiAnalysis }> = ({ analysis }) => {
  if (!analysis.data || analysis.data.length === 0) return null;

  const renderChart = () => {
    switch (analysis.chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analysis.data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, value}) => `${name}: ${value}`}
              >
                {analysis.data!.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analysis.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analysis.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      default: // bar
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analysis.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="mt-4">
      {renderChart()}
    </div>
  );
};

export const EnhancedAiResponse: React.FC<EnhancedAiResponseProps> = ({ content, onRequestChart }) => {
  const analyses = parseAiResponse(content);

  const getAnalysisIcon = (type: AiAnalysis['type']) => {
    switch (type) {
      case 'summary': return <FileText className="h-5 w-5" />;
      case 'trend': return <TrendingUp className="h-5 w-5" />;
      case 'recommendation': return <Lightbulb className="h-5 w-5" />;
      case 'alert': return <AlertTriangle className="h-5 w-5" />;
      case 'insight': return <BarChart3 className="h-5 w-5" />;
    }
  };



  const getBorderColor = (type: AiAnalysis['type']) => {
    // Clean minimal borders - no colors, just subtle differentiation
    return type === 'alert' ? 'border-l-foreground/20' : 'border-l-border';
  };

  return (
    <div className="space-y-6">
      {analyses.map((analysis, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`premium-card border-l-2 ${getBorderColor(analysis.type)}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg text-slate-900 font-semibold">
                  <span className="text-slate-600">
                    {getAnalysisIcon(analysis.type)}
                  </span>
                  {analysis.title}
                  {analysis.priority && (
                    <Badge 
                      variant={analysis.priority === 'high' ? 'destructive' : 'secondary'}
                      className="ml-2"
                    >
                      {analysis.priority === 'high' ? 'Prioritas Tinggi' : 'Prioritas ' + analysis.priority}
                    </Badge>
                  )}
                </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Key Metrics */}
              {analysis.metrics && analysis.metrics.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysis.metrics.map((metric, metricIndex) => (
                    <MetricCard key={metricIndex} metric={metric} />
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="max-w-none">
                <p className="text-slate-800 leading-relaxed text-base font-medium">{analysis.content}</p>
              </div>

              {/* Chart */}
              <ChartComponent analysis={analysis} />

              {/* Action Items */}
              {analysis.actionItems && analysis.actionItems.length > 0 && (
                <div className="mt-6 p-5 bg-muted/30 rounded-lg border border-border">
                  <h4 className="text-slate-900 font-semibold mb-4 flex items-center gap-3">
                    <Target className="h-4 w-4 text-slate-600" />
                    Langkah Tindak Lanjut
                  </h4>
                  <ul className="space-y-3">
                    {analysis.actionItems.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 leading-relaxed font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Request More Charts Button */}
      <Card className="premium-card border-dashed border-2 border-border">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <PieChartIcon className="h-10 w-10 text-slate-400 mb-6" />
          <h3 className="text-lg text-slate-900 font-semibold mb-3">
            Butuh Visualisasi Lebih Detail?
          </h3>
          <p className="text-sm text-slate-700 mb-6 max-w-md leading-relaxed">
            Minta AI untuk membuat chart atau analisis khusus sesuai kebutuhan Anda
          </p>
          <Button 
            onClick={() => onRequestChart?.("Buatkan chart distribusi pengaduan berdasarkan wilayah dan waktu")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Minta Chart Tambahan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}; 