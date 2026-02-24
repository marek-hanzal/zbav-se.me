import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace ListContainerPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const ListContainerPending: FC<ListContainerPending.Props> = (props) => {
	return <SpinnerContainer {...props} />;
};
