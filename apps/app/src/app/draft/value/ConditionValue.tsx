import { EditIcon, Icon } from "@use-pico/client/icon";
import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace ConditionValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		draft: tDraft;
	}
}

export const ConditionValue: FC<ConditionValue.Props> = ({ draft, ...props }) => {
	return (
		<LabelValue
			data-ui={"ConditionValue[LabelValue]"}
			wrapperProps={{
				ui: {
					tone: draft.condition ? "neutral" : "primary",
				},
			}}
			action={
				<Icon
					icon={EditIcon}
					ui={{
						text: "xl",
					}}
				/>
			}
			textLabel={translator.text("Listing condition (label)")}
			textValue={
				draft.condition
					? translator.text(`Condition - Overall [${draft.condition}] (hint)`)
					: null
			}
			textEmpty={translator.text("Condition not selected")}
			{...props}
		/>
	);
};
