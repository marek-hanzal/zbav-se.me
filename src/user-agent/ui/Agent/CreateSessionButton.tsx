import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { useLocale } from "~/locale/hook/useLocale";
import { Tx } from "~/translation/ui/Tx";
import { MessageIcon } from "~/ui/constant/MessageIcon";
import { Button } from "~/ui/ui/Button";
import { withAgentThreadCreateSessionMutation } from "~/user-agent/mutation/withAgentThreadCreateSessionMutation";
import { withAgentLiveQuery } from "~/user-agent/query/withAgentLiveQuery";

export namespace CreateSessionButton {
	export interface Props extends Button.Props {
		onSuccessFn?(): Promise<void>;
	}
}

export const CreateSessionButton: FC<CreateSessionButton.Props> = ({ onSuccessFn, ...props }) => {
	const locale = useLocale();
	const liveQueryFn = withAgentLiveQuery.useSet();
	const navigateFn = useNavigate();
	const mutation = withAgentThreadCreateSessionMutation.useMutation({
		async onPostMutationFn({ result: thread }) {
			liveQueryFn(() => [], {
				threadId: thread.id,
			});
			await navigateFn({
				to: "/$locale/app/agent/$threadId",
				params: {
					locale,
					threadId: thread.id,
				},
			});
			await onSuccessFn?.();
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
