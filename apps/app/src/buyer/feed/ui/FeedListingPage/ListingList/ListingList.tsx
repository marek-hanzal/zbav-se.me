import { LinkTo } from "@use-pico/client/ui/link-to";
import { withFallback } from "@use-pico/client/utils";
import { translator } from "@use-pico/common/translator";
import { type Ref, Suspense, useCallback, useEffect, useRef } from "react";
import { Container } from "@/lib/client/container";
import { ChevronLeftIcon, ChevronRightIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { useMergeRefs } from "@/lib/client/ref";
import { useScrollTo } from "@/lib/client/scroll-to";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import {
	useElementVisibility,
	VisibilityProvider,
	VisibleContainer,
} from "@/lib/client/visibility";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";
import { DeadEndIcon } from "~/common/ui/icon";
import { uiCtaLinkButton } from "~/common/ui/ui";
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
		const locale = useLocale();
		const containerRef = useRef<HTMLDivElement>(null);
		const mergedRef = useMergeRefs([
			containerRef,
			ref,
		]);

		const { data: feed } = withFeedQuery.useFetchQuery(feedId);
		const { data: listingCollection } = withListingQuery.useCollectionQuery({
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

		return (
			<Container
				ref={mergedRef}
				data-ui={"ListingList"}
				ui={{
					layout: "vertical-full",
					snap: "vertical",
					snapAlign: "center",
					height: "full",
				}}
				{...props}
			>
				<VisibilityProvider store={visibility}>
					{listingCollection.map((listingId) => (
						<VisibleContainer
							key={listingId}
							id={listingId}
							data-id={listingId}
							placeholder={placeholder}
							ui={{
								height: "full",
								width: "full",
							}}
						>
							<Suspense fallback={<Item.Fallback />}>
								<Item
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
									{...uiCtaLinkButton({
										className: [],
									})}
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
