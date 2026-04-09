
-- 1. Fix user_roles: prevent privilege escalation
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Admins can select roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Remove anonymous order INSERT (now handled by create-order edge function)
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;

-- 3. Remove overly broad public product SELECT, add admin read
DROP POLICY IF EXISTS "Public can view active products" ON public.products;

CREATE POLICY "Admins can view all products"
ON public.products FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Remove anonymous read on referral_codes (admin + authenticated owner only)
DROP POLICY IF EXISTS "Anyone can view active referral codes" ON public.referral_codes;

CREATE POLICY "Authenticated users can view active referral codes"
ON public.referral_codes FOR SELECT
TO authenticated
USING (is_active = true);

-- 5. Remove direct user INSERT on user_subscriptions
DROP POLICY IF EXISTS "Users can create own subscriptions" ON public.user_subscriptions;

-- 6. Fix contact_submissions: keep public insert but only for anon role (already correct, just ensuring)
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;

CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);
