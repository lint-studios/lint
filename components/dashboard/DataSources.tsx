import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { 
  Upload, 
  Star, 
  MessageSquare, 
  Headphones, 
  Hash,
  Instagram,
  CheckCircle,
  Circle,
  ExternalLink,
  Settings,
  Trash2,
  Info,
  FileText,
  Plug
} from "lucide-react";
import { toast } from "sonner";

interface Integration {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  iconBg: string;
  actionLabel: string;
  tooltipText: string;
  connected: boolean;
  comingSoon?: boolean;
  type: "api" | "upload";
}

interface ConnectionFormData {
  apiKey: string;
  storeUrl: string;
}

export function DataSources() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [formData, setFormData] = useState<ConnectionFormData>({
    apiKey: "",
    storeUrl: ""
  });
  const [isConnecting, setIsConnecting] = useState(false);

  // MVP integrations (currently available)
  const mvpIntegrations: Integration[] = [
    {
      id: "judgeme",
      title: "Judge.me",
      subtitle: "Sync reviews automatically",
      icon: Star,
      iconBg: "bg-[#FF6B35]",
      actionLabel: "Connect",
      tooltipText: "Enter your Judge.me API key to pull in your latest product reviews automatically.",
      connected: false,
      type: "api"
    },
    {
      id: "reviews-csv",
      title: "Reviews CSV Upload",
      subtitle: "From Amazon, Yotpo, Okendo, Loox…",
      icon: Upload,
      iconBg: "bg-accent",
      actionLabel: "Upload File",
      tooltipText: "Upload a CSV file containing product reviews from any platform.",
      connected: false,
      type: "upload"
    },
    {
      id: "support-csv",
      title: "Support Tickets CSV Upload",
      subtitle: "From Zendesk, Gorgias, Freshdesk…",
      icon: FileText,
      iconBg: "bg-neutral",
      actionLabel: "Upload File",
      tooltipText: "Upload a CSV file with your customer support tickets for analysis.",
      connected: false,
      type: "upload"
    }
  ];

  // Coming soon integrations
  const comingSoonIntegrations: Integration[] = [
    {
      id: "yotpo-okendo-loox",
      title: "Yotpo / Okendo / Loox",
      subtitle: "Direct review platform integrations",
      icon: Star,
      iconBg: "bg-gray-400",
      actionLabel: "Coming Soon",
      tooltipText: "Direct API integrations with major review platforms.",
      connected: false,
      comingSoon: true,
      type: "api"
    },
    {
      id: "zendesk-gorgias",
      title: "Zendesk / Gorgias API",
      subtitle: "Automatic ticket syncing",
      icon: Headphones,
      iconBg: "bg-gray-400",
      actionLabel: "Coming Soon",
      tooltipText: "Automatic syncing of support tickets via API.",
      connected: false,
      comingSoon: true,
      type: "api"
    },
    {
      id: "social-media",
      title: "Instagram / TikTok Comments",
      subtitle: "Analyze customer feedback from social",
      icon: Hash,
      iconBg: "bg-gray-400",
      actionLabel: "Coming Soon",
      tooltipText: "Monitor and analyze customer feedback from social media platforms.",
      connected: false,
      comingSoon: true,
      type: "api"
    }
  ];

  const connectedCount = mvpIntegrations.filter(i => i.connected).length;
  const hasConnections = connectedCount > 0;

  const handleOpenModal = (integration: Integration) => {
    if (integration.comingSoon) return;
    
    if (integration.type === "upload") {
      // Handle file upload
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          toast.success(`${file.name} uploaded successfully! Processing data...`);
          // In real app, this would upload to your backend
        }
      };
      input.click();
      return;
    }

    setSelectedIntegration(integration);
    setIsModalOpen(true);
    setFormData({ apiKey: "", storeUrl: "" });
  };

  const handleCloseModal = () => {
    setSelectedIntegration(null);
    setIsModalOpen(false);
    setFormData({ apiKey: "", storeUrl: "" });
  };

  const handleTestConnection = async () => {
    setIsConnecting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsConnecting(false);
    toast.success("Connection test successful!");
  };

  const handleSaveConnection = async () => {
    if (!selectedIntegration) return;
    
    setIsConnecting(true);
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`${selectedIntegration.title} connected successfully!`);
    setIsConnecting(false);
    handleCloseModal();
  };

  const IntegrationCard = ({ integration, disabled = false }: { integration: Integration; disabled?: boolean }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`bg-surface-card border border-border-subtle rounded-xl p-6 transition-all duration-200 ${
              disabled 
                ? "opacity-60 cursor-not-allowed" 
                : "hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            }`}
            onClick={() => !disabled && handleOpenModal(integration)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${integration.iconBg} flex items-center justify-center`}>
                <integration.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                {integration.comingSoon ? (
                  <Badge variant="outline" className="text-xs text-text-secondary border-border-subtle">
                    Coming Soon
                  </Badge>
                ) : integration.connected ? (
                  <div className="flex items-center gap-1 text-accent text-xs">
                    <CheckCircle className="w-3 h-3" />
                    <span className="font-medium">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-text-secondary text-xs">
                    <Circle className="w-3 h-3" />
                    <span>Not Connected</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-body-m font-medium text-text-primary">
                  {integration.title}
                </h4>
                <p className="text-body-s text-text-secondary">
                  {integration.subtitle}
                </p>
              </div>
              
              <Button
                disabled={disabled}
                className={
                  integration.connected
                    ? "w-full bg-gray-100 text-text-primary hover:bg-gray-200"
                    : disabled
                    ? "w-full bg-gray-100 text-text-secondary cursor-not-allowed"
                    : "w-full bg-primary hover:bg-primary-light text-white"
                }
              >
                {integration.actionLabel}
              </Button>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{integration.tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  if (!hasConnections) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-display text-display-l font-semibold text-text-primary mb-3">
                Connect Your Data Sources
              </h1>
              <p className="text-body-m text-text-secondary max-w-3xl">
                Upload your customer reviews and support tickets to start discovering trends, uncover opportunities, and spot risks.
              </p>
            </div>
            <Button
              variant="outline"
              className="text-primary border-primary hover:bg-primary/5 flex items-center gap-2"
              onClick={() => setIsHowItWorksOpen(true)}
            >
              <ExternalLink className="w-4 h-4" />
              How it works
            </Button>
          </div>
        </div>

        {/* Section 2 - Current Integrations (MVP) */}
        <div className="space-y-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mvpIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </div>

        {/* Section 3 - Divider */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-border-subtle"></div>
            <h3 className="font-display text-heading-s font-semibold text-text-primary">
              Coming Soon
            </h3>
            <div className="flex-1 h-px bg-border-subtle"></div>
          </div>
          <p className="text-body-m text-text-secondary text-center">
            More ways to connect your customer feedback — no manual uploads needed.
          </p>
        </div>

        {/* Section 4 - Coming Soon Integrations */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoonIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} disabled={true} />
            ))}
          </div>
        </div>

        {/* Connection Modal - Only for API integrations */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-display text-heading-s font-semibold text-text-primary">
                Connect {selectedIntegration?.title}
              </DialogTitle>
            </DialogHeader>
            
            {selectedIntegration && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey" className="font-mono text-mono-label uppercase tracking-wide text-text-secondary">
                      API Key
                    </Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Enter your API key"
                      value={formData.apiKey}
                      onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                      className="bg-gray-50 border-border-subtle"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="storeUrl" className="font-mono text-mono-label uppercase tracking-wide text-text-secondary">
                      Store URL
                    </Label>
                    <Input
                      id="storeUrl"
                      placeholder="https://yourstore.com"
                      value={formData.storeUrl}
                      onChange={(e) => setFormData({ ...formData, storeUrl: e.target.value })}
                      className="bg-gray-50 border-border-subtle"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={handleTestConnection}
                      disabled={isConnecting || !formData.apiKey || !formData.storeUrl}
                      variant="outline"
                      className="flex-1"
                    >
                      {isConnecting ? "Testing..." : "Test Connection"}
                    </Button>
                    <Button
                      onClick={handleSaveConnection}
                      disabled={isConnecting || !formData.apiKey || !formData.storeUrl}
                      className="flex-1 bg-primary hover:bg-primary-light text-white"
                    >
                      {isConnecting ? "Connecting..." : "Save & Connect"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* How It Works Modal */}
        <Dialog open={isHowItWorksOpen} onOpenChange={setIsHowItWorksOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-display text-heading-m font-semibold text-text-primary">
                How It Works
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-8">
              {/* Steps */}
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-body-s">1</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display text-heading-s font-semibold text-text-primary">
                      Choose Your Source
                    </h4>
                    <p className="text-body-m text-text-secondary">
                      Connect Judge.me for automatic syncing or upload a CSV of reviews/support tickets.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-body-s">2</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display text-heading-s font-semibold text-text-primary">
                      We Process Your Data
                    </h4>
                    <p className="text-body-m text-text-secondary">
                      Lint cleans, organizes, and prepares your feedback for analysis.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-body-s">3</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display text-heading-s font-semibold text-text-primary">
                      Get Instant Insights
                    </h4>
                    <p className="text-body-m text-text-secondary">
                      Our AI finds patterns, opportunities, and risks — ready for you to act on.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tip */}
              <div className="bg-neutral/10 border border-neutral/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 bg-neutral rounded-full flex items-center justify-center">
                      <Info className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-body-m font-medium text-text-primary mb-1">
                      Tip
                    </p>
                    <p className="text-body-s text-text-secondary">
                      Start with your most active source to see results faster.
                    </p>
                  </div>
                </div>
              </div>

              {/* Learn More Link */}
              <div className="border-t border-border-subtle pt-6">
                <a
                  href="https://hellolint.com/help"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-light text-body-m font-medium transition-colors"
                >
                  Learn more about how Lint analyzes your data
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Connected state (for when they have data sources connected)
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-display-l font-semibold text-text-primary mb-2">
          Connect Your Data Sources
        </h1>
        <p className="text-body-m text-text-secondary">
          {connectedCount} data source{connectedCount !== 1 ? 's' : ''} connected
        </p>
      </div>
      
      {/* This would show the connected integrations management view */}
      <div className="text-center py-20">
        <p className="text-text-secondary">Connected data sources management view - to be implemented</p>
      </div>
    </div>
  );
}
