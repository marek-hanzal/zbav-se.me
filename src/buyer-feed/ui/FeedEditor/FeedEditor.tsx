import { type PropsWithChildren, useCallback } from "react";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import { AgePatch } from "~/buyer-feed/ui/FeedEditor/AgePatch";
import { AttrEditor } from "~/buyer-feed/ui/FeedEditor/AttrEditor";
import { CategoryPatch } from "~/buyer-feed/ui/FeedEditor/CategoryPatch";
import { ConditionPatch } from "~/buyer-feed/ui/FeedEditor/ConditionPatch";
import { DeliveryPatch } from "~/buyer-feed/ui/FeedEditor/DeliveryPatch";
import { Editor } from "~/buyer-feed/ui/FeedEditor/Editor";
import { FulltextPatch } from "~/buyer-feed/ui/FeedEditor/FulltextPatch";
import { GalleryPatch } from "~/buyer-feed/ui/FeedEditor/GalleryPatch";
import { LocationPatch } from "~/buyer-feed/ui/FeedEditor/LocationPatch";
import { PriceMaxPatch } from "~/buyer-feed/ui/FeedEditor/PriceMaxPatch";
import { PriceMinPatch } from "~/buyer-feed/ui/FeedEditor/PriceMinPatch";
import { PriceTypePatch } from "~/buyer-feed/ui/FeedEditor/PriceTypePatch";
import { RangePatch } from "~/buyer-feed/ui/FeedEditor/RangePatch";
import { SortPatch } from "~/buyer-feed/ui/FeedEditor/SortPatch";
import { StatusPatch } from "~/buyer-feed/ui/FeedEditor/StatusPatch";
import { TitlePatch } from "~/buyer-feed/ui/FeedEditor/TitlePatch";
import { WarrantyPatch } from "~/buyer-feed/ui/FeedEditor/WarrantyPatch";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withFallback } from "~/ui/fn/withFallback";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { useView } from "~/view/hook/useView";

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
				"status",
				"delivery",
				"warranty",
				"title",
				"priceType",
				"priceMin",
				"priceMax",
				"fulltext",
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
						_suspense={_suspense}
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

				<view.Panel name="status">
					<StatusPatch
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

				<view.Panel name="title">
					<TitlePatch
						feed={feed}
						onSettled={onDefaultView}
						onCancel={onDefaultView}
					/>
				</view.Panel>

				<view.Panel name="fulltext">
					<FulltextPatch
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
