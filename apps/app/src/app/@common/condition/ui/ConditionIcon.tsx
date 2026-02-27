import type { FC } from "react";
import { RatingIcon } from "~/app/@common/score/ui/RatingIcon";

export namespace ConditionIcon {
	export interface Props extends Omit<RatingIcon.Props, "rating"> {
		condition: number | string;
	}
}

export const ConditionIcon: FC<ConditionIcon.Props> = ({ condition, ui, ...props }) => {
	return <RatingIcon rating={condition} ui={ui} {...props} />;
};
