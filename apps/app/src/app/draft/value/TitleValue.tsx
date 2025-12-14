import { EditIcon, Icon } from "@use-pico/client/icon";
import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace TitleValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		draft: tDraft;
	}
}

export const TitleValue: FC<TitleValue.Props> = ({ draft, ...props }) => {
	return (
		<LabelValue
			data-ui={"TitleValue[LabelValue]"}
			wrapperProps={{
				ui: {
					tone: draft.title ? "neutral" : "primary",
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
			textLabel={translator.text("Listing title (label)")}
			textValue={draft.title ?? null}
			textEmpty={translator.text("Listing title not filled")}
			{...props}
		/>
	);
};
