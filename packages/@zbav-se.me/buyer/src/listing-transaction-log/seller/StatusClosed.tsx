import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { StatusEvent } from "../StatusEvent";

export namespace StatusClosed {
	export interface Props extends StatusEvent.Props {
		listingTransactionLog: tListingTransactionLog;
	}
}

export const StatusClosed: FC<StatusClosed.Props> = (props) => {
	return (
		<StatusEvent
			ui={"Buyer-Seller-StatusClosed-root"}
			{...props}
		/>
	);
};
