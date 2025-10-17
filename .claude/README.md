# DreamForge Agent Swarm

This directory contains specialized sub-agents for Claude Code that can be invoked using the `@` mention system.

## Available Agents

### 🏗️ Architecture & Design

#### `@dreamforge-meta-engineer`
**Purpose:** Creates NEW specialized agents for any domain
**Tools:** WebSearch, Write, Read, Task, Grep, Glob
**Use When:** You need a new agent for a specific task or domain
**Specialties:**
- Agent architecture design
- Research-first agent creation
- VSA/Atomic architecture implementation
- Workflow integration

#### `@design-reviewer`
**Purpose:** Elite design review using OneRedOak 8-Phase Visual Intelligence
**Tools:** Playwright MCP, WebSearch, Read, Write, Edit, Bash
**Use When:** Need comprehensive UI/UX validation
**Specialties:**
- Pixel-perfect design review
- Responsive testing across 8+ viewports
- WCAG 2.2 AAA accessibility validation
- Core Web Vitals optimization
- Visual regression detection

#### `@dreamforge-frontend-ux-specialist`
**Purpose:** Frontend implementation and UX optimization
**Tools:** WebSearch, Write, Edit, Read, Bash
**Use When:** Building user interfaces or improving UX
**Specialties:**
- React/Vue/Svelte implementation
- Component architecture
- Performance optimization
- Accessibility implementation

### 🛢️ Backend & Infrastructure

#### `@dreamforge-database-architect`
**Purpose:** Database schema design and optimization
**Tools:** WebSearch, Write, Edit, Read, Bash
**Use When:** Designing databases, migrations, or data models
**Specialties:**
- Schema design (SQL, NoSQL)
- Migration strategies
- Query optimization
- Data modeling

#### `@dreamforge-rest-api-specialist`
**Purpose:** RESTful API design and implementation
**Tools:** WebSearch, Write, Edit, Read, Bash
**Use When:** Building or documenting APIs
**Specialties:**
- OpenAPI/Swagger specs
- API architecture
- REST best practices
- Authentication/authorization

#### `@dreamforge-devops-sre-specialist`
**Purpose:** Infrastructure, deployment, and reliability
**Tools:** WebSearch, Write, Edit, Read, Bash
**Use When:** Setting up CI/CD, monitoring, or infrastructure
**Specialties:**
- Docker/Kubernetes
- CI/CD pipelines
- Monitoring/observability
- Infrastructure as Code

### 🔒 Quality & Security

#### `@dreamforge-security-specialist`
**Purpose:** Security audits and vulnerability analysis
**Tools:** WebSearch, Write, Edit, Read, Bash
**Use When:** Security reviews or implementing security features
**Specialties:**
- Vulnerability scanning
- Authentication/authorization
- Encryption/secrets management
- Security best practices

#### `@dreamforge-test-engineer`
**Purpose:** Test strategy and implementation
**Tools:** WebSearch, Write, Edit, Read, Bash
**Use When:** Writing tests or creating test strategies
**Specialties:**
- Unit/integration testing
- E2E testing
- Test automation
- Coverage analysis

#### `@dreamforge-code-reviewer`
**Purpose:** Code quality and best practices review
**Tools:** WebSearch, Write, Edit, Read, Bash
**Use When:** Reviewing code for quality and maintainability
**Specialties:**
- Code review
- Refactoring suggestions
- Performance optimization
- Best practices enforcement

#### `@codebase-hygiene`
**Purpose:** Codebase cleanup and organization
**Tools:** Read, Write, Edit, MultiEdit, Bash, Grep, Glob, WebSearch
**Use When:** Need to clean up codebase or enforce standards
**Specialties:**
- Automated cleanup
- VSA compliance
- Temporary file removal
- Git hygiene

### 📚 Documentation & Workflow

#### `@dreamforge-documentation-specialist`
**Purpose:** Technical writing and documentation
**Tools:** WebSearch, Write, Edit, Read
**Use When:** Creating or updating documentation
**Specialties:**
- API documentation
- User guides
- Architecture documentation
- README files

#### `@dreamforge-workflow-engineer`
**Purpose:** Development workflow optimization
**Tools:** WebSearch, Write, Edit, Read, Bash
**Use When:** Optimizing development processes
**Specialties:**
- Git workflows
- Automation strategies
- Developer experience
- Process optimization

## How to Use Agents

### Invoking Agents
Use the `@` mention syntax in your prompts:
```
@design-reviewer please review the landing page at http://localhost:3000
```

### Agent Swarms
Launch multiple agents in parallel for comprehensive analysis:
```
Launch an agent swarm:
@dreamforge-code-reviewer - review code quality
@dreamforge-security-specialist - audit security
@dreamforge-test-engineer - check test coverage
```

### Custom Agents
Use `@dreamforge-meta-engineer` to create new specialized agents:
```
@dreamforge-meta-engineer create a GraphQL specialist agent
```

## Best Practices

### When to Use Agents
- **Complex tasks**: When you need deep expertise in a specific domain
- **Research required**: Agents start with comprehensive research
- **Parallel work**: Launch multiple agents for different aspects
- **Specialized tools**: When specific tool access is needed (e.g., Playwright)

### Agent Selection Tips
1. **Design Review?** → `@design-reviewer` (uses browser automation)
2. **New API?** → `@dreamforge-rest-api-specialist`
3. **Database design?** → `@dreamforge-database-architect`
4. **Security audit?** → `@dreamforge-security-specialist`
5. **Code cleanup?** → `@codebase-hygiene`
6. **Need new agent?** → `@dreamforge-meta-engineer`

### Agent Workflow Pattern
Most agents follow this pattern:
1. **Research**: WebSearch for current best practices (2025 standards)
2. **Analysis**: Examine existing code/structure
3. **Planning**: Create implementation strategy
4. **Execution**: Apply changes with safety checks
5. **Validation**: Test and verify results
6. **Documentation**: Update docs and provide reports

## Integration with DreamForge

These agents are designed to work with the DreamForge Meta-Engineering System:
- **VSA Architecture**: Agents enforce Vertical Slice Architecture
- **Atomic Design**: UI components organized as atoms → molecules → organisms
- **Memory Bank**: Agents can save context to `.dreamforge/` directory
- **Evidence-Based**: All agents research current best practices first
- **Safety-First**: Backups and validation before destructive operations

## Configuration

Agents are configured via YAML frontmatter:
```yaml
---
name: agent-name
description: What this agent does
tools: [WebSearch, Write, Edit, Read, Bash]
model: sonnet  # or opus for complex tasks
---
```

## Troubleshooting

### Agent Not Found
Ensure the agent file exists in `.claude/agents/` directory and has valid YAML frontmatter.

### Agent Not Responding
Check that the required tools are available in your Claude Code settings.

### Custom Agent Creation
Use `@dreamforge-meta-engineer` to generate properly formatted agents with research-first behavior.

---

**Last Updated:** 2025-09-29
**Total Agents:** 12
**System:** DreamForge v5.4.0