import type { TextUIPart } from "ai";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Markdown } from "@/lib/client/markdown";
import { translator } from "@/lib/common/translator";
import type { MessageUi } from "~/user/assistant/MessageUi";

export namespace TextPart {
	export interface Props extends Omit<Container.Props, "part"> {
		message: MessageUi;
		part: TextUIPart;
	}
}

export const TextPart: FC<TextPart.Props> = ({ message, part, ui, className, ...props }) => {
	const isAssistant = message.role === "assistant";
	const isUser = message.role === "user";

	if (part.text.length === 0) {
		return (
			<Container
				ui={{
					inner: "default",
					text: "sm",
					opacity: "2",
					...ui,
				}}
				className={[
					"max-w-[min(42rem,100%)]",
					className,
				]}
				{...props}
			>
				{isAssistant
					? translator.text("Assistant is thinking...")
					: translator.text("We're waiting for a message")}
			</Container>
		);
	}

	return (
		<Container
			ui={{
				inner: "default",
				...(isUser
					? {
							tone: "brand",
							theme: "light",
							background: "default",
							shadow: true,
							border: true,
							round: "default",
						}
					: {}),
				...(isAssistant ? {} : {}),
				...ui,
			}}
			className={[
				"flex",
				isAssistant ? "justify-start" : undefined,
				isUser ? "justify-end" : undefined,
				className,
			]}
			{...props}
		>
			<Container
				ui={{
					width: "content",
				}}
				className={[
					"max-w-[min(42rem,100%)]",
				]}
			>
				<Markdown>{part.text}</Markdown>
			</Container>
		</Container>
	);
};
