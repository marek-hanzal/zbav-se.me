import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";

import type { useSelection } from "@/lib/client/selection";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Tx } from "@/lib/client/tx";
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
				<Container
					data-ui-flow={"vertical"}
					data-ui-items={"start"}
				>
					<Typo
						label={item.group}
						data-ui-text="sm"
						data-ui-opacity={"6"}
					/>

					<Typo
						label={item.category}
						data-ui-text="lg"
						data-ui-font={isSelected ? "bold" : "normal"}
					/>
				</Container>

				{item.restriction === "none" ? (
					<Tx
						label={`Listing restriction - ${item.restriction}`}
						data-ui-opacity={"6"}
					/>
				) : (
					<Tx
						label={`Listing restriction - ${item.restriction}`}
						data-ui-tone={"brand"}
						data-ui-theme={"light"}
						data-ui-color={"lead"}
						data-ui-font={"bold"}
					/>
				)}
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
