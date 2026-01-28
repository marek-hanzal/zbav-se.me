import type { useSelection } from "@use-pico/client/hook";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { EntitySchema } from "@use-pico/common/schema";
import { tListingDeliveryEnum } from "@zbav-se.me/sdk/api/buyer-session";
import { uiSelectButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace DeliverySelect {
	export interface Props extends Container.Props {
		selection: useSelection.Selection<EntitySchema.Type>;
	}
}

export const DeliverySelect: FC<DeliverySelect.Props> = ({ selection, ui, ...props }) => {
	return (
		<Container
			data-ui="DeliverySelect[Container]"
			ui={{
				layout: "vertical-flex",
				height: "auto",
				width: "full",
				gap: "lg",
				...ui,
			}}
			{...props}
		>
			{Object.values(tListingDeliveryEnum).map((delivery) => {
				const item = {
					id: delivery,
				};
				const isSelected = selection.isSelected(delivery);

				return (
					<Button
						key={delivery}
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
						data-ui={`DeliverySelect-[Button.${delivery}]`}
					>
						<Tx label={`Listing delivery - ${delivery}`} />
					</Button>
				);
			})}
		</Container>
	);
};
