import type { Container } from "@use-pico/client/ui/container";
import type { tTransactionEntryGallery } from "@zbav-se.me/sdk/api/user";
import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace Gallery {
	export interface Props extends Container.Props {
		transactionEntry: tTransactionEntryGallery;
	}
}

export const Gallery: FC<Gallery.Props> = (props) => {
	return (
		<Suspense fallback={<Pending transactionEntry={props.transactionEntry} />}>
			<Data {...props} />
		</Suspense>
	);
};
