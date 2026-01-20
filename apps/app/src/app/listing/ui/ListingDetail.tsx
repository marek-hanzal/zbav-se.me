import { Icon, ShowIcon } from "@use-pico/client/icon";
import { Container, LabelValue, ValueList } from "@use-pico/client/ui/container";
import { Markdown } from "@use-pico/client/ui/markdown";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { translator } from "@use-pico/common/translator";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { withListingSellerInfoQuery } from "@zbav-se.me/sdk/query/session/listing";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";
import { CategoryInline } from "~/app/category/ui/CategoryInline";
import { ConditionIcon } from "~/app/condition/ui/ConditionIcon";
import { useHeroUpload } from "~/app/gallery/hook/useHeroUpload";
import { useListingEvent } from "~/app/listing/hook/useListingEvent";
import { FavouriteToggleButton } from "~/app/listing/ui/button/FavouriteToggleButton";
import { FlagButton } from "~/app/listing/ui/button/FlagButton";
import { IgnoreButton } from "~/app/listing/ui/button/IgnoreButton";
import { ThumbDislikeButton } from "~/app/listing/ui/button/ThumbDislikeButton";
import { ThumbLikeButton } from "~/app/listing/ui/button/ThumbLikeButton";
import { TransactionButton } from "~/app/listing/ui/button/TransactionButton";
import { ListingOverlay } from "~/app/listing/ui/overlay/ListingOverlay";
import { SellerScoreIcon } from "~/app/listing/ui/SellerScoreIcon";

export namespace ListingDetail {
	export type Tools = "destructive" | "hero" | "thumb";

	export interface Hooks {
		onGallery(): void;
		onTransaction(): void;
		onSellerInfo(): void;
	}

	export interface Props extends Container.Props {
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
	feedId,
	listing,
	withScore,
	tools,
	ui,
	hooks,
	...props
}) => {
	const hero = useHeroUpload(listing.gallery.items);

	useListingEvent({
		enabled: withScore,
		listingId: listing.id,
		event: "view",
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
							src={hero.url}
							alt={`Hero image for listing ${listing.id}`}
							onClick={hooks.onGallery}
							ui={{
								round: "default",
							}}
							className={"h-64"}
						/>
					</Container>

					<TransactionButton
						listing={listing}
						onTransaction={hooks.onTransaction}
					/>
				</>
			) : null}

			<Container
				data-ui={"ListingDetail-[Container.info]"}
				ui={{
					layout: "vertical-flex",
					gap: "default",
				}}
			>
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

				{listing.description ? (
					<LabelValue
						textLabel={"Listing description (label)"}
						textValue={<Markdown>{listing.description}</Markdown>}
					/>
				) : null}

				{listing.pros?.length ? (
					<ValueList
						data-ui={"ListingDetail[ProsValue]"}
						textLabel={translator.text("Listing - Pros (label)")}
						textEmpty={translator.text("Listing - Pros not filled")}
						items={listing.pros.map((pro, index) => ({
							id: String(index),
							pro,
						}))}
						renderFn={(item) => <Typo label={item.pro} />}
					/>
				) : null}

				{listing.cons?.length ? (
					<ValueList
						data-ui={"ListingDetail[ConsValue]"}
						textLabel={translator.text("Listing - Cons (label)")}
						textEmpty={translator.text("Listing - Cons not filled")}
						items={listing.cons.map((con, index) => ({
							id: String(index),
							con,
						}))}
						renderFn={(item) => <Typo label={item.con} />}
					/>
				) : null}

				{listing.delivery?.length ? (
					<ValueList
						data-ui={"ListingDetail[DeliveryValue]"}
						textLabel={translator.text("Listing delivery (label)")}
						textEmpty={translator.text("Delivery not selected")}
						items={(listing.delivery ?? []).map((delivery) => ({
							id: delivery,
							delivery,
						}))}
						renderFn={(item) => <Tx label={`Listing delivery - ${item.delivery}`} />}
					/>
				) : null}

				{listing.warranty !== null ? (
					<LabelValue
						textLabel={translator.text("Listing warranty (label)")}
						textValue={<Tx label={`Listing warranty - ${listing.warranty}`} />}
					/>
				) : null}

				{listing.condition !== null ? (
					<LabelValue
						textLabel={"Listing condition (label)"}
						textValue={<ConditionIcon condition={listing.condition} />}
					/>
				) : null}

				{listing.age !== null ? (
					<LabelValue
						textLabel={"Listing age (label)"}
						textValue={`Condition - Age [${listing.age}] (hint)`}
					/>
				) : null}

				<withListingSellerInfoQuery.Suspense
					data={{
						listingId: listing.id,
					}}
					fallback={
						<LabelValue
							textLabel={"Listing seller hint (label)"}
							textValue={null}
							action={<Icon icon={ShowIcon} />}
							onClick={hooks.onSellerInfo}
						/>
					}
				>
					{({ data: sellerInfo }) => {
						return (
							<LabelValue
								textLabel={"Listing seller hint (label)"}
								textValue={
									sellerInfo.events ? (
										<SellerScoreIcon score={sellerInfo.events.score.rank} />
									) : null
								}
								textEmpty={translator.text(
									"Listing seller info not available (empty)",
								)}
								action={<Icon icon={ShowIcon} />}
								onClick={hooks.onSellerInfo}
							/>
						);
					}}
				</withListingSellerInfoQuery.Suspense>
			</Container>

			{tools.includes("thumb") ? (
				<Container
					ui={{
						layout: "horizontal-flex",
						width: "full",
						items: "center",
						justify: "space-evenly",
					}}
				>
					<ThumbLikeButton listing={listing} />

					<ThumbDislikeButton listing={listing} />
				</Container>
			) : null}

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
