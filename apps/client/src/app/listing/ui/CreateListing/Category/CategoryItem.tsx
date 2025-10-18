import { Status, type useSelection } from "@use-pico/client";
import { type Cls, tvc } from "@use-pico/cls";
import type { Category } from "@zbav-se.me/sdk";
import type { SheetCls } from "node_modules/@use-pico/client/src/sheet/SheetCls";
import { type FC, useRef } from "react";
import { useAnimation } from "~/app/listing/ui/CreateListing/CategoryGroup/Item/useAnimation";
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

	useAnimation({
		isSelected,
		offset,
		scale,
		selectedRef,
		unselectedRef,
	});

	const sheetTweak: Cls.TweaksOf<SheetCls> = {
		slot: {
			root: {
				class: [
					"absolute",
					"inset-0",
					"px-2",
				],
			},
		},
	};

	return (
		<div
			className={tvc([
				"relative",
				`Category-item-${item.id}`,
			])}
		>
			<Sheet
				ref={selectedRef}
				tone={"primary"}
				theme={"dark"}
				onClick={() => {
					selection.toggle(item);
				}}
				tweak={sheetTweak}
				round={"md"}
			>
				<Status
					icon={CheckIcon}
					tone={"primary"}
					theme={"dark"}
					textTitle={item.name}
					titleProps={{
						size: "md",
					}}
				/>
			</Sheet>

			<Sheet
				ref={unselectedRef}
				tone={"primary"}
				theme={"light"}
				onClick={() => {
					selection.toggle(item);
				}}
				tweak={sheetTweak}
				round={"md"}
			>
				<Status
					icon={CategoryIcon}
					tone={"primary"}
					theme={"light"}
					textTitle={item.name}
					titleProps={{
						size: "md",
					}}
				/>
			</Sheet>
		</div>
	);
};
