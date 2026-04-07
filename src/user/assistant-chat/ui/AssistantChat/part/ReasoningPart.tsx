import type { ReasoningUIPart, UIMessage } from "ai";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Tx } from "@/lib/client/tx";

export namespace ReasoningPart {
	export interface Props extends Omit<Container.Props, "part"> {
		message: UIMessage;
		part: ReasoningUIPart;
	}
}

export const ReasoningPart: FC<ReasoningPart.Props> = ({ message, part, ui, ...props }) => {
	const isStreaming = part.state === "streaming";

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

			{isStreaming ? <SpinnerContainer type="icon" /> : null}
		</Container>
	);
};
