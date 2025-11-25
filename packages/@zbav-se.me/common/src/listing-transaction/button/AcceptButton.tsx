import { Button } from "@use-pico/client/ui/button";
import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionStatusAcceptMutation } from "@zbav-se.me/sdk/mutation/user";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace AcceptButton {
	export interface Props extends Button.Props {
		log: tListingTransactionLog;
	}
}

export const AcceptButton: FC<AcceptButton.Props> = ({ log, ...props }) => {
	const acceptMutation = withListingTransactionStatusAcceptMutation.useMutation();

	return (
		<Button
			iconEnabled={CheckIcon}
			size={"xl"}
			full
			label={"Accept transaction (label)"}
			disabled={acceptMutation.isPending}
			loading={acceptMutation.isPending}
			onClick={() => {
				acceptMutation.mutate({
					listingTransactionId: log.listingTransactionId,
				});
			}}
			{...props}
		/>
	);
};
