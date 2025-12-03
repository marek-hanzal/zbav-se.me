import { Icon, ShowIcon, SpinnerIcon } from "@use-pico/client/icon";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { Tx } from "@use-pico/client/ui/tx";
import { VariantProvider } from "@use-pico/cls";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { CategoryInline } from "@zbav-se.me/common/category";
import type { tGalleryItem, tListing } from "@zbav-se.me/sdk/api/user";
import { withListingScoreCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { withListingMetricsFetchQuery } from "@zbav-se.me/sdk/query/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useEffect, useState } from "react";
import { ListingLocation } from "./ListingLocation";
import { ListingPrice } from "./ListingPrice";
import { ScoreContainer } from "./ScoreContainer";

export namespace ListingDetailContainer {
	export interface Props extends Container.Props {
		locale: string;
		listing: tListing;
		/**
		 * Should the listing emit the score event?
		 */
		withScore: boolean;
		withHero?: boolean;
		/**
		 * Used for bottom sheet stacking effect.
		 */
		parentSheetId: string | undefined;
	}
}

export const ListingDetailContainer: FC<ListingDetailContainer.Props> = ({
	locale,
	listing,
	children,
	withScore,
	withHero = true,
	parentSheetId,
	tweak,
	...props
}) => {
	const [hero] = listing.gallery.items as [
		tGalleryItem,
		...tGalleryItem[],
	];

	const listingScoreCreateMutation = withListingScoreCreateMutation.useMutation();

	// TODO Extract scoring into standalone hooks, which will handle also 429s
	useEffect(() => {
		if (!withScore) {
			return;
		}

		const timeoutId = setTimeout(() => {
			listingScoreCreateMutation.mutate({
				listingId: listing.id,
				score: "view",
			});
		}, 2_500);

		return () => clearTimeout(timeoutId);
	}, [
		withScore,
		listing.id,
		listingScoreCreateMutation,
	]);

	const [score, setScore] = useState<boolean>(false);

	return (
		<VariantProvider
			cls={ThemeCls}
			variant={{
				tone: "unset",
				theme: "unset",
			}}
		>
			<Container
				ui={"ListingDetailContainer-root"}
				layout={"vertical-header-content"}
				gap={"sm"}
				height={"content"}
				{...props}
			>
				{withHero ? (
					<>
						<Container
							ui={"ListingDetailContainer-image"}
							height={"content"}
							round={"default"}
							position={"relative"}
							tweak={{
								slot: {
									root: {
										class: [
											"h-64",
										],
									},
								},
							}}
						>
							<ListingPrice
								price={listing.price}
								locale={locale}
								currency={listing.currency}
								snapTo={"top-center"}
							/>

							<ListingLocation
								location={listing.location.address}
								snapTo={"bottom"}
							/>

							<HeroImage
								src={hero.upload.url}
								alt={`Hero image for listing ${listing.id}`}
							/>
						</Container>

						{children ? (
							<Container
								ui={"ListingDetailContainer-content"}
								square={"md"}
								height={"content"}
							>
								{children}
							</Container>
						) : null}
					</>
				) : null}

				<VariantProvider
					cls={ThemeCls}
					variant={{
						tone: "primary",
						theme: "light",
					}}
				>
					<Container
						ui={"ListingDetailContainer-info"}
						layout={"vertical-flex"}
						gap={"sm"}
						square={"md"}
						tone={"unset"}
						theme={"unset"}
						height={"content"}
					>
						{withHero ? null : (
							<>
								<BadgeValue
									textLabel={"Listing price (label)"}
									textValue={
										listing.price > 0 ? (
											<PriceInline
												price={listing.price}
												locale={locale}
												currency={listing.currency}
											/>
										) : (
											<Tx label={"Price - free"} />
										)
									}
								/>

								<BadgeValue
									textLabel={"Listing location (label)"}
									textValue={listing.location.address}
								/>
							</>
						)}

						<BadgeValue
							textLabel={"Listing condition (label)"}
							textValue={`Condition - Overall [${listing.condition}] (hint)`}
						/>

						<BadgeValue
							textLabel={"Listing age (label)"}
							textValue={`Condition - Age [${listing.age}] (hint)`}
						/>

						<BadgeValue
							textLabel={"Listing score hint (label)"}
							textValue={
								<withListingMetricsFetchQuery.Suspense
									data={listing.id}
									fallback={<Icon icon={SpinnerIcon} />}
								>
									{({ data }) => {
										return toLocaleNumber({
											locale,
											number: data.score,
											empty: "0",
										});
									}}
								</withListingMetricsFetchQuery.Suspense>
							}
							action={
								<Icon
									icon={ShowIcon}
									size={"sm"}
								/>
							}
							onClick={() => setScore(true)}
						/>

						<BadgeValue
							textLabel={"Listing seller hint (label)"}
							textValue={"- skore + link -"}
							action={
								<Icon
									icon={ShowIcon}
									size={"sm"}
								/>
							}
						/>

						<BadgeValue
							textLabel={"Listing category (label)"}
							textValue={
								<CategoryInline
									category={listing.category}
									tone="secondary"
									theme="light"
								/>
							}
						/>
					</Container>
				</VariantProvider>
			</Container>

			<BottomSheet
				isOpen={score}
				onClose={() => setScore(false)}
				modalEffectRootId={parentSheetId}
			>
				<withListingMetricsFetchQuery.Suspense
					data={listing.id}
					fallback={<SpinnerContainer />}
				>
					{({ data }) => {
						return (
							<Container square={"md"}>
								<ScoreContainer
									locale={locale}
									listingMetrics={data}
								/>
							</Container>
						);
					}}
				</withListingMetricsFetchQuery.Suspense>
			</BottomSheet>
		</VariantProvider>
	);
};
