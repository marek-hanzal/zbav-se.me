import { useNavigate } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { Icon, PlusIcon } from "@use-pico/client/icon";
import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";
import { ListItem } from "~/client/@common/list-item/ListItem";
import { withDraftQuery } from "~/client/@seller/draft/withDraftQuery";

export namespace CreateButton {
	export interface Props extends ListItem.PropsEx {
		//
	}
}

export const CreateButton: FC<CreateButton.Props> = ({ ...props }) => {
	const navigate = useNavigate();
	const locale = useLocale();
	const draftCreateMutation = withDraftQuery.useCreateMutation({
		async onPostMutation({ result }) {
			await navigate({
				to: "/$locale/app/seller/draft/$id/edit",
				params: {
					locale,
					id: result.id,
				},
			});
		},
		invalidate: [
			"collection",
			"count",
		],
	});

	return (
		<ListItem
			data-ui={"DraftCreateButton[Button]"}
			onClick={() => {
				draftCreateMutation.mutate({});
			}}
			hero={
				<Icon
					icon={PlusIcon}
					ui={{
						text: "2xl",
						color: "lead",
						opacity: "6",
					}}
				/>
			}
			title={
				<Tx
					label={"Create new draft (title)"}
					ui={{
						font: "bold",
					}}
				/>
			}
			bottom={
				<Tx
					label={"Create new draft (hint)"}
					ui={{
						text: "sm",
						opacity: "6",
					}}
				/>
			}
			{...props}
		/>
	);
};
