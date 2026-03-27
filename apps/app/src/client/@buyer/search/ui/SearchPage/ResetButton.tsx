import { useNavigate } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { RefreshIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { getFeedDefaultCreate } from "~/client/@buyer/feed/service/getFeedDefaultCreate";
import { withFeedQuery } from "~/client/@buyer/feed/withFeedQuery";

export namespace ResetButton {
	export interface Props extends Button.Props {
		feedId: string;
	}
}

export const ResetButton: FC<ResetButton.Props> = ({ feedId, ui, className, ...props }) => {
	const navigate = useNavigate();
	const locale = useLocale();
	const createMutation = withFeedQuery.useCreateMutation({
		async onPostMutation() {
			await navigate({
				to: "/$locale/app/buyer/search",
				params: {
					locale,
				},
			});
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
				ui: {
					text: "xl",
				},
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
			className={className}
			{...props}
		>
			<Tx label="Reset search (button)" />
		</Button>
	);
};
