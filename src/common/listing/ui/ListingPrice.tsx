import type { FC } from "react";
import { match } from "ts-pattern";
import { Badge } from "@/lib/client/badge";
import { useLocale } from "@/lib/client/locale";
import { PriceInline } from "@/lib/client/price-inline";
import { Tx } from "@/lib/client/tx";
import type { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";

export namespace ListingPrice {
	export interface Props extends Badge.Props {
		price: number;
		priceType: ListingPriceEnumSchema.Type;
		currency: string;
	}
}

/**
 * Formats and displays listing price with locale-aware currency rendering and price-type context.
 * Use it in listing cards and detail views that must show pricing consistently.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
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

					{match(priceType)
						/**
						 * This hack only marks the place with dynamic translation, so it's easy to find it when source
						 * changes.
						 */
						.with("closed", "open", () => {
							return (
								<Tx
									label={`Listing price - ${priceType}`}
									data-ui-text="sm"
									data-ui-opacity="6"
								/>
							);
						})
						.exhaustive()}
				</>
			) : (
				<Tx label={"Price - free"} />
			)}
		</Badge>
	);
};
