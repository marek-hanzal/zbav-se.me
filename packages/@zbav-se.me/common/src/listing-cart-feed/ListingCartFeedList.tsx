import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withListingCartFeedCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { CartIcon } from "@zbav-se.me/ui/icon";
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
					if (data.data.length === 0) {
						return (
							<Container
								layout={"vertical-centered"}
								items={"center"}
							>
								<Status
									icon={CartIcon}
									textTitle={"No items in cart (title)"}
									action={
										<>
											<LinkTo to={"feedef"}>
												<Button label={"Go to listings (button)"} />
											</LinkTo>
										</>
									}
								/>
							</Container>
						);
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
