import { LabelValue } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace TitleValue {
	export interface Props extends Omit<LabelValue.PropsEx, "textValue" | "title"> {
		title: string | null;
	}
}

export const TitleValue: FC<TitleValue.Props> = ({ title, ...props }) => {
	const hasTitle = title != null && title !== "";
	return (
		<LabelValue
			data-ui={"TitleValue[LabelValue]"}
			textValue={hasTitle ? title : null}
			wrapperProps={{
				ui: {
					tone: hasTitle ? "neutral" : "primary",
				},
			}}
			{...props}
		/>
	);
};
