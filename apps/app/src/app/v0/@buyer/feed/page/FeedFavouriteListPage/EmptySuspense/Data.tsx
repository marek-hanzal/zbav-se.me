import type { MarkSuspense } from "@use-pico/client/type";
import { withFavouriteCountQuery } from "@zbav-se.me/sdk/query/buyer/favourite";
import type { FC, RefObject } from "react";
import { EmptyFavouriteStatus } from "~/app/v0/@buyer/feed/page/FeedFavouriteListPage/EmptyFavouriteStatus";
import { EmptyFeedStatus } from "~/app/v0/@buyer/feed/page/FeedFavouriteListPage/EmptyFeedStatus";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		sentinelRef: RefObject<HTMLDivElement | null>;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, sentinelRef }) => {
	const { data } = withFavouriteCountQuery.useSuspenseQuery({});

	if (data.filter === 0) {
		return <EmptyFavouriteStatus ref={sentinelRef} />;
	}

	return <EmptyFeedStatus ref={sentinelRef} />;
};
