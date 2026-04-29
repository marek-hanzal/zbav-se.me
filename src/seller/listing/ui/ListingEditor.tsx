import { type FC, useCallback, useMemo, useState } from "react";
import type { MarkSuspense } from "@/lib/client/type";
import { View } from "@/lib/client/view";
import { TitlePatch } from "~/seller/listing/ui/patch/TitlePatch";
import { withListingQuery } from "../query/withListingQuery";
import { Editor } from "./Editor";
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
import { WarrantyPatch } from "./patch/WarrantyPatch";

export namespace ListingEditor {
	export type View =
		| "default"
		| "title"
		| "location"
		| "price"
		| "priceType"
		| "category"
		| "condition"
		| "age"
		| "delivery"
		| "warranty"
		| "restriction"
		| "gallery"
		| "expires"
		| "description"
		| "pros"
		| "cons";

	export interface Props extends MarkSuspense.Props {
		listingId: string;
	}
}

export const ListingEditor: FC<ListingEditor.Props> = ({ _suspense, listingId }) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const [view, setView] = useState<ListingEditor.View>("default");

	const onDone = useCallback(() => {
		setView("default");
	}, []);

	const views = useMemo<View.Views<ListingEditor.View>>(() => {
		return {
			default: {
				children: (
					<Editor
						_suspense={"I know"}
						listingId={listing.id}
						setView={setView}
					/>
				),
			},
			gallery: {
				children: (
					<GalleryPatch
						listing={listing}
						onCancel={onDone}
						setView={setView}
						defaultUploadIds={listing.withUploadIds}
					/>
				),
			},
			title: {
				children: (
					<TitlePatch
						listing={listing}
						onCancel={onDone}
						setView={setView}
					/>
				),
			},
			category: {
				children: (
					<CategoryPatch
						listing={listing}
						onCancel={onDone}
						setView={setView}
					/>
				),
			},
			location: {
				children: (
					<LocationPatch
						listing={listing}
						onCancel={onDone}
						setView={setView}
					/>
				),
			},
			priceType: {
				children: (
					<PriceTypePatch
						listing={listing}
						onCancel={onDone}
						setView={setView}
					/>
				),
			},
			price: {
				children: (
					<PricePatch
						listing={listing}
						onCancel={onDone}
						setView={setView}
					/>
				),
			},
			expires: {
				children: (
					<ExpiresPatch
						listing={listing}
						onCancel={onDone}
						setView={setView}
					/>
				),
			},
			condition: {
				children: (
					<ConditionPatch
						listing={listing}
						onCancel={onDone}
						setView={setView}
					/>
				),
			},
			age: {
				children: (
					<AgePatch
						listing={listing}
						onCancel={onDone}
						setView={setView}
					/>
				),
			},
			delivery: {
				children: (
					<DeliveryPatch
						listing={listing}
						onCancel={onDone}
						setView={setView}
					/>
				),
			},
			warranty: {
				children: (
					<WarrantyPatch
						listing={listing}
						onCancel={onDone}
						setView={setView}
					/>
				),
			},
			restriction: {
				children: (
					<RestrictionPatch
						listing={listing}
						onCancel={onDone}
						setView={setView}
					/>
				),
			},
			description: {
				children: (
					<DescriptionPatch
						listing={listing}
						onCancel={onDone}
						setView={setView}
					/>
				),
			},
			pros: {
				children: (
					<ProsPatch
						listing={listing}
						onCancel={onDone}
						setView={setView}
					/>
				),
			},
			cons: {
				children: (
					<ConsPatch
						listing={listing}
						onCancel={onDone}
						setView={setView}
					/>
				),
			},
		};
	}, [
		listing,
		onDone,
	]);

	return (
		<View
			state={{
				value: view,
				set: setView,
			}}
			views={views}
		/>
	);
};
