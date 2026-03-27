import { useLocale } from "@use-pico/client/hook";
import { LabelValue } from "@use-pico/client/ui/container";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import type { CurrencyEnumSchema } from "~/@common/schema/CurrencyEnumSchema";

export namespace PriceValue {
	export interface Props extends LabelValue.PropsEx {
		price: number | null | undefined;
		currency: CurrencyEnumSchema.Type | null | undefined;
	}
}

/**
 * Renders a read-only price value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
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
			{...props}
		/>
	);
};
