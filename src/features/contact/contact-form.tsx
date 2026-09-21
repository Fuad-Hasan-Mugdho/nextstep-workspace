"use client";

import { useActionState } from "react";
import { Icon } from "@/components/ui/icon";
import { validateContactDemo } from "./actions";
import { initialContactState } from "./schema";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    validateContactDemo,
    initialContactState,
  );

  return (
    <form
      action={formAction}
      className="contact-form"
      aria-label="Server Action demo"
      aria-busy={pending}
    >
      <div className="contact-form-row">
        <div className="form-field">
          <label htmlFor="contact-name">
            Your name <span aria-hidden="true">*</span>
          </label>
          <input
            className="input"
            id="contact-name"
            name="name"
            type="text"
            placeholder="e.g. Alex Rahman"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            defaultValue={state.values?.name ?? ""}
            aria-invalid={Boolean(state.fieldErrors?.name)}
            aria-describedby={
              state.fieldErrors?.name ? "contact-name-error" : undefined
            }
          />
          {state.fieldErrors?.name && (
            <p id="contact-name-error" className="contact-field-error">
              {state.fieldErrors.name[0]}
            </p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="contact-email">
            Email address <span aria-hidden="true">*</span>
          </label>
          <input
            className="input"
            id="contact-email"
            name="email"
            type="email"
            placeholder="alex@example.com"
            autoComplete="email"
            required
            maxLength={254}
            defaultValue={state.values?.email ?? ""}
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={
              state.fieldErrors?.email ? "contact-email-error" : undefined
            }
          />
          {state.fieldErrors?.email && (
            <p id="contact-email-error" className="contact-field-error">
              {state.fieldErrors.email[0]}
            </p>
          )}
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">
          Your message <span aria-hidden="true">*</span>
        </label>
        <textarea
          className="input"
          id="contact-message"
          name="message"
          placeholder="আজ Next.js নিয়ে কী শিখলেন? একটি sample message লিখুন…"
          rows={6}
          required
          minLength={10}
          maxLength={2000}
          defaultValue={state.values?.message ?? ""}
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={`contact-message-hint${state.fieldErrors?.message ? " contact-message-error" : ""}`}
        />
        <div className="contact-field-meta">
          <span id="contact-message-hint">
            ১০–২০০০ অক্ষর · sample data ব্যবহার করুন
          </span>
          <span>All fields required</span>
        </div>
        {state.fieldErrors?.message && (
          <p id="contact-message-error" className="contact-field-error">
            {state.fieldErrors.message[0]}
          </p>
        )}
      </div>
      <div aria-live="polite" aria-atomic="true">
        {state.message && (
          <p
            className={`contact-result contact-result-${state.status}`}
            role={state.status === "error" ? "alert" : "status"}
          >
            {state.message}
          </p>
        )}
      </div>
      <div className="contact-form-bottom">
        <p>Input server-এ যায়; এই app সেটি সংরক্ষণ করে না।</p>
        <button
          type="submit"
          className="button button-primary"
          disabled={pending}
        >
          {pending ? "Validating…" : "Run validation"}
          <Icon name={pending ? "clock" : "arrow-right"} size={16} />
        </button>
      </div>
    </form>
  );
}
