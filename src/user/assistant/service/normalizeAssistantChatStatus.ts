import { match } from "ts-pattern";
import type { AssistantChatToolCallPartSchema } from "~/user/assistant/schema/part/AssistantChatToolCallPartSchema";

export namespace normalizeAssistantChatStatus {
	export interface Props {
		status: unknown;
	}
}

export const normalizeAssistantChatStatus = ({
	status,
}: normalizeAssistantChatStatus.Props): AssistantChatToolCallPartSchema.Type["status"] => {
	return match(status)
		.with("completed", () => "completed" as const)
		.with("incomplete", () => "incomplete" as const)
		.otherwise(() => "in_progress" as const);
};
