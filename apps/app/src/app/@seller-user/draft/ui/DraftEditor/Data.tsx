import type { MarkSuspense } from "@use-pico/client/type";
import { View } from "@use-pico/client/ui/view";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import { Editor } from "~/app/@seller-user/draft/ui/DraftEditor/Editor";
import { CategoryPatch } from "~/app/@seller-user/draft/ui/DraftEditor/patch/CategoryPatch";
import { DescriptionPatch } from "~/app/@seller-user/draft/ui/DraftEditor/patch/DescriptionPatch";
import { TitlePatch } from "~/app/@seller-user/draft/ui/DraftEditor/patch/TitlePatch";
import { AgePatch } from "~/app/v0/@seller-user/draft/ui/patch/AgePatch";
import { ConditionPatch } from "~/app/v0/@seller-user/draft/ui/patch/ConditionPatch";
import { ConsPatch } from "~/app/v0/@seller-user/draft/ui/patch/ConsPatch";
import { DeliveryPatch } from "~/app/v0/@seller-user/draft/ui/patch/DeliveryPatch";
import { ExpireAtPatch } from "~/app/v0/@seller-user/draft/ui/patch/ExpireAtPatch";
import { GalleryPatch } from "~/app/v0/@seller-user/draft/ui/patch/GalleryPatch";
import { LocationPatch } from "~/app/v0/@seller-user/draft/ui/patch/LocationPatch";
import { PricePatch } from "~/app/v0/@seller-user/draft/ui/patch/PricePatch";
import { PriceTypePatch } from "~/app/v0/@seller-user/draft/ui/patch/PriceTypePatch";
import { ProsPatch } from "~/app/v0/@seller-user/draft/ui/patch/ProsPatch";
import { RestrictionPatch } from "~/app/v0/@seller-user/draft/ui/patch/RestrictionPatch";
import { WarrantyPatch } from "~/app/v0/@seller-user/draft/ui/patch/WarrantyPatch";

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
						onSettled={onDone}
					/>
				),
			},
			location: {
				children: (
					<LocationPatch
						draft={draft}
						onCancel={onDone}
						onSettled={onDone}
					/>
				),
			},
			price: {
				children: (
					<PricePatch
						draft={draft}
						onCancel={onDone}
						onSettled={onDone}
					/>
				),
			},
			priceType: {
				children: (
					<PriceTypePatch
						draft={draft}
						onCancel={onDone}
						onSettled={onDone}
					/>
				),
			},
			category: {
				children: (
					<CategoryPatch
						draft={draft}
						onCancel={onDone}
						onSettled={onDone}
					/>
				),
			},
			condition: {
				children: (
					<ConditionPatch
						draft={draft}
						onCancel={onDone}
						onSettled={onDone}
					/>
				),
			},
			age: {
				children: (
					<AgePatch
						draft={draft}
						onCancel={onDone}
						onSettled={onDone}
					/>
				),
			},
			delivery: {
				children: (
					<DeliveryPatch
						draft={draft}
						onCancel={onDone}
						onSettled={onDone}
					/>
				),
			},
			warranty: {
				children: (
					<WarrantyPatch
						draft={draft}
						onCancel={onDone}
						onSettled={onDone}
					/>
				),
			},
			restriction: {
				children: (
					<RestrictionPatch
						draft={draft}
						onCancel={onDone}
						onSettled={onDone}
					/>
				),
			},
			expireAt: {
				children: (
					<ExpireAtPatch
						draft={draft}
						onCancel={onDone}
						onSettled={onDone}
					/>
				),
			},
			gallery: {
				children: (
					<GalleryPatch
						draft={draft}
						onCancel={onDone}
						onSuccess={onDone}
						defaultUploadIds={draft.gallery.items.map((item) => item.uploadId)}
					/>
				),
			},
			description: {
				children: (
					<DescriptionPatch
						draft={draft}
						onCancel={onDone}
						onSettled={onDone}
					/>
				),
			},
			pros: {
				children: (
					<ProsPatch
						draft={draft}
						onCancel={onDone}
						onSettled={onDone}
					/>
				),
			},
			cons: {
				children: (
					<ConsPatch
						draft={draft}
						onCancel={onDone}
						onSettled={onDone}
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
