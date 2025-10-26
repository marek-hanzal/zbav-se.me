import { Button, type useSelection } from "@use-pico/client";
import type { EntitySchema } from "@use-pico/common";
import type { CategoryGroup } from "@zbav-se.me/sdk";
import type { FC } from "react";

export namespace CategoryGroupItem {
	export interface Props {
		selection: useSelection.Selection<EntitySchema.Type>;
		item: CategoryGroup;
	}
}

export const CategoryGroupItem: FC<CategoryGroupItem.Props> = ({
	selection,
	item,
}) => {
	const isSelected = selection.isSelected(item.id);

	return (
		<Button
			tone={"primary"}
			theme={isSelected ? "dark" : "light"}
			onClick={() => {
				selection.toggle(item);
			}}
			full
			size={"xl"}
			tweak={{
				slot: {
					wrapper: {
						class: [
							`CategoryGroupItem-${item.id}`,
						],
					},
				},
			}}
		>
			{item.name}
		</Button>
	);
};
