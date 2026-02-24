import { type FC, Suspense } from "react";
import { Data } from "~/app/@buyer-user/feed-favourite/ui/FavouriteListContainerSuspense/ItemSuspense/Data";
import { Pending } from "~/app/@buyer-user/feed-favourite/ui/FavouriteListContainerSuspense/ItemSuspense/Pending";

export namespace ItemSuspense {
	export interface Props extends Data.Props {}
}

export const ItemSuspense: FC<ItemSuspense.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data {...props} />
		</Suspense>
	);
};
