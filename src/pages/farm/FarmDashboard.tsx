import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Package, ShoppingCart, Settings, LogOut, Loader2, TrendingUp, Star } from "lucide-react";

interface FarmProfile {
  id: string;
  farm_name: string;
  farm_location: string;
  farm_description: string | null;
  rating: number | null;
  total_reviews: number | null;
  total_sales: number | null;
  verified: boolean | null;
}

interface Stats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
}

const FarmDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [farm, setFarm] = useState<FarmProfile | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    loadFarmData();
  }, []);

  const loadFarmData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth/login");
        return;
      }

      // Get farm profile
      const { data: farmData, error: farmError } = await supabase
        .from("farm_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (farmError) throw farmError;

      if (!farmData) {
        toast.error("No farm profile found");
        navigate("/dashboard");
        return;
      }

      setFarm(farmData);

      // Get product stats
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, is_active")
        .eq("farm_id", farmData.id);

      if (productsError) throw productsError;

      // Get order stats
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("id, status")
        .eq("farm_id", farmData.id);

      if (ordersError) throw ordersError;

      setStats({
        totalProducts: products?.length || 0,
        activeProducts: products?.filter((p) => p.is_active).length || 0,
        totalOrders: orders?.length || 0,
        pendingOrders: orders?.filter((o) => o.status === "pending").length || 0,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load farm data";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🍌</span>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Farm Dashboard
            </h1>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Farm Header */}
          <Card className="p-6 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">{farm?.farm_name}</h2>
                  {farm?.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{farm?.farm_location}</p>
                {farm?.farm_description && (
                  <p className="mt-2 text-sm">{farm.farm_description}</p>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-semibold">{farm?.rating?.toFixed(1) || "0.0"}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {farm?.total_reviews || 0} reviews
                </p>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  <p className="text-xs text-muted-foreground">Total Products</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeProducts}</p>
                  <p className="text-xs text-muted-foreground">Active Products</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">฿{farm?.total_sales?.toLocaleString() || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Sales</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Card
              className="p-6 hover:shadow-soft transition-shadow cursor-pointer"
              onClick={() => navigate("/farm/products")}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Manage Products</h4>
                  <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 hover:shadow-soft transition-shadow cursor-pointer"
              onClick={() => navigate("/farm/orders")}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">View Orders</h4>
                  <p className="text-sm text-muted-foreground">
                    {stats.pendingOrders} pending orders
                  </p>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 hover:shadow-soft transition-shadow cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Settings className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold">Farm Settings</h4>
                  <p className="text-sm text-muted-foreground">Update farm profile</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmDashboard;
