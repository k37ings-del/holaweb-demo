
CREATE OR REPLACE FUNCTION public.check_admin_email(_email text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_allowed_emails
    WHERE (is_domain_pattern = false AND email_pattern = _email)
       OR (is_domain_pattern = true AND _email LIKE '%' || email_pattern)
  )
$$;
REVOKE ALL ON FUNCTION public.check_admin_email(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_admin_email(text) TO anon, authenticated;
