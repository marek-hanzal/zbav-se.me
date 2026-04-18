import type { FC } from "react";
import { Icon } from "@/lib/client/icon";
import { RatingToIcon } from "~/common/ui/rating";

export namespace RatingIcon {
	export interface Props extends Icon.PropsEx {
		rating: number | string;
	}
}

/**
 * Maps rating input data to a visual icon variant used across the app.
 * Use it anywhere you need compact visual signaling for rating state or quality.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const RatingIcon: FC<RatingIcon.Props> = ({ rating, ...props }) => {
	const value = Number(rating);

	return (
		<Icon
			icon={RatingToIcon[value as RatingToIcon.Value]}
			data-ui-text="2xl"
			{...props}
		/>
	);
};
