import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace TransactionListingListPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const TransactionListingListPending: FC<TransactionListingListPending.Props> = (props) => {
	return <SpinnerContainer {...props} />;
};
