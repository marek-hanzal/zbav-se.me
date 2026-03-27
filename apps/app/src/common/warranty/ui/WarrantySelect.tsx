import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { EntitySchema } from "@use-pico/common/schema";
import type { FC } from "react";
import type { useSelection } from "@/lib/client/selection";
import { ListingWarrantyEnumSchema } from "~/common/listing/enum/ListingWarrantyEnumSchema";
import { uiSelectButton } from "~/common/ui/ui";

export namespace WarrantySelect {
	export interface Props extends Container.Props {
		selection: useSelection.Selection<EntitySchema.Type>;
	}
}

/**
 * Provides an interactive control for selecting warranty values in forms.
 * Use it in editors where users need to choose or update warranty before saving.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
 */
export const WarrantySelect: FC<WarrantySelect.Props> = ({ selection, ui, ...props }) => {
	return (
		<Container
			data-ui="WarrantySelect[Container]"
			ui={{
				layout: "vertical-flex",
				height: "auto",
				width: "full",
				gap: "lg",
				...ui,
			}}
			{...props}
		>
			{Object.values(ListingWarrantyEnumSchema.enum).map((warranty) => {
				const item = {
					id: warranty,
				};
				const isSelected = selection.isSelected(warranty);

				return (
					<Button
						key={warranty}
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
						data-ui={`WarrantySelect-[Button.${warranty}]`}
					>
						<Tx label={`Listing warranty - ${warranty}`} />
					</Button>
				);
			})}
		</Container>
	);
};
