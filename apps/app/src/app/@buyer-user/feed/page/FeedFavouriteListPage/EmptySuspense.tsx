import { type FC, Suspense } from "react";
import { Data } from "~/app/@buyer-user/feed/page/FeedFavouriteListPage/EmptySuspense/Data";
import { Pending } from "~/app/@buyer-user/feed/page/FeedFavouriteListPage/EmptySuspense/Pending";

export namespace EmptySuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const EmptySuspense: FC<EmptySuspense.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
