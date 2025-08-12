import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Upload, Check, X, AlertCircle, Users, Trash2 } from "lucide-react";
import { Label } from "./ui/label";
import { toast } from "sonner@2.0.3";

function IntegrationsTab() {
  const [judgeToken, setJudgeToken] = useState("••••••••••••••••");
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Connection successful! Judge.me integration is working.");
    setIsTestingConnection(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-heading-s font-display font-semibold text-text-primary mb-2">
          Review Platforms
        </h3>
        <p className="text-body-s font-body text-text-secondary mb-4">
          Connect your review platforms to analyze customer feedback
        </p>
      </div>
      
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">J</span>
            </div>
            <div>
              <h4 className="text-body-m font-body font-medium text-text-primary">Judge.me</h4>
              <p className="text-body-s font-body text-text-secondary">Product review platform</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-accent text-white">
            <Check className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border-subtle">
          <Label htmlFor="judgeme-token">API Token</Label>
          <div className="flex space-x-2 mt-2">
            <Input
              id="judgeme-token"
              type="password"
              value={judgeToken}
              onChange={(e) => setJudgeToken(e.target.value)}
              className="flex-1"
            />
            <Button 
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTestingConnection}
            >
              {isTestingConnection ? "Testing..." : "Test Connection"}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 opacity-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 font-bold">S</span>
            </div>
            <div>
              <h4 className="text-body-m font-body font-medium text-text-primary">Support Tool</h4>
              <p className="text-body-s font-body text-text-secondary">Customer support tickets</p>
            </div>
          </div>
          <Badge variant="outline">Not Connected</Badge>
        </div>
      </Card>

      <Card className="p-6 opacity-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 font-bold">SM</span>
            </div>
            <div>
              <h4 className="text-body-m font-body font-medium text-text-primary">Social Media</h4>
              <p className="text-body-s font-body text-text-secondary">Twitter, Instagram mentions</p>
            </div>
          </div>
          <Badge variant="outline">Coming Soon</Badge>
        </div>
      </Card>
    </div>
  );
}

function UploadsTab() {
  const [uploads, setUploads] = useState([
    {
      id: "1",
      name: "support_tickets_nov.csv",
      rows: 1247,
      date: "Nov 15, 2024",
      status: "success" as const
    },
    {
      id: "2",
      name: "customer_feedback_oct.csv",
      errors: 23,
      date: "Oct 28, 2024",
      status: "error" as const
    }
  ]);

  const handleFileUpload = () => {
    toast.info("File upload feature will be available in production with backend integration.");
  };

  const handleDeleteUpload = (id: string) => {
    setUploads(uploads.filter(upload => upload.id !== id));
    toast.success("Upload deleted successfully.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-heading-s font-display font-semibold text-text-primary mb-2">
          Data Uploads
        </h3>
        <p className="text-body-s font-body text-text-secondary mb-4">
          Upload CSV files containing customer feedback data
        </p>
      </div>

      <Card className="p-6">
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={handleFileUpload}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-body-m font-body font-medium text-text-primary mb-2">
            Upload Support Data
          </h4>
          <p className="text-body-s font-body text-text-secondary mb-4">
            Drop CSV files here or click to browse
          </p>
          <Button variant="outline">Choose Files</Button>
        </div>
      </Card>

      <div>
        <h4 className="text-body-m font-body font-medium text-text-primary mb-3">Recent Uploads</h4>
        <div className="space-y-3">
          {uploads.map((upload) => (
            <Card key={upload.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    upload.status === "success" ? "bg-accent" : "bg-secondary"
                  }`}>
                    {upload.status === "success" ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-body-s font-body font-medium text-text-primary">
                      {upload.name}
                    </p>
                    <p className="text-mono-label font-mono text-text-secondary">
                      {upload.status === "success" 
                        ? `${upload.rows} rows • ${upload.date}`
                        : `${upload.errors} errors • ${upload.date}`
                      }
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteUpload(upload.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccountTab() {
  const [orgName, setOrgName] = useState("HelloLint Studio");
  const [contactEmail, setContactEmail] = useState("hello@hellolint.com");

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-heading-s font-display font-semibold text-text-primary mb-2">
          Organization Settings
        </h3>
        <p className="text-body-s font-body text-text-secondary mb-4">
          Manage your organization and team members
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="org-name">Organization Name</Label>
            <Input 
              id="org-name" 
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="mt-2" 
            />
          </div>
          
          <div>
            <Label htmlFor="contact-email">Contact Email</Label>
            <Input 
              id="contact-email" 
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-2" 
            />
          </div>
          
          <Button onClick={handleSaveSettings} className="mt-4">
            Save Changes
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-body-m font-body font-medium text-text-primary">Team Members</h4>
            <p className="text-body-s font-body text-text-secondary">Manage who has access to your insights</p>
          </div>
          <Button disabled variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-body-s font-medium">EA</span>
              </div>
              <div>
                <p className="text-body-s font-body font-medium text-text-primary">Easin Arafat</p>
                <p className="text-mono-label font-mono text-text-secondary">Owner</p>
              </div>
            </div>
            <Badge variant="outline">Owner</Badge>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-destructive/20">
        <h4 className="text-body-m font-body font-medium text-destructive mb-2">Danger Zone</h4>
        <p className="text-body-s font-body text-text-secondary mb-4">
          These actions cannot be undone
        </p>
        <Button disabled variant="destructive">Delete Organization</Button>
      </Card>
    </div>
  );
}

export function Settings() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-display-l font-display font-semibold text-text-primary">
          Settings
        </h1>
        <p className="text-body-m font-body text-text-secondary mt-1">
          Manage your data sources, uploads, and account settings
        </p>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="integrations" className="font-body">Integrations</TabsTrigger>
          <TabsTrigger value="uploads" className="font-body">Uploads</TabsTrigger>
          <TabsTrigger value="account" className="font-body">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="integrations">
          <IntegrationsTab />
        </TabsContent>
        
        <TabsContent value="uploads">
          <UploadsTab />
        </TabsContent>
        
        <TabsContent value="account">
          <AccountTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}