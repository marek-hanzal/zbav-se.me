import { EditIcon, Icon } from "@use-pico/client/icon";
import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace DescriptionValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		draft: tDraft;
	}
}

export const DescriptionValue: FC<DescriptionValue.Props> = ({ draft, ...props }) => {
	return (
		<LabelValue
			data-ui={"DescriptionValue[LabelValue]"}
			wrapperProps={{
				ui: {
					tone: draft.description ? "neutral" : "secondary",
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
			textLabel={translator.text("Description (title)")}
			textValue={draft.description ?? null}
			textEmpty={translator.text("Description not filled")}
			{...props}
		/>
	);
};
