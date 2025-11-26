import { Badge } from "@use-pico/client/ui/badge";
import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";
import { StatusEventBadge } from "../../StatusEventBadge";

export namespace RejectedEvent {
	export interface Props extends StatusEventBadge.Props {
		//
	}
}

export const RejectedEvent: FC<RejectedEvent.Props> = ({ listingTransactionStatus, ...props }) => {
	return (
		<StatusEventBadge
			listingTransactionStatus={listingTransactionStatus}
			renderBuyerFn={({ timestamp, ...props }) => (
				<Badge
					ui={"RejectedEvent-Buyer"}
					{...props}
				>
					{timestamp}

					<Tx label="Buyer transaction rejected (buyer) (label)" />
				</Badge>
			)}
			renderSellerFn={({ timestamp, ...props }) => (
				<Badge
					ui={"RejectedEvent-Seller"}
					{...props}
				>
					{timestamp}

					<Tx label="Seller transaction rejected (seller) (label)" />
				</Badge>
			)}
			renderSellerToBuyerFn={({ timestamp, ...props }) => (
				<Badge
					ui={"RejectedEvent-SellerToBuyer"}
					{...props}
				>
					{timestamp}

					<Tx label="Seller transaction rejected (seller-buyer) (label)" />
				</Badge>
			)}
			renderBuyerToSellerFn={({ timestamp, ...props }) => (
				<Badge
					ui={"RejectedEvent-BuyerToSeller"}
					{...props}
				>
					{timestamp}

					<Tx label="Buyer transaction rejected (buyer-seller) (label)" />
				</Badge>
			)}
			{...props}
		/>
	);
};
