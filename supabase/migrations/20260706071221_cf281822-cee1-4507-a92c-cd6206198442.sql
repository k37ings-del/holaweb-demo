
CREATE TABLE IF NOT EXISTS public.module_access_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  module TEXT NOT NULL,
  is_granted BOOLEAN NOT NULL,
  changed_by UUID,
  changed_by_email TEXT,
  source TEXT NOT NULL DEFAULT 'admin',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.module_access_audit TO authenticated;
GRANT ALL ON public.module_access_audit TO service_role;

ALTER TABLE public.module_access_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit log"
  ON public.module_access_audit FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can insert audit entries"
  ON public.module_access_audit FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX IF NOT EXISTS module_access_audit_business_idx
  ON public.module_access_audit (business_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.log_module_access_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor_email TEXT;
BEGIN
  SELECT email INTO actor_email FROM auth.users WHERE id = auth.uid();
  INSERT INTO public.module_access_audit
    (business_id, module, is_granted, changed_by, changed_by_email, source)
  VALUES
    (NEW.business_id, NEW.module, NEW.is_granted, auth.uid(), actor_email,
     COALESCE(current_setting('app.access_source', true), 'admin'));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_module_access ON public.business_module_access;
CREATE TRIGGER trg_log_module_access
  AFTER INSERT OR UPDATE ON public.business_module_access
  FOR EACH ROW EXECUTE FUNCTION public.log_module_access_change();

ALTER TABLE public.admin_allowed_emails
  ADD COLUMN IF NOT EXISTS invited_by UUID,
  ADD COLUMN IF NOT EXISTS notes TEXT;

DROP POLICY IF EXISTS "Admins manage allowed emails" ON public.admin_allowed_emails;
CREATE POLICY "Admins manage allowed emails"
  ON public.admin_allowed_emails FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_allowed_emails TO authenticated;

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS requested_modules TEXT[] NOT NULL DEFAULT '{}';

CREATE OR REPLACE FUNCTION public.sync_business_modules_for_subscription(
  _business_id UUID,
  _is_active BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT _is_active THEN
    UPDATE public.business_module_access
      SET is_granted = false, updated_at = now()
      WHERE business_id = _business_id AND is_granted = true;

    INSERT INTO public.module_access_audit
      (business_id, module, is_granted, changed_by_email, source, note)
    SELECT _business_id, unnest(ARRAY['products','messaging','analytics']), false,
           'system', 'subscription_webhook', 'Subscription lapsed — modules revoked';
  END IF;
END;
$$;
