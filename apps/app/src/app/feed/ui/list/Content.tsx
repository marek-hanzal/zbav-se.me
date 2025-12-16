import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedCollectionQuery, withFeedFetchQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, useId, useState } from "react";
import { CreateButton } from "~/app/feed/ui/button/CreateButton";
import { Item } from "./Item";

export namespace Content {
	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		query: tFeedQuery;
		tools: Item.Tools[];
		linkTo: Item.LinkTo;
		isLimitReached: boolean;
	}
}

export const Content: FC<Content.Props> = ({
	_suspense,
	locale,
	query,
	tools,
	linkTo,
	isLimitReached,
	...props
}) => {
	const feedRootId = useId();

	/**
	 * This is intentional to trigger parent suspense
	 */
	const feedCollectionQuery = withFeedCollectionQuery.useSuspenseQuery(query);
	/**
	 * We're keeping locale state just for "after creation" open state
	 */
	const [defaultOpenId, setDefaultOpenId] = useState<string | undefined>(undefined);

	if (feedCollectionQuery.data.data.length === 0) {
		return null;
	}

	return (
		<Container
			data-ui="FeedList-[Container.content]"
			ui={{
				layout: "vertical-flex",
				gap: "default",
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
							<Item
								locale={locale}
								feed={{
									id: feedId,
									locationId: null,
									name: translator.text("Loading... (label)"),
									query: {},
									upload: null,
									uploadId: null,
								}}
								defaultOpen={defaultOpenId === feedId}
								tools={tools}
								linkTo={linkTo}
							/>
						}
					>
						{({ data: feed }) => {
							return (
								<Item
									feed={feed}
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

			<CreateButton
				disabled={isLimitReached}
				onCreate={(data) => {
					setDefaultOpenId(data.id);
				}}
				isLimitReached={isLimitReached}
			/>
		</Container>
	);
};
