import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { LabelValue } from "@/lib/client/value";

export namespace ConditionValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		condition: number | null | undefined;
	}
}

/**
 * Renders a read-only condition value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 */
export const ConditionValue: FC<ConditionValue.Props> = ({ condition, ...props }) => {
	const translator = useTranslator();
	const hasCondition = condition != null;
	return (
		<LabelValue
			data-ui={"ConditionValue[LabelValue]"}
			textLabel={translator.text("Listing condition (label)")}
			textHint={translator.text("Listing condition (hint)")}
			textValue={hasCondition ? translator.text(`Condition ${condition} (label)`) : null}
			textEmpty={translator.text("Condition not selected")}
			{...props}
		/>
	);
};
