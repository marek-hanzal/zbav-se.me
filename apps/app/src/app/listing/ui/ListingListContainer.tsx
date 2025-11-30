import { useScrollTo } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer, VisibleContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { tvc } from "@use-pico/cls";
import type { tListingQuery } from "@zbav-se.me/sdk/api/user";
import { withListingCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, type ReactNode, useEffect, useId, useMemo, useRef } from "react";
import type { ListingDetailMenu } from "~/app/listing/ui/ListingDetailMenu";
import { ListingHeroContainer } from "~/app/listing/ui/ListingHeroContainer";

export namespace ListingListContainer {
	export interface Props extends Container.Props {
		locale: string;
		query: tListingQuery;
		/**
		 * Listing ID to scroll to
		 */
		scrollToListingId?: string;
		renderEmptyFn?(): ReactNode;
		appendix?: ReactNode;
		overlay: ListingHeroContainer.Overlay.Render;
		tools?: ListingDetailMenu.Tools[];
	}
}

export const ListingListContainer: FC<ListingListContainer.Props> = ({
	locale,
	query,
	scrollToListingId,
	renderEmptyFn,
	appendix,
	overlay,
	tools,
	...props
}) => {
	const listingIdPrefix = useId();

	const containerRef = useRef<HTMLDivElement>(null);

	const scrollTo = useScrollTo(containerRef);

	useEffect(() => {
		if (!scrollToListingId || !containerRef.current) {
			return;
		}
		scrollTo(`[data-id="${scrollToListingId}"]`, {
			behavior: "instant",
		});
	}, [
		scrollToListingId,
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
						to={"/$locale/buyer/feed/select"}
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
			ref={containerRef}
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
							<ListingHeroContainer
								locale={locale}
								query={query}
								listing={listing}
								overlay={overlay}
								tools={tools}
							/>
						</VisibleContainer>
					));
				}}
			</withListingCollectionQuery.Suspense>

			{appendix}
		</Container>
	);
};
