import { useQueryClient } from "@tanstack/react-query";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import type { tTransaction } from "@zbav-se.me/sdk/api/user";
import { withTransactionMessageDateCreateMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { AgeIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { useState } from "react";
import { DateControl } from "~/app/date/ui/DateControl";

export namespace DateButton {
	export interface Props extends Button.Props {
		transaction: tTransaction;
	}
}

export const DateButton: FC<DateButton.Props> = ({ transaction, ...props }) => {
	const queryClient = useQueryClient();
	const [isOpen, setIsOpen] = useState(false);
	const mutation = withTransactionMessageDateCreateMutation.useMutation();

	return (
		<>
			<Button
				data-ui="DateButton[Button]"
				label={"Share date (button)"}
				iconEnabled={AgeIcon}
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
					title: "Share date (title)",
				})}
			>
				<DateControl
					data-ui="DateButton[DateControl]"
					onCancel={() => {
						setIsOpen(false);
					}}
					onSave={({ datetime }) => {
						return mutation.mutateAsync(
							{
								transactionId: transaction.id,
								datetime,
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
