import { VisibilityProvider } from "@use-pico/client/context";
import { useElementVisibility, useLocale, useMergeRefs, useScrollTo } from "@use-pico/client/hook";
import { ChevronLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer, VisibleContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import type { tListingQuery } from "@zbav-se.me/sdk/api/buyer-user";
import {
	withListingCollectionQuery,
	withListingFetchQuery,
} from "@zbav-se.me/sdk/query/buyer-user/listing";
import { type FC, type ReactNode, useEffect, useRef } from "react";
import { Hero } from "~/app/@buyer-user/listing/ui/Hero";

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
		proximity: {
			overscan: 4,
		},
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
					if (data.length === 0) {
						return renderEmptyFn ? (
							renderEmptyFn()
						) : (
							<Status
								data-ui={"ListingListContainer-[Status-empty]"}
								key={"no-listings"}
								icon={"icon-[streamline--sad-face-remix]"}
								textTitle={translator.text("No listings (title)")}
								action={
									<LinkTo
										to={"/$locale/flow/home"}
										params={{
											locale,
										}}
									>
										<Button
											iconEnabled={ChevronLeftIcon}
											label={translator.text("Back to home (link)")}
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
						<VisibilityProvider store={visibility}>
							{data.map((listing) => (
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
														"thumb",
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
