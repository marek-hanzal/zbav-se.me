import { ConfirmButton } from "@use-pico/client/ui/button";
import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionStatusRejectMutation } from "@zbav-se.me/sdk/mutation/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import { CancelIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace RejectButton {
	export interface Props extends ConfirmButton.Props {
		menuState: ChatInput.Menu.State;
		log: tListingTransactionLog;
	}
}

export const RejectButton: FC<RejectButton.Props> = ({ menuState, log, ...props }) => {
	const [, setIsMenu] = menuState;

	const rejectMutation = withListingTransactionStatusRejectMutation.useMutation({
		async onPostMutation() {
			setIsMenu(false);
		},
	});

	return (
		<ConfirmButton
			iconEnabled={CancelIcon}
			size={"xl"}
			tone={"primary"}
			theme={"light"}
			label={"Reject transaction (label)"}
			justify={"start"}
			disabled={rejectMutation.isPending}
			loading={rejectMutation.isPending}
			confirmProps={{
				theme: "dark",
				onClick() {
					rejectMutation.mutate({
						listingTransactionId: log.listingTransactionId,
					});
				},
			}}
			{...props}
		/>
	);
};
