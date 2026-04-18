import { type FC, useRef } from "react";
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
import { AgentStreamItemsQuery } from "~/user/agent/query/AgentStreamItemsQuery";
import { withAgentStreamItemsQuery } from "~/user/agent/query/withAgentStreamItemsQuery";
import { AgentMessageList } from "./AgentMessageList";

export namespace Agent {
	export interface Props extends Container.Props, MarkSuspense.Props {
		//
	}
}

export const Agent: FC<Agent.Props> = ({ ...props }) => {
	const chat = useAgent({
		_suspense: "I know",
	});
	const { data: items } = withAgentStreamItemsQuery.useSuspenseQuery(AgentStreamItemsQuery);
	const containerRef = useRef<HTMLDivElement | null>(null);

	return (
		<Container
			data-ui={"Agent"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				width: "full",
				gap: "xs",
				...ui,
			}}
			{...props}
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
					<AgentMessageList
						containerRef={containerRef}
						isPending={chat.mutation.isPending}
					/>
				</Container>
			</EmptyState>

			<ChatInput
				ui={{
					width: "full",
					inner: "default",
				}}
				onSubmit={chat.submit}
				placeholder={translator.text("Write to an agent")}
				loading={chat.mutation.isPending}
				cancel={
					<Button
						data-action={"stop agent stream"}
						iconEnabled={CancelIcon}
						onClick={chat.cancel}
						iconProps={{
							ui: {
								text: "xl",
							},
						}}
						ui={{
							justify: "center",
							items: "center",
							tone: "brand",
							theme: "light",
							square: "default",
							background: undefined,
							border: false,
							shadow: false,
							color: "lead",
						}}
					/>
				}
			/>
		</Container>
	);
};
