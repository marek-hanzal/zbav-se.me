import { Tx, type useSelection } from "@use-pico/client";
import { Status } from "node_modules/@use-pico/client/src/status/Status";
import { type FC, useRef } from "react";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import { useAnimation } from "~/app/listing/ui/CreateListing/CategoryGroup/Item/useAnimation";
import { useInitAnim } from "~/app/listing/ui/CreateListing/CategoryGroup/Item/useInitAnim";
import { Sheet } from "~/app/sheet/Sheet";
import { CategoryGroupIcon } from "~/app/ui/icon/CategoryGroupIcon";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";

export namespace CategoryGroupItem {
	export interface Props {
		selection: useSelection.Selection<CategoryGroupSchema.Type>;
		item: CategoryGroupSchema.Type;
	}
}

export const CategoryGroupItem: FC<CategoryGroupItem.Props> = ({
	selection,
	item,
}) => {
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
							label={`Category group ${item.name}`}
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
					icon={CategoryGroupIcon}
					tone={"primary"}
					theme={"light"}
					textTitle={
						<Tx
							label={`Category group ${item.name}`}
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
