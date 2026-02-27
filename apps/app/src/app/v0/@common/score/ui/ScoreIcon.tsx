import { Icon } from "@use-pico/client/icon";
import { RatingToIcon } from "@zbav-se.me/ui/rating";
import type { FC } from "react";

export namespace ScoreIcon {
	export interface Props extends Icon.PropsEx {
		score: number | string;
	}
}

export const ScoreIcon: FC<ScoreIcon.Props> = ({ score, ui, ...props }) => {
	const value = Number(score);

	return (
		<Icon
			icon={RatingToIcon[value as RatingToIcon.Value]}
			ui={{
				text: "2xl",
				...ui,
			}}
			{...props}
		/>
	);
};
