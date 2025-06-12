// User types
export type UserRole = "client" | "shop" | "admin";

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  location?: Location;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  floor?: string;
  door?: string;
}

// Shop types
export interface Shop {
  id: string;
  name: string;
  ownerId: string;
  location: Location;
  phone: string;
  operatingZone: number; // radius in km
  pricePerLitre: number;
  minimumOrderLitres: number;
  isActive: boolean;
  subscription: SubscriptionPlan;
  rating: number;
  totalOrders: number;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionPlan = "trial" | "basic" | "premier";

export interface SubscriptionDetails {
  plan: SubscriptionPlan;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  features: string[];
  price: number;
}

// Order types
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";
export type PaymentMethod = "mpesa" | "cash_on_delivery";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Order {
  id: string;
  clientId: string;
  shopId: string;
  litres: number;
  totalAmount: number;
  deliveryLocation: Location;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  orderDate: Date;
  deliveryDate?: Date;
  mpesaTransactionId?: string;
  notes?: string;
  clientPhone: string;
  clientName: string;
  shopName: string;
}

// Payment types
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  mpesaTransactionId?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Analytics types
export interface ShopAnalytics {
  shopId: string;
  dailyOrders: number;
  dailyRevenue: number;
  weeklyOrders: number;
  weeklyRevenue: number;
  monthlyOrders: number;
  monthlyRevenue: number;
  averageOrderSize: number;
  customerRetentionRate: number;
  topCustomers: Array<{
    clientId: string;
    clientName: string;
    totalOrders: number;
    totalSpent: number;
  }>;
}

export interface AdminAnalytics {
  totalShops: number;
  activeShops: number;
  totalOrders: number;
  totalRevenue: number;
  totalClients: number;
  subscriptionDistribution: Record<SubscriptionPlan, number>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  topPerformingShops: Array<{
    shopId: string;
    shopName: string;
    revenue: number;
    orders: number;
    rating: number;
  }>;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "order" | "payment" | "system" | "promotion";
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface LoginForm {
  phone: string;
  otp?: string;
}

export interface OrderForm {
  litres: number;
  deliveryLocation: Location;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface ShopRegistrationForm {
  name: string;
  phone: string;
  location: Location;
  operatingZone: number;
  pricePerLitre: number;
  minimumOrderLitres: number;
}

// Dashboard filter types
export interface DateRange {
  from: Date;
  to: Date;
}

export interface OrderFilters {
  status?: OrderStatus[];
  paymentMethod?: PaymentMethod[];
  dateRange?: DateRange;
  shopId?: string;
  clientId?: string;
}

// Map types
export interface MapLocation {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  type: "shop" | "client" | "delivery";
}
