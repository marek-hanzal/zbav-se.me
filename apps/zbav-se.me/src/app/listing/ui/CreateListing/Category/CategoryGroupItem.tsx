import { Tx, type useSelection } from "@use-pico/client";
import { Status } from "node_modules/@use-pico/client/src/status/Status";
import { type FC, useRef } from "react";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import { Sheet } from "~/app/sheet/Sheet";
import { anim, useAnim } from "~/app/ui/gsap";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { TagIcon } from "~/app/ui/icon/TagIcon";

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

	const offset = "85%";

	useAnim(() => {
		if (isSelected) {
			anim.set(selectedRef.current, {
				opacity: 1,
				x: 0,
			});
			anim.set(unselectedRef.current, {
				opacity: 0,
				x: offset,
			});
		}
		if (!isSelected) {
			anim.set(selectedRef.current, {
				opacity: 1,
				x: offset,
			});
			anim.set(unselectedRef.current, {
				opacity: 1,
				x: 0,
			});
		}
	});

	useAnim(
		() => {
			const tl = anim.timeline({
				defaults: {
					duration: 0.275,
				},
			});

			if (isSelected) {
				tl.to(
					selectedRef.current,
					{
						opacity: 1,
						x: 0,
						scale: 1,
					},
					0,
				).to(
					unselectedRef.current,
					{
						opacity: 0,
						x: `-${offset}`,
						scale: 0.95,
					},
					0,
				);
			}

			if (!isSelected) {
				tl.to(
					selectedRef.current,
					{
						opacity: 0,
						x: offset,
						scale: 0.95,
					},
					0,
				);
				tl.to(
					unselectedRef.current,
					{
						opacity: 1,
						x: 0,
						scale: 1,
					},
					0,
				);
			}
		},
		{
			dependencies: [
				isSelected,
			],
		},
	);

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
					icon={TagIcon}
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
