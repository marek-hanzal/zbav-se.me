import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withListingCartFeedCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { CartIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { FeedItemBadge } from "~/app/feed/ui/FeedItemBadge";

export namespace ListingCartFeedList {
	export interface Props extends Container.Props {
		locale: string;
		query: tFeedQuery;
	}
}

export const ListingCartFeedList: FC<ListingCartFeedList.Props> = ({ locale, query, ...props }) => {
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
											<LinkTo
												to={"/$locale/buyer/feed/default"}
												params={{
													locale,
												}}
											>
												<Button label={"Go to listings (button)"} />
											</LinkTo>

											<LinkTo
												to={"/$locale/buyer/feed/select"}
												params={{
													locale,
												}}
											>
												<Button label={"Go home (button)"} />
											</LinkTo>
										</>
									}
									tweak={{
										slot: {
											action: {
												class: [
													"flex",
													"flex-col",
													"gap-2",
												],
											},
										},
									}}
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
