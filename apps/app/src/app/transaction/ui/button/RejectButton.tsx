import { ConfirmButton } from "@use-pico/client/ui/button";
import type { tTransactionLog } from "@zbav-se.me/sdk/api/user";
import { withTransactionStatusRejectMutation } from "@zbav-se.me/sdk/mutation/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import { CancelIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace RejectButton {
	export interface Props extends ConfirmButton.Props {
		menuState: ChatInput.Menu.State;
		log: tTransactionLog;
	}
}

export const RejectButton: FC<RejectButton.Props> = ({ menuState, log, ...props }) => {
	const [, setIsMenu] = menuState;

	const rejectMutation = withTransactionStatusRejectMutation.useMutation({
		async onPostMutation() {
			setIsMenu(false);
		},
	});

	return (
		<ConfirmButton
			iconEnabled={CancelIcon}
			label={"Reject transaction (label)"}
			disabled={rejectMutation.isPending}
			loading={rejectMutation.isPending}
			confirmProps={{
				ui: {
					theme: "dark",
				},
				onClick() {
					rejectMutation.mutate({
						transactionId: log.transactionId,
					});
				},
			}}
			ui={{
				tone: "primary",
				theme: "light",
				size: "xl",
				justify: "start",
			}}
			{...props}
		/>
	);
};
