import { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";

export namespace ConditionSelect {
	export interface Props extends Rating.Props {
		//
	}
}

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
