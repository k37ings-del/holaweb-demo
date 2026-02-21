import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TOTAL_STEPS = 5;

const sectionTitles = [
  "Website Discovery Form",
  "Structure & Features",
  "Visual Identity",
  "References",
  "Practical",
];

const goalOptions = [
  "Generate leads",
  "Sell products/services",
  "Build brand credibility",
  "Launch a new business",
  "Community / platform",
];

const b2bOptions = ["B2B", "B2C", "Both"];

const pageOptions = [
  "Home",
  "About",
  "Services / Products",
  "Portfolio / Case studies",
  "Shop",
  "Contact",
];

const logoOptions = ["Yes, final", "Open to refinement", "Needs redesign", "No logo yet"];

const imageryOptions = [
  "Real photography",
  "Stock photos",
  "Illustrations",
  "3D graphics",
  "AI-generated visuals",
  "No preference",
];

const budgetOptions = [
  "Under $1k",
  "$1k – $3k",
  "$3k – $5k",
  "$5k – $50k",
  "Not sure yet",
];

interface FormData {
  companyName: string;
  contactPerson: string;
  email: string;
  industryType: string;
  currentWebsite: string;
  primaryGoals: string[];
  primaryGoalOther: string;
  mainAction: string;
  targetAudience: string;
  b2bOrB2c: string;
  geographicMarket: string;
  pagesNeeded: string[];
  pagesNeededOther: string;
  logoFinal: string;
  imageryPreferences: string[];
  websitesYouLike: string;
  competitorWebsites: string;
  launchDate: string;
  budgetRange: string;
  decisionMaker: string;
  anythingElse: string;
}

const initialFormData: FormData = {
  companyName: "",
  contactPerson: "",
  email: "",
  industryType: "",
  currentWebsite: "",
  primaryGoals: [],
  primaryGoalOther: "",
  mainAction: "",
  targetAudience: "",
  b2bOrB2c: "",
  geographicMarket: "",
  pagesNeeded: [],
  pagesNeededOther: "",
  logoFinal: "",
  imageryPreferences: [],
  websitesYouLike: "",
  competitorWebsites: "",
  launchDate: "",
  budgetRange: "",
  decisionMaker: "",
  anythingElse: "",
};

const QuickStart = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const update = (field: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleCheckbox = (field: "primaryGoals" | "pagesNeeded" | "imageryPreferences", value: string, max?: number) => {
    setFormData((prev) => {
      const arr = prev[field] as string[];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter((v) => v !== value) };
      }
      if (max && arr.length >= max) return prev;
      return { ...prev, [field]: [...arr, value] };
    });
  };

  const progress = (step / TOTAL_STEPS) * 100;

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.companyName && formData.contactPerson && formData.email && formData.industryType && formData.primaryGoals.length > 0 && formData.mainAction && formData.targetAudience && formData.b2bOrB2c && formData.geographicMarket;
      case 2:
        return formData.pagesNeeded.length > 0;
      case 3:
        return formData.imageryPreferences.length > 0;
      case 4:
        return formData.websitesYouLike;
      case 5:
        return formData.launchDate && formData.budgetRange && formData.decisionMaker;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-quick-start", {
        body: formData,
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Success!", description: "Your form has been submitted successfully." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-36 pb-24 flex flex-col items-center justify-center text-center px-6">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Thank You!</h1>
          <p className="font-body text-foreground/70 max-w-md mb-8">
            Your Website Discovery Form has been submitted successfully. We'll review your details and get back to you shortly.
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn-cherry inline-flex items-center rounded-lg px-8 py-4 font-subheading text-sm font-semibold shadow-lg"
          >
            Back to Home
            <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const inputClass =
    "w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors";
  const textareaClass = `${inputClass} min-h-[100px] resize-y`;
  const labelClass = "block font-body text-sm font-medium text-foreground mb-2";
  const requiredStar = <span className="text-primary ml-0.5">*</span>;

  const CheckboxGroup = ({
    options,
    field,
    otherField,
    max,
  }: {
    options: string[];
    field: "primaryGoals" | "pagesNeeded" | "imageryPreferences";
    otherField?: keyof FormData;
    max?: number;
  }) => (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleCheckbox(field, opt, max)}>
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              (formData[field] as string[]).includes(opt)
                ? "bg-primary border-primary"
                : "border-border group-hover:border-primary/50"
            }`}
          >
            {(formData[field] as string[]).includes(opt) && <Check className="w-3 h-3 text-primary-foreground" />}
          </div>
          <span className="font-body text-sm text-foreground/80">{opt}</span>
        </label>
      ))}
      {otherField && (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 flex-shrink-0" />
          <input
            type="text"
            placeholder="Other..."
            value={formData[otherField] as string}
            onChange={(e) => update(otherField, e.target.value)}
            className="flex-1 bg-transparent border-b border-border px-1 py-1 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
      )}
    </div>
  );

  const RadioGroup = ({
    options,
    field,
  }: {
    options: string[];
    field: keyof FormData;
  }) => (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              formData[field] === opt
                ? "border-primary"
                : "border-border group-hover:border-primary/50"
            }`}
          >
            {formData[field] === opt && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
          </div>
          <span className="font-body text-sm text-foreground/80">{opt}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-36 pb-24">
        <div className="container mx-auto px-6 max-w-2xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="font-subheading text-xs font-semibold text-primary uppercase tracking-wider">
                Section {step} of {TOTAL_STEPS}
              </span>
              <span className="font-body text-xs text-muted-foreground">
                {Math.round(progress)}% complete
              </span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Step indicators */}
            <div className="flex justify-between mt-3">
              {sectionTitles.map((title, i) => (
                <button
                  key={i}
                  onClick={() => i + 1 < step && setStep(i + 1)}
                  className={`text-xs font-body transition-colors ${
                    i + 1 === step
                      ? "text-primary font-medium"
                      : i + 1 < step
                      ? "text-foreground/50 hover:text-primary cursor-pointer"
                      : "text-foreground/25"
                  } hidden md:block`}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>

          {/* Section Title */}
          <div className="mb-8">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-1">
              {sectionTitles[step - 1]}
            </h1>
            {step === 1 && (
              <p className="font-body text-sm text-muted-foreground">
                Please complete all relevant fields. Attach any files (logos, mood boards, screenshots) where requested.
              </p>
            )}
          </div>

          {/* Step 1: Discovery */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Company Name (Official registered or trading name){requiredStar}</label>
                <input className={inputClass} value={formData.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="Your company name" />
              </div>
              <div>
                <label className={labelClass}>Main Contact Person (Person responsible for this project){requiredStar}</label>
                <input className={inputClass} value={formData.contactPerson} onChange={(e) => update("contactPerson", e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <label className={labelClass}>Email Address (Where all project communication will go){requiredStar}</label>
                <input className={inputClass} type="email" value={formData.email} onChange={(e) => update("email", e.target.value)} placeholder="email@example.com" />
              </div>
              <div>
                <label className={labelClass}>Industry / Business Type (e.g. Fintech, Restaurant, Real Estate, SaaS, Media, Education){requiredStar}</label>
                <input className={inputClass} value={formData.industryType} onChange={(e) => update("industryType", e.target.value)} placeholder="Your industry" />
              </div>
              <div>
                <label className={labelClass}>Do you currently have a website? (If yes, paste the link)</label>
                <input className={inputClass} value={formData.currentWebsite} onChange={(e) => update("currentWebsite", e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className={labelClass}>What is the PRIMARY goal of this website? (Choose 2 most important outcomes){requiredStar}</label>
                <CheckboxGroup options={goalOptions} field="primaryGoals" otherField="primaryGoalOther" max={2} />
              </div>
              <div>
                <label className={labelClass}>What is the main action you want users to take? (e.g. Book a call, Buy now, Contact us, Subscribe, Download){requiredStar}</label>
                <input className={inputClass} value={formData.mainAction} onChange={(e) => update("mainAction", e.target.value)} placeholder="Main user action" />
              </div>
              <div>
                <label className={labelClass}>Who is this website for? (Describe your ideal customer in one or two sentences){requiredStar}</label>
                <textarea className={textareaClass} value={formData.targetAudience} onChange={(e) => update("targetAudience", e.target.value)} placeholder="Describe your target audience..." />
              </div>
              <div>
                <label className={labelClass}>Is your business primarily B2B or B2C?{requiredStar}</label>
                <RadioGroup options={b2bOptions} field="b2bOrB2c" />
              </div>
              <div>
                <label className={labelClass}>What geographic market are you targeting? (Local: mention your country, regional, or global){requiredStar}</label>
                <input className={inputClass} value={formData.geographicMarket} onChange={(e) => update("geographicMarket", e.target.value)} placeholder="e.g. South Africa, Global" />
              </div>
            </div>
          )}

          {/* Step 2: Structure & Features */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Which pages do you need? (Select all that apply){requiredStar}</label>
                <CheckboxGroup options={pageOptions} field="pagesNeeded" otherField="pagesNeededOther" />
              </div>
            </div>
          )}

          {/* Step 3: Visual Identity */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Is this logo final?</label>
                <RadioGroup options={logoOptions} field="logoFinal" />
              </div>
              <div>
                <label className={labelClass}>What type of imagery do you prefer? (Select all that apply){requiredStar}</label>
                <CheckboxGroup options={imageryOptions} field="imageryPreferences" />
              </div>
            </div>
          )}

          {/* Step 4: References */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Share 2–3 websites you like (Any industry, purely visual inspiration){requiredStar}</label>
                <textarea className={textareaClass} value={formData.websitesYouLike} onChange={(e) => update("websitesYouLike", e.target.value)} placeholder="Paste website URLs..." />
              </div>
              <div>
                <label className={labelClass}>Share 2–3 competitor websites (If you have any)</label>
                <textarea className={textareaClass} value={formData.competitorWebsites} onChange={(e) => update("competitorWebsites", e.target.value)} placeholder="Paste competitor URLs..." />
              </div>
            </div>
          )}

          {/* Step 5: Practical */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Desired launch date (When would you ideally like to go live?){requiredStar}</label>
                <input className={inputClass} type="date" value={formData.launchDate} onChange={(e) => update("launchDate", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Estimated budget range (This helps us scope correctly){requiredStar}</label>
                <RadioGroup options={budgetOptions} field="budgetRange" />
              </div>
              <div>
                <label className={labelClass}>Who is the final decision maker? (Person who approves designs and scope){requiredStar}</label>
                <input className={inputClass} value={formData.decisionMaker} onChange={(e) => update("decisionMaker", e.target.value)} placeholder="Name" />
              </div>
              <div>
                <label className={labelClass}>Anything else we should know? (Context, constraints, ideas, concerns)</label>
                <textarea className={textareaClass} value={formData.anythingElse} onChange={(e) => update("anythingElse", e.target.value)} placeholder="Share anything relevant..." />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
            <button
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
              className={`inline-flex items-center gap-2 font-subheading text-sm font-medium transition-colors ${
                step === 1 ? "text-muted-foreground cursor-not-allowed" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            {step < TOTAL_STEPS ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className={`btn-cherry inline-flex items-center rounded-lg px-8 py-3 font-subheading text-sm font-semibold shadow-lg ${
                  !canProceed() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || submitting}
                className={`btn-cherry inline-flex items-center rounded-lg px-8 py-3 font-subheading text-sm font-semibold shadow-lg ${
                  !canProceed() || submitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {submitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default QuickStart;
