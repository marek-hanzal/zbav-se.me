import { useParams } from "@tanstack/react-router";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { StatusEvent } from "~/app/listing-transaction-log/ui/common/StatusEvent";

export namespace StatusRequest {
	export interface Props extends StatusEvent.Props {
		listingTransactionLog: tListingTransactionLog;
	}
}

export const StatusRequest: FC<StatusRequest.Props> = (props) => {
	const { locale } = useParams({
		from: "/$locale",
	});

	return (
		<StatusEvent
			ui={"Buyer-Buyer-StatusRequest-root"}
			{...props}
		>
			<LinkTo
				icon={ArrowRightIcon}
				iconPosition={"right"}
				to={"/$locale/buyer/transaction/$id/seller/info"}
				params={{
					locale,
					id: props.listingTransactionLog.listingTransactionId,
				}}
			>
				<Tx label="Seller detail (link)" />
			</LinkTo>
		</StatusEvent>
	);
};
