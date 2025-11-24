import type { tListingTransactionStatus } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { EventBadge } from "./EventBadge";

export namespace StatusEventBadge {
	export interface Props extends Omit<EventBadge.Props, "actor"> {
		listingTransactionStatus: tListingTransactionStatus;
	}

	export type PropsEx = Omit<EventBadge.PropsEx, "actor"> & {
		listingTransactionStatus: tListingTransactionStatus;
	};
}

export const StatusEventBadge: FC<StatusEventBadge.Props> = ({ ...props }) => {
	return (
		<EventBadge
			actor={props.listingTransactionStatus.side}
			{...props}
		/>
	);
};
