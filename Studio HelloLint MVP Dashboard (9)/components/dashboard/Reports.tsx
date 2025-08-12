import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { MoreHorizontal, Download, RotateCcw, Eye, Calendar, Filter, ArrowLeft, ExternalLink, Copy, TrendingUp, AlertTriangle, Lightbulb, Target } from "lucide-react";

// Component: ReportCard for list view
function ReportCard({ report, onView }: { report: any; onView: (id: string) => void }) {
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
              {report.title}
            </h3>
            <Badge className={`text-mono-label font-mono px-2 py-1 rounded-lg ${statusStyles[report.status]}`}>
              {report.status}
            </Badge>
          </div>
          <p className="text-body-s font-body text-text-secondary mb-2">
            {report.subtitle}
          </p>
          <p className="text-mono-label font-mono text-text-secondary uppercase tracking-wide">
            {report.date}
          </p>
        </div>
        
        <Button variant="ghost" size="sm" className="p-2">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2 mb-6">
        {report.highlights.map((highlight: string, index: number) => (
          <div key={index} className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-body-s font-body text-text-secondary">
              {highlight}
            </p>
          </div>
        ))}
      </div>
      
      <div className="flex items-center space-x-3">
        <Button 
          onClick={() => onView(report.id)}
          className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl"
        >
          <Eye className="mr-2 h-4 w-4" />
          View report
        </Button>
        <Button variant="outline" className="font-medium rounded-xl">
          <Download className="mr-2 h-4 w-4" />
          PDF
        </Button>
      </div>
    </Card>
  );
}

// Component: ReportSection for detail view
function ReportSection({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <Card className="p-8 bg-surface-card border border-border-subtle rounded-2xl shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-heading-m font-display font-semibold text-text-primary">
          {title}
        </h2>
      </div>
      {children}
    </Card>
  );
}

export function Reports() {
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reports = [
    {
      id: "1",
      title: "November Customer Insights",
      subtitle: "19 products, 2,400 reviews analyzed",
      date: "November 2024",
      status: "Ready",
      highlights: [
        "78% positive sentiment, up 5% from last month",
        "Fast delivery mentioned in 847 reviews",
        "Sizing accuracy remains top complaint (312 mentions)"
      ]
    },
    {
      id: "2", 
      title: "October Customer Insights",
      subtitle: "19 products, 2,156 reviews analyzed",
      date: "October 2024",
      status: "Ready",
      highlights: [
        "73% positive sentiment overall",
        "Product quality praised in 623 reviews",
        "Return process needs improvement (89 mentions)"
      ]
    },
    {
      id: "3",
      title: "September Customer Insights",
      subtitle: "18 products, 1,987 reviews analyzed", 
      date: "September 2024",
      status: "Ready",
      highlights: [
        "71% positive sentiment",
        "Color accuracy improved significantly",
        "Shipping delays mentioned in 156 reviews"
      ]
    }
  ];

  const themes = [
    { name: "Fast Delivery", frequency: "847 mentions", sentiment: "positive" },
    { name: "Product Quality", frequency: "623 mentions", sentiment: "positive" },
    { name: "Size Guide Issues", frequency: "312 mentions", sentiment: "negative" },
    { name: "Color Accuracy", frequency: "187 mentions", sentiment: "negative" },
    { name: "Customer Service", frequency: "156 mentions", sentiment: "mixed" }
  ];

  const products = [
    { sku: "TSH-001", name: "Classic Cotton Tee", mentions: 234, sentiment: 82 },
    { sku: "JAN-005", name: "Denim Jacket", mentions: 189, sentiment: 76 },
    { sku: "DRS-012", name: "Summer Dress", mentions: 167, sentiment: 79 },
    { sku: "SHO-008", name: "Running Shoes", mentions: 145, sentiment: 88 },
    { sku: "SWE-003", name: "Wool Sweater", mentions: 98, sentiment: 73 }
  ];

  const risks = [
    { 
      issue: "Return Process Complexity", 
      impact: "High", 
      mentions: 89,
      recommendation: "Simplify return form"
    },
    {
      issue: "Size Chart Accuracy",
      impact: "High", 
      mentions: 312,
      recommendation: "Update measurements"
    },
    {
      issue: "Shipping Delays",
      impact: "Medium",
      mentions: 156, 
      recommendation: "Set expectations"
    }
  ];

  const marketingAngles = [
    {
      title: "Quality Promise",
      copy: '"Built to last - premium materials that stand the test of time"',
      confidence: "High"
    },
    {
      title: "Speed Advantage", 
      copy: '"Next-day delivery on all orders - because waiting shouldn\'t be part of shopping"',
      confidence: "High"
    },
    {
      title: "Perfect Fit Guarantee",
      copy: '"Love the fit or return it free - we make sizing simple"',
      confidence: "Medium"
    }
  ];

  if (view === "detail") {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => setView("list")}
              className="p-2 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-display-l font-display font-semibold text-text-primary">
                November Customer Insights
              </h1>
              <p className="text-body-m font-body text-text-secondary">
                November 1-30, 2024 • 2,400 reviews analyzed
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="font-medium rounded-xl">
              <Calendar className="mr-2 h-4 w-4" />
              Change dates
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium rounded-xl">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Key Themes */}
        <ReportSection title="Key Themes" icon={TrendingUp}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((theme, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-body-m font-body font-medium text-text-primary">
                    {theme.name}
                  </h3>
                  <Badge 
                    variant={theme.sentiment === "positive" ? "default" : theme.sentiment === "negative" ? "destructive" : "secondary"}
                    className="text-mono-label font-mono"
                  >
                    {theme.sentiment}
                  </Badge>
                </div>
                <p className="text-body-s font-body text-text-secondary">
                  {theme.frequency}
                </p>
              </div>
            ))}
          </div>
        </ReportSection>

        {/* Product Hotlist */}
        <ReportSection title="Product Hotlist" icon={Target}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-4 text-mono-label font-mono text-text-secondary uppercase tracking-wide">SKU</th>
                  <th className="text-left py-4 text-mono-label font-mono text-text-secondary uppercase tracking-wide">Product</th>
                  <th className="text-left py-4 text-mono-label font-mono text-text-secondary uppercase tracking-wide">Mentions</th>
                  <th className="text-left py-4 text-mono-label font-mono text-text-secondary uppercase tracking-wide">Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index} className="border-b border-border-subtle">
                    <td className="py-4 text-body-s font-mono text-text-primary">{product.sku}</td>
                    <td className="py-4 text-body-m font-body font-medium text-text-primary">{product.name}</td>
                    <td className="py-4 text-body-s font-body text-text-secondary">{product.mentions}</td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-accent h-2 rounded-full"
                            style={{ width: `${product.sentiment}%` }}
                          ></div>
                        </div>
                        <span className="text-body-s font-body text-text-primary">{product.sentiment}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ReportSection>

        {/* Returns/Risks */}
        <ReportSection title="Returns/Risks" icon={AlertTriangle}>
          <div className="space-y-4">
            {risks.map((risk, index) => (
              <div key={index} className="p-6 border border-border-subtle rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-body-m font-body font-semibold text-text-primary">
                        {risk.issue}
                      </h3>
                      <Badge 
                        variant={risk.impact === "High" ? "destructive" : "secondary"}
                        className="text-mono-label font-mono"
                      >
                        {risk.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-body-s font-body text-text-secondary">
                      {risk.mentions} mentions in customer feedback
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4 text-secondary" />
                    <span className="text-body-s font-body font-medium text-text-primary">
                      Recommended fix:
                    </span>
                    <Badge variant="outline" className="text-mono-label font-mono">
                      {risk.recommendation}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ReportSection>

        {/* Marketing Angles */}
        <ReportSection title="Marketing Angles" icon={Target}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {marketingAngles.map((angle, index) => (
              <Card key={index} className="p-6 border border-border-subtle rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-body-m font-body font-semibold text-text-primary mb-2">
                      {angle.title}
                    </h3>
                    <p className="text-body-s font-body text-text-secondary italic mb-3">
                      {angle.copy}
                    </p>
                    <Badge 
                      variant={angle.confidence === "High" ? "default" : "secondary"}
                      className="text-mono-label font-mono"
                    >
                      {angle.confidence} Confidence
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" className="w-full font-medium rounded-xl mt-4">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to clipboard
                </Button>
              </Card>
            ))}
          </div>
        </ReportSection>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-l font-display font-semibold text-text-primary mb-2">
            Reports
          </h1>
          <p className="text-body-m font-body text-text-secondary">
            Customer insight reports and analytics
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all">
          <Download className="mr-2 h-4 w-4" />
          Generate new report
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Select>
          <SelectTrigger className="w-48 font-body text-body-m rounded-xl">
            <SelectValue placeholder="All months" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="november">November 2024</SelectItem>
            <SelectItem value="october">October 2024</SelectItem>
            <SelectItem value="september">September 2024</SelectItem>
          </SelectContent>
        </Select>
        
        <Select>
          <SelectTrigger className="w-48 font-body text-body-m rounded-xl">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => (
          <ReportCard 
            key={report.id} 
            report={report} 
            onView={(id) => {
              setSelectedReport(id);
              setView("detail");
            }}
          />
        ))}
      </div>
    </div>
  );
}