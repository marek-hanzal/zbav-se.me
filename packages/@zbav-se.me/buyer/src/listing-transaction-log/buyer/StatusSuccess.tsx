import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { StatusEvent } from "../StatusEvent";

export namespace StatusSuccess {
	export interface Props extends StatusEvent.Props {
		listingTransactionLog: tListingTransactionLog;
	}
}

export const StatusSuccess: FC<StatusSuccess.Props> = (props) => {
	return (
		<StatusEvent
			ui={"Buyer-Buyer-StatusSuccess-root"}
			{...props}
		/>
	);
};
