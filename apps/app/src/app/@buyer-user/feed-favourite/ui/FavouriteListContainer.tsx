import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedFavouriteCollectionQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import { Item } from "~/app/@buyer-user/feed/ui/feed-list-container/Item";
import { EmptyStatus } from "~/app/@buyer-user/feed-favourite/ui/favourite-list-container/EmptyStatus";

export namespace FavouriteListContainer {
	export interface Props extends Container.Props {
		query: tFeedQuery;
		linkTo: Item.LinkTo;
	}
}

/**
 * Renders a list of feed items based on favourite items a user has.
 *
 * This component fetches the user's favourite feed items using the provided query
 * and displays them as a list of {@link Item} components. If no favourites
 * are found, it displays an empty state.
 *
 * @see {@link Item} - The component used to render individual feed items
 */
export const FavouriteListContainer: FC<FavouriteListContainer.Props> = ({
	query,
	linkTo,
	ui,
	...props
}) => {
	return (
		<Container
			data-ui={"FavouriteListContainer[Container]"}
			ui={{
				layout: "vertical-flex",
				scroll: "vertical",
				gap: "default",
				inner: "default",
				height: "full",
			}}
			{...props}
		>
			<withFeedFavouriteCollectionQuery.Suspense
				data={query}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => {
					if (data.data.length === 0) {
						return <EmptyStatus />;
					}

					return (
						<Container
							data-ui={"FavouriteListContainer-[Container.content]"}
							ui={{
								layout: "vertical-flex",
								gap: "default",
							}}
						>
							{data.data.map((feed) => (
								<Item
									data-ui={"FavouriteListContainer-[Item]"}
									key={feed.id}
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
