import type { FC } from "react";
import { uiSelectButton } from "~/common/ui/ui";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import type { useSelection } from "~/selection/hook/useSelection";
import { Tx } from "~/translation/ui/Tx";
import { Button } from "~/ui/ui/Button";
import { Container } from "~/ui/ui/Container";

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
			data-action={`select price type ${priceType}`}
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
