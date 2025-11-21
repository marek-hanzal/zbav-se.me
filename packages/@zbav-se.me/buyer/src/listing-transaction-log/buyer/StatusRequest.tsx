import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { StatusEvent } from "../StatusEvent";

export namespace StatusRequest {
	export interface Props extends StatusEvent.Props {
		listingTransactionLog: tListingTransactionLog;
	}
}

export const StatusRequest: FC<StatusRequest.Props> = (props) => {
	return (
		<StatusEvent
			ui={"Buyer-Buyer-StatusRequest-root"}
			{...props}
		/>
	);
};
