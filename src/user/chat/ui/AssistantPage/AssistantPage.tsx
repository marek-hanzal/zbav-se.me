import { useChat } from "@ai-sdk/react";
import { useRouter } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import { type FC, useEffect, useRef } from "react";
import { Container } from "@/lib/client/container";
import { Markdown } from "@/lib/client/markdown";
import { SpinnerContainer } from "@/lib/client/spinner";
import { ChatInput } from "~/common/ui/chat";
import { getTextFromMessage } from "~/public/assistant/service/getTextFromMessage";

export namespace AssistantPage {
	export interface Props extends Container.Props {
		//
	}
}

export const AssistantPage: FC<AssistantPage.Props> = ({ ui, ...props }) => {
	const { buildLocation } = useRouter();

	const { messages, sendMessage, status, error } = useChat({
		transport: new DefaultChatTransport({
			api: buildLocation({
				to: "/api/assistant",
			}).href,
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
						"px-4",
						"py-4",
						"md:px-6",
						"md:py-6",
					]}
				>
					{messages.length === 0 ? (
						<div className="grid h-full place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
							<div className="max-w-md space-y-3">
								<p className="text-lg font-medium text-slate-900">
									Start the first message.
								</p>
								<p className="text-sm leading-6 text-slate-600">
									Try a prompt about the product, a bug, or an API idea. The
									gateway is configured through `ServerAiSchema`.
								</p>
							</div>
						</div>
					) : (
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
													? "bg-white text-slate-900 ring-1 ring-slate-200"
													: "bg-slate-900 text-white",
											].join(" ")}
										>
											<p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] opacity-70">
												{isAssistant ? "Assistant" : "You"}
											</p>

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
						</ol>
					)}

					{error ? (
						<div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
							{error.message}
						</div>
					) : null}
				</Container>

				<div className="border-t border-slate-200/80 bg-slate-50 px-4 py-4 md:px-6">
					<ChatInput
						onSubmit={(value) => {
							void sendMessage({
								text: value,
							});
						}}
						placeholder={"Write a message. Ctrl+Enter sends it."}
						loading={isBusy}
					/>
				</div>
			</Container>
		</Container>
	);
};
