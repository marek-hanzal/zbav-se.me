import type { useSelection } from "@use-pico/client/hook";
import { Button } from "@use-pico/client/ui/button";
import { Typo } from "@use-pico/client/ui/typo";
import { tvc } from "@use-pico/cls";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tCategory } from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";

export namespace CategoryItem {
	export interface Props {
		selection: useSelection.Selection<EntitySchema.Type>;
		item: tCategory;
	}
}

export const CategoryItem: FC<CategoryItem.Props> = ({ selection, item }) => {
	const isSelected = selection.isSelected(item.id);

	return (
		<Button
			ui="CategoryItem-root"
			data-id={item.id}
			tone={"primary"}
			theme={isSelected ? "dark" : "light"}
			onClick={() => {
				selection.toggle(item);
			}}
			full
			size={"xl"}
			className={tvc([
				"justify-center",
				"items-start",
				"text-left",
				"flex",
				"flex-col",
				"gap-1",
				"w-full",
			])}
		>
			<Typo
				label={item.group}
				size={"sm"}
			/>

			<Typo
				label={item.category}
				size={"lg"}
				font={"bold"}
			/>
		</Button>
	);
};
