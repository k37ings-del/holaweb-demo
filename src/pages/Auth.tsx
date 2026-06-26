import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/HW_Logo.png";
import authBg from "@/assets/auth-bg.png";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });
    authService.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "reset") {
        await authService.resetPasswordForEmail(email);
        toast({
          title: "Check your email",
          description: "We've sent you a password reset link.",
        });
        setMode("login");
      } else if (mode === "login") {
        await authService.signInWithPassword(email, password);
        toast({ title: "Welcome back!", description: "You've been signed in." });
      } else {
        await authService.signUp(email, password, {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        });
        toast({
          title: "Check your email",
          description: "We've sent you a verification link to confirm your account.",
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
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            {mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password"}
          </h1>
          <p className="font-body text-muted-foreground text-sm">
            {mode === "login"
              ? "Sign in to your Business OS"
              : mode === "signup"
              ? "Start building your business today"
              : "Enter your email to receive a reset link"}
          </p>
        </div>

        <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-lg p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
            {mode === "signup" && (
              <div>
                <label className="block font-body text-sm text-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-muted/50 backdrop-blur border border-border rounded-lg px-4 py-3 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label className="block font-body text-sm text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-muted/50 backdrop-blur border border-border rounded-lg px-4 py-3 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            {mode !== "reset" && (
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
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("reset")}
                    className="font-body text-xs text-primary hover:underline mt-1.5"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cherry rounded-lg px-4 py-3 font-subheading text-sm font-semibold disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : mode === "signup"
                ? "Create Account"
                : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            {mode === "reset" ? (
              <button
                onClick={() => setMode("login")}
                className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Back to <span className="text-primary font-medium">Sign in</span>
              </button>
            ) : (
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <span className="text-primary font-medium">
                  {mode === "login" ? "Sign up" : "Sign in"}
                </span>
              </button>
            )}
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

export default Auth;
