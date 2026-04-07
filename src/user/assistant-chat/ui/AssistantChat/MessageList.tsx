import { type FC, type RefObject, useRef } from "react";
import { useAutoScroll } from "@/lib/client/auto-scroll";
import { Container } from "@/lib/client/container";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Message } from "./Message";
import type { useAssistantChat } from "./useAssistantChat";

export namespace MessageList {
	export interface Props extends Container.Props {
		containerRef: RefObject<HTMLDivElement | null>;
		chat: useAssistantChat.UseResult;
	}
}

export const MessageList: FC<MessageList.Props> = ({ containerRef, chat, ...props }) => {
	const contentRef = useRef<HTMLDivElement | null>(null);
	useAutoScroll({
		containerRef,
		contentRef,
	});

	const isBusy = chat.status === "submitted" || chat.status === "streaming";

	return (
		<Container
			ref={contentRef}
			{...props}
		>
			{chat.messages.map((message) => {
				return (
					<Message
						key={message.id}
						message={message}
					/>
				);
			})}

			{isBusy ? <SpinnerContainer /> : null}
		</Container>
	);
};
