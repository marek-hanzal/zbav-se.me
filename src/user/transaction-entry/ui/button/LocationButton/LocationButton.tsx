import type { FC } from "react";
import { useState } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { Button } from "@/lib/client/button";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translation";
import { CloseButton } from "~/common/ui/button";
import { LocationIcon } from "~/common/ui/icon";
import type { LocationSchema } from "~/session/location/server/schema/LocationSchema";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { withTransactionEntryQuery } from "~/user/transaction-entry/query/withTransactionEntryQuery";
import { Content } from "./Content";

export namespace LocationButton {
	export interface Props extends Button.Props {
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
				detent={"default"}
				withHeader
				header={({ close }) => ({
					title: translator.text("Share location (title)"),
					right: <CloseButton onClick={close} />,
				})}
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
			</BottomSheet>
		</>
	);
};
