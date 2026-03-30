import { Suspense, useMemo } from "react";
import { Container } from "@/lib/client/container";
import { EmptyState } from "@/lib/client/empty-state";
import { withFallback } from "@/lib/client/fallback";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { CreateButton } from "./CreateButton";
import { Empty } from "./Empty";
import { Item } from "./Item";

export namespace FeedList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		//
	}
}

export const FeedList = withFallback(({ _suspense, ...props }: FeedList.Props) => {
	/**
	 * This is intentional to trigger parent suspense
	 */
	const { data: feedCollection } = withFeedQuery.useCollectionQuery({
		filter: {
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
				check() {
					return !feedCollection.length;
				},
				render() {
					return <Empty />;
				},
			},
		] satisfies EmptyState.Check[];
	}, [
		feedCollection,
	]);

	return (
		<Container
			data-ui={"FeedList"}
			ui={{
				flow: "vertical",
				scroll: "vertical",
				gap: "default",
				inner: "default",
				height: "full",
			}}
			{...props}
		>
			<EmptyState check={check}>
				{feedCollection.map((feedId) => {
					return (
						<Suspense
							key={feedId}
							fallback={<Item.Fallback />}
						>
							<Item
								_suspense={"I know"}
								feedId={feedId}
							/>
						</Suspense>
					);
				})}

				<CreateButton />
			</EmptyState>
		</Container>
	);
}, SpinnerContainer);
