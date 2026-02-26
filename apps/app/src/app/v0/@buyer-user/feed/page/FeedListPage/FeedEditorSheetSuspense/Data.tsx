import { RefreshIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { StateType } from "@use-pico/common/type";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import { EditorSheet } from "~/app/v0/@buyer-user/feed/ui/EditorSheet";

export namespace Data {
	export interface Props {
		feedId: string;
		state: StateType.State<boolean>;
		onRefresh(): void;
	}
}

export const Data: FC<Data.Props> = ({ feedId, state, onRefresh }) => {
	const { data: feed } = withFeedQuery.useFetchQuery(feedId);

	return (
		<EditorSheet
			data-ui={"FeedEditorSheet[EditorSheet]"}
			feed={feed}
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
			>
				<Tx label="Refresh feed (button)" />
			</Button>
		</EditorSheet>
	);
};
