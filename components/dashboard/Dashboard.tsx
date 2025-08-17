import { Eye, Link, Server, BarChart3, Rocket, Lightbulb, AlertTriangle, Target, BarChart } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";

// Component: FeatureCard for "How lint. Works" section
function FeatureCard({ title, description, icon: Icon, index }: {
  title: string;
  description: string;
  icon: any;
  index: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Card 
      className={`panel-card smooth-transition ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ 
        transitionDelay: `${index * 100}ms`,
        animation: isVisible ? 'slideInUp 0.6s ease-out forwards' : 'none'
      }}
    >
      <div className="flex items-start space-x-4 group">
        <div className="kpi-chip icon-hover">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-heading-s font-display font-semibold text-text-primary mb-2 text-hover">
            {title}
          </h3>
          <p className="text-body-s font-body text-text-secondary text-hover">
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
    const timer = setTimeout(() => setIsVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  const badgeColors = {
    green: "bg-green-100 text-green-700 border-green-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200", 
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200"
  };

  return (
    <Card 
      className={`panel-card smooth-transition ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ 
        transitionDelay: `${index * 100}ms`,
        animation: isVisible ? 'slideInUp 0.6s ease-out forwards' : 'none'
      }}
    >
      <div className="flex items-start justify-between group">
        <div className="flex items-start space-x-4">
          <div className="kpi-chip icon-hover">
            <Icon className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-heading-s font-display font-semibold text-text-primary mb-2 text-hover">
              {title}
            </h3>
            <p className="text-body-s font-body text-text-secondary text-hover">
              {description}
            </p>
          </div>
        </div>
        <Badge 
          className={`text-mono-label font-mono px-2 py-1 rounded-lg badge-hover border ${badgeColors[badge.color as keyof typeof badgeColors]}`}
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

  useEffect(() => {
    // Hero animation
    const heroTimer = setTimeout(() => setHeroVisible(true), 200);
    
    // Columns animation
    const columnsTimer = setTimeout(() => setColumnsVisible(true), 800);
    
    return () => {
      clearTimeout(heroTimer);
      clearTimeout(columnsTimer);
    };
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
    <div className="p-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Section */}
      <div 
        className={`text-center space-y-6 smooth-transition ${
          heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 
          className={`font-display text-4xl sm:text-5xl lg:text-6xl font-normal leading-[0.9] tracking-[-0.02em] text-black mb-6 text-center text-[64px] smooth-transition ${
            heroVisible ? 'animate-fade-in-up' : ''
          }`}
        >
          Welcome to{" "}
          <span className="font-body font-medium leading-[0.9] tracking-[-0.02em] gradient-lint-text text-[60px]">
            lint<span className="text-primary">.</span>
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
        >
          <Eye className="mr-2 h-4 w-4" />
          View Your Reports
        </Button>
      </div>

      {/* Two-Column Feature Showcase */}
      <div 
        className={`grid grid-cols-1 lg:grid-cols-2 gap-16 smooth-transition ${
          columnsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Left Column: How lint. Works */}
        <div className="space-y-8">
          <div 
            className={`space-y-3 smooth-transition ${
              columnsVisible ? 'animate-fade-in-left' : ''
            }`}
          >
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal leading-[0.9] tracking-[-0.02em] text-black mb-6 flex items-center justify-center gap-2 text-[50px]">
              How
              <span className="font-body font-medium leading-[0.9] tracking-[-0.02em] gradient-lint-text text-[45px]">
                lint<span className="text-primary">.</span>
              </span>
              Works
            </h2>
            <p className="text-body-m font-body text-text-secondary">
              From raw feedback to strategic insights in minutes
            </p>
          </div>
          
          <div className="space-y-6">
            {howItWorksFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>

        {/* Right Column: What You'll Discover */}
        <div className="space-y-8">
          <div 
            className={`space-y-3 smooth-transition ${
              columnsVisible ? 'animate-fade-in-right' : ''
            }`}
          >
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal leading-[0.9] tracking-[-0.02em] text-black mb-6 text-[50px]">
              What You'll Discover
            </h2>
            <p className="text-body-m font-body text-text-secondary">
              Insights that drive real business growth
            </p>
          </div>
          
          <div className="space-y-6">
            {discoveryFeatures.map((feature, index) => (
              <DiscoveryCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}