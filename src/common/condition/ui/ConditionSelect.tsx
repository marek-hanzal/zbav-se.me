import type { FC } from "react";
import { Rating } from "~/common/ui/rating";

export namespace ConditionSelect {
	export interface Props extends Rating.Props {
		//
	}
}

/**
 * Provides an interactive control for selecting condition values in forms.
 * Use it in editors where users need to choose or update condition before saving.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const ConditionSelect: FC<ConditionSelect.Props> = (props) => {
	return (
		<Rating
			data-ui="ConditionSelect[Rating]"
			textRatingFn={(rating) => `Condition ${rating} (label)`}
			textHintFn={(rating) => `Condition ${rating} (hint)`}
			{...props}
		/>
	);
};
