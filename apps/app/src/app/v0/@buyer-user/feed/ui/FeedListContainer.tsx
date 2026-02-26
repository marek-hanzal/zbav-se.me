import type { Container } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/buyer-user";
import { type FC, Suspense } from "react";
import { FeedListContainerContent } from "./FeedListContainer/FeedListContainerContent";
import { FeedListContainerContentPending } from "./FeedListContainer/FeedListContainerContentPending";
import type { Item } from "./FeedListContainer/Item";

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
