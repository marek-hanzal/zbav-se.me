import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import type { useSelection } from "@/lib/client/selection";
import { Tx } from "@/lib/client/tx";
import type { EntitySchema } from "@/lib/common/schema";
import { DeliveryEnumSchema } from "~/common/delivery/enum/DeliveryEnumSchema";
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
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const DeliverySelect: FC<DeliverySelect.Props> = ({ selection, ...props }) => {
	return (
		<Container
			data-ui="DeliverySelect[Container]"
			data-ui-layout="vertical-flex"
			data-ui-height="auto"
			data-ui-width="full"
			data-ui-gap="lg"
			{...props}
		>
			{Object.values(DeliveryEnumSchema.enum).map((delivery) => {
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
							"data-ui-flow": "horizontal",
							"data-ui-justify": "start",
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
