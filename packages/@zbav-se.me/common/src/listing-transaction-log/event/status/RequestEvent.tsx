import { Badge } from "@use-pico/client/ui/badge";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { FC } from "react";
import { StatusEventBadge } from "../../StatusEventBadge";

export namespace RequestEvent {
	export interface Props extends StatusEventBadge.PropsEx {
		locale: string;
	}
}

export const RequestEvent: FC<RequestEvent.Props> = ({
	locale,
	listingTransactionStatus,
	...props
}) => {
	return (
		<StatusEventBadge
			listingTransactionStatus={listingTransactionStatus}
			renderSellerFn={undefined}
			renderBuyerFn={(props) => (
				<Badge {...props}>
					<Typo
						label={toTimeDiff({
							locale,
							time: listingTransactionStatus.createdAt,
						})}
						font={"normal"}
						size={"sm"}
					/>

					<Tx label="Buyer transaction request (buyer-buyer) (label)" />
				</Badge>
			)}
			renderBuyerToSellerFn={(props) => (
				<Badge {...props}>
					<Typo
						label={toTimeDiff({
							locale,
							time: listingTransactionStatus.createdAt,
						})}
						font={"normal"}
						size={"sm"}
					/>

					<Tx label="Buyer transaction request (buyer-seller) (label)" />
				</Badge>
			)}
			renderSellerToBuyerFn={undefined}
			{...props}
		>
			buyer request
		</StatusEventBadge>
	);
};
