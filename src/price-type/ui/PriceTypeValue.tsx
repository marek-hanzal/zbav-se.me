import type { FC } from "react";
import type { PriceTypeEnumSchema } from "~/price-type/schema/PriceTypeEnumSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { LabelValue } from "~/ui/ui/LabelValue";

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
			textLabel={translator.textFn("Price type (title)")}
			textValue={hasPriceType ? translator.textFn(`Price Type - ${priceType} (label)`) : null}
			textEmpty={translator.textFn("Price type not set")}
			wrapperProps={{
				"data-ui-tone": hasPriceType ? "neutral" : "primary",
			}}
			{...props}
		/>
	);
};
