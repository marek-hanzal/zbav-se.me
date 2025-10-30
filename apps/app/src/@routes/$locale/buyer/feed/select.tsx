import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	Container,
	LinkTo,
	SnapperNav,
	useScrollTo,
	useSnapperNav,
} from "@use-pico/client";
import { SpinnerSheet, TitleContainer } from "@zbav-se.me/ui";
import { useEffect, useId, useRef } from "react";
import z from "zod";
import { withFeedCollectionQuery } from "~/app/feed/query/withFeedCollectionQuery";
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
				<SpinnerSheet
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
		});

		const snapperRef = useRef<HTMLDivElement>(null);
		const snapperNav = useSnapperNav({
			containerRef: snapperRef,
			orientation: "horizontal",
			count: feedCountLimit,
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
						scroll={"horizontal"}
						snap={"horizontal-start"}
						gap={"md"}
						round={"lg"}
					>
						{Array.from({
							length: feedCountLimit,
						}).map((_, slot) => {
							const disabled =
								slot > 0 &&
								!feedCollectionQuery.data.data[slot - 1];

							return (
								<FeedSelect
									key={`${feedId}-${slot + 1}`}
									locale={locale}
									disabled={disabled}
									feed={feedCollectionQuery.data.data[slot]}
								/>
							);
						})}
					</Container>
				</div>
			</TitleContainer>
		);
	},
});
