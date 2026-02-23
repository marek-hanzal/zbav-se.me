import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useSentinel } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import { FlowContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { Suspense, useRef, useState } from "react";
import z from "zod";
import { FeedEditorSheet } from "~/app/@buyer-user/feed/ui/list-route/FeedEditorSheet";
import { FeedListStatus } from "~/app/@buyer-user/feed/ui/list-route/FeedListStatus";
import { FeedSetupButton } from "~/app/@buyer-user/feed/ui/list-route/FeedSetupButton";
import { FirstListingStatus } from "~/app/@buyer-user/feed/ui/list-route/FirstListingStatus";
import { ListingListContainer } from "~/app/@buyer-user/listing/ui/ListingListContainer";

export const Route = createFileRoute("/$locale/flow/buyer/feed/$id/list")({
	validateSearch: z.object({
		/**
		 * If needed, we can restore scroll position to a particular listing.
		 */
		scrollToId: z.string().optional(),
	}),
	async loader({ context: { queryClient }, params: { id } }) {
		/**
		 * This will force update "updatedAt" field, so we'll mark "this" feed as the "last visited" one.
		 */
		const feed = await withFeedPatchMutation.mutate(queryClient, {
			patch: {},
			query: {
				where: {
					id,
				},
			},
		});

		return {
			feed,
		};
	},
	/**
	 * We've loader, so we also need pending component.
	 */
	pendingComponent() {
		return (
			<FlowContainer>
				<SpinnerContainer />
			</FlowContainer>
		);
	},
	component() {
		const { locale } = Route.useParams();
		const router = useRouter();
		const { scrollToId } = Route.useSearch();
		const containerRef = useRef<HTMLDivElement>(null);
		const [isFeedSettings, setIsFeedSettings] = useState(false);
		const { feed } = Route.useLoaderData();

		/**
		 * The trick - fetch _any_ listing, so we know, if the app is empty.
		 *
		 * Using collection, because "fetch" throws error on 4o4.
		 */
		const listingQuery = withListingQuery.useCollectionQuery({
			cursor: {
				page: 0,
				size: 1,
			},
		});

		const { sentinelRef, inView: isLast } = useSentinel<HTMLDivElement>({
			containerRef,
			threshold: 0.25,
		});

		return (
			<FlowContainer
				data-ui={"/buyer/feed/$id/list[FlowContainer]"}
				left={
					<LinkTo
						{...uiBackButton({
							ui: {
								opacity: isLast ? "full" : "low",
							},
							className: [],
						})}
						data-ui={"/buyer/feed/$id/list-[LinkTo.left]"}
						icon={ArrowLeftIcon}
						to={"/$locale/flow/home"}
						params={{
							locale,
						}}
						className={"transition-all"}
					/>
				}
			>
				{listingQuery.data.length > 0 ? (
					<>
						<FeedSetupButton
							state={{
								value: isFeedSettings,
								set: setIsFeedSettings,
							}}
							ui={{
								opacity: isLast ? "full" : "low",
							}}
							className={"transition-all"}
						/>

						<ListingListContainer
							data-ui={"/buyer/feed/$id/list-[ListingListContainer]"}
							ref={containerRef}
							feedId={feed.id}
							/**
							 * Listings in feed should be scored.
							 */
							withScore
							query={{
								...feed.query,
								sort: feed.query.sort?.length
									? feed.query.sort
									: [
											{
												field: "createdAt",
												order: "desc",
											},
										],
								meta: {
									feedId: feed.id,
									...feed.query.meta,
								},
								/**
								 * Hardcoded cursor to fetch the first page; we're assuming an user won't go through
								 * thousands of listings, so we can do hard cap here.
								 */
								cursor: {
									page: 0,
									size: 256,
								},
							}}
							scrollToId={scrollToId}
							renderEmptyFn={() => (
								<FeedListStatus
									ref={sentinelRef}
									mode={"empty"}
									state={{
										value: isFeedSettings,
										set: setIsFeedSettings,
									}}
								/>
							)}
							appendix={
								<FeedListStatus
									ref={sentinelRef}
									mode={"appendix"}
									state={{
										value: isFeedSettings,
										set: setIsFeedSettings,
									}}
								/>
							}
						/>
					</>
				) : null}

				{listingQuery.data.length > 0 ? null : <FirstListingStatus />}

				<Suspense fallback={null}>
					<FeedEditorSheet
						feedId={feed.id}
						state={{
							value: isFeedSettings,
							set: setIsFeedSettings,
						}}
						onRefresh={() => {
							setIsFeedSettings(false);
							setTimeout(() => router.invalidate(), 200);
						}}
					/>
				</Suspense>
			</FlowContainer>
		);
	},
});
