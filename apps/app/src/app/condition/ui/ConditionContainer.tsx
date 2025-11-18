import type { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { FC } from "react";
import { Rating } from "~/app/ui/rating/Rating";

export namespace ConditionContainer {
	export interface Props extends Container.Props {
		selection: useSelection.Selection<Rating.RatingItem>;
	}
}

export const ConditionContainer: FC<ConditionContainer.Props> = ({ selection, ...props }) => {
	return (
		<Container
			scroll={"vertical"}
			height={"fit"}
			width={"fit"}
			{...props}
		>
			<Rating
				textHint={(value) => `Condition - Overall [${value}] (hint)`}
				selection={selection}
			/>
		</Container>
	);
};
