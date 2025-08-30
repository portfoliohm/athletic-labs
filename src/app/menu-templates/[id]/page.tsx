"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

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

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  calories_per_serving: number | null;
  protein_grams: number | null;
  carbs_grams: number | null;
  fats_grams: number | null;
  allergens: string[];
  dietary_tags: string[];
}

export default function MenuTemplateDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const [template, setTemplate] = useState<MenuTemplate | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push("/login");
      return;
    }

    fetchTemplateDetails();
  }, [user, authLoading, router, templateId]);

  const fetchTemplateDetails = async () => {
    try {
      // Fetch template
      const { data: templateData, error: templateError } = await supabase
        .from('menu_templates')
        .select('*')
        .eq('id', templateId)
        .eq('is_active', true)
        .single();

      if (templateError) {
        setError("Template not found");
        return;
      }

      setTemplate(templateData);

      // Fetch menu items
      const { data: itemsData, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('template_id', templateId)
        .order('name');

      if (itemsError) {
        setError("Failed to load menu items");
        return;
      }

      setMenuItems(itemsData || []);
    } catch {
      setError("Failed to load template details");
    } finally {
      setLoading(false);
    }
  };

  const calculateNutritionTotals = () => {
    if (menuItems.length === 0) return null;

    const totals = menuItems.reduce(
      (acc, item) => {
        acc.calories += item.calories_per_serving || 0;
        acc.protein += item.protein_grams || 0;
        acc.carbs += item.carbs_grams || 0;
        acc.fats += item.fats_grams || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    const count = menuItems.length;
    return {
      calories: Math.round(totals.calories / count),
      protein: Math.round((totals.protein / count) * 10) / 10,
      carbs: Math.round((totals.carbs / count) * 10) / 10,
      fats: Math.round((totals.fats / count) * 10) / 10
    };
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading template details...</p>
        </div>
      </div>
    );
  }

  if (!user || !template) return null;

  const nutritionTotals = calculateNutritionTotals();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-title-large text-primary">{template.name}</h1>
            <p className="text-sm text-muted-foreground">
              Menu Template Details
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/menu-templates">← Back to Templates</Link>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Overview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-title-large">{template.name}</CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {template.cuisine_type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">
                      ${template.bundle_price}
                    </p>
                    <p className="text-sm text-muted-foreground">per person</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <CardDescription className="text-body-large">
                  {template.description || "No description available"}
                </CardDescription>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Serves:</span>
                    <span className="font-medium">{template.serves_count} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bundle Total:</span>
                    <span className="font-bold text-primary">
                      ${(template.bundle_price * template.serves_count).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items Included:</span>
                    <span className="font-medium">{menuItems.length} dishes</span>
                  </div>
                </div>

                {nutritionTotals && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Average Nutrition per Serving</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-2 bg-muted rounded">
                        <p className="font-bold">{nutritionTotals.calories}</p>
                        <p className="text-muted-foreground">Calories</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <p className="font-bold">{nutritionTotals.protein}g</p>
                        <p className="text-muted-foreground">Protein</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <p className="font-bold">{nutritionTotals.carbs}g</p>
                        <p className="text-muted-foreground">Carbs</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <p className="font-bold">{nutritionTotals.fats}g</p>
                        <p className="text-muted-foreground">Fats</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button asChild className="w-full" size="lg">
                  <Link href={`/orders/new?template=${template.id}`}>
                    Order This Template
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-title-large mb-4">Included Menu Items</h3>
                {menuItems.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">
                        No menu items found for this template.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {menuItems.map((item) => (
                      <Card key={item.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              <CardDescription className="mt-1">
                                {item.description || "No description available"}
                              </CardDescription>
                            </div>
                            {item.calories_per_serving && (
                              <Badge variant="outline">
                                {item.calories_per_serving} cal
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {item.protein_grams && (
                              <div className="text-center">
                                <p className="font-bold text-primary">{item.protein_grams}g</p>
                                <p className="text-xs text-muted-foreground">Protein</p>
                              </div>
                            )}
                            {item.carbs_grams && (
                              <div className="text-center">
                                <p className="font-bold text-primary">{item.carbs_grams}g</p>
                                <p className="text-xs text-muted-foreground">Carbs</p>
                              </div>
                            )}
                            {item.fats_grams && (
                              <div className="text-center">
                                <p className="font-bold text-primary">{item.fats_grams}g</p>
                                <p className="text-xs text-muted-foreground">Fats</p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {item.dietary_tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {item.allergens.map((allergen) => (
                              <Badge key={allergen} variant="destructive" className="text-xs">
                                Contains {allergen}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}