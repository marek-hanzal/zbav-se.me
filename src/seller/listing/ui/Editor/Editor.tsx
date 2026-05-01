import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { useLocale } from "@/lib/client/locale";
import { handleArrowNav } from "@/lib/client/nav";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import type { useView } from "@/lib/client/view2";
import { translator } from "@/lib/common/translation";
import { GalleryValue } from "~/common/gallery/ui/GalleryValue";
import { LocationValue } from "~/common/location/ui/LocationValue";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleValue } from "~/common/title/ui/TitleValue";
import { ChevronAction } from "~/common/ui/action/ChevronAction";
import { TitleContainer } from "~/common/ui/container";
import { CategoryValue } from "~/user/category/ui/CategoryValue";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { AgeValue } from "~/user/listing/ui/value/AgeValue";
import { ConditionValue } from "~/user/listing/ui/value/ConditionValue";
import { ConsValueList } from "~/user/listing/ui/value/ConsValueList";
import { DeliveryValueList } from "~/user/listing/ui/value/DeliveryValueList";
import { DescriptionValue } from "~/user/listing/ui/value/DescriptionValue";
import { ExpiresValue } from "~/user/listing/ui/value/ExpiresValue";
import { PriceTypeValue } from "~/user/listing/ui/value/PriceTypeValue";
import { PriceValue } from "~/user/listing/ui/value/PriceValue";
import { ProsValueList } from "~/user/listing/ui/value/ProsValueList";
import { RestrictionValue } from "~/user/listing/ui/value/RestrictionValue";
import { WarrantyValue } from "~/user/listing/ui/value/WarrantyValue";
import { CurrentRestriction } from "~/user/restriction/ui/CurrentRestriction";
import { withListingQuery } from "../../query/withListingQuery";
import { AttrOptional } from "./AttrOptional";
import { AttrRequired } from "./AttrRequired";

export namespace Editor {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		listingId: string;
		view: useView.Use<
			| "gallery"
			| "title"
			| "category"
			| "location"
			| "priceType"
			| "expires"
			| "price"
			| "age"
			| "pros"
			| "cons"
			| "delivery"
			| "description"
			| "warranty"
			| "restriction"
			| "condition"
		>;
	}
}

export const Editor: FC<Editor.Props> = ({ _suspense, listingId, view, ...props }) => {
	const locale = useLocale();
	const { data: listing } = withListingQuery.useFetchQuery(listingId);

	return (
		<TitleContainer
			data-ui={"EditorPage"}
			textTitle={translator.text("Listing editor (title)")}
			left={
				<BackHomeButton
					id={"back-link"}
					to="/$locale/app/home"
					params={{
						locale,
					}}
					//
					data-arrow-right={"home-link"}
					onKeyDown={handleArrowNav}
				/>
			}
			right={
				<HomeMenuButton
					id={"home-link"}
					//
					data-arrow-left={"back-link"}
					onKeyDown={handleArrowNav}
				/>
			}
			data-ui-layout={"vertical-header-content"}
			{...props}
		>
			<Container
				data-ui-inner={"default"}
				data-ui-flow={"vertical"}
				data-ui-gap={"lg"}
			>
				<Group>
					<CurrentRestriction _suspense={_suspense} />
				</Group>

				<Group>
					<GalleryValue
						urls={listing.withImageUrl}
						label={translator.text("Listing photo gallery (label)")}
						onClick={() => view.set("gallery")}
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

				<Container
					data-ui-flow={"vertical"}
					data-ui-gap={"default"}
				>
					<Group>
						<TitleValue
							data-action={"set listing title"}
							title={listing.title}
							textLabel={translator.text("Listing title (label)")}
							textEmpty={translator.text("Listing title not filled")}
							action={<ChevronAction />}
							onClick={() => view.set("title")}
						/>

						<CategoryValue
							data-action={"select listing category"}
							_suspense={"I know"}
							categoryId={listing.categoryId}
							action={<ChevronAction />}
							onClick={() => view.set("category")}
						/>
					</Group>

					<Group>
						<LocationValue
							data-ui={"select listing location"}
							_suspense={"I know"}
							locationId={listing.locationId}
							textLabel={translator.text("Listing location (label)")}
							textEmpty={translator.text("Listing location not selected")}
							textHint={translator.text("Listing location (hint)")}
							action={<ChevronAction />}
							onClick={() => view.set("location")}
						/>
					</Group>

					<Group>
						<PriceTypeValue
							data-ui={"set listing price type"}
							priceType={listing.priceType}
							action={<ChevronAction />}
							onClick={() => view.set("priceType")}
						/>

						{match(listing.priceType)
							.with("closed", "open", () => {
								return (
									<PriceValue
										data-ui={"set listing price"}
										price={listing.price}
										currency={listing.currency}
										action={<ChevronAction />}
										onClick={() => view.set("price")}
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
						<ExpiresValue
							data-ui={"set listing expiration date"}
							expires={listing.expires}
							action={<ChevronAction />}
							onClick={() => view.set("expires")}
						/>
					</Group>
				</Container>

				<AttrRequired
					_suspense={"I know"}
					listingId={listing.id}
					categoryId={listing.categoryId}
					view={view}
				/>

				<Tx
					label="Draft - those others (title)"
					data-ui-tone="secondary"
					data-ui-theme="light"
					data-ui-text="md"
					data-ui-color="lead"
					data-ui-opacity="8"
					className={"text-center"}
				/>

				<Container
					data-ui-flow={"vertical"}
					data-ui-gap={"default"}
				>
					<Group>
						<DeliveryValueList
							deliveryIn={listing.delivery}
							action={<ChevronAction />}
							onClick={() => view.set("delivery")}
						/>
					</Group>

					<Group>
						<DescriptionValue
							description={listing.description}
							action={<ChevronAction />}
							onClick={() => view.set("description")}
						/>
					</Group>

					<Group>
						<ProsValueList
							pros={listing.pros}
							action={<ChevronAction />}
							onClick={() => view.set("pros")}
						/>

						<ConsValueList
							cons={listing.cons}
							action={<ChevronAction />}
							onClick={() => view.set("cons")}
						/>
					</Group>

					<Group>
						<WarrantyValue
							warranty={listing.warranty}
							action={<ChevronAction />}
							onClick={() => view.set("warranty")}
						/>
					</Group>

					<Group>
						<ConditionValue
							condition={listing.condition}
							action={<ChevronAction />}
							onClick={() => view.set("condition")}
						/>

						<AgeValue
							age={listing.age}
							action={<ChevronAction />}
							onClick={() => view.set("age")}
						/>
					</Group>

					<Group>
						<RestrictionValue
							data-ui={"set listing restriction"}
							restriction={listing.restriction}
							action={<ChevronAction />}
							data-ui-disabled={!listing.categoryId}
							onClick={() => view.set("restriction")}
						/>
					</Group>
				</Container>

				<AttrOptional
					_suspense={"I know"}
					listingId={listing.id}
					categoryId={listing.categoryId}
					view={view}
				/>
			</Container>
		</TitleContainer>
	);
};
