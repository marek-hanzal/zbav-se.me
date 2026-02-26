import type { useSelection } from "@use-pico/client/hook";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { EntitySchema } from "@use-pico/common/schema";
import { uiSelectButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace PriceTypeItem {
	export interface Props {
		priceType: string;
		selection: useSelection.Selection<EntitySchema.Type>;
	}
}

export const PriceTypeItem: FC<PriceTypeItem.Props> = ({ priceType, selection }) => {
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
				ui={{
					layout: "vertical-flex",
					items: "start",
					gap: "xs",
				}}
			>
				<Tx label={`Listing price - ${priceType}`} />

				<Tx
					label={`Listing price - ${priceType} (hint)`}
					ui={{
						text: "sm",
						color: "icon",
					}}
				/>
			</Container>
		</Button>
	);
};
