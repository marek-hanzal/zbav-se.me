import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/buyer";
import { withFeedFavouriteQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import type { FC } from "react";
import { EmptyStatus } from "./EmptyStatus";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		query: tFeedQuery;
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
export const Data: FC<Data.Props> = ({ _suspense, query, ui, ...props }) => {
	const { data: feedIds } = withFeedFavouriteQuery.useCollectionQuery(query);
	const { data: feedCount } = withFeedFavouriteQuery.useCountQuery(query);

	return (
		<Container
			data-ui={"FavouriteListContainer[Container]"}
			ui={{
				layout: "vertical-flex",
				scroll: "vertical",
				gap: "default",
				inner: "default",
				height: "full",
				...ui,
			}}
			{...props}
		>
			{feedCount.isEmpty || feedCount.isFilterEmpty ? (
				<EmptyStatus />
			) : (
				<Container
					data-ui={"FavouriteListContainer-[Container.content]"}
					ui={{
						layout: "vertical-flex",
						gap: "default",
					}}
				>
					"rework favourite to use ListItem"
				</Container>
			)}
		</Container>
	);
};
