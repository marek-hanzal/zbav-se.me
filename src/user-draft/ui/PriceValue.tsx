import type { FC } from "react";
import type { CurrencyEnumSchema } from "~/application/schema/CurrencyEnumSchema";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { LabelValue } from "~/ui/ui/LabelValue";
import { PriceInline } from "~/ui/ui/PriceInline";

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
	const translator = useTranslator();
	const locale = useLocale();
	const hasPrice = price != null && currency != null;
	return (
		<LabelValue
			data-ui={"PriceValue"}
			textLabel={translator.textFn("Price (title)")}
			textValue={
				hasPrice ? (
					<PriceInline
						price={price}
						locale={locale}
						currency={currency}
					/>
				) : null
			}
			textEmpty={translator.textFn("Price not set")}
			wrapperProps={{
				"data-ui-tone": hasPrice ? "neutral" : "primary",
			}}
			{...props}
		/>
	);
};
