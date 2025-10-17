# Dreamforge Documentation

Welcome to the Dreamforge documentation. This directory contains comprehensive guides for understanding and working with the Dreamforge platform.

## Documentation Overview

### [Agent System Documentation](./AGENT_SYSTEM_DOCUMENTATION.md)

Complete technical documentation for the Dreamforge AI agent system, covering:

- **High-Level Overview**: What the agent system does and its role in Dreamforge
- **Architecture**: System components, data flow, and communication protocols
- **Agent Catalog**: Detailed documentation of each agent type with examples
- **Core Operations**: Blueprint generation, template selection, inference execution
- **Developer Guide**: How to create new agents, operations, and extend the system
- **API Reference**: Complete API documentation for classes, interfaces, and functions
- **Integration Guide**: Frontend/backend integration examples and testing strategies

## Quick Links

### For New Developers

1. Start with the [High-Level Overview](./AGENT_SYSTEM_DOCUMENTATION.md#high-level-overview) to understand the system
2. Review the [Architecture](./AGENT_SYSTEM_DOCUMENTATION.md#architecture) section for component relationships
3. Read the [Developer Guide](./AGENT_SYSTEM_DOCUMENTATION.md#developer-guide) for practical examples

### For Integration

1. See [Frontend Integration](./AGENT_SYSTEM_DOCUMENTATION.md#frontend-integration) for WebSocket communication
2. Check [Backend Integration](./AGENT_SYSTEM_DOCUMENTATION.md#backend-integration) for agent access patterns
3. Review [API Reference](./AGENT_SYSTEM_DOCUMENTATION.md#api-reference) for available methods

### For Extension

1. [Creating a New Agent](./AGENT_SYSTEM_DOCUMENTATION.md#creating-a-new-agent)
2. [Creating a New Operation](./AGENT_SYSTEM_DOCUMENTATION.md#creating-a-new-operation)
3. [Best Practices](./AGENT_SYSTEM_DOCUMENTATION.md#best-practices)

## Key Concepts

### Agents

Stateful Durable Objects that orchestrate the code generation lifecycle. Main agent: `SmartCodeGeneratorAgent`

### Operations

Stateless services that execute specific AI-driven tasks:
- PhaseGenerationOperation
- PhaseImplementationOperation
- CodeReviewOperation
- FileRegenerationOperation
- ScreenshotAnalysisOperation

### Assistants

Specialized sub-agents with conversation memory:
- RealtimeCodeFixer
- ProjectSetupAssistant
- UserConversationProcessor

### Blueprint

Product Requirements Document (PRD) generated from user prompts, containing:
- Visual design specifications
- Component architecture
- User flows and data models
- Implementation roadmap

## Architecture at a Glance

```
User Prompt
    ↓
Template Selection (AI)
    ↓
Blueprint Generation (AI)
    ↓
┌─────────────────────────────────────┐
│  SmartCodeGeneratorAgent            │
│  (Durable Object - Persistent)      │
│                                     │
│  While project not complete:        │
│    1. Plan Phase (AI)              │
│    2. Implement Phase (AI Stream)   │
│    3. Deploy to Sandbox            │
│    4. Collect Errors               │
│    5. Review & Fix (AI)            │
│    6. Iterate                      │
└─────────────────────────────────────┘
    ↓
Deployed Application + Source Code
```

## Communication Flow

```
Frontend ←──WebSocket──→ Durable Object Agent
                              ↓
                         Operations (AI)
                              ↓
                         Sandbox Service
                              ↓
                         Live Preview
```

## Core Technologies

- **Cloudflare Durable Objects**: Stateful agents
- **Cloudflare Workers**: API layer
- **WebSocket**: Real-time updates
- **AI Models**: Claude, GPT-4, Gemini
- **TypeScript**: Type-safe development
- **Zod**: Schema validation

## Directory Structure

```
/docs/
  ├── README.md (this file)
  └── AGENT_SYSTEM_DOCUMENTATION.md

/worker/agents/
  ├── core/                    # Main agents
  ├── operations/              # AI operations
  ├── assistants/              # Sub-agents
  ├── services/                # Service layer
  ├── domain/                  # Domain logic
  ├── inferutils/              # AI inference
  ├── planning/                # Blueprint & templates
  ├── output-formats/          # Code parsers
  └── tools/                   # Agent tools
```

## Getting Started

### Running the Agent System Locally

```bash
# Install dependencies
bun install

# Start development server
npm run dev

# In another terminal, start Worker
npm run local

# Access frontend
open http://localhost:5173
```

### Creating Your First Agent

```typescript
import { Agent } from 'agents';

export class MyAgent extends Agent<Env, MyState> {
  initialState = { /* ... */ };

  async initialize(params) {
    // Setup logic
  }

  async executeTask() {
    // Your logic here
  }
}
```

See [Developer Guide](./AGENT_SYSTEM_DOCUMENTATION.md#developer-guide) for complete examples.

## Common Patterns

### Executing AI Inference

```typescript
const { object } = await executeInference({
  env,
  messages: [systemMessage, userMessage],
  schema: MySchema,
  agentActionName: "myOperation",
  context: inferenceContext,
});
```

### Streaming File Generation

```typescript
await executeInference({
  env,
  messages,
  agentActionName: "phaseImplementation",
  stream: {
    chunk_size: 256,
    onChunk: (chunk) => {
      parser.parseChunk(chunk, onFileOpen, onFileChunk, onFileClose);
    }
  }
});
```

### WebSocket Communication

```typescript
// Client-side
ws.send(JSON.stringify({
  type: 'generate_all',
  data: {}
}));

// Agent-side
async webSocketMessage(connection, message) {
  const { type, data } = JSON.parse(message);
  if (type === 'generate_all') {
    await this.generateAllFiles();
  }
}
```

## Debugging Tips

### Enable Verbose Logging

```typescript
this.logger().info('Operation started', {
  operation: 'phaseImplementation',
  phaseIndex: 2,
  fileCount: 5
});
```

### Check Agent State

```typescript
const state = await getAgentState(env, agentId, true);
console.log('Current phase:', state.generatedPhases.length);
console.log('Files:', Object.keys(state.generatedFilesMap));
```

### Monitor WebSocket Messages

```typescript
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  console.log('Agent message:', msg.type, msg.data);
};
```

## Performance Considerations

- **Streaming**: Use streaming for large outputs to avoid timeouts
- **Parallel Operations**: Run FileRegeneration in parallel when possible
- **Caching**: Cache expensive computations (blueprint, template selection)
- **Token Management**: Monitor token usage to prevent rate limits
- **State Size**: Keep Durable Object state under 100KB

## Security Notes

- User input is sanitized before AI inference
- File paths are validated to prevent directory traversal
- WebSocket connections require authentication
- Sandbox environments are isolated
- API keys are stored in environment variables

## Contributing

When adding new features to the agent system:

1. Follow the established patterns (Agent, Operation, Assistant)
2. Add comprehensive TypeScript types
3. Include structured logging
4. Write unit tests for pure functions
5. Add integration tests for agents
6. Update this documentation
7. Add JSDoc comments to public APIs

## Troubleshooting

### Common Issues

**Agent not responding**:
- Check Durable Object logs: `npm run local`
- Verify WebSocket connection
- Check agent state: `getAgentState(env, agentId)`

**Generation timeouts**:
- Enable streaming for large outputs
- Reduce max_tokens if needed
- Check sandbox service health

**Rate limit errors**:
- Automatic fallback to cheaper models enabled
- Check AGENT_CONFIG settings
- Monitor token usage per operation

**File parsing errors**:
- SCOF format handles arbitrary chunk boundaries
- Check for malformed EOF markers
- Review file content buffers

## Resources

- [Cloudflare Durable Objects Docs](https://developers.cloudflare.com/durable-objects/)
- [Agent System Architecture](./AGENT_SYSTEM_DOCUMENTATION.md#architecture)
- [API Reference](./AGENT_SYSTEM_DOCUMENTATION.md#api-reference)
- [Integration Examples](./AGENT_SYSTEM_DOCUMENTATION.md#integration-guide)

## Support

For questions or issues:
- Review the [complete documentation](./AGENT_SYSTEM_DOCUMENTATION.md)
- Check the [API Reference](./AGENT_SYSTEM_DOCUMENTATION.md#api-reference)
- Examine existing agent implementations in `/worker/agents/core/`

---

**Last Updated**: October 13, 2025
**Maintained by**: Dreamforge Development Team
