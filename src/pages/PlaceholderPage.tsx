import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, ArrowRight } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  comingSoon?: boolean;
}

export default function PlaceholderPage({
  title,
  description,
  comingSoon = true,
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-water-100 rounded-full flex items-center justify-center mb-4">
              <Construction className="h-8 w-8 text-water-600" />
            </div>
            <CardTitle className="text-xl">
              {comingSoon ? "Coming Soon" : "Under Development"}
            </CardTitle>
            <CardDescription>
              {comingSoon
                ? "This feature is currently under development and will be available soon."
                : "We are working hard to bring you this feature. Stay tuned for updates!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-500">
              Expected features for this page:
            </div>
            <ul className="text-sm text-left space-y-1 text-gray-600">
              {getExpectedFeatures(title).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-water-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" disabled>
              <Construction className="h-4 w-4 mr-2" />
              In Development
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getExpectedFeatures(title: string): string[] {
  switch (title.toLowerCase()) {
    case "shop management":
      return [
        "View all registered shops",
        "Approve/reject shop applications",
        "Manage shop subscriptions",
        "Monitor shop performance",
        "Send notifications to shops",
      ];
    case "user management":
      return [
        "View all platform users",
        "Manage user roles and permissions",
        "Monitor user activity",
        "Handle user support requests",
        "Export user analytics",
      ];
    case "order management":
      return [
        "View orders across all shops",
        "Monitor order status and trends",
        "Generate order reports",
        "Handle order disputes",
        "Track delivery performance",
      ];
    case "payment management":
      return [
        "View all transactions",
        "Monitor MPESA payments",
        "Generate payment reports",
        "Handle payment disputes",
        "Track commission and fees",
      ];
    case "platform settings":
      return [
        "Configure platform settings",
        "Manage subscription plans",
        "Set commission rates",
        "Configure payment methods",
        "Manage platform notifications",
      ];
    case "customer management":
      return [
        "View customer list",
        "Customer order history",
        "Customer communication",
        "Customer feedback management",
        "Loyalty program management",
      ];
    case "product management":
      return [
        "Manage water products",
        "Set pricing and packages",
        "Inventory management",
        "Product availability",
        "Seasonal pricing",
      ];
    case "delivery management":
      return [
        "Track active deliveries",
        "Manage delivery zones",
        "Assign delivery personnel",
        "Real-time delivery tracking",
        "Delivery performance analytics",
      ];
    case "shop settings":
      return [
        "Update shop information",
        "Manage operating hours",
        "Set delivery zones",
        "Configure pricing",
        "Manage subscription",
      ];
    case "client dashboard":
      return [
        "Browse nearby water shops",
        "Place water orders",
        "Track order status",
        "Payment integration",
        "Order history and reorders",
      ];
    default:
      return [
        "Core functionality",
        "User-friendly interface",
        "Real-time updates",
        "Mobile responsiveness",
        "Data analytics",
      ];
  }
}
