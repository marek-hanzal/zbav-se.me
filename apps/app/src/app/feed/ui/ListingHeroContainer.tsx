import { ArrowLeftIcon, Icon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { VariantProvider } from "@use-pico/cls";
import type { EntitySchema } from "@use-pico/common/schema";
import type {
	tGallery,
	tListing,
	tListingCollection,
	tListingQuery,
} from "@zbav-se.me/sdk/api/session";
import { withListingScoreCreateMutation } from "@zbav-se.me/sdk/mutation/session";
import { withListingCollectionQuery } from "@zbav-se.me/sdk/query/session";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { PrimaryOverlay } from "@zbav-se.me/ui/overlay";
import { type FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { ListingToolbarContainer } from "~/app/listing/ui/ListingToolbarContainer";
import { HeroImage } from "~/app/ui/img/HeroImage";
import { RatingToIcon } from "~/app/ui/rating/RatingToIcon";

export namespace ListingHeroContainer {
	export interface Props extends Container.Props {
		query: tListingQuery;
		listing: tListing;
		locale: string;
		isVisible: boolean;
	}
}

export const ListingHeroContainer: FC<ListingHeroContainer.Props> = memo(
	({ query, locale, listing, isVisible, tweak, ...props }) => {
		const [hero] = listing.gallery as [
			tGallery,
			...tGallery[],
		];

		const setListingCollection = withListingCollectionQuery.useSet();

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

		const patchListing =
			(patch: Partial<tListing> & EntitySchema.Type) =>
			(
				prev: tListingCollection | undefined,
			): tListingCollection | undefined => {
				if (!prev) {
					return prev;
				}

				return {
					...prev,
					data: prev.data.map((item) => {
						if (item.id === listing.id) {
							return {
								...item,
								...patch,
							};
						}
						return item;
					}),
				};
			};

		const [hasToolbar, setHasToolbar] = useState(false);

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
					visible={isVisible}
					onLoad={() => setHasToolbar(true)}
					errorStatusProps={{
						action: (
							<ListingToolbarContainer
								snapTo={"unset"}
								query={query}
								listing={listing}
								onIgnoreToggle={(toggle) => {
									setListingCollection(
										patchListing({
											id: listing.id,
											isIgnored: toggle,
										}),
										query,
									);
								}}
								onFlagToggle={(toggle) => {
									setListingCollection(
										patchListing({
											id: listing.id,
											hasFlag: toggle,
										}),
										query,
									);
								}}
								tweak={{
									slot: {
										root: {
											class: [
												"flex-row",
												"flex-row-reverse",
											],
										},
									},
								}}
							/>
						),
					}}
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
					height={"content"}
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

				{hasToolbar ? (
					<ListingToolbarContainer
						query={query}
						listing={listing}
						onCartToggle={(toggle) => {
							setListingCollection(
								patchListing({
									id: listing.id,
									isInCart: toggle,
								}),
								query,
							);
						}}
						onIgnoreToggle={(toggle) => {
							setListingCollection(
								patchListing({
									id: listing.id,
									isIgnored: toggle,
								}),
								query,
							);
						}}
						onFlagToggle={(toggle) => {
							setListingCollection(
								patchListing({
									id: listing.id,
									hasFlag: toggle,
								}),
								query,
							);
						}}
					/>
				) : null}

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
