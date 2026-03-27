import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { EntitySchema } from "@use-pico/common/schema";
import type { FC } from "react";
import type { useSelection } from "@/lib/client/selection";
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
				ui: {
					flow: "vertical",
					items: "start",
					gap: "xs",
				},
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
				ui={{
					text: "sm",
					color: "icon",
				}}
			/>
		</Button>
	);
};
