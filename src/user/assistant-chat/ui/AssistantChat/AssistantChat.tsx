import { type FC, useCallback, useRef } from "react";
import { Container } from "@/lib/client/container";
import { EmptyState } from "@/lib/client/empty-state";
import { AiIcon } from "@/lib/client/icon";
import { Status } from "@/lib/client/status";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { ChatInput } from "~/common/ui/chat";
import { MessageList } from "~/user/assistant-chat/ui/AssistantChat/MessageList";
import { useAssistantChat } from "~/user/assistant-chat/ui/AssistantChat/useAssistantChat";

export namespace AssistantChat {
	export interface Props extends Container.Props, MarkSuspense.Props {
		//
	}
}

export const AssistantChat: FC<AssistantChat.Props> = ({ ui, ...props }) => {
	const chat = useAssistantChat();
	const containerRef = useRef<HTMLDivElement | null>(null);

	const submit = useCallback(
		(value: string) => {
			void chat.sendMessage({
				text: value,
			});
		},
		[
			chat.sendMessage,
		],
	);

	const isBusy = chat.status === "submitted" || chat.status === "streaming";

	return (
		<Container
			data-ui={"AssistantChat"}
			ui={{
				height: "full",
				width: "full",
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					gap: "xs",
				}}
			>
				<Container
					ref={containerRef}
					ui={{
						layout: "vertical-flex",
						gap: "default",
						scroll: "vertical",
						height: "full",
					}}
				>
					<EmptyState
						check={[
							{
								check() {
									return !chat.messages.length;
								},
								render() {
									return (
										<Container
											ui={{
												tone: "brand",
												theme: "light",
												layout: "vertical-centered",
												height: "full",
												width: "full",
												inner: "4xl",
											}}
											className={[
												"text-center",
											]}
										>
											<Status
												icon={AiIcon}
												textTitle={translator.text(
													"Assistant welcome (title)",
												)}
												textMessage={translator.text(
													"Assistant welcome (message)",
												)}
											/>
										</Container>
									);
								},
							},
						]}
					>
						<MessageList
							containerRef={containerRef}
							chat={chat}
						/>
					</EmptyState>
				</Container>

				<Container
					ui={{
						layout: "vertical-flex",
						width: "full",
						inner: "default",
						...ui,
					}}
					{...props}
				>
					<ChatInput
						onSubmit={submit}
						placeholder={translator.text("Write to a assistant")}
						loading={isBusy}
					/>
				</Container>
			</Container>
		</Container>
	);
};
