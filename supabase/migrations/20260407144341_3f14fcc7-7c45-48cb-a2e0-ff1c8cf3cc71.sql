
-- Allow deleting payment links
CREATE POLICY "Users can delete own payment links"
ON public.payment_links
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add region column to user_subscriptions
ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS region text;

-- Add date range and region to referral_codes
ALTER TABLE public.referral_codes ADD COLUMN IF NOT EXISTS valid_region text;

-- Add RLS for admin to read all businesses
CREATE POLICY "Admins can view all businesses"
ON public.businesses
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add RLS for admin to read all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
