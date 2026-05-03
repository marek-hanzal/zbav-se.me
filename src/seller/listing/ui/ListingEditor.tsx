import { type FC, useCallback } from "react";
import type { MarkSuspense } from "@/lib/client/type";
import { Panel, useView } from "@/lib/client/view2";
import { withListingAttrOfQuery } from "~/user/listing-attr/query/withListingAttrOfQuery";
import { withListingQuery } from "../query/withListingQuery";
import { Editor } from "./Editor";
import { AttrPatch } from "./Editor/AttrPatch";
import { AgePatch } from "./patch/AgePatch";
import { CategoryPatch } from "./patch/CategoryPatch";
import { ConditionPatch } from "./patch/ConditionPatch";
import { ConsPatch } from "./patch/ConsPatch";
import { DeliveryPatch } from "./patch/DeliveryPatch";
import { DescriptionPatch } from "./patch/DescriptionPatch";
import { ExpiresPatch } from "./patch/ExpiresPatch";
import { GalleryPatch } from "./patch/GalleryPatch";
import { LocationPatch } from "./patch/LocationPatch";
import { PricePatch } from "./patch/PricePatch";
import { PriceTypePatch } from "./patch/PriceTypePatch";
import { ProsPatch } from "./patch/ProsPatch";
import { RestrictionPatch } from "./patch/RestrictionPatch";
import { TitlePatch } from "./patch/TitlePatch";
import { WarrantyPatch } from "./patch/WarrantyPatch";

export namespace ListingEditor {
	export interface Props extends MarkSuspense.Props {
		listingId: string;
	}
}

export const ListingEditor: FC<ListingEditor.Props> = ({ _suspense, listingId }) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);

	const editor = useView({
		panels: [
			"default",
			"gallery",
			"title",
			"category",
			"location",
			"price",
			"priceType",
			"expires",
			"condition",
			"age",
			"restriction",
			"delivery",
			"warranty",
			"description",
			"pros",
			"cons",
		],
		defaultPanel: "default",
	});

	const onDone = useCallback(() => {
		editor.set("default");
	}, [
		editor,
	]);

	const { data: attrs } = withListingAttrOfQuery.useSuspenseQuery({
		listingId,
		categoryId: listing.categoryId ?? "unknown",
	});
	/**
	 * This is a trick:
	 * We want to keep "wizard" flow inside custom fields, thus we need to get two separated groups,
	 * so we know, which field is the next.
	 */
	const recommended = attrs.filter((item) => item.kind === "recommended");
	const optional = attrs.filter((item) => item.kind === "optional");

	return (
		<editor.View>
			<editor.Panel
				name={"default"}
				keep
			>
				<Editor
					_suspense={"I know"}
					listingId={listing.id}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"gallery"}>
				<GalleryPatch
					listing={listing}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"title"}>
				<TitlePatch
					listing={listing}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"category"}>
				<CategoryPatch
					listing={listing}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"location"}>
				<LocationPatch
					listing={listing}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"priceType"}>
				<PriceTypePatch
					listing={listing}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"price"}>
				<PricePatch
					listing={listing}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"expires"}>
				<ExpiresPatch
					listing={listing}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"condition"}>
				<ConditionPatch
					listing={listing}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"age"}>
				<AgePatch
					listing={listing}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"delivery"}>
				<DeliveryPatch
					listing={listing}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"warranty"}>
				<WarrantyPatch
					listing={listing}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"restriction"}>
				<RestrictionPatch
					listing={listing}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"description"}>
				<DescriptionPatch
					listing={listing}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"pros"}>
				<ProsPatch
					listing={listing}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"cons"}>
				<ConsPatch
					listing={listing}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			{recommended.map((attr) => {
				return (
					<Panel<any>
						key={attr.name}
						name={`attr.${attr.name}`}
						control={editor}
					>
						<AttrPatch
							listingId={listing.id}
							attrs={recommended}
							attr={attr}
							view={editor}
						/>
					</Panel>
				);
			})}

			{optional.map((attr) => {
				return (
					<Panel<any>
						key={attr.name}
						name={`attr.${attr.name}`}
						control={editor}
					>
						<AttrPatch
							listingId={listing.id}
							attrs={optional}
							attr={attr}
							view={editor}
						/>
					</Panel>
				);
			})}
		</editor.View>
	);
};
