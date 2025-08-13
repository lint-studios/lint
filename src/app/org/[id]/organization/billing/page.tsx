"use client";

import { useParams } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card";
import { Button } from "../../../../../../components/ui/button";
import { CreditCard, Package, Zap } from "lucide-react";

export default function BillingPage() {
  const params = useParams();
  const { organization, isLoaded } = useOrganization();

  // Check if user has access to this organization
  if (isLoaded && organization && organization.id !== params.id) {
    // Redirect to dashboard if user doesn't have access to this org
    window.location.href = "/dashboard";
    return null;
  }

  if (!isLoaded) {
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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>
        <p className="text-gray-600 mt-2">
          Manage your organization's billing and subscription
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-gray-500" />
              <CardTitle className="text-lg">Current Plan</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">Free</div>
            <p className="text-gray-600 text-sm">Basic features included</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <CardTitle className="text-lg">Payment Method</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">No payment method on file</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-gray-500" />
              <CardTitle className="text-lg">Usage</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">0%</div>
            <p className="text-gray-600 text-sm">of monthly limit used</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upgrade Your Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Get unlimited reports, advanced analytics, and priority support with our Pro plan.
          </p>
          <Button className="bg-primary hover:bg-primary/90">
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
