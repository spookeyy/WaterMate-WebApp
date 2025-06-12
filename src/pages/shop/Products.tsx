import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/store/authStore";
import { mockShops } from "@/lib/mockData";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  Droplets,
  Settings,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  pricePerLitre: number;
  minimumOrder: number;
  isActive: boolean;
  category: "regular" | "premium" | "purified" | "mineral";
  stock: number;
}

export default function ShopProducts() {
  const { user } = useAuthStore();
  const shop = mockShops.find((s) => s.ownerId === user?.id);

  const [products, setProducts] = useState<Product[]>([
    {
      id: "prod-1",
      name: "Regular Water",
      description: "Standard purified drinking water",
      pricePerLitre: shop?.pricePerLitre || 5,
      minimumOrder: shop?.minimumOrderLitres || 10,
      isActive: true,
      category: "regular",
      stock: 1000,
    },
    {
      id: "prod-2",
      name: "Premium Purified Water",
      description: "High-quality purified water with added minerals",
      pricePerLitre: (shop?.pricePerLitre || 5) + 2,
      minimumOrder: 5,
      isActive: true,
      category: "premium",
      stock: 500,
    },
    {
      id: "prod-3",
      name: "Mineral Water",
      description: "Natural mineral water from underground sources",
      pricePerLitre: (shop?.pricePerLitre || 5) + 5,
      minimumOrder: 5,
      isActive: false,
      category: "mineral",
      stock: 200,
    },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    pricePerLitre: 5,
    minimumOrder: 10,
    isActive: true,
    category: "regular",
    stock: 100,
  });

  const handleAddProduct = () => {
    const product: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
    };
    setProducts([...products, product]);
    setNewProduct({
      name: "",
      description: "",
      pricePerLitre: 5,
      minimumOrder: 10,
      isActive: true,
      category: "regular",
      stock: 100,
    });
    setShowAddDialog(false);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const toggleProductStatus = (productId: string) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, isActive: !p.isActive } : p,
      ),
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      regular: { variant: "secondary" as const, label: "Regular" },
      premium: { variant: "default" as const, label: "Premium" },
      purified: { variant: "outline" as const, label: "Purified" },
      mineral: { variant: "destructive" as const, label: "Mineral" },
    };

    const config = categoryConfig[category as keyof typeof categoryConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const productStats = {
    total: products.length,
    active: products.filter((p) => p.isActive).length,
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    averagePrice:
      products.length > 0
        ? products.reduce((sum, p) => sum + p.pricePerLitre, 0) /
          products.length
        : 0,
  };

  if (!shop) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Shop not found</h3>
          <p className="text-gray-500">Unable to load shop information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="h-8 w-8" />
            Product Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your water products, pricing, and inventory
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-water-600 hover:bg-water-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            title: "Total Products",
            value: productStats.total.toString(),
            description: "All products",
            icon: Package,
            color: "text-blue-600",
          },
          {
            title: "Active Products",
            value: productStats.active.toString(),
            description: "Currently available",
            icon: TrendingUp,
            color: "text-green-600",
          },
          {
            title: "Total Stock",
            value: `${productStats.totalStock}L`,
            description: "Available inventory",
            icon: Droplets,
            color: "text-blue-600",
          },
          {
            title: "Average Price",
            value: `KES ${productStats.averagePrice.toFixed(2)}`,
            description: "Per litre",
            icon: DollarSign,
            color: "text-purple-600",
          },
        ].map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {product.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getCategoryBadge(product.category)}
                  <Badge
                    variant={product.isActive ? "default" : "secondary"}
                    className={
                      product.isActive ? "bg-green-100 text-green-800" : ""
                    }
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-gray-700">Price</label>
                  <p className="text-lg font-bold text-water-600">
                    KES {product.pricePerLitre}/L
                  </p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Min Order</label>
                  <p className="text-lg font-bold">{product.minimumOrder}L</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Stock</label>
                  <p className="text-lg font-bold text-green-600">
                    {product.stock}L
                  </p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <Switch
                      checked={product.isActive}
                      onCheckedChange={() => toggleProductStatus(product.id)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingProduct(product)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new water product for your shop
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                placeholder="e.g., Premium Purified Water"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                placeholder="Brief description of the product"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price per Litre (KES)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.pricePerLitre}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      pricePerLitre: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="minimum">Minimum Order (L)</Label>
                <Input
                  id="minimum"
                  type="number"
                  value={newProduct.minimumOrder}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      minimumOrder: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value: any) =>
                    setNewProduct({ ...newProduct, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="purified">Purified</SelectItem>
                    <SelectItem value="mineral">Mineral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="stock">Initial Stock (L)</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={newProduct.isActive}
                onCheckedChange={(checked) =>
                  setNewProduct({ ...newProduct, isActive: checked })
                }
              />
              <Label htmlFor="active">Active (available for orders)</Label>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddProduct}
                disabled={!newProduct.name || !newProduct.pricePerLitre}
                className="flex-1 bg-water-600 hover:bg-water-700"
              >
                Add Product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog
        open={!!editingProduct}
        onOpenChange={() => setEditingProduct(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information and settings
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Price per Litre (KES)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingProduct.pricePerLitre}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        pricePerLitre: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="edit-minimum">Minimum Order (L)</Label>
                  <Input
                    id="edit-minimum"
                    type="number"
                    value={editingProduct.minimumOrder}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        minimumOrder: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editingProduct.category}
                    onValueChange={(value: any) =>
                      setEditingProduct({ ...editingProduct, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="purified">Purified</SelectItem>
                      <SelectItem value="mineral">Mineral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-stock">Stock (L)</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={editingProduct.isActive}
                  onCheckedChange={(checked) =>
                    setEditingProduct({ ...editingProduct, isActive: checked })
                  }
                />
                <Label htmlFor="edit-active">
                  Active (available for orders)
                </Label>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleUpdateProduct(editingProduct)}
                  className="flex-1 bg-water-600 hover:bg-water-700"
                >
                  Update Product
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
