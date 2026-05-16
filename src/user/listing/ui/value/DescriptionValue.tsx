import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { LabelValue } from "@/lib/client/value";

export namespace DescriptionValue {
	export interface Props extends LabelValue.PropsEx {
		description: string | null | undefined;
	}
}

/**
 * Renders a read-only description value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 */
export const DescriptionValue: FC<DescriptionValue.Props> = ({ description, ...props }) => {
	const translator = useTranslator();
	const hasDescription = description != null && description !== "";
	return (
		<LabelValue
			data-ui={"DescriptionValue"}
			textLabel={translator.text("Description (title)")}
			textValue={hasDescription ? description : null}
			textEmpty={translator.text("Description not filled")}
			{...props}
		/>
	);
};
