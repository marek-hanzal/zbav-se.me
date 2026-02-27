import { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";

export namespace ConditionSelect {
	export interface Props extends Rating.Props {
		//
	}
}

/**
 * Provides an interactive control for selecting condition values in forms.
 * Use it in editors where users need to choose or update condition before saving.
 *
 * @see apps/app/src/app/@seller-user/draft/ui/DraftEditor/DraftEditor.tsx
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
