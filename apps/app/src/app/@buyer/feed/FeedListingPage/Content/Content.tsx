import { SettingsIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { withFallback } from "@use-pico/client/utils";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { type Ref, Suspense, useState } from "react";
import { FeedEditorSheet } from "../../FeedEditor/FeedEditorSheet";
import { ListingList } from "../ListingList";

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

		return (
			<>
				<Button
					data-ui={"Content"}
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

				<Suspense fallback={<ListingList.Fallback />}>
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
				</Suspense>

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
