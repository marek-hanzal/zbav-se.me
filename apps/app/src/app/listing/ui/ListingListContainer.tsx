import { VisibilityProvider } from "@use-pico/client/context";
import { useElementVisibility, useLocale, useMergeRefs, useScrollTo } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer, VisibleContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import type { tListingQuery } from "@zbav-se.me/sdk/api/user";
import { withListingCollectionQuery, withListingFetchQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, type ReactNode, useEffect, useRef } from "react";
import { Hero } from "~/app/listing/ui/Hero";

export namespace ListingListContainer {
	export interface Props extends Container.Props {
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
	query,
	scrollToId,
	renderEmptyFn,
	appendix,
	feedId,
	withScore,
	...props
}) => {
	const locale = useLocale();

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

	const visibility = useElementVisibility({
		scrollerRef: containerRef,
		visible: {},
	});

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
						return renderEmptyFn ? (
							renderEmptyFn()
						) : (
							<Status
								data-ui={"ListingListContainer-[Status-empty]"}
								key={"no-listings"}
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
					}

					return (
						<VisibilityProvider state={visibility}>
							{data.data.map((listing) => (
								<VisibleContainer
									key={listing.id}
									id={listing.id}
									data-ui="ListingListContainer-[VisibleContainer]"
									placeholder={() => (
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
											meta: query.meta,
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
													listing={listing}
													feedId={feedId}
													withScore={withScore}
													tools={[
														"destructive",
														"hero",
													]}
												/>
											);
										}}
									</withListingFetchQuery.Suspense>
								</VisibleContainer>
							))}

							{appendix}
						</VisibilityProvider>
					);
				}}
			</withListingCollectionQuery.Suspense>
		</Container>
	);
};
