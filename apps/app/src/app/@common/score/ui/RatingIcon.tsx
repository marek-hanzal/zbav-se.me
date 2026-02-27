import { Icon } from "@use-pico/client/icon";
import { RatingToIcon } from "@zbav-se.me/ui/rating";
import type { FC } from "react";

export namespace RatingIcon {
	export interface Props extends Icon.PropsEx {
		rating: number | string;
	}
}

/**
 * Maps rating input data to a visual icon variant used across the app.
 * Use it anywhere you need compact visual signaling for rating state or quality.
 *
 * @see apps/app/src/app/@seller-user/draft/ui/DraftEditor/DraftEditor.tsx
 */
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
