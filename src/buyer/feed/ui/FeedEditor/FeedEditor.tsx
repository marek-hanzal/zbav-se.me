import { type PropsWithChildren, useCallback, useMemo, useState } from "react";
import { withFallback } from "@/lib/client/fallback";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { View } from "@/lib/client/view";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { Editor } from "./Editor";

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
					children: "not yet",
				},
				name: {
					children: "not yet",
				},
				category: {
					children: "not yet",
				},
				location: {
					children: "not yet",
				},
				range: {
					children: "not yet",
				},
				sort: {
					children: "not yet",
				},
				condition: {
					children: "not yet",
				},
				age: {
					children: "not yet",
				},
				delivery: {
					children: "not yet",
				},
				warranty: {
					children: "not yet",
				},
				title: {
					children: "not yet",
				},
			};
		}, [
			feed,
			hidden,
			// onDone,
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
