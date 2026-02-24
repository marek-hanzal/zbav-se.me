import { Icon, SpinnerIcon } from "@use-pico/client/icon";
import type { FC } from "react";

export namespace ListingCountBadgeValuePending {
	export interface Props extends Icon.PropsEx {
		//
	}
}

export const ListingCountBadgeValuePending: FC<ListingCountBadgeValuePending.Props> = (props) => {
	return (
		<Icon
			icon={SpinnerIcon}
			{...props}
		/>
	);
};
