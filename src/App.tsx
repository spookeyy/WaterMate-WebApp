import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminShops from "./pages/admin/Shops";
import AdminOrders from "./pages/admin/Orders";
import ShopDashboard from "./pages/shop/Dashboard";
import ShopOrders from "./pages/shop/Orders";
import ShopCustomers from "./pages/shop/Customers";
import ShopProducts from "./pages/shop/Products";
import ClientDashboard from "./pages/client/Dashboard";
import NotFound from "./pages/NotFound";

// Layouts
import { AdminLayout } from "./components/layouts/AdminLayout";
import { ShopLayout } from "./components/layouts/ShopLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { NotificationsPage } from "./components/NotificationsPage";

// Placeholder pages
import PlaceholderPage from "./pages/PlaceholderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/shops"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminShops />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <PlaceholderPage
                    title="User Management"
                    description="Manage platform users"
                  />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminOrders />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <PlaceholderPage
                    title="Payment Management"
                    description="Monitor payments and transactions"
                  />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <PlaceholderPage
                    title="Platform Settings"
                    description="Configure platform settings"
                  />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <NotificationsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Shop routes */}
          <Route
            path="/shop"
            element={
              <ProtectedRoute allowedRoles={["shop"]}>
                <ShopLayout>
                  <ShopDashboard />
                </ShopLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/orders"
            element={
              <ProtectedRoute allowedRoles={["shop"]}>
                <ShopLayout>
                  <ShopOrders />
                </ShopLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/customers"
            element={
              <ProtectedRoute allowedRoles={["shop"]}>
                <ShopLayout>
                  <ShopCustomers />
                </ShopLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/products"
            element={
              <ProtectedRoute allowedRoles={["shop"]}>
                <ShopLayout>
                  <ShopProducts />
                </ShopLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/delivery"
            element={
              <ProtectedRoute allowedRoles={["shop"]}>
                <ShopLayout>
                  <PlaceholderPage
                    title="Delivery Management"
                    description="Track deliveries and manage delivery zones"
                  />
                </ShopLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/settings"
            element={
              <ProtectedRoute allowedRoles={["shop"]}>
                <ShopLayout>
                  <PlaceholderPage
                    title="Shop Settings"
                    description="Configure your shop settings"
                  />
                </ShopLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/notifications"
            element={
              <ProtectedRoute allowedRoles={["shop"]}>
                <ShopLayout>
                  <NotificationsPage />
                </ShopLayout>
              </ProtectedRoute>
            }
          />

          {/* Client routes */}
          <Route
            path="/client"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/notifications"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <div className="min-h-screen bg-gradient-to-br from-water-50 via-blue-50 to-white p-6">
                  <div className="max-w-4xl mx-auto">
                    <NotificationsPage />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
