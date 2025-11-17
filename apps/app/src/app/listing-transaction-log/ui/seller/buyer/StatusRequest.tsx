import { useParams } from "@tanstack/react-router";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";
import { StatusEvent } from "../../common/StatusEvent";

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
		<StatusEvent {...props}>
			<LinkTo
				icon={ArrowRightIcon}
				iconPosition={"right"}
				to={"/$locale/seller/transaction/$id/buyer/info"}
				params={{
					locale,
					id: props.listingTransactionLog.id,
				}}
			>
				<Tx label="Buyer detail (link)" />
			</LinkTo>
		</StatusEvent>
	);
};
