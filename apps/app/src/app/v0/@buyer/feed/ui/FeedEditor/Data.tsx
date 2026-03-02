import type { MarkSuspense } from "@use-pico/client/type";
import { View } from "@use-pico/client/ui/view";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { AgePatch } from "~/app/v0/@buyer/feed/ui/patch/AgePatch";
import { CategoryPatch } from "~/app/v0/@buyer/feed/ui/patch/CategoryPatch";
import { ConditionPatch } from "~/app/v0/@buyer/feed/ui/patch/ConditionPatch";
import { DeliveryPatch } from "~/app/v0/@buyer/feed/ui/patch/DeliveryPatch";
import { LocationPatch } from "~/app/v0/@buyer/feed/ui/patch/LocationPatch";
import { RangePatch } from "~/app/v0/@buyer/feed/ui/patch/RangePatch";
import { SortPatch } from "~/app/v0/@buyer/feed/ui/patch/SortPatch";
import { TitlePatch } from "~/app/v0/@buyer/feed/ui/patch/TitlePatch";
import { WarrantyPatch } from "~/app/v0/@buyer/feed/ui/patch/WarrantyPatch";
import { Editor } from "./Editor";

export namespace Data {
	export type View =
		| "default"
		| "category"
		| "location"
		| "range"
		| "sort"
		| "condition"
		| "age"
		| "delivery"
		| "warranty"
		| "title";

	export interface Props extends Omit<Editor.Props, "feed" | "values">, MarkSuspense.Props {
		feedId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, feedId, ...props }) => {
	const { data: feed } = withFeedQuery.useFetchQuery(feedId);
	const [view, setView] = useState<Data.View>("default");

	const views = useMemo<View.Views<Data.View>>(() => {
		return {
			default: {
				children: (
					<Editor
						feed={feed}
						values={{
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
						{...props}
					/>
				),
			},
			category: {
				children: (
					<CategoryPatch
						feed={feed}
						onCancel={() => setView("default")}
						onSettled={() => setView("default")}
					/>
				),
			},
			location: {
				children: (
					<LocationPatch
						feed={feed}
						onCancel={() => setView("default")}
						onSettled={() => setView("default")}
					/>
				),
			},
			range: {
				children: (
					<RangePatch
						feed={feed}
						onCancel={() => setView("default")}
						onSettled={() => setView("default")}
					/>
				),
			},
			sort: {
				children: (
					<SortPatch
						feed={feed}
						onCancel={() => setView("default")}
						onSettled={() => setView("default")}
					/>
				),
			},
			condition: {
				children: (
					<ConditionPatch
						feed={feed}
						onCancel={() => setView("default")}
						onSettled={() => setView("default")}
					/>
				),
			},
			age: {
				children: (
					<AgePatch
						feed={feed}
						onCancel={() => setView("default")}
						onSettled={() => setView("default")}
					/>
				),
			},
			delivery: {
				children: (
					<DeliveryPatch
						feed={feed}
						onCancel={() => setView("default")}
						onSettled={() => setView("default")}
					/>
				),
			},
			warranty: {
				children: (
					<WarrantyPatch
						feed={feed}
						onCancel={() => setView("default")}
						onSettled={() => setView("default")}
					/>
				),
			},
			title: {
				children: (
					<TitlePatch
						feed={feed}
						onCancel={() => setView("default")}
						onSettled={() => setView("default")}
					/>
				),
			},
		};
	}, [
		feed,
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
