"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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


export default function MenuTemplatesPage() {
  const { user, loading: authLoading } = useAuth();
  const [templates, setTemplates] = useState<MenuTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-title-large text-primary">Menu Templates</h1>
            <p className="text-sm text-muted-foreground">
              Browse available meal bundles for your team
            </p>
          </div>
          <div className="flex gap-2">
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

        <div className="mb-6">
          <h2 className="text-headline-large mb-2">Available Menu Templates</h2>
          <p className="text-body-large text-muted-foreground">
            Choose from our professionally designed meal bundles, each serving {templates[0]?.serves_count || 25} people.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-title-large">{template.name}</CardTitle>
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
                <CardDescription className="text-body-large">
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

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-title-large">Custom Nutrition Needs?</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-body-large mb-4">
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
      </main>
    </div>
  );
}