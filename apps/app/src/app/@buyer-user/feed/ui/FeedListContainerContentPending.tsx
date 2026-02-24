import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace FeedListContainerContentPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const FeedListContainerContentPending: FC<FeedListContainerContentPending.Props> = (
	props,
) => {
	return <SpinnerContainer {...props} />;
};
