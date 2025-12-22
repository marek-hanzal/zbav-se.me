import { EditIcon, Icon } from "@use-pico/client/icon";
import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import { RatingToIcon } from "@zbav-se.me/ui/rating";
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
					tone: draft.condition ? "neutral" : "secondary",
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
			textHint={translator.text("Listing condition (hint)")}
			textValue={
				draft.condition ? (
					<Icon
						icon={RatingToIcon[draft.condition as RatingToIcon.Value]}
						ui={{
							text: "2xl",
						}}
					/>
				) : null
			}
			textEmpty={translator.text("Condition not selected")}
			{...props}
		/>
	);
};
