
CREATE TABLE public.webhook_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL DEFAULT 'fossbilling',
  event_type TEXT NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  user_id UUID,
  target_email TEXT,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX webhook_events_business_idx ON public.webhook_events(business_id, created_at DESC);
CREATE INDEX webhook_events_user_idx ON public.webhook_events(user_id, created_at DESC);
CREATE INDEX webhook_events_created_idx ON public.webhook_events(created_at DESC);

GRANT SELECT, UPDATE ON public.webhook_events TO authenticated;
GRANT ALL ON public.webhook_events TO service_role;

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view all webhook events"
ON public.webhook_events FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins update webhook events"
ON public.webhook_events FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users view their webhook events"
ON public.webhook_events FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR business_id IN (SELECT id FROM public.businesses WHERE user_id = auth.uid())
);

CREATE POLICY "Users mark own webhook events read"
ON public.webhook_events FOR UPDATE TO authenticated
USING (
  user_id = auth.uid()
  OR business_id IN (SELECT id FROM public.businesses WHERE user_id = auth.uid())
)
WITH CHECK (
  user_id = auth.uid()
  OR business_id IN (SELECT id FROM public.businesses WHERE user_id = auth.uid())
);
