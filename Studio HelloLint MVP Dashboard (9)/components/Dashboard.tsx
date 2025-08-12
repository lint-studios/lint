import { CalendarDays, Play } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { KPICards } from "./KPICards";
import { InsightCards } from "./InsightCards";
import { useState, useEffect } from "react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AnalyticsData {
  totalFeedback: number;
  positiveSentiment: number;
  opportunities: number;
  hotTopics: number;
  trends: {
    feedback: { value: number; direction: 'up' | 'down' };
    sentiment: { value: number; direction: 'up' | 'down' };
    opportunities: { value: number; direction: 'up' | 'down' };
    topics: { value: number; direction: 'up' | 'down' };
  };
  lastAnalyzed?: string;
}

export function Dashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timeRange, setTimeRange] = useState("30");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-a4cd0473`;

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/analytics/overview`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    
    toast.loading("Analyzing customer feedback...", { id: "analysis" });
    
    try {
      const response = await fetch(`${baseUrl}/analytics/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ timeRange }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      
      if (result.success) {
        setAnalyticsData(result.data);
        toast.success("Analysis complete! Fresh insights are ready.", { id: "analysis" });
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Error running analysis:', error);
      toast.error("Analysis failed. Please try again.", { id: "analysis" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-l font-display font-semibold text-text-primary">
            Overview
          </h1>
          <p className="text-body-m font-body text-text-secondary mt-1">
            Customer insights from reviews, support, and social media
          </p>
          {analyticsData?.lastAnalyzed && (
            <p className="text-mono-label font-mono text-text-secondary mt-1">
              Last analyzed: {new Date(analyticsData.lastAnalyzed).toLocaleString()}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <CalendarDays className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            className="bg-primary text-white font-body font-medium"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || loading}
          >
            <Play className="h-4 w-4 mr-2" />
            {isAnalyzing ? "Analyzing..." : "Run Analysis"}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <KPICards data={analyticsData} />
      )}

      {/* Insights Grid */}
      <div>
        <h2 className="text-heading-m font-display font-semibold text-text-primary mb-6">
          Latest Insights
        </h2>
        <InsightCards />
      </div>
    </div>
  );
}