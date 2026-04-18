import { Button } from "@/lib/client/button";
import { withFallback } from "@/lib/client/fallback";

import type { useSelection } from "@/lib/client/selection";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Typo } from "@/lib/client/typo";
import type { EntitySchema } from "@/lib/common/schema";
import { uiSelectButton } from "~/common/ui/ui";
import { withCategoryQuery } from "~/session/category/withCategoryQuery";

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
 * @see src/draft/ui/DraftEditor/patch/CategoryPatch.tsx
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
					data-ui-text="sm"
				/>

				<Typo
					label={item.category}
					data-ui-text="lg"
					data-ui-font={isSelected ? "bold" : "normal"}
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
