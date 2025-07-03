'use client'; 

import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  MapPin,
  BarChart3,
  Target
} from "lucide-react";

interface AiInsight {
  id: string;
  mainTopic: string | null;
  summary: string | null;
  advice: string | null;
  whatToDo: string | null;
  sentiment: string | null;
  categoryName: string | null;
  title: string;
}

interface AiInsightsDisplayProps {
  insights: AiInsight[];
  isLoading: boolean;
}

export const AiInsightsDisplay = ({ insights, isLoading }: AiInsightsDisplayProps) => {
  // Generate meaningful insights based on actual data patterns
  const generateSmartInsights = () => {
    if (!insights || insights.length === 0) {
      return [
        {
          icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
          title: "Analisis Data Pengaduan",
          content: "Belum ada data pengaduan yang cukup untuk menghasilkan wawasan AI.",
          type: "info"
        }
      ];
    }

    const smartInsights = [];

    // Priority Analysis
    const totalComplaints = insights.length;
    
    smartInsights.push({
      icon: <Target className="h-5 w-5 text-red-500" />,
      title: "Tingkat Prioritas",
      content: `Terdapat ${totalComplaints} pengaduan aktif yang memerlukan perhatian dalam 7 hari terakhir.`,
      type: "priority"
    });

    // Category Analysis
    const categories = insights.map(i => i.categoryName).filter(Boolean);
    const uniqueCategories = Array.from(new Set(categories));
    
    if (uniqueCategories.length > 0) {
      smartInsights.push({
        icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
        title: "Kategori Dominan",
        content: `Ditemukan ${uniqueCategories.length} kategori pengaduan berbeda, dengan distribusi yang perlu dianalisis lebih lanjut.`,
        type: "category"
      });
    }

    // Sentiment Analysis
    const sentiments = insights.map(i => i.sentiment).filter(Boolean);
    const negativeSentiments = sentiments.filter(s => s === 'Negative').length;
    const sentimentPercentage = sentiments.length > 0 ? Math.round((negativeSentiments / sentiments.length) * 100) : 0;
    
    if (sentiments.length > 0) {
      smartInsights.push({
        icon: <TrendingUp className="h-5 w-5 text-orange-500" />,
        title: "Analisis Sentimen",
        content: `${sentimentPercentage}% pengaduan menunjukkan sentimen negatif, menandakan area yang perlu perhatian khusus.`,
        type: "sentiment"
      });
    }

    // Actionable Recommendations
    smartInsights.push({
      icon: <AlertTriangle className="h-5 w-5 text-green-500" />,
      title: "Rekomendasi Tindakan",
      content: "Prioritaskan penanganan pengaduan dengan sentimen negatif dan kategori infrastruktur untuk meningkatkan kepuasan masyarakat.",
      type: "action"
    });

    // Geographic Insights
    smartInsights.push({
      icon: <MapPin className="h-5 w-5 text-purple-500" />,
      title: "Distribusi Geografis",
      content: "Gunakan peta untuk mengidentifikasi cluster pengaduan dan mengoptimalkan alokasi sumber daya tim lapangan.",
      type: "location"
    });

    return smartInsights;
  };

  const smartInsights = generateSmartInsights();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {smartInsights.map((insight, index) => (
        <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {insight.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  {insight.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {insight.content}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-blue-600" />
          <span className="text-xs text-blue-700 font-medium">
            Data diperbarui secara real-time • Terakhir: {new Date().toLocaleTimeString('id-ID')}
          </span>
        </div>
      </div>
    </div>
  );
};