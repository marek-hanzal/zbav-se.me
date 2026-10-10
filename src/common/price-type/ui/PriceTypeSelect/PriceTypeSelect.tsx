import type { FC } from "react";
import { PriceTypeEnumSchema } from "~/common/price-type/enum/PriceTypeEnumSchema";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import type { useSelection } from "~/selection/hook/useSelection";
import { Container } from "~/ui/ui/Container";
import { Item } from "./Item";

export namespace PriceTypeSelect {
	export interface Props extends Container.Props {
		selection: useSelection.Use<EntitySchema.Type>;
	}
}

/**
 * Provides an interactive control for selecting price type values in forms.
 * Use it in editors where users need to choose or update price type before saving.
 */
export const PriceTypeSelect: FC<PriceTypeSelect.Props> = ({ selection, ...props }) => {
	return (
		<Container
			data-ui="PriceTypeSelect"
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
