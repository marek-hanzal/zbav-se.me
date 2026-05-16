import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { LabelValue } from "@/lib/client/value";

export namespace NameValue {
	export interface Props extends LabelValue.PropsEx {
		name: string | null;
	}
}

/**
 * Renders a read-only name value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const NameValue: FC<NameValue.Props> = ({ name, ...props }) => {
	const translator = useTranslator();
	return (
		<LabelValue
			data-ui={"NameValue[LabelValue]"}
			textLabel={translator.text("Feed name (label)")}
			textValue={name}
			wrapperProps={{
				...(name
					? {
							"data-ui-tone": "neutral",
							"data-ui-theme": "light",
						}
					: undefined),
			}}
			{...props}
		/>
	);
};
