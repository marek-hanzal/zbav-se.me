import type { FC } from "react";
import { useTranslator } from "~/translation/hook/useTranslator";
import { LabelValue } from "~/ui/ui/LabelValue";

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
			textLabel={translator.textFn("Listing condition (label)")}
			textHint={translator.textFn("Listing condition (hint)")}
			textValue={hasCondition ? translator.textFn(`Condition ${condition} (label)`) : null}
			textEmpty={translator.textFn("Condition not selected")}
			{...props}
		/>
	);
};
