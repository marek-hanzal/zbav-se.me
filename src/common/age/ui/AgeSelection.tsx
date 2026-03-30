import type { FC } from "react";
import { Rating } from "~/common/ui/rating";

export namespace AgeSelection {
	export interface Props extends Rating.Props {
		//
	}
}

/**
 * Provides an interactive control for selecting age values in forms.
 * Use it in editors where users need to choose or update age before saving.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const AgeSelection: FC<AgeSelection.Props> = (props) => {
	return (
		<Rating
			data-ui="AgeSelection[Rating]"
			textRatingFn={(rating) => `Age ${rating} (label)`}
			textHintFn={(rating) => `Age ${rating} (hint)`}
			{...props}
		/>
	);
};
