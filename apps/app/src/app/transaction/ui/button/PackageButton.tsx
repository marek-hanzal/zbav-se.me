import { useQueryClient } from "@tanstack/react-query";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import type { tTransaction } from "@zbav-se.me/sdk/api/user";
import { withTransactionMessagePackageCreateMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { SendPackageIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { useState } from "react";
import { PackageControl } from "~/app/package/ui/PackageControl";

export namespace PackageButton {
	export interface Props extends Button.Props {
		transaction: tTransaction;
	}
}

export const PackageButton: FC<PackageButton.Props> = ({ transaction, ...props }) => {
	const queryClient = useQueryClient();
	const [isOpen, setIsOpen] = useState(false);
	const mutation = withTransactionMessagePackageCreateMutation.useMutation();

	return (
		<>
			<Button
				data-ui="PackageButton[Button]"
				label={"Share package (button)"}
				iconEnabled={SendPackageIcon}
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
					title: "Share package (title)",
				})}
			>
				<PackageControl
					data-ui="PackageButton[PackageControl]"
					onCancel={() => {
						setIsOpen(false);
					}}
					onSave={({ link, number }) => {
						return mutation.mutateAsync(
							{
								transactionId: transaction.id,
								link,
								number,
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
