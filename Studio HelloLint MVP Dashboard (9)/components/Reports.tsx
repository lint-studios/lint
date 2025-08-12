import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { CalendarDays, FileText, BarChart3, Eye, TrendingUp } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Report {
  id: string;
  name: string;
  date: string;
  sources: string[];
  highlights: string[];
  sentiment: number;
}

function ReportPreview({ report }: { report: Report }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-heading-m font-display font-semibold text-text-primary mb-2">
          {report.name}
        </h2>
        <div className="flex items-center space-x-4 text-body-s font-body text-text-secondary">
          <span>Generated {report.date}</span>
          <span>•</span>
          <span>{report.sources.length} sources</span>
        </div>
      </div>

      <div>
        <h3 className="text-body-m font-body font-medium text-text-primary mb-3">Summary</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-body-s font-body text-text-secondary">Overall Sentiment</span>
            <span className="text-heading-s font-display font-semibold text-accent">
              {report.sentiment}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${report.sentiment}%` }}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-body-m font-body font-medium text-text-primary mb-3">Key Highlights</h3>
        <div className="space-y-3">
          {report.highlights.map((highlight, index) => (
            <div key={index} className="border-l-2 border-primary pl-3">
              <p className="text-body-s font-body text-text-primary">{highlight}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-body-m font-body font-medium text-text-primary mb-3">Data Sources</h3>
        <div className="flex flex-wrap gap-2">
          {report.sources.map((source) => (
            <Badge key={source} variant="outline">
              {source}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-body-m font-body font-medium text-text-primary mb-3">Charts & Analysis</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 h-32 flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-gray-400" />
            <span className="ml-2 text-body-s font-body text-gray-500">
              Sentiment Trends
            </span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 h-32 flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-gray-400" />
            <span className="ml-2 text-body-s font-body text-gray-500">
              Topic Analysis
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Reports() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const reports: Report[] = [
    {
      id: "1",
      name: "November Customer Insights",
      date: "November 15, 2024",
      sources: ["Judge.me Reviews", "Support Tickets", "Social Media"],
      highlights: [
        "78% positive sentiment, up 5% from last month",
        "Fast delivery mentioned in 847 reviews",
        "Sizing accuracy remains top complaint (312 mentions)"
      ],
      sentiment: 78
    },
    {
      id: "2", 
      name: "Q3 Product Feedback Analysis",
      date: "October 28, 2024",
      sources: ["Judge.me Reviews", "Support Tickets"],
      highlights: [
        "73% positive sentiment overall",
        "Quality improvements noted by customers",
        "Shipping delays caused 23% of negative reviews"
      ],
      sentiment: 73
    },
    {
      id: "3",
      name: "Holiday Season Preparation",
      date: "October 15, 2024", 
      sources: ["Judge.me Reviews", "Social Media"],
      highlights: [
        "Gift packaging requests up 145%",
        "Holiday gift set mentions trending",
        "Price sensitivity concerns emerging"
      ],
      sentiment: 81
    }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    toast.loading("Generating comprehensive report...", { id: "generate" });
    
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    toast.success("Report generated successfully! Check your reports list.", { id: "generate" });
    setIsGenerating(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display-l font-display font-semibold text-text-primary">
            Reports
          </h1>
          <p className="text-body-m font-body text-text-secondary mt-1">
            Generated insights and analysis reports
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <CalendarDays className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            className="bg-primary text-white font-body font-medium"
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            <FileText className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate Report"}
          </Button>
        </div>
      </div>

      {/* Reports Table */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-border-subtle text-mono-label font-mono text-text-secondary uppercase tracking-wide">
            <div className="col-span-4">Report Name</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-3">Sources</div>
            <div className="col-span-2">Key Highlights</div>
            <div className="col-span-1">Actions</div>
          </div>
          
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-body-m font-body font-medium text-text-primary mb-2">
                No reports yet
              </h3>
              <p className="text-body-s font-body text-text-secondary mb-4">
                Generate your first report to get started
              </p>
              <Button onClick={handleGenerateReport}>Generate First Report</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="grid grid-cols-12 gap-4 py-4 border-b border-border-subtle last:border-b-0 hover:bg-gray-50 rounded-lg px-2">
                  <div className="col-span-4">
                    <h3 className="text-body-m font-body font-medium text-text-primary">
                      {report.name}
                    </h3>
                  </div>
                  <div className="col-span-2">
                    <span className="text-body-s font-body text-text-secondary">
                      {report.date}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <div className="flex flex-wrap gap-1">
                      {report.sources.map((source, index) => (
                        <Badge key={index} variant="outline" className="text-mono-label">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-body-s font-body text-text-secondary truncate">
                      {report.highlights[0]}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[600px] sm:w-[600px]">
                        <SheetHeader>
                          <SheetTitle className="font-display">Report Preview</SheetTitle>
                        </SheetHeader>
                        {selectedReport && <ReportPreview report={selectedReport} />}
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}