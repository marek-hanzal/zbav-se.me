import { useQueryClient } from "@tanstack/react-query";
import type { FC } from "react";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import { getFeedDefaultCreateFn } from "~/buyer-feed/service/getFeedDefaultCreateFn";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { RefreshIcon } from "~/ui/constant/RefreshIcon";
import { Button } from "~/ui/ui/Button";

export namespace ResetButton {
	export interface Props extends Button.Props {
		feedId: string;
	}
}

export const ResetButton: FC<ResetButton.Props> = ({ feedId, className, ...props }) => {
	const queryClient = useQueryClient();
	const translator = useTranslator();
	const createMutation = withFeedQuery.useCreateMutation({
		async onPostMutationFn() {
			await withFeedQuery.invalidatorFn(queryClient, [
				"fetch",
			]);
		},
		invalidate: [],
	});
	const deleteMutation = withFeedQuery.useDeleteMutation({
		async onPostMutationFn() {
			await createMutation.mutateAsync(
				getFeedDefaultCreateFn(translator.textFn("Search (title)"), "search"),
			);
		},
		invalidate: [],
	});

	return (
		<Button
			data-ui={"ResetButton[Button]"}
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
