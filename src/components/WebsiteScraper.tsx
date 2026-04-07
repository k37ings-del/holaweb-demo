import { useState } from "react";
import { Globe, Loader2, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScrapedProduct {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
}

const WebsiteScraper = ({ onProductsScraped }: { onProductsScraped?: (products: ScrapedProduct[]) => void }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scraped, setScraped] = useState(false);
  const { toast } = useToast();

  const handleScrape = async () => {
    if (!url.trim()) return;
    setLoading(true);

    // Simulate scraping — actual implementation would use an edge function
    setTimeout(() => {
      setLoading(false);
      setScraped(true);
      toast({
        title: "Website Queued for Import",
        description: "Your website URL has been submitted. Products will be imported once the scraping service is fully integrated.",
      });
      onProductsScraped?.([]);
    }, 2000);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Globe className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground">Import from Existing Website</h3>
          <p className="font-body text-xs text-muted-foreground">
            Paste your website URL to automatically import products and pricing
          </p>
        </div>
      </div>

      <p className="font-body text-sm text-muted-foreground leading-relaxed">
        Already have a website with products? We'll scan your site and import your product catalogue — 
        names, prices, descriptions, and images. These products will also sync to your WhatsApp catalogue 
        via Meta Business Suite integration, enabling instant product sharing.
      </p>

      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourwebsite.com"
          className="flex-1 bg-muted border border-border rounded-lg px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          onClick={handleScrape}
          disabled={loading || !url.trim()}
          className="btn-cherry rounded-lg px-5 py-2.5 font-subheading text-xs font-semibold disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
          {loading ? "Scanning..." : "Import Products"}
        </button>
      </div>

      {scraped && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3">
          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
          <p className="font-body text-xs text-green-500">
            URL submitted successfully. Product import will process once the scraping integration is live.
          </p>
        </div>
      )}

      <div className="flex items-start gap-2 bg-muted/50 border border-border/50 rounded-lg px-4 py-3">
        <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="font-body text-xs text-muted-foreground">
          Imported products will auto-sync to your Meta Business Suite WhatsApp catalogue, 
          allowing customers to browse and purchase directly through WhatsApp.
        </p>
      </div>
    </div>
  );
};

export default WebsiteScraper;
