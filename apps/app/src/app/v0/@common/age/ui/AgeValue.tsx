import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace AgeValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		age: number | null | undefined;
	}
}

export const AgeValue: FC<AgeValue.Props> = ({ age, ...props }) => {
	const hasAge = age != null;
	return (
		<LabelValue
			data-ui={"AgeValue[LabelValue]"}
			textLabel={translator.text("Listing age (label)")}
			textValue={hasAge ? translator.text(`Condition - Age [${age}] (hint)`) : null}
			textEmpty={translator.text("Age not selected")}
			textHint={translator.text("Listing age (hint)")}
			{...props}
		/>
	);
};
