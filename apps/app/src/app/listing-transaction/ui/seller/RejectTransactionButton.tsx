import { ConfirmButton } from "@use-pico/client/ui/button";
import { withListingTransactionPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { CancelIcon, QuestionIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace RejectTransactionButton {
	export interface Props extends ConfirmButton.Props {
		listingTransactionId: string;
		onSuccess?: () => Promise<void>;
	}
}

export const RejectTransactionButton: FC<RejectTransactionButton.Props> = ({
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
			label={"Seller - Reject transaction (label)"}
			full
			size={"xl"}
			tone={"danger"}
			iconEnabled={CancelIcon}
			loading={listingTransactionPatchMutation.isPending}
			disabled={disabled || listingTransactionPatchMutation.isPending}
			confirmProps={{
				theme: "dark",
				iconEnabled: QuestionIcon,
				onClick() {
					listingTransactionPatchMutation.mutate({
						id: listingTransactionId,
						status: "rejected",
						side: "seller",
					});
				},
			}}
			{...props}
		/>
	);
};
