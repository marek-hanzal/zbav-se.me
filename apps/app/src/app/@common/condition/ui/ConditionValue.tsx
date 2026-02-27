import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace ConditionValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		condition: number | null | undefined;
	}
}

export const ConditionValue: FC<ConditionValue.Props> = ({ condition, ...props }) => {
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
