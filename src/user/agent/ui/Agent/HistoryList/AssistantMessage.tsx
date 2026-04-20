import type { FC } from "react";
import { MessageContent } from "./MessageContent";

export namespace AssistantMessage {
	export interface Props extends MessageContent.Props {
		//
	}
}

export const AssistantMessage: FC<AssistantMessage.Props> = (props) => {
	return (
		<MessageContent
			data-ui={"AssistantMessage"}
			data-ui-background={undefined}
			data-ui-shadow={undefined}
			data-ui-inner={undefined}
			{...props}
		/>
	);
};
