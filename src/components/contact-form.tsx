"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, string[] | undefined>;
type Status = "idle" | "submitting" | "success" | "error";

const budgets = ["Under $25k", "$25k – $75k", "$75k – $200k", "$200k+", "Not sure yet"];

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrors({});

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrors(result.issues ?? {});
        setMessage(result.error ?? "Something went wrong.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("Network error. Please email us directly.");
    }
  }

  if (status === "success") {
    return (
      <div className="surface flex flex-col items-start p-10">
        <CheckCircle2 className="text-accent-400" size={30} />
        <h3 className="mt-5 text-2xl font-semibold">Message received</h3>
        <p className="mt-3 text-ink-400">
          Thanks for reaching out. We reply to everything within one business
          day — usually sooner.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="surface p-8 lg:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" errors={errors.name} required>
          <input id="name" type="text" name="name" required className={inputClass} />
        </Field>

        <Field label="Email" name="email" errors={errors.email} required>
          <input id="email" type="email" name="email" required className={inputClass} />
        </Field>

        <Field label="Company" name="company" errors={errors.company}>
          <input id="company" type="text" name="company" className={inputClass} />
        </Field>

        <Field label="Budget" name="budget" errors={errors.budget}>
          <select id="budget" name="budget" defaultValue="" className={inputClass}>
            <option value="">Select a range</option>
            {budgets.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-6">
        <Field
          label="What are you trying to solve?"
          name="message"
          errors={errors.message}
          required
        >
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            className={cn(inputClass, "resize-y")}
            placeholder="The more context you give us, the more useful our first reply will be."
          />
        </Field>
      </div>

      {/* Honeypot — visually hidden, never focusable by keyboard. */}
      <div aria-hidden className="absolute left-[-9999px]">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && message ? (
        <p role="alert" className="mt-6 text-sm text-red-400">
          {message}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting"}
        className="group mt-8 w-full sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={17} className="animate-spin" /> Sending
          </>
        ) : (
          <>
            Send message
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </>
        )}
      </Button>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/12 bg-ink-900 px-4 py-3 text-[0.95rem] text-ink-100 placeholder:text-ink-500 transition-colors focus:border-accent-500/60 focus:outline-none";

function Field({
  label,
  name,
  errors,
  required,
  children,
}: {
  label: string;
  name: string;
  errors?: string[];
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-ink-200"
      >
        {label}
        {required ? <span className="ml-1 text-accent-500">*</span> : null}
      </label>
      {children}
      {errors?.length ? (
        <p className="mt-2 text-sm text-red-400">{errors[0]}</p>
      ) : null}
    </div>
  );
}
