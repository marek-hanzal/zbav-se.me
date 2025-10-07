import { CheckIcon, Status, Tx } from "@use-pico/client";
import type { FC } from "react";
import type { CategorySchema } from "~/app/category/db/CategorySchema";
import { Sheet } from "~/app/sheet/Sheet";

export namespace CategoryItem {
	export interface Props {
		item: CategorySchema.Type;
	}
}

export const CategoryItem: FC<CategoryItem.Props> = ({ item }) => {
	return (
		<Sheet
			// ref={selectedRef}
			tone={"secondary"}
			theme={"light"}
			onClick={() => {
				// selection.toggle(item);
			}}
			tweak={{
				slot: {
					root: {
						class: [
							// "absolute",
							// "inset-0",
						],
					},
				},
			}}
		>
			<Status
				icon={CheckIcon}
				tone={"secondary"}
				theme={"light"}
				textTitle={
					<Tx
						label={`Category ${item.name}`}
						tone={"secondary"}
						theme={"light"}
						font={"bold"}
					/>
				}
				textMessage={"Sem prijdou chipsy posledne nabidnutych inzeratu"}
			/>
		</Sheet>
	);
};
