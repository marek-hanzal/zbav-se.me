import type { MarkSuspense } from "@use-pico/client/type";
import { View } from "@use-pico/client/ui/view";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { type FC, useCallback, useMemo, useState } from "react";
import { AgePatch } from "~/app/v0/@buyer/feed/ui/patch/AgePatch";
import { CategoryPatch } from "~/app/v0/@buyer/feed/ui/patch/CategoryPatch";
import { ConditionPatch } from "~/app/v0/@buyer/feed/ui/patch/ConditionPatch";
import { DeliveryPatch } from "~/app/v0/@buyer/feed/ui/patch/DeliveryPatch";
import { LocationPatch } from "~/app/v0/@buyer/feed/ui/patch/LocationPatch";
import { NamePatch } from "./patch/NamePatch";
import { RangePatch } from "~/app/v0/@buyer/feed/ui/patch/RangePatch";
import { SortPatch } from "~/app/v0/@buyer/feed/ui/patch/SortPatch";
import { TitlePatch } from "~/app/v0/@buyer/feed/ui/patch/TitlePatch";
import { WarrantyPatch } from "~/app/v0/@buyer/feed/ui/patch/WarrantyPatch";
import { Editor } from "./Editor";
import { GalleryPatch } from "./patch/GalleryPatch";

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

	export interface Props extends MarkSuspense.Props {
		feedId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, feedId }) => {
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
				/>
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
