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
import { mockUsers, mockOrders } from "@/lib/mockData";
import { User, UserRole } from "@/types";
import {
  Users,
  Search,
  Eye,
  Edit,
  Shield,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  Building2,
  Ban,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getUserOrders = (userId: string) => {
    return mockOrders.filter((order) => order.clientId === userId);
  };

  const getUserStats = (user: User) => {
    const userOrders = getUserOrders(user.id);
    return {
      totalOrders: userOrders.length,
      totalSpent: userOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      lastOrder: userOrders.length > 0 ? userOrders[0].orderDate : null,
    };
  };

  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      admin: {
        variant: "destructive" as const,
        icon: Shield,
        color: "text-red-600",
        label: "Admin",
      },
      shop: {
        variant: "default" as const,
        icon: Building2,
        color: "text-blue-600",
        label: "Shop Owner",
      },
      client: {
        variant: "secondary" as const,
        icon: Users,
        color: "text-green-600",
        label: "Client",
      },
    };

    const config = roleConfig[role];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const userStats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    shops: users.filter((u) => u.role === "shop").length,
    clients: users.filter((u) => u.role === "client").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="h-8 w-8" />
          User Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage all platform users and their roles
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            title: "Total Users",
            value: userStats.total.toString(),
            description: "All registered users",
            icon: Users,
            color: "text-blue-600",
          },
          {
            title: "Clients",
            value: userStats.clients.toString(),
            description: "Water ordering customers",
            icon: Users,
            color: "text-green-600",
          },
          {
            title: "Shop Owners",
            value: userStats.shops.toString(),
            description: "Water shop operators",
            icon: Building2,
            color: "text-purple-600",
          },
          {
            title: "Administrators",
            value: userStats.admins.toString(),
            description: "Platform administrators",
            icon: Shield,
            color: "text-red-600",
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
          <CardTitle>User Filters</CardTitle>
          <CardDescription>
            Filter users by name, phone, or role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={roleFilter}
              onValueChange={(value: any) => setRoleFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
                <SelectItem value="shop">Shop Owners</SelectItem>
                <SelectItem value="admin">Administrators</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const stats = getUserStats(user);
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-water-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-water-700">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                        {user.location && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {user.location.address}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>{getRoleBadge(user.role)}</TableCell>

                    <TableCell>
                      {user.role === "client" ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <ShoppingCart className="h-3 w-3" />
                            {stats.totalOrders} orders
                          </div>
                          <div className="text-xs text-gray-500">
                            KES {stats.totalSpent.toLocaleString()} spent
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          {user.role === "shop"
                            ? "Shop Owner"
                            : "Administrator"}
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(user.createdAt, {
                          addSuffix: true,
                        })}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                User Details - {user.name}
                              </DialogTitle>
                              <DialogDescription>
                                View and manage user information
                              </DialogDescription>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-6">
                                {/* User Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">
                                      Name
                                    </label>
                                    <p className="text-sm text-gray-600">
                                      {selectedUser.name}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      Phone
                                    </label>
                                    <p className="text-sm text-gray-600">
                                      {selectedUser.phone}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      Role
                                    </label>
                                    <div className="mt-1">
                                      {getRoleBadge(selectedUser.role)}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      Member Since
                                    </label>
                                    <p className="text-sm text-gray-600">
                                      {selectedUser.createdAt.toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                {selectedUser.location && (
                                  <div>
                                    <label className="text-sm font-medium">
                                      Location
                                    </label>
                                    <p className="text-sm text-gray-600">
                                      {selectedUser.location.address}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {selectedUser.location.latitude},{" "}
                                      {selectedUser.location.longitude}
                                    </p>
                                  </div>
                                )}

                                {/* Activity Stats for Clients */}
                                {selectedUser.role === "client" && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">
                                        Activity Summary
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                          <div className="text-2xl font-bold text-blue-600">
                                            {
                                              getUserStats(selectedUser)
                                                .totalOrders
                                            }
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            Total Orders
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-2xl font-bold text-green-600">
                                            KES{" "}
                                            {getUserStats(
                                              selectedUser,
                                            ).totalSpent.toLocaleString()}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            Total Spent
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-2xl font-bold text-purple-600">
                                            {getUserStats(selectedUser)
                                              .lastOrder
                                              ? formatDistanceToNow(
                                                  getUserStats(selectedUser)
                                                    .lastOrder!,
                                                  { addSuffix: true },
                                                )
                                              : "Never"}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            Last Order
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Recent Orders */}
                                {selectedUser.role === "client" && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">
                                        Recent Orders
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-3 max-h-48 overflow-y-auto">
                                        {getUserOrders(selectedUser.id)
                                          .slice(0, 5)
                                          .map((order) => (
                                            <div
                                              key={order.id}
                                              className="flex items-center justify-between p-3 border rounded-lg"
                                            >
                                              <div>
                                                <div className="font-medium">
                                                  {order.litres}L from{" "}
                                                  {order.shopName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                  {order.orderDate.toLocaleDateString()}
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <div className="font-medium">
                                                  KES {order.totalAmount}
                                                </div>
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs"
                                                >
                                                  {order.status}
                                                </Badge>
                                              </div>
                                            </div>
                                          ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit User
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Ban className="h-4 w-4 mr-2" />
                                    Suspend User
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
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
