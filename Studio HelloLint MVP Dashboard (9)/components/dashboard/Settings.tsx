import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Upload, Check, X, Eye, EyeOff, ExternalLink, FileText, Database } from "lucide-react";

// Component: TokenInput
function TokenInput({ label, placeholder, value, onChange, showValue, onToggleShow, status }: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  showValue: boolean;
  onToggleShow: () => void;
  status?: "success" | "error" | null;
}) {
  return (
    <div className="space-y-2">
      <Label className="font-mono text-mono-label text-text-secondary uppercase tracking-wide">
        {label}
      </Label>
      <div className="relative">
        <Input
          type={showValue ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-12 font-body text-body-m rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary pr-20"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {status && (
            <div className={`w-2 h-2 rounded-full ${status === 'success' ? 'bg-accent' : 'bg-warning'}`}></div>
          )}
          <button
            type="button"
            onClick={onToggleShow}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// Component: UploadZone
function UploadZone() {
  const [files, setFiles] = useState([
    { name: "customer_reviews_nov.csv", size: "2.4 MB", status: "Complete" },
    { name: "support_tickets_q4.json", size: "847 KB", status: "Processing" }
  ]);

  return (
    <Card className="p-6 bg-surface-card border border-border-subtle rounded-2xl">
      {/* Drop Zone */}
      <div className="border-2 border-dashed border-border-subtle rounded-xl p-8 text-center mb-6 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
        <Upload className="h-8 w-8 text-text-secondary mx-auto mb-4" />
        <h3 className="text-body-m font-body font-medium text-text-primary mb-2">
          Drop files here or click to browse
        </h3>
        <p className="text-body-s font-body text-text-secondary mb-4">
          Supports CSV, JSON, Excel files up to 50MB
        </p>
        <Button variant="outline" className="font-medium rounded-xl">
          Select Files
        </Button>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-mono-label font-mono text-text-secondary uppercase tracking-wide">
            Uploaded Files
          </h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-text-secondary" />
                <div>
                  <p className="text-body-s font-body font-medium text-text-primary">
                    {file.name}
                  </p>
                  <p className="text-mono-label font-mono text-text-secondary">
                    {file.size}
                  </p>
                </div>
              </div>
              <Badge 
                variant={file.status === "Complete" ? "default" : "secondary"}
                className={`text-mono-label font-mono ${
                  file.status === "Complete" ? "bg-accent text-white" : "bg-secondary text-white"
                }`}
              >
                {file.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// Component: HelpSidebar
function HelpSidebar() {
  const steps = [
    {
      title: "Connect your data sources",
      description: "Add API tokens for Judge.me, Zendesk, or other platforms"
    },
    {
      title: "Upload historical data",
      description: "Import past reviews and tickets for complete analysis"
    },
    {
      title: "Generate your first report",
      description: "Get insights within minutes of connecting your data"
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 rounded-2xl">
      <h3 className="text-heading-s font-display font-semibold text-text-primary mb-4">
        How it works
      </h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex space-x-3">
            <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-body-s font-medium flex-shrink-0 mt-0.5">
              {index + 1}
            </div>
            <div>
              <h4 className="text-body-s font-body font-medium text-text-primary mb-1">
                {step.title}
              </h4>
              <p className="text-mono-label font-mono text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function Settings() {
  const [judgeToken, setJudgeToken] = useState("");
  const [showJudgeToken, setShowJudgeToken] = useState(false);
  const [judgeStatus, setJudgeStatus] = useState<"success" | "error" | null>(null);

  const handleTestConnection = () => {
    // Simulate API test
    setJudgeStatus("success");
    setTimeout(() => setJudgeStatus(null), 3000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-display-l font-display font-semibold text-text-primary mb-2">
              Settings / Data
            </h1>
            <p className="text-body-m font-body text-text-secondary">
              Connect your data sources and manage integrations
            </p>
          </div>

          {/* Integrations Section */}
          <Card className="p-8 bg-surface-card border border-border-subtle rounded-2xl shadow-sm">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-heading-m font-display font-semibold text-text-primary mb-2">
                  Data Integrations
                </h2>
                <p className="text-body-s font-body text-text-secondary">
                  Connect your review platforms and support systems
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Judge.me Integration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-body-s">J</span>
                    </div>
                    <div>
                      <h3 className="text-body-m font-body font-medium text-text-primary">
                        Judge.me Reviews
                      </h3>
                      <p className="text-body-s font-body text-text-secondary">
                        Import product reviews and ratings
                      </p>
                    </div>
                  </div>
                  {judgeStatus && (
                    <Badge 
                      variant={judgeStatus === "success" ? "default" : "destructive"}
                      className={`text-mono-label font-mono ${
                        judgeStatus === "success" ? "bg-accent text-white" : "bg-warning text-white"
                      }`}
                    >
                      {judgeStatus === "success" ? "Connected" : "Failed"}
                    </Badge>
                  )}
                </div>

                <TokenInput
                  label="API Token"
                  placeholder="Enter your Judge.me API token"
                  value={judgeToken}
                  onChange={setJudgeToken}
                  showValue={showJudgeToken}
                  onToggleShow={() => setShowJudgeToken(!showJudgeToken)}
                  status={judgeStatus}
                />

                <Button 
                  onClick={handleTestConnection}
                  variant="outline" 
                  disabled={!judgeToken}
                  className="font-medium rounded-xl"
                >
                  {judgeStatus === "success" ? <Check className="mr-2 h-4 w-4" /> : <Database className="mr-2 h-4 w-4" />}
                  Test connection
                </Button>
              </div>

              <hr className="border-border-subtle" />

              {/* Other Integrations */}
              <div className="space-y-4">
                <h3 className="text-body-m font-body font-medium text-text-primary">
                  Available Integrations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Zendesk", icon: "Z", color: "bg-green-100 text-green-600" },
                    { name: "Shopify Reviews", icon: "S", color: "bg-purple-100 text-purple-600" },
                    { name: "Trustpilot", icon: "T", color: "bg-blue-100 text-blue-600" },
                    { name: "Google Reviews", icon: "G", color: "bg-red-100 text-red-600" }
                  ].map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between p-4 border border-border-subtle rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${integration.color}`}>
                          <span className="font-semibold text-body-s">{integration.icon}</span>
                        </div>
                        <span className="text-body-s font-body font-medium text-text-primary">
                          {integration.name}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" disabled className="font-medium rounded-lg opacity-40">
                        Coming Soon
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* File Upload Section */}
          <Card className="p-8 bg-surface-card border border-border-subtle rounded-2xl shadow-sm">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Upload className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h2 className="text-heading-m font-display font-semibold text-text-primary mb-2">
                  Support Data Upload
                </h2>
                <p className="text-body-s font-body text-text-secondary">
                  Upload CSV or JSON files with customer feedback data
                </p>
              </div>
            </div>

            <UploadZone />
          </Card>

          {/* Environment Configuration */}

        </div>

        {/* Help Sidebar */}
        <div className="lg:col-span-1">
          <HelpSidebar />
        </div>
      </div>
    </div>
  );
}