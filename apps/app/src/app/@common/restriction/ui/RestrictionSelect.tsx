import type { useSelection } from "@use-pico/client/hook";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { EntitySchema } from "@use-pico/common/schema";
import { tListingRestrictionEnum } from "@zbav-se.me/sdk/api/seller-user";
import { uiSelectButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace RestrictionSelect {
	export interface Props extends Container.Props {
		selection: useSelection.Selection<EntitySchema.Type>;
	}
}

export const RestrictionSelect: FC<RestrictionSelect.Props> = ({ selection, ui, ...props }) => {
	return (
		<Container
			data-ui="RestrictionSelect[Container]"
			ui={{
				layout: "vertical-flex",
				height: "auto",
				width: "full",
				gap: "lg",
				...ui,
			}}
			{...props}
		>
			{Object.values(tListingRestrictionEnum).map((restriction) => {
				const item = {
					id: restriction,
				};
				const isSelected = selection.isSelected(restriction);

				return (
					<Button
						key={restriction}
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
						data-ui={`RestrictionSelect-[Button.${restriction}]`}
					>
						<Tx label={`Listing restriction - ${restriction}`} />
					</Button>
				);
			})}
		</Container>
	);
};
