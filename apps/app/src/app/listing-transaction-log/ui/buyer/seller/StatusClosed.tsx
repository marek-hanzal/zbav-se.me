import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";
import { StatusEvent } from "../../common/StatusEvent";

export namespace StatusClosed {
	export interface Props extends StatusEvent.Props {
		listingTransactionLog: tListingTransactionLog;
	}
}

export const StatusClosed: FC<StatusClosed.Props> = (props) => {
	return <StatusEvent {...props} />;
};
