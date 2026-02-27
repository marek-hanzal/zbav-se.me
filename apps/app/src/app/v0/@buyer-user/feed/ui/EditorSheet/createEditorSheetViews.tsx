import { CloseIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";
import { type FC, type PropsWithChildren, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { GalleryUpload } from "~/app/@common/gallery/ui/GalleryUpload";
import type { EditorSheet } from "~/app/v0/@buyer-user/feed/ui/EditorSheet";
import { FeedEditor } from "~/app/v0/@buyer-user/feed/ui/FeedEditor";
import { AgePatch } from "~/app/v0/@buyer-user/feed/ui/patch/AgePatch";
import { CategoryPatch } from "~/app/v0/@buyer-user/feed/ui/patch/CategoryPatch";
import { ConditionPatch } from "~/app/v0/@buyer-user/feed/ui/patch/ConditionPatch";
import { DeliveryPatch } from "~/app/v0/@buyer-user/feed/ui/patch/DeliveryPatch";
import { LocationPatch } from "~/app/v0/@buyer-user/feed/ui/patch/LocationPatch";
import { NamePatch } from "~/app/v0/@buyer-user/feed/ui/patch/NamePatch";
import { RangePatch } from "~/app/v0/@buyer-user/feed/ui/patch/RangePatch";
import { SortPatch } from "~/app/v0/@buyer-user/feed/ui/patch/SortPatch";
import { TitlePatch } from "~/app/v0/@buyer-user/feed/ui/patch/TitlePatch";
import { WarrantyPatch } from "~/app/v0/@buyer-user/feed/ui/patch/WarrantyPatch";
import { toDetailHandlers } from "./toDetailHandlers";

export namespace GalleryEditor {
	export interface Props {
		feed: tFeed;
		onSuccess(): void;
		onCancel(): void;
	}
}

const GalleryEditor: FC<GalleryEditor.Props> = ({ feed, onSuccess, onCancel }) => {
	const [uploadIds, setUploadIds] = useState<string[]>(
		feed.uploadId
			? [
					feed.uploadId,
				]
			: [],
	);
	const mutation = withFeedGalleryCreateMutation.useMutation({
		async onPostMutation() {
			onSuccess();
		},
	});

	return (
		<Container
			data-ui={"FeedDetailContainer-[GalleryUploadSheet]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				gap: "default",
				inner: "default",
			}}
		>
			<GalleryUpload
				state={{
					value: uploadIds,
					set: setUploadIds,
				}}
				limit={1}
			/>

			<SaveContainer
				onCancel={() => {
					setUploadIds(
						feed.uploadId
							? [
									feed.uploadId,
								]
							: [],
					);
					onCancel();
				}}
				onSave={() => {
					mutation.mutate({
						feedId: feed.id,
						uploadIds,
					});
				}}
				loading={mutation.isPending}
				disabled={uploadIds.length === 0}
			/>
		</Container>
	);
};

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
					>
						<Tx label="Close (button)" />
					</Button>

					{children}
				</FeedEditor>
			),
			header: () => ({
				title: translator.text("Feed setup (title)"),
			}),
		},
		gallery: {
			children: (
				<GalleryEditor
					feed={feed}
					onSuccess={() => {
						setView("detail");
					}}
					onCancel={() => {
						setView("detail");
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
