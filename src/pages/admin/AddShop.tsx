import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SubscriptionPlan } from "@/types";
import {
  Building2,
  MapPin,
  Phone,
  DollarSign,
  Droplets,
  User,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

interface NewShopForm {
  shopName: string;
  ownerName: string;
  ownerPhone: string;
  address: string;
  latitude: string;
  longitude: string;
  pricePerLitre: string;
  minimumOrderLitres: string;
  operatingZone: string;
  subscription: SubscriptionPlan;
  isActive: boolean;
  description: string;
}

export default function AddShop() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<NewShopForm>({
    shopName: "",
    ownerName: "",
    ownerPhone: "+254",
    address: "",
    latitude: "",
    longitude: "",
    pricePerLitre: "5",
    minimumOrderLitres: "10",
    operatingZone: "5",
    subscription: "trial",
    isActive: true,
    description: "",
  });

  const [errors, setErrors] = useState<Partial<NewShopForm>>({});

  const validateForm = () => {
    const newErrors: Partial<NewShopForm> = {};

    if (!formData.shopName.trim()) {
      newErrors.shopName = "Shop name is required";
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required";
    }

    if (!formData.ownerPhone.trim() || formData.ownerPhone.length < 10) {
      newErrors.ownerPhone = "Valid phone number is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.latitude.trim() || isNaN(parseFloat(formData.latitude))) {
      newErrors.latitude = "Valid latitude is required";
    }

    if (!formData.longitude.trim() || isNaN(parseFloat(formData.longitude))) {
      newErrors.longitude = "Valid longitude is required";
    }

    if (
      !formData.pricePerLitre.trim() ||
      parseFloat(formData.pricePerLitre) <= 0
    ) {
      newErrors.pricePerLitre = "Valid price is required";
    }

    if (
      !formData.minimumOrderLitres.trim() ||
      parseInt(formData.minimumOrderLitres) <= 0
    ) {
      newErrors.minimumOrderLitres = "Valid minimum order is required";
    }

    if (
      !formData.operatingZone.trim() ||
      parseInt(formData.operatingZone) <= 0
    ) {
      newErrors.operatingZone = "Valid operating zone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would normally send the data to your backend
      console.log("New shop data:", formData);

      setShowSuccess(true);

      // Redirect after showing success
      setTimeout(() => {
        navigate("/admin/shops");
      }, 2000);
    } catch (error) {
      console.error("Failed to create shop:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (
    field: keyof NewShopForm,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Shop Created Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              {formData.shopName} has been added to the platform and is ready to
              start accepting orders.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting to shops list...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/shops")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shops
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="h-8 w-8" />
            Add New Shop
          </h1>
          <p className="text-gray-600 mt-2">
            Register a new water shop on the WaterMate platform
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Shop Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Shop Information
              </CardTitle>
              <CardDescription>
                Basic details about the water shop
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shopName">Shop Name *</Label>
                <Input
                  id="shopName"
                  value={formData.shopName}
                  onChange={(e) => updateFormData("shopName", e.target.value)}
                  placeholder="e.g., Pure Water Westlands"
                  className={errors.shopName ? "border-red-500" : ""}
                />
                {errors.shopName && (
                  <p className="text-sm text-red-600 mt-1">{errors.shopName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    updateFormData("description", e.target.value)
                  }
                  placeholder="Brief description of the shop and services..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pricePerLitre">Price per Litre (KES) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="pricePerLitre"
                      type="number"
                      step="0.1"
                      value={formData.pricePerLitre}
                      onChange={(e) =>
                        updateFormData("pricePerLitre", e.target.value)
                      }
                      placeholder="5.0"
                      className={`pl-10 ${errors.pricePerLitre ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.pricePerLitre && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.pricePerLitre}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="minimumOrderLitres">
                    Minimum Order (L) *
                  </Label>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="minimumOrderLitres"
                      type="number"
                      value={formData.minimumOrderLitres}
                      onChange={(e) =>
                        updateFormData("minimumOrderLitres", e.target.value)
                      }
                      placeholder="10"
                      className={`pl-10 ${errors.minimumOrderLitres ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.minimumOrderLitres && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.minimumOrderLitres}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="operatingZone">Operating Zone (km) *</Label>
                <Input
                  id="operatingZone"
                  type="number"
                  value={formData.operatingZone}
                  onChange={(e) =>
                    updateFormData("operatingZone", e.target.value)
                  }
                  placeholder="5"
                  className={errors.operatingZone ? "border-red-500" : ""}
                />
                {errors.operatingZone && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.operatingZone}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Delivery radius from shop location
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Owner Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Owner Information
              </CardTitle>
              <CardDescription>Details about the shop owner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ownerName">Owner Name *</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => updateFormData("ownerName", e.target.value)}
                  placeholder="e.g., John Mwangi"
                  className={errors.ownerName ? "border-red-500" : ""}
                />
                {errors.ownerName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.ownerName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="ownerPhone">Owner Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="ownerPhone"
                    type="tel"
                    value={formData.ownerPhone}
                    onChange={(e) =>
                      updateFormData("ownerPhone", e.target.value)
                    }
                    placeholder="+254700000000"
                    className={`pl-10 ${errors.ownerPhone ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.ownerPhone && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.ownerPhone}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="subscription">Subscription Plan</Label>
                <Select
                  value={formData.subscription}
                  onValueChange={(value: SubscriptionPlan) =>
                    updateFormData("subscription", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial (Free - 7 days)</SelectItem>
                    <SelectItem value="basic">
                      Basic (KES 2,500/month)
                    </SelectItem>
                    <SelectItem value="premier">
                      Premier (KES 5,000/month)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    updateFormData("isActive", checked)
                  }
                />
                <Label htmlFor="isActive">Activate shop immediately</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Information
            </CardTitle>
            <CardDescription>
              Physical location and coordinates of the shop
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Physical Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateFormData("address", e.target.value)}
                placeholder="e.g., Westlands Shopping Center, Ralph Bunche Road, Nairobi"
                rows={2}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-sm text-red-600 mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => updateFormData("latitude", e.target.value)}
                  placeholder="-1.2676"
                  className={errors.latitude ? "border-red-500" : ""}
                />
                {errors.latitude && (
                  <p className="text-sm text-red-600 mt-1">{errors.latitude}</p>
                )}
              </div>

              <div>
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => updateFormData("longitude", e.target.value)}
                  placeholder="36.8108"
                  className={errors.longitude ? "border-red-500" : ""}
                />
                {errors.longitude && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.longitude}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">
                💡 Getting Coordinates
              </h4>
              <p className="text-sm text-blue-800">
                You can get accurate coordinates by:
              </p>
              <ul className="text-sm text-blue-800 mt-1 ml-4 list-disc">
                <li>Using Google Maps (right-click on location)</li>
                <li>Using GPS coordinates from a mobile device</li>
                <li>Using online coordinate finder tools</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/shops")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-water-600 hover:bg-water-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Shop...
              </>
            ) : (
              <>
                <Building2 className="h-4 w-4 mr-2" />
                Create Shop
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
