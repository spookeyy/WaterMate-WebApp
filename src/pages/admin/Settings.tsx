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
import {
  Settings,
  Shield,
  CreditCard,
  Bell,
  Mail,
  Database,
  Users,
  DollarSign,
  CheckCircle,
} from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    platformName: "WaterMate",
    platformDescription: "Your reliable water delivery platform",
    supportEmail: "support@watermate.co.ke",
    supportPhone: "+254700000000",

    // Payment Settings
    mpesaShortCode: "174379",
    mpesaPasskey: "Your MPESA Passkey",
    platformCommission: "5",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,

    // Security Settings
    requireEmailVerification: true,
    requirePhoneVerification: true,
    sessionTimeout: "24",
    maxLoginAttempts: "5",

    // Business Settings
    defaultCurrency: "KES",
    defaultTimeZone: "Africa/Nairobi",
    businessHours: "8:00 AM - 6:00 PM",

    // Shop Settings
    autoApproveShops: false,
    maxOperatingZone: "20",
    minOrderAmount: "50",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const updateSetting = (key: string, value: string | boolean) => {
    setSettings((prev) => ({
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="h-8 w-8" />
            Platform Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Configure and manage platform-wide settings
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

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="shops">Shops</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Platform Settings
              </CardTitle>
              <CardDescription>
                Basic platform information and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={settings.platformName}
                    onChange={(e) =>
                      updateSetting("platformName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) =>
                      updateSetting("supportEmail", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="platformDescription">
                  Platform Description
                </Label>
                <Textarea
                  id="platformDescription"
                  value={settings.platformDescription}
                  onChange={(e) =>
                    updateSetting("platformDescription", e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={settings.supportPhone}
                    onChange={(e) =>
                      updateSetting("supportPhone", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select
                    value={settings.defaultCurrency}
                    onValueChange={(value) =>
                      updateSetting("defaultCurrency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Configuration
              </CardTitle>
              <CardDescription>
                Configure MPESA and payment processing settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">
                  MPESA Configuration
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mpesaShortCode">MPESA Short Code</Label>
                    <Input
                      id="mpesaShortCode"
                      value={settings.mpesaShortCode}
                      onChange={(e) =>
                        updateSetting("mpesaShortCode", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="mpesaPasskey">MPESA Passkey</Label>
                    <Input
                      id="mpesaPasskey"
                      type="password"
                      value={settings.mpesaPasskey}
                      onChange={(e) =>
                        updateSetting("mpesaPasskey", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="platformCommission">
                  Platform Commission (%)
                </Label>
                <Input
                  id="platformCommission"
                  type="number"
                  value={settings.platformCommission}
                  onChange={(e) =>
                    updateSetting("platformCommission", e.target.value)
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Percentage commission charged on each transaction
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">
                  Payment Processing
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-settle payments</Label>
                      <p className="text-sm text-gray-600">
                        Automatically transfer funds to shop owners
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable payment refunds</Label>
                      <p className="text-sm text-gray-600">
                        Allow refunds for cancelled orders
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how the platform sends notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-600">
                        Send notifications via email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting("emailNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-green-600" />
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-gray-600">
                        Send notifications via SMS
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting("smsNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-purple-600" />
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-600">
                        Send push notifications to mobile apps
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting("pushNotifications", checked)
                    }
                  />
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-2">
                  Notification Types
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>Order confirmations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>Payment confirmations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>Delivery updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>System alerts</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Configuration
              </CardTitle>
              <CardDescription>
                Platform security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Email Verification</Label>
                    <p className="text-sm text-gray-600">
                      Users must verify their email before using the platform
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) =>
                      updateSetting("requireEmailVerification", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Phone Verification</Label>
                    <p className="text-sm text-gray-600">
                      Users must verify their phone number via OTP
                    </p>
                  </div>
                  <Switch
                    checked={settings.requirePhoneVerification}
                    onCheckedChange={(checked) =>
                      updateSetting("requirePhoneVerification", checked)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (hours)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      updateSetting("sessionTimeout", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) =>
                      updateSetting("maxLoginAttempts", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">
                  ⚠️ Security Alerts
                </h4>
                <p className="text-sm text-red-800">
                  Configure automatic security alerts for suspicious activities
                </p>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>Multiple failed login attempts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>Unusual payment activities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>Admin privilege escalations</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Business Configuration
              </CardTitle>
              <CardDescription>
                Business hours and operational settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultTimeZone">Default Time Zone</Label>
                  <Select
                    value={settings.defaultTimeZone}
                    onValueChange={(value) =>
                      updateSetting("defaultTimeZone", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Nairobi">
                        Africa/Nairobi (EAT)
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Africa/Lagos">
                        Africa/Lagos (WAT)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="businessHours">Business Hours</Label>
                  <Input
                    id="businessHours"
                    value={settings.businessHours}
                    onChange={(e) =>
                      updateSetting("businessHours", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="minOrderAmount">
                  Minimum Order Amount (KES)
                </Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  value={settings.minOrderAmount}
                  onChange={(e) =>
                    updateSetting("minOrderAmount", e.target.value)
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum order amount across all shops
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">
                  Operational Settings
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable 24/7 ordering</Label>
                      <p className="text-sm text-gray-600">
                        Allow orders outside business hours
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-assign delivery slots</Label>
                      <p className="text-sm text-gray-600">
                        Automatically assign delivery time slots
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shop Settings */}
        <TabsContent value="shops">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Shop Management Settings
              </CardTitle>
              <CardDescription>
                Configure shop registration and operational limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-approve new shops</Label>
                  <p className="text-sm text-gray-600">
                    Automatically approve shop registrations
                  </p>
                </div>
                <Switch
                  checked={settings.autoApproveShops}
                  onCheckedChange={(checked) =>
                    updateSetting("autoApproveShops", checked)
                  }
                />
              </div>

              <div>
                <Label htmlFor="maxOperatingZone">
                  Maximum Operating Zone (km)
                </Label>
                <Input
                  id="maxOperatingZone"
                  type="number"
                  value={settings.maxOperatingZone}
                  onChange={(e) =>
                    updateSetting("maxOperatingZone", e.target.value)
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum delivery radius allowed for shops
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-2">
                  Shop Requirements
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>Business license verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>Location verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Water quality certification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Insurance verification</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">
                  Subscription Plans
                </h4>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <Label className="font-medium">Trial Plan</Label>
                    <p className="text-gray-600">7 days free</p>
                    <p className="text-gray-600">Up to 50 orders</p>
                  </div>
                  <div>
                    <Label className="font-medium">Basic Plan</Label>
                    <p className="text-gray-600">KES 2,500/month</p>
                    <p className="text-gray-600">Up to 200 orders</p>
                  </div>
                  <div>
                    <Label className="font-medium">Premier Plan</Label>
                    <p className="text-gray-600">KES 5,000/month</p>
                    <p className="text-gray-600">Unlimited orders</p>
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
