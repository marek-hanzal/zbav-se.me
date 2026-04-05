import { useChat } from "@ai-sdk/react";
import { useRouter } from "@tanstack/react-router";
import { DefaultChatTransport, type UIMessage } from "ai";
import { type FC, useEffect, useRef } from "react";
import { Container } from "@/lib/client/container";
import { translator } from "@/lib/common/translator";
import { ChatInput } from "~/common/ui/chat";
import { withAssistantChatQuery } from "~/user/assistant-chat/query/withAssistantChatQuery";
import { Empty } from "./Empty/Empty";
import { Message } from "./Message/Message";

export namespace AssistantChat {
	export interface Props extends Container.Props {
		//
	}
}

export const AssistantChat: FC<AssistantChat.Props> = ({ ui, ...props }) => {
	const { buildLocation } = useRouter();
	const assistantQuery = withAssistantChatQuery.useCollectionQuery({
		sort: [
			{
				field: "createdAt",
				order: "desc",
			},
		],
	});

	const { messages, sendMessage, status, error } = useChat({
		transport: new DefaultChatTransport({
			api: buildLocation({
				to: "/api/assistant",
			}).href,
		}),
		messages: assistantQuery.data.map((item) => {
			return item.payload as UIMessage;
		}),
	});

	const scrollerRef = useRef<HTMLDivElement | null>(null);
	const messageCount = messages.length;

	useEffect(() => {
		const el = scrollerRef.current;
		if (!el) {
			return;
		}

		el.scrollTop = messageCount === 0 ? 0 : el.scrollHeight;
	}, [
		messageCount,
	]);

	const isBusy = status === "submitted" || status === "streaming";

	const submit = (value: string) => {
		void sendMessage({
			text: value,
		});
	};

	return (
		<Container
			data-ui={"ChatPage"}
			ui={{
				layout: "vertical-flex",
				height: "full",
				width: "full",
				...ui,
			}}
			className={[
				"bg-[linear-gradient(180deg,rgba(15,23,42,0.05)_0%,rgba(148,163,184,0.18)_100%)]",
				"overflow-hidden",
			]}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-flex",
					height: "full",
					round: "xl",
					background: "default",
					shadow: true,
					border: true,
					theme: "light",
					tone: "neutral",
				}}
				className={[
					"min-h-0",
					"overflow-hidden",
				]}
			>
				<Container
					ref={scrollerRef}
					ui={{
						layout: "vertical-flex",
						gap: "default",
						scroll: "vertical",
						height: "full",
					}}
					className={[
						"min-h-0",
						"flex-1",
						"px-2",
						"py-2",
					]}
				>
					<Empty
						check={messages.length === 0}
						onSubmit={submit}
						isBusy={isBusy}
						error={error}
					>
						<Message
							messages={messages}
							isBusy={isBusy}
						/>
					</Empty>
				</Container>

				{messages.length > 0 ? (
					<div className="border-t border-slate-200/80 bg-slate-50 px-2 py-2">
						<ChatInput
							onSubmit={submit}
							placeholder={translator.text("Write to a assistant")}
							loading={isBusy}
						/>
					</div>
				) : null}
			</Container>
		</Container>
	);
};
