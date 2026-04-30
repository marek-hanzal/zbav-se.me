import type { FC } from "react";
import { LabelValue } from "@/lib/client/value";
import { translator } from "@/lib/common/translation";
import type { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";

export namespace PriceTypeValue {
	export interface Props extends LabelValue.PropsEx {
		priceType: ListingPriceEnumSchema.Type | null | undefined;
	}
}

/**
 * Renders a read-only price type value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 */
export const PriceTypeValue: FC<PriceTypeValue.Props> = ({ priceType, ...props }) => {
	const hasPriceType = priceType != null;
	return (
		<LabelValue
			data-ui={"PriceTypeValue"}
			textLabel={translator.text("Price type (title)")}
			textValue={hasPriceType ? translator.text(`Listing price - ${priceType}`) : null}
			textEmpty={translator.text("Price type not set")}
			wrapperProps={{
				"data-ui-tone": hasPriceType ? "neutral" : "primary",
			}}
			{...props}
		/>
	);
};
