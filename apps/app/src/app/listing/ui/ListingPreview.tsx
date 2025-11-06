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
import { type FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { HeroImage } from "~/app/ui/img/HeroImage";
import { RatingToIcon } from "~/app/ui/rating/RatingToIcon";

export namespace ListingPreview {
	export interface Props {
		listing: tListing;
		locale: string;
	}
}

export const ListingPreview: FC<ListingPreview.Props> = memo(
	({ locale, listing }) => {
		const [hero] = listing.gallery as [
			tGallery,
			...tGallery[],
		];

		const containerRef = useRef<HTMLDivElement>(null);
		const timerRef = useRef<NodeJS.Timeout | null>(null);
		const [isInViewport, setIsInViewport] = useState(false);

		const scoreMutation = withListingScoreCreateMutation.useMutation();

		const sendViewScore = useCallback(() => {
			if (scoreMutation.isPending) {
				return;
			}

			const isTabVisible = document.visibilityState === "visible";

			if (!isTabVisible) {
				return;
			}

			scoreMutation.mutate({
				listingId: listing.id,
				score: 0,
			});
		}, [
			scoreMutation,
			listing.id,
		]);

		useEffect(() => {
			const container = containerRef.current;
			if (!container) {
				return;
			}

			const observer = new IntersectionObserver(
				(entries) => {
					const [entry] = entries;
					if (!entry) {
						return;
					}
					if (entry.isIntersecting) {
						setIsInViewport(true);
						return;
					}

					setIsInViewport(false);
					if (timerRef.current) {
						clearTimeout(timerRef.current);
						timerRef.current = null;
					}
				},
				{
					threshold: 0.5,
				},
			);

			observer.observe(container);

			return () => {
				observer.disconnect();
				if (timerRef.current) {
					clearTimeout(timerRef.current);
				}
			};
		}, []);

		useEffect(() => {
			if (!isInViewport) {
				return;
			}

			const isTabVisible = document.visibilityState === "visible";
			if (!isTabVisible) {
				return;
			}

			timerRef.current = setTimeout(() => {
				sendViewScore();
			}, 1600);

			return () => {
				if (timerRef.current) {
					clearTimeout(timerRef.current);
					timerRef.current = null;
				}
			};
		}, [
			isInViewport,
			sendViewScore,
		]);

		useEffect(() => {
			const handleVisibilityChange = () => {
				if (document.visibilityState === "hidden") {
					if (timerRef.current) {
						clearTimeout(timerRef.current);
						timerRef.current = null;
					}
				} else if (
					document.visibilityState === "visible" &&
					isInViewport
				) {
					timerRef.current = setTimeout(() => {
						sendViewScore();
					}, 1600);
				}
			};

			document.addEventListener(
				"visibilitychange",
				handleVisibilityChange,
			);

			return () => {
				document.removeEventListener(
					"visibilitychange",
					handleVisibilityChange,
				);
			};
		}, [
			isInViewport,
			sendViewScore,
		]);

		return (
			<div
				ref={containerRef}
				className={tvc([
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
