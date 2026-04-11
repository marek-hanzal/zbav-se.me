import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { Tx } from "@/lib/client/tx";
import { ClearIcon } from "~/common/ui/icon";
import { withAgentStreamDeleteCollectionMutation } from "~/user/agent/mutation/withAgentStreamDeleteCollectionMutation";

export namespace ClearButton {
	export interface Props extends Button.Props {
		//
	}
}

export const ClearButton: FC<ClearButton.Props> = (props) => {
	const mutation = withAgentStreamDeleteCollectionMutation.useMutation();

	return (
		<Button
			iconEnabled={ClearIcon}
			onClick={() => {
				mutation.mutate({});
			}}
			loading={mutation.isPending}
			disabled={mutation.isPending}
			ui={{
				tone: "neutral",
				theme: "light",
				inner: "default",
				width: "content",
			}}
			{...props}
		>
			<Tx label={"Clear chat history (label)"} />
		</Button>
	);
};
