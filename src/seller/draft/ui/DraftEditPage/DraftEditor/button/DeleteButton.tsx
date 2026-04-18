import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { ConfirmButton } from "@/lib/client/button";
import { TrashIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { uiSaveButton } from "~/common/ui/ui";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";

export namespace DeleteButton {
	export interface Props extends ConfirmButton.Props {
		draft: DraftSchema.Type;
	}
}

export const DeleteButton: FC<DeleteButton.Props> = ({
	draft,
	buttonProps,
	confirmProps,
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
