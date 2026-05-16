import { useQueryClient } from "@tanstack/react-query";
import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { RefreshIcon } from "@/lib/client/icon";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { getFeedDefaultCreate } from "~/buyer/feed/service/getFeedDefaultCreate";

export namespace ResetButton {
	export interface Props extends Button.Props {
		feedId: string;
	}
}

export const ResetButton: FC<ResetButton.Props> = ({ feedId, className, ...props }) => {
	const queryClient = useQueryClient();
	const translator = useTranslator();
	const createMutation = withFeedQuery.useCreateMutation({
		async onPostMutation() {
			await withFeedQuery.invalidator(queryClient, [
				"fetch",
			]);
		},
		invalidate: [],
	});
	const deleteMutation = withFeedQuery.useDeleteMutation({
		async onPostMutation() {
			await createMutation.mutateAsync(
				getFeedDefaultCreate(translator.text("Search (title)"), "search"),
			);
		},
		invalidate: [],
	});

	return (
		<Button
			data-ui={"ResetButton"}
			onClick={() => {
				deleteMutation.mutate({
					where: {
						id: feedId,
					},
				});
			}}
			disabled={deleteMutation.isPending || createMutation.isPending}
			loading={deleteMutation.isPending || createMutation.isPending}
			iconEnabled={RefreshIcon}
			iconProps={{
				"data-ui-text": "xl",
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
			className={className}
			{...props}
		>
			<Tx label="Reset search (button)" />
		</Button>
	);
};
