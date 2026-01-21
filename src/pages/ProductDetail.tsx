import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, Loader2, MapPin, Star, Calendar, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  product_type: string;
  price_per_unit: number;
  available_quantity: number;
  unit: string;
  harvest_date: string;
  expiry_date: string | null;
  image_url: string | null;
  is_active: boolean | null;
  farm_profiles: {
    id: string;
    farm_name: string;
    farm_location: string;
    rating: number | null;
    verified: boolean | null;
  } | null;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      // First get the product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle();

      if (productError) throw productError;

      if (!productData) {
        toast.error("Product not found");
        navigate("/market");
        return;
      }

      // Then get the farm profile
      const { data: farmData, error: farmError } = await supabase
        .from("farm_profiles")
        .select("id, farm_name, farm_location, rating, verified")
        .eq("id", productData.farm_id)
        .maybeSingle();

      if (farmError) throw farmError;

      const data = {
        ...productData,
        farm_profiles: farmData,
      };

      setProduct(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load product";
      toast.error(message);
      navigate("/market");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/market")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🍌</span>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Product Details
            </h1>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded-xl shadow-lg"
                />
              ) : (
                <div className="w-full aspect-square bg-muted rounded-xl flex items-center justify-center">
                  <span className="text-8xl">🍌</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={product.product_type === "fruit" ? "default" : "secondary"}>
                    {product.product_type}
                  </Badge>
                  {product.available_quantity > 0 ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
              </div>

              <div className="text-4xl font-bold text-primary">
                ฿{product.price_per_unit}
                <span className="text-lg text-muted-foreground font-normal">
                  /{product.unit}
                </span>
              </div>

              {product.description && (
                <p className="text-muted-foreground">{product.description}</p>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span>{product.available_quantity} {product.unit} available</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Harvest: {new Date(product.harvest_date).toLocaleDateString()}</span>
                </div>
                {product.expiry_date && (
                  <div className="flex items-center gap-2 text-sm text-orange-600">
                    <Calendar className="w-4 h-4" />
                    <span>Expires: {new Date(product.expiry_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Farm Info */}
              {product.farm_profiles && (
                <Card className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{product.farm_profiles.farm_name}</h3>
                        {product.farm_profiles.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{product.farm_profiles.farm_location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">
                        {product.farm_profiles.rating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                  </div>
                </Card>
              )}

              <Button
                size="lg"
                className="w-full"
                disabled={product.available_quantity === 0}
                onClick={() => navigate(`/market/reserve/${product.id}`)}
              >
                {product.available_quantity > 0 ? "Reserve Now" : "Out of Stock"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
