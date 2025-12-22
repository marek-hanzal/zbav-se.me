import type { useSelection } from "@use-pico/client/hook";
import type { Container } from "@use-pico/client/ui/container";
import { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { conditionHint, conditionLabel } from "~/app/condition/util/conditionLabel";

export namespace ConditionSelect {
	export interface Props extends Container.Props {
		selection: useSelection.Selection<Rating.RatingItem>;
	}
}

export const ConditionSelect: FC<ConditionSelect.Props> = ({ selection, ui, ...props }) => {
	return (
		<Rating
			data-ui="ConditionSelect[Rating]"
			textLabel={conditionLabel}
			textHint={conditionHint}
			selection={selection}
			ui={{
				...ui,
			}}
			{...props}
		/>
	);
};
