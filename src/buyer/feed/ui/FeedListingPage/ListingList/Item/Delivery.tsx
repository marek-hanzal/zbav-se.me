import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Typo } from "@/lib/client/typo";
import { translator } from "@/lib/common/translation";
import type { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";

export namespace Delivery {
	export interface Props extends Typo.PropsEx {
		delivery: ListingDeliveryEnumSchema.Type[] | undefined | null;
	}
}

export const Delivery: FC<Delivery.Props> = ({ delivery, ...props }) => {
	const [item] = delivery ?? [];

	if (!item || !delivery) {
		return null;
	}

	const remaining = delivery.length - 1;

	return (
		<Container
			data-ui-flow={"horizontal"}
			data-ui-gap={"xs"}
			data-ui-items={"center"}
		>
			<Typo
				label={translator.text(`Listing delivery - ${item}`)}
				{...props}
			/>

			{remaining > 0 ? (
				<Typo
					label={`+${remaining}`}
					data-ui-text={"sm"}
					data-ui-opacity={"6"}
				/>
			) : null}
		</Container>
	);
};
