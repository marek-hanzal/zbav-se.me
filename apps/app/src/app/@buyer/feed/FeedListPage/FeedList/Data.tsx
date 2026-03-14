import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import type { FC } from "react";
import { CreateButton } from "./CreateButton";
import { Item } from "./Item";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		limit: number;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, limit, ...props }) => {
	/**
	 * This is intentional to trigger parent suspense
	 */
	const { data: feedList } = withFeedQuery.useCollectionQuery({
		filter: {
			type: "user",
		},
		cursor: {
			page: 0,
			size: limit,
		},
		sort: [
			{
				field: "createdAt",
				order: "desc",
			},
		],
	});
	const { data: feedCount } = withFeedQuery.useCountQuery({
		filter: {
			type: "user",
		},
	});
	const isLimitReached = feedCount.filter >= limit;

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
			{feedList.map((feedId) => {
				return (
					<Item
						key={feedId}
						feedId={feedId}
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
