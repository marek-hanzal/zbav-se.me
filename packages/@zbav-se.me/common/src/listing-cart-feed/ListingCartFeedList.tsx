import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withListingCartFeedCollectionQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";
import { FeedItemBadge } from "../feed";

export namespace ListingCartFeedList {
	export interface Props extends Container.Props {
		locale: string;
		query: tFeedQuery;
		linkTo: FeedItemBadge.LinkTo.RenderFn;
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
									linkTo={linkTo}
									count={feed.count}
									noSetup
								/>
							))}
						</Container>
					);
				}}
			</withListingCartFeedCollectionQuery.Suspense>
		</Container>
	);
};
