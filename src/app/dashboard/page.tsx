"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Plus,
  Eye,
  BarChart3,
  Users
} from "lucide-react";

interface DashboardStats {
  activeOrders: number;
  monthlySpend: number;
  totalTeams: number;
  recentOrdersCount: number;
}

export default function DashboardPage() {
  const { user, isAdmin, isTeamStaff, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    activeOrders: 0,
    monthlySpend: 0,
    totalTeams: 0,
    recentOrdersCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [user, isAdmin]);

  // Debug: Show auth state before redirecting
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Debug: Show what's happening with auth
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 border rounded-lg">
          <h2 className="text-xl font-bold mb-4">Authentication Debug</h2>
          <p className="mb-2">User: {user ? 'FOUND' : 'NOT FOUND'}</p>
          <p className="mb-2">Auth Loading: {authLoading ? 'YES' : 'NO'}</p>
          <p className="mb-4">This should redirect to login in 3 seconds...</p>
          <a href="/login" className="text-blue-500 underline">Go to Login</a>
        </div>
      </div>
    );
  }

  const fetchDashboardStats = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

      // Fetch active orders
      const { data: activeOrdersData } = await supabase
        .from('orders')
        .select('id')
        .in('status', ['pending', 'confirmed', 'preparing']);

      // Fetch monthly spend
      const { data: monthlySpendData } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', `${currentMonth}-01`)
        .eq('status', 'delivered');

      // Fetch team count (admin only)
      let totalTeams = 0;
      if (isAdmin) {
        const { data: teamsData } = await supabase
          .from('teams')
          .select('id');
        totalTeams = teamsData?.length || 0;
      }

      // Fetch recent orders count
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const { data: recentOrdersData } = await supabase
        .from('orders')
        .select('id')
        .gte('created_at', oneWeekAgo.toISOString());

      setStats({
        activeOrders: activeOrdersData?.length || 0,
        monthlySpend: monthlySpendData?.reduce((sum, order) => sum + order.total_amount, 0) || 0,
        totalTeams,
        recentOrdersCount: recentOrdersData?.length || 0
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Athletic Labs Admin Portal" : "Team Nutrition Management"}
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.activeOrders}</div>
              <p className="text-xs text-muted-foreground">
                Orders in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${loading ? "..." : stats.monthlySpend.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                This month&apos;s total
              </p>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : stats.totalTeams}</div>
                <p className="text-xs text-muted-foreground">
                  Active team accounts
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.recentOrdersCount}</div>
              <p className="text-xs text-muted-foreground">
                Orders this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isTeamStaff && (
                <>
                  <Button asChild className="w-full justify-start">
                    <Link href="/orders/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Place New Order
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/orders">
                      <Eye className="h-4 w-4 mr-2" />
                      View Orders
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/menu-templates">
                      <Eye className="h-4 w-4 mr-2" />
                      Browse Menu Templates
                    </Link>
                  </Button>
                </>
              )}
              {isAdmin && (
                <>
                  <Button asChild className="w-full justify-start">
                    <Link href="/admin/teams">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Teams
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/admin/menu-templates">
                      <Eye className="h-4 w-4 mr-2" />
                      Manage Menu Templates
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/admin/analytics">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
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
              <CardTitle className="text-lg">Account Information</CardTitle>
              <CardDescription>Your profile and team details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <div className="flex items-center gap-2">
                  <Badge variant={user?.profile?.role === 'admin' ? 'default' : 'secondary'}>
                    {user?.profile?.role === 'admin' ? 'Athletic Labs Admin' : 'Team Staff'}
                  </Badge>
                </div>
              </div>
              {user?.profile?.team_id && (
                <div>
                  <p className="text-sm text-muted-foreground">Team</p>
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
            <CardTitle className="text-lg">Need Help?</CardTitle>
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
      </div>
    </AuthenticatedLayout>
  );
}