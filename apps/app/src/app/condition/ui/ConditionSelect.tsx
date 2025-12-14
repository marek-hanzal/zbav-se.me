import type { useSelection } from "@use-pico/client/hook";
import type { Container } from "@use-pico/client/ui/container";
import { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";

export namespace ConditionSelect {
	export interface Props extends Container.Props {
		selection: useSelection.Selection<Rating.RatingItem>;
	}
}

export const ConditionSelect: FC<ConditionSelect.Props> = ({ selection, ui, ...props }) => {
	return (
		<Rating
			data-ui="ConditionSelect[Rating]"
			textHint={(value) => `Condition - Overall [${value}] (hint)`}
			selection={selection}
			ui={{
				...ui,
			}}
			{...props}
		/>
	);
};
