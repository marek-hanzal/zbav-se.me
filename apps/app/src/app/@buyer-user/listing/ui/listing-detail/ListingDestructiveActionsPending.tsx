import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace ListingDestructiveActionsPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const ListingDestructiveActionsPending: FC<ListingDestructiveActionsPending.Props> = (
	props,
) => {
	return <SpinnerContainer {...props} />;
};
