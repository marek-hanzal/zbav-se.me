import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import type { useSelection } from "@/lib/client/selection";
import { Tx } from "@/lib/client/tx";
import type { EntitySchema } from "@/lib/common/schema";
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
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const WarrantySelect: FC<WarrantySelect.Props> = ({ selection, ...props }) => {
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
