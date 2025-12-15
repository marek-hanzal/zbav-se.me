import type { MarkSuspense } from "@use-pico/client/type";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedCollectionQuery, withFeedFetchQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, useId } from "react";
import { Item } from "./Item";

export namespace Content {
	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		query: tFeedQuery;
		defaultOpenId?: string;
		tools: Item.Tools[];
		linkTo: Item.LinkTo;
	}
}

export const Content: FC<Content.Props> = ({
	_suspense,
	locale,
	query,
	defaultOpenId,
	tools,
	linkTo,
	...props
}) => {
	const feedRootId = useId();

	/**
	 * This is intentional to trigger parent suspense
	 */
	const feedCollectionQuery = withFeedCollectionQuery.useSuspenseQuery(query);

	if (feedCollectionQuery.data.data.length === 0) {
		return null;
	}

	return (
		<Container
			data-ui="FeedList-[Container.content]"
			ui={{
				layout: "vertical-flex",
				gap: "default",
				height: "full",
			}}
			{...props}
		>
			{feedCollectionQuery.data.data.map(({ id: feedId }) => {
				return (
					<withFeedFetchQuery.Suspense
						key={`${feedRootId}-${feedId}`}
						data={{
							where: {
								id: feedId,
							},
						}}
						fallback={
							<SpinnerContainer data-ui={"FeedList-[SpinnerContainer.feed-fetch]"} />
						}
					>
						{({ data: feedData }) => {
							return (
								<Item
									feed={feedData}
									locale={locale}
									defaultOpen={defaultOpenId === feedId}
									tools={tools}
									linkTo={linkTo}
								/>
							);
						}}
					</withFeedFetchQuery.Suspense>
				);
			})}
		</Container>
	);
};
