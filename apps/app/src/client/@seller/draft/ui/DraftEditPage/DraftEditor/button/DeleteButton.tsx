import { useNavigate } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { TrashIcon } from "@use-pico/client/icon";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { uiSaveButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";
import { withDraftQuery } from "~/client/@seller/draft/query/withDraftQuery";
import type { DraftSchema } from "~/server/@seller/draft/schema/DraftSchema";

export namespace DeleteButton {
	export interface Props extends ConfirmButton.Props {
		draft: DraftSchema.Type;
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
	const deleteMutation = withDraftQuery.useDeleteMutation({
		async onPostMutation() {
			await navigate({
				to: "/$locale/app/home",
				params: {
					locale,
				},
			});
		},
		invalidate: [
			"collection",
		],
	});

	return (
		<ConfirmButton
			iconEnabled={TrashIcon}
			iconProps={{
				ui: {
					text: "2xl",
				},
			}}
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
				onClick() {
					deleteMutation.mutate({
						where: {
							id: draft.id,
						},
					});
				},
				children: translator.text("Delete draft - confirm (button)"),
			}}
			{...uiSaveButton({
				ui: {
					tone: "neutral",
					...ui,
				},
				className,
			})}
			{...props}
		>
			<Tx label={"Delete draft (button)"} />
		</ConfirmButton>
	);
};
