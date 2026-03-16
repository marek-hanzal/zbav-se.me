import { SettingsIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { withFallback } from "@use-pico/client/utils";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import { type Ref, useMemo, useState } from "react";
import { FeedEditorSheet } from "../../FeedEditor/FeedEditorSheet";
import { ListingList } from "../ListingList";
import { Empty } from "./Empty";
import { FilterEmpty } from "./FilterEmpty";

export namespace Content {
	export interface Props extends MarkSuspense.Props {
		feedId: string;
		scrollToId: string | undefined;
		sentinelRef: Ref<HTMLDivElement | null>;
		isLast: boolean;
	}
}

export const Content = withFallback(
	({ _suspense, feedId, scrollToId, sentinelRef, isLast }: Content.Props) => {
		const [isEditor, setIsEditor] = useState(false);
		const { data: feed } = withFeedQuery.useFetchQuery(feedId);
		const { data: anyListingCollection } = withListingQuery.useCollectionQuery({});
		const { data: currentListingCollection } = withListingQuery.useCollectionQuery({});

		const check = useMemo(() => {
			return [
				{
					check() {
						return !anyListingCollection.length;
					},
					render() {
						return <Empty />;
					},
				},
				{
					check() {
						return !currentListingCollection.length;
					},
					render() {
						return <FilterEmpty />;
					},
				},
			] as EmptyState.Check[];
		}, [
			anyListingCollection,
			currentListingCollection,
		]);

		return (
			<>
				<EmptyState check={check}>
					<Button
						data-action={isEditor ? "close feed setup" : "open feed setup"}
						iconEnabled={SettingsIcon}
						onClick={() => setIsEditor((prev) => !prev)}
						ui={{
							tone: "secondary",
							theme: "light",
							background: "default",
							justify: "center",
							items: "center",
							square: "default",
							zIndex: true,
							round: "full",
							snapTo: "top-right",
							text: "xl",
							opacity: isLast ? "none" : "8",
						}}
						className={"transition-all"}
					/>

					<ListingList
						_suspense={"I know"}
						feedId={feedId}
						withScore
						scrollToId={scrollToId}
						query={{
							...feed.query,
							cursor: {
								page: 0,
								size: 256,
							},
						}}
						appendix={<div ref={sentinelRef} />}
					/>
				</EmptyState>

				<FeedEditorSheet
					feedId={feedId}
					state={{
						value: isEditor,
						set: setIsEditor,
					}}
				/>
			</>
		);
	},
	SpinnerContainer,
);
