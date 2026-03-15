import { useElementVisibility, useMergeRefs, useScrollTo } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { tListingQuery } from "@zbav-se.me/sdk/api/buyer";
import { type FC, type ReactNode, Suspense, useEffect, useRef } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace ListingList {
	export interface Props extends Container.Props {
		query: tListingQuery;
		/**
		 * Listing ID to scroll to
		 */
		scrollToId: string | undefined;
		appendix?: ReactNode;
		feedId: string;
		withScore: boolean;
	}
}

export const ListingList: FC<ListingList.Props> = ({
	ref,
	query,
	scrollToId,
	appendix,
	feedId,
	withScore,
	...props
}) => {
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
			data-ui={"ListingList"}
			ui={{
				layout: "vertical-full",
				snap: "vertical",
				snapAlign: "center",
				height: "full",
			}}
			{...props}
		>
			<Suspense fallback={<Pending />}>
				<Data
					query={query}
					appendix={appendix}
					feedId={feedId}
					withScore={withScore}
					visibility={visibility}
				/>
			</Suspense>
		</Container>
	);
};
