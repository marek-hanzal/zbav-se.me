import { SettingsIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { type FC, type Ref, useState } from "react";
import { FeedEditorSheet } from "../../FeedEditor/FeedEditorSheet";
import { ListingList } from "../ListingList/ListingList";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		feedId: string;
		scrollToId: string | undefined;
		sentinelRef: Ref<HTMLDivElement | null>;
		isLast: boolean;
	}
}

export const Data: FC<Data.Props> = ({ feedId, scrollToId, sentinelRef, isLast }) => {
	const [isEditor, setIsEditor] = useState(false);
	const { data: feed } = withFeedQuery.useFetchQuery(feedId);

	return (
		<>
			<Button
				data-ui={"FeedSetupButton[SheetButton]"}
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

			<FeedEditorSheet
				feedId={feedId}
				state={{
					value: isEditor,
					set: setIsEditor,
				}}
			/>
		</>
	);
};
