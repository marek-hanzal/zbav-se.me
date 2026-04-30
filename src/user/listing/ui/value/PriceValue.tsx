import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import { PriceInline } from "@/lib/client/price-inline";
import { LabelValue } from "@/lib/client/value";
import { translator } from "@/lib/common/translation";
import type { CurrencyEnumSchema } from "~/common/schema/CurrencyEnumSchema";

export namespace PriceValue {
	export interface Props extends LabelValue.PropsEx {
		price: number | null | undefined;
		currency: CurrencyEnumSchema.Type | null | undefined;
	}
}

/**
 * Renders a read-only price value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 */
export const PriceValue: FC<PriceValue.Props> = ({ price, currency, ...props }) => {
	const locale = useLocale();
	const hasPrice = price != null && currency != null;
	return (
		<LabelValue
			data-ui={"PriceValue"}
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
			wrapperProps={{
				"data-ui-tone": hasPrice ? "neutral" : "primary",
			}}
			{...props}
		/>
	);
};
