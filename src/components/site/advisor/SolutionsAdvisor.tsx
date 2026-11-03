import { analyticsAllowed, trackConversion } from "@/lib/analytics";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  advisorReplySchema,
  advisorHandoff,
  HANDOFF_EVENT,
  type AdvisorReply,
} from "@/lib/advisor";
import {
  advisorSuggestedPrompts,
  consultingIndustries,
  type ConsultingIndustryId,
} from "@/lib/content";
function measure(
  event: "question_started" | "project_opened" | "handoff_started",
  _project?: string,
) {
  if (event === "handoff_started") trackConversion("chat_lead_handoff");
}
type Turn = { question: string; answer: AdvisorReply };
export function SolutionsAdvisor() {
  const [industry, setIndustry] = useState<ConsultingIndustryId | null>(null);
  const [question, setQuestion] = useState("");
  const [allowAI, setAllowAI] = useState(false);
  const [available, setAvailable] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [review, setReview] = useState(false);
  const [brief, setBrief] = useState("");
  const [consent, setConsent] = useState(false);
  const [copied, setCopied] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const version = useRef({ value: 0 });
  const busy = useRef(false);
  const chatStarted = useRef(false);
  const latest = turns.at(-1);
  useEffect(() => {
    if (!copied) return;
    document.getElementById("contact")?.scrollIntoView({ block: "start", behavior: "instant" });
    document
      .querySelector<HTMLTextAreaElement>('#contact textarea[name="challenge"]')
      ?.focus({ preventScroll: true });
  }, [copied]);
  useEffect(() => {
    const generation = version.current;
    const status = new AbortController();
    void fetch("/api/advisor", { signal: status.signal, cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setAvailable(data?.aiAvailable === true))
      .catch(() => {});
    return () => {
      status.abort();
      controller.current?.abort();
      generation.value++;
    };
  }, []);
  const ask = async (text: string) => {
    if (busy.current || text.trim().length < 3 || text.length > 1200) return;
    const current = ++version.current.value;
    busy.current = true;
    setPending(true);
    setError("");
    setReview(false);
    setCopied(false);
    setConsent(false);
    const requestController = new AbortController();
    controller.current = requestController;
    const timer = setTimeout(() => requestController.abort(), 18000);
    if (!chatStarted.current && analyticsAllowed()) {
      chatStarted.current = true;
      trackConversion("chat_started");
    }
    try {
      const response = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text.trim(),
          industry,
          allowAI: allowAI && available,
          contextProject:
            latest?.answer.projects[0]?.slug &&
            (!industry ||
              consultingIndustries
                .find((sector) => sector.id === industry)
                ?.projectSlugs.some((slug) => slug === latest.answer.projects[0]!.slug))
              ? latest.answer.projects[0].slug
              : null,
        }),
        signal: requestController.signal,
      });
      if (!response.ok)
        throw new Error(
          response.status === 429
            ? "Please wait a minute before asking again."
            : "The advisor could not answer. Your question is preserved; try again or use the inquiry form.",
        );
      const answer = advisorReplySchema.parse(await response.json());
      if (version.current.value !== current) return;
      setTurns((previous) => [...previous.slice(-7), { question: text.trim(), answer }]);
      setBrief(text.trim());
      setQuestion("");
    } catch (failure) {
      if (version.current.value === current)
        setError(
          failure instanceof Error && failure.message.startsWith("Please wait")
            ? failure.message
            : "The advisor is unavailable. Your question is preserved; retry or use the inquiry form below.",
        );
    } finally {
      clearTimeout(timer);
      if (version.current.value === current) {
        busy.current = false;
        setPending(false);
      }
    }
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    void ask(question);
  };
  const clear = () => {
    chatStarted.current = false;
    version.current.value++;
    controller.current?.abort();
    busy.current = false;
    setPending(false);
    setTurns([]);
    setQuestion("");
    setBrief("");
    setError("");
    setReview(false);
    setConsent(false);
    setAllowAI(false);
    setCopied(false);
  };
  const transfer = (event: FormEvent) => {
    event.preventDefault();
    const label = consultingIndustries.find((s) => s.id === industry)?.label ?? "Other";
    const parsed = advisorHandoff.safeParse({ consent, challenge: brief, industry: label });
    if (!parsed.success) return;
    const accepted = window.dispatchEvent(
      new CustomEvent(HANDOFF_EVENT, { detail: parsed.data, cancelable: true }),
    );
    if (!accepted) {
      setError(
        "An inquiry is already sending. Wait for it to finish before copying a new summary.",
      );
      return;
    }
    measure("handoff_started");
    setCopied(true);
    setReview(false);
    setConsent(false);
  };
  return (
    <div className="solutions-advisor">
      <div className="advisor-intro">
        <p className="ds-eyebrow">Public project knowledge / Human follow-up by choice</p>
        <h1>
          Find a useful
          <br />
          <em>starting point.</em>
        </h1>
        <p>
          Describe an operational bottleneck. Explore relevant project briefs, their maturity and
          the evidence available.
        </p>
      </div>
      <aside className="advisor-privacy">
        <strong>Before you ask</strong>
        <p>
          Use a public, non-sensitive description. Do not enter client secrets, names, personal
          information or engineering design data. This is project guidance, not engineering approval
          or compliance certification.
        </p>
        <details>
          <summary>Data handling & privacy</summary>
          <p>
            Questions and answers stay in this page’s memory (up to eight exchanges) until cleared
            or you leave. Each request sends only your current question, selected industry and a
            public project context to this server. No full transcript is saved by this application.
          </p>
          <p>
            If you enable AI matching, the current question and retrieved public facts are sent to
            OpenAI. We request no response storage. Default provider abuse-monitoring logs can
            retain request content for up to 30 days, with exceptions; configured controls may
            differ. Anonymous event counts record questions started, public project links opened and
            visitor-initiated handoffs. Temporary rate-limit counters use a rotating hashed network
            identifier; hosting services may keep access logs.
          </p>
          <p>
            No chat becomes a lead automatically. Review and consent before copying a summary to the
            inquiry form. Only sending that form requests human follow-up through the existing email
            workflow.
          </p>
          <a
            className="text-link"
            href="https://developers.openai.com/api/docs/guides/your-data"
            target="_blank"
            rel="noopener noreferrer"
          >
            Provider data controls ↗
          </a>
        </details>
      </aside>
      <div className="advisor-industries" role="group" aria-label="Advisor industry">
        {consultingIndustries.map((sector) => (
          <button
            key={sector.id}
            type="button"
            disabled={pending}
            aria-pressed={industry === sector.id}
            onClick={() => {
              setIndustry(sector.id);
              setReview(false);
              setConsent(false);
            }}
          >
            {sector.label}
          </button>
        ))}
      </div>
      <div className="advisor-suggestions" role="group" aria-label="Suggested questions">
        {advisorSuggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={pending}
            onClick={() => {
              setQuestion(prompt);
              void ask(prompt);
            }}
          >
            {prompt} ↗
          </button>
        ))}
      </div>
      {industry && (
        <button
          type="button"
          className="text-link"
          disabled={pending}
          onClick={() => {
            const text = `What public projects relate to ${consultingIndustries.find((s) => s.id === industry)!.label}?`;
            setQuestion(text);
            void ask(text);
          }}
        >
          Explore this industry ↗
        </button>
      )}
      <div
        className="advisor-conversation"
        role="log"
        aria-label="Advisor conversation"
        aria-live="polite"
        aria-relevant="additions"
      >
        {turns.map((turn, i) => (
          <article key={i} id={`advisor-turn-${i}`} className="advisor-turn">
            <p className="advisor-visitor">
              <span className="ds-eyebrow">Your question</span>
              {turn.question}
            </p>
            <div className="advisor-answer">
              <p className="ds-eyebrow">
                {turn.answer.mode === "ai"
                  ? "AI-assisted fact matching"
                  : turn.answer.mode === "fallback"
                    ? "Public lookup / AI unavailable"
                    : "Public project lookup"}
              </p>
              <p>{turn.answer.message}</p>
              {turn.answer.projects.map((project) => (
                <div className="advisor-project" key={project.slug}>
                  <h2>{project.title}</h2>
                  <p>
                    {
                      turn.answer.facts.find(
                        (fact) => fact.projectSlug === project.slug && fact.id.endsWith(":scope"),
                      )?.text
                    }
                  </p>
                  <p className="caption">
                    {project.maturity} · Authored status; verification details in the brief.
                  </p>
                  <p>
                    {
                      turn.answer.facts.find(
                        (fact) =>
                          fact.projectSlug === project.slug &&
                          ["reported", "development"].includes(fact.state) &&
                          !fact.id.endsWith(":status"),
                      )?.text
                    }
                  </p>
                  <a
                    href={project.href}
                    className="text-link"
                    onClick={() => measure("project_opened", project.slug)}
                  >
                    Open case study ↗
                  </a>
                  <details>
                    <summary>Inspect scope, planned work & evidence</summary>
                    <ul>
                      {turn.answer.facts
                        .filter((fact) => fact.projectSlug === project.slug)
                        .map((fact) => (
                          <li key={fact.id}>
                            <span>{fact.state}</span>
                            {fact.text}
                          </li>
                        ))}
                    </ul>
                  </details>
                </div>
              ))}
              {turn.answer.question && (
                <p className="advisor-qualification">
                  <strong>One useful question</strong>
                  <br />
                  {turn.answer.question}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
      {pending && (
        <p className="advisor-loading" role="status">
          Looking up public facts and checking evidence boundaries
          {allowAI && available ? "; AI matching may take a few seconds" : ""}…
        </p>
      )}
      {error && (
        <p role="alert" className="advisor-error">
          {error} <a href="#contact">Open inquiry form ↗</a>
        </p>
      )}
      {!pending && turns.length > 0 && (
        <p role="status" className="caption">
          Response ready.{" "}
          <a className="text-link" href={`#advisor-turn-${turns.length - 1}`}>
            Read latest response ↑
          </a>
        </p>
      )}
      <form onSubmit={submit} className="advisor-composer">
        <label htmlFor="advisor-question">
          Your workflow question
          <textarea
            id="advisor-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            maxLength={1200}
            minLength={3}
            required
            rows={3}
            disabled={pending}
            placeholder="For example: production updates live in separate spreadsheets. Where could we start?"
            aria-describedby="advisor-limits"
          />
        </label>
        <p id="advisor-limits" className="caption">
          {question.length}/1,200 characters · Current question only; no file uploads.
        </p>
        {available ? (
          <label className="advisor-check">
            <input
              type="checkbox"
              checked={allowAI}
              disabled={pending}
              onChange={(event) => setAllowAI(event.target.checked)}
            />
            Enable AI fact matching: send this question and public project facts to OpenAI.
          </label>
        ) : (
          <p className="caption">
            AI matching is unavailable right now. Public project lookup does not require it.
          </p>
        )}
        <div className="advisor-actions">
          <button
            type="submit"
            className="ds-button ds-button-primary"
            disabled={pending || question.trim().length < 3}
          >
            {pending ? "Checking…" : "Ask the advisor ↗"}
          </button>
          <button type="button" className="ds-button ds-button-secondary" onClick={clear}>
            Clear conversation
          </button>
        </div>
      </form>
      {latest && latest.answer.projects.length > 0 && !review && (
        <button
          type="button"
          className="text-link"
          disabled={pending}
          onClick={() => {
            setBrief(latest.question);
            setConsent(false);
            setReview(true);
            setCopied(false);
          }}
        >
          Discuss this workflow — review a summary ↗
        </button>
      )}
      {review && (
        <form className="advisor-handoff" onSubmit={transfer}>
          <h2>You decide what to share.</h2>
          <label htmlFor="advisor-brief">
            Summary to copy to the inquiry form
            <textarea
              id="advisor-brief"
              required
              minLength={3}
              maxLength={2000}
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              rows={4}
            />
          </label>
          <label className="advisor-check">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            I consent to copying this reviewed summary and industry into the inquiry form, replacing
            those two fields. This does not send an inquiry or copy the full conversation.
          </label>
          <div className="advisor-actions">
            <button
              type="submit"
              className="ds-button ds-button-primary"
              disabled={!consent || brief.trim().length < 3}
            >
              Copy to inquiry form ↗
            </button>
            <button
              type="button"
              className="text-link"
              onClick={() => {
                setReview(false);
                setConsent(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {copied && (
        <p role="status">
          Your reviewed summary is in the inquiry form. Add contact details, review the privacy note
          and choose whether to send. Nothing has been sent by the advisor.
        </p>
      )}
    </div>
  );
}
