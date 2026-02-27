import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import { Item } from "./Item";

export namespace ContentItem {
	export interface Props {
		feedId: string;
		tools: Item.Tools[];
		linkTo: Item.LinkTo;
	}
}

export const ContentItem: FC<ContentItem.Props> = ({ feedId, tools, linkTo }) => {
	const feedQuery = withFeedQuery.useFetchQuery(feedId);

	return (
		<Item
			feed={feedQuery.data}
			tools={tools}
			linkTo={linkTo}
		/>
	);
};
