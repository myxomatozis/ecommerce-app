import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  LogOut,
  Eye,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Badge, toast } from "@thefolk/ui";

const APP_CONFIG = {
  NAME: "The Folk",
  DOMAIN: "thefolkproject.com",
};

export const AdminLayout = () => {
  const { adminUser, signOut, isSuperAdmin } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: Package },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    ...(isSuperAdmin
      ? [
          { name: "Admin Users", href: "/users", icon: Users },
          { name: "Settings", href: "/settings", icon: Settings },
        ]
      : []),
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
      console.error("Sign out error:", error);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="h-screen flex bg-neutral-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <Link to="/" className="text-xl font-medium text-neutral-900">
              {APP_CONFIG.NAME}
            </Link>
            <Badge variant="secondary" size="sm">
              Admin
            </Badge>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info and actions */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-neutral-600">
                  {adminUser?.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {adminUser?.email}
                </p>
                <Badge
                  variant={
                    adminUser?.role === "super_admin" ? "primary" : "secondary"
                  }
                  size="sm"
                >
                  {adminUser?.role.replace("_", " ")}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                as="a"
                href={`https://${APP_CONFIG.DOMAIN}`}
                rel="noopener noreferrer"
                variant="ghost"
                size="sm"
                fullWidth
                leftIcon={<Eye size={16} />}
                className="justify-start"
              >
                View Store
              </Button>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                fullWidth
                leftIcon={<LogOut size={16} />}
                className="justify-start"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:pl-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-neutral-200">
          <h1 className="text-lg font-medium text-neutral-900">
            {APP_CONFIG.NAME} Admin
          </h1>
          <Button
            onClick={() => setSidebarOpen(true)}
            variant="ghost"
            size="sm"
          >
            <Menu size={20} />
          </Button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
