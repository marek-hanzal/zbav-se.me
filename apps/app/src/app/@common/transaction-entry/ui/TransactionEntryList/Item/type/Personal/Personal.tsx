import type { Container } from "@use-pico/client/ui/container";
import type { tTransactionEntryPersonal } from "@zbav-se.me/sdk/api/user";
import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace Personal {
	export interface Props extends Container.Props {
		transactionEntry: tTransactionEntryPersonal;
	}
}

export const Personal: FC<Personal.Props> = (props) => {
	return (
		<Suspense fallback={<Pending transactionEntry={props.transactionEntry} />}>
			<Data {...props} />
		</Suspense>
	);
};
