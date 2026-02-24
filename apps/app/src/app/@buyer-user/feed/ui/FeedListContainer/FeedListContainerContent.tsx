import { Container } from "@use-pico/client/ui/container";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import type { FeedListContainer } from "../FeedListContainer";
import { Content } from "./Content";

export const FeedListContainerContent: FC<FeedListContainer.Props> = ({
	query,
	limit = 10,
	tools,
	linkTo,
	...props
}) => {
	const { data: feedCount } = withFeedQuery.useCount({});
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
