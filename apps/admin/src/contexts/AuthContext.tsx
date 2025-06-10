import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@thefolk/utils/supabase";
import { AdminAPI, type AdminUser } from "@thefolk/utils/admin";

interface AuthContextType {
  user: User | null;
  adminUser: AdminUser | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAndSetAdminStatus = async (userId: string) => {
    try {
      const adminData = await AdminAPI.checkAdminStatus(userId);
      setAdminUser(adminData);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setAdminUser(null);
    }
  };

  const refreshAdminStatus = async () => {
    if (user?.id) {
      await checkAndSetAdminStatus(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await checkAndSetAdminStatus(session.user.id);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        if (mounted) {
          setAdminUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await checkAndSetAdminStatus(session.user.id);
      } else {
        setAdminUser(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await AdminAPI.signIn(email, password);
      // Auth state change will be handled by the listener
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AdminAPI.signOut();
      setAdminUser(null);
      // Auth state change will be handled by the listener
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const isAdmin = Boolean(adminUser?.is_active);
  const isSuperAdmin = Boolean(
    adminUser?.role === "super_admin" && adminUser?.is_active
  );

  const value: AuthContextType = {
    user,
    adminUser,
    session,
    loading,
    isAdmin,
    isSuperAdmin,
    signIn,
    signOut,
    refreshAdminStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
