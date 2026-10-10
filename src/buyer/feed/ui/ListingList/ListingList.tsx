import { type Ref, Suspense, useCallback, useEffect, useRef } from "react";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { getRootLogger } from "~/common/log/getRootLogger";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";
import { DeadEndIcon } from "~/common/ui/icon";
import { uiCtaLinkButton } from "~/common/ui/ui";
import { useLocale } from "~/locale/hook/useLocale";
import { useScrollTo } from "~/navigation/hook/useScrollTo";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ChevronLeftIcon } from "~/ui/constant/ChevronLeftIcon";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import { withFallback } from "~/ui/fn/withFallback";
import { useMergeRefs } from "~/ui/hook/useMergeRefs";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { LinkTo } from "~/ui/ui/LinkTo";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { useElementVisibility } from "~/visibility/hook/useElementVisibility";
import { VisibilityProvider } from "~/visibility/ui/VisibilityProvider";
import { VisibleContainer } from "~/visibility/ui/VisibleContainer";
import { Item } from "./Item";

export namespace ListingList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		/**
		 * Listing ID to scroll to
		 */
		scrollToId: string | undefined;
		feedId: string;
		sentinelRef: Ref<HTMLDivElement | null>;
	}
}

export const ListingList = withFallback(
	({ ref, scrollToId, feedId, sentinelRef, ...props }: ListingList.Props) => {
		const translator = useTranslator();
		const locale = useLocale();
		const containerRef = useRef<HTMLDivElement>(null);
		const mergedRef = useMergeRefs([
			containerRef,
			ref,
		]);

		const { data: feed } = withFeedQuery.useFetchQuery(feedId);
		const { data: listingCollection } = withListingQuery.useIdsQuery({
			...feed.query,
			cursor: {
				page: 0,
				size: 256,
			},
		});

		const scrollTo = useScrollTo(containerRef);

		useEffect(() => {
			if (!scrollToId || !containerRef.current) {
				return;
			}
			scrollTo(`[data-id="${scrollToId}"]`, {
				behavior: "instant",
			});
		}, [
			scrollToId,
			scrollTo,
		]);

		const visibility = useElementVisibility({
			scrollerRef: containerRef,
			visible: {},
			proximity: {
				overscan: 4,
			},
		});

		const placeholder = useCallback(() => {
			return <SpinnerContainer />;
		}, []);

		useRenderLogger({
			logger: getRootLogger(),
			name: "ListingList",
			meta: {
				...feed.query,
				cursor: {
					page: 0,
					size: 256,
				},
			},
		});

		return (
			<Container
				ref={mergedRef}
				data-ui={"ListingList[Container]"}
				data-ui-layout="vertical-full"
				data-ui-snap="vertical"
				data-ui-snap-align="center"
				data-ui-height="full"
				{...props}
			>
				<VisibilityProvider store={visibility}>
					{listingCollection.map((listingId) => (
						<VisibleContainer
							key={listingId}
							id={listingId}
							data-id={listingId}
							placeholder={placeholder}
							data-ui-height="full"
							data-ui-width="full"
						>
							<Suspense fallback={<Item.Fallback />}>
								<Item
									_suspense={"I know"}
									listingId={listingId}
									feedId={feedId}
								/>
							</Suspense>
						</VisibleContainer>
					))}

					<EmptyStatus
						ref={sentinelRef}
						icon={DeadEndIcon}
						textTitle={translator.text("Feed - end of road (title)")}
						textMessage={translator.text("Feed - end of road (message)")}
						action={
							<>
								<LinkTo
									icon={ChevronLeftIcon}
									to={"/$locale/app/home"}
									params={{
										locale,
									}}
								>
									<Tx label={"Go home (link)"} />
								</LinkTo>

								<LinkTo
									icon={ChevronRightIcon}
									iconPosition={"right"}
									to={"/$locale/app/buyer/feed/list"}
									params={{
										locale,
									}}
									{...uiCtaLinkButton({})}
								>
									<Tx label={"See other feeds (link)"} />
								</LinkTo>
							</>
						}
					/>
				</VisibilityProvider>
			</Container>
		);
	},
	SpinnerContainer,
);
