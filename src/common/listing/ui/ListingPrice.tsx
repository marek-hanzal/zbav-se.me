import type { FC } from "react";
import { Badge } from "@/lib/client/badge";
import { useLocale } from "@/lib/client/locale";
import { PriceInline } from "@/lib/client/price-inline";
import { Tx } from "@/lib/client/tx";
import type { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";

export namespace ListingPrice {
	export interface Props extends Badge.Props {
		price: number | null | undefined;
		priceType: ListingPriceEnumSchema.Type | null | undefined;
		currency: string | null | undefined;
	}
}

/**
 * Formats and displays listing price with locale-aware currency rendering and price-type context.
 * Use it in listing cards and detail views that must show pricing consistently.
 */
export const ListingPrice: FC<ListingPrice.Props> = ({ price, priceType, currency, ...props }) => {
	const locale = useLocale();

	return (
		<Badge
			data-ui={"ListingPrice"}
			className="max-w-1/2"
			data-ui-tone="secondary"
			data-ui-theme="light"
			data-ui-font="bold"
			data-ui-text="lg"
			data-ui-size="sm"
			data-ui-color="lead"
			data-ui-flow="vertical"
			data-ui-items="center"
			data-ui-justify="center"
			{...props}
		>
			{price > 0 ? (
				<>
					<PriceInline
						price={price}
						locale={locale}
						currency={currency}
					/>

					<Tx
						label={`Listing price - ${priceType}`}
						data-ui-text="sm"
						data-ui-opacity="6"
					/>
				</>
			) : (
				<Tx label={`Price - ${priceType}`} />
			)}
		</Badge>
	);
};
