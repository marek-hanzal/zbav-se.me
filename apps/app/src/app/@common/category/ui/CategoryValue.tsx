import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tCategory } from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";
import { CategoryInline } from "./CategoryInline";

export namespace CategoryValue {
	export interface Props extends LabelValue.PropsEx {
		category: tCategory | null;
	}
}

export const CategoryValue: FC<CategoryValue.Props> = ({ category, ...props }) => {
	return (
		<LabelValue
			data-ui={"CategoryValue[LabelValue]"}
			textLabel={translator.text("Listing category (label)")}
			textValue={
				category ? (
					<CategoryInline
						category={category}
						ui={{
							tone: "secondary",
							theme: "light",
						}}
					/>
				) : null
			}
			textEmpty={translator.text("Listing category not selected")}
			{...props}
		/>
	);
};
