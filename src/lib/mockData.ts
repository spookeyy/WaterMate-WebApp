import {
  User,
  Shop,
  Order,
  Payment,
  ShopAnalytics,
  AdminAnalytics,
  Notification,
  SubscriptionDetails,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  SubscriptionPlan,
} from "@/types";

// Generate realistic Nairobi coordinates
const generateNairobiLocation = () => {
  const baseLat = -1.2921;
  const baseLng = 36.8219;
  const radius = 0.1; // Approximately 10km radius

  return {
    latitude: baseLat + (Math.random() - 0.5) * radius,
    longitude: baseLng + (Math.random() - 0.5) * radius,
    address:
      [
        "Westlands",
        "Karen",
        "Kilimani",
        "Lavington",
        "Parklands",
        "Kileleshwa",
        "Spring Valley",
        "Runda",
        "Muthaiga",
        "Riverside",
      ][Math.floor(Math.random() * 10)] + " Area, Nairobi",
  };
};

// Mock Users
export const mockUsers: User[] = [
  {
    id: "admin-1",
    phone: "+254700000001",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  },
  {
    id: "shop-1",
    phone: "+254700000002",
    name: "John Mwangi",
    role: "shop",
    location: generateNairobiLocation(),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
  },
  {
    id: "shop-2",
    phone: "+254700000003",
    name: "Grace Wanjiku",
    role: "shop",
    location: generateNairobiLocation(),
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date(),
  },
  {
    id: "client-1",
    phone: "+254700000004",
    name: "Peter Kimani",
    role: "client",
    location: generateNairobiLocation(),
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date(),
  },
  {
    id: "client-2",
    phone: "+254700000005",
    name: "Mary Njeri",
    role: "client",
    location: generateNairobiLocation(),
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date(),
  },
];

// Mock Shops
export const mockShops: Shop[] = [
  {
    id: "shop-1",
    name: "Pure Water Westlands",
    ownerId: "shop-1",
    location: {
      latitude: -1.2676,
      longitude: 36.8108,
      address: "Westlands Shopping Center, Nairobi",
    },
    phone: "+254700000002",
    operatingZone: 5,
    pricePerLitre: 5,
    minimumOrderLitres: 10,
    isActive: true,
    subscription: "premier",
    rating: 4.8,
    totalOrders: 2543,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
  },
  {
    id: "shop-2",
    name: "Crystal Clear Karen",
    ownerId: "shop-2",
    location: {
      latitude: -1.3194,
      longitude: 36.7085,
      address: "Karen Shopping Center, Nairobi",
    },
    phone: "+254700000003",
    operatingZone: 8,
    pricePerLitre: 4.5,
    minimumOrderLitres: 15,
    isActive: true,
    subscription: "basic",
    rating: 4.6,
    totalOrders: 1876,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date(),
  },
  {
    id: "shop-3",
    name: "Fresh Flow Kilimani",
    ownerId: "shop-1",
    location: {
      latitude: -1.2905,
      longitude: 36.7935,
      address: "Kilimani Plaza, Nairobi",
    },
    phone: "+254700000006",
    operatingZone: 6,
    pricePerLitre: 5.5,
    minimumOrderLitres: 10,
    isActive: true,
    subscription: "trial",
    rating: 4.2,
    totalOrders: 567,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date(),
  },
];

// Generate mock orders
const generateMockOrders = (): Order[] => {
  const orders: Order[] = [];
  const statuses: OrderStatus[] = [
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];
  const paymentMethods: PaymentMethod[] = ["mpesa", "cash_on_delivery"];
  const paymentStatuses: PaymentStatus[] = ["pending", "completed", "failed"];

  for (let i = 1; i <= 50; i++) {
    const shop = mockShops[Math.floor(Math.random() * mockShops.length)];
    const client = mockUsers.find((u) => u.role === "client") || mockUsers[3];
    const litres = Math.floor(Math.random() * 40) + 10; // 10-50 litres
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));

    orders.push({
      id: `order-${i}`,
      clientId: client.id,
      shopId: shop.id,
      litres,
      totalAmount: litres * shop.pricePerLitre,
      deliveryLocation: client.location || generateNairobiLocation(),
      paymentMethod:
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      paymentStatus:
        paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      orderDate,
      deliveryDate:
        Math.random() > 0.3
          ? new Date(orderDate.getTime() + 86400000)
          : undefined,
      mpesaTransactionId:
        Math.random() > 0.5
          ? `TXN${Math.random().toString(36).substr(2, 9)}`
          : undefined,
      clientPhone: client.phone,
      clientName: client.name,
      shopName: shop.name,
    });
  }

  return orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
};

export const mockOrders = generateMockOrders();

// Mock Payments
export const mockPayments: Payment[] = mockOrders
  .filter((order) => order.paymentStatus === "completed")
  .map((order) => ({
    id: `payment-${order.id}`,
    orderId: order.id,
    amount: order.totalAmount,
    method: order.paymentMethod,
    status: order.paymentStatus,
    mpesaTransactionId: order.mpesaTransactionId,
    createdAt: order.orderDate,
    completedAt: order.deliveryDate,
  }));

// Mock Shop Analytics
export const mockShopAnalytics: Record<string, ShopAnalytics> = {
  "shop-1": {
    shopId: "shop-1",
    dailyOrders: 12,
    dailyRevenue: 2400,
    weeklyOrders: 78,
    weeklyRevenue: 15600,
    monthlyOrders: 312,
    monthlyRevenue: 62400,
    averageOrderSize: 25.5,
    customerRetentionRate: 0.78,
    topCustomers: [
      {
        clientId: "client-1",
        clientName: "Peter Kimani",
        totalOrders: 45,
        totalSpent: 11250,
      },
    ],
  },
  "shop-2": {
    shopId: "shop-2",
    dailyOrders: 8,
    dailyRevenue: 1800,
    weeklyOrders: 56,
    weeklyRevenue: 12600,
    monthlyOrders: 224,
    monthlyRevenue: 50400,
    averageOrderSize: 22.5,
    customerRetentionRate: 0.72,
    topCustomers: [
      {
        clientId: "client-2",
        clientName: "Mary Njeri",
        totalOrders: 32,
        totalSpent: 7200,
      },
    ],
  },
};

// Mock Admin Analytics
export const mockAdminAnalytics: AdminAnalytics = {
  totalShops: 3,
  activeShops: 3,
  totalOrders: mockOrders.length,
  totalRevenue: mockOrders.reduce((sum, order) => sum + order.totalAmount, 0),
  totalClients: mockUsers.filter((u) => u.role === "client").length,
  subscriptionDistribution: {
    trial: 1,
    basic: 1,
    premier: 1,
  },
  revenueByMonth: [
    { month: "Jan", revenue: 125000, orders: 450 },
    { month: "Feb", revenue: 135000, orders: 520 },
    { month: "Mar", revenue: 142000, orders: 580 },
    { month: "Apr", revenue: 138000, orders: 560 },
    { month: "May", revenue: 155000, orders: 620 },
    { month: "Jun", revenue: 168000, orders: 680 },
  ],
  topPerformingShops: [
    {
      shopId: "shop-1",
      shopName: "Pure Water Westlands",
      revenue: 62400,
      orders: 312,
      rating: 4.8,
    },
    {
      shopId: "shop-2",
      shopName: "Crystal Clear Karen",
      revenue: 50400,
      orders: 224,
      rating: 4.6,
    },
  ],
};

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "shop-1",
    title: "New Order Received",
    message: "You have a new order for 20 litres from Peter Kimani",
    type: "order",
    isRead: false,
    createdAt: new Date(Date.now() - 300000), // 5 minutes ago
  },
  {
    id: "notif-2",
    userId: "shop-1",
    title: "Payment Received",
    message: "MPESA payment of KES 500 has been confirmed",
    type: "payment",
    isRead: false,
    createdAt: new Date(Date.now() - 900000), // 15 minutes ago
  },
  {
    id: "notif-3",
    userId: "admin-1",
    title: "New Shop Registration",
    message: "Fresh Flow Kilimani has registered and is pending approval",
    type: "system",
    isRead: true,
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  },
];

// Mock Subscription Plans
export const mockSubscriptionPlans: Record<
  SubscriptionPlan,
  SubscriptionDetails
> = {
  trial: {
    plan: "trial",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    isActive: true,
    features: ["Up to 50 orders/month", "Basic analytics", "Email support"],
    price: 0,
  },
  basic: {
    plan: "basic",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    isActive: true,
    features: [
      "Up to 200 orders/month",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
    ],
    price: 2500,
  },
  premier: {
    plan: "premier",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    isActive: true,
    features: [
      "Unlimited orders",
      "Real-time analytics",
      "24/7 phone support",
      "Custom branding",
      "API access",
      "Priority listing",
    ],
    price: 5000,
  },
};
