"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  delivery_date: string;
  delivery_time: string | null;
  delivery_location: string;
  delivery_instructions: string | null;
  estimated_people_count: number | null;
  subtotal_amount: number;
  tax_rate: number;
  tax_amount: number;
  rush_surcharge: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: string;
  template_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions: string | null;
  menu_templates: {
    name: string;
    description: string | null;
    cuisine_type: string;
  };
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

function OrderDetailPageContent() {
  const { user, loading: authLoading, teamId, isAdmin } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.id as string;

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push("/login");
      return;
    }

    // Check for success message
    if (searchParams.get('success') === 'true') {
      setSuccessMessage("Order placed successfully! We&apos;ll review and confirm within 24 hours.");
    }

    fetchOrderDetails();
  }, [user, authLoading, router, orderId, searchParams]);

  const fetchOrderDetails = async () => {
    try {
      // Fetch order
      let orderQuery = supabase
        .from('orders')
        .select('*')
        .eq('id', orderId);

      // If not admin, filter by team
      if (!isAdmin && teamId) {
        orderQuery = orderQuery.eq('team_id', teamId);
      }

      const { data: orderData, error: orderError } = await orderQuery.single();

      if (orderError) {
        setError("Order not found or access denied");
        return;
      }

      setOrder(orderData);

      // Fetch order items with template details
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          menu_templates (
            name,
            description,
            cuisine_type
          )
        `)
        .eq('order_id', orderId);

      if (itemsError) {
        setError("Failed to load order items");
        return;
      }

      setOrderItems(itemsData || []);
    } catch {
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const canCancelOrder = () => {
    if (!order) return false;
    
    const deliveryDate = new Date(order.delivery_date);
    const now = new Date();
    const hoursUntilDelivery = (deliveryDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return order.status === 'pending' || (order.status === 'confirmed' && hoursUntilDelivery >= 72);
  };

  const handleCancelOrder = async () => {
    if (!order || !canCancelOrder()) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', order.id);

      if (error) {
        setError("Failed to cancel order");
        return;
      }

      setOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);
      setSuccessMessage("Order cancelled successfully");
    } catch {
      setError("Failed to cancel order");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!user || !order) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-title-large text-primary">Order #{order.order_number}</h1>
            <p className="text-sm text-muted-foreground">
              Order Details and Status
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/orders">← All Orders</Link>
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

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status & Actions */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-title-large">Order Status</CardTitle>
                <Badge className={statusColors[order.status]} variant="secondary">
                  {statusLabels[order.status]}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Order Total</p>
                  <p className="text-2xl font-bold text-primary">
                    ${order.total_amount.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Delivery Date</p>
                  <p className="font-medium">
                    {new Date(order.delivery_date).toLocaleDateString()}
                    {order.delivery_time && ` at ${order.delivery_time}`}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>

                {canCancelOrder() && (
                  <div className="pt-4 border-t">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full"
                      onClick={handleCancelOrder}
                    >
                      Cancel Order
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Orders can be cancelled up to 72 hours before delivery
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-medium">{order.contact_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.contact_phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{order.contact_email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{order.delivery_location}</p>
                </div>
                {order.delivery_instructions && (
                  <div>
                    <p className="text-sm text-muted-foreground">Special Instructions</p>
                    <p className="font-medium">{order.delivery_instructions}</p>
                  </div>
                )}
                {order.estimated_people_count && (
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated People Count</p>
                    <p className="font-medium">{order.estimated_people_count} people</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{item.menu_templates.name}</h4>
                          <Badge variant="outline" className="mt-1">
                            {item.menu_templates.cuisine_type}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${item.total_price.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      
                      {item.menu_templates.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.menu_templates.description}
                        </p>
                      )}
                      
                      {item.special_instructions && (
                        <div className="mt-2 p-2 bg-muted rounded">
                          <p className="text-sm font-medium">Special Instructions:</p>
                          <p className="text-sm">{item.special_instructions}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${order.subtotal_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({(order.tax_rate * 100).toFixed(2)}%):</span>
                    <span>${order.tax_amount.toFixed(2)}</span>
                  </div>
                  {order.rush_surcharge > 0 && (
                    <div className="flex justify-between text-destructive">
                      <span>Rush Surcharge (25%):</span>
                      <span>${order.rush_surcharge.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>
                  Questions about your order or need to make changes?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/support?topic=orders">Contact Support</Link>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Support hours: Monday-Friday 8am-6pm PST
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>}>
      <OrderDetailPageContent />
    </Suspense>
  );
}