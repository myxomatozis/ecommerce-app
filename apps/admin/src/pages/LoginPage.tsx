import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input, Card, CardContent, toast } from "@thefolk/ui";

const APP_CONFIG = {
  NAME: "The Folk",
  DOMAIN: "thefolkproject.com",
};

const LoginPage = () => {
  const { signIn, loading, isAdmin } = useAuth();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  // Redirect if already authenticated
  if (isAdmin && !loading) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    setIsLoading(true);
    try {
      await signIn(formData.email, formData.password);
      toast.success("Signed in successfully");
    } catch (error: any) {
      toast.error("Failed to sign in", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password;

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-light text-neutral-900">
            {APP_CONFIG.NAME}
          </h1>
          <h2 className="mt-6 text-2xl font-light text-neutral-900">
            Admin Sign In
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@thefolkproject.com"
                leftIcon={<Mail size={20} />}
                fullWidth
                required
                autoComplete="email"
              />

              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                leftIcon={<Lock size={20} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
                fullWidth
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={!isFormValid}
                isLoading={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <a
            href={`https://${APP_CONFIG.DOMAIN}`}
            className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            ← Back to store
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
