import type { useSelection } from "@use-pico/client/hook";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { EntitySchema } from "@use-pico/common/schema";
import { tListingPriceEnum } from "@zbav-se.me/sdk/api/seller-user";
import { uiSelectButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

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
				const item = {
					id: priceType,
				};
				const isSelected = selection.isSelected(priceType);

				return (
					<Button
						key={priceType}
						onClick={() => {
							selection.toggle(item);
						}}
						{...uiSelectButton({
							isSelected,
							ui: {
								flow: "horizontal",
								justify: "start",
							},
							className: [],
						})}
						data-ui={`PriceTypeSelect-[Button.${priceType}]`}
					>
						<Tx label={`Listing price - ${priceType}`} />
					</Button>
				);
			})}
		</Container>
	);
};
