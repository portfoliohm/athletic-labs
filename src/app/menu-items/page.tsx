"use client";

import { useState } from "react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  section_category: string;
  price_per_person: number;
  price_half_pan: number;
  price_full_pan: number;
  notes?: string;
  calories_per_serving?: number;
  allergens: string[];
  dietary_tags: string[];
}

// All 38 individual menu items with exact pricing as specified
const menuItems: MenuItem[] = [
  // Premium/Signature Items
  {
    id: '1',
    name: 'Adams Signature Sushi Boat',
    description: 'Premium sushi selection crafted by Chef Adam',
    section_category: 'Premium/Signature',
    price_per_person: 38.00,
    price_half_pan: 456.00,
    price_full_pan: 912.00,
    calories_per_serving: 450,
    allergens: ['fish', 'soy'],
    dietary_tags: ['premium', 'signature']
  },
  {
    id: '2',
    name: 'Wagyu Denvers',
    description: 'Premium Wagyu beef Denver steaks',
    section_category: 'Premium/Signature',
    price_per_person: 45.00,
    price_half_pan: 540.00,
    price_full_pan: 1080.00,
    notes: '1 FP',
    calories_per_serving: 680,
    allergens: [],
    dietary_tags: ['premium', 'wagyu']
  },
  {
    id: '3',
    name: 'Lobster Risotto',
    description: 'Creamy lobster risotto with herbs',
    section_category: 'Premium/Signature',
    price_per_person: 42.00,
    price_half_pan: 504.00,
    price_full_pan: 1008.00,
    notes: '1 FP',
    calories_per_serving: 620,
    allergens: ['shellfish', 'dairy'],
    dietary_tags: ['premium']
  },
  {
    id: '4',
    name: 'Miso Glazed Chilean Sea Bass',
    description: 'Pan-seared sea bass with miso glaze',
    section_category: 'Premium/Signature',
    price_per_person: 48.00,
    price_half_pan: 576.00,
    price_full_pan: 1152.00,
    notes: '1 FP',
    calories_per_serving: 580,
    allergens: ['fish', 'soy'],
    dietary_tags: ['premium']
  },
  {
    id: '5',
    name: 'Rosemary Dijon Lamb Chops',
    description: 'Herb-crusted lamb chops with Dijon mustard',
    section_category: 'Premium/Signature',
    price_per_person: 44.00,
    price_half_pan: 528.00,
    price_full_pan: 1056.00,
    notes: '1 FP',
    calories_per_serving: 720,
    allergens: [],
    dietary_tags: ['premium']
  },
  // Base Proteins
  {
    id: '6',
    name: 'Chicken Shawarma',
    description: 'Middle Eastern spiced chicken shawarma',
    section_category: 'Base Proteins',
    price_per_person: 22.00,
    price_half_pan: 264.00,
    price_full_pan: 528.00,
    notes: '1.5 FP',
    calories_per_serving: 485,
    allergens: [],
    dietary_tags: ['halal']
  },
  {
    id: '7',
    name: 'Asian Braised Salmon',
    description: 'Teriyaki glazed salmon with Asian spices',
    section_category: 'Base Proteins',
    price_per_person: 28.00,
    price_half_pan: 336.00,
    price_full_pan: 672.00,
    calories_per_serving: 520,
    allergens: ['fish', 'soy'],
    dietary_tags: ['omega-3']
  },
  {
    id: '8',
    name: 'Pollo a la Plancha',
    description: 'Grilled chicken with Latin spices',
    section_category: 'Base Proteins',
    price_per_person: 24.00,
    price_half_pan: 288.00,
    price_full_pan: 576.00,
    notes: '1.5 FP',
    calories_per_serving: 445,
    allergens: [],
    dietary_tags: ['grilled']
  },
  {
    id: '9',
    name: 'Chimichurri Steak',
    description: 'Grilled steak with chimichurri sauce',
    section_category: 'Base Proteins',
    price_per_person: 32.00,
    price_half_pan: 384.00,
    price_full_pan: 768.00,
    notes: '1.5 FP',
    calories_per_serving: 625,
    allergens: [],
    dietary_tags: ['grilled']
  },
  // Base Starches
  {
    id: '10',
    name: 'Saffron Basmati Rice',
    description: 'Aromatic saffron-infused basmati rice',
    section_category: 'Base Starches',
    price_per_person: 12.00,
    price_half_pan: 144.00,
    price_full_pan: 288.00,
    notes: '2 FP',
    calories_per_serving: 210,
    allergens: [],
    dietary_tags: ['gluten-free']
  },
  {
    id: '11',
    name: 'Jasmine Rice',
    description: 'Fragrant jasmine rice',
    section_category: 'Base Starches',
    price_per_person: 10.00,
    price_half_pan: 120.00,
    price_full_pan: 240.00,
    notes: '2 FP',
    calories_per_serving: 205,
    allergens: [],
    dietary_tags: ['gluten-free', 'vegan']
  },
  {
    id: '12',
    name: 'Fresh Baked Pita',
    description: 'Warm Mediterranean pita bread',
    section_category: 'Base Starches',
    price_per_person: 8.00,
    price_half_pan: 96.00,
    price_full_pan: 192.00,
    notes: '60 pieces',
    calories_per_serving: 165,
    allergens: ['gluten'],
    dietary_tags: ['vegetarian']
  },
  {
    id: '13',
    name: 'Alfredo Sauce',
    description: 'Creamy alfredo pasta sauce',
    section_category: 'Base Starches',
    price_per_person: 14.00,
    price_half_pan: 168.00,
    price_full_pan: 336.00,
    calories_per_serving: 185,
    allergens: ['dairy'],
    dietary_tags: ['vegetarian']
  },
  // Base Sides/Vegetables
  {
    id: '14',
    name: 'Fresh Hummus',
    description: 'Traditional Mediterranean hummus',
    section_category: 'Base Sides',
    price_per_person: 14.00,
    price_half_pan: 168.00,
    price_full_pan: 336.00,
    notes: '1 HP',
    calories_per_serving: 155,
    allergens: ['sesame'],
    dietary_tags: ['vegan', 'protein']
  },
  {
    id: '15',
    name: 'Tahini Roasted Cauliflower',
    description: 'Roasted cauliflower with tahini dressing',
    section_category: 'Base Sides',
    price_per_person: 16.00,
    price_half_pan: 192.00,
    price_full_pan: 384.00,
    notes: '1 FP',
    calories_per_serving: 125,
    allergens: ['sesame'],
    dietary_tags: ['vegan']
  },
  {
    id: '16',
    name: 'Charred Broccolini',
    description: 'Perfectly charred broccolini with garlic',
    section_category: 'Base Sides',
    price_per_person: 14.00,
    price_half_pan: 168.00,
    price_full_pan: 336.00,
    calories_per_serving: 85,
    allergens: [],
    dietary_tags: ['vegan']
  },
  {
    id: '17',
    name: 'Roasted Sweet Plantains',
    description: 'Caramelized sweet plantains',
    section_category: 'Base Sides',
    price_per_person: 18.00,
    price_half_pan: 216.00,
    price_full_pan: 432.00,
    notes: '1 FP',
    calories_per_serving: 158,
    allergens: [],
    dietary_tags: ['vegan']
  },
  // Breakfast Items
  {
    id: '18',
    name: 'Almond na Tigela Acai Bowls',
    description: 'Brazilian-style acai bowls with almonds',
    section_category: 'Breakfast',
    price_per_person: 28.00,
    price_half_pan: 336.00,
    price_full_pan: 672.00,
    calories_per_serving: 320,
    allergens: ['nuts'],
    dietary_tags: ['antioxidant', 'superfood']
  },
  {
    id: '19',
    name: 'Buttermilk Pancakes',
    description: 'Fluffy buttermilk pancakes',
    section_category: 'Breakfast',
    price_per_person: 14.00,
    price_half_pan: 168.00,
    price_full_pan: 336.00,
    calories_per_serving: 285,
    allergens: ['gluten', 'dairy', 'eggs'],
    dietary_tags: ['breakfast-classic']
  },
  {
    id: '20',
    name: 'Cajeta Churros',
    description: 'Mexican churros with cajeta caramel',
    section_category: 'Breakfast',
    price_per_person: 12.00,
    price_half_pan: 144.00,
    price_full_pan: 288.00,
    calories_per_serving: 245,
    allergens: ['gluten', 'dairy'],
    dietary_tags: ['dessert', 'mexican']
  },
  // Additional Base Proteins
  {
    id: '21',
    name: 'Grilled Chicken Breast',
    description: 'Herb-seasoned grilled chicken breast',
    section_category: 'Base Proteins',
    price_per_person: 20.00,
    price_half_pan: 240.00,
    price_full_pan: 480.00,
    notes: '1.5 FP',
    calories_per_serving: 350,
    allergens: [],
    dietary_tags: ['lean', 'protein']
  },
  {
    id: '22',
    name: 'Blackened Fish Tacos',
    description: 'Spiced fish with fresh slaw',
    section_category: 'Base Proteins',
    price_per_person: 26.00,
    price_half_pan: 312.00,
    price_full_pan: 624.00,
    calories_per_serving: 420,
    allergens: ['fish'],
    dietary_tags: ['mexican']
  },
  {
    id: '23',
    name: 'BBQ Pulled Pork',
    description: 'Slow-cooked BBQ pulled pork',
    section_category: 'Base Proteins',
    price_per_person: 24.00,
    price_half_pan: 288.00,
    price_full_pan: 576.00,
    notes: '1.5 FP',
    calories_per_serving: 465,
    allergens: [],
    dietary_tags: ['bbq']
  },
  {
    id: '24',
    name: 'Vegetarian Black Bean Burger',
    description: 'Plant-based protein burger',
    section_category: 'Base Proteins',
    price_per_person: 18.00,
    price_half_pan: 216.00,
    price_full_pan: 432.00,
    calories_per_serving: 285,
    allergens: [],
    dietary_tags: ['vegetarian', 'plant-based']
  },
  // Additional Base Starches
  {
    id: '25',
    name: 'Wild Rice Pilaf',
    description: 'Nutty wild rice with herbs',
    section_category: 'Base Starches',
    price_per_person: 11.00,
    price_half_pan: 132.00,
    price_full_pan: 264.00,
    notes: '2 FP',
    calories_per_serving: 195,
    allergens: [],
    dietary_tags: ['gluten-free', 'whole-grain']
  },
  {
    id: '26',
    name: 'Garlic Mashed Potatoes',
    description: 'Creamy garlic mashed potatoes',
    section_category: 'Base Starches',
    price_per_person: 9.00,
    price_half_pan: 108.00,
    price_full_pan: 216.00,
    notes: '2 FP',
    calories_per_serving: 220,
    allergens: ['dairy'],
    dietary_tags: ['comfort-food']
  },
  {
    id: '27',
    name: 'Quinoa Tabbouleh',
    description: 'Mediterranean quinoa salad',
    section_category: 'Base Starches',
    price_per_person: 13.00,
    price_half_pan: 156.00,
    price_full_pan: 312.00,
    notes: '2 FP',
    calories_per_serving: 185,
    allergens: [],
    dietary_tags: ['gluten-free', 'vegan']
  },
  {
    id: '28',
    name: 'Cilantro Lime Rice',
    description: 'Fresh cilantro and lime jasmine rice',
    section_category: 'Base Starches',
    price_per_person: 11.00,
    price_half_pan: 132.00,
    price_full_pan: 264.00,
    notes: '2 FP',
    calories_per_serving: 200,
    allergens: [],
    dietary_tags: ['vegan', 'fresh']
  },
  {
    id: '29',
    name: 'Coconut Rice',
    description: 'Fragrant coconut jasmine rice',
    section_category: 'Base Starches',
    price_per_person: 12.00,
    price_half_pan: 144.00,
    price_full_pan: 288.00,
    notes: '2 FP',
    calories_per_serving: 235,
    allergens: [],
    dietary_tags: ['tropical', 'vegan']
  },
  {
    id: '30',
    name: 'Mediterranean Orzo',
    description: 'Orzo pasta with Mediterranean herbs',
    section_category: 'Base Starches',
    price_per_person: 13.00,
    price_half_pan: 156.00,
    price_full_pan: 312.00,
    notes: '2 FP',
    calories_per_serving: 210,
    allergens: ['gluten'],
    dietary_tags: ['mediterranean']
  },
  {
    id: '31',
    name: 'Artisan Bread Rolls',
    description: 'Fresh baked artisan bread rolls',
    section_category: 'Base Starches',
    price_per_person: 8.00,
    price_half_pan: 96.00,
    price_full_pan: 192.00,
    notes: '60 pieces',
    calories_per_serving: 155,
    allergens: ['gluten'],
    dietary_tags: ['artisan']
  },
  // Additional Base Sides
  {
    id: '32',
    name: 'Herb Roasted Vegetables',
    description: 'Seasonal roasted vegetables with herbs',
    section_category: 'Base Sides',
    price_per_person: 15.00,
    price_half_pan: 180.00,
    price_full_pan: 360.00,
    notes: '1 FP',
    calories_per_serving: 110,
    allergens: [],
    dietary_tags: ['vegan', 'seasonal']
  },
  {
    id: '33',
    name: 'Caesar Salad',
    description: 'Classic Caesar salad with croutons',
    section_category: 'Base Sides',
    price_per_person: 12.00,
    price_half_pan: 144.00,
    price_full_pan: 288.00,
    calories_per_serving: 185,
    allergens: ['dairy', 'anchovies'],
    dietary_tags: ['classic']
  },
  {
    id: '34',
    name: 'Greek Salad',
    description: 'Traditional Greek salad with feta',
    section_category: 'Base Sides',
    price_per_person: 14.00,
    price_half_pan: 168.00,
    price_full_pan: 336.00,
    calories_per_serving: 165,
    allergens: ['dairy'],
    dietary_tags: ['mediterranean']
  },
  {
    id: '35',
    name: 'Grilled Asparagus',
    description: 'Simply grilled asparagus spears',
    section_category: 'Base Sides',
    price_per_person: 18.00,
    price_half_pan: 216.00,
    price_full_pan: 432.00,
    notes: '1 FP',
    calories_per_serving: 95,
    allergens: [],
    dietary_tags: ['vegan', 'spring']
  },
  {
    id: '36',
    name: 'Sweet Potato Fries',
    description: 'Crispy sweet potato fries',
    section_category: 'Base Sides',
    price_per_person: 14.00,
    price_half_pan: 168.00,
    price_full_pan: 336.00,
    notes: '1 FP',
    calories_per_serving: 180,
    allergens: [],
    dietary_tags: ['vegan']
  },
  {
    id: '37',
    name: 'Grilled Vegetable Medley',
    description: 'Seasonal grilled vegetables',
    section_category: 'Base Sides',
    price_per_person: 15.00,
    price_half_pan: 180.00,
    price_full_pan: 360.00,
    notes: '1 FP',
    calories_per_serving: 105,
    allergens: [],
    dietary_tags: ['vegan', 'grilled']
  },
  // Additional Premium Items
  {
    id: '38',
    name: 'Truffle Mac and Cheese',
    description: 'Gourmet mac and cheese with truffle oil',
    section_category: 'Premium/Signature',
    price_per_person: 28.00,
    price_half_pan: 336.00,
    price_full_pan: 672.00,
    notes: '1 FP',
    calories_per_serving: 485,
    allergens: ['gluten', 'dairy'],
    dietary_tags: ['premium', 'truffle']
  }
];

export default function MenuItemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = [...new Set(menuItems.map(item => item.section_category))];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dietary_tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = 
      categoryFilter === "all" || 
      item.section_category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Individual Menu Items</h1>
          <p className="text-muted-foreground">
            Browse individual items with per-person, half-pan, and full-pan pricing
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 max-w-sm relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="space-y-8">
          {categories.map(category => {
            const categoryItems = filteredItems.filter(item => item.section_category === category);
            
            if (categoryItems.length === 0 && categoryFilter !== "all") return null;
            
            return (
              <div key={category}>
                <h2 className="text-2xl font-bold mb-4 text-primary">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryItems.map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            {item.notes && (
                              <Badge variant="outline" className="mt-2 text-xs">
                                {item.notes}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CardDescription className="text-sm">
                          {item.description}
                        </CardDescription>
                        
                        {/* Pricing Display */}
                        <div className="space-y-2 p-3 bg-muted rounded-lg">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Per Person:</span>
                            <span className="font-bold text-primary">${item.price_per_person}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Half Pan (12 servings):</span>
                            <span className="font-bold">${item.price_half_pan}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Full Pan (24 servings):</span>
                            <span className="font-bold">${item.price_full_pan}</span>
                          </div>
                        </div>

                        {/* Nutrition Info */}
                        {item.calories_per_serving && (
                          <div className="text-xs text-muted-foreground">
                            {item.calories_per_serving} calories per serving
                          </div>
                        )}

                        {/* Allergens */}
                        {item.allergens.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.allergens.map(allergen => (
                              <Badge key={allergen} variant="destructive" className="text-xs">
                                {allergen}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Dietary Tags */}
                        <div className="flex flex-wrap gap-1">
                          {item.dietary_tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            Add Per Person
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Add Half Pan
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No items found matching your criteria
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}