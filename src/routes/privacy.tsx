import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Container, Section, EditorialHeading, Footer } from "@/components/design-system";
import { contactDetails } from "@/lib/content";
export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy and inquiry data — Swayam Singh" },
      {
        name: "description",
        content:
          "How inquiry details, optional advisor handoffs and consent-based conversion events are handled on this consulting website.",
      },
      { property: "og:title", content: "Privacy and inquiry data — Swayam Singh" },
      {
        property: "og:description",
        content: "Inquiry delivery, optional analytics, advisor consent and your privacy choices.",
      },
      { property: "og:url", content: "https://swayam-singh.vercel.app/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://swayam-singh.vercel.app/privacy" }],
  }),
  component: Privacy,
});
function Privacy() {
  return (
    <div id="top">
      <Nav />
      <main id="main-content">
        <Section>
          <Container className="privacy-content">
            <p className="ds-eyebrow">Data handling</p>
            <EditorialHeading as="h1">
              A clear inquiry.
              <br />
              <em>A considered use of data.</em>
            </EditorialHeading>
            <section>
              <h2>Project inquiries</h2>
              <p>
                Your name, company, email, industry and project brief are used to assess and respond
                to your request. Phone, budget and current workflow are optional. Sending an inquiry
                does not subscribe you to marketing. Please do not submit passwords, sensitive
                personal information or confidential client material.
              </p>
              <p>
                When online delivery is configured, the server sends your details through Resend to
                the consultant’s inbox. A success message confirms provider acceptance, rather than
                guaranteed inbox receipt. If delivery is unavailable, preparing an email draft only
                creates text in your browser; you must send it from your email app.
              </p>
            </section>
            <section>
              <h2>Advisor and human follow-up</h2>
              <p>
                The advisor uses public project information. Optional AI matching sends your
                question and public project facts to OpenAI only when you enable that option. Do not
                include personal or confidential information in questions. The application does not
                store full conversations by default; the current conversation is held in page
                memory.
              </p>
              <p>
                A separate explicit choice is required before a workflow summary is copied into the
                inquiry form. You can edit it before separately consenting to and submitting an
                inquiry. Sharing a summary alone does not send an email or create a lead.
              </p>
            </section>
            <section>
              <h2>Optional analytics</h2>
              <p>
                Conversion measurement is off by default. The preference control below lets you opt
                in or withdraw consent. Do Not Track and Global Privacy Control override this
                choice. The browser stores only your analytics preference; no analytics visitor
                identifier is created.
              </p>
              <p>
                If enabled, events describe industry selection, visible project cards, case-study
                visits, actual video playback, advisor starts, requested handoffs, accepted
                inquiries and configured booking-link clicks. Events contain only an event name and
                optional public project or industry identifier. Names, email addresses, phone
                numbers, inquiry text and full referral URLs are excluded.
              </p>
              <p>
                With this same permission, an inquiry may include a broad referral category and an
                allowlisted campaign category. Arbitrary campaign values and URL query strings are
                discarded. Analytics are best-effort server event logs, not a reliable record of
                every visitor.
              </p>
            </section>
            <section>
              <h2>Security, hosting and retention</h2>
              <p>
                Hosting and delivery providers process requests to operate this site. Short-lived
                abuse counters use rotating hashed network and email keys, not inquiry text.
                Application caches for duplicate inquiry attempts expire after 15 minutes. Host
                security logs and provider email records follow their configured retention policies.
              </p>
              <p>
                Inquiries delivered to the consultant’s mailbox remain there for correspondence and
                follow-up. There is no automated mailbox deletion workflow in this application.
                Contact the consultant to request access, correction or deletion; applicable
                recordkeeping needs will be considered. Provider and hosting retention settings
                should be reviewed by the site operator before enabling online delivery.
              </p>
            </section>
            <section>
              <h2>Contact and choices</h2>
              <p>
                For questions about your inquiry or data, email{" "}
                <a className="text-link" href={`mailto:${contactDetails.email}`}>
                  {contactDetails.email}
                </a>
                . You may contact the consultant directly without enabling analytics or AI matching.
              </p>
            </section>
          </Container>
        </Section>
      </main>
      <Container>
        <Footer />
      </Container>
    </div>
  );
}
