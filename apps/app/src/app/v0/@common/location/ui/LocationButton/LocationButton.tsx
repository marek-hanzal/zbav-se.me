import { useQueryClient } from "@tanstack/react-query";
import type { StateType } from "@use-pico/common/type";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { withTransactionMessageLocationCreateMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user/message-thread";
import type { FC } from "react";
import { useState } from "react";
import { Content } from "./Content";
import { Sheet } from "./Sheet";
import { Trigger } from "./Trigger";

export namespace LocationButton {
	export interface Props extends Omit<Trigger.Props, "onOpen"> {
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

	const isOpenState: StateType.State<boolean> = {
		value: isOpen,
		set: setIsOpen,
	};
	const locationIdState: StateType.State<string | undefined | null> = {
		value: locationId,
		set: setLocationId,
	};
	const locationState: StateType.State<tLocation | undefined> = {
		value: location,
		set: setLocation,
	};

	return (
		<>
			<Trigger
				onOpen={() => {
					setIsOpen(true);
				}}
				{...props}
			/>

			<Sheet state={isOpenState}>
				<Content
					locationIdState={locationIdState}
					locationState={locationState}
					loading={mutation.isPending}
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
				/>
			</Sheet>
		</>
	);
};
