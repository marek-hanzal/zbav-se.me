import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { type FC, useMemo } from "react";
import { CreateButton } from "./CreateButton";
import { Empty } from "./Empty";
import { Item } from "./Item";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		//
	}
}

export const Data: FC<Data.Props> = ({ _suspense, ...props }) => {
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
			data-ui={"FeedList[Container]"}
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
						<Item
							key={feedId}
							feedId={feedId}
						/>
					);
				})}

				<CreateButton />
			</EmptyState>
		</Container>
	);
};
