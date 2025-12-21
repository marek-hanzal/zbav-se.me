import { CloseIcon } from "@use-pico/client/icon";
import type { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { SheetView } from "@use-pico/client/ui/sheet-view";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/user/feed";
import { type FC, useState } from "react";
import { Feed } from "~/app/feed/ui/Feed";
import { AgePatch } from "~/app/feed/ui/patch/AgePatch";
import { CategoryPatch } from "~/app/feed/ui/patch/CategoryPatch";
import { ConditionPatch } from "~/app/feed/ui/patch/ConditionPatch";
import { LocationPatch } from "~/app/feed/ui/patch/LocationPatch";
import { NamePatch } from "~/app/feed/ui/patch/NamePatch";
import { RangePatch } from "~/app/feed/ui/patch/RangePatch";
import { SortPatch } from "~/app/feed/ui/patch/SortPatch";
import { TitlePatch } from "~/app/feed/ui/patch/TitlePatch";
import { GalleryUploadControl } from "~/app/photo/ui/GalleryUploadControl";

export namespace SetupSheet {
	export type Views =
		| "detail"
		| "name"
		| "category"
		| "location"
		| "range"
		| "sort"
		| "condition"
		| "age"
		| "gallery"
		| "title";

	export interface Props extends BottomSheet.PropsEx {
		feed: tFeed;
		noDelete?: boolean;
		state: StateType.State<boolean>;
	}
}

export const SetupSheet: FC<SetupSheet.Props> = ({
	feed,
	state,
	noDelete = false,
	children,
	...props
}) => {
	const [view, setView] = useState<SetupSheet.Views>("detail");

	return (
		<SheetView<SetupSheet.Views>
			data-ui={"FeedSetupSheet[SheetView]"}
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
						<Feed
							data-ui={"FeedSetupButton-[FeedDetailContainer]"}
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
						</Feed>
					),
					header: () => ({
						title: translator.text("Feed setup (title)"),
					}),
				},
				gallery: {
					children: (
						<GalleryUploadControl
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
