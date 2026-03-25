import { VisibilityProvider } from "@use-pico/client/context";
import { useElementVisibility, useLocale, useMergeRefs, useScrollTo } from "@use-pico/client/hook";
import { ChevronLeftIcon, ChevronRightIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import {
	Container,
	SpinnerContainer,
	VisibleContainer,
	SpinnerContainer as VisibleSpinnerContainer,
} from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { withFallback } from "@use-pico/client/utils";
import { translator } from "@use-pico/common/translator";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import { DeadEndIcon } from "@zbav-se.me/ui/icon";
import { uiCtaLinkButton } from "@zbav-se.me/ui/ui";
import { type Ref, Suspense, useCallback, useEffect, useRef } from "react";
import { EmptyStatus } from "~/client/@common/status/ui/EmptyStatus";
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
			return <VisibleSpinnerContainer />;
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
