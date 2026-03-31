import type { FC } from "react";
import { SpinnerContainer } from "@/lib/client/spinner";

export namespace HistoryPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const HistoryPending: FC<HistoryPending.Props> = (props) => {
	return <SpinnerContainer {...props} />;
};
