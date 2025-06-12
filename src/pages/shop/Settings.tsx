import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { mockShops } from "@/lib/mockData";
import { SubscriptionPlan } from "@/types";
import {
  Settings,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Bell,
  Crown,
  CheckCircle,
  CreditCard,
  Phone,
  User,
} from "lucide-react";

export default function ShopSettings() {
  const { user } = useAuthStore();
  const shop = mockShops.find((s) => s.ownerId === user?.id);

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [shopSettings, setShopSettings] = useState({
    // Shop Information
    name: shop?.name || "",
    description: "Premium water delivery service in Nairobi",
    phone: shop?.phone || "",
    email: "shop@watermate.co.ke",

    // Location
    address: shop?.location.address || "",
    latitude: shop?.location.latitude?.toString() || "",
    longitude: shop?.location.longitude?.toString() || "",
    operatingZone: shop?.operatingZone?.toString() || "5",

    // Pricing
    pricePerLitre: shop?.pricePerLitre?.toString() || "5",
    minimumOrderLitres: shop?.minimumOrderLitres?.toString() || "10",
    deliveryFee: "0",

    // Operations
    isActive: shop?.isActive || true,
    autoAcceptOrders: true,
    requirePrePayment: false,
    allowCashOnDelivery: true,

    // Business Hours
    mondayHours: "8:00 AM - 6:00 PM",
    tuesdayHours: "8:00 AM - 6:00 PM",
    wednesdayHours: "8:00 AM - 6:00 PM",
    thursdayHours: "8:00 AM - 6:00 PM",
    fridayHours: "8:00 AM - 6:00 PM",
    saturdayHours: "9:00 AM - 5:00 PM",
    sundayHours: "10:00 AM - 4:00 PM",

    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
  });

  const updateSetting = (key: string, value: string | boolean) => {
    setShopSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSaving(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getSubscriptionBadge = (plan: SubscriptionPlan) => {
    switch (plan) {
      case "premier":
        return (
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Premier
          </Badge>
        );
      case "basic":
        return <Badge variant="secondary">Basic</Badge>;
      case "trial":
        return <Badge variant="outline">Trial</Badge>;
    }
  };

  if (!shop) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Shop not found</h3>
          <p className="text-gray-500">Unable to load shop information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="h-8 w-8" />
            Shop Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Configure your shop information and preferences
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-water-600 hover:bg-water-700"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Settings saved successfully!</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Subscription */}
      <Card className="bg-gradient-to-r from-water-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Subscription
              </CardTitle>
              <CardDescription>Your current plan and features</CardDescription>
            </div>
            {getSubscriptionBadge(shop.subscription)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-water-600">
                {shop.totalOrders}
              </div>
              <div className="text-sm text-gray-500">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {shop.rating}★
              </div>
              <div className="text-sm text-gray-500">Customer Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {shop.subscription === "premier"
                  ? "∞"
                  : shop.subscription === "basic"
                    ? "200"
                    : "50"}
              </div>
              <div className="text-sm text-gray-500">Orders/Month</div>
            </div>
            <div className="text-center">
              <Button size="sm" variant="outline">
                Upgrade Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Shop Information
              </CardTitle>
              <CardDescription>
                Basic information about your water shop
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input
                    id="shopName"
                    value={shopSettings.name}
                    onChange={(e) => updateSetting("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={shopSettings.phone}
                      onChange={(e) => updateSetting("phone", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={shopSettings.email}
                  onChange={(e) => updateSetting("email", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Shop Description</Label>
                <Textarea
                  id="description"
                  value={shopSettings.description}
                  onChange={(e) => updateSetting("description", e.target.value)}
                  rows={3}
                  placeholder="Describe your shop and services..."
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Operational Settings</h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Shop Status</Label>
                      <p className="text-sm text-gray-600">
                        Accept new orders and appear in search results
                      </p>
                    </div>
                    <Switch
                      checked={shopSettings.isActive}
                      onCheckedChange={(checked) =>
                        updateSetting("isActive", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-accept orders</Label>
                      <p className="text-sm text-gray-600">
                        Automatically accept incoming orders
                      </p>
                    </div>
                    <Switch
                      checked={shopSettings.autoAcceptOrders}
                      onCheckedChange={(checked) =>
                        updateSetting("autoAcceptOrders", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require pre-payment</Label>
                      <p className="text-sm text-gray-600">
                        Require payment before processing orders
                      </p>
                    </div>
                    <Switch
                      checked={shopSettings.requirePrePayment}
                      onCheckedChange={(checked) =>
                        updateSetting("requirePrePayment", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow cash on delivery</Label>
                      <p className="text-sm text-gray-600">
                        Accept cash payments upon delivery
                      </p>
                    </div>
                    <Switch
                      checked={shopSettings.allowCashOnDelivery}
                      onCheckedChange={(checked) =>
                        updateSetting("allowCashOnDelivery", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Settings */}
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location & Delivery
              </CardTitle>
              <CardDescription>
                Configure your shop location and delivery area
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Physical Address</Label>
                <Textarea
                  id="address"
                  value={shopSettings.address}
                  onChange={(e) => updateSetting("address", e.target.value)}
                  rows={2}
                  placeholder="Enter your complete shop address..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={shopSettings.latitude}
                    onChange={(e) => updateSetting("latitude", e.target.value)}
                    placeholder="-1.2676"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={shopSettings.longitude}
                    onChange={(e) => updateSetting("longitude", e.target.value)}
                    placeholder="36.8108"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="operatingZone">Operating Zone (km)</Label>
                <Input
                  id="operatingZone"
                  type="number"
                  value={shopSettings.operatingZone}
                  onChange={(e) =>
                    updateSetting("operatingZone", e.target.value)
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum delivery radius from your shop location
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">
                  📍 Location Tips
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use Google Maps to find accurate coordinates</li>
                  <li>
                    • Ensure your location is easily accessible to customers
                  </li>
                  <li>
                    • Consider proximity to main roads for efficient delivery
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Settings */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing Configuration
              </CardTitle>
              <CardDescription>
                Set your water prices and order requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pricePerLitre">Price per Litre (KES)</Label>
                  <Input
                    id="pricePerLitre"
                    type="number"
                    step="0.1"
                    value={shopSettings.pricePerLitre}
                    onChange={(e) =>
                      updateSetting("pricePerLitre", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="minimumOrder">Minimum Order (Litres)</Label>
                  <Input
                    id="minimumOrder"
                    type="number"
                    value={shopSettings.minimumOrderLitres}
                    onChange={(e) =>
                      updateSetting("minimumOrderLitres", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="deliveryFee">Delivery Fee (KES)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  value={shopSettings.deliveryFee}
                  onChange={(e) => updateSetting("deliveryFee", e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set to 0 for free delivery
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">
                  💰 Pricing Strategy
                </h4>
                <div className="text-sm text-green-800 space-y-1">
                  <p>• Competitive pricing in your area: KES 4-6 per litre</p>
                  <p>• Consider volume discounts for large orders</p>
                  <p>• Free delivery can attract more customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Hours */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Business Hours
              </CardTitle>
              <CardDescription>
                Set your operating hours for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "mondayHours", label: "Monday" },
                { key: "tuesdayHours", label: "Tuesday" },
                { key: "wednesdayHours", label: "Wednesday" },
                { key: "thursdayHours", label: "Thursday" },
                { key: "fridayHours", label: "Friday" },
                { key: "saturdayHours", label: "Saturday" },
                { key: "sundayHours", label: "Sunday" },
              ].map((day) => (
                <div key={day.key} className="flex items-center gap-4">
                  <div className="w-24">
                    <Label>{day.label}</Label>
                  </div>
                  <div className="flex-1">
                    <Input
                      value={
                        shopSettings[
                          day.key as keyof typeof shopSettings
                        ] as string
                      }
                      onChange={(e) => updateSetting(day.key, e.target.value)}
                      placeholder="e.g., 8:00 AM - 6:00 PM or Closed"
                    />
                  </div>
                </div>
              ))}

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-2">
                  ⏰ Hours Guidelines
                </h4>
                <div className="text-sm text-yellow-800 space-y-1">
                  <p>• Use format: "8:00 AM - 6:00 PM"</p>
                  <p>• For closed days, enter "Closed"</p>
                  <p>• Consider peak demand times in your area</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to receive order and system notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Receive order updates and system alerts via email
                    </p>
                  </div>
                  <Switch
                    checked={shopSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting("emailNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Get instant SMS alerts for new orders
                    </p>
                  </div>
                  <Switch
                    checked={shopSettings.smsNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting("smsNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Receive push notifications on your mobile device
                    </p>
                  </div>
                  <Switch
                    checked={shopSettings.pushNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting("pushNotifications", checked)
                    }
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">
                  📱 Notification Types
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>New orders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>Payment confirmations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>Customer messages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>System updates</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
