import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, Layout, ShoppingCart, Calendar, Palette, Smartphone, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const features = [
  { icon: Layout, label: "Landing Pages", description: "Create beautiful landing pages to showcase your business and capture leads" },
  { icon: ShoppingCart, label: "Online Store", description: "Set up a full e-commerce store with product listings, cart, and checkout" },
  { icon: Calendar, label: "Booking Pages", description: "Let customers book services directly from your website with calendar integration" },
  { icon: Palette, label: "Custom Themes", description: "Choose from professionally designed templates and customise colours, fonts, and layout" },
  { icon: Smartphone, label: "Mobile Optimised", description: "All pages are responsive and optimised for mobile devices out of the box" },
  { icon: Globe, label: "Custom Domain", description: "Connect your own domain or use a free Holaweb subdomain for your business" },
];

// QuickStart form states
const TOTAL_STEPS = 5;
const sectionTitles = ["Website Discovery Form", "Structure & Features", "Visual Identity", "References", "Practical"];
const goalOptions = ["Generate leads", "Sell products/services", "Build brand credibility", "Launch a new business", "Community / platform"];
const b2bOptions = ["B2B", "B2C", "Both"];
const pageOptions = ["Home", "About", "Services / Products", "Portfolio / Case studies", "Shop", "Contact"];
const logoOptions = ["Yes, final", "Open to refinement", "Needs redesign", "No logo yet"];
const imageryOptions = ["Real photography", "Stock photos", "Illustrations", "3D graphics", "AI-generated visuals", "No preference"];
const budgetOptions = ["Under $1k", "$1k – $3k", "$3k – $5k", "$5k – $50k", "Not sure yet"];

interface FormData {
  companyName: string; contactPerson: string; email: string; industryType: string; currentWebsite: string;
  primaryGoals: string[]; primaryGoalOther: string; mainAction: string; targetAudience: string; b2bOrB2c: string;
  geographicMarket: string; pagesNeeded: string[]; pagesNeededOther: string; logoFinal: string;
  imageryPreferences: string[]; websitesYouLike: string; competitorWebsites: string; launchDate: string;
  budgetRange: string; decisionMaker: string; anythingElse: string;
}

const initialFormData: FormData = {
  companyName: "", contactPerson: "", email: "", industryType: "", currentWebsite: "",
  primaryGoals: [], primaryGoalOther: "", mainAction: "", targetAudience: "", b2bOrB2c: "",
  geographicMarket: "", pagesNeeded: [], pagesNeededOther: "", logoFinal: "",
  imageryPreferences: [], websitesYouLike: "", competitorWebsites: "", launchDate: "",
  budgetRange: "", decisionMaker: "", anythingElse: "",
};

const Website = () => {
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const update = (field: keyof FormData, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleCheckbox = (field: "primaryGoals" | "pagesNeeded" | "imageryPreferences", value: string, max?: number) => {
    setFormData((prev) => {
      const arr = prev[field] as string[];
      if (arr.includes(value)) return { ...prev, [field]: arr.filter((v) => v !== value) };
      if (max && arr.length >= max) return prev;
      return { ...prev, [field]: [...arr, value] };
    });
  };

  const progress = (step / TOTAL_STEPS) * 100;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("submit-quick-start", { body: formData });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Success!", description: "Your website discovery form has been submitted." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full bg-muted border border-border rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors";
  const textareaClass = `${inputClass} min-h-[100px] resize-y`;
  const labelClass = "block font-body text-sm font-medium text-foreground mb-2";

  const CheckboxGroup = ({ options, field, max }: { options: string[]; field: "primaryGoals" | "pagesNeeded" | "imageryPreferences"; max?: number }) => (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleCheckbox(field, opt, max)}>
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${(formData[field] as string[]).includes(opt) ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"}`}>
            {(formData[field] as string[]).includes(opt) && <span className="text-primary-foreground text-xs">✓</span>}
          </div>
          <span className="font-body text-sm text-foreground/80">{opt}</span>
        </label>
      ))}
    </div>
  );

  const RadioGroup = ({ options, field }: { options: string[]; field: keyof FormData }) => (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer group" onClick={() => update(field, opt)}>
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${formData[field] === opt ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"}`}>
            {formData[field] === opt && <span className="text-primary-foreground text-xs">✓</span>}
          </div>
          <span className="font-body text-sm text-foreground/80">{opt}</span>
        </label>
      ))}
    </div>
  );

  if (submitted) {
    return (
      <div className="space-y-6 text-center py-12">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Thank You!</h2>
        <p className="font-body text-muted-foreground max-w-md mx-auto">Your Website Discovery Form has been submitted. We'll get back to you shortly.</p>
        <button onClick={() => { setSubmitted(false); setShowForm(false); setStep(1); setFormData(initialFormData); }} className="btn-cherry rounded-lg px-6 py-3 font-subheading text-sm font-semibold">Back to Website</button>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-foreground">Website Discovery Form</h1>
          <button onClick={() => setShowForm(false)} className="font-body text-sm text-muted-foreground hover:text-foreground">← Back</button>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-subheading text-xs font-semibold text-primary uppercase">Section {step} of {TOTAL_STEPS}</span>
            <span className="font-body text-xs text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <h2 className="font-heading text-lg font-bold text-foreground">{sectionTitles[step - 1]}</h2>

        {step === 1 && (
          <div className="space-y-4">
            <div><label className={labelClass}>Company Name *</label><input className={inputClass} value={formData.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="Your company name" /></div>
            <div><label className={labelClass}>Contact Person *</label><input className={inputClass} value={formData.contactPerson} onChange={(e) => update("contactPerson", e.target.value)} placeholder="Full name" /></div>
            <div><label className={labelClass}>Email *</label><input className={inputClass} type="email" value={formData.email} onChange={(e) => update("email", e.target.value)} placeholder="email@example.com" /></div>
            <div><label className={labelClass}>Industry *</label><input className={inputClass} value={formData.industryType} onChange={(e) => update("industryType", e.target.value)} placeholder="e.g. Fintech, Restaurant" /></div>
            <div><label className={labelClass}>Current Website</label><input className={inputClass} value={formData.currentWebsite} onChange={(e) => update("currentWebsite", e.target.value)} placeholder="https://..." /></div>
            <div><label className={labelClass}>Primary Goals (max 2) *</label><CheckboxGroup options={goalOptions} field="primaryGoals" max={2} /></div>
            <div><label className={labelClass}>Main Action *</label><input className={inputClass} value={formData.mainAction} onChange={(e) => update("mainAction", e.target.value)} placeholder="e.g. Book a call, Buy now" /></div>
            <div><label className={labelClass}>Target Audience *</label><textarea className={textareaClass} value={formData.targetAudience} onChange={(e) => update("targetAudience", e.target.value)} placeholder="Describe your ideal customer..." /></div>
            <div><label className={labelClass}>B2B or B2C? *</label><RadioGroup options={b2bOptions} field="b2bOrB2c" /></div>
            <div><label className={labelClass}>Geographic Market *</label><input className={inputClass} value={formData.geographicMarket} onChange={(e) => update("geographicMarket", e.target.value)} placeholder="e.g. South Africa, Global" /></div>
          </div>
        )}
        {step === 2 && (<div><label className={labelClass}>Pages Needed *</label><CheckboxGroup options={pageOptions} field="pagesNeeded" /></div>)}
        {step === 3 && (
          <div className="space-y-4">
            <div><label className={labelClass}>Logo Status</label><RadioGroup options={logoOptions} field="logoFinal" /></div>
            <div><label className={labelClass}>Imagery Preferences *</label><CheckboxGroup options={imageryOptions} field="imageryPreferences" /></div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <div><label className={labelClass}>Websites You Like *</label><textarea className={textareaClass} value={formData.websitesYouLike} onChange={(e) => update("websitesYouLike", e.target.value)} placeholder="Share 2–3 URLs..." /></div>
            <div><label className={labelClass}>Competitor Websites</label><textarea className={textareaClass} value={formData.competitorWebsites} onChange={(e) => update("competitorWebsites", e.target.value)} placeholder="Competitor URLs..." /></div>
          </div>
        )}
        {step === 5 && (
          <div className="space-y-4">
            <div><label className={labelClass}>Launch Date *</label><input className={inputClass} type="date" value={formData.launchDate} onChange={(e) => update("launchDate", e.target.value)} /></div>
            <div><label className={labelClass}>Budget Range *</label><RadioGroup options={budgetOptions} field="budgetRange" /></div>
            <div><label className={labelClass}>Decision Maker *</label><input className={inputClass} value={formData.decisionMaker} onChange={(e) => update("decisionMaker", e.target.value)} placeholder="Name" /></div>
            <div><label className={labelClass}>Anything Else?</label><textarea className={textareaClass} value={formData.anythingElse} onChange={(e) => update("anythingElse", e.target.value)} placeholder="Additional context..." /></div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button onClick={() => setStep((s) => s - 1)} disabled={step === 1} className={`font-subheading text-sm font-medium ${step === 1 ? "text-muted-foreground" : "text-foreground hover:text-primary"}`}>← Back</button>
          {step < TOTAL_STEPS ? (
            <button onClick={() => setStep((s) => s + 1)} className="btn-cherry rounded-lg px-6 py-2.5 font-subheading text-sm font-semibold">Next →</button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="btn-cherry rounded-lg px-6 py-2.5 font-subheading text-sm font-semibold disabled:opacity-50">{submitting ? "Submitting..." : "Submit"}</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Custom Websites</h1>
        <p className="font-body text-sm text-muted-foreground">Get affordable, interactive, responsive websites custom built to your liking.</p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div key={feature.label} className="bg-card border border-border rounded-lg p-5 space-y-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <feature.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-subheading text-sm font-semibold text-foreground">{feature.label}</h3>
              <p className="font-body text-xs text-muted-foreground mt-1">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Globe className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="font-heading text-lg font-bold text-foreground mb-2">Start Building Your Website</h3>
        <p className="font-body text-sm text-muted-foreground max-w-md mx-auto mb-6">
          From e-commerce sites to corporate-grade platforms — tell us what you need and we'll build it for you. Affordable, fast, and tailored to your brand.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="btn-cherry inline-flex items-center gap-2 rounded-lg px-8 py-3 font-subheading text-sm font-semibold shadow-lg"
        >
          Start Building Now <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Website;
