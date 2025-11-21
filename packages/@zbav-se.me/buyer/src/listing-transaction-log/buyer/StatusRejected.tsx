import { StatusEvent } from "@zbav-se.me/buyer/listing-transaction-log";
import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace StatusRejected {
	export interface Props extends StatusEvent.Props {
		listingTransactionLog: tListingTransactionLog;
	}
}

export const StatusRejected: FC<StatusRejected.Props> = (props) => {
	return (
		<StatusEvent
			ui={"Buyer-Buyer-StatusRejected-root"}
			{...props}
		/>
	);
};
