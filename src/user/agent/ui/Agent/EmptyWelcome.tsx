import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Status } from "@/lib/client/status";
import type { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { AgentStreamItemsQuery } from "../../query/AgentStreamItemsQuery";
import { withAgentStreamItemsQuery } from "../../query/withAgentStreamItemsQuery";

const TitleUi: Tx.PropsEx = {
	"data-ui-tone": "neutral",
	"data-ui-theme": "light",
	"data-ui-color": "lead",
	"data-ui-text": "sm",
};

const PromptUi: Container.Props = {
	"data-ui-tone": "neutral",
	"data-ui-theme": "light",
	"data-ui-background": "default",
	"data-ui-round": "default",
	"data-ui-text": "sm",
	"data-ui-inner": "lg",
	"data-ui-font": "normal",
};

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
