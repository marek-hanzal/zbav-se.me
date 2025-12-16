import { Icon, ShowIcon, SpinnerIcon } from "@use-pico/client/icon";
import { Container, LabelValue } from "@use-pico/client/ui/container";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tGalleryItem, tListing } from "@zbav-se.me/sdk/api/user";
import { withListingFetchQuery, withListingMetricsFetchQuery } from "@zbav-se.me/sdk/query/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";
import { CategoryInline } from "~/app/category/ui/CategoryInline";
import { useListingScore } from "~/app/listing/hook/useListingScore";
import { FavouriteToggleButton } from "~/app/listing/ui/button/FavouriteToggleButton";
import { FlagButton } from "~/app/listing/ui/button/FlagButton";
import { IgnoreButton } from "~/app/listing/ui/button/IgnoreButton";
import { TransactionButton } from "~/app/listing/ui/button/TransactionButton";
import { ListingPrice } from "~/app/listing/ui/ListingPrice";
import { ListingOverlay } from "~/app/listing/ui/overlay/ListingOverlay";

export namespace ListingDetail {
	export type Tools = "destructive" | "hero";

	export interface Hooks {
		onGallery(): void;
		onScore(): void;
		onTransaction(): void;
	}

	export interface Props extends Container.Props {
		locale: string;
		feedId: string | undefined;
		listing: tListing;
		/**
		 * Should the listing emit the score event?
		 */
		withScore: boolean;
		tools: Tools[];
		hooks: Hooks;
	}
}

export const ListingDetail: FC<ListingDetail.Props> = ({
	locale,
	feedId,
	listing,
	withScore,
	tools,
	ui,
	hooks,
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

	return (
		<Container
			data-ui={"ListingDetail[Container]"}
			ui={{
				layout: "vertical-flex",
				gap: "xl",
				...ui,
			}}
			{...props}
		>
			{tools.includes("hero") ? (
				<>
					<Container
						data-ui={"ListingDetail-[Container.hero]"}
						ui={{
							position: "relative",
						}}
					>
						<ListingOverlay
							data-ui={"ListingDetail-[ListingOverlay]"}
							locale={locale}
							listing={listing}
						/>

						{feedId ? (
							<FavouriteToggleButton
								feedId={feedId}
								listingId={listing.id}
								label={null}
								iconProps={{
									ui: {
										text: "xl",
									},
								}}
								ui={{
									tone: "secondary",
									theme: "light",
									round: "full",
									square: "md",
									justify: "center",
									items: "center",
									size: undefined,
									inner: undefined,
									snapTo: "top-right",
								}}
							/>
						) : null}

						<HeroImage
							data-ui={"ListingDetail-[HeroImage]"}
							src={hero.upload.url}
							alt={`Hero image for listing ${listing.id}`}
							onClick={hooks.onGallery}
							ui={{
								round: "default",
							}}
							className={"h-64"}
						/>
					</Container>

					<Container
						data-ui={"ListingDetail-[Container.info]"}
						ui={{
							layout: "vertical-flex",
							gap: "sm",
						}}
					>
						<TransactionButton
							locale={locale}
							listing={listing}
							onTransaction={hooks.onTransaction}
						/>
					</Container>
				</>
			) : null}

			<Container
				data-ui={"ListingDetail-[Container.info]"}
				ui={{
					layout: "vertical-flex",
					gap: "default",
				}}
			>
				{tools.includes("hero") ? null : (
					<>
						<ListingPrice
							price={listing.price}
							locale={locale}
							currency={listing.currency}
						/>

						<LabelValue
							textLabel={"Listing location (label)"}
							textValue={listing.location.address}
						/>
					</>
				)}

				<LabelValue
					textLabel={"Listing condition (label)"}
					textValue={`Condition - Overall [${listing.condition}] (hint)`}
				/>

				<LabelValue
					textLabel={"Listing age (label)"}
					textValue={`Condition - Age [${listing.age}] (hint)`}
				/>

				<LabelValue
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
					action={<Icon icon={ShowIcon} />}
					onClick={hooks.onScore}
				/>

				<LabelValue
					textLabel={"Listing seller hint (label)"}
					textValue={"- skore + link -"}
					action={<Icon icon={ShowIcon} />}
				/>

				<LabelValue
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
						if (listing.isFavourite) {
							return null;
						}

						return (
							<Container
								data-ui="ListingDetail-[Container.destructive]"
								ui={{
									layout: "vertical-flex",
									gap: "sm",
								}}
							>
								<IgnoreButton listingId={listing.id} />

								<FlagButton listingId={listing.id} />
							</Container>
						);
					}}
				</withListingFetchQuery.Suspense>
			) : null}
		</Container>
	);
};
