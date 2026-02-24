import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace ContentItemPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const ContentItemPending: FC<ContentItemPending.Props> = (props) => {
	return (
		<SpinnerContainer
			data-ui={"MyListing-[SpinnerContainer.listing-fetch]"}
			{...props}
		/>
	);
};
