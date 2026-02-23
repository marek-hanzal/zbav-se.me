import { TrashIcon } from "@use-pico/client/icon";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
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
				label: translator.text("Delete feed (button)"),
			}}
			confirmProps={{
				iconEnabled: TrashIcon,
				ui: {
					tone: "danger",
					theme: "light",
				},
				label: translator.text("Really delete feed (button)"),
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
