import { TrashIcon } from "@use-pico/client/icon";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";
import { withFeedQuery } from "~/client/@buyer/feed/query/withFeedQuery";

export namespace DeleteButton {
	export interface Props extends ConfirmButton.Props {
		feedId: string;
		onDelete?(): Promise<void>;
	}
}

export const DeleteButton: FC<DeleteButton.Props> = ({
	feedId,
	onDelete,
	confirmProps,
	ui,
	...props
}) => {
	const deleteMutation = withFeedQuery.useDeleteMutation({
		onPostMutation: onDelete,
		invalidate: [
			"collection",
			"count",
		],
	});

	return (
		<ConfirmButton
			data-action={"delete feed"}
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
					deleteMutation.mutate({
						where: {
							id: feedId,
						},
					});
				},
				...confirmProps,
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
				...ui,
			}}
			loading={deleteMutation.isPending}
			disabled={deleteMutation.isPending}
			{...props}
		/>
	);
};
