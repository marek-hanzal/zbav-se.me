import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace BuyerInfoPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const BuyerInfoPending: FC<BuyerInfoPending.Props> = (props) => {
	return <SpinnerContainer {...props} />;
};
