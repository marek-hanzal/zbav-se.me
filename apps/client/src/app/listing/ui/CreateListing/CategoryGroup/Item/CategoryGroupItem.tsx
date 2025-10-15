import { Status, Tx, type useSelection } from "@use-pico/client";
import { type Cls, tvc } from "@use-pico/cls";
import type { CategoryGroup } from "@zbav-se.me/sdk";
import type { SheetCls } from "node_modules/@use-pico/client/src/sheet/SheetCls";
import { type FC, useRef } from "react";
import { useAnimation } from "~/app/listing/ui/CreateListing/CategoryGroup/Item/useAnimation";
import { useInitAnim } from "~/app/listing/ui/CreateListing/CategoryGroup/Item/useInitAnim";
import { Sheet } from "~/app/sheet/Sheet";
import { CategoryGroupIcon } from "~/app/ui/icon/CategoryGroupIcon";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";

export namespace CategoryGroupItem {
	export interface Props {
		selection: useSelection.Selection<CategoryGroup>;
		item: CategoryGroup;
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

	const sheetTweak: Cls.TweaksOf<SheetCls> = {
		slot: {
			root: {
				class: [
					"absolute",
					"inset-0",
				],
			},
		},
	};

	return (
		<div
			className={tvc([
				"relative",
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
					textTitle={
						<Tx
							label={`Category group ${item.name}`}
							tone={"primary"}
							theme={"dark"}
							font={"bold"}
						/>
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
				tweak={sheetTweak}
				round={"md"}
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
				/>
			</Sheet>
		</div>
	);
};
