import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { StatusEvent } from "~/app/listing-transaction-log/ui/common/StatusEvent";

export namespace StatusRequest {
	export interface Props extends StatusEvent.Props {
		listingTransactionLog: tListingTransactionLog;
	}
}

export const StatusRequest: FC<StatusRequest.Props> = (props) => {
	return <StatusEvent {...props} />;
};
