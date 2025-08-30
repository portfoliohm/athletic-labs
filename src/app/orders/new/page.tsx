"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface MenuTemplate {
  id: string;
  name: string;
  description: string | null;
  cuisine_type: string;
  bundle_price: number;
  serves_count: number;
}

interface OrderFormData {
  templateId: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryLocation: string;
  deliveryInstructions: string;
  estimatedPeopleCount: number;
  specialInstructions: string;
}

function NewOrderPageContent() {
  const { user, loading: authLoading, teamId } = useAuth();
  const [templates, setTemplates] = useState<MenuTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MenuTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTemplateId = searchParams.get('template');

  const [formData, setFormData] = useState<OrderFormData>({
    templateId: preselectedTemplateId || "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    deliveryDate: "",
    deliveryTime: "",
    deliveryLocation: "",
    deliveryInstructions: "",
    estimatedPeopleCount: 25,
    specialInstructions: ""
  });

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push("/login");
      return;
    }

    if (!teamId) {
      setError("You must be assigned to a team to place orders");
      return;
    }

    fetchTemplates();
  }, [user, authLoading, router, teamId]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        setError(error.message);
        return;
      }

      setTemplates(data || []);

      // Set preselected template if available
      if (preselectedTemplateId && data) {
        const template = data.find(t => t.id === preselectedTemplateId);
        if (template) {
          setSelectedTemplate(template);
          setFormData(prev => ({ ...prev, templateId: template.id }));
        }
      }
    } catch {
      setError("Failed to load menu templates");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template || null);
    setFormData(prev => ({ 
      ...prev, 
      templateId,
      estimatedPeopleCount: template?.serves_count || 25
    }));
  };

  const calculatePricing = () => {
    if (!selectedTemplate || !formData.estimatedPeopleCount) return null;

    const subtotal = selectedTemplate.bundle_price * formData.estimatedPeopleCount;
    const taxRate = 0.0875; // 8.75% default tax rate
    const taxAmount = subtotal * taxRate;
    
    // Check if rush order (less than 72 hours)
    const deliveryDate = new Date(formData.deliveryDate);
    const now = new Date();
    const hoursUntilDelivery = (deliveryDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    const rushSurcharge = hoursUntilDelivery < 72 ? subtotal * 0.25 : 0;
    
    const total = subtotal + taxAmount + rushSurcharge;

    return {
      subtotal,
      taxAmount,
      rushSurcharge,
      total,
      isRushOrder: hoursUntilDelivery < 72
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamId || !selectedTemplate) {
      setError("Missing required information");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const pricing = calculatePricing();
      if (!pricing) {
        setError("Unable to calculate pricing");
        return;
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          team_id: teamId,
          status: 'pending',
          contact_name: formData.contactName,
          contact_phone: formData.contactPhone,
          contact_email: formData.contactEmail,
          delivery_date: formData.deliveryDate,
          delivery_time: formData.deliveryTime || null,
          delivery_location: formData.deliveryLocation,
          delivery_instructions: formData.deliveryInstructions || null,
          estimated_people_count: formData.estimatedPeopleCount,
          subtotal_amount: pricing.subtotal,
          tax_rate: 0.0875,
          tax_amount: pricing.taxAmount,
          rush_surcharge: pricing.rushSurcharge,
          total_amount: pricing.total
        })
        .select()
        .single();

      if (orderError) {
        setError(orderError.message);
        return;
      }

      // Create order item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: orderData.id,
          template_id: selectedTemplate.id,
          quantity: 1,
          unit_price: selectedTemplate.bundle_price,
          total_price: pricing.subtotal,
          special_instructions: formData.specialInstructions || null
        });

      if (itemError) {
        setError(itemError.message);
        return;
      }

      router.push(`/orders/${orderData.id}?success=true`);
    } catch {
      setError("Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order form...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const pricing = calculatePricing();

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">New Order</h1>
            <p className="text-muted-foreground">
              Place a new meal order for your team
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">← Dashboard</Link>
          </Button>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-title-large">Order Details</CardTitle>
                <CardDescription>
                  Complete the form below to place your order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Template Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="template">Menu Template</Label>
                    <Select 
                      value={formData.templateId} 
                      onValueChange={handleTemplateChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a menu template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name} - ${template.bundle_price}/person
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Contact Name</Label>
                        <Input
                          id="contactName"
                          value={formData.contactName}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Phone Number</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email Address</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Delivery Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="deliveryDate">Delivery Date</Label>
                        <Input
                          id="deliveryDate"
                          type="date"
                          value={formData.deliveryDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                          min={new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deliveryTime">Preferred Time (Optional)</Label>
                        <Input
                          id="deliveryTime"
                          type="time"
                          value={formData.deliveryTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deliveryLocation">Delivery Location</Label>
                      <Input
                        id="deliveryLocation"
                        placeholder="Training facility, office address, etc."
                        value={formData.deliveryLocation}
                        onChange={(e) => setFormData(prev => ({ ...prev, deliveryLocation: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estimatedPeopleCount">Estimated People Count</Label>
                      <Input
                        id="estimatedPeopleCount"
                        type="number"
                        min="1"
                        value={formData.estimatedPeopleCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimatedPeopleCount: parseInt(e.target.value) || 0 }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</Label>
                      <Textarea
                        id="deliveryInstructions"
                        placeholder="Special delivery instructions, access codes, contact person, etc."
                        value={formData.deliveryInstructions}
                        onChange={(e) => setFormData(prev => ({ ...prev, deliveryInstructions: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialInstructions">Special Meal Instructions (Optional)</Label>
                      <Textarea
                        id="specialInstructions"
                        placeholder="Dietary restrictions, allergies, special requests, etc."
                        value={formData.specialInstructions}
                        onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={submitting || !selectedTemplate}
                  >
                    {submitting ? "Placing Order..." : "Place Order"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-title-large">Order Summary</CardTitle>
                <CardDescription>Review your order details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTemplate ? (
                  <>
                    <div>
                      <h3 className="font-medium mb-2">{selectedTemplate.name}</h3>
                      <Badge variant="secondary">{selectedTemplate.cuisine_type}</Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        {selectedTemplate.description}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Price per person:</span>
                        <span>${selectedTemplate.bundle_price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>People count:</span>
                        <span>{formData.estimatedPeopleCount}</span>
                      </div>
                    </div>

                    {pricing && (
                      <div className="space-y-2 pt-4 border-t">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>${pricing.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax (8.75%):</span>
                          <span>${pricing.taxAmount.toFixed(2)}</span>
                        </div>
                        {pricing.rushSurcharge > 0 && (
                          <div className="flex justify-between text-sm text-destructive">
                            <span>Rush Surcharge (25%):</span>
                            <span>${pricing.rushSurcharge.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span className="text-primary">${pricing.total.toFixed(2)}</span>
                        </div>
                        {pricing.isRushOrder && (
                          <div className="mt-2 p-2 bg-destructive/10 rounded text-xs text-destructive">
                            ⚠️ Rush order: Less than 72 hours notice
                          </div>
                        )}
                      </div>
                    )}

                    {formData.deliveryDate && (
                      <div className="pt-4 border-t text-sm">
                        <p className="font-medium mb-1">Delivery Details</p>
                        <p>Date: {new Date(formData.deliveryDate).toLocaleDateString()}</p>
                        {formData.deliveryTime && (
                          <p>Time: {formData.deliveryTime}</p>
                        )}
                        {formData.deliveryLocation && (
                          <p>Location: {formData.deliveryLocation}</p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Select a menu template to see order summary
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default function NewOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>}>
      <NewOrderPageContent />
    </Suspense>
  );
}