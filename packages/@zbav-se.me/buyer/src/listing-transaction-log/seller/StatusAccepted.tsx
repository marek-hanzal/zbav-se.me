import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { StatusEvent } from "../StatusEvent";

export namespace StatusAccepted {
	export interface Props extends StatusEvent.Props {
		listingTransactionLog: tListingTransactionLog;
	}
}

export const StatusAccepted: FC<StatusAccepted.Props> = (props) => {
	return (
		<StatusEvent
			ui={"Buyer-Seller-StatusAccepted-root"}
			{...props}
		/>
	);
};
