import { supabase } from "@/integrations/supabase/client";

export const contactService = {
  submitContact: async (data: {
    name: string;
    email: string;
    subject?: string | null;
    phone?: string | null;
    message: string;
  }) => {
    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert(data);

    if (dbError) {
      console.error("DB insert error:", dbError);
    }

    const { error: emailError } = await supabase.functions.invoke("send-contact-email", {
      body: {
        name: data.name,
        email: data.email,
        subject: data.subject || "No subject",
        phone: data.phone || "Not provided",
        message: data.message,
      },
    });

    if (emailError) {
      console.error("Email send error:", emailError);
    }
  },
};
