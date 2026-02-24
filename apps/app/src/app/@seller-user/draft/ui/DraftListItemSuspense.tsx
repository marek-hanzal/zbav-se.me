import { type FC, Suspense } from "react";
import { Data } from "./DraftListItemSuspense/Data";
import { Pending } from "./DraftListItemSuspense/Pending";

export namespace DraftListItemSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const DraftListItemSuspense: FC<DraftListItemSuspense.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
