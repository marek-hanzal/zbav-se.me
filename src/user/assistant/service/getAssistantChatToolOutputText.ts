import { match, P } from "ts-pattern";
import { toAssistantChatDisplayText } from "./toAssistantChatDisplayText";

export namespace getAssistantChatToolOutputText {
	export interface Props {
		value: unknown;
	}
}

export const getAssistantChatToolOutputText = ({
	value,
}: getAssistantChatToolOutputText.Props): string => {
	return match(value)
		.with(
			{
				output: P.any,
			},
			(value) => {
				return toAssistantChatDisplayText({
					value: value.output,
				});
			},
		)
		.otherwise(() => "");
};
