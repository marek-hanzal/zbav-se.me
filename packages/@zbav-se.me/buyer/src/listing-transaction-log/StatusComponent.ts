import { StatusRejected as BuyerStatusRejected } from "./buyer/StatusRejected";
import { StatusRequest as BuyerStatusRequest } from "./buyer/StatusRequest";
import { StatusSuccess as BuyerStatusSuccess } from "./buyer/StatusSuccess";
import { StatusEvent } from "./StatusEvent";
import { StatusAccepted as SellerStatusAccepted } from "./seller/StatusAccepted";
import { StatusClosed as SellerStatusClosed } from "./seller/StatusClosed";
import { StatusRejected as SellerStatusRejected } from "./seller/StatusRejected";
import { StatusSuccess as SellerStatusSuccess } from "./seller/StatusSuccess";

export const StatusComponent = {
	// buyer acted
	"buyer.request": BuyerStatusRequest,
	"buyer.rejected": BuyerStatusRejected,
	"buyer.success": BuyerStatusSuccess,

	// seller acted
	"seller.accepted": SellerStatusAccepted,
	"seller.rejected": SellerStatusRejected,
	"seller.success": SellerStatusSuccess,
	"seller.closed": SellerStatusClosed,

	// commons
	common: StatusEvent,

	// others
	invalid: () => null,
} as const;

export namespace StatusComponent {
	export type State = keyof typeof StatusComponent;
}
