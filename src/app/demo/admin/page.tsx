"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getMockUser } from "@/lib/mock-auth";

export default function DemoAdminPage() {
  const [mounted, setMounted] = useState(false);
  const user = getMockUser('admin');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-title-large text-primary">Athletic Labs</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user.profile.first_name} {user.profile.last_name}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/demo/team-staff">View Team Demo</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Exit Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-headline-large mb-2">Admin Dashboard</h2>
          <p className="text-body-large text-muted-foreground">
            Athletic Labs Admin Portal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">$24,587.32</p>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">47</p>
              <p className="text-xs text-muted-foreground">Delivered orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">3</p>
              <p className="text-xs text-muted-foreground">Registered teams</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">$523.13</p>
              <p className="text-xs text-muted-foreground">Per order</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-title-large">Quick Actions</CardTitle>
              <CardDescription>Administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link href="/demo/admin/teams">Manage Teams</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/demo/admin/menu-templates">Manage Templates</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/demo/admin/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Active Teams */}
          <Card>
            <CardHeader>
              <CardTitle className="text-title-large">Active Teams</CardTitle>
              <CardDescription>Recently active teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="font-medium text-sm">Los Angeles Lakers</p>
                    <p className="text-xs text-muted-foreground">NBA • 15 players</p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="font-medium text-sm">New York Yankees</p>
                    <p className="text-xs text-muted-foreground">MLB • 28 players</p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="font-medium text-sm">Dallas Cowboys</p>
                    <p className="text-xs text-muted-foreground">NFL • 53 players</p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-title-large">Top Templates</CardTitle>
              <CardDescription>Most popular this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="font-medium text-sm">Power Performance Bundle</p>
                    <p className="text-xs text-muted-foreground">18 orders</p>
                  </div>
                  <p className="font-bold text-primary text-sm">$8,325</p>
                </div>
                <div className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="font-medium text-sm">Game Day Fuel</p>
                    <p className="text-xs text-muted-foreground">12 orders</p>
                  </div>
                  <p className="font-bold text-primary text-sm">$5,775</p>
                </div>
                <div className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="font-medium text-sm">Recovery Nutrition Pack</p>
                    <p className="text-xs text-muted-foreground">9 orders</p>
                  </div>
                  <p className="font-bold text-primary text-sm">$3,758</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Notice */}
        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-title-large text-primary">Admin Demo Mode</CardTitle>
            <CardDescription>You&apos;re viewing Athletic Labs as an Administrator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm mb-2"><strong>Admin Features:</strong></p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• View all teams and their configurations</li>
                  <li>• Manage menu templates and nutrition profiles</li>
                  <li>• Access comprehensive analytics dashboard</li>
                  <li>• Monitor platform-wide activity</li>
                </ul>
              </div>
              <div>
                <p className="text-sm mb-2"><strong>Explore Admin Tools:</strong></p>
                <div className="space-y-2">
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href="/demo/admin/teams">Team Management</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href="/demo/admin/analytics">Analytics Dashboard</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-title-large">Platform Overview</CardTitle>
            <CardDescription>Athletic Labs system status and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">5</p>
                <p className="text-sm text-muted-foreground">Menu Templates</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">47</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">100%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}