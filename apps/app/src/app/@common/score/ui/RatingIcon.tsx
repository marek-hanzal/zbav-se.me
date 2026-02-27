import { Icon } from "@use-pico/client/icon";
import { RatingToIcon } from "@zbav-se.me/ui/rating";
import type { FC } from "react";

export namespace RatingIcon {
	export interface Props extends Icon.PropsEx {
		rating: number | string;
	}
}

export const RatingIcon: FC<RatingIcon.Props> = ({ rating, ui, ...props }) => {
	const value = Number(rating);

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
