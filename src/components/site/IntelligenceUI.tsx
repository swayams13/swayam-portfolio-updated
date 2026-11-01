const rows = [
  ["J-2401", "Heat exchanger", "Fabrication"],
  ["J-2402", "Pressure vessel", "Quality review"],
  ["J-2403", "Expansion joint", "Engineering"],
];
export function IntelligenceUI() {
  return (
    <div className="intelligence-ui dark">
      <div className="interface-header">
        <span className="label">Production / Overview</span>
        <span className="sample-label">Illustrative sample</span>
      </div>
      <div
        className="data-scroll"
        role="region"
        aria-label="Sample production overview"
        tabIndex={0}
      >
        <table>
          <caption className="sr-only">Illustrative jobs and current stages</caption>
          <thead>
            <tr>
              <th scope="col">Job</th>
              <th scope="col">Equipment</th>
              <th scope="col">Current stage</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([id, name, stage]) => (
              <tr key={id}>
                <th scope="row">{id}</th>
                <td>{name}</td>
                <td>
                  <span className="stage-marker" />
                  {stage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="interface-note">One record. A shared view of the work.</p>
    </div>
  );
}
