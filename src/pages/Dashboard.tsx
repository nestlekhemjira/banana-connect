import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User, LogOut } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  status: string;
  total_price: number;
  created_at: string;
  products: {
    name: string;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/auth/login");
      return;
    }

    setUser(session.user);
    fetchOrders(session.user.id);
  };

  const fetchOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          status,
          total_price,
          created_at,
          products (name)
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🍌</span>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Banana Expert
            </h1>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 hover:shadow-soft transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your account
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-soft transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Orders</h3>
                  <p className="text-sm text-muted-foreground">
                    {orders.length} total orders
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Button onClick={() => navigate("/market")}>
                  Browse Marketplace
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          {(order.products as any)?.name || "Product"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">฿{order.total_price}</p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

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

export default Dashboard;
