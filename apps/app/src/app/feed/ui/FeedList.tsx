import {
	ArrowRightIcon,
	Button,
	Container,
	EditIcon,
	SnapperNav,
	Status,
	useScrollTo,
	useSnapperNav,
} from "@use-pico/client";
import type { tFeedQuery } from "@zbav-se.me/sdk";
import { type FC, useEffect, useId, useRef } from "react";
import { withFeedCollectionQuery } from "~/app/feed/query/withFeedCollectionQuery";
import { withFeedCountQuery } from "~/app/feed/query/withFeedCountQuery";
import { FeedSelect } from "~/app/feed/ui/FeedSelect";

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
	scrollTo: scrollToFeedId,
	onClickCreate,
}) => {
	const feedCollectionQuery = withFeedCollectionQuery.useSuspenseQuery(query);
	const feedCountQuery = withFeedCountQuery.useSuspenseQuery({});

	const snapperRef = useRef<HTMLDivElement>(null);
	const shouldShowCreateButton =
		onClickCreate !== undefined &&
		feedCountQuery.data.filter < feedCountLimit;
	const snapperNav = useSnapperNav({
		containerRef: snapperRef,
		orientation: "horizontal",
		count: shouldShowCreateButton
			? feedCountQuery.data.filter + 1
			: feedCountQuery.data.filter,
	});
	const feedId = useId();
	const hasFeeds = feedCollectionQuery.data.data.length > 0;
	const scrollTo = useScrollTo(snapperRef);

	useEffect(() => {
		if (!scrollToFeedId) {
			return;
		}
		scrollTo(`.FeedItem-${scrollToFeedId}`, {
			axis: "x",
		});
	}, [
		scrollToFeedId,
		scrollTo,
	]);

	return (
		<div className={"relative"}>
			<SnapperNav
				snapperNav={snapperNav}
				orientation={"horizontal"}
				iconProps={() => ({
					size: "sm",
				})}
				tweak={{
					slot: {
						root: {
							class: [
								"bottom-1",
								"transition-opacity",
								hasFeeds ? "opacity-60" : "opacity-0",
							],
						},
					},
				}}
				subtle={false}
			/>

			<Container
				ref={snapperRef}
				layout="horizontal-full"
				snap={"horizontal-start"}
				gap={"md"}
				round={"lg"}
			>
				{feedCollectionQuery.data.data.map((feed) => {
					return (
						<FeedSelect
							key={`${feedId}-${feed.id}`}
							locale={locale}
							feed={feed}
						/>
					);
				})}

				{shouldShowCreateButton ? (
					<Status
						icon={EditIcon}
						iconProps={{
							size: "4xl",
						}}
						textTitle={"Create new feed (title)"}
						action={
							<Button
								iconEnabled={ArrowRightIcon}
								iconPosition={"right"}
								label={"Create new feed (button)"}
								tone={"primary"}
								theme={"dark"}
								size={"xl"}
								onClick={onClickCreate}
							/>
						}
					/>
				) : null}
			</Container>
		</div>
	);
};
