import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Icon, SpinnerIcon } from "@/lib/client/icon";

export namespace AgentPendingAssistantItem {
	export interface Props extends Container.Props {
		text?: string;
	}
}

export const AgentPendingAssistantItem: FC<AgentPendingAssistantItem.Props> = ({
	text,
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
					gap: "sm",
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

				{text ? (
					<div className={"text-sm opacity-70"}>
						{text}
					</div>
				) : null}
			</Container>
		</Container>
	);
};
