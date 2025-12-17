import { Container, type uiContainer } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { tMessageText } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace MessageText {
	export interface Props extends Container.Props {
		message: tMessageText;
	}
}

export const MessageText: FC<MessageText.Props> = ({ message, ...props }) => {
	return (
		<Container
			ui={{
				justify: match<typeof message.direction, uiContainer.Ui["justify"]>(
					message.direction,
				)
					.with("incoming", () => "start")
					.with("outgoing", () => "end")
					.with("system", () => "center")
					.exhaustive(),
			}}
			{...props}
		>
			<Tx label={message.text} />
		</Container>
	);
};
