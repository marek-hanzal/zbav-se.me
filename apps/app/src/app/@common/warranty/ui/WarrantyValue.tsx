import { LabelValue } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tListingWarrantyEnum } from "@zbav-se.me/sdk/api/public";
import type { FC } from "react";

export namespace WarrantyValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		warranty: tListingWarrantyEnum | null | undefined;
	}
}

export const WarrantyValue: FC<WarrantyValue.Props> = ({ warranty, ...props }) => {
	return (
		<LabelValue
			data-ui={"WarrantyValue[LabelValue]"}
			textLabel={translator.text("Listing warranty (label)")}
			textValue={warranty ? <Tx label={`Listing warranty - ${warranty}`} /> : null}
			textEmpty={translator.text("Warranty not selected")}
			textHint={translator.text("Listing warranty (hint)")}
			{...props}
		/>
	);
};
