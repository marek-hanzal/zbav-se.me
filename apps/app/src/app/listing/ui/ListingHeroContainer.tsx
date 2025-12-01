import { useVisibilityContext } from "@use-pico/client/context";
import { useDocumentVisibility, useMergeRefs } from "@use-pico/client/hook";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Overlay } from "@use-pico/client/ui/overlay";
import { ListingDetailContainer } from "@zbav-se.me/common/listing";
import type { tGalleryItem, tListing, tListingQuery } from "@zbav-se.me/sdk/api/user";
import { withListingScoreCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, type ReactNode, useCallback, useEffect, useId, useRef, useState } from "react";
import { ListingDetailMenu } from "~/app/listing/ui/ListingDetailMenu";

export namespace ListingHeroContainer {
	export namespace Overlay {
		export interface Props {
			query: tListingQuery;
			listing: tListing;
		}

		export type Render = (props: Props) => ReactNode;
	}

	/**
	 * Props for `ListingHeroContainer`.
	 */
	export interface Props extends Container.Props {
		locale: string;
		/**
		 * Active listing query used for local cache updates.
		 */
		query: tListingQuery;
		/**
		 * Listing entity shown inside the hero preview.
		 */
		listing: tListing;
		overlay: Overlay.Render;
		tools?: ListingDetailMenu.Tools[];
	}
}

/**
 * Listing hero is a preview card for a single listing, typically rendered inside feed or listing lists while keeping actions reachable.
 *
 * @param props Component props extending `Container.Props`.
 */
export const ListingHeroContainer: FC<ListingHeroContainer.Props> = ({
	locale,
	ref,
	query,
	listing,
	tools,
	overlay,
	tweak,
	...props
}) => {
	const [hero] = listing.gallery.items as [
		tGalleryItem,
		...tGalleryItem[],
	];

	const rootRef = useRef<HTMLDivElement>(null);

	const detailSheetId = useId();
	const [detail, setDetail] = useState(false);

	const mergeRef = useMergeRefs([
		rootRef,
		ref,
	]);

	const useVisibilityStore = useVisibilityContext();
	const visible = useVisibilityStore((store) => store.visible);

	const listingScoreCreateMutation = withListingScoreCreateMutation.useMutation({
		retry: () => {
			return visible && document.visibilityState === "visible";
		},
		retryDelay(count) {
			if (count >= 3) {
				return 0;
			}
			return 1000 * 60 * 5;
		},
	});

	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clearTimer = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	const arm = useCallback(() => {
		if (document.visibilityState !== "visible") {
			return;
		}

		if (!visible || timerRef.current || listingScoreCreateMutation.isPending) {
			return;
		}

		timerRef.current = setTimeout(async () => {
			timerRef.current = null;
			if (!visible || document.visibilityState !== "visible") {
				return;
			}

			await listingScoreCreateMutation.mutateAsync({
				listingId: listing.id,
				score: "listing",
			});
		}, 2000);
	}, [
		visible,
		listing.id,
		listingScoreCreateMutation,
	]);

	useEffect(() => {
		if (visible && !listing.isIgnored) {
			arm();
		} else {
			clearTimer();
		}
		return () => {
			clearTimer();
		};
	}, [
		visible,
		listing.isIgnored,
		arm,
		clearTimer,
	]);

	useDocumentVisibility({
		onVisible: arm,
		onHidden: clearTimer,
	});

	return (
		<>
			<Container
				ref={mergeRef}
				data-id={listing.id}
				ui={"ListingHero-root"}
				position={"relative"}
				onClick={() => {
					setDetail((prev) => !prev);
				}}
				{...props}
			>
				{listing.isIgnored ? (
					<Overlay
						tweak={{
							slot: {
								root: {
									class: [
										"bg-rose-600/50",
										"opacity-100",
									],
								},
							},
						}}
					/>
				) : null}

				{overlay({
					query,
					listing,
				})}

				<HeroImage
					ui={"ListingHero-image"}
					src={hero.upload.url}
					alt={`Hero image for listing ${listing.id}`}
					visible={visible}
					invisible={<SpinnerContainer ui={"ListingHero-spinner"} />}
				/>
			</Container>

			<BottomSheet
				id={detailSheetId}
				isOpen={detail}
				onClose={() => setDetail(false)}
				detent={"full"}
			>
				<ListingDetailContainer
					parentSheetId={detailSheetId}
					locale={locale}
					listing={listing}
					withScore
				>
					<ListingDetailMenu
						locale={locale}
						listing={listing}
						tools={tools}
					/>
				</ListingDetailContainer>
			</BottomSheet>
		</>
	);
};
