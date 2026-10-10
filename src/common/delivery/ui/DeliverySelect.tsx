import type { FC } from "react";
import { DeliveryEnumSchema } from "~/common/delivery/enum/DeliveryEnumSchema";
import { uiSelectButton } from "~/common/ui/ui";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import type { useSelection } from "~/selection/hook/useSelection";
import { Tx } from "~/translation/ui/Tx";
import { Button } from "~/ui/ui/Button";
import { Container } from "~/ui/ui/Container";

export namespace DeliverySelect {
	export interface Props extends Container.Props {
		selection: useSelection.Use<EntitySchema.Type>;
	}
}

/**
 * Provides an interactive control for selecting delivery values in forms.
 * Use it in editors where users need to choose or update delivery before saving.
 */
export const DeliverySelect: FC<DeliverySelect.Props> = ({ selection, ...props }) => {
	return (
		<Container
			data-ui="DeliverySelect"
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
