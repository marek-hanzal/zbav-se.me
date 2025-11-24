import type { FC } from "react";
import { StatusEventBadge } from "../../StatusEventBadge";

export namespace RequestEvent {
	export interface Props extends StatusEventBadge.PropsEx {
		//
	}
}

export const RequestEvent: FC<RequestEvent.Props> = ({ ...props }) => {
	return (
		<StatusEventBadge
			renderSellerFn={undefined}
			renderBuyerFn={undefined}
			renderBuyerToSellerFn={undefined}
			renderSellerToBuyerFn={undefined}
			{...props}
		>
			buyer request
		</StatusEventBadge>
	);
};
