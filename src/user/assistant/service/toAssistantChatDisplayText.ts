import { match, P } from "ts-pattern";

export namespace toAssistantChatDisplayText {
	export interface Props {
		value: unknown;
	}
}

export const toAssistantChatDisplayText = ({ value }: toAssistantChatDisplayText.Props): string => {
	return match(value)
		.with(P.string, (value) => value)
		.with(null, () => "")
		.otherwise((value) => {
			try {
				return JSON.stringify(value, null, 2);
			} catch {
				return String(value);
			}
		});
};
