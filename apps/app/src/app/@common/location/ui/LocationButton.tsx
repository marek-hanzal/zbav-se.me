import { useQueryClient } from "@tanstack/react-query";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import { withTransactionMessageLocationCreateMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user/message-thread";
import { LocationIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { useState } from "react";
import { LocationSelectContainer } from "~/app/@common/location/ui/LocationSelectContainer";

export namespace LocationButton {
	export interface Props extends Button.Props {
		transactionId: string;
		messageThreadId: string;
	}
}

export const LocationButton: FC<LocationButton.Props> = ({
	transactionId,
	messageThreadId,
	...props
}) => {
	const queryClient = useQueryClient();
	const [isOpen, setIsOpen] = useState(false);
	const mutation = withTransactionMessageLocationCreateMutation.useMutation();

	return (
		<>
			<Button
				data-ui="LocationButton[Button]"
				label={translator.text("Share location (button)")}
				iconEnabled={LocationIcon}
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
					title: "Share location (title)",
				})}
			>
				<LocationSelectContainer
					data-ui="LocationButton[LocationSelectContainer]"
					value={null}
					onCancel={() => {
						setIsOpen(false);
					}}
					onSave={({ locationId }) => {
						mutation.mutate(
							{
								transactionId,
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
					textHint={translator.text("Message location security (hint)")}
					ui={{
						inner: "default",
					}}
				/>
			</BottomSheet>
		</>
	);
};
