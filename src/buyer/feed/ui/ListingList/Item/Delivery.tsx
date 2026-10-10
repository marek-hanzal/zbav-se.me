import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useTranslator } from "@/lib/client/translation";
import { Typo } from "@/lib/client/typo";
import type { DeliveryEnumSchema } from "~/common/delivery/enum/DeliveryEnumSchema";

export namespace Delivery {
	export interface Props extends Typo.PropsEx {
		delivery: DeliveryEnumSchema.Type[] | undefined | null;
	}
}

export const Delivery: FC<Delivery.Props> = ({ delivery, ...props }) => {
	const translator = useTranslator();
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
