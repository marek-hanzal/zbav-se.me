import type { FC } from "react";
import { match } from "ts-pattern";
import type { MessageUi } from "~/user/assistant/MessageUi";
import { Part } from "./Part/Part";

export namespace Message {
	export interface Props {
		messages: MessageUi[];
		isBusy: boolean;
	}
}

export const Message: FC<Message.Props> = ({ messages }) => {
	return (
		<>
			{messages.map((message) => {
				const isAssistant = message.role === "assistant";
				const messageId = message.id;

				return (
					<li
						key={messageId}
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
								isAssistant ? "bg-white" : "bg-slate-900 text-white",
							].join(" ")}
						>
							{message.parts?.map((part, partIndex) => {
								const partKey = `${messageId}-${partIndex}`;
								const partType = (
									part as {
										type: string;
									}
								).type;

								return (
									<div key={partKey}>
										{match(partType)
											.with("text", () => {
												const p = part as {
													text: string;
												};
												return (
													<Part.Text
														text={p.text}
														isAssistant={isAssistant}
													/>
												);
											})
											.with("reasoning", () => {
												const p = part as {
													text: string;
													state?: string;
												};
												return (
													<Part.Reasoning
														text={p.text}
														state={p.state}
													/>
												);
											})
											.with("tool-call", () => {
												const p = part as {
													toolCallId: string;
													state?: string;
												};
												return (
													<Part.Tool
														toolCallId={p.toolCallId}
														state={p.state}
													/>
												);
											})
											.otherwise(() => {
												return null;
											})}
									</div>
								);
							})}
						</div>
					</li>
				);
			})}
		</>
	);
};
