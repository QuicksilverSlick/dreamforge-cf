# Planning Mode - Technical Documentation

**Feature Branch:** `feature/planning-mode`
**Status:** Design & Research Phase
**Last Updated:** October 14, 2025

---

## Executive Summary

Planning Mode enables users to have interactive AI conversations to refine project requirements before code generation. This document provides complete technical specifications based on October 2025 research findings.

### Key Decisions

✅ **AI Model:** Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) - Latest, best for planning
✅ **Streaming:** WebSocket + AI Gateway (Non-Realtime WebSocket API)
✅ **UI Location:** Existing Settings → Planning tab (already exists!)
✅ **Architecture:** Reuse existing `UserConversationProcessor` pattern

---

## 🔬 Research Findings

### 1. Anthropic Models (October 2025)

**Available Claude Models:**
- **Claude Sonnet 4.5** (Sept 29, 2025) - RECOMMENDED ⭐
- **Claude Opus 4.1** (Aug 5, 2025) - Complex tasks
- **Claude Sonnet 4** (May 14, 2025) - Production
- **Claude 3.7 Sonnet** (Feb 19, 2025) - Extended thinking
- **Claude 3.5 Haiku** (Oct 22, 2024) - Fast & cheap

**Why Sonnet 4.5 for Planning:**
- Best coding model in the world
- 200K context, 64K max output
- $3/$15 per MTok (input/output)
- Extended thinking capable
- January 2025 knowledge cutoff

**Model Configuration:**
```typescript
planningConversation: {
  name: 'anthropic/claude-sonnet-4-5-20250929',
  temperature: 0.7,
  max_tokens: 8000,
  reasoning_effort: 'medium',
  fallbackModel: 'anthropic/claude-sonnet-4-20250514'
}
```

### 2. Cloudflare AI Gateway Streaming

**Answer: YES, WebSockets Are Supported**

Cloudflare AI Gateway offers **Non-Realtime WebSocket API** (GA since March 2025):
- Works with ALL providers (even if they don't natively support WebSockets)
- Automatic request/response correlation via `eventId`
- Streaming chunks relayed in real-time
- Built-in analytics and caching

**Recommendation:** Use AI Gateway WebSocket (not direct HTTP/SSE)

**Why:**
- ✅ Unified infrastructure (already using AI Gateway)
- ✅ Analytics tracking automatic
- ✅ Provider abstraction (easy model switching)
- ✅ Rate limiting and caching built-in
- ✅ Fallback logic handled by gateway

### 3. Existing UI Infrastructure

**GOOD NEWS:** The Planning tab already exists!

**Location:** `/src/components/model-config-tabs.tsx` (lines 31-37)

**Current Planning Tab Agents:**
- `phaseGeneration` - Development phase planning
- `projectSetup` - Technical scaffolding

**What We Need:** Add new agent configuration for "Planning Conversation" (conversational mode before blueprint)

**UI Pattern:** Reuse existing `ConfigCard` and `ConfigModal` components - no new UI needed!

---

## 📐 Architecture Design

### High-Level Flow

```
User → Frontend (React)
    ↓ WebSocket
Worker (Durable Object)
    ↓ AI Gateway WebSocket
Anthropic API (Claude Sonnet 4.5)
    ↓ Streaming Response
AI Gateway → Worker → Frontend
```

### Component Structure

**Backend:**
1. New operation: `PlanningConversationProcessor.ts`
2. Extend `AgentConfig` with `planningConversation` key
3. Add WebSocket message types (`planning_mode_started`, `planning_mode_response`)
4. Reuse existing streaming infrastructure

**Frontend:**
1. Add model card to existing Planning tab in Settings
2. Toggle "Planning Mode" in chat interface
3. Display planning conversation with streaming
4. "Proceed to Generation" button after planning complete

**Database:**
- Optional: New table `planning_conversations` for analytics
- Store in existing Durable Object state during session

---

## 🎨 UI/UX Implementation

### Settings Configuration (No New UI Needed!)

The Planning tab exists at `/settings` → AI Model Configurations → Planning

**Add Configuration Card:**

```
┌────────────────────────────────────────────────────┐
│ 💬  Planning Conversation              [Custom]   │
│     Interactive requirement gathering before       │
│     code generation starts                         │
│                                                    │
│     claude-sonnet-4-5-20250929       [Anthropic]  │
│     [T: 0.7]  [8K tokens]  [Medium]               │
│                                                    │
│     [Configure]  [▶]  [↻]                         │
└────────────────────────────────────────────────────┘
```

**Configuration Modal Parameters:**
- Model: Dropdown (Claude Sonnet 4.5, Opus 4.1, Sonnet 4, 3.7 Sonnet, Haiku 3.5)
- Temperature: 0.0 - 1.0 slider (default 0.7)
- Max Tokens: 1000 - 32000 input (default 8000)
- Reasoning Effort: Low/Medium/High dropdown (default Medium)

### Chat Interface Planning Mode

**Before Generation:**
```
┌─────────────────────────────────────────────────┐
│  💡 Planning Mode Active                  [⚙️]  │
├─────────────────────────────────────────────────┤
│                                                  │
│  🤖 Let's plan your project! What are you       │
│     thinking of building?                       │
│                                                  │
│  👤 A recipe sharing platform                   │
│                                                  │
│  🤖 Great! To help me understand better:        │
│     - Who's your target audience?               │
│     - Mobile or web-first?                      │
│     - Key features?                             │
│                                                  │
│  ┌────────────────────────────────────────────┐│
│  │ Your message...                     [Send] ││
│  └────────────────────────────────────────────┘│
│                                                  │
│  [Exit Planning]        [Proceed to Generation]│
└─────────────────────────────────────────────────┘
```

**Toggle Mechanism:**
- Planning Mode toggle above chat input (like existing mode toggles)
- When ON: Messages go to Planning Conversation processor
- When OFF: Standard blueprint generation flow

---

## 🔧 Implementation Checklist

### Phase 1: Model Configuration (Week 1)

**Backend:**
- [ ] Add `CLAUDE_4_5_SONNET` to `AIModels` enum
- [ ] Add `planningConversation` to `AgentConfig` interface
- [ ] Set default config in `AGENT_CONFIG`
- [ ] Add to existing model resolution logic

**Files to Modify:**
- `/worker/agents/inferutils/config.types.ts` (+1 enum value, +1 config key)
- `/worker/agents/inferutils/config.ts` (+6 lines config)

**Frontend:**
- [ ] Add `planningConversation` to settings descriptions
- [ ] Add to Planning tab mapping in `model-config-tabs.tsx`

**Files to Modify:**
- `/src/routes/settings/index.tsx` (+1 description)
- `/src/components/model-config-tabs.tsx` (+1 mapping)

**Outcome:** Planning Conversation model configurable in Settings UI

---

### Phase 2: Backend Processing (Week 2)

- [ ] Create `PlanningConversationProcessor.ts` operation
- [ ] Add WebSocket message types for planning
- [ ] Implement streaming response handler
- [ ] Add planning state to Durable Object

**Files to Create:**
- `/worker/agents/operations/PlanningConversationProcessor.ts` (~400 lines, based on `UserConversationProcessor`)

**Files to Modify:**
- `/worker/api/websocketTypes.ts` (+4 message types)
- `/worker/agents/core/state.ts` (+1 planning state field)
- `/worker/agents/constants.ts` (+4 message constants)

**Outcome:** Backend can process planning conversations

---

### Phase 3: Frontend UI (Week 3)

- [ ] Add Planning Mode toggle to chat
- [ ] Implement planning message display
- [ ] Add "Proceed to Generation" button
- [ ] Wire up WebSocket messages

**Files to Create:**
- `/src/features/planning/PlanningModeToggle.tsx`
- `/src/features/planning/PlanningConversation.tsx`

**Files to Modify:**
- `/src/routes/chat/chat.tsx` (add toggle, conditional rendering)
- `/src/routes/chat/hooks/use-chat.ts` (planning mode state)
- `/src/routes/chat/utils/handle-websocket-message.ts` (+planning message handlers)

**Outcome:** Users can toggle planning mode and chat with AI

---

### Phase 4: Integration & Testing (Week 4)

- [ ] Unit tests for `PlanningConversationProcessor`
- [ ] WebSocket integration tests
- [ ] E2E tests for planning flow
- [ ] Model configuration CRUD tests

**Test Files to Create:**
- `/worker/agents/operations/__tests__/PlanningConversationProcessor.test.ts`
- `/tests/integration/planning-websocket.test.ts`
- `/e2e/planning-mode.spec.ts`

**Outcome:** Fully tested planning mode feature

---

## 📊 Cost Analysis

### Planning Session Cost Estimates (Claude Sonnet 4.5)

| Complexity | Avg Turns | Tokens (In/Out) | Cost per Session |
|-----------|-----------|-----------------|------------------|
| Simple    | 3-4       | 2K / 1.5K       | $0.03           |
| Moderate  | 5-7       | 5K / 4K         | $0.08           |
| Complex   | 8-12      | 10K / 8K        | $0.15           |

**Monthly Cost (1000 users, mixed complexity):** ~$85

**Comparison:**
- Claude Opus 4.1: ~$405/month (4.7x more expensive)
- Gemini 2.5 Pro: Free tier available, then ~$40/month

**Recommendation:** Sonnet 4.5 offers best quality/cost ratio for planning

---

## 🚀 Deployment Strategy

### Feature Flag Rollout

**Week 1:** Internal team only (cloudflare.com emails)
**Week 2-3:** 5% beta users
**Week 4:** 10% rollout
**Week 5:** 25% rollout
**Week 6:** 50% rollout
**Week 7+:** 100% rollout

### Monitoring Metrics

- Planning session duration (target: 3-7 minutes)
- Conversation turns (target: 4-8 turns)
- Proceed-to-generation rate (target: >70%)
- AI cost per session (target: <$0.10)
- User satisfaction (target: >4/5)

---

## 📚 Technical References

### Official Documentation

**Anthropic Claude:**
- Models Overview: https://docs.claude.com/en/docs/about-claude/models
- Streaming: https://docs.claude.com/en/docs/build-with-claude/streaming
- Extended Thinking: https://docs.claude.com/en/docs/build-with-claude/extended-thinking

**Cloudflare AI Gateway:**
- Overview: https://developers.cloudflare.com/ai-gateway/
- WebSockets API: https://developers.cloudflare.com/ai-gateway/usage/websockets-api/
- Analytics: https://developers.cloudflare.com/ai-gateway/get-started/analytics/

### Dreamforge Codebase References

**Existing Patterns to Reuse:**
- Conversation Processor: `/worker/agents/operations/UserConversationProcessor.ts`
- Streaming Handler: `/worker/agents/inferutils/core.ts` (lines 542-612)
- Model Config UI: `/src/components/config-card.tsx`, `/src/components/config-modal.tsx`
- WebSocket Protocol: `/worker/agents/core/websocket.ts`

---

## ✅ Next Steps

1. **Review & Approve:**
   - Technical architecture (this document)
   - Model selection (Sonnet 4.5)
   - Streaming approach (AI Gateway WebSocket)
   - UI integration (existing Settings tab)

2. **Begin Phase 1:**
   - Add Claude Sonnet 4.5 to model enum
   - Create `planningConversation` config
   - Update Settings UI to show new agent

3. **Set Up Environment:**
   - Verify Anthropic API key
   - Confirm AI Gateway access
   - Test streaming locally

4. **Team Alignment:**
   - Backend engineer: Agent operations
   - Frontend engineer: UI integration
   - Product: Feature flag strategy
   - QA: Test plan creation

---

## 🤔 Open Questions

1. **Should planning be default or opt-in?**
   - Option A: Always start in planning mode (recommended)
   - Option B: User chooses "Plan" vs "Build Immediately"
   - Option C: Auto-detect complexity and suggest planning

2. **Planning time limit?**
   - Soft limit at 15 minutes with reminder?
   - No limit (trust user judgment)?
   - Hard timeout at 30 minutes?

3. **Planning history?**
   - Save all planning conversations for analytics?
   - Delete after project generation?
   - Let users export planning summaries?

4. **Multi-step planning?**
   - Phase 1: Requirements
   - Phase 2: Technical architecture
   - Phase 3: Design decisions
   - Or keep it free-form conversation?

---

**Document Status:** ✅ Ready for Implementation
**Estimated Development Time:** 4 weeks (1 FTE)
**Risk Level:** Low (reuses proven patterns)
**User Impact:** High (better requirements → better results)

