import { useMemo } from "react";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import { CreateButton } from "~/buyer-feed/ui/FeedList/CreateButton";
import { Empty } from "~/buyer-feed/ui/FeedList/Empty";
import { Item } from "~/buyer-feed/ui/FeedList/Item";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { EmptyState } from "~/ui/ui/EmptyState";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";

export namespace FeedList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		//
	}
}

export const FeedList = withFallbackFn(({ _suspense, ...props }: FeedList.Props) => {
	/**
	 * This is intentional to trigger parent suspense
	 */
	const { data: feedCollection } = withFeedQuery.useCollectionQuery({
		where: {
			type: "user",
		},
		sort: [
			{
				field: "createdAt",
				order: "desc",
			},
		],
	});

	const check = useMemo(() => {
		return [
			{
				checkFn() {
					return !feedCollection.length;
				},
				renderFn() {
					return <Empty _suspense={_suspense} />;
				},
			},
		] satisfies EmptyState.Check[];
	}, [
		_suspense,
		feedCollection,
	]);

	return (
		<Container
			data-ui={"FeedList[Container]"}
			data-ui-flow="vertical"
			data-ui-scroll="vertical"
			data-ui-gap="default"
			data-ui-inner="default"
			data-ui-height="full"
			{...props}
		>
			<EmptyState check={check}>
				{feedCollection.map((feed) => {
					return (
						<Item
							key={feed.id}
							feed={feed}
						/>
					);
				})}

				<CreateButton _suspense={_suspense} />
			</EmptyState>
		</Container>
	);
}, SpinnerContainer);
