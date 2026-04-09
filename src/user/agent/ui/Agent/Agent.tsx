import { type FC, useCallback, useMemo, useRef } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { EmptyState } from "@/lib/client/empty-state";
import { AiIcon } from "@/lib/client/icon";
import { Status } from "@/lib/client/status";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { ChatInput } from "~/common/ui/chat";
import { CancelIcon } from "~/common/ui/icon";
import { useAgent } from "~/user/agent/hook/useAgent";
import { StreamEventBus } from "~/user/agent/StreamEventBus";
import { withEventStream } from "~/user/agent/service/withEventStream";
import { AgentMessageList } from "./AgentMessageList";

export namespace Agent {
	export interface Props extends Container.Props, MarkSuspense.Props {
		//
	}
}

export const Agent: FC<Agent.Props> = ({ ui, ...props }) => {
	const eventBus = useMemo(() => {
		const eventBus = StreamEventBus();

		eventBus.on("response:start", ({ event }) => {
			console.log("\t\t - [response:start]", event);
		});
		// eventBus.on("onDone", ({ event }) => {
		// 	console.log("\t\t - [Event] onDone", event);
		// });
		// //
		// eventBus.on("onTextDelta", ({ text, event }) => {
		// 	console.log("\t\t - [Event] onTextDelta", text, event);
		// });
		//
		eventBus.on("unhandled:agent-update-stream-event", ({ event }) => {
			console.log("[Unhandled Agent Update Stream Event]", event);
		});
		eventBus.on("unhandled:raw-model-stream-event", ({ event }) => {
			console.log("[Unhandled Raw Model Stream Event]", event);
		});
		eventBus.on("unhandled:run-item-stream-event", ({ event }) => {
			console.log("[Unhandled Run Item Stream Event]", event);
		});

		return eventBus;
	}, []);
	const chat = useAgent({
		_suspense: "I know",
		onStream: withEventStream({
			eventBus,
		}),
	});
	const containerRef = useRef<HTMLDivElement | null>(null);

	const submit = useCallback(
		(value: string) => {
			if (chat.mutation.isPending) {
				return;
			}

			void chat.mutation.mutateAsync({
				text: value,
			});
		},
		[
			chat.mutation,
		],
	);

	const isBusy = chat.mutation.isPending;

	return (
		<Container
			data-ui={"Agent"}
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
									return true;
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
												textTitle={translator.text("Agent welcome (title)")}
												textMessage={translator.text(
													"Agent welcome (message)",
												)}
											/>
										</Container>
									);
								},
							},
						]}
					>
						<AgentMessageList
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
						placeholder={translator.text("Write to an agent")}
						loading={isBusy}
						left={
							isBusy ? (
								<Button
									data-action={"stop agent stream"}
									iconEnabled={CancelIcon}
									onClick={chat.cancel}
									ui={{
										tone: "danger",
										theme: "light",
										square: "default",
										background: undefined,
										border: false,
										shadow: false,
										color: "lead",
									}}
								/>
							) : null
						}
						ui={{
							disabled: isBusy,
						}}
					/>
				</Container>
			</Container>
		</Container>
	);
};
