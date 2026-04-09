import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Icon, SpinnerIcon } from "@/lib/client/icon";

export namespace AgentPendingAssistantItem {
	export interface Props extends Container.Props {
		//
	}
}

export const AgentPendingAssistantItem: FC<AgentPendingAssistantItem.Props> = ({
	ui,
	...props
}) => {
	return (
		<Container
			data-ui={"AgentPendingAssistantItem"}
			ui={{
				flow: "horizontal",
				justify: "start",
				...ui,
			}}
			{...props}
		>
			<Container
				data-ui={"AgentPendingAssistantItem[Card]"}
				ui={{
					background: "alt",
					border: true,
					round: "default",
					inner: "default",
					flow: "horizontal",
					items: "center",
					justify: "center",
				}}
			>
				<Icon
					icon={SpinnerIcon}
					ui={{
						text: "xl",
						color: "lead",
						opacity: "6",
					}}
				/>
			</Container>
		</Container>
	);
};
