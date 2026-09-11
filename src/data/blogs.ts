export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  coverImage: string;
  date: string;
  readTime: string;
  category: 'AI Systems' | 'Distributed Systems' | 'Developer Tools' | 'Full Stack' | 'Cloud & DevOps' | 'LLM & Agents';
  tags: string[];
  projectLink?: string;
  githubLink?: string;
  projectTitle?: string;
  mermaidChart: string;
  tableOfContents: { id: string; title: string }[];
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'production-rag-hybrid-search-reranking-self-corrective',
    title: 'Production RAG: Hybrid Search, Cross-Encoder Reranking & Self-Corrective Retrieval',
    subtitle: 'Moving beyond naive vector search to build fault-tolerant Retrieval-Augmented Generation with reciprocal rank fusion, dynamic query rewriting, and hallucination graders.',
    summary: 'A complete architectural guide to production RAG systems combining dense embeddings with sparse BM25 lexical search, semantic reranking, and self-corrective validation loops.',
    coverImage: '/projects/conceptcraft_landing.png',
    date: 'Sep 11, 2026',
    readTime: '9 min read',
    category: 'AI Systems',
    tags: ['RAG', 'Vector Search', 'pgvector', 'Cross-Encoder', 'LangChain', 'Python'],
    tableOfContents: [
      { id: 'naive-rag-failures', title: '1. Why Naive RAG Fails in Production' },
      { id: 'hybrid-search-rrf', title: '2. Hybrid Search & Reciprocal Rank Fusion (RRF)' },
      { id: 'mermaid-flow', title: '3. End-to-End Self-Corrective RAG Pipeline' },
      { id: 'reranking-layer', title: '4. Cross-Encoder Semantic Reranking' },
      { id: 'hallucination-grader', title: '5. Self-Correction & Grounding Evaluation Loops' },
      { id: 'production-benchmarks', title: '6. Production Benchmarks & Implementation Guide' }
    ],
    mermaidChart: `flowchart TD
    UserQuery([User Natural Language Query]) --> QueryRewriter[Dynamic Query Expansion & Rewriter]
    QueryRewriter -->|Dense Vector Embedding| VectorDB[(pgvector / Qdrant Dense Index)]
    QueryRewriter -->|Sparse Token Splitting| BM25[BM25 Lexical Inverted Index]
    VectorDB --> RRF[Reciprocal Rank Fusion - RRF Combiner]
    BM25 --> RRF
    RRF --> Top50[Top-50 Candidate Chunks]
    Top50 --> Reranker[Cross-Encoder Reranker Model]
    Reranker --> Top5[Top-5 Highly Relevant Chunks]
    Top5 --> DocGrader{Document Relevance Grader}
    DocGrader -->|Irrelevant Context| WebFallback[Fallback Web Search & Expand]
    DocGrader -->|Relevant Context| Generator[LLM Synthesis with Citations]
    WebFallback --> Generator
    Generator --> HallucinationGrader{Hallucination Grounding Check}
    HallucinationGrader -->|Grounded| FinalResponse([Verified Factual Output])
    HallucinationGrader -->|Hallucinated| Generator`,
    content: `
### 1. Why Naive RAG Fails in Production
Naive RAG (simply embedding chunks with an embedding model, calculating cosine similarity, and stuffing top-K chunks into a prompt) fails in real-world enterprise environments due to:
1. **Keyword Blindness**: Vector cosine similarity frequently misses exact SKU codes, version numbers, or legal identifiers.
2. **Context Fragmentation**: Chunks cut mid-sentence lose grammatical context and causal relationships.
3. **Lost-in-the-Middle Phenomenon**: LLMs prioritize the beginning and end of long prompts, ignoring middle context chunks.

---

### 2. Hybrid Search & Reciprocal Rank Fusion (RRF)
To solve keyword blindness, production architectures execute parallel **Dense Vector Search** and **Sparse Lexical Search (BM25)**, combining their ranked lists via Reciprocal Rank Fusion:

\`\`\`python
def reciprocal_rank_fusion(vector_results, bm25_results, k=60):
    rrf_scores = {}
    for rank, doc_id in enumerate(vector_results):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0) + 1 / (k + rank + 1)
    for rank, doc_id in enumerate(bm25_results):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0) + 1 / (k + rank + 1)
    
    return sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
\`\`\`

---

### 3. End-to-End Self-Corrective RAG Pipeline
The architectural blueprint below displays the full dual-index retrieval flow, cross-encoder scoring, and automated hallucination verification checkpoints:
`
  },
  {
    slug: 'model-context-protocol-mcp-agent-tooling-architecture',
    title: 'Model Context Protocol (MCP): Building Extensible Tool & Resource Gateways for LLMs',
    subtitle: 'Standardizing AI agent integrations using JSON-RPC, Server-Sent Events (SSE), dynamic tool registration, and bidirectional resource streaming.',
    summary: 'An architectural deep-dive into Anthropic’s Model Context Protocol (MCP), designing high-performance custom servers, securing tool sandboxes, and orchestrating autonomous agent workflows.',
    coverImage: '/projects/ai_skills_hero.png',
    date: 'Sep 08, 2026',
    readTime: '8 min read',
    category: 'LLM & Agents',
    tags: ['MCP', 'AI Agents', 'TypeScript', 'JSON-RPC', 'Tool Calling', 'FastAPI'],
    tableOfContents: [
      { id: 'the-mcp-paradigm', title: '1. The Problem: The N×M Tool Integration Matrix' },
      { id: 'mcp-architecture', title: '2. Client-Host-Server Protocol Architecture' },
      { id: 'mermaid-flow', title: '3. MCP Protocol Handshake & Execution Lifecycle' },
      { id: 'building-mcp-server', title: '4. Building a Custom Production TypeScript MCP Server' },
      { id: 'security-sandboxing', title: '5. Security Boundaries & Permission Sandboxing' },
      { id: 'future-agentic-ecosystem', title: '6. The Future of Universal AI Interoperability' }
    ],
    mermaidChart: `flowchart TD
    subgraph Host Application [AI Host / Desktop IDE / CLI]
      HostCore[Core LLM Agent Engine]
      MCPClient[MCP Client Manager]
      HostCore <--> MCPClient
    end

    subgraph MCP Transport Layer [JSON-RPC over Stdio / SSE / WebSockets]
      MCPClient <-->|tools/list & call_tool| StdioTransport[Stdio / Subprocess]
      MCPClient <-->|resources/read| SSETransport[HTTP + Server-Sent Events]
    end

    subgraph MCP Server Ecosystem [Isolated Tool Servers]
      Server1[Database MCP Server - PostgreSQL/Prisma]
      Server2[Filesystem & AST MCP Server]
      Server3[DevOps & Cloud MCP Server - Docker/K8s]
      Server4[Custom Business API Gateway]
    end

    StdioTransport <--> Server1
    StdioTransport <--> Server2
    SSETransport <--> Server3
    SSETransport <--> Server4`,
    content: `
### 1. The Problem: The N×M Tool Integration Matrix
Historically, every AI host (Claude Desktop, Cursor, Custom Agent CLI) had to maintain bespoke integration code for every external tool, database, and repository format. Connecting $N$ models to $M$ tools required $N \\times M$ fragile custom adapters.

**Model Context Protocol (MCP)** solves this by defining an open standard: hosts implement one MCP Client, and developer tools expose an MCP Server over standard transports (stdio or HTTP SSE).

---

### 2. Client-Host-Server Protocol Architecture
MCP establishes three core capabilities:
- **Tools**: Executable functions that LLMs can call with typed JSON schema arguments.
- **Resources**: Read-only structured data files, database schemas, or live server metrics.
- **Prompts**: Parameterized prompt templates exposed directly by the server.

\`\`\`typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new Server({ name: "db-mcp-server", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "query_database",
    description: "Executes parameterized SQL queries against PostgreSQL",
    inputSchema: { type: "object", properties: { sql: { type: "string" } }, required: ["sql"] }
  }]
}));
\`\`\`

---

### 3. MCP Protocol Handshake & Execution Lifecycle
The diagram below illustrates how client hosts discover available capabilities, negotiate permissions, and securely execute tool operations:
`
  },
  {
    slug: 'deterministic-llm-systems-pydantic-schemas-react-loops',
    title: 'Deterministic LLM Systems: Guardrails, Pydantic Schema Enforcement & ReAct Loops',
    subtitle: 'Eliminating probabilistic hallucinations in mission-critical applications using Context-Free Grammars (CFG), Pydantic v2 validation, and autonomous self-healing loops.',
    summary: 'How to convert non-deterministic LLM generations into guaranteed, typed JSON data structures suitable for production API ingestion and microservice architectures.',
    coverImage: '/projects/conceptcraft_landing.png',
    date: 'Sep 02, 2026',
    readTime: '7 min read',
    category: 'LLM & Agents',
    tags: ['LLM', 'Pydantic', 'FastAPI', 'Guardrails', 'ReAct', 'Python'],
    tableOfContents: [
      { id: 'non-determinism-challenge', title: '1. The Non-Determinism Bottleneck in Backend Systems' },
      { id: 'grammar-constrained-decoding', title: '2. Grammar-Constrained Decoding vs. Post-Hoc Validation' },
      { id: 'mermaid-flow', title: '3. Autonomous Self-Healing Validation State Machine' },
      { id: 'pydantic-v2-enforcement', title: '4. High-Throughput Pydantic v2 Schema Design' },
      { id: 'react-agent-loops', title: '5. ReAct (Reasoning + Acting) Execution Patterns' },
      { id: 'production-rules', title: '6. Production Hardening Checklist' }
    ],
    mermaidChart: `stateDiagram-v2
    [*] --> IngestPrompt: User Input Received
    IngestPrompt --> InjectSchema: Compile Pydantic JSON Schema
    InjectSchema --> LLMInference: Constrained Sampling
    LLMInference --> ParseOutput: Strict JSON AST Parse
    
    state ValidationBranch <<choice>>
    ParseOutput --> ValidationBranch
    
    ValidationBranch --> TypeValidationPassed: Valid Schema
    ValidationBranch --> SelfHealingLoop: ValidationError (Field Missing/Invalid Type)
    
    SelfHealingLoop --> LLMInference: Prompt with Exact StackTrace & Diff
    TypeValidationPassed --> DownstreamService: Type-Safe DTO Dispatched
    DownstreamService --> [*]`,
    content: `
### 1. The Non-Determinism Bottleneck in Backend Systems
In web backend microservices, downstream systems (SQL databases, financial ledgers, email dispatchers) require deterministic, strongly typed payloads. Standard LLM completions frequently fail with trailing commas, unescaped markdown code fences, or mismatched data types.

---

### 2. Grammar-Constrained Decoding vs. Post-Hoc Validation
Modern production systems utilize a two-tier strategy:
1. **Grammar-Level Token Masking (Outlines / llama.cpp / vLLM)**: Masks impossible tokens during softmax sampling based on a regex or JSON schema state machine.
2. **Autonomous Self-Healing Loop**: If semantic validation fails (e.g., end-date before start-date), the exact Pydantic error trace is automatically fed back to the LLM for immediate correction.

\`\`\`python
from pydantic import BaseModel, Field, field_validator
from typing import List

class ArchitectureSpec(BaseModel):
    service_name: str = Field(..., min_length=3)
    memory_limit_mb: int = Field(..., ge=128, le=65536)
    dependencies: List[str] = Field(default_factory=list)

    @field_validator('service_name')
    def validate_k8s_compliant(cls, v):
        if not v.replace('-', '').isalnum():
            raise ValueError('Must be RFC 1123 compliant lowercase alphanumeric')
        return v.lower()
\`\`\`

---

### 3. Autonomous Self-Healing Validation State Machine
The state diagram below illustrates the self-healing retry cycle that guarantees 100% type-safety before payloads hit downstream microservices:
`
  },
  {
    slug: 'production-docker-multistage-builds-gpu-acceleration',
    title: 'Production Dockerization: Multi-Stage Builds, Distroless Images & GPU Acceleration',
    subtitle: 'Containerizing modern Next.js frontends, FastAPI microservices, and PyTorch AI inference engines with minimal attack surfaces and sub-100MB images.',
    summary: 'A deep-dive into production container engineering: reducing Docker image sizes by 85%, hardening non-root security postures, and configuring NVIDIA container runtimes for LLMs.',
    coverImage: '/projects/conceptcraft_landing.png',
    date: 'Aug 29, 2026',
    readTime: '7 min read',
    category: 'Cloud & DevOps',
    tags: ['Docker', 'Containers', 'DevOps', 'GPU', 'Security', 'FastAPI'],
    tableOfContents: [
      { id: 'container-bloat', title: '1. The Problem: Bloated Containers & Vulnerability Sprawl' },
      { id: 'multistage-patterns', title: '2. Multi-Stage Build Optimization Patterns' },
      { id: 'mermaid-flow', title: '3. Multi-Stage Compilation Pipeline' },
      { id: 'distroless-security', title: '4. Non-Root Distroless & Alpine Hardening' },
      { id: 'nvidia-gpu-container', title: '5. NVIDIA Container Toolkit for Local LLM Inference' },
      { id: 'docker-compose-stack', title: '6. Production Docker Compose Service Topology' }
    ],
    mermaidChart: `flowchart LR
    subgraph Stage1 [Stage 1: Build & Dependencies]
      SourceCode[Source Code + Dependencies] --> BuildTools[GCC / Node / Poetry / Compilers]
      BuildTools --> Artifacts[Compiled Binaries & Node Modules]
    end

    subgraph Stage2 [Stage 2: Production Distroless]
      Artifacts --> CopyClean[Copy ONLY Production Assets]
      BaseImage[gcr.io/distroless or Alpine Base - 25MB] --> CopyClean
      CopyClean --> Security[Non-Root User: 10001:10001]
      Security --> FinalImage[Final Minimal Image: 65MB - Zero CVEs]
    end`,
    content: `
### 1. The Problem: Bloated Containers & Vulnerability Sprawl
Standard naive Dockerfiles bundle package managers (apt, npm, pip), build toolchains (gcc, make), and test dependencies into the final production image. A simple Node or Python container often exceeds **1.5GB**, introducing dozens of critical CVE vulnerabilities and sluggish CI/CD deployment pulls.

---

### 2. Multi-Stage Build Optimization Patterns
By isolating build dependencies into ephemeral stages and copying only compiled artifacts into a distroless or lightweight Alpine runtime, images can be shrunk by **over 85%**:

\`\`\`dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Minimal Distroless Production Runner
FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
USER 10001:10001
EXPOSE 3000
CMD ["server.js"]
\`\`\`

---

### 3. Multi-Stage Compilation Pipeline
The diagram below shows how source code is compiled in an isolated sandbox, discarding megabytes of build tools before generating the secure final runtime:
`
  },
  {
    slug: 'kubernetes-production-ingress-hpa-zero-downtime-rollouts',
    title: 'Kubernetes in Production: Ingress Controllers, HPA, Zero-Downtime Rollouts & Helm',
    subtitle: 'Architecting resilient cloud-native cluster topologies with Horizontal Pod Autoscaling (HPA), automated health probes, and canary traffic splitting.',
    summary: 'A complete operational guide to running production workloads on Kubernetes (K8s), designing Helm charts, configuring Nginx Ingress, and configuring automated replica scaling under load spikes.',
    coverImage: '/projects/ucis_01_home.png',
    date: 'Aug 20, 2026',
    readTime: '9 min read',
    category: 'Cloud & DevOps',
    tags: ['Kubernetes', 'K8s', 'Helm', 'DevOps', 'Cloud', 'Microservices'],
    tableOfContents: [
      { id: 'k8s-fundamentals', title: '1. Why Kubernetes for Production Microservices' },
      { id: 'ingress-traffic-flow', title: '2. Nginx Ingress Controller & TLS Termination' },
      { id: 'mermaid-flow', title: '3. Production Cluster Architecture Topology' },
      { id: 'hpa-autoscaling', title: '4. Horizontal Pod Autoscaler (HPA) & Custom Metrics' },
      { id: 'zero-downtime-rollouts', title: '5. Rolling Updates with Readiness & Liveness Probes' },
      { id: 'helm-chart-engineering', title: '6. Helm Chart Modularization & GitOps Workflows' }
    ],
    mermaidChart: `flowchart TD
    Internet([External Internet Traffic]) --> LB[Cloud Network Load Balancer]
    LB --> Ingress[Nginx Ingress Controller + Cert-Manager SSL]
    
    subgraph K8s Cluster [Kubernetes Production Cluster]
      Ingress -->|Path: /api| APIService[API ClusterIP Service]
      Ingress -->|Path: /| WebService[Web Frontend Service]
      
      APIService --> Pod1[API Pod Replica 1]
      APIService --> Pod2[API Pod Replica 2]
      APIService --> PodN[API Pod Replica N]
      
      MetricsServer[K8s Metrics Server] --> HPA[Horizontal Pod Autoscaler]
      HPA -->|Scale Up on >75% CPU| APIService
      
      Pod1 --> ConfigMap[(ConfigMaps & SealedSecrets)]
      Pod1 --> DBConn[(Stateful Managed DB / Cloud SQL)]
    end`,
    content: `
### 1. Why Kubernetes for Production Microservices
When migrating from monolithic single-server deployments to high-availability microservices, Kubernetes provides automated self-healing, rolling deployments with zero downtime, and declarative infrastructure configuration.

---

### 2. Nginx Ingress Controller & TLS Termination
Incoming traffic reaches a single Cloud Load Balancer, which delegates routing to an internal **Nginx Ingress Controller**. Cert-manager automatically provisions and renews Let's Encrypt TLS certificates.

---

### 3. Production Cluster Architecture Topology
The diagram below illustrates the end-to-end traffic lifecycle through Ingress, ClusterIP Services, and dynamic pod scaling managed by HPA:
`
  },
  {
    slug: 'architecting-conceptcraft-ai-multi-agent-orchestration',
    title: 'Architecting ConceptCraft AI: Multi-Agent Orchestration & Real-Time D3 Sandbox Synthesis',
    subtitle: 'How we built a 5-agent pipeline using LangGraph, FastAPI, and Next.js to transform abstract theoretical concepts into executable, interactive D3.js simulations.',
    summary: 'A comprehensive deep-dive into multi-agent design patterns, state graphs, automatic retry heuristics, and AST-driven interactive sandbox compilation in ConceptCraft AI.',
    coverImage: '/projects/conceptcraft_landing.png',
    date: 'Aug 15, 2026',
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
    date: 'Aug 10, 2026',
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
    date: 'Aug 04, 2026',
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
