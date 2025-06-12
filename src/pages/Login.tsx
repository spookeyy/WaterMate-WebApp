import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Phone, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Login() {
  const [phone, setPhone] = useState("+254");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");

  const { login, verifyOtp, isLoading, isAuthenticated, user } = useAuthStore();

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "shop":
        return <Navigate to="/shop" replace />;
      case "client":
        return <Navigate to="/client" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    const result = await login(phone);

    if (result.success && result.requiresOtp) {
      setShowOtp(true);
    } else if (result.success && result.user) {
      // Direct login successful
    } else {
      setError("Phone number not found. Please check and try again.");
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    const result = await verifyOtp(phone, otp);

    if (!result.success) {
      setError("Invalid OTP. Please try again.");
    }
  };

  const demoAccounts = [
    {
      role: "Admin",
      phone: "+254700000001",
      description: "Full platform management",
    },
    {
      role: "Shop Owner",
      phone: "+254700000002",
      description: "Manage orders and deliveries",
    },
    {
      role: "Client",
      phone: "+254700000004",
      description: "Place water orders",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-water-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo size="xl" className="justify-center mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to WaterMate
          </h1>
          <p className="text-gray-600">Your reliable water delivery platform</p>
        </div>

        {/* Main Card */}
        <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {showOtp ? "Verify OTP" : "Sign In"}
            </CardTitle>
            <CardDescription className="text-center">
              {showOtp
                ? "Enter the 4-digit code sent to your phone"
                : "Enter your phone number to continue"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!showOtp ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+254700000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-water-600 hover:bg-water-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP Code</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 4-digit code"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      className="pl-10 text-center text-lg tracking-widest"
                      maxLength={4}
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500">OTP sent to {phone}</p>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full bg-water-600 hover:bg-water-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setShowOtp(false);
                      setOtp("");
                      setError("");
                    }}
                  >
                    Back to Phone Number
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="mt-6 backdrop-blur-sm bg-white/90">
          <CardHeader>
            <CardTitle className="text-lg">Demo Accounts</CardTitle>
            <CardDescription>
              Use these accounts to explore different user roles. Any 4-digit
              OTP works.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                  "hover:bg-gray-50 hover:border-water-200",
                )}
                onClick={() => setPhone(account.phone)}
              >
                <div>
                  <div className="font-medium text-sm">{account.role}</div>
                  <div className="text-xs text-gray-500">
                    {account.description}
                  </div>
                </div>
                <div className="text-sm font-mono text-gray-600">
                  {account.phone}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
