import type { MarkSuspense } from "@use-pico/client/type";
import { View } from "@use-pico/client/ui/view";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { type FC, type PropsWithChildren, useCallback, useMemo, useState } from "react";
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

export namespace Data {
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
	}
}

export const Data: FC<Data.Props> = ({ _suspense, feedId, children }) => {
	const { data: feed } = withFeedQuery.useFetchQuery(feedId);
	const [view, setView] = useState<Data.View>("default");

	const onDone = useCallback(() => {
		setView("default");
	}, []);

	const views = useMemo<View.Views<Data.View>>(() => {
		const editorView = {
			children: (
				<Editor
					feed={feed}
					onView={setView}
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
		onDone,
		children,
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
