import { EditIcon, Icon } from "@use-pico/client/icon";
import { ValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace DeliveryValue {
	export interface Props
		extends Omit<
			ValueList.PropsEx<{
				id: string;
				delivery: string;
			}>,
			"items" | "renderFn"
		> {
		feed: tFeed;
	}
}

export const DeliveryValue: FC<DeliveryValue.Props> = ({ feed, ...props }) => {
	const deliveryIn = feed.query?.filter?.deliveryIn;

	return (
		<ValueList
			data-ui={"DeliveryValue[ValueList]"}
			textLabel={translator.text("Feed delivery (label)")}
			textEmpty={translator.text("Feed delivery not selected")}
			items={(deliveryIn ?? []).map((item) => ({
				id: item,
				delivery: item,
			}))}
			renderFn={(item) => <Tx label={`Listing delivery - ${item.delivery}`} />}
			action={
				<Icon
					icon={EditIcon}
					ui={{
						text: "xl",
					}}
				/>
			}
			{...props}
		/>
	);
};
