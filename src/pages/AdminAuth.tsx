import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { authService, adminService } from "@/services";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/HW_Logo.png";
import authBg from "@/assets/auth-bg.png";

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAndRedirect = async (userId: string) => {
      const isAdmin = await adminService.checkIsAdmin(userId);

      if (isAdmin) {
        navigate("/admin/dashboard", { replace: true });
      }
    };

    authService.getSession().then(({ data: { session } }) => {
      if (session) checkAdminAndRedirect(session.user.id);
    });

    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setTimeout(() => checkAdminAndRedirect(session.user.id), 300);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: isAllowed } = await supabase.rpc("check_admin_email", { _email: email });

      if (!isAllowed) {
        toast({
          title: "Access Denied",
          description: "This email is not authorized for admin access.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (isLogin) {
        let { data, error } = await authService.signInWithPassword(email, password);

        // First-time super-admin: user may not exist yet in auth.users.
        // Bootstrap it via the edge function, then retry sign-in once.
        if (error && /invalid|credentials|not.*confirmed/i.test(error.message)) {
          const { error: bootErr } = await supabase.functions.invoke("bootstrap-admin-user", {
            body: { email },
          });
          if (!bootErr) {
            const retry = await authService.signInWithPassword(email, password);
            data = retry.data;
            error = retry.error;
          }
        }
        if (error) throw error;

        const isAdmin = await adminService.checkIsAdmin(data.user.id);
        if (!isAdmin) {
          await supabase.from("user_roles").insert({
            user_id: data.user.id,
            role: "admin",
          });
        }

        toast({ title: "Welcome, Admin!", description: "You've been signed in to the admin panel." });
        navigate("/admin/dashboard", { replace: true });
      } else {
        await authService.signUp(email, password, {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin + "/admin",
        });
        toast({
          title: "Check your email",
          description: "We've sent you a verification link. After verifying, sign in to access the admin panel.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Background image */}
      <img src={authBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <img src={logo} alt="Holaweb" className="h-10 mx-auto" />
          </Link>
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary font-subheading text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            <Shield className="w-3.5 h-3.5" />
            Admin Portal
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            {isLogin ? "Admin Sign In" : "Admin Registration"}
          </h1>
          <p className="font-body text-muted-foreground text-sm">
            {isLogin
              ? "Access the Holaweb admin dashboard"
              : "Register as an authorized administrator"}
          </p>
        </div>

        <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-lg p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
            {!isLogin && (
              <div>
                <label className="block font-body text-sm text-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  className="w-full bg-muted/50 backdrop-blur border border-border rounded-lg px-4 py-3 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label className="block font-body text-sm text-foreground mb-1.5">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-muted/50 backdrop-blur border border-border rounded-lg px-4 py-3 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="you@yourdomain.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block font-body text-sm text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-muted/50 backdrop-blur border border-border rounded-lg px-4 py-3 pr-12 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="font-body text-xs text-muted-foreground mt-1">
                Default password: 1234567 — change after first login
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cherry rounded-lg px-4 py-3 font-subheading text-sm font-semibold disabled:opacity-50"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In as Admin" : "Register as Admin"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? "Need admin access? " : "Already registered? "}
              <span className="text-primary font-medium">
                {isLogin ? "Register" : "Sign in"}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAuth;
