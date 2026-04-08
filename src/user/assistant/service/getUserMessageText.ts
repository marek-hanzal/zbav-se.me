import { match, P } from "ts-pattern";

const fallbackUserMessageText = "";

export namespace getUserMessageText {
	export interface Props {
		content: unknown;
	}
}

export const getUserMessageText = ({ content }: getUserMessageText.Props): string => {
	return match(content)
		.with(P.string, (content) => content)
		.with(P.array(P.any), (content) => {
			return content
				.map((part) => {
					return match(part)
						.with(
							{
								type: "input_text",
								text: P.string,
							},
							(part) => part.text,
						)
						.otherwise(() => "");
				})
				.filter(Boolean)
				.join("\n\n");
		})
		.otherwise(() => fallbackUserMessageText);
};
