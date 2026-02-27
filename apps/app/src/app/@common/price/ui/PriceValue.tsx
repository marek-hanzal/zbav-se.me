import { useLocale } from "@use-pico/client/hook";
import { LabelValue } from "@use-pico/client/ui/container";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { translator } from "@use-pico/common/translator";
import type { tCurrencyEnum } from "@zbav-se.me/sdk/api/public";
import type { FC } from "react";

export namespace PriceValue {
	export interface Props extends LabelValue.PropsEx {
		price: number | null | undefined;
		currency: tCurrencyEnum | null | undefined;
	}
}

export const PriceValue: FC<PriceValue.Props> = ({ price, currency, ...props }) => {
	const locale = useLocale();
	const hasPrice = price != null && currency != null;
	return (
		<LabelValue
			data-ui={"PriceValue[LabelValue]"}
			textLabel={translator.text("Price (title)")}
			textValue={
				hasPrice ? (
					<PriceInline
						price={price}
						locale={locale}
						currency={currency}
					/>
				) : null
			}
			textEmpty={translator.text("Price not set")}
			{...props}
		/>
	);
};
