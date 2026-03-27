import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { EntitySchema } from "@use-pico/common/schema";
import type { FC } from "react";
import type { useSelection } from "@/lib/client/selection";
import { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { uiSelectButton } from "~/common/ui/ui";

export namespace DeliverySelect {
	export interface Props extends Container.Props {
		selection: useSelection.Selection<EntitySchema.Type>;
	}
}

/**
 * Provides an interactive control for selecting delivery values in forms.
 * Use it in editors where users need to choose or update delivery before saving.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
 */
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
			{Object.values(ListingDeliveryEnumSchema.enum).map((delivery) => {
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
