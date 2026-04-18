import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import type { useSelection } from "@/lib/client/selection";
import { Tx } from "@/lib/client/tx";
import type { EntitySchema } from "@/lib/common/schema";
import { uiSelectButton } from "~/common/ui/ui";

export namespace Item {
	export interface Props {
		priceType: string;
		selection: useSelection.Selection<EntitySchema.Type>;
	}
}

export const Item: FC<Item.Props> = ({ priceType, selection }) => {
	const item = {
		id: priceType,
	};
	const isSelected = selection.isSelected(priceType);

	return (
		<Button
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
			data-ui={`PriceTypeSelect-[Button.${priceType}]`}
		>
			<Container
				data-ui-layout="vertical-flex"
				data-ui-items="start"
				data-ui-gap="xs"
			>
				<Tx label={`Listing price - ${priceType}`} />

				<Tx
					label={`Listing price - ${priceType} (hint)`}
					data-ui-text="sm"
					data-ui-color="icon"
				/>
			</Container>
		</Button>
	);
};
