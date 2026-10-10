import type { FC } from "react";
import { useTranslator } from "~/translation/hook/useTranslator";
import { LabelValue } from "~/ui/ui/LabelValue";

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
			textLabel={translator.textFn("Listing age (label)")}
			textValue={hasAge ? translator.textFn(`Age ${age} (label)`) : null}
			textEmpty={translator.textFn("Age not selected")}
			textHint={translator.textFn("Listing age (hint)")}
			{...props}
		/>
	);
};
