import { RefreshIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import { EditorSheet } from "~/app/@buyer-user/feed/ui/EditorSheet";

export namespace FeedEditorSheet {
	export interface Props {
		feedId: string;
		state: StateType.State<boolean>;
		onRefresh(): void;
	}
}

export const FeedEditorSheet: FC<FeedEditorSheet.Props> = ({ feedId, state, onRefresh }) => {
	const feedQuery = withFeedQuery.useQuery(feedId);

	return (
		<EditorSheet
			data-ui={"FeedEditorSheet[EditorSheet]"}
			feed={feedQuery.data}
			state={state}
			noDelete
		>
			<Button
				onClick={onRefresh}
				iconEnabled={RefreshIcon}
				iconProps={{
					ui: {
						text: "xl",
					},
				}}
				label={translator.text("Refresh feed (button)")}
				ui={{
					tone: "neutral",
					theme: "light",
					size: "default",
					justify: "start",
					items: "center",
					background: "default",
					round: undefined,
					shadow: false,
					border: false,
					width: "full",
				}}
			/>
		</EditorSheet>
	);
};
