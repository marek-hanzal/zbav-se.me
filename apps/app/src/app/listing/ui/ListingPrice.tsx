import { Badge } from "@use-pico/client/ui/badge";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";

export namespace ListingPrice {
	export interface Props extends Badge.Props {
		price: number;
		locale: string;
		currency: string;
	}
}

export const ListingPrice: FC<ListingPrice.Props> = ({ price, locale, currency, ...props }) => {
	return (
		<Badge
			ui={"ListingPrice-root"}
			tone={"secondary"}
			theme={"light"}
			round={"default"}
			tweak={{
				slot: {
					root: {
						class: [
							"max-w-1/2",
							"px-4",
						],
					},
				},
			}}
			{...props}
		>
			{price > 0 ? (
				<PriceInline
					price={price}
					locale={locale}
					currency={currency}
				/>
			) : (
				<Tx label={"Price - free"} />
			)}
		</Badge>
	);
};
