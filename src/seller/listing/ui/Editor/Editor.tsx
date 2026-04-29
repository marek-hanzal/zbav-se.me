import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { GalleryValue } from "~/common/gallery/ui/GalleryValue";
import { LocationValue } from "~/common/location/ui/LocationValue";
import { TitleValue } from "~/common/title/ui/TitleValue";
import { ChevronAction } from "~/common/ui/action/ChevronAction";
import { CategoryValue } from "~/user/category/ui/CategoryValue";
import { AgeValue } from "~/user/listing/ui/AgeValue";
import { ConditionValue } from "~/user/listing/ui/ConditionValue";
import { ConsValueList } from "~/user/listing/ui/ConsValueList";
import { DeliveryValueList } from "~/user/listing/ui/DeliveryValueList";
import { DescriptionValue } from "~/user/listing/ui/DescriptionValue";
import { ExpireAtValue } from "~/user/listing/ui/ExpireAtValue";
import { PriceTypeValue } from "~/user/listing/ui/PriceTypeValue";
import { PriceValue } from "~/user/listing/ui/PriceValue";
import { ProsValueList } from "~/user/listing/ui/ProsValueList";
import { RestrictionValue } from "~/user/listing/ui/RestrictionValue";
import { WarrantyValue } from "~/user/listing/ui/WarrantyValue";
import { CurrentRestriction } from "~/user/restriction/ui/CurrentRestriction";
import { withListingQuery } from "../../query/withListingQuery";

export namespace Editor {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const Editor: FC<Editor.Props> = ({ _suspense, listingId, ...props }) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);

	return (
		<Container
			data-ui-flow="vertical"
			data-ui-scroll="vertical"
			data-ui-inner="default"
			data-ui-width="full"
			data-ui-gap="lg"
			{...props}
		>
			<Group>
				<CurrentRestriction _suspense={_suspense} />
			</Group>

			<Group>
				<GalleryValue
					urls={listing.withImageUrl}
					label={translator.text("Listing photo gallery (label)")}
					// onClick={() => onView("gallery")}
				/>
			</Group>

			<Tx
				label="Draft - bunch of required (title)"
				data-ui-tone="brand"
				data-ui-theme="light"
				data-ui-text="md"
				data-ui-color="lead"
				data-ui-opacity="8"
				className={"text-center"}
			/>

			<Group>
				<TitleValue
					data-action={"set listing title"}
					title={listing.title}
					textLabel={translator.text("Listing title (label)")}
					textEmpty={translator.text("Listing title not filled")}
					action={<ChevronAction />}
					// onClick={() => onView("title")}
				/>

				<CategoryValue
					data-action={"select listing category"}
					_suspense={"I know"}
					categoryId={listing.categoryId}
					action={<ChevronAction />}
					// onClick={() => onView("category")}
				/>

				<LocationValue
					data-ui={"select listing location"}
					_suspense={"I know"}
					locationId={listing.locationId}
					textLabel={translator.text("Listing location (label)")}
					textEmpty={translator.text("Listing location not selected")}
					textHint={translator.text("Listing location (hint)")}
					action={<ChevronAction />}
					// onClick={() => onView("location")}
				/>
			</Group>

			<Group>
				<PriceTypeValue
					data-ui={"set listing price type"}
					priceType={listing.priceType}
					action={<ChevronAction />}
					// onClick={() => onView("priceType")}
				/>

				{match(listing.priceType)
					.with("closed", "open", () => {
						return (
							<PriceValue
								data-ui={"set listing price"}
								price={listing.price}
								currency={listing.currency}
								action={<ChevronAction />}
								// onClick={() => onView("price")}
							/>
						);
					})
					.with("offer", null, undefined, () => {
						return (
							<PriceValue
								price={0}
								currency={"CZK"}
								action={<ChevronAction />}
								data-ui-disabled
							/>
						);
					})
					.exhaustive()}
			</Group>

			<Group>
				<ExpireAtValue
					data-ui={"set listing expiration date"}
					expires={listing.expires}
					action={<ChevronAction />}
					// onClick={() => onView("expireAt")}
				/>
			</Group>

			<Tx
				label="Draft - those others (title)"
				data-ui-tone="secondary"
				data-ui-theme="light"
				data-ui-text="md"
				data-ui-color="lead"
				data-ui-opacity="8"
				className={"text-center"}
			/>

			<Group>
				<DeliveryValueList
					deliveryIn={listing.delivery}
					action={<ChevronAction />}
					// onClick={() => onView("delivery")}
				/>
			</Group>

			<Group>
				<DescriptionValue
					description={listing.description}
					action={<ChevronAction />}
					// onClick={() => onView("description")}
				/>
			</Group>

			<Group>
				<ProsValueList
					pros={listing.pros}
					action={<ChevronAction />}
					// onClick={() => onView("pros")}
				/>

				<ConsValueList
					cons={listing.cons}
					action={<ChevronAction />}
					// onClick={() => onView("cons")}
				/>
			</Group>

			<Group>
				<WarrantyValue
					warranty={listing.warranty}
					action={<ChevronAction />}
					// onClick={() => onView("warranty")}
				/>
			</Group>

			<Group>
				<ConditionValue
					condition={listing.condition}
					action={<ChevronAction />}
					// onClick={() => onView("condition")}
				/>

				<AgeValue
					age={listing.age}
					action={<ChevronAction />}
					// onClick={() => onView("age")}
				/>
			</Group>

			<Group>
				<RestrictionValue
					data-ui={"set listing restriction"}
					restriction={listing.restriction}
					action={<ChevronAction />}
					// onClick={() => onView("restriction")}
					data-ui-disabled={!listing.categoryId}
				/>
			</Group>
		</Container>
	);
};
