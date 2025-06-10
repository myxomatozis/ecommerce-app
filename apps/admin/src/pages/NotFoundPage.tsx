import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button, Card, CardContent } from "@thefolk/ui";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="text-center py-12">
          <div className="text-6xl font-bold text-neutral-300 mb-4">404</div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-neutral-600 mb-8">
            The admin page you're looking for doesn't exist or has been moved.
          </p>

          <div className="space-y-3">
            <Button
              as={Link}
              to="/"
              variant="primary"
              fullWidth
              leftIcon={<Home size={16} />}
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="ghost"
              fullWidth
              leftIcon={<ArrowLeft size={16} />}
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
