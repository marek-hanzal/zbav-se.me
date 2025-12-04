import type { tListingTransactionStatus, tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import type { useSideSwitch } from "~/app/listing-transaction/ui/useSideSwitch";
import { AcceptedEvent } from "./AcceptedEvent";
import { RejectedEvent } from "./RejectedEvent";
import { RequestEvent } from "./RequestEvent";

export namespace StatusSwitchEvent {
	export interface Props {
		locale: string;
		side: tUserSideEnum;
		type: useSideSwitch.Type;
		listingTransactionStatus: tListingTransactionStatus;
		isCurrent: boolean;
		isClosed: boolean;
	}
}

export const StatusSwitchEvent: FC<StatusSwitchEvent.Props> = ({
	locale,
	side,
	type,
	listingTransactionStatus,
	isCurrent,
	isClosed,
}) => {
	return match(listingTransactionStatus.status)
		.with("request", () => {
			return (
				<RequestEvent
					locale={locale}
					side={side}
					actor={listingTransactionStatus.side}
					type={type}
					timestamp={listingTransactionStatus.createdAt}
					isCurrent={isCurrent}
					isClosed={isClosed}
				/>
			);
		})
		.with("accepted", () => {
			return (
				<AcceptedEvent
					locale={locale}
					side={side}
					actor={listingTransactionStatus.side}
					type={type}
					timestamp={listingTransactionStatus.createdAt}
					isCurrent={isCurrent}
					isClosed={isClosed}
				/>
			);
		})
		.with("rejected", () => {
			return (
				<RejectedEvent
					locale={locale}
					side={side}
					actor={listingTransactionStatus.side}
					type={type}
					timestamp={listingTransactionStatus.createdAt}
					isCurrent={isCurrent}
					isClosed={isClosed}
				/>
			);
		})
		.with("closed", "expired", "success", () => {
			return "not-yet";
		})
		.exhaustive();
};
