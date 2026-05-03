import { type PropsWithChildren, useCallback } from "react";
import { withFallback } from "@/lib/client/fallback";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { useView } from "@/lib/client/view";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { Editor } from "./Editor";
import { CategoryPatch } from "./patch/CategoryPatch";
import { LocationPatch } from "./patch/LocationPatch";

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
		const view = useView({
			panels: [
				"default",
				"gallery",
				"name",
				"category",
				"sort",
				"location",
				"range",
			],
			defaultPanel: "default",
		});

		const onDone = useCallback(() => {
			view.set("default");
		}, [
			view,
		]);

		return (
			<view.View>
				<view.Panel name="default">
					<Editor
						_suspense={"I know"}
						feed={feed}
						view={view}
						hidden={hidden}
					>
						{children}
					</Editor>
				</view.Panel>

				<view.Panel name="category">
					<CategoryPatch
						feed={feed}
						onCancel={() => {
							view.set("default");
						}}
					/>
				</view.Panel>

				<view.Panel name="location">
					<LocationPatch
						feed={feed}
						onCancel={() => {
							view.set("default");
						}}
					/>
				</view.Panel>
			</view.View>
		);
	},
	SpinnerContainer,
);
