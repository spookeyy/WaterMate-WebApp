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
import { useOrderStore } from "@/store/orderStore";
import { mockOrders, mockShops } from "@/lib/mockData";
import { Order, OrderStatus, PaymentStatus } from "@/types";
import {
  ShoppingCart,
  Search,
  Eye,
  MapPin,
  Phone,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export default function AdminOrders() {
  const { updateOrderStatus, updatePaymentStatus, isLoading } = useOrderStore();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [paymentFilter, setPaymentFilter] = useState<"all" | PaymentStatus>(
    "all",
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status: OrderStatus) => {
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
        icon: RefreshCw,
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
        icon: XCircle,
        color: "text-red-600",
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, color: "text-yellow-600" },
      completed: { variant: "default" as const, color: "text-green-600" },
      failed: { variant: "destructive" as const, color: "text-red-600" },
      refunded: { variant: "outline" as const, color: "text-gray-600" },
    };

    const config = statusConfig[status];

    return <Badge variant={config.variant}>{status}</Badge>;
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handlePaymentUpdate = async (
    orderId: string,
    newStatus: PaymentStatus,
  ) => {
    try {
      await updatePaymentStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, paymentStatus: newStatus } : order,
        ),
      );
    } catch (error) {
      console.error("Failed to update payment status:", error);
    }
  };

  const getShopInfo = (shopId: string) => {
    return mockShops.find((shop) => shop.id === shopId);
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    revenue: orders
      .filter((o) => o.paymentStatus === "completed")
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ShoppingCart className="h-8 w-8" />
          Order Management
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor and manage all orders across the platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            title: "Total Orders",
            value: orderStats.total.toString(),
            description: "All time orders",
            icon: ShoppingCart,
            color: "text-blue-600",
          },
          {
            title: "Pending Orders",
            value: orderStats.pending.toString(),
            description: "Awaiting processing",
            icon: Clock,
            color: "text-yellow-600",
          },
          {
            title: "Delivered",
            value: orderStats.delivered.toString(),
            description: "Successfully completed",
            icon: CheckCircle,
            color: "text-green-600",
          },
          {
            title: "Total Revenue",
            value: `KES ${orderStats.revenue.toLocaleString()}`,
            description: "From completed orders",
            icon: DollarSign,
            color: "text-green-600",
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
          <CardDescription>Filter orders by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by order ID, client, or shop..."
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
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="out_for_delivery">
                  Out for Delivery
                </SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={paymentFilter}
              onValueChange={(value: any) => setPaymentFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          <CardDescription>
            Manage order details, status, and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Shop</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const shop = getShopInfo(order.shopId);
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{order.id}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(order.orderDate, {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="font-medium">{order.clientName}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Phone className="h-3 w-3" />
                          {order.clientPhone}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="font-medium">{order.shopName}</div>
                        {shop && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {shop.location.address}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="font-medium">{order.litres}L</div>
                        <div className="text-sm text-gray-500">
                          KES {order.totalAmount}
                        </div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {order.paymentMethod}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(order.status)}</TableCell>

                    <TableCell>
                      {getPaymentBadge(order.paymentStatus)}
                    </TableCell>

                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Order Details - {order.id}
                            </DialogTitle>
                            <DialogDescription>
                              Manage order status and payment information
                            </DialogDescription>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Client
                                  </label>
                                  <p className="text-sm text-gray-600">
                                    {selectedOrder.clientName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {selectedOrder.clientPhone}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Shop
                                  </label>
                                  <p className="text-sm text-gray-600">
                                    {selectedOrder.shopName}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Quantity
                                  </label>
                                  <p className="text-sm text-gray-600">
                                    {selectedOrder.litres} Litres
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Total Amount
                                  </label>
                                  <p className="text-sm text-gray-600">
                                    KES {selectedOrder.totalAmount}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Payment Method
                                  </label>
                                  <p className="text-sm text-gray-600">
                                    {selectedOrder.paymentMethod}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Order Date
                                  </label>
                                  <p className="text-sm text-gray-600">
                                    {selectedOrder.orderDate.toLocaleDateString()}{" "}
                                    {selectedOrder.orderDate.toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium">
                                  Delivery Address
                                </label>
                                <p className="text-sm text-gray-600">
                                  {selectedOrder.deliveryLocation.address}
                                </p>
                                {selectedOrder.deliveryLocation.floor && (
                                  <p className="text-xs text-gray-500">
                                    Floor:{" "}
                                    {selectedOrder.deliveryLocation.floor}
                                    {selectedOrder.deliveryLocation.door &&
                                      `, Door: ${selectedOrder.deliveryLocation.door}`}
                                  </p>
                                )}
                              </div>

                              {selectedOrder.notes && (
                                <div>
                                  <label className="text-sm font-medium">
                                    Notes
                                  </label>
                                  <p className="text-sm text-gray-600">
                                    {selectedOrder.notes}
                                  </p>
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Order Status
                                  </label>
                                  <Select
                                    value={selectedOrder.status}
                                    onValueChange={(value: OrderStatus) => {
                                      handleStatusUpdate(
                                        selectedOrder.id,
                                        value,
                                      );
                                      setSelectedOrder({
                                        ...selectedOrder,
                                        status: value,
                                      });
                                    }}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">
                                        Pending
                                      </SelectItem>
                                      <SelectItem value="confirmed">
                                        Confirmed
                                      </SelectItem>
                                      <SelectItem value="preparing">
                                        Preparing
                                      </SelectItem>
                                      <SelectItem value="out_for_delivery">
                                        Out for Delivery
                                      </SelectItem>
                                      <SelectItem value="delivered">
                                        Delivered
                                      </SelectItem>
                                      <SelectItem value="cancelled">
                                        Cancelled
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <label className="text-sm font-medium">
                                    Payment Status
                                  </label>
                                  <Select
                                    value={selectedOrder.paymentStatus}
                                    onValueChange={(value: PaymentStatus) => {
                                      handlePaymentUpdate(
                                        selectedOrder.id,
                                        value,
                                      );
                                      setSelectedOrder({
                                        ...selectedOrder,
                                        paymentStatus: value,
                                      });
                                    }}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">
                                        Pending
                                      </SelectItem>
                                      <SelectItem value="completed">
                                        Completed
                                      </SelectItem>
                                      <SelectItem value="failed">
                                        Failed
                                      </SelectItem>
                                      <SelectItem value="refunded">
                                        Refunded
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {selectedOrder.mpesaTransactionId && (
                                <div>
                                  <label className="text-sm font-medium">
                                    MPESA Transaction ID
                                  </label>
                                  <p className="text-sm text-gray-600 font-mono">
                                    {selectedOrder.mpesaTransactionId}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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
