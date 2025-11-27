import type { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";

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
			tone={"unset"}
			theme={"unset"}
			{...props}
		>
			<Rating
				textHint={(value) => `Condition - Age [${value}] (hint)`}
				selection={selection}
			/>
		</Container>
	);
};
