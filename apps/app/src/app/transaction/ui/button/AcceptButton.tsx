import { ConfirmButton } from "@use-pico/client/ui/button";
import type { tTransactionLog } from "@zbav-se.me/sdk/api/user";
import { withTransactionStatusAcceptMutation } from "@zbav-se.me/sdk/mutation/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace AcceptButton {
	export interface Props extends ConfirmButton.Props {
		log: tTransactionLog;
		menuState: ChatInput.Menu.State;
	}
}

export const AcceptButton: FC<AcceptButton.Props> = ({ menuState, log, ...props }) => {
	const [, setIsMenu] = menuState;

	const acceptMutation = withTransactionStatusAcceptMutation.useMutation({
		async onPostMutation() {
			setIsMenu(false);
		},
	});

	return (
		<ConfirmButton
			iconEnabled={CheckIcon}
			label={"Accept transaction (label)"}
			disabled={acceptMutation.isPending}
			loading={acceptMutation.isPending}
			confirmProps={{
				ui: {
					theme: "dark",
				},
				onClick() {
					acceptMutation.mutate({
						transactionId: log.transactionId,
					});
				},
			}}
			ui={{
				size: "xl",
				justify: "start",
			}}
			{...props}
		/>
	);
};
