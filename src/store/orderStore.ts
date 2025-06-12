import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Order, OrderStatus, PaymentStatus } from "@/types";
import { mockOrders } from "@/lib/mockData";
import { useNotificationStore } from "./notificationStore";

interface OrderStore {
  orders: Order[];
  isLoading: boolean;
  error: string | null;

  // Actions
  createOrder: (orderData: Omit<Order, "id" | "orderDate">) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updatePaymentStatus: (
    orderId: string,
    status: PaymentStatus,
    transactionId?: string,
  ) => Promise<void>;
  cancelOrder: (orderId: string, reason?: string) => Promise<void>;
  getOrdersByShop: (shopId: string) => Order[];
  getOrdersByClient: (clientId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;

  // Real-time updates
  refreshOrders: () => Promise<void>;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: mockOrders,
      isLoading: false,
      error: null,

      createOrder: async (orderData) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const newOrder: Order = {
            ...orderData,
            id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            orderDate: new Date(),
            status: "pending",
          };

          set((state) => ({
            orders: [newOrder, ...state.orders],
            isLoading: false,
          }));

          // Add notification for shop owner
          const notificationStore = useNotificationStore.getState();
          notificationStore.addNotification({
            userId: `shop-${newOrder.shopId}`, // This would be the shop owner's user ID
            title: "New Order Received",
            message: `New order for ${newOrder.litres}L from ${newOrder.clientName}`,
            type: "order",
            isRead: false,
            actionUrl: `/shop/orders/${newOrder.id}`,
          });

          return newOrder;
        } catch (error) {
          set({ error: "Failed to create order", isLoading: false });
          throw error;
        }
      },

      updateOrderStatus: async (orderId, status) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise((resolve) => setTimeout(resolve, 500));

          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === orderId
                ? {
                    ...order,
                    status,
                    deliveryDate:
                      status === "delivered" ? new Date() : order.deliveryDate,
                  }
                : order,
            ),
            isLoading: false,
          }));

          // Add notification for client
          const order = get().orders.find((o) => o.id === orderId);
          if (order) {
            const notificationStore = useNotificationStore.getState();
            notificationStore.addNotification({
              userId: order.clientId,
              title: "Order Status Updated",
              message: `Your order is now ${status.replace("_", " ")}`,
              type: "order",
              isRead: false,
              actionUrl: `/client/orders/${orderId}`,
            });
          }
        } catch (error) {
          set({ error: "Failed to update order status", isLoading: false });
          throw error;
        }
      },

      updatePaymentStatus: async (orderId, status, transactionId) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise((resolve) => setTimeout(resolve, 500));

          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === orderId
                ? {
                    ...order,
                    paymentStatus: status,
                    mpesaTransactionId:
                      transactionId || order.mpesaTransactionId,
                  }
                : order,
            ),
            isLoading: false,
          }));

          // Add notification
          const order = get().orders.find((o) => o.id === orderId);
          if (order && status === "completed") {
            const notificationStore = useNotificationStore.getState();
            notificationStore.addNotification({
              userId: order.clientId,
              title: "Payment Confirmed",
              message: `Payment of KES ${order.totalAmount} has been confirmed`,
              type: "payment",
              isRead: false,
            });
          }
        } catch (error) {
          set({ error: "Failed to update payment status", isLoading: false });
          throw error;
        }
      },

      cancelOrder: async (orderId, reason) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise((resolve) => setTimeout(resolve, 500));

          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === orderId
                ? {
                    ...order,
                    status: "cancelled",
                    notes: reason ? `Cancelled: ${reason}` : "Cancelled",
                  }
                : order,
            ),
            isLoading: false,
          }));

          // Add notification
          const order = get().orders.find((o) => o.id === orderId);
          if (order) {
            const notificationStore = useNotificationStore.getState();
            notificationStore.addNotification({
              userId: order.clientId,
              title: "Order Cancelled",
              message: `Your order has been cancelled. ${reason || ""}`,
              type: "order",
              isRead: false,
            });
          }
        } catch (error) {
          set({ error: "Failed to cancel order", isLoading: false });
          throw error;
        }
      },

      getOrdersByShop: (shopId) => {
        return get().orders.filter((order) => order.shopId === shopId);
      },

      getOrdersByClient: (clientId) => {
        return get().orders.filter((order) => order.clientId === clientId);
      },

      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },

      refreshOrders: async () => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API refresh
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set({ isLoading: false });
        } catch (error) {
          set({ error: "Failed to refresh orders", isLoading: false });
        }
      },
    }),
    {
      name: "watermate-orders",
    },
  ),
);
