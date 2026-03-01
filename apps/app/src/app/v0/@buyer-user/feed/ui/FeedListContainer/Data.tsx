import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import { CreateButton } from "~/app/v0/@buyer-user/feed/ui/button/CreateButton";
import { Item } from "./Item";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		query: Omit<tFeedQuery, "cursor">;
		limit: number;
		tools: Item.Tools[];
		linkTo: Item.LinkTo;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, query, limit, tools, linkTo, ...props }) => {
	/**
	 * This is intentional to trigger parent suspense
	 */
	const { data: feedList } = withFeedQuery.useCollectionQuery({
		...query,
		cursor: {
			page: 0,
			size: limit,
		},
	});
	const { data: feedCount } = withFeedQuery.useCountQuery({});
	const isLimitReached = feedCount.filter >= limit;

	return (
		<Container
			data-ui={"FeedListContainer[Container]"}
			ui={{
				flow: "vertical",
				scroll: "vertical",
				gap: "default",
				inner: "default",
				height: "full",
			}}
			{...props}
		>
			{feedList.map((feedId) => {
				return (
					<Item
						key={feedId}
						feedId={feedId}
						tools={tools}
						linkTo={linkTo}
					/>
				);
			})}

			<CreateButton
				disabled={isLimitReached}
				isLimitReached={isLimitReached}
			/>
		</Container>
	);
};
