import { Status, Tx, type useSelection } from "@use-pico/client";
import type { Category } from "@zbav-se.me/sdk";
import { type FC, useRef } from "react";
import { useAnimation } from "~/app/listing/ui/CreateListing/CategoryGroup/Item/useAnimation";
import { useInitAnim } from "~/app/listing/ui/CreateListing/CategoryGroup/Item/useInitAnim";
import { Sheet } from "~/app/sheet/Sheet";
import { CategoryIcon } from "~/app/ui/icon/CategoryIcon";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";

export namespace CategoryItem {
	export interface Props {
		selection: useSelection.Selection<Category>;
		item: Category;
	}
}

export const CategoryItem: FC<CategoryItem.Props> = ({ selection, item }) => {
	const selectedRef = useRef<HTMLDivElement>(null);
	const unselectedRef = useRef<HTMLDivElement>(null);
	const isSelected = selection.isSelected(item.id);

	const offset = "70%";
	const scale = 0.975;

	useInitAnim({
		isSelected,
		offset,
		selectedRef,
		unselectedRef,
	});

	useAnimation({
		isSelected,
		offset,
		scale,
		selectedRef,
		unselectedRef,
	});

	return (
		<div className="relative">
			<Sheet
				ref={selectedRef}
				tone={"secondary"}
				theme={"light"}
				onClick={() => {
					selection.toggle(item);
				}}
				tweak={{
					slot: {
						root: {
							class: [
								"absolute",
								"inset-0",
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
					textMessage={
						"Sem prijdou chipsy posledne nabidnutych inzeratu"
					}
				/>
			</Sheet>

			<Sheet
				ref={unselectedRef}
				tone={"primary"}
				theme={"light"}
				onClick={() => {
					selection.toggle(item);
				}}
				tweak={{
					slot: {
						root: {
							class: [
								"absolute",
								"inset-0",
							],
						},
					},
				}}
			>
				<Status
					icon={CategoryIcon}
					tone={"primary"}
					theme={"light"}
					textTitle={
						<Tx
							label={`Category ${item.name}`}
							tone={"primary"}
							theme={"light"}
							font={"bold"}
						/>
					}
					textMessage={
						"Sem prijdou chipsy posledne nabidnutych inzeratu"
					}
				/>
			</Sheet>
		</div>
	);
};
