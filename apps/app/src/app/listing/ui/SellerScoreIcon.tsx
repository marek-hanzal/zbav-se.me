import { Icon } from "@use-pico/client/icon";
import { RatingToIcon } from "@zbav-se.me/ui/rating";
import type { FC } from "react";

export namespace SellerScoreIcon {
	export interface Props extends Icon.PropsEx {
		score: number | string;
	}
}

export const SellerScoreIcon: FC<SellerScoreIcon.Props> = ({ score, ui, ...props }) => {
	const scoreNumber = Number(score);

	return (
		<Icon
			icon={RatingToIcon[scoreNumber as RatingToIcon.Value]}
			ui={{
				text: "2xl",
				...ui,
			}}
			{...props}
		/>
	);
};
