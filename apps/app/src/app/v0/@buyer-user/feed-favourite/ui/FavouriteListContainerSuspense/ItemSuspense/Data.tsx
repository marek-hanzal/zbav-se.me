import { withFeedFavouriteQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import { Item } from "~/app/v0/@buyer-user/feed/ui/FeedListContainer/Item";

export namespace Data {
	export interface Props {
		feedId: string;
		linkTo: Item.LinkTo;
	}
}

export const Data: FC<Data.Props> = ({ feedId, linkTo }) => {
	const { data: feed } = withFeedFavouriteQuery.useQuery(feedId);

	return (
		<Item
			data-ui={"FavouriteListContainer-[Item]"}
			feed={feed}
			defaultOpen={false}
			count={feed.count}
			tools={[]}
			linkTo={linkTo}
		/>
	);
};
