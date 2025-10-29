import { createFileRoute } from "@tanstack/react-router";
import { Container, SnapperNav, useSnapperNav } from "@use-pico/client";
import { SpinnerSheet } from "@zbav-se.me/ui";
import { useId, useRef } from "react";
import { withFeedCollectionQuery } from "~/app/feed/query/withFeedCollectionQuery";
import { FeedSelect } from "~/app/feed/ui/FeedSelect";

export const Route = createFileRoute("/$locale/buyer/feed/select")({
	ssr: false,
	pendingComponent() {
		return <SpinnerSheet />;
	},
	component() {
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

		return (
			<Container layout={"vertical-content"}>
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
						overflow={"horizontal"}
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
									disabled={disabled}
									feed={feedCollectionQuery.data.data[slot]}
								/>
							);
						})}
					</Container>
				</div>
			</Container>
		);
	},
});
