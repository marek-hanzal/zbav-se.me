import type { FC } from "react";
import { Button } from "@/lib/client/button";
import type { useSelection } from "@/lib/client/selection";
import { Tx } from "@/lib/client/tx";
import type { EntitySchema } from "@/lib/common/schema";
import { uiSelectButton } from "~/common/ui/ui";

export namespace Item {
	export interface Props {
		restriction: string;
		selection: useSelection.Selection<EntitySchema.Type>;
	}
}

export const Item: FC<Item.Props> = ({ restriction, selection }) => {
	const item = {
		id: restriction,
	};
	const isSelected = selection.isSelected(restriction);

	return (
		<Button
			onClick={() => {
				selection.toggle(item);
			}}
			{...uiSelectButton({
				isSelected,
				"data-ui-flow": "vertical",
				"data-ui-items": "start",
				"data-ui-gap": "xs",
				className: [
					"text-left",
					"shrink-0",
				],
			})}
			data-ui={`RestrictionSelect-[Button.${restriction}]`}
		>
			<Tx label={`Listing restriction - ${restriction}`} />

			<Tx
				label={`Listing restriction - ${restriction} (hint)`}
				data-ui-text="sm"
				data-ui-color="icon"
			/>
		</Button>
	);
};
