
-- Fix 1: Restrict public order inserts - require valid business_id
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
CREATE POLICY "Public can create orders"
ON public.orders FOR INSERT TO anon
WITH CHECK (
  EXISTS (SELECT 1 FROM public.payment_links WHERE payment_links.business_id = orders.business_id AND payment_links.is_active = true)
);

-- Fix 2: Restrict user_subscriptions INSERT to only allow trial status
DROP POLICY IF EXISTS "Users can create own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can create own subscriptions"
ON public.user_subscriptions FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND status = 'trial'
);

-- Fix 3: Add admin-only SELECT on contact_submissions
CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix 4: Restrict referral codes public view to necessary fields via a more restricted policy
-- (We keep the existing policy but it's acceptable for promo code validation)

-- Fix 5: Update subscription_plans prices: Starter=1500, Growth=3000, Business=5000
UPDATE public.subscription_plans SET price = 1500 WHERE slug = 'starter';
UPDATE public.subscription_plans SET price = 3000 WHERE slug = 'growth';
UPDATE public.subscription_plans SET price = 5000 WHERE slug = 'business';

-- Fix 6: Update billing_period to once-off for bundled plans
UPDATE public.subscription_plans SET billing_period = 'once-off' WHERE slug IN ('starter', 'growth', 'business');

-- Fix 7: Update features for Starter
UPDATE public.subscription_plans SET features = '["3-page website (Home, About, Contact)", "Mobile-responsive design", "WhatsApp chat integration", "Contact form (lead capture)", "Basic SEO setup", "Google Maps integration", "Free .co.za domain (1 year)", "1-year hosting (SSD)", "Free SSL certificate", "5 professional email accounts", "1 revision round", "Email support (48hr response)", "30-day post-launch support"]'::jsonb WHERE slug = 'starter';

-- Fix 8: Update features for Growth
UPDATE public.subscription_plans SET features = '["5-page website (+ Services page)", "Custom design (brand colours & identity)", "WhatsApp + contact & enquiry forms", "Blog/news section (CMS-enabled)", "Full on-page SEO + Google Business setup", "Google Analytics integration", "Social media integration", "Image gallery / portfolio", "Multi-step forms (lead capture)", "Basic customer tracking", "Free .co.za domain (1 year)", "1-year hosting — 10GB SSD", "Free SSL certificate", "20 professional email accounts", "Daily automated backups", "2 revision rounds", "WhatsApp + email support", "60-day post-launch support", "CMS training (30 min)"]'::jsonb WHERE slug = 'growth';

-- Fix 9: Update features for Business
UPDATE public.subscription_plans SET features = '["Up to 10 pages — fully custom designed", "E-commerce store (up to 20 products)", "Product catalog + categories", "Optimized product pages", "Payment gateway integration (Paystack / Flutterwave)", "Secure checkout experience", "Payment link generation", "Order management system", "WhatsApp integration (sales & enquiries)", "Lead capture forms", "Email notifications (orders & enquiries)", "Full SEO (technical + on-page + schema)", "Speed optimisation (Core Web Vitals)", "Free .co.za domain (1 year)", "1-year hosting — 20GB SSD", "Free SSL certificate", "50 professional email accounts", "Daily backups + malware scanning", "Priority support (WhatsApp + email)", "60-day post-launch support", "CMS training session"]'::jsonb WHERE slug = 'business';
