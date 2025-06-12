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
import { mockShops, mockOrders } from "@/lib/mockData";
import {
  Truck,
  MapPin,
  Navigation,
  Clock,
  Phone,
  User,
  Plus,
  Eye,
  Route,
  Timer,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface DeliveryZone {
  id: string;
  name: string;
  radius: number;
  isActive: boolean;
  deliveryFee: number;
  estimatedTime: string;
}

interface DeliveryRoute {
  id: string;
  name: string;
  orders: string[];
  status: "planned" | "active" | "completed";
  estimatedDuration: string;
  totalDistance: number;
}

export default function ShopDelivery() {
  const { user } = useAuthStore();
  const shop = mockShops.find((s) => s.ownerId === user?.id);
  const shopOrders = mockOrders.filter((order) => order.shopId === shop?.id);

  const deliveryOrders = shopOrders.filter((order) =>
    ["confirmed", "preparing", "out_for_delivery"].includes(order.status),
  );

  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([
    {
      id: "zone-1",
      name: "Central Zone",
      radius: 3,
      isActive: true,
      deliveryFee: 0,
      estimatedTime: "30-45 min",
    },
    {
      id: "zone-2",
      name: "Extended Zone",
      radius: 5,
      isActive: true,
      deliveryFee: 50,
      estimatedTime: "45-60 min",
    },
    {
      id: "zone-3",
      name: "Outer Zone",
      radius: 8,
      isActive: false,
      deliveryFee: 100,
      estimatedTime: "60-90 min",
    },
  ]);

  const [deliveryRoutes, setDeliveryRoutes] = useState<DeliveryRoute[]>([
    {
      id: "route-1",
      name: "Morning Route A",
      orders: ["order-1", "order-3", "order-5"],
      status: "active",
      estimatedDuration: "2 hours",
      totalDistance: 15.5,
    },
    {
      id: "route-2",
      name: "Afternoon Route B",
      orders: ["order-2", "order-4"],
      status: "planned",
      estimatedDuration: "1.5 hours",
      totalDistance: 12.2,
    },
  ]);

  const [showZoneDialog, setShowZoneDialog] = useState(false);
  const [newZone, setNewZone] = useState<Omit<DeliveryZone, "id">>({
    name: "",
    radius: 5,
    isActive: true,
    deliveryFee: 0,
    estimatedTime: "30-45 min",
  });

  const openGoogleMaps = (order: any) => {
    const { latitude, longitude } = order.deliveryLocation;
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  const openRouteInMaps = (orders: string[]) => {
    // This would typically build a multi-stop route
    const orderDetails = shopOrders.filter((o) => orders.includes(o.id));
    if (orderDetails.length > 0) {
      const firstOrder = orderDetails[0];
      openGoogleMaps(firstOrder);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planned: { variant: "secondary" as const, icon: Clock },
      active: { variant: "default" as const, icon: Truck },
      completed: { variant: "outline" as const, icon: CheckCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const addDeliveryZone = () => {
    const zone: DeliveryZone = {
      ...newZone,
      id: `zone-${Date.now()}`,
    };
    setDeliveryZones([...deliveryZones, zone]);
    setNewZone({
      name: "",
      radius: 5,
      isActive: true,
      deliveryFee: 0,
      estimatedTime: "30-45 min",
    });
    setShowZoneDialog(false);
  };

  const toggleZoneStatus = (zoneId: string) => {
    setDeliveryZones((zones) =>
      zones.map((zone) =>
        zone.id === zoneId ? { ...zone, isActive: !zone.isActive } : zone,
      ),
    );
  };

  if (!shop) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Shop not found</h3>
          <p className="text-gray-500">Unable to load shop information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Truck className="h-8 w-8" />
          Delivery Management
        </h1>
        <p className="text-gray-600 mt-2">
          Track deliveries and manage delivery zones efficiently
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            title: "Active Deliveries",
            value: deliveryOrders
              .filter((o) => o.status === "out_for_delivery")
              .length.toString(),
            description: "Currently on the road",
            icon: Truck,
            color: "text-blue-600",
          },
          {
            title: "Pending Orders",
            value: deliveryOrders
              .filter((o) => ["confirmed", "preparing"].includes(o.status))
              .length.toString(),
            description: "Ready for delivery",
            icon: Clock,
            color: "text-orange-600",
          },
          {
            title: "Delivery Zones",
            value: deliveryZones.filter((z) => z.isActive).length.toString(),
            description: "Active zones",
            icon: MapPin,
            color: "text-green-600",
          },
          {
            title: "Avg. Delivery Time",
            value: "35 min",
            description: "Average delivery time",
            icon: Timer,
            color: "text-purple-600",
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Active Deliveries
            </CardTitle>
            <CardDescription>
              Track orders currently being delivered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveryOrders.filter(
                (order) => order.status === "out_for_delivery",
              ).length === 0 ? (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No active deliveries
                  </h3>
                  <p className="text-gray-500">
                    Orders will appear here when they're out for delivery
                  </p>
                </div>
              ) : (
                deliveryOrders
                  .filter((order) => order.status === "out_for_delivery")
                  .map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">
                              {order.clientName}
                            </span>
                            <Badge variant="outline">Out for Delivery</Badge>
                          </div>

                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {order.clientPhone}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {order.deliveryLocation.address}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Started{" "}
                              {formatDistanceToNow(order.orderDate, {
                                addSuffix: true,
                              })}
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {order.litres}L
                            </span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm font-medium">
                              KES {order.totalAmount}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openGoogleMaps(order)}
                          >
                            <Navigation className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Delivery Routes
            </CardTitle>
            <CardDescription>
              Planned and active delivery routes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveryRoutes.map((route) => (
                <Card key={route.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{route.name}</h3>
                        {getStatusBadge(route.status)}
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div>Orders: {route.orders.length}</div>
                        <div>Duration: {route.estimatedDuration}</div>
                        <div>Distance: {route.totalDistance} km</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openRouteInMaps(route.orders)}
                      >
                        <Navigation className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create New Route
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Zones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Zones
            </div>
            <Button
              onClick={() => setShowZoneDialog(true)}
              size="sm"
              className="bg-water-600 hover:bg-water-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Zone
            </Button>
          </CardTitle>
          <CardDescription>
            Configure delivery zones and fees for your shop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {deliveryZones.map((zone) => (
              <Card key={zone.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium">{zone.name}</h3>
                  <Badge variant={zone.isActive ? "default" : "secondary"}>
                    {zone.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Radius:</span>
                    <span className="font-medium">{zone.radius} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-medium">
                      {zone.deliveryFee === 0
                        ? "Free"
                        : `KES ${zone.deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Time:</span>
                    <span className="font-medium">{zone.estimatedTime}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleZoneStatus(zone.id)}
                    className="flex-1"
                  >
                    {zone.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Zone Dialog */}
      <Dialog open={showZoneDialog} onOpenChange={setShowZoneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Delivery Zone</DialogTitle>
            <DialogDescription>
              Create a new delivery zone for your shop
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="zoneName">Zone Name</Label>
              <Input
                id="zoneName"
                value={newZone.name}
                onChange={(e) =>
                  setNewZone({ ...newZone, name: e.target.value })
                }
                placeholder="e.g., Central Zone"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="radius">Radius (km)</Label>
                <Input
                  id="radius"
                  type="number"
                  value={newZone.radius}
                  onChange={(e) =>
                    setNewZone({
                      ...newZone,
                      radius: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="deliveryFee">Delivery Fee (KES)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  value={newZone.deliveryFee}
                  onChange={(e) =>
                    setNewZone({
                      ...newZone,
                      deliveryFee: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="estimatedTime">Estimated Delivery Time</Label>
              <Select
                value={newZone.estimatedTime}
                onValueChange={(value) =>
                  setNewZone({ ...newZone, estimatedTime: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15-30 min">15-30 minutes</SelectItem>
                  <SelectItem value="30-45 min">30-45 minutes</SelectItem>
                  <SelectItem value="45-60 min">45-60 minutes</SelectItem>
                  <SelectItem value="60-90 min">60-90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowZoneDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={addDeliveryZone}
                disabled={!newZone.name || newZone.radius <= 0}
                className="flex-1 bg-water-600 hover:bg-water-700"
              >
                Add Zone
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
