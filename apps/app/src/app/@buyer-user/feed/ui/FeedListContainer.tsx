import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedCountQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import { Content } from "./feed-list-container/Content";
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
		<withFeedCountQuery.Suspense
			data={{}}
			fallback={<SpinnerContainer />}
		>
			{({ data }) => {
				const isLimitReached = data.filter >= limit;

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
						<Content
							_suspense={"I know"}
							query={query}
							tools={tools}
							linkTo={linkTo}
							isLimitReached={isLimitReached}
						/>
					</Container>
				);
			}}
		</withFeedCountQuery.Suspense>
	);
};
