import type { MarkSuspense } from "@use-pico/client/type";
import { View } from "@use-pico/client/ui/view";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller/draft";
import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import { Editor } from "./Editor";
import { AgePatch } from "./patch/AgePatch";
import { CategoryPatch } from "./patch/CategoryPatch";
import { ConditionPatch } from "./patch/ConditionPatch";
import { ConsPatch } from "./patch/ConsPatch";
import { DeliveryPatch } from "./patch/DeliveryPatch";
import { DescriptionPatch } from "./patch/DescriptionPatch";
import { ExpireAtPatch } from "./patch/ExpireAtPatch";
import { GalleryPatch } from "./patch/GalleryPatch";
import { LocationPatch } from "./patch/LocationPatch";
import { PricePatch } from "./patch/PricePatch";
import { PriceTypePatch } from "./patch/PriceTypePatch";
import { ProsPatch } from "./patch/ProsPatch";
import { RestrictionPatch } from "./patch/RestrictionPatch";
import { TitlePatch } from "./patch/TitlePatch";
import { WarrantyPatch } from "./patch/WarrantyPatch";

export namespace Data {
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
		draftId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, draftId }) => {
	const { data: draft } = withDraftQuery.useFetchQuery(draftId);
	const [view, setView] = useState<Data.View>("default");

	const onDone = useCallback(() => {
		setView("default");
	}, []);

	const views = useMemo<View.Views<Data.View>>(() => {
		return {
			default: {
				children: (
					<Editor
						draft={draft}
						onView={setView}
					/>
				),
			},
			title: {
				children: (
					<TitlePatch
						draft={draft}
						onCancel={onDone}
						onView={setView}
					/>
				),
			},
			location: {
				children: (
					<LocationPatch
						draft={draft}
						onCancel={onDone}
						onView={setView}
					/>
				),
			},
			price: {
				children: (
					<PricePatch
						draft={draft}
						onCancel={onDone}
						onView={setView}
					/>
				),
			},
			priceType: {
				children: (
					<PriceTypePatch
						draft={draft}
						onCancel={onDone}
						onView={setView}
					/>
				),
			},
			category: {
				children: (
					<CategoryPatch
						draft={draft}
						onCancel={onDone}
						onView={setView}
					/>
				),
			},
			condition: {
				children: (
					<ConditionPatch
						draft={draft}
						onCancel={onDone}
						onView={setView}
					/>
				),
			},
			age: {
				children: (
					<AgePatch
						draft={draft}
						onCancel={onDone}
						onView={setView}
					/>
				),
			},
			delivery: {
				children: (
					<DeliveryPatch
						draft={draft}
						onCancel={onDone}
						onView={setView}
					/>
				),
			},
			warranty: {
				children: (
					<WarrantyPatch
						draft={draft}
						onCancel={onDone}
						onView={setView}
					/>
				),
			},
			restriction: {
				children: (
					<RestrictionPatch
						draft={draft}
						onCancel={onDone}
						onView={setView}
					/>
				),
			},
			expireAt: {
				children: (
					<ExpireAtPatch
						draft={draft}
						onCancel={onDone}
						onView={setView}
					/>
				),
			},
			gallery: {
				children: (
					<GalleryPatch
						draft={draft}
						onCancel={onDone}
						onView={setView}
						defaultUploadIds={draft.gallery.items.map((item) => item.uploadId)}
					/>
				),
			},
			description: {
				children: (
					<DescriptionPatch
						draft={draft}
						onCancel={onDone}
						onView={setView}
					/>
				),
			},
			pros: {
				children: (
					<ProsPatch
						draft={draft}
						onCancel={onDone}
						onView={setView}
					/>
				),
			},
			cons: {
				children: (
					<ConsPatch
						draft={draft}
						onCancel={onDone}
						onView={setView}
					/>
				),
			},
		};
	}, [
		draft,
		onDone,
	]);

	return (
		<View<Data.View>
			state={{
				value: view,
				set: setView,
			}}
			views={views}
		/>
	);
};
