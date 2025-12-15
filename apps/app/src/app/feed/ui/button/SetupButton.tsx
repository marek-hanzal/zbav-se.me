import { SettingsIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { SheetView } from "@use-pico/client/ui/sheet-view";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { CloseButton } from "@zbav-se.me/ui/button";
import { type FC, useEffect, useState } from "react";
import { Feed } from "~/app/feed/ui/Feed";
import { AgePatch } from "~/app/feed/ui/patch/AgePatch";
import { CategoryPatch } from "~/app/feed/ui/patch/CategoryPatch";
import { ConditionPatch } from "~/app/feed/ui/patch/ConditionPatch";
import { LocationPatch } from "~/app/feed/ui/patch/LocationPatch";
import { NamePatch } from "~/app/feed/ui/patch/NamePatch";
import { SortPatch } from "~/app/feed/ui/patch/SortPatch";
import { TitlePatch } from "~/app/feed/ui/patch/TitlePatch";
import { GalleryUploadControl } from "~/app/photo/ui/GalleryUploadControl";

export namespace SetupButton {
	export type Views =
		| "detail"
		| "name"
		| "category"
		| "location"
		| "sort"
		| "condition"
		| "age"
		| "gallery"
		| "title";

	export interface Props extends Button.Props {
		locale: string;
		feed: tFeed;
		defaultOpen: boolean;
		noDelete: boolean | undefined;
		state: StateType.State<boolean>;
	}
}

export const SetupButton: FC<SetupButton.Props> = ({
	locale,
	feed,
	defaultOpen,
	noDelete,
	state,
	children,
	ui,
	...props
}) => {
	const [view, setView] = useState<SetupButton.Views>("detail");

	useEffect(() => {
		setTimeout(() => {
			state.set(defaultOpen);
		}, 100);
	}, [
		defaultOpen,
		state.set,
	]);

	return (
		<>
			<Button
				data-ui={"FeedSetupButton[Button]"}
				iconEnabled={SettingsIcon}
				label={"Feed setup (button)"}
				onClick={() => state.set((prev) => !prev)}
				ui={{
					...ui,
				}}
				{...props}
			/>

			<SheetView<SetupButton.Views>
				data-ui={"FeedSetupButton-[BottomSheet]"}
				isOpen={state.value}
				onClose={() => state.set(false)}
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
								locale={locale}
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
								{children}
							</Feed>
						),
						header: ({ close }) => ({
							title: translator.text("Feed setup (title)"),
							right: <CloseButton onClick={close} />,
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
								locale={locale}
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
								locale={locale}
								feed={feed}
								onSettled={() => setView("detail")}
								onCancel={() => setView("detail")}
							/>
						),
						header: () => ({
							title: translator.text("Feed location (title)"),
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
			/>
		</>
	);
};
