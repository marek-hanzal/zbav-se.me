import type { useSelection } from "@use-pico/client/hook";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { EntitySchema } from "@use-pico/common/schema";
import { tListingWarrantyEnum } from "@zbav-se.me/sdk/api/seller-user";
import { uiSelectButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace WarrantySelect {
	export interface Props extends Container.Props {
		selection: useSelection.Selection<EntitySchema.Type>;
	}
}

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
			{Object.values(tListingWarrantyEnum).map((warranty) => {
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
