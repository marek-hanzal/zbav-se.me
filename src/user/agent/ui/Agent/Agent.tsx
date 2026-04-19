import { type FC, useRef } from "react";
import { Container } from "@/lib/client/container";
import { EmptyState } from "@/lib/client/empty-state";
import { AiIcon } from "@/lib/client/icon";
import { Status } from "@/lib/client/status";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { useAgent } from "~/user/agent/hook/useAgent";
import { AgentStreamItemsQuery } from "~/user/agent/query/AgentStreamItemsQuery";
import { withAgentStreamItemsQuery } from "~/user/agent/query/withAgentStreamItemsQuery";
import { AgentInput } from "./AgentInput";
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
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-gap="xs"
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
									data-ui-tone="brand"
									data-ui-theme="light"
									data-ui-layout="vertical-centered"
									data-ui-height="full"
									data-ui-width="full"
									data-ui-inner="4xl"
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
					data-ui-layout="vertical-flex"
					data-ui-gap="default"
					data-ui-scroll="vertical"
					data-ui-height="full"
				>
					<AgentMessageList
						containerRef={containerRef}
						isPending={chat.mutation.isPending}
					/>
				</Container>
			</EmptyState>

			<AgentInput chat={chat} />
		</Container>
	);
};
