import s1 from "@/assets/scene-01-manufacturing.jpg";
import s2 from "@/assets/scene-02-engineering.jpg";
import s3 from "@/assets/scene-03-construction.jpg";
import p1w from "@/assets/scene-01b-manufacturing-wire.jpg";
import p3w from "@/assets/scene-03a-structure-wire.jpg";
import p3c from "@/assets/scene-03b-completed.jpg";

/**
 * Cinematic plates, in timeline order. Pairs share an identical camera so masked
 * reveals read as one view transforming. `video` (optional) replaces a still with a
 * rendered camera move later; the timeline targets the wrapper, not the media.
 */
export const plates = {
  factory: { image: s1, video: undefined as string | undefined },
  factoryWire: { image: p1w, video: undefined as string | undefined },
  structureWire: { image: p3w, video: undefined as string | undefined },
  construction: { image: s3, video: undefined as string | undefined },
  completed: { image: p3c, video: undefined as string | undefined },
};

/**
 * Scene manifest. Each scene accepts an image today; `video` can be set later
 * (e.g. a rendered MP4 camera move) and the cinematic component will prefer it.
 */
export type Scene = {
  id: string;
  index: string;
  label: string;
  headline: [string, string];
  body: string;
  image?: string;
  video?: string;
  placeholder: boolean;
};

export const scenes: Scene[] = [
  {
    id: "manufacturing",
    index: "01",
    label: "Manufacturing",
    headline: ["Systems for industries", "that build the world."],
    body: "AI, automation, and custom software for complex industrial operations.",
    image: s1,
    placeholder: true,
  },
  {
    id: "engineering",
    index: "02",
    label: "EPC & Engineering",
    headline: ["From complex engineering", "to connected workflows."],
    body: "Engineering automation, technical documentation, BOM generation, and quotation workflows.",
    image: p1w,
    placeholder: true,
  },
  {
    id: "construction",
    index: "03",
    label: "Construction",
    headline: ["Bringing clarity", "to complex projects."],
    body: "Document intelligence, BOQ workflows, project visibility, and operational software.",
    image: s3,
    placeholder: true,
  },
  {
    id: "realestate",
    index: "04",
    label: "Real Estate",
    headline: ["Better information.", "Better decisions."],
    body: "Digital systems for project information, property operations, and business workflows.",
    image: p3c,
    placeholder: true,
  },
  {
    id: "intelligence",
    index: "05",
    label: "Digital Intelligence",
    headline: ["The systems behind", "better operations."],
    body: "Selected software and automation projects designed around real business challenges.",
    placeholder: false,
  },
];

/* ───────────────────────── Projects ─────────────────────────
 * One data model drives the homepage showcases, the specialized index, the research
 * feature, and every /work/$slug page. Replace `media` entries with real screenshots
 * or walkthrough videos; showcases prefer them over the illustrative sample UI.
 */

/** The only status labels allowed on the site. */
export type Status =
  "Delivered Components" | "Active Pilot" | "In Development" | "Prototype" | "Planned" | "Research";

/** Per-capability honesty marker. "To verify" = Swayam must confirm before publishing. */
export type CapState = "Implemented" | "In development" | "Planned" | "To verify";

export type Cta = { label: string; hash?: "workflow" | "demo" | "architecture" };

export type Project = {
  slug: string;
  number: string;
  title: string;
  short?: string;
  tier: "flagship" | "specialized" | "research";
  industry: string;
  status: Status[];
  statusLabel?: string;
  statusNote: string;
  summary: string;
  problem: string;
  approach: string;
  features: { name: string; state: CapState }[];
  flow: string[];
  architecture: string[];
  ctas: [Cta, Cta];
  media: { image?: string; video?: string; screenshots?: string[] };
  patent?: string;
};

export const projects: Project[] = [
  {
    slug: "manufacturing-operating-system",
    statusLabel: "In Development",
    number: "01",
    title: "Manufacturing Operating System",
    short: "MOS",
    tier: "flagship",
    industry: "Manufacturing / EPC / Industrial Operations",
    status: ["In Development"],
    statusNote: "Enterprise platform in development. Not deployed or production-ready as a whole.",
    summary:
      "A unified digital operating environment designed to connect departments, engineering information, production activities, and management workflows.",
    problem:
      "Industrial businesses frequently operate through disconnected spreadsheets, departmental systems, manual communication, and fragmented operational records. This makes it difficult to maintain consistent information and coordinate work across departments.",
    approach:
      "A unified Manufacturing Operating System that brings key operational workflows into a connected software environment.",
    features: [
      { name: "Centralized operational dashboard", state: "In development" },
      { name: "Department-specific interfaces", state: "In development" },
      { name: "Project and job management", state: "In development" },
      { name: "Production workflow coordination", state: "In development" },
      { name: "Engineering document management", state: "Planned" },
      { name: "Procurement visibility", state: "Planned" },
      { name: "Quality control workflows", state: "Planned" },
      { name: "Workforce and resource management", state: "Planned" },
      { name: "Management reporting", state: "Planned" },
      { name: "Role-based access", state: "Planned" },
      { name: "Multi-organization architecture", state: "Planned" },
      { name: "Integration with engineering and business systems", state: "Planned" },
    ],
    flow: ["Engineering", "Procurement", "Production", "Quality", "Management"],
    architecture: [
      "Department interfaces",
      "Workflow & project services",
      "Documents & roles",
      "Multi-org data store",
      "Integrations",
    ],
    ctas: [
      { label: "Explore the platform" },
      { label: "View system architecture", hash: "architecture" },
    ],
    media: {},
  },
  {
    slug: "production-intelligence",
    statusLabel: "Active Development / Pilot",
    number: "02",
    title: "Production Intelligence Platform",
    tier: "flagship",
    industry: "Manufacturing / Industrial Equipment Production",
    status: ["Active Pilot", "In Development"],
    statusNote:
      "Active development and pilot. Capability states to be confirmed by Swayam before publishing.",
    summary:
      "A production tracking system designed to connect engineering, procurement, fabrication, quality control, and management workflows.",
    problem:
      "Production progress is often tracked through separate spreadsheets and manual departmental updates. This creates difficulties in understanding job status, identifying bottlenecks, and coordinating activities.",
    approach:
      "A centralized production intelligence platform that organizes project stages, departmental workflows, and operational information.",
    features: [
      { name: "Equipment and job tracking", state: "Implemented" },
      { name: "Production stage monitoring", state: "Implemented" },
      { name: "Department-specific dashboards", state: "Implemented" },
      { name: "BOM-based workflows", state: "Implemented" },
      { name: "Procurement visibility", state: "To verify" },
      { name: "Quality inspection tracking", state: "To verify" },
      { name: "Progress reporting", state: "In development" },
      { name: "Task ownership", state: "To verify" },
      { name: "Operational alerts", state: "Planned" },
    ],
    flow: [
      "Project overview",
      "Production timeline",
      "Department dashboard",
      "Quality workflow",
      "Management overview",
    ],
    architecture: [
      "Web client",
      "API layer",
      "Relational database",
      "Role-based access",
      "Report exports",
    ],
    ctas: [{ label: "Explore case study" }, { label: "View product scope", hash: "demo" }],
    media: { image: s1 },
  },
  {
    slug: "engineering-automation",
    statusLabel: "Delivered Components / Ongoing Development",
    number: "03",
    title: "Engineering Automation Suite",
    tier: "flagship",
    industry: "EPC / Industrial Equipment Engineering",
    status: ["Delivered Components", "In Development"],
    statusNote:
      "Some calculation and BOM tools delivered; CAD-related capabilities are planned or experimental.",
    summary:
      "Engineering automation tools designed to reduce repetitive calculations, documentation work, and manual engineering processes.",
    problem:
      "Engineering teams frequently repeat calculations, prepare BOMs manually, generate documentation, and transfer information between disconnected tools.",
    approach:
      "A collection of engineering automation workflows covering calculations, structured engineering data, costing, and drawing-related processes.",
    features: [
      { name: "Expansion joint engineering calculations", state: "Implemented" },
      { name: "Pressure vessel design calculations", state: "Implemented" },
      { name: "Engineering BOM generation", state: "Implemented" },
      { name: "Material and cost estimation", state: "Implemented" },
      { name: "Technical document generation", state: "In development" },
      { name: "Engineering data validation", state: "In development" },
      { name: "Drawing-related automation", state: "Planned" },
      { name: "CAD integration workflows", state: "Planned" },
    ],
    flow: [
      "Engineering drawing",
      "Parameters",
      "Calculation results",
      "Structured BOM",
      "Costing / documentation",
    ],
    architecture: [
      "Input templates",
      "Calculation engine",
      "BOM schema",
      "Costing rules",
      "Document generator",
    ],
    ctas: [
      { label: "Explore engineering systems" },
      { label: "View workflow demo", hash: "workflow" },
    ],
    media: { image: s2 },
  },
  {
    slug: "tender-to-quotation",
    statusLabel: "Planned / In Development — Verify Before Publication",
    number: "04",
    title: "Tender-to-Quotation Intelligence",
    tier: "flagship",
    industry: "Manufacturing / EPC / Engineering Sales",
    status: ["Planned", "In Development"],
    statusNote: "Planned / in development. Verify scope with Swayam before publication.",
    summary:
      "A document-driven workflow designed to streamline the journey from incoming tender information to structured engineering and commercial outputs.",
    problem:
      "Tender documents often contain large amounts of technical information that must be reviewed, extracted, validated, and transferred into engineering and quotation workflows.",
    approach:
      "An intelligent document processing system designed to organize tender information and support engineering quotation preparation.",
    features: [
      { name: "Tender document ingestion", state: "To verify" },
      { name: "Technical requirement extraction", state: "To verify" },
      { name: "Structured specification generation", state: "Planned" },
      { name: "Engineering parameter identification", state: "Planned" },
      { name: "BOM preparation support", state: "Planned" },
      { name: "Cost estimation workflows", state: "Planned" },
      { name: "Quotation document generation", state: "Planned" },
      { name: "Human review and approval", state: "Planned" },
      { name: "Engineering document traceability", state: "Planned" },
    ],
    flow: ["Document", "Structured data", "Engineering review", "Quotation"],
    architecture: [
      "Document ingest",
      "Extraction model",
      "Specification schema",
      "Review & approval",
      "Quotation generator",
    ],
    ctas: [
      { label: "Explore workflow", hash: "workflow" },
      { label: "View system concept", hash: "architecture" },
    ],
    media: {},
  },
  {
    slug: "boq-intelligence",
    statusLabel: "Prototype / In Development",
    number: "05",
    title: "BOQ Intelligence Platform",
    tier: "flagship",
    industry: "Construction / Real Estate Development",
    status: ["Prototype", "In Development"],
    statusNote: "Prototype. No accuracy figures are claimed; all data shown is sample data.",
    summary:
      "An AI-assisted construction document intelligence system focused on BOQ extraction, validation, and structured estimation workflows.",
    problem:
      "Construction estimation teams often work with lengthy BOQ documents, spreadsheets, and inconsistent document formats. Manual extraction and review can be repetitive and error-prone.",
    approach:
      "A system that converts construction BOQ information into structured, reviewable data.",
    features: [
      { name: "PDF and spreadsheet ingestion", state: "In development" },
      { name: "BOQ line-item extraction", state: "In development" },
      { name: "Unit and quantity identification", state: "In development" },
      { name: "Structured item classification", state: "Planned" },
      { name: "Duplicate and inconsistency detection", state: "Planned" },
      { name: "Quantity validation support", state: "Planned" },
      { name: "Human review interface", state: "Planned" },
      { name: "Exportable structured BOQ", state: "Planned" },
    ],
    flow: ["Original BOQ", "Extracted fields", "Structured table", "Validation", "Review"],
    architecture: [
      "Document ingest",
      "Extraction model",
      "Classification",
      "Validation rules",
      "Review UI",
      "Export",
    ],
    ctas: [{ label: "Explore prototype" }, { label: "View document workflow", hash: "workflow" }],
    media: { image: s3 },
  },
  {
    slug: "expansion-joint-automation",
    number: "S1",
    title: "Expansion Joint Engineering Automation",
    tier: "specialized",
    industry: "Industrial Equipment Engineering",
    status: ["Delivered Components"],
    statusNote: "Delivered components.",
    summary:
      "Engineering calculations, BOM preparation, costing, and technical documentation workflows.",
    problem:
      "Expansion joint design involves repeated calculations, BOM preparation, and documentation for each enquiry.",
    approach:
      "Structured inputs feed a calculation engine whose outputs drive the BOM, costing, and documents.",
    features: [
      { name: "Engineering calculations", state: "Implemented" },
      { name: "BOM preparation", state: "Implemented" },
      { name: "Costing", state: "Implemented" },
      { name: "Technical documentation", state: "To verify" },
    ],
    flow: ["Inputs", "Calculations", "BOM", "Costing", "Documents"],
    architecture: ["Input templates", "Calculation engine", "BOM schema", "Document output"],
    ctas: [{ label: "View system" }, { label: "View workflow", hash: "workflow" }],
    media: { image: p1w },
  },
  {
    slug: "pressure-vessel-tools",
    number: "S2",
    title: "Pressure Vessel Engineering Tools",
    tier: "specialized",
    industry: "Industrial Equipment Engineering",
    status: ["Delivered Components", "In Development"],
    statusNote: "Delivered components with further development ongoing.",
    summary: "Pressure vessel calculation and engineering workflow automation.",
    problem: "Vessel design calculations are repeated by hand across similar enquiries.",
    approach: "Reusable calculation workflows with structured inputs and consistent outputs.",
    features: [
      { name: "Design calculations", state: "Implemented" },
      { name: "Engineering workflow automation", state: "In development" },
    ],
    flow: ["Inputs", "Calculations", "Outputs"],
    architecture: ["Input templates", "Calculation engine", "Report output"],
    ctas: [{ label: "View system" }, { label: "View workflow", hash: "workflow" }],
    media: { image: s2 },
  },
  {
    slug: "vendor-registration",
    number: "S3",
    title: "Vendor Registration Automation",
    tier: "specialized",
    industry: "Procurement / Operations",
    status: ["Planned"],
    statusNote: "Proposed workflow. Not built.",
    summary: "A proposed workflow for organizing vendor documentation and registration processes.",
    problem: "Vendor documents arrive through email and are tracked manually.",
    approach: "A structured intake and checklist workflow for vendor registration.",
    features: [
      { name: "Vendor document intake", state: "Planned" },
      { name: "Registration checklist", state: "Planned" },
    ],
    flow: ["Intake", "Checklist", "Approval"],
    architecture: ["Intake form", "Document store", "Approval workflow"],
    ctas: [{ label: "View concept" }, { label: "View workflow", hash: "workflow" }],
    media: { image: p3w },
  },
  {
    slug: "workforce-resource-management",
    number: "S4",
    title: "Workforce & Resource Management",
    tier: "specialized",
    industry: "Operations",
    status: ["In Development"],
    statusNote: "Current implementation to be verified by Swayam before publishing.",
    summary:
      "Operational software concepts and tools for attendance, workforce information, and resource allocation.",
    problem: "Attendance and allocation data is held in separate registers and spreadsheets.",
    approach: "A shared workforce record with attendance and allocation views.",
    features: [
      { name: "Attendance", state: "To verify" },
      { name: "Workforce information", state: "To verify" },
      { name: "Resource allocation", state: "To verify" },
    ],
    flow: ["Attendance", "Records", "Allocation"],
    architecture: ["Web client", "Workforce records", "Allocation views"],
    ctas: [{ label: "View system" }, { label: "View workflow", hash: "workflow" }],
    media: { image: s1 },
  },
  {
    slug: "medpulse",
    statusLabel: "Research",
    number: "R1",
    title: "MedPulse",
    tier: "research",
    industry: "Applied AI Research",
    status: ["Research"],
    statusNote: "Research project. Not a clinical tool; no diagnostic effectiveness is claimed.",
    summary:
      "Research exploring the use of multimodal AI and handwriting-related features for early detection of physician burnout.",
    problem:
      "Physician burnout is often recognised late; everyday artefacts such as handwriting may carry early signals worth studying.",
    approach:
      "Combine handwriting-related features with other modalities in a multimodal model, studied as research.",
    features: [
      { name: "Research methodology", state: "Implemented" },
      { name: "Published patent application", state: "Implemented" },
      { name: "Clinical validation", state: "Planned" },
    ],
    flow: ["Handwriting samples", "Feature extraction", "Multimodal fusion", "Research signal"],
    architecture: ["Image preprocessing", "Feature extraction", "Multimodal fusion", "Evaluation"],
    ctas: [{ label: "Read research summary" }, { label: "View method", hash: "workflow" }],
    media: {},
    patent: "202621080973 A",
  },
];

export const flagships = projects.filter((p) => p.tier === "flagship");
export const specialized = projects.filter((p) => p.tier === "specialized");
export const research = projects.filter((p) => p.tier === "research");
export const bySlug = (slug: string) => projects.find((p) => p.slug === slug)!;

/** Original studio-inspired opening. No affiliations or outcomes are implied. */
export const heroDirection = {
  intro:
    "Operational software and engineering automation for manufacturing, construction, EPC and real estate.",
};

export const capabilities = [
  {
    title: "Operational Intelligence Systems",
    problem: "When teams cannot see the same operational picture.",
    description:
      "Connected views of jobs, production stages and departmental information, designed around how work moves through your business.",
    examples: "Production visibility / job tracking / departmental workflows",
    project: "production-intelligence",
  },
  {
    title: "AI & Document Automation",
    problem: "When documents become a manual processing queue.",
    description:
      "Turn document-heavy processes into structured, reviewable workflows, with human judgment kept in the loop.",
    examples: "BOQ review / tender information / structured extraction",
    project: "boq-intelligence",
  },
  {
    title: "Engineering & Process Automation",
    problem: "When skilled people repeat the same preparation work.",
    description:
      "Purpose-built tools for engineering calculations, bills of materials and technical outputs, with clear inputs and review points.",
    examples: "Calculation tools / BOM preparation / technical documentation",
    project: "engineering-automation",
  },
  {
    title: "Custom Business Platforms & Integrations",
    problem: "When information is split across tools and teams.",
    description:
      "Practical business platforms and integration workflows shaped around existing systems, responsibilities and operational constraints.",
    examples: "Internal platforms / shared records / integration planning",
    project: "manufacturing-operating-system",
  },
];
export const engagementSteps = [
  {
    title: "Understand the problem",
    description:
      "A complimentary 20-minute discovery call to discuss your business problem, current workflow and whether I can help.",
  },
  {
    title: "Define a useful scope",
    description:
      "For complex requirements, a paid workflow assessment documents the scope, recommended architecture, implementation phases and commercial proposal.",
  },
  {
    title: "Build and validate",
    description:
      "Implement in agreed phases, review with the people using the system and validate it against the scoped requirements.",
  },
  {
    title: "Deploy and improve",
    description:
      "Plan deployment, handover and ongoing support. Agree the next improvements as the system meets real operational needs.",
  },
];
export const homepageIndustries = [
  {
    label: "Manufacturing",
    scene: 0,
    focus: "A clearer view of production and operations.",
    body: "Explore production tracking, departmental information and engineering workflows through the systems below.",
    destination: "production-intelligence",
    action: "Explore production workflows",
  },
  {
    label: "Construction",
    scene: 2,
    focus: "Make project information easier to work with.",
    body: "Explore a sample BOQ workflow that organizes line items and makes review decisions explicit.",
    destination: "boq-intelligence",
    action: "Explore the BOQ prototype",
  },
  {
    label: "Real Estate",
    scene: 3,
    focus: "Connect development information to decisions.",
    body: "Discuss your project information and business workflows. The BOQ prototype offers one relevant example for development teams; it is not a deployed property platform.",
    destination: "boq-intelligence",
    action: "Explore document workflows",
  },
  {
    label: "EPC & Engineering",
    scene: 1,
    focus: "Less repetitive preparation. More structured review.",
    body: "Explore engineering calculation tools, BOM workflows and the developing tender-to-quotation concept.",
    destination: "engineering-automation",
    action: "Inspect engineering systems",
  },
];

/** Conceptual portfolio workflow, not a live client-system integration. */
export const workflowExplorer = {
  title: "From separate workflows to a shared picture.",
  disconnected:
    "Drawings, job updates, documents and commercial information can sit in separate tools. Choose a workflow to see how a connected system could bring its handoffs into view.",
  connected:
    "A shared project record connects the handoffs between teams. Explore each workflow to see a relevant example and its actual development status.",
  workflows: [
    {
      id: "engineering",
      label: "Engineering",
      artifact: "Drawing → BOM",
      title: "Engineering information becomes a usable input.",
      description:
        "Follow the relationship between drawing parameters, calculation outputs and a structured bill of materials. The example uses illustrative values; it is not a certified design calculator.",
      handoff: "Engineering inputs → calculation review → BOM",
      project: "engineering-automation",
      x: 170,
      y: 145,
    },
    {
      id: "production",
      label: "Production",
      artifact: "Job → stage → owner",
      title: "A shared job record brings production into view.",
      description:
        "Explore sample job stages and departmental views in the Production Intelligence Platform. Its active pilot/development status is distinct from a fully deployed enterprise platform.",
      handoff: "Job record → departmental stages → review",
      project: "production-intelligence",
      x: 460,
      y: 110,
    },
    {
      id: "documents",
      label: "Documents",
      artifact: "Source → structured review",
      title: "Document information stays connected to review.",
      description:
        "The BOQ prototype illustrates source information, structured rows and explicit review decisions. This portfolio demonstration uses sample data, not a live extraction service.",
      handoff: "Sample BOQ → structured items → human review",
      project: "boq-intelligence",
      x: 490,
      y: 325,
    },
    {
      id: "commercial",
      label: "Commercial",
      artifact: "Tender → specification",
      title: "Requirements become a clearer commercial starting point.",
      description:
        "Inspect the tender/RFQ-to-quotation concept: source requirements, structured specifications, engineering review and a quotation draft. Scope remains planned/in development and requires verification.",
      handoff: "Tender / RFQ → engineering review → quotation draft",
      project: "tender-to-quotation",
      x: 810,
      y: 190,
    },
  ],
};

export type ProjectEvidence = {
  kind: "department-map" | "production-view" | "engineering-bom" | "tender-review" | "boq-review";
  title: string;
  demonstrates: string;
  limitation: string;
  nextArtifact: string;
};
/** Existing portfolio samples explain intent; no verified client artifacts supplied yet. */
export const projectEvidence: Record<string, ProjectEvidence> = {
  "manufacturing-operating-system": {
    kind: "department-map",
    title: "A departmental handoff model",
    demonstrates:
      "How engineering, procurement, production and quality information could relate to a shared job record.",
    limitation:
      "Conceptual architecture for an in-development platform. The diagram does not establish that every department or integration is implemented.",
    nextArtifact:
      "A redacted capture of currently working modules, with module-by-module status and Swayam’s contribution confirmed.",
  },
  "production-intelligence": {
    kind: "production-view",
    title: "A production overview using sample jobs",
    demonstrates:
      "How a job list can bring equipment and current production stages into one readable view.",
    limitation:
      "This is a portfolio-built sample interface, not a screenshot or data feed from the active pilot. It does not demonstrate live updates or production deployment.",
    nextArtifact:
      "A permitted pilot screenshot or short recording showing job tracking and a real stage change, with confidential information removed.",
  },
  "engineering-automation": {
    kind: "engineering-bom",
    title: "A structured engineering BOM example",
    demonstrates:
      "The relationship between engineering preparation and structured component, material and quantity information.",
    limitation:
      "Values below are illustrative, not an export from a delivered calculation tool. No engineering-code compliance, design approval or calculation accuracy is claimed by this sample.",
    nextArtifact:
      "A redacted input/output pair from a delivered tool, plus confirmation of the calculation/BOM scope and review process.",
  },
  "tender-to-quotation": {
    kind: "tender-review",
    title: "From a sample requirement to reviewable fields",
    demonstrates:
      "The proposed relationship between a tender clause, structured specification and human review before quotation preparation.",
    limitation:
      "A deterministic concept example. It does not run document extraction or generate a commercial quotation. Current implementation scope remains to be verified.",
    nextArtifact:
      "Confirm built versus planned stages, then provide a permitted sample document and actual output if those stages are implemented.",
  },
  "boq-intelligence": {
    kind: "boq-review",
    title: "A sample BOQ validation view",
    demonstrates:
      "How missing quantities, potential duplicates and unit issues can be made visible to a reviewer.",
    limitation:
      "The flags are predefined for this sample. They are not measured AI extraction results; working review controls in the portfolio do not imply the product’s review capability has shipped.",
    nextArtifact:
      "A source page and actual prototype extraction output, with known errors and current working functionality documented.",
  },
};

export const contactDetails = {
  email: "sswayam506@gmail.com",
  discoverySubject: "20-minute discovery call — project inquiry",
};

/** Deterministic demonstration data, never evidence of client deployment. */
export const interactionSamples = {
  jobs: [
    { id: "J-2401", name: "Heat exchanger", stage: 2, owner: "Fab-A" },
    { id: "J-2402", name: "Pressure vessel", stage: 3, owner: "QC" },
    { id: "J-2403", name: "Expansion joint ×6", stage: 1, owner: "Purch." },
    { id: "J-2404", name: "Piping skid", stage: 4, owner: "Stores" },
  ],
  stages: ["Engineering", "Procurement", "Fabrication", "Quality", "Dispatch"],
  bom: [
    { name: "Bellows element", perAssembly: 1 },
    { name: "End connection", perAssembly: 2 },
    { name: "Tie rod", perAssembly: 4 },
  ],
  tender: [
    {
      clause: "4.1 Scope",
      excerpt: "Six (6) nos. metallic bellows expansion joints",
      field: "Quantity",
      value: "6 nos.",
    },
    {
      clause: "4.2 Design basis",
      excerpt: "Design pressure of 10 barg and design temperature of 350 °C",
      field: "Design conditions",
      value: "10 barg / 350 °C",
    },
    {
      clause: "4.3 Materials",
      excerpt: "Bellows shall be SS 321",
      field: "Bellows material",
      value: "SS 321",
    },
  ],
  boqNotes: {
    "2.04":
      "The sample source has no quantity. Request clarification; do not infer a quantity from another row.",
    "2.11":
      "Similar wording to item 2.04. Compare scope, location and inclusions before deciding whether this is a duplicate.",
    "3.02":
      "The stated area unit needs review against the measurement basis and scope. This sample flag is a review prompt, not an automatic correction.",
  } as Record<string, string>,
};

/** Concise homepage copy; status and sample disclosures remain with the relevant work. */
export const homepageCopy = {
  workIntro: "Operational platforms, engineering tools and document workflows.",
  engagementNote: "Scope and delivery are agreed after discovery.",
  contactIntro:
    "Tell me what is slowing your team down. Start with a complimentary 20-minute discovery call.",
  workflowInstruction: "Choose a workflow.",
  workflowSample: "Illustrative workflow",
  industrySample: "Illustrative environment.",
};
