import type { FC } from "react";
import { match, P } from "ts-pattern";
import type { ListingPriceSchema } from "~/listing/schema/ListingPriceSchema";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { Container } from "~/ui/ui/Container";
import { PriceInline } from "~/ui/ui/PriceInline";
import { Typo } from "~/ui/ui/Typo";

export namespace ListingPrice {
	export interface Props extends Container.Props {
		price: ListingPriceSchema.Type;
	}
}

export const ListingPrice: FC<ListingPrice.Props> = ({ price, ...props }) => {
	const translator = useTranslator();
	const locale = useLocale();

	return (
		<Container
			data-ui-flow={"horizontal"}
			data-ui-gap={"default"}
			data-ui-items={"center"}
			{...props}
		>
			{match(price)
				.with(
					{
						priceType: "fixed",
						price: P.number,
						currency: P.string,
					},
					{
						priceType: "haggle",
						price: P.number,
						currency: P.string,
					},
					({ price, currency, priceType }) => {
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
						priceType: "ask",
						price: P.number.or(P.nullish),
						currency: P.string.or(P.nullish),
					},
					{
						priceType: "free",
						price: P.number.or(P.nullish),
						currency: P.string.or(P.nullish),
					},
					{
						priceType: "haulaway",
						price: P.number.or(P.nullish),
						currency: P.string.or(P.nullish),
					},
					({ priceType }) => {
						return <Tx label={`Listing price - ${priceType}`} />;
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
