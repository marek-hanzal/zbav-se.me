import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedFavouriteCollectionQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";
import { FeedItem } from "~/app/feed/ui/FeedItem";
import { EmptyStatus } from "~/app/feed-favourite/ui/EmptyStatus";

export namespace FeedFavouriteList {
	export interface Props extends Container.Props {
		locale: string;
		query: tFeedQuery;
		linkTo: FeedItem.LinkTo;
	}
}

/**
 * Renders a list of feed items based on favourite items a user has.
 *
 * This component fetches the user's favourite feed items using the provided query
 * and displays them as a list of {@link FeedItem} components. If no favourites
 * are found, it displays an empty state.
 *
 * @see {@link FeedItem} - The component used to render individual feed items
 */
export const FeedFavouriteList: FC<FeedFavouriteList.Props> = ({
	locale,
	query,
	linkTo,
	...props
}) => {
	return (
		<Container
			data-ui={"FeedFavouriteList[Container]"}
			{...props}
		>
			<withFeedFavouriteCollectionQuery.Suspense
				data={query}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => {
					if (data.data.length === 0) {
						return <EmptyStatus locale={locale} />;
					}

					return (
						<Container
							data-ui={"FeedFavouriteList-[Container.content]"}
							ui={{
								layout: "vertical-flex",
								gap: "default",
							}}
						>
							{data.data.map((feed) => (
								<FeedItem
									data-ui={"FeedFavouriteList-[FeedItem]"}
									key={feed.id}
									locale={locale}
									feed={feed}
									defaultOpen={false}
									count={feed.count}
									tools={[]}
									linkTo={linkTo}
								/>
							))}
						</Container>
					);
				}}
			</withFeedFavouriteCollectionQuery.Suspense>
		</Container>
	);
};
