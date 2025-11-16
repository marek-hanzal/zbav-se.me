import type { Container } from "@use-pico/client/ui/container";
import type { tListingTransactionLog, tUserSide } from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";
import { match } from "ts-pattern";
import { StatusAccepted } from "~/app/listing-transaction-log/ui/buyer/status/StatusAccepted";
import { StatusRequest } from "~/app/listing-transaction-log/ui/buyer/status/StatusRequest";

export namespace TransactionLogItem {
	export interface Props extends Container.Props {
		side: tUserSide;
		listingTransactionLog: tListingTransactionLog;
	}
}

export const TransactionLogItem: FC<TransactionLogItem.Props> = ({
	side,
	listingTransactionLog,
	...props
}) => {
	/**
	 * For who this item is for?
	 *
	 * Current user - either buyer or seller
	 */
	return match(side)
		.with("buyer", () => {
			/**
			 * Who submitted this transaction item?
			 */
			return match(listingTransactionLog.side)
				.with("buyer", () => {
					return match(listingTransactionLog.status)
						.with("request", () => {
							return <StatusRequest listingTransactionLog={listingTransactionLog} />;
						})
						.with("accepted", () => {
							return <StatusAccepted listingTransactionLog={listingTransactionLog} />;
						})
						.exhaustive();
				})
				.with("seller", () => {
					return null;
				})
				.with("transaction", "system", "unknown", () => {
					return null;
				})
				.exhaustive();
		})
		.with("seller", () => {
			/**
			 * Who submitted this transaction item?
			 */
			return match(listingTransactionLog.side)
				.with("buyer", () => {
					return "bb";
				})
				.with("seller", () => {
					return "";
				})
				.with("transaction", "system", "unknown", () => {
					return "transaction";
				})
				.exhaustive();
		})
		.exhaustive();
};
