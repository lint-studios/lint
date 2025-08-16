import {
  Plus,
  ArrowUpRight,
  TrendingUp,
  Users,
  ShoppingCart,
  MessageSquare,
  Tag,
  ExternalLink,
  Copy,
  Eye,
  Link,
  Bot,
  BarChart3,
  Rocket,
  Lightbulb,
  AlertTriangle,
  Target,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

// Component: HowItWorksCard
function HowItWorksCard({
  title,
  description,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  title: string;
  description: string;
  icon: any;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <Card className="p-4 bg-surface-card border border-border-subtle rounded-2xl shadow-sm hover:shadow-md transition-shadow h-full min-h-[100px]">
      <div className="flex items-start space-x-3 h-full">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-1 leading-tight">
            {title}
          </h3>
          <p className="text-sm font-body text-text-secondary leading-snug flex-1">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}

// Component: DiscoveryCard
function DiscoveryCard({
  title,
  description,
  badge,
  icon: Icon,
  iconBg,
  iconColor,
  badgeGradient = "gradient-light-green",
}: {
  title: string;
  description: string;
  badge: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  badgeGradient?: string;
}) {
  return (
    <Card className="p-4 bg-surface-card border border-border-subtle rounded-2xl shadow-sm hover:shadow-md transition-shadow h-full min-h-[100px]">
      <div className="flex items-start space-x-3 h-full">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-display font-semibold text-text-primary leading-tight">
              {title}
            </h3>
            <Badge className={`${badgeGradient} text-white text-xs font-mono px-2 py-1 rounded-lg shadow-sm border-0`}>
              {badge}
            </Badge>
          </div>
          <p className="text-sm font-body text-text-secondary leading-snug">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function Dashboard() {
  const router = useRouter();

  const handleViewReports = () => {
    router.push('/dashboard?page=reports');
  };

  const howItWorks = [
    {
      title: "Connect Your Data",
      description: "Link reviews, support tickets, and customer feedback from any platform",
      icon: Link,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "AI-Powered Analysis",
      description: "Advanced clustering identifies patterns, sentiment, and emerging trends",
      icon: Bot,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Actionable Reports",
      description: "Get specific recommendations with priority levels and ROI projections",
      icon: BarChart3,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Drive Results",
      description: "Implement changes that measurably improve customer satisfaction",
      icon: Rocket,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  const discoveries = [
    {
      title: "Hidden Opportunities",
      description: "Untapped market segments and product innovation ideas",
      badge: "95% accuracy",
      icon: Lightbulb,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      badgeGradient: "gradient-light-green",
    },
    {
      title: "Critical Issues",
      description: "Problems affecting retention before they become widespread",
      badge: "89% prediction rate",
      icon: AlertTriangle,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      badgeGradient: "gradient-light-blue",
    },
    {
      title: "Priority Actions",
      description: "Ranked recommendations with expected revenue impact",
      badge: "Impact scored",
      icon: Target,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      badgeGradient: "gradient-light-orange",
    },
    {
      title: "Business Growth",
      description: "Quantified results from customer insight implementation",
      badge: "Measurable ROI",
      icon: TrendingUp,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      badgeGradient: "gradient-light-purple",
    },
  ];

  return (
    <div className="p-7 max-w-7xl mx-auto space-y-7">
      {/* Hero Section */}
      <div className="text-center space-y-3 py-7">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-[54px] font-normal leading-[0.9] tracking-[-0.02em] text-black mb-5 text-center">
          Welcome to{" "}
          <span className="font-body font-medium leading-[0.9] tracking-[-0.15rem] gradient-lint-text text-2xl sm:text-3xl lg:text-[47px]">
            lint<span className="text-primary">.</span>
          </span>{" "}
          Customer Intelligence
        </h1>
        <p className="text-body-m font-body text-text-secondary max-w-2xl mx-auto">
          Transform customer feedback into actionable business insights with AI-powered analysis
        </p>
        <Button 
          onClick={handleViewReports}
          className="gradient-lint text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all mt-5 px-7 py-3 text-body-m text-[rgba(255,255,255,1)] text-[14px]"
        >
          <Eye className="mr-3 h-4 w-4" />
          View Your Reports
        </Button>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left Column: How LINT Works */}
        <div className="space-y-5">
          <div className="text-center">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[45px] font-normal leading-[0.9] tracking-[-0.02em] text-black mb-5 flex items-center justify-center gap-2">
              How
              <span className="font-body font-medium leading-[0.9] tracking-[-0.15rem] gradient-lint-text text-xl sm:text-2xl lg:text-[40px]">
                lint<span className="text-primary">.</span>
              </span>
              Works
            </h2>
            <p className="text-body-s font-body text-text-secondary">
              From raw feedback to strategic insights in minutes
            </p>
          </div>
          <div className="space-y-3">
            {howItWorks.map((item, index) => (
              <HowItWorksCard key={index} {...item} />
            ))}
          </div>
        </div>

        {/* Right Column: What You'll Discover */}
        <div className="space-y-5">
          <div className="text-center">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[45px] font-normal leading-[0.9] tracking-[-0.02em] text-black mb-5">
              What You'll Discover
            </h2>
            <p className="text-body-s font-body text-text-secondary">
              Insights that drive real business growth
            </p>
          </div>
          <div className="space-y-3">
            {discoveries.map((item, index) => (
              <DiscoveryCard key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}