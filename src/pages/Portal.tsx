import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import logo from "@/assets/HW_Logo.png";

/**
 * Standalone MyCoza-backed client login portal.
 * Route: /portal — full-page split layout (brand panel + login form).
 * Credentials are POSTed directly to MyCoza in a new tab; nothing is stored client-side.
 */
const Portal = () => {
  const [errors, setErrors] = useState({ email: false, pass: false });
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  const handleSignIn = () => {
    const emailVal = emailRef.current?.value?.trim() ?? "";
    const passVal = passRef.current?.value ?? "";
    const nextErrors = { email: !emailVal, pass: !passVal };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.pass) return;

    setLoading(true);

    const form = document.createElement("form");
    form.method = "post";
    form.action = "https://www.mycoza.com/clients/dologin.php";
    form.target = "_blank";

    const u = document.createElement("input");
    u.type = "hidden";
    u.name = "username";
    u.value = emailVal;

    const p = document.createElement("input");
    p.type = "hidden";
    p.name = "password";
    p.value = passVal;

    form.appendChild(u);
    form.appendChild(p);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    setTimeout(() => setLoading(false), 3000);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSignIn();
  };

  const inputClass = (hasError: boolean) =>
    `w-full border px-4 py-[11px] text-sm bg-[#fafafa] outline-none transition-all placeholder:text-gray-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(197,40,61,0.12)] ${
      hasError ? "border-[#C5283D] focus:border-[#C5283D]" : "border-[#D1D1D1] focus:border-[#C5283D]"
    }`;

  const features = [
    { icon: "🌐", text: "Domain and DNS management" },
    { icon: "📄", text: "Invoices and billing history" },
    { icon: "🎫", text: "Support tickets and account settings" },
  ];

  return (
    <div
      className="min-h-screen w-full flex flex-col md:flex-row"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* LEFT PANEL — brand */}
      <div className="relative w-full md:w-1/2 bg-black text-white p-8 md:p-12 flex flex-col justify-between overflow-hidden min-h-[300px] md:min-h-screen">
        {/* Subtle geometric overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #FFC857 0, transparent 40%), radial-gradient(circle at 80% 70%, #C5283D 0, transparent 45%), repeating-linear-gradient(45deg, transparent 0 30px, rgba(255,255,255,0.08) 30px 31px)",
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-2">
          <img src={logo} alt="Holaweb" className="h-9" />
        </div>

        {/* Centre content */}
        <div className="relative py-10">
          <h1
            className="text-white mb-4 leading-tight"
            style={{
              fontFamily: "Garet, 'Arial Black', sans-serif",
              fontSize: "36px",
              fontWeight: 800,
            }}
          >
            Your business.
            <br />
            In your hands.
          </h1>
          <p
            className="text-white/70 mb-10 max-w-md"
            style={{ fontSize: "14px", lineHeight: 1.6 }}
          >
            Manage domains, hosting, billing and support from one secure place.
          </p>

          <div className="space-y-4">
            {features.map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="w-9 h-9 flex items-center justify-center bg-white/10 text-lg">
                  {icon}
                </span>
                <span className="text-white text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="relative text-sm text-white/70">
          Not a client yet?{" "}
          <Link
            to="/contact"
            className="font-semibold hover:underline"
            style={{ color: "#FFC857" }}
          >
            Get started →
          </Link>
        </div>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="relative w-full md:w-1/2 bg-white text-[#1B445F] p-8 md:p-12 flex flex-col justify-center min-h-screen">
        {/* Back to site */}
        <Link
          to="/"
          className="absolute top-6 right-8 text-[12px] font-medium hover:opacity-80"
          style={{ color: "#C5283D" }}
        >
          ← Back to site
        </Link>

        <div className="w-full max-w-sm mx-auto">
          <span
            className="inline-block px-3 py-1 text-[10px] font-bold tracking-wider text-white mb-5"
            style={{
              backgroundColor: "#C5283D",
              fontFamily: "'Noto Sans', sans-serif",
            }}
          >
            CLIENT PORTAL
          </span>

          <h2
            className="mb-2"
            style={{
              fontFamily: "Garet, 'Arial Black', sans-serif",
              fontSize: "28px",
              color: "#1B445F",
              fontWeight: 800,
            }}
          >
            Welcome back
          </h2>
          <p className="text-[13px] text-gray-500 mb-8">
            Sign in to your Holaweb account
          </p>

          {loading && (
            <div
              className="mb-5 px-4 py-3 flex items-center gap-3 text-sm"
              style={{ backgroundColor: "#FFC857", color: "#1B445F" }}
            >
              <span className="w-2 h-2 rounded-full bg-[#1B445F] animate-pulse" />
              Redirecting to your portal…
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label
              className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                color: "#1B445F",
              }}
            >
              Email Address
            </label>
            <input
              ref={emailRef}
              type="text"
              placeholder="you@example.com"
              autoComplete="email"
              onKeyDown={onKeyDown}
              className={inputClass(errors.email)}
            />
            {errors.email && (
              <p className="text-[11px] mt-1" style={{ color: "#C5283D" }}>
                Enter your email address
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-2">
            <label
              className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                color: "#1B445F",
              }}
            >
              Password
            </label>
            <input
              ref={passRef}
              type="password"
              name="password"
              autoComplete="off"
              onKeyDown={onKeyDown}
              className={inputClass(errors.pass)}
            />
            {errors.pass && (
              <p className="text-[11px] mt-1" style={{ color: "#C5283D" }}>
                Enter your password
              </p>
            )}
          </div>

          {/* Forgot */}
          <div className="flex justify-end mb-6">
            <a
              href="https://www.mycoza.com/clients/pwreset.php"
              target="_blank"
              rel="noreferrer"
              className="text-[12px] font-medium hover:opacity-70"
              style={{ color: "#C5283D" }}
            >
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            className="w-full text-white text-sm font-bold py-3 transition-colors disabled:opacity-70"
            style={{
              backgroundColor: loading ? "#FFC857" : "#C5283D",
              color: loading ? "#1B445F" : "#ffffff",
              fontFamily: "'Noto Sans', sans-serif",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#1B445F";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#C5283D";
            }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>

          {/* FossBilling / super-admin shortcut */}
          <a
            href="https://client.holaweb.co.za"
            target="_blank"
            rel="noreferrer"
            className="mt-4 w-full inline-flex items-center justify-center gap-2 border py-3 text-sm font-semibold transition-colors"
            style={{ borderColor: "#1B445F", color: "#1B445F" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1B445F";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#1B445F";
            }}
          >
            Super Admin · FOSSBilling
            <ExternalLink className="w-4 h-4" />
          </a>

          <p
            className="mt-6 text-center text-[11px]"
            style={{ color: "#D1D1D1" }}
          >
            🔒 Secured by MyCoza · credentials transmitted directly and securely
          </p>
        </div>

        <p className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-gray-300">
          © {new Date().getFullYear()} Holaweb Media Group · Fourways, Johannesburg
        </p>
      </div>
    </div>
  );
};

export default Portal;
