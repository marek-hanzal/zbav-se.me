import type { FC } from "react";
import { uiSelectButtonFn } from "~/application-ui/fn/ui.exports";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import type { useSelection } from "~/selection/hook/useSelection";
import { Tx } from "~/translation/ui/Tx";
import { Button } from "~/ui/ui/Button";

export namespace Item {
	export interface Props {
		restriction: string;
		selection: useSelection.Use<EntitySchema.Type>;
		allowClear?: boolean;
	}
}

export const Item: FC<Item.Props> = ({ restriction, allowClear, selection }) => {
	const item = {
		id: restriction,
	};
	const isSelected = selection.isSelectedFn(restriction);

	return (
		<Button
			onClick={() => {
				if (allowClear) {
					selection.toggleFn(item);
					return;
				}
				selection.singleFn(item);
			}}
			{...uiSelectButtonFn({
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
