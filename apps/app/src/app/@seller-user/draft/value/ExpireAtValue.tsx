import { EditIcon, Icon } from "@use-pico/client/icon";
import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import type { FC } from "react";

export namespace ExpireAtValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		draft: tDraft;
	}
}

export const ExpireAtValue: FC<ExpireAtValue.Props> = ({ draft, ...props }) => {
	return (
		<LabelValue
			data-ui={"ExpireAtValue[LabelValue]"}
			wrapperProps={{
				ui: {
					tone: draft.expiresAt ? "neutral" : "primary",
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
			textLabel={translator.text("Expire (title)")}
			textValue={draft.expiresAt ? `Expire in ${draft.expiresAt}` : null}
			textEmpty={translator.text("Expiration date not set")}
			textHint={translator.text("Draft expire (hint)")}
			{...props}
		/>
	);
};
