import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { LabelValue } from "@/lib/client/value";

export namespace DescriptionValue {
	export interface Props extends LabelValue.PropsEx {
		description: string | null | undefined;
	}
}

/**
 * Renders a read-only description value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
 */
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
