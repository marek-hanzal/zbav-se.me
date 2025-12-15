import { useScrollTo } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedCollectionQuery, withFeedFetchQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, useEffect, useId, useRef } from "react";
import { Item } from "./Item";

export namespace Content {
	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		query: tFeedQuery;
		defaultOpenId?: string;
		scrollToId?: string;
		tools: Item.Tools[];
		linkTo: Item.LinkTo;
	}
}

export const Content: FC<Content.Props> = ({
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

	/**
	 * This is intentional to trigger parent suspense
	 */
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
			data-ui="FeedList[Container]"
			ui={{
				position: "relative",
				height: "full",
			}}
		>
			<Fade scrollableRef={scrollableRef} />

			<Container
				data-ui="FeedList-[Container.content]"
				ref={scrollableRef}
				ui={{
					layout: "vertical-flex",
					scroll: "vertical",
					gap: "default",
					height: "full",
				}}
				{...props}
			>
				{feedCollectionQuery.data.data.map(({ id: feedId }) => {
					return (
						<withFeedFetchQuery.Suspense
							key={`${feedRootId}-${feedId}`}
							data={{
								where: {
									id: feedId,
								},
							}}
							fallback={
								<SpinnerContainer
									data-ui={"FeedList-[SpinnerContainer.feed-fetch]"}
								/>
							}
						>
							{({ data: feedData }) => {
								return (
									<Item
										feed={feedData}
										locale={locale}
										defaultOpen={defaultOpenId === feedId}
										tools={tools}
										linkTo={linkTo}
									/>
								);
							}}
						</withFeedFetchQuery.Suspense>
					);
				})}
			</Container>
		</Container>
	);
};
