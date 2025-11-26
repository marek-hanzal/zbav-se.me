import { ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedCountQuery } from "@zbav-se.me/sdk/query/user";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { FeedList } from "./FeedListContainer/FeedList";

export namespace FeedListContainer {
	export interface Props extends Container.Props, Pick<FeedList.Props, "onDelete"> {
		locale: string;
		query: tFeedQuery;
		limit?: number;
		onClickCreate?: () => void;
	}
}

export const FeedListContainer: FC<FeedListContainer.Props> = ({
	locale,
	query,
	limit = 10,
	onClickCreate,
	onDelete,
	...props
}) => {
	return (
		<withFeedCountQuery.Suspense
			data={{}}
			fallback={<SpinnerContainer />}
		>
			{({ data }) => {
				const isLimitReached = data.filter >= limit;
				const shouldShowCreateButton = onClickCreate !== undefined;

				return (
					<Container
						layout={isLimitReached ? "vertical" : "vertical-content-footer"}
						items={"start"}
						justify={"between"}
						gap={"md"}
						{...props}
					>
						{shouldShowCreateButton && data.filter === 0 ? (
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

						<FeedList
							locale={locale}
							query={query}
							onDelete={onDelete}
						/>

						{shouldShowCreateButton && !isLimitReached && data.filter > 0 ? (
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
			}}
		</withFeedCountQuery.Suspense>
	);
};
