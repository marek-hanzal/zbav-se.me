import { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";

export namespace AgeSelection {
	export interface Props extends Rating.Props {
		//
	}
}

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
