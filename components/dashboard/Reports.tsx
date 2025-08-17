import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { GoogleDriveModal } from "../ui/google-drive-modal";
import { MoreHorizontal, Download, RotateCcw, Eye, Calendar, Filter, ArrowLeft, ExternalLink, Copy, TrendingUp, AlertTriangle, Lightbulb, Target } from "lucide-react";

// Component: ReportCard for list view
function ReportCard({ report, onView }: { report: any; onView: (id: string) => void }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ready':
        return 'bg-accent text-white';
      case 'generating':
        return 'bg-secondary text-white';
      case 'failed':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <Card className="p-6 bg-surface-card border border-border-subtle rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-heading-s font-display font-semibold text-text-primary">
              {report.title}
            </h3>
            <Badge className={`text-mono-label font-mono px-2 py-1 rounded-lg ${getStatusColor(report.status)}`}>
              {report.status}
            </Badge>
          </div>
          <p className="text-body-s font-body text-text-secondary mb-3">
            {report.productsAnalyzed} products, {report.reviewsAnalyzed} reviews analyzed
          </p>
          <div className="space-y-1">
            <p className="text-mono-label font-mono text-text-secondary uppercase tracking-wide">
              {formatDateRange(report.reportStartDate, report.reportEndDate)}
            </p>
            <p className="text-mono-label font-mono text-text-secondary uppercase tracking-wide">
              Generated {formatDate(report.createdAt)}
            </p>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" className="p-2">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2 mb-6">
        {report.highlights?.keyFindings?.slice(0, 3).map((finding: string, index: number) => (
          <div key={index} className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-neutral rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-body-s font-body text-text-secondary">
              {finding}
            </p>
          </div>
        )) || (
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-neutral rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-body-s font-body text-text-secondary">
              {report.sentimentScore ? `${report.sentimentScore.toFixed(1)}/5.0 average sentiment score` : 'Customer insights analysis complete'}
            </p>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <Button 
          onClick={() => onView(report.id)}
          className="flex-1 gradient-lint text-white font-medium rounded-xl"
        >
          <Eye className="mr-2 h-4 w-4" />
          View report
        </Button>
        <Button variant="outline" className="font-medium rounded-xl border-border-subtle text-text-primary hover:bg-surface-hover">
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
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGoogleDriveModal, setShowGoogleDriveModal] = useState(false);
  const [selectedReportForModal, setSelectedReportForModal] = useState<any>(null);

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/reports');
        const data = await response.json();
        
        if (data.success) {
          setReports(data.data);
        } else {
          setError(data.error || 'Failed to fetch reports');
        }
      } catch (err) {
        setError('Failed to fetch reports');
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleViewReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setSelectedReportForModal(report);
      setShowGoogleDriveModal(true);
    }
  };

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
          <h1 className="font-display text-display-xl font-normal leading-[0.9] tracking-[-0.02em] text-black mb-6">
            Reports
          </h1>
          <p className="text-body-m font-body text-text-secondary">
            Customer insight reports and analytics
          </p>
        </div>
        <Button className="gradient-lint text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all px-6 py-3">
          <Download className="mr-2 h-4 w-4" />
          Generate new report
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-body-s font-mono text-text-secondary uppercase tracking-wider">Filters</span>
        </div>
        <Select>
          <SelectTrigger className="w-48 font-body text-body-m rounded-xl border-2 border-gray-300 hover:border-primary transition-colors bg-white shadow-sm">
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
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 bg-surface-card border border-border-subtle rounded-2xl">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 bg-surface-card border border-border-subtle rounded-2xl text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-heading-s font-display font-semibold text-text-primary mb-2">
                Failed to load reports
              </h3>
              <p className="text-body-s font-body text-text-secondary">
                {error}
              </p>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-primary hover:bg-primary/90 text-white font-medium rounded-xl"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </Card>
      ) : reports.length === 0 ? (
        <Card className="p-8 bg-surface-card border border-border-subtle rounded-2xl text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Download className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-heading-s font-display font-semibold text-text-primary mb-2">
                No reports yet
              </h3>
              <p className="text-body-s font-body text-text-secondary">
                Generate your first customer insights report to get started.
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium rounded-xl">
              <Download className="mr-2 h-4 w-4" />
              Generate new report
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report) => (
            <ReportCard 
              key={report.id} 
              report={report} 
              onView={handleViewReport}
            />
          ))}
        </div>
      )}

      {/* Google Drive Modal */}
      {selectedReportForModal && (
        <GoogleDriveModal
          isOpen={showGoogleDriveModal}
          onClose={() => {
            setShowGoogleDriveModal(false);
            setSelectedReportForModal(null);
          }}
          report={selectedReportForModal}
        />
      )}
    </div>
  );
}