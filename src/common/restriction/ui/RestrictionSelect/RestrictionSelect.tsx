import type { FC } from "react";
import { Container } from "@/lib/client/container";
import type { useSelection } from "@/lib/client/selection";
import type { EntitySchema } from "@/lib/common/schema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { Item } from "./Item";

const getSelectableRestrictions = (
	minLevel: RestrictionEnumSchema.Type,
	maxLevel: RestrictionEnumSchema.Type,
) => {
	const { options } = RestrictionEnumSchema;
	const minIndex = options.indexOf(minLevel);
	const maxIndex = options.indexOf(maxLevel);

	return options.slice(minIndex, maxIndex + 1);
};

export namespace RestrictionSelect {
	export interface Props extends Container.Props {
		selection: useSelection.Selection<EntitySchema.Type>;
		allowClear?: boolean;
		/**
		 * Minimum selectable level.
		 */
		minLevel?: RestrictionEnumSchema.Type;
		/**
		 * Maximum selectable level.
		 */
		maxLevel?: RestrictionEnumSchema.Type;
	}
}

/**
 * Provides an interactive control for selecting restriction values in forms.
 * Use it in editors where users need to choose or update restriction before saving.
 */
export const RestrictionSelect: FC<RestrictionSelect.Props> = ({
	allowClear,
	minLevel = "none",
	maxLevel = "restricted",
	selection,
	...props
}) => {
	const restrictions = getSelectableRestrictions(minLevel, maxLevel);

	return (
		<Container
			data-ui="RestrictionSelect"
			data-ui-layout="vertical-flex"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-scroll="vertical"
			data-ui-gap="lg"
			{...props}
		>
			{restrictions.map((restriction) => {
				return (
					<Item
						key={restriction}
						restriction={restriction}
						selection={selection}
						allowClear={allowClear}
					/>
				);
			})}
		</Container>
	);
};
