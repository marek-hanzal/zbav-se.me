import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace NameValue {
	export interface Props extends LabelValue.PropsEx {
		name: string | null;
	}
}

/**
 * Renders a read-only name value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
 */
export const NameValue: FC<NameValue.Props> = ({ name, ...props }) => {
	return (
		<LabelValue
			data-ui={"NameValue[LabelValue]"}
			textLabel={translator.text("Feed name (label)")}
			textValue={name}
			wrapperProps={{
				ui: name
					? {
							tone: "neutral",
							theme: "light",
						}
					: undefined,
			}}
			{...props}
		/>
	);
};
