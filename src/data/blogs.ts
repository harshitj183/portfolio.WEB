export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  coverImage: string;
  date: string;
  readTime: string;
  category: 'AI Systems' | 'Distributed Systems' | 'Developer Tools' | 'Full Stack';
  tags: string[];
  projectLink?: string;
  githubLink?: string;
  projectTitle?: string;
  mermaidChart: string;
  tableOfContents: { id: string; title: string }[];
  content: string; // Markdown / Structured text
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'architecting-conceptcraft-ai-multi-agent-orchestration',
    title: 'Architecting ConceptCraft AI: Multi-Agent Orchestration & Real-Time D3 Sandbox Synthesis',
    subtitle: 'How we built a 5-agent pipeline using LangGraph, FastAPI, and Next.js to transform abstract theoretical concepts into executable, interactive D3.js simulations.',
    summary: 'A comprehensive deep-dive into multi-agent design patterns, state graphs, automatic retry heuristics, and AST-driven interactive sandbox compilation in ConceptCraft AI.',
    coverImage: '/projects/conceptcraft_landing.png',
    date: 'Sep 10, 2026',
    readTime: '8 min read',
    category: 'AI Systems',
    tags: ['LangGraph', 'Multi-Agent', 'FastAPI', 'D3.js', 'Next.js', 'Docker'],
    projectTitle: 'ConceptCraft AI',
    projectLink: '/projects',
    githubLink: 'https://github.com/harshitj183/ConceptCraft-AI',
    tableOfContents: [
      { id: 'problem-statement', title: '1. The Problem: Static Documentation vs. Interactive Mental Models' },
      { id: 'multi-agent-architecture', title: '2. Multi-Agent Pipeline Architecture with LangGraph' },
      { id: 'mermaid-flow', title: '3. Architectural State Machine & Graph Flow' },
      { id: 'd3-sandbox-generation', title: '4. Safe Dynamic D3.js Sandbox Synthesis' },
      { id: 'adaptive-evaluation-loop', title: '5. Adaptive Quiz Engine & Automated Feedback Loop' },
      { id: 'key-takeaways', title: '6. Engineering Takeaways & Production Metrics' }
    ],
    mermaidChart: `flowchart TD
    User([User Conceptual Query]) --> Agent1[Topic Decomposition Agent]
    Agent1 --> Agent2[Analogy & Metaphor Designer]
    Agent2 --> Agent3[D3.js Interactive Simulation Compiler]
    Agent3 --> AST[AST Validator & Sandbox Sanitizer]
    AST -->|Syntax Error Detected| Agent3
    AST -->|Validation Passed| UI[Next.js Interactive Sandbox UI]
    UI --> Agent4[Adaptive Evaluation & Quiz Engine]
    Agent4 --> Score{Quiz Score >= 60%?}
    Score -->|Yes| Agent5[Knowledge Graph & Roadmap Updater]
    Score -->|No| Agent2`,
    content: `
### 1. The Problem: Static Documentation vs. Interactive Mental Models
Traditional educational tutorials and documentation rely heavily on static markdown blocks and passive code snippets. When developers or students encounter complex computer science concepts—such as polymorphic dispatch, recursive back-tracking, or distributed consensus—textual explanations often fail to build a visceral mental model.

**ConceptCraft AI** was engineered to eliminate this barrier by programmatically transforming abstract textual concepts into **interactive, step-by-step D3.js physics sandboxes and visual state graphs** in real-time.

---

### 2. Multi-Agent Pipeline Architecture with LangGraph
Rather than relying on a single monolithic LLM prompt (which frequently hallucinated syntax errors and broke visual coordinate systems), we designed a **specialized 5-agent state graph** using **LangGraph** and **FastAPI**:

1. **Topic Decomposition Agent**: Parses the user query, extracts core mathematical and computational invariants, and identifies prerequisites.
2. **Analogy & Metaphor Designer**: Formulates relatable mental anchors tailored to the student's familiarity level.
3. **D3.js Sandbox Compiler**: Emits pure, sanitized DOM-manipulation and SVG drawing routines with discrete step controllers.
4. **Adaptive Evaluation Agent**: Generates targeted assessment scenarios that directly probe common edge-case misconceptions.
5. **Knowledge Graph Architect**: Maintains persistent user skill nodes in PostgreSQL via Prisma, continuously charting personalized learning paths.

\`\`\`typescript
// State Graph Schema Definition
interface AgentState {
  concept: string;
  prerequisites: string[];
  analogy: { theme: string; explanation: string };
  d3Script: string;
  quiz: { question: string; options: string[]; answerIndex: number }[];
  evaluationScore?: number;
  retryCount: number;
}
\`\`\`

---

### 3. Architectural State Machine & Graph Flow
The diagram below illustrates how user requests traverse through the orchestrated agents, with automated validation checkpoints preventing invalid code execution in the client browser:
`
  },
  {
    slug: 'scaling-ucis-distributed-websocket-architecture',
    title: 'Scaling Unified College Interaction System: Distributed Real-Time Architecture for 1,000+ Users',
    subtitle: 'System design insights on building high-concurrency event loops, optimistic MongoDB indexing, and secure JWT-based RBAC in higher-education institutional hubs.',
    summary: 'How we engineered UCIS under Project-Based Learning (PBL) recognition, cutting administrative latency by 40% and maintaining 99.9% uptime under peak campus enrollment loads.',
    coverImage: '/projects/ucis_01_home.png',
    date: 'Aug 24, 2026',
    readTime: '6 min read',
    category: 'Distributed Systems',
    tags: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'System Design', 'PBL'],
    projectTitle: 'Unified College Interaction System',
    projectLink: 'https://unified-college-interaction-system.vercel.app/',
    githubLink: 'https://github.com/harshitj183/unified-college-interaction-system-web',
    tableOfContents: [
      { id: 'institutional-concurrency', title: '1. The Challenge: Peak Concurrency & Segmented Permissions' },
      { id: 'distributed-data-flow', title: '2. WebSocket & REST Dual-Channel Pipeline' },
      { id: 'mermaid-flow', title: '3. Architectural Topology & Event Broadcast' },
      { id: 'mongo-indexing-strategy', title: '4. High-Throughput MongoDB Indexing & Caching' },
      { id: 'security-rbac', title: '5. Role-Based Access Control (RBAC) Hardening' },
      { id: 'impact-metrics', title: '6. Production Impact & PBL Certification' }
    ],
    mermaidChart: `flowchart TD
    Client[1000+ Students & Faculty Clients] -->|HTTPS REST| Gateway[Express API Gateway / Nginx]
    Client -->|WSS Persistent Connection| WSServer[Socket.io Real-Time Cluster]
    Gateway --> Auth[JWT & RBAC Authorization Middleware]
    Auth --> Service[Academic Query & Club Service Layer]
    Service --> Mongo[(MongoDB Clustered Cluster)]
    Service --> EventBus[In-Memory Event Bus]
    EventBus -->|Publish Notification| WSServer
    WSServer -->|Sub-50ms Broadcast| Client`,
    content: `
### 1. The Challenge: Peak Concurrency & Segmented Permissions
University administrative portals frequently suffer from severe bottlenecks during course enrollment, examination releases, and club election voting. Multiple user roles (Faculty, Deans, Club Leads, Undergraduates) require strictly segmented visibility while needing synchronized global bulletin broadcasts.

In **Unified College Interaction System (UCIS)**, our objective was to eliminate manual desk queries by 40% while sustaining sub-500ms p99 latency across thousands of simultaneous student sessions.

---

### 2. WebSocket & REST Dual-Channel Pipeline
To optimize server resource consumption, we separated critical paths into a **Dual-Channel Protocol**:
- **RESTful Endpoints**: Used for cold, idempotent operations (historical transcript retrieval, club profile creation, authentication).
- **Persistent WebSockets**: Used for zero-latency live event feeds, voting counters, and instant department broadcast tickers.

\`\`\`javascript
// High-Concurrency Socket Connection Pool
io.on('connection', (socket) => {
  const { role, departmentId } = socket.user;
  
  // Segmented room subscription
  socket.join(\`dept:\${departmentId}\`);
  socket.join(\`role:\${role}\`);

  socket.on('submit_query', async (payload) => {
    const ticket = await queryService.create(payload, socket.user);
    io.to(\`dept:\${departmentId}\`).emit('ticket_dispatched', ticket);
  });
});
\`\`\`

---

### 3. Architectural Topology & Event Broadcast
Below is the system blueprint demonstrating the authorization middleware, service layer separation, and real-time event broadcasting mechanism:
`
  },
  {
    slug: 'ai-skills-ast-context-pruning-llm-token-reduction',
    title: 'Building AI Skills CLI: AST-Based Context Pruning for 65% LLM Token Reduction',
    subtitle: 'Designing an open-source command-line framework with automated CI/CD to extract, compress, and deliver optimal codebase context for LLM developer agents.',
    summary: 'An inside look at the AST symbol extraction algorithms, modular JSON manifests, and automated semantic context trees behind the @harshitj183/ai-skills package.',
    coverImage: '/projects/ai_skills_hero.png',
    date: 'Aug 12, 2026',
    readTime: '7 min read',
    category: 'Developer Tools',
    tags: ['Node.js', 'CLI', 'AST', 'GitHub Actions', 'Token Optimization', 'Open Source'],
    projectTitle: 'AI Skills CLI',
    projectLink: 'https://www.npmjs.com/package/@harshitj183/ai-skills',
    githubLink: 'https://github.com/harshitj183/ai-skills',
    tableOfContents: [
      { id: 'token-exhaustion', title: '1. The Cost of Context Pollution in Agentic Coding' },
      { id: 'ast-pruning-engine', title: '2. Abstract Syntax Tree (AST) Symbol Extraction' },
      { id: 'mermaid-flow', title: '3. Compression & Manifest Generation Flow' },
      { id: 'packaging-cicd', title: '4. Automated CI/CD Publishing with GitHub Actions' },
      { id: 'benchmarks', title: '5. Benchmark Results & Community Adoption' }
    ],
    mermaidChart: `flowchart LR
    Source[Raw Codebase Files] --> Scanner[File Scanner & Parser]
    Scanner --> AST[AST Symbol Extractor]
    AST --> Filter{Is Exported / Public Symbol?}
    Filter -->|Yes| SymbolMap[Symbol Dependency Graph]
    Filter -->|No| Prune[Discard Implementation Details]
    SymbolMap --> Compressor[Markdown Token Compressor]
    Compressor --> Output[Optimized Agent Context File .skills]
    Output --> LLM[LLM Agent Prompt Window - 65% Less Tokens]`,
    content: `
### 1. The Cost of Context Pollution in Agentic Coding
When feeding complete source files to coding LLMs, up to **70% of consumed tokens** consist of boilerplate imports, internal helper implementations, and unexported constants that do not directly inform architectural decision-making.

This context pollution leads to:
1. Skyrocketing API costs.
2. Context window saturation.
3. Increased risk of hallucination due to token distraction.

---

### 2. Abstract Syntax Tree (AST) Symbol Extraction
**AI Skills CLI** parses codebases using abstract syntax tree representations. Instead of dumping raw file text, it extracts typed function signatures, class interfaces, and exported type definitions while aggressively pruning internal function bodies:

\`\`\`typescript
// AST Extraction Engine Example
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

export function extractSkillSignatures(code: string): string[] {
  const ast = parse(code, { sourceType: 'module', plugins: ['typescript'] });
  const signatures: string[] = [];

  traverse(ast, {
    ExportNamedDeclaration(path) {
      signatures.push(path.getSource());
    }
  });

  return signatures;
}
\`\`\`

---

### 3. Compression & Manifest Generation Flow
The pipeline below demonstrates how source code is scanned, parsed, and compacted into portable, ultra-light context manifests for LLM agents:
`
  },
  {
    slug: 'engineering-sub-10ms-realtime-chat-systems',
    title: 'Engineering Sub-10ms Real-Time Chat Systems with Optimistic UI & Distributed State',
    subtitle: 'A technical dissection of WebSocket lifecycle management, optimistic cache reconciliation, heartbeat monitoring, and distributed message persistence.',
    summary: 'How to build rock-solid real-time messaging engines in React and Node.js with instant offline state recovery, zero flicker, and sub-10ms delivery guarantees.',
    coverImage: '/projects/chat_realtime.png',
    date: 'Jul 28, 2026',
    readTime: '5 min read',
    category: 'Full Stack',
    tags: ['React', 'WebSockets', 'Socket.io', 'Node.js', 'MongoDB', 'Optimistic UI'],
    projectTitle: 'Real-Time Messaging Application',
    projectLink: '/projects',
    githubLink: 'https://github.com/harshitj183/realtime-chat-app',
    tableOfContents: [
      { id: 'websocket-lifecycles', title: '1. WebSocket Lifecycle & Connection Resilience' },
      { id: 'optimistic-ui', title: '2. Optimistic UI Updates & Temporary ID Hashing' },
      { id: 'mermaid-flow', title: '3. Message Lifecycle Sequence' },
      { id: 'offline-reconnection', title: '4. Offline Queueing & Sequence Numbering' },
      { id: 'production-learnings', title: '5. Production Learnings & Performance Audits' }
    ],
    mermaidChart: `sequenceDiagram
    autonumber
    actor Client as Sender (Client UI)
    participant Socket as WebSocket Layer
    participant Server as Node.js Gateway
    participant DB as MongoDB Cluster
    actor Recipient as Receiver Client

    Client->>Client: Optimistic Render (Temp ID, Status: Pending)
    Client->>Socket: Emit 'send_message' (Payload + Client UUID)
    Socket->>Server: Process Message Event
    Server->>DB: Async Write & Generate Persistent ID
    Server-->>Client: Ack 'message_persisted' (UUID -> DB ID)
    Client->>Client: Update Status to 'Delivered'
    Server->>Recipient: Push 'incoming_message'
    Recipient-->>Server: Ack 'received'
    Server-->>Client: Push 'read_receipt'`,
    content: `
### 1. WebSocket Lifecycle & Connection Resilience
Real-time chat user experience is defined by how the system handles intermittent network connectivity, airplane mode toggles, and abrupt WebSocket disconnections.

In our chat architecture, we implemented an **Exponential Backoff Reconnection Strategy** with automatic heartbeat pings (every 15s) and local state cache buffering.

---

### 2. Optimistic UI Updates & Temporary ID Hashing
To achieve perceived **zero-latency messaging**, the sender's client renders the message bubble *immediately* upon clicking submit, assigned with an ephemeral client-side UUID:

\`\`\`typescript
const sendMessage = async (text: string) => {
  const tempId = crypto.randomUUID();
  const optimisticMessage: Message = {
    id: tempId,
    text,
    sender: currentUser.id,
    timestamp: new Date().toISOString(),
    status: 'sending'
  };

  // Immediate local UI append
  setMessages(prev => [...prev, optimisticMessage]);

  socket.emit('chat:send', optimisticMessage, (ack: { dbId: string; status: string }) => {
    // Reconcile temporary ID with verified DB identity
    setMessages(prev => prev.map(m => m.id === tempId ? { ...m, id: ack.dbId, status: 'sent' } : m));
  });
};
\`\`\`

---

### 3. Message Lifecycle Sequence
The sequence diagram below displays the end-to-end event flow from optimistic local dispatch to database persistence and receipt acknowledgment:
`
  }
];
