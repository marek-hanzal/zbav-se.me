import type { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import { tListingRestrictionEnum } from "@zbav-se.me/sdk/api/public";
import type { FC } from "react";
import { Item } from "./Item";

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
				return (
					<Item
						key={restriction}
						restriction={restriction}
						selection={selection}
					/>
				);
			})}
		</Container>
	);
};
