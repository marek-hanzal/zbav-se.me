import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import type { useSelection } from "@/lib/client/selection";
import { Tx } from "@/lib/client/tx";
import type { EntitySchema } from "@/lib/common/schema";
import { uiSelectButton } from "~/common/ui/ui";
import { ListingStatusSelectEnumSchema } from "../enum/ListingStatusSelectEnumSchema";

export namespace ListingStatusSelect {
	export interface Props extends Container.Props {
		selection: useSelection.Use<EntitySchema.Type>;
	}
}

export const ListingStatusSelect: FC<ListingStatusSelect.Props> = ({ selection, ...props }) => {
	return (
		<Container
			data-ui={"ListingStatusSelect"}
			data-ui-layout="vertical-flex"
			data-ui-height="auto"
			data-ui-width="full"
			data-ui-gap="lg"
			{...props}
		>
			{ListingStatusSelectEnumSchema.options.map((status) => {
				const item = {
					id: status,
				};
				const isSelected = selection.isSelected(status);

				return (
					<Button
						key={status}
						onClick={() => {
							selection.toggle(item);
						}}
						{...uiSelectButton({
							isSelected,
							"data-ui-flow": "horizontal",
							"data-ui-justify": "start",
						})}
						data-ui={`ListingStatusSelect-[Button.${status}]`}
					>
						<Tx label={`Listing status - ${status}`} />
					</Button>
				);
			})}
		</Container>
	);
};
