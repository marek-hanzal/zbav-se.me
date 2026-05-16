import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { LabelValue } from "@/lib/client/value";

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
	const translator = useTranslator();
	const hasAge = age != null;
	return (
		<LabelValue
			data-ui={"AgeValue"}
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
