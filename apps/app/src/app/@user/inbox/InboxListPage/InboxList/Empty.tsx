import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";

export namespace Empty {
	export interface Props extends Container.Props {
		textMessage: string;
	}
}

export const Empty: FC<Empty.Props> = ({ textMessage, ...props }) => {
	return (
		<Container
			data-ui="InboxList[Empty]"
			ui={{
				layout: "vertical-centered",
				height: "full",
			}}
			{...props}
		>
			<Tx label={textMessage} />
		</Container>
	);
};
