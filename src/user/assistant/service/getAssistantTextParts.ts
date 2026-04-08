import { match, P } from "ts-pattern";
import type { AssistantChatPartTypeEnumSchema } from "~/user/assistant/schema/part/AssistantChatPartTypeEnumSchema";
import type { AssistantChatTextPartSchema } from "~/user/assistant/schema/part/AssistantChatTextPartSchema";

export namespace getAssistantTextParts {
	export interface Props {
		content: unknown;
		messageId: string;
	}
}

export const getAssistantTextParts = ({
	content,
	messageId,
}: getAssistantTextParts.Props): AssistantChatTextPartSchema.Type[] => {
	return match(content)
		.with(P.array(P.any), (content) => {
			return content.flatMap((part, index) => {
				return match(part)
					.with(
						{
							type: P.union("output_text", "refusal"),
						},
						(part) => {
							const text = match(part)
								.with(
									{
										type: "output_text",
										text: P.string,
									},
									(part) => part.text,
								)
								.with(
									{
										type: "refusal",
										refusal: P.string,
									},
									(part) => part.refusal,
								)
								.otherwise(() => "");
							const nextPart: AssistantChatTextPartSchema.Type = {
								id: `${messageId}-text-${index}`,
								type: "text" satisfies AssistantChatPartTypeEnumSchema.Type,
								text,
							};

							return [
								nextPart,
							];
						},
					)
					.otherwise(() => []);
			});
		})
		.otherwise(() => []);
};
