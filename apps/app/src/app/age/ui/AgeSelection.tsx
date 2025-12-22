import type { useSelection } from "@use-pico/client/hook";
import type { Container } from "@use-pico/client/ui/container";
import { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";

export namespace AgeSelection {
	export interface Props extends Container.Props {
		selection: useSelection.Selection<Rating.RatingItem>;
	}
}

export const AgeSelection: FC<AgeSelection.Props> = ({ selection, ui, ...props }) => {
	return (
		<Rating
			data-ui="AgeSelection[Rating]"
			textLabel={(value) => `Condition - Age [${value}] (hint)`}
			selection={selection}
			ui={{
				...ui,
			}}
			{...props}
		/>
	);
};
