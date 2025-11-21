import type { Container } from "@use-pico/client/ui/container";
import type {
	tListingTransactionLog,
	tListingTransactionSide,
	tListingTransactionStatus,
	tUserSide,
} from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { StatusRejected as BuyerBuyerStatusRejected } from "~/app/listing-transaction-log/ui/buyer/buyer/StatusRejected";
import { StatusRequest as BuyerBuyerStatusRequest } from "~/app/listing-transaction-log/ui/buyer/buyer/StatusRequest";
import { StatusSuccess as BuyerBuyerStatusSuccess } from "~/app/listing-transaction-log/ui/buyer/buyer/StatusSuccess";
import { StatusAccepted as BuyerSellerStatusAccepted } from "~/app/listing-transaction-log/ui/buyer/seller/StatusAccepted";
import { StatusClosed as BuyerSellerStatusClosed } from "~/app/listing-transaction-log/ui/buyer/seller/StatusClosed";
import { StatusRejected as BuyerSellerStatusRejected } from "~/app/listing-transaction-log/ui/buyer/seller/StatusRejected";
import { StatusSuccess as BuyerSellerStatusSuccess } from "~/app/listing-transaction-log/ui/buyer/seller/StatusSuccess";
import { StatusEvent as CommonStatusEvent } from "~/app/listing-transaction-log/ui/common/StatusEvent";
import { StatusRejected as SellerBuyerStatusRejected } from "~/app/listing-transaction-log/ui/seller/buyer/StatusRejected";
import { StatusRequest as SellerBuyerStatusRequest } from "~/app/listing-transaction-log/ui/seller/buyer/StatusRequest";
import { StatusSuccess as SellerBuyerStatusSuccess } from "~/app/listing-transaction-log/ui/seller/buyer/StatusSuccess";
import { StatusAccepted as SellerSellerStatusAccepted } from "~/app/listing-transaction-log/ui/seller/seller/StatusAccepted";
import { StatusRejected as SellerSellerStatusRejected } from "~/app/listing-transaction-log/ui/seller/seller/StatusRejected";
import { StatusSuccess as SellerSellerStatusSuccess } from "~/app/listing-transaction-log/ui/seller/seller/StatusSuccess";

const StatusComponents = {
	// buyer viewing, buyer acted
	"buyer.buyer.request": BuyerBuyerStatusRequest,
	"buyer.buyer.rejected": BuyerBuyerStatusRejected,
	"buyer.buyer.success": BuyerBuyerStatusSuccess,

	// buyer viewing, seller acted
	"buyer.seller.accepted": BuyerSellerStatusAccepted,
	"buyer.seller.rejected": BuyerSellerStatusRejected,
	"buyer.seller.success": BuyerSellerStatusSuccess,
	"buyer.seller.closed": BuyerSellerStatusClosed,

	// seller viewing, buyer acted
	"seller.buyer.request": SellerBuyerStatusRequest,
	"seller.buyer.rejected": SellerBuyerStatusRejected,
	"seller.buyer.success": SellerBuyerStatusSuccess,

	// seller viewing, seller acted
	"seller.seller.accepted": SellerSellerStatusAccepted,
	"seller.seller.rejected": SellerSellerStatusRejected,
	"seller.seller.success": SellerSellerStatusSuccess,

	// commons
	common: CommonStatusEvent,

	// others
	invalid: () => null,
} as const;

type StatusComponentKey = keyof typeof StatusComponents;

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
	const key = match<
		[
			tUserSide,
			tListingTransactionSide,
			tListingTransactionStatus,
		],
		StatusComponentKey
	>([
		side,
		listingTransactionLog.side,
		listingTransactionLog.status,
	])
		// Buyer -> Buyer
		.with(
			[
				"buyer",
				"buyer",
				"request",
			],
			() => {
				return "buyer.buyer.request";
			},
		)
		.with(
			[
				"buyer",
				"buyer",
				"accepted",
			],
			() => {
				return "invalid";
			},
		)
		.with(
			[
				"buyer",
				"buyer",
				"rejected",
			],
			() => {
				return "buyer.buyer.rejected";
			},
		)
		.with(
			[
				"buyer",
				"buyer",
				"success",
			],
			() => {
				return "buyer.buyer.success";
			},
		)
		// Buyer -> Seller
		.with(
			[
				"buyer",
				"seller",
				"request",
			],
			() => {
				return "invalid";
			},
		)
		.with(
			[
				"buyer",
				"seller",
				"accepted",
			],
			() => {
				return "buyer.seller.accepted";
			},
		)
		.with(
			[
				"buyer",
				"seller",
				"rejected",
			],
			() => {
				return "buyer.seller.rejected";
			},
		)
		.with(
			[
				"buyer",
				"seller",
				"success",
			],
			() => {
				return "buyer.seller.success";
			},
		)
		.with(
			[
				"buyer",
				"seller",
				"closed",
			],
			() => {
				return "buyer.seller.closed";
			},
		)
		// Seller -> Buyer
		.with(
			[
				"seller",
				"buyer",
				"request",
			],
			() => {
				return "seller.buyer.request";
			},
		)
		.with(
			[
				"seller",
				"buyer",
				"accepted",
			],
			() => {
				return "invalid";
			},
		)
		.with(
			[
				"seller",
				"buyer",
				"rejected",
			],
			() => {
				return "seller.buyer.rejected";
			},
		)
		.with(
			[
				"seller",
				"buyer",
				"success",
			],
			() => {
				return "seller.buyer.success";
			},
		)
		// Seller -> Seller
		.with(
			[
				"seller",
				"seller",
				"request",
			],
			() => {
				return "invalid";
			},
		)
		.with(
			[
				"seller",
				"seller",
				"accepted",
			],
			() => {
				return "seller.seller.accepted";
			},
		)
		.with(
			[
				"seller",
				"seller",
				"rejected",
			],
			() => {
				return "seller.seller.rejected";
			},
		)
		.with(
			[
				"seller",
				"seller",
				"success",
			],
			() => {
				return "seller.seller.success";
			},
		)
		.otherwise(() => {
			return "common";
		});

	const Component = StatusComponents[key];

	return (
		<Component
			listingTransactionLog={listingTransactionLog}
			side={side}
			{...props}
		/>
	);
};
