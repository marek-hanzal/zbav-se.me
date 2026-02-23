import { useElementVisibility, useLocale, useMergeRefs, useScrollTo } from "@use-pico/client/hook";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tListingQuery } from "@zbav-se.me/sdk/api/buyer-user";
import { type FC, type ReactNode, Suspense, useEffect, useRef } from "react";
import { ListingListContent } from "~/app/@buyer-user/listing/ui/listing-list-container/ListingListContent";

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
			<Suspense
				fallback={<SpinnerContainer data-ui={"ListingListContainer-[SpinnerContainer]"} />}
			>
				<ListingListContent
					query={query}
					renderEmptyFn={renderEmptyFn}
					appendix={appendix}
					feedId={feedId}
					withScore={withScore}
					locale={locale}
					visibility={visibility}
				/>
			</Suspense>
		</Container>
	);
};
