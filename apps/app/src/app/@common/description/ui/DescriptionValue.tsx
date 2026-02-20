import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace DescriptionValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		description: string | null | undefined;
	}
}

export const DescriptionValue: FC<DescriptionValue.Props> = ({ description, ...props }) => {
	const hasDescription = description != null && description !== "";
	return (
		<LabelValue
			data-ui={"DescriptionValue[LabelValue]"}
			textLabel={translator.text("Description (title)")}
			textValue={hasDescription ? description : null}
			textEmpty={translator.text("Description not filled")}
			{...props}
		/>
	);
};
