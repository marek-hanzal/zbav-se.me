import type { Container } from "@use-pico/client/ui/container";
import type { tTransactionEntryLocation } from "@zbav-se.me/sdk/api/user";
import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace Location {
	export interface Props extends Container.Props {
		transactionEntry: tTransactionEntryLocation;
	}
}

export const Location: FC<Location.Props> = (props) => {
	return (
		<Suspense fallback={<Pending transactionEntry={props.transactionEntry} />}>
			<Data {...props} />
		</Suspense>
	);
};
