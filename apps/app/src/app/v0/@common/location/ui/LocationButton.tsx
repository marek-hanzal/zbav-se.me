import { useQueryClient } from "@tanstack/react-query";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { withTransactionMessageLocationCreateMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user/message-thread";
import { LocationIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { LocationSelect } from "~/app/@common/location/ui/LocationSelect";

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
	const [locationId, setLocationId] = useState<string | undefined | null>(null);
	const [location, setLocation] = useState<tLocation | undefined>(undefined);
	const mutation = withTransactionMessageLocationCreateMutation.useMutation();

	return (
		<>
			<Button
				data-ui="LocationButton[Button]"
				iconEnabled={LocationIcon}
				onClick={() => {
					setIsOpen(true);
				}}
				{...props}
			>
				<Tx label="Share location (button)" />
			</Button>

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
				<Container
					data-ui="LocationButton[LocationSelectContainer]"
					ui={{
						layout: "vertical-content-footer",
						height: "full",
						inner: "default",
					}}
				>
					<LocationSelect
						value={locationId}
						onLocation={setLocation}
						onChange={setLocationId}
						textHint={translator.text("Message location security (hint)")}
					/>

					<SaveContainer
						onCancel={() => {
							setIsOpen(false);
						}}
						onSave={() => {
							if (!locationId || !location) {
								return;
							}

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
						disabled={!locationId || !location}
					/>
				</Container>
			</BottomSheet>
		</>
	);
};
