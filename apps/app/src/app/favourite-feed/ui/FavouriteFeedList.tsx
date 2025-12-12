import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedFavouriteCollectionQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";
import { EmptyStatus } from "~/app/favourite-feed/ui/EmptyStatus";
import { FeedItem } from "~/app/feed/ui/FeedItem";

export namespace FavouriteFeedList {
	export interface Props extends Container.Props {
		locale: string;
		query: tFeedQuery;
		linkTo: FeedItem.LinkTo;
	}
}

export const FavouriteFeedList: FC<FavouriteFeedList.Props> = ({
	locale,
	query,
	linkTo,
	...props
}) => {
	return (
		<Container
			data-ui={"FavouriteFeedList"}
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
							data-ui={"FavouriteFeedList-content"}
							ui={{
								layout: "vertical-flex",
								gap: "default",
							}}
						>
							{data.data.map((feed) => (
								<FeedItem
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
