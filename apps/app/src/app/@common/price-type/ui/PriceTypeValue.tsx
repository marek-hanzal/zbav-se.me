import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tListingPriceEnum } from "@zbav-se.me/sdk/api/public";
import type { FC } from "react";

export namespace PriceTypeValue {
	export interface Props extends LabelValue.PropsEx {
		priceType: tListingPriceEnum | null | undefined;
	}
}

/**
 * Renders a read-only price type value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 *
 * @see apps/app/src/app/@seller-user/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const PriceTypeValue: FC<PriceTypeValue.Props> = ({ priceType, ...props }) => {
	const hasPriceType = priceType != null;
	return (
		<LabelValue
			data-ui={"PriceTypeValue[LabelValue]"}
			textLabel={translator.text("Price type (title)")}
			textValue={hasPriceType ? translator.text(`Listing price - ${priceType}`) : null}
			textEmpty={translator.text("Price type not set")}
			{...props}
		/>
	);
};
