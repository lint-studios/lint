import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Badge } from "./badge";
import { ExternalLink, FileText, Download, Calendar, TrendingUp } from "lucide-react";

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: {
    id: string;
    title: string;
    subtitle: string;
    organizationName: string;
    status: string;
    reportType: string;
    reportStartDate: string;
    reportEndDate: string;
    productsAnalyzed: number;
    reviewsAnalyzed: number;
    sentimentScore: number | null;
    googleDriveUrl: string | null;
    createdAt: string;
  };
}

export function GoogleDriveModal({ isOpen, onClose, report }: GoogleDriveModalProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

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

  const handleOpenDrive = () => {
    if (report.googleDriveUrl) {
      window.open(report.googleDriveUrl, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-surface-card border border-border-subtle rounded-2xl shadow-xl">
        <DialogHeader className="space-y-4 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-heading-s font-display font-semibold text-text-primary">
                View Report
              </DialogTitle>
              <p className="text-body-s font-body text-text-secondary">
                Access your customer insights report
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-body-m font-body font-semibold text-text-primary">
                {report.title}
              </h3>
              <Badge className={`text-mono-label font-mono px-2 py-1 rounded-lg ${getStatusColor(report.status)}`}>
                {report.status}
              </Badge>
            </div>
            
            <p className="text-body-s font-body text-text-secondary">
              {report.subtitle}
            </p>

            <div className="grid grid-cols-2 gap-4 p-4 bg-surface-secondary rounded-xl">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-secondary" />
                  <span className="text-mono-label font-mono text-text-secondary uppercase tracking-wide">
                    Analytics
                  </span>
                </div>
                <p className="text-body-s font-body text-text-primary">
                  {report.productsAnalyzed} products, {report.reviewsAnalyzed} reviews
                </p>
                {report.sentimentScore && (
                  <p className="text-body-s font-body text-text-secondary">
                    {report.sentimentScore.toFixed(1)}/5.0 sentiment
                  </p>
                )}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-secondary" />
                  <span className="text-mono-label font-mono text-text-secondary uppercase tracking-wide">
                    Period
                  </span>
                </div>
                <p className="text-body-s font-body text-text-primary">
                  {formatDate(report.reportStartDate)} - {formatDate(report.reportEndDate)}
                </p>
                <p className="text-body-s font-body text-text-secondary">
                  Generated {formatDate(report.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Google Drive Access */}
          <div className="space-y-4">
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ExternalLink className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="text-body-m font-body font-semibold text-text-primary mb-1">
                    Report Available in Google Drive
                  </h4>
                  <p className="text-body-s font-body text-text-secondary">
                    Your complete customer insights report is ready to view in Google Drive. 
                    Click below to access the full document with detailed analysis and recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={handleOpenDrive}
                disabled={!report.googleDriveUrl}
                className="flex-1 bg-accent hover:bg-accent/90 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in Google Drive
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onClose}
                className="px-6 font-medium rounded-xl border-border-subtle hover:bg-surface-secondary"
              >
                Close
              </Button>
            </div>

            {!report.googleDriveUrl && (
              <p className="text-body-s font-body text-text-secondary text-center italic">
                Google Drive link not available for this report
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
