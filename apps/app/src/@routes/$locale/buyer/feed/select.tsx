import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	Container,
	LinkTo,
	SnapperNav,
	Status,
	useScrollTo,
	useSnapperNav,
} from "@use-pico/client";
import { FeedIcon, SpinnerContainer, TitleContainer } from "@zbav-se.me/ui";
import { useEffect, useId, useRef } from "react";
import z from "zod";
import { withFeedCollectionQuery } from "~/app/feed/query/withFeedCollectionQuery";
import { withFeedCountQuery } from "~/app/feed/query/withFeedCountQuery";
import { FeedSelect } from "~/app/feed/ui/FeedSelect";

export const Route = createFileRoute("/$locale/buyer/feed/select")({
	validateSearch: z.object({
		feedId: z.string().optional(),
	}),
	ssr: false,
	pendingComponent() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"Feed select (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer"}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
			>
				<SpinnerContainer
					disableOverlay
					tone={"unset"}
					theme={"unset"}
					square={"unset"}
				/>
			</TitleContainer>
		);
	},
	component() {
		const { locale } = Route.useParams();
		const search = Route.useSearch();

		const feedCountLimit = 10;

		const feedCollectionQuery = withFeedCollectionQuery.useSuspenseQuery({
			cursor: {
				page: 0,
				size: feedCountLimit,
			},
			sort: [
				{
					value: "updatedAt",
					sort: "asc",
				},
			],
		});

		const feedCountQuery = withFeedCountQuery.useSuspenseQuery({});

		const snapperRef = useRef<HTMLDivElement>(null);
		const snapperNav = useSnapperNav({
			containerRef: snapperRef,
			orientation: "horizontal",
			count:
				feedCountQuery.data.filter < feedCountLimit
					? feedCountQuery.data.filter + 1
					: feedCountQuery.data.filter,
		});
		const feedId = useId();
		const hasFeeds = feedCollectionQuery.data.data.length > 0;
		const scrollTo = useScrollTo(snapperRef);

		useEffect(() => {
			if (!search.feedId) {
				return;
			}
			scrollTo(`.FeedItem-${search.feedId}`, {
				axis: "x",
			});
		}, [
			feedCollectionQuery.data,
		]);

		return (
			<TitleContainer
				textTitle={"Feed select (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer"}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
			>
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

						{feedCountQuery.data.filter >= feedCountLimit ? null : (
							<Status
								icon={FeedIcon}
								iconProps={{
									size: "4xl",
								}}
								textTitle={"Create new feed (title)"}
								action={
									<LinkTo
										to={
											"/$locale/buyer/feed/wizard/location"
										}
										params={{
											locale,
										}}
										tone={"primary"}
										display={"block"}
									>
										<Button
											iconEnabled={ArrowRightIcon}
											iconPosition={"right"}
											label={"Create new feed (button)"}
											tone={"primary"}
											theme={"dark"}
											size={"xl"}
										/>
									</LinkTo>
								}
							/>
						)}
					</Container>
				</div>
			</TitleContainer>
		);
	},
});
