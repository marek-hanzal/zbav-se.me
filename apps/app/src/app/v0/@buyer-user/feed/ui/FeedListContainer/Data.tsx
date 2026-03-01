import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import { CreateButton } from "~/app/v0/@buyer-user/feed/ui/button/CreateButton";
import { Item } from "./Item";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		query: tFeedQuery;
		limit?: number;
		tools: Item.Tools[];
		linkTo: Item.LinkTo;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, query, limit = 10, tools, linkTo, ...props }) => {
	/**
	 * This is intentional to trigger parent suspense
	 */
	const feedCollectionQuery = withFeedQuery.useCollectionQuery(query);
	const { data: listingCount } = withFeedQuery.useCountQuery(query);
	const { data: feedCount } = withFeedQuery.useCountQuery({});
	const isLimitReached = feedCount.filter >= limit;

	if (listingCount.isEmpty || listingCount.isFilterEmpty) {
		return null;
	}

	return (
		<Container
			data-ui={"FeedListContainer[Container]"}
			ui={{
				layout: "vertical-flex",
				scroll: "vertical",
				gap: "default",
				inner: "default",
				height: "full",
			}}
			{...props}
		>
			<Container
				data-ui="FeedList-[Container.content]"
				ui={{
					layout: "vertical-flex",
					gap: "default",
				}}
			>
				{feedCollectionQuery.data.map((feedId) => {
					return (
						<Item
							key={feedId}
							feedId={feedId}
							tools={tools}
							linkTo={linkTo}
						/>
					);
				})}

				<CreateButton
					disabled={isLimitReached}
					isLimitReached={isLimitReached}
				/>
			</Container>
		</Container>
	);
};
