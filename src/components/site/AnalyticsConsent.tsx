import { useEffect, useState } from "react";
import { analyticsAllowed, setAnalyticsChoice } from "@/lib/analytics";
export function AnalyticsConsent() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const update = () => setAllowed(analyticsAllowed());
    update();
    window.addEventListener("analytics-choice", update);
    return () => window.removeEventListener("analytics-choice", update);
  }, []);
  return (
    <aside className="analytics-preferences">
      <label>
        <input
          type="checkbox"
          checked={allowed}
          onChange={(event) => {
            setAnalyticsChoice(event.target.checked);
            setAllowed(analyticsAllowed());
          }}
        />
        Allow optional, content-free usage analytics and broad inquiry source attribution.
      </label>
      <p>
        No inquiry text, chat text, name, email, phone, full referrer URL or unique visitor ID is
        included in these events. Off by default; browser Do Not Track/Global Privacy Control takes
        priority. <a href="/privacy">Privacy details ↗</a>
      </p>
    </aside>
  );
}
