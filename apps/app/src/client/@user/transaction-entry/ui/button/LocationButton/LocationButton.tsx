import type { FC } from "react";
import { useState } from "react";
import type { TransactionMenuButton } from "~/client/@user/transaction/ui/TransactionMenuButton";
import { withTransactionEntryQuery } from "~/client/@user/transaction-entry/query/withTransactionEntryQuery";
import type { LocationSchema } from "~/server/@session/location/schema/LocationSchema";
import { Content } from "./Content";
import { Sheet } from "./Sheet";
import { Trigger } from "./Trigger";

export namespace LocationButton {
	export interface Props extends Omit<Trigger.Props, "onOpen"> {
		close: TransactionMenuButton.Close;
		transactionId: string;
		onPostMutation?: () => Promise<void>;
	}
}

export const LocationButton: FC<LocationButton.Props> = ({
	close,
	transactionId,
	onPostMutation,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [locationId, setLocationId] = useState<string | undefined | null>(null);
	const [location, setLocation] = useState<LocationSchema.Type | undefined>(undefined);
	const mutation = withTransactionEntryQuery.useCreateMutation({
		invalidate: [
			"collection",
			"count",
		],
		async onPostMutation() {
			await onPostMutation?.();
			setIsOpen(false);
			close();
		},
	});

	return (
		<>
			<Trigger
				onOpen={() => {
					setIsOpen(true);
				}}
				{...props}
			/>

			<Sheet
				state={{
					value: isOpen,
					set: setIsOpen,
				}}
			>
				<Content
					locationIdState={{
						value: locationId,
						set: setLocationId,
					}}
					locationState={{
						value: location,
						set: setLocation,
					}}
					loading={mutation.isPending}
					onCancel={() => {
						setIsOpen(false);
					}}
					onSave={() => {
						if (!locationId || !location) {
							return;
						}

						mutation.mutate({
							transactionId,
							kind: "location",
							payload: {
								locationId,
							},
						});
					}}
				/>
			</Sheet>
		</>
	);
};
