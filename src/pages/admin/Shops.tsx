import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { mockShops, mockUsers } from "@/lib/mockData";
import { Shop, SubscriptionPlan } from "@/types";
import {
  Building2,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Star,
  Crown,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminShops() {
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>(mockShops);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState<
    "all" | SubscriptionPlan
  >("all");
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);

  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && shop.isActive) ||
      (statusFilter === "inactive" && !shop.isActive);
    const matchesSubscription =
      subscriptionFilter === "all" || shop.subscription === subscriptionFilter;

    return matchesSearch && matchesStatus && matchesSubscription;
  });

  const toggleShopStatus = (shopId: string) => {
    setShops(
      shops.map((shop) =>
        shop.id === shopId ? { ...shop, isActive: !shop.isActive } : shop,
      ),
    );
  };

  const updateShop = (updatedShop: Shop) => {
    setShops(
      shops.map((shop) => (shop.id === updatedShop.id ? updatedShop : shop)),
    );
    setEditingShop(null);
  };

  const deleteShop = (shopId: string) => {
    setShops(shops.filter((shop) => shop.id !== shopId));
  };

  const getSubscriptionBadge = (plan: SubscriptionPlan) => {
    switch (plan) {
      case "premier":
        return (
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Premier
          </Badge>
        );
      case "basic":
        return <Badge variant="secondary">Basic</Badge>;
      case "trial":
        return <Badge variant="outline">Trial</Badge>;
    }
  };

  const getShopOwner = (ownerId: string) => {
    return mockUsers.find((user) => user.id === ownerId);
  };

  const shopStats = {
    total: shops.length,
    active: shops.filter((s) => s.isActive).length,
    premier: shops.filter((s) => s.subscription === "premier").length,
    trial: shops.filter((s) => s.subscription === "trial").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="h-8 w-8" />
            Shop Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all registered water shops and their subscriptions
          </p>
        </div>
        <Button
          className="bg-water-600 hover:bg-water-700"
          onClick={() => navigate("/admin/shops/add")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Shop
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            title: "Total Shops",
            value: shopStats.total.toString(),
            description: "All registered shops",
            icon: Building2,
            color: "text-blue-600",
          },
          {
            title: "Active Shops",
            value: shopStats.active.toString(),
            description: "Currently operational",
            icon: CheckCircle,
            color: "text-green-600",
          },
          {
            title: "Premier Plans",
            value: shopStats.premier.toString(),
            description: "Premium subscribers",
            icon: Crown,
            color: "text-yellow-600",
          },
          {
            title: "Trial Plans",
            value: shopStats.trial.toString(),
            description: "Free trial users",
            icon: XCircle,
            color: "text-gray-600",
          },
        ].map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter shops by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search shops by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value: any) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={subscriptionFilter}
              onValueChange={(value: any) => setSubscriptionFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Subscription" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premier">Premier</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Shops Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shops ({filteredShops.length})</CardTitle>
          <CardDescription>
            Manage shop details, subscriptions, and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShops.map((shop) => {
                const owner = getShopOwner(shop.ownerId);
                return (
                  <TableRow key={shop.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{shop.name}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Phone className="h-3 w-3" />
                          {shop.phone}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="font-medium">{owner?.name}</div>
                        <div className="text-sm text-gray-500">
                          {owner?.phone}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-start gap-1">
                        <MapPin className="h-3 w-3 mt-0.5 text-gray-400" />
                        <span className="text-sm">{shop.location.address}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {getSubscriptionBadge(shop.subscription)}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={shop.isActive ? "default" : "secondary"}
                        className={
                          shop.isActive ? "bg-green-100 text-green-800" : ""
                        }
                      >
                        {shop.isActive ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm font-medium">
                            {shop.rating}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {shop.totalOrders} orders
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedShop(shop)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{shop.name}</DialogTitle>
                              <DialogDescription>
                                Detailed shop information and settings
                              </DialogDescription>
                            </DialogHeader>
                            {selectedShop && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">
                                      Owner
                                    </label>
                                    <p className="text-sm text-gray-600">
                                      {owner?.name}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      Phone
                                    </label>
                                    <p className="text-sm text-gray-600">
                                      {shop.phone}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      Price per Litre
                                    </label>
                                    <p className="text-sm text-gray-600">
                                      KES {shop.pricePerLitre}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      Minimum Order
                                    </label>
                                    <p className="text-sm text-gray-600">
                                      {shop.minimumOrderLitres}L
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      Operating Zone
                                    </label>
                                    <p className="text-sm text-gray-600">
                                      {shop.operatingZone}km radius
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      Rating
                                    </label>
                                    <p className="text-sm text-gray-600">
                                      {shop.rating}★ ({shop.totalOrders} orders)
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium">
                                    Location
                                  </label>
                                  <p className="text-sm text-gray-600">
                                    {shop.location.address}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {shop.location.latitude},{" "}
                                    {shop.location.longitude}
                                  </p>
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => toggleShopStatus(shop.id)}
                                    variant={
                                      shop.isActive ? "destructive" : "default"
                                    }
                                    size="sm"
                                  >
                                    {shop.isActive ? "Deactivate" : "Activate"}{" "}
                                    Shop
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingShop(shop)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Shop - {shop.name}</DialogTitle>
                              <DialogDescription>
                                Update shop information and settings
                              </DialogDescription>
                            </DialogHeader>
                            {editingShop && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-name">Shop Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={editingShop.name}
                                      onChange={(e) =>
                                        setEditingShop({
                                          ...editingShop,
                                          name: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-phone">Phone</Label>
                                    <Input
                                      id="edit-phone"
                                      value={editingShop.phone}
                                      onChange={(e) =>
                                        setEditingShop({
                                          ...editingShop,
                                          phone: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-price">
                                      Price per Litre
                                    </Label>
                                    <Input
                                      id="edit-price"
                                      type="number"
                                      value={editingShop.pricePerLitre}
                                      onChange={(e) =>
                                        setEditingShop({
                                          ...editingShop,
                                          pricePerLitre:
                                            parseFloat(e.target.value) || 0,
                                        })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-minimum">
                                      Minimum Order
                                    </Label>
                                    <Input
                                      id="edit-minimum"
                                      type="number"
                                      value={editingShop.minimumOrderLitres}
                                      onChange={(e) =>
                                        setEditingShop({
                                          ...editingShop,
                                          minimumOrderLitres:
                                            parseInt(e.target.value) || 0,
                                        })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-zone">
                                      Operating Zone (km)
                                    </Label>
                                    <Input
                                      id="edit-zone"
                                      type="number"
                                      value={editingShop.operatingZone}
                                      onChange={(e) =>
                                        setEditingShop({
                                          ...editingShop,
                                          operatingZone:
                                            parseInt(e.target.value) || 0,
                                        })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-subscription">
                                      Subscription
                                    </Label>
                                    <Select
                                      value={editingShop.subscription}
                                      onValueChange={(
                                        value: SubscriptionPlan,
                                      ) =>
                                        setEditingShop({
                                          ...editingShop,
                                          subscription: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="trial">
                                          Trial
                                        </SelectItem>
                                        <SelectItem value="basic">
                                          Basic
                                        </SelectItem>
                                        <SelectItem value="premier">
                                          Premier
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="edit-address">Address</Label>
                                  <Input
                                    id="edit-address"
                                    value={editingShop.location.address}
                                    onChange={(e) =>
                                      setEditingShop({
                                        ...editingShop,
                                        location: {
                                          ...editingShop.location,
                                          address: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setEditingShop(null)}
                                    className="flex-1"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => updateShop(editingShop)}
                                    className="flex-1 bg-water-600 hover:bg-water-700"
                                  >
                                    Save Changes
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleShopStatus(shop.id)}
                          className={
                            shop.isActive
                              ? "text-red-600 hover:text-red-700"
                              : "text-green-600 hover:text-green-700"
                          }
                        >
                          {shop.isActive ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
