import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Status } from "@/lib/client/status";
import { translator } from "@/lib/common/translation";
import { AgentStreamItemsQuery } from "../../query/AgentStreamItemsQuery";
import { withAgentStreamItemsQuery } from "../../query/withAgentStreamItemsQuery";

export namespace EmptyWelcome {
	export interface Props extends Container.Props {
		threadId: string;
		isPending: boolean;
	}
}

export const EmptyWelcome: FC<EmptyWelcome.Props> = ({ threadId, isPending, ...props }) => {
	const { data: items } = withAgentStreamItemsQuery.useSuspenseQuery(
		AgentStreamItemsQuery(threadId),
	);

	if (items.length || isPending) {
		return null;
	}

	return (
		<Container
			data-ui={"EmptyWelcome"}
			data-ui-flow={"vertical"}
			data-ui-gap={"default"}
			data-ui-inner={"2xl"}
			{...props}
		>
			<Status
				data-ui-tone={"brand"}
				data-ui-theme={"light"}
				icon={"icon-[solar--emoji-funny-square-linear]"}
				textTitle={translator.text("Agent empty welcome (title)")}
				textMessage={translator.text("Agent empty welcome (content)")}
			/>
		</Container>
	);
};
