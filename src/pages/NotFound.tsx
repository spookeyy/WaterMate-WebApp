import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Home, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-water-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
      </div>

      <div className="text-center relative">
        {/* Logo */}
        <Logo size="xl" className="justify-center mb-8" />

        {/* 404 Message */}
        <div className="space-y-6">
          <div>
            <h1 className="text-9xl font-bold text-water-600 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Page Not Found
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Oops! The page you're looking for seems to have dried up. Let's
              get you back to the flow of things.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button
              asChild
              className="bg-water-600 hover:bg-water-700 flex items-center gap-2"
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Fun water-themed message */}
          <div className="mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-lg border max-w-md mx-auto">
            <div className="text-water-600 mb-2">💧</div>
            <p className="text-sm text-gray-600">
              "Just like water finds its way, you'll find what you're looking
              for. Try navigating from the main menu or use the search feature."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
