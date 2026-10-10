import type { FC } from "react";
import { useState } from "react";
import { LocationIcon } from "~/application-ui/constant/icon.exports";
import { CloseButton } from "~/application-ui/ui/button.exports";
import type { LocationSchema } from "~/session-location/schema/LocationSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { BottomSheet } from "~/ui/ui/BottomSheet";
import { Button } from "~/ui/ui/Button";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";
import { withTransactionEntryQuery } from "~/user-transaction-entry/query/withTransactionEntryQuery";
import { Content } from "~/user-transaction-entry/ui/LocationButton/Content";

export namespace LocationButton {
	export interface Props extends Button.Props {
		closeFn: TransactionMenuButton.Close;
		transactionId: string;
		onPostMutationFn?: () => Promise<void>;
	}
}

export const LocationButton: FC<LocationButton.Props> = ({
	closeFn,
	transactionId,
	onPostMutationFn,
	...props
}) => {
	const translator = useTranslator();
	const [isOpen, setIsOpenFn] = useState(false);
	const [locationId, setLocationIdFn] = useState<string | undefined | null>(null);
	const [location, setLocationFn] = useState<LocationSchema.Type | undefined>(undefined);
	const mutation = withTransactionEntryQuery.useCreateMutation({
		invalidate: [
			"collection",
			"count",
		],
		async onPostMutationFn() {
			await onPostMutationFn?.();
			setIsOpenFn(false);
			closeFn();
		},
	});

	return (
		<>
			<Button
				data-ui="LocationButton[Button]"
				iconEnabled={LocationIcon}
				onClick={() => {
					setIsOpenFn(true);
				}}
				{...props}
			>
				<Tx label="Share location (button)" />
			</Button>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => {
					setIsOpenFn(false);
				}}
				detent={"default"}
				withHeader
				headerFn={({ closeFn }) => ({
					title: translator.textFn("Share location (title)"),
					right: <CloseButton onClick={closeFn} />,
				})}
			>
				<Content
					locationIdState={{
						value: locationId,
						setFn: setLocationIdFn,
					}}
					locationState={{
						value: location,
						setFn: setLocationFn,
					}}
					loading={mutation.isPending}
					onCancelFn={() => {
						setIsOpenFn(false);
					}}
					onSaveFn={() => {
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
