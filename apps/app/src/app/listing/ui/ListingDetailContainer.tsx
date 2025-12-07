import { Icon, ShowIcon, SpinnerIcon } from "@use-pico/client/icon";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { Tx } from "@use-pico/client/ui/tx";
import { VariantProvider } from "@use-pico/cls";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tGalleryItem, tListing } from "@zbav-se.me/sdk/api/user";
import { withListingFetchQuery, withListingMetricsFetchQuery } from "@zbav-se.me/sdk/query/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { CategoryInline } from "~/app/category/ui/CategoryInline";
import { useListingScore } from "~/app/listing/hook/useListingScore";
import { CartToggleButton } from "~/app/listing/ui/button/CartToggleButton";
import { ListingFlagButton } from "~/app/listing/ui/button/ListingFlagButton";
import { ListingIgnoreButton } from "~/app/listing/ui/button/ListingIgnoreButton";
import { TransactionButton } from "~/app/listing/ui/button/TransactionButton";
import { GallerySheet } from "~/app/photo/ui/GallerySheet";
import { ListingLocation } from "./ListingLocation";
import { ListingPrice } from "./ListingPrice";
import { ScoreContainer } from "./ScoreContainer";

export namespace ListingDetailContainer {
	export type Tools = "destructive" | "hero";

	export interface Props extends Container.Props {
		locale: string;
		feedId: string | undefined;
		listing: tListing;
		/**
		 * Should the listing emit the score event?
		 */
		withScore: boolean;
		/**
		 * Used for bottom sheet stacking effect.
		 */
		parentSheetId: string | undefined;
		tools: Tools[];
	}
}

export const ListingDetailContainer: FC<ListingDetailContainer.Props> = ({
	locale,
	feedId,
	listing,
	withScore,
	parentSheetId,
	tools,
	...props
}) => {
	const [hero] = listing.gallery.items as [
		tGalleryItem,
		...tGalleryItem[],
	];

	useListingScore({
		enabled: withScore,
		listingId: listing.id,
		type: "view",
		timeoutMs: 2_500,
	});

	const [isScore, setIsScore] = useState(false);
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	return (
		<VariantProvider
			cls={ThemeCls}
			variant={{
				tone: "unset",
				theme: "unset",
			}}
		>
			<Container
				data-ui={"ListingDetailContainer-root"}
				layout={"vertical-flex"}
				gap={"lg"}
				{...props}
			>
				{tools.includes("hero") ? (
					<>
						<Container
							data-ui={"ListingDetailContainer-image"}
							position={"relative"}
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

							{feedId ? (
								<CartToggleButton
									tone={"secondary"}
									feedId={feedId}
									listingId={listing.id}
									label={null}
									menu={false}
									snapTo={"top-right"}
									round={"full"}
									size={"lg"}
								/>
							) : null}

							<HeroImage
								src={hero.upload.url}
								alt={`Hero image for listing ${listing.id}`}
								onClick={() => setIsGalleryOpen((prev) => !prev)}
							/>

							<GallerySheet
								uploads={listing.gallery.items.map((item) => item.upload)}
								isOpen={isGalleryOpen}
								onClose={() => setIsGalleryOpen(false)}
							/>
						</Container>

						<Container
							layout={"vertical-flex"}
							gap={"sm"}
							square={"md"}
						>
							<TransactionButton
								locale={locale}
								listing={listing}
								parentSheetId={parentSheetId}
							/>
						</Container>
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
						data-ui={"ListingDetailContainer-info"}
						layout={"vertical-flex"}
						gap={"sm"}
						square={"md"}
					>
						{tools.includes("hero") ? null : (
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
							onClick={() => setIsScore(true)}
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

				{tools.includes("destructive") ? (
					<withListingFetchQuery.Suspense
						data={{
							where: {
								id: listing.id,
							},
						}}
						fallback={null}
					>
						{({ data: listing }) => {
							if (listing.isInCart) {
								return null;
							}

							return (
								<Container
									data-ui="ListingDetailContainer-destructive"
									layout={"vertical-flex"}
									gap={"sm"}
									square={"md"}
								>
									<ListingIgnoreButton listingId={listing.id} />

									<ListingFlagButton listingId={listing.id} />
								</Container>
							);
						}}
					</withListingFetchQuery.Suspense>
				) : null}
			</Container>

			<BottomSheet
				isOpen={isScore}
				onClose={() => setIsScore(false)}
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
