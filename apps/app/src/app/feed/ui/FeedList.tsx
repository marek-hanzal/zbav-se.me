import { ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedCountQuery } from "@zbav-se.me/sdk/query/user";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import { type FC, Suspense } from "react";
import { FeedListContainer } from "~/app/feed/ui/FeedList/ListContainer";

export namespace FeedList {
	export interface Props {
		query: tFeedQuery;
		limit?: number;
		onClickCreate?: () => void;
	}
}

export const FeedList: FC<FeedList.Props> = ({
	query,
	limit: feedCountLimit = 10,
	onClickCreate,
}) => {
	const feedCountQuery = withFeedCountQuery.useSuspenseQuery({});

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

			<Suspense fallback={<SpinnerContainer />}>
				<FeedListContainer query={query} />
			</Suspense>

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
