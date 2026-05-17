import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { ValueList } from "@/lib/client/value";

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

/**
 * Renders a read-only list of delivery values in a consistent label/value style.
 * Use it in detail or preview views when you need to show multiple delivery entries clearly.
 */
export const DeliveryValueList: FC<DeliveryValueList.Props> = ({ deliveryIn, ...props }) => {
	const translator = useTranslator();
	const items = deliveryIn.map((item) => ({
		id: item,
		delivery: item,
	}));

	return (
		<ValueList
			data-ui={"DeliveryValueList"}
			textLabel={translator.text("Feed delivery (label)")}
			textEmpty={translator.text("Feed delivery not selected")}
			items={items}
			renderFn={(item) => translator.text(`Listing delivery - ${item.delivery}`)}
			{...props}
		/>
	);
};
