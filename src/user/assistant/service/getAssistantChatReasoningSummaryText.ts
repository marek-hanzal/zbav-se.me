import { match, P } from "ts-pattern";

export namespace getAssistantChatReasoningSummaryText {
	export interface Props {
		value: unknown;
	}
}

export const getAssistantChatReasoningSummaryText = ({
	value,
}: getAssistantChatReasoningSummaryText.Props): string => {
	return match(value)
		.with(
			{
				summary: P.array(P.any),
			},
			(value) => {
				return value.summary
					.map((part: unknown) => {
						return match(part)
							.with(
								{
									text: P.string,
								},
								(part) => part.text,
							)
							.otherwise(() => "");
					})
					.filter(Boolean)
					.join("\n\n");
			},
		)
		.otherwise(() => "");
};
