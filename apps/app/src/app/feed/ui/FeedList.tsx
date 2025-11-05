import { ArrowRightIcon, Icon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/session";
import {
	withFeedCollectionQuery,
	withFeedCountQuery,
} from "@zbav-se.me/sdk/query";
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
			layout={"vertical-flex"}
			scroll={"vertical"}
			gap={"md"}
			height={"fit"}
		>
			{shouldShowCreateButton && feedCountQuery.data.filter > 0 ? (
				<Badge
					tone={"primary"}
					theme={isLimitReached ? "light" : "dark"}
					disabled={isLimitReached}
					onClick={onClickCreate}
					tweak={{
						slot: {
							root: {
								class: [
									"inline-flex",
									"flex-row",
									"gap-2",
									"w-full",
									"h-fit",
									"items-center",
									"justify-start",
									"py-2",
									"px-4",
								],
								token: [
									"round.md",
								],
							},
						},
					}}
				>
					{isLimitReached ? null : <Icon icon={FeedIcon} />}
					<Tx
						label={
							isLimitReached
								? "Feed limit reached (title)"
								: "Create new feed (title)"
						}
						font={"bold"}
					/>
				</Badge>
			) : null}

			{shouldShowCreateButton && feedCountQuery.data.filter === 0 ? (
				<Container
					layout={"vertical-centered"}
					items={"center"}
				>
					<Status
						icon={FeedIcon}
						textTitle={"Create first feed (title)"}
						textMessage={
							"Create your first feed to get started (description)"
						}
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
	);
};
