import { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";

export namespace AgeSelection {
	export interface Props extends Rating.Props {
		//
	}
}

/**
 * Provides an interactive control for selecting age values in forms.
 * Use it in editors where users need to choose or update age before saving.
 *
 * @see apps/app/src/app/@seller-user/draft/ui/DraftEditor/DraftEditor.tsx
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
