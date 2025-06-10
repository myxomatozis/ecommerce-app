import { useState, useEffect } from "react";
import {
  UserPlus,
  Search,
  Users,
  Shield,
  ShieldCheck,
  UserX,
  Mail,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  Button,
  Input,
  Card,
  CardContent,
  Badge,
  Spinner,
  Modal,
  Dropdown,
  toast,
} from "@thefolk/ui";
import AdminAPI, { AdminUser } from "@thefolk/utils/admin";
import { useAdminOperations } from "@/hooks";

const UsersPage = () => {
  const { canManageUsers } = useAdminOperations();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [promoteModal, setPromoteModal] = useState({
    isOpen: false,
    email: "",
    role: "admin",
  });

  useEffect(() => {
    if (canManageUsers) {
      loadUsers();
    }
  }, [canManageUsers]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await AdminAPI.getAllAdminUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading admin users:", error);
      toast.error("Failed to load admin users");
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async () => {
    try {
      await AdminAPI.promoteUserToAdmin(
        promoteModal.email,
        promoteModal.role as "admin" | "super_admin"
      );
      toast.success("User promoted successfully");
      setPromoteModal({ isOpen: false, email: "", role: "admin" });
      loadUsers();
    } catch (error) {
      console.error("Error promoting user:", error);
      toast.error("Failed to promote user");
    }
  };

  const handleUpdateUserRole = async (
    userId: string,
    role: "admin" | "super_admin"
  ) => {
    try {
      await AdminAPI.updateAdminUser(userId, { role });
      toast.success("User role updated successfully");
      loadUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      await AdminAPI.updateAdminUser(userId, { is_active: false });
      toast.success("User deactivated successfully");
      loadUsers();
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast.error("Failed to deactivate user");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!canManageUsers) {
    return (
      <div className="p-8">
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <Shield size={48} className="mx-auto text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                Access Denied
              </h3>
              <p className="text-neutral-600">
                You need super admin privileges to manage users.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-neutral-600">Loading admin users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Admin Users"
        description="Manage admin user roles and permissions"
        action={{
          label: "Promote User",
          onClick: () =>
            setPromoteModal({ isOpen: true, email: "", role: "admin" }),
          icon: <UserPlus size={20} />,
          variant: "primary",
        }}
      />

      <div className="p-6">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <Input
              placeholder="Search admin users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={20} />}
              fullWidth
            />
          </CardContent>
        </Card>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-neutral-400 mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  No admin users found
                </h3>
                <p className="text-neutral-600 mb-6">
                  {searchTerm
                    ? "Try adjusting your search"
                    : "Start by promoting a user to admin"}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() =>
                      setPromoteModal({
                        isOpen: true,
                        email: "",
                        role: "admin",
                      })
                    }
                    variant="primary"
                    leftIcon={<UserPlus size={20} />}
                  >
                    Promote User
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                        {user.role === "super_admin" ? (
                          <ShieldCheck size={20} className="text-blue-600" />
                        ) : (
                          <Shield size={20} className="text-neutral-600" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-neutral-900">
                            {user.email}
                          </h3>
                          <Badge
                            variant={
                              user.role === "super_admin"
                                ? "primary"
                                : "secondary"
                            }
                          >
                            {user.role.replace("_", " ")}
                          </Badge>
                          {!user.is_active && (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Dropdown
                        options={[
                          { value: "admin", label: "Admin" },
                          { value: "super_admin", label: "Super Admin" },
                        ]}
                        value={user.role}
                        onChange={(role) =>
                          handleUpdateUserRole(
                            user.id,
                            role as "admin" | "super_admin"
                          )
                        }
                        placeholder="Change Role"
                      />

                      {user.is_active && (
                        <Button
                          onClick={() => handleDeactivateUser(user.id)}
                          variant="ghost"
                          size="sm"
                          leftIcon={<UserX size={16} />}
                          className="text-red-600 hover:text-red-700"
                        >
                          Deactivate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Promote User Modal */}
        <Modal
          isOpen={promoteModal.isOpen}
          onClose={() =>
            setPromoteModal({ isOpen: false, email: "", role: "admin" })
          }
          title="Promote User to Admin"
        >
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              Promote an existing user to admin. The user must already have an
              account.
            </p>

            <Input
              label="Email Address"
              type="email"
              value={promoteModal.email}
              onChange={(e) =>
                setPromoteModal((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="user@thefolkproject.com"
              leftIcon={<Mail size={20} />}
              fullWidth
              required
            />

            <Dropdown
              label="Role"
              options={[
                { value: "admin", label: "Admin" },
                { value: "super_admin", label: "Super Admin" },
              ]}
              value={promoteModal.role}
              onChange={(role) =>
                setPromoteModal((prev) => ({ ...prev, role }))
              }
              fullWidth
            />

            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button
                onClick={() =>
                  setPromoteModal({ isOpen: false, email: "", role: "admin" })
                }
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePromoteUser}
                variant="primary"
                disabled={!promoteModal.email}
              >
                Promote User
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UsersPage;
