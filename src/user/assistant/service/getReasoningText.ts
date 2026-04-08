import { match, P } from "ts-pattern";

export namespace getReasoningText {
	export interface Props {
		item: unknown;
	}
}

export const getReasoningText = ({ item }: getReasoningText.Props): string => {
	return match(item)
		.with(
			{
				summary: P.array(P.any),
			},
			(item) => {
				return item.summary
					.map((part) => {
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
		.with(
			{
				content: P.array(P.any),
			},
			(item) => {
				return item.content
					.map((part) => {
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
