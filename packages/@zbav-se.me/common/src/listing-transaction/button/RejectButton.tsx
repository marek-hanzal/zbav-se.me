import { ConfirmButton } from "@use-pico/client/ui/button";
import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionStatusRejectMutation } from "@zbav-se.me/sdk/mutation/user";
import { CancelIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace RejectButton {
	export interface Props extends ConfirmButton.Props {
		log: tListingTransactionLog;
	}
}

export const RejectButton: FC<RejectButton.Props> = ({ log, ...props }) => {
	const rejectMutation = withListingTransactionStatusRejectMutation.useMutation();

	return (
		<ConfirmButton
			iconEnabled={CancelIcon}
			iconPosition={"right"}
			size={"xl"}
			menu
			label={"Reject transaction (label)"}
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
