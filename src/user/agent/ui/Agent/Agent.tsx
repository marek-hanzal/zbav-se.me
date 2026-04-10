import { type FC, useCallback, useRef } from "react";
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
import { withAgentStreamItemsQuery } from "~/user/agent/query/withAgentStreamItemsQuery";
import { AgentMessageList } from "./AgentMessageList";

export namespace Agent {
	export interface Props extends Container.Props, MarkSuspense.Props {
		//
	}
}

export const Agent: FC<Agent.Props> = ({ ui, ...props }) => {
	const chat = useAgent({
		_suspense: "I know",
	});
	/**
	 * Just for checking empty component state
	 */
	const { data: items } = withAgentStreamItemsQuery.useSuspenseQuery({
		cursor: {
			page: 0,
			size: 1,
		},
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
				<EmptyState
					check={[
						{
							check() {
								return !items.length;
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
											textMessage={translator.text("Agent welcome (message)")}
										/>
									</Container>
								);
							},
						},
					]}
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
						<AgentMessageList containerRef={containerRef} />
					</Container>
				</EmptyState>

				<Container
					ui={{
						layout: "vertical-flex",
						width: "full",
						inner: "default",
					}}
				>
					<ChatInput
						onSubmit={submit}
						placeholder={translator.text("Write to an agent")}
						loading={isBusy}
						cancel={
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
