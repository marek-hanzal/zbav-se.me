import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedCountQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, useState } from "react";
import type { FeedItem } from "~/app/feed/ui/FeedItem";
import { FeedCreateButton } from "./FeedCreateButton";
import { FeedList } from "./FeedListContainer/FeedList";

export namespace FeedListContainer {
	export interface Props extends Container.Props {
		locale: string;
		query: tFeedQuery;
		limit?: number;
		scrollToId: string | undefined;
		tools: FeedItem.Tools[];
		linkTo: FeedItem.LinkTo;
	}
}

export const FeedListContainer: FC<FeedListContainer.Props> = ({
	locale,
	query,
	limit = 10,
	scrollToId,
	tools,
	linkTo,
	...props
}) => {
	/**
	 * We're keeping locale state just for "after creation" open state
	 */
	const [defaultOpenId, setDefaultOpenId] = useState<string | undefined>(undefined);

	return (
		<withFeedCountQuery.Suspense
			data={{}}
			fallback={<SpinnerContainer />}
		>
			{({ data }) => {
				const isLimitReached = data.filter >= limit;

				return (
					<Container
						data-ui={"FeedListContainer[Container]"}
						ui={{
							layout: isLimitReached ? "vertical" : "vertical-content-footer",
							gap: "md",
						}}
						{...props}
					>
						<FeedList
							_suspense={"I know"}
							locale={locale}
							query={query}
							defaultOpenId={defaultOpenId}
							scrollToId={scrollToId}
							tools={tools}
							linkTo={linkTo}
						/>

						{data.filter > 0 ? (
							<FeedCreateButton
								disabled={isLimitReached}
								onCreate={(data) => {
									setDefaultOpenId(data.id);
								}}
							/>
						) : null}
					</Container>
				);
			}}
		</withFeedCountQuery.Suspense>
	);
};
