import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Tx } from "@/lib/client/tx";
import type { MessageUi } from "~/user/assistant/MessageUi";

export namespace ReasoningPart {
	export interface Props extends Omit<Container.Props, "part"> {
		message: MessageUi;
		part: any;
	}
}

export const ReasoningPart: FC<ReasoningPart.Props> = ({ message, part, ui, ...props }) => {
	return (
		<Container
			ui={{
				text: "sm",
				inner: "default",
				opacity: "6",
				...ui,
			}}
			{...props}
		>
			<Tx label={part.text} />
		</Container>
	);
};
