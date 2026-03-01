import { withFeedFavouriteQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import type { Item } from "~/app/@buyer-user/feed/ui/FeedListContainer/Item";
import { View } from "~/app/@buyer-user/feed/ui/FeedListContainer/Item/View";

export namespace Data {
	export interface Props {
		feedId: string;
		linkTo: Item.LinkTo;
	}
}

export const Data: FC<Data.Props> = ({ feedId, linkTo }) => {
	const { data: feed } = withFeedFavouriteQuery.useQuery(feedId);

	return (
		<View
			data-ui={"FavouriteListContainer-[Item]"}
			feed={feed}
			count={feed.count}
			tools={[]}
			linkTo={linkTo}
		/>
	);
};
