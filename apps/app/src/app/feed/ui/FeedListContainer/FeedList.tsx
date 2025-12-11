import { useScrollTo } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, useEffect, useId, useRef } from "react";
import { FeedItem } from "../FeedItem";

export namespace FeedList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		query: tFeedQuery;
		defaultOpenId?: string;
		scrollToId?: string;
		tools: FeedItem.Tools[];
		linkTo: FeedItem.LinkTo;
	}
}

export const FeedList: FC<FeedList.Props> = ({
	_suspense,
	locale,
	query,
	defaultOpenId,
	scrollToId,
	tools,
	linkTo,
	...props
}) => {
	const feedRootId = useId();
	const scrollableRef = useRef<HTMLDivElement>(null);

	const feedCollectionQuery = withFeedCollectionQuery.useSuspenseQuery(query);
	const scrollTo = useScrollTo(scrollableRef);

	useEffect(() => {
		if (scrollToId) {
			scrollTo(`[data-id="${scrollToId}"]`);
		}
	}, [
		scrollToId,
		scrollTo,
	]);

	if (feedCollectionQuery.data.data.length === 0) {
		return null;
	}

	return (
		<Container
			data-ui="FeedListContainer-FeedList"
			ui={{
				position: "relative",
			}}
		>
			<Fade scrollableRef={scrollableRef} />

			<Container
				data-ui="FeedListContainer-FeedList-content"
				ref={scrollableRef}
				ui={{
					layout: "vertical-flex",
					scroll: "vertical",
					gap: "default",
					position: "relative",
				}}
				{...props}
			>
				{feedCollectionQuery.data.data.map((feed) => {
					return (
						<FeedItem
							key={`${feedRootId}-${feed.id}`}
							feed={feed}
							locale={locale}
							defaultOpen={defaultOpenId === feed.id}
							tools={tools}
							linkTo={linkTo}
						/>
					);
				})}
			</Container>
		</Container>
	);
};
