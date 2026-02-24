import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace SellerInfoPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const SellerInfoPending: FC<SellerInfoPending.Props> = (props) => {
	return <SpinnerContainer {...props} />;
};
