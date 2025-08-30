"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading, isAdmin, isTeamStaff } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-title-large text-primary">Athletic Labs</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user.profile?.first_name} {user.profile?.last_name}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-headline-large mb-2">Dashboard</h2>
          <p className="text-body-large text-muted-foreground">
            {isAdmin ? "Athletic Labs Admin Portal" : "Team Nutrition Management"}
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
              {isTeamStaff && (
                <>
                  <Button asChild className="w-full justify-start">
                    <Link href="/orders/new">Place New Order</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/orders">View Orders</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/menu-templates">Browse Menu Templates</Link>
                  </Button>
                </>
              )}
              {isAdmin && (
                <>
                  <Button asChild className="w-full justify-start">
                    <Link href="/admin/teams">Manage Teams</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/admin/menu-templates">Manage Menu Templates</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/admin/analytics">View Analytics</Link>
                  </Button>
                </>
              )}
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
                <div className="text-sm">
                  <p className="font-medium">No recent activity</p>
                  <p className="text-muted-foreground">
                    Your recent orders and updates will appear here
                  </p>
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
                <p className="font-medium">
                  {user.profile?.role === 'admin' ? 'Athletic Labs Admin' : 'Team Staff'}
                </p>
              </div>
              {user.profile?.team_id && (
                <div>
                  <p className="text-label-large text-muted-foreground">Team</p>
                  <p className="font-medium">Team ID: {user.profile.team_id}</p>
                </div>
              )}
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-title-large">Need Help?</CardTitle>
            <CardDescription>Resources and support for Athletic Labs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/help">Browse Help Articles</Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/support">Contact Support</Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/training">Platform Training</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}