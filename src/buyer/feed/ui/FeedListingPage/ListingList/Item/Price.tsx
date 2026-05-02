import type { FC } from "react";
import { match, P } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { PriceInline } from "@/lib/client/price-inline";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { translator } from "@/lib/common/translation";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";

export namespace Price {
	export interface Props extends Container.Props {
		listing: Pick<ListingSchema.Type, "priceType" | "price" | "currency">;
	}
}

export const Price: FC<Price.Props> = ({ listing, ...props }) => {
	const locale = useLocale();

	return (
		<Container
			data-ui-flow={"horizontal"}
			data-ui-gap={"default"}
			data-ui-items={"center"}
			{...props}
		>
			{match(listing)
				.with(
					{
						priceType: "open",
						price: P.number,
						currency: P.string,
					},
					{
						priceType: "closed",
						price: P.number,
						currency: P.string,
					},
					({ price, currency, priceType }) => {
						if (!price) {
							return <Tx label={"Price - free"} />;
						}

						return (
							<>
								<PriceInline
									price={price}
									locale={locale}
									currency={currency}
								/>

								<Typo
									label={`(${translator.text(`Listing price - ${priceType}`)})`}
									data-ui-text="sm"
									data-ui-opacity="6"
								/>
							</>
						);
					},
				)
				.with(
					{
						priceType: "offer",
						price: P.number.or(P.nullish),
						currency: P.string.or(P.nullish),
					},
					() => {
						return <Tx label={"Listing price - offer"} />;
					},
				)
				.with(
					{
						priceType: P.optional(P.string.or(P.nullish)),
						price: P.optional(P.number.or(P.nullish)),
						currency: P.optional(P.string.or(P.nullish)),
					},
					() => {
						return null;
					},
				)
				.exhaustive()}
		</Container>
	);
};
