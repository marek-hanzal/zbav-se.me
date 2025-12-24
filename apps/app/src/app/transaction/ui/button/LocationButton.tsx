import { useQueryClient } from "@tanstack/react-query";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import { withTransactionMessageLocationCreateMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/user/transaction";
import { LocationIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { useState } from "react";
import { LocationControl } from "~/app/location/ui/LocationControl";

export namespace LocationButton {
	export interface Props extends Button.Props {
		transactionId: string;
	}
}

export const LocationButton: FC<LocationButton.Props> = ({ transactionId, ...props }) => {
	const queryClient = useQueryClient();
	const [isOpen, setIsOpen] = useState(false);
	const mutation = withTransactionMessageLocationCreateMutation.useMutation();

	return (
		<withTransactionFetchQuery.Suspense
			data={{
				where: {
					id: transactionId,
				},
			}}
			fallback={
				<Button
					data-ui="LocationButton[Button]"
					label={"Share location (button)"}
					iconEnabled={LocationIcon}
					loading
					disabled
					{...props}
				/>
			}
		>
			{({ data: transaction }) => {
				if (transaction.status !== "open") {
					return null;
				}

				return (
					<>
						<Button
							data-ui="LocationButton[Button]"
							label={"Share location (button)"}
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
							<LocationControl
								data-ui="LocationButton[LocationControl]"
								value={null}
								onCancel={() => {
									setIsOpen(false);
								}}
								onSave={({ locationId }) => {
									mutation.mutate(
										{
											transactionId: transaction.id,
											locationId,
										},
										{
											onSuccess() {
												setIsOpen(false);
												withMessageThreadMessageCollectionQuery.invalidate(
													queryClient,
													{
														path: {
															messageThreadId:
																transaction.messageThreadId,
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
			}}
		</withTransactionFetchQuery.Suspense>
	);
};
