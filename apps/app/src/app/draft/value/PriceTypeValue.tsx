import { EditIcon, Icon } from "@use-pico/client/icon";
import { LabelValue } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace PriceTypeValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		draft: tDraft;
	}
}

export const PriceTypeValue: FC<PriceTypeValue.Props> = ({ draft, ...props }) => {
	return (
		<LabelValue
			data-ui={"PriceTypeValue[LabelValue]"}
			wrapperProps={{
				ui: {
					tone: draft.priceType ? "neutral" : "primary",
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
			textLabel={translator.text("Price type (title)")}
			textValue={draft.priceType ? <Tx label={`Listing price - ${draft.priceType}`} /> : null}
			textEmpty={translator.text("Price type not set")}
			{...props}
		/>
	);
};
