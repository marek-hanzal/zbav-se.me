import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace ListingItemPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const ListingItemPending: FC<ListingItemPending.Props> = (props) => {
	return (
		<SpinnerContainer
			data-ui={"ListingListContainer-[SpinnerContainer.listing-fetch]"}
			{...props}
		/>
	);
};
