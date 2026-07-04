
CREATE TABLE IF NOT EXISTS public.business_module_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  module TEXT NOT NULL CHECK (module IN ('products','messaging','analytics')),
  is_granted BOOLEAN NOT NULL DEFAULT true,
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, module)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_module_access TO authenticated;
GRANT ALL ON public.business_module_access TO service_role;

ALTER TABLE public.business_module_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view own module access"
ON public.business_module_access FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_module_access.business_id AND b.user_id = auth.uid())
);

CREATE POLICY "Admins can view all module access"
ON public.business_module_access FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert module access"
ON public.business_module_access FOR INSERT TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update module access"
ON public.business_module_access FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete module access"
ON public.business_module_access FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role));
