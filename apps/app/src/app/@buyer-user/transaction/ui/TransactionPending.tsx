import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace TransactionPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const TransactionPending: FC<TransactionPending.Props> = (props) => {
	return <SpinnerContainer {...props} />;
};
