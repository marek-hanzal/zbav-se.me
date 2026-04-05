import { useChat } from "@ai-sdk/react";
import { useRouter } from "@tanstack/react-router";
import { DefaultChatTransport, type UIMessage } from "ai";
import { type FC, useEffect, useRef } from "react";
import { Container } from "@/lib/client/container";
import { EmptyState } from "@/lib/client/empty-state";
import { AiIcon } from "@/lib/client/icon/AiIcon";
import { Markdown } from "@/lib/client/markdown";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Status } from "@/lib/client/status";
import { translator } from "@/lib/common/translator";
import { ChatInput } from "~/common/ui/chat";
import { getTextFromMessage } from "~/public/assistant/service/getTextFromMessage";
import { withAssistantChatQuery } from "~/user/assistant-chat/query/withAssistantChatQuery";

export namespace AssistantPage {
	export interface Props extends Container.Props {
		//
	}
}

export const AssistantPage: FC<AssistantPage.Props> = ({ ui, ...props }) => {
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
			/**
			 * This is a type-lie, but we do not process payload in any way,
			 * so it's somehow acceptable here.
			 */
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
					<EmptyState
						check={[
							{
								check() {
									return !messages.length;
								},
								render() {
									return (
										<Container
											ui={{
												layout: "vertical-centered",
												height: "full",
												width: "full",
											}}
										>
											<Status
												icon={AiIcon}
												textTitle={translator.text(
													"Assistant welcome (title)",
												)}
												textMessage={translator.text(
													"Assistant welcome (message)",
												)}
												action={
													<ChatInput
														onSubmit={(value) => {
															void sendMessage({
																text: value,
															});
														}}
														placeholder={translator.text(
															"Write to a assistant",
														)}
														loading={isBusy}
														ui={{
															width: "full",
														}}
													/>
												}
											/>
										</Container>
									);
								},
							},
						]}
					>
						<ol className="space-y-3">
							{messages.map((message) => {
								const text = getTextFromMessage(message);
								const isAssistant = message.role === "assistant";

								if (!text) {
									return null;
								}

								return (
									<li
										key={message.id}
										className={[
											"flex",
											isAssistant ? "justify-start" : "justify-end",
										].join(" ")}
									>
										<div
											className={[
												"max-w-[min(42rem,100%)]",
												"rounded-2xl",
												"px-4",
												"py-3",
												"shadow-sm",
												isAssistant
													? "bg-white"
													: "bg-slate-900 text-white",
											].join(" ")}
										>
											{text.length > 0 ? (
												isAssistant ? (
													<Markdown className="prose prose-sm max-w-none prose-slate">
														{text}
													</Markdown>
												) : (
													<p className="whitespace-pre-wrap text-sm leading-6">
														{text}
													</p>
												)
											) : (
												<p className="text-sm italic opacity-70">
													{isAssistant
														? "Thinking..."
														: "Message in progress"}
												</p>
											)}
										</div>
									</li>
								);
							})}

							{isBusy ? (
								<li className="flex justify-start">
									<SpinnerContainer />
								</li>
							) : null}

							{error ? (
								<div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
									{error.message}
								</div>
							) : null}
						</ol>
					</EmptyState>
				</Container>

				{messages.length > 0 ? (
					<div className="border-t border-slate-200/80 bg-slate-50 px-2 py-2">
						<ChatInput
							onSubmit={(value) => {
								void sendMessage({
									text: value,
								});
							}}
							placeholder={translator.text("Write to a assistant")}
							loading={isBusy}
						/>
					</div>
				) : null}
			</Container>
		</Container>
	);
};
