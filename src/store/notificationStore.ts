import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Notification } from "@/types";
import { mockNotifications } from "@/lib/mockData";

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  removeNotification: (id: string) => void;
  getNotifications: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: mockNotifications,
      unreadCount: mockNotifications.filter((n) => !n.isRead).length,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n,
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      markAllAsRead: (userId) => {
        set((state) => {
          const userNotifications = state.notifications.filter(
            (n) => n.userId === userId && !n.isRead,
          );
          return {
            notifications: state.notifications.map((n) =>
              n.userId === userId ? { ...n, isRead: true } : n,
            ),
            unreadCount: Math.max(
              0,
              state.unreadCount - userNotifications.length,
            ),
          };
        });
      },

      removeNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount:
              notification && !notification.isRead
                ? Math.max(0, state.unreadCount - 1)
                : state.unreadCount,
          };
        });
      },

      getNotifications: (userId) => {
        return get().notifications.filter((n) => n.userId === userId);
      },

      getUnreadCount: (userId) => {
        return get().notifications.filter(
          (n) => n.userId === userId && !n.isRead,
        ).length;
      },
    }),
    {
      name: "watermate-notifications",
    },
  ),
);
