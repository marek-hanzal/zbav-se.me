import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";
import { StatusEvent } from "../../common/StatusEvent";

export namespace StatusAccepted {
	export interface Props extends StatusEvent.Props {
		listingTransactionLog: tListingTransactionLog;
	}
}

export const StatusAccepted: FC<StatusAccepted.Props> = (props) => {
	return <StatusEvent {...props} />;
};
