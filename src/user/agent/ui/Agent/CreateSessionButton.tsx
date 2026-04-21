import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { MessageIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { withAgentThreadCreateSessionMutation } from "~/user/agent/mutation/withAgentThreadCreateSessionMutation";
import { withAgentLiveQuery } from "~/user/agent/query/withAgentLiveQuery";

export namespace CreateSessionButton {
	export interface Props extends Button.Props {
		onSuccess?(): Promise<void>;
	}
}

export const CreateSessionButton: FC<CreateSessionButton.Props> = ({ onSuccess, ...props }) => {
	const locale = useLocale();
	const liveQuery = withAgentLiveQuery.useSet();
	const navigate = useNavigate();
	const mutation = withAgentThreadCreateSessionMutation.useMutation({
		async onPostMutation({ result: thread }) {
			liveQuery(() => []);
			await navigate({
				to: "/$locale/app/agent/$threadId",
				params: {
					locale,
					threadId: thread.id,
				},
			});
			await onSuccess?.();
		},
	});

	return (
		<Button
			data-action={"create agent session"}
			iconEnabled={MessageIcon}
			iconProps={{
				"data-ui-text": "lg",
			}}
			onClick={() => {
				mutation.mutate({});
			}}
			loading={mutation.isPending}
			disabled={mutation.isPending}
			data-ui-tone="secondary"
			data-ui-theme="light"
			data-ui-badge="lg"
			{...props}
		>
			<Tx
				label={"Create new chat (label)"}
				data-ui-text={"lg"}
			/>
		</Button>
	);
};
