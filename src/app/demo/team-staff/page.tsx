"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getMockUser } from "@/lib/mock-auth";

export default function DemoTeamStaffPage() {
  const [mounted, setMounted] = useState(false);
  const user = getMockUser('teamStaff');

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
              <Link href="/demo/admin">View Admin Demo</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Exit Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-headline-large mb-2">Team Staff Dashboard</h2>
          <p className="text-body-large text-muted-foreground">
            Team Nutrition Management for Los Angeles Lakers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-title-large">Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link href="/demo/orders/new">Place New Order</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/demo/orders">View Orders</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/demo/menu-templates">Browse Menu Templates</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-title-large">Recent Activity</CardTitle>
              <CardDescription>Latest orders and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">Order #AL202408300001</p>
                  <p className="text-xs text-muted-foreground">Power Performance Bundle - $502.97</p>
                  <p className="text-xs text-muted-foreground">Delivered Sep 2, 2024</p>
                </div>
                <div className="text-sm text-center text-muted-foreground">
                  <Link href="/demo/orders" className="hover:text-primary">
                    View all orders →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-title-large">Account Information</CardTitle>
              <CardDescription>Your profile and team details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-label-large text-muted-foreground">Role</p>
                <p className="font-medium">Team Staff</p>
              </div>
              <div>
                <p className="text-label-large text-muted-foreground">Team</p>
                <p className="font-medium">Los Angeles Lakers</p>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/demo/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Demo Notice */}
        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-title-large text-primary">Demo Mode</CardTitle>
            <CardDescription>You&apos;re viewing Athletic Labs as a Team Staff member</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm mb-2"><strong>Demo Features:</strong></p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Browse menu templates with nutrition details</li>
                  <li>• View order creation workflow</li>
                  <li>• See order management interface</li>
                  <li>• Access team staff features</li>
                </ul>
              </div>
              <div>
                <p className="text-sm mb-2"><strong>Try These Actions:</strong></p>
                <div className="space-y-2">
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href="/demo/menu-templates">Browse Menu Templates</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href="/demo/orders/new">Create Sample Order</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-title-large">Need Help?</CardTitle>
            <CardDescription>Resources and support for Athletic Labs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/demo/help">Browse Help Articles</Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/demo/support">Contact Support</Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/demo/training">Platform Training</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}