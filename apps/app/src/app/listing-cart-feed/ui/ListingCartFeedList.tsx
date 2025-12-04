import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withListingCartFeedCollectionQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";
import { FeedItemBadge } from "~/app/feed/ui/FeedItemBadge";
import { EmptyStatus } from "~/app/listing-cart-feed/ui/EmptyStatus";

export namespace ListingCartFeedList {
	export interface Props extends Container.Props {
		locale: string;
		query: tFeedQuery;
		linkTo: FeedItemBadge.LinkTo;
	}
}

export const ListingCartFeedList: FC<ListingCartFeedList.Props> = ({
	locale,
	query,
	linkTo,
	...props
}) => {
	return (
		<Container
			ui={"ListingCartFeedList-root"}
			{...props}
		>
			<withListingCartFeedCollectionQuery.Suspense
				data={query}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => {
					if (data.data.length === 0) {
						return <EmptyStatus locale={locale} />;
					}

					return (
						<Container
							ui={"ListingCartFeedList-root"}
							layout={"vertical-flex"}
							gap={"md"}
						>
							{data.data.map((feed) => (
								<FeedItemBadge
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
			</withListingCartFeedCollectionQuery.Suspense>
		</Container>
	);
};
