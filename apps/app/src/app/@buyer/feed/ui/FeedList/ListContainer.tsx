import { useParams } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, useId } from "react";
import { FeedItem } from "~/app/@buyer/feed/ui/FeedItem";

export namespace FeedListContainer {
	export interface Props extends Container.Props {
		query: tFeedQuery;
	}
}

export const FeedListContainer: FC<FeedListContainer.Props> = ({ query, ...props }) => {
	const { locale } = useParams({
		from: "/$locale",
	});
	const feedCollectionQuery = withFeedCollectionQuery.useSuspenseQuery(query);
	const feedRootId = useId();

	return (
		<Container
			layout={"vertical-flex"}
			scroll={"vertical"}
			gap={"md"}
			{...props}
		>
			{feedCollectionQuery.data.data.map((feed) => {
				return (
					<FeedItem
						key={`${feedRootId}-${feed.id}`}
						feed={feed}
						locale={locale}
					/>
				);
			})}
		</Container>
	);
};
