import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace TransactionListContainerPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const TransactionListContainerPending: FC<TransactionListContainerPending.Props> = (
	props,
) => {
	return <SpinnerContainer {...props} />;
};
