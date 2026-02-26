import { TrashIcon } from "@use-pico/client/icon";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";

export namespace FeedEditorDeleteButton {
	export interface Props {
		loading: boolean;
		onDelete(): void;
	}
}

export const FeedEditorDeleteButton: FC<FeedEditorDeleteButton.Props> = ({ loading, onDelete }) => {
	return (
		<ConfirmButton
			iconEnabled={TrashIcon}
			iconProps={{
				ui: {
					text: "xl",
				},
			}}
			buttonProps={{
				children: <Tx label="Delete feed (button)" />,
			}}
			confirmProps={{
				iconEnabled: TrashIcon,
				ui: {
					tone: "danger",
					theme: "light",
				},
				children: <Tx label="Really delete feed (button)" />,
				onClick() {
					onDelete();
				},
			}}
			loading={loading}
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
	);
};
