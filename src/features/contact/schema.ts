import { z } from "zod";

// Browser checks are convenient. This schema also checks direct requests on the server.
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "নামে অন্তত ২টি অক্ষর লিখুন।")
    .max(80, "নাম ৮০ অক্ষরের মধ্যে রাখুন।"),
  email: z
    .string()
    .trim()
    .email("সঠিক email address লিখুন।")
    .max(254, "Email address অনেক বড়।"),
  message: z
    .string()
    .trim()
    .min(10, "অন্তত ১০ অক্ষরের একটি message লিখুন।")
    .max(2000, "Message ২০০০ অক্ষরের মধ্যে রাখুন।"),
});

export type ContactFields = z.infer<typeof contactSchema>;
export type ContactState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Partial<Record<keyof ContactFields, string[]>>;
  values?: ContactFields;
};

export const initialContactState: ContactState = {
  status: "idle",
  message: "",
};
