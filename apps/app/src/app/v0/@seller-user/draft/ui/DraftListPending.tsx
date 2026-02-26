import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace DraftListPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const DraftListPending: FC<DraftListPending.Props> = (props) => {
	return <SpinnerContainer {...props} />;
};
