import type { Container } from "@use-pico/client/ui/container";
import type {
	tListingTransactionLog,
	tListingTransactionStatus,
	tUserSide,
} from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";
import { match } from "ts-pattern";
import { StatusRejected as BuyerBuyerStatusRejected } from "~/app/listing-transaction-log/ui/buyer/buyer/StatusRejected";
import { StatusRequest as BuyerBuyerStatusRequest } from "~/app/listing-transaction-log/ui/buyer/buyer/StatusRequest";
import { StatusSuccess as BuyerBuyerStatusSuccess } from "~/app/listing-transaction-log/ui/buyer/buyer/StatusSuccess";
import { StatusAccepted as BuyerSellerStatusAccepted } from "~/app/listing-transaction-log/ui/buyer/seller/StatusAccepted";
import { StatusClosed as BuyerSellerStatusClosed } from "~/app/listing-transaction-log/ui/buyer/seller/StatusClosed";
import { StatusRejected as BuyerSellerStatusRejected } from "~/app/listing-transaction-log/ui/buyer/seller/StatusRejected";
import { StatusRequest as BuyerSellerStatusRequest } from "~/app/listing-transaction-log/ui/buyer/seller/StatusRequest";
import { StatusSuccess as BuyerSellerStatusSuccess } from "~/app/listing-transaction-log/ui/buyer/seller/StatusSuccess";
import {
	StatusEvent as CommonStatusEvent,
	type StatusEvent,
} from "~/app/listing-transaction-log/ui/common/StatusEvent";
import { StatusAccepted as SellerBuyerStatusAccepted } from "~/app/listing-transaction-log/ui/seller/buyer/StatusAccepted";
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
	"buyer.seller.request": BuyerSellerStatusRequest,
	"buyer.seller.accepted": BuyerSellerStatusAccepted,
	"buyer.seller.rejected": BuyerSellerStatusRejected,
	"buyer.seller.success": BuyerSellerStatusSuccess,
	"buyer.seller.closed": BuyerSellerStatusClosed,

	// seller viewing, buyer acted
	"seller.buyer.request": SellerBuyerStatusRequest,
	"seller.buyer.accepted": SellerBuyerStatusAccepted,
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
	const statusEventProps: StatusEvent.Props = {
		listingTransactionLog,
		side,
		...props,
	};

	/**
	 * For who this item is for?
	 *
	 * Current user - either buyer or seller
	 */
	const key = match(side)
		.with("buyer", () => {
			/**
			 * Who submitted this transaction item?
			 */
			return match(listingTransactionLog.side)
				.with("buyer", () => {
					return match<tListingTransactionStatus, StatusComponentKey>(
						listingTransactionLog.status,
					)
						.with("request", () => {
							return "buyer.buyer.request";
						})
						.with("accepted", () => {
							return "invalid";
						})
						.with("rejected", () => {
							return "buyer.buyer.rejected";
						})
						.with("success", () => {
							return "buyer.buyer.success";
						})
						.with("closed", "expired", () => {
							return "common";
						})
						.exhaustive();
				})
				.with("seller", () => {
					return match<tListingTransactionStatus, StatusComponentKey>(
						listingTransactionLog.status,
					)
						.with("request", () => {
							return "buyer.seller.request";
						})
						.with("accepted", () => {
							return "buyer.seller.accepted";
						})
						.with("rejected", () => {
							return "buyer.seller.rejected";
						})
						.with("success", () => {
							return "buyer.seller.success";
						})
						.with("closed", () => {
							return "buyer.seller.closed";
						})
						.with("expired", () => {
							return "common";
						})
						.exhaustive();
				})
				.with("transaction", "system", "unknown", () => {
					return "common";
				})
				.exhaustive();
		})
		.with("seller", () => {
			/**
			 * Who submitted this transaction item?
			 */
			return match(listingTransactionLog.side)
				.with("buyer", () => {
					return match<tListingTransactionStatus, StatusComponentKey>(
						listingTransactionLog.status,
					)
						.with("request", () => {
							return "seller.buyer.request";
						})
						.with("accepted", () => {
							return "seller.buyer.accepted";
						})
						.with("rejected", () => {
							return "seller.buyer.rejected";
						})
						.with("success", () => {
							return "seller.buyer.success";
						})
						.with("closed", "expired", () => {
							return "common";
						})
						.exhaustive();
				})
				.with("seller", () => {
					return match<tListingTransactionStatus, StatusComponentKey>(
						listingTransactionLog.status,
					)
						.with("request", () => {
							return "invalid";
						})
						.with("accepted", () => {
							return "seller.seller.accepted";
						})
						.with("rejected", () => {
							return "seller.seller.rejected";
						})
						.with("success", () => {
							return "seller.seller.success";
						})
						.with("closed", "expired", () => {
							return "common";
						})
						.exhaustive();
				})
				.with("transaction", "system", "unknown", () => {
					return "common";
				})
				.exhaustive();
		})
		.exhaustive() as StatusComponentKey;

	const Component = StatusComponents[key];

	return <Component {...statusEventProps} />;
};
