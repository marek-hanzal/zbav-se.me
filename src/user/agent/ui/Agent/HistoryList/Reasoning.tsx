import type { AgentInputItem } from "@openai/agents-core";
import type { FC } from "react";
import { Group } from "@/lib/client/group";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";

export namespace Reasoning {
	export interface Props extends Group.Props {
		item: AgentInputItem;
	}
}

export const Reasoning: FC<Reasoning.Props> = ({ item, ...props }) => {
	return (
		<Group
			data-ui={"Reasoning"}
			data-id={item.id}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-background="default"
			data-ui-inner="default"
			data-ui-opacity="6"
			{...props}
		>
			<Tx
				label={translator.text("Agent reasoning history (label)")}
				data-ui-text="sm"
				data-ui-font="bold"
				className={[
					"wrap-break-word",
				]}
			/>
		</Group>
	);
};
