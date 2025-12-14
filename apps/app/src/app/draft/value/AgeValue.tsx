import { EditIcon, Icon } from "@use-pico/client/icon";
import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace AgeValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		draft: tDraft;
	}
}

export const AgeValue: FC<AgeValue.Props> = ({ draft, ...props }) => {
	return (
		<LabelValue
			data-ui={"AgeValue[LabelValue]"}
			wrapperProps={{
				ui: {
					tone: draft.age ? "neutral" : "primary",
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
			textLabel={translator.text("Listing age (label)")}
			textValue={draft.age ? translator.text(`Condition - Age [${draft.age}] (hint)`) : null}
			textEmpty={translator.text("Age not selected")}
			textHint={translator.text("Listing age (hint)")}
			{...props}
		/>
	);
};
