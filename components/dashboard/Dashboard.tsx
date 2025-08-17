import { Eye, Link, Server, BarChart3, Rocket, Lightbulb, AlertTriangle, Target, BarChart } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Component: FeatureCard for "How lint. Works" section
function FeatureCard({ title, description, icon: Icon, index }: {
  title: string;
  description: string;
  icon: any;
  index: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Card 
      className={`panel-card smooth-transition h-full ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ 
        animation: isVisible ? 'slideInUp 0.3s ease-out forwards' : 'none'
      }}
    >
      <div className="flex items-start space-x-3 group h-full">
        <div className="flex-shrink-0 p-2 rounded-lg bg-blue-50 icon-hover">
          <Icon className="h-3 w-3 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="text-sm font-display font-semibold text-text-primary mb-1 text-hover leading-tight">
            {title}
          </h3>
          <p className="text-xs font-body text-text-secondary text-hover leading-snug">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}

// Component: DiscoveryCard for "What You'll Discover" section
function DiscoveryCard({ title, description, icon: Icon, badge, index }: {
  title: string;
  description: string;
  icon: any;
  badge: { text: string; color: string };
  index: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const badgeColors = {
    green: "gradient-light-green text-white",
    blue: "gradient-light-blue text-white", 
    orange: "gradient-light-orange text-white",
    purple: "gradient-light-purple text-white"
  };

  return (
    <Card 
      className={`panel-card smooth-transition h-full ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ 
        animation: isVisible ? 'slideInUp 0.3s ease-out forwards' : 'none'
      }}
    >
      <div className="flex items-start justify-between group h-full">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 p-2 rounded-lg bg-green-50 icon-hover">
            <Icon className="h-3 w-3 text-green-600" />
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <h3 className="text-sm font-display font-semibold text-text-primary mb-1 text-hover leading-tight">
              {title}
            </h3>
            <p className="text-xs font-body text-text-secondary text-hover leading-snug">
              {description}
            </p>
          </div>
        </div>
        <Badge 
          className={`text-xs font-mono px-2 py-1 rounded-lg badge-hover flex-shrink-0 ${badgeColors[badge.color as keyof typeof badgeColors]}`}
        >
          {badge.text}
        </Badge>
      </div>
    </Card>
  );
}

export function Dashboard() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [columnsVisible, setColumnsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Immediate clean loading
    setHeroVisible(true);
    setColumnsVisible(true);
  }, []);

  const howItWorksFeatures = [
    {
      title: "Connect Your Data",
      description: "Link reviews, support tickets, and customer feedback from any platform.",
      icon: Link
    },
    {
      title: "AI-Powered Analysis", 
      description: "Advanced clustering identifies patterns, sentiment, and emerging trends.",
      icon: Server
    },
    {
      title: "Actionable Reports",
      description: "Get specific recommendations with priority levels and ROI projections.",
      icon: BarChart3
    },
    {
      title: "Drive Results",
      description: "Implement changes that measurably improve customer satisfaction.",
      icon: Rocket
    }
  ];

  const discoveryFeatures = [
    {
      title: "Hidden Opportunities",
      description: "Untapped market segments and product innovation ideas.",
      icon: Lightbulb,
      badge: { text: "95% accuracy", color: "green" }
    },
    {
      title: "Critical Issues",
      description: "Problems affecting retention before they become widespread.",
      icon: AlertTriangle,
      badge: { text: "89% prediction rate", color: "blue" }
    },
    {
      title: "Priority Actions",
      description: "Ranked recommendations with expected revenue impact.",
      icon: Target,
      badge: { text: "Impact scored", color: "orange" }
    },
    {
      title: "Business Growth",
      description: "Quantified results from customer insight implementation.",
      icon: BarChart,
      badge: { text: "Measurable ROI", color: "purple" }
    }
  ];

  return (
    <div className="p-7 max-w-6xl mx-auto space-y-14">
      {/* Hero Section */}
      <div 
        className={`text-center space-y-6 smooth-transition ${
          heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 
          className={`font-display text-3xl sm:text-4xl lg:text-[54px] font-normal leading-[0.9] tracking-[-0.02em] text-black mb-5 text-center smooth-transition ${
            heroVisible ? 'animate-fade-in-up' : ''
          }`}
        >
          Welcome to{" "}
          <span className="font-body font-medium leading-[0.9] tracking-[-0.18rem] gradient-lint-text text-2xl sm:text-3xl lg:text-[47px]">
            lint<span className="text-primary tracking-normal">.</span>
          </span>{" "}
          Customer Intelligence
        </h1>
        <p 
          className={`text-body-m font-body text-text-secondary max-w-2xl mx-auto smooth-transition ${
            heroVisible ? 'animate-fade-in-up stagger-1' : ''
          }`}
        >
          Transform customer feedback into actionable business insights with AI-powered analysis.
        </p>
        <Button 
          className={`btn-cta button-hover micro-bounce ${
            heroVisible ? 'opacity-100 translate-y-0 animate-fade-in-up stagger-2' : 'opacity-0 translate-y-4'
          }`}
          onClick={() => router.push('/dashboard?page=reports')}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Your Reports
        </Button>
      </div>

      {/* Two-Column Feature Showcase */}
      <div 
        className={`grid grid-cols-1 lg:grid-cols-2 gap-14 smooth-transition ${
          columnsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Left Column: How lint. Works */}
        <div className="space-y-7">
          <div 
            className={`space-y-3 smooth-transition ${
              columnsVisible ? 'animate-fade-in-left' : ''
            }`}
          >
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[45px] font-normal leading-[0.9] tracking-[-0.02em] text-black mb-5 text-center">
              How{" "}
              <span className="font-body font-medium leading-[0.9] tracking-[-0.18rem] gradient-lint-text text-2xl sm:text-3xl lg:text-[40px]">
                lint<span className="text-primary tracking-normal">.</span>
              </span>{" "}
              Works
            </h2>
            <p className="text-body-m font-body text-text-secondary text-center">
              From raw feedback to strategic insights in minutes
            </p>
          </div>
          
          <div className="space-y-5">
            {howItWorksFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>

        {/* Right Column: What You'll Discover */}
        <div className="space-y-7">
          <div 
            className={`space-y-3 smooth-transition ${
              columnsVisible ? 'animate-fade-in-right' : ''
            }`}
          >
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[45px] font-normal leading-[0.9] tracking-[-0.02em] text-black mb-5 text-center">
              What You'll Discover
            </h2>
            <p className="text-body-m font-body text-text-secondary text-center">
              Insights that drive real business growth
            </p>
          </div>
          
          <div className="space-y-5">
            {discoveryFeatures.map((feature, index) => (
              <DiscoveryCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}