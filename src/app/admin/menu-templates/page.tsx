"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface MenuTemplate {
  id: string;
  name: string;
  description: string | null;
  cuisine_type: string;
  bundle_price: number;
  serves_count: number;
  is_active: boolean;
  created_at: string;
}

interface TemplateStats {
  template_id: string;
  total_orders: number;
  total_revenue: number;
  last_ordered: string | null;
}

export default function AdminMenuTemplatesPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [templates, setTemplates] = useState<MenuTemplate[]>([]);
  const [templateStats, setTemplateStats] = useState<Record<string, TemplateStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const router = useRouter();

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

    fetchTemplates();
    fetchTemplateStats();
  }, [user, authLoading, router, isAdmin]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_templates')
        .select('*')
        .order('name');

      if (error) {
        setError(error.message);
        return;
      }

      setTemplates(data || []);
    } catch {
      setError("Failed to load menu templates");
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplateStats = async () => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          template_id,
          total_price,
          orders!inner(created_at, status)
        `)
        .eq('orders.status', 'delivered');

      if (error) {
        console.error("Failed to load template stats:", error);
        return;
      }

      const stats = (data || []).reduce((acc, item) => {
        const templateId = item.template_id;
        if (!acc[templateId]) {
          acc[templateId] = {
            template_id: templateId,
            total_orders: 0,
            total_revenue: 0,
            last_ordered: null
          };
        }
        
        acc[templateId].total_orders += 1;
        acc[templateId].total_revenue += item.total_price;
        
        // Skip last_ordered tracking for now to avoid type complexity
        
        return acc;
      }, {} as Record<string, TemplateStats>);

      setTemplateStats(stats);
    } catch (err) {
      console.error("Failed to load template stats:", err);
    }
  };

  const toggleTemplateStatus = async (templateId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('menu_templates')
        .update({ is_active: !currentStatus })
        .eq('id', templateId);

      if (error) {
        setError("Failed to update template status");
        return;
      }

      setTemplates(prev =>
        prev.map(t =>
          t.id === templateId ? { ...t, is_active: !currentStatus } : t
        )
      );
    } catch {
      setError("Failed to update template status");
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.cuisine_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && template.is_active) ||
      (statusFilter === "inactive" && !template.is_active);

    return matchesSearch && matchesStatus;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading menu templates...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-title-large text-primary">Menu Template Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage menu templates and nutritional offerings
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/admin/menu-templates/new">Create New Template</Link>
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

        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-headline-large">All Templates ({templates.length})</h2>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 max-w-sm">
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Templates</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const stats = templateStats[template.id];
            
            return (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{template.cuisine_type}</Badge>
                        <Badge variant={template.is_active ? "default" : "secondary"}>
                          {template.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">${template.bundle_price}</p>
                      <p className="text-xs text-muted-foreground">per person</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>
                    {template.description || "No description available"}
                  </CardDescription>

                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Serves:</span>
                      <span>{template.serves_count} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bundle Total:</span>
                      <span className="font-medium">
                        ${(template.bundle_price * template.serves_count).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {stats && (
                    <div className="space-y-1 text-sm border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Orders:</span>
                        <span className="font-medium">{stats.total_orders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Revenue:</span>
                        <span className="font-medium text-primary">
                          ${stats.total_revenue.toFixed(2)}
                        </span>
                      </div>
                      {stats.last_ordered && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Ordered:</span>
                          <span className="font-medium">
                            {new Date(stats.last_ordered).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/admin/menu-templates/${template.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/admin/menu-templates/${template.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </div>

                  <Button
                    variant={template.is_active ? "destructive" : "default"}
                    size="sm"
                    className="w-full"
                    onClick={() => toggleTemplateStatus(template.id, template.is_active)}
                  >
                    {template.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && templates.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No templates found matching your criteria
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {templates.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No menu templates found. Create your first template to get started.
            </p>
            <Button asChild>
              <Link href="/admin/menu-templates/new">Create New Template</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}