import { CloseIcon } from "@use-pico/client/icon";
import type { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { SheetView } from "@use-pico/client/ui/sheet-view";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";
import { type FC, useState } from "react";
import { FeedEditor } from "~/app/@buyer-user/feed/ui/FeedEditor";
import { AgePatch } from "~/app/@buyer-user/feed/ui/patch/AgePatch";
import { CategoryPatch } from "~/app/@buyer-user/feed/ui/patch/CategoryPatch";
import { ConditionPatch } from "~/app/@buyer-user/feed/ui/patch/ConditionPatch";
import { DeliveryPatch } from "~/app/@buyer-user/feed/ui/patch/DeliveryPatch";
import { LocationPatch } from "~/app/@buyer-user/feed/ui/patch/LocationPatch";
import { NamePatch } from "~/app/@buyer-user/feed/ui/patch/NamePatch";
import { RangePatch } from "~/app/@buyer-user/feed/ui/patch/RangePatch";
import { SortPatch } from "~/app/@buyer-user/feed/ui/patch/SortPatch";
import { TitlePatch } from "~/app/@buyer-user/feed/ui/patch/TitlePatch";
import { WarrantyPatch } from "~/app/@buyer-user/feed/ui/patch/WarrantyPatch";
import { GalleryUploadContainer } from "~/app/@common/gallery/ui/GalleryUploadContainer";

export namespace EditorSheet {
	export type Views =
		| "detail"
		| "name"
		| "category"
		| "location"
		| "range"
		| "sort"
		| "condition"
		| "age"
		| "delivery"
		| "warranty"
		| "gallery"
		| "title";

	export interface Props extends BottomSheet.PropsEx {
		feed: tFeed;
		noDelete?: boolean;
		state: StateType.State<boolean>;
	}
}

export const EditorSheet: FC<EditorSheet.Props> = ({
	feed,
	state,
	noDelete = false,
	children,
	...props
}) => {
	const [view, setView] = useState<EditorSheet.Views>("detail");

	return (
		<SheetView<EditorSheet.Views>
			data-ui={"FeedEditorSheet[SheetView]"}
			isOpen={state.value}
			onClose={() => {
				state.set(false);
				setView("detail");
			}}
			detent={"full"}
			state={{
				value: view,
				set: setView,
			}}
			views={{
				detail: {
					children: (
						<FeedEditor
							data-ui={"FeedEditorSheet-[FeedDetailEditor]"}
							feed={feed}
							noDelete={noDelete}
							ui={{
								inner: "default",
							}}
							values={{
								gallery: {
									onClick: () => setView("gallery"),
								},
								name: {
									onClick: () => setView("name"),
								},
								category: {
									onClick: () => setView("category"),
								},
								location: {
									onClick: () => setView("location"),
								},
								range: {
									onClick: () => setView("range"),
								},
								sort: {
									onClick: () => setView("sort"),
								},
								condition: {
									onClick: () => setView("condition"),
								},
								age: {
									onClick: () => setView("age"),
								},
								delivery: {
									onClick: () => setView("delivery"),
								},
								warranty: {
									onClick: () => setView("warranty"),
								},
								title: {
									onClick: () => setView("title"),
								},
							}}
						>
							<Button
								label={"Close (button)"}
								onClick={() => state.set(false)}
								iconEnabled={CloseIcon}
								iconProps={{
									ui: {
										text: "xl",
									},
								}}
								ui={{
									tone: "neutral",
									theme: "light",
									size: "default",
									justify: "start",
									items: "center",
									background: "default",
									shadow: true,
									border: true,
								}}
							/>

							{children}
						</FeedEditor>
					),
					header: () => ({
						title: translator.text("Feed setup (title)"),
					}),
				},
				gallery: {
					children: (
						<GalleryUploadContainer
							data-ui={"FeedDetailContainer-[GalleryUploadSheet]"}
							withMutation={withFeedGalleryCreateMutation}
							defaultUploadIds={
								feed.uploadId
									? [
											feed.uploadId,
										]
									: []
							}
							toMutation={(uploadIds) => ({
								feedId: feed.id,
								uploadIds,
							})}
							onSuccess={() => {
								setView("detail");
							}}
							onCancel={() => {
								setView("detail");
							}}
							ui={{
								inner: "default",
							}}
						/>
					),
					header: () => ({
						title: translator.text("Feed gallery (title)"),
					}),
				},
				name: {
					children: (
						<NamePatch
							feed={feed}
							onSettled={() => setView("detail")}
							onCancel={() => setView("detail")}
						/>
					),
					header: () => ({
						title: translator.text("Feed setup - name (title)"),
					}),
				},
				category: {
					children: (
						<CategoryPatch
							feed={feed}
							onSettled={() => setView("detail")}
							onCancel={() => setView("detail")}
						/>
					),
					header: () => ({
						title: translator.text("Feed category (title)"),
					}),
				},
				location: {
					children: (
						<LocationPatch
							feed={feed}
							onSettled={() => setView("detail")}
							onCancel={() => setView("detail")}
						/>
					),
					header: () => ({
						title: translator.text("Feed location (title)"),
					}),
				},
				range: {
					children: (
						<RangePatch
							feed={feed}
							onSettled={() => setView("detail")}
							onCancel={() => setView("detail")}
						/>
					),
					header: () => ({
						title: translator.text("Feed range (title)"),
					}),
				},
				sort: {
					children: (
						<SortPatch
							feed={feed}
							onSettled={() => setView("detail")}
							onCancel={() => setView("detail")}
						/>
					),
					header: () => ({
						title: translator.text("Feed sorting (title)"),
					}),
				},
				condition: {
					children: (
						<ConditionPatch
							feed={feed}
							onSettled={() => setView("detail")}
							onCancel={() => setView("detail")}
						/>
					),
					header: () => ({
						title: translator.text("Feed condition (title)"),
					}),
				},
				age: {
					children: (
						<AgePatch
							feed={feed}
							onSettled={() => setView("detail")}
							onCancel={() => setView("detail")}
						/>
					),
					header: () => ({
						title: translator.text("Feed age (title)"),
					}),
				},
				delivery: {
					children: (
						<DeliveryPatch
							feed={feed}
							onSettled={() => setView("detail")}
							onCancel={() => setView("detail")}
						/>
					),
					header: () => ({
						title: translator.text("Feed delivery (title)"),
					}),
				},
				warranty: {
					children: (
						<WarrantyPatch
							feed={feed}
							onSettled={() => setView("detail")}
							onCancel={() => setView("detail")}
						/>
					),
					header: () => ({
						title: translator.text("Warranty (title)"),
					}),
				},
				title: {
					children: (
						<TitlePatch
							feed={feed}
							onSettled={() => setView("detail")}
							onCancel={() => setView("detail")}
						/>
					),
					header: () => ({
						title: translator.text("Feed title (title)"),
					}),
				},
			}}
			{...props}
		/>
	);
};
