import type { useSelection } from "@use-pico/client/hook";
import { Button } from "@use-pico/client/ui/button";
import { Typo } from "@use-pico/client/ui/typo";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tCategory } from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";

export namespace CategoryItem {
	export interface Props extends Button.Props {
		selection: useSelection.Selection<EntitySchema.Type>;
		item: tCategory;
	}
}

export const CategoryItem: FC<CategoryItem.Props> = ({ selection, item, ui, ...props }) => {
	const isSelected = selection.isSelected(item.id);

	return (
		<Button
			data-ui="CategoryItem[Button]"
			data-id={item.id}
			onClick={() => {
				selection.toggle(item);
			}}
			ui={{
				tone: isSelected ? "secondary" : "neutral",
				theme: "light",
				flow: "vertical",
				items: "start",
				justify: "center",
				size: "default",
				width: "full",
				...ui,
			}}
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
