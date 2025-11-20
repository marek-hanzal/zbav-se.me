import { CheckIcon } from "@use-pico/client/icon";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { withListingTransactionPatchMutation } from "@zbav-se.me/sdk/mutation/user";
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
			loading={listingTransactionPatchMutation.isPending}
			disabled={listingTransactionPatchMutation.isPending}
			confirmProps={{
				theme: "dark",
				iconEnabled: CheckIcon,
				iconPosition: "right",
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
