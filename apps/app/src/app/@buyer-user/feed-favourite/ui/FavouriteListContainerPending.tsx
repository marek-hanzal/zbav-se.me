import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace FavouriteListContainerPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const FavouriteListContainerPending: FC<FavouriteListContainerPending.Props> = (props) => {
	return <SpinnerContainer {...props} />;
};
