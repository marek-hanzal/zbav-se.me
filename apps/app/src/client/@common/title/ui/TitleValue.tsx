import { LabelValue } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace TitleValue {
	export interface Props extends Omit<LabelValue.PropsEx, "title"> {
		title: string | null;
	}
}

/**
 * Renders a read-only title value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
 */
export const TitleValue: FC<TitleValue.Props> = ({ title, ...props }) => {
	const hasTitle = title != null && title !== "";
	return (
		<LabelValue
			data-ui={"TitleValue"}
			textValue={hasTitle ? title : null}
			{...props}
		/>
	);
};
