/**
 * Abstract base for behaviors and objectives. Wraps an
 * `AgentInfrastructure<TState>` and exposes typed protected accessors so
 * subclasses can stay decoupled from the DO class itself.
 *
 * Ported from upstream `cloudflare/vibesdk` `worker/agents/core/
 * AgentComponent.ts`. Imports re-pointed at the fork's local
 * `FileManager` implementation and at the stubbed `GitVersionControl` /
 * `DeploymentManager` types declared in `./AgentCore.ts`.
 */

import type { StructuredLogger } from '../../logger';
import type {
    WebSocketMessageData,
    WebSocketMessageType,
} from '../../api/websocketTypes';
import type { FileManager } from '../services/implementations/FileManager';
import { WebSocketMessageResponses } from '../constants';
import type {
    AgentInfrastructure,
    DeploymentManager,
    GitVersionControl,
} from './AgentCore';
import type { AgentState, BaseProjectState } from './state';

export abstract class AgentComponent<
    TState extends BaseProjectState = AgentState,
> {
    constructor(
        protected readonly infrastructure: AgentInfrastructure<TState>,
    ) {}

    // ==========================================
    // PROTECTED HELPERS (Infrastructure access)
    // ==========================================

    protected get env(): Env {
        return this.infrastructure.env;
    }

    get logger(): StructuredLogger {
        return this.infrastructure.logger();
    }

    protected getAgentId(): string {
        return this.infrastructure.getAgentId();
    }

    public getWebSockets(): WebSocket[] {
        return this.infrastructure.getWebSockets();
    }

    protected get state(): TState {
        return this.infrastructure.state;
    }

    setState(state: TState): void {
        try {
            this.infrastructure.setState(state);
        } catch (error) {
            this.broadcastError('Error setting state', error);
            this.logger.error('State details:', {
                originalState: JSON.stringify(this.state, null, 2),
                newState: JSON.stringify(state, null, 2),
            });
        }
    }

    // ==========================================
    // PROTECTED HELPERS (Service access)
    // ==========================================

    protected get fileManager(): FileManager {
        return this.infrastructure.fileManager;
    }

    protected get deploymentManager(): DeploymentManager {
        return this.infrastructure.deploymentManager;
    }

    public get git(): GitVersionControl {
        return this.infrastructure.git;
    }

    protected broadcast<T extends WebSocketMessageType>(
        type: T,
        data?: WebSocketMessageData<T>,
    ): void {
        this.infrastructure.broadcast(type, data);
    }

    protected broadcastError(context: string, error: unknown): void {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger.error(`${context}:`, error);
        this.broadcast(WebSocketMessageResponses.ERROR, {
            error: `${context}: ${errorMessage}`,
        });
    }
}
