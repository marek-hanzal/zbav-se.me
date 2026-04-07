import type { FC, RefObject } from "react";
import { Container } from "@/lib/client/container";
import type { useAssistantChat } from "~/user/assistant-chat/ui/AssistantChat/useAssistantChat";

export namespace MessageList {
	export interface Props extends Container.Props {
		containerRef: RefObject<HTMLDivElement | null>;
		chat: useAssistantChat.UseResult;
	}
}

export const MessageList: FC<MessageList.Props> = ({ containerRef, chat, ...props }) => {
	// useAutoScroll({
	// 	containerRef,
	// 	contentRef,
	// });
	const isBusy = chat.status === "submitted" || chat.status === "streaming";

	return <Container {...props}></Container>;
};
