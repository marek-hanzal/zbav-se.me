import type { FC } from "react";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";

export namespace HistoryPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const HistoryPending: FC<HistoryPending.Props> = (props) => {
	return <SpinnerContainer {...props} />;
};
