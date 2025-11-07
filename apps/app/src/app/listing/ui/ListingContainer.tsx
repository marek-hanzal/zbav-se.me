import { ArrowLeftIcon, Icon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { VariantProvider } from "@use-pico/cls";
import type { tGallery, tListing } from "@zbav-se.me/sdk/api/session";
import { withListingScoreCreateMutation } from "@zbav-se.me/sdk/mutation";
import { withListingFeedInfiniteQuery } from "@zbav-se.me/sdk/query";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { PrimaryOverlay } from "@zbav-se.me/ui/overlay";
import { type FC, memo, useCallback, useEffect, useRef } from "react";
import { ListingToolbarContainer } from "~/app/listing/ui/ListingToolbarContainer";
import { HeroImage } from "~/app/ui/img/HeroImage";
import { RatingToIcon } from "~/app/ui/rating/RatingToIcon";

export namespace ListingContainer {
	export interface Props extends Container.Props {
		feedId: string;
		listing: tListing;
		locale: string;
		isVisible: boolean;
	}
}

export const ListingContainer: FC<ListingContainer.Props> = memo(
	({ feedId, locale, listing, isVisible, tweak, ...props }) => {
		const [hero] = listing.gallery as [
			tGallery,
			...tGallery[],
		];

		const patchListing = withListingFeedInfiniteQuery({
			feedId,
			size: 5,
		}).usePatch({});

		const listingScoreCreateMutation =
			withListingScoreCreateMutation.useMutation({
				retry: () => {
					return isVisible && document.visibilityState === "visible";
				},
				retryDelay(_, error) {
					if ("type" in error && error.type === "error") {
						/**
						 * Delay at least for 5 minutes; backend is hardened, but point is to prevent spamming.
						 */
						return 1000 * 60 * 5;
					}
					return 250;
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

			if (
				!isVisible ||
				timerRef.current ||
				listingScoreCreateMutation.isPending
			) {
				return;
			}

			timerRef.current = setTimeout(async () => {
				timerRef.current = null;
				if (!isVisible || document.visibilityState !== "visible") {
					return;
				}

				await listingScoreCreateMutation.mutateAsync({
					listingId: listing.id,
					score: "listing",
				});
			}, 2000);
		}, [
			isVisible,
			listing.id,
			listingScoreCreateMutation,
		]);

		useEffect(() => {
			if (isVisible && !listing.isIgnored) {
				arm();
			} else {
				clearTimer();
			}
			return () => {
				clearTimer();
			};
		}, [
			isVisible,
			listing.isIgnored,
			arm,
			clearTimer,
		]);

		useEffect(() => {
			const onVisibilityState = () => {
				if (document.visibilityState !== "visible") {
					clearTimer();
				} else {
					arm();
				}
			};
			document.addEventListener("visibilitychange", onVisibilityState);
			return () =>
				document.removeEventListener(
					"visibilitychange",
					onVisibilityState,
				);
		}, [
			arm,
			clearTimer,
		]);

		return (
			<Container
				data-id={listing.id}
				tweak={[
					tweak,
					{
						slot: {
							root: {
								class: [
									"ListingPreview-root",
									`ListingPreview-${listing.id}`,
								],
							},
						},
					},
				]}
				position={"relative"}
				{...props}
			>
				{listing.isIgnored ? (
					<PrimaryOverlay
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

				<HeroImage
					src={hero.upload.url}
					alt={`Hero image for listing ${listing.id}`}
					className={"w-full h-full object-cover"}
				/>

				<Container
					snapTo={"top-left"}
					tweak={{
						slot: {
							root: {
								class: [
									"z-100",
								],
							},
						},
					}}
				>
					<LinkTo
						to={"/$locale/buyer/feed/select"}
						params={{
							locale,
						}}
					>
						<Badge
							tone={"secondary"}
							size={"lg"}
							round={"full"}
							tweak={{
								slot: {
									root: {
										class: [
											"p-2",
											"opacity-65",
										],
									},
								},
							}}
						>
							<Icon icon={ArrowLeftIcon} />
						</Badge>
					</LinkTo>
				</Container>

				<Badge
					tone={"secondary"}
					theme={"dark"}
					size={"lg"}
					round={"md"}
					snapTo={"top-center"}
					tweak={{
						slot: {
							root: {
								class: [
									"border-none",
									"shadow-none",
								],
							},
						},
					}}
				>
					{listing.price > 0 ? (
						<PriceInline
							price={listing.price}
							locale={locale}
							currency={listing.currency}
						/>
					) : (
						<Tx label={"Price - free"} />
					)}
				</Badge>

				<Badge
					tone={"secondary"}
					size={"lg"}
					round={"full"}
					snapTo={"top-right"}
					tweak={{
						slot: {
							root: {
								class: [
									"p-2",
									"opacity-75",
								],
							},
						},
					}}
				>
					<Icon
						icon={
							RatingToIcon[
								listing.condition as RatingToIcon.Value
							]
						}
					/>
				</Badge>

				<ListingToolbarContainer
					listing={listing}
					onCartToggle={(toggle) => {
						patchListing({
							id: listing.id,
							isInCart: toggle,
						});
					}}
					onIgnoreToggle={(toggle) => {
						patchListing({
							id: listing.id,
							isIgnored: toggle,
						});
					}}
					onFlagToggle={(toggle) => {
						patchListing({
							id: listing.id,
							hasFlag: toggle,
						});
					}}
				/>

				<VariantProvider
					cls={ThemeCls}
					variant={{
						tone: "secondary",
						theme: "light",
					}}
				>
					<Badge
						size={"lg"}
						round={"md"}
						snapTo={"bottom"}
						tweak={{
							slot: {
								root: {
									class: [
										"opacity-85",
										"overflow-hidden",
									],
								},
							},
						}}
					>
						<Typo
							truncate
							label={listing.location.address}
						/>
					</Badge>
				</VariantProvider>
			</Container>
		);
	},
);
