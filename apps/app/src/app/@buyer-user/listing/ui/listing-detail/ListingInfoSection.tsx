import { Container, LabelValue, ValueList } from "@use-pico/client/ui/container";
import { Markdown } from "@use-pico/client/ui/markdown";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { translator } from "@use-pico/common/translator";
import type { tListing } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";
import { ListingSellerInfoSuspense } from "~/app/@buyer-user/listing/ui/listing-detail/ListingSellerInfoSuspense";
import { CategoryInline } from "~/app/@common/category/ui/CategoryInline";
import { ConditionIcon } from "~/app/@common/condition/ui/ConditionIcon";

export namespace ListingInfoSection {
	export interface Props {
		listing: tListing;
		onSellerInfo(): void;
	}
}

export const ListingInfoSection: FC<ListingInfoSection.Props> = ({ listing, onSellerInfo }) => {
	return (
		<Container
			data-ui={"ListingDetail-[Container.info]"}
			ui={{
				layout: "vertical-flex",
				gap: "default",
			}}
		>
			<LabelValue
				textLabel={translator.text("Listing category (label)")}
				textValue={
					<CategoryInline
						category={listing.category}
						ui={{
							tone: "secondary",
							theme: "light",
						}}
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

			<ListingSellerInfoSuspense
				listingId={listing.id}
				onSellerInfo={onSellerInfo}
			/>
		</Container>
	);
};
