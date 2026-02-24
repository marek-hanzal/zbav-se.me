import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace ListingListContentPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const ListingListContentPending: FC<ListingListContentPending.Props> = (props) => {
	return <SpinnerContainer {...props} />;
};
