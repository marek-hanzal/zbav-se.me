import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace EmptyPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const EmptyPending: FC<EmptyPending.Props> = (props) => {
	return <SpinnerContainer {...props} />;
};
