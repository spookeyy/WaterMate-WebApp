import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import {
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
} from "lucide-react";
import { mockShops, mockOrders, mockShopAnalytics } from "@/lib/mockData";

export default function ShopDashboard() {
  const { user } = useAuthStore();
  const shop = mockShops.find((s) => s.ownerId === user?.id);
  const shopOrders = mockOrders.filter((order) => order.shopId === shop?.id);
  const analytics = shop ? mockShopAnalytics[shop.id] : null;

  const todayOrders = shopOrders.filter((order) => {
    const today = new Date();
    const orderDate = new Date(order.orderDate);
    return orderDate.toDateString() === today.toDateString();
  });

  const pendingOrders = shopOrders.filter((order) =>
    ["pending", "confirmed", "preparing"].includes(order.status),
  );

  const stats = [
    {
      title: "Today's Orders",
      value: todayOrders.length.toString(),
      icon: ShoppingCart,
      description: `${analytics?.dailyOrders || 0} average daily`,
      trend: "up",
    },
    {
      title: "Today's Revenue",
      value: `KES ${todayOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}`,
      icon: DollarSign,
      description: `${analytics?.dailyRevenue || 0} average daily`,
      trend: "up",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.length.toString(),
      icon: Clock,
      description: "Requiring attention",
      trend: "stable",
    },
    {
      title: "Customer Rating",
      value: `${shop?.rating || 0}★`,
      icon: TrendingUp,
      description: `${shop?.totalOrders || 0} total orders`,
      trend: "up",
    },
  ];

  if (!shop) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{shop.name}</h1>
          <Badge
            variant={
              shop.subscription === "premier"
                ? "default"
                : shop.subscription === "basic"
                  ? "secondary"
                  : "outline"
            }
          >
            {shop.subscription}
          </Badge>
        </div>
        <p className="text-gray-600">
          Manage your water delivery business efficiently
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-water-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>Latest orders for your shop</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shopOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {order.clientName}
                      </span>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "default"
                            : order.status === "pending"
                              ? "secondary"
                              : order.status === "cancelled"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {order.litres}L • {order.deliveryLocation.address}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.orderDate.toLocaleDateString()}{" "}
                      {order.orderDate.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">KES {order.totalAmount}</p>
                    <Badge variant="outline" className="text-xs">
                      {order.paymentMethod}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Orders
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Manage your shop efficiently</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="text-sm">New Order</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Users className="h-5 w-5" />
                <span className="text-sm">Customers</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Package className="h-5 w-5" />
                <span className="text-sm">Products</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">Analytics</span>
              </Button>
            </div>

            {/* Performance Summary */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">This Month's Performance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Orders:</span>
                  <span className="font-medium">
                    {analytics?.monthlyOrders || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-medium">
                    KES {analytics?.monthlyRevenue.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Order Size:</span>
                  <span className="font-medium">
                    {analytics?.averageOrderSize || 0}L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Retention:</span>
                  <span className="font-medium">
                    {((analytics?.customerRetentionRate || 0) * 100).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status Overview</CardTitle>
          <CardDescription>
            Track orders by their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                status: "pending",
                label: "Pending",
                icon: Clock,
                color: "orange",
              },
              {
                status: "confirmed",
                label: "Confirmed",
                icon: CheckCircle,
                color: "blue",
              },
              {
                status: "preparing",
                label: "Preparing",
                icon: Package,
                color: "purple",
              },
              {
                status: "delivered",
                label: "Delivered",
                icon: CheckCircle,
                color: "green",
              },
            ].map(({ status, label, icon: Icon, color }) => {
              const count = shopOrders.filter(
                (order) => order.status === status,
              ).length;
              return (
                <div key={status} className="text-center p-4 border rounded-lg">
                  <Icon
                    className={`h-8 w-8 mx-auto mb-2 ${
                      color === "orange"
                        ? "text-orange-500"
                        : color === "blue"
                          ? "text-blue-500"
                          : color === "purple"
                            ? "text-purple-500"
                            : "text-green-500"
                    }`}
                  />
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-gray-600">{label}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
