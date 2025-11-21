import { ConfirmButton } from "@use-pico/client/ui/button";
import { withListingTransactionPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace AcceptTransactionButton {
	export interface Props extends ConfirmButton.Props {
		listingTransactionId: string;
		onSuccess?: () => Promise<void>;
	}
}

export const AcceptTransactionButton: FC<AcceptTransactionButton.Props> = ({
	listingTransactionId,
	onSuccess,
	disabled,
	...props
}) => {
	const listingTransactionPatchMutation = withListingTransactionPatchMutation.useMutation({
		async onPostMutation() {
			return onSuccess?.();
		},
	});

	return (
		<ConfirmButton
			label={"Seller - Accept transaction (label)"}
			full
			size={"xl"}
			tone={"primary"}
			iconEnabled={CheckIcon}
			loading={listingTransactionPatchMutation.isPending}
			disabled={disabled || listingTransactionPatchMutation.isPending}
			confirmProps={{
				theme: "dark",
				onClick() {
					listingTransactionPatchMutation.mutate({
						id: listingTransactionId,
						status: "accepted",
						side: "seller",
					});
				},
			}}
			{...props}
		/>
	);
};
