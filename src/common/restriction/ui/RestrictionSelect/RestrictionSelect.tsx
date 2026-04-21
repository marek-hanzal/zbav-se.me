import type { FC } from "react";
import { Container } from "@/lib/client/container";
import type { useSelection } from "@/lib/client/selection";
import type { EntitySchema } from "@/lib/common/schema";
import { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";
import { Item } from "./Item";

export namespace RestrictionSelect {
	export interface Props extends Container.Props {
		selection: useSelection.Selection<EntitySchema.Type>;
	}
}

/**
 * Provides an interactive control for selecting restriction values in forms.
 * Use it in editors where users need to choose or update restriction before saving.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const RestrictionSelect: FC<RestrictionSelect.Props> = ({ selection, ...props }) => {
	return (
		<Container
			data-ui="RestrictionSelect[Container]"
			data-ui-layout="vertical-flex"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-scroll="vertical"
			data-ui-gap="lg"
			{...props}
		>
			{Object.values(CategoryRestrictionEnumSchema.enum).map((restriction) => {
				return (
					<Item
						key={restriction}
						restriction={restriction}
						selection={selection}
					/>
				);
			})}
		</Container>
	);
};
