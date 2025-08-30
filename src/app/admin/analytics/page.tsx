"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  activeTeams: number;
  averageOrderValue: number;
  topTemplates: Array<{
    id: string;
    name: string;
    orders: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    order_number: string;
    team_name: string;
    total_amount: number;
    status: string;
    created_at: string;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

export default function AdminAnalyticsPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30");
  const router = useRouter();

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const daysAgo = parseInt(timeRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Fetch revenue and orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*, teams(name)')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (ordersError) {
        setError("Failed to load analytics data");
        return;
      }

      // Fetch template performance
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          template_id,
          total_price,
          orders!inner(created_at, status),
          menu_templates!inner(name)
        `)
        .gte('orders.created_at', startDate.toISOString())
        .eq('orders.status', 'delivered');

      if (itemsError) {
        console.error("Failed to load template stats:", itemsError);
      }

      // Fetch active teams count
      const { count: teamsCount } = await supabase
        .from('teams')
        .select('*', { count: 'exact', head: true });

      // Process data
      const deliveredOrders = orders?.filter(o => o.status === 'delivered') || [];
      const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total_amount, 0);
      const totalOrders = deliveredOrders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Top templates
      interface TemplateStatItem {
        id: string;
        name: string;
        orders: number;
        revenue: number;
      }

      const templateStats = (orderItems || []).reduce((acc, item) => {
        const templateId = item.template_id;
        if (!acc[templateId]) {
          acc[templateId] = {
            id: templateId,
            name: (item as { menu_templates?: { name?: string } }).menu_templates?.name || 'Unknown',
            orders: 0,
            revenue: 0
          };
        }
        acc[templateId].orders += 1;
        acc[templateId].revenue += item.total_price;
        return acc;
      }, {} as Record<string, TemplateStatItem>);

      const topTemplates = Object.values(templateStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Monthly revenue (simplified for last 6 months)
      const monthlyRevenue = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthOrders = deliveredOrders.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate >= monthStart && orderDate <= monthEnd;
        });

        monthlyRevenue.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          revenue: monthOrders.reduce((sum, order) => sum + order.total_amount, 0),
          orders: monthOrders.length
        });
      }

      setAnalytics({
        totalRevenue,
        totalOrders,
        activeTeams: teamsCount || 0,
        averageOrderValue,
        topTemplates,
        recentOrders: orders?.slice(0, 10).map(order => ({
          id: order.id,
          order_number: order.order_number,
          team_name: order.teams?.name || 'Unknown Team',
          total_amount: order.total_amount,
          status: order.status,
          created_at: order.created_at
        })) || [],
        monthlyRevenue
      });

    } catch {
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push("/login");
      return;
    }

    if (!isAdmin) {
      router.push("/dashboard");
      return;
    }

    fetchAnalytics();
  }, [user, authLoading, router, isAdmin, timeRange, fetchAnalytics]);

  if (authLoading || loading) {
    return (
      <AuthenticatedLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!user || !isAdmin || !analytics) return null;

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Platform performance and insights
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                ${analytics.totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                Last {timeRange} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {analytics.totalOrders}
              </p>
              <p className="text-xs text-muted-foreground">
                Delivered orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {analytics.activeTeams}
              </p>
              <p className="text-xs text-muted-foreground">
                Registered teams
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                ${analytics.averageOrderValue.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                Per order
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Menu Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Templates</CardTitle>
              <CardDescription>
                Most popular menu templates by revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topTemplates.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No order data available for this period
                  </p>
                ) : (
                  analytics.topTemplates.map((template, index) => (
                    <div key={template.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {template.orders} orders
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-primary">
                        ${template.revenue.toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest order activity across all teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.recentOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No recent orders
                  </p>
                ) : (
                  analytics.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">#{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.team_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          ${order.total_amount.toFixed(2)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Revenue Chart */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              Monthly revenue and order volume over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.monthlyRevenue.map((month) => (
                <div key={month.month} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{month.month}</p>
                    <p className="text-sm text-muted-foreground">
                      {month.orders} orders
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      ${month.revenue.toFixed(2)}
                    </p>
                    <div className="w-24 bg-muted rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min((month.revenue / Math.max(...analytics.monthlyRevenue.map(m => m.revenue))) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/admin/teams">Manage Teams</Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/admin/menu-templates">Manage Templates</Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/orders">View All Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}