import { type FC, useRef } from "react";
import { Container } from "@/lib/client/container";
import type { MarkSuspense } from "@/lib/client/type";
import { useAgent } from "~/user/agent/hook/useAgent";
import { AgentInput } from "./AgentInput";
import { AgentMessageList } from "./AgentMessageList";

export namespace Agent {
	export interface Props extends Container.Props, MarkSuspense.Props {
		threadId: string;
	}
}

export const Agent: FC<Agent.Props> = ({ threadId, ...props }) => {
	const chat = useAgent({
		_suspense: "I know",
		threadId,
	});
	const containerRef = useRef<HTMLDivElement | null>(null);

	return (
		<Container
			data-ui={"Agent"}
			data-ui-height="full"
			data-ui-width="full"
			{...props}
		>
			<Container
				ref={containerRef}
				data-ui-layout="vertical-flex"
				data-ui-gap="default"
				data-ui-scroll="vertical"
				data-ui-height="full"
				className={[
					"pb-42",
				]}
			>
				<AgentMessageList
					containerRef={containerRef}
					isPending={chat.mutation.isPending}
					threadId={threadId}
				/>
			</Container>

			<AgentInput chat={chat} />
		</Container>
	);
};
