import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tListingWarrantyEnum } from "@zbav-se.me/sdk/api/public";
import type { FC } from "react";

export namespace WarrantyValue {
	export interface Props extends LabelValue.PropsEx {
		warranty: tListingWarrantyEnum | null | undefined;
	}
}

export const WarrantyValue: FC<WarrantyValue.Props> = ({ warranty, ...props }) => {
	return (
		<LabelValue
			data-ui={"WarrantyValue[LabelValue]"}
			textLabel={translator.text("Listing warranty (label)")}
			textValue={warranty ? translator.text(`Listing warranty - ${warranty}`) : null}
			textEmpty={translator.text("Warranty not selected")}
			textHint={translator.text("Listing warranty (hint)")}
			{...props}
		/>
	);
};
