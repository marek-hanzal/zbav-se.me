import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace HistoryPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const HistoryPending: FC<HistoryPending.Props> = (props) => {
	return <SpinnerContainer {...props} />;
};
