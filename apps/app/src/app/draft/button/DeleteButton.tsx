import { TrashIcon } from "@use-pico/client/icon";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import { withDraftDeleteMutation } from "@zbav-se.me/sdk/mutation/user";
import { uiSaveButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace DeleteButton {
	export interface Props {
		draft: tDraft;
		onDelete(): Promise<any>;
	}
}

export const DeleteButton: FC<DeleteButton.Props> = ({ draft, onDelete }) => {
	const deleteMutation = withDraftDeleteMutation.useMutation({
		onSuccess: onDelete,
	});

	return (
		<ConfirmButton
			iconEnabled={TrashIcon}
			iconProps={{
				ui: {
					text: "2xl",
				},
			}}
			label={"Delete draft (button)"}
			disabled={deleteMutation.isPending}
			loading={deleteMutation.isPending}
			buttonProps={{
				ui: {
					justify: "start",
					items: "center",
				},
			}}
			confirmProps={{
				ui: {
					tone: "danger",
					theme: "light",
					justify: "start",
					items: "center",
				},
				label: translator.text("Delete draft - confirm (button)"),
				onClick() {
					deleteMutation.mutate({
						where: {
							id: draft.id,
						},
					});
				},
			}}
			{...uiSaveButton({
				ui: {
					tone: "neutral",
				},
				className: [],
			})}
		/>
	);
};
