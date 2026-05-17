import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { LabelValue } from "@/lib/client/value";
import type { PriceTypeEnumSchema } from "~/common/price-type/enum/PriceTypeEnumSchema";

export namespace PriceTypeValue {
	export interface Props extends LabelValue.PropsEx {
		priceType: PriceTypeEnumSchema.Type | null | undefined;
	}
}

/**
 * Renders a read-only price type value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 */
export const PriceTypeValue: FC<PriceTypeValue.Props> = ({ priceType, ...props }) => {
	const translator = useTranslator();
	const hasPriceType = priceType != null;

	return (
		<LabelValue
			data-ui={"PriceTypeValue"}
			textLabel={translator.text("Price type (title)")}
			textValue={hasPriceType ? translator.text(`Price Type - ${priceType} (label)`) : null}
			textEmpty={translator.text("Price type not set")}
			wrapperProps={{
				"data-ui-tone": hasPriceType ? "neutral" : "primary",
			}}
			{...props}
		/>
	);
};
