import { useMergeRefs, useScrollTo } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer, VisibleContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { tvc } from "@use-pico/cls";
import type { tListingQuery } from "@zbav-se.me/sdk/api/user";
import { withListingCollectionQuery, withListingFetchQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, type ReactNode, useEffect, useId, useMemo, useRef } from "react";
import { ListingHeroContainer } from "~/app/listing/ui/ListingHeroContainer";

export namespace ListingListContainer {
	export interface Props extends Container.Props {
		locale: string;
		query: tListingQuery;
		/**
		 * Listing ID to scroll to
		 */
		scrollToId: string | undefined;
		renderEmptyFn?(): ReactNode;
		appendix?: ReactNode;
		overlay: ListingHeroContainer.Overlay.Render;
		feedId: string;
	}
}

export const ListingListContainer: FC<ListingListContainer.Props> = ({
	ref,
	locale,
	query,
	scrollToId,
	renderEmptyFn,
	appendix,
	overlay,
	feedId,
	...props
}) => {
	const listingIdPrefix = useId();

	const containerRef = useRef<HTMLDivElement>(null);
	const mergedRef = useMergeRefs([
		containerRef,
		ref,
	]);

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

	// biome-ignore lint/correctness/useExhaustiveDependencies: We don't care about changing "empty" props
	const emptySlot = useMemo(() => {
		return renderEmptyFn ? (
			renderEmptyFn()
		) : (
			<Status
				ui="ListingList-empty"
				key={`${listingIdPrefix}-no-listings`}
				icon={"icon-[streamline--sad-face-remix]"}
				textTitle={"No listings (title)"}
				action={
					<LinkTo
						to={"/$locale/buyer"}
						params={{
							locale,
						}}
					>
						<Button
							iconEnabled={ArrowLeftIcon}
							tone={"secondary"}
							label={"Back to home (link)"}
						/>
					</LinkTo>
				}
			/>
		);
	}, [
		locale,
	]);

	return (
		<Container
			ref={mergedRef}
			ui="ListingList-root"
			layout={"vertical-full"}
			snap={"vertical-start"}
			className={tvc([
				"isolate",
				"overflow-x-clip",
				"overscroll-contain",
				"contain-strict",
				"will-change-scroll",
			])}
			{...props}
		>
			<withListingCollectionQuery.Suspense
				data={query}
				options={{
					staleTime: 60_000 * 30,
					refetchOnWindowFocus: true,
				}}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => {
					if (data.data.length === 0) {
						return emptySlot;
					}

					return data.data.map((listing) => (
						<VisibleContainer
							key={`${listingIdPrefix}-${listing.id}`}
							scrollerRef={containerRef}
							useProximity
							overscan={4}
							delay={200}
							placeholder={(props) => (
								<SpinnerContainer
									ui="ListingList-spinner"
									data-id={listing.id}
									{...props}
								/>
							)}
							className={tvc([
								"[content-visibility:auto]",
								"[contain-intrinsic-size:100dvh]",
							])}
						>
							<withListingFetchQuery.Suspense
								data={{
									where: {
										id: listing.id,
									},
								}}
								fallback={<SpinnerContainer height={"fit"} />}
							>
								{({ data: listing }) => {
									return (
										<ListingHeroContainer
											locale={locale}
											listing={listing}
											overlay={overlay}
											feedId={feedId}
										/>
									);
								}}
							</withListingFetchQuery.Suspense>
						</VisibleContainer>
					));
				}}
			</withListingCollectionQuery.Suspense>

			{appendix}
		</Container>
	);
};
