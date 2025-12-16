import { EditIcon, Icon } from "@use-pico/client/icon";
import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { CategoryInline } from "~/app/category/ui/CategoryInline";

export namespace CategoryValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		draft: tDraft;
	}
}

export const CategoryValue: FC<CategoryValue.Props> = ({ draft, ...props }) => {
	return (
		<LabelValue
			data-ui={"CategoryValue[LabelValue]"}
			{...props}
			wrapperProps={{
				ui: {
					tone: draft.category ? "neutral" : "primary",
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
			textLabel={translator.text("Listing category (label)")}
			textValue={
				draft.category ? (
					<CategoryInline
						category={draft.category}
						tone="secondary"
						theme="light"
					/>
				) : null
			}
			textEmpty={translator.text("Listing category not selected")}
		/>
	);
};
