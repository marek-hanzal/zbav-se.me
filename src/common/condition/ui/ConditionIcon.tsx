import type { FC } from "react";
import { RatingIcon } from "~/common/score/ui/RatingIcon";

export namespace ConditionIcon {
	export interface Props extends Omit<RatingIcon.Props, "rating"> {
		condition: number | string;
	}
}

/**
 * Maps condition input data to a visual icon variant used across the app.
 * Use it anywhere you need compact visual signaling for condition state or quality.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const ConditionIcon: FC<ConditionIcon.Props> = ({ condition, ...props }) => {
	return (
		<RatingIcon
			rating={condition}
			{...props}
		/>
	);
};
