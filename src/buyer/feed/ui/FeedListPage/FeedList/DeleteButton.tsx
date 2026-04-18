import type { FC } from "react";
import { ConfirmButton } from "@/lib/client/button";
import { TrashIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";

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
				"data-ui-text": "xl",
			}}
			buttonProps={{
				children: <Tx label="Delete feed (button)" />,
			}}
			confirmProps={{
				iconEnabled: TrashIcon,
				"data-ui-tone": "danger",
				"data-ui-theme": "light",
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
