import { useState } from "react";
import { Globe, Loader2, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { firecrawlApi } from "@/lib/api/firecrawl";
import { supabase } from "@/integrations/supabase/client";

interface ScrapedProduct {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
}

const WebsiteScraper = ({ businessId, onProductsScraped }: { businessId?: string; onProductsScraped?: (products: ScrapedProduct[]) => void }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scraped, setScraped] = useState(false);
  const [scrapedProducts, setScrapedProducts] = useState<ScrapedProduct[]>([]);
  const { toast } = useToast();

  const extractProducts = (markdown: string): ScrapedProduct[] => {
    const products: ScrapedProduct[] = [];
    const lines = markdown.split("\n");
    let currentProduct: Partial<ScrapedProduct> = {};

    for (const line of lines) {
      const priceMatch = line.match(/[R$€£]\s?[\d,]+\.?\d*/);
      const nameMatch = line.match(/^#{1,3}\s+(.+)/);

      if (nameMatch) {
        if (currentProduct.name && currentProduct.price) {
          products.push({
            name: currentProduct.name,
            price: currentProduct.price,
            description: currentProduct.description || "",
            imageUrl: currentProduct.imageUrl || "",
          });
        }
        currentProduct = { name: nameMatch[1].trim() };
      }

      if (priceMatch && currentProduct.name) {
        currentProduct.price = priceMatch[0];
      }

      const imgMatch = line.match(/!\[.*?\]\((.*?)\)/);
      if (imgMatch && currentProduct.name) {
        currentProduct.imageUrl = imgMatch[1];
      }

      if (currentProduct.name && !currentProduct.description && !nameMatch && !priceMatch && line.trim().length > 10) {
        currentProduct.description = line.trim().substring(0, 200);
      }
    }

    if (currentProduct.name && currentProduct.price) {
      products.push({
        name: currentProduct.name,
        price: currentProduct.price,
        description: currentProduct.description || "",
        imageUrl: currentProduct.imageUrl || "",
      });
    }

    return products;
  };

  const handleScrape = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setScraped(false);
    setScrapedProducts([]);

    try {
      const response = await firecrawlApi.scrape(url, {
        formats: ["markdown"],
        onlyMainContent: true,
      });

      if (!response.success) {
        toast({
          title: "Scraping Failed",
          description: response.error || "Could not scrape the website. Please check the URL and try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const markdown = response.data?.markdown || response.data?.data?.markdown || "";
      const products = extractProducts(markdown);

      if (products.length === 0) {
        toast({
          title: "No Products Found",
          description: "We couldn't detect any products on this page. Try a product listing page URL.",
        });
        setScraped(true);
        setLoading(false);
        return;
      }

      // Save products to database if businessId provided
      if (businessId) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const inserts = products.map((p) => ({
            name: p.name,
            price: parseFloat(p.price.replace(/[^0-9.]/g, "")) || 0,
            description: p.description,
            image_url: p.imageUrl || null,
            business_id: businessId,
            user_id: session.user.id,
            is_active: true,
          }));

          const { error } = await supabase.from("products").insert(inserts);
          if (error) {
            console.error("Error saving products:", error);
            toast({
              title: "Import Partial",
              description: `Found ${products.length} products but some couldn't be saved.`,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Products Imported!",
              description: `Successfully imported ${products.length} products from your website.`,
            });
          }
        }
      }

      setScrapedProducts(products);
      setScraped(true);
      onProductsScraped?.(products);
    } catch (error: any) {
      console.error("Scrape error:", error);
      toast({
        title: "Error",
        description: "Failed to scrape website. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          placeholder="https://yourwebsite.com/products"
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

      {scraped && scrapedProducts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
            <p className="font-body text-xs text-green-500">
              Successfully imported {scrapedProducts.length} product{scrapedProducts.length !== 1 ? "s" : ""} from your website.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {scrapedProducts.slice(0, 4).map((p, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-3 border border-border">
                <p className="font-body text-sm font-medium text-foreground truncate">{p.name}</p>
                <p className="font-body text-xs text-primary font-semibold">{p.price}</p>
              </div>
            ))}
          </div>
          {scrapedProducts.length > 4 && (
            <p className="font-body text-xs text-muted-foreground">+ {scrapedProducts.length - 4} more products imported</p>
          )}
        </div>
      )}

      {scraped && scrapedProducts.length === 0 && (
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
          <p className="font-body text-xs text-yellow-500">
            No products detected. Try pointing to a product listing or catalogue page.
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
