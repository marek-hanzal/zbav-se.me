import type { FC } from "react";
import { Container } from "@/lib/client/container";
import type { useSelection } from "@/lib/client/selection";
import type { EntitySchema } from "@/lib/common/schema";
import { ListingRestrictionEnumSchema } from "~/common/listing/enum/ListingRestrictionEnumSchema";
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
			ui={{
				layout: "vertical-flex",
				height: "full",
				width: "full",
				scroll: "vertical",
				gap: "lg",
				...ui,
			}}
			{...props}
		>
			{Object.values(ListingRestrictionEnumSchema.enum).map((restriction) => {
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
