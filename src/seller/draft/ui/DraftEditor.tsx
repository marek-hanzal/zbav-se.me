import { type FC, useCallback } from "react";
import type { MarkSuspense } from "@/lib/client/type";
import { Panel, useView } from "@/lib/client/view";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import { withDraftAttrOfQuery } from "~/user/draft-attr/query/withDraftAttrOfQuery";
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

export namespace DraftEditor {
	export interface Props extends MarkSuspense.Props {
		draftId: string;
	}
}

export const DraftEditor: FC<DraftEditor.Props> = ({ _suspense, draftId }) => {
	const { data: draft } = withDraftQuery.useFetchQuery(draftId);

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

	const { data: attrs } = withDraftAttrOfQuery.useSuspenseQuery({
		draftId,
		categoryId: draft.categoryId ?? "unknown",
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
					draftId={draft.id}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"gallery"}>
				<GalleryPatch
					_suspense={_suspense}
					draft={draft}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"title"}>
				<TitlePatch
					draft={draft}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"category"}>
				<CategoryPatch
					draft={draft}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"location"}>
				<LocationPatch
					draft={draft}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"priceType"}>
				<PriceTypePatch
					draft={draft}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"price"}>
				<PricePatch
					draft={draft}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"expires"}>
				<ExpiresPatch
					draft={draft}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"condition"}>
				<ConditionPatch
					draft={draft}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"age"}>
				<AgePatch
					draft={draft}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"delivery"}>
				<DeliveryPatch
					draft={draft}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"warranty"}>
				<WarrantyPatch
					draft={draft}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"restriction"}>
				<RestrictionPatch
					draft={draft}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"description"}>
				<DescriptionPatch
					draft={draft}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"pros"}>
				<ProsPatch
					draft={draft}
					onCancel={onDone}
					view={editor}
				/>
			</editor.Panel>

			<editor.Panel name={"cons"}>
				<ConsPatch
					draft={draft}
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
							draftId={draft.id}
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
							draftId={draft.id}
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
