import type { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { FC } from "react";
import { Rating } from "~/app/ui/rating/Rating";

export namespace AgeContainer {
	export interface Props extends Container.Props {
		selection: useSelection.Selection<Rating.RatingItem>;
	}
}

export const AgeContainer: FC<AgeContainer.Props> = ({ selection, ...props }) => {
	return (
		<Container
			scroll={"vertical"}
			height={"fit"}
			width={"fit"}
			{...props}
		>
			<Rating
				textHint={(value) => `Condition - Age [${value}] (hint)`}
				selection={selection}
			/>
		</Container>
	);
};
