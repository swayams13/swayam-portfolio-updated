import { referralAttribution, trackConversion } from "@/lib/analytics";
import { advisorHandoff, HANDOFF_EVENT } from "@/lib/advisor";
import { Footer } from "@/components/design-system";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { contactDetails, homepageCopy } from "@/lib/content";
import {
  inquirySchema,
  inquiryText,
  inquiryIndustries,
  contactMethods,
  type InquiryResult,
} from "@/lib/inquiry";

type Availability = { deliveryAvailable: boolean; bookingUrl: string | null; testMode?: boolean };
export function Contact() {
  const [challenge, setChallenge] = useState("");
  const [industryValue, setIndustryValue] = useState("");
  useEffect(() => {
    const accept = (event: Event) => {
      const parsed = advisorHandoff.safeParse((event as CustomEvent).detail);
      if (!parsed.success) return;
      if (pendingRef.current) {
        event.preventDefault();
        return;
      }
      setError("");
      setFields({});
      setReference("");
      setDraft("");
      setCopyStatus("");
      setChallenge(parsed.data.challenge);
      setIndustryValue(parsed.data.industry);
    };
    const chooseIndustry = (event: Event) => {
      const value = (event as CustomEvent).detail;
      if (!pendingRef.current && inquiryIndustries.some((industry) => industry === value)) {
        setIndustryValue(value);
        setReference("");
        setDraft("");
      }
    };
    window.addEventListener("inquiry-industry-choice", chooseIndustry);
    window.addEventListener(HANDOFF_EVENT, accept);
    return () => {
      window.removeEventListener(HANDOFF_EVENT, accept);
      window.removeEventListener("inquiry-industry-choice", chooseIndustry);
    };
  }, []);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const [error, setError] = useState("");
  const [submission, setSubmission] = useState(0);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [reference, setReference] = useState("");
  const [testSuccess, setTestSuccess] = useState(false);
  const submitted = useRef(new Set<string>());
  const [draft, setDraft] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const attempt = useRef<{ fingerprint: string; id: string; issuedAt: number } | null>(null);
  const errorFocus = useRef<HTMLDivElement>(null);
  const successFocus = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    fetch("/api/inquiry", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("config");
        const data = (await response.json()) as Availability;
        let bookingUrl: string | null = null;
        try {
          const url = new URL(data.bookingUrl ?? "");
          if (url.protocol === "https:" && !url.username && !url.password) bookingUrl = url.href;
        } catch {
          /* Email booking is always available. */
        }
        setAvailability({
          deliveryAvailable: data.deliveryAvailable === true,
          bookingUrl,
          testMode: data.testMode === true,
        });
      })
      .catch(() => setAvailability({ deliveryAvailable: false, bookingUrl: null }))
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, []);
  useEffect(() => {
    if (error) errorFocus.current?.focus();
  }, [error, submission]);
  useEffect(() => {
    if (reference) successFocus.current?.focus();
  }, [reference]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pendingRef.current) return;
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setSubmission((value) => value + 1);
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") ?? ""),
      company: String(data.get("company") ?? ""),
      email: String(data.get("email") ?? ""),
      industry: String(data.get("industry") ?? ""),
      challenge: String(data.get("challenge") ?? ""),
      workflow: String(data.get("workflow") ?? ""),
      budget: String(data.get("budget") ?? ""),
      method: String(data.get("method") ?? "Email"),
      website: String(data.get("website") ?? ""),
      phone: String(data.get("phone") ?? ""),
      privacyConsent: data.get("privacyConsent") === "on",
      attribution: referralAttribution(),
    };
    const fingerprint = JSON.stringify(values);
    if (attempt.current?.fingerprint !== fingerprint)
      attempt.current = { fingerprint, id: crypto.randomUUID(), issuedAt: Date.now() };
    const parsed = inquirySchema.safeParse({
      ...values,
      requestId: attempt.current!.id,
      issuedAt: attempt.current!.issuedAt,
    });
    setError("");
    setFields({});
    setReference("");
    setCopyStatus("");
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") next[key] = issue.message;
      }
      setFields(next);
      setError("Please review the inquiry fields.");
      return;
    }
    if (!availability?.deliveryAvailable) {
      setDraft(inquiryText(parsed.data));
      return;
    }
    pendingRef.current = true;
    setPending(true);
    setDraft("");
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: AbortSignal.timeout(15000),
      });
      const result = (await response.json()) as InquiryResult;
      if (response.ok && result.ok && typeof result.reference === "string") {
        setReference(result.reference);
        setTestSuccess(result.testMode === true);
        if (!result.testMode && !submitted.current.has(result.reference)) {
          submitted.current.add(result.reference);
          trackConversion("inquiry_submitted");
        }
      } else if (!result.ok) {
        setError(
          typeof result.message === "string"
            ? result.message
            : "Unable to confirm delivery. Retry or email me directly.",
        );
        setFields(result.fields ?? {});
      } else
        setError(
          "Unable to confirm delivery. Your details are preserved; retry or email me directly.",
        );
    } catch {
      setError(
        "Unable to confirm delivery. Your details are preserved; retry or email me directly.",
      );
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setCopyStatus("Inquiry copied. It has not been sent.");
    } catch {
      setCopyStatus("Select and copy the draft below, then email it directly.");
    }
  };
  const fieldError = (name: string) =>
    fields[name] ? (
      <span id={`error-${name}`} className="field-error">
        {fields[name]}
      </span>
    ) : null;
  const fieldA11y = (name: string) => ({
    "aria-invalid": Boolean(fields[name]),
    "aria-describedby": fields[name] ? `error-${name}` : undefined,
  });
  const bookingHref =
    availability?.bookingUrl ??
    `mailto:${contactDetails.email}?subject=${encodeURIComponent(contactDetails.discoverySubject)}`;
  return (
    <section id="contact" className="contact-section section-space" aria-labelledby="contact-title">
      <div className="shell">
        <div className="contact-layout">
          <div>
            <h2 id="contact-title">
              Complex workflow?
              <br />
              <span className="muted">Start a clear conversation.</span>
            </h2>
            <p className="lead">{homepageCopy.contactIntro}</p>
            <div className="contact-options">
              <a className="text-link" href={`mailto:${contactDetails.email}`}>
                {contactDetails.email} ↗
              </a>
              <a
                className="text-link"
                href={bookingHref}
                onClick={() => {
                  if (availability?.bookingUrl) trackConversion("booking_clicked");
                }}
                {...(availability?.bookingUrl
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {availability?.bookingUrl
                  ? "Book a 20-minute discovery call"
                  : "Request a 20-minute discovery call by email"}{" "}
                ↗
              </a>
            </div>
            <aside className="contact-notice" aria-live="polite">
              <p className="label">
                {availability === null
                  ? "Checking inquiry delivery"
                  : availability.deliveryAvailable
                    ? "Project inquiry"
                    : "Email contact available"}
              </p>
              <p>
                {availability === null
                  ? "Checking whether online inquiry delivery is available. You can always email me directly."
                  : availability.deliveryAvailable
                    ? "Share enough context for a useful first conversation. There is no required budget or commitment to proceed."
                    : "Online form delivery is being configured. Prepare your inquiry below and open it in your email app, or email me directly. Preparing a draft does not send it."}
              </p>
            </aside>
          </div>
          <form
            onSubmit={submit}
            method="post"
            action="/api/inquiry"
            onChange={() => {
              setReference("");
              setDraft("");
              setCopyStatus("");
            }}
            className="inquiry-form"
            aria-label="Project inquiry"
            aria-busy={pending}
          >
            {error && (
              <div ref={errorFocus} className="inquiry-error" role="alert" tabIndex={-1}>
                <p>{error}</p>
                <a href={`mailto:${contactDetails.email}`}>Email me directly ↗</a>
              </div>
            )}
            {reference && (
              <div ref={successFocus} className="inquiry-success" role="status" tabIndex={-1}>
                <p>
                  {testSuccess
                    ? "Local test completed. No email was sent."
                    : "Your inquiry was accepted for email delivery."}
                </p>
                <p className="caption">
                  Reference: {reference}.{" "}
                  {testSuccess
                    ? "This is a simulation, not delivery."
                    : "This confirms provider acceptance, not inbox receipt."}{" "}
                  If you need to follow up, email me directly.
                </p>
              </div>
            )}
            <fieldset disabled={pending}>
              <legend className="sr-only">Your project details</legend>
              <div className="form-pair">
                <label>
                  Name
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    maxLength={200}
                    {...fieldA11y("name")}
                  />
                  {fieldError("name")}
                </label>
                <label>
                  Company
                  <input
                    name="company"
                    required
                    autoComplete="organization"
                    maxLength={200}
                    {...fieldA11y("company")}
                  />
                  {fieldError("company")}
                </label>
              </div>
              <label>
                Work email
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  maxLength={200}
                  {...fieldA11y("email")}
                />
                {fieldError("email")}
              </label>
              <label>
                Industry
                <select
                  name="industry"
                  required
                  value={industryValue}
                  onChange={(event) => setIndustryValue(event.target.value)}
                  {...fieldA11y("industry")}
                >
                  <option value="" disabled>
                    Select your industry
                  </option>
                  {inquiryIndustries.map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </select>
                {fieldError("industry")}
              </label>
              <label>
                Business problem or proposed project
                <textarea
                  name="challenge"
                  value={challenge}
                  onChange={(event) => setChallenge(event.target.value)}
                  required
                  rows={4}
                  maxLength={2000}
                  placeholder="What is getting in the way, and what would you like to improve?"
                  {...fieldA11y("challenge")}
                />
                {fieldError("challenge")}
              </label>
              <label>
                Current workflow or system <span className="optional">(optional)</span>
                <textarea
                  name="workflow"
                  rows={2}
                  maxLength={1000}
                  placeholder="Spreadsheets, email, an ERP, or a manual process."
                  {...fieldA11y("workflow")}
                />
                {fieldError("workflow")}
              </label>
              <div className="form-pair">
                <label>
                  Budget range <span className="optional">(optional)</span>
                  <input
                    name="budget"
                    maxLength={150}
                    placeholder="A range, or leave blank"
                    {...fieldA11y("budget")}
                  />
                  {fieldError("budget")}
                </label>
                <label>
                  Preferred contact method
                  <select name="method" defaultValue="Email" {...fieldA11y("method")}>
                    {contactMethods.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                  {fieldError("method")}
                </label>
              </div>
              <label>
                Phone number <span className="optional">(optional)</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                  {...fieldA11y("phone")}
                />
                {fieldError("phone")}
              </label>
              <label className="inquiry-consent">
                <input
                  name="privacyConsent"
                  type="checkbox"
                  required
                  {...fieldA11y("privacyConsent")}
                />
                I consent to using these details to assess and respond to this inquiry. No marketing
                subscription is created.
              </label>
              {fieldError("privacyConsent")}
              <p className="caption">
                <a href="/privacy">Privacy and data handling ↗</a>
                {availability?.testMode && " Local test mode: this form will not send email."}
              </p>
              <div className="inquiry-trap" aria-hidden="true">
                <label>
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" maxLength={0} />
                </label>
              </div>
              <p className="caption">
                I use these details to assess and respond to your inquiry. Please leave out
                confidential documents, passwords and sensitive client information. When sent
                online, the inquiry is processed by the email delivery provider. Budget is optional.
              </p>
              <button className="button" type="submit" disabled={availability === null}>
                {pending
                  ? "Sending inquiry…"
                  : availability?.deliveryAvailable
                    ? availability.testMode
                      ? "Run local delivery test ↗"
                      : "Send project inquiry ↗"
                    : "Prepare email draft ↗"}
              </button>
            </fieldset>
          </form>
        </div>
        {draft && (
          <div className="inquiry-draft">
            <p role="status">Your email draft is ready. It has not been sent.</p>
            <label htmlFor="inquiry-draft">Inquiry draft</label>
            <textarea id="inquiry-draft" readOnly value={draft} rows={8} />
            <div className="draft-actions">
              <a
                className="button"
                href={`mailto:${contactDetails.email}?subject=${encodeURIComponent("Project inquiry")}&body=${encodeURIComponent(draft)}`}
              >
                Open email app ↗
              </a>
              <button type="button" className="text-link" onClick={copy}>
                Copy inquiry
              </button>
            </div>
            <p role="status">{copyStatus}</p>
            <p className="caption">
              Review and send in your email app. For long briefs, copy the text if the email link is
              truncated.
            </p>
          </div>
        )}
        <Footer />
      </div>
    </section>
  );
}
