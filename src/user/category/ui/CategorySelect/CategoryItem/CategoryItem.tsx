import type { FC } from "react";
import { uiSelectButton } from "~/common/ui/ui";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import type { useSelection } from "~/selection/hook/useSelection";
import { Tx } from "~/translation/ui/Tx";
import { Button } from "~/ui/ui/Button";
import { Container } from "~/ui/ui/Container";
import { Typo } from "~/ui/ui/Typo";
import type { CategorySchema } from "~/user/category/server/schema/CategorySchema";

export namespace CategoryItem {
	export interface Props {
		category: CategorySchema.Type;
		selection: useSelection.Use<EntitySchema.Type>;
	}
}

/**
 * Wraps the async category row renderer with suspense so each option can resolve independently.
 * Use it inside category selection lists where option rows load translated labels or metadata on demand.
 */
export const CategoryItem: FC<CategoryItem.Props> = ({ category, selection }) => {
	const isSelected = selection.isSelected(category.id);

	return (
		<Button
			data-id={category.id}
			data-action={"select category"}
			onClick={() => {
				selection.toggle(category);
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
					label={category.group}
					data-ui-text="sm"
					data-ui-opacity={"6"}
				/>

				<Typo
					label={category.category}
					data-ui-text="lg"
					data-ui-font={isSelected ? "bold" : "normal"}
				/>
			</Container>

			{category.restriction === "none" ? (
				<Tx
					label={`Listing restriction - ${category.restriction}`}
					data-ui-opacity={"6"}
				/>
			) : (
				<Tx
					label={`Listing restriction - ${category.restriction}`}
					data-ui-tone={"brand"}
					data-ui-theme={"light"}
					data-ui-color={"lead"}
					data-ui-font={"bold"}
				/>
			)}
		</Button>
	);
};
