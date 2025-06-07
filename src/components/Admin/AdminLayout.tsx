import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Menu,
  LogOut,
  Plus,
  Eye,
  Settings,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Badge } from "@/components/UI";
import { toast } from "@/utils/toast";

export const AdminLayout: React.FC = () => {
  const { adminUser, signOut, isSuperAdmin } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Only include pages that actually exist
  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      available: true,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
      available: true,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      available: true,
    },
    // Disabled pages - coming soon
    {
      name: "Categories",
      href: "/admin/categories",
      icon: Settings,
      available: false,
      comingSoon: true,
    },
    ...(isSuperAdmin
      ? [
          {
            name: "Admin Users",
            href: "/admin/users",
            icon: Users,
            available: false,
            comingSoon: true,
          },
          {
            name: "Settings",
            href: "/admin/settings",
            icon: Settings,
            available: false,
            comingSoon: true,
          },
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
    if (href === "/admin") {
      return location.pathname === "/admin";
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

      {/* Sidebar - Fixed on all screen sizes */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <Link
              to="/"
              className="text-xl font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
            >
              The Folk
            </Link>
            <Badge
              variant="minimal"
              size="sm"
              className="bg-neutral-100 text-neutral-600"
            >
              Admin
            </Badge>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-neutral-100">
            <div className="grid grid-cols-2 gap-2">
              <Button
                as={Link}
                to="/admin/products/new"
                variant="ghost"
                size="sm"
                leftIcon={<Plus size={14} />}
                className="justify-start text-xs"
                onClick={() => setSidebarOpen(false)}
              >
                Add Product
              </Button>
              <Button
                as={Link}
                to="/"
                variant="ghost"
                size="sm"
                leftIcon={<Eye size={14} />}
                className="justify-start text-xs"
                onClick={() => setSidebarOpen(false)}
              >
                View Store
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;

              if (!item.available) {
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg text-neutral-400 cursor-not-allowed"
                  >
                    <div className="flex items-center">
                      <Icon size={20} className="mr-3" />
                      {item.name}
                    </div>
                    {item.comingSoon && (
                      <Badge
                        variant="minimal"
                        size="xs"
                        className="text-neutral-400"
                      >
                        Soon
                      </Badge>
                    )}
                  </div>
                );
              }

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

          {/* User info and logout */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-neutral-600">
                    {adminUser?.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {adminUser?.email.split("@")[0]}
                  </p>
                  <p className="text-xs text-neutral-500 capitalize">
                    {adminUser?.role.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                fullWidth
                leftIcon={<LogOut size={16} />}
                className="justify-start text-neutral-600"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - Properly offset for fixed sidebar */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-medium text-neutral-900">
              The Folk Admin
            </h1>
            <Badge variant="minimal" size="sm">
              {adminUser?.role.replace("_", " ")}
            </Badge>
          </div>
          <Button
            onClick={() => setSidebarOpen(true)}
            variant="ghost"
            size="sm"
            className="lg:hidden"
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
