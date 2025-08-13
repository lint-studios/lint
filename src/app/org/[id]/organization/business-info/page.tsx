"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card";
import { Button } from "../../../../../../components/ui/button";
import { Input } from "../../../../../../components/ui/input";
import { Label } from "../../../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select";

import { Building } from "lucide-react";
import { toast } from "sonner";

interface BusinessInfoForm {
  name: string;
  siteUrl: string;
  industry: string;
  platform: string;
  timezone: string;
  logoUrl?: string;
}

export default function BusinessInfoPage() {
  const params = useParams();
  const { organization, isLoaded } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState<BusinessInfoForm>({
    name: "",
    siteUrl: "",
    industry: "",
    platform: "",
    timezone: "",
    logoUrl: "",
  });

  // Check if user has access to this organization and load existing business info
  useEffect(() => {
    if (isLoaded && organization) {
      if (organization.id !== params.id) {
        // Redirect to dashboard if user doesn't have access to this org
        window.location.href = "/dashboard";
        return;
      }

      // Load existing business info from Clerk
      setFormData(prev => ({
        ...prev,
        name: organization.name || "",
        logoUrl: organization.imageUrl || "",
      }));

      // Load existing business info from database
      const loadBusinessInfo = async () => {
        try {
          setLoadingData(true);
          const response = await fetch(`/api/organizations/${params.id}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.organization) {
              setFormData(prev => ({
                ...prev,
                siteUrl: data.organization.siteUrl || "",
                industry: data.organization.industry || "",
                platform: data.organization.platform || "",
                timezone: data.organization.timezone || "",
              }));
            }
          }
        } catch (error) {
          console.error('Error loading business info:', error);
        } finally {
          setLoadingData(false);
        }
      };

      loadBusinessInfo();
    }
  }, [isLoaded, organization, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update organization via API (excluding name and logo which are managed by Clerk)
      const { name, logoUrl, ...updateData } = formData;
      const response = await fetch(`/api/organizations/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update business info');
      }

      toast.success('Business information updated successfully');
    } catch (error) {
      console.error('Error updating business info:', error);
      toast.error('Failed to update business information');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values by reloading from database
    if (organization) {
      const resetForm = async () => {
        try {
          const response = await fetch(`/api/organizations/${params.id}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.organization) {
              setFormData(prev => ({
                ...prev,
                name: organization.name || "",
                siteUrl: data.organization.siteUrl || "",
                industry: data.organization.industry || "",
                platform: data.organization.platform || "",
                timezone: data.organization.timezone || "",
              }));
            }
          }
        } catch (error) {
          console.error('Error resetting form:', error);
          // Fallback to clearing fields if API call fails
          setFormData(prev => ({
            ...prev,
            name: organization.name || "",
            siteUrl: "",
            industry: "",
            platform: "",
            timezone: "",
          }));
        }
      };
      
      resetForm();
    }
  };



  if (!isLoaded || loadingData) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No organization found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Business Info</h1>
          <p className="text-sm text-gray-600">
            Core business details stored in your custom database. These details are shared across all members of your organization.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">LAST UPDATED</p>
          <p className="text-xs text-gray-700">Aug 10, 2024, 10:30 AM</p>
          <p className="text-xs text-gray-700">by Sarah Johnson</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Business Information Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-gray-500" />
                <CardTitle className="text-base">Business Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
                              <div>
                  <Label htmlFor="siteUrl" className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                    Website / Store URL
                  </Label>
                <Input
                  id="siteUrl"
                  type="url"
                  value={formData.siteUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, siteUrl: e.target.value }))}
                  placeholder="https://example.com"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="industry" className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Industry
                </Label>
                <Select value={formData.industry} onValueChange={(value: string) => setFormData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beauty">Beauty</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                              <div>
                  <Label htmlFor="platform" className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                    E-commerce Platform
                  </Label>
                <Select value={formData.platform} onValueChange={(value: string) => setFormData(prev => ({ ...prev, platform: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shopify">Shopify</SelectItem>
                    <SelectItem value="woocommerce">WooCommerce</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                              <div>
                  <Label htmlFor="timezone" className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                    Timezone
                  </Label>
                <Select value={formData.timezone} onValueChange={(value: string) => setFormData(prev => ({ ...prev, timezone: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="px-6 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="px-6 bg-primary hover:bg-primary/90 rounded-xl"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
