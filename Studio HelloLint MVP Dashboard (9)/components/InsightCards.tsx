import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, AlertTriangle, Lightbulb, Target, TrendingUp, Users, MoreHorizontal } from "lucide-react";
import { Badge } from "./ui/badge";

interface InsightCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  items: Array<{
    title: string;
    description: string;
    metric?: string;
    status?: "positive" | "negative" | "neutral";
  }>;
}

function InsightCard({ title, description, icon, iconColor, items }: InsightCardProps) {
  return (
    <Card className="p-6 bg-surface-card border border-border-subtle">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${iconColor}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-heading-s font-display font-semibold text-text-primary">
              {title}
            </h3>
            <p className="text-body-s font-body text-text-secondary">
              {description}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border-l-2 border-gray-200 pl-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-body-m font-body font-medium text-text-primary mb-1">
                  {item.title}
                </h4>
                <p className="text-body-s font-body text-text-secondary">
                  {item.description}
                </p>
              </div>
              {item.metric && (
                <Badge 
                  variant={item.status === "positive" ? "default" : "secondary"}
                  className={
                    item.status === "positive" 
                      ? "bg-accent text-white" 
                      : item.status === "negative"
                      ? "bg-secondary text-white"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {item.metric}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function InsightCards() {
  const insights = [
    {
      title: "Customer Love Signals",
      description: "Top positive themes and quotes",
      icon: <Heart className="h-4 w-4 text-white" />,
      iconColor: "bg-accent",
      items: [
        {
          title: "Fast Delivery Praise",
          description: "\"Arrived next day, exactly as promised. Love the speed!\"",
          metric: "847 mentions",
          status: "positive" as const
        },
        {
          title: "Product Quality",
          description: "Customers consistently mention durability and craftsmanship",
          metric: "623 mentions",
          status: "positive" as const
        }
      ]
    },
    {
      title: "Fix-First Issues",
      description: "Recurring complaints and volume trends",
      icon: <AlertTriangle className="h-4 w-4 text-white" />,
      iconColor: "bg-secondary",
      items: [
        {
          title: "Sizing Accuracy",
          description: "\"Runs small, had to exchange for larger size\"",
          metric: "312 complaints",
          status: "negative" as const
        },
        {
          title: "Color Variations",
          description: "Screen colors differ from actual product",
          metric: "186 complaints",
          status: "negative" as const
        }
      ]
    },
    {
      title: "Product Innovation Ideas",
      description: "Feature and product requests",
      icon: <Lightbulb className="h-4 w-4 text-white" />,
      iconColor: "bg-primary",
      items: [
        {
          title: "Sustainable Materials",
          description: "Requests for eco-friendly fabric options",
          metric: "234 requests",
          status: "neutral" as const
        },
        {
          title: "Extended Size Range",
          description: "Demand for plus sizes and petite options",
          metric: "167 requests",
          status: "neutral" as const
        }
      ]
    },
    {
      title: "Marketing & Ad Hooks",
      description: "Campaign ideas and messaging angles",
      icon: <Target className="h-4 w-4 text-white" />,
      iconColor: "bg-gray-600",
      items: [
        {
          title: "Breathable Summer Collection",
          description: "\"Perfect for hot weather, stays cool all day\"",
          metric: "89% sentiment",
          status: "positive" as const
        },
        {
          title: "Professional Versatility",
          description: "Works for both office and casual settings",
          metric: "76% sentiment",
          status: "positive" as const
        }
      ]
    },
    {
      title: "Hot Topics This Month",
      description: "Trending keywords and categories",
      icon: <TrendingUp className="h-4 w-4 text-white" />,
      iconColor: "bg-secondary",
      items: [
        {
          title: "Holiday Gift Sets",
          description: "Seasonal bundling and gift packaging mentions",
          metric: "+145% spike",
          status: "positive" as const
        },
        {
          title: "Back to School",
          description: "Student-friendly products and pricing",
          metric: "+89% spike",
          status: "positive" as const
        }
      ]
    },
    {
      title: "Retention & Loyalty Risks",
      description: "Churn and refund triggers",
      icon: <Users className="h-4 w-4 text-white" />,
      iconColor: "bg-gray-700",
      items: [
        {
          title: "Shipping Delays",
          description: "Late deliveries causing cancellations",
          metric: "23% churn risk",
          status: "negative" as const
        },
        {
          title: "Price Sensitivity",
          description: "Cost concerns mentioned in negative reviews",
          metric: "18% churn risk",
          status: "negative" as const
        }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {insights.map((insight) => (
        <InsightCard key={insight.title} {...insight} />
      ))}
    </div>
  );
}