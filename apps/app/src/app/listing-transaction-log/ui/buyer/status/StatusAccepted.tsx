import { Container } from "@use-pico/client/ui/container";
import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";

export namespace StatusAccepted {
	export interface Props extends Container.Props {
		listingTransactionLog: tListingTransactionLog;
	}
}

export const StatusAccepted: FC<StatusAccepted.Props> = ({
	listingTransactionLog,
	tweak,
	...props
}) => {
	return (
		<Container
			tweak={tweak}
			{...props}
		>
			accpeted
		</Container>
	);
};
