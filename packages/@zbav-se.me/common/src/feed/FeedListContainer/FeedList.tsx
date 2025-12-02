import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, useId } from "react";
import { FeedItemBadge } from "../FeedItemBadge";

export namespace FeedList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		query: tFeedQuery;
		defaultOpenId?: string;
	}
}

export const FeedList: FC<FeedList.Props> = ({
	_suspense,
	locale,
	query,
	defaultOpenId,
	...props
}) => {
	const feedRootId = useId();

	const feedCollectionQuery = withFeedCollectionQuery.useSuspenseQuery(query);

	return (
		<Container
			layout={"vertical-flex"}
			scroll={"vertical"}
			gap={"md"}
			{...props}
		>
			{feedCollectionQuery.data.data.map((feed) => {
				return (
					<FeedItemBadge
						key={`${feedRootId}-${feed.id}`}
						feed={feed}
						locale={locale}
						defaultOpen={defaultOpenId === feed.id}
					/>
				);
			})}
		</Container>
	);
};
