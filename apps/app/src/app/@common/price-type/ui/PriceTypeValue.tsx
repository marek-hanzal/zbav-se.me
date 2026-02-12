import { LabelValue } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tListingPriceEnum } from "@zbav-se.me/sdk/api/public";
import type { FC } from "react";

export namespace PriceTypeValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		priceType: tListingPriceEnum | null | undefined;
	}
}

export const PriceTypeValue: FC<PriceTypeValue.Props> = ({ priceType, ...props }) => {
	const hasPriceType = priceType != null;
	return (
		<LabelValue
			data-ui={"PriceTypeValue[LabelValue]"}
			textLabel={translator.text("Price type (title)")}
			textValue={hasPriceType ? <Tx label={`Listing price - ${priceType}`} /> : null}
			textEmpty={translator.text("Price type not set")}
			{...props}
		/>
	);
};
