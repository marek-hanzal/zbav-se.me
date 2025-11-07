import { ArrowLeftIcon, Icon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { tvc, VariantProvider } from "@use-pico/cls";
import type { tGallery, tListing } from "@zbav-se.me/sdk/api/session";
import { withListingScoreCreateMutation } from "@zbav-se.me/sdk/mutation";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { type FC, memo, useCallback, useEffect, useRef } from "react";
import { HeroImage } from "~/app/ui/img/HeroImage";
import { RatingToIcon } from "~/app/ui/rating/RatingToIcon";

export namespace ListingPreview {
	export interface Props {
		listing: tListing;
		locale: string;
		isVisible: boolean;
	}
}

export const ListingPreview: FC<ListingPreview.Props> = memo(
	({ locale, listing, isVisible }) => {
		const [hero] = listing.gallery as [
			tGallery,
			...tGallery[],
		];

		const listingScoreCreateMutation =
			withListingScoreCreateMutation.useMutation({
				retry: () =>
					isVisible && document.visibilityState === "visible",
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
					score: 1,
				});
			}, 2000);
		}, [
			isVisible,
			listing.id,
			listingScoreCreateMutation,
		]);

		useEffect(() => {
			if (isVisible) {
				arm();
			} else {
				clearTimer();
			}
			return () => {
				clearTimer();
			};
		}, [
			isVisible,
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
			<div
				data-id={listing.id}
				className={tvc([
					"ListingPreview-root",
					`ListingPreview-${listing.id}`,
					"relative",
				])}
			>
				<HeroImage
					src={hero.upload.url}
					alt={`Hero image for listing ${listing.id}`}
					className={"w-full h-full object-cover"}
				/>

				<div
					className={
						"absolute top-2 left-2 flex flex-row gap-2 items-center"
					}
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
				</div>

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

				{/* <VariantProvider
						cls={ThemeCls}
						variant={{
							tone: "secondary",
							theme: "light",
						}}
					>
						<Badge
							size={"lg"}
							snapTo={"bottom-left"}
							round={"md"}
						>
							<TypoIcon
								icon={ExpireIcon}
								iconProps={{
									size: "xs",
								}}
							>
								{toTimeDiff({
									time: listing.expiresAt,
								})}
							</TypoIcon>
						</Badge>
					</VariantProvider> */}

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
			</div>
		);
	},
);
