import type { OpenAIResponsesRawModelStreamEvent } from "@openai/agents";

/**
 * A little bit hacky way how to get all event stuff from the official SDK.
 *
 * We're doing this, because server is sending us those events, so this little
 * type is a contract between SSE and UI.
 */
export type AgentEvent = OpenAIResponsesRawModelStreamEvent["data"]["event"];
