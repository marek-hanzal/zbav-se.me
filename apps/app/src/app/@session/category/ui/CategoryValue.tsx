import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { CategoryInline } from "./CategoryInline";

export namespace CategoryValue {
	export interface Props extends LabelValue.PropsEx {
		categoryId: string | undefined | null;
	}
}

export const CategoryValue: FC<CategoryValue.Props> = ({ categoryId, ...props }) => {
	return (
		<LabelValue
			data-ui={"CategoryValue[LabelValue]"}
			textLabel={translator.text("Listing category (label)")}
			textValue={
				categoryId ? (
					<CategoryInline
						categoryId={categoryId}
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
