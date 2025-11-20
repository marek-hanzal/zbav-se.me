import { ConfirmButton } from "@use-pico/client/ui/button";
import { withListingTransactionPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { QuestionIcon } from "@zbav-se.me/ui/icon";
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
			loading={listingTransactionPatchMutation.isPending}
			disabled={listingTransactionPatchMutation.isPending}
			confirmProps={{
				theme: "dark",
				iconEnabled: QuestionIcon,
				iconPosition: "right",
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
