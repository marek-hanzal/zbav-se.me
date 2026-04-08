import { match, P } from "ts-pattern";
import type { AssistantChatToolCallPartSchema } from "~/user/assistant/schema/part/AssistantChatToolCallPartSchema";

export namespace getAssistantChatToolCallStatus {
	export interface Props {
		value: unknown;
		fallback: AssistantChatToolCallPartSchema.Type["status"];
	}
}

export const getAssistantChatToolCallStatus = ({
	value,
	fallback,
}: getAssistantChatToolCallStatus.Props): AssistantChatToolCallPartSchema.Type["status"] => {
	return match(value)
		.with(
			{
				status: P.union("in_progress", "completed", "incomplete"),
			},
			(value) => value.status,
		)
		.otherwise(() => fallback);
};
