import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import {
  mockAdminAnalytics,
  mockShops,
  mockOrders,
  mockUsers,
} from "@/lib/mockData";

export default function AdminDashboard() {
  const analytics = mockAdminAnalytics;
  const recentOrders = mockOrders.slice(0, 5);
  const pendingShops = mockShops.filter(
    (shop) => shop.subscription === "trial",
  );

  const stats = [
    {
      title: "Total Revenue",
      value: `KES ${analytics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "+12.5% from last month",
      trend: "up",
    },
    {
      title: "Active Shops",
      value: analytics.activeShops.toString(),
      icon: Building2,
      description: `${analytics.totalShops} total shops`,
      trend: "up",
    },
    {
      title: "Total Orders",
      value: analytics.totalOrders.toString(),
      icon: ShoppingCart,
      description: "+8.2% from last month",
      trend: "up",
    },
    {
      title: "Total Users",
      value: analytics.totalClients.toString(),
      icon: Users,
      description: "Active customers",
      trend: "stable",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          Monitor your WaterMate platform performance and key metrics
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
              {stat.trend === "up" && (
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">
                    Trending up
                  </span>
                </div>
              )}
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
            <CardDescription>Latest orders across all shops</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
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
                      {order.litres}L from {order.shopName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.orderDate.toLocaleDateString()}
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

        {/* Shop Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Shop Management
            </CardTitle>
            <CardDescription>
              Monitor and manage registered shops
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Subscription Distribution */}
              <div>
                <h4 className="font-medium mb-3">Subscription Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(analytics.subscriptionDistribution).map(
                    ([plan, count]) => (
                      <div
                        key={plan}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              plan === "premier"
                                ? "bg-green-500"
                                : plan === "basic"
                                  ? "bg-blue-500"
                                  : "bg-gray-400"
                            }`}
                          />
                          <span className="text-sm capitalize">{plan}</span>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Pending Approvals */}
              {pendingShops.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    Pending Approvals
                  </h4>
                  <div className="space-y-2">
                    {pendingShops.map((shop) => (
                      <div
                        key={shop.id}
                        className="flex items-center justify-between p-2 bg-orange-50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium">{shop.name}</p>
                          <p className="text-xs text-gray-500">
                            {shop.location.address}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Manage All Shops
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Shops */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performing Shops
          </CardTitle>
          <CardDescription>
            Shops with highest revenue and customer satisfaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {analytics.topPerformingShops.map((shop, index) => (
              <div
                key={shop.shopId}
                className="p-4 border rounded-lg bg-gradient-to-r from-water-50 to-blue-50"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                          ? "bg-gray-400"
                          : "bg-orange-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <h3 className="font-medium">{shop.shopName}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium">
                      KES {shop.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Orders:</span>
                    <span className="font-medium">{shop.orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{shop.rating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
