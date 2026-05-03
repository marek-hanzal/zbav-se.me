import type { FC } from "react";
import { LabelValue } from "@/lib/client/value";
import { translator } from "@/lib/common/translation";

import type { WarrantyEnumSchema } from "~/common/warranty/enum/WarrantyEnumSchema";

export namespace WarrantyValue {
	export interface Props extends LabelValue.PropsEx {
		warranty: WarrantyEnumSchema.Type | null | undefined;
	}
}

/**
 * Renders a read-only warranty value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 */
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
