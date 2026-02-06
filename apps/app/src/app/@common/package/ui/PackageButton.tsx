import { useQueryClient } from "@tanstack/react-query";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { withTransactionMessagePackageCreateMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user/message-thread";
import { SendPackageIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { useState } from "react";
import { PackageControl } from "~/app/@common/package/ui/PackageControl";

export namespace PackageButton {
	export interface Props extends Button.Props {
		transactionId: string;
		messageThreadId: string;
	}
}

export const PackageButton: FC<PackageButton.Props> = ({
	transactionId,
	messageThreadId,
	...props
}) => {
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
								transactionId,
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
