import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import { type FC, Suspense } from "react";
import { CreateButton } from "~/app/v0/@buyer-user/feed/ui/button/CreateButton";
import { ContentItem } from "./ContentItem";
import { ContentItemPending } from "./ContentItemPending";
import type { Item } from "./Item";

export namespace Content {
	export interface Props extends Container.Props, MarkSuspense.Props {
		query: tFeedQuery;
		tools: Item.Tools[];
		linkTo: Item.LinkTo;
		isLimitReached: boolean;
	}
}

export const Content: FC<Content.Props> = ({
	_suspense,
	query,
	tools,
	linkTo,
	isLimitReached,
	...props
}) => {
	/**
	 * This is intentional to trigger parent suspense
	 */
	const feedCollectionQuery = withFeedQuery.useCollectionQuery(query);
	const { data: feedCount } = withFeedQuery.useCountQuery(query);

	if (feedCount.isEmpty || feedCount.isFilterEmpty) {
		return null;
	}

	return (
		<Container
			data-ui="FeedList-[Container.content]"
			ui={{
				layout: "vertical-flex",
				gap: "default",
			}}
			{...props}
		>
			{feedCollectionQuery.data.map((feedId) => {
				return (
					<Suspense
						key={feedId}
						fallback={
							<ContentItemPending
								feedId={feedId}
								tools={tools}
								linkTo={linkTo}
							/>
						}
					>
						<ContentItem
							feedId={feedId}
							tools={tools}
							linkTo={linkTo}
						/>
					</Suspense>
				);
			})}

			<CreateButton
				disabled={isLimitReached}
				isLimitReached={isLimitReached}
			/>
		</Container>
	);
};
