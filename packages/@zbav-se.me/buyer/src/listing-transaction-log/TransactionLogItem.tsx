import type { Container } from "@use-pico/client/ui/container";
import { StatusComponent } from "@zbav-se.me/buyer/listing-transaction-log";
import type {
	tListingTransactionLog,
	tListingTransactionSideEnum,
	tListingTransactionStatusEnum,
} from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace TransactionLogItem {
	export interface Props extends Container.Props {
		locale: string;
		listingTransactionLog: tListingTransactionLog;
	}
}

export const TransactionLogItem: FC<TransactionLogItem.Props> = ({
	locale,
	listingTransactionLog,
	...props
}) => {
	const key = match<
		[
			tListingTransactionSideEnum,
			tListingTransactionStatusEnum,
		],
		StatusComponent.State
	>([
		listingTransactionLog.side,
		listingTransactionLog.status,
	])
		// Buyer actions
		.with(
			[
				"buyer",
				"request",
			],
			() => "buyer.request",
		)
		.with(
			[
				"buyer",
				"accepted",
			],
			() => "invalid",
		)
		.with(
			[
				"buyer",
				"rejected",
			],
			() => "buyer.rejected",
		)
		.with(
			[
				"buyer",
				"success",
			],
			() => "buyer.success",
		)
		// Seller actions
		.with(
			[
				"seller",
				"request",
			],
			() => "invalid",
		)
		.with(
			[
				"seller",
				"accepted",
			],
			() => "seller.accepted",
		)
		.with(
			[
				"seller",
				"rejected",
			],
			() => "seller.rejected",
		)
		.with(
			[
				"seller",
				"success",
			],
			() => "seller.success",
		)
		.with(
			[
				"seller",
				"closed",
			],
			() => "seller.closed",
		)
		.otherwise(() => "common");

	const Component = StatusComponent[key];

	return (
		<Component
			locale={locale}
			listingTransactionLog={listingTransactionLog}
			{...props}
		/>
	);
};
