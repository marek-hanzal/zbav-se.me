import { useMergeRefs, useScrollTo } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer, VisibleContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import type { tListingQuery } from "@zbav-se.me/sdk/api/user";
import { withListingCollectionQuery, withListingFetchQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, type ReactNode, useEffect, useId, useMemo, useRef } from "react";
import { Hero } from "~/app/listing/ui/Hero";

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
		feedId: string;
		withScore: boolean;
	}
}

export const ListingListContainer: FC<ListingListContainer.Props> = ({
	ref,
	locale,
	query,
	scrollToId,
	renderEmptyFn,
	appendix,
	feedId,
	withScore,
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
				data-ui={"ListingListContainer-[Status-empty]"}
				key={`${listingIdPrefix}-no-listings`}
				icon={"icon-[streamline--sad-face-remix]"}
				textTitle={"No listings (title)"}
				action={
					<LinkTo
						to={"/$locale/ui/buyer"}
						params={{
							locale,
						}}
					>
						<Button
							iconEnabled={ArrowLeftIcon}
							label={"Back to home (link)"}
							ui={{
								tone: "secondary",
							}}
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
			data-ui={"ListingListContainer[Container]"}
			ui={{
				layout: "vertical-full",
				snap: "vertical",
				snapAlign: "center",
				height: "full",
			}}
			{...props}
		>
			<withListingCollectionQuery.Suspense
				data={query}
				fallback={<SpinnerContainer data-ui={"ListingListContainer-[SpinnerContainer]"} />}
			>
				{({ data }) => {
					if (data.data.length === 0) {
						return emptySlot;
					}

					return (
						<>
							{data.data.map((listing) => (
								<VisibleContainer
									key={`${listingIdPrefix}-${listing.id}`}
									data-ui="ListingListContainer-[VisibleContainer]"
									scrollerRef={containerRef}
									useProximity
									overscan={4}
									delayMs={200}
									placeholder={(props) => (
										<SpinnerContainer
											data-ui={
												"ListingListContainer-[SpinnerContainer.placeholder]"
											}
											data-id={listing.id}
											{...props}
										/>
									)}
									ui={{
										height: "full",
										width: "full",
									}}
								>
									<withListingFetchQuery.Suspense
										data={{
											where: {
												id: listing.id,
											},
										}}
										fallback={
											<SpinnerContainer
												data-ui={
													"ListingListContainer-[SpinnerContainer.listing-fetch]"
												}
											/>
										}
									>
										{({ data: listing }) => {
											return (
												<Hero
													data-ui={
														"ListingListContainer-[ListingHeroContainer]"
													}
													locale={locale}
													listing={listing}
													// overlay={overlay}
													feedId={feedId}
													withScore={withScore}
												/>
											);
										}}
									</withListingFetchQuery.Suspense>
								</VisibleContainer>
							))}

							{appendix}
						</>
					);
				}}
			</withListingCollectionQuery.Suspense>
		</Container>
	);
};
