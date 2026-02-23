import { translator } from "@use-pico/common/translator";
import { useQueryClient } from "@tanstack/react-query";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { withTransactionMessagePersonalCreateMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user/message-thread";
import { EmailIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { useState } from "react";
import { PersonalControl } from "~/app/@common/personal/ui/PersonalControl";

export namespace PersonalButton {
	export interface Props extends Button.Props {
		transactionId: string;
		messageThreadId: string;
	}
}

export const PersonalButton: FC<PersonalButton.Props> = ({
	transactionId,
	messageThreadId,
	...props
}) => {
	const queryClient = useQueryClient();
	const [isOpen, setIsOpen] = useState(false);
	const mutation = withTransactionMessagePersonalCreateMutation.useMutation();

	return (
		<>
			<Button
				data-ui="PersonalButton[Button]"
				label={translator.text("Share contact info (button)")}
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
								transactionId,
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
												messageThreadId,
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
