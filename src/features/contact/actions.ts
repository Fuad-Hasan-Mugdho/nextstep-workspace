"use server";

import { contactSchema, type ContactState } from "./schema";

export async function validateContactDemo(
  _previousState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const rawFields = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };
  const result = contactSchema.safeParse(rawFields);

  if (!result.success) {
    return {
      status: "error",
      message:
        "Server validation-এ কিছু ভুল পাওয়া গেছে। নিচের field-গুলো ঠিক করুন।",
      fieldErrors: result.error.flatten().fieldErrors,
      // Retain normal field values after a failed action, with bounded response sizes.
      values: {
        name:
          typeof rawFields.name === "string" ? rawFields.name.slice(0, 80) : "",
        email:
          typeof rawFields.email === "string"
            ? rawFields.email.slice(0, 254)
            : "",
        message:
          typeof rawFields.message === "string"
            ? rawFields.message.slice(0, 2000)
            : "",
      },
    };
  }

  // Public learning action: validation only. No email, logs, or database writes.
  return {
    status: "success",
    message:
      "Validation successful! Server আপনার input যাচাই করেছে। এই learning demo কোনো email পাঠায় না বা message সংরক্ষণ করে না।",
  };
}
