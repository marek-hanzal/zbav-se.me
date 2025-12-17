import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { tMessageText } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace MessageText {
	export interface Props extends Container.Props {
		message: tMessageText;
	}
}

export const MessageText: FC<MessageText.Props> = ({ message, ...props }) => {
	return (
		<Container {...props}>
			<Tx label={message.text} />
		</Container>
	);
};
