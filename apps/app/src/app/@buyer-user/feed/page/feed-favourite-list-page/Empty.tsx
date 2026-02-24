import type { MarkSuspense } from "@use-pico/client/type";
import { withFavouriteCountQuery } from "@zbav-se.me/sdk/query/buyer-user/favourite";
import type { FC, RefObject } from "react";
import { EmptyFavouriteStatus } from "~/app/@buyer-user/feed-favourite/ui/EmptyFavouriteStatus";
import { EmptyFeedStatus } from "~/app/@buyer-user/feed-favourite/ui/EmptyFeedStatus";

export namespace Empty {
	export interface Props extends MarkSuspense.Props {
		sentinelRef: RefObject<HTMLDivElement | null>;
	}
}

export const Empty: FC<Empty.Props> = ({ _suspense, sentinelRef }) => {
	const { data } = withFavouriteCountQuery.useSuspenseQuery({});

	if (data.filter === 0) {
		return <EmptyFavouriteStatus ref={sentinelRef} />;
	}

	return <EmptyFeedStatus ref={sentinelRef} />;
};
