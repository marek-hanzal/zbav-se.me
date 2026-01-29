import type { useSelection } from "@use-pico/client/hook";
import { Button } from "@use-pico/client/ui/button";
import { Typo } from "@use-pico/client/ui/typo";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tCategory } from "@zbav-se.me/sdk/api/session";
import { uiSelectButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace CategoryItem {
	export interface Props extends Button.Props {
		selection: useSelection.Selection<EntitySchema.Type>;
		item: tCategory;
	}
}

export const CategoryItem: FC<CategoryItem.Props> = ({
	selection,
	item,
	ui,
	className,
	...props
}) => {
	const isSelected = selection.isSelected(item.id);

	return (
		<Button
			data-id={item.id}
			onClick={() => {
				selection.toggle(item);
			}}
			{...uiSelectButton({
				isSelected,
				ui,
				className,
			})}
			data-ui="CategoryItem[Button]"
			{...props}
		>
			<Typo
				label={item.group}
				ui={{
					text: "sm",
				}}
			/>

			<Typo
				label={item.category}
				ui={{
					text: "lg",
					font: isSelected ? "bold" : "normal",
				}}
			/>
		</Button>
	);
};
