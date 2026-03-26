import type { useSelection } from "@use-pico/client/hook";
import { Button } from "@use-pico/client/ui/button";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { withFallback } from "@use-pico/client/utils";
import type { EntitySchema } from "@use-pico/common/schema";
import { uiSelectButton } from "@zbav-se.me/ui/ui";
import { withCategoryQuery } from "~/client/@session/category/withCategoryQuery";

export namespace CategoryItem {
	export interface Props {
		categoryId: string;
		selection: useSelection.Selection<EntitySchema.Type>;
	}
}

/**
 * Wraps the async category row renderer with suspense so each option can resolve independently.
 * Use it inside category selection lists where option rows load translated labels or metadata on demand.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/patch/CategoryPatch.tsx
 */
export const CategoryItem = withFallback(
	({ categoryId, selection }: CategoryItem.Props) => {
		const { data: item } = withCategoryQuery.useFetchQuery(categoryId);
		const isSelected = selection.isSelected(item.id);

		return (
			<Button
				data-id={item.id}
				onClick={() => {
					selection.toggle(item);
				}}
				{...uiSelectButton({
					isSelected,
					className: undefined,
				})}
				data-ui="CategoryItem"
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
	},
	(props: SpinnerContainer.Props) => {
		return (
			<SpinnerContainer
				data-ui="CategoryItem-[SpinnerContainer]"
				{...props}
			/>
		);
	},
);
