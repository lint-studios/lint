import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, Heart, MessageSquare, Lightbulb, AlertTriangle } from "lucide-react";
import { cn } from "./ui/utils";

interface KPICardProps {
  title: string;
  value: string;
  trend?: "up" | "down";
  trendValue?: string;
  icon: React.ReactNode;
  iconColor: string;
}

interface AnalyticsData {
  totalFeedback: number;
  positiveSentiment: number;
  opportunities: number;
  hotTopics: number;
  trends?: {
    feedback: { value: number; direction: 'up' | 'down' };
    sentiment: { value: number; direction: 'up' | 'down' };
    opportunities: { value: number; direction: 'up' | 'down' };
    topics: { value: number; direction: 'up' | 'down' };
  };
}

function KPICard({ title, value, trend, trendValue, icon, iconColor }: KPICardProps) {
  return (
    <Card className="kpi">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="kpi-label uppercase tracking-wide mb-2">
            {title}
          </p>
          <p className="kpi-value text-text-primary mb-1">
            {value}
          </p>
          {trend && trendValue && (
            <div className="flex items-center space-x-1">
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-accent" />
              ) : (
                <TrendingDown className="h-3 w-3 text-secondary" />
              )}
              <span className={cn(
                "text-mono-label font-mono",
                trend === "up" ? "text-accent" : "text-secondary"
              )}>
                {trendValue}
              </span>
              <span className="text-mono-label font-mono text-text-secondary">
                vs last period
              </span>
            </div>
          )}
        </div>
        <div className="kpi-chip">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function KPICards({ data }: { data: AnalyticsData | null }) {
  const defaultData = {
    totalFeedback: 24678,
    positiveSentiment: 78,
    opportunities: 147,
    hotTopics: 32,
    trends: {
      feedback: { value: 12, direction: 'up' as const },
      sentiment: { value: 5, direction: 'up' as const },
      opportunities: { value: 23, direction: 'up' as const },
      topics: { value: 8, direction: 'down' as const }
    }
  };

  const analyticsData = data || defaultData;

  const kpis = [
    {
      title: "Total Feedback",
      value: analyticsData.totalFeedback.toLocaleString(),
      trend: analyticsData.trends?.feedback.direction || "up",
      trendValue: `+${analyticsData.trends?.feedback.value || 12}%`,
      icon: <MessageSquare className="h-5 w-5 text-white" />,
      iconColor: "bg-primary"
    },
    {
      title: "Positive Sentiment",
      value: `${analyticsData.positiveSentiment}%`,
      trend: analyticsData.trends?.sentiment.direction || "up",
      trendValue: `+${analyticsData.trends?.sentiment.value || 5}%`,
      icon: <Heart className="h-5 w-5 text-white" />,
      iconColor: "bg-accent"
    },
    {
      title: "New Opportunities",
      value: analyticsData.opportunities.toString(),
      trend: analyticsData.trends?.opportunities.direction || "up",
      trendValue: `+${analyticsData.trends?.opportunities.value || 23}%`,
      icon: <Lightbulb className="h-5 w-5 text-white" />,
      iconColor: "bg-secondary"
    },
    {
      title: "Hot Topics",
      value: analyticsData.hotTopics.toString(),
      trend: analyticsData.trends?.topics.direction || "down",
      trendValue: `-${analyticsData.trends?.topics.value || 8}%`,
      icon: <AlertTriangle className="h-5 w-5 text-white" />,
      iconColor: "bg-gray-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <KPICard 
          key={kpi.title} 
          {...kpi} 
          trend={kpi.trend as "up" | "down"}
        />
      ))}
    </div>
  );
}