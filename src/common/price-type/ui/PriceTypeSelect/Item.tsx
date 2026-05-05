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
		selection: useSelection.Use<EntitySchema.Type>;
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
				name: `Item-${priceType}`,
				isSelected,
				"data-ui-flow": "horizontal",
				"data-ui-justify": "start",
			})}
		>
			<Container
				data-ui-layout="vertical-flex"
				data-ui-items="start"
				data-ui-gap="xs"
			>
				<Tx label={`Price Type - ${priceType} (label)`} />

				<Tx
					label={`Price Type - ${priceType} (hint)`}
					data-ui-text="sm"
					data-ui-color="icon"
				/>
			</Container>
		</Button>
	);
};
