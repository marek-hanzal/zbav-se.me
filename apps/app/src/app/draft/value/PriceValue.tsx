import { EditIcon, Icon } from "@use-pico/client/icon";
import { LabelValue } from "@use-pico/client/ui/container";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace PriceValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
        draft: tDraft;
		locale: string;
	}
}

export const PriceValue: FC<PriceValue.Props> = ({ draft, locale, ...props }) => {
	return (
		<LabelValue
			data-ui={"PriceValue[LabelValue]"}
			wrapperProps={{
				ui: {
					tone: draft.price && draft.currency ? "neutral" : "primary",
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
			textLabel={translator.text("Price (title)")}
			textValue={
				draft.price && draft.currency ? (
					<PriceInline
						price={draft.price}
						locale={locale}
						currency={draft.currency}
					/>
				) : null
			}
			textEmpty={translator.text("Price not set")}
			{...props}
		/>
	);
};
