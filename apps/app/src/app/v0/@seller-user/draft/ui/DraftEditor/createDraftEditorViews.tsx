import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import type { ReactElement } from "react";
import type { DraftEditor } from "~/app/v0/@seller-user/draft/ui/DraftEditor";
import { AgePatch } from "~/app/v0/@seller-user/draft/ui/patch/AgePatch";
import { CategoryPatch } from "~/app/v0/@seller-user/draft/ui/patch/CategoryPatch";
import { ConditionPatch } from "~/app/v0/@seller-user/draft/ui/patch/ConditionPatch";
import { ConsPatch } from "~/app/v0/@seller-user/draft/ui/patch/ConsPatch";
import { DeliveryPatch } from "~/app/v0/@seller-user/draft/ui/patch/DeliveryPatch";
import { DescriptionPatch } from "~/app/v0/@seller-user/draft/ui/patch/DescriptionPatch";
import { ExpireAtPatch } from "~/app/v0/@seller-user/draft/ui/patch/ExpireAtPatch";
import { GalleryPatch } from "~/app/v0/@seller-user/draft/ui/patch/GalleryPatch";
import { LocationPatch } from "~/app/v0/@seller-user/draft/ui/patch/LocationPatch";
import { PricePatch } from "~/app/v0/@seller-user/draft/ui/patch/PricePatch";
import { PriceTypePatch } from "~/app/v0/@seller-user/draft/ui/patch/PriceTypePatch";
import { ProsPatch } from "~/app/v0/@seller-user/draft/ui/patch/ProsPatch";
import { RestrictionPatch } from "~/app/v0/@seller-user/draft/ui/patch/RestrictionPatch";
import { TitlePatch } from "~/app/v0/@seller-user/draft/ui/patch/TitlePatch";
import { WarrantyPatch } from "~/app/v0/@seller-user/draft/ui/patch/WarrantyPatch";

export namespace createDraftEditorViews {
	export type PatchView = Exclude<DraftEditor.View, "default">;
	export interface View {
		children: ReactElement;
	}
	export type Return = Record<PatchView, View>;
	export interface Props {
		draft: tDraft;
		onDone(): void;
	}
}

export const createDraftEditorViews = ({
	draft,
	onDone,
}: createDraftEditorViews.Props): createDraftEditorViews.Return => ({
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
});
