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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/authStore";
import { mockOrders, mockShops, mockUsers } from "@/lib/mockData";
import {
  Users,
  Search,
  Eye,
  Phone,
  MapPin,
  ShoppingCart,
  DollarSign,
  Calendar,
  Star,
  TrendingUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CustomerData {
  id: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date;
  averageOrderSize: number;
  location?: string;
}

export default function ShopCustomers() {
  const { user } = useAuthStore();
  const shop = mockShops.find((s) => s.ownerId === user?.id);
  const shopOrders = mockOrders.filter((order) => order.shopId === shop?.id);

  // Process customer data
  const customersMap = new Map<string, CustomerData>();

  shopOrders.forEach((order) => {
    const existing = customersMap.get(order.clientId);
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent += order.totalAmount;
      if (order.orderDate > existing.lastOrderDate) {
        existing.lastOrderDate = order.orderDate;
      }
    } else {
      customersMap.set(order.clientId, {
        id: order.clientId,
        name: order.clientName,
        phone: order.clientPhone,
        totalOrders: 1,
        totalSpent: order.totalAmount,
        lastOrderDate: order.orderDate,
        averageOrderSize: order.litres,
        location: order.deliveryLocation.address,
      });
    }
  });

  // Calculate average order sizes
  customersMap.forEach((customer) => {
    const customerOrders = shopOrders.filter((o) => o.clientId === customer.id);
    customer.averageOrderSize =
      customerOrders.reduce((sum, o) => sum + o.litres, 0) /
      customerOrders.length;
  });

  const customers = Array.from(customersMap.values()).sort(
    (a, b) => b.totalSpent - a.totalSpent,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(
    null,
  );

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getCustomerOrders = (customerId: string) => {
    return shopOrders
      .filter((order) => order.clientId === customerId)
      .sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
  };

  const customerStats = {
    total: customers.length,
    active: customers.filter(
      (c) => Date.now() - c.lastOrderDate.getTime() < 30 * 24 * 60 * 60 * 1000,
    ).length, // Active in last 30 days
    topSpender: customers.length > 0 ? customers[0] : null,
    averageSpend:
      customers.length > 0
        ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length
        : 0,
  };

  if (!shop) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
          <Users className="h-8 w-8" />
          Customer Management
        </h1>
        <p className="text-gray-600 mt-2">
          Track and manage your customer relationships
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            title: "Total Customers",
            value: customerStats.total.toString(),
            description: "All registered customers",
            icon: Users,
            color: "text-blue-600",
          },
          {
            title: "Active Customers",
            value: customerStats.active.toString(),
            description: "Ordered in last 30 days",
            icon: TrendingUp,
            color: "text-green-600",
          },
          {
            title: "Average Spend",
            value: `KES ${customerStats.averageSpend.toFixed(0)}`,
            description: "Per customer lifetime",
            icon: DollarSign,
            color: "text-purple-600",
          },
          {
            title: "Top Customer",
            value: customerStats.topSpender
              ? `KES ${customerStats.topSpender.totalSpent}`
              : "N/A",
            description: customerStats.topSpender?.name || "No customers yet",
            icon: Star,
            color: "text-yellow-600",
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

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Search</CardTitle>
          <CardDescription>
            Find customers by name or phone number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
          <CardDescription>
            Your customer base and their activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No customers found" : "No customers yet"}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Your customers will appear here once they place orders."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Avg. Order</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="font-medium">{customer.name}</div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                        {customer.location && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {customer.location}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ShoppingCart className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">
                          {customer.totalOrders}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">
                        KES {customer.totalSpent.toLocaleString()}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>{customer.averageOrderSize.toFixed(1)}L</div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(customer.lastOrderDate, {
                          addSuffix: true,
                        })}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>
                              Customer Details - {customer.name}
                            </DialogTitle>
                            <DialogDescription>
                              View customer information and order history
                            </DialogDescription>
                          </DialogHeader>
                          {selectedCustomer && (
                            <div className="space-y-6">
                              {/* Customer Info */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                      {selectedCustomer.totalOrders}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Total Orders
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                      KES {selectedCustomer.totalSpent}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Total Spent
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                      {selectedCustomer.averageOrderSize.toFixed(
                                        1,
                                      )}
                                      L
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Avg. Order
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                      {Math.round(
                                        (Date.now() -
                                          selectedCustomer.lastOrderDate.getTime()) /
                                          (1000 * 60 * 60 * 24),
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Days Since Last Order
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Order History */}
                              <Card>
                                <CardHeader>
                                  <CardTitle>Order History</CardTitle>
                                  <CardDescription>
                                    Recent orders from this customer
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {getCustomerOrders(selectedCustomer.id).map(
                                      (order) => (
                                        <div
                                          key={order.id}
                                          className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                          <div>
                                            <div className="font-medium">
                                              {order.litres}L - KES{" "}
                                              {order.totalAmount}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              {order.orderDate.toLocaleDateString()}{" "}
                                              • {order.deliveryLocation.address}
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <Badge
                                              variant={
                                                order.status === "delivered"
                                                  ? "default"
                                                  : order.status === "cancelled"
                                                    ? "destructive"
                                                    : "secondary"
                                              }
                                            >
                                              {order.status}
                                            </Badge>
                                            <div className="text-xs text-gray-500 mt-1">
                                              {order.paymentMethod}
                                            </div>
                                          </div>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
