import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import { Content } from "./Content";
import type { Item } from "./Item";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		query: tFeedQuery;
		limit?: number;
		tools: Item.Tools[];
		linkTo: Item.LinkTo;
	}
}

export const Data: FC<Data.Props> = ({
	_suspense,
	query,
	limit = 10,
	tools,
	linkTo,
	...props
}) => {
	const { data: feedCount } = withFeedQuery.useCountQuery({});
	const isLimitReached = feedCount.filter >= limit;

	return (
		<Container
			data-ui={"FeedListContainer[Container]"}
			ui={{
				layout: "vertical-flex",
				scroll: "vertical",
				gap: "default",
				inner: "default",
				height: "full",
			}}
			{...props}
		>
			<Content
				_suspense={"I know"}
				query={query}
				tools={tools}
				linkTo={linkTo}
				isLimitReached={isLimitReached}
			/>
		</Container>
	);
};
