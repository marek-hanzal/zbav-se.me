import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, useId } from "react";
import { FeedItemBadge } from "../FeedItemBadge";

export namespace FeedList {
	export interface Props extends Container.Props, Pick<FeedItemBadge.Props, "onDelete"> {
		locale: string;
		query: tFeedQuery;
	}
}

export const FeedList: FC<FeedList.Props> = ({ locale, query, onDelete, ...props }) => {
	const feedRootId = useId();

	return (
		<Container
			layout={"vertical-flex"}
			scroll={"vertical"}
			gap={"md"}
			{...props}
		>
			<withFeedCollectionQuery.Suspense
				data={query}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => {
					return data.data.map((feed) => {
						return (
							<FeedItemBadge
								key={`${feedRootId}-${feed.id}`}
								feed={feed}
								locale={locale}
								onDelete={onDelete}
							/>
						);
					});
				}}
			</withFeedCollectionQuery.Suspense>
		</Container>
	);
};
