import { ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedCollectionQuery, withFeedCountQuery } from "@zbav-se.me/sdk/query/user";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import { type FC, useId } from "react";
import { FeedItem } from "~/app/feed/ui/FeedItem";

export namespace FeedList {
	export interface Props {
		query: tFeedQuery;
		locale: string;
		limit?: number;
		scrollTo?: string;
		onClickCreate?: () => void;
	}
}

export const FeedList: FC<FeedList.Props> = ({
	query,
	locale,
	limit: feedCountLimit = 10,
	scrollTo: _scrollTo,
	onClickCreate,
}) => {
	const feedCollectionQuery = withFeedCollectionQuery.useSuspenseQuery(query);
	const feedCountQuery = withFeedCountQuery.useSuspenseQuery({});

	const feedId = useId();
	const isLimitReached = feedCountQuery.data.filter >= feedCountLimit;
	const shouldShowCreateButton = onClickCreate !== undefined;

	return (
		<Container
			layout={isLimitReached ? "vertical" : "vertical-content-footer"}
			items={"start"}
			justify={"between"}
			gap={"md"}
		>
			{shouldShowCreateButton && feedCountQuery.data.filter === 0 ? (
				<Container
					layout={"vertical-centered"}
					items={"center"}
				>
					<Status
						icon={FeedIcon}
						textTitle={"Create first feed (title)"}
						textMessage={"Create your first feed to get started (description)"}
						action={
							<Button
								iconEnabled={ArrowRightIcon}
								iconPosition={"right"}
								onClick={onClickCreate}
								label={"Create new feed (button)"}
								tone={"primary"}
								theme={"dark"}
								size={"xl"}
							/>
						}
					/>
				</Container>
			) : null}

			<Container
				layout={"vertical-flex"}
				scroll={"vertical"}
				gap={"md"}
			>
				{feedCollectionQuery.data.data.map((feed) => {
					return (
						<FeedItem
							key={`${feedId}-${feed.id}`}
							feed={feed}
							locale={locale}
						/>
					);
				})}
			</Container>

			{shouldShowCreateButton && !isLimitReached && feedCountQuery.data.filter > 0 ? (
				<Button
					tone={"primary"}
					iconEnabled={FeedIcon}
					theme={"dark"}
					disabled={isLimitReached}
					onClick={onClickCreate}
					label={"Create new feed (title)"}
					size={"lg"}
					full
				/>
			) : null}
		</Container>
	);
};
