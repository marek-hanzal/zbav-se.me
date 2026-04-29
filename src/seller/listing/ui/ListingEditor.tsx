import { type FC, useCallback, useMemo, useState } from "react";
import type { MarkSuspense } from "@/lib/client/type";
import { View } from "@/lib/client/view";
import { TitlePatch } from "~/seller/listing/ui/patch/TitlePatch";
import { withListingQuery } from "../query/withListingQuery";
import { Editor } from "./Editor";
import { CategoryPatch } from "./patch/CategoryPatch";
import { LocationPatch } from "./patch/LocationPatch";
import { PriceTypePatch } from "./patch/PriceTypePatch";

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
		| "expireAt"
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
				children: `<PricePatch
						listing={listing}
						onCancel={onDone}
						setView={setView}
					/>`,
			},
			condition: {
				children: `<ConditionPatch
						draft={listing}
						onCancel={onDone}
						onView={setView}
					/>`,
			},
			age: {
				children: `<AgePatch
						draft={listing}
						onCancel={onDone}
						onView={setView}
					/>`,
			},
			delivery: {
				children: `<DeliveryPatch
						draft={listing}
						onCancel={onDone}
						onView={setView}
					/>`,
			},
			warranty: {
				children: `<WarrantyPatch
						draft={listing}
						onCancel={onDone}
						onView={setView}
					/>`,
			},
			restriction: {
				children: `<RestrictionPatch
						draft={listing}
						onCancel={onDone}
						onView={setView}
					/>`,
			},
			expireAt: {
				children: `<ExpireAtPatch
						draft={listing}
						onCancel={onDone}
						onView={setView}
					/>`,
			},
			gallery: {
				children: `<GalleryPatch
						draft={listing}
						onCancel={onDone}
						onView={setView}
						defaultUploadIds={listing.withUploadIds}
					/>`,
			},
			description: {
				children: `<DescriptionPatch
						draft={listing}
						onCancel={onDone}
						onView={setView}
					/>`,
			},
			pros: {
				children: `<ProsPatch
						draft={listing}
						onCancel={onDone}
						onView={setView}
					/>`,
			},
			cons: {
				children: `<ConsPatch
						draft={listing}
						onCancel={onDone}
						onView={setView}
					/>`,
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
