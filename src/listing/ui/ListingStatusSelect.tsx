import type { FC } from "react";
import { uiSelectButton } from "~/application-ui/fn/ui.exports";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { ListingStatusSelectEnumSchema } from "~/listing/schema/ListingStatusSelectEnumSchema";
import type { useSelection } from "~/selection/hook/useSelection";
import { Tx } from "~/translation/ui/Tx";
import { Button } from "~/ui/ui/Button";
import { Container } from "~/ui/ui/Container";

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
