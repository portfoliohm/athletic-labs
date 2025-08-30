"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart as ShoppingCartIcon, Trash2, Plus, Minus } from "lucide-react";

interface CartItem {
  id: string;
  templateId: string;
  name: string;
  price: number;
  quantity: number;
  servings: number;
  cuisine: string;
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function ShoppingCart({ isOpen, onClose, onCheckout }: ShoppingCartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const taxRate = 0.0875; // 8.75%
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalServings = cartItems.reduce((sum, item) => sum + (item.servings * item.quantity), 0);
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  // Check if order is rush (less than 72 hours)
  const isRushOrder = true; // TODO: Calculate based on delivery date
  const rushSurcharge = isRushOrder ? subtotal * 0.25 : 0;
  const finalTotal = total + rushSurcharge;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:inset-auto lg:right-0 lg:top-0 lg:h-full lg:w-80">
      <div className="fixed inset-0 bg-black/50 lg:hidden" onClick={onClose} />
      
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t lg:relative lg:h-full lg:border-l lg:border-t-0">
        <div className="flex flex-col h-96 lg:h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCartIcon className="h-5 w-5" />
                <h3 className="font-semibold">Cart ({cartItems.length})</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
                ×
              </Button>
            </div>
            {totalServings > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Serves {totalServings} people
              </p>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCartIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">
                  Add menu templates to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.cuisine}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.servings} servings
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="font-medium text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="w-full text-destructive hover:text-destructive"
                >
                  Clear Cart
                </Button>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cartItems.length > 0 && (
            <div className="border-t p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8.75%):</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                {isRushOrder && (
                  <div className="flex justify-between text-orange-600">
                    <span>Rush Order (25%):</span>
                    <span>${rushSurcharge.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={onCheckout}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}