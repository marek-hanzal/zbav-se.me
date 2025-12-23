import { Icon } from "@use-pico/client/icon";
import { RatingToIcon } from "@zbav-se.me/ui/rating";
import type { FC } from "react";

export namespace ConditionIcon {
	export interface Props extends Icon.PropsEx {
		condition: number | string;
	}
}

export const ConditionIcon: FC<ConditionIcon.Props> = ({ condition, ui, ...props }) => {
	return (
		<Icon
			icon={RatingToIcon[Number(condition) as RatingToIcon.Value]}
			ui={{
				text: "2xl",
				...ui,
			}}
			{...props}
		/>
	);
};
