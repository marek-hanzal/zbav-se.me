import { ConfirmButton } from "@use-pico/client/ui/button";
import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionStatusAcceptMutation } from "@zbav-se.me/sdk/mutation/user";
import type { ChatInput } from "@zbav-se.me/ui/chat";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace AcceptButton {
	export interface Props extends ConfirmButton.Props {
		log: tListingTransactionLog;
		menuState: ChatInput.Menu.State;
	}
}

export const AcceptButton: FC<AcceptButton.Props> = ({ menuState, log, ...props }) => {
	const [, setIsMenu] = menuState;

	const acceptMutation = withListingTransactionStatusAcceptMutation.useMutation({
		async onPostMutation() {
			setIsMenu(false);
		},
	});

	return (
		<ConfirmButton
			iconEnabled={CheckIcon}
			iconPosition={"right"}
			size={"xl"}
			menu
			label={"Accept transaction (label)"}
			disabled={acceptMutation.isPending}
			loading={acceptMutation.isPending}
			confirmProps={{
				theme: "dark",
				onClick() {
					acceptMutation.mutate({
						listingTransactionId: log.listingTransactionId,
					});
				},
			}}
			{...props}
		/>
	);
};
