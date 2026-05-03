import type { FC } from "react";
import { Container } from "@/lib/client/container";
import type { useSelection } from "@/lib/client/selection";
import type { EntitySchema } from "@/lib/common/schema";
import { PriceTypeEnumSchema } from "~/common/price-type/enum/PriceTypeEnumSchema";
import { Item } from "./Item";

export namespace PriceTypeSelect {
	export interface Props extends Container.Props {
		selection: useSelection.Selection<EntitySchema.Type>;
	}
}

/**
 * Provides an interactive control for selecting price type values in forms.
 * Use it in editors where users need to choose or update price type before saving.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const PriceTypeSelect: FC<PriceTypeSelect.Props> = ({ selection, ...props }) => {
	return (
		<Container
			data-ui="PriceTypeSelect[Container]"
			data-ui-layout="vertical-flex"
			data-ui-height="auto"
			data-ui-width="full"
			data-ui-gap="lg"
			{...props}
		>
			{Object.values(PriceTypeEnumSchema.enum).map((priceType) => {
				return (
					<Item
						key={priceType}
						priceType={priceType}
						selection={selection}
					/>
				);
			})}
		</Container>
	);
};
