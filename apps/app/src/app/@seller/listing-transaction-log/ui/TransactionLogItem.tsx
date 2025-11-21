import type { Container } from "@use-pico/client/ui/container";
import type {
	tListingTransactionLog,
	tListingTransactionSide,
	tListingTransactionStatus,
} from "@zbav-se.me/sdk/api/user";
import { StatusComponent } from "@zbav-se.me/seller/listing-transaction-log";
import type { FC } from "react";
import { match } from "ts-pattern";
import { BuyerInfoContainer } from "~/app/@seller/listing-transaction/ui/BuyerInfoContainer";

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
			tListingTransactionSide,
			tListingTransactionStatus,
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
		.otherwise(() => "common");

	const Component = StatusComponent[key];

	return (
		<Component
			locale={locale}
			listingTransactionLog={listingTransactionLog}
			BuyerInfoContainer={BuyerInfoContainer}
			{...props}
		/>
	);
};
