import { type FC, Suspense } from "react";
import { Data } from "./content-item-suspense/Data";
import { Pending } from "./content-item-suspense/Pending";

export namespace ContentItemSuspense {
	export interface Props extends Data.Props {
		//
	}
}

export const ContentItemSuspense: FC<ContentItemSuspense.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data {...props} />
		</Suspense>
	);
};
