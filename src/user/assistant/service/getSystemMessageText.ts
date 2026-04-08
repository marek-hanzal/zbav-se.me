import { match, P } from "ts-pattern";

export namespace getSystemMessageText {
	export interface Props {
		content: unknown;
	}
}

export const getSystemMessageText = ({ content }: getSystemMessageText.Props): string => {
	return match(content)
		.with(P.string, (content) => content)
		.otherwise(() => "");
};
