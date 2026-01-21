import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ArrowLeft, Plus, Loader2, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  product_type: string;
  price_per_unit: number;
  available_quantity: number;
  unit: string;
  harvest_date: string;
  is_active: boolean | null;
}

const ManageProducts = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [farmId, setFarmId] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth/login");
        return;
      }

      const { data: farm, error: farmError } = await supabase
        .from("farm_profiles")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (farmError) throw farmError;

      if (!farm) {
        toast.error("No farm profile found");
        navigate("/dashboard");
        return;
      }

      setFarmId(farm.id);

      const { data, error } = await supabase
        .from("products")
        .select("id, name, product_type, price_per_unit, available_quantity, unit, harvest_date, is_active")
        .eq("farm_id", farm.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load products";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (productId: string, currentState: boolean | null) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_active: !currentState })
        .eq("id", productId);

      if (error) throw error;

      setProducts(products.map((p) =>
        p.id === productId ? { ...p, is_active: !currentState } : p
      ));

      toast.success(currentState ? "Product deactivated" : "Product activated");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update product";
      toast.error(message);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from("products")
        .update({ is_active: false })
        .eq("id", productId);

      if (error) throw error;

      setProducts(products.filter((p) => p.id !== productId));
      toast.success("Product deleted");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete product";
      toast.error(message);
    }
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/farm")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🍌</span>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Manage Products
              </h1>
            </div>
          </div>
          <Button onClick={() => navigate("/farm/products/add")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="p-6">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products yet</p>
                <Button onClick={() => navigate("/farm/products/add")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Harvest Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant={product.product_type === "fruit" ? "default" : "secondary"}>
                          {product.product_type}
                        </Badge>
                      </TableCell>
                      <TableCell>฿{product.price_per_unit}/{product.unit}</TableCell>
                      <TableCell>{product.available_quantity}</TableCell>
                      <TableCell>{new Date(product.harvest_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={product.is_active ? "default" : "outline"}>
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/farm/products/edit/${product.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleActive(product.id, product.is_active)}
                          >
                            {product.is_active ? (
                              <ToggleRight className="w-4 h-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
