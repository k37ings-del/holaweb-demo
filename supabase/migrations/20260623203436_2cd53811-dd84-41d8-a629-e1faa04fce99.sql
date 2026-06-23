
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.is_admin_email(_email text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_allowed_emails
    WHERE (is_domain_pattern = false AND email_pattern = _email)
       OR (is_domain_pattern = true AND _email LIKE '%' || email_pattern)
  )
$$;
REVOKE ALL ON FUNCTION private.is_admin_email(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_admin_email(text) TO service_role;

-- Rebuild policies to use private.has_role
DROP POLICY IF EXISTS "Admins can view allowed emails" ON public.admin_allowed_emails;
CREATE POLICY "Admins can view allowed emails" ON public.admin_allowed_emails FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view all businesses" ON public.businesses;
CREATE POLICY "Admins can view all businesses" ON public.businesses FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can view contact submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
CREATE POLICY "Admins can manage all orders" ON public.orders FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin'::public.app_role)) WITH CHECK (private.has_role(auth.uid(),'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
CREATE POLICY "Admins can view all products" ON public.products FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can manage referral codes" ON public.referral_codes;
CREATE POLICY "Admins can manage referral codes" ON public.referral_codes FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin'::public.app_role)) WITH CHECK (private.has_role(auth.uid(),'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view all referral usages" ON public.referral_usages;
CREATE POLICY "Admins can view all referral usages" ON public.referral_usages FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can manage plans" ON public.subscription_plans;
CREATE POLICY "Admins can manage plans" ON public.subscription_plans FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin'::public.app_role)) WITH CHECK (private.has_role(auth.uid(),'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (private.has_role(auth.uid(),'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(),'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can select roles" ON public.user_roles;
CREATE POLICY "Admins can select roles" ON public.user_roles FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (private.has_role(auth.uid(),'admin'::public.app_role)) WITH CHECK (private.has_role(auth.uid(),'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.user_subscriptions;
CREATE POLICY "Admins can manage all subscriptions" ON public.user_subscriptions FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin'::public.app_role)) WITH CHECK (private.has_role(auth.uid(),'admin'::public.app_role));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.is_admin_email(text);

-- Trigger functions: lock down EXECUTE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''));
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.assign_admin_role_on_signup()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF private.is_admin_email(NEW.email) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.assign_admin_role_on_signup() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.assign_admin_role_on_signup() FROM anon, authenticated;

-- payment_links: drop bulk anon read; provide slug-only RPC
DROP POLICY IF EXISTS "Public can view active payment links" ON public.payment_links;
REVOKE SELECT ON public.payment_links FROM anon;

CREATE OR REPLACE FUNCTION public.get_active_payment_link_by_slug(_slug text)
RETURNS TABLE (
  id uuid, business_id uuid, user_id uuid, product_id uuid,
  title text, description text, amount numeric, currency text,
  slug text, is_active boolean, created_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, business_id, user_id, product_id, title, description, amount, currency, slug, is_active, created_at
  FROM public.payment_links WHERE slug = _slug AND is_active = true LIMIT 1
$$;
REVOKE ALL ON FUNCTION public.get_active_payment_link_by_slug(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_active_payment_link_by_slug(text) TO anon, authenticated;

-- referral_codes: drop bulk authenticated read; provide code-only RPC
DROP POLICY IF EXISTS "Authenticated users can view active referral codes" ON public.referral_codes;

CREATE OR REPLACE FUNCTION public.get_active_referral_code(_code text)
RETURNS TABLE (
  id uuid, code text, discount_type text, discount_value numeric,
  max_uses integer, current_uses integer,
  valid_from timestamptz, valid_until timestamptz,
  is_active boolean, valid_region text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, code, discount_type, discount_value, max_uses, current_uses,
         valid_from, valid_until, is_active, valid_region
  FROM public.referral_codes
  WHERE code = upper(_code) AND is_active = true
    AND (valid_from IS NULL OR valid_from <= now())
    AND (valid_until IS NULL OR valid_until >= now())
  LIMIT 1
$$;
REVOKE ALL ON FUNCTION public.get_active_referral_code(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_active_referral_code(text) TO anon, authenticated;

-- user_roles: explicit RESTRICTIVE guard preventing self-escalation
DROP POLICY IF EXISTS "No self role escalation" ON public.user_roles;
CREATE POLICY "No self role escalation" ON public.user_roles
  AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(),'admin'::public.app_role));
