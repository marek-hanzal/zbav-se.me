import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedCountQuery } from "@zbav-se.me/sdk/query/user";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { FeedCreateButton } from "./FeedCreateButton";
import { FeedList } from "./FeedListContainer/FeedList";

export namespace FeedListContainer {
	export interface Props extends Container.Props {
		locale: string;
		query: tFeedQuery;
		limit?: number;
	}
}

export const FeedListContainer: FC<FeedListContainer.Props> = ({
	locale,
	query,
	limit = 10,
	...props
}) => {
	return (
		<withFeedCountQuery.Suspense
			data={{}}
			fallback={<SpinnerContainer />}
		>
			{({ data }) => {
				const isLimitReached = data.filter >= limit;

				return (
					<Container
						layout={isLimitReached ? "vertical" : "vertical-content-footer"}
						items={"start"}
						justify={"between"}
						gap={"md"}
						{...props}
					>
						{data.filter === 0 ? (
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
									action={<FeedCreateButton />}
								/>
							</Container>
						) : null}

						<FeedList
							locale={locale}
							query={query}
						/>

						{data.filter > 0 ? <FeedCreateButton disabled={isLimitReached} /> : null}
					</Container>
				);
			}}
		</withFeedCountQuery.Suspense>
	);
};
