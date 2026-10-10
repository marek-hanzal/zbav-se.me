import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { uiSaveButtonFn } from "~/application-ui/fn/ui.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { withDraftQuery } from "~/seller-draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller-draft/schema/DraftSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { TrashIcon } from "~/ui/constant/TrashIcon";
import { ConfirmButton } from "~/ui/ui/ConfirmButton";

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
	const translator = useTranslator();
	const navigateFn = useNavigate();
	const locale = useLocale();
	const mutation = withDraftQuery.useDeleteMutation({
		async onPostMutationFn() {
			await navigateFn({
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
				"data-ui-text": "2xl",
			}}
			disabled={mutation.isPending}
			loading={mutation.isPending}
			buttonProps={{
				"data-ui-justify": "start",
				"data-ui-items": "center",
				...buttonProps,
			}}
			confirmProps={{
				"data-ui-tone": "danger",
				"data-ui-theme": "light",
				"data-ui-justify": "start",
				"data-ui-items": "center",
				...confirmProps,

				onClick() {
					mutation.mutate({
						where: {
							id: draft.id,
						},
					});
				},
				children: translator.textFn("Delete draft - confirm (button)"),
			}}
			{...uiSaveButtonFn({
				"data-ui-tone": "neutral",
				className,
			})}
			{...props}
		>
			<Tx label={"Delete draft (button)"} />
		</ConfirmButton>
	);
};
