import { ValueList } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace DeliveryValueList {
	export interface Props
		extends Omit<
			ValueList.PropsEx<{
				id: string;
				delivery: string;
			}>,
			"items" | "renderFn"
		> {
		deliveryIn: string[];
	}
}

export const DeliveryValueList: FC<DeliveryValueList.Props> = ({ deliveryIn, ...props }) => {
	const items = deliveryIn.map((item) => ({
		id: item,
		delivery: item,
	}));

	return (
		<ValueList
			data-ui={"DeliveryValueList[ValueList]"}
			textLabel={translator.text("Feed delivery (label)")}
			textEmpty={translator.text("Feed delivery not selected")}
			items={items}
			renderFn={(item) => translator.text(`Listing delivery - ${item.delivery}`)}
			{...props}
		/>
	);
};
