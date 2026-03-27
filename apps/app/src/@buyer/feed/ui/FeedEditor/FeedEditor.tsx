import type { MarkSuspense } from "@use-pico/client/type";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { View } from "@use-pico/client/ui/view";
import { withFallback } from "@use-pico/client/utils";
import { type PropsWithChildren, useCallback, useMemo, useState } from "react";
import { withFeedQuery } from "~/@buyer/feed/query/withFeedQuery";
import { Editor } from "./Editor";
import { AgePatch } from "./patch/AgePatch";
import { CategoryPatch } from "./patch/CategoryPatch";
import { ConditionPatch } from "./patch/ConditionPatch";
import { DeliveryPatch } from "./patch/DeliveryPatch";
import { GalleryPatch } from "./patch/GalleryPatch";
import { LocationPatch } from "./patch/LocationPatch";
import { NamePatch } from "./patch/NamePatch";
import { RangePatch } from "./patch/RangePatch";
import { SortPatch } from "./patch/SortPatch";
import { TitlePatch } from "./patch/TitlePatch";
import { WarrantyPatch } from "./patch/WarrantyPatch";

export namespace FeedEditor {
	export type View =
		| "default"
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

	export interface Props extends PropsWithChildren, MarkSuspense.Props {
		feedId: string;
		hidden?: readonly Editor.Section[];
	}
}

export const FeedEditor = withFallback(
	({ _suspense, feedId, hidden, children }: FeedEditor.Props) => {
		const { data: feed } = withFeedQuery.useFetchQuery(feedId);
		const [view, setView] = useState<FeedEditor.View>("default");

		const onDone = useCallback(() => {
			setView("default");
		}, []);

		const views = useMemo<View.Views<FeedEditor.View>>(() => {
			const editorView = {
				children: (
					<Editor
						_suspense={"I know"}
						feed={feed}
						onView={setView}
						hidden={hidden}
					>
						{children}
					</Editor>
				),
			};

			return {
				default: editorView,
				gallery: {
					children: (
						<GalleryPatch
							feed={feed}
							onCancel={onDone}
							onSettled={onDone}
						/>
					),
				},
				name: {
					children: (
						<NamePatch
							feed={feed}
							onCancel={onDone}
							onSettled={onDone}
						/>
					),
				},
				category: {
					children: (
						<CategoryPatch
							feed={feed}
							onCancel={onDone}
							onSettled={onDone}
						/>
					),
				},
				location: {
					children: (
						<LocationPatch
							feed={feed}
							onCancel={onDone}
							onSettled={onDone}
						/>
					),
				},
				range: {
					children: (
						<RangePatch
							feed={feed}
							onCancel={onDone}
							onSettled={onDone}
						/>
					),
				},
				sort: {
					children: (
						<SortPatch
							feed={feed}
							onCancel={onDone}
							onSettled={onDone}
						/>
					),
				},
				condition: {
					children: (
						<ConditionPatch
							feed={feed}
							onCancel={onDone}
							onSettled={onDone}
						/>
					),
				},
				age: {
					children: (
						<AgePatch
							feed={feed}
							onCancel={onDone}
							onSettled={onDone}
						/>
					),
				},
				delivery: {
					children: (
						<DeliveryPatch
							feed={feed}
							onCancel={onDone}
							onSettled={onDone}
						/>
					),
				},
				warranty: {
					children: (
						<WarrantyPatch
							feed={feed}
							onCancel={onDone}
							onSettled={onDone}
						/>
					),
				},
				title: {
					children: (
						<TitlePatch
							feed={feed}
							onCancel={onDone}
							onSettled={onDone}
						/>
					),
				},
			};
		}, [
			feed,
			hidden,
			onDone,
			children,
		]);

		return (
			<View<FeedEditor.View>
				state={{
					value: view,
					set: setView,
				}}
				views={views}
			/>
		);
	},
	SpinnerContainer,
);
