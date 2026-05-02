import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { PriceInline } from "@/lib/client/price-inline";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { translator } from "@/lib/common/translation";
import type { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import type { CurrencyEnumSchema } from "~/common/schema/CurrencyEnumSchema";

export namespace Price {
	export interface Props extends Container.Props {
		price: number | null | undefined;
		currency: CurrencyEnumSchema.Type | null | undefined;
		type: ListingPriceEnumSchema.Type | null | undefined;
	}
}

export const Price: FC<Price.Props> = ({ price, currency, type, ...props }) => {
	const locale = useLocale();

	if (price === null || price === undefined || type === null || currency === null) {
		return null;
	}

	return (
		<Container
			data-ui-flow={"horizontal"}
			data-ui-gap={"default"}
			data-ui-items={"center"}
			{...props}
		>
			{match(type)
				.with("open", "closed", () => {
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
								label={`(${translator.text(`Listing price - ${type}`)})`}
								data-ui-text="sm"
								data-ui-opacity="6"
							/>
						</>
					);
				})
				.with("offer", () => {
					return <Tx label={"Listing price - offer"} />;
				})
				.exhaustive()}
		</Container>
	);
};
