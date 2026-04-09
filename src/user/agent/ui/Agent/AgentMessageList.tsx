import { type FC, type RefObject, useRef } from "react";
import { useAutoScroll } from "@/lib/client/auto-scroll";
import { Container } from "@/lib/client/container";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { useAgent } from "~/user/agent/hook/useAgent";
import { AgentHistoryItem } from "./AgentHistoryItem";
import { AgentRun } from "./AgentRun";

export namespace AgentMessageList {
	export interface Props extends Container.Props {
		containerRef: RefObject<HTMLDivElement | null>;
		chat: useAgent.UseResult;
	}
}

export const AgentMessageList: FC<AgentMessageList.Props> = ({
	containerRef,
	chat,
	ui,
	...props
}) => {
	const contentRef = useRef<HTMLDivElement | null>(null);
	useAutoScroll({
		containerRef,
		contentRef,
	});

	const isBusy = chat.mutation.isPending;

	return (
		<Container
			ref={contentRef}
			ui={{
				flow: "vertical",
				inner: "default",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			{chat.historyItems.map((item, index) => {
				return (
					<AgentHistoryItem
						key={`history-${item.id ?? index}`}
						item={item}
					/>
				);
			})}

			{chat.runs.map((run) => {
				return (
					<AgentRun
						key={run.id}
						run={run}
					/>
				);
			})}

			{isBusy ? (
				<SpinnerContainer
					type={"icon"}
					iconProps={{
						ui: {
							text: "md",
						},
					}}
				/>
			) : null}
		</Container>
	);
};
