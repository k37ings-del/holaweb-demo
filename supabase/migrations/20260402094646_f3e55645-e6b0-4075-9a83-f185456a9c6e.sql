
-- User roles table (per security guidelines)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin allowed emails table
CREATE TABLE public.admin_allowed_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_pattern TEXT NOT NULL,
  is_domain_pattern BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_allowed_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view allowed emails"
ON public.admin_allowed_emails FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Seed admin allowed emails
INSERT INTO public.admin_allowed_emails (email_pattern, is_domain_pattern) VALUES
  ('k37.ings@gmail.com', false),
  ('holaweb.africa@gmail.com', false),
  ('siya@holaweb.co.za', false),
  ('@holaweb.co.za', true);

-- Subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ZAR',
  billing_period TEXT NOT NULL DEFAULT 'monthly',
  trial_days INTEGER NOT NULL DEFAULT 0,
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  plan_type TEXT NOT NULL DEFAULT 'bundled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active plans"
ON public.subscription_plans FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admins can manage plans"
ON public.subscription_plans FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Seed bundled plans
INSERT INTO public.subscription_plans (name, slug, price, trial_days, features, plan_type) VALUES
  ('Starter', 'starter', 299, 7, '["1 Payment link","Basic website template","Up to 50 customers","WhatsApp sharing","Email support"]', 'bundled'),
  ('Growth', 'growth', 599, 14, '["Unlimited payment links","Full website builder","Unlimited customers","WhatsApp + Email + SMS","Analytics dashboard","Priority support","Custom domain"]', 'bundled'),
  ('Business', 'business', 1499, 0, '["Everything in Growth","Meta Business Suite","Advanced CRM & segmentation","Team collaboration (3 users)","API access","Dedicated onboarding"]', 'bundled'),
  ('Enterprise', 'enterprise', 0, 0, '["Everything in Business","Unlimited team members","Custom integrations","Dedicated account manager","SLA guarantee","White-label options"]', 'bundled');

-- Seed independent service plans
INSERT INTO public.subscription_plans (name, slug, price, trial_days, features, plan_type) VALUES
  ('Custom Websites', 'service-websites', 199, 7, '["Responsive website design","Mobile optimised","Custom domain setup","SSL certificate","Monthly maintenance"]', 'independent'),
  ('Payment Processing', 'service-payments', 149, 7, '["Payment link generator","Checkout pages","Transaction reports","Multi-currency support"]', 'independent'),
  ('CRM & Customer Management', 'service-crm', 199, 7, '["Customer profiles","Tags & segmentation","Purchase history tracking","Notes & engagement logs"]', 'independent'),
  ('Meta Business Solutions', 'service-meta', 349, 0, '["WhatsApp Business API","Facebook & Instagram Ads management","Automated messaging","Audience insights"]', 'independent'),
  ('Cloud & Hosting', 'service-cloud', 249, 0, '["AWS managed hosting","SSL & CDN","Daily backups","99.9% uptime SLA"]', 'independent'),
  ('Analytics & Reporting', 'service-analytics', 149, 7, '["Real-time dashboards","Revenue tracking","Customer insights","Export reports"]', 'independent');

-- User subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'trial',
  trial_started_at TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
ON public.user_subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
ON public.user_subscriptions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions"
ON public.user_subscriptions FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Referral codes table
CREATE TABLE public.referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC NOT NULL DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active referral codes"
ON public.referral_codes FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admins can manage referral codes"
ON public.referral_codes FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Referral usages table
CREATE TABLE public.referral_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code_id UUID REFERENCES public.referral_codes(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  discount_amount NUMERIC NOT NULL DEFAULT 0
);

ALTER TABLE public.referral_usages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referral usages"
ON public.referral_usages FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own referral usages"
ON public.referral_usages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all referral usages"
ON public.referral_usages FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Function to check if email is admin-allowed
CREATE OR REPLACE FUNCTION public.is_admin_email(_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_allowed_emails
    WHERE (is_domain_pattern = false AND email_pattern = _email)
       OR (is_domain_pattern = true AND _email LIKE '%' || email_pattern)
  )
$$;
