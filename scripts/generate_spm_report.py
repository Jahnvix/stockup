from pathlib import Path
from textwrap import dedent


ROOT = Path(__file__).resolve().parent.parent
DOCS_DIR = ROOT / "docs"
HTML_OUTPUT = DOCS_DIR / "SPM_Report_Inventory_Management_System.html"


def p(text: str) -> str:
    return f"<p>{text}</p>"


def paragraphs(items) -> str:
    return "".join(p(item) for item in items)


def bullet_list(items) -> str:
    return "<ul>" + "".join(f"<li>{item}</li>" for item in items) + "</ul>"


def ordered_list(items) -> str:
    return "<ol>" + "".join(f"<li>{item}</li>" for item in items) + "</ol>"


def table(headers, rows) -> str:
    head = "".join(f"<th>{header}</th>" for header in headers)
    body = "".join(
        "<tr>" + "".join(f"<td>{cell}</td>" for cell in row) + "</tr>" for row in rows
    )
    return f"<table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>"


def section(title: str, body: str) -> str:
    return f"<div class='section'><h3>{title}</h3>{body}</div>"


def page(experiment: str, title: str, body: str, page_no: int) -> str:
    return dedent(
        f"""
        <section class="page">
          <header class="page-header">
            <div>{experiment}</div>
            <div>Inventory Management System</div>
          </header>
          <main class="page-body">
            <h2>{title}</h2>
            {body}
          </main>
          <footer class="page-footer">Page {page_no}</footer>
        </section>
        """
    )


def cover_page(page_no: int) -> str:
    return dedent(
        f"""
        <section class="page cover-page">
          <div class="cover-box">
            <p class="cover-eyebrow">Software Project Management Report</p>
            <h1>Inventory Management System</h1>
            <p class="lead">
              A detailed academic project report for a full-stack MERN inventory solution
              with secure authentication, product catalog management, stock movement
              tracking, dashboard insights, and a soft-tone responsive user interface.
            </p>
            <div class="meta-grid">
              <div class="meta-card"><strong>Project Type</strong><span>Full-stack MERN web application</span></div>
              <div class="meta-card"><strong>Technology Stack</strong><span>MongoDB, Express, React, Node.js, Vite</span></div>
              <div class="meta-card"><strong>Documentation Style</strong><span>SPM and SRS report in experiment format</span></div>
              <div class="meta-card"><strong>Date</strong><span>09 April 2026</span></div>
            </div>
          </div>
          <footer class="page-footer">Page {page_no}</footer>
        </section>
        """
    )


def toc_page(entries, page_no: int) -> str:
    return page(
        "Front Matter",
        "Table of Contents",
        table(["Section", "Page"], entries)
        + section(
            "Document Note",
            paragraphs(
                [
                    "This report follows the same broad academic pattern as the sample document: experiment-wise presentation, detailed theory, problem statement, software requirements specification, UML diagrams, planning artefacts, metrics, cost analysis, resource allocation, team organization, and concluding observations.",
                    "The final report is intentionally formatted in black-and-white text for print-friendly submission. The material is expanded so the generated PDF reaches a length comparable to the sample file.",
                ]
            ),
        ),
        page_no,
    )


def diagram_block(title: str, svg: str, explanation) -> str:
    return (
        f"<div class='diagram-block'><h4>{title}</h4>{svg}</div>"
        + paragraphs(explanation)
    )


def use_case_svg() -> str:
    return dedent(
        """
        <svg viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg">
          <rect x="210" y="22" width="340" height="214" fill="#fff" stroke="#000" stroke-width="1.4"/>
          <text x="380" y="42" text-anchor="middle" font-size="16">Inventory Management System</text>
          <circle cx="70" cy="86" r="16" fill="#f8f8f8" stroke="#000"/>
          <line x1="70" y1="102" x2="70" y2="144" stroke="#000"/>
          <line x1="48" y1="117" x2="92" y2="117" stroke="#000"/>
          <line x1="70" y1="144" x2="50" y2="171" stroke="#000"/>
          <line x1="70" y1="144" x2="90" y2="171" stroke="#000"/>
          <text x="70" y="192" text-anchor="middle" font-size="13">Admin</text>
          <circle cx="690" cy="86" r="16" fill="#f8f8f8" stroke="#000"/>
          <line x1="690" y1="102" x2="690" y2="144" stroke="#000"/>
          <line x1="668" y1="117" x2="712" y2="117" stroke="#000"/>
          <line x1="690" y1="144" x2="670" y2="171" stroke="#000"/>
          <line x1="690" y1="144" x2="710" y2="171" stroke="#000"/>
          <text x="690" y="192" text-anchor="middle" font-size="13">Staff</text>
          <ellipse cx="380" cy="76" rx="86" ry="22" fill="#fafafa" stroke="#000"/>
          <text x="380" y="81" text-anchor="middle" font-size="13">Authenticate User</text>
          <ellipse cx="380" cy="116" rx="98" ry="22" fill="#fafafa" stroke="#000"/>
          <text x="380" y="121" text-anchor="middle" font-size="13">Manage Product Catalog</text>
          <ellipse cx="380" cy="156" rx="102" ry="22" fill="#fafafa" stroke="#000"/>
          <text x="380" y="161" text-anchor="middle" font-size="13">Record Stock Movement</text>
          <ellipse cx="380" cy="196" rx="84" ry="22" fill="#fafafa" stroke="#000"/>
          <text x="380" y="201" text-anchor="middle" font-size="13">View Dashboard</text>
          <line x1="86" y1="86" x2="294" y2="76" stroke="#000"/>
          <line x1="90" y1="116" x2="282" y2="116" stroke="#000"/>
          <line x1="90" y1="144" x2="278" y2="156" stroke="#000"/>
          <line x1="674" y1="86" x2="466" y2="76" stroke="#000"/>
          <line x1="670" y1="118" x2="482" y2="156" stroke="#000"/>
          <line x1="670" y1="145" x2="464" y2="196" stroke="#000"/>
        </svg>
        """
    )


def class_svg() -> str:
    return dedent(
        """
        <svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="42" width="160" height="138" fill="#fff" stroke="#000"/>
          <text x="100" y="63" text-anchor="middle" font-size="15">User</text>
          <line x1="20" y1="72" x2="180" y2="72" stroke="#000"/>
          <text x="30" y="94" font-size="12">id, name, email</text>
          <text x="30" y="114" font-size="12">password, role</text>
          <rect x="220" y="42" width="160" height="108" fill="#fff" stroke="#000"/>
          <text x="300" y="63" text-anchor="middle" font-size="15">Category</text>
          <line x1="220" y1="72" x2="380" y2="72" stroke="#000"/>
          <text x="230" y="94" font-size="12">id, name, slug</text>
          <text x="230" y="114" font-size="12">accentColor</text>
          <rect x="420" y="22" width="172" height="190" fill="#fff" stroke="#000"/>
          <text x="506" y="44" text-anchor="middle" font-size="15">Product</text>
          <line x1="420" y1="54" x2="592" y2="54" stroke="#000"/>
          <text x="430" y="76" font-size="12">name, sku, description</text>
          <text x="430" y="96" font-size="12">category, supplier, location</text>
          <text x="430" y="116" font-size="12">quantity, reorderLevel</text>
          <text x="430" y="136" font-size="12">unitCost, unitPrice</text>
          <text x="430" y="156" font-size="12">status, updatedAt</text>
          <rect x="620" y="32" width="120" height="180" fill="#fff" stroke="#000"/>
          <text x="680" y="54" text-anchor="middle" font-size="15">StockMovement</text>
          <line x1="620" y1="64" x2="740" y2="64" stroke="#000"/>
          <text x="630" y="86" font-size="12">type, quantity</text>
          <text x="630" y="106" font-size="12">note, reference</text>
          <text x="630" y="126" font-size="12">previousQuantity</text>
          <text x="630" y="146" font-size="12">newQuantity</text>
          <text x="630" y="166" font-size="12">performedBy</text>
          <line x1="180" y1="96" x2="220" y2="96" stroke="#000" stroke-width="1.4"/>
          <line x1="380" y1="96" x2="420" y2="96" stroke="#000" stroke-width="1.4"/>
          <line x1="592" y1="126" x2="620" y2="126" stroke="#000" stroke-width="1.4"/>
        </svg>
        """
    )


def activity_svg() -> str:
    return dedent(
        """
        <svg viewBox="0 0 760 190" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="95" rx="30" ry="18" fill="#fafafa" stroke="#000"/>
          <text x="60" y="100" text-anchor="middle" font-size="12">Start</text>
          <rect x="120" y="72" width="96" height="46" fill="#fff" stroke="#000"/>
          <text x="168" y="100" text-anchor="middle" font-size="12">Login</text>
          <rect x="270" y="72" width="120" height="46" fill="#fff" stroke="#000"/>
          <text x="330" y="100" text-anchor="middle" font-size="12">Select Product</text>
          <rect x="438" y="72" width="126" height="46" fill="#fff" stroke="#000"/>
          <text x="501" y="100" text-anchor="middle" font-size="12">Record Movement</text>
          <rect x="618" y="72" width="110" height="46" fill="#fff" stroke="#000"/>
          <text x="673" y="100" text-anchor="middle" font-size="12">Update Stock</text>
          <line x1="90" y1="95" x2="120" y2="95" stroke="#000" stroke-width="1.4"/>
          <line x1="216" y1="95" x2="270" y2="95" stroke="#000" stroke-width="1.4"/>
          <line x1="390" y1="95" x2="438" y2="95" stroke="#000" stroke-width="1.4"/>
          <line x1="564" y1="95" x2="618" y2="95" stroke="#000" stroke-width="1.4"/>
        </svg>
        """
    )


def sequence_svg() -> str:
    return dedent(
        """
        <svg viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg">
          <text x="80" y="24" text-anchor="middle" font-size="13">User</text>
          <text x="250" y="24" text-anchor="middle" font-size="13">React UI</text>
          <text x="460" y="24" text-anchor="middle" font-size="13">Express API</text>
          <text x="660" y="24" text-anchor="middle" font-size="13">DB Layer</text>
          <line x1="80" y1="34" x2="80" y2="220" stroke="#000" stroke-dasharray="5,5"/>
          <line x1="250" y1="34" x2="250" y2="220" stroke="#000" stroke-dasharray="5,5"/>
          <line x1="460" y1="34" x2="460" y2="220" stroke="#000" stroke-dasharray="5,5"/>
          <line x1="660" y1="34" x2="660" y2="220" stroke="#000" stroke-dasharray="5,5"/>
          <line x1="90" y1="68" x2="240" y2="68" stroke="#000"/><text x="165" y="58" text-anchor="middle" font-size="11">Login request</text>
          <line x1="260" y1="104" x2="450" y2="104" stroke="#000"/><text x="355" y="94" text-anchor="middle" font-size="11">POST /auth/login</text>
          <line x1="470" y1="140" x2="650" y2="140" stroke="#000"/><text x="560" y="130" text-anchor="middle" font-size="11">Validate and fetch records</text>
          <line x1="650" y1="176" x2="470" y2="176" stroke="#000"/><text x="560" y="166" text-anchor="middle" font-size="11">Return result</text>
          <line x1="450" y1="206" x2="260" y2="206" stroke="#000"/><text x="355" y="196" text-anchor="middle" font-size="11">Token and profile</text>
        </svg>
        """
    )


def component_svg() -> str:
    return dedent(
        """
        <svg viewBox="0 0 760 180" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="42" width="180" height="90" fill="#fff" stroke="#000"/>
          <text x="110" y="78" text-anchor="middle" font-size="14">React Frontend</text>
          <text x="110" y="100" text-anchor="middle" font-size="11">Dashboard, inventory, auth screens</text>
          <rect x="290" y="42" width="180" height="90" fill="#fff" stroke="#000"/>
          <text x="380" y="78" text-anchor="middle" font-size="14">Express Backend</text>
          <text x="380" y="100" text-anchor="middle" font-size="11">Controllers, routes, business rules</text>
          <rect x="560" y="42" width="180" height="90" fill="#fff" stroke="#000"/>
          <text x="650" y="78" text-anchor="middle" font-size="14">Persistence</text>
          <text x="650" y="100" text-anchor="middle" font-size="11">MongoDB or demo runtime store</text>
          <line x1="200" y1="86" x2="290" y2="86" stroke="#000" stroke-width="1.4"/>
          <line x1="470" y1="86" x2="560" y2="86" stroke="#000" stroke-width="1.4"/>
        </svg>
        """
    )


def deployment_svg() -> str:
    return dedent(
        """
        <svg viewBox="0 0 760 180" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="42" width="180" height="90" fill="#fff" stroke="#000"/>
          <text x="110" y="78" text-anchor="middle" font-size="14">Client Machine</text>
          <text x="110" y="100" text-anchor="middle" font-size="11">Browser access for admin/staff</text>
          <rect x="290" y="42" width="180" height="90" fill="#fff" stroke="#000"/>
          <text x="380" y="78" text-anchor="middle" font-size="14">Application Server</text>
          <text x="380" y="100" text-anchor="middle" font-size="11">Node.js runtime and static frontend</text>
          <rect x="560" y="42" width="180" height="90" fill="#fff" stroke="#000"/>
          <text x="650" y="78" text-anchor="middle" font-size="14">Database Server</text>
          <text x="650" y="100" text-anchor="middle" font-size="11">MongoDB Atlas or local DB node</text>
          <line x1="200" y1="86" x2="290" y2="86" stroke="#000" stroke-width="1.4"/>
          <line x1="470" y1="86" x2="560" y2="86" stroke="#000" stroke-width="1.4"/>
        </svg>
        """
    )


def topic_body(topic: str, focus: str, points, closing: str | None = None) -> str:
    if closing is None:
        closing = (
            f"The discussion of {topic.lower()} shows that the project is not only about writing code. "
            f"It also requires deliberate control over {focus.lower()} so the implemented system remains "
            f"correct, understandable, and suitable for academic evaluation."
        )

    return (
        section(
            "Discussion",
            paragraphs(
                [
                    f"{topic} is an important part of the Inventory Management System because it directly affects {focus.lower()}. In an academic software project, this area must be documented clearly so the reviewer can understand why the chosen design and planning decisions are reasonable.",
                    f"The project approaches {topic.lower()} through a practical MERN perspective. Instead of treating the subject as an isolated theory topic, the report connects it with inventory tasks such as product registration, quantity tracking, stock validation, dashboard reporting, and role-based usage.",
                    f"From a management angle, {topic.lower()} influences scope stability, implementation order, testing effort, and maintenance readiness. Therefore it deserves dedicated space in the report rather than being merged into a short summary.",
                ]
            ),
        )
        + section("Key Points", bullet_list(points))
        + section("Observation", p(closing))
    )


def build_content_pages():
    pages = []

    def add(experiment: str, title: str, body: str) -> None:
        pages.append((experiment, title, body))

    add(
        "Experiment-01",
        "Abstract and Project Summary",
        section(
            "Abstract",
            paragraphs(
                [
                    "The Inventory Management System is a full-stack MERN application created to support organized product records, stock movement tracking, and dashboard-based inventory visibility. The project responds to the practical need for a centralized inventory platform in place of disconnected spreadsheets and manual registers.",
                    "The implemented application allows users to sign in, manage products, group records into categories, track stock changes, and observe operational status through a dashboard. The codebase includes a React frontend, an Express backend, and a Mongo-oriented design with a stable demo runtime for local execution.",
                    "This report documents the project in an academic style parallel to the supplied sample, covering aim, theory, problem statement, detailed SRS, diagrams, WBS, Gantt planning, metrics, costing, resource planning, team structure, testing, risk, feasibility, implementation, and conclusion.",
                ]
            ),
        )
        + section(
            "Project Snapshot",
            table(
                ["Item", "Details"],
                [
                    ["Project Name", "Inventory Management System"],
                    ["Architecture", "Client-server MERN architecture"],
                    ["Primary Users", "Admin and Staff"],
                    ["Core Modules", "Authentication, Catalog, Stock Movement, Dashboard"],
                    ["Deployment Readiness", "GitHub + Render deployment support prepared"],
                    ["Documentation Goal", "Detailed SPM/SRS report matching the sample style"],
                ],
            ),
        ),
    )

    add(
        "Experiment-01",
        "Aim",
        section(
            "Aim Statement",
            p(
                "To study, analyze, design, implement, and document an Inventory Management System and to prepare a complete software project management report in the same experiment-oriented academic style as the reference sample."
            ),
        )
        + section(
            "Specific Goals",
            ordered_list(
                [
                    "Understand the inventory management problem and the limitations of manual systems.",
                    "Prepare a detailed Software Requirements Specification.",
                    "Model the system through UML and project planning artefacts.",
                    "Develop a working MERN solution with inventory and dashboard features.",
                    "Document the project in a print-ready SPM report of comparable length to the sample.",
                ]
            ),
        ),
    )

    add(
        "Experiment-01",
        "Theory of Software Project Management",
        section(
            "Theory",
            paragraphs(
                [
                    "Software Project Management is the discipline through which software work is planned, organized, monitored, and controlled. It ensures that technical work is aligned with goals, time limits, budget assumptions, and quality expectations.",
                    "A software project cannot be managed only by coding. Requirements, scheduling, design, testing, deployment preparation, documentation, and risk control all interact with one another. Good management therefore creates the conditions in which coding can actually succeed.",
                    "For an inventory system, project management is particularly relevant because the domain includes both information accuracy and process accuracy. A small defect in quantity handling can lead to visible operational mistakes, which makes disciplined design and verification essential.",
                    "This report adopts that discipline by connecting requirement engineering, design modelling, planning, cost analysis, and implementation into one coherent academic narrative.",
                ]
            ),
        ),
    )

    add(
        "Experiment-01",
        "Problem Statement Part I",
        topic_body(
            "Existing System Study",
            "understanding present inventory limitations",
            [
                "Manual and spreadsheet-driven record keeping often produces duplicate or stale data.",
                "Warehouse staff may not have one shared live source of truth for current stock.",
                "Reorder decisions are delayed because alerts are not built into the process.",
                "Movement history is hard to trace when logs are informal or distributed.",
            ],
            "The study of the existing environment shows a strong need for centralization, validation, and timely visibility.",
        ),
    )

    add(
        "Experiment-01",
        "Problem Statement Part II",
        topic_body(
            "Operational Challenges",
            "stock visibility and reliability",
            [
                "Users need quick answers about available quantity and item location.",
                "Managers need low-stock signals before shortages become operational problems.",
                "Teams need movement history to investigate mismatches and accountability.",
                "Organizations need a more reliable estimate of inventory value.",
            ],
            "The project therefore focuses on a system that reduces ambiguity, shortens lookup effort, and makes stock state easier to trust.",
        ),
    )

    add(
        "Experiment-01",
        "Proposed System Objectives",
        section(
            "Primary Objectives",
            ordered_list(
                [
                    "Create a centralized product and category repository.",
                    "Enable secure user authentication and protected access to inventory functions.",
                    "Support stock-in, stock-out, and adjustment operations with validation.",
                    "Provide dashboard insights for value, category spread, and low-stock situations.",
                    "Offer a calm, readable soft-tone interface for routine operations.",
                ]
            ),
        )
        + section(
            "Expected Outcomes",
            bullet_list(
                [
                    "Reduced inventory confusion and duplicate record handling.",
                    "Faster product lookup and movement logging.",
                    "Improved visibility into reorder-sensitive stock conditions.",
                    "A maintainable academic MERN codebase ready for further extension.",
                ]
            ),
        ),
    )

    add(
        "Experiment-01",
        "SRS Introduction",
        section(
            "Purpose of the SRS",
            paragraphs(
                [
                    "The Software Requirements Specification defines what the Inventory Management System must do and under which assumptions it will operate. It serves developers, testers, project reviewers, and stakeholders by giving them one structured reference point.",
                    "The SRS is especially important for this project because stock-related behavior should not be left implicit. Validation rules, user roles, and data relationships need to be stated clearly before or alongside implementation.",
                ]
            ),
        )
        + section(
            "Scope of the SRS",
            p(
                "The SRS covers system boundaries, user classes, functional requirements, non-functional requirements, interfaces, design assumptions, and requirement-linked diagrams for the Inventory Management System."
            ),
        ),
    )

    add(
        "Experiment-01",
        "Definitions, Acronyms, and Overview",
        table(
            ["Term", "Meaning"],
            [
                ["SRS", "Software Requirements Specification"],
                ["UI", "User Interface"],
                ["API", "Application Programming Interface"],
                ["JWT", "JSON Web Token"],
                ["CRUD", "Create, Read, Update, Delete"],
                ["WBS", "Work Breakdown Structure"],
                ["SDLC", "Software Development Life Cycle"],
            ],
        )
        + section(
            "Overview",
            paragraphs(
                [
                    "The report is organized into experiments to match academic presentation. Early pages focus on requirements and design. Middle pages focus on planning and measurement. Later pages focus on resources, testing, implementation, and project closure.",
                    "This structure mirrors the logic of real project work: understand the problem first, then plan and model the system, then estimate and organize resources, and finally review implementation and quality.",
                ]
            ),
        ),
    )

    add(
        "Experiment-01",
        "Product Perspective",
        topic_body(
            "Product Perspective",
            "system architecture and positioning",
            [
                "The system is a standalone web application using a client-server model.",
                "The React frontend provides interaction and display.",
                "The Express backend provides validation, routing, and business logic.",
                "MongoDB acts as the persistent data layer in standard MERN mode.",
            ],
            "The product perspective confirms that the system is best understood as a layered web application rather than a single monolithic script.",
        ),
    )

    add(
        "Experiment-01",
        "Product Functions",
        section(
            "Major Functions",
            bullet_list(
                [
                    "User registration and login",
                    "Product creation and update",
                    "Category-wise inventory organization",
                    "Search and filter operations",
                    "Stock-in, stock-out, and adjustment recording",
                    "Low-stock and out-of-stock monitoring",
                    "Recent movement history and inventory value display",
                ]
            ),
        )
        + section(
            "Function Summary",
            p(
                "These functions together create a compact but practical inventory workflow suitable for both academic demonstration and small-scale operational use."
            ),
        ),
    )

    add(
        "Experiment-01",
        "User Classes and Characteristics",
        table(
            ["User Class", "Characteristics", "System Need"],
            [
                ["Admin", "Higher control, responsible for overview and configuration", "Access to dashboard, product updates, and movement operations"],
                ["Staff", "Operational user focused on routine activity", "Fast stock logging and clear product lookup"],
            ],
        )
        + section(
            "Interpretation",
            paragraphs(
                [
                    "The user model remains deliberately simple so the project stays focused. Even with only two classes, responsibility boundaries are visible and useful for design and testing.",
                    "A future enhancement could add a manager role for analytics without full administrative permissions.",
                ]
            ),
        ),
    )

    add(
        "Experiment-01",
        "Operating Environment",
        table(
            ["Aspect", "Description"],
            [
                ["Platform", "Web-based application"],
                ["Client", "Modern browser"],
                ["Frontend Runtime", "React and built static assets"],
                ["Backend Runtime", "Node.js with Express"],
                ["Database", "MongoDB Atlas or local Mongo instance"],
                ["Deployment", "Render-ready production setup"],
            ],
        )
        + section(
            "Environment Note",
            p(
                "The operating environment is intentionally mainstream so the project remains portable, teachable, and easy to review."
            ),
        ),
    )

    add(
        "Experiment-01",
        "Design Constraints and Assumptions",
        section(
            "Design Constraints",
            bullet_list(
                [
                    "The interface must remain readable and responsive across common desktop and mobile widths.",
                    "Authentication must protect API routes from unauthorized access.",
                    "Invalid stock movements must be rejected before quantity corruption occurs.",
                    "The project must remain simple enough for academic submission and explanation.",
                ]
            ),
        )
        + section(
            "Assumptions and Dependencies",
            bullet_list(
                [
                    "Users provide correct stock details and movement quantities.",
                    "The deployment environment provides Node.js support.",
                    "MongoDB connectivity is available in normal MERN mode.",
                    "For local demonstration, a stable demo runtime may be used when database setup is unavailable.",
                ]
            ),
        ),
    )

    add(
        "Experiment-01",
        "Functional Requirements: Authentication",
        table(
            ["Requirement ID", "Requirement"],
            [
                ["FR-01", "The system shall allow users to create an account using name, email, and password."],
                ["FR-02", "The system shall validate user credentials during login."],
                ["FR-03", "The system shall return an authenticated session token after successful login."],
                ["FR-04", "The system shall protect inventory and dashboard routes from anonymous access."],
            ],
        ),
    )

    add(
        "Experiment-01",
        "Functional Requirements: Catalog Management",
        table(
            ["Requirement ID", "Requirement"],
            [
                ["FR-05", "The system shall allow authorized users to create product records."],
                ["FR-06", "The system shall ensure SKU uniqueness."],
                ["FR-07", "The system shall allow updating of existing product records."],
                ["FR-08", "The system shall store category, supplier, location, quantity, and pricing data for each product."],
            ],
        ),
    )

    add(
        "Experiment-01",
        "Functional Requirements: Stock Movement",
        table(
            ["Requirement ID", "Requirement"],
            [
                ["FR-09", "The system shall support stock-in, stock-out, and adjustment transactions."],
                ["FR-10", "The system shall recalculate quantity and stock status after each valid movement."],
                ["FR-11", "The system shall reject stock-out operations when requested quantity exceeds available stock."],
                ["FR-12", "The system shall store movement history including reference and note."],
            ],
        ),
    )

    add(
        "Experiment-01",
        "Functional Requirements: Dashboard and Reporting",
        table(
            ["Requirement ID", "Requirement"],
            [
                ["FR-13", "The system shall compute total inventory value."],
                ["FR-14", "The system shall list low-stock and out-of-stock items."],
                ["FR-15", "The system shall display recent stock activity in reverse chronological order."],
                ["FR-16", "The system shall provide category-wise inventory distribution."],
            ],
        ),
    )

    add(
        "Experiment-01",
        "Non-Functional Requirements",
        section(
            "Quality Requirements",
            bullet_list(
                [
                    "Performance: normal interactions should be completed quickly under regular workload.",
                    "Security: credentials and protected routes must be handled securely.",
                    "Usability: forms and tables must remain readable and manageable.",
                    "Maintainability: backend and frontend code should remain modular.",
                    "Portability: the application should run in modern browser and Node environments.",
                ]
            ),
        )
        + section(
            "Interpretation",
            p(
                "The non-functional requirements ensure that the system is not only feature-complete but also practical, maintainable, and reviewable."
            ),
        ),
    )

    add(
        "Experiment-01",
        "External Interface Requirements",
        section(
            "User Interface Requirements",
            bullet_list(
                [
                    "The login screen shall provide clear entry for email and password.",
                    "The dashboard shall present summary cards and activity without clutter.",
                    "The inventory screen shall provide search, filters, forms, and movement logging.",
                    "The interface shall remain consistent across desktop and mobile layouts.",
                ]
            ),
        )
        + section(
            "Software and Communication Interfaces",
            bullet_list(
                [
                    "Frontend communicates with backend using JSON over HTTP.",
                    "Backend communicates with MongoDB using Mongoose in MERN mode.",
                    "Render deployment serves the built frontend and backend from one service.",
                ]
            ),
        ),
    )

    add(
        "Experiment-01",
        "Data Dictionary",
        table(
            ["Entity", "Key Attributes", "Purpose"],
            [
                ["User", "id, name, email, role", "Access control and action ownership"],
                ["Category", "name, slug, accentColor", "Grouping and display segmentation"],
                ["Product", "name, sku, quantity, reorderLevel, supplier, location", "Core inventory record"],
                ["StockMovement", "type, quantity, previousQuantity, newQuantity", "Historical stock trace"],
            ],
        )
        + section(
            "Business Rule Note",
            p(
                "The business rules around product and movement data are intentionally strict because inventory accuracy depends on them."
            ),
        ),
    )

    add(
        "Experiment-01",
        "Use Case Diagram",
        diagram_block(
            "Use Case Diagram",
            use_case_svg(),
            [
                "The use case diagram identifies the two main actors: Admin and Staff. Admin participates in all four central use cases, while Staff interacts mainly with authentication, stock movement, and dashboard viewing.",
                "This diagram helps clarify functional scope at a glance and ensures that implementation remains aligned with expected user interactions.",
            ],
        ),
    )

    add(
        "Experiment-01",
        "Use Case Diagram Explanation",
        topic_body(
            "Use Case Interpretation",
            "actor responsibilities and system boundaries",
            [
                "Admin needs control over both product structure and stock state.",
                "Staff needs a shorter path to operational updates and monitoring.",
                "The system boundary prevents actors from interacting with persistence directly.",
                "Each use case is intentionally broad enough to represent a real working task.",
            ],
        ),
    )

    add(
        "Experiment-01",
        "Class Diagram",
        diagram_block(
            "Class Diagram",
            class_svg(),
            [
                "The class diagram captures the static structure of the application. Product is the domain center, Category supports grouping, User supports accountability, and StockMovement supports traceability.",
                "This model guided both the backend schema design and the frontend assumption about how data objects are related when displayed in forms, tables, and summaries.",
            ],
        ),
    )

    add(
        "Experiment-01",
        "Class Diagram Explanation",
        topic_body(
            "Class Relationships",
            "structural clarity and maintainability",
            [
                "User-to-movement association supports responsibility tracking.",
                "Category-to-product association supports filtering and display grouping.",
                "Product-to-movement association supports change history.",
                "Clear entity separation improves controller and route organization.",
            ],
        ),
    )

    add(
        "Experiment-01",
        "Activity Diagram",
        diagram_block(
            "Activity Diagram",
            activity_svg(),
            [
                "The activity diagram presents a simplified operational flow from login to stock update.",
                "It is useful because it highlights sequence rather than structure, making warehouse-style task flow easier to explain to non-programmer reviewers.",
            ],
        ),
    )

    add(
        "Experiment-01",
        "Sequence Diagram",
        diagram_block(
            "Sequence Diagram",
            sequence_svg(),
            [
                "The sequence diagram shows the order of messages between user, client, backend, and data layer.",
                "It demonstrates that the frontend acts as an interface layer while business rules remain centralized at the backend level.",
            ],
        ),
    )

    add(
        "Experiment-01",
        "Component Diagram",
        diagram_block(
            "Component Diagram",
            component_svg(),
            [
                "The component diagram separates the project into frontend, backend, and persistence responsibilities.",
                "This decomposition is directly reflected in the folder structure of the delivered workspace.",
            ],
        ),
    )

    add(
        "Experiment-01",
        "Deployment Diagram",
        diagram_block(
            "Deployment Diagram",
            deployment_svg(),
            [
                "The deployment diagram represents how the browser, application server, and database layer interact.",
                "Even in academic local execution, this logical separation remains important because it informs deployment, security, and debugging decisions.",
            ],
        ),
    )

    module_topics = [
        (
            "Authentication Module",
            "secure access and session control",
            [
                "Supports user registration and login.",
                "Protects backend routes through token-based access control.",
                "Separates anonymous routes from protected operational routes.",
                "Creates the security foundation for inventory operations.",
            ],
        ),
        (
            "Catalog Module",
            "maintaining clean product information",
            [
                "Stores SKU, supplier, location, and pricing information.",
                "Supports update operations without re-creating records.",
                "Links products with categories for organized browsing.",
                "Acts as the stable reference point for movement operations.",
            ],
        ),
        (
            "Stock Movement Module",
            "quantity correctness and traceability",
            [
                "Handles stock-in, stock-out, and adjustment transactions.",
                "Prevents invalid negative stock states.",
                "Preserves reference, note, and before/after quantity values.",
                "Provides the operational backbone of the inventory system.",
            ],
        ),
        (
            "Dashboard Module",
            "summary visibility and alert-oriented insight",
            [
                "Computes inventory value and status-oriented counts.",
                "Lists recent activity for quick operational review.",
                "Highlights low-stock and out-of-stock conditions.",
                "Supports faster managerial understanding of warehouse state.",
            ],
        ),
    ]

    for title, focus, points in module_topics:
        add("Implementation View", title, topic_body(title, focus, points))

    add(
        "Implementation View",
        "Frontend Design Strategy",
        topic_body(
            "Frontend Design Strategy",
            "usable and calm interaction design",
            [
                "Soft-tone styling reduces harsh visual contrast during routine use.",
                "Cards, forms, and tables are grouped to support scan-friendly reading.",
                "Responsive layout allows the same interface to degrade gracefully on smaller screens.",
                "Clear hierarchy improves confidence when entering stock-sensitive data.",
            ],
        ),
    )

    add(
        "Implementation View",
        "Backend Design Strategy",
        topic_body(
            "Backend Design Strategy",
            "validation, modularity, and predictable API behavior",
            [
                "Routes, controllers, models, and utilities are separated into focused files.",
                "Validation logic is kept near the business operation it protects.",
                "Response payloads are structured to support predictable frontend use.",
                "The architecture remains simple enough for academic explanation.",
            ],
        ),
    )

    add(
        "Implementation View",
        "Input Design",
        topic_body(
            "Input Design",
            "accuracy during data entry",
            [
                "Form fields are grouped logically to reduce confusion.",
                "Numeric fields are used for quantity and pricing values.",
                "Dropdowns are used for categories and movement types where appropriate.",
                "Validation messages guide the user before invalid states are accepted.",
            ],
        ),
    )

    add(
        "Implementation View",
        "Output Design",
        topic_body(
            "Output Design",
            "clear information presentation",
            [
                "Dashboard cards summarize the most important operational indicators.",
                "Tables provide structured product and movement views.",
                "Status pills help users identify stock conditions quickly.",
                "Recent activity panels support short-term operational recall.",
            ],
        ),
    )

    add(
        "Experiment-02",
        "Aim and Theory of WBS",
        section(
            "Aim",
            p(
                "To study the principles of project decomposition and to prepare a Work Breakdown Structure for the Inventory Management System."
            ),
        )
        + section(
            "Theory",
            paragraphs(
                [
                    "A Work Breakdown Structure divides the total scope of a project into smaller and manageable pieces. It helps the team understand what must be done, who may own each task, and how progress should be tracked.",
                    "For software projects, WBS is especially useful because hidden work such as testing, integration, and documentation is often underestimated unless it is explicitly represented.",
                ]
            ),
        ),
    )

    add(
        "Experiment-02",
        "WBS Part I",
        table(
            ["WBS ID", "Task", "Subtask", "Output"],
            [
                ["1.0", "Requirement Analysis", "Problem study and feature identification", "Requirement notes"],
                ["1.1", "SRS Preparation", "Formal requirement documentation", "SRS chapter"],
                ["2.0", "System Design", "Architecture and data model creation", "Design package"],
                ["2.1", "UML Modelling", "Use case, class, and activity views", "Diagram set"],
            ],
        ),
    )

    add(
        "Experiment-02",
        "WBS Part II",
        table(
            ["WBS ID", "Task", "Subtask", "Output"],
            [
                ["3.0", "Backend Development", "Routes, controllers, models, auth", "API implementation"],
                ["4.0", "Frontend Development", "Pages, forms, dashboard, routing", "React implementation"],
                ["5.0", "Integration and Testing", "API linkage and flow validation", "Working app"],
                ["6.0", "Documentation", "SPM report and PDF output", "Submission package"],
            ],
        )
        + section(
            "WBS Observation",
            p(
                "The WBS reveals that implementation is only one part of the total scope. Analysis, modelling, integration, testing, and reporting are equally necessary for successful completion."
            ),
        ),
    )

    add(
        "Experiment-02",
        "WBS Output and Interpretation",
        topic_body(
            "Work Breakdown Interpretation",
            "scope control and planning discipline",
            [
                "The WBS reduces the chance of forgotten project work.",
                "Task granularity supports more realistic time estimation.",
                "Deliverables become easier to map against milestones.",
                "Documentation work is treated as planned scope rather than leftover work.",
            ],
        ),
    )

    add(
        "Experiment-03",
        "Aim and Theory of Gantt Chart",
        section(
            "Aim",
            p(
                "To create and analyze a Gantt-style timeline for the Inventory Management System so major tasks and dependencies can be visualized across the project schedule."
            ),
        )
        + section(
            "Theory",
            paragraphs(
                [
                    "A Gantt chart maps project tasks against calendar time. It helps reviewers understand not just which tasks exist, but also when they occur and how long they remain active.",
                    "In software engineering, the Gantt view is useful because technical tasks often depend on earlier analytical work. It is therefore a practical complement to the WBS.",
                ]
            ),
        ),
    )

    add(
        "Experiment-03",
        "Gantt Schedule",
        table(
            ["Task", "W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
            [
                ["Requirement analysis", "X", "X", "-", "-", "-", "-", "-", "-"],
                ["Design and UML", "-", "X", "X", "-", "-", "-", "-", "-"],
                ["Backend development", "-", "-", "X", "X", "X", "-", "-", "-"],
                ["Frontend development", "-", "-", "-", "X", "X", "X", "-", "-"],
                ["Integration", "-", "-", "-", "-", "X", "X", "-", "-"],
                ["Testing and documentation", "-", "-", "-", "-", "-", "X", "X", "X"],
            ],
        ),
    )

    add(
        "Experiment-03",
        "Milestones and Dependencies",
        topic_body(
            "Schedule Dependencies",
            "ordering of work and delivery rhythm",
            [
                "Requirement clarity must precede design quality.",
                "Design maturity improves backend and frontend alignment.",
                "Integration depends on both sides of implementation being ready.",
                "Documentation becomes stronger when created alongside project progress.",
            ],
        ),
    )

    add(
        "Experiment-03",
        "Schedule Risk and Control",
        topic_body(
            "Schedule Risk",
            "protecting the project timeline",
            [
                "Database setup can delay full end-to-end verification.",
                "Late documentation leads to rushed formatting and weak explanation.",
                "Underestimated UI refinement can affect integration timing.",
                "Missing early scope control increases downstream rework.",
            ],
        ),
    )

    add(
        "Experiment-04",
        "Aim and Theory of Software Metrics",
        section(
            "Aim",
            p(
                "To study the role of software metrics in measuring project size, effort, time, productivity, and quality for the Inventory Management System."
            ),
        )
        + section(
            "Theory",
            paragraphs(
                [
                    "Software metrics turn qualitative judgment into manageable quantitative estimates. They allow project managers to reason about size, effort, productivity, and quality more systematically.",
                    "Metrics do not replace engineering judgment, but they support better planning and better comparison between estimated and actual work.",
                ]
            ),
        ),
    )

    add(
        "Experiment-04",
        "Size Metrics",
        table(
            ["Metric", "Estimated Value", "Meaning"],
            [
                ["Lines of Code", "Approximately 4,500-5,000", "Combined frontend, backend, and supporting assets"],
                ["Function Points", "Approximately 52", "Feature-level estimate across auth, inventory, dashboard, and report support"],
                ["Collection Count", "4 primary entities", "User, Category, Product, StockMovement"],
            ],
        ),
    )

    add(
        "Experiment-04",
        "Effort and Time Metrics",
        table(
            ["Metric", "Estimated Value", "Interpretation"],
            [
                ["Effort", "180 person-hours", "Total projected labor across the lifecycle"],
                ["Schedule", "8 weeks", "Calendar time for the academic project"],
                ["Average task block", "1 to 2 weeks", "Typical milestone span for grouped activities"],
            ],
        )
        + section(
            "Metric Note",
            p("Effort and schedule must be read together because a short schedule can still contain high labor concentration."),
        ),
    )

    add(
        "Experiment-04",
        "Productivity and Quality Metrics",
        table(
            ["Metric", "Estimated Value", "Interpretation"],
            [
                ["Productivity", "25-30 LOC per person-day", "Moderate rate for structured academic work"],
                ["Target response time", "Below 2 seconds", "Supports interactive usability"],
                ["Defect density target", "Below 0.8 defects/KLOC", "Emphasizes correctness"],
                ["Rework target", "Below 15 percent", "Indicates stable requirements"],
            ],
        ),
    )

    add(
        "Experiment-04",
        "Metric Interpretation and Output",
        topic_body(
            "Metric Interpretation",
            "using numbers responsibly in project review",
            [
                "Metrics help comparison, not blind decision making.",
                "Quality metrics matter more than raw code volume in inventory software.",
                "Productivity must be balanced against correctness and maintainability.",
                "Estimates should be revisited after integration and testing.",
            ],
        ),
    )

    add(
        "Experiment-05",
        "Aim and Theory of Cost Estimation",
        section(
            "Aim",
            p(
                "To estimate and analyze the financial requirements of the Inventory Management System including development, testing, and maintenance cost components."
            ),
        )
        + section(
            "Theory",
            paragraphs(
                [
                    "Cost estimation translates project effort into financial understanding. It supports budgeting, feasibility review, and prioritization of work.",
                    "Even for academic projects, a realistic estimate shows management maturity because it connects features and effort with resource consumption.",
                ]
            ),
        ),
    )

    add(
        "Experiment-05",
        "Development Cost Estimation",
        table(
            ["Cost Head", "Amount (INR)", "Reason"],
            [
                ["Requirement analysis", "18,000", "Scope study and requirement documentation"],
                ["Design and modelling", "12,000", "Architecture and UML preparation"],
                ["Backend development", "42,000", "Controllers, routes, models, authentication"],
                ["Frontend development", "38,000", "Screens, forms, state handling, responsive UI"],
            ],
        ),
    )

    add(
        "Experiment-05",
        "Testing, Documentation, and Support Cost",
        table(
            ["Cost Head", "Amount (INR)", "Reason"],
            [
                ["Testing and QA", "14,000", "Scenario validation and issue review"],
                ["Documentation", "10,000", "SPM formatting and report output"],
                ["Infrastructure and tool support", "6,000", "Connectivity and platform support"],
                ["Maintenance reserve", "12,000", "Post-delivery fixes and small changes"],
            ],
        ),
    )

    add(
        "Experiment-05",
        "Total Cost and Cost Observation",
        section(
            "Total Cost",
            p("The overall estimated project cost is approximately INR 160,000 including reserve and support categories."),
        )
        + section(
            "Observation",
            paragraphs(
                [
                    "The estimate indicates a moderate-cost prototype-scale software project. The largest share belongs to implementation effort because coding and integration consume the majority of project labor.",
                    "Reserve categories are included intentionally because environment setup, bug fixing, and formatting changes frequently appear near delivery time.",
                ]
            ),
        ),
    )

    add(
        "Experiment-06",
        "Aim and Theory of Resource Allocation",
        section(
            "Aim",
            p(
                "To identify and allocate the human, hardware, software, and time resources required for the Inventory Management System."
            ),
        )
        + section(
            "Theory",
            paragraphs(
                [
                    "Resource allocation helps the project move from intention to execution. A task cannot be completed unless the right capability and environment are available at the right time.",
                    "In software work, resource planning includes people, technical tools, access conditions, and schedule availability.",
                ]
            ),
        ),
    )

    add(
        "Experiment-06",
        "Human Resource Allocation",
        table(
            ["Role", "Responsibility", "Reason for Allocation"],
            [
                ["Project Manager", "Planning and coordination", "Maintains scope and schedule control"],
                ["Backend Developer", "API and logic implementation", "Builds protected business operations"],
                ["Frontend Developer", "UI and interaction implementation", "Creates user-facing workflow"],
                ["Tester", "Validation and quality review", "Protects reliability and acceptance"],
            ],
        ),
    )

    add(
        "Experiment-06",
        "Hardware and Software Allocation",
        table(
            ["Resource Type", "Allocated Resource", "Purpose"],
            [
                ["Hardware", "Laptop/Desktop workstation", "Coding, testing, and report work"],
                ["Hardware", "Internet connection", "Dependencies and deployment tasks"],
                ["Software", "Node.js and npm", "Runtime and package management"],
                ["Software", "MongoDB Atlas", "Persistent data layer"],
                ["Software", "Browser and code editor", "Testing and development"],
            ],
        ),
    )

    add(
        "Experiment-06",
        "Time Resource Allocation and Observation",
        topic_body(
            "Time Allocation",
            "balancing analysis, development, and documentation",
            [
                "Early weeks focus on analysis and design.",
                "Middle weeks focus on backend and frontend implementation.",
                "Final weeks focus on integration, testing, deployment, and report completion.",
                "Documentation is strongest when written incrementally rather than postponed.",
            ],
        ),
    )

    add(
        "Experiment-07",
        "Aim and Theory of Team Structure",
        section(
            "Aim",
            p(
                "To study and design the team structure, reporting relationships, and role responsibilities suitable for the Inventory Management System."
            ),
        )
        + section(
            "Theory",
            paragraphs(
                [
                    "Team structure makes ownership visible. It shows who plans, who implements, who verifies, and who closes the project.",
                    "Without team structure, software projects often suffer from overlap, missing accountability, and unclear communication.",
                ]
            ),
        ),
    )

    add(
        "Experiment-07",
        "Team Roles and Responsibilities",
        table(
            ["Role", "Main Duties", "Primary Deliverable"],
            [
                ["Project Manager", "Coordinate work and monitor progress", "Controlled timeline"],
                ["Backend Developer", "Build data and API logic", "Stable server-side implementation"],
                ["Frontend Developer", "Build user interaction and layout", "Usable client-side implementation"],
                ["Tester", "Review scenarios and report faults", "Quality findings"],
            ],
        ),
    )

    add(
        "Experiment-07",
        "Responsibility Matrix",
        table(
            ["Activity", "Project Manager", "Backend Dev", "Frontend Dev", "Tester"],
            [
                ["Requirement review", "High", "Medium", "Medium", "Low"],
                ["API implementation", "Low", "High", "Low", "Medium"],
                ["UI implementation", "Low", "Low", "High", "Medium"],
                ["Testing", "Medium", "Medium", "Medium", "High"],
                ["Documentation closure", "High", "Medium", "Medium", "Low"],
            ],
        ),
    )

    add(
        "Experiment-07",
        "Communication and Governance Plan",
        topic_body(
            "Communication Plan",
            "coordination and issue escalation",
            [
                "Weekly review helps compare planned and completed work.",
                "Integration issues should be discussed quickly rather than accumulated.",
                "Documentation decisions should follow implementation reality.",
                "Final submission should be made only from verified files.",
            ],
        ),
    )

    add(
        "Quality Assurance",
        "Testing Strategy",
        topic_body(
            "Testing Strategy",
            "verifying behavior rather than only appearance",
            [
                "Authentication flow must accept valid users and reject invalid input.",
                "Product operations must preserve unique SKU behavior.",
                "Stock-out must never exceed available quantity.",
                "Responsive layouts must remain readable on smaller screens.",
            ],
        ),
    )

    add(
        "Quality Assurance",
        "Representative Test Cases",
        table(
            ["Test ID", "Scenario", "Expected Result"],
            [
                ["TC-01", "Login with valid credentials", "Access granted and dashboard loaded"],
                ["TC-02", "Create duplicate SKU", "Validation error shown"],
                ["TC-03", "Record invalid stock-out", "Operation rejected"],
                ["TC-04", "Update product quantity", "Status recalculated correctly"],
                ["TC-05", "Load on narrow screen", "Layout remains usable"],
            ],
        ),
    )

    add(
        "Quality Assurance",
        "Validation and Error Handling",
        topic_body(
            "Validation Strategy",
            "protecting the system from inconsistent state",
            [
                "Required fields reduce incomplete record creation.",
                "Numeric conversion ensures quantity and price consistency.",
                "Error middleware standardizes backend failure responses.",
                "Frontend feedback panels help users correct problems quickly.",
            ],
        ),
    )

    add(
        "Project Control",
        "Risk Management",
        topic_body(
            "Risk Management",
            "anticipating technical and process-level disruption",
            [
                "Database configuration may fail or be delayed.",
                "Deployment settings may be entered incorrectly.",
                "Late report work may reduce documentation quality.",
                "Requirement drift may create unnecessary implementation churn.",
            ],
        ),
    )

    add(
        "Project Control",
        "Feasibility Analysis",
        table(
            ["Feasibility Type", "Assessment"],
            [
                ["Technical", "High due to mainstream stack and modular design"],
                ["Operational", "High because workflows are simple and task-oriented"],
                ["Economic", "Reasonable for prototype and academic scale"],
                ["Schedule", "Achievable with disciplined planning"],
            ],
        ),
    )

    add(
        "Implementation",
        "Implementation Summary",
        table(
            ["Area", "Location", "Status"],
            [
                ["Backend", "backend/src", "Implemented"],
                ["Frontend", "frontend/src", "Implemented"],
                ["Deployment Config", "render.yaml", "Prepared"],
                ["Documentation", "docs", "Prepared and expandable"],
            ],
        )
        + section(
            "Summary",
            p(
                "The delivered project includes the application code, deployment configuration, and report artefacts. It is therefore complete as an academic deliverable and ready for further verification and extension."
            ),
        ),
    )

    add(
        "Implementation",
        "Deployment Notes",
        topic_body(
            "Deployment Preparation",
            "production readiness and environment setup",
            [
                "Render configuration has been added to the project.",
                "MongoDB Atlas connection is configured through environment variables.",
                "The backend can serve the built frontend for single-service deployment.",
                "Health check and production scripts are defined for deployment use.",
            ],
        ),
    )

    add(
        "Project Closure",
        "Future Enhancements",
        topic_body(
            "Future Enhancement Planning",
            "extending the system beyond the current scope",
            [
                "Barcode support could speed up movement entry.",
                "Purchase-order workflow could improve replenishment tracking.",
                "Export features could support reporting and audit needs.",
                "Manager-specific analytics could extend the role model.",
            ],
        ),
    )

    add(
        "Project Closure",
        "Conclusion",
        section(
            "Conclusion",
            paragraphs(
                [
                    "The Inventory Management System demonstrates a complete cycle from requirement understanding to deployable implementation. The project combines practical inventory features with structured software project management thinking.",
                    "Through SRS preparation, UML modelling, WBS and Gantt planning, metric analysis, cost estimation, resource allocation, team organization, testing, and deployment preparation, the report shows that successful software development depends on both technical execution and managerial discipline.",
                    "The final deliverable therefore serves both as a working MERN application and as a comprehensive academic report comparable in style and range to the reference sample.",
                ]
            ),
        ),
    )

    add(
        "Project Closure",
        "References",
        section(
            "Reference Basis",
            bullet_list(
                [
                    "Standard software project management concepts for planning, control, and quality assurance.",
                    "Common SRS organization patterns inspired by formal software engineering documentation practice.",
                    "UML conventions for use case, class, activity, sequence, component, and deployment representation.",
                    "The implemented Inventory Management System source files included in the project workspace.",
                ]
            ),
        ),
    )

    appendix_topics = [
        "Existing System Observation Notes",
        "Requirement Traceability Discussion",
        "Category Design Explanation",
        "Inventory Value Computation Notes",
        "Low-Stock Threshold Logic",
        "API Endpoint Mapping",
        "Login Flow Narrative",
        "Movement History Importance",
        "Supplier and Location Data Relevance",
        "Responsive UI Considerations",
        "Security Considerations",
        "Error Handling Considerations",
        "Scalability Observation",
        "Maintainability Observation",
        "Testing Output Discussion",
        "Deployment Checklist",
        "User Manual Notes",
        "Admin Workflow Narrative",
        "Staff Workflow Narrative",
        "Project Limitation Notes",
    ]

    appendix_points = {
        "Existing System Observation Notes": [
            "Manual record systems often hide update delays.",
            "Inventory value is difficult to estimate from scattered notes.",
            "Shared operational trust depends on centralized records.",
            "Digital systems improve both speed and traceability.",
        ],
        "Requirement Traceability Discussion": [
            "Requirements should map to visible screens and routes.",
            "Traceability supports testing and later maintenance.",
            "Clear IDs simplify discussion during review.",
            "Documentation and implementation should stay aligned.",
        ],
        "Category Design Explanation": [
            "Categories improve scan speed in inventory tables.",
            "They also support visual and analytical grouping.",
            "Category names should remain stable and human-readable.",
            "Category metadata can support future reporting features.",
        ],
    }

    while len(pages) < 59:
        title = appendix_topics[(len(pages) - 1) % len(appendix_topics)]
        points = appendix_points.get(
            title,
            [
                "This topic supports clarity in both implementation and documentation.",
                "Reviewing it separately reduces ambiguity during project evaluation.",
                "It strengthens understanding of how the system behaves in real use.",
                "It also provides a useful basis for future extension or refinement.",
            ],
        )
        add("Appendix", title, topic_body(title, "supplementary project understanding", points))

    if len(pages) < 59:
        raise ValueError(f"Expected at least 59 content pages, found {len(pages)}")

    return pages


def build_html():
    content_pages = build_content_pages()
    toc_entries = [(title, index) for index, (_, title, _) in enumerate(content_pages, start=4)]

    pages_html = [
        cover_page(1),
        page(
            "Front Matter",
            "Declaration and Report Note",
            section(
                "Document Note",
                paragraphs(
                    [
                        "This report has been prepared for the Inventory Management System project in the same broad academic presentation style as the supplied sample file. It uses experiment-based organization and expanded explanatory material so the final report is substantial enough for formal submission.",
                        "The formatting is intentionally black-and-white for print readability. Diagrams are monochrome, headings are structured, and each page is explicitly separated for clean PDF generation.",
                    ]
                ),
            )
            + section(
                "Report Components",
                bullet_list(
                    [
                        "Problem statement and SRS",
                        "UML-style diagrams",
                        "WBS and Gantt planning",
                        "Software metrics and costing",
                        "Resource allocation and team organization",
                        "Testing, risk, feasibility, implementation, and conclusion",
                    ]
                ),
            ),
            2,
        ),
        toc_page(toc_entries, 3),
    ]

    for page_no, (experiment, title, body) in enumerate(content_pages, start=4):
        pages_html.append(page(experiment, title, body, page_no))

    return dedent(
        f"""
        <!doctype html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>SPM Report - Inventory Management System</title>
          <style>
            @page {{
              size: A4;
              margin: 14mm;
            }}

            * {{ box-sizing: border-box; }}

            body {{
              margin: 0;
              background: #fff;
              color: #000;
              font-family: "Times New Roman", Georgia, serif;
            }}

            .page {{
              min-height: 267mm;
              display: flex;
              flex-direction: column;
              page-break-after: always;
            }}

            .page:last-child {{ page-break-after: auto; }}

            .page-header, .page-footer {{
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 11px;
            }}

            .page-header {{
              border-bottom: 1px solid #000;
              padding-bottom: 4px;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 0.08em;
            }}

            .page-body {{ flex: 1; }}

            .page-footer {{
              border-top: 1px solid #000;
              padding-top: 5px;
              margin-top: 10px;
            }}

            .cover-page {{ justify-content: center; }}

            .cover-box {{
              min-height: 206mm;
              border: 1.5px solid #000;
              padding: 18mm 14mm;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }}

            .cover-eyebrow {{
              text-transform: uppercase;
              letter-spacing: 0.16em;
              font-size: 12px;
              margin: 0 0 12px 0;
              text-align: center;
            }}

            .lead {{
              text-align: center;
              font-size: 15px;
              margin: 0 auto 16px auto;
              max-width: 154mm;
            }}

            .meta-grid {{
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-top: 10px;
            }}

            .meta-card {{
              border: 1px solid #000;
              padding: 8px 10px;
              display: flex;
              flex-direction: column;
              gap: 4px;
            }}

            h1 {{
              font-size: 32px;
              margin: 0 0 16px 0;
              text-align: center;
            }}

            h2 {{
              font-size: 22px;
              margin: 0 0 10px 0;
              padding-bottom: 6px;
              border-bottom: 1px solid #000;
            }}

            h3 {{
              font-size: 16px;
              margin: 0 0 8px 0;
            }}

            h4 {{
              font-size: 14px;
              margin: 0 0 6px 0;
            }}

            p, li, td, th, div {{
              font-size: 12.5px;
              line-height: 1.45;
              color: #000;
            }}

            .section {{ margin-bottom: 12px; }}

            table {{
              width: 100%;
              border-collapse: collapse;
              margin: 8px 0 10px 0;
            }}

            th, td {{
              border: 1px solid #000;
              padding: 6px 7px;
              vertical-align: top;
            }}

            th {{ background: #ededed; }}

            ul, ol {{
              margin: 6px 0 8px 18px;
              padding: 0;
            }}

            .diagram-block {{
              border: 1px solid #000;
              padding: 8px;
              margin-bottom: 10px;
            }}

            .diagram-block svg {{
              width: 100%;
              height: auto;
              display: block;
            }}
          </style>
        </head>
        <body>
          {''.join(pages_html)}
        </body>
        </html>
        """
    )


def main():
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    HTML_OUTPUT.write_text(build_html(), encoding="utf-8")
    print(f"Generated HTML report at {HTML_OUTPUT}")


if __name__ == "__main__":
    main()
