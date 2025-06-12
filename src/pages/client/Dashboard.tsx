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
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { useNotificationStore } from "@/store/notificationStore";
import { mockShops, mockOrders } from "@/lib/mockData";
import { Shop, OrderForm, PaymentMethod } from "@/types";
import {
  Droplets,
  MapPin,
  Star,
  Phone,
  Plus,
  ShoppingCart,
  Clock,
  CheckCircle,
  Navigation,
  Truck,
  CreditCard,
  Smartphone,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const { createOrder, getOrdersByClient, isLoading } = useOrderStore();
  const { getUnreadCount } = useNotificationStore();
  const navigate = useNavigate();

  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    litres: 20,
    deliveryLocation: user?.location || {
      latitude: -1.2921,
      longitude: 36.8219,
      address: "Nairobi, Kenya",
    },
    paymentMethod: "mpesa",
    notes: "",
  });

  const clientOrders = getOrdersByClient(user?.id || "");
  const recentOrders = clientOrders.slice(0, 5);
  const unreadCount = user ? getUnreadCount(user.id) : 0;

  // Calculate distance between user and shop (simplified)
  const calculateDistance = (shop: Shop) => {
    if (!user?.location) return 0;
    const earthRadius = 6371; // km
    const dLat =
      ((shop.location.latitude - user.location.latitude) * Math.PI) / 180;
    const dLon =
      ((shop.location.longitude - user.location.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((user.location.latitude * Math.PI) / 180) *
        Math.cos((shop.location.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
  };

  // Filter shops within operating zone and sort by distance
  const nearbyShops = mockShops
    .filter((shop) => shop.isActive)
    .map((shop) => ({
      ...shop,
      distance: calculateDistance(shop),
    }))
    .filter((shop) => shop.distance <= shop.operatingZone)
    .sort((a, b) => a.distance - b.distance);

  const handlePlaceOrder = async () => {
    if (!selectedShop || !user) return;

    try {
      const orderData = {
        clientId: user.id,
        shopId: selectedShop.id,
        litres: orderForm.litres,
        totalAmount: orderForm.litres * selectedShop.pricePerLitre,
        deliveryLocation: orderForm.deliveryLocation,
        paymentMethod: orderForm.paymentMethod,
        paymentStatus: "pending" as const,
        status: "pending" as const,
        clientPhone: user.phone,
        clientName: user.name,
        shopName: selectedShop.name,
        notes: orderForm.notes,
      };

      await createOrder(orderData);
      setShowOrderDialog(false);
      setSelectedShop(null);

      // Reset form
      setOrderForm({
        litres: 20,
        deliveryLocation: user.location || {
          latitude: -1.2921,
          longitude: 36.8219,
          address: "Nairobi, Kenya",
        },
        paymentMethod: "mpesa",
        notes: "",
      });
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  const getOrderStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        variant: "secondary" as const,
        icon: Clock,
        color: "text-yellow-600",
      },
      confirmed: {
        variant: "outline" as const,
        icon: CheckCircle,
        color: "text-blue-600",
      },
      preparing: {
        variant: "outline" as const,
        icon: Clock,
        color: "text-purple-600",
      },
      out_for_delivery: {
        variant: "outline" as const,
        icon: Truck,
        color: "text-orange-600",
      },
      delivered: {
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-green-600",
      },
      cancelled: {
        variant: "destructive" as const,
        icon: Clock,
        color: "text-red-600",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-50 via-blue-50 to-white">
      {/* Top Navigation Bar */}
      <div className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Droplets className="h-8 w-8 text-water-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">WaterMate</h1>
                <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => navigate("/client/notifications")}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900">
              Find Water Near You
            </h2>
            <p className="text-gray-600 mt-2 text-lg">
              Order fresh water from nearby shops with just a few clicks
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Nearby Shops",
                value: nearbyShops.length.toString(),
                description: "Active water shops near you",
                icon: MapPin,
                color: "text-blue-600",
              },
              {
                title: "Total Orders",
                value: clientOrders.length.toString(),
                description: "Your order history",
                icon: ShoppingCart,
                color: "text-green-600",
              },
              {
                title: "Active Orders",
                value: clientOrders
                  .filter((o) => !["delivered", "cancelled"].includes(o.status))
                  .length.toString(),
                description: "Currently being processed",
                icon: Clock,
                color: "text-orange-600",
              },
            ].map((stat, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm">
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

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Nearby Shops */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Nearby Water Shops
                </CardTitle>
                <CardDescription>
                  Find and order from water shops in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nearbyShops.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">
                        No shops nearby
                      </h3>
                      <p className="text-gray-500">
                        No water shops found in your area. Try expanding your
                        search radius.
                      </p>
                    </div>
                  ) : (
                    nearbyShops.map((shop) => (
                      <Card
                        key={shop.id}
                        className="p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{shop.name}</h3>
                              <Badge variant="outline">
                                {shop.distance.toFixed(1)}km away
                              </Badge>
                            </div>

                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {shop.location.address}
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {shop.phone}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                {shop.rating} • {shop.totalOrders} orders
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mt-3 text-sm">
                              <span className="font-medium">
                                KES {shop.pricePerLitre}/L
                              </span>
                              <span className="text-gray-500">
                                Min: {shop.minimumOrderLitres}L
                              </span>
                            </div>
                          </div>

                          <Button
                            onClick={() => {
                              setSelectedShop(shop);
                              setShowOrderDialog(true);
                            }}
                            className="bg-water-600 hover:bg-water-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Order
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
                <CardDescription>
                  Your latest water delivery orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">
                        No orders yet
                      </h3>
                      <p className="text-gray-500">
                        Place your first water order from nearby shops.
                      </p>
                    </div>
                  ) : (
                    recentOrders.map((order) => (
                      <Card
                        key={order.id}
                        className="p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">
                                {order.shopName}
                              </h3>
                              {getOrderStatusBadge(order.status)}
                            </div>

                            <div className="space-y-1 text-sm text-gray-600">
                              <div>
                                {order.litres}L • KES {order.totalAmount}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(order.orderDate, {
                                  addSuffix: true,
                                })}
                              </div>
                              <div className="flex items-center gap-1">
                                {order.paymentMethod === "mpesa" ? (
                                  <Smartphone className="h-3 w-3" />
                                ) : (
                                  <CreditCard className="h-3 w-3" />
                                )}
                                {order.paymentMethod} • {order.paymentStatus}
                              </div>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const shop = mockShops.find(
                                (s) => s.id === order.shopId,
                              );
                              if (shop) {
                                setSelectedShop(shop);
                                setOrderForm({
                                  ...orderForm,
                                  litres: order.litres,
                                });
                                setShowOrderDialog(true);
                              }
                            }}
                          >
                            Reorder
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Dialog */}
          <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Place Order - {selectedShop?.name}</DialogTitle>
                <DialogDescription>
                  Configure your water delivery order
                </DialogDescription>
              </DialogHeader>

              {selectedShop && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="litres">Quantity (Litres)</Label>
                      <Input
                        id="litres"
                        type="number"
                        min={selectedShop.minimumOrderLitres}
                        value={orderForm.litres}
                        onChange={(e) =>
                          setOrderForm({
                            ...orderForm,
                            litres: parseInt(e.target.value) || 0,
                          })
                        }
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum: {selectedShop.minimumOrderLitres}L
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="payment">Payment Method</Label>
                      <Select
                        value={orderForm.paymentMethod}
                        onValueChange={(value: PaymentMethod) =>
                          setOrderForm({
                            ...orderForm,
                            paymentMethod: value,
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mpesa">MPESA</SelectItem>
                          <SelectItem value="cash_on_delivery">
                            Cash on Delivery
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input
                      id="address"
                      value={orderForm.deliveryLocation.address}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          deliveryLocation: {
                            ...orderForm.deliveryLocation,
                            address: e.target.value,
                          },
                        })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="floor">Floor (Optional)</Label>
                      <Input
                        id="floor"
                        value={orderForm.deliveryLocation.floor || ""}
                        onChange={(e) =>
                          setOrderForm({
                            ...orderForm,
                            deliveryLocation: {
                              ...orderForm.deliveryLocation,
                              floor: e.target.value,
                            },
                          })
                        }
                        className="mt-1"
                        placeholder="e.g., Ground Floor"
                      />
                    </div>

                    <div>
                      <Label htmlFor="door">Door/Apartment (Optional)</Label>
                      <Input
                        id="door"
                        value={orderForm.deliveryLocation.door || ""}
                        onChange={(e) =>
                          setOrderForm({
                            ...orderForm,
                            deliveryLocation: {
                              ...orderForm.deliveryLocation,
                              door: e.target.value,
                            },
                          })
                        }
                        className="mt-1"
                        placeholder="e.g., Apt 4B"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">
                      Special Instructions (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      value={orderForm.notes}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          notes: e.target.value,
                        })
                      }
                      className="mt-1"
                      placeholder="Any special delivery instructions..."
                      rows={3}
                    />
                  </div>

                  {/* Order Summary */}
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">Order Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Shop:</span>
                          <span className="font-medium">
                            {selectedShop.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quantity:</span>
                          <span>{orderForm.litres} Litres</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price per Litre:</span>
                          <span>KES {selectedShop.pricePerLitre}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment:</span>
                          <span>{orderForm.paymentMethod}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-medium">
                          <span>Total Amount:</span>
                          <span>
                            KES {orderForm.litres * selectedShop.pricePerLitre}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowOrderDialog(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={
                        isLoading ||
                        orderForm.litres < selectedShop.minimumOrderLitres
                      }
                      className="flex-1 bg-water-600 hover:bg-water-700"
                    >
                      {isLoading ? "Placing Order..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
