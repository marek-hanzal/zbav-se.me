import { ValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace DeliveryValueList {
	export interface Props
		extends Omit<
			ValueList.Props<{
				id: string;
				delivery: string;
			}>,
			"items" | "renderFn" | "textLabel" | "textEmpty"
		> {
		delivery: string[];
		onClick(): void;
	}
}

export const DeliveryValueList: FC<DeliveryValueList.Props> = ({ delivery, onClick, ...props }) => {
	const deliveryItems = delivery.map((d) => ({
		id: d,
		delivery: d,
	}));

	return (
		<ValueList
			data-ui={"DeliveryValueList[ValueList]"}
			textLabel={translator.text("Listing delivery (label)")}
			textEmpty={translator.text("Delivery not selected")}
			items={deliveryItems}
			renderFn={(item) => <Tx label={`Listing delivery - ${item.delivery}`} />}
			onClick={onClick}
			wrapperProps={{
				ui: {
					tone: deliveryItems.length > 0 ? "neutral" : "secondary",
				},
			}}
			{...props}
		/>
	);
};
