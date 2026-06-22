import type {
    WebSocketMessage,
    WebSocketMessageData,
    WebSocketMessageType,
} from '../../api/websocketTypes';

/**
 * Neutral WebSocket send helpers shared by the live agent surface
 * (`codingAgent.ts`), its message router (`codingAgentWebsocket.ts`), and
 * the presence tracker (`presence.ts`). Pure transport: serialize a typed
 * message onto one connection, or fan it out across every socket an agent
 * holds. No agent-class coupling — the `SimpleCodeGeneratorAgent`-typed
 * message handler that used to live alongside these helpers was retired
 * together with that agent.
 */
export function broadcastToConnections<T extends WebSocketMessageType>(
    agent: { getWebSockets(): WebSocket[] },
    type: T,
    data: WebSocketMessageData<T>,
): void {
    const connections = agent.getWebSockets();
    for (const connection of connections) {
        sendToConnection(connection, type, data);
    }
}

export function sendToConnection<T extends WebSocketMessageType>(
    connection: WebSocket,
    type: T,
    data: WebSocketMessageData<T>,
): void {
    try {
        const message: WebSocketMessage = { type, ...data } as WebSocketMessage;
        connection.send(JSON.stringify(message));
    } catch (error) {
        console.error(`Error sending message to connection ${connection.url}:`, error);
    }
}

export function sendError(connection: WebSocket, errorMessage: string): void {
    sendToConnection(connection, 'error', { error: errorMessage });
}
