import type { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import { tListingPriceEnum } from "@zbav-se.me/sdk/api/public";
import type { FC } from "react";
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
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
 */
export const PriceTypeSelect: FC<PriceTypeSelect.Props> = ({ selection, ui, ...props }) => {
	return (
		<Container
			data-ui="PriceTypeSelect[Container]"
			ui={{
				layout: "vertical-flex",
				height: "auto",
				width: "full",
				gap: "lg",
				...ui,
			}}
			{...props}
		>
			{Object.values(tListingPriceEnum).map((priceType) => {
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
