import type { CaseStudyProject } from "./case-study";
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

/** Phase 2: relevance mapping describes prospective applications, never deployments. */
export const consultingIndustries = [
  {
    id: "manufacturing",
    label: "Manufacturing",
    icon: "factory",
    title: "Bring the production picture together.",
    copy: "Connect job information, departmental updates and engineering preparation around the work.",
    useCases: [
      "Production visibility",
      "Job and stage tracking",
      "Engineering-to-production handoffs",
    ],
    projectSlugs: [
      "production-intelligence",
      "manufacturing-operating-system",
      "engineering-automation",
      "tender-to-quotation",
    ],
  },
  {
    id: "epc",
    label: "EPC & Engineering",
    icon: "engineering",
    title: "Give engineering work a clearer flow.",
    copy: "Structure calculations, BOM preparation and tender review without losing the engineering judgment.",
    useCases: [
      "Calculation and BOM workflows",
      "Technical document preparation",
      "Tender and quotation review",
    ],
    projectSlugs: [
      "engineering-automation",
      "tender-to-quotation",
      "manufacturing-operating-system",
    ],
  },
  {
    id: "construction",
    label: "Construction",
    icon: "construction",
    title: "Make project documents easier to act on.",
    copy: "Explore reviewable BOQ information and document handoffs for estimation teams.",
    useCases: ["BOQ information review", "Quantity clarification", "Estimation document workflows"],
    projectSlugs: ["boq-intelligence"],
  },
  {
    id: "real-estate",
    label: "Real Estate",
    icon: "building",
    title: "Find clarity in development information.",
    copy: "Discuss document and operational workflows. The BOQ prototype is a relevant starting point, not a deployed property platform.",
    useCases: [
      "Development document review",
      "Estimation information access",
      "Project information handoffs",
    ],
    projectSlugs: ["boq-intelligence"],
  },
] as const;
export type ConsultingIndustry = (typeof consultingIndustries)[number];
export type ConsultingIndustryId = ConsultingIndustry["id"];
export const homepageProjectPreviews: Record<
  string,
  {
    challenge: string;
    solution: string;
    kind: "production" | "platform" | "engineering" | "tender" | "boq";
  }
> = {
  "production-intelligence": {
    challenge: "Job updates are scattered across teams and spreadsheets.",
    solution: "A shared view of jobs, production stages and departmental information.",
    kind: "production",
  },
  "manufacturing-operating-system": {
    challenge: "Departments work from disconnected operational records.",
    solution: "A developing platform for connected departmental workflows.",
    kind: "platform",
  },
  "engineering-automation": {
    challenge: "Skilled engineers repeat calculation and BOM preparation.",
    solution: "Purpose-built calculation, BOM and costing workflows.",
    kind: "engineering",
  },
  "tender-to-quotation": {
    challenge: "Tender requirements need repeated review and manual transfer.",
    solution: "A proposed document-to-specification and quotation workflow.",
    kind: "tender",
  },
  "boq-intelligence": {
    challenge: "BOQ information is difficult to extract and review consistently.",
    solution: "A prototype for structured BOQ information and human review.",
    kind: "boq",
  },
};
export const consultingHomepage = {
  eyebrow: "Independent AI & Solutions Consultant",
  headline: ["Complex operations.", "Simpler systems."],
  intro:
    "I design AI, automation, and custom software solutions for manufacturing, construction, and real estate businesses.",
  outcomes: [
    "Better operational visibility",
    "Reduced repetitive data entry",
    "More structured engineering workflows",
    "Faster information access",
    "Clearer ownership and handoffs",
  ],
  steps: [
    {
      title: "Understand the workflow",
      description: "Start with a free introductory discovery call about your team’s bottleneck.",
    },
    {
      title: "Define a useful scope",
      description:
        "For complex needs, an optional paid workflow assessment sets out scope, architecture and phases.",
    },
    {
      title: "Build and validate",
      description: "Build in agreed phases and review working systems with the people using them.",
    },
    {
      title: "Deploy and improve",
      description: "Agree deployment, handover and the next useful improvements.",
    },
  ],
  about:
    "I’m Swayam Singh, an independent AI & Solutions Consultant. My consulting experience includes manufacturing and engineering operations in Gujarat, India.",
  approach:
    "I work directly with teams to understand the workflow and build around practical operating constraints.",
};

/** Phase 4 editorial stories. Legacy projects remain intact for demos and migration. */
const caseStudyEditorial: Record<
  string,
  { summary: string; focus: string; limitations: string[]; assets: string[] }
> = {
  "production-intelligence": {
    summary:
      "Active pilot / in development, as reported in the project brief. Pilot deployment and capability scope have not been independently verified here.",
    focus:
      "The brief centers on equipment and job tracking, production stages, departmental views and BOM-based workflows. The portfolio sample demonstrates fixed job records and stage/owner views; it is not the pilot application or a live production feed.",
    limitations: [
      "Pilot status is an authored statement; no pilot acceptance record or operating deployment evidence was supplied.",
      "Procurement visibility, quality inspection tracking and task ownership still require scope confirmation.",
    ],
    assets: [
      "Permitted pilot screenshot of job tracking and departmental views",
      "Recording of an actual stage change and BOM handoff, with version and scope",
    ],
  },
  "engineering-automation": {
    summary:
      "Delivered components / ongoing development, as reported. The repository does not contain delivered tool artifacts or acceptance evidence.",
    focus:
      "Calculation, BOM and costing tools are reported as implemented. Technical document generation and data validation remain in development; drawing automation and CAD integration are planned. The sample BOM interaction is illustrative and does not validate engineering calculations.",
    limitations: [
      "No delivered calculation input/output or engineering review record has been supplied.",
      "The portfolio does not establish calculation accuracy, engineering-code compliance or CAD integration.",
    ],
    assets: [
      "Real calculation input/output and review context",
      "Actual BOM/costing export and documentation capture, separating working and planned stages",
    ],
  },
  "manufacturing-operating-system": {
    summary:
      "Platform in development. No complete enterprise deployment or production readiness is established.",
    focus:
      "The platform vision connects departments around shared operational information. Dashboard, departmental interfaces, job management and production coordination are described as in development. Documents, procurement, quality, roles and integrations remain planned.",
    limitations: [
      "The architecture is a system vision, not a deployed enterprise inventory.",
      "No working-module capture or integration evidence has been supplied.",
    ],
    assets: [
      "Current module capture with version and module-by-module implementation state",
      "Permitted architecture or integration evidence for any implemented connections",
    ],
  },
  "tender-to-quotation": {
    summary:
      "Planned / in development. Working extraction and automation scope have not been verified.",
    focus:
      "The proposed workflow links a source requirement, structured specifications, engineering review and a quotation draft. The portfolio maps predefined clauses to fields; it does not extract a live document or generate a commercial quotation.",
    limitations: [
      "Document ingestion and technical extraction are unverified, not confirmed working capabilities.",
      "End-to-end specification, costing, quotation generation and approval remain planned.",
    ],
    assets: [
      "Confirmation of built versus planned extraction stages",
      "Permitted actual source document and generated output, if those stages work",
    ],
  },
  "boq-intelligence": {
    summary:
      "Prototype / in development. No extraction accuracy, customer deployment or ROI is established.",
    focus:
      "The prototype brief focuses on ingestion, line-item extraction and quantity/unit information. Its portfolio sample demonstrates predefined flags and review decisions. These controls are not evidence of product extraction or validation accuracy.",
    limitations: [
      "Sample flags are deterministic, not measured AI results.",
      "Classification, duplicate detection, quantity validation, review UI and export are planned in the product brief.",
    ],
    assets: [
      "Actual BOQ source page and prototype output with known errors",
      "Recording of the working validation/review stages, clearly separated from planned scope",
    ],
  },
  medpulse: {
    summary:
      "Applied AI research. Not a clinical tool; no validated diagnostic effectiveness is claimed.",
    focus:
      "MedPulse explores handwriting-related features and multimodal AI for physician burnout research. The supplied application reference is 202621080973 A. Publication, attribution and methodology have not been verified from an official record in this repository; it is not presented as a granted patent.",
    limitations: [
      "No official application publication or attribution document was supplied.",
      "No clinical validation or diagnostic effectiveness is established.",
    ],
    assets: [
      "Official application publication and attribution record",
      "Permitted research method, evaluation and limitations material",
    ],
  },
};

/** Populate only with approved real media and evidence. Legacy industrial plates are excluded. */
export const caseStudyEvidence: Partial<
  Record<
    string,
    Pick<
      CaseStudyProject,
      | "screenshots"
      | "videoPoster"
      | "videoSource"
      | "videoCaptions"
      | "videoTranscript"
      | "verifiedCapabilities"
      | "verifiedOutcomes"
      | "lastVerifiedDate"
      | "technologyStack"
    >
  >
> = {};

/** No delivered capability is promoted into verifiedCapabilities without an evidence artifact. */
export const caseStudies: CaseStudyProject[] = projects.map((project) => {
  const editorial = caseStudyEditorial[project.slug];
  const sectors = consultingIndustries
    .filter((s) => s.projectSlugs.some((slug) => slug === project.slug))
    .map((s) => s.label);
  return {
    id: project.slug,
    slug: project.slug,
    title: project.title,
    kind: project.tier === "research" ? "research" : "industrial",
    industries: sectors.length ? sectors : [project.industry],
    shortDescription: project.summary,
    businessProblem: project.problem,
    solutionSummary: project.approach,
    maturityStatus: {
      labels: project.status,
      summary:
        editorial?.summary ??
        (project.slug === "workforce-resource-management"
          ? "Development scope remains unverified."
          : `${project.status.join(" / ")}, as reported in the brief. Product implementation evidence has not been supplied.`),
    },
    verifiedCapabilities: [],
    reportedImplementedCapabilities: project.features
      .filter((f) => f.state === "Implemented")
      .map((f) => f.name),
    unverifiedCapabilities: project.features
      .filter((f) => f.state === "To verify")
      .map((f) => f.name),
    inDevelopmentCapabilities: project.features
      .filter((f) => f.state === "In development")
      .map((f) => f.name),
    plannedCapabilities: project.features.filter((f) => f.state === "Planned").map((f) => f.name),
    technologyStack: [],
    architectureSummary: {
      description:
        "Conceptual layers from the existing project brief. These do not establish a deployed stack or implemented integrations.",
      layers: project.architecture,
      conceptual: true,
    },
    screenshots: [],
    videoPoster: null,
    videoSource: project.media.video ?? null,
    videoCaptions: [],
    videoTranscript: null,
    verifiedOutcomes: [],
    limitations: editorial?.limitations ?? [
      "The authored implementation state has not been independently verified from product artifacts.",
      "No measured outcomes or production-readiness evidence was supplied.",
    ],
    caseStudySections: editorial
      ? [
          {
            id: project.tier === "research" ? "research-context" : "scope-context",
            title:
              project.tier === "research"
                ? "Research context & attribution"
                : "What this brief establishes",
            paragraphs: [editorial.focus],
          },
        ]
      : [],
    relatedProjects: projects
      .filter((p) => p.slug !== project.slug && p.tier === project.tier)
      .slice(0, 2)
      .map((p) => p.slug),
    lastVerifiedDate: null,
    workflow: project.flow,
    sampleUrl: project.tier === "flagship" ? `/samples#${project.slug}-demo` : null,
    assetRequirements: editorial?.assets ?? [
      "Permitted working input/output or product screenshots",
      "Confirmation of your contribution, implementation scope and publication permission",
    ],
    ...caseStudyEvidence[project.slug],
  };
});

/** Advisor relevance vocabulary: public retrieval hints, never evidence of delivery. */
export const advisorProjectTerms: Record<string, string[]> = {
  "production-intelligence": [
    "production",
    "job tracking",
    "stage",
    "fabrication",
    "bottleneck",
    "department",
    "plant",
    "job status",
  ],
  "manufacturing-operating-system": [
    "operating system",
    "unified",
    "connected departments",
    "enterprise platform",
    "multi organization",
    "shared records",
  ],
  "engineering-automation": [
    "engineering",
    "calculation",
    "bom",
    "costing",
    "cad",
    "design automation",
    "documentation",
  ],
  "tender-to-quotation": [
    "tender",
    "rfq",
    "quotation",
    "quote",
    "specification",
    "engineering sales",
  ],
  "boq-intelligence": [
    "boq",
    "bill of quantities",
    "quantity",
    "quantities",
    "estimat",
    "construction document",
    "pdf",
    "extraction",
    "duplicate",
  ],
  "expansion-joint-automation": ["expansion joint", "bellows"],
  "pressure-vessel-tools": ["pressure vessel", "vessel calculation"],
  "vendor-registration": ["vendor", "registration", "supplier onboarding"],
  "workforce-resource-management": ["workforce", "attendance", "resource allocation"],
  medpulse: ["medpulse", "burnout", "handwriting", "physician", "patent"],
};
export const advisorSuggestedPrompts = [
  "How could I get a clearer view of production jobs?",
  "Which engineering and BOM workflows are in your portfolio?",
  "What does the BOQ prototype actually demonstrate?",
  "Is tender extraction implemented or planned?",
];
