import { useQueryClient } from "@tanstack/react-query";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import type { tTransaction } from "@zbav-se.me/sdk/api/user";
import { withTransactionMessagePersonalCreateMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { EmailIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { useState } from "react";
import { PersonalControl } from "~/app/personal/ui/PersonalControl";

export namespace PersonalButton {
	export interface Props extends Button.Props {
		transaction: tTransaction;
	}
}

export const PersonalButton: FC<PersonalButton.Props> = ({ transaction, ...props }) => {
	const queryClient = useQueryClient();
	const [isOpen, setIsOpen] = useState(false);
	const mutation = withTransactionMessagePersonalCreateMutation.useMutation();

	return (
		<>
			<Button
				data-ui="PersonalButton[Button]"
				label={"Share contact info (button)"}
				iconEnabled={EmailIcon}
				onClick={() => {
					setIsOpen(true);
				}}
				{...props}
			/>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				detent={"full"}
				withHeader
				header={() => ({
					title: "Share contact info (title)",
				})}
			>
				<PersonalControl
					data-ui="PersonalButton[PersonalControl]"
					onCancel={() => {
						setIsOpen(false);
					}}
					onSave={({ name, phone, email, locationId }) => {
						return mutation.mutateAsync(
							{
								transactionId: transaction.id,
								name,
								phone,
								email,
								locationId,
							},
							{
								onSuccess() {
									setIsOpen(false);
									withMessageThreadMessageCollectionQuery.invalidate(
										queryClient,
										{
											path: {
												messageThreadId: transaction.messageThreadId,
											},
										},
									);
								},
							},
						);
					}}
					loading={mutation.isPending}
					ui={{
						inner: "default",
					}}
				/>
			</BottomSheet>
		</>
	);
};
