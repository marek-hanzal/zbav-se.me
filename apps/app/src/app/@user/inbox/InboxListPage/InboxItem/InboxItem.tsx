import type { FC } from "react";
import { Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace InboxItem {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		inboxId: string;
	}
}

export const InboxItem: FC<InboxItem.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
