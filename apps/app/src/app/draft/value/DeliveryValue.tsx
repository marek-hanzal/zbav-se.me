import { EditIcon, Icon } from "@use-pico/client/icon";
import { ValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace DeliveryValue {
	export interface Props {
		draft: tDraft;
		onClick(): void;
	}
}

export const DeliveryValue: FC<DeliveryValue.Props> = ({ draft, onClick }) => {
	const deliveryItems = (draft.delivery ?? []).map((delivery) => ({
		id: delivery,
		delivery,
	}));

	return (
		<ValueList
			data-ui={"DeliveryValue[ValueList]"}
			textLabel={translator.text("Listing delivery (label)")}
			textEmpty={translator.text("Delivery not selected")}
			items={deliveryItems}
			renderFn={(item) => (
				<Tx
					label={`Listing delivery - ${item.delivery}`}
					ui={{
						tone: "secondary",
					}}
				/>
			)}
			action={
				<Icon
					icon={EditIcon}
					onClick={onClick}
					ui={{
						text: "xl",
					}}
				/>
			}
			onClick={onClick}
			ui={{
				tone: deliveryItems.length > 0 ? "neutral" : "secondary",
			}}
		/>
	);
};
