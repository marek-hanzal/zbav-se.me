import type { TextUIPart, UIMessage } from "ai";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Markdown } from "@/lib/client/markdown";
import { translator } from "@/lib/common/translator";

export namespace TextPart {
	export interface Props extends Omit<Container.Props, "part"> {
		message: UIMessage;
		part: TextUIPart;
	}
}

export const TextPart: FC<TextPart.Props> = ({ message, part, ui, ...props }) => {
	const isAssistant = message.role === "assistant";

	if (part.text.length === 0) {
		return (
			<Container
				ui={{
					text: "sm",
					opacity: "2",
					...ui,
				}}
				{...props}
			>
				{isAssistant
					? translator.text("Assistant is thinking...")
					: translator.text("We're waiting for a message")}
			</Container>
		);
	}

	return <Markdown>{part.text}</Markdown>;
};
