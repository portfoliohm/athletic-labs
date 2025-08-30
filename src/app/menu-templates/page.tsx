"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { ShoppingCart } from "@/components/ShoppingCart";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

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

export default function MenuTemplatesPage() {
  const { user, loading: authLoading } = useAuth();
  const [templates, setTemplates] = useState<MenuTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState<string>("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push("/login");
      return;
    }

    fetchMenuTemplates();
  }, [user, authLoading, router]);

  const fetchMenuTemplates = async () => {
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
    } catch {
      setError("Failed to load menu templates");
    } finally {
      setLoading(false);
    }
  };

  const cuisineTypes = [...new Set(templates.map(t => t.cuisine_type))];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.cuisine_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCuisine = 
      cuisineFilter === "all" || 
      template.cuisine_type === cuisineFilter;

    return matchesSearch && matchesCuisine;
  });

  if (authLoading || loading) {
    return (
      <AuthenticatedLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading menu templates...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!user) return null;

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Menu Templates</h1>
          <p className="text-muted-foreground">
            Browse our professionally designed meal bundles for your team
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 max-w-sm relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-48">
              <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cuisines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cuisines</SelectItem>
                  {cuisineTypes.map(cuisine => (
                    <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {template.cuisine_type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${template.bundle_price}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      per person
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription>
                  {template.description || "No description available"}
                </CardDescription>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Serves:</span>
                  <span className="font-medium">{template.serves_count} people</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bundle Total:</span>
                  <span className="font-bold text-primary">
                    ${(template.bundle_price * template.serves_count).toFixed(2)}
                  </span>
                </div>

                <div className="pt-4 space-y-2">
                  <Button asChild className="w-full">
                    <Link href={`/menu-templates/${template.id}`}>
                      View Details & Nutrition
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/orders/new?template=${template.id}`}>
                      Order This Template
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
                setCuisineFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {templates.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No menu templates available at this time.
            </p>
            <Button asChild>
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        )}

        {/* Custom Templates Section */}
        <div className="mt-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Custom Nutrition Needs?</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Our team can create custom meal templates tailored to your specific nutritional requirements and team preferences.
              </CardDescription>
              <Button asChild variant="outline">
                <Link href="/support?topic=custom-templates">
                  Request Custom Template
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Shopping Cart */}
      <ShoppingCart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => router.push('/orders/new')}
      />
    </AuthenticatedLayout>
  );
}