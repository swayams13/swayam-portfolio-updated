export { Contact } from "./Contact";

export function About() {
  return (
    <section id="about" className="about-section section-space" aria-labelledby="about-title">
      <div className="shell about-layout">
        <div>
          <h2 id="about-title">
            An engineering mindset.
            <br />
            <span className="muted">A practical approach.</span>
          </h2>
        </div>
        <div>
          <p className="about-name">Swayam Singh</p>
          <p className="label">Independent AI & Solutions Consultant</p>
          <p className="lead">
            I work at the intersection of software engineering, artificial intelligence and
            industrial operations.
          </p>
          <p>
            My consulting experience includes manufacturing and engineering operations in Gujarat,
            India. I work directly with teams to understand their workflows, define a useful scope
            and build around practical constraints.
          </p>
          <dl className="about-facts">
            <div>
              <dt>Focus</dt>
              <dd>Manufacturing, EPC engineering, construction and real estate workflows.</dd>
            </div>
            <div>
              <dt>Background</dt>
              <dd>B.Tech in Artificial Intelligence and Machine Learning.</dd>
            </div>
            <div>
              <dt>Approach</dt>
              <dd>Understand the workflow. Define a useful scope. Build, review and improve.</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
