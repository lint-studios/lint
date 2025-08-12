import { Plus, ArrowUpRight, TrendingUp, Users, ShoppingCart, MessageSquare, Tag, ExternalLink, Copy, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

// Component: StatCard
function StatCard({ title, value, delta, icon: Icon, trend = "up" }: {
  title: string;
  value: string;
  delta: string;
  icon: any;
  trend?: "up" | "down";
}) {
  return (
    <Card className="p-6 bg-surface-card border border-border-subtle rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-mono-label font-mono text-text-secondary uppercase tracking-wide mb-2">
            {title}
          </p>
          <p className="text-display-l font-display font-semibold text-text-primary mb-2">
            {value}
          </p>
          <div className="flex items-center space-x-1">
            <TrendingUp className={`h-3 w-3 ${trend === 'up' ? 'text-accent' : 'text-warning-light'}`} />
            <span className={`text-body-s font-body font-medium ${trend === 'up' ? 'text-accent' : 'text-warning-light'}`}>
              {delta} vs last month
            </span>
          </div>
        </div>
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </Card>
  );
}

// Component: InsightCard
function InsightCard({ title, description, type, items }: {
  title: string;
  description: string;
  type: "positive" | "negative" | "neutral";
  items: Array<{ title: string; description: string; metric: string; status: string }>;
}) {
  const typeStyles = {
    positive: "border-accent/20 bg-accent/5",
    negative: "border-warning/20 bg-warning/5",
    neutral: title === "Marketing angles to test" ? "border-neutral/20 bg-neutral/5" : "border-secondary/20 bg-secondary/5"
  };

  return (
    <Card className={`p-6 border rounded-2xl shadow-sm hover:shadow-md transition-shadow ${typeStyles[type]}`}>
      <div className="mb-4">
        <h3 className="text-heading-s font-display font-semibold text-text-primary mb-2">
          {title}
        </h3>
        <p className="text-body-s font-body text-text-secondary">
          {description}
        </p>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start justify-between p-3 bg-surface-card rounded-xl border border-border-subtle">
            <div className="flex-1">
              <h4 className="text-body-m font-body font-medium text-text-primary mb-1">
                {item.title}
              </h4>
              <p className="text-body-s font-body text-text-secondary mb-2">
                {item.description}
              </p>
              <Badge 
                variant={item.status === "positive" ? "default" : item.status === "negative" ? "destructive" : "secondary"}
                className={`text-mono-label font-mono ${
                  title === "Marketing angles to test" ? "bg-neutral text-gray-700" :
                  item.status === "positive" ? "bg-accent text-white" : 
                  item.status === "negative" ? "bg-warning text-white" :
                  "bg-secondary text-white"
                }`}
              >
                {item.metric}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Component: ReportCard
function ReportCard({ title, date, status, highlights }: {
  title: string;
  date: string;
  status: "Ready" | "Running" | "Scheduled";
  highlights: string[];
}) {
  const statusStyles = {
    Ready: "bg-accent text-white",
    Running: "bg-secondary text-white",
    Scheduled: "bg-gray-200 text-gray-700"
  };

  return (
    <Card className="p-6 bg-surface-card border border-border-subtle rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-heading-s font-display font-semibold text-text-primary">
              {title}
            </h3>
            <Badge className={`text-mono-label font-mono px-2 py-1 rounded-lg ${statusStyles[status]}`}>
              {status}
            </Badge>
          </div>
          <p className="text-body-s font-body text-text-secondary">
            {date}
          </p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {highlights.map((highlight, index) => (
          <div key={index} className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-neutral rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-body-s font-body text-text-secondary">
              {highlight}
            </p>
          </div>
        ))}
      </div>
      
      <Button variant="outline" className="w-full font-medium rounded-xl border-accent text-accent hover:bg-accent hover:text-white shadow-sm hover:shadow-md transition-all">
        <Eye className="mr-2 h-4 w-4" />
        View
      </Button>
    </Card>
  );
}

export function Dashboard() {
  const stats = [
    { title: "Total Reviews", value: "24,678", delta: "+12%", icon: MessageSquare },
    { title: "Support Tickets", value: "1,247", delta: "+5%", icon: Users },
    { title: "Products Analyzed", value: "342", delta: "+23%", icon: ShoppingCart },
    { title: "Key Themes", value: "28", delta: "-8%", icon: Tag, trend: "down" as const },
  ];

  const insights = [
    {
      title: "Top Opportunities",
      description: "Highest impact improvements with customer confidence scores",
      type: "positive" as const,
      items: [
        {
          title: "Size Guide Improvements",
          description: "Add detailed measurements and fit photos",
          metric: "85% confidence",
          status: "positive"
        },
        {
          title: "Color Accuracy",
          description: "Update product photos to match actual colors",
          metric: "78% confidence", 
          status: "positive"
        }
      ]
    },
    {
      title: "What customers love",
      description: "Top positive themes and frequently mentioned benefits",
      type: "positive" as const,
      items: [
        {
          title: "Fast Shipping",
          description: "Consistently praised delivery speed",
          metric: "92% positive",
          status: "positive"
        },
        {
          title: "Product Quality",
          description: "Materials and construction quality",
          metric: "88% positive",
          status: "positive"
        }
      ]
    },
    {
      title: "Risks to address",
      description: "Issues that could impact customer satisfaction and retention",
      type: "negative" as const,
      items: [
        {
          title: "Return Process",
          description: "Complex return procedures causing frustration",
          metric: "High severity",
          status: "negative"
        },
        {
          title: "Customer Service Response",
          description: "Slow response times to inquiries",
          metric: "Medium severity",
          status: "negative"
        }
      ]
    },
    {
      title: "Marketing angles to test",
      description: "Customer language and messaging opportunities",
      type: "neutral" as const,
      items: [
        {
          title: "Premium Quality Focus",
          description: '"Built to last" and durability messaging',
          metric: "Copy to clipboard",
          status: "neutral"
        },
        {
          title: "Fast Delivery Promise",
          description: '"Next-day delivery" prominently featured',
          metric: "Copy to clipboard",
          status: "neutral"
        }
      ]
    }
  ];

  const reports = [
    {
      title: "November Customer Insights",
      date: "November 2024",
      status: "Ready" as const,
      highlights: [
        "78% positive sentiment, up 5% from last month",
        "Fast delivery mentioned in 847 reviews",
        "Sizing accuracy remains top complaint (312 mentions)"
      ]
    },
    {
      title: "October Customer Insights", 
      date: "October 2024",
      status: "Ready" as const,
      highlights: [
        "73% positive sentiment overall",
        "Product quality praised in 623 reviews", 
        "Return process needs improvement (89 mentions)"
      ]
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Strip */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-l font-display font-semibold text-text-primary mb-2">
            This month's highlights
          </h1>
          <p className="text-body-m font-body text-text-secondary">
            Latest insights from your customer feedback across all channels
          </p>
        </div>
        <Button className="gradient-lint text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all">
          <Plus className="mr-2 h-4 w-4" />
          Generate latest report
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <InsightCard key={index} {...insight} />
        ))}
      </div>

      {/* Reports Preview */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading-m font-display font-semibold text-text-primary">
            Recent Reports
          </h2>
          <Button variant="outline" className="font-medium rounded-xl border-secondary text-secondary hover:bg-secondary hover:text-white shadow-sm hover:shadow-md transition-all">
            View all reports
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <ReportCard key={index} {...report} />
          ))}
        </div>
      </div>
    </div>
  );
}