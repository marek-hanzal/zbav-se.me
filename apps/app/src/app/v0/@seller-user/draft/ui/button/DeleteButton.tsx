import { useNavigate } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { TrashIcon } from "@use-pico/client/icon";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftDeleteMutation } from "@zbav-se.me/sdk/mutation/seller-user/draft";
import { uiSaveButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace DeleteButton {
	export interface Props extends ConfirmButton.Props {
		draft: tDraft;
	}
}

export const DeleteButton: FC<DeleteButton.Props> = ({
	draft,
	buttonProps,
	confirmProps,
	ui,
	className,
	...props
}) => {
	const navigate = useNavigate();
	const locale = useLocale();
	const deleteMutation = withDraftDeleteMutation.useMutation({
		async onPostMutation() {
			await navigate({
				to: "/$locale/home",
				params: {
					locale,
				},
			});
		},
	});

	return (
		<ConfirmButton
			iconEnabled={TrashIcon}
			iconProps={{
				ui: {
					text: "2xl",
				},
			}}
			label={translator.text("Delete draft (button)")}
			disabled={deleteMutation.isPending}
			loading={deleteMutation.isPending}
			buttonProps={{
				...buttonProps,
				ui: {
					justify: "start",
					items: "center",
					...buttonProps?.ui,
				},
			}}
			confirmProps={{
				...confirmProps,
				ui: {
					tone: "danger",
					theme: "light",
					justify: "start",
					items: "center",
					...confirmProps?.ui,
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
					...ui,
				},
				className,
			})}
			{...props}
		/>
	);
};
