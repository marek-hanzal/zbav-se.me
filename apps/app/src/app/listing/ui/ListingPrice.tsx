import { useLocale } from "@use-pico/client/hook";
import { Badge } from "@use-pico/client/ui/badge";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";

export namespace ListingPrice {
	export interface Props extends Badge.Props {
		price: number;
		currency: string;
	}
}

export const ListingPrice: FC<ListingPrice.Props> = ({ price, currency, ui, ...props }) => {
	const locale = useLocale();
	return (
		<Badge
			data-ui={"ListingPrice[Badge]"}
			className="max-w-1/2"
			ui={{
				tone: "secondary",
				theme: "light",
				font: "bold",
				text: "lg",
				size: "sm",
				color: "lead",
				...ui,
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
