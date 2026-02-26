import type { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import { tListingPriceEnum } from "@zbav-se.me/sdk/api/public";
import type { FC } from "react";
import { PriceTypeItem } from "./PriceTypeItem";

export namespace PriceTypeSelect {
	export interface Props extends Container.Props {
		selection: useSelection.Selection<EntitySchema.Type>;
	}
}

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
					<PriceTypeItem
						key={priceType}
						priceType={priceType}
						selection={selection}
					/>
				);
			})}
		</Container>
	);
};
