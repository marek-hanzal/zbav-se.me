import type { FC } from "react";
import { LabelValue } from "@/lib/client/value";
import { translator } from "@/lib/common/translator";

export namespace AgeValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		age: number | null | undefined;
	}
}

/**
 * Renders a read-only age value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 */
export const AgeValue: FC<AgeValue.Props> = ({ age, ...props }) => {
	const hasAge = age != null;
	return (
		<LabelValue
			data-ui={"AgeValue[LabelValue]"}
			textLabel={translator.text("Listing age (label)")}
			textValue={hasAge ? translator.text(`Age ${age} (label)`) : null}
			textEmpty={translator.text("Age not selected")}
			textHint={translator.text("Listing age (hint)")}
			wrapperProps={{
				"data-ui-tone": hasAge ? "neutral" : "secondary",
			}}
			{...props}
		/>
	);
};
