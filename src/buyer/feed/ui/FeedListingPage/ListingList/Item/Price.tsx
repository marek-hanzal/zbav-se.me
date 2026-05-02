import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { PriceInline } from "@/lib/client/price-inline";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { translator } from "@/lib/common/translation";
import type { ListingPriceSchema } from "~/common/listing/schema/ListingPriceSchema";

export namespace Price {
	export interface Props extends Container.Props {
		price: ListingPriceSchema.Type;
	}
}

export const Price: FC<Price.Props> = ({ price, ...props }) => {
	const locale = useLocale();

	if (!price.priceType) {
		return null;
	}

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
						priceType: "open",
					},
					{
						priceType: "closed",
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
					},
					() => {
						return <Tx label={"Listing price - offer"} />;
					},
				)
				.exhaustive()}
		</Container>
	);
};
