import { useCallback, useMemo, useState } from "react";
import { withFallback } from "@/lib/client/fallback";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { View } from "@/lib/client/view";
import { translator } from "@/lib/common/translator";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
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

export namespace DraftEditor {
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

/**
 * Orchestrates editing sections and suspense states for the draft workflow.
 * Use it as the top-level editor body for this domain flow.
 */
export const DraftEditor = withFallback(
	({ _suspense, draftId }: DraftEditor.Props) => {
		const locale = useLocale();
		const { data: draft } = withDraftQuery.useFetchQuery(draftId);
		const [view, setView] = useState<DraftEditor.View>("default");

		const onDone = useCallback(() => {
			setView("default");
		}, []);

		const views = useMemo<View.Views<DraftEditor.View>>(() => {
			return {
				default: {
					children: (
						<Editor
							_suspense={"I know"}
							draft={draft}
							locale={locale}
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
							defaultUploadIds={draft.withUploadIds}
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
			locale,
			onDone,
		]);

		return (
			<View<DraftEditor.View>
				state={{
					value: view,
					set: setView,
				}}
				views={views}
			/>
		);
	},
	function DraftEditorFallback(props: TitleContainer.Props) {
		const locale = useLocale();

		return (
			<TitleContainer
				textTitle={translator.text("Draft edit (title)")}
				left={
					<BackHomeButton
						to="/$locale/app/seller/draft/list"
						params={{
							locale,
						}}
					/>
				}
				right={<HomeMenuButton />}
				{...props}
			>
				<SpinnerContainer />
			</TitleContainer>
		);
	},
);
