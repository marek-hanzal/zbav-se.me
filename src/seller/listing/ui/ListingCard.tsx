import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Markdown } from "@/lib/client/markdown";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { LabelValue, ValueList } from "@/lib/client/value";
import { translator } from "@/lib/common/translator";
import { ConditionIcon } from "~/common/condition/ui/ConditionIcon";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
import { HeroImage } from "~/common/ui/img";
import type { ListingSchema } from "~/seller/listing/server/schema/ListingSchema";
import { CategoryInline } from "~/user/category/ui/CategoryInline";

export namespace ListingCard {
	export interface Hooks {
		onGallery(): void;
		onMessages?(): void;
	}

	export interface Props extends Container.Props, MarkSuspense.Props {
		listing: ListingSchema.Type;
		hooks: Hooks;
	}
}

export const ListingCard: FC<ListingCard.Props> = ({ _suspense, listing, hooks, ...props }) => {
	const hero = useUpload(listing.withImageUrl);

	return (
		<Container
			data-ui={"ListingCard[Container]"}
			data-ui-layout="vertical-flex"
			data-ui-gap="xl"
			{...props}
		>
			<Container
				data-ui={"ListingCard-[Container.hero]"}
				data-ui-position="relative"
			>
				<ListingPrice
					data-ui={"ListingOverlay-[ListingPrice]"}
					price={listing.price}
					priceType={listing.priceType}
					currency={listing.currency}
					data-ui-snap-to="top-center"
					data-ui-opacity="8"
					data-ui-z-index
				/>

				<HeroImage
					data-ui={"ListingCard-[HeroImage]"}
					src={hero.url}
					alt={`Hero image for listing ${listing.id}`}
					onClick={hooks.onGallery}
					data-ui-round="default"
					className={"h-64"}
				/>
			</Container>

			<Container
				data-ui={"ListingCard-[Container.info]"}
				data-ui-layout="vertical-flex"
				data-ui-gap="default"
			>
				<LabelValue
					textLabel={translator.text("Listing category (label)")}
					textValue={
						<CategoryInline
							_suspense={"I know"}
							categoryId={listing.category.id}
							data-ui-tone="secondary"
							data-ui-theme="light"
						/>
					}
				/>

				{listing.description ? (
					<LabelValue
						textLabel={translator.text("Listing description (label)")}
						textValue={<Markdown>{listing.description}</Markdown>}
					/>
				) : null}

				{listing.pros?.length ? (
					<ValueList
						data-ui={"ListingCard[ProsValue]"}
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
						data-ui={"ListingCard[ConsValue]"}
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
						data-ui={"ListingCard[DeliveryValue]"}
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
						textLabel={translator.text("Listing condition (label)")}
						textValue={<ConditionIcon condition={listing.condition} />}
					/>
				) : null}

				{listing.age !== null ? (
					<LabelValue
						textLabel={translator.text("Listing age (label)")}
						textValue={`Condition - Age [${listing.age}] (hint)`}
					/>
				) : null}
			</Container>
		</Container>
	);
};
