import type { Container } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/buyer-user";
import { type FC, Suspense } from "react";
import { FeedListContainerContentPending } from "./FeedListContainerContentPending";
import { FeedListContainerContent } from "./feed-list-container/FeedListContainerContent";
import type { Item } from "./feed-list-container/Item";

export namespace FeedListContainer {
	export interface Props extends Container.Props {
		query: tFeedQuery;
		limit?: number;
		tools: Item.Tools[];
		linkTo: Item.LinkTo;
	}
}

export const FeedListContainer: FC<FeedListContainer.Props> = ({
	query,
	limit = 10,
	tools,
	linkTo,
	...props
}) => {
	return (
		<Suspense fallback={<FeedListContainerContentPending />}>
			<FeedListContainerContent
				query={query}
				limit={limit}
				tools={tools}
				linkTo={linkTo}
				{...props}
			/>
		</Suspense>
	);
};
