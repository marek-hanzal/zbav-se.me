import {
	type tListingTransactionLog,
	type tUserSideEnum,
	zListingTransactionMessage,
	zListingTransactionStatus,
} from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { useSideSwitch } from "../listing-transaction/useSideSwitch";
import { MessageEvent } from "./event/MessageEvent";
import { StatusSwitchEvent } from "./event/StatusSwitchEvent";
import type { TransactionLogList } from "./TransactionLogList";

export namespace TransactionLogItem {
	export interface Props {
		locale: string;
		side: tUserSideEnum;
		listingTransactionLog: tListingTransactionLog;
		isCurrent: boolean;
		isClosed: boolean;
		components: TransactionLogList.Components;
	}
}

export const TransactionLogItem: FC<TransactionLogItem.Props> = ({
	locale,
	side,
	listingTransactionLog,
	isCurrent,
	isClosed,
	components,
}) => {
	const { type } = useSideSwitch({
		actor: listingTransactionLog.side,
		side,
	});

	return match(listingTransactionLog.event)
		.with("status", () => {
			const status = zListingTransactionStatus.parse(listingTransactionLog);

			return (
				<StatusSwitchEvent
					locale={locale}
					side={side}
					type={type}
					listingTransactionStatus={status}
					isCurrent={isCurrent}
					isClosed={isClosed}
					components={components}
				/>
			);
		})
		.with("message", () => {
			const message = zListingTransactionMessage.parse(listingTransactionLog);

			return (
				<MessageEvent
					locale={locale}
					side={side}
					type={type}
					message={message}
					isCurrent={isCurrent}
					isClosed={isClosed}
				/>
			);
		})
		.with("gallery", "location", () => {
			return "not-yet";
		})
		.exhaustive();
};
