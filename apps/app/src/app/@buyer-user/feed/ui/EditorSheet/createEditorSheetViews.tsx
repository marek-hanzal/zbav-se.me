import { CloseIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";
import type { PropsWithChildren } from "react";
import type { EditorSheet } from "~/app/@buyer-user/feed/ui/EditorSheet";
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
import { toDetailHandlers } from "./toDetailHandlers";

export namespace createEditorSheetViews {
	export interface Props extends PropsWithChildren {
		feed: tFeed;
		noDelete: boolean;
		state: StateType.State<boolean>;
		setView: (view: EditorSheet.Views) => void;
	}
}

export const createEditorSheetViews = ({
	feed,
	noDelete,
	children,
	state,
	setView,
}: createEditorSheetViews.Props) => {
	const detailHandlers = toDetailHandlers(setView);

	return {
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
						label={translator.text("Close (button)")}
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
							width: "full",
							round: undefined,
							shadow: false,
							border: false,
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
					{...detailHandlers}
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
					{...detailHandlers}
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
					{...detailHandlers}
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
					{...detailHandlers}
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
					{...detailHandlers}
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
					{...detailHandlers}
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
					{...detailHandlers}
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
					{...detailHandlers}
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
					{...detailHandlers}
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
					{...detailHandlers}
				/>
			),
			header: () => ({
				title: translator.text("Feed title (title)"),
			}),
		},
	};
};
