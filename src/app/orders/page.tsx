"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  contact_name: string;
  delivery_date: string;
  delivery_time: string | null;
  delivery_location: string;
  estimated_people_count: number | null;
  total_amount: number;
  created_at: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800", 
  preparing: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

const statusLabels = {
  pending: "Pending Review",
  confirmed: "Confirmed",
  preparing: "Preparing",
  delivered: "Delivered",
  cancelled: "Cancelled"
};

export default function OrdersPage() {
  const { user, loading: authLoading, teamId, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push("/login");
      return;
    }

    fetchOrders();
  }, [user, authLoading, router, teamId, isAdmin]);

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // If not admin, filter by team
      if (!isAdmin && teamId) {
        query = query.eq('team_id', teamId);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
        return;
      }

      setOrders(data || []);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === "all" || order.status === statusFilter
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-title-large text-primary">Orders</h1>
            <p className="text-sm text-muted-foreground">
              {isAdmin ? "All team orders" : "Your team's orders"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/orders/new">New Order</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-headline-large">Order History</h2>
            <p className="text-muted-foreground">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
            </p>
          </div>
          
          <div className="w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {statusFilter === "all" ? "No orders found" : `No ${statusFilter} orders found`}
                </p>
                <Button asChild>
                  <Link href="/orders/new">Place Your First Order</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.order_number}
                      </CardTitle>
                      <CardDescription>
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Contact</h4>
                      <p className="font-medium">{order.contact_name}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Delivery</h4>
                      <p className="font-medium">
                        {new Date(order.delivery_date).toLocaleDateString()}
                        {order.delivery_time && ` at ${order.delivery_time}`}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {order.delivery_location}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Details</h4>
                      <p className="font-bold text-primary text-lg">
                        ${order.total_amount.toFixed(2)}
                      </p>
                      {order.estimated_people_count && (
                        <p className="text-sm text-muted-foreground">
                          {order.estimated_people_count} people
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/orders/${order.id}`}>View Details</Link>
                    </Button>
                    {order.status === 'pending' && (
                      <Button asChild size="sm">
                        <Link href={`/orders/${order.id}/edit`}>Edit Order</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {orders.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Need help with an order? Contact our support team.
            </p>
            <Button variant="outline" asChild>
              <Link href="/support?topic=orders">Contact Support</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}