"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  ShoppingCart, 
  BookmarkPlus, 
  Calendar,
  History,
  Bell,
  Users,
  BarChart3,
  MapPin,
  HelpCircle,
  Settings,
  Menu,
  X,
  LogOut
} from "lucide-react";

const navigationItems = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: Home, roles: ["admin", "team_staff"] },
  { id: "new-order", label: "New Order", href: "/orders/new", icon: ShoppingCart, roles: ["admin", "team_staff"] },
  { id: "templates", label: "Menu Templates", href: "/menu-templates", icon: BookmarkPlus, roles: ["admin", "team_staff"] },
  { id: "menu-items", label: "Individual Items", href: "/menu-items", icon: BookmarkPlus, roles: ["admin", "team_staff"] },
  { id: "calendar", label: "Team Calendar", href: "/calendar", icon: Calendar, roles: ["admin", "team_staff"] },
  { id: "orders", label: "Order History", href: "/orders", icon: History, roles: ["admin", "team_staff"] },
  { id: "notifications", label: "Notifications", href: "/notifications", icon: Bell, roles: ["admin", "team_staff"] },
  { id: "teams", label: "Team Management", href: "/admin/teams", icon: Users, roles: ["admin"] },
  { id: "analytics", label: "Reports & Analytics", href: "/admin/analytics", icon: BarChart3, roles: ["admin"] },
  { id: "delivery", label: "Delivery Tracking", href: "/delivery", icon: MapPin, roles: ["admin", "team_staff"] },
  { id: "support", label: "Help & Support", href: "/support", icon: HelpCircle, roles: ["admin", "team_staff"] },
  { id: "admin-templates", label: "Manage Templates", href: "/admin/menu-templates", icon: Settings, roles: ["admin"] },
];

export function AppNavigation() {
  const { user, isAdmin, isTeamStaff } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const filteredItems = navigationItems.filter(item => {
    if (isAdmin) return item.roles.includes("admin");
    if (isTeamStaff) return item.roles.includes("team_staff");
    return false;
  });

  const NavItem = ({ item, mobile = false }: { item: typeof navigationItems[0], mobile?: boolean }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        } ${mobile ? "text-base" : "text-sm"}`}
        onClick={() => mobile && setIsMobileMenuOpen(false)}
      >
        <Icon className={mobile ? "h-5 w-5" : "h-4 w-4"} />
        {item.label}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:bg-card">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <h1 className="text-xl font-bold text-primary">Athletic Labs</h1>
          </div>
          
          <nav className="flex-1 px-3 space-y-1">
            {filteredItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </nav>

          <div className="flex-shrink-0 p-3 border-t">
            <div className="mb-3 px-3 py-2">
              <p className="text-xs text-muted-foreground">Welcome back,</p>
              <p className="text-sm font-medium">
                {user?.profile?.first_name} {user?.profile?.last_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.profile?.role === 'admin' ? 'Athletic Labs Admin' : 'Team Staff'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <h1 className="text-lg font-bold text-primary">Athletic Labs</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="fixed top-0 left-0 bottom-0 w-64 bg-card border-r">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h1 className="text-lg font-bold text-primary">Athletic Labs</h1>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                  {filteredItems.map((item) => (
                    <NavItem key={item.id} item={item} mobile />
                  ))}
                </nav>

                <div className="p-4 border-t">
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground">Welcome back,</p>
                    <p className="text-sm font-medium">
                      {user?.profile?.first_name} {user?.profile?.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.profile?.role === 'admin' ? 'Athletic Labs Admin' : 'Team Staff'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}