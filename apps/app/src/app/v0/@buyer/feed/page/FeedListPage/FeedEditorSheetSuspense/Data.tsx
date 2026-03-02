import { RefreshIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { StateType } from "@use-pico/common/type";
import type { FC } from "react";
import { FeedEditorSheet } from "~/app/@buyer/feed/FeedEditor/FeedEditorSheet";

export namespace Data {
	export interface Props {
		feedId: string;
		state: StateType.State<boolean>;
		onRefresh(): void;
	}
}

export const Data: FC<Data.Props> = ({ feedId, state, onRefresh }) => {
	return (
		<FeedEditorSheet
			data-ui={"FeedEditorSheet[EditorSheet]"}
			feedId={feedId}
			state={state}
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
		</FeedEditorSheet>
	);
};
