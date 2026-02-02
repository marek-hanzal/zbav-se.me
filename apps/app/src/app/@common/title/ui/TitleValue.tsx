import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace TitleValue {
	export interface Props extends Omit<LabelValue.Props, "textValue" | "title"> {
		title: string | null | undefined;
	}
}

export const TitleValue: FC<TitleValue.Props> = ({ title, ...props }) => {
	const hasTitle = title != null && title !== "";
	return (
		<LabelValue
			data-ui={"TitleValue[LabelValue]"}
			wrapperProps={{
				ui: {
					tone: hasTitle ? "neutral" : "primary",
				},
			}}
			textLabel={translator.text("Listing title (label)")}
			textValue={hasTitle ? title : null}
			textEmpty={translator.text("Listing title not filled")}
			{...props}
		/>
	);
};
