import { type PropsWithChildren, useCallback } from "react";
import { withFallback } from "@/lib/client/fallback";
import { useRenderLogger } from "@/lib/client/log";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { useView } from "@/lib/client/view";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { getRootLogger } from "~/common/log/getRootLogger";
import { AttrEditor } from "./AttrEditor";
import { Editor } from "./Editor";
import { AgePatch } from "./patch/AgePatch";
import { CategoryPatch } from "./patch/CategoryPatch";
import { ConditionPatch } from "./patch/ConditionPatch";
import { DeliveryPatch } from "./patch/DeliveryPatch";
import { GalleryPatch } from "./patch/GalleryPatch";
import { LocationPatch } from "./patch/LocationPatch";
import { PriceMaxPatch } from "./patch/PriceMaxPatch";
import { PriceMinPatch } from "./patch/PriceMinPatch";
import { PriceTypePatch } from "./patch/PriceTypePatch";
import { RangePatch } from "./patch/RangePatch";
import { SortPatch } from "./patch/SortPatch";
import { WarrantyPatch } from "./patch/WarrantyPatch";

export namespace FeedEditor {
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
				"condition",
				"age",
				"delivery",
				"warranty",
				"title",
				"priceType",
				"priceMin",
				"priceMax",
			],
			defaultPanel: "default",
		});

		useRenderLogger({
			logger: getRootLogger(),
			name: "FeedEditor",
		});

		const onDefaultView = useCallback(() => {
			view.set("default");
		}, [
			view,
		]);

		return (
			<view.View>
				<view.Panel
					name="default"
					keep
				>
					<Editor
						_suspense={"I know"}
						feed={feed}
						view={view}
						hidden={hidden}
					>
						{children}
					</Editor>
				</view.Panel>

				<view.Panel name="gallery">
					<GalleryPatch
						feed={feed}
						onSettled={onDefaultView}
						onCancel={onDefaultView}
					/>
				</view.Panel>

				<view.Panel name="category">
					<CategoryPatch
						feed={feed}
						onSettled={onDefaultView}
						onCancel={onDefaultView}
					/>
				</view.Panel>

				<view.Panel name="location">
					<LocationPatch
						feed={feed}
						onSettled={onDefaultView}
						onCancel={onDefaultView}
					/>
				</view.Panel>

				<view.Panel name="range">
					<RangePatch
						feed={feed}
						onSettled={onDefaultView}
						onCancel={onDefaultView}
					/>
				</view.Panel>

				<view.Panel name="condition">
					<ConditionPatch
						feed={feed}
						onSettled={onDefaultView}
						onCancel={onDefaultView}
					/>
				</view.Panel>

				<view.Panel name="age">
					<AgePatch
						feed={feed}
						onSettled={onDefaultView}
						onCancel={onDefaultView}
					/>
				</view.Panel>

				<view.Panel name="delivery">
					<DeliveryPatch
						feed={feed}
						onSettled={onDefaultView}
						onCancel={onDefaultView}
					/>
				</view.Panel>

				<view.Panel name="warranty">
					<WarrantyPatch
						feed={feed}
						onSettled={onDefaultView}
						onCancel={onDefaultView}
					/>
				</view.Panel>

				<view.Panel name="priceType">
					<PriceTypePatch
						feed={feed}
						onSettled={onDefaultView}
						onCancel={onDefaultView}
					/>
				</view.Panel>

				<view.Panel name="priceMin">
					<PriceMinPatch
						feed={feed}
						onSettled={onDefaultView}
						onCancel={onDefaultView}
					/>
				</view.Panel>

				<view.Panel name="priceMax">
					<PriceMaxPatch
						feed={feed}
						onSettled={onDefaultView}
						onCancel={onDefaultView}
					/>
				</view.Panel>

				<view.Panel name="sort">
					<SortPatch
						feed={feed}
						onSettled={onDefaultView}
						onCancel={onDefaultView}
					/>
				</view.Panel>

				<AttrEditor
					_suspense={_suspense}
					feed={feed}
					view={view}
				/>
			</view.View>
		);
	},
	SpinnerContainer,
);
