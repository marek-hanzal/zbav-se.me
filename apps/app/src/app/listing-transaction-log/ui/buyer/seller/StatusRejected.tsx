import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { StatusEvent } from "../../common/StatusEvent";

export namespace StatusRejected {
	export interface Props extends StatusEvent.Props {
		listingTransactionLog: tListingTransactionLog;
	}
}

export const StatusRejected: FC<StatusRejected.Props> = (props) => {
	return (
		<StatusEvent
			ui={"Buyer-Seller-StatusRejected-root"}
			tone={"danger"}
			{...props}
		/>
	);
};
