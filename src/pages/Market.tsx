import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Star, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  description: string;
  product_type: string;
  price_per_unit: number;
  available_quantity: number;
  unit: string;
  harvest_date: string;
  image_url: string | null;
  farm_profiles: {
    farm_name: string;
    farm_location: string;
    rating: number;
  };
}

const Market = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("harvest_date", { ascending: true });

      if (productsError) throw productsError;

      // Fetch farm profiles separately
      const farmIds = [...new Set(productsData?.map((p) => p.farm_id))];
      const { data: farmsData, error: farmsError } = await supabase
        .from("farm_profiles")
        .select("user_id, farm_name, farm_location, rating")
        .in("user_id", farmIds);

      if (farmsError) throw farmsError;

      // Map farms to products
      const farmMap = new Map(farmsData?.map((f) => [f.user_id, f]));
      const productsWithFarms =
        productsData?.map((p) => ({
          ...p,
          farm_profiles: farmMap.get(p.farm_id) || {
            farm_name: "Unknown Farm",
            farm_location: "Unknown",
            rating: 0,
          },
        })) || [];

      setProducts(productsWithFarms);
    } catch (error: any) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.farm_profiles.farm_name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || p.product_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🍌</span>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Banana Expert
            </h1>
          </div>
          <Button onClick={() => navigate("/auth/login")}>Sign In</Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Banana Marketplace</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Reserve fresh bananas directly from verified farms across Thailand
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search products or farms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Product Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="shoot">Shoots</SelectItem>
              <SelectItem value="fruit">Fruits</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-soft transition-shadow cursor-pointer"
                onClick={() => navigate(`/market/product/${product.id}`)}
              >
                <div className="aspect-video bg-gradient-primary flex items-center justify-center">
                  <span className="text-6xl">🍌</span>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{product.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        {product.farm_profiles.farm_name}
                      </div>
                    </div>
                    {product.farm_profiles.rating > 0 && (
                      <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-sm font-medium text-primary">
                          {product.farm_profiles.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {product.description || "Fresh quality produce"}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        ฿{product.price_per_unit}
                        <span className="text-sm text-muted-foreground">
                          /{product.unit}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.available_quantity} {product.unit} available
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.product_type === "fruit"
                          ? "bg-accent/10 text-accent"
                          : "bg-secondary/10 text-secondary"
                      }`}
                    >
                      {product.product_type}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-3">
                    Harvest: {new Date(product.harvest_date).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Market;
