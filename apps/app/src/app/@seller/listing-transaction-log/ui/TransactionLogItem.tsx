import type { Container } from "@use-pico/client/ui/container";
import type {
	tListingTransactionLog,
	tListingTransactionSide,
	tListingTransactionStatus,
} from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { StatusRejected as BuyerStatusRejected } from "~/app/@seller/listing-transaction-log/ui/buyer/StatusRejected";
import { StatusRequest as BuyerStatusRequest } from "~/app/@seller/listing-transaction-log/ui/buyer/StatusRequest";
import { StatusSuccess as BuyerStatusSuccess } from "~/app/@seller/listing-transaction-log/ui/buyer/StatusSuccess";
import { StatusEvent as CommonStatusEvent } from "~/app/@seller/listing-transaction-log/ui/StatusEvent";
import { StatusAccepted as SellerStatusAccepted } from "~/app/@seller/listing-transaction-log/ui/seller/StatusAccepted";
import { StatusRejected as SellerStatusRejected } from "~/app/@seller/listing-transaction-log/ui/seller/StatusRejected";
import { StatusSuccess as SellerStatusSuccess } from "~/app/@seller/listing-transaction-log/ui/seller/StatusSuccess";

const StatusComponents = {
	// buyer acted
	"buyer.request": BuyerStatusRequest,
	"buyer.rejected": BuyerStatusRejected,
	"buyer.success": BuyerStatusSuccess,

	// seller acted
	"seller.accepted": SellerStatusAccepted,
	"seller.rejected": SellerStatusRejected,
	"seller.success": SellerStatusSuccess,

	// commons
	common: CommonStatusEvent,

	// others
	invalid: () => null,
} as const;

type StatusComponentKey = keyof typeof StatusComponents;

export namespace TransactionLogItem {
	export interface Props extends Container.Props {
		listingTransactionLog: tListingTransactionLog;
	}
}

export const TransactionLogItem: FC<TransactionLogItem.Props> = ({
	listingTransactionLog,
	...props
}) => {
	const key = match<
		[
			tListingTransactionSide,
			tListingTransactionStatus,
		],
		StatusComponentKey
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

	const Component = StatusComponents[key];

	return (
		<Component
			listingTransactionLog={listingTransactionLog}
			{...props}
		/>
	);
};
