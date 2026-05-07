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
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-size="default"
			data-ui-justify="start"
			data-ui-items="center"
			data-ui-background="default"
			data-ui-round={undefined}
			data-ui-shadow={false}
			data-ui-border={false}
			data-ui-width="full"
			loading={deleteMutation.isPending}
			disabled={deleteMutation.isPending}
			{...props}
		/>
	);
};
