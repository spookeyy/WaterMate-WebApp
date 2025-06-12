import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  ShoppingCart,
  CreditCard,
  Settings,
  Gift,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export function NotificationsPage() {
  const { user } = useAuthStore();
  const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotificationStore();

  const [filter, setFilter] = useState<"all" | "unread">("all");

  if (!user) return null;

  const allNotifications = getNotifications(user.id);
  const unreadCount = getUnreadCount(user.id);

  const filteredNotifications =
    filter === "unread"
      ? allNotifications.filter((n) => !n.isRead)
      : allNotifications;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return ShoppingCart;
      case "payment":
        return CreditCard;
      case "system":
        return Settings;
      case "promotion":
        return Gift;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order":
        return "text-blue-500";
      case "payment":
        return "text-green-500";
      case "system":
        return "text-orange-500";
      case "promotion":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(user.id);
  };

  const handleRemoveNotification = (id: string) => {
    removeNotification(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="h-8 w-8" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 mt-2">
            Stay updated with your latest activities and alerts
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All ({allNotifications.length})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
            size="sm"
          >
            Unread ({unreadCount})
          </Button>
        </div>
      </div>

      {/* Actions */}
      {unreadCount > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  You have {unreadCount} unread notifications
                </span>
              </div>
              <Button
                onClick={handleMarkAllAsRead}
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BellOff className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications yet"}
              </h3>
              <p className="text-gray-500">
                {filter === "unread"
                  ? "You're all caught up! All notifications have been read."
                  : "When you have new activities, they'll appear here."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const iconColor = getNotificationColor(notification.type);

            return (
              <Card
                key={notification.id}
                className={cn(
                  "transition-all duration-200 hover:shadow-md",
                  !notification.isRead &&
                    "border-l-4 border-l-blue-500 bg-blue-50/50",
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      <div
                        className={cn(
                          "p-2 rounded-full bg-gray-100",
                          iconColor,
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {notification.type}
                          </Badge>
                        </div>

                        <p className="text-gray-600 text-sm mb-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(notification.createdAt, {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1 ml-4">
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleRemoveNotification(notification.id)
                        }
                        title="Remove notification"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Stats */}
      {allNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notification Summary</CardTitle>
            <CardDescription>
              Your notification activity overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Total",
                  value: allNotifications.length,
                  color: "text-gray-600",
                },
                { label: "Unread", value: unreadCount, color: "text-blue-600" },
                {
                  label: "Orders",
                  value: allNotifications.filter((n) => n.type === "order")
                    .length,
                  color: "text-blue-600",
                },
                {
                  label: "Payments",
                  value: allNotifications.filter((n) => n.type === "payment")
                    .length,
                  color: "text-green-600",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className={cn("text-2xl font-bold", stat.color)}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
