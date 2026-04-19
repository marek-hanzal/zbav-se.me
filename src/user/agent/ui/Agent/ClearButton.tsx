import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { Tx } from "@/lib/client/tx";
import { ClearIcon } from "~/common/ui/icon";
import { withAgentStreamDeleteCollectionMutation } from "~/user/agent/mutation/withAgentStreamDeleteCollectionMutation";

export namespace ClearButton {
	export interface Props extends Button.Props {
		onSuccess(): Promise<void>;
	}
}

export const ClearButton: FC<ClearButton.Props> = ({ onSuccess, ...props }) => {
	const mutation = withAgentStreamDeleteCollectionMutation.useMutation({
		onSuccess,
	});

	return (
		<Button
			data-action={"clear conversation history"}
			iconEnabled={ClearIcon}
			onClick={(e) => {
				mutation.mutate({});
			}}
			loading={mutation.isPending}
			disabled={mutation.isPending}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-inner="default"
			data-ui-width="content"
			{...props}
		>
			<Tx label={"Clear chat history (label)"} />
		</Button>
	);
};
