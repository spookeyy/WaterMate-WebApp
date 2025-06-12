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
import { mockOrders, mockShops } from "@/lib/mockData";
import { Order, PaymentStatus, PaymentMethod } from "@/types";
import {
  CreditCard,
  Search,
  Eye,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Smartphone,
  Banknote,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export default function AdminPayments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentStatus>(
    "all",
  );
  const [methodFilter, setMethodFilter] = useState<"all" | PaymentMethod>(
    "all",
  );
  const [selectedPayment, setSelectedPayment] = useState<Order | null>(null);

  // Filter orders that have payment information
  const payments = mockOrders.filter(
    (order) => order.paymentStatus && order.totalAmount > 0,
  );

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.mpesaTransactionId &&
        payment.mpesaTransactionId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || payment.paymentStatus === statusFilter;

    const matchesMethod =
      methodFilter === "all" || payment.paymentMethod === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const statusConfig = {
      pending: {
        variant: "secondary" as const,
        icon: Clock,
        color: "text-yellow-600",
      },
      completed: {
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-green-600",
      },
      failed: {
        variant: "destructive" as const,
        icon: AlertCircle,
        color: "text-red-600",
      },
      refunded: {
        variant: "outline" as const,
        icon: AlertCircle,
        color: "text-gray-600",
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    return method === "mpesa" ? (
      <Smartphone className="h-4 w-4 text-green-600" />
    ) : (
      <Banknote className="h-4 w-4 text-blue-600" />
    );
  };

  const paymentStats = {
    total: payments.reduce((sum, p) => sum + p.totalAmount, 0),
    completed: payments.filter((p) => p.paymentStatus === "completed").length,
    pending: payments.filter((p) => p.paymentStatus === "pending").length,
    mpesa: payments
      .filter((p) => p.paymentMethod === "mpesa")
      .reduce((sum, p) => sum + p.totalAmount, 0),
    cash: payments
      .filter((p) => p.paymentMethod === "cash_on_delivery")
      .reduce((sum, p) => sum + p.totalAmount, 0),
  };

  const getShopInfo = (shopId: string) => {
    return mockShops.find((shop) => shop.id === shopId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CreditCard className="h-8 w-8" />
            Payment Management
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor all payments and transactions across the platform
          </p>
        </div>
        <Button className="bg-water-600 hover:bg-water-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            title: "Total Revenue",
            value: `KES ${paymentStats.total.toLocaleString()}`,
            description: "All payments combined",
            icon: DollarSign,
            color: "text-green-600",
          },
          {
            title: "Completed Payments",
            value: paymentStats.completed.toString(),
            description: "Successfully processed",
            icon: CheckCircle,
            color: "text-green-600",
          },
          {
            title: "Pending Payments",
            value: paymentStats.pending.toString(),
            description: "Awaiting processing",
            icon: Clock,
            color: "text-yellow-600",
          },
          {
            title: "MPESA Revenue",
            value: `KES ${paymentStats.mpesa.toLocaleString()}`,
            description: "Mobile money payments",
            icon: Smartphone,
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

      {/* Payment Method Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method Breakdown</CardTitle>
          <CardDescription>
            Revenue distribution by payment method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-medium">MPESA Payments</h3>
                  <p className="text-sm text-gray-500">
                    Mobile money transactions
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">
                  KES {paymentStats.mpesa.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  {payments.filter((p) => p.paymentMethod === "mpesa").length}{" "}
                  transactions
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Banknote className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-medium">Cash on Delivery</h3>
                  <p className="text-sm text-gray-500">
                    Cash payments on delivery
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600">
                  KES {paymentStats.cash.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  {
                    payments.filter(
                      (p) => p.paymentMethod === "cash_on_delivery",
                    ).length
                  }{" "}
                  transactions
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Filters</CardTitle>
          <CardDescription>Filter payments by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by transaction ID, client, or shop..."
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
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={methodFilter}
              onValueChange={(value: any) => setMethodFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="mpesa">MPESA</SelectItem>
                <SelectItem value="cash_on_delivery">
                  Cash on Delivery
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payments ({filteredPayments.length})</CardTitle>
          <CardDescription>
            All payment transactions and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Shop</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => {
                const shop = getShopInfo(payment.shopId);
                return (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{payment.id}</div>
                        {payment.mpesaTransactionId && (
                          <div className="text-xs text-gray-500 font-mono">
                            {payment.mpesaTransactionId}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.clientName}</div>
                        <div className="text-sm text-gray-500">
                          {payment.clientPhone}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.shopName}</div>
                        {shop && (
                          <div className="text-sm text-gray-500">
                            {shop.location.address}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-bold text-lg">
                        KES {payment.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment.litres}L order
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <span className="capitalize">
                          {payment.paymentMethod.replace("_", " ")}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {getPaymentStatusBadge(payment.paymentStatus)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(payment.orderDate, {
                          addSuffix: true,
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment.orderDate.toLocaleDateString()}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Payment Details - {payment.id}
                            </DialogTitle>
                            <DialogDescription>
                              Complete payment transaction information
                            </DialogDescription>
                          </DialogHeader>
                          {selectedPayment && (
                            <div className="space-y-6">
                              {/* Payment Overview */}
                              <Card className="bg-gray-50">
                                <CardContent className="p-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">
                                        Transaction ID
                                      </label>
                                      <p className="text-sm text-gray-600 font-mono">
                                        {selectedPayment.id}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">
                                        Amount
                                      </label>
                                      <p className="text-xl font-bold text-green-600">
                                        KES{" "}
                                        {selectedPayment.totalAmount.toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">
                                        Payment Method
                                      </label>
                                      <div className="flex items-center gap-2 mt-1">
                                        {getPaymentMethodIcon(
                                          selectedPayment.paymentMethod,
                                        )}
                                        <span className="capitalize">
                                          {selectedPayment.paymentMethod.replace(
                                            "_",
                                            " ",
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">
                                        Status
                                      </label>
                                      <div className="mt-1">
                                        {getPaymentStatusBadge(
                                          selectedPayment.paymentStatus,
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Transaction Details */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Client Information
                                  </label>
                                  <div className="mt-1 space-y-1">
                                    <p className="text-sm text-gray-600">
                                      {selectedPayment.clientName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {selectedPayment.clientPhone}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Shop Information
                                  </label>
                                  <div className="mt-1 space-y-1">
                                    <p className="text-sm text-gray-600">
                                      {selectedPayment.shopName}
                                    </p>
                                    {shop && (
                                      <p className="text-sm text-gray-600">
                                        {shop.location.address}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Order Details */}
                              <div>
                                <label className="text-sm font-medium">
                                  Order Details
                                </label>
                                <div className="mt-1 bg-white p-3 rounded border">
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-500">
                                        Quantity:
                                      </span>
                                      <span className="ml-2 font-medium">
                                        {selectedPayment.litres}L
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">
                                        Order Date:
                                      </span>
                                      <span className="ml-2 font-medium">
                                        {selectedPayment.orderDate.toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">
                                        Order Status:
                                      </span>
                                      <span className="ml-2 font-medium capitalize">
                                        {selectedPayment.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* MPESA Details */}
                              {selectedPayment.mpesaTransactionId && (
                                <div>
                                  <label className="text-sm font-medium">
                                    MPESA Transaction
                                  </label>
                                  <div className="mt-1 bg-green-50 p-3 rounded border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Smartphone className="h-4 w-4 text-green-600" />
                                      <span className="font-medium text-green-800">
                                        MPESA Payment Confirmed
                                      </span>
                                    </div>
                                    <p className="text-sm text-green-700 font-mono">
                                      Transaction ID:{" "}
                                      {selectedPayment.mpesaTransactionId}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  Download Receipt
                                </Button>
                                {selectedPayment.paymentStatus ===
                                  "completed" && (
                                  <Button size="sm" variant="outline">
                                    Issue Refund
                                  </Button>
                                )}
                              </div>
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
